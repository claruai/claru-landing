"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Check,
  Film,
  FileJson,
  Bot,
  Cpu,
  Maximize2,
  Moon,
  Sun,
  X,
} from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface ShareClip {
  id: string;
  filename: string | null;
  signedUrl: string;
  caption: string | null;
  metadata: Record<string, unknown> | null;
  enrichment: Record<string, unknown> | null;
  techSpecs: {
    duration: number | null;
    width: number | null;
    height: number | null;
    fps: number | null;
    fileSize: number | null;
    codec: string | null;
    bitDepth: number | null;
  };
}

interface ShareCatalogProps {
  clips: ShareClip[];
  datasetName: string;
  companyName: string | null;
  token: string;
}

type TabType = "annotation" | "enrichment" | "technical";

interface TabDefinition {
  type: TabType;
  label: string;
  icon: typeof FileJson;
  data: Record<string, unknown>;
}

// =============================================================================
// Helpers
// =============================================================================

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "--";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

function formatResolution(
  w: number | null,
  h: number | null
): string {
  if (!w || !h) return "--";
  return `${w} x ${h}`;
}

function computeAspectRatio(
  w: number | null,
  h: number | null
): string {
  if (!w || !h) return "--";
  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b);
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

// =============================================================================
// ThemeToggle
// =============================================================================

function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-200"
      style={{
        borderColor: "var(--border-medium)",
        color: "var(--text-muted)",
        background: "var(--bg-secondary)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// =============================================================================
// DataPanelTabs — self-contained tab UI for the share page
// =============================================================================

function DataPanelTabs({ tabs }: { tabs: TabDefinition[] }) {
  const [activeType, setActiveType] = useState<TabType>(
    tabs[0]?.type ?? "annotation"
  );

  // Reset active tab when tabs change (clip navigation)
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.type === activeType)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveType(tabs[0].type);
    }
  }, [tabs, activeType]);

  const activeTab = tabs.find((t) => t.type === activeType);

  if (tabs.length === 0) {
    return (
      <div className="font-mono text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>
        No metadata available.
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-secondary)",
      }}
    >
      {/* Tab bar */}
      {tabs.length > 1 && (
        <div
          className="flex items-stretch border-b"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--bg-primary)",
          }}
          role="tablist"
          aria-label="Data panels"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.type === activeType;
            return (
              <button
                key={tab.type}
                role="tab"
                aria-selected={isActive}
                aria-controls={`share-panel-${tab.type}`}
                onClick={() => setActiveType(tab.type)}
                className="relative flex items-center gap-2 px-4 py-2.5 font-mono text-xs tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                style={{
                  color: isActive
                    ? "var(--accent-primary)"
                    : "var(--text-muted)",
                  background: isActive
                    ? "var(--bg-secondary)"
                    : "transparent",
                  ...(isActive
                    ? {}
                    : {}),
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isActive && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    style={{ background: "var(--accent-primary)" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Tab content */}
      <div
        id={`share-panel-${activeType}`}
        role="tabpanel"
        aria-label={`${activeTab?.label ?? activeType} panel`}
        className="p-4"
      >
        {activeTab && <PanelContent tab={activeTab} />}
      </div>
    </div>
  );
}

// =============================================================================
// PanelContent — renders content for each tab type
// =============================================================================

function PanelContent({ tab }: { tab: TabDefinition }) {
  if (tab.type === "technical") {
    return <TechnicalPanel data={tab.data} />;
  }
  if (tab.type === "enrichment") {
    return <EnrichmentPanel data={tab.data} />;
  }
  // annotation or fallback
  return <JsonPanel data={tab.data} />;
}

function TechnicalPanel({ data }: { data: Record<string, unknown> }) {
  const fields: Array<{ label: string; value: string }> = [];
  if (data.resolution) fields.push({ label: "Resolution", value: String(data.resolution) });
  if (data.aspect_ratio) fields.push({ label: "Aspect Ratio", value: String(data.aspect_ratio) });
  if (data.fps) fields.push({ label: "FPS", value: String(data.fps) });
  if (data.duration) fields.push({ label: "Duration", value: String(data.duration) });

  if (fields.length === 0) {
    return (
      <div className="font-mono text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>
        No technical metadata available.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {fields.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-baseline gap-3 py-2.5 border-b last:border-b-0"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="font-mono text-xs flex-shrink-0 w-28 text-right"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <span className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function EnrichmentPanel({ data }: { data: Record<string, unknown> }) {
  const caption = data.caption as string | undefined;
  const sceneSummary = data.scene_summary as string | undefined;
  const environments = data.environments as string[] | undefined;
  const activities = data.activities as string[] | undefined;
  const objects = data.objects as string[] | undefined;
  const cameraPerspective = data.camera_perspective as string | undefined;

  const handledKeys = new Set([
    "caption",
    "scene_summary",
    "environments",
    "activities",
    "objects",
    "camera_perspective",
  ]);
  const extraKeys = Object.keys(data).filter((k) => !handledKeys.has(k));

  return (
    <div className="space-y-4">
      {caption && <TextSection label="Caption" text={caption} />}
      {sceneSummary && <TextSection label="Scene Summary" text={sceneSummary} />}
      {environments && environments.length > 0 && (
        <TagSection label="Environments" items={environments} accent />
      )}
      {activities && activities.length > 0 && (
        <TagSection label="Activities" items={activities} accent />
      )}
      {objects && objects.length > 0 && (
        <TagSection label="Objects" items={objects} />
      )}
      {cameraPerspective && (
        <div>
          <span
            className="block text-[10px] font-mono uppercase tracking-wider mb-1.5"
            style={{ color: "var(--accent-primary)" }}
          >
            Camera Perspective
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs border"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {cameraPerspective}
          </span>
        </div>
      )}
      {extraKeys.length > 0 && (
        <div>
          <span
            className="block text-[10px] font-mono uppercase tracking-wider mb-1.5"
            style={{ color: "var(--accent-primary)" }}
          >
            Additional AI Data
          </span>
          <pre
            className="font-mono text-[11px] whitespace-pre-wrap break-all max-h-60 overflow-y-auto rounded-md p-3 border"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            {JSON.stringify(
              Object.fromEntries(extraKeys.map((k) => [k, data[k]])),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

function TextSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span
        className="block text-[10px] font-mono uppercase tracking-wider mb-1.5"
        style={{ color: "var(--accent-primary)" }}
      >
        {label}
      </span>
      <p
        className="font-mono text-xs leading-relaxed whitespace-pre-wrap"
        style={{ color: "var(--text-secondary)" }}
      >
        {text}
      </p>
    </div>
  );
}

function TagSection({
  label,
  items,
  accent = false,
}: {
  label: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div>
      <span
        className="block text-[10px] font-mono uppercase tracking-wider mb-1.5"
        style={{ color: "var(--accent-primary)" }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs border"
            style={
              accent
                ? {
                    background: "var(--accent-glow)",
                    borderColor: "var(--border-accent)",
                    color: "var(--accent-primary)",
                  }
                : {
                    background: "var(--bg-tertiary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function JsonPanel({ data }: { data: Record<string, unknown> }) {
  return (
    <pre
      className="font-mono text-[11px] whitespace-pre-wrap break-all max-h-[60vh] overflow-y-auto rounded-md p-3 border"
      style={{
        color: "var(--text-secondary)",
        background: "var(--bg-tertiary)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// =============================================================================
// ClipCard — thumbnail card in the grid
// =============================================================================

function ClipCard({
  clip,
  onClick,
}: {
  clip: ShareClip;
  currentUrl: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-lg border overflow-hidden transition-all duration-200 group cursor-pointer"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border-medium)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border-subtle)";
      }}
    >
      {/* Poster frame / thumbnail */}
      <div
        className="relative aspect-video overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        <video
          src={clip.signedUrl}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
        />
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border"
            style={{
              background: "rgba(0,0,0,0.5)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <svg
              className="w-5 h-5 ml-0.5"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3">
        {clip.filename && (
          <p
            className="font-mono text-xs truncate mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {clip.filename}
          </p>
        )}
        {clip.caption && (
          <p
            className="font-mono text-[11px] line-clamp-2 mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {clip.caption}
          </p>
        )}
        <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
          {clip.techSpecs.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(clip.techSpecs.duration)}
            </span>
          )}
          {clip.techSpecs.width && clip.techSpecs.height && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              {clip.techSpecs.width}x{clip.techSpecs.height}
            </span>
          )}
          {clip.techSpecs.fps && <span>{clip.techSpecs.fps}fps</span>}
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// ClipDetailModal — split-view modal: video left, tabbed data right
// =============================================================================

function ClipDetailModal({
  clips,
  selectedIndex,
  onClose,
  onNavigate,
  clipUrls,
  onRefreshUrls,
}: {
  clips: ShareClip[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  clipUrls: Map<string, string>;
  onRefreshUrls: () => Promise<Map<string, string>>;
}) {
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  const clip = clips[selectedIndex];
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < clips.length - 1;

  // Get current URL for this clip (may have been refreshed)
  const currentUrl = clipUrls.get(clip.id) ?? clip.signedUrl;

  // Build tabs for this clip
  const tabs = useMemo<TabDefinition[]>(() => {
    const result: TabDefinition[] = [];

    // Annotation panel
    if (clip.metadata && Object.keys(clip.metadata).length > 0) {
      result.push({
        type: "annotation",
        label: "Annotation",
        icon: FileJson,
        data: clip.metadata,
      });
    }

    // AI Enrichment panel
    if (clip.enrichment && Object.keys(clip.enrichment).length > 0) {
      result.push({
        type: "enrichment",
        label: "Enrichment",
        icon: Bot,
        data: clip.enrichment,
      });
    }

    // Technical panel
    const techData: Record<string, unknown> = {};
    if (clip.techSpecs.width && clip.techSpecs.height) {
      techData.resolution = formatResolution(
        clip.techSpecs.width,
        clip.techSpecs.height
      );
      techData.aspect_ratio = computeAspectRatio(
        clip.techSpecs.width,
        clip.techSpecs.height
      );
    }
    if (clip.techSpecs.fps) techData.frame_rate = `${clip.techSpecs.fps} fps`;
    if (clip.techSpecs.duration)
      techData.duration = formatDuration(clip.techSpecs.duration);
    if (clip.techSpecs.fileSize) techData.file_size = formatBytes(clip.techSpecs.fileSize);
    if (clip.techSpecs.codec) techData.codec = clip.techSpecs.codec;
    if (clip.techSpecs.bitDepth) techData.bit_depth = `${clip.techSpecs.bitDepth}-bit`;
    if (clip.filename) techData.filename = clip.filename;
    if (Object.keys(techData).length > 0) {
      result.push({
        type: "technical",
        label: "Technical",
        icon: Cpu,
        data: techData,
      });
    }

    return result;
  }, [clip]);

  // Merged JSON for copy
  const mergedJson = useMemo(() => {
    const merged: Record<string, unknown> = {};
    if (clip.metadata) merged.annotation = clip.metadata;
    if (clip.enrichment) merged.enrichment = clip.enrichment;
    merged.technical = {
      duration: clip.techSpecs.duration,
      resolution:
        clip.techSpecs.width && clip.techSpecs.height
          ? `${clip.techSpecs.width}x${clip.techSpecs.height}`
          : null,
      fps: clip.techSpecs.fps,
      file_size_bytes: clip.techSpecs.fileSize,
      codec: clip.techSpecs.codec,
      bit_depth: clip.techSpecs.bitDepth,
    };
    return merged;
  }, [clip]);

  const jsonString = JSON.stringify(mergedJson, null, 2);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }, [jsonString]);

  // Reset copied state on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCopied(false);
    setVideoError(false);
  }, [selectedIndex]);

  // Handle video error — refresh URLs
  const handleVideoError = useCallback(async () => {
    if (videoError) return; // Avoid infinite loop
    setVideoError(true);
    const freshUrls = await onRefreshUrls();
    const newUrl = freshUrls.get(clip.id);
    if (newUrl && videoRef.current) {
      videoRef.current.src = newUrl;
      videoRef.current.load();
      setVideoError(false);
    }
  }, [clip.id, videoError, onRefreshUrls]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onNavigate(selectedIndex - 1);
      } else if (e.key === "ArrowRight" && hasNext) {
        onNavigate(selectedIndex + 1);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate, selectedIndex, hasPrev, hasNext]);

  // Lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Click backdrop to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Clip ${selectedIndex + 1} detail view`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors duration-200"
        style={{
          background: "rgba(26, 24, 22, 0.8)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)",
        }}
        aria-label="Close detail view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Previous arrow */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(selectedIndex - 1);
          }}
          className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors duration-200"
          style={{
            background: "rgba(26, 24, 22, 0.8)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
          aria-label="Previous clip"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(selectedIndex + 1);
          }}
          className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors duration-200"
          style={{
            background: "rgba(26, 24, 22, 0.8)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
          aria-label="Next clip"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Content container — split view */}
      <div
        className="relative z-[55] flex flex-col lg:flex-row w-full max-w-6xl max-h-[95vh] lg:max-h-[90vh] rounded-xl overflow-hidden border shadow-2xl shadow-black/50"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--bg-secondary)",
        }}
      >
        {/* Left side — Video (60% desktop, full width mobile) */}
        <div
          className="lg:w-[60%] flex-shrink-0 flex items-center justify-center min-h-[200px] sm:min-h-[240px] lg:min-h-0"
          style={{ background: "var(--bg-primary)" }}
        >
          <video
            ref={videoRef}
            key={clip.id}
            src={currentUrl}
            className="w-full h-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[90vh] object-contain"
            controls
            controlsList="nodownload"
            autoPlay
            playsInline
            onError={handleVideoError}
          />
        </div>

        {/* Right side — Data Panels (40% desktop, full width mobile) */}
        <div
          className="lg:w-[40%] flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--bg-secondary)",
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--bg-primary)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="font-mono text-xs tracking-wider flex-shrink-0"
                style={{ color: "var(--accent-primary)" }}
              >
                {"// CLIP DATA"}
              </span>
              <span
                className="font-mono text-[10px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                clip_{String(selectedIndex + 1).padStart(3, "0")}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors duration-200 flex-shrink-0"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border-subtle)",
                color: copied
                  ? "var(--accent-primary)"
                  : "var(--text-muted)",
              }}
              aria-label="Copy JSON to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy JSON
                </>
              )}
            </button>
          </div>

          {/* Filename display */}
          {clip.filename && (
            <div
              className="px-4 py-2 border-b flex-shrink-0"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <p
                className="font-mono text-xs truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {clip.filename}
              </p>
            </div>
          )}

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {tabs.length > 0 ? (
              <DataPanelTabs tabs={tabs} />
            ) : (
              <div
                className="font-mono text-xs text-center py-6"
                style={{ color: "var(--text-muted)" }}
              >
                No metadata available.
              </div>
            )}
          </div>

          {/* Footer — navigation counter */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-t flex-shrink-0"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--bg-primary)",
            }}
          >
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              {selectedIndex + 1} / {clips.length}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              esc close &middot; &larr;&rarr; navigate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ShareCatalog — main export
// =============================================================================

export default function ShareCatalog({
  clips,
  datasetName,
  companyName,
  token,
}: ShareCatalogProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [clipUrls, setClipUrls] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const c of clips) {
      map.set(c.id, c.signedUrl);
    }
    return map;
  });

  // Theme state: default dark, persist to localStorage
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("share-theme");
    if (stored === "light") {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("share-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  // URL refresh cache
  const refreshCache = useRef<Promise<Map<string, string>> | null>(null);

  const refreshUrls = useCallback(async (): Promise<Map<string, string>> => {
    if (refreshCache.current) return refreshCache.current;

    const promise = (async () => {
      try {
        const res = await fetch(`/api/share/${token}/urls`, {
          method: "POST",
        });
        if (!res.ok) return new Map<string, string>();
        const data = await res.json();
        const map = new Map<string, string>();
        for (const c of data.clips ?? []) {
          map.set(c.id, c.signedUrl);
        }
        // Update the shared URL state
        setClipUrls((prev) => {
          const next = new Map(prev);
          for (const [id, url] of map) {
            next.set(id, url);
          }
          return next;
        });
        return map;
      } catch {
        return new Map<string, string>();
      } finally {
        setTimeout(() => {
          refreshCache.current = null;
        }, 5000);
      }
    })();

    refreshCache.current = promise;
    return promise;
  }, [token]);

  // Theme CSS variables applied via inline styles on the root container
  const themeStyles: React.CSSProperties = isDark
    ? {
        // Dark mode — use the design system defaults from :root
        ["--bg-primary" as string]: "#0a0908",
        ["--bg-secondary" as string]: "#121110",
        ["--bg-tertiary" as string]: "#1a1816",
        ["--bg-elevated" as string]: "#1f1d1a",
        ["--text-primary" as string]: "#FFFFFF",
        ["--text-secondary" as string]: "rgba(255, 255, 255, 0.85)",
        ["--text-muted" as string]: "rgba(255, 255, 255, 0.4)",
        ["--accent-primary" as string]: "#92B090",
        ["--accent-glow" as string]: "rgba(146, 176, 144, 0.2)",
        ["--border-subtle" as string]: "rgba(255, 255, 255, 0.08)",
        ["--border-medium" as string]: "rgba(255, 255, 255, 0.15)",
        ["--border-accent" as string]: "rgba(146, 176, 144, 0.4)",
      }
    : {
        // Light mode
        ["--bg-primary" as string]: "#FAFAF8",
        ["--bg-secondary" as string]: "#F2F1EF",
        ["--bg-tertiary" as string]: "#E8E7E4",
        ["--bg-elevated" as string]: "#FFFFFF",
        ["--text-primary" as string]: "#1A1A1A",
        ["--text-secondary" as string]: "rgba(26, 26, 26, 0.8)",
        ["--text-muted" as string]: "rgba(26, 26, 26, 0.4)",
        ["--accent-primary" as string]: "#5E8A5A",
        ["--accent-glow" as string]: "rgba(94, 138, 90, 0.15)",
        ["--border-subtle" as string]: "rgba(0, 0, 0, 0.06)",
        ["--border-medium" as string]: "rgba(0, 0, 0, 0.12)",
        ["--border-accent" as string]: "rgba(94, 138, 90, 0.3)",
      };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        ...themeStyles,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="font-mono font-bold text-lg tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                CLARU
              </span>
              <span
                className="w-px h-5"
                style={{ background: "var(--border-subtle)" }}
              />
              {companyName && (
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Prepared for {companyName}
                </span>
              )}
            </div>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
          <h1
            className="font-mono text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {datasetName}
          </h1>
          <p
            className="font-mono text-sm mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            {clips.length} {clips.length === 1 ? "clip" : "clips"}
          </p>
        </div>

        {/* Grid */}
        {clips.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <Film
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
              No clips available in this catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clips.map((clip, index) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                currentUrl={clipUrls.get(clip.id) ?? clip.signedUrl}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-12 pt-6 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p
            className="font-mono text-[10px] text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Confidential — shared by Claru AI
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIndex !== null && (
        <ClipDetailModal
          clips={clips}
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
          clipUrls={clipUrls}
          onRefreshUrls={refreshUrls}
        />
      )}
    </div>
  );
}
