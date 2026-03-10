"use client";

import { Card } from "@/components/ui/card";
import {
  Send, PlayCircle, CheckCircle2, AlertTriangle, Clock,
  FileText, ArrowRight, Star, UserCheck,
} from "lucide-react";

export interface FunnelStatsExtended {
  invited: number;
  started: number;
  completed: number;
  timeout: number;
  shortlist: number;
  hired: number;
}

interface FunnelCardsProps {
  stats: FunnelStatsExtended;
}

const stages = [
  { key: "invited" as const, label: "Invites Sent", icon: Send, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-100" },
  { key: "started" as const, label: "Started", icon: PlayCircle, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-100" },
  { key: "completed" as const, label: "Completed", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", ring: "ring-green-100" },
  { key: "timeout" as const, label: "Timeout", icon: Clock, color: "text-red-500", bg: "bg-red-50", ring: "ring-red-100" },
  { key: "shortlist" as const, label: "Shortlist", icon: Star, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-100" },
  { key: "hired" as const, label: "Hired", icon: UserCheck, color: "text-zima-600", bg: "bg-zima-50", ring: "ring-zima-100" },
];

export function FunnelCards({ stats }: FunnelCardsProps) {
  const total = stats.invited || 1;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stages.map((s) => {
        const count = stats[s.key];
        const pct = Math.round((count / total) * 100);

        return (
          <Card
            key={s.key}
            className="group relative overflow-hidden border-gray-100 p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} ring-1 ${s.ring}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <span className="text-[10px] font-medium text-gray-400">{pct}%</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tabular-nums text-gray-900">{count}</p>
              <p className="text-[11px] font-medium text-gray-500">{s.label}</p>
            </div>
            {/* Subtle bottom bar */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100" style={{ width: "100%" }}>
              <div className={`h-full ${s.bg.replace("50", "400")} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
