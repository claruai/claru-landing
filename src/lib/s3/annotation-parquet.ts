import { getS3SignedUrl } from "./presigner";
import { parquetReadObjects } from "hyparquet";

/**
 * Fetch a parquet annotation file from S3 and parse it into JSON.
 *
 * Generates a presigned URL, fetches the parquet binary, parses it with
 * hyparquet, and returns a summarised JSON object. For action-data parquets
 * (CS2 etc.), the frame_data array is summarised rather than sent in full.
 *
 * @param objectKey - The full S3 object key ending in .parquet
 * @param bucketOverride - Optional bucket name for cross-bucket datasets
 * @returns Parsed annotation data as JSON, or null on failure
 */
export async function fetchAnnotationParquet(
  objectKey: string,
  bucketOverride?: string
): Promise<Record<string, unknown> | null> {
  // Strip s3://bucket-name/ prefix if present
  let cleanKey = objectKey;
  const s3UriMatch = cleanKey.match(/^s3:\/\/[^/]+\/(.+)$/);
  if (s3UriMatch) {
    cleanKey = s3UriMatch[1];
  }

  const url = await getS3SignedUrl(cleanKey, undefined, bucketOverride);

  if (!url) {
    console.warn(
      "[s3/annotation-parquet] Failed to generate presigned URL for key:",
      objectKey
    );
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const resp = await fetch(url, { signal: controller.signal });

    if (!resp.ok) {
      console.warn(
        "[s3/annotation-parquet] Fetch failed with status %d for key: %s",
        resp.status,
        objectKey
      );
      return null;
    }

    const buffer = await resp.arrayBuffer();
    const rows = await parquetReadObjects({ file: buffer });

    if (rows.length === 0) return {};

    const row = rows[0];
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
      if (key === "frame_data" && Array.isArray(value)) {
        // Summarise frame_data instead of sending all frames
        const frames = value as Record<string, unknown>[];
        const actionCounts: Record<string, number> = {};
        let framesWithExtrinsics = 0;

        for (const frame of frames) {
          const actions = String(frame.actions ?? "");
          for (const ch of actions) {
            if (ch !== "-") actionCounts[ch] = (actionCounts[ch] || 0) + 1;
          }
          if (frame.camera_extrinsics_defined) framesWithExtrinsics++;
        }

        result.frame_count = frames.length;
        result.action_distribution = actionCounts;
        result.frames_with_extrinsics = framesWithExtrinsics;
        result.extrinsics_coverage =
          frames.length > 0
            ? Number((framesWithExtrinsics / frames.length).toFixed(3))
            : 0;

        // Include first 3 frames as a preview
        result.frame_preview = frames.slice(0, 3);
      } else {
        // Convert BigInt to number for JSON serialisation
        result[key] = typeof value === "bigint" ? Number(value) : value;
      }
    }

    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn(
        "[s3/annotation-parquet] Fetch timed out (15s) for key:",
        objectKey
      );
    } else {
      console.warn(
        "[s3/annotation-parquet] Error for key:",
        objectKey,
        error instanceof Error ? error.message : error
      );
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
