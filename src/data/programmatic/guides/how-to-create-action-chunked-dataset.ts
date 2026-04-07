import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-action-chunked-dataset",
  metaTitle: "How to Create an Action-Chunked Dataset for Policy Training (2026 Guide) | Claru",
  metaDescription: "Technical guide to building action-chunked datasets for ACT and Diffusion Policy training, covering chunk size selection, temporal alignment, and multi-modal observation formatting.",
  primaryKeyword: "how to create an action-chunked dataset for policy training",
  secondaryKeywords: ["action chunking dataset","ACT training data","action chunked transformer data","temporal action chunks","chunked policy training data"],
  canonicalPath: "/guides/how-to-create-action-chunked-dataset",
  h1: "How to Create an Action-Chunked Dataset for Policy Training",
  heroSubtitle: "Technical guide to structuring robot demonstration data with action chunking for training ACT, Diffusion Policy, and other temporal-sequence policy architectures.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create an Action-Chunked Dataset for Policy Training", href: "/guides/how-to-create-action-chunked-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Action Chunking Transforms Policy Learning",
      paragraphs: [
        "Action chunking is one of the most impactful data structuring techniques in modern robot learning. By having the policy predict a sequence of K future actions from a single observation rather than one action at a time, chunked policies overcome the compounding error problem that plagues single-step behavioral cloning. The ACT paper demonstrated that chunk-level prediction reduces error accumulation by committing to coherent multi-step plans.",
        "The key insight is that action chunking also helps with multi-modality in demonstrations. When multiple operators demonstrate the same task with different strategies, a single-step policy tries to average between strategies at every timestep — producing invalid, hesitant actions. A chunk-level policy can commit to one coherent strategy per chunk, selecting from the multi-modal action distribution rather than averaging across it.",
        "Restructuring existing demonstration data for action chunking is straightforward and does not require re-collection. The main requirements are temporal consistency in the source data and careful attention to normalization, boundary conditions, and chunk size selection."
      ]
    },
    {
      type: "stats",
      heading: "Action Chunking Key Parameters",
      stats: [
        { value: "K=16-100", label: "Typical chunk sizes (model-dependent)" },
        { value: "10-50 Hz", label: "Control frequencies in current datasets" },
        { value: "1-2 sec", label: "Recommended chunk duration for manipulation" },
        { value: "< 10%", label: "Max timestamp jitter for usable data" },
        { value: "K/4 to K/2", label: "Typical execution horizon before re-planning" },
        { value: "2-4", label: "Observation history frames for Diffusion Policy" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Chunk Parameters by Model Architecture",
      columns: ["Architecture", "Chunk Size (K)", "Control Freq", "Obs History", "Padding Strategy"],
      rows: [
        { "Architecture": "ACT (Zhao et al.)", "Chunk Size (K)": "100", "Control Freq": "50 Hz", "Obs History": "1 frame", "Padding Strategy": "Edge repeat" },
        { "Architecture": "Diffusion Policy (Chi et al.)", "Chunk Size (K)": "16", "Control Freq": "10 Hz", "Obs History": "2 frames", "Padding Strategy": "Edge repeat" },
        { "Architecture": "3D Diffusion Policy (Ze et al.)", "Chunk Size (K)": "16", "Control Freq": "10 Hz", "Obs History": "2 frames", "Padding Strategy": "Edge repeat" },
        { "Architecture": "Diffusion Policy (high-freq)", "Chunk Size (K)": "32", "Control Freq": "20 Hz", "Obs History": "3 frames", "Padding Strategy": "Zero + mask" }
      ]
    },
    {
      type: "cards",
      heading: "Common Action Chunking Pitfalls",
      cards: [
        {
          title: "Per-Chunk Normalization",
          description: "Normalizing each chunk independently destroys temporal structure. Always compute global statistics across all timesteps in the training set and apply uniformly."
        },
        {
          title: "Cross-Episode Chunks",
          description: "A chunk that spans two episodes contains a physically impossible action sequence. Always enforce episode boundaries during the sliding window operation."
        },
        {
          title: "Inconsistent Timestamps",
          description: "Variable frame rates create chunks where actions represent different time durations. Audit and interpolate before chunking — check that timestamp std < 10% of mean period."
        },
        {
          title: "Wrong Observation Alignment",
          description: "The observation must correspond to the state at the beginning of the action chunk, not the end. Off-by-one errors here cause the policy to predict actions for the wrong state."
        }
      ]
    },
    {
      type: "prose",
      heading: "Advanced Chunking Strategies",
      paragraphs: [
        "Beyond fixed-size chunking, several advanced strategies can improve policy performance for specific task types. Variable-length chunking segments the action trajectory at natural breakpoints (detected via velocity zero-crossings or contact events) and pads each segment to a fixed maximum length with a mask. This preserves the semantic structure of sub-actions rather than cutting them at arbitrary positions.",
        "Hierarchical chunking uses two levels: a coarse chunk that covers the full sub-action duration (1-5 seconds) for high-level planning, and a fine chunk within each coarse chunk for precise execution. The policy first predicts which coarse chunk to execute, then generates fine-grained actions within that chunk. This is particularly effective for long-horizon tasks where a single flat chunk size cannot simultaneously capture both strategic decisions and precise motor control.",
        "For datasets that will train multiple architectures, store both the raw unchunked data and pre-computed chunks at your primary chunk size. Use HDF5 virtual datasets or Zarr views to provide chunked access without duplicating the underlying data. This lets downstream users experiment with different chunk sizes without re-processing the dataset.",
        "Chunk overlap is another parameter to consider: instead of non-overlapping windows, generate chunks with 50% overlap (stride = K/2). This doubles the effective dataset size and provides the model with more diverse observation-chunk pairs at the cost of 2x storage. Both ACT and Diffusion Policy benefit from overlapped chunking when the source dataset is small (under 200 episodes)."
      ]
    }
  ],
  faqs: [
    {
      question: "What is action chunking and why does it improve policy performance?",
      answer: "Action chunking is the practice of having a policy predict a sequence of K future actions from a single observation, rather than predicting one action at a time. This was formalized in the ACT (Action Chunking with Transformers) paper by Zhao et al. (2023), where the policy outputs a chunk of 50-100 future actions at once, then executes the first few actions before re-predicting. The key insight is that single-step action prediction suffers from compounding errors — small prediction mistakes accumulate over time because each prediction conditions on the (now slightly wrong) state reached by the previous action. By predicting a chunk of temporally correlated actions, the policy amortizes these errors across the chunk and produces smoother, more coherent trajectories. Action chunking also helps with multi-modality: when demonstrations contain multiple valid strategies for the same task, single-step prediction averages between strategies (producing invalid actions), while chunk-level prediction can commit to one coherent strategy per chunk."
    },
    {
      question: "How do I choose the right chunk size for my dataset?",
      answer: "Chunk size (K) depends on your control frequency and the temporal granularity of the task. The original ACT paper used K=100 at 50 Hz (2 seconds of future actions), while Diffusion Policy typically uses K=16 at 10 Hz (1.6 seconds). A good heuristic is to set the chunk duration to roughly the length of the shortest meaningful sub-action in your task. For pick-and-place, a single grasp takes about 1-2 seconds, so chunks of 1-2 seconds work well. For long-horizon tasks like making coffee, where individual sub-actions vary from 2-10 seconds, use larger chunks (K=50-100 at 10 Hz) or hierarchical chunking. Start with the chunk size recommended by your target model architecture, train a policy, and then ablate: try K/2 and 2K. If K/2 degrades performance on contact-rich phases but K works well, your choice is good. If 2K improves long-reach motions but degrades precision, consider variable-length chunking or chunk size scheduling during training."
    },
    {
      question: "Do I need to re-collect data for action chunking, or can I restructure existing datasets?",
      answer: "You can restructure any existing demonstration dataset for action chunking without re-collecting data. The key requirement is that your original data was recorded at a consistent control frequency with accurate timestamps. To create action chunks from single-step data: at each timestep t, construct the chunk as actions[t:t+K]. For the final K-1 timesteps in each episode where the full chunk extends beyond the episode end, either pad with the last action repeated (zero-velocity padding) or truncate the chunk and mark the actual length in metadata. The critical data quality requirement is temporal consistency — if your recording has variable frame rates or timestamp gaps larger than 2x the nominal control period, the chunks will contain temporal discontinuities that degrade policy training. Always verify your source data's timestamp regularity before chunking: compute np.diff(timestamps) and check that the standard deviation is less than 10% of the mean period."
    },
    {
      question: "How should I handle the observation side of action-chunked data?",
      answer: "The observation format depends on your model architecture. ACT uses a single observation (the current timestep's image and proprioception) to predict the entire action chunk, so the observation structure is unchanged from standard single-step datasets. Diffusion Policy can use observation history — typically the last 2-3 observations as a temporal stack — to condition the action chunk prediction. If using observation history, store it as a sliding window: at timestep t, the observation is [obs[t-n_obs+1], ..., obs[t]] where n_obs is the history length. This means your dataset needs to handle the first n_obs-1 timesteps of each episode specially (pad with copies of the first observation or start the usable data at timestep n_obs-1). For image observations, avoid stacking images along the channel dimension (which would make a 256x256x9 tensor for 3 RGB frames) — instead keep them as separate keys or use a temporal dimension (3, 256, 256, 3) that the model attends to independently."
    },
    {
      question: "What normalization strategy works best for action chunks?",
      answer: "Normalize each action dimension independently using statistics computed across the entire training set, not per-chunk. Compute the global mean and standard deviation for each of the D action dimensions across all timesteps in all training episodes, then apply z-score normalization: (action - mean) / std. For Diffusion Policy specifically, the authors recommend clipping normalized actions to [-1, 1] and using a min-max normalization that maps the 0.1 and 99.9 percentile values to -1 and +1, which is more robust to outliers than standard min-max. Store the normalization statistics (mean, std, or min/max percentiles) as part of the dataset metadata — the model must use identical statistics during inference. A common mistake is normalizing each chunk independently, which destroys the temporal structure that makes action chunking work. Another mistake is computing statistics on the validation set or the full dataset instead of only the training split, which causes a subtle information leak."
    }
  ],
  ctaHeading: "Need Action-Chunked Data?",
  ctaDescription: "Claru prepares demonstration datasets formatted for ACT, Diffusion Policy, and other action-chunking architectures. We handle collection, chunking, and validation.",
  relatedGlossaryTerms: ["action-chunking","behavioral-cloning","diffusion-policy"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "intermediate",
  estimatedTime: "3-5 days",
  prerequisites: ["Existing robot demonstration dataset at consistent control frequency","Python 3.9+ with NumPy and h5py","Understanding of your target policy architecture (ACT, Diffusion Policy, etc.)","Familiarity with temporal sequence data structures"],
  tools: ["Python","NumPy","h5py","PyTorch","zarr","matplotlib"],
  steps: [
    {
      stepNumber: 1,
      title: "Audit Source Data for Temporal Consistency",
      description: "Action chunking assumes temporally regular data — each timestep in a chunk must represent the same time interval. Before chunking, audit every episode in your source dataset for temporal consistency. Load the timestamps from each episode and compute the inter-frame intervals: intervals = np.diff(timestamps). For a dataset recorded at 10 Hz, the expected interval is 0.1 seconds. Compute the mean, standard deviation, minimum, and maximum interval across all episodes.\n\nFlag episodes where the standard deviation exceeds 10% of the mean interval, where any single gap exceeds 2x the expected interval, or where the total frame count deviates by more than 5% from the expected count (episode_duration * control_frequency). These temporal irregularities are surprisingly common — they arise from compute load spikes during recording, USB bandwidth contention with cameras, or ROS message queue drops. For episodes with occasional dropped frames (1-2 per episode), interpolate the missing timesteps using cubic spline interpolation on the action and proprioceptive channels, and repeat the nearest image frame for vision channels. For episodes with systematic timing issues (e.g., recording drifted to 8 Hz instead of 10 Hz), either resample the entire episode to the target frequency using scipy.signal.resample or exclude the episode. Document the percentage of episodes requiring interpolation — if it exceeds 10%, there may be a systemic recording infrastructure issue that should be fixed before collecting more data.",
      tools: ["NumPy", "scipy.signal", "scipy.interpolate", "h5py"],
      tips: ["Plot a histogram of inter-frame intervals across the entire dataset — bimodal distributions reveal systematic timing issues that per-episode statistics might miss"]
    },
    {
      stepNumber: 2,
      title: "Select Chunk Size and Temporal Parameters",
      description: "Choose the chunk size K, observation history length n_obs, and execution horizon n_exec based on your target model architecture and task characteristics. These three parameters define how the dataset is structured.\n\nFor ACT (Zhao et al., 2023): the paper uses K=100 action chunks at 50 Hz control frequency (2 seconds of future actions), n_obs=1 (single current observation), and n_exec varies during inference but is typically K/5 to K/2 (execute 20-50 actions before re-predicting). For your dataset, you only need to store the full K-length action chunks — the execution horizon is an inference-time parameter. For Diffusion Policy (Chi et al., 2023): the default configuration is K=16 action chunks at 10 Hz (1.6 seconds), n_obs=2 (current + previous observation), and n_exec=8 (execute half the chunk before re-predicting). Again, only K and n_obs affect dataset structure.\n\nTo select K empirically: compute the autocorrelation of the action signal for a representative set of episodes. Plot the autocorrelation coefficient vs. lag — the chunk size should extend to approximately the lag where autocorrelation drops below 0.3. This corresponds to the temporal horizon over which actions remain correlated (i.e., part of the same coherent sub-action). If the autocorrelation is still above 0.5 at lag K, your chunks capture redundant correlated actions. If it drops below 0.1, the later actions in the chunk are nearly independent of the first action and the model must learn unnecessary long-range dependencies. For most tabletop manipulation tasks at 10 Hz, the sweet spot is K=10-20.",
      tools: ["NumPy (np.correlate)", "matplotlib", "statsmodels (acf function)"],
      tips: ["Test multiple chunk sizes on a small held-out set using a simple model before committing to a single K for the full dataset build"]
    },
    {
      stepNumber: 3,
      title: "Implement the Chunking Transformation",
      description: "Write the chunking logic that transforms your single-step dataset into chunked format. The core operation is a sliding window over the action sequence of each episode. For each timestep t in an episode of length T, construct:\n\naction_chunk[t] = actions[t : t + K]  (shape: K x action_dim)\nobs_history[t] = observations[t - n_obs + 1 : t + 1]  (shape: n_obs x obs_dim for each modality)\n\nHandle boundary conditions carefully. At the end of each episode where t + K > T, you have three options: (1) Zero-velocity padding — repeat the final action for the remaining positions: action_chunk[t] = np.pad(actions[t:T], ((0, t+K-T), (0, 0)), mode='edge'). This is the most common approach and what both ACT and Diffusion Policy use. (2) Truncation — only produce chunks where the full K actions are available, discarding the last K-1 timesteps. This loses data but avoids any padding artifacts. (3) Masking — pad with zeros but include a binary mask array: chunk_mask[t] = np.concatenate([np.ones(min(K, T-t)), np.zeros(max(0, t+K-T))]) that the model uses to ignore padded positions during loss computation.\n\nFor observation history at the beginning of episodes where t - n_obs + 1 < 0: repeat the first observation to fill the history window. Store the chunked dataset with explicit metadata: chunk_size (K), observation_history_length (n_obs), padding_strategy ('edge', 'zero', or 'mask'), and the original episode boundaries so that downstream consumers can reconstruct full episodes if needed. For memory efficiency, consider storing chunks as virtual datasets (h5py virtual layouts) that reference the original unchunked arrays rather than materializing all chunks, which would multiply storage by approximately K times.",
      tools: ["NumPy", "h5py (virtual datasets)", "zarr"],
      tips: ["Always verify chunk boundaries against episode boundaries — a chunk should never span two different episodes, which would create physically impossible action sequences"]
    },
    {
      stepNumber: 4,
      title: "Compute and Apply Action Normalization",
      description: "Proper normalization is critical for action-chunked policies because the loss function operates on the entire chunk simultaneously. Compute normalization statistics on the training split only, across all timesteps of all training episodes (not per-chunk). For each action dimension d, compute:\n\nmean_d = mean of all action values in dimension d across all training timesteps\nstd_d = standard deviation of all action values in dimension d\nmin_d = 0.1th percentile of action values in dimension d\nmax_d = 99.9th percentile of action values in dimension d\n\nFor ACT: use z-score normalization (action - mean) / std. For Diffusion Policy: the authors recommend percentile-based min-max normalization that maps [min_d, max_d] to [-1, 1]: normalized = 2 * (action - min_d) / (max_d - min_d) - 1, then clip to [-1, 1]. The percentile-based approach is more robust to extreme outlier actions (e.g., a teleoperator accidentally commanding a very fast motion) than standard min-max.\n\nApply the normalization to all action chunks in the dataset. For proprioceptive observations (joint positions, velocities, EE pose), apply the same normalization strategy using statistics computed from observation channels. For image observations, either normalize to [0, 1] by dividing by 255.0 or keep as uint8 and let the model's image encoder handle normalization — check your target codebase's convention. Store the complete normalization statistics (means, stds, mins, maxs, percentiles) as a JSON file alongside the dataset with the exact same key names the model's codebase expects. Run a round-trip test: normalize a batch, then denormalize it, and verify the result matches the original within floating-point tolerance (np.allclose with atol=1e-6).",
      tools: ["NumPy", "JSON", "h5py"],
      tips: ["Visualize the normalized action distribution for each dimension — it should be roughly centered at 0 with most values in [-3, 3] for z-score or [-1, 1] for min-max"]
    },
    {
      stepNumber: 5,
      title: "Build the Training-Ready Dataset with Dataloading Code",
      description: "Package the chunked, normalized dataset in the format your training framework expects, and provide a working dataloader. For PyTorch-based models (ACT, Diffusion Policy), create a torch.utils.data.Dataset class that maps integer indices to (observation, action_chunk) tuples. The dataset length equals the total number of valid timesteps across all training episodes (sum of episode lengths minus padding adjustments). Implement __getitem__ to: look up which episode and timestep the global index maps to, load the observation history and action chunk (with lazy loading from HDF5 or Zarr for memory efficiency), apply any runtime data augmentation (random image crops, color jitter), and return tensors in the expected format.\n\nFor efficient loading from HDF5, open files in the Dataset's __init__ with h5py.File(path, 'r', swmr=True) to enable concurrent reads from multiple dataloader workers. Set the PyTorch DataLoader with num_workers=4-8, pin_memory=True, and prefetch_factor=2 for GPU training. If your dataset fits in RAM (<50 GB for image datasets at 256x256 resolution with ~10,000 episodes), load everything into memory during initialization for fastest training. For larger datasets, use chunked reads from Zarr with its built-in LRU cache: zarr.open(path, mode='r', chunk_store=zarr.LRUStoreCache(zarr.DirectoryStore(path), max_size=2**30)).\n\nWrite a validation script that loads 1 batch from the dataloader, prints tensor shapes and dtypes, visualizes 3 episodes by rendering image observations as video with the action chunk overlaid as future waypoints, and runs a single forward pass through the target model to verify shape compatibility. This script is the most valuable artifact you can ship with a dataset — it eliminates the #1 source of wasted time when someone first tries to use your data.",
      tools: ["PyTorch DataLoader", "h5py", "zarr", "imageio", "matplotlib"],
      tips: ["Profile your dataloader throughput with torch.utils.data.DataLoader benchmarking — aim for at least 3x your GPU training throughput to avoid data-loading bottlenecks"]
    },
    {
      stepNumber: 6,
      title: "Validate End-to-End with a Training Smoke Test",
      description: "The definitive validation for an action-chunked dataset is training a policy on it and verifying reasonable learning dynamics. Run a smoke test using your target architecture with reduced hyperparameters: for ACT, train for 500 epochs on 100 episodes with the default architecture (chunk_size=K, hidden_dim=512, 4 encoder layers); for Diffusion Policy, train for 200 epochs on 100 episodes with the default DDPM scheduler and U-Net architecture.\n\nMonitor three diagnostic metrics during the smoke test: (1) Training loss curve — it should decrease monotonically and plateau, not oscillate or diverge. If loss oscillates, check for NaN values in the data, incorrect normalization, or mixed action conventions within the dataset. (2) Action chunk reconstruction error — after training, run inference on 50 training episodes and compute the MSE between predicted action chunks and ground truth. Plot the per-timestep-within-chunk error to verify it increases with prediction horizon (later actions in the chunk should have higher error, as they are harder to predict). If error is uniform across the chunk, the model may be memorizing rather than learning temporal structure. (3) Qualitative rollout — run the trained policy on 10 episodes in simulation (or on the real robot if available) and record success rate. Even a heavily undertrained policy should achieve >30% success rate on simple tasks if the data is correct.\n\nIf the smoke test reveals issues, the most common root causes are: action normalization using wrong statistics (check the JSON sidecar), temporal misalignment between observations and actions (the observation should correspond to the state at the beginning of the action chunk, not the end), incorrect action coordinate frame (delta EE in base frame vs. EE frame vs. world frame), and episode boundary contamination (chunks spanning two different episodes). Fix any issues found and re-run the smoke test before building the full-scale dataset.",
      tools: ["ACT training codebase", "Diffusion Policy codebase", "PyTorch", "wandb or tensorboard"],
      tips: ["Save the smoke test training curves and qualitative videos as part of the dataset release — they serve as a baseline that downstream users can compare against to verify their setup is correct"]
    }
  ],
  keyPapers: [
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ACT)",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705"
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "ze-3d-diffusion-policy-2024",
      title: "3D Diffusion Policy: Generalizable Visuomotor Policy Learning via Simple 3D Representations",
      authors: "Ze et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.03954"
    }
  ],
  claruRelevance: "Claru prepares action-chunked datasets for teams training ACT, Diffusion Policy, and other temporal-sequence policy architectures. We handle the full pipeline from raw demonstration collection through temporal auditing, chunk formatting, normalization, and delivery with working dataloaders — ensuring your data is compatible with your target model architecture out of the box.",
};

export default data;
