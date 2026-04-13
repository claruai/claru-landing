import type { ContentPageData } from "./types";

const warehouseRoboticsData: ContentPageData = {
  // -- Identity & SEO --
  slug: "warehouse-robotics-data",
  title: "Warehouse Robotics Data: Training Data for Picking, Packing, and Palletizing",
  metaTitle: "Warehouse Robotics Training Data | Claru",
  metaDescription:
    "Production training data for warehouse automation. Picking, packing, palletizing, and sortation demonstrations from real fulfillment center environments.",
  primaryKeyword: "warehouse robotics data",
  secondaryKeywords: [
    "warehouse automation training data",
    "pick and pack dataset",
    "palletizing robot data",
    "fulfillment center robot training",
    "logistics robot dataset",
    "order picking training data",
  ],
  breadcrumbLabel: "Warehouse Robotics Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Warehouse automation is the largest commercial deployment market for manipulation robots, yet most training data comes from controlled lab setups that cannot replicate the SKU variety, clutter conditions, and throughput demands of real fulfillment centers. The gap between lab-trained pick rates and production requirements costs operators millions in failed deployments.",

  // -- Problem Section --
  problem: {
    heading: "Why Do Lab-Trained Warehouse Robots Underperform in Production?",
    sections: [
      {
        heading: "Why Do Lab-Trained Warehouse Robots Underperform in Production?",
        content:
          "Warehouse manipulation operates under constraints that research environments rarely model. Production picking systems must handle thousands of unique SKUs with continuous inventory rotation, maintain 99%+ pick success rates to match human performance, and sustain throughput of 600-1,000 picks per hour across multi-hour shifts. AnyGrasp demonstrated a generalizable grasp detection framework achieving strong benchmark results, but acknowledged performance degradation on novel materials, transparent surfaces, and extreme object geometries not present in training data. In production warehouse environments, these edge cases are not edge cases at all: reflective packaging, transparent bottles, deformable bags, and irregularly shaped items represent a substantial fraction of typical e-commerce inventory. The consistent pattern across commercial warehouse robot deployments is a 20-30 percentage point gap between benchmark pick rates and production pick rates, driven primarily by training data that does not represent operational conditions.",
        citationIds: ["anygrasp-2023"],
      },
      {
        heading: "What Makes Warehouse Data Different from Lab Manipulation Data?",
        content:
          "Lab manipulation datasets like DROID capture careful demonstrations of isolated pick-and-place tasks on clean surfaces. Production warehouse environments present compound challenges: bins containing 50+ mixed items in random orientations, conveyor belts moving at fixed speeds requiring real-time grasp planning, variable lighting across warehouse zones and shifts, and packaging that changes with supplier substitutions. Open X-Embodiment aggregated over 1 million trajectories but the data is dominated by single-object tabletop manipulation in research settings. The tasks, object distributions, and environmental conditions are fundamentally different from production warehouse operations where a robot must pick a small cosmetic tube wedged between two heavy boxes in a dimly lit bin while maintaining throughput targets.",
        citationIds: ["droid-2024", "open-x-embodiment-2024"],
      },
      {
        heading: "How Does SKU Diversity Create a Long-Tail Data Problem?",
        content:
          "A typical e-commerce fulfillment center handles 50,000-500,000 unique SKUs. Each SKU has distinct geometry, weight, packaging material, and grasp affordances. GraspNet-1Billion provides 1 billion grasp poses but across only 88 objects, none of which are commercial products in commercial packaging. The long-tail distribution means that common items are well-represented in any training set, but the thousands of infrequent SKUs that collectively represent 20-40% of pick volume are underrepresented or absent. Production pick failures disproportionately cluster on these tail items, and no amount of synthetic data generation from 3D scans can replace the material properties, packaging variability, and damage conditions that only real-world capture provides.",
        citationIds: ["graspnet-2020"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Datasets Compare for Warehouse Robot Training?",
    description:
      "The table below compares datasets relevant to warehouse robotics against Claru custom collection. Production warehouse deployment requires data with commercial product diversity, operational environment conditions, and task coverage beyond isolated pick-and-place.",
    datasets: [
      {
        name: "Open X-Embodiment",
        scale: "1M+ trajectories, 22 robot platforms",
        tasks: "Short-horizon manipulation; primarily single-object pick-and-place",
        environments: "Research labs; controlled tabletop setups",
        limitations:
          "No warehouse environments; no commercial products; single-object tasks only; no throughput-constrained operations",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories, 564 scenes",
        tasks: "Table-top manipulation with Franka robots",
        environments: "13 institutions; lab environments",
        limitations:
          "No logistics or warehouse tasks; fixed-base robot only; no conveyor or bin-picking scenarios",
        isClaru: false,
      },
      {
        name: "GraspNet-1Billion",
        scale: "1 billion grasp poses, 88 objects",
        tasks: "6-DoF grasp detection on curated objects",
        environments: "Lab tabletop with controlled lighting",
        limitations:
          "88 objects only; no commercial packaging; no clutter density variation; controlled conditions",
        isClaru: false,
      },
      {
        name: "Amazon Picking Challenge Data",
        scale: "Limited release; task-specific bins with known objects",
        tasks: "Bin picking of known retail products",
        environments: "Competition setup simulating warehouse shelf",
        limitations:
          "Small object set; known items only; single lighting condition; competition-specific constraints",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, configurable per warehouse",
        tasks: "Configurable: bin picking, conveyor sorting, packing, palletizing, kitting, quality inspection",
        environments: "Real fulfillment centers, distribution hubs, and warehouse floors with production lighting and conditions",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Production Warehouse Training Data?",
    sections: [
      {
        heading: "How Does On-Site Capture in Real Warehouses Close the Data Gap?",
        content:
          "The fundamental problem with lab-collected warehouse data is that labs are not warehouses. Lighting conditions, bin configurations, product distributions, and operational pressures differ in ways that training data must capture for policies to transfer. Claru's collection infrastructure deploys directly into production warehouse environments. The egocentric video pipeline captures first-person footage of human pick-pack-ship operations during actual work shifts, producing data that inherently reflects the real conditions robots will encounter: mixed product bins at varying fill levels, ambient lighting with zone-to-zone variation, damaged packaging, and the rapid decision-making that throughput demands require. Every clip passes automated validation of resolution, duration, and metadata completeness at upload time, followed by same-day human QA review to ensure operational accuracy.",
        citationIds: ["anygrasp-2023"],
      },
      {
        heading: "How Does Task-Complete Coverage Enable End-to-End Warehouse Policies?",
        content:
          "Most open datasets capture isolated grasping without the surrounding task context. Production warehouse operations involve sequences: receive a pick order, navigate to the correct bin location, identify the target item among clutter, execute the grasp, transport to the packing station, place in the correct shipping container, and apply packaging materials. DROID and Open X-Embodiment focus on the grasp execution step in isolation. Claru's structured activity taxonomy captures the full pick-pack-ship workflow with annotations at each task boundary, including decision points (which item to pick next), failure recovery behaviors (re-grasping after a slip), and temporal constraints (maintaining picks-per-hour targets). This task-complete data enables training of end-to-end policies that handle the full operational workflow, not just isolated manipulation primitives.",
        citationIds: ["droid-2024", "open-x-embodiment-2024"],
      },
      {
        heading: "How Does Real Product Diversity Address the Long-Tail Problem?",
        content:
          "GraspNet-1Billion's 88 objects cannot represent the long-tail distribution of a real warehouse inventory. Claru addresses this by capturing grasp demonstrations on the client's actual product catalog. The global contributor network of approximately 500 people can be deployed across fulfillment centers to capture picking operations on the full SKU distribution, including the infrequent tail items where failures concentrate. The annotation pipeline includes product-level metadata (category, packaging type, weight class, fragility rating) alongside grasp-level annotations (approach vector, contact points, grasp outcome) so that policies can learn material-specific and category-specific grasp strategies. Previous collection programs across 10 workplace categories in multiple countries demonstrated this capability for diverse real-world object manipulation at scale.",
        citationIds: ["graspnet-2020"],
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
      question: "What warehouse tasks does Claru's training data cover?",
      answer:
        "Claru covers the full spectrum of warehouse manipulation tasks: bin picking (single and multi-item), conveyor sortation, order packing, palletizing and depalletizing, kitting and assembly, and quality inspection. Task coverage is configured per engagement to match the specific operational workflows of the target deployment.",
    },
    {
      question: "Can Claru capture data in my specific warehouse environment?",
      answer:
        "Yes. Claru deploys data collection directly into production warehouse environments. Contributors use standard smartphones and wearable cameras to capture first-person footage during actual operations, ensuring data reflects real lighting conditions, bin configurations, product distributions, and operational pressures of the target deployment site.",
    },
    {
      question: "How does Claru handle the SKU diversity problem for warehouse training data?",
      answer:
        "Claru captures demonstrations across the client's actual product catalog rather than a curated subset. The annotation pipeline includes product-level metadata (category, packaging type, weight class, fragility) alongside grasp annotations. This ensures training data covers the full SKU distribution, including the long-tail items where production pick failures concentrate.",
    },
    {
      question: "What throughput can Claru's warehouse data collection achieve?",
      answer:
        "Collection throughput scales with the number of deployed contributors and the target warehouse's operational volume. Claru's collection infrastructure has demonstrated rapid scaling to approximately 500 contributors globally. For warehouse engagements, data collection is integrated into existing shift operations to capture production-representative picking speeds and operational patterns without disrupting throughput.",
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
        "Generalizable 6-DoF grasp detection with noted performance degradation on novel materials and transparent surfaces absent from training data.",
    },
    {
      id: "droid-2024",
      title:
        "DROID: A Large-Scale In-the-Wild Robot Manipulation Dataset",
      authors: "Khazatsky et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.12945",
      keyClaim:
        "76,000 robot manipulation trajectories demonstrating value of diverse collection but limited to lab tabletop setups.",
    },
    {
      id: "open-x-embodiment-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Brien et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "1M+ trajectories from 22 platforms but dominated by single-object tabletop manipulation in research settings.",
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
        "1 billion grasp poses across 88 objects; insufficient object diversity for commercial warehouse applications.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/grasp-detection",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "grasping-dataset-commercial",
    "manipulation-trajectory-data",
    "safety-critical-robot-data",
  ],
};

export default warehouseRoboticsData;
