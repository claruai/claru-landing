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

export const mercorComparison: ComparisonData = {
  slug: "mercor-alternatives",
  competitor: {
    name: "Mercor",
    siteUrl: "https://mercor.com",
    category: "AI talent marketplace and remote roles platform",
  },
  meta: {
    title: "Mercor Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Mercor and Claru for physical AI training data. Mercor positions itself as a platform for top-tier, remote AI roles and invites experts to find AI work. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Mercor alternative",
      "Mercor alternatives",
      "Mercor vs Claru",
      "AI talent marketplace",
      "remote AI roles",
      "AI jobs platform",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Mercor Alternatives",
    title: "Mercor Alternatives: AI Talent vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://mercor.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Mercor
        </a>{" "}
        positions itself as a place to find top-tier, remote AI roles. If you
        need physical-world capture and enrichment for robotics, Claru is built
        for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Mercor highlights a platform for top-tier, remote AI roles.",
      "The site positions Mercor as a place to find AI work and shape the future of AI.",
      "Mercor is a talent marketplace rather than a data provider.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Mercor for AI talent sourcing; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Mercor Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Mercor is a talent platform for AI roles. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Mercor highlights a platform for top-tier, remote AI roles.
        {sourceLink("https://mercor.com/", "[1]")}
      </>,
      <>
        The site encourages experts to find AI work and shape the future of AI.
        {sourceLink("https://mercor.com/", "[2]")}
      </>,
      "If your bottleneck is sourcing AI talent, Mercor is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Mercor at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Platform for top-tier, remote AI roles.
                {sourceLink("https://mercor.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Positioning",
            value: (
              <>
                Find AI work and shape the future of AI.
                {sourceLink("https://mercor.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Delivery model",
            value: "Talent marketplace for AI roles",
          },
          {
            label: "Best fit",
            value: "Teams or experts seeking AI talent or roles",
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
        Mercor highlights a platform for top-tier, remote AI roles.
        {sourceLink("https://mercor.com/", "[1]")}
      </>,
      <>
        The site positions Mercor as a place to find AI work and shape the
        future of AI. {sourceLink("https://mercor.com/", "[2]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Mercor Is Strong",
    intro:
      "Based on Mercor's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "AI talent marketplace",
        description: (
          <>
            Mercor positions itself as a platform for top-tier, remote AI roles.
            {sourceLink("https://mercor.com/", "[1]")}
          </>
        ),
      },
      {
        title: "AI work focus",
        description: (
          <>
            The site encourages experts to find AI work and shape the future of
            AI. {sourceLink("https://mercor.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Talent-first model",
        description:
          "Mercor is a talent marketplace rather than a data provider.",
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Mercor provides AI talent matching. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of staffing workflows.",
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
    title: "Mercor vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Mercor's talent platform strengths.",
    columns: [
      { key: "mercor", label: "Mercor" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          mercor: (
            <>
              Platform for top-tier, remote AI roles.
              {sourceLink("https://mercor.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Value proposition",
        values: {
          mercor: (
            <>
              Find AI work and shape the future of AI.
              {sourceLink("https://mercor.com/", "[2]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Delivery model",
        values: {
          mercor: "Talent marketplace for AI roles",
          claru: "Data capture and enrichment pipeline",
        },
      },
      {
        dimension: "Data capture",
        values: {
          mercor: "Not a data capture provider",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          mercor: "Not a data enrichment provider",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          mercor: "Teams or experts seeking AI talent or roles",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Mercor vs Claru",
    intro:
      "Mercor is a talent marketplace. Claru is a capture-first pipeline for physical AI data.",
    blocks: [
      {
        title: "Talent vs data",
        paragraphs: [
          "Mercor focuses on connecting AI expertise with remote roles.",
          "Claru focuses on physical-world capture and enrichment.",
        ],
      },
      {
        title: "Engagement model",
        paragraphs: [
          "Mercor provides a platform for staffing and AI roles.",
          "Claru provides datasets ready for robotics training pipelines.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Mercor is strong when AI staffing is the bottleneck.",
          "Claru is stronger when physical-world data capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Mercor Is a Fit",
    competitorBullets: [
      "You need to source AI talent for remote roles.",
      "You want a marketplace for AI expertise and opportunities.",
      "You are hiring or seeking AI work rather than datasets.",
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
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Appen Alternatives",
        desc: "Managed labeling services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs capture-first datasets.",
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
      "Choose Mercor when you need a platform to source AI talent for remote roles.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Mercor for staffing, Claru for capture-first datasets.",
      "If your project requires physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Mercor?",
        answer: (
          <>
            Mercor highlights a platform for top-tier, remote AI roles.
            {sourceLink("https://mercor.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What does Mercor focus on?",
        answer: (
          <>
            Mercor emphasizes finding AI work and shaping the future of AI.
            {sourceLink("https://mercor.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Mercor a data provider?",
        answer:
          "Mercor is a talent marketplace for AI roles rather than a data capture or enrichment provider.",
      },
      {
        question: "Is Mercor a fit for robotics data capture?",
        answer:
          "Mercor focuses on AI talent matching. Claru is better for capture-first robotics data collection and enrichment.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Mercor and Claru?",
        answer:
          "Some teams use Mercor for AI talent and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Does Mercor offer remote AI roles?",
        answer: (
          <>
            Mercor highlights remote AI roles on its platform.
            {sourceLink("https://mercor.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Who is Mercor for?",
        answer:
          "Mercor is suited to AI experts seeking roles and teams hiring AI talent. Claru is for teams seeking physical AI datasets.",
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
    { label: "Mercor", url: "https://mercor.com/" },
  ],
};
