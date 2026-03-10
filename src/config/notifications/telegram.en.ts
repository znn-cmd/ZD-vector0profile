// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Telegram Notification Templates — English
//
//  Variant B: shared HR group + private HR messages
//  Format: Telegram HTML (parse_mode: HTML)
//  Interpolation: {placeholder} tokens
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { TelegramTemplateDictionary } from "./types";

export const telegramEN: TelegramTemplateDictionary = {
  lang: "en",

  // ─── A. Shared HR Group Templates ─────────────────────────────────

  group: {
    candidate_completed_full_assessment: {
      subject: "Assessment completed",
      body: [
        "<b>Assessment Completed</b>",
        "",
        "<b>{candidate_name}</b> — {applied_role}",
        "Duration: {duration_minutes} min",
        "Report will be generated automatically.",
      ].join("\n"),
    },

    report_generated: {
      subject: "Report generated",
      body: [
        "<b>Report Ready</b> — {candidate_name}",
        "",
        "Band: <b>{overall_band_label}</b> ({overall_score}/100)",
        "Role: {primary_role}",
        '<a href="{report_url}">Open report</a>',
      ].join("\n"),
    },

    shortlist_candidate: {
      subject: "Candidate shortlisted",
      body: [
        "<b>Shortlisted</b>",
        "",
        "<b>{candidate_name}</b>",
        "Score: {overall_score}/100 — {overall_band_label}",
        "Recommended role: {primary_role}",
      ].join("\n"),
    },

    critical_red_flags: {
      subject: "Critical red flags",
      body: [
        "<b>Critical Flags</b> — {candidate_name}",
        "",
        "{flags_list}",
        "",
        "Band: {overall_band_label}",
        "Immediate review recommended.",
      ].join("\n"),
    },

    team_daily_summary: {
      subject: "Team daily summary",
      body: [
        "<b>Team Summary — {date}</b>",
        "",
        "Invited: {invited_today}",
        "Started: {started_today}",
        "Completed: {completed_today}",
        "Timed out: {timed_out_today}",
        "Shortlisted: {shortlisted_today}",
        "Rejected: {rejected_today}",
        "Pending action: {pending_action_today}",
        "",
        "{top_candidates_list}",
      ].join("\n"),
    },
  },

  // ─── B. Private HR Templates ──────────────────────────────────────

  private: {
    candidate_started: {
      subject: "Candidate started assessment",
      body: [
        "<b>Candidate Started</b>",
        "",
        "Name: <b>{candidate_name}</b>",
        "Position: {applied_role}",
        "Language: {language}",
        "Started: {timestamp}",
        "",
        "Expected duration: 60–70 minutes.",
      ].join("\n"),
    },

    candidate_inactivity_risk: {
      subject: "Candidate inactivity risk",
      body: [
        "<b>Inactivity Alert</b>",
        "",
        "<b>{candidate_name}</b> — {applied_role}",
        "Inactive: {minutes_inactive} min",
        "Current block: {current_block}",
        "Last active: {last_active}",
        "",
        "The candidate may have abandoned the session or experienced a technical issue. Consider reaching out.",
      ].join("\n"),
    },

    disc_completed: {
      subject: "DISC block completed",
      body: [
        "<b>Block Completed — DISC</b>",
        "",
        "<b>{candidate_name}</b>",
        "Remaining: {blocks_remaining} block(s)",
      ].join("\n"),
    },

    zima_completed: {
      subject: "ZIMA block completed",
      body: [
        "<b>Block Completed — ZIMA Role-Fit</b>",
        "",
        "<b>{candidate_name}</b>",
        "Remaining: {blocks_remaining} block(s)",
      ].join("\n"),
    },

    ritchie_completed: {
      subject: "Ritchie–Martin block completed",
      body: [
        "<b>Block Completed — Ritchie–Martin</b>",
        "",
        "<b>{candidate_name}</b>",
        "Remaining: {blocks_remaining} block(s)",
      ].join("\n"),
    },

    assessment_completed: {
      subject: "Assessment fully completed",
      body: [
        "<b>Assessment Completed</b>",
        "",
        "<b>{candidate_name}</b>",
        "Position: {applied_role}",
        "Duration: {duration_minutes} min",
        "",
        "All three blocks are complete. The report will be generated shortly.",
      ].join("\n"),
    },

    report_ready: {
      subject: "Report ready",
      body: [
        "<b>Personal Vector Profile — Report Ready</b>",
        "",
        "Candidate: <b>{candidate_name}</b>",
        "Position: {applied_role}",
        "",
        '<a href="{report_url}">Open full report</a>',
      ].join("\n"),
    },

    result_summary_short: {
      subject: "Assessment result summary",
      body: [
        "<b>Result Summary</b>",
        "",
        "Candidate: <b>{candidate_name}</b>",
        "Position: {applied_role}",
        "",
        "Overall: <b>{overall_score}/100</b> — {overall_band_label}",
        "Recommended role: {primary_role}",
        "Secondary role: {secondary_role}",
        "",
        "<b>Top strengths:</b>",
        "  1. {top_strength_1}",
        "  2. {top_strength_2}",
        "  3. {top_strength_3}",
        "",
        "<b>Key risks:</b>",
        "  1. {risk_1}",
        "  2. {risk_2}",
        "",
        '<a href="{report_url}">Full report</a>',
      ].join("\n"),
    },

    personal_daily_digest: {
      subject: "Daily digest",
      body: [
        "<b>Daily Digest — {date}</b>",
        "",
        "{hr_name}, here is your candidate summary for today.",
        "",
        "Active: {total_active}",
        "Completed today: {completed_today}",
        "Pending action: {pending_action_today}",
        "",
        "{entries_list}",
      ].join("\n"),
    },

    follow_up_required: {
      subject: "Follow-up required",
      body: [
        "<b>Follow-Up Required</b>",
        "",
        "Candidate: <b>{candidate_name}</b>",
        "Position: {applied_role}",
        "",
        "{action_items}",
        "",
        "Please review and take action within 24 hours.",
      ].join("\n"),
    },
  },

  // ─── Registration ─────────────────────────────────────────────────

  registration: {
    registration_success: {
      subject: "Bot connected",
      body: [
        "<b>ZIMA Vector Profile — Connected</b>",
        "",
        "Hello, {hr_name}.",
        "Your account ({email}) is now linked to this chat.",
        "You will receive candidate notifications here.",
        "",
        "Language: English",
      ].join("\n"),
    },

    registration_unknown: {
      subject: "Not recognized",
      body: [
        "Your Telegram account was not found in the ZIMA system.",
        "Please contact your administrator to be added.",
      ].join("\n"),
    },

    registration_already_linked: {
      subject: "Already connected",
      body: [
        "Your account is already linked, {hr_name}.",
        "Notifications are active.",
      ].join("\n"),
    },
  },

  // ─── Band Labels ──────────────────────────────────────────────────

  bandLabels: {
    strong_fit: "Strong Fit",
    conditional_fit: "Conditional Fit",
    high_risk: "High Risk",
    shortlist: "Shortlist",
    interview_with_caution: "Interview with Caution",
    reject: "Not Recommended",
    reserve_pool: "Reserve Pool",
    strong_hire: "Strong Hire",
    recommended: "Recommended",
    conditional: "Conditional",
    not_recommended: "Not Recommended",
  },
};
