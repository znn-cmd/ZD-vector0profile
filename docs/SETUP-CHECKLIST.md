# ZIMA Dubai Vector Profile — Setup & Deployment Checklist

## Local development (mock mode)

- [ ] Node.js 18+ installed
- [ ] `npm install`
- [ ] Copy `.env.example` to `.env.local` (optional; defaults work)
- [ ] `npm run dev` → http://localhost:3000
- [ ] Demo data loads automatically; no Google or Telegram needed

## Live mode (Google Sheets + optional Telegram)

### Environment

- [ ] `NEXT_PUBLIC_APP_MODE=live`
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` = service account email
- [ ] `GOOGLE_PRIVATE_KEY` = PEM private key (escape newlines as `\n` in .env)
- [ ] `GOOGLE_SPREADSHEET_ID` = ID from spreadsheet URL
- [ ] `GOOGLE_DRIVE_FOLDER_ID` = folder ID for PDF reports
- [ ] (Optional) `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_GROUP_CHAT_ID`
- [ ] (Optional) `NEXT_PUBLIC_BASE_URL` = app URL for report links

### Google setup

- [ ] Google Cloud project created
- [ ] Google Sheets API and Drive API enabled
- [ ] Service account created and JSON key downloaded
- [ ] Spreadsheet created and shared with service account email (Editor)
- [ ] Drive folder created and shared with service account email (Editor)
- [ ] `npm run bootstrap-sheets` run once to create tabs and headers
- [ ] (Optional) `npm run seed` to load demo data into Sheets

### Telegram (optional)

- [ ] Bot created via @BotFather; token copied
- [ ] Group created; bot added; group chat ID obtained via getUpdates
- [ ] Env vars set; test via Admin → Settings → Telegram Bot

## Vercel deployment

- [ ] Repository connected to Vercel
- [ ] All env vars from “Environment Variables” table in README set in Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` = production URL (e.g. `https://your-app.vercel.app`)
- [ ] Build succeeds; `/api/health` returns `{"status":"ok","mode":"live"}`
- [ ] Bootstrap and (optional) seed run against the production spreadsheet
- [ ] One candidate created and invite link tested end-to-end

## Post-deploy verification

- [ ] Dashboard loads; funnel cards and candidate list work
- [ ] Candidate detail and report generation work
- [ ] Compare mode works for 2+ candidates
- [ ] Admin settings: Google and Telegram health checks pass (if configured)
- [ ] Audit events appear in server logs (e.g. report.generated, candidate.archived)
