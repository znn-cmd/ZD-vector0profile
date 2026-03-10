// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Final Summary Interpretation Dictionary — English
//
//  7 deterministic band templates + narrative section intros
//  Used by composeInterpretation.ts to build the final report narrative
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalBandTemplate, NarrativeSectionTemplates } from "./types";

// ─── Band Templates ─────────────────────────────────────────────────

export const FINAL_BAND_TEMPLATES: readonly FinalBandTemplate[] = [
  {
    bandId: "strong_fit",
    headline: "Strong Hire Recommendation",
    summary: "This candidate demonstrates a compelling combination of behavioural competence, motivational alignment, and environmental fit. Their assessment profile places them in the top tier across all three evaluation dimensions. The probability of sustained high performance in the recommended role is high.",
    nextStep: "Proceed to final interview. Focus on compensation alignment, start-date logistics, and cultural fit confirmation. No additional assessment validation is required.",
  },
  {
    bandId: "conditional_fit",
    headline: "Conditional Recommendation — Proceed with Targeted Evaluation",
    summary: "This candidate shows strong potential with identifiable development areas. Their overall profile is positive, but specific gaps require targeted validation before a hiring decision. With appropriate onboarding support and management attention, these gaps are likely coachable within the first 3–6 months.",
    nextStep: "Conduct a structured behavioural interview targeting the identified gap areas. If interview performance confirms coachability, proceed with a clear 90-day development plan. Consider a probation period with defined success criteria.",
  },
  {
    bandId: "high_risk",
    headline: "High Risk — Significant Concerns Identified",
    summary: "This candidate's assessment profile reveals critical gaps that are unlikely to be resolved through coaching or onboarding alone. The identified risks — whether in behavioural competence, motivational alignment, or environmental fit — represent structural misalignments that will persist even with strong management support.",
    nextStep: "Do not proceed unless the identified risks can be structurally mitigated through role redesign, team composition changes, or a fundamentally different position. If proceeding, document the accepted risks and create explicit monitoring checkpoints.",
  },
  {
    bandId: "shortlist",
    headline: "Shortlisted — Strong Profile for Further Evaluation",
    summary: "This candidate's assessment scores place them among the strongest in the current pipeline. While no assessment is definitive, the profile consistency and score quality indicate a high-potential individual who warrants priority attention in the interview process.",
    nextStep: "Schedule priority interviews. Share the detailed profile insights with the interviewing panel so they can focus on value-add questions rather than re-covering assessment ground.",
  },
  {
    bandId: "interview_with_caution",
    headline: "Interview with Caution — Mixed Signals Require Validation",
    summary: "The assessment reveals a mixed profile with both promising indicators and areas of concern. The data alone is insufficient to make a confident decision in either direction. A carefully designed interview process is needed to disambiguate the conflicting signals.",
    nextStep: "Design interview questions specifically targeting the flagged risk areas. Use behavioural event interviewing (BEI) to gather concrete evidence. Require at least two independent interviewer assessments before making a decision.",
  },
  {
    bandId: "reject",
    headline: "Not Recommended for Current Requirements",
    summary: "The candidate's assessment profile indicates fundamental misalignment with the requirements of the target role and/or the ZIMA operating environment. The gaps identified are structural rather than developmental, meaning they are unlikely to close through training, coaching, or experience alone.",
    nextStep: "Communicate a respectful decline. If the candidate has strengths in adjacent areas, consider whether an alternative role within the organisation could be a better fit. Offer to keep the profile on file for future opportunities if appropriate.",
  },
  {
    bandId: "reserve_pool",
    headline: "Reserve Pool — Not Now, Potentially Later",
    summary: "The candidate shows genuine potential but is not the right fit for current openings. Their profile has enough positive signals to warrant maintaining the relationship for future opportunities, particularly if their development areas align with upcoming role changes or team composition shifts.",
    nextStep: "Add to the reserve talent pool with a 6-month review flag. Note the specific conditions under which this candidate should be reconsidered — for example, a different role opening, a change in team composition, or their own professional development progress.",
  },
];

// ─── Narrative Section Templates ────────────────────────────────────

export const NARRATIVE_TEMPLATES: NarrativeSectionTemplates = {
  topStrengthsIntro:
    "Based on the integrated analysis of behavioural competence (DISC), motivational drivers (Ritchie–Martin), and environmental alignment (ZIMA), the following core strengths were identified:",

  keyRisksIntro:
    "The assessment identified the following areas of concern that should be weighed against the candidate's strengths when making a hiring decision:",

  managementStyleIntro:
    "To maximise this candidate's performance and engagement, the following management approach is recommended based on their motivational and behavioural profile:",

  interviewFocusIntro:
    "The following interview questions are designed to probe the specific areas where the assessment data requires validation or where the candidate's profile raises questions that cannot be answered by self-report alone:",

  onboardingRisksIntro:
    "Based on the candidate's environmental fit and behavioural profile, the following onboarding risks have been identified. Addressing these proactively during the first 90 days will significantly improve the probability of successful integration:",

  targetRoleIntro:
    "Based on the combined analysis of all three assessment blocks, the following role recommendation reflects the best alignment between the candidate's natural strengths and the organisation's current needs:",

  noItemsFallback:
    "No specific items were flagged in this category. This is a positive indicator, suggesting the candidate's profile does not raise concerns in this area.",
};
