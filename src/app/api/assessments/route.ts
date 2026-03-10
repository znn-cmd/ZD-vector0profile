import { NextRequest, NextResponse } from "next/server";
import { assessmentConfigs } from "@/config/assessments";
import { getRepository } from "@/lib/repositories";
import { computeFullResults } from "@/lib/services/scoring";
import { jsonError, jsonOk } from "@/lib/api-utils";
import { audit } from "@/lib/audit";

export async function GET() {
  try {
    const configs = Object.values(assessmentConfigs).map((c) => ({
      id: c.id,
      title: c.titleKey,
      description: c.descriptionKey,
      estimatedMinutes: c.estimatedMinutes,
      version: c.version,
      questionCount: c.questions.length,
    }));
    return jsonOk({ configs });
  } catch (err) {
    console.error("[GET /api/assessments]", err);
    return jsonError("Failed to fetch configs", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId } = body as { candidateId?: string };
    if (!candidateId) return jsonError("candidateId required");

    const repo = getRepository();
    const candidate = await repo.candidates.getById(candidateId);
    if (!candidate) return jsonError("Candidate not found", 404);

    let results = await repo.results.getByCandidate(candidateId);
    if (!results) {
      const session = await repo.sessions.getByCandidate(candidateId);
      if (!session) return jsonError("No session found for candidate", 400);
      if (!session.completedAt) return jsonError("Assessment not yet completed", 400);

      results = computeFullResults(session);
      await repo.results.save(results);
    }

    // Dynamic import to avoid jsPDF at module load
    const { generatePDFReport } = await import("@/lib/services/pdf-generator");
    const { onReportReady } = await import("@/lib/services/notification");

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = generatePDFReport({ candidate, results });
    } catch (pdfErr) {
      console.error("[PDF Generation Error]", pdfErr);
      return jsonError("Failed to generate PDF report", 500);
    }

    await repo.candidates.updateStatus(candidateId, "report_generated");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const safeName = candidate.fullName.replace(/[^a-zA-Z0-9\u0400-\u04FF\s-]/g, "").replace(/\s+/g, "_");
    const fileName = `ZIMA_Report_${safeName}_V1_${new Date().toISOString().slice(0, 10)}.pdf`;

    let reportUrl: string;
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      try {
        const { uploadPDFToDrive } = await import("@/lib/google/drive");
        reportUrl = await uploadPDFToDrive(fileName, Buffer.from(pdfBuffer));
      } catch (driveErr) {
        console.error("[Drive upload failed, using app URL]", driveErr);
        reportUrl = `${baseUrl}/api/assessments?download=${candidateId}`;
      }
    } else {
      reportUrl = `${baseUrl}/api/assessments?download=${candidateId}`;
    }

    const reportVersion = "V1";
    await repo.results.update(candidateId, { reportUrl, reportVersion }).catch(() => null);
    audit({ action: "report.generated", resourceId: candidateId, details: { reportVersion, candidateName: candidate.fullName } });
    onReportReady(candidate, reportUrl).catch(() => {});

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ZIMA_Report_${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[POST /api/assessments]", err);
    return jsonError("Failed to generate report", 500);
  }
}
