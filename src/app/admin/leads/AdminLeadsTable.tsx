"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Loader2, AlertCircle } from "lucide-react";
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

interface CreateLeadForm {
  name: string;
  email: string;
  company: string;
  role: string;
  data_needs: string;
  use_case: string;
  admin_notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const EMPTY_FORM: CreateLeadForm = {
  name: "",
  email: "",
  company: "",
  role: "",
  data_needs: "",
  use_case: "",
  admin_notes: "",
};

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

/** Validate email format. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ------------------------------------------------------------------ */
/*  CreateLeadPanel                                                    */
/* ------------------------------------------------------------------ */

function CreateLeadPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<CreateLeadForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* Escape key to dismiss */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Field change handler */
  const handleChange = useCallback(
    (field: keyof CreateLeadForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      if (field === "name" || field === "email") {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      setSubmitError(null);
    },
    []
  );

  /* Client-side validation */
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.name, form.email]);

  /* Submit handler */
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          role: form.role.trim() || undefined,
          data_needs: form.data_needs.trim() || undefined,
          use_case: form.use_case.trim() || undefined,
          admin_notes: form.admin_notes.trim() || undefined,
        }),
      });

      if (res.status === 201) {
        onClose();
        alert("Lead created successfully");
        router.refresh();
        return;
      }

      if (res.status === 409) {
        setSubmitError("A lead with this email already exists");
        return;
      }

      const data = await res.json().catch(() => null);
      setSubmitError(data?.error ?? `Failed to create lead (${res.status})`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create lead"
      );
    } finally {
      setSubmitting(false);
    }
  }, [form, validate, onClose, router]);

  /* Shared input styles */
  const inputBase =
    "w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[400px] bg-[var(--bg-primary)] border-l border-[var(--accent-primary)]/30 shadow-2xl flex flex-col animate-[slideInRight_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            New Lead
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Name (required) */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Name <span className="text-[var(--accent-primary)]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Jane Doe"
              className={`${inputBase} ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs font-mono text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email (required) */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Email <span className="text-[var(--accent-primary)]">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="jane@company.com"
              className={`${inputBase} ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs font-mono text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Company
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Acme Corp"
              className={inputBase}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Role
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="ML Engineer"
              className={inputBase}
            />
          </div>

          {/* Data Needs */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Data Needs
            </label>
            <textarea
              value={form.data_needs}
              onChange={(e) => handleChange("data_needs", e.target.value)}
              placeholder="What data is needed..."
              rows={3}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Use Case */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Use Case
            </label>
            <textarea
              value={form.use_case}
              onChange={(e) => handleChange("use_case", e.target.value)}
              placeholder="Describe the use case..."
              rows={3}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Admin Notes
            </label>
            <textarea
              value={form.admin_notes}
              onChange={(e) => handleChange("admin_notes", e.target.value)}
              placeholder="Internal notes..."
              rows={3}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Submit error */}
          {submitError && (
            <p className="flex items-center gap-1.5 text-xs font-mono text-red-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {submitError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "creating..." : "[create lead]"}
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Animation keyframe */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
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
 * - Slide-over panel for creating new leads
 */
export default function AdminLeadsTable({ leads }: AdminLeadsTableProps) {
  /* ----- state ---------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [showCreatePanel, setShowCreatePanel] = useState(false);

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

      {/* Filter tabs + Search + New Lead button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabButton("all", "All")}
          {tabButton("pending", "Pending")}
          {tabButton("approved", "Approved")}
          {tabButton("rejected", "Rejected")}
        </div>

        {/* Search input + New Lead button */}
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => setShowCreatePanel(true)}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 whitespace-nowrap"
          >
            [+ new lead]
          </button>
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

      {/* Create Lead Slide-over Panel */}
      {showCreatePanel && (
        <CreateLeadPanel onClose={() => setShowCreatePanel(false)} />
      )}
    </div>
  );
}
