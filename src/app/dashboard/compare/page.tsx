"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CompareView } from "@/components/dashboard/compare-view";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, GitCompare } from "lucide-react";
import type { Candidate } from "@/types";
import type { WebSummaryCard } from "@/reports/types";

interface CompareItem {
  candidate: Candidate;
  card: WebSummaryCard;
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-zima-500" /></div>}>
      <ComparePageInner />
    </Suspense>
  );
}

function ComparePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const [items, setItems] = useState<CompareItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (ids.length < 2) { setLoading(false); return; }
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/candidates/${id}`);
            return res.ok ? res.json() : null;
          }),
        );

        const valid = results
          .filter((r): r is { candidate: Candidate; summaryCard: WebSummaryCard } =>
            r !== null && r.candidate && r.summaryCard,
          )
          .map((r) => ({ candidate: r.candidate, card: r.summaryCard }));

        setItems(valid);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header title="Compare Candidates" subtitle={`${items.length} candidates`} />
      <div className="p-6">
        {items.length < 2 ? (
          <EmptyState
            icon={GitCompare}
            title="Select 2–5 candidates to compare"
            description="Go to the Candidates tab, select candidates using checkboxes, then click Compare."
          />
        ) : (
          <CompareView
            candidates={items}
            onBack={() => router.push("/dashboard/candidates")}
            onRemove={(id) => {
              const remaining = items.filter((item) => item.candidate.id !== id);
              setItems(remaining);
              if (remaining.length < 2) router.push("/dashboard/candidates");
            }}
          />
        )}
      </div>
    </div>
  );
}
