import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "6-dof-grasp-planning",
  termSlug: "6-dof-grasp-planning",
  category: "robotics-fundamentals",
  metaTitle: "6-DOF Grasp Planning — Definition & Training Data | Claru",
  metaDescription: "6-DOF grasp planning computes full position and orientation for robotic grasps. Learn how it works, what data it needs, key research, and common pitfalls.",
  primaryKeyword: "6-DOF grasp planning",
  secondaryKeywords: ["6DOF grasping", "grasp pose estimation", "grasp synthesis", "SE(3) grasp", "robotic grasping data", "grasp quality metric"],
  canonicalPath: "/glossary/6-dof-grasp-planning",
  h1: "6-DOF Grasp Planning: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "6-DOF grasp planning determines where and how a robot gripper should approach, contact, and close around an object in full six-dimensional space. This page covers the theory, data requirements, key papers, and practical considerations for building grasping systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "6-DOF Grasp Planning", href: "/glossary/6-dof-grasp-planning" },
  ],
  sections: [],
  faqs: [
    {
      question: "What training data does 6-DOF grasp planning require?",
      answer: "6-DOF grasp planning models require dense point clouds or depth images of target objects paired with successful grasp pose labels in SE(3) — three positional coordinates and three orientation angles. A typical supervised grasp planner is trained on tens of thousands of object-grasp pairs. GraspNet-1Billion, for example, provides 1.1 billion grasp annotations across 88 objects scanned from 256 camera viewpoints. For real-world systems, data must include cluttered multi-object scenes, varying lighting, and partial occlusions to produce a planner that works beyond isolated tabletop objects. Tactile data and grasp success/failure labels from physical execution further improve planning accuracy.",
    },
    {
      question: "How does 6-DOF grasp planning differ from planar (top-down) grasping?",
      answer: "Planar grasping constrains the gripper to approach objects from directly above, reducing the problem to three degrees of freedom — x, y, and a rotation angle. 6-DOF grasp planning removes this constraint, allowing the gripper to approach from any direction and orientation in SE(3). This is essential for grasping objects in shelves, bins, or cluttered scenes where a top-down approach is physically impossible. The search space is vastly larger: a 6-DOF planner must evaluate or sample grasps across a continuous 6D manifold rather than a 3D one. This makes 6-DOF planning more data-hungry but also far more capable in real-world deployment.",
    },
    {
      question: "Can simulation data train an effective 6-DOF grasp planner?",
      answer: "Simulation is widely used for initial grasp planner training because exhaustive physical trials would be prohibitively slow. Projects like Dex-Net and GraspNet use physics simulators to generate millions of grasp-success labels in hours. However, sim-to-real transfer remains a bottleneck. Simulated depth sensors lack the noise patterns of real Intel RealSense or Azure Kinect cameras, and simulated contact physics miss deformable and slippery surfaces. The most effective approach combines large-scale simulated pretraining with a smaller corpus of real-world grasp executions — typically 5,000 to 20,000 physical trials — for domain adaptation.",
    },
    {
      question: "What point cloud density is needed for reliable 6-DOF grasp planning?",
      answer: "Most state-of-the-art 6-DOF planners operate on point clouds downsampled to 10,000 to 25,000 points per scene. Contact-GraspNet uses 20,000-point inputs; GraspNet-1Billion evaluates on clouds with roughly 25,000 points. Lower densities (below 5,000 points) lose fine geometric detail needed for precise finger placement, while higher densities increase compute cost without proportional accuracy gains. For transparent or reflective objects where depth sensors produce holes, teams augment raw clouds with shape completion networks before feeding them to the planner.",
    },
    {
      question: "How are 6-DOF grasp planning models evaluated?",
      answer: "Evaluation uses two complementary approaches. Offline metrics measure grasp coverage (percentage of objects for which at least one collision-free grasp is found) and grasp quality scores based on force-closure analysis or epsilon metrics. The standard benchmark is GraspNet-1Billion's test split, reporting Average Precision at friction coefficients of 0.2, 0.4, and 0.8. Online evaluation measures physical grasp success rate: the robot attempts grasps on a set of objects and reports the percentage successfully lifted and held. Top methods achieve 90%+ success on isolated objects but drop to 70-85% in dense clutter — the gap between offline metrics and physical performance remains an active research problem.",
    },
  ],
  ctaHeading: "Need Grasping Data for Your Robot?",
  ctaDescription: "Claru provides point cloud datasets, grasp annotations, and real-world manipulation recordings for training and evaluating 6-DOF grasp planners across diverse object categories.",
  relatedGlossaryTerms: ["manipulation-trajectory", "point-cloud", "depth-data", "dexterous-manipulation", "contact-rich-manipulation"],
  relatedGuidePages: ["how-to-build-a-grasping-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  longDefinition: `6-DOF grasp planning is the computational problem of determining a full six-dimensional gripper pose — three translational coordinates (x, y, z) and three rotational angles (roll, pitch, yaw) — that will result in a stable grasp on a target object. The "6-DOF" refers to the six degrees of freedom in the rigid-body transformation group SE(3), which fully specifies the position and orientation of the end-effector in three-dimensional space. Unlike planar or top-down grasping approaches that restrict the gripper to approach from above, 6-DOF planning enables robots to grasp objects from any direction, which is essential for real-world tasks involving shelving, bin-picking, and cluttered tabletop manipulation.

The canonical 6-DOF grasp planning pipeline begins with perception: a depth camera or LiDAR sensor produces a point cloud or depth image of the workspace. A grasp proposal network then generates candidate grasp poses — typically hundreds or thousands per scene — scored by a predicted probability of grasp success. The highest-scoring collision-free grasp is selected and sent to a motion planner that computes a feasible arm trajectory to the pre-grasp position, followed by approach and closure. Analytical methods based on force-closure analysis dominated early work, but learning-based approaches now achieve significantly higher success rates on novel objects by training on large datasets of grasp attempts.

Modern grasp planners fall into two broad families. Sampling-based methods like GPD (Grasp Pose Detection) generate grasp candidates by sampling points on the object surface and evaluating each with a learned classifier. Regression-based methods like Contact-GraspNet directly predict per-point grasp parameters from the input point cloud, avoiding the expensive sampling loop. A third emerging category uses diffusion models or score-based generative models to sample grasps from a learned distribution over SE(3), enabling multi-modal grasp prediction where several distinct grasp strategies (power grasp, pinch grasp, side grasp) are proposed for the same object.

The quality of training data is the primary determinant of 6-DOF planner performance. Grasp annotations must include the full SE(3) pose, gripper width, and a binary or continuous success label. Datasets must cover diverse object geometries — from convex boxes to concave bowls to articulated tools — and scene configurations ranging from isolated objects to dense clutter with significant occlusion. Without this diversity, planners overfit to training object shapes and fail on novel items encountered during deployment.`,

  historicalContext: `Robotic grasping research stretches back to the 1980s, when analytical methods based on form closure and force closure dominated. Nguyen (1988) established the mathematical foundations for computing force-closure grasps on polygonal objects, and the GraspIt! simulator (Miller & Allen, 2004) provided the first widely used tool for evaluating grasp quality on 3D meshes. These analytical approaches required complete geometric models of target objects, making them impractical for novel object grasping.

The shift to data-driven grasping began with the Dex-Net project at UC Berkeley. Mahler et al. introduced Dex-Net 1.0 (2016) and Dex-Net 2.0 (2017) as large-scale datasets of simulated grasps on object meshes, paired with analytical grasp quality metrics. Dex-Net 2.0 trained a Grasp Quality CNN on 6.7 million synthetic point clouds and achieved 93% success on isolated novel objects — a breakthrough that demonstrated deep learning could replace hand-tuned grasp heuristics. However, Dex-Net operated in a planar 4-DOF setting (top-down approach with x, y, z, and rotation).

The transition to full 6-DOF planning accelerated with GPD (ten Pas et al., 2017), which sampled 6-DOF grasp candidates from point clouds and classified each with a CNN. PointNetGPD (Liang et al., 2019) replaced the CNN with a PointNet architecture for direct point cloud processing. The field's data infrastructure took a major leap with GraspNet-1Billion (Fang et al., 2020), which provided 1.1 billion grasp annotations across 88 objects from 190 RGB-D scenes, establishing the first large-scale benchmark for 6-DOF grasp evaluation. Contact-GraspNet (Sundermeyer et al., 2021) then demonstrated that per-point grasp regression — predicting SE(3) grasps at every point in the cloud simultaneously — could achieve both speed and accuracy, enabling real-time closed-loop grasping. Recent work integrates language conditioning, allowing planners to select which object to grasp based on natural language instructions.`,

  practicalImplications: `For teams building production grasping systems, the first design decision is the perception modality. Most 6-DOF planners operate on point clouds from commodity depth sensors — the Intel RealSense D415/D435 and Microsoft Azure Kinect are the most common in research. Sensor placement matters significantly: eye-in-hand (camera mounted on the wrist) provides close-up views during approach but limited global scene awareness, while fixed overhead or shoulder-mounted cameras give broader context but lower spatial resolution on small objects. Many production systems use both configurations, fusing point clouds from two or three viewpoints.

Data collection for 6-DOF grasping follows one of three paradigms. First, pure simulation: generating millions of grasp labels in Isaac Sim or MuJoCo against procedurally generated or scanned object meshes, then transferring to reality with domain randomization. Second, self-supervised physical collection: the robot autonomously attempts grasps and records binary success outcomes, as in the Google brain grasping project that collected 800,000 grasp attempts across 7 robots. Third, human annotation: experts label grasp poses on point cloud visualizations, which produces higher-quality labels but scales poorly. The practical optimum combines simulated pretraining with 5,000-20,000 real-world grasp executions for domain adaptation.

Evaluation must happen in the real world. Offline metrics on held-out scenes do not reliably predict physical success rates because they cannot capture sensor noise, calibration error, or the dynamics of contact. Standard physical benchmarks use 20-50 novel objects arranged in bins at varying clutter densities. Success rate (percentage of grasps that lift and hold the object for 3+ seconds) and clearance rate (percentage of objects cleared from a bin in N attempts) are the metrics that matter for deployment.

Claru supports 6-DOF grasping teams by providing annotated point cloud datasets from real warehouse, kitchen, and industrial scenes with ground-truth depth maps, instance segmentation masks, and object pose labels. These datasets serve both as training data for grasp planners and as standardized evaluation sets for comparing system performance across object categories and clutter densities.`,

  commonMisconceptions: [
    {
      misconception: "6-DOF grasp planning only matters for industrial bin-picking and is not relevant to general-purpose robots.",
      correction: "Any robot that operates in unstructured environments — kitchens, hospitals, homes, warehouses — needs 6-DOF grasping. Objects on shelves, inside drawers, or in cluttered sinks cannot be approached from directly above. Humanoid robots, mobile manipulators, and assistive robots all require full SE(3) grasp planning to handle the diversity of real-world object placements.",
    },
    {
      misconception: "A 6-DOF grasp planner trained on enough synthetic data will work on any object in the real world without real-world fine-tuning.",
      correction: "Sim-to-real transfer for grasping has improved substantially but is not solved. Simulated depth sensors produce clean, hole-free point clouds that differ from real sensor output on reflective, transparent, or thin objects. Contact dynamics in simulation miss friction anisotropy and surface deformation. Every production grasping system published to date includes a real-world data collection or fine-tuning stage. Dex-Net, Contact-GraspNet, and AnyGrasp all require real-world calibration data to reach their published success rates.",
    },
    {
      misconception: "More grasp candidates per scene always improves the success rate of a 6-DOF planner.",
      correction: "Generating more candidates helps up to a saturation point, typically 200-500 per scene, after which additional candidates are redundant or low-quality. Beyond that threshold, the bottleneck shifts to grasp scoring accuracy and collision checking. Spending compute on better per-grasp evaluation — incorporating tactile prediction, approach-path feasibility, and post-grasp stability — yields more improvement than brute-force candidate generation.",
    },
  ],

  keyPapers: [
    {
      id: "fang-graspnet1b-2020",
      title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.13470",
    },
    {
      id: "sundermeyer-contact-graspnet-2021",
      title: "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127",
    },
    {
      id: "mahler-dexnet2-2017",
      title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312",
    },
    {
      id: "tenpas-gpd-2017",
      title: "Grasp Pose Detection in Point Clouds",
      authors: "ten Pas et al.",
      venue: "IJRR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1706.09911",
    },
    {
      id: "fang-anygrasp-2023",
      title: "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      authors: "Fang et al.",
      venue: "IEEE T-RO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.08333",
    },
  ],

  claruRelevance: `Claru provides the real-world perception data that 6-DOF grasp planners need for training and evaluation. Our catalog includes RGB-D point cloud captures from warehouse, kitchen, and industrial environments with dense clutter, partial occlusions, and diverse object geometries — the exact conditions where production grasping systems must operate. Each scene includes calibrated depth maps, instance segmentation masks, and object pose annotations that enable teams to generate ground-truth grasp labels for their specific gripper geometry.

For teams transitioning from simulated to real-world grasping, Claru offers targeted data collection: high-resolution depth scans of customer-specified object categories captured under varied lighting, sensor angles, and background conditions. Our 10,000+ data collectors across 100+ cities can capture the environmental diversity that prevents grasp planners from overfitting to a single lab setup. The data passes through a quality pipeline that validates depth completeness, point cloud registration accuracy, and annotation consistency — addressing the data quality issues that cause the largest performance gaps between simulated and real-world grasping.`,
};

export default data;
