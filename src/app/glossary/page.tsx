import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";
import HashScrollHandler from "./HashScrollHandler";
import {
  glossaryTerms,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getTermsByCategory,
  type GlossaryTerm,
} from "@/data/glossary";
import { getAllGlossaryDeepSlugs } from "@/data/programmatic/glossary-deep/index";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "Physical AI & Robotics Training Data Glossary (2026) | Claru",
  description:
    "Definitions for 50+ physical AI and robotics training data terms: VLA models, egocentric video, sim-to-real gap, RLDS, Open X-Embodiment, and more. Maintained by Claru AI.",
  keywords: [
    "physical AI glossary",
    "robotics training data terms",
    "VLA model definition",
    "embodied AI glossary",
    "egocentric video definition",
    "sim-to-real gap",
    "imitation learning definition",
    "RLHF robotics",
    "Open X-Embodiment",
    "teleoperation data definition",
  ],
  openGraph: {
    title: "Physical AI & Robotics Training Data Glossary (2026)",
    description:
      "Definitions for 56 terms in physical AI, robotics training data, embodied AI, and VLA model development — maintained by Claru AI.",
    type: "article",
    url: "https://claru.ai/glossary",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Physical AI & Robotics Training Data Glossary — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physical AI & Robotics Training Data Glossary (2026) | Claru",
    description:
      "Definitions for 56 physical AI and robotics terms. VLA models, egocentric video, sim-to-real gap, Open X-Embodiment, and more.",
  },
  alternates: {
    canonical: "https://claru.ai/glossary",
  },
};

// =============================================================================
// JSON-LD Block 1: DefinedTermSet
// =============================================================================

const definedTermSetJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://claru.ai/glossary",
  name: "Physical AI & Robotics Training Data Glossary",
  description:
    "Definitions of key terms in physical AI, robotics training data, embodied AI, and VLA model development — maintained by Claru AI.",
  url: "https://claru.ai/glossary",
  inLanguage: "en",
  author: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
  },
  datePublished: "2026-04-02",
  dateModified: "2026-04-02",
  hasDefinedTerm: glossaryTerms.map((t) => ({
    "@id": `https://claru.ai/glossary#${t.slug}`,
  })),
};

// =============================================================================
// JSON-LD Block 2: ItemList of DefinedTerm objects
// =============================================================================

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: glossaryTerms.map((t, i) => ({
    "@type": "DefinedTerm",
    "@id": `https://claru.ai/glossary#${t.slug}`,
    position: i + 1,
    name: t.term,
    description: t.shortDefinition,
    inDefinedTermSet: "https://claru.ai/glossary",
    url: `https://claru.ai/glossary#${t.slug}`,
  })),
};

// =============================================================================
// JSON-LD Block 3: FAQPage (top 10 terms as Q&A)
// =============================================================================

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a VLA model?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A VLA model (Vision-Language-Action model) is a neural network that takes visual observations and natural language instructions as input and outputs robot actions. VLA models unify perception, language understanding, and motor control in a single architecture, allowing a robot to interpret commands like 'pick up the red cup' and produce the joint trajectories or end-effector poses required to execute them. Examples include RT-2, OpenVLA, pi-zero, and GR00T N1.",
      },
    },
    {
      "@type": "Question",
      name: "What is the sim-to-real gap in robotics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The sim-to-real gap refers to the performance degradation that occurs when a robot policy trained in simulation is deployed on physical hardware, caused by discrepancies between simulated and real-world visual appearance, physics, sensor noise, and actuator dynamics. Even photorealistic simulators produce textures, lighting, contact physics, and deformable object behavior that differ measurably from the real world. Bridging the sim-to-real gap requires domain randomization during simulation training, real-world fine-tuning data, or both in combination.",
      },
    },
    {
      "@type": "Question",
      name: "What is egocentric video used for in AI training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Egocentric video is first-person video captured from a camera mounted on or near a person's head, recording the world from the perspective of the agent performing a task. This viewpoint directly mirrors what a robot's on-board camera would see during operation, making egocentric video the most natural training signal for visuomotor policies and embodied AI. Key datasets include Ego4D (3,670 hours), EPIC-KITCHENS, and Claru's collection of 500K+ clips across 12+ environment types.",
      },
    },
    {
      "@type": "Question",
      name: "What is imitation learning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Imitation learning is a class of robot learning methods in which a policy is trained to replicate the behavior of an expert demonstrator, learning from observations of how a human or expert robot performs a task. The simplest form is behavioral cloning, which treats demonstration data as supervised learning. More advanced approaches like DAgger address the distributional shift problem that arises when the policy encounters states outside the demonstration distribution.",
      },
    },
    {
      "@type": "Question",
      name: "What is RLHF (Reinforcement Learning from Human Feedback)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RLHF is a training paradigm in which a reward model is trained on human preference annotations — judgments about which AI outputs are better — and then used to fine-tune a base model through reinforcement learning to produce outputs humans prefer. RLHF was central to the training of InstructGPT, ChatGPT, and Claude. In robotics, RLHF trains reward models that evaluate trajectory quality, enabling policies to improve from human evaluations of robot behavior.",
      },
    },
    {
      "@type": "Question",
      name: "What is a world model in AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A world model is a learned internal representation that allows an agent to simulate how its environment will evolve in response to its actions, without executing those actions in the real world. World models enable planning, counterfactual reasoning, and sample-efficient reinforcement learning. Training world models requires diverse real-world video that captures the causal structure of physical interactions — how objects move, deform, and respond to contact forces.",
      },
    },
    {
      "@type": "Question",
      name: "What is behavioral cloning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Behavioral cloning (BC) is the simplest form of imitation learning, treating demonstration data as a supervised learning problem: given an observation, predict the action the expert demonstrator took. A policy is trained by minimizing the difference between predicted and demonstrated actions across a dataset of (observation, action) pairs. BC suffers from compounding errors when the policy encounters states outside the demonstration distribution.",
      },
    },
    {
      "@type": "Question",
      name: "What is Open X-Embodiment (OXE)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open X-Embodiment (OXE) is a large-scale robot learning dataset released by Google DeepMind and collaborators in 2023, aggregating over 1 million robot trajectories from 22 different robot embodiments across 21 research institutions. OXE provides the broadest available collection of real-robot manipulation demonstrations and was used to train the RT-X family of models. OXE is publicly available but covers a limited set of robot platforms compared to what production robotics teams require.",
      },
    },
    {
      "@type": "Question",
      name: "What is teleoperation data in robotics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Teleoperation data consists of paired observation-action recordings captured while a human operator remotely controls a physical robot to complete tasks. The human drives the robot through VR controllers, exoskeletons, or leader-follower setups, and the system records both what the robot's cameras see and the exact joint positions, end-effector poses, and gripper states the human commands. This creates ground-truth action labels at the deployment embodiment.",
      },
    },
    {
      "@type": "Question",
      name: "What is diffusion policy in robotics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Diffusion Policy is a robot learning method that frames action prediction as a conditional denoising diffusion process: the policy generates action sequences by iteratively removing noise from a random sample, conditioned on the current visual observation. Diffusion models naturally represent multi-modal action distributions — situations where multiple different actions are all correct responses to the same observation — which standard regression-based behavioral cloning cannot capture.",
      },
    },
  ],
};

// =============================================================================
// BREADCRUMB JSON-LD
// =============================================================================

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://claru.ai",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Glossary",
      item: "https://claru.ai/glossary",
    },
  ],
};

// =============================================================================
// TERM CARD component (server)
// =============================================================================

const deepSlugs = new Set(getAllGlossaryDeepSlugs());

function TermCard({ term }: { term: GlossaryTerm }) {
  const hasDeepPage = deepSlugs.has(term.slug);
  return (
    <div
      id={term.slug}
      className="rounded-lg border border-white/10 bg-white/[0.03] p-6 scroll-mt-24"
    >
      {/* Term heading */}
      <h3 className="text-lg font-semibold text-white mb-3">{term.term}</h3>

      {/* Definition */}
      <p className="text-white/75 leading-relaxed text-sm mb-5">
        {term.shortDefinition}
      </p>

      {/* Deep page link */}
      {hasDeepPage && (
        <div className="mb-4">
          <Link
            href={`/glossary/${term.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
            style={{
              color: "#92B090",
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
            }}
          >
            Read full definition &rarr;
          </Link>
        </div>
      )}

      {/* Used in practice */}
      <div className="mb-4">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{
            fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Used in practice
        </span>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {term.usedIn.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs transition-colors hover:underline"
                style={{
                  color: "#92B090",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                {link.label} &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* See also */}
      {term.relatedTerms.length > 0 && (
        <div>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            See also
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {term.relatedTerms.map((slug) => {
              const related = glossaryTerms.find((t) => t.slug === slug);
              if (!related) return null;
              return (
                <a
                  key={slug}
                  href={`#${slug}`}
                  className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/50 transition-colors hover:border-white/25 hover:text-white/75"
                >
                  {related.term}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default function GlossaryPage() {
  const totalTerms = glossaryTerms.length;

  return (
    <>
      <HashScrollHandler />
      {/* JSON-LD: DefinedTermSet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(definedTermSetJsonLd),
        }}
      />
      {/* JSON-LD: ItemList of DefinedTerm objects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* SEO Shell — crawlable text for AI assistants */}
      <div className="sr-only">
        <h1>Physical AI &amp; Robotics Training Data Glossary</h1>
        <p>
          Definitions for {totalTerms} terms used in physical AI, robotics
          training data, embodied AI, and VLA model development. Maintained by
          Claru AI at claru.ai. Covers VLA models including OpenVLA, RT-2,
          pi-zero, and GR00T N1; data modalities including egocentric video,
          teleoperation data, manipulation trajectories, and depth data;
          annotation types including keypoint, temporal, action segmentation, and
          preference annotation; data quality pipelines including RLHF,
          deduplication, and inter-annotator agreement; computer vision
          fundamentals including optical flow, pose estimation, and SAM; and
          robotics fundamentals including sim-to-real gap, behavioral cloning,
          diffusion policy, and action chunking.
        </p>
        {CATEGORY_ORDER.map((cat) => (
          <section key={cat}>
            <h2>{CATEGORY_LABELS[cat]}</h2>
            {getTermsByCategory(cat).map((t) => (
              <article key={t.slug}>
                <h3>{t.term}</h3>
                <p>{t.shortDefinition}</p>
              </article>
            ))}
          </section>
        ))}
      </div>

      <GeoPageShell>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-5xl px-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily:
                    "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Glossary
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Physical AI &amp; Robotics Training Data Glossary
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              Definitions for ML engineers building robots, embodied agents,
              and world models.
            </p>

            <p
              className="mt-3 text-sm"
              style={{
                fontFamily:
                  "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                color: "#92B090",
              }}
            >
              {totalTerms} terms &mdash; last updated April 2026
            </p>
          </div>
        </section>

        {/* ── Category Nav ─────────────────────────────────────────────── */}
        <section className="w-full pb-10">
          <div className="mx-auto max-w-5xl px-6">
            <nav
              aria-label="Glossary categories"
              className="flex flex-wrap gap-2"
            >
              {CATEGORY_ORDER.map((cat) => (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  className="inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  style={{
                    fontFamily:
                      "var(--font-jetbrains, 'JetBrains Mono', monospace)",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* ── Glossary Content ─────────────────────────────────────────── */}
        <section className="w-full pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="space-y-20">
              {CATEGORY_ORDER.map((cat) => {
                const terms = getTermsByCategory(cat);
                return (
                  <div key={cat} id={`cat-${cat}`} className="scroll-mt-24">
                    {/* Category heading */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-white md:text-2xl">
                        {CATEGORY_LABELS[cat]}
                      </h2>
                      <div
                        className="mt-3 h-px w-full"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(146,176,144,0.4), transparent)",
                        }}
                      />
                    </div>

                    {/* Terms grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {terms.map((term) => (
                        <TermCard key={term.slug} term={term} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Related Resources ────────────────────────────────────────── */}
        <section className="w-full py-16 bg-white/[0.02]">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-xl font-semibold text-white md:text-2xl mb-8">
              Related Guides &amp; Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  href: "/vla-training-data-guide",
                  title: "VLA Training Data Guide",
                  desc: "Complete guide to Vision-Language-Action model training data.",
                },
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Types of data robots need and how to collect them.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video for embodied AI training.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Training data for robots, drones, and autonomous agents.",
                },
                {
                  href: "/blog/data-enrichment-pipeline-physical-ai",
                  title: "Data Enrichment Pipeline",
                  desc: "How raw video becomes training-ready physical AI data.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div>
                    <div
                      className="text-sm font-medium group-hover:underline"
                      style={{ color: "#92B090" }}
                    >
                      {link.title}
                    </div>
                    <div className="text-xs text-white/50 mt-1">{link.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Building a Physical AI System?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Claru provides the egocentric video, manipulation trajectories,
              and annotation layers that the terms in this glossary describe.
              Tell us what your model needs to learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/data-catalog"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium border border-white/20 text-white transition-colors hover:bg-white/5"
              >
                Browse the Data Catalog
              </Link>
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
