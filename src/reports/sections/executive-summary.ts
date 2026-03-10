import type { jsPDF } from "jspdf";
import type { ReportInput } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { LAYOUT, COLORS } from "../types";
import {
  drawSectionTitle, drawKeyValue, drawScoreBadge,
  drawBandBadge, drawText, drawCalloutBox, ensureSpace,
} from "../pdf-primitives";

const { MARGIN_LEFT, CONTENT_WIDTH } = LAYOUT;

export function drawExecutiveSummary(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  dict: ReportDictionary,
): number {
  const p = input.profile;

  y = drawSectionTitle(doc, y, dict.executiveSummary);

  // Score badges row
  y = ensureSpace(doc, y, 70);
  const badgeY = y;
  const badgeGap = 95;

  drawScoreBadge(doc, MARGIN_LEFT, badgeY, p.overallScore, dict.overallScore);
  drawScoreBadge(doc, MARGIN_LEFT + badgeGap, badgeY, p.disc.overall, "DISC");
  drawScoreBadge(doc, MARGIN_LEFT + badgeGap * 2, badgeY, p.disc.sjtScore.normalized, "SJT");
  drawScoreBadge(doc, MARGIN_LEFT + badgeGap * 3, badgeY, p.zima.fitScore, "ZIMA Fit");

  y = badgeY + 60;

  // Band badge
  const bandLabel = dict.bands[p.overallBand] ?? p.overallBand;
  drawBandBadge(doc, MARGIN_LEFT + badgeGap * 4 + 10, badgeY + 10, bandLabel, p.overallBand);

  y += 10;

  // Key-value pairs
  y = drawKeyValue(doc, y, dict.recommendedRole, dict.roleLabels[p.primaryRole] ?? p.primaryRole);
  y = drawKeyValue(doc, y, dict.secondaryRole, dict.roleLabels[p.secondaryRole] ?? p.secondaryRole);
  y = drawKeyValue(doc, y, dict.discProfile, p.disc.scaleProfile.label);
  y += 5;

  // Recommendation callout
  y = drawCalloutBox(doc, y, p.finalRecommendation, COLORS.BG_SECTION, COLORS.PRIMARY);

  return y;
}
