// =============================================================================
// Orchestrator Tool Definitions + processOrchestratorTool
// US-008: Tool set for the Lead Agent with delegation tools
// =============================================================================

import type Anthropic from "@anthropic-ai/sdk";
import type { SlideData, SlideMediaAsset, SlideThemeCustom } from "@/types/deck-builder";
import { processToolCall } from "../ai-tools";
import type { ToolCallResult } from "../ai-tools";
import { SLIDE_THEMES } from "../slide-themes";
import { loadArchetype, getArchetypeOverview } from "../archetypes";
import { listSkills, loadSkill, loadSkillReference } from "./skill-loader";

// ---------------------------------------------------------------------------
// Sentinel value -- delegation tools return this so the chat route knows
// to run the specialist agent flow instead of a normal tool result.
// ---------------------------------------------------------------------------

export const NEEDS_DELEGATION = "__NEEDS_DELEGATION__";

// ---------------------------------------------------------------------------
// Tool Definitions -- copied from ai-tools.ts (orchestrator keeps these)
// plus new delegation tools
// ---------------------------------------------------------------------------

export const ORCHESTRATOR_TOOLS: Anthropic.Tool[] = [
  // =========================================================================
  // DIRECT TOOLS (handled by processToolCall from ai-tools.ts)
  // =========================================================================
  {
    name: "edit_slide",
    description:
      "Edit one or more fields on a slide in a single call. Only include the fields you want to change. More efficient than calling multiple times.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to edit.",
        },
        title: {
          type: "string",
          description: "New title text for the slide.",
        },
        body: {
          type: "string",
          description: "New body text for the slide.",
        },
        image_url: {
          type: "string",
          description: "New image URL for the slide.",
        },
        layout: {
          type: "string",
          enum: [
            "title",
            "title-body",
            "two-column",
            "image-left",
            "image-right",
            "quote",
            "blank",
          ],
          description: "New layout type for the slide.",
        },
        // Legacy single-field mode (backwards compatible)
        field: {
          type: "string",
          enum: ["title", "body", "image_url"],
          description: "DEPRECATED: Use individual field params instead. Which field to update.",
        },
        value: {
          type: "string",
          description: "DEPRECATED: Use individual field params instead. The new value for the field.",
        },
      },
      required: ["slide_index"],
    },
    input_examples: [
      { slide_index: 0, title: "Executive Summary" },
      { slide_index: 3, title: "Key Metrics", body: "ARR: $2.1M\nGrowth: 40% YoY" },
      { slide_index: 5, layout: "two-column" },
    ],
  },
  {
    name: "add_slide",
    description:
      "Insert a new slide after the given index. Use layout 'image-left' or 'image-right' when including an image. Maximum 30 slides allowed.",
    input_schema: {
      type: "object" as const,
      properties: {
        after_index: {
          type: "number",
          description:
            "Zero-based index after which to insert the new slide. Use -1 to insert at the beginning.",
        },
        title: {
          type: "string",
          description: "Title text for the new slide.",
        },
        body: {
          type: "string",
          description:
            "Body text for the new slide. Supports basic markdown: **bold**, *italic*, - lists, ```code```.",
        },
        layout: {
          type: "string",
          enum: [
            "title",
            "title-body",
            "two-column",
            "image-left",
            "image-right",
            "quote",
            "blank",
          ],
          description: "Slide layout type.",
        },
        image_url: {
          type: "string",
          description:
            "Optional image URL for image-left/image-right layouts. Use get_media_assets to see uploaded images.",
        },
      },
      required: ["after_index", "title", "body", "layout"],
    },
  },
  {
    name: "delete_slide",
    description:
      "Remove a slide from the presentation. Cannot delete the last remaining slide.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to delete.",
        },
      },
      required: ["slide_index"],
    },
  },
  {
    name: "reorder_slides",
    description:
      "Move a slide from one position to another in the presentation.",
    input_schema: {
      type: "object" as const,
      properties: {
        from_index: {
          type: "number",
          description: "Current zero-based index of the slide to move.",
        },
        to_index: {
          type: "number",
          description:
            "Target zero-based index where the slide should be placed.",
        },
      },
      required: ["from_index", "to_index"],
    },
  },
  {
    name: "restructure_deck",
    description:
      "Reorganize the entire deck at once. Provide slide indices in desired new order. More efficient than multiple reorder_slides calls.",
    input_schema: {
      type: "object" as const,
      properties: {
        new_order: {
          type: "array",
          items: { type: "number" },
          description:
            "Array of current slide indices in desired new order.",
        },
        delete_omitted: {
          type: "boolean",
          description:
            "If true, slides not in new_order are deleted. Default false.",
        },
      },
      required: ["new_order"],
    },
  },
  {
    name: "undo_slide",
    description:
      "Revert the last change to a specific slide. Only affects that one slide. Can be called multiple times to undo further back (up to 10 changes per slide).",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to undo.",
        },
      },
      required: ["slide_index"],
    },
  },
  {
    name: "get_all_slides",
    description:
      "Get a compact overview of all slides (index, title, layout type). Use to understand deck structure.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_slide_html",
    description:
      "Read the full HTML content of a specific slide. Use this to inspect the actual HTML/CSS/JS code.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to read.",
        },
      },
      required: ["slide_index"],
    },
  },
  {
    name: "patch_slide_html",
    description:
      "Make surgical edits to a slide's HTML without rewriting the whole thing. Finds elements by selector (tag, class, or id) and applies targeted actions. More efficient than set_slide_html for small changes like updating text, tweaking styles, or swapping attributes.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to patch.",
        },
        patches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              selector: {
                type: "string",
                description:
                  "CSS-like selector: tag name (h1, div, p, span, video, img), class (.heading, .stats), or id (#title, #main).",
              },
              action: {
                type: "string",
                enum: ["replace", "setAttribute", "setStyle", "setText", "remove"],
                description:
                  "replace: swap entire element with value HTML. setAttribute: set attr from value as 'attr=val'. setStyle: merge CSS props from value (e.g. 'font-size:48px;color:red'). setText: replace text content. remove: delete the element.",
              },
              value: {
                type: "string",
                description:
                  "The value for the action. Required for replace, setAttribute, setStyle, setText. Not needed for remove.",
              },
            },
            required: ["selector", "action"],
          },
          description: "Array of patches to apply sequentially.",
        },
      },
      required: ["slide_index", "patches"],
    },
    input_examples: [
      { slide_index: 0, patches: [{ selector: "h1", action: "setText", value: "New Title" }] },
      { slide_index: 2, patches: [{ selector: ".stats", action: "setStyle", value: "font-size:48px;color:#92B090" }] },
      { slide_index: 1, patches: [{ selector: "img", action: "setAttribute", value: "src=/api/media/s3?key=samples/photo.jpg" }] },
    ],
  },
  {
    name: "set_template_theme",
    description:
      "Change the presentation theme. Available themes: terminal-green (dark with green accents), midnight-executive (dark blue/indigo), clean-white (light professional).",
    input_schema: {
      type: "object" as const,
      properties: {
        theme_id: {
          type: "string",
          enum: Object.keys(SLIDE_THEMES),
          description: "Theme identifier.",
        },
      },
      required: ["theme_id"],
    },
  },
  {
    name: "customize_theme",
    description:
      "Apply custom color and font overrides to the current theme. Only include the fields you want to change.",
    input_schema: {
      type: "object" as const,
      properties: {
        colors: {
          type: "object",
          description: "Partial color overrides.",
          properties: {
            background: {
              type: "string",
              description: "Background color (hex).",
            },
            text: {
              type: "string",
              description: "Primary text color (hex).",
            },
            accent: {
              type: "string",
              description: "Accent/highlight color (hex).",
            },
            secondaryBg: {
              type: "string",
              description: "Secondary background color (hex).",
            },
            border: {
              type: "string",
              description: "Border color (hex).",
            },
          },
        },
        fonts: {
          type: "object",
          description: "Partial font overrides.",
          properties: {
            heading: {
              type: "string",
              description: "Heading font family.",
            },
            body: {
              type: "string",
              description: "Body text font family.",
            },
            mono: {
              type: "string",
              description: "Monospace font family.",
            },
          },
        },
      },
    },
  },
  {
    name: "apply_to_all_slides",
    description:
      "Apply a transformation to every slide in the deck. Use for bulk changes like updating all backgrounds or changing all layouts.",
    input_schema: {
      type: "object" as const,
      properties: {
        field: {
          type: "string",
          enum: ["background", "layout"],
          description: "Which aspect to change.",
        },
        value: {
          type: "string",
          description:
            'For background: JSON like {"type":"solid","value":"#0a0908"}. For layout: the layout name.',
        },
      },
      required: ["field", "value"],
    },
  },
  {
    name: "generate_section",
    description:
      "Create multiple slides at once for a topic. More efficient than multiple add_slide calls. Enforces the 30-slide max.",
    input_schema: {
      type: "object" as const,
      properties: {
        after_index: {
          type: "number",
          description:
            "Insert after this index. Use -1 to insert at the beginning.",
        },
        slides: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              body: { type: "string" },
              layout: {
                type: "string",
                enum: [
                  "title",
                  "title-body",
                  "two-column",
                  "image-left",
                  "image-right",
                  "quote",
                  "blank",
                ],
              },
              html: {
                type: "string",
                description:
                  "Optional custom HTML. If set, layout is ignored.",
              },
            },
            required: ["title", "body", "layout"],
          },
          description: "Array of slide specs to create.",
        },
      },
      required: ["after_index", "slides"],
    },
  },
  {
    name: "get_media_assets",
    description:
      "Get a list of uploaded images available for this presentation. Returns filenames and URLs.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },

  // =========================================================================
  // KNOWLEDGE TOOLS
  // =========================================================================
  {
    name: "get_deck_approach",
    description:
      "Load reference knowledge for a specific type of deck (sales pitch, product demo, investor pitch, etc.). Call this early in a conversation to understand what approach to take. Pass an archetype ID, or pass 'list' to see all available approaches. You can also describe the deck type and I'll suggest one.",
    input_schema: {
      type: "object" as const,
      properties: {
        archetype: {
          type: "string",
          description:
            'Archetype ID to load (e.g. "sales-pitch", "product-demo"), or "list" to see all available approaches.',
        },
      },
      required: ["archetype"],
    },
  },

  {
    name: "load_skill",
    description:
      "Load specialized skill knowledge on demand. Available skills: positioning-angles (finding the hook), brand-voice (consistent tone), direct-response-copy (converting copy), message-architecture (content hierarchy), frontend-slides (HTML presentation patterns), ai-image-generation (image prompt craft), ai-creative-strategist (visual strategy), frontend-design (distinctive UI). Call with 'list' to see all, or an ID to load.",
    input_schema: {
      type: "object" as const,
      properties: {
        skill_id: {
          type: "string",
          description: 'Skill ID to load (e.g. "positioning-angles"), or "list" to see all available.',
        },
        reference: {
          type: "string",
          description: "Optional: load a specific reference file within the skill (e.g. \"unique-mechanism\" within positioning-angles).",
        },
      },
      required: ["skill_id"],
    },
  },

  // =========================================================================
  // AI MEDIA GENERATION TOOLS
  // =========================================================================
  {
    name: "generate_image",
    description:
      "Generate a custom AI image using Nano Banana (Google's image model). Returns a URL you can pass to the Design Agent in the mediaContext, or use with set_slide_image. Great for: custom illustrations, abstract backgrounds, conceptual visuals, branded graphics. The image is saved to the site and can be used in any slide.",
    input_schema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description:
            "Detailed description of the image to generate. Be specific about style, composition, colors, and subject. Example: 'Abstract dark visualization of data flowing through neural networks, sage green and white on near-black background, minimal and premium feel'",
        },
        aspect_ratio: {
          type: "string",
          enum: ["16:9", "1:1", "9:16", "4:3", "3:2"],
          description: "Aspect ratio. Default 16:9 for slides.",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_video",
    description:
      "Generate a custom AI video using Veo 3 (Google's video model). Returns a URL for use in slide HTML with <video> tags. Great for: animated backgrounds, abstract motion graphics, conceptual visuals. Takes 30s-2min to generate. The video is saved to the site.",
    input_schema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description:
            "Detailed description of the video to generate. Be specific about motion, style, camera movement, and mood. Example: 'Slow cinematic pan across rows of data servers with soft sage green lighting, dark atmosphere, subtle particle effects'",
        },
        duration: {
          type: "string",
          enum: ["4", "6", "8"],
          description: "Duration in seconds. Default 6.",
        },
        aspect_ratio: {
          type: "string",
          enum: ["16:9", "9:16"],
          description: "Aspect ratio. Default 16:9.",
        },
      },
      required: ["prompt"],
    },
  },

  // =========================================================================
  // DELEGATION TOOLS (trigger specialist agent calls)
  // =========================================================================
  {
    name: "delegate_design",
    description:
      "Delegate visual/HTML work to the Design Agent. Describe what you want — the Design Agent handles CSS, layout, typography, animations. The slide HTML is applied automatically, then QA runs automatically. Complexity is auto-detected from the instruction and existing slide state.",
    eager_input_streaming: true,
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to design.",
        },
        instruction: {
          type: "string",
          description:
            "Clear description of the desired outcome. Describe the visual result, not the implementation.",
        },
        complexity: {
          type: "string",
          enum: ["simple", "complex"],
          description:
            "Optional override. Auto-detected if not provided. 'complex' for full-page designs. 'simple' for minor tweaks.",
        },
        use_animations: {
          type: "boolean",
          description:
            "Whether the slide should include GSAP or CSS animations. Default false. Only true when user explicitly requests motion.",
        },
      },
      required: ["slide_index", "instruction"],
    },
    input_examples: [
      { slide_index: 2, instruction: "Create a stats slide with 3 large numbers: 386K samples, 15 datasets, 8 countries. Dark background, sage green accents." },
      { slide_index: 0, instruction: "Simplify to just the title 'What are your data challenges?' centered on a clean dark background." },
    ],
  },
  {
    name: "delegate_research",
    description:
      "Delegate fact-finding to the Research Agent. Ask a focused question — the Research Agent searches the web and/or data catalog, then returns a brief answer.",
    input_schema: {
      type: "object" as const,
      properties: {
        question: {
          type: "string",
          description:
            "The research question. Be specific: 'What is Reka AI's latest model and key benchmarks?' not 'Tell me about Reka AI.'",
        },
        max_words: {
          type: "number",
          description:
            "Maximum length of the research brief in words. Default 200.",
        },
      },
      required: ["question"],
    },
    input_examples: [
      { question: "What is Reka AI's latest model and key benchmarks?" },
      { question: "Find video samples from our egocentric datasets with embeddable URLs" },
      { question: "What case studies do we have related to safety or content moderation?" },
    ],
  },
  {
    name: "delegate_qa",
    description:
      "Run QA review on a specific slide. The QA Agent evaluates the slide across Layout, Content, and Interactions dimensions and returns a pass/fail verdict with score.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide to review.",
        },
      },
      required: ["slide_index"],
    },
  },
  {
    name: "generate_variations",
    description:
      "Generate 3 alternative design approaches for a slide. Returns multiple HTML versions the user can preview and choose from.",
    input_schema: {
      type: "object" as const,
      properties: {
        slide_index: {
          type: "number",
          description: "Zero-based index of the slide.",
        },
        direction: {
          type: "string",
          description:
            "Optional creative direction (e.g. 'more minimal', 'emphasize stats', 'use video grid').",
        },
      },
      required: ["slide_index"],
    },
  },

  // =========================================================================
  // INTERNAL REASONING TOOL
  // =========================================================================
  {
    name: "think",
    description:
      "Plan your approach before acting. Use this to reason about which tool to call and what parameters to use. Output is NOT shown to the user — this is your private scratchpad. After thinking, immediately call the appropriate action tool.",
    input_schema: {
      type: "object" as const,
      properties: {
        thought: {
          type: "string",
          description: "Your reasoning about what to do next.",
        },
      },
      required: ["thought"],
    },
  },
];

// ---------------------------------------------------------------------------
// Orchestrator Tool Result Type
// ---------------------------------------------------------------------------

export interface OrchestratorToolResult {
  updatedSlides: SlideData[];
  result: string;
  themeChange?: string;
  customThemeChange?: SlideThemeCustom;
}

// ---------------------------------------------------------------------------
// processOrchestratorTool -- routes direct tools to existing handlers,
// returns NEEDS_DELEGATION sentinel for delegation tools
// ---------------------------------------------------------------------------

// Set of tools the orchestrator delegates to specialist agents
const DELEGATION_TOOLS = new Set([
  "delegate_design",
  "delegate_research",
  "delegate_qa",
  "generate_variations",
  "generate_image",
  "generate_video",
]);

export function processOrchestratorTool(
  toolName: string,
  input: Record<string, unknown>,
  slides: SlideData[],
  mediaAssets?: SlideMediaAsset[],
): OrchestratorToolResult {
  // Think tool -- invisible scratchpad, no-op
  if (toolName === "think") {
    return { updatedSlides: slides, result: "OK" };
  }

  // Knowledge tools -- handled directly
  if (toolName === "load_skill") {
    const skillId = input.skill_id as string;
    const reference = input.reference as string | undefined;

    if (skillId === "list") {
      return { updatedSlides: slides, result: listSkills() };
    }
    if (reference) {
      const content = loadSkillReference(skillId, reference);
      return { updatedSlides: slides, result: content ?? `Reference not found in skill "${skillId}".` };
    }
    const content = loadSkill(skillId);
    return { updatedSlides: slides, result: content ?? `Skill "${skillId}" not found.\n\n${listSkills()}` };
  }

  if (toolName === "get_deck_approach") {
    const archetype = input.archetype as string;
    if (archetype === "list") {
      return { updatedSlides: slides, result: getArchetypeOverview() };
    }
    const content = loadArchetype(archetype);
    if (content) {
      return { updatedSlides: slides, result: content };
    }
    // If not found, return overview with available options
    return { updatedSlides: slides, result: `Archetype "${archetype}" not found.\n\n${getArchetypeOverview()}` };
  }

  // Delegation tools -- return sentinel for the chat route to handle
  if (DELEGATION_TOOLS.has(toolName)) {
    return {
      updatedSlides: slides,
      result: NEEDS_DELEGATION,
    };
  }

  // Direct tools -- reuse existing handlers from ai-tools.ts
  const result: ToolCallResult = processToolCall(
    toolName,
    input,
    slides,
    mediaAssets,
  );

  return {
    updatedSlides: result.updatedSlides,
    result: result.result,
    ...(result.themeChange ? { themeChange: result.themeChange } : {}),
    ...(result.customThemeChange
      ? { customThemeChange: result.customThemeChange }
      : {}),
  };
}
