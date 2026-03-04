// =============================================================================
// AI Tools — Claude tool_use definitions + processToolCall for slide mutation
// =============================================================================

import type Anthropic from '@anthropic-ai/sdk';
import type {
  SlideData,
  SlideLayout,
  SlideMediaAsset,
  SlideThemeCustom,
} from '@/types/deck-builder';
import { createEmptySlide, MAX_SLIDES } from '@/types/deck-builder';
import { SLIDE_THEMES } from './slide-themes';
import { GSAP_REFERENCE, GSAP_CDN } from './gsap-reference';
import { SLIDE_DESIGN_REFERENCE } from './slide-design-reference';
import { searchVideos, getVideosByCategory, getVideoIndex } from './video-index';
import { extractMediaRefs } from './rewrite-s3-urls';

// ---------------------------------------------------------------------------
// Tool Definitions (Anthropic tool format)
// ---------------------------------------------------------------------------

export const SLIDE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'edit_slide',
    description:
      'Edit a specific field on a slide. Use this to change the title, body text, or image URL of an existing slide.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide to edit.',
        },
        field: {
          type: 'string',
          enum: ['title', 'body', 'image_url'],
          description: 'Which field to update on the slide.',
        },
        value: {
          type: 'string',
          description: 'The new value for the field.',
        },
      },
      required: ['slide_index', 'field', 'value'],
    },
  },
  {
    name: 'add_slide',
    description:
      'Insert a new slide after the given index. Use layout "image-left" or "image-right" when including an image. Maximum 30 slides allowed.',
    input_schema: {
      type: 'object' as const,
      properties: {
        after_index: {
          type: 'number',
          description:
            'Zero-based index after which to insert the new slide. Use -1 to insert at the beginning.',
        },
        title: {
          type: 'string',
          description: 'Title text for the new slide.',
        },
        body: {
          type: 'string',
          description: 'Body text for the new slide. Supports basic markdown: **bold**, *italic*, - lists, ```code```.',
        },
        layout: {
          type: 'string',
          enum: [
            'title',
            'title-body',
            'two-column',
            'image-left',
            'image-right',
            'quote',
            'blank',
          ],
          description: 'Slide layout type.',
        },
        image_url: {
          type: 'string',
          description:
            'Optional image URL for image-left/image-right layouts. Use get_media_assets to see uploaded images.',
        },
      },
      required: ['after_index', 'title', 'body', 'layout'],
    },
  },
  {
    name: 'delete_slide',
    description:
      'Remove a slide from the presentation. Cannot delete the last remaining slide.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide to delete.',
        },
      },
      required: ['slide_index'],
    },
  },
  {
    name: 'reorder_slides',
    description:
      'Move a slide from one position to another in the presentation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        from_index: {
          type: 'number',
          description: 'Current zero-based index of the slide to move.',
        },
        to_index: {
          type: 'number',
          description: 'Target zero-based index where the slide should be placed.',
        },
      },
      required: ['from_index', 'to_index'],
    },
  },
  {
    name: 'set_slide_layout',
    description:
      'Change the layout of a specific slide. Use "image-left" or "image-right" to feature an image alongside text.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide.',
        },
        layout: {
          type: 'string',
          enum: [
            'title',
            'title-body',
            'two-column',
            'image-left',
            'image-right',
            'quote',
            'blank',
          ],
          description: 'New layout for the slide.',
        },
      },
      required: ['slide_index', 'layout'],
    },
  },
  {
    name: 'set_slide_background',
    description:
      'Change the background of a specific slide. Solid uses a hex color, gradient uses CSS gradient syntax, image uses a URL.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide.',
        },
        type: {
          type: 'string',
          enum: ['solid', 'gradient', 'image'],
          description: 'Background type.',
        },
        value: {
          type: 'string',
          description:
            'Background value: hex color for solid (e.g. "#1a1a2e"), CSS gradient for gradient (e.g. "linear-gradient(135deg, #0a0a0a, #1a1a2e)"), or image URL for image.',
        },
      },
      required: ['slide_index', 'type', 'value'],
    },
  },
  {
    name: 'set_slide_image',
    description:
      'Set the image URL on a slide. Use get_media_assets to see uploaded images, then use this tool to add one to a slide. Works best with image-left or image-right layouts.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide.',
        },
        image_url: {
          type: 'string',
          description: 'URL of the image to set on the slide.',
        },
      },
      required: ['slide_index', 'image_url'],
    },
  },
  {
    name: 'get_all_slides',
    description:
      'Get a compact overview of all slides (index, title, layout type). Use to understand deck structure.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_slide_html',
    description:
      'Read the full HTML content of a specific slide. Use this to debug issues (broken animations, invisible content, layout problems) by inspecting the actual HTML/CSS/JS code.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide to read.',
        },
      },
      required: ['slide_index'],
    },
  },
  {
    name: 'get_media_assets',
    description:
      'Get a list of uploaded images available for this presentation. Returns filenames and URLs that can be used with set_slide_image or when adding slides with image layouts.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'set_template_theme',
    description:
      'Change the presentation theme. Available themes: terminal-green (dark with green accents), midnight-executive (dark blue/indigo), clean-white (light professional).',
    input_schema: {
      type: 'object' as const,
      properties: {
        theme_id: {
          type: 'string',
          enum: Object.keys(SLIDE_THEMES),
          description: 'Theme identifier.',
        },
      },
      required: ['theme_id'],
    },
  },
  {
    name: 'customize_theme',
    description:
      'Apply custom color and font overrides to the current theme. Only include the fields you want to change — unspecified fields keep their current values.',
    input_schema: {
      type: 'object' as const,
      properties: {
        colors: {
          type: 'object',
          description: 'Partial color overrides.',
          properties: {
            background: { type: 'string', description: 'Background color (hex).' },
            text: { type: 'string', description: 'Primary text color (hex).' },
            accent: { type: 'string', description: 'Accent/highlight color (hex).' },
            secondaryBg: { type: 'string', description: 'Secondary background color (hex).' },
            border: { type: 'string', description: 'Border color (hex).' },
          },
        },
        fonts: {
          type: 'object',
          description: 'Partial font overrides.',
          properties: {
            heading: { type: 'string', description: 'Heading font family.' },
            body: { type: 'string', description: 'Body text font family.' },
            mono: { type: 'string', description: 'Monospace font family.' },
          },
        },
      },
    },
  },
  {
    name: 'get_landing_page_content',
    description:
      'Get the full content from the Claru landing page — hero headline, value propositions, offerings (The Golden Set, The Embedded Squad, The Frontier Standard), paradigm shift comparison (Black Box vs Glass Box), capabilities (Video AI, Vision AI, Robotics), testimonials, and CTA. Use this to understand what Claru communicates publicly and to pull real copy into slides.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_data_catalog',
    description:
      'Get the current datasets available in Claru\'s data catalog — names, descriptions, types, sample counts, geographic coverage, and annotation types. Use this to create slides with specific, accurate data about what Claru offers. This fetches live data from the database.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'set_slide_html',
    description:
      'Set fully custom HTML for a slide. The HTML becomes the ENTIRE slide — a 1920×1080px canvas served as a standalone web page, with NO imposed background, grid, padding, or styling. Use width:100%;height:100% on root elements, NEVER vw/vh units. You control everything: backgrounds, layout, animations, videos, etc. Include your own background color/image in your HTML if needed (e.g. a full-size div with background). For S3 media use proxy URLs: /api/media/s3?key=PATH (e.g. <video src="/api/media/s3?key=video_capture/.../file.MP4" autoplay muted loop playsinline>). CDN scripts and Google Fonts can be loaded directly. Use get_site_media for available files. The Claru dark bg is #0a0908, accent is #92B090.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide.',
        },
        html: {
          type: 'string',
          description: 'Complete HTML for the slide. This IS the slide — include your own background, layout, typography, everything. The container is 1920×1080px. Use width:100%;height:100%, never vw/vh.',
        },
      },
      required: ['slide_index', 'html'],
    },
  },
  {
    name: 'get_site_media',
    description:
      'Search for videos and images on the Claru site. Each video has a Gemini-analyzed description of what it shows. You can search by keyword (e.g. "cooking", "robot arm", "driving") or browse by category. Results include paths + descriptions so you know exactly what each video contains.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find relevant videos (e.g. "kitchen", "annotation", "gameplay"). Leave empty to browse by category.',
        },
        category: {
          type: 'string',
          enum: ['mosaic', 'bento', 'case-study', 'robot', 'work', 'all'],
          description: 'Filter by category. Use "all" for overview.',
        },
      },
    },
  },
  {
    name: 'verify_slide',
    description:
      'Take a screenshot of a rendered slide to visually verify your changes. Returns a PNG image of the slide rendered at 1920×1080. Use this after making significant changes (custom HTML, video grids, layout changes) to confirm the result looks correct. If you see issues in the screenshot, fix them with another set_slide_html call.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide to capture.',
        },
      },
      required: ['slide_index'],
    },
  },
  {
    name: 'get_gsap_reference',
    description:
      'Get the GSAP animation reference — CDN link, core methods, common slide animation patterns. Call when adding animations to custom HTML slides.',
    input_schema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'get_design_reference',
    description:
      'Get slide design best practices — McKinsey consulting principles, B2B sales deck structure, visual hierarchy rules, action titles, data presentation, layout patterns. Call this before building or redesigning slides to ensure professional quality.',
    input_schema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'web_search',
    description:
      'Search the web for information about a company, industry, competitive landscape, or specific topics to make slide content more relevant and data-driven. Use this to research the target audience before writing slides.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query string.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'apply_to_all_slides',
    description:
      'Apply a transformation to every slide in the deck. Use for bulk changes like updating all backgrounds or changing all layouts.',
    input_schema: {
      type: 'object' as const,
      properties: {
        field: {
          type: 'string',
          enum: ['background', 'layout'],
          description: 'Which aspect to change.',
        },
        value: {
          type: 'string',
          description:
            'For background: JSON like {"type":"solid","value":"#0a0908"}. For layout: the layout name.',
        },
      },
      required: ['field', 'value'],
    },
  },
  {
    name: 'restructure_deck',
    description:
      'Reorganize the entire deck at once. Provide slide indices in desired new order. More efficient than multiple reorder_slides calls. Slides not included are appended at the end (or deleted if delete_omitted is true).',
    input_schema: {
      type: 'object' as const,
      properties: {
        new_order: {
          type: 'array',
          items: { type: 'number' },
          description:
            'Array of current slide indices in desired new order.',
        },
        delete_omitted: {
          type: 'boolean',
          description:
            'If true, slides not in new_order are deleted. Default false.',
        },
      },
      required: ['new_order'],
    },
  },
  {
    name: 'generate_section',
    description:
      'Create multiple slides at once for a topic. More efficient than multiple add_slide calls. Enforces the 30-slide max.',
    input_schema: {
      type: 'object' as const,
      properties: {
        after_index: {
          type: 'number',
          description:
            'Insert after this index. Use -1 to insert at the beginning.',
        },
        slides: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              body: { type: 'string' },
              layout: {
                type: 'string',
                enum: [
                  'title',
                  'title-body',
                  'two-column',
                  'image-left',
                  'image-right',
                  'quote',
                  'blank',
                ],
              },
              html: {
                type: 'string',
                description:
                  'Optional custom HTML. If set, layout is ignored.',
              },
            },
            required: ['title', 'body', 'layout'],
          },
          description: 'Array of slide specs to create.',
        },
      },
      required: ['after_index', 'slides'],
    },
  },
  {
    name: 'undo_slide',
    description:
      'Revert the last change to a specific slide. Only affects that one slide. Can be called multiple times to undo further back (up to 10 changes per slide).',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide to undo.',
        },
      },
      required: ['slide_index'],
    },
  },
  {
    name: 'generate_variations',
    description:
      'Generate 2-3 alternative design approaches for a slide. Returns multiple HTML versions the user can preview and choose from. Use when the user wants to explore different visual styles or layouts.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slide_index: {
          type: 'number',
          description: 'Zero-based index of the slide.',
        },
        direction: {
          type: 'string',
          description:
            'Optional creative direction (e.g. "more minimal", "emphasize stats", "use video grid").',
        },
      },
      required: ['slide_index'],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool Result Type
// ---------------------------------------------------------------------------

export interface ToolCallResult {
  updatedSlides: SlideData[];
  result: string;
  themeChange?: string;
  customThemeChange?: SlideThemeCustom;
}

// ---------------------------------------------------------------------------
// processToolCall — Pure function: takes slides, returns new slides + result
// ---------------------------------------------------------------------------

export function processToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
  slides: SlideData[],
  mediaAssets?: SlideMediaAsset[],
): ToolCallResult {
  switch (toolName) {
    case 'edit_slide':
      return handleEditSlide(toolInput, slides);
    case 'add_slide':
      return handleAddSlide(toolInput, slides);
    case 'delete_slide':
      return handleDeleteSlide(toolInput, slides);
    case 'reorder_slides':
      return handleReorderSlides(toolInput, slides);
    case 'set_slide_layout':
      return handleSetSlideLayout(toolInput, slides);
    case 'set_slide_background':
      return handleSetSlideBackground(toolInput, slides);
    case 'set_slide_image':
      return handleSetSlideImage(toolInput, slides);
    case 'get_all_slides':
      return handleGetAllSlides(slides);
    case 'get_slide_html':
      return handleGetSlideHtml(toolInput, slides);
    case 'get_media_assets':
      return handleGetMediaAssets(slides, mediaAssets);
    case 'set_slide_html':
      return handleSetSlideHtml(toolInput, slides);
    case 'get_site_media':
      return handleGetSiteMedia(toolInput, slides);
    case 'get_landing_page_content':
      return handleGetLandingPageContent(slides);
    case 'get_data_catalog':
    case 'verify_slide':
    case 'undo_slide':
    case 'generate_variations':
      // Handled server-side in chat route (requires DB/Playwright/Anthropic access)
      return { updatedSlides: slides, result: '__NEEDS_SERVER_HANDLER__' };
    case 'get_gsap_reference':
      return { updatedSlides: slides, result: 'GSAP CDN: ' + GSAP_CDN + '\n\n' + GSAP_REFERENCE };
    case 'get_design_reference':
      return { updatedSlides: slides, result: SLIDE_DESIGN_REFERENCE };
    case 'set_template_theme':
      return handleSetTemplateTheme(toolInput, slides);
    case 'customize_theme':
      return handleCustomizeTheme(toolInput, slides);
    case 'web_search':
      // Handled server-side (requires Tavily API key from env)
      return { updatedSlides: slides, result: '__NEEDS_SERVER_HANDLER__' };
    case 'apply_to_all_slides':
      return handleApplyToAllSlides(toolInput, slides);
    case 'restructure_deck':
      return handleRestructureDeck(toolInput, slides);
    case 'generate_section':
      return handleGenerateSection(toolInput, slides);
    default:
      return { updatedSlides: slides, result: `Unknown tool: ${toolName}` };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function reindex(slides: SlideData[]): SlideData[] {
  return slides.map((s, i) => ({ ...s, order: i }));
}

function validateIndex(
  index: number,
  slides: SlideData[],
): string | null {
  if (!Number.isInteger(index) || index < 0 || index >= slides.length) {
    return `Invalid slide index ${index}. Must be 0-${slides.length - 1}.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Individual Tool Handlers
// ---------------------------------------------------------------------------

function handleEditSlide(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const updated = [...slides];
  const slide = { ...updated[idx] };
  const changedFields: string[] = [];

  // New multi-field mode: accept individual field params
  if (input.title !== undefined) {
    slide.title = input.title as string;
    changedFields.push('title');
  }
  if (input.body !== undefined) {
    slide.body = input.body as string;
    changedFields.push('body');
  }
  if (input.image_url !== undefined) {
    slide.image_url = input.image_url as string;
    changedFields.push('image_url');
  }
  if (input.layout !== undefined) {
    slide.layout = input.layout as SlideData['layout'];
    changedFields.push('layout');
  }

  // Legacy single-field mode (backwards compatible)
  if (changedFields.length === 0 && input.field && input.value !== undefined) {
    const field = input.field as string;
    const value = input.value as string;
    if (field === 'title') {
      slide.title = value;
      changedFields.push('title');
    } else if (field === 'body') {
      slide.body = value;
      changedFields.push('body');
    } else if (field === 'image_url') {
      slide.image_url = value;
      changedFields.push('image_url');
    } else {
      return {
        updatedSlides: slides,
        result: `Invalid field "${field}". Must be "title", "body", or "image_url".`,
      };
    }
  }

  if (changedFields.length === 0) {
    return {
      updatedSlides: slides,
      result: 'No fields specified to update. Provide at least one of: title, body, image_url, layout.',
    };
  }

  updated[idx] = slide;
  return {
    updatedSlides: updated,
    result: `Updated ${changedFields.join(', ')} on slide ${idx + 1}.`,
  };
}

function handleAddSlide(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  if (slides.length >= MAX_SLIDES) {
    return {
      updatedSlides: slides,
      result: `Cannot add slide: maximum of ${MAX_SLIDES} slides reached.`,
    };
  }

  const afterIndex = input.after_index as number;
  const title = (input.title as string) ?? '';
  const body = (input.body as string) ?? '';
  const layout = (input.layout as SlideLayout) ?? 'title-body';
  const imageUrl = input.image_url as string | undefined;

  if (afterIndex < -1 || afterIndex >= slides.length) {
    return {
      updatedSlides: slides,
      result: `Invalid after_index ${afterIndex}. Must be -1 to ${slides.length - 1}.`,
    };
  }

  const newSlide = createEmptySlide(0);
  newSlide.title = title;
  newSlide.body = body;
  newSlide.layout = layout;
  if (imageUrl) {
    newSlide.image_url = imageUrl;
  }

  const insertAt = afterIndex + 1;
  const updated = [
    ...slides.slice(0, insertAt),
    newSlide,
    ...slides.slice(insertAt),
  ];

  return {
    updatedSlides: reindex(updated),
    result: `Added new "${layout}" slide "${title}" at position ${insertAt + 1} (total: ${updated.length}).`,
  };
}

function handleDeleteSlide(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;

  if (slides.length <= 1) {
    return {
      updatedSlides: slides,
      result: 'Cannot delete the only slide in the presentation.',
    };
  }

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const deletedTitle = slides[idx].title || '(untitled)';
  const updated = slides.filter((_, i) => i !== idx);

  return {
    updatedSlides: reindex(updated),
    result: `Deleted slide ${idx + 1} "${deletedTitle}" (remaining: ${updated.length}).`,
  };
}

function handleReorderSlides(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const from = input.from_index as number;
  const to = input.to_index as number;

  const fromErr = validateIndex(from, slides);
  if (fromErr) return { updatedSlides: slides, result: `from_index: ${fromErr}` };
  const toErr = validateIndex(to, slides);
  if (toErr) return { updatedSlides: slides, result: `to_index: ${toErr}` };

  if (from === to) {
    return { updatedSlides: slides, result: 'Slide is already at that position.' };
  }

  const updated = [...slides];
  const [moved] = updated.splice(from, 1);
  updated.splice(to, 0, moved);

  return {
    updatedSlides: reindex(updated),
    result: `Moved slide "${moved.title || '(untitled)'}" from position ${from + 1} to ${to + 1}.`,
  };
}

function handleSetSlideLayout(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;
  const layout = input.layout as SlideLayout;

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const validLayouts: SlideLayout[] = [
    'title',
    'title-body',
    'two-column',
    'image-left',
    'image-right',
    'quote',
    'blank',
  ];
  if (!validLayouts.includes(layout)) {
    return {
      updatedSlides: slides,
      result: `Invalid layout "${layout}". Valid: ${validLayouts.join(', ')}.`,
    };
  }

  const updated = [...slides];
  updated[idx] = { ...updated[idx], layout };

  return {
    updatedSlides: updated,
    result: `Set slide ${idx + 1} layout to "${layout}".`,
  };
}

function handleSetSlideBackground(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;
  const bgType = input.type as 'solid' | 'gradient' | 'image';
  const value = input.value as string;

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const validTypes = ['solid', 'gradient', 'image'];
  if (!validTypes.includes(bgType)) {
    return {
      updatedSlides: slides,
      result: `Invalid background type "${bgType}". Valid: ${validTypes.join(', ')}.`,
    };
  }

  const updated = [...slides];
  updated[idx] = {
    ...updated[idx],
    background: { type: bgType, value },
  };

  return {
    updatedSlides: updated,
    result: `Set slide ${idx + 1} background to ${bgType}: "${value}".`,
  };
}

function handleSetSlideImage(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;
  const imageUrl = input.image_url as string;

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const updated = [...slides];
  updated[idx] = { ...updated[idx], image_url: imageUrl };

  return {
    updatedSlides: updated,
    result: `Set image on slide ${idx + 1} to "${imageUrl}".`,
  };
}

function handleGetAllSlides(slides: SlideData[]): ToolCallResult {
  // Compact one-line-per-slide format to save tokens
  const summary = slides.map((s, i) =>
    `${i}: "${s.title || '(untitled)'}" [${s.html ? 'custom' : s.layout}]${s.image_url ? ' +img' : ''}`
  ).join('\n');

  return {
    updatedSlides: slides,
    result: `${slides.length} slides:\n${summary}`,
  };
}

function handleGetSlideHtml(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;
  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  const slide = slides[idx];
  if (slide.html) {
    return {
      updatedSlides: slides,
      result: `Slide ${idx + 1} custom HTML (${slide.html.length} chars):\n\n${slide.html}`,
    };
  }

  return {
    updatedSlides: slides,
    result: `Slide ${idx + 1} uses layout "${slide.layout}" (no custom HTML). Title: "${slide.title}", Body: "${slide.body?.slice(0, 300)}"`,
  };
}

function handleGetMediaAssets(
  slides: SlideData[],
  mediaAssets?: SlideMediaAsset[],
): ToolCallResult {
  if (!mediaAssets || mediaAssets.length === 0) {
    return {
      updatedSlides: slides,
      result: 'No media assets have been uploaded for this template. The admin can upload images via the media panel in the editor.',
    };
  }

  const assetList = mediaAssets.map((a) => ({
    filename: a.filename,
    url: a.url,
    mime_type: a.mime_type,
    size_kb: Math.round(a.file_size_bytes / 1024),
  }));

  return {
    updatedSlides: slides,
    result: `${mediaAssets.length} media asset(s) available:\n${JSON.stringify(assetList, null, 2)}\n\nUse set_slide_image with the URL to add an image to a slide. For best results, use "image-left" or "image-right" layout.`,
  };
}

function handleSetTemplateTheme(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const themeId = input.theme_id as string;

  if (!SLIDE_THEMES[themeId]) {
    return {
      updatedSlides: slides,
      result: `Unknown theme "${themeId}". Available: ${Object.keys(SLIDE_THEMES).join(', ')}.`,
    };
  }

  const theme = SLIDE_THEMES[themeId];
  return {
    updatedSlides: slides,
    result: `Theme changed to "${theme.name}".`,
    themeChange: themeId,
  };
}

function handleCustomizeTheme(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const colors = input.colors as SlideThemeCustom['colors'] | undefined;
  const fonts = input.fonts as SlideThemeCustom['fonts'] | undefined;

  if (!colors && !fonts) {
    return {
      updatedSlides: slides,
      result: 'No customizations provided. Pass colors and/or fonts to override.',
    };
  }

  const customTheme: SlideThemeCustom = {};
  const changes: string[] = [];

  if (colors) {
    customTheme.colors = {};
    if (colors.background) {
      customTheme.colors.background = colors.background;
      changes.push(`background: ${colors.background}`);
    }
    if (colors.text) {
      customTheme.colors.text = colors.text;
      changes.push(`text: ${colors.text}`);
    }
    if (colors.accent) {
      customTheme.colors.accent = colors.accent;
      changes.push(`accent: ${colors.accent}`);
    }
    if (colors.secondaryBg) {
      customTheme.colors.secondaryBg = colors.secondaryBg;
      changes.push(`secondaryBg: ${colors.secondaryBg}`);
    }
    if (colors.border) {
      customTheme.colors.border = colors.border;
      changes.push(`border: ${colors.border}`);
    }
  }

  if (fonts) {
    customTheme.fonts = {};
    if (fonts.heading) {
      customTheme.fonts.heading = fonts.heading;
      changes.push(`heading font: ${fonts.heading}`);
    }
    if (fonts.body) {
      customTheme.fonts.body = fonts.body;
      changes.push(`body font: ${fonts.body}`);
    }
    if (fonts.mono) {
      customTheme.fonts.mono = fonts.mono;
      changes.push(`mono font: ${fonts.mono}`);
    }
  }

  return {
    updatedSlides: slides,
    result: `Theme customized: ${changes.join(', ')}.`,
    customThemeChange: customTheme,
  };
}

function handleSetSlideHtml(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const idx = input.slide_index as number;
  const html = input.html as string;

  const err = validateIndex(idx, slides);
  if (err) return { updatedSlides: slides, result: err };

  if (!html || typeof html !== 'string') {
    return { updatedSlides: slides, result: 'html content is required.' };
  }

  const media_refs = extractMediaRefs(html);
  const updated = [...slides];
  updated[idx] = { ...updated[idx], html, media_refs };

  return {
    updatedSlides: updated,
    result: `Set custom HTML on slide ${idx + 1} (${html.length} chars).`,
  };
}

function handleGetSiteMedia(input: Record<string, unknown>, slides: SlideData[]): ToolCallResult {
  const query = (input.query as string) ?? '';
  const category = (input.category as string) ?? '';

  // If there's a search query, search the video index
  if (query) {
    const results = searchVideos(query, category || undefined);
    if (results.length === 0) {
      return { updatedSlides: slides, result: `No videos found matching "${query}".` };
    }
    const formatted = results.slice(0, 10).map(v =>
      `${v.path} — ${v.description} [${v.tags.join(', ')}]`
    ).join('\n');
    return { updatedSlides: slides, result: `${results.length} result(s) for "${query}":\n${formatted}` };
  }

  // Browse by category
  if (category && category !== 'all') {
    if (category === 'robot') {
      return { updatedSlides: slides, result: `Robot Face Images (dark bg, ASCII texture):\n- /images/robot-face.webp — Front-facing\n- /images/robot-face2.webp — Profile close-up\n- /images/robot-face7.webp — Side profile` };
    }
    const videos = getVideosByCategory(category);
    const formatted = videos.map(v =>
      `${v.path} — ${v.description}`
    ).join('\n');
    return { updatedSlides: slides, result: `${category} (${videos.length} videos):\n${formatted}` };
  }

  // Overview
  const index = getVideoIndex();
  const cats = new Map<string, number>();
  for (const v of index) cats.set(v.category, (cats.get(v.category) ?? 0) + 1);
  const overview = Array.from(cats.entries()).map(([c, n]) => {
    const example = index.find(v => v.category === c);
    return `- ${c}: ${n} videos (e.g. ${example?.path ?? '?'} — ${example?.description?.slice(0, 50) ?? '?'})`;
  }).join('\n');

  return { updatedSlides: slides, result: `Site Media (${index.length} videos + 3 robot images):\n${overview}\n- robot: 3 images (e.g. /images/robot-face7.webp)\nSearch by keyword or browse a category for full details.` };
}

function handleGetLandingPageContent(slides: SlideData[]): ToolCallResult {
  const content = `# Claru Landing Page Content

## Available Visual Assets (use with set_slide_image or image layouts)
These images are served from the site and can be used directly in slides:

- **/images/robot-face7.webp** — Iconic ASCII-textured robot head on black background. Perfect for title slides or dramatic visual moments.
- **/images/logo-animated-small.gif** — Animated Claru logo with sage-green glow effect on dark background.
- **/images/case-studies/object-identity-persistence/hero.png** — "Identity Persistence: Video AI Training Data at Scale" — silhouette figures across frames showing tracking.
- **/images/case-studies/generative-ai-safety/hero.png** — Enterprise AI Safety Value Proposition diagram with "Human-Led Data Labeling" hub.
- **/images/case-studies/generative-ai-safety/safety-categories.png** — Safety category breakdown visual.
- **/images/case-studies/video-content-classification/process.png** — Video content classification pipeline process diagram.
- **/images/case-studies/video-content-classification/results.png** — Classification results metrics visual.
- **/images/case-studies/workplace-egocentric-data/hero.png** — Egocentric data capture concept (phone with activity streams).
- **/images/case-studies/workplace-egocentric-data/process.png** — Workplace data collection process flow.
- **/images/case-studies/fashion-ai-annotation/annotated-bbox.png** — Fashion annotation with green bounding box overlay.
- **/images/case-studies/data-engine-world-models/process.png** — Data engine pipeline for world models.
- **/images/case-studies/prompt-enhancement-benchmark/results.png** — Benchmark enhancement results.

Tip: Use "image-left" or "image-right" layouts to pair these with text. The robot face works great as a background image (set_slide_background with type "image").

# Claru Landing Page Content

## Hero
**Headline:** Purpose-built data for frontier AI labs.
**Rotating modalities:** video / robotics / multimodal / vision
**Subheadline:** Source. Label. Ship. Training data built to your model's exact specifications — from raw capture to production-ready dataset.
**CTAs:** "Get Started" / "See Our Data"

## Three Offerings (The Wedge)

### 1. The Golden Set
Small, exquisite evaluation datasets. Hand-curated by domain experts. Used to benchmark model performance, catch regressions, and validate fine-tuning. Typical size: 500–5,000 samples. Delivered in 2–4 weeks.

### 2. The Embedded Squad
A dedicated annotation team embedded in your workflow. Trained on your taxonomy, your edge cases, your quality bar. They operate as an extension of your ML team — daily standups, Slack access, iterating in real time. Scales from 5 to 50+ annotators.

### 3. The Frontier Standard
End-to-end data pipeline management. We handle sourcing, annotation, QA, and delivery. Purpose-built for large-scale training runs. Includes custom tooling, multi-round review, and guaranteed SLAs. For labs that need 100K+ samples per month.

## Paradigm Shift (Black Box vs Glass Box)

### The Old Way (Black Box)
- Opaque annotation pipelines
- No visibility into annotator quality
- Generic crowd workers
- Ship and pray methodology
- Data quality issues surface weeks later in training

### The New Way (Glass Box)
- Full transparency into every annotation decision
- Real-time quality dashboards
- Domain-expert annotators with verified credentials
- Continuous feedback loops with your ML team
- Issues caught before data enters your pipeline

## Capabilities

### Video AI Data
Professional video annotation for temporal understanding, action recognition, object tracking across frames. Supports: bounding boxes, segmentation masks, temporal event labeling, scene descriptions.

### Vision AI Data
Image annotation for detection, classification, and segmentation. Multi-label hierarchical taxonomies. Supports: polygon segmentation, keypoint detection, semantic labeling, visual QA pairs.

### Robotics Data
Embodied AI training data from real-world capture. Force/torque annotations, grasp quality scoring, trajectory labeling. Supports: manipulation tasks, navigation, human-robot interaction scenarios.

## Testimonials
- "Claru's annotators understood our taxonomy from day one. We went from 67% to 94% benchmark accuracy in one training cycle." — ML Lead, Video Generation Lab
- "We tried three annotation vendors before Claru. The difference is night and day — they actually read our guidelines." — Head of Data, Robotics Startup
- "The embedded squad model changed everything. Having annotators in our Slack, reviewing edge cases in real time — that's how data quality should work." — VP of Engineering, Multimodal AI

## CTA Section
**Headline:** Let's Build Your Training Data Pipeline
**Subheadline:** From first conversation to production data in 6 weeks.
**Form fields:** Name, Email, Company, Role, Data Needs, Use Case
`;

  return {
    updatedSlides: slides,
    result: content,
  };
}

// ---------------------------------------------------------------------------
// Batch Operation Handlers
// ---------------------------------------------------------------------------

function handleApplyToAllSlides(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const field = input.field as string;
  const value = input.value as string;

  if (field === 'background') {
    let bg: { type: 'solid' | 'gradient' | 'image'; value: string };
    try {
      bg = JSON.parse(value);
    } catch {
      return {
        updatedSlides: slides,
        result: `Invalid background JSON: "${value}". Expected {"type":"solid","value":"#hex"}.`,
      };
    }
    const validTypes = ['solid', 'gradient', 'image'];
    if (!validTypes.includes(bg.type)) {
      return {
        updatedSlides: slides,
        result: `Invalid background type "${bg.type}". Valid: ${validTypes.join(', ')}.`,
      };
    }
    const updated = slides.map((s) => ({
      ...s,
      background: { type: bg.type, value: bg.value },
    }));
    return {
      updatedSlides: updated,
      result: `Applied ${bg.type} background "${bg.value}" to all ${updated.length} slides.`,
    };
  }

  if (field === 'layout') {
    const validLayouts: SlideLayout[] = [
      'title', 'title-body', 'two-column', 'image-left', 'image-right', 'quote', 'blank',
    ];
    if (!validLayouts.includes(value as SlideLayout)) {
      return {
        updatedSlides: slides,
        result: `Invalid layout "${value}". Valid: ${validLayouts.join(', ')}.`,
      };
    }
    const updated = slides.map((s) => ({ ...s, layout: value as SlideLayout }));
    return {
      updatedSlides: updated,
      result: `Applied layout "${value}" to all ${updated.length} slides.`,
    };
  }

  return {
    updatedSlides: slides,
    result: `Invalid field "${field}". Must be "background" or "layout".`,
  };
}

function handleRestructureDeck(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const newOrder = input.new_order as number[];
  const deleteOmitted = (input.delete_omitted as boolean) ?? false;

  if (!Array.isArray(newOrder) || newOrder.length === 0) {
    return {
      updatedSlides: slides,
      result: 'new_order must be a non-empty array of slide indices.',
    };
  }

  // Validate all indices
  for (const idx of newOrder) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= slides.length) {
      return {
        updatedSlides: slides,
        result: `Invalid index ${idx} in new_order. Must be 0-${slides.length - 1}.`,
      };
    }
  }

  // Check for duplicates
  const unique = new Set(newOrder);
  if (unique.size !== newOrder.length) {
    return {
      updatedSlides: slides,
      result: 'new_order contains duplicate indices.',
    };
  }

  // Build reordered array
  const reordered = newOrder.map((idx) => slides[idx]);

  // Handle omitted slides
  if (!deleteOmitted) {
    const omitted = slides.filter((_, i) => !unique.has(i));
    reordered.push(...omitted);
  }

  // Ensure we don't end up with zero slides
  if (reordered.length === 0) {
    return {
      updatedSlides: slides,
      result: 'Cannot delete all slides. At least one must remain.',
    };
  }

  return {
    updatedSlides: reindex(reordered),
    result: `Restructured deck: ${reordered.length} slides${deleteOmitted && reordered.length < slides.length ? ` (${slides.length - reordered.length} deleted)` : ''}.`,
  };
}

function handleGenerateSection(
  input: Record<string, unknown>,
  slides: SlideData[],
): ToolCallResult {
  const afterIndex = input.after_index as number;
  const slideSpecs = input.slides as Array<{
    title: string;
    body: string;
    layout: string;
    html?: string;
  }>;

  if (!Array.isArray(slideSpecs) || slideSpecs.length === 0) {
    return {
      updatedSlides: slides,
      result: 'slides must be a non-empty array of slide specs.',
    };
  }

  if (slides.length + slideSpecs.length > MAX_SLIDES) {
    return {
      updatedSlides: slides,
      result: `Cannot add ${slideSpecs.length} slides: would exceed max of ${MAX_SLIDES} (current: ${slides.length}).`,
    };
  }

  if (afterIndex < -1 || afterIndex >= slides.length) {
    return {
      updatedSlides: slides,
      result: `Invalid after_index ${afterIndex}. Must be -1 to ${slides.length - 1}.`,
    };
  }

  const newSlides: SlideData[] = slideSpecs.map((spec) => {
    const slide = createEmptySlide(0);
    slide.title = spec.title ?? '';
    slide.body = spec.body ?? '';
    slide.layout = (spec.layout as SlideLayout) ?? 'title-body';
    if (spec.html) {
      slide.html = spec.html;
    }
    return slide;
  });

  const insertAt = afterIndex + 1;
  const updated = [
    ...slides.slice(0, insertAt),
    ...newSlides,
    ...slides.slice(insertAt),
  ];

  return {
    updatedSlides: reindex(updated),
    result: `Generated ${newSlides.length} slides after position ${afterIndex + 1} (total: ${updated.length}).`,
  };
}
