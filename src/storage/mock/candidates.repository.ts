// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Candidates Mock Repository — with name search
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { CandidateRepository } from "../interfaces";
import type { Candidate, CreateInput } from "../types";
import { BaseMockRepository } from "./base.repository";
import { normalizeName, nameMatches } from "../helpers/search";
import { generateInviteToken, nowISO } from "../helpers/id";

export class CandidatesMockRepository
  extends BaseMockRepository<Candidate>
  implements CandidateRepository
{
  constructor() {
    super("candidates");
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

  async searchByName(query: string, limit: number = 50): Promise<Candidate[]> {
    if (!query.trim()) return this.findAll();

    const all = await this.findAll();
    const active = all.filter((c) => !c.archived_at);
    const normalizedQuery = normalizeName(query);

    const results = active.filter((c) => {
      if (c.full_name.toLowerCase().includes(query.toLowerCase())) return true;
      return nameMatches(c.full_name_normalized, normalizedQuery);
    });

    return results.slice(0, limit);
  }

  async update(id: string, data: Partial<Candidate>): Promise<Candidate> {
    if (data.full_name) {
      data.full_name_normalized = normalizeName(data.full_name);
    }
    return super.update(id, data);
  }
}
