// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interpretation Composition Engine
//
//  Pure, deterministic function: FinalProfile × lang → ComposedReport
//
//  Reads only from the static interpretation dictionaries — never
//  generates text dynamically, never calls external services.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  FinalProfile,
  DISCScale,
  RitchieScale,
  OverallBand,
  SalesRole,
} from "@/engine/types";

import type {
  ScaleInterpretationBlock,
  QualityInterpretationBlock,
  RitchieScaleBandBlock,
  RoleFitInterpretation,
  ZIMAFitBlock,
  ZIMARoleMismatchWarning,
  FinalBandTemplate,
  NarrativeSectionTemplates,
  ScoreBand,
  QualityBand,
  FitBand,
  FinalBandId,
} from "@/config/reports/interpretations/types";

// EN dictionaries
import {
  D_INTERPRETATIONS,
  I_INTERPRETATIONS,
  S_INTERPRETATIONS,
  C_INTERPRETATIONS,
  K_INTERPRETATIONS,
  SJT_INTERPRETATIONS,
  VALIDITY_INTERPRETATIONS,
  CONSISTENCY_INTERPRETATIONS,
} from "@/config/reports/interpretations/disc.en";

import {
  RITCHIE_SCALE_DICT,
  RITCHIE_ROLE_INTERPRETATIONS,
} from "@/config/reports/interpretations/ritchie.en";

import {
  ZIMA_ENVIRONMENT_FIT,
  ZIMA_ROLE_MISMATCH_WARNINGS,
  ZIMA_MANAGEMENT_RECOMMENDATIONS as ZIMA_MGMT_EN,
  ZIMA_RAMPUP_RECOMMENDATIONS as ZIMA_RAMP_EN,
} from "@/config/reports/interpretations/zima.en";

import {
  FINAL_BAND_TEMPLATES,
  NARRATIVE_TEMPLATES,
} from "@/config/reports/interpretations/finalSummary.en";

// RU dictionaries
import {
  D_INTERPRETATIONS_RU,
  I_INTERPRETATIONS_RU,
  S_INTERPRETATIONS_RU,
  C_INTERPRETATIONS_RU,
  K_INTERPRETATIONS_RU,
  SJT_INTERPRETATIONS_RU,
  VALIDITY_INTERPRETATIONS_RU,
  CONSISTENCY_INTERPRETATIONS_RU,
} from "@/config/reports/interpretations/disc.ru";

import {
  RITCHIE_SCALE_DICT_RU,
  RITCHIE_ROLE_INTERPRETATIONS_RU,
} from "@/config/reports/interpretations/ritchie.ru";

import {
  ZIMA_ENVIRONMENT_FIT_RU,
  ZIMA_ROLE_MISMATCH_WARNINGS_RU,
  ZIMA_MANAGEMENT_RECOMMENDATIONS_RU as ZIMA_MGMT_RU,
  ZIMA_RAMPUP_RECOMMENDATIONS_RU as ZIMA_RAMP_RU,
} from "@/config/reports/interpretations/zima.ru";

import {
  FINAL_BAND_TEMPLATES_RU,
  NARRATIVE_TEMPLATES_RU,
} from "@/config/reports/interpretations/finalSummary.ru";

// ─── Output Shape ───────────────────────────────────────────────────

export interface ComposedInterpretation {
  lang: "en" | "ru";

  disc: {
    scales: Record<DISCScale, ScaleInterpretationBlock>;
    sjt: ScaleInterpretationBlock;
    validity: QualityInterpretationBlock;
    consistency: QualityInterpretationBlock;
  };

  ritchie: {
    scales: Record<RitchieScale, RitchieScaleBandBlock>;
    primaryRoleFit: RoleFitInterpretation;
    secondaryRoleFit: RoleFitInterpretation;
  };

  zima: {
    environmentFit: ZIMAFitBlock;
    primaryRoleMismatch: ZIMARoleMismatchWarning | null;
    managementRecommendations: string[];
    rampUpRecommendations: string[];
  };

  finalSummary: {
    bandTemplate: FinalBandTemplate;
    narrative: NarrativeSectionTemplates;
    topStrengths: string[];
    keyRisks: string[];
    managementStyleRecs: string[];
    interviewFocusQuestions: string[];
    onboardingRisks: string[];
    targetRole: {
      roleId: SalesRole;
      label: string;
      fitScore: number;
    };
  };
}

// ─── Band Resolution Helpers ────────────────────────────────────────

function scoreToBand(normalized: number): ScoreBand {
  if (normalized >= 75) return "very_high";
  if (normalized >= 60) return "high";
  if (normalized >= 45) return "medium";
  if (normalized >= 30) return "low";
  return "very_low";
}

function qualityToBand(score: number): QualityBand {
  if (score >= 80) return "clean";
  if (score >= 50) return "caution";
  return "risk";
}

function fitScoreToBand(score: number): FitBand {
  if (score >= 70) return "strong";
  if (score >= 50) return "moderate";
  return "low";
}

function overallBandToFinalBandId(band: OverallBand, overallScore: number): FinalBandId {
  switch (band) {
    case "strong_hire":
      return "strong_fit";
    case "recommended":
      return overallScore >= 75 ? "shortlist" : "conditional_fit";
    case "conditional":
      return overallScore >= 60 ? "interview_with_caution" : "reserve_pool";
    case "not_recommended":
      return overallScore >= 45 ? "reject" : "reject";
  }
}

function findByBand<T extends { band: string }>(
  items: readonly T[],
  band: string,
): T {
  return items.find((i) => i.band === band) ?? items[items.length - 1];
}

function findByBandId(
  items: readonly FinalBandTemplate[],
  bandId: FinalBandId,
): FinalBandTemplate {
  return items.find((i) => i.bandId === bandId) ?? items[items.length - 1];
}

function findRoleInterpretation(
  items: readonly RoleFitInterpretation[],
  roleId: string,
): RoleFitInterpretation {
  return items.find((i) => i.roleId === roleId) ?? items[0];
}

function findMismatchWarning(
  items: readonly ZIMARoleMismatchWarning[],
  roleId: string,
  fitScore: number,
): ZIMARoleMismatchWarning | null {
  if (fitScore >= 60) return null;
  return items.find((i) => i.roleId === roleId) ?? null;
}

// ─── DISC Resolution ────────────────────────────────────────────────

const DISC_SCALE_MAP_EN: Record<DISCScale, readonly ScaleInterpretationBlock[]> = {
  D: D_INTERPRETATIONS,
  I: I_INTERPRETATIONS,
  S: S_INTERPRETATIONS,
  C: C_INTERPRETATIONS,
  K: K_INTERPRETATIONS,
};

const DISC_SCALE_MAP_RU: Record<DISCScale, readonly ScaleInterpretationBlock[]> = {
  D: D_INTERPRETATIONS_RU,
  I: I_INTERPRETATIONS_RU,
  S: S_INTERPRETATIONS_RU,
  C: C_INTERPRETATIONS_RU,
  K: K_INTERPRETATIONS_RU,
};

function resolveDISC(
  profile: FinalProfile,
  lang: "en" | "ru",
): ComposedInterpretation["disc"] {
  const scaleMap = lang === "en" ? DISC_SCALE_MAP_EN : DISC_SCALE_MAP_RU;
  const sjtDict = lang === "en" ? SJT_INTERPRETATIONS : SJT_INTERPRETATIONS_RU;
  const validDict = lang === "en" ? VALIDITY_INTERPRETATIONS : VALIDITY_INTERPRETATIONS_RU;
  const consDict = lang === "en" ? CONSISTENCY_INTERPRETATIONS : CONSISTENCY_INTERPRETATIONS_RU;

  const discScales = {} as Record<DISCScale, ScaleInterpretationBlock>;
  for (const scale of ["D", "I", "S", "C", "K"] as DISCScale[]) {
    const norm = profile.disc.scales[scale].normalized;
    discScales[scale] = findByBand(scaleMap[scale], scoreToBand(norm));
  }

  return {
    scales: discScales,
    sjt: findByBand(sjtDict, scoreToBand(profile.disc.sjtScore.normalized)),
    validity: findByBand(validDict, qualityToBand(profile.disc.validity.score)),
    consistency: findByBand(consDict, qualityToBand(profile.disc.consistency.score)),
  };
}

// ─── Ritchie Resolution ─────────────────────────────────────────────

const ALL_RITCHIE_SCALES: RitchieScale[] = [
  "INC", "REC", "ACH", "POW", "VAR", "AUT",
  "STR", "REL", "VAL", "DEV", "SEC", "DRI",
];

function resolveRitchie(
  profile: FinalProfile,
  lang: "en" | "ru",
): ComposedInterpretation["ritchie"] {
  const dict = lang === "en" ? RITCHIE_SCALE_DICT : RITCHIE_SCALE_DICT_RU;
  const roleDict = lang === "en" ? RITCHIE_ROLE_INTERPRETATIONS : RITCHIE_ROLE_INTERPRETATIONS_RU;

  const scales = {} as Record<RitchieScale, RitchieScaleBandBlock>;
  for (const scale of ALL_RITCHIE_SCALES) {
    const norm = profile.ritchie.scales[scale].normalized;
    scales[scale] = findByBand(dict[scale], scoreToBand(norm));
  }

  return {
    scales,
    primaryRoleFit: findRoleInterpretation(roleDict, profile.primaryRole),
    secondaryRoleFit: findRoleInterpretation(roleDict, profile.secondaryRole),
  };
}

// ─── ZIMA Resolution ────────────────────────────────────────────────

function resolveZIMA(
  profile: FinalProfile,
  lang: "en" | "ru",
): ComposedInterpretation["zima"] {
  const envDict = lang === "en" ? ZIMA_ENVIRONMENT_FIT : ZIMA_ENVIRONMENT_FIT_RU;
  const mismatchDict = lang === "en" ? ZIMA_ROLE_MISMATCH_WARNINGS : ZIMA_ROLE_MISMATCH_WARNINGS_RU;
  const mgmtRecs = lang === "en" ? ZIMA_MGMT_EN : ZIMA_MGMT_RU;
  const rampRecs = lang === "en" ? ZIMA_RAMP_EN : ZIMA_RAMP_RU;

  const fitBand = fitScoreToBand(profile.zima.fitScore);

  const relevantMgmt = selectRelevantZIMAMgmt(profile, mgmtRecs);
  const relevantRamp = selectRelevantZIMARamp(profile, rampRecs);

  return {
    environmentFit: findByBand(envDict, fitBand),
    primaryRoleMismatch: findMismatchWarning(
      mismatchDict,
      profile.primaryRole,
      profile.zima.roleFitScores[profile.primaryRole],
    ),
    managementRecommendations: relevantMgmt,
    rampUpRecommendations: relevantRamp,
  };
}

function selectRelevantZIMAMgmt(
  profile: FinalProfile,
  allRecs: readonly string[],
): string[] {
  const dims = profile.zima.dimensions;
  const selected: string[] = [];

  if (dims.pace.normalized >= 70) selected.push(allRecs[0]);
  if (dims.autonomy.normalized >= 70) selected.push(allRecs[1]);
  if (dims.autonomy.normalized < 40) selected.push(allRecs[2]);
  if (dims.collaboration.normalized >= 70) selected.push(allRecs[3]);
  if (dims.collaboration.normalized < 40) selected.push(allRecs[4]);
  if (dims.risk.normalized < 40) selected.push(allRecs[5]);
  if (dims.innovation.normalized >= 70) selected.push(allRecs[6]);
  if (dims.process.normalized >= 70) selected.push(allRecs[7]);
  if (dims.resilience.normalized < 60) selected.push(allRecs[8]);
  if (dims.ambiguity.normalized < 40) selected.push(allRecs[9]);
  if (dims.growth.normalized >= 70) selected.push(allRecs[10]);

  return selected.length > 0 ? selected : [allRecs[0]];
}

function selectRelevantZIMARamp(
  profile: FinalProfile,
  allRecs: readonly string[],
): string[] {
  const selected: string[] = [allRecs[0], allRecs[1], allRecs[2], allRecs[3], allRecs[4]];

  if (profile.zima.dimensions.resilience.normalized < 50) selected.push(allRecs[5]);
  if (profile.zima.dimensions.autonomy.normalized >= 70) selected.push(allRecs[6]);
  if (profile.zima.dimensions.pace.normalized < 40) selected.push(allRecs[7]);

  return selected;
}

// ─── Final Summary Resolution ───────────────────────────────────────

const ROLE_LABELS_EN: Record<SalesRole, string> = {
  full_cycle: "Full-Cycle Account Executive",
  hunter: "New Business Hunter",
  consultative: "Consultative / Solution Seller",
  team_lead: "Sales Team Lead",
};

const ROLE_LABELS_RU: Record<SalesRole, string> = {
  full_cycle: "Аккаунт-менеджер полного цикла",
  hunter: "Охотник / Генератор сделок",
  consultative: "Консультативный продавец",
  team_lead: "Тимлид / Старший брокер",
};

function resolveFinalSummary(
  profile: FinalProfile,
  lang: "en" | "ru",
): ComposedInterpretation["finalSummary"] {
  const bandTemplates = lang === "en" ? FINAL_BAND_TEMPLATES : FINAL_BAND_TEMPLATES_RU;
  const narrative = lang === "en" ? NARRATIVE_TEMPLATES : NARRATIVE_TEMPLATES_RU;
  const roleLabels = lang === "en" ? ROLE_LABELS_EN : ROLE_LABELS_RU;

  const bandId = overallBandToFinalBandId(profile.overallBand, profile.overallScore);

  const onboardingRisks = deriveOnboardingRisks(profile, lang);

  return {
    bandTemplate: findByBandId(bandTemplates, bandId),
    narrative,
    topStrengths: profile.strengths,
    keyRisks: profile.risks,
    managementStyleRecs: profile.managementStyleRecommendations,
    interviewFocusQuestions: profile.interviewFocusQuestions,
    onboardingRisks,
    targetRole: {
      roleId: profile.primaryRole,
      label: roleLabels[profile.primaryRole],
      fitScore: profile.zima.roleFitScores[profile.primaryRole],
    },
  };
}

function deriveOnboardingRisks(profile: FinalProfile, lang: "en" | "ru"): string[] {
  const risks: string[] = [];

  if (profile.zima.fitScore < 60) {
    risks.push(
      lang === "en"
        ? `Environment fit score (${profile.zima.fitScore}/100) is below the comfort threshold. Expect a longer adaptation period and higher management investment in the first 90 days.`
        : `Совместимость со средой (${profile.zima.fitScore}/100) ниже порога комфорта. Ожидайте более длительный период адаптации и повышенные управленческие инвестиции в первые 90 дней.`,
    );
  }

  if (profile.disc.scales.C.normalized < 50) {
    risks.push(
      lang === "en"
        ? "Low compliance/precision score may lead to documentation errors, missed CRM updates, and proposal quality issues during onboarding."
        : "Низкие баллы по аналитичности могут привести к ошибкам в документации, пропуску CRM-обновлений и проблемам качества предложений при онбординге.",
    );
  }

  if (profile.ritchie.scales.STR.normalized < 40) {
    risks.push(
      lang === "en"
        ? "Low structure preference means the candidate may resist onboarding processes and mandatory training schedules. Frame requirements clearly and explain the 'why' behind each process."
        : "Низкое предпочтение структуры означает, что кандидат может сопротивляться онбординговым процессам и обязательным тренингам. Чётко объясняйте «зачем» за каждым процессом.",
    );
  }

  if (profile.zima.dimensions.resilience.normalized < 50) {
    risks.push(
      lang === "en"
        ? "Below-average resilience increases the risk of early disengagement after initial rejection experiences. Implement structured support mechanisms from day one."
        : "Устойчивость ниже среднего повышает риск раннего выхода из вовлечённости после первых отказов. Внедрите механизмы поддержки с первого дня.",
    );
  }

  if (profile.ritchie.scales.DRI.normalized < 40) {
    risks.push(
      lang === "en"
        ? "Low drive may result in slow pipeline generation during the critical first 90 days. Set clear daily activity expectations and track compliance closely."
        : "Низкий драйв может привести к медленной генерации пайплайна в критические первые 90 дней. Установите чёткие ежедневные нормы активности и контролируйте их.",
    );
  }

  return risks;
}

// ─── Main Composition Function ──────────────────────────────────────

/**
 * Deterministic composition engine.
 *
 * Takes a scored FinalProfile (output of the assessment engine aggregator)
 * and a language code, and produces the full structured interpretation
 * by looking up the appropriate text blocks from the static dictionaries.
 *
 * No dynamic text generation. No AI. No randomness.
 * Same input → same output, always.
 */
export function composeInterpretation(
  profile: FinalProfile,
  lang: "en" | "ru" = "en",
): ComposedInterpretation {
  return {
    lang,
    disc: resolveDISC(profile, lang),
    ritchie: resolveRitchie(profile, lang),
    zima: resolveZIMA(profile, lang),
    finalSummary: resolveFinalSummary(profile, lang),
  };
}
