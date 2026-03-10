"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { NotificationTemplate, Lang } from "@/types";

const defaultTemplates: NotificationTemplate[] = [
  {
    id: "tpl_1",
    type: "candidate_started",
    lang: "en",
    subject: "Assessment Started",
    body: "🟡 <b>Assessment Started</b>\nCandidate: {candidateName}\nPosition: {position}",
    channel: "telegram",
  },
  {
    id: "tpl_2",
    type: "candidate_completed",
    lang: "en",
    subject: "Assessment Completed",
    body: "🟢 <b>Assessment Completed</b>\nCandidate: {candidateName}\nPosition: {position}",
    channel: "telegram",
  },
  {
    id: "tpl_3",
    type: "report_ready",
    lang: "en",
    subject: "Report Ready",
    body: '📄 <b>Report Ready</b>\nCandidate: {candidateName}\n<a href="{reportUrl}">View Report</a>',
    channel: "telegram",
  },
  {
    id: "tpl_4",
    type: "candidate_started",
    lang: "ru",
    subject: "Оценка начата",
    body: "🟡 <b>Оценка начата</b>\nКандидат: {candidateName}\nДолжность: {position}",
    channel: "telegram",
  },
];

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editing, setEditing] = useState<string | null>(null);

  const handleSave = (id: string, updates: Partial<NotificationTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    setEditing(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Notification Templates
        </h1>
        <p className="text-sm text-gray-500">
          Edit templates for Telegram notifications
        </p>
      </div>

      <div className="space-y-4">
        {templates.map((tpl) => (
          <Card key={tpl.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    {tpl.type.replace(/_/g, " ")}
                  </CardTitle>
                  <Badge variant="neutral">{tpl.lang.toUpperCase()}</Badge>
                  <Badge variant="info">{tpl.channel}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditing(editing === tpl.id ? null : tpl.id)
                  }
                >
                  {editing === tpl.id ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editing === tpl.id ? (
                <TemplateEditor
                  template={tpl}
                  onSave={(updates) => handleSave(tpl.id, updates)}
                />
              ) : (
                <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  {tpl.body}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TemplateEditor({
  template,
  onSave,
}: {
  template: NotificationTemplate;
  onSave: (updates: Partial<NotificationTemplate>) => void;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  return (
    <div className="space-y-3">
      <Input
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Textarea
        label="Body (HTML supported)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[100px] font-mono text-xs"
      />
      <p className="text-xs text-gray-400">
        Available variables: {"{candidateName}"}, {"{position}"},{" "}
        {"{reportUrl}"}
      </p>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => onSave({ subject, body })}>
          Save Template
        </Button>
      </div>
    </div>
  );
}
