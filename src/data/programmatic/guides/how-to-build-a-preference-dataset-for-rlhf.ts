import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-preference-dataset-for-rlhf",
  metaTitle: "How to Build a Preference Dataset for Robot RLHF (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building preference comparison datasets for robot RLHF, covering video pair generation, annotator training, reward model validation, and scaling.",
  primaryKeyword: "how to build a preference dataset for robot rlhf",
  secondaryKeywords: ["robot RLHF preference data", "preference annotation robotics", "reward model training data", "human feedback robot learning"],
  canonicalPath: "/guides/how-to-build-a-preference-dataset-for-rlhf",
  h1: "How to Build a Preference Dataset for Robot RLHF",
  heroSubtitle: "Step-by-step guide to building preference comparison datasets for training reward models in robot learning, covering trajectory pair selection, annotator calibration, agreement metrics, and reward model validation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Preference Dataset for Robot RLHF", href: "/guides/how-to-build-a-preference-dataset-for-rlhf" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Robot RLHF Requires Domain-Specific Preference Annotation",
      paragraphs: [
        "Preference annotation for robot trajectories is fundamentally different from preference annotation for LLM outputs. In LLM RLHF, most literate adults can provide useful preferences \u2014 they can tell which text response is more helpful, harmless, and honest. In robot RLHF, annotators must evaluate trajectory quality along dimensions that are not obvious to non-experts: grasp stability (did the gripper maintain firm contact during transport, or was the object wobbling?), motion efficiency (did the end-effector take a direct path, or waste time with unnecessary detours?), approach strategy (did the robot approach from an angle that maximizes grasp success, or from a precarious angle that happened to work this time?), and recovery quality (when the robot encountered an unexpected situation, did it recover gracefully or thrash?).",
        "These quality dimensions require either explicit training of annotators on what constitutes good manipulation (a 30-60 minute calibration session with expert-labeled examples) or recruiting annotators with robotics domain expertise. Studies from the PEBBLE and D-REX papers show that untrained annotators provide preferences that are correlated with expert preferences (Spearman rho 0.4-0.6) but significantly noisier, requiring 2-3x more comparisons to train a reward model of equivalent accuracy. The investment in annotator training pays for itself within the first 500 comparisons.",
      ],
    },
    {
      type: "prose",
      heading: "Active Pair Selection for Efficient Preference Annotation",
      paragraphs: [
        "Random pair selection wastes annotator time because most random pairs have an obvious winner. If your trajectory pool spans expert demonstrations and random policy rollouts, a random pair will often pit an expert success against a random failure \u2014 the annotator clicks 'left' in 2 seconds without learning anything useful for the reward model. Active pair selection instead presents pairs where the current reward model is most uncertain, maximizing the information gained per comparison.",
        "The active selection algorithm works as follows: (1) Train an initial reward model on the first 200-500 random comparisons. (2) Score all remaining unannotated trajectories in the pool with the current reward model. (3) For each candidate pair, compute the absolute difference in predicted reward scores. (4) Select the 50-100 pairs with the smallest absolute differences \u2014 these are the pairs the model finds hardest to distinguish. (5) Send these pairs to annotators. (6) After annotation, retrain the reward model on all accumulated comparisons and repeat from step 2. This approach, used in the PEBBLE and SURF papers, reduces the total comparisons needed by 2-3x to reach the same reward model accuracy as random selection. The overhead of running the reward model for scoring is minimal (seconds for 10,000 trajectories on a single GPU) compared to the annotator time saved.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many preference comparisons do I need to train a useful reward model?",
      answer: "The required number depends on task complexity and the desired reward model accuracy. For single-task manipulation (pick and place, drawer opening), research from the D-REX and PEBBLE papers shows that 500-2,000 pairwise comparisons produce reward models that achieve 70-85% ranking accuracy on held-out trajectory pairs. For multi-task policies where the reward model must distinguish quality across diverse behaviors, expect to need 5,000-20,000 comparisons. The relationship between comparison count and reward accuracy follows a logarithmic curve: doubling from 1,000 to 2,000 comparisons might improve accuracy by 8-12%, but doubling from 10,000 to 20,000 only gains 2-4%. Start with 1,000 comparisons, train a reward model, evaluate its ranking accuracy on a held-out set of 200 annotated pairs, and scale up only if accuracy is below your threshold. This iterative approach is far more cost-effective than committing to a large annotation budget upfront without validation."
    },
    {
      question: "Should annotators see video or final-state images when comparing trajectories?",
      answer: "Video is strongly preferred over static images for most robotics preference tasks. A final-state image can tell an annotator whether the task succeeded but cannot convey trajectory quality factors that matter for policy learning: smoothness of motion, approach angle, unnecessary detours, near-collisions, gripper stability during transport, and recovery from perturbations. The Learning from Human Feedback literature in LLM alignment faced a similar question and found that richer context produces more informative preferences. For robot RLHF specifically, show annotators side-by-side synchronized video clips at 1x speed (not fast-forwarded) with a clear camera angle that shows the full workspace. Include a 2-second freeze frame at the end so annotators can assess the final state. For tasks where force and contact matter (insertion, wiping), augment the video with an overlaid force magnitude plot rendered as a colored strip below the video frame using matplotlib. Annotators consistently report that seeing the force profile changes their preference in 15-20% of cases where the visual trajectory looks similar."
    },
    {
      question: "How do I handle ties and annotator uncertainty in preference labels?",
      answer: "Offer a three-way response option: A is better, B is better, or roughly equal. The roughly-equal option captures genuine ambiguity and prevents annotators from making arbitrary choices on close pairs, which inject noise into reward model training. Research from Christiano et al. (2017) showed that forcing binary choices on ambiguous pairs degrades reward model performance by 5-10% compared to allowing ties. When processing three-way labels for training, you have two options. The first is to discard ties entirely and train only on clear preferences, which reduces dataset size but improves label quality. The second approach, which is better for data efficiency, is to use a soft label scheme: clear preferences get label 1.0 (or 0.0), ties get label 0.5, and you train the reward model with a cross-entropy loss that handles continuous labels. Additionally, collect a confidence score (1-5 Likert scale) from each annotator on each comparison. Low-confidence comparisons (1-2) can be downweighted during training using sample weights proportional to confidence, which the Bradley-Terry model supports naturally."
    },
    {
      question: "What is the best strategy for selecting trajectory pairs to compare?",
      answer: "Random pair selection is extremely inefficient because most random pairs have an obvious winner that provides little training signal for the reward model. Use an active learning strategy instead. Start with random selection for the first 200-500 comparisons to bootstrap an initial reward model. Then, for subsequent batches, select pairs where the current reward model assigns similar scores (within 0.5 standard deviations of each other), since these are the pairs the model is most uncertain about and where human feedback provides the most information gain. This approach, used in the PEBBLE and SURF papers, reduces the total number of comparisons needed by 2-3x to reach the same reward model accuracy as random selection. A practical implementation: maintain a pool of unannotated trajectory pairs, score both trajectories with the current reward model, rank pairs by absolute score difference, and send the 50-100 pairs with the smallest differences to annotators. Retrain the reward model after each batch and repeat."
    },
    {
      question: "How do I validate that my reward model actually captures the intended preference?",
      answer: "Run three validation checks before using the reward model for policy optimization. First, held-out ranking accuracy: reserve 15-20% of your annotated comparisons as a test set, compute the reward model's predicted preference for each pair, and measure agreement with human labels. Target above 75% accuracy for single-task and above 65% for multi-task settings. Second, reward-behavior correlation: generate 50-100 trajectories of varying quality (from random policies, novice operators, and expert operators), score them with the reward model, and verify that the ranking correlates with ground-truth task success metrics (completion rate, path efficiency, final pose error). Compute Spearman's rank correlation, targeting rho above 0.6. Third, reward hacking detection: inspect the top-10 and bottom-10 scored trajectories in your dataset for pathological patterns. A common failure is the reward model learning to prefer trajectories that are simply longer (more frames in view) or that keep the gripper visible, rather than those that actually complete the task well. If you detect reward hacking, add negative examples that exhibit the hacked feature without task success, re-annotate, and retrain."
    },
    {
      question: "What is the minimum annotator team size for a robot preference dataset?",
      answer: "A minimum of 5 annotators is recommended, though 8-12 is ideal for production-scale projects. With fewer than 5, you cannot reliably compute inter-annotator agreement or detect individual annotator bias. Each pair of annotators should share at least 100 overlapping comparisons for meaningful agreement statistics. With 5 annotators and a round-robin overlap scheme, each pair shares approximately 200 comparisons per 1,000 total comparisons, which is sufficient for Krippendorff's alpha estimation. For the certification process, budget 2-3 hours per annotator (training session plus calibration test), and expect to certify 70-80% of candidates on the first attempt.",
    },
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru preference annotation specialist about your robot RLHF data requirements.",
  relatedGlossaryTerms: ["preference-annotation", "rlhf", "reward-model"],
  relatedGuidePages: ["how-to-design-a-reward-function-for-robot-learning"],
  relatedSolutionSlugs: ["expert-rlhf-annotation"],
  difficulty: "advanced",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Existing robot trajectory dataset (500+ episodes)", "Video rendering pipeline for trajectory replay", "Annotation platform (Label Studio, Scale AI, or custom)", "PyTorch for reward model training"],
  tools: ["Label Studio", "PyTorch", "Bradley-Terry model", "FFmpeg", "NumPy", "Weights & Biases"],
  steps: [
    {
      stepNumber: 1,
      title: "Curate the Source Trajectory Pool",
      description: "A preference dataset is built on top of an existing collection of robot trajectories. You need a diverse pool of trajectory quality levels so that preference comparisons contain meaningful signal. If you only have expert demonstrations, the differences between trajectories will be subtle and hard for annotators to judge reliably. Assemble a pool from multiple quality tiers: expert teleoperation demonstrations (the best 20% by task success and smoothness metrics), novice operator demonstrations (from operators with less than 1 hour of practice), policy rollouts from partially trained models at different training checkpoints, and optionally scripted or random trajectories that fail in predictable ways.\n\nFor each trajectory in the pool, render a standardized video clip. Use FFmpeg to extract the primary camera stream (typically the wrist or external camera) and overlay key metadata: a trajectory ID watermark, a timestamp counter, and the current gripper state indicator. Standardize all clips to the same resolution (480x480), frame rate (15 FPS is sufficient for human viewing), and codec (H.264 with CRF 23 for good quality at reasonable file size). Trim clips to start 1 second before the first non-trivial action and end 2 seconds after task completion or timeout. This standardization ensures annotators are comparing behavior, not video quality artifacts. Store the rendered clips alongside a manifest CSV that maps each trajectory ID to its source (expert, novice, policy_checkpoint_N), task type, environment ID, and ground-truth success label. This manifest is essential for analyzing preference patterns post-annotation."
    },
    {
      stepNumber: 2,
      title: "Design the Pair Selection and Annotation Interface",
      description: "Build or configure an annotation interface that presents trajectory pairs side-by-side and collects structured preference judgments. The interface must show two synchronized video players (left and right), each playing a trajectory clip at 1x speed with the ability to pause, rewind, and replay. Below the videos, provide three response buttons: Left is Better, Right is Better, and Roughly Equal. Include a confidence slider (1-5) and an optional free-text field for the annotator to explain their reasoning (these explanations are invaluable for debugging annotation quality issues).\n\nFor pair selection, implement a stratified sampling strategy. Divide your trajectory pool into quality quartiles based on ground-truth metrics (task success, trajectory smoothness, path efficiency). Sample pairs such that approximately 40% come from adjacent quartiles (moderately difficult comparisons), 30% from the same quartile (hard comparisons that test fine discrimination), and 30% from distant quartiles (easy comparisons that serve as attention checks). Use the easy cross-quartile pairs as gold-standard quality control items: if an annotator disagrees with the expected preference on more than 20% of these pairs, flag their work for review. Randomize left-right assignment to prevent position bias. Add a randomized duplicate: repeat 5-10% of pairs in reversed order to measure within-annotator consistency. Store the pair assignment, presentation order, and annotator response in a structured database (PostgreSQL or SQLite) with columns: pair_id, trajectory_a_id, trajectory_b_id, annotator_id, preference (A/B/equal), confidence, response_time_ms, and free_text_reason."
    },
    {
      stepNumber: 3,
      title: "Train and Calibrate Annotators",
      description: "Preference annotation for robot behavior requires domain calibration. Unlike text preference where most adults can provide useful feedback, robot trajectory quality assessment requires understanding what constitutes good manipulation: efficient approach trajectories, stable grasps, smooth transport without oscillation, accurate placement, and graceful recovery from perturbations. Invest in annotator training before launching production annotation.\n\nCreate a calibration set of 30-50 pairs where the ground truth preference is established by a robotics expert (someone who has trained robot policies and understands what trajectory features matter for learning). Include pairs that illustrate each quality dimension: a pair where one trajectory is smoother but slower (annotators should prefer the smoother one for imitation learning), a pair where one trajectory succeeds but takes an unnecessarily long path (preference depends on whether you're optimizing for success or efficiency, so make this explicit in your annotation guidelines), and a pair where both succeed but one has a more stable grasp during transport (visible as less gripper oscillation). Walk each annotator through these calibration pairs in a 30-minute training session, explaining the reasoning behind each ground truth label.\n\nAfter training, have each annotator independently label the full calibration set. Compute their agreement with the expert ground truth using Cohen's kappa, targeting kappa above 0.65 for certification. Annotators below this threshold receive a second training session focusing on their specific error patterns (extracted from the calibration results). Re-test with a different calibration set. Only certified annotators proceed to production annotation. This certification process typically takes 1-2 hours per annotator and rejects approximately 20-30% of candidates, but the improvement in downstream reward model quality is substantial."
    },
    {
      stepNumber: 4,
      title: "Execute Production Annotation at Scale",
      description: "Launch annotation in batches of 200-500 pairs, with quality monitoring between batches. Assign each pair to at least two independent annotators (three for high-stakes datasets) to measure inter-annotator agreement. Use Krippendorff's alpha on the ordinal preference scale (A preferred, equal, B preferred) as the agreement metric, targeting alpha above 0.55 for the full dataset (preference tasks inherently have lower agreement than factual annotation tasks, so 0.55-0.70 is considered good).\n\nAfter each batch, compute per-annotator statistics: agreement rate with gold-standard pairs, mean response time (extremely fast responses under 3 seconds suggest the annotator is not watching the full clips), consistency on repeated pairs (the same annotator should agree with themselves at least 80% of the time on duplicated pairs), and agreement with the annotator pool majority. Flag annotators who fall below thresholds on any metric and review their recent annotations before including them in the dataset.\n\nFor disagreements between annotators on the same pair, apply a majority-vote resolution: if 2 out of 3 annotators agree, use that label. If all three annotators give different responses (A, B, equal), discard the pair as genuinely ambiguous. Track the disagreement rate per task type and quality-tier pairing. High disagreement on specific pair types (such as pairs from the same quality quartile) is expected and indicates the boundary region where your reward model needs the most data. Low disagreement on pairs that should be difficult suggests your quality tiers are not well-calibrated.\n\nAim for an annotation throughput of 40-60 comparisons per annotator per hour at this quality level. At this rate, 10,000 comparisons with 2x redundancy requires approximately 330-500 annotator-hours. Budget for 15-20% additional pairs to replace those discarded due to quality issues or unresolvable disagreements."
    },
    {
      stepNumber: 5,
      title: "Train and Validate the Reward Model",
      description: "Train a Bradley-Terry preference model that maps trajectory features to a scalar reward. The standard architecture encodes each trajectory as a sequence of (observation, action) pairs through a temporal CNN or transformer encoder, producing a single scalar reward prediction. The loss function is the negative log-likelihood of the observed preferences under the Bradley-Terry model: for a pair where trajectory A is preferred over B, the loss is -log(sigmoid(r(A) - r(B))), where r is the predicted reward. For ties, use -log(sigmoid(abs(r(A) - r(B)) - margin)) with a small margin (0.1-0.5) to encourage similar scores.\n\nImplement the training pipeline in PyTorch. Use a ResNet-18 or ViT-Small visual encoder pretrained on ImageNet, followed by a temporal aggregation layer (either average pooling across timesteps or a 1D convolution) and a 2-layer MLP head that outputs the scalar reward. Train with Adam optimizer at learning rate 1e-4 with cosine annealing, batch size 64 pairs, for 50-100 epochs. Use the validation split (15% of annotated pairs, held out before training) for early stopping based on ranking accuracy.\n\nRun the three-part validation protocol. First, compute ranking accuracy on the held-out test set (another 15% of pairs, never seen during training or hyperparameter tuning). Second, generate a reward distribution plot by scoring all trajectories in your pool and overlaying histograms colored by quality tier. The reward distributions for different tiers should separate clearly: expert trajectories should cluster at high reward values, novice trajectories in the middle, and random/failed trajectories at low values. Overlapping distributions between adjacent tiers are normal, but if expert and random trajectories overlap significantly, the reward model has failed. Third, manually inspect the 20 highest-scoring and 20 lowest-scoring trajectories to check for reward hacking. Common hacking patterns in robot reward models include: preferring trajectories with more frames (longer duration), preferring trajectories where the camera view is stable (robot not moving), or preferring trajectories that keep the gripper closed (avoiding the visual complexity of open-gripper states)."
    },
    {
      stepNumber: 6,
      title: "Package the Dataset and Reward Model for Downstream Use",
      description: "Deliver the preference dataset and trained reward model as a complete package that policy learning teams can immediately integrate. The preference dataset should be stored as a single Parquet or JSON Lines file with columns: pair_id, trajectory_a_id, trajectory_b_id, preference (float: 1.0 for A preferred, 0.0 for B preferred, 0.5 for tie), confidence_mean (average annotator confidence), num_annotators, agreement (fraction of annotators who agreed with the majority label), and annotator_ids. Link trajectory IDs to the source trajectory dataset via a manifest file.\n\nExport the trained reward model as both a PyTorch checkpoint (.pt) and an ONNX model for framework-agnostic inference. Include a Python inference script that takes a trajectory (sequence of images and actions) and returns a scalar reward, handling image preprocessing, normalization, and temporal aggregation internally. Document the expected input format precisely: image shape, dtype, value range (0-255 uint8 or 0-1 float32), action vector layout, and whether the model expects a fixed or variable number of timesteps.\n\nCreate a comprehensive dataset card that documents: total annotated pairs, inter-annotator agreement (Krippendorff's alpha), gold-standard accuracy, annotator count and certification threshold, pair selection strategy, source trajectory pool composition (what fraction expert vs. novice vs. policy rollout), annotation interface design, and reward model architecture and validation metrics. Include a Jupyter notebook that loads the preference data, trains a reward model from scratch, and evaluates it on the held-out test set. This reproducibility artifact lets downstream teams verify the reward model quality independently and fine-tune it on additional preference data specific to their deployment scenario. The full package (preference labels, trajectory pool manifest, reward model weights, inference script, dataset card, and training notebook) should be versioned as a single release artifact."
    }
  ],
  keyPapers: [
    {
      id: "christiano-deep-rlhf-2017",
      title: "Deep Reinforcement Learning from Human Preferences",
      authors: "Christiano et al.",
      venue: "NeurIPS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03741"
    },
    {
      id: "lee-pebble-2021",
      title: "PEBBLE: Feedback-Efficient Interactive Reinforcement Learning via Relabeling Experience and Unsupervised Pre-training",
      authors: "Lee et al.",
      venue: "ICML 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2106.05091"
    },
    {
      id: "park-surf-2022",
      title: "SURF: Semi-supervised Reward Learning with Data Augmentation for Feedback-efficient Preference-based Reinforcement Learning",
      authors: "Park et al.",
      venue: "ICLR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.10050"
    },
    {
      id: "brown-drex-2020",
      title: "Better-than-Demonstrator Imitation Learning via Automatically-Ranked Demonstrations",
      authors: "Brown et al.",
      venue: "CoRL 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1907.03976"
    }
  ],
  claruRelevance: "Claru operates dedicated preference annotation teams trained specifically on robot trajectory evaluation. Our annotators are calibrated on domain-specific criteria (grasp stability, motion smoothness, path efficiency) with certified inter-annotator agreement exceeding 0.65 kappa. We handle the full pipeline from trajectory rendering and pair selection through annotator management, quality monitoring, and reward model validation, delivering preference datasets with documented agreement metrics and trained reward model checkpoints.",
};

export default data;
