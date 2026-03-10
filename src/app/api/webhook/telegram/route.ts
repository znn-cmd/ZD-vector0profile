import { NextRequest } from "next/server";
import { testTelegramBot, sendTelegramMessage } from "@/lib/services/telegram";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET() {
  try {
    const status = await testTelegramBot();
    return jsonOk(status);
  } catch (err) {
    console.error("[GET /api/webhook/telegram]", err);
    return jsonError("Failed to check bot status", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Telegram webhook updates (from Telegram servers)
    if (body.update_id && body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text ?? "";

      if (text.startsWith("/start")) {
        // HR registration via deep link would be handled here
        await sendTelegramMessage({
          chatId,
          text: "Welcome to ZIMA Dubai Vector Profile bot. You will receive assessment notifications here.",
        });
        return jsonOk({ ok: true });
      }

      return jsonOk({ ok: true });
    }

    // Handle manual test sends (from admin UI)
    const { chatId, text } = body as { chatId?: string; text?: string };
    if (!chatId || !text) return jsonError("chatId and text required");

    const result = await sendTelegramMessage({ chatId, text });
    return jsonOk(result);
  } catch (err) {
    console.error("[POST /api/webhook/telegram]", err);
    return jsonError("Failed to process webhook", 500);
  }
}
