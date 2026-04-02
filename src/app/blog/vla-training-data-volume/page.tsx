import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title: "How Much Training Data Does a VLA Model Need? (2026) | Claru",
  description:
    "OpenVLA pre-training used 970K trajectories. Fine-tuning a simple pick-and-place task takes 50–200 demos. Dexterous bimanual manipulation needs 5K–50K. Concrete numbers for VLA training data volume requirements.",
  keywords: [
    "how much training data vla",
    "vla training data volume",
    "openvla training data size",
    "how many robot demonstrations robot learning",
    "vla fine-tuning data requirements",
    "robot demonstrations how many",
    "Open X-Embodiment dataset size",
    "BridgeData V2 dataset",
    "DROID dataset trajectories",
    "minimum dataset size robot learning",
    "vla training data 2026",
  ],
  openGraph: {
    title: "How Much Training Data Does a VLA Model Need? (2026)",
    description:
      "OpenVLA: 970K trajectories for pre-training. Pick-and-place fine-tuning: 50–200 demos. Dexterous manipulation: 5K–50K demos. Concrete data volume numbers for VLA development.",
    type: "article",
    url: "https://claru.ai/blog/vla-training-data-volume",
    siteName: "Claru",
    images: [
      {
        url: "https://claru.ai/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "How Much Training Data Does a VLA Model Need? (2026) — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Training Data Does a VLA Model Need? (2026) | Claru",
    description:
      "Concrete numbers: OpenVLA pre-training (970K trajectories), pick-and-place fine-tuning (50–200 demos), dexterous manipulation (5K–50K demos).",
  },
  alternates: {
    canonical: "https://claru.ai/blog/vla-training-data-volume",
  },
};

// =============================================================================
// JSON-LD: BlogPosting
// =============================================================================

const blogPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How Much Training Data Does a VLA Model Need? (2026)",
  description:
    "OpenVLA pre-training used 970K trajectories. Fine-tuning a simple pick-and-place task takes 50–200 demos. Dexterous bimanual manipulation needs 5K–50K. Concrete numbers for VLA training data volume requirements.",
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
  mainEntityOfPage: "https://claru.ai/blog/vla-training-data-volume",
  image: "https://claru.ai/images/og-v2.webp",
  isPartOf: {
    "@type": "Blog",
    "@id": "https://claru.ai/blog",
    name: "Claru Blog",
  },
  mentions: [
    {
      "@type": "Dataset",
      name: "Open X-Embodiment",
      url: "https://robotics-transformer-x.github.io/",
    },
    {
      "@type": "Dataset",
      name: "BridgeData V2",
      url: "https://rail-berkeley.github.io/bridgedata/",
    },
    {
      "@type": "Dataset",
      name: "DROID",
      url: "https://droid-dataset.github.io/",
    },
    {
      "@type": "SoftwareApplication",
      name: "OpenVLA",
      url: "https://openvla.github.io/",
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
      name: "How Much Training Data Does a VLA Model Need?",
      item: "https://claru.ai/blog/vla-training-data-volume",
    },
  ],
};

// =============================================================================
// JSON-LD: FAQPage
// =============================================================================

const faqItems = [
  {
    question: "How many robot demonstrations do I need to train a VLA?",
    answer:
      "It depends on whether you are pre-training or fine-tuning, and on task complexity. Pre-training a VLA from scratch requires hundreds of thousands to millions of trajectories — OpenVLA used 970K trajectories from Open X-Embodiment. Fine-tuning a pretrained VLA on a specific task is far more data-efficient: simple pick-and-place in a single environment requires 50–200 demonstrations; complex manipulation with multiple objects and configurations needs 500–5,000 demonstrations; dexterous bimanual tasks like folding or assembly may need 5,000–50,000 demonstrations. These numbers assume the fine-tuning task is semantically covered by the base model's training distribution.",
  },
  {
    question: "Can I fine-tune OpenVLA with 100 demos?",
    answer:
      "Yes, for simple tasks. The OpenVLA paper reports successful fine-tuning on single-object pick-and-place with 100–200 demonstrations when the task environment is not drastically different from the Open X-Embodiment distribution. Performance degrades for tasks with unusual object shapes, non-standard lighting, or manipulation types (like pouring or folding) that are underrepresented in Open X-Embodiment. For tasks outside OpenVLA's training distribution, 100 demos will typically be insufficient, and you will need either more demonstrations or a pretrained VLA that better covers your task domain.",
  },
  {
    question: "What is the minimum dataset size for robot learning?",
    answer:
      "The minimum viable dataset size is task-dependent, not a fixed number. For imitation learning on a single primitive task (reach and grasp a specific object in a fixed position), as few as 10–20 demonstrations can achieve measurable success rates in controlled conditions. For generalizing across object positions, this rises to 50–200. For generalizing across object types and environments, 500–5,000 demonstrations is the practical floor. Models that need to generalize across diverse environments, multiple tasks, and varied lighting and clutter conditions require tens to hundreds of thousands of trajectories — which is why Open X-Embodiment, BridgeData V2, and DROID exist as shared community resources.",
  },
  {
    question: "What datasets were used to train OpenVLA?",
    answer:
      "OpenVLA was pre-trained on a curated subset of the Open X-Embodiment dataset: 970,000 robot manipulation trajectories across 22 different robot embodiments from 21 research institutions. The dataset includes contributions from RT-1 (Google), BridgeData V2 (UC Berkeley), TACO-Play (Karlsruhe Institute of Technology), Language Table (Google), and 17 other robotics research groups. The training data covers tabletop manipulation, mobile manipulation, and some dexterous manipulation, with natural language instruction annotations for each trajectory.",
  },
  {
    question: "How does DROID differ from Open X-Embodiment for VLA training?",
    answer:
      "DROID (Distributed Robot Interaction Dataset) provides 76,000 trajectories collected across 564 distinct environments by 50+ data collectors using a standardized Franka Emika Panda robot arm. Unlike Open X-Embodiment, which aggregates data from many different robot types and collection setups, DROID prioritizes environment diversity over robot diversity. The 564 environments include diverse real-world locations — kitchens, offices, labs, workshops — which makes DROID particularly useful for training models that need to generalize to novel environments rather than novel robot embodiments. DROID also uses standardized wrist and overhead cameras, making the visual distribution more consistent across trajectories.",
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
// Data volume table
// =============================================================================

const dataVolumeRows = [
  {
    taskType: "VLA pre-training (from scratch)",
    volumeRange: "500K – 1M+ trajectories",
    notes: "OpenVLA: 970K; Open X-Embodiment: 1M+",
    keyPapers: "OpenVLA, RT-2, Octo",
  },
  {
    taskType: "Fine-tune: single pick-and-place (fixed object, fixed env)",
    volumeRange: "50 – 200 demos",
    notes: "Simple grasps, single object type, limited variation",
    keyPapers: "OpenVLA fine-tuning studies",
  },
  {
    taskType: "Fine-tune: pick-and-place (multiple objects + positions)",
    volumeRange: "200 – 1,000 demos",
    notes: "Covers object pose variation, clutter, instruction variation",
    keyPapers: "BridgeData V2, ALOHA",
  },
  {
    taskType: "Fine-tune: multi-step manipulation (stack, sort, pour)",
    volumeRange: "1,000 – 5,000 demos",
    notes: "Multiple sub-tasks, requires temporal chaining",
    keyPapers: "Language Table, RoboAgent",
  },
  {
    taskType: "Dexterous bimanual manipulation (fold, assemble, pack)",
    volumeRange: "5,000 – 50,000 demos",
    notes: "High precision, contact-rich, low error tolerance",
    keyPapers: "pi-zero (Physical Intelligence)",
  },
  {
    taskType: "Mobile manipulation (navigation + manipulation)",
    volumeRange: "10,000 – 100,000 demos",
    notes: "Large action space, diverse environments",
    keyPapers: "Open X-Embodiment mobile subset, DROID",
  },
  {
    taskType: "Humanoid whole-body control",
    volumeRange: "50,000 – 500,000 demos",
    notes: "High-DOF control, balance, full-body coordination",
    keyPapers: "GR00T N1, Figure 02, Unitree G1 papers",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function VlaTrainingDataVolumePage() {
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
                  VLA Training Data Volume
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
              How Much Training Data Does a VLA Model Need? (2026)
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              &quot;How much data do we need?&quot; is the first question every
              robotics team asks before commissioning a data collection effort.
              The answer is not a single number — it depends on whether you are
              pre-training or fine-tuning, and on the task complexity. Here are
              the actual figures from published research.
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
                  "OpenVLA pre-training required 970K robot manipulation trajectories from the Open X-Embodiment dataset — this is the reference scale for training a generalist VLA from scratch.",
                  "Fine-tuning a pretrained VLA on simple pick-and-place typically needs 50–200 demonstrations; multi-step manipulation tasks need 1K–5K; dexterous bimanual tasks need 5K–50K.",
                  "DROID (76K trajectories, 564 environments) and BridgeData V2 (~60K demonstrations) are the most environment-diverse public datasets for fine-tuning on novel real-world settings.",
                  "Human egocentric video without action labels can supplement robot trajectory data for visual pretraining, but the action head still requires physically collected robot demonstrations.",
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
                  <a href="#pre-training-vs-fine-tuning" className="hover:text-white transition-colors">
                    Pre-training vs. Fine-tuning: Different Data Regimes
                  </a>
                </li>
                <li>
                  <a href="#pretraining-datasets" className="hover:text-white transition-colors">
                    Pre-training Datasets: Open X-Embodiment, DROID, BridgeData V2
                  </a>
                </li>
                <li>
                  <a href="#data-volume-table" className="hover:text-white transition-colors">
                    Data Volume by Task Type
                  </a>
                </li>
                <li>
                  <a href="#what-drives-volume" className="hover:text-white transition-colors">
                    What Actually Drives Data Volume Requirements
                  </a>
                </li>
                <li>
                  <a href="#egocentric-supplement" className="hover:text-white transition-colors">
                    Supplementing with Egocentric Human Video
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

        {/* ── Pre-training vs Fine-tuning ───────────────────────────── */}
        <section id="pre-training-vs-fine-tuning" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Pre-training vs. Fine-tuning: Different Data Regimes
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The question &quot;how much data does a VLA need?&quot; has two
                very different answers depending on which training phase you are
                asking about. Pre-training and fine-tuning operate in different
                data regimes, with different volume requirements and different
                data characteristics.
              </p>
              <p>
                <strong className="text-white">Pre-training</strong> refers to
                training the model&apos;s general robot manipulation capabilities
                before task-specific adaptation. This phase requires breadth:
                diverse robot embodiments, diverse environments, diverse task types,
                and large trajectory counts. OpenVLA&apos;s pre-training on 970K
                trajectories from Open X-Embodiment is the reference point for a
                7B parameter model. Octo, at 93M parameters, also pre-trains on
                Open X-Embodiment but achieves good generalization with this same
                dataset at a fraction of the compute cost.
              </p>
              <p>
                <strong className="text-white">Fine-tuning</strong> adapts a
                pretrained VLA to a specific robot, environment, or task type. This
                phase requires depth rather than breadth: high-quality demonstrations
                of exactly the tasks you need the robot to perform, in the environments
                where it will be deployed, on the robot hardware you are using.
                Fine-tuning is dramatically more data-efficient than pre-training —
                the pretrained model already understands objects, spatial relationships,
                and manipulation primitives. You are only teaching it the specifics
                of your deployment context.
              </p>
              <p>
                Most robotics teams in 2026 do not pre-train VLAs from scratch. They
                start from OpenVLA, Octo, or a proprietary pretrained VLA, then
                fine-tune on their own collected data. The pre-training datasets
                (Open X-Embodiment, BridgeData V2, DROID) are therefore shared
                infrastructure rather than something each team needs to independently
                collect.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pre-training Datasets ─────────────────────────────────── */}
        <section id="pretraining-datasets" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Pre-training Datasets: Open X-Embodiment, DROID, BridgeData V2
            </h2>
            <div className="space-y-8 text-white/80 leading-relaxed text-base md:text-lg">

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Open X-Embodiment (1M+ trajectories)
                </h3>
                <p>
                  Open X-Embodiment is the largest publicly available robot manipulation
                  dataset. It aggregates trajectories from 22 different robot embodiments —
                  including RT-1 robots (Google), Franka Emika Panda arms (multiple
                  institutions), WidowX arms (Berkeley), and others — across 21 research
                  institutions. The total dataset contains over 1 million trajectories.
                  Each trajectory includes synchronized RGB observations (wrist and/or
                  overhead camera), natural language instruction annotations, and action
                  sequences recorded at 1–10 Hz depending on the data source.
                </p>
                <p className="mt-4">
                  OpenVLA used a curated 970K-trajectory subset of Open X-Embodiment,
                  filtering for data quality and instruction coverage. The curation step
                  matters: not all trajectories in the full dataset are equal in quality,
                  and naively training on the full set can introduce noise from poorly
                  annotated or corrupted demonstrations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  DROID (76K trajectories, 564 environments)
                </h3>
                <p>
                  DROID (Distributed Robot Interaction Dataset) prioritizes environment
                  diversity over embodiment diversity. All 76K trajectories use a
                  standardized Franka Emika Panda arm with consistent wrist and overhead
                  cameras. The value of DROID is the 564 distinct physical environments:
                  real kitchens, offices, labs, workshops, and storage spaces — each with
                  different lighting, backgrounds, object arrangements, and clutter levels.
                  This makes DROID particularly useful for training models that need to
                  generalize to novel deployment environments, even if those environments
                  are not in the training set.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  BridgeData V2 (~60K demonstrations)
                </h3>
                <p>
                  BridgeData V2 from UC Berkeley contains approximately 60,000
                  demonstrations of tabletop manipulation tasks performed by a WidowX
                  robot arm. Unlike Open X-Embodiment (which aggregates many sources),
                  BridgeData V2 was collected with a consistent protocol, making the data
                  distribution tighter. It is widely used for fine-tuning experiments
                  because of its clean data collection methodology. Tasks include
                  pick-and-place, stacking, pouring, and various kitchen manipulation
                  scenarios. The dataset is annotated with natural language instructions
                  and task labels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Data Volume Table ─────────────────────────────────────── */}
        <section id="data-volume-table" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Data Volume by Task Type
            </h2>
            <p className="text-white/60 mb-8 text-base">
              Ranges derived from published results across OpenVLA, Octo, pi-zero,
              ALOHA, RoboAgent, and GR00T N1 papers. Numbers assume fine-tuning from
              a pretrained VLA, not training from scratch.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Task Type
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs">
                      Demo Volume Range
                    </th>
                    <th className="text-left p-4 font-mono text-white/50 uppercase tracking-wider text-xs hidden md:table-cell">
                      Key Papers / Systems
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataVolumeRows.map((row, i) => (
                    <tr
                      key={row.taskType}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className="p-4 text-white/80 font-medium leading-snug">
                        {row.taskType}
                      </td>
                      <td className="p-4 font-mono text-sm" style={{ color: "#92B090" }}>
                        {row.volumeRange}
                      </td>
                      <td className="p-4 text-white/50 text-xs leading-snug hidden md:table-cell">
                        {row.keyPapers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/40 mt-4">
              Note: Numbers represent demonstration requirements for achieving
              meaningful task success rates (&gt;50%) in controlled lab settings.
              Production deployment in unstructured environments typically requires
              10–100× more data for reliable generalization.
            </p>
          </div>
        </section>

        {/* ── What Drives Data Volume ───────────────────────────────── */}
        <section id="what-drives-volume" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              What Actually Drives Data Volume Requirements
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The data volume ranges in the table above are not arbitrary — they
                reflect specific properties of the learning problem. Understanding
                what drives volume requirements helps teams scope collection efforts
                more accurately.
              </p>

              <div className="space-y-6">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white mb-2">
                    1. Task variation
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    How many distinct object types, positions, orientations, and
                    lighting conditions does the task require? A model that needs to
                    pick up any cup from any position in any kitchen needs orders of
                    magnitude more data than one that picks up a specific cup from a
                    fixed position in a fixed lab. Task variation is the most
                    significant driver of data volume.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white mb-2">
                    2. Contact complexity
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Tasks that require precise contact control — folding fabric,
                    inserting connectors, screwing caps — have much narrower error
                    tolerances than simple pick-and-place. More demonstrations are
                    needed to cover the distribution of contacts the model might
                    encounter. This is why pi-zero&apos;s dexterous manipulation tasks
                    (laundry folding, dish loading) required far more data than the
                    manipulation tasks in BridgeData V2.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white mb-2">
                    3. Distribution shift from pretraining
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    If your target task and environment are well-represented in the
                    pretraining dataset, you need far fewer fine-tuning demonstrations.
                    If your robot, environment, or task type is substantially different
                    from the pretraining distribution — unusual lighting, non-standard
                    objects, different camera setup — you will need more demonstrations
                    to compensate for the distribution shift.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white mb-2">
                    4. Demonstration quality
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Clean, consistent demonstrations collected with a systematic
                    protocol are worth more than the same number of noisy demonstrations
                    collected opportunistically. BridgeData V2&apos;s tighter data
                    collection protocol is part of why it has been used for so many
                    published fine-tuning experiments — the data quality is reliable
                    enough to isolate algorithmic variables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Supplementing with Egocentric Human Video ─────────────── */}
        <section id="egocentric-supplement" className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Supplementing with Egocentric Human Video
            </h2>
            <div className="space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Robot teleoperation is expensive and slow. Collecting 50,000
                demonstrations of dexterous bimanual manipulation requires operators,
                hardware, and weeks of collection time. One approach that has shown
                promise is supplementing robot trajectory data with human egocentric
                video — first-person footage captured by humans performing the same
                tasks without robot hardware.
              </p>
              <p>
                Human egocentric video does not contain robot action labels
                (joint angles, end-effector poses). What it contains is rich visual
                information about <em>how</em> humans manipulate objects: grasp types,
                hand-object contact patterns, approach trajectories, and task sequencing.
                This visual information transfers to robot learning through two mechanisms:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-white/70">
                <li className="leading-relaxed">
                  <strong className="text-white">Visual pretraining:</strong> Using
                  egocentric video to pretrain the perception backbone before action
                  head training. The model learns object representations and manipulation
                  visual patterns from video, then the action head trains on the smaller
                  robot teleoperation dataset.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-white">Co-training:</strong> Mixing egocentric
                  video (with video-level labels or captions, but without robot actions)
                  alongside robot trajectory data during VLA fine-tuning. EgoMimic
                  demonstrated that this co-training consistently improves task success
                  rates compared to robot-only training.
                </li>
              </ol>
              <p>
                Claru&apos;s 500K+ egocentric clips — captured across 100+ cities,
                covering kitchen, workshop, warehouse, and outdoor manipulation
                scenarios — are specifically structured for this use case. Each clip
                includes depth maps, pose estimation, semantic segmentation, and
                action boundary labels that make them compatible with visual pretraining
                pipelines for{" "}
                <Link
                  href="/vla-training-data-guide"
                  className="underline underline-offset-2"
                  style={{ color: "#92B090" }}
                >
                  VLA development
                </Link>
                .
              </p>
              <p>
                The practical takeaway: if your team is facing a data volume problem
                for a manipulation task, before scaling up expensive robot teleoperation,
                assess whether egocentric human video of the same tasks could substitute
                for some of that teleoperation data in the visual pretraining phase.
                For tasks involving everyday objects and environments, the answer is
                usually yes.
              </p>
            </div>
          </div>
        </section>

        {/* ── Key Takeaways ─────────────────────────────────────────── */}
        <section id="key-takeaways" className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              {[
                "Pre-training a generalist VLA requires hundreds of thousands of trajectories — OpenVLA's 970K-trajectory Open X-Embodiment subset is the current reference scale for 7B parameter models.",
                "Fine-tuning from a pretrained VLA is dramatically more data-efficient: 50–200 demos for simple pick-and-place, 1K–5K for multi-step manipulation, 5K–50K for dexterous bimanual tasks.",
                "DROID (76K trajectories, 564 environments) is the best public option for fine-tuning on novel real-world environments; BridgeData V2 (~60K demos) is the cleanest single-robot dataset for methodology experiments.",
                "Data volume requirements are driven primarily by task variation, contact complexity, distribution shift from pretraining, and demonstration quality — not trajectory count alone.",
                "Human egocentric video can substitute for robot teleoperation data in the visual pretraining phase, reducing the total robot teleoperation budget needed for a new task.",
                "Production deployment requirements are typically 10–100× higher than the numbers reported in controlled lab benchmarks — account for long-tail scenarios, edge cases, and distributional shift in real environments.",
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
        <section id="faq" className="w-full py-16 md:py-24">
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
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Resources
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  href: "/vla-training-data-guide",
                  label: "VLA Training Data: The Complete Guide",
                  desc: "Architecture overview, open datasets, data gaps, and how teams source VLA training data.",
                },
                {
                  href: "/solutions/vla-training-data",
                  label: "VLA Training Data — Claru",
                  desc: "How Claru collects, enriches, and delivers data for VLA model development.",
                },
                {
                  href: "/glossary#manipulation-trajectory",
                  label: "Glossary: Manipulation Trajectory",
                  desc: "Definition of manipulation trajectories and their role in VLA training.",
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
