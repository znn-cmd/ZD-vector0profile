import type { AssessmentBlockConfig } from "@/types";

/**
 * ZIMA Cognitive & Analytical Assessment
 * 30 multiple-choice questions across 5 categories:
 * - Logical reasoning (6 questions)
 * - Pattern recognition (6 questions)
 * - Numerical analysis (6 questions)
 * - Verbal comprehension (6 questions)
 * - Situational judgment (6 questions)
 *
 * Each correct answer = 1 point. Max score = 30.
 */

const CATEGORIES = [
  "logical_reasoning",
  "pattern_recognition",
  "numerical_analysis",
  "verbal_comprehension",
  "situational_judgment",
] as const;

export type ZIMACategory = (typeof CATEGORIES)[number];

export const ZIMA_CATEGORY_QUESTION_COUNT = 6;
export const ZIMA_TOTAL_QUESTIONS = CATEGORIES.length * ZIMA_CATEGORY_QUESTION_COUNT;

/** Maps question ID → correct option ID (used only server-side for scoring) */
export const zimaAnswerKey: Record<string, string> = {};

/** Maps question ID → category */
export const zimaCategoryMap: Record<string, ZIMACategory> = {};

export const zimaConfig: AssessmentBlockConfig = {
  id: "zima",
  titleKey: "assessment.zima.title",
  descriptionKey: "assessment.zima.description",
  estimatedMinutes: 30,
  version: "1.4.0",
  questions: generateZIMAQuestions(),
};

function generateZIMAQuestions(): AssessmentBlockConfig["questions"] {
  const questions: AssessmentBlockConfig["questions"] = [];

  for (const category of CATEGORIES) {
    for (let i = 1; i <= ZIMA_CATEGORY_QUESTION_COUNT; i++) {
      const qId = `zima_${category}_${i}`;
      const options = ["a", "b", "c", "d"].map((letter) => ({
        id: letter,
        textKey: `zima.${category}.q${i}.${letter}`,
      }));

      zimaAnswerKey[qId] = "a"; // correct answer stored separately
      zimaCategoryMap[qId] = category;

      questions.push({
        id: qId,
        type: "multiple_choice",
        textKey: `zima.${category}.q${i}.text`,
        options,
      });
    }
  }

  return questions;
}

/** Percentile lookup table based on normative sample */
export const zimaPercentileTable: [number, number][] = [
  [30, 99],
  [29, 97],
  [28, 95],
  [27, 93],
  [26, 90],
  [25, 87],
  [24, 83],
  [23, 79],
  [22, 74],
  [21, 69],
  [20, 63],
  [19, 57],
  [18, 51],
  [17, 45],
  [16, 39],
  [15, 33],
  [14, 27],
  [13, 22],
  [12, 17],
  [11, 13],
  [10, 10],
  [9, 7],
  [8, 5],
  [7, 3],
  [6, 2],
  [5, 1],
];
