"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import type {
  Candidate,
  AssessmentSession,
  AssessmentBlockId,
  AnswerValue,
  Lang,
  BlockProgress,
} from "@/types";
import { assessmentConfigs, defaultBlockOrder, totalEstimatedMinutes } from "@/config/assessments";
import { getDictionary, resolve, interpolate } from "@/config/i18n";
import { LanguageSwitcher } from "@/components/assessment/language-switcher";
import { ProgressIndicator } from "@/components/assessment/progress-indicator";
import { QuestionBlock } from "@/components/assessment/question-block";
import { CompletionScreen } from "@/components/assessment/completion-screen";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, Shield, CheckCircle2 } from "lucide-react";

type Phase = "loading" | "welcome" | "assessment" | "transition" | "completed" | "error";

const AUTOSAVE_INTERVAL = 15_000; // 15 seconds

export default function AssessPage() {
  const params = useParams();
  const token = params.token as string;

  const [phase, setPhase] = useState<Phase>("loading");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [currentBlock, setCurrentBlock] = useState<AssessmentBlockId>("disc");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const pendingSave = useRef(false);
  const lastSavedAnswers = useRef<string>("");

  // ─── Load candidate and session ──────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/invite?token=${token}`);
        if (!res.ok) {
          setErrorMessage("This assessment link is invalid or has expired.");
          setPhase("error");
          return;
        }
        const data = await res.json();
        setCandidate(data.candidate);
        setLang(data.candidate.lang ?? "en");

        if (data.session) {
          setSession(data.session);
          const sess = data.session as AssessmentSession;

          if (sess.completedAt) {
            setPhase("completed");
            return;
          }

          // Resume: load current block and answers
          setCurrentBlock(sess.currentBlock);
          setAnswers(sess.progress[sess.currentBlock]?.answers ?? {});
          setPhase("welcome");
        } else {
          setPhase("welcome");
        }
      } catch {
        setErrorMessage("Failed to load assessment. Please try again.");
        setPhase("error");
      }
    }
    load();
  }, [token]);

  // ─── Autosave mechanism ──────────────────────────────────────────
  const saveProgress = useCallback(async () => {
    if (!candidate || pendingSave.current) return;

    const answersJson = JSON.stringify(answers);
    if (answersJson === lastSavedAnswers.current) return;
    if (Object.keys(answers).length === 0) return;

    pendingSave.current = true;
    setSaveStatus("saving");

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          blockId: currentBlock,
          answers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        lastSavedAnswers.current = answersJson;
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch {
      // Silent failure — will retry next interval
    } finally {
      pendingSave.current = false;
    }
  }, [candidate, currentBlock, answers]);

  // Autosave interval
  useEffect(() => {
    if (phase !== "assessment") return;
    const timer = setInterval(saveProgress, AUTOSAVE_INTERVAL);
    return () => clearInterval(timer);
  }, [phase, saveProgress]);

  // Save on answer change (debounced)
  const answerTimeout = useRef<ReturnType<typeof setTimeout>>();
  const handleAnswer = useCallback(
    (questionId: string, answer: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      clearTimeout(answerTimeout.current);
      answerTimeout.current = setTimeout(saveProgress, 3000);
    },
    [saveProgress]
  );

  // Prevent accidental navigation
  useEffect(() => {
    if (phase !== "assessment") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  // ─── Block completion handler ────────────────────────────────────
  const handleBlockComplete = useCallback(async () => {
    if (!candidate) return;

    // Save final answers first
    await saveProgress();

    // Mark block complete on server
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: candidate.id,
        blockId: currentBlock,
      }),
    });

    const data = await res.json();
    setSession(data.session);

    if (data.complete) {
      setPhase("completed");
    } else {
      setPhase("transition");
    }
  }, [candidate, currentBlock, saveProgress]);

  // ─── Start next block ────────────────────────────────────────────
  const startNextBlock = useCallback(() => {
    if (!session) return;
    const idx = session.blockOrder.indexOf(currentBlock);
    const next = session.blockOrder[idx + 1];
    if (next) {
      setCurrentBlock(next);
      setAnswers(session.progress[next]?.answers ?? {});
      lastSavedAnswers.current = JSON.stringify(session.progress[next]?.answers ?? {});
      setPhase("assessment");
    }
  }, [session, currentBlock]);

  // ─── Start assessment ────────────────────────────────────────────
  const startAssessment = useCallback(() => {
    if (session) {
      setCurrentBlock(session.currentBlock);
      setAnswers(session.progress[session.currentBlock]?.answers ?? {});
      lastSavedAnswers.current = JSON.stringify(
        session.progress[session.currentBlock]?.answers ?? {}
      );
    }
    setPhase("assessment");
  }, [session]);

  // ─── Dictionary for current language ─────────────────────────────
  const dict = getDictionary(lang);
  const r = (key: string) =>
    resolve(dict as unknown as Record<string, unknown>, key);

  // ─── Block labels ────────────────────────────────────────────────
  const blockLabels: Record<AssessmentBlockId, string> = {
    disc: r("assessment.disc.title"),
    zima: r("assessment.zima.title"),
    ritchie_martin: r("assessment.ritchie.title"),
  };

  // ─── Render phases ───────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (phase === "completed") {
    return (
      <CompletionScreen
        candidateName={candidate?.fullName ?? ""}
        lang={lang}
      />
    );
  }

  if (phase === "welcome") {
    const hasProgress = session && !session.completedAt;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zima-50 via-white to-gray-50 p-6">
        <div className="mx-auto w-full max-w-lg animate-slide-up">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img
              src="/ZIMA-logo.svg"
              alt="ZIMA Dubai"
              className="mx-auto mb-4 h-16 w-auto"
            />
            <LanguageSwitcher current={lang} onChange={setLang} />
          </div>

          {/* Welcome card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {r("assessment.welcome.title")}
            </h1>

            {candidate && (
              <p className="mb-4 text-gray-600">
                {interpolate(r("assessment.welcome.greeting"), {
                  name: candidate.fullName,
                })}
              </p>
            )}

            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              {r("assessment.welcome.intro")}
            </p>

            {/* Blocks overview */}
            <div className="mb-6 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                {r("assessment.welcome.blocks")}
              </p>
              {defaultBlockOrder.map((blockId, i) => {
                const cfg = assessmentConfigs[blockId];
                const status = session?.progress[blockId]?.status ?? "not_started";
                return (
                  <div
                    key={blockId}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zima-100 text-xs font-bold text-zima-700">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {blockLabels[blockId]}
                      </p>
                      <p className="text-xs text-gray-400">
                        ~{cfg.estimatedMinutes} {r("common.minutes")} · {cfg.questions.length} questions
                      </p>
                    </div>
                    {status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                ~{totalEstimatedMinutes} {r("common.minutes")} total · {r("assessment.welcome.timeNote")}
              </span>
            </div>

            <Button size="lg" className="w-full" onClick={startAssessment}>
              {hasProgress
                ? r("assessment.welcome.resumeButton")
                : r("assessment.welcome.startButton")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "transition") {
    const idx = defaultBlockOrder.indexOf(currentBlock);
    const nextBlockId = defaultBlockOrder[idx + 1];
    const nextConfig = nextBlockId ? assessmentConfigs[nextBlockId] : null;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-white p-6">
        <div className="mx-auto max-w-md animate-slide-up text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            {r("assessment.blockTransition.title")}
          </h2>
          <p className="mb-4 text-gray-600">
            {interpolate(r("assessment.blockTransition.completed"), {
              blockName: blockLabels[currentBlock],
            })}
          </p>
          {nextConfig && (
            <>
              <p className="mb-2 text-sm text-gray-500">
                {interpolate(r("assessment.blockTransition.nextBlock"), {
                  blockName: blockLabels[nextBlockId!],
                })}
              </p>
              <p className="mb-6 text-xs text-gray-400">
                {interpolate(r("assessment.blockTransition.estimatedTime"), {
                  minutes: nextConfig.estimatedMinutes,
                })}
              </p>
            </>
          )}
          <Button size="lg" onClick={startNextBlock}>
            {r("assessment.blockTransition.continueButton")}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Assessment phase ────────────────────────────────────────────
  const config = assessmentConfigs[currentBlock];
  const blockStatuses = defaultBlockOrder.reduce(
    (acc, blockId) => {
      acc[blockId] = session?.progress[blockId]?.status ?? "not_started";
      if (blockId === currentBlock && acc[blockId] !== "completed") {
        acc[blockId] = "in_progress";
      }
      return acc;
    },
    {} as Record<AssessmentBlockId, BlockProgress["status"]>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <img src="/ZIMA-logo.svg" alt="ZIMA" className="h-6 w-auto" />

          <ProgressIndicator
            blocks={defaultBlockOrder}
            currentBlock={currentBlock}
            blockStatuses={blockStatuses}
            blockLabels={blockLabels}
          />

          <div className="flex items-center gap-3">
            <span
              className={`text-xs transition-opacity ${
                saveStatus === "saving"
                  ? "text-yellow-600"
                  : saveStatus === "saved"
                  ? "text-green-600"
                  : "text-transparent"
              }`}
            >
              {saveStatus === "saving"
                ? r("assessment.progress.saving")
                : r("assessment.progress.autoSaved")}
            </span>
            <LanguageSwitcher current={lang} onChange={setLang} />
          </div>
        </div>
      </div>

      {/* Block header */}
      <div className="bg-white px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {blockLabels[currentBlock]}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {r(`assessment.${currentBlock === "ritchie_martin" ? "ritchie" : currentBlock}.description`)}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="p-6">
        <QuestionBlock
          config={config}
          answers={answers}
          lang={lang}
          onAnswer={handleAnswer}
          onComplete={handleBlockComplete}
        />
      </div>
    </div>
  );
}
