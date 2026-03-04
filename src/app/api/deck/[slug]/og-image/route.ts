// =============================================================================
// GET /api/deck/[slug]/og-image
//
// Returns a 1200x630 PNG screenshot of the first slide for Open Graph previews.
// No auth required -- public endpoint for social media crawlers.
// =============================================================================

import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  captureSlideScreenshotFromUrl,
  captureSlideScreenshot,
} from "@/lib/deck-builder/slide-capture";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_VIEWPORT = { width: OG_WIDTH, height: OG_HEIGHT };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the origin for internal fetch calls.
 * Prefers NEXT_PUBLIC_SITE_URL, then VERCEL_URL, then localhost.
 */
function getOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Generates a simple Claru-branded placeholder HTML for cases where the deck
 * is not found or sharing is disabled.
 */
function buildPlaceholderHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${OG_WIDTH}px;
    height: ${OG_HEIGHT}px;
    background: #0a0908;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
    color: #e8e8e8;
  }
  .logo {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: #92B090;
    margin-bottom: 24px;
  }
  .tagline {
    font-size: 20px;
    color: #888;
    letter-spacing: 0.05em;
  }
  .border-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #92B090 0%, #6a8a68 100%);
  }
</style>
</head>
<body>
  <div class="border-accent"></div>
  <div class="logo">CLARU</div>
  <div class="tagline">Expert Human Intelligence for AI Labs</div>
</body>
</html>`;
}

/**
 * Captures a screenshot of the Claru-branded placeholder HTML at OG dimensions.
 */
async function capturePlaceholder(): Promise<string> {
  return captureSlideScreenshot(buildPlaceholderHtml(), OG_VIEWPORT);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const supabase = createSupabaseAdminClient();

  // Look up the template by slug in share_settings JSONB
  const { data: template } = await supabase
    .from("slide_templates")
    .select("id, share_settings")
    .eq("share_settings->>slug", slug)
    .single();

  const shareSettings = template?.share_settings as
    | { enabled?: boolean; slug?: string }
    | null;

  const isValid = template && shareSettings?.enabled === true;

  let base64: string;

  if (isValid) {
    const slideUrl = `${getOrigin()}/api/slide/${template.id}/0`;

    try {
      base64 = await captureSlideScreenshotFromUrl(slideUrl, OG_VIEWPORT);
    } catch (err) {
      console.error(
        "[og-image] Screenshot capture failed, using placeholder:",
        err,
      );
      base64 = await capturePlaceholder();
    }
  } else {
    base64 = await capturePlaceholder();
  }

  const buffer = Buffer.from(base64, "base64");

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
      "Content-Length": String(buffer.length),
    },
  });
}
