"use client";

import { useCallback, useMemo } from "react";
import { Pencil } from "lucide-react";
import type { AdminClip } from "./SamplesList";
import { ClipDetailModal } from "@/app/portal/catalog/[id]/ClipDetailModal";

// ---------------------------------------------------------------------------
// SamplePreviewModal -- Admin wrapper around ClipDetailModal
// Shows clip data with structured tabs (Annotation | AI Enrichment | Technical)
// plus an "Edit" escape hatch for admin workflows.
//
// US-019: Updated to pass Clip objects directly to ClipDetailModal.
// ---------------------------------------------------------------------------

interface SamplePreviewModalProps {
  samples: AdminClip[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onEdit: (sample: AdminClip) => void;
}

export default function SamplePreviewModal({
  samples,
  selectedIndex,
  onClose,
  onNavigate,
  onEdit,
}: SamplePreviewModalProps) {
  const items = useMemo(
    () =>
      samples.map((s) => ({
        clip: s,
        signedUrl: s.media_url ?? "",
      })),
    [samples]
  );

  const handleEdit = useCallback(() => {
    const sample = samples[selectedIndex];
    if (sample) onEdit(sample);
  }, [onEdit, samples, selectedIndex]);

  return (
    <div className="relative">
      <ClipDetailModal
        items={items}
        selectedIndex={selectedIndex}
        onClose={onClose}
        onNavigate={onNavigate}
        annotationEndpoint="/api/admin/s3-annotation"
        apiBase="/api/admin"
      />

      {/* Floating Edit button -- positioned in the modal overlay area */}
      <button
        onClick={handleEdit}
        className="fixed top-5 right-20 z-[60] flex items-center gap-1.5 rounded-md border border-[var(--accent-primary)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-mono text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
    </div>
  );
}
