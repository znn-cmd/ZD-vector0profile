"use client";

import type { AssessmentBlockId } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface ProgressIndicatorProps {
  blocks: AssessmentBlockId[];
  currentBlock: AssessmentBlockId;
  blockStatuses: Record<AssessmentBlockId, "not_started" | "in_progress" | "completed">;
  blockLabels: Record<AssessmentBlockId, string>;
}

export function ProgressIndicator({
  blocks,
  currentBlock,
  blockStatuses,
  blockLabels,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {blocks.map((blockId, i) => {
        const status = blockStatuses[blockId];
        const isCurrent = blockId === currentBlock;

        return (
          <div key={blockId} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  status === "completed" && "bg-green-500 text-white",
                  status === "in_progress" && "bg-zima-600 text-white",
                  status === "not_started" && "bg-gray-200 text-gray-400"
                )}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : status === "in_progress" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-zima-700" : "text-gray-500"
                )}
              >
                {blockLabels[blockId]}
              </span>
            </div>

            {i < blocks.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 rounded-full",
                  status === "completed" ? "bg-green-400" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
