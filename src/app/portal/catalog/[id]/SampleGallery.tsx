"use client";

import { useState, useCallback } from "react";
import type { DatasetSample } from "@/types/data-catalog";
import { GalleryCard } from "@/app/components/catalog/GalleryCard";
import { SampleDetailModal } from "./SampleDetailModal";

// =============================================================================
// SampleGallery -- Responsive gallery grid with hover video preview
// Client component for portal dataset detail page (US-007)
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SampleWithUrl {
  sample: DatasetSample;
  signedUrl: string;
}

interface SampleGalleryProps {
  samplesWithUrls: SampleWithUrl[];
}

// ---------------------------------------------------------------------------
// SampleGallery -- Main exported grid component
// ---------------------------------------------------------------------------

export function SampleGallery({ samplesWithUrls }: SampleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div>
      {/* Gallery grid -- responsive: 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {samplesWithUrls.map(({ sample, signedUrl }, index) => (
          <GalleryCard
            key={sample.id}
            sample={sample}
            signedUrl={signedUrl}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Detail split-view modal (US-008) */}
      {selectedIndex !== null && (
        <SampleDetailModal
          samples={samplesWithUrls}
          selectedIndex={selectedIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
