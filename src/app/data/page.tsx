"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Globe,
  Workflow,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Button from "../components/ui/Button";
import FadeIn from "../components/effects/FadeIn";
import TextScramble from "../components/effects/TextScramble";
import ContactForm from "../components/form/ContactForm";

/* ============================================
   THREE CAPABILITIES
   ============================================ */

const capabilities = [
  {
    icon: Database,
    title: "We Have Data",
    description:
      "Licensed datasets across egocentric, cinematic, game capture, and more. Curated to your specs, ready to license.",
  },
  {
    icon: Globe,
    title: "We Collect Data",
    description:
      "Global contributor network across 14+ countries. Egocentric video, workplace capture, bespoke collection designed around your research needs.",
  },
  {
    icon: Workflow,
    title: "We Build Pipelines",
    description:
      "Raw capture to golden dataset. Deduplication, alignment, quality scoring, format conversion \u2014 delivered training-ready, not as raw dumps.",
  },
];

/* ============================================
   CAPABILITY TAGS
   ============================================ */

const capabilityTags = [
  "Egocentric Video",
  "Manipulation Trajectories",
  "Game Environments",
  "Synthetic Worlds",
  "Cinematic Footage",
  "Workplace Activities",
  "Licensed Datasets",
  "Custom Collection",
  "Data Processing",
  "Quality Scoring",
  "Format Conversion",
  "Pipeline Design",
];

/* ============================================
   CASE STUDY CARDS
   ============================================ */

const caseStudies = [
  {
    title: "Egocentric Video Collection",
    stat: "1,000+ hrs",
    description:
      "First-person capture across diverse environments for embodied AI training.",
    slug: "egocentric-video-collection",
  },
  {
    title: "Game-Based Data Capture",
    stat: "10K+ hrs",
    description:
      "High-fidelity game environment recordings for world model research.",
    slug: "game-based-data-capture",
  },
  {
    title: "Video Quality Annotation at Scale",
    stat: "976K+",
    description:
      "Human quality assessments across motion, fidelity, interest, and alignment for RLHF.",
    slug: "video-quality-at-scale",
  },
  {
    title: "Workplace Egocentric Data",
    stat: "Multi-site",
    description:
      "Distributed collection across real workplace settings for activity understanding.",
    slug: "workplace-egocentric-data",
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function TrainingDataPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="noise-overlay-animated" />

      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            HERO SECTION
        ---------------------------------------- */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
          {/* Subtle grid pattern */}
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
              <span className="text-[var(--accent-primary)]">
                Training Data
              </span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// TRAINING DATA & PIPELINES"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your data doesn&apos;t exist yet.{" "}
                <span className="text-[var(--accent-secondary)] italic">We go get it.</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
                Egocentric video, manipulation trajectories, game environments,
                synthetic worlds &mdash; purpose-built for your model, not
                scraped from the internet.
              </p>

              <Button href="#contact" variant="cta-glitch" size="lg">
                Learn More <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
        </section>

        {/* ----------------------------------------
            THREE THINGS WE DO
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// WHAT WE DO"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Three ways we solve your data problem.
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-8 hover:border-[var(--accent-primary)]/30 transition-colors relative overflow-hidden group"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-accent)] flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            CAPABILITY TAGS
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// WHAT THIS LOOKS LIKE"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-10">
                Breadth of coverage.
              </h2>
            </FadeIn>

            <div className="flex flex-wrap gap-3">
              {capabilityTags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="font-mono text-sm px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-colors cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            DATA CATALOG CALLOUT
        ---------------------------------------- */}
        <section className="py-12 md:py-16">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <Link
                  href="/data-catalog"
                  className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8 hover:border-[var(--accent-primary)]/40 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-[var(--accent-primary)] block mb-2">
                        {"// DATA CATALOG"}
                      </span>
                      <h3 className="text-lg font-semibold mb-1">
                        Want to see what&apos;s available?
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        Browse our catalog of datasets, request access to samples, or tell us what you need built.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                  </div>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            PROOF / CASE STUDY CARDS
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// PROOF"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See how we&apos;ve done it.
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Real projects, real scale.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group block h-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 md:p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent group-hover:from-[var(--accent-primary)]/[0.03] transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="font-mono text-2xl md:text-3xl font-bold text-[var(--accent-primary)] mb-3 leading-none">
                        {study.stat}
                      </div>

                      <h3 className="text-base font-semibold mb-2 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                        <TextScramble
                          text={study.title}
                          scrambleOnHover
                          duration={600}
                        />
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                        {study.description}
                      </p>

                      <span className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-primary)]">
                        Read more
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            CTA / CONTACT SECTION
        ---------------------------------------- */}
        <section
          id="contact"
          className="py-16 md:py-24 bg-[var(--bg-secondary)]/30"
        >
          <div className="container">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// GET STARTED"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Tell us what you&apos;re training.
                </h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                  We&apos;ll scope the dataset, design the pipeline, and
                  deliver.
                </p>
              </div>
            </FadeIn>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
