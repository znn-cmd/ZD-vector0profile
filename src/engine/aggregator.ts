// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Final Aggregator — merges DISC + Ritchie + ZIMA into FinalProfile
//
//  Overall formula:
//    overallScore = 0.35 × disc.overall
//                 + 0.30 × bestRitchieRoleFit
//                 + 0.35 × zima.fitScore
//
//  Band logic:
//    Strong Hire       ≥ 78  AND disc band ≠ "high_risk"
//    Recommended       70–77 AND no critical red flags
//    Conditional       55–69 OR disc band = "conditional"
//    Not Recommended   < 55  OR disc band = "high_risk" with critical flags
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  DISCBlockResult,
  RitchieBlockResult,
  ZIMABlockResult,
  FinalProfile,
  OverallBand,
  AllBlockAnswers,
  DISCBlockConfig,
  RitchieBlockConfig,
  ZIMABlockConfig,
  SalesRole,
} from "./types";

import { scoreDISCBlock } from "./scoring/disc.scorer";
import { scoreRitchieBlock } from "./scoring/ritchie.scorer";
import { scoreZIMABlock } from "./scoring/zima.scorer";
import {
  deriveStrengths,
  deriveRisks,
  deriveInterviewQuestions,
  deriveManagementRecs,
  deriveRetentionRisks,
} from "./interpreter";

// ─── Block Weight Constants ──────────────────────────────────────────

const BLOCK_WEIGHTS = {
  disc: 0.35,
  ritchie: 0.30,
  zima: 0.35,
} as const;

// ─── Main Entry Point ────────────────────────────────────────────────

export interface AggregatorInput {
  candidateId: string;
  answers: AllBlockAnswers;
  discConfig: DISCBlockConfig;
  ritchieConfig: RitchieBlockConfig;
  zimaConfig: ZIMABlockConfig;
}

/**
 * Full assessment pipeline:
 *   answers → score all 3 blocks → aggregate → interpret → FinalProfile
 *
 * This is the single function an integrator calls.
 * All logic is pure and deterministic.
 */
export function computeFinalProfile(input: AggregatorInput): FinalProfile {
  const { candidateId, answers, discConfig, ritchieConfig, zimaConfig } = input;

  // ── Score each block ────────────────────────────────────────────
  const disc = scoreDISCBlock(answers.disc, discConfig);
  const ritchie = scoreRitchieBlock(answers.ritchie, ritchieConfig);
  const zima = scoreZIMABlock(answers.zima, zimaConfig);

  // ── Best Ritchie role-fit score ─────────────────────────────────
  const bestRitchieRole = (Object.entries(ritchie.roleFit) as [SalesRole, { score: number }][])
    .sort((a, b) => b[1].score - a[1].score)[0];
  const bestRitchieScore = bestRitchieRole[1].score;

  // ── Weighted overall score ──────────────────────────────────────
  const overallScore = Math.round(
    BLOCK_WEIGHTS.disc * disc.overall +
    BLOCK_WEIGHTS.ritchie * bestRitchieScore +
    BLOCK_WEIGHTS.zima * zima.fitScore,
  );

  // ── Determine primary / secondary role ──────────────────────────
  // Combine Ritchie role-fit and ZIMA role-fit into a consensus
  const combinedRoleFit = computeCombinedRoleFit(ritchie, zima);
  const primaryRole = combinedRoleFit[0].role;
  const secondaryRole = combinedRoleFit[1].role;

  // ── Band assignment ─────────────────────────────────────────────
  const hasCriticalFlags = zima.redFlags.some((f) => f.severity === "critical");
  const overallBand = determineBand(overallScore, disc, hasCriticalFlags);

  // ── Final recommendation text ───────────────────────────────────
  const finalRecommendation = generateRecommendation(
    overallBand,
    overallScore,
    disc,
    primaryRole,
    combinedRoleFit[0].score,
  );

  // ── Interpretation ──────────────────────────────────────────────
  const strengths = deriveStrengths(disc, ritchie, zima);
  const risks = deriveRisks(disc, ritchie, zima);
  const interviewFocusQuestions = deriveInterviewQuestions(disc, ritchie, zima);
  const managementStyleRecommendations = deriveManagementRecs(disc, ritchie, zima);
  const retentionRiskFlags = deriveRetentionRisks(disc, ritchie, zima);

  return {
    candidateId,
    assessedAt: new Date().toISOString(),
    disc,
    ritchie,
    zima,
    overallScore,
    overallBand,
    finalRecommendation,
    primaryRole,
    secondaryRole,
    strengths,
    risks,
    interviewFocusQuestions,
    managementStyleRecommendations,
    retentionRiskFlags,
  };
}

// ─── Combined Role Fit ───────────────────────────────────────────────

function computeCombinedRoleFit(
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): { role: SalesRole; score: number }[] {
  const roles: SalesRole[] = ["full_cycle", "hunter", "consultative", "team_lead"];

  return roles
    .map((role) => ({
      role,
      // 50/50 blend of Ritchie role-fit and ZIMA role-fit
      score: Math.round(
        0.5 * ritchie.roleFit[role].score +
        0.5 * zima.roleFitScores[role],
      ),
    }))
    .sort((a, b) => b.score - a.score);
}

// ─── Band Determination ──────────────────────────────────────────────

function determineBand(
  overall: number,
  disc: DISCBlockResult,
  hasCriticalFlags: boolean,
): OverallBand {
  if (disc.band === "high_risk" && hasCriticalFlags) {
    return "not_recommended";
  }
  if (overall >= 78 && disc.band !== "high_risk") {
    return "strong_hire";
  }
  if (overall >= 70 && !hasCriticalFlags) {
    return "recommended";
  }
  if (overall >= 55) {
    return "conditional";
  }
  return "not_recommended";
}

// ─── Recommendation Text ─────────────────────────────────────────────

function generateRecommendation(
  band: OverallBand,
  overall: number,
  disc: DISCBlockResult,
  primaryRole: SalesRole,
  roleFitScore: number,
): string {
  const roleLabels: Record<SalesRole, string> = {
    full_cycle: "Full-Cycle Account Executive",
    hunter: "New Business Hunter",
    consultative: "Consultative / Solution Seller",
    team_lead: "Sales Team Lead",
  };

  switch (band) {
    case "strong_hire":
      return (
        `STRONG HIRE recommendation. Overall score ${overall}/100. ` +
        `Best-fit role: ${roleLabels[primaryRole]} (fit: ${roleFitScore}/100). ` +
        `DISC profile: ${disc.scaleProfile.label}. ` +
        `Proceed to final interview with focus on culture fit and compensation alignment.`
      );

    case "recommended":
      return (
        `RECOMMENDED. Overall score ${overall}/100. ` +
        `Primary role match: ${roleLabels[primaryRole]} (fit: ${roleFitScore}/100). ` +
        `DISC profile: ${disc.scaleProfile.label}. ` +
        `Proceed to structured interview addressing identified gaps.`
      );

    case "conditional":
      return (
        `CONDITIONAL. Overall score ${overall}/100 — proceed with caution. ` +
        `Best role match: ${roleLabels[primaryRole]} (fit: ${roleFitScore}/100). ` +
        `Significant gaps identified — conduct in-depth interview and reference checks ` +
        `before advancing. Consider role-specific probation period.`
      );

    case "not_recommended":
      return (
        `NOT RECOMMENDED for current role requirements. Overall score ${overall}/100. ` +
        `Critical flags present. ` +
        (disc.band === "high_risk"
          ? `DISC assessment indicates high risk: ${disc.bandReasons.join("; ")}. `
          : "") +
        `Consider alternative roles or revisit in 6–12 months.`
      );
  }
}
