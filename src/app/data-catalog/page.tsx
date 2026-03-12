"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Button from "../components/ui/Button";
import FadeIn from "../components/effects/FadeIn";
import TextScramble from "../components/effects/TextScramble";
import VideoMosaic from "../components/ui/VideoMosaic";
import PublicDatasetBrowser from "../components/catalog/PublicDatasetBrowser";

const GlobeMap = dynamic(() => import("../components/ui/GlobeMap"), {
  ssr: false,
});

/* ============================================
   CAPABILITY TAGS
   ============================================ */

const capabilities = [
  "Egocentric Video",
  "Manipulation Trajectories",
  "Game Environments",
  "Synthetic Worlds",
  "Cinematic Footage",
  "Workplace Activities",
  "RLHF & Preference Data",
  "Safety & Red Teaming",
  "Multi-Modal Annotation",
  "Object Tracking",
  "Video Classification",
  "Prompt Evaluation",
];

/* ============================================
   DIVERSITY STATS
   ============================================ */

const diversityStats = [
  {
    label: "Geographic",
    detail: "14+ countries across 6 continents",
    mono: "GEO",
  },
  {
    label: "Demographic",
    detail: "Age, gender, and ethnicity representation",
    mono: "DEM",
  },
  {
    label: "Environmental",
    detail: "Indoor, outdoor, urban, rural, workplace, domestic",
    mono: "ENV",
  },
  {
    label: "Device",
    detail: "GoPro, smartphone, cinema cameras, game capture",
    mono: "DEV",
  },
];

/* ============================================
   CASE STUDY PREVIEWS
   ============================================ */

const caseStudies = [
  {
    slug: "egocentric-video-collection",
    title: "Egocentric Video at Scale",
    teaser: "Global collection for robotics and world modeling.",
  },
  {
    slug: "game-based-data-capture",
    title: "Game-Based Data Capture",
    teaser: "Proprietary platform for simulation training data.",
  },
  {
    slug: "generative-ai-safety",
    title: "AI Safety & Moderation",
    teaser: "Production-grade content safety validation.",
  },
];

/* ============================================
   MOSAIC VIDEOS
   ============================================ */

const mosaicVideos = [
  { src: "/videos/mosaic/mosaic-01.mp4", label: "cooking" },
  { src: "/videos/mosaic/mosaic-02.mp4", label: "walking" },
  { src: "/videos/mosaic/mosaic-03.mp4", label: "assembling" },
  { src: "/videos/mosaic/mosaic-04.mp4", label: "pouring" },
  { src: "/videos/mosaic/mosaic-05.mp4", label: "ironing" },
  { src: "/videos/mosaic/mosaic-06.mp4", label: "driving" },
  { src: "/videos/mosaic/mosaic-07.mp4", label: "barista" },
  { src: "/videos/mosaic/mosaic-08.mp4", label: "climbing" },
  { src: "/videos/mosaic/mosaic-09.mp4", label: "folding" },
  { src: "/videos/mosaic/mosaic-10.mp4", label: "skiing" },
  { src: "/videos/mosaic/mosaic-11.mp4", label: "typing" },
  { src: "/videos/mosaic/mosaic-12.mp4", label: "sewing" },
  { src: "/videos/mosaic/mosaic-13.mp4", label: "washing" },
  { src: "/videos/mosaic/mosaic-14.mp4", label: "surfing" },
  { src: "/videos/mosaic/mosaic-15.mp4", label: "picking up" },
  { src: "/videos/mosaic/mosaic-16.mp4", label: "welding" },
  { src: "/videos/mosaic/mosaic-17.mp4", label: "packing" },
  { src: "/videos/mosaic/mosaic-18.mp4", label: "sweeping" },
  { src: "/videos/mosaic/mosaic-19.mp4", label: "painting" },
  { src: "/videos/mosaic/mosaic-20.mp4", label: "cycling" },
  { src: "/videos/mosaic/mosaic-21.mp4", label: "lifting" },
  { src: "/videos/mosaic/mosaic-22.mp4", label: "knitting" },
  { src: "/videos/mosaic/mosaic-23.mp4", label: "browsing" },
  { src: "/videos/mosaic/mosaic-24.mp4", label: "entering" },
];

/* ============================================
   PAGE
   ============================================ */

export default function DataCatalogPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="noise-overlay-animated" />
      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            1. HERO
        ---------------------------------------- */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// DATA CATALOG"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Training data your competitors{" "}
                <span className="italic text-[var(--accent-secondary)]">
                  <TextScramble
                    text="can't find."
                    scrambleOnHover
                    autoPlay
                    delay={300}
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl mx-auto">
                Purpose-built datasets for frontier video, robotics, and vision
                labs — licensed and curated to your specs, or collected bespoke
                from scratch.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button calendly variant="cta-glitch" size="lg">
                  Book a Call
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ----------------------------------------
            2. TWO PATHS
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4 text-center">
                  {"// TWO PATHS"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                  Two ways to get the data you need.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Card 1: Off-the-Shelf */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8 hover:border-[var(--accent-primary)]/30 transition-all duration-300"
                  >
                    <span className="font-mono text-xs text-[var(--accent-primary)] block mb-3">
                      01
                    </span>
                    <h3 className="text-xl font-semibold mb-3">
                      Off-the-Shelf, Tailored
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Licensed datasets from our catalog, curated and formatted
                      to your model&apos;s exact specifications. Browse samples,
                      evaluate quality, and license what you need.
                    </p>
                  </motion.div>

                  {/* Card 2: Bespoke */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8 hover:border-[var(--accent-primary)]/30 transition-all duration-300"
                  >
                    <span className="font-mono text-xs text-[var(--accent-primary)] block mb-3">
                      02
                    </span>
                    <h3 className="text-xl font-semibold mb-3">
                      Bespoke Collection
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Can&apos;t find what you need? We design the capture,
                      build the pipeline, deploy our global network, and deliver
                      training-ready data from scratch.
                    </p>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            3. VIDEO MOSAIC GRID
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <div className="max-w-5xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4 text-center">
                  {"// SAMPLE COVERAGE"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                  What&apos;s in the catalog.
                </h2>

                <VideoMosaic videos={mosaicVideos} />

                <motion.p
                  className="text-center font-mono text-sm text-[var(--text-tertiary)] mt-8 leading-relaxed max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Spanning 14+ countries, 20+ activity domains, and thousands of
                  hours of curated footage.
                </motion.p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            3.5. BROWSE THE CATALOG
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-5xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4 text-center">
                  {"// BROWSE THE CATALOG"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                  Explore our datasets.
                </h2>
                <PublicDatasetBrowser />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            4. CAPABILITIES
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-4xl mx-auto text-center">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// CAPABILITIES"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-10">
                  From raw capture to golden dataset.
                </h2>

                <div className="flex flex-wrap justify-center gap-3">
                  {capabilities.map((cap, i) => (
                    <motion.span
                      key={cap}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="inline-block font-mono text-sm px-4 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-secondary)]/50 hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] transition-all duration-300 cursor-default"
                    >
                      {cap}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            5. GLOBAL REACH — expanded
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4 text-center">
                  {"// GLOBAL REACH"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                  Your model needs diversity. So does your data.
                </h2>
                <p className="text-[var(--text-secondary)] text-lg mb-10 text-center max-w-2xl mx-auto">
                  Your model needs to generalize. Your data should too.
                </p>

                <GlobeMap />

                {/* Diversity stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                  {diversityStats.map((stat, i) => (
                    <motion.div
                      key={stat.mono}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 md:p-5"
                    >
                      <span className="font-mono text-[10px] text-[var(--accent-primary)] block mb-2 tracking-wider">
                        {stat.mono}
                      </span>
                      <h4 className="text-sm font-semibold mb-1">
                        {stat.label}
                      </h4>
                      <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                        {stat.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            6. SOCIAL PROOF — case studies
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4 text-center">
                  {"// PROOF"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
                  See how we&apos;ve done it.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {caseStudies.map((cs, i) => (
                    <motion.div
                      key={cs.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Link
                        href={`/case-studies/${cs.slug}`}
                        className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 hover:translate-y-[-2px] h-full"
                      >
                        <h3 className="font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                          {cs.title}
                        </h3>
                        <p className="text-sm text-[var(--text-tertiary)] mb-4">
                          {cs.teaser}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-primary)]">
                          Read case study
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ----------------------------------------
            7. FINAL CTA
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// GET STARTED"}
                </span>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Tell us what you&apos;re training.
                </h2>

                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                  We&apos;ll scope the dataset, design the pipeline, and deliver
                  training-ready data on your timeline.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button calendly variant="cta-glitch" size="lg">
                    Book a Call
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
