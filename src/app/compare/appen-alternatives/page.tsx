import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Appen Alternatives for Physical AI Data (2026)",
  description:
    "Appen alternative for robotics and physical AI. Claru is purpose-built for egocentric video, depth maps, pose estimation, and manipulation data.",
  keywords: [
    "Appen alternative",
    "Appen alternatives",
    "Appen competitor",
    "Appen vs Claru",
    "Appen for robotics",
    "Appen replacement",
    "physical AI training data",
    "robotics training data alternative",
    "data labeling alternative",
    "AI data annotation companies",
    "embodied AI data labeling",
    "Appen alternative for video",
  ],
  openGraph: {
    title:
      "Appen Alternatives for Physical AI & Robotics Data (2026)",
    description:
      "Appen built crowd-sourced labeling at scale. But physical AI teams need egocentric video, depth maps, and manipulation data — not text annotation. See how Claru compares.",
    type: "article",
    url: "https://claru.ai/compare/appen-alternatives",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Appen Alternatives for Physical AI & Robotics Data — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Appen Alternatives for Physical AI & Robotics Data (2026)",
    description:
      "Appen is the OG of crowd-sourced data labeling. But if you are building robots or world models, you need a specialist. See how Claru compares.",
  },
  alternates: {
    canonical: "https://claru.ai/compare/appen-alternatives",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question:
      "Why do robotics teams look for Appen alternatives?",
    answer:
      "Appen built its business on crowd-sourced labeling for NLP, search relevance, and content moderation. They have recently added physical AI to their product line (LiDAR annotation, robotics trajectories, sensor fusion), but this is a new expansion alongside five other AI use case categories. Robotics and physical AI teams often need deep specialization: purpose-built capture networks for egocentric video, automated enrichment pipelines for depth maps and pose estimation, and expert annotators trained specifically in manipulation taxonomies. Teams search for alternatives when they need a partner whose entire operation is built around physical AI data, rather than a broad platform that has added robotics as one of many offerings.",
  },
  {
    question:
      "How is Claru different from Appen for physical AI data?",
    answer:
      "The core difference is focus. Appen serves six AI use case categories — from frontier alignment to speech and audio to physical AI. Claru does one thing: training data for physical AI. This means Claru operates a purpose-built capture network (10,000+ contributors with wearable cameras across 100+ cities), an automated multi-model enrichment pipeline (depth maps via Depth Anything V2, pose estimation via ViTPose, segmentation via SAM3, optical flow), expert human annotation specialized in manipulation and robotics (action boundaries, object affordances, grasp types, intent labels), and delivery in robotics-native formats like WebDataset, HDF5, and RLDS. Appen's physical AI offering covers LiDAR annotation and robotics trajectories, but as part of a broader platform rather than a dedicated end-to-end pipeline.",
  },
  {
    question:
      "Is Appen still a good choice for NLP and text annotation?",
    answer:
      "For high-volume text annotation tasks — search relevance, content moderation, sentiment analysis, entity extraction, multilingual NLP — Appen remains a strong choice. They have operated in this space since 1997 and have one of the largest crowd workforces globally, covering 500+ locales. They have also expanded into frontier model alignment (RLHF, red teaming) and agentic AI. If your project is primarily text, speech, or general multimodal data and you need scale and linguistic diversity, Appen's platform is well-established. The case for a specialist alternative is strongest when your data needs are specifically physical AI: egocentric video capture, multi-model enrichment, and robotics-specific annotation.",
  },
  {
    question:
      "What does Claru's enrichment pipeline provide that Appen's annotation does not?",
    answer:
      "Claru runs an automated multi-model enrichment pipeline that computes per-frame depth maps (Depth Anything V2), 2D and 3D human pose estimation (ViTPose), semantic and instance segmentation masks (SAM3), dense optical flow between consecutive frames, and AI-generated natural language captions. All enrichment outputs are cross-validated: depth consistency is checked against segmentation boundaries, pose estimates are validated against temporal smoothness constraints. These are computed signals that robotics models consume as input features, not human-drawn annotations. Appen offers LiDAR annotation and sensor fusion for physical AI, but does not document a comparable automated enrichment pipeline that produces aligned multi-modal side-channels at scale.",
  },
  {
    question:
      "Can Claru handle the same annotation volume as Appen?",
    answer:
      "Appen's crowd workforce is one of the largest in the industry, which matters for high-volume text and image classification tasks that require millions of simple labels. Physical AI data operates at different volume requirements — robotics teams typically need 5,000 to 500,000 high-quality demonstrations rather than millions of one-line text labels. Claru has delivered 3.7M+ annotations, 500K+ egocentric video clips, and manages 10,000+ contributors worldwide. For the volume ranges that physical AI teams actually need, Claru matches or exceeds Appen's throughput while providing the domain expertise and enrichment pipeline that robotics data requires.",
  },
  {
    question:
      "What formats does Claru deliver robotics datasets in?",
    answer:
      "Claru delivers data in the formats robotics and physical AI teams actually use. Standard options include WebDataset for streaming training at scale, HDF5 for dense numeric arrays and trajectories, RLDS/TFDS for reinforcement learning pipelines, Parquet for tabular metadata and annotation queries, and COCO JSON for detection and segmentation tasks. Video is delivered as MP4 (H.264/H.265) or extracted frames in PNG/WebP. Every delivery includes enrichment layers (depth, segmentation, pose) as aligned side-channels, a manifest with checksums, and a datasheet documenting methodology and limitations. Appen typically exports annotations in JSON or CSV — formats that require significant post-processing before they can be fed to a robotics training pipeline.",
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
// COMPARISON TABLE DATA
// =============================================================================

const comparisonDimensions = [
  {
    dim: "Founded",
    appen: "1997 — Sydney, Australia. Publicly traded (ASX: APX)",
    claru: "2025 — purpose-built for the physical AI era from day one",
  },
  {
    dim: "Primary Focus",
    appen: "Broad AI data services: NLP, search relevance, speech, content moderation, with recent expansion into physical AI and agentic AI",
    claru: "100% focused on physical AI training data: robotics, world models, embodied AI",
  },
  {
    dim: "Data Capture",
    appen: "Offers data collection across text, image, audio, and video modalities via crowd contributors",
    claru: "Purpose-built capture network: 10,000+ contributors with wearable cameras across 100+ cities, plus managed teleoperation and game-based capture",
  },
  {
    dim: "Core Data Types",
    appen: "Text, speech audio, images, video annotation, LiDAR, robotics trajectories, sensor fusion (physical AI is a recent addition)",
    claru: "Egocentric video, manipulation trajectories, teleoperation demos, multi-view captures — physical AI modalities from day one",
  },
  {
    dim: "Enrichment Pipeline",
    appen: "Primarily manual annotation; no documented automated enrichment pipeline for depth, pose, or optical flow",
    claru: "Multi-model pipeline: depth maps (Depth Anything V2), pose estimation (ViTPose), segmentation (SAM3), optical flow, AI captions — all cross-validated",
  },
  {
    dim: "Workforce Model",
    appen: "1M+ crowd workers globally across 500+ locales; general-purpose, task-trained per project",
    claru: "10,000+ trained collectors with wearable cameras + expert annotators specialized in physical AI modalities",
  },
  {
    dim: "Robotics Depth",
    appen: "Recently added LiDAR annotation, robotics trajectories, and sensor fusion to their product line alongside 5 other AI use case categories",
    claru: "Entire company built for robotics: action boundary annotation, grasp type taxonomies, object affordances, intent labeling, egocentric capture protocols",
  },
  {
    dim: "Annotation Quality",
    appen: "Large workforce enables scale; quality consistency has been a reported concern as the company has grown",
    claru: "Expert annotators following project-specific guidelines co-developed with client ML teams; domain specialization over crowd scale",
  },
  {
    dim: "Speed to Delivery",
    appen: "Weeks to months for custom projects; enterprise onboarding adds time",
    claru: "Brief to first delivery in days; pilot datasets in under a week",
  },
  {
    dim: "Delivery Formats",
    appen: "Standard annotation exports (JSON, CSV); format flexibility for robotics-specific outputs is unclear",
    claru: "WebDataset, HDF5, RLDS, Parquet, COCO — formats robotics pipelines consume directly, with enrichment layers as aligned side-channels",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function AppenAlternativesPage() {
  return (
    <>
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
                  <a
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li>
                  <span className="transition-colors">Compare</span>
                </li>
                <li aria-hidden="true" className="select-none">
                  /
                </li>
                <li aria-current="page" style={{ color: "#92B090" }}>
                  Appen Alternatives
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Appen Alternatives for Physical AI &amp; Robotics Training
              Data
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://appen.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                Appen
              </a>{" "}
              pioneered crowd-sourced data labeling &mdash; NLP,
              search relevance, content moderation at massive scale for
              nearly three decades. They have recently expanded into
              physical AI with LiDAR annotation and robotics trajectories.
              But if you are building robots, world models, or{" "}
              <Link
                href="/embodied-ai-datasets"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                embodied AI
              </Link>, you need more than annotation added to an existing
              platform. You need{" "}
              <Link
                href="/egocentric-video-datasets"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                egocentric video capture
              </Link>, depth maps,
              pose estimation, and manipulation trajectories from a{" "}
              <Link
                href="/about"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                team that does nothing else
              </Link>. That is Claru.
            </p>
          </div>
        </section>

        {/* ── The Core Distinction ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Broad Crowd Labeling vs. Physical AI Specialization
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Appen was founded in 1997 &mdash; before the current AI
                wave even existed. They built one of the world&apos;s
                largest crowd workforces, connecting over a million
                contributors with companies that needed data labeled at
                scale. For most of their history, that meant text: search
                relevance judgments for Google, sentiment labels for
                enterprise NLP, content moderation for social platforms,
                speech transcription for virtual assistants. They remain
                strong in these areas, and operate at a scale few
                companies can match.
              </p>

              <p>
                Recently,{" "}
                <a
                  href="https://appen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Appen
                </a>{" "}
                has expanded their product line to
                include physical AI offerings &mdash; listing LiDAR
                annotation, robotics trajectories, and sensor fusion as
                new capabilities. This reflects the industry-wide
                recognition that physical AI is the next frontier, driven by
                initiatives like{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  NVIDIA&apos;s physical AI platform
                </a>{" "}
                and research benchmarks such as{" "}
                <a
                  href="https://robotics-transformer-x.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Open X-Embodiment
                </a>. But
                adding a product category to an existing platform is
                different from building a company around it.
              </p>

              <p>
                Physical AI &mdash; robotics, embodied agents, world
                models &mdash; needs a fundamentally different data stack
                than text or image labeling. When you are training a
                manipulation policy, you need someone in a real kitchen
                wearing a GoPro, demonstrating how to open a drawer,
                grasp a mug, and pour water. You need that video enriched
                with per-frame depth maps so the model understands 3D
                geometry. You need pose estimation so it can map hand
                positions to joint configurations. You need expert
                annotators who can mark the precise moment a grasp
                initiates and classify it as a precision pinch versus a
                power grasp. These requirements go far beyond adding a
                new annotation type to a crowd labeling platform.
              </p>

              <p>
                This is not a knock on Appen. It is a statement about
                specialization versus breadth. A hospital does not go to
                a general contractor to build an operating room. The
                skills are adjacent but the requirements are specific.{" "}
                <strong className="text-white">
                  Appen is a broad data services company expanding into
                  physical AI. Claru is built exclusively for physical
                  AI data.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Teams Search for Alternatives ─────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Why Physical AI Teams Search for Appen Alternatives
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Appen has recently added physical AI to their product line
              &mdash; LiDAR annotation, robotics trajectories, and
              sensor fusion. But teams building robots and world models
              often find that adding a category to a broad platform is
              different from building a company around it.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "They need egocentric video, not general collection",
                  description:
                    "Appen offers data collection across text, image, audio, and video. But physical AI teams need egocentric video from real environments — kitchens, warehouses, workshops, outdoor spaces — captured with wearable cameras at specific frame rates and resolutions, following structured task protocols. This requires a capture network purpose-built for physical AI, not a general-purpose collection platform.",
                },
                {
                  title: "They need automated enrichment pipelines",
                  description:
                    "Robotics models consume depth maps, pose estimation, segmentation masks, and optical flow as input features alongside RGB video. These are computed by specialized foundation models (Depth Anything V2, ViTPose, SAM3) and cross-validated at scale. Appen's physical AI offering covers LiDAR annotation and sensor fusion, but does not document an automated multi-model enrichment pipeline for these modalities.",
                },
                {
                  title: "They need deep domain expertise in manipulation",
                  description:
                    "Labeling a grasp affordance, annotating an action boundary at sub-second precision, or classifying manipulation intent requires annotators who understand contact physics and embodiment constraints. Appen's recent physical AI expansion is promising, but the depth of domain expertise in a company that serves six distinct AI use cases differs from a team focused exclusively on physical AI.",
                },
                {
                  title: "They need robotics-native delivery formats",
                  description:
                    "Physical AI training pipelines consume WebDataset, HDF5, RLDS, and Parquet — not JSON and CSV annotation exports. Converting Appen's output into formats that a PyTorch or JAX training pipeline can ingest requires significant engineering work on the client side. Claru delivers in the formats teams actually use.",
                },
                {
                  title: "Physical AI demands higher precision per label",
                  description:
                    "For text classification, a small percentage of mislabeled samples washes out in aggregate. For physical AI, a single mislabeled action boundary can teach a robot to collide with objects. The error tolerance for robotics annotation is fundamentally lower than for NLP or image classification. This favors specialist annotators with domain training over large crowd workforces optimized for throughput.",
                },
                {
                  title: "Speed and flexibility gaps",
                  description:
                    "Enterprise onboarding at Appen can take weeks. Custom annotation ontologies require project setup time. For robotics teams iterating rapidly — needing pilot datasets in days, not months — the enterprise data labeling cadence does not match the development velocity of a startup building robots.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Appen vs. Claru: Side-by-Side Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-4xl">
              This comparison focuses on the dimensions that matter for
              physical AI, robotics, and embodied AI teams. For NLP,
              search relevance, and content moderation, Appen&apos;s
              strengths are well-documented and we respect them.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[130px]">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[240px]">
                      Appen
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider min-w-[240px]"
                      style={{ color: "#92B090" }}
                    >
                      Claru
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {comparisonDimensions.map((row, i) => (
                    <tr
                      key={row.dim}
                      className={
                        i % 2 === 0
                          ? "bg-transparent"
                          : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white align-top">
                        {row.dim}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.appen}
                      </td>
                      <td
                        className="px-4 py-3 align-top"
                        style={{ color: "rgba(146,176,144,0.9)" }}
                      >
                        {row.claru}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── The Physical AI Data Gap ─────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Physical AI Data Gap: Why Breadth Is Not Depth
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The data infrastructure that powered the NLP and computer
                vision era &mdash; crowd-sourced annotation at scale
                &mdash; was built for a specific type of problem: you
                have millions of text samples or images, and you need
                humans to classify, tag, or draw bounding boxes on them.
                Appen, Scale AI, and others built massive platforms for
                this. It worked because the raw data (text from the
                internet, images from web crawls) was abundant, and the
                annotation tasks (is this sentence positive or negative?
                draw a box around the car) were decomposable into simple
                micro-tasks for non-specialist workers.
              </p>

              <p>
                Every major data company has recognized that physical AI
                is the next frontier &mdash; Appen now lists it as a
                product category alongside frontier alignment, agentic
                AI, speech, multimodal, and model integrity. But
                physical AI breaks the crowd labeling model in three
                specific ways that make depth of specialization more
                important than breadth of coverage.
              </p>

              <p>
                <strong className="text-white">
                  First, the raw data requires purpose-built capture.
                </strong>{" "}
                You cannot scrape egocentric video of someone folding
                laundry in a real apartment, shot from a wrist-mounted
                camera at 30 FPS with consistent framing. You cannot
                download teleoperation demonstrations of a Franka arm
                picking up transparent objects under varied lighting.
                This data has to be captured deliberately, in controlled
                or semi-controlled real-world environments, by trained
                operators wearing specific hardware and following
                structured task protocols. A company that adds physical
                AI to its product line is different from one that
                operates capture pipelines as its core business.
              </p>

              <p>
                <strong className="text-white">
                  Second, robotics models need multi-modal enrichment,
                  not just labels.
                </strong>{" "}
                A vision-language-action model does not just consume RGB
                frames with bounding boxes. It consumes RGB aligned with
                depth maps, segmentation masks, pose skeletons, and
                optical flow &mdash; all at pixel-level alignment and
                consistent temporal resolution. These enrichment layers
                are computed by specialized foundation models (Depth
                Anything V2 for depth, ViTPose for pose, SAM3 for
                segmentation), cross-validated against each other, and
                delivered as aligned side-channels. This is a compute
                pipeline, not a crowd annotation task.
              </p>

              <p>
                <strong className="text-white">
                  Third, the annotation tasks require genuine domain
                  expertise.
                </strong>{" "}
                Marking the exact frame where a &ldquo;reach&rdquo;
                transitions to a &ldquo;grasp&rdquo; is not the same as
                drawing a bounding box. Classifying a grasp as
                &ldquo;precision pinch&rdquo; versus &ldquo;lateral
                pinch&rdquo; requires understanding of manipulation
                taxonomies. Labeling object affordances (which surfaces
                are graspable, which edges are sharp, which containers
                are full) requires spatial reasoning that demands
                specialist training. A million-person crowd workforce
                optimized for throughput across dozens of task types
                serves a different purpose than a smaller team of
                annotators trained exclusively in physical AI
                modalities.
              </p>

              <p>
                These three gaps &mdash; capture, enrichment, and expert
                annotation &mdash; compound. A team that needs physical
                AI data cannot solve the problem by finding a better
                annotation platform. They need a fundamentally different
                type of data partner: one that operates the full pipeline
                from real-world capture through multi-modal enrichment to
                expert-annotated delivery.
              </p>
            </div>
          </div>
        </section>

        {/* ── When Appen Makes Sense ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When Appen Is Still the Right Choice
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Appen has operated in the data services space longer
                than almost anyone, and they have expanded their product
                line significantly &mdash; from crowd labeling into
                frontier alignment, agentic AI, and physical AI. For
                the right use cases, they are a strong choice. Here is
                when you should consider them:
              </p>

              <ul className="space-y-4 list-none pl-0">
                {[
                  {
                    title: "Large-scale NLP and text annotation",
                    desc: "Sentiment analysis, entity extraction, intent classification, search relevance judgments, and other text-based labeling tasks where you need millions of labels across dozens of languages. Appen's global crowd workforce covers 180+ languages.",
                  },
                  {
                    title: "Content moderation at volume",
                    desc: "Classifying user-generated content for trust and safety applications. Appen has established workflows and trained moderators for social media platforms, e-commerce, and community forums.",
                  },
                  {
                    title: "Speech and audio transcription",
                    desc: "Transcribing and annotating speech data for virtual assistants, call center AI, and speech recognition systems. Appen's multilingual workforce is well-suited for this.",
                  },
                  {
                    title: "Basic image classification",
                    desc: "When you need simple labels on images — category classification, basic bounding boxes, yes/no judgments — at high volume with competitive per-task pricing. Crowd annotation is efficient for these decomposable tasks.",
                  },
                  {
                    title: "Frontier model alignment and RLHF",
                    desc: "Appen has expanded into chain-of-thought reasoning, RLHF, red teaming, and SFT for large language models. If you need human feedback for text-based model alignment, their crowd workforce and newly developed alignment workflows are worth evaluating.",
                  },
                  {
                    title: "Budget-sensitive, high-volume labeling",
                    desc: "If cost per label is the primary constraint and you are working with text or simple image tasks, Appen's crowd model can deliver at lower per-unit cost than specialist providers. The trade-off is less depth per annotation.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="border-l-2 pl-5"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <strong className="text-white">
                      {item.title}.
                    </strong>{" "}
                    {item.desc}
                  </li>
                ))}
              </ul>

              <p>
                If your data is primarily text, speech, or simple images,
                and you need labels at high volume, Appen&apos;s platform
                is a known quantity. The case for an alternative only
                becomes clear when your data needs extend into video,
                3D, temporal annotation, or robotics-specific modalities.
              </p>
            </div>
          </div>
        </section>

        {/* ── Claru's End-to-End Approach ──────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              How Claru Solves the Physical AI Data Problem
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Where crowd labeling platforms start at annotation, Claru
              starts at capture. The entire pipeline is designed for the
              data modalities that physical AI consumes.
            </p>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Capture",
                  content:
                    "Claru operates three parallel data acquisition pipelines. Wearable camera capture deploys 10,000+ trained contributors with GoPro cameras across kitchens, workshops, warehouses, retail environments, and outdoor spaces in 100+ cities worldwide. Managed teleoperation coordinates demonstrations on client-specific robot hardware (Franka, UR5, custom rigs) with trained operators following structured task protocols. Game-based capture uses custom environments that log synchronized video and control inputs at 60 FPS, producing interaction data with perfect action labels. This first step — acquiring the raw data — is where crowd annotation platforms have no offering at all.",
                },
                {
                  step: "02",
                  title: "Enrich",
                  content:
                    "Raw video enters a multi-model enrichment pipeline before any human annotator touches it. Monocular depth estimation (Depth Anything V2) generates per-frame depth maps. Semantic segmentation (SAM3) labels every pixel with object class and instance identity. Human pose estimation (ViTPose) extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow computes dense motion fields between consecutive frames. AI-generated captions provide natural language descriptions of each clip. All enrichment outputs are cross-validated: depth consistency is checked against segmentation boundaries, pose estimates are validated against temporal smoothness constraints. This is a compute pipeline that produces the multi-modal signals robotics models consume as input features — fundamentally different from manual annotation.",
                },
                {
                  step: "03",
                  title: "Annotate",
                  content:
                    "Expert human annotators add the labels that automated systems cannot reliably produce. Action boundary annotation marks precise temporal start and end of discrete actions (reach, grasp, lift, transport, place) with sub-second precision. Object affordance labels identify graspable surfaces, support surfaces, and obstacles. Grasp type classification follows established manipulation taxonomies. Intent annotation captures what the person is trying to achieve, not just what their hand is doing. Quality scoring flags clips with occlusions, motion blur, or calibration drift. Every annotation project follows guidelines co-developed with the client's ML team — not generic rubrics handed to crowd workers.",
                },
                {
                  step: "04",
                  title: "Deliver",
                  content:
                    "Datasets are packaged in the exact format each team's training pipeline expects. WebDataset for streaming training at scale. HDF5 for dense numeric trajectories. RLDS for reinforcement learning workflows. Parquet for metadata queries and filtering. Every delivery includes enrichment layers as aligned side-channels, a manifest with checksums, and a datasheet documenting collection methodology, annotator protocols, known limitations, and intended use cases. Data is delivered via S3, GCS, or direct integration with the client's cloud infrastructure. No format conversion, no post-processing, no engineering glue code on the client side.",
                },
              ].map((phase) => (
                <div key={phase.step} className="flex gap-6">
                  <div
                    className="flex-none w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold"
                    style={{
                      backgroundColor: "rgba(146,176,144,0.15)",
                      color: "#92B090",
                    }}
                  >
                    {phase.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {phase.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof Points ─────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-10">
              Claru by the Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  stat: "3.7M+",
                  label: "Human annotations",
                  context:
                    "across egocentric video, game environments, manipulation data, and custom captures",
                },
                {
                  stat: "500K+",
                  label: "Egocentric clips",
                  context:
                    "from real kitchens, workshops, warehouses, and outdoor environments worldwide",
                },
                {
                  stat: "10,000+",
                  label: "Global contributors",
                  context:
                    "trained data collectors with wearable cameras across 100+ cities",
                },
                {
                  stat: "Days",
                  label: "Brief to delivery",
                  context:
                    "pilot datasets scoped and delivered in under a week, not months",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <div
                    className="text-3xl md:text-4xl font-bold font-mono mb-1"
                    style={{ color: "#92B090" }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-sm font-medium text-white mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {item.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Other Alternatives ─────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Other Appen Alternatives Worth Considering
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              The data infrastructure landscape for AI is broader than
              any single comparison. Here are other providers and how
              they fit depending on your use case.
            </p>

            <div className="space-y-8">
              {[
                {
                  name: "Scale AI",
                  type: "Enterprise labeling",
                  description:
                    "Scale AI is the dominant enterprise data labeling platform, strong in NLP, image annotation, and autonomous vehicle 3D labeling. Compared to Appen, Scale AI offers more advanced tooling and quality controls. Like Appen, their core model is annotation-focused — you bring the data, they label it. Best for large enterprise projects with existing data that need high-volume annotation with strong project management.",
                  link: "/compare/scale-ai-alternatives",
                  linkText: "See our Scale AI comparison",
                },
                {
                  name: "Luel (YC W26)",
                  type: "Data marketplace",
                  description:
                    "Luel is a two-sided marketplace for rights-cleared multimodal data. They connect data suppliers with AI teams and handle licensing. Strengths: strong content library, fast access to available datasets, good for video generation models. Weaknesses: no deep enrichment pipeline, no custom capture network, limited robotics-specific data. Best for teams that need licensed footage and are comfortable handling enrichment in-house.",
                  link: "/compare/claru-vs-luel",
                  linkText: "See our Luel comparison",
                },
                {
                  name: "Surge AI",
                  type: "Expert annotation",
                  description:
                    "Surge AI focuses on high-quality annotation with a curated workforce of expert labelers. Better annotation quality than Appen for complex tasks, particularly strong on RLHF and NLP. But still annotation-only — no data capture, no automated enrichment, no robotics specialization. Best for RLHF and text-heavy annotation projects where quality matters more than volume.",
                  link: "/compare/surge-ai-alternatives",
                  linkText: "See our Surge AI comparison",
                },
                {
                  name: "Labelbox",
                  type: "Data platform",
                  description:
                    "Labelbox has evolved from annotation software into a broad AI data factory with RLHF, evaluations, an expert network (Alignerr, 1.5M+ workers), and robotics data capture. Strengths: breadth across AI modalities, large expert network. Weaknesses: expanding into robotics rather than built for it from day one. Best for teams that need one vendor across NLP, image, video, and robotics data.",
                  link: "/compare/labelbox-alternatives",
                  linkText: "See our Labelbox comparison",
                },
              ].map((alt) => (
                <div
                  key={alt.name}
                  className="border-l-2 pl-6"
                  style={{ borderColor: "rgba(146,176,144,0.4)" }}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {alt.name}
                    </h3>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(146,176,144,0.15)",
                        color: "#92B090",
                      }}
                    >
                      {alt.type}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {alt.description}
                  </p>
                  {"link" in alt && alt.link && (
                    <Link
                      href={alt.link}
                      className="inline-block mt-2 text-sm font-medium transition-colors"
                      style={{ color: "#92B090" }}
                    >
                      {alt.linkText} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Making the Decision ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How to Choose: Appen, Claru, or Both
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The right choice depends on what you are building and
                what data you already have. These are not competing
                tools &mdash; they serve different parts of the AI data
                stack.
              </p>

              <p>
                <strong className="text-white">
                  Choose Appen if your project is text, speech, or
                  simple image annotation.
                </strong>{" "}
                If you need millions of sentiment labels, search
                relevance judgments, content moderation classifications,
                or multilingual text annotations, Appen&apos;s crowd
                workforce and platform are designed for exactly that.
                The per-label cost is competitive and the linguistic
                coverage is among the broadest in the industry.
              </p>

              <p>
                <strong className="text-white">
                  Choose Claru if you are building physical AI.
                </strong>{" "}
                If your model consumes egocentric video, depth maps,
                pose estimation, manipulation trajectories, or action
                labels &mdash; if you are training a robot, a world
                model, or an embodied AI agent &mdash; Claru is built
                for your specific problem. End-to-end pipeline from
                capture through enrichment through expert annotation to
                delivery in the format your training pipeline expects.
              </p>

              <p>
                <strong className="text-white">
                  Use both if you have diverse data needs.
                </strong>{" "}
                Many AI companies have both NLP/text workloads and
                physical AI workloads. Use Appen (or Scale AI, or Surge
                AI) for the text and image labeling. Use Claru for the
                robotics data, egocentric video capture, and physical
                AI enrichment. There is no reason to force one provider
                to do everything when specialization produces better
                results.
              </p>

              <p>
                The question is not &ldquo;which data labeling company
                is best&rdquo; but &ldquo;which partner is best for
                <em> this specific data modality</em>.&rdquo; For
                physical AI, the answer is a specialist that
                understands the full pipeline &mdash; not an annotation
                platform adapted from text labeling.
              </p>
            </div>
          </div>
        </section>

        {/* ── Related Resources ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Related Solutions and Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/training-data-for-robotics",
                  title: "Training Data for Robotics",
                  desc: "Purpose-built datasets for robot learning: egocentric video, manipulation, teleoperation.",
                },
                {
                  href: "/physical-ai-training-data",
                  title: "Physical AI Training Data",
                  desc: "Real-world datasets for models that understand physics and embodiment.",
                },
                {
                  href: "/egocentric-video-datasets",
                  title: "Egocentric Video Datasets",
                  desc: "First-person video capture from 10,000+ contributors worldwide.",
                },
                {
                  href: "/embodied-ai-datasets",
                  title: "Embodied AI Datasets",
                  desc: "Grounded, multi-modal datasets for agents that act in the physical world.",
                },
                {
                  href: "/compare/scale-ai-alternatives",
                  title: "Scale AI Alternatives",
                  desc: "Side-by-side comparison of Scale AI vs Claru for physical AI data.",
                },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs Luel",
                  desc: "Marketplace raw data vs. end-to-end enriched physical AI data.",
                },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "Annotation platform vs end-to-end data service for physical AI.",
                },
                {
                  href: "/compare/surge-ai-alternatives",
                  title: "Surge AI Alternatives",
                  desc: "Beyond NLP annotation: end-to-end data for robotics and world models.",
                },
                {
                  href: "/about",
                  title: "About Claru",
                  desc: "Meet the Moonvalley co-founders building physical AI data infrastructure.",
                },
                {
                  href: "/case-studies",
                  title: "Case Studies",
                  desc: "Real project outcomes with metrics and methodology documentation.",
                },
                {
                  href: "/data-catalog",
                  title: "Browse the Data Catalog",
                  desc: "Explore 25+ licensed datasets across robotics, video, and multimodal AI.",
                },
                {
                  href: "/solutions",
                  title: "All Solutions",
                  desc: "Custom data pipelines for acquisition, enrichment, annotation, and validation.",
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

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
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

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Building Physical AI? Let&apos;s Talk Data.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your model needs to learn. We will scope the
              dataset, define the collection protocol, and deliver
              training-ready data &mdash; capture through annotation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-all"
                style={{
                  backgroundColor: "#92B090",
                  color: "#0a0908",
                }}
              >
                Get Started
              </a>
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
