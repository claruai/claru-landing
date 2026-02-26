"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// =============================================================================
// MetaTable -- Structured metadata display with FIELD_LABELS (US-007)
// Renders annotation metadata in a readable, terminal-aesthetic format.
// Tier 1: Known fields via FIELD_LABELS with structured formatting.
// Tier 2: Remaining unknown fields in collapsible Raw Metadata JSON view.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MetaTableProps {
  metadata: Record<string, unknown>;
  annotationData?: Record<string, unknown> | null;
}

type Formatter = (value: unknown) => React.ReactNode | null;

interface FieldLabel {
  /** Dot-notation path into the metadata object, e.g. "technical_specs.duration_s" */
  path: string;
  /** Human-readable display label */
  label: string;
  /** Render style hint */
  display: "badge" | "paragraph" | "text" | "number" | "percentage" | "yes-no" | "badges";
  /** Optional custom formatter; if it returns null the field is skipped */
  formatter?: Formatter;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely access a nested property via dot-notation path */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Check if a value is empty / should be skipped */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/** Format duration in seconds to readable string: '9s' or '3m 06s' */
function formatDuration(value: unknown): React.ReactNode | null {
  const seconds = typeof value === "number" ? value : Number(value);
  if (isNaN(seconds) || seconds <= 0) return null;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

/** Format resolution: '1920 x 1080' */
function formatResolution(value: unknown): React.ReactNode | null {
  if (typeof value === "string" && value.includes("x")) return value;
  // Handle [width, height] array format
  if (Array.isArray(value) && value.length === 2) {
    return `${value[0]} x ${value[1]}`;
  }
  // Handle "1920x1080" string format (no spaces)
  if (typeof value === "string") {
    const match = value.match(/^(\d+)\s*[xX]\s*(\d+)$/);
    if (match) return `${match[1]} x ${match[2]}`;
  }
  if (typeof value === "number") return String(value);
  return value != null ? String(value) : null;
}

/** Format a value as a percentage string */
function formatPercentage(value: unknown): React.ReactNode | null {
  if (typeof value === "number") {
    // If value is between 0 and 1, treat as decimal percentage
    if (value >= 0 && value <= 1) return `${Math.round(value * 100)}%`;
    return `${Math.round(value)}%`;
  }
  if (typeof value === "string") return value;
  return null;
}

// ---------------------------------------------------------------------------
// FIELD_LABELS -- Known fields with display labels and formatters
// ---------------------------------------------------------------------------

const FIELD_LABELS: FieldLabel[] = [
  // Top-level fields
  { path: "domain", label: "Domain", display: "badge" },
  { path: "task", label: "Task", display: "paragraph" },
  { path: "task_description", label: "Task Description", display: "paragraph" },

  // Technical specs
  {
    path: "technical_specs.duration_s",
    label: "Duration",
    display: "text",
    formatter: formatDuration,
  },
  {
    path: "technical_specs.resolution_px",
    label: "Resolution",
    display: "text",
    formatter: formatResolution,
  },
  { path: "technical_specs.fps_estimate", label: "FPS", display: "number" },
  { path: "technical_specs.aspect_ratio", label: "Aspect Ratio", display: "text" },

  // Environment
  { path: "environment_label", label: "Environment", display: "badge" },
  { path: "environment_description", label: "Environment Description", display: "paragraph" },

  // Hands
  { path: "hands.hands_visible", label: "Hands Visible", display: "yes-no" },
  { path: "hands.right_hand_pct", label: "Right Hand", display: "percentage", formatter: formatPercentage },
  { path: "hands.left_hand_pct", label: "Left Hand", display: "percentage", formatter: formatPercentage },
  { path: "hands.both_hands_pct", label: "Both Hands", display: "percentage", formatter: formatPercentage },
  { path: "hands.primary_hand", label: "Primary Hand", display: "text" },
  { path: "hands.confidence", label: "Confidence", display: "percentage", formatter: formatPercentage },

  // General data
  { path: "generalData.mainCategory", label: "Main Category", display: "badge" },
  { path: "generalData.subcategory", label: "Subcategory", display: "badge" },
  { path: "generalData.flow", label: "Flow", display: "badge" },
  { path: "generalData.activities", label: "Activities", display: "badges" },
  { path: "generalData.selectedGame", label: "Game", display: "badge" },
];

// Collect all known top-level keys so we can compute the "unknown" remainder
const KNOWN_TOP_LEVEL_KEYS = new Set<string>();
for (const field of FIELD_LABELS) {
  KNOWN_TOP_LEVEL_KEYS.add(field.path.split(".")[0]);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({ children }: { children: string }) {
  return (
    <span className="block text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-3">
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
      {children}
    </span>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-[var(--border-subtle)] last:border-b-0">
      <span className="font-mono text-xs text-[var(--text-muted)] flex-shrink-0 sm:w-40 sm:text-right">
        {label}
      </span>
      <div className="font-mono text-xs text-[var(--text-secondary)] flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JSON Syntax Highlighter (reused from SampleDetailModal.tsx)
// ---------------------------------------------------------------------------

function highlightJson(jsonStr: string): React.ReactNode[] {
  const lines = jsonStr.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    const remaining = line;
    let partIdx = 0;

    const keyRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = keyRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`${lineIdx}-pre-${partIdx}`} className="text-[var(--text-secondary)]">
            {remaining.slice(lastIndex, match.index)}
          </span>
        );
        partIdx++;
      }

      parts.push(
        <span key={`${lineIdx}-key-${partIdx}`} className="text-[var(--accent-primary)]">
          {match[1]}
        </span>
      );
      partIdx++;

      parts.push(
        <span key={`${lineIdx}-colon-${partIdx}`} className="text-[var(--text-muted)]">
          :
        </span>
      );
      partIdx++;

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
      const rest = remaining.slice(lastIndex);
      const valueParts = rest.split(/("(?:[^"\\]|\\.)*")/g);
      for (const vp of valueParts) {
        if (vp.startsWith('"') && vp.endsWith('"')) {
          parts.push(
            <span key={`${lineIdx}-val-${partIdx}`} className="text-[var(--text-secondary)]">
              {vp}
            </span>
          );
        } else {
          parts.push(
            <span key={`${lineIdx}-other-${partIdx}`} className="text-[var(--text-tertiary)]">
              {vp}
            </span>
          );
        }
        partIdx++;
      }
    }

    return (
      <span key={lineIdx}>
        {parts.length > 0 ? parts : <span className="text-[var(--text-secondary)]">{line}</span>}
        {lineIdx < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Chunking Array Renderer
// Renders items like: '[0s-35s] checking_meat_tenderness (0.90)'
// ---------------------------------------------------------------------------

function formatChunkingArray(value: unknown): React.ReactNode | null {
  if (!Array.isArray(value)) return null;

  const lines: string[] = [];
  for (const item of value) {
    if (typeof item === "object" && item !== null) {
      const chunk = item as Record<string, unknown>;
      // Common chunking format: { start, end, label, confidence }
      const start = chunk.start ?? chunk.start_s ?? chunk.time_start;
      const end = chunk.end ?? chunk.end_s ?? chunk.time_end;
      const label = chunk.label ?? chunk.activity ?? chunk.action ?? chunk.description;
      const confidence = chunk.confidence ?? chunk.score;

      const timePart =
        start !== undefined && end !== undefined ? `[${start}s-${end}s]` : "";
      const labelPart = label != null ? String(label) : "";
      const confPart =
        confidence !== undefined ? `(${Number(confidence).toFixed(2)})` : "";

      const line = [timePart, labelPart, confPart].filter(Boolean).join(" ");
      if (line) lines.push(line);
    } else if (typeof item === "string") {
      lines.push(item);
    }
  }

  if (lines.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => (
        <div key={i} className="font-mono text-xs text-[var(--text-secondary)]">
          {line}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function MetaTable({ metadata, annotationData }: MetaTableProps) {
  const [rawExpanded, setRawExpanded] = useState(false);

  // Merge metadata and annotationData, with annotationData taking precedence
  const merged: Record<string, unknown> = {
    ...metadata,
    ...(annotationData ?? {}),
  };

  // Extract technical_specs from annotation MediaInfo files[] if not already present
  if (!merged.technical_specs && Array.isArray(merged.files)) {
    const files = merged.files as Array<Record<string, unknown>>;
    const videoFile = files.find((f) => {
      const oid = String(f.objectId ?? "").toLowerCase();
      return oid.endsWith(".mp4") || oid.endsWith(".mov") || oid.endsWith(".webm");
    });
    if (videoFile) {
      const tracks = (
        (videoFile.attributes as Record<string, unknown> | undefined)
          ?.media as Record<string, unknown> | undefined
      )?.track as Array<Record<string, unknown>> | undefined;

      const videoTrack = tracks?.find((t) => t["@type"] === "Video");
      const generalTrack = tracks?.find((t) => t["@type"] === "General");

      if (videoTrack || generalTrack) {
        const duration =
          (videoTrack?.Duration as number | undefined) ??
          (generalTrack?.Duration as number | undefined);
        const width = videoTrack?.Width as number | undefined;
        const height = videoTrack?.Height as number | undefined;
        const fps = videoTrack?.FrameRate as number | undefined;
        const dar = videoTrack?.DisplayAspectRatio as number | undefined;

        merged.technical_specs = {
          duration_s: duration,
          resolution_px: width && height ? { width, height } : undefined,
          fps_estimate: fps,
          aspect_ratio: dar
            ? `${Math.round(dar * 9 * 10) / 10}:9`
            : undefined,
        };
      }
    }
  }

  // -------------------------------------------------------------------------
  // Tier 1: Render known fields from FIELD_LABELS
  // -------------------------------------------------------------------------

  type RenderedField = {
    label: string;
    node: React.ReactNode;
    section: string;
  };

  const renderedFields: RenderedField[] = [];

  for (const field of FIELD_LABELS) {
    const rawValue = getNestedValue(merged, field.path);
    if (isEmpty(rawValue)) continue;

    // If a custom formatter is provided, use it
    let displayValue: React.ReactNode;

    if (field.formatter) {
      const formatted = field.formatter(rawValue);
      if (formatted === null) continue;
      displayValue = formatted;
    } else {
      // Default rendering by display type
      switch (field.display) {
        case "badge":
          displayValue = <Badge>{String(rawValue)}</Badge>;
          break;

        case "badges": {
          const items = Array.isArray(rawValue)
            ? rawValue
            : typeof rawValue === "string"
              ? rawValue.split(",").map((s) => s.trim())
              : [rawValue];
          displayValue = (
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <Badge key={i}>{String(item)}</Badge>
              ))}
            </div>
          );
          break;
        }

        case "paragraph":
          displayValue = (
            <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {String(rawValue)}
            </p>
          );
          break;

        case "yes-no":
          displayValue =
            rawValue === true || rawValue === "true" || rawValue === "yes"
              ? "Yes"
              : "No";
          break;

        case "number":
          displayValue =
            typeof rawValue === "number" ? rawValue.toLocaleString() : String(rawValue);
          break;

        case "percentage":
          displayValue = formatPercentage(rawValue);
          break;

        case "text":
        default:
          displayValue = String(rawValue);
          break;
      }
    }

    // If formatter returned a string for badge/badges types, wrap in Badge
    if (field.display === "badge" && field.formatter && typeof displayValue === "string") {
      displayValue = <Badge>{displayValue}</Badge>;
    }

    // Determine section grouping from the path prefix
    const topKey = field.path.split(".")[0];
    let section: string;
    if (topKey === "technical_specs") section = "technical";
    else if (topKey === "hands") section = "hands";
    else if (topKey === "generalData") section = "general";
    else if (topKey === "environment_label" || topKey === "environment_description")
      section = "environment";
    else section = "overview";

    renderedFields.push({ label: field.label, node: displayValue, section });
  }

  // Check for chunking arrays in merged data
  const chunkingKeys = Object.keys(merged).filter((key) => {
    const val = merged[key];
    if (!Array.isArray(val) || val.length === 0) return false;
    // Heuristic: array of objects with time/label-like keys
    const first = val[0];
    if (typeof first !== "object" || first === null) return false;
    const objKeys = Object.keys(first as Record<string, unknown>);
    return objKeys.some(
      (k) =>
        k === "start" ||
        k === "end" ||
        k === "start_s" ||
        k === "end_s" ||
        k === "time_start" ||
        k === "time_end" ||
        k === "label" ||
        k === "activity" ||
        k === "action"
    );
  });

  // -------------------------------------------------------------------------
  // Tier 2: Compute unknown (remaining) fields
  // -------------------------------------------------------------------------

  const unknownFields: Record<string, unknown> = {};
  for (const key of Object.keys(merged)) {
    if (!KNOWN_TOP_LEVEL_KEYS.has(key) && !chunkingKeys.includes(key)) {
      // Also exclude 'files' — it's MediaInfo data already consumed by technical_specs extraction
      if (key === "files") continue;
      unknownFields[key] = merged[key];
    }
  }
  const hasUnknownFields = Object.keys(unknownFields).length > 0;

  // -------------------------------------------------------------------------
  // Group rendered fields by section for display
  // -------------------------------------------------------------------------

  const sections = [
    { key: "overview", header: "// OVERVIEW" },
    { key: "technical", header: "// TECHNICAL SPECS" },
    { key: "environment", header: "// ENVIRONMENT" },
    { key: "hands", header: "// HANDS" },
    { key: "general", header: "// GENERAL DATA" },
  ];

  const hasTier1Fields = renderedFields.length > 0 || chunkingKeys.length > 0;

  if (!hasTier1Fields && !hasUnknownFields) {
    return (
      <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] p-6">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          No metadata available.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier 1: Known structured fields */}
      {sections.map(({ key, header }) => {
        const sectionFields = renderedFields.filter((f) => f.section === key);
        if (sectionFields.length === 0) return null;

        return (
          <div
            key={key}
            className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
              <SectionHeader>{header}</SectionHeader>
            </div>
            <div className="px-4 py-2">
              {sectionFields.map((field, i) => (
                <FieldRow key={i} label={field.label}>
                  {field.node}
                </FieldRow>
              ))}
            </div>
          </div>
        );
      })}

      {/* Chunking arrays */}
      {chunkingKeys.map((key) => {
        const formatted = formatChunkingArray(merged[key]);
        if (!formatted) return null;

        const displayKey = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div
            key={key}
            className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
              <SectionHeader>{`// ${displayKey.toUpperCase()}`}</SectionHeader>
            </div>
            <div className="px-4 py-3">{formatted}</div>
          </div>
        );
      })}

      {/* Tier 2: Unknown fields in collapsible Raw Metadata section */}
      {hasUnknownFields && (
        <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] overflow-hidden">
          <button
            type="button"
            onClick={() => setRawExpanded((prev) => !prev)}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-primary)]/70 transition-colors duration-200 cursor-pointer"
            aria-expanded={rawExpanded}
          >
            {rawExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            )}
            <span className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider">
              {"// RAW METADATA"}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] ml-auto">
              {Object.keys(unknownFields).length} field
              {Object.keys(unknownFields).length !== 1 ? "s" : ""}
            </span>
          </button>

          {rawExpanded && (
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                <code>
                  {highlightJson(JSON.stringify(unknownFields, null, 2))}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
