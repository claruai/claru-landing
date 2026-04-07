import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "robocat",
  metaTitle: "Training Data for RoboCat | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to RoboCat training data: self-improvement loop, cross-embodiment seed data, multi-robot formats, and Claru-delivered datasets for RoboCat pipelines.",
  primaryKeyword: "robocat training data",
  secondaryKeywords: [
    "robocat data requirements",
    "robocat dataset format",
    "data for robocat",
    "robocat fine-tuning data",
    "deepmind robocat",
    "self-improving robot data",
    "cross-embodiment robot training",
  ],
  canonicalPath: "/models/robocat",
  h1: "Training Data for RoboCat",
  heroSubtitle:
    "Everything you need to know about RoboCat's data requirements — cross-embodiment seed demonstrations, self-improvement data loops, multi-robot format specifications, and how Claru delivers the high-quality initial data that RoboCat-style systems need to bootstrap autonomous improvement.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "RoboCat", href: "/models/robocat" },
  ],

  sections: [
    {
      type: "prose",
      heading: "What Is RoboCat?",
      paragraphs: [
        "RoboCat is a self-improving foundation agent for robot manipulation developed by Google DeepMind, introduced in June 2023. The core innovation is a training loop where the model generates its own training data through autonomous practice, filters that data for successful task completions, and retrains on the expanded dataset — progressively improving without additional human demonstrations. RoboCat was the first system to demonstrate that a single vision-language-action model could autonomously improve across multiple robot embodiments and hundreds of tasks.",
        "The system builds on the Gato architecture — a multimodal transformer that processes tokenized images, text, and actions in a unified sequence. RoboCat extends Gato with a structured self-improvement protocol: starting from a small seed dataset of human demonstrations (as few as 100 per task), the model performs autonomous rollouts in the real world, a success classifier filters the rollouts for task completions, and the successful trajectories are added to the training set. The model is then retrained from scratch on the expanded dataset. Each iteration of this loop yields 2-3x improvement in task success rate.",
        "DeepMind demonstrated RoboCat across four different robot embodiments: a Sawyer arm, a Panda arm, a KUKA arm, and a custom bi-manual setup. The model was trained on 253 tasks spanning pick-and-place, stacking, insertion, lid manipulation, and more complex assembly operations. Critically, the cross-embodiment training was not just a curiosity — demonstrations from one robot platform measurably improved performance on other platforms, even when the embodiments had different kinematic structures, grippers, and camera configurations.",
        "RoboCat's approach has important implications for data strategy. Because the model generates and curates its own data after the initial bootstrapping phase, the quality and diversity of the seed demonstrations is paramount. Poor seed data leads to a negative spiral where the model's autonomous practice generates low-quality trajectories that further degrade performance. Conversely, high-quality seed demonstrations enable a virtuous cycle where each iteration compounds improvements.",
      ],
    },
    {
      type: "stats",
      heading: "Key Metrics from the Paper",
      stats: [
        { value: "4", label: "Robot embodiments trained" },
        { value: "253", label: "Distinct manipulation tasks" },
        { value: "100", label: "Min seed demos per task" },
        { value: "2-3x", label: "Performance gain per self-improvement iteration" },
        { value: "1.2B", label: "Gato backbone parameters" },
        { value: "5", label: "Self-improvement iterations demonstrated" },
      ],
    },
    {
      type: "comparison-table",
      heading: "RoboCat Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "Multi-view RGB images (typically 2 cameras: overhead + wrist), tokenized via ViT and interleaved with proprioception tokens",
        },
        {
          Parameter: "Action Format",
          Specification:
            "Continuous end-effector actions tokenized into 1024 discrete bins per dimension; variable DoF per embodiment (6-DoF + gripper for single-arm, higher for bi-manual)",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Natural language task descriptions tokenized and prepended to the observation-action sequence (Gato-style)",
        },
        {
          Parameter: "Control Frequency",
          Specification:
            "5-10 Hz depending on embodiment (Sawyer at 5 Hz, KUKA at 10 Hz)",
        },
        {
          Parameter: "Proprioception",
          Specification:
            "Joint positions and velocities included as tokenized input alongside visual observations",
        },
        {
          Parameter: "Episode Length",
          Specification:
            "Variable; typically 100-500 timesteps per episode depending on task complexity",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "RoboCat's architecture is an extension of DeepMind's Gato model — a 1.2 billion parameter multimodal transformer that tokenizes all inputs and outputs into a single sequence. Visual observations (multi-view RGB images) are processed through a Vision Transformer (ViT) encoder that produces a fixed number of visual tokens per frame. These tokens are interleaved with tokenized proprioceptive state (joint positions and velocities), language tokens (the task description), and action tokens in an autoregressive sequence. The model is trained to predict the next action token given the preceding context.",
        "The key architectural innovation is not in the model itself but in the self-improvement training loop. The protocol works as follows: (1) Collect an initial seed dataset of 100+ human demonstrations per task. (2) Train the model on this seed data plus any existing cross-embodiment data. (3) Deploy the trained model for autonomous practice — the robot attempts the task repeatedly without human intervention. (4) Run a trained success classifier on the autonomous rollouts to identify successful completions. (5) Add successful rollouts to the training dataset. (6) Retrain the model from scratch on the expanded dataset. Steps 3-6 repeat for 5+ iterations.",
        "Cross-embodiment transfer is achieved through the tokenized representation. Because all embodiments share the same tokenization scheme (actions are discretized into 1024 bins per dimension, regardless of the underlying hardware), the model learns a shared policy representation across platforms. The paper shows that training on data from all four embodiments jointly outperforms training on data from any single embodiment, even for that embodiment's own tasks. This suggests the model transfers not just visual understanding but also manipulation strategies across kinematically different robots.",
        "The success classifier that filters autonomous rollouts is itself a critical component. DeepMind trained a separate vision-based classifier per task that evaluates the final state of each rollout. The accuracy of this classifier directly affects the quality of the self-generated data — false positives inject failed trajectories into the training set, while false negatives discard useful data. The paper reports classifier accuracies of 85-95% depending on task difficulty, with harder tasks (multi-step assembly) showing lower accuracy.",
      ],
    },
    {
      type: "comparison-table",
      heading: "RoboCat vs Related Cross-Embodiment Models",
      columns: ["Feature", "RoboCat (2023)", "RT-1 (2022)", "Octo (2024)", "Gato (2022)"],
      rows: [
        {
          Feature: "Self-Improvement",
          "RoboCat (2023)": "Yes (autonomous practice loop)",
          "RT-1 (2022)": "No",
          "Octo (2024)": "No",
          "Gato (2022)": "No",
        },
        {
          Feature: "Embodiments",
          "RoboCat (2023)": "4 (Sawyer, Panda, KUKA, bi-manual)",
          "RT-1 (2022)": "1 (Everyday Robot)",
          "Octo (2024)": "22+ (Open X-Embodiment)",
          "Gato (2022)": "1 (Sawyer) + sim + games",
        },
        {
          Feature: "Architecture",
          "RoboCat (2023)": "Gato (1.2B multimodal transformer)",
          "RT-1 (2022)": "EfficientNet + Transformer (35M)",
          "Octo (2024)": "Custom transformer (93M)",
          "Gato (2022)": "Multimodal transformer (1.2B)",
        },
        {
          Feature: "Action Representation",
          "RoboCat (2023)": "1024-bin discrete tokens",
          "RT-1 (2022)": "11-bin discrete tokens",
          "Octo (2024)": "Continuous (diffusion head)",
          "Gato (2022)": "1024-bin discrete tokens",
        },
        {
          Feature: "Seed Data Per Task",
          "RoboCat (2023)": "100 demonstrations",
          "RT-1 (2022)": "~175 avg demonstrations",
          "Octo (2024)": "Variable (Open X-Embodiment mix)",
          "Gato (2022)": "Not specified per task",
        },
        {
          Feature: "Open Source",
          "RoboCat (2023)": "No",
          "RT-1 (2022)": "No (data format is open)",
          "Octo (2024)": "Yes",
          "Gato (2022)": "No",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "RoboCat's data requirements are unique because of the self-improvement loop. The model's training dataset grows over time, but the initial seed data determines whether the self-improvement process converges to high performance or collapses. The paper uses 100 human demonstrations per task as the minimum seed, collected via teleoperation on each of the four robot platforms. Each demonstration consists of multi-view RGB video (overhead and wrist cameras), proprioceptive state at 5-10 Hz, end-effector actions, and a natural language task description.",
        "Seed demonstration quality is the single most important factor. The 100 demonstrations must be: (1) Successful — every trajectory should complete the task to the goal state, with no failed or partial attempts in the seed set. (2) Diverse — the demonstrations should cover the natural variation in object positions, orientations, sizes, and colors that the robot will encounter during autonomous practice. (3) Smooth — trajectories should be continuous and efficient, without unnecessary pauses, restarts, or jittery movements that would confuse the model. (4) Consistently formatted — all demonstrations for a given embodiment must share the same camera viewpoints, action space normalization, and control frequency.",
        "For cross-embodiment training, the paper shows that pooling data across all four platforms — even with different kinematic structures — consistently improves per-platform performance. This means teams building RoboCat-style systems should collect seed data from as many robot platforms as possible, even if the end goal is deployment on a single platform. The shared visual and language understanding transfers across embodiments, providing a stronger starting point for the self-improvement iterations.",
        "After the initial seed phase, the success classifier becomes a critical data quality gate. The classifier itself requires training data: typically 500-1,000 labeled rollout outcomes (success/failure) per task, annotated by human operators. This annotation cost is often overlooked but is essential for the self-improvement loop to function. Poor classifier accuracy leads to either dataset poisoning (false positives) or data starvation (false negatives), both of which degrade the improvement loop.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with RoboCat",
      paragraphs: [
        "Claru provides the high-quality seed demonstrations that RoboCat-style self-improving systems require to bootstrap the autonomous improvement loop. Our operators are trained specifically for seed-quality collection: every trajectory is a successful completion, covers the full diversity of object configurations, follows smooth and efficient motion profiles, and is recorded with hardware-synchronized multi-view cameras at the control frequency your embodiment requires (5-10 Hz for RoboCat-compatible pipelines).",
        "Beyond seed demonstrations, Claru provides the human annotations needed to train the success classifier that gates the self-improvement loop. Our annotation team labels rollout outcomes (success/failure) with task-specific criteria, achieving inter-annotator agreement rates above 95%. We can also provide graded success labels (partial completion scores) for tasks where binary success/failure is too coarse — for example, multi-step assembly tasks where the robot may complete 3 of 5 steps.",
        "For teams building cross-embodiment datasets, Claru collects demonstrations across multiple robot platforms with consistent data formatting. We normalize camera placement, resolution, and frame rate across embodiments while preserving each platform's native action space — matching RoboCat's requirement for hardware-specific action spaces within a shared visual/language representation. All datasets include full provenance documentation: operator ID, collection session, environment configuration, and per-episode quality scores.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "bousmalis-robocat-2023",
          title:
            "RoboCat: A Self-Improving Generalist Agent for Robotic Manipulation",
          authors: "Bousmalis, K., Vinyals, O., Lever, G., et al.",
          venue: "arXiv 2306.11706",
          year: 2023,
          url: "https://arxiv.org/abs/2306.11706",
        },
        {
          id: "reed-gato-2022",
          title: "A Generalist Agent",
          authors: "Reed, S., Zolna, K., Parisotto, E., et al.",
          venue: "arXiv 2205.06175",
          year: 2022,
          url: "https://arxiv.org/abs/2205.06175",
        },
        {
          id: "brohan-rt1-2022",
          title:
            "RT-1: Robotics Transformer for Real-World Control at Scale",
          authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
          venue: "RSS 2023",
          year: 2022,
          url: "https://arxiv.org/abs/2212.06817",
        },
        {
          id: "team-octo-2024",
          title: "Octo: An Open-Source Generalist Robot Policy",
          authors: "Ghosh, D., Walke, H., Pertsch, K., Black, K., et al.",
          venue: "arXiv 2405.12213",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
        {
          id: "oneill-oxe-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "O'Neill, J., Rehman, T., Gupta, A., et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],

  faqs: [
    {
      question:
        "Why does RoboCat only need 100 demonstrations per task while other models need thousands?",
      answer:
        "The 100 demonstrations are just the seed — RoboCat generates thousands more through autonomous practice. The self-improvement loop multiplies the effective training set by 5-10x per iteration over 5 iterations. However, the quality bar for those 100 seed demonstrations is extremely high: every trajectory must be a clean, successful completion with diverse object configurations. Poor seed data causes the self-improvement loop to diverge rather than improve. This is why Claru's operators are specifically trained for seed-quality collection.",
    },
    {
      question:
        "How does RoboCat's self-improvement work, and what data does the success classifier need?",
      answer:
        "After training on seed data, the robot performs autonomous rollouts (attempting tasks without human guidance). A separate success classifier evaluates each rollout's final state to determine if the task was completed. Successful rollouts are added to the training set, and the model retrains from scratch. The classifier itself needs 500-1,000 labeled examples (success/failure) per task — this is human annotation of rollout outcomes, which Claru provides as part of the data pipeline.",
    },
    {
      question:
        "Can I use RoboCat's approach with only one robot platform?",
      answer:
        "Yes, but you will get worse results than with multi-platform data. The RoboCat paper explicitly shows that cross-embodiment training improves performance on every individual platform. If you only have one robot, you can still benefit from the self-improvement loop, but the initial policy will be weaker and may require more seed demonstrations (200-500 instead of 100) to bootstrap reliably. Alternatively, you can include publicly available data from other platforms in your training mix.",
    },
    {
      question:
        "What happens if the self-improvement loop diverges — can bad data corrupt the model?",
      answer:
        "Yes, this is a real risk called 'negative self-play' or 'mode collapse.' If the success classifier has low accuracy (below ~85%), false positives inject failed trajectories into the training set, which degrades model performance in the next iteration, producing even worse rollouts. The paper addresses this by: (1) retraining from scratch each iteration (not fine-tuning, which would compound errors), (2) maintaining the original seed data in every training run, and (3) using high-accuracy classifiers trained on substantial labeled data. If you see performance decreasing across iterations, the first thing to audit is classifier accuracy.",
    },
    {
      question:
        "What is the minimum hardware setup to replicate RoboCat's self-improvement loop?",
      answer:
        "You need: (1) a robot with at least two cameras (overhead + wrist/side), (2) a teleoperation interface capable of recording at 5-10 Hz (SpaceMouse, VR controllers, or leader-follower arms), (3) sufficient compute for training a ~1B parameter transformer (8+ A100 GPUs or equivalent), and (4) the ability to run the robot autonomously for extended periods for the practice rollouts. The autonomous practice phase is the biggest logistical hurdle — you need unattended robot operation for hundreds of hours, which requires safety systems, automatic reset mechanisms, and reliable object placement.",
    },
  ],

  ctaHeading: "Get Seed Data for RoboCat-Style Self-Improvement",
  ctaDescription:
    "Tell us about your robot platforms and target tasks. Claru delivers the high-quality seed demonstrations and classifier labels that bootstrap RoboCat-style autonomous improvement loops.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "self-improvement-loop",
    "cross-embodiment",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["cross-embodiment-data"],

  modelName: "RoboCat",
  organization: "Google DeepMind",
  year: 2023,
  inputSpec: {
    observationFormat:
      "Multi-view RGB images (overhead + wrist cameras) tokenized via ViT, interleaved with proprioception tokens",
    actionFormat:
      "End-effector actions discretized into 1024 bins per dimension; variable DoF per embodiment (6-DoF + gripper for single-arm)",
    languageConditioning:
      "Natural language task descriptions tokenized and prepended to the observation-action sequence (Gato architecture)",
    controlFrequency:
      "5-10 Hz depending on embodiment (Sawyer at 5 Hz, KUKA at 10 Hz)",
  },

  dataVolumeBenchmarks:
    "RoboCat uses an initial seed of 100 human demonstrations per task across 253 tasks and 4 robot embodiments (Sawyer, Panda, KUKA, bi-manual custom). This seed dataset totals approximately 25,000 demonstrations. The self-improvement loop then expands this dataset 5-10x per iteration over 5 iterations: the robot performs autonomous rollouts, a success classifier filters for completions, and successful trajectories are added to the training set. After 5 iterations, the effective training set grows to 100,000-250,000 trajectories. The success classifier requires its own training data — 500-1,000 human-labeled rollout outcomes (success/failure) per task, totaling roughly 125,000-250,000 labeled samples across all tasks. Each demonstration includes multi-view RGB (overhead + wrist cameras), proprioceptive state (joint positions and velocities), end-effector actions at 5-10 Hz, and a natural language task description. The paper shows that cross-embodiment data pooling from all 4 platforms improves per-platform success rates by 10-20 percentage points compared to single-embodiment training.",

  trainingRecipe:
    "RoboCat training starts from the 1.2B-parameter Gato architecture — a multimodal transformer that tokenizes all modalities into a single autoregressive sequence. Visual observations are encoded via a Vision Transformer, proprioceptive states and actions are discretized into 1024 bins, and language instructions are tokenized with SentencePiece. Training proceeds in iterations: Iteration 0 trains on human seed data only (100 demos per task, 253 tasks, 4 embodiments). The model is trained from scratch using next-token prediction with cross-entropy loss. After training, the model performs autonomous rollouts (500-2,000 per task per iteration). A separately trained success classifier (a ResNet-based binary classifier per task) filters the rollouts. Successful trajectories are added to the dataset, and the model retrains from scratch on the expanded dataset. This from-scratch retraining — rather than fine-tuning — is essential to prevent error accumulation across iterations. Each iteration takes several days on a TPU v4 pod. The paper reports 5 self-improvement iterations, with the largest gains in iterations 1-3 and diminishing returns in iterations 4-5. Cross-embodiment data is mixed uniformly across embodiments during training — no embodiment-specific weighting or curriculum.",

  claruIntegration:
    "Claru provides the two data assets that RoboCat-style self-improving systems cannot generate on their own: high-quality seed demonstrations and success classifier labels. Our seed demonstrations meet the strict quality bar the self-improvement loop requires — 100% successful completions, diverse object configurations, smooth motion profiles, and hardware-synchronized multi-view recording at 5-10 Hz. For the success classifier, our annotation team labels rollout outcomes with task-specific binary or graded success criteria, achieving 95%+ inter-annotator agreement. For cross-embodiment pipelines, Claru collects data across multiple robot platforms with consistent formatting while preserving each embodiment's native action space. All deliverables include full provenance: operator ID, session metadata, environment configuration, and per-episode quality scores.",

  keyPapers: [
    {
      id: "bousmalis-robocat-2023",
      title:
        "RoboCat: A Self-Improving Generalist Agent for Robotic Manipulation",
      authors: "Bousmalis, K., Vinyals, O., Lever, G., et al.",
      venue: "arXiv 2306.11706",
      year: 2023,
      url: "https://arxiv.org/abs/2306.11706",
    },
    {
      id: "reed-gato-2022",
      title: "A Generalist Agent",
      authors: "Reed, S., Zolna, K., Parisotto, E., et al.",
      venue: "arXiv 2205.06175",
      year: 2022,
      url: "https://arxiv.org/abs/2205.06175",
    },
    {
      id: "brohan-rt1-2022",
      title:
        "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan, A., Brown, N., Carbajal, J., et al.",
      venue: "RSS 2023",
      year: 2022,
      url: "https://arxiv.org/abs/2212.06817",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Ghosh, D., Walke, H., Pertsch, K., Black, K., et al.",
      venue: "arXiv 2405.12213",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "oneill-oxe-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Neill, J., Rehman, T., Gupta, A., et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
};

export default data;
