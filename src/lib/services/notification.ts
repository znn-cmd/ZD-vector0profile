import { getRepository } from "@/lib/repositories";
import {
  notifyCandidateStarted,
  notifyCandidateCompleted,
  notifyReportReady,
} from "./telegram";
import type { Candidate, Notification } from "@/types";

/**
 * Central notification service — creates DB record AND dispatches to Telegram.
 */
export async function emitNotification(
  data: Omit<Notification, "id" | "createdAt">
): Promise<Notification> {
  const repo = getRepository();
  const notification = await repo.notifications.create(data);
  return notification;
}

export async function onCandidateStarted(candidate: Candidate) {
  await emitNotification({
    type: "candidate_started",
    title: "Assessment Started",
    message: `${candidate.fullName} started the assessment`,
    candidateId: candidate.id,
    read: false,
  });

  // Fire-and-forget Telegram notification
  notifyCandidateStarted(candidate.fullName, candidate.position).catch(() => {});
}

export async function onCandidateCompleted(candidate: Candidate) {
  await emitNotification({
    type: "candidate_completed",
    title: "Assessment Completed",
    message: `${candidate.fullName} completed the assessment`,
    candidateId: candidate.id,
    read: false,
  });

  notifyCandidateCompleted(candidate.fullName, candidate.position).catch(() => {});
}

export async function onReportReady(candidate: Candidate, reportUrl: string) {
  await emitNotification({
    type: "report_ready",
    title: "Report Ready",
    message: `Report ready for ${candidate.fullName}`,
    candidateId: candidate.id,
    read: false,
  });

  notifyReportReady(candidate.fullName, reportUrl).catch(() => {});
}
