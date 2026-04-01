"use client";

import { useState, useCallback, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import type { DatasetSample, Clip } from "@/types/data-catalog";
import type { ClipLike } from "@/app/components/catalog/GalleryCard";
import { GalleryCard } from "@/app/components/catalog/GalleryCard";
import { ClipDetailModal } from "./ClipDetailModal";
// Backward compat: re-export old modal name
export { ClipDetailModal as SampleDetailModal } from "./ClipDetailModal";

// =============================================================================
// SampleGallery -- Responsive gallery grid with hover video preview
// Client component for portal dataset detail page.
// Supports both legacy DatasetSample and unified Clip shapes.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** New clip-based shape. */
export interface ClipWithUrl {
  clip: Clip;
  signedUrl: string;
}

/**
 * @deprecated Use {@link ClipWithUrl} instead.
 * Kept for backward compatibility with VideoShowcaseClient, DatasetUploader.
 */
export interface SampleWithUrl {
  sample: DatasetSample;
  signedUrl: string;
}

interface SampleGalleryProps {
  /** New clip-based items. Takes precedence over samplesWithUrls. */
  clipsWithUrls?: ClipWithUrl[];
  /** Legacy sample-based items (backward compat for prospect pages, admin uploader). */
  samplesWithUrls?: SampleWithUrl[];
  /** Override the annotation endpoint (default: portal). */
  annotationEndpoint?: string;
  /** Auto-open a specific clip/sample by ID (from ?clip= or ?sample= query param). */
  initialClipId?: string;
  /** @deprecated Use initialClipId. */
  initialSampleId?: string;
  /** Dataset ID for analytics tracking. */
  datasetId?: string;
}

// ---------------------------------------------------------------------------
// Unified item shape used internally by the gallery
// ---------------------------------------------------------------------------

interface GalleryItem {
  id: string;
  clipLike: ClipLike;
  signedUrl: string;
  /** The full Clip object when available (for detail modal). */
  clip?: Clip;
  /** The full DatasetSample when available (for legacy detail modal). */
  sample?: DatasetSample;
}

// ---------------------------------------------------------------------------
// SampleGallery -- Main exported grid component
// ---------------------------------------------------------------------------

export function SampleGallery({
  clipsWithUrls,
  samplesWithUrls,
  annotationEndpoint,
  initialClipId,
  initialSampleId,
  datasetId,
}: SampleGalleryProps) {
  const posthog = usePostHog();
  // Build unified item list
  const items: GalleryItem[] = clipsWithUrls
    ? clipsWithUrls.map(({ clip, signedUrl }) => ({
        id: clip.id,
        clipLike: clip,
        signedUrl,
        clip,
      }))
    : (samplesWithUrls ?? []).map(({ sample, signedUrl }) => ({
        id: sample.id,
        clipLike: sample,
        signedUrl,
        sample,
      }));

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Auto-open a specific clip/sample when deep-linked
  const deepLinkId = initialClipId ?? initialSampleId;
  useEffect(() => {
    if (!deepLinkId) return;
    const idx = items.findIndex((item) => item.id === deepLinkId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (idx !== -1) setSelectedIndex(idx);
  }, [deepLinkId, items]);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    const item = items[index];
    if (item) {
      posthog?.capture("sample_opened", {
        clip_id: item.id,
        ...(datasetId ? { dataset_id: datasetId } : {}),
      });
    }
  }, [items, posthog, datasetId]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Build modal data from items
  const modalItems = items.map((item) => ({
    clip: item.clip,
    sample: item.sample,
    signedUrl: item.signedUrl,
  }));

  return (
    <div>
      {/* Gallery grid -- responsive: 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, index) => (
          <GalleryCard
            key={item.id}
            sample={item.clipLike}
            signedUrl={item.signedUrl}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Detail split-view modal */}
      {selectedIndex !== null && (
        <ClipDetailModal
          items={modalItems}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          {...(annotationEndpoint ? { annotationEndpoint } : {})}
        />
      )}
    </div>
  );
}
