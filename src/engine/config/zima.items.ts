// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Company / environment / role match engine
//
//  10 dimensions × 5 items = 50 Likert-6 items
//  Weighted role matrix maps dimensions to 4 sales roles
//  Red flag rules identify critical mismatches
//  Environment notes describe what each dimension implies
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  ZIMABlockConfig,
  ZIMADimension,
  LikertItem,
  RedFlagRule,
  SalesRole,
} from "../types";

// ─── Helper ──────────────────────────────────────────────────────────

function makeZItems(
  dim: string,
  defs: { text: string; reversed?: boolean }[],
): LikertItem[] {
  return defs.map((d, i) => ({
    id: `zima_${dim}_${String(i + 1).padStart(2, "0")}`,
    scale: dim,
    reversed: d.reversed ?? false,
    text: d.text,
  }));
}

// ─── 50 Items (10 dimensions × 5) ───────────────────────────────────

const PACE = makeZItems("pace", [
  { text: "I prefer a fast-paced environment where decisions happen quickly." },
  { text: "I work best when I have time to think carefully.", reversed: true },
  { text: "I enjoy juggling multiple priorities simultaneously." },
  { text: "I feel energised by tight deadlines." },
  { text: "A slower, methodical work rhythm suits me better.", reversed: true },
]);

const AUTONOMY = makeZItems("autonomy", [
  { text: "I prefer to figure out solutions independently." },
  { text: "I like having detailed guidance for every task.", reversed: true },
  { text: "I take ownership of my work without waiting for direction." },
  { text: "I perform better when someone checks my work regularly.", reversed: true },
  { text: "I set my own goals beyond what is formally required." },
]);

const COLLABORATION = makeZItems("collaboration", [
  { text: "I achieve more when working with a team." },
  { text: "I prefer solo work to collaborative projects.", reversed: true },
  { text: "I enjoy brainstorming sessions with colleagues." },
  { text: "I find team meetings mostly unproductive.", reversed: true },
  { text: "I actively support team members' success." },
]);

const RISK = makeZItems("risk", [
  { text: "I am comfortable making decisions with incomplete information." },
  { text: "I prefer to wait until all data is available before acting.", reversed: true },
  { text: "I embrace calculated risks to achieve bigger outcomes." },
  { text: "I avoid situations where the outcome is uncertain.", reversed: true },
  { text: "I see failure as a learning opportunity, not a setback." },
]);

const INNOVATION = makeZItems("innovation", [
  { text: "I look for new and unconventional approaches to problems." },
  { text: "I prefer proven methods over experimental ones.", reversed: true },
  { text: "I often propose ideas that challenge the status quo." },
  { text: "I get excited when asked to build something from scratch." },
  { text: "I am sceptical of change unless the benefit is clear.", reversed: true },
]);

const CLIENT_FOCUS = makeZItems("client_focus", [
  { text: "Understanding client needs is my highest priority." },
  { text: "I prefer back-office work over client-facing roles.", reversed: true },
  { text: "I proactively anticipate what clients will need next." },
  { text: "I build trust through consistent follow-through." },
  { text: "I find it challenging to manage client expectations.", reversed: true },
]);

const PROCESS = makeZItems("process", [
  { text: "I follow established workflows and procedures carefully." },
  { text: "I tend to improvise rather than follow a process.", reversed: true },
  { text: "I keep accurate records and documentation." },
  { text: "I update CRM and reporting tools consistently." },
  { text: "I find administrative tasks a necessary evil.", reversed: true },
]);

const RESILIENCE = makeZItems("resilience", [
  { text: "I recover quickly from professional setbacks." },
  { text: "Repeated rejection significantly affects my confidence.", reversed: true },
  { text: "I stay motivated even during a prolonged slump." },
  { text: "Criticism helps me improve rather than discourages me." },
  { text: "I dwell on mistakes longer than I should.", reversed: true },
]);

const AMBIGUITY = makeZItems("ambiguity", [
  { text: "I am comfortable working without a clear roadmap." },
  { text: "I need clear guidelines to feel confident.", reversed: true },
  { text: "I thrive in environments where roles and processes are still forming." },
  { text: "Ambiguous goals frustrate me.", reversed: true },
  { text: "I can create structure where none exists." },
]);

const GROWTH = makeZItems("growth", [
  { text: "I actively seek feedback to improve my performance." },
  { text: "I am satisfied with my current level of competence.", reversed: true },
  { text: "I invest personal time in professional development." },
  { text: "I seek out challenging assignments to stretch my abilities." },
  { text: "Career advancement is a primary driver for me." },
]);

// ─── Role Weight Matrix ──────────────────────────────────────────────
// Weights per dimension for each role (must sum to ~1.0 per role)

const ROLE_WEIGHT_MATRIX: Record<SalesRole, Record<ZIMADimension, number>> = {
  hunter: {
    pace: 0.15,
    autonomy: 0.15,
    collaboration: 0.05,
    risk: 0.15,
    innovation: 0.10,
    client_focus: 0.10,
    process: 0.03,
    resilience: 0.15,
    ambiguity: 0.07,
    growth: 0.05,
  },
  full_cycle: {
    pace: 0.10,
    autonomy: 0.10,
    collaboration: 0.10,
    risk: 0.10,
    innovation: 0.08,
    client_focus: 0.15,
    process: 0.10,
    resilience: 0.12,
    ambiguity: 0.07,
    growth: 0.08,
  },
  consultative: {
    pace: 0.05,
    autonomy: 0.07,
    collaboration: 0.12,
    risk: 0.05,
    innovation: 0.10,
    client_focus: 0.20,
    process: 0.12,
    resilience: 0.08,
    ambiguity: 0.06,
    growth: 0.15,
  },
  team_lead: {
    pace: 0.10,
    autonomy: 0.08,
    collaboration: 0.15,
    risk: 0.10,
    innovation: 0.08,
    client_focus: 0.10,
    process: 0.10,
    resilience: 0.12,
    ambiguity: 0.10,
    growth: 0.07,
  },
};

// ─── Environment Notes ───────────────────────────────────────────────

const ENVIRONMENT_NOTES: Record<ZIMADimension, { low: string; high: string }> = {
  pace: {
    low: "Prefers a measured, thoughtful work rhythm — may struggle in hyper-fast startup cultures.",
    high: "Thrives in rapid-fire environments — may find methodical organisations frustrating.",
  },
  autonomy: {
    low: "Works best with clear guidance and regular check-ins — needs structured onboarding.",
    high: "Self-directed and proactive — may resist micromanagement or rigid reporting.",
  },
  collaboration: {
    low: "Prefers independent work — assign individual territories or solo accounts.",
    high: "Energised by team dynamics — best in pod-based or collaborative selling models.",
  },
  risk: {
    low: "Risk-averse — assign established accounts, not greenfield territories.",
    high: "Risk-tolerant — give stretch targets and new market opportunities.",
  },
  innovation: {
    low: "Relies on proven playbooks — excellent at scaling existing processes.",
    high: "Creative problem-solver — best in roles requiring novel approaches.",
  },
  client_focus: {
    low: "Less client-oriented — better suited for internal or operational roles.",
    high: "Deeply client-centric — ensure account load allows relationship depth.",
  },
  process: {
    low: "May under-report or skip CRM updates — needs accountability structures.",
    high: "Disciplined with processes — ideal for compliance-heavy environments.",
  },
  resilience: {
    low: "Needs supportive management during slumps — monitor for burnout.",
    high: "Bounces back quickly — can handle high-rejection roles like cold outbound.",
  },
  ambiguity: {
    low: "Needs clear role definition and expectations — avoid early-stage startups.",
    high: "Comfortable building from scratch — ideal for new market entry.",
  },
  growth: {
    low: "May plateau without external push — provide structured development plans.",
    high: "Highly growth-oriented — offer mentorship and advancement paths to retain.",
  },
};

// ─── Red Flag Rules ──────────────────────────────────────────────────

const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: "rf_low_resilience",
    condition: (s) => s.resilience < 35,
    message: "Very low resilience — high risk of disengagement after early rejection cycles.",
    severity: "critical",
  },
  {
    id: "rf_low_client_focus",
    condition: (s) => s.client_focus < 30,
    message: "Critically low client orientation — unlikely to succeed in any client-facing sales role.",
    severity: "critical",
  },
  {
    id: "rf_low_process_high_risk",
    condition: (s) => s.process < 30 && s.risk > 75,
    message: "High risk-taking combined with low process adherence — potential compliance issues.",
    severity: "critical",
  },
  {
    id: "rf_extreme_autonomy",
    condition: (s) => s.autonomy > 90 && s.collaboration < 25,
    message: "Extreme autonomy with very low collaboration — may resist team norms and coaching.",
    severity: "warning",
  },
  {
    id: "rf_low_growth",
    condition: (s) => s.growth < 30,
    message: "Low growth orientation — risk of skill stagnation and long-term underperformance.",
    severity: "warning",
  },
  {
    id: "rf_pace_mismatch",
    condition: (s) => s.pace < 30 && s.ambiguity < 30,
    message: "Prefers slow, highly structured environments — poor fit for dynamic sales orgs.",
    severity: "warning",
  },
  {
    id: "rf_innovation_process_conflict",
    condition: (s) => s.innovation > 80 && s.process > 80,
    message: "Unusually high on both innovation and process — verify response consistency.",
    severity: "warning",
  },
];

// ─── Export ──────────────────────────────────────────────────────────

const ALL_DIMENSIONS: ZIMADimension[] = [
  "pace", "autonomy", "collaboration", "risk", "innovation",
  "client_focus", "process", "resilience", "ambiguity", "growth",
];

export const ZIMA_CONFIG: ZIMABlockConfig = {
  items: [
    ...PACE, ...AUTONOMY, ...COLLABORATION, ...RISK, ...INNOVATION,
    ...CLIENT_FOCUS, ...PROCESS, ...RESILIENCE, ...AMBIGUITY, ...GROWTH,
  ],
  dimensions: ALL_DIMENSIONS,
  roleWeightMatrix: ROLE_WEIGHT_MATRIX,
  redFlagRules: RED_FLAG_RULES,
  environmentNotes: ENVIRONMENT_NOTES,
};
