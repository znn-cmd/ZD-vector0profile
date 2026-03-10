// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PDF Copy — Language Accessor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { PDFCopyDictionary } from "./reportSectionSchema";
import { pdfCopyEN } from "./pdfCopy.en";
import { pdfCopyRU } from "./pdfCopy.ru";

const COPIES: Record<string, PDFCopyDictionary> = {
  en: pdfCopyEN,
  ru: pdfCopyRU,
};

export function getPDFCopy(lang: "en" | "ru" = "en"): PDFCopyDictionary {
  return COPIES[lang] ?? pdfCopyEN;
}

export { pdfCopyEN, pdfCopyRU };
export type { PDFCopyDictionary } from "./reportSectionSchema";
