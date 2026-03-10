import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return jsonError("Token required");

    const repo = getRepository();
    const candidate = await repo.candidates.getByToken(token.trim());
    if (!candidate) return jsonError("Invalid or expired invite link", 404);

    const session = await repo.sessions.getByCandidate(candidate.id);
    return jsonOk({ candidate, session });
  } catch (err) {
    console.error("[GET /api/invite]", err);
    return jsonError("Failed to validate invite", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, resend } = body as { candidateId?: string; resend?: boolean };

    if (!candidateId) return jsonError("candidateId required");

    const repo = getRepository();
    const candidate = await repo.candidates.getById(candidateId);
    if (!candidate) return jsonError("Candidate not found", 404);

    if (resend) {
      // In a real system, this would re-send the invite email/message
      return jsonOk({ ok: true, message: "Invite resent", inviteToken: candidate.inviteToken });
    }

    return jsonOk({ ok: true, inviteToken: candidate.inviteToken });
  } catch (err) {
    console.error("[POST /api/invite]", err);
    return jsonError("Failed to process invite", 500);
  }
}
