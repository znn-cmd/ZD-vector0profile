// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Production Schema & Approval Status
//
//  This file defines the complete config structure for the ZIMA block and
//  marks which parts are approved, inferred from product logic, or
//  placeholder pending final approval. Do NOT treat placeholder content
//  as approved.
//
//  Compatible with: engine ZIMABlockConfig, scoring pipeline, report generation.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ZIMADimension, SalesRole } from "../shared/types";

// ─── Approval Status ─────────────────────────────────────────────────
//
// Every content section in the ZIMA block should be tagged with one of:

/** Status of content relative to formal approval. */
export type ContentApprovalStatus =
  | "approved"                    // Formally approved by product / content owner
  | "inferred_from_approved_logic" // Derived from approved product/engine logic; not yet copy-approved
  | "placeholder_pending_approval"; // Placeholder; final wording or structure TBD

export const CONTENT_APPROVAL_STATUS_LABELS: Record<ContentApprovalStatus, string> = {
  approved: "Approved",
  inferred_from_approved_logic: "Inferred from approved product logic",
  placeholder_pending_approval: "Placeholder — pending final approval",
};

// ─── Extended Role Set (ZIMA-specific) ───────────────────────────────
//
// The engine uses SalesRole = full_cycle | hunter | consultative | team_lead
// for primary/secondary resolution. ZIMA config additionally supports:

/** Optional 5th role: used when frontline sales fit is low; recommend support-only. */
export const ZIMA_SUPPORT_ROLE_ID = "support_only" as const;

/** All ZIMA target roles, including support when relevant. */
export type ZIMARoleId = SalesRole | typeof ZIMA_SUPPORT_ROLE_ID;

/** Role labels for reporting (aligned with product naming). */
export const ZIMA_ROLE_LABELS: Record<ZIMARoleId, string> = {
  hunter: "Hunter / active closer",
  full_cycle: "Full-cycle broker / universal sales manager",
  consultative: "Consultative broker / premium or long-cycle consultant",
  team_lead: "Senior broker / team lead potential",
  support_only: "Low-frontline-fit / support only when relevant",
};

// ─── Weighted Role-Fit Questions ─────────────────────────────────────
//
// Each item belongs to one dimension. Dimensions are weighted per role
// via the role weight matrix. No per-question weight override in base schema;
// weight is by dimension.

export interface ZIMAQuestionItemSchema {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly reversed: boolean;
  /** Final question text. Use placeholder if not yet approved. */
  readonly text: string;
  /** Approval status of this item's text. */
  readonly approvalStatus?: ContentApprovalStatus;
}

// ─── Role Mapping (Dimension Weights) ───────────────────────────────
//
// roleWeightMatrix[role][dimension] = weight (sum to ~1.0 per role).
// support_only row optional; used for "low frontline fit" recommendation.

export type ZIMARoleWeightMatrix = Readonly<
  Record<SalesRole, Readonly<Record<ZIMADimension, number>>>
> & {
  /** Optional: weights for support-only recommendation when frontline fits are low. */
  support_only?: Readonly<Record<ZIMADimension, number>>;
};

// ─── Red Flags ───────────────────────────────────────────────────────
//
// Declarative rules: dimensionChecks + logic (and/or) + message + severity.
// Engine converts these to condition(s) when building ZIMABlockConfig.

export interface ZIMARedFlagRuleSchema {
  readonly id: string;
  readonly dimensionChecks: readonly {
    dimension: ZIMADimension;
    operator: "<" | ">" | "<=" | ">=";
    value: number;
  }[];
  readonly logic: "and" | "or";
  readonly message: string;
  readonly severity: "warning" | "critical";
  readonly approvalStatus?: ContentApprovalStatus;
}

// ─── Management Recommendations ──────────────────────────────────────
//
// Fired when dimension score meets operator + threshold.
// Used by scoring/reporting to generate management recs.

export interface ZIMAManagementRuleSchema {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly operator: "<" | ">" | "<=" | ">=";
  readonly threshold: number;
  readonly recommendation: string;
  readonly approvalStatus?: ContentApprovalStatus;
}

// ─── Environment Fit (Notes per Dimension) ───────────────────────────
//
// Low note when score ≤ lowThreshold; high note when score ≥ highThreshold.
// Shown in report and used for environment-fit narrative.

export interface ZIMAEnvironmentNoteSchema {
  readonly dimension: ZIMADimension;
  readonly low: string;
  readonly high: string;
  readonly approvalStatus?: ContentApprovalStatus;
}

// ─── Primary / Secondary Role Resolution ─────────────────────────────
//
// 1. Compute role-fit score per role = Σ (dimensionScore × weight) for each role.
// 2. Sort roles by score descending.
// 3. primaryRole = first; secondaryRole = second.
// 4. fitScore = (primaryScore + secondaryScore) / 2 (or weighted average).
// 5. If support_only is used: when max(frontline role scores) < lowFrontlineThreshold,
//    report "Low frontline fit — consider support only" (interpretation layer).

export const ZIMA_LOW_FRONTLINE_FIT_THRESHOLD = 40;

/** Roles used for primary/secondary resolution in the engine (4 frontline). */
export const ZIMA_FRONTLINE_ROLES: readonly SalesRole[] = [
  "full_cycle",
  "hunter",
  "consultative",
  "team_lead",
];

// ─── Training Recommendations ───────────────────────────────────────
//
// Rules keyed by dimension (and optional role condition). When dimension
// score below threshold (and optional primaryRole match), add recommendation.

export interface ZIMATrainingRuleSchema {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly maxScore: number;
  readonly primaryRoleCondition?: SalesRole;
  readonly recommendation: string;
  readonly approvalStatus?: ContentApprovalStatus;
}

// ─── Full Block Config Schema ────────────────────────────────────────
//
// This is the production-ready shape. Implementations may use partial
// content with placeholders where approval is pending.

export interface ZIMABlockConfigSchema {
  readonly items: readonly ZIMAQuestionItemSchema[];
  readonly dimensions: readonly ZIMADimension[];
  readonly roleWeightMatrix: ZIMARoleWeightMatrix;
  readonly redFlagRules: readonly ZIMARedFlagRuleSchema[];
  readonly environmentNotes: Readonly<Record<ZIMADimension, { readonly low: string; readonly high: string }>>;
  readonly envNoteLowThreshold: number;
  readonly envNoteHighThreshold: number;
  readonly trainingRules?: readonly ZIMATrainingRuleSchema[];
  readonly managementRules?: readonly ZIMAManagementRuleSchema[];
  readonly lowFrontlineFitThreshold?: number;
}
