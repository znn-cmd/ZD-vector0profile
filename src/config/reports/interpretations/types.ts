// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interpretation Text Layer — Shared Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ScoreBand = "very_high" | "high" | "medium" | "low" | "very_low";
export type QualityBand = "clean" | "caution" | "risk";
export type FitBand = "strong" | "moderate" | "low";

export interface ScaleInterpretationBlock {
  readonly band: ScoreBand;
  readonly label: string;
  readonly explanation: string;
  readonly implication: string;
  readonly riskNote?: string;
  readonly interviewFollowUp?: string;
}

export interface QualityInterpretationBlock {
  readonly band: QualityBand;
  readonly label: string;
  readonly explanation: string;
  readonly implication: string;
  readonly riskNote?: string;
}

export interface RitchieScaleBandBlock {
  readonly band: ScoreBand;
  readonly label: string;
  readonly energizedBy: string;
  readonly demotivatedBy: string;
  readonly managementImplication: string;
  readonly retentionImplication?: string;
}

export interface RoleFitInterpretation {
  readonly roleId: string;
  readonly roleLabel: string;
  readonly strongFit: string;
  readonly moderateFit: string;
  readonly weakFit: string;
  readonly keyStrengthsNeeded: string;
  readonly commonGaps: string;
}

export interface ZIMAFitBlock {
  readonly band: FitBand;
  readonly label: string;
  readonly explanation: string;
  readonly managementNote: string;
  readonly rampUpNote: string;
}

export interface ZIMARoleMismatchWarning {
  readonly roleId: string;
  readonly warning: string;
  readonly mitigation: string;
}

export type FinalBandId =
  | "strong_fit"
  | "conditional_fit"
  | "high_risk"
  | "shortlist"
  | "interview_with_caution"
  | "reject"
  | "reserve_pool";

export interface FinalBandTemplate {
  readonly bandId: FinalBandId;
  readonly headline: string;
  readonly summary: string;
  readonly nextStep: string;
}

export interface NarrativeSectionTemplates {
  readonly topStrengthsIntro: string;
  readonly keyRisksIntro: string;
  readonly managementStyleIntro: string;
  readonly interviewFocusIntro: string;
  readonly onboardingRisksIntro: string;
  readonly targetRoleIntro: string;
  readonly noItemsFallback: string;
}

export interface FullInterpretationDictionary {
  readonly lang: "en" | "ru";

  readonly disc: {
    readonly D: readonly ScaleInterpretationBlock[];
    readonly I: readonly ScaleInterpretationBlock[];
    readonly S: readonly ScaleInterpretationBlock[];
    readonly C: readonly ScaleInterpretationBlock[];
    readonly K: readonly ScaleInterpretationBlock[];
    readonly SJT: readonly ScaleInterpretationBlock[];
    readonly validity: readonly QualityInterpretationBlock[];
    readonly consistency: readonly QualityInterpretationBlock[];
  };

  readonly ritchie: {
    readonly scales: Record<string, readonly RitchieScaleBandBlock[]>;
    readonly roleFit: readonly RoleFitInterpretation[];
  };

  readonly zima: {
    readonly environmentFit: readonly ZIMAFitBlock[];
    readonly roleMismatchWarnings: readonly ZIMARoleMismatchWarning[];
    readonly managementRecommendations: readonly string[];
    readonly rampUpRecommendations: readonly string[];
  };

  readonly finalSummary: {
    readonly bands: readonly FinalBandTemplate[];
    readonly narrative: NarrativeSectionTemplates;
  };
}
