// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interpretation Composition Engine — Smoke Test & Example Output
//
//  Run with: npx tsx src/lib/reporting/__tests__/composeInterpretation.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalProfile, ScaleScore, DISCScale, RitchieScale, ZIMADimension, SalesRole } from "@/engine/types";
import { composeInterpretation } from "../composeInterpretation";

// ─── Helper: build a ScaleScore ─────────────────────────────────────

function ss(normalized: number): ScaleScore {
  return { raw: normalized * 0.6, max: 60, normalized, itemCount: 10, answeredCount: 10 };
}

// ─── Example Profile: Strong Candidate ──────────────────────────────

const strongProfile: FinalProfile = {
  candidateId: "cand_001",
  assessedAt: new Date().toISOString(),

  disc: {
    scales: {
      D: ss(78), I: ss(72), S: ss(55), C: ss(65), K: ss(82),
    } as Record<DISCScale, ScaleScore>,
    sjtScore: ss(80),
    validity: { isValid: true, flags: [], score: 92 },
    consistency: { isConsistent: true, violations: [], score: 88 },
    overall: 76,
    band: "strong_shortlist",
    bandReasons: [],
    scaleProfile: { primary: "D", secondary: "I", label: "DI — Driver-Influencer" },
  },

  ritchie: {
    scales: {
      INC: ss(75), REC: ss(60), ACH: ss(82), POW: ss(68),
      VAR: ss(55), AUT: ss(70), STR: ss(45), REL: ss(62),
      VAL: ss(58), DEV: ss(72), SEC: ss(40), DRI: ss(80),
    } as Record<RitchieScale, ScaleScore>,
    forcedChoiceAdjustments: {} as Record<RitchieScale, number>,
    miniCaseScores: {},
    validity: { isValid: true, flags: [], score: 90 },
    consistency: { isConsistent: true, violations: [], score: 85 },
    topMotivators: ["ACH", "DRI", "INC"],
    bottomMotivators: ["SEC", "STR"],
    roleFit: {
      full_cycle: { score: 74, label: "Full-Cycle AE", fit: "strong", criticalGaps: [] },
      hunter: { score: 82, label: "Hunter", fit: "strong", criticalGaps: [] },
      consultative: { score: 58, label: "Consultative", fit: "moderate", criticalGaps: [] },
      team_lead: { score: 65, label: "Team Lead", fit: "moderate", criticalGaps: [] },
    },
  },

  zima: {
    dimensions: {
      pace: ss(75), autonomy: ss(72), collaboration: ss(55),
      risk: ss(68), innovation: ss(60), client_focus: ss(70),
      process: ss(50), resilience: ss(72), ambiguity: ss(65), growth: ss(70),
    } as Record<ZIMADimension, ScaleScore>,
    fitScore: 72,
    primaryRole: "hunter",
    secondaryRole: "full_cycle",
    roleFitScores: { full_cycle: 68, hunter: 78, consultative: 55, team_lead: 60 } as Record<SalesRole, number>,
    environmentNotes: ["High-pace alignment", "Strong resilience for sales environment"],
    redFlags: [],
    trainingRecommendations: ["Consultative methodology training recommended"],
    managementRecommendations: ["Light-touch management with outcome accountability"],
  },

  overallScore: 80,
  overallBand: "strong_hire",
  finalRecommendation: "STRONG HIRE recommendation.",
  primaryRole: "hunter",
  secondaryRole: "full_cycle",
  strengths: [
    "Strong assertiveness and results orientation — natural closer.",
    "High achievement drive — self-motivated to exceed targets.",
    "Strongly financially motivated — commission structures will drive performance.",
    "High resilience — can handle rejection-heavy roles without burnout.",
    "Strong client orientation — prioritises client success.",
    "Strong overall company-fit — well-aligned with the ZIMA environment.",
  ],
  risks: [],
  interviewFocusQuestions: [
    "What is the most complex deal you have closed, and what made it complex?",
  ],
  managementStyleRecommendations: [
    "Give direct, concise feedback. Set clear targets and get out of the way.",
    "Ensure compensation plan is transparent and that top-end earnings are visible.",
    "Provide a clear career path and ongoing learning opportunities.",
    "Minimise micromanagement — set outcomes, not methods.",
    "Light-touch management with outcome accountability",
  ],
  retentionRiskFlags: [],
};

// ─── Example Profile: Mixed / Conditional Candidate ─────────────────

const mixedProfile: FinalProfile = {
  candidateId: "cand_002",
  assessedAt: new Date().toISOString(),

  disc: {
    scales: {
      D: ss(48), I: ss(55), S: ss(68), C: ss(42), K: ss(55),
    } as Record<DISCScale, ScaleScore>,
    sjtScore: ss(52),
    validity: { isValid: true, flags: [], score: 72 },
    consistency: { isConsistent: false, violations: [{ pairId: "cp1", itemA: "d1", itemB: "d5", delta: 4 }], score: 58 },
    overall: 58,
    band: "conditional",
    bandReasons: ["Overall 58 < 67 threshold"],
    scaleProfile: { primary: "S", secondary: "I", label: "SI — Supporter-Influencer" },
  },

  ritchie: {
    scales: {
      INC: ss(42), REC: ss(55), ACH: ss(38), POW: ss(35),
      VAR: ss(72), AUT: ss(82), STR: ss(28), REL: ss(70),
      VAL: ss(65), DEV: ss(60), SEC: ss(22), DRI: ss(42),
    } as Record<RitchieScale, ScaleScore>,
    forcedChoiceAdjustments: {} as Record<RitchieScale, number>,
    miniCaseScores: {},
    validity: { isValid: true, flags: [], score: 68 },
    consistency: { isConsistent: true, violations: [], score: 75 },
    topMotivators: ["AUT", "VAR", "REL"],
    bottomMotivators: ["SEC", "STR", "POW"],
    roleFit: {
      full_cycle: { score: 48, label: "Full-Cycle AE", fit: "weak", criticalGaps: [{ scale: "ACH", score: 38, required: 60 }] },
      hunter: { score: 55, label: "Hunter", fit: "moderate", criticalGaps: [] },
      consultative: { score: 62, label: "Consultative", fit: "moderate", criticalGaps: [] },
      team_lead: { score: 40, label: "Team Lead", fit: "weak", criticalGaps: [{ scale: "POW", score: 35, required: 60 }] },
    },
  },

  zima: {
    dimensions: {
      pace: ss(42), autonomy: ss(80), collaboration: ss(38),
      risk: ss(35), innovation: ss(68), client_focus: ss(55),
      process: ss(32), resilience: ss(45), ambiguity: ss(38), growth: ss(60),
    } as Record<ZIMADimension, ScaleScore>,
    fitScore: 48,
    primaryRole: "consultative",
    secondaryRole: "hunter",
    roleFitScores: { full_cycle: 42, hunter: 50, consultative: 55, team_lead: 38 } as Record<SalesRole, number>,
    environmentNotes: ["Low pace may conflict with ZIMA rhythm"],
    redFlags: [
      { id: "rf_1", message: "Low resilience + low process = risk of early disengagement", severity: "warning" as const },
    ],
    trainingRecommendations: ["Process discipline training", "Resilience coaching"],
    managementRecommendations: ["Outcome-based management with minimal process"],
  },

  overallScore: 58,
  overallBand: "conditional",
  finalRecommendation: "CONDITIONAL — proceed with caution.",
  primaryRole: "consultative",
  secondaryRole: "hunter",
  strengths: [
    "Exceptional patience and follow-through — excels at long sales cycles.",
    "Self-directed — requires minimal supervision to produce results.",
  ],
  risks: [
    "Overall 58 < 67 threshold",
    "DISC consistency score 58/100 — inconsistent response patterns.",
    "Low resilience + low process = risk of early disengagement",
    "Low company fit score (48/100) — significant environment mismatch.",
  ],
  interviewFocusQuestions: [
    "Tell me about a time you had to push back on a client or internal stakeholder. What happened?",
    "Describe how you build rapport with a sceptical prospect. Walk me through a specific example.",
    "A key deal is at risk because the champion left the company. Walk me through your exact next steps.",
    "How do you ensure accuracy in proposals and pricing? Give a specific example of catching an error.",
    "Tell me about a period where you faced repeated rejection. How did you maintain your energy and pipeline?",
    "How do you approach CRM updates, pipeline reporting, and administrative tasks? Be specific.",
    "How would you feel about joining a team where the sales playbook is still being written?",
  ],
  managementStyleRecommendations: [
    "Offer consistent support and avoid sudden changes. Build trust through reliability.",
    "Outcome-based management with minimal process",
  ],
  retentionRiskFlags: [
    "High variety-seeking — risk of boredom and turnover if role becomes routine.",
    "High drive with very low security need — likely to pursue entrepreneurial opportunities.",
  ],
};

// ─── Run ────────────────────────────────────────────────────────────

function printSection(title: string, content: unknown) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(60)}`);
  console.log(JSON.stringify(content, null, 2));
}

function run() {
  console.log("\n🔷 EXAMPLE 1: Strong Candidate (EN)");
  const strong_en = composeInterpretation(strongProfile, "en");
  printSection("DISC — D scale", strong_en.disc.scales.D);
  printSection("DISC — SJT", strong_en.disc.sjt);
  printSection("DISC — Validity", strong_en.disc.validity);
  printSection("Ritchie — ACH scale", strong_en.ritchie.scales.ACH);
  printSection("Ritchie — Primary role (hunter)", strong_en.ritchie.primaryRoleFit);
  printSection("ZIMA — Environment fit", strong_en.zima.environmentFit);
  printSection("Final — Band template", strong_en.finalSummary.bandTemplate);
  printSection("Final — Target role", strong_en.finalSummary.targetRole);
  printSection("Final — Onboarding risks", strong_en.finalSummary.onboardingRisks);

  console.log("\n\n🔷 EXAMPLE 2: Mixed Candidate (EN)");
  const mixed_en = composeInterpretation(mixedProfile, "en");
  printSection("DISC — D scale", mixed_en.disc.scales.D);
  printSection("DISC — C scale", mixed_en.disc.scales.C);
  printSection("DISC — Consistency", mixed_en.disc.consistency);
  printSection("Ritchie — AUT scale", mixed_en.ritchie.scales.AUT);
  printSection("Ritchie — STR scale", mixed_en.ritchie.scales.STR);
  printSection("Ritchie — Primary role (consultative)", mixed_en.ritchie.primaryRoleFit);
  printSection("ZIMA — Environment fit", mixed_en.zima.environmentFit);
  printSection("ZIMA — Primary role mismatch", mixed_en.zima.primaryRoleMismatch);
  printSection("ZIMA — Management recs", mixed_en.zima.managementRecommendations);
  printSection("Final — Band template", mixed_en.finalSummary.bandTemplate);
  printSection("Final — Interview questions", mixed_en.finalSummary.interviewFocusQuestions);
  printSection("Final — Onboarding risks", mixed_en.finalSummary.onboardingRisks);

  console.log("\n\n🔷 EXAMPLE 3: Strong Candidate (RU)");
  const strong_ru = composeInterpretation(strongProfile, "ru");
  printSection("DISC — D (RU)", strong_ru.disc.scales.D);
  printSection("Ritchie — ACH (RU)", strong_ru.ritchie.scales.ACH);
  printSection("Final — Band template (RU)", strong_ru.finalSummary.bandTemplate);
  printSection("Narrative intros (RU)", strong_ru.finalSummary.narrative);

  console.log("\n\n🔷 EXAMPLE 4: Mixed Candidate (RU)");
  const mixed_ru = composeInterpretation(mixedProfile, "ru");
  printSection("DISC — D (RU)", mixed_ru.disc.scales.D);
  printSection("ZIMA — Environment fit (RU)", mixed_ru.zima.environmentFit);
  printSection("Final — Band template (RU)", mixed_ru.finalSummary.bandTemplate);
  printSection("Final — Onboarding risks (RU)", mixed_ru.finalSummary.onboardingRisks);

  // Verify determinism
  const a = composeInterpretation(strongProfile, "en");
  const b = composeInterpretation(strongProfile, "en");
  const deterministicOk = JSON.stringify(a) === JSON.stringify(b);
  console.log(`\n✅ Determinism check: ${deterministicOk ? "PASSED" : "FAILED"}`);

  // Verify all DISC scales have interpretations
  const allDiscOk = (["D", "I", "S", "C", "K"] as const).every(
    (s) => strong_en.disc.scales[s].label.length > 0,
  );
  console.log(`✅ All DISC scales populated: ${allDiscOk ? "PASSED" : "FAILED"}`);

  // Verify all Ritchie scales have interpretations
  const allRitchieOk = (
    ["INC", "REC", "ACH", "POW", "VAR", "AUT", "STR", "REL", "VAL", "DEV", "SEC", "DRI"] as const
  ).every((s) => strong_en.ritchie.scales[s].label.length > 0);
  console.log(`✅ All Ritchie scales populated: ${allRitchieOk ? "PASSED" : "FAILED"}`);

  // Verify both languages produce output
  const ruOk = strong_ru.disc.scales.D.label !== strong_en.disc.scales.D.label;
  console.log(`✅ RU ≠ EN labels: ${ruOk ? "PASSED" : "FAILED"}`);

  // Verify band resolution
  console.log(`✅ Strong candidate band: ${strong_en.finalSummary.bandTemplate.bandId} (expected: strong_fit)`);
  console.log(`✅ Mixed candidate band: ${mixed_en.finalSummary.bandTemplate.bandId} (expected: interview_with_caution or reserve_pool)`);

  console.log("\n🏁 All checks completed.");
}

run();
