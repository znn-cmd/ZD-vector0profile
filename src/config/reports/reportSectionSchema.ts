// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PDF Report Section Schema
//
//  Defines the structural map of every section in the "Personal Vector
//  Profile" report. Each section declares its copy keys, whether it
//  carries data-driven content, and its render order.
//
//  The PDF generator uses this schema to:
//  1. Pull the correct copy block from pdfCopy.{lang}.ts
//  2. Merge scored data from the FinalProfile
//  3. Render in a deterministic, consistent order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Copy Block Type ────────────────────────────────────────────────

export interface SectionCopyBlock {
  /** Section heading displayed in the PDF */
  readonly heading: string;
  /** Intro paragraph printed below the heading, before any data */
  readonly intro: string;
  /** Optional helper text / note shown after the main content */
  readonly helperNote?: string;
}

// ─── Meta Copy (labels, stamps, microcopy) ──────────────────────────

export interface MetaCopy {
  readonly coverTitle: string;
  readonly coverSubtitle: string;
  readonly brandLine: string;
  readonly confidentialStamp: string;
  readonly reportIntro: string;

  readonly generatedOnLabel: string;
  readonly reportVersionLabel: string;
  readonly targetRoleLabel: string;
  readonly responsibleHRLabel: string;
  readonly overallBandLabel: string;
  readonly finalRecommendationLabel: string;
  readonly overallScoreLabel: string;
  readonly candidateLabel: string;
  readonly positionLabel: string;
  readonly departmentLabel: string;
  readonly assessmentDateLabel: string;
  readonly pageLabel: string;

  readonly validityLabel: string;
  readonly consistencyLabel: string;
  readonly validCleanLabel: string;
  readonly validCautionLabel: string;
  readonly validRiskLabel: string;
  readonly consistentCleanLabel: string;
  readonly consistentCautionLabel: string;
  readonly consistentRiskLabel: string;

  readonly roleFitStrongLabel: string;
  readonly roleFitModerateLabel: string;
  readonly roleFitWeakLabel: string;

  readonly footerDisclaimer: string;
  readonly footerGenerated: string;
}

// ─── Chart / Table Microcopy ────────────────────────────────────────

export interface ChartMicrocopy {
  readonly scoreAxisLabel: string;
  readonly scaleAxisLabel: string;
  readonly dimensionAxisLabel: string;
  readonly roleFitAxisLabel: string;
  readonly outOf100: string;
  readonly highLabel: string;
  readonly mediumLabel: string;
  readonly lowLabel: string;
  readonly thresholdLineLabel: string;
  readonly noDataLabel: string;
  readonly topMotivatorsLabel: string;
  readonly bottomMotivatorsLabel: string;
  readonly criticalGapLabel: string;
  readonly redFlagLabel: string;
  readonly warningLabel: string;
  readonly criticalLabel: string;
}

// ─── Full PDF Copy Dictionary ───────────────────────────────────────

export interface PDFCopyDictionary {
  readonly lang: "en" | "ru";
  readonly meta: MetaCopy;
  readonly charts: ChartMicrocopy;

  readonly sections: {
    readonly executiveSummary: SectionCopyBlock;
    readonly discBehavioral: SectionCopyBlock;
    readonly zimaRoleFit: SectionCopyBlock;
    readonly ritchieMotivational: SectionCopyBlock;
    readonly strengths: SectionCopyBlock;
    readonly risks: SectionCopyBlock;
    readonly managementRecommendations: SectionCopyBlock;
    readonly interviewFocus: SectionCopyBlock;
    readonly retentionRisks: SectionCopyBlock;
    readonly finalRecommendation: SectionCopyBlock;
  };
}

// ─── Section Render Order ───────────────────────────────────────────

export type SectionId = keyof PDFCopyDictionary["sections"];

/**
 * Canonical render order. The PDF generator iterates this array
 * to draw sections in the correct sequence.
 */
export const SECTION_RENDER_ORDER: readonly SectionId[] = [
  "executiveSummary",
  "discBehavioral",
  "zimaRoleFit",
  "ritchieMotivational",
  "strengths",
  "risks",
  "managementRecommendations",
  "interviewFocus",
  "retentionRisks",
  "finalRecommendation",
] as const;

// ─── Section Metadata ───────────────────────────────────────────────

export interface SectionMeta {
  readonly id: SectionId;
  readonly hasBarChart: boolean;
  readonly hasDataTable: boolean;
  readonly hasBulletList: boolean;
  readonly hasCalloutBox: boolean;
  readonly pageBreakBefore: boolean;
}

export const SECTION_META: readonly SectionMeta[] = [
  { id: "executiveSummary",         hasBarChart: false, hasDataTable: false, hasBulletList: false, hasCalloutBox: true,  pageBreakBefore: false },
  { id: "discBehavioral",          hasBarChart: true,  hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: true  },
  { id: "zimaRoleFit",             hasBarChart: true,  hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "ritchieMotivational",     hasBarChart: true,  hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: true  },
  { id: "strengths",               hasBarChart: false, hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "risks",                   hasBarChart: false, hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "managementRecommendations", hasBarChart: false, hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "interviewFocus",          hasBarChart: false, hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "retentionRisks",          hasBarChart: false, hasDataTable: false, hasBulletList: true,  hasCalloutBox: false, pageBreakBefore: false },
  { id: "finalRecommendation",     hasBarChart: false, hasDataTable: false, hasBulletList: false, hasCalloutBox: true,  pageBreakBefore: true  },
];
