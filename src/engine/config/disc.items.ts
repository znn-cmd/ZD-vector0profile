// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — 100 Likert items + 10 SJT cases
//
//  Scales:
//    D = Dominance (assertiveness, directness, results-focus)
//    I = Influence  (persuasion, enthusiasm, relationship-building)
//    S = Steadiness (patience, consistency, support orientation)
//    C = Compliance (accuracy, analysis, rule-following)
//    K = Kontrol    (social desirability / lie scale)
//
//  20 items per scale × 5 scales = 100 items
//  ~25% of items per scale are reverse-keyed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  DISCBlockConfig,
  LikertItem,
  SJTCase,
  ConsistencyPair,
} from "../types";

// ─── Helper to build items for a scale ───────────────────────────────

function makeItems(
  scale: string,
  defs: { text: string; reversed?: boolean; pairWith?: string }[],
): LikertItem[] {
  return defs.map((d, i) => ({
    id: `disc_${scale.toLowerCase()}_${String(i + 1).padStart(2, "0")}`,
    scale,
    reversed: d.reversed ?? false,
    consistencyPairId: d.pairWith,
    text: d.text,
  }));
}

// ─── D Scale: Dominance ──────────────────────────────────────────────

const D_ITEMS = makeItems("D", [
  { text: "I take charge when a group lacks direction." },
  { text: "I push for quick decisions rather than extended deliberation." },
  { text: "I am comfortable overruling others when I believe I am right." },
  { text: "I prefer roles where I set the pace and direction." },
  { text: "I confront problems head-on rather than waiting." },
  { text: "I avoid taking charge even when nobody else steps up.", reversed: true },
  { text: "I challenge underperformance directly." },
  { text: "I feel energised by high-pressure targets." },
  { text: "I rarely assert my opinion in group settings.", reversed: true },
  { text: "I negotiate hard to get the best terms." },
  { text: "I prefer someone else to handle difficult conversations.", reversed: true },
  { text: "I am willing to make unpopular decisions to drive results." },
  { text: "I initiate actions rather than wait for instructions." },
  { text: "I set ambitious goals even when others think they are unrealistic." },
  { text: "I defer to others' preferences to keep harmony.", reversed: true },
  { text: "I thrive in competitive situations." },
  { text: "I make fast decisions even with incomplete data." },
  { text: "I hold people accountable without hesitation." },
  { text: "I focus on outcomes more than processes." },
  { text: "I hesitate to push back on senior stakeholders.", reversed: true },
]);

// ─── I Scale: Influence ──────────────────────────────────────────────

const I_ITEMS = makeItems("I", [
  { text: "I find it easy to start conversations with strangers." },
  { text: "I naturally persuade others to see my point of view." },
  { text: "I enjoy presenting ideas to groups." },
  { text: "I prefer working in isolation rather than with people.", reversed: true },
  { text: "I motivate others through enthusiasm and energy." },
  { text: "I build rapport quickly with new clients." },
  { text: "I struggle to maintain energy in social settings.", reversed: true },
  { text: "I use stories and examples to make points memorable." },
  { text: "I am comfortable networking at large events." },
  { text: "I adjust my communication style to my audience." },
  { text: "I avoid public speaking whenever possible.", reversed: true },
  { text: "I create a positive atmosphere in team meetings." },
  { text: "I find it easy to read people's emotions and respond." },
  { text: "I am energised by brainstorming sessions." },
  { text: "I generate excitement about new opportunities." },
  { text: "I tend to keep ideas to myself rather than share.", reversed: true },
  { text: "I maintain strong relationships with past clients." },
  { text: "I handle rejection without losing momentum." },
  { text: "I negotiate by finding common ground rather than demands." },
  { text: "I find small talk draining and unproductive.", reversed: true },
]);

// ─── S Scale: Steadiness ─────────────────────────────────────────────

const S_ITEMS = makeItems("S", [
  { text: "I am patient when deals take longer than expected." },
  { text: "I follow up consistently until a deal closes." },
  { text: "I prefer rapid change and new challenges over routine.", reversed: true },
  { text: "I keep detailed records of client interactions." },
  { text: "I remain calm when clients express frustration." },
  { text: "I find repetitive tasks boring and avoid them.", reversed: true },
  { text: "I support colleagues even when it does not benefit me directly." },
  { text: "I maintain a steady work pace under pressure." },
  { text: "I am reliable in delivering what I promise." },
  { text: "I get bored quickly with long sales cycles.", reversed: true },
  { text: "I prepare thoroughly before client meetings." },
  { text: "I handle administrative tasks without complaint." },
  { text: "I am uncomfortable with sudden strategy changes.", reversed: true },
  { text: "I persist with difficult clients rather than move on." },
  { text: "I ensure hand-offs to account management are seamless." },
  { text: "I follow established procedures even if shortcuts exist." },
  { text: "I struggle to maintain focus on long-term accounts.", reversed: true },
  { text: "I maintain composure when a prospect goes silent." },
  { text: "I value stability over excitement in my work." },
  { text: "I am methodical in my approach to pipeline management." },
]);

// ─── C Scale: Compliance ─────────────────────────────────────────────

const C_ITEMS = makeItems("C", [
  { text: "I verify facts before including them in proposals." },
  { text: "I review contracts carefully before sending them." },
  { text: "I prefer to act first and check details later.", reversed: true },
  { text: "I base my recommendations on data rather than intuition." },
  { text: "I identify potential risks before they become problems." },
  { text: "I find detailed planning unnecessary for sales.", reversed: true },
  { text: "I follow CRM update procedures consistently." },
  { text: "I analyse competitors' offers thoroughly." },
  { text: "I skip preparation steps when under time pressure.", reversed: true },
  { text: "I ensure pricing calculations are always accurate." },
  { text: "I create detailed account plans for major clients." },
  { text: "I question claims that lack supporting evidence." },
  { text: "I tend to over-promise to close deals faster.", reversed: true },
  { text: "I maintain accurate forecasts in the pipeline." },
  { text: "I notice discrepancies in proposals or contracts." },
  { text: "I follow compliance and legal review processes." },
  { text: "I make quick commitments to clients without checking.", reversed: true },
  { text: "I provide clients with thorough ROI analysis." },
  { text: "I document meeting outcomes within 24 hours." },
  { text: "I believe precision is more important than speed in proposals." },
]);

// ─── K Scale: Social Desirability / Kontrol ──────────────────────────

const K_ITEMS = makeItems("K", [
  { text: "I have never told a lie in a professional setting." },
  { text: "I always arrive exactly on time for every meeting." },
  { text: "I occasionally procrastinate on tasks I dislike.", reversed: true },
  { text: "I have never felt frustrated with a difficult client." },
  { text: "I always give 100% effort regardless of circumstances." },
  { text: "I have never missed a deadline in my career." },
  { text: "I sometimes exaggerate my accomplishments to impress.", reversed: true },
  { text: "I always remain perfectly calm under pressure." },
  { text: "I never feel jealous of colleagues' successes." },
  { text: "I occasionally cut corners when nobody is watching.", reversed: true },
  { text: "I have never had a negative thought about a manager." },
  { text: "I always put the company's interests ahead of my own." },
  { text: "I sometimes avoid giving honest feedback to spare feelings.", reversed: true },
  { text: "I have never felt bored during a workday." },
  { text: "I always follow every company policy to the letter." },
  { text: "I never gossip about colleagues." },
  { text: "I sometimes take credit for team efforts.", reversed: true },
  { text: "I have never made an error in a client proposal." },
  { text: "I always respond to emails within one hour." },
  { text: "I find it impossible to relate to every client I meet.", reversed: true },
]);

// ─── SJT Cases ───────────────────────────────────────────────────────

const SJT_CASES: SJTCase[] = [
  {
    id: "sjt_01",
    scenario: "A prospect expresses interest but says the timing isn't right. Your pipeline is thin this quarter.",
    options: [
      "Push for an immediate meeting to create urgency.",
      "Schedule a follow-up in 3 months with a calendar invite.",
      "Send a case study and ask what would make the timing work.",
      "Move on to other leads and check back next quarter.",
    ],
    expertKey: [3, 2, 1, 4], // Best = option C, then B, A, worst = D
  },
  {
    id: "sjt_02",
    scenario: "During a demo, the technical decision-maker raises a product limitation you cannot resolve.",
    options: [
      "Acknowledge the gap, explain the roadmap, and pivot to strengths.",
      "Minimise the issue and redirect the conversation.",
      "Promise a custom fix without checking with engineering.",
      "Ask the prospect how critical this feature is to their decision.",
    ],
    expertKey: [2, 3, 4, 1], // Best = D, then A, B, worst = C
  },
  {
    id: "sjt_03",
    scenario: "Your biggest client threatens to leave for a competitor offering a 30% lower price.",
    options: [
      "Match the competitor's price immediately.",
      "Prepare a TCO analysis showing long-term value differences.",
      "Escalate to management and ask them to handle it.",
      "Schedule a face-to-face meeting to understand their full concerns.",
    ],
    expertKey: [3, 1, 4, 2], // Best = B, then D, A, worst = C
  },
  {
    id: "sjt_04",
    scenario: "A colleague is struggling to meet their sales targets and asks for help with their accounts.",
    options: [
      "Decline — you need to focus on your own targets.",
      "Help them with strategy but don't take over their accounts.",
      "Take over the most promising accounts to ensure team quota.",
      "Suggest they speak with the sales manager for coaching.",
    ],
    expertKey: [4, 1, 3, 2], // Best = B, then D, C, worst = A
  },
  {
    id: "sjt_05",
    scenario: "A prospect asks for a significant discount that would reduce your commission but help hit team quota.",
    options: [
      "Give the discount without negotiation to close fast.",
      "Propose a smaller discount tied to a longer contract term.",
      "Refuse the discount and present the full-value proposition.",
      "Offer non-monetary concessions (training, extended support).",
    ],
    expertKey: [4, 1, 3, 2], // Best = B, then D, C, worst = A
  },
  {
    id: "sjt_06",
    scenario: "You discover that a proposal you sent last week contained a pricing error in the client's favour.",
    options: [
      "Honour the incorrect price to maintain trust.",
      "Contact the client immediately, explain the error, and provide the corrected quote.",
      "Wait to see if the client notices before addressing it.",
      "Quietly correct the price in the next communication without mentioning it.",
    ],
    expertKey: [3, 1, 4, 2], // Best = B, then D, A, worst = C
  },
  {
    id: "sjt_07",
    scenario: "Your manager sets a stretch target 40% above last quarter. You believe it's unrealistic.",
    options: [
      "Accept the target and work harder without comment.",
      "Present data on why the target is challenging and propose an achievable stretch.",
      "Agree publicly but privately plan to your own realistic number.",
      "Tell your manager the target is impossible and refuse to commit.",
    ],
    expertKey: [3, 1, 4, 2], // Best = B, then D, A, worst = C
  },
  {
    id: "sjt_08",
    scenario: "A long-time client refers a prospect to you, but the prospect's needs are better served by a competitor.",
    options: [
      "Try to close the deal anyway — revenue is revenue.",
      "Be transparent about the fit and suggest the better alternative.",
      "Propose a modified solution that partially meets their needs.",
      "Take the meeting but don't push hard for the sale.",
    ],
    expertKey: [4, 1, 2, 3], // Best = B, then C, D, worst = A
  },
  {
    id: "sjt_09",
    scenario: "You are double-booked: a demo with a high-value prospect and a team strategy meeting your manager expects you to attend.",
    options: [
      "Skip the team meeting without telling anyone.",
      "Ask your manager if you can join the team meeting remotely after the demo.",
      "Reschedule the prospect demo to a later date.",
      "Send a colleague to cover the demo while you attend the meeting.",
    ],
    expertKey: [4, 1, 3, 2], // Best = B, then D, C, worst = A
  },
  {
    id: "sjt_10",
    scenario: "After several meetings, a prospect's decision-maker goes silent. Your champion inside the company says they are evaluating competitors.",
    options: [
      "Send daily follow-up emails to stay top of mind.",
      "Ask your champion to arrange a call to address outstanding concerns.",
      "Send a personalised message acknowledging the evaluation and offering a final comparison session.",
      "Accept the loss and focus on new opportunities.",
    ],
    expertKey: [4, 2, 1, 3], // Best = C, then B, D, worst = A
  },
];

// ─── Consistency Pairs ───────────────────────────────────────────────
// Each pair: two items on the same scale that should track together.

const CONSISTENCY_PAIRS: ConsistencyPair[] = [
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
  // K scale: extreme claim pairs
  { itemA: "disc_k_01", itemB: "disc_k_06", maxDelta: 2, sameDirection: true },
  { itemA: "disc_k_04", itemB: "disc_k_11", maxDelta: 2, sameDirection: true },
];

// ─── Full Config Export ──────────────────────────────────────────────

export const DISC_CONFIG: DISCBlockConfig = {
  items: [
    ...D_ITEMS,
    ...I_ITEMS,
    ...S_ITEMS,
    ...C_ITEMS,
    ...K_ITEMS,
  ],
  sjtCases: SJT_CASES,
  consistencyPairs: CONSISTENCY_PAIRS,
  validityItemIds: K_ITEMS.map((i) => i.id),
  scaleWeights: {
    D: 0.20,
    I: 0.20,
    S: 0.15,
    C: 0.15,
    K: 0.10,
    SJT: 0.20,
  },
  thresholds: {
    strong: { overall: 75, D: 60, I: 65, C: 55, K: 65, SJT: 70 },
    conditional: { overallMin: 67, overallMax: 74 },
    highRisk: { overall: 67, SJT: 60, K: 55, C: 50 },
  },
};
