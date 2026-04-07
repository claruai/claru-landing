import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  slug: "egocentric-outdoor-sports",
  metaTitle: "Egocentric Outdoor Sports Video Dataset for AI | Claru",
  metaDescription:
    "First-person outdoor sports video dataset with action and pose annotations for training sports AI, wearable assistants, and embodied systems. 95K+ clips across 20+ sports.",
  primaryKeyword: "egocentric outdoor sports video dataset",
  secondaryKeywords: [
    "first-person sports video data",
    "outdoor activity recognition dataset",
    "sports AI training data",
    "egocentric action recognition",
    "wearable camera sports data",
    "athletic motion dataset",
  ],
  canonicalPath: "/datasets/egocentric-outdoor-sports",
  h1: "Egocentric Outdoor Sports Video Dataset",
  heroSubtitle:
    "First-person video of real outdoor sports activities — cycling, climbing, skiing, running, kayaking — captured with wearable cameras across diverse terrain and weather conditions with dense action and body pose annotations.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Datasets", href: "/datasets" },
    { label: "Egocentric Outdoor Sports", href: "/datasets/egocentric-outdoor-sports" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Outdoor Sports Video Data Matters",
      paragraphs: [
        "Outdoor sports present some of the most demanding visual understanding challenges in computer vision. Rapid motion, extreme lighting variation (direct sunlight, shadows, overcast), weather effects (rain, snow, fog), and diverse terrain create visual conditions that indoor datasets cannot replicate. Models trained only on controlled indoor environments fail catastrophically when deployed in these real-world conditions.",
        "The egocentric viewpoint from wearable cameras captures the athlete's actual perspective — the same perspective that smart glasses, AR headsets, and wearable coaching systems must process. A chest-mounted or head-mounted camera records the dynamic field of view, motion blur from rapid head movements, and the spatial context of the athlete's body relative to terrain, equipment, and other people.",
        "Sports technology companies building wearable AI coaches, activity recognition for fitness tracking, and safety monitoring for extreme sports need training data that reflects the full variability of outdoor conditions. Academic datasets captured in controlled environments lack the terrain diversity, weather variation, and genuine athletic performance that real outdoor sports data provides.",
      ],
    },
    {
      type: "stats",
      heading: "Dataset at a Glance",
      stats: [
        { value: "95K+", label: "Video clips" },
        { value: "650+", label: "Hours recorded" },
        { value: "20+", label: "Sports categories" },
        { value: "10+", label: "Annotation layers" },
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology",
      paragraphs: [
        "Collectors wear GoPro Hero 12 or equivalent action cameras mounted on helmets, chests, or wrist straps while performing genuine outdoor sports activities. Collection covers cycling (road, mountain, gravel), climbing (bouldering, sport, trad), snow sports (skiing, snowboarding, cross-country), water sports (kayaking, surfing, paddleboarding), running (trail, urban), and team field sports. Each session captures authentic athletic performance rather than staged demonstrations.",
        "Geographic diversity ensures coverage of terrain types: alpine trails, desert roads, coastal routes, forest singletrack, urban parks, and indoor-outdoor transitions. Seasonal collection captures summer heat, autumn foliage, winter snow, and spring rain conditions. This environmental diversity is essential for training models robust to the conditions wearable devices actually encounter.",
        "Raw video is captured at 1080p or 4K resolution at 30-60fps depending on the sport's motion characteristics. High-speed sports (downhill skiing, mountain biking) use 60fps to capture fast movements. Each session includes GPS tracks, heart rate data from paired wearables, and metadata describing terrain, weather, and equipment.",
      ],
    },
    {
      type: "cards",
      heading: "Annotation Layers",
      cards: [
        {
          title: "Activity Phase Segments",
          description:
            "Temporal boundaries for activity phases: climbing approach, ascent, rest, descent. Sport-specific taxonomies cover 200+ activities across all included sports.",
          icon: "🏃",
        },
        {
          title: "Body Pose Estimation",
          description:
            "2D and 3D body pose keypoints estimated per frame using state-of-the-art models, with manual correction for occluded joints. Enables biomechanical analysis and motion quality assessment.",
          icon: "🦴",
        },
        {
          title: "Terrain Classification",
          description:
            "Per-frame terrain type labels: paved road, gravel, rock, snow, water, grass, sand. Critical for training models that adapt behavior recommendations to surface conditions.",
          icon: "🏔️",
        },
        {
          title: "Safety Event Markers",
          description:
            "Annotations marking falls, near-misses, equipment issues, and hazardous conditions. Enables training safety monitoring systems for extreme sports applications.",
          icon: "⚠️",
        },
      ],
    },
    {
      type: "comparison-table",
      heading: "Comparison with Public Sports Datasets",
      description: "How Claru's outdoor sports video compares to academic alternatives.",
      columns: ["Dataset", "Clips", "Hours", "Sports", "Annotations"],
      rows: [
        { Dataset: "Ego4D (sports subset)", Clips: "~8K", Hours: "~60", Sports: "~8", Annotations: "Narrations, activities" },
        { Dataset: "Charades-Ego", Clips: "68K", Hours: "68", Sports: "N/A (indoor)", Annotations: "Actions, objects" },
        { Dataset: "EPIC-KITCHENS-100", Clips: "90K", Hours: "100", Sports: "N/A (kitchen)", Annotations: "Actions" },
        { Dataset: "Claru Outdoor Sports", Clips: "95K+", Hours: "650+", Sports: "20+", Annotations: "Activities, pose, terrain, safety, GPS" },
      ],
    },
    {
      type: "prose",
      heading: "Use Cases and Model Training",
      paragraphs: [
        "Wearable AI companies building real-time coaching systems train on this data to recognize activity phases, assess movement quality, and provide contextual feedback. The body pose annotations enable biomechanical analysis models that detect form issues — knee alignment during cycling, body position during climbing — providing the supervision signal for automated coaching systems.",
        "Activity recognition models for fitness platforms use the temporal annotations to build fine-grained activity classifiers that distinguish not just between sports but between phases within each sport. The terrain and weather annotations enable context-aware models that adjust calorie estimates, effort levels, and route recommendations based on environmental conditions.",
        "Safety monitoring systems for extreme sports train on the safety event annotations to detect falls, near-misses, and hazardous conditions in real-time from wearable camera feeds. These models require diverse examples of both normal and dangerous situations across multiple sports to achieve the reliability that safety applications demand.",
      ],
    },
  ],
  faqs: [
    {
      question: "What sports are included in the dataset?",
      answer:
        "The dataset covers 20+ outdoor sports including road cycling, mountain biking, trail running, rock climbing, skiing, snowboarding, kayaking, surfing, hiking, and team field sports. Each sport includes clips from multiple skill levels (beginner to advanced) and diverse geographic locations.",
    },
    {
      question: "What frame rates are available for high-speed sports?",
      answer:
        "Standard collection captures at 30fps for moderate-pace activities. High-speed sports like downhill skiing, mountain biking, and surfing are captured at 60fps to preserve fast motion detail. We can accommodate 120fps collection for specialized biomechanical analysis projects.",
    },
    {
      question: "Is GPS and biometric data included?",
      answer:
        "Yes. Each collection session includes synchronized GPS tracks from the camera or a paired device, plus heart rate data from wearable monitors. This enables training models that correlate visual observations with geographic context and physiological state.",
    },
  ],
  ctaHeading: "Request an Outdoor Sports Sample Pack",
  ctaDescription:
    "Get a curated sample of egocentric outdoor sports video with full annotations for your wearable AI or activity recognition project.",
  relatedGlossaryTerms: ["egocentric-video", "activity-annotation", "temporal-annotation", "pose-estimation"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  datasetProfile: {
    modalities: ["rgb", "imu"],
    totalClips: "95,000+",
    totalHours: "650+",
    annotationLayers: [
      "Activity phase segments",
      "Body pose estimation",
      "Terrain classification",
      "Safety event markers",
      "GPS tracks",
      "Heart rate correlation",
    ],
    formats: ["RLDS", "HDF5", "WebDataset", "MP4+JSON"],
    resolution: "1920x1080",
    fps: "30-60 fps",
  },
  comparisonWithPublic: [
    { name: "Ego4D (sports subset)", clips: "~8K", hours: "~60", modalities: "RGB, IMU", environments: "~8 sports", annotations: "Narrations" },
    { name: "Charades-Ego", clips: "68K", hours: "68", modalities: "RGB", environments: "Indoor only", annotations: "Actions, objects" },
  ],
  useCases: [
    { modelType: "Wearable AI Coaching", description: "Activity phase recognition and movement quality assessment for real-time coaching from wearable cameras.", exampleModels: ["VideoMAE", "InternVideo", "TimeSformer"] },
    { modelType: "Activity Recognition", description: "Fine-grained activity classification for fitness tracking platforms that need to distinguish phases within sports.", exampleModels: ["SlowFast", "Video Swin Transformer"] },
    { modelType: "Safety Monitoring", description: "Fall detection and hazard recognition for extreme sports safety systems deployed on wearable devices.", exampleModels: ["YOLO", "Temporal Action Detection"] },
  ],
  keyPapers: [
    { id: "grauman-ego4d-2022", title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video", authors: "Grauman et al.", venue: "CVPR 2022", year: 2022, url: "https://arxiv.org/abs/2110.07058" },
    { id: "feichtenhofer-slowfast-2019", title: "SlowFast Networks for Video Recognition", authors: "Feichtenhofer et al.", venue: "ICCV 2019", year: 2019, url: "https://arxiv.org/abs/1812.03982" },
    { id: "tong-videomae-2022", title: "VideoMAE: Masked Autoencoders are Data-Efficient Learners for Self-Supervised Video Pre-Training", authors: "Tong et al.", venue: "NeurIPS 2022", year: 2022, url: "https://arxiv.org/abs/2203.12602" },
  ],
  claruRelevance:
    "Claru's global collector network includes athletes and outdoor enthusiasts across 100+ cities who capture authentic sports performance data in real conditions. Unlike studio-captured or simulation-based datasets, Claru's outdoor sports data reflects genuine terrain variation, weather conditions, and athletic skill levels. Every clip receives multi-layer annotation including activity phases, body pose, and terrain classification.",
};

export default data;
