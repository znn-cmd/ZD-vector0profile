"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { FunnelCards, type FunnelStatsExtended } from "@/components/dashboard/funnel-cards";
import { NotificationsFeed } from "@/components/dashboard/notifications-feed";
import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Plus, Loader2, TrendingUp, Users, Clock, FileText } from "lucide-react";
import type { Candidate, Notification, Lang } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<FunnelStatsExtended | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [candRes, notifRes] = await Promise.all([
        fetch("/api/candidates"),
        fetch("/api/notifications"),
      ]);
      const candData = await candRes.json();
      const notifData = await notifRes.json();

      const all = (candData.candidates ?? []) as Candidate[];
      setCandidates(all);
      setNotifications(notifData.notifications ?? []);

      const count = (s: string) => all.filter((c) => c.status === s).length;
      setStats({
        invited: count("invited"),
        started: count("in_progress"),
        completed: count("completed") + count("report_generated") + count("report_sent"),
        timeout: 0,
        shortlist: count("report_generated") + count("report_sent"),
        hired: 0,
      });
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerateReport = async (candidateId: string) => {
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
      a.download = "ZIMA_Report.pdf";
      a.click();
      URL.revokeObjectURL(url);
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header
        title="Dashboard"
        subtitle="Assessment pipeline overview"
        actions={
          <Button size="sm" onClick={() => setShowNewForm(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Candidate
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        {/* Funnel Cards */}
        {stats && <FunnelCards stats={stats} />}

        {/* Quick stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickStat
            icon={Users}
            label="Active Candidates"
            value={candidates.filter((c) => c.status === "in_progress").length}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <QuickStat
            icon={Clock}
            label="Avg. Completion"
            value="62 min"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <QuickStat
            icon={TrendingUp}
            label="Completion Rate"
            value={`${candidates.length > 0 ? Math.round((candidates.filter((c) => ["completed", "report_generated", "report_sent"].includes(c.status)).length / candidates.length) * 100) : 0}%`}
            color="text-green-600"
            bg="bg-green-50"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CandidatesTable
              candidates={candidates}
              onGenerateReport={handleGenerateReport}
              onViewDetail={(id) => router.push(`/dashboard/candidates/${id}`)}
              onCompare={(ids) => {
                const params = ids.join(",");
                router.push(`/dashboard/compare?ids=${params}`);
              }}
            />
          </div>
          <div>
            <NotificationsFeed notifications={notifications} />
          </div>
        </div>
      </div>

      {/* New Candidate Modal */}
      <NewCandidateModal
        open={showNewForm}
        onClose={() => setShowNewForm(false)}
        onCreated={() => {
          setShowNewForm(false);
          fetchData();
        }}
      />
    </div>
  );
}

function QuickStat({
  icon: Icon, label, value, color, bg,
}: {
  icon: typeof Users; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <Card className="flex items-center gap-4 border-gray-100 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

function NewCandidateModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    lang: "en" as Lang,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hrId: "hr_1" }),
      });
      if (res.ok) onCreated();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Candidate" size="md">
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <Input
            label="Full Name"
            required
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder="Alexei Ivanov"
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="alexei@company.com"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+971..."
            />
            <Input
              label="Position"
              required
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              placeholder="Sales Manager"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Assessment Language</label>
            <div className="flex gap-2">
              {(["en", "ru"] as Lang[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, lang }))}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase transition-colors ${
                    form.lang === lang
                      ? "border-zima-500 bg-zima-50 text-zima-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Generate Link"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
