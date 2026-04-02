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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* Nav breadcrumb */}
        <div className="border-b border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto px-6 py-4">
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
                <li className="text-[var(--text-primary)]">blog</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
          <p className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-widest mb-4">
            insights
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] mb-4">
            Physical AI Training Data
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Technical writing on robotics datasets, VLA model training, egocentric
            video, and the infrastructure behind frontier physical AI.
          </p>
        </header>

        {/* Post list */}
        <main className="max-w-4xl mx-auto px-6 pb-24">
          {allPosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-mono text-sm text-[var(--text-muted)]">
                no posts yet — check back soon.
              </p>
            </div>
          ) : (
            <ol className="space-y-0 divide-y divide-[var(--border-subtle)]">
              {allPosts.map((post) => (
                <li key={post.id} className="py-10">
                  <article>
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 px-2 py-0.5 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-[var(--accent-primary)] transition-colors duration-150"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 max-w-2xl">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-4">
                      <time
                        dateTime={post.published_at ?? post.created_at}
                        className="text-xs font-mono text-[var(--text-muted)]"
                      >
                        {formatDate(post.published_at ?? post.created_at)}
                      </time>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-mono text-[var(--accent-primary)] hover:underline transition-all"
                        aria-label={`Read: ${post.title}`}
                      >
                        read →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </main>
      </div>
    </>
  );
}
