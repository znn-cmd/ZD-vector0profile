"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { en } from "@/config/i18n/en";
import { ru } from "@/config/i18n/ru";
import type { Lang } from "@/types";
import { Globe, ChevronDown, ChevronRight } from "lucide-react";

function countKeys(obj: unknown, prefix = ""): string[] {
  const keys: string[] = [];
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "object" && v !== null) {
        keys.push(...countKeys(v, path));
      } else {
        keys.push(path);
      }
    }
  }
  return keys;
}

function resolveKey(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else return undefined;
  }
  return typeof current === "string" ? current : undefined;
}

const dicts: Record<Lang, unknown> = { en, ru };

export default function LanguagesPage() {
  const enKeys = countKeys(en);
  const ruKeys = countKeys(ru);
  const [expandedLang, setExpandedLang] = useState<Lang | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const topLevelSections = Object.keys(en);
  const ruCoverage = Math.round(
    (ruKeys.length / enKeys.length) * 100
  );

  const languages: { code: Lang; name: string; keys: string[] }[] = [
    { code: "en", name: "English", keys: enKeys },
    { code: "ru", name: "Russian (Русский)", keys: ruKeys },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Language Dictionaries
        </h1>
        <p className="text-sm text-gray-500">
          Translation coverage and key browser
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {languages.map((lang) => (
          <Card key={lang.code}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zima-50">
                <Globe className="h-6 w-6 text-zima-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{lang.name}</p>
                <p className="text-sm text-gray-500">
                  {lang.keys.length} keys
                </p>
                <Progress
                  value={lang.keys.length}
                  max={enKeys.length}
                  className="mt-1"
                />
              </div>
              <Badge variant={lang.code === "en" ? "success" : "info"}>
                {lang.code === "en"
                  ? "100%"
                  : `${ruCoverage}%`}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key browser */}
      <Card>
        <CardHeader>
          <CardTitle>Dictionary Browser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topLevelSections.map((section) => {
              const sectionKeys = enKeys.filter((k) =>
                k.startsWith(section + ".")
              );
              const isExpanded = expandedSection === section;

              return (
                <div key={section}>
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-700">
                        {section}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {sectionKeys.length} keys
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="ml-6 space-y-1 border-l border-gray-100 pl-4">
                      {sectionKeys.slice(0, 20).map((key) => (
                        <div
                          key={key}
                          className="flex items-start gap-4 rounded px-2 py-1 text-xs"
                        >
                          <span className="w-1/3 shrink-0 font-mono text-gray-400">
                            {key}
                          </span>
                          <span className="text-gray-600">
                            {resolveKey(en, key) ?? "—"}
                          </span>
                        </div>
                      ))}
                      {sectionKeys.length > 20 && (
                        <p className="px-2 text-xs text-gray-400">
                          ... and {sectionKeys.length - 20} more keys
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
