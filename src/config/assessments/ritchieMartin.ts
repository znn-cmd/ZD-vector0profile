import type { AssessmentBlockConfig, RitchieMotivator } from "@/types";

/**
 * Ritchie-Martin Motivation Profile
 * Based on Sheila Ritchie & Peter Martin's 12 motivation factors.
 * 36 statements rated on a 5-point Likert scale (1 = Strongly Disagree … 5 = Strongly Agree).
 * 3 statements per motivator.
 */

export const MOTIVATORS: RitchieMotivator[] = [
  "interest",
  "achievement",
  "recognition",
  "authority",
  "independence",
  "affiliation",
  "security",
  "equity",
  "working_conditions",
  "personal_growth",
  "creativity",
  "structure",
];

export const STATEMENTS_PER_MOTIVATOR = 3;

export const ritchieMotivatorLabels: Record<RitchieMotivator, string> = {
  interest: "assessment.ritchie.motivator.interest",
  achievement: "assessment.ritchie.motivator.achievement",
  recognition: "assessment.ritchie.motivator.recognition",
  authority: "assessment.ritchie.motivator.authority",
  independence: "assessment.ritchie.motivator.independence",
  affiliation: "assessment.ritchie.motivator.affiliation",
  security: "assessment.ritchie.motivator.security",
  equity: "assessment.ritchie.motivator.equity",
  working_conditions: "assessment.ritchie.motivator.working_conditions",
  personal_growth: "assessment.ritchie.motivator.personal_growth",
  creativity: "assessment.ritchie.motivator.creativity",
  structure: "assessment.ritchie.motivator.structure",
};

/** Maps question ID → motivator */
export const ritchieQuestionMotivatorMap: Record<string, RitchieMotivator> = {};

export const ritchieConfig: AssessmentBlockConfig = {
  id: "ritchie_martin",
  titleKey: "assessment.ritchie.title",
  descriptionKey: "assessment.ritchie.description",
  estimatedMinutes: 20,
  version: "1.2.0",
  questions: generateRitchieQuestions(),
};

function generateRitchieQuestions(): AssessmentBlockConfig["questions"] {
  const questions: AssessmentBlockConfig["questions"] = [];
  const likertOptions = [1, 2, 3, 4, 5].map((v) => ({
    id: String(v),
    textKey: `assessment.ritchie.scale.${v}`,
    value: v,
  }));

  for (const motivator of MOTIVATORS) {
    for (let i = 1; i <= STATEMENTS_PER_MOTIVATOR; i++) {
      const qId = `ritchie_${motivator}_${i}`;
      ritchieQuestionMotivatorMap[qId] = motivator;

      questions.push({
        id: qId,
        type: "likert_scale",
        textKey: `ritchie.${motivator}.q${i}`,
        options: likertOptions,
        motivator,
      });
    }
  }

  return questions;
}
