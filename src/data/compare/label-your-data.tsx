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

export const labelYourDataComparison: ComparisonData = {
  slug: "label-your-data-alternatives",
  competitor: {
    name: "Label Your Data",
    siteUrl: "https://labelyourdata.com",
    category: "Data labeling and collection services",
  },
  meta: {
    title: "Label Your Data Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Label Your Data and Claru for physical AI training data. Label Your Data offers data labeling services across image, video, 3D point cloud, text, audio, and medical imaging, plus data collection options. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Label Your Data alternative",
      "Label Your Data alternatives",
      "Label Your Data vs Claru",
      "data labeling services",
      "3D point cloud annotation",
      "LiDAR annotation",
      "video annotation",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Label Your Data Alternatives",
    title: "Label Your Data Alternatives: Labeling Services vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://labelyourdata.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Label Your Data
        </a>{" "}
        provides data labeling services across image, video, 3D point cloud,
        text, audio, and medical imaging, plus data collection options. If you
        need physical-world capture and enrichment for robotics, Claru is built
        for physical AI from day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
    paragraphs: [
      "Label Your Data is a Ukraine-based data labeling company that provides managed annotation services across a wide range of modalities including image, video, 3D point cloud, text, audio, and medical imaging. The company has built a reputation for handling complex annotation projects for autonomous driving, healthcare AI, and computer vision applications. Label Your Data offers both annotation services and data collection capabilities, positioning itself as a full-service partner for teams that need labeled datasets but lack internal annotation capacity.",
      "For physical AI teams, Label Your Data's video annotation and 3D point cloud capabilities are relevant, particularly the support for LiDAR, RADAR, and photogrammetry data. However, the company operates as a labeling services provider rather than a capture-first data pipeline. Label Your Data does not deploy wearable camera networks for egocentric video collection, does not generate enrichment layers such as depth estimation or optical flow, and does not deliver datasets in robotics-native training formats. Teams building robotics foundation models, manipulation policies, or world models need upstream capture and multi-layer spatial enrichment that extends beyond the annotation services Label Your Data provides.",
    ],
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Label Your Data offers labeling services across image, video, 3D point cloud, text, and audio.",
      "It lists medical imaging annotation services and GIS data annotation.",
      "Data collection is listed as a service area.",
      "Video annotation services include bounding box, segmentation, and keypoint tasks.",
      "3D point cloud annotation includes LiDAR, RADAR, and photogrammetry workflows.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Label Your Data for managed labeling services; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Label Your Data Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Label Your Data provides managed labeling services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Label Your Data lists data labeling services across image, video, 3D
        point cloud, text, and audio categories.
        {sourceLink("https://labelyourdata.com/", "[1]")}
      </>,
      <>
        The services page highlights medical imaging annotation and GIS data
        annotation. {sourceLink("https://labelyourdata.com/", "[2]")}
      </>,
      <>
        Data collection is listed among service offerings.
        {sourceLink("https://labelyourdata.com/", "[3]")}
      </>,
      <>
        Video annotation services include bounding box, segmentation, and
        keypoint labeling. {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
      </>,
      <>
        3D annotation services mention LiDAR, RADAR, and photogrammetry data.
        {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
      </>,
      "If your bottleneck is managed labeling services, Label Your Data is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Label Your Data at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Managed data labeling services across multiple modalities.
                {sourceLink("https://labelyourdata.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Image, video, 3D point cloud, text, audio, medical imaging.
                {sourceLink("https://labelyourdata.com/", "[1]")}
                {sourceLink("https://labelyourdata.com/", "[2]")}
              </>
            ),
          },
          {
            label: "Collection",
            value: (
              <>
                Data collection services listed.
                {sourceLink("https://labelyourdata.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Video",
            value: (
              <>
                Video annotation includes bounding box, segmentation, keypoints.
                {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
              </>
            ),
          },
          {
            label: "3D",
            value: (
              <>
                3D point cloud annotation with LiDAR/RADAR/photogrammetry.
                {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
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
        Label Your Data lists labeling services across image, video, 3D point
        cloud, text, and audio. {sourceLink("https://labelyourdata.com/", "[1]")}
      </>,
      <>
        Services include medical imaging annotation and GIS data annotation.
        {sourceLink("https://labelyourdata.com/", "[2]")}
      </>,
      <>
        Data collection is listed as a service offering.
        {sourceLink("https://labelyourdata.com/", "[3]")}
      </>,
      <>
        Video annotation includes bounding box, segmentation, and keypoint
        tasks. {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
      </>,
      <>
        3D annotation mentions LiDAR, RADAR, and photogrammetry data.
        {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Label Your Data Is Strong",
    intro:
      "Based on Label Your Data's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Multi-modal labeling",
        description: (
          <>
            Services cover image, video, 3D point cloud, text, and audio.
            {sourceLink("https://labelyourdata.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Medical and GIS",
        description: (
          <>
            The services list includes medical imaging and GIS data annotation.
            {sourceLink("https://labelyourdata.com/", "[2]")}
          </>
        ),
      },
      {
        title: "Video annotation",
        description: (
          <>
            Video annotation includes bounding box, segmentation, and keypoint
            tasks. {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
          </>
        ),
      },
      {
        title: "3D point cloud",
        description: (
          <>
            3D annotation covers LiDAR, RADAR, and photogrammetry data.
            {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
          </>
        ),
      },
      {
        title: "Data collection",
        description: (
          <>
            Data collection is listed among service offerings.
            {sourceLink("https://labelyourdata.com/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Label Your Data provides managed labeling services. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of focusing only on labeling services.",
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
    title: "Label Your Data vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Label Your Data's labeling strengths.",
    columns: [
      { key: "lyd", label: "Label Your Data" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          lyd: (
            <>
              Managed data labeling services across modalities.
              {sourceLink("https://labelyourdata.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Modalities",
        values: {
          lyd: (
            <>
              Image, video, 3D point cloud, text, audio, medical imaging.
              {sourceLink("https://labelyourdata.com/", "[1]")}
              {sourceLink("https://labelyourdata.com/", "[2]")}
            </>
          ),
          claru: "Egocentric video, depth, pose, and multi-sensor data",
        },
      },
      {
        dimension: "Video annotation",
        values: {
          lyd: (
            <>
              Bounding box, segmentation, and keypoint video labeling.
              {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
            </>
          ),
          claru: "Expert labeling plus enrichment outputs",
        },
      },
      {
        dimension: "3D annotation",
        values: {
          lyd: (
            <>
              LiDAR, RADAR, and photogrammetry point cloud workflows.
              {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
            </>
          ),
          claru: "Robotics-ready datasets with enrichment layers",
        },
      },
      {
        dimension: "Data collection",
        values: {
          lyd: (
            <>
              Data collection services listed.
              {sourceLink("https://labelyourdata.com/", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          lyd: "Managed labeling outputs",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          lyd: "Teams needing managed labeling services",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Label Your Data vs Claru",
    intro:
      "Label Your Data specializes in managed labeling. Claru specializes in capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "Label Your Data provides labeling services across multiple modalities.",
          "Claru provides capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Modalities",
        paragraphs: [
          "Label Your Data supports image, video, 3D point cloud, text, audio, and medical imaging.",
          "Claru prioritizes physical-world capture with enrichment layers.",
        ],
      },
      {
        title: "Robotics AI requirements",
        paragraphs: [
          "Robotics foundation models like RT-2, Octo, and OpenVLA require training data that pairs egocentric video with dense spatial signals including depth maps, human pose skeletons, semantic segmentation masks, and optical flow fields. While Label Your Data can annotate existing footage with bounding boxes, keypoints, and segmentation masks, the upstream challenge of capturing task-specific video and generating these enrichment layers automatically is outside their service model.",
          "Claru runs the full pipeline from field capture to enrichment to delivery. Wearable camera operators record real-world manipulation, navigation, and activity tasks, and the enrichment pipeline produces per-frame depth, pose, segmentation, and motion outputs aligned to the video timeline. Datasets are delivered in robotics-native formats like RLDS, LeRobot, or HDF5.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Label Your Data is strong when managed labeling is the bottleneck. The company's multi-modal coverage, including medical imaging, GIS, and 3D point cloud annotation, makes it a versatile partner for teams with diverse annotation needs across existing datasets.",
          "Claru is stronger when physical-world capture is the bottleneck. If your robotics training pipeline needs new task-specific recordings from real environments with aligned spatial enrichment signals, Claru addresses that upstream data generation need.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Label Your Data Is a Fit",
    competitorBullets: [
      "You need managed labeling services across multiple modalities.",
      "You work with video annotation or 3D point clouds.",
      "You need medical imaging or GIS data annotation services.",
      "You want data collection bundled with labeling services.",
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
        title: "Labelbox Alternatives",
        desc: "Annotation platform vs capture-first datasets.",
        href: "/compare/labelbox-alternatives",
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
      "Choose Label Your Data when you need managed labeling services across multiple modalities.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Label Your Data for labeling services and Claru for capture-first datasets.",
      "If your project requires task-specific physical data collection, prioritize providers built for capture and enrichment from day one.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Label Your Data?",
        answer: (
          <>
            Label Your Data is a Ukraine-based data labeling company that provides managed annotation services across image, video, 3D point cloud, text, audio, and medical imaging. The company handles complex annotation projects for autonomous driving, healthcare AI, and computer vision applications. Label Your Data positions itself as a full-service labeling partner for teams that need high-quality labeled datasets but lack internal annotation capacity, offering both annotation and data collection capabilities.
            {sourceLink("https://labelyourdata.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Label Your Data support 3D point cloud annotation?",
        answer: (
          <>
            The 3D annotation services mention LiDAR, RADAR, and photogrammetry
            data. {sourceLink("https://labelyourdata.com/services/3d-annotation", "[5]")}
          </>
        ),
      },
      {
        question: "What video annotation tasks are listed?",
        answer: (
          <>
            Video annotation includes bounding box, segmentation, and keypoint
            tasks. {sourceLink("https://labelyourdata.com/services/computer-vision-services/", "[4]")}
          </>
        ),
      },
      {
        question: "Does Label Your Data offer data collection?",
        answer: (
          <>
            Data collection is listed among services.
            {sourceLink("https://labelyourdata.com/", "[3]")}
          </>
        ),
      },
      {
        question: "Does Label Your Data handle medical imaging?",
        answer: (
          <>
            Medical imaging annotation is listed on the services page.
            {sourceLink("https://labelyourdata.com/", "[2]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your training pipeline requires new egocentric video from real-world environments paired with depth maps, human pose estimation, segmentation masks, and motion vectors, Claru handles that entire upstream workflow. Label Your Data is better suited for teams that already have data and need managed annotation services across multiple modalities.",
      },
      {
        question: "Can teams use both Label Your Data and Claru?",
        answer:
          "Yes, some organizations use Label Your Data for annotation of existing datasets and Claru for generating new physical-world recordings with enrichment layers. This combination works well when a team has both legacy data that needs labeling and a need for new robotics-specific captures with spatial signals. The two providers address different stages of the data pipeline and are complementary rather than competitive.",
      },
      {
        question: "Is Label Your Data a fit for robotics data capture?",
        answer:
          "Label Your Data focuses on managed labeling services, not data capture or enrichment. While the company can annotate existing robotics footage with bounding boxes, keypoints, and segmentation, it does not deploy wearable camera operators, generate depth or optical flow enrichment layers, or deliver datasets in robotics-native formats like RLDS or HDF5. Teams building robotics foundation models typically need a capture-first provider alongside their annotation services partner.",
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
    { label: "Label Your Data Services", url: "https://labelyourdata.com/" },
    { label: "Label Your Data CV Services", url: "https://labelyourdata.com/services/computer-vision-services/" },
    { label: "Label Your Data 3D Annotation", url: "https://labelyourdata.com/services/3d-annotation" },
  ],
};
