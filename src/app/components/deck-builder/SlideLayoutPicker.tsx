"use client";

import type { SlideLayout } from "@/types/deck-builder";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SlideLayoutPickerProps {
  activeLayout: SlideLayout;
  onSelect: (layout: SlideLayout) => void;
}

interface LayoutOption {
  value: SlideLayout;
  label: string;
}

const LAYOUTS: LayoutOption[] = [
  { value: "title", label: "Title" },
  { value: "title-body", label: "Title + Body" },
  { value: "two-column", label: "Two Column" },
  { value: "image-left", label: "Image Left" },
  { value: "image-right", label: "Image Right" },
  { value: "quote", label: "Quote" },
  { value: "blank", label: "Blank" },
];

/* ------------------------------------------------------------------ */
/*  Layout Wireframe SVGs                                              */
/* ------------------------------------------------------------------ */

function LayoutWireframe({ layout }: { layout: SlideLayout }) {
  const strokeColor = "var(--text-muted)";
  const fillColor = "var(--bg-tertiary)";

  switch (layout) {
    case "title":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="20"
            y="16"
            width="40"
            height="4"
            rx="1"
            fill={strokeColor}
          />
          <rect
            x="28"
            y="24"
            width="24"
            height="2"
            rx="1"
            fill={fillColor}
          />
        </svg>
      );
    case "title-body":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="8"
            y="6"
            width="32"
            height="4"
            rx="1"
            fill={strokeColor}
          />
          <rect
            x="8"
            y="16"
            width="64"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="22"
            width="56"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="28"
            width="60"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="34"
            width="40"
            height="2"
            rx="1"
            fill={fillColor}
          />
        </svg>
      );
    case "two-column":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="8"
            y="6"
            width="32"
            height="4"
            rx="1"
            fill={strokeColor}
          />
          <rect
            x="8"
            y="16"
            width="28"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="22"
            width="24"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="28"
            width="26"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <line
            x1="40"
            y1="14"
            x2="40"
            y2="38"
            stroke={fillColor}
            strokeWidth="0.5"
          />
          <rect
            x="44"
            y="16"
            width="28"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="44"
            y="22"
            width="24"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="44"
            y="28"
            width="26"
            height="2"
            rx="1"
            fill={fillColor}
          />
        </svg>
      );
    case "image-left":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="6"
            y="8"
            width="28"
            height="28"
            rx="2"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.5"
          />
          <rect
            x="40"
            y="10"
            width="28"
            height="4"
            rx="1"
            fill={strokeColor}
          />
          <rect
            x="40"
            y="20"
            width="34"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="40"
            y="26"
            width="30"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="40"
            y="32"
            width="26"
            height="2"
            rx="1"
            fill={fillColor}
          />
        </svg>
      );
    case "image-right":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="6"
            y="10"
            width="28"
            height="4"
            rx="1"
            fill={strokeColor}
          />
          <rect
            x="6"
            y="20"
            width="34"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="6"
            y="26"
            width="30"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="6"
            y="32"
            width="26"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="46"
            y="8"
            width="28"
            height="28"
            rx="2"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.5"
          />
        </svg>
      );
    case "quote":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <text
            x="16"
            y="18"
            fontSize="18"
            fill={strokeColor}
            opacity="0.4"
            fontFamily="serif"
          >
            &ldquo;
          </text>
          <rect
            x="16"
            y="20"
            width="48"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="20"
            y="26"
            width="40"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="28"
            y="34"
            width="24"
            height="2"
            rx="1"
            fill={strokeColor}
            opacity="0.5"
          />
        </svg>
      );
    case "blank":
      return (
        <svg viewBox="0 0 80 45" className="w-full h-full">
          <rect
            x="8"
            y="12"
            width="64"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="18"
            width="56"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="24"
            width="60"
            height="2"
            rx="1"
            fill={fillColor}
          />
          <rect
            x="8"
            y="30"
            width="48"
            height="2"
            rx="1"
            fill={fillColor}
          />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SlideLayoutPicker({
  activeLayout,
  onSelect,
}: SlideLayoutPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {LAYOUTS.map((opt) => {
        const isActive = opt.value === activeLayout;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-md border transition-colors duration-150 ${
              isActive
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                : "border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-muted)]"
            }`}
            title={opt.label}
          >
            <div className="w-full aspect-video">
              <LayoutWireframe layout={opt.value} />
            </div>
            <span
              className={`text-[10px] font-mono leading-none ${
                isActive
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
