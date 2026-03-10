// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Candidates Sheets Repository
//  Extends base with:
//  - invite token lookup
//  - full-name search (partial + normalized Russian/English)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { CandidateRepository } from "../interfaces";
import type { Candidate, CreateInput } from "../types";
import { BaseSheetsRepository } from "./base.repository";
import { TABS } from "../schema";
import { normalizeName, nameMatches } from "../helpers/search";
import { generateInviteToken, nowISO } from "../helpers/id";
import { columnIndex } from "../schema";

export class CandidatesSheetsRepository
  extends BaseSheetsRepository<Candidate>
  implements CandidateRepository
{
  constructor(client: SheetsClient) {
    super(client, TABS.CANDIDATES);
  }

  async create(data: CreateInput<Candidate>): Promise<Candidate> {
    const enriched = {
      ...data,
      full_name_normalized: normalizeName(data.full_name),
      invite_token: data.invite_token || generateInviteToken(),
      status: data.status || "invited",
      language: data.language || "en",
      updated_at: nowISO(),
      archived_at: null,
    } as CreateInput<Candidate>;

    return super.create(enriched);
  }

  async findByInviteToken(token: string): Promise<Candidate | null> {
    const all = await this.findAll();
    return all.find((c) => c.invite_token === token) ?? null;
  }

  /**
   * Searches candidates by full name (ФИО).
   *
   * Strategy:
   * 1. Try exact substring match against full_name (case-insensitive)
   * 2. Fall back to normalized (transliterated) search against full_name_normalized
   * 3. Partial: every query word must appear somewhere in the name
   */
  async searchByName(query: string, limit: number = 50): Promise<Candidate[]> {
    if (!query.trim()) return this.findAll();

    const all = await this.findAll();

    // Filter out archived
    const active = all.filter((c) => !c.archived_at);

    const normalizedQuery = normalizeName(query);

    const results = active.filter((c) => {
      // Pass 1: case-insensitive original name match
      if (c.full_name.toLowerCase().includes(query.toLowerCase())) return true;
      // Pass 2: normalized match (handles Cyrillic ↔ Latin)
      return nameMatches(c.full_name_normalized, normalizedQuery);
    });

    return results.slice(0, limit);
  }

  async update(id: string, data: Partial<Candidate>): Promise<Candidate> {
    // Re-normalize name if it changes
    if (data.full_name) {
      data.full_name_normalized = normalizeName(data.full_name);
    }
    return super.update(id, data);
  }
}
