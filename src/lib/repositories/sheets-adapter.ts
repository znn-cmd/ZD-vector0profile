import type {
  Candidate,
  CandidateStatus,
  AssessmentSession,
  AssessmentResults,
  Notification,
  HRUser,
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
import { getSheets, SHEET_NAMES } from "@/lib/google/sheets";
import { genId } from "@/lib/id";

function now() {
  return new Date().toISOString();
}

// ─── Helper: Row ↔ Object Mapping ───────────────────────────────────

function rowToCandidate(row: string[]): Candidate {
  return {
    id: row[0],
    fullName: row[1],
    email: row[2],
    phone: row[3] || undefined,
    position: row[4],
    inviteToken: row[5],
    lang: row[6] as Candidate["lang"],
    status: row[7] as CandidateStatus,
    hrId: row[8],
    createdAt: row[9],
    updatedAt: row[10],
    completedAt: row[11] || undefined,
    archivedAt: row[12] || undefined,
  };
}

function candidateToRow(c: Candidate): string[] {
  return [
    c.id,
    c.fullName,
    c.email,
    c.phone ?? "",
    c.position,
    c.inviteToken,
    c.lang,
    c.status,
    c.hrId,
    c.createdAt,
    c.updatedAt,
    c.completedAt ?? "",
    c.archivedAt ?? "",
  ];
}

// ─── Candidates ──────────────────────────────────────────────────────

const sheetsCandidateRepo: CandidateRepository = {
  async list(opts) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("GOOGLE_SPREADSHEET_ID is not set");
    try {
      const sheets = getSheets();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAMES.candidates}!A2:M`,
      });
      let rows = (res.data.values ?? []).map(rowToCandidate);
      if (!opts?.includeArchived) rows = rows.filter((c) => !c.archivedAt);
      return rows;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google Sheets request failed";
      throw new Error(`Candidates list failed: ${msg}`);
    }
  },

  async getById(id) {
    const all = await this.list({ includeArchived: true });
    return all.find((c) => c.id === id) ?? null;
  },

  async getByToken(token) {
    const all = await this.list({ includeArchived: true });
    return all.find((c) => c.inviteToken === token) ?? null;
  },

  async create(data) {
    const sheets = getSheets();
    const candidate: Candidate = {
      ...data,
      id: genId("cand"),
      createdAt: now(),
      updatedAt: now(),
    };
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.candidates}!A2:M`,
      valueInputOption: "RAW",
      requestBody: { values: [candidateToRow(candidate)] },
    });
    return candidate;
  },

  async updateStatus(id, status) {
    const candidate = await this.getById(id);
    if (!candidate) throw new Error(`Candidate ${id} not found`);
    return this.update(id, {
      status,
      ...(status === "completed" ? { completedAt: now() } : {}),
    });
  },

  async update(id, data) {
    const sheets = getSheets();
    const allRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.candidates}!A2:M`,
    });
    const rows = allRes.data.values ?? [];
    const idx = rows.findIndex((r) => r[0] === id);
    if (idx === -1) throw new Error(`Candidate ${id} not found in sheet`);

    const existing = rowToCandidate(rows[idx]);
    const updated: Candidate = { ...existing, ...data, updatedAt: now() };
    const rowNum = idx + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.candidates}!A${rowNum}:M${rowNum}`,
      valueInputOption: "RAW",
      requestBody: { values: [candidateToRow(updated)] },
    });
    return updated;
  },
};

// ─── Sessions ────────────────────────────────────────────────────────

const sheetsSessionRepo: SessionRepository = {
  async getByCandidate(candidateId) {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.sessions}!A2:F`,
    });
    const rows = res.data.values ?? [];
    const row = rows.find((r) => r[1] === candidateId);
    if (!row) return null;
    return JSON.parse(row[5]) as AssessmentSession;
  },

  async create(data) {
    const sheets = getSheets();
    const session: AssessmentSession = { ...data, id: genId("sess") };
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.sessions}!A2:F`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            session.id,
            session.candidateId,
            session.currentBlock,
            session.startedAt,
            session.lastActiveAt,
            JSON.stringify(session),
          ],
        ],
      },
    });
    return session;
  },

  async update(id, data) {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.sessions}!A2:F`,
    });
    const rows = res.data.values ?? [];
    const idx = rows.findIndex((r) => r[0] === id);
    if (idx === -1) throw new Error(`Session ${id} not found`);

    const existing = JSON.parse(rows[idx][5]) as AssessmentSession;
    const updated = { ...existing, ...data };
    const rowNum = idx + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.sessions}!A${rowNum}:F${rowNum}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            updated.id,
            updated.candidateId,
            updated.currentBlock,
            updated.startedAt,
            updated.lastActiveAt,
            JSON.stringify(updated),
          ],
        ],
      },
    });
    return updated;
  },

  async saveProgress(sessionId, session) {
    await this.update(sessionId, session);
  },
};

// ─── Results ─────────────────────────────────────────────────────────

const sheetsResultsRepo: ResultsRepository = {
  async getByCandidate(candidateId) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("GOOGLE_SPREADSHEET_ID is not set");
    try {
      const sheets = getSheets();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAMES.results}!A2:C`,
      });
      const rows = res.data.values ?? [];
      const row = rows.find((r) => r[0] === candidateId);
      if (!row) return null;
      return JSON.parse(row[2]) as AssessmentResults;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sheets request failed";
      throw new Error(`Results getByCandidate failed: ${msg}`);
    }
  },

  async save(results) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("GOOGLE_SPREADSHEET_ID is not set");
    try {
      const sheets = getSheets();
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${SHEET_NAMES.results}!A2:C`,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [results.candidateId, results.generatedAt, JSON.stringify(results)],
          ],
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sheets append failed";
      throw new Error(`Results save failed: ${msg}`);
    }
  },

  async update(candidateId, data) {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("GOOGLE_SPREADSHEET_ID is not set");
    try {
      const sheets = getSheets();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAMES.results}!A2:C`,
      });
      const rows = res.data.values ?? [];
      const idx = rows.findIndex((r) => r[0] === candidateId);
      if (idx === -1) return null;
      const existing = JSON.parse(rows[idx][2]) as AssessmentResults;
      const updated = { ...existing, ...data };
      const rowNum = idx + 2;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAMES.results}!A${rowNum}:C${rowNum}`,
        valueInputOption: "RAW",
        requestBody: { values: [[updated.candidateId, updated.generatedAt, JSON.stringify(updated)]] },
      });
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sheets update failed";
      throw new Error(`Results update failed: ${msg}`);
    }
  },
};

// ─── Notifications ───────────────────────────────────────────────────

const sheetsNotificationRepo: NotificationRepository = {
  async list(limit = 20) {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.notifications}!A2:G`,
    });
    const rows = res.data.values ?? [];
    return rows
      .map(
        (r): Notification => ({
          id: r[0],
          type: r[1] as Notification["type"],
          title: r[2],
          message: r[3],
          candidateId: r[4] || undefined,
          read: r[5] === "true",
          createdAt: r[6],
        })
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  },

  async create(data) {
    const sheets = getSheets();
    const notification: Notification = {
      ...data,
      id: genId("notif"),
      createdAt: now(),
    };
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.notifications}!A2:G`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            notification.id,
            notification.type,
            notification.title,
            notification.message,
            notification.candidateId ?? "",
            String(notification.read),
            notification.createdAt,
          ],
        ],
      },
    });
    return notification;
  },

  async markRead(id) {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.notifications}!A2:G`,
    });
    const rows = res.data.values ?? [];
    const idx = rows.findIndex((r) => r[0] === id);
    if (idx === -1) return;
    const rowNum = idx + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.notifications}!F${rowNum}`,
      valueInputOption: "RAW",
      requestBody: { values: [["true"]] },
    });
  },

  async markAllRead() {
    const all = await this.list(1000);
    for (const n of all) {
      if (!n.read) await this.markRead(n.id);
    }
  },
};

// ─── HR Users ────────────────────────────────────────────────────────

const sheetsHRRepo: HRRepository = {
  async list() {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.hr}!A2:E`,
    });
    return (res.data.values ?? []).map(
      (r): HRUser => ({
        id: r[0],
        name: r[1],
        email: r[2],
        telegramChatId: r[3] || undefined,
        role: r[4] as HRUser["role"],
      })
    );
  },

  async getById(id) {
    const all = await this.list();
    return all.find((h) => h.id === id) ?? null;
  },

  async create(data) {
    const sheets = getSheets();
    const user: HRUser = { ...data, id: genId("hr", 6) };
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${SHEET_NAMES.hr}!A2:E`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [user.id, user.name, user.email, user.telegramChatId ?? "", user.role],
        ],
      },
    });
    return user;
  },
};

// ─── Analytics ───────────────────────────────────────────────────────

const sheetsAnalyticsRepo: AnalyticsRepository = {
  async getFunnelStats() {
    const candidates = await sheetsCandidateRepo.list();
    const count = (s: CandidateStatus) =>
      candidates.filter((c) => c.status === s).length;
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

export const sheetsRepository: DataRepository = {
  candidates: sheetsCandidateRepo,
  sessions: sheetsSessionRepo,
  results: sheetsResultsRepo,
  notifications: sheetsNotificationRepo,
  hr: sheetsHRRepo,
  analytics: sheetsAnalyticsRepo,
};
