// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram Template Renderer
//
//  Pure, deterministic: (templateKey, lang, vars) → rendered message
//
//  Resolves the correct dictionary, finds the template, interpolates
//  all {placeholder} tokens, and returns { subject, body }.
//
//  Uses the config-driven dictionaries from /src/config/notifications/
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  TelegramTemplateDictionary,
  TelegramTemplate,
  AnyTemplateKey,
  GroupTemplateKey,
  PrivateTemplateKey,
  RegistrationTemplateKey,
  ExtendedBandId,
} from "@/config/notifications/types";

import { telegramEN } from "@/config/notifications/telegram.en";
import { telegramRU } from "@/config/notifications/telegram.ru";

// ─── Dictionary Access ──────────────────────────────────────────────

const DICTIONARIES: Record<string, TelegramTemplateDictionary> = {
  en: telegramEN,
  ru: telegramRU,
};

export function getTelegramDict(lang: "en" | "ru" = "en"): TelegramTemplateDictionary {
  return DICTIONARIES[lang] ?? telegramEN;
}

// ─── Template Lookup ────────────────────────────────────────────────

const GROUP_KEYS = new Set<string>([
  "candidate_completed_full_assessment",
  "report_generated",
  "shortlist_candidate",
  "critical_red_flags",
  "team_daily_summary",
]);

const PRIVATE_KEYS = new Set<string>([
  "candidate_started",
  "candidate_inactivity_risk",
  "disc_completed",
  "zima_completed",
  "ritchie_completed",
  "assessment_completed",
  "report_ready",
  "result_summary_short",
  "personal_daily_digest",
  "follow_up_required",
]);

const REGISTRATION_KEYS = new Set<string>([
  "registration_success",
  "registration_unknown",
  "registration_already_linked",
]);

function lookupTemplate(
  dict: TelegramTemplateDictionary,
  key: AnyTemplateKey,
): TelegramTemplate | null {
  if (GROUP_KEYS.has(key)) return dict.group[key as GroupTemplateKey] ?? null;
  if (PRIVATE_KEYS.has(key)) return dict.private[key as PrivateTemplateKey] ?? null;
  if (REGISTRATION_KEYS.has(key)) return dict.registration[key as RegistrationTemplateKey] ?? null;
  return null;
}

// ─── Interpolation ──────────────────────────────────────────────────

/**
 * Replaces {placeholder} tokens with values from `vars`.
 * Unmatched tokens are left as-is (safe for partial rendering).
 */
export function interpolate(
  template: string,
  vars: Record<string, string | number | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const val = vars[key];
    if (val === undefined || val === null) return match;
    return String(val);
  });
}

// ─── Band Label Resolution ──────────────────────────────────────────

export function getBandLabel(lang: "en" | "ru", bandId: string): string {
  const dict = getTelegramDict(lang);
  return dict.bandLabels[bandId as ExtendedBandId] ?? bandId;
}

// ─── Main Render Function ───────────────────────────────────────────

export interface RenderedMessage {
  subject: string;
  body: string;
}

/**
 * Renders a Telegram message from a template key and dynamic variables.
 *
 * @param key     - Template identifier (group, private, or registration)
 * @param lang    - "en" or "ru"
 * @param vars    - Dynamic field values to interpolate
 * @returns       - Rendered { subject, body } or null if template not found
 */
export function renderTelegramTemplate(
  key: AnyTemplateKey,
  lang: "en" | "ru",
  vars: Record<string, string | number | undefined>,
): RenderedMessage | null {
  const dict = getTelegramDict(lang);
  const tpl = lookupTemplate(dict, key);

  if (!tpl) {
    console.warn(`[renderTelegramTemplate] Template not found: ${key} (${lang})`);
    return null;
  }

  return {
    subject: interpolate(tpl.subject, vars),
    body: interpolate(tpl.body, vars),
  };
}

// ─── Convenience: Render with Auto Band Label ───────────────────────

/**
 * Same as renderTelegramTemplate but automatically resolves
 * {overall_band_label} from an `overall_band` value if present in vars.
 */
export function renderWithBandLabel(
  key: AnyTemplateKey,
  lang: "en" | "ru",
  vars: Record<string, string | number | undefined>,
): RenderedMessage | null {
  const enriched = { ...vars };

  if (vars.overall_band && !vars.overall_band_label) {
    enriched.overall_band_label = getBandLabel(lang, String(vars.overall_band));
  }

  return renderTelegramTemplate(key, lang, enriched);
}

// ─── Convenience: Render Result Summary ─────────────────────────────

export interface ResultSummaryInput {
  candidate_name: string;
  applied_role: string;
  overall_score: number;
  overall_band: string;
  primary_role: string;
  secondary_role: string;
  strengths: string[];
  risks: string[];
  report_url: string;
}

/**
 * Renders the `result_summary_short` private template with
 * structured strengths/risks arrays automatically sliced and mapped.
 */
export function renderResultSummary(
  lang: "en" | "ru",
  input: ResultSummaryInput,
): RenderedMessage | null {
  const s = input.strengths;
  const r = input.risks;

  return renderWithBandLabel("result_summary_short", lang, {
    candidate_name: input.candidate_name,
    applied_role: input.applied_role,
    overall_score: input.overall_score,
    overall_band: input.overall_band,
    primary_role: input.primary_role,
    secondary_role: input.secondary_role,
    top_strength_1: s[0] ?? "—",
    top_strength_2: s[1] ?? "—",
    top_strength_3: s[2] ?? "—",
    risk_1: r[0] ?? "—",
    risk_2: r[1] ?? "—",
    report_url: input.report_url,
  });
}

// ─── Convenience: Render Daily Digest ───────────────────────────────

export interface DigestEntry {
  candidate_name: string;
  status: string;
  score?: number;
  band?: string;
}

export interface DailyDigestInput {
  hr_name: string;
  date: string;
  total_active: number;
  completed_today: number;
  pending_action_today: number;
  entries: DigestEntry[];
}

/**
 * Renders the `personal_daily_digest` private template with
 * structured entries formatted into a readable list.
 */
export function renderDailyDigest(
  lang: "en" | "ru",
  input: DailyDigestInput,
): RenderedMessage | null {
  const entriesList = input.entries.length > 0
    ? input.entries.map((e) => {
        const detail = e.score !== undefined
          ? `${getBandLabel(lang, e.band ?? "")} (${e.score}/100)`
          : e.status;
        return `  - ${e.candidate_name} — ${detail}`;
      }).join("\n")
    : lang === "ru" ? "  Нет активных кандидатов" : "  No active candidates";

  return renderTelegramTemplate("personal_daily_digest", lang, {
    hr_name: input.hr_name,
    date: input.date,
    total_active: input.total_active,
    completed_today: input.completed_today,
    pending_action_today: input.pending_action_today,
    entries_list: entriesList,
  });
}

// ─── Convenience: Render Team Summary ───────────────────────────────

export interface TeamSummaryCandidate {
  name: string;
  score: number;
  band: string;
}

export interface TeamSummaryInput {
  date: string;
  invited_today: number;
  started_today: number;
  completed_today: number;
  timed_out_today: number;
  shortlisted_today: number;
  rejected_today: number;
  pending_action_today: number;
  top_candidates: TeamSummaryCandidate[];
}

/**
 * Renders the `team_daily_summary` group template with
 * structured top candidates formatted into a ranked list.
 */
export function renderTeamSummary(
  lang: "en" | "ru",
  input: TeamSummaryInput,
): RenderedMessage | null {
  const header = lang === "ru" ? "<b>Лучшие кандидаты:</b>" : "<b>Top candidates:</b>";
  const topList = input.top_candidates.length > 0
    ? header + "\n" + input.top_candidates.map((c, i) =>
        `  ${i + 1}. ${c.name} — ${c.score}/100 (${getBandLabel(lang, c.band)})`
      ).join("\n")
    : "";

  return renderTelegramTemplate("team_daily_summary", lang, {
    date: input.date,
    invited_today: input.invited_today,
    started_today: input.started_today,
    completed_today: input.completed_today,
    timed_out_today: input.timed_out_today,
    shortlisted_today: input.shortlisted_today,
    rejected_today: input.rejected_today,
    pending_action_today: input.pending_action_today,
    top_candidates_list: topList,
  });
}
