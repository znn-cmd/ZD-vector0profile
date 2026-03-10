import { jsonOk } from "@/lib/api-utils";
import { getAppMode } from "@/lib/env";

export async function GET() {
  return jsonOk({
    status: "ok",
    mode: getAppMode(),
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
