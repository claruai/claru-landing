"use client";

import { useState } from "react";
import { Archive, FileJson, Table, File, Download, Loader2 } from "lucide-react";
import type { DataPanelProps } from "./DataPanelRegistry";

// =============================================================================
// DataFilesPanel -- Shows non-video files attached to a sample (from annotation
// files[] array). Each file can be downloaded via a presigned S3 URL fetched
// from the appropriate API route (portal or admin).
// =============================================================================

// ---------------------------------------------------------------------------
// File type metadata by extension
// ---------------------------------------------------------------------------

interface FileTypeMeta {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getFileTypeMeta(filename: string): FileTypeMeta {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".gz")) {
    return { label: "Input Stream", description: "Keyboard/mouse capture data", icon: Archive };
  }
  if (lower.endsWith(".json")) {
    return { label: "JSON Data", description: "Annotation metadata", icon: FileJson };
  }
  if (lower.endsWith(".csv")) {
    return { label: "CSV Data", description: "Tabular data", icon: Table };
  }
  return { label: "Data File", description: "Attached file", icon: File };
}

// ---------------------------------------------------------------------------
// File size formatting
// ---------------------------------------------------------------------------

function formatFileSize(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const bytes = Number(raw);
  if (isNaN(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Video extension check
// ---------------------------------------------------------------------------

function isVideoFile(objectId: string): boolean {
  const lower = objectId.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
}

// ---------------------------------------------------------------------------
// Download state type
// ---------------------------------------------------------------------------

type DownloadState = "idle" | "loading" | "error";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataFilesPanel({ data, sampleId, apiBase }: DataPanelProps) {
  const rawFiles = data.files;

  if (!Array.isArray(rawFiles)) return null;

  const dataFiles = (rawFiles as Array<Record<string, unknown>>).filter((f) => {
    const oid = String(f.objectId ?? "").toLowerCase();
    return !isVideoFile(oid);
  });

  if (dataFiles.length === 0) return null;

  return <DataFilesList files={dataFiles} sampleId={sampleId} apiBase={apiBase} />;
}

// ---------------------------------------------------------------------------
// Inner list component (needs hooks so it's split out)
// ---------------------------------------------------------------------------

interface DataFilesListProps {
  files: Array<Record<string, unknown>>;
  sampleId: string;
  apiBase?: string;
}

function DataFilesList({ files, apiBase }: DataFilesListProps) {
  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadState>>({});

  const handleDownload = async (objectId: string) => {
    setDownloadStates((prev) => ({ ...prev, [objectId]: "loading" }));

    const base = apiBase ?? "/api/portal";

    try {
      const res = await fetch(`${base}/s3-signed-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey: objectId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as { signedUrl?: string };
      if (!json.signedUrl) {
        throw new Error("No signed URL in response");
      }

      window.open(json.signedUrl, "_blank");
      setDownloadStates((prev) => ({ ...prev, [objectId]: "idle" }));
    } catch {
      setDownloadStates((prev) => ({ ...prev, [objectId]: "error" }));
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [objectId]: "idle" }));
      }, 3000);
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file, idx) => {
        const objectId = String(file.objectId ?? "");
        const filename = objectId.split("/").pop() ?? objectId;
        const truncatedFilename =
          filename.length > 40 ? `${filename.slice(0, 37)}...` : filename;

        const rawSize = (file.attributes as Record<string, unknown> | undefined)?.media;
        const track = (rawSize as Record<string, unknown> | undefined)?.track;
        const firstTrack = Array.isArray(track) ? (track[0] as Record<string, unknown> | undefined) : undefined;
        const rawFileSize = firstTrack?.FileSize as string | number | undefined;
        const formattedSize = formatFileSize(rawFileSize);

        const { label, description, icon: Icon } = getFileTypeMeta(filename);
        const state: DownloadState = downloadStates[objectId] ?? "idle";

        const key = objectId || String(idx);

        return (
          <div
            key={key}
            className="flex items-center justify-between gap-3 border border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-lg p-3"
          >
            {/* Left: icon + metadata + filename */}
            <div className="flex items-start gap-2.5 min-w-0">
              <Icon className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-mono text-xs text-[var(--accent-primary)] leading-tight">
                  {label}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-muted)] leading-tight">
                  {description}
                </div>
                <div
                  className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5 truncate"
                  title={filename}
                >
                  {truncatedFilename}
                </div>
              </div>
            </div>

            {/* Right: size badge + download button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {formattedSize && (
                <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
                  {formattedSize}
                </span>
              )}
              <button
                onClick={() => handleDownload(objectId)}
                disabled={state === "loading"}
                className={`
                  inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md
                  font-mono text-[10px] border transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[var(--accent-primary)]/60
                  ${
                    state === "error"
                      ? "border-[var(--error)]/40 text-[var(--error)] bg-[var(--error)]/10"
                      : state === "loading"
                      ? "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-tertiary)] cursor-not-allowed"
                      : "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-tertiary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40"
                  }
                `}
                aria-label={`Download ${filename}`}
              >
                {state === "loading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                {state === "error" ? "Error" : state === "loading" ? "..." : "Download"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
