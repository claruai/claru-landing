// =============================================================================
// Deck Builder -- TypeScript Types
// Matches database schema from prd.json US-001
// =============================================================================

// ---------------------------------------------------------------------------
// Utility / Union Types
// ---------------------------------------------------------------------------

export type SlideLayout =
  | 'title'
  | 'title-body'
  | 'two-column'
  | 'image-left'
  | 'image-right'
  | 'quote'
  | 'blank';

// ---------------------------------------------------------------------------
// Database Entity Interfaces
// ---------------------------------------------------------------------------

export interface SlideBackground {
  type: 'solid' | 'gradient' | 'image';
  value: string;
}

export interface SlideData {
  id: string;
  order: number;
  layout: SlideLayout;
  title: string;
  body: string;
  background: SlideBackground;
  image_url?: string;
  /** When set, the renderer uses this raw HTML directly instead of the layout system.
   *  The agent can write fully custom HTML/CSS for any slide — video grids, animations, etc. */
  html?: string;
  /** S3 media keys referenced by this slide's HTML (via /api/media/s3?key=KEY proxy URLs).
   *  Used for dependency tracking and cache pre-warming. Populated automatically when HTML is set. */
  media_refs?: string[];
  metadata: Record<string, unknown>;
}

export interface SlideThemeCustom {
  colors?: {
    background?: string;
    text?: string;
    accent?: string;
    secondaryBg?: string;
    border?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
    mono?: string;
  };
}

export interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  slides: SlideData[];
  theme: string;
  custom_theme: SlideThemeCustom | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SlideTemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  slides_json: SlideData[];
  name: string;
  description: string;
  theme: string;
  created_at: string;
}

export interface TemplateChatMessage {
  id: string;
  template_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata_json: Record<string, unknown>;
  created_at: string;
}

export interface SlideMediaAsset {
  id: string;
  template_id: string;
  filename: string;
  storage_path: string;
  url: string;
  mime_type: string;
  file_size_bytes: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Variation Generation
// ---------------------------------------------------------------------------

export interface SlideVariation {
  label: string;
  html: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MAX_SLIDES = 30;

// ---------------------------------------------------------------------------
// Factory Functions
// ---------------------------------------------------------------------------

export function createEmptySlide(order = 0): SlideData {
  return {
    id: crypto.randomUUID(),
    order,
    layout: 'title-body',
    title: '',
    body: '',
    background: {
      type: 'solid',
      value: '#050505',
    },
    metadata: {},
  };
}

export function createEmptyTemplate(): SlideTemplate {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: 'Untitled',
    description: '',
    tags: [],
    slides: [createEmptySlide(0)],
    theme: 'terminal-green',
    custom_theme: null,
    is_active: false,
    created_by: 'admin',
    created_at: now,
    updated_at: now,
  };
}
