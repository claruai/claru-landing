/**
 * Download case study image assets from Notion S3 URLs.
 *
 * Reads each markdown doc in docs/case-studies/*.md, extracts the slug and
 * any Notion image URLs listed in a "Notion Asset URLs" or "Notion Image URLs"
 * section, then downloads them to public/images/case-studies/[slug]/.
 *
 * Run with:
 *   npx tsx scripts/download-case-study-assets.ts
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOCS_DIR = path.resolve(__dirname, "../docs/case-studies");
const OUTPUT_BASE = path.resolve(__dirname, "../public/images/case-studies");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the slug from the "## Slug" section of a markdown file. */
function extractSlug(content: string): string | null {
  const match = content.match(/^## Slug\s*\n+([^\n#]+)/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract all URLs from the "## Notion Asset URLs" or "## Notion Image URLs"
 * section. Returns an empty array if the section doesn't exist.
 */
function extractNotionUrls(content: string): string[] {
  // Match either heading variant
  const sectionMatch = content.match(
    /^## Notion (?:Asset|Image) URLs\s*\n([\s\S]*?)(?=\n## |\n# |$)/m
  );
  if (!sectionMatch) return [];

  const sectionBody = sectionMatch[1];
  // Extract all URLs (http/https) from the section body
  const urlRegex = /https?:\/\/[^\s)\]>]+/g;
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(sectionBody)) !== null) {
    urls.push(m[0]);
  }
  return urls;
}

/** Derive a file extension from a URL or Content-Type header. */
function guessExtension(url: string, contentType?: string): string {
  // Try Content-Type first
  if (contentType) {
    if (contentType.includes("png")) return ".png";
    if (contentType.includes("jpeg") || contentType.includes("jpg"))
      return ".jpg";
    if (contentType.includes("gif")) return ".gif";
    if (contentType.includes("webp")) return ".webp";
    if (contentType.includes("svg")) return ".svg";
  }
  // Try URL path
  const pathname = new URL(url).pathname;
  const extMatch = pathname.match(/\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i);
  if (extMatch) {
    const ext = extMatch[1].toLowerCase();
    return ext === "jpeg" ? ".jpg" : `.${ext}`;
  }
  // Default
  return ".png";
}

/** Download a single URL to a local file path. Returns true on success. */
function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;

    const request = client.get(url, { timeout: 15_000 }, (res) => {
      // Follow redirects (up to 3)
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        downloadFile(res.headers.location, dest).then(resolve);
        return;
      }

      if (!res.statusCode || res.statusCode >= 400) {
        console.warn(
          `  [WARN] HTTP ${res.statusCode ?? "unknown"} for ${url.slice(0, 80)}...`
        );
        resolve(false);
        return;
      }

      // Update extension based on Content-Type if needed
      const contentType = res.headers["content-type"] ?? "";
      const actualExt = guessExtension(url, contentType);
      const currentExt = path.extname(dest);
      if (actualExt !== currentExt) {
        dest = dest.replace(/\.[^.]+$/, actualExt);
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
      file.on("error", (err) => {
        console.warn(`  [WARN] Write error: ${err.message}`);
        fs.unlink(dest, () => {});
        resolve(false);
      });
    });

    request.on("error", (err) => {
      console.warn(`  [WARN] Request error: ${err.message}`);
      resolve(false);
    });

    request.on("timeout", () => {
      request.destroy();
      console.warn(`  [WARN] Timeout for ${url.slice(0, 80)}...`);
      resolve(false);
    });
  });
}

/** Generate a descriptive filename for the Nth image in a case study. */
function generateFilename(index: number, ext: string): string {
  if (index === 0) return `hero${ext}`;
  return `image-${index + 1}${ext}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Case Study Asset Downloader ===\n");

  // Ensure docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`ERROR: docs directory not found at ${DOCS_DIR}`);
    process.exit(1);
  }

  // Read all markdown files
  const mdFiles = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (mdFiles.length === 0) {
    console.error("ERROR: No markdown files found in docs/case-studies/");
    process.exit(1);
  }

  console.log(`Found ${mdFiles.length} case study docs.\n`);

  // Ensure base output directory exists
  fs.mkdirSync(OUTPUT_BASE, { recursive: true });

  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalCaseStudies = 0;
  const caseStudiesWithAssets: string[] = [];
  const caseStudiesWithoutAssets: string[] = [];

  for (const file of mdFiles) {
    const filePath = path.join(DOCS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const slug = extractSlug(content);
    if (!slug) {
      console.warn(`[WARN] No slug found in ${file}, skipping.`);
      continue;
    }

    totalCaseStudies++;
    const slugDir = path.join(OUTPUT_BASE, slug);
    fs.mkdirSync(slugDir, { recursive: true });

    const urls = extractNotionUrls(content);

    if (urls.length === 0) {
      caseStudiesWithoutAssets.push(slug);
      // Create a placeholder README
      const readmePath = path.join(slugDir, "README.md");
      if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(
          readmePath,
          [
            `# ${slug}`,
            "",
            "Assets for this case study need to be manually added.",
            "",
            "Expected files:",
            "- hero.png (hero/header image)",
            "- image-2.png (supporting visual)",
            "- image-3.png (supporting visual)",
            "",
            "Once added, update the images array in:",
            `src/data/case-studies/${slug}.json`,
            "",
          ].join("\n")
        );
      }
      console.log(`[${slug}] No Notion URLs found -- created placeholder directory.`);
      continue;
    }

    caseStudiesWithAssets.push(slug);
    console.log(`[${slug}] Found ${urls.length} URL(s). Downloading...`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const ext = guessExtension(url);
      const filename = generateFilename(i, ext);
      const dest = path.join(slugDir, filename);

      process.stdout.write(`  ${filename}... `);
      const ok = await downloadFile(url, dest);
      if (ok) {
        console.log("OK");
        totalDownloaded++;
      } else {
        console.log("FAILED");
        totalFailed++;
      }
    }

    console.log();
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  console.log("=== Summary ===");
  console.log(
    `Downloaded ${totalDownloaded} images for ${caseStudiesWithAssets.length} case studies, ${totalFailed} failures.`
  );

  if (caseStudiesWithoutAssets.length > 0) {
    console.log(
      `\n${caseStudiesWithoutAssets.length} case studies had no Notion URLs -- placeholder directories created:`
    );
    for (const s of caseStudiesWithoutAssets) {
      console.log(`  - public/images/case-studies/${s}/`);
    }
  }

  console.log(
    `\nTotal: ${totalCaseStudies} case studies processed.`
  );
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
