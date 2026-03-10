import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { defaultBlockOrder } from "@/config/assessments";
import { computeFullResults, isSessionComplete } from "@/lib/services/scoring";
import { onCandidateStarted, onCandidateCompleted } from "@/lib/services/notification";
import { jsonError, jsonOk } from "@/lib/api-utils";
import type { AssessmentBlockId, BlockProgress, AnswerValue } from "@/types";

/** POST: Save answers (autosave). Creates session if first call. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, blockId, answers } = body as {
      candidateId: string;
      blockId: AssessmentBlockId;
      answers: Record<string, AnswerValue>;
    };

    if (!candidateId || !blockId) return jsonError("Missing candidateId or blockId");
    if (!answers || typeof answers !== "object") return jsonError("Invalid answers payload");

    const repo = getRepository();
    const candidate = await repo.candidates.getById(candidateId);
    if (!candidate) return jsonError("Candidate not found", 404);

    let session = await repo.sessions.getByCandidate(candidateId);

    if (!session) {
      const now = new Date().toISOString();
      const progress = {} as Record<AssessmentBlockId, BlockProgress>;
      for (const b of defaultBlockOrder) {
        progress[b] = {
          status: b === blockId ? "in_progress" : "not_started",
          answers: b === blockId ? answers : {},
          ...(b === blockId ? { startedAt: now } : {}),
        };
      }

      session = await repo.sessions.create({
        candidateId,
        currentBlock: blockId,
        blockOrder: defaultBlockOrder,
        progress,
        startedAt: now,
        lastActiveAt: now,
      });

      // Status transition: invited → in_progress
      if (candidate.status === "invited") {
        await repo.candidates.updateStatus(candidateId, "in_progress");
        onCandidateStarted(candidate).catch(() => {});
      }

      return jsonOk({ session });
    }

    // Guard: don't allow updates to completed sessions
    if (session.completedAt) {
      return jsonError("Session already completed", 409);
    }

    // Merge answers into existing block progress
    const blockProgress = session.progress[blockId] ?? { status: "not_started", answers: {} };
    const mergedAnswers = { ...blockProgress.answers, ...answers };

    session.progress[blockId] = {
      ...blockProgress,
      status: blockProgress.status === "completed" ? "completed" : "in_progress",
      answers: mergedAnswers,
      startedAt: blockProgress.startedAt ?? new Date().toISOString(),
    };
    session.currentBlock = blockId;
    session.lastActiveAt = new Date().toISOString();

    await repo.sessions.saveProgress(session.id, session);
    return jsonOk({ session });
  } catch (err) {
    console.error("[POST /api/progress]", err);
    return jsonError("Failed to save progress", 500);
  }
}

/** PUT: Mark a block as complete. Checks if all blocks done → completes session. */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, blockId } = body as {
      candidateId: string;
      blockId: AssessmentBlockId;
    };

    if (!candidateId || !blockId) return jsonError("Missing candidateId or blockId");

    const repo = getRepository();
    const session = await repo.sessions.getByCandidate(candidateId);
    if (!session) return jsonError("Session not found", 404);
    if (session.completedAt) return jsonError("Session already completed", 409);

    // Mark the block complete
    session.progress[blockId] = {
      ...session.progress[blockId],
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    // Check if all blocks are now complete
    if (isSessionComplete(session)) {
      session.completedAt = new Date().toISOString();

      let results = null;
      try {
        results = computeFullResults(session);
        await repo.results.save(results);
      } catch (scoreErr) {
        console.error("[Scoring Error]", scoreErr);
        // Still mark session complete even if scoring fails
      }

      const candidate = await repo.candidates.getById(candidateId);
      if (candidate) {
        await repo.candidates.updateStatus(candidateId, "completed");
        onCandidateCompleted(candidate).catch(() => {});
      }

      await repo.sessions.saveProgress(session.id, session);
      return jsonOk({ session, results, complete: true });
    }

    // Move to next block
    const currentIdx = session.blockOrder.indexOf(blockId);
    const nextBlock = session.blockOrder[currentIdx + 1];
    if (nextBlock) {
      session.currentBlock = nextBlock;
      if (session.progress[nextBlock].status === "not_started") {
        session.progress[nextBlock] = {
          ...session.progress[nextBlock],
          status: "in_progress",
          startedAt: new Date().toISOString(),
        };
      }
    }

    await repo.sessions.saveProgress(session.id, session);
    return jsonOk({ session, complete: false });
  } catch (err) {
    console.error("[PUT /api/progress]", err);
    return jsonError("Failed to complete block", 500);
  }
}
