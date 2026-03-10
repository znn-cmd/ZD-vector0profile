import { cn } from "@/lib/utils";

interface ScoreBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

function getBarColor(pct: number): string {
  if (pct >= 75) return "bg-green-500";
  if (pct >= 55) return "bg-blue-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function ScoreBar({ value, max = 100, label, showValue = true, size = "md", className }: ScoreBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span className={cn("shrink-0 text-gray-600", size === "sm" ? "w-28 text-xs" : "w-36 text-sm")}>
          {label}
        </span>
      )}
      <div className="flex-1">
        <div className={cn("w-full overflow-hidden rounded-full bg-gray-100", size === "sm" ? "h-1.5" : "h-2.5")}>
          <div
            className={cn("h-full rounded-full transition-all duration-500", getBarColor(pct))}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {showValue && (
        <span className={cn("shrink-0 font-semibold tabular-nums", size === "sm" ? "w-8 text-xs" : "w-10 text-sm")}>
          {Math.round(value)}
        </span>
      )}
    </div>
  );
}

interface ScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function getBadgeColors(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-700 ring-green-200";
  if (score >= 55) return "bg-blue-100 text-blue-700 ring-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-red-100 text-red-700 ring-red-200";
}

const badgeSizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };

export function ScoreBadge({ score, className, size = "md" }: ScoreBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold ring-1",
        badgeSizes[size],
        getBadgeColors(score),
        className,
      )}
    >
      {Math.round(score)}
    </div>
  );
}
