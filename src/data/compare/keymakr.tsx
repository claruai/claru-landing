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
    paragraphs: [
      "Keymakr is a data annotation company headquartered in Baku, Azerbaijan, with operations serving computer vision and AI teams worldwide. The company combines its proprietary Keylabs annotation platform with in-house annotation teams to deliver managed labeling services across image, video, and 3D point cloud data. Keymakr has positioned itself as a vertically integrated annotation provider, controlling both the tooling and the workforce to maintain quality standards throughout the labeling process.",
      "For physical AI teams, Keymakr offers relevant capabilities in video annotation and 3D point cloud labeling, including support for keypoint annotation and skeletal labeling that are useful for pose-related tasks. However, Keymakr operates primarily as a labeling services provider rather than a capture-first data pipeline. The company does not deploy wearable camera networks for egocentric video collection, does not generate enrichment layers such as depth estimation or optical flow, and does not deliver datasets in robotics-native training formats like RLDS or LeRobot. Teams building robotics foundation models need both capture and enrichment upstream of annotation, which is the gap that Claru fills.",
    ],
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
        title: "Robotics AI implications",
        paragraphs: [
          "Robotics foundation models require training data that goes beyond labeled bounding boxes or keypoints. Models like RT-2, Octo, and pi0 need egocentric video paired with dense spatial signals including per-frame depth maps, full-body pose estimation, semantic segmentation, and optical flow. Keymakr's annotation services can produce high-quality labels on existing footage, but the upstream challenge of capturing task-specific video and generating these enrichment layers is outside their service scope.",
          "Claru operates the full pipeline from field capture through enrichment to delivery. Operators wearing cameras record real-world manipulation, navigation, and activity tasks, and the enrichment pipeline then produces depth, pose, segmentation, and motion outputs automatically. Datasets ship in formats like RLDS, LeRobot, or HDF5 that plug directly into robotics training frameworks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Keymakr is strong when you need managed labeling and QA for existing image, video, or point cloud data. The four-level QA process and custom sanity scripts help maintain annotation accuracy at scale.",
          "Claru is stronger when physical-world capture is the bottleneck. If your team needs new task-specific recordings from real environments with aligned spatial enrichment signals, a capture-first provider addresses that need directly.",
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
            Keymakr is a data annotation company headquartered in Baku, Azerbaijan, that combines its proprietary Keylabs platform with in-house annotation teams to deliver managed labeling services. The company serves computer vision and AI teams globally, offering image, video, and 3D point cloud annotation with multi-level quality assurance processes. Keymakr positions itself as a vertically integrated provider that controls both the annotation tooling and the workforce.
            {sourceLink("https://keymakr.com/our-services.html", "[1]")}
          </>
        ),
      },
      {
        question: "What data types does Keymakr support?",
        answer: (
          <>
            Keymakr lists image annotation, video annotation with object tracking and keypoint labeling, and 3D point cloud annotation for LiDAR, RADAR, and photogrammetry data. The Keylabs platform supports annotation types ranging from bounding boxes and polygons to skeletal labels and 3D cuboids. This coverage makes Keymakr relevant for autonomous driving, drone perception, and other computer vision applications that rely on labeled spatial data.
            {sourceLink("https://keymakr.com/our-services.html", "[2]")}
          </>
        ),
      },
      {
        question: "Does Keymakr support automatic annotation?",
        answer: (
          <>
            Yes. Keymakr describes ML-powered auto-annotation with four levels of human-led quality assurance and custom sanity scripts. This hybrid approach aims to combine the speed of automated pre-labeling with the accuracy of human review, reducing cost per label while maintaining precision. The QA pipeline includes automated checks followed by progressive human review stages to catch and correct errors before delivery.
            {sourceLink("https://keymakr.com/our-services.html", "[4]")}
          </>
        ),
      },
      {
        question: "Can Keymakr handle robotics training data?",
        answer:
          "Keymakr can annotate existing robotics-related footage with bounding boxes, keypoints, skeletal labels, and 3D point cloud annotations. However, the company does not capture new physical-world video, deploy wearable camera operators, or generate enrichment layers like depth estimation, optical flow, or semantic segmentation. Teams building robotics foundation models typically need upstream capture and enrichment in addition to downstream annotation services.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your training pipeline requires new egocentric video from real-world environments paired with depth maps, human pose estimation, segmentation masks, and motion vectors, Claru addresses those upstream needs. Keymakr is better suited for teams that already have data and need high-quality annotation with multi-level QA.",
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
