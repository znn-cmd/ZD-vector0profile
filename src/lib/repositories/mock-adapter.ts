import { genId } from "@/lib/id";
import type {
  Candidate,
  CandidateStatus,
  AssessmentSession,
  AssessmentResults,
  Notification,
  HRUser,
  FunnelStats,
} from "@/types";
import type {
  DataRepository,
  CandidateRepository,
  SessionRepository,
  ResultsRepository,
  NotificationRepository,
  HRRepository,
  AnalyticsRepository,
} from "./types";
import {
  DEMO_HR_USERS,
  buildDemoCandidates,
  buildDemoSessions,
  buildDemoResults,
  buildDemoNotifications,
  DEMO_IDS,
} from "@/seed/demo-data";

// ─── In-Memory Stores ────────────────────────────────────────────────

const store = {
  candidates: new Map<string, Candidate>(),
  sessions: new Map<string, AssessmentSession>(),
  results: new Map<string, AssessmentResults>(),
  notifications: new Map<string, Notification>(),
  hr: new Map<string, HRUser>(),
};

function now() {
  return new Date().toISOString();
}

// ─── Seed Demo Data (real-estate hiring context, all bands + role fits) ─

function seedIfEmpty() {
  if (store.hr.size > 0) return;

  for (const u of DEMO_HR_USERS) store.hr.set(u.id, u);

  const candidates = buildDemoCandidates();
  for (const c of candidates) store.candidates.set(c.id, c);

  const sessions = buildDemoSessions();
  for (const s of sessions) store.sessions.set(s.id, s);

  const results = buildDemoResults();
  for (const r of results) store.results.set(r.candidateId, r);

  const notifs = buildDemoNotifications(DEMO_IDS.candidates);
  const notifDates = [
    "2026-03-10T08:00:00Z",
    "2026-03-09T14:00:00Z",
    "2026-03-08T10:00:00Z",
    "2026-03-07T16:00:00Z",
    "2026-03-09T17:00:00Z",
    "2026-03-09T12:30:00Z",
  ];
  notifs.forEach((n, i) => {
    const id = genId("notif");
    store.notifications.set(id, { ...n, id, createdAt: notifDates[i] ?? now() });
  });
}

// ─── Repository Implementations ──────────────────────────────────────

const candidateRepo: CandidateRepository = {
  async list(opts) {
    seedIfEmpty();
    let list = Array.from(store.candidates.values());
    if (!opts?.includeArchived) list = list.filter((c) => !c.archivedAt);
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  async getById(id) {
    seedIfEmpty();
    return store.candidates.get(id) ?? null;
  },
  async getByToken(token) {
    seedIfEmpty();
    return Array.from(store.candidates.values()).find((c) => c.inviteToken === token) ?? null;
  },
  async create(data) {
    seedIfEmpty();
    const id = genId("cand");
    const candidate: Candidate = { ...data, id, createdAt: now(), updatedAt: now() };
    store.candidates.set(id, candidate);
    return candidate;
  },
  async updateStatus(id, status) {
    const c = store.candidates.get(id);
    if (!c) throw new Error(`Candidate ${id} not found`);
    const updated: Candidate = { ...c, status, updatedAt: now() };
    if (status === "completed") updated.completedAt = now();
    store.candidates.set(id, updated);
    return updated;
  },
  async update(id, data) {
    const c = store.candidates.get(id);
    if (!c) throw new Error(`Candidate ${id} not found`);
    const updated = { ...c, ...data, updatedAt: now() };
    store.candidates.set(id, updated);
    return updated;
  },
};

const sessionRepo: SessionRepository = {
  async getByCandidate(candidateId) {
    seedIfEmpty();
    return Array.from(store.sessions.values()).find((s) => s.candidateId === candidateId) ?? null;
  },
  async create(data) {
    const id = genId("sess");
    const session: AssessmentSession = { ...data, id };
    store.sessions.set(id, session);
    return session;
  },
  async update(id, data) {
    const s = store.sessions.get(id);
    if (!s) throw new Error(`Session ${id} not found`);
    const updated = { ...s, ...data };
    store.sessions.set(id, updated);
    return updated;
  },
  async saveProgress(sessionId, session) {
    store.sessions.set(sessionId, { ...session });
  },
};

const resultsRepo: ResultsRepository = {
  async getByCandidate(candidateId) {
    return Array.from(store.results.values()).find((r) => r.candidateId === candidateId) ?? null;
  },
  async save(results) {
    store.results.set(results.candidateId, results);
  },
  async update(candidateId, data) {
    const existing = store.results.get(candidateId);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    store.results.set(candidateId, updated);
    return updated;
  },
};

const notificationRepo: NotificationRepository = {
  async list(limit = 50) {
    seedIfEmpty();
    return Array.from(store.notifications.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
  async create(data) {
    const id = genId("notif");
    const notification: Notification = { ...data, id, createdAt: now() };
    store.notifications.set(id, notification);
    return notification;
  },
  async markRead(id) {
    const n = store.notifications.get(id);
    if (n) store.notifications.set(id, { ...n, read: true });
  },
  async markAllRead() {
    store.notifications.forEach((n, id) => {
      store.notifications.set(id, { ...n, read: true });
    });
  },
};

const hrRepo: HRRepository = {
  async list() {
    seedIfEmpty();
    return Array.from(store.hr.values()).map(({ password: _, ...u }) => ({ ...u }));
  },
  async getById(id) {
    seedIfEmpty();
    const u = store.hr.get(id);
    return u ? { ...u, password: undefined } : null;
  },
  async getByEmail(email) {
    seedIfEmpty();
    const normalized = email.trim().toLowerCase();
    const u = Array.from(store.hr.values()).find((h) => h.email.toLowerCase() === normalized);
    if (!u) return null;
    return { ...u, password: u.password ?? "hr" };
  },
  async create(data) {
    const id = genId("hr", 6);
    const user: HRUser = { ...data, id };
    store.hr.set(id, user);
    return user;
  },
};

const analyticsRepo: AnalyticsRepository = {
  async getFunnelStats() {
    seedIfEmpty();
    const all = Array.from(store.candidates.values());
    const count = (s: CandidateStatus) => all.filter((c) => c.status === s).length;
    return {
      invited: count("invited"),
      inProgress: count("in_progress"),
      completed: count("completed"),
      reportGenerated: count("report_generated"),
      reportSent: count("report_sent"),
    };
  },
};

// ─── Export ──────────────────────────────────────────────────────────

export const mockRepository: DataRepository = {
  candidates: candidateRepo,
  sessions: sessionRepo,
  results: resultsRepo,
  notifications: notificationRepo,
  hr: hrRepo,
  analytics: analyticsRepo,
};
