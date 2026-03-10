// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Audit logging — structured events for security and compliance
//  In mock/dev: logs to console. In live: can be extended to write to audit_log sheet.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type AuditAction =
  | "candidate.created"
  | "candidate.updated"
  | "candidate.archived"
  | "candidate.viewed"
  | "session.started"
  | "session.completed"
  | "report.generated"
  | "report.downloaded"
  | "settings.viewed"
  | "admin.action";

export interface AuditEntry {
  at: string;
  action: AuditAction;
  actor?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

function isLive(): boolean {
  return (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_APP_MODE === "live") ?? false;
}

/**
 * Log an audit event. In development logs to console; in production
 * can be extended to append to audit_log storage.
 */
export function audit(entry: Omit<AuditEntry, "at">): void {
  const full: AuditEntry = { ...entry, at: new Date().toISOString() };
  if (typeof console !== "undefined" && console.info) {
    console.info("[audit]", JSON.stringify(full));
  }
  // Future: if (isLive()) await getRepository().audit.append(full);
}
