import type { jsPDF } from "jspdf";
import type { ReportInput, ReportVersion } from "../types";
import type { ReportDictionary } from "../i18n/types";
import { LAYOUT, COLORS } from "../types";
import { setFont } from "../pdf-primitives";

const { PAGE_WIDTH, PAGE_HEIGHT, MARGIN_LEFT, CONTENT_WIDTH } = LAYOUT;

export function drawCover(
  doc: jsPDF,
  input: ReportInput,
  version: ReportVersion,
  dict: ReportDictionary,
): void {
  const cx = PAGE_WIDTH / 2;

  // Top accent bar
  doc.setFillColor(...COLORS.PRIMARY);
  doc.rect(0, 0, PAGE_WIDTH, 8, "F");

  // Gold accent line
  doc.setFillColor(...COLORS.ACCENT);
  doc.rect(0, 8, PAGE_WIDTH, 3, "F");

  // ZIMA logo area (text-based since we can't embed SVG reliably in jsPDF)
  let y = 100;
  setFont(doc, "bold", 12);
  doc.setTextColor(...COLORS.ACCENT);
  doc.text("ZIMA DUBAI", cx, y, { align: "center" });

  // Main title
  y = 180;
  setFont(doc, "bold", 32);
  doc.setTextColor(...COLORS.PRIMARY);
  doc.text(dict.reportTitle, cx, y, { align: "center" });

  // Subtitle
  y += 30;
  setFont(doc, "normal", 14);
  doc.setTextColor(...COLORS.TEXT_LIGHT);
  doc.text(dict.reportSubtitle, cx, y, { align: "center" });

  // Divider
  y += 30;
  doc.setDrawColor(...COLORS.ACCENT);
  doc.setLineWidth(1);
  doc.line(cx - 80, y, cx + 80, y);

  // Candidate info block
  y += 50;
  const infoX = MARGIN_LEFT + 60;
  const valX = MARGIN_LEFT + 220;

  const infoPairs = [
    [dict.candidateLabel, input.candidateName],
    [dict.positionLabel, input.position],
    [dict.departmentLabel, input.department],
    [dict.dateLabel, formatDate(input.assessedAt)],
    [dict.versionLabel, version.version],
  ];

  for (const [label, value] of infoPairs) {
    setFont(doc, "normal", 11);
    doc.setTextColor(...COLORS.TEXT_LIGHT);
    doc.text(label, infoX, y);

    setFont(doc, "bold", 11);
    doc.setTextColor(...COLORS.TEXT);
    doc.text(value, valX, y);
    y += 22;
  }

  // Confidential stamp
  y = PAGE_HEIGHT - 120;
  doc.setFillColor(...COLORS.BG_LIGHT);
  const stampW = 180;
  doc.roundedRect(cx - stampW / 2, y, stampW, 28, 3, 3, "F");
  setFont(doc, "bold", 10);
  doc.setTextColor(...COLORS.DANGER);
  doc.text(dict.confidential, cx, y + 18, { align: "center" });

  // Bottom accent bar
  doc.setFillColor(...COLORS.PRIMARY);
  doc.rect(0, PAGE_HEIGHT - 11, PAGE_WIDTH, 8, "F");
  doc.setFillColor(...COLORS.ACCENT);
  doc.rect(0, PAGE_HEIGHT - 14, PAGE_WIDTH, 3, "F");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return iso; }
}
