// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PDF Primitives — layout helpers, chart drawing, page management
//
//  jsPDF coordinates: origin = top-left, y increases downward.
//  All helpers accept and return the current Y position for chaining.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { jsPDF } from "jspdf";
import { LAYOUT, COLORS, type RGB } from "./types";

const { MARGIN_LEFT, MARGIN_RIGHT, MARGIN_TOP, MARGIN_BOTTOM,
  CONTENT_WIDTH, PAGE_WIDTH, PAGE_HEIGHT, LINE_HEIGHT, SECTION_GAP } = LAYOUT;

// ─── Page Management ─────────────────────────────────────────────────

/** Ensures enough vertical space; adds a new page if needed. */
export function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    return MARGIN_TOP;
  }
  return y;
}

export function addPageNumber(doc: jsPDF, pageNum: number, label: string): void {
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.MUTED);
  doc.text(`${label} ${pageNum}`, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 30, { align: "right" });
}

export function addFooter(doc: jsPDF, text: string): void {
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.MUTED);
  doc.text(text, MARGIN_LEFT, PAGE_HEIGHT - 20);
}

// ─── Typography ──────────────────────────────────────────────────────

export function setFont(doc: jsPDF, style: "normal" | "bold" | "italic" = "normal", size: number = 10): void {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
}

export function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  y = ensureSpace(doc, y, 40);

  // Section divider line
  doc.setDrawColor(...COLORS.PRIMARY);
  doc.setLineWidth(1.5);
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH, y);
  y += 12;

  // Title text
  setFont(doc, "bold", 14);
  doc.setTextColor(...COLORS.PRIMARY);
  doc.text(title, MARGIN_LEFT, y);
  y += 20;

  return y;
}

export function drawSubsectionTitle(doc: jsPDF, y: number, title: string): number {
  y = ensureSpace(doc, y, 24);
  setFont(doc, "bold", 11);
  doc.setTextColor(...COLORS.SECONDARY);
  doc.text(title, MARGIN_LEFT, y);
  y += 16;
  return y;
}

/** Draws wrapped body text. Returns new Y. */
export function drawText(
  doc: jsPDF,
  y: number,
  text: string,
  opts?: { indent?: number; maxWidth?: number; color?: RGB; size?: number; style?: "normal" | "bold" | "italic" },
): number {
  const indent = opts?.indent ?? 0;
  const maxW = opts?.maxWidth ?? CONTENT_WIDTH - indent;
  setFont(doc, opts?.style ?? "normal", opts?.size ?? 10);
  doc.setTextColor(...(opts?.color ?? COLORS.TEXT));

  const lines = doc.splitTextToSize(text, maxW);
  for (const line of lines) {
    y = ensureSpace(doc, y, LINE_HEIGHT);
    doc.text(line, MARGIN_LEFT + indent, y);
    y += LINE_HEIGHT;
  }
  return y;
}

/** Draws a label: value pair */
export function drawKeyValue(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  opts?: { labelWidth?: number },
): number {
  y = ensureSpace(doc, y, LINE_HEIGHT);
  const lw = opts?.labelWidth ?? 160;

  setFont(doc, "bold", 10);
  doc.setTextColor(...COLORS.TEXT);
  doc.text(label, MARGIN_LEFT, y);

  setFont(doc, "normal", 10);
  doc.setTextColor(...COLORS.TEXT);
  doc.text(value, MARGIN_LEFT + lw, y);

  y += LINE_HEIGHT;
  return y;
}

/** Draws a bullet list */
export function drawBulletList(
  doc: jsPDF,
  y: number,
  items: string[],
  opts?: { bulletChar?: string; indent?: number; color?: RGB },
): number {
  const bullet = opts?.bulletChar ?? "•";
  const indent = opts?.indent ?? 15;

  setFont(doc, "normal", 9.5);
  doc.setTextColor(...(opts?.color ?? COLORS.TEXT));

  for (const item of items) {
    y = ensureSpace(doc, y, LINE_HEIGHT + 4);
    doc.text(bullet, MARGIN_LEFT + indent - 10, y);

    const lines = doc.splitTextToSize(item, CONTENT_WIDTH - indent - 10);
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) y = ensureSpace(doc, y, LINE_HEIGHT);
      doc.text(lines[i], MARGIN_LEFT + indent, y);
      y += LINE_HEIGHT - 2;
    }
    y += 2;
  }
  return y;
}

// ─── Charts & Visualizations ─────────────────────────────────────────

/** Draws a horizontal bar chart. */
export function drawBarChart(
  doc: jsPDF,
  y: number,
  bars: { label: string; value: number; maxValue?: number; color?: RGB }[],
  opts?: { barHeight?: number; labelWidth?: number; showValue?: boolean },
): number {
  const barH = opts?.barHeight ?? 14;
  const labelW = opts?.labelWidth ?? 120;
  const barMaxW = CONTENT_WIDTH - labelW - 45;
  const gap = 6;

  for (const bar of bars) {
    y = ensureSpace(doc, y, barH + gap + 4);
    const maxV = bar.maxValue ?? 100;
    const pct = Math.min(bar.value / maxV, 1);

    // Label
    setFont(doc, "normal", 9);
    doc.setTextColor(...COLORS.TEXT);
    doc.text(bar.label, MARGIN_LEFT, y + barH / 2 + 3);

    // Background bar
    doc.setFillColor(...COLORS.BAR_BG);
    doc.roundedRect(MARGIN_LEFT + labelW, y, barMaxW, barH, 2, 2, "F");

    // Fill bar
    const color = bar.color ?? getScoreColor(bar.value);
    doc.setFillColor(...color);
    const fillW = Math.max(barMaxW * pct, 2);
    doc.roundedRect(MARGIN_LEFT + labelW, y, fillW, barH, 2, 2, "F");

    // Value text
    if (opts?.showValue !== false) {
      setFont(doc, "bold", 9);
      doc.setTextColor(...COLORS.TEXT);
      doc.text(String(Math.round(bar.value)), MARGIN_LEFT + labelW + barMaxW + 8, y + barH / 2 + 3);
    }

    y += barH + gap;
  }
  return y;
}

/** Draws a score badge (rounded rectangle with score). */
export function drawScoreBadge(
  doc: jsPDF,
  x: number,
  y: number,
  score: number,
  label: string,
  opts?: { width?: number; height?: number },
): void {
  const w = opts?.width ?? 80;
  const h = opts?.height ?? 50;
  const color = getScoreColor(score);

  // Badge background
  doc.setFillColor(...color);
  doc.roundedRect(x, y, w, h, 4, 4, "F");

  // Score number
  setFont(doc, "bold", 20);
  doc.setTextColor(...COLORS.WHITE);
  doc.text(String(Math.round(score)), x + w / 2, y + 22, { align: "center" });

  // Label below
  setFont(doc, "normal", 7);
  doc.setTextColor(...COLORS.WHITE);
  doc.text(label, x + w / 2, y + 36, { align: "center" });
}

/** Draws a band label badge */
export function drawBandBadge(
  doc: jsPDF,
  x: number,
  y: number,
  bandText: string,
  band: string,
): void {
  const color = getBandColor(band);
  const w = Math.max(doc.getTextWidth(bandText) + 20, 100);

  doc.setFillColor(...color);
  doc.roundedRect(x, y, w, 22, 3, 3, "F");

  setFont(doc, "bold", 10);
  doc.setTextColor(...COLORS.WHITE);
  doc.text(bandText, x + w / 2, y + 15, { align: "center" });
}

/** Draws a filled box with text for callouts / highlights */
export function drawCalloutBox(
  doc: jsPDF,
  y: number,
  text: string,
  bgColor: RGB = COLORS.BG_LIGHT,
  textColor: RGB = COLORS.TEXT,
): number {
  y = ensureSpace(doc, y, 50);

  setFont(doc, "normal", 9.5);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 24);
  const boxH = lines.length * (LINE_HEIGHT - 2) + 20;

  doc.setFillColor(...bgColor);
  doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, boxH, 4, 4, "F");

  doc.setTextColor(...textColor);
  let ty = y + 14;
  for (const line of lines) {
    doc.text(line, MARGIN_LEFT + 12, ty);
    ty += LINE_HEIGHT - 2;
  }

  return y + boxH + 8;
}

/** Draws a thin horizontal rule */
export function drawHorizontalRule(doc: jsPDF, y: number, color: RGB = COLORS.BG_SECTION): number {
  y = ensureSpace(doc, y, 10);
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH, y);
  return y + 10;
}

// ─── Color Helpers ───────────────────────────────────────────────────

export function getScoreColor(score: number): RGB {
  if (score >= 75) return COLORS.SUCCESS;
  if (score >= 55) return COLORS.SECONDARY;
  if (score >= 40) return COLORS.WARNING;
  return COLORS.DANGER;
}

export function getBandColor(band: string): RGB {
  switch (band) {
    case "strong_hire":
    case "strong_shortlist":
    case "strong":
      return COLORS.SUCCESS;
    case "recommended":
    case "moderate":
    case "conditional":
      return COLORS.SECONDARY;
    default:
      return COLORS.DANGER;
  }
}
