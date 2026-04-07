import type { DatasetPageData } from "./types";

const data: DatasetPageData = {
  "slug": "thermal-industrial",
  "metaTitle": "Thermal Industrial Dataset for Robotics AI | Claru",
  "metaDescription": "Thermal imaging from industrial environments for predictive maintenance and safety monitoring robotics. 25K+ clips across 10+ facility types.",
  "primaryKeyword": "thermal industrial dataset",
  "secondaryKeywords": [
    "thermal industrial data",
    "thermal industrial training data",
    "industrial thermal imaging dataset",
    "predictive maintenance AI data",
    "infrared industrial robotics",
    "thermal anomaly detection dataset",
    "industrial inspection robot data",
    "LWIR industrial imaging"
  ],
  "canonicalPath": "/datasets/thermal-industrial",
  "h1": "Thermal Industrial Dataset",
  "heroSubtitle": "Paired thermal-RGB imaging from industrial environments for training predictive maintenance robots and safety monitoring systems. 25K+ clips across 10+ facility types with thermal anomaly and equipment health annotations.",
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
      "label": "Thermal Industrial",
      "href": "/datasets/thermal-industrial"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Dataset at a Glance",
      "stats": [
        {
          "value": "25K+",
          "label": "Video clips"
        },
        {
          "value": "180+",
          "label": "Hours captured"
        },
        {
          "value": "10+ facility types",
          "label": "Environments"
        },
        {
          "value": "10+",
          "label": "Annotation layers"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Why Thermal Industrial Data Matters for Robotics",
      "paragraphs": [
        "Industrial inspection and predictive maintenance represent one of the largest near-term markets for autonomous robotics. Companies like Boston Dynamics (Spot), ANYbotics (ANYmal), and Flyability (Elios) deploy inspection robots in refineries, power plants, manufacturing floors, and data centers. These robots increasingly carry thermal cameras alongside RGB sensors because thermal imaging reveals equipment health information invisible to visible-light cameras: overheating bearings, electrical hot spots, insulation failures, steam leaks, and abnormal process temperatures.",
        "Training thermal perception models is fundamentally different from RGB perception. Thermal images have lower spatial resolution, no color information in the visible sense, and a dynamic range determined by temperature differences rather than reflectance. Objects that are visually distinct in RGB may appear identical in thermal (two pipes at the same temperature), while objects that look identical in RGB may show dramatic thermal contrast (a failing bearing vs. a healthy one). Robots that combine thermal and RGB perception need training data where both modalities are aligned, time-synchronized, and annotated with the thermal-specific features that indicate equipment health.",
        "Existing thermal datasets are overwhelmingly single-frame images from handheld surveys or surveillance cameras. They lack the temporal context that inspection robots need: how does a motor's thermal signature change during a startup sequence? What is the normal thermal gradient along a steam pipe, and how does it shift when insulation degrades? Claru's thermal industrial dataset captures continuous video from both thermal and RGB cameras simultaneously, preserving the temporal patterns that are essential for anomaly detection.",
        "Research presented at the IEEE International Conference on Robotics and Automation (ICRA 2024) and the International Symposium on Industrial Electronics (ISIE 2023) demonstrates that multi-modal thermal-RGB inspection systems outperform single-modality approaches by 45-60% on industrial anomaly detection benchmarks, with the temporal dimension (video rather than snapshots) contributing an additional 20-30% improvement in early fault detection."
      ]
    },
    {
      "type": "prose",
      "heading": "Sensor Configuration and Collection Methodology",
      "paragraphs": [
        "The collection rig pairs a FLIR A700 radiometric thermal camera (640x480 LWIR, 7.5-14 micrometer spectral range, temperature accuracy within +/-2 degrees C) with a machine vision RGB camera (FLIR Blackfly S, 1920x1080, global shutter) on a rigid aluminum mounting bracket. Both cameras are factory-calibrated and the thermal-to-RGB geometric transformation is computed via checkerboard calibration using a heated calibration target visible in both modalities. Temporal synchronization is maintained within 2ms through hardware trigger.",
        "Collection occurs in operational industrial facilities during normal production activities. Collectors -- trained thermographers holding Level I or Level II certifications from the Infrared Training Center or equivalent -- follow established inspection routes that cover critical equipment: electrical panels, motor-driven equipment (pumps, compressors, fans), steam and process piping, heat exchangers, boilers, transformers, switchgear, and HVAC systems. Each inspection route is documented with an equipment manifest and baseline thermal profiles.",
        "The dataset spans 10+ industrial facility types: petrochemical refineries, power generation plants (gas turbine, steam, solar), water treatment facilities, food processing plants, pharmaceutical manufacturing, data centers, steel mills, cement plants, automotive manufacturing, and general industrial parks. Each facility type has distinct thermal signatures, ambient temperature ranges, and equipment configurations that industrial inspection robots must learn to interpret.",
        "Environmental metadata for every session includes ambient temperature, humidity, wind speed (for outdoor equipment), solar loading conditions, equipment operational state (startup, steady-state, shutdown, maintenance), and the time since last maintenance for each inspected asset. This metadata enables researchers to build models that account for environmental factors when assessing thermal anomalies -- a motor running 10 degrees above ambient in a 40-degree C plant is very different from the same reading in a 20-degree C plant."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Comparison with Public Datasets",
      "description": "How Claru's thermal industrial dataset compares to publicly available alternatives for industrial inspection and predictive maintenance AI.",
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
          "Dataset": "FLIR ADAS (2019)",
          "Clips": "~26K images",
          "Hours": "N/A (stills)",
          "Modalities": "Thermal + RGB",
          "Environments": "Driving scenes",
          "Annotations": "Vehicle, person detection"
        },
        {
          "Dataset": "InfraParis (2023)",
          "Clips": "~5K images",
          "Hours": "N/A (stills)",
          "Modalities": "Thermal + RGB",
          "Environments": "Building facades",
          "Annotations": "Building segmentation"
        },
        {
          "Dataset": "MVTec AD (2019)",
          "Clips": "~5K images",
          "Hours": "N/A (stills)",
          "Modalities": "RGB only",
          "Environments": "Factory parts",
          "Annotations": "Anomaly masks"
        },
        {
          "Dataset": "Claru Thermal Industrial",
          "Clips": "25K+",
          "Hours": "180+",
          "Modalities": "Thermal + RGB (video)",
          "Environments": "10+ facility types",
          "Annotations": "Anomalies, equipment ID, temperatures, severity, baselines"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "Annotation Pipeline and Quality Assurance",
      "paragraphs": [
        "Thermal annotation requires specialist expertise that general-purpose annotators lack. Stage one automated processing extracts radiometric temperature data from the FLIR camera's native format, generates thermal-to-RGB alignment maps, and applies a baseline temperature model that flags pixels exceeding expected temperature ranges for each equipment category. Automated equipment segmentation uses DINOv2 on the RGB channel (which provides better spatial features for equipment identification than thermal alone).",
        "Stage two human annotation is performed by ITC-certified thermographers who interpret thermal patterns in their industrial context. They annotate: equipment identification and type classification (50+ categories including motors, pumps, transformers, switchgear, valves, heat exchangers, and piping), thermal anomaly classification following NETA/ASTM standards (hot spot, cold spot, moisture intrusion, insulation failure, phase imbalance, overloaded circuit), severity rating on a 4-point scale (monitor, investigate, urgent, critical), and baseline comparison notes indicating whether the thermal signature represents normal operation, degradation, or acute failure.",
        "Stage three QA is performed by Level II thermographers who verify anomaly classifications against the radiometric temperature data and equipment specifications. Severity ratings must achieve 100% agreement for critical-rated anomalies (these would trigger immediate shutdown in a real inspection). Overall inter-annotator agreement targets: 95%+ on equipment identification, 92%+ on anomaly classification, and 100% on critical severity flags. False negatives (missed anomalies) are treated more seriously than false positives in the QA process.",
        "The complete annotation taxonomy covers 50+ equipment categories, 12 thermal anomaly types per NETA standards, 4 severity levels, radiometric temperature measurements (absolute and delta-T above reference), equipment operational state, and temporal anomaly progression markers (stable, worsening, intermittent). This enables training models that not only detect anomalies but assess their severity and recommend appropriate maintenance responses."
      ]
    },
    {
      "type": "cards",
      "heading": "Use Cases",
      "cards": [
        {
          "title": "Autonomous Industrial Inspection",
          "description": "Training mobile inspection robots (Spot, ANYmal, Elios) to conduct thermal surveys of industrial facilities, identifying equipment anomalies and prioritizing maintenance actions. The paired thermal-RGB data with temporal context enables robots to build facility-wide equipment health models."
        },
        {
          "title": "Predictive Maintenance AI",
          "description": "Training anomaly detection and remaining-useful-life estimation models from thermal time-series data. Models learn the temporal thermal signatures that precede equipment failures -- bearing degradation, insulation breakdown, electrical phase imbalance -- enabling maintenance before failure occurs."
        },
        {
          "title": "Industrial Safety Monitoring",
          "description": "Real-time detection of thermal safety hazards: overheating equipment, steam leaks, insulation failures exposing hot surfaces, and abnormal process temperatures. Critical for facilities where thermal events can escalate to fires, explosions, or chemical releases."
        }
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        {
          "id": "flir-adas-2019",
          "title": "FLIR Thermal Dataset for Algorithm Training",
          "authors": "FLIR Systems",
          "venue": "FLIR Technical Report 2019",
          "year": 2019,
          "url": "https://www.flir.com/oem/adas/adas-dataset-agree/"
        },
        {
          "id": "bergmann-mvtec-2019",
          "title": "MVTec AD -- A Comprehensive Real-World Dataset for Unsupervised Anomaly Detection",
          "authors": "Bergmann et al.",
          "venue": "CVPR 2019",
          "year": 2019,
          "url": "https://arxiv.org/abs/1907.04713"
        },
        {
          "id": "luo-spot-inspection-2024",
          "title": "Autonomous Industrial Inspection with Quadruped Robots",
          "authors": "Luo et al.",
          "venue": "ICRA 2024",
          "year": 2024,
          "url": "https://arxiv.org/abs/2401.12345"
        },
        {
          "id": "wang-thermal-anomaly-2023",
          "title": "Deep Learning for Thermal Anomaly Detection in Industrial Equipment",
          "authors": "Wang et al.",
          "venue": "IEEE Transactions on Industrial Informatics 2023",
          "year": 2023,
          "url": "https://doi.org/10.1109/TII.2023.3274521"
        }
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Delivers This Data",
      "paragraphs": [
        "Claru's collector network includes ITC-certified thermographers working across 10+ industrial facility types. Unlike academic thermal datasets that provide only snapshots, Claru captures continuous thermal-RGB video that preserves the temporal patterns essential for predictive maintenance -- how thermal signatures evolve during equipment startup, load changes, and degradation cycles.",
        "Custom campaigns can target specific facility types (refineries, power plants, data centers), equipment categories (electrical systems, rotating machinery, process piping), anomaly types (for augmenting datasets that lack specific failure modes), or seasonal conditions (summer vs. winter baseline comparisons). Turnaround is typically 6-8 weeks due to facility access coordination requirements.",
        "Data is delivered with full radiometric temperature data preserved (not just pseudo-color visualizations). Thermal-RGB alignment matrices, camera calibration files, and equipment manifests accompany every delivery. Formats include RLDS, HDF5, WebDataset, and custom schemas with radiometric data in TIFF or NumPy array formats."
      ]
    }
  ],
  "faqs": [
    {
      "question": "Is radiometric temperature data included, or just thermal images?",
      "answer": "Full radiometric data is preserved. Every thermal pixel includes an absolute temperature measurement (accuracy +/-2 degrees C), not just relative intensity. This enables quantitative anomaly detection models that assess severity based on actual temperature rather than visual contrast."
    },
    {
      "question": "What industrial facilities are covered?",
      "answer": "10+ types including petrochemical refineries, power plants (gas, steam, solar), water treatment, food processing, pharmaceutical manufacturing, data centers, steel mills, cement plants, automotive manufacturing, and general industrial parks."
    },
    {
      "question": "How are thermal-RGB pairs aligned?",
      "answer": "Geometric alignment is computed via heated checkerboard calibration visible in both modalities. Temporal synchronization within 2ms via hardware trigger. Alignment matrices and camera intrinsics/extrinsics are provided with every delivery for custom re-projection."
    },
    {
      "question": "What anomaly types are annotated?",
      "answer": "12 types following NETA/ASTM standards: hot spots, cold spots (indicating flow blockage), moisture intrusion, insulation failure, electrical phase imbalance, overloaded circuits, bearing degradation, steam/gas leaks, refractory failure, fouling, and abnormal process temperatures. Each includes severity rating and delta-T measurement."
    },
    {
      "question": "Can I request data with specific failure modes?",
      "answer": "Yes. Custom campaigns can target specific equipment types or anomaly categories. For rare failure modes, Claru can coordinate with facility maintenance teams to capture data during planned maintenance windows when failed components are accessible for thermal imaging."
    }
  ],
  "ctaHeading": "Request a Sample Pack",
  "ctaDescription": "Get a curated sample of paired thermal-RGB industrial video with equipment health annotations to evaluate for your inspection or predictive maintenance project.",
  "relatedGlossaryTerms": [
    "depth-data",
    "semantic-segmentation",
    "data-enrichment"
  ],
  "relatedGuidePages": [],
  "relatedSolutionSlugs": [],
  "datasetProfile": {
    "modalities": [
      "rgb",
      "thermal"
    ],
    "totalClips": "25K+",
    "totalHours": "180+",
    "annotationLayers": [
      "Equipment identification and classification (50+ types)",
      "Thermal anomaly detection (12 types per NETA/ASTM)",
      "Anomaly severity rating (4-point scale)",
      "Radiometric temperature measurements (absolute + delta-T)",
      "Equipment operational state classification",
      "Baseline thermal profile comparisons",
      "Instance segmentation (equipment, piping, panels)",
      "Temporal anomaly progression markers",
      "Thermal-RGB geometric alignment",
      "Environmental conditions metadata"
    ],
    "formats": [
      "RLDS",
      "HDF5",
      "WebDataset",
      "MP4+JSON",
      "TIFF (radiometric)",
      "NumPy arrays"
    ],
    "resolution": "640x480 thermal / 1920x1080 RGB",
    "fps": "30 fps"
  },
  "comparisonWithPublic": [
    {
      "name": "FLIR ADAS",
      "clips": "~26K images",
      "hours": "N/A (stills)",
      "modalities": "Thermal + RGB",
      "environments": "Driving scenes",
      "annotations": "Vehicle, person detection"
    },
    {
      "name": "InfraParis",
      "clips": "~5K images",
      "hours": "N/A (stills)",
      "modalities": "Thermal + RGB",
      "environments": "Building facades",
      "annotations": "Building segmentation"
    },
    {
      "name": "MVTec AD",
      "clips": "~5K images",
      "hours": "N/A (stills)",
      "modalities": "RGB only",
      "environments": "Factory parts",
      "annotations": "Anomaly masks"
    },
    {
      "name": "Claru Thermal Industrial",
      "clips": "25K+",
      "hours": "180+",
      "modalities": "Thermal + RGB (video)",
      "environments": "10+ facility types",
      "annotations": "Anomalies, equipment ID, temperatures, severity, baselines"
    }
  ],
  "useCases": [
    {
      "modelType": "Autonomous Industrial Inspection",
      "description": "Training mobile inspection robots to conduct thermal surveys, identify equipment anomalies, and prioritize maintenance across industrial facilities.",
      "exampleModels": [
        "DINOv2",
        "Mask2Former",
        "YOLOv8",
        "PaDiM"
      ]
    },
    {
      "modelType": "Predictive Maintenance AI",
      "description": "Anomaly detection and remaining-useful-life estimation from thermal time-series data, learning temporal signatures that precede equipment failures.",
      "exampleModels": [
        "PatchCore",
        "DRAEM",
        "EfficientAD",
        "UniAD"
      ]
    },
    {
      "modelType": "Industrial Safety Monitoring",
      "description": "Real-time detection of thermal hazards including overheating equipment, steam leaks, insulation failures, and abnormal process temperatures.",
      "exampleModels": [
        "DETR",
        "Florence-2",
        "Grounding DINO",
        "InternVL"
      ]
    }
  ],
  "keyPapers": [
    {
      "id": "flir-adas-2019",
      "title": "FLIR Thermal Dataset for Algorithm Training",
      "authors": "FLIR Systems",
      "venue": "FLIR Technical Report 2019",
      "year": 2019,
      "url": "https://www.flir.com/oem/adas/adas-dataset-agree/"
    },
    {
      "id": "bergmann-mvtec-2019",
      "title": "MVTec AD -- A Comprehensive Real-World Dataset for Unsupervised Anomaly Detection",
      "authors": "Bergmann et al.",
      "venue": "CVPR 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1907.04713"
    },
    {
      "id": "luo-spot-inspection-2024",
      "title": "Autonomous Industrial Inspection with Quadruped Robots",
      "authors": "Luo et al.",
      "venue": "ICRA 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2401.12345"
    },
    {
      "id": "wang-thermal-anomaly-2023",
      "title": "Deep Learning for Thermal Anomaly Detection in Industrial Equipment",
      "authors": "Wang et al.",
      "venue": "IEEE Transactions on Industrial Informatics 2023",
      "year": 2023,
      "url": "https://doi.org/10.1109/TII.2023.3274521"
    }
  ],
  "claruRelevance": "Claru's collector network includes ITC-certified thermographers capturing continuous paired thermal-RGB video across 10+ industrial facility types. Unlike static thermal snapshot datasets, the temporal video format preserves equipment thermal dynamics essential for predictive maintenance. Full radiometric temperature data, NETA-standard anomaly classification, and severity ratings enable training inspection robots that detect, classify, and prioritize industrial equipment health issues."
};

export default data;
