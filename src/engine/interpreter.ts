// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interpretation Engine
//
//  Generates human-readable insights from the three block results:
//  - Strengths
//  - Risks
//  - Interview focus questions
//  - Management style recommendations
//  - Retention risk flags
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  DISCBlockResult,
  RitchieBlockResult,
  ZIMABlockResult,
  DISCScale,
  RitchieScale,
} from "./types";

// ─── Strengths ───────────────────────────────────────────────────────

export function deriveStrengths(
  disc: DISCBlockResult,
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): string[] {
  const strengths: string[] = [];

  // DISC-based strengths
  if (disc.scales.D.normalized >= 70) {
    strengths.push("Strong assertiveness and results orientation — natural closer.");
  }
  if (disc.scales.I.normalized >= 70) {
    strengths.push("High influence and persuasion skills — builds rapport easily.");
  }
  if (disc.scales.S.normalized >= 70) {
    strengths.push("Exceptional patience and follow-through — excels at long sales cycles.");
  }
  if (disc.scales.C.normalized >= 70) {
    strengths.push("Detail-oriented and analytical — produces accurate, compelling proposals.");
  }
  if (disc.sjtScore.normalized >= 75) {
    strengths.push("Strong situational judgment — makes sound decisions in complex sales scenarios.");
  }

  // Ritchie-based strengths
  const topMot = ritchie.topMotivators;
  const motLabels: Record<RitchieScale, string> = {
    INC: "Strongly financially motivated — commission structures will drive performance.",
    REC: "Thrives on recognition — responds well to visible rewards and leaderboards.",
    ACH: "High achievement drive — self-motivated to exceed targets.",
    POW: "Natural leadership instincts — can influence deals and teams.",
    VAR: "Embraces variety — adapts well to changing markets and products.",
    AUT: "Self-directed — requires minimal supervision to produce results.",
    STR: "Values structure — thrives with clear processes and methodologies.",
    REL: "Relationship builder — creates deep client loyalty and retention.",
    VAL: "Values-driven — authentic in client interactions, builds trust.",
    DEV: "Growth-oriented — continuously improves skills and knowledge.",
    SEC: "Values stability — reliable, consistent performer.",
    DRI: "High-energy and driven — brings intensity to every interaction.",
  };
  for (const m of topMot.slice(0, 2)) {
    if (ritchie.scales[m].normalized >= 65) {
      strengths.push(motLabels[m]);
    }
  }

  // ZIMA-based strengths
  if (zima.dimensions.resilience.normalized >= 70) {
    strengths.push("High resilience — can handle rejection-heavy roles without burnout.");
  }
  if (zima.dimensions.client_focus.normalized >= 70) {
    strengths.push("Strong client orientation — prioritises client success.");
  }
  if (zima.fitScore >= 70) {
    strengths.push("Strong overall company-fit — well-aligned with the ZIMA environment.");
  }

  return strengths;
}

// ─── Risks ───────────────────────────────────────────────────────────

export function deriveRisks(
  disc: DISCBlockResult,
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): string[] {
  const risks: string[] = [];

  // DISC risks
  if (disc.band === "high_risk") {
    for (const reason of disc.bandReasons) risks.push(reason);
  }
  if (!disc.validity.isValid) {
    risks.push("DISC validity concerns: " + disc.validity.flags.join("; "));
  }
  if (!disc.consistency.isConsistent && disc.consistency.score < 60) {
    risks.push(`DISC consistency score ${disc.consistency.score}/100 — inconsistent response patterns.`);
  }
  if (disc.scales.D.normalized < 40 && disc.scales.I.normalized < 40) {
    risks.push("Low D and I — may lack assertiveness and influence for sales roles.");
  }

  // Ritchie risks
  if (!ritchie.validity.isValid) {
    risks.push("Ritchie-Martin validity concerns: " + ritchie.validity.flags.join("; "));
  }
  const bottomMot = ritchie.bottomMotivators;
  if (bottomMot.includes("DRI") && ritchie.scales.DRI.normalized < 35) {
    risks.push("Very low drive/energy — risk of underperformance and disengagement.");
  }
  if (bottomMot.includes("ACH") && ritchie.scales.ACH.normalized < 35) {
    risks.push("Low achievement motivation — may not push beyond minimum requirements.");
  }

  // ZIMA risks
  for (const rf of zima.redFlags) {
    risks.push(rf.message);
  }
  if (zima.fitScore < 45) {
    risks.push(`Low company fit score (${zima.fitScore}/100) — significant environment mismatch.`);
  }

  return risks;
}

// ─── Interview Focus Questions ───────────────────────────────────────

export function deriveInterviewQuestions(
  disc: DISCBlockResult,
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): string[] {
  const questions: string[] = [];

  // Probe DISC gaps
  if (disc.scales.D.normalized < 50) {
    questions.push(
      "Tell me about a time you had to push back on a client or internal stakeholder. What happened?",
    );
  }
  if (disc.scales.I.normalized < 50) {
    questions.push(
      "Describe how you build rapport with a sceptical prospect. Walk me through a specific example.",
    );
  }
  if (disc.sjtScore.normalized < 65) {
    questions.push(
      "A key deal is at risk because the champion left the company. Walk me through your exact next steps.",
    );
  }
  if (disc.scales.C.normalized < 50) {
    questions.push(
      "How do you ensure accuracy in proposals and pricing? Give a specific example of catching an error.",
    );
  }

  // Probe Ritchie patterns
  if (ritchie.scales.SEC.normalized > 70 && ritchie.scales.DRI.normalized < 50) {
    questions.push(
      "How do you maintain motivation when targets feel like a stretch? What drives you beyond the safety of your base?",
    );
  }
  if (ritchie.scales.AUT.normalized > 80 && ritchie.scales.REL.normalized < 40) {
    questions.push(
      "How do you handle situations where you must collaborate closely with a team to close a deal?",
    );
  }
  if (ritchie.scales.POW.normalized > 75) {
    questions.push(
      "Describe a situation where you had to follow someone else's strategy even though you disagreed. How did you handle it?",
    );
  }

  // Probe ZIMA dimensions
  if (zima.dimensions.resilience.normalized < 50) {
    questions.push(
      "Tell me about a period where you faced repeated rejection. How did you maintain your energy and pipeline?",
    );
  }
  if (zima.dimensions.process.normalized < 40) {
    questions.push(
      "How do you approach CRM updates, pipeline reporting, and administrative tasks? Be specific.",
    );
  }
  if (zima.dimensions.ambiguity.normalized < 40) {
    questions.push(
      "How would you feel about joining a team where the sales playbook is still being written?",
    );
  }

  // Always include at least one situational question
  if (questions.length === 0) {
    questions.push(
      "What is the most complex deal you have closed, and what made it complex?",
    );
  }

  return questions;
}

// ─── Management Style Recommendations ────────────────────────────────

export function deriveManagementRecs(
  disc: DISCBlockResult,
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): string[] {
  const recs: string[] = [];

  // DISC-based management style
  const primary = disc.scaleProfile.primary;
  const discMgmtMap: Record<DISCScale, string> = {
    D: "Give direct, concise feedback. Set clear targets and get out of the way.",
    I: "Provide public recognition and collaborative goal-setting. Keep energy high.",
    S: "Offer consistent support and avoid sudden changes. Build trust through reliability.",
    C: "Provide data-backed reasoning for decisions. Allow time for analysis.",
    K: "Standard management approach — no extreme preferences detected.",
  };
  recs.push(discMgmtMap[primary]);

  // Ritchie-based recs
  if (ritchie.scales.INC.normalized > 70) {
    recs.push("Ensure compensation plan is transparent and that top-end earnings are visible.");
  }
  if (ritchie.scales.REC.normalized > 70) {
    recs.push("Implement regular public recognition — leaderboards, team shout-outs, awards.");
  }
  if (ritchie.scales.DEV.normalized > 70) {
    recs.push("Provide a clear career path and ongoing learning opportunities.");
  }
  if (ritchie.scales.AUT.normalized > 75) {
    recs.push("Minimise micromanagement — set outcomes, not methods.");
  }
  if (ritchie.scales.STR.normalized > 70) {
    recs.push("Provide detailed playbooks, clear KPIs, and structured 1:1 cadence.");
  }

  // ZIMA-based recs
  recs.push(...zima.managementRecommendations);

  return recs;
}

// ─── Retention Risk Flags ────────────────────────────────────────────

export function deriveRetentionRisks(
  disc: DISCBlockResult,
  ritchie: RitchieBlockResult,
  zima: ZIMABlockResult,
): string[] {
  const flags: string[] = [];

  if (ritchie.scales.INC.normalized > 80 && ritchie.scales.VAL.normalized < 40) {
    flags.push("Purely financially motivated with low values alignment — will leave for a higher offer.");
  }
  if (ritchie.scales.VAR.normalized > 80) {
    flags.push("High variety-seeking — risk of boredom and turnover if role becomes routine.");
  }
  if (ritchie.scales.SEC.normalized < 25 && ritchie.scales.DRI.normalized > 80) {
    flags.push("High drive with very low security need — likely to pursue entrepreneurial opportunities.");
  }
  if (ritchie.scales.DEV.normalized > 80 && ritchie.scales.POW.normalized > 70) {
    flags.push("Ambitious and growth-oriented — will leave if promotion path is blocked.");
  }
  if (zima.dimensions.autonomy.normalized > 85) {
    flags.push("Extremely autonomous — may clash with structured management and leave.");
  }
  if (ritchie.scales.REL.normalized > 80) {
    flags.push("Deeply relationship-driven — risk of following a departing manager to a new company.");
  }

  return flags;
}
