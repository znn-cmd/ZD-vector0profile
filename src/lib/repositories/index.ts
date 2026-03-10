import type { DataRepository } from "./types";
import { mockRepository } from "./mock-adapter";

let _sheetsRepo: DataRepository | null = null;

export function getRepository(): DataRepository {
  const mode = process.env.NEXT_PUBLIC_APP_MODE ?? "mock";
  if (mode === "live") {
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error(
        "Live mode requires GOOGLE_SPREADSHEET_ID. Set it in .env.local or use NEXT_PUBLIC_APP_MODE=mock for local dev."
      );
    }
    if (!_sheetsRepo) {
      const { sheetsRepository } = require("./sheets-adapter");
      _sheetsRepo = sheetsRepository;
    }
    return _sheetsRepo!;
  }
  return mockRepository;
}

export type { DataRepository } from "./types";
