"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  // Skip tracking on localhost, Vercel previews, and non-production domains
  const hostname = window.location.hostname;
  const isProduction =
    hostname === "claru.ai" || hostname === "www.claru.ai";

  if (isProduction) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // We capture manually for SPA route changes
      capture_pageleave: true,
      autocapture: true,
    });
  }
}

// UTM + referrer keys to forward on every pageview so SPA route changes
// don't lose attribution. PostHog's auto-capture only sets these on the
// first pageview — subsequent client navs default to "direct" without this.
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "li_fat_id",
  "ref",
] as const;

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !ph) return;

    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Avoid duplicate captures on same path
    if (lastPath.current === url) return;

    const props: Record<string, string | undefined> = { $current_url: url };

    // Forward UTM + click-id params present on this navigation so attribution
    // survives SPA route changes. Empty string is falsy here on purpose.
    for (const key of ATTR_KEYS) {
      const v = searchParams?.get(key);
      if (v) props[key] = v;
    }

    // Tag the first pageview of a session vs subsequent SPA navigations.
    // First-pageview-of-session keeps the document.referrer (cross-origin);
    // SPA navs use the previous in-app URL.
    if (typeof document !== "undefined") {
      if (lastPath.current === null) {
        if (document.referrer) props.$referrer = document.referrer;
        props.$pageview_kind = "session_start";
      } else {
        props.$referrer = `${window.location.origin}${lastPath.current}`;
        props.$pageview_kind = "spa_navigation";
        props.$prev_pathname = lastPath.current;
      }
    }

    ph.capture("$pageview", props);
    lastPath.current = url;
  }, [pathname, searchParams, ph]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
