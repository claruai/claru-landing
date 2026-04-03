/**
 * /admin/blog-queue — Review queue for pipeline-generated blog posts
 *
 * Auth: reuses existing admin-token JWT cookie pattern (same as /admin/dashboard).
 * Unauthenticated requests redirect to /admin (the admin login page).
 *
 * Lists all posts with status = 'pending_review'.
 * Each post shows: title, excerpt, created_at, word count.
 * Actions: Approve → /api/blog/publish | Reject → /api/blog/reject
 * Preview: links to /blog/[slug] rendered via the standard post page.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import BlogQueueActions from "./BlogQueueActions";

// =============================================================================
// No ISR — always fresh for admin UI
// =============================================================================

export const dynamic = "force-dynamic";

// =============================================================================
// Metadata (noindex)
// =============================================================================

export const metadata: Metadata = {
  title: "Blog Queue | Claru Admin",
  robots: { index: false, follow: false },
};

// =============================================================================
// Types
// =============================================================================

interface PendingPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string[];
  body_mdx: string;
  created_at: string;
}

// =============================================================================
// Data fetching
// =============================================================================

async function getPendingPosts(): Promise<PendingPost[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, tags, body_mdx, created_at")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false });

    if (error) {
      // PGRST200 = table not found in schema cache (migration not yet run)
      if (error.code === "PGRST200" || error.message?.includes("schema cache")) {
        return [];
      }
      console.error("[admin/blog-queue] Supabase error:", error.message);
      return [];
    }

    return (data ?? []) as PendingPost[];
  } catch (err) {
    console.error("[admin/blog-queue] Unexpected error:", err);
    return [];
  }
}

// =============================================================================
// Helpers
// =============================================================================

function wordCount(body: string): number {
  return body
    .replace(/[#*`_\[\]()>]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// =============================================================================
// Page component
// =============================================================================

export default async function BlogQueuePage() {
  // Auth check — reuse existing admin JWT cookie pattern
  const cookieStore = await cookies();
  const isAuthenticated = await getAdminSession(cookieStore);

  if (!isAuthenticated) {
    redirect("/admin");
  }

  const posts = await getPendingPosts();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-mono font-semibold text-[var(--text-primary)]">
              claru
              <span className="text-[var(--accent-primary)]">/</span>
              admin
              <span className="text-[var(--accent-primary)]">/</span>
              blog-queue
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              {posts.length} post{posts.length !== 1 ? "s" : ""} pending review
            </p>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              ← dashboard
            </Link>
            <Link
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              view blog ↗
            </Link>
          </nav>
        </div>
      </header>

      {/* Queue */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-[var(--text-muted)]">
              queue is empty — no posts pending review.
            </p>
          </div>
        ) : (
          <ol className="space-y-6">
            {posts.map((post) => {
              const wc = wordCount(post.body_mdx);
              const wcStatus =
                wc < 900
                  ? "error"
                  : wc < 1200
                    ? "warn"
                    : wc > 2800
                      ? "warn"
                      : "ok";

              return (
                <li
                  key={post.id}
                  className="border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-secondary)]"
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                      {post.title}
                    </h2>
                    {/* Word count badge */}
                    <span
                      className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-sm border ${
                        wcStatus === "error"
                          ? "text-[var(--error)] border-[var(--error)]/30 bg-[var(--error)]/5"
                          : wcStatus === "warn"
                            ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
                            : "text-[var(--accent-primary)] border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5"
                      }`}
                      title={
                        wcStatus === "error"
                          ? "Under 900 words — hard fail"
                          : wcStatus === "warn"
                            ? "Outside 1,200–2,800 word target"
                            : "Word count OK"
                      }
                    >
                      {wc.toLocaleString()} words
                    </span>
                  </div>

                  {/* Slug */}
                  <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                    /blog/
                    <span className="text-[var(--accent-primary)]">
                      {post.slug}
                    </span>
                  </p>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <p className="text-xs font-mono text-[var(--text-muted)] mb-5">
                    queued: {formatDate(post.created_at)}
                  </p>

                  {/* Action row — client component handles API calls */}
                  <BlogQueueActions postId={post.id} slug={post.slug} />
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </div>
  );
}
