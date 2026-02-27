"use client";

import { useCallback, useMemo } from "react";
import { Pencil } from "lucide-react";
import type { DatasetSample } from "@/types/data-catalog";
import { SampleDetailModal } from "@/app/portal/catalog/[id]/SampleDetailModal";

// ---------------------------------------------------------------------------
// SamplePreviewModal -- Admin wrapper around portal SampleDetailModal
// Mirrors the client view with an "Edit" escape hatch for admin workflows.
// ---------------------------------------------------------------------------

interface SamplePreviewModalProps {
  samples: DatasetSample[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onEdit: (sample: DatasetSample) => void;
}

export default function SamplePreviewModal({
  samples,
  selectedIndex,
  onClose,
  onNavigate,
  onEdit,
}: SamplePreviewModalProps) {
  const samplesWithUrls = useMemo(
    () =>
      samples.map((s) => ({
        sample: s,
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
      <SampleDetailModal
        samples={samplesWithUrls}
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
