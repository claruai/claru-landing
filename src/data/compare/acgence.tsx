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

export const acgenceComparison: ComparisonData = {
  slug: "acgence-alternatives",
  competitor: {
    name: "Acgence",
    siteUrl: "https://acgence.com",
    category: "AI training data services and annotation",
  },
  meta: {
    title: "Acgence Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Acgence and Claru for physical AI training data. Acgence provides data collection, transcription, labeling, de-identification, and dataset services across text, speech, image, and video. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Acgence alternative",
      "Acgence alternatives",
      "Acgence vs Claru",
      "data collection services",
      "data labeling",
      "data transcription",
      "data de-identification",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Acgence Alternatives",
    title: "Acgence Alternatives: Data Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://acgence.com/about-us/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Acgence
        </a>{" "}
        provides AI training data services including collection, transcription,
        labeling, de-identification, and datasets across multiple data types. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Acgence lists data collection services across speech, text, image, and video.",
      "The company provides data transcription, labeling, and de-identification services.",
      "Acgence highlights AI data catalogs and dataset licensing options.",
      "The site claims 5+ years of data services experience and a global workforce.",
      "Acgence notes AI training data types including text, speech, images, and videos.",
      "Acgence highlights 3000+ languages and 170+ countries on its About page.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Acgence for managed data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Acgence Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Acgence provides multi-modal data services and annotation. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Acgence lists data collection services across speech, text, image, and
        video datasets.
        {sourceLink("https://acgence.com/", "[1]")}
      </>,
      <>
        The company provides data transcription, data labeling, and
        de-identification services for AI workflows.
        {sourceLink("https://acgence.com/", "[2]")}
      </>,
      <>
        Acgence highlights AI data catalogs and dataset licensing.
        {sourceLink("https://acgence.com/", "[3]")}
      </>,
      <>
        The site claims 5+ years of expertise and a global workforce supporting
        AI training data.
        {sourceLink("https://acgence.com/", "[4]")}
      </>,
      <>
        Acgence notes AI training data types including text, speech, images, and
        videos.
        {sourceLink("https://acgence.com/", "[5]")}
      </>,
      <>
        The About page lists 3000+ languages and 170+ countries of coverage.
        {sourceLink("https://acgence.com/about-us/", "[6]")}
      </>,
      "If your bottleneck is managed data services across modalities, Acgence is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Acgence at a Glance",
        items: [
          {
            label: "Services",
            value: (
              <>
                Data collection, transcription, labeling, de-identification,
                and datasets.
                {sourceLink("https://acgence.com/", "[1]")}
                {sourceLink("https://acgence.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Coverage",
            value: (
              <>
                3000+ languages and 170+ countries.
                {sourceLink("https://acgence.com/about-us/", "[6]")}
              </>
            ),
          },
          {
            label: "Data types",
            value: (
              <>
                Text, speech, images, and videos.
                {sourceLink("https://acgence.com/", "[5]")}
              </>
            ),
          },
          {
            label: "Experience",
            value: (
              <>
                5+ years of data services experience with global workforce.
                {sourceLink("https://acgence.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Catalogs",
            value: (
              <>
                AI data catalogs and dataset licensing.
                {sourceLink("https://acgence.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed multi-modal data services",
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
        Acgence lists data collection services across speech, text, image, and
        video datasets.
        {sourceLink("https://acgence.com/", "[1]")}
      </>,
      <>
        The company provides data transcription, labeling, and de-identification
        services for AI workflows.
        {sourceLink("https://acgence.com/", "[2]")}
      </>,
      <>
        Acgence highlights AI data catalogs and dataset licensing.
        {sourceLink("https://acgence.com/", "[3]")}
      </>,
      <>
        Acgence claims 5+ years of experience with a global workforce.
        {sourceLink("https://acgence.com/", "[4]")}
      </>,
      <>
        The About page lists 3000+ languages and 170+ countries.
        {sourceLink("https://acgence.com/about-us/", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Acgence Is Strong",
    intro:
      "Acgence emphasizes multi-modal data services, language coverage, and end-to-end data operations.",
    cards: [
      {
        title: "Multi-modal data services",
        description: (
          <>
            Data collection, transcription, labeling, and de-identification are
            listed across text, speech, image, and video.
            {sourceLink("https://acgence.com/", "[1]")}
            {sourceLink("https://acgence.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Language coverage",
        description: (
          <>
            The About page lists 3000+ languages and 170+ countries of coverage.
            {sourceLink("https://acgence.com/about-us/", "[6]")}
          </>
        ),
      },
      {
        title: "Dataset catalog",
        description: (
          <>
            Acgence highlights AI data catalogs and dataset licensing.
            {sourceLink("https://acgence.com/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Acgence provides managed data services. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Acgence vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on managed data services versus capture-first physical AI datasets.",
    columns: [
      { key: "acgence", label: "Acgence" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          acgence: (
            <>
              Data collection, transcription, labeling, and datasets.
              {sourceLink("https://acgence.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Coverage",
        values: {
          acgence: (
            <>
              3000+ languages and 170+ countries.
              {sourceLink("https://acgence.com/about-us/", "[6]")}
            </>
          ),
          claru: "Task-specific capture in targeted environments",
        },
      },
      {
        dimension: "Modalities",
        values: {
          acgence: (
            <>
              Text, speech, image, and video data types.
              {sourceLink("https://acgence.com/", "[5]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Data services",
        values: {
          acgence: (
            <>
              Transcription, labeling, and de-identification services.
              {sourceLink("https://acgence.com/", "[2]")}
            </>
          ),
          claru: "Capture protocols and enrichment QC built for robotics",
        },
      },
      {
        dimension: "Best fit",
        values: {
          acgence: "Teams needing managed multi-modal data services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Acgence vs Claru",
    intro:
      "Acgence provides managed data services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Acgence delivers data collection, transcription, labeling, and dataset services.",
          "Claru delivers capture, enrichment, and training-ready physical datasets.",
        ],
      },
      {
        title: "Language coverage",
        paragraphs: [
          "Acgence emphasizes broad language coverage and global data sourcing.",
          "Claru focuses on task-specific physical capture rather than broad linguistic coverage.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Acgence is strong for multi-modal data services at scale.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Acgence Is a Fit",
    competitorBullets: [
      "You need managed data collection, transcription, and labeling services.",
      "You want broad language coverage across global markets.",
      "You need dataset licensing and catalog access.",
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
        title: "Macgence Alternatives",
        desc: "Multi-modal data services vs physical AI capture.",
        href: "/compare/macgence-alternatives",
      },
      {
        title: "TELUS Digital Alternatives",
        desc: "Enterprise AI data services vs physical AI pipelines.",
        href: "/compare/telus-digital-alternatives",
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
      "Choose Acgence when you need managed data services across text, speech, image, and video.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Acgence for data services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What services does Acgence provide?",
        answer: (
          <>
            Acgence lists data collection, transcription, labeling,
            de-identification, and dataset services.
            {sourceLink("https://acgence.com/", "[1]")}
            {sourceLink("https://acgence.com/", "[2]")}
          </>
        ),
      },
      {
        question: "How broad is Acgence&apos;s language coverage?",
        answer: (
          <>
            The About page lists 3000+ languages and 170+ countries.
            {sourceLink("https://acgence.com/about-us/", "[6]")}
          </>
        ),
      },
      {
        question: "What data types does Acgence support?",
        answer: (
          <>
            Acgence highlights text, speech, image, and video data types.
            {sourceLink("https://acgence.com/", "[5]")}
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
    { label: "Acgence", url: "https://acgence.com/" },
    { label: "Acgence About", url: "https://acgence.com/about-us/" },
  ],
};
