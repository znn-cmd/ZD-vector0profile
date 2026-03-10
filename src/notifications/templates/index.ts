// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Template Resolver
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Lang, ScoreBand } from "../../storage/types";
import type { MessageTemplates, MessageTemplate, TemplateKey } from "./types";
import { ru } from "./ru";
import { en } from "./en";

export type { MessageTemplates, MessageTemplate, TemplateKey };

const dictionaries: Record<Lang, MessageTemplates> = { ru, en };

export function getTemplates(lang: Lang): MessageTemplates {
  return dictionaries[lang] ?? dictionaries.en;
}

export function getTemplate(lang: Lang, key: TemplateKey): MessageTemplate {
  const dict = getTemplates(lang);
  return dict[key];
}

export function getBandLabel(lang: Lang, band: ScoreBand): string {
  return getTemplates(lang).band_labels[band] ?? band;
}

/**
 * Interpolates {placeholder} tokens in a template string.
 * Missing keys are left as-is.
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const val = vars[key];
    return val !== undefined ? String(val) : match;
  });
}

/**
 * Renders a full message from a template key and variables.
 */
export function renderMessage(
  lang: Lang,
  key: TemplateKey,
  vars: Record<string, string | number>,
): { subject: string; body: string } {
  const tpl = getTemplate(lang, key);
  return {
    subject: interpolate(tpl.subject, vars),
    body: interpolate(tpl.body, vars),
  };
}
