// Report generation smoke test
// Run: npx tsx src/reports/__tests__/smoke.ts
// Outputs: test_report_ru.pdf and test_report_en.pdf in project root

import { writeFileSync } from "fs";
import { generateReport } from "../generator";
import { computeFinalProfile, DISC_CONFIG, RITCHIE_CONFIG, ZIMA_CONFIG } from "../../engine";
import type { Likert6, SJTRanking, ForcedChoicePick, CaseOptionId } from "../../engine/types";
import type { ReportInput } from "../types";

// ─── Generate a realistic FinalProfile ───────────────────────────────

function buildAnswers() {
  // Strong hunter candidate
  const discLikert: Record<string, Likert6> = {};
  for (const item of DISC_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "D": base = item.reversed ? 2 : 5; break;
      case "I": base = item.reversed ? 2 : 5; break;
      case "S": base = item.reversed ? 3 : 4; break;
      case "C": base = item.reversed ? 3 : 4; break;
      case "K": base = item.reversed ? 4 : 3; break;
      default: base = 4;
    }
    discLikert[item.id] = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5)))) as Likert6;
  }

  const sjtAnswers: Record<string, SJTRanking> = {};
  for (const sjt of DISC_CONFIG.sjtCases) {
    const r = [...sjt.expertKey] as SJTRanking;
    if (Math.random() < 0.3) { [r[0], r[1]] = [r[1], r[0]]; }
    sjtAnswers[sjt.id] = r;
  }

  const ritchieLikert: Record<string, Likert6> = {};
  for (const item of RITCHIE_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "INC": base = item.reversed ? 2 : 5; break;
      case "ACH": base = item.reversed ? 2 : 5; break;
      case "DRI": base = item.reversed ? 1 : 6; break;
      case "AUT": base = item.reversed ? 2 : 5; break;
      case "POW": base = item.reversed ? 2 : 5; break;
      case "VAR": base = item.reversed ? 2 : 5; break;
      case "REL": base = item.reversed ? 4 : 3; break;
      case "SEC": base = item.reversed ? 5 : 2; break;
      default: base = 4;
    }
    ritchieLikert[item.id] = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5)))) as Likert6;
  }
  for (const vi of RITCHIE_CONFIG.validityItems) {
    ritchieLikert[vi.id] = (vi.expectedDirection === "agree" ? 4 : 3) as Likert6;
  }

  const zimaLikert: Record<string, Likert6> = {};
  for (const item of ZIMA_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "pace": case "autonomy": case "risk": case "resilience":
      case "innovation": case "client_focus": case "growth": case "ambiguity":
        base = item.reversed ? 2 : 5; break;
      default: base = item.reversed ? 3 : 4;
    }
    zimaLikert[item.id] = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5)))) as Likert6;
  }

  return {
    disc: { likert: discLikert, sjt: sjtAnswers },
    ritchie: {
      likert: ritchieLikert,
      forcedChoice: {
        fc_01: "a" as ForcedChoicePick, fc_02: "a" as ForcedChoicePick,
        fc_03: "b" as ForcedChoicePick, fc_04: "b" as ForcedChoicePick,
        fc_05: "a" as ForcedChoicePick, fc_06: "a" as ForcedChoicePick,
      },
      miniCases: {
        mc_01: "a" as CaseOptionId, mc_02: "b" as CaseOptionId,
        mc_03: "a" as CaseOptionId, mc_04: "c" as CaseOptionId,
      },
    },
    zima: { likert: zimaLikert },
  };
}

async function main() {
  console.log("=== Report Generation Smoke Test ===\n");

  const answers = buildAnswers();
  const profile = computeFinalProfile({
    candidateId: "cand_test_001",
    answers,
    discConfig: DISC_CONFIG,
    ritchieConfig: RITCHIE_CONFIG,
    zimaConfig: ZIMA_CONFIG,
  });

  console.log(`Profile: overall=${profile.overallScore} band=${profile.overallBand} role=${profile.primaryRole}`);

  // Generate Russian report
  const ruInput: ReportInput = {
    candidateName: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    candidateEmail: "ivanov@example.com",
    position: "Senior Sales Manager",
    department: "Commercial",
    assessedAt: new Date().toISOString(),
    language: "ru",
    profile,
    previousVersion: null,
  };

  console.log("\nGenerating RU report...");
  const ruReport = await generateReport(ruInput);
  console.log(`  File: ${ruReport.fileName}`);
  console.log(`  Size: ${(ruReport.pdfBuffer.length / 1024).toFixed(1)} KB`);
  console.log(`  Version: ${ruReport.version.version}`);
  writeFileSync(ruReport.fileName, ruReport.pdfBuffer);
  console.log(`  Written to: ${ruReport.fileName}`);

  // Generate English report (V2 — simulating re-generation)
  const enInput: ReportInput = {
    candidateName: "Alexei P. Ivanov",
    candidateEmail: "ivanov@example.com",
    position: "Senior Sales Manager",
    department: "Commercial",
    assessedAt: new Date().toISOString(),
    language: "en",
    profile,
    previousVersion: "V1",
  };

  console.log("\nGenerating EN report (V2)...");
  const enReport = await generateReport(enInput);
  console.log(`  File: ${enReport.fileName}`);
  console.log(`  Size: ${(enReport.pdfBuffer.length / 1024).toFixed(1)} KB`);
  console.log(`  Version: ${enReport.version.version}`);
  writeFileSync(enReport.fileName, enReport.pdfBuffer);
  console.log(`  Written to: ${enReport.fileName}`);

  // Summary card
  console.log("\n--- Web Summary Card ---");
  const card = ruReport.summaryCard;
  console.log(`  Candidate: ${card.candidateName}`);
  console.log(`  Score: ${card.overallScore}/100 (${card.overallBand})`);
  console.log(`  Role: ${card.primaryRole} / ${card.secondaryRole}`);
  console.log(`  DISC: ${card.discProfile.label} (${card.discProfile.overall}/100)`);
  console.log(`  Ritchie top: ${card.ritchieProfile.topMotivators.join(", ")}`);
  console.log(`  ZIMA fit: ${card.zimaProfile.fitScore}/100`);
  console.log(`  Strengths: ${card.strengths.length}`);
  console.log(`  Risks: ${card.risks.length}`);
  console.log(`  Report version: ${card.reportVersion}`);

  console.log("\n=== All report tests passed ===");
}

main().catch(console.error);
