// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Ritchie–Martin Motivational Block — 80 Likert Items (6-point scale)
//
//  Source: src/engine/config/ritchie.items.ts (approved question bank)
//
//  12 scales:
//    INC = Incentive/money (7 items)     REC = Recognition (7 items)
//    ACH = Achievement (7 items)         POW = Power/influence (7 items)
//    VAR = Variety/change (6 items)      AUT = Autonomy (6 items)
//    STR = Structure (7 items)           REL = Relationships (7 items)
//    VAL = Values alignment (6 items)    DEV = Development/growth (7 items)
//    SEC = Security (6 items)            DRI = Drive/energy (6 items)
//
//  Total: 7×8 + 6×4 = 80 items
//  Each scale has ~2 reverse-keyed items.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { LikertItemConfig, RitchieScale } from "../shared/types";

function makeRItems(
  scale: RitchieScale,
  defs: { text: string; reversed?: boolean }[],
): LikertItemConfig[] {
  return defs.map((d, i) => ({
    id: `rm_${scale.toLowerCase()}_${String(i + 1).padStart(2, "0")}`,
    scale,
    reversed: d.reversed ?? false,
    text: d.text,
  }));
}

// ─── INC: Incentive / Money (7 items, 2 reversed) ──────────────────

export const INC_ITEMS: readonly LikertItemConfig[] = makeRItems("INC", [
  { text: "Earning potential is the most important factor in choosing a job." },
  { text: "I would take a pay cut for a more meaningful role.", reversed: true },
  { text: "I regularly track my earning progress against personal targets." },
  { text: "Financial bonuses motivate me more than any other reward." },
  { text: "I negotiate hard for the best compensation package." },
  { text: "I would choose a role with uncapped commission over a high base salary." },
  { text: "Money is not a primary motivator for me.", reversed: true },
]);

// ─── REC: Recognition (7 items, 2 reversed) ────────────────────────

export const REC_ITEMS: readonly LikertItemConfig[] = makeRItems("REC", [
  { text: "I value public acknowledgment of my achievements." },
  { text: "Being named top performer matters a great deal to me." },
  { text: "I do not need others to notice my contributions.", reversed: true },
  { text: "I am motivated when my manager highlights my work to leadership." },
  { text: "Awards and formal recognition programmes energise me." },
  { text: "I prefer quiet recognition over public praise.", reversed: true },
  { text: "I keep a record of my professional achievements and awards." },
]);

// ─── ACH: Achievement (7 items, 2 reversed) ────────────────────────

export const ACH_ITEMS: readonly LikertItemConfig[] = makeRItems("ACH", [
  { text: "I set personal goals that exceed official targets." },
  { text: "Completing difficult tasks gives me deep satisfaction." },
  { text: "I am satisfied with meeting minimum expectations.", reversed: true },
  { text: "I measure my success by the challenges I have overcome." },
  { text: "I feel restless when I am not progressing toward a goal." },
  { text: "I seek out the most difficult assignments." },
  { text: "I am happy to coast once I have met my basic targets.", reversed: true },
]);

// ─── POW: Power / Influence (7 items, 2 reversed) ──────────────────

export const POW_ITEMS: readonly LikertItemConfig[] = makeRItems("POW", [
  { text: "I enjoy influencing how others think and act." },
  { text: "I actively seek leadership positions." },
  { text: "I am comfortable letting others take the lead.", reversed: true },
  { text: "I feel energised when others follow my direction." },
  { text: "I want to shape the strategy, not just execute it." },
  { text: "Political dynamics in organisations interest me." },
  { text: "I prefer to be an individual contributor rather than manage people.", reversed: true },
]);

// ─── VAR: Variety / Change (6 items, 2 reversed) ───────────────────

export const VAR_ITEMS: readonly LikertItemConfig[] = makeRItems("VAR", [
  { text: "I thrive in roles with changing priorities and tasks." },
  { text: "Routine work drains my energy." },
  { text: "I prefer predictable, stable day-to-day work.", reversed: true },
  { text: "I actively seek novel experiences in my work." },
  { text: "I get excited when my role involves new challenges." },
  { text: "Too much change makes me uncomfortable.", reversed: true },
]);

// ─── AUT: Autonomy (6 items, 2 reversed) ───────────────────────────

export const AUT_ITEMS: readonly LikertItemConfig[] = makeRItems("AUT", [
  { text: "I work best when I choose my own approach." },
  { text: "I dislike being micromanaged." },
  { text: "I prefer clear instructions over autonomy.", reversed: true },
  { text: "I value the freedom to organise my own schedule." },
  { text: "I take initiative without waiting for approval." },
  { text: "I feel uncomfortable when there are no guidelines.", reversed: true },
]);

// ─── STR: Structure (7 items, 2 reversed) ──────────────────────────

export const STR_ITEMS: readonly LikertItemConfig[] = makeRItems("STR", [
  { text: "I appreciate well-defined processes and procedures." },
  { text: "I prefer knowing exactly what is expected of me." },
  { text: "I find strict rules limiting and prefer flexibility.", reversed: true },
  { text: "Clear KPIs and metrics help me perform at my best." },
  { text: "I value a well-organised work environment." },
  { text: "I work better with ambiguity than with rigid structure.", reversed: true },
  { text: "I follow established sales methodologies closely." },
]);

// ─── REL: Relationships (7 items, 2 reversed) ─────────────────────

export const REL_ITEMS: readonly LikertItemConfig[] = makeRItems("REL", [
  { text: "I build deep, long-lasting relationships with clients." },
  { text: "Team camaraderie is essential for my motivation." },
  { text: "I prefer working alone to collaborating.", reversed: true },
  { text: "I invest time in understanding colleagues' personal lives." },
  { text: "I feel energised by social interactions at work." },
  { text: "I prioritise relationships even when they do not generate immediate revenue." },
  { text: "Networking feels like a chore to me.", reversed: true },
]);

// ─── VAL: Values Alignment (6 items, 2 reversed) ───────────────────

export const VAL_ITEMS: readonly LikertItemConfig[] = makeRItems("VAL", [
  { text: "I need to believe in what I am selling." },
  { text: "I would not sell a product I think is inferior." },
  { text: "Revenue matters more than product quality to me.", reversed: true },
  { text: "I am proud when my company's values align with mine." },
  { text: "I choose employers based on their mission and culture." },
  { text: "Ethical concerns rarely affect my sales decisions.", reversed: true },
]);

// ─── DEV: Development / Growth (7 items, 2 reversed) ───────────────

export const DEV_ITEMS: readonly LikertItemConfig[] = makeRItems("DEV", [
  { text: "I actively seek opportunities to learn new skills." },
  { text: "Professional development is a key factor in job satisfaction." },
  { text: "I am content with my current skill set.", reversed: true },
  { text: "I allocate personal time and money to training." },
  { text: "I want a role that challenges me to grow continuously." },
  { text: "I seek mentors and coaches proactively." },
  { text: "I learn more from experience than from formal training.", reversed: true },
]);

// ─── SEC: Security (6 items, 1 reversed) ───────────────────────────

export const SEC_ITEMS: readonly LikertItemConfig[] = makeRItems("SEC", [
  { text: "Job stability is a top priority for me." },
  { text: "I prefer a secure base salary over variable compensation." },
  { text: "I am comfortable with income uncertainty.", reversed: true },
  { text: "I worry about job security more than career advancement." },
  { text: "I would stay in a less exciting role if it offered stability." },
  { text: "A guaranteed benefits package is essential for me." },
]);

// ─── DRI: Drive / Energy (6 items, 1 reversed) ─────────────────────

export const DRI_ITEMS: readonly LikertItemConfig[] = makeRItems("DRI", [
  { text: "I maintain high energy throughout the workday." },
  { text: "I push myself beyond what is required." },
  { text: "I sometimes struggle to stay motivated on long projects.", reversed: true },
  { text: "I start each day with a sense of urgency." },
  { text: "I recover quickly from setbacks." },
  { text: "I am naturally competitive and hate losing." },
]);

// ─── Full Question Bank ─────────────────────────────────────────────

export const RITCHIE_ALL_ITEMS: readonly LikertItemConfig[] = [
  ...INC_ITEMS, ...REC_ITEMS, ...ACH_ITEMS, ...POW_ITEMS,
  ...VAR_ITEMS, ...AUT_ITEMS, ...STR_ITEMS, ...REL_ITEMS,
  ...VAL_ITEMS, ...DEV_ITEMS, ...SEC_ITEMS, ...DRI_ITEMS,
] as const;

/**
 * Total: 80 items across 12 scales
 * 8 scales × 7 items = 56
 * 4 scales × 6 items = 24
 * 56 + 24 = 80
 */

export const RITCHIE_SCALE_IDS: readonly RitchieScale[] = [
  "INC", "REC", "ACH", "POW", "VAR", "AUT",
  "STR", "REL", "VAL", "DEV", "SEC", "DRI",
] as const;
