import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "VLM vs VLA: What's the Actual Difference? (2026) | Claru",
  description:
    "RT-2, OpenVLA, pi-zero, and GR00T N1 are all called VLAs — but the term is often confused with VLM. The difference comes down to data: VLMs need image-text pairs; VLAs need observation-action-instruction triplets.",
  keywords: [
    "VLM vs VLA",
    "vision language model vs vision language action model",
    "VLM vs VLA difference",
    "what is a VLA model",
    "what is a VLM",
    "RT-2 VLM or VLA",
    "OpenVLA architecture",
    "VLA training data requirements",
    "vision language action model explained",
    "VLM VLA comparison 2026",
  ],
  openGraph: {
    title: "VLM vs VLA: What's the Actual Difference? (2026)",
    description:
      "The difference between VLMs and VLAs comes down to training data. VLMs consume image-text pairs. VLAs need observation-action-instruction triplets. Here is why that distinction matters.",
    type: "article",
    url: "https://claru.ai/blog/vlm-vs-vla",
    siteName: "Claru",
    images: [
      {
        url: "https://claru.ai/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "VLM vs VLA: What's the Actual Difference? (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VLM vs VLA: What's the Actual Difference? (2026) | Claru",
    description:
      "VLMs need image-text pairs. VLAs need observation-action-instruction triplets. The data requirement is the real differentiator.",
  },
  alternates: {
    canonical: "https://claru.ai/blog/vlm-vs-vla",
  },
};

// =============================================================================
// JSON-LD: BlogPosting
// =============================================================================

const blogPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "VLM vs VLA: What's the Actual Difference? (2026)",
  description:
    "RT-2, OpenVLA, pi-zero, and GR00T N1 are all called VLAs — but the term is often confused with VLM. The difference comes down to data: VLMs need image-text pairs; VLAs need observation-action-instruction triplets.",
  author: {
    "@type": "Organization",
    name: "Claru AI",
    url: "https://claru.ai",
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
  datePublished: "2026-04-02",
  dateModified: "2026-04-02",
  mainEntityOfPage: "https://claru.ai/blog/vlm-vs-vla",
  image: "https://claru.ai/images/og-v2.webp",
  isPartOf: {
    "@type": "Blog",
    "@id": "https://claru.ai/blog",
    name: "Claru Blog",
  },
  mentions: [
    {
      "@type": "SoftwareApplication",
      name: "RT-2",
      url: "https://robotics-transformer2.github.io/",
    },
    {
      "@type": "SoftwareApplication",
      name: "OpenVLA",
      url: "https://openvla.github.io/",
    },
    {
      "@type": "SoftwareApplication",
      name: "pi-zero",
      url: "https://www.physicalintelligence.company/blog/pi0",
    },
    {
      "@type": "SoftwareApplication",
      name: "GR00T N1",
      url: "https://developer.nvidia.com/isaac/gr00t",
    },
    {
      "@type": "SoftwareApplication",
      name: "Octo",
      url: "https://octo-models.github.io/",
    },
  ],
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
      name: "Blog",
      item: "https://claru.ai/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "VLM vs VLA: What's the Actual Difference?",
      item: "https://claru.ai/blog/vlm-vs-vla",
    },
  ],
};

// =============================================================================
// JSON-LD: FAQPage
// =============================================================================

const faqItems = [
  {
    question: "What is the difference between VLM and VLA?",
    answer:
      "A Vision-Language Model (VLM) maps visual inputs and language to text outputs — it answers questions, describes images, or generates captions. A Vision-Language-Action model (VLA) extends this by adding an action output head: given a camera observation and a language instruction, it produces motor commands (joint angles, end-effector poses, gripper states) that directly control a robot. The fundamental difference is the output modality and, consequently, the training data required. VLMs train on image-text pairs scraped from the internet. VLAs require observation-action-instruction triplets collected through robot teleoperation or human demonstrations — data that cannot be scraped and must be purposefully collected.",
  },
  {
    question: "Do VLAs use language?",
    answer:
      "Yes. Language is a central input to VLA models — the instruction conditioning is what makes them flexible across tasks. A VLA receives a natural language instruction like 'pick up the blue cup and place it on the plate' alongside camera observations and uses that instruction to condition the action prediction. This is what separates VLAs from older behavior cloning approaches that had no language grounding. The language understanding is typically borrowed from a pretrained VLM backbone: RT-2 uses PaLI-X and PaLM-E, OpenVLA uses Prismatic-7B (built on Llama 2), and pi-zero uses PaliGemma.",
  },
  {
    question: "What training data do VLA models need?",
    answer:
      "VLA models require observation-action-instruction triplets: synchronized sequences of (1) visual observations from the robot's cameras, (2) the action trajectory executed at each timestep (end-effector pose, joint angles, gripper state), and (3) a natural language instruction describing the task. This data is collected through human teleoperation of robots or retargeted from egocentric human video. Key public datasets include Open X-Embodiment (1M+ trajectories across 22 robot types), BridgeData V2 (~60K demonstrations), and DROID (76K trajectories across 564 environments). Fine-tuning on a specific task typically requires 50–5,000 additional demonstrations depending on task complexity.",
  },
  {
    question: "Is RT-2 a VLM or VLA?",
    answer:
      "RT-2 (Robotic Transformer 2) is a VLA. It was developed by Google DeepMind and published in 2023. RT-2 uses a VLM backbone (PaLI-X or PaLM-E) that was pretrained on web-scale image-text data, then co-fine-tuned on robot action data so it can predict tokenized actions alongside text. The key contribution was showing that a model pretrained on internet-scale visual language data could be adapted to produce robot actions with minimal robot-specific training data — a form of transfer learning from VLM to VLA. RT-2 is frequently cited as the model that established the VLM-to-VLA transfer paradigm.",
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
// Comparison table data
// =============================================================================

const comparisonRows = [
  {
    criterion: "Output modality",
    vlm: "Text (captions, answers, descriptions)",
    vla: "Robot actions (joint angles, poses, gripper states)",
  },
  {
    criterion: "Training data format",
    vlm: "Image–text pairs",
    vla: "Observation–action–instruction triplets",
  },
  {
    criterion: "Data source",
    vlm: "Web-scraped (LAION, CC12M, etc.)",
    vla: "Robot teleoperation, human demonstrations",
  },
  {
    criterion: "Scale of training data",
    vlm: "Billions of image-text pairs",
    vla: "Thousands to millions of trajectories",
  },
  {
    criterion: "Pretraining target",
    vlm: "Visual-language alignment",
    vla: "Often initialized from VLM, then action fine-tuned",
  },
  {
    criterion: "Inference input",
    vlm: "Image + text query",
    vla: "Camera frame(s) + language instruction",
  },
  {
    criterion: "Key examples",
    vlm: "PaLI-X, PaliGemma, LLaVA, GPT-4V",
    vla: "RT-2, OpenVLA, pi-zero, GR00T N1, Octo",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function VlmVsVlaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
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
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  VLM vs VLA
                </li>
              </ol>
            </nav>

            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#92B090" }}
            >
              Last updated: April 2026
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              VLM vs VLA: What&apos;s the Actual Difference? (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              The terms VLM and VLA are used interchangeably in lab papers,
              job postings, and press releases. They are not the same thing.
              The distinction matters most when you start asking what data
              you need to build one.
            </p>
          </div>
        </section>

        {/* ── TL;DR Box ─────────────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div
              className="rounded-lg border p-6"
              style={{
                borderColor: "rgba(146,176,144,0.3)",
                backgroundColor: "rgba(146,176,144,0.05)",
              }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "#92B090" }}
              >
                TL;DR
              </p>
              <ul className="space-y-3">
                {[
                  "A VLM (Vision-Language Model) takes image and text inputs and outputs text; a VLA (Vision-Language-Action model) takes image and text inputs and outputs robot motor commands.",
                  "The training data requirement is the key differentiator: VLMs train on web-scraped image-text pairs, while VLAs require observation-action-instruction triplets collected through teleoperation or human demonstrations.",
                  "RT-2, OpenVLA, pi-zero, and GR00T N1 are all VLAs — each uses a VLM as a backbone and extends it with an action output head trained on robot trajectory data.",
                  "You cannot build a VLA from internet data alone; action-labeled trajectories must be purposefully collected, which is why VLA training data is scarce and expensive relative to VLM data.",
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                    <span
                      className="mt-1 flex-none w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#92B090" }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Table of Contents ─────────────────────────────────────── */}
        <section className="w-full pb-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                In This Post
              </h2>
              <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
                <li>
                  <a href="#what-is-a-vlm" className="hover:text-white transition-colors">
                    What Is a VLM?
                  </a>
                </li>
                <li>
                  <a href="#what-is-a-vla" className="hover:text-white transition-colors">
                    What Is a VLA?
                  </a>
                </li>
                <li>
                  <a href="#the-data-difference" className="hover:text-white transition-colors">
                    The Data Difference: Why It Matters
                  </a>
                </li>
                <li>
                  <a href="#comparison-table" className="hover:text-white transition-colors">
                    VLM vs VLA: Side-by-Side Comparison
                  </a>
                </li>
                <li>
                  <a href="#major-vlas" className="hover:text-white transition-colors">
                    Major VLA Models: RT-2, OpenVLA, pi-zero, GR00T N1, Octo
                  </a>
                </li>
                <li>
                  <a href="#vlm-as-backbone" className="hover:text-white transition-colors">
                    VLMs as VLA Backbones
                  </a>
                </li>
                <li>
                  <a href="#key-takeaways" className="hover:text-white transition-colors">
                    Key Takeaways
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── What Is a VLM? ────────────────────────────────────────── */}
        <section id="what-is-a-vlm" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is a VLM?
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                A <strong className="text-white">Vision-Language Model (VLM)</strong> is
                a multimodal model that processes visual inputs (images or video frames)
                alongside natural language and produces text output. The defining
                characteristic is the output modality: text. A VLM answers visual
                questions, generates image captions, describes scenes, or performs
                visual reasoning — but it does not produce actions that control physical
                systems.
              </p>
              <p>
                Well-known VLMs include PaLI-X (Google), PaliGemma (Google DeepMind),
                LLaVA (Haotian Liu et al., University of Wisconsin), GPT-4V (OpenAI),
                and Claude 3 Vision (Anthropic). All of these take images as input and
                output text. Their training data is primarily sourced from web-crawled
                image-text pairs: LAION-5B, Conceptual Captions 12M (CC12M), image-text
                data extracted from alt-text, and licensed image datasets.
              </p>
              <p>
                The practical consequence: VLM training data exists at internet scale.
                LAION-5B contains 5 billion image-text pairs. CC12M contains 12 million
                high-quality image-caption pairs. This abundance is why VLMs have scaled
                so quickly — the training data problem is largely solved through web crawling.
              </p>
              <p>
                VLMs are also useful as a starting point for building more capable
                systems. Their learned visual representations — object recognition, spatial
                reasoning, scene understanding — transfer well to downstream tasks. This
                is exactly why VLAs frequently start from VLM checkpoints.
              </p>
            </div>
          </div>
        </section>

        {/* ── What Is a VLA? ────────────────────────────────────────── */}
        <section id="what-is-a-vla" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Is a VLA?
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                A <strong className="text-white">Vision-Language-Action model (VLA)</strong>{" "}
                extends the VLM paradigm by replacing the text output head with an action
                output head. Given a visual observation (one or more camera frames) and a
                natural language instruction, it predicts the physical actions a robot
                should take to complete the described task — joint angles, end-effector
                poses, or gripper states.
              </p>
              <p>
                The formal input-output contract for a VLA is:
              </p>
              <div className="rounded-lg bg-black/40 border border-white/10 p-4 font-mono text-sm text-white/70 overflow-x-auto">
                <pre>{`Input:  (o_t, l)       # observation at timestep t, language instruction
Output: a_t            # action vector at timestep t
                       # e.g. [Δx, Δy, Δz, Δroll, Δpitch, Δyaw, gripper]`}</pre>
              </div>
              <p>
                This architecture is what makes a model useful for robotics. A VLM
                can tell you &quot;the cup is to the left of the plate&quot; but cannot
                tell a robot arm how to pick it up. A VLA can do both: understand
                the scene through its VLM backbone, then generate the motor commands
                to execute the task.
              </p>
              <p>
                The critical implication is for training data. To train this action
                output head, you need <strong className="text-white">action-labeled
                trajectories</strong> — timestep-by-timestep records of what the
                robot did alongside what it observed and what instruction it was
                following. This data cannot be scraped from the internet. It requires
                human operators teleoperating robots, or motion capture systems recording
                human demonstrations that are then retargeted to robot kinematics.
              </p>
            </div>
          </div>
        </section>

        {/* ── The Data Difference ───────────────────────────────────── */}
        <section id="the-data-difference" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Data Difference: Why It Matters
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The VLM/VLA distinction is not primarily architectural — it is
                fundamentally about <strong className="text-white">data</strong>. Both
                model families use transformer architectures with attention mechanisms
                over visual and language tokens. The difference is what those models
                are trained to predict.
              </p>
              <p>
                Training a VLM requires image-text pairs. These are abundant. You can
                crawl Common Crawl, filter by image-containing pages, extract alt-text,
                and arrive at billions of training samples within weeks of engineering
                effort. The cost of VLM training data is primarily compute for filtering
                and preprocessing, not collection.
              </p>
              <p>
                Training a VLA requires observation-action-instruction triplets. Every
                triplet requires a physical robot, a human operator, a task environment,
                and a data collection protocol. The <strong className="text-white">Open
                X-Embodiment</strong> dataset — the largest public VLA training corpus —
                aggregates 1M+ trajectories across 22 robot embodiments from 21 research
                institutions and took years of coordinated effort to assemble. Even with
                this scale, it covers only a narrow range of manipulation tasks and
                environments compared to what a generalizable robot needs to handle.
              </p>
              <p>
                This data scarcity is the primary bottleneck for VLA development in 2026.
                Teams working on humanoid robots, dexterous manipulation, and mobile
                manipulation all face the same constraint: there is not enough
                action-labeled trajectory data covering the diversity of environments,
                tasks, and object types their robots will encounter in deployment.
              </p>
              <p>
                One partial solution is pretraining on human egocentric video — footage
                captured from a first-person viewpoint during manipulation tasks. While
                this data lacks robot action labels, it provides rich visual patterns
                of how objects are handled, grasped, and manipulated. Research such
                as EgoMimic has shown that co-training on egocentric human video
                improves VLA performance without requiring full teleoperation data for
                every task.
              </p>
            </div>
          </div>
        </section>

        {/* ── Comparison Table ──────────────────────────────────────── */}
        <section id="comparison-table" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              VLM vs VLA: Side-by-Side Comparison
            </h2>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs w-[28%]">
                      Criterion
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs w-[36%]">
                      VLM
                    </th>
                    <th className="text-left p-4 font-mono uppercase tracking-wider text-xs w-[36%]" style={{ color: "#92B090" }}>
                      VLA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.criterion}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className="p-4 text-white/60 font-medium">{row.criterion}</td>
                      <td className="p-4 text-white/70">{row.vlm}</td>
                      <td className="p-4 text-white/90">{row.vla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Major VLA Models ──────────────────────────────────────── */}
        <section id="major-vlas" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Major VLA Models: RT-2, OpenVLA, pi-zero, GR00T N1, Octo
            </h2>
            <div className="space-y-10 text-white/80 leading-relaxed text-base md:text-lg">

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">RT-2 (Google DeepMind, 2023)</h3>
                <p>
                  RT-2 is the paper that established the VLM-to-VLA transfer paradigm at scale.
                  It co-fine-tunes a VLM backbone (PaLI-X 55B or PaLM-E 562B) on both web
                  image-text data and robot trajectory data simultaneously. The robot actions
                  are tokenized as text tokens, which lets the model output actions through the
                  same softmax head used for language generation. RT-2 demonstrated emergent
                  behaviors not present in training data — reasoning chains that generalized to
                  novel objects. However, RT-2&apos;s inference latency (~1-3s per action) and
                  proprietary backbone make it primarily a research result rather than a
                  deployable production system.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">OpenVLA (Stanford, Berkeley, CMU — 2024)</h3>
                <p>
                  OpenVLA is a 7B parameter VLA trained on the Open X-Embodiment dataset
                  (970K trajectories). It uses a Prismatic VLM backbone built on Llama 2,
                  with a diffusion-based action head rather than discrete token prediction.
                  OpenVLA is significant because it is fully open-source (weights on Hugging
                  Face, training code on GitHub) and matches or exceeds RT-2-X on standard
                  manipulation benchmarks despite being orders of magnitude smaller.
                  Fine-tuning OpenVLA on a new task requires as few as 200 demonstrations
                  for simple pick-and-place tasks, though dexterous manipulation tasks
                  require more.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">pi-zero (Physical Intelligence, 2024)</h3>
                <p>
                  pi-zero uses PaliGemma as its VLM backbone and a flow matching action
                  expert that operates at high frequency for dexterous tasks. Physical
                  Intelligence trained pi-zero on a proprietary dataset covering laundry
                  folding, dish loading, box assembly, and bag packing — tasks that require
                  precise bimanual dexterous manipulation. The key architectural distinction
                  is the separation between the slow VLM reasoning pathway (runs at low
                  frequency) and the fast action expert pathway (runs at high frequency for
                  contact-rich manipulation). This two-speed architecture addresses a
                  fundamental tension in VLA design: language understanding benefits from
                  large models, but real-time control requires low latency.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">GR00T N1 (NVIDIA, 2025)</h3>
                <p>
                  GR00T N1 is NVIDIA&apos;s foundation model for humanoid robots. It uses
                  a dual-system architecture: a &quot;thinking&quot; system based on Eagle2
                  (NVIDIA&apos;s VLM) for high-level scene understanding and task planning,
                  and a &quot;acting&quot; system based on a diffusion transformer for
                  generating smooth, dexterous motor trajectories. GR00T N1 was trained on
                  a combination of simulation data from Isaac Lab, human video from
                  NVIDIA&apos;s EgoScale initiative, and real robot teleoperation data.
                  NVIDIA has also released a teleoperation toolkit (GR00T-Teleop) and
                  simulation benchmark (GR00T-Bench) to help robotics teams collect
                  compatible training data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Octo (Berkeley, 2024)</h3>
                <p>
                  Octo is a smaller, faster VLA (93M parameters) trained on Open
                  X-Embodiment, designed for fine-tuning on new robot platforms and tasks.
                  Unlike RT-2 or OpenVLA, Octo does not use a pretrained VLM backbone — it
                  learns from scratch on robot trajectory data using a diffusion head. The
                  advantage is deployment speed: Octo runs at 20+ Hz on a standard GPU,
                  making it viable for real-time control without specialized inference
                  hardware. Octo&apos;s small size makes it a practical baseline for teams
                  that want to study VLA fine-tuning without the compute requirements of
                  7B+ parameter models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── VLMs as VLA Backbones ─────────────────────────────────── */}
        <section id="vlm-as-backbone" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              VLMs as VLA Backbones: Why the Transfer Works
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The standard approach to building a VLA in 2026 is to initialize from a
                pretrained VLM and then adapt it to produce actions. This transfer works
                for a specific reason: manipulation tasks require the same perceptual
                skills VLMs are trained to develop — object recognition, spatial reasoning,
                understanding natural language goal specifications, and visual scene parsing.
              </p>
              <p>
                Starting from a VLM checkpoint means a VLA team does not need to teach
                the model what a &quot;cup&quot; or &quot;plate&quot; is from robot
                trajectories alone. That knowledge is already encoded in the VLM weights.
                The action fine-tuning only needs to teach the model <em>how to interact</em>
                with those objects, not how to recognize them.
              </p>
              <p>
                This separation also explains why the two data types have different collection
                requirements. VLM pretraining data (internet image-text) can be at
                billion-scale; VLA action data needs to be far smaller but much more
                precisely structured. The ratio in RT-2 is approximately 1,000:1
                (web data to robot trajectory data by token count). OpenVLA fine-tuning
                experiments suggest that 100-500 demonstrations is sufficient to
                adapt a pretrained VLA to a new task, provided the manipulation type
                (pick-place, pour, fold) is already represented in the base training data.
              </p>
              <p>
                For robotics teams, the practical implication is this: if you are building
                a VLA for a genuinely novel task or environment not covered by Open
                X-Embodiment, you need action-labeled demonstrations specific to your
                robot and task. Claru&apos;s 500K+ egocentric clips and 4M+ human annotations
                cover the visual pretraining side; the action trajectory gap requires
                teleoperation data or retargeted human demonstration data for your
                specific platform.
              </p>
            </div>
          </div>
        </section>

        {/* ── Key Takeaways ─────────────────────────────────────────── */}
        <section id="key-takeaways" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              {[
                "VLMs output text. VLAs output robot actions. The output modality is the categorical difference.",
                "The data consequence of this distinction: VLMs can train on web-scraped image-text pairs at billion-scale; VLAs require physically collected observation-action-instruction triplets.",
                "Every major VLA (RT-2, OpenVLA, pi-zero, GR00T N1) uses a VLM as its perceptual and language backbone, then adds an action head trained on robot trajectory data.",
                "Open X-Embodiment provides 1M+ trajectories across 22 robot types, but it covers narrow task and environment diversity — teams building production systems need supplementary data.",
                "Fine-tuning a pretrained VLA like OpenVLA on a new task requires 100–500 demonstrations for simple pick-place tasks. Dexterous or contact-rich manipulation requires 1,000–50,000 demonstrations.",
                "Human egocentric video (first-person footage without action labels) is a cost-effective way to improve VLA visual representations — EgoMimic results show it outperforms additional robot teleoperation data per hour of footage.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 text-base leading-relaxed">
                  <span
                    className="mt-2 flex-none w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#92B090" }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Resources ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  href: "/vla-training-data-guide",
                  label: "VLA Training Data Guide",
                  desc: "In-depth guide to VLA training data requirements, open datasets, and data gaps.",
                },
                {
                  href: "/solutions/vla-training-data",
                  label: "VLA Training Data — Claru",
                  desc: "How Claru collects and enriches training data for VLA model development.",
                },
                {
                  href: "/glossary#vla",
                  label: "Glossary: VLA",
                  desc: "Formal definition of vision-language-action models with architecture notes.",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-colors"
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {link.label}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </GeoPageShell>
    </>
  );
}
