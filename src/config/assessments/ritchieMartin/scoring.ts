// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Block — Scoring Configuration
//
//  Source: src/engine/config/ritchie.items.ts (validity, consistency, role profiles)
//  Source: src/engine/scoring/ritchie.scorer.ts (pipeline, role fit, band logic)
//
//  This file contains:
//  1. Validity items (5 items with expected direction + threshold)
//  2. Consistency pairs (12 pairs, including 2 cross-scale inverse pairs)
//  3. Role profiles for 4 sales roles (ideal scores, critical scales, minimums)
//  4. Role fit computation parameters
//  5. Decision band thresholds
//
//  Scoring pipeline:
//    80 Likert items → per-scale raw totals (with reverse scoring) →
//    + forced-choice adjustments (+2/-2 per block) →
//    + mini-case adjustments (variable points) →
//    clamp to [itemCount, itemCount×6] →
//    normalize to 0–100 →
//    validity + consistency checks →
//    Euclidean-distance role fit against 4 profiles →
//    critical gap detection → fit band (strong/moderate/weak)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  ValidityItemConfig,
  ConsistencyPairConfig,
  RoleProfileConfig,
  SalesRole,
  RoleFitBand,
} from "../shared/types";

// ─── Validity Items ─────────────────────────────────────────────────
//
// These are standalone items (not part of the 80-item bank) that
// detect socially desirable or random responding.
//
// Check logic (from src/engine/helpers.ts — checkRitchieValidity):
//   For "agree" direction: flag if response ≤ threshold
//   For "disagree" direction: flag if response ≥ (7 - threshold)
//   Allow 1 anomaly before marking the profile as invalid.

export const RITCHIE_VALIDITY_ITEMS: readonly ValidityItemConfig[] = [
  { id: "rm_val_v01", text: "I have never felt frustrated at work.", expectedDirection: "disagree", threshold: 2 },
  { id: "rm_val_v02", text: "I occasionally question my career choices.", expectedDirection: "agree", threshold: 2 },
  { id: "rm_val_v03", text: "I always enjoy every task assigned to me.", expectedDirection: "disagree", threshold: 2 },
  { id: "rm_val_v04", text: "I sometimes find it hard to stay motivated.", expectedDirection: "agree", threshold: 2 },
  { id: "rm_val_v05", text: "I have never disagreed with a manager.", expectedDirection: "disagree", threshold: 2 },
] as const;

// ─── Consistency Pairs (12 pairs) ───────────────────────────────────
//
// 10 within-scale pairs: items on the same scale that should correlate.
// 2 cross-scale pairs: scales expected to be inversely correlated.
//
// maxDelta: maximum acceptable absolute difference in scored values.
// sameDirection: true = should track together; false = inversely.

export const RITCHIE_CONSISTENCY_PAIRS: readonly ConsistencyPairConfig[] = [
  // Within-scale pairs
  { itemA: "rm_inc_01", itemB: "rm_inc_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_ach_01", itemB: "rm_ach_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_rec_01", itemB: "rm_rec_05", maxDelta: 3, sameDirection: true },
  { itemA: "rm_pow_01", itemB: "rm_pow_02", maxDelta: 3, sameDirection: true },
  { itemA: "rm_aut_01", itemB: "rm_aut_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_str_01", itemB: "rm_str_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_rel_01", itemB: "rm_rel_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_dri_01", itemB: "rm_dri_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_sec_01", itemB: "rm_sec_04", maxDelta: 3, sameDirection: true },
  { itemA: "rm_dev_01", itemB: "rm_dev_04", maxDelta: 3, sameDirection: true },

  // Cross-scale inverse pairs
  { itemA: "rm_aut_01", itemB: "rm_str_01", maxDelta: 2, sameDirection: false },   // Autonomy ↔ Structure
  { itemA: "rm_sec_01", itemB: "rm_dri_06", maxDelta: 2, sameDirection: false },   // Security ↔ Drive/risk
] as const;

// ─── Role Profiles ──────────────────────────────────────────────────
//
// Each profile defines:
//   - idealScores: the target normalized score (0–100) for each scale
//   - criticalScales: scales where a minimum threshold must be met
//   - criticalMinimum: the minimum score on each critical scale
//
// Fit computation (from src/engine/helpers.ts — computeProfileFit):
//   Euclidean distance between candidate's normalized scores and idealScores.
//   fitScore = ((maxDistance - distance) / maxDistance) × 100
//   where maxDistance = 100 × sqrt(numScales)
//
// Fit band thresholds:
//   fitScore ≥ 70 AND no critical gaps → "strong"
//   fitScore ≥ 55 → "moderate"
//   otherwise → "weak"

export const RITCHIE_ROLE_PROFILES: Readonly<Record<SalesRole, RoleProfileConfig>> = {
  full_cycle: {
    label: "Full-Cycle AE",
    idealScores: {
      INC: 75, ACH: 80, DRI: 80, AUT: 70, VAR: 65,
      REL: 70, REC: 60, POW: 55, DEV: 60, VAL: 65,
    },
    criticalScales: ["ACH", "DRI", "REL", "AUT"],
    criticalMinimum: 55,
  },
  hunter: {
    label: "New Business Hunter",
    idealScores: {
      INC: 85, ACH: 85, DRI: 90, POW: 70, VAR: 75,
      AUT: 80, REC: 65, REL: 50, SEC: 30, STR: 35,
    },
    criticalScales: ["DRI", "INC", "ACH", "AUT"],
    criticalMinimum: 60,
  },
  consultative: {
    label: "Consultative / Solution Seller",
    idealScores: {
      REL: 85, VAL: 80, DEV: 75, ACH: 70, STR: 60,
      AUT: 55, DRI: 65, INC: 55, POW: 50, SEC: 50,
    },
    criticalScales: ["REL", "VAL", "DEV", "ACH"],
    criticalMinimum: 55,
  },
  team_lead: {
    label: "Sales Team Lead",
    idealScores: {
      POW: 80, ACH: 80, REL: 75, REC: 70, DRI: 75,
      DEV: 70, STR: 65, VAL: 65, AUT: 60, INC: 65,
    },
    criticalScales: ["POW", "ACH", "REL", "DRI"],
    criticalMinimum: 60,
  },
} as const;

// ─── Role Fit Band Thresholds ───────────────────────────────────────

export const RITCHIE_FIT_THRESHOLDS: Readonly<Record<RoleFitBand, { minScore: number; requireNoCriticalGaps: boolean }>> = {
  strong: { minScore: 70, requireNoCriticalGaps: true },
  moderate: { minScore: 55, requireNoCriticalGaps: false },
  weak: { minScore: 0, requireNoCriticalGaps: false },
} as const;

// ─── Decision Band Thresholds (Ritchie block-level) ─────────────────
//
// These are used in the aggregator, not directly in Ritchie scoring.
// The Ritchie block doesn't produce its own overall band; instead,
// it contributes to the final aggregated band via role-fit scores.
//
// The best role-fit score from the 4 profiles is used as the Ritchie
// contribution to the final overall formula:
//   overallScore = 0.35 × DISC.overall + 0.30 × bestRitchieRoleFit + 0.35 × ZIMA.fitScore
