"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, RotateCcw, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import type { SlideData, SlideTemplateVersion } from "@/types/deck-builder";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface VersionHistoryProps {
  templateId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (slides: SlideData[]) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function VersionHistory({
  templateId,
  isOpen,
  onClose,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<SlideTemplateVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  /* ---- Fetch versions ---------------------------------------------- */

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/versions`
      );
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions ?? []);
      }
    } catch {
      // Silently fail -- versions may not exist yet
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
      setExpandedId(null);
      setConfirmRestoreId(null);
    }
  }, [isOpen, fetchVersions]);

  /* ---- Save version ------------------------------------------------ */

  const handleSaveVersion = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/deck-builder/${templateId}/versions`,
        { method: "POST" }
      );

      if (res.ok) {
        await fetchVersions();
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  }, [templateId, fetchVersions]);

  /* ---- Restore version --------------------------------------------- */

  const handleRestore = useCallback(
    (version: SlideTemplateVersion) => {
      const slides = version.slides_json;
      onRestore(slides);
      setConfirmRestoreId(null);
      onClose();
    },
    [onRestore, onClose]
  );

  /* ---- Keyboard escape --------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* ---- Render ------------------------------------------------------ */

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-[380px] max-w-full bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Version History
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save version button */}
        <div className="px-5 py-3 border-b border-[var(--border-subtle)]">
          <button
            onClick={handleSaveVersion}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2 font-mono text-xs text-[var(--bg-primary)] bg-[var(--accent-primary)] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Saving..." : "Save Version"}
          </button>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-xs text-[var(--text-muted)]">
                No versions saved yet.
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                Click &quot;Save Version&quot; to create a snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => {
                const isExpanded = expandedId === version.id;
                const isConfirming = confirmRestoreId === version.id;
                const slidesData = Array.isArray(version.slides_json)
                  ? version.slides_json
                  : [];

                return (
                  <div
                    key={version.id}
                    className="border border-[var(--border-subtle)] rounded-lg overflow-hidden"
                  >
                    {/* Version header */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : version.id)
                      }
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      )}

                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[var(--accent-primary)]">
                            v{version.version_number}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">
                            {relativeTime(version.created_at)}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {slidesData.length} slide
                          {slidesData.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-[var(--border-subtle)]">
                        {/* Slide titles */}
                        <div className="py-2 space-y-1">
                          {slidesData.map(
                            (slide: SlideData, idx: number) => (
                              <div
                                key={slide.id ?? idx}
                                className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-secondary)]"
                              >
                                <span className="text-[var(--text-muted)] w-4 text-right shrink-0">
                                  {idx + 1}.
                                </span>
                                <span className="truncate">
                                  {slide.title || "(untitled)"}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        {/* Restore button */}
                        {!isConfirming ? (
                          <button
                            onClick={() =>
                              setConfirmRestoreId(version.id)
                            }
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-1 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded-md transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Restore this version
                          </button>
                        ) : (
                          <div className="mt-1 space-y-2">
                            <p className="font-mono text-[10px] text-[var(--warning,orange)]">
                              This will replace your current slides. Continue?
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRestore(version)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 font-mono text-xs text-[var(--bg-primary)] bg-[var(--accent-primary)] rounded-md hover:opacity-90 transition-opacity"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmRestoreId(null)}
                                className="flex-1 py-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] rounded-md hover:text-[var(--text-primary)] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Slide-in animation keyframe */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
