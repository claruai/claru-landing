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

export const labelStudioComparison: ComparisonData = {
  slug: "label-studio-alternatives",
  competitor: {
    name: "Label Studio",
    siteUrl: "https://labelstud.io",
    category: "Open source data labeling platform",
  },
  meta: {
    title: "Label Studio Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Label Studio and Claru for physical AI training data. Label Studio is an open source data labeling platform for fine-tuning LLMs, preparing training data, and evaluating AI systems. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Label Studio alternative",
      "Label Studio alternatives",
      "Label Studio vs Claru",
      "open source data labeling",
      "LLM fine-tuning",
      "training data preparation",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Label Studio Alternatives",
    title: "Label Studio Alternatives: Open Source Labeling vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://labelstud.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Label Studio
        </a>{" "}
        is an open source data labeling platform for fine-tuning LLMs,
        preparing training data, and evaluating AI systems. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Label Studio positions itself as an open source data labeling platform.",
      "It highlights fine-tuning LLMs, preparing training data, and evaluating AI systems.",
      "Label Studio emphasizes flexibility and customization for labeling workflows.",
      "The platform is built for teams who want to own their labeling infrastructure.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Label Studio for open-source labeling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Label Studio Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Label Studio provides an open source labeling platform. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Label Studio highlights itself as an open source data labeling platform.
        {sourceLink("https://labelstud.io/", "[1]")}
      </>,
      <>
        The platform mentions fine-tuning LLMs, preparing training data, and
        evaluating AI systems. {sourceLink("https://labelstud.io/", "[2]")}
      </>,
      <>
        Label Studio emphasizes flexibility for building custom workflows.
        {sourceLink("https://labelstud.io/", "[3]")}
      </>,
      "If your bottleneck is labeling infrastructure and workflow customization, Label Studio is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Label Studio at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Open source data labeling platform.
                {sourceLink("https://labelstud.io/", "[1]")}
              </>
            ),
          },
          {
            label: "Use cases",
            value: (
              <>
                LLM fine-tuning, training data prep, AI evaluation.
                {sourceLink("https://labelstud.io/", "[2]")}
              </>
            ),
          },
          {
            label: "Approach",
            value: (
              <>
                Flexible, customizable labeling workflows.
                {sourceLink("https://labelstud.io/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing open-source labeling infrastructure",
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
        Label Studio is an open source data labeling platform.
        {sourceLink("https://labelstud.io/", "[1]")}
      </>,
      <>
        The platform highlights LLM fine-tuning, training data preparation, and
        AI evaluation. {sourceLink("https://labelstud.io/", "[2]")}
      </>,
      <>
        Label Studio emphasizes flexible, customizable workflows.
        {sourceLink("https://labelstud.io/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Label Studio Is Strong",
    intro:
      "Based on Label Studio's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Open source labeling",
        description: (
          <>
            Label Studio positions itself as an open source platform.
            {sourceLink("https://labelstud.io/", "[1]")}
          </>
        ),
      },
      {
        title: "LLM and AI evaluation workflows",
        description: (
          <>
            The platform highlights LLM fine-tuning and AI evaluation.
            {sourceLink("https://labelstud.io/", "[2]")}
          </>
        ),
      },
      {
        title: "Workflow customization",
        description: (
          <>
            Label Studio emphasizes flexible, customizable workflows.
            {sourceLink("https://labelstud.io/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Label Studio provides labeling tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on tooling.",
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
      {
        title: "Task-specific collection",
        description:
          "Claru designs capture briefs around real robot behaviors and environments.",
      },
    ],
  },
  comparison: {
    title: "Label Studio vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Label Studio's open-source strengths.",
    columns: [
      { key: "labelstudio", label: "Label Studio" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          labelstudio: (
            <>
              Open source data labeling platform.
              {sourceLink("https://labelstud.io/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Use cases",
        values: {
          labelstudio: (
            <>
              LLM fine-tuning, training data prep, AI evaluation.
              {sourceLink("https://labelstud.io/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Workflow model",
        values: {
          labelstudio: (
            <>
              Flexible, customizable labeling workflows.
              {sourceLink("https://labelstud.io/", "[3]")}
            </>
          ),
          claru: "Capture, enrichment, and robotics-ready delivery",
        },
      },
      {
        dimension: "Data capture",
        values: {
          labelstudio: "Labeling platform for existing data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          labelstudio: "Annotation outputs and workflow management",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          labelstudio: "Teams needing open-source labeling tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Label Studio vs Claru",
    intro:
      "Label Studio provides open-source labeling. Claru provides capture-first datasets for physical AI.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "Label Studio focuses on open-source labeling workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Use cases",
        paragraphs: [
          "Label Studio highlights LLM fine-tuning and AI evaluation workflows.",
          "Claru focuses on robotics and physical-world data collection.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Label Studio is strong when teams want open-source control.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Label Studio Is a Fit",
    competitorBullets: [
      "You need an open-source labeling platform with customizable workflows.",
      "You are fine-tuning LLMs or evaluating AI systems.",
      "You want to run labeling infrastructure in-house.",
      "You need training data preparation tooling.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need datasets delivered in robotics-native formats.",
      "You want task-specific capture briefs for real-world behaviors.",
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
        title: "Roboflow Alternatives",
        desc: "CV platform vs capture-first robotics datasets.",
        href: "/compare/roboflow-alternatives",
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
      "Choose Label Studio when you need open-source labeling infrastructure and custom workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Label Studio for labeling infrastructure, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Label Studio?",
        answer: (
          <>
            Label Studio is an open source data labeling platform.
            {sourceLink("https://labelstud.io/", "[1]")}
          </>
        ),
      },
      {
        question: "What use cases does Label Studio list?",
        answer: (
          <>
            The platform highlights LLM fine-tuning, training data preparation,
            and AI evaluation. {sourceLink("https://labelstud.io/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Label Studio customizable?",
        answer: (
          <>
            Label Studio emphasizes flexible, customizable workflows.
            {sourceLink("https://labelstud.io/", "[3]")}
          </>
        ),
      },
      {
        question: "Is Label Studio a fit for robotics data capture?",
        answer:
          "Label Studio focuses on labeling tools. Claru is better for capture-first robotics data collection and enrichment.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Label Studio and Claru?",
        answer:
          "Some teams use Label Studio for labeling infrastructure and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Is Label Studio open source?",
        answer: (
          <>
            Label Studio positions itself as an open source platform.
            {sourceLink("https://labelstud.io/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Label Studio support LLM workflows?",
        answer: (
          <>
            The platform highlights LLM fine-tuning and AI evaluation use cases.
            {sourceLink("https://labelstud.io/", "[2]")}
          </>
        ),
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
    { label: "Label Studio", url: "https://labelstud.io/" },
  ],
};
