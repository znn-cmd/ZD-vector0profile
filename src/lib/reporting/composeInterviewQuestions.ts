// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Interview Follow-Up Question Composer
//
//  Pure, deterministic:
//    (profile: FinalProfile, lang) → InterviewQuestionOutput
//
//  Evaluates every rule in INTERVIEW_QUESTION_RULES against the
//  FinalProfile, collects triggered questions, groups by theme,
//  sorts by priority, trims to 5–10 questions (max 2 per theme),
//  and returns a structured, HR-ready output.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalProfile, DISCScale, RitchieScale, ZIMADimension, SalesRole } from "@/engine/types";
import type { Lang } from "@/storage/types";

import {
  INTERVIEW_QUESTION_RULES,
  INTERVIEW_QUESTION_LIMITS,
  THEME_LABELS,
  type InterviewQuestionRule,
  type InterviewTheme,
  type ScoreCondition,
  type ConditionOperator,
} from "@/config/reports/interviewQuestionRules";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Output Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface InterviewQuestion {
  id: string;
  theme: InterviewTheme;
  themeLabel: string;
  priority: number;
  question: string;
  probeHint: string | null;
}

export interface InterviewThemeGroup {
  theme: InterviewTheme;
  themeLabel: string;
  questions: InterviewQuestion[];
}

export interface InterviewQuestionOutput {
  candidateId: string;
  lang: Lang;
  generatedAt: string;
  totalTriggered: number;
  totalSelected: number;
  themes: InterviewThemeGroup[];
  flatList: InterviewQuestion[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Condition Evaluator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function extractValue(profile: FinalProfile, cond: ScoreCondition): number | string {
  const k = cond.key;

  switch (cond.source) {
    case "disc_scale":
      return profile.disc.scales[k as DISCScale]?.normalized ?? 0;
    case "disc_sjt":
      return profile.disc.sjtScore.normalized;
    case "disc_overall":
      return profile.disc.overall;
    case "disc_validity":
      return profile.disc.validity.score;
    case "disc_consistency":
      return profile.disc.consistency.score;
    case "disc_band":
      return profile.disc.band;
    case "ritchie_scale":
      return profile.ritchie.scales[k as RitchieScale]?.normalized ?? 0;
    case "ritchie_role_fit":
      return profile.ritchie.roleFit[k as SalesRole]?.score ?? 0;
    case "ritchie_top_motivator":
      return profile.ritchie.topMotivators.includes(k as RitchieScale) ? 1 : 0;
    case "ritchie_bottom_motivator":
      return profile.ritchie.bottomMotivators.includes(k as RitchieScale) ? 1 : 0;
    case "zima_dimension":
      return profile.zima.dimensions[k as ZIMADimension]?.normalized ?? 0;
    case "zima_fit":
      return profile.zima.fitScore;
    case "zima_red_flag_count":
      return profile.zima.redFlags.length;
    case "zima_role_fit":
      return profile.zima.roleFitScores[k as SalesRole] ?? 0;
    case "overall_score":
      return profile.overallScore;
    case "overall_band":
      return profile.overallBand;
    case "primary_role":
      return profile.primaryRole;
    case "secondary_role":
      return profile.secondaryRole;
    default:
      return 0;
  }
}

function compare(actual: number | string, operator: ConditionOperator, target: number | string): boolean {
  const a = typeof actual === "number" ? actual : actual;
  const b = typeof target === "number" ? target : target;

  if (typeof a === "string" || typeof b === "string") {
    const sa = String(a);
    const sb = String(b);
    switch (operator) {
      case "==": return sa === sb;
      case "!=": return sa !== sb;
      default: return false;
    }
  }

  const na = a as number;
  const nb = b as number;
  switch (operator) {
    case "<":  return na < nb;
    case "<=": return na <= nb;
    case ">":  return na > nb;
    case ">=": return na >= nb;
    case "==": return na === nb;
    case "!=": return na !== nb;
    default:   return false;
  }
}

function evaluateCondition(profile: FinalProfile, cond: ScoreCondition): boolean {
  const actual = extractValue(profile, cond);
  return compare(actual, cond.operator, cond.value);
}

function ruleTriggered(profile: FinalProfile, rule: InterviewQuestionRule): boolean {
  const results = rule.conditions.map((c) => evaluateCondition(profile, c));
  if (rule.conditionLogic === "and") return results.every(Boolean);
  return results.some(Boolean);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Main Composer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function composeInterviewQuestions(
  profile: FinalProfile,
  lang: Lang = "en",
): InterviewQuestionOutput {
  const triggered: { rule: InterviewQuestionRule; question: InterviewQuestion }[] = [];

  for (const rule of INTERVIEW_QUESTION_RULES) {
    if (ruleTriggered(profile, rule)) {
      triggered.push({
        rule,
        question: {
          id: rule.id,
          theme: rule.theme,
          themeLabel: THEME_LABELS[rule.theme][lang],
          priority: rule.priority,
          question: rule.question[lang],
          probeHint: rule.probeHint ? rule.probeHint[lang] : null,
        },
      });
    }
  }

  const totalTriggered = triggered.length;

  // Sort by priority descending
  triggered.sort((a, b) => b.rule.priority - a.rule.priority);

  // Enforce max-per-theme and global max
  const { MAX_QUESTIONS, MAX_PER_THEME, MIN_QUESTIONS } = INTERVIEW_QUESTION_LIMITS;
  const selected: InterviewQuestion[] = [];
  const themeCounts: Record<string, number> = {};

  for (const { question } of triggered) {
    if (selected.length >= MAX_QUESTIONS) break;
    const tc = themeCounts[question.theme] ?? 0;
    if (tc >= MAX_PER_THEME) continue;
    selected.push(question);
    themeCounts[question.theme] = tc + 1;
  }

  // If below minimum, backfill from remaining triggered questions (relaxing theme cap)
  if (selected.length < MIN_QUESTIONS) {
    const selectedIds = new Set(selected.map((q) => q.id));
    for (const { question } of triggered) {
      if (selected.length >= MIN_QUESTIONS) break;
      if (selectedIds.has(question.id)) continue;
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  // If still below minimum, add the universal fallback
  if (selected.length < MIN_QUESTIONS) {
    const fallbacks = buildFallbackQuestions(lang);
    for (const fb of fallbacks) {
      if (selected.length >= MIN_QUESTIONS) break;
      selected.push(fb);
    }
  }

  // Group by theme
  const themeMap = new Map<InterviewTheme, InterviewQuestion[]>();
  for (const q of selected) {
    const arr = themeMap.get(q.theme) ?? [];
    arr.push(q);
    themeMap.set(q.theme, arr);
  }

  const themes: InterviewThemeGroup[] = [];
  for (const [theme, questions] of Array.from(themeMap.entries()) as [InterviewTheme, InterviewQuestion[]][]) {
    const labels = THEME_LABELS[theme];
    themes.push({
      theme,
      themeLabel: labels ? labels[lang] : theme,
      questions,
    });
  }

  return {
    candidateId: profile.candidateId,
    lang,
    generatedAt: new Date().toISOString(),
    totalTriggered,
    totalSelected: selected.length,
    themes,
    flatList: selected,
  };
}

// ─── Fallback Questions ─────────────────────────────────────────────

function buildFallbackQuestions(lang: Lang): InterviewQuestion[] {
  const fallbacks: { id: string; q: { en: string; ru: string } }[] = [
    {
      id: "fb_01",
      q: {
        en: "What is the most complex deal you have closed, and what made it complex?",
        ru: "Какая самая сложная сделка, которую вы закрыли, и что делало её сложной?",
      },
    },
    {
      id: "fb_02",
      q: {
        en: "Describe a time you had to recover a relationship with a dissatisfied client. What steps did you take?",
        ru: "Опишите ситуацию, когда вам нужно было восстановить отношения с недовольным клиентом. Какие шаги вы предприняли?",
      },
    },
    {
      id: "fb_03",
      q: {
        en: "How do you prioritise your pipeline when you have more opportunities than time?",
        ru: "Как вы расставляете приоритеты в пайплайне, когда возможностей больше, чем времени?",
      },
    },
  ];

  return fallbacks.map((f) => ({
    id: f.id,
    theme: "motivational_alignment" as InterviewTheme,
    themeLabel: THEME_LABELS.motivational_alignment[lang],
    priority: 50,
    question: f.q[lang],
    probeHint: null,
  }));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Re-exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type { InterviewTheme, InterviewQuestionRule, ScoreCondition };
