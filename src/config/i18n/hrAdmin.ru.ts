// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HR / Admin UI — Текстовый слой (RU)
//
//  Полное зеркало hrAdmin.en.ts для русского интерфейса.
//  Все ключи идентичны EN-версии для безопасной подстановки.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const hrAdminRU = {

  // ─── Дашборд ────────────────────────────────────────────────────

  dashboard: {
    heading: "Панель управления",
    subtitle: "Воронка оценки одним взглядом",
    welcomeBack: "С возвращением, {name}",
    quickStats: "Ключевые показатели",
    recentActivity: "Последняя активность",
    noActivity: "Нет недавней активности",
    viewAll: "Показать все",
    todaysSummary: "Сводка за сегодня",
  },

  // ─── Таблица кандидатов ─────────────────────────────────────────

  candidateTable: {
    heading: "Кандидаты",
    columns: {
      fullName: "ФИО",
      email: "Email",
      phone: "Телефон",
      position: "Позиция",
      department: "Подразделение",
      status: "Статус",
      assignedHR: "Ответственный HR",
      scoreBand: "Категория",
      overallScore: "Балл",
      primaryRole: "Рекомендуемая роль",
      language: "Язык",
      invitedAt: "Приглашён",
      startedAt: "Начал",
      completedAt: "Завершил",
      lastActive: "Последняя активность",
      actions: "Действия",
    },
    empty: "Нет кандидатов, соответствующих текущим фильтрам",
    loading: "Загрузка кандидатов...",
    totalCount: "{count} кандидат(ов)",
    selectedCount: "{count} выбрано",
    selectAll: "Выбрать всех",
    deselectAll: "Снять выделение",
  },

  // ─── Поиск ──────────────────────────────────────────────────────

  search: {
    placeholder: "Поиск по ФИО",
    placeholderExtended: "Поиск по имени или email",
    noResults: "Кандидаты не найдены",
    minChars: "Введите минимум 2 символа",
    searching: "Поиск...",
  },

  // ─── Фильтры ────────────────────────────────────────────────────

  filters: {
    heading: "Фильтры",
    status: "Статус",
    assignedHR: "Ответственный HR",
    role: "Целевая роль",
    scoreBand: "Категория оценки",
    department: "Подразделение",
    dateRange: "Период",
    language: "Язык",
    clearAll: "Сбросить все фильтры",
    apply: "Применить",
    allStatuses: "Все статусы",
    allHRs: "Все HR-менеджеры",
    allRoles: "Все роли",
    allBands: "Все категории",
    allDepartments: "Все подразделения",
    from: "С",
    to: "По",
  },

  // ─── Карточки воронки ───────────────────────────────────────────

  funnel: {
    heading: "Воронка найма",
    invited: "Приглашения",
    started: "Начали",
    completed: "Завершили",
    timeout: "Таймаут",
    shortlist: "Шорт-лист",
    hired: "Наняты",
    technicalOnly: "Только техрезультат",
    rejected: "Отклонено",
    pending: "Ожидают действий",
    conversionRate: "{pct}% конверсия",
    ofTotal: "из {total}",
  },

  // ─── Статусы кандидата ──────────────────────────────────────────

  candidateStatus: {
    invited: "Приглашён",
    in_progress: "В процессе",
    completed: "Завершено",
    expired: "Истекло",
    withdrawn: "Отозван",
  },

  // ─── Статусы сессии ─────────────────────────────────────────────

  sessionStatus: {
    not_started: "Не начата",
    in_progress: "В процессе",
    completed: "Завершена",
    timed_out: "Время вышло",
    abandoned: "Прервана",
  },

  // ─── Категории оценки ───────────────────────────────────────────

  scoreBand: {
    strong_hire: "Сильный найм",
    recommended: "Рекомендован",
    conditional: "Условно",
    not_recommended: "Не рекомендован",
  },

  // ─── Расширенные лейблы рекомендаций ────────────────────────────

  recommendation: {
    strong_fit: "Сильное соответствие",
    conditional_fit: "Условное соответствие",
    high_risk: "Высокий риск",
    shortlist: "Шорт-лист",
    interview_with_caution: "Интервью с осторожностью",
    reject: "Не рекомендован",
    reserve_pool: "Резервный пул",
    technical_result_only: "Только технический результат",
    pending_review: "Ожидает рассмотрения",
    no_recommendation: "Рекомендация ещё не сформирована",
  },

  // ─── Названия ролей ─────────────────────────────────────────────

  role: {
    full_cycle: "Аккаунт-менеджер полного цикла",
    hunter: "Хантер / Генератор сделок",
    consultative: "Консультативный продавец",
    team_lead: "Тимлид / Старший брокер",
  },

  // ─── Режим сравнения ────────────────────────────────────────────

  compare: {
    heading: "Сравнение кандидатов",
    subtitle: "Параллельное сравнение от 2 до 5 кандидатов",
    selectCandidates: "Выберите кандидатов для сравнения",
    addCandidate: "Добавить кандидата",
    removeCandidate: "Убрать",
    minCandidates: "Выберите минимум 2 кандидатов",
    maxCandidates: "Максимум 5 кандидатов",
    noSelection: "Кандидаты для сравнения не выбраны",
    overallScore: "Общий балл",
    discProfile: "Профиль DISC",
    ritchieTopMotivators: "Ведущие мотиваторы",
    zimaFitScore: "Балл ZIMA Fit",
    primaryRole: "Основная роль",
    secondaryRole: "Альтернативная роль",
    strengths: "Сильные стороны",
    risks: "Риски",
    band: "Категория",
    winner: "Лучшее совпадение",
    exportComparison: "Экспортировать сравнение",
  },

  // ─── Детальная карточка кандидата ────────────────────────────────

  candidateDetail: {
    heading: "Профиль кандидата",
    tabs: {
      overview: "Обзор",
      assessment: "Оценка",
      results: "Результаты",
      reports: "Отчёты",
      activity: "Журнал действий",
    },
    info: {
      personalInfo: "Личная информация",
      assessmentInfo: "Информация об оценке",
      resultsSummary: "Сводка результатов",
      noResults: "Результаты пока недоступны",
      noReport: "Отчёт ещё не сформирован",
    },
  },

  // ─── Действия с отчётами ────────────────────────────────────────

  report: {
    generate: "Сформировать отчёт",
    regenerate: "Сформировать заново",
    download: "Скачать PDF",
    viewOnline: "Открыть онлайн",
    sendToHR: "Отправить HR",
    version: "Версия",
    currentVersion: "Текущая версия: {version}",
    previousVersions: "Предыдущие версии",
    generatedAt: "Сформирован: {date}",
    generatedBy: "Сформирован системой ZIMA Vector Profile",
    templateVersion: "Шаблон: {version}",
    engineVersion: "Движок: {version}",
    status: {
      generating: "Формируется...",
      ready: "Готов",
      failed: "Ошибка формирования",
      archived: "В архиве",
    },
    noReports: "Отчёты ещё не сформированы",
    reportHistory: "История отчётов",
    immutableNote: "Предыдущие версии неизменяемы и остаются доступны.",
  },

  // ─── Архивация ──────────────────────────────────────────────────

  archive: {
    archiveCandidate: "Архивировать кандидата",
    archiveConfirm: "Вы уверены, что хотите архивировать этого кандидата? Архивированные кандидаты скрыты из активных списков, но могут быть восстановлены.",
    archiveSuccess: "Кандидат архивирован",
    restoreCandidate: "Восстановить кандидата",
    restoreConfirm: "Восстановить кандидата в активный список?",
    restoreSuccess: "Кандидат восстановлен",
    archivedAt: "Архивирован: {date}",
    showArchived: "Показать архивных",
    hideArchived: "Скрыть архивных",
    archivedLabel: "В архиве",
  },

  // ─── Повторная отправка приглашения ─────────────────────────────

  resendInvite: {
    action: "Отправить приглашение повторно",
    confirm: "Повторно отправить приглашение на {email}?",
    success: "Приглашение отправлено на {email}",
    alreadyStarted: "Невозможно — кандидат уже начал оценку",
    alreadyCompleted: "Невозможно — оценка уже завершена",
    cooldown: "Подождите перед повторной отправкой (последняя: {date})",
  },

  // ─── Режим предпросмотра ────────────────────────────────────────

  preview: {
    heading: "Режим предпросмотра",
    subtitle: "Тестирование процесса оценки без влияния на рабочие данные",
    badge: "ПРЕДПРОСМОТР",
    disclaimer: "Это тестовая сессия. Данные не будут сохранены в рабочую воронку.",
    launchPreview: "Запустить предпросмотр",
    exitPreview: "Выйти из предпросмотра",
    resetPreview: "Сбросить данные предпросмотра",
    previewAsRole: "Предпросмотр от лица:",
    previewCandidate: "Вид кандидата",
    previewHR: "Вид HR-менеджера",
    previewAdmin: "Вид администратора",
  },

  // ─── Лента уведомлений ──────────────────────────────────────────

  notifications: {
    heading: "Уведомления",
    all: "Все",
    unread: "Непрочитанные",
    markAllRead: "Отметить все как прочитанные",
    markRead: "Отметить как прочитанное",
    empty: "Нет уведомлений",
    loadMore: "Загрузить ещё",
    channelLabel: {
      telegram: "Telegram",
      email: "Email",
      in_app: "В приложении",
    },
    targetLabel: {
      group: "Общий HR-чат",
      private: "Личное сообщение",
    },
    statusLabel: {
      pending: "Ожидает",
      sent: "Отправлено",
      failed: "Ошибка",
      skipped: "Пропущено",
    },
    eventTypes: {
      candidate_started: "Кандидат начал оценку",
      candidate_completed: "Оценка завершена",
      block_completed: "Блок завершён",
      inactivity_risk: "Предупреждение о неактивности",
      report_ready: "Отчёт готов",
      report_generated: "Отчёт сформирован",
      candidate_shortlisted: "Кандидат в шорт-листе",
      critical_red_flags: "Обнаружены критические флаги",
      result_summary: "Сводка результатов отправлена",
      daily_digest: "Ежедневный дайджест",
      team_summary: "Командная сводка",
      follow_up_required: "Требуется действие",
    },
  },

  // ─── Настройки ──────────────────────────────────────────────────

  settings: {
    heading: "Настройки",

    general: {
      heading: "Общие",
      appMode: "Режим приложения",
      appModeMock: "Тестовый (локальная разработка)",
      appModeLive: "Рабочий (Google Sheets + Drive)",
      defaultLanguage: "Язык по умолчанию",
      timezone: "Часовой пояс",
    },

    integrations: {
      heading: "Состояние интеграций",
      googleSheets: "Google Sheets",
      googleDrive: "Google Drive",
      telegramBot: "Telegram Bot",
      lastChecked: "Последняя проверка: {date}",
      status: {
        healthy: "Работает",
        degraded: "Деградация",
        down: "Недоступен",
        not_configured: "Не настроен",
      },
      testConnection: "Проверить подключение",
      reconnect: "Переподключить",
    },

    reportTemplates: {
      heading: "Шаблоны отчётов",
      activeTemplate: "Активный шаблон",
      templateVersion: "Версия шаблона",
      engineVersion: "Версия движка",
      setActive: "Сделать активным",
      preview: "Предпросмотр шаблона",
      sections: "Разделы",
      noTemplates: "Шаблоны отчётов не настроены",
    },

    notificationTemplates: {
      heading: "Шаблоны уведомлений",
      type: "Тип события",
      channel: "Канал",
      language: "Язык",
      subject: "Тема",
      body: "Текст",
      preview: "Предпросмотр",
      edit: "Редактировать",
      restore: "Восстановить по умолчанию",
    },

    assessmentConfig: {
      heading: "Конфигурация оценок",
      blockName: "Блок",
      version: "Версия",
      questionCount: "Вопросы",
      estimatedTime: "Ожидаемое время",
      disc: "Поведенческий профиль DISC",
      zima: "Анализ ролевого соответствия ZIMA",
      ritchie: "Мотивационный профиль Ritchie–Martin",
      viewConfig: "Просмотреть конфигурацию",
    },

    languages: {
      heading: "Языковые настройки",
      active: "Активные языки",
      totalKeys: "Всего ключей",
      coverage: "Покрытие",
      editDictionary: "Редактировать словарь",
    },
  },

  // ─── Управление пользователями (Админ) ──────────────────────────

  users: {
    heading: "Управление пользователями",
    columns: {
      name: "Имя",
      email: "Email",
      role: "Роль",
      status: "Статус",
      telegramLinked: "Telegram привязан",
      language: "Язык",
      lastActive: "Последняя активность",
      actions: "Действия",
    },
    roles: {
      admin: "Администратор",
      hr: "HR-менеджер",
      viewer: "Наблюдатель",
    },
    hrStatus: {
      active: "Активен",
      suspended: "Приостановлен",
    },
    addUser: "Добавить пользователя",
    editUser: "Редактировать пользователя",
    suspendUser: "Приостановить пользователя",
    reactivateUser: "Активировать пользователя",
    telegramStatus: {
      linked: "Привязан",
      notLinked: "Не привязан",
    },
  },

  // ─── Аналитика (Админ) ──────────────────────────────────────────

  analytics: {
    heading: "Аналитика воронки",
    subtitle: "Метрики пайплайна и конверсии",
    period: "Период",
    last7Days: "Последние 7 дней",
    last30Days: "Последние 30 дней",
    last90Days: "Последние 90 дней",
    allTime: "За всё время",
    conversionFunnel: "Конверсионная воронка",
    completionRate: "Процент завершения",
    averageDuration: "Средняя длительность",
    topRoles: "Популярные рекомендованные роли",
    bandDistribution: "Распределение по категориям",
    hrPerformance: "Нагрузка HR",
    exportCSV: "Экспорт CSV",
  },

  // ─── Журнал аудита ──────────────────────────────────────────────

  auditLog: {
    heading: "Журнал аудита",
    columns: {
      timestamp: "Время",
      actor: "Инициатор",
      actorType: "Тип инициатора",
      action: "Действие",
      entity: "Сущность",
      entityId: "ID сущности",
      details: "Подробности",
      ipAddress: "IP-адрес",
    },
    actorTypes: {
      hr: "HR-менеджер",
      admin: "Администратор",
      system: "Система",
      candidate: "Кандидат",
    },
    actions: {
      "candidate.create": "Кандидат создан",
      "candidate.update": "Кандидат обновлён",
      "candidate.archive": "Кандидат архивирован",
      "candidate.restore": "Кандидат восстановлен",
      "candidate.invite_resent": "Приглашение отправлено повторно",
      "session.start": "Сессия начата",
      "session.complete": "Сессия завершена",
      "session.timeout": "Таймаут сессии",
      "session.abandon": "Сессия прервана",
      "report.generate": "Отчёт сформирован",
      "report.download": "Отчёт скачан",
      "report.archive": "Отчёт архивирован",
      "score.compute": "Баллы рассчитаны",
      "user.create": "Пользователь создан",
      "user.update": "Пользователь обновлён",
      "user.suspend": "Пользователь приостановлен",
      "user.reactivate": "Пользователь активирован",
      "notification.send": "Уведомление отправлено",
      "notification.fail": "Ошибка уведомления",
      "settings.update": "Настройки обновлены",
      "preview.launch": "Предпросмотр запущен",
    },
    empty: "Нет записей аудита по текущим фильтрам",
    loadMore: "Загрузить ещё записи",
  },

  // ─── Общие действия и лейблы ────────────────────────────────────

  actions: {
    save: "Сохранить",
    cancel: "Отмена",
    confirm: "Подтвердить",
    delete: "Удалить",
    edit: "Редактировать",
    create: "Создать",
    close: "Закрыть",
    back: "Назад",
    next: "Далее",
    export: "Экспорт",
    import: "Импорт",
    refresh: "Обновить",
    retry: "Повторить",
    copy: "Копировать",
    copied: "Скопировано!",
    loading: "Загрузка...",
    saving: "Сохранение...",
    processing: "Обработка...",
  },

  // ─── Валидация и обратная связь ─────────────────────────────────

  validation: {
    required: "Это поле обязательно",
    invalidEmail: "Некорректный адрес электронной почты",
    minLength: "Минимум {min} символов",
    maxLength: "Максимум {max} символов",
    success: "Изменения успешно сохранены",
    error: "Произошла ошибка. Попробуйте ещё раз.",
    confirmAction: "Вы уверены?",
    unsavedChanges: "Есть несохранённые изменения. Отменить их?",
    noPermission: "У вас нет прав для этого действия",
  },

  // ─── Пустые состояния ───────────────────────────────────────────

  empty: {
    noCandidates: "Кандидатов пока нет",
    noCandidatesHint: "Пригласите первого кандидата, чтобы начать",
    noResults: "Ничего не найдено",
    noReports: "Отчёты не сформированы",
    noNotifications: "Всё прочитано — новых уведомлений нет",
    noAuditEntries: "Нет записей аудита за выбранный период",
    noComparisonData: "Выберите кандидатов для отображения сравнения",
  },

} as const;

export type HRAdminDictRU = typeof hrAdminRU;
