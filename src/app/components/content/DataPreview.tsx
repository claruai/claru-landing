import { createClient } from "@supabase/supabase-js";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { Clip } from "@/types/data-catalog";
import { DataPreviewClient } from "./DataPreviewClient";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DataPreviewProps {
  /**
   * Clip IDs from the clips table.
   *
   * BREAKING CHANGE (US-006 migration): These must be clips.id UUIDs, NOT
   * legacy dataset_samples.id values. All callers (content pages) need their
   * hardcoded UUIDs remapped to the corresponding clip IDs.
   */
  sampleIds: string[];
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
}

// ---------------------------------------------------------------------------
// Supabase client (anon, no auth cookies)
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// Server component — fetches clips + signs URLs, passes to client
// ---------------------------------------------------------------------------

export default async function DataPreview({
  sampleIds,
  heading = "Inside the Data",
  subheading = "Real samples with metadata and enrichment — exactly what gets delivered to your training pipeline.",
}: DataPreviewProps) {
  if (!sampleIds || sampleIds.length === 0) return null;

  const supabase = getSupabase();

  const { data: clips } = await supabase
    .from("clips")
    .select("*")
    .in("id", sampleIds)
    .not("s3_key", "is", null);

  if (!clips || clips.length === 0) return null;

  // Pre-sign all video URLs in parallel
  const enrichedClips = (
    await Promise.all(
      clips.map(async (clip) => {
        const videoUrl = await getS3SignedUrl(clip.s3_key!, 3600);
        if (!videoUrl) return null;

        // Also sign annotation JSON if available
        let annotationUrl: string | null = null;
        if (clip.ann_annotation_key) {
          annotationUrl = await getS3SignedUrl(clip.ann_annotation_key, 3600);
        }

        return {
          clip: clip as Clip,
          videoUrl,
          annotationUrl,
        };
      })
    )
  ).filter(
    (v): v is { clip: Clip; videoUrl: string; annotationUrl: string | null } =>
      v !== null
  );

  if (enrichedClips.length === 0) return null;

  return (
    <DataPreviewClient
      samples={enrichedClips}
      heading={heading}
      subheading={subheading}
    />
  );
}
