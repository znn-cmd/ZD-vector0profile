// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Mock DataStore Factory
//  All repositories backed by in-memory Maps. Includes demo seed data.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DataStore } from "../interfaces";
import type {
  HRUser, Candidate, AssessmentSession, ScoreRecord,
  ReportRecord, NotificationLog, AuditLog,
} from "../types";
import type { HRUserRepository, SessionRepository, ScoreRepository, ReportRepository, NotificationLogRepository, AuditLogRepository } from "../interfaces";
import { BaseMockRepository } from "./base.repository";
import { CandidatesMockRepository } from "./candidates.repository";
import { normalizeName } from "../helpers/search";
import { nowISO } from "../helpers/id";

// ─── Specialized lightweight mocks ───────────────────────────────────

class HRUsersMock extends BaseMockRepository<HRUser> implements HRUserRepository {
  constructor() { super("hr_users"); }
  async findByEmail(email: string): Promise<HRUser | null> {
    const all = await this.findAll();
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }
  async findByTelegramChatId(chatId: string): Promise<HRUser | null> {
    const all = await this.findAll();
    return all.find((u) => u.telegram_chat_id === chatId) ?? null;
  }
  async findWithTelegram(): Promise<HRUser[]> {
    const all = await this.findAll();
    return all.filter((u) => u.telegram_chat_id && u.status === "active");
  }
}

class SessionsMock extends BaseMockRepository<AssessmentSession> implements SessionRepository {
  constructor() { super("assessment_sessions"); }
  async findByCandidateId(candidateId: string): Promise<AssessmentSession[]> {
    return this.findMany({ candidate_id: candidateId } as Record<string, unknown>);
  }
  async findActiveSession(candidateId: string): Promise<AssessmentSession | null> {
    const sessions = await this.findByCandidateId(candidateId);
    return sessions.find((s) => s.status === "in_progress") ?? sessions.find((s) => s.status === "not_started") ?? null;
  }
}

class ScoresMock extends BaseMockRepository<ScoreRecord> implements ScoreRepository {
  constructor() { super("scores"); }
  async findBySessionId(sessionId: string) { return this.findMany({ session_id: sessionId } as Record<string, unknown>); }
  async findByCandidateId(candidateId: string) { return this.findMany({ candidate_id: candidateId } as Record<string, unknown>); }
  async findFinalScore(sessionId: string) {
    const all = await this.findBySessionId(sessionId);
    return all.find((s) => s.block_id === "final") ?? null;
  }
}

class ReportsMock extends BaseMockRepository<ReportRecord> implements ReportRepository {
  constructor() { super("reports"); }
  async findByCandidateId(candidateId: string) { return this.findMany({ candidate_id: candidateId } as Record<string, unknown>); }
  async findBySessionId(sessionId: string) { return this.findMany({ session_id: sessionId } as Record<string, unknown>); }
}

class NotificationsMock extends BaseMockRepository<NotificationLog> implements NotificationLogRepository {
  constructor() { super("notification_log"); }
  async findByRecipient(recipientId: string, limit = 50) { return this.findMany({ recipient_id: recipientId } as Record<string, unknown>, limit); }
  async findRecent(limit = 20) {
    const all = await this.findAll();
    all.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
    return all.slice(0, limit);
  }
  async markSent(id: string, sentAt?: string) { return this.update(id, { status: "sent", sent_at: sentAt ?? nowISO() }); }
  async markFailed(id: string, error: string) {
    const existing = await this.findById(id);
    return this.update(id, { status: "failed", error, retry_count: (existing?.retry_count ?? 0) + 1 });
  }
}

class AuditMock extends BaseMockRepository<AuditLog> implements AuditLogRepository {
  constructor() { super("audit_log"); }
  async findByEntity(entityType: string, entityId: string) { return this.findMany({ entity_type: entityType, entity_id: entityId } as Record<string, unknown>); }
  async findByActor(actorId: string, limit = 50) { return this.findMany({ actor_id: actorId } as Record<string, unknown>, limit); }
  async log(entry: Omit<AuditLog, "id" | "created_at">) { return this.create(entry); }
}

// ─── Factory + Seed ──────────────────────────────────────────────────

let _instance: DataStore | null = null;

export function createMockDataStore(options?: { seed?: boolean }): DataStore {
  if (_instance) return _instance;

  const store: DataStore = {
    hrUsers: new HRUsersMock(),
    candidates: new CandidatesMockRepository(),
    sessions: new SessionsMock(),
    scores: new ScoresMock(),
    reports: new ReportsMock(),
    notifications: new NotificationsMock(),
    audit: new AuditMock(),
  };

  if (options?.seed !== false) {
    seedDemoData(store);
  }

  _instance = store;
  return _instance;
}

// ─── Demo Seed Data ──────────────────────────────────────────────────

function seedDemoData(store: DataStore): void {
  const now = nowISO();

  // HR users
  const hrData: HRUser[] = [
    {
      id: "hr_demo_admin",
      email: "admin@zima.ae",
      full_name: "Дмитрий Волков",
      role: "admin",
      status: "active",
      telegram_chat_id: "",
      language: "ru",
      created_at: now,
      updated_at: now,
      archived_at: null,
    },
    {
      id: "hr_demo_hr1",
      email: "hr@zima.ae",
      full_name: "Elena Kuznetsova",
      role: "hr",
      status: "active",
      telegram_chat_id: "",
      language: "en",
      created_at: now,
      updated_at: now,
      archived_at: null,
    },
  ];
  (store.hrUsers as HRUsersMock).seed(hrData);

  // Candidates
  const candidateData: Candidate[] = [
    {
      id: "cand_demo_001",
      full_name: "Иванов Алексей Петрович",
      full_name_normalized: normalizeName("Иванов Алексей Петрович"),
      email: "ivanov@example.com",
      phone: "+971501234567",
      position: "Senior Sales Manager",
      department: "Commercial",
      invited_by: "hr_demo_admin",
      invite_token: "demo-invite-token-001",
      status: "in_progress",
      language: "ru",
      notes: "Referred by partner network",
      created_at: now,
      updated_at: now,
      archived_at: null,
    },
    {
      id: "cand_demo_002",
      full_name: "Sarah Williams",
      full_name_normalized: normalizeName("Sarah Williams"),
      email: "sarah.w@example.com",
      phone: "+971509876543",
      position: "Account Executive",
      department: "Sales",
      invited_by: "hr_demo_hr1",
      invite_token: "demo-invite-token-002",
      status: "invited",
      language: "en",
      notes: "",
      created_at: now,
      updated_at: now,
      archived_at: null,
    },
    {
      id: "cand_demo_003",
      full_name: "Козлова Мария Дмитриевна",
      full_name_normalized: normalizeName("Козлова Мария Дмитриевна"),
      email: "kozlova.m@example.com",
      phone: "+971507654321",
      position: "Team Lead",
      department: "B2B Sales",
      invited_by: "hr_demo_admin",
      invite_token: "demo-invite-token-003",
      status: "completed",
      language: "ru",
      notes: "Excellent initial interview",
      created_at: now,
      updated_at: now,
      archived_at: null,
    },
  ];
  (store.candidates as CandidatesMockRepository).seed(candidateData);

  // Session for candidate 1
  const sessionData: AssessmentSession[] = [
    {
      id: "sess_demo_001",
      candidate_id: "cand_demo_001",
      status: "in_progress",
      started_at: now,
      completed_at: "",
      current_block: "disc",
      current_block_index: 0,
      progress_json: JSON.stringify({ disc: { answered: 42, total: 100 } }),
      last_saved_at: now,
      created_at: now,
      updated_at: now,
    },
  ];
  (store.sessions as SessionsMock).seed(sessionData);

  // Notification
  const notifData: NotificationLog[] = [
    {
      id: "ntf_demo_001",
      type: "candidate_invited",
      recipient_id: "hr_demo_admin",
      channel: "in_app",
      subject: "New candidate invited",
      body: "Иванов Алексей Петрович has been invited to the assessment.",
      payload_json: "{}",
      status: "sent",
      sent_at: now,
      error: "",
      retry_count: 0,
      created_at: now,
    },
  ];
  (store.notifications as NotificationsMock).seed(notifData);
}
