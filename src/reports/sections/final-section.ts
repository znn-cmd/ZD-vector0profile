import type { jsPDF } from "jspdf";
import type { ReportInput, ReportVersion } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { LAYOUT, COLORS } from "../types";
import {
  drawSectionTitle, drawCalloutBox, drawText,
  drawHorizontalRule, setFont, ensureSpace, addFooter,
} from "../pdf-primitives";

const { MARGIN_LEFT, CONTENT_WIDTH, PAGE_WIDTH, PAGE_HEIGHT } = LAYOUT;

export function drawFinalSection(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  version: ReportVersion,
  dict: ReportDictionary,
): number {
  const p = input.profile;

  y = drawSectionTitle(doc, y, dict.finalSection);

  // Large recommendation callout
  y = drawCalloutBox(doc, y, p.finalRecommendation, COLORS.BG_SECTION, COLORS.PRIMARY);
  y += 10;

  // Disclaimer
  y = drawHorizontalRule(doc, y, COLORS.MUTED);
  y = drawText(doc, y, dict.disclaimer, {
    size: 8,
    color: COLORS.MUTED,
  });
  y += 15;

  // Generated-by line
  y = drawText(doc, y, `${dict.generatedBy} — ${dict.versionLabel} ${version.version}`, {
    size: 8,
    color: COLORS.MUTED,
    style: "italic",
  });

  y = drawText(doc, y, `Template: ${version.templateVersion} | Engine: ${version.engineVersion}`, {
    size: 7,
    color: COLORS.MUTED,
  });

  return y;
}
