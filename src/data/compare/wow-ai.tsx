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

export const wowAiComparison: ComparisonData = {
  slug: "wow-ai-alternatives",
  competitor: {
    name: "Wow AI",
    siteUrl: "https://wow-ai.com",
    category: "AI training data products and crowdsourcing",
  },
  meta: {
    title: "Wow AI Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare Wow AI and Claru for physical AI training data. Wow AI offers off-the-shelf datasets, custom data collection, data labeling, and crowdsourcing via a global contributor network. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "Wow AI alternative",
      "Wow AI alternatives",
      "Wow AI vs Claru",
      "training data products",
      "off-the-shelf datasets",
      "data collection services",
      "data labeling services",
      "crowdsourcing",
      "physical AI training data",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-03-31",
    modified: "2026-03-31",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "Wow AI Alternatives",
    title: "Wow AI Alternatives: Data Products vs Physical AI Data",
    subtitle: (
      <>
        <a
          href="https://wow-ai.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          Wow AI
        </a>{" "}
        provides AI data products such as off-the-shelf datasets, custom data
        collection, data labeling, and crowdsourcing. If you need physical-world
        capture and enrichment for robotics, Claru is built for physical AI from
        day one.
      </>
    ),
    lastUpdated: "March 31, 2026",
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "Wow AI positions itself as an end-to-end AI training partner.",
      "It highlights AI data products such as OTS datasets, custom data collection, data labeling, and crowdsourcing.",
      "Wow AI notes a global contributor network (170,000+ contributors) and 120+ languages.",
      "Custom data collection spans text, image, audio, and video.",
      "The platform lists annotation solutions for audio, image, lidar, and text with automation and human-in-the-loop review.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose Wow AI for data products and crowdsourcing; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What Wow AI Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: Wow AI provides AI data products and crowdsourcing. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        Wow AI markets end-to-end AI training support with AI data products like
        off-the-shelf datasets, custom data collection, data labeling, and
        crowdsourcing. {sourceLink("https://wow-ai.com/", "[1]")}
      </>,
      <>
        The company emphasizes a global contributor network with 170,000+
        contributors and 120+ languages. {sourceLink("https://wow-ai.com/data.html", "[2]")}
      </>,
      <>
        Custom collection spans text, image, audio, and video data types with
        tailored datasets. {sourceLink("https://wow-ai.com/data.html", "[3]")}
      </>,
      <>
        Wow AI highlights annotation solutions across audio, image, lidar, and
        text with automation and a human-in-the-loop approach.
        {sourceLink("https://wow-ai.com/", "[4]")}
      </>,
      <>
        The OTS dataset catalog references large audio collections and medical
        datasets as part of its off-the-shelf offering.
        {sourceLink("https://wow-ai.com/", "[5]")}
      </>,
      "If your bottleneck is crowdsourced data collection or managed annotation at scale, Wow AI is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "Wow AI at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                AI data products: OTS datasets, custom collection, labeling,
                and crowdsourcing. {sourceLink("https://wow-ai.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Network",
            value: (
              <>
                170,000+ global contributors across 120+ languages.
                {sourceLink("https://wow-ai.com/data.html", "[2]")}
              </>
            ),
          },
          {
            label: "Modalities",
            value: (
              <>
                Custom data collection across text, image, audio, and video.
                {sourceLink("https://wow-ai.com/data.html", "[3]")}
              </>
            ),
          },
          {
            label: "Annotation",
            value: (
              <>
                Annotation solutions for audio, image, lidar, and text with
                automation and HITL review.
                {sourceLink("https://wow-ai.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing OTS data and global crowdsourcing",
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
        Wow AI positions itself as an end-to-end AI training partner with AI
        data products. {sourceLink("https://wow-ai.com/", "[1]")}
      </>,
      <>
        AI data products include OTS datasets, custom data collection, data
        labeling, and crowdsourcing. {sourceLink("https://wow-ai.com/", "[1]")}
      </>,
      <>
        Wow AI references 170,000+ contributors and 120+ languages.
        {sourceLink("https://wow-ai.com/data.html", "[2]")}
      </>,
      <>
        Custom data collection spans text, image, audio, and video.
        {sourceLink("https://wow-ai.com/data.html", "[3]")}
      </>,
      <>
        Annotation solutions cover audio, image, lidar, and text with automation
        and HITL. {sourceLink("https://wow-ai.com/", "[4]")}
      </>,
      <>
        OTS datasets include large audio collections and medical datasets.
        {sourceLink("https://wow-ai.com/", "[5]")}
      </>,
    ],
  },
  strengths: {
    title: "Where Wow AI Is Strong",
    intro:
      "Based on Wow AI's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "OTS datasets + custom collection",
        description: (
          <>
            Wow AI highlights OTS datasets and custom data collection for AI
            projects. {sourceLink("https://wow-ai.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Global contributor scale",
        description: (
          <>
            The company references 170,000+ contributors and 120+ languages.
            {sourceLink("https://wow-ai.com/data.html", "[2]")}
          </>
        ),
      },
      {
        title: "Multi-modal collection",
        description: (
          <>
            Custom collection spans text, image, audio, and video data.
            {sourceLink("https://wow-ai.com/data.html", "[3]")}
          </>
        ),
      },
      {
        title: "Annotation + HITL",
        description: (
          <>
            Wow AI lists annotation solutions with automation and
            human-in-the-loop review.
            {sourceLink("https://wow-ai.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Crowdsourcing services",
        description: (
          <>
            Wow AI positions crowdsourcing as a core AI data product.
            {sourceLink("https://wow-ai.com/", "[1]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "Wow AI provides data products and crowdsourcing. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of sourcing from OTS catalogs.",
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
        title: "Task-specific briefs",
        description:
          "Claru designs capture plans around real robot behaviors and environments.",
      },
    ],
  },
  comparison: {
    title: "Wow AI vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing Wow AI's data product strengths.",
    columns: [
      { key: "wow", label: "Wow AI" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          wow: (
            <>
              AI data products: OTS datasets, collection, labeling,
              crowdsourcing. {sourceLink("https://wow-ai.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Contributor network",
        values: {
          wow: (
            <>
              170,000+ contributors across 120+ languages.
              {sourceLink("https://wow-ai.com/data.html", "[2]")}
            </>
          ),
          claru: "Specialized capture network for physical AI",
        },
      },
      {
        dimension: "Data collection",
        values: {
          wow: (
            <>
              Custom data across text, image, audio, and video.
              {sourceLink("https://wow-ai.com/data.html", "[3]")}
            </>
          ),
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Annotation approach",
        values: {
          wow: (
            <>
              Automation with human-in-the-loop annotation.
              {sourceLink("https://wow-ai.com/", "[4]")}
            </>
          ),
          claru: "Expert labeling paired with enrichment outputs",
        },
      },
      {
        dimension: "OTS data",
        values: {
          wow: (
            <>
              Catalog of off-the-shelf datasets.
              {sourceLink("https://wow-ai.com/", "[1]")}
            </>
          ),
          claru: "Custom capture designed to your robotics tasks",
        },
      },
      {
        dimension: "Enrichment",
        values: {
          wow: "Labeling and data delivery",
          claru: "Depth, pose, segmentation, optical flow, aligned captions",
        },
      },
      {
        dimension: "Best fit",
        values: {
          wow: "Teams needing global crowdsourcing and OTS datasets",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: Wow AI vs Claru",
    intro:
      "Wow AI focuses on data products and crowdsourcing. Claru focuses on capture and enrichment for physical AI.",
    blocks: [
      {
        title: "Data products vs pipeline",
        paragraphs: [
          "Wow AI delivers OTS datasets and managed data services.",
          "Claru delivers capture, enrichment, and training-ready datasets.",
        ],
      },
      {
        title: "Global contributor scale",
        paragraphs: [
          "Wow AI emphasizes scale via a 170,000+ contributor network.",
          "Claru emphasizes specialized capture for robotics behaviors.",
        ],
      },
      {
        title: "Collection scope",
        paragraphs: [
          "Wow AI covers text, image, audio, and video collection.",
          "Claru prioritizes physical-world capture with enrichment layers.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "Wow AI is strong when crowdsourcing and OTS datasets are the bottleneck.",
          "Claru is stronger when capture-first robotics data is the bottleneck.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When Wow AI Is a Fit",
    competitorBullets: [
      "You need off-the-shelf datasets and broad data products.",
      "You want global contributor scale for data collection.",
      "You need managed annotation across audio, image, lidar, or text.",
      "You are comfortable with crowdsourcing-based data acquisition.",
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
        desc: "Crowdsourced data services vs capture-first robotics datasets.",
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
      "Choose Wow AI when you need OTS datasets, crowdsourcing, or global data collection at scale.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: Wow AI for broad data sourcing, Claru for capture-first robotics datasets.",
      "If your project requires task-specific physical data collection, prioritize providers built for capture and enrichment.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Wow AI?",
        answer: (
          <>
            Wow AI positions itself as an end-to-end AI training partner with AI
            data products. {sourceLink("https://wow-ai.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What AI data products does Wow AI offer?",
        answer: (
          <>
            Wow AI lists OTS datasets, custom data collection, data labeling,
            and crowdsourcing services. {sourceLink("https://wow-ai.com/", "[1]")}
          </>
        ),
      },
      {
        question: "How large is Wow AI's contributor network?",
        answer: (
          <>
            Wow AI references 170,000+ global contributors and 120+ languages.
            {sourceLink("https://wow-ai.com/data.html", "[2]")}
          </>
        ),
      },
      {
        question: "What data types does Wow AI collect?",
        answer: (
          <>
            Wow AI highlights custom collection across text, image, audio, and
            video. {sourceLink("https://wow-ai.com/data.html", "[3]")}
          </>
        ),
      },
      {
        question: "Does Wow AI provide annotation services?",
        answer: (
          <>
            The platform lists annotation solutions with automation and
            human-in-the-loop review across modalities.
            {sourceLink("https://wow-ai.com/", "[4]")}
          </>
        ),
      },
      {
        question: "Does Wow AI offer off-the-shelf datasets?",
        answer: (
          <>
            Wow AI markets an OTS dataset catalog as part of its data products.
            {sourceLink("https://wow-ai.com/", "[1]")}
          </>
        ),
      },
      {
        question: "Is Wow AI a fit for robotics data capture?",
        answer:
          "Wow AI is a fit for broad data sourcing and crowdsourcing; Claru is a better fit when you need capture and enrichment for robotics-specific tasks.",
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
    { label: "Wow AI", url: "https://wow-ai.com/" },
    { label: "Wow AI Custom Data", url: "https://wow-ai.com/data.html" },
  ],
};
