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

export const lightlyAiComparison: ComparisonData = {
  slug: "lightly-ai-alternatives",
  competitor: {
    name: "Lightly",
    siteUrl: "https://www.lightly.ai",
    category: "Computer vision data curation and labeling",
  },
  meta: {
    title: "Lightly AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Lightly and Claru for physical AI training data. Lightly focuses on computer vision data curation, selection, and labeling workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Lightly alternative",
      "Lightly alternatives",
      "Lightly vs Claru",
      "data curation platform",
      "active learning data selection",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Lightly AI Alternatives",
    title: "Lightly AI Alternatives: Data Curation vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.lightly.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Lightly
        </a>{" "}
        focuses on computer vision data curation, selection, and labeling
        workflows. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Lightly focuses on data curation and selection for computer vision teams.",
      "LightlyStudio offers integrated labeling, curation, QA, and dataset management.",
      "LightlyEdge provides data selection for edge devices and data capture.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Lightly for CV data curation workflows; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Lightly Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Lightly focuses on data curation and labeling workflows for computer vision. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Lightly positions LightlyOne as a computer vision data curation platform
        and LightlyStudio as an integrated labeling and curation workflow.
        {sourceLink("https://www.lightly.ai/", "[1]")}
      </>,
      <>
        LightlyStudio highlights labeling, curation, QA, and dataset management
        in a single platform. {sourceLink("https://www.lightly.ai/", "[2]")}
      </>,
      <>
        LightlyEdge provides data selection on edge devices to capture the most
        useful data. {sourceLink("https://docs.lightly.ai/edge/cpp/", "[3]")}
      </>,
      "If your bottleneck is data curation or active selection, Lightly is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Lightly at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Computer vision data curation and labeling workflows.
                {sourceLink("https://www.lightly.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                LightlyStudio for labeling, curation, QA, and dataset management.
                {sourceLink("https://www.lightly.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Edge",
            value: (
              <>
                LightlyEdge data selection for edge devices.
                {sourceLink("https://docs.lightly.ai/edge/cpp/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams optimizing CV datasets and data selection",
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
        LightlyOne and LightlyStudio focus on data curation and labeling for
        computer vision. {sourceLink("https://www.lightly.ai/", "[1]")}
      </>,
      <>
        LightlyStudio combines labeling, curation, QA, and dataset management.
        {sourceLink("https://www.lightly.ai/", "[2]")}
      </>,
      <>
        LightlyEdge provides data selection for edge devices.
        {sourceLink("https://docs.lightly.ai/edge/cpp/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Lightly Is Strong",
    intro:
      "Based on Lightly's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Data curation workflows",
        description: (
          <>
            Lightly emphasizes data curation for computer vision teams.
            {sourceLink("https://www.lightly.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Integrated labeling + QA",
        description: (
          <>
            LightlyStudio combines labeling, curation, QA, and dataset
            management. {sourceLink("https://www.lightly.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Edge data selection",
        description: (
          <>
            LightlyEdge enables data selection on edge devices.
            {sourceLink("https://docs.lightly.ai/edge/cpp/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Lightly focuses on data curation and labeling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of only curating existing datasets.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs, not add-ons.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Lightly vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Lightly's data curation specialization.",
    columns: [
      { key: "lightly", label: "Lightly" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          lightly: (
            <>
              Data curation and labeling for computer vision.
              {sourceLink("https://www.lightly.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Platform",
        values: {
          lightly: (
            <>
              LightlyStudio for labeling, curation, QA, and dataset management.
              {sourceLink("https://www.lightly.ai/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Data capture",
        values: {
          lightly: "Curate and select from existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          lightly: "Labeling and QA workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          lightly: "Teams optimizing CV datasets and data selection",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Lightly vs Claru",
    intro:
      "Lightly specializes in CV data curation. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Curation vs capture",
        paragraphs: [
          "Lightly helps teams curate and select the most valuable data for CV models.",
          "Claru captures new physical-world data to fill robotics data gaps.",
        ],
      },
      {
        title: "Workflow focus",
        paragraphs: [
          "LightlyStudio combines labeling, QA, and dataset management.",
          "Claru adds capture, enrichment, and delivery as a managed pipeline.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Lightly is strong when you need to curate and prioritize CV datasets.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Lightly Is a Fit",
    competitorBullets: [
      "You need data curation and selection for computer vision models.",
      "You want integrated labeling, QA, and dataset management tooling.",
      "You already have data and need to prioritize what to label next.",
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
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
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
      "Choose Lightly when you need to curate and select data for CV labeling workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Lightly for curation, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Lightly?",
        answer: (
          <>
            Lightly focuses on data curation and labeling workflows for computer
            vision teams. {sourceLink("https://www.lightly.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What is LightlyStudio?",
        answer: (
          <>
            LightlyStudio combines labeling, curation, QA, and dataset
            management in a single platform. {sourceLink("https://www.lightly.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "What is LightlyEdge used for?",
        answer: (
          <>
            LightlyEdge provides data selection for edge devices to capture the
            most useful data. {sourceLink("https://docs.lightly.ai/edge/cpp/", "[3]")}
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
    { label: "Lightly", url: "https://www.lightly.ai/" },
    { label: "LightlyEdge Docs", url: "https://docs.lightly.ai/edge/cpp/" },
  ],
};
