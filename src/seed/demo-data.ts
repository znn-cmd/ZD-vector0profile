/**
 * ZIMA Dubai Vector Profile — Demo / seed data for real-estate hiring context.
 * Realistic HR users, candidates, assessment results, and notifications
 * across all recommendation bands and role fits. Use for mock mode and
 * optional Sheets seed.
 */

import type {
  HRUser,
  Candidate,
  AssessmentSession,
  AssessmentResults,
  Notification,
} from "@/types";
import type { AssessmentBlockId, BlockProgress } from "@/types";

// ─── Stable demo IDs (deterministic for results/sessions linkage) ─────

export const DEMO_IDS = {
  hr: {
    adminRu: "hr_demo_admin_ru",
    adminEn: "hr_demo_admin_en",
    hrRu: "hr_demo_hr_ru",
    hrEn: "hr_demo_hr_en",
  },
  candidates: [
    "cand_demo_01", // Shortlist — hunter
    "cand_demo_02", // Shortlist — full_cycle
    "cand_demo_03", // Interview with caution — consultative
    "cand_demo_04", // Interview with caution — team_lead potential
    "cand_demo_05", // Reserve pool
    "cand_demo_06", // Reject
    "cand_demo_07", // Completed, shortlist
    "cand_demo_08", // In progress
    "cand_demo_09", // Invited
    "cand_demo_10", // Report generated
  ],
  sessions: [
    "sess_demo_01",
    "sess_demo_02",
    "sess_demo_03",
    "sess_demo_04",
    "sess_demo_05",
    "sess_demo_06",
    "sess_demo_07",
    "sess_demo_08",
    "sess_demo_09",
  ],
} as const;

const NOW = "2026-03-10T12:00:00Z";
const createdDates = [
  "2026-03-01T08:00:00Z",
  "2026-03-02T09:00:00Z",
  "2026-03-03T10:00:00Z",
  "2026-03-04T11:00:00Z",
  "2026-03-05T08:00:00Z",
  "2026-03-06T09:00:00Z",
  "2026-03-07T10:00:00Z",
  "2026-03-08T11:00:00Z",
  "2026-03-09T08:00:00Z",
  "2026-03-10T09:00:00Z",
];

// ─── HR users: Russian- and English-speaking ──────────────────────────

export const DEMO_HR_USERS: HRUser[] = [
  {
    id: DEMO_IDS.hr.adminRu,
    name: "Дмитрий Волков",
    email: "d.volkov@zimadubai.ae",
    password: "admin-demo",
    telegramChatId: "",
    role: "admin",
  },
  {
    id: DEMO_IDS.hr.adminEn,
    name: "James Mitchell",
    email: "j.mitchell@zimadubai.ae",
    password: "admin-demo",
    telegramChatId: "-1001234567890",
    role: "admin",
  },
  {
    id: DEMO_IDS.hr.hrRu,
    name: "Елена Соколова",
    email: "e.sokolova@zimadubai.ae",
    password: "hr",
    telegramChatId: "",
    role: "hr",
  },
  {
    id: DEMO_IDS.hr.hrEn,
    name: "Sofia Al-Hassan",
    email: "s.alhassan@zimadubai.ae",
    password: "hr",
    telegramChatId: "-1009876543210",
    role: "hr",
  },
];

// ─── Candidates: realistic names, positions, statuses ──────────────────

export const DEMO_CANDIDATES: Omit<Candidate, "id" | "createdAt" | "updatedAt">[] = [
  {
    fullName: "Алексей Иванов",
    email: "a.ivanov@example.com",
    phone: "+971501234567",
    position: "Senior Sales Manager — Off-Plan",
    inviteToken: "demo-token-ivanov",
    lang: "ru",
    status: "report_generated",
    hrId: DEMO_IDS.hr.adminRu,
    completedAt: "2026-03-08T14:30:00Z",
  },
  {
    fullName: "Emma Richardson",
    email: "e.richardson@example.com",
    phone: "+971502345678",
    position: "Full-Cycle Sales Executive",
    inviteToken: "demo-token-emma",
    lang: "en",
    status: "report_generated",
    hrId: DEMO_IDS.hr.adminEn,
    completedAt: "2026-03-07T16:00:00Z",
  },
  {
    fullName: "Ольга Смирнова",
    email: "o.smirnova@example.com",
    phone: "+971503456789",
    position: "Consultative Broker — High Net Worth",
    inviteToken: "demo-token-olga",
    lang: "ru",
    status: "report_generated",
    hrId: DEMO_IDS.hr.hrRu,
    completedAt: "2026-03-06T11:45:00Z",
  },
  {
    fullName: "Marcus Chen",
    email: "m.chen@example.com",
    phone: "+971504567890",
    position: "Team Lead — Residential Sales",
    inviteToken: "demo-token-marcus",
    lang: "en",
    status: "report_generated",
    hrId: DEMO_IDS.hr.hrEn,
    completedAt: "2026-03-05T10:20:00Z",
  },
  {
    fullName: "Дмитрий Козлов",
    email: "d.kozlov@example.com",
    phone: "+971505678901",
    position: "Sales Executive",
    inviteToken: "demo-token-dmitry",
    lang: "ru",
    status: "report_generated",
    hrId: DEMO_IDS.hr.adminRu,
    completedAt: "2026-03-04T15:00:00Z",
  },
  {
    fullName: "James O'Brien",
    email: "j.obrien@example.com",
    phone: "+971506789012",
    position: "Leasing Consultant",
    inviteToken: "demo-token-james",
    lang: "en",
    status: "report_generated",
    hrId: DEMO_IDS.hr.hrEn,
    completedAt: "2026-03-03T09:30:00Z",
  },
  {
    fullName: "Fatima Al-Maktoum",
    email: "f.almaktoum@example.com",
    phone: "+971507890123",
    position: "Senior Broker — Luxury",
    inviteToken: "demo-token-fatima",
    lang: "en",
    status: "report_sent",
    hrId: DEMO_IDS.hr.adminEn,
    completedAt: "2026-03-02T14:00:00Z",
  },
  {
    fullName: "Павел Петров",
    email: "p.petrov@example.com",
    phone: "+971508901234",
    position: "Sales Manager",
    inviteToken: "demo-token-pavel",
    lang: "ru",
    status: "in_progress",
    hrId: DEMO_IDS.hr.hrRu,
  },
  {
    fullName: "Sarah Williams",
    email: "s.williams@example.com",
    phone: "+971509012345",
    position: "Account Executive",
    inviteToken: "demo-token-sarah",
    lang: "en",
    status: "invited",
    hrId: DEMO_IDS.hr.hrEn,
  },
  {
    fullName: "Ирина Новикова",
    email: "i.novikova@example.com",
    phone: "+971500123456",
    position: "Sales Consultant",
    inviteToken: "demo-token-irina",
    lang: "ru",
    status: "report_generated",
    hrId: DEMO_IDS.hr.hrRu,
    completedAt: "2026-03-09T12:00:00Z",
  },
];

// ─── Sessions for candidates who have started or completed ─────────────

function makeProgress(block: AssessmentBlockId, status: "not_started" | "in_progress" | "completed"): BlockProgress {
  if (status === "not_started") {
    return { status: "not_started", answers: {} };
  }
  if (status === "in_progress") {
    return {
      status: "in_progress",
      answers: { q_d01: { type: "scale", value: 4 } },
      startedAt: "2026-03-10T10:00:00Z",
    };
  }
  return {
    status: "completed",
    answers: {},
    startedAt: "2026-03-10T10:00:00Z",
    completedAt: "2026-03-10T11:30:00Z",
  };
}

export function buildDemoSessions(): AssessmentSession[] {
  const sessions: AssessmentSession[] = [];
  const completedCandidates = [
    DEMO_IDS.candidates[0],
    DEMO_IDS.candidates[1],
    DEMO_IDS.candidates[2],
    DEMO_IDS.candidates[3],
    DEMO_IDS.candidates[4],
    DEMO_IDS.candidates[5],
    DEMO_IDS.candidates[6],
    DEMO_IDS.candidates[9],
  ];
  const inProgressCandidate = DEMO_IDS.candidates[7];

  completedCandidates.forEach((candidateId, i) => {
    sessions.push({
      id: DEMO_IDS.sessions[i],
      candidateId,
      currentBlock: "ritchie_martin",
      blockOrder: ["disc", "zima", "ritchie_martin"],
      progress: {
        disc: makeProgress("disc", "completed"),
        zima: makeProgress("zima", "completed"),
        ritchie_martin: makeProgress("ritchie_martin", "completed"),
      },
      startedAt: "2026-03-08T10:00:00Z",
      lastActiveAt: NOW,
      completedAt: "2026-03-08T14:30:00Z",
    });
  });

  sessions.push({
    id: DEMO_IDS.sessions[8],
    candidateId: inProgressCandidate,
    currentBlock: "zima",
    blockOrder: ["disc", "zima", "ritchie_martin"],
    progress: {
      disc: makeProgress("disc", "completed"),
      zima: makeProgress("zima", "in_progress"),
      ritchie_martin: makeProgress("ritchie_martin", "not_started"),
    },
    startedAt: "2026-03-10T10:00:00Z",
    lastActiveAt: NOW,
  });

  return sessions;
}

// ─── Assessment results with full summary (all bands + role fits) ───────

const DISC_DIMENSIONS = ["D", "I", "S", "C", "K"] as const;
const RITCHE_MOTIVATORS = [
  "interest",
  "achievement",
  "recognition",
  "authority",
  "independence",
  "affiliation",
  "security",
  "equity",
  "working_conditions",
  "personal_growth",
  "creativity",
  "structure",
] as const;

function makeDiscResult(
  d: number,
  i: number,
  s: number,
  c: number,
  k: number,
  primary: "D" | "I" | "S" | "C",
  secondary: "D" | "I" | "S" | "C",
  profileLabel: string
): AssessmentResults["disc"] {
  return {
    raw: { D: d, I: i, S: s, C: c },
    normalized: { D: d, I: i, S: s, C: c },
    primaryType: primary,
    secondaryType: secondary,
    profileLabel,
  };
}

function makeRitchieResult(
  top: (typeof RITCHE_MOTIVATORS)[number][],
  bottom: (typeof RITCHE_MOTIVATORS)[number][],
  motivators: Record<string, number>
): AssessmentResults["ritchieMartin"] {
  return {
    topMotivators: top,
    bottomMotivators: bottom,
    motivators: motivators as Record<(typeof RITCHE_MOTIVATORS)[number], number>,
  };
}

export function buildDemoResults(): AssessmentResults[] {
  const candIds = DEMO_IDS.candidates;
  const sessionIds = DEMO_IDS.sessions;

  const results: AssessmentResults[] = [
    // 1. Shortlist — hunter (Алексей Иванов)
    {
      candidateId: candIds[0],
      sessionId: sessionIds[0],
      generatedAt: "2026-03-08T14:30:00Z",
      disc: makeDiscResult(78, 72, 45, 62, 70, "D", "I", "Driver–Influencer"),
      zima: {
        categories: { pace: 75, autonomy: 80, client_focus: 82, process: 65, resilience: 78 },
        totalScore: 28,
        percentile: 82,
        level: "high",
      },
      ritchieMartin: makeRitchieResult(
        ["achievement", "recognition", "authority"],
        ["security", "structure", "affiliation"],
        { interest: 72, achievement: 88, recognition: 85, authority: 80, independence: 70, affiliation: 45, security: 38, equity: 65, working_conditions: 60, personal_growth: 75, creativity: 68, structure: 42 }
      ),
      overallScore: 82,
      overallBand: "strong_hire",
      primaryRole: "hunter",
      secondaryRole: "full_cycle",
      recommendation: "Shortlist",
      strengths: [
        "Strong closing drive and assertiveness",
        "High achievement and recognition motivation",
        "Resilient under pressure",
      ],
      risks: ["Lower preference for routine process; may need CRM discipline"],
      interviewQuestions: ["Describe a deal you closed in a competitive situation.", "How do you handle rejection in cold outreach?"],
      managementRecs: ["Clear targets and weekly 1:1s; avoid micromanagement"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-001/view",
      discOverall: 76,
      discSjtScore: 78,
      discScales: { D: 78, I: 72, S: 45, C: 62, K: 70 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "hunter",
      ritchieBestRoleScore: 85,
      ritchieBestRoleFit: "strong",
      zimaDimensions: { pace: 75, autonomy: 80, collaboration: 70, risk: 72, innovation: 68, client_focus: 82, process: 65, resilience: 78, ambiguity: 70, growth: 75 },
    },
    // 2. Shortlist — full_cycle (Emma Richardson)
    {
      candidateId: candIds[1],
      sessionId: sessionIds[1],
      generatedAt: "2026-03-07T16:00:00Z",
      disc: makeDiscResult(68, 75, 58, 70, 72, "I", "D", "Influencer–Driver"),
      zima: {
        categories: { pace: 70, autonomy: 65, client_focus: 88, process: 72, resilience: 75 },
        totalScore: 27,
        percentile: 78,
        level: "high",
      },
      ritchieMartin: makeRitchieResult(
        ["achievement", "personal_growth", "affiliation"],
        ["security", "structure", "authority"],
        { interest: 70, achievement: 82, recognition: 75, authority: 55, independence: 68, affiliation: 78, security: 52, equity: 70, working_conditions: 72, personal_growth: 85, creativity: 70, structure: 60 }
      ),
      overallScore: 79,
      overallBand: "strong_hire",
      primaryRole: "full_cycle",
      secondaryRole: "consultative",
      recommendation: "Shortlist",
      strengths: [
        "Strong relationship-building and client focus",
        "Balanced drive and process orientation",
        "High development motivation",
      ],
      risks: [],
      interviewQuestions: ["Walk me through a full cycle from lead to close.", "How do you balance pipeline generation and closing?"],
      managementRecs: ["Provide clear process; allow autonomy on client strategy"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-002/view",
      discOverall: 72,
      discSjtScore: 74,
      discScales: { D: 68, I: 75, S: 58, C: 70, K: 72 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "full_cycle",
      ritchieBestRoleScore: 82,
      ritchieBestRoleFit: "strong",
      zimaDimensions: { pace: 70, autonomy: 65, collaboration: 75, risk: 60, innovation: 65, client_focus: 88, process: 72, resilience: 75, ambiguity: 68, growth: 80 },
    },
    // 3. Interview with caution — consultative (Ольга Смирнова)
    {
      candidateId: candIds[2],
      sessionId: sessionIds[2],
      generatedAt: "2026-03-06T11:45:00Z",
      disc: makeDiscResult(55, 72, 65, 68, 58, "I", "S", "Influencer–Steady"),
      zima: {
        categories: { pace: 58, autonomy: 62, client_focus: 85, process: 70, resilience: 62 },
        totalScore: 24,
        percentile: 65,
        level: "above_average",
      },
      ritchieMartin: makeRitchieResult(
        ["affiliation", "personal_growth", "recognition"],
        ["authority", "security", "structure"],
        { interest: 65, achievement: 72, recognition: 78, authority: 45, independence: 68, affiliation: 88, security: 55, equity: 72, working_conditions: 70, personal_growth: 80, creativity: 68, structure: 52 }
      ),
      overallScore: 68,
      overallBand: "recommended",
      primaryRole: "consultative",
      secondaryRole: "full_cycle",
      recommendation: "Interview with caution",
      strengths: [
        "Strong relationship and client focus",
        "Good fit for long-cycle consultative sales",
      ],
      risks: [
        "Below-target process discipline (C-scale)",
        "Moderate resilience under pressure",
      ],
      interviewQuestions: ["How do you maintain detail and process in long-cycle deals?", "Describe handling a difficult client conversation."],
      managementRecs: ["Structured check-ins; CRM discipline expectations"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-003/view",
      discOverall: 64,
      discSjtScore: 62,
      discScales: { D: 55, I: 72, S: 65, C: 68, K: 58 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "consultative",
      ritchieBestRoleScore: 75,
      ritchieBestRoleFit: "moderate",
      zimaDimensions: { pace: 58, autonomy: 62, collaboration: 78, risk: 50, innovation: 60, client_focus: 85, process: 70, resilience: 62, ambiguity: 65, growth: 72 },
    },
    // 4. Interview with caution — team_lead potential (Marcus Chen)
    {
      candidateId: candIds[3],
      sessionId: sessionIds[3],
      generatedAt: "2026-03-05T10:20:00Z",
      disc: makeDiscResult(72, 68, 62, 70, 65, "D", "I", "Driver–Influencer"),
      zima: {
        categories: { pace: 72, autonomy: 75, client_focus: 70, process: 68, resilience: 72 },
        totalScore: 25,
        percentile: 70,
        level: "high",
      },
      ritchieMartin: makeRitchieResult(
        ["authority", "achievement", "recognition"],
        ["affiliation", "security", "structure"],
        { interest: 68, achievement: 82, recognition: 78, authority: 85, independence: 75, affiliation: 55, security: 50, equity: 72, working_conditions: 68, personal_growth: 80, creativity: 65, structure: 58 }
      ),
      overallScore: 72,
      overallBand: "recommended",
      primaryRole: "team_lead",
      secondaryRole: "hunter",
      recommendation: "Interview with caution",
      strengths: [
        "Strong authority and achievement motivation — team lead potential",
        "Good resilience and pace",
      ],
      risks: [
        "Lower affiliation; validate people-management motivation in interview",
      ],
      interviewQuestions: ["Describe how you've coached or led others in sales.", "What motivates you in a team lead role?"],
      managementRecs: ["Clarify scope: individual contributor vs. team lead; development path"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-004/view",
      discOverall: 70,
      discSjtScore: 68,
      discScales: { D: 72, I: 68, S: 62, C: 70, K: 65 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "team_lead",
      ritchieBestRoleScore: 78,
      ritchieBestRoleFit: "moderate",
      zimaDimensions: { pace: 72, autonomy: 75, collaboration: 65, risk: 68, innovation: 70, client_focus: 70, process: 68, resilience: 72, ambiguity: 68, growth: 75 },
    },
    // 5. Reserve pool (Дмитрий Козлов)
    {
      candidateId: candIds[4],
      sessionId: sessionIds[4],
      generatedAt: "2026-03-04T15:00:00Z",
      disc: makeDiscResult(52, 55, 62, 48, 50, "S", "I", "Steady–Influencer"),
      zima: {
        categories: { pace: 48, autonomy: 52, client_focus: 55, process: 58, resilience: 48 },
        totalScore: 18,
        percentile: 48,
        level: "average",
      },
      ritchieMartin: makeRitchieResult(
        ["affiliation", "security", "working_conditions"],
        ["achievement", "authority", "recognition"],
        { interest: 52, achievement: 48, recognition: 45, authority: 42, independence: 55, affiliation: 72, security: 78, equity: 62, working_conditions: 75, personal_growth: 58, creativity: 50, structure: 72 }
      ),
      overallScore: 52,
      overallBand: "conditional",
      primaryRole: "consultative",
      secondaryRole: "full_cycle",
      recommendation: "Reserve pool",
      strengths: ["Stable; prefers structured environment and relationships"],
      risks: [
        "Below-target scores across DISC and ZIMA for sales roles",
        "Low drive and achievement motivation for hunter/full-cycle",
      ],
      interviewQuestions: ["What type of sales environment do you prefer?", "How do you handle stretch targets?"],
      managementRecs: ["Consider for support or junior role with clear structure"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-005/view",
      discOverall: 53,
      discSjtScore: 48,
      discScales: { D: 52, I: 55, S: 62, C: 48, K: 50 },
      zimaRedFlagCount: 1,
      ritchieBestRole: "consultative",
      ritchieBestRoleScore: 52,
      ritchieBestRoleFit: "weak",
      zimaDimensions: { pace: 48, autonomy: 52, collaboration: 68, risk: 42, innovation: 45, client_focus: 55, process: 58, resilience: 48, ambiguity: 45, growth: 50 },
    },
    // 6. Reject (James O'Brien)
    {
      candidateId: candIds[5],
      sessionId: sessionIds[5],
      generatedAt: "2026-03-03T09:30:00Z",
      disc: makeDiscResult(42, 48, 72, 38, 42, "S", "I", "Steady–Influencer"),
      zima: {
        categories: { pace: 38, autonomy: 42, client_focus: 45, process: 52, resilience: 38 },
        totalScore: 14,
        percentile: 35,
        level: "low",
      },
      ritchieMartin: makeRitchieResult(
        ["security", "structure", "working_conditions"],
        ["achievement", "recognition", "authority"],
        { interest: 40, achievement: 35, recognition: 38, authority: 32, independence: 45, affiliation: 62, security: 85, equity: 55, working_conditions: 78, personal_growth: 42, creativity: 38, structure: 82 }
      ),
      overallScore: 38,
      overallBand: "not_recommended",
      primaryRole: "full_cycle",
      secondaryRole: "consultative",
      recommendation: "Reject",
      strengths: [],
      risks: [
        "Overall score and DISC below threshold",
        "Low resilience and client focus; critical ZIMA flags",
      ],
      interviewQuestions: [],
      managementRecs: ["Not recommended for current sales roles"],
      retentionFlags: ["High security need; mismatch with sales pressure"],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-006/view",
      discOverall: 42,
      discSjtScore: 40,
      discScales: { D: 42, I: 48, S: 72, C: 38, K: 42 },
      zimaRedFlagCount: 2,
      ritchieBestRole: "consultative",
      ritchieBestRoleScore: 45,
      ritchieBestRoleFit: "weak",
      zimaDimensions: { pace: 38, autonomy: 42, collaboration: 65, risk: 35, innovation: 38, client_focus: 45, process: 52, resilience: 38, ambiguity: 35, growth: 40 },
    },
    // 7. Shortlist — report_sent (Fatima Al-Maktoum)
    {
      candidateId: candIds[6],
      sessionId: sessionIds[6],
      generatedAt: "2026-03-02T14:00:00Z",
      disc: makeDiscResult(75, 78, 52, 68, 72, "I", "D", "Influencer–Driver"),
      zima: {
        categories: { pace: 78, autonomy: 72, client_focus: 85, process: 68, resilience: 75 },
        totalScore: 28,
        percentile: 85,
        level: "high",
      },
      ritchieMartin: makeRitchieResult(
        ["achievement", "recognition", "personal_growth"],
        ["security", "structure", "affiliation"],
        { interest: 75, achievement: 88, recognition: 85, authority: 72, independence: 78, affiliation: 55, security: 45, equity: 70, working_conditions: 65, personal_growth: 82, creativity: 72, structure: 50 }
      ),
      overallScore: 80,
      overallBand: "strong_hire",
      primaryRole: "hunter",
      secondaryRole: "full_cycle",
      recommendation: "Shortlist",
      strengths: [
        "Exceptional influencer profile; strong luxury segment fit",
        "High achievement and resilience",
      ],
      risks: [],
      interviewQuestions: ["Describe your approach to high-net-worth clients.", "How do you manage a large pipeline?"],
      managementRecs: ["Autonomy with clear KPIs; minimal bureaucracy"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-007/view",
      discOverall: 76,
      discSjtScore: 75,
      discScales: { D: 75, I: 78, S: 52, C: 68, K: 72 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "hunter",
      ritchieBestRoleScore: 88,
      ritchieBestRoleFit: "strong",
      zimaDimensions: { pace: 78, autonomy: 72, collaboration: 62, risk: 75, innovation: 72, client_focus: 85, process: 68, resilience: 75, ambiguity: 72, growth: 80 },
    },
    // 10. Report generated (Ирина Новикова) — Shortlist
    {
      candidateId: candIds[9],
      sessionId: sessionIds[7],
      generatedAt: "2026-03-09T12:00:00Z",
      disc: makeDiscResult(70, 72, 55, 68, 68, "I", "D", "Influencer–Driver"),
      zima: {
        categories: { pace: 68, autonomy: 70, client_focus: 80, process: 70, resilience: 70 },
        totalScore: 26,
        percentile: 75,
        level: "high",
      },
      ritchieMartin: makeRitchieResult(
        ["achievement", "recognition", "personal_growth"],
        ["security", "structure", "affiliation"],
        { interest: 70, achievement: 80, recognition: 78, authority: 65, independence: 72, affiliation: 60, security: 52, equity: 68, working_conditions: 65, personal_growth: 78, creativity: 68, structure: 55 }
      ),
      overallScore: 76,
      overallBand: "strong_hire",
      primaryRole: "full_cycle",
      secondaryRole: "consultative",
      recommendation: "Shortlist",
      strengths: ["Strong all-round fit; good balance of drive and process"],
      risks: [],
      interviewQuestions: ["Describe a complex deal you managed end to end."],
      managementRecs: ["Standard onboarding; clear targets"],
      retentionFlags: [],
      reportVersion: "V1",
      reportUrl: "https://drive.google.com/file/d/demo-file-010/view",
      discOverall: 70,
      discSjtScore: 72,
      discScales: { D: 70, I: 72, S: 55, C: 68, K: 68 },
      zimaRedFlagCount: 0,
      ritchieBestRole: "full_cycle",
      ritchieBestRoleScore: 80,
      ritchieBestRoleFit: "strong",
      zimaDimensions: { pace: 68, autonomy: 70, collaboration: 72, risk: 65, innovation: 65, client_focus: 80, process: 70, resilience: 70, ambiguity: 65, growth: 75 },
    },
  ];

  return results;
}

// ─── Notifications: mix of types for feed ─────────────────────────────

export function buildDemoNotifications(candidateIds: readonly string[]): Omit<Notification, "id" | "createdAt">[] {
  return [
    { type: "report_ready", title: "Report Ready", message: "Personal Vector Profile generated for Алексей Иванов", candidateId: candidateIds[0], read: false },
    { type: "candidate_completed", title: "Assessment Completed", message: "Emma Richardson completed the full assessment", candidateId: candidateIds[1], read: false },
    { type: "report_ready", title: "Report Ready", message: "Report generated for Ольга Смирнова", candidateId: candidateIds[2], read: true },
    { type: "candidate_started", title: "Assessment Started", message: "Павел Петров started the assessment", candidateId: candidateIds[7], read: false },
    { type: "candidate_completed", title: "Assessment Completed", message: "Fatima Al-Maktoum completed the assessment", candidateId: candidateIds[6], read: true },
    { type: "report_ready", title: "Report Ready", message: "Personal Vector Profile ready for Ирина Новикова", candidateId: candidateIds[9], read: false },
  ];
}

// ─── Assemble full candidate list with IDs and timestamps ──────────────

export function buildDemoCandidates(): Candidate[] {
  return DEMO_CANDIDATES.map((c, i) => ({
    ...c,
    id: DEMO_IDS.candidates[i],
    createdAt: createdDates[i],
    updatedAt: NOW,
  }));
}
