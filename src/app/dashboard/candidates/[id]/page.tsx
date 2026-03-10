"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CandidateDetail } from "@/components/dashboard/candidate-detail";
import { Loader2 } from "lucide-react";
import type { Candidate, AssessmentSession } from "@/types";
import type { WebSummaryCard } from "@/reports/types";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [summaryCard, setSummaryCard] = useState<WebSummaryCard | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/candidates/${candidateId}`);
        if (!res.ok) { router.push("/dashboard/candidates"); return; }
        const data = await res.json();
        setCandidate(data.candidate ?? null);
        setSession(data.session ?? null);
        setSummaryCard(data.summaryCard ?? null);
        setReportUrl(data.reportUrl ?? null);
      } catch {
        router.push("/dashboard/candidates");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [candidateId, router]);

  if (loading || !candidate) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header title="Candidate Detail" subtitle={candidate.fullName} />
      <div className="p-6">
        <CandidateDetail
          candidate={candidate}
          session={session}
          summaryCard={summaryCard}
          reportUrl={reportUrl}
          onBack={() => router.push("/dashboard/candidates")}
          onGenerateReport={async () => {
            const res = await fetch("/api/assessments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ candidateId }),
            });
            if (res.ok) {
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Report_${candidate.fullName}.pdf`;
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
        />
      </div>
    </div>
  );
}
