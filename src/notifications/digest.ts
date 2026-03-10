// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Daily Digest Generator
//
//  Produces two kinds of digests:
//    1. Personal digest — per HR, covering their assigned candidates
//    2. Team summary   — for the shared group chat, aggregated stats
//
//  Designed to run once daily (via cron, Vercel cron, or manual trigger).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DataStore } from "../storage/interfaces";
import type { Candidate, HRUser, ScoreRecord, ScoreBand } from "../storage/types";
import type {
  PersonalDailyDigestPayload,
  TeamDailySummaryPayload,
  DailyDigestEntry,
} from "./events";
import { NotificationDispatcher } from "./dispatcher";
import { nowISO } from "../storage/helpers/id";

export class DigestGenerator {
  private store: DataStore;
  private dispatcher: NotificationDispatcher;

  constructor(store: DataStore, dispatcher: NotificationDispatcher) {
    this.store = store;
    this.dispatcher = dispatcher;
  }

  /**
   * Generates and sends all daily digests.
   * Call this once per day.
   */
  async generateAll(): Promise<{
    personalSent: number;
    teamSent: boolean;
  }> {
    const today = new Date().toISOString().slice(0, 10);

    // Send personal digests to each HR with telegram
    const personalSent = await this.sendPersonalDigests(today);

    // Send team summary to the group
    const teamSent = await this.sendTeamSummary(today);

    return { personalSent, teamSent };
  }

  // ─── Personal Digest ──────────────────────────────────────────

  private async sendPersonalDigests(date: string): Promise<number> {
    const hrUsers = await this.store.hrUsers.findWithTelegram();
    let sent = 0;

    for (const hr of hrUsers) {
      try {
        const digest = await this.buildPersonalDigest(hr, date);
        if (digest) {
          await this.dispatcher.dispatch(digest);
          sent++;
        }
      } catch (err) {
        console.error(`[digest] Failed to send personal digest to ${hr.id}:`, err);
      }
    }

    return sent;
  }

  private async buildPersonalDigest(
    hr: HRUser,
    date: string,
  ): Promise<PersonalDailyDigestPayload | null> {
    // Find all candidates assigned to this HR
    const allCandidates = await this.store.candidates.findAll();
    const myCandidates = allCandidates.filter(
      (c) => c.invited_by === hr.id && !c.archived_at,
    );

    if (myCandidates.length === 0) return null;

    const entries: DailyDigestEntry[] = [];
    let completedToday = 0;

    for (const cand of myCandidates) {
      const entry = await this.buildDigestEntry(cand, date);
      entries.push(entry);
      if (entry.latest_event === "completed_today") completedToday++;
    }

    // Sort: completed today first, then in_progress, then invited
    const statusOrder: Record<string, number> = {
      completed_today: 0,
      in_progress: 1,
      invited: 2,
      completed: 3,
    };
    entries.sort((a, b) =>
      (statusOrder[a.latest_event] ?? 9) - (statusOrder[b.latest_event] ?? 9),
    );

    const activeCandidates = myCandidates.filter(
      (c) => c.status === "in_progress" || c.status === "invited",
    );

    return {
      event_type: "personal_daily_digest",
      hr_id: hr.id,
      hr_name: hr.full_name,
      date,
      entries,
      total_active: activeCandidates.length,
      total_completed_today: completedToday,
      timestamp: nowISO(),
    };
  }

  private async buildDigestEntry(
    cand: Candidate,
    today: string,
  ): Promise<DailyDigestEntry> {
    // Check if completed today
    const sessions = await this.store.sessions.findByCandidateId(cand.id);
    const completedSession = sessions.find(
      (s) => s.status === "completed" && s.completed_at.startsWith(today),
    );

    // Get score if available
    let overallBand: ScoreBand | undefined;
    let overallScore: number | undefined;

    if (cand.status === "completed") {
      const scores = await this.store.scores.findByCandidateId(cand.id);
      const finalScore = scores.find((s) => s.block_id === "final");
      if (finalScore) {
        overallBand = finalScore.band;
        overallScore = finalScore.overall_score;
      }
    }

    let latestEvent: string;
    if (completedSession) {
      latestEvent = "completed_today";
    } else if (cand.status === "in_progress") {
      latestEvent = "in_progress";
    } else if (cand.status === "completed") {
      latestEvent = "completed";
    } else {
      latestEvent = cand.status;
    }

    return {
      candidate_name: cand.full_name,
      candidate_id: cand.id,
      status: cand.status,
      latest_event: latestEvent,
      overall_band: overallBand,
      overall_score: overallScore,
    };
  }

  // ─── Team Summary ─────────────────────────────────────────────

  private async sendTeamSummary(date: string): Promise<boolean> {
    try {
      const summary = await this.buildTeamSummary(date);
      await this.dispatcher.dispatch(summary);
      return true;
    } catch (err) {
      console.error("[digest] Failed to send team summary:", err);
      return false;
    }
  }

  private async buildTeamSummary(date: string): Promise<TeamDailySummaryPayload> {
    const allCandidates = await this.store.candidates.findAll();
    const active = allCandidates.filter(
      (c) => !c.archived_at && (c.status === "in_progress" || c.status === "invited"),
    );

    // Completed today
    const allSessions = await this.store.sessions.findAll();
    const completedToday = allSessions.filter(
      (s) => s.status === "completed" && s.completed_at.startsWith(date),
    ).length;

    // Reports generated today
    const allReports = await this.store.reports.findAll();
    const reportsToday = allReports.filter(
      (r) => r.status === "ready" && r.generated_at.startsWith(date),
    ).length;

    // Scores: shortlisted + red flags
    const allScores = await this.store.scores.findAll();
    const todaysScores = allScores.filter(
      (s) => s.block_id === "final" && s.created_at.startsWith(date),
    );

    const shortlisted = todaysScores.filter(
      (s) => s.band === "strong_hire" || s.band === "recommended",
    ).length;

    const redFlags = todaysScores.filter(
      (s) => s.band === "not_recommended",
    ).length;

    // Top candidates by score
    const topCandidates = todaysScores
      .sort((a, b) => b.overall_score - a.overall_score)
      .slice(0, 3)
      .map((s) => {
        const cand = allCandidates.find((c) => c.id === s.candidate_id);
        return {
          name: cand?.full_name ?? s.candidate_id,
          score: s.overall_score,
          band: s.band,
        };
      });

    return {
      event_type: "team_daily_summary",
      date,
      total_active: active.length,
      completed_today: completedToday,
      reports_generated: reportsToday,
      shortlisted_today: shortlisted,
      red_flags_today: redFlags,
      top_candidates: topCandidates,
      timestamp: nowISO(),
    };
  }
}
