// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ZIMA Role-Fit Block — Placeholder Content (Pending Approval)
//
//  Use these only where final question text or copy is not yet approved.
//  Do NOT treat as final. Replace with approved content before production.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ZIMADimension } from "../shared/types";
import { ZIMA_SUPPORT_ROLE_ID, ZIMA_ROLE_LABELS } from "./schema";

// ─── TODO: Support-only role weight row ──────────────────────────────
//
// When all four frontline role-fit scores are below threshold, the
// interpretation layer may recommend "Low-frontline-fit / support only".
// This row defines how we score "support" fit (e.g. higher weight on
// process, lower on client_focus, pace). Pending product approval.

/** Placeholder: weights for support_only role. Not used in engine primary/secondary. */
export const ZIMA_SUPPORT_ONLY_WEIGHTS_PLACEHOLDER: Readonly<Record<ZIMADimension, number>> = {
  pace: 0.05,
  autonomy: 0.08,
  collaboration: 0.12,
  risk: 0.03,
  innovation: 0.05,
  client_focus: 0.05,
  process: 0.22,
  resilience: 0.10,
  ambiguity: 0.05,
  growth: 0.25,
};

// ─── TODO: Optional extra items (if product adds dimensions or items) ─
//
// When new dimensions or items are approved, add them here first as
// placeholders, then move to questions.ts once approved.

export const ZIMA_PLACEHOLDER_ITEMS: readonly {
  id: string;
  dimension: ZIMADimension;
  reversed: boolean;
  text: string;
  todo: string;
}[] = [
  // Example: future dimension or extra item
  // {
  //   id: "zima_newdim_01",
  //   dimension: "process",
  //   reversed: false,
  //   text: "TODO: [Final approved question text for new/optional item.]",
  //   todo: "Replace with approved wording; add to questions.ts and dimension if new.",
  // },
];

// ─── Low-frontline-fit recommendation copy ───────────────────────────
//
// Shown when max(frontline role-fit scores) < ZIMA_LOW_FRONTLINE_FIT_THRESHOLD.
// Inferred from product logic; copy pending approval.

export const ZIMA_LOW_FRONTLINE_FIT_MESSAGE_EN =
  "Low frontline sales fit — consider for support or operational role only. Recommend structured interview to confirm fit for client-facing responsibilities.";
export const ZIMA_LOW_FRONTLINE_FIT_MESSAGE_RU =
  "Низкое соответствие фронтовым продажам — рассмотреть только для поддержки или операционной роли. Рекомендуется структурированное интервью для подтверждения готовности к клиентской работе.";

// Re-export role label for support_only for use in reports
export { ZIMA_ROLE_LABELS, ZIMA_SUPPORT_ROLE_ID };
