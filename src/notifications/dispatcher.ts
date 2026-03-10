// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Event-Driven Notification Dispatcher
//
//  Variant B routing:
//    GROUP  → shared HR group chat (TELEGRAM_GROUP_CHAT_ID)
//    PRIVATE → individual HR (telegram_chat_id from hr_users)
//
//  Idempotency:
//    Dedup key = `${event_type}:${candidate_id}:${recipient}:${date}`
//    Before sending, we check notification_log for an existing entry
//    with the same key and status "sent". If found, we skip.
//
//  All sends are logged to notification_log regardless of outcome.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DataStore } from "../storage/interfaces";
import type { HRUser, Lang, CreateInput, NotificationLog } from "../storage/types";
import type {
  NotificationPayload,
  NotificationEventType,
  CandidateStartedPayload,
  InactivityRiskPayload,
  BlockCompletedPayload,
  AssessmentCompletedPayload,
  ReportGeneratedPayload,
  ReportReadyPayload,
  CandidateShortlistedPayload,
  CriticalRedFlagsPayload,
  ResultSummaryPayload,
  PersonalDailyDigestPayload,
  TeamDailySummaryPayload,
} from "./events";
import { EVENT_ROUTING } from "./events";
import { getTelegramBot } from "./telegram/bot.client";
import {
  renderMessage,
  getBandLabel,
  interpolate,
  type TemplateKey,
} from "./templates";
import { nowISO } from "../storage/helpers/id";

// ─── Dispatcher ──────────────────────────────────────────────────────

export class NotificationDispatcher {
  private store: DataStore;
  private groupChatId: string;

  constructor(store: DataStore, groupChatId?: string) {
    this.store = store;
    this.groupChatId = groupChatId ?? process.env.TELEGRAM_GROUP_CHAT_ID ?? "";
  }

  /**
   * Main entry point: dispatches a notification event.
   * Handles routing, dedup, rendering, sending, and logging.
   */
  async dispatch(payload: NotificationPayload): Promise<void> {
    const eventType = payload.event_type;
    const routing = EVENT_ROUTING[eventType];
    if (!routing) {
      console.warn(`[dispatcher] Unknown event type: ${eventType}`);
      return;
    }

    const promises: Promise<void>[] = [];

    if (routing.includes("group")) {
      promises.push(this.sendToGroup(payload));
    }

    if (routing.includes("private")) {
      promises.push(this.sendToPrivate(payload));
    }

    await Promise.allSettled(promises);
  }

  // ─── Group Channel ─────────────────────────────────────────────

  private async sendToGroup(payload: NotificationPayload): Promise<void> {
    if (!this.groupChatId) {
      console.warn("[dispatcher] No TELEGRAM_GROUP_CHAT_ID configured — skipping group message");
      return;
    }

    // Group always receives messages in the default language (ru for ZIMA Dubai)
    const groupLang: Lang = (process.env.TELEGRAM_GROUP_LANGUAGE as Lang) ?? "ru";
    const { templateKey, vars } = this.resolveGroupTemplate(payload, groupLang);

    const dedupKey = this.buildDedupKey(payload.event_type, this.getCandidateId(payload), this.groupChatId);
    if (await this.isDuplicate(dedupKey)) return;

    const { subject, body } = renderMessage(groupLang, templateKey, vars);
    await this.sendAndLog(this.groupChatId, "group", payload.event_type, subject, body, payload, dedupKey);
  }

  // ─── Private Channel ───────────────────────────────────────────

  private async sendToPrivate(payload: NotificationPayload): Promise<void> {
    const hrId = this.getAssignedHrId(payload);
    if (!hrId) return;

    const hrUser = await this.store.hrUsers.findById(hrId);
    if (!hrUser || !hrUser.telegram_chat_id) {
      console.warn(`[dispatcher] HR ${hrId} has no telegram_chat_id — skipping private message`);
      return;
    }

    const lang = hrUser.language || "en";
    const { templateKey, vars } = this.resolvePrivateTemplate(payload, lang);

    const dedupKey = this.buildDedupKey(payload.event_type, this.getCandidateId(payload), hrUser.telegram_chat_id);
    if (await this.isDuplicate(dedupKey)) return;

    const { subject, body } = renderMessage(lang, templateKey, vars);
    await this.sendAndLog(hrUser.telegram_chat_id, hrUser.id, payload.event_type, subject, body, payload, dedupKey);
  }

  // ─── Send + Log ────────────────────────────────────────────────

  private async sendAndLog(
    chatId: string,
    recipientId: string,
    eventType: string,
    subject: string,
    body: string,
    payload: NotificationPayload,
    dedupKey: string,
  ): Promise<void> {
    const logEntry: CreateInput<NotificationLog> = {
      type: `${eventType}:${dedupKey}`,
      recipient_id: recipientId,
      channel: "telegram",
      subject,
      body,
      payload_json: JSON.stringify(payload),
      status: "pending",
      sent_at: "",
      error: "",
      retry_count: 0,
    };

    const logRecord = await this.store.notifications.create(logEntry);
    const bot = getTelegramBot();

    if (!bot.isConfigured) {
      console.log(`[dispatcher][mock] → ${chatId}: ${subject}`);
      console.log(`  ${body.slice(0, 120)}...`);
      await this.store.notifications.markSent(logRecord.id, nowISO());
      return;
    }

    try {
      await bot.sendMessage({ chat_id: chatId, text: body });
      await this.store.notifications.markSent(logRecord.id, nowISO());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[dispatcher] Failed to send to ${chatId}: ${errorMsg}`);
      await this.store.notifications.markFailed(logRecord.id, errorMsg);
    }
  }

  // ─── Deduplication ─────────────────────────────────────────────

  private buildDedupKey(eventType: string, candidateId: string, recipient: string): string {
    const dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return `${eventType}:${candidateId}:${recipient}:${dateKey}`;
  }

  private async isDuplicate(dedupKey: string): Promise<boolean> {
    const recent = await this.store.notifications.findRecent(200);
    return recent.some(
      (n) => n.type === dedupKey.split(":").slice(0, 1).join(":") + ":" + dedupKey && n.status === "sent",
    );
  }

  // ─── Template Resolution ───────────────────────────────────────

  private resolveGroupTemplate(
    payload: NotificationPayload,
    lang: Lang,
  ): { templateKey: TemplateKey; vars: Record<string, string | number> } {
    switch (payload.event_type) {
      case "assessment_completed":
        return {
          templateKey: "assessment_completed_group",
          vars: {
            candidate_name: payload.candidate_name,
            position: (payload as AssessmentCompletedPayload).position,
            duration_minutes: (payload as AssessmentCompletedPayload).duration_minutes,
          },
        };

      case "report_generated":
        return {
          templateKey: "report_generated_group",
          vars: {
            candidate_name: payload.candidate_name,
            report_url: (payload as ReportGeneratedPayload).report_url,
            overall_band_label: getBandLabel(lang, (payload as ReportGeneratedPayload).overall_band),
          },
        };

      case "candidate_shortlisted":
        return {
          templateKey: "candidate_shortlisted",
          vars: {
            candidate_name: payload.candidate_name,
            overall_score: (payload as CandidateShortlistedPayload).overall_score,
            overall_band_label: getBandLabel(lang, (payload as CandidateShortlistedPayload).overall_band),
            recommended_role: (payload as CandidateShortlistedPayload).recommended_role,
          },
        };

      case "critical_red_flags": {
        const p = payload as CriticalRedFlagsPayload;
        return {
          templateKey: "critical_red_flags",
          vars: {
            candidate_name: p.candidate_name,
            flags_list: p.flags.map((f) => `  🔸 ${f}`).join("\n"),
            overall_band_label: getBandLabel(lang, p.overall_band),
          },
        };
      }

      case "team_daily_summary": {
        const p = payload as TeamDailySummaryPayload;
        const topList = p.top_candidates.length > 0
          ? "🏆 <b>Top candidates:</b>\n" +
            p.top_candidates.map((c, i) => `  ${i + 1}. ${c.name} — ${c.score}/100 (${c.band})`).join("\n")
          : "";
        return {
          templateKey: "team_daily_summary",
          vars: {
            date: p.date,
            total_active: p.total_active,
            completed_today: p.completed_today,
            reports_generated: p.reports_generated,
            shortlisted_today: p.shortlisted_today,
            red_flags_today: p.red_flags_today,
            top_candidates_list: topList,
          },
        };
      }

      default:
        return { templateKey: "assessment_completed_group", vars: { candidate_name: "Unknown" } };
    }
  }

  private resolvePrivateTemplate(
    payload: NotificationPayload,
    lang: Lang,
  ): { templateKey: TemplateKey; vars: Record<string, string | number> } {
    switch (payload.event_type) {
      case "candidate_started": {
        const p = payload as CandidateStartedPayload;
        return {
          templateKey: "candidate_started",
          vars: {
            candidate_name: p.candidate_name,
            position: p.position,
            language: p.language === "ru" ? "Русский" : "English",
            timestamp: formatTime(p.timestamp),
          },
        };
      }

      case "inactivity_risk": {
        const p = payload as InactivityRiskPayload;
        return {
          templateKey: "inactivity_risk",
          vars: {
            candidate_name: p.candidate_name,
            minutes_inactive: p.minutes_inactive,
            current_block: p.current_block,
            last_active: formatTime(p.last_active),
          },
        };
      }

      case "block_completed": {
        const p = payload as BlockCompletedPayload;
        return {
          templateKey: "block_completed",
          vars: {
            candidate_name: p.candidate_name,
            block_label: p.block_label,
            blocks_remaining: p.blocks_remaining,
          },
        };
      }

      case "assessment_completed": {
        const p = payload as AssessmentCompletedPayload;
        return {
          templateKey: "assessment_completed_private",
          vars: {
            candidate_name: p.candidate_name,
            position: p.position,
            duration_minutes: p.duration_minutes,
          },
        };
      }

      case "report_ready": {
        const p = payload as ReportReadyPayload;
        return {
          templateKey: "report_ready",
          vars: {
            candidate_name: p.candidate_name,
            report_url: p.report_url,
          },
        };
      }

      case "report_generated": {
        const p = payload as ReportGeneratedPayload;
        return {
          templateKey: "report_ready",
          vars: {
            candidate_name: p.candidate_name,
            report_url: p.report_url,
          },
        };
      }

      case "result_summary": {
        const p = payload as ResultSummaryPayload;
        const strengthsList = p.strengths.slice(0, 3).map((s) => `  ✦ ${s}`).join("\n");
        const risksList = p.risks.slice(0, 2).map((r) => `  ⚡ ${r}`).join("\n");
        return {
          templateKey: "result_summary",
          vars: {
            candidate_name: p.candidate_name,
            position: p.position,
            overall_score: p.overall_score,
            overall_band_label: getBandLabel(lang, p.overall_band),
            recommended_role: p.recommended_role,
            secondary_role: p.secondary_role,
            strengths_list: strengthsList || "  —",
            risks_list: risksList || "  —",
            report_url: p.report_url,
          },
        };
      }

      case "personal_daily_digest": {
        const p = payload as PersonalDailyDigestPayload;
        const entriesList = p.entries.length > 0
          ? p.entries.map((e) => {
              const status = e.overall_band
                ? `${getBandLabel(lang, e.overall_band)} (${e.overall_score}/100)`
                : e.status;
              return `  • ${e.candidate_name} — ${status}`;
            }).join("\n")
          : lang === "ru" ? "  Нет активных кандидатов" : "  No active candidates";
        return {
          templateKey: "personal_daily_digest",
          vars: {
            date: p.date,
            hr_name: p.hr_name,
            total_active: p.total_active,
            total_completed_today: p.total_completed_today,
            entries_list: entriesList,
          },
        };
      }

      default:
        return { templateKey: "candidate_started", vars: { candidate_name: "Unknown" } };
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────

  private getCandidateId(payload: NotificationPayload): string {
    if ("candidate_id" in payload) return payload.candidate_id;
    if ("hr_id" in payload) return (payload as PersonalDailyDigestPayload).hr_id;
    return "system";
  }

  private getAssignedHrId(payload: NotificationPayload): string {
    if ("assigned_hr_id" in payload) return payload.assigned_hr_id;
    if ("hr_id" in payload) return (payload as PersonalDailyDigestPayload).hr_id;
    return "";
  }
}

function formatTime(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}
