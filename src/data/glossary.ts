// =============================================================================
// Claru Glossary — Physical AI & Robotics Training Data Terms
// 56 terms across 7 categories
// =============================================================================

export type GlossaryCategory =
  | "physical-ai-systems"
  | "data-modalities"
  | "annotation-types"
  | "data-quality-pipelines"
  | "computer-vision"
  | "robotics-fundamentals"
  | "models-architectures";

export interface GlossaryTerm {
  term: string;
  slug: string;
  shortDefinition: string; // 60-120 words, opens with declarative sentence
  category: GlossaryCategory;
  relatedTerms: string[]; // slugs of related terms
  usedIn: { label: string; href: string }[]; // 2-3 internal Claru links
}

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  "physical-ai-systems": "Physical AI Systems",
  "data-modalities": "Data Modalities",
  "annotation-types": "Annotation Types",
  "data-quality-pipelines": "Data Quality & Pipelines",
  "computer-vision": "Computer Vision Fundamentals",
  "robotics-fundamentals": "Robotics Fundamentals",
  "models-architectures": "Models & Architectures",
};

export const glossaryTerms: GlossaryTerm[] = [
  // ── Physical AI Systems ──────────────────────────────────────────────────

  {
    term: "VLA Model (Vision-Language-Action)",
    slug: "vla",
    shortDefinition:
      "A VLA model is a neural network that takes visual observations and natural language instructions as input and outputs robot actions. VLA models unify perception, language understanding, and motor control in a single architecture, allowing a robot to interpret commands like \u201cpick up the red cup\u201d and produce the joint trajectories or end-effector poses required to execute them. Training requires synchronized triplets of image frames, instruction text, and action labels collected through teleoperation or human demonstration.",
    category: "physical-ai-systems",
    relatedTerms: [
      "embodied-ai",
      "visuomotor-policy",
      "behavioral-cloning",
      "open-x-embodiment",
      "pi-zero",
      "groot-n1",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "VLA Training Data: From Collection to Policy",
        href: "/solutions/vla-training-data",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
    ],
  },

  {
    term: "Embodied AI",
    slug: "embodied-ai",
    shortDefinition:
      "Embodied AI refers to artificial intelligence systems that perceive and act within a physical environment through a body — a robot, drone, or autonomous vehicle — rather than processing purely symbolic or textual information. Embodied agents must handle real-time sensorimotor loops, spatial reasoning, and physical uncertainty that text-only or image-only models do not encounter. Training embodied AI requires egocentric video, depth data, proprioceptive streams, and action labels that reflect the agent's embodiment.",
    category: "physical-ai-systems",
    relatedTerms: [
      "physical-ai",
      "vla",
      "visuomotor-policy",
      "cross-embodiment-data",
      "world-model",
    ],
    usedIn: [
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      { label: "Training Data for Robotics", href: "/training-data-for-robotics" },
    ],
  },

  {
    term: "World Model",
    slug: "world-model",
    shortDefinition:
      "A world model is a learned internal representation that allows an agent to simulate how its environment will evolve in response to its actions, without executing those actions in the real world. World models enable planning, counterfactual reasoning, and sample-efficient reinforcement learning by letting an agent imagine trajectories before acting. For physical AI, training world models requires diverse real-world video that captures the causal structure of physical interactions — how objects move, deform, and respond to contact forces.",
    category: "physical-ai-systems",
    relatedTerms: [
      "physical-ai",
      "embodied-ai",
      "video-prediction",
      "synthetic-data",
      "diffusion-transformer",
    ],
    usedIn: [
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "VLA Training Data Guide",
        href: "/vla-training-data-guide",
      },
    ],
  },

  {
    term: "Humanoid Robot",
    slug: "humanoid-robot",
    shortDefinition:
      "A humanoid robot is a robotic system with a body morphology that approximates the human form, typically including two legs, two arms, a torso, and a head. This morphology allows humanoids to operate in environments designed for humans — stairs, doorways, workbenches — without infrastructure modifications. Training humanoid policies requires full-body motion data, bimanual manipulation demonstrations, whole-body pose annotations, and egocentric video from head-mounted cameras at approximately the eye height of a standing human.",
    category: "physical-ai-systems",
    relatedTerms: [
      "vla",
      "visuomotor-policy",
      "embodied-ai",
      "teleoperation-data",
      "groot-n1",
      "pi-zero",
    ],
    usedIn: [
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
    ],
  },

  {
    term: "Visuomotor Policy",
    slug: "visuomotor-policy",
    shortDefinition:
      "A visuomotor policy is a learned mapping from visual observations — camera images or video frames — directly to motor commands or control actions. Rather than first building an explicit scene representation and then planning, visuomotor policies compute actions end-to-end from pixels. This approach is data-intensive: the policy must generalize across lighting, viewpoint, and object variation. Effective visuomotor policies are trained on large corpora of egocentric demonstration video paired with synchronized action labels.",
    category: "physical-ai-systems",
    relatedTerms: [
      "vla",
      "behavioral-cloning",
      "imitation-learning",
      "egocentric-video",
      "teleoperation-data",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "VLA Training Data Guide",
        href: "/vla-training-data-guide",
      },
    ],
  },

  {
    term: "Foundation Model for Robotics",
    slug: "foundation-model-robotics",
    shortDefinition:
      "A foundation model for robotics is a large pre-trained model that serves as a general-purpose base for many downstream robot learning tasks, analogous to how GPT-4 serves as a base for language applications. These models are pre-trained on broad, cross-embodiment datasets and then fine-tuned for specific robots and tasks. Examples include OpenVLA, Octo, and GR00T N1. Training requires large, diverse datasets spanning many robot types, environments, and task categories.",
    category: "physical-ai-systems",
    relatedTerms: [
      "vla",
      "cross-embodiment-data",
      "open-x-embodiment",
      "groot-n1",
      "pi-zero",
      "imitation-learning",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
    ],
  },

  {
    term: "Cross-Embodiment Data",
    slug: "cross-embodiment-data",
    shortDefinition:
      "Cross-embodiment data is training data collected from multiple robot morphologies — different arm designs, grippers, camera configurations, and kinematic chains — assembled into a single dataset to train policies that generalize across robot types. The Open X-Embodiment dataset is the canonical example, combining trajectories from 22 different robots. Cross-embodiment training reduces the need to collect large demonstrations for every new robot platform, enabling faster deployment of pre-trained foundation models on novel hardware.",
    category: "physical-ai-systems",
    relatedTerms: [
      "open-x-embodiment",
      "foundation-model-robotics",
      "embodied-ai",
      "teleoperation-data",
      "manipulation-trajectory",
    ],
    usedIn: [
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
    ],
  },

  {
    term: "Physical AI",
    slug: "physical-ai",
    shortDefinition:
      "Physical AI refers to AI systems that perceive, reason about, and act within the physical world, as opposed to systems that operate purely in digital or linguistic domains. Physical AI encompasses robots, embodied agents, autonomous vehicles, and world models — any system where the AI must bridge the gap between perception and physical action. The defining data requirement of physical AI is grounded, multi-modal training data: video paired with depth, force, pose, and action information that reflects how the real physical world behaves.",
    category: "physical-ai-systems",
    relatedTerms: [
      "embodied-ai",
      "world-model",
      "vla",
      "sim-to-real-gap",
      "foundation-model-robotics",
    ],
    usedIn: [
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      { label: "Training Data for Robotics", href: "/training-data-for-robotics" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  // ── Data Modalities ──────────────────────────────────────────────────────

  {
    term: "Egocentric Video",
    slug: "egocentric-video",
    shortDefinition:
      "Egocentric video is first-person video captured from a camera mounted on or near a person's or robot's head, recording the world from the perspective of the agent performing a task. This viewpoint directly mirrors what a robot's on-board camera would see during operation, making egocentric video the most natural training signal for visuomotor policies and embodied AI. Key characteristics include frequent hand-object interactions, dynamic viewpoint changes, and the full visual context of task execution including workspace layout.",
    category: "data-modalities",
    relatedTerms: [
      "rgb-d-data",
      "hand-object-interaction",
      "visuomotor-policy",
      "teleoperation-data",
      "depth-data",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "Egocentric Video Collection Case Study",
        href: "/case-studies/egocentric-video-collection",
      },
    ],
  },

  {
    term: "Teleoperation Data",
    slug: "teleoperation-data",
    shortDefinition:
      "Teleoperation data consists of paired observation-action recordings captured while a human operator remotely controls a physical robot to complete tasks. The human drives the robot through VR controllers, exoskeletons, or leader-follower setups, and the system records both what the robot's cameras see and the exact joint positions, end-effector poses, and gripper states the human commands. This creates ground-truth action labels at the deployment embodiment, making teleoperation data particularly valuable for behavior cloning and VLA fine-tuning.",
    category: "data-modalities",
    relatedTerms: [
      "manipulation-trajectory",
      "behavioral-cloning",
      "imitation-learning",
      "vla",
      "action-chunking",
    ],
    usedIn: [
      {
        label: "Teleoperation Dataset Collection",
        href: "/solutions/teleoperation-data",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "VLA Training Data Guide",
        href: "/vla-training-data-guide",
      },
    ],
  },

  {
    term: "Manipulation Trajectory",
    slug: "manipulation-trajectory",
    shortDefinition:
      "A manipulation trajectory is a time-series record of a robot arm executing a task, capturing the sequence of end-effector positions, orientations, gripper states, and joint angles over the duration of a manipulation action such as grasping, lifting, inserting, or assembling. Trajectories are the primary training signal for imitation learning and behavior cloning in manipulation robotics. High-quality trajectories require sub-16ms temporal alignment between visual observations and action states, and include metadata about object identity, task phase, and success or failure outcome.",
    category: "data-modalities",
    relatedTerms: [
      "teleoperation-data",
      "behavioral-cloning",
      "action-chunking",
      "6-dof-grasp-planning",
      "imitation-learning",
    ],
    usedIn: [
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
    ],
  },

  {
    term: "Depth Data",
    slug: "depth-data",
    shortDefinition:
      "Depth data encodes the distance from a camera to every point in a scene as a per-pixel value, producing a depth map that complements a standard RGB image with 3D spatial information. For robot learning, depth data enables grasp planning, obstacle avoidance, and 3D scene understanding that pure RGB images cannot support. Depth can be measured directly using LiDAR or structured light sensors, or estimated from monocular RGB video using models like Depth Anything V2. Claru enriches raw video with per-frame depth maps as a standard annotation layer.",
    category: "data-modalities",
    relatedTerms: [
      "rgb-d-data",
      "point-cloud",
      "monocular-depth-estimation",
      "depth-anything-v2",
      "egocentric-video",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "RGB-D Data",
    slug: "rgb-d-data",
    shortDefinition:
      "RGB-D data pairs standard color (red-green-blue) video frames with aligned depth frames captured at the same moment, providing both appearance and geometry for every scene. The depth channel (D) gives each pixel a distance value in addition to its color, enabling direct 3D reconstruction and precise grasp pose estimation. RGB-D cameras such as Intel RealSense and Microsoft Azure Kinect are common in robotics research. RGB-D data is particularly valuable for manipulation tasks where the 3D geometry of objects directly determines grasp feasibility.",
    category: "data-modalities",
    relatedTerms: [
      "depth-data",
      "point-cloud",
      "egocentric-video",
      "6-dof-grasp-planning",
      "monocular-depth-estimation",
    ],
    usedIn: [
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
    ],
  },

  {
    term: "Point Cloud",
    slug: "point-cloud",
    shortDefinition:
      "A point cloud is a set of data points in three-dimensional space, where each point has (x, y, z) coordinates and often additional attributes such as color or surface normals, representing the geometry of a scanned object or environment. Point clouds are generated by LiDAR sensors, structured light depth cameras, or through reconstruction from RGB-D sequences. In robotics, point clouds feed into grasp planning algorithms, 3D object detection, and occupancy mapping. Standard formats include PLY and PCD files compatible with the Open3D and PCL libraries.",
    category: "data-modalities",
    relatedTerms: [
      "depth-data",
      "rgb-d-data",
      "6-dof-grasp-planning",
      "monocular-depth-estimation",
    ],
    usedIn: [
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
    ],
  },

  {
    term: "Proprioceptive Data",
    slug: "proprioceptive-data",
    shortDefinition:
      "Proprioceptive data captures a robot's internal state — joint angles, joint velocities, end-effector position and orientation, gripper force, and torque readings — without relying on external sensors like cameras. Proprioception provides the robot's sense of its own body position in space, analogous to human kinesthetic awareness. In manipulation and locomotion policies, proprioceptive data is typically concatenated with visual observations as part of the observation vector, giving the policy information about its current configuration and the forces being applied at each joint.",
    category: "data-modalities",
    relatedTerms: [
      "manipulation-trajectory",
      "teleoperation-data",
      "visuomotor-policy",
      "behavioral-cloning",
      "action-chunking",
    ],
    usedIn: [
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Synthetic Data (for Robotics)",
    slug: "synthetic-data",
    shortDefinition:
      "Synthetic data for robotics is training data generated in simulation environments such as IsaacSim, MuJoCo, Genesis, or Habitat, rather than collected from physical robot systems or human demonstrations. Synthetic data offers unlimited scale and perfect ground-truth labels — exact object poses, contact forces, and joint states — at a fraction of the cost of real-world collection. Its primary limitation is the sim-to-real gap: visual and physical discrepancies between the simulated and real-world distributions that cause policies to fail on deployment hardware.",
    category: "data-modalities",
    relatedTerms: [
      "sim-to-real-gap",
      "domain-randomization",
      "world-model",
      "manipulation-trajectory",
    ],
    usedIn: [
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Closing the Sim-to-Real Gap",
        href: "/solutions/sim-to-real-data",
      },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
    ],
  },

  // ── Annotation Types ─────────────────────────────────────────────────────

  {
    term: "Keypoint Annotation",
    slug: "keypoint-annotation",
    shortDefinition:
      "Keypoint annotation marks specific landmark locations on objects or body parts — such as fingertips, joint centers, or object corners — as (x, y) coordinates within an image frame or (x, y, z) coordinates in 3D space. For human body pose, standard keypoint sets include the COCO 17-point skeleton and the OpenPose 25-point body model. For hand-object interaction, keypoints mark fingertip positions, wrist center, and object contact points. Keypoint annotations are the primary training signal for pose estimation models including ViTPose.",
    category: "annotation-types",
    relatedTerms: [
      "pose-estimation",
      "vitpose",
      "hand-object-interaction",
      "temporal-annotation",
      "activity-annotation",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Workplace Egocentric Video Case Study",
        href: "/case-studies/workplace-egocentric-data",
      },
    ],
  },

  {
    term: "Temporal Annotation",
    slug: "temporal-annotation",
    shortDefinition:
      "Temporal annotation marks the start and end timestamps of events, actions, or state transitions within a video, creating labeled segments along the time axis. In robotics, temporal annotations define the boundaries of discrete action phases — when a grasp begins and ends, when an object is in transit, when contact is made or released. Temporal precision directly affects policy performance: annotations at 100ms granularity miss the sub-frame timing information that manipulation policies need to learn smooth, reactive behavior.",
    category: "annotation-types",
    relatedTerms: [
      "action-segmentation",
      "activity-annotation",
      "keypoint-annotation",
      "manipulation-trajectory",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Video Annotation",
        href: "/pillars/enrich/video-annotation",
      },
    ],
  },

  {
    term: "Action Segmentation",
    slug: "action-segmentation",
    shortDefinition:
      "Action segmentation is the task of partitioning a video into temporally contiguous segments and assigning an action class label to each segment — for example, labeling consecutive frames as reach, grasp, transport, and place. Unlike activity recognition, which assigns a single label to an entire video, action segmentation produces a frame-level or segment-level label sequence. Action segmentation annotations are essential for training manipulation policies that decompose complex tasks into primitive actions and for generating the temporal supervision required by sequence models.",
    category: "annotation-types",
    relatedTerms: [
      "temporal-annotation",
      "activity-annotation",
      "behavioral-cloning",
      "manipulation-trajectory",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Video Annotation",
        href: "/pillars/enrich/video-annotation",
      },
    ],
  },

  {
    term: "Semantic Segmentation",
    slug: "semantic-segmentation",
    shortDefinition:
      "Semantic segmentation assigns a class label to every pixel in an image — for example, labeling all pixels belonging to cups as cup, all countertop pixels as countertop, and all hand pixels as hand. Unlike object detection, which produces bounding boxes, semantic segmentation provides pixel-precise region boundaries. For robot manipulation, semantic segmentation is used to identify graspable objects, avoid obstacles, and segment the workspace layout. Models like SAM (Segment Anything Model) produce high-quality semantic masks that Claru uses as a standard enrichment layer.",
    category: "annotation-types",
    relatedTerms: [
      "instance-segmentation",
      "panoptic-segmentation",
      "sam",
      "bounding-box-annotation",
      "depth-data",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Instance Segmentation",
    slug: "instance-segmentation",
    shortDefinition:
      "Instance segmentation extends semantic segmentation by distinguishing individual object instances of the same class — for example, separately labeling cup_1, cup_2, and cup_3 rather than assigning all three to a single cup class. This enables tracking individual objects across frames, understanding cluttered workspaces where multiple instances of the same object type are present simultaneously, and generating the per-object identity labels required for tasks like multi-object manipulation and assembly sequencing.",
    category: "annotation-types",
    relatedTerms: [
      "semantic-segmentation",
      "panoptic-segmentation",
      "sam",
      "object-tracking",
      "bounding-box-annotation",
    ],
    usedIn: [
      {
        label: "Object Identity Persistence Case Study",
        href: "/case-studies/object-identity-persistence",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
    ],
  },

  {
    term: "Activity Annotation",
    slug: "activity-annotation",
    shortDefinition:
      "Activity annotation labels what a person or robot is doing in a video at a coarser temporal granularity than action segmentation — for example, labeling a 30-second clip as preparing breakfast or repairing a bicycle. Activity labels provide high-level semantic context that complements fine-grained action segmentation. In egocentric video datasets, activity annotations define the top-level task category and are used to filter and stratify training data, ensuring that manipulation policies train on task-relevant clips rather than unrelated background footage.",
    category: "annotation-types",
    relatedTerms: [
      "temporal-annotation",
      "action-segmentation",
      "egocentric-video",
      "keypoint-annotation",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Workplace Egocentric Video Case Study",
        href: "/case-studies/workplace-egocentric-data",
      },
      {
        label: "Video Annotation",
        href: "/pillars/enrich/video-annotation",
      },
    ],
  },

  {
    term: "Bounding Box Annotation",
    slug: "bounding-box-annotation",
    shortDefinition:
      "Bounding box annotation draws the smallest axis-aligned rectangle that fully encloses an object within an image frame, labeled with an object class identifier. Bounding boxes are the most common object detection annotation format and provide approximate spatial localization without the per-pixel precision of segmentation masks. In robotics, bounding boxes are used for object detection, workspace analysis, and as an input to downstream grasp planning pipelines. Temporal sequences of bounding boxes across video frames provide the training signal for object tracking models.",
    category: "annotation-types",
    relatedTerms: [
      "semantic-segmentation",
      "instance-segmentation",
      "object-tracking",
      "sam",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Video Content Classification Case Study",
        href: "/case-studies/video-content-classification",
      },
      {
        label: "Expert Annotation",
        href: "/pillars/enrich/expert-annotation",
      },
    ],
  },

  {
    term: "Preference Annotation (RLHF)",
    slug: "preference-annotation",
    shortDefinition:
      "Preference annotation collects human judgments about which of two or more AI outputs is preferred, providing the training signal for reward models used in reinforcement learning from human feedback (RLHF). Annotators compare pairs of model outputs — robot trajectories, generated videos, text responses — and label which is better along specified dimensions. In robotics, preference annotations evaluate trajectory smoothness, task success, and natural motion. In video generation, they assess motion quality, fidelity, and text-video alignment across model configurations.",
    category: "annotation-types",
    relatedTerms: [
      "rlhf",
      "reward-model",
      "data-quality-scoring",
      "inter-annotator-agreement",
    ],
    usedIn: [
      { label: "RLHF & Preference Data", href: "/pillars/enrich/rlhf" },
      {
        label: "Expert RLHF Annotation",
        href: "/solutions/expert-rlhf-annotation",
      },
      {
        label: "Video Model Evaluation Case Study",
        href: "/case-studies/video-model-evaluation",
      },
    ],
  },

  // ── Data Quality & Pipelines ─────────────────────────────────────────────

  {
    term: "Data Enrichment",
    slug: "data-enrichment",
    shortDefinition:
      "Data enrichment is the process of augmenting raw collected data with additional annotation layers — depth maps, segmentation masks, pose estimates, optical flow, captions, and action labels — that downstream models need but that are not present in the original capture. Rather than delivering raw video, enrichment pipelines run automated models (Depth Anything V2, ViTPose, SAM, RAFT) and human annotation passes to produce a multi-layer dataset ready for direct use in training. Enrichment is distinct from annotation: it adds derived signals, not just labels assigned by humans.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "depth-data",
      "semantic-segmentation",
      "optical-flow",
      "pose-estimation",
      "data-quality-scoring",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
    ],
  },

  {
    term: "Benchmark Curation",
    slug: "benchmark-curation",
    shortDefinition:
      "Benchmark curation is the construction of a held-out evaluation dataset used to measure model performance on a specific task or capability. A well-curated benchmark is representative of the deployment distribution, covers edge cases and failure modes, and has high-quality ground-truth labels. In physical AI, benchmarks are used to compare robot policies across manipulation difficulty, environment diversity, and task generalization. Benchmark curation involves selecting diverse samples, verifying annotation quality, and preventing contamination between training and evaluation splits.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "data-quality-scoring",
      "inter-annotator-agreement",
      "dataset-diversity",
      "active-learning",
    ],
    usedIn: [
      {
        label: "Benchmark Curation",
        href: "/pillars/validate/benchmark-curation",
      },
      {
        label: "Prompt Enhancement Benchmark Case Study",
        href: "/case-studies/prompt-enhancement-benchmark",
      },
      { label: "Data Validation", href: "/pillars/validate" },
    ],
  },

  {
    term: "Data Deduplication",
    slug: "data-deduplication",
    shortDefinition:
      "Data deduplication identifies and removes near-duplicate samples from a training dataset that would cause the model to overfit to repeated examples rather than learning the true underlying distribution. In video datasets, deduplication operates at the frame level (perceptual hashing), clip level (embedding similarity), or trajectory level (action sequence similarity). Effective deduplication improves training efficiency and generalization: models trained on deduplicated datasets often achieve better downstream performance with less compute than those trained on raw, redundant corpora.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "data-quality-scoring",
      "dataset-diversity",
      "benchmark-curation",
      "active-learning",
    ],
    usedIn: [
      { label: "Deduplication", href: "/pillars/prepare/deduplication" },
      { label: "Data Preparation", href: "/pillars/prepare" },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
    ],
  },

  {
    term: "Inter-Annotator Agreement (IAA)",
    slug: "inter-annotator-agreement",
    shortDefinition:
      "Inter-annotator agreement (IAA) is a metric that quantifies the degree to which independent annotators assign the same labels to the same data samples, measuring the reliability and consistency of an annotation process. High IAA indicates that the task is well-defined and the guidelines are clear. Common IAA metrics include Cohen's kappa for pairwise agreement, Fleiss' kappa for multiple annotators, and Krippendorff's alpha for ordinal or continuous scales. Claru monitors Krippendorff's alpha as a primary quality signal, with a target threshold of 0.85 or above for preference annotation tasks.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "preference-annotation",
      "data-quality-scoring",
      "rlhf",
      "benchmark-curation",
    ],
    usedIn: [
      {
        label: "Expert RLHF Annotation",
        href: "/solutions/expert-rlhf-annotation",
      },
      {
        label: "Data Quality & Validation",
        href: "/pillars/validate",
      },
      {
        label: "Crowdsourced vs Expert RLHF",
        href: "/solutions/crowdsourced-vs-expert-rlhf",
      },
    ],
  },

  {
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    slug: "rlhf",
    shortDefinition:
      "RLHF is a training paradigm in which a reward model is trained on human preference annotations — judgments about which AI outputs are better — and then used to fine-tune a base model through reinforcement learning to produce outputs humans prefer. RLHF was central to the training of InstructGPT, ChatGPT, and Claude. In robotics, RLHF is applied to train reward models that evaluate trajectory quality, enabling policies to improve from human evaluations of robot behavior rather than requiring explicit reward engineering.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "preference-annotation",
      "reward-model",
      "inter-annotator-agreement",
      "data-quality-scoring",
    ],
    usedIn: [
      { label: "RLHF & Preference Data", href: "/pillars/enrich/rlhf" },
      {
        label: "Expert RLHF Annotation",
        href: "/solutions/expert-rlhf-annotation",
      },
      {
        label: "Video Quality at Scale Case Study",
        href: "/case-studies/video-quality-at-scale",
      },
    ],
  },

  {
    term: "Data Quality Scoring",
    slug: "data-quality-scoring",
    shortDefinition:
      "Data quality scoring assigns a numerical quality score to each sample in a dataset based on criteria such as annotation correctness, visual clarity, task relevance, and diversity contribution. Quality scores are used to filter out low-quality samples before training, weight samples during training, or prioritize which samples to re-annotate. In video datasets, quality scoring evaluates factors including motion blur, occlusion severity, camera calibration drift, and action completeness. Automated quality scoring reduces the labeling load by focusing human review on borderline samples rather than clearly acceptable or rejected ones.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "inter-annotator-agreement",
      "data-deduplication",
      "dataset-diversity",
      "active-learning",
      "benchmark-curation",
    ],
    usedIn: [
      { label: "Quality Scoring", href: "/pillars/prepare/quality-scoring" },
      { label: "Data Preparation", href: "/pillars/prepare" },
      {
        label: "Video Quality at Scale Case Study",
        href: "/case-studies/video-quality-at-scale",
      },
    ],
  },

  {
    term: "Dataset Diversity",
    slug: "dataset-diversity",
    shortDefinition:
      "Dataset diversity measures the range of variation in a training corpus across dimensions that matter for model generalization — scene appearance, lighting, object category, geographic location, task type, and operator behavior. A diverse dataset reduces overfitting to specific environments and improves zero-shot performance in novel settings. In robotics, diversity is measured along axes including environment category (kitchen, warehouse, outdoor), object type (rigid, deformable, transparent), and viewpoint (wrist camera, head camera, external camera). Claru tracks diversity coverage explicitly across all collection campaigns.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "data-deduplication",
      "data-quality-scoring",
      "benchmark-curation",
      "active-learning",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
    ],
  },

  {
    term: "Active Learning",
    slug: "active-learning",
    shortDefinition:
      "Active learning is a data collection and annotation strategy in which a model identifies which unlabeled samples it is most uncertain about, and those samples are prioritized for human annotation. This concentrates labeling effort on the examples that will most improve model performance, reducing the total annotation volume required to reach a target accuracy. In robotics, active learning selects demonstration scenarios that expose gaps in the current policy — edge cases, failure modes, or underrepresented environments — for targeted data collection rather than random sampling.",
    category: "data-quality-pipelines",
    relatedTerms: [
      "data-quality-scoring",
      "dataset-diversity",
      "data-deduplication",
      "benchmark-curation",
    ],
    usedIn: [
      { label: "Data Preparation", href: "/pillars/prepare" },
      { label: "Data Validation", href: "/pillars/validate" },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
    ],
  },

  // ── Computer Vision Fundamentals ─────────────────────────────────────────

  {
    term: "Optical Flow",
    slug: "optical-flow",
    shortDefinition:
      "Optical flow is a dense motion field that describes, for every pixel in an image, the apparent velocity of that pixel between consecutive frames — encoded as a 2D vector indicating direction and magnitude of motion. Optical flow captures how objects and surfaces move through the scene and is used in robotics to detect moving obstacles, estimate camera ego-motion, and segment foreground objects from background. RAFT (Recurrent All-Pairs Field Transforms) is the standard model for computing optical flow in physical AI data enrichment pipelines.",
    category: "computer-vision",
    relatedTerms: [
      "raft",
      "video-prediction",
      "pose-estimation",
      "egocentric-video",
      "data-enrichment",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Monocular Depth Estimation",
    slug: "monocular-depth-estimation",
    shortDefinition:
      "Monocular depth estimation predicts a per-pixel depth map from a single RGB image, inferring scene geometry without requiring a stereo camera pair or active depth sensor. This is achieved by neural networks trained on large corpora of RGB-depth pairs, learning visual cues such as perspective foreshortening, object size, and texture gradient that correlate with distance. Depth Anything V2 is the current standard for monocular depth in physical AI pipelines. Monocular depth enables depth enrichment at scale for video datasets collected with standard single-lens cameras.",
    category: "computer-vision",
    relatedTerms: [
      "depth-data",
      "depth-anything-v2",
      "rgb-d-data",
      "point-cloud",
      "data-enrichment",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Pose Estimation",
    slug: "pose-estimation",
    shortDefinition:
      "Pose estimation predicts the positions of anatomical landmarks — body joints, hand keypoints, or object corners — in 2D image coordinates or 3D space. Human body pose estimation produces skeleton representations used to understand how humans perform tasks, providing the reference demonstrations that robot learning systems imitate. Hand pose estimation localizes finger joints to capture dexterous manipulation in egocentric video. ViTPose is the standard vision transformer model for human pose estimation in physical AI data pipelines, trained on COCO Keypoints and MPII.",
    category: "computer-vision",
    relatedTerms: [
      "keypoint-annotation",
      "vitpose",
      "hand-object-interaction",
      "data-enrichment",
      "egocentric-video",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Workplace Egocentric Video Case Study",
        href: "/case-studies/workplace-egocentric-data",
      },
    ],
  },

  {
    term: "Hand-Object Interaction (HOI)",
    slug: "hand-object-interaction",
    shortDefinition:
      "Hand-object interaction (HOI) refers to the detection, segmentation, and analysis of the contact relationship between human hands and objects in video — identifying which hand is touching which object, the contact region, grip type, and the resulting object state change. HOI annotations are critical for robotics training data because manipulation tasks are fundamentally about how hands (and by extension, robot end-effectors) interact with objects. HOI detection in egocentric video provides the ground-truth skill demonstrations that robot manipulation policies learn from.",
    category: "computer-vision",
    relatedTerms: [
      "pose-estimation",
      "egocentric-video",
      "keypoint-annotation",
      "semantic-segmentation",
      "6-dof-grasp-planning",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      {
        label: "Workplace Egocentric Video Case Study",
        href: "/case-studies/workplace-egocentric-data",
      },
    ],
  },

  {
    term: "Object Tracking",
    slug: "object-tracking",
    shortDefinition:
      "Object tracking maintains the identity of one or more objects across consecutive video frames, assigning consistent identifiers as objects move, become occluded, or change appearance. Tracking converts per-frame detections into temporally coherent object trajectories, which are essential for understanding how objects are manipulated over time. In physical AI training data, tracking links object instances across frames to enable identity-consistent annotations, trajectory prediction training, and the temporal association needed for action segmentation and reward learning.",
    category: "computer-vision",
    relatedTerms: [
      "instance-segmentation",
      "bounding-box-annotation",
      "sam",
      "temporal-annotation",
      "video-prediction",
    ],
    usedIn: [
      {
        label: "Object Identity Persistence Case Study",
        href: "/case-studies/object-identity-persistence",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Video Annotation",
        href: "/pillars/enrich/video-annotation",
      },
    ],
  },

  {
    term: "Video Prediction",
    slug: "video-prediction",
    shortDefinition:
      "Video prediction is the task of generating plausible future video frames given a sequence of past frames, requiring a model to understand scene dynamics, object physics, and the temporal evolution of appearance. Video prediction models are a form of learned world model: they internalize how objects move, deform, and interact under physical constraints. Training video prediction models requires large corpora of real-world video with diverse motion patterns — not just static scene images — making egocentric and robotics video particularly valuable for this task.",
    category: "computer-vision",
    relatedTerms: [
      "world-model",
      "optical-flow",
      "diffusion-transformer",
      "egocentric-video",
    ],
    usedIn: [
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
      {
        label: "Expert Preference Data for Video Generation",
        href: "/solutions/video-generation-training-data",
      },
    ],
  },

  {
    term: "SAM (Segment Anything Model)",
    slug: "sam",
    shortDefinition:
      "SAM (Segment Anything Model) is a promptable image segmentation model developed by Meta AI that generates high-quality object masks from point, box, or text prompts, without task-specific training. SAM can segment any object in an image — known or unknown — making it a general-purpose tool for annotation automation. SAM3 (the video-capable version) tracks and segments objects across video frames. Claru uses SAM3 as a standard layer in its enrichment pipeline to produce segmentation masks for every object in egocentric video collections.",
    category: "computer-vision",
    relatedTerms: [
      "semantic-segmentation",
      "instance-segmentation",
      "panoptic-segmentation",
      "object-tracking",
      "data-enrichment",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Panoptic Segmentation",
    slug: "panoptic-segmentation",
    shortDefinition:
      "Panoptic segmentation combines semantic segmentation and instance segmentation into a unified output where every pixel is assigned both a class label and an instance identifier. Countable objects (things) such as cups, hands, and tools receive unique instance IDs, while background regions (stuff) such as floor, table, and wall receive class labels only. Panoptic segmentation provides the most complete pixel-level scene understanding, enabling robot systems to simultaneously know what type every surface is and which individual object is which without running two separate pipelines.",
    category: "computer-vision",
    relatedTerms: [
      "semantic-segmentation",
      "instance-segmentation",
      "sam",
      "depth-data",
    ],
    usedIn: [
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  // ── Robotics Fundamentals ────────────────────────────────────────────────

  {
    term: "Imitation Learning",
    slug: "imitation-learning",
    shortDefinition:
      "Imitation learning is a class of robot learning methods in which a policy is trained to replicate the behavior of an expert demonstrator, learning from observations of how a human or expert robot performs a task rather than from trial-and-error exploration. The simplest form of imitation learning is behavioral cloning, which treats demonstration data as a supervised learning problem. More advanced approaches like DAgger and inverse reinforcement learning address the distributional shift problem that arises when the policy encounters states outside the demonstration distribution.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "behavioral-cloning",
      "teleoperation-data",
      "manipulation-trajectory",
      "rlhf",
      "diffusion-policy",
    ],
    usedIn: [
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Teleoperation Dataset Collection",
        href: "/solutions/teleoperation-data",
      },
    ],
  },

  {
    term: "Behavioral Cloning (BC)",
    slug: "behavioral-cloning",
    shortDefinition:
      "Behavioral cloning (BC) is the simplest form of imitation learning, treating demonstration data as a supervised learning problem: given an observation, predict the action the expert demonstrator took. A policy is trained by minimizing the difference between predicted and demonstrated actions across a dataset of (observation, action) pairs. BC is data-efficient and straightforward to implement but suffers from compounding errors when the policy encounters states slightly outside the demonstration distribution, since small mistakes at each step can compound into large deviations over a long trajectory.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "imitation-learning",
      "teleoperation-data",
      "manipulation-trajectory",
      "visuomotor-policy",
      "action-chunking",
    ],
    usedIn: [
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
    ],
  },

  {
    term: "Sim-to-Real Gap",
    slug: "sim-to-real-gap",
    shortDefinition:
      "The sim-to-real gap refers to the performance degradation that occurs when a robot policy trained in simulation is deployed on physical hardware, caused by discrepancies between simulated and real-world visual appearance, physics, sensor noise, and actuator dynamics. Even photorealistic simulators produce textures, lighting, contact physics, and deformable object behavior that differ measurably from the real world. Bridging the sim-to-real gap requires either domain randomization during simulation training, real-world fine-tuning data, or both in combination.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "domain-randomization",
      "synthetic-data",
      "imitation-learning",
      "physical-ai",
      "manipulation-trajectory",
    ],
    usedIn: [
      {
        label: "Closing the Sim-to-Real Gap",
        href: "/solutions/sim-to-real-data",
      },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
    ],
  },

  {
    term: "Domain Randomization",
    slug: "domain-randomization",
    shortDefinition:
      "Domain randomization is a simulation training technique that trains a policy across a wide range of randomized visual and physical simulation parameters — object textures, lighting colors, camera positions, friction coefficients, and object masses — so that the real world appears as just another variation in the training distribution. By training on many randomized environments, the policy learns representations that are robust to the specific parameter values, making it more likely to transfer to the real-world domain. Domain randomization reduces the sim-to-real gap without requiring large amounts of real-world data.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "sim-to-real-gap",
      "synthetic-data",
      "imitation-learning",
      "dataset-diversity",
    ],
    usedIn: [
      {
        label: "Closing the Sim-to-Real Gap",
        href: "/solutions/sim-to-real-data",
      },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
    ],
  },

  {
    term: "Action Chunking",
    slug: "action-chunking",
    shortDefinition:
      "Action chunking is a technique in robot learning where the policy predicts a short sequence of future actions (a chunk) rather than a single action at each timestep, then executes that chunk before predicting the next one. Chunking reduces the effective frequency of policy inference, lowering latency demands on the policy network, and enables the policy to plan ahead within the chunk horizon. The Action Chunking with Transformers (ACT) method popularized this approach, demonstrating that chunks of 10-100 actions significantly improve performance on dexterous manipulation tasks compared to single-step action prediction.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "behavioral-cloning",
      "diffusion-policy",
      "manipulation-trajectory",
      "visuomotor-policy",
      "teleoperation-data",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
    ],
  },

  {
    term: "Diffusion Policy",
    slug: "diffusion-policy",
    shortDefinition:
      "Diffusion Policy is a robot learning method that frames action prediction as a conditional denoising diffusion process: the policy generates action sequences by iteratively removing noise from a random sample, conditioned on the current visual observation. Diffusion models naturally represent multi-modal action distributions — situations where multiple different actions are all correct responses to the same observation — which standard regression-based behavioral cloning cannot capture. Diffusion Policy achieves state-of-the-art performance on dexterous manipulation benchmarks and underlies the action heads in several commercial humanoid platforms.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "behavioral-cloning",
      "action-chunking",
      "imitation-learning",
      "visuomotor-policy",
      "pi-zero",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
    ],
  },

  {
    term: "Reward Model",
    slug: "reward-model",
    shortDefinition:
      "A reward model is a neural network trained to predict a scalar quality score for a given AI output — a robot trajectory, a text response, or a video — based on human preference annotations. The reward model encodes human judgment as a differentiable function, allowing reinforcement learning algorithms to optimize a policy toward outputs that humans prefer. Reward models trained on low-quality or inconsistent preference annotations produce reward hacking: policies that score highly on the reward model while producing outputs humans actually dislike. High inter-annotator agreement is essential for reliable reward model training.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "rlhf",
      "preference-annotation",
      "inter-annotator-agreement",
      "behavioral-cloning",
    ],
    usedIn: [
      { label: "RLHF & Preference Data", href: "/pillars/enrich/rlhf" },
      {
        label: "Expert RLHF Annotation",
        href: "/solutions/expert-rlhf-annotation",
      },
      {
        label: "Crowdsourced vs Expert RLHF",
        href: "/solutions/crowdsourced-vs-expert-rlhf",
      },
    ],
  },

  {
    term: "6-DOF Grasp Planning",
    slug: "6-dof-grasp-planning",
    shortDefinition:
      "6-DOF grasp planning determines the full six-degrees-of-freedom pose — three translational (x, y, z) and three rotational (roll, pitch, yaw) — at which a robot end-effector should approach and grasp an object. Unlike top-down planar grasping, 6-DOF planning considers arbitrary object geometries and orientations, enabling grasps from the side, below, or at any angle. Training 6-DOF grasp networks requires point cloud or RGB-D data paired with labels specifying grasp quality scores or binary success labels for sampled grasp poses.",
    category: "robotics-fundamentals",
    relatedTerms: [
      "point-cloud",
      "rgb-d-data",
      "depth-data",
      "manipulation-trajectory",
      "hand-object-interaction",
    ],
    usedIn: [
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Manipulation Trajectory Data",
        href: "/solutions/manipulation-trajectory-data",
      },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  // ── Models & Architectures ───────────────────────────────────────────────

  {
    term: "RAFT (Optical Flow)",
    slug: "raft",
    shortDefinition:
      "RAFT (Recurrent All-Pairs Field Transforms) is a deep learning architecture for optical flow estimation that builds a 4D correlation volume for all pairs of pixels between two frames and iteratively updates a flow estimate using recurrent refinement steps. RAFT achieves state-of-the-art accuracy on optical flow benchmarks (Sintel, KITTI) and runs efficiently enough for large-scale video processing pipelines. Claru uses RAFT as the standard optical flow model in its enrichment pipeline, computing dense motion fields for every consecutive frame pair in egocentric video collections.",
    category: "models-architectures",
    relatedTerms: [
      "optical-flow",
      "data-enrichment",
      "egocentric-video",
      "video-prediction",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "Depth Anything V2",
    slug: "depth-anything-v2",
    shortDefinition:
      "Depth Anything V2 is a monocular depth estimation model developed by researchers at the University of Hong Kong and TikTok, trained on a combination of labeled real-world data and large-scale synthetic data to produce high-quality relative and metric depth maps from single RGB images. The V2 release improved fine-grained detail accuracy on transparent, reflective, and occluded surfaces compared to V1, making it more reliable for real-world robotics enrichment. Depth Anything V2 is the standard depth estimation model in Claru's video enrichment pipeline.",
    category: "models-architectures",
    relatedTerms: [
      "monocular-depth-estimation",
      "depth-data",
      "rgb-d-data",
      "data-enrichment",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      { label: "Embodied AI Datasets", href: "/embodied-ai-datasets" },
    ],
  },

  {
    term: "ViTPose",
    slug: "vitpose",
    shortDefinition:
      "ViTPose is a human pose estimation model that uses a plain Vision Transformer (ViT) backbone, demonstrating that the transformer architecture that dominates NLP and image classification also achieves state-of-the-art performance on keypoint detection tasks without task-specific architectural modifications. ViTPose is trained on COCO Keypoints and MPII Human Pose datasets and supports whole-body pose including body, hand, face, and foot keypoints. Claru uses ViTPose to extract 2D and 3D joint positions from egocentric video as a standard enrichment layer for robotics training data.",
    category: "models-architectures",
    relatedTerms: [
      "pose-estimation",
      "keypoint-annotation",
      "vision-transformer",
      "data-enrichment",
      "hand-object-interaction",
    ],
    usedIn: [
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
      {
        label: "Workplace Egocentric Video Case Study",
        href: "/case-studies/workplace-egocentric-data",
      },
    ],
  },

  {
    term: "Open X-Embodiment (OXE)",
    slug: "open-x-embodiment",
    shortDefinition:
      "Open X-Embodiment (OXE) is a large-scale robot learning dataset released by Google DeepMind and collaborators in 2023, aggregating over 1 million robot trajectories from 22 different robot embodiments across 21 research institutions. OXE provides the broadest available collection of real-robot manipulation demonstrations and was used to train the RT-X family of models, demonstrating that cross-embodiment pre-training improves policy performance on new robots. OXE is publicly available but covers a limited set of robot platforms, environments, and task categories compared to what production robotics teams require.",
    category: "models-architectures",
    relatedTerms: [
      "cross-embodiment-data",
      "foundation-model-robotics",
      "vla",
      "behavioral-cloning",
      "manipulation-trajectory",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
      { label: "Egocentric Video Datasets", href: "/egocentric-video-datasets" },
    ],
  },

  {
    term: "Diffusion Transformer (DiT)",
    slug: "diffusion-transformer",
    shortDefinition:
      "A Diffusion Transformer (DiT) is a neural network architecture that applies the transformer architecture — with self-attention and feed-forward layers arranged in a sequence — as the backbone of a diffusion model, replacing the U-Net architecture that dominated earlier diffusion model designs. DiT models scale more predictably with model size and training data than U-Net-based diffusion models and have become the architecture of choice for video generation and world model training. Sora, Stable Video Diffusion, and several robotics world models use DiT-based architectures.",
    category: "models-architectures",
    relatedTerms: [
      "vision-transformer",
      "world-model",
      "video-prediction",
      "diffusion-policy",
    ],
    usedIn: [
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      {
        label: "Expert Preference Data for Video Generation",
        href: "/solutions/video-generation-training-data",
      },
      {
        label: "VLA Training Data Guide",
        href: "/vla-training-data-guide",
      },
    ],
  },

  {
    term: "Vision Transformer (ViT)",
    slug: "vision-transformer",
    shortDefinition:
      "A Vision Transformer (ViT) is an image recognition architecture that applies the transformer architecture directly to images by splitting an image into fixed-size patches, linearly embedding each patch, and processing the sequence of patch embeddings with standard transformer self-attention layers. ViT models, introduced by Dosovitskiy et al. in 2021, achieve state-of-the-art performance on image classification when trained on large enough datasets and have become the standard backbone for a wide range of vision models including object detection, segmentation, pose estimation, and VLA models.",
    category: "models-architectures",
    relatedTerms: [
      "vitpose",
      "diffusion-transformer",
      "vla",
      "foundation-model-robotics",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      { label: "Physical AI Training Data", href: "/physical-ai-training-data" },
      {
        label: "Data Enrichment Pipeline for Physical AI",
        href: "/blog/data-enrichment-pipeline-physical-ai",
      },
    ],
  },

  {
    term: "GR00T N1 (NVIDIA)",
    slug: "groot-n1",
    shortDefinition:
      "GR00T N1 is a general-purpose humanoid robot foundation model developed by NVIDIA, announced in 2025, designed to serve as a pre-trained base that robotics teams can fine-tune for specific humanoid platforms and tasks. GR00T N1 processes multimodal inputs including video, text, and proprioceptive state, and outputs motor actions. The model was trained on a combination of real robot demonstrations from the Open X-Embodiment dataset, synthetic simulation data from NVIDIA Isaac, and synthetic video generated from physical simulations, representing a hybrid data strategy for humanoid generalization.",
    category: "models-architectures",
    relatedTerms: [
      "vla",
      "foundation-model-robotics",
      "humanoid-robot",
      "cross-embodiment-data",
      "pi-zero",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
    ],
  },

  {
    term: "pi-zero (Physical Intelligence)",
    slug: "pi-zero",
    shortDefinition:
      "pi-zero is a general-purpose robot foundation model developed by Physical Intelligence (pi), released in late 2024. pi-zero uses a flow-matching action head built on top of a pre-trained vision-language model backbone, enabling zero-shot and few-shot generalization to new tasks and robot embodiments. Physical Intelligence trained pi-zero on a large proprietary dataset of robot demonstrations spanning multiple robot platforms and diverse manipulation tasks, including dexterous tasks like laundry folding, table bussing, and grocery bagging that previous general-purpose models struggled to perform reliably.",
    category: "models-architectures",
    relatedTerms: [
      "vla",
      "foundation-model-robotics",
      "diffusion-policy",
      "groot-n1",
      "cross-embodiment-data",
    ],
    usedIn: [
      { label: "VLA Training Data Guide", href: "/vla-training-data-guide" },
      {
        label: "Training Data for Robotics",
        href: "/training-data-for-robotics",
      },
      {
        label: "Open Datasets vs Custom Collection",
        href: "/solutions/open-datasets-vs-custom",
      },
    ],
  },
];

// Ordered category list for display
export const CATEGORY_ORDER: GlossaryCategory[] = [
  "physical-ai-systems",
  "data-modalities",
  "annotation-types",
  "data-quality-pipelines",
  "computer-vision",
  "robotics-fundamentals",
  "models-architectures",
];

export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.category === category);
}

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}
