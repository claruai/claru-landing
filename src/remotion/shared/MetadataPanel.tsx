import React from "react";
import { TOKENS } from "./DesignTokens";
import { TerminalHeader } from "./TerminalHeader";
import { ProgressBar } from "./ProgressBar";

// ---------------------------------------------------------------------------
// MetadataPanel — generalized terminal-style side panel
// ---------------------------------------------------------------------------

export interface MetadataRow {
  key: string;
  value: string | number;
  color?: string;
  /** Optional progress bar [0-100] */
  progress?: number;
}

export interface MetadataSection {
  label: string;
  rows: MetadataRow[];
}

export interface MetadataPanelProps {
  /** Panel title shown in terminal header */
  title: string;
  /** Array of labeled sections, each with key-value rows */
  sections: MetadataSection[];
  /** Panel width in pixels (default: 320) */
  width?: number;
  /** Whether panel is visible (controls slide-in animation) */
  visible: boolean;
  /** Position: 'right' (default) or 'left' */
  position?: "right" | "left";
  /** Optional status label for the terminal header */
  statusLabel?: string;
  /** Optional status color for the terminal header */
  statusColor?: string;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  title,
  sections,
  width = 320,
  visible,
  position = "right",
  statusLabel,
  statusColor,
}) => {
  const isRight = position === "right";

  return (
    <div
      style={{
        position: "absolute",
        [isRight ? "right" : "left"]: 0,
        top: 0,
        bottom: 0,
        width,
        backgroundColor: TOKENS.colors.panelBg,
        backdropFilter: "blur(12px)",
        [isRight ? "borderLeft" : "borderRight"]: `1px solid ${TOKENS.colors.accent}30`,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : `translateX(${isRight ? "20px" : "-20px"})`,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TerminalHeader
        title={title}
        statusLabel={statusLabel}
        statusColor={statusColor}
      />

      {/* Scrollable data */}
      <div
        style={{
          padding: "8px 12px",
          flex: 1,
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          overflow: "hidden",
          lineHeight: 1.6,
        }}
      >
        {sections.map((section) => (
          <div key={section.label}>
            {/* Section label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                margin: "6px 0 4px",
              }}
            >
              <span
                style={{
                  fontFamily: TOKENS.fonts.mono,
                  fontSize: 8,
                  color: TOKENS.colors.accent,
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                {section.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `${TOKENS.colors.accent}20`,
                }}
              />
            </div>

            {/* Rows */}
            {section.rows.map((row) => (
              <div key={row.key}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{ color: TOKENS.colors.accent, minWidth: 70 }}
                  >
                    {row.key}:
                  </span>
                  <span
                    style={{
                      color: row.color ?? TOKENS.colors.text,
                      wordBreak: "break-word",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
                {row.progress !== undefined && (
                  <div style={{ margin: "4px 0 8px" }}>
                    <ProgressBar
                      progress={row.progress}
                      color={row.color ?? TOKENS.colors.accent}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
