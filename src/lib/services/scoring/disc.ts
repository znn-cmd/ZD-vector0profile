import type { BlockProgress, DISCResult, DISCDimension, AnswerValue } from "@/types";
import { discConfig } from "@/config/assessments/disc";

const DISC_PROFILE_LABELS: Record<string, string> = {
  DI: "Driver-Influencer",
  DIS: "Results-Oriented Leader",
  DC: "Analytical Driver",
  DS: "Determined Achiever",
  ID: "Inspiring Leader",
  IS: "Supportive Communicator",
  IC: "Creative Analyst",
  SD: "Steady Implementer",
  SI: "Loyal Team Player",
  SC: "Careful Supporter",
  CD: "Systematic Controller",
  CI: "Quality Communicator",
  CS: "Meticulous Planner",
};

export function scoreDISC(blockProgress: BlockProgress): DISCResult {
  const raw: Record<DISCDimension, number> = { D: 0, I: 0, S: 0, C: 0 };

  for (const question of discConfig.questions) {
    const answer = blockProgress.answers[question.id];
    if (!answer || answer.type !== "pair") continue;
    const dimensionMap = question.dimensionMap;
    if (!dimensionMap) continue;

    const mostDim = dimensionMap[answer.most];
    const leastDim = dimensionMap[answer.least];

    if (mostDim) raw[mostDim] += 2;
    if (leastDim) raw[leastDim] -= 1;
  }

  // Shift all values to positive range for normalization
  const minVal = Math.min(...Object.values(raw));
  const shifted: Record<DISCDimension, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (const dim of ["D", "I", "S", "C"] as DISCDimension[]) {
    shifted[dim] = raw[dim] - minVal + 1;
  }

  const total = shifted.D + shifted.I + shifted.S + shifted.C;
  const normalized: Record<DISCDimension, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (const dim of ["D", "I", "S", "C"] as DISCDimension[]) {
    normalized[dim] = Math.round((shifted[dim] / total) * 100);
  }

  const sorted = (["D", "I", "S", "C"] as DISCDimension[]).sort(
    (a, b) => normalized[b] - normalized[a]
  );

  const primaryType = sorted[0];
  const secondaryType = sorted[1];
  const profileKey = `${primaryType}${secondaryType}`;
  const profileLabel =
    DISC_PROFILE_LABELS[profileKey] ?? `${primaryType}-${secondaryType} Profile`;

  return {
    raw,
    normalized,
    primaryType,
    secondaryType,
    profileLabel,
  };
}

export function getDISCCompletionPercent(blockProgress: BlockProgress): number {
  const totalQuestions = discConfig.questions.length;
  const answered = Object.keys(blockProgress.answers).length;
  return Math.round((answered / totalQuestions) * 100);
}
