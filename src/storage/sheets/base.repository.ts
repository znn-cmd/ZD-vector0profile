// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Base Google Sheets Repository
//
//  Generic CRUD implementation backed by a single spreadsheet tab.
//  Subclass this and provide entity-specific row↔object mapping.
//
//  Features:
//  - find by ID, find many with filters, pagination
//  - append row, update row by ID
//  - archive instead of delete
//  - defensive: pads short rows, skips malformed rows
//  - all writes go through retry-capable SheetsClient
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { SheetsClient } from "../google/sheets.client";
import type { BaseEntity, CreateInput, UpdateInput, FieldFilters } from "../types";
import type { TabName } from "../schema";
import { HEADERS, ID_COLUMN_INDEX } from "../schema";
import { generateId, nowISO } from "../helpers/id";

export class BaseSheetsRepository<T extends BaseEntity> {
  protected tabName: TabName;
  protected headers: string[];
  protected client: SheetsClient;

  constructor(client: SheetsClient, tabName: TabName) {
    this.client = client;
    this.tabName = tabName;
    this.headers = HEADERS[tabName];
  }

  // ─── Row ↔ Entity Mapping ───────────────────────────────────────

  /**
   * Converts a sheet row (string[]) to a typed entity.
   * Pads short rows with empty strings to avoid index errors.
   */
  protected rowToEntity(row: string[]): T {
    const padded = this.padRow(row);
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < this.headers.length; i++) {
      const key = this.headers[i];
      const val = padded[i] ?? "";
      obj[key] = this.deserializeField(key, String(val));
    }
    return obj as T;
  }

  /**
   * Converts a typed entity to a sheet row (string[]).
   */
  protected entityToRow(entity: T): string[] {
    return this.headers.map((h) => {
      const val = (entity as Record<string, unknown>)[h];
      return this.serializeField(h, val);
    });
  }

  /**
   * Override in subclasses for custom deserialization (e.g. number fields).
   */
  protected deserializeField(header: string, value: string): unknown {
    if (value === "" || value === undefined || value === null) return "";
    // Auto-detect numeric fields
    if (header.endsWith("_score") || header.endsWith("_count") || header.endsWith("_index")) {
      const n = Number(value);
      return isNaN(n) ? value : n;
    }
    return value;
  }

  /**
   * Override in subclasses for custom serialization.
   */
  protected serializeField(_header: string, value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  // ─── Read Operations ───────────────────────────────────────────

  async findById(id: string): Promise<T | null> {
    const rows = await this.client.getDataRows(this.tabName);
    const row = rows.find((r) => r[ID_COLUMN_INDEX] === id);
    if (!row) return null;
    return this.rowToEntity(row);
  }

  async findAll(): Promise<T[]> {
    const rows = await this.client.getDataRows(this.tabName);
    return rows
      .filter((r) => r[ID_COLUMN_INDEX]) // skip blank rows
      .map((r) => this.rowToEntity(r));
  }

  async findMany(
    filters?: FieldFilters<T>,
    limit?: number,
    offset?: number,
  ): Promise<T[]> {
    let entities = await this.findAll();

    if (filters) {
      entities = entities.filter((e) => this.matchesFilters(e, filters));
    }

    if (offset && offset > 0) {
      entities = entities.slice(offset);
    }
    if (limit && limit > 0) {
      entities = entities.slice(0, limit);
    }

    return entities;
  }

  async count(filters?: FieldFilters<T>): Promise<number> {
    if (!filters) {
      const rows = await this.client.getDataRows(this.tabName);
      return rows.filter((r) => r[ID_COLUMN_INDEX]).length;
    }
    const entities = await this.findAll();
    return entities.filter((e) => this.matchesFilters(e, filters)).length;
  }

  // ─── Write Operations ──────────────────────────────────────────

  async create(data: CreateInput<T>): Promise<T> {
    const id = generateId(this.tabName);
    const now = nowISO();

    const entity = {
      ...data,
      id,
      created_at: now,
    } as unknown as T;

    // Set updated_at if the entity type has it
    if ("updated_at" in (data as Record<string, unknown>)) {
      (entity as Record<string, unknown>).updated_at = now;
    }

    const row = this.entityToRow(entity);
    await this.client.appendRows(this.tabName, [row]);
    return entity;
  }

  async update(id: string, data: UpdateInput<T>): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`${this.tabName}: entity with id "${id}" not found`);
    }

    const merged = { ...existing, ...data } as T;

    // Always bump updated_at if the entity has it
    if ("updated_at" in merged) {
      (merged as Record<string, unknown>).updated_at = nowISO();
    }

    const row = this.entityToRow(merged);
    const updated = await this.client.updateRowById(this.tabName, id, row);
    if (updated === null) {
      throw new Error(`${this.tabName}: failed to locate row for id "${id}" during update`);
    }

    return merged;
  }

  async archive(id: string): Promise<T> {
    return this.update(id, { archived_at: nowISO() } as unknown as UpdateInput<T>);
  }

  // ─── Filter Matching ──────────────────────────────────────────

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

  // ─── Helpers ───────────────────────────────────────────────────

  /** Pads a row to the expected header length with empty strings. */
  private padRow(row: string[]): string[] {
    if (row.length >= this.headers.length) return row;
    return [...row, ...Array(this.headers.length - row.length).fill("")];
  }
}
