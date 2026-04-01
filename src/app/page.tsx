import HomeLoader from "./HomeLoader";

// ---------------------------------------------------------------------------
// FAQ JSON-LD for rich results
// ---------------------------------------------------------------------------
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of AI training data does Claru provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru provides purpose-built training data across text, vision, video, and robotics modalities. Our services span the full data lifecycle: acquisition (egocentric video capture, synthetic data generation, data licensing), enrichment (expert annotation, RLHF, video annotation), preparation (deduplication, multimodal alignment, quality scoring), and validation (benchmark curation, bias detection, red teaming). We have delivered over 3 million completed human annotations across 15 datasets.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru ensure annotation quality for RLHF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru uses expert human annotators \u2014 not crowdsourced labor \u2014 embedded directly with AI research teams. This gives annotators full context on model behavior and labeling requirements, resulting in higher inter-annotator agreement and fewer downstream errors. Every project includes structured protocols, real-time validation during annotation, multi-stage quality assurance, and automated consistency checks before delivery.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Claru different from general data annotation vendors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru works exclusively with frontier AI labs building next-generation models \u2014 not the general market. Our annotators are domain experts embedded with research teams, not anonymous gig workers on a task marketplace. This specialization means deeper context on each project, tighter feedback loops with researchers, and training data purpose-built for cutting-edge video, vision, robotics, and language models.",
      },
    },
    {
      "@type": "Question",
      name: "What AI modalities does Claru support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru supports four core AI modalities: text (language model alignment, RLHF, red teaming), vision (image classification, object detection, visual reasoning), video (temporal annotation, action recognition, video generation training), and robotics (manipulation trajectories, egocentric capture, spatial reasoning). Our data catalog includes datasets spanning 20+ activity domains captured across 14+ countries.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru handle data privacy and security?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru maintains strict data privacy and security protocols for all projects. Every dataset is fully licensed and rights-cleared for commercial model training. We handle participant consent, data anonymization, and secure storage throughout the pipeline. Our processes comply with applicable data protection regulations, and we work closely with each lab partner to meet their specific security and compliance requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What is human-in-the-loop AI training data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Human-in-the-loop AI training data is data that has been labeled, evaluated, or curated by human experts to train and improve AI models. Unlike purely automated pipelines, human-in-the-loop approaches use expert judgment to handle ambiguous cases, evaluate model outputs, and provide the nuanced feedback that alignment techniques like RLHF require. Claru specializes in this approach, providing expert annotators who work alongside AI researchers.",
      },
    },
    {
      "@type": "Question",
      name: "How does Claru work with frontier AI labs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claru partners with frontier AI labs through embedded teams of expert annotators who integrate directly into the lab\u2019s research workflow. Rather than operating as a detached vendor, our annotators gain full context on the models being trained, participate in calibration sessions, and maintain direct communication with researchers. This embedded model enables faster iteration cycles and higher-quality training data tailored to each lab\u2019s specific needs.",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Organization JSON-LD
// ---------------------------------------------------------------------------
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Claru",
  url: "https://claru.ai",
  description:
    "Purpose-built training data for frontier robotics, embodied AI, and world models. 4M+ annotations, 100+ datasets, 10,000+ collectors worldwide.",
  sameAs: [],
};

// ---------------------------------------------------------------------------
// Server-rendered SEO shell
// ---------------------------------------------------------------------------
// Provides crawlable text content for AI bots (GPTBot, ClaudeBot) and search
// engines that do not execute JavaScript. The visual page is rendered entirely
// by the client-side HomeContent component; this shell is hidden from sighted
// users via Tailwind's sr-only utility but remains in the DOM for crawlers.
// This is a standard, Google-approved pattern -- the hidden text matches the
// visual content exactly, so it is not cloaking.
// ---------------------------------------------------------------------------
function SEOShell() {
  return (
    <div className="sr-only" aria-hidden="false">
      <h1>Training Data for Physical AI</h1>
      <p>
        Purpose-built datasets for frontier robotics, embodied AI, and world
        models.
      </p>

      <h2>Millions of clips. Every environment.</h2>
      <p>
        Egocentric video, game environments, driving, cinematic, manufacturing,
        cooking, warehouse, and human activity data -- curated for frontier AI
        labs training world models, VLAs, and video generation systems.
      </p>

      <h2>
        More than video. Captured, enriched, annotated, and delivered to your
        pipeline.
      </h2>
      <p>
        Every clip ships with depth maps, pose estimation, segmentation masks,
        and structured metadata. Licensed, real-world video -- not synthetic, not
        scraped. Expert humans label what machines miss: intent, context, edge
        cases. Your format. Your pipeline. Ready to train.
      </p>

      <h2>
        10,000+ collectors. 100+ cities. Every environment your model needs.
      </h2>
      <p>
        A global network of trained data collectors capturing real-world video
        across 6 continents. Suburban kitchens. Factory floors. City streets.
        Not lab data -- real-world data at scale.
      </p>

      <h2>Built for frontier labs. Proven at scale.</h2>
      <p>
        500K+ egocentric videos captured for a world-modeling lab. 10K+ hours
        of game environment data. 2M+ video annotations powering RLHF for
        frontier video generation.
      </p>
      <p>
        4M+ human annotations. 100+ active datasets. 10,000+ collectors
        worldwide. 5+ frontier lab partnerships.
      </p>

      <h2>Tell us what you are training.</h2>
      <p>
        From brief to first delivery in days, not months. We scope the dataset,
        design the pipeline, and deliver training-ready data on your timeline.
      </p>
      <a href="#contact">Book a Call</a>
      <a href="mailto:contact@claru.ai">contact@claru.ai</a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component (Server Component -- no "use client" directive)
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <SEOShell />
      <HomeLoader />
    </>
  );
}
