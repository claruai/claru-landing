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

export const nexdataComparison: ComparisonData = {
  slug: "nexdata-alternatives",
  competitor: {
    name: "Nexdata",
    siteUrl: "https://www.nexdata.ai",
    category: "Training data solutions and services",
  },
  meta: {
    title: "Nexdata Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Nexdata and Claru for physical AI training data. Nexdata highlights off-the-shelf datasets across image, video, audio, text, and LiDAR, plus data collection and annotation services. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Nexdata alternative",
      "Nexdata alternatives",
      "Nexdata vs Claru",
      "training data solutions",
      "off-the-shelf datasets",
      "data collection services",
      "data annotation services",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Nexdata Alternatives",
    title: "Nexdata Alternatives: Data Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://www.nexdata.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Nexdata
        </a>{" "}
        highlights off-the-shelf datasets and data services across modalities,
        including data collection and annotation. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Nexdata highlights off-the-shelf datasets across image, video, audio, text, and LiDAR.",
      "It lists data collection services and data annotation services.",
      "Dataset categories include image, video, audio, text, and LiDAR.",
      "The platform positions itself around training data solutions and services.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Nexdata for broad data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Nexdata Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Nexdata provides off-the-shelf datasets and managed data services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Nexdata highlights off-the-shelf datasets across image, video, audio,
        text, and LiDAR categories.
        {sourceLink("https://www.nexdata.ai/", "[1]")}
      </>,
      <>
        The site lists data collection services for custom data acquisition.
        {sourceLink("https://www.nexdata.ai/", "[2]")}
      </>,
      <>
        Nexdata also lists data annotation services.
        {sourceLink("https://www.nexdata.ai/", "[3]")}
      </>,
      <>
        The platform positions itself around training data solutions and
        services. {sourceLink("https://www.nexdata.ai/", "[4]")}
      </>,
      "If your bottleneck is sourcing datasets or managed data services, Nexdata is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Nexdata at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Off-the-shelf datasets and training data services.
                {sourceLink("https://www.nexdata.ai/", "[4]")}
              </>
            ),
          },
          {
            label: "Datasets",
            value: (
              <>
                Image, video, audio, text, and LiDAR categories.
                {sourceLink("https://www.nexdata.ai/", "[1]")}
              </>
            ),
          },
          {
            label: "Collection",
            value: (
              <>
                Data collection services for custom data.
                {sourceLink("https://www.nexdata.ai/", "[2]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                Data annotation services.
                {sourceLink("https://www.nexdata.ai/", "[3]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing datasets and managed data services",
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
        Nexdata lists off-the-shelf datasets across image, video, audio, text,
        and LiDAR categories.
        {sourceLink("https://www.nexdata.ai/", "[1]")}
      </>,
      <>
        The site highlights data collection services.
        {sourceLink("https://www.nexdata.ai/", "[2]")}
      </>,
      <>
        Nexdata lists data annotation services.
        {sourceLink("https://www.nexdata.ai/", "[3]")}
      </>,
      <>
        Nexdata positions itself around training data solutions and services.
        {sourceLink("https://www.nexdata.ai/", "[4]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Nexdata Is Strong",
    intro:
      "Based on Nexdata's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Off-the-shelf datasets",
        description: (
          <>
            Nexdata lists datasets across image, video, audio, text, and LiDAR.
            {sourceLink("https://www.nexdata.ai/", "[1]")}
          </>
        ),
      },
      {
        title: "Data collection services",
        description: (
          <>
            The platform lists data collection services for custom data.
            {sourceLink("https://www.nexdata.ai/", "[2]")}
          </>
        ),
      },
      {
        title: "Annotation services",
        description: (
          <>
            Nexdata highlights data annotation services.
            {sourceLink("https://www.nexdata.ai/", "[3]")}
          </>
        ),
      },
      {
        title: "Training data solutions",
        description: (
          <>
            The site positions Nexdata around training data solutions and
            services. {sourceLink("https://www.nexdata.ai/", "[4]")}
          </>
        ),
      },
      {
        title: "Multi-modal coverage",
        description: (
          <>
            Dataset categories include image, video, audio, text, and LiDAR.
            {sourceLink("https://www.nexdata.ai/", "[1]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Nexdata provides datasets and managed services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on off-the-shelf datasets.",
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
    title: "Nexdata vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Nexdata's data services strengths.",
    columns: [
      { key: "nexdata", label: "Nexdata" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          nexdata: (
            <>
              Off-the-shelf datasets plus data services.
              {sourceLink("https://www.nexdata.ai/", "[4]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Datasets",
        values: {
          nexdata: (
            <>
              Image, video, audio, text, and LiDAR categories.
              {sourceLink("https://www.nexdata.ai/", "[1]")}
            </>
          ),
          claru: "Capture pipeline plus enrichment and delivery",
        },
      },
      {
        dimension: "Collection",
        values: {
          nexdata: (
            <>
              Data collection services for custom data.
              {sourceLink("https://www.nexdata.ai/", "[2]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Annotation",
        values: {
          nexdata: (
            <>
              Data annotation services.
              {sourceLink("https://www.nexdata.ai/", "[3]")}
            </>
          ),
          claru: "Expert annotation paired with enrichment outputs",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          nexdata: "Managed labeling and dataset delivery",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          nexdata: "Teams needing datasets and managed services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Nexdata vs Claru",
    intro:
      "Nexdata delivers datasets and services. Claru delivers capture-first, enrichment-heavy datasets.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Nexdata provides off-the-shelf datasets and managed data services.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Collection model",
        paragraphs: [
          "Nexdata offers data collection and annotation services.",
          "Claru focuses on physical-world capture with enrichment layers.",
        ],
      },
      {
        title: "Modalities",
        paragraphs: [
          "Nexdata lists datasets across image, video, audio, text, and LiDAR.",
          "Claru prioritizes egocentric video and robotics sensors.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Nexdata is strong when managed data services are the bottleneck.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Nexdata Is a Fit",
    competitorBullets: [
      "You need off-the-shelf datasets across modalities.",
      "You want managed data collection services.",
      "You want data annotation services bundled with delivery.",
      "You prefer a training data solutions provider.",
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
        title: "Appen Alternatives",
        desc: "Managed labeling services vs capture-first robotics datasets.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
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
      "Choose Nexdata when you need off-the-shelf datasets plus managed data collection and annotation.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Nexdata for broad data services, Claru for capture-first datasets.",
      "If your project requires task-specific physical data collection, prioritize providers built for capture and enrichment.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Nexdata?",
        answer: (
          <>
            Nexdata highlights off-the-shelf datasets and training data
            solutions. {sourceLink("https://www.nexdata.ai/", "[4]")}
          </>
        ),
      },
      {
        question: "What datasets does Nexdata list?",
        answer: (
          <>
            The site lists image, video, audio, text, and LiDAR dataset
            categories. {sourceLink("https://www.nexdata.ai/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Nexdata offer data collection services?",
        answer: (
          <>
            Nexdata lists data collection services.
            {sourceLink("https://www.nexdata.ai/", "[2]")}
          </>
        ),
      },
      {
        question: "Does Nexdata offer data annotation services?",
        answer: (
          <>
            Nexdata lists data annotation services.
            {sourceLink("https://www.nexdata.ai/", "[3]")}
          </>
        ),
      },
      {
        question: "Is Nexdata a fit for robotics data capture?",
        answer:
          "Nexdata focuses on datasets and managed services. Claru is better for capture-first robotics data collection and enrichment.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets.",
      },
      {
        question: "Can teams use both Nexdata and Claru?",
        answer:
          "Some teams use Nexdata for datasets and Claru for capture-first physical AI datasets.",
      },
      {
        question: "Does Nexdata cover LiDAR data?",
        answer: (
          <>
            The dataset categories listed by Nexdata include LiDAR.
            {sourceLink("https://www.nexdata.ai/", "[1]")}
          </>
        ),
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
    { label: "Nexdata", url: "https://www.nexdata.ai/" },
  ],
};
