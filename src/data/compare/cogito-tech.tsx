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

export const cogitoTechComparison: ComparisonData = {
  slug: "cogito-tech-alternatives",
  competitor: {
    name: "Cogito Tech",
    siteUrl: "https://www.cogitotech.com",
    category: "Data labeling and annotation services",
  },
  meta: {
    title: "Cogito Tech Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Cogito Tech and Claru for physical AI training data. Cogito Tech provides data labeling services across image, video, and 3D point cloud. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Cogito Tech alternative",
      "Cogito Tech alternatives",
      "Cogito Tech vs Claru",
      "data labeling services",
      "3D point cloud annotation",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Cogito Tech Alternatives",
    title: "Cogito Tech Alternatives: Labeling Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.cogitotech.com/data-labeling/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Cogito Tech
        </a>{" "}
        provides data labeling services across image, video, and 3D point cloud.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Cogito Tech provides data labeling services for AI teams.",
      "The company highlights image, video, and 3D point cloud annotation.",
      "Cogito Tech emphasizes managed delivery and QA workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Cogito Tech for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Cogito Tech Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Cogito Tech provides managed annotation services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Cogito Tech highlights data labeling services for AI teams.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
      </>,
      <>
        The services include image, video, and 3D point cloud annotation.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
      </>,
      <>
        Cogito Tech emphasizes managed delivery and QA workflows.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
      </>,
      "If your bottleneck is managed labeling services and QA, Cogito Tech is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Cogito Tech at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data labeling services for AI teams.
                {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, and 3D point cloud annotation.
                {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
              </>
            ),
          },
          {
            label: "Delivery",
            value: (
              <>
                Managed workflows and QA.
                {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed labeling services",
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
        Cogito Tech provides data labeling services for AI teams.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
      </>,
      <>
        The services include image, video, and 3D point cloud annotation.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
      </>,
      <>
        Cogito Tech emphasizes managed delivery and QA workflows.
        {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Cogito Tech Is Strong",
    intro:
      "Based on Cogito Tech's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed labeling",
        description: (
          <>
            Cogito Tech delivers managed data labeling services.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            The company highlights image, video, and 3D point cloud annotation.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
          </>
        ),
      },
      {
        title: "Quality assurance",
        description: (
          <>
            Cogito Tech emphasizes QA and managed workflows.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Cogito Tech provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying only on labeling services.",
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
    title: "Cogito Tech vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Cogito Tech's managed services model.",
    columns: [
      { key: "cogito", label: "Cogito Tech" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          cogito: (
            <>
              Data labeling services for AI teams.
              {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          cogito: (
            <>
              Image, video, and 3D point cloud annotation.
              {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Delivery",
        values: {
          cogito: (
            <>
              Managed workflows and QA.
              {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          cogito: "Annotation services and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          cogito: "Teams needing managed labeling services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Cogito Tech vs Claru",
    intro:
      "Cogito Tech specializes in managed annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Cogito Tech delivers managed labeling and QA services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Cogito Tech focuses on labeling existing datasets.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Cogito Tech is strong when you need managed labeling capacity.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Cogito Tech Is a Fit",
    competitorBullets: [
      "You need managed image, video, or 3D point cloud annotation services.",
      "You already have data and need labeling throughput.",
      "You want QA workflows for labeled data.",
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
      "Choose Cogito Tech when you need managed image, video, or 3D point cloud labeling services.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Cogito Tech for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Cogito Tech?",
        answer: (
          <>
            Cogito Tech provides data labeling services for AI teams.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Cogito Tech support?",
        answer: (
          <>
            The company highlights image, video, and 3D point cloud annotation.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Cogito Tech provide QA workflows?",
        answer: (
          <>
            Cogito Tech emphasizes managed delivery and QA workflows.
            {sourceLink("https://www.cogitotech.com/data-labeling/", "[3]")}
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
    { label: "Cogito Tech Data Labeling", url: "https://www.cogitotech.com/data-labeling/" },
  ],
};
