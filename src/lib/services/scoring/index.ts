import type {
  AssessmentSession,
  AssessmentResults,
  AssessmentBlockId,
} from "@/types";
import { scoreDISC, getDISCCompletionPercent } from "./disc";
import { scoreZIMA, getZIMACompletionPercent } from "./zima";
import {
  scoreRitchieMartin,
  getRitchieCompletionPercent,
} from "./ritchieMartin";

export function computeFullResults(
  session: AssessmentSession
): AssessmentResults {
  const discProgress = session.progress.disc;
  const zimaProgress = session.progress.zima;
  const ritchieProgress = session.progress.ritchie_martin;

  return {
    candidateId: session.candidateId,
    sessionId: session.id,
    disc: scoreDISC(discProgress),
    zima: scoreZIMA(zimaProgress),
    ritchieMartin: scoreRitchieMartin(ritchieProgress),
    generatedAt: new Date().toISOString(),
  };
}

export function getBlockCompletionPercent(
  session: AssessmentSession,
  blockId: AssessmentBlockId
): number {
  const progress = session.progress[blockId];
  if (!progress) return 0;
  switch (blockId) {
    case "disc":
      return getDISCCompletionPercent(progress);
    case "zima":
      return getZIMACompletionPercent(progress);
    case "ritchie_martin":
      return getRitchieCompletionPercent(progress);
  }
}

export function getOverallCompletionPercent(
  session: AssessmentSession
): number {
  const blocks = session.blockOrder;
  const percents = blocks.map((b) => getBlockCompletionPercent(session, b));
  return Math.round(percents.reduce((a, b) => a + b, 0) / blocks.length);
}

export function isSessionComplete(session: AssessmentSession): boolean {
  return session.blockOrder.every(
    (b) => session.progress[b]?.status === "completed"
  );
}

export { scoreDISC, scoreZIMA, scoreRitchieMartin };
