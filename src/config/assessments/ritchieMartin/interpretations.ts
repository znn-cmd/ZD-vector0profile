// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Block — Interpretation Config
//
//  Source: src/engine/interpreter.ts (deriveStrengths, deriveRisks, etc.)
//  Source: src/engine/scoring/ritchie.scorer.ts (role fit logic)
//
//  This file contains:
//  1. Scale descriptions (per RitchieScale — high/low interpretations)
//  2. Role labels for the 4 sales role profiles
//  3. Strength rules triggered by high motivational scores
//  4. Risk rules triggered by low or problematic score patterns
//  5. Interview question rules triggered by specific scale patterns
//  6. Retention risk flag rules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { RitchieScaleDescription, RitchieScale, SalesRole } from "../shared/types";

// ─── Scale Descriptions ─────────────────────────────────────────────

export const RITCHIE_SCALE_DESCRIPTIONS: readonly RitchieScaleDescription[] = [
  { scale: "INC", label: "Incentive / Money", highDescription: "Strongly financially motivated — commission structures will drive performance.", lowDescription: "Money is not a primary motivator — may be driven by purpose, autonomy, or recognition instead." },
  { scale: "REC", label: "Recognition", highDescription: "Thrives on recognition — responds well to visible rewards and leaderboards.", lowDescription: "Does not need public recognition — internally motivated." },
  { scale: "ACH", label: "Achievement", highDescription: "High achievement drive — self-motivated to exceed targets.", lowDescription: "Low achievement orientation — may not push beyond minimum requirements." },
  { scale: "POW", label: "Power / Influence", highDescription: "Natural leadership instincts — can influence deals and teams.", lowDescription: "Prefers to follow rather than lead — comfortable as an individual contributor." },
  { scale: "VAR", label: "Variety / Change", highDescription: "Embraces variety — adapts well to changing markets and products.", lowDescription: "Prefers stability and routine — may struggle with frequent changes." },
  { scale: "AUT", label: "Autonomy", highDescription: "Self-directed — requires minimal supervision to produce results.", lowDescription: "Prefers guidance and structure — needs clear direction." },
  { scale: "STR", label: "Structure", highDescription: "Values structure — thrives with clear processes and methodologies.", lowDescription: "Dislikes rigid structure — prefers flexibility and improvisation." },
  { scale: "REL", label: "Relationships", highDescription: "Relationship builder — creates deep client loyalty and retention.", lowDescription: "Task-focused over relationship-focused — may struggle with long-term client bonding." },
  { scale: "VAL", label: "Values Alignment", highDescription: "Values-driven — authentic in client interactions, builds trust.", lowDescription: "Less concerned with values fit — primarily outcome-focused." },
  { scale: "DEV", label: "Development / Growth", highDescription: "Growth-oriented — continuously improves skills and knowledge.", lowDescription: "Content with current skill level — may plateau without external push." },
  { scale: "SEC", label: "Security", highDescription: "Values stability — reliable, consistent performer.", lowDescription: "Comfortable with uncertainty — entrepreneurial mindset." },
  { scale: "DRI", label: "Drive / Energy", highDescription: "High-energy and driven — brings intensity to every interaction.", lowDescription: "Lower energy or more measured pace — may struggle in high-intensity roles." },
] as const;

/** Lookup a scale description by scale ID */
export function getScaleDescription(scale: RitchieScale): RitchieScaleDescription | undefined {
  return RITCHIE_SCALE_DESCRIPTIONS.find((d) => d.scale === scale);
}

// ─── Role Labels ────────────────────────────────────────────────────

export const RITCHIE_ROLE_LABELS: Readonly<Record<SalesRole, string>> = {
  full_cycle: "Universal Broker / Full-Cycle Sales Manager",
  hunter: "New Business Hunter",
  consultative: "Consultative Broker / Solution Seller",
  team_lead: "Senior Broker / Sales Team Lead",
} as const;

// ─── Strength Rules ─────────────────────────────────────────────────
//
// Triggered when a motivator is in the top 2 AND normalized score ≥ 65.
// Source: src/engine/interpreter.ts — deriveStrengths()

export interface RitchieStrengthRule {
  readonly scale: RitchieScale;
  readonly minScore: number;
  readonly text: string;
}

export const RITCHIE_STRENGTH_RULES: readonly RitchieStrengthRule[] = [
  { scale: "INC", minScore: 65, text: "Strongly financially motivated — commission structures will drive performance." },
  { scale: "REC", minScore: 65, text: "Thrives on recognition — responds well to visible rewards and leaderboards." },
  { scale: "ACH", minScore: 65, text: "High achievement drive — self-motivated to exceed targets." },
  { scale: "POW", minScore: 65, text: "Natural leadership instincts — can influence deals and teams." },
  { scale: "VAR", minScore: 65, text: "Embraces variety — adapts well to changing markets and products." },
  { scale: "AUT", minScore: 65, text: "Self-directed — requires minimal supervision to produce results." },
  { scale: "STR", minScore: 65, text: "Values structure — thrives with clear processes and methodologies." },
  { scale: "REL", minScore: 65, text: "Relationship builder — creates deep client loyalty and retention." },
  { scale: "VAL", minScore: 65, text: "Values-driven — authentic in client interactions, builds trust." },
  { scale: "DEV", minScore: 65, text: "Growth-oriented — continuously improves skills and knowledge." },
  { scale: "SEC", minScore: 65, text: "Values stability — reliable, consistent performer." },
  { scale: "DRI", minScore: 65, text: "High-energy and driven — brings intensity to every interaction." },
] as const;

// ─── Risk Rules ─────────────────────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveRisks()

export interface RitchieRiskRule {
  readonly id: string;
  readonly condition: string;
  readonly text: string;
}

export const RITCHIE_RISK_RULES: readonly RitchieRiskRule[] = [
  { id: "risk_validity", condition: "validity.isValid === false", text: "Ritchie-Martin validity concerns detected." },
  { id: "risk_low_dri", condition: "DRI in bottomMotivators AND DRI.normalized < 35", text: "Very low drive/energy — risk of underperformance and disengagement." },
  { id: "risk_low_ach", condition: "ACH in bottomMotivators AND ACH.normalized < 35", text: "Low achievement motivation — may not push beyond minimum requirements." },
] as const;

// ─── Interview Question Rules ───────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveInterviewQuestions()

export interface RitchieInterviewRule {
  readonly id: string;
  readonly condition: string;
  readonly question: string;
}

export const RITCHIE_INTERVIEW_RULES: readonly RitchieInterviewRule[] = [
  { id: "iq_sec_dri_gap", condition: "SEC.normalized > 70 AND DRI.normalized < 50", question: "How do you maintain motivation when targets feel like a stretch? What drives you beyond the safety of your base?" },
  { id: "iq_aut_rel_gap", condition: "AUT.normalized > 80 AND REL.normalized < 40", question: "How do you handle situations where you must collaborate closely with a team to close a deal?" },
  { id: "iq_pow_high", condition: "POW.normalized > 75", question: "Describe a situation where you had to follow someone else's strategy even though you disagreed. How did you handle it?" },
] as const;

// ─── Management Recommendation Rules ────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveManagementRecs()

export interface RitchieManagementRule {
  readonly id: string;
  readonly condition: string;
  readonly recommendation: string;
}

export const RITCHIE_MANAGEMENT_RULES: readonly RitchieManagementRule[] = [
  { id: "mgmt_inc_high", condition: "INC.normalized > 70", recommendation: "Ensure compensation plan is transparent and that top-end earnings are visible." },
  { id: "mgmt_rec_high", condition: "REC.normalized > 70", recommendation: "Implement regular public recognition — leaderboards, team shout-outs, awards." },
  { id: "mgmt_dev_high", condition: "DEV.normalized > 70", recommendation: "Provide a clear career path and ongoing learning opportunities." },
  { id: "mgmt_aut_high", condition: "AUT.normalized > 75", recommendation: "Minimise micromanagement — set outcomes, not methods." },
  { id: "mgmt_str_high", condition: "STR.normalized > 70", recommendation: "Provide detailed playbooks, clear KPIs, and structured 1:1 cadence." },
] as const;

// ─── Retention Risk Flag Rules ──────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveRetentionRisks()

export interface RitchieRetentionRule {
  readonly id: string;
  readonly condition: string;
  readonly flag: string;
}

export const RITCHIE_RETENTION_RULES: readonly RitchieRetentionRule[] = [
  { id: "ret_inc_val", condition: "INC.normalized > 80 AND VAL.normalized < 40", flag: "Purely financially motivated with low values alignment — will leave for a higher offer." },
  { id: "ret_var_high", condition: "VAR.normalized > 80", flag: "High variety-seeking — risk of boredom and turnover if role becomes routine." },
  { id: "ret_sec_dri", condition: "SEC.normalized < 25 AND DRI.normalized > 80", flag: "High drive with very low security need — likely to pursue entrepreneurial opportunities." },
  { id: "ret_dev_pow", condition: "DEV.normalized > 80 AND POW.normalized > 70", flag: "Ambitious and growth-oriented — will leave if promotion path is blocked." },
  { id: "ret_rel_high", condition: "REL.normalized > 80", flag: "Deeply relationship-driven — risk of following a departing manager to a new company." },
] as const;
