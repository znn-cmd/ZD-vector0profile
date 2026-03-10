// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Reports Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { ReportRepository } from "../interfaces";
import type { ReportRecord } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";

export class ReportsSheetsRepository
  extends BaseSheetsRepository<ReportRecord>
  implements ReportRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.REPORTS);
  }

  async findByCandidateId(candidateId: string): Promise<ReportRecord[]> {
    return this.findMany({ candidate_id: candidateId } as Record<string, unknown>);
  }

  async findBySessionId(sessionId: string): Promise<ReportRecord[]> {
    return this.findMany({ session_id: sessionId } as Record<string, unknown>);
  }
}
