// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Scoring Configuration
//
//  APPROVAL STATUS: See approvalStatus.ts — role weights, red flags, and
//  environment notes are inferred_from_approved_logic (approval pending).
//  Optional 5th role (support_only): placeholders.ts.
//
//  This file contains:
//  1. Role weight matrix (10 dimensions × 4 frontline roles, weights sum to ~1.0 per role)
//  2. Red flag rules (7 rules, declarative conditions instead of closures)
//  3. Environment notes (low/high notes per dimension)
//  4. Environment note thresholds
//
//  Scoring pipeline:
//    50 Likert items → per-dimension scores (with reverse scoring) →
//    normalize to 0–100 →
//    weighted role-fit scores for 4 roles →
//    primary + secondary role selection →
//    fitScore = average of top 2 role-fit scores →
//    red flag evaluation →
//    environment note generation (score ≤ 35 → low note, ≥ 70 → high note) →
//    training + management recommendations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  ZIMADimension,
  SalesRole,
  RedFlagRuleConfig,
} from "../shared/types";

// ─── Role Weight Matrix ─────────────────────────────────────────────
//
// Each role has 10 dimension weights that sum to approximately 1.0.
// A candidate's ZIMA role-fit score for a role is computed as:
//   Σ (dimensionScore × weight) for all 10 dimensions
//
// The matrix encodes which dimensions matter most for each sales role.

export const ZIMA_ROLE_WEIGHT_MATRIX: Readonly<Record<SalesRole, Readonly<Record<ZIMADimension, number>>>> = {
  hunter: {
    pace: 0.15,
    autonomy: 0.15,
    collaboration: 0.05,
    risk: 0.15,
    innovation: 0.10,
    client_focus: 0.10,
    process: 0.03,
    resilience: 0.15,
    ambiguity: 0.07,
    growth: 0.05,
  },
  full_cycle: {
    pace: 0.10,
    autonomy: 0.10,
    collaboration: 0.10,
    risk: 0.10,
    innovation: 0.08,
    client_focus: 0.15,
    process: 0.10,
    resilience: 0.12,
    ambiguity: 0.07,
    growth: 0.08,
  },
  consultative: {
    pace: 0.05,
    autonomy: 0.07,
    collaboration: 0.12,
    risk: 0.05,
    innovation: 0.10,
    client_focus: 0.20,
    process: 0.12,
    resilience: 0.08,
    ambiguity: 0.06,
    growth: 0.15,
  },
  team_lead: {
    pace: 0.10,
    autonomy: 0.08,
    collaboration: 0.15,
    risk: 0.10,
    innovation: 0.08,
    client_focus: 0.10,
    process: 0.10,
    resilience: 0.12,
    ambiguity: 0.10,
    growth: 0.07,
  },
} as const;

// ─── Red Flag Rules (7 rules) ──────────────────────────────────────
//
// Declarative rule definitions. The scoring engine evaluates dimensionChecks
// using the specified logic ("and" = all must pass, "or" = any must pass).
//
// These replace the closure-based rules from src/engine/config/zima.items.ts
// to keep config serializable and auditable.

export const ZIMA_RED_FLAG_RULES: readonly RedFlagRuleConfig[] = [
  {
    id: "rf_low_resilience",
    dimensionChecks: [{ dimension: "resilience", operator: "<", value: 35 }],
    logic: "and",
    message: "Very low resilience — high risk of disengagement after early rejection cycles.",
    severity: "critical",
  },
  {
    id: "rf_low_client_focus",
    dimensionChecks: [{ dimension: "client_focus", operator: "<", value: 30 }],
    logic: "and",
    message: "Critically low client orientation — unlikely to succeed in any client-facing sales role.",
    severity: "critical",
  },
  {
    id: "rf_low_process_high_risk",
    dimensionChecks: [
      { dimension: "process", operator: "<", value: 30 },
      { dimension: "risk", operator: ">", value: 75 },
    ],
    logic: "and",
    message: "High risk-taking combined with low process adherence — potential compliance issues.",
    severity: "critical",
  },
  {
    id: "rf_extreme_autonomy",
    dimensionChecks: [
      { dimension: "autonomy", operator: ">", value: 90 },
      { dimension: "collaboration", operator: "<", value: 25 },
    ],
    logic: "and",
    message: "Extreme autonomy with very low collaboration — may resist team norms and coaching.",
    severity: "warning",
  },
  {
    id: "rf_low_growth",
    dimensionChecks: [{ dimension: "growth", operator: "<", value: 30 }],
    logic: "and",
    message: "Low growth orientation — risk of skill stagnation and long-term underperformance.",
    severity: "warning",
  },
  {
    id: "rf_pace_mismatch",
    dimensionChecks: [
      { dimension: "pace", operator: "<", value: 30 },
      { dimension: "ambiguity", operator: "<", value: 30 },
    ],
    logic: "and",
    message: "Prefers slow, highly structured environments — poor fit for dynamic sales orgs.",
    severity: "warning",
  },
  {
    id: "rf_innovation_process_conflict",
    dimensionChecks: [
      { dimension: "innovation", operator: ">", value: 80 },
      { dimension: "process", operator: ">", value: 80 },
    ],
    logic: "and",
    message: "Unusually high on both innovation and process — verify response consistency.",
    severity: "warning",
  },
] as const;

// ─── Environment Notes ──────────────────────────────────────────────
//
// Generated for each dimension where the candidate scores ≤ 35 or ≥ 70.
// These provide actionable management context for HR.

export const ZIMA_ENVIRONMENT_NOTES: Readonly<Record<ZIMADimension, { readonly low: string; readonly high: string }>> = {
  pace: {
    low: "Prefers a measured, thoughtful work rhythm — may struggle in hyper-fast startup cultures.",
    high: "Thrives in rapid-fire environments — may find methodical organisations frustrating.",
  },
  autonomy: {
    low: "Works best with clear guidance and regular check-ins — needs structured onboarding.",
    high: "Self-directed and proactive — may resist micromanagement or rigid reporting.",
  },
  collaboration: {
    low: "Prefers independent work — assign individual territories or solo accounts.",
    high: "Energised by team dynamics — best in pod-based or collaborative selling models.",
  },
  risk: {
    low: "Risk-averse — assign established accounts, not greenfield territories.",
    high: "Risk-tolerant — give stretch targets and new market opportunities.",
  },
  innovation: {
    low: "Relies on proven playbooks — excellent at scaling existing processes.",
    high: "Creative problem-solver — best in roles requiring novel approaches.",
  },
  client_focus: {
    low: "Less client-oriented — better suited for internal or operational roles.",
    high: "Deeply client-centric — ensure account load allows relationship depth.",
  },
  process: {
    low: "May under-report or skip CRM updates — needs accountability structures.",
    high: "Disciplined with processes — ideal for compliance-heavy environments.",
  },
  resilience: {
    low: "Needs supportive management during slumps — monitor for burnout.",
    high: "Bounces back quickly — can handle high-rejection roles like cold outbound.",
  },
  ambiguity: {
    low: "Needs clear role definition and expectations — avoid early-stage startups.",
    high: "Comfortable building from scratch — ideal for new market entry.",
  },
  growth: {
    low: "May plateau without external push — provide structured development plans.",
    high: "Highly growth-oriented — offer mentorship and advancement paths to retain.",
  },
} as const;

// Environment note thresholds
export const ZIMA_ENV_NOTE_LOW_THRESHOLD = 35;
export const ZIMA_ENV_NOTE_HIGH_THRESHOLD = 70;
