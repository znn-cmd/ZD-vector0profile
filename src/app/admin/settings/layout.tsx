"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import {
  Plug,
  Bot,
  FileText,
  Bell,
  Languages,
  ClipboardList,
} from "lucide-react";

const settingsNav = [
  { href: "/admin/settings", label: "Overview", icon: Plug, exact: true },
  { href: "/admin/settings/google", label: "Google Integrations", icon: Plug },
  { href: "/admin/settings/telegram", label: "Telegram Bot", icon: Bot },
  { href: "/admin/settings/reports", label: "Report Templates", icon: FileText },
  {
    href: "/admin/settings/notifications",
    label: "Notification Templates",
    icon: Bell,
  },
  { href: "/admin/settings/languages", label: "Language Dictionaries", icon: Languages },
  {
    href: "/admin/settings/assessments",
    label: "Assessment Configs",
    icon: ClipboardList,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" userName="Admin User" />
      <div className="flex flex-1 overflow-hidden">
        {/* Settings sub-nav */}
        <nav className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Settings
          </h2>
          <div className="space-y-1">
            {settingsNav.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && !item.exact;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-white font-medium text-zima-700 shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Settings content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
