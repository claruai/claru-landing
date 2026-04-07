import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-annotate-manipulation-trajectories",
  metaTitle: "How to Annotate Manipulation Trajectories (2026 Guide) | Claru",
  metaDescription: "Complete guide to annotating robot manipulation trajectories including action segmentation, waypoint labeling, skill primitives, and quality validation.",
  primaryKeyword: "how to annotate manipulation trajectories",
  secondaryKeywords: ["manipulation trajectory annotation","robot trajectory labeling","action segmentation annotation","waypoint annotation","skill primitive labeling"],
  canonicalPath: "/guides/how-to-annotate-manipulation-trajectories",
  h1: "How to Annotate Manipulation Trajectories",
  heroSubtitle: "Complete guide to annotating robot manipulation trajectories including action segmentation, waypoint labeling, skill primitives, and quality validation for imitation learning.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Annotate Manipulation Trajectories", href: "/guides/how-to-annotate-manipulation-trajectories" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between annotating trajectories for behavioral cloning vs. skill learning?",
      answer: "For behavioral cloning (Diffusion Policy, ACT), you need dense per-timestep action labels but minimal semantic annotation -- the model learns the raw action mapping. For skill-based learning (SayCan, TAMP), you need sparse but semantically rich annotations: segment boundaries marking where each skill starts/ends, a skill label per segment (pick, place, push, pour), and pre/post-condition states. Skill annotation requires domain expertise but far fewer labels per episode since you annotate transitions, not every frame."
    },
    {
      question: "Should I annotate in joint space or Cartesian space?",
      answer: "Annotate in both if possible, but prioritize the space your model consumes. Most modern VLA models (RT-2, Octo, OpenVLA) use end-effector Cartesian actions (x, y, z, roll, pitch, yaw, gripper). Joint-space annotations are needed for models that output joint torques or positions (ACT uses joint positions). If you only annotate one, choose Cartesian -- you can always compute joint positions via inverse kinematics, but the reverse requires the full robot model and has multiple solutions."
    },
    {
      question: "How do you handle multi-step trajectories that include pauses or corrections?",
      answer: "Label pauses and corrections explicitly rather than filtering them out. Add a 'phase' annotation track with values: executing, pausing, correcting, recovering. For teleop data, corrections are natural and contain valuable information about error recovery. However, annotate the intended trajectory as a separate 'clean' track alongside the raw teleoperation trajectory, so downstream users can choose between learning from corrections or from idealized demonstrations."
    },
    {
      question: "What annotation rate is needed for trajectory data at 10 Hz control frequency?",
      answer: "For dense trajectory annotation (labeling every timestep), annotate at the recording frequency -- typically 10-50 Hz. For semantic segmentation of trajectories into phases, annotate transition timestamps at 1-5 Hz precision (mark the exact timestep where a phase changes). For waypoint annotation, you only mark 3-10 key poses per episode regardless of recording frequency. The annotation cost scales linearly with density, so start with waypoints to validate your taxonomy, then add dense labels if your model requires them."
    },
    {
      question: "How many annotated trajectories are needed per manipulation task?",
      answer: "For Diffusion Policy on single tasks, 50-200 demonstrations with dense action labels achieve strong performance. ACT requires similar counts. For multi-task models, 20-50 demonstrations per task with clear language instructions suffice for RT-2 class models if the demonstrations are high quality. For skill segmentation models used in task planning, 500+ trajectories with diverse skill compositions are needed to learn robust segmentation boundaries. Quality matters more than quantity -- 100 clean, diverse demonstrations outperform 1,000 noisy, repetitive ones."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["manipulation-trajectory","temporal-annotation","action-segmentation","behavioral-cloning"],
  relatedGuidePages: ["how-to-label-robot-demonstrations","how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "intermediate",
  estimatedTime: "1-3 weeks",
  prerequisites: [
    "Recorded robot trajectories in rosbag, HDF5, or zarr format with joint states and end-effector poses",
    "Python 3.9+ with NumPy, SciPy, and robotics-toolbox-python installed",
    "Understanding of your robot's URDF and kinematic chain",
    "Defined task taxonomy (list of manipulation skills/phases you want to annotate)",
    "Visualization environment (RViz2, MeshCat, or rerun.io) for 3D trajectory review"
  ],
  tools: ["rerun.io","RViz2","Label Studio","robomimic","Python","SciPy","robotics-toolbox-python","robosuite"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Trajectory Annotation Schema",
      description: "Before annotating any trajectories, formalize what annotation layers you need and the vocabulary for each. Manipulation trajectory annotation typically involves three layers at different temporal granularities, and attempting to annotate all three simultaneously leads to inconsistency.\n\nLayer 1 -- Dense action labels: per-timestep annotations of the action being executed. At minimum, verify that the recorded actions (joint velocities, end-effector deltas, or gripper commands) are correctly paired with observations. For teleoperated data, this means confirming synchronization between the controller input and the robot state recording. Check timestamp alignment by plotting commanded vs. actual end-effector position and verifying the lag is consistent (typically 30-100ms for VR teleoperation systems like GELLO or UMI). Record the constant lag offset so downstream users can shift actions to compensate.\n\nLayer 2 -- Phase segmentation: divide each trajectory into semantic phases. Define a phase vocabulary appropriate for your domain. For tabletop pick-and-place: {approach, pre-grasp, grasp, lift, transport, pre-place, place, release, retract}. For kitchen tasks: {reach, grasp, manipulate, pour, stir, cut, release, idle}. Each phase must have a clear start condition (e.g., \"grasp begins at the first timestep where gripper width decreases below the fully-open threshold\") and end condition documented with examples.\n\nLayer 3 -- Waypoint annotation: mark 3-10 key poses per trajectory that capture the essential shape of the motion. Waypoints should include: the approach pose (end-effector positioned above the target), the contact pose (first contact with the object), the manipulation pose (peak of the manipulation action, e.g., highest point of a lift), and the goal pose (object in final desired configuration). Store each waypoint as a full robot state (joint positions + end-effector SE(3) pose + gripper state) with a semantic label.\n\nWrite the annotation schema as a JSON Schema document and validate all annotations against it programmatically. This catches format errors at annotation time rather than during training.",
      tools: ["JSON Schema", "Python"],
      tips: [
        "Include a 'transition' phase label for the boundary between two skills. Forcing annotators to assign an exact frame to a gradual transition creates noise. A 3-5 frame transition window is more honest and gives models a soft target.",
        "Define gripper state thresholds precisely: what gripper width counts as 'closed' varies by gripper. For the Robotiq 2F-85, closed is width < 5mm. For the Franka Hand, closed is width < 2mm. Include these numbers in the annotation guide.",
        "Version your phase vocabulary. If you add 'stir' to the taxonomy mid-annotation, all previously annotated kitchen trajectories need re-review for the new label."
      ]
    },
    {
      stepNumber: 2,
      title: "Pre-Process and Visualize Raw Trajectories",
      description: "Before human annotators see the data, run automated pre-processing to ensure trajectory quality and generate visualizations that make annotation efficient. Start by loading trajectories from their recorded format. For rosbag2 data: `from rosbags.rosbag2 import Reader` followed by extracting `/joint_states`, `/tf`, and `/camera/color/image_raw` topics. For HDF5 (the robomimic convention): load from `/data/demo_N/obs/`, `/data/demo_N/actions/`, `/data/demo_N/rewards/`.\n\nRun forward kinematics to compute end-effector pose from joint states if not already recorded. Using robotics-toolbox-python: `robot = rtb.models.Panda()`, then `T = robot.fkine(q)` for each timestep's joint configuration `q`. Verify that the computed end-effector pose matches the recorded one (if available) within 1mm and 0.5 degrees. Discrepancies indicate calibration errors or URDF inaccuracies that will corrupt downstream training.\n\nCompute derived signals that aid annotation: end-effector velocity magnitude (`v = np.linalg.norm(np.diff(ee_pos, axis=0) * hz)`), gripper aperture over time, and force/torque magnitude if available. These derived signals make phase boundaries obvious -- velocity near zero indicates a pause or pre-grasp alignment, gripper aperture change indicates grasp/release, and force spikes indicate contact events.\n\nGenerate a synchronized visualization for each trajectory. The best tool for this is rerun.io (`pip install rerun-sdk`), which renders 3D robot state, camera feeds, and time-series plots in a single synchronized timeline viewer. Log the robot URDF mesh, joint states per timestep, end-effector trajectory as a 3D line, camera images, and derived signals. Annotators scrub through this visualization to identify phase boundaries. An alternative is to render a side-by-side video: left panel shows the camera view, right panel shows end-effector position/velocity/gripper plots over time with a moving cursor indicating the current frame.\n\nFilter out obviously failed trajectories before annotation. Implement automatic failure detection: episodes where the gripper never closes (no grasp attempted), episodes where the end-effector exits the workspace bounds, episodes shorter than the minimum expected duration, and episodes where the task success signal (if available) is false. Log filtered episodes for review rather than deleting them -- some 'failures' contain useful recovery behaviors.",
      tools: ["rerun.io", "robotics-toolbox-python", "rosbags", "robomimic", "FFmpeg"],
      tips: [
        "Plot end-effector velocity as a time-series below the video. Phase transitions almost always coincide with velocity minima, making boundary annotation trivial when the signal is visible.",
        "Color-code the 3D trajectory by gripper state (green = open, red = closed). This immediately reveals grasp and release points without scrubbing through the full episode.",
        "Pre-compute and cache all visualizations before sending to annotators. Waiting for real-time rendering degrades annotator throughput by 3-5x and leads to shortcuts."
      ]
    },
    {
      stepNumber: 3,
      title: "Annotate Phase Boundaries and Skill Labels",
      description: "Set up the annotation workflow for human annotators to segment trajectories into phases and assign skill labels. The most efficient interface for this task is a timeline-based editor where the annotator sees the trajectory visualization (from Step 2) and places segment boundaries by clicking on the timeline.\n\nConfigure Label Studio with a video labeling template that includes a custom timeline component. Upload the pre-rendered visualization videos from Step 2. Define the labeling interface with a `<Labels>` block containing your phase vocabulary, and a `<TimeSeriesLabels>` block for annotating temporal segments on the derived-signal plots. Each segment annotation consists of: start_timestep, end_timestep, phase_label, and an optional free-text note for ambiguous cases.\n\nFor the annotation workflow, implement a two-pass strategy. In the first pass, the annotator identifies major phase boundaries by scrubbing through the trajectory at 2-4x speed, placing markers at obvious transitions (approach-to-grasp, grasp-to-lift, transport-to-place). This takes 30-60 seconds per 20-second trajectory. In the second pass, the annotator reviews each boundary at normal speed, adjusting to frame-level precision and adding the phase label. Total annotation time per trajectory should be 2-4 minutes for a standard pick-and-place and 5-10 minutes for complex multi-step tasks.\n\nFor waypoint annotation, extend the interface to allow the annotator to mark specific timesteps as waypoints. At each marked timestep, the full robot state is automatically extracted and stored. The annotator assigns a waypoint type from a dropdown: {pre-grasp, grasp, post-grasp, via-point, pre-place, place, goal}. Constrain waypoint placement: at minimum, every trajectory must have a grasp waypoint and a goal waypoint. Warn if the annotator marks fewer than 3 waypoints for a pick-and-place or fewer than 5 for a multi-step task.\n\nBatch trajectories by task type so annotators build expertise on one task before switching. An annotator who labels 50 pick-and-place trajectories consecutively develops strong intuition for boundary placement and produces more consistent labels than one who switches between pick-and-place, pouring, and stacking.",
      tools: ["Label Studio", "CVAT", "rerun.io"],
      tips: [
        "Let annotators use keyboard shortcuts to place boundary markers without pausing playback. 'Spacebar to place marker, then label' is faster than 'pause, click, label, unpause'.",
        "Display the gripper aperture signal prominently. Grasp and release boundaries should always align with gripper state changes. If they do not, either the annotation or the data is wrong.",
        "For ambiguous transitions (when does 'transport' become 'pre-place'?), define the boundary as the first timestep where end-effector velocity decreases below 50% of the transport phase average. Giving annotators a quantitative rule eliminates subjective judgment."
      ]
    },
    {
      stepNumber: 4,
      title: "Annotate Language Instructions and Task Descriptions",
      description: "Add natural language annotations that make trajectories consumable by vision-language-action models (RT-2, Octo, OpenVLA). Each trajectory needs at least two levels of language annotation: a task-level instruction and per-phase descriptions.\n\nThe task-level instruction is a single sentence describing the full task from start to goal state: \"Pick up the red block and place it on the blue plate.\" This is the instruction that a VLA model conditions on at inference time. Write instructions that are specific enough to be unambiguous but general enough to cover the natural variation in demonstrations. Bad: \"Move the arm to the right, close the gripper, lift, move left, open.\" Good: \"Pick up the mug from the counter and place it in the dish rack.\" The instruction should describe the intent, not the motion.\n\nPer-phase descriptions provide finer-grained language aligned to the phase segmentation from Step 3. For each phase segment, write a 3-8 word description: \"approaching the mug handle\", \"grasping the mug\", \"lifting the mug\", \"moving to the dish rack\", \"placing the mug in the rack\", \"releasing the mug\". These per-phase descriptions are used by hierarchical models and for phase-conditioned trajectory retrieval.\n\nStandardize the language vocabulary across all annotators. Create a controlled vocabulary document with approved verbs (pick, place, push, pull, slide, pour, twist, press, open, close, stack, insert), approved spatial references (left, right, above, below, near, on, in, next to), and approved object attributes (color, size, material). Reject annotations that use non-standard terms. This consistency is critical because language conditioning in VLA models is sensitive to vocabulary -- a model trained on \"pick up\" may not generalize to \"grab\" without explicit vocabulary normalization.\n\nFor multi-step tasks, also annotate the task decomposition as an ordered list of sub-goals: [\"open the drawer\", \"pick up the spoon from the drawer\", \"close the drawer\", \"place the spoon on the plate\"]. This hierarchical annotation supports task planners like SayCan that decompose high-level instructions into executable skill sequences.\n\nBudget 1-2 minutes per trajectory for language annotation. This is fast relative to phase segmentation because the language directly maps to already-annotated phases.",
      tools: ["Label Studio", "Python", "spaCy"],
      tips: [
        "Have annotators write the task instruction before watching the trajectory, based only on the task specification. This prevents descriptions that are overly specific to one demonstration's quirks.",
        "Run a spell checker and vocabulary validator on all language annotations before export. Typos in language conditioning create out-of-distribution inputs that silently degrade VLA performance.",
        "Include both imperative ('Pick up the mug') and declarative ('The robot picks up the mug') variants for each trajectory. Different VLA models expect different instruction formats."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Annotations with Automated Consistency Checks",
      description: "Run a comprehensive quality assurance pipeline that catches annotation errors before they contaminate training data. Trajectory annotations have several types of errors that are detectable programmatically.\n\nPhase boundary validation: verify that phase labels follow a legal ordering. Define a finite state machine (FSM) for valid phase transitions. For pick-and-place: approach -> pre_grasp -> grasp -> lift -> transport -> pre_place -> place -> release -> retract. Any annotation with an illegal transition (e.g., grasp directly to release without lift) is flagged. Implement this as a transition matrix check: `valid_transitions = {('approach', 'pre_grasp'), ('pre_grasp', 'grasp'), ...}` then verify each consecutive pair of phases is in the set.\n\nPhase-action consistency: during the 'grasp' phase, the gripper should be closing (aperture decreasing). During 'release', the gripper should be opening. During 'transport', the end-effector should be moving (velocity > threshold). Compute these consistency scores per phase segment: `grasp_consistency = np.mean(np.diff(gripper_aperture[start:end]) < 0)`. A grasp phase where the gripper opens more than 30% of the time is flagged.\n\nWaypoint validation: verify that annotated waypoints are kinematically reachable and that the trajectory between consecutive waypoints is physically plausible. Compute the distance between consecutive waypoints in Cartesian space and flag pairs that are unreachably far apart (> 0.5m for tabletop manipulation) or impossibly close (< 1mm, likely a duplicate annotation). Verify that joint configurations at waypoints do not violate joint limits: `assert np.all(q >= joint_lower) and np.all(q <= joint_upper)`.\n\nLanguage consistency: verify that language annotations reference the correct objects. If the trajectory involves a red mug (from metadata or object detection), the language instruction should mention 'red', 'mug', or both. Cross-reference entity nouns in the language annotation with the object labels in the scene metadata. Flag mismatches where the instruction mentions objects not present in the scene.\n\nInter-annotator agreement: on the 20% overlap subset, compute phase boundary agreement as the mean absolute difference in boundary frame indices between two annotators. Target: within 5 frames (500ms at 10Hz). For phase labels, compute Cohen's kappa on the frame-level labels. Target: kappa > 0.80. For waypoint locations, compute the mean Cartesian distance between corresponding waypoints. Target: < 20mm for precision tasks, < 50mm for coarse tasks.",
      tools: ["NumPy", "SciPy", "pandas", "Matplotlib", "scikit-learn"],
      tips: [
        "The FSM transition check catches the most errors per compute cycle. Implement it first and run on every annotation batch before any other validation.",
        "Plot the gripper aperture signal with phase boundary overlays for every trajectory. This single visualization catches 80% of boundary placement errors at a glance.",
        "Track per-annotator agreement scores over time. New annotators typically take 30-50 trajectories to reach steady-state accuracy. Discard their first 20 annotations from the training set."
      ]
    },
    {
      stepNumber: 6,
      title: "Export as Training-Ready Datasets",
      description: "Package the validated annotations into formats consumed by major robot learning frameworks. The goal is that a researcher can load your dataset and begin training within 30 minutes, with zero format-wrangling.\n\nFor the robomimic/HDF5 convention (consumed by Diffusion Policy, ACT, BC-Z): store each trajectory as `/data/demo_N/obs/joint_pos` (float64, T x 7 for Franka), `/data/demo_N/obs/ee_pos` (float64, T x 3), `/data/demo_N/obs/ee_quat` (float64, T x 4), `/data/demo_N/obs/gripper_state` (float64, T x 1), `/data/demo_N/actions` (float64, T x A where A matches the action dimension), and `/data/demo_N/rewards` (float64, T). Add annotation groups: `/data/demo_N/annotations/phase_labels` (string array, T), `/data/demo_N/annotations/waypoint_indices` (int array, K), `/data/demo_N/annotations/language_instruction` (string attribute), `/data/demo_N/annotations/phase_descriptions` (string array per segment). Use `compression='gzip', compression_opts=4` for float arrays and `chunks=(min(T, 256), D)` for efficient partial reads.\n\nFor RLDS/TFRecord format (consumed by RT-X, Octo, OpenVLA): structure each trajectory as an episode with steps. Each step contains `observation` (image, proprioception), `action`, `reward`, `is_terminal`, `language_instruction`, and custom fields for phase label and waypoint flag. Use the RLDS dataset builder (`tfds.rlds.RLDSDatasetBuilder`) with a `DatasetConfig` specifying feature types. Validate the output by loading one episode with `tfds.load()` and checking tensor shapes match expectations.\n\nFor zarr format (consumed by newer Diffusion Policy implementations): create a zarr group per trajectory with chunked arrays. Zarr's async writing and partial reads make it faster than HDF5 for large datasets. Use `zarr.open('dataset.zarr', mode='w')`, then `root.create_dataset('demo_0/actions', data=actions, chunks=(256, 7), dtype='float32')`.\n\nRegardless of format, include: (1) a `dataset_info.json` with total trajectories, action space definition, observation space definition, phase vocabulary with definitions, waypoint types, and train/val/test split assignments; (2) a Python dataloader class with `__getitem__` returning a dictionary of numpy arrays; (3) a visualization script that renders any trajectory with phase color-coding and waypoint markers; (4) normalization statistics (per-feature mean and standard deviation) computed on the training split only.\n\nGenerate train/val/test splits at the task-variant level: all trajectories for a given (object, initial_position, goal_position) tuple go in the same split. This prevents the trivially high accuracy that comes from near-duplicate initial conditions appearing in both train and test.",
      tools: ["h5py", "TensorFlow Datasets", "zarr", "NumPy", "robomimic"],
      tips: [
        "Include the raw trajectory alongside annotations. Users may want to re-derive actions with a different delta convention (absolute vs. relative, joint vs. Cartesian) or resample to a different control frequency.",
        "Provide a one-line loading example in the README: `dataset = TrajectoryDataset('path/to/dataset.hdf5'); obs, action, phase = dataset[0]`. The first thing every user tries is loading one sample.",
        "Test your dataloader with the actual training code of at least one target model (e.g., run 10 steps of Diffusion Policy training) before considering the dataset complete. Format bugs caught at export time are 10x cheaper than bugs caught after delivery."
      ]
    }
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705"
    },
    {
      id: "mandlekar-robomimic-2021",
      title: "What Matters in Learning from Offline Human Demonstrations for Robot Manipulation",
      authors: "Mandlekar et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2108.03298"
    },
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
    },
    {
      id: "ahn-saycan-2022",
      title: "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691"
    }
  ],
  claruRelevance: "Trajectory annotation is where domain expertise meets tedious precision, and it is the bottleneck for most robot learning teams. Claru's annotators are trained on manipulation-specific phase vocabularies and work with synchronized 3D visualization tools that show robot state, camera feeds, and derived signals (velocity, gripper aperture, force) in a single timeline view. We annotate phase boundaries, waypoints, and language instructions for datasets recorded on Franka Emika, UR5e, xArm, and custom platforms, with inter-annotator boundary agreement within 3 frames at 10 Hz. For teams collecting teleoperation data with GELLO, UMI, or ALOHA and need trajectory annotation at scale, Claru delivers validated annotations in robomimic HDF5 or RLDS format with dataloaders ready for Diffusion Policy, ACT, or Octo training. Our pipeline handles 500+ trajectories per week per annotator team with built-in FSM validation and consistency checking.",
};

export default data;
