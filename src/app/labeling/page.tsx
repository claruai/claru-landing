"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Pen,
  FlaskConical,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Button from "../components/ui/Button";
import FadeIn from "../components/effects/FadeIn";
import TextScramble from "../components/effects/TextScramble";
import ContactForm from "../components/form/ContactForm";

/* ============================================
   THREE THINGS WE DO
   ============================================ */

const services = [
  {
    icon: Pen,
    title: "We Annotate",
    description:
      "Frame-level video annotation, spatial labeling, multi-modal tagging. Purpose-built guidelines, not generic templates. Continuous QA, not spot checks.",
  },
  {
    icon: FlaskConical,
    title: "We Evaluate",
    description:
      "RLHF preference ranking, model benchmarking, prompt quality assessment. Human judgment where automated metrics fall short.",
  },
  {
    icon: ShieldAlert,
    title: "We Red Team",
    description:
      "Adversarial testing, safety auditing, content moderation validation. We stress-test your model before your users do.",
  },
];

/* ============================================
   CAPABILITY TAGS
   ============================================ */

const capabilityTags = [
  "RLHF",
  "Preference Ranking",
  "Video Annotation",
  "Spatial Labeling",
  "Red Teaming",
  "Safety Evaluation",
  "Prompt Assessment",
  "Benchmark Curation",
  "Bias Detection",
  "Multi-Modal QA",
];

/* ============================================
   CASE STUDY CARDS
   ============================================ */

const caseStudies = [
  {
    slug: "generative-ai-safety",
    title: "Generative AI Safety",
    stat: "205K",
    statLabel: "safety annotations",
    teaser:
      "Multi-modal safety annotation validating content moderation pipelines across text and video.",
  },
  {
    slug: "red-teaming-moderation",
    title: "Red Teaming Moderation",
    stat: "<2%",
    statLabel: "rejection rate",
    teaser:
      "Designed, calibrated, and stress-tested a production content moderation system.",
  },
  {
    slug: "video-model-evaluation",
    title: "Video Model Evaluation",
    stat: "39K",
    statLabel: "pairwise evaluations",
    teaser:
      "ELO-based human evaluation across 51 model configurations for text-to-video, image-to-video, and video-to-video.",
  },
  {
    slug: "fashion-ai-annotation",
    title: "Fashion AI Annotation",
    stat: "3M+",
    statLabel: "images annotated",
    teaser:
      "1,000+ trained annotators labeling fashion and lifestyle images with structured taxonomy.",
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function LabelingPage() {
  return (
    <>
      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            SECTION 1: HERO
        ---------------------------------------- */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24">
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
              <span className="text-[var(--accent-primary)]">
                Expert Labeling
              </span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// EXPERT LABELING"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Annotators who actually{" "}
                <span className="text-[var(--accent-secondary)] italic">understand your model.</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
                Domain-specialist teams embedded in your workflow — RLHF, video
                annotation, red teaming, safety evaluation. Real-time feedback,
                not batch cycles.
              </p>

              <Button href="#contact" variant="cta-glitch" size="lg">
                Learn More <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ----------------------------------------
            SECTION 2: THREE THINGS WE DO
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// SERVICES"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What We Do
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Three core capabilities, each staffed by specialists who
                understand the downstream impact on your model.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 md:p-8 hover:border-[var(--accent-primary)]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            SECTION 3: HOW WE WORK
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// THE MODEL"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  In your Slack. On your timeline.
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  We don&apos;t file tickets and wait. Our teams embed directly
                  with your researchers — iterating on guidelines in real-time,
                  catching edge cases before they reach production, adapting as
                  your model evolves.
                </p>

                {/* Accent detail */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <MessageSquare className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                  <p className="font-mono text-sm text-[var(--accent-primary)]">
                    Hours between feedback cycles — not weeks.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            SECTION 4: THE WORKFORCE
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// WORKFORCE"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Global network of domain specialists
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-2xl">
                Specialists across linguistics, computer vision, robotics, and
                safety — not general-purpose crowdworkers.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-3">
                {capabilityTags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className="font-mono text-xs md:text-sm px-4 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-secondary)]/60 hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-all duration-200 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            SECTION 5: PROOF — CASE STUDY CARDS
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// PROOF"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See how we&apos;ve done it.
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Real projects, real numbers — from safety annotation to
                adversarial evaluation.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {caseStudies.map((cs, index) => (
                <motion.div
                  key={cs.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group block h-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 md:p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10">
                      {/* Stat */}
                      <div className="font-mono text-3xl font-bold text-[var(--accent-primary)] mb-1 leading-none">
                        {cs.stat}
                      </div>
                      <p className="font-mono text-xs text-[var(--text-muted)] mb-4">
                        {cs.statLabel}
                      </p>

                      {/* Title */}
                      <h3 className="text-base font-semibold mb-2 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                        {cs.title}
                      </h3>

                      {/* Teaser */}
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                        {cs.teaser}
                      </p>

                      {/* Arrow */}
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-primary)]">
                        Read case study
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            SECTION 6: CTA + CONTACT FORM
        ---------------------------------------- */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// GET STARTED"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Tell us what you need labeled.
                </h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                  We&apos;ll scope the team, design the guidelines, and start
                  delivering.
                </p>
              </div>
            </FadeIn>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
