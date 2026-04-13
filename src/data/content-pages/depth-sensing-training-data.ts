import type { ContentPageData } from "./types";

const depthSensingTrainingData: ContentPageData = {
  // -- Identity & SEO --
  slug: "depth-sensing-training-data",
  title: "Depth Sensing Training Data: RGB-D and Depth Map Datasets for Robot Perception",
  metaTitle: "Depth Sensing Training Data for Robots | Claru",
  metaDescription:
    "RGB-D and depth map training data for robot perception. Real-world depth datasets for grasp planning, obstacle avoidance, and 3D scene understanding.",
  primaryKeyword: "depth sensing training data",
  secondaryKeywords: [
    "RGB-D dataset",
    "depth map training data",
    "3D point cloud dataset",
    "robot depth perception data",
    "stereo depth training",
    "depth estimation dataset",
  ],
  breadcrumbLabel: "Depth Sensing Training Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Depth perception is the foundation of robot spatial reasoning: grasp planning, obstacle avoidance, and navigation all depend on accurate 3D scene understanding. Yet most depth datasets are captured in controlled indoor environments with commodity sensors, producing models that fail on the reflective surfaces, transparent objects, and outdoor lighting that real deployments demand.",

  // -- Problem Section --
  problem: {
    heading: "Why Does Depth Perception Remain a Bottleneck for Robot Deployment?",
    sections: [
      {
        heading: "Why Does Depth Perception Remain a Bottleneck for Robot Deployment?",
        content:
          "Modern robot manipulation and navigation systems depend on depth sensing for spatial reasoning, yet depth estimation models trained on existing datasets exhibit systematic failure modes in real deployments. Depth Anything V2 achieved state-of-the-art monocular depth estimation by training on large-scale synthetic data combined with real-world images, demonstrating that scale and diversity in training data are the primary drivers of depth model quality. However, the authors noted that performance degrades significantly on scenes with transparent objects, specular surfaces, and thin structures that are underrepresented in training data. For robot manipulation, these are not edge cases: warehouse inventory includes transparent bottles, reflective packaging, and thin-walled containers. UniDepth introduced a self-supervised framework for universal monocular depth estimation that generalizes across camera intrinsics, but acknowledged that accuracy depends on the diversity of real-world scenes in the training set.",
        citationIds: ["depth-anything-v2-2024", "unidepth-2024"],
      },
      {
        heading: "What Gaps Exist in Current Depth Datasets for Robotics?",
        content:
          "Existing depth datasets fall into two categories with distinct limitations. Synthetic datasets like Hypersim and Virtual KITTI provide perfect ground-truth depth but exhibit sim-to-real gaps in material properties, lighting, and sensor noise. Real-world datasets like ScanNet and NYU Depth V2 capture actual indoor scenes but are limited in scale, environment diversity, and sensor quality. ScanNet provides RGB-D scans of 1,513 indoor rooms, making it the largest real-world indoor depth dataset, but all scenes use a single sensor type in residential and office environments. GraspNet-1Billion pairs depth data with grasp annotations across 88 objects but in controlled tabletop setups with uniform lighting. Neither category provides the combination of real-world capture, diverse environments, and task-specific annotations that robot depth perception requires for reliable deployment.",
        citationIds: ["scannet-2017", "graspnet-2020"],
      },
      {
        heading: "How Do Sensor-Specific Artifacts Limit Depth Data Utility?",
        content:
          "Different depth sensors produce different artifacts: structured-light sensors fail on reflective and dark surfaces, time-of-flight sensors suffer from multi-path interference, and stereo cameras lose accuracy at range and in textureless regions. Depth Anything V2 showed that training on diverse sensor data improves model robustness to sensor-specific noise, but existing datasets predominantly use a single sensor type. A depth model trained on Kinect data from NYU Depth V2 will exhibit systematic errors when deployed with a RealSense camera or stereo pair on a robot. For robot applications where depth accuracy directly determines grasp success or collision avoidance reliability, sensor-specific training data that matches the deployment sensor configuration is essential.",
        citationIds: ["depth-anything-v2-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Depth Datasets Compare to Custom Collection?",
    description:
      "The table below compares major depth sensing datasets against Claru custom collection. Key gaps in open data include environment diversity, sensor variety, and pairing with task-specific annotations for robot applications.",
    datasets: [
      {
        name: "NYU Depth V2",
        scale: "1,449 labeled RGB-D frames, 464 scenes",
        tasks: "Indoor scene understanding, depth estimation",
        environments: "Indoor residential and office environments",
        limitations:
          "Small scale; single Kinect sensor; limited scene diversity; no robot-task annotations",
        isClaru: false,
      },
      {
        name: "ScanNet",
        scale: "2.5M RGB-D frames, 1,513 rooms, 21K objects",
        tasks: "3D scene understanding, semantic segmentation, depth completion",
        environments: "Indoor rooms; residential and office",
        limitations:
          "Single sensor type; indoor-only; no outdoor or industrial environments; no manipulation annotations",
        isClaru: false,
      },
      {
        name: "Depth Anything V2 Training Mix",
        scale: "62M synthetic + real images",
        tasks: "Monocular depth estimation",
        environments: "Diverse web-scale scenes; synthetic and real",
        limitations:
          "No robot-specific annotations; no paired action data; depth as auxiliary task not primary; no sensor-specific calibration",
        isClaru: false,
      },
      {
        name: "GraspNet-1Billion (Depth)",
        scale: "256 RGB-D scenes, 88 objects",
        tasks: "6-DoF grasp detection with depth data",
        environments: "Lab tabletop with controlled lighting",
        limitations:
          "88 objects only; controlled conditions; no reflective, transparent, or deformable objects",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips with depth enrichment, configurable sensor configurations",
        tasks: "Configurable: depth-paired manipulation, navigation, grasp planning, obstacle detection in real deployment environments",
        environments: "Real warehouses, homes, workplaces, outdoor; diverse lighting and surface conditions",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Depth Sensing Training Data?",
    sections: [
      {
        heading: "How Does Real-World Depth Capture Address the Synthetic Data Gap?",
        content:
          "Depth Anything V2 demonstrated that combining synthetic and real-world data produces the best depth models, but the real-world component remains the quality bottleneck. Claru's data collection captures visual data in the real environments where robots will be deployed, providing the sensor-realistic depth training signal that synthetic pipelines cannot reproduce. The egocentric video pipeline delivers 4K video at 60fps from real workplaces and homes using standard smartphones equipped with LiDAR sensors (iPhone Pro, iPad Pro), producing paired RGB-D data with depth maps that reflect actual sensor noise characteristics. This data captures the depth-challenging conditions that matter for robot deployment: reflective surfaces in kitchens, transparent containers in warehouses, cluttered shelves with thin objects, and outdoor scenes with high dynamic range lighting. The automated validation pipeline ensures resolution, depth range, and metadata completeness for every capture.",
        citationIds: ["depth-anything-v2-2024"],
      },
      {
        heading: "How Does AI-Enriched Depth Data Scale Beyond Hardware Sensors?",
        content:
          "Not all deployment scenarios require hardware depth sensors during data collection. Claru's enrichment pipeline applies state-of-the-art monocular depth estimation models to existing RGB video, producing dense depth maps from the 386,000+ egocentric video clips already in the collection base. UniDepth's camera-agnostic framework enables depth estimation across the diverse camera configurations used by Claru's contributor network. The enrichment pipeline combines multiple depth estimation models (Depth Anything, UniDepth, metric depth estimators) to produce consensus depth maps with uncertainty estimates, identifying regions where models disagree as candidates for additional sensor-based collection. This hybrid approach — hardware depth where available, AI-enriched depth where not — maximizes the volume and diversity of depth training data available for each engagement.",
        citationIds: ["unidepth-2024"],
      },
      {
        heading: "How Does Task-Paired Depth Data Enable Robot-Specific Perception?",
        content:
          "Generic depth datasets train generic depth models. Robot applications require depth data paired with task-specific annotations: grasp points for manipulation, traversability labels for navigation, clearance measurements for obstacle avoidance. GraspNet-1Billion pairs depth with grasp annotations but across only 88 objects in controlled conditions. Claru pairs depth data with the structured activity taxonomy used across all collection programs, adding task-relevant annotations to every depth frame: object boundaries for segmentation, contact surface labels for grasp planning, spatial relationship annotations for scene understanding, and obstacle proximity labels for navigation. The annotation pipeline was demonstrated across 10 workplace categories with same-day human QA review, ensuring that depth-paired annotations meet the precision requirements of downstream robot perception models.",
        citationIds: ["graspnet-2020", "scannet-2017"],
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
      question: "What types of depth data does Claru provide for robot training?",
      answer:
        "Claru provides three categories of depth data: hardware-captured RGB-D using LiDAR-equipped devices (iPhone Pro, iPad Pro, RealSense), AI-enriched depth maps generated from monocular RGB video using state-of-the-art depth estimation models, and hybrid datasets combining both sources with uncertainty estimates. All depth data is paired with task-specific annotations for robot applications.",
    },
    {
      question: "Can Claru capture depth data that matches my robot's sensor configuration?",
      answer:
        "Yes. Claru configures depth capture to match the sensor type, resolution, and field of view of the target robot platform. For deployments using RealSense, ZED, or custom stereo rigs, collection protocols are designed to produce depth data with sensor-matched noise characteristics and range profiles. Output formats match the point cloud or depth map representations your perception pipeline expects.",
    },
    {
      question: "How does Claru handle depth-challenging conditions like transparent and reflective objects?",
      answer:
        "Claru explicitly targets the depth failure modes that matter for robot deployment. Collection protocols include scenes with transparent containers, reflective packaging, specular metal surfaces, and thin structures. Multi-model depth estimation with uncertainty quantification identifies regions where depth is unreliable, enabling perception models to learn where to trust or distrust depth readings in production.",
    },
    {
      question: "What is the accuracy of AI-enriched depth maps compared to hardware sensors?",
      answer:
        "State-of-the-art monocular depth estimation models like Depth Anything V2 achieve sub-5% relative error on standard benchmarks. For robot applications requiring metric accuracy (e.g., grasp planning), Claru combines AI depth with sparse hardware depth measurements for calibration and validates enriched depth maps against ground-truth sensor data where available. The enrichment pipeline includes per-pixel confidence scores that perception models can use to weight depth reliability.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "depth-anything-v2-2024",
      title:
        "Depth Anything V2",
      authors: "Yang et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414",
      keyClaim:
        "State-of-the-art monocular depth estimation trained on large-scale synthetic and real data; demonstrated that scale and diversity drive depth model quality but noted degradation on transparent and specular surfaces.",
    },
    {
      id: "unidepth-2024",
      title:
        "UniDepth: Universal Monocular Metric Depth Estimation",
      authors: "Piccinelli et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2403.18913",
      keyClaim:
        "Self-supervised metric depth estimation that generalizes across camera intrinsics without fine-tuning; accuracy depends on training data scene diversity.",
    },
    {
      id: "scannet-2017",
      title:
        "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes",
      authors: "Dai et al.",
      venue: "CVPR 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1702.04405",
      keyClaim:
        "2.5M RGB-D frames across 1,513 indoor rooms establishing the largest annotated real-world indoor depth benchmark; limited to single sensor type and indoor environments.",
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
        "Paired depth data with 1 billion grasp annotations across 88 objects; demonstrated value of depth-grasp pairing but limited to controlled tabletop conditions.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/depth-estimation",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "grasping-dataset-commercial",
    "sim-to-real-data",
    "manipulation-trajectory-data",
  ],
};

export default depthSensingTrainingData;
