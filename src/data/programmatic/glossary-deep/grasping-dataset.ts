import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "grasping-dataset",
  termSlug: "grasping-dataset",
  category: "data-modalities",
  metaTitle: "Grasping Dataset — Definition & Training Data | Claru",
  metaDescription: "A grasping dataset pairs object geometry with grasp poses and outcomes. Learn collection methods, annotation standards, and how quality grasp data trains reliable robot manipulation.",
  primaryKeyword: "grasping dataset",
  secondaryKeywords: ["robotic grasping data", "grasp quality dataset", "grasp pose annotation", "antipodal grasp dataset", "6-DOF grasp data"],
  canonicalPath: "/glossary/grasping-dataset",
  h1: "Grasping Dataset: Collection Methods, Annotation Standards, and Robot Training",
  heroSubtitle: "A grasping dataset captures the relationship between object geometry, gripper pose, and grasp outcome. These datasets are the foundation for training robots to pick up, hold, and manipulate objects reliably in unstructured environments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Grasping Dataset", href: "/glossary/grasping-dataset" },
  ],
  sections: [],
  faqs: [
    {
      question: "What data modalities are typically included in a grasping dataset?",
      answer: "A comprehensive grasping dataset includes multiple synchronized modalities. At minimum, it contains RGB images or point clouds of the object and scene, the 6-DOF gripper pose at the moment of grasp, and a binary or continuous grasp success label. Richer datasets add depth maps, force/torque sensor readings during contact, tactile sensor output, gripper aperture width over time, and pre-grasp approach trajectories. Some datasets like ACRONYM provide only synthetic mesh-gripper pairs, while others like the Cornell Grasping Dataset use real camera images with rectangle grasp annotations. For dexterous hands, the data expands to include full hand joint configurations, contact point locations on the object surface, and per-finger force distributions. The choice of modalities depends on the downstream model: analytic grasp planners typically need point clouds and surface normals, while end-to-end visuomotor policies require raw RGB or RGB-D observations paired with full action trajectories."
    },
    {
      question: "How large does a grasping dataset need to be for production robot systems?",
      answer: "Dataset size requirements vary significantly by approach. Analytic grasp planners trained on point cloud features can achieve 80-90% success with 1,000 to 5,000 labeled grasps, because the geometric reasoning generalizes well across objects. End-to-end visuomotor policies typically need 10,000 to 100,000 real-world grasp attempts for robust performance across diverse objects. The Dex-Net 2.0 dataset contains 6.7 million synthetic point cloud-grasp pairs, enabling near-perfect grasp planning on seen object classes. In practice, most production teams combine a large synthetic pre-training dataset (100K+ grasps in simulation) with a smaller real-world fine-tuning set (1,000 to 10,000 grasps). The critical factor is object diversity — 5,000 grasps across 500 objects typically outperforms 50,000 grasps across 50 objects for generalization."
    },
    {
      question: "What is the difference between planar and 6-DOF grasping datasets?",
      answer: "Planar grasping datasets represent grasps as oriented rectangles in image space — an (x, y, theta, width) tuple indicating where and how a parallel-jaw gripper should close from a top-down approach. The Cornell Grasping Dataset and Jacquard Dataset use this representation. Planar grasp datasets are simpler to annotate and sufficient for bin-picking from overhead cameras but cannot represent approach angles or complex geometries. 6-DOF grasping datasets specify the full gripper pose in 3D space: position (x, y, z) plus orientation (roll, pitch, yaw). This enables grasps from arbitrary approach directions, which is essential for cluttered scenes where top-down access is blocked. Datasets like GraspNet-1Billion, ACRONYM, and ContactGraspNet provide 6-DOF labels. The industry trend is firmly toward 6-DOF datasets because production robots rarely have the luxury of a clean overhead approach."
    },
    {
      question: "How are grasping datasets annotated — manually or automatically?",
      answer: "Both methods are used, often in combination. Manual annotation involves human labelers marking grasp rectangles or poses on images, which is accurate but slow (typically 2-5 minutes per image for planar grasps, longer for 6-DOF). Automated annotation uses one of three strategies: (1) trial-and-error in the real world, where a robot attempts thousands of grasps and records success/failure — this was the approach behind Pinto and Gupta's 50K grasp dataset; (2) analytic grasp sampling in simulation, where physics-based metrics like force closure or epsilon quality score candidate grasps on object meshes — used by Dex-Net and ACRONYM; and (3) self-supervised labeling, where a robot executes grasps and uses a wrist-mounted camera or force sensor to automatically determine success. The most effective approach for building large-scale production datasets combines analytic simulation labels for pre-training with real-world self-supervised labels for domain adaptation."
    },
    {
      question: "How does Claru help teams build custom grasping datasets?",
      answer: "Claru supports grasping dataset construction at every stage of the pipeline. Our network of 10,000+ data collectors captures real-world grasp demonstrations across diverse objects, environments, and lighting conditions — the environmental variety that simulation alone cannot replicate. Collectors use instrumented grippers with force/torque sensors and multi-view camera rigs to capture rich, synchronized multimodal data. Claru's annotation team then labels grasp poses, contact points, success outcomes, and object categories with quality controls including multi-annotator agreement checks. For teams that already have simulation-generated grasp labels, Claru provides the real-world fine-tuning data that closes the sim-to-real gap. Datasets are delivered in standard formats compatible with GraspNet, Dex-Net, and custom training pipelines, with per-grasp metadata including object material, weight, and surface properties."
    },
  ],
  ctaHeading: "Building a Grasping Dataset?",
  ctaDescription: "Claru provides purpose-built datasets for physical AI and robotics. Tell us what your model needs to learn.",
  relatedGlossaryTerms: ["6-dof-grasp-planning", "manipulation-trajectory", "dexterous-manipulation", "point-cloud"],
  relatedGuidePages: ["how-to-build-a-grasping-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "A grasping dataset is a structured collection of data that pairs object observations — typically RGB images, depth maps, or point clouds — with grasp configurations and their outcomes. Each data point captures the geometric relationship between a gripper and a target object at the moment of grasp, along with a label indicating whether the grasp succeeded or failed. These datasets are the empirical foundation for nearly all learned grasping systems in modern robotics.\n\nThe simplest grasping datasets represent grasps as oriented rectangles in image space, specifying where a parallel-jaw gripper should close when approaching an object from directly above. The Cornell Grasping Dataset (2011) popularized this representation with 885 RGB-D images and approximately 8,000 labeled grasp rectangles. More expressive datasets use full 6-DOF grasp poses — position and orientation in 3D space — enabling grasps from arbitrary approach directions. GraspNet-1Billion (2020) provides over one billion grasp poses across 88 real-world scenes, while ACRONYM (2021) offers 17.7 million grasps across 8,872 ShapeNet object meshes generated through physics simulation.\n\nBeyond static grasp poses, modern grasping datasets increasingly capture the full grasp trajectory: the approach motion, contact establishment, force application, lift, and transport. This temporal dimension is critical for training end-to-end visuomotor policies that must execute grasps as fluid motions rather than discrete pose targets. Datasets from teleoperation campaigns — where human operators control a robot gripper through the complete pick-and-place cycle — provide this trajectory-level supervision.\n\nThe quality of a grasping dataset is determined by several factors beyond raw size. Object diversity ensures the trained model generalizes across shapes, sizes, materials, and weights. Scene complexity — the degree of clutter, occlusion, and stacking — determines whether the model can handle realistic deployment conditions. Grasp label accuracy, measured through inter-annotator agreement or real-world validation rates, directly impacts the signal-to-noise ratio in training. Environmental variation in lighting, backgrounds, and camera viewpoints prevents the model from overfitting to superficial visual features. State-of-the-art grasping systems achieve 90-95% success on novel objects by training on datasets that optimize across all these dimensions simultaneously.",
  historicalContext: "Robotic grasping research began with purely analytic approaches in the 1980s, where researchers like Nguyen (1988) and Ferrari and Canny (1992) formulated grasp quality as a geometric optimization problem. These methods required exact 3D object models and computed force-closure grasps through contact analysis — no training data was needed, but the approaches failed on novel objects without pre-built CAD models.\n\nThe data-driven era began with Saxena et al. (2006), who trained a supervised learning model to predict grasp points from synthetic images — one of the first demonstrations that grasps could be learned from data rather than derived analytically. The Cornell Grasping Dataset (Lenz et al., 2013) established the standard evaluation protocol for planar grasp detection and catalyzed a wave of CNN-based grasp prediction models.\n\nA paradigm shift came from large-scale self-supervised data collection. Pinto and Gupta (2016) had a Baxter robot attempt 50,000 random grasps over 700 hours, recording which attempts succeeded. Levine et al. (2018) at Google scaled this to 800,000 grasps across 14 robots, demonstrating that sheer data volume could substitute for hand-engineered grasp quality metrics. Dex-Net (Mahler et al., 2017) took the complementary approach of massive simulation-based dataset generation, producing millions of analytic grasp quality labels on synthetic point clouds.\n\nRecent work has shifted toward 6-DOF grasping in clutter. GraspNet-1Billion (Fang et al., 2020) combined real scene point clouds with billions of simulated grasp labels. Contact-GraspNet (Sundermeyer et al., 2021) introduced contact-based grasp representations. The field is now converging on large-scale datasets that combine simulation breadth with real-world trajectory demonstrations, reflecting the foundation model paradigm that has transformed other areas of AI.",
  practicalImplications: "Building an effective grasping dataset requires making several interconnected decisions at the outset. The grasp representation — planar rectangle, 6-DOF pose, or full trajectory — constrains which models can be trained and which deployment scenarios are supported. Teams targeting bin-picking with overhead cameras may start with planar representations for faster annotation, but most production applications require 6-DOF data for robustness to arbitrary object arrangements.\n\nData collection methodology significantly impacts dataset utility. Self-supervised collection (robot trial-and-error) produces large volumes but biased distributions — the robot tends to repeat grasps that succeed early, under-sampling difficult object geometries. Teleoperation produces higher-quality demonstrations with natural grasp strategies but is expensive at $50-200 per hour of operator time. Simulation-based generation offers unlimited scale but introduces a domain gap that must be closed with real-world data. The most effective pipelines use simulation for broad coverage (100K+ grasps), teleoperation for quality demonstrations on target objects (1,000-5,000 grasps), and self-supervised collection for domain-specific calibration (5,000-20,000 grasps).\n\nAnnotation quality control is non-negotiable for grasping datasets. A single mislabeled grasp — a failure labeled as success — can cause a trained policy to attempt physically impossible grasps. Best practices include multi-annotator redundancy (3+ labels per grasp for subjective quality assessments), automated physics-based validation of proposed grasp poses against object meshes, and stratified quality audits across object categories. For production datasets, Claru enforces a minimum 95% label accuracy verified through physical robot validation on a held-out test set.\n\nFormat standardization enables interoperability across the growing ecosystem of grasp learning frameworks. The GraspNet format (scene point cloud + grasp pose array + quality scores) is widely adopted for 6-DOF grasp planning. For end-to-end policies, RLDS and HDF5 formats store full trajectories with synchronized observations and actions. Claru delivers grasping datasets in the format matching each team's training infrastructure, with complete metadata including object categories, material properties, and grasp type labels.",
  commonMisconceptions: [
    {
      misconception: "Bigger grasping datasets always produce better grasping performance.",
      correction: "Object and scene diversity matter more than raw grasp count. A dataset of 5,000 grasps across 500 diverse objects typically outperforms 50,000 grasps on 50 objects. Levine et al. (2018) showed that data from multiple robots and environments was more valuable than more data from a single setup. Quality filtering also improves results — removing the lowest 20% of demonstrations by quality score consistently yields better trained policies than using all available data."
    },
    {
      misconception: "Simulation-generated grasping datasets eliminate the need for real-world data collection.",
      correction: "Despite advances in simulation realism, a persistent domain gap exists in contact physics, material properties, and visual appearance. Dex-Net models trained purely on synthetic data achieve 80-93% success in the real world, but adding just 1,000-2,000 real-world fine-tuning examples pushes success rates above 95%. The gap is especially pronounced for deformable objects, transparent objects, and reflective surfaces where simulation physics diverge most from reality."
    },
    {
      misconception: "Grasping datasets only need to capture the moment of grasp, not the full trajectory.",
      correction: "Static grasp pose datasets are sufficient for grasp planning — selecting where to grasp — but modern visuomotor policies require full approach-grasp-lift trajectories to learn smooth, reactive manipulation. The approach motion determines collision avoidance, the grasp force profile determines object stability, and the lift trajectory determines whether fragile objects survive. Trajectory-level datasets like those from teleoperation campaigns provide this temporal supervision that pose-only datasets lack."
    },
  ],
  keyPapers: [
    {
      id: "mahler-dexnet-2017",
      title: "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312",
    },
    {
      id: "fang-graspnet-2020",
      title: "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.13470",
    },
    {
      id: "eppner-acronym-2021",
      title: "ACRONYM: A Large-Scale Grasp Dataset",
      authors: "Eppner et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2011.09584",
    },
    {
      id: "sundermeyer-contactgraspnet-2021",
      title: "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127",
    },
    {
      id: "levine-grasping-2018",
      title: "Learning Hand-Eye Coordination for Robotic Grasping with Deep Learning and Large-Scale Data Collection",
      authors: "Levine et al.",
      venue: "IJRR 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1603.02199",
    },
  ],
  claruRelevance: "Claru addresses the critical bottleneck in grasping dataset construction: acquiring diverse, high-quality real-world grasp data at scale. Our network of 10,000+ data collectors captures teleoperated grasp demonstrations across hundreds of object categories, material types, and environmental conditions — the breadth that neither small lab teams nor simulation alone can achieve. Each grasp trajectory is recorded with synchronized RGB, depth, force/torque, and proprioceptive data, then annotated with grasp pose labels, success outcomes, object properties, and contact point locations. Claru's quality pipeline enforces multi-annotator agreement checks and physics-based validation, delivering grasping datasets with 95%+ label accuracy. For teams building on Dex-Net, GraspNet, or custom architectures, Claru provides the real-world fine-tuning data that closes the sim-to-real gap and pushes grasp success rates from research-grade to production-grade.",
};

export default data;
