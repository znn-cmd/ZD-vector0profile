// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Storage Layer Public API
//
//  Usage:
//    import { getDataStore } from "@/storage";
//    const store = getDataStore();
//    const candidate = await store.candidates.findById("cand_abc123");
//
//  The factory returns the correct adapter based on NEXT_PUBLIC_APP_MODE:
//    "mock"  → in-memory (default, no external deps)
//    "live"  → Google Sheets + Google Drive
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DataStore } from "./interfaces";

// ─── Types ───────────────────────────────────────────────────────────

export type {
  HRUser,
  Candidate,
  AssessmentSession,
  ScoreRecord,
  ReportRecord,
  NotificationLog,
  AuditLog,
  BaseEntity,
  Archivable,
  CreateInput,
  UpdateInput,
  FieldFilters,
  HRRole,
  HRStatus,
  CandidateStatus,
  SessionStatus,
  ScoreBand,
  ReportStatus,
  NotificationChannel,
  NotificationStatus,
  ActorType,
  Lang,
} from "./types";

// ─── Interfaces ──────────────────────────────────────────────────────

export type {
  DataStore,
  BaseRepository,
  HRUserRepository,
  CandidateRepository,
  SessionRepository,
  ScoreRepository,
  ReportRepository,
  NotificationLogRepository,
  AuditLogRepository,
} from "./interfaces";

// ─── Schema ──────────────────────────────────────────────────────────

export { TABS, HEADERS, columnIndex } from "./schema";

// ─── Helpers ─────────────────────────────────────────────────────────

export { withRetry } from "./helpers/retry";
export { transliterate, normalizeName, nameMatches } from "./helpers/search";
export { generateId, generateInviteToken, nowISO } from "./helpers/id";

// ─── Services ────────────────────────────────────────────────────────

export { DriveService, type UploadReportInput, type UploadReportResult } from "./drive.service";

// ─── Factory ─────────────────────────────────────────────────────────

let _dataStore: DataStore | null = null;

/**
 * Returns a singleton DataStore backed by either Google Sheets (live)
 * or an in-memory mock (local dev).
 *
 * Lazy-loads the Sheets adapter to avoid bundling `googleapis` in
 * mock mode.
 */
export function getDataStore(): DataStore {
  if (_dataStore) return _dataStore;

  const mode = process.env.NEXT_PUBLIC_APP_MODE ?? "mock";

  if (mode === "live") {
    // Lazy require to prevent googleapis from being pulled into client bundles
    const { createSheetsDataStore } = require("./sheets/factory") as typeof import("./sheets/factory");
    _dataStore = createSheetsDataStore();
  } else {
    const { createMockDataStore } = require("./mock/factory") as typeof import("./mock/factory");
    _dataStore = createMockDataStore({ seed: true });
  }

  return _dataStore;
}

/**
 * Creates a DriveService instance wired to the current DataStore.
 * Only works in "live" mode — in mock mode, Drive operations throw.
 */
export function getDriveService() {
  const { DriveService: DS } = require("./drive.service") as typeof import("./drive.service");
  const store = getDataStore();
  return new DS(store.reports);
}
