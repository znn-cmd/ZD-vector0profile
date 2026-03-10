// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Compare Mode — Smoke Test / Example Outputs
//
//  Run: npx tsx src/lib/reporting/__tests__/composeCompareSummary.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { WebSummaryCard } from "@/reports/types";
import type { OverallBand, SalesRole, DISCScale, RitchieScale, ZIMADimension } from "@/engine/types";
import { composeCompareSummary } from "../composeCompareSummary";

// ─── Helper: Stub Card Factory ──────────────────────────────────────

function makeCard(overrides: Partial<WebSummaryCard> & { candidateId: string; candidateName: string }): WebSummaryCard {
  return {
    position: "Sales Executive",
    assessedAt: "2026-03-10T10:00:00Z",
    overallScore: 72,
    overallBand: "recommended" as OverallBand,
    primaryRole: "full_cycle" as SalesRole,
    secondaryRole: "consultative" as SalesRole,
    discProfile: {
      primary: "D" as DISCScale,
      secondary: "I" as DISCScale,
      label: "Driver-Influencer",
      overall: 72,
      sjtScore: 70,
      scales: { D: 75, I: 70, S: 55, C: 60, K: 65 },
    },
    ritchieProfile: {
      topMotivators: ["ACH", "INC", "DRI"] as RitchieScale[],
      bottomMotivators: ["SEC", "STR"] as RitchieScale[],
      bestRoleFit: { role: "full_cycle" as SalesRole, score: 72, fit: "moderate" },
      scales: { INC: 70, REC: 55, ACH: 75, POW: 60, VAR: 50, AUT: 65, STR: 45, REL: 60, VAL: 55, DEV: 65, SEC: 40, DRI: 78 },
    },
    zimaProfile: {
      fitScore: 70,
      primaryRole: "full_cycle" as SalesRole,
      redFlagCount: 0,
      dimensions: {
        pace: 72, autonomy: 65, collaboration: 60, risk: 55, innovation: 50,
        client_focus: 70, process: 55, resilience: 68, ambiguity: 60, growth: 65,
      } as Record<ZIMADimension, number>,
    },
    strengths: ["Strong closing drive", "High achievement motivation", "Good situational judgment"],
    risks: ["Process discipline may require reinforcement"],
    interviewQuestions: ["Tell me about a deal you lost and what you learned."],
    managementRecs: ["Give autonomy with milestone check-ins"],
    retentionFlags: ["Monitor if targets stagnate — needs continuous challenge"],
    recommendation: "RECOMMENDED. Overall score 72/100.",
    reportVersion: "V1",
    ...overrides,
  };
}

// ─── 3 Test Candidates ──────────────────────────────────────────────

const candidateA = makeCard({
  candidateId: "cand_001",
  candidateName: "Andrey Volkov",
  overallScore: 82,
  overallBand: "strong_hire",
  primaryRole: "hunter",
  secondaryRole: "full_cycle",
  discProfile: {
    primary: "D", secondary: "I", label: "Dominant Influencer",
    overall: 84, sjtScore: 78,
    scales: { D: 88, I: 75, S: 45, C: 50, K: 70 },
  },
  ritchieProfile: {
    topMotivators: ["INC", "DRI", "ACH"],
    bottomMotivators: ["SEC", "STR"],
    bestRoleFit: { role: "hunter", score: 85, fit: "strong" },
    scales: { INC: 88, REC: 60, ACH: 82, POW: 72, VAR: 68, AUT: 75, STR: 35, REL: 50, VAL: 55, DEV: 60, SEC: 28, DRI: 90 },
  },
  zimaProfile: {
    fitScore: 78,
    primaryRole: "hunter",
    redFlagCount: 0,
    dimensions: { pace: 85, autonomy: 80, collaboration: 45, risk: 78, innovation: 65, client_focus: 60, process: 38, resilience: 80, ambiguity: 72, growth: 70 },
  },
  strengths: ["Exceptional closing energy", "High risk tolerance", "Natural hunter instinct", "Strong drive"],
  risks: ["Weak process discipline", "Low security motivation — may leave for better comp"],
  retentionFlags: ["Very low SEC — flight risk if comp isn't top-of-market"],
});

const candidateB = makeCard({
  candidateId: "cand_002",
  candidateName: "Ekaterina Sobol",
  overallScore: 76,
  overallBand: "recommended",
  primaryRole: "consultative",
  secondaryRole: "full_cycle",
  discProfile: {
    primary: "I", secondary: "S", label: "Influencer-Steady",
    overall: 74, sjtScore: 80,
    scales: { D: 55, I: 82, S: 75, C: 68, K: 72 },
  },
  ritchieProfile: {
    topMotivators: ["REL", "ACH", "VAL"],
    bottomMotivators: ["INC", "POW"],
    bestRoleFit: { role: "consultative", score: 80, fit: "strong" },
    scales: { INC: 42, REC: 65, ACH: 78, POW: 38, VAR: 55, AUT: 50, STR: 70, REL: 85, VAL: 80, DEV: 72, SEC: 65, DRI: 68 },
  },
  zimaProfile: {
    fitScore: 75,
    primaryRole: "consultative",
    redFlagCount: 0,
    dimensions: { pace: 55, autonomy: 48, collaboration: 82, risk: 42, innovation: 55, client_focus: 88, process: 75, resilience: 62, ambiguity: 50, growth: 70 },
  },
  strengths: ["Exceptional client rapport", "Strong values alignment", "High SJT — good real-world judgment", "Good CRM discipline"],
  risks: ["Lower pace — may underperform in fast-turnaround roles"],
});

const candidateC = makeCard({
  candidateId: "cand_003",
  candidateName: "Dmitry Khasanov",
  overallScore: 74,
  overallBand: "recommended",
  primaryRole: "full_cycle",
  secondaryRole: "team_lead",
  discProfile: {
    primary: "D", secondary: "C", label: "Dominant-Compliant",
    overall: 76, sjtScore: 52,
    scales: { D: 80, I: 60, S: 58, C: 78, K: 62 },
  },
  ritchieProfile: {
    topMotivators: ["POW", "ACH", "STR"],
    bottomMotivators: ["VAR", "REL"],
    bestRoleFit: { role: "team_lead", score: 72, fit: "moderate" },
    scales: { INC: 65, REC: 58, ACH: 80, POW: 82, VAR: 35, AUT: 60, STR: 78, REL: 38, VAL: 50, DEV: 55, SEC: 70, DRI: 72 },
  },
  zimaProfile: {
    fitScore: 68,
    primaryRole: "full_cycle",
    redFlagCount: 2,
    dimensions: { pace: 70, autonomy: 62, collaboration: 55, risk: 60, innovation: 40, client_focus: 58, process: 80, resilience: 72, ambiguity: 42, growth: 55 },
  },
  strengths: ["Strong process discipline", "High power motivation — natural authority", "Good compliance and structure"],
  risks: ["Low SJT — real-world scenario judgment needs validation", "Low relationship orientation", "Red flags on ZIMA environment fit"],
  retentionFlags: ["Low variety need — may plateau and disengage if role becomes repetitive"],
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Run Tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function run() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  COMPARE MODE — Smoke Test");
  console.log("═══════════════════════════════════════════════════════════\n");

  // --- English ---
  const summaryEN = composeCompareSummary([candidateA, candidateB, candidateC], "en");

  console.log("── Ranking (EN) ───────────────────────────────────────────");
  for (const r of summaryEN.ranking) {
    console.log(`  #${r.rank}  ${r.name} — ${r.overallScore}/100  [${r.bandLabel}]  Role: ${r.primaryRole}`);
  }

  console.log("\n── Archetype Insights (EN) ────────────────────────────────");
  for (const a of summaryEN.archetypes) {
    const q = a.qualified ? "✓" : "—";
    console.log(`  ${q} ${a.label}: ${a.matchedCandidateName} (${a.compositeScore})${a.runnerUpName ? `  Runner-up: ${a.runnerUpName} (${a.runnerUpScore})` : ""}`);
  }

  console.log("\n── Dimension Leaders (EN, top 10 by spread) ───────────────");
  const topSpreads = summaryEN.dimensionLeaders
    .slice()
    .sort((a, b) => b.spread - a.spread)
    .slice(0, 10);
  for (const d of topSpreads) {
    const risk = d.riskName ? `  Risk: ${d.riskName} (${d.riskScore})` : "";
    console.log(`  ${d.label}: Leader = ${d.leaderName} (${d.leaderScore}), Spread = ${d.spread}${risk}`);
  }

  console.log("\n── Caution Notes (EN) ─────────────────────────────────────");
  if (summaryEN.cautions.length === 0) {
    console.log("  No cautions triggered.");
  } else {
    for (const c of summaryEN.cautions) {
      const vals = c.triggeringValues.map((v) => `${v.dimension}: ${v.value}`).join(", ");
      console.log(`  ⚠ ${c.candidateName} (${c.overallScore}/100): ${c.message}`);
      console.log(`    Triggering: ${vals}`);
    }
  }

  console.log("\n── Recommendation Matrix (EN) ─────────────────────────────");
  for (const r of summaryEN.recommendationMatrix) {
    console.log(`  ${r.name}  ${r.overallScore}/100  [${r.bandLabel}]  ${r.roleLabel}  →  ${r.verdictLabel}  (risks: ${r.riskCount}, cautions: ${r.cautionCount}, flags: ${r.redFlagCount})`);
  }

  // --- Russian ---
  console.log("\n\n── Ranking (RU) ───────────────────────────────────────────");
  const summaryRU = composeCompareSummary([candidateA, candidateB, candidateC], "ru");
  for (const r of summaryRU.ranking) {
    console.log(`  #${r.rank}  ${r.name} — ${r.overallScore}/100  [${r.bandLabel}]`);
  }

  console.log("\n── Archetype Insights (RU) ────────────────────────────────");
  for (const a of summaryRU.archetypes) {
    const q = a.qualified ? "✓" : "—";
    console.log(`  ${q} ${a.label}: ${a.matchedCandidateName} (${a.compositeScore})`);
  }

  console.log("\n── Caution Notes (RU) ─────────────────────────────────────");
  for (const c of summaryRU.cautions) {
    const vals = c.triggeringValues.map((v) => `${v.dimension}: ${v.value}`).join(", ");
    console.log(`  ⚠ ${c.candidateName}: ${c.message}`);
    console.log(`    ${vals}`);
  }

  // --- Verification ---
  console.log("\n\n═══════════════════════════════════════════════════════════");
  console.log("  Verification Checks");
  console.log("═══════════════════════════════════════════════════════════\n");

  let pass = 0;
  let fail = 0;

  function check(name: string, condition: boolean) {
    if (condition) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.log(`  ✗ ${name}`); }
  }

  check("Ranking has 3 entries", summaryEN.ranking.length === 3);
  check("Andrey Volkov is #1 (highest score + strong_hire)", summaryEN.ranking[0].name === "Andrey Volkov");
  check("Dimension leaders populated", summaryEN.dimensionLeaders.length > 30);
  check("Archetypes populated (10 rules)", summaryEN.archetypes.length === 10);

  const hunterArchetype = summaryEN.archetypes.find((a) => a.archetypeId === "best_hunter_fit");
  check("Best Hunter Fit → Andrey Volkov", hunterArchetype?.matchedCandidateName === "Andrey Volkov");

  const consultArchetype = summaryEN.archetypes.find((a) => a.archetypeId === "best_consultative_fit");
  check("Best Consultative Fit → Ekaterina Sobol", consultArchetype?.matchedCandidateName === "Ekaterina Sobol");

  const crmArchetype = summaryEN.archetypes.find((a) => a.archetypeId === "strongest_structure_crm_discipline");
  check("Best CRM Discipline → Dmitry Khasanov", crmArchetype?.matchedCandidateName === "Dmitry Khasanov");

  const retentionArchetype = summaryEN.archetypes.find((a) => a.archetypeId === "highest_retention_risk");
  check("Highest Retention Risk → Dmitry Khasanov (lowest composite SEC+VAR+AUT)", retentionArchetype?.matchedCandidateName === "Dmitry Khasanov");

  check("Cautions generated", summaryEN.cautions.length > 0);

  const dmCautions = summaryEN.cautions.filter((c) => c.candidateId === "cand_003");
  check("Dmitry triggers cautions (SJT + red flags)", dmCautions.length >= 1);

  const andCautions = summaryEN.cautions.filter((c) => c.candidateId === "cand_001");
  check("Andrey triggers retention caution (low SEC)", andCautions.some((c) => c.cautionId === "high_overall_weak_retention"));

  check("Recommendation matrix has 3 entries", summaryEN.recommendationMatrix.length === 3);

  const dmVerdict = summaryEN.recommendationMatrix.find((r) => r.candidateId === "cand_003");
  check("Dmitry verdict reflects cautions", dmVerdict?.verdict === "proceed_with_caution" || dmVerdict?.verdict === "review_required");

  check("RU summary differs from EN (labels)", summaryRU.ranking[0].bandLabel !== summaryEN.ranking[0].bandLabel);
  check("Deterministic (same input → same output)", (() => {
    const s2 = composeCompareSummary([candidateA, candidateB, candidateC], "en");
    return s2.ranking[0].candidateId === summaryEN.ranking[0].candidateId
      && s2.archetypes.length === summaryEN.archetypes.length
      && s2.cautions.length === summaryEN.cautions.length;
  })());

  console.log(`\n  Total: ${pass + fail} checks, ${pass} passed, ${fail} failed\n`);
}

run();
