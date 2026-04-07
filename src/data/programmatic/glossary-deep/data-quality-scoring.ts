import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "data-quality-scoring",
  termSlug: "data-quality-scoring",
  category: "data-quality-pipelines",
  metaTitle: "Data Quality Scoring — Definition & Training Data | Claru",
  metaDescription: "Data quality scoring assigns numeric ratings to training samples based on accuracy, completeness, consistency, and relevance. Learn scoring methods, thresholds, and impact on model training.",
  primaryKeyword: "data quality scoring",
  secondaryKeywords: ["dataset quality metrics", "data quality assessment", "training data quality", "annotation quality score", "data curation metrics", "sample quality filter"],
  canonicalPath: "/glossary/data-quality-scoring",
  h1: "Data Quality Scoring: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Data quality scoring assigns numeric ratings to individual training samples and entire datasets, measuring accuracy, completeness, consistency, and relevance. This page covers scoring dimensions, automated quality models, threshold calibration, and the quantified relationship between data quality and model performance in robotics.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Data Quality Scoring", href: "/glossary/data-quality-scoring" },
  ],
  sections: [],
  faqs: [
    {
      question: "What dimensions does data quality scoring measure?",
      answer: "Data quality scoring covers five core dimensions. Accuracy measures whether annotations are correct — are bounding boxes tightly aligned, are class labels right, are temporal boundaries precise? Completeness measures whether all required annotations are present — are any objects unlabeled, any frames unannotated, any metadata fields missing? Consistency measures agreement across the dataset — do similar scenes receive similar annotations, are labeling conventions followed uniformly? Relevance measures whether the sample provides useful training signal for the target task — does the scene contain the right objects, actions, and conditions? Visual quality measures technical capture properties — resolution, focus, exposure, motion blur, compression artifacts. Each dimension receives a score, and a composite quality score weights them according to their importance for the specific downstream model.",
    },
    {
      question: "How does data quality affect robot learning model performance?",
      answer: "The impact is large and well-documented. Google's RT-1 paper showed that filtering the bottom 20% of demonstrations by quality metrics improved task success rate by 15 percentage points — from 62% to 77% — without adding any new data. The intuition is straightforward: low-quality demonstrations teach the robot suboptimal behaviors. A teleoperation demonstration with erratic motions, excessive pauses, or task failures injects noise into the policy gradient, requiring more high-quality data to overcome the bad signal. Industry experience across multiple robotics companies confirms that training on the best 80% of data by quality score consistently outperforms training on 100% of data including low-quality outliers.",
    },
    {
      question: "Can data quality scoring be fully automated?",
      answer: "Many quality dimensions can be automated with high reliability. Visual quality (blur, exposure, noise) is fully automatable using signal processing metrics like Laplacian variance for blur and histogram analysis for exposure. Completeness checking (missing fields, unlabeled objects) is fully automatable through schema validation. Annotation consistency can be partially automated by measuring variance across similar samples. However, accuracy verification — whether an annotation is actually correct — ultimately requires human judgment for ambiguous cases. The best approach is automated scoring for all automatable dimensions, followed by human review of samples that fall in ambiguous score ranges (typically the 20th-40th percentile), and automated acceptance of clearly high-quality samples (above 80th percentile) and rejection of clearly low-quality ones (below 20th percentile).",
    },
    {
      question: "What quality score threshold should you use for training data filtering?",
      answer: "The optimal threshold depends on dataset size and model capacity. For large datasets (100,000+ samples), aggressive filtering to the top 70-80% by quality score typically improves model performance. For smaller datasets (under 10,000 samples), filtering must be gentler (top 90-95%) because the model needs volume to learn the task distribution. The correct approach is to train models at multiple quality thresholds — 100%, 90%, 80%, 70% — on a validation set and select the threshold that maximizes task performance. In practice, the curve has a characteristic shape: performance improves as low-quality data is removed, peaks at an intermediate threshold, then degrades as too much data is discarded and the model underfits.",
    },
    {
      question: "How do you score quality for multi-modal robotics data?",
      answer: "Multi-modal quality scoring requires evaluating each modality independently and then computing cross-modal consistency. For a teleoperation demonstration with RGB video, depth, action commands, and language instruction, the scoring pipeline checks: RGB quality (blur, exposure, occlusion), depth quality (completeness, noise level, alignment with RGB), action quality (smoothness, physical plausibility, task completion), and language quality (grammatical correctness, specificity, accuracy relative to the observed action). Cross-modal scores verify that the language instruction describes what actually happens in the video, that the depth map is geometrically consistent with the RGB scene, and that action timestamps align with visual events. A sample with high individual modality scores but low cross-modal consistency (e.g., the caption says 'pick up cup' but the video shows placing a cup) should be flagged for review.",
    },
  ],
  ctaHeading: "Need Quality-Scored Training Data?",
  ctaDescription: "Claru delivers datasets with per-sample quality scores across visual, annotation, and cross-modal dimensions — so you can train on your quality threshold without manual review.",
  relatedGlossaryTerms: ["inter-annotator-agreement", "data-enrichment", "data-deduplication", "active-learning"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality"],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `Data quality scoring is the systematic assignment of numeric ratings to individual training samples and aggregate datasets based on measurable properties that correlate with downstream model performance. Unlike binary quality filtering (keep or discard), scoring produces a continuous value for each sample across multiple dimensions, enabling fine-grained curation decisions: training on the top N% by quality, weighting samples by quality during training, or targeting quality improvement efforts on specific deficiency patterns.

The quality dimensions relevant to physical AI datasets span technical capture quality, annotation quality, and task-specific relevance. Technical quality covers properties of the raw sensor data: image resolution and focus, video frame rate stability, depth sensor completeness (percentage of pixels with valid depth readings), audio signal-to-noise ratio, and motion blur magnitude. These can be measured automatically using signal processing algorithms. Annotation quality covers the accuracy, consistency, and completeness of human or model-generated labels: bounding box tightness (measured by IoU against expert references), class label correctness, temporal boundary precision, and inter-annotator agreement on ambiguous samples. Task relevance covers how useful the sample is for the specific model being trained: does the demonstration complete the target task, does the scene contain the target object categories, is the behavior shown representative of the deployment distribution?

The theoretical basis for quality scoring derives from the observation that training data is not uniformly valuable. In supervised learning, noisy labels degrade the loss landscape: incorrect labels create spurious gradients that push the model away from optimal parameters. In imitation learning for robotics, suboptimal demonstrations teach suboptimal behaviors: a teleoperation demonstration where the operator pauses, backtracks, or uses an inefficient grasp strategy injects noise into the cloned policy. Quality scoring identifies these problematic samples so they can be downweighted or removed before their noise compounds during training.

The practical impact of quality-based filtering is substantial and consistent across domains. Studies on the C4 text corpus showed that quality filtering by a classifier improved language model perplexity by 5-10%. Studies on LAION image-text data showed that CLIP-score-based filtering improved FID scores by 15-30% while using 50-70% less data. In robotics, the RT-1 project at Google showed that filtering demonstrations by quality metrics improved manipulation success rates by 15 percentage points. The pattern is universal: smaller, higher-quality datasets outperform larger, unfiltered datasets.`,

  historicalContext: `Quality scoring for training data has roots in the statistical concept of influential observations — data points that disproportionately affect model parameters. Cook's distance (1977) provided the first formal measure of sample influence in linear regression. In machine learning, the concept was extended through curriculum learning (Bengio et al., 2009), which proposed ordering training samples from easy to hard, implicitly requiring a difficulty or quality metric.

The modern era of data quality scoring began with CLIP-score filtering for image-text datasets. When the DALL-E and Stable Diffusion models were trained, researchers discovered that filtering web-crawled image-text pairs by the cosine similarity between their CLIP embeddings dramatically improved generation quality. The LAION-Aesthetics subset further refined this by training a quality predictor on human aesthetic ratings and using it to filter 5 billion images down to 600 million high-quality samples — a 88% reduction in data that improved model output quality.

For robotics data, quality scoring was formalized in Google's robot learning papers. The RT-1 project (Brohan et al., 2022) implemented quality metrics for teleoperation demonstrations: trajectory smoothness (measured by jerk — the derivative of acceleration), task completion rate, demonstration duration relative to expert baseline, and operator skill rating. Demonstrations that exceeded thresholds on these metrics were kept; others were discarded. This simple quality gate produced a 15-point improvement in task success rate.

The DataComp benchmark (Gadre et al., 2023) systematized data quality evaluation by providing a fixed model architecture and variable datasets — the opposite of traditional benchmarks that fix the data and vary the model. DataComp showed that data curation strategy (filtering, scoring, and selection) matters as much as model architecture for downstream performance. The DCLM project (2024) extended this to language models, demonstrating that quality-scored data curation can match the performance of 10x larger unfiltered datasets.`,

  practicalImplications: `Implementing data quality scoring for a robotics dataset requires building a scoring pipeline that processes each sample through multiple quality assessors and produces a structured quality report.

For visual quality, use established image quality metrics: Laplacian variance for blur detection (threshold: variance below 100 indicates significant blur at 1080p resolution), histogram standard deviation for exposure quality, and BRISQUE or NIQE scores for overall perceptual quality. For video, additionally measure frame rate consistency, codec artifact severity, and temporal stability (detecting dropped frames or timestamp gaps). These technical quality scores can be computed automatically on every sample at ingestion time with negligible compute overhead.

For annotation quality, measure inter-annotator agreement on a randomly sampled subset. If two independent annotators produce bounding boxes with mean IoU below 0.75, the annotation protocol needs revision — either the instructions are ambiguous or the annotators need more training. For temporal annotations, measure boundary agreement in seconds: if annotators disagree on action start times by more than 0.5 seconds on average, the granularity may be too fine for consistent annotation. Track these quality metrics continuously during annotation campaigns, not just as a post-hoc audit.

For task relevance scoring, define a relevance model based on your deployment distribution. If your robot will operate in kitchens, a kitchen-relevance score could measure: number of task-relevant objects visible, lighting similarity to deployment environments, viewpoint similarity to the robot's camera configuration, and activity relevance to the target skill set. Samples that score low on relevance may be technically high-quality but useless for your specific model — a perfectly annotated video of outdoor sports provides no value for a kitchen manipulation model.

Claru assigns quality scores across all dimensions for every sample in our catalog. Each clip carries visual quality scores (blur, exposure, noise), annotation quality scores (confidence, consistency, completeness), and relevance scores keyed to common robotics task categories. Clients can filter the catalog by composite quality threshold, inspect quality distributions before ordering, and receive quality-score-stratified deliveries that enable training experiments at different quality levels.`,

  commonMisconceptions: [
    {
      misconception: "Higher quality scores always mean better training data — you should always train on only the highest-quality samples.",
      correction: "Extreme quality filtering can reduce diversity and cause overfitting to narrow conditions. The highest-quality demonstrations are often those from the most controlled environments with ideal lighting and simple object configurations — exactly the easy cases where the model already performs well. Training exclusively on perfect samples can produce a policy that fails on the slightly messy, slightly dark, slightly cluttered conditions it will encounter in deployment. The optimal approach includes high-quality samples for learning correct behaviors plus moderate-quality samples that represent realistic deployment conditions.",
    },
    {
      misconception: "Data quality can be determined by a single score — one number tells you everything about a sample's usefulness.",
      correction: "A single composite score hides critical information. A sample might have perfect visual quality but incorrect annotations (high technical score, low annotation score). Another might have noisy video but correct, valuable annotations of a rare edge case. Effective quality management requires per-dimension scores that allow independent filtering on each axis. Some models are robust to visual noise but sensitive to annotation errors; others tolerate label noise but need crisp imagery. The quality scoring system must expose these dimensions separately.",
    },
    {
      misconception: "Quality scoring is a one-time preprocessing step — score the data once and use the scores forever.",
      correction: "Quality scores are model-relative: what constitutes high quality depends on the downstream model and task. A demonstration scored as low-quality for a single-task policy (because the robot also performed an unrelated secondary action) might be high-quality for a multi-task policy that needs to learn both actions. When the target model changes, quality scores should be re-evaluated against the new model's requirements. Additionally, quality scoring models themselves improve over time — re-scoring with better quality predictors can uncover previously undetected quality issues.",
    },
  ],

  keyPapers: [
    {
      id: "gadre-datacomp-2023",
      title: "DataComp: In search of the next generation of multimodal datasets",
      authors: "Gadre et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.14108",
    },
    {
      id: "brohan-rt1-2022",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "bengio-curriculum-2009",
      title: "Curriculum Learning",
      authors: "Bengio et al.",
      venue: "ICML 2009",
      year: 2009,
      url: "https://dl.acm.org/doi/10.1145/1553374.1553380",
    },
    {
      id: "li-dclm-2024",
      title: "DataComp-LM: In search of the next generation of training sets for language models",
      authors: "Li et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.11794",
    },
    {
      id: "schuhmann-laion-aesthetics-2022",
      title: "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models",
      authors: "Schuhmann et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2210.08402",
    },
  ],

  claruRelevance: `Data quality scoring is embedded in every Claru data pipeline. Every clip in our catalog carries per-sample quality scores across visual, annotation, and relevance dimensions. Clients can filter by composite quality threshold, inspect quality distributions before purchasing, and receive stratified deliveries for training experiments at different quality levels.

Our quality scoring system is calibrated against downstream model performance: we periodically train reference models at different quality thresholds and measure the correlation between our quality scores and model success rates. This empirical calibration ensures that our scores predict actual training utility rather than just technical properties. For custom data collection projects, quality monitoring runs in real-time during the collection campaign, flagging low-quality submissions for re-collection before they enter the final dataset — preventing quality debt from accumulating.`,
};

export default data;
