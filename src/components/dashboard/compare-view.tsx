"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScoreBadge, ScoreBar } from "@/components/ui/score-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Download } from "lucide-react";
import type { WebSummaryCard } from "@/reports/types";
import type { Candidate } from "@/types";

interface CompareViewProps {
  candidates: { candidate: Candidate; card: WebSummaryCard }[];
  onBack: () => void;
  onRemove?: (candidateId: string) => void;
}

const BAND_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  strong_hire: { bg: "bg-green-100", text: "text-green-700", label: "Strong Hire" },
  recommended: { bg: "bg-blue-100", text: "text-blue-700", label: "Recommended" },
  conditional: { bg: "bg-amber-100", text: "text-amber-700", label: "Conditional" },
  not_recommended: { bg: "bg-red-100", text: "text-red-700", label: "Not Recommended" },
};

const ROLE_LABELS: Record<string, string> = {
  hunter: "Hunter",
  full_cycle: "Full-Cycle AE",
  consultative: "Consultative",
  team_lead: "Team Lead",
};

const DISC_SCALES = ["D", "I", "S", "C", "K"] as const;

const RITCHIE_KEYS = [
  "INC", "REC", "ACH", "POW", "VAR", "AUT", "STR", "REL", "VAL", "DEV", "SEC", "DRI",
] as const;

export function CompareView({ candidates, onBack, onRemove }: CompareViewProps) {
  const colWidth = `${Math.floor(100 / candidates.length)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Compare Candidates</h1>
          <p className="text-xs text-gray-500">{candidates.length} candidates selected</p>
        </div>
      </div>

      {/* Candidate headers */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${candidates.length}, 1fr)` }}>
        {candidates.map(({ candidate: c, card }) => {
          const band = BAND_STYLES[card.overallBand] ?? BAND_STYLES.conditional;
          return (
            <Card key={c.id} className="relative border-gray-100 p-4">
              {onRemove && (
                <button
                  onClick={() => onRemove(c.id)}
                  className="absolute right-2 top-2 rounded p-1 text-gray-300 hover:text-gray-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="flex flex-col items-center text-center">
                <Avatar name={c.fullName} size="lg" />
                <p className="mt-2 text-sm font-semibold text-gray-900">{c.fullName}</p>
                <p className="text-xs text-gray-400">{c.position}</p>
                <div className="mt-2 flex items-center gap-2">
                  <ScoreBadge score={card.overallScore} />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${band.bg} ${band.text}`}>
                    {band.label}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Roles */}
      <CompareSection title="Recommended Roles" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <div key={card.candidateId} className="space-y-1 text-center">
            <p className="text-sm font-semibold text-gray-900">{ROLE_LABELS[card.primaryRole] ?? card.primaryRole}</p>
            <p className="text-xs text-gray-400">Secondary: {ROLE_LABELS[card.secondaryRole] ?? card.secondaryRole}</p>
          </div>
        ))}
      </CompareSection>

      {/* DISC */}
      <CompareSection title="DISC Behavioral" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <div key={card.candidateId} className="space-y-1.5">
            {DISC_SCALES.map((s) => (
              <ScoreBar key={s} label={s} value={card.discProfile.scales[s] ?? 0} size="sm" />
            ))}
          </div>
        ))}
      </CompareSection>

      {/* Ritchie–Martin */}
      <CompareSection title="Motivation Profile" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <div key={card.candidateId} className="space-y-1.5">
            {RITCHIE_KEYS.map((s) => (
              <ScoreBar key={s} label={s} value={card.ritchieProfile.scales[s] ?? 0} size="sm" />
            ))}
          </div>
        ))}
      </CompareSection>

      {/* ZIMA Fit */}
      <CompareSection title="ZIMA Role-Fit" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <div key={card.candidateId} className="space-y-1.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Fit Score</span>
              <ScoreBadge score={card.zimaProfile.fitScore} size="sm" />
            </div>
            {Object.entries(card.zimaProfile.dimensions).map(([k, v]) => (
              <ScoreBar
                key={k}
                label={k.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                value={v}
                size="sm"
              />
            ))}
          </div>
        ))}
      </CompareSection>

      {/* Strengths */}
      <CompareSection title="Top Strengths" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <ul key={card.candidateId} className="space-y-1">
            {card.strengths.slice(0, 5).map((s, i) => (
              <li key={i} className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">{s}</li>
            ))}
          </ul>
        ))}
      </CompareSection>

      {/* Risks */}
      <CompareSection title="Key Risks" cols={candidates.length}>
        {candidates.map(({ card }) => (
          <ul key={card.candidateId} className="space-y-1">
            {card.risks.length === 0 ? (
              <li className="text-xs text-gray-400">None identified</li>
            ) : (
              card.risks.slice(0, 3).map((r, i) => (
                <li key={i} className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">{r}</li>
              ))
            )}
          </ul>
        ))}
      </CompareSection>
    </div>
  );
}

function CompareSection({ title, cols, children }: { title: string; cols: number; children: React.ReactNode }) {
  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
