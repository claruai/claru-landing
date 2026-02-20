"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/sections/Footer";
import TextScramble from "@/app/components/effects/TextScramble";
import FadeIn from "@/app/components/effects/FadeIn";
import type { CaseStudy, CaseStudyCategory } from "@/types/case-study";
import { CASE_STUDY_CATEGORIES } from "@/types/case-study";

/* ============================================
   FILTER PILL DEFINITIONS
   ============================================ */

const ALL_FILTERS: { key: "all" | CaseStudyCategory; label: string }[] = [
  { key: "all", label: "All" },
  ...Object.entries(CASE_STUDY_CATEGORIES).map(([key, label]) => ({
    key: key as CaseStudyCategory,
    label,
  })),
];

/* ============================================
   CASE STUDY CARD
   ============================================ */

function CaseStudyCard({
  caseStudy,
  index,
}: {
  caseStudy: CaseStudy;
  index: number;
}) {
  const categoryLabel =
    CASE_STUDY_CATEGORIES[caseStudy.category] ?? caseStudy.category;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="group block h-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 md:p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 relative overflow-hidden"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

        <div className="relative z-10">
          {/* Category badge */}
          <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10 px-2.5 py-1 rounded-full mb-4">
            {categoryLabel}
          </span>

          {/* Headline stat */}
          <div className="font-mono text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-1 leading-none">
            {caseStudy.headlineStat}
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] mb-4">
            {caseStudy.headlineStatLabel}
          </p>

          {/* Title with scramble on hover */}
          <h3 className="text-lg font-semibold mb-2 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
            <TextScramble
              text={caseStudy.title}
              scrambleOnHover
              duration={600}
            />
          </h3>

          {/* Teaser -- clamp to 2 lines */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-2">
            {caseStudy.teaser}
          </p>

          {/* Arrow link */}
          <span className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-primary)]">
            Read case study
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Hover lift effect via motion */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </Link>
    </motion.div>
  );
}

/* ============================================
   CASE STUDIES INDEX (CLIENT COMPONENT)
   ============================================ */

export default function CaseStudiesIndex({
  caseStudies,
}: {
  caseStudies: CaseStudy[];
}) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | CaseStudyCategory
  >("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return caseStudies;
    return caseStudies.filter((cs) => cs.category === activeFilter);
  }, [caseStudies, activeFilter]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Noise overlay for texture */}
      <div className="noise-overlay-animated" />

      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            HERO / HEADER SECTION
        ---------------------------------------- */}
        <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(var(--text-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          <div className="container relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] font-mono mb-10">
              <Link
                href="/"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--accent-primary)]">Case Studies</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// CASE STUDIES"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                What we&apos;ve shipped.
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                From egocentric video to model evaluation — real projects, real
                numbers.
              </p>
            </motion.div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
        </section>

        {/* ----------------------------------------
            FILTER + GRID
        ---------------------------------------- */}
        <section className="py-8 md:py-12">
          <div className="container">
            {/* Filter pills */}
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-8">
                {ALL_FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.key;
                  return (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`
                        font-mono text-xs md:text-sm px-4 py-2 rounded-full border transition-all duration-200
                        ${
                          isActive
                            ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)]"
                            : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </FadeIn>

            {/* Count indicator */}
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-[var(--text-muted)] mb-6"
            >
              Showing {filtered.length} case{" "}
              {filtered.length === 1 ? "study" : "studies"}
            </motion.p>

            {/* Card grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((cs, index) => (
                  <CaseStudyCard
                    key={cs.slug}
                    caseStudy={cs}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="font-mono text-[var(--text-muted)] text-sm">
                  No case studies in this category yet.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
