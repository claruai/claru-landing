"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  ChevronRight,
  Tag,
  CheckCircle,
  Video,
  Gamepad2,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/sections/Footer";
import Button from "../components/ui/Button";
import FAQItem from "../components/ui/FAQItem";
import FadeIn from "../components/effects/FadeIn";
import TextScramble from "../components/effects/TextScramble";

/* ============================================
   DYNAMIC IMPORTS FOR HEAVY EFFECTS
   ============================================ */

const MatrixRain = dynamic(
  () => import("../components/effects/MatrixRain"),
  { ssr: false },
);

const ASCIIAnnotationBg = dynamic(
  () => import("../components/effects/ASCIIAnnotation"),
  { ssr: false },
);

const ShaderBackground = dynamic(
  () => import("../components/effects/ShaderBackground").then(
    (mod) => ({ default: mod.SectionAsciiShader })
  ),
  { ssr: false },
);


/* ============================================
   ASCII SECTION DIVIDER
   ============================================ */

function ASCIIDivider({ text = "CLARU" }: { text?: string }) {
  return (
    <motion.div
      className="py-6 md:py-8 text-center select-none pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="font-mono text-[var(--accent-primary)] opacity-20 text-xs md:text-sm">
        <span className="block">{"\u2500".repeat(35)}</span>
        <span className="block">
          {"   \u2591\u2591\u2591 "}{text}{" \u2591\u2591\u2591"}
        </span>
        <span className="block">{"\u2500".repeat(35)}</span>
      </div>
    </motion.div>
  );
}

/* ============================================
   WORK CATEGORIES DATA
   ============================================ */

const workCategories = [
  {
    icon: Tag,
    title: "Data Labeling",
    description:
      "Tag, classify, and structure raw datasets for model training. Work across text, image, and video modalities.",
    video: "/videos/annotate.mp4",
  },
  {
    icon: CheckCircle,
    title: "Quality Review",
    description:
      "Audit annotations for accuracy. Maintain gold-standard benchmarks. Catch what others miss.",
    video: "/videos/quality-review.mp4",
  },
  {
    icon: Video,
    title: "Video Capture",
    description:
      "Record real-world footage in controlled environments. Support computer vision and robotics research.",
    video: "/videos/capture-videos.mp4",
  },
  {
    icon: Gamepad2,
    title: "Gaming",
    description:
      "Play-test and provide structured feedback for game AI systems and interactive environments.",
    video: "/videos/gaming.mp4",
  },
];

/* ============================================
   DOMAIN EXPERT AREAS DATA
   ============================================ */

const domainExpertAreas = [
  {
    title: "RLHF & Preference Ranking",
    description:
      "Rate model outputs and guide alignment through structured human feedback loops.",
  },
  {
    title: "Video Annotation",
    description:
      "Temporally dense labeling for action recognition, object tracking, and scene understanding.",
  },
  {
    title: "Red Teaming & Safety",
    description:
      "Probe models for failure modes, biases, and harmful outputs before deployment.",
  },
  {
    title: "Robotics & Manipulation",
    description:
      "Capture and annotate manipulation trajectories, grasping sequences, and navigation data.",
  },
  {
    title: "Vision-Language Evaluation",
    description:
      "Assess multimodal model outputs for accuracy, grounding, and reasoning quality.",
  },
  {
    title: "Coding & STEM Review",
    description:
      "Evaluate code generation, mathematical reasoning, and scientific accuracy in model outputs.",
  },
];

/* ============================================
   HOW IT WORKS STEPS
   ============================================ */

const howItWorksSteps = [
  {
    step: "01",
    title: "Apply",
    description:
      "Submit your profile with skills and experience. Takes about 5 minutes.",
  },
  {
    step: "02",
    title: "Profile Review",
    description:
      "Our team reviews your background. We look for domain depth, not volume.",
  },
  {
    step: "03",
    title: "Get Matched",
    description:
      "We pair you with projects that match your expertise. No guessing, no task queues.",
  },
  {
    step: "04",
    title: "Start Earning",
    description:
      "Work on real frontier AI projects. Get paid weekly via direct deposit.",
  },
];

/* ============================================
   WHY CLARU COMPARISON DATA
   ============================================ */

const marketplaceModel = [
  "Anonymous task queues",
  "Race to the bottom on rates",
  "No context on what you\u2019re building",
  "Batch cycles, no feedback",
];

const claruModel = [
  "Named team, embedded with the lab",
  "Expert-tier compensation ($25\u2013100/hr)",
  "Full context on model architecture and goals",
  "Real-time feedback loops with researchers",
];

const goodFit = [
  "You have deep expertise in a specific domain",
  "You care about quality over speed",
  "You want to understand what you\u2019re building toward",
];

const notFit = [
  "You want high-volume microtask work",
  "You prefer anonymous, no-context assignments",
];

/* ============================================
   FAQ DATA
   ============================================ */

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Is data annotation work legitimate?",
    answer: (
      <p>
        Yes. Data annotation is essential work that powers every major AI system in production today.
        The global data annotation market is valued at over $2.26 billion and growing rapidly as AI labs
        scale their training pipelines. Companies like Google, Meta, and OpenAI all rely on human annotators
        to label training data, evaluate model outputs, and guide alignment. At Claru, you work directly
        with frontier AI research teams on real projects — not clickwork or microtasks.
      </p>
    ),
  },
  {
    question: "How much do AI annotators make at Claru?",
    answer: (
      <p>
        Claru pays $20&ndash;100 per hour depending on expertise and project complexity. Our tier system
        reflects your skills: Entry-level roles start at $20&ndash;35/hr for general annotation tasks,
        Standard roles pay $35&ndash;55/hr for experienced annotators handling complex modalities, and
        Expert roles pay $55&ndash;100/hr for specialists with deep domain knowledge in areas like
        RLHF, robotics, coding, or scientific reasoning. Rates increase as you gain experience
        and take on more specialized work.
      </p>
    ),
  },
  {
    question: "Do I need experience to apply?",
    answer: (
      <p>
        Not necessarily for entry-level roles. Some annotation tasks — like image classification or
        basic text labeling — require strong attention to detail but no prior annotation experience.
        However, expert-level roles in areas like RLHF, red teaming, or coding review require demonstrated
        domain depth. If you have subject-matter expertise in STEM, linguistics, law, medicine, or a
        similar field, that background is often more valuable than annotation-specific experience.
        We provide training and onboarding for every project.
      </p>
    ),
  },
  {
    question: "What is RLHF?",
    answer: (
      <p>
        RLHF stands for Reinforcement Learning from Human Feedback. It&apos;s the process by which AI
        models learn to produce better, safer, and more helpful outputs based on human preferences.
        In practice, annotators compare pairs of model responses and rank which is better, provide
        corrections, or flag problematic content. This human judgment signal is then used to fine-tune
        the model. RLHF is one of the key techniques behind the quality of models like ChatGPT and
        Claude, and it&apos;s a core part of the work Claru does with AI labs.
      </p>
    ),
  },
  {
    question: "How does Claru pay annotators?",
    answer: (
      <p>
        Weekly via direct deposit. You receive reliable, consistent payments every week — no waiting
        for batch processing cycles or hitting minimum payout thresholds. We believe the people doing
        critical AI training work deserve predictable, timely compensation. Payment details and tax
        documentation are handled through our platform.
      </p>
    ),
  },
  {
    question: "Can I work remotely?",
    answer: (
      <p>
        Yes, all Claru annotation roles are fully remote. You can work from anywhere with a reliable
        internet connection. Most projects also offer flexible scheduling — you choose when to work
        within project deadlines. Some specialized roles (like egocentric video capture) may require
        specific equipment or environments, but the majority of our work is done entirely online.
      </p>
    ),
  },
  {
    question: "How is Claru different from other annotation platforms?",
    answer: (
      <p>
        Claru embeds annotators directly with AI research teams rather than routing anonymous tasks
        through a marketplace. You&apos;re not a gig worker picking from a task queue — you&apos;re
        part of the team, with context on the model you&apos;re training and direct communication
        with researchers. This means more meaningful work, better pay, longer engagements, and
        the opportunity to develop genuine expertise in frontier AI development.
      </p>
    ),
  },
  {
    question: "What types of AI projects will I work on?",
    answer: (
      <p>
        Video generation, vision-language models, robotics, and other frontier AI systems. Claru works
        with labs building the next generation of AI — not spam detection or ad targeting. Recent projects
        include training video generation models, evaluating multimodal reasoning, labeling manipulation
        data for robotic arms, and red-teaming large language models for safety. The specific projects
        available depend on your expertise and the current needs of our lab partners.
      </p>
    ),
  },
];

export default function WorkWithUsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Matrix rain background -- mobile only */}
      <div className="md:hidden">
        <MatrixRain density={0.2} speed={0.5} opacity={0.35} />
      </div>

      {/* Noise overlay for texture -- matches main LP */}
      <div className="noise-overlay-animated" />

      <Header opaque />

      <main className="relative z-10">
        {/* ----------------------------------------
            HERO SECTION
        ---------------------------------------- */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
          {/* ASCII annotation background -- hero only, desktop, bold and visible */}
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none">
            <ASCIIAnnotationBg opacity={0.6} />
          </div>

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

          {/* ASCII corner accent -- top left */}
          <div className="absolute top-24 left-8 opacity-20 hidden lg:block">
            <motion.div
              className="text-[var(--accent-secondary)] font-mono text-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="block">{"// RECRUIT SEQUENCE"}</span>
              <span className="block text-[var(--text-tertiary)]">
                {"// LOADING..."}
              </span>
              <span className="block">
                {">"} <span className="cursor" />
              </span>
            </motion.div>
          </div>

          {/* ASCII corner accent -- bottom right */}
          <div className="absolute bottom-20 right-8 opacity-20 hidden lg:block">
            <motion.div
              className="text-[var(--accent-secondary)] font-mono text-xs text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="block">SUPPLY_v2.1</span>
              <span className="block text-[var(--text-tertiary)]">
                STATUS: RECRUITING
              </span>
            </motion.div>
          </div>

          <div className="container relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] font-mono mb-10">
              <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--accent-primary)]">Work With Us</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// JOIN THE TEAM"}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Train the AI models shaping{" "}
                <TextScramble text="the future." scrambleOnHover autoPlay delay={300} />
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
                We&apos;re not a task marketplace. We&apos;re a team of domain experts
                embedded with frontier AI labs — and we&apos;re looking for people like you.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href="https://app.claru.ai/signup" variant="cta-glitch" size="lg">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="/jobs" variant="secondary" size="lg">
                  Browse Open Roles
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Bottom gradient fade -- hero to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
        </section>

        {/* ----------------------------------------
            OUR COMMUNITY CALLOUT
        ---------------------------------------- */}
        <section className="py-12 md:py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 md:p-12 hover:border-[var(--accent-primary)]/40 transition-all duration-300"
            >
              <span className="font-mono text-sm text-[var(--accent-secondary)] block mb-4">
                {"// OUR COMMUNITY"}
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join a team, not a task queue.
              </h2>

              <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl mb-10">
                We answer every message. We know our contributors by name. When
                you join Claru, you are part of a team building the data that
                trains the world&apos;s most advanced AI.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {[
                  { stat: "500+", label: "active contributors" },
                  { stat: "<2 hrs", label: "Avg response time" },
                  { stat: "14+", label: "countries with projects" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="text-center sm:text-left"
                  >
                    <span className="block font-mono text-2xl md:text-3xl font-bold text-[var(--accent-primary)] mb-1">
                      {item.stat}
                    </span>
                    <span className="text-sm text-[var(--text-tertiary)]">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ASCII divider */}
        <ASCIIDivider text="PATHS" />

        {/* ----------------------------------------
            BENTO: WORK CATEGORIES + EXPERTISE
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// WHAT YOU'LL DO"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <TextScramble text="Choose your path" scrambleOnHover />
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Multiple ways to contribute to frontier AI research. Pick the
                track that fits your skills and interests.
              </p>
            </FadeIn>

            {/* ---- Row 1: Data Labeling + Quality Review | bento-annotation-interface.mp4 ---- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Left column: two stacked category cards */}
              <div className="flex flex-col gap-4">
                {workCategories.slice(0, 2).map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="relative overflow-hidden bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl hover:border-[var(--accent-primary)]/40 transition-all duration-300 group flex-1"
                    >
                      {/* Video background */}
                      {category.video && (
                        <>
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                          >
                            <source src={category.video} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/60" />
                        </>
                      )}
                      <div className="relative z-10 p-6">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {category.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-5 leading-relaxed">
                          {category.description}
                        </p>
                        <a
                          href="https://app.claru.ai/signup"
                          className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors group/link"
                        >
                          Apply
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right column: bento video cell (spans 2 cols on md+) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] group md:col-span-2 min-h-[280px]"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                >
                  <source src="/videos/bento-annotation-interface.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider opacity-70">
                    // ANNOTATION INTERFACE
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ---- Row 2: bento-frame-tracking.mp4 | Video Capture + Gaming ---- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Left column: bento video cell (spans 2 cols on md+) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] group md:col-span-2 min-h-[280px] order-2 md:order-1"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                >
                  <source src="/videos/bento-frame-tracking.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider opacity-70">
                    // FRAME TRACKING
                  </span>
                </div>
              </motion.div>

              {/* Right column: two stacked category cards */}
              <div className="flex flex-col gap-4 order-1 md:order-2">
                {workCategories.slice(2, 4).map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      whileHover={{ y: -4 }}
                      className="relative overflow-hidden bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl hover:border-[var(--accent-primary)]/40 transition-all duration-300 group flex-1"
                    >
                      {category.video && (
                        <>
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                          >
                            <source src={category.video} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]/60" />
                        </>
                      )}
                      <div className="relative z-10 p-6">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {category.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-5 leading-relaxed">
                          {category.description}
                        </p>
                        <a
                          href="https://app.claru.ai/signup"
                          className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors group/link"
                        >
                          Apply
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ---- Row 3: Domain Expert Cards (3x2 grid) ---- */}
            <FadeIn className="mt-12 mb-4">
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// SPECIALIZED EXPERTISE"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                For domain experts who go deeper
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl">
                Advanced roles for specialists with subject-matter expertise.
                Higher rates, longer engagements, greater impact.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {domainExpertAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href="/jobs"
                    className="block p-5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all duration-300 group bg-[var(--bg-primary)]"
                  >
                    <h3 className="font-mono text-sm font-semibold mb-1.5 group-hover:text-[var(--accent-primary)] transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-sm text-[var(--text-tertiary)] mb-3 leading-relaxed">
                      {area.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                      Browse roles
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ---- Row 4: Wide cinematic video strip ---- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] group h-[180px] md:h-[200px]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/bento-robot-arm.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider opacity-70">
                  // ROBOTICS &amp; MANIPULATION
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ASCII divider */}
        <ASCIIDivider text="PROCESS" />

        {/* ----------------------------------------
            HOW IT WORKS SECTION
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// HOW IT WORKS"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <TextScramble text="Start in minutes" scrambleOnHover />
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-14 max-w-2xl">
                Four steps from application to your first project. No interviews, no waiting rooms.
              </p>
            </FadeIn>

            {/* Steps -- horizontal on desktop, vertical on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
              {/* Connecting line -- desktop only */}
              <div className="hidden md:block absolute top-7 left-[calc(12.5%+1.75rem)] right-[calc(12.5%+1.75rem)] h-px bg-[var(--border-medium)]" />

              {howItWorksSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="relative flex md:flex-col items-start gap-5 md:gap-0 md:items-center md:text-center px-0 md:px-4 py-5 md:py-0"
                >
                  {/* Vertical connecting line -- mobile only */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="md:hidden absolute left-[1.75rem] top-[4.5rem] bottom-0 w-px bg-[var(--border-subtle)]" />
                  )}

                  {/* Step number circle */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center md:mb-5">
                    <span className="font-mono text-2xl md:text-3xl font-bold text-[var(--accent-secondary)]">
                      {item.step}
                    </span>
                  </div>

                  {/* Dot on the connecting line -- desktop only */}
                  <div className="hidden md:block absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] z-20" />

                  <div className="flex-1 md:flex-none">
                    <h3 className="text-lg font-semibold mb-1.5">
                      {item.step} &mdash; {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[260px] md:mx-auto">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <FadeIn delay={0.4}>
              <div className="text-center mt-14">
                <Button href="https://app.claru.ai/signup" variant="cta-glitch" size="lg">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ASCII divider */}
        <ASCIIDivider text="COMPARE" />

        {/* ----------------------------------------
            WHY CLARU SECTION
        ---------------------------------------- */}
        <section className="relative py-16 md:py-24 bg-[var(--bg-secondary)]/30 overflow-hidden">
          {/* ShaderBackground -- subtle ASCII shader texture */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none hidden md:block">
            <ShaderBackground />
          </div>

          <div className="container relative z-10">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// WHY CLARU"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <TextScramble text="Not a marketplace. A team." scrambleOnHover />
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-14 max-w-2xl">
                Most platforms treat contributors as interchangeable. We don&apos;t.
              </p>
            </FadeIn>

            {/* Bento: comparison cards + video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {/* Left column: stacked comparison cards */}
              <div className="flex flex-col gap-6">
                {/* Marketplace model -- muted */}
                <FadeIn delay={0.1}>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 md:p-8 h-full">
                    <h3 className="font-mono text-sm text-[var(--text-muted)] tracking-wider mb-6 uppercase">
                      The Marketplace Model
                    </h3>
                    <ul className="space-y-4">
                      {marketplaceModel.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-[var(--text-muted)]" />
                          </span>
                          <span className="text-[var(--text-tertiary)] leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                {/* Claru model -- bright */}
                <FadeIn delay={0.2}>
                  <div className="rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--bg-primary)] p-6 md:p-8 relative overflow-hidden h-full">
                    {/* Subtle accent glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />

                    <h3 className="font-mono text-sm text-[var(--accent-primary)] tracking-wider mb-6 uppercase relative z-10">
                      The Claru Model
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      {claruModel.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/15 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-[var(--accent-primary)]" />
                          </span>
                          <span className="text-[var(--text-primary)] leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>

              {/* Right column: autonomous driving bento video */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] group min-h-[320px] lg:min-h-0"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                >
                  <source src="/videos/bento-autonomous-driving.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider opacity-70">
                    // AUTONOMOUS SYSTEMS
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Fit / Not Fit disqualification block */}
            <FadeIn delay={0.3}>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  {/* Good fit */}
                  <div>
                    <h4 className="font-mono text-sm text-[var(--accent-primary)] mb-5">
                      You&apos;re a good fit if:
                    </h4>
                    <ul className="space-y-3.5">
                      {goodFit.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/15 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-[var(--accent-primary)]" />
                          </span>
                          <span className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not a fit */}
                  <div>
                    <h4 className="font-mono text-sm text-[var(--text-muted)] mb-5">
                      This isn&apos;t for you if:
                    </h4>
                    <ul className="space-y-3.5">
                      {notFit.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-[var(--text-muted)]" />
                          </span>
                          <span className="text-[var(--text-tertiary)] text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ASCII divider */}
        <ASCIIDivider text="FAQ" />

        {/* ----------------------------------------
            FREQUENTLY ASKED QUESTIONS
        ---------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                  {"// FREQUENTLY ASKED QUESTIONS"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  <TextScramble text="Common Questions" scrambleOnHover />
                </h2>
              </div>
            </FadeIn>

            <div className="max-w-3xl mx-auto">
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

        {/* ASCII divider */}
        <ASCIIDivider text="EXPLORE" />

        {/* ----------------------------------------
            EXPLORE OUR WORK — Internal Links (US-008)
        ---------------------------------------- */}
        <section className="py-16 md:py-24 bg-[var(--bg-secondary)]/30">
          <div className="container">
            <FadeIn>
              <span className="font-mono text-sm text-[var(--accent-primary)] block mb-4">
                {"// EXPLORE OUR WORK"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <TextScramble text="See the impact of your annotations" scrambleOnHover />
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
                Your work powers frontier AI. Explore how Claru delivers for the
                labs building the future.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Training Data Services",
                  href: "/data",
                  description:
                    "See how our annotators build datasets for frontier labs",
                },
                {
                  title: "Expert Labeling",
                  href: "/labeling",
                  description:
                    "RLHF, video annotation, and red teaming at scale",
                },
                {
                  title: "All Open Positions",
                  href: "/jobs",
                  description:
                    "Browse current opportunities across all categories",
                },
              ].map((card, index) => (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={card.href}
                    className="group block h-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-primary)]">
                      Learn more
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
