// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Block — Barrel Export + Full Config Assembly
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { RitchieBlockFullConfig } from "../shared/types";

export {
  INC_ITEMS, REC_ITEMS, ACH_ITEMS, POW_ITEMS, VAR_ITEMS, AUT_ITEMS,
  STR_ITEMS, REL_ITEMS, VAL_ITEMS, DEV_ITEMS, SEC_ITEMS, DRI_ITEMS,
  RITCHIE_ALL_ITEMS, RITCHIE_SCALE_IDS,
} from "./questions";
export { RITCHIE_FORCED_CHOICE_BLOCKS } from "./forcedChoice";
export { RITCHIE_MINI_CASES } from "./cases";
export {
  RITCHIE_VALIDITY_ITEMS,
  RITCHIE_CONSISTENCY_PAIRS,
  RITCHIE_ROLE_PROFILES,
  RITCHIE_FIT_THRESHOLDS,
} from "./scoring";
export {
  RITCHIE_SCALE_DESCRIPTIONS,
  RITCHIE_ROLE_LABELS,
  RITCHIE_STRENGTH_RULES,
  RITCHIE_RISK_RULES,
  RITCHIE_INTERVIEW_RULES,
  RITCHIE_MANAGEMENT_RULES,
  RITCHIE_RETENTION_RULES,
  getScaleDescription,
} from "./interpretations";

// Re-import for assembly
import { RITCHIE_ALL_ITEMS } from "./questions";
import { RITCHIE_FORCED_CHOICE_BLOCKS } from "./forcedChoice";
import { RITCHIE_MINI_CASES } from "./cases";
import { RITCHIE_VALIDITY_ITEMS, RITCHIE_CONSISTENCY_PAIRS, RITCHIE_ROLE_PROFILES } from "./scoring";

/** Fully assembled Ritchie–Martin block config — ready for the scoring engine. */
export const RITCHIE_FULL_CONFIG: RitchieBlockFullConfig = {
  items: RITCHIE_ALL_ITEMS,
  forcedChoiceBlocks: RITCHIE_FORCED_CHOICE_BLOCKS,
  miniCases: RITCHIE_MINI_CASES,
  validityItems: RITCHIE_VALIDITY_ITEMS,
  consistencyPairs: RITCHIE_CONSISTENCY_PAIRS,
  roleProfiles: RITCHIE_ROLE_PROFILES,
};
