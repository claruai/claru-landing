"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  ChevronRight,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle,
  Radio,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";

export default function MultimodalAlignmentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question: "How precise is your video-text alignment?",
      answer: (
        <>
          <p className="mb-3">
            We achieve sub-50ms temporal precision for most video-text alignment
            tasks. The exact precision depends on video frame rate and caption
            density requirements.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Frame-level alignment:
              </strong>{" "}
              For 30fps video, each caption is synchronized to specific frame
              ranges with verified start and end timestamps accurate to ~33ms.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Dense captioning:
              </strong>{" "}
              For scenarios requiring per-frame descriptions, we provide
              individual frame annotations with continuous text coverage.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Scene-level alignment:
              </strong>{" "}
              For longer content, we detect scene boundaries and ensure caption
              consistency within scene segments.
            </li>
          </ul>
          <p>
            Precision requirements vary by use case. Text-to-video generation
            needs tighter alignment than video classification. We configure
            precision targets based on your model architecture.
          </p>
        </>
      ),
    },
    {
      question: "How do you handle temporal drift in long videos?",
      answer: (
        <>
          <p className="mb-3">
            Long videos accumulate synchronization errors that compound over
            time. Variable frame rates, audio drift, and caption timing
            inconsistencies all contribute. We address this systematically.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Anchor point synchronization:
              </strong>{" "}
              We establish verified alignment anchors at scene boundaries and
              key events, then propagate alignment between anchors.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Cross-modal verification:
              </strong>{" "}
              Embedding similarity between visual content and text descriptions
              detects drift. When similarity drops unexpectedly, we flag for
              re-alignment.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Audio cues:
              </strong>{" "}
              Speech-to-text with forced alignment provides additional temporal
              anchors for videos with spoken content.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Human verification:
              </strong>{" "}
              Ambiguous segments are flagged for manual review to ensure
              alignment accuracy where automated methods are uncertain.
            </li>
          </ul>
          <p>
            Our pipeline detects and corrects drift rather than letting errors
            compound across video duration.
          </p>
        </>
      ),
    },
    {
      question: "What quality metrics do you use for alignment verification?",
      answer: (
        <>
          <p className="mb-3">
            Alignment quality is measurable. We use multiple complementary
            metrics and provide confidence scores with each aligned pair.
          </p>
          <ul className="list-none space-y-2 mb-3">
            <li>
              <strong className="text-[var(--text-primary)]">
                Cross-modal similarity:
              </strong>{" "}
              CLIP-based similarity scores between video frames and aligned text
              embeddings. Higher scores indicate better semantic alignment.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Temporal overlap IoU:
              </strong>{" "}
              Intersection-over-union between caption time spans and
              corresponding visual content. Measures temporal precision.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Human verification sampling:
              </strong>{" "}
              Statistical sampling of aligned pairs with manual verification
              provides ground-truth accuracy estimates.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">
                Confidence scoring:
              </strong>{" "}
              Each aligned pair includes a confidence score. You can filter by
              threshold to trade off coverage for quality.
            </li>
          </ul>
          <p>
            Quality reports accompany every delivery, enabling you to make
            informed decisions about threshold selection.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <span className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1">
                Services
                <ChevronRight className="w-3 h-3 rotate-90 group-hover:rotate-[270deg] transition-transform" />
              </span>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-2 min-w-[160px] shadow-xl">
                  <Link
                    href="/pillars/acquire"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Acquire
                  </Link>
                  <Link
                    href="/pillars/prepare"
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Prepare
                  </Link>
                  <Link
                    href="/pillars/enrich"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Enrich
                  </Link>
                  <Link
                    href="/pillars/validate"
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Validate
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/#capabilities"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Capabilities
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <Button href="/#contact" variant="cta-glitch" size="sm">
            Get Started
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 border-b border-[var(--border-subtle)]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/pillars/prepare"
              className="hover:text-[var(--text-primary)]"
            >
              Prepare
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">
              Multimodal Alignment
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--accent-primary)] to-transparent" />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-sm text-[var(--accent-primary)]">
                02.3
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Multimodal Alignment
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Synchronize Data Across
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Every Modality
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              Video-text misalignment teaches models the wrong associations. A
              caption saying &quot;the ball bounces&quot; must align with the
              exact frames where bouncing occurs, not the entire clip.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              <Citation href="https://arxiv.org/abs/2103.00020">CLIP</Citation>{" "}
              demonstrated that contrastive learning between visual and text
              representations creates powerful embeddings. But the quality of
              alignment determines the quality of learned representations. We
              provide frame-level precision for your multimodal datasets.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#contact" variant="cta-glitch" size="lg">
                Align Your Data <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/prepare" variant="secondary" size="lg">
                Back to Prepare
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Alignment Quality Matters
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Most video-text datasets have loose alignment. Captions describe
                entire clips rather than specific moments. For video-language
                models like Sora, Runway, and Veo, this loose alignment limits
                what models can learn about the relationship between language
                and visual dynamics.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://arxiv.org/abs/2212.03191">
                  InternVideo
                </Citation>{" "}
                achieved state-of-the-art video understanding by training on
                carefully curated video-text pairs with verified temporal
                alignment. The lesson is clear: alignment quality directly
                impacts model capability.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <Citation href="https://arxiv.org/abs/2405.04682">
                  TALC (Time-Aligned Captions)
                </Citation>{" "}
                research shows that temporal precision in captions significantly
                improves video understanding. When captions describe what is
                happening at specific timestamps rather than summarizing entire
                videos, models learn more nuanced representations.
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Clip-level captions miss temporal dynamics entirely.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Audio drift accumulates across long videos, desynchronizing
                  speech from visual content.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Multi-scene videos need per-scene descriptions with temporal
                  boundaries.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Variable frame rates and encoding artifacts create subtle
                  misalignment.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                For text-to-video generation, the model must learn precise
                correspondences between language and visual dynamics. Training
                on loosely aligned data produces models that generate generic
                content rather than following prompts precisely.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// HOW IT WORKS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Multimodal Alignment Pipeline
            </h2>

            <p className="text-[var(--text-secondary)] text-lg mb-12">
              We combine automated cross-modal embedding verification with human
              quality assurance to achieve frame-level precision at scale.
            </p>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Temporal Segmentation",
                  description:
                    "Scene detection and shot boundary analysis divide videos into semantically coherent segments. Each segment becomes a unit for caption alignment, ensuring captions describe continuous visual content rather than spanning scene transitions.",
                },
                {
                  step: "02",
                  title: "Cross-Modal Embedding Alignment",
                  description:
                    "We compute embeddings for both visual frames and text descriptions using models like CLIP and InternVideo. High similarity between frame embeddings and text embeddings indicates correct alignment. Low similarity flags potential misalignment for review.",
                },
                {
                  step: "03",
                  title: "Temporal Refinement",
                  description:
                    "Initial alignments are refined using audio cues (speech, sound events), motion analysis (action start/end detection), and temporal consistency constraints. This produces precise start and end timestamps for each caption span.",
                },
                {
                  step: "04",
                  title: "Human Verification Layer",
                  description:
                    "Automated alignment is verified through statistical sampling and targeted review of low-confidence segments. Human annotators confirm temporal precision and semantic accuracy, catching subtle errors that automated methods miss.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <span className="font-mono text-2xl text-[var(--accent-primary)]">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// TECHNICAL SPECIFICATIONS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Alignment Precision Standards
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Configurable precision levels for different use cases, from
              clip-level descriptions to frame-by-frame annotation.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Temporal Precision
                </h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Sub-50ms alignment tolerance for dense captioning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Frame-accurate timestamps (33ms at 30fps)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Scene boundary detection accuracy above 95%
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Audio-visual sync verification within 20ms
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Caption Density</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Sparse: 1 caption per clip (classification)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Medium: 1 caption per scene (understanding)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Dense: continuous captions (generation)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Per-frame: individual frame descriptions
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <Radio className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Modality Support</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Video-text (caption-frame alignment)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Audio-video (speech, sound events)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Image-text (static visual descriptions)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Multi-stream (multiple camera angles)
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Metrics</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    CLIP similarity scores per alignment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Temporal overlap IoU measurements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Human verification sampling rate
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">+</span>
                    Confidence scores for filtering
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// USE CASES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Where Alignment Matters Most
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-3xl">
              Different model architectures have different alignment
              requirements. Here is how alignment quality impacts each use case.
            </p>

            <div className="space-y-6">
              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Text-to-Video Generation
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Sora, Runway Gen-3, Veo, Kling
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Text-to-video models must learn precise correspondences
                  between language and visual dynamics. When training data has
                  loose caption alignment, models generate generic content that
                  approximates prompts rather than following them precisely.
                  Dense, temporally-aligned captions teach models to generate
                  specific actions at specific moments.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Dense captions
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Action timing
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Motion description
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Vision-Language Pre-training
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      CLIP, InternVideo, VideoCLIP
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Contrastive learning between visual and text embeddings
                  requires that paired samples actually correspond. Misaligned
                  pairs create noisy gradients that degrade learned
                  representations.{" "}
                  <Citation href="https://arxiv.org/abs/2103.00020">
                    CLIP
                  </Citation>{" "}
                  succeeded partly due to careful curation of image-text pairs
                  where captions accurately describe image content.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Embedding quality
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Contrastive learning
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Zero-shot transfer
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Video Understanding Models
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm">
                      Video QA, temporal grounding, action recognition
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  Temporal grounding requires models to locate specific moments
                  in video given text queries. Training on time-aligned captions
                  teaches models the correspondence between language
                  descriptions and temporal locations. Without precise
                  alignment, models cannot learn to ground language in time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Temporal grounding
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Action localization
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm">
                    Video QA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// FAQ"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Common Questions
            </h2>

            <div className="divide-y divide-[var(--border-subtle)]">
              {faqs.map((faq, index) => (
                <FAQItem key={index} {...faq} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Align Your Multimodal Data?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Misaligned data limits what your models can learn.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your video-language or vision-language model. We
              will scope an alignment pipeline that delivers the precision your
              architecture requires.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Start Alignment <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/prepare" variant="secondary" size="lg">
                Back to Prepare
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <p className="text-sm font-mono text-[var(--accent-primary)] mb-4">
            // RELATED PREPARE SERVICES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/pillars/prepare/deduplication"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02.1</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Deduplication
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Multi-level duplicate removal at scale
              </p>
            </Link>
            <Link
              href="/pillars/prepare/quality-scoring"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">02.2</span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Quality Scoring
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Multi-signal scoring and filtering
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-subtle)]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
              <Link
                href="/privacy"
                className="hover:text-[var(--text-primary)]"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--text-primary)]">
                Terms
              </Link>
              <Link
                href="/#contact"
                className="hover:text-[var(--text-primary)]"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-[var(--text-tertiary)]">
              &copy; {new Date().getFullYear()} Claru. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
