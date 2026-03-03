"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/sections/Footer";
import FadeIn from "@/app/components/effects/FadeIn";
import TextScramble from "@/app/components/effects/TextScramble";
import Button from "@/app/components/ui/Button";
import SampleDataViewer from "@/app/components/ui/SampleDataViewer";
import type { CaseStudy } from "@/types/case-study";

/* ==========================================================================
   PROCESS FLOW COMPONENT
   ========================================================================== */

function ProcessFlow({
  steps,
}: {
  steps: Array<{ step: string; title: string; description: string }>;
}) {
  return (
    <div className="mt-10">
      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-start gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start flex-1 min-w-0">
            <motion.div
              className="flex flex-col items-center text-center flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Step number circle */}
              <div className="w-10 h-10 rounded-full border-2 border-[#92B090] flex items-center justify-center mb-3 flex-shrink-0">
                <span className="font-mono text-sm font-bold text-[#92B090]">
                  {s.step}
                </span>
              </div>

              {/* Title */}
              <span className="font-mono text-sm font-semibold text-[var(--text-primary)] mb-1">
                {s.title}
              </span>

              {/* Description */}
              <span className="text-xs text-[var(--text-tertiary)] leading-snug px-2 max-w-[180px]">
                {s.description}
              </span>
            </motion.div>

            {/* Connecting line + arrow */}
            {i < steps.length - 1 && (
              <motion.div
                className="flex items-center mt-[18px] flex-shrink-0 -mx-1"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15 + 0.1,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ originX: 0 }}
              >
                <div className="w-8 h-[2px] bg-[#92B090]/50" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#92B090]/50" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex md:hidden flex-col gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-start">
            <motion.div
              className="flex items-start gap-4 w-full"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.12,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Step number circle */}
              <div className="w-9 h-9 rounded-full border-2 border-[#92B090] flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xs font-bold text-[#92B090]">
                  {s.step}
                </span>
              </div>

              <div className="pt-1">
                <span className="font-mono text-sm font-semibold text-[var(--text-primary)] block">
                  {s.title}
                </span>
                <span className="text-xs text-[var(--text-tertiary)] leading-snug block mt-0.5">
                  {s.description}
                </span>
              </div>
            </motion.div>

            {/* Vertical connecting line */}
            {i < steps.length - 1 && (
              <div className="ml-[17px] w-[2px] h-5 bg-[#92B090]/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
   RELATED CASE STUDY CARD
   ========================================================================== */

function RelatedCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link href={`/case-studies/${cs.slug}`} className="group block h-full">
      <motion.div
        className="h-full flex flex-col p-6 md:p-8 rounded-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] relative overflow-hidden"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-[-1px] rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-primary), transparent, var(--accent-primary))",
              opacity: 0.4,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Headline stat */}
          <span className="font-mono text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-3">
            {cs.headlineStat}
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 leading-snug">
            {cs.title}
          </h3>

          {/* Teaser */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 flex-grow line-clamp-3">
            {cs.teaser}
          </p>

          {/* Link */}
          <span className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-mono text-sm group-hover:gap-3 transition-all duration-300">
            Read case study
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

/* ==========================================================================
   SECTION LABEL
   ========================================================================== */

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="inline-block text-sm font-mono text-[var(--accent-secondary)] mb-6 uppercase tracking-wider">
      {children}
    </span>
  );
}

/* ==========================================================================
   MAIN CLIENT COMPONENT
   ========================================================================== */

interface CaseStudyDetailClientProps {
  caseStudy: CaseStudy;
  categoryLabel: string;
  relatedCaseStudies: CaseStudy[];
}

export default function CaseStudyDetailClient({
  caseStudy: cs,
  categoryLabel,
  relatedCaseStudies,
}: CaseStudyDetailClientProps) {
  const summaryLines = buildCondensedSummary(cs);
  const snapshotStats = cs.results.slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header opaque />

      <main className="relative z-10 pt-20 md:pt-24">
        {/* --------------------------------------------------------------
           BREADCRUMBS
        --------------------------------------------------------------- */}
        <div className="container pt-6 pb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/case-studies"
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              Case Studies
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--text-tertiary)] truncate max-w-[200px]">
              {cs.title}
            </span>
          </nav>
        </div>

        {/* ==============================================================
           1. HERO
        =============================================================== */}
        <section className="section !pt-8 !pb-12 md:!pb-16">
          <div className="container max-w-4xl">
            <FadeIn direction="up">
              {/* Category badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--border-accent)] mb-6">
                {categoryLabel}
              </span>

              {/* Title with scramble */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-8 leading-[1.1]">
                <TextScramble
                  text={cs.title}
                  autoPlay
                  delay={1200}
                  duration={2500}
                  scrambleOnHover
                  className="!font-sans"
                />
              </h1>

              {/* Headline stat */}
              <div className="flex items-end gap-4">
                <span className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--accent-primary)] leading-none">
                  {cs.headlineStat}
                </span>
                <span className="text-sm md:text-base text-[var(--text-secondary)] pb-2 max-w-xs">
                  {cs.headlineStatLabel}
                </span>
              </div>
            </FadeIn>

          </div>
        </section>

        {/* ==============================================================
           2. QUICK SUMMARY (terminal callout)
        =============================================================== */}
        <section className="pb-12 md:pb-16">
          <div className="container max-w-4xl">
            <FadeIn delay={0.1}>
              <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 p-6 md:p-8 font-mono text-sm">
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--error)]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/60" />
                  </div>
                  <span className="text-[var(--text-muted)] text-xs ml-2">
                    summary.md
                  </span>
                </div>

                <div className="space-y-2">
                  {summaryLines.map((line, i) => (
                    <p key={i} className="text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-primary)] mr-2">
                        {line.prefix}
                      </span>
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==============================================================
           3. SNAPSHOT BAR
        =============================================================== */}
        <section className="pb-12 md:pb-16">
          <div className="container max-w-4xl">
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {snapshotStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center md:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <span className="block font-mono text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">
                      {stat.value}
                    </span>
                    <span className="block text-xs md:text-sm text-[var(--text-tertiary)] mt-1">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="section-divider" />

        {/* ==============================================================
           4. CHALLENGE
        =============================================================== */}
        <section className="section">
          <div className="container max-w-4xl">
            <FadeIn>
              <SectionLabel>{"// THE CHALLENGE"}</SectionLabel>
              <div className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                {cs.challenge.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="section-divider" />

        {/* ==============================================================
           5. OUR APPROACH
        =============================================================== */}
        <section className="section">
          <div className="container max-w-4xl">
            <FadeIn>
              <SectionLabel>{"// OUR APPROACH"}</SectionLabel>
              <div className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                {cs.approach.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeIn>

            {/* Process flow diagram */}
            {cs.processSteps && cs.processSteps.length > 0 && (
              <ProcessFlow steps={cs.processSteps} />
            )}
          </div>
        </section>

        <div className="section-divider" />

        {/* ==============================================================
           6. RESULTS
        =============================================================== */}
        <section className="section">
          <div className="container max-w-4xl">
            <FadeIn>
              <SectionLabel>{"// RESULTS"}</SectionLabel>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              {cs.results.map((result, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="block font-mono text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-2">
                    {result.value}
                  </span>
                  <span className="block text-sm text-[var(--text-tertiary)]">
                    {result.label}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        <div className="section-divider" />

        {/* ==============================================================
           7. IMPACT
        =============================================================== */}
        <section className="section">
          <div className="container max-w-4xl">
            <FadeIn>
              <SectionLabel>{"// IMPACT"}</SectionLabel>
              <div className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                {cs.impact.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==============================================================
           SAMPLE DATA
        =============================================================== */}
        {cs.sampleData && (
          <>
            <div className="section-divider" />
            <section className="section">
              <div className="container max-w-4xl">
                <FadeIn>
                  <SectionLabel>{"// SAMPLE DATA"}</SectionLabel>
                  <p className="text-sm text-[var(--text-tertiary)] mb-6">
                    Representative record from the annotation pipeline.
                  </p>
                </FadeIn>
                <SampleDataViewer type={cs.sampleData.type} data={cs.sampleData} />
              </div>
            </section>
          </>
        )}

        <div className="section-divider" />

        {/* ==============================================================
           8. SERVICE USED (pillar link callout)
        =============================================================== */}
        <section className="section">
          <div className="container max-w-4xl">
            <FadeIn>
              <Link href={cs.pillarLink.href} className="group block">
                <div className="flex items-center justify-between p-6 md:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 hover:border-[var(--accent-primary)] transition-colors duration-300">
                  <div>
                    <span className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Service Used
                    </span>
                    <span className="block text-lg md:text-xl font-semibold text-[var(--text-primary)]">
                      {cs.pillarLink.label}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>

        <div className="section-divider" />

        {/* ==============================================================
           9. RELATED CASE STUDIES
        =============================================================== */}
        {relatedCaseStudies.length > 0 && (
          <section className="section">
            <div className="container">
              <FadeIn>
                <SectionLabel>{"// RELATED"}</SectionLabel>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                {relatedCaseStudies.map((rcs, i) => (
                  <motion.div
                    key={rcs.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <RelatedCard cs={rcs} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ==============================================================
           10. FAQ
        =============================================================== */}
        {cs.faqs.length > 0 && (
          <section className="section">
            <div className="container max-w-4xl">
              <FadeIn>
                <SectionLabel>{"// FAQ"}</SectionLabel>
              </FadeIn>
              <div className="space-y-3 mt-2">
                {cs.faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <FAQItem question={faq.question} answer={faq.answer} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ==============================================================
           11. CTA
        =============================================================== */}
        <section className="section">
          <div className="container text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                Ready to build your next dataset?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                Tell us about your project and we will scope a plan within 48
                hours.
              </p>
              <Button calendly variant="cta-glitch" size="lg">
                Book a Call
              </Button>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

/**
 * Build 3 condensed summary lines (Challenge / Solution / Result) from the
 * case study fields. Extracts the first sentence of challenge for the problem,
 * first sentence of approach for solution, and headline stat for result.
 */
function buildCondensedSummary(cs: CaseStudy) {
  const challengeSentences =
    cs.challenge.match(/[^.!?]+[.!?]+/g) || [cs.challenge];
  const approachSentences =
    cs.approach.match(/[^.!?]+[.!?]+/g) || [cs.approach];
  const resultSentences = cs.impact.match(/[^.!?]+[.!?]+/g) || [cs.impact];

  return [
    { prefix: "Challenge:", text: challengeSentences[0]?.trim() || cs.challenge },
    { prefix: "Solution:", text: approachSentences[0]?.trim() || cs.approach },
    { prefix: "Result:", text: resultSentences[0]?.trim() || cs.impact },
  ];
}
