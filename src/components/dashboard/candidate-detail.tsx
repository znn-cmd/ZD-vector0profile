"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScoreBar, ScoreBadge } from "@/components/ui/score-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, FileText, Send, Archive, Copy, Download,
  CheckCircle2, AlertTriangle, Target, Brain, Lightbulb,
  Shield, Zap, Users, TrendingUp,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Candidate, AssessmentSession } from "@/types";
import type { WebSummaryCard } from "@/reports/types";

interface CandidateDetailProps {
  candidate: Candidate;
  session?: AssessmentSession | null;
  summaryCard?: WebSummaryCard | null;
  reportUrl?: string | null;
  onBack: () => void;
  onGenerateReport?: () => void;
  onResendInvite?: () => void;
  onArchive?: () => void;
  onDownloadReport?: () => void;
}

const BAND_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  strong_hire: { bg: "bg-green-100", text: "text-green-700", label: "Strong Hire" },
  recommended: { bg: "bg-blue-100", text: "text-blue-700", label: "Recommended" },
  conditional: { bg: "bg-amber-100", text: "text-amber-700", label: "Conditional" },
  not_recommended: { bg: "bg-red-100", text: "text-red-700", label: "Not Recommended" },
};

const ROLE_LABELS: Record<string, string> = {
  hunter: "New Business Hunter",
  full_cycle: "Full-Cycle AE",
  consultative: "Consultative Seller",
  team_lead: "Sales Team Lead",
};

export function CandidateDetail({
  candidate, session, summaryCard, reportUrl,
  onBack, onGenerateReport, onResendInvite, onArchive, onDownloadReport,
}: CandidateDetailProps) {
  const sc = summaryCard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={onBack} className="mt-1 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={candidate.fullName} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{candidate.fullName}</h1>
              <p className="text-sm text-gray-500">{candidate.email}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <StatusBadge status={candidate.status} />
                <span className="text-xs text-gray-400">{candidate.position}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {candidate.status === "invited" && (
              <Button variant="outline" size="sm" onClick={onResendInvite}>
                <Send className="h-3.5 w-3.5" /> Resend Invite
              </Button>
            )}
            {(candidate.status === "completed" || candidate.status === "report_generated") && (
              <Button size="sm" onClick={onGenerateReport}>
                <FileText className="h-3.5 w-3.5" /> Generate Report
              </Button>
            )}
            {reportUrl && (
              <Button variant="outline" size="sm" onClick={onDownloadReport}>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onArchive}>
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Score Overview (only if we have results) */}
      {sc && <ScoreOverview card={sc} />}

      {/* Tabs */}
      <Tabs defaultValue={sc ? "profile" : "progress"}>
        <TabsList>
          {sc && <TabsTrigger value="profile">Profile</TabsTrigger>}
          <TabsTrigger value="progress">Progress</TabsTrigger>
          {sc && <TabsTrigger value="insights">Insights</TabsTrigger>}
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        {sc && (
          <TabsContent value="profile" className="mt-4 space-y-4">
            <ProfileTab card={sc} />
          </TabsContent>
        )}

        <TabsContent value="progress" className="mt-4">
          <ProgressTab candidate={candidate} session={session ?? undefined} />
        </TabsContent>

        {sc && (
          <TabsContent value="insights" className="mt-4 space-y-4">
            <InsightsTab card={sc} />
          </TabsContent>
        )}

        <TabsContent value="info" className="mt-4">
          <InfoTab candidate={candidate} reportUrl={reportUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Score Overview ──────────────────────────────────────────────────

function ScoreOverview({ card }: { card: WebSummaryCard }) {
  const band = BAND_STYLES[card.overallBand] ?? BAND_STYLES.conditional;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      <Card className="col-span-2 border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <ScoreBadge score={card.overallScore} size="lg" />
          <div>
            <p className="text-sm font-medium text-gray-500">Overall Score</p>
            <div className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${band.bg} ${band.text}`}>
              {band.label}
            </div>
          </div>
        </div>
      </Card>
      <Card className="border-gray-100 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Primary Role</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">{ROLE_LABELS[card.primaryRole] ?? card.primaryRole}</p>
      </Card>
      <Card className="border-gray-100 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Secondary Role</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">{ROLE_LABELS[card.secondaryRole] ?? card.secondaryRole}</p>
      </Card>
      <Card className="border-gray-100 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">DISC Profile</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">{card.discProfile.primary}/{card.discProfile.secondary}</p>
        <p className="text-[10px] text-gray-400">{card.discProfile.overall}/100</p>
      </Card>
      <Card className="border-gray-100 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">ZIMA Fit</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">{card.zimaProfile.fitScore}/100</p>
        {card.zimaProfile.redFlagCount > 0 && (
          <Badge variant="danger" className="mt-1">{card.zimaProfile.redFlagCount} flags</Badge>
        )}
      </Card>
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────

function ProfileTab({ card }: { card: WebSummaryCard }) {
  const discScales = Object.entries(card.discProfile.scales).map(([k, v]) => ({
    label: k, value: v,
  }));

  const ritchieScales = Object.entries(card.ritchieProfile.scales).map(([k, v]) => ({
    label: k, value: v,
  }));

  const zimaScales = Object.entries(card.zimaProfile.dimensions).map(([k, v]) => ({
    label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value: v,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-zima-500" /> DISC Behavioral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {discScales.map((s) => (
            <ScoreBar key={s.label} label={s.label} value={s.value} size="sm" />
          ))}
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">SJT Score: <strong>{card.discProfile.sjtScore}</strong>/100</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-purple-500" /> Ritchie–Martin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ritchieScales.map((s) => (
            <ScoreBar key={s.label} label={s.label} value={s.value} size="sm" />
          ))}
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <p>Top: <strong>{card.ritchieProfile.topMotivators.join(", ")}</strong></p>
            <p>Low: <strong>{card.ritchieProfile.bottomMotivators.join(", ")}</strong></p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" /> ZIMA Role-Fit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {zimaScales.map((s) => (
              <ScoreBar key={s.label} label={s.label} value={s.value} size="sm" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Progress Tab ────────────────────────────────────────────────────

function ProgressTab({ candidate, session }: { candidate: Candidate; session?: AssessmentSession }) {
  const blocks = ["disc", "zima", "ritchie_martin"] as const;
  const blockNames: Record<string, string> = { disc: "DISC", zima: "ZIMA", ritchie_martin: "Ritchie–Martin" };

  if (!session) {
    return (
      <Card className="border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-500">Assessment not started yet</p>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100">
      <CardContent className="space-y-4 py-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Started: {formatDateTime(session.startedAt)}</span>
          {session.completedAt && <span>Completed: {formatDateTime(session.completedAt)}</span>}
        </div>
        {blocks.map((blockId) => {
          const prog = session.progress[blockId];
          const answered = prog ? Object.keys(prog.answers).length : 0;
          const status = prog?.status ?? "not_started";

          return (
            <div key={blockId} className="rounded-lg border border-gray-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : status === "in_progress" ? (
                    <div className="h-4 w-4 animate-pulse rounded-full bg-amber-400" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-gray-200" />
                  )}
                  <span className="text-sm font-medium text-gray-900">{blockNames[blockId]}</span>
                </div>
                <StatusBadge status={status === "not_started" ? "invited" : status === "in_progress" ? "in_progress" : "completed"} />
              </div>
              <Progress value={answered} max={100} barClassName={status === "completed" ? "bg-green-500" : undefined} />
              <p className="mt-1 text-xs text-gray-400">{answered} answers recorded</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Insights Tab ────────────────────────────────────────────────────

function InsightsTab({ card }: { card: WebSummaryCard }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <InsightList
        title="Strengths"
        items={card.strengths}
        icon={CheckCircle2}
        iconColor="text-green-500"
        bg="bg-green-50"
      />
      <InsightList
        title="Risk Factors"
        items={card.risks}
        icon={AlertTriangle}
        iconColor="text-red-500"
        bg="bg-red-50"
      />
      <InsightList
        title="Interview Focus Questions"
        items={card.interviewQuestions}
        icon={Target}
        iconColor="text-blue-500"
        bg="bg-blue-50"
      />
      <InsightList
        title="Management Recommendations"
        items={card.managementRecs}
        icon={Brain}
        iconColor="text-purple-500"
        bg="bg-purple-50"
      />
      {card.retentionFlags.length > 0 && (
        <InsightList
          title="Retention Risk Flags"
          items={card.retentionFlags}
          icon={Lightbulb}
          iconColor="text-amber-500"
          bg="bg-amber-50"
          className="lg:col-span-2"
        />
      )}
      {/* Recommendation */}
      <Card className="border-gray-100 lg:col-span-2">
        <CardContent className="py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Final Recommendation</p>
          <p className="text-sm leading-relaxed text-gray-700">{card.recommendation}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightList({
  title, items, icon: Icon, iconColor, bg, className,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  iconColor: string;
  bg: string;
  className?: string;
}) {
  return (
    <Card className={`border-gray-100 ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className={`h-4 w-4 ${iconColor}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-xs text-gray-400">None identified</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className={`flex items-start gap-2 rounded-lg ${bg} px-3 py-2 text-xs text-gray-700`}>
                <span className="mt-0.5 shrink-0 text-gray-400">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Info Tab ────────────────────────────────────────────────────────

function InfoTab({ candidate, reportUrl }: { candidate: Candidate; reportUrl?: string | null }) {
  const fields = [
    { label: "Full Name", value: candidate.fullName },
    { label: "Email", value: candidate.email },
    { label: "Phone", value: candidate.phone ?? "—" },
    { label: "Position", value: candidate.position },
    { label: "Language", value: candidate.lang.toUpperCase() },
    { label: "Created", value: formatDateTime(candidate.createdAt) },
    { label: "Last Updated", value: formatDateTime(candidate.updatedAt) },
    { label: "Invite Token", value: candidate.inviteToken },
    ...(reportUrl ? [{ label: "Report URL", value: reportUrl }] : []),
  ];

  return (
    <Card className="border-gray-100">
      <CardContent className="py-4">
        <dl className="divide-y divide-gray-100">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center justify-between py-2.5">
              <dt className="text-xs font-medium text-gray-500">{f.label}</dt>
              <dd className="max-w-[60%] truncate text-sm text-gray-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
