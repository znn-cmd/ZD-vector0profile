import type { AssessmentBlockConfig, DISCDimension } from "@/types";

/**
 * DISC Behavioral Assessment
 * 24 question groups — each group has 4 statements.
 * Candidate selects which statement is MOST like them and which is LEAST.
 * Each statement maps to a DISC dimension.
 */
export const discConfig: AssessmentBlockConfig = {
  id: "disc",
  titleKey: "assessment.disc.title",
  descriptionKey: "assessment.disc.description",
  estimatedMinutes: 15,
  version: "2.1.0",
  questions: generateDISCQuestions(),
};

function generateDISCQuestions(): AssessmentBlockConfig["questions"] {
  const groups: {
    id: string;
    statements: { id: string; textKey: string; dimension: DISCDimension }[];
  }[] = [
    {
      id: "disc_q1",
      statements: [
        { id: "a", textKey: "disc.q1.a", dimension: "D" },
        { id: "b", textKey: "disc.q1.b", dimension: "I" },
        { id: "c", textKey: "disc.q1.c", dimension: "S" },
        { id: "d", textKey: "disc.q1.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q2",
      statements: [
        { id: "a", textKey: "disc.q2.a", dimension: "D" },
        { id: "b", textKey: "disc.q2.b", dimension: "I" },
        { id: "c", textKey: "disc.q2.c", dimension: "S" },
        { id: "d", textKey: "disc.q2.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q3",
      statements: [
        { id: "a", textKey: "disc.q3.a", dimension: "D" },
        { id: "b", textKey: "disc.q3.b", dimension: "I" },
        { id: "c", textKey: "disc.q3.c", dimension: "S" },
        { id: "d", textKey: "disc.q3.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q4",
      statements: [
        { id: "a", textKey: "disc.q4.a", dimension: "D" },
        { id: "b", textKey: "disc.q4.b", dimension: "I" },
        { id: "c", textKey: "disc.q4.c", dimension: "S" },
        { id: "d", textKey: "disc.q4.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q5",
      statements: [
        { id: "a", textKey: "disc.q5.a", dimension: "D" },
        { id: "b", textKey: "disc.q5.b", dimension: "I" },
        { id: "c", textKey: "disc.q5.c", dimension: "S" },
        { id: "d", textKey: "disc.q5.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q6",
      statements: [
        { id: "a", textKey: "disc.q6.a", dimension: "D" },
        { id: "b", textKey: "disc.q6.b", dimension: "I" },
        { id: "c", textKey: "disc.q6.c", dimension: "S" },
        { id: "d", textKey: "disc.q6.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q7",
      statements: [
        { id: "a", textKey: "disc.q7.a", dimension: "D" },
        { id: "b", textKey: "disc.q7.b", dimension: "I" },
        { id: "c", textKey: "disc.q7.c", dimension: "S" },
        { id: "d", textKey: "disc.q7.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q8",
      statements: [
        { id: "a", textKey: "disc.q8.a", dimension: "D" },
        { id: "b", textKey: "disc.q8.b", dimension: "I" },
        { id: "c", textKey: "disc.q8.c", dimension: "S" },
        { id: "d", textKey: "disc.q8.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q9",
      statements: [
        { id: "a", textKey: "disc.q9.a", dimension: "D" },
        { id: "b", textKey: "disc.q9.b", dimension: "I" },
        { id: "c", textKey: "disc.q9.c", dimension: "S" },
        { id: "d", textKey: "disc.q9.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q10",
      statements: [
        { id: "a", textKey: "disc.q10.a", dimension: "D" },
        { id: "b", textKey: "disc.q10.b", dimension: "I" },
        { id: "c", textKey: "disc.q10.c", dimension: "S" },
        { id: "d", textKey: "disc.q10.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q11",
      statements: [
        { id: "a", textKey: "disc.q11.a", dimension: "D" },
        { id: "b", textKey: "disc.q11.b", dimension: "I" },
        { id: "c", textKey: "disc.q11.c", dimension: "S" },
        { id: "d", textKey: "disc.q11.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q12",
      statements: [
        { id: "a", textKey: "disc.q12.a", dimension: "D" },
        { id: "b", textKey: "disc.q12.b", dimension: "I" },
        { id: "c", textKey: "disc.q12.c", dimension: "S" },
        { id: "d", textKey: "disc.q12.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q13",
      statements: [
        { id: "a", textKey: "disc.q13.a", dimension: "D" },
        { id: "b", textKey: "disc.q13.b", dimension: "I" },
        { id: "c", textKey: "disc.q13.c", dimension: "S" },
        { id: "d", textKey: "disc.q13.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q14",
      statements: [
        { id: "a", textKey: "disc.q14.a", dimension: "D" },
        { id: "b", textKey: "disc.q14.b", dimension: "I" },
        { id: "c", textKey: "disc.q14.c", dimension: "S" },
        { id: "d", textKey: "disc.q14.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q15",
      statements: [
        { id: "a", textKey: "disc.q15.a", dimension: "D" },
        { id: "b", textKey: "disc.q15.b", dimension: "I" },
        { id: "c", textKey: "disc.q15.c", dimension: "S" },
        { id: "d", textKey: "disc.q15.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q16",
      statements: [
        { id: "a", textKey: "disc.q16.a", dimension: "D" },
        { id: "b", textKey: "disc.q16.b", dimension: "I" },
        { id: "c", textKey: "disc.q16.c", dimension: "S" },
        { id: "d", textKey: "disc.q16.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q17",
      statements: [
        { id: "a", textKey: "disc.q17.a", dimension: "D" },
        { id: "b", textKey: "disc.q17.b", dimension: "I" },
        { id: "c", textKey: "disc.q17.c", dimension: "S" },
        { id: "d", textKey: "disc.q17.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q18",
      statements: [
        { id: "a", textKey: "disc.q18.a", dimension: "D" },
        { id: "b", textKey: "disc.q18.b", dimension: "I" },
        { id: "c", textKey: "disc.q18.c", dimension: "S" },
        { id: "d", textKey: "disc.q18.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q19",
      statements: [
        { id: "a", textKey: "disc.q19.a", dimension: "D" },
        { id: "b", textKey: "disc.q19.b", dimension: "I" },
        { id: "c", textKey: "disc.q19.c", dimension: "S" },
        { id: "d", textKey: "disc.q19.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q20",
      statements: [
        { id: "a", textKey: "disc.q20.a", dimension: "D" },
        { id: "b", textKey: "disc.q20.b", dimension: "I" },
        { id: "c", textKey: "disc.q20.c", dimension: "S" },
        { id: "d", textKey: "disc.q20.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q21",
      statements: [
        { id: "a", textKey: "disc.q21.a", dimension: "D" },
        { id: "b", textKey: "disc.q21.b", dimension: "I" },
        { id: "c", textKey: "disc.q21.c", dimension: "S" },
        { id: "d", textKey: "disc.q21.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q22",
      statements: [
        { id: "a", textKey: "disc.q22.a", dimension: "D" },
        { id: "b", textKey: "disc.q22.b", dimension: "I" },
        { id: "c", textKey: "disc.q22.c", dimension: "S" },
        { id: "d", textKey: "disc.q22.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q23",
      statements: [
        { id: "a", textKey: "disc.q23.a", dimension: "D" },
        { id: "b", textKey: "disc.q23.b", dimension: "I" },
        { id: "c", textKey: "disc.q23.c", dimension: "S" },
        { id: "d", textKey: "disc.q23.d", dimension: "C" },
      ],
    },
    {
      id: "disc_q24",
      statements: [
        { id: "a", textKey: "disc.q24.a", dimension: "D" },
        { id: "b", textKey: "disc.q24.b", dimension: "I" },
        { id: "c", textKey: "disc.q24.c", dimension: "S" },
        { id: "d", textKey: "disc.q24.d", dimension: "C" },
      ],
    },
  ];

  return groups.map((g) => ({
    id: g.id,
    type: "disc_pair" as const,
    textKey: "disc.prompt",
    options: g.statements.map((s) => ({
      id: s.id,
      textKey: s.textKey,
    })),
    dimensionMap: Object.fromEntries(
      g.statements.map((s) => [s.id, s.dimension])
    ) as Record<string, DISCDimension>,
  }));
}
