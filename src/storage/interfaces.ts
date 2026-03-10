// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Repository Interfaces
//  Backend-agnostic contracts — implementations can be Sheets, Postgres, etc.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  BaseEntity,
  HRUser,
  Candidate,
  AssessmentSession,
  ScoreRecord,
  ReportRecord,
  NotificationLog,
  AuditLog,
  CreateInput,
  UpdateInput,
  FieldFilters,
} from "./types";

// ─── Base CRUD ───────────────────────────────────────────────────────

export interface BaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findMany(filters?: FieldFilters<T>, limit?: number, offset?: number): Promise<T[]>;
  findAll(): Promise<T[]>;
  create(data: CreateInput<T>): Promise<T>;
  update(id: string, data: UpdateInput<T>): Promise<T>;
  archive(id: string): Promise<T>;
  count(filters?: FieldFilters<T>): Promise<number>;
}

// ─── HR Users ────────────────────────────────────────────────────────

export interface HRUserRepository extends BaseRepository<HRUser> {
  findByEmail(email: string): Promise<HRUser | null>;
  findByTelegramChatId(chatId: string): Promise<HRUser | null>;
  findWithTelegram(): Promise<HRUser[]>;
}

// ─── Candidates ──────────────────────────────────────────────────────

export interface CandidateRepository extends BaseRepository<Candidate> {
  findByInviteToken(token: string): Promise<Candidate | null>;
  /**
   * Full-text search by full_name (ФИО).
   * Supports partial matches and normalized (transliterated) fallback.
   */
  searchByName(query: string, limit?: number): Promise<Candidate[]>;
}

// ─── Assessment Sessions ─────────────────────────────────────────────

export interface SessionRepository extends BaseRepository<AssessmentSession> {
  findByCandidateId(candidateId: string): Promise<AssessmentSession[]>;
  findActiveSession(candidateId: string): Promise<AssessmentSession | null>;
}

// ─── Scores ──────────────────────────────────────────────────────────

export interface ScoreRepository extends BaseRepository<ScoreRecord> {
  findBySessionId(sessionId: string): Promise<ScoreRecord[]>;
  findByCandidateId(candidateId: string): Promise<ScoreRecord[]>;
  findFinalScore(sessionId: string): Promise<ScoreRecord | null>;
}

// ─── Reports ─────────────────────────────────────────────────────────

export interface ReportRepository extends BaseRepository<ReportRecord> {
  findByCandidateId(candidateId: string): Promise<ReportRecord[]>;
  findBySessionId(sessionId: string): Promise<ReportRecord[]>;
}

// ─── Notification Log ────────────────────────────────────────────────

export interface NotificationLogRepository extends BaseRepository<NotificationLog> {
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationLog[]>;
  findRecent(limit?: number): Promise<NotificationLog[]>;
  markSent(id: string, sentAt?: string): Promise<NotificationLog>;
  markFailed(id: string, error: string): Promise<NotificationLog>;
}

// ─── Audit Log ───────────────────────────────────────────────────────

export interface AuditLogRepository extends BaseRepository<AuditLog> {
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  findByActor(actorId: string, limit?: number): Promise<AuditLog[]>;
  log(entry: CreateInput<AuditLog>): Promise<AuditLog>;
}

// ─── Aggregate Data Store ────────────────────────────────────────────

export interface DataStore {
  hrUsers: HRUserRepository;
  candidates: CandidateRepository;
  sessions: SessionRepository;
  scores: ScoreRepository;
  reports: ReportRepository;
  notifications: NotificationLogRepository;
  audit: AuditLogRepository;
}
