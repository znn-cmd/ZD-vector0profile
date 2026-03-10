// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — Scoring Configuration
//
//  Source: src/engine/config/disc.items.ts (CONSISTENCY_PAIRS, thresholds, weights)
//  Source: src/engine/scoring/disc.scorer.ts (threshold logic)
//
//  This file contains:
//  1. Final weighted formula: 0.20D + 0.20I + 0.15S + 0.15C + 0.10K + 0.20SJT
//  2. Consistency pair definitions (16 pairs across all 5 scales)
//  3. Validity item IDs (all K-scale items serve as lie-scale detectors)
//  4. Threshold logic for Strong shortlist / Conditional / High risk
//
//  Scoring pipeline:
//    raw answers → apply reverse scoring → per-scale totals →
//    normalize to 0–100 → validity checks (K scale + pattern detection) →
//    consistency pair checks → SJT case scoring →
//    weighted overall → threshold logic → band assignment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  DISCScaleWeights,
  DISCThresholdsConfig,
  ConsistencyPairConfig,
} from "../shared/types";
import { K_ITEMS } from "./questions";

// ─── Final Weighted Formula ─────────────────────────────────────────
//
// overall = 0.20×D + 0.20×I + 0.15×S + 0.15×C + 0.10×K + 0.20×SJT
// All scale scores are normalized to 0–100 before weighting.
// Weights sum to 1.00.

export const DISC_SCALE_WEIGHTS: DISCScaleWeights = {
  D: 0.20,
  I: 0.20,
  S: 0.15,
  C: 0.15,
  K: 0.10,
  SJT: 0.20,
} as const;

// ─── Threshold Logic ────────────────────────────────────────────────
//
// Band determination rules (evaluated in this order):
//
// 1. HIGH RISK — any of:
//      overall < 67 OR SJT < 60 OR K < 55 OR C < 50
//
// 2. STRONG SHORTLIST — all of:
//      overall ≥ 75 AND D ≥ 60 AND I ≥ 65 AND C ≥ 55 AND K ≥ 65 AND SJT ≥ 70
//
// 3. CONDITIONAL:
//      overall between 67 and 74 (inclusive) AND not high risk
//
// 4. Fallback → HIGH RISK

export const DISC_THRESHOLDS: DISCThresholdsConfig = {
  strong: {
    overall: 75,
    D: 60,
    I: 65,
    C: 55,
    K: 65,
    SJT: 70,
  },
  conditional: {
    overallMin: 67,
    overallMax: 74,
  },
  highRisk: {
    overall: 67,
    SJT: 60,
    K: 55,
    C: 50,
  },
} as const;

// ─── Consistency Pairs (16 pairs) ───────────────────────────────────
//
// Each pair identifies two items on the same scale that should track
// together after reverse scoring is applied. A violation means the
// candidate's responses are internally inconsistent.
//
// Cross-scale pairs are allowed when the two constructs are expected
// to be highly correlated (e.g., K-scale extreme claim consistency).

export const DISC_CONSISTENCY_PAIRS: readonly ConsistencyPairConfig[] = [
  // D scale: items about taking charge should be consistent
  { itemA: "disc_d_01", itemB: "disc_d_05", maxDelta: 3, sameDirection: true },
  { itemA: "disc_d_02", itemB: "disc_d_17", maxDelta: 3, sameDirection: true },
  { itemA: "disc_d_04", itemB: "disc_d_13", maxDelta: 3, sameDirection: true },
  { itemA: "disc_d_07", itemB: "disc_d_18", maxDelta: 3, sameDirection: true },

  // I scale: social and persuasion items
  { itemA: "disc_i_01", itemB: "disc_i_09", maxDelta: 3, sameDirection: true },
  { itemA: "disc_i_02", itemB: "disc_i_15", maxDelta: 3, sameDirection: true },
  { itemA: "disc_i_06", itemB: "disc_i_17", maxDelta: 3, sameDirection: true },
  { itemA: "disc_i_03", itemB: "disc_i_14", maxDelta: 3, sameDirection: true },

  // S scale: patience and persistence
  { itemA: "disc_s_01", itemB: "disc_s_14", maxDelta: 3, sameDirection: true },
  { itemA: "disc_s_02", itemB: "disc_s_08", maxDelta: 3, sameDirection: true },
  { itemA: "disc_s_05", itemB: "disc_s_18", maxDelta: 3, sameDirection: true },

  // C scale: accuracy and detail
  { itemA: "disc_c_01", itemB: "disc_c_10", maxDelta: 3, sameDirection: true },
  { itemA: "disc_c_02", itemB: "disc_c_15", maxDelta: 3, sameDirection: true },
  { itemA: "disc_c_04", itemB: "disc_c_18", maxDelta: 3, sameDirection: true },

  // K scale: extreme claim pairs (tighter tolerance because K items are intentionally extreme)
  { itemA: "disc_k_01", itemB: "disc_k_06", maxDelta: 2, sameDirection: true },
  { itemA: "disc_k_04", itemB: "disc_k_11", maxDelta: 2, sameDirection: true },
] as const;

// ─── Validity Item IDs ──────────────────────────────────────────────
//
// All K-scale items serve as validity / lie-scale detectors.
// Validity check logic (from src/engine/helpers.ts):
//   - Extreme responding: if >70% of K items score 6 (max), flag "high social desirability"
//   - If >85% extreme, flag "probable impression management"
//   - Straight-lining: if >80% of all answers are the same value
//   - Alternating pattern: if >60% of sequential answers differ by ≥4

export const DISC_VALIDITY_ITEM_IDS: readonly string[] = K_ITEMS.map((i) => i.id);
