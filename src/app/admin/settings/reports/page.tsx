"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reportTemplates } from "@/config/reports/reportTemplates";
import { FileText, CheckCircle2 } from "lucide-react";

export default function ReportsSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Report Templates
        </h1>
        <p className="text-sm text-gray-500">
          Manage PDF report structure, versions, and active template
        </p>
      </div>

      <div className="space-y-4">
        {reportTemplates.map((template) => (
          <Card
            key={template.id}
            className={
              template.isActive ? "border-zima-200 bg-zima-50/30" : ""
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-zima-600" />
                  <div>
                    <CardTitle className="text-base">
                      {template.name}
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      Version {template.version} · {template.sections.length}{" "}
                      sections
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {template.isActive ? (
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Set Active
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Sections
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <span
                        key={section.id}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {section.order}. {section.type.replace(/_/g, " ")}
                      </span>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
