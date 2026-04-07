import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-annotate-robot-failure-modes",
  metaTitle: "How to Annotate Robot Failure Modes in Demonstration Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to building a failure taxonomy, annotating failure types and root causes in robot demonstrations, and using failure data to train robust recovery policies.",
  primaryKeyword: "how to annotate robot failure modes in demonstration data",
  secondaryKeywords: ["robot failure annotation","failure taxonomy robotics","robot error classification","failure recovery dataset","robot demonstration quality labeling"],
  canonicalPath: "/guides/how-to-annotate-robot-failure-modes",
  h1: "How to Annotate Robot Failure Modes in Demonstration Data",
  heroSubtitle: "Step-by-step guide to building a failure taxonomy, annotating failure types and root causes in robot demonstrations, and using failure data to train robust recovery policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Annotate Robot Failure Modes in Demonstration Data", href: "/guides/how-to-annotate-robot-failure-modes" },
  ],
  sections: [],
  faqs: [
    {
      question: "What percentage of a robot demonstration dataset should contain failure episodes?",
      answer: "For training robust policies with failure recovery, include 15-30% failure episodes alongside successful demonstrations. Research from the RoboCasa and MimicGen projects shows that policies trained exclusively on successes are brittle -- they freeze or diverge when encountering novel perturbations. A 70/30 success/failure split provides enough positive signal for the primary task while giving the model sufficient failure diversity to learn recovery behaviors. For offline reinforcement learning approaches like IQL or CQL, you can go higher (40-50% failures) since these methods explicitly learn value functions from suboptimal data. The critical requirement is that failure episodes must be annotated with failure type, failure onset frame, and severity, otherwise they add noise rather than signal. Start with a 10% failure inclusion rate during your first training run and increase until you see diminishing returns on evaluation robustness metrics."
    },
    {
      question: "How do you distinguish between operator error and genuine robot failure in teleoperation data?",
      answer: "Define clear operational criteria before annotation begins. Operator errors include: choosing a grasp point that was clearly suboptimal given the visual information (e.g., grasping a mug by the rim instead of the handle when the handle was visible and accessible), overshooting a target by more than 5 cm due to jerky joystick input, and collisions caused by moving too fast through a cluttered workspace. Genuine robot failures include: grasp slippage despite correct grasp placement (force control failure), objects rolling or shifting due to surface friction changes, perception failures where the depth sensor returned invalid data on reflective surfaces, and kinematic singularities causing unexpected arm motion. Annotators should have access to both the operator's commanded actions and the robot's actual executed trajectory. When the commanded trajectory was reasonable but execution diverged (tracking error above 2 cm), classify as robot failure. When the commanded trajectory was clearly wrong, classify as operator error. Include a third category for ambiguous cases and resolve them through annotator discussion."
    },
    {
      question: "Should failure annotations be frame-level or episode-level?",
      answer: "Use both. Episode-level labels capture the overall outcome (success, partial success, failure) and the primary failure mode category. Frame-level annotations capture the temporal structure: the failure onset frame (exact timestep where the failure begins, such as first frame of grasp slip), the failure recognition frame (when the failure becomes visually unambiguous), and the recovery attempt frames (if the operator or autonomous system attempts correction). Frame-level annotations are essential for training failure detection models that need to trigger recovery behaviors in real-time. Episode-level labels alone are insufficient because they do not tell the model when the failure occurred within the trajectory. For a 20-second episode at 10 Hz, frame-level annotation adds approximately 60-90 seconds of annotator time on top of the 30-second episode-level pass, making the total roughly 2 minutes per episode."
    },
    {
      question: "What is a good failure taxonomy for tabletop manipulation datasets?",
      answer: "A practical taxonomy for tabletop manipulation organizes failures into five top-level categories with 2-4 subcategories each. (1) Grasp failures: slip during lift, missed grasp (fingers closed on empty space), unstable grasp (object rotates or shifts in gripper). (2) Placement failures: object dropped during transport, missed target zone by more than 3 cm, object tipped over after release. (3) Collision failures: gripper contacted obstacle, arm contacted environment, object knocked over by arm motion. (4) Perception failures: depth sensor returned invalid data, object not detected due to occlusion, incorrect object identity. (5) Planning failures: approached from infeasible direction, reached joint limit during task, trajectory intersected with known obstacle. This 5x3 hierarchy covers 90%+ of failures in standard tabletop settings. Include an 'other' subcategory per top level for rare cases, and review 'other' labels monthly to decide if a new subcategory is needed."
    },
    {
      question: "How do you train annotators to recognize subtle failure modes like grasp instability?",
      answer: "Build a calibration set of 50-100 reference episodes that span the full failure taxonomy, with gold-standard labels agreed upon by domain experts. Include borderline cases where the failure is subtle -- for example, a grasp that succeeds but with visible object wobble during transport, which indicates marginal stability that would fail under perturbation. Train annotators in three sessions: (1) a 2-hour lecture covering the failure taxonomy with video examples of each subcategory, (2) a supervised practice session where annotators label 30 episodes from the calibration set and receive immediate feedback against gold labels, and (3) an independent test on 20 unseen calibration episodes where annotators must achieve kappa above 0.75 against the gold standard. Annotators who fail the test repeat the practice session with focus on their specific error patterns. Provide annotators with slow-motion playback (0.25x speed) and the ability to overlay force/torque readings on the video, since many grasp instabilities are invisible at normal speed but obvious in the force signal (oscillation above 2 Hz in the gripper force channel)."
    }
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific requirements.",
  relatedGlossaryTerms: ["data-quality-scoring","behavioral-cloning","active-learning"],
  relatedGuidePages: ["how-to-evaluate-training-data-quality"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "intermediate",
  estimatedTime: "1-2 weeks",
  prerequisites: [
    "Robot demonstration dataset in HDF5, rosbag, or zarr format with at least 200 episodes",
    "Python 3.9+ with NumPy, pandas, and scikit-learn installed",
    "Video playback and annotation tool (Label Studio, CVAT, or rerun.io)",
    "Access to force/torque sensor data if available (greatly improves failure detection accuracy)",
    "Defined task success criteria for each manipulation task in your dataset"
  ],
  tools: ["Label Studio","CVAT","rerun.io","Python","NumPy","pandas","scikit-learn","FFmpeg","robomimic"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Failure Taxonomy and Annotation Schema",
      description: "Before any annotation, formalize a hierarchical failure taxonomy specific to your robot platform, task suite, and downstream use case. A taxonomy that is too coarse (just 'success' vs. 'failure') wastes annotation effort because the model cannot learn failure-specific recovery strategies. A taxonomy that is too fine (30+ subcategories) causes inter-annotator disagreement to spike because the boundaries between similar failure modes become subjective.\n\nStart with the five-category framework used by the RoboCasa and LIBERO benchmarks: grasp failure, placement failure, collision, perception failure, and planning failure. Under each, define 2-4 subcategories with precise operational definitions. For grasp failure, distinguish between: (a) 'missed grasp' where the gripper closed without contacting the object (gripper aperture went to minimum without force sensor spike), (b) 'slip during lift' where initial contact was made but the object fell during the lift phase (detected by sudden gripper force drop followed by no object in the gripper), and (c) 'unstable grasp' where the object remained grasped but rotated more than 15 degrees from its initial orientation during transport. Each definition must reference observable signals, not subjective judgment.\n\nCreate a JSON Schema for the annotation format. Each episode annotation should include: `episode_id` (string), `outcome` (enum: success, partial_success, failure), `failure_category` (top-level enum or null if success), `failure_subcategory` (subcategory enum or null), `failure_onset_frame` (integer, the first frame where the failure begins), `failure_obvious_frame` (integer, the first frame where the failure is visually unambiguous), `recovery_attempted` (boolean), `recovery_start_frame` (integer or null), `recovery_outcome` (enum: recovered, failed_recovery, no_attempt), `root_cause` (free text, 10-50 words), and `annotator_confidence` (float 0-1). Validate every annotation against this schema programmatically before accepting it into the dataset.",
      tools: ["JSON Schema", "Python"],
      tips: [
        "Print the taxonomy as a laminated reference card for each annotator. Searching through a 10-page document during annotation slows throughput by 40%.",
        "Include 'partial success' as an outcome. Many episodes achieve the goal but with undesirable behaviors (excessive force, near-collisions, object wobble) that are valuable training signal for preference-based learning.",
        "Version your taxonomy from day one. If you add 'object deformation' as a failure subcategory mid-annotation, all previously annotated episodes involving deformable objects need re-review."
      ]
    },
    {
      stepNumber: 2,
      title: "Build Automated Pre-Annotation with Signal-Based Failure Detection",
      description: "Before human annotators see any episode, run automated detectors that flag likely failures and pre-populate the annotation fields. This hybrid approach (automated pre-annotation plus human correction) reduces per-episode annotation time from 3-5 minutes to 60-90 seconds for clear cases.\n\nImplement four signal-based detectors. First, a task success detector that checks the final state against the task's success criterion. For pick-and-place tasks, verify that the target object's final position (from the last frame's object detection or known goal coordinates) is within the success threshold (typically 3 cm Euclidean distance from the goal). Use OpenCV template matching or a pre-trained object detector (YOLOv8-nano, which runs at 200+ FPS on CPU) to localize the object in the final frame. Episodes that fail this check are automatically labeled as failures.\n\nSecond, a grasp detector that analyzes the gripper aperture and force/torque signals. Parse the proprioceptive data stream and extract gripper width over time. A successful grasp shows: gripper width decreasing, stabilizing at a value above minimum (object is between fingers), and remaining stable during transport. A missed grasp shows gripper width decreasing to minimum without the characteristic force spike (typically 2-10 N for tabletop objects). A slip shows force spike followed by sudden force drop and gripper closing to minimum. Implement these as simple threshold detectors: `is_slip = (force_peak > 2.0) and (force_after_peak < 0.5) and (gripper_width_after < 0.005)`.\n\nThird, a collision detector that monitors joint torque residuals. Compute the expected torques from the robot's dynamic model using the recorded joint positions and velocities (`tau_expected = M(q) * qddot + C(q, qdot) * qdot + g(q)`), then compare against measured torques. Residuals exceeding 5 Nm for more than 100 ms indicate external contact, likely a collision. Libraries like Pinocchio (`pip install pin`) compute inverse dynamics efficiently.\n\nFourth, a trajectory smoothness detector that flags episodes with abnormal jerk (third derivative of position). Compute per-timestep jerk magnitude: `jerk = np.diff(accel, axis=0) * hz`. Episodes where peak jerk exceeds 3 standard deviations from the dataset mean often contain operator errors, emergency stops, or controller instabilities.",
      tools: ["Python", "NumPy", "Pinocchio", "YOLOv8", "OpenCV"],
      tips: [
        "Tune detector thresholds on a calibration set of 50 manually labeled episodes before running on the full dataset. Overly sensitive detectors create annotation fatigue from false positives.",
        "Log detector confidence alongside binary flags. Human annotators can skip high-confidence detections (confidence > 0.9) and focus review time on ambiguous cases (confidence 0.4-0.7).",
        "Save the raw detector outputs as numpy arrays alongside the episode data. Downstream failure prediction models can use these signals as input features."
      ]
    },
    {
      stepNumber: 3,
      title: "Configure the Annotation Interface for Multi-Signal Review",
      description: "Set up an annotation workflow that presents each episode as a synchronized multi-modal display: video playback, time-series plots of key signals, and pre-populated failure labels from Step 2 that the annotator confirms or corrects.\n\nThe best tool for this is rerun.io, which renders 3D robot state, camera feeds, and time-series signals in a synchronized timeline viewer. Log the following per episode: camera RGB frames as an image stream, end-effector position as a 3D scatter trail, gripper aperture as a scalar time series, force/torque magnitude as a scalar time series, and the automated detector outputs as binary event markers on the timeline. Annotators scrub through this view and can instantly see where force spikes coincide with grasp attempts, where collisions occur, and where the trajectory deviates from nominal.\n\nIf rerun.io is not available, build a lightweight annotation interface using Label Studio with a custom video annotation template. Pre-render each episode as a side-by-side video: left panel shows the camera feed (primary and wrist views if available), right panel shows matplotlib plots of gripper aperture, force magnitude, end-effector velocity, and collision detector residual. Render these using FFmpeg to combine the video and signal overlay: `ffmpeg -i camera.mp4 -i signals.mp4 -filter_complex hstack annotated.mp4`. Upload the combined videos to Label Studio and configure a labeling template with: a classification block for episode outcome and failure category (dropdowns pre-populated from Step 2), a temporal span block for marking failure onset and recovery attempt intervals, and a text block for root cause description.\n\nOrganize the annotation workflow in three stages. Stage 1 (triage): annotator reviews each episode at 2x speed and confirms or rejects the automated outcome label. Average time: 20 seconds per episode. Stage 2 (detailed annotation): for episodes flagged as failures, annotator plays at normal speed, marks the failure onset frame and subcategory, and writes the root cause. Average time: 90-120 seconds per failure episode. Stage 3 (review): a senior annotator reviews 20% of all annotations, including all disagreements between automated and human labels.",
      tools: ["rerun.io", "Label Studio", "FFmpeg", "matplotlib", "Python"],
      tips: [
        "Display the automated detector's predicted label prominently but allow one-click override. Annotators who must fill in every field from scratch are 3x slower than those correcting pre-filled values.",
        "Add keyboard shortcuts: 's' for success, 'f' for failure, 1-5 for failure subcategories. Annotators who can triage without touching the mouse process 40+ episodes per hour.",
        "Limit annotation sessions to 90 minutes. Failure annotation is cognitively demanding because annotators must reason about causality, and accuracy drops measurably after 60 minutes of continuous labeling."
      ]
    },
    {
      stepNumber: 4,
      title: "Annotate Root Causes and Causal Chains",
      description: "Beyond labeling the failure type, annotate the causal chain that led to the failure. This additional annotation layer transforms your dataset from a simple failure classifier training set into a resource for learning causal reasoning about manipulation outcomes.\n\nFor each failure episode, annotators answer three structured questions. First, 'what was the proximal cause?' -- the immediate physical event that caused the failure. Examples: 'gripper contacted object 2 cm off-center', 'object rolled on curved surface during approach', 'depth sensor returned zero values on the metallic object surface'. This is selected from a controlled vocabulary of 15-20 proximal causes specific to your platform. Second, 'what was the distal cause?' -- the upstream decision or condition that led to the proximal cause. Examples: 'approach angle was too steep (>45 degrees from vertical)', 'object was placed on a tilted surface', 'lighting caused specular reflection on metal lid'. Third, 'was this failure preventable with the available observations?' -- a binary yes/no that indicates whether the failure could have been avoided by a better policy given the same sensory input, or whether it was fundamentally caused by unobservable factors (e.g., unknown object mass, hidden surface texture).\n\nStore these causal annotations as structured fields, not free text. Define enum types for proximal and distal causes. This enables programmatic analysis: you can compute that 35% of grasp failures are caused by off-center contact, which tells engineering to improve the grasp pose prediction model, while 20% are caused by unobservable object mass, which suggests adding a force-feedback exploration primitive. Group causal annotations into actionable clusters using pandas: `df.groupby(['failure_subcategory', 'proximal_cause']).size().sort_values(ascending=False)` reveals the highest-impact failure modes to address.\n\nFor complex failure episodes where multiple causes interact (e.g., a slight grasp offset led to instability, which led to a slip during transport, which led to a collision with another object), annotate the full causal chain as an ordered list of (cause, effect) pairs. This is more time-intensive (3-5 minutes per complex episode vs. 90 seconds for simple failures) so reserve it for the top 10% most informative failure episodes selected by the automated detectors' confidence scores.",
      tools: ["Label Studio", "pandas", "Python"],
      tips: [
        "Provide visual reference examples for each proximal cause. Showing a video clip of 'off-center contact' is worth more than a paragraph of description.",
        "The 'was this preventable?' question is the most valuable annotation for policy improvement because it separates failures your model can learn to avoid from irreducible stochastic failures in the environment.",
        "Review causal annotations weekly and update the proximal/distal cause vocabularies. New failure modes emerge as the dataset grows to cover more task variants and objects."
      ]
    },
    {
      stepNumber: 5,
      title: "Validate Annotations with Agreement Metrics and Automated Consistency Checks",
      description: "Run systematic quality assurance on all failure annotations before they enter the training pipeline. Failure annotation has inherently lower inter-annotator agreement than success labeling because failure causes involve subjective causal reasoning, making QA especially important.\n\nMeasure inter-annotator agreement on the 20% overlap subset across three dimensions. For episode outcome (success/partial/failure), compute Cohen's kappa targeting kappa > 0.85. For failure category (5 top-level classes), compute Fleiss' kappa across all annotators targeting kappa > 0.75. For failure onset frame, compute the mean absolute frame difference between annotators targeting agreement within 5 frames (500 ms at 10 Hz). Implement these computations using scikit-learn: `from sklearn.metrics import cohen_kappa_score; kappa = cohen_kappa_score(annotator_a, annotator_b)`. Generate a per-annotator quality dashboard showing their kappa scores, average annotation time, and disagreement rate with the automated detectors.\n\nRun automated consistency checks. Cross-reference failure annotations against the signal-based detectors from Step 2. If a human annotated 'grasp slip' but the force signal shows no contact was ever made (peak force < 0.5 N throughout the episode), flag the annotation for review. If a human annotated 'success' but the automated task success detector found the object more than 5 cm from the goal, flag it. Compute the human-vs-automated disagreement rate per annotator. Annotators who disagree with the automated detectors more than 25% of the time likely misunderstand part of the taxonomy.\n\nValidate the failure distribution against expectations. For teleoperated datasets, typical failure rates are 10-20% for well-practiced operators on simple tasks and 30-50% for complex or novel tasks. If your annotated failure rate is below 5%, the success criterion may be too lenient. If above 60%, the task may be too difficult for the teleoperation interface or the operators need more training. Plot failure category distribution as a histogram and check for pathological imbalances. If one category accounts for more than 50% of all failures, consider subdividing it or collecting additional episodes that exercise other failure modes.\n\nCompute the temporal distribution of failure onset within episodes. Most failures should cluster in the manipulation phase (middle third of the episode), not at the start (which suggests setup problems) or very end (which suggests overly strict success criteria). A bimodal distribution with peaks at the grasp moment and the placement moment is healthy for pick-and-place tasks.",
      tools: ["scikit-learn", "pandas", "NumPy", "matplotlib", "Python"],
      tips: [
        "The signal-vs-human consistency check catches more errors than inter-annotator agreement for obvious failures. Implement it first.",
        "Track annotator calibration over time. New annotators typically under-label partial successes for the first 50 episodes. Their annotations stabilize after 100 episodes.",
        "Generate a 'confusion pairs' report showing which failure subcategories are most often confused with each other. These pairs likely need clearer definitions in the taxonomy document."
      ]
    },
    {
      stepNumber: 6,
      title: "Export Failure-Annotated Dataset for Training",
      description: "Package the validated failure annotations into formats that integrate with robot learning frameworks. The goal is to enable three downstream use cases: (1) filtering failures out for standard behavioral cloning, (2) including labeled failures for robust policy training, and (3) training dedicated failure detection and recovery models.\n\nFor the robomimic/HDF5 convention, add annotation groups to each episode: `/data/demo_N/annotations/outcome` (string: success, partial_success, failure), `/data/demo_N/annotations/failure_category` (string or null), `/data/demo_N/annotations/failure_subcategory` (string or null), `/data/demo_N/annotations/failure_onset_frame` (int or -1), `/data/demo_N/annotations/recovery_attempted` (bool), `/data/demo_N/annotations/root_cause` (string or empty), `/data/demo_N/annotations/causal_chain` (JSON string). Also add a top-level `/metadata/failure_taxonomy` group containing the taxonomy as a JSON string, so the dataset is self-documenting. Use `compression='gzip'` for string arrays and `compression_opts=4` for numeric arrays.\n\nFor RLDS format, add failure annotations as episode-level metadata in the `episode_metadata` feature. Add per-step features: `is_failure_onset` (bool, True at exactly the failure onset frame), `failure_phase` (string enum: pre_failure, failure_onset, during_failure, recovery, post_recovery, normal). These per-step labels let sequence models attend to failure-relevant timesteps during training.\n\nGenerate three dataset splits designed for failure-related evaluation. Split A (standard): stratified by task, 80/10/10, where the test set has the same failure rate as training. Split B (robustness): training set contains only successes, test set contains a mix of successes and failures -- this evaluates whether the trained policy can handle novel perturbations. Split C (failure detection): balanced 50/50 success/failure split for training a binary failure classifier, with the test set held out by failure subcategory (train on slips and collisions, test on placement failures) to evaluate generalization to unseen failure types.\n\nProvide a Python dataloader class that accepts a `filter` parameter: `TrajectoryDataset(path, filter='success_only')`, `filter='failure_only'`, `filter='all'`, or `filter='with_recovery'`. Include a visualization script that renders any episode with failure annotations overlaid: red tint on frames after failure onset, green tint during recovery attempts, and a text overlay showing the failure category. This visualization is the single most useful deliverable for debugging model behavior on failure cases.",
      tools: ["h5py", "TensorFlow Datasets", "NumPy", "FFmpeg", "Python"],
      tips: [
        "Include the raw signal-based detector outputs alongside human annotations. Downstream users training failure prediction models want both the noisy-but-dense automated signals and the clean-but-sparse human labels.",
        "Document the failure rate per task variant and per object type in the dataset card. Users training single-task policies need to know how much failure data exists for their specific task.",
        "Test your filtered dataloader by training a simple BC policy on success-only data and verifying it achieves reasonable performance. If filtering to successes still produces a broken policy, the success labels are unreliable and need re-review."
      ]
    }
  ],
  keyPapers: [
    {
      id: "nasiriany-robocasa-2024",
      title: "RoboCasa: Large-Scale Simulation of Everyday Tasks for Generalist Robots",
      authors: "Nasiriany et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.02523"
    },
    {
      id: "liu-libero-2024",
      title: "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning",
      authors: "Liu et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.03310"
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
      id: "kostrikov-iql-2022",
      title: "Offline Reinforcement Learning with Implicit Q-Learning",
      authors: "Kostrikov et al.",
      venue: "ICLR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.06169"
    },
    {
      id: "inceoglu-failure-detection-2021",
      title: "FINO-Net: A Deep Multimodal Sensor Fusion Framework for Manipulation Failure Detection",
      authors: "Inceoglu et al.",
      venue: "IEEE RA-L 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2101.05925"
    }
  ],
  claruRelevance: "Failure mode annotation requires annotators who understand both robot kinematics and the causal physics of manipulation, making it one of the most specialized data tasks in physical AI. Claru's annotation teams are trained on platform-specific failure taxonomies for Franka Emika, UR5e, and xArm, and work with synchronized multi-signal review tools that display camera feeds, force/torque readings, and joint torque residuals in a single timeline. We provide automated pre-annotation with signal-based failure detection, human-in-the-loop correction targeting kappa above 0.80, and causal chain annotations that identify actionable root causes. For teams building robust manipulation policies or failure-recovery systems, Claru delivers failure-annotated datasets in robomimic HDF5 or RLDS format with configurable success/failure filters and per-episode quality scores.",
};

export default data;
