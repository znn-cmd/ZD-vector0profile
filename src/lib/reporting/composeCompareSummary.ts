// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Compare Mode — Summary Composer
//
//  Pure, deterministic:
//    (candidates: WebSummaryCard[], lang) → CompareSummary
//
//  Takes 2–5 scored candidate cards (the same objects the compare
//  view already consumes) and produces structured, config-driven
//  comparative insight:
//    • Overall ranking
//    • Per-dimension leaders and laggards
//    • Archetype matches (strongest closer, best hunter, etc.)
//    • Caution notes for hidden operational risks
//    • Recommendation matrix
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { WebSummaryCard } from "@/reports/types";
import type { DISCScale, RitchieScale, ZIMADimension, SalesRole, OverallBand } from "@/engine/types";
import type { Lang } from "@/storage/types";

import {
  COMPARE_DIMENSION_RULES,
  ARCHETYPE_INSIGHT_RULES,
  CAUTION_TRIGGER_RULES,
  BAND_PRIORITY,
  type CompareDimensionKey,
  type CompareDimensionRule,
  type ArchetypeInsightRule,
  type CautionTriggerRule,
} from "@/config/reports/compareRules";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Output Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CandidateRankEntry {
  candidateId: string;
  name: string;
  rank: number;
  overallScore: number;
  band: OverallBand;
  bandLabel: string;
  primaryRole: SalesRole;
}

export interface DimensionLeaderEntry {
  dimensionKey: CompareDimensionKey;
  label: string;
  group: string;
  leaderId: string;
  leaderName: string;
  leaderScore: number;
  riskId: string | null;
  riskName: string | null;
  riskScore: number | null;
  spread: number;
  allScores: { candidateId: string; name: string; score: number }[];
}

export interface ArchetypeMatch {
  archetypeId: string;
  label: string;
  matchedCandidateId: string;
  matchedCandidateName: string;
  compositeScore: number;
  qualified: boolean;
  runnerUpId: string | null;
  runnerUpName: string | null;
  runnerUpScore: number | null;
}

export interface CautionNote {
  cautionId: string;
  message: string;
  candidateId: string;
  candidateName: string;
  overallScore: number;
  triggeringValues: { dimension: string; value: number }[];
}

export interface RecommendationEntry {
  candidateId: string;
  name: string;
  overallScore: number;
  band: OverallBand;
  bandLabel: string;
  primaryRole: SalesRole;
  roleLabel: string;
  strengthCount: number;
  riskCount: number;
  redFlagCount: number;
  cautionCount: number;
  verdict: "proceed" | "proceed_with_caution" | "review_required" | "not_recommended";
  verdictLabel: string;
}

export interface CompareSummary {
  generatedAt: string;
  candidateCount: number;
  lang: Lang;
  ranking: CandidateRankEntry[];
  dimensionLeaders: DimensionLeaderEntry[];
  archetypes: ArchetypeMatch[];
  cautions: CautionNote[];
  recommendationMatrix: RecommendationEntry[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Value Extractor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function extractDimensionValue(card: WebSummaryCard, key: CompareDimensionKey): number {
  // --- DISC scales ---
  if (key.startsWith("disc_") && key.length === 6) {
    const scale = key.slice(5) as DISCScale;
    return card.discProfile.scales[scale] ?? 0;
  }
  if (key === "disc_sjt") return card.discProfile.sjtScore;
  if (key === "disc_overall") return card.discProfile.overall;
  // Validity and consistency are not in WebSummaryCard directly.
  // We approximate from the overall — in production, extend the card if needed.
  // For now these return a proxy based on available data.
  if (key === "disc_validity") return card.discProfile.overall >= 60 ? 80 : 50;
  if (key === "disc_consistency") return card.discProfile.overall >= 60 ? 80 : 50;

  // --- ZIMA ---
  if (key === "zima_fit") return card.zimaProfile.fitScore;
  if (key.startsWith("zima_role_")) {
    const role = key.slice(10) as SalesRole;
    return card.zimaProfile.dimensions[role as unknown as ZIMADimension] ?? card.zimaProfile.fitScore;
  }
  if (key.startsWith("zima_")) {
    const dim = key.slice(5) as ZIMADimension;
    return card.zimaProfile.dimensions[dim] ?? 0;
  }

  // --- Ritchie–Martin ---
  if (key.startsWith("ritchie_") && key !== "ritchie_best_role_fit") {
    const scale = key.slice(8) as RitchieScale;
    return card.ritchieProfile.scales[scale] ?? 0;
  }
  if (key === "ritchie_best_role_fit") return card.ritchieProfile.bestRoleFit.score;

  // --- Overall ---
  if (key === "overall_score") return card.overallScore;

  return 0;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Label Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BAND_LABELS: Record<OverallBand, { en: string; ru: string }> = {
  strong_hire: { en: "Strong Hire", ru: "Сильный найм" },
  recommended: { en: "Recommended", ru: "Рекомендован" },
  conditional: { en: "Conditional", ru: "Условно" },
  not_recommended: { en: "Not Recommended", ru: "Не рекомендован" },
};

const ROLE_LABELS: Record<SalesRole, { en: string; ru: string }> = {
  full_cycle: { en: "Full-Cycle Account Executive", ru: "Аккаунт-менеджер полного цикла" },
  hunter: { en: "New Business Hunter", ru: "Хантер" },
  consultative: { en: "Consultative Seller", ru: "Консультативный продавец" },
  team_lead: { en: "Sales Team Lead", ru: "Тимлид" },
};

type VerdictKey = "proceed" | "proceed_with_caution" | "review_required" | "not_recommended";

const VERDICT_LABELS: Record<VerdictKey, { en: string; ru: string }> = {
  proceed: { en: "Proceed to interview", ru: "Пригласить на интервью" },
  proceed_with_caution: { en: "Proceed with caution", ru: "Пригласить с оговорками" },
  review_required: { en: "Additional review required", ru: "Требуется дополнительный анализ" },
  not_recommended: { en: "Not recommended", ru: "Не рекомендован" },
};

function label(obj: { en: string; ru: string }, lang: Lang): string {
  return obj[lang] ?? obj.en;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Main Composer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function composeCompareSummary(
  cards: WebSummaryCard[],
  lang: Lang = "en",
): CompareSummary {
  if (cards.length < 2 || cards.length > 5) {
    throw new Error(`Compare mode requires 2–5 candidates, received ${cards.length}`);
  }

  const ranking = buildRanking(cards, lang);
  const dimensionLeaders = buildDimensionLeaders(cards, lang);
  const archetypes = buildArchetypes(cards, lang);
  const cautions = buildCautions(cards, lang);
  const recommendationMatrix = buildRecommendationMatrix(cards, cautions, lang);

  return {
    generatedAt: new Date().toISOString(),
    candidateCount: cards.length,
    lang,
    ranking,
    dimensionLeaders,
    archetypes,
    cautions,
    recommendationMatrix,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Section Builders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildRanking(cards: WebSummaryCard[], lang: Lang): CandidateRankEntry[] {
  return cards
    .slice()
    .sort((a, b) => {
      const bandDiff = (BAND_PRIORITY[b.overallBand] ?? 0) - (BAND_PRIORITY[a.overallBand] ?? 0);
      if (bandDiff !== 0) return bandDiff;
      return b.overallScore - a.overallScore;
    })
    .map((card, i) => ({
      candidateId: card.candidateId,
      name: card.candidateName,
      rank: i + 1,
      overallScore: card.overallScore,
      band: card.overallBand,
      bandLabel: label(BAND_LABELS[card.overallBand], lang),
      primaryRole: card.primaryRole,
    }));
}

// ─── Dimension Leaders ──────────────────────────────────────────────

function buildDimensionLeaders(cards: WebSummaryCard[], lang: Lang): DimensionLeaderEntry[] {
  const results: DimensionLeaderEntry[] = [];

  for (const rule of COMPARE_DIMENSION_RULES) {
    const scored = cards.map((c) => ({
      candidateId: c.candidateId,
      name: c.candidateName,
      score: extractDimensionValue(c, rule.key),
    }));

    const sorted = scored.slice().sort((a, b) =>
      rule.higherIsBetter ? b.score - a.score : a.score - b.score,
    );

    const leader = sorted[0];
    const max = Math.max(...scored.map((s) => s.score));
    const min = Math.min(...scored.map((s) => s.score));

    let riskCandidate: typeof scored[0] | null = null;
    if (rule.riskThreshold !== undefined) {
      const risky = scored
        .filter((s) =>
          rule.higherIsBetter
            ? s.score < rule.riskThreshold!
            : s.score > rule.riskThreshold!,
        )
        .sort((a, b) => (rule.higherIsBetter ? a.score - b.score : b.score - a.score));
      riskCandidate = risky[0] ?? null;
    }

    results.push({
      dimensionKey: rule.key,
      label: label(rule.label, lang),
      group: rule.group,
      leaderId: leader.candidateId,
      leaderName: leader.name,
      leaderScore: leader.score,
      riskId: riskCandidate?.candidateId ?? null,
      riskName: riskCandidate?.name ?? null,
      riskScore: riskCandidate?.score ?? null,
      spread: max - min,
      allScores: scored,
    });
  }

  return results;
}

// ─── Archetype Insights ─────────────────────────────────────────────

function buildArchetypes(cards: WebSummaryCard[], lang: Lang): ArchetypeMatch[] {
  return ARCHETYPE_INSIGHT_RULES.map((rule) => {
    const scored = cards.map((c) => {
      const values = rule.dimensionKeys.map((dk) => extractDimensionValue(c, dk));
      const composite = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;
      const passesFloor = rule.hardFloor === undefined
        || values.every((v) => v >= rule.hardFloor!);
      return {
        candidateId: c.candidateId,
        name: c.candidateName,
        composite,
        qualified: composite >= rule.qualifyingThreshold && passesFloor,
      };
    });

    // For "highest_retention_risk": lower SEC = higher risk, invert sort
    const isRetentionRisk = rule.id === "highest_retention_risk";
    const sorted = scored.slice().sort((a, b) =>
      isRetentionRisk ? a.composite - b.composite : b.composite - a.composite,
    );

    const best = sorted[0];
    const runnerUp = sorted.length > 1 ? sorted[1] : null;

    return {
      archetypeId: rule.id,
      label: label(rule.label, lang),
      matchedCandidateId: best.candidateId,
      matchedCandidateName: best.name,
      compositeScore: best.composite,
      qualified: isRetentionRisk ? true : best.qualified,
      runnerUpId: runnerUp?.candidateId ?? null,
      runnerUpName: runnerUp?.name ?? null,
      runnerUpScore: runnerUp?.composite ?? null,
    };
  });
}

// ─── Caution Notes ──────────────────────────────────────────────────

function buildCautions(cards: WebSummaryCard[], lang: Lang): CautionNote[] {
  const notes: CautionNote[] = [];

  for (const card of cards) {
    for (const rule of CAUTION_TRIGGER_RULES) {
      if (card.overallScore < rule.overallFloor) continue;

      let triggered = false;
      const triggeringValues: { dimension: string; value: number }[] = [];

      switch (rule.type) {
        case "high_overall_low_dimension":
        case "high_overall_low_validity":
        case "strong_disc_weak_motivation":
        case "strong_overall_weak_retention": {
          if (rule.riskDimensions && rule.riskCeiling !== undefined) {
            for (const dk of rule.riskDimensions) {
              const val = extractDimensionValue(card, dk);
              if (val <= rule.riskCeiling) {
                triggered = true;
                const dimRule = COMPARE_DIMENSION_RULES.find((r) => r.key === dk);
                triggeringValues.push({
                  dimension: dimRule ? label(dimRule.label, lang) : dk,
                  value: val,
                });
              }
            }
          }
          break;
        }
        case "high_overall_high_red_flags": {
          if (rule.minRedFlags !== undefined && card.zimaProfile.redFlagCount >= rule.minRedFlags) {
            triggered = true;
            triggeringValues.push({
              dimension: lang === "ru" ? "Красные флаги ZIMA" : "ZIMA Red Flags",
              value: card.zimaProfile.redFlagCount,
            });
          }
          break;
        }
        case "band_mismatch_with_leader": {
          break;
        }
      }

      if (triggered) {
        notes.push({
          cautionId: rule.id,
          message: label(rule.label, lang),
          candidateId: card.candidateId,
          candidateName: card.candidateName,
          overallScore: card.overallScore,
          triggeringValues,
        });
      }
    }
  }

  return notes;
}

// ─── Recommendation Matrix ──────────────────────────────────────────

function buildRecommendationMatrix(
  cards: WebSummaryCard[],
  cautions: CautionNote[],
  lang: Lang,
): RecommendationEntry[] {
  return cards
    .slice()
    .sort((a, b) => b.overallScore - a.overallScore)
    .map((card) => {
      const candidateCautions = cautions.filter((c) => c.candidateId === card.candidateId);
      const verdict = resolveVerdict(card, candidateCautions.length);

      return {
        candidateId: card.candidateId,
        name: card.candidateName,
        overallScore: card.overallScore,
        band: card.overallBand,
        bandLabel: label(BAND_LABELS[card.overallBand], lang),
        primaryRole: card.primaryRole,
        roleLabel: label(ROLE_LABELS[card.primaryRole], lang),
        strengthCount: card.strengths.length,
        riskCount: card.risks.length,
        redFlagCount: card.zimaProfile.redFlagCount,
        cautionCount: candidateCautions.length,
        verdict,
        verdictLabel: label(VERDICT_LABELS[verdict], lang),
      };
    });
}

function resolveVerdict(card: WebSummaryCard, cautionCount: number): VerdictKey {
  if (card.overallBand === "not_recommended") return "not_recommended";
  if (card.overallBand === "conditional" && cautionCount >= 2) return "review_required";
  if (card.overallBand === "conditional") return "proceed_with_caution";
  if (cautionCount >= 2) return "proceed_with_caution";
  if (cautionCount === 1) return "proceed";
  return "proceed";
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Re-exports for convenience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type {
  CompareDimensionKey,
  CompareDimensionRule,
  ArchetypeInsightRule,
  CautionTriggerRule,
};
