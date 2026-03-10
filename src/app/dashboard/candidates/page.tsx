"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import type { Candidate, Lang } from "@/types";

export default function CandidatesListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data.candidates ?? []);
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

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
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <Button size="sm" onClick={() => setShowNew(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Candidate
          </Button>
        }
      />

      <div className="p-6">
        <CandidatesTable
          candidates={candidates}
          onViewDetail={(id) => router.push(`/dashboard/candidates/${id}`)}
          onGenerateReport={async (id) => {
            await fetch("/api/assessments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ candidateId: id }),
            });
            fetchCandidates();
          }}
          onArchive={async (id) => {
            await fetch(`/api/candidates/${id}`, { method: "DELETE" });
            fetchCandidates();
          }}
          onResendInvite={async (id) => {
            await fetch("/api/invite", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ candidateId: id, resend: true }),
            });
          }}
          onCompare={(ids) => router.push(`/dashboard/compare?ids=${ids.join(",")}`)}
        />
      </div>

      <NewCandidateQuickModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={() => { setShowNew(false); fetchCandidates(); }}
      />
    </div>
  );
}

function NewCandidateQuickModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", position: "", lang: "en" as Lang });
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
          <Input label="Full Name" required value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Alexei Ivanov" />
          <Input label="Email" type="email" required value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="alexei@company.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+971..." />
            <Input label="Position" required value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder="Sales Manager" />
          </div>
          <div className="flex gap-2">
            {(["en", "ru"] as Lang[]).map((lang) => (
              <button key={lang} type="button" onClick={() => setForm((f) => ({ ...f, lang }))}
                className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase ${
                  form.lang === lang ? "border-zima-500 bg-zima-50 text-zima-700" : "border-gray-200 text-gray-500"
                }`}>{lang}</button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
