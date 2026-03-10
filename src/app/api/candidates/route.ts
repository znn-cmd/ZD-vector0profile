import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { genId } from "@/lib/id";
import { jsonError, jsonOk, validateRequired } from "@/lib/api-utils";
import type { Lang } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const includeArchived = request.nextUrl.searchParams.get("archived") === "1";
    const repo = getRepository();
    const candidates = await repo.candidates.list({ includeArchived });
    return jsonOk({ candidates });
  } catch (err) {
    console.error("[GET /api/candidates]", err);
    return jsonError("Failed to fetch candidates", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const missing = validateRequired(body, ["fullName", "email", "position"]);
    if (missing) return jsonError(missing);

    const { fullName, email, phone, position, lang, hrId } = body as {
      fullName: string;
      email: string;
      phone?: string;
      position: string;
      lang?: Lang;
      hrId?: string;
    };

    const repo = getRepository();
    const candidate = await repo.candidates.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      position: position.trim(),
      inviteToken: genId("inv", 24),
      lang: lang ?? "en",
      status: "invited",
      hrId: hrId ?? "hr_1",
    });

    return jsonOk({ candidate }, 201);
  } catch (err) {
    console.error("[POST /api/candidates]", err);
    return jsonError("Failed to create candidate", 500);
  }
}
