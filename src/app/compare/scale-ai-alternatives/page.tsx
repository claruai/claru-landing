import type { Metadata } from "next";
import Link from "next/link";
import GeoPageShell from "@/app/components/content/GeoPageShell";

// =============================================================================
// META
// =============================================================================

export const metadata: Metadata = {
  title:
    "Scale AI Alternatives for Physical AI Data (2026)",
  description:
    "Scale AI alternatives for robotics and physical AI. See how Claru, Luel, and Appen compare on capture, enrichment, specialization, and pricing.",
  keywords: [
    "Scale AI alternative",
    "Scale AI alternatives",
    "Scale AI competitor",
    "Scale AI vs Claru",
    "physical AI training data",
    "robotics training data alternative",
    "data labeling alternative",
    "AI data annotation companies",
    "Scale AI for robotics",
    "embodied AI data labeling",
  ],
  openGraph: {
    title:
      "Scale AI Alternatives for Physical AI Training Data (2026)",
    description:
      "Comparing Scale AI alternatives for robotics and physical AI. Data capture, enrichment depth, specialization, speed, and pricing across vendors.",
    type: "article",
    url: "https://claru.ai/compare/scale-ai-alternatives",
    siteName: "Claru",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Scale AI Alternatives for Physical AI Training Data — Claru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale AI Alternatives for Physical AI Training Data (2026)",
    description:
      "Side-by-side comparison of Scale AI, Claru, Luel, and Appen for robotics and physical AI training data.",
  },
  alternates: {
    canonical: "https://claru.ai/compare/scale-ai-alternatives",
  },
};

// =============================================================================
// FAQ JSON-LD
// =============================================================================

const faqItems = [
  {
    question: "Why do physical AI teams look for Scale AI alternatives?",
    answer:
      "Scale AI is an excellent platform for broad AI data labeling — NLP, image classification, and autonomous vehicle annotation. However, physical AI teams building robotics, embodied AI, and world models need more than annotation. They need end-to-end data pipelines that include real-world video capture, multi-modal enrichment (depth maps, pose estimation, segmentation), and expert annotation of intent, affordance, and edge cases. Scale AI's model is annotation-only: you provide the data, they label it. Teams that need capture-through-delivery often find that a specialist like Claru is faster and more cost-effective for their specific use case.",
  },
  {
    question: "How does Claru differ from Scale AI for robotics data?",
    answer:
      "Claru is purpose-built for physical AI data. Unlike Scale AI's annotation-only model, Claru operates the full pipeline: capture (10,000+ contributors with wearable cameras across 100+ cities), enrichment (depth maps via Depth Anything V2, pose estimation via ViTPose, segmentation via SAM3, optical flow), expert human annotation (action boundaries, object affordances, grasp types), and delivery in formats like WebDataset, HDF5, and RLDS. Scale AI labels data you already have; Claru builds the dataset from scratch if needed, or enriches and annotates your existing footage.",
  },
  {
    question: "Is Scale AI too expensive for physical AI startups?",
    answer:
      "Scale AI's pricing is designed for large enterprise contracts, often with annual commitments and six-figure minimums. For physical AI startups and growth-stage robotics companies, this can be prohibitive — especially when the project scope is narrower (e.g., 10,000 annotated manipulation clips rather than millions of image labels). Claru offers project-based pricing without long-term commitments, with turnaround measured in days rather than months. Many teams find that Claru's end-to-end approach (capture + enrichment + annotation) is more cost-effective than sourcing raw data separately and then paying Scale AI to annotate it.",
  },
  {
    question: "Can Claru handle the same volume as Scale AI?",
    answer:
      "Scale AI has a larger total workforce, which matters for high-volume NLP and image classification projects. For physical AI data, volume requirements are different — robotics teams typically need 5,000 to 500,000 high-quality demonstrations rather than millions of simple labels. Claru has delivered 3.7M+ annotations, 500K+ egocentric video clips, and manages 10,000+ contributors worldwide. For the volume ranges that physical AI teams actually need, Claru matches or exceeds Scale AI's throughput while maintaining the domain expertise that robotics data requires.",
  },
  {
    question:
      "When should I use Scale AI instead of a physical AI specialist?",
    answer:
      "Scale AI is the right choice when you need large-scale annotation of existing data for NLP, image classification, content moderation, or 2D autonomous vehicle labeling. If your project is primarily text or image data, if you already have the raw data collected, and if your annotation task can be handled by general crowd workers following a rubric, Scale AI's infrastructure and workforce are hard to beat. Choose a specialist like Claru when your project involves 3D/video data, requires domain-specific capture, needs enrichment layers beyond simple labels, or involves physical AI modalities that general annotators cannot reliably handle.",
  },
  {
    question: "What formats does Claru deliver physical AI datasets in?",
    answer:
      "Claru delivers data in the formats robotics and physical AI teams actually use. Standard options include WebDataset for streaming training, HDF5 for dense numeric arrays and trajectories, RLDS/TFDS for reinforcement learning pipelines, Parquet for tabular metadata and annotation queries, and COCO JSON for detection and segmentation tasks. Video is delivered as MP4 (H.264/H.265) or extracted frames in PNG/WebP. Every delivery includes enrichment layers (depth, segmentation, pose) as aligned side-channels, a manifest with checksums, and a datasheet documenting methodology and limitations. Custom formats and direct S3/GCS delivery are available.",
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
    dim: "Primary Focus",
    scale: "General-purpose data labeling across NLP, image, video, and autonomous vehicles",
    claru: "100% focused on physical AI: training data for robotics, world models, and embodied AI — nothing else",
    luel: "Rights-cleared multimodal data marketplace (launched 2026)",
    appen: "Crowd-sourced data labeling across broad AI use cases",
  },
  {
    dim: "Data Capture",
    scale: "Annotation-only — you provide the raw data",
    claru: "End-to-end: 10,000+ contributors with wearable cameras across 100+ cities capture real-world video",
    luel: "Marketplace model — connects buyers with data suppliers",
    appen: "Limited capture — primarily an annotation workforce",
  },
  {
    dim: "Enrichment Pipeline",
    scale: "Basic annotation outputs (bounding boxes, segmentation, text labels)",
    claru: "Multi-model enrichment: depth maps, pose estimation, segmentation masks, optical flow, AI captions — all cross-validated",
    luel: "Metadata and rights management; no deep enrichment pipeline",
    appen: "Manual annotation only; no automated enrichment",
  },
  {
    dim: "Robotics Specialization",
    scale: "Some robotics clients, but same general platform and workforce",
    claru: "Built for robotics: egocentric video, manipulation trajectories, teleoperation data, action boundary annotation",
    luel: "General multimodal focus; no robotics-specific tooling",
    appen: "No robotics specialization",
  },
  {
    dim: "Annotation Expertise",
    scale: "Large crowd workforce with project-specific training; strong on NLP and 2D tasks",
    claru: "Expert annotators trained on physical AI: grasp types, object affordances, intent labeling, edge cases",
    luel: "Data suppliers handle their own annotation",
    appen: "Crowd workers across 170+ countries; general-purpose task-trained workforce",
  },
  {
    dim: "Speed to Delivery",
    scale: "Weeks to months for custom projects; enterprise onboarding can take 4-8 weeks",
    claru: "Brief to first delivery in days; pilot datasets in under a week",
    luel: "Depends on marketplace supply; fast for available datasets, slow for custom",
    appen: "Weeks to months; similar to Scale AI for custom work",
  },
  {
    dim: "Pricing Model",
    scale: "Enterprise contracts; annual commitments typical; six-figure minimums common",
    claru: "Project-based pricing; no long-term commitments; scoped to your dataset",
    luel: "Per-dataset or per-clip marketplace pricing",
    appen: "Enterprise and self-serve tiers; per-task pricing",
  },
  {
    dim: "Delivery Formats",
    scale: "JSON, CSV, COCO — standard annotation formats",
    claru: "WebDataset, HDF5, RLDS, Parquet, COCO — formats robotics pipelines consume",
    luel: "Raw media files with metadata; limited format flexibility",
    appen: "JSON, CSV — standard annotation exports",
  },
];

// =============================================================================
// PAGE
// =============================================================================

export default function ScaleAIAlternativesPage() {
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
                  Scale AI Alternatives
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-white">
              Scale AI Alternatives: Specialized Training Data for
              Physical AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              <a
                href="https://scale.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                Scale AI
              </a>{" "}
              is the best in the world at enterprise data
              labeling for NLP, image classification, and autonomous
              vehicles. But if you are building robots, world models,
              or{" "}
              <Link
                href="/embodied-ai-datasets"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                embodied AI
              </Link>{" "}
              &mdash; you need a specialist. Claru is
              the only company 100% focused on{" "}
              <Link
                href="/training-data-for-robotics"
                style={{ color: "#92B090" }}
                className="underline underline-offset-2"
              >
                training data for robotics
              </Link>{" "}
              and physical AI.
            </p>
          </div>
        </section>

        {/* ── Why Teams Look for Alternatives ──────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              Why Physical AI Teams Look for Scale AI Alternatives
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                <a
                  href="https://scale.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Scale AI
                </a>{" "}
                is a strong company. They pioneered the modern
                data labeling industry and have served thousands of AI
                teams across NLP, image classification, content
                moderation, and autonomous vehicles. For those use
                cases, Scale AI remains one of the best options
                available. Use Scale for your LLM training. Use Scale
                for your image classifier. They are excellent at what
                they do.
              </p>

              <p>
                But physical AI is a fundamentally different problem.
                Teams building robotics systems, embodied AI agents,
                and world models do not just need{" "}
                <strong className="text-white">annotation</strong>{" "}
                &mdash; they need{" "}
                <strong className="text-white">data</strong>. The raw
                footage itself is the bottleneck. You cannot train a
                manipulation policy by labeling ImageNet. You need
                egocentric video of real people performing real tasks in
                real environments, enriched with depth maps and pose
                estimation, then annotated by humans who understand
                grasp affordances and action boundaries.
              </p>

              <p>
                This is not a criticism of Scale AI &mdash; it is a
                recognition that physical AI is a different domain with
                different requirements, as{" "}
                <a
                  href="https://www.nvidia.com/en-us/ai/physical-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  NVIDIA&apos;s physical AI initiative
                </a>{" "}
                and research benchmarks like{" "}
                <a
                  href="https://ego4d-data.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Ego4D
                </a>{" "}
                have made clear. Scale AI&apos;s workflow assumes
                you bring the data and they annotate it. That works
                when your data is text or web-scraped images. It does
                not work when the data itself &mdash; real-world video
                from specific environments, captured with specific
                hardware, at specific temporal resolution &mdash; is
                what you are missing.
              </p>

              <p>
                Claru exists because frontier labs kept asking for this.{" "}
                <Link
                  href="/about"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  Our team
                </Link>{" "}
                built the physical AI data capability inside
                Moonvalley ($154M raised), where they captured and
                enriched hundreds of thousands of real-world clips for
                world model training. When external labs started asking
                for the same infrastructure, Claru spun out as a
                standalone company &mdash; 100% focused on{" "}
                <Link
                  href="/physical-ai-training-data"
                  style={{ color: "#92B090" }}
                  className="underline underline-offset-2"
                >
                  training data for physical AI
                </Link>. No voice annotation. No text
                labeling. No generic image classification. Every
                collector, every enrichment pipeline, every annotation
                layer is purpose-built for robots, world models, and
                embodied AI.
              </p>
            </div>
          </div>
        </section>

        {/* ── The Annotation-Only Gap ──────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              The Annotation-Only Gap
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              Most data labeling companies &mdash; Scale AI included
              &mdash; operate on a simple model: you upload your data,
              they annotate it, you download the labels. For physical
              AI, this leaves critical gaps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "No Data Capture",
                  description:
                    "If you do not have the raw video, you cannot use an annotation service. Physical AI teams need someone to capture the footage in the first place — egocentric video from real environments, teleoperation demonstrations, multi-view recordings. Scale AI does not do this.",
                },
                {
                  title: "No Deep Enrichment",
                  description:
                    "Modern robotics pipelines need more than bounding boxes and segmentation masks drawn by hand. They need monocular depth estimation, 2D/3D pose estimation, optical flow, and AI-generated descriptions — all computed at scale and cross-validated against each other. Annotation platforms do not provide this.",
                },
                {
                  title: "No Domain Specialization",
                  description:
                    "Annotating a grasp affordance is not the same as drawing a bounding box. Physical AI annotation requires understanding of contact physics, manipulation primitives, action boundaries, and embodiment constraints. General crowd workers, even well-trained ones, miss the nuances.",
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
              Scale AI vs. Claru vs. Luel vs. Appen: Side-by-Side
              Comparison
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-4xl">
              This comparison focuses on dimensions that matter for
              physical AI and robotics teams. For NLP or image
              classification, the picture looks different &mdash; Scale
              AI and Appen are strong choices for those use cases.
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[120px]">
                      Dimension
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[180px]">
                      Scale AI
                    </th>
                    <th
                      className="px-4 py-3 font-mono text-xs uppercase tracking-wider min-w-[180px]"
                      style={{ color: "#92B090" }}
                    >
                      Claru
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[180px]">
                      Luel
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/50 min-w-[180px]">
                      Appen
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
                        {row.scale}
                      </td>
                      <td
                        className="px-4 py-3 align-top"
                        style={{ color: "rgba(146,176,144,0.9)" }}
                      >
                        {row.claru}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.luel}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {row.appen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── When Scale AI Makes Sense ─────────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When Scale AI Is the Right Choice
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                We are not here to say Scale AI is bad &mdash; they are
                not. For certain project profiles, Scale AI is the clear
                winner. Here is when you should use them:
              </p>

              <ul className="space-y-4 list-none pl-0">
                {[
                  {
                    title: "High-volume NLP annotation",
                    desc: "If you need millions of text labels (sentiment, intent, entity extraction), Scale AI's crowd workforce and tooling are purpose-built for this.",
                  },
                  {
                    title: "Image classification at scale",
                    desc: "Labeling millions of images with categories, bounding boxes, or polygon segmentation. Scale AI's annotation platform handles this efficiently with strong quality controls.",
                  },
                  {
                    title: "Autonomous vehicle 2D/3D labeling",
                    desc: "Scale AI has deep experience in AV annotation — lidar point clouds, lane markings, traffic sign classification. Their tooling is mature for this domain.",
                  },
                  {
                    title: "Content moderation labeling",
                    desc: "When you need to classify content at scale for trust and safety applications, Scale AI's workforce and moderation tooling are well-established.",
                  },
                  {
                    title: "You already have the raw data",
                    desc: "If your data is already collected and you just need annotation, Scale AI's pure labeling model is a strong fit. The gap only appears when you also need capture and enrichment.",
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
                If your project fits any of these profiles, Scale AI is
                a solid choice. The alternative search only makes sense
                when your data needs go beyond what a labeling platform
                provides.
              </p>
            </div>
          </div>
        </section>

        {/* ── When You Need a Specialist ────────────────────────────── */}
        <section className="w-full py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-8">
              When You Need a Physical AI Data Specialist
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The shift from annotation-as-a-service to end-to-end
                data infrastructure becomes necessary when your project
                has any of these characteristics:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "You need the raw data captured",
                  description:
                    "Your training pipeline needs egocentric video, teleoperation demonstrations, or multi-view recordings from real environments. You cannot just upload existing data because it does not exist yet. You need a partner with a global capture network.",
                },
                {
                  title: "Your data needs enrichment, not just labels",
                  description:
                    "Robotics models consume depth maps, pose estimation, optical flow, and segmentation masks as input features — not just annotations on top of RGB. You need a pipeline that computes these enrichment layers at scale, cross-validates them, and delivers them as aligned side-channels.",
                },
                {
                  title: "Your annotation requires domain expertise",
                  description:
                    "Action boundary annotation, grasp type classification, object affordance labeling, and intent inference require annotators who understand manipulation physics and embodiment constraints. General crowd workers, even with good instructions, produce unreliable labels for these tasks.",
                },
                {
                  title: "You are building a world model",
                  description:
                    "World models need diverse, high-quality video with rich temporal structure — not static images with bounding boxes. The data pipeline for video generation, physical simulation, and embodied reasoning is fundamentally different from image classification.",
                },
                {
                  title: "Speed matters more than scale",
                  description:
                    "If you need a pilot dataset in days rather than a production contract in months, the enterprise onboarding cycle at Scale AI may not fit. Claru scopes and delivers pilot datasets in under a week.",
                },
                {
                  title: "You need robotics-native formats",
                  description:
                    "Your training pipeline expects WebDataset, HDF5, RLDS, or other formats that robotics teams use. Generic annotation exports in JSON or CSV require significant post-processing before they can be fed to a policy.",
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

        {/* ── Claru's End-to-End Approach ──────────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Claru&apos;s Approach: Capture, Enrich, Annotate, Deliver
            </h2>
            <p className="text-white/70 mb-12 text-lg">
              Where annotation platforms start at step three, Claru
              starts at step one. This is not a generic data platform
              with a robotics add-on &mdash; every stage was
              designed from the ground up for the requirements of
              physical AI, drawing on the team&apos;s experience building
              this capability inside Moonvalley.
            </p>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Capture",
                  content:
                    "Claru operates three parallel data acquisition pipelines. Wearable camera capture deploys 10,000+ trained contributors with GoPro cameras across kitchens, workshops, warehouses, retail environments, and outdoor spaces in 100+ cities worldwide. Managed teleoperation coordinates demonstrations on client-specific robot hardware (Franka, UR5, custom rigs) with trained operators following structured task protocols. Game-based capture uses custom environments that log synchronized video and control inputs at 60 FPS, producing interaction data with perfect action labels. This is the step that annotation-only platforms cannot provide.",
                },
                {
                  step: "02",
                  title: "Enrich",
                  content:
                    "Raw video enters a multi-model enrichment pipeline before any human touches it. Monocular depth estimation (Depth Anything V2) generates per-frame depth maps. Semantic segmentation (SAM3) labels every pixel with object class and instance identity. Human pose estimation (ViTPose) extracts 2D and 3D joint positions for hand-object interaction analysis. Optical flow computes dense motion fields between consecutive frames. AI-generated captions provide natural language descriptions of each clip. All enrichment outputs are cross-validated: depth consistency is checked against segmentation boundaries, pose estimates are validated against temporal smoothness constraints. This automated enrichment produces the multi-modal signals that robotics models consume as input features — not just labels.",
                },
                {
                  step: "03",
                  title: "Annotate",
                  content:
                    "Expert human annotators add the labels that automated systems cannot reliably produce. Action boundary annotation marks precise temporal start and end of discrete actions (reach, grasp, lift, transport, place) with sub-second precision. Object affordance labels identify graspable surfaces, support surfaces, and obstacles. Grasp type classification follows established taxonomies (power grasp, precision pinch, lateral pinch, hook). Intent annotation captures what the person is trying to achieve, not just what their hand is doing. Quality scoring flags clips with occlusions, motion blur, or calibration drift. Every annotation project follows guidelines developed in collaboration with the client's ML team.",
                },
                {
                  step: "04",
                  title: "Deliver",
                  content:
                    "Datasets are packaged in the exact format each team's training pipeline expects. WebDataset for streaming training at scale. HDF5 for dense numeric trajectories. RLDS for reinforcement learning workflows. Parquet for metadata queries and filtering. Every delivery includes enrichment layers as aligned side-channels, a manifest with checksums, and a datasheet documenting collection methodology, annotator demographics, known limitations, and intended use cases. Data is delivered via S3, GCS, or direct integration with the client's cloud infrastructure. No format conversion needed on the client side.",
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

        {/* ── Other Alternatives to Consider ───────────────────────── */}
        <section className="w-full py-16 md:py-24 bg-white/[0.02]">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-semibold md:text-3xl text-white mb-4">
              Other Alternatives Worth Considering
            </h2>
            <p className="text-white/70 mb-10 text-lg">
              The data infrastructure landscape for AI is broader than
              any single comparison. Here are other providers and how
              they fit.
            </p>

            <div className="space-y-8">
              {[
                {
                  name: "Luel (YC W26)",
                  type: "Marketplace",
                  description:
                    "Luel is a two-sided marketplace for rights-cleared multimodal data. They connect data suppliers with AI teams and handle licensing. Strengths: strong content library, good SEO presence, fast access to available datasets. Weaknesses: no deep enrichment pipeline, no custom capture network, limited robotics-specific data. Best for teams that need licensed footage for video generation models and are comfortable handling enrichment in-house.",
                  link: "/compare/claru-vs-luel",
                  linkText: "See our Luel comparison",
                },
                {
                  name: "Appen",
                  type: "Legacy crowd labeling",
                  description:
                    "Appen is one of the original crowd-sourced data labeling companies, now publicly traded. They have a massive global workforce and broad capability across languages and modalities. Strengths: linguistic diversity, global reach, established enterprise relationships. Weaknesses: quality has declined in recent years (frequently cited in industry feedback), no specialization in robotics or physical AI, annotation-only model similar to Scale AI. Best for large-volume multilingual NLP projects where cost efficiency matters more than domain depth.",
                  link: "/compare/appen-alternatives",
                  linkText: "See our Appen comparison",
                },
                {
                  name: "Labelbox",
                  type: "Data platform",
                  description:
                    "Labelbox has evolved from annotation software into a broad AI data factory with RLHF, evaluations, an expert network (Alignerr, 1.5M+ workers), and robotics capture. Strengths: breadth across AI modalities, large expert network. Weaknesses: expanding into robotics rather than built for it. Best for teams that need one vendor across NLP, image, video, and robotics data.",
                  link: "/compare/labelbox-alternatives",
                  linkText: "See our Labelbox comparison",
                },
                {
                  name: "Surge AI",
                  type: "Expert annotation",
                  description:
                    "Surge AI focuses on high-quality annotation with a curated workforce of expert labelers. Strengths: annotation quality is generally above crowd platforms, strong on NLP and RLHF tasks. Weaknesses: annotation-only model, no data capture, no robotics specialization, limited video annotation capabilities. Best for RLHF and text-heavy annotation projects where quality matters more than volume.",
                  link: "/compare/surge-ai-alternatives",
                  linkText: "See our Surge AI comparison",
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
              How to Choose the Right Data Partner
            </h2>

            <div className="prose-custom space-y-6 text-white/80 leading-relaxed text-base md:text-lg">
              <p>
                The right choice depends on three factors: what data you
                already have, what modalities your model consumes, and
                how fast you need to move.
              </p>

              <p>
                <strong className="text-white">
                  If you have the raw data and need labels:
                </strong>{" "}
                Scale AI, Surge AI, or Appen can annotate it. Scale AI
                is the strongest option for large enterprise projects
                with existing data. Surge AI is better for smaller,
                higher-quality annotation tasks.
              </p>

              <p>
                <strong className="text-white">
                  If you need licensed footage for training:
                </strong>{" "}
                Luel&apos;s marketplace model gives you fast access to
                rights-cleared video and images. Good for video
                generation and multimodal models where you need diverse
                visual content.
              </p>

              <p>
                <strong className="text-white">
                  If you need the full pipeline for physical AI:
                </strong>{" "}
                Claru is built for this. Capture, enrichment,
                annotation, and delivery in robotics-native formats.
                This is the option when your bottleneck is not labels
                but the underlying data itself &mdash; when you need
                egocentric video, manipulation demonstrations, or
                teleoperation recordings that do not exist yet.
              </p>

              <p>
                The simplest way to think about it: Scale AI is enterprise
                breadth, Claru is physical AI depth. Use Scale for your
                LLM training data. Use Claru for your robot training
                data. Most physical AI teams end up using both &mdash;
                Scale AI or Surge AI for their text and image annotation,
                Claru for their egocentric video capture and robotics
                enrichment, simulation for pre-training. The question is
                not &ldquo;which one&rdquo; but &ldquo;which one for
                which part of the pipeline.&rdquo;
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
                  href: "/compare/claru-vs-luel",
                  title: "Claru vs Luel",
                  desc: "Marketplace raw data vs. end-to-end enriched physical AI data.",
                },
                {
                  href: "/compare/appen-alternatives",
                  title: "Appen Alternatives",
                  desc: "Crowd labeling vs. physical AI specialization for robotics data.",
                },
                {
                  href: "/compare/labelbox-alternatives",
                  title: "Labelbox Alternatives",
                  desc: "End-to-end data service vs. annotation platform for physical AI.",
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
              Need Training Data for Physical AI?
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
