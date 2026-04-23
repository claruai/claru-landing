/**
 * Client-side Reddit Pixel helper + signup CTA link builder.
 *
 * The LP at /collect/ugc-video-jobs is a top-of-funnel destination. The
 * actual signup form lives at app.claru.ai (different subdomain → cookies
 * do not carry). We propagate UTM attribution through the CTA URL itself.
 *
 * - `trackRedditEvent(...)` is a safe wrapper around `window.rdt(...)` —
 *   no-op if the pixel script hasn't loaded (adblock / dev without a
 *   pixel id set).
 * - `getCtaUrl(...)` builds the `app.claru.ai/signup` URL with all UTMs
 *   from the current LP URL forwarded as query params.
 */

declare global {
  interface Window {
    rdt?: (...args: unknown[]) => void;
  }
}

type RedditStandardEvent =
  | "PageVisit"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "AddToWishlist"
  | "Purchase"
  | "Lead"
  | "SignUp"
  | "Custom";

/**
 * Fire a Reddit Pixel event. Safe no-op if pixel is not present.
 *
 * @param name - Standard Reddit event name, or "Custom" for custom events.
 * @param customEventName - Required when `name === "Custom"`.
 * @param customData - Optional event metadata (e.g. value, currency).
 */
export function trackRedditEvent(
  name: RedditStandardEvent | string,
  customEventName?: string,
  customData?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.rdt !== "function") return;

  try {
    if (name === "Custom" && customEventName) {
      window.rdt("track", "Custom", {
        customEventName,
        ...(customData ?? {}),
      });
    } else if (customData) {
      window.rdt("track", name, customData);
    } else {
      window.rdt("track", name);
    }
  } catch {
    // Tracking must never break the page.
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Build the app.claru.ai signup URL, forwarding all UTMs from the LP's
 * query string plus a stable `source` hint so app.claru.ai knows which
 * LP sent the user.
 *
 * @param baseUrl - Destination URL (usually `https://app.claru.ai/signup`).
 * @param search - LP's `window.location.search` (or "") at click time.
 * @param source - Identifier for this LP. Default: "claru-landing-ugc-video-jobs".
 */
export function getCtaUrl(
  baseUrl: string,
  search: string,
  source: string = "claru-landing-ugc-video-jobs",
): string {
  const incoming = new URLSearchParams(search || "");
  const out = new URL(baseUrl);

  for (const key of UTM_KEYS) {
    const v = incoming.get(key);
    if (v) out.searchParams.set(key, v);
  }

  // Preserve Reddit click id for server-side CAPI on app.claru.ai.
  const rdtCid = incoming.get("rdt_cid");
  if (rdtCid) out.searchParams.set("rdt_cid", rdtCid);

  out.searchParams.set("source", source);
  return out.toString();
}
