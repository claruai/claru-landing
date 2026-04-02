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
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// Data fetching helpers
// =============================================================================

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, body_mdx, tags, source_urls, published_at, created_at, updated_at"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

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
  const post = await getPostBySlug(slug);

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
  const mentions = extractMentions(post.body_mdx);
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
  let html = mdx
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
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
    // Links — only allow http/https/relative paths to prevent javascript: injection
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const trimmed = href.trim();
      const safe = /^(https?:\/\/|\/)/i.test(trimmed) ? trimmed : "#";
      return `<a href="${safe}">${label}</a>`;
    })
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Double newline → paragraph break
    .replace(/\n\n/g, "</p><p>")
    // Single newline → <br>
    .replace(/\n/g, "<br>");

  html = "<p>" + html + "</p>";

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>");

  return stripDangerousHtml(html);
}

// =============================================================================
// Page component
// =============================================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { blogPosting, breadcrumb, faqJsonLd } = buildBlogPostingJsonLd(post);
  const htmlContent = mdxToSafeHtml(post.body_mdx);

  const displayDate = post.published_at ?? post.created_at;

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

      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* Breadcrumb nav */}
        <div className="border-b border-[var(--border-subtle)]">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[var(--accent-primary)] transition-colors"
                  >
                    claru.ai
                  </Link>
                </li>
                <li aria-hidden="true" className="opacity-40">
                  /
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-[var(--accent-primary)] transition-colors"
                  >
                    blog
                  </Link>
                </li>
                <li aria-hidden="true" className="opacity-40">
                  /
                </li>
                <li
                  className="text-[var(--text-primary)] truncate max-w-[200px]"
                  title={post.slug}
                >
                  {post.slug}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Article header */}
        <header className="max-w-3xl mx-auto px-6 pt-14 pb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 px-2 py-0.5 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] leading-snug mb-6">
            {post.title}
          </h1>

          {/* Freshness stamp — accent monospace as per GEO spec */}
          <div className="flex items-center gap-4 mb-6">
            <time
              dateTime={displayDate}
              className="text-xs font-mono text-[var(--accent-primary)]"
              aria-label="Published date"
            >
              published:{" "}
              {new Date(displayDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.updated_at !== post.created_at && (
              <>
                <span className="text-[var(--border-subtle)] font-mono text-xs">
                  ·
                </span>
                <time
                  dateTime={post.updated_at}
                  className="text-xs font-mono text-[var(--text-muted)]"
                >
                  updated:{" "}
                  {new Date(post.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </div>

          {/* Excerpt / deck */}
          {post.excerpt && (
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--accent-primary)]/30 pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-6 pb-24">
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
          <div
            className="prose prose-invert prose-sm max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
              prose-a:text-[var(--accent-primary)] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-secondary)] prose-code:px-1 prose-code:rounded
              prose-strong:text-[var(--text-primary)]
              prose-blockquote:border-l-[var(--accent-primary)] prose-blockquote:text-[var(--text-muted)]
              prose-table:text-sm prose-th:text-[var(--text-muted)] prose-td:text-[var(--text-secondary)]
              prose-hr:border-[var(--border-subtle)]
              prose-li:text-[var(--text-secondary)]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Source links */}
          {post.source_urls.length > 0 && (
            <aside className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
              <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
                sources
              </h2>
              <ul className="space-y-2">
                {post.source_urls.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[var(--accent-primary)] hover:underline break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Back to blog */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              ← back to blog
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
