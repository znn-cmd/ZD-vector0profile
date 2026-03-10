// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HR / Admin UI Text Layer — English
//
//  Covers every label, heading, status, action, and microcopy used
//  in the HR Manager and Admin dashboards.
//
//  Aligned with:
//  - CandidateStatus: invited | in_progress | completed | expired | withdrawn
//  - SessionStatus:   not_started | in_progress | completed | timed_out | abandoned
//  - ScoreBand:       strong_hire | recommended | conditional | not_recommended
//  - ReportStatus:    generating | ready | failed | archived
//  - HRRole:          admin | hr | viewer
//  - HRStatus:        active | suspended
//  - NotificationChannel: email | telegram | in_app
//  - NotificationStatus:  pending | sent | failed | skipped
//  - ActorType:       hr | admin | system | candidate
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const hrAdminEN = {

  // ─── Dashboard ──────────────────────────────────────────────────

  dashboard: {
    heading: "Dashboard",
    subtitle: "Assessment pipeline at a glance",
    welcomeBack: "Welcome back, {name}",
    quickStats: "Quick Stats",
    recentActivity: "Recent Activity",
    noActivity: "No recent activity",
    viewAll: "View all",
    todaysSummary: "Today's summary",
  },

  // ─── Candidate Table ────────────────────────────────────────────

  candidateTable: {
    heading: "Candidates",
    columns: {
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      position: "Position",
      department: "Department",
      status: "Status",
      assignedHR: "Assigned HR",
      scoreBand: "Score Band",
      overallScore: "Score",
      primaryRole: "Recommended Role",
      language: "Language",
      invitedAt: "Invited",
      startedAt: "Started",
      completedAt: "Completed",
      lastActive: "Last Active",
      actions: "Actions",
    },
    empty: "No candidates match the current filters",
    loading: "Loading candidates...",
    totalCount: "{count} candidate(s)",
    selectedCount: "{count} selected",
    selectAll: "Select all",
    deselectAll: "Deselect all",
  },

  // ─── Search ─────────────────────────────────────────────────────

  search: {
    placeholder: "Search by full name (FIO)",
    placeholderExtended: "Search by name or email",
    noResults: "No candidates found",
    minChars: "Enter at least 2 characters",
    searching: "Searching...",
  },

  // ─── Filters ────────────────────────────────────────────────────

  filters: {
    heading: "Filters",
    status: "Status",
    assignedHR: "Assigned HR",
    role: "Target Role",
    scoreBand: "Score Band",
    department: "Department",
    dateRange: "Date Range",
    language: "Language",
    clearAll: "Clear all filters",
    apply: "Apply",
    allStatuses: "All statuses",
    allHRs: "All HR managers",
    allRoles: "All roles",
    allBands: "All bands",
    allDepartments: "All departments",
    from: "From",
    to: "To",
  },

  // ─── Funnel Cards ───────────────────────────────────────────────

  funnel: {
    heading: "Hiring Funnel",
    invited: "Invites Sent",
    started: "Started",
    completed: "Completed",
    timeout: "Timed Out",
    shortlist: "Shortlist",
    hired: "Hired",
    technicalOnly: "Technical Only",
    rejected: "Rejected",
    pending: "Pending Action",
    conversionRate: "{pct}% conversion",
    ofTotal: "of {total}",
  },

  // ─── Candidate Statuses ─────────────────────────────────────────

  candidateStatus: {
    invited: "Invited",
    in_progress: "In Progress",
    completed: "Completed",
    expired: "Expired",
    withdrawn: "Withdrawn",
  },

  // ─── Session Statuses ───────────────────────────────────────────

  sessionStatus: {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
    timed_out: "Timed Out",
    abandoned: "Abandoned",
  },

  // ─── Score Bands ────────────────────────────────────────────────

  scoreBand: {
    strong_hire: "Strong Hire",
    recommended: "Recommended",
    conditional: "Conditional",
    not_recommended: "Not Recommended",
  },

  // ─── Extended Recommendation Labels ─────────────────────────────

  recommendation: {
    strong_fit: "Strong Fit",
    conditional_fit: "Conditional Fit",
    high_risk: "High Risk",
    shortlist: "Shortlist",
    interview_with_caution: "Interview with Caution",
    reject: "Not Recommended",
    reserve_pool: "Reserve Pool",
    technical_result_only: "Technical Result Only",
    pending_review: "Pending Review",
    no_recommendation: "No recommendation yet",
  },

  // ─── Role Labels ────────────────────────────────────────────────

  role: {
    full_cycle: "Full-Cycle Account Executive",
    hunter: "New Business Hunter",
    consultative: "Consultative / Solution Seller",
    team_lead: "Sales Team Lead",
  },

  // ─── Compare Mode ───────────────────────────────────────────────

  compare: {
    heading: "Compare Candidates",
    subtitle: "Side-by-side comparison of 2–5 candidates",
    selectCandidates: "Select candidates to compare",
    addCandidate: "Add candidate",
    removeCandidate: "Remove",
    minCandidates: "Select at least 2 candidates",
    maxCandidates: "Maximum 5 candidates",
    noSelection: "No candidates selected for comparison",
    overallScore: "Overall Score",
    discProfile: "DISC Profile",
    ritchieTopMotivators: "Top Motivators",
    zimaFitScore: "ZIMA Fit Score",
    primaryRole: "Primary Role",
    secondaryRole: "Secondary Role",
    strengths: "Strengths",
    risks: "Risks",
    band: "Band",
    winner: "Best Match",
    exportComparison: "Export comparison",
  },

  // ─── Candidate Detail ───────────────────────────────────────────

  candidateDetail: {
    heading: "Candidate Profile",
    tabs: {
      overview: "Overview",
      assessment: "Assessment",
      results: "Results",
      reports: "Reports",
      activity: "Activity Log",
    },
    info: {
      personalInfo: "Personal Information",
      assessmentInfo: "Assessment Information",
      resultsSummary: "Results Summary",
      noResults: "Results not yet available",
      noReport: "Report not yet generated",
    },
  },

  // ─── Report Actions ─────────────────────────────────────────────

  report: {
    generate: "Generate Report",
    regenerate: "Regenerate Report",
    download: "Download PDF",
    viewOnline: "View Online",
    sendToHR: "Send to HR",
    version: "Version",
    currentVersion: "Current version: {version}",
    previousVersions: "Previous versions",
    generatedAt: "Generated: {date}",
    generatedBy: "Generated by: ZIMA Vector Profile",
    templateVersion: "Template: {version}",
    engineVersion: "Engine: {version}",
    status: {
      generating: "Generating...",
      ready: "Ready",
      failed: "Generation Failed",
      archived: "Archived",
    },
    noReports: "No reports generated yet",
    reportHistory: "Report History",
    immutableNote: "Previous versions are immutable and remain accessible.",
  },

  // ─── Archive Actions ────────────────────────────────────────────

  archive: {
    archiveCandidate: "Archive Candidate",
    archiveConfirm: "Are you sure you want to archive this candidate? Archived candidates are hidden from active lists but can be restored.",
    archiveSuccess: "Candidate archived",
    restoreCandidate: "Restore Candidate",
    restoreConfirm: "Restore this candidate to the active list?",
    restoreSuccess: "Candidate restored",
    archivedAt: "Archived: {date}",
    showArchived: "Show archived",
    hideArchived: "Hide archived",
    archivedLabel: "Archived",
  },

  // ─── Resend Invite ──────────────────────────────────────────────

  resendInvite: {
    action: "Resend Invite",
    confirm: "Resend the assessment invite to {email}?",
    success: "Invite resent to {email}",
    alreadyStarted: "Cannot resend — candidate has already started the assessment",
    alreadyCompleted: "Cannot resend — assessment is already completed",
    cooldown: "Please wait before resending (last sent: {date})",
  },

  // ─── Preview Mode ───────────────────────────────────────────────

  preview: {
    heading: "Preview Mode",
    subtitle: "Test the assessment flow without affecting live data",
    badge: "PREVIEW",
    disclaimer: "This is a preview session. No data will be saved to the production pipeline.",
    launchPreview: "Launch Preview",
    exitPreview: "Exit Preview",
    resetPreview: "Reset Preview Data",
    previewAsRole: "Preview as:",
    previewCandidate: "Candidate View",
    previewHR: "HR Manager View",
    previewAdmin: "Admin View",
  },

  // ─── Notification Feed ──────────────────────────────────────────

  notifications: {
    heading: "Notifications",
    all: "All",
    unread: "Unread",
    markAllRead: "Mark all as read",
    markRead: "Mark as read",
    empty: "No notifications",
    loadMore: "Load more",
    channelLabel: {
      telegram: "Telegram",
      email: "Email",
      in_app: "In-App",
    },
    targetLabel: {
      group: "Shared HR Group",
      private: "Private Message",
    },
    statusLabel: {
      pending: "Pending",
      sent: "Sent",
      failed: "Failed",
      skipped: "Skipped",
    },
    eventTypes: {
      candidate_started: "Candidate started assessment",
      candidate_completed: "Assessment completed",
      block_completed: "Block completed",
      inactivity_risk: "Inactivity alert",
      report_ready: "Report ready",
      report_generated: "Report generated",
      candidate_shortlisted: "Candidate shortlisted",
      critical_red_flags: "Critical flags detected",
      result_summary: "Result summary sent",
      daily_digest: "Daily digest",
      team_summary: "Team summary",
      follow_up_required: "Follow-up required",
    },
  },

  // ─── Settings ───────────────────────────────────────────────────

  settings: {
    heading: "Settings",

    general: {
      heading: "General",
      appMode: "Application Mode",
      appModeMock: "Mock (local development)",
      appModeLive: "Live (Google Sheets + Drive)",
      defaultLanguage: "Default Language",
      timezone: "Timezone",
    },

    integrations: {
      heading: "Integration Health",
      googleSheets: "Google Sheets",
      googleDrive: "Google Drive",
      telegramBot: "Telegram Bot",
      lastChecked: "Last checked: {date}",
      status: {
        healthy: "Healthy",
        degraded: "Degraded",
        down: "Down",
        not_configured: "Not Configured",
      },
      testConnection: "Test Connection",
      reconnect: "Reconnect",
    },

    reportTemplates: {
      heading: "Report Templates",
      activeTemplate: "Active Template",
      templateVersion: "Template Version",
      engineVersion: "Engine Version",
      setActive: "Set as Active",
      preview: "Preview Template",
      sections: "Sections",
      noTemplates: "No report templates configured",
    },

    notificationTemplates: {
      heading: "Notification Templates",
      type: "Event Type",
      channel: "Channel",
      language: "Language",
      subject: "Subject",
      body: "Body",
      preview: "Preview",
      edit: "Edit",
      restore: "Restore Default",
    },

    assessmentConfig: {
      heading: "Assessment Configuration",
      blockName: "Block",
      version: "Version",
      questionCount: "Questions",
      estimatedTime: "Est. Duration",
      disc: "DISC Behavioral Profile",
      zima: "ZIMA Role-Fit Analysis",
      ritchie: "Ritchie–Martin Motivational Profile",
      viewConfig: "View Configuration",
    },

    languages: {
      heading: "Language Configuration",
      active: "Active Languages",
      totalKeys: "Total Keys",
      coverage: "Coverage",
      editDictionary: "Edit Dictionary",
    },
  },

  // ─── User Management (Admin) ────────────────────────────────────

  users: {
    heading: "User Management",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      telegramLinked: "Telegram Linked",
      language: "Language",
      lastActive: "Last Active",
      actions: "Actions",
    },
    roles: {
      admin: "Admin",
      hr: "HR Manager",
      viewer: "Viewer",
    },
    hrStatus: {
      active: "Active",
      suspended: "Suspended",
    },
    addUser: "Add User",
    editUser: "Edit User",
    suspendUser: "Suspend User",
    reactivateUser: "Reactivate User",
    telegramStatus: {
      linked: "Linked",
      notLinked: "Not Linked",
    },
  },

  // ─── Analytics (Admin) ──────────────────────────────────────────

  analytics: {
    heading: "Funnel Analytics",
    subtitle: "Comprehensive pipeline and conversion metrics",
    period: "Period",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    allTime: "All time",
    conversionFunnel: "Conversion Funnel",
    completionRate: "Completion Rate",
    averageDuration: "Avg. Duration",
    topRoles: "Top Recommended Roles",
    bandDistribution: "Band Distribution",
    hrPerformance: "HR Workload",
    exportCSV: "Export CSV",
  },

  // ─── Audit Log ──────────────────────────────────────────────────

  auditLog: {
    heading: "Audit Log",
    columns: {
      timestamp: "Timestamp",
      actor: "Actor",
      actorType: "Actor Type",
      action: "Action",
      entity: "Entity",
      entityId: "Entity ID",
      details: "Details",
      ipAddress: "IP Address",
    },
    actorTypes: {
      hr: "HR Manager",
      admin: "Admin",
      system: "System",
      candidate: "Candidate",
    },
    actions: {
      "candidate.create": "Candidate created",
      "candidate.update": "Candidate updated",
      "candidate.archive": "Candidate archived",
      "candidate.restore": "Candidate restored",
      "candidate.invite_resent": "Invite resent",
      "session.start": "Session started",
      "session.complete": "Session completed",
      "session.timeout": "Session timed out",
      "session.abandon": "Session abandoned",
      "report.generate": "Report generated",
      "report.download": "Report downloaded",
      "report.archive": "Report archived",
      "score.compute": "Score computed",
      "user.create": "User created",
      "user.update": "User updated",
      "user.suspend": "User suspended",
      "user.reactivate": "User reactivated",
      "notification.send": "Notification sent",
      "notification.fail": "Notification failed",
      "settings.update": "Settings updated",
      "preview.launch": "Preview launched",
    },
    empty: "No audit entries match the current filters",
    loadMore: "Load more entries",
  },

  // ─── Common Actions & Labels ────────────────────────────────────

  actions: {
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    close: "Close",
    back: "Back",
    next: "Next",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    retry: "Retry",
    copy: "Copy",
    copied: "Copied!",
    loading: "Loading...",
    saving: "Saving...",
    processing: "Processing...",
  },

  // ─── Validation & Feedback ──────────────────────────────────────

  validation: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    minLength: "Minimum {min} characters",
    maxLength: "Maximum {max} characters",
    success: "Changes saved successfully",
    error: "An error occurred. Please try again.",
    confirmAction: "Are you sure?",
    unsavedChanges: "You have unsaved changes. Discard them?",
    noPermission: "You do not have permission for this action",
  },

  // ─── Empty States ───────────────────────────────────────────────

  empty: {
    noCandidates: "No candidates yet",
    noCandidatesHint: "Invite your first candidate to get started",
    noResults: "No results found",
    noReports: "No reports generated",
    noNotifications: "All caught up — no new notifications",
    noAuditEntries: "No audit entries for the selected period",
    noComparisonData: "Select candidates to see a comparison",
  },

} as const;

export type HRAdminDictEN = typeof hrAdminEN;
