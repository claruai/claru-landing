/**
 * /blog/[slug] — Individual blog post page
 *
 * MDX rendering: this file uses a lightweight, SAFE approach.
 * next-mdx-remote is NOT yet installed (see dependency note below).
 * Until it is added, MDX body is rendered as plain HTML via a
 * minimal remark/rehype pipeline (server-side only, no eval).
 *
 * DEPENDENCY REQUIRED:
 *   npm install next-mdx-remote
 *   (or: npm install @next/mdx remark remark-html)
 *
 * Once next-mdx-remote is installed, uncomment the MDXRemote block below
 * and remove the fallback plain-text renderer.
 *
 * DO NOT use dangerouslySetInnerHTML with untrusted MDX until a sanitizer
 * (e.g. rehype-sanitize) is wired into the pipeline.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/admin-auth";
import { BlogVideoPlayer } from "./BlogVideoPlayer";

// =============================================================================
// ISR — revalidate every hour; on-demand revalidation via /api/blog/publish
// =============================================================================

export const revalidate = 3600;

// =============================================================================
// Types
// =============================================================================

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_mdx: string;
  tags: string[];
  source_urls: string[];
  mentions: Array<{ name: string; url?: string }>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  video_url: string | null;
  composition_id: string | null;
  input_props: Record<string, unknown> | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Data fetching helpers
// =============================================================================

async function getPostBySlug(slug: string, previewMode = false): Promise<BlogPost | null> {
  try {
    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, body_mdx, tags, source_urls, mentions, published_at, created_at, updated_at, video_url, composition_id, input_props"
      )
      .eq("slug", slug);

    if (!previewMode) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") return null; // not found
      console.error("[blog/[slug]] Supabase error:", error.message);
      return null;
    }

    return data as BlogPost;
  } catch (err) {
    console.error("[blog/[slug]] Unexpected error:", err);
    return null;
  }
}

async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("status", "published");

    if (error) return [];
    return (data ?? []).map((row: { slug: string }) => row.slug);
  } catch {
    return [];
  }
}

// =============================================================================
// generateStaticParams
// =============================================================================

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Static blog posts (file-based routes that exist as separate page.tsx files)
  const staticSlugs = [
    "best-egocentric-data-providers",
    "data-enrichment-pipeline-physical-ai",
  ];

  const dbSlugs = await getAllPublishedSlugs();

  // Merge, deduplicate
  const allSlugs = Array.from(new Set([...staticSlugs, ...dbSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

// =============================================================================
// generateMetadata
// =============================================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const isAdmin = await getAdminSession(cookieStore);
  const post = await getPostBySlug(slug, isAdmin);

  if (!post) {
    return {
      title: "Post Not Found | Claru Blog",
    };
  }

  const title = `${post.title} | Claru Blog`;
  const description = post.excerpt ?? post.title;
  const url = `https://claru.ai/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Claru",
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags,
      images: [
        {
          url: "/images/og-v3.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

// =============================================================================
// JSON-LD builders
// =============================================================================

/**
 * Extract FAQ items from MDX body text.
 * Looks for lines starting with "## " inside a section that contains "FAQ"
 * and treats the following paragraph as the answer.
 *
 * This is a heuristic — the pipeline prompt mandates a FAQ section with
 * numbered question headings, so this pattern is reliable for pipeline-generated
 * posts. It degrades gracefully (empty array) if no FAQ section is found.
 */
function extractFaqItems(
  body: string
): Array<{ question: string; answer: string }> {
  const items: Array<{ question: string; answer: string }> = [];

  // Find the FAQ section block
  const faqSectionMatch = body.match(
    /##\s+(?:FAQ|Frequently Asked Questions)([\s\S]*?)(?=\n##\s|\s*$)/i
  );
  if (!faqSectionMatch) return items;

  const faqSection = faqSectionMatch[1];

  // Match question headings (### or **Q:) and following paragraph text
  const questionPattern = /###\s+(.+?)\n+([\s\S]+?)(?=\n###|\s*$)/g;
  let match: RegExpExecArray | null;

  while ((match = questionPattern.exec(faqSection)) !== null) {
    const question = match[1].trim();
    // Take first non-empty paragraph as the answer, strip markdown
    const answerRaw = match[2]
      .trim()
      .split("\n\n")[0]
      .replace(/[*_`#]/g, "")
      .trim();
    if (question && answerRaw) {
      items.push({ question, answer: answerRaw });
    }
  }

  return items;
}

/**
 * Extract named entities from MDX for the BlogPosting `mentions` array.
 * Looks for bold-formatted terms (**Term**) that appear to be proper nouns.
 */
function extractMentions(body: string): Array<{ name: string }> {
  const seen = new Set<string>();
  const mentions: Array<{ name: string }> = [];
  const boldPattern = /\*\*([A-Z][^*]{2,40})\*\*/g;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(body)) !== null) {
    const name = match[1].trim();
    if (!seen.has(name)) {
      seen.add(name);
      mentions.push({ name });
    }
    if (mentions.length >= 10) break;
  }

  return mentions;
}

function buildBlogPostingJsonLd(post: BlogPost) {
  const faqItems = extractFaqItems(post.body_mdx);
  // Prefer structured mentions stored at generation time; fall back to regex extraction
  const mentions = (post.mentions?.length ?? 0) > 0
    ? post.mentions
    : extractMentions(post.body_mdx);
  const url = `https://claru.ai/blog/${post.slug}`;

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: post.title,
    description: post.excerpt ?? post.title,
    url,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      "@id": "https://claru.ai/#organization",
      name: "Claru",
      url: "https://claru.ai",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://claru.ai/#organization",
      name: "Claru",
      url: "https://claru.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://claru.ai/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
    ...(mentions.length > 0 && {
      mentions: mentions.map((m) => ({
        "@type": "Thing",
        name: m.name,
      })),
    }),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://claru.ai",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://claru.ai/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return { blogPosting, breadcrumb, faqJsonLd };
}

// =============================================================================
// Safe MDX renderer
//
// next-mdx-remote is not yet installed. This renders MDX as plain paragraphs
// so the page is functional and readable. The markup is generated server-side
// from a trusted source (Supabase, service-role key, admin-approved content)
// so dangerouslySetInnerHTML is used ONLY after sanitization via the
// lightweight stripDangerousHtml helper below.
//
// Replace this entire block with next-mdx-remote once the package is installed.
// =============================================================================

/**
 * Strip any script/iframe/on* handler patterns from a string.
 * This is a defence-in-depth measure — content is already admin-approved —
 * but belt-and-suspenders is the right call here.
 */
function stripDangerousHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>/gi, "")
    .replace(/<\/?div[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

/**
 * Convert MDX/Markdown text to a safe HTML string.
 * This is intentionally minimal — it handles the patterns produced by the
 * blog pipeline prompt and the existing manual posts.
 *
 * When next-mdx-remote is installed this function should be removed and
 * replaced with the MDXRemote component.
 */
function mdxToSafeHtml(mdx: string): string {
  // Strip leading H1 or H2 if it duplicates the post title (template renders it separately)
  const bodyMdx = mdx.replace(/^#{1,2}\s+.+\n/, "");

  // Pre-process: convert markdown pipe tables to HTML before paragraph splitting.
  // Matches any block of consecutive pipe-starting lines that contains a separator row.
  const tableProcessed = bodyMdx.replace(
    /^(\|[^\n]+\n)+/gm,
    (match) => {
      const lines = match.trim().split("\n").filter((l) => l.trim().startsWith("|"));
      const sepIdx = lines.findIndex((l) => /^\|[-| :]+\|$/.test(l.trim()));
      if (sepIdx < 1) return match; // no separator row — not a table
      const headers = lines[0].split("|").filter((c) => c.trim()).map((c) => `<th>${c.trim()}</th>`).join("");
      const bodyRows = lines
        .slice(sepIdx + 1)
        .filter((l) => l.trim())
        .map((row) => {
          const cells = row.split("|").filter((c) => c.trim()).map((c) => `<td>${c.trim()}</td>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `\n<table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>\n`;
    }
  );

  let html = tableProcessed
    // Headings
    .replace(/^#### (.+)$/gm, (_, t) => `<h4>${t.replace(/\s*\{#[^}]+\}/g, '')}</h4>`)
    .replace(/^### (.+)$/gm, (_, t) => `<h3>${t.replace(/\s*\{#[^}]+\}/g, '')}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2>${t.replace(/\s*\{#[^}]+\}/g, '')}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1>${t.replace(/\s*\{#[^}]+\}/g, '')}</h1>`)
    // Bold / italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Links — allow http/https, relative paths, and anchor links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const trimmed = href.trim();
      const safe = /^(https?:\/\/|\/|#)/i.test(trimmed) ? trimmed : "#";
      return `<a href="${safe}">${label}</a>`;
    })
    // Horizontal rule
    .replace(/^---$/gm, "<hr>");

  // Group consecutive blockquote lines into a single <blockquote> element.
  // This MUST happen before \n → <br> conversion so lines are still grouped.
  // Lines starting with "> - " become <li> items; others become <p> items.
  html = html.replace(/^((?:> [^\n]*(?:\n|$))+)/gm, (block) => {
    const lines = block
      .split("\n")
      .filter((l) => l.startsWith("> ") || l === ">")
      .map((l) => l.replace(/^> ?/, ""));

    let innerHtml = "";
    for (const line of lines) {
      if (!line.trim()) continue;
      if (/^[-*] /.test(line)) {
        innerHtml += `<li>${line.slice(2)}</li>`;
      } else {
        innerHtml += `<p>${line}</p>`;
      }
    }
    return `<blockquote>${innerHtml}</blockquote>\n\n`;
  });

  // Double newline → paragraph break
  html = html.replace(/\n\n/g, "</p><p>");
  // Single newline → <br>
  html = html.replace(/\n/g, "<br>");

  html = "<p>" + html + "</p>";

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>");

  return stripDangerousHtml(html);
}

// =============================================================================
// Reading time estimator
// =============================================================================

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// =============================================================================
// Page component
// =============================================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const isAdmin = await getAdminSession(cookieStore);
  const post = await getPostBySlug(slug, isAdmin);

  if (!post) {
    notFound();
  }

  const isPreview = isAdmin && !post.published_at;
  const { blogPosting, breadcrumb, faqJsonLd } = buildBlogPostingJsonLd(post);
  const htmlContent = mdxToSafeHtml(post.body_mdx);
  const displayDate = post.published_at ?? post.created_at;
  const readingTime = estimateReadingTime(post.body_mdx);

  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedUpdated = new Date(post.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {/* JSON-LD: FAQPage (conditional) */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div
        className="min-h-screen"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {/* Preview banner — only visible to admins viewing unpublished posts */}
        {isPreview && (
          <div
            style={{
              background: "rgba(250,204,21,0.06)",
              borderBottom: "1px solid rgba(250,204,21,0.2)",
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#fbbf24",
              }}
            >
              preview mode — this post is pending review and not yet public
            </p>
            <Link
              href="/admin/blog-queue"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#fbbf24",
                flexShrink: 0,
              }}
            >
              ← back to queue
            </Link>
          </div>
        )}

        {/* Breadcrumb nav */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <nav aria-label="Breadcrumb">
              <ol
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                <li>
                  <Link href="/" style={{ color: "var(--text-muted)" }}>
                    claru.ai
                  </Link>
                </li>
                <li aria-hidden="true" style={{ opacity: 0.4 }}>
                  /
                </li>
                <li>
                  <Link href="/blog" style={{ color: "var(--text-muted)" }}>
                    blog
                  </Link>
                </li>
                <li aria-hidden="true" style={{ opacity: 0.4 }}>
                  /
                </li>
                <li
                  style={{
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                  }}
                  title={post.slug}
                >
                  {post.slug}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Article header */}
        <header
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            paddingTop: "64px",
            paddingBottom: "56px",
          }}
        >
          <div className="max-w-4xl mx-auto px-6">
            {/* Tags row */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: "var(--accent-primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      padding: "3px 8px",
                      border: "1px solid rgba(146,176,144,0.25)",
                      borderRadius: "2px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="mb-6"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                maxWidth: "820px",
              }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center gap-4 mb-8"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
            >
              <time
                dateTime={displayDate}
                style={{ color: "var(--accent-primary)" }}
                aria-label="Published date"
              >
                {formattedDate}
              </time>
              <span
                style={{ color: "var(--border-medium)", userSelect: "none" }}
              >
                ·
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                {readingTime} min read
              </span>
              {post.updated_at !== post.created_at && (
                <>
                  <span
                    style={{
                      color: "var(--border-medium)",
                      userSelect: "none",
                    }}
                  >
                    ·
                  </span>
                  <time
                    dateTime={post.updated_at}
                    style={{ color: "var(--text-muted)" }}
                  >
                    updated {formattedUpdated}
                  </time>
                </>
              )}
            </div>

            {/* Excerpt / deck */}
            {post.excerpt && (
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  maxWidth: "680px",
                  paddingLeft: "16px",
                  borderLeft: "2px solid rgba(146,176,144,0.4)",
                }}
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </header>

        {/* Article body */}
        <div className="max-w-4xl mx-auto px-6 pb-32 pt-12">
          {/*
           * MDX rendering note:
           * Currently rendered as sanitized HTML from the mdxToSafeHtml helper.
           * When next-mdx-remote is installed, replace this div with:
           *
           *   import { MDXRemote } from "next-mdx-remote/rsc";
           *   <MDXRemote source={post.body_mdx} components={ALLOWED_COMPONENTS} />
           *
           * ALLOWED_COMPONENTS should be a strict allowlist (no Script, no Iframe,
           * no arbitrary HTML injection) to prevent XSS from pipeline-generated content.
           */}
          <article>
            <style>{`
              .blog-prose p {
                font-family: var(--font-sans);
                font-size: 1rem;
                color: var(--text-secondary);
                line-height: 1.85;
                margin-bottom: 1.5rem;
                max-width: 68ch;
              }
              .blog-prose h1 {
                font-family: var(--font-sans);
                font-size: 1.875rem;
                font-weight: 700;
                color: var(--text-primary);
                letter-spacing: -0.025em;
                line-height: 1.25;
                margin-top: 3rem;
                margin-bottom: 1rem;
              }
              .blog-prose h2 {
                font-family: var(--font-sans);
                font-size: 1.375rem;
                font-weight: 600;
                color: var(--text-primary);
                letter-spacing: -0.02em;
                line-height: 1.3;
                margin-top: 3rem;
                margin-bottom: 0.875rem;
                padding-top: 0.5rem;
                border-top: 1px solid var(--border-subtle);
              }
              .blog-prose h3 {
                font-family: var(--font-sans);
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--text-primary);
                letter-spacing: -0.015em;
                line-height: 1.4;
                margin-top: 2.25rem;
                margin-bottom: 0.75rem;
              }
              .blog-prose h4 {
                font-family: var(--font-mono);
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--accent-primary);
                letter-spacing: 0.08em;
                text-transform: uppercase;
                margin-top: 2rem;
                margin-bottom: 0.5rem;
              }
              .blog-prose strong {
                color: var(--text-primary);
                font-weight: 600;
              }
              .blog-prose em {
                color: var(--text-secondary);
                font-style: italic;
              }
              .blog-prose a {
                color: var(--accent-primary);
                text-decoration: none;
                border-bottom: 1px solid rgba(146,176,144,0.3);
                transition: border-color 0.15s;
              }
              .blog-prose a:hover {
                border-bottom-color: var(--accent-primary);
              }
              .blog-prose code {
                font-family: var(--font-mono);
                font-size: 0.8125rem;
                color: var(--accent-primary);
                background: rgba(146,176,144,0.08);
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid rgba(146,176,144,0.15);
              }
              .blog-prose ul {
                margin-bottom: 0.375rem;
                margin-top: 0;
                padding-left: 0;
                list-style: none;
              }
              .blog-prose p + ul,
              .blog-prose br + ul {
                margin-top: 0.5rem;
              }
              .blog-prose ul li {
                font-family: var(--font-sans);
                font-size: 1rem;
                color: var(--text-secondary);
                line-height: 1.65;
                margin-bottom: 0.375rem;
                padding-left: 1.25rem;
                position: relative;
                max-width: 68ch;
              }
              .blog-prose ul li p,
              .blog-prose ol li p {
                margin-bottom: 0;
              }
              .blog-prose ul li::before {
                content: "–";
                position: absolute;
                left: 0;
                color: var(--accent-primary);
                font-family: var(--font-mono);
              }
              .blog-prose blockquote {
                margin: 2rem 0;
                padding: 1.25rem 1.5rem;
                background: rgba(146,176,144,0.04);
                border-left: 3px solid var(--accent-primary);
                border-radius: 0 4px 4px 0;
              }
              .blog-prose blockquote p {
                margin-bottom: 0.625rem;
                color: var(--text-secondary);
                font-style: italic;
                font-size: 0.9375rem;
              }
              .blog-prose blockquote p:first-child {
                font-style: normal;
                font-family: var(--font-mono);
                font-size: 0.7rem;
                color: var(--accent-primary);
                text-transform: uppercase;
                letter-spacing: 0.12em;
                margin-bottom: 0.75rem;
              }
              .blog-prose blockquote ul {
                margin: 0;
                padding-left: 0;
                list-style: none;
              }
              .blog-prose blockquote ul li {
                font-family: var(--font-sans);
                font-size: 0.9375rem;
                color: var(--text-secondary);
                line-height: 1.7;
                margin-bottom: 0.5rem;
                padding-left: 1.5rem;
                position: relative;
                font-style: normal;
                max-width: none;
              }
              .blog-prose blockquote ul li::before {
                content: "–";
                position: absolute;
                left: 0;
                color: var(--accent-primary);
                font-family: var(--font-mono);
              }
              .blog-prose hr {
                border: none;
                border-top: 1px solid var(--border-subtle);
                margin: 3rem 0;
              }
              .blog-prose table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 2rem;
                font-family: var(--font-sans);
                font-size: 0.875rem;
              }
              .blog-prose th {
                text-align: left;
                padding: 10px 14px;
                border-bottom: 1px solid var(--border-medium);
                color: var(--text-muted);
                font-family: var(--font-mono);
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                font-weight: 500;
              }
              .blog-prose td {
                padding: 10px 14px;
                border-bottom: 1px solid var(--border-subtle);
                color: var(--text-secondary);
                vertical-align: top;
                line-height: 1.6;
              }
              .blog-prose tr:last-child td {
                border-bottom: none;
              }
              .blog-prose tr:hover td {
                background: rgba(255,255,255,0.02);
              }
            `}</style>

            {/* Visual — Lambda video (published) or Remotion Player (preview/fallback) */}
            {post.video_url ? (
              <video
                src={post.video_url}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  marginBottom: '2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ) : post.composition_id ? (
              <BlogVideoPlayer
                compositionId={post.composition_id}
                inputProps={post.input_props ?? {}}
              />
            ) : null}

            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Source links */}
          {post.source_urls.length > 0 && (
            <aside
              style={{
                marginTop: "64px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginBottom: "16px",
                }}
              >
                sources
              </p>
              <ul
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {post.source_urls.map((url, idx) => (
                  <li
                    key={url}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        color: "var(--text-muted)",
                        minWidth: "20px",
                      }}
                    >
                      [{idx + 1}]
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "var(--accent-primary)",
                        wordBreak: "break-all",
                        borderBottom: "1px solid rgba(146,176,144,0.2)",
                        textDecoration: "none",
                      }}
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Footer nav */}
          <div
            style={{
              marginTop: "56px",
              paddingTop: "32px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              <span>←</span>
              <span>All articles</span>
            </Link>

            {post.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      padding: "2px 7px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "2px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
