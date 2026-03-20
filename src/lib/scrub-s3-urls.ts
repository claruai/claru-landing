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
 * Recursively walk any JSON-serializable value and surgically replace
 * S3 references with [S3_REDACTED].
 */
export function scrubS3Urls(value: unknown): unknown {
  if (typeof value === "string") return scrubString(value);
  if (Array.isArray(value)) return value.map(scrubS3Urls);
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = scrubS3Urls(v);
    }
    return result;
  }
  return value;
}
