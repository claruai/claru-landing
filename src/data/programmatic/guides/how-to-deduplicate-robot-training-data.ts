import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-deduplicate-robot-training-data",
  metaTitle: "How to Deduplicate Robot Training Data (2026 Guide) | Claru",
  metaDescription: "Technical guide to deduplicating robot training datasets using trajectory hashing, embedding similarity, and MinHash at scale to remove redundant demonstrations.",
  primaryKeyword: "how to deduplicate robot training data",
  secondaryKeywords: ["robot data deduplication","training data deduplication","trajectory similarity detection","duplicate episode removal","dataset cleaning robotics"],
  canonicalPath: "/guides/how-to-deduplicate-robot-training-data",
  h1: "How to Deduplicate Robot Training Data",
  heroSubtitle: "Technical guide to detecting and removing duplicate and near-duplicate episodes from robot training datasets using trajectory hashing, embedding-based similarity, and scalable MinHash pipelines.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Deduplicate Robot Training Data", href: "/guides/how-to-deduplicate-robot-training-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Deduplication Matters for Robot Learning",
      paragraphs: [
        "Duplicate demonstrations are a hidden tax on robot policy training. They distort the learned action distribution by overweighting specific trajectories, inflate training metrics through memorization, and waste compute on redundant gradient updates. Research on language model training (Lee et al., 2022) showed that deduplication alone improved model quality without adding any new data — the same principle applies to robot datasets.",
        "Robot datasets are especially prone to duplication because of how they are collected. Teleoperation operators working on the same task configuration produce near-identical trajectories, recording systems sometimes capture the same session twice due to software bugs, and low-diversity task protocols generate many episodes that are functionally equivalent despite having different pixel-level observations.",
        "Effective deduplication operates on action trajectories rather than raw observations, because two episodes with identical actions but different camera noise are functionally identical training examples. This guide covers the full deduplication pipeline from profiling through embedding computation, duplicate detection, representative selection, and validation."
      ]
    },
    {
      type: "stats",
      heading: "Deduplication Impact Benchmarks",
      stats: [
        { value: "5-15%", label: "Typical duplicate fraction in robot datasets" },
        { value: "3-8%", label: "Policy success rate improvement after dedup" },
        { value: "O(N)", label: "MinHash LSH detection complexity" },
        { value: "< 2%", label: "Max coverage bin loss (safe dedup threshold)" },
        { value: "0.95", label: "Typical cosine similarity threshold for near-dupes" },
        { value: "50K+", label: "Episodes where LSH becomes necessary vs. DTW" }
      ]
    },
    {
      type: "pipeline",
      heading: "Deduplication Pipeline Overview",
      steps: [
        { stepNumber: 1, title: "Profile Dataset", description: "Compute file checksums, per-operator statistics, and coarse trajectory fingerprints to estimate baseline duplication rate." },
        { stepNumber: 2, title: "Compute Embeddings", description: "Transform each episode's action trajectory into a fixed-length vector using DTW, interpolation + PCA, or a trained VAE encoder." },
        { stepNumber: 3, title: "Detect Duplicates", description: "Use agglomerative clustering (small datasets) or MinHash LSH / FAISS (large datasets) to find near-duplicate clusters." },
        { stepNumber: 4, title: "Select Representatives", description: "From each cluster, keep the highest-quality episode(s) by smoothness, success rate, and recording integrity." },
        { stepNumber: 5, title: "Validate", description: "Verify diversity coverage is preserved, action distributions are unchanged (KS test), and retrained policy performance is maintained." }
      ]
    },
    {
      type: "cards",
      heading: "Duplication Sources in Robot Datasets",
      cards: [
        {
          title: "Recording System Bugs",
          description: "Double-pressed record buttons, backup recording systems, and batch export errors create exact duplicates detectable via file hash comparison."
        },
        {
          title: "Operator Repetition",
          description: "The same operator performing the same task in the same configuration produces near-identical trajectories. DTW distance between these episodes is typically < 5% of the dataset mean."
        },
        {
          title: "Low Task Diversity",
          description: "Highly constrained tasks (peg insertion, precise placement) have only one valid trajectory regardless of operator. These are legitimate high-density regions, not errors."
        },
        {
          title: "Cross-Session Overlap",
          description: "Multiple collection sessions with identical environment configurations produce episode clusters. Track configuration metadata to identify these systematically."
        }
      ]
    },
    {
      type: "prose",
      heading: "When NOT to Deduplicate",
      paragraphs: [
        "Not all apparent duplication should be removed. Some tasks legitimately have a very narrow distribution of valid trajectories — peg insertion into a tight-tolerance hole, for example, has essentially one correct approach trajectory. Removing 'duplicates' from these high-density regions means removing the exact training signal the model needs to learn precise motions.",
        "The diagnostic is the coverage metric: after deduplication, check whether any action-space clusters have lost all their members. If a cluster that was heavily populated in the original dataset is now empty, you have likely removed legitimate high-density data rather than true duplicates. Restore those episodes and increase the similarity threshold for that region of the action space.",
        "Similarly, be cautious about deduplicating multi-task datasets where some tasks are inherently more uniform than others. A dataset with 'push object' (many valid trajectories) and 'insert peg' (one valid trajectory) will show higher apparent duplication in the peg-insertion subset. Applying a single global threshold removes useful peg-insertion demonstrations while leaving push-object duplicates untouched. Instead, compute the deduplication threshold per task variant based on each task's natural trajectory diversity.",
        "Finally, never deduplicate the validation or test splits. These splits should reflect the natural distribution of the collection process, including any duplicates. Deduplication is a training-set optimization — applying it to evaluation splits biases the evaluation toward rare, atypical demonstrations and gives an unrealistic picture of model performance on real-world data."
      ]
    }
  ],
  faqs: [
    {
      question: "Why does duplicate data hurt robot policy training?",
      answer: "Duplicate demonstrations distort the training distribution by overweighting specific trajectories, initial conditions, or operator styles. A dataset with 10% exact duplicates effectively trains the model as if those trajectories appeared 2x more frequently, biasing the learned policy toward those specific motion patterns at the expense of generalization. For diffusion-based policies (Diffusion Policy, 3D Diffusion Policy), duplicates reduce the effective diversity of the action distribution the diffusion model learns to sample from, leading to mode collapse where the policy always executes one strategy even when alternatives are equally valid. For behavioral cloning, duplicates inflate training metrics — the model memorizes the duplicated trajectories, showing low training loss, but generalizes poorly to novel initial conditions. Empirically, removing 5-15% duplicate/near-duplicate data from robot datasets typically improves policy success rate by 3-8% on held-out evaluation tasks, because the effective training set becomes more diverse per-sample."
    },
    {
      question: "What counts as a near-duplicate in robot demonstration data?",
      answer: "Near-duplicates fall into three categories. (1) Exact duplicates: episodes recorded from the same teleoperation trial due to recording bugs (the record button was pressed twice, or a backup recording system captured the same data). These have identical observations and actions at every timestep and are detected by file hash comparison. (2) Operator repetitions: episodes where the same operator performed the same task with the same objects in the same initial configuration, producing nearly identical trajectories. These have different pixel-level observations (slight camera noise differences) but very similar action sequences — typically DTW distance below 5% of the mean DTW distance across all episode pairs. (3) Low-variation episodes: episodes from different operators or configurations that happen to follow nearly identical paths, common for highly constrained tasks (e.g., inserting a peg in a hole where there is essentially only one valid trajectory). Category 1 should always be removed. Category 2 should be reduced (keep 1-2 instances, remove the rest). Category 3 requires judgment — these may represent legitimately common trajectories that the model should assign high probability to."
    },
    {
      question: "How do I deduplicate a dataset that is too large to fit pairwise comparisons in memory?",
      answer: "For datasets with more than 50,000 episodes, computing all O(N^2) pairwise DTW distances becomes impractical (50K episodes would require 1.25 billion comparisons). Use a two-stage approach: coarse filtering with locality-sensitive hashing (LSH) followed by precise comparison of candidates. First, compute a compact fingerprint for each episode — a common choice is to downsample the action trajectory to a fixed length (e.g., 50 timesteps via linear interpolation), flatten it to a 1D vector, and apply MinHash with 128 permutations. MinHash with Jaccard similarity estimation allows approximate nearest-neighbor search in O(N) time using banded LSH indexing. Set the similarity threshold to flag candidate pairs with estimated Jaccard similarity above 0.7. Second, compute exact DTW distance only between flagged candidate pairs — this reduces the comparison count from O(N^2) to typically O(N * k) where k is the average number of candidates per episode (usually 5-20). The datasketch Python library provides an efficient MinHash LSH implementation that handles 1M+ episodes on a single machine."
    },
    {
      question: "Should I deduplicate based on observations, actions, or both?",
      answer: "Deduplicate primarily on action trajectories, with observation-based checks as a secondary signal. Action trajectories capture the behavioral content of a demonstration — two episodes with identical action sequences but different camera angles are functionally identical training examples for the policy. Computing similarity on raw image observations is expensive and noisy (pixel-level differences from camera noise, lighting variation, and slight object position changes make exact observation matching unreliable). The recommended approach: compute DTW distance on the normalized action trajectory (after z-score normalization, so all action dimensions contribute equally). For episodes flagged as near-duplicates by action similarity, optionally verify using observation embeddings — encode the first, middle, and last frames of each episode through a pretrained CLIP ViT-B/16 and compute cosine similarity between the concatenated embedding vectors. If both action DTW and observation CLIP similarity exceed their respective thresholds, the episode is a confirmed near-duplicate. This two-signal approach reduces false positives from the action-only check."
    },
    {
      question: "How much deduplication is too much — when am I removing useful data?",
      answer: "Monitor the diversity-quality tradeoff by measuring the effective dataset diversity before and after deduplication. Compute the coverage metric: discretize the action space into bins (using k-means clustering with k=100-500 on the trajectory embeddings) and count the number of occupied bins. If deduplication removes more than 2% of occupied bins, you are likely removing unique trajectories, not duplicates. A safe deduplication regime removes 5-15% of a typical robot dataset — going beyond 20% usually indicates either an overly aggressive similarity threshold or a genuinely low-diversity source dataset that needs more diverse collection rather than aggressive filtering. After deduplication, always retrain a policy and compare validation performance against the original dataset. If validation loss increases or success rate drops, dial back the similarity threshold. The ultimate test is downstream task performance: if the deduplicated dataset produces a policy with equal or better generalization on held-out evaluation environments, the deduplication was beneficial."
    }
  ],
  ctaHeading: "Need Dataset Cleaning at Scale?",
  ctaDescription: "Claru provides dataset deduplication, quality filtering, and curation services for robot training data. We handle datasets from 1K to 1M+ episodes.",
  relatedGlossaryTerms: ["data-deduplication","data-quality-scoring","dataset-diversity"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  difficulty: "intermediate",
  estimatedTime: "2-5 days",
  prerequisites: ["Robot demonstration dataset in HDF5, RLDS, or Zarr format","Python 3.10+ with NumPy, scipy, and scikit-learn","Understanding of your dataset's action space and episode structure","Sufficient disk space for intermediate results (2x dataset size)"],
  tools: ["Python","NumPy","scipy","fastdtw","datasketch (MinHash)","scikit-learn","CLIP (for observation embeddings)","h5py"],
  steps: [
    {
      stepNumber: 1,
      title: "Profile the Dataset and Identify Duplication Sources",
      description: "Before running any deduplication algorithm, understand the structure and provenance of your dataset to identify likely duplication sources. Load the full dataset metadata (without loading observation images into memory) and compute: total episode count, per-operator episode counts, per-task-variant episode counts, episode duration distribution, and file creation timestamp distribution.\n\nPlot the timestamp distribution as a histogram — clusters of episodes with identical or near-identical creation times often indicate recording system bugs where the same teleoperation session was captured multiple times. Compute file-level checksums (MD5 or SHA-256) for all episode files: any hash collisions indicate exact duplicate files that can be immediately removed without further analysis. For HDF5 datasets, compute checksums on the action array specifically: h5py.File(path)['action'][:].tobytes() piped through hashlib.md5(). This catches exact action duplicates even when metadata fields (timestamps, file names) differ.\n\nAnalyze per-operator statistics: if one operator produced 3x more episodes than others with a lower success rate, their episodes may contain many re-recordings of the same task configuration. Group episodes by (operator_id, task_variant, object_configuration) and flag groups with more than 5 episodes for closer inspection — these are the most likely sources of near-duplicates. Compute a quick action trajectory fingerprint for each episode: downsample the action sequence to 20 evenly spaced timesteps, discretize each dimension into 10 bins, and represent the episode as a 200-element integer vector. Hash this vector and check for collisions — this coarse fingerprint catches approximately-identical trajectories in O(N) time and gives you a baseline duplication rate before running more expensive algorithms.",
      tools: ["h5py", "hashlib", "NumPy", "pandas", "matplotlib"],
      tips: ["Always profile before deduplicating — understanding why duplicates exist (recording bugs vs. operator repetition vs. low task diversity) determines the right deduplication strategy and threshold"]
    },
    {
      stepNumber: 2,
      title: "Compute Trajectory Embeddings for Similarity Search",
      description: "Transform each episode's action trajectory into a fixed-length embedding vector that supports efficient similarity search. The choice of embedding method depends on your dataset size and the computational budget.\n\nFor datasets under 50,000 episodes, use Dynamic Time Warping (DTW) directly as the distance metric. DTW handles episodes of different lengths and is robust to temporal stretching/compression that occurs when the same task is performed at different speeds. Use the fastdtw library (pip install fastdtw) which provides an O(N) approximation to DTW using a multi-resolution approach with radius parameter set to 1-3. Compute DTW on the normalized action trajectory: first z-score normalize each action dimension using training set statistics, then compute distance = fastdtw(actions_a, actions_b, dist=euclidean)[0]. Store the pairwise distance matrix as a scipy sparse matrix if memory allows, or compute distances on-demand during the clustering step.\n\nFor datasets over 50,000 episodes, compute fixed-length embeddings and use approximate nearest-neighbor search. Interpolate each episode's action trajectory to a fixed length (T=100 timesteps) using scipy.interpolate.interp1d, then flatten to a 1D vector of length T * action_dim. Optionally reduce dimensionality with PCA (retaining 95% of variance, typically reducing from 700-800 dimensions to 50-100) to speed up subsequent similarity search. An alternative embedding approach: train a lightweight variational autoencoder (VAE) on the action trajectories with a 32-64 dimensional latent space, then use the latent mean vector as the trajectory embedding. The VAE embedding is more semantically meaningful than the raw flattened trajectory because it learns to encode trajectory structure (approach direction, grasp type, placement strategy) into compact representations. Either way, store the embeddings as a NumPy array of shape (num_episodes, embedding_dim) alongside the episode indices for the deduplication step.",
      tools: ["fastdtw", "scipy.interpolate", "scikit-learn (PCA)", "NumPy", "PyTorch (for VAE)"],
      tips: ["Normalize action dimensions before computing embeddings — without normalization, high-magnitude dimensions (like joint positions in radians) dominate the distance metric over low-magnitude dimensions (like gripper width)"]
    },
    {
      stepNumber: 3,
      title: "Detect Duplicate and Near-Duplicate Episodes",
      description: "Run the duplicate detection algorithm to identify clusters of duplicate/near-duplicate episodes. The approach differs by dataset scale.\n\nFor DTW-based detection (datasets under 50K episodes): compute the full pairwise DTW distance matrix (or compute on-demand for memory-constrained setups). Apply agglomerative clustering with a distance threshold: use scipy.cluster.hierarchy.fcluster with the 'distance' criterion. Set the threshold by examining the distance distribution — plot a histogram of all pairwise distances and look for a bimodal distribution. The lower mode represents intra-cluster distances (near-duplicates) and the upper mode represents inter-cluster distances (distinct episodes). Set the threshold at the valley between modes. If no clear bimodal structure exists, use the 5th percentile of distances as a conservative threshold. Each cluster with 2+ members contains potential duplicates.\n\nFor embedding-based detection (datasets over 50K episodes): build an approximate nearest-neighbor index using FAISS (pip install faiss-cpu). Create an IndexFlatIP (inner product) index on L2-normalized embeddings (which gives cosine similarity). For each episode, query its k=20 nearest neighbors and flag pairs with cosine similarity above 0.95 as near-duplicate candidates. Alternatively, use MinHash LSH from the datasketch library: convert each flattened trajectory into a set of shingles (overlapping subsequences of 5-10 timesteps), compute MinHash signatures with 128 permutations, and build an LSH index with 0.8 Jaccard similarity threshold. Query each episode against the index to find candidate duplicates in O(1) per query.\n\nFor both approaches, build a duplicate graph: nodes are episodes, edges connect near-duplicate pairs with the similarity score as the edge weight. Find connected components in this graph — each connected component is a cluster of mutually near-duplicate episodes.",
      tools: ["scipy.cluster.hierarchy", "FAISS", "datasketch", "networkx (for graph components)", "NumPy"],
      tips: ["Visualize 10 random duplicate clusters by plotting overlaid action trajectories — this sanity check catches threshold calibration errors before you remove data"]
    },
    {
      stepNumber: 4,
      title: "Select Representatives and Remove Redundancy",
      description: "For each duplicate cluster, select one representative episode to keep and mark the rest for removal. The selection strategy matters — not all duplicates within a cluster are equally good.\n\nRank episodes within each cluster by a quality score. Compute per-episode quality as a weighted combination of: (1) Trajectory smoothness — the inverse of mean jerk magnitude (third derivative of position), computed as np.mean(np.abs(np.diff(actions, n=3, axis=0))). Smoother trajectories train better policies. Weight: 0.3. (2) Task completion — binary success flag if available, or a proxy like whether the episode reached the goal region. Weight: 0.4. (3) Recording quality — the percentage of non-dropped frames, absence of NaN values, and depth map completeness. Weight: 0.2. (4) Temporal regularity — inverse of the standard deviation of inter-frame intervals, penalizing episodes with timing jitter. Weight: 0.1. Select the highest-scoring episode from each cluster as the representative.\n\nFor large clusters (10+ near-duplicates), optionally keep 2-3 representatives instead of 1 to preserve natural trajectory variation. Select representatives that maximize intra-cluster diversity: pick the first representative by quality score, then pick subsequent representatives by maximizing the minimum DTW distance to all previously selected representatives (a greedy k-medoids approach).\n\nGenerate a deduplication report: total episodes before and after, number of duplicate clusters found, size distribution of clusters (how many pairs, triples, etc.), the percentage of total data removed, and the reduction in effective dataset size. Save the complete duplicate graph (which episodes are duplicates of which) as a JSON file alongside the dataset — downstream users may want to apply different deduplication thresholds.",
      tools: ["NumPy", "scipy", "pandas", "JSON"],
      tips: ["Never delete the original files — copy the deduplicated set to a new directory or create a metadata file listing which episodes to include, preserving the ability to revert"]
    },
    {
      stepNumber: 5,
      title: "Validate the Deduplicated Dataset",
      description: "Verify that deduplication improved dataset quality without removing essential diversity. Run three validation checks.\n\nFirst, diversity coverage analysis: compute the number of unique task configurations represented before and after deduplication. If your dataset has metadata for object types, initial positions, and operator IDs, compute the coverage as the number of unique (task_variant, object_set, position_hash) tuples. Deduplication should reduce episode count by 5-15% while reducing coverage by less than 1%. If coverage drops by more than 2%, the similarity threshold is too aggressive — some genuinely distinct episodes in similar configurations are being incorrectly flagged as duplicates. Second, action space coverage: discretize the action space using k-means with k=200 on the original dataset's trajectory embeddings, then measure what fraction of clusters have at least one episode in the deduplicated dataset. This should be >98%. Third, distribution comparison: compute per-dimension action statistics (mean, std, percentiles) on the original and deduplicated datasets. Use a Kolmogorov-Smirnov test on each dimension — the p-value should be >0.05 (no statistically significant distribution shift).\n\nFinally, run a training comparison: train the same policy architecture (e.g., Diffusion Policy with identical hyperparameters) on both the original and deduplicated datasets for the same number of gradient steps. Compare validation loss curves and, if possible, evaluation success rates. The deduplicated dataset should achieve equal or better performance with fewer training episodes. If performance degrades by more than 2% absolute, investigate which removed episodes contained unique information. This typically happens when the deduplication threshold is too aggressive or when the dataset has legitimately high density in a narrow region of trajectory space that the model needs to learn precisely (e.g., the final approach phase of an insertion task).",
      tools: ["scikit-learn (k-means, KS test)", "NumPy", "PyTorch", "wandb"],
      tips: ["Run the training comparison twice with different random seeds to account for training variance — a 1-2% difference can easily be within noise"]
    },
    {
      stepNumber: 6,
      title: "Integrate Deduplication into Your Data Pipeline",
      description: "Make deduplication a standard step in your data processing pipeline rather than a one-time operation. As new demonstration data is collected, run incremental deduplication that checks new episodes against the existing deduplicated dataset.\n\nImplement an incremental pipeline: when a new batch of N episodes arrives, compute embeddings for the new episodes using the same method as Step 2. Query each new episode's embedding against the FAISS index (or MinHash LSH index) of the existing dataset. If a new episode is a near-duplicate of an existing episode, add it to the duplicate log but do not include it in the training set. If it is novel, add its embedding to the index and include the episode in the dataset. This incremental approach runs in O(N * log(M)) where M is the existing dataset size, compared to O((N+M)^2) for full re-deduplication.\n\nBuild the pipeline as a Python script with a CLI interface: python dedup.py --input /path/to/new_episodes --index /path/to/existing_index --threshold 0.95 --output /path/to/accepted_episodes. Store the FAISS index as a serialized file (faiss.write_index) that persists between runs. Log every deduplication decision (accepted, rejected, which existing episode it matched) to a CSV for auditing. Set up a pre-training hook that runs the deduplication check automatically before any training job launches, ensuring no training run accidentally includes duplicate data.\n\nFor team workflows, publish the deduplication index as a versioned artifact alongside the dataset. When the dataset version is incremented, rebuild the index. Include the deduplication parameters (embedding method, similarity threshold, representative selection criteria) in the dataset documentation so that the deduplication is reproducible.",
      tools: ["FAISS (faiss.write_index/read_index)", "argparse or click", "CSV logging", "Python"],
      tips: ["Set up a weekly automated report that shows: new episodes received, episodes accepted, episodes rejected as duplicates, and current effective dataset diversity — this catches systematic collection issues early"]
    }
  ],
  keyPapers: [
    {
      id: "lee-semdedup-2022",
      title: "Deduplicating Training Data Makes Language Models Better",
      authors: "Lee et al.",
      venue: "ACL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2107.06499"
    },
    {
      id: "abbas-semdedup-2023",
      title: "SemDeDup: Data-efficient Learning at Web-Scale through Semantic Deduplication",
      authors: "Abbas et al.",
      venue: "ICLR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.09540"
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    }
  ],
  claruRelevance: "Claru provides dataset deduplication and quality curation services for robot training data. We operate scalable deduplication pipelines that handle datasets from 1K to 1M+ episodes, using trajectory embedding similarity, MinHash LSH, and automated quality scoring. Our data engineering team delivers clean, deduplicated datasets with full provenance documentation and validation reports.",
};

export default data;
