// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram Template Renderer — Smoke Test & Example Output
//
//  Run: npx tsx src/lib/notifications/__tests__/renderTelegramTemplate.example.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  renderTelegramTemplate,
  renderWithBandLabel,
  renderResultSummary,
  renderDailyDigest,
  renderTeamSummary,
  getBandLabel,
} from "../renderTelegramTemplate";

function section(title: string) {
  console.log(`\n${"═".repeat(64)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(64)}`);
}

function show(label: string, msg: { subject: string; body: string } | null) {
  console.log(`\n--- ${label} ---`);
  if (!msg) { console.log("  (null — template not found)"); return; }
  console.log(`Subject: ${msg.subject}`);
  console.log(msg.body);
}

// ════════════════════════════════════════════════════════════════════
//  ENGLISH
// ════════════════════════════════════════════════════════════════════

section("GROUP TEMPLATES — EN");

show("candidate_completed_full_assessment", renderTelegramTemplate(
  "candidate_completed_full_assessment", "en", {
    candidate_name: "Alexei Petrov",
    applied_role: "Full-Cycle AE",
    duration_minutes: 63,
  },
));

show("report_generated", renderWithBandLabel(
  "report_generated", "en", {
    candidate_name: "Alexei Petrov",
    overall_band: "strong_hire",
    overall_score: 82,
    primary_role: "New Business Hunter",
    report_url: "https://app.zima.ae/reports/rpt_001",
  },
));

show("shortlist_candidate", renderWithBandLabel(
  "shortlist_candidate", "en", {
    candidate_name: "Maria Kuznetsova",
    overall_score: 78,
    overall_band: "strong_hire",
    primary_role: "Full-Cycle AE",
  },
));

show("critical_red_flags", renderWithBandLabel(
  "critical_red_flags", "en", {
    candidate_name: "Ivan Sidorov",
    flags_list: "  - Low resilience + low process = disengagement risk\n  - SJT score 42/100 — poor judgment",
    overall_band: "not_recommended",
  },
));

show("team_daily_summary", renderTeamSummary("en", {
  date: "10 Mar 2026",
  invited_today: 5,
  started_today: 3,
  completed_today: 2,
  timed_out_today: 1,
  shortlisted_today: 1,
  rejected_today: 0,
  pending_action_today: 2,
  top_candidates: [
    { name: "Alexei Petrov", score: 82, band: "strong_hire" },
    { name: "Maria Kuznetsova", score: 78, band: "recommended" },
  ],
}));

section("PRIVATE TEMPLATES — EN");

show("candidate_started", renderTelegramTemplate(
  "candidate_started", "en", {
    candidate_name: "Alexei Petrov",
    applied_role: "Full-Cycle AE",
    language: "English",
    timestamp: "10 Mar, 14:30",
  },
));

show("candidate_inactivity_risk", renderTelegramTemplate(
  "candidate_inactivity_risk", "en", {
    candidate_name: "Ivan Sidorov",
    applied_role: "Hunter",
    minutes_inactive: 45,
    current_block: "ZIMA Role-Fit",
    last_active: "10 Mar, 15:12",
  },
));

show("disc_completed", renderTelegramTemplate(
  "disc_completed", "en", {
    candidate_name: "Alexei Petrov",
    blocks_remaining: 2,
  },
));

show("zima_completed", renderTelegramTemplate(
  "zima_completed", "en", {
    candidate_name: "Alexei Petrov",
    blocks_remaining: 1,
  },
));

show("ritchie_completed", renderTelegramTemplate(
  "ritchie_completed", "en", {
    candidate_name: "Alexei Petrov",
    blocks_remaining: 0,
  },
));

show("assessment_completed", renderTelegramTemplate(
  "assessment_completed", "en", {
    candidate_name: "Alexei Petrov",
    applied_role: "Full-Cycle AE",
    duration_minutes: 63,
  },
));

show("report_ready", renderTelegramTemplate(
  "report_ready", "en", {
    candidate_name: "Alexei Petrov",
    applied_role: "Full-Cycle AE",
    report_url: "https://app.zima.ae/reports/rpt_001",
  },
));

show("result_summary_short", renderResultSummary("en", {
  candidate_name: "Alexei Petrov",
  applied_role: "Full-Cycle AE",
  overall_score: 82,
  overall_band: "strong_hire",
  primary_role: "New Business Hunter",
  secondary_role: "Full-Cycle AE",
  strengths: [
    "Strong assertiveness and results orientation",
    "High achievement drive — self-motivated",
    "Strong client orientation",
  ],
  risks: [
    "May be perceived as overbearing in consultative contexts",
    "Low structure tolerance — CRM compliance risk",
  ],
  report_url: "https://app.zima.ae/reports/rpt_001",
}));

show("personal_daily_digest", renderDailyDigest("en", {
  hr_name: "Anna",
  date: "10 Mar 2026",
  total_active: 5,
  completed_today: 2,
  pending_action_today: 1,
  entries: [
    { candidate_name: "Alexei Petrov", status: "completed", score: 82, band: "strong_hire" },
    { candidate_name: "Ivan Sidorov", status: "in_progress" },
    { candidate_name: "Maria Kuznetsova", status: "completed", score: 78, band: "recommended" },
  ],
}));

show("follow_up_required", renderTelegramTemplate(
  "follow_up_required", "en", {
    candidate_name: "Ivan Sidorov",
    applied_role: "Hunter",
    action_items: "- Review critical red flags in report\n- Schedule follow-up interview\n- Verify reference for previous role",
  },
));

show("registration_success", renderTelegramTemplate(
  "registration_success", "en", {
    hr_name: "Anna",
    email: "anna@zima.ae",
  },
));

// ════════════════════════════════════════════════════════════════════
//  RUSSIAN
// ════════════════════════════════════════════════════════════════════

section("GROUP TEMPLATES — RU");

show("candidate_completed_full_assessment", renderTelegramTemplate(
  "candidate_completed_full_assessment", "ru", {
    candidate_name: "Алексей Петров",
    applied_role: "Менеджер полного цикла",
    duration_minutes: 63,
  },
));

show("report_generated", renderWithBandLabel(
  "report_generated", "ru", {
    candidate_name: "Алексей Петров",
    overall_band: "strong_hire",
    overall_score: 82,
    primary_role: "Хантер",
    report_url: "https://app.zima.ae/reports/rpt_001",
  },
));

show("shortlist_candidate", renderWithBandLabel(
  "shortlist_candidate", "ru", {
    candidate_name: "Мария Кузнецова",
    overall_score: 78,
    overall_band: "strong_hire",
    primary_role: "Менеджер полного цикла",
  },
));

show("critical_red_flags", renderWithBandLabel(
  "critical_red_flags", "ru", {
    candidate_name: "Иван Сидоров",
    flags_list: "  - Низкая устойчивость + низкая процессная ориентация = риск ухода\n  - SJT 42/100 — слабое ситуационное суждение",
    overall_band: "not_recommended",
  },
));

section("PRIVATE TEMPLATES — RU");

show("result_summary_short", renderResultSummary("ru", {
  candidate_name: "Алексей Петров",
  applied_role: "Менеджер полного цикла",
  overall_score: 82,
  overall_band: "strong_hire",
  primary_role: "Хантер",
  secondary_role: "Менеджер полного цикла",
  strengths: [
    "Выраженная настойчивость и ориентация на результат",
    "Высокий драйв достижений — самомотивирован",
    "Сильная клиентская ориентация",
  ],
  risks: [
    "Может восприниматься как давящий в консультативном контексте",
    "Низкая толерантность к структуре — риск CRM-комплаенса",
  ],
  report_url: "https://app.zima.ae/reports/rpt_001",
}));

show("personal_daily_digest", renderDailyDigest("ru", {
  hr_name: "Анна",
  date: "10 марта 2026",
  total_active: 5,
  completed_today: 2,
  pending_action_today: 1,
  entries: [
    { candidate_name: "Алексей Петров", status: "завершено", score: 82, band: "strong_hire" },
    { candidate_name: "Иван Сидоров", status: "в процессе" },
    { candidate_name: "Мария Кузнецова", status: "завершено", score: 78, band: "recommended" },
  ],
}));

show("team_daily_summary", renderTeamSummary("ru", {
  date: "10 марта 2026",
  invited_today: 5,
  started_today: 3,
  completed_today: 2,
  timed_out_today: 1,
  shortlisted_today: 1,
  rejected_today: 0,
  pending_action_today: 2,
  top_candidates: [
    { name: "Алексей Петров", score: 82, band: "strong_hire" },
    { name: "Мария Кузнецова", score: 78, band: "recommended" },
  ],
}));

// ════════════════════════════════════════════════════════════════════
//  BAND LABELS — ALL
// ════════════════════════════════════════════════════════════════════

section("BAND LABELS");

const bands = [
  "strong_fit", "conditional_fit", "high_risk", "shortlist",
  "interview_with_caution", "reject", "reserve_pool",
  "strong_hire", "recommended", "conditional", "not_recommended",
];

for (const b of bands) {
  console.log(`  ${b.padEnd(26)} EN: ${getBandLabel("en", b).padEnd(26)} RU: ${getBandLabel("ru", b)}`);
}

// ════════════════════════════════════════════════════════════════════
//  VERIFICATION
// ════════════════════════════════════════════════════════════════════

section("VERIFICATION");

const allGroupKeys = [
  "candidate_completed_full_assessment", "report_generated",
  "shortlist_candidate", "critical_red_flags", "team_daily_summary",
] as const;

const allPrivateKeys = [
  "candidate_started", "candidate_inactivity_risk",
  "disc_completed", "zima_completed", "ritchie_completed",
  "assessment_completed", "report_ready", "result_summary_short",
  "personal_daily_digest", "follow_up_required",
] as const;

const allRegKeys = [
  "registration_success", "registration_unknown", "registration_already_linked",
] as const;

let passed = 0;
let failed = 0;

for (const key of [...allGroupKeys, ...allPrivateKeys, ...allRegKeys]) {
  for (const lang of ["en", "ru"] as const) {
    const msg = renderTelegramTemplate(key, lang, {});
    if (msg && msg.body.length > 0) {
      passed++;
    } else {
      console.log(`  FAIL: ${key} (${lang})`);
      failed++;
    }
  }
}

console.log(`\n  Templates: ${passed} passed, ${failed} failed (${allGroupKeys.length + allPrivateKeys.length + allRegKeys.length} keys x 2 langs)`);

const detEN = renderTelegramTemplate("result_summary_short", "en", { candidate_name: "Test" });
const detRU = renderTelegramTemplate("result_summary_short", "ru", { candidate_name: "Тест" });
const langDiff = detEN!.body !== detRU!.body;
console.log(`  EN ≠ RU check: ${langDiff ? "PASSED" : "FAILED"}`);

console.log("\n  All checks completed.");
