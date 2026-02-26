"use client";

import { useState } from "react";
import { PANEL_REGISTRY } from "./DataPanelRegistry";

// =============================================================================
// DataPanelTabs -- Extensible tabbed panel container
//
// Renders a terminal-styled tab bar at the top. Each tab maps to a registered
// panel type in PANEL_REGISTRY. The active tab's component is rendered below.
//
// Single-tab case: renders the panel content directly without a tab bar.
// Adding a new panel type requires only a registry entry -- no changes here.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PanelDescriptor {
  type: string;
  data: Record<string, unknown>;
}

interface DataPanelTabsProps {
  panels: PanelDescriptor[];
  sampleId: string;
  apiBase?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataPanelTabs({ panels, sampleId, apiBase }: DataPanelTabsProps) {
  // Filter to only panels that have a registry entry and non-empty data.
  const registeredPanels = panels.filter(
    (p) => PANEL_REGISTRY[p.type] && p.data && Object.keys(p.data).length > 0
  );

  // Default to the first available panel.
  const [activeType, setActiveType] = useState<string>(
    registeredPanels[0]?.type ?? ""
  );

  // Nothing to render if no panels match.
  if (registeredPanels.length === 0) return null;

  const activePanel = registeredPanels.find((p) => p.type === activeType);
  const ActiveComponent = activePanel
    ? PANEL_REGISTRY[activePanel.type]?.component
    : null;

  // -----------------------------------------------------------------
  // Single-tab case: render the panel content directly without tab bar
  // -----------------------------------------------------------------
  if (registeredPanels.length === 1) {
    const singlePanel = registeredPanels[0];
    const SingleComponent = PANEL_REGISTRY[singlePanel.type]?.component;
    if (!SingleComponent) return null;

    return (
      <div>
        <SingleComponent data={singlePanel.data} sampleId={sampleId} apiBase={apiBase} />
      </div>
    );
  }

  // -----------------------------------------------------------------
  // Multi-tab case: show tab bar with panel labels and icons
  // -----------------------------------------------------------------
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-secondary)]">
      {/* ------------------------------------------------------------------ */}
      {/* Tab bar -- terminal-styled                                         */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-stretch border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]"
        role="tablist"
        aria-label="Data panels"
      >
        {registeredPanels.map((panel) => {
          const entry = PANEL_REGISTRY[panel.type];
          if (!entry) return null;

          const Icon = entry.icon;
          const isActive = panel.type === activeType;

          return (
            <button
              key={panel.type}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${panel.type}`}
              onClick={() => setActiveType(panel.type)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5
                font-mono text-xs tracking-wide
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[var(--accent-primary)]/60
                focus-visible:ring-inset
                ${
                  isActive
                    ? "text-[var(--accent-primary)] bg-[var(--bg-secondary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/50"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{entry.label}</span>

              {/* Active indicator -- accent border-bottom */}
              {isActive && (
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent-primary)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab content area                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div
        id={`panel-${activeType}`}
        role="tabpanel"
        aria-label={`${PANEL_REGISTRY[activeType]?.label ?? activeType} panel`}
        className="p-4"
      >
        {ActiveComponent && activePanel && (
          <ActiveComponent data={activePanel.data} sampleId={sampleId} apiBase={apiBase} />
        )}
      </div>
    </div>
  );
}
