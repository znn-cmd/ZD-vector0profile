import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
}: ProgressProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            "h-full rounded-full bg-zima-500 transition-all duration-500 ease-out",
            barClassName
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-right text-xs text-gray-500">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
