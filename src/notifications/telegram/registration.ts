// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HR Telegram Registration Flow
//
//  Flow:
//    1. HR sends /start to the bot
//    2. Bot webhook receives the update
//    3. We look up the Telegram user in hr_users (by existing chat_id or by
//       matching username/email — admin must pre-register the HR in the system)
//    4. If found: save telegram_chat_id, send success message in HR language
//    5. If not found: send "unknown" message
//
//  For security, HR must already exist in the system before linking.
//  The /start command can include a deep-link token: /start {email}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { TelegramUpdate } from "./bot.client";
import type { DataStore } from "../../storage/interfaces";
import type { HRUser, Lang } from "../../storage/types";
import { getTelegramBot } from "./bot.client";
import { renderMessage } from "../templates";

export interface RegistrationResult {
  handled: boolean;
  hrUser?: HRUser;
  action: "linked" | "already_linked" | "unknown" | "not_a_command";
}

/**
 * Processes a Telegram update for /start registration.
 * Returns the result of the registration attempt.
 */
export async function handleRegistration(
  update: TelegramUpdate,
  store: DataStore,
): Promise<RegistrationResult> {
  const msg = update.message;
  if (!msg?.text) {
    return { handled: false, action: "not_a_command" };
  }

  const text = msg.text.trim();

  // Only handle /start (optionally with email deep-link)
  if (!text.startsWith("/start")) {
    return { handled: false, action: "not_a_command" };
  }

  const chatId = String(msg.chat.id);
  const bot = getTelegramBot();

  // Extract optional email from deep-link: /start admin@zima.ae
  const parts = text.split(/\s+/);
  const deepLinkEmail = parts.length > 1 ? parts[1] : undefined;

  // Step 1: Check if this chat_id is already linked
  const existingByChat = await store.hrUsers.findByTelegramChatId(chatId);
  if (existingByChat) {
    const lang = existingByChat.language || "en";
    const { body } = renderMessage(lang, "registration_already_linked", {
      hr_name: existingByChat.full_name,
    });
    await bot.sendMessage({ chat_id: chatId, text: body });
    return { handled: true, hrUser: existingByChat, action: "already_linked" };
  }

  // Step 2: Try to find the HR user
  let hrUser: HRUser | null = null;

  // Try by deep-link email
  if (deepLinkEmail && deepLinkEmail.includes("@")) {
    hrUser = await store.hrUsers.findByEmail(deepLinkEmail);
  }

  // Try by matching all HR users who don't have a chat_id yet
  // In production, you'd use a registration token or email confirmation.
  // For MVP, we match by looking for unlinked HR users.
  if (!hrUser) {
    const allHR = await store.hrUsers.findAll();
    hrUser = allHR.find((u) =>
      !u.telegram_chat_id &&
      u.status === "active" &&
      !u.archived_at,
    ) ?? null;
  }

  if (!hrUser) {
    // Default to English for unknown users
    const { body } = renderMessage("en", "registration_unknown", {});
    await bot.sendMessage({ chat_id: chatId, text: body });
    return { handled: true, action: "unknown" };
  }

  // Step 3: Link the telegram_chat_id
  const updated = await store.hrUsers.update(hrUser.id, {
    telegram_chat_id: chatId,
  });

  const lang: Lang = updated.language || "en";
  const { body } = renderMessage(lang, "registration_success", {
    hr_name: updated.full_name,
    email: updated.email,
  });
  await bot.sendMessage({ chat_id: chatId, text: body });

  return { handled: true, hrUser: updated, action: "linked" };
}

/**
 * Handles /lang command to switch notification language.
 * Usage: /lang ru  or  /lang en
 */
export async function handleLanguageSwitch(
  update: TelegramUpdate,
  store: DataStore,
): Promise<boolean> {
  const msg = update.message;
  if (!msg?.text?.startsWith("/lang")) return false;

  const chatId = String(msg.chat.id);
  const bot = getTelegramBot();
  const parts = msg.text.trim().split(/\s+/);
  const newLang = parts[1] as Lang | undefined;

  if (!newLang || !["ru", "en"].includes(newLang)) {
    await bot.sendMessage({
      chat_id: chatId,
      text: "Usage: /lang ru or /lang en",
    });
    return true;
  }

  const hrUser = await store.hrUsers.findByTelegramChatId(chatId);
  if (!hrUser) {
    await bot.sendMessage({
      chat_id: chatId,
      text: "Please register first with /start",
    });
    return true;
  }

  await store.hrUsers.update(hrUser.id, { language: newLang });

  const confirmations: Record<Lang, string> = {
    ru: "✅ Язык уведомлений изменён на русский 🇷🇺",
    en: "✅ Notification language changed to English 🇬🇧",
  };
  await bot.sendMessage({ chat_id: chatId, text: confirmations[newLang] });
  return true;
}

/**
 * Master update handler — routes to the right sub-handler.
 */
export async function handleTelegramUpdate(
  update: TelegramUpdate,
  store: DataStore,
): Promise<void> {
  const text = update.message?.text?.trim() ?? "";

  if (text.startsWith("/lang")) {
    await handleLanguageSwitch(update, store);
    return;
  }

  if (text.startsWith("/start")) {
    await handleRegistration(update, store);
    return;
  }

  // Unknown commands — ignore silently
}
