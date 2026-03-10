import type { ReportDictionary } from "./types";

export const ru: ReportDictionary = {
  reportTitle: "Personal Vector Profile",
  reportSubtitle: "Комплексная оценка кандидата",
  confidential: "КОНФИДЕНЦИАЛЬНО",
  preparedFor: "Подготовлено для",
  candidateLabel: "Кандидат",
  positionLabel: "Позиция",
  departmentLabel: "Подразделение",
  dateLabel: "Дата оценки",
  versionLabel: "Версия отчёта",
  pageLabel: "Стр.",

  // Sections
  executiveSummary: "Резюме для руководителя",
  overallRecommendation: "Общая рекомендация",
  overallScore: "Общий балл",
  recommendedRole: "Рекомендуемая роль",
  secondaryRole: "Альтернативная роль",

  discSection: "Поведенческий профиль DISC",
  discOverall: "Общий балл DISC",
  discProfile: "Профиль",
  discSJT: "Ситуационное суждение (SJT)",
  discBand: "Категория DISC",
  discScales: "Шкалы",
  discValidity: "Валидность",
  discConsistency: "Согласованность",

  zimaSection: "Анализ ролевого соответствия ZIMA",
  zimaFitScore: "Балл соответствия",
  zimaPrimaryRole: "Основная роль",
  zimaSecondaryRole: "Альтернативная роль",
  zimaDimensions: "Измерения",
  zimaRedFlags: "Критические флаги",
  zimaEnvironment: "Среда и условия",
  zimaTraining: "Рекомендации по обучению",

  ritchieSection: "Мотивационный профиль Ритчи–Мартина",
  ritchieTopMotivators: "Ведущие мотиваторы",
  ritchieBottomMotivators: "Наименее выраженные мотиваторы",
  ritchieRoleFit: "Соответствие ролям",
  ritchieScales: "Шкалы мотивации",

  strengthsSection: "Сильные стороны",
  risksSection: "Факторы риска",
  managementSection: "Рекомендации по управлению",
  interviewSection: "Фокус-вопросы для интервью",
  retentionSection: "Риски удержания",
  finalSection: "Итоговая рекомендация по найму",

  // Band labels
  bands: {
    strong_hire: "Сильный найм",
    recommended: "Рекомендован",
    conditional: "Условно",
    not_recommended: "Не рекомендован",
  },

  discBands: {
    strong_shortlist: "Сильный шорт-лист",
    conditional: "Условно",
    high_risk: "Высокий риск",
  },

  roleFitLabels: {
    strong: "Сильное",
    moderate: "Среднее",
    weak: "Слабое",
  },

  roleLabels: {
    full_cycle: "Полный цикл продаж (AE)",
    hunter: "Хантер (New Business)",
    consultative: "Консультативные продажи",
    team_lead: "Руководитель отдела продаж",
  },

  discScaleLabels: {
    D: "Доминирование",
    I: "Влияние",
    S: "Стабильность",
    C: "Соответствие",
    K: "Контроль",
  },

  ritchieScaleLabels: {
    INC: "Доход",     REC: "Признание",    ACH: "Достижение",
    POW: "Власть",    VAR: "Разнообразие",  AUT: "Автономия",
    STR: "Структура",  REL: "Отношения",    VAL: "Ценности",
    DEV: "Развитие",   SEC: "Безопасность", DRI: "Энергия",
  },

  zimaDimensionLabels: {
    pace: "Темп",            autonomy: "Автономия",
    collaboration: "Командность", risk: "Рискоготовность",
    innovation: "Инновации",  client_focus: "Клиентоцентричность",
    process: "Процессы",      resilience: "Устойчивость",
    ambiguity: "Неопределённость", growth: "Рост",
  },

  severityLabels: { warning: "Предупреждение", critical: "Критический" },
  validLabel: "Валидно",
  invalidLabel: "Невалидно",
  consistentLabel: "Согласовано",
  inconsistentLabel: "Не согласовано",

  generatedBy: "Сформирован системой ZIMA Dubai Vector Profile",
  disclaimer: "Данный отчёт является конфиденциальным и предназначен исключительно для внутреннего использования. Результаты оценки носят рекомендательный характер и должны рассматриваться совместно с результатами интервью и другими данными о кандидате.",
};
