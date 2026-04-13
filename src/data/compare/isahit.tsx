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

export const isahitComparison: ComparisonData = {
  slug: "isahit-alternatives",
  competitor: {
    name: "iSAHIT",
    siteUrl: "https://www.isahit.com",
    category: "Managed human-in-the-loop labeling services",
  },
  meta: {
    title: "iSAHIT Alternatives for Physical AI Data (2026) | Claru",
    description:
      "Compare iSAHIT and Claru for physical AI training data. iSAHIT offers human-in-the-loop data labeling, RLHF, and AI project delivery across CV, NLP, LLM, audio, and speech tasks. Claru specializes in capture, enrichment, and robotics-ready delivery.",
    keywords: [
      "iSAHIT alternative",
      "iSAHIT alternatives",
      "iSAHIT vs Claru",
      "human in the loop",
      "RLHF services",
      "data labeling workforce",
      "AI training data",
      "physical AI training data",
      "robotics data capture",
    ],
    ogImage: "/images/og-v2.webp",
    published: "2026-04-02",
    modified: "2026-04-02",
  },
  hero: {
    eyebrow: "// COMPARE",
    breadcrumbLabel: "iSAHIT Alternatives",
    title: "iSAHIT Alternatives: Human-in-the-Loop vs Physical AI Capture",
    subtitle: (
      <>
        <a
          href="https://www.isahit.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#92B090" }}
          className="underline underline-offset-2"
        >
          iSAHIT
        </a>{" "}
        provides human-in-the-loop data labeling and RLHF services across CV,
        NLP, LLM, audio, and speech tasks. If you need physical-world capture
        and enrichment for robotics, Claru is built for physical AI from day
        one.
      </>
    ),
    lastUpdated: "April 2, 2026",
    paragraphs: [
      "iSAHIT was founded in 2017 by Isabelle Mashola and is headquartered in Paris, France. The company has built its identity around ethical AI and social impact, employing a predominantly female workforce across Africa, Asia, Europe, and South America. iSAHIT achieved B Corp certification, reinforcing its commitment to fair labor practices in an industry often scrutinized for worker treatment. The company serves clients ranging from startups to Fortune 500 enterprises, offering managed human-in-the-loop data labeling for computer vision, natural language processing, large language models, audio, and speech tasks.",
      "For physical AI teams evaluating iSAHIT, it is important to recognize that the company operates as a labeling and RLHF services provider rather than a data capture pipeline. iSAHIT does not deploy field collection networks, generate egocentric video from wearable cameras, or produce enrichment layers such as depth maps, human pose estimation, or optical flow. Teams training robotics foundation models, manipulation policies, or world models for embodied AI will find that iSAHIT can handle downstream annotation tasks effectively, but the upstream challenges of physical-world data capture and multi-layer spatial enrichment require a different kind of partner.",
    ],
  },
  tldr: {
    title: "TL;DR",
    bullets: [
      "iSAHIT positions itself as a Human-by-API partner for AI data projects.",
      "Its service line covers human-in-the-loop data labeling across CV, NLP, LLM, audio, and speech tasks.",
      "iSAHIT highlights RLHF support for fine-tuning and evaluation workflows.",
      "The company emphasizes ethical AI and a workforce of women across four continents.",
      "iSAHIT offers flexible tooling: label on their tool, yours, or a partner's.",
      "This is a managed services model, not a capture-first physical AI pipeline.",
      "Claru is purpose-built for physical AI capture and multi-layer enrichment.",
      "Choose iSAHIT for HITL and RLHF capacity; choose Claru for capture + enrichment of robotics data.",
    ],
  },
  overview: {
    title: "What iSAHIT Is Built For",
    paragraphs: [
      "Key differences in 60 seconds: iSAHIT provides managed human-in-the-loop services. Claru is a capture-and-enrichment pipeline for physical AI training data.",
      <>
        iSAHIT positions itself as a Human-by-API partner that scales AI
        projects with human expertise. {sourceLink("https://www.isahit.com/", "[1]")}
      </>,
      <>
        The company highlights human-in-the-loop data labeling across computer
        vision, NLP, LLM, audio, and speech tasks.
        {sourceLink("https://www.isahit.com/", "[2]")}
      </>,
      <>
        iSAHIT also promotes RLHF services for fine-tuning and evaluation.
        {sourceLink("https://www.isahit.com/", "[3]")}
      </>,
      <>
        iSAHIT emphasizes ethical AI and a workforce of women across four
        continents. {sourceLink("https://www.isahit.com/", "[4]")}
      </>,
      <>
        The platform notes you can label on their tool, your tool, or a partner
        tool. {sourceLink("https://www.isahit.com/", "[5]")}
      </>,
      <>
        iSAHIT is a B Corp-certified organization. {sourceLink("https://www.isahit.com/", "[6]")}
      </>,
      "If your bottleneck is human-in-the-loop labeling and RLHF at scale, iSAHIT is a strong fit. If your bottleneck is physical-world capture and enrichment, Claru is the better fit.",
    ],
  },
  snapshot: {
    title: "Company Snapshot",
    columns: [
      {
        title: "iSAHIT at a Glance",
        items: [
          {
            label: "Focus",
            value: (
              <>
                Human-by-API managed labeling services.
                {sourceLink("https://www.isahit.com/", "[1]")}
              </>
            ),
          },
          {
            label: "Workflows",
            value: (
              <>
                CV, NLP, LLM, audio, and speech labeling.
                {sourceLink("https://www.isahit.com/", "[2]")}
              </>
            ),
          },
          {
            label: "RLHF",
            value: (
              <>
                RLHF services for fine-tuning and evaluation.
                {sourceLink("https://www.isahit.com/", "[3]")}
              </>
            ),
          },
          {
            label: "Ethical focus",
            value: (
              <>
                Workforce of women across four continents.
                {sourceLink("https://www.isahit.com/", "[4]")}
              </>
            ),
          },
          {
            label: "Tooling",
            value: (
              <>
                Label on iSAHIT tools, your tools, or partner tools.
                {sourceLink("https://www.isahit.com/", "[5]")}
              </>
            ),
          },
          {
            label: "Best fit",
            value: "Teams needing managed HITL and RLHF capacity",
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
        iSAHIT positions itself as a Human-by-API partner for AI projects.
        {sourceLink("https://www.isahit.com/", "[1]")}
      </>,
      <>
        The company highlights HITL labeling across CV, NLP, LLM, audio, and
        speech tasks. {sourceLink("https://www.isahit.com/", "[2]")}
      </>,
      <>
        iSAHIT promotes RLHF services for fine-tuning and evaluation.
        {sourceLink("https://www.isahit.com/", "[3]")}
      </>,
      <>
        iSAHIT emphasizes ethical AI and a workforce of women across four
        continents. {sourceLink("https://www.isahit.com/", "[4]")}
      </>,
      <>
        Labeling can be performed on iSAHIT tools, customer tools, or partner
        tools. {sourceLink("https://www.isahit.com/", "[5]")}
      </>,
      <>
        iSAHIT is B Corp certified. {sourceLink("https://www.isahit.com/", "[6]")}
      </>,
    ],
  },
  strengths: {
    title: "Where iSAHIT Is Strong",
    intro:
      "Based on iSAHIT's public materials, these are areas where their offering is a strong fit.",
    cards: [
      {
        title: "Human-by-API delivery",
        description: (
          <>
            iSAHIT positions itself as a Human-by-API partner for AI projects.
            {sourceLink("https://www.isahit.com/", "[1]")}
          </>
        ),
      },
      {
        title: "Multi-modal HITL",
        description: (
          <>
            HITL labeling spans CV, NLP, LLM, audio, and speech tasks.
            {sourceLink("https://www.isahit.com/", "[2]")}
          </>
        ),
      },
      {
        title: "RLHF workflows",
        description: (
          <>
            iSAHIT highlights RLHF for fine-tuning and evaluation.
            {sourceLink("https://www.isahit.com/", "[3]")}
          </>
        ),
      },
      {
        title: "Ethical workforce model",
        description: (
          <>
            The company emphasizes ethical AI and a workforce of women across
            four continents. {sourceLink("https://www.isahit.com/", "[4]")}
          </>
        ),
      },
      {
        title: "Flexible tooling",
        description: (
          <>
            Labeling can run on iSAHIT tools, your tools, or partner tools.
            {sourceLink("https://www.isahit.com/", "[5]")}
          </>
        ),
      },
    ],
  },
  alternatives: {
    title: "Where Claru Is Different",
    intro:
      "iSAHIT is a managed human-in-the-loop provider. Claru is a capture-and-enrichment pipeline for physical AI.",
    cards: [
      {
        title: "Capture-first",
        description:
          "Claru starts by capturing physical-world data instead of relying on customer-provided datasets.",
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
      {
        title: "Embodied context",
        description:
          "Physical AI workflows need egocentric capture and sensor alignment beyond standard HITL tasks.",
      },
    ],
  },
  comparison: {
    title: "iSAHIT vs Claru: Side-by-Side Comparison",
    intro:
      "This comparison focuses on physical AI needs while recognizing iSAHIT's managed services model.",
    columns: [
      { key: "isahit", label: "iSAHIT" },
      { key: "claru", label: "Claru", highlight: true },
    ],
    rows: [
      {
        dimension: "Primary focus",
        values: {
          isahit: (
            <>
              Human-by-API managed labeling services.
              {sourceLink("https://www.isahit.com/", "[1]")}
            </>
          ),
          claru: "Physical AI training data for robotics and world models",
        },
      },
      {
        dimension: "Task coverage",
        values: {
          isahit: (
            <>
              CV, NLP, LLM, audio, and speech HITL tasks.
              {sourceLink("https://www.isahit.com/", "[2]")}
            </>
          ),
          claru: "Capture + enrichment + expert annotation",
        },
      },
      {
        dimension: "RLHF",
        values: {
          isahit: (
            <>
              RLHF services for fine-tuning and evaluation.
              {sourceLink("https://www.isahit.com/", "[3]")}
            </>
          ),
          claru: "Robotics-specific enrichment and quality scoring",
        },
      },
      {
        dimension: "Tooling",
        values: {
          isahit: (
            <>
              Labeling on iSAHIT tools, customer tools, or partner tools.
              {sourceLink("https://www.isahit.com/", "[5]")}
            </>
          ),
          claru: "Capture pipelines with robotics-native deliverables",
        },
      },
      {
        dimension: "Data capture",
        values: {
          isahit: "Bring-your-own data",
          claru: "Collector network plus task-specific capture",
        },
      },
      {
        dimension: "Best fit",
        values: {
          isahit: "Teams needing managed HITL and RLHF capacity",
          claru: "Teams needing capture + enrichment for physical AI",
        },
      },
    ],
  },
  deepDive: {
    title: "Deep Dive: iSAHIT vs Claru",
    intro:
      "iSAHIT is a managed human-in-the-loop provider. Claru specializes in physical AI capture and enrichment.",
    blocks: [
      {
        title: "Services vs pipeline",
        paragraphs: [
          "iSAHIT focuses on Human-by-API delivery for labeling and RLHF workflows.",
          "Claru delivers capture, enrichment, and training-ready datasets for robotics.",
        ],
      },
      {
        title: "Modalities and tasks",
        paragraphs: [
          "iSAHIT supports CV, NLP, LLM, audio, and speech tasks through HITL workflows.",
          "Claru focuses on physical-world data where depth, pose, and motion are critical.",
        ],
      },
      {
        title: "Data sourcing",
        paragraphs: [
          "iSAHIT assumes you bring data or plug into their tooling for labeling.",
          "Claru captures new data from the physical world as part of the project scope.",
        ],
      },
      {
        title: "Robotics AI readiness",
        paragraphs: [
          "Modern robotics foundation models like RT-2, Octo, and pi0 require training data that pairs egocentric video with dense spatial signals including depth, pose, segmentation, and optical flow. iSAHIT's HITL workforce can classify actions, label objects, and evaluate model outputs, but these are annotation tasks applied to existing data rather than the capture and enrichment steps that generate the raw training signal.",
          "Claru addresses this gap by deploying wearable camera operators to capture task-specific video in real environments and then applying automated enrichment pipelines that produce per-frame depth, pose, and motion layers. The resulting datasets ship in robotics-native formats like RLDS and LeRobot, ready for direct ingestion into training frameworks.",
        ],
      },
      {
        title: "Where each wins",
        paragraphs: [
          "iSAHIT is strong for HITL and RLHF throughput with ethical workforce sourcing. If you need classification, preference ranking, or evaluation tasks executed by a vetted workforce with B Corp standards, iSAHIT delivers reliably across multiple languages and modalities.",
          "Claru is stronger when physical-world capture is the bottleneck. If your robotics training pipeline needs new egocentric manipulation data, kitchen activity recordings, or warehouse navigation footage with aligned spatial signals, Claru addresses the upstream data generation challenge.",
        ],
      },
    ],
  },
  fit: {
    competitorTitle: "When iSAHIT Is a Fit",
    competitorBullets: [
      "You need managed HITL labeling across CV, NLP, LLM, audio, or speech tasks.",
      "You need RLHF support for fine-tuning and evaluation workflows.",
      "You want flexible tooling options for annotation delivery.",
      "You prefer a human-in-the-loop services partner instead of a capture pipeline.",
    ],
    claruTitle: "When Claru Is a Fit",
    claruBullets: [
      "You need physical-world data captured for robotics tasks.",
      "You want enrichment layers like depth, pose, and motion signals.",
      "You need egocentric capture and sensor-aligned labels.",
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
        title: "Scale AI Alternatives",
        desc: "Enterprise annotation vs physical AI pipelines.",
        href: "/compare/scale-ai-alternatives",
      },
      {
        title: "Surge AI Alternatives",
        desc: "Expert RLHF vs capture-first robotics datasets.",
        href: "/compare/surge-ai-alternatives",
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
      "Choose iSAHIT when you need managed HITL and RLHF delivery across language, vision, and speech tasks.",
      "Choose Claru when you need capture and enrichment of physical-world data for robotics training.",
      "Some teams use both: iSAHIT for labeling services, Claru for capture-first physical datasets.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is iSAHIT?",
        answer: (
          <>
            iSAHIT is a B Corp-certified, Paris-based company founded in 2017 that positions itself as a Human-by-API partner for AI projects. The company employs a predominantly female workforce across four continents to deliver managed human-in-the-loop data labeling and RLHF services. iSAHIT serves clients from startups to Fortune 500 enterprises and has built its brand around ethical AI practices and fair labor standards in the data annotation industry.
            {sourceLink("https://www.isahit.com/", "[1]")}
          </>
        ),
      },
      {
        question: "What tasks does iSAHIT support?",
        answer: (
          <>
            iSAHIT highlights human-in-the-loop labeling across computer vision, natural language processing, large language model training, audio transcription, and speech recognition tasks. The company supports a range of annotation types from image classification and bounding boxes to text categorization and preference ranking for RLHF workflows. This breadth makes iSAHIT a strong choice for teams with diverse labeling needs across multiple modalities.
            {sourceLink("https://www.isahit.com/", "[2]")}
          </>
        ),
      },
      {
        question: "Does iSAHIT offer RLHF services?",
        answer: (
          <>
            Yes. iSAHIT promotes RLHF workflows for fine-tuning and evaluation of large language models. The company provides human evaluators who can perform preference ranking, response quality assessment, and red-teaming tasks. These services are particularly relevant for teams training conversational AI or generative models, though they do not extend to the spatial enrichment tasks required for physical AI and robotics training.
            {sourceLink("https://www.isahit.com/", "[3]")}
          </>
        ),
      },
      {
        question: "Can iSAHIT work with our annotation tools?",
        answer: (
          <>
            iSAHIT notes you can label on their tool, your tool, or a partner tool. This flexibility allows teams to integrate iSAHIT's workforce into existing labeling infrastructure without migrating data to a new platform. The tool-agnostic approach is valuable for enterprises that have already invested in annotation tooling but need additional human capacity to scale throughput.
            {sourceLink("https://www.isahit.com/", "[5]")}
          </>
        ),
      },
      {
        question: "When is Claru a better fit?",
        answer:
          "Claru is a better fit when you need capture, enrichment, and delivery of robotics-ready datasets. If your training pipeline requires new egocentric video from real-world environments paired with depth maps, human pose estimation, segmentation masks, and optical flow layers, Claru addresses those upstream data generation needs. iSAHIT excels at downstream annotation tasks but does not operate capture networks or produce spatial enrichment signals.",
      },
      {
        question: "Does iSAHIT handle physical AI or robotics data?",
        answer:
          "iSAHIT can label existing robotics-related footage with classifications, bounding boxes, or action labels. However, the company does not capture new physical-world data, deploy wearable camera operators, or generate enrichment layers like depth estimation and pose extraction. Teams building embodied AI systems typically need a capture-first provider alongside any annotation services partner.",
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
  sources: [{ label: "iSAHIT", url: "https://www.isahit.com/" }],
};
