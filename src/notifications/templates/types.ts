// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Message Template Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ScoreBand } from "../../storage/types";

export interface MessageTemplate {
  subject: string;
  body: string;
}

export interface MessageTemplates {
  // Private
  candidate_started: MessageTemplate;
  inactivity_risk: MessageTemplate;
  block_completed: MessageTemplate;
  assessment_completed_private: MessageTemplate;
  report_ready: MessageTemplate;
  result_summary: MessageTemplate;
  personal_daily_digest: MessageTemplate;

  // Group
  assessment_completed_group: MessageTemplate;
  report_generated_group: MessageTemplate;
  candidate_shortlisted: MessageTemplate;
  critical_red_flags: MessageTemplate;
  team_daily_summary: MessageTemplate;

  // Registration
  registration_success: MessageTemplate;
  registration_unknown: MessageTemplate;
  registration_already_linked: MessageTemplate;

  // Band label lookup
  band_labels: Record<ScoreBand, string>;
}

export type TemplateKey = keyof Omit<MessageTemplates, "band_labels">;
