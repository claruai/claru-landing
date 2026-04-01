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

export const company1840Comparison: ComparisonData = {
  slug: "1840-company-alternatives",
  competitor: {
    name: "1840 & Company",
    siteUrl: "https://www.1840andco.com",
    category: "Managed data labeling and annotation services",
  },
  meta: {
    title: "1840 & Company Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare 1840 & Company and Claru for physical AI training data. 1840 & Company provides managed data labeling and annotation services across modalities. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "1840 & Company alternative",
      "1840 & Company alternatives",
      "1840 & Company vs Claru",
      "data labeling services",
      "data annotation services",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "1840 & Company Alternatives",
    title: "1840 & Company Alternatives: Labeling Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.1840andco.com/back-office/data-annotation"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          1840 & Company
        </a>{" "}
        provides managed data labeling and annotation services across
        modalities. If you need physical-world capture and enrichment for
        robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "1840 & Company provides managed data labeling and annotation services.",
      "Services cover computer vision, NLP, audio, and multi-modal data.",
      "They highlight image, video, and 3D point cloud annotation workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose 1840 & Company for labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What 1840 & Company Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: 1840 & Company provides managed annotation services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        1840 & Company positions its offering as managed data labeling and
        annotation services. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
      </>,
      <>
        The services cover computer vision, NLP, audio, and multi-modal data
        annotation. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
      </>,
      <>
        The company highlights image, video, and 3D point cloud annotation
        workflows. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
      </>,
      "If your bottleneck is annotation services and managed teams, 1840 & Company is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "1840 & Company at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed data labeling and annotation services.
                {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Computer vision, NLP, audio, and multi-modal data.
                {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
              </>
            ),
          },
          {
            label: "CV workflows",
            value: (
              <>
                Image, video, and 3D point cloud annotation.
                {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
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
        1840 & Company provides managed data labeling and annotation services.
        {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
      </>,
      <>
        Services cover computer vision, NLP, audio, and multi-modal annotation.
        {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
      </>,
      <>
        The company highlights image, video, and 3D point cloud annotation.
        {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where 1840 & Company Is Strong",
    intro:
      "Based on 1840 & Company's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Managed annotation services",
        description: (
          <>
            1840 & Company focuses on managed data labeling services.
            {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Services span computer vision, NLP, audio, and multi-modal data.
            {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
          </>
        ),
      },
      {
        title: "3D CV workflows",
        description: (
          <>
            The company highlights image, video, and 3D point cloud annotation.
            {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "1840 & Company provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "1840 & Company vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing 1840 & Company's managed services model.",
    columns: [
      { key: "company1840", label: "1840 & Company" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          company1840: (
            <>
              Managed data labeling and annotation services.
              {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          company1840: (
            <>
              Computer vision, NLP, audio, and multi-modal data.
              {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "CV workflows",
        values: {
          company1840: (
            <>
              Image, video, and 3D point cloud annotation.
              {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
            </>
          ),
          claru: "Egocentric video, depth maps, pose, segmentation",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          company1840: "Annotation services and QA",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          company1840: "Teams needing managed annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: 1840 & Company vs Claru",
    intro:
      "1840 & Company specializes in managed annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "1840 & Company delivers managed data labeling services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "1840 & Company helps teams label existing data across modalities.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "1840 & Company is strong when you need managed annotation teams.",
          "Claru is stronger when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When 1840 & Company Is a Fit",
    competitorBullets: [
      "You need managed annotation services across CV, NLP, and audio.",
      "You already have data and need labeling throughput.",
      "You want a managed service partner rather than tooling only.",
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
      "Choose 1840 & Company when you need managed data labeling and annotation services.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: 1840 & Company for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is 1840 & Company?",
        answer: (
          <>
            1840 & Company provides managed data labeling and annotation
            services. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does 1840 & Company cover?",
        answer: (
          <>
            The company highlights computer vision, NLP, audio, and multi-modal
            annotation services. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[2]")}
          </>
        ),
      },
      {
        question: "Does 1840 & Company support 3D annotation?",
        answer: (
          <>
            1840 & Company highlights image, video, and 3D point cloud
            annotation. {sourceLink("https://www.1840andco.com/back-office/data-annotation", "[3]")}
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
      label: "1840 & Company Data Annotation",
      url: "https://www.1840andco.com/back-office/data-annotation",
    },
  ],
};
