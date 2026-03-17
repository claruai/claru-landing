import { createClient } from "@supabase/supabase-js";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { DatasetSample } from "@/types/data-catalog";
import { DataPreviewClient } from "./DataPreviewClient";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DataPreviewProps {
  /** Sample IDs from the dataset_samples table */
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
// Server component — fetches samples + signs URLs, passes to client
// ---------------------------------------------------------------------------

export default async function DataPreview({
  sampleIds,
  heading = "Inside the Data",
  subheading = "Real samples with metadata and enrichment — exactly what gets delivered to your training pipeline.",
}: DataPreviewProps) {
  if (!sampleIds || sampleIds.length === 0) return null;

  const supabase = getSupabase();

  const { data: samples } = await supabase
    .from("dataset_samples")
    .select("*")
    .in("id", sampleIds)
    .not("s3_object_key", "is", null);

  if (!samples || samples.length === 0) return null;

  // Pre-sign all video URLs in parallel
  const enrichedSamples = (
    await Promise.all(
      samples.map(async (sample) => {
        const videoUrl = await getS3SignedUrl(sample.s3_object_key!, 3600);
        if (!videoUrl) return null;

        // Also sign annotation JSON if available
        let annotationUrl: string | null = null;
        if (sample.s3_annotation_key) {
          annotationUrl = await getS3SignedUrl(sample.s3_annotation_key, 3600);
        }

        return {
          sample: sample as DatasetSample,
          videoUrl,
          annotationUrl,
        };
      })
    )
  ).filter(
    (v): v is { sample: DatasetSample; videoUrl: string; annotationUrl: string | null } =>
      v !== null
  );

  if (enrichedSamples.length === 0) return null;

  return (
    <DataPreviewClient
      samples={enrichedSamples}
      heading={heading}
      subheading={subheading}
    />
  );
}
