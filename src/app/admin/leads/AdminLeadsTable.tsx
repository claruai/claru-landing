"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Lead, LeadStatus } from "@/types/data-catalog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SortKey = "name" | "email" | "company" | "status" | "created_at";
type SortDirection = "asc" | "desc";
type FilterTab = "all" | LeadStatus;

interface AdminLeadsTableProps {
  leads: Lead[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Format an ISO date string as YYYY-MM-DD. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

/** Status badge color mapping. */
function statusBadge(status: LeadStatus) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
          Approved
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
          Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20">
          Rejected
        </span>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Interactive admin table for viewing and filtering access-request leads.
 *
 * Features:
 * - Status filter tabs (All / Pending / Approved / Rejected) with counts
 * - Search filtering by name, email, or company
 * - Column sorting with visual indicators
 * - Summary stats bar
 * - Row links to /admin/leads/[id] detail pages
 */
export default function AdminLeadsTable({ leads }: AdminLeadsTableProps) {
  /* ----- state ---------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  /* ----- counts --------------------------------------------------- */
  const counts = useMemo(() => {
    const map = { all: leads.length, pending: 0, approved: 0, rejected: 0 };
    for (const lead of leads) {
      map[lead.status]++;
    }
    return map;
  }, [leads]);

  /* ----- derived: filter by tab ----------------------------------- */
  const tabFiltered = useMemo(() => {
    if (activeTab === "all") return leads;
    return leads.filter((l) => l.status === activeTab);
  }, [leads, activeTab]);

  /* ----- derived: filter by search -------------------------------- */
  const searchFiltered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q)
    );
  }, [tabFiltered, search]);

  /* ----- derived: sort -------------------------------------------- */
  const sorted = useMemo(() => {
    const copy = [...searchFiltered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "email":
          cmp = a.email.localeCompare(b.email);
          break;
        case "company":
          cmp = a.company.localeCompare(b.company);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "created_at":
          cmp =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [searchFiltered, sortKey, sortDir]);

  /* ----- handlers ------------------------------------------------- */
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  /* ----- sort arrow indicator ------------------------------------- */
  const arrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return (
      <span className="ml-1 text-[var(--accent-primary)]">
        {sortDir === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  };

  /* ----- column header helper ------------------------------------- */
  const th = (label: string, key: SortKey, extraClass?: string) => (
    <th
      key={key}
      className={`px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] cursor-pointer select-none hover:text-[var(--text-secondary)] transition-colors duration-150 ${extraClass ?? ""}`}
      onClick={() => handleSort(key)}
    >
      {label}
      {arrow(key)}
    </th>
  );

  /* ----- tab button helper ---------------------------------------- */
  const tabButton = (tab: FilterTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors duration-150 ${
          isActive
            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent"
        }`}
      >
        {label}{" "}
        <span
          className={
            isActive
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-muted)]"
          }
        >
          ({counts[tab]})
        </span>
      </button>
    );
  };

  /* ----- render --------------------------------------------------- */
  return (
    <div className="px-6 py-6 space-y-5">
      {/* Summary stats */}
      <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Total
          </span>
          <p className="text-lg text-[var(--text-primary)] font-semibold">
            {counts.all}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Pending
          </span>
          <p className="text-lg text-[var(--warning)] font-semibold">
            {counts.pending}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Approved
          </span>
          <p className="text-lg text-[var(--accent-primary)] font-semibold">
            {counts.approved}
          </p>
        </div>
        <div className="font-mono text-sm">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">
            Rejected
          </span>
          <p className="text-lg text-[var(--error)] font-semibold">
            {counts.rejected}
          </p>
        </div>
      </div>

      {/* Filter tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabButton("all", "All")}
          {tabButton("pending", "Pending")}
          {tabButton("approved", "Approved")}
          {tabButton("rejected", "Rejected")}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search leads..."
            className="w-full pl-7 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-mono text-[var(--text-muted)]">
        showing{" "}
        <span className="text-[var(--text-secondary)]">{sorted.length}</span>{" "}
        {sorted.length === 1 ? "lead" : "leads"}
        {search.trim() && (
          <>
            {" "}
            matching &ldquo;
            <span className="text-[var(--accent-primary)]">{search}</span>
            &rdquo;
          </>
        )}
      </p>

      {/* Table wrapper -- horizontal scroll on mobile */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
        <table className="w-full min-w-[860px] font-mono text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <tr>
              {th("Name", "name")}
              {th("Email", "email")}
              {th("Company", "company")}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Use Case
              </th>
              {th("Status", "status")}
              {th("Date", "created_at")}
              <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  {search.trim()
                    ? "no leads matching query"
                    : "no leads found"}
                </td>
              </tr>
            ) : (
              sorted.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-[var(--bg-secondary)] transition-colors duration-150"
                >
                  {/* Name */}
                  <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                    {lead.name}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {lead.email}
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {lead.company}
                  </td>

                  {/* Use Case (truncated) */}
                  <td className="px-4 py-3 text-[var(--text-muted)] max-w-[200px] truncate">
                    {lead.use_case || "\u2014"}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">{statusBadge(lead.status)}</td>

                  {/* Date */}
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {formatDate(lead.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors duration-150"
                    >
                      [view]
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
