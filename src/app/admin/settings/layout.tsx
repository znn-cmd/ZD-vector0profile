"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

type AuthUser = { id: string; email: string; name: string; role: "admin" | "hr" };

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
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => {
        if (data?.id) {
          if (data.role !== "admin") router.replace("/dashboard");
          else setUser(data);
        } else router.replace("/");
      })
      .catch(() => router.replace("/"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zima-600 border-t-transparent" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.role} userName={user.name} />
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
