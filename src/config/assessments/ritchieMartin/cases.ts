// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin — 4 Mini-Cases
//
//  Source: src/engine/config/ritchie.items.ts (MINI_CASES)
//
//  Each mini-case presents a realistic career dilemma with 4 options.
//  The candidate selects ONE option.
//
//  Scoring:
//    Each option choice adds/subtracts points to/from specific scales.
//    Points range from -2 to +3.
//    These adjustments are added to the base Likert + forced-choice
//    totals before final normalization.
//
//  Mini-cases provide behavioral-contextual data that supplements
//  the self-report Likert and forced-choice sections.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { MiniCaseConfig } from "../shared/types";

export const RITCHIE_MINI_CASES: readonly MiniCaseConfig[] = [
  {
    id: "mc_01",
    scenario:
      "You receive two job offers: Offer A pays 40% more but the company's ethics are questionable. " +
      "Offer B pays modestly but the mission deeply resonates with you.",
    options: [
      { id: "a", text: "Take Offer A — I can always leave later." },
      { id: "b", text: "Take Offer B — alignment matters more than money." },
      { id: "c", text: "Negotiate Offer B up and try to get closer to A's salary." },
      { id: "d", text: "Turn both down and keep searching." },
    ],
    scoring: {
      a: [{ scale: "INC", points: 3 }, { scale: "VAL", points: -2 }],
      b: [{ scale: "VAL", points: 3 }, { scale: "INC", points: -1 }],
      c: [{ scale: "VAL", points: 2 }, { scale: "INC", points: 1 }, { scale: "ACH", points: 1 }],
      d: [{ scale: "SEC", points: -2 }, { scale: "VAL", points: 1 }],
    },
  },
  {
    id: "mc_02",
    scenario:
      "Your manager offers you two projects: Project X is a comfortable repeat engagement. " +
      "Project Y is a high-profile new vertical with significant uncertainty.",
    options: [
      { id: "a", text: "Take Project X — reliable results, lower stress." },
      { id: "b", text: "Take Project Y — the challenge and visibility excite me." },
      { id: "c", text: "Ask for both — I can handle the workload." },
      { id: "d", text: "Ask for Project Y if I get a team to support me." },
    ],
    scoring: {
      a: [{ scale: "SEC", points: 2 }, { scale: "STR", points: 1 }],
      b: [{ scale: "VAR", points: 2 }, { scale: "ACH", points: 2 }, { scale: "REC", points: 1 }],
      c: [{ scale: "DRI", points: 3 }, { scale: "ACH", points: 1 }],
      d: [{ scale: "VAR", points: 1 }, { scale: "REL", points: 2 }, { scale: "POW", points: 1 }],
    },
  },
  {
    id: "mc_03",
    scenario:
      "You've been a top performer for 2 years but the promotion you expected goes to a colleague. " +
      "Your manager says 'next time.'",
    options: [
      { id: "a", text: "Start looking for opportunities elsewhere immediately." },
      { id: "b", text: "Ask for a detailed plan of what's needed for the next promotion." },
      { id: "c", text: "Accept it — loyalty to the company matters more." },
      { id: "d", text: "Request a compensation increase to reflect my contributions." },
    ],
    scoring: {
      a: [{ scale: "POW", points: 1 }, { scale: "DRI", points: 2 }, { scale: "SEC", points: -2 }],
      b: [{ scale: "ACH", points: 2 }, { scale: "STR", points: 2 }, { scale: "DEV", points: 1 }],
      c: [{ scale: "SEC", points: 2 }, { scale: "REL", points: 1 }, { scale: "ACH", points: -1 }],
      d: [{ scale: "INC", points: 3 }, { scale: "REC", points: 1 }],
    },
  },
  {
    id: "mc_04",
    scenario:
      "A long-term client invites you to take a senior role on their team. " +
      "It pays similarly but is a completely different industry.",
    options: [
      { id: "a", text: "Accept — the relationship and trust are already built." },
      { id: "b", text: "Decline — I want to grow within sales, not switch tracks." },
      { id: "c", text: "Explore it — I love learning new industries." },
      { id: "d", text: "Decline unless they significantly increase the offer." },
    ],
    scoring: {
      a: [{ scale: "REL", points: 3 }, { scale: "SEC", points: 1 }],
      b: [{ scale: "ACH", points: 2 }, { scale: "AUT", points: 1 }],
      c: [{ scale: "VAR", points: 3 }, { scale: "DEV", points: 2 }],
      d: [{ scale: "INC", points: 3 }],
    },
  },
] as const;
