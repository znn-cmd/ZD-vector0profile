import type { jsPDF } from "jspdf";
import type { ReportInput } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { COLORS } from "../types";
import type { ZIMADimension, SalesRole } from "../../engine/types";
import {
  drawSectionTitle, drawSubsectionTitle, drawKeyValue,
  drawBarChart, drawBulletList, drawHorizontalRule,
  getScoreColor, getBandColor, ensureSpace,
} from "../pdf-primitives";

const ALL_DIMS: ZIMADimension[] = [
  "pace", "autonomy", "collaboration", "risk", "innovation",
  "client_focus", "process", "resilience", "ambiguity", "growth",
];

const ALL_ROLES: SalesRole[] = ["hunter", "full_cycle", "consultative", "team_lead"];

export function drawZIMASection(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  dict: ReportDictionary,
): number {
  const zima = input.profile.zima;

  y = drawSectionTitle(doc, y, dict.zimaSection);

  // Overview
  y = drawKeyValue(doc, y, dict.zimaFitScore, `${zima.fitScore}/100`);
  y = drawKeyValue(doc, y, dict.zimaPrimaryRole, dict.roleLabels[zima.primaryRole] ?? zima.primaryRole);
  y = drawKeyValue(doc, y, dict.zimaSecondaryRole, dict.roleLabels[zima.secondaryRole] ?? zima.secondaryRole);
  y += 10;

  // Dimension bar chart
  y = drawSubsectionTitle(doc, y, dict.zimaDimensions);

  const dimBars = ALL_DIMS.map((d) => ({
    label: dict.zimaDimensionLabels[d] ?? d,
    value: zima.dimensions[d].normalized,
  }));
  y = drawBarChart(doc, y, dimBars, { labelWidth: 150 });
  y += 10;

  // Role fit scores
  y = drawSubsectionTitle(doc, y, dict.ritchieRoleFit);
  const roleBars = ALL_ROLES.map((r) => ({
    label: dict.roleLabels[r] ?? r,
    value: zima.roleFitScores[r],
    color: getScoreColor(zima.roleFitScores[r]),
  }));
  y = drawBarChart(doc, y, roleBars, { labelWidth: 200 });
  y += 10;

  // Red flags
  if (zima.redFlags.length > 0) {
    y = drawSubsectionTitle(doc, y, dict.zimaRedFlags);
    const flagTexts = zima.redFlags.map((f) =>
      `[${dict.severityLabels[f.severity] ?? f.severity}] ${f.message}`
    );
    y = drawBulletList(doc, y, flagTexts, { bulletChar: "▸", color: COLORS.DANGER });
    y += 5;
  }

  // Environment notes
  if (zima.environmentNotes.length > 0) {
    y = drawSubsectionTitle(doc, y, dict.zimaEnvironment);
    y = drawBulletList(doc, y, zima.environmentNotes, { color: COLORS.TEXT_LIGHT });
    y += 5;
  }

  // Training recommendations
  if (zima.trainingRecommendations.length > 0) {
    y = drawSubsectionTitle(doc, y, dict.zimaTraining);
    y = drawBulletList(doc, y, zima.trainingRecommendations);
  }

  return y + 10;
}
