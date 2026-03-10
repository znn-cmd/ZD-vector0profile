// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Notifications Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Events + payloads
export { EVENT_ROUTING } from "./events";
export type {
  NotificationEventType,
  GroupEventType,
  PrivateEventType,
  NotificationTarget,
  NotificationPayload,
  BaseEventPayload,
  CandidateStartedPayload,
  InactivityRiskPayload,
  BlockCompletedPayload,
  AssessmentCompletedPayload,
  ReportGeneratedPayload,
  ReportReadyPayload,
  CandidateShortlistedPayload,
  CriticalRedFlagsPayload,
  ResultSummaryPayload,
  PersonalDailyDigestPayload,
  TeamDailySummaryPayload,
  DailyDigestEntry,
} from "./events";

// Telegram bot
export { TelegramBotClient, getTelegramBot } from "./telegram/bot.client";
export type { TelegramUpdate, TelegramMessage, SendMessageOptions } from "./telegram/bot.client";

// Registration
export { handleTelegramUpdate, handleRegistration, handleLanguageSwitch } from "./telegram/registration";
export type { RegistrationResult } from "./telegram/registration";

// Dispatcher
export { NotificationDispatcher } from "./dispatcher";

// Digest
export { DigestGenerator } from "./digest";

// Templates
export {
  getTemplates,
  getTemplate,
  getBandLabel,
  interpolate,
  renderMessage,
} from "./templates";
export type { MessageTemplates, MessageTemplate, TemplateKey } from "./templates/types";
