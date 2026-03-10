// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Notification Log Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { NotificationLogRepository } from "../interfaces";
import type { NotificationLog } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";
import { nowISO } from "../helpers/id";

export class NotificationsSheetsRepository
  extends BaseSheetsRepository<NotificationLog>
  implements NotificationLogRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.NOTIFICATION_LOG);
  }

  async findByRecipient(recipientId: string, limit: number = 50): Promise<NotificationLog[]> {
    return this.findMany(
      { recipient_id: recipientId } as Record<string, unknown>,
      limit,
    );
  }

  async findRecent(limit: number = 20): Promise<NotificationLog[]> {
    const all = await this.findAll();
    // Sort by created_at descending
    all.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
    return all.slice(0, limit);
  }

  async markSent(id: string, sentAt?: string): Promise<NotificationLog> {
    return this.update(id, {
      status: "sent",
      sent_at: sentAt ?? nowISO(),
    });
  }

  async markFailed(id: string, error: string): Promise<NotificationLog> {
    const existing = await this.findById(id);
    const retryCount = existing ? existing.retry_count + 1 : 1;
    return this.update(id, {
      status: "failed",
      error,
      retry_count: retryCount,
    });
  }
}
