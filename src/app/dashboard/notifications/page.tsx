"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { timeAgo } from "@/lib/utils";
import {
  Bell, BellOff, CheckCircle2, PlayCircle, FileText,
  AlertCircle, Loader2, MailCheck, Users, Clock,
} from "lucide-react";
import type { Notification } from "@/types";

const ICON_MAP: Record<string, typeof Bell> = {
  candidate_started: PlayCircle,
  candidate_completed: CheckCircle2,
  report_ready: FileText,
  error: AlertCircle,
};

const COLOR_MAP: Record<string, string> = {
  candidate_started: "text-amber-500",
  candidate_completed: "text-green-500",
  report_ready: "text-zima-500",
  error: "text-red-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_all_read" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zima-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header
        title="Notifications"
        subtitle={`${unreadCount} unread`}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <MailCheck className="h-3.5 w-3.5" /> Mark All Read
            </Button>
          ) : undefined
        }
      />

      <div className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <NotificationList notifications={notifications} />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList notifications={notifications.filter((n) => !n.read)} />
          </TabsContent>
        </Tabs>

        {/* Daily Digest Preview */}
        <Card className="mt-6 border-gray-100">
          <CardContent className="py-6 text-center">
            <Clock className="mx-auto mb-2 h-6 w-6 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">Daily Digest</p>
            <p className="text-xs text-gray-400">
              Your personal daily digest is delivered to your Telegram at 09:00 each morning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <EmptyState icon={BellOff} title="No notifications" description="You're all caught up." />;
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => {
        const Icon = ICON_MAP[n.type] ?? Bell;
        const color = COLOR_MAP[n.type] ?? "text-gray-400";

        return (
          <Card key={n.id} className={`border-gray-100 p-3 transition-colors ${n.read ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-zima-500" />}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
              </div>
              <span className="shrink-0 text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
