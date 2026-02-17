"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  ChevronRight,
  ArrowRight,
  Clock,
  Eye,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/Logo";
import Button from "@/app/components/ui/Button";
import Citation from "@/app/components/ui/Citation";
import FAQItem from "@/app/components/ui/FAQItem";
import TextScramble from "@/app/components/effects/TextScramble";

export default function VideoAnnotationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs: { question: string; answer: React.ReactNode }[] = [
    {
      question:
        "What annotation density do you recommend for video AI training?",
      answer: (
        <>
          <p className="mb-3">
            Annotation density depends on your use case and budget. We offer
            three primary approaches:
          </p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Keyframe annotation
                </strong>{" "}
                (1-5 fps): Annotate selected frames and use interpolation for
                the rest. Cost-effective for object tracking where motion is
                smooth.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Dense annotation
                </strong>{" "}
                (30 fps): Every frame annotated. Required for precise action
                boundary detection or training frame-level models.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Adaptive density
                </strong>
                : Higher density during complex actions, lower during static
                scenes. Balances cost and precision.
              </span>
            </li>
          </ul>
          <p>
            For most video understanding models, keyframe annotation with
            expert-verified interpolation provides the best cost-quality
            tradeoff. We help you determine the right approach for your specific
            model architecture.
          </p>
        </>
      ),
    },
    {
      question: "How do you maintain temporal consistency across long videos?",
      answer: (
        <>
          <p className="mb-3">
            Temporal consistency is the hardest problem in video annotation. A
            bounding box that jitters frame-to-frame, an action label that
            flickers, or an object ID that changes mid-track all corrupt your
            training data. We address this through:
          </p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Interpolation-aware tooling:
                </strong>{" "}
                Our annotation platform propagates labels between keyframes and
                highlights inconsistencies for annotator review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Trained annotators:
                </strong>{" "}
                Video annotation requires different skills than image
                annotation. We train annotators specifically on temporal
                consistency requirements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Automated QA:
                </strong>{" "}
                We run consistency checks that flag sudden jumps in bounding box
                position, size, or label that exceed physical plausibility
                thresholds.
              </span>
            </li>
          </ul>
          <p>
            The result: smooth tracks that represent actual object motion,
            consistent action boundaries, and clean training data for temporal
            models.
          </p>
        </>
      ),
    },
    {
      question:
        "What turnaround time can we expect for video annotation projects?",
      answer: (
        <>
          <p className="mb-3">
            Turnaround depends on video length, annotation density, and task
            complexity. For typical projects:
          </p>
          <ul className="space-y-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Object tracking (keyframe):
                </strong>{" "}
                10-20 hours of video per week with standard team sizes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Dense segmentation (30 fps):
                </strong>{" "}
                2-5 hours of video per week due to frame-by-frame annotation
                requirements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-primary)] mt-1">+</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Action recognition:
                </strong>{" "}
                5-15 hours per week depending on action complexity and temporal
                precision requirements.
              </span>
            </li>
          </ul>
          <p>
            For time-sensitive projects, we can scale team sizes to increase
            throughput. We provide accurate timeline estimates after reviewing
            sample videos and annotation requirements.
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
                    className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--bg-primary)]"
                  >
                    Prepare
                  </Link>
                  <Link
                    href="/pillars/enrich"
                    className="block px-3 py-2 text-sm text-[var(--accent-primary)] rounded hover:bg-[var(--bg-primary)]"
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
              href="/pillars/enrich"
              className="hover:text-[var(--text-primary)]"
            >
              Enrich
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--accent-primary)]">
              Video Annotation
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
                ENRICH
              </span>
              <span className="w-12 h-px bg-[var(--accent-primary)]" />
              <span className="font-mono text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
                Temporal Labeling
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <TextScramble text="VIDEO ANNOTATION" scrambleOnHover={true} />
              <br />
              <span className="text-[var(--accent-secondary)] italic">
                Frame-by-Frame Precision
              </span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-4 leading-relaxed max-w-3xl">
              A 10-minute video contains 18,000 frames at 30 fps. Each frame
              needs labels that are consistent with the frames before and after
              it.
            </p>

            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-3xl">
              We provide{" "}
              <strong className="text-[var(--text-primary)]">
                temporally consistent video annotation
              </strong>{" "}
              for action recognition, object tracking, temporal segmentation,
              and scene understanding.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Video Projects <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/enrich" variant="secondary" size="lg">
                Back to Enrich
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
              The Video Annotation Bottleneck
            </h2>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Video AI is exploding. Text-to-video generation, autonomous
                vehicles, sports analytics, video search, action
                recognition&mdash;the applications are endless. But every one of
                these models needs video training data, and video annotation
                remains a{" "}
                <Citation href="https://labelyourdata.com/articles/data-annotation/video-segmentation">
                  major bottleneck
                </Citation>{" "}
                for AI development.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                The math is brutal. A single hour of video at 30 fps contains{" "}
                <strong className="text-[var(--text-primary)]">
                  108,000 frames
                </strong>
                . Each frame might need bounding boxes, segmentation masks,
                action labels, or scene tags. And those labels must be
                temporally consistent&mdash;a bounding box that jitters from
                frame to frame, or an action label that flickers on and off,
                corrupts your training data.
              </p>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Image annotation doesn&apos;t prepare you for video. A skilled
                image annotator can label objects accurately in isolated frames,
                but video requires understanding{" "}
                <strong className="text-[var(--text-primary)]">time</strong>:
                when does an action start? When does it end? How do you track an
                object through occlusion? What counts as a scene boundary?
              </p>

              <div className="space-y-4 mb-8 pl-4 border-l-2 border-[var(--accent-primary)]/30">
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Generic annotators produce frame-by-frame labels that break
                  temporal consistency.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Automated tracking tools propagate errors and drift over long
                  sequences.
                </p>
                <p className="text-[var(--text-primary)] text-lg font-medium">
                  Action boundaries require human judgment about when behaviors
                  begin and end.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Even with advances like{" "}
                <Citation href="https://ai.meta.com/sam2/">
                  Meta&apos;s SAM 2
                </Citation>{" "}
                for automated video segmentation, human annotation remains
                essential. SAM 2 can propagate masks across frames, but humans
                must provide the initial prompts, verify the results, and
                correct errors. The tool accelerates annotation; it doesn&apos;t
                eliminate the need for expert human judgment.
              </p>

              <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)]/20 rounded-xl p-6 my-8">
                <p className="text-xl font-semibold mb-2">
                  Video annotation scales linearly with video length.
                </p>
                <p className="text-[var(--text-secondary)]">
                  There&apos;s no shortcut. Quality video training data requires
                  sustained human attention.
                </p>
              </div>
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
              Video Annotation Pipeline
            </h2>

            <div className="space-y-12">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    1. Keyframe Selection & Annotation
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Rather than annotating every frame from scratch, we identify
                    keyframes where significant changes occur&mdash;new objects
                    appearing, actions starting, scene transitions. Expert
                    annotators create high-quality labels on these keyframes,
                    which serve as anchors for the full sequence.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    For object tracking, this means precise bounding boxes or
                    segmentation masks at key moments. For action recognition,
                    it means clear boundary markers where activities begin and
                    end.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    2. Interpolation & Propagation
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Between keyframes, we use a combination of automated
                    interpolation and human verification. For smooth motion,
                    linear interpolation works well. For complex movements or
                    occlusions, annotators manually adjust intermediate frames.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Tools like{" "}
                    <Citation href="https://ai.meta.com/sam2/">SAM 2</Citation>{" "}
                    help propagate segmentation masks across frames, but every
                    propagation gets human review. We catch drift, correct
                    errors, and ensure the final annotations match reality.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    3. Temporal Consistency QA
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Every video undergoes temporal consistency checks. Automated
                    systems flag sudden jumps in bounding box position or size
                    that exceed physical plausibility. Human reviewers watch
                    annotated videos at speed to spot flickering labels or
                    inconsistent tracks.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    For action annotations, we verify that temporal boundaries
                    make sense&mdash;actions start when the motion begins, not
                    when the annotator happened to be looking. Multi-annotator
                    consensus resolves ambiguous boundaries.
                  </p>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    4. Action Segmentation & Scene Tagging
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Beyond object-level annotation, we provide temporal
                    segmentation: breaking videos into meaningful segments based
                    on actions, scenes, or other semantic boundaries. This
                    requires annotators who understand what they&apos;re
                    watching&mdash;when a &quot;throw&quot; starts, when a
                    &quot;catch&quot; ends, what constitutes a single
                    &quot;action&quot; versus a sequence.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Annotators trained in{" "}
                    <Citation href="https://averroes.ai/blog/video-segmentation-guide">
                      temporal annotation best practices
                    </Citation>{" "}
                    provide consistent, physics-aware boundaries that your
                    models can learn from.
                  </p>
                </div>
              </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Annotation Types & Quality Standards
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Annotation Types */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Annotation Types</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Bounding boxes:
                      </strong>{" "}
                      2D/3D boxes with temporal tracking and object IDs
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Segmentation masks:
                      </strong>{" "}
                      Pixel-level masks with instance and semantic segmentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Skeleton/pose:
                      </strong>{" "}
                      Keypoint annotations for human and animal pose estimation
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Action labels:
                      </strong>{" "}
                      Temporal segments with start/end timestamps and action
                      categories
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Scene tags:
                      </strong>{" "}
                      Shot boundaries, scene categories, and visual attributes
                    </span>
                  </li>
                </ul>
              </div>

              {/* Frame Density */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">
                  Frame Density Options
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Keyframe (1-5 fps):
                      </strong>{" "}
                      Anchor annotations with interpolation; cost-effective for
                      smooth motion
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Dense (24-30 fps):
                      </strong>{" "}
                      Every frame annotated; required for precise temporal
                      models
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Adaptive:
                      </strong>{" "}
                      Variable density based on scene complexity and action
                      frequency
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Event-triggered:
                      </strong>{" "}
                      Dense annotation only during detected actions or events
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quality Metrics */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Quality Metrics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        IoU (Intersection over Union):
                      </strong>{" "}
                      85%+ for bounding boxes, 80%+ for segmentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Temporal consistency:
                      </strong>{" "}
                      Track continuity scores, minimal ID switches
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Action boundary accuracy:
                      </strong>{" "}
                      Mean time error under 0.5 seconds for action start/end
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Inter-annotator agreement:
                      </strong>{" "}
                      90%+ for object presence, 80%+ for action boundaries
                    </span>
                  </li>
                </ul>
              </div>

              {/* Output Formats */}
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <h3 className="text-xl font-semibold mb-4">Output Formats</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        COCO Video:
                      </strong>{" "}
                      Extended COCO format with tracking annotations
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        MOT Challenge:
                      </strong>{" "}
                      Standard format for multi-object tracking benchmarks
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        ActivityNet:
                      </strong>{" "}
                      Temporal action detection format with timestamps
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-1">+</span>
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Custom schemas:
                      </strong>{" "}
                      We adapt to your existing data pipeline requirements
                    </span>
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
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-sm text-[var(--accent-primary)] mb-4 block">
              {"// USE CASES"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Applications of Video Annotation
            </h2>

            <div className="space-y-8">
              {/* Video Generation Models */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Video Generation Models
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Text-to-video and image-to-video models like Sora, Runway, and
                  Pika need vast amounts of captioned video data. Beyond
                  captions, temporal annotations help models understand{" "}
                  <Citation href="https://averroes.ai/blog/video-segmentation-guide">
                    how actions unfold over time
                  </Citation>
                  &mdash;the physics of motion, the sequence of events, the
                  relationship between cause and effect.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide dense video captions with temporal alignment,
                  action descriptions with frame-level timestamps, and scene
                  decomposition that helps models learn video structure.
                </p>
              </motion.div>

              {/* Autonomous Vehicles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Autonomous Vehicles
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Self-driving cars need to track objects, predict trajectories,
                  and understand scenes in real-time. Training these systems
                  requires millions of frames of annotated driving video with
                  precise 3D bounding boxes, lane markings, traffic signs, and
                  pedestrian tracks.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide multi-sensor annotation across camera, lidar, and
                  radar modalities, with temporal consistency that enables
                  trajectory prediction and behavior modeling.
                </p>
              </motion.div>

              {/* Sports Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">Sports Analytics</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Sports analysis requires tracking multiple players,
                  identifying plays and formations, and detecting specific
                  events like goals, fouls, or tactical patterns. The temporal
                  dimension is critical&mdash;a play unfolds over seconds, and
                  the timing of each action determines its meaning.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide player tracking with jersey number recognition,
                  pose estimation for technique analysis, and event detection
                  with frame-accurate timestamps.
                </p>
              </motion.div>

              {/* Robotics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Robotics & Manipulation
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Robot learning from demonstration requires detailed annotation
                  of human actions&mdash;hand positions, object interactions,
                  grasp types, and manipulation sequences. The robot needs to
                  understand not just what happened, but the temporal structure
                  of how it happened.
                </p>
                <p className="text-[var(--text-secondary)]">
                  We provide 6-DoF pose annotation, hand-object interaction
                  labeling, and action primitive segmentation that enables
                  imitation learning at scale.
                </p>
              </motion.div>
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
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Temporally Consistent Video Annotation?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-4">
              Video AI models are only as good as their temporal training data.
            </p>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Tell us about your video annotation needs&mdash;the content, the
              density requirements, the annotation types. We&apos;ll design a
              pipeline that delivers consistent, high-quality data on your
              timeline.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contact" variant="cta-glitch" size="lg">
                Discuss Video Projects <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/pillars/enrich/rlhf" variant="secondary" size="lg">
                Learn About RLHF
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12 border-t border-[var(--border-subtle)]">
        <div className="container">
          <p className="text-sm font-mono text-[var(--accent-primary)] mb-4">
            {"// RELATED SERVICES"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/pillars/enrich"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Pillar
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Enrich Overview
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                All annotation services
              </p>
            </Link>
            <Link
              href="/pillars/enrich/rlhf"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Cluster
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                RLHF
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                Human feedback for LLM alignment
              </p>
            </Link>
            <Link
              href="/pillars/enrich/expert-annotation"
              className="p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors group"
            >
              <span className="text-sm text-[var(--text-tertiary)]">
                Cluster
              </span>
              <h3 className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors">
                Expert Annotation
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                PhD-level domain specialists
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
