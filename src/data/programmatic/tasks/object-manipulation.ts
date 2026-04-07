import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "object-manipulation",
  metaTitle: "Object Manipulation Training Data for Robotics | Claru",
  metaDescription:
    "Training data for object manipulation tasks: pick-and-place, stacking, and general-purpose grasping. Data requirements, formats, and model compatibility for robot learning.",
  primaryKeyword: "object manipulation training data",
  secondaryKeywords: [
    "robot manipulation dataset",
    "pick and place training data",
    "manipulation demonstrations",
    "robotic manipulation data",
    "grasping dataset",
    "tabletop manipulation data",
  ],
  canonicalPath: "/training-data/object-manipulation",
  h1: "Object Manipulation Training Data",
  heroSubtitle:
    "Purpose-built datasets for training robot manipulation policies — from single-object pick-and-place to complex multi-step rearrangement tasks in cluttered environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Object Manipulation", href: "/training-data/object-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Object Manipulation Data Matters",
      paragraphs: [
        "Object manipulation is the foundational capability for nearly every useful robot. Whether a robot is sorting packages in a warehouse, loading a dishwasher, or assembling electronics, it must grasp, transport, and place physical objects with precision and reliability. Training policies for these tasks requires large-scale, diverse demonstration data that captures the full distribution of object geometries, surface properties, lighting conditions, and scene configurations a robot will encounter in deployment.",
        "The challenge is not merely volume but coverage. A manipulation policy trained on 10,000 demonstrations of picking up cubes will fail on cylinders. Research from Google DeepMind's RT-2 (Brohan et al., 2023) showed that scaling to 130,000 demonstrations across hundreds of object categories was necessary to achieve robust generalization. The Open X-Embodiment project (O'Neill et al., 2024) further demonstrated that cross-embodiment data from multiple robot platforms improves manipulation success rates by 50% compared to single-robot datasets. These findings establish that both object diversity and embodiment diversity are necessary for general-purpose manipulation.",
        "Real-world deployment demands data collected in physical environments, not just simulation. While sim-to-real transfer has improved with domain randomization techniques (Tobin et al., 2017), policies trained exclusively on synthetic data still exhibit a 15-30% performance gap on novel objects compared to those trained on real-world demonstrations (James et al., 2019). This gap is especially pronounced for deformable objects, transparent surfaces, and cluttered scenes where physics engines produce unrealistic contact dynamics. The gap persists even with state-of-the-art rendering: transparent objects (bottles, glasses) cause depth sensor failures that simulators do not reproduce, and deformable objects (bags, cables, cloth) have contact physics too complex for real-time simulation.",
        "The economics of manipulation data collection have shifted dramatically with the rise of foundation models. A team building a single-task policy (e.g., 'pick up a specific part from a tray') needs 50-500 demonstrations and can collect them in-house in a few days. A team fine-tuning a foundation model (OpenVLA, Octo, Pi-zero) for a new domain needs 5,000-50,000 demonstrations spanning diverse tasks and objects — a multi-week or multi-month collection effort requiring professional infrastructure. And a team building a proprietary foundation model from scratch needs 100,000-1,000,000+ demonstrations, which is infeasible without distributed collection across many sites and operators. At each scale, the data quality requirements are different: single-task data must be precise but narrow, while foundation model data must be diverse even at the cost of individual demonstration perfection.",
      ],
    },
    {
      type: "stats",
      heading: "Object Manipulation Data at Scale",
      stats: [
        { value: "50K-200K", label: "Demonstrations for robust policies" },
        { value: "30 Hz", label: "Typical video capture rate" },
        { value: "100+", label: "Object categories needed" },
        { value: "386K+", label: "Claru annotated clips available" },
        { value: "50%", label: "Success improvement from cross-embodiment data" },
        { value: "15-30%", label: "Sim-to-real performance gap on novel objects" },
      ],
    },
    {
      type: "cards",
      heading: "Core Data Modalities",
      cards: [
        {
          title: "RGB Video",
          description:
            "Multi-view RGB streams from wrist-mounted and third-person cameras capture visual context, object appearance, and hand-object spatial relationships essential for visuomotor policies.",
          icon: "camera",
        },
        {
          title: "Depth & Point Clouds",
          description:
            "Structured depth maps and 3D point clouds from stereo or LiDAR sensors provide geometric information critical for 6-DOF grasp planning and collision avoidance in cluttered scenes.",
          icon: "cube",
        },
        {
          title: "Proprioceptive State",
          description:
            "Joint positions, velocities, torques, and end-effector poses sampled at 100-500 Hz give the policy access to the robot's internal state for compliant, adaptive manipulation.",
          icon: "activity",
        },
        {
          title: "Action Labels",
          description:
            "End-effector delta poses, joint position targets, or discrete action tokens annotated at the control frequency define the supervision signal for imitation learning.",
          icon: "tag",
        },
        {
          title: "Language Instructions",
          description:
            "Natural language task descriptions paired with demonstrations enable language-conditioned policies that generalize to novel instructions without retraining.",
          icon: "type",
        },
      ],
    },
    {
      type: "prose",
      heading: "Data Collection Approaches",
      paragraphs: [
        "Teleoperation remains the gold standard for collecting manipulation demonstrations. Leader-follower systems like ALOHA (Zhao et al., 2023) enable bimanual data collection at 50 Hz with sub-millimeter positional accuracy. VR-based teleoperation with devices like Meta Quest 3 offers lower hardware costs but introduces latency and kinematic mismatch that can degrade demonstration quality. The choice of interface directly impacts the downstream policy — ACT (Zhao et al., 2023) achieved a 20% higher success rate when trained on leader-follower data compared to VR-collected demonstrations on the same tasks.",
        "Kinesthetic teaching, where a human physically guides the robot, provides natural demonstrations but limits data throughput to roughly 5 demonstrations per hour. In contrast, experienced teleoperators can produce 20-40 demonstrations per hour on tabletop tasks. For large-scale data collection, parallelized teleoperation stations with multiple operators collecting simultaneously can reach throughputs of 200+ demonstrations per day. The DROID project demonstrated this at scale: 90 institutions collecting in parallel produced 76,000 demonstrations in months rather than the years a single lab would require.",
        "Autonomous data collection through scripted policies or reinforcement learning-guided exploration has emerged as a complement to human demonstrations. Google's RT-1 paper (Brohan et al., 2022) used a fleet of 13 robots operating autonomously for 17 months to collect 130,000 demonstrations. However, the resulting data distribution is biased toward already-learned behaviors, making human-collected edge cases essential for pushing policy boundaries. The practical approach is a hybrid: use autonomous collection for high-volume coverage of common manipulation scenarios, and human teleoperation for edge cases, novel objects, and failure recovery demonstrations.",
        "Data quality varies significantly by collection method and has measurable impact on downstream policy performance. Mandlekar et al. (2021) showed that filtering the bottom 20% of demonstrations by trajectory smoothness and task completion time improved Diffusion Policy success rates by 15% compared to training on unfiltered data. This finding has led to the practice of per-demonstration quality scoring: each demonstration is assigned scores for trajectory smoothness (jerk norm), task efficiency (completion time relative to expert baseline), grasp quality (stability after lift), and overall success. Low-scoring demonstrations are either excluded or downweighted during training.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Object Manipulation Data Requirements by Model Architecture",
      description: "Different model architectures have distinct data volume, observation, and format requirements. This table helps you plan collection based on your target architecture.",
      columns: ["Model", "Min. Demos", "Observation Space", "Action Space", "Key Format"],
      rows: [
        { Model: "RT-2", "Min. Demos": "100K+", "Observation Space": "RGB 320x320", "Action Space": "7-DoF EE delta", "Key Format": "RLDS/TFRecord" },
        { Model: "Octo", "Min. Demos": "25K+", "Observation Space": "RGB 256x256 + wrist cam", "Action Space": "7-DoF EE delta", "Key Format": "RLDS" },
        { Model: "Diffusion Policy", "Min. Demos": "100-200 per task", "Observation Space": "RGB 96x96 multi-view", "Action Space": "Joint positions", "Key Format": "HDF5/zarr" },
        { Model: "OpenVLA", "Min. Demos": "970K (pretrain)", "Observation Space": "RGB 224x224", "Action Space": "7-DoF EE delta", "Key Format": "RLDS" },
        { Model: "ACT (ALOHA)", "Min. Demos": "50 per task", "Observation Space": "RGB multi-view", "Action Space": "Joint positions", "Key Format": "HDF5" },
        { Model: "Pi-zero", "Min. Demos": "10K+ (fine-tune)", "Observation Space": "RGB multi-view + language", "Action Space": "Flow-matched actions", "Key Format": "Custom/RLDS" },
        { Model: "HPT", "Min. Demos": "200K+ (pretrain)", "Observation Space": "RGB + proprioception", "Action Space": "Heterogeneous", "Key Format": "RLDS" },
      ],
    },
    {
      type: "prose",
      heading: "Quality Requirements and Annotation Standards",
      paragraphs: [
        "High-quality manipulation data requires precise temporal synchronization across all sensor streams. Camera timestamps must be aligned within 5 ms of proprioceptive readings to prevent the policy from learning incorrect visual-action correspondences. At typical manipulation velocities (0.3-1.0 m/s), a 10 ms desynchronization means the visual observation and the corresponding action are spatially offset by 3-10 mm — enough to degrade fine manipulation performance. Claru's data collection infrastructure uses hardware-triggered synchronization to guarantee sub-millisecond alignment across up to 8 simultaneous camera streams, with verification at the start of each collection session.",
        "Annotation standards for manipulation data extend beyond simple task success labels. Rich annotations include grasp type classification (power, pinch, lateral, precision), contact event timestamps (first-contact, stable-grasp, lift-off, pre-place, release), object state changes (picked, transported, placed, stacked, inserted), and failure mode categorization (slip, collision, timeout, wrong object, partial completion). These structured annotations enable filtering and curriculum learning strategies that can improve training efficiency by 30-40% compared to naive random sampling (Mandlekar et al., 2021). For language-conditioned models, each demonstration additionally requires a natural language task description that is both accurate and varied — templated descriptions like 'pick up the red cube' produce worse language grounding than diverse phrasings like 'grab that red block,' 'get the crimson cube,' 'pick up the small red box.'",
        "Data diversity is quantified along multiple axes: object geometry (convex, concave, articulated), material properties (rigid, deformable, granular), scene complexity (isolated, cluttered, occluded), and task variation (pick-place, stack, insert, pour, open, close). A production-grade manipulation dataset should cover at least 100 distinct object instances across 10+ material categories, collected in 5+ distinct environment configurations. The object set must include challenging categories that trip up vision systems: transparent objects (glass, clear plastic), reflective objects (metal, mirrors), thin objects (cards, papers), and small objects (screws, pills). Claru datasets routinely exceed these thresholds with data from over 100 cities worldwide.",
        "Object diversity follows a power law in real-world deployment: 80% of manipulation acts involve 20% of object categories (common items like boxes, bottles, cups), while the remaining 80% of categories appear rarely but critically. Training data must cover the long tail to prevent catastrophic failures on uncommon objects. Claru's object sampling protocol allocates 60% of collection episodes to common objects (ensuring deep coverage) and 40% to long-tail objects (ensuring breadth), with the long-tail set rotated across collection sessions to maximize unique object exposure without sacrificing per-object repetition count.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for General Object Manipulation",
      description: "Public manipulation datasets vary in scale, diversity, and modality coverage. Understanding these helps identify gaps your custom dataset needs to fill.",
      columns: ["Dataset", "Year", "Scale", "Objects", "Modalities", "Availability"],
      rows: [
        { "Dataset": "RT-1/RT-2 (Google)", "Year": "2022-23", "Scale": "130K episodes", "Objects": "Hundreds of kitchen items", "Modalities": "RGB + language", "Availability": "Proprietary" },
        { "Dataset": "DROID", "Year": "2024", "Scale": "76K demos", "Objects": "Diverse (564 tasks)", "Modalities": "RGB-D + wrist + proprioception", "Availability": "Public" },
        { "Dataset": "Open X-Embodiment", "Year": "2024", "Scale": "1M+ episodes", "Objects": "Extremely diverse", "Modalities": "Mixed (varies by source)", "Availability": "Public" },
        { "Dataset": "Bridge V2", "Year": "2024", "Scale": "60K demos", "Objects": "Kitchen + tabletop", "Modalities": "RGB + wrist + language", "Availability": "Public" },
        { "Dataset": "RoboSet", "Year": "2023", "Scale": "100K+ trajectories", "Objects": "Kitchen items", "Modalities": "RGB multi-view + proprioception", "Availability": "Public" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "10K-500K+", "Objects": "Custom to spec (100+ categories)", "Modalities": "Full multi-modal", "Availability": "Built to spec" },
      ],
    },
    {
      type: "pipeline",
      heading: "Claru Data Delivery Pipeline",
      steps: [
        { stepNumber: 1, title: "Requirements Scoping", description: "Define target tasks, object categories, environment specifications, and data format requirements with your research team." },
        { stepNumber: 2, title: "Collection Protocol Design", description: "Design operator instructions, quality thresholds, and diversity sampling plans tailored to your manipulation task distribution." },
        { stepNumber: 3, title: "Parallel Data Collection", description: "Deploy trained operators across multiple collection sites with standardized hardware and real-time quality monitoring." },
        { stepNumber: 4, title: "Annotation & Enrichment", description: "Apply task-specific annotations: grasp types, contact events, object state labels, language descriptions, and success/failure classification with failure taxonomy." },
        { stepNumber: 5, title: "Quality Assurance", description: "Automated quality scoring (trajectory smoothness, sync verification, blur detection) plus 25% human spot-verification with inter-annotator agreement tracking." },
        { stepNumber: 6, title: "Format & Deliver", description: "Convert to your target format (RLDS, HDF5, zarr, WebDataset) with full metadata, camera calibrations, and stratified train/val/test splits." },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
        { id: "oneill-oxe-2024", title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models", authors: "O'Neill et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2310.08864" },
        { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
        { id: "brohan-rt1-2022", title: "RT-1: Robotics Transformer for Real-World Control at Scale", authors: "Brohan et al.", venue: "RSS 2023", year: 2022, url: "https://arxiv.org/abs/2212.06817" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "khazatsky-droid-2024", title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset", authors: "Khazatsky et al.", venue: "RSS 2024", year: 2024, url: "https://arxiv.org/abs/2403.12945" },
        { id: "mandlekar-robomimic-2021", title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation", authors: "Mandlekar et al.", venue: "CoRL 2021", year: 2021, url: "https://arxiv.org/abs/2108.03298" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations do I need for a robust manipulation policy?",
      answer:
        "The number depends on your model architecture, task complexity, and generalization requirements. Single-task policies using Diffusion Policy or ACT can achieve 80%+ success with 50-200 demonstrations per task, making them ideal for proof of concept and single-application deployments. Multi-task foundation models like Octo require 25,000+ demonstrations across diverse tasks and objects to generalize, while OpenVLA was pretrained on 970,000 demonstrations. Start with 100-200 demonstrations for a single task to validate your pipeline and prove feasibility, then scale based on evaluation metrics. The key insight from recent research is that demonstration diversity (number of unique objects, scenes, and task variations) matters more than repetition count: 5,000 diverse demonstrations outperform 20,000 demonstrations of the same 10 objects on held-out evaluation.",
    },
    {
      question: "What camera setup is best for collecting manipulation data?",
      answer:
        "A minimum of two views is recommended: one wrist-mounted camera for close-up hand-object interaction and one third-person overhead or angled camera for scene context. Research shows that dual-view setups improve policy performance by 15-25% over single-view (Zhao et al., 2023). For complex multi-object tasks, adding a second third-person view from a different angle further improves spatial reasoning. The wrist camera should be wide-angle (120+ degree FOV) and low-latency (< 50 ms), with the Intel RealSense D405 being the current standard for wrist-mount RGB-D. Third-person cameras should cover the full workspace at 640x480 minimum resolution. All cameras must be hardware-synchronized to within 5 ms. For foundation model training, include both raw images and calibration data so downstream users can compute 3D correspondences between views.",
    },
    {
      question: "Should I collect data in simulation or the real world?",
      answer:
        "Both have a place, but real-world data is essential for production deployment. Sim-to-real transfer still shows a 15-30% performance gap on novel objects, with the gap widest for transparent objects (depth sensor failures not modeled in simulation), deformable objects (contact physics too complex for real-time simulation), and cluttered scenes (collision detection artifacts). The recommended approach is to pretrain on simulation data for basic motor primitives and spatial reasoning, then fine-tune on 5,000-20,000 real-world demonstrations covering the deployment object distribution. For foundation model fine-tuning, real data is non-negotiable: the model needs to learn the visual and physical characteristics of real objects, not rendered approximations. Claru specializes in real-world data collection at scale, with 10,000+ trained collectors across 100+ cities.",
    },
    {
      question: "What data format should I use for manipulation demonstrations?",
      answer:
        "RLDS (Reinforcement Learning Datasets) is becoming the industry standard for cross-platform compatibility, used by Octo, OpenVLA, RT-X, and the Open X-Embodiment project. It stores episodes as TFRecord files with a standardized schema for observations, actions, rewards, and metadata, and supports efficient streaming for large-scale training. HDF5 is common for single-lab use with Diffusion Policy and ACT, offering simple random access to individual episodes. Zarr offers cloud-native streaming with chunked storage, making it ideal for datasets stored in S3 or GCS. WebDataset provides tar-based sequential access optimized for distributed training. Claru delivers in all four formats with full metadata, sensor calibration data, and provenance tracking. If unsure, start with RLDS for maximum compatibility with the current ecosystem.",
    },
    {
      question: "How do you handle the long tail of object categories in manipulation data?",
      answer:
        "Real-world manipulation follows a power law: 20% of object categories account for 80% of manipulation acts, but the remaining 80% of categories include critical items that must not fail (medication bottles, sharp tools, fragile electronics). We address this through structured sampling: 60% of collection episodes cover common objects with deep repetition, and 40% cover long-tail objects rotated across sessions for maximum breadth. Within the long tail, we prioritize categories that challenge vision systems: transparent objects (require depth backup), reflective objects (cause specular highlights), thin/flat objects (hard to grasp from surfaces), deformable objects (unpredictable contact), and small objects (below gripper finger width). Each long-tail category gets a minimum of 50 demonstrations to ensure meaningful representation in the training distribution.",
    },
    {
      question: "What throughput can I expect from professional manipulation data collection?",
      answer:
        "Throughput depends on task complexity and teleoperation interface. For simple pick-and-place tasks (single object, clear workspace), an experienced teleoperator produces 30-40 demonstrations per hour using a leader-follower setup like ALOHA or a SpaceMouse interface. For complex multi-step tasks (stack 3 objects, open a drawer and retrieve an item), throughput drops to 10-20 demonstrations per hour due to longer episode duration and higher failure rates. Parallelizing across multiple stations with dedicated operators, Claru achieves 200-500 demonstrations per day for simple tasks and 100-200 per day for complex tasks. A 10,000-demonstration dataset for foundation model fine-tuning typically requires 4-8 weeks of active collection with 2-4 parallel stations. We track throughput, success rate, and quality scores in real time to optimize collection scheduling.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Object Manipulation Data",
  ctaDescription:
    "Tell us about your target tasks, robot platform, and data volume needs. We will scope a collection plan and deliver production-ready datasets.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "vla", "cross-embodiment-transfer"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset", "how-to-label-robot-demonstrations"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  dataRequirements: {
    modality: "RGB + depth + proprioception + force/torque (optional) + language instructions",
    volumeRange: "50-200 per task (single-task) to 100K+ (foundation model)",
    temporalResolution: "30 Hz video, 100-500 Hz proprioception",
    keyAnnotations: ["Grasp type classification", "Contact event timestamps", "Object state transitions", "Task success/failure with failure taxonomy", "6-DoF end-effector pose", "Natural language task descriptions"],
  },
  relevantModels: ["RT-2", "Octo", "Diffusion Policy", "OpenVLA", "ACT/ALOHA", "RT-1", "Pi-zero", "HPT"],
  environmentTypes: ["Tabletop", "Kitchen", "Warehouse", "Industrial assembly", "Laboratory", "Home environment"],
  keyPapers: [
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "khazatsky-droid-2024", title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset", authors: "Khazatsky et al.", venue: "RSS 2024", year: 2024, url: "https://arxiv.org/abs/2403.12945" },
    { id: "mandlekar-robomimic-2021", title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation", authors: "Mandlekar et al.", venue: "CoRL 2021", year: 2021, url: "https://arxiv.org/abs/2108.03298" },
  ],
  claruRelevance:
    "Claru operates a distributed network of 10,000+ trained data collectors across 100+ cities, enabling rapid collection of diverse object manipulation demonstrations at scale. Our infrastructure supports multi-view synchronized recording at 30+ Hz with hardware-triggered camera alignment achieving sub-1 ms synchronization, delivering data in RLDS, HDF5, zarr, or WebDataset format. With 386,000+ annotated manipulation clips already in our catalog spanning egocentric video, tabletop manipulation, and multi-environment recordings, we can supplement custom collections with pre-existing data to accelerate your training pipeline. Each demonstration is scored for trajectory quality, temporal synchronization, and task completion, with automated flagging and 25% human spot-verification. We support single-task datasets (50-500 demonstrations, 1-2 week turnaround) through foundation model-scale datasets (100K+ demonstrations, multi-month campaigns with parallel collection sites).",
};

export default data;
