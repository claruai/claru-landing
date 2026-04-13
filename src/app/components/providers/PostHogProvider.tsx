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
    if (lastPath.current !== url) {
      ph.capture("$pageview", { $current_url: url });
      lastPath.current = url;
    }
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
