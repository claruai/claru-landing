"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

interface DatasetViewTrackerProps {
  datasetId: string;
  datasetName: string;
  datasetType: string;
}

/**
 * Invisible client component that fires a `dataset_viewed` event when a
 * portal user lands on a dataset detail page. Rendered by the server
 * component at /portal/catalog/[id].
 */
export function DatasetViewTracker({
  datasetId,
  datasetName,
  datasetType,
}: DatasetViewTrackerProps) {
  const posthog = usePostHog();
  const fired = useRef(false);

  useEffect(() => {
    if (!posthog || fired.current) return;
    fired.current = true;

    posthog.capture("dataset_viewed", {
      dataset_id: datasetId,
      dataset_name: datasetName,
      dataset_type: datasetType,
    });
  }, [posthog, datasetId, datasetName, datasetType]);

  return null;
}
