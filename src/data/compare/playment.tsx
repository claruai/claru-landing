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

export const playmentComparison: ComparisonData = {
  slug: "playment-alternatives",
  competitor: {
    name: "Playment",
    siteUrl: "https://playment.readme.io",
    category: "Annotation platform and API-first workflow",
  },
  meta: {
    title: "Playment Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Playment and Claru for physical AI training data. Playment provides annotation APIs for image, video, and LiDAR tasks, with workflow automation and trained annotators. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Playment alternative",
      "Playment alternatives",
      "Playment vs Claru",
      "annotation platform",
      "labeling API",
      "image annotation",
      "video annotation",
      "LiDAR annotation",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Playment Alternatives",
    title: "Playment Alternatives: Annotation APIs vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://playment.readme.io/reference/welcome"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Playment
        </a>{" "}
        provides annotation APIs and tools for image, video, and LiDAR tasks. If
        you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one.
      </>
    ),
    lastUpdated: "April 2, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Playment provides APIs to set up annotation tasks and manage workflow automation.",
      "The API supports image annotation types including bounding boxes, polygons, landmarks, 2D cuboids, and segmentation.",
      "Video and sequential image tasks support bounding boxes, polygons, 2D cuboids, landmarks, and line tracking.",
      "LiDAR and sensor fusion tasks include 3D cuboids, 3D-2D linking, and point-wise segmentation.",
      "Playment notes trained annotators can complete tasks when you provide raw or pre-annotated data.",
      "Claru is purpose-built for physical AI capture and enrichment.",
      "Choose Playment for API-driven labeling workflows; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Playment Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Playment is an API-first annotation platform. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Playment&apos;s API documentation describes endpoints for setting up tasks,
        creating jobs, uploading data, and fetching results.
        {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
      </>,
      <>
        Image annotation tasks listed include bounding boxes, polygons,
        landmarks, 2D cuboids, and segmentation.
        {sourceLink("https://playment.readme.io/reference/welcome", "[2]")}
      </>,
      <>
        Video or sequential image tasks list bounding boxes, polygons, 2D
        cuboids, landmarks, and line tracking.
        {sourceLink("https://playment.readme.io/reference/welcome", "[3]")}
      </>,
      <>
        LiDAR and sensor fusion workflows include 3D cuboids, 3D-2D linking, and
        point-wise segmentation.
        {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
      </>,
      <>
        The docs note that trained annotators complete tasks once you provide
        raw or pre-annotated data.
        {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
      </>,
      "If your bottleneck is annotation workflow automation, Playment is a strong fit. If your bottleneck is physical-world capture and enrichment for robotics, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Playment at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                API-first annotation platform and workflow automation.
                {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
              </>
            ),
          },
          {
            label: "Image tasks",
            value: (
              <>
                Bounding boxes, polygons, landmarks, 2D cuboids, segmentation.
                {sourceLink("https://playment.readme.io/reference/welcome", "[2]")}
              </>
            ),
          },
          {
            label: "Video tasks",
            value: (
              <>
                Bounding boxes, polygons, cuboids, landmarks, line tracking.
                {sourceLink("https://playment.readme.io/reference/welcome", "[3]")}
              </>
            ),
          },
          {
            label: "LiDAR tasks",
            value: (
              <>
                3D cuboids, 3D-2D linking, point-wise segmentation.
                {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
              </>
            ),
          },
          {
            label: "Workforce",
            value: (
              <>
                Trained annotators complete tasks once data is uploaded.
                {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing API-driven labeling workflows",
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
        Playment provides APIs to set up annotation tasks and workflow
        automation.
        {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
      </>,
      <>
        Image annotation tasks include bounding boxes, polygons, landmarks, 2D
        cuboids, and segmentation.
        {sourceLink("https://playment.readme.io/reference/welcome", "[2]")}
      </>,
      <>
        Video tasks include bounding boxes, polygons, cuboids, landmarks, and
        line tracking.
        {sourceLink("https://playment.readme.io/reference/welcome", "[3]")}
      </>,
      <>
        LiDAR and sensor fusion workflows include 3D cuboids, 3D-2D linking, and
        point-wise segmentation.
        {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
      </>,
      <>
        Playment notes trained annotators can complete tasks once data is
        provided.
        {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Playment Is Strong",
    intro:
      "Playment emphasizes API-first workflow automation and support for image, video, and LiDAR annotation tasks.",
    cards: [
      {
        title: "API-driven workflows",
        description: (
          <>
            Playment provides APIs for setting up tasks, creating jobs, and
            fetching results.
            {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal annotation",
        description: (
          <>
            The API lists image, video/sequential, and LiDAR/sensor fusion
            annotation types.
            {sourceLink("https://playment.readme.io/reference/welcome", "[2]")}
            {sourceLink("https://playment.readme.io/reference/welcome", "[3]")}
            {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
          </>
        ),
      },
      {
        title: "Trained annotator support",
        description: (
          <>
            Documentation notes trained annotators can complete tasks once data
            is provided.
            {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Playment is a labeling platform. Claru is a capture-and-enrichment pipeline for physical AI.",
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
    title: "Playment vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on annotation APIs versus a capture-first physical AI pipeline.",
    columns: [
      { key: "playment", label: "Playment" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          playment: (
            <>
              API-first annotation platform and workflow automation.
              {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          playment: (
            <>
              Image, video/sequential, and LiDAR/sensor fusion annotation tasks.
              {sourceLink("https://playment.readme.io/reference/welcome", "[2]")}
              {sourceLink("https://playment.readme.io/reference/welcome", "[3]")}
              {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
            </>
          ),
          claru: "Egocentric video, manipulation, depth, pose, segmentation",
        },
      },
      {
        dimension: "Workforce",
        values: {
          playment: (
            <>
              Trained annotators complete tasks after data upload.
              {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
            </>
          ),
          claru: "Curated collectors and robotics task operators",
        },
      },
      {
        dimension: "Data capture",
        values: {
          playment: "Bring-your-own data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          playment: "Teams needing API-driven labeling workflows",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Playment vs Claru",
    intro:
      "Playment focuses on API-driven annotation workflows. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Platform vs pipeline",
        paragraphs: [
          "Playment delivers APIs and tools for annotation workflows across image, video, and LiDAR tasks.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Automation focus",
        paragraphs: [
          "Playment emphasizes API-driven workflow automation for labeling.",
          "Claru emphasizes physical capture and enrichment outputs.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Playment is a strong fit for labeling workflow automation.",
          "Claru is better when capture and enrichment are the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Playment Is a Fit",
    competitorBullets: [
      "You need API-driven annotation task management.",
      "You already have data and need labeling workflows.",
      "You want multi-modal annotation with image, video, and LiDAR tasks.",
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
        title: "SuperAnnotate Alternatives",
        desc: "Annotation platform vs physical AI capture.",
        href: "/compare/superannotate-alternatives",
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
      "Choose Playment when you need API-driven annotation workflows across image, video, and LiDAR tasks.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Playment for labeling workflows, Claru for capture-first datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Playment?",
        answer: (
          <>
            Playment provides APIs for setting up annotation tasks and managing
            labeling workflows.
            {sourceLink("https://playment.readme.io/reference/welcome", "[1]")}
          </>
        ),
      },
      {
        question: "Does Playment support LiDAR annotation?",
        answer: (
          <>
            Yes. The API lists LiDAR and sensor fusion tasks such as 3D cuboids,
            3D-2D linking, and point-wise segmentation.
            {sourceLink("https://playment.readme.io/reference/welcome", "[4]")}
          </>
        ),
      },
      {
        question: "Does Playment provide trained annotators?",
        answer: (
          <>
            The docs note trained annotators can complete tasks once you provide
            raw or pre-annotated data.
            {sourceLink("https://playment.readme.io/reference/welcome", "[5]")}
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
    { label: "Playment API Docs", url: "https://playment.readme.io/reference/welcome" },
  ],
};
