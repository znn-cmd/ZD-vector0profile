/**
 * ZIMA Dubai Vector Profile — Google Sheets Bootstrap Script
 *
 * Creates all required tabs/sheets with proper headers.
 * Run: npm run bootstrap-sheets
 *
 * Prerequisites:
 *   1. Create a Google Sheets spreadsheet
 *   2. Create a service account and download the key
 *   3. Share the spreadsheet with the service account email
 *   4. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID in .env
 */

import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SHEET_DEFINITIONS = [
  {
    name: "Candidates",
    headers: [
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
    widths: [120, 180, 200, 150, 180, 200, 50, 120, 100, 180, 180, 180, 180],
  },
  {
    name: "Sessions",
    headers: [
      "id",
      "candidateId",
      "currentBlock",
      "startedAt",
      "lastActiveAt",
      "jsonData",
    ],
    widths: [120, 120, 120, 180, 180, 400],
  },
  {
    name: "Results",
    headers: ["candidateId", "generatedAt", "jsonData"],
    widths: [120, 180, 600],
  },
  {
    name: "Notifications",
    headers: [
      "id",
      "type",
      "title",
      "message",
      "candidateId",
      "read",
      "createdAt",
    ],
    widths: [120, 150, 200, 300, 120, 60, 180],
  },
  {
    name: "HR_Users",
    headers: ["id", "name", "email", "telegramChatId", "role"],
    widths: [100, 180, 200, 160, 80],
  },
];

async function main() {
  console.log("🚀 ZIMA Dubai — Google Sheets Bootstrap\n");

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    console.error(
      "❌ Missing environment variables. Please set:\n" +
        "   GOOGLE_SERVICE_ACCOUNT_EMAIL\n" +
        "   GOOGLE_PRIVATE_KEY\n" +
        "   GOOGLE_SPREADSHEET_ID"
    );
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Get existing sheets
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheets =
    spreadsheet.data.sheets?.map((s) => s.properties?.title) ?? [];

  console.log(`📋 Spreadsheet: "${spreadsheet.data.properties?.title}"`);
  console.log(`   Existing tabs: ${existingSheets.join(", ") || "(none)"}\n`);

  for (const def of SHEET_DEFINITIONS) {
    if (existingSheets.includes(def.name)) {
      console.log(`  ✅ "${def.name}" already exists — skipping`);
      continue;
    }

    // Add the sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: def.name,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
            },
          },
        ],
      },
    });

    // Write headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${def.name}!A1:${String.fromCharCode(64 + def.headers.length)}1`,
      valueInputOption: "RAW",
      requestBody: { values: [def.headers] },
    });

    // Bold header row
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetId = sheetMeta.data.sheets?.find(
      (s) => s.properties?.title === def.name
    )?.properties?.sheetId;

    if (sheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: {
                      red: 0.9,
                      green: 0.93,
                      blue: 1,
                    },
                  },
                },
                fields: "userEnteredFormat(textFormat,backgroundColor)",
              },
            },
          ],
        },
      });
    }

    console.log(`  ✨ Created "${def.name}" with ${def.headers.length} columns`);
  }

  console.log("\n✅ Bootstrap complete!");
}

main().catch((err) => {
  console.error("❌ Bootstrap failed:", err.message);
  process.exit(1);
});
