// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Assessment Engine Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Top-level entry ──────────────────────────────────────────────────
export { computeFinalProfile, type AggregatorInput } from "./aggregator";

// ── Individual block scorers (for standalone use) ────────────────────
export { scoreDISCBlock } from "./scoring/disc.scorer";
export { scoreRitchieBlock } from "./scoring/ritchie.scorer";
export { scoreZIMABlock } from "./scoring/zima.scorer";

// ── Block configurations ─────────────────────────────────────────────
export { DISC_CONFIG } from "./config/disc.items";
export { RITCHIE_CONFIG } from "./config/ritchie.items";
export { ZIMA_CONFIG } from "./config/zima.items";

// ── Helpers (for custom scoring pipelines or testing) ────────────────
export {
  reverseScore,
  applyItemScoring,
  normalize,
  normalizeLikertScale,
  computeScaleScore,
  scoreSJTCase,
  computeSJTScore,
  weightedSum,
  checkConsistency,
  checkValidity,
  checkRitchieValidity,
  computeProfileFit,
  toBand,
  topScales,
  bottomScales,
  groupByScale,
  clamp,
  roundTo,
} from "./helpers";

// ── Interpreter (for custom reporting) ───────────────────────────────
export {
  deriveStrengths,
  deriveRisks,
  deriveInterviewQuestions,
  deriveManagementRecs,
  deriveRetentionRisks,
} from "./interpreter";

// ── Types ────────────────────────────────────────────────────────────
export type * from "./types";
