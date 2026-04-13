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

export const hubXyzComparison: ComparisonData = {
  slug: "hub-xyz-alternatives",
  competitor: {
    name: "Hub.xyz",
    siteUrl: "https://hub.xyz",
    category: "Real-world data collection and annotation",
  },
  meta: {
    title: "Hub.xyz Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Hub.xyz and Claru for physical AI training data. Hub.xyz provides an API for real-world training data with AI + human-in-the-loop annotation and QA. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Hub.xyz alternative",
      "Hub.xyz alternatives",
      "Hub vs Claru",
      "real-world training data",
      "HITL annotation",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Hub.xyz Alternatives",
    title: "Hub.xyz Alternatives: Data API vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://hub.xyz"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Hub.xyz
        </a>{" "}
        provides an API for real-world training data with AI and human
        annotation. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Hub.xyz offers an API for real-world training data.",
      "It positions itself as a distributed, real-time data pipeline for frontier AI.",
      "Hub.xyz highlights AI + human-in-the-loop annotation and QA across modalities.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Hub.xyz for data API access; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Hub.xyz Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Hub.xyz offers API access to real-world training data. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Hub.xyz describes itself as an API for real-world training data.
        {sourceLink("https://hub.xyz/", "[1]")}
      </>,
      <>
        The company says it turns the world into a distributed, real-time data
        pipeline that powers frontier AI. {sourceLink("https://hub.xyz/", "[2]")}
      </>,
      <>
        Hub.xyz highlights AI and human-in-the-loop annotation plus QA across
        modalities. {sourceLink("https://hub.xyz/", "[3]")}
      </>,
      "Hub.xyz represents a newer generation of data infrastructure companies that approach AI training data through the lens of distributed systems and API-first design. The company positions itself at the intersection of crowd-sourced data collection and frontier AI requirements, aiming to turn real-world contributors into a real-time data pipeline. Hub.xyz has attracted attention from AI labs looking for fresh, diverse data sources that go beyond traditional annotation service providers and existing dataset marketplaces.",
      "For physical AI and robotics teams, Hub.xyz's distributed collection model is conceptually aligned with the need for diverse real-world data. However, robotics training requires more than raw data access: it demands task-specific capture protocols, sensor alignment, egocentric viewpoints, and multi-layer enrichment including depth, pose, and segmentation. The question for robotics teams is whether API-driven data access provides the level of specificity and enrichment that embodied AI models require, or whether a purpose-built capture-and-enrichment pipeline is necessary.",
      "If your bottleneck is sourcing real-world data via API, Hub.xyz is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Hub.xyz at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                API for real-world training data.
                {sourceLink("https://hub.xyz/", "[1]")}
              </>
            ),
          },
          {
            label: "Positioning",
            value: (
              <>
                Distributed, real-time data pipeline for frontier AI.
                {sourceLink("https://hub.xyz/", "[2]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                AI + HITL annotation and QA across modalities.
                {sourceLink("https://hub.xyz/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams sourcing data through APIs and HITL workflows",
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
        Hub.xyz provides an API for real-world training data.
        {sourceLink("https://hub.xyz/", "[1]")}
      </>,
      <>
        Hub.xyz positions itself as a distributed, real-time data pipeline for
        frontier AI. {sourceLink("https://hub.xyz/", "[2]")}
      </>,
      <>
        The platform highlights AI + human-in-the-loop annotation and QA across
        modalities. {sourceLink("https://hub.xyz/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Hub.xyz Is Strong",
    intro:
      "Based on Hub.xyz's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "API-first data sourcing",
        description: (
          <>
            Hub.xyz highlights API access to real-world training data.
            {sourceLink("https://hub.xyz/", "[1]")}
          </>
        ),
      },
      {
        title: "Real-time pipeline",
        description: (
          <>
            The company positions itself as a distributed, real-time data
            pipeline. {sourceLink("https://hub.xyz/", "[2]")}
          </>
        ),
      },
      {
        title: "HITL annotation",
        description: (
          <>
            Hub.xyz emphasizes AI + HITL annotation and QA across modalities.
            {sourceLink("https://hub.xyz/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Hub.xyz is an API-first data pipeline. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru captures physical-world data instead of focusing on API access alone.",
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
    title: "Hub.xyz vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Hub.xyz's API-first model.",
    columns: [
      { key: "hub", label: "Hub.xyz" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          hub: (
            <>
              API for real-world training data.
              {sourceLink("https://hub.xyz/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Delivery model",
        values: {
          hub: (
            <>
              Distributed, real-time data pipeline.
              {sourceLink("https://hub.xyz/", "[2]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Annotation",
        values: {
          hub: (
            <>
              AI + HITL annotation and QA across modalities.
              {sourceLink("https://hub.xyz/", "[3]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          hub: "Teams sourcing data via API and HITL pipelines",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Hub.xyz vs Claru",
    intro:
      "Hub.xyz specializes in API-first data access. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "API vs capture",
        paragraphs: [
          "Hub.xyz focuses on API access and distributed data pipelines.",
          "Claru focuses on capture, enrichment, and delivery of robotics data.",
        ],
      },
      {
        title: "Workflow focus",
        paragraphs: [
          "Hub.xyz emphasizes AI + HITL annotation and QA.",
          "Claru emphasizes end-to-end data capture and enrichment pipelines.",
        ],
      },
      {
        title: "Robotics AI data requirements",
        paragraphs: [
          "Modern robotics AI models such as vision-language-action architectures, diffusion policies, and world models require training data with specific properties that go beyond general real-world data access: egocentric viewpoints matching robot camera placements, manipulation sequences with hand-object interaction context, depth-aligned frames for spatial reasoning, and action-level temporal segmentation for policy learning.",
          "Claru builds capture programs specifically around these requirements, deploying trained collectors with wearable cameras and structured task protocols, then enriching every clip with depth estimation, pose detection, segmentation, and optical flow before delivery in formats that plug directly into robotics training frameworks such as RLDS and WebDataset.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Hub.xyz is strong when API-driven data sourcing and distributed real-time collection are the priority, particularly for frontier AI teams that need access to diverse, fresh data through programmatic interfaces.",
          "Claru is stronger when physical-world capture with specific task protocols and multi-layer enrichment is the bottleneck, especially for robotics teams that need data designed for embodied AI training from the ground up.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Hub.xyz Is a Fit",
    competitorBullets: [
      "You need API access to real-world training data.",
      "You want AI + human-in-the-loop annotation and QA.",
      "You are building distributed data pipelines.",
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
        title: "Appen Alternatives",
        desc: "Global data services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs physical AI specialization.",
        href: "/compare/labelbox-alternatives",
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
      "Choose Hub.xyz when you need API access to real-world training data with HITL QA.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Hub.xyz for API data access, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Hub.xyz?",
        answer: (
          <>
            Hub.xyz provides an API for real-world training data, positioning itself as a distributed, real-time data pipeline for frontier AI.{" "}
            {sourceLink("https://hub.xyz/", "[1]")}{" "}
            The company represents a newer generation of data infrastructure focused on turning distributed real-world contributors into a programmatic data source. Hub.xyz targets frontier AI labs that need diverse, fresh data from the physical world delivered through API-first interfaces rather than traditional dataset procurement.
          </>
        ),
      },
      {
        question: "How does Hub.xyz describe its data pipeline?",
        answer: (
          <>
            Hub.xyz positions itself as a distributed, real-time data pipeline that turns the world into a data source for frontier AI.{" "}
            {sourceLink("https://hub.xyz/", "[2]")}{" "}
            This framing emphasizes the distributed nature of data collection, where contributors around the world can capture and submit data that flows through the pipeline in near real-time. The approach is designed to provide AI teams with access to diverse, continuously updated data rather than static datasets assembled at a single point in time.
          </>
        ),
      },
      {
        question: "Does Hub.xyz provide annotation and QA?",
        answer: (
          <>
            The platform highlights AI plus human-in-the-loop annotation and QA across modalities as part of its data pipeline.{" "}
            {sourceLink("https://hub.xyz/", "[3]")}{" "}
            This combines automated AI-driven labeling with human review and quality assurance, creating a hybrid approach designed to balance annotation speed with accuracy. The HITL component ensures that human judgment is applied where automated systems may lack reliability, while AI pre-labeling accelerates the overall annotation process.
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets with specific task protocols. While Hub.xyz provides broad API access to real-world data, robotics teams often need data captured according to precise task specifications with controlled viewpoints, manipulation sequences, and sensor alignment. Claru provides capture infrastructure with trained collectors, enrichment layers including depth, pose, segmentation, and optical flow, and delivery in robotics-native formats like RLDS and WebDataset.",
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
    { label: "Hub.xyz", url: "https://hub.xyz/" },
  ],
};
