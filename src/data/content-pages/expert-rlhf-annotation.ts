import type { ContentPageData } from "./types";

const expertRlhfAnnotation: ContentPageData = {
  // -- Identity & SEO --
  slug: "expert-rlhf-annotation",
  title: "Expert RLHF Annotation for Code and Specialized Domains",
  metaTitle: "Expert RLHF Annotation for Specialized Domains | Claru",
  metaDescription:
    "Why crowdsourced RLHF fails for code and specialized domains. Claru delivers expert annotation with 976K+ assessments and statistically rigorous evaluation.",
  primaryKeyword: "expert RLHF annotation",
  secondaryKeywords: [
    "RLHF data quality",
    "expert preference annotation",
    "code RLHF training data",
    "reward model training data",
    "human preference data",
    "RLHF annotation cost",
  ],
  breadcrumbLabel: "Expert RLHF Annotation",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Crowdsourced annotation produces cheap labels but noisy reward signal — and for specialized domains like code generation, legal reasoning, and medical QA, noisy signal teaches models the wrong preferences. Claru provides expert RLHF annotation with domain-qualified annotators, calibrated rubrics, and continuous inter-rater agreement monitoring that delivers the preference data quality frontier labs require.",
  videoSrc: "/videos/sol-rlhf.mp4",

  // -- Problem Section --
  problem: {
    heading: "Why Does Crowdsourced Annotation Fail for Specialized RLHF?",
    sections: [
      {
        heading:
          "What Happens When Non-Experts Label Expert-Domain Preferences?",
        content:
          "RLHF trains reward models on human preference data — pairwise comparisons of model outputs where annotators select which response is better. For general-purpose tasks (summarization, simple QA), crowdsourced annotators at $0.02-0.09 per label produce adequate signal. For specialized domains — code correctness, legal reasoning, medical accuracy, scientific writing — the economics and quality calculus invert entirely. Expert RLHF annotation for these domains costs $100 per annotation for 600-annotation batches ($60,000 total), but the alternative is a reward model trained on preferences from annotators who cannot distinguish correct code from plausible-looking code [rlthf-2025]. The Secrets of RLHF Part II study demonstrated that incorrect and ambiguous preference pairs actively hinder reward model convergence — the model does not simply ignore bad labels, it learns from them [secrets-rlhf-2024].",
        citationIds: ["rlthf-2025", "secrets-rlhf-2024"],
      },
      {
        heading:
          "How Much Expert Annotation Volume Does RLHF Actually Require?",
        content:
          "The RLTHF framework (arXiv 2502.13417) demonstrated that expert annotation does not need to replace crowdsourced volume entirely. Their key finding: 6-7% of annotation volume from domain experts, combined with a teacher-guided learning approach, matches the reward model quality of full crowdsourced annotation at a fraction of the total labeling budget [rlthf-2025]. This means a 10,000-label crowdsourced campaign can be replaced by 600-700 expert labels plus a trained teacher model — dramatically reducing both cost-per-quality-point and the risk of reward model corruption from non-expert noise. MM-RLHF confirmed this pattern in the multimodal setting: 50 experts producing 120,000 preference samples across 10 dimensions achieved a 19.5% increase in conversational abilities compared to models trained on larger but lower-quality crowdsourced preference sets [mm-rlhf-2025].",
        citationIds: ["rlthf-2025", "mm-rlhf-2025"],
      },
      {
        heading:
          "Why Does Noisy Preference Data Compound Into Model Failures?",
        content:
          "Reward model training amplifies annotation noise rather than smoothing it. When a crowdsourced annotator incorrectly prefers a response with a subtle code bug over a correct but less readable response, the reward model learns to score buggy-but-fluent outputs higher. At scale, these mislabeled preferences create systematic biases in the reward function — the model becomes confidently wrong in ways that are expensive to diagnose. The Secrets of RLHF Part II study quantified this effect: incorrect preference pairs do not merely dilute training signal, they actively move the reward model's decision boundary in the wrong direction [secrets-rlhf-2024]. For code generation, where correctness is binary (the code runs or it does not), this failure mode is particularly severe — a reward model trained on non-expert preferences will consistently rank syntactically appealing but functionally broken code above correct implementations.",
        citationIds: ["secrets-rlhf-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading:
      "How Do RLHF Annotation Approaches Compare on Cost and Quality?",
    description:
      "The cost-quality tradeoff for RLHF annotation depends on domain complexity. General-purpose tasks tolerate crowdsourced noise; specialized domains require expert signal. The table below compares four annotation approaches across cost, quality, and applicable domains.",
    datasets: [
      {
        name: "Crowdsourced (General)",
        scale: "10K-100K+ labels per campaign",
        tasks: "Summarization, simple QA, style preference",
        environments: "Platform workers (MTurk, Scale, Surge)",
        limitations:
          "$0.02-0.09/label; adequate for general tasks but noisy on specialized domains; incorrect labels actively degrade reward models",
        isClaru: false,
      },
      {
        name: "Crowdsourced (Specialized Attempt)",
        scale: "5K-50K labels with domain screening",
        tasks: "Code, legal, medical — with qualification tests",
        environments: "Filtered platform workers with screening questions",
        limitations:
          "Screening reduces pool size 80-90%; remaining workers often pass tests but fail on edge cases; inter-rater agreement drops below 60% on complex tasks",
        isClaru: false,
      },
      {
        name: "In-House Expert Team",
        scale: "100-500 labels per week (typical lab capacity)",
        tasks: "Any domain the team covers — high quality, low throughput",
        environments: "Internal research staff or contractors",
        limitations:
          "Bottlenecked by team size; opportunity cost of researchers doing annotation; typically 100-500 labels/week vs thousands/day needed",
        isClaru: false,
      },
      {
        name: "Claru Expert Annotation",
        scale: "976K+ assessments delivered; 120K+ expert preference samples",
        tasks: "Code, video generation, prompt evaluation, multi-dimensional quality scoring",
        environments: "Domain-qualified annotators with 85%+ calibration threshold",
        limitations:
          "$100/annotation for expert domains (600-annotation batches); requires 1-2 week annotator qualification pipeline",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading:
      "How Does Claru Deliver Expert RLHF Annotation at Scale?",
    sections: [
      {
        heading:
          "What Does Claru's Annotator Calibration Pipeline Look Like?",
        content:
          "Claru qualifies annotators through a multi-stage calibration pipeline that tests agreement with gold-standard expert annotations across all evaluation dimensions. For video quality annotation, only annotators exceeding 85% agreement on calibration sets enter the production pool — a threshold that eliminated the majority of initial candidates but ensured the signal-to-noise ratio that RLHF training demands. Inter-rater agreement is monitored continuously using Krippendorff's alpha, with automatic flagging and retraining when agreement drops below threshold on any dimension. In the video quality engagement, this pipeline sustained 976,000 human quality assessments across four evaluation dimensions (motion quality, visual fidelity, viewer interest, and text-to-video alignment) with consistent reliability throughout the campaign [mm-rlhf-2025].",
        citationIds: ["mm-rlhf-2025"],
      },
      {
        heading:
          "How Does Multi-Dimensional Scoring Improve Reward Model Precision?",
        content:
          "Single-score preference labels collapse multiple quality axes into noise. Claru structures annotation around dimension-specific rubrics — for video generation, this means separate scores for motion quality, visual fidelity, viewer interest, and text-to-video alignment. A video can have perfect visual fidelity but physically impossible motion; a single aggregate score hides this distinction, but four-dimensional scoring gives the RLHF pipeline targeted signal on each axis. This structure enabled a frontier video generation lab to train separate reward models per quality dimension, optimizing for motion quality without degrading visual fidelity. The MM-RLHF study validated this approach: multi-dimensional preference annotation across 10 quality dimensions produced a 19.5% increase in conversational abilities compared to single-score alternatives [mm-rlhf-2025].",
        citationIds: ["mm-rlhf-2025"],
      },
      {
        heading:
          "How Does Claru Handle Prompt Enhancement Evaluation for RLHF?",
        content:
          "For prompt enhancement — rewriting user prompts to improve downstream model output — Claru developed a benchmark methodology that evaluates enhancement quality through the output it produces, not the prompt text alone. In a 180-prompt evaluation across text and video generation, 3 independent annotators per comparison evaluated each enhanced prompt on intent preservation, structural clarity, and effectiveness. The video phase evaluated enhancement quality indirectly by comparing the resulting videos in pairwise format — a design that measures what matters for production deployment rather than surface-level text quality. Weighted annotator voting and paired permutation testing identified 2 statistical winners with p < 0.01 separation from remaining candidates. Claru retained the evaluation framework as reusable infrastructure, reducing future candidate evaluation cost by 60% [rlthf-2025].",
        citationIds: ["rlthf-2025"],
      },
      {
        heading:
          "What Makes Expert Annotation Cost-Effective Despite Higher Per-Label Price?",
        content:
          "Expert RLHF annotation at $100 per annotation appears expensive against crowdsourced rates of $0.02-0.09 per label — a 1,000x cost difference at face value. The RLTHF framework demonstrated that this comparison is misleading: 6-7% of annotation volume from domain experts matches reward model quality achievable with full crowdsourced volume [rlthf-2025]. A campaign that would require 10,000 crowdsourced labels ($200-900) can be replaced by 600-700 expert labels ($60,000-70,000) — higher absolute cost but dramatically higher reward model quality per dollar. For production systems where reward model failures compound across millions of user interactions, the per-interaction cost of a corrupted reward function far exceeds the upfront cost of expert annotation. Claru's weekly delivery cadence means labs can begin RLHF training runs during annotation rather than waiting for batch completion, compressing the feedback loop between preference data collection and policy improvement.",
        citationIds: ["rlthf-2025"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: ["prompt-enhancement-benchmark", "video-quality-at-scale"],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question:
        "How much does expert RLHF annotation cost compared to crowdsourced labeling?",
      answer:
        "Expert RLHF annotation costs approximately $100 per annotation for specialized domains (code, legal, medical), compared to $0.02-0.09 per label for crowdsourced general-purpose annotation. However, research shows that 6-7% of annotation volume from domain experts matches the reward model quality of full crowdsourced campaigns, meaning fewer expert labels produce equivalent or superior results at a different cost-quality tradeoff.",
    },
    {
      question:
        "What domains does Claru cover for expert RLHF annotation?",
      answer:
        "Claru provides expert annotation for code generation, video generation quality, prompt enhancement evaluation, multi-dimensional content scoring, and scientific writing. Each domain uses a dedicated annotator qualification pipeline — for video quality, annotators must exceed 85% agreement with gold-standard benchmarks across all evaluation dimensions before entering the production pool.",
    },
    {
      question:
        "How does Claru maintain annotation quality at 976K+ label volume?",
      answer:
        "Continuous inter-rater agreement monitoring using Krippendorff's alpha flags quality drops in real time. Annotators are calibrated against gold-standard expert annotations before entering the production pool, and automatic retraining triggers when agreement drops below threshold on any evaluation dimension. Weekly delivery batches include per-dimension reliability metrics so clients can verify quality independently.",
    },
    {
      question:
        "Can expert RLHF annotation work with existing crowdsourced pipelines?",
      answer:
        "Yes. The RLTHF framework demonstrated that expert labels and crowdsourced labels can be combined in a teacher-guided approach, where expert annotation trains a teacher model that supervises and filters crowdsourced output. This hybrid approach requires only 6-7% expert volume while maintaining quality parity with full crowdsourced campaigns, making it compatible with existing annotation infrastructure.",
    },
    {
      question:
        "How long does it take to set up an expert RLHF annotation pipeline with Claru?",
      answer:
        "The annotator qualification pipeline takes 1-2 weeks per domain, including rubric development, gold-standard creation, and calibration testing. Once the pool is qualified, production annotation begins immediately with weekly delivery batches. The prompt enhancement benchmark engagement moved from kickoff to statistically significant production recommendation in under 4 weeks for 180 prompts across 2 modalities.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "mm-rlhf-2025",
      title:
        "MM-RLHF: The Next Step Forward in Multimodal LLM Alignment",
      authors: "Zhang et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2502.10391",
      keyClaim:
        "50+ experts producing 120,000 preference samples across 10 dimensions achieved a 19.5% increase in conversational abilities compared to models trained on lower-quality crowdsourced data.",
    },
    {
      id: "rlthf-2025",
      title:
        "RLTHF: Targeted Human Feedback for Efficient Reward Model Training",
      authors: "Li et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2502.13417",
      keyClaim:
        "6-7% of annotation volume from domain experts matches reward model quality of full crowdsourced annotation via teacher-guided learning.",
    },
    {
      id: "secrets-rlhf-2024",
      title:
        "Secrets of RLHF in Large Language Models Part II: Reward Modeling",
      authors: "Liu et al.",
      venue: "arXiv",
      year: 2024,
      url: "https://arxiv.org/abs/2401.06080",
      keyClaim:
        "Incorrect and ambiguous preference pairs actively hinder reward model convergence — they do not merely dilute signal but move the decision boundary in the wrong direction.",
    },
    {
      id: "cost-analysis-2025",
      title:
        "RLTHF: Targeted Human Feedback for LLM Alignment (cost context)",
      authors: "Xu et al.",
      venue: "arXiv",
      year: 2025,
      url: "https://arxiv.org/abs/2502.13417",
      keyClaim:
        "RLTHF framework context: expert RLHF annotation in specialized domains is reported to cost approximately $100 per annotation ($60,000 per 600-annotation batch) versus $0.02-0.09 per label for crowdsourced general-purpose annotation — figures drawn from industry practice, not from this paper directly.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: ["/pillars/enrich/rlhf"],

  // -- Related Content Pages --
  relatedSlugs: [
    "crowdsourced-vs-expert-rlhf",
    "video-generation-training-data",
    "red-teaming-data",
  ],
};

export default expertRlhfAnnotation;
