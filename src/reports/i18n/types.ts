import type { OverallBand, SalesRole, DISCScale, RitchieScale, ZIMADimension } from "../../engine/types";

export interface ReportDictionary {
  reportTitle: string;
  reportSubtitle: string;
  confidential: string;
  preparedFor: string;
  candidateLabel: string;
  positionLabel: string;
  departmentLabel: string;
  dateLabel: string;
  versionLabel: string;
  pageLabel: string;

  executiveSummary: string;
  overallRecommendation: string;
  overallScore: string;
  recommendedRole: string;
  secondaryRole: string;

  discSection: string;
  discOverall: string;
  discProfile: string;
  discSJT: string;
  discBand: string;
  discScales: string;
  discValidity: string;
  discConsistency: string;

  zimaSection: string;
  zimaFitScore: string;
  zimaPrimaryRole: string;
  zimaSecondaryRole: string;
  zimaDimensions: string;
  zimaRedFlags: string;
  zimaEnvironment: string;
  zimaTraining: string;

  ritchieSection: string;
  ritchieTopMotivators: string;
  ritchieBottomMotivators: string;
  ritchieRoleFit: string;
  ritchieScales: string;

  strengthsSection: string;
  risksSection: string;
  managementSection: string;
  interviewSection: string;
  retentionSection: string;
  finalSection: string;

  bands: Record<OverallBand, string>;
  discBands: Record<string, string>;
  roleFitLabels: Record<string, string>;
  roleLabels: Record<SalesRole, string>;
  discScaleLabels: Record<DISCScale, string>;
  ritchieScaleLabels: Record<RitchieScale, string>;
  zimaDimensionLabels: Record<ZIMADimension, string>;

  severityLabels: Record<string, string>;
  validLabel: string;
  invalidLabel: string;
  consistentLabel: string;
  inconsistentLabel: string;

  generatedBy: string;
  disclaimer: string;
}
