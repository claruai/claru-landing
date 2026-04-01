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

export const stackAiComparison: ComparisonData = {
  slug: "stack-ai-alternatives",
  competitor: {
    name: "Stack AI",
    siteUrl: "https://www.stack-ai.com",
    category: "AI workflow builder and automation",
  },
  meta: {
    title: "Stack AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Stack AI and Claru for physical AI training data. Stack AI provides a workflow builder for AI agents and automations. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Stack AI alternative",
      "Stack AI alternatives",
      "Stack AI vs Claru",
      "AI workflow builder",
      "AI automation platform",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Stack AI Alternatives",
    title: "Stack AI Alternatives: Workflow Builder vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.stack-ai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Stack AI
        </a>{" "}
        provides a workflow builder for AI agents and automations. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Stack AI is a workflow builder for AI agents and automations.",
      "It supports drag-and-drop workflows plus code and API nodes.",
      "The platform integrates with common apps, data sources, and LLMs.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Stack AI for AI workflow automation; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Stack AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Stack AI is an AI workflow builder. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Stack AI provides a workflow builder to design AI agents and
        automations. {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
      </>,
      <>
        The workflow builder includes drag-and-drop nodes with options for
        code, APIs, and integrations. {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
      </>,
      <>
        Stack AI highlights integrations across data sources and LLMs to build
        end-to-end AI workflows. {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
      </>,
      "If your bottleneck is orchestrating AI workflows and agents, Stack AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Stack AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI workflow builder and automation platform.
                {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
              </>
            ),
          },
          {
            label: "Workflow",
            value: (
              <>
                Drag-and-drop builder with code and API nodes.
                {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
              </>
            ),
          },
          {
            label: "Integrations",
            value: (
              <>
                Connects to data sources, apps, and LLMs.
                {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams building AI workflows and agent automations",
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
        Stack AI provides a workflow builder for AI agents and automations.
        {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
      </>,
      <>
        Workflows support drag-and-drop nodes with code and API steps.
        {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
      </>,
      <>
        Stack AI integrates with data sources, apps, and LLMs.
        {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Stack AI Is Strong",
    intro:
      "Based on Stack AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Workflow automation",
        description: (
          <>
            Stack AI centers on building AI workflows and agents.
            {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
          </>
        ),
      },
      {
        title: "Flexible node types",
        description: (
          <>
            The builder supports drag-and-drop nodes, code blocks, and APIs.
            {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
          </>
        ),
      },
      {
        title: "Integrations",
        description: (
          <>
            Stack AI integrates with data sources and LLM providers.
            {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Stack AI automates AI workflows. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of orchestrating AI workflows.",
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
    title: "Stack AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Stack AI's workflow automation focus.",
    columns: [
      { key: "stackai", label: "Stack AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          stackai: (
            <>
              AI workflow builder and automation platform.
              {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core output",
        values: {
          stackai: "Automated workflows and AI agents",
          claru: "Training-ready physical AI datasets",
        },
      },
      {
        dimension: "Data capture",
        values: {
          stackai: "Workflow orchestration across data sources",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          stackai: "Workflow nodes and AI model integrations",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          stackai: "Teams building AI workflows and automations",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Stack AI vs Claru",
    intro:
      "Stack AI focuses on workflow automation. Claru focuses on physical-world capture and enrichment.",
    blocks: [
      {
        title: "Automation vs datasets",
        paragraphs: [
          "Stack AI helps teams build AI workflows and agents.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Stack AI integrates across data sources and models.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Stack AI is strong when orchestration and automation are the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Stack AI Is a Fit",
    competitorBullets: [
      "You need to automate AI workflows and agent pipelines.",
      "You want drag-and-drop workflow building with code and API steps.",
      "You need integrations across apps, data sources, and LLMs.",
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
        title: "Humanloop Alternatives",
        desc: "LLM workflow tooling vs physical AI specialization.",
        href: "/compare/humanloop-alternatives",
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
      "Choose Stack AI when you need to automate AI workflows and integrate multiple tools.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Stack AI for automation, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Stack AI?",
        answer: (
          <>
            Stack AI provides a workflow builder for AI agents and automations.
            {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
          </>
        ),
      },
      {
        question: "Does Stack AI support code and API steps?",
        answer: (
          <>
            The workflow builder supports drag-and-drop nodes with code and API
            steps. {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
          </>
        ),
      },
      {
        question: "What does Stack AI integrate with?",
        answer: (
          <>
            Stack AI highlights integrations across data sources and LLMs.
            {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
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
    {
      label: "Stack AI Workflow Builder",
      url: "https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder",
    },
    { label: "Stack AI Product", url: "https://www.stack-ai.com/product/workflow-builder" },
  ],
};
