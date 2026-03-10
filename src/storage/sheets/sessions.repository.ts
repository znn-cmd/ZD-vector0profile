// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Assessment Sessions Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { SessionRepository } from "../interfaces";
import type { AssessmentSession } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";

export class SessionsSheetsRepository
  extends BaseSheetsRepository<AssessmentSession>
  implements SessionRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.ASSESSMENT_SESSIONS);
  }

  async findByCandidateId(candidateId: string): Promise<AssessmentSession[]> {
    return this.findMany({ candidate_id: candidateId } as Record<string, unknown>);
  }

  async findActiveSession(candidateId: string): Promise<AssessmentSession | null> {
    const sessions = await this.findByCandidateId(candidateId);
    return (
      sessions.find((s) => s.status === "in_progress") ??
      sessions.find((s) => s.status === "not_started") ??
      null
    );
  }
}
