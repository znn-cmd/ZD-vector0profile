import type { AssessmentBlockConfig, AssessmentBlockId } from "@/types";
import { DISC_FULL_CONFIG } from "./disc/index";
import { ZIMA_FULL_CONFIG } from "./zima/index";
import { RITCHIE_FULL_CONFIG } from "./ritchieMartin/index";

function likert6Options(): AssessmentBlockConfig["questions"][number]["options"] {
  return [1, 2, 3, 4, 5, 6].map((v) => ({
    id: String(v),
    textKey: `assessment.likert6.${v}`,
    value: v,
  }));
}

export const discConfig: AssessmentBlockConfig = {
  id: "disc",
  titleKey: "assessment.disc.title",
  descriptionKey: "assessment.disc.description",
  estimatedMinutes: 25,
  version: "full_v1",
  questions: [
    ...DISC_FULL_CONFIG.items.map((it) => ({
      id: it.id,
      type: "likert_scale" as const,
      textKey: `content.disc.likert.${it.id}`,
      options: likert6Options(),
    })),
    ...DISC_FULL_CONFIG.sjtCases.map((c) => ({
      id: c.id,
      type: "ranking" as const,
      textKey: `content.disc.sjt.${c.id}.scenario`,
      options: c.options.map((_, idx) => ({ id: String(idx), textKey: `content.disc.sjt.${c.id}.opt${idx}` })),
    })),
  ],
};

export const zimaConfig: AssessmentBlockConfig = {
  id: "zima",
  titleKey: "assessment.zima.title",
  descriptionKey: "assessment.zima.description",
  estimatedMinutes: 20,
  version: "full_v1",
  questions: ZIMA_FULL_CONFIG.items.map((it) => ({
    id: it.id,
    type: "likert_scale" as const,
    textKey: `content.zima.${it.id}`,
    options: likert6Options(),
  })),
};

export const ritchieConfig: AssessmentBlockConfig = {
  id: "ritchie_martin",
  titleKey: "assessment.ritchie.title",
  descriptionKey: "assessment.ritchie.description",
  estimatedMinutes: 25,
  version: "full_v1",
  questions: [
    ...RITCHIE_FULL_CONFIG.items.map((it) => ({
      id: it.id,
      type: "likert_scale" as const,
      textKey: `content.ritchie.likert.${it.id}`,
      options: likert6Options(),
    })),
    ...RITCHIE_FULL_CONFIG.validityItems.map((vi) => ({
      id: vi.id,
      type: "likert_scale" as const,
      textKey: `content.ritchie.validity.${vi.id}`,
      options: likert6Options(),
    })),
    ...RITCHIE_FULL_CONFIG.forcedChoiceBlocks.map((fc) => ({
      id: fc.id,
      type: "forced_choice" as const,
      textKey: `content.ritchie.fc.${fc.id}.prompt`,
      options: [
        { id: "a", textKey: `content.ritchie.fc.${fc.id}.a` },
        { id: "b", textKey: `content.ritchie.fc.${fc.id}.b` },
      ],
    })),
    ...RITCHIE_FULL_CONFIG.miniCases.map((mc) => ({
      id: mc.id,
      type: "mini_case" as const,
      textKey: `content.ritchie.mc.${mc.id}.scenario`,
      options: mc.options.map((o) => ({ id: o.id, textKey: `content.ritchie.mc.${mc.id}.${o.id}` })),
    })),
  ],
};

export const assessmentConfigs: Record<AssessmentBlockId, AssessmentBlockConfig> = {
  disc: discConfig,
  zima: zimaConfig,
  ritchie_martin: ritchieConfig,
};

export const defaultBlockOrder: AssessmentBlockId[] = [
  "disc",
  "zima",
  "ritchie_martin",
];

export const totalEstimatedMinutes = Object.values(assessmentConfigs).reduce(
  (sum, cfg) => sum + cfg.estimatedMinutes,
  0
);
