import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { FileJson, Gamepad2 } from "lucide-react";

import { AnnotationPanelWrapper } from "./AnnotationPanelWrapper";
import { GameSpecsPlaceholder } from "./GameSpecsPlaceholder";

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
// Panel registry
// ---------------------------------------------------------------------------

export const PANEL_REGISTRY: Record<string, PanelRegistryEntry> = {
  annotation: {
    component: AnnotationPanelWrapper,
    label: "Annotation",
    icon: FileJson,
  },
  game_specs: {
    component: GameSpecsPlaceholder,
    label: "Game Specs",
    icon: Gamepad2,
  },
};
