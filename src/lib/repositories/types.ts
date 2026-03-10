import type {
  Candidate,
  CandidateStatus,
  AssessmentSession,
  AssessmentResults,
  Notification,
  HRUser,
  FunnelStats,
} from "@/types";

export interface CandidateRepository {
  list(opts?: { includeArchived?: boolean }): Promise<Candidate[]>;
  getById(id: string): Promise<Candidate | null>;
  getByToken(token: string): Promise<Candidate | null>;
  create(data: Omit<Candidate, "id" | "createdAt" | "updatedAt">): Promise<Candidate>;
  updateStatus(id: string, status: CandidateStatus): Promise<Candidate>;
  update(id: string, data: Partial<Candidate>): Promise<Candidate>;
}

export interface SessionRepository {
  getByCandidate(candidateId: string): Promise<AssessmentSession | null>;
  create(data: Omit<AssessmentSession, "id">): Promise<AssessmentSession>;
  update(id: string, data: Partial<AssessmentSession>): Promise<AssessmentSession>;
  saveProgress(sessionId: string, session: AssessmentSession): Promise<void>;
}

export interface ResultsRepository {
  getByCandidate(candidateId: string): Promise<AssessmentResults | null>;
  save(results: AssessmentResults): Promise<void>;
  /** Merge partial fields (e.g. reportUrl, reportVersion) into existing results. */
  update(candidateId: string, data: Partial<AssessmentResults>): Promise<AssessmentResults | null>;
}

export interface NotificationRepository {
  list(limit?: number): Promise<Notification[]>;
  create(data: Omit<Notification, "id" | "createdAt">): Promise<Notification>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}

export interface HRRepository {
  list(): Promise<HRUser[]>;
  getById(id: string): Promise<HRUser | null>;
  create(data: Omit<HRUser, "id">): Promise<HRUser>;
}

export interface AnalyticsRepository {
  getFunnelStats(): Promise<FunnelStats>;
}

export interface DataRepository {
  candidates: CandidateRepository;
  sessions: SessionRepository;
  results: ResultsRepository;
  notifications: NotificationRepository;
  hr: HRRepository;
  analytics: AnalyticsRepository;
}
