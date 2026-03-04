// =============================================================================
// Slide Theme Definitions
// Visual styling presets for generated HTML presentations
// =============================================================================

import type { SlideThemeCustom } from '@/types/deck-builder';

// ---------------------------------------------------------------------------
// Theme Interface
// ---------------------------------------------------------------------------

export interface SlideTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    secondaryBg: string;
    secondaryText: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

// ---------------------------------------------------------------------------
// Theme Presets
// ---------------------------------------------------------------------------

export const SLIDE_THEMES: Record<string, SlideTheme> = {
  'terminal-green': {
    id: 'terminal-green',
    name: 'Claru Dark',
    colors: {
      background: '#0a0908',
      text: '#FFFFFF',
      accent: '#92B090',
      secondaryBg: '#121110',
      secondaryText: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.08)',
    },
    fonts: {
      heading: "'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
    },
  },
  'midnight-executive': {
    id: 'midnight-executive',
    name: 'Midnight Executive',
    colors: {
      background: '#0a0a1a',
      text: '#e0e0f0',
      accent: '#6366f1',
      secondaryBg: '#12122a',
      secondaryText: '#8888aa',
      border: '#1e1e3a',
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
  'clean-white': {
    id: 'clean-white',
    name: 'Clean White',
    colors: {
      background: '#ffffff',
      text: '#1a1a2e',
      accent: '#2563eb',
      secondaryBg: '#f8f9fa',
      secondaryText: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

// ---------------------------------------------------------------------------
// Theme Accessor
// ---------------------------------------------------------------------------

/**
 * Get a theme by ID, optionally merging custom overrides.
 * Falls back to terminal-green if theme not found.
 */
export function getTheme(
  themeId: string,
  customTheme?: SlideThemeCustom | null,
): SlideTheme {
  const base = SLIDE_THEMES[themeId] ?? SLIDE_THEMES['terminal-green'];

  if (!customTheme) return base;

  return {
    ...base,
    colors: {
      ...base.colors,
      ...(customTheme.colors ?? {}),
    },
    fonts: {
      ...base.fonts,
      ...(customTheme.fonts ?? {}),
    },
  };
}
