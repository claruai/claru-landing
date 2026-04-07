import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "multi-sensor-warehouse",
  "metaTitle": "Multi-Sensor Warehouse Dataset for Robotics AI | Claru",
  "metaDescription": "Synchronized multi-sensor data from warehouse environments combining RGB, depth, LiDAR, and IMU. 50K+ clips for training warehouse robotics.",
  "primaryKeyword": "multi-sensor warehouse dataset",
  "secondaryKeywords": [
    "multi-sensor warehouse data",
    "multi-sensor warehouse training data",
    "warehouse robot data",
    "warehouse AI training",
    "warehouse automation data",
    "logistics robotics dataset",
    "AMR training data warehouse",
    "fulfillment center robot data"
  ],
  "canonicalPath": "/datasets/multi-sensor-warehouse",
  "h1": "Multi-Sensor Warehouse Dataset",
  "heroSubtitle": "Synchronized RGB, depth, LiDAR, and IMU data from warehouse environments for training autonomous mobile robots and pick-pack-ship automation. 50K+ clips across 25+ warehouse configurations.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Datasets",
      "href": "/datasets"
    },
    {
      "label": "Multi-Sensor Warehouse",
      "href": "/datasets/multi-sensor-warehouse"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "50K+",
          "label": "Video clips"
        },
        {
          "value": "350+",
          "label": "Hours captured"
        },
        {
          "value": "25+ warehouses",
          "label": "Environments"
        },
        {
          "value": "12+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Multi-Sensor Warehouse Data Matters for Robotics",
      "paragraphs": [
        "Warehouse automation is one of the largest and fastest-growing markets for robotics, with companies like Amazon Robotics, Locus Robotics, Fetch (Zebra), and Berkshire Grey deploying hundreds of thousands of robots across fulfillment centers. These systems increasingly rely on multi-sensor fusion -- combining RGB cameras for object recognition, depth sensors for bin picking, LiDAR for navigation and obstacle avoidance, and IMU for odometry -- because no single sensor modality is sufficient for the full range of warehouse tasks.",
        "The warehouse environment presents a unique combination of challenges: long, repetitive aisle structures that confuse visual SLAM; dynamic obstacles (forklifts, pickers, carts) that move unpredictably; varying lighting from skylights, fluorescent bays, and dark rack interiors; and a staggering diversity of product appearances -- from small polybag items to large appliance boxes -- that picking systems must handle. Multi-sensor data is essential because LiDAR provides reliable navigation even in textureless aisles, depth cameras enable precise bin picking, and RGB provides the rich visual features needed for product identification.",
        "Existing warehouse datasets are extremely limited. Academic robotics labs rarely have access to operational fulfillment centers, and the few public datasets (like Fetch Robotics' lab environments) represent simplified, single-aisle setups that miss the scale and complexity of real warehouses. Claru's multi-sensor warehouse dataset captures data from 25+ operational and simulated warehouse configurations ranging from small 3PL facilities to major fulfillment centers, with the full sensor suite that production warehouse robots use.",
        "Research from ICRA 2024 and the Warehouse Robotics workshop at RSS 2023 demonstrates that multi-sensor navigation and picking systems trained on diverse warehouse data achieve 40-55% lower collision rates and 30% higher pick success rates compared to systems trained on single-facility data, because exposure to diverse rack configurations, aisle widths, lighting conditions, and traffic patterns builds generalization that single-environment training cannot achieve."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "The multi-sensor collection rig combines four sensor modalities on a rigid platform mountable to AMR platforms, push carts, or human-carried harnesses. RGB: FLIR Blackfly S (1920x1080, global shutter) for product and scene recognition. Depth: Intel RealSense D455 (848x480 depth, 0.4-6m range) for near-field picking and obstacle detection. LiDAR: Ouster OS1-32 (32-beam, 10Hz, 120m range) for long-range navigation and mapping. IMU: Xsens MTi-630 (9-axis, 400Hz) for odometry and motion compensation. All sensors are hardware-synchronized to a common clock within 2ms.",
        "Collection occurs in operational warehouse environments during active shifts. Collectors -- experienced warehouse operators and AMR technicians -- navigate realistic routes covering picking paths, replenishment flows, receiving dock operations, packing stations, and cross-dock transfers. Sessions last 30-60 minutes and cover complete workflow sequences rather than isolated aisle traversals. The dynamic presence of other workers, forklifts, and carts is captured naturally, providing realistic obstacle avoidance training data.",
        "The dataset spans 25+ warehouse configurations: e-commerce fulfillment centers (pod-based and traditional racking), 3PL multi-client facilities, cold storage and frozen warehouses, retail distribution centers, parcel sorting hubs, micro-fulfillment centers in urban locations, manufacturing staging areas, and raw material warehouses. Rack types include selective pallet racking, carton flow, push-back, drive-in, and goods-to-person pod systems. This configuration diversity is critical because warehouse robots must generalize across facility layouts without per-facility retraining.",
        "Environmental metadata per session includes facility type, racking configuration, aisle width, ceiling height, lighting type and intensity, floor surface (sealed concrete, epoxy, VNA wire), ambient temperature (critical for cold storage environments where sensor performance changes), shift period, and a facility layout map with rack positions. Product diversity information is logged at the zone level -- the approximate SKU density and product size distribution in each area traversed."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's multi-sensor warehouse dataset compares to publicly available alternatives for warehouse robotics.",
      "columns": [
        "Dataset",
        "Clips",
        "Hours",
        "Modalities",
        "Environments",
        "Annotations"
      ],
      "rows": [
        {
          "Dataset": "Warehouse-1M (sim, 2023)",
          "Clips": "~1M images",
          "Hours": "N/A (synthetic)",
          "Modalities": "RGB-D (synthetic)",
          "Environments": "Simulated warehouse",
          "Annotations": "Object detection, segmentation"
        },
        {
          "Dataset": "Fetch Lab Dataset (2019)",
          "Clips": "~2K",
          "Hours": "~5",
          "Modalities": "RGB-D, LiDAR",
          "Environments": "Single lab aisle",
          "Annotations": "Navigation, basic objects"
        },
        {
          "Dataset": "THÖR (TH Ostfalia, 2020)",
          "Clips": "~600",
          "Hours": "~2",
          "Modalities": "LiDAR, RGB",
          "Environments": "Research warehouse",
          "Annotations": "Person tracking, trajectories"
        },
        {
          "Dataset": "Claru Multi-Sensor Warehouse",
          "Clips": "50K+",
          "Hours": "350+",
          "Modalities": "RGB, Depth, LiDAR, IMU",
          "Environments": "25+ real warehouses",
          "Annotations": "Navigation, products, obstacles, racks, zones, picking"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Stage one automated processing generates: LiDAR-based occupancy maps and 3D point cloud accumulations for each traversal, depth-camera obstacle segmentation within the picking zone, RGB-based product detection using DINOv2 features, and IMU-integrated visual-LiDAR odometry for accurate 6-DoF pose trajectories. Automated lane detection identifies aisle boundaries and intersection zones from the LiDAR maps.",
        "Stage two human annotation adds warehouse-specific labels: navigation zone classification (aisle, cross-aisle, receiving dock, packing station, staging area, charging zone), rack and shelf segmentation with occupancy state (empty, partially filled, full), product detection and rough category classification (small item, medium box, large box, pallet, irregular), dynamic obstacle tracking with type classification (person on foot, person on forklift, AMR, cart, pallet jack), picking zone delineation and bin accessibility annotations, and traffic flow indicators (congested, flowing, blocked).",
        "Stage three QA combines geometric verification with domain review. LiDAR-derived occupancy maps are cross-validated against depth camera observations. Navigation annotations are verified for consistency with the LiDAR map topology. Dynamic obstacle tracks are checked for temporal continuity. A warehouse operations specialist reviews a sample of picking zone annotations to ensure they reflect actual product accessibility. Agreement targets: 96%+ on zone classification, 94%+ on obstacle tracking, 95%+ on rack occupancy state.",
        "The complete taxonomy covers 10 navigation zone types, 8 rack/shelf configuration categories, 15+ product size and packaging classes, 8 dynamic obstacle types with trajectory tracking, picking zone accessibility scores, traffic density estimates, and floor condition flags (wet floor, debris, dock plate transitions). This enables training warehouse robots that navigate, perceive products, avoid obstacles, and assess picking accessibility across diverse facility configurations."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Autonomous Navigation in Warehouses",
          "description": "Training AMR navigation systems that handle the unique challenges of warehouse environments: long repetitive aisles, narrow clearances, dynamic obstacles (forklifts, pickers), and complex traffic patterns. Multi-sensor fusion from RGB, LiDAR, and IMU enables navigation that remains reliable where any single sensor would fail."
        },
        {
          "title": "Bin Picking and Order Fulfillment",
          "description": "Training perception and manipulation systems for product identification, grasp planning, and pick execution in cluttered warehouse bins. RGB-D data from real warehouse racks provides the product diversity and visual conditions that simulation cannot fully capture. Example systems: Berkshire Grey, RightHand Robotics, Covariant."
        },
        {
          "title": "Warehouse Digital Twins and Simulation",
          "description": "Building photorealistic 3D models of warehouse environments from multi-sensor scans for simulation training and sim-to-real transfer. LiDAR provides precise geometry while RGB provides visual appearance, enabling construction of simulation environments that closely match real facilities."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "xiao-warehouse-2023",
          "title": "Autonomous Mobile Robot Navigation in Warehouse Environments: A Survey",
          "authors": "Xiao et al.",
          "venue": "IEEE Access 2023",
          "year": 2023,
          "url": "https://doi.org/10.1109/ACCESS.2023.3298573"
        },
        {
          "id": "zeng-bin-picking-2022",
          "title": "Robotic Grasping and Contact-Rich Manipulation: Learning from Humans and Machines",
          "authors": "Zeng et al.",
          "venue": "IJRR 2022",
          "year": 2022,
          "url": "https://arxiv.org/abs/2203.01929"
        },
        {
          "id": "shah-vint-2023",
          "title": "ViNT: A Foundation Model for Visual Navigation",
          "authors": "Shah et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2306.14846"
        },
        {
          "id": "brohan-rt2-2023",
          "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          "authors": "Brohan et al.",
          "venue": "CoRL 2023",
          "year": 2023,
          "url": "https://arxiv.org/abs/2307.15818"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network includes warehouse operators across 25+ facility types, from small 3PL operations to large-scale e-commerce fulfillment centers. Multi-sensor rigs are deployed on active warehouse floors during real operations, capturing the dynamic environment -- worker traffic, forklift movement, product variety, and operational tempo -- that warehouse robots must handle. This operational realism is critical for training navigation and picking systems that work reliably in production deployment.",
        "Custom campaigns can target specific facility types (e-commerce fulfillment, cold storage, micro-fulfillment), racking configurations (selective, flow, pod-based), operational scenarios (peak season vs. steady state), or specific task types (picking path navigation, dock operations, replenishment flows). Turnaround from campaign specification to annotated delivery is typically 4-8 weeks.",
        "Data is delivered with full sensor calibration (camera intrinsics/extrinsics, LiDAR-camera registration, IMU-camera alignment), pre-computed LiDAR maps, and odometry trajectories. All sensor streams are time-synchronized. Format options include RLDS, HDF5, WebDataset, ROS bag (for LiDAR-heavy workflows), and custom schemas."
      ]
    }
  ],
  "faqs": [
    {
      "question": "What warehouse types are covered?",
      "answer": "25+ configurations including e-commerce fulfillment (pod and traditional), 3PL multi-client, cold storage, retail distribution, parcel sorting, micro-fulfillment, manufacturing staging, and raw material warehouses. Racking types span selective, carton flow, push-back, drive-in, and goods-to-person systems."
    },
    {
      "question": "Is the data captured during active warehouse operations?",
      "answer": "Yes. Collection occurs during active shifts with real worker traffic, forklift movement, and product flow. This captures the dynamic obstacle patterns and environmental conditions that warehouse robots encounter in production deployment."
    },
    {
      "question": "What LiDAR sensor is used?",
      "answer": "Ouster OS1-32 (32-beam, 10Hz rotation, 120m range) providing 655K points per second. LiDAR is hardware-synchronized with all other sensors within 2ms. Pre-computed occupancy maps and accumulated point clouds are available with the data."
    },
    {
      "question": "Can I request data from cold storage or frozen environments?",
      "answer": "Yes. Cold storage (0-4 degrees C) and frozen (-20 degrees C) warehouse data is available. These environments present additional challenges: fog from temperature differentials, reduced sensor performance, and workers in bulky PPE that affects obstacle detection. Custom cold storage campaigns can be arranged."
    },
    {
      "question": "Is ROS bag format supported?",
      "answer": "Yes. LiDAR-heavy workflows can receive data in ROS bag format with standard message types for all sensor modalities. RLDS, HDF5, and WebDataset formats are also available for ML training pipelines."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of multi-sensor warehouse data with navigation and product annotations to evaluate for your warehouse robotics project.",
  "relatedGlossaryTerms": [
    "depth-data",
    "rgb-d-data",
    "point-cloud"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "depth",
      "lidar",
      "imu"
    ],
    "totalClips": "50K+",
    "totalHours": "350+",
    "annotationLayers": [
      "Navigation zone classification (10 types)",
      "Rack/shelf segmentation with occupancy state",
      "Product detection and size classification",
      "Dynamic obstacle tracking (8 types + trajectories)",
      "Picking zone accessibility annotations",
      "Traffic density and flow indicators",
      "LiDAR occupancy maps and point clouds",
      "6-DoF pose trajectories (visual-LiDAR-inertial)",
      "Floor condition and transition flags",
      "Aisle and intersection detection",
      "Facility layout maps with rack positions",
      "Environmental conditions metadata"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "ROS bag",
      "MP4+JSON",
      "PCD"
    ],
    "resolution": "1920x1080 RGB / 848x480 depth",
    "fps": "30 fps (cameras) / 10 Hz (LiDAR) / 400 Hz (IMU)"
  },
  "comparisonWithPublic": [
    {
      "name": "Warehouse-1M (synthetic)",
      "clips": "~1M images",
      "hours": "N/A (synthetic)",
      "modalities": "RGB-D (synthetic)",
      "environments": "Simulated warehouse",
      "annotations": "Object detection, segmentation"
    },
    {
      "name": "Fetch Lab Dataset",
      "clips": "~2K",
      "hours": "~5",
      "modalities": "RGB-D, LiDAR",
      "environments": "Single lab aisle",
      "annotations": "Navigation, basic objects"
    },
    {
      "name": "THOR (TH Ostfalia)",
      "clips": "~600",
      "hours": "~2",
      "modalities": "LiDAR, RGB",
      "environments": "Research warehouse",
      "annotations": "Person tracking, trajectories"
    },
    {
      "name": "Claru Multi-Sensor Warehouse",
      "clips": "50K+",
      "hours": "350+",
      "modalities": "RGB, Depth, LiDAR, IMU",
      "environments": "25+ real warehouses",
      "annotations": "Navigation, products, obstacles, racks, zones, picking"
    }
  ],
  "useCases": [
    {
      "modelType": "Autonomous Warehouse Navigation",
      "description": "Training AMR navigation systems that handle repetitive aisles, dynamic obstacles, and complex traffic patterns using multi-sensor fusion.",
      "exampleModels": [
        "ViNT",
        "NoMaD",
        "BADGR",
        "GNM"
      ]
    },
    {
      "modelType": "Bin Picking and Order Fulfillment",
      "description": "Product identification, grasp planning, and pick execution in cluttered warehouse bins using RGB-D perception from real warehouse racks.",
      "exampleModels": [
        "AnyGrasp",
        "Transporter Networks",
        "RT-2",
        "Octo"
      ]
    },
    {
      "modelType": "Warehouse Digital Twins",
      "description": "Building photorealistic 3D models from multi-sensor scans for simulation training and sim-to-real transfer in warehouse environments.",
      "exampleModels": [
        "NeRF",
        "Gaussian Splatting",
        "Instant-NGP",
        "IsaacSim"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "xiao-warehouse-2023",
      "title": "Autonomous Mobile Robot Navigation in Warehouse Environments: A Survey",
      "authors": "Xiao et al.",
      "venue": "IEEE Access 2023",
      "year": 2023,
      "url": "https://doi.org/10.1109/ACCESS.2023.3298573"
    },
    {
      "id": "zeng-bin-picking-2022",
      "title": "Robotic Grasping and Contact-Rich Manipulation: Learning from Humans and Machines",
      "authors": "Zeng et al.",
      "venue": "IJRR 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2203.01929"
    },
    {
      "id": "shah-vint-2023",
      "title": "ViNT: A Foundation Model for Visual Navigation",
      "authors": "Shah et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2306.14846"
    },
    {
      "id": "brohan-rt2-2023",
      "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      "authors": "Brohan et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.15818"
    }
  ],
  "claruRelevance": "Claru captures synchronized RGB, depth, LiDAR, and IMU data from 25+ operational warehouse configurations during active shifts with real worker traffic and product flow. The multi-sensor approach enables training navigation systems, picking robots, and digital twin construction that generalize across facility types, racking configurations, and operational conditions -- addressing the critical data gap between simplified lab setups and production warehouse complexity."
};

export default data;
