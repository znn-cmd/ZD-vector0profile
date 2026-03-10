import { en } from "./en";
import { ru } from "./ru";
import { hrAdminEN } from "./hrAdmin.en";
import { hrAdminRU } from "./hrAdmin.ru";
import type { Lang } from "@/types";

const dictionaries: Record<Lang, typeof en> = { en, ru: ru as unknown as typeof en };

export function getDictionary(lang: Lang) {
  return dictionaries[lang] ?? dictionaries.en;
}

const hrAdminDictionaries: Record<Lang, typeof hrAdminEN> = {
  en: hrAdminEN,
  ru: hrAdminRU as unknown as typeof hrAdminEN,
};

export function getHRAdminDictionary(lang: Lang) {
  return hrAdminDictionaries[lang] ?? hrAdminDictionaries.en;
}

/**
 * Simple template interpolation: replaces {key} with values.
 * e.g. t("Hello, {name}!", { name: "John" }) → "Hello, John!"
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

/**
 * Resolve a dot-path key from a dictionary object.
 * e.g. resolve(dict, "assessment.disc.title") → "Behavioral Profile (DISC)"
 */
export function resolve(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export { hrAdminEN, hrAdminRU };
export type { HRAdminDictEN } from "./hrAdmin.en";
export type { HRAdminDictRU } from "./hrAdmin.ru";
