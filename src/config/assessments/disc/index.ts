// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — Barrel Export + Full Config Assembly
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { DISCBlockFullConfig } from "../shared/types";

export { D_ITEMS, I_ITEMS, S_ITEMS, C_ITEMS, K_ITEMS, DISC_ALL_ITEMS } from "./questions";
export { DISC_SJT_CASES } from "./sjt";
export {
  DISC_SCALE_WEIGHTS,
  DISC_THRESHOLDS,
  DISC_CONSISTENCY_PAIRS,
  DISC_VALIDITY_ITEM_IDS,
} from "./scoring";
export {
  DISC_PROFILE_LABELS,
  DISC_BAND_DESCRIPTIONS,
  DISC_SCALE_BANDS,
  DISC_STRENGTH_RULES,
  DISC_RISK_RULES,
  DISC_INTERVIEW_QUESTION_RULES,
  getProfileLabel,
} from "./interpretations";

// Re-import for assembly
import { DISC_ALL_ITEMS } from "./questions";
import { DISC_SJT_CASES } from "./sjt";
import { DISC_SCALE_WEIGHTS, DISC_THRESHOLDS, DISC_CONSISTENCY_PAIRS, DISC_VALIDITY_ITEM_IDS } from "./scoring";

/** Fully assembled DISC block config — ready for the scoring engine. */
export const DISC_FULL_CONFIG: DISCBlockFullConfig = {
  items: DISC_ALL_ITEMS,
  sjtCases: DISC_SJT_CASES,
  consistencyPairs: DISC_CONSISTENCY_PAIRS,
  validityItemIds: DISC_VALIDITY_ITEM_IDS,
  scaleWeights: DISC_SCALE_WEIGHTS,
  thresholds: DISC_THRESHOLDS,
};
