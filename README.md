# ZIMA Dubai — Vector Profile

Production-ready MVP for a three-block hiring assessment platform. Candidates complete DISC behavioral, ZIMA role-fit, and Ritchie–Martin motivational assessments. HR/Admin users manage candidates, view results, generate PDF reports, and receive Telegram notifications.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Next.js 14 App Router (Vercel)                                  │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────────────┐ │
│  │ Candidate UI │ │ HR Dashboard │ │ Admin Settings             │ │
│  └──────┬──────┘ └──────┬───────┘ └────────────┬───────────────┘ │
│         │               │                      │                 │
│  ┌──────▼───────────────▼──────────────────────▼───────────────┐ │
│  │                    API Routes (/api/*)                       │ │
│  └──────┬──────────────┬──────────────────┬────────────────────┘ │
│         │              │                  │                      │
│  ┌──────▼──────┐ ┌─────▼─────┐ ┌─────────▼─────────┐           │
│  │ Assessment  │ │ Repository│ │ Notification Layer │           │
│  │ Engine      │ │ Layer     │ │ (Telegram Bot)     │           │
│  │ (pure TS)   │ │ mock/live │ │                    │           │
│  └─────────────┘ └─────┬─────┘ └────────────────────┘           │
│                        │                                         │
│              ┌─────────▼─────────┐                               │
│              │ Google Sheets API │  Google Drive API              │
│              └───────────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) Google Cloud Service Account for live mode
- (Optional) Telegram Bot token

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

For local development, the default `NEXT_PUBLIC_APP_MODE=mock` works out of the box — no external services required.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. (Optional) Bootstrap Google Sheets

Only needed in `live` mode:

```bash
npm run bootstrap-sheets
```

### 5. (Optional) Seed demo data

In **mock** mode, demo data loads automatically (no script needed). For **live** mode (Google Sheets), run:

```bash
npm run seed
```

See [docs/SEED.md](docs/SEED.md) for what is seeded (HR users, candidates, all recommendation bands, role fits, notifications) and bootstrap instructions. For a full checklist see [docs/SETUP-CHECKLIST.md](docs/SETUP-CHECKLIST.md).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_MODE` | No | `mock` (default) or `live` |
| `NEXT_PUBLIC_BASE_URL` | No | App URL, defaults to `http://localhost:3000` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Live only | Google Service Account email |
| `GOOGLE_PRIVATE_KEY` | Live only | Service Account private key (PEM format) |
| `GOOGLE_SPREADSHEET_ID` | Live only | Target Google Spreadsheet ID |
| `GOOGLE_DRIVE_FOLDER_ID` | Live only | Google Drive folder for PDF reports |
| `TELEGRAM_BOT_TOKEN` | No | Telegram Bot API token |
| `TELEGRAM_CHAT_ID` | No | Default group chat ID for notifications |
| `TELEGRAM_GROUP_CHAT_ID` | No | Shared HR group chat ID for dispatcher (optional) |

## Screenshots & UI Overview

_Placeholder: add screenshots for key flows once deployed._

| Screen | Description |
|--------|-------------|
| **Landing** | Invite link entry; HR login entry point |
| **Assessment flow** | Welcome → DISC → ZIMA → Ritchie blocks with progress indicator |
| **Dashboard** | Funnel cards, candidate table, recent notifications |
| **Candidate detail** | Summary card, report link, archive / resend invite |
| **Compare mode** | Side-by-side 2–5 candidates with comparative insights |
| **Admin settings** | Google / Telegram health, report version, notification templates |

## Routes

### Candidate

| Route | Description |
|---|---|
| `/` | Landing page with invite link entry + HR login |
| `/assess/[token]` | Full assessment flow (welcome → DISC → ZIMA → Ritchie → completion) |

### HR Dashboard

| Route | Description |
|---|---|
| `/dashboard` | Overview with funnel cards, quick stats, candidate table, notifications |
| `/dashboard/candidates` | Full candidate list with search, filters, sort, pagination |
| `/dashboard/candidates/[id]` | Candidate detail (scores, profile, progress, insights) |
| `/dashboard/compare?ids=...` | Side-by-side comparison of 2–5 candidates |
| `/dashboard/reports` | Report management with versioning |
| `/dashboard/notifications` | Notification feed with daily digest info |

### Admin

| Route | Description |
|---|---|
| `/dashboard/analytics` | Extended funnel analytics and pipeline metrics |
| `/dashboard/users` | Team member management |
| `/preview` | Assessment preview mode (no data saved) |
| `/admin/settings` | Integration settings hub |
| `/admin/settings/google` | Google Sheets/Drive connection health |
| `/admin/settings/telegram` | Telegram bot status and test messaging |
| `/admin/settings/reports` | Report template version management |
| `/admin/settings/notifications` | Notification template settings |
| `/admin/settings/languages` | Language dictionary management |
| `/admin/settings/assessments` | Assessment config references |

### API

| Endpoint | Methods | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/candidates` | GET, POST | List/create candidates (GET `?archived=1` to include archived) |
| `/api/candidates/[id]` | GET, PATCH, DELETE | Get/update/archive candidate |
| `/api/candidates/search?q=` | GET | Search by name (ФИО), partial match, transliteration |
| `/api/invite?token=` | GET, POST | Validate invite / resend invite |
| `/api/progress` | POST, PUT | Autosave answers / complete block |
| `/api/assessments` | GET, POST | List configs / generate PDF report |
| `/api/notifications` | GET, PUT | List / mark read |
| `/api/webhook/telegram` | GET, POST | Bot health / webhook handler |

## Assessment Engine

Three independent scoring blocks in `src/engine/`:

1. **DISC** — 100 Likert items + 10 SJT cases → D/I/S/C/K scales → weighted overall → band
2. **Ritchie–Martin** — 80 Likert items + 6 forced-choice + 4 mini-cases → 12 motivational scales → role fit
3. **ZIMA** — 50 Likert items → 10 dimensions → role-fit matrix → red flags → environment notes

The engine is pure TypeScript with zero UI/storage dependencies. Run the smoke test:

```bash
npx tsx src/engine/__tests__/engine.example.ts
```

## Report Generation

PDF reports are generated server-side using jsPDF. The `src/reports/` layer provides:

- Full "Personal Vector Profile" PDF with cover, executive summary, DISC/ZIMA/Ritchie profiles, insights, and final recommendation
- Report versioning (V1, V2, V3…) — old reports remain immutable
- Bilingual output (RU/EN) with complete i18n dictionaries
- Web summary card data for dashboard display

Run the report smoke test:

```bash
npx tsx src/reports/__tests__/smoke.ts
```

## Storage Layer

`src/storage/` provides a modular repository pattern:

- **Mock adapters** (default) — in-memory, no external dependencies
- **Google Sheets adapters** — full CRUD with retry, throttling, defensive row handling
- **Google Drive service** — PDF upload with public link generation

Required Sheets tabs: `hr_users`, `candidates`, `assessment_sessions`, `scores`, `reports`, `notification_log`, `audit_log`.

## Notification Layer

`src/notifications/` implements:

- Telegram Bot API client with graceful degradation when no token is configured
- HR registration flow (`/start` deep link)
- Event-driven dispatcher with idempotency (dedup by event key)
- Template-driven messages in RU/EN
- Daily digest generator (per-HR + team summary)

## Connecting Google Sheets & Drive

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable **Google Sheets API** and **Google Drive API**
3. Create a **Service Account** and download the JSON key
4. Extract the `client_email` and `private_key` from the JSON key
5. Create a Google Spreadsheet and share it with the service account email (Editor access)
6. Create a Google Drive folder and share it with the service account email (Editor access)
7. Copy the Spreadsheet ID from the URL: `docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
8. Copy the Drive folder ID from the URL: `drive.google.com/drive/folders/{FOLDER_ID}`
9. Set environment variables:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SPREADSHEET_ID=1abc...xyz
   GOOGLE_DRIVE_FOLDER_ID=1def...uvw
   NEXT_PUBLIC_APP_MODE=live
   ```
10. Run bootstrap: `npm run bootstrap-sheets`

## Connecting the Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token
4. Create a group chat, add the bot, and send a message
5. Get the group chat ID: `https://api.telegram.org/bot{TOKEN}/getUpdates`
6. Set environment variables:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=-100123456789
   TELEGRAM_GROUP_CHAT_ID=-100987654321
   ```
   Use `TELEGRAM_GROUP_CHAT_ID` if you use the event dispatcher with a shared HR group.
7. (Optional) Set the webhook: `https://api.telegram.org/bot{TOKEN}/setWebhook?url={YOUR_URL}/api/webhook/telegram`

## Final Setup Checklist (local)

1. [ ] `npm install`
2. [ ] Copy `.env.example` to `.env.local`
3. [ ] Leave `NEXT_PUBLIC_APP_MODE=mock` for local demo (no Google/Telegram needed)
4. [ ] `npm run dev` → open http://localhost:3000
5. [ ] (Optional) For live: set Google + Telegram env vars, run `npm run bootstrap-sheets`, then `npm run seed`

## Deploying to Vercel

**Пошаговая инструкция на русском (деплой + Google Таблица + Drive):** [docs/DEPLOY-VERCEL-LIVE.md](docs/DEPLOY-VERCEL-LIVE.md)

### Deployment Checklist

- [ ] Push code to GitHub/GitLab
- [ ] Connect repository to Vercel
- [ ] Set all environment variables in Vercel (see table above); **required for live**: `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_DRIVE_FOLDER_ID`
- [ ] Set `NEXT_PUBLIC_APP_MODE=live` for production
- [ ] Set `NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app`
- [ ] Run `npm run bootstrap-sheets` locally (or from a one-off script) so the spreadsheet has the expected tabs and headers (including `archivedAt` on Candidates)
- [ ] Deploy and verify `/api/health` returns `{"status":"ok","mode":"live"}`
- [ ] Test Google: Admin → Settings → Google Integrations → Test Connection
- [ ] Test Telegram: Admin → Settings → Telegram Bot → Check Bot Health
- [ ] Create a candidate and open invite link to confirm assessment flow and report generation

### Vercel Settings

- **Framework Preset**: Next.js
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Node.js Version**: 18.x or 20.x
- **Environment Variables**: Set all from table above

## QA Hardening

This MVP includes:

- **API error handling** — all routes wrapped in try-catch with structured JSON errors
- **Input validation** — required field checks, type guards, trim/normalize
- **Status transition guards** — prevents writing to completed sessions
- **Candidate search** — partial name match + Cyrillic→Latin transliteration fallback
- **Soft archive** — archive sets `archivedAt`; list excludes archived by default; use `GET /api/candidates?archived=1` to include them
- **Report version propagation** — after generating a report, `reportUrl` and `reportVersion` are saved on the results record for the dashboard
- **Audit logging** — structured audit events (e.g. candidate.archived, report.generated) via `src/lib/audit.ts` (console in dev; extensible to storage)
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, no-store
- **Accessibility** — skip-to-content link, semantic HTML, focus-visible, aria labels
- **Loading states** — spinners on dashboard, candidate list, compare, and detail pages
- **Empty states** — descriptive placeholders when no data (e.g. compare mode, notifications)
- **Preview isolation** — preview mode uses only client state; no progress or results saved to storage
- **Mock mode** — full app works without any external services; demo data loads automatically

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** with custom ZIMA brand palette
- **jsPDF** for PDF report generation
- **Google APIs** (Sheets v4, Drive v3) for live storage
- **Telegram Bot API** for notifications
- **Zustand** for client state management
- **lucide-react** for icons
- **date-fns** for date formatting

## License

Proprietary — ZIMA Dubai. All rights reserved.
