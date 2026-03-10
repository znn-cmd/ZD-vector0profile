// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Scores Sheets Repository
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { ScoreRepository } from "../interfaces";
import type { ScoreRecord } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";

export class ScoresSheetsRepository
  extends BaseSheetsRepository<ScoreRecord>
  implements ScoreRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.SCORES);
  }

  async findBySessionId(sessionId: string): Promise<ScoreRecord[]> {
    return this.findMany({ session_id: sessionId } as Record<string, unknown>);
  }

  async findByCandidateId(candidateId: string): Promise<ScoreRecord[]> {
    return this.findMany({ candidate_id: candidateId } as Record<string, unknown>);
  }

  async findFinalScore(sessionId: string): Promise<ScoreRecord | null> {
    const all = await this.findBySessionId(sessionId);
    return all.find((s) => s.block_id === "final") ?? null;
  }
}
