"use client";

import type { DatasetSample } from "@/types/data-catalog";
import { GalleryCard } from "@/app/components/catalog/GalleryCard";

// ---------------------------------------------------------------------------
// SamplesGrid -- Visual grid view for admin sample browsing
// ---------------------------------------------------------------------------

interface SamplesGridProps {
  samples: DatasetSample[];
  onSelectSample: (sample: DatasetSample, index: number) => void;
}

function truncateKey(key: string | null | undefined, len: number): string {
  if (!key) return "";
  // Strip common S3 prefix for readability
  const cleaned = key.replace(/^video_capture\/completed\//, "");
  return cleaned.length > len ? cleaned.slice(0, len) + "…" : cleaned;
}

export default function SamplesGrid({ samples, onSelectSample }: SamplesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {samples.map((sample, index) => (
        <GalleryCard
          key={sample.id}
          sample={sample}
          signedUrl={sample.media_url ?? ""}
          index={index}
          onSelect={() => onSelectSample(sample, index)}
          footerLabel={truncateKey(sample.s3_object_key ?? sample.filename, 40)}
        />
      ))}
    </div>
  );
}
