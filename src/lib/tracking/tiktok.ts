/**
 * Client-side TikTok Pixel helper.
 *
 * Follows TikTok's recommended event schema:
 *   - identify() with SHA-256 hashed email / phone / external_id
 *   - track() with a `contents` array (content_id, content_type,
 *     content_name) + optional `value` + `currency`
 *
 * Safe no-op when `window.ttq` is absent (pixel not loaded, adblock,
 * or NEXT_PUBLIC_TIKTOK_PIXEL_ID not set).
 *
 * Docs: https://business-api.tiktok.com/portal/docs?id=1739585702930946
 */

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      identify?: (params: Record<string, unknown>) => void;
      page?: () => void;
    } & ((...args: unknown[]) => void);
  }
}

const VISITOR_ID_KEY = "claru_visitor_id";

/**
 * Stable per-browser id, persisted in localStorage. Used as TikTok's
 * `external_id` so ViewContent → form-submit stitches to one user
 * even pre-PII. SSR-safe (returns "" if window is absent).
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/**
 * SHA-256 → lowercase hex. Web Crypto only — no polyfill.
 * Returns empty string if value is missing or crypto.subtle is unavailable.
 * TikTok expects values trimmed + lowercased BEFORE hashing.
 */
export async function sha256Hex(value: string | undefined | null): Promise<string> {
  if (!value) return "";
  if (typeof window === "undefined" || !window.crypto?.subtle) return "";
  try {
    const normalized = value.trim().toLowerCase();
    const bytes = new TextEncoder().encode(normalized);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "";
  }
}

type TikTokStandardEvent =
  | "ViewContent"
  | "ClickButton"
  | "Search"
  | "AddToWishlist"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "PlaceAnOrder"
  | "CompletePayment"
  | "Contact"
  | "Download"
  | "SubmitForm"
  | "CompleteRegistration"
  | "Subscribe"
  | "Lead";

export type TikTokContent = {
  content_id: string;
  content_type?: "product" | "product_group";
  content_name?: string;
};

export type TikTokTrackParams = {
  contents?: TikTokContent[];
  value?: number;
  currency?: string;
  event_id?: string;
  /** Extra properties passed through verbatim (e.g. UTMs). */
  extra?: Record<string, unknown>;
};

/**
 * Fire a TikTok Pixel event using TikTok's recommended event shape.
 * Safe no-op if pixel is not present.
 */
export function trackTikTokEvent(
  name: TikTokStandardEvent | string,
  params: TikTokTrackParams = {},
): void {
  if (typeof window === "undefined") return;
  if (!window.ttq || typeof window.ttq.track !== "function") return;

  const payload: Record<string, unknown> = {};
  if (params.contents) payload.contents = params.contents;
  if (typeof params.value === "number") payload.value = params.value;
  if (params.currency) payload.currency = params.currency;
  if (params.event_id) payload.event_id = params.event_id;
  if (params.extra) Object.assign(payload, params.extra);

  try {
    if (Object.keys(payload).length > 0) {
      window.ttq.track(name, payload);
    } else {
      window.ttq.track(name);
    }
  } catch {
    // Tracking must never break the page.
  }
}

/**
 * Identify the visitor for advanced matching. All PII is SHA-256
 * hashed client-side per TikTok policy. Call BEFORE the corresponding
 * track event when possible — TikTok then attaches the identifiers
 * to subsequent events fired in the same page lifecycle.
 *
 * Pass `externalId` (visitor_id) on every page view so even anonymous
 * traffic stitches to a stable id across ViewContent → conversion.
 */
export async function identifyTikTokUser(opts: {
  email?: string;
  phone?: string;
  externalId?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!window.ttq || typeof window.ttq.identify !== "function") return;

  const [emailHash, phoneHash, externalIdHash] = await Promise.all([
    sha256Hex(opts.email),
    sha256Hex(opts.phone),
    sha256Hex(opts.externalId),
  ]);

  const payload: Record<string, unknown> = {};
  if (emailHash) payload.email = emailHash;
  if (phoneHash) payload.phone_number = phoneHash;
  if (externalIdHash) payload.external_id = externalIdHash;
  if (Object.keys(payload).length === 0) return;

  try {
    window.ttq.identify(payload);
  } catch {
    // No-op
  }
}
