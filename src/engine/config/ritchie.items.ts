// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Block
//
//  12 scales, 80 Likert items (6-point), + 6 forced-choice mini-blocks
//  + 4 mini-cases + validity items
//
//  Scales:
//    INC = Incentive/money       REC = Recognition
//    ACH = Achievement           POW = Power/influence
//    VAR = Variety/change        AUT = Autonomy
//    STR = Structure             REL = Relationships
//    VAL = Values alignment      DEV = Development/growth
//    SEC = Security              DRI = Drive/energy
//
//  Item distribution: 7 items × 8 scales + 6 items × 4 scales = 80
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  RitchieBlockConfig,
  LikertItem,
  ForcedChoiceBlock,
  MiniCase,
  ValidityItem,
  ConsistencyPair,
  RitchieScale,
} from "../types";

// ─── Helper ──────────────────────────────────────────────────────────

function makeRItems(
  scale: string,
  defs: { text: string; reversed?: boolean }[],
): LikertItem[] {
  return defs.map((d, i) => ({
    id: `rm_${scale.toLowerCase()}_${String(i + 1).padStart(2, "0")}`,
    scale,
    reversed: d.reversed ?? false,
    text: d.text,
  }));
}

// ─── 80 Likert Items (12 scales) ─────────────────────────────────────

const INC = makeRItems("INC", [
  { text: "Earning potential is the most important factor in choosing a job." },
  { text: "I would take a pay cut for a more meaningful role.", reversed: true },
  { text: "I regularly track my earning progress against personal targets." },
  { text: "Financial bonuses motivate me more than any other reward." },
  { text: "I negotiate hard for the best compensation package." },
  { text: "I would choose a role with uncapped commission over a high base salary." },
  { text: "Money is not a primary motivator for me.", reversed: true },
]);

const REC = makeRItems("REC", [
  { text: "I value public acknowledgment of my achievements." },
  { text: "Being named top performer matters a great deal to me." },
  { text: "I do not need others to notice my contributions.", reversed: true },
  { text: "I am motivated when my manager highlights my work to leadership." },
  { text: "Awards and formal recognition programmes energise me." },
  { text: "I prefer quiet recognition over public praise.", reversed: true },
  { text: "I keep a record of my professional achievements and awards." },
]);

const ACH = makeRItems("ACH", [
  { text: "I set personal goals that exceed official targets." },
  { text: "Completing difficult tasks gives me deep satisfaction." },
  { text: "I am satisfied with meeting minimum expectations.", reversed: true },
  { text: "I measure my success by the challenges I have overcome." },
  { text: "I feel restless when I am not progressing toward a goal." },
  { text: "I seek out the most difficult assignments." },
  { text: "I am happy to coast once I have met my basic targets.", reversed: true },
]);

const POW = makeRItems("POW", [
  { text: "I enjoy influencing how others think and act." },
  { text: "I actively seek leadership positions." },
  { text: "I am comfortable letting others take the lead.", reversed: true },
  { text: "I feel energised when others follow my direction." },
  { text: "I want to shape the strategy, not just execute it." },
  { text: "Political dynamics in organisations interest me." },
  { text: "I prefer to be an individual contributor rather than manage people.", reversed: true },
]);

const VAR = makeRItems("VAR", [
  { text: "I thrive in roles with changing priorities and tasks." },
  { text: "Routine work drains my energy." },
  { text: "I prefer predictable, stable day-to-day work.", reversed: true },
  { text: "I actively seek novel experiences in my work." },
  { text: "I get excited when my role involves new challenges." },
  { text: "Too much change makes me uncomfortable.", reversed: true },
]);

const AUT = makeRItems("AUT", [
  { text: "I work best when I choose my own approach." },
  { text: "I dislike being micromanaged." },
  { text: "I prefer clear instructions over autonomy.", reversed: true },
  { text: "I value the freedom to organise my own schedule." },
  { text: "I take initiative without waiting for approval." },
  { text: "I feel uncomfortable when there are no guidelines.", reversed: true },
]);

const STR = makeRItems("STR", [
  { text: "I appreciate well-defined processes and procedures." },
  { text: "I prefer knowing exactly what is expected of me." },
  { text: "I find strict rules limiting and prefer flexibility.", reversed: true },
  { text: "Clear KPIs and metrics help me perform at my best." },
  { text: "I value a well-organised work environment." },
  { text: "I work better with ambiguity than with rigid structure.", reversed: true },
  { text: "I follow established sales methodologies closely." },
]);

const REL = makeRItems("REL", [
  { text: "I build deep, long-lasting relationships with clients." },
  { text: "Team camaraderie is essential for my motivation." },
  { text: "I prefer working alone to collaborating.", reversed: true },
  { text: "I invest time in understanding colleagues' personal lives." },
  { text: "I feel energised by social interactions at work." },
  { text: "I prioritise relationships even when they do not generate immediate revenue." },
  { text: "Networking feels like a chore to me.", reversed: true },
]);

const VAL = makeRItems("VAL", [
  { text: "I need to believe in what I am selling." },
  { text: "I would not sell a product I think is inferior." },
  { text: "Revenue matters more than product quality to me.", reversed: true },
  { text: "I am proud when my company's values align with mine." },
  { text: "I choose employers based on their mission and culture." },
  { text: "Ethical concerns rarely affect my sales decisions.", reversed: true },
]);

const DEV = makeRItems("DEV", [
  { text: "I actively seek opportunities to learn new skills." },
  { text: "Professional development is a key factor in job satisfaction." },
  { text: "I am content with my current skill set.", reversed: true },
  { text: "I allocate personal time and money to training." },
  { text: "I want a role that challenges me to grow continuously." },
  { text: "I seek mentors and coaches proactively." },
  { text: "I learn more from experience than from formal training.", reversed: true },
]);

const SEC = makeRItems("SEC", [
  { text: "Job stability is a top priority for me." },
  { text: "I prefer a secure base salary over variable compensation." },
  { text: "I am comfortable with income uncertainty.", reversed: true },
  { text: "I worry about job security more than career advancement." },
  { text: "I would stay in a less exciting role if it offered stability." },
  { text: "A guaranteed benefits package is essential for me." },
]);

const DRI = makeRItems("DRI", [
  { text: "I maintain high energy throughout the workday." },
  { text: "I push myself beyond what is required." },
  { text: "I sometimes struggle to stay motivated on long projects.", reversed: true },
  { text: "I start each day with a sense of urgency." },
  { text: "I recover quickly from setbacks." },
  { text: "I am naturally competitive and hate losing." },
]);

// ─── 6 Forced-Choice Mini-Blocks (+2 / -2) ──────────────────────────

const FORCED_CHOICE_BLOCKS: ForcedChoiceBlock[] = [
  {
    id: "fc_01",
    prompt: "Which matters more to you right now?",
    optionA: { text: "Earning as much money as possible", scale: "INC" },
    optionB: { text: "Doing work that feels personally meaningful", scale: "VAL" },
  },
  {
    id: "fc_02",
    prompt: "In a new role, which would you prioritise?",
    optionA: { text: "Having the freedom to work my own way", scale: "AUT" },
    optionB: { text: "Having a clear playbook and proven process", scale: "STR" },
  },
  {
    id: "fc_03",
    prompt: "Which type of recognition motivates you most?",
    optionA: { text: "A public award at the company all-hands meeting", scale: "REC" },
    optionB: { text: "A private message from the CEO about my impact", scale: "ACH" },
  },
  {
    id: "fc_04",
    prompt: "Which would you choose?",
    optionA: { text: "A leadership role managing a team of 10", scale: "POW" },
    optionB: { text: "A senior individual contributor role with deep expertise", scale: "DEV" },
  },
  {
    id: "fc_05",
    prompt: "What matters more in your ideal work environment?",
    optionA: { text: "Variety and constant new challenges", scale: "VAR" },
    optionB: { text: "A stable team with strong personal bonds", scale: "REL" },
  },
  {
    id: "fc_06",
    prompt: "If you had to choose:",
    optionA: { text: "High risk / high reward role at a startup", scale: "DRI" },
    optionB: { text: "Secure, well-paying role at an established firm", scale: "SEC" },
  },
];

// ─── 4 Mini-Cases ────────────────────────────────────────────────────

const MINI_CASES: MiniCase[] = [
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
];

// ─── Validity Items ──────────────────────────────────────────────────

const VALIDITY_ITEMS: ValidityItem[] = [
  { id: "rm_val_v01", text: "I have never felt frustrated at work.", expectedDirection: "disagree", threshold: 2 },
  { id: "rm_val_v02", text: "I occasionally question my career choices.", expectedDirection: "agree", threshold: 2 },
  { id: "rm_val_v03", text: "I always enjoy every task assigned to me.", expectedDirection: "disagree", threshold: 2 },
  { id: "rm_val_v04", text: "I sometimes find it hard to stay motivated.", expectedDirection: "agree", threshold: 2 },
  { id: "rm_val_v05", text: "I have never disagreed with a manager.", expectedDirection: "disagree", threshold: 2 },
];

// ─── Consistency Pairs ───────────────────────────────────────────────

const RM_CONSISTENCY_PAIRS: ConsistencyPair[] = [
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
  // Cross-scale: autonomy ↔ structure should be inversely correlated
  { itemA: "rm_aut_01", itemB: "rm_str_01", maxDelta: 2, sameDirection: false },
  // Security ↔ Drive/risk
  { itemA: "rm_sec_01", itemB: "rm_dri_06", maxDelta: 2, sameDirection: false },
];

// ─── Role Profiles ───────────────────────────────────────────────────

const ROLE_PROFILES: RitchieBlockConfig["roleProfiles"] = {
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
};

// ─── Export ──────────────────────────────────────────────────────────

export const RITCHIE_CONFIG: RitchieBlockConfig = {
  items: [
    ...INC, ...REC, ...ACH, ...POW, ...VAR, ...AUT,
    ...STR, ...REL, ...VAL, ...DEV, ...SEC, ...DRI,
  ],
  forcedChoiceBlocks: FORCED_CHOICE_BLOCKS,
  miniCases: MINI_CASES,
  validityItems: VALIDITY_ITEMS,
  consistencyPairs: RM_CONSISTENCY_PAIRS,
  roleProfiles: ROLE_PROFILES,
};
