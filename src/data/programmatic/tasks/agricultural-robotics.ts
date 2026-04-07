import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "agricultural-robotics",
  metaTitle: "Agricultural Robotics Training Data | Claru",
  metaDescription: "Training data for agricultural robots: crop picking, weeding, pruning, soil analysis. Outdoor field recordings with GPS, multispectral imaging, and manipulation data.",
  primaryKeyword: "agricultural robotics training data",
  secondaryKeywords: ["farm robot dataset", "crop picking data", "agricultural manipulation", "precision agriculture dataset"],
  canonicalPath: "/training-data/agricultural-robotics",
  h1: "Agricultural Robotics Training Data",
  heroSubtitle: "Field-collected datasets for agricultural robotics — fruit harvesting, precision weeding, crop monitoring, pruning, and soil manipulation with GPS-tagged recordings, multispectral imaging, and seasonal variation coverage.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Agricultural Robotics", href: "/training-data/agricultural-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Agricultural Robotics and Why Does It Need Specialized Training Data?",
      paragraphs: [
        "Agricultural robotics encompasses autonomous systems that perform farming tasks including harvesting, weeding, pruning, spraying, planting, and crop monitoring. The sector is driven by a structural labor crisis: farm labor costs have risen 20% over the past decade in the US and EU, seasonal worker availability has dropped sharply due to immigration policy changes, and the average age of farmers exceeds 57 in most developed nations. Companies like Agrobot (strawberry harvesting), Carbon Robotics (laser weeding), Abundant Robotics (apple picking), and SAGA Robotics (UV-C treatment) have raised hundreds of millions in venture capital to address this gap.",
        "The data challenge in agricultural robotics is dominated by environmental variability. Unlike factory floors or warehouses, agricultural environments change continuously: plants grow and change shape daily, lighting shifts with sun angle and cloud cover, soil moisture affects terrain traversal, and the appearance of crops changes dramatically across growth stages. A strawberry at 30% ripeness looks entirely different from one at 90% ripeness, and the grasping strategy differs accordingly. A weeding robot must distinguish crop seedlings from weed seedlings that may differ by only a few millimeters in leaf shape at early growth stages. This variability means that datasets collected in one week may be partially obsolete by the next, and data from one growing season may not transfer well to the next due to different cultivar selections, planting densities, or weather patterns.",
        "The modality requirements are also distinct from indoor robotics. Multispectral imaging (capturing near-infrared, red edge, and visible bands) reveals plant health information invisible to RGB cameras — NDVI (Normalized Difference Vegetation Index) computed from NIR and red bands indicates chlorophyll content and can distinguish stressed plants from healthy ones. GPS-RTK positioning with centimeter accuracy is essential for row-following navigation and for building field maps that persist across visits. Force sensing is needed for harvesting tasks where the robot must detach fruit without damaging the plant or the produce — a ripe tomato requires 1-3 N of pull force, while an unripe one resists at 5-10 N, and exceeding the damage threshold bruises the fruit and reduces shelf life.",
      ],
    },
    {
      type: "stats",
      heading: "Agricultural Robotics Data at a Glance",
      stats: [
        { value: "5K-50K", label: "Field recordings per crop type" },
        { value: "20%", label: "Farm labor cost increase (decade)" },
        { value: "3-5", label: "Growth stages requiring separate data" },
        { value: "$8.6B", label: "Ag-robot market by 2028 (est.)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Agricultural Task",
      description: "Each agricultural robotics subtask has distinct sensor needs, seasonal timing, and annotation requirements.",
      columns: ["Task", "Data Volume", "Key Modalities", "Critical Challenge", "Seasonal Window"],
      rows: [
        { "Task": "Fruit harvesting", "Data Volume": "5K-20K per crop", "Key Modalities": "RGB-D + F/T + proprioception", "Critical Challenge": "Ripeness estimation + gentle detach", "Seasonal Window": "2-8 weeks (harvest season)" },
        { "Task": "Precision weeding", "Data Volume": "10K-50K images", "Key Modalities": "RGB + multispectral + GPS-RTK", "Critical Challenge": "Crop vs weed at seedling stage", "Seasonal Window": "4-12 weeks (early growth)" },
        { "Task": "Pruning", "Data Volume": "2K-10K clips", "Key Modalities": "RGB-D + F/T + branch detection", "Critical Challenge": "Identifying correct cut points", "Seasonal Window": "Winter dormancy (trees)" },
        { "Task": "Autonomous spraying", "Data Volume": "5K-20K passes", "Key Modalities": "RGB + multispectral + GPS + flow rate", "Critical Challenge": "Precise targeting without drift", "Seasonal Window": "Multiple (pest-dependent)" },
        { "Task": "Soil sampling/planting", "Data Volume": "1K-5K operations", "Key Modalities": "RGB + GPS-RTK + depth + soil sensors", "Critical Challenge": "Terrain adaptation + depth control", "Seasonal Window": "Pre-season (2-4 weeks)" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Agricultural Robot Learning",
      paragraphs: [
        "Harvesting robots represent the most commercially advanced category. Agrobot's strawberry harvester uses machine vision to locate ripe berries, estimate stem attachment points, and execute a twist-and-pull motion through a custom end-effector with 24 picking arms operating in parallel. Their system requires per-cultivar training data because berry size, cluster density, and stem rigidity vary by variety. Abundant Robotics (now acquired by Wärtsilä) built an apple-picking system using vacuum suction that achieved 1 apple per second pick rates, but required extensive training data on apple detection under varying canopy occlusion. The FFRobotics multi-arm harvester demonstrated kiwifruit and apple picking with 3-finger grippers, publishing success rates of 85% on exposed fruit but dropping to 50% when fruit was partially hidden by leaves — a direct consequence of insufficient occlusion training data.",
        "Weeding is the second major application area. Carbon Robotics deploys the LaserWeeder, a tractor-towed system using computer vision to distinguish crop from weed and firing 150 W CO2 lasers at weed centers with millimeter precision. Their system processes 100,000+ plants per hour and requires massive labeled image datasets — typically 50,000-200,000 annotated images per crop-weed combination covering multiple growth stages. The training data must include dawn, midday, and dusk lighting (weeds look different under each), wet and dry soil conditions (water droplets on leaves change appearance), and all growth stages from cotyledon to mature plant. Blue River Technology (acquired by John Deere for $305M) uses a similar see-and-spray approach with herbicide microdosing rather than lasers.",
        "Navigation and field mapping represent the foundation layer. Autonomous tractors from companies like Monarch Tractor, Bear Flag Robotics (acquired by John Deere), and Sabanto use GPS-RTK combined with visual odometry and LiDAR for row-following and headland turning. The data requirements for navigation are less about manipulation and more about coverage: thousands of hours of driving data across different field geometries (straight rows, curved rows, terraced hillsides), soil conditions (dry, muddy, frozen), and obstacle types (irrigation equipment, rocks, workers, animals). Crop monitoring drones (DJI Agras, senseFly eBee) generate aerial multispectral imagery for field health mapping, producing datasets that can exceed 1 TB per field per season at survey-grade resolution.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Agricultural Robotics Data",
      paragraphs: [
        "Agricultural data collection is fundamentally seasonal and location-dependent, requiring planning months in advance of the target growth stage. A strawberry harvesting dataset must be collected during a 4-8 week harvest window, and if quality issues are discovered mid-collection, there may not be time to re-collect before the season ends. This makes protocol validation on small pilot collections (50-100 recordings in the first few days of the season) critical — the cost of discovering a sensor calibration error in week 6 of a 8-week season is effectively the loss of the entire dataset.",
        "The sensor stack for field robotics differs from indoor setups. Cameras must be ruggedized against dust, moisture, and temperature extremes (0-45 C operating range for most growing environments). Multispectral cameras (e.g., MicaSense RedEdge-P with 5 bands or Sequoia+ with 4 bands) capture NIR, red edge, green, and red channels alongside RGB, enabling NDVI computation for plant health assessment. GPS-RTK base stations (e.g., Emlid Reach RS3) must be set up within 10 km of the collection site and provide real-time corrections via LoRa or cellular link. For harvesting tasks, a 6-axis force/torque sensor (ATI Mini45 or equivalent) between the arm wrist and end-effector captures the detachment force profile — this is the critical signal for learning gentle harvesting without damaging fruit or plant.",
        "Diversity axes for agricultural data include: growth stage (early vegetative, flowering, fruit set, green fruit, ripening, mature), time of day (dawn, morning, midday, afternoon, dusk — each producing different shadow patterns and color temperature), weather conditions (clear, overcast, after rain with wet leaves), field geometry (row spacing, plant density, trellising system for vine crops), and cultivar variation (different varieties of the same crop differ in size, color, growth habit, and detachment force). Claru's agricultural collection protocol mandates coverage across all these axes using a diversity matrix: for each crop, we define minimum representation requirements per growth stage, lighting condition, and weather state, tracked through a real-time collection dashboard.",
        "Annotation for agricultural datasets requires domain expertise that generic labeling workforces lack. Ripeness must be scored on a crop-specific scale (e.g., strawberry: white, turning, three-quarter, full ripe, overripe), not a generic 1-5 rating. Weed species must be identified by a trained agronomist or from a reference library, not just marked as 'weed.' Disease symptoms must be classified by pathogen type (fungal, bacterial, viral, nutrient deficiency) because the robot's response differs — diseased fruit should be removed to prevent spread, while nutrient-deficient plants need treatment, not removal. Claru employs annotators with agricultural science backgrounds and maintains crop-specific annotation guides with photographic references for each label category.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Benchmarks for Agricultural Robotics",
      columns: ["Dataset", "Year", "Scale", "Task Domain", "Modalities", "Availability"],
      rows: [
        { "Dataset": "CropAndWeed", "Year": "2023", "Scale": "43K images", "Task Domain": "Weed detection", "Modalities": "RGB", "Availability": "Public" },
        { "Dataset": "DeepWeeds", "Year": "2019", "Scale": "17.5K images", "Task Domain": "Weed species ID", "Modalities": "RGB", "Availability": "Public" },
        { "Dataset": "MinneApple", "Year": "2019", "Scale": "1K images", "Task Domain": "Apple detection + counting", "Modalities": "RGB", "Availability": "Public" },
        { "Dataset": "StrawDI", "Year": "2022", "Scale": "3.1K images", "Task Domain": "Strawberry detection", "Modalities": "RGB", "Availability": "Public" },
        { "Dataset": "Phenobench", "Year": "2023", "Scale": "7K images", "Task Domain": "Crop/weed/soil segmentation", "Modalities": "RGB", "Availability": "Public" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "5K-50K+ per crop", "Task Domain": "Full ag-robot pipeline", "Modalities": "RGB-D + multispectral + GPS + F/T", "Availability": "Built to spec" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "sa-weedmap-2018", title: "WeedMap: A Large-Scale Semantic Weed Mapping Framework Using Aerial Multispectral Imaging", authors: "Sa et al.", venue: "Remote Sensing 2018", year: 2018, url: "https://doi.org/10.3390/rs10091423" },
        { id: "hani-minneapple-2020", title: "MinneApple: A Benchmark Dataset for Apple Detection and Segmentation", authors: "Hani et al.", venue: "CVPR Workshop 2020", year: 2020, url: "https://arxiv.org/abs/1909.04942" },
        { id: "olsen-deepweeds-2019", title: "DeepWeeds: A Multiclass Weed Species Image Dataset for Deep Learning", authors: "Olsen et al.", venue: "Scientific Reports 2019", year: 2019, url: "https://doi.org/10.1038/s41598-018-36565-z" },
        { id: "bender-phenobench-2024", title: "PhenoBench: A Large Dataset and Benchmarks for Semantic Image Interpretation in the Agricultural Domain", authors: "Weyler et al.", venue: "IJCV 2024", year: 2024, url: "https://arxiv.org/abs/2306.04557" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many images or recordings are needed for a crop-specific harvesting policy?",
      answer: "For a single-crop harvesting robot using modern perception models (YOLO-based detection + segmentation), 5,000-10,000 annotated images covering all growth stages and lighting conditions provide a strong detection model. For the manipulation policy (learning to pick without damage), 2,000-5,000 teleoperated demonstrations per cultivar are typical, capturing the range of fruit positions (exposed, partially occluded, in-cluster). If using a VLA-style end-to-end policy, combine both into 5,000-20,000 multimodal episodes per crop type. Plan for at least 3 growth stages of collection across the season.",
    },
    {
      question: "How do you handle seasonal constraints in agricultural data collection?",
      answer: "Agricultural data collection is inherently time-bounded by growing seasons. We plan collections 2-3 months before the target window, validate the full sensor and annotation pipeline on early-season pilot data (50-100 samples), and deploy collection teams at scale once the target growth stage begins. For multi-stage coverage (e.g., weeding data from seedling through canopy closure), we schedule recurring collection sessions at 1-2 week intervals throughout the growing period. If a season is missed or insufficient, greenhouse environments with controlled growing conditions can supplement field data for some crops, though field diversity is always preferred.",
    },
    {
      question: "Why is multispectral imaging important for agricultural robot datasets?",
      answer: "Multispectral imaging captures plant health information invisible to standard RGB cameras. The NIR band (800-900 nm) reflects strongly from healthy chlorophyll, enabling NDVI computation that quantifies plant vigor. The red edge band (700-730 nm) is sensitive to early stress before visible symptoms appear. For weeding, multispectral data helps distinguish crop from weed species that appear similar in RGB but differ in spectral reflectance. For disease detection, certain fungal infections alter leaf spectral signatures before visible lesions form. MicaSense RedEdge-P and Sequoia+ are the most common field cameras, providing 5 synchronized spectral bands at 1.2 cm/pixel from drone altitude.",
    },
    {
      question: "Can simulation data supplement real agricultural data?",
      answer: "Simulation is useful for navigation and basic detection pretraining but has severe limitations for agricultural manipulation. Plant geometry, fruit attachment mechanics, and leaf deformation are extremely difficult to simulate realistically. However, tools like Helios (plant simulation) and NVIDIA Isaac Sim with agricultural assets can generate synthetic images for pretraining detection models, reducing the real-data requirement by 30-50% for perception tasks. For manipulation tasks involving contact with plants (harvesting, pruning), real data remains essential because the sim-to-real gap in plant biomechanics is too large for current simulators to bridge.",
    },
    {
      question: "What annotation expertise is required for agricultural robotics datasets?",
      answer: "Agricultural data annotation requires domain knowledge that general-purpose labeling teams lack. Ripeness scoring needs crop-specific scales (e.g., USDA color charts for tomatoes, Brix-correlated stages for grapes). Weed identification requires botanical knowledge to classify at least to genus level. Disease annotation needs plant pathology training to distinguish fungal, bacterial, and nutrient deficiency symptoms. Claru uses annotators with agricultural science backgrounds, maintains crop-specific annotation guides with photographic references, and applies a 25% expert review rate on all agricultural annotations.",
    },
    {
      question: "How do you handle the diversity of agricultural environments across different farms?",
      answer: "Agricultural environments vary dramatically across geography, climate, farming practice, and infrastructure. A strawberry field in California looks nothing like one in Florida — different cultivars, different soil colors, different row spacings, different trellising systems. We address this through multi-site collection: for each crop type, we deploy to at least 3 geographically distinct farms with different growing practices. Each site is characterized by its GPS coordinates, soil type, row geometry (spacing, orientation, raised bed vs. flat), irrigation system (drip, overhead, furrow), and canopy management approach. This site metadata is included in the dataset so downstream models can be evaluated for geographic generalization rather than memorizing a single farm's layout. For greenhouse and vertical farm environments, the controlled conditions produce less visual diversity but require adaptation to artificial lighting spectra (LED grow lights have distinct spectral signatures that affect multispectral imaging) and confined navigation spaces.",
    },
    {
      question: "What robot platforms are commonly used for agricultural data collection?",
      answer: "Agricultural robotics data collection uses three main platform categories. Ground-based mobile platforms like the Clearpath Jackal or Husky with custom tool attachments navigate between crop rows and carry the sensor payload at canopy height. These platforms handle flat-to-moderately-sloped terrain and are suitable for row crops, orchards, and vineyards. Overhead gantry systems span crop rows and provide a stable elevated platform for overhead imaging and top-down manipulation — these are ideal for greenhouse and high-tunnel environments where GPS signals are unavailable. Aerial platforms (DJI Matrice 350 RTK or senseFly eBee with multispectral payloads) capture field-scale imagery for health mapping and yield estimation. For harvesting manipulation tasks, we mount robot arms (Franka, UR5e, or custom lightweight arms) on mobile bases positioned adjacent to the crop, with the arm reaching into the canopy for fruit picking or pruning demonstrations. The choice of platform determines the sensor mounting options, navigation requirements, and data collection throughput.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Agricultural Robotics Data",
  ctaDescription: "Tell us your target crop, task type (harvesting, weeding, monitoring), geographic region, and growing season timeline. We will design a collection plan covering the seasonal windows, cultivar diversity, and environmental conditions your robot needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "point-cloud"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D + multispectral (5-band) + GPS-RTK + force/torque + proprioception",
    volumeRange: "5K-50K field recordings per crop type",
    temporalResolution: "30 Hz video, 10 Hz GPS, 5 Hz multispectral, 100 Hz force sensing",
    keyAnnotations: ["Crop maturity/ripeness classification (crop-specific scale)", "Weed species identification and segmentation", "Fruit detection with picking point coordinates", "Plant health scoring (NDVI-based + visual symptoms)", "Weather and lighting condition metadata"],
  },
  relevantModels: ["YOLO-based crop detection", "Semantic segmentation (crop/weed/soil)", "Harvesting manipulation policies", "GPS-guided navigation", "Multispectral health mapping CNNs"],
  environmentTypes: ["Open field (row crops)", "Greenhouse", "Orchard (tree crops)", "Vineyard", "Indoor vertical farm"],
  keyPapers: [
    { id: "sa-weedmap-2018", title: "WeedMap: A Large-Scale Semantic Weed Mapping Framework Using Aerial Multispectral Imaging", authors: "Sa et al.", venue: "Remote Sensing 2018", year: 2018, url: "https://doi.org/10.3390/rs10091423" },
    { id: "hani-minneapple-2020", title: "MinneApple: A Benchmark Dataset for Apple Detection and Segmentation", authors: "Hani et al.", venue: "CVPR Workshop 2020", year: 2020, url: "https://arxiv.org/abs/1909.04942" },
    { id: "olsen-deepweeds-2019", title: "DeepWeeds: A Multiclass Weed Species Image Dataset for Deep Learning", authors: "Olsen et al.", venue: "Scientific Reports 2019", year: 2019, url: "https://doi.org/10.1038/s41598-018-36565-z" },
    { id: "bender-phenobench-2024", title: "PhenoBench: A Large Dataset and Benchmarks for Semantic Image Interpretation in the Agricultural Domain", authors: "Weyler et al.", venue: "IJCV 2024", year: 2024, url: "https://arxiv.org/abs/2306.04557" },
  ],
  claruRelevance: "Claru collects agricultural robotics data using ruggedized sensor rigs equipped with RGB-D cameras, 5-band multispectral cameras (MicaSense RedEdge-P), GPS-RTK receivers with centimeter accuracy, and force/torque sensors for harvesting tasks. Our collection teams deploy to farms during target growth windows, following crop-specific protocols that mandate coverage across growth stages, lighting conditions, and weather states using a real-time diversity dashboard. Annotations are performed by team members with agricultural science training using crop-specific label guides with photographic references. We deliver datasets in RLDS, HDF5, or custom formats with full sensor calibration, GPS field maps, multispectral band data, and stratified splits by growth stage, cultivar, and environmental condition. Typical turnaround is 4-8 weeks aligned to the crop's seasonal window.",
};

export default data;
