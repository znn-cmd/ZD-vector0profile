// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Pure Scoring Helpers
//  Stateless, deterministic, unit-test-friendly
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type {
  Likert6,
  LikertItem,
  SJTCase,
  SJTRanking,
  ConsistencyPair,
  ValidityItem,
  ValidityReport,
  ConsistencyReport,
  ScaleScore,
} from "./types";

// ─── Reverse Scoring ─────────────────────────────────────────────────

/**
 * Reverses a Likert-6 value: 1→6, 2→5, 3→4, 4→3, 5→2, 6→1.
 * For a k-point scale, reverse(x) = k + 1 - x.
 */
export function reverseScore(value: Likert6, scaleMax: number = 6): number {
  return scaleMax + 1 - value;
}

/**
 * Applies reverse scoring to an item's raw value if the item is flagged as reversed.
 */
export function applyItemScoring(value: Likert6, item: LikertItem): number {
  return item.reversed ? reverseScore(value) : value;
}

// ─── Normalization ───────────────────────────────────────────────────

/**
 * Normalizes a raw score to 0–100 given the theoretical min and max.
 * Clamps the result to [0, 100].
 */
export function normalize(raw: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.round(Math.max(0, Math.min(100, ((raw - min) / (max - min)) * 100)));
}

/**
 * Normalizes a scale total where min = itemCount × 1 and max = itemCount × scaleMax.
 */
export function normalizeLikertScale(
  rawTotal: number,
  itemCount: number,
  scaleMax: number = 6,
): number {
  return normalize(rawTotal, itemCount, itemCount * scaleMax);
}

// ─── Scale Scoring ───────────────────────────────────────────────────

/**
 * Computes a ScaleScore for a set of items on the same scale.
 * Handles reverse scoring internally.
 */
export function computeScaleScore(
  items: LikertItem[],
  answers: Record<string, Likert6>,
  scaleMax: number = 6,
): ScaleScore {
  let raw = 0;
  let answered = 0;

  for (const item of items) {
    const val = answers[item.id];
    if (val !== undefined) {
      raw += applyItemScoring(val, item);
      answered++;
    }
  }

  const max = items.length * scaleMax;
  const normalized = items.length > 0
    ? normalizeLikertScale(raw, items.length, scaleMax)
    : 0;

  return {
    raw,
    max,
    normalized,
    itemCount: items.length,
    answeredCount: answered,
  };
}

// ─── SJT Scoring ─────────────────────────────────────────────────────

/**
 * Scores a single SJT case by comparing candidate ranking to expert key.
 * Uses Spearman-inspired distance: for each option, abs(candidateRank - expertRank).
 * Perfect match = max points, worst = 0.
 *
 * Returns a score 0–100 for this case.
 */
export function scoreSJTCase(
  candidateRanking: SJTRanking,
  expertKey: SJTRanking,
): number {
  const n = 4;
  // Max possible distance sum for 4 items with ranks 1-4 = 2+2+2+2 = 8
  // But theoretical max = sum of |i - (n+1-i)| for worst case
  const maxDistance = 8; // worst-case total distance for 4 options
  let totalDistance = 0;

  for (let i = 0; i < n; i++) {
    totalDistance += Math.abs(candidateRanking[i] - expertKey[i]);
  }

  return normalize(maxDistance - totalDistance, 0, maxDistance);
}

/**
 * Scores all SJT cases and returns a combined ScaleScore.
 */
export function computeSJTScore(
  cases: SJTCase[],
  answers: Record<string, SJTRanking>,
): ScaleScore {
  let totalPoints = 0;
  let answered = 0;

  for (const c of cases) {
    const ranking = answers[c.id];
    if (ranking) {
      totalPoints += scoreSJTCase(ranking, c.expertKey);
      answered++;
    }
  }

  const maxPoints = cases.length * 100;
  const raw = totalPoints;
  const normalized = maxPoints > 0 ? Math.round((raw / maxPoints) * 100) : 0;

  return {
    raw,
    max: maxPoints,
    normalized,
    itemCount: cases.length,
    answeredCount: answered,
  };
}

// ─── Weighted Formula ────────────────────────────────────────────────

/**
 * Computes a weighted sum given scores and weights.
 * Weights should sum to 1.0, but this function normalizes if they don't.
 */
export function weightedSum(
  scores: Record<string, number>,
  weights: Record<string, number>,
): number {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  let sum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const score = scores[key] ?? 0;
    sum += score * (weight / totalWeight);
  }
  return Math.round(sum);
}

// ─── Consistency Checking ────────────────────────────────────────────

/**
 * Checks consistency pairs and returns a report.
 * Each pair defines two items that should track together (or inversely).
 */
export function checkConsistency(
  pairs: ConsistencyPair[],
  answers: Record<string, Likert6>,
  items: LikertItem[],
): ConsistencyReport {
  const violations: ConsistencyReport["violations"] = [];
  const itemMap = new Map(items.map((it) => [it.id, it]));

  for (const pair of pairs) {
    const rawA = answers[pair.itemA];
    const rawB = answers[pair.itemB];
    if (rawA === undefined || rawB === undefined) continue;

    const itemA = itemMap.get(pair.itemA);
    const itemB = itemMap.get(pair.itemB);
    if (!itemA || !itemB) continue;

    const scoredA = applyItemScoring(rawA, itemA);
    const scoredB = pair.sameDirection
      ? applyItemScoring(rawB, itemB)
      : reverseScore(applyItemScoring(rawB, itemB) as Likert6);

    const delta = Math.abs(scoredA - scoredB);
    if (delta > pair.maxDelta) {
      violations.push({
        pairId: `${pair.itemA}↔${pair.itemB}`,
        itemA: pair.itemA,
        itemB: pair.itemB,
        delta,
      });
    }
  }

  const maxViolations = pairs.length;
  const score = maxViolations > 0
    ? Math.round(((maxViolations - violations.length) / maxViolations) * 100)
    : 100;

  return {
    isConsistent: violations.length === 0,
    violations,
    score,
  };
}

// ─── Validity Checking ───────────────────────────────────────────────

/**
 * Checks validity / lie-scale items.
 * These are items with socially desirable but unlikely "always true" answers.
 */
export function checkValidity(
  validityItemIds: string[],
  answers: Record<string, Likert6>,
  items: LikertItem[],
): ValidityReport {
  const flags: string[] = [];
  const itemMap = new Map(items.map((it) => [it.id, it]));

  // Check K-scale items for extreme responding
  let extremeCount = 0;
  let validAnswers = 0;

  for (const id of validityItemIds) {
    const val = answers[id];
    if (val === undefined) continue;
    validAnswers++;
    // Extreme = responding 6 to a positively-keyed validity item (social desirability)
    const item = itemMap.get(id);
    if (!item) continue;
    const scored = applyItemScoring(val, item);
    if (scored >= 6) extremeCount++;
  }

  if (validAnswers > 0) {
    const extremeRate = extremeCount / validAnswers;
    if (extremeRate > 0.7) {
      flags.push(`High social desirability: ${Math.round(extremeRate * 100)}% extreme K-scale responses`);
    }
    if (extremeRate > 0.85) {
      flags.push("Probable impression management — validity in question");
    }
  }

  // Check for straight-lining (same answer for >80% of items)
  const allValues = Object.values(answers);
  if (allValues.length > 10) {
    const freq = new Map<number, number>();
    for (const v of allValues) {
      freq.set(v, (freq.get(v) ?? 0) + 1);
    }
    const maxFreq = Math.max(...Array.from(freq.values()));
    if (maxFreq / allValues.length > 0.8) {
      flags.push(`Straight-lining detected: ${Math.round((maxFreq / allValues.length) * 100)}% identical responses`);
    }
  }

  // Check for speed-based pattern (alternating 1-6-1-6)
  const vals = Object.values(answers);
  let alternatingCount = 0;
  for (let i = 1; i < vals.length; i++) {
    if (Math.abs(vals[i] - vals[i - 1]) >= 4) alternatingCount++;
  }
  if (vals.length > 10 && alternatingCount / vals.length > 0.6) {
    flags.push("Alternating pattern detected — possible random responding");
  }

  const score = Math.max(0, 100 - flags.length * 25);

  return {
    isValid: flags.length === 0,
    flags,
    score,
  };
}

/**
 * Checks Ritchie-Martin validity items specifically.
 */
export function checkRitchieValidity(
  validityItems: ValidityItem[],
  answers: Record<string, Likert6>,
): ValidityReport {
  const flags: string[] = [];

  for (const vi of validityItems) {
    const val = answers[vi.id];
    if (val === undefined) continue;

    if (vi.expectedDirection === "agree" && val <= vi.threshold) {
      flags.push(`Unexpected low response on validity item ${vi.id}`);
    }
    if (vi.expectedDirection === "disagree" && val >= (7 - vi.threshold)) {
      flags.push(`Unexpected high response on validity item ${vi.id}`);
    }
  }

  const maxFlags = validityItems.length;
  const score = maxFlags > 0
    ? Math.round(((maxFlags - flags.length) / maxFlags) * 100)
    : 100;

  return {
    isValid: flags.length <= 1, // Allow 1 anomaly
    flags,
    score,
  };
}

// ─── Interpretation Mapping ──────────────────────────────────────────

/**
 * Maps a normalized score (0–100) to a descriptive band.
 */
export function toBand<T extends string>(
  score: number,
  bands: { min: number; max: number; label: T }[],
): T {
  for (const band of bands) {
    if (score >= band.min && score <= band.max) return band.label;
  }
  return bands[bands.length - 1].label;
}

/**
 * Returns the top N scales sorted by normalized score descending.
 */
export function topScales<S extends string>(
  scores: Record<S, ScaleScore>,
  n: number,
): S[] {
  return (Object.entries(scores) as [S, ScaleScore][])
    .sort((a, b) => b[1].normalized - a[1].normalized)
    .slice(0, n)
    .map(([k]) => k);
}

/**
 * Returns the bottom N scales sorted by normalized score ascending.
 */
export function bottomScales<S extends string>(
  scores: Record<S, ScaleScore>,
  n: number,
): S[] {
  return (Object.entries(scores) as [S, ScaleScore][])
    .sort((a, b) => a[1].normalized - b[1].normalized)
    .slice(0, n)
    .map(([k]) => k);
}

// ─── Role Fit ────────────────────────────────────────────────────────

/**
 * Computes Euclidean-distance-based fit between a candidate's scores
 * and an ideal profile. Returns 0–100 where 100 = perfect match.
 */
export function computeProfileFit(
  candidateScores: Record<string, number>,
  idealScores: Record<string, number>,
): number {
  const keys = Object.keys(idealScores);
  if (keys.length === 0) return 0;

  let sumSquaredDiff = 0;
  for (const key of keys) {
    const candidate = candidateScores[key] ?? 50;
    const ideal = idealScores[key];
    sumSquaredDiff += (candidate - ideal) ** 2;
  }

  // Max possible distance = sqrt(keys.length * 100^2) = 100 * sqrt(n)
  const maxDistance = 100 * Math.sqrt(keys.length);
  const distance = Math.sqrt(sumSquaredDiff);

  return Math.round(Math.max(0, ((maxDistance - distance) / maxDistance) * 100));
}

// ─── Utility ─────────────────────────────────────────────────────────

/** Groups items by their scale property */
export function groupByScale<T extends { scale: string }>(
  items: T[],
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.scale]) groups[item.scale] = [];
    groups[item.scale].push(item);
  }
  return groups;
}

/** Clamps a number to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Rounds to n decimal places */
export function roundTo(value: number, decimals: number = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
