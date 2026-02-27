"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Save, Trash2, Loader2, AlertCircle, Code } from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SampleEditPanelProps {
  sample: DatasetSample;
  datasetId: string;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SampleEditPanel({
  sample,
  datasetId,
  onSave,
  onClose,
  onDelete,
}: SampleEditPanelProps) {
  const [s3ObjectKey, setS3ObjectKey] = useState(sample.s3_object_key ?? "");
  const [s3AnnotationKey, setS3AnnotationKey] = useState(sample.s3_annotation_key ?? "");
  const [s3SpecsKey, setS3SpecsKey] = useState(sample.s3_specs_key ?? "");
  const [metadataJson, setMetadataJson] = useState(
    JSON.stringify(sample.metadata_json ?? {}, null, 2)
  );
  const [enrichmentJson, setEnrichmentJson] = useState(
    JSON.stringify(sample.enrichment_json ?? {}, null, 2)
  );
  const [mediaUrl, setMediaUrl] = useState(sample.media_url ?? "");

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
  }, [s3ObjectKey, s3AnnotationKey, s3SpecsKey, metadataJson, enrichmentJson, mediaUrl]);

  // -----------------------------------------------------------------------
  // Format JSON
  // -----------------------------------------------------------------------

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(metadataJson);
      setMetadataJson(JSON.stringify(parsed, null, 2));
    } catch {
      // leave as-is if invalid
    }
  }, [metadataJson]);

  const formatEnrichmentJson = useCallback(() => {
    try {
      const parsed = JSON.parse(enrichmentJson);
      setEnrichmentJson(JSON.stringify(parsed, null, 2));
    } catch {
      // leave as-is if invalid
    }
  }, [enrichmentJson]);

  // -----------------------------------------------------------------------
  // Save
  // -----------------------------------------------------------------------

  const handleSave = useCallback(async () => {
    setError(null);

    // Validate JSON
    if (metadataJson.trim()) {
      try {
        JSON.parse(metadataJson);
      } catch {
        setError("Metadata JSON is invalid");
        return;
      }
    }

    if (enrichmentJson.trim()) {
      try {
        JSON.parse(enrichmentJson);
      } catch {
        setError("Enrichment JSON is invalid");
        return;
      }
    }

    // Build updates — only send changed fields
    const updates: Record<string, unknown> = {};
    if (s3ObjectKey !== (sample.s3_object_key ?? "")) {
      updates.s3_object_key = s3ObjectKey || null;
    }
    if (s3AnnotationKey !== (sample.s3_annotation_key ?? "")) {
      updates.s3_annotation_key = s3AnnotationKey || null;
    }
    if (s3SpecsKey !== (sample.s3_specs_key ?? "")) {
      updates.s3_specs_key = s3SpecsKey || null;
    }
    if (mediaUrl !== (sample.media_url ?? "")) {
      updates.media_url = mediaUrl || null;
    }

    const originalJson = JSON.stringify(sample.metadata_json ?? {}, null, 2);
    if (metadataJson.trim() !== originalJson) {
      updates.metadata_json = metadataJson.trim() || "{}";
    }

    const originalEnrichment = JSON.stringify(sample.enrichment_json ?? {}, null, 2);
    if (enrichmentJson.trim() !== originalEnrichment) {
      updates.enrichment_json = enrichmentJson.trim() || "{}";
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
    s3ObjectKey,
    s3AnnotationKey,
    s3SpecsKey,
    metadataJson,
    enrichmentJson,
    mediaUrl,
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
            Edit Sample
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
          {/* S3 Object Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              S3 Object Key
            </label>
            <input
              type="text"
              value={s3ObjectKey}
              onChange={(e) => setS3ObjectKey(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* S3 Annotation Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              S3 Annotation Key
            </label>
            <input
              type="text"
              value={s3AnnotationKey}
              onChange={(e) => setS3AnnotationKey(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* S3 Specs Key */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              S3 Specs Key
            </label>
            <input
              type="text"
              value={s3SpecsKey}
              onChange={(e) => setS3SpecsKey(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Media URL */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Media URL
            </label>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Metadata JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Metadata JSON
              </label>
              <button
                type="button"
                onClick={formatJson}
                className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Code className="w-3 h-3" />
                Format
              </button>
            </div>
            <textarea
              value={metadataJson}
              onChange={(e) => setMetadataJson(e.target.value)}
              rows={8}
              spellCheck={false}
              className={`${inputBase} resize-y`}
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Enrichment JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Enrichment JSON
              </label>
              <button
                type="button"
                onClick={formatEnrichmentJson}
                className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Code className="w-3 h-3" />
                Format
              </button>
            </div>
            <textarea
              value={enrichmentJson}
              onChange={(e) => setEnrichmentJson(e.target.value)}
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
                Delete Sample
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-mono text-[var(--error)]">
                  Are you sure? This cannot be undone.
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
