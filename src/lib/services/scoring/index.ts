import type { AssessmentSession, AssessmentResults, AssessmentBlockId } from "@/types";
import { computeFinalProfile, DISC_CONFIG, RITCHIE_CONFIG, ZIMA_CONFIG } from "@/engine";
import type { AllBlockAnswers, Likert6, SJTRanking, ForcedChoicePick, CaseOptionId } from "@/engine/types";
import { assessmentConfigs } from "@/config/assessments";

export function computeFullResults(
  session: AssessmentSession
): AssessmentResults {
  const answers = toEngineAnswers(session);
  const profile = computeFinalProfile({
    candidateId: session.candidateId,
    answers,
    discConfig: DISC_CONFIG,
    ritchieConfig: RITCHIE_CONFIG,
    zimaConfig: ZIMA_CONFIG,
  });

  // Map engine profile → app AssessmentResults (minimal + dashboard-friendly fields)
  const discScales: Record<string, number> = {};
  for (const k of ["D", "I", "S", "C", "K"] as const) {
    discScales[k] = profile.disc.scales[k].normalized;
  }

  const zimaDimensions: Record<string, number> = {};
  for (const [dim, score] of Object.entries(profile.zima.dimensions)) {
    zimaDimensions[dim] = score.normalized;
  }

  const bestRole = (Object.entries(profile.ritchie.roleFit) as [string, { score: number; label: string }][]).sort(
    (a, b) => b[1].score - a[1].score
  )[0];

  // Rough mapping to existing RitchieResult motivator keys
  const mapMotivator = (scale: string): string => {
    const m: Record<string, string> = {
      ACH: "achievement",
      REC: "recognition",
      POW: "authority",
      AUT: "independence",
      REL: "affiliation",
      SEC: "security",
      STR: "structure",
      DEV: "personal_growth",
      VAR: "creativity",
      VAL: "interest",
      INC: "equity",
      DRI: "working_conditions",
    };
    return m[scale] ?? "interest";
  };

  const motivators = {} as any;
  for (const [scale, s] of Object.entries(profile.ritchie.scales)) {
    motivators[mapMotivator(scale)] = s.normalized;
  }

  const topMotivators = profile.ritchie.topMotivators.map(mapMotivator) as any;
  const bottomMotivators = profile.ritchie.bottomMotivators.map(mapMotivator) as any;

  return {
    candidateId: session.candidateId,
    sessionId: session.id,
    generatedAt: new Date().toISOString(),

    disc: {
      raw: { D: profile.disc.scales.D.raw, I: profile.disc.scales.I.raw, S: profile.disc.scales.S.raw, C: profile.disc.scales.C.raw },
      normalized: { D: discScales.D, I: discScales.I, S: discScales.S, C: discScales.C },
      primaryType: (profile.disc.scaleProfile.primary === "K" ? profile.disc.scaleProfile.secondary : profile.disc.scaleProfile.primary) as any,
      secondaryType: (profile.disc.scaleProfile.secondary === "K" ? profile.disc.scaleProfile.primary : profile.disc.scaleProfile.secondary) as any,
      profileLabel: profile.disc.scaleProfile.label,
    },

    zima: {
      categories: {},
      totalScore: profile.zima.fitScore,
      percentile: profile.zima.fitScore,
      level:
        profile.zima.fitScore >= 75 ? "high" :
        profile.zima.fitScore >= 60 ? "above_average" :
        profile.zima.fitScore >= 45 ? "average" : "low",
    },

    ritchieMartin: {
      motivators,
      topMotivators,
      bottomMotivators,
    },

    overallScore: profile.overallScore,
    overallBand: profile.overallBand,
    primaryRole: profile.primaryRole,
    secondaryRole: profile.secondaryRole,
    recommendation: profile.finalRecommendation,
    strengths: profile.strengths,
    risks: profile.risks,
    interviewQuestions: profile.interviewFocusQuestions,
    managementRecs: profile.managementStyleRecommendations,
    retentionFlags: profile.retentionRiskFlags,

    discOverall: profile.disc.overall,
    discSjtScore: profile.disc.sjtScore.normalized,
    discScales,
    zimaRedFlagCount: profile.zima.redFlags.length,
    zimaDimensions,
    ritchieBestRole: bestRole?.[0] as any,
    ritchieBestRoleScore: bestRole?.[1]?.score,
    ritchieBestRoleFit: bestRole?.[1]?.label,
  };
}

export function getBlockCompletionPercent(
  session: AssessmentSession,
  blockId: AssessmentBlockId
): number {
  const progress = session.progress[blockId];
  if (!progress) return 0;
  const total = assessmentConfigs[blockId].questions.length;
  const answered = countAnswered(progress.answers);
  return Math.round((answered / total) * 100);
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

function countAnswered(answers: Record<string, any>): number {
  return Object.values(answers).filter((a) => {
    if (!a || typeof a !== "object") return false;
    if (a.type === "pair") return !!a.most && !!a.least;
    if (a.type === "ranking") return Array.isArray(a.order) && a.order.length > 0;
    if (a.type === "single") return typeof a.value === "string" && a.value.length > 0;
    if (a.type === "scale") return typeof a.value === "number" && a.value > 0;
    return false;
  }).length;
}

function toEngineAnswers(session: AssessmentSession): AllBlockAnswers {
  const discLikert: Record<string, Likert6> = {};
  const discSjt: Record<string, SJTRanking> = {};
  for (const [id, a] of Object.entries(session.progress.disc.answers ?? {})) {
    if (a?.type === "scale") discLikert[id] = clampLikert6(a.value);
    if (a?.type === "ranking") discSjt[id] = orderToSjtRanking(a.order);
  }

  const zimaLikert: Record<string, Likert6> = {};
  for (const [id, a] of Object.entries(session.progress.zima.answers ?? {})) {
    if (a?.type === "scale") zimaLikert[id] = clampLikert6(a.value);
  }

  const ritchieLikert: Record<string, Likert6> = {};
  const forcedChoice: Record<string, ForcedChoicePick> = {};
  const miniCases: Record<string, CaseOptionId> = {};
  for (const [id, a] of Object.entries(session.progress.ritchie_martin.answers ?? {})) {
    if (a?.type === "scale") ritchieLikert[id] = clampLikert6(a.value);
    if (a?.type === "single" && id.startsWith("fc_")) forcedChoice[id] = (a.value === "b" ? "b" : "a");
    if (a?.type === "single" && id.startsWith("mc_")) miniCases[id] = (a.value as CaseOptionId) ?? "a";
  }

  return {
    disc: { likert: discLikert, sjt: discSjt },
    zima: { likert: zimaLikert },
    ritchie: { likert: ritchieLikert, forcedChoice, miniCases },
  };
}

function clampLikert6(v: number): Likert6 {
  const n = Math.max(1, Math.min(6, Math.round(v)));
  return n as Likert6;
}

function orderToSjtRanking(order: string[]): SJTRanking {
  // order is best→worst list of option ids ("0".."3"); convert to ranks per option index
  const ranks = [4, 4, 4, 4];
  order.forEach((optId, idx) => {
    const i = Number(optId);
    if (Number.isFinite(i) && i >= 0 && i <= 3) ranks[i] = idx + 1;
  });
  return [ranks[0], ranks[1], ranks[2], ranks[3]] as SJTRanking;
}
