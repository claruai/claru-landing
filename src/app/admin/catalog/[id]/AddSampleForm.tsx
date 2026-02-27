"use client";

import { useCallback, useState } from "react";
import { Loader2, Plus, AlertCircle, CheckCircle } from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AddSampleFormProps {
  datasetId: string;
  onSampleAdded: (sample: DatasetSample) => void;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isValidS3Uri(value: string): boolean {
  return (
    value.startsWith("s3://") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

function tryParseJson(value: string): { valid: boolean; parsed: Record<string, unknown> } {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "{}") {
    return { valid: true, parsed: {} };
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { valid: false, parsed: {} };
    }
    return { valid: true, parsed: parsed as Record<string, unknown> };
  } catch {
    return { valid: false, parsed: {} };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddSampleForm({ datasetId, onSampleAdded }: AddSampleFormProps) {
  const [s3Uri, setS3Uri] = useState("");
  const [annotationKey, setAnnotationKey] = useState("");
  const [specsKey, setSpecsKey] = useState("");
  const [metadataJson, setMetadataJson] = useState("{}");

  const [uriError, setUriError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // -----------------------------------------------------------------------
  // URI validation
  // -----------------------------------------------------------------------

  const validateUri = useCallback((value: string) => {
    if (value.trim() === "") {
      setUriError(null);
      return;
    }
    if (!isValidS3Uri(value.trim())) {
      setUriError("Must start with s3://, http://, or https://");
    } else {
      setUriError(null);
    }
  }, []);

  // -----------------------------------------------------------------------
  // JSON validation (on blur)
  // -----------------------------------------------------------------------

  const validateJson = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "{}") {
      setJsonError(null);
      return;
    }
    const { valid } = tryParseJson(trimmed);
    if (!valid) {
      setJsonError("Invalid JSON. Must be a valid JSON object.");
    } else {
      setJsonError(null);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Submit
  // -----------------------------------------------------------------------

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      setSubmitSuccess(false);

      // Validate S3 URI
      const trimmedUri = s3Uri.trim();
      if (!trimmedUri) {
        setUriError("S3 Object URI is required.");
        return;
      }
      if (!isValidS3Uri(trimmedUri)) {
        setUriError("Must start with s3://, http://, or https://");
        return;
      }

      // Validate JSON
      const { valid, parsed } = tryParseJson(metadataJson);
      if (!valid) {
        setJsonError("Invalid JSON. Must be a valid JSON object.");
        return;
      }

      setSubmitting(true);

      try {
        const res = await fetch(`/api/admin/catalog/${datasetId}/samples`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "s3_uri",
            s3_object_key: trimmedUri,
            s3_annotation_key: annotationKey.trim() || undefined,
            s3_specs_key: specsKey.trim() || undefined,
            metadata_json: JSON.stringify(parsed),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }

        const { sample } = await res.json();

        // Notify parent
        onSampleAdded(sample as DatasetSample);

        // Reset form
        setS3Uri("");
        setAnnotationKey("");
        setSpecsKey("");
        setMetadataJson("{}");
        setUriError(null);
        setJsonError(null);
        setSubmitSuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Failed to add sample");
      } finally {
        setSubmitting(false);
      }
    },
    [datasetId, s3Uri, annotationKey, specsKey, metadataJson, onSampleAdded]
  );

  // -----------------------------------------------------------------------
  // Shared input styles
  // -----------------------------------------------------------------------

  const inputBase =
    "w-full rounded-md bg-[var(--bg-secondary)] border px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors";
  const borderNormal = "border-[var(--border-subtle)] focus:border-[var(--accent-primary)]";
  const borderError = "border-[var(--error)] focus:border-[var(--error)]";

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* S3 Object URI */}
      <div>
        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          S3 Object URI <span className="text-[var(--error)]">*</span>
        </label>
        <input
          type="text"
          value={s3Uri}
          onChange={(e) => {
            setS3Uri(e.target.value);
            if (uriError && isValidS3Uri(e.target.value.trim())) {
              setUriError(null);
            }
          }}
          onBlur={() => validateUri(s3Uri)}
          placeholder="s3://bucket-name/path/to/file.mp4"
          className={`${inputBase} ${uriError ? borderError : borderNormal}`}
        />
        {uriError && (
          <p className="mt-1 flex items-center gap-1 text-xs font-mono text-[var(--error)]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {uriError}
          </p>
        )}
      </div>

      {/* S3 Annotation Key */}
      <div>
        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          S3 Annotation Key <span className="text-[var(--text-muted)]">(optional)</span>
        </label>
        <input
          type="text"
          value={annotationKey}
          onChange={(e) => setAnnotationKey(e.target.value)}
          placeholder="path/to/annotation.json"
          className={`${inputBase} ${borderNormal}`}
        />
      </div>

      {/* S3 Specs Key */}
      <div>
        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          S3 Specs Key <span className="text-[var(--text-muted)]">(optional)</span>
        </label>
        <input
          type="text"
          value={specsKey}
          onChange={(e) => setSpecsKey(e.target.value)}
          placeholder="path/to/specs.json"
          className={`${inputBase} ${borderNormal}`}
        />
      </div>

      {/* Metadata JSON */}
      <div>
        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          Metadata JSON <span className="text-[var(--text-muted)]">(optional)</span>
        </label>
        <textarea
          value={metadataJson}
          onChange={(e) => {
            setMetadataJson(e.target.value);
            if (jsonError) {
              const { valid } = tryParseJson(e.target.value);
              if (valid) setJsonError(null);
            }
          }}
          onBlur={() => validateJson(metadataJson)}
          rows={5}
          spellCheck={false}
          className={`${inputBase} resize-y ${jsonError ? borderError : borderNormal}`}
          style={{ fontFamily: "var(--font-mono)" }}
        />
        {jsonError && (
          <p className="mt-1 flex items-center gap-1 text-xs font-mono text-[var(--error)]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {jsonError}
          </p>
        )}
      </div>

      {/* Submit row */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {submitting ? "Adding..." : "Add Sample"}
        </button>

        {submitSuccess && (
          <span className="flex items-center gap-1 text-sm font-mono text-[var(--accent-primary)]">
            <CheckCircle className="w-4 h-4" />
            Sample added.
          </span>
        )}

        {submitError && (
          <span className="text-sm font-mono text-[var(--error)]">
            {submitError}
          </span>
        )}
      </div>
    </form>
  );
}
