import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "cross-embodiment-data",
  termSlug: "cross-embodiment-data",
  category: "data-modalities",
  metaTitle: "Cross-Embodiment Data — Definition & Training Data | Claru",
  metaDescription: "Cross-embodiment data aggregates robot demonstrations from diverse hardware platforms into unified datasets. Learn how it enables foundation models for robotics and what data standardization requires.",
  primaryKeyword: "cross-embodiment data",
  secondaryKeywords: ["multi-robot dataset", "cross-platform robot data", "embodiment-agnostic data", "cross-embodiment learning", "multi-embodiment training"],
  canonicalPath: "/glossary/cross-embodiment-data",
  h1: "Cross-Embodiment Data: Standardizing Robot Demonstrations Across Hardware Platforms",
  heroSubtitle: "Cross-embodiment data refers to robot learning datasets that aggregate demonstrations from multiple robot hardware platforms — different arms, grippers, sensors, and morphologies — into a unified format. This data paradigm, pioneered by the Open X-Embodiment collaboration, enables training foundation models that generalize across robot bodies rather than overfitting to a single platform.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Cross-Embodiment Data", href: "/glossary/cross-embodiment-data" },
  ],
  sections: [],
  faqs: [
    {
      question: "What makes cross-embodiment data different from standard robot datasets?",
      answer: "Standard robot datasets are collected on a single robot platform with fixed kinematics, sensors, and action spaces. A dataset of Franka Panda demonstrations has 7-DoF joint actions, specific camera placements, and gripper-width commands that are meaningless for a UR5 with a different gripper. Cross-embodiment data normalizes across these differences by defining a common observation and action interface. Visual observations (RGB images from wrist and third-person cameras) transfer most naturally across embodiments. Action representations require careful design: the Open X-Embodiment dataset uses end-effector displacement (delta x, y, z, roll, pitch, yaw, gripper) as a common action space because Cartesian end-effector commands are interpretable across different kinematic chains. Joint-space actions, by contrast, cannot be shared because robots have different numbers and configurations of joints. The key insight is that semantic-level task descriptions and visual observations are embodiment-invariant, while low-level joint commands are embodiment-specific."
    },
    {
      question: "How large are the major cross-embodiment datasets?",
      answer: "The Open X-Embodiment (OXE) dataset, released by Google DeepMind and collaborators in October 2023, is the largest cross-embodiment collection at over 1 million real-robot trajectories from 22 robot embodiments across 21 institutions. It spans manipulation tasks including pick-and-place, drawer opening, cloth folding, and tool use. The DROID dataset (Khazatsky et al., 2024) provides 76,000 trajectories from 564 scenes across 52 labs, collected on Franka Panda robots but with standardized protocols designed for cross-embodiment training through consistent action spaces. The Bridge V2 dataset contributes 60,096 demonstrations across multiple environments on a WidowX robot. In total, models like RT-2-X and Octo have been trained on combinations of these datasets totaling over 2 million trajectories, demonstrating that cross-embodiment data scale directly improves generalization to new robots and tasks."
    },
    {
      question: "What are the main challenges in creating cross-embodiment datasets?",
      answer: "The three core challenges are action space normalization, observation alignment, and data quality heterogeneity. Action space normalization must map different robot kinematics to a shared representation without losing task-relevant information — a 7-DoF arm and a 6-DoF arm have fundamentally different reachable workspaces and joint limits. Observation alignment requires consistent camera placements or robust visual representations that handle different viewpoints, resolutions, and fields of view. Data quality heterogeneity is perhaps the most insidious problem: demonstrations collected by different operators at different labs have different quality distributions, and mixing high-quality lab data with noisy crowd-sourced data can degrade model performance. The OXE project addressed this through standardized data loading with the RLDS format, but quality filtering remains an active challenge."
    },
    {
      question: "Which models have been trained on cross-embodiment data?",
      answer: "RT-2-X (Google DeepMind, 2023) was the first major model trained on cross-embodiment data, combining the RT-2 vision-language-action architecture with the Open X-Embodiment dataset. It demonstrated positive transfer: training on data from multiple robots improved performance on each individual robot by 50% on average compared to training on that robot's data alone. Octo (Team Octo, 2024) is an open-source generalist robot policy pretrained on 800K episodes from OXE, designed to be fine-tuned for new robots with as few as 50 demonstrations. HPT (Heterogeneous Pretrained Transformers, Wang et al., 2024) introduced a stem-trunk architecture that maps heterogeneous observation and action spaces from different embodiments through embodiment-specific stems into a shared transformer trunk. Pi-0 from Physical Intelligence (2024) trains a flow-matching architecture on cross-embodiment data for whole-body robot control."
    },
    {
      question: "How does Claru contribute to cross-embodiment data pipelines?",
      answer: "Claru's data collection infrastructure is designed for cross-embodiment compatibility from the ground up. Our demonstration collection protocols standardize on end-effector Cartesian actions and consistent camera placements (wrist-mounted and third-person) across different robot platforms, ensuring that data from any collection site integrates cleanly into OXE-compatible training pipelines. We deliver datasets in RLDS format with the observation and action specifications required by Octo, RT-2-X, and other cross-embodiment architectures. Critically, Claru addresses the environmental diversity gap in existing cross-embodiment datasets — most OXE data comes from research labs with similar backgrounds and lighting. Our 10,000+ collectors across 100+ cities capture demonstrations in homes, kitchens, workshops, and retail settings that dramatically expand the visual diversity of the training distribution. Each trajectory ships with task language annotations, quality scores, and embodiment metadata, ready for direct integration into cross-embodiment training runs."
    },
  ],
  ctaHeading: "Need Cross-Embodiment Training Data?",
  ctaDescription: "Claru collects robot demonstrations in RLDS format across diverse environments, compatible with OXE and foundation model training pipelines.",
  relatedGlossaryTerms: ["open-x-embodiment", "foundation-model-robotics", "vla", "transfer-learning-robotics"],
  relatedGuidePages: ["how-to-build-a-cross-embodiment-dataset"],
  relatedSolutionSlugs: ["vla-training-data"],
  longDefinition: "Cross-embodiment data is a category of robot learning dataset in which demonstrations are collected from multiple distinct robot hardware platforms and aggregated into a unified data format for joint training. The fundamental premise is that a model trained on manipulation demonstrations from a Franka Panda, WidowX, Sawyer, KUKA, and other robots simultaneously can learn embodiment-invariant manipulation skills that transfer more broadly than a model trained on any single platform's data alone.\n\nThe concept emerged from a recognition that robot learning was hitting a data wall. Individual research labs could collect thousands of demonstrations on their specific robot, but these datasets were incompatible with each other — different action spaces, observation formats, frame rates, and task vocabularies. The Open X-Embodiment (OXE) collaboration, announced in October 2023, addressed this by defining a common data schema based on the RLDS format and contributing over 1 million trajectories from 22 robot embodiments. The resulting RT-2-X model demonstrated that cross-embodiment training produced a 50% average improvement over single-embodiment baselines.\n\nThe key technical challenge in cross-embodiment data is action space normalization. Each robot has a unique kinematic chain with different numbers of joints, joint limits, and end-effector types. Joint-space actions (joint angles or velocities) are inherently embodiment-specific and cannot be shared across platforms. The standard solution is to represent actions in end-effector Cartesian space: delta position (dx, dy, dz), delta orientation (droll, dpitch, dyaw), and gripper command. This 7-dimensional action representation is interpretable across any robot with a single arm and parallel-jaw gripper, though it loses information about kinematic redundancy and joint-limit constraints.\n\nObservation standardization is comparatively simpler but still requires care. RGB images from a wrist-mounted camera and a third-person camera are the standard visual observations, as these viewpoints are available on most robot setups. Language task descriptions (\"pick up the red cup and place it on the saucer\") provide embodiment-invariant task conditioning. Proprioceptive observations (joint positions, end-effector pose) require normalization to each robot's specific ranges. The RLDS format handles this by storing each modality in a named field within a TensorFlow dataset, with per-dataset metadata specifying observation and action dimensions.\n\nThe practical impact of cross-embodiment data extends beyond research benchmarks. Companies deploying robots across different hardware platforms — a common scenario in warehouse automation where robot fleets include multiple arm models — can now train a single policy on data from all platforms. This dramatically reduces the per-platform data collection burden and enables rapid deployment on new hardware with minimal fine-tuning.",
  historicalContext: "The idea that robot learning should transcend individual hardware platforms dates to early transfer learning work in robotics. Gupta et al. (2017) demonstrated invariant feature spaces for transferring manipulation skills between simulated robots with different morphologies. Devin et al. (2017) showed that modular network architectures with separate 'robot-specific' and 'task-specific' components could transfer across embodiments. However, these early works operated in simulation with 2-3 robot types and did not confront the real-world data challenges at scale.\n\nThe practical push toward cross-embodiment data began with the Bridge dataset (Ebert et al., 2022), which demonstrated that a single WidowX robot collecting diverse manipulation data across many environments could enable zero-shot transfer through visual generalization. Bridge V2 (Walke et al., 2023) expanded this to 60,096 demonstrations. Meanwhile, the RT-1 model (Brohan et al., 2023) showed that scaling demonstration data to 130,000 episodes on a single Everyday Robots platform produced surprisingly robust generalization.\n\nThe watershed moment was the Open X-Embodiment collaboration, published as a joint effort of Google DeepMind and 20+ academic institutions in late 2023. By defining a common RLDS-based data format and contributing datasets from 22 different robot embodiments, OXE created the conditions for the first true cross-embodiment foundation models. RT-2-X, trained on this combined data, demonstrated clear positive transfer: the multi-robot model outperformed single-robot models on each robot's own evaluation tasks.\n\nSubsequent work has refined the approach. Octo (Team Octo, 2024) provided an open-source cross-embodiment model with an efficient fine-tuning protocol. HPT (Wang et al., 2024) introduced heterogeneous pretraining with embodiment-specific input/output stems. DROID (Khazatsky et al., 2024) addressed data quality by providing standardized collection protocols across 52 labs. The field is converging on the insight that cross-embodiment data is not just a convenience for multi-platform deployment — it is a fundamental enabler of generalization, analogous to how multilingual pretraining improves NLP models on each individual language.",
  practicalImplications: "Teams building cross-embodiment datasets must make several critical design decisions at the outset. The action space definition determines compatibility. The OXE standard uses 7-DoF end-effector actions (3 translation + 3 rotation + 1 gripper) relative to the current end-effector frame. This works for most single-arm tabletop manipulation but breaks down for bimanual robots (which need separate action vectors for each arm), mobile manipulators (which add base velocity), and dexterous hands (which have 16-24 joint DoFs). Teams targeting these platforms must define appropriate action abstractions that balance expressiveness against cross-platform compatibility.\n\nCamera placement standardization is often overlooked but critical for visual transfer. A wrist-mounted camera at 10cm from the gripper produces dramatically different images than one at 20cm. Third-person cameras at 45-degree elevation capture different occlusion patterns than overhead cameras. Cross-embodiment datasets should either standardize camera placements (as DROID does with specific mounting instructions) or include camera intrinsics and extrinsics so that downstream models can learn viewpoint-invariant representations.\n\nData quality filtering must account for per-dataset variability. When mixing demonstrations from 20+ labs, some datasets will have excellent operator skill and clean trajectories while others will contain noisy, suboptimal demonstrations. Training on unfiltered cross-embodiment data can actually hurt performance compared to single-embodiment training on curated data. Best practices include computing per-trajectory quality scores (based on task success, completion time, and trajectory smoothness), maintaining per-dataset quality histograms, and filtering or downweighting low-quality datasets during training. The OXE recommended practice is to apply dataset-level mixing weights that balance quality against diversity.\n\nFor data format, RLDS (Reinforcement Learning Datasets) built on TensorFlow Datasets is the de facto standard for cross-embodiment data since OXE adopted it. Each episode is a sequence of steps, where each step contains an observation dict (images, proprioception, language), an action array, and metadata. Claru delivers cross-embodiment-compatible datasets in RLDS format with OXE-standard field names, enabling direct loading into Octo, RT-2-X, and other foundation model training pipelines without format conversion.",
  commonMisconceptions: [
    {
      misconception: "Cross-embodiment data just means collecting the same tasks on different robots — no special formatting is needed.",
      correction: "Without careful action space normalization and observation standardization, data from different robots is not meaningfully combinable. A Franka joint trajectory and a UR5 joint trajectory are completely different vector spaces. Cross-embodiment data requires an explicit common interface — typically Cartesian end-effector actions, standardized camera viewpoints, and language task labels — stored in a consistent format like RLDS. The OXE project required months of format standardization across 21 institutions before the data could be jointly trained on."
    },
    {
      misconception: "Training on more robot embodiments always helps — you should include as many platforms as possible.",
      correction: "Cross-embodiment training helps when the added data covers new tasks, environments, or manipulation strategies. Adding a 10th robot platform that performs the same pick-and-place task in the same lab environment provides marginal benefit. The RT-2-X results showed that the benefit comes from task and environment diversity, not embodiment count per se. A well-curated dataset from 5 robots across 50 diverse environments outperforms a dataset from 20 robots in 5 similar lab environments. Quality and diversity of the data matter more than the number of contributing platforms."
    },
    {
      misconception: "Cross-embodiment models work zero-shot on any new robot without fine-tuning.",
      correction: "Current cross-embodiment models like Octo require fine-tuning on 50-200 demonstrations from the target robot to adapt to its specific kinematics, camera views, and workspace geometry. The cross-embodiment pretraining provides a strong initialization that makes fine-tuning much more sample-efficient than training from scratch, but zero-shot deployment on an unseen robot platform without any adaptation reliably underperforms. The practical workflow is: pretrain on large cross-embodiment data, then fine-tune on a small dataset from the deployment robot."
    },
  ],
  keyPapers: [
    {
      id: "oxe-collaboration-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Team Octo",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
    {
      id: "khazatsky-droid-2024",
      title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
    },
    {
      id: "walke-bridgev2-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "wang-hpt-2024",
      title: "Scaling Proprioceptive-Visual Learning with Heterogeneous Pre-trained Transformers",
      authors: "Wang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2409.20537",
    },
  ],
  claruRelevance: "Claru is purpose-built for the cross-embodiment data era. Our collection infrastructure produces demonstrations in RLDS format with OXE-standard observation and action specifications, making every Claru dataset directly compatible with Octo, RT-2-X, and custom foundation model training pipelines. The critical advantage Claru provides is environmental diversity: existing cross-embodiment datasets are overwhelmingly collected in research labs with similar backgrounds, lighting, and object sets. Claru's network of 10,000+ collectors across 100+ cities captures demonstrations in real homes, kitchens, workshops, and commercial spaces — the varied environments that cross-embodiment models need to deploy outside the lab. Each trajectory includes standardized Cartesian end-effector actions, synchronized wrist and third-person camera views, language task descriptions, and per-trajectory quality scores. For teams fine-tuning cross-embodiment foundation models on new tasks or deploying to new environments, Claru provides the targeted real-world data that closes the distribution gap between lab pretraining and production deployment.",
};

export default data;
