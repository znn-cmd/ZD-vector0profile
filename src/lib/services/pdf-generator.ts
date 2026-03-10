import type { AssessmentResults, Candidate } from "@/types";
import { defaultReportTemplate } from "@/config/reports/reportTemplates";

interface ReportInput {
  candidate: Candidate;
  results: AssessmentResults;
}

export function generatePDFReport(input: ReportInput): Buffer {
  // Dynamic import avoids jsPDF attempting DOM access at module load time
  const { jsPDF } = require("jspdf") as typeof import("jspdf");
  const { candidate, results } = input;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 30;

  // ─── Header ────────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setTextColor(66, 99, 235); // zima-700
  doc.text("ZIMA Dubai", margin, y);
  y += 8;
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Vector Profile Assessment Report", margin, y);
  y += 15;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ─── Candidate Info ────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Candidate: ${candidate.fullName}`, margin, y);
  y += 6;
  doc.text(`Position: ${candidate.position}`, margin, y);
  y += 6;
  doc.text(`Date: ${new Date(results.generatedAt).toLocaleDateString()}`, margin, y);
  y += 6;
  doc.text(`Assessment Version: ${defaultReportTemplate.version}`, margin, y);
  y += 15;

  // ─── DISC Section ──────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setTextColor(66, 99, 235);
  doc.text("1. Behavioral Profile (DISC)", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Profile Type: ${results.disc.profileLabel}`, margin, y);
  y += 7;
  doc.text(`Primary: ${results.disc.primaryType} (${results.disc.normalized[results.disc.primaryType]}%)`, margin, y);
  y += 7;
  doc.text(`Secondary: ${results.disc.secondaryType} (${results.disc.normalized[results.disc.secondaryType]}%)`, margin, y);
  y += 10;

  // DISC bar chart
  const dimensions: Array<{ label: string; key: "D" | "I" | "S" | "C"; color: [number, number, number] }> = [
    { label: "D - Dominance", key: "D", color: [220, 53, 69] },
    { label: "I - Influence", key: "I", color: [255, 193, 7] },
    { label: "S - Steadiness", key: "S", color: [40, 167, 69] },
    { label: "C - Conscientiousness", key: "C", color: [0, 123, 255] },
  ];

  for (const dim of dimensions) {
    doc.setFontSize(9);
    doc.text(dim.label, margin, y);
    const barWidth = ((pageWidth - margin * 2 - 50) * results.disc.normalized[dim.key]) / 100;
    doc.setFillColor(...dim.color);
    doc.rect(margin + 50, y - 3, barWidth, 4, "F");
    doc.text(`${results.disc.normalized[dim.key]}%`, margin + 52 + barWidth, y);
    y += 8;
  }
  y += 10;

  // ─── ZIMA Section ──────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setTextColor(66, 99, 235);
  doc.text("2. Cognitive Assessment (ZIMA)", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Score: ${results.zima.totalScore}/30`, margin, y);
  y += 7;
  doc.text(`Percentile: ${results.zima.percentile}th`, margin, y);
  y += 7;
  doc.text(`Level: ${results.zima.level.replace("_", " ").toUpperCase()}`, margin, y);
  y += 10;

  const categories = Object.entries(results.zima.categories);
  for (const [cat, score] of categories) {
    doc.setFontSize(9);
    const label = cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    doc.text(`${label}: ${score}/6`, margin + 5, y);
    y += 6;
  }
  y += 10;

  // ─── Ritchie-Martin Section ────────────────────────────────────────
  if (y > 230) {
    doc.addPage();
    y = 30;
  }

  doc.setFontSize(16);
  doc.setTextColor(66, 99, 235);
  doc.text("3. Motivation Profile (Ritchie-Martin)", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Top Motivators:", margin, y);
  y += 7;
  for (const m of results.ritchieMartin.topMotivators) {
    doc.text(
      `  • ${m.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — ${results.ritchieMartin.motivators[m]}%`,
      margin,
      y
    );
    y += 6;
  }
  y += 5;

  doc.text("Lowest Motivators:", margin, y);
  y += 7;
  for (const m of results.ritchieMartin.bottomMotivators) {
    doc.text(
      `  • ${m.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — ${results.ritchieMartin.motivators[m]}%`,
      margin,
      y
    );
    y += 6;
  }
  y += 15;

  // ─── Footer ────────────────────────────────────────────────────────
  const footerText =
    process.env.PDF_FOOTER_TEXT ??
    "Confidential — ZIMA Dubai Vector Profile Assessment";
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.text(footerText, margin, pageHeight - 10);
  doc.text(
    `Generated: ${new Date().toISOString().split("T")[0]}`,
    pageWidth - margin - 40,
    pageHeight - 10
  );

  return Buffer.from(doc.output("arraybuffer"));
}
