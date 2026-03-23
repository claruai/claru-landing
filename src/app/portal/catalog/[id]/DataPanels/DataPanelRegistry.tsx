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
// AIEnrichmentPanel -- displays ai_caption, ai_agent_context fields
// ---------------------------------------------------------------------------

function AIEnrichmentPanel({ data }: DataPanelProps) {
  const caption = data.caption as string | undefined;
  const sceneSummary = data.scene_summary as string | undefined;
  const environments = data.environments as string[] | undefined;
  const activities = data.activities as string[] | undefined;
  const objects = data.objects as string[] | undefined;
  const cameraPerspective = data.camera_perspective as string | undefined;

  // Collect remaining keys not explicitly handled above
  const handledKeys = new Set(["caption", "scene_summary", "environments", "activities", "objects", "camera_perspective"]);
  const extraKeys = Object.keys(data).filter((k) => !handledKeys.has(k));

  return (
    <div className="space-y-4">
      {caption && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            AI Caption
          </span>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {caption}
          </p>
        </div>
      )}

      {sceneSummary && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Scene Summary
          </span>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {sceneSummary}
          </p>
        </div>
      )}

      {environments && environments.length > 0 && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Environments
          </span>
          <div className="flex flex-wrap gap-1.5">
            {environments.map((env, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
                {env}
              </span>
            ))}
          </div>
        </div>
      )}

      {activities && activities.length > 0 && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Activities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activities.map((act, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {objects && objects.length > 0 && (
        <div>
          <span className="block text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
            Objects
          </span>
          <div className="flex flex-wrap gap-1.5">
            {objects.map((obj, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {/* Extra keys rendered as JSON tree */}
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
    label: "AI Enrichment",
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
