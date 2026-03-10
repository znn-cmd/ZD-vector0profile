// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Interpretation Dictionary — English
//
//  Covers:
//  - Primary / secondary role fit
//  - Environment fit (strong / moderate / low)
//  - Management recommendations
//  - Ramp-up recommendations
//  - Key role-mismatch warnings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ZIMAFitBlock, ZIMARoleMismatchWarning } from "./types";

// ─── Environment Fit Bands ──────────────────────────────────────────

export const ZIMA_ENVIRONMENT_FIT: readonly ZIMAFitBlock[] = [
  {
    band: "strong",
    label: "Strong Environment Fit",
    explanation: "The candidate's work style preferences are well-aligned with the ZIMA Dubai operating environment across most dimensions — pace, autonomy, collaboration, risk tolerance, and resilience expectations. They are likely to feel energised and effective from their first week.",
    managementNote: "Standard onboarding. This person's natural preferences match the environment, so focus management energy on skill development rather than cultural adaptation.",
    rampUpNote: "Expect a relatively fast ramp-up. Environmental comfort allows the candidate to focus on learning the product, market, and processes rather than adapting to the culture.",
  },
  {
    band: "moderate",
    label: "Moderate Environment Fit",
    explanation: "The candidate shows alignment on core dimensions but has meaningful gaps on 2–3 secondary factors. They will need to stretch beyond their comfort zone in specific areas, though these are typically coachable within the first 3–6 months.",
    managementNote: "Active coaching during the first 90 days on the misaligned dimensions. Set explicit expectations for the areas where they will need to adapt, and pair with a buddy who models the desired behaviours.",
    rampUpNote: "Allow 4–6 months for full productivity. The candidate will spend some energy adapting to the environment alongside learning the role, which slows the typical ramp curve.",
  },
  {
    band: "low",
    label: "Low Environment Fit",
    explanation: "Significant misalignment between the candidate's natural work style and the ZIMA environment on 4 or more dimensions. The daily experience will feel uncomfortable, draining, or frustrating for this individual, regardless of their technical sales capability.",
    managementNote: "High management investment required. This person will need continuous environmental coaching, which diverts management time from revenue-generating activities. Carefully weigh the candidate's other strengths against the cost of environmental adaptation.",
    rampUpNote: "Expect 6–9+ months before the candidate operates at full capacity, if they reach it at all. Environmental discomfort is a persistent drag on performance that cannot be trained away quickly.",
  },
];

// ─── Role Mismatch Warnings ─────────────────────────────────────────

export const ZIMA_ROLE_MISMATCH_WARNINGS: readonly ZIMARoleMismatchWarning[] = [
  {
    roleId: "full_cycle",
    warning: "The candidate's dimension profile does not align with the balanced demands of full-cycle selling at ZIMA. Specific gaps — typically in collaboration, process adherence, or resilience — will create bottlenecks across the prospect-to-renew lifecycle.",
    mitigation: "If proceeding, assign to a smaller, less complex book of business initially. Pair with a senior AE for deal reviews and a dedicated ops partner to handle process-heavy tasks.",
  },
  {
    roleId: "hunter",
    warning: "The candidate's environmental preferences conflict with the high-pace, high-risk, high-rejection reality of a hunter role at ZIMA. Low resilience, low risk tolerance, or low pace preference are the most common disqualifiers.",
    mitigation: "If proceeding, provide intensive rejection-resilience coaching, a structured prospecting cadence, and daily check-ins during the first 60 days. Set clear activity metrics alongside outcome metrics.",
  },
  {
    roleId: "consultative",
    warning: "The candidate lacks alignment on the patience, collaboration, and client-focus dimensions essential for consultative selling at ZIMA. They may push for premature closes, skip discovery, or underinvest in relationship building.",
    mitigation: "If proceeding, mandate completion of a consultative methodology programme (e.g., SPIN, Challenger). Implement mandatory discovery checklists and regular deal reviews that enforce the consultative process.",
  },
  {
    roleId: "team_lead",
    warning: "The candidate's dimension profile does not support the team leadership expectations at ZIMA — particularly around collaboration, process facilitation, and resilience under the dual pressure of managing people and managing pipeline.",
    mitigation: "If proceeding, enrol in a structured leadership development programme before assigning direct reports. Start as a player-coach with a small team (2–3) before expanding scope.",
  },
];

// ─── Management Recommendations ─────────────────────────────────────

export const ZIMA_MANAGEMENT_RECOMMENDATIONS: readonly string[] = [
  "If pace preference is high, avoid assigning to slow-moving accounts. Match with clients and projects that offer momentum and quick feedback loops.",
  "If autonomy is high, use outcome-based management. Define clear deliverables and checkpoints but do not prescribe methods. Avoid mandatory process steps that add no value.",
  "If autonomy is low, provide detailed playbooks, daily standups during the first 90 days, and a structured escalation path for uncertain situations.",
  "If collaboration preference is high, assign to team-based deals, joint selling initiatives, and mentoring pairings. Isolation will demotivate this person rapidly.",
  "If collaboration preference is low, allow independent territory ownership and minimise mandatory team activities. Forced collaboration will feel draining.",
  "If risk tolerance is low, frame targets as achievable with effort rather than aspirational. Gradually increase exposure to uncertainty as confidence builds.",
  "If innovation preference is high, involve in new product launches, market experiments, and process improvement initiatives. Routine execution will bore them.",
  "If process orientation is high, provide comprehensive documentation, clear stage gates, and structured reporting templates. Ambiguity will slow their output.",
  "If resilience is moderate or low, implement structured recovery practices — regular debriefs after losses, celebration of small wins, and manager availability during difficult periods.",
  "If ambiguity tolerance is low, be explicit about expectations, timelines, and decision criteria. Avoid vague direction like 'just figure it out'.",
  "If growth orientation is high, build a visible development roadmap with quarterly milestones. Include learning budget, conference access, and stretch assignments.",
];

// ─── Ramp-Up Recommendations ────────────────────────────────────────

export const ZIMA_RAMPUP_RECOMMENDATIONS: readonly string[] = [
  "Week 1–2: Cultural immersion and environment orientation. Focus on aligning the candidate's expectations with the actual ZIMA operating rhythm.",
  "Week 3–4: Product and market education with shadowing of a top performer whose style matches the candidate's profile.",
  "Month 2: First independent client interactions with manager co-piloting. Focus feedback on environmental adaptation, not just sales technique.",
  "Month 3: Graduated territory assignment with increasing independence. Weekly deal reviews focusing on both sales execution and environmental fit.",
  "Month 4–6: Full territory ownership with bi-weekly coaching sessions targeting the specific dimensions where environmental mismatch was identified.",
  "For candidates with low resilience scores: add weekly resilience check-ins and access to a peer support network during the first 90 days.",
  "For candidates with high autonomy scores: front-load process training and CRM compliance expectations. Establish the 'minimum viable process' upfront rather than adding requirements later.",
  "For candidates with low pace scores: protect their first month from high-intensity demands. Gradual ramp is more effective than immersion for this profile.",
];
