"use client";

import type { Clip } from "@/types/data-catalog";
import { SampleGallery } from "@/app/portal/catalog/[id]/SampleGallery";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface VideoShowcaseClientProps {
  clipsWithUrls: Array<{
    clip: Clip;
    signedUrl: string;
  }>;
  heading: string;
  subheading: string;
}

// ---------------------------------------------------------------------------
// Client component — wraps SampleGallery with public annotation endpoint
// ---------------------------------------------------------------------------

export function VideoShowcaseClient({
  clipsWithUrls,
  heading,
  subheading,
}: VideoShowcaseClientProps) {
  return (
    <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2
              className="mb-1 text-2xl font-semibold tracking-tight md:text-3xl"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                color: "#FFFFFF",
              }}
            >
              {heading}
            </h2>
            <p
              className="text-sm"
              style={{ color: "rgba(255, 255, 255, 0.55)" }}
            >
              {subheading}
            </p>
          </div>
          <p
            className="mt-2 shrink-0 text-xs sm:mt-0"
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              color: "#92B090",
            }}
          >
            Click any sample to explore &rarr;
          </p>
        </div>

        <SampleGallery
          clipsWithUrls={clipsWithUrls}
          annotationEndpoint="/api/public/s3-annotation"
        />
      </div>
    </section>
  );
}
