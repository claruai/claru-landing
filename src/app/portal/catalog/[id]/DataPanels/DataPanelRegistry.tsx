import React from "react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { FileJson, Gamepad2, Archive, Sparkles, Cpu, Bot } from "lucide-react";

import { GameSpecsPanel } from "./GameSpecsPanel";
import { DataFilesPanel } from "./DataFilesPanel";
import { MetaTable } from "../MetaTable";
import JsonTree from "@/app/components/catalog/JsonTree";

// =============================================================================
// DataPanelRegistry -- Extensible panel type registry for DataPanelTabs
//
// To add a new panel type:
//   1. Create a component that accepts DataPanelProps
//   2. Register it here with a unique key, label, and icon
//   3. No changes to DataPanelTabs needed
// =============================================================================

// ---------------------------------------------------------------------------
// Shared panel props interface
// ---------------------------------------------------------------------------

export interface DataPanelProps {
  data: Record<string, unknown>;
  sampleId: string;
  apiBase?: string;
}

// ---------------------------------------------------------------------------
// Registry entry shape
// ---------------------------------------------------------------------------

export interface PanelRegistryEntry {
  component: ComponentType<DataPanelProps>;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// MetaTableAdapter -- thin adapter wrapping MetaTable for the registry
// ---------------------------------------------------------------------------

function MetaTableAdapter({ data }: DataPanelProps) {
  return <MetaTable metadata={data} />;
}

function EnrichmentAdapter({ data }: DataPanelProps) {
  return <JsonTree data={data} />;
}

// ---------------------------------------------------------------------------
// AIEnrichmentPanel -- displays ai_caption, ai_agent_context, ai_enrichment_json
// ---------------------------------------------------------------------------

/** Render a text paragraph with a label. */
function TextSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

/** Render a list of tags/chips. */
function TagSection({ label, items, accent = false }: { label: string; items: string[]; accent?: boolean }) {
  return (
    <div>
      <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs ${
              accent
                ? "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]"
                : "bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Internal fields to skip -- already represented in the caption or not user-facing. */
const SKIP_ENRICHMENT_KEYS = new Set([
  "captions_seed", "captions_usage_metadata", "text_short", "text",
]);

/**
 * Known enrichment field labels. Covers both cobry parquet layers
 * (text_foreground, etc.) and troveo clip_annotations
 * (simple_description, detailed_description, etc.).
 */
const ENRICHMENT_TEXT_FIELDS: Record<string, string> = {
  // Cobry multi-layer captions
  text_foreground: "Foreground",
  text_middleground: "Middleground",
  text_background: "Background",
  // Troveo clip_annotations
  simple_description: "Description",
  detailed_description: "Detailed Description",
  foreground_description: "Foreground",
  middleground_description: "Middleground",
  background_description: "Background",
  main_characters: "Characters",
  main_activities: "Activities",
  main_objects: "Objects",
  camera_movement: "Camera Movement",
  style: "Style",
};

function AIEnrichmentPanel({ data }: DataPanelProps) {
  // --- Explicitly handled ai_agent_context fields ---
  const caption = data.caption as string | undefined;
  const sceneSummary = data.scene_summary as string | undefined;
  const environments = data.environments as string[] | undefined;
  const activities = data.activities as string[] | undefined;
  const objects = data.objects as string[] | undefined;
  const cameraPerspective = data.camera_perspective as string | undefined;

  // --- ai_enrichment_json text fields (cobry + troveo) ---
  const enrichmentTextSections: Array<{ label: string; text: string }> = [];
  for (const [key, label] of Object.entries(ENRICHMENT_TEXT_FIELDS)) {
    const val = data[key];
    if (typeof val === "string" && val.trim()) {
      enrichmentTextSections.push({ label, text: val });
    }
  }

  // Collect all handled keys to determine extras
  const handledKeys = new Set([
    "caption", "scene_summary", "environments", "activities", "objects", "camera_perspective",
    ...Object.keys(ENRICHMENT_TEXT_FIELDS),
    ...SKIP_ENRICHMENT_KEYS,
  ]);
  const extraKeys = Object.keys(data).filter((k) => !handledKeys.has(k));

  return (
    <div className="space-y-4">
      {/* --- Caption (from ai_caption) --- */}
      {caption && <TextSection label="Caption" text={caption} />}

      {/* --- Scene Summary (from ai_agent_context) --- */}
      {sceneSummary && <TextSection label="Scene Summary" text={sceneSummary} />}

      {/* --- Environments (from ai_agent_context) --- */}
      {environments && environments.length > 0 && (
        <TagSection label="Environments" items={environments} accent />
      )}

      {/* --- Activities (from ai_agent_context) --- */}
      {activities && activities.length > 0 && (
        <TagSection label="Activities" items={activities} accent />
      )}

      {/* --- Objects (from ai_agent_context) --- */}
      {objects && objects.length > 0 && (
        <TagSection label="Objects" items={objects} />
      )}

      {/* --- Camera Perspective (from ai_agent_context) --- */}
      {cameraPerspective && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Camera Perspective
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {cameraPerspective}
          </span>
        </div>
      )}

      {/* --- Enrichment text fields (cobry layers + troveo annotations) --- */}
      {enrichmentTextSections.length > 0 && (
        <>
          <div className="border-t border-[var(--border-subtle)] pt-3 mt-1">
            <span className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Enrichment Layers
            </span>
          </div>
          {enrichmentTextSections.map(({ label, text }) => (
            <TextSection key={label} label={label} text={text} />
          ))}
        </>
      )}

      {/* --- Extra keys rendered as JSON tree --- */}
      {extraKeys.length > 0 && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Additional AI Data
          </span>
          <JsonTree data={Object.fromEntries(extraKeys.map((k) => [k, data[k]]))} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TechnicalPanel -- displays resolution, fps, duration, codec, file size
// ---------------------------------------------------------------------------

function TechnicalPanel({ data }: DataPanelProps) {
  const fields: Array<{ label: string; value: string }> = [];

  if (data.resolution) fields.push({ label: "Resolution", value: String(data.resolution) });
  if (data.aspect_ratio) fields.push({ label: "Aspect Ratio", value: String(data.aspect_ratio) });
  if (data.fps) fields.push({ label: "FPS", value: String(data.fps) });
  if (data.duration) fields.push({ label: "Duration", value: String(data.duration) });
  if (data.codec) fields.push({ label: "Codec", value: String(data.codec) });
  if (data.file_size) fields.push({ label: "File Size", value: String(data.file_size) });
  if (data.bit_depth) fields.push({ label: "Bit Depth", value: `${data.bit_depth}-bit` });

  if (fields.length === 0) {
    return (
      <div className="font-mono text-xs text-[var(--text-muted)] text-center py-4">
        No technical metadata available.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {fields.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-baseline gap-3 py-2.5 border-b border-[var(--border-subtle)] last:border-b-0"
        >
          <span className="font-mono text-xs text-[var(--text-muted)] flex-shrink-0 w-28 text-right">
            {label}
          </span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel registry
// ---------------------------------------------------------------------------

export const PANEL_REGISTRY: Record<string, PanelRegistryEntry> = {
  annotation: {
    component: EnrichmentAdapter,
    label: "Annotation",
    icon: FileJson,
  },
  ai_enrichment: {
    component: AIEnrichmentPanel,
    label: "Enrichment",
    icon: Bot,
  },
  technical: {
    component: TechnicalPanel,
    label: "Technical",
    icon: Cpu,
  },
  game_specs: {
    component: GameSpecsPanel,
    label: "Game Specs",
    icon: Gamepad2,
  },
  data_files: {
    component: DataFilesPanel,
    label: "Data Files",
    icon: Archive,
  },
  enrichment: {
    component: EnrichmentAdapter,
    label: "Enrichment",
    icon: Sparkles,
  },
};
