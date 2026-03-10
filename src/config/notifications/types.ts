// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram Notification Template Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TelegramTemplate {
  /** Short subject / title (used for logs, not always shown in Telegram) */
  readonly subject: string;
  /** Telegram HTML body with {placeholder} interpolation tokens */
  readonly body: string;
}

// ─── Group Template Keys ────────────────────────────────────────────

export type GroupTemplateKey =
  | "candidate_completed_full_assessment"
  | "report_generated"
  | "shortlist_candidate"
  | "critical_red_flags"
  | "team_daily_summary";

// ─── Private Template Keys ──────────────────────────────────────────

export type PrivateTemplateKey =
  | "candidate_started"
  | "candidate_inactivity_risk"
  | "disc_completed"
  | "zima_completed"
  | "ritchie_completed"
  | "assessment_completed"
  | "report_ready"
  | "result_summary_short"
  | "personal_daily_digest"
  | "follow_up_required";

// ─── Registration Template Keys ─────────────────────────────────────

export type RegistrationTemplateKey =
  | "registration_success"
  | "registration_unknown"
  | "registration_already_linked";

export type AnyTemplateKey = GroupTemplateKey | PrivateTemplateKey | RegistrationTemplateKey;

// ─── Extended Band Labels ───────────────────────────────────────────

export type ExtendedBandId =
  | "strong_fit"
  | "conditional_fit"
  | "high_risk"
  | "shortlist"
  | "interview_with_caution"
  | "reject"
  | "reserve_pool"
  | "strong_hire"
  | "recommended"
  | "conditional"
  | "not_recommended";

// ─── Full Dictionary ────────────────────────────────────────────────

export interface TelegramTemplateDictionary {
  readonly lang: "en" | "ru";

  readonly group: Record<GroupTemplateKey, TelegramTemplate>;
  readonly private: Record<PrivateTemplateKey, TelegramTemplate>;
  readonly registration: Record<RegistrationTemplateKey, TelegramTemplate>;

  readonly bandLabels: Record<ExtendedBandId, string>;
}

// ─── Dynamic Fields (documentation type) ────────────────────────────

export interface TemplateDynamicFields {
  hr_name?: string;
  candidate_name?: string;
  applied_role?: string;
  position?: string;
  language?: string;
  overall_band?: string;
  overall_band_label?: string;
  overall_score?: number;
  final_recommendation?: string;
  primary_role?: string;
  secondary_role?: string;
  top_strength_1?: string;
  top_strength_2?: string;
  top_strength_3?: string;
  risk_1?: string;
  risk_2?: string;
  report_url?: string;
  block_label?: string;
  blocks_remaining?: number;
  duration_minutes?: number;
  minutes_inactive?: number;
  current_block?: string;
  last_active?: string;
  timestamp?: string;
  date?: string;
  flags_list?: string;
  entries_list?: string;
  strengths_list?: string;
  risks_list?: string;
  top_candidates_list?: string;
  invited_today?: number;
  started_today?: number;
  completed_today?: number;
  timed_out_today?: number;
  shortlisted_today?: number;
  rejected_today?: number;
  pending_action_today?: number;
  total_active?: number;
  total_completed_today?: number;
  reports_generated?: number;
  red_flags_today?: number;
  email?: string;
  action_items?: string;
}
