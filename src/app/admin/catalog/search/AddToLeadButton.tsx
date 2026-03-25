"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { UserPlus, Check, Loader2, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadOption {
  id: string;
  name: string;
  company: string;
  already_assigned?: boolean;
}

interface AddToLeadButtonProps {
  /** Unified clip ID from the clips table */
  clipId: string;
  /** Compact style for inline use */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddToLeadButton({
  clipId,
  compact = false,
}: AddToLeadButtonProps) {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelectedLead(null);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fetch approved leads + check existing assignments on open
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads?status=approved");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const { leads: approvedLeads } = await res.json();

      // Check existing assignments for this clip via dataset_clips
      const leadsWithAssignment = await Promise.all(
        approvedLeads.map(async (lead: LeadOption) => {
          try {
            const csRes = await fetch(
              `/api/admin/leads/${lead.id}/custom-samples`
            );
            if (!csRes.ok) return { ...lead, already_assigned: false };
            const { samples } = await csRes.json();
            const assigned = samples.some(
              (s: { clip_id?: string }) =>
                s.clip_id === clipId
            );
            return { ...lead, already_assigned: assigned };
          } catch {
            return { ...lead, already_assigned: false };
          }
        })
      );

      setLeads(leadsWithAssignment);
    } catch {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [clipId]);

  const handleOpen = () => {
    if (success) return;
    setOpen(true);
    setError(null);
    fetchLeads();
  };

  const handleSelectLead = (lead: LeadOption) => {
    if (lead.already_assigned) return;
    setSelectedLead(lead);
  };

  const handleConfirm = async () => {
    if (!selectedLead) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/leads/${selectedLead.id}/custom-samples`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clip_id: clipId,
            note: note || undefined,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add");
      }

      setSuccess(`Added to ${selectedLead.name}`);
      setOpen(false);
      setSelectedLead(null);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  // Success state
  if (success) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent-primary)]">
        <Check className="w-3 h-3" />
        {success}
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1 font-mono transition-colors ${
          compact
            ? "text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
            : "text-xs px-2 py-1 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
        }`}
      >
        <UserPlus className="w-3 h-3" />
        {compact ? "add to lead" : "Add to Lead"}
        {!compact && <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="absolute z-50 right-0 bottom-full mb-1 w-72 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl">
          {/* Search input */}
          <div className="p-2 border-b border-[var(--border-subtle)]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              autoFocus
              className="w-full px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Lead list or note input */}
          {selectedLead ? (
            <div className="p-3 space-y-2">
              <div className="text-xs font-mono text-[var(--text-secondary)]">
                Adding to <span className="text-[var(--accent-primary)]">{selectedLead.name}</span>
                <span className="text-[var(--text-muted)]"> ({selectedLead.company})</span>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-full px-2 py-1.5 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 px-2 py-1.5 text-xs font-mono rounded bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-2 py-1.5 text-xs font-mono rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                >
                  Back
                </button>
              </div>
              {error && (
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono text-red-400">{error}</p>
                  <button
                    onClick={handleConfirm}
                    className="text-[10px] font-mono text-red-400 hover:text-red-300 underline"
                  >
                    retry
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)] mx-auto" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-3 text-xs font-mono text-[var(--text-muted)] text-center">
                  No matching leads
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    disabled={lead.already_assigned}
                    className={`w-full px-3 py-2 text-left text-xs font-mono border-b border-[var(--border-subtle)] last:border-0 transition-colors ${
                      lead.already_assigned
                        ? "text-[var(--text-muted)] cursor-default opacity-50"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[var(--text-primary)]">{lead.name}</span>
                        <span className="text-[var(--text-muted)] ml-1">({lead.company})</span>
                      </div>
                      {lead.already_assigned && (
                        <Check className="w-3 h-3 text-[var(--accent-primary)]" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Close button */}
          <div className="border-t border-[var(--border-subtle)] p-1">
            <button
              onClick={() => {
                setOpen(false);
                setSelectedLead(null);
                setSearch("");
              }}
              className="w-full px-2 py-1 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] text-center"
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
