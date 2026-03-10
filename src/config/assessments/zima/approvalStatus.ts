// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Content Approval Status by Section
//
//  Each section of the ZIMA config is marked as:
//  - approved: formally approved by product / content owner
//  - inferred_from_approved_logic: derived from approved engine/product logic
//  - placeholder_pending_approval: placeholder; final wording/structure TBD
//
//  Do NOT treat placeholder or inferred content as approved without sign-off.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ContentApprovalStatus } from "./schema";

export const ZIMA_APPROVAL_STATUS: Readonly<Record<string, ContentApprovalStatus>> = {
  // ─── Question bank (50 items, 10 dimensions × 5) ─────────────────
  questions_structure: "approved",
  questions_pace: "inferred_from_approved_logic",
  questions_autonomy: "inferred_from_approved_logic",
  questions_collaboration: "inferred_from_approved_logic",
  questions_risk: "inferred_from_approved_logic",
  questions_innovation: "inferred_from_approved_logic",
  questions_client_focus: "inferred_from_approved_logic",
  questions_process: "inferred_from_approved_logic",
  questions_resilience: "inferred_from_approved_logic",
  questions_ambiguity: "inferred_from_approved_logic",
  questions_growth: "inferred_from_approved_logic",

  // ─── Role weight matrix (4 frontline roles) ───────────────────────
  role_weight_matrix: "inferred_from_approved_logic",
  role_support_only_weights: "placeholder_pending_approval",

  // ─── Red flag rules ──────────────────────────────────────────────
  red_flag_rules: "inferred_from_approved_logic",

  // ─── Environment notes (low/high per dimension) ──────────────────
  environment_notes: "inferred_from_approved_logic",

  // ─── Training recommendation rules ───────────────────────────────
  training_rules: "inferred_from_approved_logic",

  // ─── Management recommendation rules ────────────────────────────
  management_rules: "inferred_from_approved_logic",

  // ─── Dimension descriptions (interpretation layer) ─────────────────
  dimension_descriptions: "inferred_from_approved_logic",

  // ─── Strength / risk / interview / retention rules ───────────────
  strength_rules: "inferred_from_approved_logic",
  risk_rules: "inferred_from_approved_logic",
  interview_rules: "inferred_from_approved_logic",
  retention_rules: "inferred_from_approved_logic",
} as const;

/** Sections that are still placeholder (pending final approval). */
export const ZIMA_PLACEHOLDER_SECTIONS = (
  Object.entries(ZIMA_APPROVAL_STATUS) as [string, ContentApprovalStatus][]
).filter(([, status]) => status === "placeholder_pending_approval").map(([key]) => key);
