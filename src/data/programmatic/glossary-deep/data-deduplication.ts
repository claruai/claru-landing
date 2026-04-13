import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "data-deduplication",
  termSlug: "data-deduplication",
  category: "data-quality-pipelines",
  metaTitle: "Data Deduplication — Definition & Training Data | Claru",
  metaDescription: "Data deduplication detects and removes exact and near-duplicate samples from training datasets. Learn hashing methods, embedding similarity, and impact on model performance.",
  primaryKeyword: "data deduplication",
  secondaryKeywords: ["duplicate removal", "dataset dedup", "near-duplicate detection", "MinHash LSH", "training data cleaning", "perceptual hashing"],
  canonicalPath: "/glossary/data-deduplication",
  h1: "Data Deduplication: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Data deduplication identifies and removes exact and near-duplicate samples from training datasets to prevent overfitting, reduce storage costs, and improve training efficiency. This page covers deduplication methods from exact hashing to learned embeddings, their impact on model performance, and best practices for robotics and video datasets.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Data Deduplication", href: "/glossary/data-deduplication" },
  ],
  sections: [],
  faqs: [
    {
      question: "Why does duplicate data hurt model training?",
      answer: "Duplicate data causes three problems. First, it inflates the effective weight of duplicated examples, biasing the model toward those specific scenarios at the expense of underrepresented ones. If 10% of a grasping dataset consists of near-duplicate pick-up-cup demonstrations, the model over-indexes on cup grasping and underperforms on less represented objects. Second, duplicates that appear in both training and test splits create data leakage, producing artificially high evaluation scores that do not reflect real-world performance. Third, duplicates waste compute: training on 100,000 samples that contain 15% duplicates means 15,000 gradient updates teach the model nothing new while still consuming GPU hours. The Pile deduplication study showed that removing duplicates improved language model perplexity by 2-5% without adding any new data.",
    },
    {
      question: "What is the difference between exact deduplication and near-duplicate detection?",
      answer: "Exact deduplication identifies byte-identical files using cryptographic hashes (MD5, SHA-256). Two files with the same hash are guaranteed identical. This catches literal copies but misses near-duplicates: images that differ by compression artifacts, slight crops, or resolution changes. Near-duplicate detection uses perceptual similarity — either perceptual hashes (pHash, dHash) that are robust to minor image modifications, or learned embeddings (CLIP, DINOv2) that capture semantic similarity. A CLIP embedding cosine similarity threshold of 0.95 catches images of the same scene from slightly different angles, while a threshold of 0.85 catches semantically similar but visually distinct images. The threshold choice depends on the application: aggressive deduplication (lower threshold) maximizes diversity but risks removing valid data variation.",
    },
    {
      question: "How do you deduplicate video data versus image data?",
      answer: "Video deduplication operates at multiple levels. Frame-level dedup removes near-identical consecutive frames within a video, common in surveillance footage with static scenes — typically keeping one frame per N seconds of near-static content. Clip-level dedup identifies entire video clips that are copies or near-copies, which happens when the same event is recorded from multiple cameras or when data collection campaigns overlap. Trajectory-level dedup in robotics identifies demonstration trajectories where the robot follows nearly identical paths — these provide redundant training signal. Video dedup typically uses temporal embeddings (I3D, VideoMAE features) averaged across frames rather than per-frame comparison, because the same action performed at different speeds should be detected as a near-duplicate even though frame-level hashes differ.",
    },
    {
      question: "What is MinHash LSH and when should you use it?",
      answer: "MinHash Locality-Sensitive Hashing is a probabilistic method for efficiently finding near-duplicate pairs in large datasets. It works by creating compact fingerprints (signatures) of each data sample such that similar samples have a high probability of colliding in the same hash bucket. For text deduplication, MinHash operates on n-gram sets. For images, it operates on discretized feature vectors. The key advantage is scalability: brute-force pairwise comparison of 1 million samples requires 500 billion comparisons, while MinHash LSH with properly tuned parameters finds 95%+ of near-duplicates with only a few million hash lookups. Use MinHash LSH when your dataset exceeds 100,000 samples and brute-force embedding comparison is too slow.",
    },
    {
      question: "How much deduplication is typical for a robotics training dataset?",
      answer: "Robotics datasets collected through teleoperation typically contain 5-20% near-duplicates, depending on collection protocol. Datasets where operators repeat the same task in the same environment accumulate redundant demonstrations — the 50th pick-up-cup trajectory provides minimal additional signal over the first 20. Egocentric video datasets collected from multiple participants performing similar activities contain 10-30% redundancy at the action level, though visual appearance differs. After deduplication, training is faster (proportional to data reduction) and often produces better policies. The Open X-Embodiment dataset used embedding-based deduplication to merge data from multiple labs that had shared raw data, removing approximately 12% of trajectories.",
    },
  ],
  ctaHeading: "Need Clean, Deduplicated Training Data?",
  ctaDescription: "Claru delivers deduplicated datasets with verified uniqueness at the clip, trajectory, and scene level — so your model trains on maximum diversity with zero wasted compute.",
  relatedGlossaryTerms: ["data-quality-scoring", "data-enrichment", "dataset-diversity", "benchmark-curation"],
  relatedGuidePages: ["how-to-deduplicate-robot-training-data"],
  relatedSolutionSlugs: ["egocentric-video-data"],

  longDefinition: `Data deduplication is the process of detecting and removing duplicate or near-duplicate samples from a dataset to ensure that each training example provides unique learning signal. In the context of machine learning, deduplication operates at a spectrum of similarity thresholds: exact deduplication removes byte-identical copies, near-duplicate detection removes samples that differ only in superficial ways (compression artifacts, minor crops, resolution differences), and semantic deduplication removes samples that convey the same information despite visual or structural differences.

The rationale for deduplication is both statistical and computational. Statistically, duplicate samples distort the empirical distribution that the model learns from. If a particular object-environment combination appears 100 times while another appears 10 times, the model's learned policy will be biased toward the over-represented case — not because it is more important, but because the dataset collection process happened to capture it more often. This is distinct from intentional oversampling, where important or difficult cases are deliberately repeated to improve model performance on them. Accidental duplication provides no such benefit because the duplicated cases are typically easy, well-represented scenarios rather than informative edge cases.

Computationally, deduplication reduces training time and storage costs proportional to the fraction of data removed. For a dataset with 15% duplicates, deduplication cuts training time by roughly 15% with no loss in model performance — in fact, performance usually improves because the effective data distribution becomes more uniform. Large-scale studies have quantified this effect: the Scaling Data-Constrained Language Learners paper (Muennighoff et al., 2023) showed that deduplicating training data is equivalent to collecting 30-50% more unique data in terms of downstream task performance.

For robotics and physical AI, deduplication is complicated by the multi-modal, temporal nature of the data. A manipulation demonstration consists of a video stream, action commands, and optionally proprioceptive readings — comparing these multi-modal trajectories requires either reducing each to a fixed-size representation (e.g., averaging frame embeddings over the trajectory) or comparing modality by modality. Two demonstrations of the same task may look identical in RGB but differ in action timing or force profiles, meaning visual deduplication alone can remove trajectories that are actually distinct from a learning perspective. Effective robotics deduplication must consider the action modality alongside visual similarity.`,

  historicalContext: `Data deduplication as a storage optimization technique dates to the 1990s in enterprise computing, where exact-match deduplication reduced backup storage costs. The concept entered machine learning through web-crawled datasets: when datasets are assembled by scraping the internet, the same images and text passages appear across multiple websites, creating massive redundancy.

The first large-scale study of deduplication's impact on ML was the "Deduplicating Training Data Makes Language Models Better" paper (Lee et al., 2022), which showed that removing near-duplicates from the C4 training corpus improved GPT-2 perplexity by 2-5% and reduced training examples by 13.2%. This paper established that deduplication is not merely a storage optimization but a genuine training quality improvement. The researchers used suffix arrays for exact substring matching and MinHash for near-duplicate detection, setting the methodological standard for text deduplication.

For image data, the perceptual hashing approach predates ML applications. The pHash algorithm (Zauner, 2010) computes a compact hash of an image's low-frequency DCT components, producing hashes that are similar for visually similar images. The SemDeDup method (Abbas et al., 2023) introduced semantic deduplication for multimodal datasets: using CLIP embeddings to identify image-text pairs that convey the same semantic content despite visual differences. SemDeDup removed 50% of data from LAION training subsets while maintaining or improving model performance.

In robotics, deduplication became necessary with the Open X-Embodiment project (2023), which merged datasets from 21 research institutions. Multiple labs had shared raw data collected from common robot platforms, creating cross-dataset duplication that inflated the apparent size of the combined dataset. The project employed embedding-based deduplication on trajectory-level features to identify and merge redundant demonstrations. This established the precedent that robotics data aggregation must include a deduplication stage to produce accurate dataset size claims and avoid biasing models toward over-represented tasks.`,

  practicalImplications: `Implementing deduplication for a robotics dataset follows a four-stage pipeline. First, compute representations: for each data sample (image, video clip, or trajectory), produce a fixed-size feature vector. For images, CLIP or DINOv2 embeddings (768-1024 dimensions) work well. For video clips, average per-frame embeddings or use a video encoder like I3D. For manipulation trajectories, concatenate the averaged visual embedding with a summary of the action sequence (mean, variance, and range of each action dimension). Second, index the representations: for datasets under 100,000 samples, brute-force cosine similarity with FAISS is fast enough. For larger datasets, use approximate nearest neighbor methods like MinHash LSH or FAISS IVF-PQ indexes. Third, cluster and select: group near-duplicates into clusters (connected components at a cosine similarity threshold, typically 0.90-0.95), then select one representative from each cluster — either the highest-quality sample (by a quality score) or the one most central in embedding space. Fourth, validate: spot-check removed samples to confirm they are genuine duplicates rather than valid data variation, and compare model performance with and without deduplication on a held-out test set.

The similarity threshold is the most consequential design choice. Too aggressive (threshold 0.80) removes legitimate data variation — two demonstrations of the same task in different lighting are semantically similar but visually distinct, and both provide useful training signal. Too conservative (threshold 0.98) misses near-duplicates that differ only in compression artifacts or frame alignment. For robotics video data, a cosine similarity threshold of 0.92-0.95 on DINOv2 embeddings balances duplicate removal with diversity preservation. This should be calibrated on a manually labeled sample of your specific dataset.

Deduplication interacts with dataset splitting. Always deduplicate before splitting into training and test sets — otherwise, near-duplicates may land in both splits, creating data leakage. Apply deduplication globally, then assign entire duplicate clusters to either training or test but never both.

Claru integrates deduplication into every data delivery pipeline. Our datasets undergo multi-level deduplication: exact hash matching removes literal copies, perceptual hash comparison removes visually identical frames, and embedding-based clustering removes near-duplicate clips and trajectories. Clients receive a deduplication report documenting the fraction of data removed at each level and the similarity thresholds used, so they can adjust thresholds if their use case requires more aggressive or more conservative deduplication.`,

  commonMisconceptions: [
    {
      misconception: "Exact hash matching (MD5/SHA-256) is sufficient for dataset deduplication.",
      correction: "Exact hashing only catches byte-identical copies and misses the vast majority of problematic duplicates. Two frames of the same scene captured 100ms apart, two JPEG compressions of the same image at different quality levels, or two copies of the same video at different resolutions will all have different hashes. In typical web-crawled datasets, exact duplicates account for only 10-20% of total redundancy, with near-duplicates comprising the remaining 80-90%. Perceptual hashing or embedding-based methods are necessary to catch near-duplicates.",
    },
    {
      misconception: "Removing duplicates always improves model performance — the more aggressive the deduplication, the better.",
      correction: "Over-aggressive deduplication removes legitimate data diversity. Two demonstrations of picking up a cup that look similar in embedding space may differ in grasp approach angle, hand orientation, or timing — distinctions that are invisible in a visual embedding but meaningful for policy learning. The SemDeDup paper showed that performance peaks at moderate deduplication levels and degrades with excessive removal. For robotics data, the optimal deduplication threshold should be validated empirically: train models with different deduplication levels and measure downstream task performance.",
    },
    {
      misconception: "Deduplication is a one-time data preprocessing step that you run once and forget about.",
      correction: "Deduplication must be re-run every time new data is added to the training pool. New data collected from similar environments or by the same operators will inevitably overlap with existing data. Incremental deduplication — comparing only new data against the existing corpus — is more efficient than re-processing the entire dataset. Production data pipelines should include deduplication as an automated stage that runs on every data ingestion, with monitoring dashboards that track the duplication rate of incoming data as a quality signal.",
    },
  ],

  keyPapers: [
    {
      id: "lee-dedup-lm-2022",
      title: "Deduplicating Training Data Makes Language Models Better",
      authors: "Lee et al.",
      venue: "ACL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2107.06499",
    },
    {
      id: "abbas-semdedup-2023",
      title: "SemDeDup: Data-efficient learning at web-scale through semantic deduplication",
      authors: "Abbas et al.",
      venue: "ICLR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2303.09540",
    },
    {
      id: "muennighoff-scaling-2023",
      title: "Scaling Data-Constrained Language Learners",
      authors: "Muennighoff et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.16264",
    },
    {
      id: "tirumala-d4-2023",
      title: "D4: Improving LLM Pretraining via Document De-Duplication and Diversification",
      authors: "Tirumala et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12284",
    },
    {
      id: "webster-dedup-2023",
      title: "On the Duplication Bias in Web-Scale Multimodal Datasets",
      authors: "Webster et al.",
      venue: "ICCV 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.14823",
    },
  ],

  claruRelevance: `Claru builds deduplication into every data pipeline, ensuring that clients receive datasets with verified uniqueness at the clip, trajectory, and scene level. Our multi-stage deduplication process uses exact hashing, perceptual hashing, and embedding-based semantic similarity to catch duplicates at every level — from literal file copies to demonstrations that are visually distinct but provide redundant training signal.

For clients aggregating data from multiple sources, Claru performs cross-dataset deduplication: merging new data collections with existing training corpora and identifying overlaps before delivery. Each dataset ships with a deduplication report showing the number of duplicates detected at each threshold, the duplicate clusters identified, and the selection criteria used to choose representatives. This transparency lets ML teams adjust deduplication aggressiveness based on their specific model architecture and training regime, rather than accepting opaque data processing decisions.`,
};

export default data;
