"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Database, HardDrive } from "lucide-react";

interface HealthStatus {
  ok: boolean;
  message: string;
}

export default function GoogleSettingsPage() {
  const [sheetsStatus, setSheetsStatus] = useState<HealthStatus | null>(null);
  const [driveStatus, setDriveStatus] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState<"sheets" | "drive" | null>(null);

  const isMock = process.env.NEXT_PUBLIC_APP_MODE !== "live";

  const checkSheets = async () => {
    setChecking("sheets");
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setSheetsStatus({
        ok: res.ok,
        message: res.ok
          ? `Connected — ${data.candidates?.length ?? 0} candidates found`
          : "Connection failed",
      });
    } catch (err) {
      setSheetsStatus({
        ok: false,
        message: err instanceof Error ? err.message : "Connection failed",
      });
    } finally {
      setChecking(null);
    }
  };

  const checkDrive = async () => {
    setChecking("drive");
    // In mock mode we simulate
    await new Promise((r) => setTimeout(r, 1000));
    setDriveStatus(
      isMock
        ? { ok: true, message: "Mock mode — Drive not connected" }
        : { ok: false, message: "GOOGLE_DRIVE_FOLDER_ID not configured" }
    );
    setChecking(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Google Integrations
        </h1>
        <p className="text-sm text-gray-500">
          Connection health for Google Sheets and Google Drive
        </p>
      </div>

      {isMock && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Running in <strong>mock mode</strong> — set{" "}
          <code className="rounded bg-yellow-100 px-1">
            NEXT_PUBLIC_APP_MODE=live
          </code>{" "}
          to connect to real Google services.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sheets */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Google Sheets</CardTitle>
                <p className="text-xs text-gray-400">
                  Primary data storage
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <p className="text-gray-500">
                Spreadsheet ID:{" "}
                <code className="text-gray-700">
                  {process.env.GOOGLE_SPREADSHEET_ID ?? "not set"}
                </code>
              </p>
            </div>

            {sheetsStatus && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  sheetsStatus.ok
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {sheetsStatus.ok ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {sheetsStatus.message}
              </div>
            )}

            <Button
              variant="outline"
              onClick={checkSheets}
              disabled={checking === "sheets"}
              className="w-full"
            >
              {checking === "sheets" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Test Connection"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Drive */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <HardDrive className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Google Drive</CardTitle>
                <p className="text-xs text-gray-400">
                  PDF report storage
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <p className="text-gray-500">
                Folder ID:{" "}
                <code className="text-gray-700">
                  {process.env.GOOGLE_DRIVE_FOLDER_ID ?? "not set"}
                </code>
              </p>
            </div>

            {driveStatus && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  driveStatus.ok
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {driveStatus.ok ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {driveStatus.message}
              </div>
            )}

            <Button
              variant="outline"
              onClick={checkDrive}
              disabled={checking === "drive"}
              className="w-full"
            >
              {checking === "drive" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Test Connection"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
