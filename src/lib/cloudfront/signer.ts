import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

/**
 * CloudFront signed URL generation for private S3 content.
 *
 * When CLOUDFRONT_DOMAIN, CLOUDFRONT_KEY_PAIR_ID, and CLOUDFRONT_PRIVATE_KEY
 * environment variables are set, the presigner module routes through CloudFront
 * instead of generating S3 presigned URLs. This provides:
 *
 * - Edge caching (videos served from nearest CloudFront PoP)
 * - Better HTTP range request handling (faster seek/scrub)
 * - Lower latency for repeat views
 * - Synchronous URL generation (pure crypto, no network call)
 */

const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, "\n");

/**
 * Check whether CloudFront signing is configured.
 * When false, the presigner falls back to S3 presigned URLs.
 */
export function isCloudFrontConfigured(): boolean {
  return !!(KEY_PAIR_ID && DOMAIN && PRIVATE_KEY);
}

/**
 * Generate a CloudFront signed URL for a private S3 object.
 *
 * Uses a canned policy (single URL, expiry only). The `@aws-sdk/cloudfront-signer`
 * `getSignedUrl` is synchronous — pure RSA signing with no network call.
 *
 * @param objectKey - The S3 object key (e.g. "videos/abc/video.mp4")
 * @param expiresInSeconds - How long the URL is valid (default: 3600 = 1 hour)
 * @returns The signed CloudFront URL string
 */
export function getCloudFrontSignedUrl(
  objectKey: string,
  expiresInSeconds = 3600
): string {
  const url = `https://${DOMAIN}/${objectKey}`;
  const dateLessThan = new Date(
    Date.now() + expiresInSeconds * 1000
  ).toISOString();

  return getSignedUrl({
    url,
    keyPairId: KEY_PAIR_ID!,
    privateKey: PRIVATE_KEY!,
    dateLessThan,
  });
}
