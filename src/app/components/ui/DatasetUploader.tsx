"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Film,
  Image as ImageIcon,
  FileWarning,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";
import { SampleDetailModal } from "@/app/portal/catalog/[id]/SampleDetailModal";
import type { SampleWithUrl } from "@/app/portal/catalog/[id]/SampleGallery";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DatasetUploaderProps {
  datasetId: string;
  /** When this value changes, the component re-fetches the sample list. */
  refreshKey?: number;
}

interface SampleCardProps {
  sample: DatasetSample;
  index: number;
  isDeleting: boolean;
  isConfirmingDelete: boolean;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  /** Number of format compatibility issues reported for this sample */
  formatIssueCount: number;
  /** Called when the card is clicked to open the detail modal */
  onSelect: (index: number) => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "creating-record" | "done" | "error";
  error?: string;
}

// ---------------------------------------------------------------------------
// Accepted file types
// ---------------------------------------------------------------------------

const ACCEPTED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const ACCEPTED_IMAGE = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_TYPES = [...ACCEPTED_VIDEO, ...ACCEPTED_IMAGE];

const ACCEPT_STRING = [
  ".mp4",
  ".mov",
  ".webm",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
].join(",");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/** Truncate a URL to roughly `maxLen` characters with an ellipsis in the middle. */
function truncateUrl(url: string, maxLen = 40): string {
  if (url.length <= maxLen) return url;
  const keep = Math.floor((maxLen - 3) / 2);
  return `${url.slice(0, keep)}...${url.slice(-keep)}`;
}

/**
 * Extract the first N displayable key-value pairs from metadata_json.
 * Skips values that are objects/arrays.
 */
function getMetadataPreview(
  metadata: Record<string, unknown> | null | undefined,
  limit = 3
): Array<{ key: string; value: string }> {
  if (!metadata || typeof metadata !== "object") return [];
  const entries: Array<{ key: string; value: string }> = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (entries.length >= limit) break;
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue;
    entries.push({ key, value: String(value) });
  }
  return entries;
}

/** Determine if a URL likely points to a video based on extension or mime type. */
function isVideoUrl(url: string, mimeType: string): boolean {
  if (mimeType.startsWith("video/")) return true;
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext ?? "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DatasetUploader({ datasetId, refreshKey }: DatasetUploaderProps) {
  const [samples, setSamples] = useState<DatasetSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [formatIssueCounts, setFormatIssueCounts] = useState<Record<string, number>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // Fetch existing samples
  // -------------------------------------------------------------------------

  const fetchSamples = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/catalog/${datasetId}/samples`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSamples(data.samples ?? []);
      setFormatIssueCounts(data.formatIssueCounts ?? {});
    } catch (err) {
      console.error("[DatasetUploader] Failed to fetch samples:", err);
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  // Re-fetch when refreshKey changes (triggered by external sample additions)
  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) {
      fetchSamples();
    }
  }, [refreshKey, fetchSamples]);

  // -------------------------------------------------------------------------
  // Upload logic
  // -------------------------------------------------------------------------

  const uploadFile = useCallback(
    async (file: File) => {
      const uploadId = crypto.randomUUID();
      const entry: UploadingFile = {
        id: uploadId,
        file,
        progress: 0,
        status: "uploading",
      };
      setUploading((prev) => [...prev, entry]);

      try {
        // Step 1: Get signed upload URL
        const urlRes = await fetch(
          `/api/admin/catalog/${datasetId}/samples`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "get-upload-url", filename: file.name }),
          }
        );

        if (!urlRes.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { signedUrl, token, storagePath } = await urlRes.json();

        // Step 2: Upload directly to Supabase Storage with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploading((prev) =>
                prev.map((u) =>
                  u.id === uploadId ? { ...u, progress: pct } : u
                )
              );
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Upload failed")));
          xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.setRequestHeader("x-upsert", "true");
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
          xhr.send(file);
        });

        // Step 3: Create DB record
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: "creating-record" } : u
          )
        );

        // Attempt to extract video duration client-side
        let durationSeconds = 0;
        if (isVideo(file.type)) {
          durationSeconds = await getVideoDuration(file).catch(() => 0);
        }

        const recordRes = await fetch(
          `/api/admin/catalog/${datasetId}/samples`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storage_path: storagePath,
              filename: file.name,
              mime_type: file.type,
              file_size: file.size,
              duration_seconds: durationSeconds,
            }),
          }
        );

        if (!recordRes.ok) {
          throw new Error("Failed to create sample record");
        }

        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: "done", progress: 100 } : u
          )
        );

        // Refresh sample list
        await fetchSamples();

        // Remove completed upload from the list after a short delay
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== uploadId));
        }, 2000);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown upload error";
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: "error", error: message } : u
          )
        );
      }
    },
    [datasetId, fetchSamples]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          console.warn(`[DatasetUploader] Rejected file type: ${file.type}`);
          continue;
        }
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  // -------------------------------------------------------------------------
  // Delete logic (with confirmation)
  // -------------------------------------------------------------------------

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteSample = useCallback(
    async (sampleId: string) => {
      setDeletingIds((prev) => new Set(prev).add(sampleId));
      try {
        const res = await fetch(
          `/api/admin/catalog/${datasetId}/samples/${sampleId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Delete failed");
        setSamples((prev) => prev.filter((s) => s.id !== sampleId));
      } catch (err) {
        console.error("[DatasetUploader] Delete failed:", err);
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(sampleId);
          return next;
        });
        setConfirmDeleteId(null);
      }
    },
    [datasetId]
  );

  // -------------------------------------------------------------------------
  // Drag & drop handlers
  // -------------------------------------------------------------------------

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    },
    [handleFiles]
  );

  const dismissUpload = useCallback((uploadId: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== uploadId));
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          relative flex flex-col items-center justify-center gap-3
          rounded-lg border-2 border-dashed p-8 cursor-pointer
          transition-colors duration-200 font-mono text-sm
          ${
            isDragOver
              ? "border-[var(--accent-primary)] bg-[var(--accent-glow)]"
              : "border-[var(--border-medium)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-tertiary)]"
          }
        `}
      >
        <Upload
          className={`w-8 h-8 ${
            isDragOver
              ? "text-[var(--accent-primary)]"
              : "text-[var(--text-muted)]"
          }`}
        />
        <p className="text-[var(--text-secondary)]">
          {isDragOver
            ? "Drop files to upload"
            : "Drag & drop files here, or click to browse"}
        </p>
        <p className="text-[var(--text-muted)] text-xs">
          Accepts: MP4, MOV, WebM, PNG, JPEG, WebP -- No size limit
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_STRING}
          onChange={onFileChange}
          className="hidden"
          aria-label="Upload dataset sample files"
        />
      </div>

      {/* Active uploads */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Uploading
          </p>
          {uploading.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 py-3 font-mono text-sm"
            >
              {u.status === "error" ? (
                <FileWarning className="w-4 h-4 text-[var(--error)] shrink-0" />
              ) : u.status === "done" ? (
                <span className="text-[var(--accent-primary)] shrink-0">ok</span>
              ) : (
                <Loader2 className="w-4 h-4 text-[var(--accent-primary)] animate-spin shrink-0" />
              )}

              <span className="truncate text-[var(--text-secondary)] flex-1 min-w-0">
                {u.file.name}
              </span>
              <span className="text-[var(--text-muted)] shrink-0">
                {formatBytes(u.file.size)}
              </span>

              {/* Progress bar */}
              {(u.status === "uploading" || u.status === "creating-record") && (
                <div className="w-32 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}

              {u.status === "creating-record" && (
                <span className="text-xs text-[var(--text-muted)] shrink-0">
                  saving...
                </span>
              )}

              {u.status === "error" && (
                <>
                  <span className="text-xs text-[var(--error)] shrink-0 truncate max-w-[200px]">
                    {u.error}
                  </span>
                  <button
                    onClick={() => dismissUpload(u.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                    aria-label="Dismiss error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sample grid */}
      <div>
        <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">
          {loading
            ? "Samples ..."
            : `${samples.length} sample${samples.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)] py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading samples...
          </div>
        ) : samples.length === 0 ? (
          <p className="text-sm font-mono text-[var(--text-muted)] py-4">
            No samples uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {samples.map((sample, index) => (
              <SampleCard
                key={sample.id}
                sample={sample}
                index={index}
                isDeleting={deletingIds.has(sample.id)}
                isConfirmingDelete={confirmDeleteId === sample.id}
                onRequestDelete={() => setConfirmDeleteId(sample.id)}
                onConfirmDelete={() => deleteSample(sample.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
                formatIssueCount={formatIssueCounts[sample.id] ?? 0}
                onSelect={setSelectedIndex}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedIndex !== null && (() => {
        const samplesWithUrls: SampleWithUrl[] = samples.map((s) => ({
          sample: s,
          signedUrl: s.media_url || "",
        }));
        return (
          <SampleDetailModal
            samples={samplesWithUrls}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNavigate={setSelectedIndex}
            annotationEndpoint="/api/admin/s3-annotation"
          />
        );
      })()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SampleCard -- visual card for each sample in the grid
// ---------------------------------------------------------------------------

function SampleCard({
  sample,
  index,
  isDeleting,
  isConfirmingDelete,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  formatIssueCount,
  onSelect,
}: SampleCardProps) {
  const mediaUrl = sample.media_url || "";
  const isSampleVideo = isVideoUrl(mediaUrl, sample.mime_type);
  const metadataEntries = getMetadataPreview(sample.metadata_json);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Lazy-load: only set video src when card enters the viewport vicinity
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(card);
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden transition-colors hover:border-[var(--border-medium)] cursor-pointer"
      onClick={() => onSelect(index)}
    >
      {/* Thumbnail / poster */}
      <div className="relative aspect-video bg-[var(--bg-tertiary)] flex items-center justify-center overflow-hidden">
        {/* Shimmer placeholder while not in view */}
        {!isInView && (
          <div className="absolute inset-0 animate-pulse bg-[var(--bg-tertiary)]" />
        )}

        {mediaUrl && isInView ? (
          isSampleVideo ? (
            <video
              src={mediaUrl}
              preload="metadata"
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={mediaUrl}
              alt={sample.filename}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        ) : !isInView ? null : isSampleVideo ? (
          <Film className="w-8 h-8 text-[var(--text-muted)]" />
        ) : (
          <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
        )}

        {/* Type badge */}
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/60 text-[var(--text-secondary)] backdrop-blur-sm">
          {isSampleVideo ? "video" : "image"}
        </span>

        {/* Format issue warning badge */}
        {formatIssueCount > 0 && (
          <span
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 border border-orange-500/40 text-orange-400 backdrop-blur-sm cursor-default"
            title={`${formatIssueCount} format issue${formatIssueCount !== 1 ? "s" : ""} reported`}
          >
            <AlertTriangle className="w-3 h-3" />
            {formatIssueCount}
          </span>
        )}

        {/* Delete button */}
        <div className="absolute top-1.5 right-1.5" onClick={(e) => e.stopPropagation()}>
          {isConfirmingDelete ? (
            <div className="flex items-center gap-1 rounded bg-black/80 backdrop-blur-sm p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDelete();
                }}
                disabled={isDeleting}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                aria-label="Confirm delete"
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "yes"
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelDelete();
                }}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                aria-label="Cancel delete"
              >
                no
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded bg-black/60 backdrop-blur-sm text-[var(--text-muted)] hover:text-red-400 transition-all"
              aria-label={`Delete ${sample.filename}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5 space-y-1.5">
        {/* Truncated media URL */}
        {mediaUrl && (
          <p
            className="text-[11px] font-mono text-[var(--text-muted)] truncate"
            title={mediaUrl}
          >
            {truncateUrl(mediaUrl)}
          </p>
        )}

        {/* Metadata key-value preview */}
        {metadataEntries.length > 0 && (
          <div className="space-y-0.5">
            {metadataEntries.map(({ key, value }) => (
              <div
                key={key}
                className="flex items-baseline gap-1.5 text-[11px] font-mono leading-tight"
              >
                <span className="text-[var(--text-muted)] shrink-0">
                  {key}:
                </span>
                <span className="text-[var(--text-secondary)] truncate">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Fallback: show filename if no URL and no metadata */}
        {!mediaUrl && metadataEntries.length === 0 && (
          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {sample.filename}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility: extract video duration from a File using an in-memory <video>
// ---------------------------------------------------------------------------

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };
  });
}
