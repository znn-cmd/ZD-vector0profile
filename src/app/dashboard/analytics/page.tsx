"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelCards, type FunnelStatsExtended } from "@/components/dashboard/funnel-cards";
import { ScoreBar } from "@/components/ui/score-bar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, Users, Clock, Target,
  Loader2, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import type { Candidate } from "@/types";

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((d) => setCandidates(d.candidates ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  const total = candidates.length || 1;
  const byStatus = (s: string) => candidates.filter((c) => c.status === s).length;
  const completed = byStatus("completed") + byStatus("report_generated") + byStatus("report_sent");
  const completionRate = Math.round((completed / total) * 100);

  const stats: FunnelStatsExtended = {
    invited: byStatus("invited"),
    started: byStatus("in_progress"),
    completed,
    timeout: 0,
    shortlist: byStatus("report_generated") + byStatus("report_sent"),
    hired: 0,
  };

  // Role distribution
  const roleCount: Record<string, number> = {};
  candidates.forEach((c) => {
    roleCount[c.position] = (roleCount[c.position] || 0) + 1;
  });
  const topRoles = Object.entries(roleCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="min-h-full">
      <Header title="Analytics" subtitle="Pipeline performance and insights" />

      <div className="space-y-6 p-6">
        {/* Extended Funnel */}
        <FunnelCards stats={stats} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Candidates"
            value={candidates.length}
            icon={Users}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <MetricCard
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={TrendingUp}
            color="text-green-600"
            bg="bg-green-50"
            trend={completionRate >= 60 ? "up" : completionRate >= 40 ? "flat" : "down"}
          />
          <MetricCard
            label="Avg. Time to Complete"
            value="62 min"
            icon={Clock}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <MetricCard
            label="Active Assessments"
            value={byStatus("in_progress")}
            icon={Target}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>

        {/* Position Distribution */}
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-zima-500" /> Candidates by Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRoles.map(([role, count]) => (
              <ScoreBar
                key={role}
                label={role}
                value={(count / total) * 100}
                max={100}
                showValue={false}
              />
            ))}
            {topRoles.length === 0 && (
              <p className="py-4 text-center text-xs text-gray-400">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-sm">Pipeline Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Invited", count: byStatus("invited"), variant: "info" as const },
                { label: "In Progress", count: byStatus("in_progress"), variant: "warning" as const },
                { label: "Completed", count: byStatus("completed"), variant: "success" as const },
                { label: "Report Ready", count: byStatus("report_generated"), variant: "default" as const },
                { label: "Report Sent", count: byStatus("report_sent"), variant: "neutral" as const },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums text-gray-900">{s.count}</p>
                  <Badge variant={s.variant} className="mt-1">{s.label}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label, value, icon: Icon, color, bg, trend,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  color: string;
  bg: string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <Card className="border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-400"
          }`}>
            {trend === "up" ? <ArrowUp className="h-3 w-3" /> : trend === "down" ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  );
}
