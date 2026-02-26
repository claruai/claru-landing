import React from "react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { FileJson, Gamepad2, Archive } from "lucide-react";

import { GameSpecsPanel } from "./GameSpecsPanel";
import { DataFilesPanel } from "./DataFilesPanel";
import { MetaTable } from "../MetaTable";

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

// ---------------------------------------------------------------------------
// Panel registry
// ---------------------------------------------------------------------------

export const PANEL_REGISTRY: Record<string, PanelRegistryEntry> = {
  annotation: {
    component: MetaTableAdapter,
    label: "Annotation",
    icon: FileJson,
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
};
