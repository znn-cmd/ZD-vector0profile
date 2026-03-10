// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — 50 Likert Items (6-point scale)
//
//  APPROVAL STATUS: See approvalStatus.ts — question structure approved;
//  item wording currently inferred_from_approved_logic (copy approval pending).
//  Placeholder items (if any): placeholders.ts. Do NOT treat as final without sign-off.
//
//  10 dimensions × 5 items = 50 items
//    pace          — Speed of environment preference
//    autonomy      — Independence vs. structure
//    collaboration — Team vs. solo orientation
//    risk          — Risk tolerance
//    innovation    — Novelty-seeking
//    client_focus  — Client-facing orientation
//    process       — Process adherence
//    resilience    — Pressure handling
//    ambiguity     — Comfort with ambiguity
//    growth        — Growth-orientation
//
//  Each dimension has 2 reverse-keyed items (40% reverse rate).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { LikertItemConfig, ZIMADimension } from "../shared/types";

function makeZItems(
  dim: ZIMADimension,
  defs: { text: string; reversed?: boolean }[],
): LikertItemConfig[] {
  return defs.map((d, i) => ({
    id: `zima_${dim}_${String(i + 1).padStart(2, "0")}`,
    scale: dim,
    reversed: d.reversed ?? false,
    text: d.text,
  }));
}

// ─── pace (5 items, 2 reversed) ────────────────────────────────────

export const PACE_ITEMS: readonly LikertItemConfig[] = makeZItems("pace", [
  { text: "I prefer a fast-paced environment where decisions happen quickly." },
  { text: "I work best when I have time to think carefully.", reversed: true },
  { text: "I enjoy juggling multiple priorities simultaneously." },
  { text: "I feel energised by tight deadlines." },
  { text: "A slower, methodical work rhythm suits me better.", reversed: true },
]);

// ─── autonomy (5 items, 2 reversed) ────────────────────────────────

export const AUTONOMY_ITEMS: readonly LikertItemConfig[] = makeZItems("autonomy", [
  { text: "I prefer to figure out solutions independently." },
  { text: "I like having detailed guidance for every task.", reversed: true },
  { text: "I take ownership of my work without waiting for direction." },
  { text: "I perform better when someone checks my work regularly.", reversed: true },
  { text: "I set my own goals beyond what is formally required." },
]);

// ─── collaboration (5 items, 2 reversed) ───────────────────────────

export const COLLABORATION_ITEMS: readonly LikertItemConfig[] = makeZItems("collaboration", [
  { text: "I achieve more when working with a team." },
  { text: "I prefer solo work to collaborative projects.", reversed: true },
  { text: "I enjoy brainstorming sessions with colleagues." },
  { text: "I find team meetings mostly unproductive.", reversed: true },
  { text: "I actively support team members' success." },
]);

// ─── risk (5 items, 2 reversed) ────────────────────────────────────

export const RISK_ITEMS: readonly LikertItemConfig[] = makeZItems("risk", [
  { text: "I am comfortable making decisions with incomplete information." },
  { text: "I prefer to wait until all data is available before acting.", reversed: true },
  { text: "I embrace calculated risks to achieve bigger outcomes." },
  { text: "I avoid situations where the outcome is uncertain.", reversed: true },
  { text: "I see failure as a learning opportunity, not a setback." },
]);

// ─── innovation (5 items, 2 reversed) ──────────────────────────────

export const INNOVATION_ITEMS: readonly LikertItemConfig[] = makeZItems("innovation", [
  { text: "I look for new and unconventional approaches to problems." },
  { text: "I prefer proven methods over experimental ones.", reversed: true },
  { text: "I often propose ideas that challenge the status quo." },
  { text: "I get excited when asked to build something from scratch." },
  { text: "I am sceptical of change unless the benefit is clear.", reversed: true },
]);

// ─── client_focus (5 items, 2 reversed) ────────────────────────────

export const CLIENT_FOCUS_ITEMS: readonly LikertItemConfig[] = makeZItems("client_focus", [
  { text: "Understanding client needs is my highest priority." },
  { text: "I prefer back-office work over client-facing roles.", reversed: true },
  { text: "I proactively anticipate what clients will need next." },
  { text: "I build trust through consistent follow-through." },
  { text: "I find it challenging to manage client expectations.", reversed: true },
]);

// ─── process (5 items, 2 reversed) ─────────────────────────────────

export const PROCESS_ITEMS: readonly LikertItemConfig[] = makeZItems("process", [
  { text: "I follow established workflows and procedures carefully." },
  { text: "I tend to improvise rather than follow a process.", reversed: true },
  { text: "I keep accurate records and documentation." },
  { text: "I update CRM and reporting tools consistently." },
  { text: "I find administrative tasks a necessary evil.", reversed: true },
]);

// ─── resilience (5 items, 2 reversed) ──────────────────────────────

export const RESILIENCE_ITEMS: readonly LikertItemConfig[] = makeZItems("resilience", [
  { text: "I recover quickly from professional setbacks." },
  { text: "Repeated rejection significantly affects my confidence.", reversed: true },
  { text: "I stay motivated even during a prolonged slump." },
  { text: "Criticism helps me improve rather than discourages me." },
  { text: "I dwell on mistakes longer than I should.", reversed: true },
]);

// ─── ambiguity (5 items, 2 reversed) ───────────────────────────────

export const AMBIGUITY_ITEMS: readonly LikertItemConfig[] = makeZItems("ambiguity", [
  { text: "I am comfortable working without a clear roadmap." },
  { text: "I need clear guidelines to feel confident.", reversed: true },
  { text: "I thrive in environments where roles and processes are still forming." },
  { text: "Ambiguous goals frustrate me.", reversed: true },
  { text: "I can create structure where none exists." },
]);

// ─── growth (5 items, 1 reversed) ──────────────────────────────────

export const GROWTH_ITEMS: readonly LikertItemConfig[] = makeZItems("growth", [
  { text: "I actively seek feedback to improve my performance." },
  { text: "I am satisfied with my current level of competence.", reversed: true },
  { text: "I invest personal time in professional development." },
  { text: "I seek out challenging assignments to stretch my abilities." },
  { text: "Career advancement is a primary driver for me." },
]);

// ─── Full Question Bank ─────────────────────────────────────────────

export const ZIMA_ALL_ITEMS: readonly LikertItemConfig[] = [
  ...PACE_ITEMS,
  ...AUTONOMY_ITEMS,
  ...COLLABORATION_ITEMS,
  ...RISK_ITEMS,
  ...INNOVATION_ITEMS,
  ...CLIENT_FOCUS_ITEMS,
  ...PROCESS_ITEMS,
  ...RESILIENCE_ITEMS,
  ...AMBIGUITY_ITEMS,
  ...GROWTH_ITEMS,
] as const;

export const ZIMA_DIMENSION_IDS: readonly ZIMADimension[] = [
  "pace", "autonomy", "collaboration", "risk", "innovation",
  "client_focus", "process", "resilience", "ambiguity", "growth",
] as const;

/**
 * Total: 50 items across 10 dimensions (5 per dimension)
 * 19 reverse-keyed items (38% overall reverse rate)
 *
 * TODO (when product adds content): Optional or new items — add to
 * placeholders.ts first as placeholder_pending_approval; after approval,
 * add here and update ZIMA_ALL_ITEMS / dimension list.
 */
