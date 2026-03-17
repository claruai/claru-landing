// ---------------------------------------------------------------------------
// Content Page: Video Generation Training Data
// ---------------------------------------------------------------------------
// Tier 1 pillar page targeting "video generation training data" — addresses
// the preference data gap that limits RLHF-based video model optimization.
// Draws on three case studies spanning 39K pairwise evaluations, 976K+
// quality assessments, and 105K classified video clips.
// ---------------------------------------------------------------------------

import type { ContentPageData } from "./types";

const videoGenerationTrainingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "video-generation-training-data",
  title: "Expert Preference Data for Video Generation Models",
  metaTitle: "Video Generation Training Data | Expert Preference",
  metaDescription:
    "Expert human preference data for video generation model training. 976K+ quality assessments, 39K pairwise evaluations across 51 model configs. RLHF-ready.",
  primaryKeyword: "video generation training data",
  secondaryKeywords: [
    "video model training data",
    "video preference data",
    "video RLHF",
    "video quality annotation",
    "text-to-video training",
    "video generation evaluation",
    "human preference annotation video",
  ],
  breadcrumbLabel: "Video Generation Training Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Video generation models improve through human preference data — not just more training compute. But existing preference datasets cap at 182,000 annotations with narrow evaluation criteria, while frontier labs need millions of multi-dimensional quality assessments to train reward models that generalize across content types and failure modes. Claru delivers calibrated human preference data at the scale and specificity that RLHF for video generation demands.",
  videoSrc: "/videos/sol-video-gen.mp4",

  // -- Problem Section --
  problem: {
    heading:
      "Why Do Video Generation Models Need Human Preference Data?",
    sections: [
      {
        heading:
          "Why Do Video Generation Models Need Human Preference Data?",
        content:
          "Video generation models need human preference data because automated quality metrics — FVD, FID, CLIP score — correlate poorly with how humans actually perceive video quality. A video can score well on FID while containing physically impossible motion, or match a CLIP embedding while boring the viewer. The VideoReward framework demonstrated this gap explicitly: by collecting 182,000 human preference annotations across 12 video generation models, researchers built a reward model that outperformed automated metrics on predicting human quality judgments. The key finding was that preference data needed to span multiple evaluation dimensions — visual quality, motion quality, temporal consistency, and text-video alignment — because collapsing these into a single score produces reward models that optimize for the wrong features.\n\nThe practical implication is that RLHF for video generation is data-hungry in a way that text RLHF is not. Text preference pairs can be evaluated in seconds; video preference pairs require watching two clips, comparing them on multiple axes, and making a judgment that accounts for temporal dynamics that do not exist in static content. VideoReward's Flow-DPO training approach showed that preference-aligned fine-tuning measurably improved generation quality, but the 182,000-annotation dataset was collected across just 12 models — a fraction of the configuration space that production labs explore.",
        citationIds: ["videoreward-2025"],
      },
      {
        heading:
          "What Are the Limitations of Existing Video Datasets?",
        content:
          "Existing video-text datasets were built for training, not evaluation — and the difference matters for RLHF. VidGen-1M compiled 1 million video-text pairs, but the paper itself noted that captions in existing datasets average fewer than 15 words, insufficient to capture the spatial, temporal, and stylistic detail that preference evaluation requires. The dataset addressed this with longer, more detailed captions, but it was designed for generation training (input data), not preference annotation (output evaluation). GenAI-Bench provides 1,600 compositional text-to-visual prompts with human ratings, but its scale is too small for reward model training and it covers only text-to-image and text-to-video without addressing image-to-video or video-to-video workflows. VidProM offers 6.69 million unique text-to-video prompts scraped from public usage, but prompts are not preferences — knowing what users asked for does not tell you which outputs they preferred.\n\nThe gap is structural: labs building video generation models need preference annotations on their own model outputs across their specific configuration space, evaluated on dimensions calibrated to their quality priorities. Off-the-shelf datasets cannot provide this because the preference signal must match the model's actual output distribution to be useful for RLHF training.",
        citationIds: ["vidgen1m-2024", "videoreward-2025"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do Existing Video Evaluation Datasets Compare?",
    description:
      "Public video evaluation datasets range from small benchmark sets to million-scale collections, but none provide the combination of scale, multi-dimensional preference annotations, and model-specific evaluation that RLHF for video generation requires. The comparison below illustrates why labs building frontier video models need custom preference data rather than off-the-shelf benchmarks.",
    datasets: [
      {
        name: "GenAI-Bench",
        scale: "1,600 prompts",
        tasks: "Compositional text-to-visual generation evaluation",
        environments: "Text-to-image, text-to-video",
        limitations:
          "Too small for reward model training; no per-dimension preference scoring; covers only T2I and T2V modalities",
        isClaru: false,
      },
      {
        name: "VidProM",
        scale: "6.69M prompts",
        tasks: "Prompt distribution analysis for video generation",
        environments: "Text-to-video prompt collection",
        limitations:
          "Prompts only, no preference annotations; no quality assessments; reflects user demand, not model quality",
        isClaru: false,
      },
      {
        name: "VidGen-1M",
        scale: "1M video-text pairs",
        tasks: "Video generation training with detailed captions",
        environments: "Diverse video categories with temporal descriptions",
        limitations:
          "Designed for generation training, not preference evaluation; no pairwise comparisons or quality scores; captions describe content, not quality",
        isClaru: false,
      },
      {
        name: "Claru Expert Preference Annotation",
        scale: "976K+ assessments delivered in a single program",
        tasks: "Multi-dimensional quality assessment, ELO-based model ranking, RLHF preference pairs, content classification",
        environments: "T2V, I2V, V2V across cinematic, street-level, and curated video",
        limitations:
          "Requires 2-3 week annotator calibration ramp-up per new evaluation framework; cost scales with annotation dimensions",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Deliver Preference Data for Video Generation RLHF?",
    sections: [
      {
        heading:
          "How Does Claru Evaluate Video Generation Models Across Configurations?",
        content:
          "Claru designed and executed a rigorous ELO-based human evaluation framework to rank 51 video generation model configurations across text-to-video, image-to-video, and video-to-video modalities. The evaluation began with a pilot study testing 6 candidate evaluation metrics with calibrated annotators — only the 2 metrics achieving Krippendorff's alpha above 0.70 (overall quality and prompt adherence) were retained for the main evaluation, preventing the full study from producing noisy rankings on unreliable dimensions.\n\nThe main evaluation used Swiss-style tournament pairing across 120 prompts and approximately 6,000 generated videos, producing 39,000 pairwise human evaluations. Swiss-style pairing matches similarly ranked models in each round, maximizing information gained per comparison and converging on stable rankings faster than random or round-robin pairing. A fixed baseline model anchored the ELO scale across 6 tournament rounds to prevent rating drift. Final rankings included 95% confidence intervals computed via bootstrap resampling with 10,000 iterations. Claru maintained separate ELO rankings per input modality, enabling the client to deploy the top-ranked configuration per workflow rather than selecting a single compromise model.",
        citationIds: ["videoreward-2025"],
      },
      {
        heading:
          "How Does Claru Scale Multi-Dimensional Video Quality Annotation?",
        content:
          "For RLHF training data at scale, Claru delivered 976,000+ human quality assessments for a frontier video generation lab. Each annotation evaluated 4 dimensions — motion quality, visual fidelity, viewer interest, and text-to-video alignment — across licensed cinematic footage, street-level captures, and curated video libraries. The four-dimensional scoring enabled the lab to train separate reward models per quality axis, so the system could optimize motion quality without degrading visual fidelity, or improve prompt adherence without sacrificing viewer interest.\n\nAnnotators were calibrated through a qualification pipeline requiring 85%+ agreement with expert gold-standard annotations across all 4 dimensions before entering the production pool. Inter-rater agreement was monitored continuously using Krippendorff's alpha, with automatic flagging when agreement dropped below threshold on any dimension. Weekly delivery batches were formatted for direct ingestion into the lab's RLHF training pipeline with per-dimension scores, annotator confidence indicators, and source metadata. In a parallel content classification engagement, Claru annotated 105,000 video clips in 7 days with zero downstream rework — rapidly redesigning the annotation framework mid-project when inter-annotator disagreement exceeded 15% in the first 2,000 annotations, replacing abstract category definitions with criteria-driven decision paths and automated confidence tiers.",
        citationIds: ["vidgen1m-2024"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [
    "video-model-evaluation",
    "video-quality-at-scale",
    "video-content-classification",
  ],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "How many preference annotations does video generation RLHF require?",
      answer:
        "Reward models for video generation typically need six-figure preference annotation volumes to generalize across content types and failure modes. The VideoReward benchmark used 182,000 annotations across 12 models as a research baseline. In production, Claru has delivered 976,000+ multi-dimensional quality assessments for a single frontier lab — enough to train separate reward models per quality axis (motion, fidelity, viewer interest, text alignment) without distribution gaps that cause reward hacking.",
    },
    {
      question:
        "What evaluation dimensions matter for video generation quality?",
      answer:
        "Four dimensions capture the primary axes along which video quality varies: motion quality (temporal coherence, physics plausibility, artifact severity), visual fidelity (resolution consistency, lighting accuracy, texture detail), viewer interest (whether the video holds attention), and text-to-video alignment (how faithfully output matches the input prompt). Collapsing these into a single score produces reward models that optimize for the wrong features. Claru's pilot studies validate which dimensions achieve reliable inter-annotator agreement before scaling.",
    },
    {
      question:
        "Why can't automated metrics replace human preference data for video RLHF?",
      answer:
        "Automated metrics like FVD, FID, and CLIP score correlate poorly with human perception of video quality. A video can score well on FID while containing physically impossible motion, or match a CLIP embedding while being visually boring. VideoReward demonstrated that reward models trained on 182,000 human preference annotations outperformed automated metrics on predicting human quality judgments. RLHF requires human signal because the optimization target is human preference, not metric performance.",
    },
    {
      question:
        "How does Claru ensure annotation consistency at scale?",
      answer:
        "Claru uses a multi-layer calibration system: annotators must exceed 85% agreement with expert gold-standard annotations on a qualification pipeline before entering production. In production, calibration sets — pre-labeled items with known ground truth — are seeded at a 5% rate, and inter-rater agreement is tracked continuously via Krippendorff's alpha. Annotators falling below threshold on any dimension are flagged for immediate retraining. This system maintained 92%+ calibration agreement across 241,000+ safety annotations and 976,000+ quality assessments.",
    },
    {
      question:
        "Can Claru evaluate video models across different input modalities?",
      answer:
        "Yes. Claru maintains separate evaluation frameworks for text-to-video, image-to-video, and video-to-video workflows. In one engagement, Claru ranked 51 model configurations across all 3 modalities using 39,000 pairwise evaluations with ELO-based scoring and Swiss-style tournament pairing. Separate per-modality rankings enabled the client to deploy the best configuration for each workflow rather than selecting a single compromise model.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "videoreward-2025",
      title: "Improving Video Generation with Human Feedback",
      authors: "Liu et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2501.13918",
      keyClaim:
        "Introduced VideoReward, a multi-dimensional video reward model trained on large-scale human preference annotations; Flow-DPO preference-aligned fine-tuning measurably improved generation quality over automated metrics.",
    },
    {
      id: "vidgen1m-2024",
      title: "VidGen-1M: A Large-Scale Dataset for Text-to-Video Generation",
      authors: "Tan et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2408.02629",
      keyClaim:
        "Compiled 1 million video-text pairs with detailed captions; found that captions in existing datasets average fewer than 15 words, insufficient for temporal and compositional understanding required by video generation models.",
    },
    {
      id: "flow-dpo-2025",
      title: "Improving Video Generation with Human Feedback (Flow-DPO)",
      authors: "Liu et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2501.13918",
      keyClaim:
        "Flow-DPO, introduced in the same paper as VideoReward, adapts Direct Preference Optimization for flow-matching video models and demonstrates superior alignment performance compared to supervised fine-tuning and Flow-RWR.",
    },
    {
      id: "genai-bench-2024",
      title: "GenAI-Bench: Evaluating and Improving Compositional Text-to-Visual Generation",
      authors: "Lin et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2406.13743",
      keyClaim:
        "Provides 1,600 compositional text-to-visual prompts with human ratings, establishing a benchmark for compositional generation evaluation across text-to-image and text-to-video.",
    },
    {
      id: "vidprom-2024",
      title: "VidProM: A Million-scale Real Prompt-Gallery Dataset for Text-to-Video Diffusion Models",
      authors: "Wang et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2403.06098",
      keyClaim:
        "Collected 6.69 million unique text-to-video prompts from real user interactions, revealing the distribution gap between research prompts and production usage patterns.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/enrich/video-annotation"],

  // -- Related Content Pages --
  relatedSlugs: [
    "expert-rlhf-annotation",
    "red-teaming-data",
    "egocentric-video-data",
  ],
};

export default videoGenerationTrainingData;
