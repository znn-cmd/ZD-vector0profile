// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Web Summary Card Builder
//  Compact data structure for dashboard rendering.
//  No PDF dependency — pure data transformation.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ReportInput, ReportVersion, WebSummaryCard } from "./types";
import type { DISCScale, RitchieScale, ZIMADimension, SalesRole } from "../engine/types";

export function buildSummaryCard(
  input: ReportInput,
  version: ReportVersion,
): WebSummaryCard {
  const p = input.profile;

  // DISC scales → normalized map
  const discScales = {} as Record<DISCScale, number>;
  for (const [k, v] of Object.entries(p.disc.scales)) {
    discScales[k as DISCScale] = v.normalized;
  }

  // Ritchie scales → normalized map
  const ritchieScales = {} as Record<RitchieScale, number>;
  for (const [k, v] of Object.entries(p.ritchie.scales)) {
    ritchieScales[k as RitchieScale] = v.normalized;
  }

  // Best Ritchie role fit
  const bestRoleFit = (Object.entries(p.ritchie.roleFit) as [SalesRole, { score: number; fit: string }][])
    .sort((a, b) => b[1].score - a[1].score)[0];

  // ZIMA dimensions → normalized map
  const zimaDims = {} as Record<ZIMADimension, number>;
  for (const [k, v] of Object.entries(p.zima.dimensions)) {
    zimaDims[k as ZIMADimension] = v.normalized;
  }

  return {
    candidateId: p.candidateId,
    candidateName: input.candidateName,
    position: input.position,
    assessedAt: input.assessedAt,
    overallScore: p.overallScore,
    overallBand: p.overallBand,
    primaryRole: p.primaryRole,
    secondaryRole: p.secondaryRole,

    discProfile: {
      primary: p.disc.scaleProfile.primary,
      secondary: p.disc.scaleProfile.secondary,
      label: p.disc.scaleProfile.label,
      overall: p.disc.overall,
      sjtScore: p.disc.sjtScore.normalized,
      scales: discScales,
    },

    ritchieProfile: {
      topMotivators: p.ritchie.topMotivators,
      bottomMotivators: p.ritchie.bottomMotivators,
      bestRoleFit: {
        role: bestRoleFit[0],
        score: bestRoleFit[1].score,
        fit: bestRoleFit[1].fit,
      },
      scales: ritchieScales,
    },

    zimaProfile: {
      fitScore: p.zima.fitScore,
      primaryRole: p.zima.primaryRole,
      redFlagCount: p.zima.redFlags.length,
      dimensions: zimaDims,
    },

    strengths: p.strengths,
    risks: p.risks,
    interviewQuestions: p.interviewFocusQuestions,
    managementRecs: p.managementStyleRecommendations,
    retentionFlags: p.retentionRiskFlags,
    recommendation: p.finalRecommendation,
    reportVersion: version.version,
  };
}
