// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Config-Driven Assessment Content Layer — Shared Types
//
//  All assessment blocks (DISC, ZIMA, Ritchie–Martin) use these
//  interfaces to define their question banks, scoring rules, and
//  interpretation logic.
//
//  Source: src/engine/types.ts (domain engine types — these mirror them
//  exactly to keep the config layer independent of runtime scoring code)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Primitives ──────────────────────────────────────────────────────

/** 6-point Likert: 1 = Strongly Disagree … 6 = Strongly Agree */
export type Likert6 = 1 | 2 | 3 | 4 | 5 | 6;

/** SJT ranking — candidate orders 4 options from 1 (best) to 4 (worst) */
export type SJTRanking = [rank1: number, rank2: number, rank3: number, rank4: number];

/** Forced-choice binary pick */
export type ForcedChoicePick = "a" | "b";

/** Mini-case option identifier */
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
  | "pace"
  | "autonomy"
  | "collaboration"
  | "risk"
  | "innovation"
  | "client_focus"
  | "process"
  | "resilience"
  | "ambiguity"
  | "growth";

export type SalesRole = "full_cycle" | "hunter" | "consultative" | "team_lead";

export type DISCBand = "strong_shortlist" | "conditional" | "high_risk";

export type OverallBand = "strong_hire" | "recommended" | "conditional" | "not_recommended";

export type RoleFitBand = "strong" | "moderate" | "weak";

// ─── Item Configuration ─────────────────────────────────────────────

export interface LikertItemConfig {
  /** Stable unique ID, e.g. "disc_d_01" */
  readonly id: string;
  /** The scale this item belongs to */
  readonly scale: string;
  /** If true, raw response is reversed before scoring (e.g. 6→1) */
  readonly reversed: boolean;
  /** Optional link to a consistency pair partner */
  readonly consistencyPairId?: string;
  /** Full question text (English, approved wording) */
  readonly text: string;
}

export interface SJTCaseConfig {
  /** Stable unique ID, e.g. "sjt_01" */
  readonly id: string;
  /** Scenario description shown to the candidate */
  readonly scenario: string;
  /** Exactly 4 response options */
  readonly options: readonly [string, string, string, string];
  /**
   * Expert-determined ideal ranking (option indices 0–3).
   * Candidate's ranking is compared against this via distance scoring.
   */
  readonly expertKey: SJTRanking;
}

export interface ForcedChoiceBlockConfig {
  /** Stable unique ID, e.g. "fc_01" */
  readonly id: string;
  /** Prompt shown to the candidate */
  readonly prompt: string;
  /** Option A: text + scale that gets +2 if chosen */
  readonly optionA: { readonly text: string; readonly scale: RitchieScale };
  /** Option B: text + scale that gets +2 if chosen */
  readonly optionB: { readonly text: string; readonly scale: RitchieScale };
}

export interface MiniCaseConfig {
  /** Stable unique ID, e.g. "mc_01" */
  readonly id: string;
  /** Scenario description */
  readonly scenario: string;
  /** Response options (typically 4) */
  readonly options: readonly { readonly id: CaseOptionId; readonly text: string }[];
  /**
   * Scoring rules per option choice.
   * Each option may affect multiple scales with signed point values.
   */
  readonly scoring: Readonly<Record<CaseOptionId, readonly { readonly scale: RitchieScale; readonly points: number }[]>>;
}

export interface ValidityItemConfig {
  /** Stable unique ID */
  readonly id: string;
  /** Full question text */
  readonly text: string;
  /** Expected healthy response direction */
  readonly expectedDirection: "agree" | "disagree";
  /** Max acceptable deviation from expected end of scale */
  readonly threshold: number;
}

export interface ConsistencyPairConfig {
  /** ID of first item in the pair */
  readonly itemA: string;
  /** ID of second item in the pair */
  readonly itemB: string;
  /** Maximum acceptable absolute difference (after scoring direction alignment) */
  readonly maxDelta: number;
  /** If true, items should track in the same direction; if false, inversely */
  readonly sameDirection: boolean;
}

// ─── Threshold / Formula Configuration ──────────────────────────────

export interface DISCScaleWeights {
  readonly D: number;
  readonly I: number;
  readonly S: number;
  readonly C: number;
  readonly K: number;
  readonly SJT: number;
}

export interface DISCThresholdsConfig {
  readonly strong: {
    readonly overall: number;
    readonly D: number;
    readonly I: number;
    readonly C: number;
    readonly K: number;
    readonly SJT: number;
  };
  readonly conditional: {
    readonly overallMin: number;
    readonly overallMax: number;
  };
  readonly highRisk: {
    readonly overall: number;
    readonly SJT: number;
    readonly K: number;
    readonly C: number;
  };
}

export interface RoleProfileConfig {
  readonly label: string;
  readonly idealScores: Partial<Readonly<Record<RitchieScale, number>>>;
  readonly criticalScales: readonly RitchieScale[];
  readonly criticalMinimum: number;
}

export interface RedFlagRuleConfig {
  readonly id: string;
  readonly dimensionChecks: {
    readonly dimension: ZIMADimension;
    readonly operator: "<" | ">" | "<=" | ">=";
    readonly value: number;
  }[];
  /** How the dimension checks are combined: all must pass ("and") or any ("or") */
  readonly logic: "and" | "or";
  readonly message: string;
  readonly severity: "warning" | "critical";
}

// ─── Interpretation Structures ──────────────────────────────────────

export interface DISCProfileLabel {
  readonly key: string;
  readonly label: string;
}

export interface ScoreInterpretation {
  readonly minScore: number;
  readonly maxScore: number;
  readonly label: string;
  readonly description: string;
}

export interface RitchieScaleDescription {
  readonly scale: RitchieScale;
  readonly label: string;
  readonly highDescription: string;
  readonly lowDescription: string;
}

export interface ZIMADimensionDescription {
  readonly dimension: ZIMADimension;
  readonly label: string;
  readonly lowNote: string;
  readonly highNote: string;
}

// ─── Aggregate Block Configs ────────────────────────────────────────

export interface DISCBlockFullConfig {
  readonly items: readonly LikertItemConfig[];
  readonly sjtCases: readonly SJTCaseConfig[];
  readonly consistencyPairs: readonly ConsistencyPairConfig[];
  readonly validityItemIds: readonly string[];
  readonly scaleWeights: DISCScaleWeights;
  readonly thresholds: DISCThresholdsConfig;
}

export interface RitchieBlockFullConfig {
  readonly items: readonly LikertItemConfig[];
  readonly forcedChoiceBlocks: readonly ForcedChoiceBlockConfig[];
  readonly miniCases: readonly MiniCaseConfig[];
  readonly validityItems: readonly ValidityItemConfig[];
  readonly consistencyPairs: readonly ConsistencyPairConfig[];
  readonly roleProfiles: Readonly<Record<SalesRole, RoleProfileConfig>>;
}

export interface ZIMABlockFullConfig {
  readonly items: readonly LikertItemConfig[];
  readonly dimensions: readonly ZIMADimension[];
  readonly roleWeightMatrix: Readonly<Record<SalesRole, Readonly<Record<ZIMADimension, number>>>>;
  readonly redFlagRules: readonly RedFlagRuleConfig[];
  readonly environmentNotes: Readonly<Record<ZIMADimension, { readonly low: string; readonly high: string }>>;
}
