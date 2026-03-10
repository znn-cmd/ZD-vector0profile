// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interview Follow-Up Questions — Smoke Test / Example Outputs
//
//  Run: npx tsx src/lib/reporting/__tests__/composeInterviewQuestions.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalProfile, DISCBlockResult, RitchieBlockResult, ZIMABlockResult, ScaleScore, DISCScale, RitchieScale, ZIMADimension, SalesRole } from "@/engine/types";
import { composeInterviewQuestions } from "../composeInterviewQuestions";

// ─── Helper: Build ScaleScore ───────────────────────────────────────

function ss(normalized: number): ScaleScore {
  return { raw: normalized * 0.6, max: 60, normalized, itemCount: 10, answeredCount: 10 };
}

// ─── Helper: Build FinalProfile ─────────────────────────────────────

function makeProfile(overrides: Partial<{
  candidateId: string;
  discScales: Record<DISCScale, number>;
  sjtScore: number;
  discBand: "strong_shortlist" | "conditional" | "high_risk";
  validityScore: number;
  consistencyScore: number;
  ritchieScales: Record<RitchieScale, number>;
  roleFits: Record<SalesRole, { score: number; fit: "strong" | "moderate" | "weak" }>;
  topMotivators: RitchieScale[];
  bottomMotivators: RitchieScale[];
  zimaDims: Record<ZIMADimension, number>;
  zimaFit: number;
  zimaRedFlagCount: number;
  zimaPrimaryRole: SalesRole;
  overallScore: number;
  overallBand: "strong_hire" | "recommended" | "conditional" | "not_recommended";
  primaryRole: SalesRole;
  secondaryRole: SalesRole;
}>): FinalProfile {
  const o = {
    candidateId: "cand_test",
    discScales: { D: 65, I: 65, S: 55, C: 55, K: 65 } as Record<DISCScale, number>,
    sjtScore: 70,
    discBand: "conditional" as const,
    validityScore: 80,
    consistencyScore: 80,
    ritchieScales: { INC: 60, REC: 55, ACH: 65, POW: 55, VAR: 50, AUT: 55, STR: 55, REL: 55, VAL: 55, DEV: 55, SEC: 50, DRI: 60 } as Record<RitchieScale, number>,
    roleFits: {
      full_cycle: { score: 65, fit: "moderate" as const },
      hunter: { score: 60, fit: "moderate" as const },
      consultative: { score: 60, fit: "moderate" as const },
      team_lead: { score: 55, fit: "weak" as const },
    },
    topMotivators: ["ACH", "INC", "DRI"] as RitchieScale[],
    bottomMotivators: ["SEC", "VAR"] as RitchieScale[],
    zimaDims: { pace: 60, autonomy: 55, collaboration: 55, risk: 50, innovation: 50, client_focus: 60, process: 55, resilience: 60, ambiguity: 55, growth: 55 } as Record<ZIMADimension, number>,
    zimaFit: 62,
    zimaRedFlagCount: 0,
    zimaPrimaryRole: "full_cycle" as SalesRole,
    overallScore: 68,
    overallBand: "conditional" as const,
    primaryRole: "full_cycle" as SalesRole,
    secondaryRole: "consultative" as SalesRole,
    ...overrides,
  };

  const discScalesObj = {} as Record<DISCScale, ScaleScore>;
  for (const [k, v] of Object.entries(o.discScales)) discScalesObj[k as DISCScale] = ss(v);

  const ritchieScalesObj = {} as Record<RitchieScale, ScaleScore>;
  for (const [k, v] of Object.entries(o.ritchieScales)) ritchieScalesObj[k as RitchieScale] = ss(v);

  const zimaDimsObj = {} as Record<ZIMADimension, ScaleScore>;
  for (const [k, v] of Object.entries(o.zimaDims)) zimaDimsObj[k as ZIMADimension] = ss(v);

  const roleFitObj = {} as Record<SalesRole, { score: number; label: string; fit: "strong" | "moderate" | "weak"; criticalGaps: [] }>;
  for (const [k, v] of Object.entries(o.roleFits)) {
    roleFitObj[k as SalesRole] = { score: v.score, label: k, fit: v.fit, criticalGaps: [] };
  }

  const redFlags = Array.from({ length: o.zimaRedFlagCount }, (_, i) => ({
    id: `rf_${i}`, message: `Red flag ${i + 1}`, severity: "warning" as const,
  }));

  const disc: DISCBlockResult = {
    scales: discScalesObj,
    sjtScore: ss(o.sjtScore),
    validity: { isValid: o.validityScore >= 70, flags: o.validityScore < 70 ? ["Elevated social desirability"] : [], score: o.validityScore },
    consistency: { isConsistent: o.consistencyScore >= 70, violations: [], score: o.consistencyScore },
    overall: Math.round(0.20 * o.discScales.D + 0.20 * o.discScales.I + 0.15 * o.discScales.S + 0.15 * o.discScales.C + 0.10 * o.discScales.K + 0.20 * o.sjtScore),
    band: o.discBand,
    bandReasons: [],
    scaleProfile: { primary: "D", secondary: "I", label: "Driver-Influencer" },
  };

  const ritchie: RitchieBlockResult = {
    scales: ritchieScalesObj,
    forcedChoiceAdjustments: {} as Record<RitchieScale, number>,
    miniCaseScores: {},
    validity: { isValid: true, flags: [], score: 85 },
    consistency: { isConsistent: true, violations: [], score: 85 },
    topMotivators: o.topMotivators,
    bottomMotivators: o.bottomMotivators,
    roleFit: roleFitObj,
  };

  const zima: ZIMABlockResult = {
    dimensions: zimaDimsObj,
    fitScore: o.zimaFit,
    primaryRole: o.zimaPrimaryRole,
    secondaryRole: o.secondaryRole,
    roleFitScores: { full_cycle: o.zimaFit, hunter: o.zimaFit - 5, consultative: o.zimaFit - 8, team_lead: o.zimaFit - 10 },
    environmentNotes: [],
    redFlags,
    trainingRecommendations: [],
    managementRecommendations: [],
  };

  return {
    candidateId: o.candidateId,
    assessedAt: "2026-03-10T10:00:00Z",
    disc,
    ritchie,
    zima,
    overallScore: o.overallScore,
    overallBand: o.overallBand,
    finalRecommendation: "Test recommendation",
    primaryRole: o.primaryRole,
    secondaryRole: o.secondaryRole,
    strengths: ["Test strength"],
    risks: ["Test risk"],
    interviewFocusQuestions: [],
    managementStyleRecommendations: [],
    retentionRiskFlags: [],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Test Profiles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const profileA = makeProfile({
  candidateId: "aggressive_hunter",
  discScales: { D: 88, I: 48, S: 38, C: 35, K: 42 },
  sjtScore: 72,
  validityScore: 58,
  consistencyScore: 55,
  ritchieScales: { INC: 90, REC: 60, ACH: 85, POW: 70, VAR: 72, AUT: 80, STR: 30, REL: 35, VAL: 40, DEV: 55, SEC: 22, DRI: 92 },
  roleFits: {
    full_cycle: { score: 70, fit: "moderate" },
    hunter: { score: 88, fit: "strong" },
    consultative: { score: 42, fit: "weak" },
    team_lead: { score: 55, fit: "weak" },
  },
  topMotivators: ["DRI", "INC", "ACH"],
  bottomMotivators: ["STR", "SEC"],
  zimaDims: { pace: 88, autonomy: 82, collaboration: 38, risk: 80, innovation: 70, client_focus: 52, process: 32, resilience: 85, ambiguity: 75, growth: 65 },
  zimaFit: 72,
  overallScore: 78,
  overallBand: "strong_hire",
  primaryRole: "hunter",
  secondaryRole: "full_cycle",
});

const profileB = makeProfile({
  candidateId: "steady_consultant",
  discScales: { D: 45, I: 80, S: 72, C: 68, K: 75 },
  sjtScore: 82,
  validityScore: 90,
  consistencyScore: 88,
  ritchieScales: { INC: 38, REC: 65, ACH: 72, POW: 35, VAR: 48, AUT: 42, STR: 72, REL: 88, VAL: 82, DEV: 70, SEC: 70, DRI: 60 },
  roleFits: {
    full_cycle: { score: 72, fit: "moderate" },
    hunter: { score: 45, fit: "weak" },
    consultative: { score: 85, fit: "strong" },
    team_lead: { score: 60, fit: "moderate" },
  },
  topMotivators: ["REL", "VAL", "ACH"],
  bottomMotivators: ["INC", "POW"],
  zimaDims: { pace: 50, autonomy: 45, collaboration: 85, risk: 38, innovation: 52, client_focus: 90, process: 78, resilience: 55, ambiguity: 42, growth: 70 },
  zimaFit: 78,
  overallScore: 76,
  overallBand: "recommended",
  primaryRole: "consultative",
  secondaryRole: "full_cycle",
});

const profileC = makeProfile({
  candidateId: "emerging_leader",
  discScales: { D: 78, I: 72, S: 50, C: 62, K: 60 },
  sjtScore: 55,
  validityScore: 62,
  consistencyScore: 58,
  ritchieScales: { INC: 65, REC: 62, ACH: 80, POW: 82, VAR: 40, AUT: 58, STR: 65, REL: 45, VAL: 50, DEV: 75, SEC: 55, DRI: 78 },
  roleFits: {
    full_cycle: { score: 68, fit: "moderate" },
    hunter: { score: 62, fit: "moderate" },
    consultative: { score: 55, fit: "weak" },
    team_lead: { score: 75, fit: "moderate" },
  },
  topMotivators: ["POW", "ACH", "DRI"],
  bottomMotivators: ["VAR", "REL"],
  zimaDims: { pace: 72, autonomy: 60, collaboration: 58, risk: 62, innovation: 42, client_focus: 55, process: 70, resilience: 68, ambiguity: 38, growth: 65 },
  zimaFit: 65,
  zimaRedFlagCount: 3,
  overallScore: 72,
  overallBand: "recommended",
  primaryRole: "full_cycle",
  secondaryRole: "team_lead",
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Run Tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function printResult(label: string, result: ReturnType<typeof composeInterviewQuestions>) {
  console.log(`\n── ${label} ──────────────────────────────────────────────`);
  console.log(`  Candidate: ${result.candidateId}`);
  console.log(`  Triggered: ${result.totalTriggered} rules → Selected: ${result.totalSelected} questions`);
  console.log(`  Themes: ${result.themes.length}`);

  for (const group of result.themes) {
    console.log(`\n  [${group.themeLabel}]`);
    for (const q of group.questions) {
      console.log(`    ${q.id} (P${q.priority}): ${q.question}`);
      if (q.probeHint) console.log(`      ↳ Hint: ${q.probeHint}`);
    }
  }
}

function run() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  INTERVIEW FOLLOW-UP QUESTIONS — Smoke Test");
  console.log("═══════════════════════════════════════════════════════════");

  // --- Profile A: Aggressive Hunter ---
  const resultA_EN = composeInterviewQuestions(profileA, "en");
  printResult("Profile A — Aggressive Hunter (EN)", resultA_EN);

  const resultA_RU = composeInterviewQuestions(profileA, "ru");
  printResult("Profile A — Aggressive Hunter (RU)", resultA_RU);

  // --- Profile B: Steady Consultant ---
  const resultB = composeInterviewQuestions(profileB, "en");
  printResult("Profile B — Steady Consultant (EN)", resultB);

  // --- Profile C: Emerging Leader ---
  const resultC = composeInterviewQuestions(profileC, "en");
  printResult("Profile C — Emerging Leader (EN)", resultC);

  // ── Verification ──────────────────────────────────────────────────

  console.log("\n\n═══════════════════════════════════════════════════════════");
  console.log("  Verification Checks");
  console.log("═══════════════════════════════════════════════════════════\n");

  let pass = 0;
  let fail = 0;

  function check(name: string, condition: boolean) {
    if (condition) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}`); }
  }

  // --- A: Aggressive Hunter ---
  check("A: 5–10 questions selected", resultA_EN.totalSelected >= 5 && resultA_EN.totalSelected <= 10);
  check("A: triggers process_discipline (low C=35)", resultA_EN.flatList.some((q) => q.theme === "process_discipline"));
  check("A: triggers integrity_coachability (low K=42)", resultA_EN.flatList.some((q) => q.theme === "integrity_coachability"));
  check("A: triggers endurance_stability (low S=38)", resultA_EN.flatList.some((q) => q.theme === "endurance_stability"));
  check("A: triggers assertiveness_rapport (high D + low I)", resultA_EN.flatList.some((q) => q.theme === "assertiveness_rapport"));
  check("A: triggers hunter_validation (primary role)", resultA_EN.flatList.some((q) => q.theme === "hunter_validation"));
  check("A: triggers validity_concern (score=58)", resultA_EN.flatList.some((q) => q.theme === "validity_concern"));
  check("A: triggers consistency_concern (score=55)", resultA_EN.flatList.some((q) => q.theme === "consistency_concern"));
  check("A: max 2 per theme enforced", resultA_EN.themes.every((t) => t.questions.length <= 2));

  // --- B: Steady Consultant ---
  check("B: 5–10 questions selected", resultB.totalSelected >= 5 && resultB.totalSelected <= 10);
  check("B: triggers consultative_validation (primary role)", resultB.flatList.some((q) => q.theme === "consultative_validation"));
  check("B: triggers motivational_alignment (low INC)", resultB.flatList.some((q) => q.theme === "motivational_alignment"));
  check("B: does NOT trigger validity (score=90)", !resultB.flatList.some((q) => q.theme === "validity_concern"));
  check("B: does NOT trigger consistency (score=88)", !resultB.flatList.some((q) => q.theme === "consistency_concern"));
  check("B: does NOT trigger environmental_fit (ambiguity=42, threshold <40)", !resultB.flatList.some((q) => q.theme === "environmental_fit"));

  // --- C: Emerging Leader ---
  check("C: 5–10 questions selected", resultC.totalSelected >= 5 && resultC.totalSelected <= 10);
  check("C: triggers leadership_potential (secondary=team_lead)", resultC.flatList.some((q) => q.theme === "leadership_potential"));
  check("C: triggers environmental_fit (red flags=3)", resultC.flatList.some((q) => q.theme === "environmental_fit"));
  check("C: triggers validity_concern (score=62)", resultC.flatList.some((q) => q.theme === "validity_concern"));
  check("C: triggers consistency_concern (score=58)", resultC.flatList.some((q) => q.theme === "consistency_concern"));

  // --- Cross-checks ---
  check("RU differs from EN (same profile A)", resultA_RU.flatList[0].question !== resultA_EN.flatList[0].question);
  check("Deterministic (same input → same output)", (() => {
    const r2 = composeInterviewQuestions(profileA, "en");
    return r2.flatList.length === resultA_EN.flatList.length
      && r2.flatList.every((q, i) => q.id === resultA_EN.flatList[i].id);
  })());

  console.log(`\n  Total: ${pass + fail} checks, ${pass} passed, ${fail} failed\n`);
}

run();
