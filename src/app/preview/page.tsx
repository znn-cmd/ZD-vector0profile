"use client";

import { useState } from "react";
import type { AssessmentBlockId, Lang, AnswerValue } from "@/types";
import { assessmentConfigs, defaultBlockOrder } from "@/config/assessments";
import { getDictionary, resolve } from "@/config/i18n";
import { LanguageSwitcher } from "@/components/assessment/language-switcher";
import { ProgressIndicator } from "@/components/assessment/progress-indicator";
import { QuestionBlock } from "@/components/assessment/question-block";
import { CompletionScreen } from "@/components/assessment/completion-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PreviewPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeBlock, setActiveBlock] = useState<AssessmentBlockId | null>(null);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, AnswerValue>>({});
  const [showCompletion, setShowCompletion] = useState(false);

  const dict = getDictionary(lang);
  const r = (key: string) =>
    resolve(dict as unknown as Record<string, unknown>, key);

  const blockLabels: Record<AssessmentBlockId, string> = {
    disc: r("assessment.disc.title"),
    zima: r("assessment.zima.title"),
    ritchie_martin: r("assessment.ritchie.title"),
  };

  if (showCompletion) {
    return (
      <div>
        <div className="fixed left-4 top-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowCompletion(false);
              setActiveBlock(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Preview
          </Button>
        </div>
        <CompletionScreen candidateName="Preview User" lang={lang} />
      </div>
    );
  }

  if (activeBlock) {
    const config = assessmentConfigs[activeBlock];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveBlock(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Badge variant="warning">Preview Mode</Badge>
            </div>
            <LanguageSwitcher current={lang} onChange={setLang} />
          </div>
        </div>

        <div className="bg-white px-4 py-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900">
              {blockLabels[activeBlock]}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {r(`assessment.${activeBlock === "ritchie_martin" ? "ritchie" : activeBlock}.description`)}
            </p>
          </div>
        </div>

        <div className="p-6">
          <QuestionBlock
            config={config}
            answers={previewAnswers}
            lang={lang}
            onAnswer={(qId, val) =>
              setPreviewAnswers((prev) => ({ ...prev, [qId]: val }))
            }
            onComplete={() => setActiveBlock(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-zima-600" />
              <h1 className="text-lg font-semibold">Preview Mode</h1>
            </div>
            <Badge variant="warning">No data saved</Badge>
          </div>
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <p className="text-sm text-gray-500">
          Preview the assessment experience as a candidate would see it.
          No answers are saved in preview mode.
        </p>

        {/* Block cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {defaultBlockOrder.map((blockId) => {
            const cfg = assessmentConfigs[blockId];
            return (
              <Card
                key={blockId}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => {
                  setPreviewAnswers({});
                  setActiveBlock(blockId);
                }}
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    {blockLabels[blockId]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>{cfg.questions.length} questions</p>
                    <p>~{cfg.estimatedMinutes} min</p>
                    <p>v{cfg.version}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Preview Block
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion screen preview */}
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setShowCompletion(true)}
        >
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Preview Completion Screen
              </p>
              <p className="text-sm text-gray-500">
                See what candidates see after finishing all blocks
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
