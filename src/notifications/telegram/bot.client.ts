// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram Bot Client
//  Low-level HTTP wrapper for the Telegram Bot API.
//  No external SDK — just fetch + retry.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { withRetry } from "../../storage/helpers/retry";

export interface TelegramMessage {
  message_id: number;
  chat: { id: number; type: string; title?: string };
  from?: { id: number; first_name: string; last_name?: string; username?: string };
  text?: string;
  date: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface SendMessageOptions {
  chat_id: string | number;
  text: string;
  parse_mode?: "HTML" | "MarkdownV2";
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export class TelegramBotClient {
  private baseUrl: string;
  private token: string;

  constructor(token?: string) {
    this.token = token ?? process.env.TELEGRAM_BOT_TOKEN ?? "";
    if (!this.token) {
      console.warn("[TelegramBot] No TELEGRAM_BOT_TOKEN set — messages will be logged but not sent.");
    }
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }

  get isConfigured(): boolean {
    return this.token.length > 0;
  }

  private async call<T>(method: string, body?: Record<string, unknown>): Promise<T> {
    if (!this.isConfigured) {
      throw new Error("Telegram bot token not configured");
    }

    return withRetry(async () => {
      const res = await fetch(`${this.baseUrl}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = (await res.json()) as TelegramApiResponse<T>;

      if (!data.ok) {
        const err = new Error(`Telegram API error: ${data.description ?? "Unknown error"}`) as Error & { code?: number };
        err.code = data.error_code;
        throw err;
      }

      return data.result!;
    }, {
      maxRetries: 3,
      retryableStatuses: [429, 500, 502, 503],
    });
  }

  // ─── Core Methods ──────────────────────────────────────────────

  async sendMessage(opts: SendMessageOptions): Promise<TelegramMessage | null> {
    if (!this.isConfigured) {
      console.log(`[TelegramBot][mock] → chat ${opts.chat_id}: ${opts.text.slice(0, 80)}...`);
      return null;
    }
    return this.call<TelegramMessage>("sendMessage", {
      chat_id: opts.chat_id,
      text: opts.text,
      parse_mode: opts.parse_mode ?? "HTML",
      disable_web_page_preview: opts.disable_web_page_preview ?? true,
      disable_notification: opts.disable_notification ?? false,
    });
  }

  async getMe(): Promise<{ id: number; first_name: string; username: string }> {
    return this.call("getMe");
  }

  /** Sets the webhook URL for receiving updates. */
  async setWebhook(url: string): Promise<boolean> {
    return this.call("setWebhook", { url });
  }

  async deleteWebhook(): Promise<boolean> {
    return this.call("deleteWebhook");
  }

  /** For testing: sends a message and returns success/failure. */
  async testConnection(chatId: string | number): Promise<{ ok: boolean; error?: string }> {
    try {
      await this.sendMessage({
        chat_id: chatId,
        text: "✅ ZIMA Vector Profile — bot connection test successful.",
      });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

let _instance: TelegramBotClient | null = null;

export function getTelegramBot(): TelegramBotClient {
  if (!_instance) _instance = new TelegramBotClient();
  return _instance;
}
