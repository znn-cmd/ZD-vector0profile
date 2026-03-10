// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Report Types — versioning, metadata, web summary card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FinalProfile, OverallBand, SalesRole, DISCScale, RitchieScale, ZIMADimension } from "../engine/types";
import type { Lang } from "../storage/types";

// ─── Report Versioning ───────────────────────────────────────────────

export interface ReportVersion {
  version: string;          // "V1", "V2", etc.
  generatedAt: string;      // ISO-8601
  templateVersion: string;  // e.g. "2026.03.1"
  engineVersion: string;    // assessment engine version
  language: Lang;
}

// ─── Report Input ────────────────────────────────────────────────────

export interface ReportInput {
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  assessedAt: string;
  language: Lang;
  profile: FinalProfile;
  /** Previous version number (for auto-increment). Null = first report. */
  previousVersion: string | null;
}

// ─── Report Output ───────────────────────────────────────────────────

export interface ReportOutput {
  pdfBuffer: Buffer;
  fileName: string;
  version: ReportVersion;
  summaryCard: WebSummaryCard;
}

// ─── Web Summary Card (compact dashboard data) ──────────────────────

export interface WebSummaryCard {
  candidateId: string;
  candidateName: string;
  position: string;
  assessedAt: string;
  overallScore: number;
  overallBand: OverallBand;
  primaryRole: SalesRole;
  secondaryRole: SalesRole;
  discProfile: {
    primary: DISCScale;
    secondary: DISCScale;
    label: string;
    overall: number;
    sjtScore: number;
    scales: Record<DISCScale, number>;
  };
  ritchieProfile: {
    topMotivators: RitchieScale[];
    bottomMotivators: RitchieScale[];
    bestRoleFit: { role: SalesRole; score: number; fit: string };
    scales: Record<RitchieScale, number>;
  };
  zimaProfile: {
    fitScore: number;
    primaryRole: SalesRole;
    redFlagCount: number;
    dimensions: Record<ZIMADimension, number>;
  };
  strengths: string[];
  risks: string[];
  interviewQuestions: string[];
  managementRecs: string[];
  retentionFlags: string[];
  recommendation: string;
  reportVersion: string;
}

// ─── PDF Layout Constants ────────────────────────────────────────────

export const LAYOUT = {
  PAGE_WIDTH: 595.28,        // A4 pt
  PAGE_HEIGHT: 841.89,       // A4 pt
  MARGIN_LEFT: 50,
  MARGIN_RIGHT: 50,
  MARGIN_TOP: 60,
  MARGIN_BOTTOM: 60,
  CONTENT_WIDTH: 495.28,     // PAGE_WIDTH - margins
  LINE_HEIGHT: 16,
  SECTION_GAP: 30,
} as const;

export const COLORS = {
  PRIMARY: [20, 40, 80] as const,       // deep navy
  SECONDARY: [60, 120, 180] as const,   // steel blue
  ACCENT: [220, 165, 50] as const,      // gold
  TEXT: [30, 30, 30] as const,           // near-black
  TEXT_LIGHT: [100, 100, 110] as const,  // grey
  MUTED: [150, 155, 165] as const,
  BG_LIGHT: [245, 246, 250] as const,   // light grey background
  BG_SECTION: [235, 238, 245] as const,
  SUCCESS: [40, 150, 80] as const,      // green
  WARNING: [220, 165, 50] as const,     // amber
  DANGER: [200, 60, 60] as const,       // red
  WHITE: [255, 255, 255] as const,
  BAR_BG: [225, 228, 235] as const,     // bar chart background
} as const;

export type RGB = readonly [number, number, number];
