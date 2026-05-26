/**
 * hreflang alternates for /jobs and /jobs/[slug].
 *
 * Today returns self-only (en) plus `x-default` pointing at the English path.
 * When es-MX and pt-BR routes ship, flip `LIVE_LOCALES` to include them and
 * every caller picks them up automatically — no per-page changes needed.
 */

import type { JobLocale } from "@/types/job";
import { hasTranslation } from "@/lib/jobs";

const SITE_ORIGIN = "https://claru.ai";

// Locales whose routes actually exist.
const LIVE_LOCALES: JobLocale[] = ["en", "es-MX", "pt-BR"];

function localizedPath(locale: JobLocale, suffix: string): string {
  if (locale === "es-MX") return `${SITE_ORIGIN}/es-mx${suffix}`;
  if (locale === "pt-BR") return `${SITE_ORIGIN}/pt-br${suffix}`;
  return `${SITE_ORIGIN}${suffix}`;
}

/** Hreflang code per locale. en + en-US share the en target by convention. */
const HREFLANG_CODE: Record<JobLocale, string> = {
  en: "en",
  "es-MX": "es-MX",
  "pt-BR": "pt-BR",
};

/**
 * Build the `alternates.languages` object for a Next.js Metadata export.
 *
 * Per-slug variant: only includes locale alternates when a translation
 * overlay exists for that slug+locale. This prevents the en↔es-MX↔pt-BR
 * cluster from pointing at pages whose body is English (which Google flags
 * as inconsistent under hreflang's "equivalent content" rule).
 *
 * @param suffix - Path under the locale root, e.g. `/jobs` or `/jobs/my-slug`.
 * @param slug   - Optional role slug. When omitted (index pages), all live
 *                 locales are emitted. When set, locale alternates are gated
 *                 by `hasTranslation(slug, locale)`.
 */
export function jobsHreflangAlternates(
  suffix: string,
  slug?: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of LIVE_LOCALES) {
    if (locale === "en") {
      out[HREFLANG_CODE[locale]] = localizedPath(locale, suffix);
      continue;
    }
    if (slug && !hasTranslation(slug, locale)) continue;
    out[HREFLANG_CODE[locale]] = localizedPath(locale, suffix);
  }
  out["x-default"] = localizedPath("en", suffix);
  return out;
}
