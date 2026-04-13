import type { ContentPageData } from "./types";

const graspingDatasetCommercial: ContentPageData = {
  // -- Identity & SEO --
  slug: "grasping-dataset-commercial",
  title: "Commercial Grasping Datasets: From Lab Benchmarks to Production Pick Rates",
  metaTitle: "Commercial Grasping Datasets for Robots | Claru",
  metaDescription:
    "Production-grade grasping datasets for pick-and-place, bin picking, and depalletizing. Real-world object variety, grasp annotations, and failure-mode coverage.",
  primaryKeyword: "grasping dataset",
  secondaryKeywords: [
    "robot grasping data",
    "grasp detection dataset",
    "bin picking training data",
    "pick and place dataset",
    "robotic grasping annotations",
    "commercial grasping data",
  ],
  breadcrumbLabel: "Grasping Datasets",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Production grasping systems fail not because of algorithm limitations but because training data does not reflect the object diversity, clutter density, and lighting variability of real warehouse and manufacturing floors. Public grasping benchmarks use curated object sets in controlled conditions, producing models that achieve 95%+ in the lab and 70% on the line.",

  // -- Problem Section --
  problem: {
    heading: "Why Do Lab-Trained Grasping Models Fail in Production?",
    sections: [
      {
        heading: "Why Do Lab-Trained Grasping Models Fail in Production?",
        content:
          "Robot grasping has been studied for decades, yet deploying reliable grasping in unstructured commercial environments remains an open problem. AnyGrasp demonstrated a generalizable 6-DoF grasp detection framework that transfers across grippers and objects, achieving strong results on benchmark datasets. However, the authors acknowledged that performance degrades significantly on objects with novel materials, transparent surfaces, and extreme aspect ratios not represented in training data. The Dex-Net project produced a series of increasingly sophisticated grasping planners trained on large synthetic datasets, with Dex-Net 4.0 achieving 95% grasp success on known objects. Yet the sim-to-real gap remains: synthetic training data cannot capture the material properties, deformability, and surface textures that determine grasp stability on real commercial products. The pattern across grasping research is consistent: model generalization is bounded by the diversity of objects and conditions in the training set.",
        citationIds: ["anygrasp-2023", "dexnet-2019"],
      },
      {
        heading: "What Makes Commercial Grasping Data Different from Research Benchmarks?",
        content:
          "Research grasping benchmarks like the Cornell Grasping Dataset, Jacquard, and GraspNet-1Billion use curated object sets in controlled lighting with clean backgrounds. Commercial grasping operates under fundamentally different conditions: bins filled with hundreds of mixed SKUs, reflective packaging, deformable bags, transparent bottles, and varying illumination across shifts. UniGraspTransformer showed that training on diverse object geometries with varied gripper configurations improved zero-shot grasping success, but the evaluation was still conducted in controlled environments with rigid objects on clean surfaces. The gap between benchmark conditions and production floors — where objects are stacked, occluded, damaged, or wet — accounts for the 20-30 percentage point drop in pick success rates that commercial deployments consistently report.",
        citationIds: ["unigrasp-2023", "graspnet-2020"],
      },
      {
        heading: "How Does Object Diversity Limit Current Grasping Datasets?",
        content:
          "GraspNet-1Billion provided 1 billion grasp poses across 88 objects, establishing a large-scale benchmark for 6-DoF grasp detection. But 88 objects cannot represent the tens of thousands of SKUs in a typical e-commerce fulfillment center. AnyGrasp addressed this by training on both synthetic and real data with diverse object geometries, yet the real-world component was limited to objects available in research settings. Commercial grasping requires training data spanning product categories that research labs rarely handle: food packaging with variable fill levels, pharmaceutical blister packs, textiles in polybags, cosmetics with irregular shapes, and electronics in anti-static wrap. Each category introduces distinct grasp failure modes that must be represented in training data for production-viable pick rates.",
        citationIds: ["graspnet-2020", "anygrasp-2023"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Grasping Datasets Compare to Commercial-Grade Data?",
    description:
      "The table below compares major open grasping datasets against Claru custom collection. The critical differentiators for commercial deployment are object diversity, environment realism, and coverage of failure-mode conditions.",
    datasets: [
      {
        name: "GraspNet-1Billion",
        scale: "1 billion grasp poses, 88 objects, 190 scenes",
        tasks: "6-DoF grasp detection; parallel-jaw and vacuum grippers",
        environments: "Lab tabletop with controlled lighting and backgrounds",
        limitations:
          "88 objects only; no deformable, transparent, or reflective objects; controlled conditions only",
        isClaru: false,
      },
      {
        name: "Dex-Net (Synthetic)",
        scale: "6.7M point clouds, 1,500+ 3D models",
        tasks: "Parallel-jaw and suction grasp planning",
        environments: "Purely synthetic; simulated physics and rendering",
        limitations:
          "Sim-to-real gap on material properties and deformable objects; no real-world validation data included",
        isClaru: false,
      },
      {
        name: "Cornell Grasping Dataset",
        scale: "885 images, 240 objects, 8,019 grasp rectangles",
        tasks: "2D planar grasp detection",
        environments: "Single lab setup with uniform background",
        limitations:
          "Small scale; 2D grasps only; no clutter or occlusion; single viewpoint",
        isClaru: false,
      },
      {
        name: "OCID-Grasp",
        scale: "1,763 scenes, 31 objects with clutter",
        tasks: "Grasp detection in cluttered scenes with occlusion",
        environments: "Lab tabletop with arranged clutter patterns",
        limitations:
          "Limited object set; staged clutter patterns; no commercial product categories",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "Configurable per engagement; 386K+ base clips, custom object sets",
        tasks: "6-DoF grasp annotation, failure-mode labeling, multi-gripper coverage, production environment capture",
        environments: "Real warehouse floors, production lines, fulfillment centers; actual commercial products and packaging",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Production Grasping Datasets?",
    sections: [
      {
        heading: "How Does Real-Object Capture Close the Sim-to-Real Gap?",
        content:
          "Dex-Net's synthetic training pipeline demonstrated that large-scale grasp data generation is feasible but acknowledged the persistent sim-to-real gap on material properties. Claru addresses this by capturing grasp data on real commercial products in real operational environments. The egocentric video pipeline delivers first-person footage of human grasping across diverse object categories: contributors record natural picking, packing, and sorting activities during actual work operations. This produces training data that inherently captures material-specific grasp strategies — the different hand configurations used for rigid boxes versus deformable bags versus fragile items — without requiring explicit material property simulation. Every clip passes automated validation of resolution, duration, and metadata completeness at upload time, followed by same-day human QA review.",
        citationIds: ["dexnet-2019"],
      },
      {
        heading: "How Does Failure-Mode Coverage Improve Production Pick Rates?",
        content:
          "AnyGrasp achieved strong benchmark results but noted performance degradation on novel materials and extreme geometries. Production grasping systems face failure modes that benchmarks do not test: slipping on wet packaging, crushing deformable items with excessive force, failing to acquire transparent objects that depth sensors misread, and colliding with adjacent items in dense bins. Claru's data collection protocols explicitly target these failure modes. The structured activity taxonomy includes grasp outcome annotations (success, slip, crush, miss, collision) alongside environmental condition labels (lighting, clutter density, surface moisture). This negative-example coverage is critical because production pick rate improvements often come from reducing failure modes rather than improving best-case performance.",
        citationIds: ["anygrasp-2023"],
      },
      {
        heading: "How Does SKU-Specific Data Scale to Commercial Object Variety?",
        content:
          "UniGraspTransformer showed that training across diverse object-gripper combinations improved zero-shot grasping, but the evaluation used a limited set of rigid objects. Commercial fulfillment centers handle thousands of unique SKUs with continuous inventory rotation. Claru's collection network of approximately 500 global contributors can capture grasping data across specific product categories and SKU sets defined by the client. The workplace egocentric program has already demonstrated this capability across 10 workplace categories in multiple countries, producing 4K video at 60fps of real human manipulation of commercial products. For grasping applications, this means training data that reflects the actual product mix, packaging variability, and handling conditions of the target deployment, rather than a curated subset of research-friendly objects.",
        citationIds: ["unigrasp-2023"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question: "What is a commercial grasping dataset and how does it differ from research benchmarks?",
      answer:
        "A commercial grasping dataset is training data collected on real products in real operational environments such as warehouses, fulfillment centers, and production lines. Unlike research benchmarks that use curated rigid objects in controlled lighting, commercial datasets capture the full range of conditions that production grasping systems encounter: deformable packaging, transparent bottles, reflective surfaces, dense clutter, and variable lighting across work shifts.",
    },
    {
      question: "How many objects does Claru's grasping data cover?",
      answer:
        "Object coverage is configured per engagement based on the client's specific SKU mix and deployment environment. Claru's global contributor network can capture grasping data across any product category. Previous data collection programs have covered workplace tools, kitchen implements, commercial products, and consumer goods across 10+ workplace categories in multiple countries.",
    },
    {
      question: "Can Claru provide grasp failure annotations for training robust pick policies?",
      answer:
        "Yes. Claru's annotation taxonomy includes grasp outcome labels covering success, slip, crush, miss, and collision failure modes alongside environmental condition annotations. Failure-mode data is critical for production pick rate improvement because reducing failure cases often provides larger gains than improving best-case performance.",
    },
    {
      question: "What grasp representations does Claru support?",
      answer:
        "Claru configures output formats to match your model's expected input representation. Supported formats include 6-DoF grasp poses, planar grasp rectangles, grasp quality scores, contact point annotations, and force-torque labels when sensor data is available. Annotation schemas are co-developed with the research team through iterative revision cycles.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "anygrasp-2023",
      title:
        "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains",
      authors: "Fang et al.",
      venue: "IEEE T-RO 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.08390",
      keyClaim:
        "Generalizable 6-DoF grasp detection framework transferring across grippers and objects; noted performance degradation on novel materials and transparent surfaces not in training data.",
    },
    {
      id: "dexnet-2019",
      title:
        "Dex-Net 4.0: Learning Ambidextrous Robot Grasping Policies",
      authors: "Mahler et al.",
      venue: "Science Robotics 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1903.08792",
      keyClaim:
        "Large-scale synthetic grasping dataset and planner achieving 95% success on known objects; acknowledged persistent sim-to-real gap on material properties.",
    },
    {
      id: "graspnet-2020",
      title:
        "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping",
      authors: "Fang et al.",
      venue: "CVPR 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1912.11280",
      keyClaim:
        "1 billion grasp poses across 88 objects establishing a large-scale 6-DoF grasp detection benchmark; limited object diversity relative to commercial applications.",
    },
    {
      id: "unigrasp-2023",
      title:
        "UniGraspTransformer: Simplified Policy Distillation for Scalable Dexterous Grasping",
      authors: "Xu et al.",
      venue: "arXiv 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2412.02699",
      keyClaim:
        "Demonstrated that training across diverse object-gripper combinations improved zero-shot grasping success through policy distillation from privileged to vision-based policies.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/grasp-detection",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "manipulation-trajectory-data",
    "warehouse-robotics-data",
    "depth-sensing-training-data",
  ],
};

export default graspingDatasetCommercial;
