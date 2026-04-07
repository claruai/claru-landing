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
    paragraphs: [
      "Stack AI emerged as a no-code AI workflow builder that lets teams design, deploy, and iterate on AI agents and automations without deep engineering overhead. The platform connects to popular LLM providers, databases, and enterprise applications through a visual drag-and-drop interface, making it accessible to operations teams, product managers, and developers who need to prototype AI-powered workflows quickly. Stack AI has attracted attention from startups and mid-market companies looking to automate internal processes like document routing, customer support triage, and data enrichment pipelines.",
      "While Stack AI excels at orchestrating digital AI workflows, it operates in a fundamentally different domain than physical AI data providers. Robotics and embodied AI teams need real-world data capture with wearable cameras, task-specific collection protocols, and multi-layer enrichment including depth estimation, human pose detection, and optical flow computation. These requirements cannot be addressed by workflow builders, no matter how flexible. For teams building physical AI systems that learn from demonstrations in the real world, Claru provides the capture-to-delivery pipeline that sits upstream of any workflow automation layer.",
    ],
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
          "Stack AI helps teams build AI workflows and agents through a visual builder that connects LLMs, data sources, and APIs. The platform is designed for digital process automation where the inputs and outputs are text, structured data, or API responses.",
          "Claru delivers capture, enrichment, and training-ready datasets for physical AI. The pipeline starts with real-world collection using wearable cameras and task-specific protocols, then applies enrichment layers like depth estimation and pose detection before delivering datasets in robotics-native formats.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Stack AI integrates across data sources and models, pulling from databases, APIs, and file stores to feed AI workflows. This is valuable for enterprise automation but does not address the need for new physical-world data.",
          "Claru captures new physical-world data tailored to robotics tasks. Each collection program is designed around specific behaviors, environments, and sensor configurations required by the target model architecture.",
        ],
      },
      {
        title: "Physical AI data requirements",
        paragraphs: [
          "Robotics foundation models like RT-2, Octo, and pi0 require training data that includes egocentric video streams, calibrated camera parameters, depth information, and action labels. These data types must be collected from physical environments through structured capture programs.",
          "Workflow automation platforms cannot generate this type of data. Physical AI teams need providers that operate in the physical world, collecting and enriching demonstrations that teach robots how to interact with objects, navigate spaces, and perform manipulation tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Stack AI is strong when orchestration and automation of digital workflows are the bottleneck. Teams automating document processing, customer support, or internal operations benefit from its visual builder and integration ecosystem.",
          "Claru is stronger when physical-world capture is the bottleneck. Teams training robots, world models, or embodied AI agents need dense physical demonstrations with enrichment layers that only a capture-first pipeline can provide.",
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
            Stack AI provides a no-code workflow builder for AI agents and automations. The platform lets teams design AI-powered workflows through a visual drag-and-drop interface that connects to LLM providers, databases, and enterprise applications. Stack AI is used by startups and mid-market companies to automate internal processes like document routing, support triage, and data enrichment without requiring deep engineering expertise.
            {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[1]")}
          </>
        ),
      },
      {
        question: "Does Stack AI support code and API steps?",
        answer: (
          <>
            The workflow builder supports drag-and-drop nodes with code and API steps, allowing teams to combine visual workflow design with custom logic. Users can add Python code blocks, REST API calls, and conditional branching alongside pre-built LLM and database connectors. This flexibility makes it suitable for complex automation scenarios, though it remains focused on digital data processing rather than physical-world data capture or sensor-based enrichment workflows.
            {sourceLink("https://docs.stack-ai.com/stack-ai/workflow-builder/get-started-with-workflow-builder", "[2]")}
          </>
        ),
      },
      {
        question: "What does Stack AI integrate with?",
        answer: (
          <>
            Stack AI highlights integrations across data sources and LLMs, including connections to popular databases, cloud storage providers, and multiple LLM APIs. The integration ecosystem enables teams to build end-to-end AI workflows that pull data from existing sources, process it through AI models, and push results to downstream systems. These integrations are designed for digital data pipelines rather than physical-world data collection or robotics-specific enrichment.
            {sourceLink("https://www.stack-ai.com/product/workflow-builder", "[3]")}
          </>
        ),
      },
      {
        question: "Can Stack AI be used for robotics data?",
        answer:
          "Stack AI is designed for digital AI workflow automation and does not provide physical-world data capture or robotics-specific enrichment. Robotics teams need egocentric video collection, depth estimation, pose detection, and action labeling that originate from structured capture programs in physical environments. For these requirements, a capture-first provider like Claru is the appropriate choice.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your team is building physical AI systems that require real-world demonstrations with depth maps, pose annotations, optical flow, and action labels, Claru provides the end-to-end pipeline from collection through enrichment to training-ready delivery in formats compatible with robotics frameworks.",
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
