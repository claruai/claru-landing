// =============================================================================
// Server-Side Tool Handlers
// Handles tools that need DB access, Playwright, external APIs, or other
// server-only resources. Called from the chat route when processToolCall
// returns __NEEDS_SERVER_HANDLER__.
// =============================================================================

import type { SupabaseClient } from "@supabase/supabase-js";
import type Anthropic from "@anthropic-ai/sdk";
import type { SlideData } from "@/types/deck-builder";
import type { ToolCallResult } from "./ai-tools";
import type { UndoManager } from "./slide-undo";
import { renderSlidesToHTML } from "./html-renderer";
import { captureSlideScreenshot, captureSlideScreenshotFromUrl } from "./slide-capture";
import { webSearch } from "./web-search";

// ---------------------------------------------------------------------------
// Context passed from the chat route
// ---------------------------------------------------------------------------

export interface ServerToolContext {
  slides: SlideData[];
  template: { name: string; description: string; theme: string } | null;
  supabase: SupabaseClient;
  anthropic: Anthropic;
  undoManager?: UndoManager;
}

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface ServerToolResult {
  toolResult: ToolCallResult;
  screenshot: string | null;
}

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export async function handleServerTool(
  toolName: string,
  input: Record<string, unknown>,
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  switch (toolName) {
    case "get_data_catalog":
      return handleGetDataCatalog(ctx);
    case "verify_slide":
      return handleVerifySlide(input, ctx);
    case "undo_slide":
      return handleUndoSlide(input, ctx);
    case "web_search":
      return handleWebSearch(input, ctx);
    case "generate_variations":
      return handleGenerateVariations(input, ctx);
    default:
      return {
        toolResult: {
          updatedSlides: ctx.slides,
          result: `Unknown server tool: ${toolName}`,
        },
        screenshot: null,
      };
  }
}

// ---------------------------------------------------------------------------
// get_data_catalog
// ---------------------------------------------------------------------------

async function handleGetDataCatalog(
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  const { data: datasets } = await ctx.supabase
    .from("datasets")
    .select(
      "name, description, type, subcategory, tags, total_samples, total_duration_hours, geographic_coverage, annotation_types, is_published",
    )
    .eq("is_published", true)
    .order("name");

  let result: string;
  if (datasets && datasets.length > 0) {
    const catalogSummary = datasets
      .map(
        (d: Record<string, unknown>) =>
          `**${d.name}** (${d.type})\n  ${d.description}\n  Samples: ${d.total_samples} | Duration: ${d.total_duration_hours}h | Coverage: ${d.geographic_coverage}\n  Annotations: ${(d.annotation_types as string[])?.join(", ") ?? "N/A"}\n  Tags: ${(d.tags as string[])?.join(", ") ?? "N/A"}`,
      )
      .join("\n\n");
    result = `# Claru Data Catalog (${datasets.length} published datasets)\n\n${catalogSummary}`;
  } else {
    result =
      "No published datasets found in the data catalog. The catalog may not be populated yet.";
  }

  return {
    toolResult: { updatedSlides: ctx.slides, result },
    screenshot: null,
  };
}

// ---------------------------------------------------------------------------
// verify_slide
// ---------------------------------------------------------------------------

async function handleVerifySlide(
  input: Record<string, unknown>,
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  const slideIdx = input.slide_index as number;

  if (slideIdx < 0 || slideIdx >= ctx.slides.length) {
    return {
      toolResult: {
        updatedSlides: ctx.slides,
        result: `Invalid slide index ${slideIdx}. Must be 0-${ctx.slides.length - 1}.`,
      },
      screenshot: null,
    };
  }

  try {
    const slideHtml = renderSlidesToHTML(
      [{ ...ctx.slides[slideIdx], order: 0 }],
      ctx.template?.theme ?? "terminal-green",
      { showProgress: false },
    );
    const base64 = await captureSlideScreenshot(slideHtml);

    return {
      toolResult: {
        updatedSlides: ctx.slides,
        result: `Screenshot captured of slide ${slideIdx + 1}. Review the image to verify your changes look correct.`,
      },
      screenshot: base64,
    };
  } catch (captureErr) {
    console.error("[verify_slide] Screenshot capture failed:", captureErr);
    return {
      toolResult: {
        updatedSlides: ctx.slides,
        result: `Screenshot capture failed: ${captureErr instanceof Error ? captureErr.message : "unknown error"}.`,
      },
      screenshot: null,
    };
  }
}

// ---------------------------------------------------------------------------
// undo_slide
// ---------------------------------------------------------------------------

async function handleUndoSlide(
  input: Record<string, unknown>,
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  const slideIdx = input.slide_index as number;
  if (!ctx.undoManager) {
    return { toolResult: { updatedSlides: ctx.slides, result: 'Undo not available.' }, screenshot: null };
  }
  if (slideIdx < 0 || slideIdx >= ctx.slides.length) {
    return { toolResult: { updatedSlides: ctx.slides, result: `Invalid slide index ${slideIdx}.` }, screenshot: null };
  }
  const slide = ctx.slides[slideIdx];
  const restored = ctx.undoManager.pop(slide.id);
  if (!restored) {
    return { toolResult: { updatedSlides: ctx.slides, result: `No undo history for slide ${slideIdx + 1}.` }, screenshot: null };
  }
  const updated = [...ctx.slides];
  updated[slideIdx] = { ...restored, order: slideIdx };
  return {
    toolResult: { updatedSlides: updated, result: `Reverted slide ${slideIdx + 1} to its previous state.` },
    screenshot: null,
  };
}

// ---------------------------------------------------------------------------
// web_search
// ---------------------------------------------------------------------------

async function handleWebSearch(
  input: Record<string, unknown>,
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  const query = input.query as string;
  const searchResults = await webSearch(query);

  let result: string;
  if (searchResults.error) {
    result = `Web search for "${query}": ${searchResults.error}`;
  } else if (searchResults.results.length === 0) {
    result = `No results found for "${query}".`;
  } else {
    const formatted = searchResults.results
      .map(
        (r, i) =>
          `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.content}`,
      )
      .join("\n\n");
    result = `Web search results for "${query}":\n\n${formatted}`;
  }

  return {
    toolResult: { updatedSlides: ctx.slides, result },
    screenshot: null,
  };
}

// ---------------------------------------------------------------------------
// generate_variations
// ---------------------------------------------------------------------------

async function handleGenerateVariations(
  input: Record<string, unknown>,
  ctx: ServerToolContext,
): Promise<ServerToolResult> {
  const slideIdx = input.slide_index as number;
  const direction = (input.direction as string) ?? '';

  if (slideIdx < 0 || slideIdx >= ctx.slides.length) {
    return {
      toolResult: { updatedSlides: ctx.slides, result: `Invalid slide index ${slideIdx}.` },
      screenshot: null,
    };
  }

  const slide = ctx.slides[slideIdx];
  const prompt = `Generate exactly 3 alternative HTML slide designs. Each is a complete self-contained canvas at 1920×1080px (use width:100%;height:100% on root elements, never vw/vh units) with inline CSS.

Current slide info:
- Title: "${slide.title}"
- Body: "${slide.body?.slice(0, 200)}"
- Layout: ${slide.layout}
${slide.html ? '- Currently has custom HTML' : ''}
${direction ? `\nCreative direction: ${direction}` : ''}

Design guidelines:
- Dark background (#0a0908), sage green accent (#92B090), white text
- Each variation should be distinctly different in visual approach
- Include the slide content but present it differently
- Use clean, modern design with good typography

Return ONLY a JSON array with exactly 3 objects: [{"label":"Brief description","html":"<div style=\\"...\\">...</div>"}]
No markdown, no explanation, just the JSON array.`;

  try {
    const response = await ctx.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content
      .filter(b => b.type === 'text')
      .map(b => b.type === 'text' ? b.text : '')
      .join('');

    // Parse JSON from response
    const start = textContent.indexOf('[');
    const end = textContent.lastIndexOf(']');
    if (start === -1 || end === -1) {
      return {
        toolResult: { updatedSlides: ctx.slides, result: 'Failed to parse variations from AI response.' },
        screenshot: null,
      };
    }

    const variations = JSON.parse(textContent.slice(start, end + 1));

    return {
      toolResult: {
        updatedSlides: ctx.slides,
        result: JSON.stringify({ type: 'variations', slideIndex: slideIdx, variations }),
      },
      screenshot: null,
    };
  } catch (err) {
    return {
      toolResult: {
        updatedSlides: ctx.slides,
        result: `Variation generation failed: ${err instanceof Error ? err.message : 'unknown error'}`,
      },
      screenshot: null,
    };
  }
}

// ---------------------------------------------------------------------------
// Auto-verify helper (used after set_slide_html)
// ---------------------------------------------------------------------------

/**
 * Analyze slide HTML across 3 dimensions: Layout, Content, Interactions.
 * Returns a structured text report the agent can reason about.
 */
export function analyzeSlideLayout(html: string): string {
  const layout: string[] = [];
  const content: string[] = [];
  const interactions: string[] = [];

  // =========================================================================
  // DIMENSION 1: LAYOUT — spatial positioning, sizing, balance
  // =========================================================================

  // Centering
  const hasVerticalCenter =
    /justify-content:\s*center/i.test(html) ||
    /align-items:\s*center/i.test(html);
  const hasHorizontalCenter =
    /text-align:\s*center/i.test(html) ||
    /margin:\s*(0\s+)?auto/i.test(html) ||
    /align-items:\s*center/i.test(html);

  if (!hasVerticalCenter) {
    layout.push("⚠ NO VERTICAL CENTERING — content likely stuck at the top. Add justify-content:center or align-items:center on a height:100% container.");
  } else {
    layout.push("✓ Vertical centering present");
  }

  // Full-height container
  if (!/height:\s*100%/i.test(html) && !/min-height:\s*100%/i.test(html)) {
    layout.push("⚠ NO height:100% — content won't fill the 1080px slide height.");
  }

  // Padding
  const paddingValues = [...html.matchAll(/padding:\s*(\d+)/g)].map(m => parseInt(m[1]));
  const maxPadding = paddingValues.length > 0 ? Math.max(...paddingValues) : 0;
  if (maxPadding < 60 && paddingValues.length > 0) {
    layout.push(`⚠ MAX PADDING is only ${maxPadding}px — should be 80px+ for presentation slides.`);
  } else if (maxPadding >= 80) {
    layout.push(`✓ Padding: ${maxPadding}px`);
  }

  // Layout structure
  const flexCount = (html.match(/display:\s*flex/gi) || []).length;
  const gridCount = (html.match(/display:\s*grid/gi) || []).length;
  const absCount = (html.match(/position:\s*absolute/gi) || []).length;
  layout.push(`Structure: ${flexCount} flex, ${gridCount} grid, ${absCount} absolute`);

  // Width constraints
  const maxWidths = [...html.matchAll(/max-width:\s*(\d+)/g)].map(m => parseInt(m[1]));
  if (maxWidths.length > 0) {
    const narrowest = Math.min(...maxWidths);
    if (narrowest < 600) {
      layout.push(`⚠ NARROW CONTENT — max-width:${narrowest}px only uses ${Math.round(narrowest/1920*100)}% of the 1920px canvas.`);
    } else {
      layout.push(`Content width: ${narrowest}px (${Math.round(narrowest/1920*100)}% of canvas)`);
    }
  }

  // Balance check — look for asymmetric layouts
  const hasTwoColumns = /flex:\s*1/i.test(html) || gridCount > 0;
  if (!hasTwoColumns && !hasHorizontalCenter && absCount === 0) {
    layout.push("⚠ POSSIBLE ASYMMETRY — no multi-column layout or centering. Content may be crammed to one side.");
  }

  // =========================================================================
  // DIMENSION 2: CONTENT — typography, hierarchy, density
  // =========================================================================

  // Font sizes
  const fontSizes = [...html.matchAll(/font-size:\s*(\d+)px/g)].map(m => parseInt(m[1]));
  const minFont = fontSizes.length > 0 ? Math.min(...fontSizes) : 0;
  const maxFont = fontSizes.length > 0 ? Math.max(...fontSizes) : 0;

  if (maxFont > 0) {
    content.push(`Font range: ${minFont}px – ${maxFont}px`);
    if (maxFont < 40) {
      content.push("⚠ NO DOMINANT ELEMENT — largest font is only ${maxFont}px. Titles should be 52-72px, stats 64-96px.");
    }
    if (minFont < 16) {
      content.push(`⚠ TINY TEXT at ${minFont}px — won't be readable when presented. Minimum 18px.`);
    }
  }

  // Text density — count text content roughly
  const textLength = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().length;
  if (textLength > 600) {
    content.push(`⚠ HIGH TEXT DENSITY (${textLength} chars) — this is a document, not a slide. Cut to key phrases.`);
  } else if (textLength > 400) {
    content.push(`Text density: ${textLength} chars — on the high side. Consider cutting.`);
  } else {
    content.push(`✓ Text density: ${textLength} chars`);
  }

  // Paragraph count
  const paragraphs = (html.match(/<p[^>]*>/gi) || []).length;
  if (paragraphs > 3) {
    content.push(`⚠ ${paragraphs} PARAGRAPHS — too many. Max 2-3 short ones, or use bullet fragments.`);
  }

  // List items
  const listItems = (html.match(/<li[^>]*>/gi) || []).length;
  if (listItems > 6) {
    content.push(`⚠ ${listItems} LIST ITEMS — too many. Max 5 per slide.`);
  } else if (listItems > 0) {
    content.push(`List items: ${listItems}`);
  }

  // Videos and images
  const videoCount = (html.match(/<video/gi) || []).length;
  const imgCount = (html.match(/<img/gi) || []).length;
  if (videoCount > 0) content.push(`Videos: ${videoCount}`);
  if (imgCount > 0) content.push(`Images: ${imgCount}`);
  if (videoCount === 0 && imgCount === 0 && maxFont < 50) {
    content.push("⚠ NO VISUAL ANCHOR — no images, videos, or large typography. Slide needs a dominant visual element.");
  }

  // =========================================================================
  // DIMENSION 3: INTERACTIONS — animations, scripts, dynamic behavior
  // =========================================================================

  const hasGsap = html.includes("gsap") || html.includes("GSAP");
  const hasScript = (html.match(/<script/gi) || []).length;
  const hasTransition = /transition:/i.test(html);
  const hasAnimation = /animation:/i.test(html) || /@keyframes/i.test(html);

  if (hasGsap) {
    interactions.push("GSAP detected");
    // Check for the activation pattern
    if (!html.includes("MutationObserver") && !html.includes("classList.contains('active')")) {
      interactions.push("⚠ GSAP WITHOUT ACTIVATION TRIGGER — animations may fire before the slide is visible. Use MutationObserver to wait for the 'active' class.");
    } else {
      interactions.push("✓ GSAP activation trigger present");
    }
  }

  if (hasScript > 0) interactions.push(`Script tags: ${hasScript}`);
  if (hasTransition) interactions.push("CSS transitions present");
  if (hasAnimation) interactions.push("CSS keyframe animations present");

  if (hasScript === 0 && !hasTransition && !hasAnimation) {
    interactions.push("✓ Static slide (no animations) — clean and reliable.");
  }

  // =========================================================================
  // Build report
  // =========================================================================

  return [
    "SLIDE QUALITY CHECK:",
    "",
    "📐 LAYOUT:",
    ...layout.map(l => "  " + l),
    "",
    "📝 CONTENT:",
    ...content.map(c => "  " + c),
    "",
    "⚡ INTERACTIONS:",
    ...interactions.map(i => "  " + i),
  ].join("\n");
}

export async function autoVerifySlide(
  slideIdx: number,
  slides: SlideData[],
  theme: string,
  templateId?: string,
  supabase?: SupabaseClient,
): Promise<{ screenshot: string | null; layoutReport: string }> {
  const slide = slides[slideIdx];
  if (!slide) return { screenshot: null, layoutReport: "" };

  // Always do structural analysis (fast, no Playwright needed)
  const layoutReport = slide.html ? analyzeSlideLayout(slide.html) : "";

  // Try screenshot capture
  let screenshot: string | null = null;
  try {
    if (templateId && supabase) {
      // Save current slides to Supabase so the server route serves the latest version
      await supabase
        .from("slide_templates")
        .update({ slides_json: slides })
        .eq("id", templateId);

      // Navigate Playwright to the server-rendered slide route
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
      screenshot = await captureSlideScreenshotFromUrl(
        `${baseUrl}/api/slide/${templateId}/${slideIdx}`
      );
    } else {
      // Fallback: render HTML locally (for cases without templateId)
      const slideHtml = renderSlidesToHTML(
        [{ ...slide, order: 0 }],
        theme,
        { showProgress: false },
      );
      screenshot = await captureSlideScreenshot(slideHtml);
    }
  } catch {}

  return { screenshot, layoutReport };
}
