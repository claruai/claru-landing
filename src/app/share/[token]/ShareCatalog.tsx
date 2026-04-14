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
  Eye,
  Cpu,
  Gamepad2,
  Keyboard,
  Loader2,
  Maximize2,
  Moon,
  Mouse,
  Search,
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
  hasAnnotation: boolean;
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

type TabType = "annotation" | "enrichment" | "technical" | "input_stream";

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

function DataPanelTabs({ tabs, token }: { tabs: TabDefinition[]; token: string }) {
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
        {activeTab && <PanelContent tab={activeTab} token={token} />}
      </div>
    </div>
  );
}

// =============================================================================
// PanelContent — renders content for each tab type
// =============================================================================

function PanelContent({ tab, token }: { tab: TabDefinition; token: string }) {
  if (tab.type === "technical") {
    return <TechnicalPanel data={tab.data} />;
  }
  if (tab.type === "enrichment") {
    return <EnrichmentPanel data={tab.data} />;
  }
  if (tab.type === "input_stream") {
    return <InputStreamPanel data={tab.data} token={token} />;
  }
  if (tab.type === "annotation") {
    return <AnnotationPanel data={tab.data} />;
  }
  // fallback
  return <JsonPanel data={tab.data} />;
}

function TechnicalPanel({ data }: { data: Record<string, unknown> }) {
  const fields: Array<{ label: string; value: string }> = [];
  if (data.resolution) fields.push({ label: "Resolution", value: String(data.resolution) });
  if (data.aspect_ratio) fields.push({ label: "Aspect Ratio", value: String(data.aspect_ratio) });
  if (data.frame_rate) fields.push({ label: "Frame Rate", value: String(data.frame_rate) });
  if (data.duration) fields.push({ label: "Duration", value: String(data.duration) });
  if (data.file_size) fields.push({ label: "File Size", value: String(data.file_size) });
  if (data.codec) fields.push({ label: "Codec", value: String(data.codec) });
  if (data.bit_depth) fields.push({ label: "Bit Depth", value: String(data.bit_depth) });
  if (data.filename) fields.push({ label: "Filename", value: String(data.filename) });

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
            Additional Data
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

// =============================================================================
// InputStreamViewer — renders gz keyboard/mouse data inline (ported from
// portal DataFilesPanel). Uses the share s3-proxy endpoint.
// =============================================================================

interface InputEvent {
  timeUs: number;
  event: string;
  value: string;
  device?: string;
}

function InputStreamViewer({ objectId, token, clipId }: { objectId: string; token: string; clipId: string }) {
  const [events, setEvents] = useState<InputEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const proxyRes = await fetch(
          `/api/share/${token}/s3-proxy?clipId=${encodeURIComponent(clipId)}&key=${encodeURIComponent(objectId)}`
        );
        if (!proxyRes.ok) throw new Error(`Failed to fetch: ${proxyRes.status}`);

        const buffer = await proxyRes.arrayBuffer();

        // Empty or near-empty gz files (< 30 bytes = just gzip header)
        if (buffer.byteLength < 30) {
          setEvents([]);
          return;
        }

        const ds = new DecompressionStream("gzip");
        const decompressed = new Response(
          new Blob([buffer]).stream().pipeThrough(ds)
        );
        const text = await decompressed.text();

        if (!text.trim()) {
          setEvents([]);
          return;
        }

        const parsed = text
          .trim()
          .split("\n")
          .filter((l) => l.trim())
          .map((l) => {
            try {
              return JSON.parse(l) as InputEvent;
            } catch {
              return null;
            }
          })
          .filter((e): e is InputEvent => e !== null);

        setEvents(parsed);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        console.error("[InputStreamViewer]", msg, e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [objectId, token]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 justify-center">
        <Loader2
          className="w-3 h-3 animate-spin"
          style={{ color: "var(--accent-primary)" }}
        />
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Loading input stream...
        </span>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="py-3 text-center">
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {error ?? "No input data available"}
        </span>
      </div>
    );
  }

  // Compute stats
  const keydowns = events.filter((e) => e.event === "keydown");
  const mousedowns = events.filter((e) => e.event === "mousedown");
  const mousemoves = events.filter((e) => e.event === "mousemove");
  const uniqueKeys = new Set(keydowns.map((e) => e.value));
  const durationMs = (events[events.length - 1].timeUs - events[0].timeUs) / 1000;
  const durationSec = Math.round(durationMs / 1000);

  // Show first N events
  const displayEvents = showAll ? events.slice(0, 500) : events.slice(0, 30);

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-1" style={{ color: "var(--accent-primary)" }}>
          <Keyboard className="w-3 h-3" />
          <span>{keydowns.length} key presses</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: "var(--accent-primary)" }}>
          <Mouse className="w-3 h-3" />
          <span>{mousedowns.length} clicks</span>
        </div>
        <span style={{ color: "var(--text-muted)" }}>{mousemoves.length} mouse moves</span>
        <span style={{ color: "var(--text-muted)" }}>{uniqueKeys.size} unique keys</span>
        <span style={{ color: "var(--text-muted)" }}>{durationSec}s duration</span>
      </div>

      {/* Unique keys used */}
      <div className="flex flex-wrap gap-1">
        {Array.from(uniqueKeys)
          .sort()
          .map((key) => (
            <span
              key={key}
              className="inline-block px-1.5 py-0.5 rounded font-mono text-[10px] border"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              {key}
            </span>
          ))}
      </div>

      {/* Event stream */}
      <div
        className="max-h-[300px] overflow-y-auto rounded border"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--bg-primary)",
        }}
      >
        <table className="w-full text-[10px] font-mono">
          <thead
            className="sticky top-0"
            style={{ background: "var(--bg-secondary)" }}
          >
            <tr style={{ color: "var(--text-muted)" }}>
              <th className="text-left px-2 py-1.5">Time</th>
              <th className="text-left px-2 py-1.5">Event</th>
              <th className="text-left px-2 py-1.5">Value</th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((ev, i) => {
              const timeSec = (
                (ev.timeUs - events[0].timeUs) /
                1_000_000
              ).toFixed(2);
              const isKey =
                ev.event === "keydown" || ev.event === "keyup";
              const isMouse =
                ev.event === "mousedown" || ev.event === "mouseup";
              return (
                <tr
                  key={i}
                  className="border-t"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: isKey
                      ? "var(--accent-primary)"
                      : isMouse
                        ? "var(--text-secondary)"
                        : "var(--text-muted)",
                  }}
                >
                  <td className="px-2 py-1 tabular-nums opacity-60">
                    {timeSec}s
                  </td>
                  <td className="px-2 py-1">{ev.event}</td>
                  <td className="px-2 py-1">{ev.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {events.length > 30 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[10px] font-mono hover:underline"
          style={{ color: "var(--accent-primary)" }}
        >
          Show more ({events.length.toLocaleString()} total events) &rarr;
        </button>
      )}
      {showAll && events.length > 500 && (
        <span
          className="text-[10px] font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Showing first 500 of {events.length.toLocaleString()} events
        </span>
      )}
    </div>
  );
}

// =============================================================================
// InputStreamPanel — wraps InputStreamViewer for tab integration
// =============================================================================

function InputStreamPanel({
  data,
  token,
}: {
  data: Record<string, unknown>;
  token: string;
}) {
  const gzFiles = data.gzFiles as Array<Record<string, unknown>> | undefined;
  const clipId = String(data.clipId ?? "");

  if (!gzFiles || gzFiles.length === 0) {
    return (
      <div
        className="font-mono text-xs text-center py-4"
        style={{ color: "var(--text-muted)" }}
      >
        No input stream data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gzFiles.map((file, idx) => {
        const objectId = String(file.objectId ?? "");
        const filename = objectId.split("/").pop() ?? objectId;
        return (
          <div
            key={objectId || idx}
            className="border rounded-lg p-3"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--bg-primary)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Keyboard
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--accent-primary)" }}
              />
              <span
                className="font-mono text-xs"
                style={{ color: "var(--accent-primary)" }}
              >
                Input Stream
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--text-muted)" }}
              >
                {filename}
              </span>
            </div>
            <InputStreamViewer objectId={objectId} token={token} clipId={clipId} />
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// AnnotationPanel — structured display with game info and filtered fields
// =============================================================================

/** Internal / sensitive fields to hide from annotation display */
const ANNOTATION_HIDDEN_KEYS = new Set([
  "userId",
  "reviewerId",
  "payoutId",
  "amount",
  "paymentStatus",
  "paymentDate",
  "cost",
  "browserMetadata",
  "rejectionReason",
  "rejectionCount",
  "isTestTemplate",
  "files",
]);

function AnnotationPanel({ data }: { data: Record<string, unknown> }) {
  // Extract game info from generalData.selectedGame
  const generalData = data.generalData as Record<string, unknown> | undefined;
  const selectedGame = generalData?.selectedGame as string | undefined;

  // Filter out hidden keys
  const filteredData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!ANNOTATION_HIDDEN_KEYS.has(key)) {
      filteredData[key] = value;
    }
  }

  const hasFilteredData = Object.keys(filteredData).length > 0;

  return (
    <div className="space-y-4">
      {/* Game info highlight */}
      {selectedGame && (
        <div
          className="flex items-center gap-2.5 p-3 rounded-lg border"
          style={{
            background: "var(--accent-glow)",
            borderColor: "var(--border-accent)",
          }}
        >
          <Gamepad2
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--accent-primary)" }}
          />
          <div>
            <span
              className="block text-[10px] font-mono uppercase tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              Game
            </span>
            <span
              className="font-mono text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {selectedGame}
            </span>
          </div>
        </div>
      )}

      {/* Filtered JSON dump */}
      {hasFilteredData ? (
        <pre
          className="font-mono text-[11px] whitespace-pre-wrap break-all max-h-[60vh] overflow-y-auto rounded-md p-3 border"
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-tertiary)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {JSON.stringify(filteredData, null, 2)}
        </pre>
      ) : (
        <div
          className="font-mono text-xs text-center py-4"
          style={{ color: "var(--text-muted)" }}
        >
          No annotation data available.
        </div>
      )}
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
  clipRef,
  onClick,
}: {
  clip: ShareClip;
  currentUrl: string;
  clipRef: string;
  onClick: () => void;
}) {
  const [refCopied, setRefCopied] = useState(false);

  const handleCopyRef = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(clipRef).then(() => {
        setRefCopied(true);
        setTimeout(() => setRefCopied(false), 1500);
      }).catch(() => {});
    },
    [clipRef]
  );

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
          preload="auto"
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
        {/* Mobile gradient caption fallback for iOS Safari cellular */}
        <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none sm:hidden">
          <span className="text-xs text-white/70 line-clamp-2 font-mono">
            {clip.caption || clip.filename || "Video clip"}
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            role="button"
            tabIndex={0}
            onClick={handleCopyRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCopyRef(e as unknown as React.MouseEvent);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] border cursor-pointer transition-colors duration-150 select-none flex-shrink-0"
            style={{
              background: refCopied ? "var(--accent-glow)" : "var(--bg-tertiary)",
              borderColor: refCopied ? "var(--border-accent)" : "var(--border-subtle)",
              color: refCopied ? "var(--accent-primary)" : "var(--text-muted)",
            }}
            title="Click to copy reference ID"
          >
            {refCopied ? (
              <>
                <Check className="w-2.5 h-2.5" />
                Copied
              </>
            ) : (
              clipRef
            )}
          </span>
          {clip.filename && (
            <p
              className="font-mono text-xs truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {clip.filename}
            </p>
          )}
        </div>
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
  clipRef,
  onClose,
  onNavigate,
  clipUrls,
  onRefreshUrls,
  token,
}: {
  clips: ShareClip[];
  selectedIndex: number;
  clipRef: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
  clipUrls: Map<string, string>;
  onRefreshUrls: () => Promise<Map<string, string>>;
  token: string;
}) {
  const [copied, setCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Annotation JSON fetched from S3 (keystroke/input data)
  const [annotationData, setAnnotationData] = useState<Record<string, unknown> | null>(null);
  const [annotationLoading, setAnnotationLoading] = useState(false);

  const clip = clips[selectedIndex];
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < clips.length - 1;

  // Fetch annotation JSON via server-side proxy (avoids S3 CORS)
  useEffect(() => {
    if (!clip.hasAnnotation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnnotationData(null);
      return;
    }
    let cancelled = false;
    setAnnotationLoading(true);
    setAnnotationData(null);
    fetch(`/api/share/${token}/annotation?clipId=${clip.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setAnnotationData(data as Record<string, unknown> | null);
          setAnnotationLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setAnnotationLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clip.hasAnnotation, clip.id, token]);

  // Get current URL for this clip (may have been refreshed)
  const currentUrl = clipUrls.get(clip.id) ?? clip.signedUrl;

  // Build tabs for this clip
  const tabs = useMemo<TabDefinition[]>(() => {
    const result: TabDefinition[] = [];

    // Annotation panel — merge inline metadata with fetched S3 annotation data
    const mergedAnnotation: Record<string, unknown> = {
      ...(clip.metadata ?? {}),
      ...(annotationData ?? {}),
    };
    if (Object.keys(mergedAnnotation).length > 0) {
      result.push({
        type: "annotation",
        label: annotationLoading ? "Annotation..." : "Annotation",
        icon: FileJson,
        data: mergedAnnotation,
      });
    }

    // Input Stream tab — if annotation files[] has .gz files
    const rawFiles = annotationData?.files;
    if (Array.isArray(rawFiles)) {
      const gzFiles = (rawFiles as Array<Record<string, unknown>>).filter(
        (f) => {
          const oid = String(f.objectId ?? "").toLowerCase();
          return oid.endsWith(".gz");
        }
      );
      if (gzFiles.length > 0) {
        result.push({
          type: "input_stream",
          label: "Input Stream",
          icon: Keyboard,
          data: { gzFiles, clipId: clip.id },
        });
      }
    }

    // AI Enrichment panel
    if (clip.enrichment && Object.keys(clip.enrichment).length > 0) {
      result.push({
        type: "enrichment",
        label: "Scene",
        icon: Eye,
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
  }, [clip, annotationData, annotationLoading]);

  // Merged JSON for copy — includes fetched annotation data
  const mergedJson = useMemo(() => {
    const merged: Record<string, unknown> = {};
    const mergedAnnotation: Record<string, unknown> = {
      ...(clip.metadata ?? {}),
      ...(annotationData ?? {}),
    };
    if (Object.keys(mergedAnnotation).length > 0) merged.annotation = mergedAnnotation;
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
  }, [clip, annotationData]);

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
    setRefCopied(false);
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
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 hover:scale-105 hover:bg-white/20"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "rgba(255, 255, 255, 0.9)",
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
          className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 hover:scale-105 hover:bg-white/20"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.9)",
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
          className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 hover:scale-105 hover:bg-white/20"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.9)",
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
                role="button"
                tabIndex={0}
                onClick={() => {
                  navigator.clipboard.writeText(clipRef).then(() => {
                    setRefCopied(true);
                    setTimeout(() => setRefCopied(false), 1500);
                  }).catch(() => {});
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigator.clipboard.writeText(clipRef).then(() => {
                      setRefCopied(true);
                      setTimeout(() => setRefCopied(false), 1500);
                    }).catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[10px] border cursor-pointer transition-colors duration-150 select-none flex-shrink-0"
                style={{
                  background: refCopied ? "var(--accent-glow)" : "var(--bg-tertiary)",
                  borderColor: refCopied ? "var(--border-accent)" : "var(--border-subtle)",
                  color: refCopied ? "var(--accent-primary)" : "var(--text-muted)",
                }}
                title="Click to copy reference ID"
              >
                {refCopied ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    Copied
                  </>
                ) : (
                  clipRef
                )}
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
              <DataPanelTabs tabs={tabs} token={token} />
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
  const [searchQuery, setSearchQuery] = useState("");
  const [clipUrls, setClipUrls] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const c of clips) {
      map.set(c.id, c.signedUrl);
    }
    return map;
  });

  // Build a stable map from clip.id -> 1-indexed reference string
  const clipRefMap = useMemo(() => {
    const m = new Map<string, string>();
    clips.forEach((c, i) => {
      m.set(c.id, `CLIP-${String(i + 1).padStart(3, "0")}`);
    });
    return m;
  }, [clips]);

  // Client-side search filter
  const filteredClips = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clips;
    return clips.filter((clip) => {
      const filename = (clip.filename ?? "").toLowerCase();
      const caption = (clip.caption ?? "").toLowerCase();
      const environment = String(
        (clip.metadata as Record<string, unknown> | null)?.environment ?? ""
      ).toLowerCase();
      const activities = String(
        (clip.metadata as Record<string, unknown> | null)?.activities ?? ""
      ).toLowerCase();
      return (
        filename.includes(q) ||
        caption.includes(q) ||
        environment.includes(q) ||
        activities.includes(q)
      );
    });
  }, [clips, searchQuery]);

  // Deep link: on mount, check hash and open matching clip
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#clip-")) return;
    const shortId = hash.slice(6); // strip "#clip-"
    const idx = clips.findIndex((c) => c.id.startsWith(shortId));
    if (idx >= 0) {
      setSelectedIndex(idx);
    }
  }, [clips]);

  // Deep link: update hash when modal opens/closes/navigates
  const openClipModal = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const clip = clips[index];
      if (clip) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#clip-${clip.id.slice(0, 8)}`
        );
      }
    },
    [clips]
  );

  const closeClipModal = useCallback(() => {
    setSelectedIndex(null);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }, []);

  const navigateClipModal = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const clip = clips[index];
      if (clip) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#clip-${clip.id.slice(0, 8)}`
        );
      }
    },
    [clips]
  );

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
            {searchQuery.trim()
              ? `${filteredClips.length} of ${clips.length} clips`
              : `${clips.length} ${clips.length === 1 ? "clip" : "clips"}`}
          </p>
        </div>

        {/* Search bar */}
        {clips.length > 0 && (
          <div className="mb-6">
            <div
              className="relative max-w-md"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filename, caption, environment..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border font-mono text-xs outline-none transition-colors duration-200 focus:ring-1"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px var(--border-accent)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center transition-colors duration-150"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

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
        ) : filteredClips.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <Search
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
              No clips match &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClips.map((clip) => {
              const globalIndex = clips.indexOf(clip);
              return (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  clipRef={clipRefMap.get(clip.id) ?? `CLIP-${String(globalIndex + 1).padStart(3, "0")}`}
                  currentUrl={clipUrls.get(clip.id) ?? clip.signedUrl}
                  onClick={() => openClipModal(globalIndex)}
                />
              );
            })}
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
          clipRef={clipRefMap.get(clips[selectedIndex]?.id ?? "") ?? `CLIP-${String(selectedIndex + 1).padStart(3, "0")}`}
          onClose={closeClipModal}
          onNavigate={navigateClipModal}
          clipUrls={clipUrls}
          onRefreshUrls={refreshUrls}
          token={token}
        />
      )}
    </div>
  );
}
