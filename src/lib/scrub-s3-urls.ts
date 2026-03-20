/**
 * Shared utility to scrub S3 references from arbitrary JSON values.
 *
 * Catches:
 *  - s3://bucket/path
 *  - s3%3A%2F%2F (URL-encoded)
 *  - arn:aws:s3:::bucket/path (ARN format)
 *  - Presigned AWS URLs with X-Amz-Signature
 */

const S3_PATTERNS = [
  // s3://bucket/path
  /s3:\/\/[^\s"',)\]}>]+/gi,
  // URL-encoded: s3%3A%2F%2F
  /s3%3A%2F%2F[^\s"',)\]}>]+/gi,
  // ARN: arn:aws:s3:::bucket/path
  /arn:aws:s3:::[^\s"',)\]}>]+/gi,
  // Presigned AWS URLs (contain X-Amz-Signature)
  /https?:\/\/[^\s"',)\]}>]*X-Amz-Signature[^\s"',)\]}>]*/gi,
];

const REPLACEMENT = "[S3_REDACTED]";

function scrubString(str: string): string {
  let result = str;
  for (const pattern of S3_PATTERNS) {
    result = result.replace(pattern, REPLACEMENT);
  }
  return result;
}

/**
 * Keys whose values should NEVER be scrubbed — these are intentionally
 * returned presigned URLs, not internal S3 path leaks.
 */
const PRESERVED_KEYS = new Set([
  "signed_url",
  "source_video_url",
  "thumbnail_url",
  "representative_signed_urls",
]);

/**
 * Recursively walk any JSON-serializable value and surgically replace
 * S3 references with [S3_REDACTED].
 *
 * Keys listed in PRESERVED_KEYS are skipped — these are intentional
 * presigned delivery URLs, not internal path leaks.
 */
export function scrubS3Urls(value: unknown, _key?: string): unknown {
  // Skip preserved keys (presigned URLs we intentionally return)
  if (_key && PRESERVED_KEYS.has(_key)) return value;

  if (typeof value === "string") return scrubString(value);
  if (Array.isArray(value)) return value.map((v) => scrubS3Urls(v));
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = scrubS3Urls(v, k);
    }
    return result;
  }
  return value;
}
