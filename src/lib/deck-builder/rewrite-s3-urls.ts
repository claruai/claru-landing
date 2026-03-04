// =============================================================================
// S3 URL Rewriting — Synchronous, No Signing
// Rewrites S3 references in HTML to use the /api/media/s3?key=KEY proxy.
// The proxy handles signing at request time, so URLs never expire.
// =============================================================================

const PROXY_PREFIX = '/api/media/s3?key=';

/**
 * Check if a URL is already using the proxy pattern.
 */
function isAlreadyProxied(url: string): boolean {
  return url.includes('/api/media/s3?key=');
}

/**
 * Rewrite all S3 references in HTML to use the media proxy.
 *
 * Handles these patterns:
 *   1. s3-placeholder.local/* URLs (from design agent)
 *   2. moonvalley-annotation-platform.s3.*.amazonaws.com/KEY?... (signed/raw S3)
 *   3. {{s3:key}} template tokens
 *   4. Double-signed S3 URLs (key extracted before first ?)
 *
 * Leaves unchanged:
 *   - /api/media/s3?key=... (already proxied)
 *   - Non-S3 URLs (CDN, data:, blob:, etc.)
 *
 * This function is SYNCHRONOUS — no network calls, no signing.
 * The proxy endpoint handles signing at request time.
 */
export function rewriteS3ToProxy(html: string): string {
  if (!html) return html;

  // Skip if nothing to rewrite (fast path)
  if (
    !html.includes('s3-placeholder.local') &&
    !html.includes('moonvalley-annotation-platform.s3') &&
    !html.includes('{{s3:')
  ) {
    return html;
  }

  let result = html;

  // Pattern 1: s3-placeholder.local/path/to/file.ext
  // From design agent: https://s3-placeholder.local/video_capture/completed/.../file.MP4
  result = result.replace(
    /https?:\/\/s3-placeholder\.local\/([^"'\s)]+)/g,
    (_match, key: string) => {
      return PROXY_PREFIX + encodeURIComponent(key);
    },
  );

  // Pattern 2: S3 bucket URLs — signed, unsigned, or double-signed
  // https://moonvalley-annotation-platform.s3.us-east-1.amazonaws.com/KEY?X-Amz-...
  // https://moonvalley-annotation-platform.s3.amazonaws.com/KEY?...
  // Extract the key (path after .com/) and discard query params (signatures)
  result = result.replace(
    /https:\/\/moonvalley-annotation-platform\.s3[^"'\s)]*?\.amazonaws\.com\/([^"'\s?)]+)\??[^"'\s)]*/g,
    (match, key: string) => {
      // Don't rewrite if already wrapped in proxy
      if (isAlreadyProxied(match)) return match;
      return PROXY_PREFIX + encodeURIComponent(key);
    },
  );

  // Pattern 3: {{s3:path/to/file}} template tokens
  result = result.replace(
    /\{\{s3:([^}]+)\}\}/g,
    (_match, key: string) => {
      return PROXY_PREFIX + encodeURIComponent(key.trim());
    },
  );

  return result;
}

/**
 * Extract S3 media keys referenced in HTML via proxy URLs.
 * Returns an array of unique S3 object keys.
 *
 * Useful for dependency tracking, cache pre-warming, and validating
 * that referenced media exists.
 */
export function extractMediaRefs(html: string): string[] {
  if (!html) return [];

  const keys = new Set<string>();
  const proxyRe = /\/api\/media\/s3\?key=([^"'\s&)]+)/g;
  let match;

  while ((match = proxyRe.exec(html)) !== null) {
    // Decode the key in case it was URL-encoded
    try {
      keys.add(decodeURIComponent(match[1]));
    } catch {
      // If decoding fails, use the raw value
      keys.add(match[1]);
    }
  }

  return Array.from(keys);
}
