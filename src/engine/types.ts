// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Domain Engine Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Primitives ──────────────────────────────────────────────────────

/** 6-point Likert: 1 = Strongly Disagree … 6 = Strongly Agree */
export type Likert6 = 1 | 2 | 3 | 4 | 5 | 6;

/** SJT option ranking — ranks 1 (best) through 4 (worst), no ties */
export type SJTRanking = [rank1: number, rank2: number, rank3: number, rank4: number];

/** Forced-choice binary pick */
export type ForcedChoicePick = "a" | "b";

/** Mini-case multiple-choice answer */
export type CaseOptionId = "a" | "b" | "c" | "d";

// ─── Scale Identifiers ──────────────────────────────────────────────

export type DISCScale = "D" | "I" | "S" | "C" | "K";

export type RitchieScale =
  | "INC"   // Incentive / money
  | "REC"   // Recognition
  | "ACH"   // Achievement
  | "POW"   // Power / influence
  | "VAR"   // Variety / change
  | "AUT"   // Autonomy
  | "STR"   // Structure
  | "REL"   // Relationships
  | "VAL"   // Values alignment
  | "DEV"   // Development / growth
  | "SEC"   // Security
  | "DRI";  // Drive / energy

export type ZIMADimension =
  | "pace"          // Speed of environment preference
  | "autonomy"      // Independence vs. structure
  | "collaboration" // Team vs. solo orientation
  | "risk"          // Risk tolerance
  | "innovation"    // Novelty-seeking
  | "client_focus"  // Client-facing orientation
  | "process"       // Process adherence
  | "resilience"    // Pressure handling
  | "ambiguity"     // Comfort with ambiguity
  | "growth";       // Growth-orientation

export type SalesRole = "full_cycle" | "hunter" | "consultative" | "team_lead";

// ─── Item Configuration ─────────────────────────────────────────────

export interface LikertItem {
  id: string;
  scale: string;
  reversed: boolean;
  consistencyPairId?: string;
  text: string;
}

export interface SJTCase {
  id: string;
  scenario: string;
  options: [string, string, string, string];
  /** Expert key: ideal ranking of the 4 options (option indices 0-3) */
  expertKey: SJTRanking;
}

export interface ForcedChoiceBlock {
  id: string;
  prompt: string;
  optionA: { text: string; scale: string };
  optionB: { text: string; scale: string };
}

export interface MiniCase {
  id: string;
  scenario: string;
  options: { id: CaseOptionId; text: string }[];
  scoring: Record<CaseOptionId, { scale: string; points: number }[]>;
}

export interface ValidityItem {
  id: string;
  text: string;
  expectedDirection: "agree" | "disagree";
  /** Max acceptable deviation from expected end of scale */
  threshold: number;
}

export interface ConsistencyPair {
  itemA: string;
  itemB: string;
  /** Maximum acceptable absolute difference (after both are on the same direction) */
  maxDelta: number;
  sameDirection: boolean;
}

// ─── Block Configurations ────────────────────────────────────────────

export interface DISCBlockConfig {
  items: LikertItem[];
  sjtCases: SJTCase[];
  consistencyPairs: ConsistencyPair[];
  /** Items that serve as validity / lie-scale detectors */
  validityItemIds: string[];
  scaleWeights: Record<DISCScale | "SJT", number>;
  thresholds: DISCThresholds;
}

export interface DISCThresholds {
  strong: { overall: number; D: number; I: number; C: number; K: number; SJT: number };
  conditional: { overallMin: number; overallMax: number };
  highRisk: { overall: number; SJT: number; K: number; C: number };
}

export interface RitchieBlockConfig {
  items: LikertItem[];
  forcedChoiceBlocks: ForcedChoiceBlock[];
  miniCases: MiniCase[];
  validityItems: ValidityItem[];
  consistencyPairs: ConsistencyPair[];
  roleProfiles: Record<SalesRole, RoleProfile>;
}

export interface RoleProfile {
  label: string;
  /** Scale → ideal score (0-100) */
  idealScores: Partial<Record<RitchieScale, number>>;
  /** Scales that are critical for this role */
  criticalScales: RitchieScale[];
  /** Minimum score on critical scales to be considered a fit */
  criticalMinimum: number;
}

export interface ZIMABlockConfig {
  items: LikertItem[];
  dimensions: ZIMADimension[];
  roleWeightMatrix: Record<SalesRole, Record<ZIMADimension, number>>;
  redFlagRules: RedFlagRule[];
  environmentNotes: Record<ZIMADimension, { low: string; high: string }>;
}

export interface RedFlagRule {
  id: string;
  condition: (scores: Record<ZIMADimension, number>) => boolean;
  message: string;
  severity: "warning" | "critical";
}

// ─── Raw Answer Inputs ───────────────────────────────────────────────

export interface DISCAnswers {
  likert: Record<string, Likert6>;
  sjt: Record<string, SJTRanking>;
}

export interface RitchieAnswers {
  likert: Record<string, Likert6>;
  forcedChoice: Record<string, ForcedChoicePick>;
  miniCases: Record<string, CaseOptionId>;
}

export interface ZIMAAnswers {
  likert: Record<string, Likert6>;
}

export interface AllBlockAnswers {
  disc: DISCAnswers;
  ritchie: RitchieAnswers;
  zima: ZIMAAnswers;
}

// ─── Scoring Outputs ─────────────────────────────────────────────────

export interface ScaleScore {
  raw: number;
  max: number;
  normalized: number;    // 0–100
  itemCount: number;
  answeredCount: number;
}

export interface ValidityReport {
  isValid: boolean;
  flags: string[];
  /** 0–100, where 100 = fully valid responding */
  score: number;
}

export interface ConsistencyReport {
  isConsistent: boolean;
  violations: { pairId: string; itemA: string; itemB: string; delta: number }[];
  /** 0–100 */
  score: number;
}

// ─── DISC Block Result ───────────────────────────────────────────────

export interface DISCBlockResult {
  scales: Record<DISCScale, ScaleScore>;
  sjtScore: ScaleScore;
  validity: ValidityReport;
  consistency: ConsistencyReport;
  overall: number;         // 0–100 weighted composite
  band: "strong_shortlist" | "conditional" | "high_risk";
  bandReasons: string[];
  scaleProfile: {
    primary: DISCScale;
    secondary: DISCScale;
    label: string;
  };
}

// ─── Ritchie–Martin Block Result ─────────────────────────────────────

export interface RitchieBlockResult {
  scales: Record<RitchieScale, ScaleScore>;
  forcedChoiceAdjustments: Record<RitchieScale, number>;
  miniCaseScores: Record<string, { scale: string; points: number }[]>;
  validity: ValidityReport;
  consistency: ConsistencyReport;
  topMotivators: RitchieScale[];
  bottomMotivators: RitchieScale[];
  roleFit: Record<SalesRole, RoleFitResult>;
}

export interface RoleFitResult {
  score: number;            // 0–100
  label: string;
  fit: "strong" | "moderate" | "weak";
  criticalGaps: { scale: RitchieScale; score: number; required: number }[];
}

// ─── ZIMA Block Result ───────────────────────────────────────────────

export interface ZIMABlockResult {
  dimensions: Record<ZIMADimension, ScaleScore>;
  fitScore: number;         // 0–100 overall company fit
  primaryRole: SalesRole;
  secondaryRole: SalesRole;
  roleFitScores: Record<SalesRole, number>;
  environmentNotes: string[];
  redFlags: { id: string; message: string; severity: "warning" | "critical" }[];
  trainingRecommendations: string[];
  managementRecommendations: string[];
}

// ─── Final Aggregated Profile ────────────────────────────────────────

export type OverallBand =
  | "strong_hire"
  | "recommended"
  | "conditional"
  | "not_recommended";

export interface FinalProfile {
  candidateId: string;
  assessedAt: string;

  disc: DISCBlockResult;
  ritchie: RitchieBlockResult;
  zima: ZIMABlockResult;

  overallScore: number;         // 0–100
  overallBand: OverallBand;
  finalRecommendation: string;

  primaryRole: SalesRole;
  secondaryRole: SalesRole;

  strengths: string[];
  risks: string[];
  interviewFocusQuestions: string[];
  managementStyleRecommendations: string[];
  retentionRiskFlags: string[];
}
