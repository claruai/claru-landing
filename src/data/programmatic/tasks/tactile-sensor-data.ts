import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "tactile-sensor-data",
  metaTitle: "Tactile Sensor Data for Robotics | Claru",
  metaDescription: "Tactile sensor data for robot manipulation: GelSight, DIGIT, and BioTac recordings with contact geometry, force distribution, and slip detection annotations.",
  primaryKeyword: "tactile sensor robotics data",
  secondaryKeywords: ["tactile dataset", "gelsight training data", "robot touch sensing data", "digit sensor dataset", "tactile manipulation data", "contact-rich manipulation dataset"],
  canonicalPath: "/training-data/tactile-sensor-data",
  h1: "Tactile Sensor Training Data",
  heroSubtitle: "High-resolution tactile sensor datasets — GelSight, DIGIT, and BioTac recordings with contact geometry reconstruction, force distribution maps, and slip detection labels for contact-rich manipulation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Tactile Sensor", href: "/training-data/tactile-sensor-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Tactile Sensing Data and Why Is It the Next Frontier for Robot Learning?",
      paragraphs: [
        "Tactile sensors give robots the sense of touch — high-resolution contact information that vision alone cannot provide. When a robot grasps a slippery glass, vision tells it the gripper is closed but tactile sensing reveals whether the glass is about to slip. When inserting a USB connector, vision loses line of sight at the moment of contact but tactile sensing provides sub-millimeter alignment feedback. Vision-based tactile sensors like GelSight (Yuan et al., 2017) and DIGIT (Lambeta et al., 2020) capture contact geometry as images at 30-100 Hz, creating a rich data modality that directly feeds into visual policy architectures.",
        "Tactile data is scarce because the sensors are relatively new and fragile. GelSight sensors use a deformable gel membrane that wears with use (100-500 hours before replacement), DIGIT sensors are manufactured in limited quantities, and BioTac sensors cost $5,000+ each. This makes large-scale tactile data collection expensive and equipment-intensive. The largest public tactile dataset, Touch and Go (Yang et al., 2022), contains 13,000 tactile-visual pairs — tiny compared to the millions of RGB images available for visual manipulation. The scarcity creates a high-value opportunity: any team with substantial tactile data has a significant competitive advantage.",
        "The impact of tactile data on manipulation performance is well-documented. Calandra et al. (2018) showed that adding GelSight tactile input to a grasping policy increased success on novel objects from 82% to 96%. Li et al. (2023) demonstrated that tactile-conditioned insertion policies achieve 95% success on tight-tolerance tasks where vision-only policies plateau at 70%. For in-hand manipulation — rotating, pivoting, and repositioning objects within the gripper — tactile feedback is essential because the object is partially or fully occluded by the hand during manipulation.",
        "The physics of tactile sensing create unique data engineering challenges. Vision-based tactile sensors (GelSight, DIGIT, GelSlim) work by pressing a soft elastomer gel against an object and imaging the resulting deformation through an internal camera. The gel surface is coated with a reflective membrane, and LEDs illuminate the gel from multiple angles so that deformation-induced shading reveals the 3D contact geometry. This optical principle means that tactile image quality depends on gel condition (new gel produces sharper images than worn gel), illumination stability (LED current drift changes the baseline image), and temperature (gel stiffness varies with ambient temperature, altering deformation sensitivity). All of these factors must be tracked and controlled during data collection to ensure consistent tactile signal quality across a large dataset.",
      ],
    },
    {
      type: "stats",
      heading: "Tactile Sensing Data at a Glance",
      stats: [
        { value: "10K-100K", label: "Contact episodes needed" },
        { value: "30-100 Hz", label: "Tactile image capture rate" },
        { value: "82% -> 96%", label: "Grasp success with tactile (Calandra)" },
        { value: "13K", label: "Largest public tactile dataset" },
        { value: "$100-$5K", label: "Cost per sensor (DIGIT to BioTac)" },
        { value: "0.02 mm", label: "GelSight depth resolution" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Tactile Sensor Type",
      description: "Each sensor family produces different data types and has different collection constraints.",
      columns: ["Sensor", "Output", "Resolution", "Frame Rate", "Durability", "Cost per Sensor"],
      rows: [
        { "Sensor": "GelSight Mini", "Output": "Tactile image (RGB)", "Resolution": "320x240", "Frame Rate": "30 Hz", "Durability": "100-500 hrs", "Cost per Sensor": "$300-500" },
        { "Sensor": "DIGIT", "Output": "Tactile image (RGB)", "Resolution": "640x480", "Frame Rate": "60 Hz", "Durability": "200+ hrs", "Cost per Sensor": "$100-200" },
        { "Sensor": "BioTac", "Output": "19 electrodes + pressure", "Resolution": "19 channels", "Frame Rate": "100 Hz", "Durability": "1000+ hrs", "Cost per Sensor": "$5,000+" },
        { "Sensor": "XELA uSkin", "Output": "3-axis tactile array", "Resolution": "4x4 to 16x16", "Frame Rate": "100 Hz", "Durability": "500+ hrs", "Cost per Sensor": "$1,000-3,000" },
        { "Sensor": "GelSlim 3.0", "Output": "Tactile image (RGB)", "Resolution": "320x240", "Frame Rate": "30 Hz", "Durability": "200+ hrs", "Cost per Sensor": "$200-400" },
        { "Sensor": "Soft Bubble", "Output": "Depth image (inflated membrane)", "Resolution": "640x480", "Frame Rate": "30 Hz", "Durability": "300+ hrs", "Cost per Sensor": "$150-300" },
        { "Sensor": "AnySkin", "Output": "Magnetometer array", "Resolution": "5-16 taxels", "Frame Rate": "100 Hz", "Durability": "500+ hrs", "Cost per Sensor": "$50-100" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Tactile-Enabled Robot Learning",
      paragraphs: [
        "Three research directions dominate tactile robot learning. First, tactile-conditioned grasping: Calandra et al. (2018) and subsequent work trains grasp success predictors from (tactile image, grasp outcome) pairs, requiring 10,000+ grasp attempts with synchronized tactile data. The trained predictor enables reactive grasping — adjusting grip force and finger position based on real-time tactile feedback. This approach is the most mature and closest to production deployment. Hogan et al. (2022) extended this work with Tactile-RL, training a closed-loop grasping policy via reinforcement learning with GelSight feedback, achieving 94% grasp success on unseen objects — a 12-percentage-point improvement over open-loop grasping. The key training data insight was that the RL exploration phase generated 50,000+ contact episodes autonomously, but the initial policy needed 2,000 human-supervised grasps to seed the exploration effectively.",
        "Second, tactile-based object recognition and property estimation. Vision-based tactile sensors capture surface texture and geometry at contact, enabling material classification (metal, plastic, fabric, glass), hardness estimation, and surface roughness measurement from a single grasp. Suresh et al. (2022) demonstrated that GelSight-based material classification achieves 95% accuracy across 50 materials from 500 contact samples per material. The Octopi system (Xu et al., 2023) combined tactile and visual data for object recognition, showing that tactile input resolves ambiguities that vision alone cannot — two visually identical objects made of different materials (plastic vs. metal) are trivially distinguished by a single tactile contact. This application requires diverse contact datasets spanning many object-material combinations.",
        "Third, tactile-driven manipulation policies. General In-Hand Manipulation (Qi et al., 2023) trained dexterous in-hand rotation policies using tactile feedback from an Allegro Hand equipped with XELA sensors, achieving 360-degree rotation of diverse objects including balls, cubes, and cylinders. The critical finding was that tactile feedback reduced the variance in rotation trajectories by 60% compared to proprioception-only policies, enabling more consistent and faster manipulation. Touch-GS (Swann et al., 2024) and related work trains manipulation policies that use tactile input for contact-rich tasks: in-hand rotation, slip recovery, and precision insertion. These policies require the richest tactile datasets — not just static contact images but continuous tactile video streams synchronized with robot actions throughout manipulation sequences.",
        "The emerging frontier is foundation models for touch. Taxim (Si & Yuan, 2022) built a simulation framework for GelSight sensors using finite element methods to generate synthetic tactile images from contact geometry. UniTouch (Yang et al., 2024) trained a tactile representation model across multiple sensor types, showing that a single encoder can process GelSight, DIGIT, and GelSlim inputs and produce unified contact representations. These approaches aim to solve the data scarcity problem through simulation and cross-sensor transfer, but real-world tactile data remains essential for calibrating and validating the synthetic models — the gap between simulated and real gel deformation is still 15-25% for complex contact geometries.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Tactile Data",
      paragraphs: [
        "Tactile data collection requires mounting tactile sensors on the robot's fingertips, which constrains the gripper geometry and limits the objects that can be grasped. For GelSight and DIGIT sensors, the gripper must accommodate the sensor's rectangular form factor (typically 20x30 mm sensing area). A standardized object library of 100+ items spanning smooth, rough, soft, hard, slippery, and textured surfaces ensures diverse contact patterns. Each object should be grasped in 5-10 different orientations and positions to sample the contact geometry space. For dexterous hands (Allegro, LEAP), multiple sensors on different fingers capture the multi-point contact patterns essential for in-hand manipulation data.",
        "Synchronization between tactile and other modalities is critical but technically challenging. Tactile sensors typically connect via USB and introduce 10-30 ms latency, while force/torque sensors connect via analog/EtherCAT with sub-1 ms latency. Our collection pipeline uses hardware triggering for cameras and F/T sensors and software synchronization with latency compensation for tactile sensors. The latency is measured per session using a tap test (simultaneous contact detected by both F/T and tactile) and compensated in post-processing. For DIGIT sensors specifically, the USB video class interface introduces variable latency (10-30 ms) that must be characterized per device — we measure and record this offset for every sensor at the start of each collection session.",
        "Sensor maintenance is a significant operational consideration. GelSight gel membranes degrade over 100-500 hours of active contact, manifesting as reduced image contrast and permanent deformation marks. DIGIT sensors are more durable but still exhibit gel wear over extended use. Claru's tactile collection protocol includes daily calibration checks (pressing a known reference object and verifying image consistency), weekly gel condition assessment, and membrane replacement every 200 hours. All episodes are tagged with the gel condition metric so the downstream pipeline can filter or weight by sensor quality. We maintain a spare inventory of 3-5 replacement gels per sensor type to ensure collection continuity when a membrane reaches end-of-life mid-session.",
        "The annotation pipeline for tactile data extracts both geometric and dynamic features. Geometric annotations include contact area (segmented from the tactile image), estimated contact depth map (reconstructed using photometric stereo from the multi-directional LED illumination), and surface normal estimates at each pixel. Dynamic annotations include slip onset timestamps (detected from sudden texture flow in sequential tactile images), force distribution maps (estimated from depth map gradients for vision-based sensors), and contact state labels (no-contact, stable-contact, incipient-slip, gross-slip). For BioTac and XELA sensors that output numerical arrays rather than images, annotations include force vector decomposition (normal vs. tangential components) and vibration frequency analysis (which indicates surface texture during sliding contact).",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Tactile Sensing Research",
      columns: ["Dataset", "Year", "Scale", "Sensor", "Tasks", "Paired Modalities"],
      rows: [
        { "Dataset": "Touch and Go", "Year": "2022", "Scale": "13K pairs", "Sensor": "GelSight", "Tasks": "Object recognition", "Paired Modalities": "RGB images" },
        { "Dataset": "ObjectFolder 2.0", "Year": "2022", "Scale": "1K objects (sim)", "Sensor": "Simulated tactile", "Tasks": "Multi-modal recognition", "Paired Modalities": "RGB + audio + tactile" },
        { "Dataset": "Calandra Grasping", "Year": "2018", "Scale": "12K grasps", "Sensor": "GelSight", "Tasks": "Grasp success prediction", "Paired Modalities": "RGB + F/T" },
        { "Dataset": "DIGIT-Insertion", "Year": "2023", "Scale": "5K insertions", "Sensor": "DIGIT", "Tasks": "Connector insertion", "Paired Modalities": "RGB + proprioception" },
        { "Dataset": "YCB-Slide", "Year": "2023", "Scale": "10K slides", "Sensor": "DIGIT", "Tasks": "Slip detection", "Paired Modalities": "F/T + proprioception" },
        { "Dataset": "Taxim Sim", "Year": "2022", "Scale": "100K+ (sim)", "Sensor": "Simulated GelSight", "Tasks": "Contact geometry", "Paired Modalities": "Mesh + force" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "10K-100K+", "Sensor": "Configurable", "Tasks": "Full manipulation", "Paired Modalities": "Full multi-modal" },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Tactile Data Needs",
      paragraphs: [
        "Claru operates tactile-equipped collection stations with configurable sensor loadouts tailored to each client's target application. Our standard configurations include GelSight Mini and DIGIT sensors for vision-based tactile perception, XELA uSkin arrays for distributed force sensing on dexterous hands, and BioTac sensors for multi-modal touch requiring simultaneous pressure, temperature, and vibration data. Each station maintains a standardized object library of 200+ items spanning 10 material categories (metal, plastic, wood, glass, ceramic, rubber, fabric, paper, foam, composite) with 3D-printed variants for systematic shape variation.",
        "Our quality assurance pipeline for tactile data goes beyond standard manipulation QA. Every tactile sensor undergoes daily calibration against a reference indenter with known geometry, and the calibration metrics (image contrast ratio, depth reconstruction accuracy, noise floor level) are logged per session and per sensor. Gel condition is tracked using an automated wear scoring algorithm that analyzes the reference indent image for permanent deformation marks, contrast degradation, and illumination non-uniformity. Sensors scoring below threshold are replaced immediately with pre-calibrated spares, ensuring zero-downtime collection. The per-episode metadata includes sensor serial number, gel age in contact-hours, calibration quality score, and ambient temperature — enabling downstream filtering by tactile data quality.",
        "Delivered datasets include contact geometry reconstructions (3D depth maps and surface normals from photometric stereo), slip detection labels with onset timestamps, force distribution maps, material classification labels verified against the object library catalog, and grasp outcome annotations (stable, slipping, dropped, crushed). All data is formatted for direct ingestion by tactile policy architectures including Tactile-RL, General In-Hand Manipulation, and Diffusion Policy with tactile conditioning. We deliver in RLDS, HDF5, or custom formats with full sensor specifications, calibration matrices, and object library metadata.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "yuan-gelsight-2017", title: "GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force", authors: "Yuan et al.", venue: "Sensors 2017", year: 2017, url: "https://arxiv.org/abs/1708.00922" },
        { id: "lambeta-digit-2020", title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation", authors: "Lambeta et al.", venue: "IEEE RA-L 2020", year: 2020, url: "https://arxiv.org/abs/2005.14679" },
        { id: "calandra-gelsight-grasp-2018", title: "More Than a Feeling: Learning to Grasp and Regrasp using Vision and Touch", authors: "Calandra et al.", venue: "IEEE RA-L 2018", year: 2018, url: "https://arxiv.org/abs/1805.11085" },
        { id: "yang-touch-go-2022", title: "Touch and Go: Learning from Human-Collected Vision and Touch", authors: "Yang et al.", venue: "NeurIPS 2022", year: 2022, url: "https://arxiv.org/abs/2211.12498" },
        { id: "si-taxim-2022", title: "Taxim: An Example-based Simulation Model for GelSight Tactile Sensors", authors: "Si & Yuan", venue: "IEEE RA-L 2022", year: 2022, url: "https://arxiv.org/abs/2109.04027" },
        { id: "qi-inhand-2023", title: "General In-Hand Object Rotation with Vision and Touch", authors: "Qi et al.", venue: "CoRL 2023", year: 2023, url: "https://arxiv.org/abs/2309.15117" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many tactile contact episodes are needed for grasp success prediction?",
      answer: "Calandra et al. achieved reliable grasp success prediction from 12,000 grasp attempts with GelSight data. For a production system across 100+ object categories, expect 50,000-100,000 contact episodes. Each episode requires only 1-3 seconds of tactile data (the grasp moment), so the volume challenge is in the number of distinct grasps, not the recording duration. Start with 10,000 grasps across 50 objects and scale based on held-out object performance. If using reinforcement learning (Tactile-RL), the initial human-supervised seed dataset can be as small as 2,000 grasps, with autonomous exploration generating the remaining 50,000+ episodes. The key diversity axis is object material and geometry variation, not repetitions on the same object.",
    },
    {
      question: "Which tactile sensor should I choose for data collection?",
      answer: "For research and prototyping, DIGIT offers the best cost-resolution tradeoff ($100-200, 640x480 at 60 Hz) and has the largest research community. For high-fidelity contact geometry reconstruction, GelSight Mini provides the best surface detail with 0.02 mm depth resolution. For dexterous hands requiring many sensors on one hand, GelSlim 3.0 has the thinnest form factor (8 mm profile) enabling finger-mounted configurations. AnySkin offers the lowest cost ($50-100) with a magnetometer-based design that is extremely durable. BioTac is best for multi-modal sensing (pressure + temperature + vibration) but costs 25x more per sensor. For new projects, we recommend starting with DIGIT for its accessibility, then moving to GelSight if contact geometry reconstruction quality is insufficient for your task.",
    },
    {
      question: "How do you handle tactile sensor calibration drift during collection?",
      answer: "Vision-based tactile sensors (GelSight, DIGIT) drift as the gel membrane wears and ambient conditions change. Our protocol includes: (1) daily reference object press to verify image consistency against a golden calibration image, (2) per-session flat-field calibration (pressing a flat surface to normalize the no-contact baseline), (3) membrane condition scoring on a 1-5 scale using automated contrast analysis, (4) mandatory gel replacement every 200 contact-hours or when the condition score drops below 3. Temperature compensation is applied using a thermistor mounted near the sensor — gel stiffness changes approximately 2% per degree Celsius, affecting depth reconstruction accuracy. Each episode includes the full calibration metadata so downstream processing can correct for or filter by gel condition and ambient temperature.",
    },
    {
      question: "Can simulation generate useful tactile data?",
      answer: "Simulation (Taxim, TACTO, ObjectFolder) can generate tactile images for pretraining perception models such as contact geometry estimation and material classification. Taxim uses finite element modeling to simulate GelSight gel deformation, producing synthetic tactile images that achieve 85% correlation with real sensor output for simple convex contacts. However, simulated tactile data lacks the noise patterns, wear-induced artifacts, illumination drift, and complex friction behaviors of real sensors. For policy training that requires accurate force-deformation relationships (slip detection, compliance control), real tactile data is essential because the force-to-image mapping is nonlinear and sensor-specific. The recommended approach is 50K+ simulated tactile images for perception pretraining, then 5,000-10,000 real episodes for policy fine-tuning. Cross-sensor transfer learning (UniTouch) can reduce per-sensor real data needs by 40-60% if you have data from a related sensor type.",
    },
    {
      question: "What manipulation tasks benefit most from tactile data?",
      answer: "Tasks ranked by tactile value: (1) slip detection and reactive grasping — highest value, 10-15% success rate improvement, as tactile sensing detects incipient slip 50-200 ms before visual signs appear; (2) precision insertion and connector mating — tactile alignment feedback essential for clearances under 0.5 mm where vision loses line of sight at the contact point; (3) in-hand manipulation — object is fully occluded by the hand during rotation and pivoting, making tactile the only source of object state information; (4) material-adaptive grasping — adjusting grip force for fragile (eggs, fruit), slippery (wet glass), or deformable (foam, fabric) objects based on real-time tactile properties; (5) assembly contact verification — confirming that parts are properly seated using the characteristic force signature of a completed insertion. If your task involves any of these, tactile data will significantly improve policy performance.",
    },
    {
      question: "How do vision-based tactile sensors compare to force/torque sensors for manipulation data?",
      answer: "They are complementary, not competing modalities. Force/torque sensors (ATI Mini45, Robotiq FT-300) measure the net 6-axis force and torque at the wrist — a single 6-dimensional vector at 500-1000 Hz. This captures total contact force magnitude and direction but cannot resolve spatial force distribution across the contact patch. Vision-based tactile sensors (GelSight, DIGIT) capture a high-resolution image of the contact surface at 30-60 Hz, revealing the spatial distribution of pressure across hundreds of pixels, contact geometry at sub-millimeter resolution, and surface texture that enables material identification. For manipulation data, we recommend both: F/T for fast whole-arm force control (500 Hz) and tactile for detailed contact perception (30-60 Hz). Diffusion Policy ablation studies show that adding both modalities yields 8-12% higher success than either modality alone on contact-rich assembly tasks.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Tactile Sensor Data",
  ctaDescription: "Tell us your target sensor type, manipulation tasks, and object categories. We will configure tactile-equipped collection stations for your specific contact data needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "tactile-sensing", "contact-rich-manipulation"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset", "how-to-build-a-contact-rich-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Tactile images (GelSight/DIGIT) + force/torque (500 Hz) + RGB + proprioception",
    volumeRange: "10K-100K contact episodes across 100+ objects",
    temporalResolution: "30-100 Hz tactile, 30 Hz RGB, 500 Hz force/torque",
    keyAnnotations: ["Contact geometry reconstruction (depth map from tactile)", "Normal and shear force distribution", "Slip onset detection labels", "Material classification", "Grasp success/failure with failure mode", "Gel condition and calibration metadata"],
  },
  relevantModels: ["Tactile-RL", "Touch-GS", "Tactile Diffusion Policy", "GelSight grasp predictors", "General In-Hand Manipulation", "UniTouch"],
  environmentTypes: ["Tabletop grasping station", "Assembly workbench", "Dexterous manipulation bench", "In-hand manipulation rig"],
  keyPapers: [
    { id: "yuan-gelsight-2017", title: "GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force", authors: "Yuan et al.", venue: "Sensors 2017", year: 2017, url: "https://arxiv.org/abs/1708.00922" },
    { id: "lambeta-digit-2020", title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation", authors: "Lambeta et al.", venue: "IEEE RA-L 2020", year: 2020, url: "https://arxiv.org/abs/2005.14679" },
    { id: "calandra-gelsight-grasp-2018", title: "More Than a Feeling: Learning to Grasp and Regrasp using Vision and Touch", authors: "Calandra et al.", venue: "IEEE RA-L 2018", year: 2018, url: "https://arxiv.org/abs/1805.11085" },
    { id: "yang-touch-go-2022", title: "Touch and Go: Learning from Human-Collected Vision and Touch", authors: "Yang et al.", venue: "NeurIPS 2022", year: 2022, url: "https://arxiv.org/abs/2211.12498" },
    { id: "si-taxim-2022", title: "Taxim: An Example-based Simulation Model for GelSight Tactile Sensors", authors: "Si & Yuan", venue: "IEEE RA-L 2022", year: 2022, url: "https://arxiv.org/abs/2109.04027" },
  ],
  claruRelevance: "Claru operates tactile-equipped collection stations with GelSight Mini, DIGIT, GelSlim, and XELA sensors mounted on standardized gripper platforms. Our object library spans 200+ items covering smooth, rough, soft, hard, slippery, and textured surfaces across 10 material categories for maximum contact diversity. Each episode captures synchronized tactile images, 500 Hz force/torque, RGB video, and proprioception with sensor calibration metadata, gel condition scores, and ambient temperature logging. Our maintenance protocol ensures consistent tactile image quality through daily calibration checks against reference indenters, automated gel wear scoring, and scheduled membrane replacement every 200 contact-hours with pre-calibrated spares for zero-downtime collection. We deliver datasets with contact geometry annotations (3D depth maps and surface normals), slip detection labels, force distribution maps, material classifications, and grasp outcome labels in RLDS, HDF5, or custom formats with full sensor specifications, calibration matrices, and object library catalogs.",
};

export default data;
