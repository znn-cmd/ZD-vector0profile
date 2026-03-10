import type { jsPDF } from "jspdf";
import type { ReportInput } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { COLORS, LAYOUT } from "../types";
import type { RitchieScale, SalesRole } from "../../engine/types";
import {
  drawSectionTitle, drawSubsectionTitle,
  drawBarChart, drawBulletList, drawKeyValue,
  drawBandBadge, ensureSpace, setFont, getScoreColor,
} from "../pdf-primitives";

const ALL_SCALES: RitchieScale[] = [
  "INC", "REC", "ACH", "POW", "VAR", "AUT",
  "STR", "REL", "VAL", "DEV", "SEC", "DRI",
];

const ALL_ROLES: SalesRole[] = ["hunter", "full_cycle", "consultative", "team_lead"];

export function drawRitchieSection(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  dict: ReportDictionary,
): number {
  const rm = input.profile.ritchie;

  y = drawSectionTitle(doc, y, dict.ritchieSection);

  // Top / bottom motivators
  y = drawKeyValue(doc, y, dict.ritchieTopMotivators,
    rm.topMotivators.map((s) => dict.ritchieScaleLabels[s] ?? s).join(", "));
  y = drawKeyValue(doc, y, dict.ritchieBottomMotivators,
    rm.bottomMotivators.map((s) => dict.ritchieScaleLabels[s] ?? s).join(", "));
  y += 10;

  // Full scale bar chart
  y = drawSubsectionTitle(doc, y, dict.ritchieScales);

  const bars = ALL_SCALES.map((s) => ({
    label: `${dict.ritchieScaleLabels[s]} (${s})`,
    value: rm.scales[s].normalized,
  }));
  y = drawBarChart(doc, y, bars, { labelWidth: 150 });
  y += 10;

  // Role fit table
  y = drawSubsectionTitle(doc, y, dict.ritchieRoleFit);

  for (const role of ALL_ROLES) {
    const fit = rm.roleFit[role];
    y = ensureSpace(doc, y, 40);

    // Role name and score bar
    const roleBars = [{
      label: `${dict.roleLabels[role]} — ${dict.roleFitLabels[fit.fit] ?? fit.fit}`,
      value: fit.score,
      color: getScoreColor(fit.score),
    }];
    y = drawBarChart(doc, y, roleBars, { labelWidth: 260 });

    // Critical gaps
    if (fit.criticalGaps.length > 0) {
      const gapTexts = fit.criticalGaps.map((g) =>
        `${dict.ritchieScaleLabels[g.scale] ?? g.scale}: ${g.score} (min: ${g.required})`,
      );
      y = drawBulletList(doc, y, gapTexts, {
        bulletChar: "△",
        indent: 20,
        color: COLORS.WARNING,
      });
    }
  }

  // Validity + consistency
  y += 5;
  y = drawKeyValue(doc, y, dict.discValidity,
    rm.validity.isValid ? dict.validLabel : `${dict.invalidLabel} (${rm.validity.score}/100)`);
  y = drawKeyValue(doc, y, dict.discConsistency,
    rm.consistency.isConsistent
      ? `${dict.consistentLabel} (${rm.consistency.score}/100)`
      : `${dict.inconsistentLabel} (${rm.consistency.score}/100)`);

  return y + 10;
}
