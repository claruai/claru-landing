"use client";

import { useState, useEffect } from "react";
import { Archive, FileJson, Table, File, Download, Loader2, Keyboard, Mouse } from "lucide-react";
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

// ---------------------------------------------------------------------------
// Input Stream Viewer -- renders gz keyboard/mouse data inline
// ---------------------------------------------------------------------------

interface InputEvent {
  timeUs: number;
  event: string;
  value: string;
  device?: string;
}

function InputStreamViewer({ objectId, apiBase }: { objectId: string; apiBase?: string }) {
  const [events, setEvents] = useState<InputEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Fetch gz file via our proxy API to avoid CORS issues with CloudFront
        const proxyRes = await fetch(`/api/portal/s3-proxy?key=${encodeURIComponent(objectId)}`);
        if (!proxyRes.ok) throw new Error(`Failed to fetch: ${proxyRes.status}`);

        const buffer = await proxyRes.arrayBuffer();

        // Empty or near-empty gz files (< 30 bytes = just gzip header)
        if (buffer.byteLength < 30) {
          setEvents([]);
          return;
        }

        const ds = new DecompressionStream("gzip");
        const decompressed = new Response(
          new Blob([buffer]).stream().pipeThrough(ds)
        );
        const text = await decompressed.text();

        if (!text.trim()) {
          setEvents([]);
          return;
        }

        const parsed = text
          .trim()
          .split("\n")
          .filter((l) => l.trim())
          .map((l) => {
            try { return JSON.parse(l) as InputEvent; }
            catch { return null; }
          })
          .filter((e): e is InputEvent => e !== null);

        setEvents(parsed);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        console.error("[InputStreamViewer]", msg, e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [objectId, apiBase]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 justify-center">
        <Loader2 className="w-3 h-3 animate-spin text-[var(--accent-primary)]" />
        <span className="font-mono text-xs text-[var(--text-muted)]">Loading input stream...</span>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="py-3 text-center">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {error ?? "No input data available"}
        </span>
      </div>
    );
  }

  // Compute stats
  const keydowns = events.filter((e) => e.event === "keydown");
  const mousedowns = events.filter((e) => e.event === "mousedown");
  const mousemoves = events.filter((e) => e.event === "mousemove");
  const uniqueKeys = new Set(keydowns.map((e) => e.value));
  const durationMs = (events[events.length - 1].timeUs - events[0].timeUs) / 1000;
  const durationSec = Math.round(durationMs / 1000);

  // Show first N events
  const displayEvents = showAll ? events.slice(0, 500) : events.slice(0, 30);

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-[var(--accent-primary)]">
          <Keyboard className="w-3 h-3" />
          <span>{keydowns.length} key presses</span>
        </div>
        <div className="flex items-center gap-1 text-[var(--accent-primary)]">
          <Mouse className="w-3 h-3" />
          <span>{mousedowns.length} clicks</span>
        </div>
        <span className="text-[var(--text-muted)]">{mousemoves.length} mouse moves</span>
        <span className="text-[var(--text-muted)]">{uniqueKeys.size} unique keys</span>
        <span className="text-[var(--text-muted)]">{durationSec}s duration</span>
      </div>

      {/* Unique keys used */}
      <div className="flex flex-wrap gap-1">
        {Array.from(uniqueKeys).sort().map((key) => (
          <span
            key={key}
            className="inline-block px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
          >
            {key}
          </span>
        ))}
      </div>

      {/* Event stream */}
      <div className="max-h-[300px] overflow-y-auto rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <table className="w-full text-[10px] font-mono">
          <thead className="sticky top-0 bg-[var(--bg-secondary)]">
            <tr className="text-[var(--text-muted)]">
              <th className="text-left px-2 py-1.5">Time</th>
              <th className="text-left px-2 py-1.5">Event</th>
              <th className="text-left px-2 py-1.5">Value</th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((ev, i) => {
              const timeSec = ((ev.timeUs - events[0].timeUs) / 1_000_000).toFixed(2);
              const isKey = ev.event === "keydown" || ev.event === "keyup";
              const isMouse = ev.event === "mousedown" || ev.event === "mouseup";
              return (
                <tr
                  key={i}
                  className={`border-t border-[var(--border-subtle)] ${
                    isKey ? "text-[var(--accent-primary)]" :
                    isMouse ? "text-[var(--warning,#e0a040)]" :
                    "text-[var(--text-muted)]"
                  }`}
                >
                  <td className="px-2 py-1 tabular-nums opacity-60">{timeSec}s</td>
                  <td className="px-2 py-1">{ev.event}</td>
                  <td className="px-2 py-1">{ev.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {events.length > 30 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[10px] font-mono text-[var(--accent-primary)] hover:underline"
        >
          Show more ({events.length.toLocaleString()} total events) →
        </button>
      )}
      {showAll && events.length > 500 && (
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Showing first 500 of {events.length.toLocaleString()} events
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner list component (needs hooks so it's split out)
// ---------------------------------------------------------------------------

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
        const isGz = filename.toLowerCase().endsWith(".gz");

        const { label, icon: Icon } = getFileTypeMeta(filename);
        const state: DownloadState = downloadStates[objectId] ?? "idle";
        const key = objectId || String(idx);

        // For .gz files, show inline input stream viewer
        if (isGz) {
          return (
            <div
              key={key}
              className="border border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                <span className="font-mono text-xs text-[var(--accent-primary)]">{label}</span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">Keyboard/mouse capture data</span>
              </div>
              <InputStreamViewer objectId={objectId} apiBase={apiBase} />
            </div>
          );
        }

        // For other files, show download button
        const truncatedFilename =
          filename.length > 40 ? `${filename.slice(0, 37)}...` : filename;
        const rawSize = (file.attributes as Record<string, unknown> | undefined)?.media;
        const track = (rawSize as Record<string, unknown> | undefined)?.track;
        const firstTrack = Array.isArray(track) ? (track[0] as Record<string, unknown> | undefined) : undefined;
        const rawFileSize = firstTrack?.FileSize as string | number | undefined;
        const formattedSize = formatFileSize(rawFileSize);

        return (
          <div
            key={key}
            className="flex items-center justify-between gap-3 border border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-lg p-3"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <Icon className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-mono text-xs text-[var(--accent-primary)] leading-tight">
                  {label}
                </div>
                <div
                  className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5 truncate"
                  title={filename}
                >
                  {truncatedFilename}
                </div>
              </div>
            </div>
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
