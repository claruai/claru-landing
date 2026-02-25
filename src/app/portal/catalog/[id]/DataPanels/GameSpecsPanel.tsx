"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DataPanelProps } from "./DataPanelRegistry";

// =============================================================================
// GameSpecsPanel -- Structured display of game & PC specifications
//
// Sections: SYSTEM, GAME, DISPLAY, APPLICATION
// Unknown top-level keys fall through to a collapsible "Raw Specs" JSON viewer.
// Empty/null field values are silently skipped.
// =============================================================================

// ---------------------------------------------------------------------------
// Known top-level keys (used to detect unknown/raw fields)
// ---------------------------------------------------------------------------

const KNOWN_KEYS = new Set(["System", "Game", "Displays", "Application"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return undefined for null, undefined, or empty-string values. */
function nonEmpty(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return String(value);
}

/** Format VRAM from MB to a human-friendly string (e.g. "8192 MB" -> "8 GB"). */
function formatVRAM(mb: unknown): string | undefined {
  if (mb === null || mb === undefined) return undefined;
  const n = Number(mb);
  if (Number.isNaN(n)) return nonEmpty(mb);
  if (n >= 1024) return `${(n / 1024).toFixed(n % 1024 === 0 ? 0 : 1)} GB`;
  return `${n} MB`;
}

/** Format RAM from GB to a human-friendly string (e.g. 31.89 -> "32 GB"). */
function formatRAM(gb: unknown): string | undefined {
  if (gb === null || gb === undefined) return undefined;
  const n = Number(gb);
  if (Number.isNaN(n)) return nonEmpty(gb);
  return `${Math.round(n)} GB`;
}

/** Format a resolution display entry as "WxH@HzHz". */
function formatDisplay(d: Record<string, unknown>): string {
  const w = d.Width ?? d.width;
  const h = d.Height ?? d.height;
  const hz = d.RefreshRate ?? d.refreshRate;
  const parts: string[] = [];
  if (w != null && h != null) parts.push(`${w}x${h}`);
  if (hz != null) parts.push(`@${hz}Hz`);
  return parts.join("") || "Unknown";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Terminal-styled section header: `// SECTION_NAME` in accent color. */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="font-mono text-xs tracking-wider text-[var(--accent-primary)] mb-2 mt-1 select-none">
      // {label}
    </div>
  );
}

/** A single key-value row rendered in monospace. */
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 font-mono text-xs leading-relaxed py-0.5">
      <span className="text-[var(--text-muted)] min-w-[140px] shrink-0">
        {label}
      </span>
      <span className="text-[var(--text-secondary)] break-all">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

interface SystemData {
  OperatingSystem?: unknown;
  ProcessorName?: unknown;
  GraphicsCards?: Array<Record<string, unknown>>;
  TotalMemoryGB?: unknown;
  Architecture?: unknown;
  [key: string]: unknown;
}

function SystemSection({ system }: { system: SystemData }) {
  const rows: Array<{ label: string; value: string }> = [];

  const os = nonEmpty(system.OperatingSystem);
  if (os) rows.push({ label: "OS", value: os });

  const cpu = nonEmpty(system.ProcessorName);
  if (cpu) rows.push({ label: "CPU", value: cpu });

  // GPU(s) -- may have multiple graphics cards
  const cards = system.GraphicsCards;
  if (Array.isArray(cards)) {
    cards.forEach((card, i) => {
      const name = nonEmpty(card.Name ?? card.name);
      const vram = formatVRAM(card.VideoMemoryMB ?? card.videoMemoryMB);
      if (name) {
        const gpuLabel = cards.length > 1 ? `GPU ${i + 1}` : "GPU";
        const gpuValue = vram ? `${name} (${vram})` : name;
        rows.push({ label: gpuLabel, value: gpuValue });
      }
    });
  }

  const ram = formatRAM(system.TotalMemoryGB);
  if (ram) rows.push({ label: "RAM", value: ram });

  const arch = nonEmpty(system.Architecture);
  if (arch) rows.push({ label: "Architecture", value: arch });

  if (rows.length === 0) return null;

  return (
    <div>
      <SectionHeader label="SYSTEM" />
      {rows.map((r) => (
        <FieldRow key={r.label} label={r.label} value={r.value} />
      ))}
    </div>
  );
}

interface GameData {
  GameName?: unknown;
  ProcessName?: unknown;
  WindowTitle?: unknown;
  [key: string]: unknown;
}

function GameSection({ game }: { game: GameData }) {
  const rows: Array<{ label: string; value: string }> = [];

  const name = nonEmpty(game.GameName);
  if (name) rows.push({ label: "Game", value: name });

  const proc = nonEmpty(game.ProcessName);
  if (proc) rows.push({ label: "Process", value: proc });

  const title = nonEmpty(game.WindowTitle);
  if (title) rows.push({ label: "Window Title", value: title });

  if (rows.length === 0) return null;

  return (
    <div>
      <SectionHeader label="GAME" />
      {rows.map((r) => (
        <FieldRow key={r.label} label={r.label} value={r.value} />
      ))}
    </div>
  );
}

function DisplaySection({ displays }: { displays: Array<Record<string, unknown>> }) {
  if (!Array.isArray(displays) || displays.length === 0) return null;

  const rows: Array<{ label: string; value: string }> = [];

  displays.forEach((d, i) => {
    const label = displays.length > 1 ? `Display ${i + 1}` : "Resolution";
    rows.push({ label, value: formatDisplay(d) });

    const hz = d.RefreshRate ?? d.refreshRate;
    if (hz != null && displays.length === 1) {
      rows.push({ label: "Refresh Rate", value: `${hz} Hz` });
    }

    const primary = d.Primary ?? d.primary ?? d.IsPrimary;
    if (primary != null) {
      rows.push({
        label: displays.length > 1 ? `Primary ${i + 1}` : "Primary",
        value: primary ? "Yes" : "No",
      });
    }
  });

  if (rows.length === 0) return null;

  return (
    <div>
      <SectionHeader label="DISPLAY" />
      {rows.map((r, i) => (
        <FieldRow key={`${r.label}-${i}`} label={r.label} value={r.value} />
      ))}
    </div>
  );
}

interface ApplicationData {
  Version?: unknown;
  BuildDate?: unknown;
  [key: string]: unknown;
}

function ApplicationSection({ app }: { app: ApplicationData }) {
  const rows: Array<{ label: string; value: string }> = [];

  const version = nonEmpty(app.Version);
  if (version) rows.push({ label: "Version", value: version });

  const build = nonEmpty(app.BuildDate);
  if (build) rows.push({ label: "Build Date", value: build });

  if (rows.length === 0) return null;

  return (
    <div>
      <SectionHeader label="APPLICATION" />
      {rows.map((r) => (
        <FieldRow key={r.label} label={r.label} value={r.value} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Raw specs fallback (collapsible JSON viewer)
// ---------------------------------------------------------------------------

function RawSpecsSection({ rawData }: { rawData: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);

  if (Object.keys(rawData).length === 0) return null;

  return (
    <div className="border-t border-[var(--border-subtle)] pt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 group"
        aria-expanded={open}
      >
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
        <span>// RAW SPECS</span>
        <span className="text-[var(--text-muted)]/60 ml-1">
          ({Object.keys(rawData).length} field{Object.keys(rawData).length !== 1 ? "s" : ""})
        </span>
      </button>

      {open && (
        <div className="mt-2 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-3 overflow-x-auto">
          <pre className="font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
            <code>{JSON.stringify(rawData, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function GameSpecsPanel({ data }: DataPanelProps) {
  // Extract known sections from the data object.
  const system = data.System as SystemData | undefined;
  const game = data.Game as GameData | undefined;
  const displays = data.Displays as Array<Record<string, unknown>> | undefined;
  const application = data.Application as ApplicationData | undefined;

  // Collect any unknown top-level keys into a raw data bucket.
  const rawData: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.has(key)) {
      rawData[key] = data[key];
    }
  }

  // Check if there's nothing to render at all.
  const hasSystem = system != null && Object.keys(system).length > 0;
  const hasGame = game != null && Object.keys(game).length > 0;
  const hasDisplays = Array.isArray(displays) && displays.length > 0;
  const hasApplication = application != null && Object.keys(application).length > 0;
  const hasRaw = Object.keys(rawData).length > 0;

  if (!hasSystem && !hasGame && !hasDisplays && !hasApplication && !hasRaw) {
    return (
      <div className="font-mono text-xs text-[var(--text-muted)] text-center py-6">
        No game specs data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasSystem && <SystemSection system={system!} />}
      {hasGame && <GameSection game={game!} />}
      {hasDisplays && <DisplaySection displays={displays!} />}
      {hasApplication && <ApplicationSection app={application!} />}
      {hasRaw && <RawSpecsSection rawData={rawData} />}
    </div>
  );
}
