"use client";

import { Download } from "lucide-react";

// =============================================================================
// DownloadLink -- Terminal-styled download anchor with file size display (US-009)
// Renders a simple download link for file types that have no inline preview
// (e.g. gzip archives, binary blobs).
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DownloadLinkProps {
  /** Signed URL or direct link to the file. */
  href: string;
  /** Original filename shown to the user and used for the download attribute. */
  filename: string;
  /** File size in bytes. Formatted to a human-readable string. */
  fileSizeBytes: number;
  /** MIME type label (e.g. "Gzip Archive"). Displayed as secondary info. */
  label?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format bytes into a human-readable string (e.g. 1.2 MB). */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DownloadLink({
  href,
  filename,
  fileSizeBytes,
  label,
}: DownloadLinkProps) {
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/60 hover:bg-[var(--bg-tertiary)]/80 transition-colors duration-200"
    >
      <Download className="w-4 h-4 flex-shrink-0" />
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="truncate">{filename}</span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {formatFileSize(fileSizeBytes)}
          {label && <> &middot; {label}</>}
        </span>
      </span>
    </a>
  );
}
