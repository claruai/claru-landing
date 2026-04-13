import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "VLA Training Data Guide: Datasets, Providers & Pipelines (2026)",
  description:
    "How to source, structure, and enrich VLA training data for OpenVLA, RT-2, pi-zero, and GR00T. Covers open datasets, commercial providers, and production pipelines.",
  keywords: [
    "VLA training data",
    "vision-language-action datasets",
    "OpenVLA training data",
    "VLA data provider",
    "vision language action model data",
    "robot foundation model training data",
    "RT-2 training data",
    "pi-zero training data",
    "GR00T training data",
    "Open X-Embodiment dataset",
    "BridgeData V2",
    "DROID dataset",
    "robotics training data",
    "egocentric video for VLA",
  ],
  openGraph: {
    title: "VLA Training Data: The Complete Guide (2026)",
    description:
      "Everything robotics teams need to know about Vision-Language-Action training data. Covers OpenVLA, RT-2, pi-zero, GR00T N1, open datasets, and data gaps.",
    type: "article",
    url: "https://claru.ai/vla-training-data-guide",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "VLA Training Data: The Complete Guide (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VLA Training Data: The Complete Guide (2026) | Claru",
    description:
      "Everything robotics teams need to know about Vision-Language-Action training data. Covers OpenVLA, RT-2, pi-zero, GR00T N1, and open datasets.",
  },
  alternates: {
    canonical: "https://claru.ai/vla-training-data-guide",
  },
};

// =============================================================================
// JSON-LD: Article
// =============================================================================

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "VLA Training Data: The Complete Guide (2026)",
  description:
    "Everything robotics teams need to know about Vision-Language-Action (VLA) training data. Covers OpenVLA, RT-2, pi-zero, GR00T N1, open datasets, data gaps, and how to build production-ready VLA datasets.",
  author: {
    "@type": "Person",
    name: "John Thomas",
    url: "https://www.linkedin.com/in/jonkthomas",
    jobTitle: "Co-founder, Claru AI",
    worksFor: {
      "@type": "Organization",
      name: "Claru AI",
      url: "https://claru.ai",
    },
  },
  publisher: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://claru.ai/images/og-v2.webp",
    },
  },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  mainEntityOfPage: "https://claru.ai/vla-training-data-guide",
  image: "https://claru.ai/images/og-v2.webp",
};

// =============================================================================
// JSON-LD: BreadcrumbList
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
      name: "VLA Training Data Guide",
      item: "https://claru.ai/vla-training-data-guide",
    },
  ],
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "What is VLA training data?",
    answer:
      "VLA training data consists of synchronized triplets of visual observations (RGB images or video frames), natural language instructions (e.g., 'pick up the red cup'), and action trajectories (end-effector poses, joint angles, or gripper states). Each data point teaches a Vision-Language-Action model to map what the robot sees and the instruction it receives to the physical actions it should execute. The data is typically collected through human teleoperation of robots or from egocentric video of humans performing tasks, then converted to the robot's action space.",
  },
  {
    question: "How much training data does a VLA model need?",
    answer:
      "The amount depends on the approach. Pretraining a general-purpose VLA like OpenVLA used approximately 970,000 trajectories from the Open X-Embodiment dataset across 22 different robot embodiments. Fine-tuning a pretrained VLA for a specific task can require as few as 50 to 200 demonstrations for simple pick-and-place tasks, or 5,000 to 50,000 demonstrations for complex dexterous manipulation. The key insight from 2025-2026 research is that data diversity matters more than raw volume: 1,000 demonstrations across 50 environments outperform 5,000 demonstrations in a single environment.",
  },
  {
    question: "What is the Open X-Embodiment dataset?",
    answer:
      "Open X-Embodiment (OXE) is a collaborative dataset aggregating over one million robot manipulation trajectories from 22 different robot embodiments across 21 research institutions. Created by Google DeepMind and collaborators, it provides the largest open-source collection of cross-embodiment robot data in RLDS format. OpenVLA was pretrained on a curated subset called 'Magic Soup++' containing approximately 970,000 trajectories. OXE includes data from platforms like Franka Emika, UR5, Google Robot, and others, making it the standard pretraining dataset for VLA research.",
  },
  {
    question: "What are the key open-source VLA datasets available?",
    answer:
      "The major open-source VLA datasets include Open X-Embodiment (1M+ trajectories, 22 embodiments), BridgeData V2 (60,096 trajectories on a WidowX-250 arm across 24 environments), DROID (76,000 trajectories from 564 scenes on Franka robots), and RH20T (110,000 episodes across 147 tasks from 20 robots). Academic datasets like Ego4D (3,670 hours of egocentric video) and Ego-Exo4D provide human demonstration data that can be used for VLA pretraining. However, all open datasets have significant gaps: limited environment diversity, narrow task coverage, and insufficient action label granularity for production deployment.",
  },
  {
    question: "What is the difference between VLA and VLM models?",
    answer:
      "A Vision-Language Model (VLM) like GPT-4o or PaliGemma processes images and text to produce text outputs. It can describe what it sees and answer questions but cannot control a robot. A Vision-Language-Action (VLA) model extends a VLM by adding action generation: it takes the same visual and language inputs but outputs continuous robot actions (joint positions, end-effector poses, gripper commands) that directly control hardware. VLAs typically use a pretrained VLM as the backbone and add an action head, trained on robot demonstration data, that converts the VLM's representations into physical motor commands.",
  },
  {
    question: "How does Claru provide VLA training data?",
    answer:
      "Claru provides VLA training data through three channels. First, egocentric video capture: 10,000+ contributors worldwide wear cameras during real-world tasks, producing first-person video that mirrors robot head-camera viewpoints. Each clip is enriched with depth maps, pose estimation, segmentation masks, and action labels. Second, managed teleoperation: Claru coordinates robot demonstration collection on client hardware with trained operators following structured task protocols. Third, custom annotation: Claru's annotators add natural language instruction labels, action boundary annotations, and object affordance labels that turn raw demonstrations into complete VLA training triplets. All data is delivered in RLDS, WebDataset, or custom formats.",
  },
  {
    question: "What format should VLA training data be in?",
    answer:
      "The standard format for VLA training data is RLDS (Reinforcement Learning Datasets), which stores episodes as sequences of timesteps containing observations (images, proprioception), actions (joint positions, end-effector deltas), language instructions, and metadata. OpenVLA, Octo, and most open-source VLA frameworks expect RLDS format. Alternative formats include WebDataset (for streaming large-scale training), HDF5 (for dense numerical trajectories), and LeRobot's format (Parquet metadata with video files). Claru delivers in any of these formats and provides conversion utilities for custom pipeline integration.",
  },
  {
    question: "Can human video be used to train VLA models?",
    answer:
      "Yes, and this is an active area of research in 2026. NVIDIA's EgoScale showed that pretraining on 20,000+ hours of egocentric human video improved downstream robot task success rates by 54% compared to training from scratch. EgoMimic demonstrated that co-training on human hand demonstrations alongside robot data improves manipulation performance, and that one hour of additional human data is more valuable than one hour of additional robot data. The key challenge is the embodiment gap: human hands have different kinematics than robot grippers, so the models must learn to transfer affordance and intent understanding rather than directly copying joint trajectories.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// =============================================================================
// PAGE
// =============================================================================

export default function VLATrainingDataGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <GeoPageShell>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-sm"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily:
                    "var(--font-mono, 'JetBrains Mono', monospace)",
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
                  VLA Training Data Guide
                </li>
              </ol>
            </nav>

            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#92B090" }}
            >
              Last updated: March 2026
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              VLA Training Data: The Complete Guide (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Vision-Language-Action models are redefining how robots learn.
              This guide covers every VLA architecture that matters, the
              datasets they train on, the gaps in publicly available data,
              and how teams building production robotics systems source the
              training data their models need.
            </p>
          </div>
        </section>

        {/* ── Table of Contents ─────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                In This Guide
              </h2>
              <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
                <li>
                  <a href="#what-are-vla-models" className="hover:text-white transition-colors">
                    What Are VLA Models?
                  </a>
                </li>
                <li>
                  <a href="#major-vla-architectures" className="hover:text-white transition-colors">
                    Major VLA Architectures: OpenVLA, RT-2, pi-zero, GR00T N1
                  </a>
                </li>
                <li>
                  <a href="#data-requirements" className="hover:text-white transition-colors">
                    VLA Training Data Requirements
                  </a>
                </li>
                <li>
                  <a href="#open-datasets" className="hover:text-white transition-colors">
                    Open Datasets for VLA Training
                  </a>
                </li>
                <li>
                  <a href="#dataset-gaps" className="hover:text-white transition-colors">
                    Where Open Datasets Fall Short
                  </a>
                </li>
                <li>
                  <a href="#human-video" className="hover:text-white transition-colors">
                    Using Human Video for VLA Pretraining
                  </a>
                </li>
                <li>
                  <a href="#enrichment" className="hover:text-white transition-colors">
                    Data Enrichment for VLA Pipelines
                  </a>
                </li>
                <li>
                  <a href="#how-claru-helps" className="hover:text-white transition-colors">
                    How Claru Fills the Gaps
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── What Are VLA Models? ─────────────────────────────────── */}
        <section id="what-are-vla-models" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Are Vision-Language-Action Models?
            </h2>

            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                A Vision-Language-Action (VLA) model is a{" "}
                <strong className="text-white">
                  multimodal foundation model that takes visual observations
                  and natural language instructions as input and outputs
                  physical robot actions
                </strong>
                . Unlike a standard vision-language model (VLM) such as{" "}
                <a
                  href="https://en.wikipedia.org/wiki/GPT-4o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  GPT-4o
                </a>{" "}
                or PaliGemma that outputs text, a VLA outputs continuous
                motor commands: joint positions, end-effector poses, and
                gripper states that directly control hardware.
              </p>

              <p>
                The core idea is simple: take the rich perceptual and
                reasoning capabilities of large pretrained VLMs and extend
                them to produce actions. During training, the model sees
                triplets of{" "}
                <code className="text-sm px-1.5 py-0.5 rounded bg-white/10 font-mono">
                  (image, language_instruction, action_trajectory)
                </code>{" "}
                and learns to map what the robot sees and the task
                description to the physical movements needed to complete it.
              </p>

              <p>
                This architecture has driven a rapid shift in{" "}
                <Link
                  href="/training-data-for-robotics"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  robotics research
                </Link>
                . At ICLR 2026, there were{" "}
                <a
                  href="https://mbreuss.github.io/blog_post_iclr_26_vla.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  164 VLA-related submissions
                </a>
                , covering discrete diffusion VLAs, reasoning-augmented
                models, and novel benchmark designs. VLAs are now the
                dominant architecture for generalist robot manipulation.
              </p>

              <p>
                But every VLA model is only as good as its training data.
                The model architecture is increasingly commoditized &mdash;
                what separates production-grade systems from demo videos is
                the quality, diversity, and scale of the{" "}
                <Link
                  href="/physical-ai-training-data"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  physical AI training data
                </Link>{" "}
                behind them.
              </p>
            </div>
          </div>
        </section>

        {/* ── Major VLA Architectures ──────────────────────────────── */}
        <section
          id="major-vla-architectures"
          className="w-full py-16 md:py-24 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Major VLA Architectures and Their Data Needs
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Four VLA architectures define the current landscape. Each has
              distinct data requirements shaped by its design choices.
            </p>

            <div className="space-y-12">
              {/* OpenVLA */}
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-1">
                  OpenVLA (Stanford, 2024)
                </h3>
                <p className="text-sm text-white/50 mb-4 font-mono">
                  7B params &middot; Open-source &middot; RLDS format
                </p>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    <a
                      href="https://github.com/openvla/openvla"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      OpenVLA
                    </a>{" "}
                    is the most widely adopted open-source VLA. Built on a
                    fused DINOv2 + SigLIP vision backbone and Llama-2 LLM,
                    it was pretrained on approximately{" "}
                    <strong className="text-white">
                      970,000 trajectories
                    </strong>{" "}
                    from the Open X-Embodiment dataset (the &ldquo;Magic
                    Soup++&rdquo; mixture). Actions are tokenized as text
                    and trained alongside vision-language data.
                  </p>
                  <p>
                    <strong className="text-white">Data requirements:</strong>{" "}
                    RLDS format. Supports arbitrary dataset mixtures via
                    configurable mixture weights. Fine-tuning on a new task
                    requires as few as 50&ndash;200 demonstrations for
                    simple manipulation, though diverse environments improve
                    generalization substantially. LoRA fine-tuning is
                    supported for compute-efficient adaptation. The team
                    experimented with including the DROID dataset but found
                    action token accuracy remained low, suggesting that
                    highly diverse datasets need either larger mixture
                    weights or bigger models.
                  </p>
                </div>
              </div>

              {/* RT-2 */}
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-1">
                  RT-2 (Google DeepMind, 2023)
                </h3>
                <p className="text-sm text-white/50 mb-4 font-mono">
                  55B params &middot; Closed-source &middot; Tokenized
                  actions
                </p>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    <a
                      href="https://robotics-transformer2.github.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      RT-2
                    </a>{" "}
                    pioneered the concept of casting robot actions as text
                    tokens, training jointly on web-scale vision-language
                    data and robot demonstration data collected from 13
                    robots over 17 months in an office kitchen environment.
                    This co-training lets the model transfer
                    internet-scale knowledge to physical manipulation.
                  </p>
                  <p>
                    <strong className="text-white">Key result:</strong> RT-2
                    improved performance on unseen scenarios from 32%
                    (RT-1) to 62%, demonstrating that VLM pretraining
                    transfers directly to manipulation generalization. It
                    also showed emergent reasoning: following instructions
                    like &ldquo;pick up the object that is not a
                    fruit&rdquo; without those concepts appearing in the
                    robot training data.
                  </p>
                </div>
              </div>

              {/* pi-zero */}
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-1">
                  pi-zero (Physical Intelligence, 2024)
                </h3>
                <p className="text-sm text-white/50 mb-4 font-mono">
                  ~3B params &middot; Closed-source &middot; Flow Matching
                  actions
                </p>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    <a
                      href="https://www.physicalintelligence.company/blog/pi0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      pi-zero
                    </a>{" "}
                    takes a different approach to action generation. Instead
                    of tokenizing actions as text, it uses{" "}
                    <strong className="text-white">
                      Conditional Flow Matching
                    </strong>{" "}
                    via a dedicated Action Expert (~300M parameters) to
                    generate continuous action sequences. The VLM backbone
                    (PaliGemma) handles perception and language, while the
                    Action Expert handles the continuous nature of robot
                    control.
                  </p>
                  <p>
                    <strong className="text-white">Data requirements:</strong>{" "}
                    Pi-zero uses block-wise causal attention masks to
                    prevent robotics-specific inputs from overwriting the
                    VLM&apos;s pretrained knowledge. This design means the
                    model can use web-scale VLM pretraining while
                    training the Action Expert on more modest volumes of
                    robot demonstration data &mdash; but the demonstrations
                    must be high-quality, with precise action labels at
                    sub-second temporal resolution.
                  </p>
                </div>
              </div>

              {/* GR00T N1 */}
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-1">
                  GR00T N1 (NVIDIA, 2025)
                </h3>
                <p className="text-sm text-white/50 mb-4 font-mono">
                  2.2B params &middot; Open-weight &middot; Diffusion
                  Transformer
                </p>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    <a
                      href="https://arxiv.org/html/2503.14734v1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      GR00T N1
                    </a>{" "}
                    is NVIDIA&apos;s open foundation model for generalist
                    humanoid robots, built with a dual-system design.
                    System 2 is an Eagle-2 VLM that interprets visual
                    scenes and language instructions. System 1 is a
                    Diffusion Transformer that generates smooth motor
                    actions at 120 Hz by denoising action sequences.
                  </p>
                  <p>
                    <strong className="text-white">Data requirements:</strong>{" "}
                    GR00T N1 is trained on a heterogeneous mixture of
                    real-robot trajectories, human videos, and synthetic
                    data generated through NVIDIA&apos;s DreamGen pipeline.
                    It supports cross-embodiment transfer from tabletop
                    arms to dexterous humanoid robots. The synthetic data
                    pipeline uses world foundation models to generate
                    diverse robot trajectory data, reducing the need for
                    expensive real-world collection &mdash; but
                    real-world fine-tuning data remains essential for
                    deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Data Requirements ────────────────────────────────────── */}
        <section id="data-requirements" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              VLA Training Data Requirements
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Every VLA training pipeline consumes data in three modalities
              that must be tightly synchronized. Understanding these
              requirements is essential for building datasets that actually
              improve model performance.
            </p>

            <div className="space-y-10">
              {/* Visual observations */}
              <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  1. Visual Observations
                </h3>
                <div className="space-y-3 text-white/70 leading-relaxed">
                  <p>
                    RGB images or video frames from the robot&apos;s cameras.
                    Most VLAs use a single egocentric (head or wrist) camera,
                    though GR00T N1 and some research models support
                    multi-view inputs. Resolution typically ranges from
                    224x224 (OpenVLA default) to 512x512 for detail-sensitive
                    tasks.
                  </p>
                  <p>
                    The visual data must capture the{" "}
                    <strong className="text-white">
                      true deployment distribution
                    </strong>
                    : real lighting conditions, real clutter, real surface
                    textures. Models trained on sterile lab environments with
                    uniform backgrounds fail when deployed in kitchens,
                    warehouses, or outdoor settings. This is why{" "}
                    <Link
                      href="/egocentric-video-datasets"
                      className="underline underline-offset-2"
                      style={{ color: "#92B090" }}
                    >
                      egocentric video datasets
                    </Link>{" "}
                    captured in diverse real-world settings are so valuable
                    for VLA pretraining.
                  </p>
                </div>
              </div>

              {/* Language instructions */}
              <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  2. Natural Language Instructions
                </h3>
                <div className="space-y-3 text-white/70 leading-relaxed">
                  <p>
                    Task descriptions that tell the robot what to do:
                    &ldquo;pick up the red cup and place it on the
                    shelf,&rdquo; &ldquo;fold the towel in half,&rdquo;
                    &ldquo;open the drawer.&rdquo; Instructions must be
                    paired with each demonstration trajectory.
                  </p>
                  <p>
                    Effective VLA training requires instruction diversity:
                    paraphrases of the same task (&ldquo;grab the mug&rdquo;
                    vs. &ldquo;pick up the cup&rdquo;), varying levels of
                    specificity (&ldquo;clean up&rdquo; vs. &ldquo;place
                    the dishes in the sink&rdquo;), and compositional
                    instructions that combine multiple sub-tasks. Many open
                    datasets have thin instruction coverage &mdash; a single
                    template per task &mdash; which limits the language
                    grounding of the resulting model.
                  </p>
                </div>
              </div>

              {/* Action trajectories */}
              <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  3. Action Trajectories
                </h3>
                <div className="space-y-3 text-white/70 leading-relaxed">
                  <p>
                    The sequence of motor commands the robot should execute,
                    synchronized frame-by-frame with the visual observations.
                    Actions are typically represented as 7-dimensional
                    vectors: 3D end-effector position (x, y, z), 3D
                    orientation (roll, pitch, yaw), and gripper state
                    (open/close). Some models use joint-space actions (6-7
                    joint angles) instead.
                  </p>
                  <p>
                    Temporal alignment is critical. Actions must be
                    synchronized with visual observations at the control
                    frequency of the target robot &mdash; typically 10-50 Hz
                    for manipulation tasks, up to 120 Hz for GR00T N1&apos;s
                    Diffusion Transformer. Misaligned timestamps, even by
                    50ms, can teach the model incorrect visuomotor
                    correlations.
                  </p>
                </div>
              </div>

              {/* Data scale */}
              <div className="border-l-2 pl-6" style={{ borderColor: "rgba(146,176,144,0.4)" }}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  4. Scale Requirements
                </h3>
                <div className="space-y-3 text-white/70 leading-relaxed">
                  <p>
                    Scale requirements vary dramatically by use case:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong className="text-white">
                        General-purpose pretraining:
                      </strong>{" "}
                      500K&ndash;1M+ trajectories across many embodiments
                      (OpenVLA used 970K)
                    </li>
                    <li>
                      <strong className="text-white">
                        Task-specific fine-tuning:
                      </strong>{" "}
                      50&ndash;50,000 demonstrations depending on task
                      complexity and diversity
                    </li>
                    <li>
                      <strong className="text-white">
                        LoRA fine-tuning:
                      </strong>{" "}
                      Can be effective with 5,000&ndash;50,000 examples at
                      compute costs of $100&ndash;$5,000
                    </li>
                    <li>
                      <strong className="text-white">
                        Cross-embodiment training:
                      </strong>{" "}
                      Reduces per-embodiment data needs by up to 90% but
                      requires careful mixture weighting
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Open Datasets ────────────────────────────────────────── */}
        <section
          id="open-datasets"
          className="w-full py-16 md:py-24 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Open Datasets for VLA Training
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              The open-source VLA ecosystem has coalesced around a handful
              of foundational datasets. Here is what is available, what each
              provides, and where the coverage ends.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Dataset
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Scale
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Embodiments
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Strengths
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50">
                      Limitations
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      <a
                        href="https://robotics-transformer-x.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: "#92B090" }}
                      >
                        Open X-Embodiment
                      </a>
                    </td>
                    <td className="px-4 py-3">1M+ trajectories</td>
                    <td className="px-4 py-3">22 robot types</td>
                    <td className="px-4 py-3">
                      Largest cross-embodiment collection; RLDS format;
                      standard for VLA pretraining
                    </td>
                    <td className="px-4 py-3">
                      Lab environments only; uneven quality across
                      sub-datasets; limited language instruction diversity
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      <a
                        href="https://rail-berkeley.github.io/bridgedata/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: "#92B090" }}
                      >
                        BridgeData V2
                      </a>
                    </td>
                    <td className="px-4 py-3">60,096 trajectories</td>
                    <td className="px-4 py-3">WidowX-250</td>
                    <td className="px-4 py-3">
                      24 environments; diverse objects; well-curated;
                      common fine-tuning benchmark
                    </td>
                    <td className="px-4 py-3">
                      Single low-cost arm; tabletop only; no mobile
                      manipulation or humanoid data
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      <a
                        href="https://droid-dataset.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: "#92B090" }}
                      >
                        DROID
                      </a>
                    </td>
                    <td className="px-4 py-3">76,000 trajectories</td>
                    <td className="px-4 py-3">Franka Emika</td>
                    <td className="px-4 py-3">
                      564 scenes; 86 tasks; high scene diversity for a
                      single-embodiment dataset
                    </td>
                    <td className="px-4 py-3">
                      So diverse that VLAs struggle to fit it (OpenVLA
                      removed it from final training); Franka-only
                    </td>
                  </tr>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      RH20T
                    </td>
                    <td className="px-4 py-3">110,000 episodes</td>
                    <td className="px-4 py-3">20 robot types</td>
                    <td className="px-4 py-3">
                      147 tasks; strong task diversity; multi-embodiment
                    </td>
                    <td className="px-4 py-3">
                      Collected primarily in Chinese labs; limited
                      environment diversity outside research settings
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      <a
                        href="https://ego4d-data.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: "#92B090" }}
                      >
                        Ego4D
                      </a>
                    </td>
                    <td className="px-4 py-3">3,670 hours video</td>
                    <td className="px-4 py-3">Human (wearable cameras)</td>
                    <td className="px-4 py-3">
                      Massive scale; diverse environments; 74 locations
                      across 9 countries
                    </td>
                    <td className="px-4 py-3">
                      No robot actions; requires retargeting to convert
                      human demonstrations to robot control
                    </td>
                  </tr>
                  <tr className="bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      Ego-Exo4D
                    </td>
                    <td className="px-4 py-3">Synchronized multi-view</td>
                    <td className="px-4 py-3">Human (Aria glasses + external)</td>
                    <td className="px-4 py-3">
                      Paired ego + exo views; rich activity data; 15
                      university partners
                    </td>
                    <td className="px-4 py-3">
                      Academic access only; no robot actions; focused on
                      activity recognition rather than manipulation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Where Open Datasets Fall Short ──────────────────────── */}
        <section id="dataset-gaps" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Where Open Datasets Fall Short
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Open datasets are invaluable for research but consistently
              fail to meet the requirements of production VLA deployment.
              Here are the five recurring gaps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Environment Diversity",
                  description:
                    "Nearly all open robot datasets are collected in university labs with controlled lighting, clean surfaces, and limited object sets. Real deployment environments — homes, warehouses, hospitals, outdoor spaces — have uncontrolled lighting, clutter, reflective and transparent surfaces, and thousands of novel object categories. Models trained on lab data systematically fail when encountering these conditions.",
                },
                {
                  title: "Action Label Granularity",
                  description:
                    "Most open datasets record end-effector poses at 10-30 Hz. Production VLAs operating at 50-120 Hz need higher temporal resolution. Additionally, many datasets lack gripper force data, contact events, and fine-grained manipulation phase labels (approach, pre-grasp, grasp, lift, transport, place) that are critical for dexterous tasks.",
                },
                {
                  title: "Language Instruction Quality",
                  description:
                    "Open datasets typically use a single template instruction per task (e.g., 'pick up the blue block'). Production VLAs need rich instruction diversity: paraphrases, varying specificity levels, compositional multi-step instructions, and corrections. This language coverage is expensive to annotate and almost entirely missing from open data.",
                },
                {
                  title: "Enrichment Layers",
                  description:
                    "Raw robot demonstrations lack the enrichment layers that accelerate VLA training: per-frame depth maps, semantic segmentation masks, hand-object interaction labels, and 3D scene reconstructions. Teams must build expensive enrichment pipelines in-house or work with providers like Claru that deliver pre-enriched data.",
                },
                {
                  title: "Licensing and Compliance",
                  description:
                    "Many open datasets have restrictive academic licenses (non-commercial use only) or unclear provenance. Ego4D requires a 48-hour license approval. BridgeData V2's OXE version is outdated. Companies building commercial robotics products need data with clear commercial licenses and documented collection consent — something open datasets rarely guarantee.",
                },
              ].map((gap) => (
                <div
                  key={gap.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {gap.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Human Video for VLA Pretraining ─────────────────────── */}
        <section
          id="human-video"
          className="w-full py-16 md:py-24 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Using Human Video for VLA Pretraining
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              A breakthrough research direction in 2025-2026 has been
              pretraining VLAs on egocentric human video, then fine-tuning
              on robot data. This dramatically reduces the amount of
              expensive robot demonstration data needed.
            </p>

            <div className="space-y-6 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">
                  NVIDIA&apos;s EgoScale (2025)
                </strong>{" "}
                trained a VLA on over 20,000 hours of action-labeled{" "}
                <Link
                  href="/egocentric-video-datasets"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  egocentric human video
                </Link>{" "}
                &mdash; more than 20x larger than any prior effort. The
                results were striking: a{" "}
                <strong className="text-white">
                  log-linear scaling law
                </strong>{" "}
                between human data scale and validation loss, and a 54%
                improvement in average success rate over a no-pretraining
                baseline for a 22-DoF robotic hand performing dexterous
                manipulation.
              </p>

              <p>
                <strong className="text-white">EgoMimic</strong> from the
                same period showed that co-training on human hand
                demonstrations alongside robot data &mdash; using Project
                Aria glasses and a bimanual manipulator &mdash; consistently
                outperforms robot-only training. Their key finding:{" "}
                <strong className="text-white">
                  one hour of additional human data is more valuable than
                  one hour of additional robot data
                </strong>
                .
              </p>

              <p>
                These results have significant implications for VLA data
                strategy. Rather than collecting all data through expensive
                robot teleoperation, teams can:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Pretrain on large-scale egocentric human video with action
                  labels, depth maps, and pose estimation
                </li>
                <li>
                  Fine-tune on targeted robot demonstrations collected on
                  the deployment hardware
                </li>
                <li>
                  Achieve better generalization with significantly less
                  robot data
                </li>
              </ol>

              <p>
                This is precisely where Claru&apos;s{" "}
                <Link
                  href="/data-catalog"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  500K+ enriched egocentric video clips
                </Link>{" "}
                become relevant. Each clip comes pre-enriched with the
                annotation layers VLA pretraining needs: depth maps, human
                pose estimation, semantic segmentation, and action labels.
              </p>
            </div>
          </div>
        </section>

        {/* ── Data Enrichment for VLA ─────────────────────────────── */}
        <section id="enrichment" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Data Enrichment for VLA Pipelines
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Raw video &mdash; whether from humans or robots &mdash; is
              not sufficient for VLA training. The models need structured
              annotation layers that provide supervisory signals beyond
              raw pixels.
            </p>

            <div className="space-y-8">
              {[
                {
                  layer: "Depth Maps",
                  model: "Depth Anything V2",
                  description:
                    "Per-frame monocular depth estimation provides the 3D spatial understanding VLAs need to plan reach and grasp actions. Depth Anything V2, published at NeurIPS 2024, offers depth estimation from 25M to 1.3B parameters, and has been evaluated as a LiDAR alternative for robotic depth sensing with 89.1% of near-field errors within 0.5m.",
                  link: "/blog/data-enrichment-pipeline-physical-ai",
                },
                {
                  layer: "Pose Estimation",
                  model: "ViTPose / ViTPose++",
                  description:
                    "2D and 3D human body and hand joint positions are critical for human-to-robot transfer learning. ViTPose achieves 81.1 AP on COCO with models scaling from 100M to 1B parameters, while ViTPose++ extends to animal and whole-body pose estimation via task-specific MoE heads.",
                  link: "/blog/data-enrichment-pipeline-physical-ai",
                },
                {
                  layer: "Semantic Segmentation",
                  model: "SAM 3",
                  description:
                    "Object-level and part-level segmentation masks let VLAs understand scene structure and object affordances. SAM 3, published at ICLR 2026, extends promptable segmentation to concept-based prompts (short noun phrases or image exemplars) across images and video, unifying detection, segmentation, and tracking.",
                  link: "/blog/data-enrichment-pipeline-physical-ai",
                },
                {
                  layer: "Optical Flow",
                  model: "RAFT",
                  description:
                    "Dense motion fields between consecutive frames provide explicit motion information that helps VLAs predict object dynamics and plan interaction trajectories. RAFT remains the standard optical flow backbone, with recent work combining RAFT outputs with SAM segmentation for motion-aware scene understanding.",
                  link: "/blog/data-enrichment-pipeline-physical-ai",
                },
                {
                  layer: "Action Labels",
                  model: "Human annotation + InternVideo2",
                  description:
                    "Temporal action segmentation marks the boundaries between discrete manipulation phases: approach, pre-grasp, grasp, lift, transport, place. These labels are essential for training VLAs to decompose complex tasks into executable sub-actions. Automated systems like InternVideo2 provide initial labels, refined by expert human annotators.",
                  link: "/blog/data-enrichment-pipeline-physical-ai",
                },
              ].map((item) => (
                <div key={item.layer} className="flex gap-6">
                  <div
                    className="flex-none w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(146,176,144,0.15)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#92B090"
                      strokeWidth={1.5}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.layer}
                    </h3>
                    <p className="text-xs font-mono text-white/40 mb-2">
                      {item.model}
                    </p>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                    <Link
                      href={item.link}
                      className="inline-block mt-2 text-sm font-medium transition-colors"
                      style={{ color: "#92B090" }}
                    >
                      Deep dive: enrichment pipeline &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How Claru Fills the Gaps ────────────────────────────── */}
        <section
          id="how-claru-helps"
          className="w-full py-16 md:py-24 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              How Claru Fills the VLA Data Gaps
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Claru is built specifically for the data needs of VLA and{" "}
              <Link
                href="/physical-ai-training-data"
                className="underline underline-offset-2"
                style={{ color: "#92B090" }}
              >
                physical AI
              </Link>{" "}
              teams. Here is what we deliver that open datasets do not.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Real-World Environment Diversity",
                  description:
                    "500K+ egocentric video clips captured across 100+ cities in kitchens, workshops, warehouses, retail spaces, and outdoor environments. Every clip is real-world, licensed, and consented — not lab footage, not synthetic, not scraped.",
                },
                {
                  title: "Pre-Enriched by Default",
                  description:
                    "Every clip ships with depth maps (Depth Anything V2), pose estimation (ViTPose), semantic segmentation (SAM), optical flow, and AI-generated captions. No enrichment pipeline to build. No months of engineering time before training can start.",
                },
                {
                  title: "Expert Action Annotation",
                  description:
                    "Human annotators label what automated systems miss: temporal action boundaries, object affordances, grasp types, intent labels, and natural language instruction paraphrases. 4M+ completed human annotations and growing.",
                },
                {
                  title: "Your Format, Your Timeline",
                  description:
                    "Data delivered in RLDS, WebDataset, HDF5, Parquet, or custom formats — compatible with OpenVLA, Octo, LeRobot, and proprietary VLA pipelines. Brief to first delivery in days, not months. Direct S3/GCS delivery or API access.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: "500K+", label: "Egocentric clips" },
                { stat: "4M+", label: "Human annotations" },
                { stat: "10,000+", label: "Global contributors" },
                { stat: "100+", label: "Licensed datasets" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center"
                >
                  <div
                    className="text-2xl md:text-3xl font-bold font-mono"
                    style={{ color: "#92B090" }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              {faqItems.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-white/10 pb-8 last:border-none"
                >
                  <h3 className="text-lg font-medium text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning and manipulation.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics.",
                },
                {
                  href: "/egocentric-video-data",
                  title: "Egocentric Video Data for Physical AI",
                  desc: "20+ environments, hand detection, depth maps, sample packs from $500.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video data for robot perception and VLA pretraining.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Datasets for robots that navigate and interact with the physical world.",
                },
                {
                  href: "/blog/best-egocentric-data-providers",
                  title: "Best Egocentric Data Providers (2026)",
                  desc: "Comparison of 7 providers for egocentric video data.",
                },
                {
                  href: "/blog/data-enrichment-pipeline-physical-ai",
                  title: "Data Enrichment for Physical AI",
                  desc: "Depth, pose, segmentation, and action labeling at scale.",
                },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore Claru's 100+ licensed datasets with live previews.",
                },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs. Luel",
                  desc: "Side-by-side comparison of enriched data vs. marketplace speed.",
                },
                {
                  href: "/solutions/vla-training-data",
                  title: "VLA Training Data Solutions",
                  desc: "Custom VLA data collection with action labels and sub-16ms alignment.",
                },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "Enterprise labeling vs. specialist physical AI data services.",
                },
                {
                  href: "/case-studies",
                  title: "Case Studies",
                  desc: "Real-world data projects delivered for frontier AI labs.",
                },
                {
                  href: "/about",
                  title: "About Claru",
                  desc: "Meet the team building physical AI data infrastructure.",
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
                    <div className="text-xs text-white/50 mt-1">
                      {link.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Ready to Build Your VLA Training Dataset?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your model needs to learn. We&apos;ll scope the
              dataset, define collection and enrichment protocols, and
              deliver training-ready VLA data in your format.
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
                Get Started
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
