/**
 * Build WebSummaryCard from stored AssessmentResults (e.g. seed/demo or saved report).
 * When results include optional summary fields (overallScore, overallBand, etc.),
 * they are used; otherwise fallbacks are applied for backward compatibility.
 */

import type { AssessmentResults } from "@/types";
import type { WebSummaryCard } from "@/reports/types";

export function resultsToSummaryCard(
  candidateId: string,
  candidateName: string,
  position: string,
  results: AssessmentResults
): WebSummaryCard {
  const discScales = results.discScales ?? {
    ...results.disc.normalized,
    K: results.discSjtScore ?? 0,
  };
  const r = results as AssessmentResults & {
    overallScore?: number;
    overallBand?: WebSummaryCard["overallBand"];
    primaryRole?: WebSummaryCard["primaryRole"];
    secondaryRole?: WebSummaryCard["secondaryRole"];
    recommendation?: string;
    strengths?: string[];
    risks?: string[];
    interviewQuestions?: string[];
    managementRecs?: string[];
    retentionFlags?: string[];
    reportVersion?: string;
    discOverall?: number;
    discSjtScore?: number;
    zimaRedFlagCount?: number;
    ritchieBestRole?: WebSummaryCard["primaryRole"];
    ritchieBestRoleScore?: number;
    ritchieBestRoleFit?: string;
    zimaDimensions?: Record<string, number>;
  };

  return {
    candidateId,
    candidateName,
    position,
    assessedAt: results.generatedAt,
    overallScore: r.overallScore ?? 0,
    overallBand: r.overallBand ?? "conditional",
    primaryRole: r.primaryRole ?? "full_cycle",
    secondaryRole: r.secondaryRole ?? "hunter",
    recommendation: r.recommendation ?? "",
    reportVersion: r.reportVersion ?? "V1",

    discProfile: {
      primary: (results.disc.primaryType as WebSummaryCard["discProfile"]["primary"]) ?? "D",
      secondary: (results.disc.secondaryType as WebSummaryCard["discProfile"]["secondary"]) ?? "I",
      label: results.disc.profileLabel,
      overall: r.discOverall ?? 0,
      sjtScore: r.discSjtScore ?? 0,
      scales: discScales as WebSummaryCard["discProfile"]["scales"],
    },

    ritchieProfile: {
      topMotivators: results.ritchieMartin.topMotivators as unknown as WebSummaryCard["ritchieProfile"]["topMotivators"],
      bottomMotivators: results.ritchieMartin.bottomMotivators as unknown as WebSummaryCard["ritchieProfile"]["bottomMotivators"],
      bestRoleFit: {
        role: (r.ritchieBestRole ?? "full_cycle") as WebSummaryCard["ritchieProfile"]["bestRoleFit"]["role"],
        score: r.ritchieBestRoleScore ?? 0,
        fit: r.ritchieBestRoleFit ?? "moderate",
      },
      scales: results.ritchieMartin.motivators as unknown as WebSummaryCard["ritchieProfile"]["scales"],
    },

    zimaProfile: {
      fitScore: results.zima.percentile,
      primaryRole: (r.primaryRole ?? "full_cycle") as WebSummaryCard["zimaProfile"]["primaryRole"],
      redFlagCount: r.zimaRedFlagCount ?? 0,
      dimensions: (r.zimaDimensions ?? results.zima.categories) as WebSummaryCard["zimaProfile"]["dimensions"],
    },

    strengths: r.strengths ?? [],
    risks: r.risks ?? [],
    interviewQuestions: r.interviewQuestions ?? [],
    managementRecs: r.managementRecs ?? [],
    retentionFlags: r.retentionFlags ?? [],
  } as WebSummaryCard;
}
