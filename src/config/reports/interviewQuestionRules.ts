// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interview Follow-Up Question Rules
//
//  Config-driven, deterministic rules that map assessment score
//  conditions to specific behavioral interview questions.
//
//  Each rule declares:
//  - a stable ID
//  - a theme group
//  - a bilingual question text (EN + RU)
//  - trigger conditions referencing FinalProfile data
//  - a priority (higher = more important when trimming to 5–10)
//
//  The composer evaluates all rules against a FinalProfile,
//  collects triggered questions, groups by theme, sorts by
//  priority, and trims to the 5–10 range.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DISCScale, RitchieScale, ZIMADimension, SalesRole, OverallBand } from "@/engine/types";

// ─── Theme Group ────────────────────────────────────────────────────

export type InterviewTheme =
  | "process_discipline"
  | "integrity_coachability"
  | "endurance_stability"
  | "assertiveness_rapport"
  | "structure_vs_influence"
  | "motivational_alignment"
  | "hunter_validation"
  | "consultative_validation"
  | "leadership_potential"
  | "validity_concern"
  | "consistency_concern"
  | "resilience_pressure"
  | "environmental_fit";

export const THEME_LABELS: Record<InterviewTheme, { en: string; ru: string }> = {
  process_discipline:      { en: "Process Discipline & CRM",          ru: "Дисциплина процессов и CRM" },
  integrity_coachability:  { en: "Integrity & Coachability",          ru: "Честность и обучаемость" },
  endurance_stability:     { en: "Long-Cycle Endurance",              ru: "Выносливость в длинном цикле" },
  assertiveness_rapport:   { en: "Assertiveness vs. Rapport Balance", ru: "Баланс напористости и раппорта" },
  structure_vs_influence:  { en: "Structure vs. Influence Balance",   ru: "Баланс структуры и влияния" },
  motivational_alignment:  { en: "Motivational Alignment",            ru: "Мотивационное соответствие" },
  hunter_validation:       { en: "Hunter Profile Validation",         ru: "Валидация профиля хантера" },
  consultative_validation: { en: "Consultative Profile Validation",   ru: "Валидация консультативного профиля" },
  leadership_potential:    { en: "Leadership Potential",               ru: "Лидерский потенциал" },
  validity_concern:        { en: "Response Validity Probe",           ru: "Проверка валидности ответов" },
  consistency_concern:     { en: "Response Consistency Probe",        ru: "Проверка согласованности ответов" },
  resilience_pressure:     { en: "Resilience Under Pressure",         ru: "Стрессоустойчивость" },
  environmental_fit:       { en: "Environmental Fit",                  ru: "Совместимость со средой" },
};

// ─── Condition Operators ────────────────────────────────────────────

export type ConditionOperator = "<" | "<=" | ">" | ">=" | "==" | "!=";

export interface ScoreCondition {
  readonly source: "disc_scale" | "disc_sjt" | "disc_overall" | "disc_validity" | "disc_consistency"
    | "disc_band" | "ritchie_scale" | "ritchie_role_fit" | "ritchie_top_motivator" | "ritchie_bottom_motivator"
    | "zima_dimension" | "zima_fit" | "zima_red_flag_count" | "zima_role_fit"
    | "overall_score" | "overall_band" | "primary_role" | "secondary_role";
  /** Scale/dimension/role key (required for scale-based sources) */
  readonly key?: string;
  readonly operator: ConditionOperator;
  readonly value: number | string;
}

// ─── Rule Definition ────────────────────────────────────────────────

export interface InterviewQuestionRule {
  readonly id: string;
  readonly theme: InterviewTheme;
  readonly priority: number;
  readonly conditions: readonly ScoreCondition[];
  /** All conditions must match ("and" logic) */
  readonly conditionLogic: "and" | "or";
  readonly question: { readonly en: string; readonly ru: string };
  /** BEI technique hint for the interviewer */
  readonly probeHint?: { readonly en: string; readonly ru: string };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RULE BANK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const INTERVIEW_QUESTION_RULES: readonly InterviewQuestionRule[] = [

  // ═══ PROCESS DISCIPLINE (low C / low process) ═══════════════════

  {
    id: "proc_01",
    theme: "process_discipline",
    priority: 90,
    conditionLogic: "or",
    conditions: [
      { source: "disc_scale", key: "C", operator: "<", value: 50 },
      { source: "zima_dimension", key: "process", operator: "<", value: 45 },
    ],
    question: {
      en: "Walk me through your exact CRM routine — when do you update it, what do you log, and what happens when you fall behind?",
      ru: "Расскажите подробно о вашей работе с CRM — когда вы её обновляете, что фиксируете и что делаете, когда отстаёте?",
    },
    probeHint: {
      en: "Ask for a specific week. Look for honesty about lapses vs. rehearsed ideals.",
      ru: "Попросите описать конкретную неделю. Оцените, признаёт ли кандидат пробелы или даёт шаблонный ответ.",
    },
  },
  {
    id: "proc_02",
    theme: "process_discipline",
    priority: 80,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "C", operator: "<", value: 45 },
      { source: "disc_scale", key: "D", operator: ">", value: 65 },
    ],
    question: {
      en: "You seem action-oriented. Tell me about a time your speed caused a documentation or compliance error. What happened and how did you fix it?",
      ru: "Вы ориентированы на действие. Расскажите о случае, когда ваша скорость привела к ошибке в документации или процессе. Что произошло и как вы это исправили?",
    },
  },
  {
    id: "proc_03",
    theme: "process_discipline",
    priority: 75,
    conditionLogic: "or",
    conditions: [
      { source: "ritchie_scale", key: "STR", operator: "<", value: 40 },
    ],
    question: {
      en: "How do you feel about mandatory weekly pipeline reviews and structured reporting? Give a real example of how you handled a process you found tedious.",
      ru: "Как вы относитесь к обязательным еженедельным обзорам пайплайна и структурированной отчётности? Приведите реальный пример процесса, который вас утомлял.",
    },
  },

  // ═══ INTEGRITY / COACHABILITY (low K) ═══════════════════════════

  {
    id: "integ_01",
    theme: "integrity_coachability",
    priority: 95,
    conditionLogic: "or",
    conditions: [
      { source: "disc_scale", key: "K", operator: "<", value: 55 },
    ],
    question: {
      en: "Tell me about the last time you received critical feedback from a manager. What was it, how did you feel, and what did you change?",
      ru: "Расскажите о последнем случае, когда вы получили критическую обратную связь от руководителя. Какой она была, как вы её восприняли и что изменили?",
    },
    probeHint: {
      en: "Probe for specificity. Vague answers here reinforce the low-K signal.",
      ru: "Уточняйте детали. Размытые ответы подтверждают низкий K-балл.",
    },
  },
  {
    id: "integ_02",
    theme: "integrity_coachability",
    priority: 85,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "K", operator: "<", value: 50 },
      { source: "disc_validity", operator: "<", value: 70 },
    ],
    question: {
      en: "Describe a deal you lost because of your own mistake — not the client's decision, not market conditions, your mistake. What specifically did you do wrong?",
      ru: "Опишите сделку, которую вы проиграли из-за собственной ошибки — не решения клиента, не рыночных условий, а именно вашей ошибки. Что конкретно вы сделали не так?",
    },
  },

  // ═══ LONG-CYCLE ENDURANCE (low S) ══════════════════════════════

  {
    id: "endur_01",
    theme: "endurance_stability",
    priority: 85,
    conditionLogic: "or",
    conditions: [
      { source: "disc_scale", key: "S", operator: "<", value: 50 },
    ],
    question: {
      en: "Tell me about your longest sales cycle. How did you maintain momentum and personal motivation over that period?",
      ru: "Расскажите о самом длинном цикле сделки в вашей практике. Как вы поддерживали темп и личную мотивацию на протяжении этого периода?",
    },
    probeHint: {
      en: "Ask for duration, pipeline management, and emotional resilience — not just outcome.",
      ru: "Спрашивайте о длительности, управлении пайплайном и эмоциональной устойчивости — не только о результате.",
    },
  },
  {
    id: "endur_02",
    theme: "endurance_stability",
    priority: 75,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "S", operator: "<", value: 45 },
      { source: "ritchie_scale", key: "SEC", operator: "<", value: 40 },
    ],
    question: {
      en: "Our premium deals average 6–9 months from first contact to close. What's your honest reaction to that timeline, and how would you structure your week around it?",
      ru: "Наши премиальные сделки длятся в среднем 6–9 месяцев от первого контакта до закрытия. Какова ваша честная реакция на такой срок, и как бы вы структурировали свою неделю?",
    },
  },

  // ═══ HIGH D / LOW RAPPORT ═══════════════════════════════════════

  {
    id: "rapport_01",
    theme: "assertiveness_rapport",
    priority: 88,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "D", operator: ">", value: 70 },
      { source: "disc_scale", key: "I", operator: "<", value: 50 },
    ],
    question: {
      en: "Describe a sale where the client felt you were too pushy. How did you know, and what did you adjust?",
      ru: "Опишите продажу, в которой клиент счёл вас слишком напористым. Как вы это поняли и что скорректировали?",
    },
  },
  {
    id: "rapport_02",
    theme: "assertiveness_rapport",
    priority: 80,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "D", operator: ">", value: 70 },
      { source: "ritchie_scale", key: "REL", operator: "<", value: 45 },
    ],
    question: {
      en: "How do you build trust with a client who values the relationship more than the product specs? Give a specific example.",
      ru: "Как вы строите доверие с клиентом, которому важнее отношения, чем характеристики продукта? Приведите конкретный пример.",
    },
  },

  // ═══ HIGH I / LOW STRUCTURE ════════════════════════════════════

  {
    id: "struct_01",
    theme: "structure_vs_influence",
    priority: 85,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "I", operator: ">", value: 70 },
      { source: "disc_scale", key: "C", operator: "<", value: 45 },
    ],
    question: {
      en: "You come across as highly persuasive. Tell me about a time your enthusiasm made a promise that operations couldn't deliver. What happened?",
      ru: "Вы производите впечатление убедительного человека. Расскажите о случае, когда ваш энтузиазм привёл к обещанию, которое операционная команда не смогла выполнить. Что произошло?",
    },
  },
  {
    id: "struct_02",
    theme: "structure_vs_influence",
    priority: 78,
    conditionLogic: "and",
    conditions: [
      { source: "disc_scale", key: "I", operator: ">", value: 65 },
      { source: "ritchie_scale", key: "STR", operator: "<", value: 40 },
    ],
    question: {
      en: "How do you ensure pricing accuracy and contract terms are correct when you're focused on closing fast?",
      ru: "Как вы обеспечиваете точность цен и условий контракта, когда сосредоточены на быстром закрытии сделки?",
    },
  },

  // ═══ WEAK MOTIVATIONAL ALIGNMENT ═══════════════════════════════

  {
    id: "motiv_01",
    theme: "motivational_alignment",
    priority: 88,
    conditionLogic: "or",
    conditions: [
      { source: "ritchie_role_fit", key: "full_cycle", operator: "<", value: 50 },
      { source: "ritchie_role_fit", key: "hunter", operator: "<", value: 50 },
      { source: "ritchie_role_fit", key: "consultative", operator: "<", value: 50 },
      { source: "ritchie_role_fit", key: "team_lead", operator: "<", value: 50 },
    ],
    question: {
      en: "What excites you most about a sales role? And what aspects of selling drain your energy the fastest?",
      ru: "Что больше всего привлекает вас в роли в продажах? И какие аспекты продаж быстрее всего забирают вашу энергию?",
    },
    probeHint: {
      en: "Compare the answer to the target role profile. Mismatches signal potential disengagement.",
      ru: "Сравните ответ с профилем целевой роли. Несовпадения сигнализируют о риске потери вовлечённости.",
    },
  },
  {
    id: "motiv_02",
    theme: "motivational_alignment",
    priority: 82,
    conditionLogic: "and",
    conditions: [
      { source: "ritchie_scale", key: "INC", operator: "<", value: 45 },
      { source: "overall_score", operator: ">", value: 65 },
    ],
    question: {
      en: "Our compensation has a significant variable component tied to personal performance. How do you feel about a structure where 40–50% of your income depends on your results?",
      ru: "Наша компенсация включает значительную переменную часть, привязанную к личным результатам. Как вы относитесь к структуре, где 40–50% дохода зависит от ваших результатов?",
    },
  },
  {
    id: "motiv_03",
    theme: "motivational_alignment",
    priority: 80,
    conditionLogic: "and",
    conditions: [
      { source: "ritchie_scale", key: "DRI", operator: "<", value: 45 },
      { source: "ritchie_scale", key: "ACH", operator: "<", value: 45 },
    ],
    question: {
      en: "What does a high-performance day look like for you? Walk me through a recent day where you were truly in flow.",
      ru: "Как выглядит ваш день с максимальной производительностью? Расскажите о недавнем дне, когда вы были действительно в потоке.",
    },
  },

  // ═══ STRONG HUNTER PROFILE ════════════════════════════════════

  {
    id: "hunter_01",
    theme: "hunter_validation",
    priority: 82,
    conditionLogic: "and",
    conditions: [
      { source: "primary_role", operator: "==", value: "hunter" },
    ],
    question: {
      en: "Describe your most effective cold outreach method. How many new conversations did you generate per week in your last role, and what was the conversion to qualified meeting?",
      ru: "Опишите ваш самый эффективный метод холодного привлечения. Сколько новых разговоров в неделю вы генерировали на последней позиции и какова была конверсия в квалифицированную встречу?",
    },
  },
  {
    id: "hunter_02",
    theme: "hunter_validation",
    priority: 78,
    conditionLogic: "and",
    conditions: [
      { source: "primary_role", operator: "==", value: "hunter" },
      { source: "disc_scale", key: "D", operator: ">", value: 70 },
    ],
    question: {
      en: "Tell me about a territory or segment you opened from zero. What was the timeline from first contact to first closed deal?",
      ru: "Расскажите о территории или сегменте, который вы открыли с нуля. Каков был срок от первого контакта до первой закрытой сделки?",
    },
  },

  // ═══ STRONG CONSULTATIVE PROFILE ══════════════════════════════

  {
    id: "consult_01",
    theme: "consultative_validation",
    priority: 82,
    conditionLogic: "and",
    conditions: [
      { source: "primary_role", operator: "==", value: "consultative" },
    ],
    question: {
      en: "Describe a sale where you changed the client's original requirements through your discovery process. What questions did you ask, and how did the solution shift?",
      ru: "Опишите продажу, в которой вы изменили первоначальные требования клиента через процесс выявления потребностей. Какие вопросы вы задавали и как изменилось решение?",
    },
  },
  {
    id: "consult_02",
    theme: "consultative_validation",
    priority: 78,
    conditionLogic: "and",
    conditions: [
      { source: "primary_role", operator: "==", value: "consultative" },
      { source: "ritchie_scale", key: "REL", operator: ">", value: 65 },
    ],
    question: {
      en: "How do you handle a situation where the best advice for the client means a smaller deal for you?",
      ru: "Как вы поступаете, когда лучший совет для клиента означает меньшую сделку для вас?",
    },
  },

  // ═══ TEAM LEAD POTENTIAL ══════════════════════════════════════

  {
    id: "lead_01",
    theme: "leadership_potential",
    priority: 85,
    conditionLogic: "or",
    conditions: [
      { source: "primary_role", operator: "==", value: "team_lead" },
      { source: "secondary_role", operator: "==", value: "team_lead" },
    ],
    question: {
      en: "Tell me about the weakest performer on a team you managed. What specifically did you do, and what was the outcome after 3 months?",
      ru: "Расскажите о самом слабом сотруднике в команде, которой вы управляли. Что конкретно вы сделали и каков был результат через 3 месяца?",
    },
    probeHint: {
      en: "Listen for coaching specifics vs. delegation to HR. Real leaders describe actions, not policies.",
      ru: "Слушайте конкретику коучинга, а не делегирование в HR. Настоящие лидеры описывают действия, а не политики.",
    },
  },
  {
    id: "lead_02",
    theme: "leadership_potential",
    priority: 80,
    conditionLogic: "and",
    conditions: [
      { source: "ritchie_scale", key: "POW", operator: ">", value: 70 },
      { source: "disc_scale", key: "D", operator: ">", value: 65 },
    ],
    question: {
      en: "How do you handle a top performer who consistently breaks process rules but delivers great numbers?",
      ru: "Как вы поступаете с лучшим продавцом, который систематически нарушает процессы, но даёт отличные цифры?",
    },
  },

  // ═══ VALIDITY CONCERN ═════════════════════════════════════════

  {
    id: "valid_01",
    theme: "validity_concern",
    priority: 92,
    conditionLogic: "or",
    conditions: [
      { source: "disc_validity", operator: "<", value: 65 },
    ],
    question: {
      en: "In the assessment, some of your responses suggested you may have been presenting an ideal version of yourself rather than your natural tendencies. In what situations do you tend to adjust your behaviour most?",
      ru: "В ходе оценки некоторые ваши ответы указали на то, что вы могли представлять идеализированную версию себя. В каких ситуациях вы наиболее склонны корректировать своё поведение?",
    },
    probeHint: {
      en: "Not accusatory — normalise it. Watch for defensiveness vs. self-awareness.",
      ru: "Не обвинительно — нормализуйте это. Следите за защитной реакцией vs. самоосознанием.",
    },
  },
  {
    id: "valid_02",
    theme: "validity_concern",
    priority: 88,
    conditionLogic: "and",
    conditions: [
      { source: "disc_validity", operator: "<", value: 60 },
      { source: "disc_scale", key: "K", operator: "<", value: 50 },
    ],
    question: {
      en: "What would your last manager say is the single biggest area you need to improve — not a strength disguised as a weakness, a genuine development area?",
      ru: "Что бы ваш последний руководитель назвал единственной самой важной зоной развития — не сильную сторону, замаскированную под слабость, а настоящую зону роста?",
    },
  },

  // ═══ CONSISTENCY CONCERN ═══════════════════════════════════════

  {
    id: "consist_01",
    theme: "consistency_concern",
    priority: 90,
    conditionLogic: "or",
    conditions: [
      { source: "disc_consistency", operator: "<", value: 65 },
    ],
    question: {
      en: "I'd like to explore how you see yourself in different contexts. Describe your work style when things are going well, and then how it changes when you're under significant pressure.",
      ru: "Я хотел бы понять, как вы видите себя в разных контекстах. Опишите ваш стиль работы, когда всё идёт хорошо, а затем — как он меняется при значительном давлении.",
    },
    probeHint: {
      en: "Consistency violations suggest context-dependent self-image. Map real examples to both states.",
      ru: "Нарушения согласованности указывают на зависимость самовосприятия от контекста. Попросите примеры для обоих состояний.",
    },
  },
  {
    id: "consist_02",
    theme: "consistency_concern",
    priority: 82,
    conditionLogic: "and",
    conditions: [
      { source: "disc_consistency", operator: "<", value: 60 },
    ],
    question: {
      en: "Your colleagues might describe you as [profile label]. Does that match how you see yourself, or would you push back on that description?",
      ru: "Ваши коллеги могли бы описать вас как [профиль]. Совпадает ли это с вашим самоощущением, или вы бы оспорили такую характеристику?",
    },
  },

  // ═══ RESILIENCE / PRESSURE ════════════════════════════════════

  {
    id: "resil_01",
    theme: "resilience_pressure",
    priority: 85,
    conditionLogic: "or",
    conditions: [
      { source: "zima_dimension", key: "resilience", operator: "<", value: 50 },
    ],
    question: {
      en: "Tell me about the hardest quarter you've had in sales. What happened to your activity levels and pipeline when deals were falling through?",
      ru: "Расскажите о самом тяжёлом квартале в продажах. Что происходило с вашей активностью и пайплайном, когда сделки срывались?",
    },
  },
  {
    id: "resil_02",
    theme: "resilience_pressure",
    priority: 78,
    conditionLogic: "and",
    conditions: [
      { source: "zima_dimension", key: "resilience", operator: "<", value: 45 },
      { source: "zima_dimension", key: "pace", operator: ">", value: 65 },
    ],
    question: {
      en: "You seem to thrive in fast environments, but sustained pressure appears to be a different challenge. How do you prevent burnout when the pace stays high for months?",
      ru: "Вам комфортно в быстром темпе, но длительное давление — другой вызов. Как вы предотвращаете выгорание, когда темп остаётся высоким месяцами?",
    },
  },

  // ═══ ENVIRONMENTAL FIT ════════════════════════════════════════

  {
    id: "envfit_01",
    theme: "environmental_fit",
    priority: 80,
    conditionLogic: "or",
    conditions: [
      { source: "zima_fit", operator: "<", value: 55 },
    ],
    question: {
      en: "Our environment is [describe ZIMA operating context]. What aspects of that description appeal to you, and which concern you?",
      ru: "Наша среда — это [описание операционного контекста ZIMA]. Какие аспекты этого описания вам импонируют, а какие вызывают опасения?",
    },
  },
  {
    id: "envfit_02",
    theme: "environmental_fit",
    priority: 75,
    conditionLogic: "and",
    conditions: [
      { source: "zima_dimension", key: "ambiguity", operator: "<", value: 40 },
    ],
    question: {
      en: "We're scaling, which means processes change frequently. How do you handle working in an environment where the rules aren't fully written yet?",
      ru: "Мы масштабируемся, а значит, процессы часто меняются. Как вы работаете в среде, где правила ещё не полностью сформированы?",
    },
  },
  {
    id: "envfit_03",
    theme: "environmental_fit",
    priority: 72,
    conditionLogic: "and",
    conditions: [
      { source: "zima_red_flag_count", operator: ">=", value: 2 },
    ],
    question: {
      en: "Based on your profile, some aspects of our operating environment might not be a natural fit. What kind of work environment brings out the worst in you?",
      ru: "Судя по вашему профилю, некоторые аспекты нашей операционной среды могут быть не совсем естественны для вас. Какая рабочая среда раскрывает в вас худшее?",
    },
  },

] as const;

// ─── Output Limits ──────────────────────────────────────────────────

export const INTERVIEW_QUESTION_LIMITS = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 10,
  MAX_PER_THEME: 2,
} as const;
