"use client";

import { Gamepad2 } from "lucide-react";
import type { DataPanelProps } from "./DataPanelRegistry";

// =============================================================================
// GameSpecsPlaceholder -- Placeholder panel for game_specs type (US-018)
// =============================================================================

export function GameSpecsPlaceholder(_props: DataPanelProps) {
  return (
    <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] p-8 flex flex-col items-center justify-center gap-3">
      <Gamepad2 className="w-8 h-8 text-[var(--text-muted)]" />
      <span className="font-mono text-sm text-[var(--text-muted)]">
        Game specs panel (coming soon)
      </span>
    </div>
  );
}
