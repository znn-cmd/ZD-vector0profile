// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin — 6 Forced-Choice Mini-Blocks
//
//  Source: src/engine/config/ritchie.items.ts (FORCED_CHOICE_BLOCKS)
//
//  Scoring logic:
//    Candidate picks "most like me" (a or b) for each block.
//    - Chosen option's scale gets +2 raw points
//    - Rejected option's scale gets -2 raw points
//    These adjustments are added to the base Likert scale totals
//    before final normalization.
//
//  Each forced-choice block contrasts two scales that are
//  theoretically in tension, providing ipsative data that cannot
//  be faked as easily as Likert responses alone.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ForcedChoiceBlockConfig } from "../shared/types";

export const RITCHIE_FORCED_CHOICE_BLOCKS: readonly ForcedChoiceBlockConfig[] = [
  {
    id: "fc_01",
    prompt: "Which matters more to you right now?",
    optionA: { text: "Earning as much money as possible", scale: "INC" },
    optionB: { text: "Doing work that feels personally meaningful", scale: "VAL" },
    // Contrasts: Incentive (INC) ↔ Values alignment (VAL)
  },
  {
    id: "fc_02",
    prompt: "In a new role, which would you prioritise?",
    optionA: { text: "Having the freedom to work my own way", scale: "AUT" },
    optionB: { text: "Having a clear playbook and proven process", scale: "STR" },
    // Contrasts: Autonomy (AUT) ↔ Structure (STR)
  },
  {
    id: "fc_03",
    prompt: "Which type of recognition motivates you most?",
    optionA: { text: "A public award at the company all-hands meeting", scale: "REC" },
    optionB: { text: "A private message from the CEO about my impact", scale: "ACH" },
    // Contrasts: Recognition (REC) ↔ Achievement (ACH)
  },
  {
    id: "fc_04",
    prompt: "Which would you choose?",
    optionA: { text: "A leadership role managing a team of 10", scale: "POW" },
    optionB: { text: "A senior individual contributor role with deep expertise", scale: "DEV" },
    // Contrasts: Power (POW) ↔ Development (DEV)
  },
  {
    id: "fc_05",
    prompt: "What matters more in your ideal work environment?",
    optionA: { text: "Variety and constant new challenges", scale: "VAR" },
    optionB: { text: "A stable team with strong personal bonds", scale: "REL" },
    // Contrasts: Variety (VAR) ↔ Relationships (REL)
  },
  {
    id: "fc_06",
    prompt: "If you had to choose:",
    optionA: { text: "High risk / high reward role at a startup", scale: "DRI" },
    optionB: { text: "Secure, well-paying role at an established firm", scale: "SEC" },
    // Contrasts: Drive (DRI) ↔ Security (SEC)
  },
] as const;

/**
 * Forced-choice adjustment rules:
 *
 * For each block, given the candidate's pick (a or b):
 *   chosen.scale += 2  (raw points added before normalization)
 *   rejected.scale -= 2 (raw points subtracted before normalization)
 *
 * The +2/-2 magnitude was calibrated so that forced-choice adjustments
 * can shift a scale by roughly 5-8 normalized points, enough to
 * differentiate tied scales without overwhelming the 80-item base.
 */
