import Link from "next/link";
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

export const segmentsAiComparison: ComparisonData = {
  slug: "segments-ai-alternatives",
  competitor: {
    name: "Segments.ai",
    siteUrl: "https://segments.ai",
    category: "2D and 3D annotation platform",
  },
  meta: {
    title: "Segments.ai Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Segments.ai and Claru for physical AI data. Segments.ai provides 2D and 3D annotation tools for images and point clouds. Claru specializes in capture and enrichment for robotics.",
    keywords: [
      "Segments.ai alternative",
      "Segments.ai alternatives",
      "Segments.ai vs Claru",
      "3D annotation platform",
      "point cloud labeling",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-01",
    modified: "2026-04-01",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Segments.ai Alternatives",
    title: "Segments.ai Alternatives: 3D Annotation vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://segments.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Segments.ai
        </a>{" "}
        is a 2D and 3D annotation platform for images and point clouds. If you
        need capture, enrichment, and training-ready physical AI datasets,
        Claru focuses on that end-to-end pipeline. This page compares the two
        approaches.
      </>
    ),
    lastUpdated: "April 1, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Segments.ai provides annotation tools for 2D images and 3D point clouds.",
      "Segments.ai supports multi-sensor labeling that combines LiDAR and camera data.",
      "Claru focuses on physical AI data capture and enrichment for robotics.",
      "Choose Segments.ai when you need annotation tooling on existing datasets. Choose Claru when you need capture plus enrichment.",
    ],
  },
  overview: {
    title: "What Segments.ai Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Segments.ai is annotation tooling. Claru is a physical AI data pipeline.",
      <>
        Segments.ai provides annotation tools for 2D images and 3D point clouds,
        including multi-sensor labeling workflows. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
      </>,
      "If your bottleneck is raw data capture and enrichment, you need a pipeline that starts before annotation.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Segments.ai at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                2D image and 3D point cloud annotation. {sourceLink("https://segments.ai/data-labeling/3d-point-cloud", "[3]")}
              </>
            ),
          },
          {
            label: "Core outputs",
            value:
              "Labeled 2D images and 3D point cloud datasets",
          },
          {
            label: "Strength",
            value: (
              <>
                Multi-sensor labeling across cameras and LiDAR. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
              </>
            ),
          },
        ],
      },
      {
        title: "Claru at a Glance",
        items: [
          {
            label: "Focus",
            value:
              "Physical AI training data for robotics, world models, and embodied AI",
          },
          {
            label: "Capture",
            value:
              "Wearable camera network plus teleoperation and task-specific collection",
          },
          {
            label: "Enrichment",
            value:
              "Depth, pose, segmentation, optical flow, AI captions aligned to each clip",
          },
          {
            label: "Best fit",
            value:
              "Robotics teams needing real-world capture and training-ready delivery",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Segments.ai supports multi-sensor labeling for LiDAR and camera data. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
      </>,
      <>
        Segments.ai provides 3D point cloud labeling tools. {sourceLink("https://segments.ai/data-labeling/3d-point-cloud", "[3]")}
      </>,
      <>
        Segments.ai positions itself as a 2D and 3D annotation platform. {sourceLink("https://segments.ai/", "[1]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Segments.ai Is Strong",
    intro:
      "Segments.ai focuses on annotation tooling for multi-sensor and 3D datasets.",
    cards: [
      {
        title: "Multi-sensor labeling",
        description: (
          <>
            Supports labeling that combines LiDAR and camera data. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
          </>
        ),
      },
      {
        title: "3D point cloud tooling",
        description: (
          <>
            Provides tools for 3D point cloud annotation. {sourceLink("https://segments.ai/data-labeling/3d-point-cloud", "[3]")}
          </>
        ),
      },
      {
        title: "2D annotation support",
        description: (
          <>
            Offers 2D image labeling tools as part of the platform. {sourceLink("https://segments.ai/", "[1]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Annotation tooling is valuable, but physical AI teams often need capture and enrichment first.",
    cards: [
      {
        title: "Capture is the bottleneck",
        description:
          "Robotics teams often lack the raw, task-specific data needed to annotate.",
      },
      {
        title: "Enrichment is a model input",
        description:
          "Depth, pose, segmentation, and motion signals are training inputs for robotics and world models.",
      },
      {
        title: "Robotics labels are different",
        description:
          "Affordances, grasp types, and action boundaries require specialized labeling workflows.",
      },
    ],
  },
  comparison: {
    title: "Segments.ai vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on annotation tooling versus end-to-end physical AI data pipelines.",
    columns: [
      { key: "segments", label: "Segments.ai" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          segments: (
            <>
              2D and 3D annotation platform. {sourceLink("https://segments.ai/", "[1]")}
            </>
          ),
          claru:
            "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Multi-sensor labeling",
        values: {
          segments: (
            <>
              Supports LiDAR and camera labeling in one workflow. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
            </>
          ),
          claru:
            "Capture plus enrichment with aligned depth, pose, and segmentation",
        },
      },
      {
        dimension: "3D point clouds",
        values: {
          segments: (
            <>
              Provides point cloud labeling tools. {sourceLink("https://segments.ai/data-labeling/3d-point-cloud", "[3]")}
            </>
          ),
          claru:
            "Physical AI datasets with enrichment and robotics-specific labels",
        },
      },
      {
        dimension: "Data capture",
        values: {
          segments:
            "Annotation tooling only; bring your own data",
          claru:
            "Field capture network plus teleoperation and task-specific data collection",
        },
      },
      {
        dimension: "Best fit",
        values: {
          segments:
            "Teams that already have data and need 2D/3D annotation tooling",
          claru:
            "Teams that need capture, enrichment, and training-ready delivery",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Segments.ai vs Claru",
    intro:
      "Segments.ai is focused on labeling workflows, while Claru is focused on building physical AI datasets from capture to delivery.",
    blocks: [
      {
        title: "Annotation tooling vs data pipelines",
        paragraphs: [
          "Segments.ai provides tooling for labeling 2D images and 3D point clouds, which is useful when the data already exists.",
          "Claru begins earlier in the pipeline by capturing physical-world data and enriching it for robotics training.",
        ],
      },
      {
        title: "When the tooling is enough",
        paragraphs: [
          "If you already have LiDAR and camera datasets, Segments.ai is a strong option for annotation.",
          "If you need to collect new data or enrich it with depth and pose, a capture-first partner is the better fit.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Segments.ai Is a Fit",
    competitorBullets: [
      "You already have 2D or 3D data and need annotation tooling.",
      "You need multi-sensor labeling across LiDAR and cameras.",
      "Your team wants self-serve annotation workflows.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need real-world capture of physical tasks, not just labeling.",
      "Your model depends on depth, pose, segmentation, and motion signals.",
      "You want datasets delivered in robotics-native formats.",
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
        title: "Appen Alternatives",
        desc: "Global data services vs physical AI specialization.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform comparison with end-to-end data services.",
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
      "If you already have data and need 2D or 3D annotation tooling, Segments.ai is a good fit.",
      "If you need capture plus enrichment for physical AI training, Claru is built for that pipeline.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Segments.ai?",
        answer: (
          <>
            Segments.ai is a 2D and 3D annotation platform. {sourceLink("https://segments.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Segments.ai support LiDAR and camera data?",
        answer: (
          <>
            Yes. It supports multi-sensor labeling for LiDAR and camera data. {sourceLink("https://segments.ai/data-labeling/multi-sensor", "[2]")}
          </>
        ),
      },
      {
        question: "Does Segments.ai support 3D point clouds?",
        answer: (
          <>
            Yes. It provides 3D point cloud labeling tools. {sourceLink("https://segments.ai/data-labeling/3d-point-cloud", "[3]")}
          </>
        ),
      },
      {
        question: "How is Segments.ai different from Claru?",
        answer:
          "Segments.ai provides annotation tooling, while Claru provides capture and enrichment for physical AI datasets.",
      },
    ],
  },
  cta: {
    title: "Need Training Data for Physical AI?",
    description:
      "Tell us what your model needs to learn. We will scope the dataset, define the collection protocol, and deliver training-ready data.",
    primary: {
      label: "Talk to Our Team",
      href: "/#contact",
    },
    secondary: {
      label: "Browse the Data Catalog",
      href: "/data-catalog",
    },
  },
  sources: [
    { label: "Segments.ai", url: "https://segments.ai/" },
    { label: "Segments.ai Multi-Sensor", url: "https://segments.ai/data-labeling/multi-sensor" },
    { label: "Segments.ai 3D Point Cloud", url: "https://segments.ai/data-labeling/3d-point-cloud" },
  ],
};
