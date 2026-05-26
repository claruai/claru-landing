/**
 * Build the `app.claru.ai/signup` URL with role + placement + locale
 * attribution for clicks originating from the /jobs board.
 *
 * Subdomain hop (claru.ai → app.claru.ai) means cookies don't carry, so we
 * propagate attribution through the query string. Mirrors the pattern in
 * `src/lib/tracking/reddit.ts`.
 *
 * UTM taxonomy (locked — downstream reporting depends on it):
 *   utm_source   = jobs
 *   utm_medium   = organic
 *   utm_campaign = <job.slug>            // 'general-application' for the catch-all CTA
 *   utm_content  = apply_<placement>     // top | sticky | related | general
 *   utm_term     = <locale>              // en | es-MX | pt-BR
 */

import type { JobLocale } from "@/types/job";

const SIGNUP_URL = "https://app.claru.ai/signup";

export type ApplyPlacement = "top" | "sticky" | "related" | "general";

interface BuildOpts {
  /** Job slug for per-role attribution. Use 'general-application' for the catch-all CTA. */
  slug: string;
  /** Where on the page the click originated. */
  placement: ApplyPlacement;
  /** Page locale at click time. Defaults to 'en' if unknown. */
  locale?: JobLocale;
}

export function buildJobsCtaUrl({ slug, placement, locale = "en" }: BuildOpts): string {
  const url = new URL(SIGNUP_URL);
  url.searchParams.set("utm_source", "jobs");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", slug);
  url.searchParams.set("utm_content", `apply_${placement}`);
  url.searchParams.set("utm_term", locale);
  url.searchParams.set("source", "claru-landing-jobs");
  return url.toString();
}
