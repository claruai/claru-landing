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

export const datacurveComparison: ComparisonData = {
  slug: "datacurve-alternatives",
  competitor: {
    name: "Datacurve",
    siteUrl: "https://datacurve.ai",
    category: "Frontier coding data for foundation models",
  },
  meta: {
    title: "Datacurve Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Datacurve and Claru for physical AI training data. Datacurve provides frontier coding data for foundation model labs, including SFT, RLHF, and evaluation data. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Datacurve alternative",
      "Datacurve alternatives",
      "Datacurve vs Claru",
      "coding data",
      "RLHF datasets",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Datacurve Alternatives",
    title: "Datacurve Alternatives: Coding Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://datacurve.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Datacurve
        </a>{" "}
        provides frontier coding data for foundation model labs. If you need
        physical-world capture and enrichment for robotics, Claru is built for
        physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Datacurve focuses on frontier coding data for foundation model labs.",
      "It offers high-quality post-training and evaluation data, including SFT, RL environments, and RLHF.",
      "Datacurve highlights agentic workflow traces and complex coding tasks.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Datacurve for coding data; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Datacurve Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Datacurve produces coding data for foundation model labs. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Datacurve positions itself as a provider of frontier coding data for
        foundation model labs and enterprises. {sourceLink("https://datacurve.ai/", "[1]")}
      </>,
      <>
        The company highlights post-training and evaluation data formats,
        including SFT, reinforcement learning environments, and RLHF.
        {sourceLink("https://datacurve.ai/", "[2]")}
      </>,
      <>
        Datacurve also describes agentic workflow traces captured through a
        custom IDE and other complex coding tasks.
        {sourceLink("https://datacurve.ai/", "[3]")}
      </>,
      "If your bottleneck is coding data for LLMs or agents, Datacurve is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Datacurve at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Frontier coding data for foundation model labs.
                {sourceLink("https://datacurve.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Data formats",
            value: (
              <>
                SFT, RL environments, and RLHF for coding tasks.
                {sourceLink("https://datacurve.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Specialization",
            value: (
              <>
                Agentic workflow traces and complex coding tasks.
                {sourceLink("https://datacurve.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams training or evaluating code-focused foundation models",
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
        Datacurve focuses on frontier coding data for foundation model labs.
        {sourceLink("https://datacurve.ai/", "[1]")}
      </>,
      <>
        The company highlights SFT, RL environments, and RLHF data formats.
        {sourceLink("https://datacurve.ai/", "[2]")}
      </>,
      <>
        Datacurve describes agentic workflow traces and complex coding tasks.
        {sourceLink("https://datacurve.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Datacurve Is Strong",
    intro:
      "Based on Datacurve's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Coding data specialization",
        description: (
          <>
            Datacurve focuses on frontier coding data for foundation models.
            {sourceLink("https://datacurve.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Post-training formats",
        description: (
          <>
            The offering includes SFT, RL environments, and RLHF data.
            {sourceLink("https://datacurve.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Agentic traces",
        description: (
          <>
            Datacurve highlights agentic workflow traces captured via a custom
            IDE. {sourceLink("https://datacurve.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Datacurve focuses on coding data. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of code-only datasets.",
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
    title: "Datacurve vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Datacurve's coding data specialization.",
    columns: [
      { key: "datacurve", label: "Datacurve" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          datacurve: (
            <>
              Frontier coding data for foundation model labs.
              {sourceLink("https://datacurve.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Data types",
        values: {
          datacurve: "Code SFT, RLHF, and evaluation datasets",
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Capture model",
        values: {
          datacurve: "Human expert coding data programs",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          datacurve: "Agentic traces and evaluation tasks",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          datacurve: "Teams training or evaluating code-focused models",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Datacurve vs Claru",
    intro:
      "Datacurve specializes in coding data. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Code data vs physical data",
        paragraphs: [
          "Datacurve focuses on high-quality coding data for foundation models.",
          "Claru focuses on real-world capture for robotics and embodied AI.",
        ],
      },
      {
        title: "Output format",
        paragraphs: [
          "Datacurve outputs coding datasets and evaluation signals.",
          "Claru outputs multimodal robotics-ready datasets with rich annotations.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Datacurve is strong for code model training and evaluation.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Datacurve Is a Fit",
    competitorBullets: [
      "You need coding SFT or RLHF data for foundation models.",
      "You are building code-focused model evaluation suites.",
      "You want agentic workflow traces for software agents.",
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
        title: "Revelo Alternatives",
        desc: "Code LLM human data vs physical AI capture.",
        href: "/compare/revelo-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Datacurve when you need coding SFT or RLHF data for foundation models.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Datacurve for coding data, Claru for physical AI datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Datacurve?",
        answer: (
          <>
            Datacurve provides frontier coding data for foundation model labs.
            {sourceLink("https://datacurve.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What data formats does Datacurve highlight?",
        answer: (
          <>
            Datacurve highlights SFT, RL environments, and RLHF data formats.
            {sourceLink("https://datacurve.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Datacurve provide agentic workflow traces?",
        answer: (
          <>
            Datacurve describes agentic workflow traces captured via a custom
            IDE. {sourceLink("https://datacurve.ai/", "[3]")}
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
    { label: "Datacurve", url: "https://datacurve.ai/" },
  ],
};
