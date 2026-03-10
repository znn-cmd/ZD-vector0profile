import type { Lang } from "../../storage/types";
import type { ReportDictionary } from "./types";
import { ru } from "./ru";
import { en } from "./en";

export type { ReportDictionary };

const dicts: Record<Lang, ReportDictionary> = { ru, en };

export function getReportDict(lang: Lang): ReportDictionary {
  return dicts[lang] ?? dicts.en;
}
