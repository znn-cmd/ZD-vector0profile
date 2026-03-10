"use client";

import type { Lang } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  current: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageSwitcher({ current, onChange }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
      {(["en", "ru"] as Lang[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium uppercase transition-colors",
            current === lang
              ? "bg-zima-600 text-white"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
