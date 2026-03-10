// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Name Search & Normalization
//
//  Supports Cyrillic (Russian ФИО) and Latin names.
//  Normalizes for case-insensitive, transliterated partial matching.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CYR_TO_LAT: Record<string, string> = {
  а: "a",  б: "b",  в: "v",  г: "g",  д: "d",  е: "e",  ё: "yo",
  ж: "zh", з: "z",  и: "i",  й: "y",  к: "k",  л: "l",  м: "m",
  н: "n",  о: "o",  п: "p",  р: "r",  с: "s",  т: "t",  у: "u",
  ф: "f",  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "",   ы: "y",  ь: "",   э: "e",  ю: "yu", я: "ya",
};

/**
 * Transliterates a Cyrillic string to Latin characters.
 * Latin characters pass through unchanged.
 */
export function transliterate(input: string): string {
  let result = "";
  for (const char of input) {
    const lower = char.toLowerCase();
    if (CYR_TO_LAT[lower] !== undefined) {
      const mapped = CYR_TO_LAT[lower];
      result += char === lower ? mapped : mapped.charAt(0).toUpperCase() + mapped.slice(1);
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Normalizes a name for search:
 * - Lowercase
 * - Transliterate Cyrillic → Latin
 * - Collapse whitespace
 * - Strip diacritics (if any)
 * - Remove punctuation except hyphens
 */
export function normalizeName(name: string): string {
  let n = name.toLowerCase().trim();
  n = transliterate(n);
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip diacritics
  n = n.replace(/[^\w\s-]/g, "");                         // remove punctuation
  n = n.replace(/\s+/g, " ");                             // collapse whitespace
  return n;
}

/**
 * Returns true if the candidate's normalized name matches the query.
 * Supports partial matching (any word in the query matches any part of the name).
 */
export function nameMatches(normalizedName: string, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;

  // Exact substring match (fastest path)
  if (normalizedName.includes(normalizedQuery)) return true;

  // Word-level partial match: every query word must appear in the name
  const queryWords = normalizedQuery.split(" ").filter(Boolean);
  const nameWords = normalizedName.split(" ").filter(Boolean);

  return queryWords.every((qw) =>
    nameWords.some((nw) => nw.includes(qw)),
  );
}
