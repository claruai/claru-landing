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
import type { Job, JobCategory, JobLocale } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";
import { buildJobsCtaUrl } from "@/lib/tracking/jobs";
import { jobsI18n } from "@/lib/jobs-i18n";

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

const COUNTRIES: { code: string; label: string; flag: string }[] = [
  { code: "all", label: "All countries", flag: "🌎" },
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "CA", label: "Canada", flag: "🇨🇦" },
  { code: "MX", label: "Mexico", flag: "🇲🇽" },
  { code: "BR", label: "Brazil", flag: "🇧🇷" },
  { code: "AR", label: "Argentina", flag: "🇦🇷" },
  { code: "CO", label: "Colombia", flag: "🇨🇴" },
  { code: "CL", label: "Chile", flag: "🇨🇱" },
  { code: "PE", label: "Peru", flag: "🇵🇪" },
  { code: "IN", label: "India", flag: "🇮🇳" },
  { code: "PH", label: "Philippines", flag: "🇵🇭" },
  { code: "ID", label: "Indonesia", flag: "🇮🇩" },
  { code: "VN", label: "Vietnam", flag: "🇻🇳" },
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

function JobCard({
  job,
  index,
  locale,
  basePath,
}: {
  job: Job;
  index: number;
  locale: JobLocale;
  basePath: string;
}) {
  const displaySkills = job.skills.slice(0, 3);
  const isClosed = job.status === "closed";
  const t = jobsI18n(locale);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        href={`${basePath}/${job.slug}`}
        className={`group block h-full rounded-xl border bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 relative overflow-hidden ${
          isClosed
            ? "border-[var(--border-subtle)] opacity-60 hover:opacity-80"
            : "border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40"
        }`}
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

          {/* Bottom row: compensation, status badge, apply hint */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              {/* Compensation */}
              <span
                className={`font-mono text-sm font-semibold ${
                  isClosed
                    ? "text-[var(--text-muted)]"
                    : "text-[var(--accent-primary)]"
                }`}
              >
                {job.compensationMin === job.compensationMax
                  ? `$${job.compensationMin}/hr`
                  : `$${job.compensationMin}–${job.compensationMax}/hr`}
              </span>

              {/* Status badge */}
              {isClosed ? (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--text-muted)]/15 text-[var(--text-muted)] border border-[var(--text-muted)]/30">
                  {t.closedChip}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  <MapPin className="w-2.5 h-2.5" />
                  Remote
                </span>
              )}
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

export default function JobBoard({
  jobs,
  locale = "en",
  basePath = "/jobs",
}: {
  jobs: Job[];
  locale?: JobLocale;
  basePath?: string;
}) {
  const t = jobsI18n(locale);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | JobCategory>(
    "all",
  );
  // Default country derives from locale (es-MX → MX, pt-BR → BR, en → all).
  const [activeCountry, setActiveCountry] = useState<string>(() =>
    locale === "en" ? "all" : t.defaultCountry,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [closedExpanded, setClosedExpanded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  /* ----- Filtering pipeline ----- */
  const applyFilters = (list: Job[]) => {
    let result = list;
    if (activeCategory !== "all") {
      result = result.filter((j) => j.category === activeCategory);
    }
    if (activeCountry !== "all") {
      result = result.filter((j) => {
        const tc = j.targetCountries;
        if (!tc || tc.length === 0) return true;
        return tc.includes(activeCountry);
      });
    }
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
  };

  const allOpenJobs = useMemo(
    () => jobs.filter((j) => j.status !== "closed"),
    [jobs],
  );
  const allClosedJobs = useMemo(
    () => jobs.filter((j) => j.status === "closed"),
    [jobs],
  );

  const filteredOpenJobs = useMemo(
    () => applyFilters(allOpenJobs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allOpenJobs, activeCategory, activeCountry, searchQuery],
  );
  const filteredClosedJobs = useMemo(
    () => applyFilters(allClosedJobs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allClosedJobs, activeCategory, activeCountry, searchQuery],
  );

  // Primary count line + pagination work against the OPEN list. Closed roles
  // live in their own collapsed section below.
  const filteredJobs = filteredOpenJobs;

  // Reset visible count when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeCountry, searchQuery]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  // Category pill counts reflect OPEN roles only so the chrome can't suggest
  // there are more options than there actually are.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allOpenJobs.length };
    for (const job of allOpenJobs) {
      counts[job.category] = (counts[job.category] || 0) + 1;
    }
    return counts;
  }, [allOpenJobs]);

  // Closed pagination uses its own visible-count, reset whenever filters change.
  const closedVisibleCount = closedExpanded ? PAGE_SIZE : 0;
  const visibleClosedJobs = filteredClosedJobs.slice(0, closedVisibleCount);

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
                {t.heroEyebrow}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t.heroHeadline}{" "}
                <TextScramble
                  text={t.heroHeadlineHighlight}
                  scrambleOnHover
                  autoPlay
                  delay={300}
                />
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                {t.heroSubcopy}
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
                    placeholder={t.searchPlaceholder}
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

            {/* Country dropdown */}
            <FadeIn delay={0.12}>
              <div className="flex items-center gap-2 mb-3">
                <label
                  htmlFor="country-filter"
                  className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
                >
                  {t.filterCountryLabel}
                </label>
                <select
                  id="country-filter"
                  value={activeCountry}
                  onChange={(e) => setActiveCountry(e.target.value)}
                  className="font-mono text-xs px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 focus:outline-none focus:border-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option
                      key={c.code}
                      value={c.code}
                      className="bg-[var(--bg-secondary)]"
                    >
                      {c.flag}{" "}
                      {c.code === "all"
                        ? t.filterCountryAll
                        : t.countryLabels[c.code] ?? c.label}
                    </option>
                  ))}
                </select>
              </div>
            </FadeIn>

            {/* Category filter pills */}
            <FadeIn delay={0.15}>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {ALL_CATEGORIES.map(({ key, label }) => {
                  const isActive = activeCategory === key;
                  const count = categoryCounts[key] ?? 0;
                  const displayLabel =
                    key === "all" ? t.filterCategoryAll : label;

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
                      {displayLabel}
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

            {/* Open positions section header */}
            <FadeIn delay={0.18}>
              <div className="flex items-end justify-between mb-3 pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="font-mono text-xs text-[var(--accent-primary)] mb-1">
                    {t.openPositionsEyebrow}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                    {t.openPositionsHeading}
                  </h2>
                </div>
                <span className="font-mono text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">
                  {filteredOpenJobs.length}
                </span>
              </div>
            </FadeIn>

            {/* Job count */}
            <FadeIn delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--text-primary)]">
                    {t.countLabelShowing} {visibleJobs.length}
                  </span>{" "}
                  {t.countLabelOf}{" "}
                  <span className="text-[var(--text-primary)]">
                    {filteredJobs.length}
                  </span>{" "}
                  {t.countLabelPositions}
                </p>

                {(searchQuery ||
                  activeCategory !== "all" ||
                  activeCountry !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                      setActiveCountry("all");
                    }}
                    className="font-mono text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                  >
                    {t.clearFilters}
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
                    <JobCard
                      key={job.slug}
                      job={job}
                      index={i}
                      locale={locale}
                      basePath={basePath}
                    />
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
                    {t.emptyTitle}
                  </p>
                  <p className="font-mono text-sm text-[var(--text-muted)] mb-6">
                    {t.emptyBody}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                      setActiveCountry("all");
                    }}
                    className="font-mono text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors underline underline-offset-4"
                  >
                    {t.emptyReset}
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
                    {t.loadMore}
                    <span className="text-[var(--text-muted)]">
                      {t.loadMoreRemaining(filteredJobs.length - visibleCount)}
                    </span>
                  </button>
                </div>
              </FadeIn>
            )}

            {/* ----------------------------------------
                PAST ROLES (closed) — collapsed by default
            ---------------------------------------- */}
            {filteredClosedJobs.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="mt-20 pt-10 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-mono text-xs text-[var(--text-muted)] mb-1">
                        {t.pastRolesEyebrow}
                      </p>
                      <h2 className="text-lg md:text-xl font-semibold text-[var(--text-secondary)]">
                        {t.pastRolesHeading}
                      </h2>
                    </div>
                    <button
                      onClick={() => setClosedExpanded((v) => !v)}
                      className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--border-medium)] text-[var(--text-tertiary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)] transition-colors"
                    >
                      {closedExpanded
                        ? t.hidePastRoles
                        : t.showPastRoles(filteredClosedJobs.length)}
                    </button>
                  </div>

                  {closedExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 opacity-90">
                      {visibleClosedJobs.map((job, i) => (
                        <JobCard
                          key={job.slug}
                          job={job}
                          index={i}
                          locale={locale}
                          basePath={basePath}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Bottom CTA */}
            <FadeIn delay={0.25}>
              <div className="mt-16 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 p-8 md:p-10 text-center">
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-3">
                  {t.generalCtaEyebrow}
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  {t.generalCtaHeadline}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-lg mx-auto">
                  {t.generalCtaBody}
                </p>
                <a
                  href={buildJobsCtaUrl({
                    slug: "general-application",
                    placement: "general",
                    locale,
                  })}
                  className="btn-cta-glitch !px-8 !py-3 !text-sm"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {t.applyNow} <ArrowRight className="w-4 h-4" />
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
