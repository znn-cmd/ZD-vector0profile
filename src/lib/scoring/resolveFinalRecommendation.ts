// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Final Hiring Recommendation Resolver
//
//  Pure, deterministic:
//    (profile: FinalProfile, lang) → FinalRecommendationOutput
//
//  1. Evaluate every rule group against the FinalProfile
//  2. Collect matching rules → accumulate reasons[] and net score
//  3. Apply gate logic (reject gates, reserve gates)
//  4. Resolve tier from net score + thresholds
//  5. Return { recommendation, reasons[], audit trail }
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalProfile, SalesRole } from "@/engine/types";
import type { Lang } from "@/storage/types";

import {
  REJECT_GATE_RULES,
  RESERVE_GATE_RULES,
  CAUTION_FLAG_RULES,
  SHORTLIST_QUALIFIER_RULES,
  STRENGTH_SIGNAL_RULES,
  RISK_SIGNAL_RULES,
  TIER_THRESHOLDS,
  TIER_LABELS,
  type RecommendationTier,
  type RecommendationRule,
  type RuleCategory,
} from "@/config/assessments/finalRecommendationRules";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Output Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface MatchedRule {
  ruleId: string;
  category: RuleCategory;
  weight: number;
  reason: string;
}

export interface FinalRecommendationOutput {
  candidateId: string;
  lang: Lang;
  generatedAt: string;
  finalRecommendation: RecommendationTier;
  finalRecommendationLabel: string;
  reasons: string[];
  netScore: number;
  matchedRules: MatchedRule[];
  gateTriggered: "reject_gate" | "reserve_gate" | null;
  audit: {
    totalRulesEvaluated: number;
    totalMatched: number;
    promoteWeight: number;
    demoteWeight: number;
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Condition Evaluators
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function evalRejectGates(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];
  const hasCriticalFlags = p.zima.redFlags.some((f) => f.severity === "critical");

  // rg_01: overall < 45
  if (p.overallScore < 45) matched.push(REJECT_GATE_RULES[0]);
  // rg_02: DISC high_risk + critical ZIMA flags
  if (p.disc.band === "high_risk" && hasCriticalFlags) matched.push(REJECT_GATE_RULES[1]);
  // rg_03: SJT < 45
  if (p.disc.sjtScore.normalized < 45) matched.push(REJECT_GATE_RULES[2]);
  // rg_04: K < 40 AND validity < 50
  if (p.disc.scales.K.normalized < 40 && p.disc.validity.score < 50) matched.push(REJECT_GATE_RULES[3]);
  // rg_05: ZIMA fit < 35
  if (p.zima.fitScore < 35) matched.push(REJECT_GATE_RULES[4]);

  return matched;
}

function evalReserveGates(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];

  // res_01: overall 45–54
  if (p.overallScore >= 45 && p.overallScore < 55) matched.push(RESERVE_GATE_RULES[0]);

  // res_02: all role fits < 50
  const allRoleFitsWeak = (Object.values(p.ritchie.roleFit) as { score: number }[])
    .every((rf) => rf.score < 50);
  if (allRoleFitsWeak) matched.push(RESERVE_GATE_RULES[1]);

  // res_03: 3+ critical red flags
  const criticalCount = p.zima.redFlags.filter((f) => f.severity === "critical").length;
  if (criticalCount >= 3) matched.push(RESERVE_GATE_RULES[2]);

  return matched;
}

function evalCautionFlags(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];
  const hasCriticalFlags = p.zima.redFlags.some((f) => f.severity === "critical");
  const primaryRoleFit = p.ritchie.roleFit[p.primaryRole];

  if (p.disc.scales.C.normalized < 50)  matched.push(CAUTION_FLAG_RULES[0]);  // cf_01
  if (p.disc.scales.K.normalized < 55)  matched.push(CAUTION_FLAG_RULES[1]);  // cf_02
  if (p.disc.sjtScore.normalized < 60)  matched.push(CAUTION_FLAG_RULES[2]);  // cf_03
  if (p.disc.validity.score < 65)       matched.push(CAUTION_FLAG_RULES[3]);  // cf_04
  if (p.disc.consistency.score < 65)    matched.push(CAUTION_FLAG_RULES[4]);  // cf_05
  if (primaryRoleFit && primaryRoleFit.score < 55) matched.push(CAUTION_FLAG_RULES[5]); // cf_06
  if (p.zima.fitScore < 55)             matched.push(CAUTION_FLAG_RULES[6]);  // cf_07
  if (p.disc.band === "conditional")    matched.push(CAUTION_FLAG_RULES[7]);  // cf_08
  if (hasCriticalFlags)                 matched.push(CAUTION_FLAG_RULES[8]);  // cf_09
  if (primaryRoleFit && primaryRoleFit.criticalGaps.length > 0) matched.push(CAUTION_FLAG_RULES[9]); // cf_10

  return matched;
}

function evalShortlistQualifiers(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];
  const primaryRoleFit = p.ritchie.roleFit[p.primaryRole];

  if (p.overallScore >= 78)                                              matched.push(SHORTLIST_QUALIFIER_RULES[0]); // sq_01
  if (p.disc.band === "strong_shortlist")                                matched.push(SHORTLIST_QUALIFIER_RULES[1]); // sq_02
  if (primaryRoleFit && primaryRoleFit.score >= 70)                      matched.push(SHORTLIST_QUALIFIER_RULES[2]); // sq_03
  if (p.zima.fitScore >= 70)                                             matched.push(SHORTLIST_QUALIFIER_RULES[3]); // sq_04
  if (p.disc.validity.score >= 80 && p.disc.consistency.score >= 80)     matched.push(SHORTLIST_QUALIFIER_RULES[4]); // sq_05

  return matched;
}

function evalStrengthSignals(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];
  const secondaryRoleFit = p.ritchie.roleFit[p.secondaryRole];

  if (p.disc.sjtScore.normalized >= 75)               matched.push(STRENGTH_SIGNAL_RULES[0]); // ss_01
  if (p.disc.scales.D.normalized >= 70)                matched.push(STRENGTH_SIGNAL_RULES[1]); // ss_02
  if (p.disc.scales.I.normalized >= 70)                matched.push(STRENGTH_SIGNAL_RULES[2]); // ss_03
  if (p.ritchie.scales.DRI.normalized >= 75)           matched.push(STRENGTH_SIGNAL_RULES[3]); // ss_04
  if (p.ritchie.scales.ACH.normalized >= 75)           matched.push(STRENGTH_SIGNAL_RULES[4]); // ss_05
  if (p.zima.dimensions.resilience.normalized >= 70)   matched.push(STRENGTH_SIGNAL_RULES[5]); // ss_06
  if (p.zima.dimensions.client_focus.normalized >= 75) matched.push(STRENGTH_SIGNAL_RULES[6]); // ss_07
  if (secondaryRoleFit && secondaryRoleFit.score >= 60) matched.push(STRENGTH_SIGNAL_RULES[7]); // ss_08

  return matched;
}

function evalRiskSignals(p: FinalProfile): RecommendationRule[] {
  const matched: RecommendationRule[] = [];

  if (p.disc.scales.S.normalized < 45) matched.push(RISK_SIGNAL_RULES[0]); // rs_01

  // Motivational mismatches
  if (p.primaryRole === "hunter" && p.ritchie.scales.DRI.normalized < 60)
    matched.push(RISK_SIGNAL_RULES[1]); // rs_02
  if (p.primaryRole === "consultative" && p.ritchie.scales.REL.normalized < 55)
    matched.push(RISK_SIGNAL_RULES[2]); // rs_03
  if (p.primaryRole === "team_lead" && p.ritchie.scales.POW.normalized < 55)
    matched.push(RISK_SIGNAL_RULES[3]); // rs_04

  if (p.zima.dimensions.process.normalized < 40)       matched.push(RISK_SIGNAL_RULES[4]); // rs_05
  if (p.ritchie.scales.SEC.normalized < 30)            matched.push(RISK_SIGNAL_RULES[5]); // rs_06
  if (p.zima.dimensions.resilience.normalized < 45)    matched.push(RISK_SIGNAL_RULES[6]); // rs_07
  if (p.disc.scales.D.normalized >= 75 && p.disc.scales.I.normalized < 45)
    matched.push(RISK_SIGNAL_RULES[7]); // rs_08

  return matched;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Main Resolver
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function resolveFinalRecommendation(
  profile: FinalProfile,
  lang: Lang = "en",
): FinalRecommendationOutput {
  const totalRules =
    REJECT_GATE_RULES.length +
    RESERVE_GATE_RULES.length +
    CAUTION_FLAG_RULES.length +
    SHORTLIST_QUALIFIER_RULES.length +
    STRENGTH_SIGNAL_RULES.length +
    RISK_SIGNAL_RULES.length;

  // Evaluate all rule groups
  const rejectGates    = evalRejectGates(profile);
  const reserveGates   = evalReserveGates(profile);
  const cautionFlags   = evalCautionFlags(profile);
  const shortlistQuals = evalShortlistQualifiers(profile);
  const strengthSigs   = evalStrengthSignals(profile);
  const riskSigs       = evalRiskSignals(profile);

  // Collect all matched rules
  const allMatched: RecommendationRule[] = [
    ...rejectGates,
    ...reserveGates,
    ...cautionFlags,
    ...shortlistQuals,
    ...strengthSigs,
    ...riskSigs,
  ];

  // Build matched rule output with localized reasons
  const matchedRules: MatchedRule[] = allMatched.map((r) => ({
    ruleId: r.id,
    category: r.category,
    weight: r.weight,
    reason: r.reason[lang],
  }));

  // Compute net score
  const promoteWeight = allMatched
    .filter((r) => r.effect === "promote")
    .reduce((s, r) => s + r.weight, 0);
  const demoteWeight = allMatched
    .filter((r) => r.effect === "demote")
    .reduce((s, r) => s + r.weight, 0);
  const netScore = promoteWeight + demoteWeight;

  // Determine tier with gate logic
  let gateTriggered: "reject_gate" | "reserve_gate" | null = null;
  let tier: RecommendationTier;

  if (rejectGates.length > 0) {
    tier = "reject";
    gateTriggered = "reject_gate";
  } else if (reserveGates.length > 0) {
    tier = "reserve_pool";
    gateTriggered = "reserve_gate";
  } else if (netScore >= TIER_THRESHOLDS.shortlist) {
    tier = "shortlist";
  } else if (netScore >= TIER_THRESHOLDS.interview) {
    tier = "interview_with_caution";
  } else if (netScore >= TIER_THRESHOLDS.reserve) {
    tier = "reserve_pool";
  } else {
    tier = "reject";
  }

  // Build reasons[] — ordered: strengths first, then cautions, then risks
  const reasons: string[] = [];
  for (const r of shortlistQuals) reasons.push(r.reason[lang]);
  for (const r of strengthSigs)   reasons.push(r.reason[lang]);
  for (const r of cautionFlags)   reasons.push(r.reason[lang]);
  for (const r of riskSigs)       reasons.push(r.reason[lang]);
  for (const r of reserveGates)   reasons.push(r.reason[lang]);
  for (const r of rejectGates)    reasons.push(r.reason[lang]);

  return {
    candidateId: profile.candidateId,
    lang,
    generatedAt: new Date().toISOString(),
    finalRecommendation: tier,
    finalRecommendationLabel: TIER_LABELS[tier][lang],
    reasons,
    netScore,
    matchedRules,
    gateTriggered,
    audit: {
      totalRulesEvaluated: totalRules,
      totalMatched: allMatched.length,
      promoteWeight,
      demoteWeight,
    },
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Re-exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type { RecommendationTier, RecommendationRule, RuleCategory };
