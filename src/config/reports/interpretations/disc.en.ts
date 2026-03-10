// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DISC Interpretation Dictionary — English
//
//  Bands: very_high (≥75), high (60–74), medium (45–59),
//         low (30–44), very_low (0–29)
//  Quality bands: clean (score ≥ 80), caution (50–79), risk (< 50)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ScaleInterpretationBlock, QualityInterpretationBlock } from "./types";

// ─── D: Dominance ───────────────────────────────────────────────────

export const D_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Highly Dominant",
    explanation: "This individual is exceptionally assertive, direct, and results-driven. They instinctively take charge, push for decisions, and hold others accountable without hesitation.",
    implication: "Ideal for roles requiring aggressive pipeline ownership, high-stakes negotiation, and competitive market entry. May need coaching on listening and collaborative selling.",
    riskNote: "Could be perceived as overbearing by consultative clients. May clash with collaborative team cultures if not managed.",
    interviewFollowUp: "Describe a deal where being less aggressive would have produced a better outcome. What did you learn?",
  },
  {
    band: "high",
    label: "Above-Average Assertiveness",
    explanation: "Confidently assertive and comfortable pushing back when needed. Takes initiative, sets ambitious targets, and confronts challenges directly.",
    implication: "Well-suited for most sales roles. Balances drive with adaptability. Can lead without alienating peers.",
  },
  {
    band: "medium",
    label: "Moderate Assertiveness",
    explanation: "Willing to take charge in structured situations but does not naturally dominate. Prefers shared decision-making and consensus-building.",
    implication: "Effective in consultative and team-based selling. May underperform in high-pressure, autonomous hunter roles without strong coaching.",
    interviewFollowUp: "Tell me about a situation where you needed to take charge even though you felt uncomfortable. What happened?",
  },
  {
    band: "low",
    label: "Low Assertiveness",
    explanation: "Prefers to follow rather than lead. Avoids confrontation and difficult conversations. Unlikely to push back on pricing objections or stakeholder resistance.",
    implication: "Significant concern for any frontline sales role. May be better suited to account management or support functions.",
    riskNote: "Risk of underperformance in negotiation-heavy roles. May defer to client demands too readily.",
    interviewFollowUp: "Walk me through the last time you had to deliver difficult news to a client. What was your exact approach?",
  },
  {
    band: "very_low",
    label: "Very Low Assertiveness",
    explanation: "Consistently avoids taking charge, pushing back, or confronting issues. Shows strong preference for passive, supportive roles.",
    implication: "Not recommended for any role requiring independent deal progression, objection handling, or competitive positioning.",
    riskNote: "Critical gap for sales. Even with coaching, this trait is deeply ingrained and unlikely to shift significantly in the short term.",
  },
];

// ─── I: Influence ───────────────────────────────────────────────────

export const I_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Highly Influential",
    explanation: "Naturally persuasive, socially energised, and skilled at reading and influencing others. Builds rapport instantly and generates enthusiasm in any room.",
    implication: "Exceptional for relationship-driven sales, key account management, and roles requiring extensive networking and client entertainment.",
    riskNote: "May prioritise relationships over process compliance. Could overpromise in the heat of a conversation.",
  },
  {
    band: "high",
    label: "Strong Communicator",
    explanation: "Builds rapport well, adapts communication style to the audience, and maintains energy in social settings. Comfortable presenting to groups and handling objections conversationally.",
    implication: "Strong fit for most client-facing roles. Balances persuasion with substance.",
  },
  {
    band: "medium",
    label: "Adequate Social Skills",
    explanation: "Functional communicator who can build relationships when needed but does not naturally seek out social interaction. Effective in structured conversations but less so in unscripted networking.",
    implication: "Workable for roles with structured sales processes. May need support in cold outreach and large-group selling.",
    interviewFollowUp: "Describe how you approach building rapport with someone who is initially cold or dismissive.",
  },
  {
    band: "low",
    label: "Low Social Energy",
    explanation: "Finds extended social interaction draining. Prefers written communication over verbal. Struggles to generate enthusiasm or read emotional cues in real time.",
    implication: "Significant concern for relationship-driven sales. May perform better in technical or analytical support roles.",
    riskNote: "Client-facing roles will feel exhausting. Sustained prospecting and networking will be a persistent challenge.",
    interviewFollowUp: "How do you maintain energy and motivation during weeks with heavy client interaction?",
  },
  {
    band: "very_low",
    label: "Very Low Social Engagement",
    explanation: "Strongly prefers isolation over interaction. Avoids public speaking, networking, and small talk. Shows minimal natural persuasion instinct.",
    implication: "Not suited for any role where building and maintaining client relationships is a core requirement.",
    riskNote: "This is a structural misalignment, not a development gap. Coaching will produce limited results.",
  },
];

// ─── S: Steadiness ──────────────────────────────────────────────────

export const S_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Exceptionally Steady",
    explanation: "Remarkably patient, consistent, and reliable. Follows through on every commitment and maintains composure under sustained pressure. Thrives on long-term relationships and stable routines.",
    implication: "Ideal for account management, long-cycle enterprise sales, and post-sale relationship nurturing. May resist change and struggle in fast-pivoting environments.",
    riskNote: "Could be too risk-averse for hunter roles. May slow deal velocity by over-nurturing without closing.",
  },
  {
    band: "high",
    label: "Reliable and Patient",
    explanation: "Consistent performer who follows through, prepares thoroughly, and stays calm under pressure. Values stability but can adapt when the rationale is clear.",
    implication: "Strong fit for consultative and full-cycle roles requiring persistence across long deal cycles.",
  },
  {
    band: "medium",
    label: "Balanced Pace",
    explanation: "Capable of sustained effort but also comfortable with change. Neither rigidly consistent nor chaotically variable.",
    implication: "Versatile profile. Can flex between structured and dynamic environments with appropriate support.",
  },
  {
    band: "low",
    label: "Restless and Change-Seeking",
    explanation: "Gets bored with routine, struggles with long follow-up cycles, and prefers rapid novelty over sustained effort. May leave tasks unfinished when the initial excitement fades.",
    implication: "Better suited for fast-cycle transactional sales or roles with high variety. Long enterprise cycles will be a retention risk.",
    riskNote: "Pipeline hygiene and CRM compliance will need active management.",
    interviewFollowUp: "Tell me about a time you had to work on something repetitive for an extended period. How did you keep yourself engaged?",
  },
  {
    band: "very_low",
    label: "Very Low Consistency",
    explanation: "Strongly prefers novelty and excitement over routine and follow-through. Likely to abandon slow-moving deals and under-invest in administrative tasks.",
    implication: "Significant risk for any role requiring systematic pipeline management, consistent follow-up, or long nurture cycles.",
    riskNote: "Without strong process guardrails and management oversight, deliverables will be inconsistent.",
  },
];

// ─── C: Compliance / Precision ──────────────────────────────────────

export const C_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Highly Analytical",
    explanation: "Meticulous about facts, data, and process adherence. Produces flawless proposals, maintains accurate forecasts, and follows every compliance procedure.",
    implication: "Ideal for complex solution selling, regulated industries, and roles where precision prevents revenue leakage. May slow deal velocity by over-analysing.",
    riskNote: "Analysis paralysis is a real risk. May frustrate fast-moving colleagues and prospects who want quick answers.",
  },
  {
    band: "high",
    label: "Detail-Oriented",
    explanation: "Produces accurate, well-researched output. Maintains good CRM hygiene and catches errors before they reach clients. Comfortable with data-driven decision-making.",
    implication: "Strong complement to any sales team. Reduces commercial risk and builds client trust through reliability.",
  },
  {
    band: "medium",
    label: "Adequate Precision",
    explanation: "Generally accurate but may cut corners under time pressure. Follows processes when reminded but does not naturally seek out compliance tasks.",
    implication: "Functional for most roles but will need periodic quality checks on proposals, forecasts, and CRM data.",
    interviewFollowUp: "Describe a time when a small error in a proposal or contract caused a problem. How did you handle it?",
  },
  {
    band: "low",
    label: "Low Attention to Detail",
    explanation: "Prioritises speed and intuition over accuracy. May overpromise, under-document, and produce proposals with errors. CRM updates will be inconsistent.",
    implication: "Elevated commercial risk. Requires structured oversight, mandatory checklists, and regular pipeline audits.",
    riskNote: "In regulated or high-value deal environments, this creates compliance exposure.",
    interviewFollowUp: "How do you ensure your proposals and contracts are accurate? Walk me through your specific quality checks.",
  },
  {
    band: "very_low",
    label: "Very Low Precision",
    explanation: "Shows little interest in facts, documentation, or process compliance. Relies almost entirely on instinct and personal relationships.",
    implication: "Not suited for roles where accuracy, forecasting, or regulatory compliance is important. Significant risk of client trust erosion.",
    riskNote: "This will create persistent quality issues that coaching alone is unlikely to resolve. Consider whether role design can compensate.",
  },
];

// ─── K: Social Desirability / Kontrol ───────────────────────────────

export const K_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Credible Responding",
    explanation: "Scores on the social desirability scale are within expected norms. The candidate presented themselves honestly, including acknowledging normal human imperfections.",
    implication: "Assessment results can be interpreted with full confidence. No impression management concerns.",
  },
  {
    band: "high",
    label: "Generally Honest Responding",
    explanation: "Social desirability scores are slightly elevated but within acceptable range. Minor tendency to present positively, typical of motivated candidates.",
    implication: "Results are reliable. Slight positive bias is normal in hiring contexts and does not undermine interpretation.",
  },
  {
    band: "medium",
    label: "Moderate Impression Management",
    explanation: "Social desirability is elevated above the typical range. The candidate may be presenting an idealised self-image on some items.",
    implication: "Interpret extreme scores with some caution. Behavioural interview probes are recommended to validate self-reported strengths.",
    riskNote: "The elevated K-scale does not invalidate results, but suggests the real behavioural profile may be somewhat less extreme than reported.",
    interviewFollowUp: "Tell me about a time you made a significant mistake at work. What did you do, and what did you learn?",
  },
  {
    band: "low",
    label: "High Impression Management",
    explanation: "Social desirability scores indicate significant self-presentation bias. The candidate endorsed an unusually high number of extreme, socially desirable statements.",
    implication: "Assessment results should be interpreted with caution. Interview validation of all key strengths is essential before making decisions.",
    riskNote: "This level of impression management may reflect poor self-awareness, deliberate self-presentation management, or both. It does not necessarily mean the candidate is dishonest, but the profile may overstate strengths.",
    interviewFollowUp: "What would your closest colleague say is your biggest weakness? Give me a specific example they would use.",
  },
  {
    band: "very_low",
    label: "Significant Validity Concern",
    explanation: "K-scale scores are at a level that calls overall response validity into question. The candidate endorsed nearly all extreme social desirability items.",
    implication: "Assessment results cannot be relied upon without extensive interview-based validation. Consider re-administration under proctored conditions.",
    riskNote: "This is a structural validity issue. The entire assessment profile may not reflect the candidate's actual behavioural tendencies.",
  },
];

// ─── SJT: Situational Judgment ──────────────────────────────────────

export const SJT_INTERPRETATIONS: readonly ScaleInterpretationBlock[] = [
  {
    band: "very_high",
    label: "Excellent Judgment",
    explanation: "Candidate's responses closely align with expert-validated best practices across all 10 sales scenarios. Demonstrates sophisticated understanding of when to push, when to listen, and when to escalate.",
    implication: "Strong indicator of real-world decision-making quality. Likely to handle complex, ambiguous situations effectively from day one.",
  },
  {
    band: "high",
    label: "Good Judgment",
    explanation: "Solid alignment with expert consensus on most scenarios. Minor deviations reflect personal style rather than poor judgment.",
    implication: "Reliable decision-maker who will handle most sales situations well. Onboarding can focus on company-specific protocols rather than judgment fundamentals.",
  },
  {
    band: "medium",
    label: "Adequate Judgment",
    explanation: "Mixed performance across the 10 scenarios. Some responses align well with best practice while others show areas where judgment could improve.",
    implication: "Will benefit from structured scenario training, deal review sessions, and mentorship during the first 6 months.",
    interviewFollowUp: "Walk me through a recent complex deal situation and how you decided on your approach.",
  },
  {
    band: "low",
    label: "Below-Average Judgment",
    explanation: "Responses deviate significantly from expert consensus on multiple scenarios. Suggests gaps in sales strategy, stakeholder management, or ethical reasoning.",
    implication: "Requires intensive onboarding, regular deal coaching, and close management oversight. Should not manage complex or high-value accounts independently during the first year.",
    riskNote: "Poor SJT scores are the strongest single predictor of early-stage underperformance in sales roles.",
    interviewFollowUp: "A key deal is stalling because the economic buyer is unresponsive. Your champion says a competitor is also in the running. Walk me through your exact next 5 steps.",
  },
  {
    band: "very_low",
    label: "Poor Judgment",
    explanation: "Candidate's responses indicate fundamental misalignment with established best practices in most sales scenarios. Suggests limited understanding of professional sales dynamics.",
    implication: "Significant risk. Not recommended for any client-facing role without substantial remedial training and a probation period with close oversight.",
    riskNote: "This score level is associated with high early-stage attrition and client escalation events.",
  },
];

// ─── Validity ───────────────────────────────────────────────────────

export const VALIDITY_INTERPRETATIONS: readonly QualityInterpretationBlock[] = [
  {
    band: "clean",
    label: "Valid Responses",
    explanation: "No response pattern anomalies detected. The candidate engaged authentically with the assessment. Straight-lining, alternating patterns, and excessive social desirability are all within normal limits.",
    implication: "Full confidence in the assessment results. No additional validation steps required.",
  },
  {
    band: "caution",
    label: "Minor Validity Concerns",
    explanation: "One or more response pattern flags were raised, such as slightly elevated social desirability or a mild tendency toward straight-lining on a subset of items. These are common in high-stakes testing contexts.",
    implication: "Assessment results remain usable but should be supplemented with behavioural interview probes on any extreme scores.",
    riskNote: "Review extreme scale scores with additional scepticism. The overall profile direction is likely accurate, but the magnitude of peaks and valleys may be attenuated.",
  },
  {
    band: "risk",
    label: "Significant Validity Concerns",
    explanation: "Multiple validity flags detected, suggesting the candidate may not have engaged authentically with the assessment. Possible causes include random responding, extreme impression management, or fatigue-related disengagement.",
    implication: "Assessment results should not be used as a primary decision input. Re-administration under different conditions or extensive interview-based assessment is recommended.",
    riskNote: "Do not shortlist or reject based solely on this assessment. The data quality is insufficient for reliable interpretation.",
  },
];

// ─── Consistency ────────────────────────────────────────────────────

export const CONSISTENCY_INTERPRETATIONS: readonly QualityInterpretationBlock[] = [
  {
    band: "clean",
    label: "Consistent Responses",
    explanation: "Responses to paired items that measure the same construct are well-aligned. The candidate's self-report is internally coherent, suggesting stable and genuine self-perception.",
    implication: "High confidence in the accuracy of the profile. The reported strengths and weaknesses are likely to manifest in practice.",
  },
  {
    band: "caution",
    label: "Minor Inconsistencies",
    explanation: "A small number of paired items show response discrepancies. This may reflect situational answering, context-dependent self-perception, or mild fatigue.",
    implication: "The overall profile is still interpretable, but specific scales with inconsistent item pairs should be validated during interviews.",
    riskNote: "Flag the inconsistent scales to the interviewer so they can probe for authentic behaviour patterns.",
  },
  {
    band: "risk",
    label: "Significant Inconsistencies",
    explanation: "Numerous paired items show contradictory responses. The candidate either did not engage carefully, has highly unstable self-perception, or attempted to manipulate specific scale outcomes.",
    implication: "Scale-level scores should be treated as directional indicators only. Do not make fine-grained decisions based on individual scale differences.",
    riskNote: "Consider re-testing if the candidate is otherwise a strong prospect. Inconsistency at this level materially reduces the precision of the profile.",
  },
];
