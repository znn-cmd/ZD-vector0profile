import { google, type sheets_v4 } from "googleapis";

let sheetsInstance: sheets_v4.Sheets | null = null;

export const SHEET_NAMES = {
  candidates: "Candidates",
  sessions: "Sessions",
  results: "Results",
  notifications: "Notifications",
  hr: "HR_Users",
} as const;

export const SHEET_HEADERS: Record<string, string[]> = {
  [SHEET_NAMES.candidates]: [
    "id",
    "fullName",
    "email",
    "phone",
    "position",
    "inviteToken",
    "lang",
    "status",
    "hrId",
    "createdAt",
    "updatedAt",
    "completedAt",
    "archivedAt",
  ],
  [SHEET_NAMES.sessions]: [
    "id",
    "candidateId",
    "currentBlock",
    "startedAt",
    "lastActiveAt",
    "jsonData",
  ],
  [SHEET_NAMES.results]: ["candidateId", "generatedAt", "jsonData"],
  [SHEET_NAMES.notifications]: [
    "id",
    "type",
    "title",
    "message",
    "candidateId",
    "read",
    "createdAt",
  ],
  [SHEET_NAMES.hr]: ["id", "name", "email", "telegramChatId", "role"],
};

export function getSheets(): sheets_v4.Sheets {
  if (sheetsInstance) return sheetsInstance;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsInstance = google.sheets({ version: "v4", auth });
  return sheetsInstance;
}

export async function testSheetsConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });
    return {
      ok: true,
      message: `Connected to "${res.data.properties?.title}"`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
