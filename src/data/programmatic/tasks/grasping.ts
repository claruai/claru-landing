import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "grasping",
  metaTitle: "Robot Grasping Training Data & Datasets | Claru",
  metaDescription:
    "Production-ready grasping datasets for robotic systems: parallel-jaw, suction, and multi-fingered grasps across 1000+ object categories with 6-DoF grasp annotations.",
  primaryKeyword: "robot grasping training data",
  secondaryKeywords: [
    "grasping dataset robotics",
    "6-dof grasp dataset",
    "robotic grasp planning data",
    "bin picking training data",
    "grasp detection dataset",
    "parallel jaw grasp data",
  ],
  canonicalPath: "/training-data/grasping",
  h1: "Grasping Training Data",
  heroSubtitle:
    "Large-scale grasping datasets spanning parallel-jaw, suction, and multi-fingered end effectors — annotated with 6-DoF grasp poses, success labels, and object properties for training reliable grasp planners.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Grasping", href: "/training-data/grasping" },
  ],
  sections: [
    {
      type: "prose",
      heading: "The Foundational Skill: Why Every Robot Needs Grasp Data",
      paragraphs: [
        "Grasping is the most fundamental manipulation primitive — a prerequisite for virtually every useful robot task. Despite decades of research, robust grasping in unstructured environments remains unsolved for many object categories. The challenge is combinatorial: a single parallel-jaw gripper approaching a novel object has a continuous 6-DoF pose space to search, and only a small fraction of that space yields stable grasps. Training data-driven grasp planners requires massive datasets that densely sample this pose space across diverse object geometries, materials, and environmental conditions.",
        "The field has evolved from analytic grasp planning (computing force closure mathematically) to learned grasp prediction, driven by datasets like Dex-Net 2.0 (Mahler et al., 2017) with 6.7 million synthetic grasp labels and the Cornell Grasping Dataset (Lenz et al., 2015) with 8,019 real-world grasp rectangles. Modern architectures like Contact-GraspNet (Sundermeyer et al., 2021) require 3D point cloud inputs and produce 6-DoF grasp poses with confidence scores, demanding training data that goes far beyond 2D grasp rectangles. AnyGrasp (Fang et al., 2023) extended this to real-time 6-DoF grasp detection from single-view point clouds, achieving 95.4% success rate on seen categories and 93.2% on novel objects when trained on a combination of synthetic and real data.",
        "Real-world grasping data is especially valuable because physics simulators struggle with contact dynamics for challenging objects: thin, deformable, transparent, or articulated items. Google's large-scale grasping study (Levine et al., 2018) collected 800,000 real grasp attempts across 14 robots over two months, demonstrating that real data at scale produces grasp success rates 15-20% higher than simulation-trained alternatives on novel household objects. The most challenging categories — transparent objects like glasses, deformable items like bags, and thin items like cards — show the largest sim-to-real gaps because their contact physics are hardest to simulate accurately.",
        "The economics of grasping data depend heavily on the deployment domain. Warehouse bin-picking requires broad object coverage (500+ SKUs) with moderate per-category depth. Manufacturing kitting demands high success rates (99.9%+) on a narrow set of known parts. Household robots need the broadest coverage across the long tail of everyday objects. Each application demands a different data strategy: breadth-first for warehouse, depth-first for manufacturing, and hybrid for home robotics.",
      ],
    },
    {
      type: "stats",
      heading: "Grasping Data by the Numbers",
      stats: [
        { value: "6.7M", label: "Synthetic grasps in Dex-Net 2.0" },
        { value: "800K", label: "Real attempts in Google study" },
        { value: "95.4%", label: "AnyGrasp success on seen objects" },
        { value: "15-20%", label: "Real vs sim performance gap" },
        { value: "6-DoF", label: "Standard grasp pose representation" },
        { value: "500+", label: "SKU categories for warehouse apps" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by End Effector Type",
      description:
        "Different gripper types require different data characteristics. This comparison helps plan data collection for your specific hardware.",
      columns: [
        "End Effector",
        "Data Volume",
        "Key Annotations",
        "Success Rate Baseline",
        "Primary Challenge",
      ],
      rows: [
        {
          "End Effector": "Parallel-jaw gripper",
          "Data Volume": "10K-100K attempts per category set",
          "Key Annotations": "6-DoF pose + aperture + success",
          "Success Rate Baseline": "90-95% on simple objects",
          "Primary Challenge": "Thin and flat objects",
        },
        {
          "End Effector": "Suction cup",
          "Data Volume": "5K-50K attempts per category set",
          "Key Annotations": "Contact point + normal + seal quality",
          "Success Rate Baseline": "85-95% on flat surfaces",
          "Primary Challenge": "Curved and porous surfaces",
        },
        {
          "End Effector": "Multi-fingered hand",
          "Data Volume": "5K-50K demos per task",
          "Key Annotations": "Per-finger contact + joint angles",
          "Success Rate Baseline": "70-85% depending on task",
          "Primary Challenge": "Contact coordination across fingers",
        },
        {
          "End Effector": "Hybrid (parallel-jaw + suction)",
          "Data Volume": "10K-100K per modality",
          "Key Annotations": "Modality selection + per-type annotations",
          "Success Rate Baseline": "95%+ with selection policy",
          "Primary Challenge": "Modality selection for novel objects",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Grasping",
      paragraphs: [
        "Contact-GraspNet (Sundermeyer et al., 2021) established the current paradigm for 6-DoF grasp detection from point clouds. The architecture takes a single-view point cloud, segments it into graspable regions, and predicts a set of 6-DoF gripper poses with confidence scores. Trained on 17K simulated cluttered scenes with ground-truth grasps, Contact-GraspNet achieves 92% success rate in real-world bin-picking when combined with 1,000 real-world fine-tuning grasps. The architecture processes a scene in 80 ms, enabling real-time grasp planning.",
        "AnyGrasp (Fang et al., 2023) advanced the field by training on a massive synthetic dataset of 1.2 billion grasp labels across 100K object models, then fine-tuning on 10K real-world grasps. The result is a universal grasp detector that achieves 95.4% success on seen categories and 93.2% on entirely novel objects — the highest published zero-shot generalization rate. AnyGrasp's key innovation is learning grasp affordances as dense per-point predictions rather than sampling from a generative model, enabling exhaustive coverage of the grasp space.",
        "For language-conditioned grasping — picking up a specific object from a cluttered scene based on a natural language description — Grasp-Anything (Vuong et al., 2023) combines foundation model features (CLIP, SAM) with 6-DoF grasp prediction. By training on 1M synthetic grasps paired with language descriptions, Grasp-Anything achieves 88% success on zero-shot language-guided grasping in real cluttered scenes. This represents the convergence of language understanding and manipulation, requiring training data that pairs grasp labels with natural language object descriptions.",
        "The remaining frontier is grasping transparent, reflective, and deformable objects — categories where both vision and physics simulation fail. Transparent objects produce corrupted depth readings, reflective objects generate spurious point cloud artifacts, and deformable objects change shape under grasp forces. ClearGrasp (Sajjan et al., 2020) and TransNet (Zhang et al., 2023) address transparent objects by learning to inpaint depth maps, but still require real grasping data on transparent objects for the manipulation policy. These challenging categories represent the highest-value gap for custom real-world data collection.",
      ],
    },
    {
      type: "prose",
      heading: "Building a Production Grasping Dataset",
      paragraphs: [
        "A production-grade grasping dataset must cover the object diversity encountered in deployment. For warehouse applications, this means 500+ SKU categories spanning groceries, electronics, soft goods, irregularly shaped items, and fragile objects. Each category needs 100-1,000 grasp attempts to capture the distribution of successful and failed grasp strategies, including approach angles, grasp points, and gripper aperture settings. The dataset should be stratified by difficulty: easy objects (rigid, geometric shapes), medium (varied geometry, moderate weight), and hard (deformable, transparent, articulated).",
        "Annotation standards for grasp data include the 6-DoF end-effector pose at grasp initiation, grasp type classification (power, pinch, lateral, suction), binary success label, and quantitative quality metrics like the epsilon quality score or force closure margin. For training grasp-conditioned manipulation policies, additional annotations include pre-grasp approach trajectory, lift height and stability assessment, and post-grasp object state verification. Scene-level annotations (number of objects, clutter density, occlusion percentage) enable training difficulty-aware grasping policies.",
        "The collection infrastructure for grasping data scales differently from other manipulation tasks because grasps are short (2-5 seconds each) and can be partially automated. A typical setup uses a robot with a mounted gripper, an overhead RGB-D camera, a bin or tabletop workspace, and an automated reset mechanism (dropping objects back into a bin between attempts). This enables 200-500 grasp attempts per hour with one operator supervising 2-4 stations simultaneously. Automated grasp quality scoring using lift-and-hold tests (lifting 10 cm and holding for 3 seconds) provides binary success labels without manual annotation.",
        "Claru's grasping data collection leverages standardized bin-picking and tabletop stations across our collection network, producing 500-2,000 labeled grasp attempts per station per day. Our annotation pipeline includes automated grasp quality scoring using point cloud analysis, supplemented by human validation for edge cases. Datasets are delivered with full 6-DoF pose labels, object meshes where available, and train/val/test splits stratified by object category and difficulty.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Robot Grasping",
      description:
        "Public grasping datasets span simulation and real-world, from small research benchmarks to industry-scale collections.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Type",
        "Modalities",
        "Grasp Rep.",
      ],
      rows: [
        {
          Dataset: "Cornell Grasping",
          Year: "2015",
          Scale: "8,019 grasps",
          Type: "Real",
          Modalities: "RGB-D",
          "Grasp Rep.": "2D rectangles",
        },
        {
          Dataset: "Dex-Net 2.0 (Mahler et al.)",
          Year: "2017",
          Scale: "6.7M grasps",
          Type: "Synthetic",
          Modalities: "Depth + analytic metrics",
          "Grasp Rep.": "4-DoF (planar)",
        },
        {
          Dataset: "Google Grasping (Levine et al.)",
          Year: "2018",
          Scale: "800K attempts",
          Type: "Real (14 robots)",
          Modalities: "RGB + binary outcome",
          "Grasp Rep.": "End-effector pose",
        },
        {
          Dataset: "AnyGrasp (Fang et al.)",
          Year: "2023",
          Scale: "1.2B synthetic + 10K real",
          Type: "Hybrid",
          Modalities: "Point cloud + success",
          "Grasp Rep.": "6-DoF SE(3) + width",
        },
        {
          Dataset: "GraspNet-1Billion",
          Year: "2020",
          Scale: "1.1B grasps",
          Type: "Synthetic",
          Modalities: "RGB-D + point cloud",
          "Grasp Rep.": "6-DoF with quality scores",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Grasping Data Needs",
      paragraphs: [
        "Claru maintains standardized grasping data collection stations optimized for parallel-jaw, suction, and multi-fingered end effectors. Each station features calibrated overhead and eye-in-hand RGB-D cameras, automated reset mechanisms for high-throughput collection, and standardized object libraries spanning 200+ categories. Our semi-automated pipeline achieves 500-2,000 labeled grasp attempts per station per day, with automated lift-and-hold success scoring and human validation for edge cases.",
        "Our catalog includes 50,000+ annotated grasp attempts across 200+ object categories with full 6-DoF pose labels, point cloud data, and grasp quality scores. For warehouse and logistics applications, we maintain category-specific object sets matching common SKU distributions. For clients requiring transparent, deformable, or reflective object grasping data — the hardest categories where simulation falls shortest — we provide dedicated collection campaigns with specialized depth completion and material-specific annotation protocols.",
        "Custom collections can target specific object distributions, environmental conditions (clutter density, lighting variation, occlusion levels), and end effector types with delivery in formats compatible with Contact-GraspNet, AnyGrasp, GQ-CNN, and custom architectures. Every dataset includes object mesh files where available, camera calibration data, and difficulty-stratified train/val/test splits for curriculum-based training.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "mahler-dexnet-2017",
          title:
            "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
          authors: "Mahler et al.",
          venue: "RSS 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1703.09312",
        },
        {
          id: "sundermeyer-contact-2021",
          title:
            "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
          authors: "Sundermeyer et al.",
          venue: "ICRA 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2103.14127",
        },
        {
          id: "levine-grasping-2018",
          title:
            "Learning Hand-Eye Coordination for Robotic Grasping with Deep Learning and Large-Scale Data Collection",
          authors: "Levine et al.",
          venue: "IJRR 2018",
          year: 2018,
          url: "https://arxiv.org/abs/1603.02199",
        },
        {
          id: "fang-anygrasp-2023",
          title:
            "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
          authors: "Fang et al.",
          venue: "IEEE T-RO 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2212.08390",
        },
        {
          id: "vuong-grasp-anything-2023",
          title:
            "Grasp-Anything: Large-scale Grasp Dataset from Foundation Models",
          authors: "Vuong et al.",
          venue: "ICRA 2024",
          year: 2023,
          url: "https://arxiv.org/abs/2309.09818",
        },
        {
          id: "fang-graspnet-2020",
          title:
            "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
          authors: "Fang et al.",
          venue: "CVPR 2020",
          year: 2020,
          url: "https://arxiv.org/abs/1912.13470",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "How many grasp attempts are needed to train a reliable grasp planner?",
      answer:
        "For a single-category grasp planner, 1,000-5,000 labeled attempts typically suffice. For a generalizable planner across 100+ categories, 50,000-500,000 attempts are recommended. Dex-Net 2.0 used 6.7 million synthetic grasps; Google's real-world study used 800,000 attempts across 14 robots. AnyGrasp trained on 1.2 billion synthetic grasps and 10K real grasps to achieve 95%+ success. Start with 10,000 real attempts and scale based on performance on held-out object categories — the marginal value of additional data is highest for your hardest failure categories.",
    },
    {
      question: "Should grasp data include failed attempts?",
      answer:
        "Yes. Failed grasps are essential training signal. A 60-70% success rate in the raw data is ideal — too high means insufficient exploration of the grasp space; too low indicates collection issues. The failure modes (slip, collision, missed approach, insufficient force, object deformation) should be annotated for curriculum learning and failure-aware planning. Dex-Net 2.0 explicitly trains on negative examples with analytic failure labels. Real failure data is particularly valuable because simulation underrepresents failure modes involving deformable objects, fragile items, and surface contamination.",
    },
    {
      question:
        "What is the best representation for grasp annotations?",
      answer:
        "6-DoF SE(3) pose of the end effector at grasp initiation is the standard for modern grasp planners. This includes 3D position (x, y, z) and orientation (quaternion or rotation matrix), plus gripper width for parallel-jaw grippers. For 2D methods, grasp rectangles with angle and width suffice but are being phased out. Contact-GraspNet, AnyGrasp, and GraspNet-1Billion all use SE(3) poses with additional quality scores. Include the approach direction vector (the last 5-10 cm of pre-grasp trajectory) for collision-aware planning in cluttered scenes.",
    },
    {
      question:
        "Do I need real-world data or can I use only simulation?",
      answer:
        "Simulation excels at generating volume (millions of attempts) but has systematic biases in contact physics, particularly for deformable, transparent, and thin objects. The recommended pipeline is simulation pretraining on 1-5M synthetic grasps, then fine-tuning on 10,000-50,000 real-world attempts. This hybrid approach consistently outperforms either source alone by 10-15% on novel objects. For production deployment in warehouse or manufacturing, real data is non-negotiable for achieving the 99%+ reliability rates required for economic viability.",
    },
    {
      question:
        "How should grasping data handle cluttered scenes?",
      answer:
        "Clutter density should be controlled and annotated as a dataset variable. Collect across three density levels: sparse (1-3 objects, wide spacing), moderate (5-10 objects, some overlap), and dense (10-25 objects, significant occlusion). Each level presents different challenges: sparse tests grasp accuracy, moderate tests collision avoidance, and dense tests perception through occlusion. Annotate per-scene clutter metrics (object count, overlap percentage, accessible surface area) to enable difficulty-aware training. Real-world clutter also introduces surface-to-surface friction that affects grasp stability in ways simulation underestimates.",
    },
    {
      question:
        "What objects are hardest for robot grasping and what data helps?",
      answer:
        "Five categories consistently cause the highest failure rates: transparent objects (corrupted depth readings), deformable objects (shape changes under grasp force), thin flat objects (cards, sheets — insufficient grasp surface), reflective objects (spurious point cloud artifacts), and very small objects (under 2 cm — precision requirements exceed standard gripper tolerance). Each category needs dedicated collection campaigns with category-specific sensing: polarized lighting for transparent objects, tactile sensing for deformable objects, and high-resolution cameras for small objects. Allocate 1,000-3,000 attempts per hard category.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Grasping Data",
  ctaDescription:
    "Tell us your object categories, end effector type, and deployment environment. We will build a grasping dataset matched to your specific reliability requirements.",
  relatedGlossaryTerms: [
    "grasping-dataset",
    "6-dof-grasp-planning",
    "point-cloud",
    "depth-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-grasping-dataset",
    "how-to-preprocess-point-clouds-for-training",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D + point clouds + force/torque + gripper state",
    volumeRange: "10K-1M grasp attempts across 100+ object categories",
    temporalResolution: "30 Hz video, 100 Hz force/torque, binary grasp outcome",
    keyAnnotations: [
      "6-DoF grasp pose (SE(3) + gripper width)",
      "Grasp success/failure with failure mode",
      "Object category and instance ID",
      "Grasp type classification (power, pinch, lateral, suction)",
      "Antipodal quality score",
      "Scene clutter density and occlusion metrics",
    ],
  },
  relevantModels: [
    "Contact-GraspNet",
    "AnyGrasp",
    "GQ-CNN / Dex-Net",
    "GraspNet-1Billion",
    "Grasp-Anything",
    "VGN",
  ],
  environmentTypes: [
    "Bin picking station",
    "Tabletop",
    "Conveyor belt",
    "Shelf picking",
    "Cluttered workspace",
    "Manufacturing kitting station",
  ],
  keyPapers: [
    {
      id: "mahler-dexnet-2017",
      title:
        "Dex-Net 2.0: Deep Learning to Plan Robust Grasps with Synthetic Point Clouds and Analytic Grasp Metrics",
      authors: "Mahler et al.",
      venue: "RSS 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1703.09312",
    },
    {
      id: "sundermeyer-contact-2021",
      title:
        "Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes",
      authors: "Sundermeyer et al.",
      venue: "ICRA 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2103.14127",
    },
    {
      id: "levine-grasping-2018",
      title:
        "Learning Hand-Eye Coordination for Robotic Grasping with Deep Learning and Large-Scale Data Collection",
      authors: "Levine et al.",
      venue: "IJRR 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1603.02199",
    },
    {
      id: "fang-anygrasp-2023",
      title:
        "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      authors: "Fang et al.",
      venue: "IEEE T-RO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.08390",
    },
    {
      id: "fang-graspnet-2020",
      title:
        "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.13470",
    },
  ],
  claruRelevance:
    "Claru maintains standardized grasping data collection stations optimized for parallel-jaw, suction, and multi-fingered end effectors. Each station features calibrated overhead and eye-in-hand RGB-D cameras, automated reset mechanisms for high-throughput collection, and standardized object libraries spanning 200+ categories. Our semi-automated pipeline achieves 500-2,000 labeled grasp attempts per station per day with automated lift-and-hold success scoring and human validation for edge cases. Our catalog includes 50,000+ annotated grasp attempts with full 6-DoF pose labels, point cloud data, and grasp quality scores. Custom collections target specific object distributions, clutter conditions, and end effector types with delivery in formats compatible with Contact-GraspNet, AnyGrasp, GQ-CNN, and custom architectures. For the hardest categories — transparent, deformable, and reflective objects — we provide dedicated collection campaigns with specialized sensing and material-specific annotation protocols.",
};

export default data;
