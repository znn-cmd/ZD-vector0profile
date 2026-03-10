"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/data-table";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/dropdown";
import { Plus, MoreHorizontal, Loader2, UserCog, Shield, Send } from "lucide-react";
import type { HRUser } from "@/types";

const DEMO_USERS: HRUser[] = [
  { id: "hr_1", name: "Elena Sokolova", email: "elena@zimadubai.ae", role: "admin", telegramChatId: "123456" },
  { id: "hr_2", name: "Ahmed Al-Rashid", email: "ahmed@zimadubai.ae", role: "hr" },
  { id: "hr_3", name: "Maria Petrova", email: "maria@zimadubai.ae", role: "hr", telegramChatId: "789012" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<HRUser[]>(DEMO_USERS);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="min-h-full">
      <Header
        title="User Management"
        subtitle={`${users.length} team members`}
        actions={
          <Button size="sm" onClick={() => setShowNew(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add User
          </Button>
        }
      />

      <div className="p-6">
        <Card className="border-gray-100">
          <Table>
            <Thead>
              <Tr className="hover:bg-transparent">
                <Th>User</Th>
                <Th>Role</Th>
                <Th>Telegram</Th>
                <Th className="w-10" />
              </Tr>
            </Thead>
            <Tbody>
              {users.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={u.role === "admin" ? "default" : "neutral"}>
                      <span className="flex items-center gap-1">
                        {u.role === "admin" ? <Shield className="h-3 w-3" /> : <UserCog className="h-3 w-3" />}
                        {u.role === "admin" ? "Admin" : "HR Manager"}
                      </span>
                    </Badge>
                  </Td>
                  <Td>
                    {u.telegramChatId ? (
                      <Badge variant="success">Connected</Badge>
                    ) : (
                      <Badge variant="neutral">Not linked</Badge>
                    )}
                  </Td>
                  <Td>
                    <Dropdown
                      trigger={
                        <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => {}}>
                        <UserCog className="h-4 w-4" /> Edit
                      </DropdownItem>
                      {!u.telegramChatId && (
                        <DropdownItem onClick={() => {}}>
                          <Send className="h-4 w-4" /> Send Bot Link
                        </DropdownItem>
                      )}
                      <DropdownDivider />
                      <DropdownItem danger onClick={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}>
                        Deactivate
                      </DropdownItem>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>

      <AddUserModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onAdd={(user) => {
          setUsers((prev) => [...prev, { ...user, id: `hr_${Date.now()}` }]);
          setShowNew(false);
        }}
      />
    </div>
  );
}

function AddUserModal({ open, onClose, onAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (user: Omit<HRUser, "id">) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", role: "hr" as "hr" | "admin" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    onAdd(form);
    setForm({ name: "", email: "", role: "hr" });
    setSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Team Member" size="sm">
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <Input label="Full Name" required value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
          <Input label="Email" type="email" required value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@company.com" />
          <Select
            label="Role"
            options={[{ value: "hr", label: "HR Manager" }, { value: "admin", label: "Admin" }]}
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "hr" | "admin" }))}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>Add User</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
