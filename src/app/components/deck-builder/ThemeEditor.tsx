"use client";

import { useCallback } from "react";
import { RotateCcw } from "lucide-react";
import type { SlideThemeCustom } from "@/types/deck-builder";
import { SLIDE_THEMES, type SlideTheme } from "@/lib/deck-builder/slide-themes";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ThemeEditorProps {
  currentTheme: string;
  customTheme: SlideThemeCustom | null;
  onThemeChange: (themeId: string) => void;
  onCustomThemeChange: (customTheme: SlideThemeCustom | null) => void;
}

/* ------------------------------------------------------------------ */
/*  Font options                                                       */
/* ------------------------------------------------------------------ */

const FONT_OPTIONS = [
  { label: "Geist Sans", value: "'Geist Sans', sans-serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "system-ui", value: "system-ui, sans-serif" },
];

const MONO_FONT_OPTIONS = [
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "monospace", value: "monospace" },
];

/* ------------------------------------------------------------------ */
/*  Color field definitions                                            */
/* ------------------------------------------------------------------ */

type ColorKey = "background" | "text" | "accent" | "secondaryBg" | "border";

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
  { key: "accent", label: "Accent" },
  { key: "secondaryBg", label: "Secondary BG" },
  { key: "border", label: "Border" },
];

type FontKey = "heading" | "body" | "mono";

const FONT_FIELDS: { key: FontKey; label: string; options: { label: string; value: string }[] }[] = [
  { key: "heading", label: "Heading Font", options: FONT_OPTIONS },
  { key: "body", label: "Body Font", options: FONT_OPTIONS },
  { key: "mono", label: "Mono Font", options: MONO_FONT_OPTIONS },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ThemeEditor({
  currentTheme,
  customTheme,
  onThemeChange,
  onCustomThemeChange,
}: ThemeEditorProps) {
  const baseTheme: SlideTheme =
    SLIDE_THEMES[currentTheme] ?? SLIDE_THEMES["terminal-green"];

  /* ---- Effective (merged) values ----------------------------------- */

  const effectiveColor = useCallback(
    (key: ColorKey): string => {
      return customTheme?.colors?.[key] ?? baseTheme.colors[key];
    },
    [customTheme, baseTheme]
  );

  const effectiveFont = useCallback(
    (key: FontKey): string => {
      return customTheme?.fonts?.[key] ?? baseTheme.fonts[key];
    },
    [customTheme, baseTheme]
  );

  /* ---- Color change handler ---------------------------------------- */

  const handleColorChange = useCallback(
    (key: ColorKey, value: string) => {
      const currentColors = customTheme?.colors ?? {};
      const currentFonts = customTheme?.fonts ?? {};

      // If value matches base theme, remove override
      if (value === baseTheme.colors[key]) {
        const { [key]: _, ...rest } = currentColors;
        const newCustom: SlideThemeCustom = {
          colors: Object.keys(rest).length > 0 ? rest : undefined,
          fonts: Object.keys(currentFonts).length > 0 ? currentFonts : undefined,
        };
        // If both are empty, null it out
        if (!newCustom.colors && !newCustom.fonts) {
          onCustomThemeChange(null);
        } else {
          onCustomThemeChange(newCustom);
        }
      } else {
        onCustomThemeChange({
          colors: { ...currentColors, [key]: value },
          fonts: Object.keys(currentFonts).length > 0 ? currentFonts : undefined,
        });
      }
    },
    [customTheme, baseTheme, onCustomThemeChange]
  );

  /* ---- Font change handler ----------------------------------------- */

  const handleFontChange = useCallback(
    (key: FontKey, value: string) => {
      const currentColors = customTheme?.colors ?? {};
      const currentFonts = customTheme?.fonts ?? {};

      if (value === baseTheme.fonts[key]) {
        const { [key]: _, ...rest } = currentFonts;
        const newCustom: SlideThemeCustom = {
          colors: Object.keys(currentColors).length > 0 ? currentColors : undefined,
          fonts: Object.keys(rest).length > 0 ? rest : undefined,
        };
        if (!newCustom.colors && !newCustom.fonts) {
          onCustomThemeChange(null);
        } else {
          onCustomThemeChange(newCustom);
        }
      } else {
        onCustomThemeChange({
          colors: Object.keys(currentColors).length > 0 ? currentColors : undefined,
          fonts: { ...currentFonts, [key]: value },
        });
      }
    },
    [customTheme, baseTheme, onCustomThemeChange]
  );

  /* ---- Reset handler ----------------------------------------------- */

  const handleReset = useCallback(() => {
    onCustomThemeChange(null);
  }, [onCustomThemeChange]);

  /* ---- Render ------------------------------------------------------ */

  return (
    <div className="space-y-5">
      {/* ============================================================ */}
      {/*  Theme Preset Selector                                        */}
      {/* ============================================================ */}
      <div>
        <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Theme Preset
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(SLIDE_THEMES).map((theme) => {
            const isActive = currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all ${
                  isActive
                    ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5"
                    : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
                }`}
              >
                {/* Color swatches */}
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-sm border border-black/20"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-4 h-4 rounded-sm border border-black/20"
                    style={{ backgroundColor: theme.colors.text }}
                    title="Text"
                  />
                  <div
                    className="w-4 h-4 rounded-sm border border-black/20"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                </div>
                <span className="font-mono text-[9px] text-[var(--text-secondary)] text-center leading-tight">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Customize Colors                                             */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            Customize Colors
          </label>
          {customTheme && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Preset
            </button>
          )}
        </div>

        <div className="space-y-2">
          {COLOR_FIELDS.map(({ key, label }) => {
            const value = effectiveColor(key);
            const isOverridden = customTheme?.colors?.[key] != null;

            return (
              <div key={key} className="flex items-center gap-2">
                {/* Swatch */}
                <div
                  className="w-6 h-6 rounded border border-[var(--border-subtle)] shrink-0"
                  style={{ backgroundColor: value }}
                />
                {/* Label */}
                <span
                  className={`font-mono text-[10px] w-20 shrink-0 ${
                    isOverridden
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {label}
                </span>
                {/* Hex input */}
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] rounded px-2 py-1 font-mono text-[10px] text-[var(--text-primary)] outline-none transition-colors"
                  placeholder="#000000"
                />
                {/* Native color picker */}
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-6 h-6 cursor-pointer bg-transparent border-0 p-0"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Customize Fonts                                              */}
      {/* ============================================================ */}
      <div>
        <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Customize Fonts
        </label>

        <div className="space-y-2">
          {FONT_FIELDS.map(({ key, label, options }) => {
            const value = effectiveFont(key);
            const isOverridden = customTheme?.fonts?.[key] != null;

            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] w-20 shrink-0 ${
                    isOverridden
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(e) => handleFontChange(key, e.target.value)}
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] rounded px-2 py-1 font-mono text-[10px] text-[var(--text-primary)] outline-none transition-colors cursor-pointer"
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
