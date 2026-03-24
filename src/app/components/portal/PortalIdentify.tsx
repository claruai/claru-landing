"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

interface PortalIdentifyProps {
  email: string;
  name: string;
  company: string;
  leadStatus: string;
  datasetsCount: number;
}

/**
 * Invisible client component that identifies the current portal user in
 * PostHog. Rendered inside the portal dashboard (server component) which
 * already has the lead data.
 *
 * Calls posthog.identify(email, personProperties) once per mount.
 * Idempotent — calling identify with the same email just refreshes properties.
 */
export function PortalIdentify({
  email,
  name,
  company,
  leadStatus,
  datasetsCount,
}: PortalIdentifyProps) {
  const posthog = usePostHog();
  const identified = useRef(false);

  useEffect(() => {
    if (!posthog || identified.current) return;
    identified.current = true;

    posthog.identify(email, {
      name,
      company,
      lead_status: leadStatus,
      datasets_count: datasetsCount,
    });
  }, [posthog, email, name, company, leadStatus, datasetsCount]);

  return null;
}
