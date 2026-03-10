"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Bot, Send } from "lucide-react";

export default function TelegramSettingsPage() {
  const [botStatus, setBotStatus] = useState<{
    ok: boolean;
    botName?: string;
    message: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [testChatId, setTestChatId] = useState("");
  const [testMessage, setTestMessage] = useState("Hello from ZIMA Dubai Vector Profile!");
  const [sendResult, setSendResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [sending, setSending] = useState(false);

  const checkBot = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/webhook/telegram");
      const data = await res.json();
      setBotStatus(data);
    } catch {
      setBotStatus({ ok: false, message: "Failed to check bot status" });
    } finally {
      setChecking(false);
    }
  };

  const sendTest = async () => {
    if (!testChatId) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/webhook/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: testChatId, text: testMessage }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch {
      setSendResult({ ok: false, message: "Failed to send test message" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Telegram Bot</h1>
        <p className="text-sm text-gray-500">
          Bot health status and test messaging
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bot Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Bot Status</CardTitle>
                <p className="text-xs text-gray-400">
                  Check if the Telegram bot is responding
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {botStatus && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  botStatus.ok
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {botStatus.ok ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <div>
                  <p>{botStatus.message}</p>
                  {botStatus.botName && (
                    <p className="text-xs opacity-70">
                      @{botStatus.botName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              onClick={checkBot}
              disabled={checking}
              className="w-full"
            >
              {checking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Check Bot Health"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Message */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Send Test Message</CardTitle>
                <p className="text-xs text-gray-400">
                  Verify message delivery
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Chat ID"
              value={testChatId}
              onChange={(e) => setTestChatId(e.target.value)}
              placeholder="-1001234567890"
            />
            <Input
              label="Message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
            />

            {sendResult && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  sendResult.ok
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {sendResult.ok ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {sendResult.message}
              </div>
            )}

            <Button
              variant="outline"
              onClick={sendTest}
              disabled={sending || !testChatId}
              className="w-full"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Test Message"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
