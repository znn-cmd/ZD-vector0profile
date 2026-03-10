// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Russian Message Templates
//  All strings use {placeholder} interpolation.
//  HTML formatting for Telegram (parse_mode: HTML).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { MessageTemplates } from "./types";

export const ru: MessageTemplates = {

  // ─── Private HR Messages ─────────────────────────────────────────

  candidate_started: {
    subject: "Кандидат начал оценку",
    body: [
      "📋 <b>Кандидат начал оценку</b>",
      "",
      "👤 {candidate_name}",
      "📌 Позиция: {position}",
      "🌐 Язык: {language}",
      "🕐 Начало: {timestamp}",
      "",
      "Ожидаемое время прохождения: 60–70 минут.",
    ].join("\n"),
  },

  inactivity_risk: {
    subject: "Риск неактивности кандидата",
    body: [
      "⚠️ <b>Риск неактивности</b>",
      "",
      "👤 {candidate_name}",
      "⏱ Неактивен: {minutes_inactive} мин.",
      "📦 Текущий блок: {current_block}",
      "🕐 Последняя активность: {last_active}",
      "",
      "Возможно, кандидат покинул оценку или возникли технические проблемы.",
    ].join("\n"),
  },

  block_completed: {
    subject: "Блок оценки завершён",
    body: [
      "✅ <b>Блок завершён</b>",
      "",
      "👤 {candidate_name}",
      "📦 Блок: {block_label}",
      "📊 Осталось блоков: {blocks_remaining}",
    ].join("\n"),
  },

  assessment_completed_private: {
    subject: "Оценка завершена",
    body: [
      "🎯 <b>Оценка полностью завершена</b>",
      "",
      "👤 {candidate_name}",
      "📌 Позиция: {position}",
      "⏱ Время прохождения: {duration_minutes} мин.",
      "",
      "Отчёт будет сформирован автоматически.",
    ].join("\n"),
  },

  report_ready: {
    subject: "Отчёт готов",
    body: [
      "📄 <b>Отчёт Personal Vector Profile готов</b>",
      "",
      "👤 {candidate_name}",
      "🔗 <a href=\"{report_url}\">Открыть отчёт</a>",
    ].join("\n"),
  },

  result_summary: {
    subject: "Результаты оценки",
    body: [
      "📊 <b>Результаты оценки кандидата</b>",
      "",
      "👤 <b>{candidate_name}</b>",
      "📌 Позиция: {position}",
      "🏷 Общий балл: <b>{overall_score}/100</b>",
      "📈 Категория: <b>{overall_band_label}</b>",
      "🎯 Рекомендуемая роль: {recommended_role}",
      "🔄 Альтернативная роль: {secondary_role}",
      "",
      "💪 <b>Сильные стороны:</b>",
      "{strengths_list}",
      "",
      "⚠️ <b>Риски:</b>",
      "{risks_list}",
      "",
      "🔗 <a href=\"{report_url}\">Полный отчёт Personal Vector Profile</a>",
    ].join("\n"),
  },

  personal_daily_digest: {
    subject: "Ежедневный дайджест",
    body: [
      "📅 <b>Дайджест за {date}</b>",
      "",
      "👋 {hr_name}, вот сводка по вашим кандидатам:",
      "",
      "📊 Активных: {total_active}",
      "✅ Завершено сегодня: {total_completed_today}",
      "",
      "{entries_list}",
    ].join("\n"),
  },

  // ─── Group Messages ──────────────────────────────────────────────

  assessment_completed_group: {
    subject: "Оценка завершена",
    body: [
      "🎯 <b>{candidate_name}</b> завершил(а) оценку",
      "📌 {position} · ⏱ {duration_minutes} мин.",
    ].join("\n"),
  },

  report_generated_group: {
    subject: "Отчёт сформирован",
    body: [
      "📄 Отчёт готов: <b>{candidate_name}</b>",
      "📈 {overall_band_label} · 🔗 <a href=\"{report_url}\">Открыть</a>",
    ].join("\n"),
  },

  candidate_shortlisted: {
    subject: "Кандидат в шорт-лист",
    body: [
      "⭐️ <b>Шорт-лист: {candidate_name}</b>",
      "",
      "🏷 Балл: {overall_score}/100 ({overall_band_label})",
      "🎯 Роль: {recommended_role}",
    ].join("\n"),
  },

  critical_red_flags: {
    subject: "Критические флаги",
    body: [
      "🚩 <b>Критические флаги: {candidate_name}</b>",
      "",
      "{flags_list}",
      "",
      "📈 Категория: {overall_band_label}",
    ].join("\n"),
  },

  team_daily_summary: {
    subject: "Командная сводка",
    body: [
      "📅 <b>Командная сводка за {date}</b>",
      "",
      "📊 Активных кандидатов: {total_active}",
      "✅ Завершено сегодня: {completed_today}",
      "📄 Отчётов: {reports_generated}",
      "⭐️ В шорт-листе: {shortlisted_today}",
      "🚩 Критических флагов: {red_flags_today}",
      "",
      "{top_candidates_list}",
    ].join("\n"),
  },

  // ─── Registration ────────────────────────────────────────────────

  registration_success: {
    subject: "Бот подключён",
    body: [
      "✅ <b>ZIMA Vector Profile — бот подключён</b>",
      "",
      "Здравствуйте, {hr_name}!",
      "Ваш аккаунт ({email}) привязан к этому чату.",
      "Вы будете получать уведомления о ваших кандидатах.",
      "",
      "Язык уведомлений: Русский 🇷🇺",
    ].join("\n"),
  },

  registration_unknown: {
    subject: "Не распознан",
    body: [
      "❌ Ваш Telegram-аккаунт не найден в системе ZIMA.",
      "Обратитесь к администратору для добавления.",
    ].join("\n"),
  },

  registration_already_linked: {
    subject: "Уже подключён",
    body: [
      "ℹ️ Ваш аккаунт уже привязан, {hr_name}.",
      "Уведомления активны.",
    ].join("\n"),
  },

  // ─── Helpers ─────────────────────────────────────────────────────

  band_labels: {
    strong_hire: "Сильный найм ⭐️",
    recommended: "Рекомендован ✅",
    conditional: "Условно 🔶",
    not_recommended: "Не рекомендован ❌",
  },
};
