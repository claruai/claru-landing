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

export const macgenceComparison: ComparisonData = {
  slug: "macgence-alternatives",
  competitor: {
    name: "Macgence",
    siteUrl: "https://macgence.com",
    category: "AI training data services and annotation",
  },
  meta: {
    title: "Macgence Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Macgence and Claru for physical AI training data. Macgence offers data collection, annotation, validation, and RLHF services with global scale and multi-modal coverage. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Macgence alternative",
      "Macgence alternatives",
      "Macgence vs Claru",
      "AI training data services",
      "data annotation",
      "RLHF",
      "sensor data collection",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Macgence Alternatives",
    title: "Macgence Alternatives: Data Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://macgence.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Macgence
        </a>{" "}
        provides AI training data services including data collection,
        annotation, validation, and RLHF. If you need physical-world capture and
        enrichment for robotics, Claru is built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Macgence lists AI training data services including custom data sourcing, annotation, validation, RLHF, and data licensing.",
      "The company reports 5M+ files annotated, 500+ projects delivered, 200+ languages of expertise, and 50K+ hours of speech datasets.",
      "Macgence highlights data collection and sourcing methods from crowdsourcing to enterprise integrations.",
      "Data annotation services claim ~95% accuracy and support text, image, audio, and video data types.",
      "Macgence lists global data sourcing, real-time data collection, and scalable pipelines for diverse AI applications.",
      "The site highlights sensor data and vehicle data collection plus sensor data annotation for LiDAR, RADAR, and IoT signals.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Macgence for multi-modal data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Macgence Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Macgence provides multi-modal data services and annotation at scale. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Macgence lists AI training data services including custom data sourcing,
        data annotation & enhancement, validation, RLHF, and data licensing.
        {sourceLink("https://macgence.com/", "[1]")}
      </>,
      <>
        The company reports 5M+ files annotated, 500+ projects delivered, 200+
        languages of expertise, and 50K+ hours of speech datasets.
        {sourceLink("https://macgence.com/", "[2]")}
      </>,
      <>
        Macgence highlights data collection and sourcing methods ranging from
        crowdsourcing to enterprise integrations.
        {sourceLink("https://macgence.com/", "[3]")}
      </>,
      <>
        Data annotation services claim ~95% accuracy and support for text,
        images, audio, and video with quick turnaround and scalable solutions.
        {sourceLink("https://macgence.com/", "[4]")}
      </>,
      <>
        The site lists global data sourcing and real-time data collection with
        scalable, adaptable workflows for AI applications.
        {sourceLink("https://macgence.com/", "[5]")}
      </>,
      <>
        Macgence highlights sensor data collection, vehicle data collection, and
        sensor data annotation for LiDAR, RADAR, and IoT signals.
        {sourceLink("https://macgence.com/", "[6]")}
      </>,
      "If your bottleneck is large-scale data services and annotation across modalities, Macgence is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Macgence at a Glance",
        items: [
          {
            label: "Services",
            value: (
              <>
                Custom data sourcing, annotation, validation, RLHF, licensing.
                {sourceLink("https://macgence.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Scale",
            value: (
              <>
                5M+ files annotated and 500+ projects delivered.
                {sourceLink("https://macgence.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Languages",
            value: (
              <>
                200+ languages of expertise and 50K+ hours of speech datasets.
                {sourceLink("https://macgence.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Collection",
            value: (
              <>
                Data collection from crowdsourcing to enterprise integrations.
                {sourceLink("https://macgence.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                ~95% accuracy with support for text, image, audio, and video.
                {sourceLink("https://macgence.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing multi-modal data services at scale",
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
        Macgence lists AI training data services including custom data sourcing,
        annotation, validation, RLHF, and data licensing.
        {sourceLink("https://macgence.com/", "[1]")}
      </>,
      <>
        The company reports 5M+ files annotated, 500+ projects delivered, 200+
        languages of expertise, and 50K+ hours of speech datasets.
        {sourceLink("https://macgence.com/", "[2]")}
      </>,
      <>
        Data collection and sourcing includes crowdsourcing and enterprise
        integrations.
        {sourceLink("https://macgence.com/", "[3]")}
      </>,
      <>
        Data annotation services claim ~95% accuracy and support text, image,
        audio, and video.
        {sourceLink("https://macgence.com/", "[4]")}
      </>,
      <>
        Macgence lists global data sourcing and real-time collection workflows.
        {sourceLink("https://macgence.com/", "[5]")}
      </>,
      <>
        The site highlights sensor data and vehicle data collection plus LiDAR,
        RADAR, and IoT sensor annotation.
        {sourceLink("https://macgence.com/", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Macgence Is Strong",
    intro:
      "Macgence emphasizes multi-modal data services, scalable collection, and annotation at global scale.",
    cards: [
      {
        title: "Multi-modal annotation",
        description: (
          <>
            Macgence claims ~95% annotation accuracy with support for text,
            image, audio, and video data.
            {sourceLink("https://macgence.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Global scale",
        description: (
          <>
            The company reports 5M+ files annotated and 500+ projects delivered.
            {sourceLink("https://macgence.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Collection breadth",
        description: (
          <>
            Data collection includes crowdsourcing and enterprise integrations
            plus real-time data sourcing.
            {sourceLink("https://macgence.com/", "[3]")}
            {sourceLink("https://macgence.com/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Macgence provides data services and annotation. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on existing datasets.",
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
    title: "Macgence vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on multi-modal data services versus capture-first physical AI datasets.",
    columns: [
      { key: "macgence", label: "Macgence" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          macgence: (
            <>
              AI training data services across collection, annotation, and
              validation.
              {sourceLink("https://macgence.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Scale",
        values: {
          macgence: (
            <>
              5M+ files annotated and 500+ projects delivered.
              {sourceLink("https://macgence.com/", "[2]")}
            </>
          ),
          claru: "Specialized capture network focused on physical tasks",
        },
      },
      {
        dimension: "Annotation",
        values: {
          macgence: (
            <>
              ~95% accuracy with text, image, audio, and video support.
              {sourceLink("https://macgence.com/", "[4]")}
            </>
          ),
          claru: "Enrichment layers such as depth, pose, segmentation, motion",
        },
      },
      {
        dimension: "Collection",
        values: {
          macgence: (
            <>
              Crowdsourcing and enterprise integrations for data sourcing.
              {sourceLink("https://macgence.com/", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          macgence: "Teams needing multi-modal data services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Macgence vs Claru",
    intro:
      "Macgence provides data services at scale. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Macgence focuses on data collection, annotation, validation, and RLHF services.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "Macgence highlights crowdsourcing and enterprise integrations for data collection.",
          "Claru captures new physical-world data tailored to robotics tasks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Macgence is a strong fit for multi-modal data services at scale.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Macgence Is a Fit",
    competitorBullets: [
      "You need large-scale data collection and annotation across modalities.",
      "You want global data sourcing with quick turnaround.",
      "You need RLHF and sensor data annotation support.",
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
        title: "Welo Data Alternatives",
        desc: "Enterprise annotation programs vs physical AI pipelines.",
        href: "/compare/welodata-alternatives",
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
      "Choose Macgence when you need multi-modal data services and global annotation scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Macgence for data services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Macgence?",
        answer: (
          <>
            Macgence provides AI training data services including data
            collection, annotation, validation, and RLHF.
            {sourceLink("https://macgence.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What scale does Macgence report?",
        answer: (
          <>
            Macgence reports 5M+ files annotated and 500+ projects delivered.
            {sourceLink("https://macgence.com/", "[2]")}
          </>
        ),
      },
      {
        question: "What data types does Macgence support?",
        answer: (
          <>
            Macgence claims support for text, image, audio, and video data and
            provides sensor data collection and annotation.
            {sourceLink("https://macgence.com/", "[4]")}
            {sourceLink("https://macgence.com/", "[6]")}
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
  sources: [{ label: "Macgence", url: "https://macgence.com/" }],
};
