/**
 * ZIMA Dubai Vector Profile — Seed Demo Data (Google Sheets)
 *
 * Populates the spreadsheet with realistic demo content from src/seed/demo-data.ts.
 * Use in live mode after bootstrap. Mock mode loads the same data automatically.
 *
 * Run: npm run seed
 *
 * Prerequisites:
 *   - GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID in .env
 *   - Spreadsheet must have tabs: HR_Users, Candidates, Sessions, Results, Notifications
 *   - Run npm run bootstrap-sheets first if using the scripts/bootstrap-sheets layout
 *   - For app repository layer, ensure sheet names match lib/google/sheets.ts (Candidates, etc.)
 */

import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  DEMO_HR_USERS,
  buildDemoCandidates,
  buildDemoSessions,
  buildDemoResults,
  buildDemoNotifications,
  DEMO_IDS,
} from "../src/seed/demo-data";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SHEET_NAMES = {
  candidates: "Candidates",
  sessions: "Sessions",
  results: "Results",
  notifications: "Notifications",
  hr: "HR_Users",
} as const;

function hrToRow(u: (typeof DEMO_HR_USERS)[0]) {
  return [u.id, u.name, u.email, u.password ?? "", u.telegramChatId ?? "", u.role];
}

function candidateToRow(c: ReturnType<typeof buildDemoCandidates>[0]) {
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

function sessionToRow(s: ReturnType<typeof buildDemoSessions>[0]) {
  return [
    s.id,
    s.candidateId,
    s.currentBlock,
    s.startedAt,
    s.lastActiveAt,
    JSON.stringify(s),
  ];
}

function resultToRow(r: ReturnType<typeof buildDemoResults>[0]) {
  return [r.candidateId, r.generatedAt, JSON.stringify(r)];
}

function notifToRow(
  n: ReturnType<typeof buildDemoNotifications>[0] & { id: string; createdAt: string }
) {
  return [
    n.id,
    n.type,
    n.title,
    n.message,
    n.candidateId ?? "",
    String(n.read),
    n.createdAt,
  ];
}

async function main() {
  console.log("🌱 ZIMA Dubai — Seed Demo Data (Sheets)\n");

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    console.error(
      "❌ Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID in .env"
    );
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // HR Users
  console.log("  📥 Seeding HR_Users...");
  const hrRows = DEMO_HR_USERS.map(hrToRow);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.hr}!A2:F`,
    valueInputOption: "RAW",
    requestBody: { values: hrRows },
  });

  // Candidates
  console.log("  📥 Seeding Candidates...");
  const candidates = buildDemoCandidates();
  const candidateRows = candidates.map(candidateToRow);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.candidates}!A2:L`,
    valueInputOption: "RAW",
    requestBody: { values: candidateRows },
  });

  // Sessions
  console.log("  📥 Seeding Sessions...");
  const sessions = buildDemoSessions();
  const sessionRows = sessions.map(sessionToRow);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.sessions}!A2:F`,
    valueInputOption: "RAW",
    requestBody: { values: sessionRows },
  });

  // Results (assessment results with full summary for dashboard/compare)
  console.log("  📥 Seeding Results...");
  const results = buildDemoResults();
  const resultRows = results.map(resultToRow);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.results}!A2:C`,
    valueInputOption: "RAW",
    requestBody: { values: resultRows },
  });

  // Notifications
  console.log("  📥 Seeding Notifications...");
  const notifs = buildDemoNotifications(DEMO_IDS.candidates);
  const notifDates = [
    "2026-03-10T08:00:00Z",
    "2026-03-09T14:00:00Z",
    "2026-03-08T10:00:00Z",
    "2026-03-07T16:00:00Z",
    "2026-03-09T17:00:00Z",
    "2026-03-09T12:30:00Z",
  ];
  const notifRows = notifs.map((n, i) => {
    const id = `notif_demo_${String(i + 1).padStart(2, "0")}`;
    return notifToRow({ ...n, id, createdAt: notifDates[i] ?? new Date().toISOString() });
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.notifications}!A2:G`,
    valueInputOption: "RAW",
    requestBody: { values: notifRows },
  });

  console.log("\n✅ Demo data seeded successfully.");
  console.log("   HR users: 4 (RU + EN)");
  console.log("   Candidates: 10 (all bands + role fits)");
  console.log("   Sessions: 9");
  console.log("   Results: 8 (with summary cards for compare/detail)");
  console.log("   Notifications: 6");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
