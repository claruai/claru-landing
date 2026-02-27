import { getS3SignedUrl } from "./presigner";

/**
 * Fetch and parse an annotation JSON file from S3.
 *
 * Generates a presigned URL via {@link getS3SignedUrl}, fetches the object
 * content with a 10-second timeout, and parses the response as JSON.
 *
 * @param objectKey - The full S3 object key (e.g. "datasets/abc/annotation-data.json")
 * @returns The parsed JSON object, or null if any step fails
 */
export async function fetchAnnotationJson(
  objectKey: string
): Promise<Record<string, unknown> | null> {
  // Strip s3://bucket-name/ prefix if present — some keys are stored as full S3 URIs
  let cleanKey = objectKey;
  const s3UriMatch = cleanKey.match(/^s3:\/\/[^/]+\/(.+)$/);
  if (s3UriMatch) {
    cleanKey = s3UriMatch[1];
  }

  const url = await getS3SignedUrl(cleanKey);

  if (!url) {
    console.warn(
      "[s3/annotation] Failed to generate presigned URL for key:",
      objectKey
    );
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const resp = await fetch(url, { signal: controller.signal });

    if (!resp.ok) {
      console.warn(
        "[s3/annotation] Fetch failed with status %d for key: %s",
        resp.status,
        objectKey
      );
      return null;
    }

    const json: unknown = await resp.json();

    // Ensure the parsed result is a non-null object (not an array or primitive)
    if (json === null || typeof json !== "object" || Array.isArray(json)) {
      console.warn(
        "[s3/annotation] Unexpected JSON shape for key:",
        objectKey
      );
      return null;
    }

    return json as Record<string, unknown>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn(
        "[s3/annotation] Fetch timed out (10s) for key:",
        objectKey
      );
    } else {
      console.warn(
        "[s3/annotation] Fetch error for key:",
        objectKey,
        error instanceof Error ? error.message : error
      );
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
