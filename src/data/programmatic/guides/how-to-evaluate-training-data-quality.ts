import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-evaluate-training-data-quality",
  metaTitle: "How to Evaluate Training Data Quality (2026 Guide) | Claru",
  metaDescription: "A systematic guide to evaluating robot training data quality. Covers quality metrics, automated validation, statistical analysis, and remediation strategies.",
  primaryKeyword: "how to evaluate training data quality",
  secondaryKeywords: ["robot data quality metrics", "training data validation", "data quality assessment", "robot dataset evaluation"],
  canonicalPath: "/guides/how-to-evaluate-training-data-quality",
  h1: "How to Evaluate Training Data Quality for Robot Learning",
  heroSubtitle: "A systematic guide to measuring and improving the quality of robot training datasets. Covers per-episode quality metrics (synchronization, smoothness, completeness), dataset-level analysis (diversity, balance, coverage), and statistical methods for identifying and remediating quality issues before they degrade policy performance.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Evaluate Training Data Quality", href: "/guides/how-to-evaluate-training-data-quality" },
  ],
  sections: [
    {
      type: "prose",
      heading: "The Hidden Cost of Skipping Data Quality Evaluation",
      paragraphs: [
        "Teams that skip systematic data quality evaluation pay the price in debugging time. When a trained policy fails in deployment, the first instinct is to blame the model architecture or hyperparameters. But in the majority of cases the Mandlekar et al. robomimic study examined, the root cause was data quality: desynchronized observations and actions, mislabeled success episodes, or biased collection that covered only a fraction of the deployment space. A single day spent on data quality evaluation before training saves a week of fruitless architecture search afterward.",
        "Data quality evaluation for robotics is fundamentally different from evaluation for NLP or computer vision datasets. In NLP, a mislabeled sentiment example is diluted by millions of correct examples. In robotics, a dataset of 5,000 demonstrations where 500 have subtle synchronization errors teaches the policy to hesitate and oscillate \u2014 the noisy gradient signal from desynchronized examples counteracts the clean signal from synchronized ones. The smaller the dataset, the more each bad example matters. At 1,000 episodes, filtering the worst 10% by quality score improves Diffusion Policy success rates by 25-30% with zero additional data collection.",
      ],
    },
    {
      type: "prose",
      heading: "Common Quality Issues and Their Impact on Policy Training",
      paragraphs: [
        "Different quality issues have different impacts on trained policy performance. Temporal desynchronization (camera-action misalignment) is the most damaging: even 50ms of drift causes the policy to learn incorrect visual-action associations, degrading success rates by 10-20% even when other quality metrics are perfect. Action clipping (hitting joint limits) is the second most impactful: it creates flat action regions in the training data that teach the policy to stop moving at the workspace boundary. Image blur and exposure problems are less damaging for models with strong visual augmentation but still reduce performance by 3-8% in augmentation-free training.",
        "The relationship between quality issues and performance is non-linear. A dataset with 5% desynchronized episodes may show no measurable performance drop (the model is robust to occasional noise), while 15% causes a sudden cliff in success rate (the noise overwhelms the clean signal). This non-linear relationship means that setting quality thresholds requires empirical calibration: train models on the dataset with and without quality filtering at different thresholds (filter top 5%, 10%, 15%, 20%) and measure the performance curve. The optimal threshold is where further filtering reduces performance (loss of diversity) rather than improving it (removal of noise). For most manipulation datasets, this sweet spot is 10-15% filtering by composite quality score.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the most important quality metric for robot training data?",
      answer: "Temporal synchronization between observation and action streams. A 50ms misalignment between camera frames and action labels can reduce trained policy success rates by 10-20%. This is more impactful than action smoothness, diversity, or dataset size. Always verify synchronization first before investing in other quality improvements.",
    },
    {
      question: "How much data should I filter out for quality?",
      answer: "Typically 10-20% of demonstrations fail quality thresholds. Filtering the bottom 15% by a composite quality score (combining smoothness, synchronization, and task success metrics) consistently improves trained policy performance. Filtering more aggressively (>30%) risks losing valuable diversity. If more than 30% fails quality checks, the issue is in the collection pipeline, not the data — fix the pipeline and re-collect.",
    },
    {
      question: "Should failed demonstrations be included in the dataset?",
      answer: "Keep failed demonstrations labeled as failures but do not use them for standard behavioral cloning training. They are valuable for: training failure detection classifiers, serving as negative examples in contrastive learning, providing the 'rejected' member in RLHF preference pairs, and analyzing what went wrong to improve collection protocols. Label each failure with its failure mode (dropped object, missed grasp, collision, timeout).",
    },
    {
      question: "How do I compute a composite quality score for robot data?",
      answer: "Combine individual quality metrics into a single score using a weighted average. Recommended weights for manipulation data: temporal synchronization (0.25), trajectory smoothness (0.20), task success (0.20), image quality (0.15), duration efficiency (0.10), action distribution normality (0.10). Calibrate weights by ranking 50 episodes manually from best to worst, computing the composite score with different weight sets, and selecting the weights that produce the highest Spearman rank correlation with your manual ranking. Store the weight vector alongside the dataset so downstream users can understand and optionally re-weight the composite score for their specific model architecture.",
    },
    {
      question: "What is the relationship between data quality and dataset size?",
      answer: "Quality and quantity interact non-linearly. At small dataset sizes (under 500 episodes), quality dominates: 200 clean episodes outperform 500 episodes with 20% defects. At large dataset sizes (over 10,000 episodes), moderate noise is diluted and quantity starts to dominate. The crossover point depends on the model architecture and task complexity, but for typical behavioral cloning with Diffusion Policy, filtering the bottom 15% by quality score is optimal up to roughly 5,000 episodes. Beyond 5,000, filtering only the bottom 5% (severe defects only) preserves more diversity without measurable quality impact. The Mandlekar et al. robomimic paper provides the most detailed ablation of this quality-quantity tradeoff.",
    },
  ],
  ctaHeading: "Need Quality-Validated Training Data?",
  ctaDescription: "Every Claru dataset passes through automated quality validation with per-episode metrics and dataset-level statistical analysis.",
  relatedGlossaryTerms: ["data-quality-scoring", "inter-annotator-agreement", "manipulation-trajectory", "dataset-diversity", "data-deduplication"],
  relatedGuidePages: ["how-to-setup-data-quality-pipeline", "how-to-measure-inter-annotator-agreement"],
  relatedSolutionSlugs: ["data-quality-services"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: [
    "A robot training dataset (collected or received)",
    "Python with NumPy, pandas, matplotlib",
    "Understanding of the target model's input requirements",
  ],
  tools: ["Python", "NumPy", "pandas", "matplotlib", "scipy", "scikit-learn"],
  steps: [
    {
      stepNumber: 1,
      title: "Verify Data Integrity and Completeness",
      description: "Run structural validation on every episode in the dataset. Check that all expected fields exist (observations, actions, metadata), data types are correct (float32 for actions, uint8 for images), array shapes are consistent across episodes, and no files are corrupted or truncated. Compute a completeness score: percentage of expected data points that are actually present.\n\nFor each episode, verify: all camera streams have the expected number of frames (duration * fps), no frame indices are duplicated or missing, action labels have the same number of timesteps as the control frequency specifies, and all metadata fields (task description, robot config, camera calibration) are populated. Flag episodes with >2% missing frames for review. Generate a report listing episodes that fail integrity checks and the specific failures.",
      tools: ["Python", "h5py (for HDF5)", "tensorflow_datasets (for RLDS)"],
      tips: ["Run integrity checks immediately after data receipt, before any downstream processing.", "Common corruption sources: SSD write failures during collection, network transfer errors, incomplete file copies."],
    },
    {
      stepNumber: 2,
      title: "Measure Temporal Synchronization",
      description: "Verify that observation timestamps and action timestamps are properly aligned across all sensor streams. For each episode, compute the maximum timestamp drift between camera frames and action labels. Acceptable drift is <10ms for 10 Hz control and <5ms for 20 Hz control.\n\nMethod: Find the nearest action timestamp for each camera frame timestamp. Compute the absolute difference. If the median drift is >0 and consistent in sign, the streams have a systematic offset that can be corrected by shifting timestamps. If the drift is random and exceeds thresholds, the synchronization hardware failed for that episode. Visualize the drift distribution across the entire dataset to identify systematic versus episodic synchronization issues.",
      tools: ["NumPy", "matplotlib"],
      tips: ["Systematic clock drift (constant offset between streams) is fixable by timestamp correction. Random drift (jittery offsets) is not fixable and indicates hardware synchronization failure.", "Re-recording is cheaper than trying to fix severe synchronization issues post-collection."],
    },
    {
      stepNumber: 3,
      title: "Compute Per-Episode Quality Metrics",
      description: "Calculate quality metrics for each episode that correlate with trained policy performance. Key metrics:\n\n(1) Trajectory smoothness: compute the jerk (third derivative of position) of the end-effector trajectory. Lower jerk = smoother motion. Normalize by task duration.\n\n(2) Task success: binary label — did the episode achieve the task goal? This should be labeled during collection but can be partially verified automatically (e.g., did the gripper close on the object?).\n\n(3) Duration efficiency: ratio of episode duration to the median duration for that task. Values far from 1.0 indicate either rushing (potential quality issues) or excessive hesitation.\n\n(4) Action distribution normality: compute per-dimension histograms of actions. Flag episodes where the action distribution is multimodal or has outlier values beyond 3 standard deviations of the dataset mean.\n\n(5) Image quality: compute per-frame blur score (Laplacian variance), exposure score (histogram spread), and camera motion magnitude. Average across frames per episode.",
      tools: ["NumPy", "scipy", "OpenCV (for image quality)"],
      tips: ["Create a composite quality score by combining metrics with weights tuned to your task. Smoothness and synchronization typically deserve the highest weights.", "Plot quality metric distributions to set thresholds. Use the knee of the distribution rather than arbitrary cutoffs."],
    },
    {
      stepNumber: 4,
      title: "Analyze Dataset-Level Properties",
      description: "Evaluate the dataset as a whole for diversity, balance, and coverage. Key analyses:\n\n(1) Task distribution: are all task variations represented? Compute the number of episodes per task variation and flag underrepresented variations (<50 episodes).\n\n(2) Environment diversity: compute visual feature diversity using a pretrained encoder (CLIP or DINOv2). Extract features from a representative frame of each episode, run k-means clustering (k=20-50), and visualize the cluster distribution. Concentrated clusters indicate low visual diversity.\n\n(3) Action space coverage: visualize the 2D projections (PCA or t-SNE) of action sequences. Look for gaps in coverage that indicate missing task strategies.\n\n(4) Operator balance: compute quality metrics per operator. Flag operators whose mean quality is >1 standard deviation below the dataset mean — their data may need additional filtering.\n\n(5) Near-duplicate detection: compute pairwise cosine similarity between episode embeddings. Flag pairs with similarity >0.95 as potential near-duplicates for review.",
      tools: ["scikit-learn", "matplotlib", "CLIP/DINOv2 (for visual features)"],
      tips: ["Diversity gaps are more damaging than quality issues. A perfectly smooth dataset that only covers 3 of 10 intended task variations will produce a policy that fails on the other 7.", "Visual clustering can reveal collection biases invisible in metadata (e.g., all episodes collected during morning lighting)."],
    },
    {
      stepNumber: 5,
      title: "Generate a Quality Report and Remediation Plan",
      description: "Compile all quality findings into a structured report and create an actionable remediation plan. The report should include: dataset overview (size, task breakdown, duration statistics), per-episode quality metric distributions with pass/fail counts, dataset-level diversity analysis with identified gaps, synchronization analysis results, and a ranked list of quality issues by severity.\n\nThe remediation plan prioritizes issues by impact on trained policy performance. Critical issues (synchronization failures, corrupted data) require episode removal or re-collection. Major issues (quality metric outliers, missing task variations) require targeted re-collection to fill gaps. Minor issues (slightly below-threshold smoothness, marginal duration outliers) may be acceptable with documentation. Estimate the data budget needed for remediation and compare against the cost of training on the current dataset and accepting lower performance.",
      tips: ["Include before/after training results if possible — run a quick training experiment on the filtered vs. unfiltered dataset to quantify the impact of quality filtering.", "The quality report should be version-controlled alongside the dataset as a living document."],
    },
  ],
  keyPapers: [
    {
      id: "mandlekar-robomimic-2021",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298",
    },
    {
      id: "walke-bridge-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "gebru-datasheets-2021",
      title: "Datasheets for Datasets",
      authors: "Gebru et al.",
      venue: "Communications of the ACM 2021",
      year: 2021,
      url: "https://arxiv.org/abs/1803.09010",
    },
  ],
  claruRelevance: "Every Claru dataset includes a comprehensive quality report covering all metrics described in this guide. Our automated quality pipeline computes per-episode scores during collection, flags issues in real-time for immediate remediation, and generates dataset-level analysis upon delivery. Clients receive validated data with documented quality metrics, not raw unverified footage.",
};

export default data;
