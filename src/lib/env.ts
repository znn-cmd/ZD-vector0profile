// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Environment variable access with validation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function getAppMode(): "mock" | "live" {
  const mode = process.env.NEXT_PUBLIC_APP_MODE ?? "mock";
  return mode === "live" ? "live" : "mock";
}

export function isMockMode(): boolean {
  return getAppMode() === "mock";
}

export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export function getTelegramBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

export function getTelegramGroupChatId(): string | null {
  return process.env.TELEGRAM_CHAT_ID ?? null;
}

export function getGoogleSpreadsheetId(): string | null {
  return process.env.GOOGLE_SPREADSHEET_ID ?? null;
}
