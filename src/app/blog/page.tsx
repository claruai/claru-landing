import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// ISR — revalidate every hour
// =============================================================================

export const revalidate = 3600;

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Claru Blog | Physical AI Training Data Insights",
  description:
    "Technical articles on physical AI training data, robotics datasets, VLA models, and embodied AI from Claru.",
  keywords: [
    "physical AI training data",
    "robotics datasets",
    "VLA models",
    "embodied AI",
    "egocentric video data",
    "AI training data insights",
  ],
  openGraph: {
    title: "Claru Blog | Physical AI Training Data Insights",
    description:
      "Technical articles on physical AI training data, robotics datasets, VLA models, and embodied AI from Claru.",
    type: "website",
    url: "https://claru.ai/blog",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v3.png",
        width: 1200,
        height: 630,
        alt: "Claru Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claru Blog | Physical AI Training Data Insights",
    description:
      "Technical articles on physical AI training data, robotics datasets, VLA models, and embodied AI from Claru.",
  },
  alternates: {
    canonical: "https://claru.ai/blog",
  },
};

// =============================================================================
// JSON-LD: Blog
// =============================================================================

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://claru.ai/blog",
  name: "Claru Blog",
  description:
    "Technical articles on physical AI training data, robotics datasets, VLA models, and embodied AI.",
  url: "https://claru.ai/blog",
  publisher: {
    "@type": "Organization",
    "@id": "https://claru.ai/#organization",
    name: "Claru",
    url: "https://claru.ai",
  },
};

// =============================================================================
// Types
// =============================================================================

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

// =============================================================================
// Data fetching
// =============================================================================

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, tags, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      // PGRST200 = table not found in schema cache (migration not yet run)
      if (error.code === "PGRST200" || error.message?.includes("schema cache")) {
        return [];
      }
      console.error("[blog/page] Supabase error:", error.message);
      return [];
    }

    return (data ?? []) as BlogPost[];
  } catch (err) {
    console.error("[blog/page] Unexpected error:", err);
    return [];
  }
}

// =============================================================================
// Helpers
// =============================================================================

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// =============================================================================
// Static posts (manually published before pipeline, file-based)
// These are already in the codebase as static routes and appear in the index.
// =============================================================================

const STATIC_POSTS: BlogPost[] = [
  {
    id: "static-best-egocentric-data-providers",
    slug: "best-egocentric-data-providers",
    title: "7 Best Egocentric Video Data Providers for Robotics (2026)",
    excerpt:
      "Side-by-side comparison of 7 egocentric video data providers for robotics and physical AI in 2026, covering Claru, Luel, Encord, Appen, Labelbox, Ego4D, and Scale AI.",
    tags: ["egocentric video", "robotics", "data providers", "comparison"],
    published_at: "2026-03-30T00:00:00Z",
    created_at: "2026-03-30T00:00:00Z",
  },
  {
    id: "static-data-enrichment-pipeline-physical-ai",
    slug: "data-enrichment-pipeline-physical-ai",
    title: "Data Enrichment Pipeline for Physical AI (2026)",
    excerpt:
      "How Claru's enrichment pipeline adds depth maps, pose estimation, semantic segmentation, and action labels to raw video to produce training-ready physical AI datasets.",
    tags: [
      "data enrichment",
      "physical AI",
      "pipeline",
      "depth maps",
      "pose estimation",
    ],
    published_at: "2026-03-28T00:00:00Z",
    created_at: "2026-03-28T00:00:00Z",
  },
  {
    id: "static-vlm-vs-vla",
    slug: "vlm-vs-vla",
    title: "VLM vs VLA: What's the Actual Difference? (2026)",
    excerpt:
      "VLMs generate text; VLAs generate motor commands. Here's exactly where the architectures diverge, what training data each needs, and why the distinction matters for robotics teams.",
    tags: ["VLA", "VLM", "robotics", "model architecture"],
    published_at: "2026-04-02T00:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "static-vla-training-data-volume",
    slug: "vla-training-data-volume",
    title: "How Much Training Data Does a VLA Model Need? (2026)",
    excerpt:
      "OpenVLA pre-trained on 970K trajectories fine-tunes in ~1.5 hours with 50–200 demos for simple tasks. Here are the concrete numbers for VLA data requirements across task complexity.",
    tags: ["VLA", "training data", "data volume", "robotics"],
    published_at: "2026-04-02T00:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "static-sim-to-real-gap",
    slug: "sim-to-real-gap",
    title: "The Sim-to-Real Gap Explained: Why It Happens and How to Close It (2026)",
    excerpt:
      "Four specific causes of the sim-to-real gap — visual domain gap, physics approximation error, sensor noise mismatch, and long-tail scenario absence — and what real-world data addresses each.",
    tags: ["sim-to-real", "robotics", "domain randomization", "real-world data"],
    published_at: "2026-04-02T00:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "static-physical-ai-stack",
    slug: "physical-ai-stack",
    title: "The Physical AI Stack: From Raw Sensor Data to Robot Action (2026)",
    excerpt:
      "Layer-by-layer breakdown of how physical AI robots learn: perception (Depth Anything V2, ViTPose, SAM3), world modeling, policy learning (Diffusion Policy, ACT, π0), and language grounding.",
    tags: ["physical AI", "robotics", "perception", "policy learning", "architecture"],
    published_at: "2026-04-02T00:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
];

// =============================================================================
// Page component
// =============================================================================

export default async function BlogIndexPage() {
  const dbPosts = await getPublishedPosts();

  // Merge static posts and DB posts; deduplicate by slug (DB takes precedence)
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const staticFallback = STATIC_POSTS.filter((p) => !dbSlugs.has(p.slug));
  const allPosts = [...dbPosts, ...staticFallback].sort((a, b) => {
    const aDate = a.published_at ?? a.created_at;
    const bDate = b.published_at ?? b.created_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  const featuredPost = allPosts[0] ?? null;
  const remainingPosts = allPosts.slice(1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* CSS-only hover states — no client JS needed */}
      <style>{`
        .blog-breadcrumb-link {
          color: var(--text-muted);
          transition: color 0.15s;
        }
        .blog-breadcrumb-link:hover {
          color: var(--accent-primary);
        }
        .blog-card-link {
          display: block;
          background: transparent;
          transition: background 0.15s;
        }
        .blog-card-link:hover {
          background: rgba(146, 176, 144, 0.04);
        }
        .blog-featured-link:hover .blog-featured-title {
          opacity: 0.8;
        }
        .blog-featured-link:hover .blog-arrow {
          transform: translateX(4px);
        }
        .blog-arrow {
          display: inline-block;
          transition: transform 0.2s ease-out;
        }
        .blog-card-link:hover .blog-card-title {
          opacity: 0.8;
        }
        .blog-card-link:hover .blog-card-arrow {
          transform: translateX(3px);
          color: var(--accent-primary);
        }
        .blog-card-title {
          transition: opacity 0.15s;
        }
        .blog-card-arrow {
          display: inline-block;
          transition: transform 0.2s ease-out, color 0.15s;
          color: var(--text-muted);
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {/* Breadcrumb nav */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                <li>
                  <Link
                    href="/"
                    className="blog-breadcrumb-link"
                  >
                    claru.ai
                  </Link>
                </li>
                <li aria-hidden="true" style={{ opacity: 0.4 }}>/</li>
                <li style={{ color: "var(--text-primary)" }}>blog</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page header */}
        <header className="max-w-6xl mx-auto px-6 pt-14 pb-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p
                className="uppercase tracking-widest mb-3"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--accent-primary)",
                  letterSpacing: "0.15em",
                }}
              >
                field notes
              </p>
              <h1
                className="tracking-tight"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                Physical AI
                <br />
                <span style={{ color: "var(--accent-primary)" }}>Training Data</span>
              </h1>
            </div>
            <p
              className="hidden md:block max-w-sm pb-1"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              Technical writing on robotics datasets, VLA model training,
              egocentric video, and frontier physical AI.
            </p>
          </div>
        </header>

        {/* Horizontal rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ height: "1px", background: "var(--border-subtle)" }} />
        </div>

        <main className="max-w-6xl mx-auto px-6 pb-32">
          {allPosts.length === 0 ? (
            <div className="py-24 text-center">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                no posts yet — check back soon.
              </p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featuredPost && (
                <div className="py-12 md:py-16" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="blog-featured-link block"
                    aria-label={`Read featured post: ${featuredPost.title}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
                      {/* Left: meta column */}
                      <div className="md:w-48 shrink-0 flex md:flex-col gap-3 md:gap-4 pt-1">
                        <span
                          className="uppercase tracking-widest"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "9px",
                            color: "var(--accent-primary)",
                            letterSpacing: "0.2em",
                            display: "inline-block",
                            padding: "3px 8px",
                            border: "1px solid rgba(146,176,144,0.3)",
                            borderRadius: "2px",
                          }}
                        >
                          latest
                        </span>
                        <time
                          dateTime={featuredPost.published_at ?? featuredPost.created_at}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            display: "block",
                          }}
                        >
                          {formatDateLong(featuredPost.published_at ?? featuredPost.created_at)}
                        </time>
                      </div>

                      {/* Right: content */}
                      <div className="flex-1">
                        {/* Tags */}
                        {featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {featuredPost.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="uppercase tracking-widest"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "9px",
                                  color: "var(--text-muted)",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h2
                          className="blog-featured-title mb-4"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            transition: "opacity 0.15s",
                          }}
                        >
                          {featuredPost.title}
                        </h2>

                        {featuredPost.excerpt && (
                          <p
                            className="mb-6 max-w-2xl"
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "1rem",
                              color: "var(--text-secondary)",
                              lineHeight: 1.7,
                            }}
                          >
                            {featuredPost.excerpt}
                          </p>
                        )}

                        <span
                          className="inline-flex items-center gap-2"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--accent-primary)",
                          }}
                        >
                          Read article
                          <span className="blog-arrow">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Remaining posts grid */}
              {remainingPosts.length > 0 && (
                <div className="pt-12">
                  <p
                    className="uppercase tracking-widest mb-8"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    more articles
                  </p>

                  <ol className="grid md:grid-cols-2 gap-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    {remainingPosts.map((post, idx) => (
                      <li
                        key={post.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          borderRight: idx % 2 === 0 ? "1px solid var(--border-subtle)" : undefined,
                        }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="blog-card-link group block p-8 h-full"
                          aria-label={`Read: ${post.title}`}
                        >
                          <article className="h-full flex flex-col">
                            {/* Date + tags row */}
                            <div className="flex items-center gap-3 mb-4">
                              <time
                                dateTime={post.published_at ?? post.created_at}
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "10px",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {formatDate(post.published_at ?? post.created_at)}
                              </time>
                              {post.tags.slice(0, 1).map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "9px",
                                    color: "var(--accent-primary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    opacity: 0.7,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Title */}
                            <h2
                              className="blog-card-title mb-3 flex-1"
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "1.05rem",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                lineHeight: 1.35,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            {post.excerpt && (
                              <p
                                className="mb-5"
                                style={{
                                  fontFamily: "var(--font-sans)",
                                  fontSize: "0.825rem",
                                  color: "var(--text-muted)",
                                  lineHeight: 1.65,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {post.excerpt}
                              </p>
                            )}

                            {/* Read link */}
                            <span
                              className="inline-flex items-center gap-1.5 transition-colors duration-200 mt-auto"
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                color: "var(--text-muted)",
                              }}
                            >
                              Read
                              <span className="blog-card-arrow">→</span>
                            </span>
                          </article>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
