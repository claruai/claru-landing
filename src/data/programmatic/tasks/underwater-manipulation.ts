import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "underwater-manipulation",
  metaTitle: "Underwater Manipulation Training Data | Claru",
  metaDescription: "Training data for underwater robots: subsea manipulation, pipeline inspection, marine sampling. ROV and AUV recordings with turbid water visual data and current compensation.",
  primaryKeyword: "underwater manipulation training data",
  secondaryKeywords: ["underwater robot dataset", "subsea manipulation data", "ROV training data", "AUV manipulation dataset", "marine robotics data", "subsea inspection dataset"],
  canonicalPath: "/training-data/underwater-manipulation",
  h1: "Underwater Manipulation Training Data",
  heroSubtitle: "Subsea manipulation datasets for underwater robotics — pipeline valve operation, marine sampling, debris clearing, and inspection tasks with turbid water visual processing and current compensation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Underwater Manipulation", href: "/training-data/underwater-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Underwater Manipulation and Why Is Data Collection So Difficult?",
      paragraphs: [
        "Underwater manipulation encompasses robotic tasks performed in aquatic environments: operating subsea valves on oil and gas infrastructure, collecting marine biological samples, clearing debris from ship hulls or port structures, and inspecting underwater infrastructure. The physics of underwater operation create challenges absent from terrestrial robotics: hydrodynamic drag on the manipulator arm, buoyancy forces that change the effective weight of grasped objects, ocean currents that push the robot off station, and reduced visibility from turbidity, backscatter, and color absorption that makes water progressively green and then dark blue with depth.",
        "Data collection underwater is orders of magnitude more expensive than on land. A single ROV (Remotely Operated Vehicle) deployment costs $5,000-50,000 per day including vessel, crew, and equipment. Subsea visibility windows are weather-dependent, and camera systems must be pressure-rated to the operating depth. The result is that public underwater manipulation datasets are virtually nonexistent — the largest, from the MBARI and OceanNetworksCanada archives, contain inspection video but not manipulation demonstrations with action labels. This scarcity means any structured underwater manipulation dataset has enormous value for the subsea robotics industry.",
        "The subsea services market is worth $40B+ annually, dominated by oil and gas inspection, maintenance, and repair (IMR). Companies like Oceaneering, Saab Seaeye, and Reach Robotics are developing autonomous underwater manipulation systems, but progress is constrained by the lack of training data. A single task — turning a subsea valve — requires different strategies depending on valve type (gate, ball, butterfly), handle design (handwheel, T-bar, lever), biofouling level (clean, light growth, heavy encrustation), and current conditions. Each combination needs dedicated demonstrations that can only be collected in real underwater environments.",
        "The emerging offshore wind energy sector is creating massive new demand for underwater manipulation data. The global offshore wind market is projected to reach $120 billion by 2030, with over 30,000 turbines requiring regular subsea inspection and maintenance. Each monopile foundation must be inspected for corrosion, scour, and marine growth at 6-12 month intervals. Cable junction boxes, J-tubes, and inter-array cables need periodic manipulation for maintenance. The scale of this inspection and maintenance workload far exceeds available ROV pilot capacity, making autonomous underwater manipulation a commercial imperative rather than a research curiosity.",
      ],
    },
    {
      type: "stats",
      heading: "Underwater Manipulation Data at a Glance",
      stats: [
        { value: "500-5K", label: "Demos per task type" },
        { value: "$5K-50K/day", label: "ROV deployment cost" },
        { value: "$40B+", label: "Annual subsea services market" },
        { value: "< 3m", label: "Typical visibility range" },
        { value: "30,000+", label: "Offshore wind turbines needing inspection" },
        { value: "80%", label: "ROV pilot time on station-keeping vs. manipulation" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Underwater Task",
      description: "Each underwater task has different visibility, force, and precision requirements.",
      columns: ["Task", "Data Volume", "Depth Range", "Visibility Need", "Key Challenge"],
      rows: [
        { "Task": "Valve operation", "Data Volume": "500-2K demos", "Depth Range": "0-3000m", "Visibility Need": "1-3m", "Key Challenge": "Biofouling, current" },
        { "Task": "Marine sampling", "Data Volume": "300-1K demos", "Depth Range": "0-6000m", "Visibility Need": "0.5-2m", "Key Challenge": "Delicate specimens" },
        { "Task": "Debris clearing", "Data Volume": "500-2K demos", "Depth Range": "0-100m", "Visibility Need": "1-5m", "Key Challenge": "Object diversity, entanglement" },
        { "Task": "Pipeline inspection", "Data Volume": "1K-5K demos", "Depth Range": "0-3000m", "Visibility Need": "2-5m", "Key Challenge": "Continuous navigation" },
        { "Task": "Connector mating", "Data Volume": "500-2K demos", "Depth Range": "0-3000m", "Visibility Need": "1-3m", "Key Challenge": "Precision + current" },
        { "Task": "Cable burial/repair", "Data Volume": "300-1K demos", "Depth Range": "0-100m", "Visibility Need": "1-3m", "Key Challenge": "Seabed terrain + cable tracking" },
        { "Task": "Cathodic protection anode replacement", "Data Volume": "200-500 demos", "Depth Range": "0-200m", "Visibility Need": "1-3m", "Key Challenge": "Heavy parts + corroded bolts" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Underwater Robot Learning",
      paragraphs: [
        "Underwater robot learning lags terrestrial manipulation by roughly a decade, primarily due to data scarcity. Most subsea manipulation is performed by human ROV pilots operating master-slave interfaces — a teleoperation paradigm that naturally produces demonstration data, but this data is proprietary to the operating companies (Oceaneering, TechnipFMC, Subsea 7) and not available for research. Academic work focuses on simulation: UWSim (Prats et al., 2012) and HoloOcean (Bingham et al., 2023) provide underwater simulation environments, but the sim-to-real gap for underwater is even more severe than for terrestrial applications because water dynamics, light scattering, and marine growth are extremely difficult to simulate faithfully.",
        "The most promising recent approach is transfer from terrestrial manipulation data augmented with underwater-specific visual domain adaptation. By training a manipulation policy on large-scale terrestrial data (RT-2, DROID) and then fine-tuning on a small set of underwater demonstrations with underwater-specific visual augmentation (color shift, turbidity, backscatter, caustics), researchers have achieved 60-70% success on basic underwater grasping tasks from just 100-200 real underwater demonstrations. However, tasks requiring precision (valve operation, connector mating) still demand 500-2,000 underwater-specific demonstrations because the hydrodynamic effects on arm control cannot be captured by visual augmentation alone.",
        "Sonar-based manipulation is emerging for zero-visibility conditions. Forward-looking sonar provides range images that are unaffected by water clarity, enabling manipulation in conditions where cameras are useless. However, sonar resolution is much lower than vision (typically 1-2 cm at 5m range), requiring different policy architectures and training data. The data challenge doubles: sonar-based policies need their own training datasets that cannot be derived from visual data. Multibeam imaging sonar (e.g., Blueprint Subsea Oculus M1200d) provides higher resolution (< 5 mm at 2m range) but only in a narrow field of view, requiring active scanning strategies.",
        "The DexROV project (EU Horizon 2020) demonstrated semi-autonomous manipulation through a combination of high-level human commands and low-level autonomous controllers. The operator specifies a target (e.g., 'turn that valve 90 degrees clockwise') and the system plans the approach trajectory, manages station-keeping, and executes the manipulation while the operator monitors via satellite link from shore. This architecture drastically reduces the communication bandwidth requirement (from continuous video teleoperation at 5+ Mbps to intermittent commands at < 100 kbps) and enables operation over high-latency satellite links. The training data for such systems requires both manipulation demonstrations and operator-intent annotations that map high-level commands to specific manipulation sequences.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Underwater Data",
      paragraphs: [
        "Underwater data collection uses three tiers of decreasing cost and increasing accessibility. Tier 1: pool-based collection in controlled tank environments (2-5m depth, clear water, controllable current via pumps) — lowest cost ($500-2,000/day), highest throughput, but limited environmental realism. Tier 2: shallow-water pier or dock collection (0-10m depth, natural visibility, natural current) — moderate cost ($2,000-10,000/day), provides real marine conditions without requiring a vessel. Tier 3: open-water ROV deployment (any depth, full operational conditions) — highest cost ($5,000-50,000/day), highest realism, lowest throughput.",
        "Claru's underwater collection protocol uses a staged approach. Initial policy development uses Tier 1 pool data (500-1,000 demonstrations) to validate the task structure and annotation pipeline. Domain adaptation fine-tuning uses Tier 2 shallow-water data (200-500 demonstrations) to introduce real marine conditions. Production validation uses Tier 3 open-water data (50-200 demonstrations) to verify deployment readiness. This pyramid structure minimizes cost while maximizing data value at each stage. For each tier, we maintain standardized valve panels, connector plates, and sampling targets that replicate real subsea infrastructure but can be safely deployed and retrieved.",
        "Sensor considerations are unique to underwater. Cameras require underwater housings rated to operating depth (1 atm per 10m), white-balance correction for depth-dependent color absorption (red light is absorbed first, then orange, then yellow — below 15m the scene appears blue-green without artificial lighting), and powerful LED arrays (10,000+ lumens for depths beyond 10m). Sonar provides depth-independent range data but at lower resolution. Manipulator proprioception must account for hydrodynamic forces — the same joint torque produces different arm velocities depending on current speed and arm configuration. DVL (Doppler Velocity Log) and USBL (Ultra-Short Baseline) acoustic positioning provide vehicle localization in GPS-denied underwater environments.",
        "Annotations include visibility quality score (Secchi disk equivalent computed from image contrast ratio and color channel attenuation), current velocity estimate (from vehicle drift compensation or ADCP readings), target object condition (clean, light fouling, heavy fouling with specific marine organism classification where possible), water temperature and salinity (which affect buoyancy and hydrodynamic forces), and task completion verification including quantitative metrics (e.g., valve rotation angle achieved, connector seating force profile, sample volume collected). For pipeline inspection data, annotations additionally include coating condition, anode status, span measurements, and defect classification aligned to DNVGL-RP-F116 pipeline integrity management standards.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Resources for Underwater Manipulation Research",
      columns: ["Resource", "Year", "Type", "Content", "Manipulation Data", "Availability"],
      rows: [
        { "Resource": "UWSim / UWRoboticsSimulator", "Year": "2012/2020", "Type": "Simulation", "Content": "Underwater physics sim", "Manipulation Data": "Generated", "Availability": "Open source" },
        { "Resource": "HoloOcean", "Year": "2023", "Type": "Simulation", "Content": "Unreal-based subsea sim", "Manipulation Data": "Limited", "Availability": "Open source" },
        { "Resource": "MBARI Video Archive", "Year": "Ongoing", "Type": "Video dataset", "Content": "Deep-sea inspection video", "Manipulation Data": "No (observation only)", "Availability": "Partial public" },
        { "Resource": "DexROV", "Year": "2019", "Type": "EU project", "Content": "Semi-autonomous ROV manipulation", "Manipulation Data": "Limited (project demos)", "Availability": "Project consortium" },
        { "Resource": "Oceaneering IMR Logs", "Year": "Ongoing", "Type": "Operational data", "Content": "Real ROV manipulation", "Manipulation Data": "Yes", "Availability": "Proprietary" },
        { "Resource": "SubPipe (SINTEF)", "Year": "2022", "Type": "Simulation", "Content": "Pipeline inspection sim", "Manipulation Data": "Navigation + inspection", "Availability": "Research license" },
        { "Resource": "Claru Custom", "Year": "2026", "Type": "Structured dataset", "Content": "Pool + shallow + open water", "Manipulation Data": "Yes (annotated)", "Availability": "Built to spec" },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Underwater Manipulation Data",
      paragraphs: [
        "Claru operates underwater data collection across three tiers: controlled pool facilities with adjustable current generators and turbidity control for high-throughput baseline collection, shallow-water pier and dock sites with natural marine conditions for domain adaptation, and open-water ROV deployments with commercial-grade work-class systems for full operational realism. Our underwater sensor packages include pressure-rated cameras with depth-corrected white balance and 10,000+ lumen LED arrays, forward-looking multibeam sonar for low-visibility conditions, DVL and USBL acoustic positioning, and manipulator proprioception with hydrodynamic force compensation calibrated per arm configuration.",
        "Each episode includes visibility quality scores derived from automated image analysis, current velocity estimates from DVL or ADCP data, target condition labels (clean/fouled with marine organism classification), water temperature and salinity measurements, and task completion verification with quantitative success metrics. We support valve operation (gate, ball, butterfly), marine sampling (sediment, biological, water), debris clearing, connector mating, pipeline inspection with DNVGL-standard defect classification, and custom subsea tasks defined by client specifications.",
        "The staged collection approach (80% pool, 15% shallow, 5% open water) maximizes data value per dollar while ensuring the dataset captures the full range of environmental conditions needed for production deployment. Datasets are delivered with full sensor calibration, water condition metadata, collection-tier-stratified splits, and underwater-specific preprocessing (color correction, backscatter removal, contrast enhancement) applied as optional post-processing channels alongside the raw data.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "prats-uwsim-2012", title: "An Open Source Tool for Simulation and Supervision of Underwater Intervention Missions", authors: "Prats et al.", venue: "IROS 2012", year: 2012, url: "https://ieeexplore.ieee.org/document/6385788" },
        { id: "bingham-holoocean-2023", title: "HoloOcean: Realistic Sonar Simulation", authors: "Bingham et al.", venue: "ICRA 2023", year: 2023, url: "https://arxiv.org/abs/2305.15468" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "cieslak-uvms-2023", title: "Learning-Based Control for Underwater Vehicle-Manipulator Systems", authors: "Cieslak et al.", venue: "IEEE J-OE 2023", year: 2023, url: "https://ieeexplore.ieee.org/document/10038543" },
        { id: "simetti-dexrov-2019", title: "Manipulation and Transportation with Cooperative Underwater Vehicle-Manipulator Systems", authors: "Simetti et al.", venue: "IEEE J-OE 2019", year: 2019, url: "https://doi.org/10.1109/JOE.2018.2889578" },
        { id: "ruggiero-aerial-manip-2018", title: "Aerial Manipulation: A Literature Review", authors: "Ruggiero et al.", venue: "IEEE RA-L 2018", year: 2018, url: "https://doi.org/10.1109/LRA.2018.2808541" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many underwater demonstrations are needed for valve operation?",
      answer: "For a single valve type in clear water, 200-500 pool-based demonstrations provide a baseline policy that achieves approximately 70-80% success in controlled conditions. For production deployment across 5+ valve types with biofouling variation and current compensation, expect 1,000-2,000 total demonstrations across the three collection tiers (pool, shallow water, open water). The staged collection approach keeps costs manageable: 80% of demonstrations come from the lowest-cost pool tier, with the more expensive tiers focused on domain-specific adaptation. Valve handle design is the strongest diversity axis — a T-bar handle requires a fundamentally different grasp and rotation strategy than a handwheel or lever, so each handle type needs its own dedicated demonstrations.",
    },
    {
      question: "Can pool-collected data transfer to open water?",
      answer: "Pool data transfers well for manipulation mechanics (arm trajectories, grasp strategies, force profiles) but not for visual processing or current compensation. Expect a 20-30% success rate drop when deploying a pool-only policy in open water due to turbidity reducing visibility from > 10m to < 3m, color shift from depth-dependent light absorption, marine growth changing the visual and physical properties of target objects, and current disturbances inducing vehicle motion during manipulation. The staged collection protocol addresses this systematically: pool data establishes the policy structure for manipulation mechanics, 200-500 shallow-water demonstrations provide domain adaptation for real marine visual conditions, and 50-200 open-water demonstrations validate and fine-tune for production operational conditions including current and depth effects.",
    },
    {
      question: "What sensors work underwater when visibility is near zero?",
      answer: "Forward-looking multibeam sonar (e.g., Blueprint Subsea Oculus M1200d, Teledyne M900) provides range images independent of water clarity at 1-50m range with 5 mm to 2 cm resolution depending on range and frequency. Acoustic positioning (USBL for relative positioning, LBL for absolute) provides vehicle and target localization through any water conditions. Manipulator proprioception (joint encoders plus motor current sensors) provides arm state regardless of visibility. For zero-visibility contact operations, structured-light laser systems can provide short-range (< 2m) 3D imaging through moderate turbidity. The practical approach is a sonar-first sensor stack with proprioceptive manipulation feedback for zero-visibility, transitioning to camera-based when visibility permits.",
    },
    {
      question: "How expensive is underwater data collection compared to terrestrial?",
      answer: "Pool-based collection costs $500-2,000/day (comparable to a well-equipped terrestrial lab). Shallow-water pier or dock collection runs $2,000-10,000/day including dive support, boat, and marine equipment. Open-water ROV deployment costs $5,000-50,000/day including vessel charter, crew, and ROV system — a work-class ROV (Schilling Robotics, FMC Technologies) with 7-function manipulators requires a dynamic positioning vessel and a crew of 4-6. The total cost for a 1,000-demonstration underwater dataset using the staged approach is typically $50,000-200,000, roughly 10-50x more than an equivalent terrestrial dataset. This cost premium makes each demonstration extremely valuable and justifies meticulous quality control at every collection stage.",
    },
    {
      question: "Should underwater data include biofouling variations?",
      answer: "Yes, biofouling is the single most underestimated variable in underwater manipulation datasets. Marine growth fundamentally changes manipulation: biofouled valve handles have different friction coefficients (barnacles increase friction 3-5x), visual appearance (obscuring markings and handle geometry), and structural integrity (corroded fasteners may break under torque). Collect demonstrations across at least 3 fouling levels (clean, light growth at Fouling Rating 1-3, heavy encrustation at Rating 4-5 per NSTM Chapter 081) for each target object. In pool environments, simulate biofouling with textured epoxy attachments and artificial marine growth products on standard valve fixtures. In open water, naturally fouled infrastructure provides authentic variation. Annotate fouling level per episode using standardized rating scales for fouling-conditioned policy training.",
    },
    {
      question: "How does the offshore wind sector change underwater manipulation data needs?",
      answer: "Offshore wind creates demand for three specific data categories that oil and gas ROV data does not adequately cover. First, monopile and jacket foundation inspection requires circumferential scanning with specific defect vocabularies (scour depth, coating breakdown, cathodic protection anode condition) distinct from pipeline inspection. Second, inter-array cable junction boxes require connector manipulation in shallow water (10-40m) with moderate current — a different operating regime than deep-water oil and gas. Third, the scale is unprecedented: 30,000+ turbines globally by 2030, each requiring annual inspection, versus hundreds of offshore oil platforms. This volume demands autonomous or semi-autonomous systems rather than fully teleoperated ROVs, which in turn requires orders of magnitude more training data than current subsea manipulation datasets provide.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Underwater Manipulation Data",
  ctaDescription: "Describe your target subsea tasks, depth requirements, and operational conditions. We will design a staged collection plan from pool to open water with the right sensor configuration.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "sim-to-real-gap"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "Underwater RGB + sonar + depth/pressure + manipulator proprioception + DVL/USBL positioning",
    volumeRange: "500-5K demonstrations per task type (staged: pool + shallow + open water)",
    temporalResolution: "15-30 Hz underwater video, 50 Hz sonar, 100 Hz manipulator state, 1 Hz positioning",
    keyAnnotations: ["Visibility quality score (image contrast metric)", "Current velocity estimate (DVL/ADCP)", "Target object condition (clean/fouled with rating)", "Water temperature and salinity", "Task completion verification with quantitative metrics"],
  },
  relevantModels: ["Underwater manipulation policies", "Sonar-based grasp planners", "Current-compensated controllers", "Domain-adapted VLAs", "DexROV semi-autonomous systems"],
  environmentTypes: ["Pool/tank facility", "Pier/dock (shallow)", "Subsea pipeline", "Port infrastructure", "Marine research station", "Offshore wind foundation"],
  keyPapers: [
    { id: "prats-uwsim-2012", title: "An Open Source Tool for Simulation and Supervision of Underwater Intervention Missions", authors: "Prats et al.", venue: "IROS 2012", year: 2012, url: "https://ieeexplore.ieee.org/document/6385788" },
    { id: "bingham-holoocean-2023", title: "HoloOcean: Realistic Sonar Simulation", authors: "Bingham et al.", venue: "ICRA 2023", year: 2023, url: "https://arxiv.org/abs/2305.15468" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "cieslak-uvms-2023", title: "Learning-Based Control for Underwater Vehicle-Manipulator Systems", authors: "Cieslak et al.", venue: "IEEE J-OE 2023", year: 2023, url: "https://ieeexplore.ieee.org/document/10038543" },
    { id: "simetti-dexrov-2019", title: "Manipulation and Transportation with Cooperative Underwater Vehicle-Manipulator Systems", authors: "Simetti et al.", venue: "IEEE J-OE 2019", year: 2019, url: "https://doi.org/10.1109/JOE.2018.2889578" },
  ],
  claruRelevance: "Claru operates underwater data collection across three tiers: controlled pool facilities with adjustable current generators for high-throughput baseline collection, shallow-water pier and dock sites for natural marine conditions, and open-water ROV deployments for full operational realism. Our underwater sensor packages include pressure-rated cameras with depth-corrected white balance, forward-looking multibeam sonar for low-visibility conditions, DVL and USBL acoustic positioning, and manipulator proprioception with hydrodynamic force compensation. Each episode includes visibility quality scores, current velocity estimates, target condition labels (clean/fouled with standardized ratings), water temperature and salinity data, and task completion verification with quantitative success metrics. We support valve operation, marine sampling, debris clearing, connector mating, pipeline inspection with DNVGL-standard defect classification, and offshore wind foundation inspection tasks. The staged collection approach (80% pool, 15% shallow, 5% open water) maximizes data value per dollar. Datasets are delivered with full sensor calibration, water condition metadata, collection-tier-stratified splits, and optional underwater-specific preprocessing (color correction, backscatter removal).",
};

export default data;
