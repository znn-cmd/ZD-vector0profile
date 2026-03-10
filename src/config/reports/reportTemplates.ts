import type { ReportTemplate } from "@/types";

export const defaultReportTemplate: ReportTemplate = {
  id: "default_v2",
  name: "ZIMA Vector Profile — Standard Report",
  version: "2.0.0",
  isActive: true,
  sections: [
    {
      id: "summary",
      titleKey: "report.section.summary",
      type: "summary",
      order: 1,
    },
    {
      id: "disc_profile",
      titleKey: "report.section.disc",
      type: "disc_profile",
      order: 2,
    },
    {
      id: "zima_scores",
      titleKey: "report.section.zima",
      type: "zima_scores",
      order: 3,
    },
    {
      id: "ritchie_chart",
      titleKey: "report.section.ritchie",
      type: "ritchie_chart",
      order: 4,
    },
    {
      id: "recommendations",
      titleKey: "report.section.recommendations",
      type: "recommendations",
      order: 5,
    },
  ],
};

export const compactReportTemplate: ReportTemplate = {
  id: "compact_v1",
  name: "ZIMA Vector Profile — Compact Summary",
  version: "1.0.0",
  isActive: false,
  sections: [
    {
      id: "summary",
      titleKey: "report.section.summary",
      type: "summary",
      order: 1,
    },
    {
      id: "disc_profile",
      titleKey: "report.section.disc",
      type: "disc_profile",
      order: 2,
    },
    {
      id: "recommendations",
      titleKey: "report.section.recommendations",
      type: "recommendations",
      order: 3,
    },
  ],
};

export const reportTemplates: ReportTemplate[] = [
  defaultReportTemplate,
  compactReportTemplate,
];
