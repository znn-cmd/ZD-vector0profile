// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  English Message Templates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { MessageTemplates } from "./types";

export const en: MessageTemplates = {

  // ─── Private HR Messages ─────────────────────────────────────────

  candidate_started: {
    subject: "Candidate started assessment",
    body: [
      "📋 <b>Candidate Started Assessment</b>",
      "",
      "👤 {candidate_name}",
      "📌 Position: {position}",
      "🌐 Language: {language}",
      "🕐 Started: {timestamp}",
      "",
      "Expected duration: 60–70 minutes.",
    ].join("\n"),
  },

  inactivity_risk: {
    subject: "Candidate inactivity risk",
    body: [
      "⚠️ <b>Inactivity Alert</b>",
      "",
      "👤 {candidate_name}",
      "⏱ Inactive: {minutes_inactive} min",
      "📦 Current block: {current_block}",
      "🕐 Last active: {last_active}",
      "",
      "The candidate may have abandoned the assessment or experienced technical issues.",
    ].join("\n"),
  },

  block_completed: {
    subject: "Assessment block completed",
    body: [
      "✅ <b>Block Completed</b>",
      "",
      "👤 {candidate_name}",
      "📦 Block: {block_label}",
      "📊 Remaining blocks: {blocks_remaining}",
    ].join("\n"),
  },

  assessment_completed_private: {
    subject: "Assessment completed",
    body: [
      "🎯 <b>Assessment Fully Completed</b>",
      "",
      "👤 {candidate_name}",
      "📌 Position: {position}",
      "⏱ Duration: {duration_minutes} min",
      "",
      "Report will be generated automatically.",
    ].join("\n"),
  },

  report_ready: {
    subject: "Report ready",
    body: [
      "📄 <b>Personal Vector Profile Report Ready</b>",
      "",
      "👤 {candidate_name}",
      "🔗 <a href=\"{report_url}\">View Report</a>",
    ].join("\n"),
  },

  result_summary: {
    subject: "Assessment results",
    body: [
      "📊 <b>Candidate Assessment Results</b>",
      "",
      "👤 <b>{candidate_name}</b>",
      "📌 Position: {position}",
      "🏷 Overall score: <b>{overall_score}/100</b>",
      "📈 Band: <b>{overall_band_label}</b>",
      "🎯 Recommended role: {recommended_role}",
      "🔄 Secondary role: {secondary_role}",
      "",
      "💪 <b>Top Strengths:</b>",
      "{strengths_list}",
      "",
      "⚠️ <b>Key Risks:</b>",
      "{risks_list}",
      "",
      "🔗 <a href=\"{report_url}\">Full Personal Vector Profile</a>",
    ].join("\n"),
  },

  personal_daily_digest: {
    subject: "Daily digest",
    body: [
      "📅 <b>Daily Digest — {date}</b>",
      "",
      "👋 {hr_name}, here's your candidate summary:",
      "",
      "📊 Active: {total_active}",
      "✅ Completed today: {total_completed_today}",
      "",
      "{entries_list}",
    ].join("\n"),
  },

  // ─── Group Messages ──────────────────────────────────────────────

  assessment_completed_group: {
    subject: "Assessment completed",
    body: [
      "🎯 <b>{candidate_name}</b> completed the assessment",
      "📌 {position} · ⏱ {duration_minutes} min",
    ].join("\n"),
  },

  report_generated_group: {
    subject: "Report generated",
    body: [
      "📄 Report ready: <b>{candidate_name}</b>",
      "📈 {overall_band_label} · 🔗 <a href=\"{report_url}\">View</a>",
    ].join("\n"),
  },

  candidate_shortlisted: {
    subject: "Candidate shortlisted",
    body: [
      "⭐️ <b>Shortlisted: {candidate_name}</b>",
      "",
      "🏷 Score: {overall_score}/100 ({overall_band_label})",
      "🎯 Role: {recommended_role}",
    ].join("\n"),
  },

  critical_red_flags: {
    subject: "Critical red flags",
    body: [
      "🚩 <b>Critical Flags: {candidate_name}</b>",
      "",
      "{flags_list}",
      "",
      "📈 Band: {overall_band_label}",
    ].join("\n"),
  },

  team_daily_summary: {
    subject: "Team daily summary",
    body: [
      "📅 <b>Team Summary — {date}</b>",
      "",
      "📊 Active candidates: {total_active}",
      "✅ Completed today: {completed_today}",
      "📄 Reports: {reports_generated}",
      "⭐️ Shortlisted: {shortlisted_today}",
      "🚩 Critical flags: {red_flags_today}",
      "",
      "{top_candidates_list}",
    ].join("\n"),
  },

  // ─── Registration ────────────────────────────────────────────────

  registration_success: {
    subject: "Bot connected",
    body: [
      "✅ <b>ZIMA Vector Profile — Bot Connected</b>",
      "",
      "Hello, {hr_name}!",
      "Your account ({email}) is now linked to this chat.",
      "You will receive notifications about your candidates here.",
      "",
      "Notification language: English 🇬🇧",
    ].join("\n"),
  },

  registration_unknown: {
    subject: "Not recognized",
    body: [
      "❌ Your Telegram account was not found in the ZIMA system.",
      "Please contact your administrator to be added.",
    ].join("\n"),
  },

  registration_already_linked: {
    subject: "Already connected",
    body: [
      "ℹ️ Your account is already linked, {hr_name}.",
      "Notifications are active.",
    ].join("\n"),
  },

  // ─── Helpers ─────────────────────────────────────────────────────

  band_labels: {
    strong_hire: "Strong Hire ⭐️",
    recommended: "Recommended ✅",
    conditional: "Conditional 🔶",
    not_recommended: "Not Recommended ❌",
  },
};
