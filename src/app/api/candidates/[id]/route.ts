import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { jsonError, jsonOk } from "@/lib/api-utils";
import { resultsToSummaryCard } from "@/lib/reporting/resultsToSummaryCard";
import { audit } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const repo = getRepository();
    const candidate = await repo.candidates.getById(params.id);
    if (!candidate) return jsonError("Candidate not found", 404);

    const session = await repo.sessions.getByCandidate(params.id);
    const results = await repo.results.getByCandidate(params.id);

    let summaryCard = null;
    let reportUrl: string | null = null;
    if (results) {
      summaryCard = resultsToSummaryCard(
        candidate.id,
        candidate.fullName,
        candidate.position,
        results
      );
      reportUrl = results.reportUrl ?? null;
    }

    return jsonOk({ candidate, session, summaryCard, reportUrl });
  } catch (err) {
    console.error(`[GET /api/candidates/${params.id}]`, err);
    return jsonError("Failed to fetch candidate", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const repo = getRepository();
    const candidate = await repo.candidates.getById(params.id);
    if (!candidate) return jsonError("Candidate not found", 404);

    const body = await request.json();
    const updated = await repo.candidates.update(params.id, body);
    return jsonOk({ candidate: updated });
  } catch (err) {
    console.error(`[PATCH /api/candidates/${params.id}]`, err);
    return jsonError("Failed to update candidate", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const repo = getRepository();
    const candidate = await repo.candidates.getById(params.id);
    if (!candidate) return jsonError("Candidate not found", 404);

    await repo.candidates.update(params.id, {
      archivedAt: new Date().toISOString(),
    });
    audit({ action: "candidate.archived", resourceId: params.id, details: { candidateName: candidate.fullName } });
    return jsonOk({ ok: true, message: "Candidate archived" });
  } catch (err) {
    console.error(`[DELETE /api/candidates/${params.id}]`, err);
    return jsonError("Failed to archive candidate", 500);
  }
}
