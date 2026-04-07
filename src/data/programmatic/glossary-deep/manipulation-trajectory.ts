import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "manipulation-trajectory",
  termSlug: "manipulation-trajectory",
  category: "data-modalities",
  metaTitle: "Manipulation Trajectories for Robot Training | Claru",
  metaDescription: "Manipulation trajectories are time-series recordings of robot observations and actions during object manipulation. Learn formats, quality metrics, and collection methods.",
  primaryKeyword: "manipulation trajectory",
  secondaryKeywords: ["robot manipulation data", "trajectory data robotics", "manipulation demonstration", "robot trajectory dataset", "manipulation episode"],
  canonicalPath: "/glossary/manipulation-trajectory",
  h1: "Manipulation Trajectories: The Core Training Signal for Robot Learning",
  heroSubtitle: "A manipulation trajectory is a time-series recording of a robot performing a manipulation task, capturing synchronized streams of visual observations, proprioceptive state, and action commands at each timestep. Trajectories are the atomic unit of robot learning data — each one represents a complete example of how to perform a task, and a dataset of thousands of trajectories teaches a policy the range of strategies, initial conditions, and execution variations needed for robust deployment.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Manipulation Trajectory", href: "/glossary/manipulation-trajectory" },
  ],
  sections: [],
  faqs: [
    {
      question: "What data is recorded in a manipulation trajectory?",
      answer: "A typical manipulation trajectory includes: RGB images from 1-3 cameras at 15-30 fps, depth maps (if available), robot joint positions and velocities at 50-200 Hz, end-effector pose (position + orientation) at the control frequency, gripper state (open width or binary open/close), task description (natural language), episode metadata (success/failure, duration, object IDs), and optionally force/torque readings from wrist sensors. All streams must be temporally synchronized with timestamps.",
    },
    {
      question: "How long is a typical manipulation trajectory?",
      answer: "Simple tasks (reach and grasp, single-object pick-and-place): 5-30 seconds, producing 50-600 timesteps at 10 Hz. Moderate tasks (multi-object rearrangement, bin picking): 30-120 seconds, producing 300-2,400 timesteps. Complex tasks (assembly, tool use, multi-step cooking): 2-10 minutes, producing 1,200-12,000 timesteps. Longer trajectories are more expensive to collect and require more memory during training, but capture richer task structure.",
    },
    {
      question: "What quality metrics should be tracked for manipulation trajectories?",
      answer: "Key metrics include: task success rate (did the trajectory achieve the goal?), trajectory smoothness (jerk magnitude — lower is better), duration efficiency (compared to the median for that task), synchronization error (maximum timestamp drift between sensor streams), data completeness (percentage of expected frames actually recorded), and action distribution normality (detecting outlier actions that indicate recording errors). Filter trajectories scoring below thresholds on these metrics before training.",
    },
  ],
  ctaHeading: "Need Manipulation Trajectory Data?",
  ctaDescription: "Claru collects and delivers manipulation trajectories with full quality validation, in your preferred format, on your target robot platform.",
  relatedGlossaryTerms: ["teleoperation-data", "behavioral-cloning", "action-space", "vla", "diffusion-policy"],
  relatedGuidePages: ["how-to-annotate-manipulation-trajectories", "how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: `A manipulation trajectory is a temporally ordered sequence of (observation, action, metadata) tuples recorded while a robot performs a manipulation task. Each trajectory represents one episode — one attempt at a task from start to completion (or failure). The trajectory captures not just what happened (the observations) but what the robot did (the actions), enabling supervised learning methods like behavioral cloning to train policies that replicate the demonstrated behavior.

The observation component of a trajectory typically includes multiple synchronized sensor streams. Visual observations from one or more cameras provide the primary perceptual input. Proprioceptive observations (joint positions, velocities, and sometimes torques from motor encoders) provide the robot's internal state. Tactile observations from force/torque sensors or tactile arrays provide contact information. Each sensor stream has its own recording frequency, and temporal alignment across streams is critical — a 50ms misalignment between camera frames and action labels can degrade trained policy performance by 10-20%.

The action component records what the human operator (during teleoperation) or the robot controller commanded at each timestep. Action representations vary: some datasets record absolute joint positions, others record delta joint positions (change from current), others record end-effector poses (Cartesian position and quaternion orientation), and some record motor torques. The choice of action representation affects which learning algorithms can consume the data and how well policies transfer across robot platforms. Delta end-effector poses are the most transferable representation across different robot arms.

Trajectory metadata includes the task description (what the robot was supposed to do), the episode outcome (success or failure), the robot configuration (URDF, camera calibration), the environment state (which objects are present, their initial positions), and any human annotations (action segmentation boundaries, quality scores, natural language narrations). Rich metadata enables data filtering, stratification, and conditional training that improve policy quality.`,

  historicalContext: `The concept of recording robot demonstrations as training data dates to the 1990s and the learning from demonstration (LfD) community. Early trajectory datasets were small (dozens to hundreds of demonstrations) and task-specific, collected in single lab environments with custom recording software.

The Bridge Data project (UC Berkeley, 2022) was a milestone in manipulation trajectory collection at scale, accumulating over 60,000 trajectories across 13 task categories using standardized VR teleoperation. Bridge Data established practices for large-scale trajectory collection that the field has adopted: standardized recording formats, quality monitoring during collection, and public dataset release.

Google's RT-1 dataset (2022) went further with 130,000 trajectories from a fleet of mobile manipulators in office environments. The scale of this dataset enabled training the RT-1 Transformer policy for multi-task manipulation. The Open X-Embodiment project (2023) aggregated over 1 million trajectories from 22 robot platforms, establishing the RLDS format as the community standard for trajectory storage.

The trend since 2023 is toward higher-quality, more richly annotated trajectories rather than just more trajectories. Teams have found that 10,000 high-quality trajectories with diverse language annotations, quality metadata, and careful environment variation often train better policies than 100,000 hastily collected trajectories with minimal metadata. This shift has made professional data collection services increasingly valuable.`,

  practicalImplications: `Designing a manipulation trajectory dataset requires decisions about task selection, environment setup, collection protocol, and storage format that should be made before collection begins.

Task selection determines what the trained policy can do. Tasks should be specified with enough precision that operators can execute them consistently but enough flexibility that demonstrations are diverse. "Pick up the red cup and place it on the coaster" is better than "pick up something" (too vague) or "pick up the red cup at position (0.35, 0.12, 0.05) with a pinch grasp using fingers 1 and 3" (too specific). Each task should have 100+ demonstrations at minimum, with 500+ for tasks with high variability.

Environment variation is the key to generalization. For each task, collect demonstrations with varied object positions (randomize initial placement), varied objects (different cups, different coasters), varied backgrounds (clean table, cluttered table), and varied lighting (daylight, overhead fluorescent, dim). Without this variation, the policy memorizes a specific scene layout rather than learning the underlying task skill.

Recording infrastructure should be tested end-to-end before collection begins. Verify that all sensor streams are temporally synchronized by recording a known event (a clap, a dropped object) and checking alignment across streams. Verify that the action recording matches the robot's actual joint state by replaying a trajectory on the physical robot and checking for drift. Implement automatic validation that runs after each episode to catch recording errors immediately.

Storage format affects downstream training pipeline compatibility. RLDS (TensorFlow Datasets for robotics) is the standard for JAX/TensorFlow pipelines and is used by Octo, OpenVLA, and other foundation models. HDF5 is common in PyTorch pipelines and used by robomimic. Zarr provides cloud-native storage with efficient partial reads for large datasets. Converting between formats is straightforward but should be done once at the dataset level, not per training run.`,

  commonMisconceptions: [
    {
      misconception: "More trajectories always lead to better policies.",
      correction: "Trajectory quality, diversity, and annotation richness matter more than raw count above a threshold. A dataset of 5,000 high-quality, diverse trajectories with rich language annotations consistently trains better policies than 50,000 low-quality, homogeneous trajectories with no language metadata. The quality threshold below which more data helps is approximately 500-1,000 trajectories per task; above that, quality and diversity improvements yield more return than quantity increases.",
    },
    {
      misconception: "Failed trajectories should always be discarded.",
      correction: "Failed trajectories have value for several training approaches. They can train failure classifiers that detect and recover from failure states. They can provide negative examples for contrastive learning. They can train reward models by serving as the 'rejected' member of preference pairs. The standard practice is to label failed trajectories with their failure mode and outcome, keep them in the dataset with appropriate metadata, and let the training pipeline decide whether to include them based on the learning algorithm being used.",
    },
    {
      misconception: "Trajectory data from one robot cannot be used to train a policy for a different robot.",
      correction: "Cross-embodiment transfer is increasingly effective when trajectories are stored in a normalized action representation (delta end-effector poses). The Open X-Embodiment project demonstrated that training on trajectories from 22 different robots improves generalization compared to single-robot training. The visual observations transfer directly (objects look the same regardless of which robot is looking at them), and normalized action representations provide approximate action transfer. Fine-tuning on the target robot's data then adapts the policy to the specific embodiment.",
    },
  ],
  keyPapers: [
    {
      id: "walke-bridge-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "mandlekar-robomimic-2021",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298",
    },
    {
      id: "oxe-collaboration-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
  claruRelevance: `Manipulation trajectories are Claru's primary deliverable. We collect teleoperation demonstrations on client robot hardware with full quality validation: temporal synchronization verified to within 10ms, trajectory smoothness metrics computed per episode, task success labeled, and data delivered in the client's preferred format with loading scripts and dataset documentation.

Our datasets include the environment diversity that production policies require — demonstrations collected across varied object sets, scene layouts, lighting conditions, and operator strategies. With 386,000+ annotated clips in our catalog and the capacity to collect custom datasets of 10,000-50,000 trajectories on any standard robot platform, Claru provides manipulation trajectory data at the scale needed for production VLA and policy training.`,
};

export default data;
