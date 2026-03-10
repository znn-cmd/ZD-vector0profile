"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { formatDate, generateInviteUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { ScoreBadge } from "@/components/ui/score-bar";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, Thead, Tbody, Tr, Th, Td, SortableTh, Pagination } from "@/components/ui/data-table";
import {
  Search, Copy, FileText, ExternalLink, MoreHorizontal, Archive,
  Send, Users, Filter, X, CheckSquare, Eye,
} from "lucide-react";
import type { Candidate, CandidateStatus, Lang } from "@/types";

interface CandidatesTableProps {
  candidates: Candidate[];
  hrUsers?: { id: string; name: string }[];
  onGenerateReport?: (candidateId: string) => void;
  onArchive?: (candidateId: string) => void;
  onResendInvite?: (candidateId: string) => void;
  onViewDetail?: (candidateId: string) => void;
  onCompare?: (candidateIds: string[]) => void;
}

type SortField = "name" | "status" | "date" | "score";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "invited", label: "Invited" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "report_generated", label: "Report Ready" },
  { value: "report_sent", label: "Report Sent" },
];

const PER_PAGE = 15;

export function CandidatesTable({
  candidates,
  hrUsers = [],
  onGenerateReport,
  onArchive,
  onResendInvite,
  onViewDetail,
  onCompare,
}: CandidatesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hrFilter, setHrFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }, [sortField]);

  const filtered = useMemo(() => {
    let result = [...candidates];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.position.toLowerCase().includes(q),
      );
    }
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (hrFilter) {
      result = result.filter((c) => c.hrId === hrFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.fullName.localeCompare(b.fullName); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "date": cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
        default: cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [candidates, search, statusFilter, hrFilter, sortField, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((c) => c.id)));
    }
  };

  const copyInviteLink = async (token: string, id: string) => {
    await navigator.clipboard.writeText(generateInviteUrl(token));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hrOptions = [
    { value: "", label: "All HR" },
    ...hrUsers.map((h) => ({ value: h.id, label: h.name })),
  ];

  const activeFilters = [statusFilter, hrFilter].filter(Boolean).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-zima-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zima-500/20"
          />
        </div>

        {/* Filter toggle */}
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1.5"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {activeFilters > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zima-600 text-[10px] text-white">
              {activeFilters}
            </span>
          )}
        </Button>

        {/* Compare action */}
        {selected.size >= 2 && selected.size <= 5 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCompare?.(Array.from(selected))}
            className="gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            Compare ({selected.size})
          </Button>
        )}

        <span className="text-xs text-gray-400">
          {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-2.5">
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-8 w-40 text-xs"
          />
          {hrUsers.length > 0 && (
            <Select
              options={hrOptions}
              value={hrFilter}
              onChange={(e) => { setHrFilter(e.target.value); setPage(1); }}
              className="h-8 w-40 text-xs"
            />
          )}
          {activeFilters > 0 && (
            <button
              onClick={() => { setStatusFilter(""); setHrFilter(""); setPage(1); }}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description={search || activeFilters > 0 ? "Try adjusting your search or filters" : "Create your first candidate to get started"}
        />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr className="hover:bg-transparent">
                <Th className="w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-zima-600"
                  />
                </Th>
                <SortableTh sorted={sortField === "name" ? sortDir : null} onSort={() => toggleSort("name")}>
                  Candidate
                </SortableTh>
                <Th>Position</Th>
                <SortableTh sorted={sortField === "status" ? sortDir : null} onSort={() => toggleSort("status")}>
                  Status
                </SortableTh>
                <Th>Language</Th>
                <SortableTh sorted={sortField === "date" ? sortDir : null} onSort={() => toggleSort("date")}>
                  Created
                </SortableTh>
                <Th className="w-10" />
              </Tr>
            </Thead>
            <Tbody>
              {paginated.map((c) => (
                <Tr
                  key={c.id}
                  className={cn(
                    "cursor-pointer",
                    selected.has(c.id) && "bg-zima-50/50",
                  )}
                  onClick={() => onViewDetail?.(c.id)}
                >
                  <Td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-zima-600"
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{c.fullName}</p>
                        <p className="truncate text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm text-gray-600">{c.position}</span>
                  </Td>
                  <Td>
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      {c.lang}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                  </Td>
                  <Td onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => onViewDetail?.(c.id)}>
                        <Eye className="h-4 w-4" /> View Detail
                      </DropdownItem>
                      <DropdownItem onClick={() => copyInviteLink(c.inviteToken, c.id)}>
                        <Copy className="h-4 w-4" />
                        {copiedId === c.id ? "Copied!" : "Copy Invite Link"}
                      </DropdownItem>
                      {c.status === "invited" && (
                        <DropdownItem onClick={() => onResendInvite?.(c.id)}>
                          <Send className="h-4 w-4" /> Resend Invite
                        </DropdownItem>
                      )}
                      {(c.status === "completed" || c.status === "report_generated") && (
                        <DropdownItem onClick={() => onGenerateReport?.(c.id)}>
                          <FileText className="h-4 w-4" /> Generate Report
                        </DropdownItem>
                      )}
                      <DropdownDivider />
                      <DropdownItem danger onClick={() => onArchive?.(c.id)}>
                        <Archive className="h-4 w-4" /> Archive
                      </DropdownItem>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
