import { createClient } from "@supabase/supabase-js";
import { getS3SignedUrl } from "@/lib/s3/presigner";
import type { DatasetSample } from "@/types/data-catalog";
import { VideoShowcaseClient } from "./VideoShowcaseClient";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface VideoShowcaseProps {
  /** Sample IDs from the dataset_samples table */
  sampleIds: string[];
  /** Optional heading override */
  heading?: string;
  /** Optional subheading */
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

export default async function VideoShowcase({
  sampleIds,
  heading = "Sample Data",
  subheading = "Real examples from our capture and annotation pipelines.",
}: VideoShowcaseProps) {
  if (!sampleIds || sampleIds.length === 0) return null;

  const supabase = getSupabase();

  const { data: samples } = await supabase
    .from("dataset_samples")
    .select("*")
    .in("id", sampleIds)
    .not("s3_object_key", "is", null);

  if (!samples || samples.length === 0) return null;

  // Pre-sign all URLs in parallel
  const samplesWithUrls = (
    await Promise.all(
      samples.map(async (sample) => {
        const url = await getS3SignedUrl(sample.s3_object_key!, 3600);
        if (!url) return null;
        return {
          sample: sample as DatasetSample,
          signedUrl: url,
        };
      })
    )
  ).filter((v): v is { sample: DatasetSample; signedUrl: string } => v !== null);

  if (samplesWithUrls.length === 0) return null;

  return (
    <VideoShowcaseClient
      samplesWithUrls={samplesWithUrls}
      heading={heading}
      subheading={subheading}
    />
  );
}
