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

export const joinstellarComparison: ComparisonData = {
  slug: "joinstellar-alternatives",
  competitor: {
    name: "Joinstellar",
    siteUrl: "https://joinstellar.ai",
    category: "Contributor marketplace for AI training and data annotation",
  },
  meta: {
    title: "Joinstellar Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Joinstellar and Claru for physical AI training data. Joinstellar promotes flexible project-based work in data annotation and AI training via a self-service contributor platform. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Joinstellar alternative",
      "Joinstellar alternatives",
      "Joinstellar vs Claru",
      "data annotation marketplace",
      "AI training work",
      "contributor platform",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Joinstellar Alternatives",
    title: "Joinstellar Alternatives: Contributor Marketplace vs Physical AI",
    subtitle: (
      <>
        <a
          href="https://joinstellar.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Joinstellar
        </a>{" "}
        promotes flexible project-based work in data annotation and AI training
        through a self-service contributor platform. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Joinstellar positions itself as a platform for flexible project-based work in data annotation and AI training.",
      "The site emphasizes a self-service contributor platform where workers can control their workflow and access resources.",
      "Joinstellar notes there are no contracts or required schedules, highlighting flexible participation.",
      "The platform suggests project-based opportunities and skill matching for contributors.",
      "Joinstellar is a workforce marketplace, not a capture-first robotics data pipeline.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Joinstellar for contributor capacity; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Joinstellar Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Joinstellar is a contributor marketplace for AI training tasks. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Joinstellar promotes flexible project-based work in data annotation and
        AI training. {sourceLink("https://joinstellar.ai/", "[1]")}
      </>,
      <>
        The platform highlights a self-service contributor experience where
        individuals control their workflow and access the resources needed to
        work.
        {sourceLink("https://joinstellar.ai/", "[2]")}
      </>,
      <>
        Joinstellar notes there are no contracts or required schedules.
        {sourceLink("https://joinstellar.ai/", "[3]")}
      </>,
      "If your bottleneck is access to distributed contributor capacity, Joinstellar is a fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Joinstellar at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Flexible project-based work in data annotation and AI training.
                {sourceLink("https://joinstellar.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Model",
            value: (
              <>
                Self-service contributor platform with workflow control.
                {sourceLink("https://joinstellar.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Flexibility",
            value: (
              <>
                No contracts or required schedules highlighted.
                {sourceLink("https://joinstellar.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Core output",
            value: "Contributor capacity for annotation tasks",
          },
          {
            label: "Best fit",
            value: "Teams needing flexible annotation workforce access",
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
        Joinstellar promotes flexible project-based work in data annotation and
        AI training.
        {sourceLink("https://joinstellar.ai/", "[1]")}
      </>,
      <>
        The platform highlights a self-service contributor experience with
        workflow control and resources.
        {sourceLink("https://joinstellar.ai/", "[2]")}
      </>,
      <>
        Joinstellar notes there are no contracts or required schedules.
        {sourceLink("https://joinstellar.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Joinstellar Is Strong",
    intro:
      "Joinstellar emphasizes flexible contributor access and a self-service workflow model.",
    cards: [
      {
        title: "Flexible contributor access",
        description: (
          <>
            Joinstellar promotes flexible project-based work for data
            annotation and AI training.
            {sourceLink("https://joinstellar.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Self-service platform",
        description: (
          <>
            The platform highlights self-service workflows with control over
            how work is completed.
            {sourceLink("https://joinstellar.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Flexible scheduling",
        description: (
          <>
            Joinstellar notes there are no contracts or required schedules.
            {sourceLink("https://joinstellar.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Joinstellar is a contributor marketplace. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on marketplace labor alone.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, and motion signals are generated as first-class outputs, not add-ons.",
      },
      {
        title: "Robotics-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Joinstellar vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison highlights a contributor marketplace versus a capture-first physical AI pipeline.",
    columns: [
      { key: "joinstellar", label: "Joinstellar" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          joinstellar: (
            <>
              Flexible project-based work in data annotation and AI training.
              {sourceLink("https://joinstellar.ai/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Operating model",
        values: {
          joinstellar: (
            <>
              Self-service contributor platform with workflow control.
              {sourceLink("https://joinstellar.ai/", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "Scheduling",
        values: {
          joinstellar: (
            <>
              No contracts or required schedules highlighted.
              {sourceLink("https://joinstellar.ai/", "[3]")}
            </>
          ),
          claru: "Task-specific capture programs with trained operators",
        },
      },
      {
        dimension: "Data capture",
        values: {
          joinstellar: "Depends on contributor task supply",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          joinstellar: "Teams sourcing distributed annotation labor",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Joinstellar vs Claru",
    intro:
      "Joinstellar is a contributor marketplace. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Marketplace vs pipeline",
        paragraphs: [
          "Joinstellar connects contributors to AI training and annotation tasks.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Operational control",
        paragraphs: [
          "Joinstellar highlights self-service contributor workflows and flexible schedules.",
          "Claru controls capture quality through trained collector networks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Joinstellar is a strong fit for distributed contributor capacity.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Joinstellar Is a Fit",
    competitorBullets: [
      "You need access to a distributed contributor marketplace.",
      "You have annotation tasks that can be completed via flexible contributors.",
      "You want a self-service model with contributor-controlled workflows.",
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
        title: "Clickworker Alternatives",
        desc: "Crowd data services vs physical AI capture.",
        href: "/compare/clickworker-alternatives",
      },
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
        title: "Claru vs Luel",
        desc: "Marketplace data vs training-ready physical AI datasets.",
        href: "/compare/claru-vs-luel",
      },
    ],
  },
  decision: {
    title: "How to Choose",
    paragraphs: [
      "Choose Joinstellar when you need access to a contributor marketplace for annotation tasks.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Joinstellar for distributed labeling, Claru for physical data capture.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Joinstellar?",
        answer: (
          <>
            Joinstellar promotes flexible project-based work in data annotation
            and AI training.
            {sourceLink("https://joinstellar.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "How does the Joinstellar platform work?",
        answer: (
          <>
            The site highlights a self-service contributor experience with
            workflow control and resources.
            {sourceLink("https://joinstellar.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Joinstellar require contracts or schedules?",
        answer: (
          <>
            Joinstellar notes there are no contracts or required schedules.
            {sourceLink("https://joinstellar.ai/", "[3]")}
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
  sources: [{ label: "Joinstellar", url: "https://joinstellar.ai/" }],
};
