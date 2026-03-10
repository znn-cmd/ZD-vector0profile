"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function Header({ title, subtitle, actions, showSearch, searchPlaceholder, onSearch }: HeaderProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder ?? "Search..."}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-zima-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zima-500/20"
            />
          </div>
        )}
        {actions}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
