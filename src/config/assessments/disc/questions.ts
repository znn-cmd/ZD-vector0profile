// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Sales Behavior Block — 100 Likert Items (6-point scale)
//
//  Source: src/engine/config/disc.items.ts (approved question bank)
//
//  Structure: 20 items per scale × 5 scales = 100 items
//    D = Dominance (assertiveness, directness, results-focus)
//    I = Influence  (persuasion, enthusiasm, relationship-building)
//    S = Steadiness (patience, consistency, support orientation)
//    C = Compliance (accuracy, analysis, rule-following)
//    K = Kontrol    (social desirability / lie scale)
//
//  ~25% of items per scale are reverse-keyed.
//  Reverse items are scored as (7 - raw) before aggregation.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { LikertItemConfig, DISCScale } from "../shared/types";

function makeItems(
  scale: DISCScale,
  defs: { text: string; reversed?: boolean }[],
): LikertItemConfig[] {
  return defs.map((d, i) => ({
    id: `disc_${scale.toLowerCase()}_${String(i + 1).padStart(2, "0")}`,
    scale,
    reversed: d.reversed ?? false,
    text: d.text,
  }));
}

// ─── D Scale: Dominance (20 items, 5 reversed) ─────────────────────

export const D_ITEMS: readonly LikertItemConfig[] = makeItems("D", [
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

// ─── I Scale: Influence (20 items, 5 reversed) ─────────────────────

export const I_ITEMS: readonly LikertItemConfig[] = makeItems("I", [
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

// ─── S Scale: Steadiness (20 items, 5 reversed) ────────────────────

export const S_ITEMS: readonly LikertItemConfig[] = makeItems("S", [
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

// ─── C Scale: Compliance (20 items, 5 reversed) ────────────────────

export const C_ITEMS: readonly LikertItemConfig[] = makeItems("C", [
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

// ─── K Scale: Social Desirability / Kontrol (20 items, 5 reversed) ─

export const K_ITEMS: readonly LikertItemConfig[] = makeItems("K", [
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

// ─── Full Question Bank ─────────────────────────────────────────────

export const DISC_ALL_ITEMS: readonly LikertItemConfig[] = [
  ...D_ITEMS,
  ...I_ITEMS,
  ...S_ITEMS,
  ...C_ITEMS,
  ...K_ITEMS,
] as const;

/**
 * Total: 100 items
 * D: 20 (15 forward, 5 reversed)
 * I: 20 (15 forward, 5 reversed)
 * S: 20 (15 forward, 5 reversed)
 * C: 20 (15 forward, 5 reversed)
 * K: 20 (15 forward, 5 reversed)
 */
