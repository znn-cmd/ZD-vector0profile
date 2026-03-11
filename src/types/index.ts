// ─── Enums & Literals ────────────────────────────────────────────────

export type Lang = "en" | "ru";

export type AppMode = "mock" | "live";

export type CandidateStatus =
  | "invited"
  | "in_progress"
  | "completed"
  | "report_generated"
  | "report_sent";

export type AssessmentBlockId = "disc" | "zima" | "ritchie_martin";

export type DISCDimension = "D" | "I" | "S" | "C";

export type RitchieMotivator =
  | "interest"
  | "achievement"
  | "recognition"
  | "authority"
  | "independence"
  | "affiliation"
  | "security"
  | "equity"
  | "working_conditions"
  | "personal_growth"
  | "creativity"
  | "structure";

// ─── Assessment Configs ──────────────────────────────────────────────

export interface AssessmentBlockConfig {
  id: AssessmentBlockId;
  titleKey: string;
  descriptionKey: string;
  estimatedMinutes: number;
  version: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: "disc_pair" | "multiple_choice" | "likert_scale" | "ranking" | "forced_choice" | "mini_case";
  textKey: string;
  options: QuestionOption[];
  /** For disc_pair: which dimension each option maps to */
  dimensionMap?: Record<string, DISCDimension>;
  /** For ritchie_martin: which motivator this question measures */
  motivator?: RitchieMotivator;
}

export interface QuestionOption {
  id: string;
  textKey: string;
  value?: number;
}

// ─── Candidate & Session ─────────────────────────────────────────────

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  inviteToken: string;
  lang: Lang;
  status: CandidateStatus;
  hrId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  /** When set, candidate is archived (soft-deleted); list() excludes by default. */
  archivedAt?: string | null;
}

export interface AssessmentSession {
  id: string;
  candidateId: string;
  currentBlock: AssessmentBlockId;
  blockOrder: AssessmentBlockId[];
  progress: Record<AssessmentBlockId, BlockProgress>;
  startedAt: string;
  lastActiveAt: string;
  completedAt?: string;
}

export interface BlockProgress {
  status: "not_started" | "in_progress" | "completed";
  answers: Record<string, AnswerValue>;
  startedAt?: string;
  completedAt?: string;
}

export type AnswerValue =
  | { type: "single"; value: string }
  | { type: "pair"; most: string; least: string }
  | { type: "scale"; value: number }
  | { type: "ranking"; order: string[] };

// ─── Scoring Results ─────────────────────────────────────────────────

/** Overall band from assessment engine — used for demo/seed and report summary card */
export type OverallBand =
  | "strong_hire"
  | "recommended"
  | "conditional"
  | "not_recommended";

/** Sales role fit — used for demo/seed and report summary card */
export type SalesRole = "full_cycle" | "hunter" | "consultative" | "team_lead";

export interface AssessmentResults {
  candidateId: string;
  sessionId: string;
  disc: DISCResult;
  zima: ZIMAResult;
  ritchieMartin: RitchieResult;
  generatedAt: string;
  /** Optional: full summary for dashboard/compare when report has been generated or from seed */
  overallScore?: number;
  overallBand?: OverallBand;
  primaryRole?: SalesRole;
  secondaryRole?: SalesRole;
  recommendation?: string;
  strengths?: string[];
  risks?: string[];
  interviewQuestions?: string[];
  managementRecs?: string[];
  retentionFlags?: string[];
  reportVersion?: string;
  reportUrl?: string | null;
  discOverall?: number;
  discSjtScore?: number;
  /** Full DISC scales 0–100 (D, I, S, C, K) when available */
  discScales?: Record<string, number>;
  zimaRedFlagCount?: number;
  /** Ritchie best role fit for summary card */
  ritchieBestRole?: SalesRole;
  ritchieBestRoleScore?: number;
  ritchieBestRoleFit?: string;
  /** ZIMA dimensions 0–100 for summary card when available */
  zimaDimensions?: Record<string, number>;
}

export interface DISCResult {
  raw: Record<DISCDimension, number>;
  normalized: Record<DISCDimension, number>;
  primaryType: DISCDimension;
  secondaryType: DISCDimension;
  profileLabel: string;
}

export interface ZIMAResult {
  categories: Record<string, number>;
  totalScore: number;
  percentile: number;
  level: "low" | "average" | "above_average" | "high";
}

export interface RitchieResult {
  motivators: Record<RitchieMotivator, number>;
  topMotivators: RitchieMotivator[];
  bottomMotivators: RitchieMotivator[];
}

// ─── HR / Admin ──────────────────────────────────────────────────────

export interface HRUser {
  id: string;
  name: string;
  email: string;
  /** Only present when loading for auth; never expose in list/dashboard. */
  password?: string;
  telegramChatId?: string;
  role: "hr" | "admin";
}

export interface Notification {
  id: string;
  type: "candidate_started" | "candidate_completed" | "report_ready" | "error";
  title: string;
  message: string;
  candidateId?: string;
  read: boolean;
  createdAt: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────

export interface FunnelStats {
  invited: number;
  inProgress: number;
  completed: number;
  reportGenerated: number;
  reportSent: number;
}

// ─── Report Templates ────────────────────────────────────────────────

export interface ReportTemplate {
  id: string;
  name: string;
  version: string;
  sections: ReportSection[];
  isActive: boolean;
}

export interface ReportSection {
  id: string;
  titleKey: string;
  type: "disc_profile" | "zima_scores" | "ritchie_chart" | "summary" | "recommendations";
  order: number;
}

// ─── Settings ────────────────────────────────────────────────────────

export interface IntegrationHealth {
  service: string;
  status: "healthy" | "degraded" | "down" | "not_configured";
  lastCheck: string;
  message?: string;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  lang: Lang;
  subject: string;
  body: string;
  channel: "telegram" | "email";
}
