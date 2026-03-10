// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Stable ID Generation
//  Prefixed, collision-resistant IDs that never depend on row numbers.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { randomBytes } from "crypto";

const ENTITY_PREFIXES: Record<string, string> = {
  hr_users:             "hr",
  candidates:           "cand",
  assessment_sessions:  "sess",
  scores:               "scr",
  reports:              "rpt",
  notification_log:     "ntf",
  audit_log:            "aud",
};

/**
 * Generates a prefixed ID: `{prefix}_{random}`
 * Example: `cand_a1b2c3d4e5`
 */
export function generateId(entityType: string, length: number = 10): string {
  const prefix = ENTITY_PREFIXES[entityType] ?? entityType.slice(0, 4);
  const bytes = randomBytes(Math.ceil(length / 2));
  const hex = bytes.toString("hex").slice(0, length);
  return `${prefix}_${hex}`;
}

/**
 * Generates a cryptographically random invite token.
 */
export function generateInviteToken(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * Returns current ISO-8601 timestamp.
 */
export function nowISO(): string {
  return new Date().toISOString();
}
