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

export const ezdiaComparison: ComparisonData = {
  slug: "ezdia-alternatives",
  competitor: {
    name: "EZdia",
    siteUrl: "https://www.ezdia.com",
    category: "Data annotation services",
  },
  meta: {
    title: "EZdia Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare EZdia and Claru for physical AI training data. EZdia provides data annotation services and human-in-the-loop workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "EZdia alternative",
      "EZdia alternatives",
      "EZdia vs Claru",
      "data annotation services",
      "data labeling services",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "EZdia Alternatives",
    title: "EZdia Alternatives: Annotation Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.ezdia.com/data-annotation/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          EZdia
        </a>{" "}
        provides data annotation services and human-in-the-loop workflows. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "EZdia offers data annotation services for AI, ML, and NLP workflows.",
      "They emphasize human labelers and human-in-the-loop processes.",
      "EZdia highlights Crewmachine as an API-enabled HITL service.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose EZdia for annotation services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What EZdia Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: EZdia provides annotation services and HITL workflows. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        EZdia positions itself as a data annotation services provider for AI,
        ML, and NLP. {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}
      </>,
      <>
        The company emphasizes human labelers and human-in-the-loop processes.
        {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}
      </>,
      <>
        EZdia also highlights Crewmachine as an API-enabled HITL service.
        {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}
      </>,
      "EZdia has carved out a niche in the data annotation market by combining content services with data labeling capabilities. The company originally focused on content creation and SEO services before expanding into AI data annotation, bringing a content-first perspective to the data labeling space. EZdia emphasizes managed human labeling as a core differentiator, positioning Crewmachine as an API layer that allows programmatic access to human-in-the-loop annotation workflows. This hybrid approach lets AI teams integrate human labeling directly into their development pipelines.",
      "For physical AI and robotics teams, the distinction between annotation services and capture-first pipelines is fundamental. EZdia helps teams label data that already exists, which works well for NLP, content classification, and standard image labeling tasks. However, robotics training requires egocentric video of manipulation tasks, multi-angle recordings of real-world interactions, and sensor-aligned data that must be collected from scratch using specialized equipment and protocols. The capture gap between what annotation providers offer and what robotics models need is the key difference that shapes provider selection for physical AI teams.",
      "If your bottleneck is annotation services and HITL workflows, EZdia is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "EZdia at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation services for AI, ML, and NLP.
                {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Human labelers and human-in-the-loop workflows.
                {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}
              </>
            ),
          },
          {
            label: "Workflow",
            value: (
              <>
                Crewmachine API-enabled HITL service.
                {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed annotation services",
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
        EZdia provides data annotation services for AI, ML, and NLP.
        {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}
      </>,
      <>
        EZdia emphasizes human labelers and human-in-the-loop processes.
        {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}
      </>,
      <>
        EZdia highlights Crewmachine as an API-enabled HITL service.
        {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where EZdia Is Strong",
    intro:
      "Based on EZdia's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed annotation services",
        description: (
          <>
            EZdia positions itself as a data annotation services provider.
            {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        title: "Human-in-the-loop delivery",
        description: (
          <>
            EZdia emphasizes human labelers and HITL workflows.
            {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}
          </>
        ),
      },
      {
        title: "API-enabled workflow",
        description: (
          <>
            EZdia highlights the Crewmachine API-enabled HITL service.
            {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "EZdia provides annotation services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
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
    title: "EZdia vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing EZdia's services model.",
    columns: [
      { key: "ezdia", label: "EZdia" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          ezdia: (
            <>
              Data annotation services and HITL workflows.
              {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Delivery model",
        values: {
          ezdia: (
            <>
              Human labelers and human-in-the-loop processes.
              {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Workflow tooling",
        values: {
          ezdia: (
            <>
              Crewmachine API-enabled HITL service.
              {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          ezdia: "Annotation services and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          ezdia: "Teams needing managed annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: EZdia vs Claru",
    intro:
      "EZdia specializes in annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "EZdia delivers managed annotation services and HITL workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "EZdia helps teams label existing data.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Robotics data requirements",
        paragraphs: [
          "Frontier robotics models including imitation learning systems, diffusion policies, and vision-language-action architectures need training data with properties that standard annotation services do not produce: egocentric viewpoints matching robot camera placements, manipulation sequences with hand-object interaction context, depth-aligned frames for spatial reasoning, and temporal action segmentation for policy learning.",
          "Claru builds capture programs around these requirements, deploying trained collectors with wearable cameras to record task-specific scenarios, then enriching every clip with depth estimation, human pose detection, instance segmentation, and optical flow before packaging in robotics-native formats like RLDS and WebDataset.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "EZdia is strong when you need labeling capacity and HITL workflows, particularly for NLP, content classification, and standard annotation tasks where the Crewmachine API allows programmatic integration of human labeling into development pipelines.",
          "Claru is stronger when capture and enrichment are the bottleneck, especially for robotics teams that need new task-specific physical-world data with multi-layer enrichment as a standard output.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When EZdia Is a Fit",
    competitorBullets: [
      "You need managed annotation services for AI, ML, or NLP.",
      "You want human-in-the-loop labeling with QA.",
      "You want API-enabled labeling workflows.",
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
      "Choose EZdia when you need managed annotation services and HITL workflows.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: EZdia for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is EZdia?",
        answer: (
          <>
            EZdia provides data annotation services for AI, ML, and NLP, having expanded from its original focus on content creation and SEO services.{" "}
            {sourceLink("https://www.ezdia.com/data-annotation/", "[1]")}{" "}
            The company offers managed human labeling across multiple data types and emphasizes the combination of human expertise with API-enabled workflows through its Crewmachine platform. EZdia targets AI teams that need outsourced annotation capacity with human-in-the-loop quality assurance built into the labeling process.
          </>
        ),
      },
      {
        question: "Does EZdia use human-in-the-loop workflows?",
        answer: (
          <>
            EZdia emphasizes human labelers and HITL processes as a core part of its annotation approach.{" "}
            {sourceLink("https://www.ezdia.com/data-annotation/", "[2]")}{" "}
            The company positions human-driven labeling as a quality differentiator, arguing that human annotators provide nuanced understanding that automated labeling tools may miss. This approach is particularly relevant for tasks requiring contextual judgment, such as sentiment analysis, content moderation, and entity recognition in complex text.
          </>
        ),
      },
      {
        question: "What is Crewmachine?",
        answer: (
          <>
            EZdia highlights Crewmachine as an API-enabled HITL service that allows AI teams to integrate human labeling into their development pipelines programmatically.{" "}
            {sourceLink("https://www.ezdia.com/data-annotation/", "[3]")}{" "}
            Crewmachine provides an API layer on top of EZdia&apos;s human annotation workforce, enabling automated task submission, result retrieval, and quality monitoring. This approach bridges the gap between manual annotation services and fully automated ML pipelines, letting teams maintain human quality oversight while scaling their data operations.
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your training pipeline requires new physical-world data such as egocentric video of human demonstrations, task-specific manipulation recordings, or multi-sensor capture sequences, Claru provides the collection infrastructure and enrichment pipeline that annotation-only providers do not offer. Claru delivers depth maps, pose estimation, segmentation, and optical flow as standard enrichment layers, packaged in robotics-native formats for direct use in training.",
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
    { label: "EZdia Data Annotation", url: "https://www.ezdia.com/data-annotation/" },
  ],
};
