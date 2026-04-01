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

export const keymakrComparison: ComparisonData = {
  slug: "keymakr-alternatives",
  competitor: {
    name: "Keymakr",
    siteUrl: "https://keymakr.com",
    category: "Data annotation services and Keylabs labeling platform",
  },
  meta: {
    title: "Keymakr Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Keymakr and Claru for physical AI training data. Keymakr provides image, video, and LiDAR annotation with Keylabs tooling, data collection, and validation workflows. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Keymakr alternative",
      "Keymakr alternatives",
      "Keymakr vs Claru",
      "data annotation services",
      "Keylabs platform",
      "LiDAR annotation",
      "computer vision labeling",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Keymakr Alternatives",
    title: "Keymakr Alternatives: Annotation Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://keymakr.com/our-services.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Keymakr
        </a>{" "}
        provides managed data annotation services across image, video, and LiDAR
        with its Keylabs platform and QA workflows. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Keymakr offers image, video, and LiDAR annotation services through its Keylabs platform and in-house teams.",
      "The services list image annotation, video object tracking, and point cloud (3D) annotation.",
      "Keymakr highlights data collection, data creation, and data validation services alongside annotation.",
      "Automatic annotation uses ML models with 4 levels of human-led QA and custom sanity scripts.",
      "The Keylabs platform supports annotation from bounding boxes to keypoints, skeletal labeling, and 3D point clouds.",
      "Keymakr promotes a data collection tool to gather image and video data for AI training.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Keymakr for managed annotation and data services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Keymakr Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Keymakr provides managed annotation services and tooling. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Keymakr highlights Keylabs, a platform paired with in-house annotators
        for computer vision and physical AI projects.
        {sourceLink("https://keymakr.com/our-services.html", "[1]")}
      </>,
      <>
        Services include image annotation, video annotation (object tracking,
        boxes, points, polygons), and 3D point cloud annotation.
        {sourceLink("https://keymakr.com/our-services.html", "[2]")}
      </>,
      <>
        Keymakr lists data collection, data creation, and data validation to
        support dataset building.
        {sourceLink("https://keymakr.com/our-services.html", "[3]")}
      </>,
      <>
        Automatic annotation is described as ML-driven with 4 levels of
        human-led QA and custom sanity scripts.
        {sourceLink("https://keymakr.com/our-services.html", "[4]")}
      </>,
      <>
        The Keylabs platform supports annotation types ranging from bounding
        boxes to keypoints, skeletal labeling, and 3D point clouds.
        {sourceLink("https://keymakr.com/our-services.html", "[5]")}
      </>,
      <>
        Keymakr also describes a data collection tool for image and video data
        gathering.
        {sourceLink("https://keymakr.com/data-collection.html", "[6]")}
      </>,
      "If your bottleneck is annotation services and QA at scale, Keymakr is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Keymakr at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed annotation services with Keylabs tooling.
                {sourceLink("https://keymakr.com/our-services.html", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, and 3D point cloud annotation.
                {sourceLink("https://keymakr.com/our-services.html", "[2]")}
              </>
            ),
          },
          {
            label: "Automation",
            value: (
              <>
                ML auto-annotation with 4 levels of human QA.
                {sourceLink("https://keymakr.com/our-services.html", "[4]")}
              </>
            ),
          },
          {
            label: "Platform",
            value: (
              <>
                Keylabs supports boxes, keypoints, skeletal labels, and 3D
                point clouds.
                {sourceLink("https://keymakr.com/our-services.html", "[5]")}
              </>
            ),
          },
          {
            label: "Data services",
            value: (
              <>
                Data collection, creation, and validation services.
                {sourceLink("https://keymakr.com/our-services.html", "[3]")}
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
        Keymakr provides image, video, and 3D point cloud annotation services
        through Keylabs.
        {sourceLink("https://keymakr.com/our-services.html", "[2]")}
      </>,
      <>
        Data services include collection, creation, and validation workflows.
        {sourceLink("https://keymakr.com/our-services.html", "[3]")}
      </>,
      <>
        Automatic annotation uses ML models with 4 levels of human-led QA and
        custom sanity scripts.
        {sourceLink("https://keymakr.com/our-services.html", "[4]")}
      </>,
      <>
        Keylabs supports annotation types from bounding boxes to keypoints,
        skeletal labels, and 3D point clouds.
        {sourceLink("https://keymakr.com/our-services.html", "[5]")}
      </>,
      <>
        Keymakr highlights a data collection tool for image and video data.
        {sourceLink("https://keymakr.com/data-collection.html", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Keymakr Is Strong",
    intro:
      "Keymakr emphasizes managed annotation services, multi-modal coverage, and automation with QA controls.",
    cards: [
      {
        title: "Multi-modal annotation",
        description: (
          <>
            Keymakr supports image, video, and 3D point cloud annotation.
            {sourceLink("https://keymakr.com/our-services.html", "[2]")}
          </>
        ),
      },
      {
        title: "Automation plus QA",
        description: (
          <>
            ML auto-annotation includes 4 levels of human-led QA and sanity
            scripts.
            {sourceLink("https://keymakr.com/our-services.html", "[4]")}
          </>
        ),
      },
      {
        title: "Data services coverage",
        description: (
          <>
            Data collection, creation, and validation complement labeling.
            {sourceLink("https://keymakr.com/our-services.html", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Keymakr provides labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Keymakr vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Keymakr&apos;s managed services model.",
    columns: [
      { key: "keymakr", label: "Keymakr" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          keymakr: (
            <>
              Managed annotation services with Keylabs tooling.
              {sourceLink("https://keymakr.com/our-services.html", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          keymakr: (
            <>
              Image, video, and 3D point cloud annotation.
              {sourceLink("https://keymakr.com/our-services.html", "[2]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Automation",
        values: {
          keymakr: (
            <>
              ML auto-annotation with 4 levels of human QA.
              {sourceLink("https://keymakr.com/our-services.html", "[4]")}
            </>
          ),
          claru: "Capture protocols and enrichment QC built for robotics",
        },
      },
      {
        dimension: "Data services",
        values: {
          keymakr: (
            <>
              Data collection, creation, and validation support.
              {sourceLink("https://keymakr.com/our-services.html", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          keymakr: "Teams needing managed annotation services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Keymakr vs Claru",
    intro:
      "Keymakr specializes in managed annotation services. Claru specializes in physical-world capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Keymakr delivers managed annotation and QA services with Keylabs tooling.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Automation focus",
        paragraphs: [
          "Keymakr emphasizes auto-annotation with multi-level QA.",
          "Claru emphasizes real-world capture and enrichment outputs.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Keymakr is strong when you need managed labeling and QA.",
          "Claru is stronger when physical-world capture is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Keymakr Is a Fit",
    competitorBullets: [
      "You need image, video, or 3D point cloud annotation services.",
      "You already have data and need labeling throughput with QA controls.",
      "You want data collection and validation services alongside labeling.",
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
        title: "Centaur Labs Alternatives",
        desc: "Expert labeling vs physical AI capture.",
        href: "/compare/centaur-labs-alternatives",
      },
      {
        title: "SuperAnnotate Alternatives",
        desc: "Annotation platform vs physical AI data pipelines.",
        href: "/compare/superannotate-alternatives",
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
      "Choose Keymakr when you need managed image, video, or LiDAR annotation services.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Keymakr for labeling services, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Keymakr?",
        answer: (
          <>
            Keymakr provides managed annotation services via the Keylabs
            platform.
            {sourceLink("https://keymakr.com/our-services.html", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Keymakr support?",
        answer: (
          <>
            Keymakr lists image, video, and 3D point cloud annotation services.
            {sourceLink("https://keymakr.com/our-services.html", "[2]")}
          </>
        ),
      },
      {
        question: "Does Keymakr support automatic annotation?",
        answer: (
          <>
            Yes. Keymakr describes ML auto-annotation with multiple levels of
            human QA.
            {sourceLink("https://keymakr.com/our-services.html", "[4]")}
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
    { label: "Keymakr Services", url: "https://keymakr.com/our-services.html" },
    { label: "Keymakr Data Collection", url: "https://keymakr.com/data-collection.html" },
  ],
};
