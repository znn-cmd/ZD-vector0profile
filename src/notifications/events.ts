// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Notification Event Definitions
//
//  Variant B routing:
//    GROUP  = shared HR group chat (concise key events)
//    PRIVATE = individual HR (detailed, assigned candidates only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Lang, ScoreBand } from "../storage/types";

// ─── Event Type Registry ─────────────────────────────────────────────

export type GroupEventType =
  | "assessment_completed"       // candidate finished all 3 blocks
  | "report_generated"           // PDF report ready
  | "candidate_shortlisted"      // strong_hire or recommended
  | "critical_red_flags"         // engine flagged critical issues
  | "team_daily_summary";        // aggregated team digest

export type PrivateEventType =
  | "candidate_started"          // candidate opened assessment
  | "inactivity_risk"            // no activity for threshold period
  | "block_completed"            // single block finished
  | "assessment_completed"       // candidate finished all 3 blocks
  | "report_ready"               // PDF available for download
  | "result_summary"             // compact scoring summary
  | "personal_daily_digest";     // HR's daily digest

export type NotificationEventType = GroupEventType | PrivateEventType;

// ─── Routing ─────────────────────────────────────────────────────────

export type NotificationTarget = "group" | "private";

/**
 * Which events go to which channel.
 * Some events go to both (e.g. assessment_completed).
 */
export const EVENT_ROUTING: Record<NotificationEventType, NotificationTarget[]> = {
  // Group-only
  candidate_shortlisted:  ["group"],
  critical_red_flags:     ["group"],
  team_daily_summary:     ["group"],

  // Private-only
  candidate_started:      ["private"],
  inactivity_risk:        ["private"],
  block_completed:        ["private"],
  report_ready:           ["private"],
  result_summary:         ["private"],
  personal_daily_digest:  ["private"],

  // Both
  assessment_completed:   ["group", "private"],
  report_generated:       ["group", "private"],
};

// ─── Event Payloads ──────────────────────────────────────────────────

export interface BaseEventPayload {
  event_type: NotificationEventType;
  candidate_id: string;
  candidate_name: string;
  /** HR user ID who owns this candidate */
  assigned_hr_id: string;
  timestamp: string;
}

export interface CandidateStartedPayload extends BaseEventPayload {
  event_type: "candidate_started";
  position: string;
  language: Lang;
}

export interface InactivityRiskPayload extends BaseEventPayload {
  event_type: "inactivity_risk";
  last_active: string;
  minutes_inactive: number;
  current_block: string;
}

export interface BlockCompletedPayload extends BaseEventPayload {
  event_type: "block_completed";
  block_id: string;
  block_label: string;
  blocks_remaining: number;
}

export interface AssessmentCompletedPayload extends BaseEventPayload {
  event_type: "assessment_completed";
  position: string;
  duration_minutes: number;
}

export interface ReportGeneratedPayload extends BaseEventPayload {
  event_type: "report_generated";
  report_url: string;
  overall_band: ScoreBand;
}

export interface ReportReadyPayload extends BaseEventPayload {
  event_type: "report_ready";
  report_url: string;
}

export interface CandidateShortlistedPayload extends BaseEventPayload {
  event_type: "candidate_shortlisted";
  overall_score: number;
  overall_band: ScoreBand;
  recommended_role: string;
}

export interface CriticalRedFlagsPayload extends BaseEventPayload {
  event_type: "critical_red_flags";
  flags: string[];
  overall_band: ScoreBand;
}

export interface ResultSummaryPayload extends BaseEventPayload {
  event_type: "result_summary";
  position: string;
  overall_score: number;
  overall_band: ScoreBand;
  recommended_role: string;
  secondary_role: string;
  strengths: string[];
  risks: string[];
  report_url: string;
}

export interface DailyDigestEntry {
  candidate_name: string;
  candidate_id: string;
  status: string;
  latest_event: string;
  overall_band?: ScoreBand;
  overall_score?: number;
}

export interface PersonalDailyDigestPayload {
  event_type: "personal_daily_digest";
  hr_id: string;
  hr_name: string;
  date: string;
  entries: DailyDigestEntry[];
  total_active: number;
  total_completed_today: number;
  timestamp: string;
}

export interface TeamDailySummaryPayload {
  event_type: "team_daily_summary";
  date: string;
  total_active: number;
  completed_today: number;
  reports_generated: number;
  shortlisted_today: number;
  red_flags_today: number;
  top_candidates: { name: string; score: number; band: string }[];
  timestamp: string;
}

export type NotificationPayload =
  | CandidateStartedPayload
  | InactivityRiskPayload
  | BlockCompletedPayload
  | AssessmentCompletedPayload
  | ReportGeneratedPayload
  | ReportReadyPayload
  | CandidateShortlistedPayload
  | CriticalRedFlagsPayload
  | ResultSummaryPayload
  | PersonalDailyDigestPayload
  | TeamDailySummaryPayload;
