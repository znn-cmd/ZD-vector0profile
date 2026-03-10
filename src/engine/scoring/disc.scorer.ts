// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Scorer
//
//  Pipeline:
//    raw answers
//    → apply reverse scoring
//    → compute per-scale totals
//    → normalize to 0–100
//    → run validity checks (K scale + pattern detection)
//    → run consistency pair checks
//    → score SJT cases
//    → compute weighted overall
//    → apply threshold logic → band assignment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  DISCBlockConfig,
  DISCBlockResult,
  DISCScale,
  DISCAnswers,
  ScaleScore,
} from "../types";
import {
  computeScaleScore,
  computeSJTScore,
  weightedSum,
  checkConsistency,
  checkValidity,
  groupByScale,
  topScales,
} from "../helpers";

const DISC_SCALES: DISCScale[] = ["D", "I", "S", "C", "K"];

const PROFILE_LABELS: Record<string, string> = {
  DI: "Dominant Influencer — Drives deals through assertive persuasion",
  DI_alt: "Results-oriented closer with strong interpersonal skills",
  DC: "Analytical Driver — Data-driven with decisive execution",
  DS: "Determined Achiever — Persistent results focus with patience",
  ID: "Inspiring Leader — Builds momentum through enthusiasm and vision",
  IS: "Supportive Communicator — Persuades through relationships and trust",
  IC: "Creative Strategist — Combines people skills with analytical thinking",
  SD: "Steady Implementer — Reliable execution with occasional assertiveness",
  SI: "Loyal Relationship Builder — Patient, people-oriented, consistent",
  SC: "Methodical Supporter — Steady, detail-oriented, reliable",
  CD: "Systematic Controller — Analytical first, decisive when data supports",
  CI: "Quality Communicator — Precise communication with social awareness",
  CS: "Meticulous Planner — Detail-focused with patient execution",
};

export function scoreDISCBlock(
  answers: DISCAnswers,
  config: DISCBlockConfig,
): DISCBlockResult {

  // ── Step 1: Group items by scale ────────────────────────────────
  const grouped = groupByScale(config.items);

  // ── Step 2: Compute per-scale scores (handles reverse scoring) ──
  const scales = {} as Record<DISCScale, ScaleScore>;
  for (const s of DISC_SCALES) {
    const items = grouped[s] ?? [];
    scales[s] = computeScaleScore(items, answers.likert);
  }

  // ── Step 3: Score SJT cases ─────────────────────────────────────
  const sjtScore = computeSJTScore(config.sjtCases, answers.sjt);

  // ── Step 4: Validity check ──────────────────────────────────────
  const validity = checkValidity(
    config.validityItemIds,
    answers.likert,
    config.items,
  );

  // ── Step 5: Consistency check ───────────────────────────────────
  const consistency = checkConsistency(
    config.consistencyPairs,
    answers.likert,
    config.items,
  );

  // ── Step 6: Weighted overall ────────────────────────────────────
  const scoreMap: Record<string, number> = {
    D: scales.D.normalized,
    I: scales.I.normalized,
    S: scales.S.normalized,
    C: scales.C.normalized,
    K: scales.K.normalized,
    SJT: sjtScore.normalized,
  };

  const overall = weightedSum(scoreMap, config.scaleWeights);

  // ── Step 7: Threshold logic → band ──────────────────────────────
  const { band, bandReasons } = applyThresholds(
    overall,
    scales,
    sjtScore,
    config.thresholds,
  );

  // ── Step 8: Profile label ───────────────────────────────────────
  const [primary, secondary] = topScales(
    // Exclude K from profile determination
    { D: scales.D, I: scales.I, S: scales.S, C: scales.C } as Record<DISCScale, ScaleScore>,
    2,
  );
  const profileKey = `${primary}${secondary}`;
  const label = PROFILE_LABELS[profileKey]
    ?? `${primary}-${secondary} Profile`;

  return {
    scales,
    sjtScore,
    validity,
    consistency,
    overall,
    band,
    bandReasons,
    scaleProfile: { primary, secondary, label },
  };
}

// ─── Threshold Engine ────────────────────────────────────────────────

function applyThresholds(
  overall: number,
  scales: Record<DISCScale, ScaleScore>,
  sjt: ScaleScore,
  t: DISCBlockConfig["thresholds"],
): { band: DISCBlockResult["band"]; bandReasons: string[] } {
  const reasons: string[] = [];

  // Check high-risk conditions first
  const isHighRisk =
    overall < t.highRisk.overall ||
    sjt.normalized < t.highRisk.SJT ||
    scales.K.normalized < t.highRisk.K ||
    scales.C.normalized < t.highRisk.C;

  if (isHighRisk) {
    if (overall < t.highRisk.overall)
      reasons.push(`Overall score ${overall} below minimum ${t.highRisk.overall}`);
    if (sjt.normalized < t.highRisk.SJT)
      reasons.push(`SJT score ${sjt.normalized} below minimum ${t.highRisk.SJT} — poor judgment in sales scenarios`);
    if (scales.K.normalized < t.highRisk.K)
      reasons.push(`K-scale ${scales.K.normalized} below ${t.highRisk.K} — potential integrity concerns`);
    if (scales.C.normalized < t.highRisk.C)
      reasons.push(`Compliance ${scales.C.normalized} below ${t.highRisk.C} — risk of process non-adherence`);
    return { band: "high_risk", bandReasons: reasons };
  }

  // Check strong shortlist
  const meetsStrong =
    overall >= t.strong.overall &&
    scales.D.normalized >= t.strong.D &&
    scales.I.normalized >= t.strong.I &&
    scales.C.normalized >= t.strong.C &&
    scales.K.normalized >= t.strong.K &&
    sjt.normalized >= t.strong.SJT;

  if (meetsStrong) {
    reasons.push("All scale thresholds met for strong shortlist");
    return { band: "strong_shortlist", bandReasons: reasons };
  }

  // Conditional band
  if (overall >= t.conditional.overallMin && overall <= t.conditional.overallMax) {
    if (scales.D.normalized < t.strong.D)
      reasons.push(`D-scale ${scales.D.normalized} below strong threshold ${t.strong.D}`);
    if (scales.I.normalized < t.strong.I)
      reasons.push(`I-scale ${scales.I.normalized} below strong threshold ${t.strong.I}`);
    if (scales.C.normalized < t.strong.C)
      reasons.push(`C-scale ${scales.C.normalized} below strong threshold ${t.strong.C}`);
    if (scales.K.normalized < t.strong.K)
      reasons.push(`K-scale ${scales.K.normalized} below strong threshold ${t.strong.K}`);
    if (sjt.normalized < t.strong.SJT)
      reasons.push(`SJT ${sjt.normalized} below strong threshold ${t.strong.SJT}`);
    if (reasons.length === 0) reasons.push("Overall in conditional range");
    return { band: "conditional", bandReasons: reasons };
  }

  // Default to high_risk if nothing else matches
  reasons.push(`Overall score ${overall} did not meet conditional minimum ${t.conditional.overallMin}`);
  return { band: "high_risk", bandReasons: reasons };
}
