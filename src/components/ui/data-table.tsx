"use client";

import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";

// ─── Table primitives ────────────────────────────────────────────────

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

export function Thead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-gray-200 bg-gray-50/50", className)} {...props} />;
}

export function Tbody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-gray-100", className)} {...props} />;
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-gray-50/50", className)} {...props} />;
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 text-gray-700", className)} {...props} />;
}

// ─── Sortable header ─────────────────────────────────────────────────

interface SortableThProps {
  children: ReactNode;
  sorted?: "asc" | "desc" | null;
  onSort?: () => void;
  className?: string;
}

export function SortableTh({ children, sorted, onSort, className }: SortableThProps) {
  return (
    <th
      className={cn(
        "cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700",
        className,
      )}
      onClick={onSort}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sorted === "asc" ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : sorted === "desc" ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </span>
    </th>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between border-t border-gray-100 px-4 py-3", className)}>
      <span className="text-xs text-gray-500">
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
