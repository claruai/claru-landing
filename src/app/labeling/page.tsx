"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Film,
  Boxes,
  GraduationCap,
  ShieldAlert,
  FlaskConical,
  Video,
  Eye,
  Bot,
  CheckCircle2,
  Users,
  BarChart3,
  GitBranch,
  ShieldCheck,
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
   DATA
   ============================================ */

const annotationTypes = [
  {
    icon: MessageSquare,
    title: "RLHF & Preference Ranking",
    description:
      "Human feedback for model alignment. Preference pairs, reward modeling, constitutional AI evaluation.",
    bullets: [
      "Pairwise and listwise preference ranking",
      "Reward model calibration data",
      "Constitutional AI evaluation criteria",
    ],
  },
  {
    icon: Film,
    title: "Frame-Level Video Annotation",
    description:
      "Temporal consistency, motion continuity, scene transition labeling. Annotators who think in sequences, not frames.",
    bullets: [
      "Temporal coherence across frame sequences",
      "Motion trajectory and continuity labeling",
      "Scene boundary and transition classification",
    ],
  },
  {
    icon: Boxes,
    title: "Dense Segmentation & Spatial",
    description:
      "Pixel-level segmentation, object detection, spatial relationship and affordance labeling.",
    bullets: [
      "Instance and panoptic segmentation",
      "3D bounding boxes and depth estimation",
      "Spatial affordance and relationship graphs",
    ],
  },
  {
    icon: GraduationCap,
    title: "Expert Domain Annotation",
    description:
      "STEM, medical, legal, creative -- specialist annotators for domain-specific evaluation tasks.",
    bullets: [
      "PhD-level subject matter expertise",
      "Domain-specific rubric development",
      "Technical accuracy verification",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Red Teaming & Adversarial",
    description:
      "Safety testing, jailbreak attempts, bias probing. Systematic adversarial evaluation.",
    bullets: [
      "Structured jailbreak and prompt injection testing",
      "Bias and fairness probing across demographics",
      "Harmful content boundary exploration",
    ],
  },
  {
    icon: FlaskConical,
    title: "Benchmark Curation",
    description:
      "Golden datasets, evaluation suites, and ground truth sets for model evaluation.",
    bullets: [
      "Golden set construction and validation",
      "Evaluation suite design and curation",
      "Inter-annotator agreement benchmarking",
    ],
  },
];

const modalities = [
  {
    icon: Video,
    title: "Video AI",
    description:
      "Frame-level and temporal annotation for video generation, understanding, and editing models. Our annotators evaluate motion quality, temporal consistency, and scene coherence across hundreds of thousands of clips.",
  },
  {
    icon: Eye,
    title: "Vision AI",
    description:
      "Dense segmentation, object detection, and spatial reasoning annotation for vision-language and multimodal models. Pixel-accurate labeling with domain expertise in medical imaging, satellite, and autonomous driving.",
  },
  {
    icon: Bot,
    title: "Robotics & Embodied AI",
    description:
      "Manipulation task annotation, affordance labeling, and egocentric video annotation for embodied agents. Our annotators understand physical interactions, grasp planning, and real-world spatial reasoning.",
  },
];

const qualityItems = [
  {
    icon: Users,
    title: "Multi-reviewer consensus",
    description:
      "Every critical annotation passes through multiple reviewers with structured dispute resolution protocols.",
  },
  {
    icon: BarChart3,
    title: "Inter-annotator agreement monitoring",
    description:
      "Continuous IAA tracking with automated alerts when agreement drops below task-specific thresholds.",
  },
  {
    icon: GitBranch,
    title: "Real-time QA dashboards",
    description:
      "Live feedback loops between your team and our annotators. Issues surface in hours, not batch cycles.",
  },
  {
    icon: ShieldCheck,
    title: "Domain-specific quality gates",
    description:
      "Custom validation rules per task type -- from temporal consistency checks for video to factual accuracy for STEM.",
  },
];

const deepDiveLinks = [
  { href: "/pillars/enrich/rlhf", label: "RLHF" },
  { href: "/pillars/enrich/video-annotation", label: "Video Annotation" },
  { href: "/pillars/enrich/expert-annotation", label: "Expert Annotation" },
  { href: "/pillars/validate/red-teaming", label: "Red Teaming" },
  {
    href: "/pillars/validate/benchmark-curation",
    label: "Benchmark Curation",
  },
  { href: "/pillars/validate/bias-detection", label: "Bias Detection" },
];

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "How does the embedded model work?",
    answer:
      "We assign a dedicated team of annotators who learn your codebase, guidelines, and edge cases. They join your Slack channels, attend your standups, and iterate on labeling guidelines in real-time with your engineers. Think of it as extending your team, not outsourcing to a vendor.",
  },
  {
    question: "What annotation formats do you support?",
    answer:
      "COCO, YOLO, Pascal VOC, custom JSON schemas, and any bespoke format your pipeline requires. We adapt to your data infrastructure -- not the other way around.",
  },
  {
    question: "How do you handle quality at scale?",
    answer:
      "Multi-stage QA with consensus voting, real-time dashboards, and dedicated QA leads per project. We track inter-annotator agreement continuously and surface disagreements as actionable insights rather than noise.",
  },
  {
    question: "Can you handle specialized domain tasks?",
    answer:
      "Yes. We recruit and train annotators for specific domains including VFX and motion graphics, medical imaging, legal document review, STEM research, and creative writing evaluation. Domain expertise is the core of our offering.",
  },
  {
    question: "What's the typical ramp-up time?",
    answer:
      "One to two weeks from kickoff to production-quality annotations, depending on task complexity. Simple classification tasks can reach production quality in days. Complex multi-step annotation pipelines with domain expertise requirements take closer to two weeks.",
  },
  {
    question: "How do you handle data security and confidentiality?",
    answer:
      "All annotators sign NDAs and work within your security requirements. We support on-premise annotation environments, VPN-restricted access, and SOC 2-compliant workflows. Your data never leaves your approved infrastructure.",
  },
];

/* ============================================
   VENDOR COMPARISON STEPS
   ============================================ */

const vendorSteps = [
  "Upload data to portal",
  "Wait for batch processing",
  "Receive labels",
  "Discover quality issues",
  "Submit corrections",
  "Wait again",
  "Repeat",
];

const claruSteps = [
  "Your team + our annotators, together",
  "Real-time guideline iteration",
  "Edge cases resolved in hours",
  "Quality improves continuously",
  "No batch cycles, no portals",
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function LabelingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      {/* Noise overlay */}
      <div className="noise-overlay-animated" />

      {/* Shared Header */}
      <Header />

      <main className="relative z-10">
        {/* ============================================
           SECTION 1: HERO
           ============================================ */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-transparent">
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

          <div className="container relative">
            {/* Breadcrumb */}
            <motion.nav
              className="flex items-center gap-2 text-sm font-mono text-[var(--text-tertiary)] mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[var(--text-primary)]">
                Expert Labeling
              </span>
            </motion.nav>

            {/* Label */}
            <motion.p
              className="font-mono text-sm text-[var(--accent-primary)] mb-6 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              // EXPERT ANNOTATION
            </motion.p>

            {/* H1 */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Expert Labeling for Frontier AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-[var(--accent-primary)] italic mb-6 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Domain specialists embedded with your team — not behind a portal.
            </motion.p>

            {/* Body */}
            <motion.p
              className="text-base md:text-lg text-[var(--text-secondary)] mb-10 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              RLHF, video annotation, red teaming, and benchmark curation. Our
              annotators understand your architecture, iterate on guidelines in
              real-time, and catch edge cases your internal QA misses.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <Button href="#contact" variant="cta-glitch" size="lg">
                Embed a Team
              </Button>
              <Button href="#contact" variant="secondary" size="lg">
                Book a Call
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ============================================
           SECTION 2: EMBEDDED MODEL (KEY DIFFERENTIATOR)
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // MODEL
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                A Different Model
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mb-12">
                The feedback loop between your engineers and our annotators is
                where quality comes from.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Traditional Vendor */}
              <FadeIn delay={0.1}>
                <motion.div
                  className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 md:p-8 h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[var(--text-muted)]" />
                    <h3 className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-wider">
                      Traditional Vendor
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {vendorSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        className="font-mono text-sm text-[var(--text-tertiary)] flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="text-[var(--text-muted)] select-none shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                        {i < vendorSteps.length - 1 && (
                          <span className="text-[var(--text-muted)] ml-auto">
                            ...
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      Weeks between feedback cycles. Quality degrades silently.
                    </p>
                  </div>
                </motion.div>
              </FadeIn>

              {/* Claru */}
              <FadeIn delay={0.2}>
                <motion.div
                  className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-accent)] rounded-xl p-6 md:p-8 h-full relative overflow-hidden"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Subtle accent glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full blur-3xl pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-[var(--accent-primary)]" />
                      <h3 className="font-mono text-sm text-[var(--accent-primary)] uppercase tracking-wider">
                        <TextScramble text="Claru" scrambleOnHover autoPlay delay={600} />
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {claruSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          className="font-mono text-sm text-[var(--text-primary)] flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--border-accent)]">
                      <p className="font-mono text-xs text-[var(--accent-primary)]">
                        Hours between feedback cycles. Quality compounds daily.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 3: ANNOTATION TYPES
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // SERVICES
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                What We Label
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mb-12">
                Six core annotation capabilities, each staffed by specialists
                who understand the downstream impact on your model.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {annotationTypes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center mb-4 group-hover:bg-[var(--accent-glow-strong)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="space-y-2">
                      {item.bullets.map((bullet, bi) => (
                        <li
                          key={bi}
                          className="flex items-start gap-2 text-xs font-mono text-[var(--text-tertiary)]"
                        >
                          <span className="text-[var(--accent-primary)] mt-0.5 shrink-0">
                            &gt;
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 4: MODALITIES
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // MODALITIES
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
                Expert labeling across three modalities
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modalities.map((mod, index) => {
                const Icon = mod.icon;
                return (
                  <motion.div
                    key={mod.title}
                    className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 md:p-8 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center mb-5 group-hover:bg-[var(--accent-glow-strong)] transition-colors">
                      <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{mod.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {mod.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 5: QUALITY METHODOLOGY
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // QUALITY
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                How We Maintain Quality
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mb-12">
                Quality is not a QA step at the end. It is built into every
                stage of the annotation process.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualityItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className="flex gap-5 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-6 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent-glow-strong)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 6: DEEP DIVE LINKS
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // EXPLORE
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
                Go Deeper
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl px-6 py-5 group hover:border-[var(--border-accent)] transition-all duration-300"
                  >
                    <span className="font-medium group-hover:text-[var(--accent-primary)] transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 7: FAQ
           ============================================ */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                // FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
                Common Questions
              </h2>
            </FadeIn>

            <div className="max-w-3xl">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
           SECTION 8: CONTACT CTA
           ============================================ */}
        <section id="contact" className="py-16 md:py-24 bg-transparent">
          <div className="container">
            <FadeIn>
              <div className="text-center mb-12">
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-4 tracking-wide">
                  // CONNECT
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Embed a Labeling Team
                </h2>
                <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                  Tell us what you&apos;re building. We&apos;ll tell you how
                  we&apos;d embed.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <ContactForm />
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
