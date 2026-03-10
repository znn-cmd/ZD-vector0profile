# Demo / Seed Data — ZIMA Dubai Vector Profile

Seed data is designed for **real-estate hiring context**: realistic candidate names (multilingual), positions (Sales Manager, Broker, Team Lead, etc.), and assessment outcomes across all recommendation bands and role fits.

## What is seeded

| Entity | Count | Description |
|--------|--------|-------------|
| **HR users** | 4 | Russian- and English-speaking; admin + HR roles |
| **Candidates** | 10 | Mix of statuses: invited, in_progress, completed, report_generated, report_sent |
| **Sessions** | 9 | 8 completed, 1 in progress (for resume flow) |
| **Results** | 8 | Full assessment results with summary fields for dashboard and compare mode |
| **Notifications** | 6 | Report ready, candidate completed, candidate started |

## Recommendation bands covered

- **Shortlist (Strong fit)** — e.g. Алексей Иванов (hunter), Emma Richardson (full_cycle), Fatima Al-Maktoum (hunter), Ирина Новикова (full_cycle)
- **Interview with caution** — e.g. Ольга Смирнова (consultative), Marcus Chen (team_lead)
- **Reserve pool** — e.g. Дмитрий Козлов
- **Reject** — e.g. James O'Brien

## Role fits covered

- **Hunter** — strong closing drive, high achievement/recognition
- **Full-cycle** — balanced drive and process, client focus
- **Consultative** — relationship focus, long-cycle fit
- **Team lead** — authority/achievement motivation, leadership potential

## Mock mode (default)

With `NEXT_PUBLIC_APP_MODE=mock`, seed data is **loaded automatically** when the app starts. No script needed.

- Open the app → Dashboard shows demo candidates, funnel cards, notifications.
- Candidate detail and compare mode use the same demo results (overall score, band, recommendation, strengths/risks, report URL placeholder).
- Report links are placeholders (e.g. `https://drive.google.com/file/d/demo-file-001/view`).

## Live mode (Google Sheets)

To seed a **Google Spreadsheet** (e.g. after switching to `NEXT_PUBLIC_APP_MODE=live`):

1. **Bootstrap sheets** (if not already done):
   ```bash
   npm run bootstrap-sheets
   ```
   This uses `scripts/bootstrap-sheets.ts`. Ensure the spreadsheet has tabs expected by the app: see `src/lib/google/sheets.ts` for names (`Candidates`, `Sessions`, `Results`, `Notifications`, `HR_Users`). If your bootstrap script creates different tab names, create the expected tabs or align the app’s `SHEET_NAMES`.

2. **Set environment variables**:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=...
   GOOGLE_PRIVATE_KEY="..."
   GOOGLE_SPREADSHEET_ID=...
   ```

3. **Run the seed script**:
   ```bash
   npm run seed
   ```
   This runs `scripts/seed-demo-data.ts`, which reads from `src/seed/demo-data.ts` and appends rows to the spreadsheet.

4. **Idempotency**: The script **appends** rows. Running it multiple times will duplicate data. For a clean slate, clear the data rows (keep headers) in each tab, then run `npm run seed` again.

## File layout

- **`src/seed/demo-data.ts`** — Single source of truth: demo IDs, HR users, candidates, sessions, results, notifications. Used by the mock adapter and by the Sheets seed script.
- **`src/seed/index.ts`** — Re-exports for consumers.
- **`src/lib/reporting/resultsToSummaryCard.ts`** — Builds `WebSummaryCard` from stored `AssessmentResults` (so candidate detail and compare mode get correct bands, roles, and reasons).
- **`scripts/seed-demo-data.ts`** — Writes demo data to Google Sheets in the format expected by `src/lib/repositories/sheets-adapter.ts`.

## Compare mode

To try compare mode with demo data:

1. Go to **Dashboard → Candidates**.
2. Select 2–5 candidates that have **report_generated** or **report_sent** (e.g. Алексей Иванов, Emma Richardson, Ольга Смирнова).
3. Click **Compare**.
4. The compare view uses the same summary card data (scores, bands, role fits) from the seed results.

## Customising seed data

Edit **`src/seed/demo-data.ts`**:

- **`DEMO_IDS`** — Stable IDs for HR, candidates, and sessions. Do not change if you rely on existing links or stored references.
- **`DEMO_HR_USERS`** — Add/change HR users (name, email, role, language).
- **`DEMO_CANDIDATES`** — Add/change candidates (name, position, status, hrId, lang, etc.).
- **`buildDemoSessions()`** — Adjust which candidate has an in-progress session.
- **`buildDemoResults()`** — Add or change assessment results (overall score, band, primary/secondary role, recommendation, strengths, risks, report URL).
- **`buildDemoNotifications()`** — Add or change notification entries.

After changes, restart the dev server in mock mode, or re-run `npm run seed` in live mode (after clearing existing data if you want to avoid duplicates).
