import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return jsonError("Unauthorized", 401);
    return jsonOk(user);
  } catch (err) {
    console.error("[GET /api/auth/me]", err);
    return jsonError("Unauthorized", 401);
  }
}
