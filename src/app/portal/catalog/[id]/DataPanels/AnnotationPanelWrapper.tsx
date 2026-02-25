"use client";

import { MetaTable } from "../MetaTable";
import type { DataPanelProps } from "./DataPanelRegistry";

// =============================================================================
// AnnotationPanelWrapper -- Adapts DataPanelProps to MetaTable's prop shape
// =============================================================================

export function AnnotationPanelWrapper({ data }: DataPanelProps) {
  // Separate annotation-specific fields from general metadata.
  // The `data` object is the full annotation record; we pass it as both
  // metadata (for generic key-value display) and annotationData (if MetaTable
  // wants to render annotation-specific UI in the future).
  const annotationData = data.annotation
    ? (data.annotation as Record<string, unknown>)
    : undefined;

  // Strip the nested annotation key from the top-level metadata to avoid
  // duplication if it exists.
  const { annotation: _annotation, ...metadata } = data;

  return <MetaTable metadata={metadata} annotationData={annotationData} />;
}
