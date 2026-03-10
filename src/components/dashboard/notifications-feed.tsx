"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Notification } from "@/types";
import { timeAgo } from "@/lib/utils";
import {
  PlayCircle,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";

const iconMap: Record<string, typeof PlayCircle> = {
  candidate_started: PlayCircle,
  candidate_completed: CheckCircle2,
  report_ready: FileText,
  error: AlertCircle,
};

const colorMap: Record<string, string> = {
  candidate_started: "text-yellow-500",
  candidate_completed: "text-green-500",
  report_ready: "text-zima-500",
  error: "text-red-500",
};

interface NotificationsFeedProps {
  notifications: Notification[];
}

export function NotificationsFeed({ notifications }: NotificationsFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Notifications</span>
          <span className="text-xs font-normal text-gray-400">
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No notifications yet
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = iconMap[n.type] ?? AlertCircle;
              const color = colorMap[n.type] ?? "text-gray-400";
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                    n.read ? "opacity-60" : "bg-gray-50"
                  }`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {n.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
