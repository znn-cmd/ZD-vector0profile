"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  AssessmentBlockConfig,
  AssessmentQuestion,
  AnswerValue,
  Lang,
} from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDictionary, resolve, interpolate } from "@/config/i18n";

interface QuestionBlockProps {
  config: AssessmentBlockConfig;
  answers: Record<string, AnswerValue>;
  lang: Lang;
  onAnswer: (questionId: string, answer: AnswerValue) => void;
  onComplete: () => void;
}

export function QuestionBlock({
  config,
  answers,
  lang,
  onAnswer,
  onComplete,
}: QuestionBlockProps) {
  const dict = getDictionary(lang);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(() => {
    const firstUnanswered = config.questions.findIndex(
      (q) => !answers[q.id]
    );
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });

  const question = config.questions[currentIdx];
  const totalQuestions = config.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const isLastQuestion = currentIdx === totalQuestions - 1;
  const currentAnswer = answers[question?.id];
  const currentQuestionComplete =
    question?.type === "disc_pair"
      ? currentAnswer?.type === "pair" && currentAnswer.most && currentAnswer.least
      : !!currentAnswer;
  const showCompleteButton = allAnswered || (isLastQuestion && currentQuestionComplete);

  // Simple per-block timer: shows elapsed and approximate remaining time
  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [config.id]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const remainingApprox = Math.max(config.estimatedMinutes - elapsedMinutes, 0);

  const goNext = useCallback(() => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((i) => i + 1);
    }
  }, [currentIdx, totalQuestions]);

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>
            {interpolate(resolve(dict as unknown as Record<string, unknown>, "assessment.progress.questionOf"), {
              current: String(currentIdx + 1),
              total: String(totalQuestions),
            })}
          </span>
          <span>
            {interpolate(resolve(dict as unknown as Record<string, unknown>, "assessment.progress.questionsCompleted"), {
              answered: String(answeredCount),
              total: String(totalQuestions),
            })}
          </span>
        </div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {lang === "ru"
              ? `Прошло ~${elapsedMinutes} мин`
              : `Elapsed ~${elapsedMinutes} min`}
          </span>
          <span>
            {lang === "ru"
              ? `Осталось ~${remainingApprox} мин`
              : `Remaining ~${remainingApprox} min`}
          </span>
        </div>
        <Progress value={answeredCount} max={totalQuestions} />
      </div>

      {/* Question rendering based on type */}
      {question.type === "disc_pair" && (
        <DISCPairQuestion
          question={question}
          answer={answers[question.id]}
          dict={dict}
          lang={lang}
          onAnswer={(val) => onAnswer(question.id, val)}
        />
      )}

      {question.type === "multiple_choice" && (
        <MultipleChoiceQuestion
          question={question}
          answer={answers[question.id]}
          dict={dict}
          onAnswer={(val) => {
            onAnswer(question.id, val);
            setTimeout(goNext, 300);
          }}
        />
      )}

      {question.type === "likert_scale" && (
        <LikertScaleQuestion
          question={question}
          answer={answers[question.id]}
          dict={dict}
          onAnswer={(val) => {
            onAnswer(question.id, val);
            setTimeout(goNext, 300);
          }}
        />
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div className="w-14" />

        <div className="flex items-center gap-2 overflow-x-auto px-2">
          {config.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => {
                if (i >= currentIdx) setCurrentIdx(i);
              }}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === currentIdx
                  ? "h-2.5 w-2.5 bg-zima-600"
                  : answers[q.id]
                  ? "bg-green-400"
                  : "bg-gray-300"
              )}
              aria-label={`Question ${i + 1}`}
            />
          ))}
        </div>

        {showCompleteButton ? (
          <Button onClick={onComplete}>
            {resolve(dict as unknown as Record<string, unknown>, "assessment.blockTransition.finishSection")}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={goNext}
            disabled={currentIdx === totalQuestions - 1}
          >
            {resolve(dict as unknown as Record<string, unknown>, "common.next")}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── DISC Pair Question ──────────────────────────────────────────────

function DISCPairQuestion({
  question,
  answer,
  dict,
  lang,
  onAnswer,
}: {
  question: AssessmentQuestion;
  answer?: AnswerValue;
  dict: ReturnType<typeof getDictionary>;
  lang: Lang;
  onAnswer: (val: AnswerValue) => void;
}) {
  const [currentAnswer, setCurrentAnswer] = useState<{ most: string; least: string }>(() =>
    answer?.type === "pair" ? { most: answer.most, least: answer.least } : { most: "", least: "" },
  );

  // Reset selection when question changes; restore when navigating back to an answered question
  useEffect(() => {
    if (answer?.type === "pair") {
      setCurrentAnswer({ most: answer.most, least: answer.least });
    } else {
      setCurrentAnswer({ most: "", least: "" });
    }
  }, [question.id, answer]);

  const handleSelect = (optionId: string, role: "most" | "least") => {
    const updated = { ...currentAnswer };
    if (role === "most") {
      updated.most = optionId === updated.most ? "" : optionId;
      if (updated.most === updated.least) updated.least = "";
    } else {
      updated.least = optionId === updated.least ? "" : optionId;
      if (updated.least === updated.most) updated.most = "";
    }

    setCurrentAnswer(updated);

    if (updated.most && updated.least) {
      onAnswer({ type: "pair", most: updated.most, least: updated.least });
    }
  };

  const questionText = resolve(
    dict as unknown as Record<string, unknown>,
    question.textKey
  );

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-500">
        {resolve(dict as unknown as Record<string, unknown>, "assessment.disc.description")}
      </p>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        {questionText}
      </h3>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const optText = resolve(
            dict as unknown as Record<string, unknown>,
            opt.textKey
          );
          const isMost = currentAnswer.most === opt.id;
          const isLeast = currentAnswer.least === opt.id;

          return (
            <div
              key={opt.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-4 transition-all",
                isMost
                  ? "border-green-400 bg-green-50"
                  : isLeast
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span className="flex-1 text-sm text-gray-800">{optText}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelect(opt.id, "most")}
                  className={cn(
                    "rounded-full border-2 px-2.5 py-1 text-xs font-medium transition-all",
                    isMost
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-400 hover:border-green-400 hover:text-green-600"
                  )}
                >
                  {lang === "ru" ? "Больше" : "Most"}
                </button>
                <button
                  onClick={() => handleSelect(opt.id, "least")}
                  className={cn(
                    "rounded-full border-2 px-2.5 py-1 text-xs font-medium transition-all",
                    isLeast
                      ? "border-red-400 bg-red-400 text-white"
                      : "border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-500"
                  )}
                >
                  {lang === "ru" ? "Меньше" : "Least"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Multiple Choice ─────────────────────────────────────────────────

function MultipleChoiceQuestion({
  question,
  answer,
  dict,
  onAnswer,
}: {
  question: AssessmentQuestion;
  answer?: AnswerValue;
  dict: ReturnType<typeof getDictionary>;
  onAnswer: (val: AnswerValue) => void;
}) {
  const selected = answer?.type === "single" ? answer.value : "";
  const questionText = resolve(
    dict as unknown as Record<string, unknown>,
    question.textKey
  );

  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        {questionText}
      </h3>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const optText = resolve(
            dict as unknown as Record<string, unknown>,
            opt.textKey
          );
          const isSelected = selected === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onAnswer({ type: "single", value: opt.id })}
              className={cn(
                "w-full rounded-lg border p-4 text-left text-sm transition-all",
                isSelected
                  ? "border-zima-500 bg-zima-50 text-zima-800"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span
                className={cn(
                  "mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                  isSelected
                    ? "border-zima-500 bg-zima-500 text-white"
                    : "border-gray-300 text-gray-400"
                )}
              >
                {opt.id.toUpperCase()}
              </span>
              {optText}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Likert Scale ────────────────────────────────────────────────────

function LikertScaleQuestion({
  question,
  answer,
  dict,
  onAnswer,
}: {
  question: AssessmentQuestion;
  answer?: AnswerValue;
  dict: ReturnType<typeof getDictionary>;
  onAnswer: (val: AnswerValue) => void;
}) {
  const selected = answer?.type === "scale" ? answer.value : null;
  const questionText = resolve(
    dict as unknown as Record<string, unknown>,
    question.textKey
  );

  return (
    <div>
      <h3 className="mb-8 text-lg font-semibold text-gray-900">
        {questionText}
      </h3>
      <div className="flex items-center justify-between gap-2">
        {question.options.map((opt) => {
          const isSelected = selected === opt.value;
          const label = resolve(
            dict as unknown as Record<string, unknown>,
            opt.textKey
          );

          return (
            <button
              key={opt.id}
              onClick={() =>
                onAnswer({ type: "scale", value: opt.value ?? 0 })
              }
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 transition-all",
                isSelected
                  ? "border-zima-500 bg-zima-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
                  isSelected
                    ? "bg-zima-600 text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {opt.value}
              </span>
              <span className="text-center text-xs text-gray-500">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
