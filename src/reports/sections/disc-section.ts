import type { jsPDF } from "jspdf";
import type { ReportInput } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { COLORS } from "../types";
import type { DISCScale } from "../../engine/types";
import {
  drawSectionTitle, drawSubsectionTitle, drawKeyValue,
  drawBarChart, drawText, drawBulletList, drawHorizontalRule,
  drawScoreBadge, ensureSpace, getScoreColor, setFont,
} from "../pdf-primitives";

const DISC_SCALES: DISCScale[] = ["D", "I", "S", "C", "K"];

export function drawDISCSection(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  dict: ReportDictionary,
): number {
  const disc = input.profile.disc;

  y = drawSectionTitle(doc, y, dict.discSection);

  // Overview row
  y = drawKeyValue(doc, y, dict.discOverall, `${disc.overall}/100`);
  y = drawKeyValue(doc, y, dict.discProfile, disc.scaleProfile.label);
  y = drawKeyValue(doc, y, dict.discBand, dict.discBands[disc.band] ?? disc.band);
  y = drawKeyValue(doc, y, dict.discSJT, `${disc.sjtScore.normalized}/100`);
  y = drawKeyValue(doc, y, dict.discValidity,
    disc.validity.isValid ? dict.validLabel : `${dict.invalidLabel} — ${disc.validity.flags.join("; ")}`);
  y = drawKeyValue(doc, y, dict.discConsistency,
    disc.consistency.isConsistent
      ? `${dict.consistentLabel} (${disc.consistency.score}/100)`
      : `${dict.inconsistentLabel} (${disc.consistency.score}/100)`);
  y += 10;

  // Scale bar chart
  y = drawSubsectionTitle(doc, y, dict.discScales);

  const bars = DISC_SCALES.map((s) => ({
    label: `${dict.discScaleLabels[s]} (${s})`,
    value: disc.scales[s].normalized,
  }));

  y = drawBarChart(doc, y, bars, { labelWidth: 140 });
  y += 5;

  // SJT bar
  y = drawBarChart(doc, y, [{
    label: `SJT`,
    value: disc.sjtScore.normalized,
    color: getScoreColor(disc.sjtScore.normalized),
  }], { labelWidth: 140 });

  // Band reasons
  if (disc.bandReasons.length > 0) {
    y += 10;
    y = drawSubsectionTitle(doc, y, dict.discBand);
    y = drawBulletList(doc, y, disc.bandReasons, { color: COLORS.TEXT_LIGHT });
  }

  return y + 10;
}
