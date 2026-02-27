"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import LeadStatusBadge from "@/app/components/ui/LeadStatusBadge";
import type { Lead, LeadStatus, Dataset, LeadDatasetAccess } from "@/types/data-catalog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DatasetWithCategory extends Dataset {
  dataset_categories?: { name: string } | null;
}

interface GrantWithDataset extends LeadDatasetAccess {
  datasets: DatasetWithCategory | null;
}

interface LeadDetailClientProps {
  initialLead: Lead;
  initialGrants: GrantWithDataset[];
  allDatasets: DatasetWithCategory[];
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupDatasetsByCategory(
  datasets: DatasetWithCategory[]
): Record<string, DatasetWithCategory[]> {
  const groups: Record<string, DatasetWithCategory[]> = {};
  for (const ds of datasets) {
    const cat = ds.dataset_categories?.name ?? "Uncategorized";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(ds);
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg font-mono text-sm shadow-lg border animate-[toast-in_0.2s_ease-out] ${
            t.type === "success"
              ? "bg-[var(--bg-secondary)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
              : "bg-[var(--bg-secondary)] text-[var(--error)] border-[var(--error)]/30"
          }`}
        >
          {t.type === "success" ? "> " : "! "}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LeadDetailClient({
  initialLead,
  initialGrants,
  allDatasets,
}: LeadDetailClientProps) {
  const [lead, setLead] = useState<Lead>(initialLead);
  const [grants, setGrants] = useState<GrantWithDataset[]>(initialGrants);
  const [adminNotes, setAdminNotes] = useState(lead.admin_notes ?? "");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isResettingToPending, setIsResettingToPending] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showDatasetSelector, setShowDatasetSelector] = useState(false);
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<Set<string>>(
    new Set(initialGrants.map((g) => g.dataset_id))
  );
  const [isSavingGrants, setIsSavingGrants] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // Sync selectedDatasetIds when grants change
  useEffect(() => {
    setSelectedDatasetIds(new Set(grants.map((g) => g.dataset_id)));
  }, [grants]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  /* ---- Actions --------------------------------------------------- */

  const handleApprove = useCallback(async () => {
    if (!window.confirm("Approve this lead? A Supabase Auth user will be created and a magic link generated.")) return;
    setIsApproving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error);
      }
      const data = await res.json();
      setLead(data.lead);
      addToast("Lead approved");
    } catch (err) {
      addToast(
        `Approve failed: ${err instanceof Error ? err.message : "unknown"}`,
        "error"
      );
    } finally {
      setIsApproving(false);
    }
  }, [lead.id, adminNotes, addToast]);

  const handleReject = useCallback(async () => {
    if (!window.confirm("Reject this lead?")) return;
    setIsRejecting(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error);
      }
      const data = await res.json();
      setLead(data.lead);
      addToast("Lead rejected");
    } catch (err) {
      addToast(
        `Reject failed: ${err instanceof Error ? err.message : "unknown"}`,
        "error"
      );
    } finally {
      setIsRejecting(false);
    }
  }, [lead.id, adminNotes, addToast]);

  const handleResetToPending = useCallback(async () => {
    if (!window.confirm("Reset this lead back to pending?")) return;
    setIsResettingToPending(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending", admin_notes: adminNotes }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error);
      }
      const data = await res.json();
      setLead(data.lead ?? { ...lead, status: "pending" });
      addToast("Lead reset to pending");
    } catch (err) {
      addToast(
        `Reset failed: ${err instanceof Error ? err.message : "unknown"}`,
        "error"
      );
    } finally {
      setIsResettingToPending(false);
    }
  }, [lead, adminNotes, addToast]);

  const handleSaveNotes = useCallback(async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      const data = await res.json();
      setLead(data.lead);
      addToast("Notes saved");
    } catch (err) {
      addToast(
        `Save failed: ${err instanceof Error ? err.message : "unknown"}`,
        "error"
      );
    } finally {
      setIsSavingNotes(false);
    }
  }, [lead.id, adminNotes, addToast]);

  const handleSaveGrants = useCallback(async () => {
    setIsSavingGrants(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/grant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_ids: [...selectedDatasetIds] }),
      });
      if (!res.ok) throw new Error("Failed to update grants");
      const data = await res.json();
      setGrants(data.grants);
      setShowDatasetSelector(false);
      addToast(
        `Access updated: +${data.added} granted, -${data.removed} revoked`
      );
    } catch (err) {
      addToast(
        `Grant failed: ${err instanceof Error ? err.message : "unknown"}`,
        "error"
      );
    } finally {
      setIsSavingGrants(false);
    }
  }, [lead.id, selectedDatasetIds, addToast]);

  const handleRevokeGrant = useCallback(
    async (datasetId: string) => {
      if (!window.confirm("Revoke access to this dataset?")) return;
      try {
        const res = await fetch(`/api/admin/leads/${lead.id}/grant`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset_id: datasetId }),
        });
        if (!res.ok) throw new Error("Failed to revoke");
        setGrants((prev) => prev.filter((g) => g.dataset_id !== datasetId));
        addToast("Access revoked");
      } catch (err) {
        addToast(
          `Revoke failed: ${err instanceof Error ? err.message : "unknown"}`,
          "error"
        );
      }
    },
    [lead.id, addToast]
  );

  /* ---- Dataset selector helpers ---------------------------------- */

  const toggleDataset = (id: string) => {
    setSelectedDatasetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (categoryDatasets: DatasetWithCategory[]) => {
    const ids = categoryDatasets.map((d) => d.id);
    const allSelected = ids.every((id) => selectedDatasetIds.has(id));
    setSelectedDatasetIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const grouped = groupDatasetsByCategory(allDatasets);
  const filteredGrouped = Object.entries(grouped).reduce(
    (acc, [cat, datasets]) => {
      if (!datasetSearch.trim()) {
        acc[cat] = datasets;
        return acc;
      }
      const q = datasetSearch.toLowerCase();
      const filtered = datasets.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q)
      );
      if (filtered.length > 0) acc[cat] = filtered;
      return acc;
    },
    {} as Record<string, DatasetWithCategory[]>
  );

  const canApprove = lead.status === "pending" || lead.status === "rejected";
  const canReject = lead.status === "pending" || lead.status === "approved";
  const canResetToPending = lead.status === "approved" || lead.status === "rejected";

  /* ---- Render ---------------------------------------------------- */

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
      >
        &larr; back to leads
      </Link>

      {/* Lead Info Card */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-mono font-semibold text-[var(--text-primary)]">
              {lead.name}
            </h2>
            <p className="text-sm font-mono text-[var(--text-muted)] mt-1">
              {lead.email}
            </p>
          </div>
          <LeadStatusBadge status={lead.status as LeadStatus} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Company" value={lead.company} />
          <InfoField label="Role" value={lead.role} />
          <InfoField label="Data Needs" value={lead.data_needs} />
          <InfoField label="Use Case" value={lead.use_case} />
          <InfoField label="Submitted" value={formatDate(lead.created_at)} />
          <InfoField label="Updated" value={formatDate(lead.updated_at)} />
          {lead.supabase_user_id && (
            <InfoField label="Auth User ID" value={lead.supabase_user_id} />
          )}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4">
        <h3 className="text-sm font-mono font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
          Admin Notes
        </h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          placeholder="Internal notes about this lead..."
          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors resize-y"
        />
        <button
          onClick={handleSaveNotes}
          disabled={isSavingNotes}
          className="px-4 py-2 text-xs font-mono bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingNotes ? "saving..." : "save notes"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="px-6 py-2.5 font-mono text-sm font-medium rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? "approving..." : "approve"}
          </button>
        )}
        {canReject && (
          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="px-6 py-2.5 font-mono text-sm font-medium rounded-lg bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/30 hover:bg-[var(--error)]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRejecting ? "rejecting..." : "reject"}
          </button>
        )}
        {canResetToPending && (
          <button
            onClick={handleResetToPending}
            disabled={isResettingToPending}
            className="px-6 py-2.5 font-mono text-sm font-medium rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 hover:bg-[var(--warning)]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResettingToPending ? "resetting..." : "reset to pending"}
          </button>
        )}
      </div>

      {/* Dataset Access Section */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
            Dataset Access
            <span className="ml-2 text-[var(--accent-primary)]">
              ({grants.length})
            </span>
          </h3>
          <button
            onClick={() => setShowDatasetSelector(!showDatasetSelector)}
            className="text-xs font-mono text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
          >
            {showDatasetSelector
              ? "[close selector]"
              : grants.length > 0
                ? "[grant additional access]"
                : "[grant access]"}
          </button>
        </div>

        {/* Current Grants Table */}
        {grants.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
            <table className="w-full font-mono text-sm">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Dataset
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Samples
                  </th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Granted
                  </th>
                  <th className="px-4 py-2 text-right text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {grants.map((grant) => (
                  <tr
                    key={grant.id}
                    className="hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <td className="px-4 py-2 text-[var(--text-primary)]">
                      {grant.datasets?.name ?? "Unknown"}
                    </td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">
                      {grant.datasets?.dataset_categories?.name ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">
                      {grant.datasets?.total_samples ?? 0}
                    </td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">
                      {formatDate(grant.granted_at)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleRevokeGrant(grant.dataset_id)}
                        className="text-xs text-[var(--error)] hover:text-[var(--error)]/80 transition-colors"
                      >
                        [revoke]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm font-mono text-[var(--text-muted)] py-4 text-center">
            No datasets granted yet.
          </p>
        )}

        {/* Dataset Selector Panel */}
        {showDatasetSelector && (
          <div className="mt-4 rounded-lg border border-[var(--border-accent)] bg-[var(--bg-primary)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-mono font-semibold text-[var(--accent-primary)]">
                Select Datasets to Grant
              </h4>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {selectedDatasetIds.size} selected
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono text-sm pointer-events-none">
                $
              </span>
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="search datasets..."
                className="w-full pl-7 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors"
              />
            </div>

            {/* Grouped Dataset List */}
            <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
              {Object.entries(filteredGrouped).length === 0 ? (
                <p className="text-sm font-mono text-[var(--text-muted)] text-center py-4">
                  No datasets found.
                </p>
              ) : (
                Object.entries(filteredGrouped).map(([category, datasets]) => {
                  const allInCatSelected = datasets.every((d) =>
                    selectedDatasetIds.has(d.id)
                  );
                  const someInCatSelected =
                    !allInCatSelected &&
                    datasets.some((d) => selectedDatasetIds.has(d.id));

                  return (
                    <div key={category}>
                      {/* Category header with select-all */}
                      <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[var(--bg-secondary)] rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={allInCatSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someInCatSelected;
                          }}
                          onChange={() => toggleCategory(datasets)}
                          className="accent-[var(--accent-primary)]"
                        />
                        <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider">
                          {category}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          ({datasets.length})
                        </span>
                      </label>

                      {/* Datasets in category */}
                      <div className="ml-4 space-y-1 mt-1">
                        {datasets.map((ds) => (
                          <label
                            key={ds.id}
                            className="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-[var(--bg-secondary)] rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDatasetIds.has(ds.id)}
                              onChange={() => toggleDataset(ds.id)}
                              className="accent-[var(--accent-primary)]"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-mono text-[var(--text-primary)] block truncate">
                                {ds.name}
                              </span>
                              <span className="text-xs font-mono text-[var(--text-muted)]">
                                {ds.total_samples} samples
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Save grants button */}
            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  setShowDatasetSelector(false);
                  setSelectedDatasetIds(
                    new Set(grants.map((g) => g.dataset_id))
                  );
                }}
                className="px-4 py-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleSaveGrants}
                disabled={isSavingGrants}
                className="px-4 py-2 text-xs font-mono bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingGrants ? "saving..." : "save access grants"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4">
        <h3 className="text-sm font-mono font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
          Timeline
        </h3>
        <div className="space-y-3">
          <TimelineItem
            label="Created"
            date={lead.created_at}
            icon="+"
            accentClass="text-[var(--text-muted)]"
          />
          {lead.status === "approved" && (
            <TimelineItem
              label="Approved"
              date={lead.updated_at}
              icon=">"
              accentClass="text-[var(--accent-primary)]"
            />
          )}
          {lead.status === "rejected" && (
            <TimelineItem
              label="Rejected"
              date={lead.updated_at}
              icon="x"
              accentClass="text-[var(--error)]"
            />
          )}
          {grants.length > 0 && (
            <TimelineItem
              label={`${grants.length} dataset(s) granted`}
              date={grants[grants.length - 1].granted_at}
              icon="#"
              accentClass="text-[var(--accent-primary)]"
            />
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-mono text-[var(--text-primary)] break-words">
        {value || "(not provided)"}
      </dd>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  icon,
  accentClass,
}: {
  label: string;
  date: string;
  icon: string;
  accentClass: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`font-mono text-sm font-bold ${accentClass} mt-0.5 w-4 text-center`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-mono text-[var(--text-primary)]">{label}</p>
        <p className="text-xs font-mono text-[var(--text-muted)]">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}
