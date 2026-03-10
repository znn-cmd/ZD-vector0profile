// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Google Sheets Bootstrap Script
//
//  Creates or validates all required tabs and headers in the target
//  spreadsheet. Safe to run multiple times (idempotent).
//
//  Usage:
//    npx tsx src/storage/bootstrap.ts
//
//  Requires env vars:
//    GOOGLE_SERVICE_ACCOUNT_EMAIL
//    GOOGLE_PRIVATE_KEY
//    GOOGLE_SPREADSHEET_ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { config } from "dotenv";
config();

import { SheetsClient } from "./google/sheets.client";
import { TABS, HEADERS, type TabName } from "./schema";

const ALL_TABS = Object.values(TABS) as TabName[];

async function bootstrap(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  ZIMA Dubai Vector Profile — Sheets Bootstrap");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.error("ERROR: GOOGLE_SPREADSHEET_ID is not set.");
    process.exit(1);
  }

  const client = new SheetsClient(spreadsheetId);

  // ── Test connection ────────────────────────────────────────────
  console.log("Testing connection...");
  const conn = await client.testConnection();
  if (!conn.ok) {
    console.error(`Connection failed: ${conn.error}`);
    process.exit(1);
  }
  console.log(`Connected to spreadsheet: "${conn.title}"\n`);

  // ── Get existing tabs ──────────────────────────────────────────
  const existingMeta = await client.getSpreadsheetMetadata();
  const existingTabs = new Set(existingMeta.map((s) => s.title));

  let created = 0;
  let validated = 0;
  let repaired = 0;

  for (const tab of ALL_TABS) {
    const expectedHeaders = HEADERS[tab];
    process.stdout.write(`  [${tab}] `);

    if (!existingTabs.has(tab)) {
      // ── Create tab ──────────────────────────────────────────
      try {
        await client.createTab(tab);
        await client.setHeaders(tab, expectedHeaders);
        await client.formatHeaderRow(tab);
        console.log("CREATED ✓");
        created++;
      } catch (err) {
        console.log(`FAILED ✗ — ${err instanceof Error ? err.message : err}`);
      }
    } else {
      // ── Validate headers ────────────────────────────────────
      const missingHeaders = await client.validateHeaders(tab, expectedHeaders);

      if (missingHeaders.length === 0) {
        console.log("OK ✓");
        validated++;
      } else {
        // Try to repair by rewriting the header row
        console.log(`REPAIRING — missing: ${missingHeaders.join(", ")}`);
        try {
          await client.setHeaders(tab, expectedHeaders);
          await client.formatHeaderRow(tab);
          console.log(`  [${tab}] REPAIRED ✓`);
          repaired++;
        } catch (err) {
          console.log(`  [${tab}] REPAIR FAILED ✗ — ${err instanceof Error ? err.message : err}`);
        }
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(`  Done. Created: ${created}, Validated: ${validated}, Repaired: ${repaired}`);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
