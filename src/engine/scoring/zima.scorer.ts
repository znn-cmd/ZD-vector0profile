// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Scorer
//
//  Pipeline:
//    1. Score 50 Likert items → 10 dimension scores
//    2. Normalize to 0–100
//    3. Compute weighted role-fit scores for 4 roles
//    4. Determine primary + secondary role
//    5. Evaluate red flags
//    6. Generate environment notes
//    7. Generate training + management recommendations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  ZIMABlockConfig,
  ZIMABlockResult,
  ZIMADimension,
  ZIMAAnswers,
  ScaleScore,
  SalesRole,
} from "../types";
import {
  computeScaleScore,
  weightedSum,
  groupByScale,
} from "../helpers";

const ALL_ROLES: SalesRole[] = ["full_cycle", "hunter", "consultative", "team_lead"];

export function scoreZIMABlock(
  answers: ZIMAAnswers,
  config: ZIMABlockConfig,
): ZIMABlockResult {

  // ── Step 1+2: Dimension scores (normalized 0–100) ──────────────
  const grouped = groupByScale(config.items);
  const dimensions = {} as Record<ZIMADimension, ScaleScore>;

  for (const dim of config.dimensions) {
    const items = grouped[dim] ?? [];
    dimensions[dim] = computeScaleScore(items, answers.likert);
  }

  // ── Step 3: Weighted role-fit scores ────────────────────────────
  const dimScoreMap: Record<string, number> = {};
  for (const dim of config.dimensions) {
    dimScoreMap[dim] = dimensions[dim].normalized;
  }

  const roleFitScores = {} as Record<SalesRole, number>;
  for (const role of ALL_ROLES) {
    roleFitScores[role] = weightedSum(dimScoreMap, config.roleWeightMatrix[role]);
  }

  // ── Step 4: Primary + secondary role ────────────────────────────
  const sortedRoles = ALL_ROLES
    .slice()
    .sort((a, b) => roleFitScores[b] - roleFitScores[a]);
  const primaryRole = sortedRoles[0];
  const secondaryRole = sortedRoles[1];

  // Overall fit = average of top 2 role-fit scores
  const fitScore = Math.round(
    (roleFitScores[primaryRole] + roleFitScores[secondaryRole]) / 2,
  );

  // ── Step 5: Red flags ──────────────────────────────────────────
  const redFlags: ZIMABlockResult["redFlags"] = [];
  for (const rule of config.redFlagRules) {
    if (rule.condition(dimScoreMap as Record<ZIMADimension, number>)) {
      redFlags.push({
        id: rule.id,
        message: rule.message,
        severity: rule.severity,
      });
    }
  }

  // ── Step 6: Environment notes ──────────────────────────────────
  const environmentNotes: string[] = [];
  for (const dim of config.dimensions) {
    const score = dimensions[dim].normalized;
    const notes = config.environmentNotes[dim];
    if (score <= 35) {
      environmentNotes.push(notes.low);
    } else if (score >= 70) {
      environmentNotes.push(notes.high);
    }
  }

  // ── Step 7: Training + management recommendations ──────────────
  const trainingRecommendations = generateTrainingRecs(dimensions, primaryRole);
  const managementRecommendations = generateManagementRecs(dimensions);

  return {
    dimensions,
    fitScore,
    primaryRole,
    secondaryRole,
    roleFitScores,
    environmentNotes,
    redFlags,
    trainingRecommendations,
    managementRecommendations,
  };
}

// ─── Training Recommendations ────────────────────────────────────────

function generateTrainingRecs(
  dims: Record<ZIMADimension, ScaleScore>,
  primaryRole: SalesRole,
): string[] {
  const recs: string[] = [];

  if (dims.process.normalized < 45) {
    recs.push("Structured CRM and pipeline management training recommended.");
  }
  if (dims.client_focus.normalized < 50) {
    recs.push("Client discovery and consultative selling methodology training.");
  }
  if (dims.resilience.normalized < 45) {
    recs.push("Resilience and mental toughness coaching — consider rejection-inoculation exercises.");
  }
  if (dims.risk.normalized < 35 && primaryRole === "hunter") {
    recs.push("Risk calibration workshops — help build comfort with ambiguity in prospecting.");
  }
  if (dims.collaboration.normalized < 40) {
    recs.push("Team selling and cross-functional collaboration skills development.");
  }
  if (dims.innovation.normalized < 35) {
    recs.push("Creative problem-solving workshops to expand solution-selling repertoire.");
  }
  if (dims.growth.normalized < 40) {
    recs.push("Assign a mentor and create a structured development plan with quarterly check-ins.");
  }

  if (recs.length === 0) {
    recs.push("No critical training gaps identified — focus on advanced skill refinement.");
  }

  return recs;
}

// ─── Management Recommendations ──────────────────────────────────────

function generateManagementRecs(
  dims: Record<ZIMADimension, ScaleScore>,
): string[] {
  const recs: string[] = [];

  if (dims.autonomy.normalized > 75) {
    recs.push("Provide outcome-based objectives rather than prescriptive task management.");
  }
  if (dims.autonomy.normalized < 35) {
    recs.push("Provide regular check-ins and clear task-level guidance during ramp-up.");
  }
  if (dims.pace.normalized > 75) {
    recs.push("Keep this person busy — idle time leads to disengagement.");
  }
  if (dims.pace.normalized < 35) {
    recs.push("Avoid overloading with simultaneous urgent requests — allow focus time.");
  }
  if (dims.collaboration.normalized > 75) {
    recs.push("Leverage for team initiatives, pod selling, and peer coaching.");
  }
  if (dims.resilience.normalized < 45) {
    recs.push("Monitor closely during first 90 days — provide extra coaching during rejection phases.");
  }
  if (dims.ambiguity.normalized < 35) {
    recs.push("Provide a detailed playbook and clear expectations from day one.");
  }
  if (dims.growth.normalized > 75) {
    recs.push("Offer clear promotion pathways and stretch assignments to maintain engagement.");
  }

  return recs;
}
