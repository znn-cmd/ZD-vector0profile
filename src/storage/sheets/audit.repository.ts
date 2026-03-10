// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Audit Log Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { AuditLogRepository } from "../interfaces";
import type { AuditLog, CreateInput } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";

export class AuditSheetsRepository
  extends BaseSheetsRepository<AuditLog>
  implements AuditLogRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.AUDIT_LOG);
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.findMany({
      entity_type: entityType,
      entity_id: entityId,
    } as Record<string, unknown>);
  }

  async findByActor(actorId: string, limit: number = 50): Promise<AuditLog[]> {
    return this.findMany(
      { actor_id: actorId } as Record<string, unknown>,
      limit,
    );
  }

  /** Convenience: create + return in one call. */
  async log(entry: CreateInput<AuditLog>): Promise<AuditLog> {
    return this.create(entry);
  }
}
