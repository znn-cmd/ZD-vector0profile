// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Sheet Schema — Tab names, column headers, and column indexes
//  This is the single source of truth for the Sheets structure.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TABS = {
  HR_USERS:             "hr_users",
  CANDIDATES:           "candidates",
  ASSESSMENT_SESSIONS:  "assessment_sessions",
  SCORES:               "scores",
  REPORTS:              "reports",
  NOTIFICATION_LOG:     "notification_log",
  AUDIT_LOG:            "audit_log",
} as const;

export type TabName = (typeof TABS)[keyof typeof TABS];

export const HEADERS: Record<TabName, string[]> = {
  hr_users: [
    "id", "email", "full_name", "role", "status",
    "telegram_chat_id", "language",
    "created_at", "updated_at", "archived_at",
  ],
  candidates: [
    "id", "full_name", "full_name_normalized", "email", "phone",
    "position", "department", "invited_by", "invite_token",
    "status", "language", "notes",
    "created_at", "updated_at", "archived_at",
  ],
  assessment_sessions: [
    "id", "candidate_id", "status", "started_at", "completed_at",
    "current_block", "current_block_index", "progress_json",
    "last_saved_at", "created_at", "updated_at",
  ],
  scores: [
    "id", "session_id", "candidate_id", "block_id",
    "scores_json", "overall_score", "band",
    "validity_score", "consistency_score", "created_at",
  ],
  reports: [
    "id", "session_id", "candidate_id", "template_id",
    "file_name", "drive_file_id", "drive_url",
    "status", "generated_at", "error", "created_at",
  ],
  notification_log: [
    "id", "type", "recipient_id", "channel", "subject", "body",
    "payload_json", "status", "sent_at", "error", "retry_count",
    "created_at",
  ],
  audit_log: [
    "id", "actor_id", "actor_type", "action",
    "entity_type", "entity_id", "details_json",
    "ip_address", "user_agent", "created_at",
  ],
};

/** Quick lookup: tab → index of 'id' column (always 0 by convention) */
export const ID_COLUMN_INDEX = 0;

/** Returns column index for a given header in a tab */
export function columnIndex(tab: TabName, header: string): number {
  const idx = HEADERS[tab].indexOf(header);
  if (idx === -1) throw new Error(`Header "${header}" not found in tab "${tab}"`);
  return idx;
}
