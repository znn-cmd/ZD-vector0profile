"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, LogIn, Loader2, Users, FileText, BarChart3 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleJoinAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError("");

    // Extract token from full URL or use raw token
    let token = inviteCode.trim();
    const match = token.match(/\/assess\/([a-zA-Z0-9_-]+)/);
    if (match) token = match[1];

    try {
      const res = await fetch(`/api/invite?token=${token}`);
      if (res.ok) {
        router.push(`/assess/${token}`);
      } else {
        setError("Invalid or expired invite link. Please check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Brand */}
      <div className="hidden w-1/2 bg-gradient-to-br from-zima-900 via-zima-800 to-zima-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">ZIMA Dubai</h2>
              <p className="text-xs text-white/50">Vector Profile</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Comprehensive
            <br />
            Candidate Assessment
            <br />
            <span className="text-gold-300">Platform</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Three-block behavioral, motivational, and role-fit assessment
            designed for hiring excellence. DISC, Ritchie–Martin, and ZIMA
            profiling in a single integrated experience.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: "DISC Behavioral", desc: "100 items" },
              { icon: BarChart3, label: "Ritchie–Martin", desc: "Motivational" },
              { icon: FileText, label: "ZIMA Role-Fit", desc: "Company match" },
            ].map((b) => (
              <div key={b.label} className="rounded-xl bg-white/5 p-4">
                <b.icon className="mb-2 h-5 w-5 text-gold-300" />
                <p className="text-xs font-semibold text-white">{b.label}</p>
                <p className="text-[10px] text-white/40">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} ZIMA Dubai. All rights reserved.
        </p>
      </div>

      {/* Right: Entry points */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zima-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">ZIMA Dubai Vector Profile</span>
          </div>

          {/* Candidate entry */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Take Assessment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your invite link or code to begin the assessment.
            </p>
            <form onSubmit={handleJoinAssessment} className="mt-4 space-y-3">
              <Input
                placeholder="Paste your invite link or token..."
                value={inviteCode}
                onChange={(e) => { setInviteCode(e.target.value); setError(""); }}
                error={error}
              />
              <Button type="submit" className="w-full gap-2" disabled={loading || !inviteCode.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Start Assessment
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or</span>
            </div>
          </div>

          {/* HR / Admin login */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">HR / Admin Access</h3>
            <p className="mt-1 text-xs text-gray-500">Admin: use login <strong>admin</strong> and the configured password. HR: use your work email and password from the system.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoginError("");
                setLoginLoading(true);
                try {
                  const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (res.ok) {
                    router.push("/dashboard");
                    router.refresh();
                  } else {
                    setLoginError(data.error ?? "Invalid email or password");
                  }
                } catch {
                  setLoginError("Something went wrong");
                } finally {
                  setLoginLoading(false);
                }
              }}
              className="mt-3 space-y-3"
            >
              <Input
                type="text"
                autoComplete="username"
                placeholder="Email or admin login"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
              />
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
              />
              {loginError && (
                <p className="text-xs text-red-600">{loginError}</p>
              )}
              <Button type="submit" className="w-full gap-2" disabled={loginLoading || !loginEmail.trim() || !loginPassword}>
                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
