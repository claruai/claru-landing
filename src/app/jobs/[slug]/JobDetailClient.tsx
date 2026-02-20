"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  ChevronDown,
  Briefcase,
  Tag,
} from "lucide-react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/sections/Footer";
import FadeIn from "@/app/components/effects/FadeIn";
import type { Job } from "@/types/job";
import { JOB_CATEGORIES } from "@/types/job";

/* ==========================================================================
   FAQ ACCORDION ITEM
   ========================================================================== */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-[var(--bg-tertiary)]/30 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-sm md:text-base text-[var(--text-primary)] pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[var(--accent-primary)]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 md:px-5 md:pb-5 border-t border-[var(--border-subtle)]">
              <p className="pt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   RELATED JOB CARD
   ========================================================================== */

function RelatedJobCard({ job, index }: { job: Job; index: number }) {
  const categoryLabel =
    JOB_CATEGORIES[job.category as keyof typeof JOB_CATEGORIES] || job.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link
        href={`/jobs/${job.slug}`}
        className="group block h-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-5 hover:border-[var(--accent-primary)]/40 transition-all duration-300 relative overflow-hidden"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

        <div className="relative z-10">
          {/* Category badge */}
          <span className="inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 mb-3">
            {categoryLabel}
          </span>

          {/* Title */}
          <h4 className="text-base font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
            {job.title}
          </h4>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <span className="font-mono text-sm font-semibold text-[var(--accent-primary)]">
              ${job.compensationMin}&ndash;{job.compensationMax}/hr
            </span>
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

/* ==========================================================================
   JOB DETAIL CLIENT COMPONENT
   ========================================================================== */

interface JobDetailClientProps {
  job: Job;
  answerSummary: string;
  postedDate: string;
  categoryLabel: string;
  relatedJobs: Job[];
}

export default function JobDetailClient({
  job,
  answerSummary,
  postedDate,
  categoryLabel,
  relatedJobs,
}: JobDetailClientProps) {
  // Split description into paragraphs
  const paragraphs = job.description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      <main className="relative z-10">
        {/* ============================================
            HERO / HEADER AREA
           ============================================ */}
        <section className="pt-28 md:pt-36 pb-8 md:pb-12">
          <div className="container">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] font-mono mb-8"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href="/jobs"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Jobs
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--accent-primary)] truncate max-w-[200px] md:max-w-none">
                {job.title}
              </span>
            </nav>

            {/* Answer block -- AEO-ready summary */}
            <FadeIn>
              <div className="rounded-lg border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/[0.04] p-4 md:p-5 mb-8">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] mb-2">
                  {"// ROLE SUMMARY"}
                </p>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  {answerSummary}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================
            MAIN CONTENT
           ============================================ */}
        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
              {/* ---------- LEFT COLUMN (main content) ---------- */}
              <div className="min-w-0">
                {/* Job title */}
                <FadeIn delay={0.05}>
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {job.title}
                  </motion.h1>
                </FadeIn>

                {/* Meta row */}
                <FadeIn delay={0.1}>
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    {/* Category badge */}
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                      <Tag className="w-3 h-3" />
                      {categoryLabel}
                    </span>

                    {/* Compensation */}
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      <DollarSign className="w-3 h-3 text-[var(--accent-primary)]" />
                      ${job.compensationMin}&ndash;{job.compensationMax}/hr
                    </span>

                    {/* Remote badge */}
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                      Remote
                      {job.locationRequirements && (
                        <span className="text-[var(--text-muted)]">
                          ({job.locationRequirements})
                        </span>
                      )}
                    </span>

                    {/* Date posted */}
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      <Clock className="w-3 h-3" />
                      Posted {postedDate}
                    </span>
                  </div>
                </FadeIn>

                {/* Description */}
                <FadeIn delay={0.15}>
                  <div className="mb-10">
                    <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
                      {"// DESCRIPTION"}
                    </h2>
                    <div className="space-y-4">
                      {paragraphs.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <FadeIn delay={0.2}>
                    <div className="mb-10">
                      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
                        {"// SKILLS & REQUIREMENTS"}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--text-primary)] transition-colors duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}

                {/* Apply CTA */}
                <FadeIn delay={0.25}>
                  <div className="mb-12">
                    <a
                      href="https://app.claru.ai/signup"
                      className="btn-cta-glitch !px-8 !py-3.5 !text-sm"
                    >
                      <span className="relative z-10 inline-flex items-center gap-2">
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </a>
                  </div>
                </FadeIn>

                {/* FAQ Section */}
                {job.faqs.length > 0 && (
                  <FadeIn delay={0.3}>
                    <div className="mb-12">
                      <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
                        {"// FREQUENTLY ASKED QUESTIONS"}
                      </h2>
                      <div className="space-y-3">
                        {job.faqs.map((faq, i) => (
                          <FAQItem
                            key={i}
                            question={faq.question}
                            answer={faq.answer}
                          />
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}
              </div>

              {/* ---------- RIGHT COLUMN (sidebar, desktop only) ---------- */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <FadeIn delay={0.2} direction="right">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-6">
                      {/* Quick info */}
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-5">
                        {"// QUICK INFO"}
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                              Type
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">
                              Contractor
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <DollarSign className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                              Compensation
                            </p>
                            <p className="text-sm text-[var(--text-primary)] font-semibold">
                              ${job.compensationMin}&ndash;{job.compensationMax}
                              /hr
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                              Location
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">
                              Remote
                              {job.locationRequirements &&
                                ` (${job.locationRequirements})`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Tag className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                              Category
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">
                              {categoryLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                              Posted
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">
                              {postedDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar CTA */}
                      <a
                        href="https://app.claru.ai/signup"
                        className="btn-cta-glitch w-full !py-3 !text-sm"
                      >
                        <span className="relative z-10 inline-flex items-center justify-center gap-2 w-full">
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </span>
                      </a>
                    </div>
                  </FadeIn>

                  {/* Back to all jobs */}
                  <FadeIn delay={0.3} direction="right">
                    <Link
                      href="/jobs"
                      className="mt-4 flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      Back to all positions
                    </Link>
                  </FadeIn>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ============================================
            RELATED POSITIONS
           ============================================ */}
        {relatedJobs.length > 0 && (
          <section className="pb-16 md:pb-24 border-t border-[var(--border-subtle)]">
            <div className="container pt-12 md:pt-16">
              <FadeIn>
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-3">
                  {"// RELATED POSITIONS"}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  More {categoryLabel} roles
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedJobs.map((relJob, i) => (
                  <RelatedJobCard key={relJob.slug} job={relJob} index={i} />
                ))}
              </div>

              {/* Link back to all jobs */}
              <FadeIn delay={0.2}>
                <div className="mt-8 text-center">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors group"
                  >
                    View all open positions
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* ============================================
            BOTTOM CTA
           ============================================ */}
        <section className="pb-16 md:pb-24">
          <div className="container">
            <FadeIn>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 p-8 md:p-10 text-center">
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-3">
                  {"// READY TO GET STARTED?"}
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  Apply in minutes
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-lg mx-auto">
                  Create your profile, select your areas of expertise, and start
                  working on frontier AI projects.
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
