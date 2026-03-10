// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Barrel Export + Full Config Assembly
//
//  Schema, approval status, and placeholders: see schema.ts, approvalStatus.ts,
//  placeholders.ts, APPROVALS_REQUIRED.md. Do not treat placeholder content as final.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ZIMABlockFullConfig } from "../shared/types";

export {
  type ContentApprovalStatus,
  type ZIMARoleId,
  type ZIMAQuestionItemSchema,
  type ZIMARoleWeightMatrix,
  type ZIMARedFlagRuleSchema,
  type ZIMAManagementRuleSchema,
  type ZIMAEnvironmentNoteSchema,
  type ZIMATrainingRuleSchema,
  type ZIMABlockConfigSchema,
  CONTENT_APPROVAL_STATUS_LABELS,
  ZIMA_ROLE_LABELS,
  ZIMA_SUPPORT_ROLE_ID,
  ZIMA_LOW_FRONTLINE_FIT_THRESHOLD,
  ZIMA_FRONTLINE_ROLES,
} from "./schema";
export { ZIMA_APPROVAL_STATUS, ZIMA_PLACEHOLDER_SECTIONS } from "./approvalStatus";
export {
  ZIMA_SUPPORT_ONLY_WEIGHTS_PLACEHOLDER,
  ZIMA_PLACEHOLDER_ITEMS,
  ZIMA_LOW_FRONTLINE_FIT_MESSAGE_EN,
  ZIMA_LOW_FRONTLINE_FIT_MESSAGE_RU,
} from "./placeholders";

export {
  PACE_ITEMS, AUTONOMY_ITEMS, COLLABORATION_ITEMS, RISK_ITEMS,
  INNOVATION_ITEMS, CLIENT_FOCUS_ITEMS, PROCESS_ITEMS,
  RESILIENCE_ITEMS, AMBIGUITY_ITEMS, GROWTH_ITEMS,
  ZIMA_ALL_ITEMS, ZIMA_DIMENSION_IDS,
} from "./questions";
export {
  ZIMA_ROLE_WEIGHT_MATRIX,
  ZIMA_RED_FLAG_RULES,
  ZIMA_ENVIRONMENT_NOTES,
  ZIMA_ENV_NOTE_LOW_THRESHOLD,
  ZIMA_ENV_NOTE_HIGH_THRESHOLD,
} from "./scoring";
export {
  ZIMA_DIMENSION_DESCRIPTIONS,
  ZIMA_TRAINING_RULES,
  ZIMA_MANAGEMENT_RULES,
  ZIMA_STRENGTH_RULES,
  ZIMA_INTERVIEW_RULES,
  ZIMA_RETENTION_RULES,
  ZIMA_NO_TRAINING_GAPS,
  ZIMA_FIT_STRENGTH_THRESHOLD,
  ZIMA_FIT_STRENGTH_TEXT,
  ZIMA_FIT_RISK_THRESHOLD,
  ZIMA_FIT_RISK_TEXT_TEMPLATE,
  getDimensionDescription,
} from "./interpretations";

// Re-import for assembly
import { ZIMA_ALL_ITEMS, ZIMA_DIMENSION_IDS } from "./questions";
import { ZIMA_ROLE_WEIGHT_MATRIX, ZIMA_RED_FLAG_RULES, ZIMA_ENVIRONMENT_NOTES } from "./scoring";

/** Fully assembled ZIMA block config — ready for the scoring engine. */
export const ZIMA_FULL_CONFIG: ZIMABlockFullConfig = {
  items: ZIMA_ALL_ITEMS,
  dimensions: ZIMA_DIMENSION_IDS,
  roleWeightMatrix: ZIMA_ROLE_WEIGHT_MATRIX,
  redFlagRules: ZIMA_RED_FLAG_RULES,
  environmentNotes: ZIMA_ENVIRONMENT_NOTES,
};
