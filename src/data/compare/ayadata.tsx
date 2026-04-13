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

export const ayadataComparison: ComparisonData = {
  slug: "ayadata-alternatives",
  competitor: {
    name: "Aya Data",
    siteUrl: "https://www.ayadata.ai",
    category: "AI data collection and annotation services",
  },
  meta: {
    title: "Aya Data Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Aya Data and Claru for physical AI training data. Aya Data provides data annotation and collection services across modalities. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Aya Data alternative",
      "Aya Data alternatives",
      "Aya Data vs Claru",
      "data annotation services",
      "data collection services",
      "physical AI training data",
      "robotics data labeling",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Aya Data Alternatives",
    title: "Aya Data Alternatives: Data Annotation vs Physical AI Capture",
    subtitle: (
      <>
        <a
          href="https://www.ayadata.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Aya Data
        </a>{" "}
        provides data annotation and data collection services across modalities.
        If you need physical-world capture and enrichment for robotics, Claru is
        built for physical AI from day one. This page compares the two.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Aya Data provides data annotation and data collection services across multiple modalities.",
      "Aya Data positions itself as an end-to-end data partner for AI teams.",
      "Claru is purpose-built for physical AI data capture and enrichment.",
      "Choose Aya Data when you need general annotation or collection services.",
      "Choose Claru when you need robotics-ready datasets captured from the physical world.",
    ],
  },
  overview: {
    title: "What Aya Data Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Aya Data is a broad AI data services provider focused on annotation and collection. Claru is a physical AI pipeline focused on capture and enrichment for robotics.",
      <>
        Aya Data highlights data annotation services across major data types and
        industries, along with data collection services. {" "}
        {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
      </>,
      <>
        The company also positions itself as an end-to-end AI data partner with
        consulting and delivery support. {" "}
        {sourceLink("https://www.ayadata.ai/", "[2]")}
      </>,
      "Aya Data was founded in 2021 by Freddie Monk and Ama Larbi-Siaw in Ghana. The company raised a 300,000 dollar pre-seed round from Microtraction, Savannah Fund, and UK-based investors, followed by a 900,000 dollar seed round led by 54Collective, bringing total funding to approximately 1.15 million dollars. With reported 2023 revenue of 500,000 dollars, the company counts clients including MIT, Unilever, Seedtag, and Labelbox.",
      "Beyond annotation services, Aya Data has developed products including AyaGrow, a precision agriculture tool for crop monitoring with AI, and AyaSpeech, an end-to-end speech-to-speech solution for local African languages. This positions Aya Data as a company focused on building AI solutions for African markets while providing data services globally. Their workforce of annotators in Ghana provides cost-effective labeling services while creating employment in the region.",
      "For physical AI and robotics teams, Aya Data's strengths lie in general data annotation and collection at competitive pricing rather than specialized physical-world capture. Teams that need egocentric video from wearable cameras, task-specific capture protocols for manipulation or navigation tasks, and enrichment layers like depth estimation, 3D pose extraction, and optical flow will need a provider like Claru that is purpose-built for the physical AI data pipeline from capture through delivery.",
      "If your bottleneck is general data annotation or collection, Aya Data can help. If your bottleneck is physical-world capture and robotics enrichment, you need a specialized pipeline.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Aya Data at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Data annotation and data collection services. {" "}
                {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
              </>
            ),
          },
          {
            label: "Coverage",
            value: "Multi-modal annotation and collection",
          },
          {
            label: "Core output",
            value: "Labeled datasets and collected data for AI training",
          },
          {
            label: "Best fit",
            value: "Teams needing general annotation or data collection",
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
            value: "Robotics teams that need capture + enrichment",
          },
        ],
      },
    ],
  },
  keyClaims: {
    title: "Key Claims (With Sources)",
    claims: [
      <>
        Aya Data lists data annotation services across major data types and
        industries. {" "}
        {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
      </>,
      <>
        Aya Data highlights data collection services as part of its offering. {" "}
        {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[2]")}
      </>,
      <>
        Aya Data positions itself as an end-to-end AI data partner. {" "}
        {sourceLink("https://www.ayadata.ai/", "[3]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Aya Data Is Strong",
    intro:
      "Based on Aya Data’s public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Annotation services breadth",
        description: (
          <>
            Aya Data highlights data annotation services across data types and
            industries. {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        title: "Data collection support",
        description: (
          <>
            The company highlights data collection services as part of its AI
            data offering. {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[2]")}
          </>
        ),
      },
      {
        title: "End-to-end delivery",
        description: (
          <>
            Aya Data positions itself as a full-stack AI data partner. {" "}
            {sourceLink("https://www.ayadata.ai/", "[3]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Why Physical AI Teams Evaluate Alternatives",
    intro:
      "Robotics teams often need capture and enrichment of physical-world data — not just general annotation services.",
    cards: [
      {
        title: "Capture-first pipelines",
        description:
          "Physical AI models require real-world data collection with task-specific capture programs.",
      },
      {
        title: "Enrichment layers",
        description:
          "Depth, pose, segmentation, and motion signals are critical for robotics training.",
      },
      {
        title: "Training-ready delivery",
        description:
          "Claru ships datasets in formats that plug directly into robotics stacks.",
      },
    ],
  },
  comparison: {
    title: "Aya Data vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Aya Data’s data services model.",
    columns: [
      { key: "ayadata", label: "Aya Data" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          ayadata: (
            <>
              Data annotation and data collection services. {" "}
              {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Core output",
        values: {
          ayadata: "Labeled datasets and collected data",
          claru: "Training-ready physical datasets with enrichment layers",
        },
      },
      {
        dimension: "Data capture",
        values: {
          ayadata: "General data collection programs",
          claru: "Collector network plus teleoperation and task-specific capture",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          ayadata: "Annotation layers tailored to client needs",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          ayadata: "Teams needing broad annotation or data collection",
          claru: "Robotics teams needing capture + enrichment",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Aya Data vs Claru",
    intro:
      "Aya Data is a general AI data services provider. Claru is a physical AI data pipeline.",
    blocks: [
      {
        title: "General annotation vs physical capture",
        paragraphs: [
          "Aya Data emphasizes annotation and data collection across modalities.",
          "Claru emphasizes capture and enrichment of real-world physical data for robotics training.",
        ],
      },
      {
        title: "Annotation layers vs enrichment layers",
        paragraphs: [
          "Aya Data delivers labeled datasets based on client schemas.",
          "Claru adds enrichment layers like depth and pose that are core model inputs for robotics.",
        ],
      },
      {
        title: "Where each provider fits",
        paragraphs: [
          "Aya Data is a strong fit for general AI annotation and collection workflows.",
          "Claru is a better fit when the challenge is physical-world capture and robotics-ready delivery.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Aya Data Is a Fit",
    competitorBullets: [
      "You need general data annotation or collection services.",
      "You already have data and need labeling support.",
      "You want a broad AI data services partner.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need new physical-world data captured for robotics tasks.",
      "Your model depends on enrichment layers like depth and motion.",
      "You want datasets delivered in robotics-native formats.",
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
        desc: "Global data services vs physical AI specialization.",
        href: "/compare/appen-alternatives",
      },
      {
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Surge AI Alternatives",
        desc: "Expert RLHF vs physical AI capture.",
        href: "/compare/surge-ai-alternatives",
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
      "If you need broad annotation or collection services, Aya Data is designed for that scope.",
      "If you need capture and enrichment of physical-world data for robotics training, Claru is a better fit.",
      "Some teams use both: Aya Data for labeling, Claru for physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Aya Data?",
        answer: (
          <>
            Aya Data is an AI consulting and data services firm founded in 2021 in Ghana by Freddie Monk and Ama Larbi-Siaw. The company provides data annotation and collection services across modalities, with clients including MIT, Unilever, Seedtag, and Labelbox. With approximately 1.15 million dollars in total funding from investors including 54Collective, Microtraction, and Savannah Fund, Aya Data has built a workforce in Ghana that provides cost-effective annotation services while creating local employment.{" "}
            {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[1]")}
          </>
        ),
      },
      {
        question: "Does Aya Data provide data collection?",
        answer: (
          <>
            Yes. Aya Data highlights data collection services alongside data annotation as part of their end-to-end AI data offering. The company has also developed purpose-built products including AyaGrow for precision agriculture and AyaSpeech for African language speech-to-speech solutions, demonstrating capability beyond pure annotation. However, their collection services focus on general AI data rather than task-specific physical-world capture for robotics.{" "}
            {sourceLink("https://www.ayadata.ai/service/data-annotation/", "[2]")}
          </>
        ),
      },
      {
        question: "Is Aya Data a physical AI data provider?",
        answer:
          "Aya Data focuses on general data annotation and collection rather than physical-world capture for robotics. Their strength lies in providing high-quality annotation services at competitive pricing from their Ghana-based workforce, which is valuable for teams labeling existing datasets across standard modalities. Teams that need upstream capture of egocentric video, depth maps, and motion signals for robotics training will need a specialized provider like Claru.",
      },
      {
        question: "Where is Aya Data based?",
        answer:
          "Aya Data is based in Ghana and was founded to provide AI data services while creating employment opportunities in Africa. Their team of annotators in Ghana delivers data labeling across industries including healthcare, retail, utilities, agriculture, and geospatial. The company has received backing from African and international investors and reported 2023 revenue of 500,000 dollars.",
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need the full pipeline from physical-world data capture through enrichment and delivery of robotics-ready datasets. If your team needs to create new data from scratch with wearable cameras, task-specific collection protocols, and enrichment layers like depth, pose, and optical flow, Claru is purpose-built for that workflow. Choose Aya Data when you need general annotation or collection at competitive pricing.",
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
    { label: "Aya Data Data Annotation", url: "https://www.ayadata.ai/service/data-annotation/" },
    { label: "Aya Data", url: "https://www.ayadata.ai/" },
  ],
};
