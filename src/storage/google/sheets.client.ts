// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Low-level Google Sheets API Client
//
//  Provides atomic operations on a spreadsheet with:
//  - Automatic retry on rate-limit / transient errors
//  - Defensive header validation
//  - Malformed-row recovery
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { google, type sheets_v4 } from "googleapis";
import { getGoogleAuth } from "./auth";
import { withRetry } from "../helpers/retry";

export interface SheetMetadata {
  sheetId: number;
  title: string;
  rowCount: number;
  columnCount: number;
}

export class SheetsClient {
  private api: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(spreadsheetId?: string) {
    const id = spreadsheetId ?? process.env.GOOGLE_SPREADSHEET_ID;
    if (!id) {
      throw new Error("Missing GOOGLE_SPREADSHEET_ID environment variable.");
    }
    this.spreadsheetId = id;
    this.api = google.sheets({ version: "v4", auth: getGoogleAuth() });
  }

  // ─── Read ────────────────────────────────────────────────────────

  /** Returns all rows including the header row. */
  async getSheetData(tabName: string): Promise<string[][]> {
    return withRetry(async () => {
      const res = await this.api.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: tabName,
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
      });
      return (res.data.values as string[][] | undefined) ?? [];
    });
  }

  /** Returns rows 2+ (data only, no header). */
  async getDataRows(tabName: string): Promise<string[][]> {
    const all = await this.getSheetData(tabName);
    return all.slice(1);
  }

  /** Returns the header row (row 1). */
  async getHeaders(tabName: string): Promise<string[]> {
    const all = await this.getSheetData(tabName);
    return all[0] ?? [];
  }

  // ─── Write ───────────────────────────────────────────────────────

  /** Appends one or more rows to the bottom of a tab. */
  async appendRows(tabName: string, rows: string[][]): Promise<void> {
    await withRetry(async () => {
      await this.api.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${tabName}!A1`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: rows },
      });
    });
  }

  /** Overwrites a specific range (e.g. "candidates!A5:O5"). */
  async updateRange(range: string, values: string[][]): Promise<void> {
    await withRetry(async () => {
      await this.api.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: { values },
      });
    });
  }

  /**
   * Finds a row by scanning the ID column (column A) and updates it.
   * Returns the 1-based row number, or null if not found.
   */
  async updateRowById(
    tabName: string,
    id: string,
    rowValues: string[],
  ): Promise<number | null> {
    const all = await this.getSheetData(tabName);
    const rowIndex = all.findIndex((row, i) => i > 0 && row[0] === id);
    if (rowIndex === -1) return null;

    const rowNumber = rowIndex + 1; // Sheets is 1-indexed
    const endCol = columnToLetter(rowValues.length);
    const range = `${tabName}!A${rowNumber}:${endCol}${rowNumber}`;
    await this.updateRange(range, [rowValues]);
    return rowNumber;
  }

  // ─── Metadata / Admin ────────────────────────────────────────────

  async getSpreadsheetMetadata(): Promise<SheetMetadata[]> {
    return withRetry(async () => {
      const res = await this.api.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: "sheets.properties",
      });
      return (res.data.sheets ?? []).map((s) => ({
        sheetId: s.properties?.sheetId ?? 0,
        title: s.properties?.title ?? "",
        rowCount: s.properties?.gridProperties?.rowCount ?? 0,
        columnCount: s.properties?.gridProperties?.columnCount ?? 0,
      }));
    });
  }

  async createTab(title: string): Promise<void> {
    await withRetry(async () => {
      await this.api.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title } } }],
        },
      });
    });
  }

  async setHeaders(tabName: string, headers: string[]): Promise<void> {
    const endCol = columnToLetter(headers.length);
    await this.updateRange(`${tabName}!A1:${endCol}1`, [headers]);
  }

  /**
   * Freezes the header row and bolds it.
   */
  async formatHeaderRow(tabName: string): Promise<void> {
    const meta = await this.getSpreadsheetMetadata();
    const sheet = meta.find((s) => s.title === tabName);
    if (!sheet) return;

    await withRetry(async () => {
      await this.api.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheet.sheetId,
                  gridProperties: { frozenRowCount: 1 },
                },
                fields: "gridProperties.frozenRowCount",
              },
            },
            {
              repeatCell: {
                range: {
                  sheetId: sheet.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: { red: 0.93, green: 0.93, blue: 0.93 },
                  },
                },
                fields: "userEnteredFormat(textFormat,backgroundColor)",
              },
            },
          ],
        },
      });
    });
  }

  /** Validates that a tab has the expected headers. Returns missing headers. */
  async validateHeaders(tabName: string, expected: string[]): Promise<string[]> {
    const actual = await this.getHeaders(tabName);
    return expected.filter((h) => !actual.includes(h));
  }

  /** Tests connectivity by fetching spreadsheet title. */
  async testConnection(): Promise<{ ok: boolean; title?: string; error?: string }> {
    try {
      const res = await this.api.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: "properties.title",
      });
      return { ok: true, title: res.data.properties?.title ?? "Unknown" };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

// ─── Utility ─────────────────────────────────────────────────────────

function columnToLetter(colNum: number): string {
  let letter = "";
  let n = colNum;
  while (n > 0) {
    const mod = (n - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    n = Math.floor((n - mod) / 26);
  }
  return letter;
}
