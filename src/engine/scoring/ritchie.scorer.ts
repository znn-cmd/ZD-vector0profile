// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Scorer
//
//  Pipeline:
//    1. Score 80 Likert items → 12 raw scale totals
//    2. Apply forced-choice adjustments (+2 / -2)
//    3. Score mini-cases → additional scale points
//    4. Normalize all scales to 0–100
//    5. Validity + consistency checks
//    6. Role-fit computation against 4 role profiles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  RitchieBlockConfig,
  RitchieBlockResult,
  RitchieScale,
  RitchieAnswers,
  ScaleScore,
  SalesRole,
  RoleFitResult,
  Likert6,
  ForcedChoicePick,
  CaseOptionId,
} from "../types";
import {
  computeScaleScore,
  checkConsistency,
  checkRitchieValidity,
  groupByScale,
  computeProfileFit,
  topScales,
  bottomScales,
  normalize,
  clamp,
} from "../helpers";

const ALL_RITCHIE_SCALES: RitchieScale[] = [
  "INC", "REC", "ACH", "POW", "VAR", "AUT",
  "STR", "REL", "VAL", "DEV", "SEC", "DRI",
];

const SALES_ROLES: SalesRole[] = ["full_cycle", "hunter", "consultative", "team_lead"];

export function scoreRitchieBlock(
  answers: RitchieAnswers,
  config: RitchieBlockConfig,
): RitchieBlockResult {

  // ── Step 1: Compute base Likert scale scores ────────────────────
  const grouped = groupByScale(config.items);
  const baseScales = {} as Record<RitchieScale, ScaleScore>;

  for (const scale of ALL_RITCHIE_SCALES) {
    const items = grouped[scale] ?? [];
    baseScales[scale] = computeScaleScore(items, answers.likert);
  }

  // ── Step 2: Forced-choice adjustments (+2 / -2) ─────────────────
  const fcAdjustments = {} as Record<RitchieScale, number>;
  for (const s of ALL_RITCHIE_SCALES) fcAdjustments[s] = 0;

  for (const fc of config.forcedChoiceBlocks) {
    const pick = answers.forcedChoice[fc.id];
    if (!pick) continue;

    const chosen = pick === "a" ? fc.optionA : fc.optionB;
    const rejected = pick === "a" ? fc.optionB : fc.optionA;

    const chosenScale = chosen.scale as RitchieScale;
    const rejectedScale = rejected.scale as RitchieScale;

    if (chosenScale in fcAdjustments) fcAdjustments[chosenScale] += 2;
    if (rejectedScale in fcAdjustments) fcAdjustments[rejectedScale] -= 2;
  }

  // ── Step 3: Mini-case scoring ───────────────────────────────────
  const miniCaseScores: Record<string, { scale: string; points: number }[]> = {};
  const caseAdjustments: Record<string, number> = {};

  for (const mc of config.miniCases) {
    const choice = answers.miniCases[mc.id];
    if (!choice) continue;

    const scores = mc.scoring[choice] ?? [];
    miniCaseScores[mc.id] = scores;

    for (const s of scores) {
      caseAdjustments[s.scale] = (caseAdjustments[s.scale] ?? 0) + s.points;
    }
  }

  // ── Step 4: Merge and normalize to 0–100 ────────────────────────
  const finalScales = {} as Record<RitchieScale, ScaleScore>;

  for (const scale of ALL_RITCHIE_SCALES) {
    const base = baseScales[scale];
    const fcAdj = fcAdjustments[scale];
    const caseAdj = caseAdjustments[scale] ?? 0;

    // The adjustments shift the raw total. We convert them to
    // the same unit as the Likert raw: a +2 FC adjustment ≈ +2 raw points.
    const adjustedRaw = base.raw + fcAdj + caseAdj;

    // Normalize: min = itemCount (all 1s), max = itemCount * 6
    // But with adjustments, the effective range expands slightly.
    // We clamp to prevent going below min or above max.
    const minRaw = base.itemCount;
    const maxRaw = base.itemCount * 6;
    const clampedRaw = clamp(adjustedRaw, minRaw, maxRaw);
    const normalised = normalize(clampedRaw, minRaw, maxRaw);

    finalScales[scale] = {
      raw: clampedRaw,
      max: maxRaw,
      normalized: normalised,
      itemCount: base.itemCount,
      answeredCount: base.answeredCount,
    };
  }

  // ── Step 5: Validity and consistency ────────────────────────────
  const validity = checkRitchieValidity(config.validityItems, answers.likert);
  const consistency = checkConsistency(
    config.consistencyPairs,
    answers.likert,
    config.items,
  );

  // ── Step 6: Top / bottom motivators ─────────────────────────────
  const topMotivators = topScales(finalScales, 3);
  const bottomMotivators = bottomScales(finalScales, 3);

  // ── Step 7: Role fit computation ────────────────────────────────
  const normalizedMap: Record<string, number> = {};
  for (const s of ALL_RITCHIE_SCALES) {
    normalizedMap[s] = finalScales[s].normalized;
  }

  const roleFit = {} as Record<SalesRole, RoleFitResult>;
  for (const role of SALES_ROLES) {
    const profile = config.roleProfiles[role];
    const idealMap: Record<string, number> = {};
    for (const [k, v] of Object.entries(profile.idealScores)) {
      idealMap[k] = v;
    }

    const fitScore = computeProfileFit(normalizedMap, idealMap);

    // Check critical scale gaps
    const criticalGaps: RoleFitResult["criticalGaps"] = [];
    for (const cs of profile.criticalScales) {
      const score = finalScales[cs].normalized;
      if (score < profile.criticalMinimum) {
        criticalGaps.push({
          scale: cs,
          score,
          required: profile.criticalMinimum,
        });
      }
    }

    const fit: RoleFitResult["fit"] =
      fitScore >= 70 && criticalGaps.length === 0
        ? "strong"
        : fitScore >= 55
          ? "moderate"
          : "weak";

    roleFit[role] = {
      score: fitScore,
      label: profile.label,
      fit,
      criticalGaps,
    };
  }

  return {
    scales: finalScales,
    forcedChoiceAdjustments: fcAdjustments,
    miniCaseScores,
    validity,
    consistency,
    topMotivators,
    bottomMotivators,
    roleFit,
  };
}
