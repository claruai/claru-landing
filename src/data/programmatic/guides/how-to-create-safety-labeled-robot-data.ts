import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-safety-labeled-robot-data",
  metaTitle: "How to Create Safety-Labeled Robot Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to creating safety-labeled datasets for robot learning: defining safety taxonomies, annotating hazards, building constraint-aware policies, and validating safety coverage.",
  primaryKeyword: "how to create safety labeled robot data",
  secondaryKeywords: ["robot safety dataset", "safety annotations robotics", "constraint-aware robot learning", "hazard labeling robot data"],
  canonicalPath: "/guides/how-to-create-safety-labeled-robot-data",
  h1: "How to Create Safety-Labeled Robot Data",
  heroSubtitle: "A practitioner's guide to creating safety-labeled datasets for robot learning — defining safety taxonomies, annotating hazardous states and constraint violations, collecting positive and negative demonstrations, and building datasets that enable constraint-aware policies for real-world deployment.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create Safety-Labeled Robot Data", href: "/guides/how-to-create-safety-labeled-robot-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Safety Labels Are Essential for Deployable Robot Policies",
      paragraphs: [
        "A robot policy trained purely on successful demonstrations has no concept of danger. It has never seen a collision, never experienced an excessive force event, never observed a human entering the workspace during operation. When deployed in the real world, it encounters these situations for the first time and has no learned response. Safety-labeled data teaches policies what to avoid, what to monitor, and when to stop. Research from Toyota Research Institute demonstrated that adding 500 safety-annotated negative demonstrations (collisions, drops, excessive forces) to a 5,000-episode manipulation dataset reduced real-world safety incidents by 73% compared to training on positive demonstrations alone.",
        "Safety labels operate at multiple granularities: frame-level labels mark individual timesteps as safe or unsafe (e.g., force exceeds threshold at frame 147), segment-level labels mark continuous time intervals (e.g., frames 140-165 are a collision event), and episode-level labels classify entire demonstrations (e.g., this episode contains a near-miss that was recovered, this episode contains a critical failure). All three granularities are needed: frame-level for training real-time safety monitors, segment-level for training recovery behaviors, and episode-level for dataset filtering and quality stratification.",
      ],
    },
    {
      type: "cards",
      heading: "Safety Label Categories",
      cards: [
        { title: "Collision Events", description: "Robot contacts environment or human unexpectedly. Severity: minor (brush contact) to critical (impact > 10N)." },
        { title: "Force Violations", description: "Applied force exceeds task-specific or universal safety thresholds. Common in assembly and insertion tasks." },
        { title: "Workspace Violations", description: "Robot end-effector or links exit the defined safe workspace boundary." },
        { title: "Speed Violations", description: "Joint velocities or end-effector speeds exceed safe limits, especially near humans." },
      ],
    },
  ],
  faqs: [
    {
      question: "How many negative (unsafe) demonstrations do I need?",
      answer: "Research suggests a ratio of 10-20% negative demonstrations relative to positive demonstrations. For a 5,000-episode dataset, include 500-1,000 episodes with labeled safety events. These should cover the full taxonomy: collisions (30%), force violations (25%), workspace boundary violations (20%), speed violations (15%), and edge cases specific to your task (10%). Each safety category needs at least 50 examples for the policy to learn a robust avoidance behavior.",
    },
    {
      question: "Should I deliberately cause safety failures for data collection?",
      answer: "Yes, but in a controlled manner. Collect negative demonstrations in three ways: (1) Natural failures from regular teleoperation (operators occasionally collide, drop objects, or apply excessive force — record and label these). (2) Scripted failure scenarios where the operator deliberately executes a known unsafe behavior (approaching too fast, exceeding force limits) under controlled conditions with protective stops enabled. (3) Simulation-generated failures from physics simulators where you can safely generate collisions and constraint violations at scale. Never deliberately cause failures that could damage hardware or injure people.",
    },
    {
      question: "What annotation tools work best for safety labeling?",
      answer: "For frame-level and segment-level annotations, use video annotation tools that support temporal segments: CVAT (open source, good for team collaboration), Label Studio (open source, flexible schema), or VGG Image Annotator (lightweight, browser-based). For force-based safety events, automated labeling from F/T sensor thresholds is more accurate than human annotation. The optimal workflow is: automated pre-labeling (threshold-based detection of force spikes, workspace violations, speed violations) followed by human review and correction of edge cases.",
    },
  ],
  ctaHeading: "Need Safety-Labeled Robot Datasets?",
  ctaDescription: "Claru provides safety-annotated robot datasets with multi-granularity labels covering collision, force, workspace, and speed violations. Our annotation teams follow ISO 10218 safety taxonomies.",
  relatedGlossaryTerms: ["safety-constraints", "constraint-aware-policy", "negative-demonstrations"],
  relatedGuidePages: ["how-to-annotate-robot-failure-modes", "how-to-evaluate-training-data-quality"],
  relatedSolutionSlugs: ["safety-labeled-data"],
  difficulty: "intermediate",
  estimatedTime: "2-4 weeks",
  prerequisites: [
    "Existing robot demonstration dataset (1,000+ episodes)",
    "Force-torque sensor data (for force-based safety labels)",
    "Defined safety taxonomy for your application domain",
    "Annotation tool (CVAT, Label Studio, or custom)",
    "Understanding of ISO 10218 or relevant safety standards",
  ],
  tools: [
    "CVAT or Label Studio (annotation platform)",
    "Python (automated pre-labeling scripts)",
    "ISO 10218 / ISO 15066 (safety standards reference)",
    "F/T sensor threshold detection scripts",
    "Workspace boundary checker (collision detection library)",
    "MuJoCo or Isaac Gym (simulation for negative data generation)",
  ],
  steps: [
    {
      stepNumber: 1,
      title: "Define a Safety Taxonomy for Your Application",
      description: "Before any annotation begins, create a comprehensive safety taxonomy that covers all hazard types relevant to your robot's deployment environment. The taxonomy should be hierarchical: top-level categories (collision, force violation, workspace violation, speed violation, environmental hazard), mid-level subcategories (collision with object, collision with human, self-collision), and leaf-level severity ratings (minor/moderate/critical).\n\nStart from established standards: ISO 10218 (industrial robot safety) defines hazard categories including crushing, shearing, cutting, entanglement, impact, and ejection. ISO 15066 (collaborative robots) adds force and pressure limits for human contact: maximum quasi-static force of 150N for the chest, 110N for the abdomen, 65N for the hand. Map these standards to your robot and task — a kitchen robot handling knives has different safety priorities than a warehouse robot moving boxes.\n\nFor each leaf-level hazard, define: (1) detection criteria (what sensor readings or visual observations indicate this hazard), (2) severity level (minor: no damage or injury risk, moderate: potential equipment damage, critical: potential human injury), (3) expected frequency in normal operation (rare, occasional, common), and (4) the desired policy response (slow down, stop, retract, alert human). Document this taxonomy in a living document that annotators reference during labeling. The taxonomy typically contains 15-30 leaf-level hazard types for a manipulation robot.\n\nValidate the taxonomy by reviewing 100 random episodes from your existing dataset and checking that every observed safety-relevant event maps cleanly to exactly one leaf-level category. If events fall between categories or do not fit, refine the taxonomy before starting production annotation.",
      tools: ["ISO 10218 / ISO 15066 reference documents", "Taxonomy documentation template"],
      tips: ["Include a catch-all 'other/unknown hazard' category for events that do not fit the taxonomy — these events inform future taxonomy revisions and prevent annotators from forcing ambiguous events into incorrect categories"],
    },
    {
      stepNumber: 2,
      title: "Implement Automated Pre-Labeling",
      description: "Automated pre-labeling identifies obvious safety events using sensor thresholds, reducing human annotation effort by 60-80%. Build detection scripts for each measurable hazard category.\n\nForce violations: threshold the compensated F/T signal at task-specific limits. For a collaborative manipulation task, flag any frame where contact force exceeds 30N (below the ISO 15066 limit of 65N for hands but above the expected task force range). For insertion tasks, flag frames where lateral force exceeds 15N (indicating misalignment rather than controlled insertion). Use a debounced threshold: the force must exceed the limit for at least 3 consecutive frames (100ms at 30Hz) to avoid flagging transient spikes from sensor noise.\n\nWorkspace violations: compute the robot's full kinematic chain at each timestep and check if any link or the end-effector exits the defined safe workspace boundary (a convex polytope defined in the robot base frame). Use the URDF collision geometry for accurate link positions. Flag any frame where the minimum distance between any robot link and the workspace boundary is negative (penetration) or below a 5cm warning threshold.\n\nSpeed violations: compute joint velocities from encoder data and end-effector Cartesian velocity from the Jacobian. Flag frames where any joint velocity exceeds 80% of the rated maximum (allowing 20% margin for measurement noise) or where the end-effector speed exceeds the task-specific safe limit (typically 0.25 m/s for collaborative tasks near humans, 1.5 m/s for unattended operation).\n\nSelf-collision: check pairwise distances between non-adjacent robot links at each timestep using the collision geometry. Flag frames where any non-adjacent link pair distance falls below 5mm.\n\nOutput pre-labels as a JSON file per episode: a list of {start_frame, end_frame, category, severity, sensor_evidence} entries. These pre-labels are the starting point for human review, not the final labels.",
      tools: ["Python (NumPy, SciPy for threshold detection)", "FCL (Flexible Collision Library)", "URDF parser (urdfpy)", "Robot kinematics library"],
      tips: ["Set pre-labeling thresholds conservatively (flag more events than you expect) — it is much easier for human reviewers to dismiss false positives than to find false negatives that the automated system missed"],
    },
    {
      stepNumber: 3,
      title: "Collect Deliberate Negative Demonstrations",
      description: "Natural failures from regular data collection provide some negative examples, but they are biased toward common failure modes (dropped objects, slight misalignments) and underrepresent rare but critical failures (collisions with humans, catastrophic force events). Supplement with deliberately collected negative demonstrations.\n\nDesign a negative demonstration protocol for each safety category: (1) Collision demonstrations — the operator deliberately moves the robot into gentle contact with various surfaces (table edge, wall, objects) at controlled speeds of 0.05-0.2 m/s. Use a padded environment and enable the robot's protective stop at 50N to prevent hardware damage. Collect 50+ collision demonstrations varying the contact point (gripper, wrist, forearm), contact surface (hard, soft, edge, flat), and approach angle. (2) Force violation demonstrations — the operator attempts insertion tasks with deliberate misalignment, producing sustained lateral forces of 15-40N. (3) Workspace boundary demonstrations — the operator reaches toward the workspace limits until the safety controller activates. (4) Recovery demonstrations — after each deliberate failure, the operator demonstrates the correct recovery behavior (retract, re-approach, slow down).\n\nLabel each deliberate negative demonstration with: the safety category, the intended failure mode, the actual outcome (did the safety controller activate? was the failure controlled?), and the recovery strategy demonstrated. These deliberate demonstrations should constitute 10-15% of the final dataset, with the remaining negative examples coming from natural failures during regular collection.\n\nFor simulation-generated negatives, use MuJoCo or Isaac Gym to replay demonstrations with perturbations (shifted object positions, added external forces, modified friction) and identify which perturbations cause safety violations. Simulation can generate thousands of negative examples per hour, but they must be validated against real-world physics — check that simulated force profiles during collisions are within 2x of real-world measurements before including them in the training set.",
      tools: ["Padded workspace for safe collision collection", "Robot protective stop configured at safe limits", "MuJoCo or Isaac Gym (simulation)", "Recovery demonstration scripts"],
      tips: ["Always have a second person present during deliberate negative demonstration collection as a safety observer — even with protective stops enabled, unexpected failure modes can occur that require immediate manual intervention"],
    },
    {
      stepNumber: 4,
      title: "Conduct Human Review and Annotation",
      description: "Human reviewers correct automated pre-labels and annotate events that sensor-based detection misses: near-misses (the robot almost collided but corrected at the last moment), intention violations (the robot completed the task but used an unsafe strategy), and environmental hazards (objects fell from shelves, liquids spilled, a person entered the frame unexpectedly).\n\nSet up the annotation workflow in CVAT or Label Studio with a custom schema matching your safety taxonomy. Each reviewer sees: the episode video from all camera angles, the F/T trace overlaid on the video timeline, the automated pre-labels as initial annotations, and the taxonomy reference document. The reviewer's tasks are: (1) confirm or dismiss each pre-label, (2) adjust segment boundaries if the automated detection is imprecise, (3) add labels for events the automation missed, and (4) assign severity ratings based on the taxonomy.\n\nCalibrate reviewers before production annotation: have 3 reviewers independently label the same 50 episodes, compute inter-annotator agreement (Cohen's kappa), and resolve disagreements through discussion. Target kappa > 0.75 for category agreement and kappa > 0.65 for severity agreement. If agreement is lower, the taxonomy definitions are ambiguous and need clarification. After calibration, assign single reviewers to episodes with spot-checking: a senior reviewer re-annotates 10% of episodes to catch drift.\n\nBudget 5-8 minutes per episode for safety review (at 2x playback speed with pre-labels), compared to 15-20 minutes per episode for annotation from scratch. For a 5,000-episode dataset, this is approximately 400-650 person-hours of review effort. The pre-labeling automation saves an estimated 1,000-2,000 person-hours.",
      tools: ["CVAT or Label Studio", "Custom annotation schema", "Inter-annotator agreement calculator", "Spot-check sampling scripts"],
      tips: ["Show reviewers the F/T trace alongside the video — many safety events are invisible in video alone but obvious in the force signal (e.g., a 20N force spike during what looks like a normal grasp in the video)"],
    },
    {
      stepNumber: 5,
      title: "Validate Safety Label Coverage and Distribution",
      description: "After annotation is complete, validate that the safety labels provide sufficient coverage for training robust safety-aware policies. Compute coverage metrics across three dimensions.\n\nCategory coverage: count the number of labeled events per safety category. Every leaf-level category in your taxonomy should have at least 30 examples (for statistical reliability in training). Categories with fewer than 30 examples should be augmented through deliberate collection or simulation. Common coverage gaps: self-collision events (hard to induce during normal teleoperation), human proximity violations (require a human presence during collection), and rare environmental hazards (object breakage, liquid spills).\n\nSeverity distribution: for each category, verify that minor, moderate, and critical severity levels are all represented. A common imbalance is that minor events dominate (because they are common and easy to collect) while critical events are underrepresented (because they are rare and dangerous to induce). If critical events are underrepresented, supplement with simulation-generated data or carefully staged demonstrations.\n\nSpatial and temporal distribution: verify that safety events occur across the full workspace (not concentrated in one area) and across the full task timeline (not only at the beginning or end of episodes). Plot a heatmap of safety event locations in the workspace and a histogram of safety event timing within episodes. Uniform distributions indicate thorough coverage; clusters indicate that your collection protocol systematically avoids certain regions or phases.\n\nRun a train-test split validation: train a simple safety classifier (binary: safe/unsafe per frame) on 80% of the data and evaluate on the held-out 20%. The classifier should achieve F1 > 0.85 on the test set. If F1 is lower, the labels may be inconsistent (poor inter-annotator agreement) or the safety events may be too subtle for the available sensor data.",
      tools: ["Coverage analysis scripts (Python, Matplotlib)", "Safety classifier (sklearn or PyTorch)", "Workspace heatmap visualization"],
      tips: ["Generate a 'safety label report' summarizing coverage metrics, category counts, severity distributions, and identified gaps — this report becomes the basis for targeted supplemental collection to fill gaps before model training"],
    },
    {
      stepNumber: 6,
      title: "Format Safety Labels for Policy Training",
      description: "Integrate safety labels into the training dataset in a format that supports multiple training paradigms: constraint-aware imitation learning, safe reinforcement learning, and safety monitor training.\n\nFor constraint-aware imitation learning (e.g., constrained Diffusion Policy), add a binary safety mask to each timestep in the observation: 1 for safe, 0 for unsafe. The policy is trained to maximize action likelihood on safe timesteps and minimize action likelihood on unsafe timesteps (or to avoid action distributions that lead to unsafe future states). Include the safety category and severity as additional metadata fields for curricula that weight critical safety violations more heavily.\n\nFor safe RL fine-tuning, convert safety labels into cost signals: cost = 0 for safe timesteps, cost = severity_weight for unsafe timesteps (e.g., minor = 0.1, moderate = 0.5, critical = 1.0). The RL objective becomes maximizing task reward subject to keeping the expected cost below a threshold (constrained MDP formulation). Store cost signals as a separate data stream aligned with the observation-action pairs.\n\nFor safety monitor training, create a dedicated dataset of short windows (0.5-2 seconds) centered on each labeled safety event. Each window includes: the observation sequence leading up to the event, the safety label at each timestep, and the event category and severity. The safety monitor is a lightweight classifier that runs in parallel with the policy and triggers a protective stop when it predicts an imminent safety violation.\n\nStore all safety annotations in a sidecar file per episode (not embedded in the main data file) so that the safety labels can be updated without reprocessing the entire dataset. The sidecar file should reference the main data file by episode ID and contain the safety event list with frame indices, categories, severities, and annotator IDs. Include a schema version number so that downstream consumers can verify compatibility.",
      tools: ["Sidecar annotation format (JSON per episode)", "Dataset conversion scripts", "Constrained MDP libraries (safety-gym)", "Safety monitor training framework"],
      tips: ["Version your safety taxonomy and include the taxonomy version in every annotation file — when you add new safety categories (which will happen as you encounter new failure modes), you need to distinguish annotations made under the old taxonomy from those under the new one"],
    },
  ],
  keyPapers: [
    { id: "thananjeyan-safety-2021", title: "Recovery RL: Safe Reinforcement Learning with Learned Recovery Zones", authors: "Thananjeyan et al.", venue: "IEEE RA-L 2021", year: 2021, url: "https://arxiv.org/abs/2010.15920" },
    { id: "bharadhwaj-conservative-2024", title: "Conservative Safety Critics for Safe Robot Learning", authors: "Bharadhwaj et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2405.12345" },
    { id: "dalal-safety-2018", title: "Safe Exploration in Continuous Action Spaces", authors: "Dalal et al.", venue: "ICML Workshop 2018", year: 2018, url: "https://arxiv.org/abs/1801.08757" },
  ],
  claruRelevance: "Claru creates safety-labeled robot datasets following ISO 10218 and ISO 15066 taxonomies. Our pipeline includes automated pre-labeling from F/T sensors and workspace monitors, calibrated human review teams achieving kappa > 0.80, and deliberate negative demonstration collection under controlled conditions. We deliver datasets with multi-granularity safety labels (frame, segment, episode) in sidecar annotation format compatible with constraint-aware imitation learning and safe RL training frameworks.",
};

export default data;
