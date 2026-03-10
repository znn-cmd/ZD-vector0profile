// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram — Шаблоны уведомлений (RU)
//
//  Вариант B: общий HR-чат + личные сообщения HR
//  Формат: Telegram HTML (parse_mode: HTML)
//  Интерполяция: {placeholder}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { TelegramTemplateDictionary } from "./types";

export const telegramRU: TelegramTemplateDictionary = {
  lang: "ru",

  // ─── A. Общий HR-чат ──────────────────────────────────────────────

  group: {
    candidate_completed_full_assessment: {
      subject: "Оценка завершена",
      body: [
        "<b>Оценка завершена</b>",
        "",
        "<b>{candidate_name}</b> — {applied_role}",
        "Время прохождения: {duration_minutes} мин",
        "Отчёт будет сформирован автоматически.",
      ].join("\n"),
    },

    report_generated: {
      subject: "Отчёт сформирован",
      body: [
        "<b>Отчёт готов</b> — {candidate_name}",
        "",
        "Категория: <b>{overall_band_label}</b> ({overall_score}/100)",
        "Роль: {primary_role}",
        '<a href="{report_url}">Открыть отчёт</a>',
      ].join("\n"),
    },

    shortlist_candidate: {
      subject: "Кандидат в шорт-лист",
      body: [
        "<b>Шорт-лист</b>",
        "",
        "<b>{candidate_name}</b>",
        "Балл: {overall_score}/100 — {overall_band_label}",
        "Рекомендуемая роль: {primary_role}",
      ].join("\n"),
    },

    critical_red_flags: {
      subject: "Критические флаги",
      body: [
        "<b>Критические флаги</b> — {candidate_name}",
        "",
        "{flags_list}",
        "",
        "Категория: {overall_band_label}",
        "Рекомендуется немедленный пересмотр.",
      ].join("\n"),
    },

    team_daily_summary: {
      subject: "Командная сводка",
      body: [
        "<b>Командная сводка — {date}</b>",
        "",
        "Приглашено: {invited_today}",
        "Начали: {started_today}",
        "Завершили: {completed_today}",
        "Таймаут: {timed_out_today}",
        "В шорт-листе: {shortlisted_today}",
        "Отклонено: {rejected_today}",
        "Ожидают действий: {pending_action_today}",
        "",
        "{top_candidates_list}",
      ].join("\n"),
    },
  },

  // ─── B. Личные сообщения HR ───────────────────────────────────────

  private: {
    candidate_started: {
      subject: "Кандидат начал оценку",
      body: [
        "<b>Кандидат начал оценку</b>",
        "",
        "Имя: <b>{candidate_name}</b>",
        "Позиция: {applied_role}",
        "Язык: {language}",
        "Начало: {timestamp}",
        "",
        "Ожидаемое время: 60–70 минут.",
      ].join("\n"),
    },

    candidate_inactivity_risk: {
      subject: "Риск неактивности кандидата",
      body: [
        "<b>Предупреждение о неактивности</b>",
        "",
        "<b>{candidate_name}</b> — {applied_role}",
        "Неактивен: {minutes_inactive} мин",
        "Текущий блок: {current_block}",
        "Последняя активность: {last_active}",
        "",
        "Кандидат мог покинуть сессию или столкнуться с технической проблемой. Рекомендуется связаться.",
      ].join("\n"),
    },

    disc_completed: {
      subject: "Блок DISC завершён",
      body: [
        "<b>Блок завершён — DISC</b>",
        "",
        "<b>{candidate_name}</b>",
        "Осталось: {blocks_remaining} блок(ов)",
      ].join("\n"),
    },

    zima_completed: {
      subject: "Блок ZIMA завершён",
      body: [
        "<b>Блок завершён — ZIMA Role-Fit</b>",
        "",
        "<b>{candidate_name}</b>",
        "Осталось: {blocks_remaining} блок(ов)",
      ].join("\n"),
    },

    ritchie_completed: {
      subject: "Блок Ritchie–Martin завершён",
      body: [
        "<b>Блок завершён — Ritchie–Martin</b>",
        "",
        "<b>{candidate_name}</b>",
        "Осталось: {blocks_remaining} блок(ов)",
      ].join("\n"),
    },

    assessment_completed: {
      subject: "Оценка полностью завершена",
      body: [
        "<b>Оценка завершена</b>",
        "",
        "<b>{candidate_name}</b>",
        "Позиция: {applied_role}",
        "Время: {duration_minutes} мин",
        "",
        "Все три блока пройдены. Отчёт будет сформирован в ближайшее время.",
      ].join("\n"),
    },

    report_ready: {
      subject: "Отчёт готов",
      body: [
        "<b>Personal Vector Profile — отчёт готов</b>",
        "",
        "Кандидат: <b>{candidate_name}</b>",
        "Позиция: {applied_role}",
        "",
        '<a href="{report_url}">Открыть полный отчёт</a>',
      ].join("\n"),
    },

    result_summary_short: {
      subject: "Краткие результаты оценки",
      body: [
        "<b>Краткие результаты</b>",
        "",
        "Кандидат: <b>{candidate_name}</b>",
        "Позиция: {applied_role}",
        "",
        "Общий балл: <b>{overall_score}/100</b> — {overall_band_label}",
        "Рекомендуемая роль: {primary_role}",
        "Альтернативная роль: {secondary_role}",
        "",
        "<b>Ключевые сильные стороны:</b>",
        "  1. {top_strength_1}",
        "  2. {top_strength_2}",
        "  3. {top_strength_3}",
        "",
        "<b>Основные риски:</b>",
        "  1. {risk_1}",
        "  2. {risk_2}",
        "",
        '<a href="{report_url}">Полный отчёт</a>',
      ].join("\n"),
    },

    personal_daily_digest: {
      subject: "Ежедневный дайджест",
      body: [
        "<b>Дайджест за {date}</b>",
        "",
        "{hr_name}, вот сводка по вашим кандидатам.",
        "",
        "Активных: {total_active}",
        "Завершено сегодня: {completed_today}",
        "Ожидают действий: {pending_action_today}",
        "",
        "{entries_list}",
      ].join("\n"),
    },

    follow_up_required: {
      subject: "Требуется действие",
      body: [
        "<b>Требуется действие</b>",
        "",
        "Кандидат: <b>{candidate_name}</b>",
        "Позиция: {applied_role}",
        "",
        "{action_items}",
        "",
        "Пожалуйста, рассмотрите и примите меры в течение 24 часов.",
      ].join("\n"),
    },
  },

  // ─── Регистрация ──────────────────────────────────────────────────

  registration: {
    registration_success: {
      subject: "Бот подключён",
      body: [
        "<b>ZIMA Vector Profile — подключён</b>",
        "",
        "Здравствуйте, {hr_name}.",
        "Ваш аккаунт ({email}) привязан к этому чату.",
        "Вы будете получать уведомления о кандидатах.",
        "",
        "Язык: Русский",
      ].join("\n"),
    },

    registration_unknown: {
      subject: "Не распознан",
      body: [
        "Ваш Telegram-аккаунт не найден в системе ZIMA.",
        "Обратитесь к администратору для добавления.",
      ].join("\n"),
    },

    registration_already_linked: {
      subject: "Уже подключён",
      body: [
        "Ваш аккаунт уже привязан, {hr_name}.",
        "Уведомления активны.",
      ].join("\n"),
    },
  },

  // ─── Лейблы категорий ─────────────────────────────────────────────

  bandLabels: {
    strong_fit: "Сильное соответствие",
    conditional_fit: "Условное соответствие",
    high_risk: "Высокий риск",
    shortlist: "Шорт-лист",
    interview_with_caution: "Интервью с осторожностью",
    reject: "Не рекомендован",
    reserve_pool: "Резервный пул",
    strong_hire: "Сильный найм",
    recommended: "Рекомендован",
    conditional: "Условно",
    not_recommended: "Не рекомендован",
  },
};
