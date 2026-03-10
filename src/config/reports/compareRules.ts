// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Compare Mode — Interpretation Rules
//
//  Config-driven, deterministic rules that control:
//  1. Per-dimension ranking (who leads, who lags)
//  2. Archetype insight generation (strongest closer, best hunter, etc.)
//  3. Caution triggers (high overall score but hidden operational risk)
//
//  The compare composer reads these rules and produces structured,
//  HR-readable comparative insight — no vague narration.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DISCScale, RitchieScale, ZIMADimension, SalesRole, OverallBand } from "@/engine/types";

// ─── Dimension Accessor Key ─────────────────────────────────────────

export type CompareDimensionKey =
  | `disc_${DISCScale}`
  | "disc_sjt"
  | "disc_validity"
  | "disc_consistency"
  | "disc_overall"
  | "zima_fit"
  | `zima_${ZIMADimension}`
  | `zima_role_${SalesRole}`
  | `ritchie_${RitchieScale}`
  | "ritchie_best_role_fit"
  | "overall_score";

// ─── Dimension Rule ─────────────────────────────────────────────────

export interface CompareDimensionRule {
  readonly key: CompareDimensionKey;
  readonly label: { readonly en: string; readonly ru: string };
  readonly group: "disc" | "zima" | "ritchie" | "overall";
  /** Higher is better? (false for validity/consistency risk scores) */
  readonly higherIsBetter: boolean;
  /** Threshold below which a candidate is flagged as a risk on this dimension */
  readonly riskThreshold?: number;
  /** Threshold above which a candidate is considered strong */
  readonly strengthThreshold?: number;
}

// ─── Archetype Insight ──────────────────────────────────────────────

export interface ArchetypeInsightRule {
  readonly id: string;
  readonly label: { readonly en: string; readonly ru: string };
  /** Dimension keys that contribute to this archetype (weighted equally) */
  readonly dimensionKeys: readonly CompareDimensionKey[];
  /** Minimum composite score (average of dims) to qualify */
  readonly qualifyingThreshold: number;
  /** If a candidate's score is below this on ANY of the dims, they cannot qualify */
  readonly hardFloor?: number;
}

// ─── Caution Trigger ────────────────────────────────────────────────

export type CautionConditionType =
  | "high_overall_low_dimension"
  | "high_overall_low_validity"
  | "high_overall_high_red_flags"
  | "band_mismatch_with_leader"
  | "strong_disc_weak_motivation"
  | "strong_overall_weak_retention";

export interface CautionTriggerRule {
  readonly id: string;
  readonly type: CautionConditionType;
  readonly label: { readonly en: string; readonly ru: string };
  /** Overall score must be at or above this to trigger the caution */
  readonly overallFloor: number;
  /** The dimension(s) checked for the hidden risk */
  readonly riskDimensions?: readonly CompareDimensionKey[];
  /** Threshold on risk dimensions below which the caution fires */
  readonly riskCeiling?: number;
  /** Minimum red flag count from ZIMA */
  readonly minRedFlags?: number;
  /** Band the leader must have (for band_mismatch detection) */
  readonly leaderBand?: OverallBand;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RULE DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── 1. Dimension Rules ─────────────────────────────────────────────

export const COMPARE_DIMENSION_RULES: readonly CompareDimensionRule[] = [
  // --- DISC ---
  { key: "disc_D", group: "disc", higherIsBetter: true, riskThreshold: 40, strengthThreshold: 70, label: { en: "Dominance (D)", ru: "Доминирование (D)" } },
  { key: "disc_I", group: "disc", higherIsBetter: true, riskThreshold: 40, strengthThreshold: 70, label: { en: "Influence (I)", ru: "Влияние (I)" } },
  { key: "disc_S", group: "disc", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 65, label: { en: "Steadiness (S)", ru: "Стабильность (S)" } },
  { key: "disc_C", group: "disc", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 65, label: { en: "Compliance (C)", ru: "Соответствие (C)" } },
  { key: "disc_K", group: "disc", higherIsBetter: true, riskThreshold: 50, strengthThreshold: 70, label: { en: "Social Desirability (K)", ru: "Социальная желательность (K)" } },
  { key: "disc_sjt", group: "disc", higherIsBetter: true, riskThreshold: 55, strengthThreshold: 75, label: { en: "Situational Judgment (SJT)", ru: "Ситуационные сценарии (SJT)" } },
  { key: "disc_validity", group: "disc", higherIsBetter: true, riskThreshold: 60, strengthThreshold: 85, label: { en: "Response Validity", ru: "Валидность ответов" } },
  { key: "disc_consistency", group: "disc", higherIsBetter: true, riskThreshold: 60, strengthThreshold: 85, label: { en: "Response Consistency", ru: "Согласованность ответов" } },
  { key: "disc_overall", group: "disc", higherIsBetter: true, riskThreshold: 55, strengthThreshold: 75, label: { en: "DISC Overall", ru: "DISC общий балл" } },

  // --- ZIMA ---
  { key: "zima_fit", group: "zima", higherIsBetter: true, riskThreshold: 50, strengthThreshold: 75, label: { en: "ZIMA Fit Score", ru: "ZIMA общее соответствие" } },
  { key: "zima_role_full_cycle", group: "zima", higherIsBetter: true, riskThreshold: 45, strengthThreshold: 70, label: { en: "Full-Cycle Fit", ru: "Соответствие: полный цикл" } },
  { key: "zima_role_hunter", group: "zima", higherIsBetter: true, riskThreshold: 45, strengthThreshold: 70, label: { en: "Hunter Fit", ru: "Соответствие: хантер" } },
  { key: "zima_role_consultative", group: "zima", higherIsBetter: true, riskThreshold: 45, strengthThreshold: 70, label: { en: "Consultative Fit", ru: "Соответствие: консультативный" } },
  { key: "zima_role_team_lead", group: "zima", higherIsBetter: true, riskThreshold: 45, strengthThreshold: 70, label: { en: "Team Lead Fit", ru: "Соответствие: тимлид" } },
  { key: "zima_pace", group: "zima", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 75, label: { en: "Pace", ru: "Темп" } },
  { key: "zima_autonomy", group: "zima", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Autonomy", ru: "Автономность" } },
  { key: "zima_collaboration", group: "zima", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Collaboration", ru: "Командность" } },
  { key: "zima_risk", group: "zima", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Risk Tolerance", ru: "Толерантность к риску" } },
  { key: "zima_innovation", group: "zima", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Innovation", ru: "Инновационность" } },
  { key: "zima_client_focus", group: "zima", higherIsBetter: true, riskThreshold: 40, strengthThreshold: 75, label: { en: "Client Focus", ru: "Клиентоориентированность" } },
  { key: "zima_process", group: "zima", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 70, label: { en: "Process Adherence", ru: "Следование процессам" } },
  { key: "zima_resilience", group: "zima", higherIsBetter: true, riskThreshold: 40, strengthThreshold: 75, label: { en: "Resilience", ru: "Стрессоустойчивость" } },
  { key: "zima_ambiguity", group: "zima", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Ambiguity Tolerance", ru: "Толерантность к неопределённости" } },
  { key: "zima_growth", group: "zima", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 70, label: { en: "Growth Orientation", ru: "Ориентация на рост" } },

  // --- Ritchie–Martin ---
  { key: "ritchie_INC", group: "ritchie", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Incentive", ru: "Материальная мотивация" } },
  { key: "ritchie_REC", group: "ritchie", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Recognition", ru: "Признание" } },
  { key: "ritchie_ACH", group: "ritchie", higherIsBetter: true, riskThreshold: 30, strengthThreshold: 70, label: { en: "Achievement", ru: "Достижение" } },
  { key: "ritchie_POW", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Power", ru: "Власть / влияние" } },
  { key: "ritchie_VAR", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Variety", ru: "Разнообразие" } },
  { key: "ritchie_AUT", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Autonomy", ru: "Автономия" } },
  { key: "ritchie_STR", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Structure", ru: "Структура" } },
  { key: "ritchie_REL", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Relationships", ru: "Отношения" } },
  { key: "ritchie_VAL", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Values", ru: "Ценности" } },
  { key: "ritchie_DEV", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Development", ru: "Развитие" } },
  { key: "ritchie_SEC", group: "ritchie", higherIsBetter: true, riskThreshold: 25, strengthThreshold: 70, label: { en: "Security", ru: "Безопасность" } },
  { key: "ritchie_DRI", group: "ritchie", higherIsBetter: true, riskThreshold: 35, strengthThreshold: 75, label: { en: "Drive", ru: "Драйв / энергия" } },

  // --- Overall ---
  { key: "ritchie_best_role_fit", group: "ritchie", higherIsBetter: true, riskThreshold: 50, strengthThreshold: 75, label: { en: "Best Role-Fit (Ritchie)", ru: "Лучшее ролевое соответствие (Ричи)" } },
  { key: "overall_score", group: "overall", higherIsBetter: true, riskThreshold: 55, strengthThreshold: 78, label: { en: "Overall Score", ru: "Общий балл" } },
] as const;

// ─── 2. Archetype Insight Rules ─────────────────────────────────────

export const ARCHETYPE_INSIGHT_RULES: readonly ArchetypeInsightRule[] = [
  {
    id: "strongest_closer",
    label: { en: "Strongest Closer", ru: "Сильнейший закрывающий" },
    dimensionKeys: ["disc_D", "disc_I", "ritchie_INC", "ritchie_ACH", "zima_role_full_cycle"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
  {
    id: "best_hunter_fit",
    label: { en: "Best Hunter Fit", ru: "Лучший хантер" },
    dimensionKeys: ["disc_D", "ritchie_INC", "ritchie_DRI", "zima_pace", "zima_risk", "zima_role_hunter"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
  {
    id: "best_consultative_fit",
    label: { en: "Best Consultative Fit", ru: "Лучший консультативный продавец" },
    dimensionKeys: ["disc_I", "disc_S", "ritchie_REL", "ritchie_ACH", "zima_client_focus", "zima_role_consultative"],
    qualifyingThreshold: 62,
    hardFloor: 45,
  },
  {
    id: "strongest_long_cycle_stability",
    label: { en: "Best Long-Cycle Stability", ru: "Лучшая стабильность в длинном цикле" },
    dimensionKeys: ["disc_S", "disc_C", "ritchie_STR", "ritchie_SEC", "zima_process", "zima_resilience"],
    qualifyingThreshold: 60,
    hardFloor: 45,
  },
  {
    id: "strongest_team_lead_potential",
    label: { en: "Strongest Team Lead Potential", ru: "Высший потенциал тимлида" },
    dimensionKeys: ["disc_D", "disc_I", "ritchie_POW", "ritchie_ACH", "ritchie_REL", "zima_role_team_lead"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
  {
    id: "strongest_structure_crm_discipline",
    label: { en: "Best CRM / Process Discipline", ru: "Лучшая дисциплина CRM / процесса" },
    dimensionKeys: ["disc_C", "ritchie_STR", "zima_process"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
  {
    id: "highest_retention_risk",
    label: { en: "Highest Retention Risk", ru: "Наибольший риск удержания" },
    dimensionKeys: ["ritchie_SEC", "ritchie_VAR", "ritchie_AUT"],
    qualifyingThreshold: 0,
  },
  {
    id: "highest_drive_energy",
    label: { en: "Highest Drive & Energy", ru: "Максимальный драйв и энергия" },
    dimensionKeys: ["ritchie_DRI", "ritchie_ACH", "ritchie_INC", "zima_pace"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
  {
    id: "best_client_rapport",
    label: { en: "Best Client Rapport", ru: "Лучший раппорт с клиентами" },
    dimensionKeys: ["disc_I", "ritchie_REL", "zima_client_focus", "zima_collaboration"],
    qualifyingThreshold: 62,
    hardFloor: 45,
  },
  {
    id: "most_autonomous_operator",
    label: { en: "Most Autonomous Operator", ru: "Наиболее автономный исполнитель" },
    dimensionKeys: ["ritchie_AUT", "zima_autonomy", "ritchie_DRI"],
    qualifyingThreshold: 65,
    hardFloor: 50,
  },
] as const;

// ─── 3. Caution Trigger Rules ───────────────────────────────────────

export const CAUTION_TRIGGER_RULES: readonly CautionTriggerRule[] = [
  {
    id: "high_score_low_sjt",
    type: "high_overall_low_dimension",
    label: {
      en: "High overall score but weak situational judgment — may struggle with real-world sales scenarios",
      ru: "Высокий общий балл, но слабые ситуационные навыки — возможны трудности в реальных сценариях продаж",
    },
    overallFloor: 70,
    riskDimensions: ["disc_sjt"],
    riskCeiling: 55,
  },
  {
    id: "high_score_low_validity",
    type: "high_overall_low_validity",
    label: {
      en: "High overall score but validity concerns — self-report reliability is reduced",
      ru: "Высокий общий балл, но замечания к валидности — достоверность самоотчёта снижена",
    },
    overallFloor: 70,
    riskDimensions: ["disc_validity"],
    riskCeiling: 60,
  },
  {
    id: "high_score_low_consistency",
    type: "high_overall_low_dimension",
    label: {
      en: "High overall score but inconsistent responding — contradictions detected in self-report",
      ru: "Высокий общий балл, но непоследовательные ответы — выявлены противоречия в самоотчёте",
    },
    overallFloor: 70,
    riskDimensions: ["disc_consistency"],
    riskCeiling: 60,
  },
  {
    id: "high_score_red_flags",
    type: "high_overall_high_red_flags",
    label: {
      en: "High overall score but critical ZIMA red flags — environment fit concerns present",
      ru: "Высокий общий балл, но критические ZIMA-флаги — есть опасения по совместимости со средой",
    },
    overallFloor: 70,
    minRedFlags: 2,
  },
  {
    id: "strong_disc_weak_motivation",
    type: "strong_disc_weak_motivation",
    label: {
      en: "Strong behavioral profile but weak motivational alignment — may perform well short-term but disengage",
      ru: "Сильный поведенческий профиль, но слабое мотивационное соответствие — может работать хорошо краткосрочно, но потерять вовлечённость",
    },
    overallFloor: 65,
    riskDimensions: ["ritchie_best_role_fit"],
    riskCeiling: 50,
  },
  {
    id: "high_score_low_resilience",
    type: "high_overall_low_dimension",
    label: {
      en: "High overall score but low resilience — may underperform under sustained pressure",
      ru: "Высокий общий балл, но низкая стрессоустойчивость — может снижать результативность при длительном давлении",
    },
    overallFloor: 70,
    riskDimensions: ["zima_resilience"],
    riskCeiling: 40,
  },
  {
    id: "high_score_low_process",
    type: "high_overall_low_dimension",
    label: {
      en: "High overall score but weak process adherence — CRM discipline and reporting may suffer",
      ru: "Высокий общий балл, но слабое следование процессам — дисциплина CRM и отчётности может страдать",
    },
    overallFloor: 70,
    riskDimensions: ["zima_process", "disc_C"],
    riskCeiling: 40,
  },
  {
    id: "high_overall_weak_retention",
    type: "strong_overall_weak_retention",
    label: {
      en: "Strong candidate but elevated retention risk — motivational profile suggests flight risk without active management",
      ru: "Сильный кандидат, но повышенный риск удержания — мотивационный профиль указывает на риск ухода без активного управления",
    },
    overallFloor: 70,
    riskDimensions: ["ritchie_SEC"],
    riskCeiling: 35,
  },
] as const;

// ─── 4. Band Priority (for ranking) ────────────────────────────────

export const BAND_PRIORITY: Record<OverallBand, number> = {
  strong_hire: 4,
  recommended: 3,
  conditional: 2,
  not_recommended: 1,
};

// ─── 5. Summary Section Order ───────────────────────────────────────

export const COMPARE_SECTION_ORDER = [
  "ranking",
  "archetypes",
  "dimension_leaders",
  "cautions",
  "recommendation_matrix",
] as const;

export type CompareSectionId = (typeof COMPARE_SECTION_ORDER)[number];
