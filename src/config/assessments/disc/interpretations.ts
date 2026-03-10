// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — Interpretation Config
//
//  Source: src/engine/scoring/disc.scorer.ts (PROFILE_LABELS, applyThresholds)
//  Source: src/engine/interpreter.ts (deriveStrengths, deriveRisks, etc.)
//
//  This file contains:
//  1. DISC profile labels (primary + secondary scale combinations)
//  2. Per-scale score interpretation bands
//  3. Band-level descriptions for Strong Shortlist / Conditional / High Risk
//  4. Strength rules (scale thresholds that trigger positive observations)
//  5. Risk rules (scale thresholds that trigger negative observations)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DISCProfileLabel, DISCBand, ScoreInterpretation } from "../shared/types";

// ─── Profile Labels ─────────────────────────────────────────────────
//
// Determined by the candidate's primary + secondary DISC scales
// (excluding K). 12 combinations + 1 fallback template.

export const DISC_PROFILE_LABELS: readonly DISCProfileLabel[] = [
  { key: "DI", label: "Dominant Influencer — Drives deals through assertive persuasion" },
  { key: "DC", label: "Analytical Driver — Data-driven with decisive execution" },
  { key: "DS", label: "Determined Achiever — Persistent results focus with patience" },
  { key: "ID", label: "Inspiring Leader — Builds momentum through enthusiasm and vision" },
  { key: "IS", label: "Supportive Communicator — Persuades through relationships and trust" },
  { key: "IC", label: "Creative Strategist — Combines people skills with analytical thinking" },
  { key: "SD", label: "Steady Implementer — Reliable execution with occasional assertiveness" },
  { key: "SI", label: "Loyal Relationship Builder — Patient, people-oriented, consistent" },
  { key: "SC", label: "Methodical Supporter — Steady, detail-oriented, reliable" },
  { key: "CD", label: "Systematic Controller — Analytical first, decisive when data supports" },
  { key: "CI", label: "Quality Communicator — Precise communication with social awareness" },
  { key: "CS", label: "Meticulous Planner — Detail-focused with patient execution" },
] as const;

/** Lookup profile label by primary+secondary key, with fallback */
export function getProfileLabel(primary: string, secondary: string): string {
  const key = `${primary}${secondary}`;
  const found = DISC_PROFILE_LABELS.find((p) => p.key === key);
  return found?.label ?? `${primary}-${secondary} Profile`;
}

// ─── Per-Scale Score Bands ──────────────────────────────────────────

export const DISC_SCALE_BANDS: readonly ScoreInterpretation[] = [
  { minScore: 0, maxScore: 29, label: "Very Low", description: "Minimal expression of this trait — significant development area." },
  { minScore: 30, maxScore: 44, label: "Low", description: "Below average expression — targeted development recommended." },
  { minScore: 45, maxScore: 59, label: "Moderate", description: "Average expression — functional but not a differentiator." },
  { minScore: 60, maxScore: 74, label: "High", description: "Above average — this trait is a reliable strength." },
  { minScore: 75, maxScore: 100, label: "Very High", description: "Exceptional expression — a defining characteristic." },
] as const;

// ─── Band-Level Descriptions ────────────────────────────────────────

export const DISC_BAND_DESCRIPTIONS: Readonly<Record<DISCBand, string>> = {
  strong_shortlist:
    "Candidate meets or exceeds all DISC thresholds. Profile indicates strong sales potential " +
    "with balanced behavioral competencies and sound situational judgment.",
  conditional:
    "Candidate falls within the conditional range. Some scale scores are below the strong shortlist " +
    "thresholds but overall profile does not indicate high risk. Targeted interview probes recommended " +
    "for identified gap areas.",
  high_risk:
    "Candidate falls below critical thresholds on one or more key indicators. Specific risk factors " +
    "identified — proceed with caution or consider alternative roles.",
} as const;

// ─── Strength Rules ─────────────────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveStrengths()

export interface DISCStrengthRule {
  readonly id: string;
  readonly scale: "D" | "I" | "S" | "C" | "SJT";
  readonly minScore: number;
  readonly text: string;
}

export const DISC_STRENGTH_RULES: readonly DISCStrengthRule[] = [
  { id: "str_d_high", scale: "D", minScore: 70, text: "Strong assertiveness and results orientation — natural closer." },
  { id: "str_i_high", scale: "I", minScore: 70, text: "High influence and persuasion skills — builds rapport easily." },
  { id: "str_s_high", scale: "S", minScore: 70, text: "Exceptional patience and follow-through — excels at long sales cycles." },
  { id: "str_c_high", scale: "C", minScore: 70, text: "Detail-oriented and analytical — produces accurate, compelling proposals." },
  { id: "str_sjt_high", scale: "SJT", minScore: 75, text: "Strong situational judgment — makes sound decisions in complex sales scenarios." },
] as const;

// ─── Risk Rules ─────────────────────────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveRisks()

export interface DISCRiskRule {
  readonly id: string;
  readonly condition: string;
  readonly text: string;
}

export const DISC_RISK_RULES: readonly DISCRiskRule[] = [
  { id: "risk_overall_low", condition: "overall < highRisk.overall", text: "Overall score below minimum — insufficient behavioral profile for sales." },
  { id: "risk_sjt_low", condition: "SJT < highRisk.SJT", text: "SJT score below minimum — poor judgment in sales scenarios." },
  { id: "risk_k_low", condition: "K < highRisk.K", text: "K-scale below threshold — potential integrity or social desirability concerns." },
  { id: "risk_c_low", condition: "C < highRisk.C", text: "Compliance below threshold — risk of process non-adherence." },
  { id: "risk_di_low", condition: "D < 40 AND I < 40", text: "Low D and I — may lack assertiveness and influence for sales roles." },
  { id: "risk_validity", condition: "validity.isValid === false", text: "Validity concerns detected in response patterns." },
  { id: "risk_consistency", condition: "consistency.score < 60", text: "Inconsistent response patterns across paired items." },
] as const;

// ─── Interview Focus Question Rules ─────────────────────────────────
//
// Source: src/engine/interpreter.ts — deriveInterviewQuestions()

export interface DISCInterviewQuestionRule {
  readonly id: string;
  readonly scale: "D" | "I" | "S" | "C" | "SJT";
  readonly maxScore: number;
  readonly question: string;
}

export const DISC_INTERVIEW_QUESTION_RULES: readonly DISCInterviewQuestionRule[] = [
  { id: "iq_d_low", scale: "D", maxScore: 50, question: "Tell me about a time you had to push back on a client or internal stakeholder. What happened?" },
  { id: "iq_i_low", scale: "I", maxScore: 50, question: "Describe how you build rapport with a sceptical prospect. Walk me through a specific example." },
  { id: "iq_sjt_low", scale: "SJT", maxScore: 65, question: "A key deal is at risk because the champion left the company. Walk me through your exact next steps." },
  { id: "iq_c_low", scale: "C", maxScore: 50, question: "How do you ensure accuracy in proposals and pricing? Give a specific example of catching an error." },
] as const;
