"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/sections/Footer";
import TextScramble from "@/app/components/effects/TextScramble";
import FadeIn from "@/app/components/effects/FadeIn";
import type { Job, JobCategory } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";

/* ============================================
   CONSTANTS
   ============================================ */

const PAGE_SIZE = 18;

const ALL_CATEGORIES: { key: "all" | JobCategory; label: string }[] = [
  { key: "all", label: "All" },
  ...Object.entries(JOB_CATEGORIES).map(([key, label]) => ({
    key: key as JobCategory,
    label,
  })),
];

/* ============================================
   HELPERS
   ============================================ */

/** Return a human-friendly relative date string. */
function relativeDate(iso: string): string {
  const posted = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1w ago";
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1mo ago";
  return `${diffMonths}mo ago`;
}

/* ============================================
   JOB CARD
   ============================================ */

function JobCard({ job, index }: { job: Job; index: number }) {
  const displaySkills = job.skills.slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        href={`/jobs/${job.slug}`}
        className="group block h-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-5 md:p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 relative overflow-hidden"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Top row: category + date */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
              {JOB_CATEGORIES[job.category]}
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {relativeDate(job.datePosted)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
            {job.title}
          </h3>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] truncate max-w-[180px]"
                title={skill}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                +{job.skills.length - 3}
              </span>
            )}
          </div>

          {/* Bottom row: compensation, remote badge, apply hint */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              {/* Compensation */}
              <span className="font-mono text-sm font-semibold text-[var(--accent-primary)]">
                ${job.compensationMin}&ndash;{job.compensationMax}/hr
              </span>

              {/* Remote badge */}
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                <MapPin className="w-2.5 h-2.5" />
                Remote
              </span>
            </div>

            {/* Apply hint */}
            <span className="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1">
              View
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============================================
   JOB BOARD (main client component)
   ============================================ */

export default function JobBoard({ jobs }: { jobs: Job[] }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | JobCategory>(
    "all",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ----- Filtering logic ----- */
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((j) => j.category === activeCategory);
    }

    // Keyword search across title, skills, description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [jobs, activeCategory, searchQuery]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  // Count jobs per category for the pill labels
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: jobs.length };
    for (const job of jobs) {
      counts[job.category] = (counts[job.category] || 0) + 1;
    }
    return counts;
  }, [jobs]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            HERO / HEADER
        ---------------------------------------- */}
        <section className="pt-28 md:pt-36 pb-10 md:pb-16">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] font-mono mb-10">
              <Link
                href="/"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--accent-primary)]">Jobs</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// OPEN POSITIONS"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find your role in{" "}
                <TextScramble
                  text="frontier AI."
                  scrambleOnHover
                  autoPlay
                  delay={300}
                />
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                Remote, contractor-based roles for domain experts. Browse open
                positions and apply in minutes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ----------------------------------------
            SEARCH + FILTERS + GRID
        ---------------------------------------- */}
        <section className="pb-16 md:pb-24">
          <div className="container">
            {/* Search bar */}
            <FadeIn delay={0.1}>
              <div className="relative mb-6">
                <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg overflow-hidden focus-within:border-[var(--accent-primary)]/50 transition-colors">
                  <span className="pl-4 pr-1 font-mono text-sm text-[var(--accent-primary)] select-none">
                    $
                  </span>
                  <Search className="w-4 h-4 text-[var(--text-muted)] mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword, skill, or title..."
                    className="w-full bg-transparent py-3 pr-4 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-4 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      clear
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Category filter pills */}
            <FadeIn delay={0.15}>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {ALL_CATEGORIES.map(({ key, label }) => {
                  const isActive = activeCategory === key;
                  const count = categoryCounts[key] ?? 0;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] font-semibold"
                          : "bg-transparent text-[var(--text-tertiary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {label}
                      <span
                        className={`text-[10px] ${isActive ? "text-[var(--bg-primary)]/70" : "text-[var(--text-muted)]"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </FadeIn>

            {/* Job count */}
            <FadeIn delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--text-primary)]">
                    Showing {visibleJobs.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-[var(--text-primary)]">
                    {filteredJobs.length}
                  </span>{" "}
                  position{filteredJobs.length !== 1 ? "s" : ""}
                </p>

                {(searchQuery || activeCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="font-mono text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </FadeIn>

            {/* Job card grid */}
            <AnimatePresence mode="popLayout">
              {visibleJobs.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
                >
                  {visibleJobs.map((job, i) => (
                    <JobCard key={job.slug} job={job} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <p className="font-mono text-lg text-[var(--text-secondary)] mb-2">
                    No positions found
                  </p>
                  <p className="font-mono text-sm text-[var(--text-muted)] mb-6">
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="font-mono text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors underline underline-offset-4"
                  >
                    Reset all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load more */}
            {hasMore && (
              <FadeIn delay={0.1}>
                <div className="text-center mt-10">
                  <button
                    onClick={() =>
                      setVisibleCount((prev) => prev + PAGE_SIZE)
                    }
                    className="inline-flex items-center gap-2 font-mono text-sm px-6 py-3 rounded-full border border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50 hover:text-[var(--text-primary)] transition-all duration-300"
                  >
                    Load more positions
                    <span className="text-[var(--text-muted)]">
                      ({filteredJobs.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              </FadeIn>
            )}

            {/* Bottom CTA */}
            <FadeIn delay={0.25}>
              <div className="mt-16 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 p-8 md:p-10 text-center">
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-3">
                  {"// DON'T SEE THE RIGHT FIT?"}
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  Submit a general application
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-lg mx-auto">
                  New roles open every week. Apply now and we will match you
                  with projects that fit your expertise.
                </p>
                <a
                  href="https://app.claru.ai/signup"
                  className="btn-cta-glitch !px-8 !py-3 !text-sm"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
