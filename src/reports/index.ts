// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Dubai Vector Profile — Reports Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { generateReport } from "./generator";
export { buildSummaryCard } from "./summary-card";
export { getReportDict } from "./i18n";
export type { ReportDictionary } from "./i18n/types";
export type {
  ReportInput,
  ReportOutput,
  ReportVersion,
  WebSummaryCard,
} from "./types";
export { LAYOUT, COLORS } from "./types";
