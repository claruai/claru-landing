import type { ComparisonData } from "@/data/compare/types";
import { claruPipelineSteps, claruProofStats } from "@/data/compare/shared";

const sourceLink = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-[var(--accent-primary)] underline underline-offset-2"
  >
    {label}
  </a>
);

export const voxel51Comparison: ComparisonData = {
  slug: "voxel51-alternatives",
  competitor: {
    name: "Voxel51",
    siteUrl: "https://voxel51.com",
    category: "Computer vision data management platform",
  },
  meta: {
    title: "Voxel51 Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Voxel51 and Claru for physical AI training data. Voxel51 provides the FiftyOne visual AI platform for dataset curation and management. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Voxel51 alternative",
      "Voxel51 alternatives",
      "Voxel51 vs Claru",
      "FiftyOne platform",
      "visual AI dataset management",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Voxel51 Alternatives",
    title: "Voxel51 Alternatives: Data Platform vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://voxel51.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Voxel51
        </a>{" "}
        provides the FiftyOne visual AI platform for dataset management and
        curation. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Voxel51 offers FiftyOne, a visual AI and computer vision data platform.",
      "FiftyOne emphasizes dataset curation, management, and visualization workflows.",
      "Voxel51 highlights the ability to unify multimodal data in a single workspace.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Voxel51 for dataset management; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Voxel51 Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Voxel51 provides a dataset management platform for visual AI. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Voxel51 positions FiftyOne as a visual AI and computer vision data
        platform. {sourceLink("https://voxel51.com/", "[1]")}
      </>,
      <>
        FiftyOne highlights dataset curation, management, and visualization
        workflows for CV teams. {sourceLink("https://voxel51.com/", "[2]")}
      </>,
      <>
        The platform notes unifying multimodal data in a single workspace.
        {sourceLink("https://voxel51.com/", "[3]")}
      </>,
      "If your bottleneck is dataset curation and management, Voxel51 is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Voxel51 at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Visual AI and computer vision data platform.
                {sourceLink("https://voxel51.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Dataset curation, management, and visualization workflows.
                {sourceLink("https://voxel51.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Data",
            value: (
              <>
                Unify multimodal data in a single workspace.
                {sourceLink("https://voxel51.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing visual AI dataset management",
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value: "Physical AI training data for robotics and world models",
          },
          {
            label: "Capture",
            value: "Wearable camera network plus task-specific collection",
          },
          {
            label: "Enrichment",
            value: "Depth, pose, segmentation, optical flow, aligned captions",
          },
          {
            label: "Best fit",
            value: "Teams that need capture + enrichment for embodied AI",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Voxel51 positions FiftyOne as a visual AI and CV data platform.
        {sourceLink("https://voxel51.com/", "[1]")}
      </>,
      <>
        FiftyOne focuses on dataset curation, management, and visualization.
        {sourceLink("https://voxel51.com/", "[2]")}
      </>,
      <>
        The platform highlights unifying multimodal data in one workspace.
        {sourceLink("https://voxel51.com/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Voxel51 Is Strong",
    intro:
      "Based on Voxel51's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Dataset curation",
        description: (
          <>
            Voxel51 emphasizes dataset curation and visualization workflows.
            {sourceLink("https://voxel51.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Visual AI platform",
        description: (
          <>
            FiftyOne is positioned as a visual AI and CV data platform.
            {sourceLink("https://voxel51.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Multimodal management",
        description: (
          <>
            The platform highlights unifying multimodal data in a single
            workspace. {sourceLink("https://voxel51.com/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Voxel51 provides dataset management tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of only managing existing datasets.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Voxel51 vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Voxel51's dataset management strengths.",
    columns: [
      { key: "voxel51", label: "Voxel51" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          voxel51: (
            <>
              Visual AI and CV dataset management platform.
              {sourceLink("https://voxel51.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Workflow",
        values: {
          voxel51: (
            <>
              Dataset curation, management, and visualization.
              {sourceLink("https://voxel51.com/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Data capture",
        values: {
          voxel51: "Manage and curate existing datasets",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          voxel51: "Labeling, curation, and dataset analytics",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          voxel51: "Teams managing large CV datasets",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Voxel51 vs Claru",
    intro:
      "Voxel51 specializes in dataset management. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Voxel51 focuses on data management and visualization for CV teams.",
          "Claru focuses on capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Voxel51 assumes teams already have data to curate and label.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Voxel51 is strong when dataset management is the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Voxel51 Is a Fit",
    competitorBullets: [
      "You need dataset curation and visualization for CV data.",
      "You already have data and need to manage large-scale datasets.",
      "You want a platform for multimodal dataset organization.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
    ],
  },
  pipeline: {
    title: "How Claru Delivers Physical AI Data",
    intro:
      "Claru provides an end-to-end pipeline so physical AI teams can move from brief to training-ready data quickly.",
    steps: claruPipelineSteps,
  },
  proof: {
    title: "Claru by the Numbers",
    stats: claruProofStats,
  },
  related: {
    title: "Other Alternatives Worth Considering",
    intro:
      "If you are mapping the data provider landscape, these comparisons cover adjacent options.",
    links: [
      {
        title: "Label Studio Alternatives",
        desc: "Open-source labeling platform vs physical AI specialization.",
        href: "/compare/label-studio-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Voxel51 when you need dataset curation, management, and visualization for CV data.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Voxel51 for dataset management, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Voxel51?",
        answer: (
          <>
            Voxel51 provides the FiftyOne visual AI data platform.
            {sourceLink("https://voxel51.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What is FiftyOne used for?",
        answer: (
          <>
            FiftyOne focuses on dataset curation, management, and visualization.
            {sourceLink("https://voxel51.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Voxel51 support multimodal data?",
        answer: (
          <>
            The platform highlights unifying multimodal data in one workspace.
            {sourceLink("https://voxel51.com/", "[3]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
    ],
  },
  cta: {
    title: "Need Physical AI Data That Ships Fast?",
    description:
      "Tell us what you are training. We will scope a capture plan and deliver a pilot dataset in days.",
    primary: { label: "Book a call", href: "/contact" },
    secondary: { label: "Explore data catalog", href: "/data-catalog" },
  },
  sources: [
    { label: "Voxel51", url: "https://voxel51.com/" },
  ],
};
