"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Hand,
  Film,
  Box,
  FileText,
  Video,
  ScanEye,
  Bot,
  ChevronRight,
  ArrowRight,
  ClipboardList,
  Settings2,
  Database,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Button from "../components/ui/Button";
import FAQItem from "../components/ui/FAQItem";
import FadeIn from "../components/effects/FadeIn";
import TextScramble from "../components/effects/TextScramble";
import ContactForm from "../components/form/ContactForm";

/* ============================================
   DATA CATALOG
   ============================================ */

const dataCatalog = [
  {
    icon: Eye,
    title: "Egocentric Video",
    description:
      "First-person perspectives for robotics and embodied AI. Everyday tasks, manipulation sequences, navigation through real environments.",
    specs: ["30-60 fps, 1080p+", "Diverse indoor/outdoor scenarios", "Synchronized IMU + depth"],
  },
  {
    icon: Hand,
    title: "Manipulation Trajectories",
    description:
      "Robot interaction data — grasping, assembly, tool use. Multi-DOF capture with synchronized annotations and force-torque readings.",
    specs: ["6-DOF+ action recording", "Multi-camera calibration", "Natural language task labels"],
  },
  {
    icon: Film,
    title: "Cinematic & Licensed Clips",
    description:
      "Cleanly licensed video with provenance tracking. Storytelling, continuous action, scene diversity for generative video models.",
    specs: ["Full rights clearance", "75+ word dense captions", "Scene-level metadata"],
  },
  {
    icon: Box,
    title: "Synthetic Environments",
    description:
      "Procedurally generated scenes via Unreal Engine and Omniverse. Physics-accurate, domain-configurable, infinite variation.",
    specs: ["Pixel-perfect ground truth", "Configurable physics params", "Automatic annotation"],
  },
  {
    icon: FileText,
    title: "Web-Scale Paired Data",
    description:
      "Text-video, text-image pairs with dense captions. Licensed and filtered for quality — not noisy web scrapes.",
    specs: ["Cross-modal alignment", "Quality-scored filtering", "WebDataset / HF-compatible"],
  },
];

/* ============================================
   MODALITIES
   ============================================ */

const modalities = [
  {
    icon: Video,
    title: "Video AI",
    description:
      "Millions of temporally consistent clips with dense captions, camera metadata, and scene-level annotations. Data for Sora-class generation and video understanding.",
  },
  {
    icon: ScanEye,
    title: "Vision AI",
    description:
      "High-resolution image-text pairs, spatial annotations, and multi-modal alignments. Data for perception, segmentation, and visual reasoning systems.",
  },
  {
    icon: Bot,
    title: "Robotics & Embodied AI",
    description:
      "Manipulation trajectories, egocentric video, and sim-to-real transfer data. Collected by trained operators in diverse real-world environments.",
  },
];

/* ============================================
   PROCESS STEPS
   ============================================ */

const processSteps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Scoping",
    description: "Tell us what your model needs. We map the data requirements, target distribution, and quality gates.",
  },
  {
    icon: Settings2,
    step: "02",
    title: "Pipeline Design",
    description: "We design collection methodology, output formats, annotation schemas, and validation criteria.",
  },
  {
    icon: Database,
    step: "03",
    title: "Collection",
    description: "Our team sources, records, or generates the data — from real-world capture to synthetic rendering.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Quality Assurance",
    description: "Multi-stage filtering, deduplication, distribution checks, and expert human QA on every batch.",
  },
  {
    icon: Truck,
    step: "05",
    title: "Delivery",
    description: "Pre-packaged via S3-compatible transfer in your preferred format, delivered within SLA.",
  },
];

/* ============================================
   DEEP DIVE LINKS
   ============================================ */

const deepDiveLinks = [
  { href: "/pillars/acquire/egocentric-video", label: "Egocentric Video", sub: "First-person capture at scale" },
  { href: "/pillars/acquire/synthetic-data", label: "Synthetic Data", sub: "Physics-accurate generation" },
  { href: "/pillars/acquire/data-licensing", label: "Data Licensing", sub: "Rights clearance & provenance" },
  { href: "/pillars/prepare/deduplication", label: "Deduplication", sub: "Near-duplicate removal" },
  { href: "/pillars/prepare/quality-scoring", label: "Quality Scoring", sub: "Automated quality signals" },
  { href: "/pillars/prepare/multimodal-alignment", label: "Multimodal Alignment", sub: "Cross-modal pairing" },
];

/* ============================================
   FAQ DATA
   ============================================ */

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "What types of video data can you source?",
    answer: (
      <p>
        We source egocentric video (first-person wearable cameras), cinematic and stock-licensed clips with full provenance,
        synthetic video rendered in Unreal Engine and Omniverse, and web-scale video with dense captions. Each category can be
        customized for resolution, frame rate, scene diversity, and annotation density based on your model&apos;s requirements.
      </p>
    ),
  },
  {
    question: "How do you handle licensing and compliance?",
    answer: (
      <p>
        Every dataset includes full provenance documentation — original source, collection method, processing steps, and license terms.
        We handle rights negotiation directly with content owners, maintain GDPR and CCPA compliance in collection protocols,
        and deliver audit-ready documentation for your legal team.
      </p>
    ),
  },
  {
    question: "What's the typical delivery timeline?",
    answer: (
      <p>
        Pre-packaged sample datasets ship in 1-2 business days. Custom collection projects vary by scope:
        web-scale harvesting typically takes 2-4 weeks, while large-scale human collection (egocentric video, manipulation
        trajectories) runs 1-3 months depending on volume and diversity requirements. We scope every project with realistic
        timelines before starting.
      </p>
    ),
  },
  {
    question: "Can I request a sample before committing?",
    answer: (
      <p>
        Yes. We provide free sample datasets so you can evaluate quality, format, and annotation density before committing to a
        full engagement. Tell us what you&apos;re building and we&apos;ll send relevant samples within 48 hours.
      </p>
    ),
  },
  {
    question: "What formats do you deliver in?",
    answer: (
      <p>
        We deliver via S3-compatible transfer in common ML formats including WebDataset, HuggingFace Datasets, TFRecord, and
        custom schemas. Metadata is provided in JSON/Parquet. We can also integrate directly with your training pipeline
        if you have specific format requirements.
      </p>
    ),
  },
  {
    question: "How do you ensure data quality at scale?",
    answer: (
      <p>
        Multi-stage validation: automated schema checks and distribution monitoring on ingestion, statistical outlier detection
        during processing, and expert human review on sampled batches before delivery. We track quality metrics per-batch and
        provide transparency reports with every shipment.
      </p>
    ),
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function TrainingDataPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />

      <main className="relative z-10">
        {/* ----------------------------------------
            HERO SECTION
        ---------------------------------------- */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] font-mono mb-10">
              <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--accent-primary)]">Training Data</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// DATA SOURCING"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <TextScramble text="Training Data for Frontier AI" scrambleOnHover autoPlay delay={300} />
              </h1>

              <p className="text-xl md:text-2xl text-[var(--accent-secondary)] italic mb-6 max-w-3xl">
                The raw material your model needs — sourced, structured, and licensed.
              </p>

              <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
                Egocentric video. Manipulation trajectories. Licensed cinematic datasets. Synthetic environments.
                We collect and curate the data that doesn&apos;t exist on the internet.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href="#contact" variant="cta-glitch" size="lg">
                  Request a Sample Dataset <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="#contact" variant="secondary" size="lg">
                  Book a Call
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ----------------------------------------
            DATA CATALOG SECTION
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// CATALOG"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Source</h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Concrete data types with production-grade specs. Not vague promises — tangible datasets you can evaluate.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataCatalog.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 hover:border-[var(--accent-primary)]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="space-y-1.5">
                      {item.specs.map((spec) => (
                        <p key={spec} className="font-mono text-xs text-[var(--accent-primary)]">
                          + {spec}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            MODALITIES SECTION
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// MODALITIES"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Data for Three Frontiers</h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Each frontier AI domain has unique data requirements. We source for all three.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {modalities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-8 hover:border-[var(--accent-primary)]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            PROCESS SECTION
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// PROCESS"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                From scoping to delivery, a structured pipeline with quality gates at every stage.
              </p>
            </FadeIn>

            <div className="max-w-3xl mx-auto space-y-0">
              {processSteps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex gap-6 relative"
                  >
                    {/* Vertical connector line */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute left-5 top-14 bottom-0 w-px bg-[var(--border-subtle)]" />
                    )}

                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                      </div>
                    </div>

                    <div className="pb-10">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-sm text-[var(--accent-primary)]">{item.step}</span>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
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
            DEEP DIVE LINKS
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// DEEP DIVE"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Go Deeper</h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Explore detailed breakdowns of our acquisition and preparation capabilities.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deepDiveLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="block p-5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all group bg-[var(--bg-primary)]"
                  >
                    <h3 className="font-semibold mb-1 group-hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)]">{link.sub}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            FAQ SECTION
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// FAQ"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Common Questions</h2>
              </div>
            </FadeIn>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------
            CTA / CONTACT SECTION
        ---------------------------------------- */}
        <section id="contact" className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// GET STARTED"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Request a Sample Dataset</h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                  Tell us what you&apos;re building and we&apos;ll send you relevant sample data — free of charge.
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
