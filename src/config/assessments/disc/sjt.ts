// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — 10 Situational Judgment Test Cases
//
//  Source: src/engine/config/disc.items.ts (SJT_CASES)
//
//  Each case presents a sales scenario with 4 response options.
//  The candidate ranks all 4 options from 1 (best) to 4 (worst).
//
//  Scoring method:
//  - Spearman-distance: for each option, abs(candidateRank - expertRank)
//  - Perfect match = 100 points per case; worst match = 0
//  - Max total distance for 4 items = 8
//  - Case score = ((8 - totalDistance) / 8) × 100
//
//  Expert keys are provided as [rank for option 0, rank for option 1,
//  rank for option 2, rank for option 3], where 1 = best, 4 = worst.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SJTCaseConfig } from "../shared/types";

export const DISC_SJT_CASES: readonly SJTCaseConfig[] = [
  {
    id: "sjt_01",
    scenario:
      "A prospect expresses interest but says the timing isn't right. Your pipeline is thin this quarter.",
    options: [
      "Push for an immediate meeting to create urgency.",
      "Schedule a follow-up in 3 months with a calendar invite.",
      "Send a case study and ask what would make the timing work.",
      "Move on to other leads and check back next quarter.",
    ],
    // Best = C (explore timing), B (schedule), A (push), worst = D (abandon)
    expertKey: [3, 2, 1, 4],
  },
  {
    id: "sjt_02",
    scenario:
      "During a demo, the technical decision-maker raises a product limitation you cannot resolve.",
    options: [
      "Acknowledge the gap, explain the roadmap, and pivot to strengths.",
      "Minimise the issue and redirect the conversation.",
      "Promise a custom fix without checking with engineering.",
      "Ask the prospect how critical this feature is to their decision.",
    ],
    // Best = D (assess criticality), A (acknowledge + pivot), B (minimise), worst = C (false promise)
    expertKey: [2, 3, 4, 1],
  },
  {
    id: "sjt_03",
    scenario:
      "Your biggest client threatens to leave for a competitor offering a 30% lower price.",
    options: [
      "Match the competitor's price immediately.",
      "Prepare a TCO analysis showing long-term value differences.",
      "Escalate to management and ask them to handle it.",
      "Schedule a face-to-face meeting to understand their full concerns.",
    ],
    // Best = B (TCO analysis), D (understand concerns), A (match price), worst = C (escalate)
    expertKey: [3, 1, 4, 2],
  },
  {
    id: "sjt_04",
    scenario:
      "A colleague is struggling to meet their sales targets and asks for help with their accounts.",
    options: [
      "Decline — you need to focus on your own targets.",
      "Help them with strategy but don't take over their accounts.",
      "Take over the most promising accounts to ensure team quota.",
      "Suggest they speak with the sales manager for coaching.",
    ],
    // Best = B (help with strategy), D (suggest coaching), C (take over), worst = A (decline)
    expertKey: [4, 1, 3, 2],
  },
  {
    id: "sjt_05",
    scenario:
      "A prospect asks for a significant discount that would reduce your commission but help hit team quota.",
    options: [
      "Give the discount without negotiation to close fast.",
      "Propose a smaller discount tied to a longer contract term.",
      "Refuse the discount and present the full-value proposition.",
      "Offer non-monetary concessions (training, extended support).",
    ],
    // Best = B (creative compromise), D (non-monetary), C (hold value), worst = A (give in)
    expertKey: [4, 1, 3, 2],
  },
  {
    id: "sjt_06",
    scenario:
      "You discover that a proposal you sent last week contained a pricing error in the client's favour.",
    options: [
      "Honour the incorrect price to maintain trust.",
      "Contact the client immediately, explain the error, and provide the corrected quote.",
      "Wait to see if the client notices before addressing it.",
      "Quietly correct the price in the next communication without mentioning it.",
    ],
    // Best = B (immediate transparency), D (stealth correct), A (honour), worst = C (wait)
    expertKey: [3, 1, 4, 2],
  },
  {
    id: "sjt_07",
    scenario:
      "Your manager sets a stretch target 40% above last quarter. You believe it's unrealistic.",
    options: [
      "Accept the target and work harder without comment.",
      "Present data on why the target is challenging and propose an achievable stretch.",
      "Agree publicly but privately plan to your own realistic number.",
      "Tell your manager the target is impossible and refuse to commit.",
    ],
    // Best = B (data-driven pushback), D (direct refusal), A (silent acceptance), worst = C (deception)
    expertKey: [3, 1, 4, 2],
  },
  {
    id: "sjt_08",
    scenario:
      "A long-time client refers a prospect to you, but the prospect's needs are better served by a competitor.",
    options: [
      "Try to close the deal anyway — revenue is revenue.",
      "Be transparent about the fit and suggest the better alternative.",
      "Propose a modified solution that partially meets their needs.",
      "Take the meeting but don't push hard for the sale.",
    ],
    // Best = B (transparent), C (modified solution), D (low-pressure), worst = A (force close)
    expertKey: [4, 1, 2, 3],
  },
  {
    id: "sjt_09",
    scenario:
      "You are double-booked: a demo with a high-value prospect and a team strategy meeting your manager expects you to attend.",
    options: [
      "Skip the team meeting without telling anyone.",
      "Ask your manager if you can join the team meeting remotely after the demo.",
      "Reschedule the prospect demo to a later date.",
      "Send a colleague to cover the demo while you attend the meeting.",
    ],
    // Best = B (communicate + compromise), D (delegate demo), C (reschedule), worst = A (disappear)
    expertKey: [4, 1, 3, 2],
  },
  {
    id: "sjt_10",
    scenario:
      "After several meetings, a prospect's decision-maker goes silent. Your champion inside the company says they are evaluating competitors.",
    options: [
      "Send daily follow-up emails to stay top of mind.",
      "Ask your champion to arrange a call to address outstanding concerns.",
      "Send a personalised message acknowledging the evaluation and offering a final comparison session.",
      "Accept the loss and focus on new opportunities.",
    ],
    // Best = C (personalised outreach), B (leverage champion), D (move on), worst = A (spam)
    expertKey: [4, 2, 1, 3],
  },
] as const;
