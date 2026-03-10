"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Plug,
  Bot,
  FileText,
  Bell,
  Languages,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    href: "/admin/settings/google",
    title: "Google Integrations",
    description: "Google Sheets & Drive connection health",
    icon: Plug,
    status: process.env.NEXT_PUBLIC_APP_MODE === "live" ? "configured" : "mock mode",
  },
  {
    href: "/admin/settings/telegram",
    title: "Telegram Bot",
    description: "Notification bot status and webhook",
    icon: Bot,
    status: "check status",
  },
  {
    href: "/admin/settings/reports",
    title: "Report Templates",
    description: "Manage PDF report structure and versions",
    icon: FileText,
    status: "2 templates",
  },
  {
    href: "/admin/settings/notifications",
    title: "Notification Templates",
    description: "Edit notification message templates",
    icon: Bell,
    status: "4 templates",
  },
  {
    href: "/admin/settings/languages",
    title: "Language Dictionaries",
    description: "Manage EN/RU translations and coverage",
    icon: Languages,
    status: "2 languages",
  },
  {
    href: "/admin/settings/assessments",
    title: "Assessment Configs",
    description: "View assessment block versions and structure",
    icon: ClipboardList,
    status: "3 blocks",
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          System configuration and integration management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zima-50">
                    <s.icon className="h-5 w-5 text-zima-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="neutral">{s.status}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
