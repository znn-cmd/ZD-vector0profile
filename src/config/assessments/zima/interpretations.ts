// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Interpretation Config
//
//  APPROVAL STATUS: See approvalStatus.ts — dimension descriptions,
//  training/management/strength/risk/interview/retention rules are
//  inferred_from_approved_logic (approval pending).
//
//  This file contains:
//  1. Dimension descriptions (label + low/high interpretations)
//  2. Training recommendation rules
//  3. Management recommendation rules
//  4. ZIMA-specific strength rules
//  5. ZIMA-specific risk rules
//  6. ZIMA-specific interview question rules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ZIMADimensionDescription, ZIMADimension, SalesRole } from "../shared/types";

// ─── Dimension Descriptions ─────────────────────────────────────────

export const ZIMA_DIMENSION_DESCRIPTIONS: readonly ZIMADimensionDescription[] = [
  { dimension: "pace", label: "Pace", lowNote: "Prefers measured, thoughtful approach", highNote: "Thrives in fast-paced, high-urgency settings" },
  { dimension: "autonomy", label: "Autonomy", lowNote: "Prefers guidance and supervision", highNote: "Self-directed and independent" },
  { dimension: "collaboration", label: "Collaboration", lowNote: "Prefers working alone", highNote: "Energised by teamwork" },
  { dimension: "risk", label: "Risk Tolerance", lowNote: "Cautious, prefers certainty", highNote: "Comfortable with uncertainty and calculated risk" },
  { dimension: "innovation", label: "Innovation", lowNote: "Prefers proven approaches", highNote: "Seeks novel solutions and challenges status quo" },
  { dimension: "client_focus", label: "Client Focus", lowNote: "Less client-oriented", highNote: "Deeply client-centric" },
  { dimension: "process", label: "Process Adherence", lowNote: "Flexible with procedures, may skip steps", highNote: "Disciplined and systematic" },
  { dimension: "resilience", label: "Resilience", lowNote: "Sensitive to rejection and setbacks", highNote: "Bounces back quickly under pressure" },
  { dimension: "ambiguity", label: "Ambiguity Tolerance", lowNote: "Needs clear guidelines", highNote: "Comfortable building structure from scratch" },
  { dimension: "growth", label: "Growth Orientation", lowNote: "Content with current capabilities", highNote: "Actively pursues development" },
] as const;

/** Lookup a dimension description by ID */
export function getDimensionDescription(dim: ZIMADimension): ZIMADimensionDescription | undefined {
  return ZIMA_DIMENSION_DESCRIPTIONS.find((d) => d.dimension === dim);
}

// ─── Training Recommendation Rules ──────────────────────────────────
//
// Source: src/engine/scoring/zima.scorer.ts — generateTrainingRecs()
// Each rule fires when the specified dimension scores below the threshold.

export interface ZIMATrainingRule {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly maxScore: number;
  readonly primaryRoleCondition?: SalesRole;
  readonly recommendation: string;
}

export const ZIMA_TRAINING_RULES: readonly ZIMATrainingRule[] = [
  { id: "tr_process_low", dimension: "process", maxScore: 45, recommendation: "Structured CRM and pipeline management training recommended." },
  { id: "tr_client_low", dimension: "client_focus", maxScore: 50, recommendation: "Client discovery and consultative selling methodology training." },
  { id: "tr_resilience_low", dimension: "resilience", maxScore: 45, recommendation: "Resilience and mental toughness coaching — consider rejection-inoculation exercises." },
  { id: "tr_risk_hunter", dimension: "risk", maxScore: 35, primaryRoleCondition: "hunter", recommendation: "Risk calibration workshops — help build comfort with ambiguity in prospecting." },
  { id: "tr_collab_low", dimension: "collaboration", maxScore: 40, recommendation: "Team selling and cross-functional collaboration skills development." },
  { id: "tr_innovation_low", dimension: "innovation", maxScore: 35, recommendation: "Creative problem-solving workshops to expand solution-selling repertoire." },
  { id: "tr_growth_low", dimension: "growth", maxScore: 40, recommendation: "Assign a mentor and create a structured development plan with quarterly check-ins." },
] as const;

/** Default recommendation when no training gaps are identified */
export const ZIMA_NO_TRAINING_GAPS = "No critical training gaps identified — focus on advanced skill refinement.";

// ─── Management Recommendation Rules ────────────────────────────────
//
// Source: src/engine/scoring/zima.scorer.ts — generateManagementRecs()

export interface ZIMAManagementRule {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly operator: "<" | ">" | "<=" | ">=";
  readonly threshold: number;
  readonly recommendation: string;
}

export const ZIMA_MANAGEMENT_RULES: readonly ZIMAManagementRule[] = [
  { id: "mgmt_aut_high", dimension: "autonomy", operator: ">", threshold: 75, recommendation: "Provide outcome-based objectives rather than prescriptive task management." },
  { id: "mgmt_aut_low", dimension: "autonomy", operator: "<", threshold: 35, recommendation: "Provide regular check-ins and clear task-level guidance during ramp-up." },
  { id: "mgmt_pace_high", dimension: "pace", operator: ">", threshold: 75, recommendation: "Keep this person busy — idle time leads to disengagement." },
  { id: "mgmt_pace_low", dimension: "pace", operator: "<", threshold: 35, recommendation: "Avoid overloading with simultaneous urgent requests — allow focus time." },
  { id: "mgmt_collab_high", dimension: "collaboration", operator: ">", threshold: 75, recommendation: "Leverage for team initiatives, pod selling, and peer coaching." },
  { id: "mgmt_resilience_low", dimension: "resilience", operator: "<", threshold: 45, recommendation: "Monitor closely during first 90 days — provide extra coaching during rejection phases." },
  { id: "mgmt_ambiguity_low", dimension: "ambiguity", operator: "<", threshold: 35, recommendation: "Provide a detailed playbook and clear expectations from day one." },
  { id: "mgmt_growth_high", dimension: "growth", operator: ">", threshold: 75, recommendation: "Offer clear promotion pathways and stretch assignments to maintain engagement." },
] as const;

// ─── ZIMA Strength Rules ────────────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveStrengths()

export interface ZIMAStrengthRule {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly minScore: number;
  readonly text: string;
}

export const ZIMA_STRENGTH_RULES: readonly ZIMAStrengthRule[] = [
  { id: "str_resilience", dimension: "resilience", minScore: 70, text: "High resilience — can handle rejection-heavy roles without burnout." },
  { id: "str_client", dimension: "client_focus", minScore: 70, text: "Strong client orientation — prioritises client success." },
] as const;

/** Strength rule for overall fitScore */
export const ZIMA_FIT_STRENGTH_THRESHOLD = 70;
export const ZIMA_FIT_STRENGTH_TEXT = "Strong overall company-fit — well-aligned with the ZIMA environment.";

// ─── ZIMA Risk Rules ────────────────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveRisks()

export const ZIMA_FIT_RISK_THRESHOLD = 45;
export const ZIMA_FIT_RISK_TEXT_TEMPLATE = "Low company fit score ({score}/100) — significant environment mismatch.";

// ─── ZIMA Interview Question Rules ──────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveInterviewQuestions()

export interface ZIMAInterviewRule {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly maxScore: number;
  readonly question: string;
}

export const ZIMA_INTERVIEW_RULES: readonly ZIMAInterviewRule[] = [
  { id: "iq_resilience", dimension: "resilience", maxScore: 50, question: "Tell me about a period where you faced repeated rejection. How did you maintain your energy and pipeline?" },
  { id: "iq_process", dimension: "process", maxScore: 40, question: "How do you approach CRM updates, pipeline reporting, and administrative tasks? Be specific." },
  { id: "iq_ambiguity", dimension: "ambiguity", maxScore: 40, question: "How would you feel about joining a team where the sales playbook is still being written?" },
] as const;

// ─── ZIMA Retention Risk (contributed via ZIMA dimension) ───────────
//
// Source: src/engine/interpreter.ts — deriveRetentionRisks()

export interface ZIMARetentionRule {
  readonly id: string;
  readonly dimension: ZIMADimension;
  readonly operator: "<" | ">";
  readonly threshold: number;
  readonly flag: string;
}

export const ZIMA_RETENTION_RULES: readonly ZIMARetentionRule[] = [
  { id: "ret_aut_extreme", dimension: "autonomy", operator: ">", threshold: 85, flag: "Extremely autonomous — may clash with structured management and leave." },
] as const;
