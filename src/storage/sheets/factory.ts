// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Sheets DataStore Factory
//  Creates all repositories backed by a single Google Spreadsheet.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DataStore } from "../interfaces";
import { SheetsClient } from "../google/sheets.client";
import { HRUsersSheetsRepository } from "./hr-users.repository";
import { CandidatesSheetsRepository } from "./candidates.repository";
import { SessionsSheetsRepository } from "./sessions.repository";
import { ScoresSheetsRepository } from "./scores.repository";
import { ReportsSheetsRepository } from "./reports.repository";
import { NotificationsSheetsRepository } from "./notifications.repository";
import { AuditSheetsRepository } from "./audit.repository";

let _instance: DataStore | null = null;

export function createSheetsDataStore(spreadsheetId?: string): DataStore {
  if (_instance) return _instance;

  const client = new SheetsClient(spreadsheetId);

  _instance = {
    hrUsers: new HRUsersSheetsRepository(client),
    candidates: new CandidatesSheetsRepository(client),
    sessions: new SessionsSheetsRepository(client),
    scores: new ScoresSheetsRepository(client),
    reports: new ReportsSheetsRepository(client),
    notifications: new NotificationsSheetsRepository(client),
    audit: new AuditSheetsRepository(client),
  };

  return _instance;
}
