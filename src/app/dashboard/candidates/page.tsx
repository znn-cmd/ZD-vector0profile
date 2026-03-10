"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import type { Candidate, Lang } from "@/types";
import { generateInviteUrl } from "@/lib/utils";

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
        onCreated={() => { fetchCandidates(); }}
      />
    </div>
  );
}

function NewCandidateQuickModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", position: "", lang: "en" as Lang });
  const [submitting, setSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setInviteUrl(null);
    setCopied(false);
    setForm({ fullName: "", email: "", phone: "", position: "", lang: "en" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setCopied(false);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hrId: "hr_1" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const candidate: Candidate | undefined = data.candidate;
      if (!candidate) return;

      let token = candidate.inviteToken;
      try {
        const inviteRes = await fetch("/api/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId: candidate.id }),
        });
        if (inviteRes.ok) {
          const inviteData = await inviteRes.json();
          token = inviteData.inviteToken ?? token;
        }
      } catch {
        // fallback to candidate.inviteToken
      }

      const url = generateInviteUrl(token);
      setInviteUrl(url);
      onCreated();

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        // clipboard may be unavailable
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyClick = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New Candidate" size="md">
      {inviteUrl ? (
        <>
          <ModalBody className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <div>
                <p className="text-sm font-semibold text-green-800">Invite link generated</p>
                <p className="mt-1 text-xs text-green-700">
                  Share this link with the candidate. It has been copied to your clipboard (if permitted by the browser).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="truncate text-xs text-gray-700">{inviteUrl}</span>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={handleCopyClick}>
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" onClick={handleClose}>Close</Button>
          </ModalFooter>
        </>
      ) : (
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
            <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Generate Link"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
