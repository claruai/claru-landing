import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Surge AI Alternatives for Physical AI (2026)",
  description:
    "Surge AI excels at RLHF for LLMs. But training robots needs different data. Compare Surge AI alternatives for physical AI and robotics.",
  keywords: [
    "Surge AI alternative",
    "Surge AI alternatives",
    "Surge AI competitor",
    "Surge AI vs Claru",
    "Surge AI for robotics",
    "RLHF annotation alternative",
    "physical AI training data",
    "robotics annotation service",
    "expert annotation for robots",
    "video annotation alternative",
    "AI data labeling for physical AI",
    "embodied AI annotation",
  ],
  openGraph: {
    title:
      "Surge AI Alternatives for Robotics & Physical AI Data (2026)",
    description:
      "Expert RLHF annotation for LLMs is not the same as expert annotation for robots. Compare Surge AI alternatives for physical AI training data.",
    type: "article",
    url: "https://claru.ai/compare/surge-ai-alternatives",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Surge AI Alternatives for Robotics & Physical AI — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Surge AI Alternatives for Robotics & Physical AI Data (2026)",
    description:
      "Training a robot is not like training an LLM. Compare annotation services for physical AI, robotics, and world models.",
  },
  alternates: {
    canonical: "https://claru.ai/compare/surge-ai-alternatives",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question:
      "What is the main difference between Surge AI and Claru?",
    answer:
      "Surge AI is an expert annotation service focused on NLP and RLHF tasks for large language models. They provide high-quality human annotation through a curated workforce of vetted annotators who rate chatbot responses, evaluate text quality, label sentiment, and provide preference data for RLHF training. Claru is a vertically integrated training data service for physical AI — we capture real-world video, enrich it with depth maps, pose estimation, and segmentation, and have expert annotators label action boundaries, grasp affordances, and manipulation intent. The core difference: Surge AI annotates text data for LLMs; Claru captures and annotates video data for robots, world models, and embodied AI.",
  },
  {
    question:
      "Can Surge AI annotate robotics or physical AI training data?",
    answer:
      "Surge AI's workforce is primarily trained on text-based annotation tasks: RLHF preference labeling, sentiment analysis, text classification, code review, and instruction evaluation. While their annotators are experts in language and reasoning tasks, physical AI annotation requires a fundamentally different skill set. Annotating manipulation trajectories requires understanding grasp types (power grasp, precision pinch, lateral pinch), action boundary detection with sub-second temporal precision, object affordance labeling (which surfaces are graspable, which are support structures), and spatial reasoning about 3D workspace layouts. These are not skills that transfer from text annotation. Claru's annotators are specifically trained on physical AI tasks and follow project-specific guidelines developed with each client's ML team.",
  },
  {
    question:
      "Does Surge AI provide data capture or video enrichment?",
    answer:
      "No. Surge AI is an annotation-only service. They do not capture video, do not operate a camera network, and do not provide computational enrichment layers like depth maps, pose estimation, segmentation masks, or optical flow. To use Surge AI for any video annotation task, you would need to source and collect the raw video yourself, run your own enrichment pipeline, and then send the data to Surge AI for labeling. Claru handles the entire pipeline — from deploying 10,000+ trained collectors with wearable cameras across 100+ cities, through automated multi-model enrichment (Depth Anything V2, ViTPose, SAM3), to expert human annotation of physical AI-specific labels.",
  },
  {
    question:
      "Is Surge AI good for RLHF annotation?",
    answer:
      "Yes. Surge AI is one of the best options for RLHF annotation on text-based AI systems. Their curated workforce of expert annotators produces high-quality preference ratings, instruction evaluations, and reward model training data for LLMs. If your project involves training or fine-tuning a large language model and you need expert human feedback on text outputs, Surge AI is a strong choice. The limitation appears when teams try to apply the same annotation approach to physical AI — rating robot manipulation sequences requires different expertise than rating chatbot responses.",
  },
  {
    question:
      "When should I choose Surge AI over Claru?",
    answer:
      "Choose Surge AI when your project involves NLP annotation (sentiment, intent, entity extraction), RLHF preference labeling for large language models, code quality evaluation and annotation, text classification or content quality rating, or instruction-following evaluation for chatbots. Choose Claru when your project involves robotics training data (egocentric video, manipulation, teleoperation), world model training (video with depth, segmentation, and temporal structure), physical AI annotation (grasp types, affordances, action boundaries), or any use case that requires data capture and enrichment before annotation.",
  },
  {
    question:
      "How do annotation quality standards differ between NLP and physical AI?",
    answer:
      "NLP annotation quality is typically measured by inter-annotator agreement on discrete labels: does annotator A agree with annotator B that response X is better than response Y? The quality framework revolves around consistency, calibration, and bias detection in categorical judgments. Physical AI annotation quality involves entirely different metrics: temporal precision of action boundaries (measured in milliseconds), spatial accuracy of affordance labels (measured in pixels), consistency of grasp type taxonomies across annotators, and physical plausibility of intent inferences. A skilled RLHF annotator who can reliably distinguish a helpful chatbot response from a harmful one may have no ability to identify whether a power grasp or precision pinch is appropriate for a given object. The expertise does not transfer.",
  },
  {
    question:
      "What formats does Claru deliver that Surge AI does not support?",
    answer:
      "Surge AI delivers annotation outputs in standard text and JSON formats suitable for NLP and LLM training pipelines. Claru delivers data in the formats robotics and physical AI teams use: WebDataset for streaming video training at scale, HDF5 for dense numeric arrays and manipulation trajectories, RLDS/TFDS for reinforcement learning pipelines, and Parquet for tabular metadata queries. Every Claru delivery includes enrichment layers (depth maps, segmentation masks, pose estimates, optical flow) as aligned side-channels — not just annotation labels. These enrichment layers are training inputs for the model, not just metadata. Surge AI's output is labels; Claru's output is a complete training dataset.",
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

const comparisonRows = [
  {
    dimension: "Core Focus",
    surge:
      "Expert annotation for NLP, RLHF, code, and text quality — LLM training data",
    claru:
      "End-to-end training data for physical AI: capture, enrich, annotate, deliver",
  },
  {
    dimension: "Data Capture",
    surge:
      "None — annotation-only service; you must source and provide the data",
    claru:
      "10,000+ trained collectors with wearable cameras across 100+ cities; managed teleoperation; game-based capture",
  },
  {
    dimension: "Enrichment",
    surge:
      "None — no computational enrichment pipeline for video or images",
    claru:
      "6 automated layers: depth maps, pose estimation, segmentation, optical flow, AI captions — all cross-validated",
  },
  {
    dimension: "Annotation Workforce",
    surge:
      "Curated expert annotators — vetted for language, reasoning, and code tasks",
    claru:
      "Expert annotators trained on physical AI: grasp types, affordances, action boundaries, manipulation intent",
  },
  {
    dimension: "Modalities",
    surge:
      "Text, code, chat logs, instruction-response pairs — primarily language",
    claru:
      "Video, depth maps, pose data, segmentation masks, trajectories — physical AI modalities",
  },
  {
    dimension: "RLHF Capability",
    surge:
      "Industry-leading for text-based RLHF: preference pairs, reward model training, instruction evaluation",
    claru:
      "RLHF for video and physical AI: preference ranking of video clips, robot behavior evaluation, world model outputs",
  },
  {
    dimension: "Delivery Formats",
    surge:
      "JSON, CSV — standard text annotation exports for NLP pipelines",
    claru:
      "WebDataset, HDF5, RLDS, Parquet, COCO — robotics-native formats with enrichment side-channels",
  },
  {
    dimension: "Pricing",
    surge:
      "Per-task or project-based; premium for expert quality",
    claru:
      "Project-based; capture + enrichment + annotation bundled; no long-term commitments",
  },
  {
    dimension: "Best For",
    surge:
      "LLM training teams that need high-quality text annotation and RLHF data",
    claru:
      "Robotics, world model, and embodied AI teams that need the full data pipeline",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function SurgeAIAlternativesPage() {
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
                  Surge AI Alternatives
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Surge AI Alternatives for Robotics and Physical AI
              Training Data
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://surgehq.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                Surge AI
              </a>{" "}
              pioneered expert-quality RLHF annotation for
              LLMs &mdash; and they are great at it. But training a
              robot is not like training a chatbot. You cannot annotate
              manipulation trajectories with the same workforce that
              rates conversation quality.{" "}
              <Link
                href="/physical-ai-training-data"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                Physical AI
              </Link>{" "}
              needs
              domain-specific collectors, enrichment pipelines, and
              annotators who understand grasp types, not grammar.
            </p>
          </div>
        </section>

        {/* ── The LLM vs. Physical AI Data Gap ───────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why LLM Annotation Expertise Does Not Transfer to
              Physical AI
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Surge AI built their reputation on a crucial insight:
                annotation quality matters more than annotation
                volume. For RLHF, a small number of expert-quality
                preference labels is more valuable than millions of
                noisy crowd-sourced ratings. This is correct, and it
                is why Surge AI is one of the best options for LLM
                training data.
              </p>

              <p>
                The same principle applies to physical AI &mdash;
                quality over quantity &mdash; but the{" "}
                <strong className="text-white">
                  definition of quality is entirely different
                </strong>
                . An expert RLHF annotator can reliably judge whether
                a chatbot response is helpful, harmless, and honest.
                That same annotator, shown a video of a robotic arm
                grasping a coffee mug, would struggle to answer:
                Is this a power grasp or a precision pinch? Where
                does the &ldquo;reach&rdquo; action end and the
                &ldquo;grasp&rdquo; action begin? Is the approach
                vector appropriate for the object&apos;s center of
                mass? These questions require physical intuition and
                domain knowledge that text annotation does not
                develop.
              </p>

              <p>
                Beyond annotation skills, physical AI introduces
                entirely new pipeline stages that text-focused
                annotation services do not operate. Before any human
                touches the data, it needs to be{" "}
                <strong className="text-white">captured</strong>{" "}
                (<Link
                  href="/egocentric-video-datasets"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  egocentric video from real environments
                </Link>) and{" "}
                <strong className="text-white">enriched</strong>{" "}
                (depth maps, pose estimation, segmentation, optical
                flow). Surge AI provides neither of these stages.
                Their pipeline starts at annotation;{" "}
                <Link
                  href="/about"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Claru&apos;s pipeline
                </Link>{" "}
                starts at capture.
              </p>

              <p>
                This is not a criticism of Surge AI &mdash; they are
                excellent at what they do. It is a recognition that
                NLP annotation and physical AI annotation are
                different disciplines that require different
                companies with different infrastructure, different
                workforces, and different domain expertise.
              </p>
            </div>
          </div>
        </section>

        {/* ── What Makes Physical AI Annotation Different ─────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              What Makes Physical AI Annotation Fundamentally Different
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Text annotation and physical AI annotation differ in
              almost every dimension: the data format, the required
              expertise, the quality metrics, and the upstream
              infrastructure needed to make annotation possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Temporal Precision Over Categorical Agreement",
                  description:
                    "NLP annotation produces categorical judgments: is this response better or worse? Physical AI annotation produces temporal labels: the 'reach' action starts at frame 142 and ends at frame 287, the 'grasp' begins at frame 288. Quality is measured in milliseconds of boundary accuracy, not inter-annotator agreement on categories. Getting these boundaries wrong by even 200ms can teach a robot the wrong timing for contact.",
                },
                {
                  title: "Spatial and Geometric Reasoning",
                  description:
                    "Text annotators reason about language. Physical AI annotators reason about 3D space — which surfaces are graspable, what is the approach vector, where is the object's center of mass, is the gripper orientation compatible with the grasp type. This requires spatial intuition that comes from understanding physical manipulation, not from reading and evaluating text.",
                },
                {
                  title: "Domain-Specific Taxonomies",
                  description:
                    "RLHF annotation uses taxonomies like helpful/harmless/honest or a 1-5 quality scale. Physical AI annotation uses taxonomies from robotics research: grasp types (power, precision, lateral, hook), manipulation primitives (reach, grasp, lift, transport, place, pour, stir), and object affordances (graspable, stackable, pourable, containable). Annotators must learn and reliably apply these domain-specific classification systems.",
                },
                {
                  title: "Multi-Modal Annotation Alignment",
                  description:
                    "NLP annotation operates on text — a single modality. Physical AI annotation must be aligned across multiple modalities simultaneously: RGB video, depth maps, segmentation masks, pose estimates, and action labels must all correspond at the frame level. Annotators need to reference enrichment layers while making labeling decisions, and their annotations must be spatially and temporally consistent with the automated enrichment.",
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

        {/* ── Comparison Table ────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Surge AI vs. Claru: Side-by-Side Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-4xl">
              This comparison focuses on what matters for physical AI
              and robotics teams. For NLP, RLHF, and LLM training
              data, Surge AI is an excellent choice &mdash; the gaps
              appear when the project involves video, robotics, or
              embodied AI.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[140px]">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[220px]">
                      Surge AI
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider min-w-[220px]"
                      style={{ color: "#92B090" }}
                    >
                      Claru
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.dimension}
                      className={
                        i % 2 === 0
                          ? "bg-transparent"
                          : "bg-white/[0.02]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-white align-top">
                        {row.dimension}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.surge}
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

        {/* ── When Surge AI Is the Right Choice ──────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When Surge AI Is the Right Choice
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                Surge AI is a strong company that does important work.
                If your project matches these profiles, they are
                likely the better choice:
              </p>

              <ul className="space-y-4 list-none pl-0">
                {[
                  {
                    title: "RLHF for large language models",
                    desc: "If you are training or fine-tuning an LLM and need expert human preference labels — response quality, helpfulness, safety ratings — Surge AI's curated workforce is purpose-built for this. Their annotators understand language nuance and can provide the calibrated judgments that reward models need.",
                  },
                  {
                    title: "Text and code annotation",
                    desc: "Sentiment analysis, named entity recognition, intent classification, code review, instruction evaluation. These are Surge AI's core competencies, and their quality on these tasks consistently exceeds crowd-sourced alternatives.",
                  },
                  {
                    title: "Quality over volume for NLP",
                    desc: "When you need 10,000 expert-quality preference labels rather than 1 million noisy ones, Surge AI's model — expert annotators, careful curation, quality control — delivers the precision that matters for reward model training.",
                  },
                  {
                    title: "Instruction tuning datasets",
                    desc: "Building or curating instruction-following datasets for LLM fine-tuning. Surge AI's annotators can evaluate whether model responses follow instructions, identify failure modes, and provide the human feedback that improves model behavior.",
                  },
                  {
                    title: "Content quality evaluation",
                    desc: "Evaluating and scoring text content for quality, factuality, tone, and style. This is annotation work that requires reading comprehension and critical thinking — skills that Surge AI's expert workforce demonstrably has.",
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
                If your annotation needs are primarily text-based and
                your models are language models, Surge AI is a strong
                partner. The alternative search makes sense only when
                your data needs cross into physical AI territory.
              </p>
            </div>
          </div>
        </section>

        {/* ── When You Need a Physical AI Specialist ─────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When You Need a Physical AI Data Specialist
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The transition from text annotation to physical AI
                data introduces requirements that no NLP annotation
                service can address. If your project involves any of
                the following, you need a specialist:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Your model learns from video, not text",
                  description:
                    "Vision-language-action (VLA) models, world models, and robot manipulation policies learn from video sequences — not from text-response pairs. The annotation challenge is spatial and temporal, not linguistic. You need annotators who can identify action boundaries in manipulation sequences, not annotators who can rate chatbot quality.",
                },
                {
                  title: "You need data captured, not just labeled",
                  description:
                    "Physical AI teams often lack the raw training data entirely. You cannot send a text file to Surge AI and get back annotated manipulation trajectories — the video of those manipulation sequences needs to be physically captured in real environments first. This requires a collector network, not an annotation workforce.",
                },
                {
                  title: "Your pipeline needs enrichment layers",
                  description:
                    "Robotics models consume depth maps, pose estimation, segmentation masks, and optical flow as input features for training. These computational enrichment layers must be generated at scale before annotation begins. No text annotation service provides this infrastructure.",
                },
                {
                  title: "Your annotations must align with multi-modal data",
                  description:
                    "Physical AI annotation is not labeling in isolation — annotators must reference depth maps, segmentation overlays, and pose estimates while making labeling decisions. The annotation interface needs to present multiple data modalities simultaneously, which text annotation platforms are not designed to do.",
                },
                {
                  title: "You need robotics-native delivery formats",
                  description:
                    "Your training pipeline expects WebDataset, HDF5, RLDS, or Parquet with aligned enrichment side-channels. Text annotation services deliver JSON or CSV. The format gap requires significant engineering to bridge, and the enrichment layers do not exist in text annotation outputs.",
                },
                {
                  title: "You are training robots or world models",
                  description:
                    "If your end product is a robot policy, a world model, or an embodied AI agent — not a chatbot or a text classifier — you need a data partner whose entire infrastructure is built for physical AI. The data modalities, annotation expertise, enrichment pipelines, and delivery formats are all different.",
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

        {/* ── Claru's Full Pipeline ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s Approach: Capture, Enrich, Annotate, Deliver
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Where text annotation services operate one stage of the
              pipeline, Claru operates all four. This is what
              end-to-end means for physical AI training data.
            </p>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Capture",
                  content:
                    "Three parallel data acquisition pipelines run continuously. Wearable camera capture deploys 10,000+ trained contributors with GoPro cameras across kitchens, workshops, warehouses, retail environments, and outdoor spaces in 100+ cities worldwide. Managed teleoperation coordinates demonstrations on client-specific robot hardware with trained operators following structured task protocols. Game-based capture uses custom environments that log synchronized video and control inputs at 60 FPS, producing interaction data with perfect action labels. No annotation service — Surge AI or otherwise — provides this capability.",
                },
                {
                  step: "02",
                  title: "Enrich",
                  content:
                    "Every clip passes through a multi-model enrichment pipeline before human annotation begins. Monocular depth estimation (Depth Anything V2) generates per-frame depth maps. Semantic segmentation (SAM3) labels every pixel with object class and instance identity. Human pose estimation (ViTPose) extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow computes dense motion fields between consecutive frames. AI-generated captions provide natural language descriptions. All enrichment outputs are cross-validated for physical consistency. These enrichment layers become training inputs for the model — they are not annotation outputs.",
                },
                {
                  step: "03",
                  title: "Annotate",
                  content:
                    "Expert human annotators — trained specifically on physical AI tasks — add labels that automated systems cannot reliably produce. Action boundary annotation marks discrete actions (reach, grasp, lift, transport, place) with sub-second temporal precision. Object affordance labels identify graspable surfaces, support structures, and obstacles. Grasp type classification follows robotics taxonomies. Intent annotation captures what the person is trying to achieve. Quality scoring flags problematic clips. Every project uses guidelines co-developed with the client's ML team. This is where Surge AI's RLHF expertise does not transfer — the annotation requires physical domain knowledge, not language reasoning.",
                },
                {
                  step: "04",
                  title: "Deliver",
                  content:
                    "Datasets ship in the formats robotics pipelines consume: WebDataset for streaming training, HDF5 for dense trajectories, RLDS for reinforcement learning, Parquet for metadata queries. Every delivery includes enrichment layers as aligned side-channels, a manifest with checksums, and a datasheet documenting collection methodology, annotator demographics, known limitations, and intended use cases. Data is delivered via S3, GCS, or direct cloud integration. The output is not labels on text — it is a complete, multi-modal training dataset ready for policy training.",
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

        {/* ── Proof Points ──────────────────────────────────────────── */}
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

        {/* ── The Multimodal Future ──────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              The Multimodal Shift: Why Annotation Services Are
              Splitting by Modality
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The AI training data industry is undergoing a
                structural shift. In the LLM era (2022-2025), the
                primary annotation need was text-based: RLHF
                preference labels, instruction evaluation, content
                quality scoring. Companies like Surge AI thrived
                because they matched expert-quality annotators to
                expert-level linguistic tasks.
              </p>

              <p>
                The physical AI era &mdash; driven by advances like{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  NVIDIA&apos;s physical AI platform
                </a>{" "}
                and benchmarks such as{" "}
                <a
                  href="https://robotics-transformer-x.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Open X-Embodiment
                </a>{" "}
                &mdash; introduces fundamentally
                different data requirements. World models need video
                with temporal structure. Robot policies need
                manipulation demonstrations with action labels.
                Embodied agents need{" "}
                <Link
                  href="/egocentric-video-datasets"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  egocentric video
                </Link>{" "}
                with spatial
                annotations. The{" "}
                <strong className="text-white">
                  data itself is different
                </strong>
                , the{" "}
                <strong className="text-white">
                  annotation expertise is different
                </strong>
                , and the{" "}
                <strong className="text-white">
                  infrastructure required to produce it is different
                </strong>
                .
              </p>

              <p>
                This is not a failure of text annotation services
                &mdash; it is the natural result of AI expanding
                beyond language. Just as the shift from rule-based
                systems to neural networks created demand for data
                labeling companies, the shift from language models to
                physical AI is creating demand for a new type of data
                partner: one that captures, enriches, annotates, and
                delivers multi-modal training data for models that
                act in the physical world.
              </p>

              <p>
                The future is likely a portfolio approach: Surge AI
                for text and RLHF. Claru for physical AI and
                robotics. Specialized providers for each modality,
                rather than one generalist for everything. The
                question is not which service to choose &mdash; it is
                which service for which part of your training data
                portfolio.
              </p>
            </div>
          </div>
        </section>

        {/* ── Other Alternatives ─────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Other Alternatives Worth Considering
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Depending on your data needs, these other providers may
              also be relevant. Each has different strengths.
            </p>

            <div className="space-y-8">
              {[
                {
                  name: "Scale AI",
                  type: "Enterprise labeling",
                  description:
                    "Scale AI offers enterprise-scale data annotation with a massive workforce. Unlike Surge AI's quality-first approach, Scale AI optimizes for volume and breadth across NLP, image, video, and autonomous vehicle annotation. Strengths: proven at massive scale, broad modality coverage, strong enterprise tooling. Weaknesses: annotation-only (no capture or enrichment), not specialized for physical AI, expensive enterprise contracts. Best for large-volume annotation projects where you already have the raw data.",
                  link: "/compare/scale-ai-alternatives",
                  linkText: "See our Scale AI comparison",
                },
                {
                  name: "Labelbox",
                  type: "Annotation platform",
                  description:
                    "Labelbox has evolved from an annotation platform into a broad AI data factory. They now offer RLHF data, custom evaluations, an expert network (Alignerr, 1.5M+ workers), and robotics data capture with teleoperation. Strengths: breadth across AI modalities, large expert network, model evaluations. Weaknesses: breadth over depth — expanding into robotics rather than built for it. Best for teams that need one vendor across NLP, image, video, and robotics data.",
                  link: "/compare/labelbox-alternatives",
                  linkText: "See our Labelbox comparison",
                },
                {
                  name: "Appen",
                  type: "Crowd labeling",
                  description:
                    "Appen is a legacy crowd-sourced annotation provider with a massive global workforce. Strengths: linguistic diversity, global reach, broad task coverage. Weaknesses: quality has declined in recent years, no physical AI specialization, annotation-only model. Best for high-volume, cost-sensitive NLP and image labeling where perfect quality is less critical than coverage and scale.",
                  link: "/compare/appen-alternatives",
                  linkText: "See our Appen comparison",
                },
                {
                  name: "Luel (YC W26)",
                  type: "Data marketplace",
                  description:
                    "Luel is a two-sided marketplace for rights-cleared multimodal data. Unlike annotation services, Luel provides the raw data itself. Strengths: fast access to licensed video and image content, rights-cleared for training. Weaknesses: no enrichment pipeline, no annotation service, raw data only. Best for teams that need licensed footage for video generation models and will handle enrichment and annotation in-house.",
                  link: "/compare/claru-vs-luel",
                  linkText: "See our Luel comparison",
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

        {/* ── Making the Decision ────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              How to Choose the Right Data Partner for Your Modality
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The decision tree is straightforward once you
                identify your primary data modality and pipeline
                needs.
              </p>

              <p>
                <strong className="text-white">
                  If your model consumes text:
                </strong>{" "}
                Surge AI for expert RLHF and quality annotation.
                Scale AI for high-volume NLP labeling. Appen for
                cost-sensitive multilingual annotation. These are all
                strong choices for language-focused AI.
              </p>

              <p>
                <strong className="text-white">
                  If your model consumes images (not video):
                </strong>{" "}
                Scale AI or Labelbox for standard annotation
                (bounding boxes, segmentation, classification). V7
                for auto-labeling-heavy workflows. These platforms
                are mature for static image tasks.
              </p>

              <p>
                <strong className="text-white">
                  If your model consumes video with physical
                  structure:
                </strong>{" "}
                Claru for end-to-end capture, enrichment, and
                annotation. This is where the gap between text/image
                annotation services and physical AI data services
                becomes too wide to bridge. You need a partner that
                captures real-world video, computes depth and pose
                and segmentation, and annotates with physical AI
                domain expertise.
              </p>

              <p>
                Many teams use multiple providers. Surge AI for RLHF
                on their language model components. Claru for
                robotics and embodied AI data. The question is not
                &ldquo;which one provider for everything&rdquo; but
                &ldquo;which provider for each data modality in your
                training stack.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ── Related Resources ──────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
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
                  desc: "Specialized training data providers for physical AI teams.",
                },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "End-to-end data infrastructure vs. annotation platforms.",
                },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives",
                  desc: "Crowd labeling vs. physical AI specialization for robotics data.",
                },
                {
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs Luel",
                  desc: "Marketplace raw data vs. end-to-end enriched physical AI data.",
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

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
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

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Building Physical AI? Let&apos;s Talk Data.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Tell us what your model needs to learn. We will scope
              the dataset, define the collection protocol, and deliver
              training-ready data &mdash; from capture through expert
              annotation.
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
