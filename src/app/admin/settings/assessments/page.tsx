"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  assessmentConfigs,
  defaultBlockOrder,
  totalEstimatedMinutes,
} from "@/config/assessments";
import { ClipboardList, Clock, Hash, Tag } from "lucide-react";

export default function AssessmentsSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Assessment Configurations
        </h1>
        <p className="text-sm text-gray-500">
          Block versions, question counts, and structure references
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs text-gray-400">Total Blocks</p>
          <p className="text-2xl font-bold text-gray-900">
            {defaultBlockOrder.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs text-gray-400">Total Questions</p>
          <p className="text-2xl font-bold text-gray-900">
            {Object.values(assessmentConfigs).reduce(
              (sum, c) => sum + c.questions.length,
              0
            )}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs text-gray-400">Est. Total Time</p>
          <p className="text-2xl font-bold text-gray-900">
            ~{totalEstimatedMinutes} min
          </p>
        </div>
      </div>

      {/* Block details */}
      <div className="space-y-4">
        {defaultBlockOrder.map((blockId, i) => {
          const config = assessmentConfigs[blockId];
          const questionTypes = new Set(
            config.questions.map((q) => q.type)
          );

          return (
            <Card key={blockId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zima-100 text-sm font-bold text-zima-700">
                      {i + 1}
                    </span>
                    <div>
                      <CardTitle className="text-base">
                        {config.titleKey}
                      </CardTitle>
                      <p className="text-xs text-gray-400">
                        Block ID: {config.id}
                      </p>
                    </div>
                  </div>
                  <Badge variant="neutral">v{config.version}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {config.questions.length} questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    ~{config.estimatedMinutes} minutes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="h-4 w-4 text-gray-400" />
                    {Array.from(questionTypes).join(", ")}
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-400">
                    Config Path
                  </p>
                  <code className="text-xs text-gray-600">
                    /src/config/assessments/
                    {blockId === "ritchie_martin"
                      ? "ritchieMartin"
                      : blockId}
                    .ts
                  </code>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
