// =============================================================================
// File Renderers Registry -- MIME-to-renderer mapping (US-009)
// Maps MIME types to renderer component names for extensible file handling.
// SampleDetailModal uses the component string to choose which renderer to show.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileRenderer {
  /** Component name used by the consuming component to select the renderer. */
  component: string;
  /** Human-readable label for the file type. */
  label: string;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Static record mapping exact MIME types to their renderer definitions.
 * Add new entries here to support additional file types.
 */
export const FILE_RENDERERS: Record<string, FileRenderer> = {
  "video/mp4": { component: "VideoPlayer", label: "MP4 Video" },
  "video/quicktime": { component: "VideoPlayer", label: "QuickTime Video" },
  "video/webm": { component: "VideoPlayer", label: "WebM Video" },
  "application/json": {
    component: "MetadataJsonViewer",
    label: "JSON Metadata",
  },
  "application/gzip": { component: "DownloadLink", label: "Gzip Archive" },
  "image/jpeg": { component: "ImageViewer", label: "JPEG Image" },
  "image/png": { component: "ImageViewer", label: "PNG Image" },
};

// ---------------------------------------------------------------------------
// Wildcard fallbacks -- keyed by the type prefix (e.g. "video")
// ---------------------------------------------------------------------------

const WILDCARD_RENDERERS: Record<string, FileRenderer> = {
  video: { component: "VideoPlayer", label: "Video" },
  image: { component: "ImageViewer", label: "Image" },
};

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

/**
 * Resolve a MIME type to its renderer definition.
 *
 * Resolution order:
 *  1. Exact match in FILE_RENDERERS (e.g. "video/mp4")
 *  2. Wildcard prefix match (e.g. "video/*" matches any "video/..." type)
 *  3. Returns null if no renderer is registered
 */
export function getRendererForMime(mimeType: string): FileRenderer | null {
  // 1. Exact match
  const exact = FILE_RENDERERS[mimeType];
  if (exact) return exact;

  // 2. Wildcard prefix match (take the part before "/")
  const prefix = mimeType.split("/")[0];
  const wildcard = WILDCARD_RENDERERS[prefix];
  if (wildcard) return wildcard;

  // 3. No match
  return null;
}
