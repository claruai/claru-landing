"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Dataset, DatasetCategory, DatasetType } from "@/types/data-catalog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DatasetFormProps {
  /** Existing dataset to edit. If null, we are in create mode. */
  dataset: Dataset | null;
  /** Available categories for the dropdown. */
  categories: DatasetCategory[];
}

interface FormState {
  name: string;
  slug: string;
  category_id: string;
  type: DatasetType;
  subcategory: string;
  description: string;
  total_samples: number;
  total_duration_hours: number;
  geographic_coverage: string;
  annotation_types: string[];
  is_published: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DATASET_TYPES: { value: DatasetType; label: string }[] = [
  { value: "short_form", label: "Short Form" },
  { value: "long_form", label: "Long Form" },
  { value: "cinematic", label: "Cinematic" },
  { value: "game_capture", label: "Game Capture" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shared form component for creating and editing datasets.
 *
 * Handles:
 * - Auto-generating slug from name
 * - Tag input for annotation_types
 * - Published toggle
 * - Create (POST) or Update (PATCH) via API
 * - Delete with confirmation (edit mode only)
 */
export default function DatasetForm({ dataset, categories }: DatasetFormProps) {
  const router = useRouter();
  const isEditMode = dataset !== null;

  /* ----- form state ----------------------------------------------- */
  const [form, setForm] = useState<FormState>(() => {
    if (dataset) {
      return {
        name: dataset.name,
        slug: dataset.slug,
        category_id: dataset.category_id,
        type: dataset.type,
        subcategory: dataset.subcategory,
        description: dataset.description,
        total_samples: dataset.total_samples,
        total_duration_hours: dataset.total_duration_hours,
        geographic_coverage: dataset.geographic_coverage,
        annotation_types: dataset.annotation_types ?? [],
        is_published: dataset.is_published,
      };
    }
    return {
      name: "",
      slug: "",
      category_id: categories[0]?.id ?? "",
      type: "short_form",
      subcategory: "",
      description: "",
      total_samples: 0,
      total_duration_hours: 0,
      geographic_coverage: "",
      annotation_types: [],
      is_published: false,
    };
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  /* ----- auto-generate slug from name ----------------------------- */
  useEffect(() => {
    if (!slugManuallyEdited && !isEditMode) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, slugManuallyEdited, isEditMode]);

  /* ----- field helpers -------------------------------------------- */
  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ----- tag input ------------------------------------------------ */
  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !form.annotation_types.includes(tag)) {
      setForm((prev) => ({
        ...prev,
        annotation_types: [...prev.annotation_types, tag],
      }));
    }
    setTagInput("");
  }, [tagInput, form.annotation_types]);

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({
      ...prev,
      annotation_types: prev.annotation_types.filter((t) => t !== tag),
    }));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  /* ----- save ----------------------------------------------------- */
  const handleSave = useCallback(async () => {
    setError(null);
    setSaving(true);

    try {
      const url = isEditMode
        ? `/api/admin/catalog/${dataset!.id}`
        : "/api/admin/catalog";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      router.push("/admin/catalog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [form, isEditMode, dataset, router]);

  /* ----- delete --------------------------------------------------- */
  const handleDelete = useCallback(async () => {
    if (!dataset) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/catalog/${dataset.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Delete failed (${res.status})`);
      }

      router.push("/admin/catalog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [dataset, router]);

  /* ----- shared input styles -------------------------------------- */
  const inputClass =
    "w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1.5";

  /* ----- render --------------------------------------------------- */
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 rounded-lg border border-[var(--error)]/20 bg-[var(--error)]/10">
          <p className="text-sm font-mono text-[var(--error)]">
            <span className="opacity-60">error: </span>
            {error}
          </p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className={labelClass}>Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g. Urban Driving - Dashboard Cam"
          className={inputClass}
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => {
            setSlugManuallyEdited(true);
            updateField("slug", e.target.value);
          }}
          placeholder="auto-generated-from-name"
          className={inputClass}
        />
        <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">
          Auto-generated from name. Edit to override.
        </p>
      </div>

      {/* Category + Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={form.category_id}
            onChange={(e) => updateField("category_id", e.target.value)}
            className={inputClass}
          >
            {categories.length === 0 && (
              <option value="">No categories</option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Type *</label>
          <select
            value={form.type}
            onChange={(e) =>
              updateField("type", e.target.value as DatasetType)
            }
            className={inputClass}
          >
            {DATASET_TYPES.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subcategory */}
      <div>
        <label className={labelClass}>Subcategory</label>
        <input
          type="text"
          value={form.subcategory}
          onChange={(e) => updateField("subcategory", e.target.value)}
          placeholder="e.g. Indoor Scenes"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe the dataset content, quality, and use cases..."
          rows={4}
          className={inputClass}
        />
      </div>

      {/* Samples + Duration row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Dataset Size</label>
          <input
            type="number"
            min={0}
            value={form.total_samples}
            onChange={(e) =>
              updateField("total_samples", parseInt(e.target.value, 10) || 0)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Total Duration (hours)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.total_duration_hours}
            onChange={(e) =>
              updateField(
                "total_duration_hours",
                parseFloat(e.target.value) || 0
              )
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Geographic Coverage */}
      <div>
        <label className={labelClass}>Geographic Coverage</label>
        <input
          type="text"
          value={form.geographic_coverage}
          onChange={(e) => updateField("geographic_coverage", e.target.value)}
          placeholder="e.g. North America, Europe, Global"
          className={inputClass}
        />
      </div>

      {/* Annotation Types (tag input) */}
      <div>
        <label className={labelClass}>Annotation Types</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type and press Enter to add..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={addTag}
            className="shrink-0 px-3 py-2 text-xs font-mono rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-colors duration-150"
          >
            [add]
          </button>
        </div>
        {form.annotation_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.annotation_types.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 hover:text-[var(--error)] transition-colors duration-150"
                  aria-label={`Remove ${tag}`}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={form.is_published}
          onClick={() => updateField("is_published", !form.is_published)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
            form.is_published
              ? "bg-[var(--accent-primary)]"
              : "bg-neutral-600"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              form.is_published ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm font-mono text-[var(--text-secondary)]">
          {form.is_published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.slug || !form.category_id}
            className="px-4 py-2 text-sm font-mono rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {saving
              ? "saving..."
              : isEditMode
              ? "[save changes]"
              : "[create dataset]"}
          </button>
          <Link
            href="/admin/catalog"
            className="px-4 py-2 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
          >
            [cancel]
          </Link>
        </div>

        {/* Delete button (edit mode only) */}
        {isEditMode && (
          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[var(--error)]">
                  confirm delete?
                </span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 text-xs font-mono rounded-md bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20 hover:bg-[var(--error)]/20 disabled:opacity-50 transition-colors duration-150"
                >
                  {deleting ? "deleting..." : "[yes, delete]"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                >
                  [cancel]
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-mono text-[var(--error)]/60 hover:text-[var(--error)] transition-colors duration-150"
              >
                [delete dataset]
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
