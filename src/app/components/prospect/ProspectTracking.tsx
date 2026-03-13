"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePostHog } from "posthog-js/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProspectTrackingProps {
  companySlug: string;
  companyName: string;
}

interface SectionTrackerProps {
  companySlug: string;
  sectionName: string;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Shared helper – attaches utm_source to every event
// ---------------------------------------------------------------------------

function prospectProps(companySlug: string, extra?: Record<string, unknown>) {
  return { company_slug: companySlug, utm_source: "prospect_page", ...extra };
}

// ---------------------------------------------------------------------------
// ProspectTracking – page-level tracking (mount, scroll depth, time spent)
// ---------------------------------------------------------------------------

export function ProspectTracking({
  companySlug,
  companyName,
}: ProspectTrackingProps) {
  const posthog = usePostHog();
  const startTime = useRef(Date.now());
  const firedDepths = useRef(new Set<number>());
  const lastScrollFire = useRef(0);

  // ---- page view on mount ----
  useEffect(() => {
    if (!posthog) return;
    posthog.capture(
      "prospect_page_viewed",
      prospectProps(companySlug, { company_name: companyName }),
    );
  }, [posthog, companySlug, companyName]);

  // ---- scroll depth tracking (25/50/75/100, throttled 3s) ----
  useEffect(() => {
    if (!posthog) return;

    const THRESHOLDS = [25, 50, 75, 100];

    function handleScroll() {
      const now = Date.now();
      if (now - lastScrollFire.current < 3000) return;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      for (const t of THRESHOLDS) {
        if (pct >= t && !firedDepths.current.has(t)) {
          firedDepths.current.add(t);
          posthog.capture(
            "prospect_page_scroll_depth",
            prospectProps(companySlug, { depth_percent: t }),
          );
          lastScrollFire.current = now;
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posthog, companySlug]);

  // ---- time spent tracking (visibility change + beforeunload) ----
  useEffect(() => {
    if (!posthog) return;

    function fireTimeSpent() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (seconds < 1) return;
      posthog.capture(
        "prospect_page_time_spent",
        prospectProps(companySlug, { seconds_spent: seconds }),
      );
    }

    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        fireTimeSpent();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", fireTimeSpent);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", fireTimeSpent);
    };
  }, [posthog, companySlug]);

  return null;
}

// ---------------------------------------------------------------------------
// SectionTracker – fires prospect_section_viewed when section enters viewport
// ---------------------------------------------------------------------------

export function SectionTracker({
  companySlug,
  sectionName,
  children,
}: SectionTrackerProps) {
  const posthog = usePostHog();
  const ref = useRef<HTMLDivElement>(null);
  const hasFired = useRef(false);

  useEffect(() => {
    if (!posthog || !ref.current || hasFired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasFired.current) {
            hasFired.current = true;
            posthog.capture(
              "prospect_section_viewed",
              prospectProps(companySlug, { section_name: sectionName }),
            );
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [posthog, companySlug, sectionName]);

  return <div ref={ref}>{children}</div>;
}

// ---------------------------------------------------------------------------
// useProspectEvents – returns trackCTAClick and trackCaseStudyClick
// ---------------------------------------------------------------------------

export function useProspectEvents(companySlug: string) {
  const posthog = usePostHog();

  const trackCTAClick = useCallback(
    (ctaType: "calendly" | "mailto" | string) => {
      if (!posthog) return;
      posthog.capture(
        "cta_clicked",
        prospectProps(companySlug, { cta_type: ctaType }),
      );
    },
    [posthog, companySlug],
  );

  const trackCaseStudyClick = useCallback(
    (caseStudySlug: string) => {
      if (!posthog) return;
      posthog.capture(
        "case_study_clicked",
        prospectProps(companySlug, { case_study_slug: caseStudySlug }),
      );
    },
    [posthog, companySlug],
  );

  return { trackCTAClick, trackCaseStudyClick };
}
