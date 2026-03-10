import { discConfig } from "./disc";
import { zimaConfig } from "./zima";
import { ritchieConfig } from "./ritchieMartin";
import type { AssessmentBlockConfig, AssessmentBlockId } from "@/types";

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

export { discConfig, zimaConfig, ritchieConfig };
