// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Report Generator — Orchestrator
//
//  Assembles a full "Personal Vector Profile" PDF:
//    1. Resolves version (V1, V2, …)
//    2. Creates jsPDF document
//    3. Draws all sections in order
//    4. Adds page numbers + footers
//    5. Returns PDF buffer + summary card
//
//  Old reports remain immutable — regenerating always increments version.
//  jsPDF is dynamically imported to avoid server-side DOM issues.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ReportInput, ReportOutput, ReportVersion } from "./types";
import { LAYOUT } from "./types";
import { getReportDict } from "./i18n";
import { addPageNumber, addFooter } from "./pdf-primitives";
import {
  drawCover,
  drawExecutiveSummary,
  drawDISCSection,
  drawZIMASection,
  drawRitchieSection,
  drawInsightsSection,
  drawFinalSection,
} from "./sections";
import { buildSummaryCard } from "./summary-card";

const TEMPLATE_VERSION = "2026.03.1";
const ENGINE_VERSION = "1.0.0";

// ─── Version Resolution ──────────────────────────────────────────────

function resolveVersion(previousVersion: string | null, language: string): ReportVersion {
  let versionNumber = 1;
  if (previousVersion) {
    const match = previousVersion.match(/V(\d+)/);
    if (match) versionNumber = parseInt(match[1], 10) + 1;
  }

  return {
    version: `V${versionNumber}`,
    generatedAt: new Date().toISOString(),
    templateVersion: TEMPLATE_VERSION,
    engineVersion: ENGINE_VERSION,
    language: language as "en" | "ru",
  };
}

// ─── File Name Generation ────────────────────────────────────────────

function buildFileName(candidateName: string, version: string): string {
  const safeName = candidateName
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `VectorProfile_${safeName}_${version}_${date}.pdf`;
}

// ─── Main Generator ──────────────────────────────────────────────────

export async function generateReport(input: ReportInput): Promise<ReportOutput> {
  // Dynamically import jsPDF to avoid SSR DOM access issues
  const { jsPDF } = await import("jspdf");

  const version = resolveVersion(input.previousVersion, input.language);
  const dict = getReportDict(input.language);
  const fileName = buildFileName(input.candidateName, version.version);

  // Create PDF document (A4, portrait, pt units)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // ── Page 1: Cover ──────────────────────────────────────────────
  drawCover(doc, input, version, dict);

  // ── Page 2+: Content ───────────────────────────────────────────
  doc.addPage();
  let y: number = LAYOUT.MARGIN_TOP;

  // Executive Summary
  y = drawExecutiveSummary(doc, y, input, dict);
  y += LAYOUT.SECTION_GAP;

  // DISC Behavioral Profile
  y = drawDISCSection(doc, y, input, dict);
  y += LAYOUT.SECTION_GAP;

  // ZIMA Role-Fit Analysis
  y = drawZIMASection(doc, y, input, dict);
  y += LAYOUT.SECTION_GAP;

  // Ritchie–Martin Motivational Profile
  y = drawRitchieSection(doc, y, input, dict);
  y += LAYOUT.SECTION_GAP;

  // Strengths, Risks, Management, Interview, Retention
  y = drawInsightsSection(doc, y, input, dict);
  y += LAYOUT.SECTION_GAP;

  // Final Hiring Recommendation
  y = drawFinalSection(doc, y, input, version, dict);

  // ── Page Numbers + Footers ─────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addPageNumber(doc, i - 1, dict.pageLabel);
    addFooter(doc, `${dict.confidential} — ${dict.generatedBy}`);
  }

  // ── Output ─────────────────────────────────────────────────────
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const summaryCard = buildSummaryCard(input, version);

  return {
    pdfBuffer,
    fileName,
    version,
    summaryCard,
  };
}
