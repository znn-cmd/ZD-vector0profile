import type { jsPDF } from "jspdf";
import type { ReportInput } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { COLORS } from "../types";
import {
  drawSectionTitle, drawBulletList, drawHorizontalRule,
  drawCalloutBox, drawText, ensureSpace,
} from "../pdf-primitives";

/** Strengths + Risks + Management Recs + Interview Qs + Retention */
export function drawInsightsSection(
  doc: jsPDF,
  y: number,
  input: ReportInput,
  dict: ReportDictionary,
): number {
  const p = input.profile;

  // ── Strengths ──────────────────────────────────────────────────
  y = drawSectionTitle(doc, y, dict.strengthsSection);
  y = drawBulletList(doc, y, p.strengths, { bulletChar: "✦", color: COLORS.SUCCESS });
  y += 5;

  // ── Risks ──────────────────────────────────────────────────────
  y = drawSectionTitle(doc, y, dict.risksSection);
  if (p.risks.length > 0) {
    y = drawBulletList(doc, y, p.risks, { bulletChar: "▸", color: COLORS.DANGER });
  } else {
    y = drawText(doc, y, "—", { color: COLORS.TEXT_LIGHT });
  }
  y += 5;

  // ── Management Recommendations ─────────────────────────────────
  y = drawSectionTitle(doc, y, dict.managementSection);
  y = drawBulletList(doc, y, p.managementStyleRecommendations, { bulletChar: "→" });
  y += 5;

  // ── Interview Focus Questions ──────────────────────────────────
  y = drawSectionTitle(doc, y, dict.interviewSection);
  y = drawBulletList(doc, y, p.interviewFocusQuestions, { bulletChar: "?" });
  y += 5;

  // ── Retention Risk Flags ───────────────────────────────────────
  if (p.retentionRiskFlags.length > 0) {
    y = drawSectionTitle(doc, y, dict.retentionSection);
    y = drawBulletList(doc, y, p.retentionRiskFlags, { bulletChar: "⚠", color: COLORS.WARNING });
  }

  return y + 5;
}
