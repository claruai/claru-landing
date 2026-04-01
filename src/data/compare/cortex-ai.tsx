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

export const cortexAiComparison: ComparisonData = {
  slug: "cortex-ai-alternatives",
  competitor: {
    name: "Cortex AI",
    siteUrl: "https://cortexrobot.ai",
    category: "Egocentric robotics data capture",
  },
  meta: {
    title: "Cortex AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Cortex AI and Claru for physical AI training data. Cortex AI collects egocentric data with rich annotations like hand pose and depth, plus robot trajectories. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Cortex AI alternative",
      "Cortex AI alternatives",
      "Cortex AI vs Claru",
      "egocentric data",
      "robotics trajectories",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Cortex AI Alternatives",
    title: "Cortex AI Alternatives: Egocentric Data vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://cortexrobot.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Cortex AI
        </a>{" "}
        collects egocentric data for robotics with rich annotations like hand
        pose and depth, plus robot trajectories. If you need broader
        physical-world capture and enrichment, Claru is built for physical AI
        from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Cortex AI focuses on egocentric data collection for robotics.",
      "The company highlights hand pose, body pose, depth, and subtask annotations.",
      "Cortex AI also provides robot trajectories for fine-tuning world models.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Cortex AI for egocentric robotics datasets; choose Claru for capture + enrichment across tasks.",
    ],
  },
  overview: {
    title: "What Cortex AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Cortex AI specializes in egocentric robotics data. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Cortex AI positions itself as collecting egocentric data for robotics.
        {sourceLink("https://cortexrobot.ai/", "[1]")}
      </>,
      <>
        The company highlights annotations such as hand pose, body pose, depth,
        and subtask labels. {sourceLink("https://cortexrobot.ai/", "[2]")}
      </>,
      <>
        Cortex AI also provides robot trajectories for fine-tuning world models
        and robotics systems. {sourceLink("https://cortexrobot.ai/", "[3]")}
      </>,
      "If your bottleneck is egocentric robotics data, Cortex AI is a strong fit. If your bottleneck is broader physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Cortex AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Egocentric robotics data collection.
                {sourceLink("https://cortexrobot.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Annotations",
            value: (
              <>
                Hand pose, body pose, depth, subtask labels.
                {sourceLink("https://cortexrobot.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Outputs",
            value: (
              <>
                Robot trajectories for fine-tuning world models.
                {sourceLink("https://cortexrobot.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing egocentric robotics datasets",
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
        Cortex AI focuses on egocentric data collection for robotics.
        {sourceLink("https://cortexrobot.ai/", "[1]")}
      </>,
      <>
        The company highlights hand pose, body pose, depth, and subtask
        annotations. {sourceLink("https://cortexrobot.ai/", "[2]")}
      </>,
      <>
        Cortex AI provides robot trajectories for fine-tuning world models.
        {sourceLink("https://cortexrobot.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Cortex AI Is Strong",
    intro:
      "Based on Cortex AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Egocentric focus",
        description: (
          <>
            Cortex AI emphasizes egocentric data collection for robotics.
            {sourceLink("https://cortexrobot.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Rich annotations",
        description: (
          <>
            The platform highlights hand pose, body pose, depth, and subtask
            annotations. {sourceLink("https://cortexrobot.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Robot trajectories",
        description: (
          <>
            Cortex AI provides robot trajectories for fine-tuning world models.
            {sourceLink("https://cortexrobot.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Cortex AI specializes in egocentric robotics data. Claru is a capture-and-enrichment pipeline for broader physical AI tasks.",
    cards: [
      {
        title: "Task breadth",
        description:
          "Claru captures data across a wider range of physical tasks and environments.",
      },
      {
        title: "Multi-layer enrichment",
        description:
          "Claru delivers depth, pose, segmentation, optical flow, and aligned captions as standard outputs.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Cortex AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Cortex AI's egocentric specialization.",
    columns: [
      { key: "cortex", label: "Cortex AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          cortex: (
            <>
              Egocentric robotics data collection.
              {sourceLink("https://cortexrobot.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Annotations",
        values: {
          cortex: (
            <>
              Hand pose, body pose, depth, subtask labels.
              {sourceLink("https://cortexrobot.ai/", "[2]")}
            </>
          ),
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Outputs",
        values: {
          cortex: (
            <>
              Robot trajectories for fine-tuning world models.
              {sourceLink("https://cortexrobot.ai/", "[3]")}
            </>
          ),
          claru: "Training-ready datasets across physical AI tasks",
        },
      },
      {
        dimension: "Best fit",
        values: {
          cortex: "Teams needing egocentric robotics datasets",
          claru: "Teams needing capture + enrichment across physical tasks",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Cortex AI vs Claru",
    intro:
      "Cortex AI specializes in egocentric robotics data. Claru specializes in broader physical AI capture and enrichment.",
    blocks: [
      {
        title: "Egocentric focus vs task breadth",
        paragraphs: [
          "Cortex AI emphasizes egocentric data for robotics tasks.",
          "Claru captures across tasks, environments, and modalities for robotics training.",
        ],
      },
      {
        title: "Annotation coverage",
        paragraphs: [
          "Cortex AI highlights hand pose, body pose, depth, and subtask labels.",
          "Claru adds enrichment layers and delivers robotics-native dataset formats.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Cortex AI is a strong fit for egocentric robotics datasets.",
          "Claru is better when you need capture and enrichment across physical AI tasks.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Cortex AI Is a Fit",
    competitorBullets: [
      "You need egocentric data for manipulation or robotics tasks.",
      "You want hand pose, body pose, and depth annotations.",
      "You want robot trajectories for fine-tuning world models.",
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
        title: "Asimov Alternatives",
        desc: "Egocentric human data vs physical AI capture.",
        href: "/compare/asimov-yc-w26-alternatives",
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
      "Choose Cortex AI when you need egocentric datasets with rich pose and depth annotations.",
      "Choose Claru when you need capture and enrichment across a broader set of physical AI tasks.",
      "Some teams use both: Cortex AI for egocentric data, Claru for broader physical AI coverage.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Cortex AI?",
        answer: (
          <>
            Cortex AI focuses on egocentric data collection for robotics.
            {sourceLink("https://cortexrobot.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "What annotations does Cortex AI provide?",
        answer: (
          <>
            Cortex AI highlights hand pose, body pose, depth, and subtask
            annotations. {sourceLink("https://cortexrobot.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Cortex AI provide robot trajectories?",
        answer: (
          <>
            Cortex AI notes robot trajectories for fine-tuning world models.
            {sourceLink("https://cortexrobot.ai/", "[3]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets across multiple task types.",
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
    { label: "Cortex AI", url: "https://cortexrobot.ai/" },
  ],
};
