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

export const humanloopComparison: ComparisonData = {
  slug: "humanloop-alternatives",
  competitor: {
    name: "Humanloop",
    siteUrl: "https://humanloop.com",
    category: "LLM evaluation, prompt management, and observability",
  },
  meta: {
    title: "Humanloop Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Humanloop and Claru for AI data needs. Humanloop focuses on LLM evaluation, prompt management, and observability. Claru specializes in physical AI capture and enrichment.",
    keywords: [
      "Humanloop alternative",
      "Humanloop alternatives",
      "Humanloop vs Claru",
      "LLM evals platform",
      "prompt management",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-01",
    modified: "2026-04-01",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Humanloop Alternatives",
    title: "Humanloop Alternatives: LLM Evals vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://humanloop.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Humanloop
        </a>{" "}
        is an LLM evaluation platform with prompt management and observability.
        If you are building robots or embodied AI, the bottleneck is usually
        physical-world data capture and enrichment, not eval tooling. This page
        compares Humanloop and Claru based on those different needs.
      </>
    ),
    lastUpdated: "April 1, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Humanloop focuses on LLM evaluation, prompt management, and observability for AI product teams.",
      "Humanloop has announced a platform sunset date (September 8, 2025).",
      "Claru focuses on physical AI training data with capture, enrichment, and robotics-ready delivery.",
      "Choose Humanloop when you need LLM evals and prompt workflows. Choose Claru when you need real-world physical data.",
    ],
  },
  overview: {
    title: "What Humanloop Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Humanloop is an LLM evals platform. Claru is a physical AI data pipeline.",
      <>
        Humanloop describes itself as an LLM evaluation platform for
        enterprises, focused on evaluation, prompt management, and
        observability. {sourceLink("https://docs.humanloop.com/", "[2]")}
      </>,
      <>
        Humanloop has announced that the platform will be sunset on September 8,
        2025, following the team joining Anthropic. {sourceLink("https://humanloop.com/", "[1]")}{" "}
        {sourceLink("https://docs.humanloop.com/changelog", "[3]")}
      </>,
      "If your work depends on physical-world data capture and enrichment, the requirements are different from LLM eval workflows.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Humanloop at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                LLM evaluation, prompt management, and observability. {sourceLink("https://docs.humanloop.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Core outputs",
            value: "Evaluation workflows, prompt experimentation, and product observability",
          },
          {
            label: "Status",
            value: (
              <>
                Platform sunset on September 8, 2025. {sourceLink("https://docs.humanloop.com/changelog", "[3]")}
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
        Humanloop positions itself as an LLM evaluation platform. {sourceLink("https://docs.humanloop.com/", "[2]")}
      </>,
      <>
        Humanloop has announced the platform will be sunset on September 8, 2025. {sourceLink("https://docs.humanloop.com/changelog", "[3]")}
      </>,
      <>
        Humanloop notes the team has joined Anthropic. {sourceLink("https://humanloop.com/", "[1]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Humanloop Is Strong",
    intro:
      "Humanloop is designed for LLM product teams that need evaluation, prompt iteration, and observability.",
    cards: [
      {
        title: "LLM evaluation",
        description: (
          <>
            Humanloop frames itself as an LLM evals platform for enterprises. {sourceLink("https://docs.humanloop.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Prompt management",
        description: (
          <>
            The platform focuses on prompt experimentation and workflow
            management around LLM applications. {sourceLink("https://docs.humanloop.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Observability",
        description: (
          <>
            Humanloop emphasizes monitoring and evaluation loops for LLM-driven
            products. {sourceLink("https://docs.humanloop.com/", "[2]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics and embodied AI teams need data capture and enrichment, which are outside the scope of LLM evaluation tooling.",
    cards: [
      {
        title: "Capture is the bottleneck",
        description:
          "Physical AI teams often lack task-specific real-world video. A capture partner reduces time to model.",
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
    title: "Humanloop vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on differences between LLM evaluation tooling and physical AI data pipelines.",
    columns: [
      { key: "humanloop", label: "Humanloop" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          humanloop: (
            <>
              LLM evaluation, prompt management, and observability. {sourceLink("https://docs.humanloop.com/", "[2]")}
            </>
          ),
          claru:
            "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core output",
        values: {
          humanloop:
            "Evaluation workflows and feedback loops for LLM products",
          claru:
            "Real-world physical AI datasets with capture and enrichment",
        },
      },
      {
        dimension: "Data capture",
        values: {
          humanloop:
            "No physical data capture; focuses on LLM evaluation",
          claru:
            "Field capture network plus teleoperation and task-specific data collection",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          humanloop:
            "Evaluation signals and prompt metrics",
          claru:
            "Depth, pose, segmentation, optical flow, AI captions",
        },
      },
      {
        dimension: "Status",
        values: {
          humanloop: (
            <>
              Platform sunset announced for September 8, 2025. {sourceLink("https://docs.humanloop.com/changelog", "[3]")}
            </>
          ),
          claru:
            "Active physical AI data pipeline",
        },
      },
      {
        dimension: "Best fit",
        values: {
          humanloop:
            "LLM product teams running evaluation and prompt workflows",
          claru:
            "Physical AI teams needing capture and enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Humanloop vs Claru",
    intro:
      "Humanloop and Claru solve different problems. Humanloop is centered on LLM evaluation workflows, while Claru is centered on physical AI data pipelines.",
    blocks: [
      {
        title: "LLM evaluation vs physical data pipelines",
        paragraphs: [
          "Humanloop focuses on evaluating and monitoring LLM-driven applications. This is essential when the challenge is prompt iteration, evaluation rubrics, and feedback loops.",
          "Physical AI requires different infrastructure: capture, enrichment, and robotics-specific labeling to create training-ready data.",
        ],
      },
      {
        title: "Platform status",
        paragraphs: [
          "Humanloop has announced a platform sunset date, which may impact long-term planning for LLM teams.",
          "Claru is focused on delivering ongoing physical-world data pipelines for robotics teams.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Humanloop Is a Fit",
    competitorBullets: [
      "You need LLM evaluation workflows and prompt iteration.",
      "Your product team wants observability over LLM performance.",
      "You are working on enterprise LLM applications rather than robotics data capture.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need real-world physical data capture and enrichment.",
      "Your model depends on depth, pose, segmentation, and motion signals.",
      "You want robotics-ready datasets delivered in standard formats.",
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
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Sepal AI Alternatives",
        desc: "Expert RL environments vs physical AI data pipelines.",
        href: "/compare/sepal-ai-alternatives",
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
      "If your primary need is LLM evaluation and prompt management, Humanloop is the relevant category of tooling. The recent sunset notice may influence long-term platform decisions.",
      "If your need is physical-world data capture and enrichment, Claru is built for that pipeline.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Humanloop?",
        answer: (
          <>
            Humanloop is an LLM evaluation platform with prompt management and
            observability features. {sourceLink("https://docs.humanloop.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Is the Humanloop platform being sunset?",
        answer: (
          <>
            Yes. Humanloop has announced a platform sunset date of September 8,
            2025. {sourceLink("https://docs.humanloop.com/changelog", "[3]")}
          </>
        ),
      },
      {
        question: "How is Humanloop different from Claru?",
        answer:
          "Humanloop focuses on LLM evaluation workflows, while Claru focuses on physical AI data capture and enrichment for robotics.",
      },
      {
        question: "What outputs does Claru deliver?",
        answer:
          "Claru delivers training-ready datasets in WebDataset, HDF5, RLDS, Parquet, and COCO, with enrichment layers aligned as side-channels.",
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
    { label: "Humanloop", url: "https://humanloop.com/" },
    { label: "Humanloop Docs", url: "https://docs.humanloop.com/" },
    { label: "Humanloop Changelog", url: "https://docs.humanloop.com/changelog" },
  ],
};
