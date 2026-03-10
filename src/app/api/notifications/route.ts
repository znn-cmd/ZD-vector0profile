import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const repo = getRepository();
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");
    const notifications = await repo.notifications.list(Math.min(limit, 200));
    return jsonOk({ notifications });
  } catch (err) {
    console.error("[GET /api/notifications]", err);
    return jsonError("Failed to fetch notifications", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const repo = getRepository();
    const body = await request.json();

    if (body.action === "mark_all_read") {
      await repo.notifications.markAllRead();
      return jsonOk({ ok: true });
    }

    if (body.id) {
      await repo.notifications.markRead(body.id);
      return jsonOk({ ok: true });
    }

    return jsonError("Provide action or id");
  } catch (err) {
    console.error("[PUT /api/notifications]", err);
    return jsonError("Failed to update notifications", 500);
  }
}

// Keep PATCH as alias for backwards compat
export { PUT as PATCH };
