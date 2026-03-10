"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Download, RefreshCw, Clock, CheckCircle2, XCircle, Info } from "lucide-react";

interface ReportEntry {
  id: string;
  candidateName: string;
  version: string;
  status: "ready" | "generating" | "failed";
  generatedAt: string;
  templateVersion: string;
  driveUrl?: string;
}

const DEMO_REPORTS: ReportEntry[] = [
  { id: "rpt_1", candidateName: "Alexei Ivanov", version: "V1", status: "ready", generatedAt: "2026-03-10T10:00:00Z", templateVersion: "2026.03.1", driveUrl: "#" },
  { id: "rpt_2", candidateName: "Sarah Ahmed", version: "V1", status: "ready", generatedAt: "2026-03-09T14:30:00Z", templateVersion: "2026.03.1", driveUrl: "#" },
  { id: "rpt_3", candidateName: "Ivan Petrov", version: "V2", status: "generating", generatedAt: "", templateVersion: "2026.03.1" },
];

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  ready: CheckCircle2,
  generating: RefreshCw,
  failed: XCircle,
};

const STATUS_COLOR: Record<string, string> = {
  ready: "text-green-500",
  generating: "text-amber-500",
  failed: "text-red-500",
};

export default function ReportsPage() {
  const [reports] = useState<ReportEntry[]>(DEMO_REPORTS);

  return (
    <div className="min-h-full">
      <Header title="Reports" subtitle="Generated assessment reports" />

      <div className="space-y-6 p-6">
        {/* Template info card */}
        <Card className="border-gray-100 bg-zima-50/50">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-zima-500" />
            <div>
              <p className="text-sm font-medium text-zima-900">Report Template: Personal Vector Profile</p>
              <p className="mt-0.5 text-xs text-zima-600">
                Version 2026.03.1 — Engine v1.0.0 — Reports are immutable; re-generating creates a new version (V2, V3…).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reports table */}
        <Card className="border-gray-100">
          <Table>
            <Thead>
              <Tr className="hover:bg-transparent">
                <Th>Candidate</Th>
                <Th>Version</Th>
                <Th>Status</Th>
                <Th>Template</Th>
                <Th>Generated</Th>
                <Th className="w-10" />
              </Tr>
            </Thead>
            <Tbody>
              {reports.map((r) => {
                const Icon = STATUS_ICON[r.status] ?? FileText;
                const color = STATUS_COLOR[r.status] ?? "text-gray-400";
                return (
                  <Tr key={r.id}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-300" />
                        <span className="text-sm font-medium text-gray-900">{r.candidateName}</span>
                      </div>
                    </Td>
                    <Td>
                      <Badge variant="neutral">{r.version}</Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <Icon className={`h-3.5 w-3.5 ${color} ${r.status === "generating" ? "animate-spin" : ""}`} />
                        <span className="text-xs capitalize text-gray-600">{r.status}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-xs text-gray-500">{r.templateVersion}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-gray-500">
                        {r.generatedAt ? new Date(r.generatedAt).toLocaleDateString() : "—"}
                      </span>
                    </Td>
                    <Td>
                      {r.status === "ready" && r.driveUrl && (
                        <a
                          href={r.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {r.status === "failed" && (
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
