"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Save, Trash2, Loader2, AlertCircle, Code } from "lucide-react";
import type { AdminClip } from "./SamplesList";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SampleEditPanelProps {
  sample: AdminClip;
  datasetId: string;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
}

// ---------------------------------------------------------------------------
// Component
//
// US-019: Updated to edit clip-native fields (s3_key, ann_annotation_key,
// ann_specs_key, ann_metadata, ai_enrichment_json) instead of legacy
// dataset_samples fields.
// ---------------------------------------------------------------------------

export default function SampleEditPanel({
  sample,
  datasetId,
  onSave,
  onClose,
  onDelete,
}: SampleEditPanelProps) {
  const [s3Key, setS3Key] = useState(sample.s3_key ?? "");
  const [annAnnotationKey, setAnnAnnotationKey] = useState(sample.ann_annotation_key ?? "");
  const [annSpecsKey, setAnnSpecsKey] = useState(sample.ann_specs_key ?? "");
  const [annMetadata, setAnnMetadata] = useState(
    JSON.stringify(sample.ann_metadata ?? {}, null, 2)
  );
  const [aiEnrichmentJson, setAiEnrichmentJson] = useState(
    JSON.stringify(sample.ai_enrichment_json ?? {}, null, 2)
  );
  const [aiCaption, setAiCaption] = useState(sample.ai_caption ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // -----------------------------------------------------------------------
  // Keyboard shortcuts
  // -----------------------------------------------------------------------

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s3Key, annAnnotationKey, annSpecsKey, annMetadata, aiEnrichmentJson, aiCaption]);

  // -----------------------------------------------------------------------
  // Format JSON
  // -----------------------------------------------------------------------

  const formatAnnMetadata = useCallback(() => {
    try {
      const parsed = JSON.parse(annMetadata);
      setAnnMetadata(JSON.stringify(parsed, null, 2));
    } catch {
      // leave as-is if invalid
    }
  }, [annMetadata]);

  const formatAiEnrichmentJson = useCallback(() => {
    try {
      const parsed = JSON.parse(aiEnrichmentJson);
      setAiEnrichmentJson(JSON.stringify(parsed, null, 2));
    } catch {
      // leave as-is if invalid
    }
  }, [aiEnrichmentJson]);

  // -----------------------------------------------------------------------
  // Save
  // -----------------------------------------------------------------------

  const handleSave = useCallback(async () => {
    setError(null);

    // Validate JSON
    if (annMetadata.trim()) {
      try {
        JSON.parse(annMetadata);
      } catch {
        setError("Annotation Metadata JSON is invalid");
        return;
      }
    }

    if (aiEnrichmentJson.trim()) {
      try {
        JSON.parse(aiEnrichmentJson);
      } catch {
        setError("AI Enrichment JSON is invalid");
        return;
      }
    }

    // Build updates -- only send changed fields
    const updates: Record<string, unknown> = {};
    if (s3Key !== (sample.s3_key ?? "")) {
      updates.s3_key = s3Key || null;
    }
    if (annAnnotationKey !== (sample.ann_annotation_key ?? "")) {
      updates.ann_annotation_key = annAnnotationKey || null;
    }
    if (annSpecsKey !== (sample.ann_specs_key ?? "")) {
      updates.ann_specs_key = annSpecsKey || null;
    }
    if (aiCaption !== (sample.ai_caption ?? "")) {
      updates.ai_caption = aiCaption || null;
    }

    const originalAnnMetadata = JSON.stringify(sample.ann_metadata ?? {}, null, 2);
    if (annMetadata.trim() !== originalAnnMetadata) {
      updates.ann_metadata = annMetadata.trim() || "{}";
    }

    const originalAiEnrichment = JSON.stringify(sample.ai_enrichment_json ?? {}, null, 2);
    if (aiEnrichmentJson.trim() !== originalAiEnrichment) {
      updates.ai_enrichment_json = aiEnrichmentJson.trim() || "{}";
    }

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/catalog/${datasetId}/samples/${sample.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Update failed (${res.status})`);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [
    sample,
    datasetId,
    s3Key,
    annAnnotationKey,
    annSpecsKey,
    annMetadata,
    aiEnrichmentJson,
    aiCaption,
    onSave,
    onClose,
  ]);

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------

  const handleDelete = useCallback(async () => {
    setError(null);
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/catalog/${datasetId}/samples/${sample.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Delete failed (${res.status})`);
      }

      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }, [datasetId, sample.id, onDelete]);

  // -----------------------------------------------------------------------
  // Shared styles
  // -----------------------------------------------------------------------

  const inputBase =
    "w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors";

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

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Edit Clip
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
          {/* Lead-specific indicator */}
          {sample.lead_id && (
            <div className="rounded-md border border-purple-500/30 bg-purple-500/10 px-4 py-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  LEAD-SPECIFIC
                </span>
                <span className="text-xs font-mono text-purple-400">
                  Custom clip added for a lead
                </span>
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] space-y-0.5">
                <p>Lead ID: <span className="text-[var(--text-secondary)]">{sample.lead_id}</span></p>
                {sample.added_by && (
                  <p>Added by: <span className="text-[var(--text-secondary)]">{sample.added_by}</span></p>
                )}
              </div>
            </div>
          )}

          {/* S3 Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              S3 Key
            </label>
            <input
              type="text"
              value={s3Key}
              onChange={(e) => setS3Key(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Annotation Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Annotation Key
            </label>
            <input
              type="text"
              value={annAnnotationKey}
              onChange={(e) => setAnnAnnotationKey(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Specs Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Specs Key
            </label>
            <input
              type="text"
              value={annSpecsKey}
              onChange={(e) => setAnnSpecsKey(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* AI Caption */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              AI Caption
            </label>
            <textarea
              value={aiCaption}
              onChange={(e) => setAiCaption(e.target.value)}
              rows={3}
              spellCheck={false}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Annotation Metadata JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Annotation Metadata
              </label>
              <button
                type="button"
                onClick={formatAnnMetadata}
                className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Code className="w-3 h-3" />
                Format
              </button>
            </div>
            <textarea
              value={annMetadata}
              onChange={(e) => setAnnMetadata(e.target.value)}
              rows={8}
              spellCheck={false}
              className={`${inputBase} resize-y`}
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* AI Enrichment JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                AI Enrichment JSON
              </label>
              <button
                type="button"
                onClick={formatAiEnrichmentJson}
                className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Code className="w-3 h-3" />
                Format
              </button>
            </div>
            <textarea
              value={aiEnrichmentJson}
              onChange={(e) => setAiEnrichmentJson(e.target.value)}
              rows={8}
              spellCheck={false}
              className={`${inputBase} resize-y`}
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="flex items-center gap-1 text-xs font-mono text-[var(--error)]">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--border-subtle)] space-y-3">
          {/* Save / Cancel */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-xs font-mono text-[var(--error)] hover:opacity-80 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
                Remove from Dataset
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-mono text-[var(--error)]">
                  Remove this clip from the dataset? The clip itself is preserved.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1 rounded-md bg-[var(--error)] text-white px-3 py-1.5 text-xs font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation keyframe */}
      <style jsx global>{`
        @keyframes slideIn {
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
