// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Storage Entity Types
//  Every entity flowing through the storage layer is defined here.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Base ────────────────────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  created_at: string;           // ISO-8601
}

export interface Archivable {
  archived_at: string | null;   // null = active
}

// ─── HR Users ────────────────────────────────────────────────────────

export type HRRole = "admin" | "hr" | "viewer";
export type HRStatus = "active" | "suspended";

export interface HRUser extends BaseEntity, Archivable {
  email: string;
  full_name: string;
  role: HRRole;
  status: HRStatus;
  telegram_chat_id: string;       // captured via /start, empty until linked
  language: Lang;                  // preferred notification language
  updated_at: string;
}

// ─── Candidates ──────────────────────────────────────────────────────

export type CandidateStatus =
  | "invited"
  | "in_progress"
  | "completed"
  | "expired"
  | "withdrawn";

export type Lang = "en" | "ru";

export interface Candidate extends BaseEntity, Archivable {
  full_name: string;
  full_name_normalized: string;   // lower-cased, transliterated for search
  email: string;
  phone: string;
  position: string;
  department: string;
  invited_by: string;             // HR user ID
  invite_token: string;
  status: CandidateStatus;
  language: Lang;
  notes: string;
  updated_at: string;
}

// ─── Assessment Sessions ─────────────────────────────────────────────

export type SessionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "timed_out"
  | "abandoned";

export interface AssessmentSession extends BaseEntity {
  candidate_id: string;
  status: SessionStatus;
  started_at: string;
  completed_at: string;
  current_block: string;
  current_block_index: number;
  /** Serialized JSON of per-block answer state */
  progress_json: string;
  last_saved_at: string;
  updated_at: string;
}

// ─── Scores ──────────────────────────────────────────────────────────

export type ScoreBand =
  | "strong_hire"
  | "recommended"
  | "conditional"
  | "not_recommended";

export interface ScoreRecord extends BaseEntity {
  session_id: string;
  candidate_id: string;
  block_id: string;               // "disc" | "ritchie" | "zima" | "final"
  scores_json: string;            // full block result serialized
  overall_score: number;
  band: ScoreBand;
  validity_score: number;
  consistency_score: number;
}

// ─── Reports ─────────────────────────────────────────────────────────

export type ReportStatus = "generating" | "ready" | "failed" | "archived";

export interface ReportRecord extends BaseEntity {
  session_id: string;
  candidate_id: string;
  template_id: string;
  file_name: string;
  drive_file_id: string;
  drive_url: string;
  status: ReportStatus;
  generated_at: string;
  error: string;
}

// ─── Notification Log ────────────────────────────────────────────────

export type NotificationChannel = "email" | "telegram" | "in_app";
export type NotificationStatus = "pending" | "sent" | "failed" | "skipped";

export interface NotificationLog extends BaseEntity {
  type: string;                   // e.g. "candidate_started", "report_ready"
  recipient_id: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  payload_json: string;
  status: NotificationStatus;
  sent_at: string;
  error: string;
  retry_count: number;
}

// ─── Audit Log ───────────────────────────────────────────────────────

export type ActorType = "hr" | "admin" | "system" | "candidate";

export interface AuditLog extends BaseEntity {
  actor_id: string;
  actor_type: ActorType;
  action: string;                 // e.g. "candidate.create", "session.complete"
  entity_type: string;
  entity_id: string;
  details_json: string;
  ip_address: string;
  user_agent: string;
}

// ─── Utility Types ───────────────────────────────────────────────────

/** Strip readonly fields that storage generates */
export type CreateInput<T extends BaseEntity> = Omit<T, "id" | "created_at">;

/** Partial update — id is required to locate the row, rest is optional */
export type UpdateInput<T extends BaseEntity> = Partial<Omit<T, "id" | "created_at">>;

/** Filter object: key = column name, value = exact match or array of possible values */
export type FieldFilters<T> = {
  [K in keyof T]?: T[K] | T[K][];
};
