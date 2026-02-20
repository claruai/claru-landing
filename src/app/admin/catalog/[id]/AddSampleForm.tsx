"use client";

import { useCallback, useState } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
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

function isValidUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
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
  const [mediaUrl, setMediaUrl] = useState("");
  const [metadataJson, setMetadataJson] = useState("{}");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // -----------------------------------------------------------------------
  // URL validation
  // -----------------------------------------------------------------------

  const validateUrl = useCallback((value: string) => {
    if (value.trim() === "") {
      setUrlError(null);
      return;
    }
    if (!isValidUrl(value.trim())) {
      setUrlError("URL must start with http:// or https://");
    } else {
      setUrlError(null);
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

      // Validate URL
      const trimmedUrl = mediaUrl.trim();
      if (!trimmedUrl) {
        setUrlError("Media URL is required.");
        return;
      }
      if (!isValidUrl(trimmedUrl)) {
        setUrlError("URL must start with http:// or https://");
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
            media_url: trimmedUrl,
            metadata_json: parsed,
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
        setMediaUrl("");
        setMetadataJson("{}");
        setUrlError(null);
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
    [datasetId, mediaUrl, metadataJson, onSampleAdded]
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Media URL */}
      <div>
        <label className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          Media URL <span className="text-[var(--error)]">*</span>
        </label>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => {
            setMediaUrl(e.target.value);
            // Clear error as user types if it becomes valid
            if (urlError && isValidUrl(e.target.value.trim())) {
              setUrlError(null);
            }
          }}
          onBlur={() => validateUrl(mediaUrl)}
          placeholder="https://storage.example.com/video.mp4"
          className={`w-full rounded-md bg-[var(--bg-secondary)] border px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors ${
            urlError
              ? "border-[var(--error)] focus:border-[var(--error)]"
              : "border-[var(--border-subtle)] focus:border-[var(--accent-primary)]"
          }`}
        />
        {urlError && (
          <p className="mt-1 flex items-center gap-1 text-xs font-mono text-[var(--error)]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {urlError}
          </p>
        )}
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
            // Clear error as user types if it becomes valid
            if (jsonError) {
              const { valid } = tryParseJson(e.target.value);
              if (valid) setJsonError(null);
            }
          }}
          onBlur={() => validateJson(metadataJson)}
          rows={5}
          spellCheck={false}
          className={`w-full rounded-md bg-[var(--bg-secondary)] border px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors resize-y ${
            jsonError
              ? "border-[var(--error)] focus:border-[var(--error)]"
              : "border-[var(--border-subtle)] focus:border-[var(--accent-primary)]"
          }`}
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
          <span className="text-sm font-mono text-[var(--accent-primary)]">
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
