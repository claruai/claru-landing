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

export const deepenAiComparison: ComparisonData = {
  slug: "deepen-ai-alternatives",
  competitor: {
    name: "Deepen AI",
    siteUrl: "https://deepen.ai",
    category: "Physical AI data engine",
  },
  meta: {
    title: "Deepen AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Deepen AI and Claru for physical AI training data. Deepen AI provides a data engine for physical AI with annotation, calibration, and validation tools. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Deepen AI alternative",
      "Deepen AI alternatives",
      "Deepen AI vs Claru",
      "physical AI data engine",
      "sensor calibration",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Deepen AI Alternatives",
    title: "Deepen AI Alternatives: Data Engine vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://deepen.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Deepen AI
        </a>{" "}
        provides a data engine for physical AI with annotation, calibration,
        and validation tools. If you need physical-world capture and enrichment
        for robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Deepen AI provides a data engine for physical AI teams.",
      "It highlights annotation, sensor calibration, and data validation tools.",
      "Deepen AI supports workflows for AV, robotics, and related physical AI teams.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Deepen AI for data tooling; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Deepen AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Deepen AI provides data tools for physical AI. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Deepen AI positions itself as a data engine for physical AI.
        {sourceLink("https://deepen.ai/", "[1]")}
      </>,
      <>
        The platform highlights annotation, sensor calibration, and data
        validation capabilities. {sourceLink("https://deepen.ai/", "[2]")}
      </>,
      <>
        Deepen AI describes workflows for AV, robotics, and other physical AI
        programs. {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
      </>,
      "If your bottleneck is data tooling for physical AI, Deepen AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Deepen AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data engine for physical AI.
                {sourceLink("https://deepen.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Capabilities",
            value: (
              <>
                Annotation, sensor calibration, and data validation.
                {sourceLink("https://deepen.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Use cases",
            value: (
              <>
                AV, robotics, and physical AI workflows.
                {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing physical AI data tooling",
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
        Deepen AI positions itself as a data engine for physical AI.
        {sourceLink("https://deepen.ai/", "[1]")}
      </>,
      <>
        The platform highlights annotation, sensor calibration, and data
        validation tools. {sourceLink("https://deepen.ai/", "[2]")}
      </>,
      <>
        Deepen AI describes workflows for AV, robotics, and physical AI teams.
        {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Deepen AI Is Strong",
    intro:
      "Based on Deepen AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Physical AI tooling",
        description: (
          <>
            Deepen AI positions itself as a data engine for physical AI.
            {sourceLink("https://deepen.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Calibration and validation",
        description: (
          <>
            The platform highlights sensor calibration and data validation.
            {sourceLink("https://deepen.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Physical AI workflows",
        description: (
          <>
            Deepen AI cites AV and robotics workflows.
            {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Deepen AI provides data tooling. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of only providing data tools.",
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
    title: "Deepen AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Deepen AI's tooling focus.",
    columns: [
      { key: "deepen", label: "Deepen AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          deepen: (
            <>
              Data engine for physical AI.
              {sourceLink("https://deepen.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Capabilities",
        values: {
          deepen: (
            <>
              Annotation, calibration, and data validation tools.
              {sourceLink("https://deepen.ai/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Use cases",
        values: {
          deepen: (
            <>
              AV and robotics data workflows.
              {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
            </>
          ),
          claru: "Robotics and embodied AI datasets",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          deepen: "Annotation and calibration workflows",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          deepen: "Teams needing physical AI data tooling",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Deepen AI vs Claru",
    intro:
      "Deepen AI specializes in data tooling. Claru specializes in capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Tooling vs pipeline",
        paragraphs: [
          "Deepen AI provides annotation, calibration, and validation tools.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Deepen AI assumes teams already have data to process.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Deepen AI is strong when data tooling is the bottleneck.",
          "Claru is stronger when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Deepen AI Is a Fit",
    competitorBullets: [
      "You need annotation, calibration, or validation tooling for physical AI.",
      "You already have data and need to process and validate it.",
      "You work on AV or robotics programs requiring sensor data workflows.",
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
      "Choose Deepen AI when you need annotation, calibration, or validation tooling for physical AI data.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Deepen AI for tooling, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Deepen AI?",
        answer: (
          <>
            Deepen AI positions itself as a data engine for physical AI.
            {sourceLink("https://deepen.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What capabilities does Deepen AI highlight?",
        answer: (
          <>
            The platform highlights annotation, sensor calibration, and data
            validation. {sourceLink("https://deepen.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "What teams use Deepen AI?",
        answer: (
          <>
            Deepen AI describes workflows for AV and robotics programs.
            {sourceLink("https://help.deepen.ai/deepen-ai-enterprise/faq", "[3]")}
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
    { label: "Deepen AI", url: "https://deepen.ai/" },
    { label: "Deepen AI FAQ", url: "https://help.deepen.ai/deepen-ai-enterprise/faq" },
  ],
};
