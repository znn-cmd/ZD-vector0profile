// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Engine Example & Smoke Test
//
//  This file demonstrates the full pipeline with sample data.
//  Run: npx tsx src/engine/__tests__/engine.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  computeFinalProfile,
  DISC_CONFIG,
  RITCHIE_CONFIG,
  ZIMA_CONFIG,
  scoreDISCBlock,
  scoreRitchieBlock,
  scoreZIMABlock,
} from "../index";
import type {
  Likert6,
  SJTRanking,
  ForcedChoicePick,
  CaseOptionId,
  DISCAnswers,
  RitchieAnswers,
  ZIMAAnswers,
  AllBlockAnswers,
} from "../types";

// ─── Helpers to generate sample answers ──────────────────────────────

/** Generates answers for all items with a base tendency + random variance */
function generateLikertAnswers(
  items: { id: string }[],
  baseTendency: number,
  variance: number = 1,
): Record<string, Likert6> {
  const answers: Record<string, Likert6> = {};
  for (const item of items) {
    const val = Math.max(1, Math.min(6,
      Math.round(baseTendency + (Math.random() - 0.5) * 2 * variance),
    ));
    answers[item.id] = val as Likert6;
  }
  return answers;
}

// ─── Scenario 1: Strong Hunter Candidate ─────────────────────────────

function buildStrongHunterAnswers(): AllBlockAnswers {
  // DISC: High D, High I, Moderate S, Moderate C, Moderate K
  const discLikert: Record<string, Likert6> = {};
  for (const item of DISC_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "D": base = item.reversed ? 2 : 5; break;  // High D
      case "I": base = item.reversed ? 2 : 5; break;  // High I
      case "S": base = item.reversed ? 3 : 4; break;  // Moderate S
      case "C": base = item.reversed ? 3 : 4; break;  // Moderate C
      case "K": base = item.reversed ? 4 : 3; break;  // Moderate K (not faking)
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    discLikert[item.id] = val as Likert6;
  }

  // SJT: Good judgment (close to expert keys)
  const sjtAnswers: Record<string, SJTRanking> = {};
  for (const sjt of DISC_CONFIG.sjtCases) {
    // Slight deviation from expert key for realism
    const ranking = [...sjt.expertKey] as SJTRanking;
    // Swap two adjacent ranks ~30% of the time
    if (Math.random() < 0.3 && ranking.length >= 2) {
      const idx = Math.floor(Math.random() * 3);
      [ranking[idx], ranking[idx + 1]] = [ranking[idx + 1], ranking[idx]];
    }
    sjtAnswers[sjt.id] = ranking;
  }

  // Ritchie: High INC, ACH, DRI, AUT — classic hunter profile
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
      case "REC": base = item.reversed ? 3 : 4; break;
      case "REL": base = item.reversed ? 4 : 3; break;   // Lower for hunter
      case "SEC": base = item.reversed ? 5 : 2; break;   // Low security need
      case "STR": base = item.reversed ? 4 : 3; break;   // Lower structure
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    ritchieLikert[item.id] = val as Likert6;
  }

  // Add validity item answers (realistic)
  for (const vi of RITCHIE_CONFIG.validityItems) {
    ritchieLikert[vi.id] = (vi.expectedDirection === "agree" ? 4 : 3) as Likert6;
  }

  const forcedChoice: Record<string, ForcedChoicePick> = {
    fc_01: "a", // Money over meaning
    fc_02: "a", // Autonomy over structure
    fc_03: "b", // Private achievement over public award
    fc_04: "b", // IC over manager (not pure hunter, but realistic)
    fc_05: "a", // Variety over relationships
    fc_06: "a", // Startup risk over security
  };

  const miniCases: Record<string, CaseOptionId> = {
    mc_01: "a", // Take the money (hunter)
    mc_02: "b", // Take the challenging project
    mc_03: "a", // Start looking elsewhere (driven)
    mc_04: "c", // Explore new industry (variety)
  };

  // ZIMA: Fast-paced, autonomous, risk-tolerant, resilient
  const zimaLikert: Record<string, Likert6> = {};
  for (const item of ZIMA_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "pace": base = item.reversed ? 2 : 5; break;
      case "autonomy": base = item.reversed ? 2 : 5; break;
      case "risk": base = item.reversed ? 2 : 5; break;
      case "resilience": base = item.reversed ? 2 : 5; break;
      case "innovation": base = item.reversed ? 2 : 5; break;
      case "client_focus": base = item.reversed ? 2 : 5; break;
      case "growth": base = item.reversed ? 2 : 5; break;
      case "collaboration": base = item.reversed ? 4 : 3; break;  // Moderate
      case "process": base = item.reversed ? 4 : 3; break;        // Moderate
      case "ambiguity": base = item.reversed ? 2 : 5; break;
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    zimaLikert[item.id] = val as Likert6;
  }

  return {
    disc: { likert: discLikert, sjt: sjtAnswers },
    ritchie: { likert: ritchieLikert, forcedChoice, miniCases },
    zima: { likert: zimaLikert },
  };
}

// ─── Scenario 2: Cautious Consultative Seller ────────────────────────

function buildConsultativeAnswers(): AllBlockAnswers {
  const discLikert: Record<string, Likert6> = {};
  for (const item of DISC_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "D": base = item.reversed ? 4 : 3; break;  // Lower D
      case "I": base = item.reversed ? 3 : 4; break;  // Moderate I
      case "S": base = item.reversed ? 2 : 5; break;  // High S
      case "C": base = item.reversed ? 2 : 5; break;  // High C
      case "K": base = item.reversed ? 3 : 4; break;  // Normal K
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    discLikert[item.id] = val as Likert6;
  }

  const sjtAnswers: Record<string, SJTRanking> = {};
  for (const sjt of DISC_CONFIG.sjtCases) {
    sjtAnswers[sjt.id] = sjt.expertKey; // Perfect SJT
  }

  const ritchieLikert: Record<string, Likert6> = {};
  for (const item of RITCHIE_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "REL": base = item.reversed ? 1 : 6; break;   // Very high relationships
      case "VAL": base = item.reversed ? 1 : 6; break;   // Very high values
      case "DEV": base = item.reversed ? 2 : 5; break;   // High development
      case "ACH": base = item.reversed ? 2 : 5; break;
      case "STR": base = item.reversed ? 3 : 4; break;   // Moderate structure
      case "INC": base = item.reversed ? 4 : 3; break;   // Lower money focus
      case "POW": base = item.reversed ? 4 : 3; break;   // Lower power
      case "DRI": base = item.reversed ? 3 : 4; break;
      case "SEC": base = item.reversed ? 3 : 4; break;   // Moderate security
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    ritchieLikert[item.id] = val as Likert6;
  }
  for (const vi of RITCHIE_CONFIG.validityItems) {
    ritchieLikert[vi.id] = (vi.expectedDirection === "agree" ? 5 : 2) as Likert6;
  }

  const forcedChoice: Record<string, ForcedChoicePick> = {
    fc_01: "b", // Meaning over money
    fc_02: "b", // Structure over autonomy
    fc_03: "b", // Private achievement
    fc_04: "b", // Development over power
    fc_05: "b", // Relationships over variety
    fc_06: "b", // Security over startup risk
  };

  const miniCases: Record<string, CaseOptionId> = {
    mc_01: "b", // Values alignment
    mc_02: "d", // Team + challenge
    mc_03: "b", // Ask for plan
    mc_04: "a", // Relationship-based move
  };

  const zimaLikert: Record<string, Likert6> = {};
  for (const item of ZIMA_CONFIG.items) {
    let base: number;
    switch (item.scale) {
      case "client_focus": base = item.reversed ? 1 : 6; break;
      case "process": base = item.reversed ? 2 : 5; break;
      case "collaboration": base = item.reversed ? 2 : 5; break;
      case "resilience": base = item.reversed ? 3 : 4; break;
      case "growth": base = item.reversed ? 2 : 5; break;
      case "pace": base = item.reversed ? 4 : 3; break;       // Slower pace
      case "risk": base = item.reversed ? 4 : 3; break;       // Lower risk
      case "autonomy": base = item.reversed ? 3 : 4; break;
      case "ambiguity": base = item.reversed ? 4 : 3; break;  // Needs clarity
      case "innovation": base = item.reversed ? 3 : 4; break;
      default: base = 4;
    }
    const val = Math.max(1, Math.min(6, base + Math.round((Math.random() - 0.5))));
    zimaLikert[item.id] = val as Likert6;
  }

  return {
    disc: { likert: discLikert, sjt: sjtAnswers },
    ritchie: { likert: ritchieLikert, forcedChoice, miniCases },
    zima: { likert: zimaLikert },
  };
}

// ─── Run Examples ────────────────────────────────────────────────────

function printProfile(label: string, answers: AllBlockAnswers) {
  console.log("\n" + "═".repeat(72));
  console.log(`  ${label}`);
  console.log("═".repeat(72));

  const profile = computeFinalProfile({
    candidateId: label.toLowerCase().replace(/ /g, "_"),
    answers,
    discConfig: DISC_CONFIG,
    ritchieConfig: RITCHIE_CONFIG,
    zimaConfig: ZIMA_CONFIG,
  });

  // ── Overall ──────────────────────────────────────────────────
  console.log(`\n  Overall Score:  ${profile.overallScore}/100`);
  console.log(`  Overall Band:   ${profile.overallBand.toUpperCase()}`);
  console.log(`  Primary Role:   ${profile.primaryRole}`);
  console.log(`  Secondary Role: ${profile.secondaryRole}`);

  // ── DISC ─────────────────────────────────────────────────────
  console.log("\n  ── DISC Block ──");
  console.log(`  Overall: ${profile.disc.overall}/100  Band: ${profile.disc.band}`);
  console.log(`  Profile: ${profile.disc.scaleProfile.label}`);
  console.log(`  Scales:  D=${profile.disc.scales.D.normalized} I=${profile.disc.scales.I.normalized} S=${profile.disc.scales.S.normalized} C=${profile.disc.scales.C.normalized} K=${profile.disc.scales.K.normalized}`);
  console.log(`  SJT:     ${profile.disc.sjtScore.normalized}/100`);
  console.log(`  Valid:   ${profile.disc.validity.isValid}  Consistent: ${profile.disc.consistency.isConsistent}`);
  if (profile.disc.bandReasons.length > 0) {
    console.log(`  Reasons: ${profile.disc.bandReasons.join("; ")}`);
  }

  // ── Ritchie ──────────────────────────────────────────────────
  console.log("\n  ── Ritchie–Martin Block ──");
  const scales = profile.ritchie.scales;
  const scaleStr = Object.entries(scales)
    .map(([k, v]) => `${k}=${v.normalized}`)
    .join("  ");
  console.log(`  Scales: ${scaleStr}`);
  console.log(`  Top Motivators:    ${profile.ritchie.topMotivators.join(", ")}`);
  console.log(`  Bottom Motivators: ${profile.ritchie.bottomMotivators.join(", ")}`);
  console.log(`  Role Fit:`);
  for (const [role, fit] of Object.entries(profile.ritchie.roleFit)) {
    console.log(`    ${role}: ${fit.score}/100 (${fit.fit})${fit.criticalGaps.length > 0 ? ` — gaps: ${fit.criticalGaps.map(g => `${g.scale}<${g.required}`).join(", ")}` : ""}`);
  }

  // ── ZIMA ─────────────────────────────────────────────────────
  console.log("\n  ── ZIMA Block ──");
  console.log(`  Fit Score: ${profile.zima.fitScore}/100`);
  console.log(`  Primary Role: ${profile.zima.primaryRole}  Secondary: ${profile.zima.secondaryRole}`);
  const dimStr = Object.entries(profile.zima.dimensions)
    .map(([k, v]) => `${k}=${v.normalized}`)
    .join("  ");
  console.log(`  Dimensions: ${dimStr}`);
  if (profile.zima.redFlags.length > 0) {
    console.log(`  Red Flags:`);
    for (const rf of profile.zima.redFlags) {
      console.log(`    [${rf.severity}] ${rf.message}`);
    }
  }

  // ── Interpretation ───────────────────────────────────────────
  console.log("\n  ── Strengths ──");
  for (const s of profile.strengths) console.log(`    + ${s}`);

  console.log("\n  ── Risks ──");
  for (const r of profile.risks) console.log(`    ! ${r}`);

  console.log("\n  ── Interview Focus Questions ──");
  for (const q of profile.interviewFocusQuestions) console.log(`    ? ${q}`);

  console.log("\n  ── Management Recommendations ──");
  for (const m of profile.managementStyleRecommendations) console.log(`    > ${m}`);

  console.log("\n  ── Retention Risk Flags ──");
  for (const f of profile.retentionRiskFlags) console.log(`    ⚠ ${f}`);

  console.log(`\n  ── Final Recommendation ──`);
  console.log(`  ${profile.finalRecommendation}`);

  return profile;
}

// ─── Execute ─────────────────────────────────────────────────────────

console.log("ZIMA Dubai Vector Profile — Assessment Engine Demo\n");
console.log("Generating sample candidate profiles...");

const hunterProfile = printProfile("Scenario 1: Strong Hunter Candidate", buildStrongHunterAnswers());
const consultProfile = printProfile("Scenario 2: Consultative Seller", buildConsultativeAnswers());

console.log("\n\n" + "═".repeat(72));
console.log("  JSON Output Sample (Scenario 1 — abridged)");
console.log("═".repeat(72));

const abridged = {
  candidateId: hunterProfile.candidateId,
  overallScore: hunterProfile.overallScore,
  overallBand: hunterProfile.overallBand,
  primaryRole: hunterProfile.primaryRole,
  secondaryRole: hunterProfile.secondaryRole,
  disc: {
    overall: hunterProfile.disc.overall,
    band: hunterProfile.disc.band,
    profile: hunterProfile.disc.scaleProfile,
    scales: Object.fromEntries(
      Object.entries(hunterProfile.disc.scales).map(([k, v]) => [k, v.normalized]),
    ),
    sjt: hunterProfile.disc.sjtScore.normalized,
  },
  ritchie: {
    topMotivators: hunterProfile.ritchie.topMotivators,
    bottomMotivators: hunterProfile.ritchie.bottomMotivators,
    scales: Object.fromEntries(
      Object.entries(hunterProfile.ritchie.scales).map(([k, v]) => [k, v.normalized]),
    ),
    bestRoleFit: Object.entries(hunterProfile.ritchie.roleFit)
      .sort((a, b) => b[1].score - a[1].score)[0],
  },
  zima: {
    fitScore: hunterProfile.zima.fitScore,
    primaryRole: hunterProfile.zima.primaryRole,
    redFlagCount: hunterProfile.zima.redFlags.length,
  },
  strengths: hunterProfile.strengths,
  risks: hunterProfile.risks,
  finalRecommendation: hunterProfile.finalRecommendation,
};

console.log(JSON.stringify(abridged, null, 2));
