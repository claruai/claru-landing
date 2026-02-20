"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Loader2, Save, Trash2, Upload } from "lucide-react";
import AddSampleForm from "./AddSampleForm";
import DatasetUploader from "@/app/components/ui/DatasetUploader";
import type { Dataset, DatasetCategory, DatasetSample, DatasetType } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CatalogEditClientProps {
  dataset: Dataset & { dataset_categories?: { id: string; name: string } | null };
  categories: Pick<DatasetCategory, "id" | "name" | "slug">[];
}

const DATASET_TYPES: DatasetType[] = [
  "short_form",
  "long_form",
  "cinematic",
  "game_capture",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CatalogEditClient({
  dataset,
  categories,
}: CatalogEditClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Incremented to signal DatasetUploader to re-fetch its sample list
  const [uploaderRefreshKey, setUploaderRefreshKey] = useState(0);

  // Whether the file upload collapsible section is open
  const [showFileUploader, setShowFileUploader] = useState(false);

  // When AddSampleForm adds a sample, tell DatasetUploader to refresh
  const handleSampleAdded = useCallback((_sample: DatasetSample) => {
    setUploaderRefreshKey((k) => k + 1);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/catalog/${dataset.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Delete failed");
      }

      router.push("/admin/catalog");
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Form state -- simple controlled inputs
  const [name, setName] = useState(dataset.name ?? "");
  const [slug, setSlug] = useState(dataset.slug ?? "");
  const [description, setDescription] = useState(dataset.description ?? "");
  const [categoryId, setCategoryId] = useState(dataset.category_id ?? "");
  const [type, setType] = useState<DatasetType>(dataset.type);
  const [subcategory, setSubcategory] = useState(dataset.subcategory ?? "");
  const [totalSamples, setTotalSamples] = useState(dataset.total_samples ?? 0);
  const [totalDuration, setTotalDuration] = useState(dataset.total_duration_hours ?? 0);
  const [geoCoverage, setGeoCoverage] = useState(dataset.geographic_coverage ?? "");
  const [annotationTypes, setAnnotationTypes] = useState(
    dataset.annotation_types?.join(", ") ?? ""
  );
  const [isPublished, setIsPublished] = useState(dataset.is_published);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/catalog/${dataset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          category_id: categoryId,
          type,
          subcategory,
          total_samples: totalSamples,
          total_duration_hours: totalDuration,
          geographic_coverage: geoCoverage,
          annotation_types: annotationTypes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          is_published: isPublished,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Save failed");
      }

      setMessage({ type: "success", text: "Dataset saved." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* ----------------------------------------------------------------- */}
      {/* Dataset Form                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section>
        <h2 className="text-base font-mono font-semibold text-[var(--text-primary)] mb-6">
          Dataset Details
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Slug" value={slug} onChange={setSlug} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-y"
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DatasetType)}
                className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              >
                {DATASET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory & Geo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Subcategory"
              value={subcategory}
              onChange={setSubcategory}
            />
            <Field
              label="Geographic Coverage"
              value={geoCoverage}
              onChange={setGeoCoverage}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Total Samples
              </label>
              <input
                type="number"
                value={totalSamples}
                onChange={(e) => setTotalSamples(Number(e.target.value))}
                className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Total Duration (hours)
              </label>
              <input
                type="number"
                step="0.1"
                value={totalDuration}
                onChange={(e) => setTotalDuration(Number(e.target.value))}
                className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
          </div>

          {/* Annotation types */}
          <Field
            label="Annotation Types (comma separated)"
            value={annotationTypes}
            onChange={setAnnotationTypes}
          />

          {/* Published */}
          <label className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-[var(--accent-primary)]"
            />
            Published
          </label>

          {/* Save + Delete buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {message && (
                <span
                  className={`text-sm font-mono ${
                    message.type === "success"
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--error)]"
                  }`}
                >
                  {message.text}
                </span>
              )}
            </div>

            {/* Delete */}
            <div className="relative">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-red-400">
                    confirm delete?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-colors duration-150"
                  >
                    {deleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    {deleting ? "deleting..." : "[yes, delete]"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                  >
                    [cancel]
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-xs font-mono text-red-400/60 hover:text-red-400 transition-colors duration-150"
                >
                  <Trash2 className="w-3 h-3" />
                  [delete dataset]
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Samples Section                                                   */}
      {/* ----------------------------------------------------------------- */}
      <section>
        <div className="border-t border-[var(--border-subtle)] pt-8 space-y-8">
          <h2 className="text-base font-mono font-semibold text-[var(--text-primary)]">
            Samples
          </h2>

          {/* ---- Add Sample via URL + JSON (primary) ---- */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5">
            <h3 className="text-sm font-mono font-medium text-[var(--text-secondary)] mb-4">
              Add Sample via URL
            </h3>
            <AddSampleForm
              datasetId={dataset.id}
              onSampleAdded={handleSampleAdded}
            />
          </div>

          {/* ---- Or upload a file (secondary, collapsible) ---- */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <button
              type="button"
              onClick={() => setShowFileUploader((prev) => !prev)}
              className="flex items-center gap-2 w-full px-5 py-4 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {showFileUploader ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Upload className="w-4 h-4" />
              <span>Or upload a file</span>
            </button>

            {showFileUploader && (
              <div className="px-5 pb-5 border-t border-[var(--border-subtle)]">
                <div className="pt-4">
                  <DatasetUploader
                    datasetId={dataset.id}
                    refreshKey={uploaderRefreshKey}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ---- Samples list (always visible via DatasetUploader) ---- */}
          {!showFileUploader && (
            <DatasetUploader
              datasetId={dataset.id}
              refreshKey={uploaderRefreshKey}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field helper
// ---------------------------------------------------------------------------

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
      />
    </div>
  );
}
