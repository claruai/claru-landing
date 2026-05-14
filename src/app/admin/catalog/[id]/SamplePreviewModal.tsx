"use client";

import { useCallback, useMemo } from "react";
import { Pencil, Star } from "lucide-react";
import type { AdminClip } from "./SamplesList";
import { ClipDetailModal } from "@/app/portal/catalog/[id]/ClipDetailModal";

// ---------------------------------------------------------------------------
// SamplePreviewModal -- Admin wrapper around ClipDetailModal
// Shows clip data with structured tabs (Annotation | AI Enrichment | Technical)
// plus Edit + Showcase escape hatches for admin workflows.
//
// US-019: Updated to pass Clip objects directly to ClipDetailModal.
// 2026-05-14: Added in-modal showcase toggle.
// ---------------------------------------------------------------------------

interface SamplePreviewModalProps {
  samples: AdminClip[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onEdit: (sample: AdminClip) => void;
  /** Called when the user toggles showcase on the currently-displayed clip. */
  onToggleShowcase?: (sample: AdminClip) => void;
}

export default function SamplePreviewModal({
  samples,
  selectedIndex,
  onClose,
  onNavigate,
  onEdit,
  onToggleShowcase,
}: SamplePreviewModalProps) {
  const items = useMemo(
    () =>
      samples.map((s) => ({
        clip: s,
        signedUrl: s.media_url ?? "",
      })),
    [samples]
  );

  const currentSample = samples[selectedIndex];
  const isShowcase = !!currentSample?.is_showcase;
  const showcaseDisabled = !!currentSample?.lead_id;

  const handleEdit = useCallback(() => {
    if (currentSample) onEdit(currentSample);
  }, [onEdit, currentSample]);

  const handleShowcase = useCallback(() => {
    if (!currentSample || showcaseDisabled || !onToggleShowcase) return;
    onToggleShowcase(currentSample);
  }, [currentSample, onToggleShowcase, showcaseDisabled]);

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

      {/* Floating admin actions — Showcase toggle + Edit. */}
      <div className="fixed top-5 right-20 z-[60] flex items-center gap-2">
        {onToggleShowcase && (
          <button
            onClick={handleShowcase}
            disabled={showcaseDisabled}
            data-testid="modal-showcase-toggle"
            data-showcase={isShowcase ? "true" : "false"}
            title={
              showcaseDisabled
                ? "Lead-specific clip — toggle showcase on the base attachment instead"
                : isShowcase
                  ? "Showcase clip (click to remove)"
                  : "Click to mark as showcase"
            }
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${
              isShowcase
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                : "border-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
            } ${showcaseDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <Star className="w-3 h-3" fill={isShowcase ? "currentColor" : "none"} />
            {isShowcase ? "Showcase" : "Mark Showcase"}
          </button>
        )}
        <button
          onClick={handleEdit}
          className="flex items-center gap-1.5 rounded-md border border-[var(--accent-primary)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-mono text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>
    </div>
  );
}
