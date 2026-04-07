import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "teleoperation-data",
  termSlug: "teleoperation-data",
  category: "data-modalities",
  metaTitle: "Teleoperation Data for Robot Training — Definition | Claru",
  metaDescription: "Teleoperation data pairs robot observations with human-commanded actions during remote control. Learn collection methods, hardware setups, and quality requirements.",
  primaryKeyword: "teleoperation data",
  secondaryKeywords: ["teleop data robotics", "teleoperation dataset", "remote robot control data", "robot demonstration data", "teleop collection"],
  canonicalPath: "/glossary/teleoperation-data",
  h1: "Teleoperation Data: Human-Guided Robot Demonstrations for Policy Training",
  heroSubtitle: "Teleoperation data consists of synchronized recordings of what a robot sees and what a human operator commands it to do during remote-controlled task execution. This paired observation-action format provides the ground-truth training signal for imitation learning, behavioral cloning, and VLA model fine-tuning. Teleoperation data is the highest-quality source of robot action labels because the actions are executed on the actual deployment hardware.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Teleoperation Data", href: "/glossary/teleoperation-data" },
  ],
  sections: [],
  faqs: [
    {
      question: "What teleoperation interfaces are used for data collection?",
      answer: "Three main categories: (1) VR controllers (Meta Quest, HTC Vive) — the operator wears a VR headset showing the robot's camera feed and uses hand controllers to command the robot's end-effector. Best for 6-DOF manipulation. (2) Leader-follower arms — two identical robot arms where the operator physically moves the 'leader' and the 'follower' mirrors the motion. Best for kinesthetic teaching with natural force feedback. (3) Exoskeletons and gloves — wearable devices that map hand and arm motion to robot commands. Best for dexterous manipulation with high DOF. Each interface has tradeoffs in setup cost, operator training time, and data quality.",
    },
    {
      question: "How many teleoperation demonstrations are needed per task?",
      answer: "For single-task behavioral cloning: 100-500 demonstrations for simple tasks (reach and grasp), 500-2,000 for moderate tasks (pick and place with varied objects), and 2,000-10,000 for complex multi-step tasks (assembly, tool use). For VLA model fine-tuning: 10,000-50,000 demonstrations across the target task family. These numbers assume high-quality demonstrations from skilled operators. More demonstrations from novice operators are needed to achieve the same performance.",
    },
    {
      question: "What makes teleoperation data high quality?",
      answer: "Five quality dimensions: (1) Temporal synchronization — camera frames and action labels must be aligned to within 10ms. (2) Trajectory smoothness — demonstrations should have low jerk and consistent motion without unnecessary pauses. (3) Task completion — each demonstration should successfully complete the target task. (4) Diversity — demonstrations should vary initial conditions, object placements, and approach strategies. (5) Completeness — all sensor streams (RGB, depth, proprioception) must be recorded without gaps or corruption.",
    },
    {
      question: "What is the collection speed for teleoperation data?",
      answer: "A skilled operator collecting manipulation demonstrations typically produces 12-25 successful episodes per hour, with each episode lasting 30-120 seconds. This accounts for setup time between episodes, failed attempts (typically 10-30% failure rate), and rest breaks. At 20 episodes/hour average, collecting 10,000 demonstrations requires approximately 500 operator-hours. Collection speed improves with operator experience and decreases with task complexity.",
    },
  ],
  ctaHeading: "Need Teleoperation Data?",
  ctaDescription: "Claru provides professional teleoperation data collection on your specific robot hardware, with quality guarantees and format compatibility.",
  relatedGlossaryTerms: ["manipulation-trajectory", "vla", "behavioral-cloning", "imitation-learning", "action-space"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-setup-a-teleoperation-rig"],
  relatedSolutionSlugs: ["teleoperation-data"],
  longDefinition: `Teleoperation data is the gold standard for training robot manipulation policies because it provides ground-truth action labels at the exact embodiment that will be used during deployment. When a human operator remotely controls a robot to perform a task, the system simultaneously records what the robot's cameras see (observations) and what joint positions, end-effector poses, or motor commands the operator sends (actions). This synchronized (observation, action) pair at every timestep is exactly the training signal that behavioral cloning, Diffusion Policy, and VLA models consume.

The key advantage over other data collection methods is embodiment fidelity. Kinesthetic teaching (physically moving the robot by hand) produces different dynamics than autonomous execution because the human's hand affects the robot's inertia and compliance. Video demonstration (watching a human perform a task) requires an inverse dynamics model to infer robot actions from visual observations. Teleoperation produces actions that are native to the robot's action space and control interface, with the physical dynamics of the robot included in the recording.

A teleoperation data recording typically includes: RGB images from one or more cameras at 15-30 fps, depth maps from stereo or structured-light cameras, proprioceptive state (joint positions, velocities, and optionally torques) at 50-200 Hz, end-effector pose (position and orientation) at the control frequency, gripper state (open/close/continuous width), and metadata including task description, robot URDF, camera calibration matrices, and episode success/failure labels.

The control frequency of teleoperation data is a critical design parameter. Most manipulation policies operate at 10-20 Hz, meaning the robot receives a new action command 10-20 times per second. The teleoperation system must record actions at this frequency or higher. Lower control frequencies (2-5 Hz) limit the policy's ability to make reactive adjustments, while higher frequencies (50-100 Hz) capture fine-grained dynamics but increase data volume and may require interpolation for policies that run at lower frequencies.`,

  historicalContext: `Teleoperation technology dates to the 1940s when Raymond Goertz developed mechanical master-slave manipulators for handling radioactive materials at Argonne National Laboratory. These systems established the fundamental teleoperation principle: a human moves a "master" device, and a "slave" robot reproduces the motion remotely.

The first use of teleoperation for robot learning data was in the late 1990s and early 2000s. Atkeson and Schaal (1997) used kinesthetic teaching (a form of direct teleoperation) to collect demonstrations for robot arm control. However, the scale was limited — dozens to hundreds of demonstrations, collected one at a time by researchers.

The data collection revolution began around 2019-2020 with the development of scalable teleoperation infrastructure. UC Berkeley's Bridge Data project (2022) demonstrated that VR teleoperation could collect 60,000+ manipulation demonstrations across 13 task categories using consumer VR hardware (Oculus Quest). Google's RT-1 dataset (2022) used a fleet of robots with professional teleoperators to collect 130,000 demonstrations. These projects proved that teleoperation data collection could be professionalized and scaled.

The Open X-Embodiment project (2023) aggregated teleoperation data from 22 different robot embodiments across 21 research institutions, totaling over 1 million trajectories. This established teleoperation data as a community resource and demonstrated that cross-embodiment data can improve transfer learning. The trend since has been toward larger, more diverse teleoperation datasets, with companies like Physical Intelligence, Figure AI, and Agility Robotics investing heavily in data collection infrastructure.

Hardware innovations have reduced the barrier to teleoperation. GELLO (Wu et al., 2023) and UMI (Chi et al., 2024) introduced low-cost leader-follower systems that enable teleoperation for under $5,000 total hardware cost, compared to $50,000+ for industrial systems. This democratization has expanded teleoperation data collection from well-funded labs to a broader research community.`,

  practicalImplications: `Collecting production-quality teleoperation data requires careful attention to three areas: infrastructure setup, operator management, and quality control.

Infrastructure setup determines the ceiling on data quality. Cameras must be rigidly mounted with known calibration (intrinsics and extrinsics). Time synchronization between cameras, robot state, and action commands must be verified — even 50ms of drift between camera frames and action labels degrades policy performance measurably. Data recording software should validate each episode immediately after collection, checking for missing frames, synchronization drift, and file integrity. Storage must handle the data throughput — a single robot with two cameras recording at 30 fps generates approximately 2-5 GB per hour.

Operator management is the most impactful factor for dataset quality. Skilled operators produce smooth, efficient trajectories that train better policies than novice operators. Operator training typically requires 4-8 hours of practice before collection quality stabilizes. Rotating operators (3-5 per task) prevents operator-specific biases from dominating the dataset. Monitoring operator fatigue is essential — demonstration quality degrades measurably after 2-3 hours of continuous collection, and 15-minute breaks every 90 minutes maintain quality.

Quality control should operate at three levels. Real-time checks during collection flag episodes with synchronization errors, excessive duration, or missing data. Post-session review (sampling 10-20% of episodes for human evaluation) catches systematic issues. Dataset-level analysis after collection computes statistics on action distributions, trajectory durations, task success rates, and inter-operator consistency, identifying gaps that require additional collection. Filtering the bottom 10-20% of demonstrations by quality metrics (smoothness, success, duration) consistently improves trained policy performance.

Data format standardization is essential for downstream usability. RLDS format (used by Open X-Embodiment, Octo, and OpenVLA) is the emerging standard for robot learning. HDF5 remains common in PyTorch-based pipelines. The dataset should include a loading script with example code, dataset statistics, and integration tests that verify data integrity.`,

  commonMisconceptions: [
    {
      misconception: "Any teleoperation data is useful for training — quantity matters more than quality.",
      correction: "Data quality has a stronger impact on policy performance than quantity. Demonstrations with jerky motions, excessive pauses, or failed grasps inject noise into the training signal. The ACT paper showed that 50 high-quality demonstrations outperform 500 low-quality ones. Filtering the bottom 20% of demonstrations by smoothness metrics improves success rates by 15-25%. Investing in operator training and real-time quality monitoring yields better policies per dollar than maximizing raw demonstration count.",
    },
    {
      misconception: "VR teleoperation is always better than leader-follower arms.",
      correction: "Each interface excels in different scenarios. VR teleoperation provides intuitive 6-DOF control and works well for wrist-camera robots, but lacks force feedback, making contact-rich tasks (insertion, assembly) difficult to teleop smoothly. Leader-follower arms provide natural force feedback and work well for bimanual manipulation (as used in the ALOHA system) but require the leader arm to be co-located with the follower. Exoskeletons are best for dexterous manipulation but are the most expensive. The choice should match the target task's control requirements.",
    },
    {
      misconception: "Teleoperation data must be collected on the exact deployment robot to be useful.",
      correction: "Cross-embodiment transfer is possible and increasingly effective. The Open X-Embodiment project demonstrated that training on data from 22 different robot embodiments improves policy generalization compared to single-embodiment training. However, the final fine-tuning stage should use data from the deployment embodiment. The practical approach is to pretrain on diverse cross-embodiment data (including data from different robots) and fine-tune on 1,000-5,000 demonstrations from the target robot.",
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
      id: "chi-umi-2024",
      title: "Universal Manipulation Interface: In-The-Wild Robot Teaching Without a Robot",
      authors: "Chi et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.10329",
    },
    {
      id: "wu-gello-2023",
      title: "GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework for Robot Manipulators",
      authors: "Wu et al.",
      venue: "arXiv 2309.13037",
      year: 2023,
      url: "https://arxiv.org/abs/2309.13037",
    },
    {
      id: "zhao-aloha-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
  ],
  claruRelevance: `Teleoperation data collection is Claru's core service. We deploy trained operators on client robot hardware, using the teleoperation interface best suited to each task — VR controllers for 6-DOF manipulation, leader-follower arms for contact-rich tasks, and exoskeletons for dexterous work.

Our quality pipeline ensures every delivered dataset meets production standards: temporal synchronization validated to within 10ms, trajectory smoothness metrics computed and filtered, task success verified per episode, and data delivered in the client's preferred format (RLDS, HDF5, zarr) with complete metadata and loading scripts. With 10,000+ trained operators across 100+ cities, Claru provides the scale and diversity needed for production VLA and manipulation policy training.`,
};

export default data;
