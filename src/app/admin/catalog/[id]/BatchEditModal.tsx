"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import type { AdminClip } from "./SamplesList";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BatchEditModalProps {
  selectedSamples: AdminClip[];
  datasetId: string;
  onSave: () => void;
  onClose: () => void;
}

interface FieldState {
  enabled: boolean;
  value: string;
}

// ---------------------------------------------------------------------------
// Component
//
// US-019: Updated to use clip-native field names (s3_key, ann_annotation_key,
// ann_specs_key, ann_metadata, ai_enrichment_json).
// ---------------------------------------------------------------------------

export default function BatchEditModal({
  selectedSamples,
  datasetId,
  onSave,
  onClose,
}: BatchEditModalProps) {
  const [fields, setFields] = useState<Record<string, FieldState>>({
    s3_key: { enabled: false, value: "" },
    ann_annotation_key: { enabled: false, value: "" },
    ann_specs_key: { enabled: false, value: "" },
    ann_metadata: { enabled: false, value: "{}" },
    ai_enrichment_json: { enabled: false, value: "{}" },
  });

  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // -----------------------------------------------------------------------
  // Field toggle / update
  // -----------------------------------------------------------------------

  const toggleField = useCallback((field: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], enabled: !prev[field].enabled },
    }));
  }, []);

  const updateField = useCallback((field: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  }, []);

  // -----------------------------------------------------------------------
  // Apply
  // -----------------------------------------------------------------------

  const enabledFields = Object.entries(fields).filter(([, f]) => f.enabled);
  const canApply = enabledFields.length > 0 && enabledFields.every(([, f]) => f.value.trim() !== "");

  const handleApply = useCallback(async () => {
    setError(null);

    // Validate ann_metadata if enabled
    if (fields.ann_metadata.enabled) {
      try {
        JSON.parse(fields.ann_metadata.value);
      } catch {
        setError("Annotation Metadata JSON is invalid");
        return;
      }
    }

    // Validate ai_enrichment_json if enabled
    if (fields.ai_enrichment_json.enabled) {
      try {
        JSON.parse(fields.ai_enrichment_json.value);
      } catch {
        setError("AI Enrichment JSON is invalid");
        return;
      }
    }

    const updates: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(fields)) {
      if (field.enabled) {
        updates[key] = field.value;
      }
    }

    setApplying(true);

    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}/samples/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sample_ids: selectedSamples.map((s) => s.id),
          updates,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Update failed (${res.status})`);
      }

      const result = await res.json();
      if (result.errors && result.errors.length > 0) {
        const failedIds = result.errors.map((e: { id: string }) => e.id);
        setError(`Failed for ${failedIds.length} clip(s): ${result.errors[0].message}`);
        return;
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply batch update");
    } finally {
      setApplying(false);
    }
  }, [datasetId, selectedSamples, fields, onSave]);

  // -----------------------------------------------------------------------
  // Shared styles
  // -----------------------------------------------------------------------

  const inputBase =
    "w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors disabled:opacity-40";

  const fieldDefs = [
    { key: "s3_key", label: "S3 Key", type: "text" as const },
    { key: "ann_annotation_key", label: "Annotation Key", type: "text" as const },
    { key: "ann_specs_key", label: "Specs Key", type: "text" as const },
    { key: "ann_metadata", label: "Annotation Metadata (JSON)", type: "textarea" as const },
    { key: "ai_enrichment_json", label: "AI Enrichment JSON", type: "textarea" as const },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Edit {selectedSamples.length} clips
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Check a field to include it in the batch update. Only checked fields will be modified.
            </p>

            {fieldDefs.map(({ key, label, type }) => (
              <div key={key} className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fields[key].enabled}
                    onChange={() => toggleField(key)}
                    className="rounded border-[var(--border-subtle)] bg-[var(--bg-secondary)] accent-[var(--accent-primary)]"
                  />
                  <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    {label}
                  </span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    value={fields[key].value}
                    onChange={(e) => updateField(key, e.target.value)}
                    disabled={!fields[key].enabled}
                    rows={4}
                    spellCheck={false}
                    className={`${inputBase} resize-y`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                ) : (
                  <input
                    type="text"
                    value={fields[key].value}
                    onChange={(e) => updateField(key, e.target.value)}
                    disabled={!fields[key].enabled}
                    className={inputBase}
                  />
                )}
              </div>
            ))}

            {error && (
              <p className="flex items-center gap-1 text-xs font-mono text-[var(--error)]">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={handleApply}
              disabled={!canApply || applying}
              className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {applying && <Loader2 className="w-4 h-4 animate-spin" />}
              {applying ? "Applying..." : "Apply"}
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
