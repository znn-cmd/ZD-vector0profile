export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
}

const TELEGRAM_API = "https://api.telegram.org";

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

function getDefaultChatId(): string | null {
  return process.env.TELEGRAM_CHAT_ID ?? null;
}

export async function sendTelegramMessage(
  msg: TelegramMessage
): Promise<{ ok: boolean; message: string }> {
  const token = getBotToken();
  if (!token) {
    return { ok: false, message: "TELEGRAM_BOT_TOKEN not configured" };
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: msg.chatId,
        text: msg.text,
        parse_mode: msg.parseMode ?? "HTML",
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      return { ok: false, message: data.description ?? "Telegram API error" };
    }
    return { ok: true, message: "Message sent" };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function notifyCandidateStarted(candidateName: string, position: string) {
  const chatId = getDefaultChatId();
  if (!chatId) return;

  await sendTelegramMessage({
    chatId,
    text:
      `🟡 <b>Assessment Started</b>\n` +
      `Candidate: ${candidateName}\n` +
      `Position: ${position}`,
  });
}

export async function notifyCandidateCompleted(candidateName: string, position: string) {
  const chatId = getDefaultChatId();
  if (!chatId) return;

  await sendTelegramMessage({
    chatId,
    text:
      `🟢 <b>Assessment Completed</b>\n` +
      `Candidate: ${candidateName}\n` +
      `Position: ${position}`,
  });
}

export async function notifyReportReady(
  candidateName: string,
  reportUrl: string
) {
  const chatId = getDefaultChatId();
  if (!chatId) return;

  await sendTelegramMessage({
    chatId,
    text:
      `📄 <b>Report Ready</b>\n` +
      `Candidate: ${candidateName}\n` +
      `<a href="${reportUrl}">View Report</a>`,
  });
}

export async function testTelegramBot(): Promise<{
  ok: boolean;
  botName?: string;
  message: string;
}> {
  const token = getBotToken();
  if (!token) {
    return { ok: false, message: "TELEGRAM_BOT_TOKEN not configured" };
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/getMe`);
    const data = await res.json();
    if (!data.ok) {
      return { ok: false, message: data.description ?? "Bot error" };
    }
    return {
      ok: true,
      botName: data.result.username,
      message: `Bot @${data.result.username} is active`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
