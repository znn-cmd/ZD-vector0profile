import type { BlockProgress, ZIMAResult } from "@/types";
import {
  zimaConfig,
  zimaAnswerKey,
  zimaCategoryMap,
  zimaPercentileTable,
  type ZIMACategory,
} from "@/config/assessments/zima";

export function scoreZIMA(blockProgress: BlockProgress): ZIMAResult {
  const categories: Record<string, number> = {};
  let totalScore = 0;

  for (const question of zimaConfig.questions) {
    const answer = blockProgress.answers[question.id];
    if (!answer || answer.type !== "single") continue;

    const isCorrect = answer.value === zimaAnswerKey[question.id];
    const category = zimaCategoryMap[question.id];

    if (!categories[category]) categories[category] = 0;
    if (isCorrect) {
      categories[category]++;
      totalScore++;
    }
  }

  const percentile = lookupPercentile(totalScore);
  const level = getLevel(percentile);

  return {
    categories,
    totalScore,
    percentile,
    level,
  };
}

function lookupPercentile(score: number): number {
  for (const [threshold, pct] of zimaPercentileTable) {
    if (score >= threshold) return pct;
  }
  return 1;
}

function getLevel(percentile: number): ZIMAResult["level"] {
  if (percentile >= 80) return "high";
  if (percentile >= 60) return "above_average";
  if (percentile >= 30) return "average";
  return "low";
}

export function getZIMACompletionPercent(blockProgress: BlockProgress): number {
  const totalQuestions = zimaConfig.questions.length;
  const answered = Object.keys(blockProgress.answers).length;
  return Math.round((answered / totalQuestions) * 100);
}
