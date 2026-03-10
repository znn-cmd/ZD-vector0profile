// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HR Users Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { HRUserRepository } from "../interfaces";
import type { HRUser } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";

export class HRUsersSheetsRepository
  extends BaseSheetsRepository<HRUser>
  implements HRUserRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.HR_USERS);
  }

  async findByEmail(email: string): Promise<HRUser | null> {
    const all = await this.findAll();
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findByTelegramChatId(chatId: string): Promise<HRUser | null> {
    const all = await this.findAll();
    return all.find((u) => u.telegram_chat_id === chatId) ?? null;
  }

  async findWithTelegram(): Promise<HRUser[]> {
    const all = await this.findAll();
    return all.filter((u) => u.telegram_chat_id && u.status === "active");
  }
}
