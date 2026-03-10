import type { BlockProgress, RitchieResult, RitchieMotivator } from "@/types";
import {
  ritchieConfig,
  MOTIVATORS,
  STATEMENTS_PER_MOTIVATOR,
  ritchieQuestionMotivatorMap,
} from "@/config/assessments/ritchieMartin";

export function scoreRitchieMartin(blockProgress: BlockProgress): RitchieResult {
  const motivators = {} as Record<RitchieMotivator, number>;

  for (const m of MOTIVATORS) {
    motivators[m] = 0;
  }

  for (const question of ritchieConfig.questions) {
    const answer = blockProgress.answers[question.id];
    if (!answer || answer.type !== "scale") continue;

    const motivator = ritchieQuestionMotivatorMap[question.id];
    if (motivator) {
      motivators[motivator] += answer.value;
    }
  }

  // Normalize: each motivator max = 5 * STATEMENTS_PER_MOTIVATOR = 15
  const maxPerMotivator = 5 * STATEMENTS_PER_MOTIVATOR;
  for (const m of MOTIVATORS) {
    motivators[m] = Math.round((motivators[m] / maxPerMotivator) * 100);
  }

  const sorted = [...MOTIVATORS].sort(
    (a, b) => motivators[b] - motivators[a]
  );

  return {
    motivators,
    topMotivators: sorted.slice(0, 3),
    bottomMotivators: sorted.slice(-3),
  };
}

export function getRitchieCompletionPercent(
  blockProgress: BlockProgress
): number {
  const totalQuestions = ritchieConfig.questions.length;
  const answered = Object.keys(blockProgress.answers).length;
  return Math.round((answered / totalQuestions) * 100);
}
