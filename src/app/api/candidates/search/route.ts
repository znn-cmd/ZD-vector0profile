import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { jsonError, jsonOk } from "@/lib/api-utils";

/** Search candidates by full name (ФИО) with partial matching and transliteration fallback. */
export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();
    if (!q || q.length < 2) return jsonError("Query must be at least 2 characters");

    const repo = getRepository();
    const all = await repo.candidates.list();

    const query = q.toLowerCase();
    const matched = all.filter((c) => {
      const name = c.fullName.toLowerCase();
      if (name.includes(query)) return true;
      // Transliterated fallback (Cyrillic → Latin)
      const transliterated = transliterate(c.fullName).toLowerCase();
      if (transliterated.includes(query)) return true;
      // Also match by email
      if (c.email.toLowerCase().includes(query)) return true;
      return false;
    });

    return jsonOk({ candidates: matched, total: matched.length });
  } catch (err) {
    console.error("[GET /api/candidates/search]", err);
    return jsonError("Search failed", 500);
  }
}

const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function transliterate(text: string): string {
  return text
    .split("")
    .map((ch) => {
      const lower = ch.toLowerCase();
      const mapped = CYRILLIC_MAP[lower];
      if (mapped === undefined) return ch;
      return ch === lower ? mapped : mapped.charAt(0).toUpperCase() + mapped.slice(1);
    })
    .join("");
}
