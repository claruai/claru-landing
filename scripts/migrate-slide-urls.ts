/**
 * Migrate existing slide HTML to use proxy URLs.
 *
 * Reads all slide_templates with slides_json from Supabase, rewrites S3
 * references in each slide's html field to use /api/media/s3?key=KEY proxy
 * URLs via rewriteS3ToProxy. Idempotent — already-proxied URLs are unchanged.
 *
 * Run with:
 *   npx tsx scripts/migrate-slide-urls.ts
 *
 * Requires env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Inline rewriteS3ToProxy (avoids path alias issues when running via tsx)
// Mirrors src/lib/deck-builder/rewrite-s3-urls.ts
// ---------------------------------------------------------------------------

const PROXY_PREFIX = "/api/media/s3?key=";

function isAlreadyProxied(url: string): boolean {
  return url.includes("/api/media/s3?key=");
}

function rewriteS3ToProxy(html: string): string {
  if (!html) return html;

  if (
    !html.includes("s3-placeholder.local") &&
    !html.includes("moonvalley-annotation-platform.s3") &&
    !html.includes("{{s3:")
  ) {
    return html;
  }

  let result = html;

  // Pattern 1: s3-placeholder.local/path/to/file.ext
  result = result.replace(
    /https?:\/\/s3-placeholder\.local\/([^"'\s)]+)/g,
    (_match: string, key: string) => {
      return PROXY_PREFIX + encodeURIComponent(key);
    }
  );

  // Pattern 2: S3 bucket URLs — signed, unsigned, or double-signed
  result = result.replace(
    /https:\/\/moonvalley-annotation-platform\.s3[^"'\s)]*?\.amazonaws\.com\/([^"'\s?)]+)\??[^"'\s)]*/g,
    (match: string, key: string) => {
      if (isAlreadyProxied(match)) return match;
      return PROXY_PREFIX + encodeURIComponent(key);
    }
  );

  // Pattern 3: {{s3:path/to/file}} template tokens
  result = result.replace(
    /\{\{s3:([^}]+)\}\}/g,
    (_match: string, key: string) => {
      return PROXY_PREFIX + encodeURIComponent(key.trim());
    }
  );

  return result;
}

// ---------------------------------------------------------------------------
// Admin client
// ---------------------------------------------------------------------------

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
    process.exit(1);
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

interface SlideRow {
  id: string;
  order: number;
  html?: string;
  [key: string]: unknown;
}

interface TemplateRow {
  id: string;
  name: string;
  slides_json: SlideRow[];
}

async function migrate() {
  const supabase = createSupabaseAdminClient();

  console.log("Fetching all slide_templates with slides_json...");

  const { data: templates, error } = await supabase
    .from("slide_templates")
    .select("id, name, slides_json");

  if (error) {
    console.error("Failed to fetch templates:", error.message);
    process.exit(1);
  }

  if (!templates || templates.length === 0) {
    console.log("No templates found.");
    return;
  }

  let templatesProcessed = 0;
  let templatesUpdated = 0;
  let slidesUpdated = 0;
  let urlsRewritten = 0;

  for (const template of templates as TemplateRow[]) {
    templatesProcessed++;

    const slides = template.slides_json;
    if (!Array.isArray(slides) || slides.length === 0) {
      continue;
    }

    let templateChanged = false;
    const updatedSlides: SlideRow[] = [];

    for (const slide of slides) {
      if (!slide.html) {
        updatedSlides.push(slide);
        continue;
      }

      const originalHtml = slide.html;
      const rewrittenHtml = rewriteS3ToProxy(originalHtml);

      if (rewrittenHtml !== originalHtml) {
        // Count the number of URLs that changed
        const originalProxyCount = (originalHtml.match(/\/api\/media\/s3\?key=/g) || []).length;
        const rewrittenProxyCount = (rewrittenHtml.match(/\/api\/media\/s3\?key=/g) || []).length;
        const newUrls = rewrittenProxyCount - originalProxyCount;

        urlsRewritten += newUrls;
        slidesUpdated++;
        templateChanged = true;

        updatedSlides.push({ ...slide, html: rewrittenHtml });
        console.log(
          `  [${template.name}] slide ${slide.order}: rewrote ${newUrls} URL(s)`
        );
      } else {
        updatedSlides.push(slide);
      }
    }

    if (templateChanged) {
      const { error: updateError } = await supabase
        .from("slide_templates")
        .update({ slides_json: updatedSlides })
        .eq("id", template.id);

      if (updateError) {
        console.error(
          `  [${template.name}] FAILED to save: ${updateError.message}`
        );
      } else {
        templatesUpdated++;
        console.log(`  [${template.name}] saved.`);
      }
    }
  }

  console.log("\n--- Migration Complete ---");
  console.log(`Templates processed: ${templatesProcessed}`);
  console.log(`Templates updated:   ${templatesUpdated}`);
  console.log(`Slides updated:      ${slidesUpdated}`);
  console.log(`URLs rewritten:      ${urlsRewritten}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
