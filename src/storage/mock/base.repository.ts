// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Base In-Memory Repository
//  Implements the same interface as Sheets — for local dev / testing.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { BaseEntity, CreateInput, UpdateInput, FieldFilters } from "../types";
import { generateId, nowISO } from "../helpers/id";

export class BaseMockRepository<T extends BaseEntity> {
  protected store = new Map<string, T>();
  protected entityType: string;

  constructor(entityType: string) {
    this.entityType = entityType;
  }

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.store.values());
  }

  async findMany(
    filters?: FieldFilters<T>,
    limit?: number,
    offset?: number,
  ): Promise<T[]> {
    let results = await this.findAll();

    if (filters) {
      results = results.filter((e) => this.matchesFilters(e, filters));
    }
    if (offset && offset > 0) results = results.slice(offset);
    if (limit && limit > 0) results = results.slice(0, limit);

    return results;
  }

  async count(filters?: FieldFilters<T>): Promise<number> {
    if (!filters) return this.store.size;
    const all = await this.findAll();
    return all.filter((e) => this.matchesFilters(e, filters)).length;
  }

  async create(data: CreateInput<T>): Promise<T> {
    const id = generateId(this.entityType);
    const now = nowISO();
    const entity = { ...data, id, created_at: now } as unknown as T;

    if ("updated_at" in (data as Record<string, unknown>)) {
      (entity as Record<string, unknown>).updated_at = now;
    }

    this.store.set(id, entity);
    return entity;
  }

  async update(id: string, data: UpdateInput<T>): Promise<T> {
    const existing = this.store.get(id);
    if (!existing) {
      throw new Error(`${this.entityType}: entity with id "${id}" not found`);
    }
    const merged = { ...existing, ...data } as T;
    if ("updated_at" in merged) {
      (merged as Record<string, unknown>).updated_at = nowISO();
    }
    this.store.set(id, merged);
    return merged;
  }

  async archive(id: string): Promise<T> {
    return this.update(id, { archived_at: nowISO() } as unknown as UpdateInput<T>);
  }

  // ─── Helpers ───────────────────────────────────────────────────

  protected matchesFilters(entity: T, filters: FieldFilters<T>): boolean {
    for (const [key, filterValue] of Object.entries(filters)) {
      if (filterValue === undefined) continue;
      const entityValue = (entity as Record<string, unknown>)[key];
      if (Array.isArray(filterValue)) {
        if (!filterValue.includes(entityValue as never)) return false;
      } else {
        if (entityValue !== filterValue) return false;
      }
    }
    return true;
  }

  /** For testing: seed data directly. */
  seed(entities: T[]): void {
    for (const e of entities) {
      this.store.set(e.id, e);
    }
  }

  /** For testing: clear all data. */
  clear(): void {
    this.store.clear();
  }
}
