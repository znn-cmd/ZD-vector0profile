// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Final Hiring Recommendation — Rule Configuration
//
//  Produces one of four actionable outcomes:
//    Shortlist  |  Interview with caution  |  Reserve pool  |  Reject
//
//  Each rule carries:
//    - a stable ID and audit-friendly label
//    - priority (evaluated in order; first match wins for tier)
//    - typed conditions against FinalProfile fields
//    - a bilingual reason string appended to reasons[]
//    - an effect: "promote" (move up) or "demote" (move down)
//
//  The resolver evaluates all rules, collects matching reasons,
//  resolves the tier from accumulated promotes/demotes + gate checks,
//  and returns { recommendation, reasons[] }.
//
//  Aligned with:
//    OverallBand:   strong_hire | recommended | conditional | not_recommended
//    DISC band:     strong_shortlist | conditional | high_risk
//    DISC thresholds: SJT ≥ 70, K ≥ 65, C ≥ 55, D ≥ 60, I ≥ 65
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Recommendation Tier ────────────────────────────────────────────

export type RecommendationTier =
  | "shortlist"
  | "interview_with_caution"
  | "reserve_pool"
  | "reject";

export const TIER_PRIORITY: Record<RecommendationTier, number> = {
  shortlist: 4,
  interview_with_caution: 3,
  reserve_pool: 2,
  reject: 1,
};

export const TIER_LABELS: Record<RecommendationTier, { en: string; ru: string }> = {
  shortlist:               { en: "Shortlist",                ru: "Шорт-лист" },
  interview_with_caution:  { en: "Interview with caution",   ru: "Интервью с осторожностью" },
  reserve_pool:            { en: "Reserve pool",             ru: "Резервный пул" },
  reject:                  { en: "Reject",                   ru: "Отказ" },
};

// ─── Rule Types ─────────────────────────────────────────────────────

export type RuleEffect = "promote" | "demote";

/**
 * Gate rules are hard boundaries. If any "reject_gate" matches,
 * the candidate cannot be above "reject". If any "shortlist_gate"
 * fails, the candidate cannot reach "shortlist".
 */
export type RuleCategory =
  | "reject_gate"
  | "reserve_gate"
  | "caution_flag"
  | "shortlist_qualifier"
  | "strength_signal"
  | "risk_signal";

export interface RecommendationRule {
  readonly id: string;
  readonly category: RuleCategory;
  readonly priority: number;
  readonly reason: { readonly en: string; readonly ru: string };
  readonly effect: RuleEffect;
  /** Point delta applied to the running score. Positive = toward shortlist, negative = toward reject. */
  readonly weight: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  A. REJECT GATES — any match → hard reject
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const REJECT_GATE_RULES: readonly RecommendationRule[] = [
  {
    id: "rg_01",
    category: "reject_gate",
    priority: 100,
    effect: "demote",
    weight: -100,
    reason: {
      en: "Overall score below 45 — fundamental misalignment with role requirements",
      ru: "Общий балл ниже 45 — фундаментальное несоответствие требованиям роли",
    },
  },
  {
    id: "rg_02",
    category: "reject_gate",
    priority: 99,
    effect: "demote",
    weight: -100,
    reason: {
      en: "DISC band is high-risk with critical ZIMA red flags — combined behavioral and environmental risk",
      ru: "DISC-категория высокого риска с критическими ZIMA-флагами — комбинированный поведенческий и средовой риск",
    },
  },
  {
    id: "rg_03",
    category: "reject_gate",
    priority: 98,
    effect: "demote",
    weight: -100,
    reason: {
      en: "SJT score below 45 — critically weak situational judgment for sales",
      ru: "Балл SJT ниже 45 — критически слабое ситуационное суждение для продаж",
    },
  },
  {
    id: "rg_04",
    category: "reject_gate",
    priority: 97,
    effect: "demote",
    weight: -100,
    reason: {
      en: "K-scale below 40 and validity score below 50 — self-report reliability is critically compromised",
      ru: "K-шкала ниже 40 и валидность ниже 50 — достоверность самоотчёта критически подорвана",
    },
  },
  {
    id: "rg_05",
    category: "reject_gate",
    priority: 96,
    effect: "demote",
    weight: -100,
    reason: {
      en: "ZIMA fit score below 35 — severe environment mismatch",
      ru: "Балл ZIMA Fit ниже 35 — серьёзное несоответствие среде",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  B. RESERVE GATES — match → ceiling = reserve_pool
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RESERVE_GATE_RULES: readonly RecommendationRule[] = [
  {
    id: "res_01",
    category: "reserve_gate",
    priority: 88,
    effect: "demote",
    weight: -40,
    reason: {
      en: "Overall score 45–54 — below minimum threshold but not critically disqualified",
      ru: "Общий балл 45–54 — ниже минимального порога, но не критически дисквалифицирован",
    },
  },
  {
    id: "res_02",
    category: "reserve_gate",
    priority: 87,
    effect: "demote",
    weight: -40,
    reason: {
      en: "All role-fit scores below 50 — no adequate role match identified",
      ru: "Все баллы ролевого соответствия ниже 50 — подходящая роль не выявлена",
    },
  },
  {
    id: "res_03",
    category: "reserve_gate",
    priority: 86,
    effect: "demote",
    weight: -40,
    reason: {
      en: "Three or more critical ZIMA red flags — significant environment friction expected",
      ru: "Три и более критических ZIMA-флага — ожидается значительное трение со средой",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  C. CAUTION FLAGS — each one pulls toward "interview with caution"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CAUTION_FLAG_RULES: readonly RecommendationRule[] = [
  {
    id: "cf_01",
    category: "caution_flag",
    priority: 80,
    effect: "demote",
    weight: -15,
    reason: {
      en: "C-scale below 50 — below-target process discipline and detail orientation",
      ru: "C-шкала ниже 50 — недостаточная дисциплина процессов и внимание к деталям",
    },
  },
  {
    id: "cf_02",
    category: "caution_flag",
    priority: 79,
    effect: "demote",
    weight: -15,
    reason: {
      en: "K-scale below 55 — elevated social desirability, reduced self-report reliability",
      ru: "K-шкала ниже 55 — повышенная социальная желательность, сниженная достоверность самоотчёта",
    },
  },
  {
    id: "cf_03",
    category: "caution_flag",
    priority: 78,
    effect: "demote",
    weight: -15,
    reason: {
      en: "SJT score below 60 — weak situational judgment in sales-critical scenarios",
      ru: "Балл SJT ниже 60 — слабое ситуационное суждение в критических сценариях продаж",
    },
  },
  {
    id: "cf_04",
    category: "caution_flag",
    priority: 77,
    effect: "demote",
    weight: -12,
    reason: {
      en: "Validity score below 65 — response pattern raises reliability concerns",
      ru: "Балл валидности ниже 65 — паттерн ответов вызывает опасения по достоверности",
    },
  },
  {
    id: "cf_05",
    category: "caution_flag",
    priority: 76,
    effect: "demote",
    weight: -12,
    reason: {
      en: "Consistency score below 65 — contradictions detected in self-report",
      ru: "Балл согласованности ниже 65 — обнаружены противоречия в самоотчёте",
    },
  },
  {
    id: "cf_06",
    category: "caution_flag",
    priority: 75,
    effect: "demote",
    weight: -10,
    reason: {
      en: "Primary role-fit below 55 — motivational alignment with target role is weak",
      ru: "Основное ролевое соответствие ниже 55 — мотивационное совпадение с целевой ролью слабое",
    },
  },
  {
    id: "cf_07",
    category: "caution_flag",
    priority: 74,
    effect: "demote",
    weight: -10,
    reason: {
      en: "ZIMA fit score below 55 — environment alignment concerns",
      ru: "Балл ZIMA Fit ниже 55 — опасения по совместимости со средой",
    },
  },
  {
    id: "cf_08",
    category: "caution_flag",
    priority: 73,
    effect: "demote",
    weight: -8,
    reason: {
      en: "DISC band is conditional — behavioral profile has identified gaps",
      ru: "DISC-категория условная — в поведенческом профиле выявлены пробелы",
    },
  },
  {
    id: "cf_09",
    category: "caution_flag",
    priority: 72,
    effect: "demote",
    weight: -8,
    reason: {
      en: "One or more critical ZIMA red flags present",
      ru: "Присутствуют один или более критических ZIMA-флагов",
    },
  },
  {
    id: "cf_10",
    category: "caution_flag",
    priority: 71,
    effect: "demote",
    weight: -8,
    reason: {
      en: "Ritchie–Martin role-fit has critical gaps for primary role",
      ru: "Ролевое соответствие Ritchie–Martin имеет критические пробелы для основной роли",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  D. SHORTLIST QUALIFIERS — must meet minimum set to reach shortlist
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SHORTLIST_QUALIFIER_RULES: readonly RecommendationRule[] = [
  {
    id: "sq_01",
    category: "shortlist_qualifier",
    priority: 90,
    effect: "promote",
    weight: 20,
    reason: {
      en: "Overall score 78 or above — strong composite performance",
      ru: "Общий балл 78 и выше — сильная композитная результативность",
    },
  },
  {
    id: "sq_02",
    category: "shortlist_qualifier",
    priority: 89,
    effect: "promote",
    weight: 15,
    reason: {
      en: "DISC band is strong shortlist — behavioral profile meets all thresholds",
      ru: "DISC-категория «сильный шорт-лист» — поведенческий профиль соответствует всем порогам",
    },
  },
  {
    id: "sq_03",
    category: "shortlist_qualifier",
    priority: 88,
    effect: "promote",
    weight: 12,
    reason: {
      en: "Primary role-fit score 70 or above — strong motivational alignment with target role",
      ru: "Основное ролевое соответствие 70 и выше — сильное мотивационное совпадение с целевой ролью",
    },
  },
  {
    id: "sq_04",
    category: "shortlist_qualifier",
    priority: 87,
    effect: "promote",
    weight: 10,
    reason: {
      en: "ZIMA fit score 70 or above — strong environment alignment",
      ru: "Балл ZIMA Fit 70 и выше — сильная совместимость со средой",
    },
  },
  {
    id: "sq_05",
    category: "shortlist_qualifier",
    priority: 86,
    effect: "promote",
    weight: 8,
    reason: {
      en: "Validity and consistency both clean — high confidence in self-report data",
      ru: "Валидность и согласованность чистые — высокая уверенность в данных самоотчёта",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  E. STRENGTH SIGNALS — positive evidence (additive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const STRENGTH_SIGNAL_RULES: readonly RecommendationRule[] = [
  {
    id: "ss_01",
    category: "strength_signal",
    priority: 70,
    effect: "promote",
    weight: 6,
    reason: {
      en: "SJT score 75 or above — strong practical judgment in sales scenarios",
      ru: "Балл SJT 75 и выше — сильное практическое суждение в сценариях продаж",
    },
  },
  {
    id: "ss_02",
    category: "strength_signal",
    priority: 69,
    effect: "promote",
    weight: 6,
    reason: {
      en: "D-scale 70 or above — strong assertiveness and closing drive",
      ru: "D-шкала 70 и выше — сильная напористость и мотивация к закрытию",
    },
  },
  {
    id: "ss_03",
    category: "strength_signal",
    priority: 68,
    effect: "promote",
    weight: 6,
    reason: {
      en: "I-scale 70 or above — strong relationship-building pattern",
      ru: "I-шкала 70 и выше — сильный паттерн построения отношений",
    },
  },
  {
    id: "ss_04",
    category: "strength_signal",
    priority: 67,
    effect: "promote",
    weight: 5,
    reason: {
      en: "Drive (DRI) motivator 75 or above — high energy and sustained intensity",
      ru: "Мотиватор «Драйв» (DRI) 75 и выше — высокая энергия и устойчивая интенсивность",
    },
  },
  {
    id: "ss_05",
    category: "strength_signal",
    priority: 66,
    effect: "promote",
    weight: 5,
    reason: {
      en: "Achievement (ACH) motivator 75 or above — self-driven to exceed targets",
      ru: "Мотиватор «Достижение» (ACH) 75 и выше — внутренняя мотивация превышать цели",
    },
  },
  {
    id: "ss_06",
    category: "strength_signal",
    priority: 65,
    effect: "promote",
    weight: 5,
    reason: {
      en: "ZIMA resilience dimension 70 or above — handles rejection and pressure well",
      ru: "ZIMA-измерение стрессоустойчивости 70 и выше — хорошо справляется с отказами и давлением",
    },
  },
  {
    id: "ss_07",
    category: "strength_signal",
    priority: 64,
    effect: "promote",
    weight: 4,
    reason: {
      en: "ZIMA client focus 75 or above — strong client orientation",
      ru: "ZIMA-клиентоориентированность 75 и выше — выраженная ориентация на клиента",
    },
  },
  {
    id: "ss_08",
    category: "strength_signal",
    priority: 63,
    effect: "promote",
    weight: 4,
    reason: {
      en: "Secondary role-fit also strong (60+) — versatile across multiple sales roles",
      ru: "Вторичное ролевое соответствие тоже сильное (60+) — универсальность в разных ролях продаж",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  F. RISK SIGNALS — negative evidence (subtractive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RISK_SIGNAL_RULES: readonly RecommendationRule[] = [
  {
    id: "rs_01",
    category: "risk_signal",
    priority: 70,
    effect: "demote",
    weight: -6,
    reason: {
      en: "Low S-scale (below 45) — may lack endurance for long sales cycles",
      ru: "Низкая S-шкала (ниже 45) — может не хватить выносливости для длинных циклов продаж",
    },
  },
  {
    id: "rs_02",
    category: "risk_signal",
    priority: 69,
    effect: "demote",
    weight: -6,
    reason: {
      en: "Motivational mismatch: primary role fit is hunter but DRI below 60",
      ru: "Мотивационное несоответствие: основная роль — хантер, но DRI ниже 60",
    },
  },
  {
    id: "rs_03",
    category: "risk_signal",
    priority: 68,
    effect: "demote",
    weight: -6,
    reason: {
      en: "Motivational mismatch: primary role fit is consultative but REL below 55",
      ru: "Мотивационное несоответствие: основная роль — консультативная, но REL ниже 55",
    },
  },
  {
    id: "rs_04",
    category: "risk_signal",
    priority: 67,
    effect: "demote",
    weight: -6,
    reason: {
      en: "Motivational mismatch: primary role fit is team lead but POW below 55",
      ru: "Мотивационное несоответствие: основная роль — тимлид, но POW ниже 55",
    },
  },
  {
    id: "rs_05",
    category: "risk_signal",
    priority: 66,
    effect: "demote",
    weight: -5,
    reason: {
      en: "ZIMA process dimension below 40 — CRM discipline and reporting likely insufficient",
      ru: "ZIMA-измерение процессов ниже 40 — дисциплина CRM и отчётности вероятно недостаточна",
    },
  },
  {
    id: "rs_06",
    category: "risk_signal",
    priority: 65,
    effect: "demote",
    weight: -5,
    reason: {
      en: "Security motivator below 30 — elevated retention risk, likely flight risk for better offers",
      ru: "Мотиватор «Безопасность» ниже 30 — повышенный риск удержания, вероятен уход за лучшим предложением",
    },
  },
  {
    id: "rs_07",
    category: "risk_signal",
    priority: 64,
    effect: "demote",
    weight: -5,
    reason: {
      en: "ZIMA resilience below 45 — may underperform under sustained rejection pressure",
      ru: "ZIMA-стрессоустойчивость ниже 45 — может снижать результативность при длительном давлении отказов",
    },
  },
  {
    id: "rs_08",
    category: "risk_signal",
    priority: 63,
    effect: "demote",
    weight: -4,
    reason: {
      en: "High D (75+) with low I (below 45) — assertive but may alienate clients",
      ru: "Высокий D (75+) и низкий I (ниже 45) — напористый, но может отталкивать клиентов",
    },
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Tier Resolution Thresholds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TIER_THRESHOLDS = {
  /** Net score (sum of all weights) at or above this → eligible for Shortlist */
  shortlist: 25,
  /** Net score at or above this → Interview with caution (if not shortlist) */
  interview: -10,
  /** Net score at or above this → Reserve pool (if not interview) */
  reserve: -40,
  /** Below reserve → Reject */
} as const;
