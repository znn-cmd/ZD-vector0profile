// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Final Hiring Recommendation — Smoke Test / Example Outputs
//
//  Run: npx tsx src/lib/scoring/__tests__/resolveFinalRecommendation.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  FinalProfile, DISCBlockResult, RitchieBlockResult, ZIMABlockResult,
  ScaleScore, DISCScale, RitchieScale, ZIMADimension, SalesRole,
} from "@/engine/types";
import { resolveFinalRecommendation } from "../resolveFinalRecommendation";

// ─── Helpers ────────────────────────────────────────────────────────

function ss(normalized: number): ScaleScore {
  return { raw: normalized * 0.6, max: 60, normalized, itemCount: 10, answeredCount: 10 };
}

function makeProfile(o: {
  id: string;
  discScales: Record<DISCScale, number>;
  sjtScore: number;
  discBand: "strong_shortlist" | "conditional" | "high_risk";
  validityScore: number;
  consistencyScore: number;
  ritchieScales: Record<RitchieScale, number>;
  roleFits: Record<SalesRole, { score: number; fit: "strong" | "moderate" | "weak"; gaps: number }>;
  zimaDims: Record<ZIMADimension, number>;
  zimaFit: number;
  zimaRedFlags: { severity: "warning" | "critical" }[];
  overallScore: number;
  overallBand: "strong_hire" | "recommended" | "conditional" | "not_recommended";
  primaryRole: SalesRole;
  secondaryRole: SalesRole;
}): FinalProfile {
  const discScalesObj = {} as Record<DISCScale, ScaleScore>;
  for (const [k, v] of Object.entries(o.discScales)) discScalesObj[k as DISCScale] = ss(v);

  const ritchieScalesObj = {} as Record<RitchieScale, ScaleScore>;
  for (const [k, v] of Object.entries(o.ritchieScales)) ritchieScalesObj[k as RitchieScale] = ss(v);

  const zimaDimsObj = {} as Record<ZIMADimension, ScaleScore>;
  for (const [k, v] of Object.entries(o.zimaDims)) zimaDimsObj[k as ZIMADimension] = ss(v);

  const roleFitObj = {} as Record<SalesRole, { score: number; label: string; fit: "strong" | "moderate" | "weak"; criticalGaps: { scale: RitchieScale; score: number; required: number }[] }>;
  for (const [k, v] of Object.entries(o.roleFits)) {
    roleFitObj[k as SalesRole] = {
      score: v.score, label: k, fit: v.fit,
      criticalGaps: v.gaps > 0 ? [{ scale: "ACH" as RitchieScale, score: 30, required: 60 }] : [],
    };
  }

  const disc: DISCBlockResult = {
    scales: discScalesObj,
    sjtScore: ss(o.sjtScore),
    validity: { isValid: o.validityScore >= 70, flags: o.validityScore < 70 ? ["Flag"] : [], score: o.validityScore },
    consistency: { isConsistent: o.consistencyScore >= 70, violations: [], score: o.consistencyScore },
    overall: Math.round(0.20 * o.discScales.D + 0.20 * o.discScales.I + 0.15 * o.discScales.S + 0.15 * o.discScales.C + 0.10 * o.discScales.K + 0.20 * o.sjtScore),
    band: o.discBand,
    bandReasons: [],
    scaleProfile: { primary: "D", secondary: "I", label: "Test" },
  };

  const ritchie: RitchieBlockResult = {
    scales: ritchieScalesObj,
    forcedChoiceAdjustments: {} as Record<RitchieScale, number>,
    miniCaseScores: {},
    validity: { isValid: true, flags: [], score: 85 },
    consistency: { isConsistent: true, violations: [], score: 85 },
    topMotivators: ["ACH", "DRI", "INC"] as RitchieScale[],
    bottomMotivators: ["SEC", "STR"] as RitchieScale[],
    roleFit: roleFitObj,
  };

  const redFlags = o.zimaRedFlags.map((f, i) => ({ id: `rf_${i}`, message: `Flag ${i + 1}`, severity: f.severity }));

  const zima: ZIMABlockResult = {
    dimensions: zimaDimsObj,
    fitScore: o.zimaFit,
    primaryRole: o.primaryRole,
    secondaryRole: o.secondaryRole,
    roleFitScores: { full_cycle: o.zimaFit, hunter: o.zimaFit - 5, consultative: o.zimaFit - 8, team_lead: o.zimaFit - 10 },
    environmentNotes: [], redFlags, trainingRecommendations: [], managementRecommendations: [],
  };

  return {
    candidateId: o.id, assessedAt: "2026-03-10T10:00:00Z",
    disc, ritchie, zima,
    overallScore: o.overallScore, overallBand: o.overallBand,
    finalRecommendation: "", primaryRole: o.primaryRole, secondaryRole: o.secondaryRole,
    strengths: [], risks: [], interviewFocusQuestions: [],
    managementStyleRecommendations: [], retentionRiskFlags: [],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Test Profiles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// A: Clean strong candidate → Shortlist
const strongCandidate = makeProfile({
  id: "strong_001",
  discScales: { D: 78, I: 72, S: 60, C: 65, K: 72 },
  sjtScore: 80,
  discBand: "strong_shortlist",
  validityScore: 88,
  consistencyScore: 85,
  ritchieScales: { INC: 72, REC: 60, ACH: 82, POW: 65, VAR: 55, AUT: 68, STR: 58, REL: 65, VAL: 60, DEV: 70, SEC: 55, DRI: 85 },
  roleFits: {
    full_cycle: { score: 78, fit: "strong", gaps: 0 },
    hunter: { score: 82, fit: "strong", gaps: 0 },
    consultative: { score: 62, fit: "moderate", gaps: 0 },
    team_lead: { score: 60, fit: "moderate", gaps: 0 },
  },
  zimaDims: { pace: 78, autonomy: 72, collaboration: 60, risk: 68, innovation: 62, client_focus: 70, process: 58, resilience: 78, ambiguity: 65, growth: 72 },
  zimaFit: 75,
  zimaRedFlags: [],
  overallScore: 82,
  overallBand: "strong_hire",
  primaryRole: "hunter",
  secondaryRole: "full_cycle",
});

// B: Good fundamentals but a couple of flagged areas → Interview with caution
const cautionCandidate = makeProfile({
  id: "caution_002",
  discScales: { D: 72, I: 68, S: 55, C: 48, K: 60 },
  sjtScore: 65,
  discBand: "conditional",
  validityScore: 72,
  consistencyScore: 74,
  ritchieScales: { INC: 68, REC: 55, ACH: 76, POW: 60, VAR: 55, AUT: 62, STR: 48, REL: 58, VAL: 55, DEV: 60, SEC: 50, DRI: 78 },
  roleFits: {
    full_cycle: { score: 65, fit: "moderate", gaps: 0 },
    hunter: { score: 72, fit: "moderate", gaps: 0 },
    consultative: { score: 55, fit: "weak", gaps: 1 },
    team_lead: { score: 52, fit: "weak", gaps: 1 },
  },
  zimaDims: { pace: 72, autonomy: 68, collaboration: 52, risk: 65, innovation: 58, client_focus: 60, process: 48, resilience: 68, ambiguity: 55, growth: 62 },
  zimaFit: 62,
  zimaRedFlags: [],
  overallScore: 72,
  overallBand: "recommended",
  primaryRole: "hunter",
  secondaryRole: "full_cycle",
});

// C: Weak across the board but not disqualifying → Reserve pool
const reserveCandidate = makeProfile({
  id: "reserve_003",
  discScales: { D: 52, I: 48, S: 55, C: 50, K: 58 },
  sjtScore: 55,
  discBand: "conditional",
  validityScore: 72,
  consistencyScore: 70,
  ritchieScales: { INC: 48, REC: 42, ACH: 50, POW: 40, VAR: 45, AUT: 50, STR: 52, REL: 55, VAL: 55, DEV: 48, SEC: 60, DRI: 45 },
  roleFits: {
    full_cycle: { score: 48, fit: "weak", gaps: 2 },
    hunter: { score: 42, fit: "weak", gaps: 3 },
    consultative: { score: 52, fit: "weak", gaps: 1 },
    team_lead: { score: 40, fit: "weak", gaps: 3 },
  },
  zimaDims: { pace: 50, autonomy: 48, collaboration: 58, risk: 42, innovation: 45, client_focus: 55, process: 50, resilience: 48, ambiguity: 45, growth: 50 },
  zimaFit: 48,
  zimaRedFlags: [],
  overallScore: 50,
  overallBand: "conditional",
  primaryRole: "consultative",
  secondaryRole: "full_cycle",
});

// D: Hard reject — very low scores + critical flags
const rejectCandidate = makeProfile({
  id: "reject_004",
  discScales: { D: 35, I: 30, S: 40, C: 28, K: 32 },
  sjtScore: 38,
  discBand: "high_risk",
  validityScore: 42,
  consistencyScore: 45,
  ritchieScales: { INC: 35, REC: 30, ACH: 38, POW: 25, VAR: 42, AUT: 45, STR: 35, REL: 40, VAL: 45, DEV: 35, SEC: 50, DRI: 30 },
  roleFits: {
    full_cycle: { score: 35, fit: "weak", gaps: 4 },
    hunter: { score: 30, fit: "weak", gaps: 5 },
    consultative: { score: 38, fit: "weak", gaps: 3 },
    team_lead: { score: 28, fit: "weak", gaps: 5 },
  },
  zimaDims: { pace: 35, autonomy: 30, collaboration: 40, risk: 28, innovation: 32, client_focus: 38, process: 30, resilience: 28, ambiguity: 25, growth: 30 },
  zimaFit: 30,
  zimaRedFlags: [{ severity: "critical" }, { severity: "critical" }, { severity: "warning" }],
  overallScore: 35,
  overallBand: "not_recommended",
  primaryRole: "consultative",
  secondaryRole: "full_cycle",
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Run
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function printResult(label: string, r: ReturnType<typeof resolveFinalRecommendation>) {
  console.log(`\n── ${label} ──────────────────────────────────────`);
  console.log(`  Candidate:      ${r.candidateId}`);
  console.log(`  Recommendation: ${r.finalRecommendationLabel} (${r.finalRecommendation})`);
  console.log(`  Net score:      ${r.netScore}`);
  console.log(`  Gate triggered: ${r.gateTriggered ?? "none"}`);
  console.log(`  Rules matched:  ${r.audit.totalMatched} / ${r.audit.totalRulesEvaluated}`);
  console.log(`  Promote weight: +${r.audit.promoteWeight}`);
  console.log(`  Demote weight:  ${r.audit.demoteWeight}`);
  console.log(`  Reasons:`);
  for (const reason of r.reasons) {
    console.log(`    • ${reason}`);
  }
}

function run() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  FINAL HIRING RECOMMENDATION — Smoke Test");
  console.log("═══════════════════════════════════════════════════════════");

  const rA_EN = resolveFinalRecommendation(strongCandidate, "en");
  printResult("A — Strong Candidate (EN)", rA_EN);

  const rB_EN = resolveFinalRecommendation(cautionCandidate, "en");
  printResult("B — Caution Candidate (EN)", rB_EN);

  const rC_EN = resolveFinalRecommendation(reserveCandidate, "en");
  printResult("C — Reserve Candidate (EN)", rC_EN);

  const rD_EN = resolveFinalRecommendation(rejectCandidate, "en");
  printResult("D — Reject Candidate (EN)", rD_EN);

  const rA_RU = resolveFinalRecommendation(strongCandidate, "ru");
  printResult("A — Strong Candidate (RU)", rA_RU);

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

  // A: Strong → Shortlist
  check("A → Shortlist", rA_EN.finalRecommendation === "shortlist");
  check("A: no gate triggered", rA_EN.gateTriggered === null);
  check("A: positive net score", rA_EN.netScore > 0);
  check("A: has strength reasons", rA_EN.reasons.length >= 3);
  check("A: net score >= 25 (shortlist threshold)", rA_EN.netScore >= 25);

  // B: Caution → Interview with caution
  check("B → Interview with caution", rB_EN.finalRecommendation === "interview_with_caution");
  check("B: has both promote and demote reasons", rB_EN.audit.promoteWeight > 0 && rB_EN.audit.demoteWeight < 0);
  check("B: net score between -10 and 25", rB_EN.netScore >= -10 && rB_EN.netScore < 25);
  check("B: matched rules include cf_01 (low C)", rB_EN.matchedRules.some((r) => r.ruleId === "cf_01"));
  check("B: matched rules include cf_08 (conditional band)", rB_EN.matchedRules.some((r) => r.ruleId === "cf_08"));
  check("B: matched rules include ss_02 (high D)", rB_EN.matchedRules.some((r) => r.ruleId === "ss_02"));

  // C: Reserve → Reserve pool
  check("C → Reserve pool", rC_EN.finalRecommendation === "reserve_pool");
  check("C: reserve gate triggered", rC_EN.gateTriggered === "reserve_gate");
  check("C: reasons include role-fit concern", rC_EN.reasons.some((r) => r.includes("role") || r.includes("fit")));

  // D: Hard reject
  check("D → Reject", rD_EN.finalRecommendation === "reject");
  check("D: reject gate triggered", rD_EN.gateTriggered === "reject_gate");
  check("D: multiple reject reasons", rD_EN.reasons.length >= 5);
  check("D: reasons include overall < 45", rD_EN.matchedRules.some((r) => r.ruleId === "rg_01"));
  check("D: reasons include SJT < 45", rD_EN.matchedRules.some((r) => r.ruleId === "rg_03"));
  check("D: reasons include ZIMA fit < 35", rD_EN.matchedRules.some((r) => r.ruleId === "rg_05"));

  // Cross-checks
  check("RU label differs from EN", rA_RU.finalRecommendationLabel !== rA_EN.finalRecommendationLabel);
  check("RU reasons in Russian", rA_RU.reasons[0] !== rA_EN.reasons[0]);
  check("Deterministic", (() => {
    const r2 = resolveFinalRecommendation(strongCandidate, "en");
    return r2.finalRecommendation === rA_EN.finalRecommendation
      && r2.netScore === rA_EN.netScore
      && r2.matchedRules.length === rA_EN.matchedRules.length;
  })());

  console.log(`\n  Total: ${pass + fail} checks, ${pass} passed, ${fail} failed\n`);
}

run();
