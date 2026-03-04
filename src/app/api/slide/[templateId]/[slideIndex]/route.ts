import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTheme } from "@/lib/deck-builder/slide-themes";
import { renderSlideLayout, getBackgroundCSS } from "@/lib/deck-builder/slide-layouts";
import { rewriteS3ToProxy } from "@/lib/deck-builder/rewrite-s3-urls";
import type { SlideData, SlideThemeCustom } from "@/types/deck-builder";

/**
 * GET /api/slide/[templateId]/[slideIndex]
 *
 * Serves a single slide as a full HTML page. Each slide is its own mini website
 * with full capabilities — the browser can fetch, load media, run scripts.
 *
 * S3 media references in the HTML are rewritten to /api/media/s3?key=... proxy
 * URLs. The proxy handles signing at request time, so URLs never expire.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; slideIndex: string }> },
) {
  const { templateId, slideIndex: slideIndexStr } = await params;
  const slideIndex = parseInt(slideIndexStr, 10);

  if (isNaN(slideIndex) || slideIndex < 0) {
    return new Response("Invalid slide index", { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: template } = await supabase
    .from("slide_templates")
    .select("slides_json, theme, custom_theme")
    .eq("id", templateId)
    .single();

  if (!template) {
    return new Response("Template not found", { status: 404 });
  }

  const slides = (template.slides_json as SlideData[]) ?? [];
  const sorted = [...slides].sort((a, b) => a.order - b.order);
  const slide = sorted[slideIndex];

  if (!slide) {
    return new Response("Slide not found", { status: 404 });
  }

  const theme = getTheme(
    template.theme ?? "terminal-green",
    template.custom_theme as SlideThemeCustom | undefined,
  );

  // Get the slide's HTML content
  let slideHtml: string;
  if (slide.html) {
    slideHtml = slide.html;
  } else {
    // Generate from layout system (background + grid + glow + content)
    const bgCSS = getBackgroundCSS(slide.background);
    const content = renderSlideLayout(slide, theme);
    slideHtml = `<div style="position:absolute;inset:0;${bgCSS}"></div>
<div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(${theme.colors.accent}15 1px,transparent 1px),linear-gradient(90deg,${theme.colors.accent}15 1px,transparent 1px);background-size:60px 60px;"></div>
<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 15% 50%,${theme.colors.accent}18 0%,transparent 55%),radial-gradient(ellipse at 85% 50%,${theme.colors.accent}0c 0%,transparent 55%);"></div>
<div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:60px 80px;">${content}</div>`;
  }

  // Rewrite S3 references to proxy URLs (synchronous, no signing)
  slideHtml = rewriteS3ToProxy(slideHtml);

  // Build full HTML page
  const origin = request.nextUrl.origin;
  const html = buildSlidePage(slideHtml, theme, origin);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}

/**
 * Wrap slide content in a full HTML page with theme styles.
 */
function buildSlidePage(
  slideContent: string,
  theme: ReturnType<typeof getTheme>,
  origin: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${origin}/">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%; overflow: hidden;
      font-family: ${theme.fonts.body};
      color: ${theme.colors.text};
      background: ${theme.colors.background};
      -webkit-font-smoothing: antialiased;
    }
    .slide-root {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      overflow: hidden;
    }
    h1, h2, h3 { font-family: ${theme.fonts.heading}; color: ${theme.colors.text}; }
    code { font-family: ${theme.fonts.mono}; background: ${theme.colors.secondaryBg}; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; border: 1px solid ${theme.colors.border}; }
    a { color: ${theme.colors.accent}; text-decoration: none; }
    video { display: block; }
    .slide-body p { margin-bottom: 14px; }
    .slide-body p:last-child { margin-bottom: 0; }
    .slide-body strong { color: ${theme.colors.text}; font-weight: 600; }
    .slide-body em { color: ${theme.colors.accent}; font-style: italic; }
    .slide-body ul { list-style: none; padding-left: 0; margin: 14px 0; }
    .slide-body ul li { padding-left: 24px; position: relative; margin-bottom: 10px; line-height: 1.6; }
    .slide-body ul li::before {
      content: '';
      position: absolute;
      left: 4px; top: 10px;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${theme.colors.accent};
      box-shadow: 0 0 6px ${theme.colors.accent}40;
    }
  </style>
</head>
<body>
  <div class="slide-root">${slideContent}</div>
</body>
</html>`;
}
