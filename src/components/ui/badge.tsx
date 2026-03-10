import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-zima-100 text-zima-800": variant === "default",
          "bg-green-100 text-green-800": variant === "success",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          "bg-red-100 text-red-800": variant === "danger",
          "bg-blue-100 text-blue-800": variant === "info",
          "bg-gray-100 text-gray-700": variant === "neutral",
        },
        className
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    invited: { label: "Invited", variant: "info" },
    in_progress: { label: "In Progress", variant: "warning" },
    completed: { label: "Completed", variant: "success" },
    report_generated: { label: "Report Ready", variant: "default" },
    report_sent: { label: "Report Sent", variant: "neutral" },
  };

  const item = map[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
