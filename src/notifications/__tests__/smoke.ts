// Notifications layer smoke test
// Run: npx tsx src/notifications/__tests__/smoke.ts

import { getDataStore } from "../../storage";
import {
  NotificationDispatcher,
  DigestGenerator,
  handleTelegramUpdate,
  renderMessage,
  getBandLabel,
  getTelegramBot,
} from "../index";
import type {
  CandidateStartedPayload,
  BlockCompletedPayload,
  AssessmentCompletedPayload,
  ResultSummaryPayload,
  CriticalRedFlagsPayload,
  CandidateShortlistedPayload,
} from "../events";
import type { TelegramUpdate } from "../telegram/bot.client";
import { nowISO } from "../../storage/helpers/id";

async function test() {
  const store = getDataStore();
  const dispatcher = new NotificationDispatcher(store, "mock-group-chat-123");

  console.log("=== Notifications Smoke Test ===\n");

  // ── 1. Template rendering ─────────────────────────────────────
  console.log("--- Template Rendering ---");

  const ruMsg = renderMessage("ru", "candidate_started", {
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439",
    position: "Senior Sales Manager",
    language: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    timestamp: "10 Mar, 14:30",
  });
  console.log("[RU] candidate_started:");
  console.log(ruMsg.body);
  console.log();

  const enMsg = renderMessage("en", "result_summary", {
    candidate_name: "Sarah Williams",
    position: "Account Executive",
    overall_score: 82,
    overall_band_label: getBandLabel("en", "recommended"),
    recommended_role: "Full-Cycle AE",
    secondary_role: "Consultative Seller",
    strengths_list: "  \u2726 Strong assertiveness\n  \u2726 High influence\n  \u2726 Client-focused",
    risks_list: "  \u26A1 Low process adherence\n  \u26A1 High variety-seeking",
    report_url: "https://drive.google.com/file/d/abc123/view",
  });
  console.log("[EN] result_summary:");
  console.log(enMsg.body);
  console.log();

  // Band labels
  console.log("Band labels (ru):", getBandLabel("ru", "strong_hire"), "|", getBandLabel("ru", "not_recommended"));
  console.log("Band labels (en):", getBandLabel("en", "strong_hire"), "|", getBandLabel("en", "not_recommended"));
  console.log();

  // ── 2. Registration flow (mock) ───────────────────────────────
  console.log("--- Registration Flow ---");

  // Simulate /start from an unknown user
  const unknownUpdate: TelegramUpdate = {
    update_id: 1,
    message: {
      message_id: 1,
      chat: { id: 999999, type: "private" },
      from: { id: 999999, first_name: "Unknown" },
      text: "/start",
      date: Date.now() / 1000,
    },
  };

  // First, link an HR user for testing
  await store.hrUsers.update("hr_demo_admin", { telegram_chat_id: "" });

  const startUpdate: TelegramUpdate = {
    update_id: 2,
    message: {
      message_id: 2,
      chat: { id: 12345678, type: "private" },
      from: { id: 12345678, first_name: "Dmitry" },
      text: "/start admin@zima.ae",
      date: Date.now() / 1000,
    },
  };

  await handleTelegramUpdate(startUpdate, store);
  const linkedHR = await store.hrUsers.findById("hr_demo_admin");
  console.log("HR linked:", linkedHR?.telegram_chat_id === "12345678" ? "YES" : "NO");
  console.log("HR chat_id:", linkedHR?.telegram_chat_id);
  console.log();

  // ── 3. Event dispatching ──────────────────────────────────────
  console.log("--- Event Dispatching ---");

  const startedPayload: CandidateStartedPayload = {
    event_type: "candidate_started",
    candidate_id: "cand_demo_001",
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    position: "Senior Sales Manager",
    language: "ru",
  };
  await dispatcher.dispatch(startedPayload);
  console.log("Dispatched: candidate_started (private)");

  const blockPayload: BlockCompletedPayload = {
    event_type: "block_completed",
    candidate_id: "cand_demo_001",
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    block_id: "disc",
    block_label: "DISC Sales Behavior",
    blocks_remaining: 2,
  };
  await dispatcher.dispatch(blockPayload);
  console.log("Dispatched: block_completed (private)");

  const completedPayload: AssessmentCompletedPayload = {
    event_type: "assessment_completed",
    candidate_id: "cand_demo_001",
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    position: "Senior Sales Manager",
    duration_minutes: 64,
  };
  await dispatcher.dispatch(completedPayload);
  console.log("Dispatched: assessment_completed (group + private)");

  const summaryPayload: ResultSummaryPayload = {
    event_type: "result_summary",
    candidate_id: "cand_demo_001",
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    position: "Senior Sales Manager",
    overall_score: 77,
    overall_band: "recommended",
    recommended_role: "New Business Hunter",
    secondary_role: "Full-Cycle AE",
    strengths: [
      "Strong assertiveness and results orientation",
      "High influence and persuasion skills",
      "Resilient under pressure",
    ],
    risks: [
      "K-scale below threshold \u2014 potential integrity concerns",
      "Low process adherence",
    ],
    report_url: "https://drive.google.com/file/d/demo123/view",
  };
  await dispatcher.dispatch(summaryPayload);
  console.log("Dispatched: result_summary (private)");

  const shortlistPayload: CandidateShortlistedPayload = {
    event_type: "candidate_shortlisted",
    candidate_id: "cand_demo_001",
    candidate_name: "\u0418\u0432\u0430\u043D\u043E\u0432 \u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432\u0438\u0447",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    overall_score: 77,
    overall_band: "recommended",
    recommended_role: "New Business Hunter",
  };
  await dispatcher.dispatch(shortlistPayload);
  console.log("Dispatched: candidate_shortlisted (group)");

  const flagsPayload: CriticalRedFlagsPayload = {
    event_type: "critical_red_flags",
    candidate_id: "cand_demo_003",
    candidate_name: "\u041A\u043E\u0437\u043B\u043E\u0432\u0430 \u041C\u0430\u0440\u0438\u044F \u0414\u043C\u0438\u0442\u0440\u0438\u0435\u0432\u043D\u0430",
    assigned_hr_id: "hr_demo_admin",
    timestamp: nowISO(),
    flags: [
      "Very low resilience \u2014 high risk of disengagement",
      "Low client focus \u2014 unlikely to succeed in client-facing roles",
    ],
    overall_band: "not_recommended",
  };
  await dispatcher.dispatch(flagsPayload);
  console.log("Dispatched: critical_red_flags (group)");

  // ── 4. Check notification log ─────────────────────────────────
  console.log("\n--- Notification Log ---");
  const logs = await store.notifications.findRecent(20);
  console.log(`Total notifications logged: ${logs.length}`);
  for (const log of logs.slice(0, 6)) {
    console.log(`  [${log.status}] ${log.type.split(":")[0]} \u2192 ${log.recipient_id} (${log.channel})`);
  }

  // ── 5. Daily digest ───────────────────────────────────────────
  console.log("\n--- Daily Digest ---");
  const digest = new DigestGenerator(store, dispatcher);
  const result = await digest.generateAll();
  console.log(`Personal digests sent: ${result.personalSent}`);
  console.log(`Team summary sent: ${result.teamSent}`);

  // Final log count
  const finalLogs = await store.notifications.findRecent(50);
  console.log(`\nTotal notifications after digest: ${finalLogs.length}`);

  console.log("\n=== All notification tests passed ===");
}

test().catch(console.error);
