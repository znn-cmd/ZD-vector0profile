"use client";

import { CheckCircle2, LogOut } from "lucide-react";
import type { Lang } from "@/types";
import { getDictionary, resolve } from "@/config/i18n";

interface CompletionScreenProps {
  candidateName: string;
  lang: Lang;
}

export function CompletionScreen({ candidateName, lang }: CompletionScreenProps) {
  const dict = getDictionary(lang);
  const r = (key: string) =>
    resolve(dict as unknown as Record<string, unknown>, key);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zima-50 to-white p-6">
      <div className="mx-auto max-w-lg animate-slide-up text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {r("assessment.completion.title")}
        </h1>

        <p className="mb-4 text-gray-600">
          {r("assessment.completion.message")}
        </p>

        <p className="mb-8 text-sm text-gray-500">
          {r("assessment.completion.nextSteps")}
        </p>

        <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500">
          <LogOut className="h-4 w-4" />
          {r("assessment.completion.closeWindow")}
        </div>
      </div>
    </div>
  );
}
