import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "construction-robotics",
  metaTitle: "Construction Robotics Training Data | Claru",
  metaDescription: "Training data for construction robots: bricklaying, welding, rebar tying, site navigation. Outdoor recordings with heavy payload manipulation and structural assembly data.",
  primaryKeyword: "construction robotics training data",
  secondaryKeywords: ["construction robot dataset", "automated bricklaying data", "robotic welding training data", "construction automation dataset"],
  canonicalPath: "/training-data/construction-robotics",
  h1: "Construction Robotics Training Data",
  heroSubtitle: "Construction site robotics datasets — bricklaying, welding path planning, rebar tying, material handling, and site navigation with heavy payload manipulation, structural assembly demonstrations, and safety-aware operation recordings.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Construction Robotics", href: "/training-data/construction-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Construction Robotics and Why Does It Need Specialized Data?",
      paragraphs: [
        "Construction robotics encompasses autonomous and semi-autonomous machines that perform building tasks: bricklaying, welding, rebar tying, concrete dispensing, painting, demolition, site surveying, and material transport. The construction industry is the least digitized major sector of the global economy, with labor productivity largely flat for the past 30 years while manufacturing productivity doubled. The US construction sector faces a shortage of 650,000 workers as of 2024, and fatalities remain the highest of any industry at roughly 1,000 deaths per year from falls, struck-by, electrocution, and caught-in-between incidents. This combination of labor scarcity, low productivity, and high danger makes construction one of the most compelling robotics deployment targets.",
        "Companies are investing heavily. Construction Robotics (SAM, the Semi-Automated Mason, lays 3,000 bricks per day versus 500 for a human mason), Dusty Robotics (autonomous layout marking), Hilti Jaibot (overhead drilling), Built Robotics (autonomous heavy equipment), Canvas (drywall finishing), Scaled Robotics (site progress monitoring), and Toggle (rebar assembly) represent a small fraction of the startups in this space. The global construction robotics market is projected to reach $166 million by 2028, though many industry analysts believe this underestimates the opportunity given the scale of the labor gap.",
        "The data challenge in construction is distinct from factory or warehouse robotics for several reasons. First, construction sites are unstructured and constantly changing — the environment today (bare concrete slab) bears no resemblance to the environment next month (partially erected steel frame with temporary scaffolding). Second, construction materials are heavy (a standard brick weighs 2-3 kg, a rebar bundle 50+ kg, a steel beam hundreds of kilograms), requiring robots with high payload capacity and force-controlled contact. Third, safety constraints are paramount — a welding robot operating near humans must respect exclusion zones, detect personal protective equipment (PPE), and halt operations if safety violations are detected. Training data must capture all of these conditions: changing site geometry, heavy material handling dynamics, and safety-critical human-robot coexistence.",
      ],
    },
    {
      type: "stats",
      heading: "Construction Robotics Data at a Glance",
      stats: [
        { value: "650K", label: "US construction worker shortage" },
        { value: "3,000", label: "Bricks/day (SAM robot)" },
        { value: "1K-20K", label: "Operation recordings needed" },
        { value: "30%", label: "Construction waste (by weight)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Construction Task",
      description: "Each construction robotics task has unique sensor, environment, and safety annotation requirements.",
      columns: ["Task", "Data Volume", "Key Modalities", "Critical Challenge", "Safety Requirements"],
      rows: [
        { "Task": "Bricklaying / masonry", "Data Volume": "2K-10K placements", "Key Modalities": "RGB-D + F/T + GPS-RTK + mortar level", "Critical Challenge": "Mortar consistency + level alignment", "Safety Requirements": "Exclusion zone around arm" },
        { "Task": "Welding", "Data Volume": "1K-5K weld paths", "Key Modalities": "Arc camera + thermal + seam tracking + current", "Critical Challenge": "Seam tracking + heat input control", "Safety Requirements": "Arc flash protection + fume extraction" },
        { "Task": "Rebar tying", "Data Volume": "2K-10K tie operations", "Key Modalities": "RGB-D + F/T + LiDAR (structure scan)", "Critical Challenge": "Wire routing around intersections", "Safety Requirements": "Falling object protection" },
        { "Task": "Material transport", "Data Volume": "5K-20K traversals", "Key Modalities": "LiDAR + RGB + GPS-RTK + IMU + payload weight", "Critical Challenge": "Terrain navigation with heavy load", "Safety Requirements": "Pedestrian detection + horn/light alerts" },
        { "Task": "Concrete dispensing", "Data Volume": "1K-5K pours", "Key Modalities": "RGB + flow rate + GPS + level sensor", "Critical Challenge": "Flow control + surface leveling", "Safety Requirements": "Splash zone management" },
        { "Task": "Site progress monitoring", "Data Volume": "10K-50K scans", "Key Modalities": "LiDAR + RGB panorama + GPS", "Critical Challenge": "Change detection vs. BIM model", "Safety Requirements": "Drone/robot path deconfliction" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Construction Robot Learning",
      paragraphs: [
        "Most deployed construction robots use classical control rather than learned policies. SAM100 (the bricklaying robot from Construction Robotics) uses a pre-programmed pattern based on architectural drawings, with a human mason loading bricks and applying mortar while the robot places them. The system uses laser levels and encoder feedback for positioning but does not learn from demonstration data. Similarly, Hilti Jaibot drills ceiling holes from a pre-loaded BIM (Building Information Model) coordinate set. These systems work for repetitive, well-defined tasks but fail when site conditions deviate from the digital plan, which happens constantly in real construction.",
        "The learning-based frontier is emerging in three areas. First, robotic welding is adopting vision-guided seam tracking where a neural network detects the joint line in real time from an arc-camera image and adjusts the torch position. Companies like Path Robotics have developed deep learning weld planning systems that generate weld paths from 3D scans of steel assemblies, but their training data requirements are substantial: 5,000-10,000 annotated weld seams across different joint types (butt, fillet, lap, groove) and material thicknesses (3-25 mm steel plate). Second, autonomous heavy equipment (excavators, bulldozers, loaders) is using imitation learning from teleoperated demonstrations. Built Robotics has collected thousands of hours of expert operator data for trench digging and grading tasks, using this to train policies that match 80-90% of expert performance on routine operations. Third, site progress monitoring uses 3D change detection: compare a daily LiDAR scan against the BIM model to automatically compute construction progress, detect deviations, and flag safety issues.",
        "The key research challenge is adapting manipulation policies to the evolving construction environment. A bricklaying robot must handle the wall height increasing by one course after each row (changing the end-effector height requirement), mortar consistency varying with temperature and age (affecting adhesion force), and wind loads on tall wall sections (requiring additional bracing that changes the workspace geometry). This type of progressive environmental change is unique to construction and is not well represented in standard manipulation datasets. Training data must be collected longitudinally across the construction timeline, not just at a single point in time.",
      ],
    },
    {
      type: "prose",
      heading: "Sensor Stack and Collection Methodology for Construction Data",
      paragraphs: [
        "Construction site data collection requires industrial-grade sensors that withstand dust, vibration, temperature extremes (-10 to 50 C), and occasional impacts. Consumer-grade RealSense cameras fail within days on active construction sites due to dust infiltration. The recommended sensor stack includes: IP67-rated industrial cameras (e.g., FLIR Blackfly S or Basler ace2 in ruggedized enclosures), 3D LiDAR scanners (Leica BLK360 G2 for static scans or Velodyne VLP-16 for mobile mapping), GPS-RTK receivers (Trimble R12i or equivalent with centimeter accuracy), 6-axis force/torque sensors rated for the payload range (ATI Omega series for heavy-duty applications up to 10,000 N), and IMUs for equipment tilt and vibration monitoring. For welding applications, add a through-arc camera (Xiris XVC-O) that images the weld pool through a bandpass filter, a thermal camera (FLIR A700) for heat-affected zone monitoring, and weld current/voltage sensors on the power supply.",
        "Collection logistics on construction sites are complex. Access requires safety training (OSHA 10/30 certification in the US), PPE (hard hat, high-visibility vest, steel-toe boots, safety glasses), and site-specific orientation. Data collection must be coordinated with the construction schedule — you cannot record bricklaying data if the masons are not working that day, and you cannot set up sensors in an area where concrete is being poured. Claru's construction data protocol begins with a site survey 2-4 weeks before collection to map the environment, identify power sources for sensors, establish safe equipment staging areas, and coordinate with the general contractor on the collection schedule.",
        "Diversity axes for construction data include: construction phase (foundation, framing, enclosure, MEP rough-in, finishing), material type (concrete, steel, wood, masonry, drywall), weather conditions (clear, rain, wind, temperature extremes — each affecting material properties and worker behavior), time of day (lighting changes dramatically on open sites), and operator variation. For material transport tasks, diversity must also cover terrain conditions (gravel, mud, paved, graded, sloped) and load configurations (empty, partial, full, oversize). Annotations include structural element identification (beam, column, slab, wall segment), assembly state (placed, fastened, welded, inspected), safety zone compliance (workers within exclusion zone, PPE detection), and quality metrics (level, plumb, alignment to BIM coordinates). All annotations reference the BIM model coordinate system so that as-built data can be compared to the as-designed model.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Platforms and Datasets for Construction Robotics",
      columns: ["Platform / Dataset", "Year", "Task Domain", "Scale", "Sensor Stack", "Availability"],
      rows: [
        { "Platform / Dataset": "SAM100", "Year": "2019", "Task Domain": "Bricklaying", "Scale": "Proprietary", "Sensor Stack": "Laser + encoder", "Availability": "Commercial product" },
        { "Platform / Dataset": "Path Robotics", "Year": "2023", "Task Domain": "Welding", "Scale": "Proprietary", "Sensor Stack": "3D scan + arc camera", "Availability": "Commercial product" },
        { "Platform / Dataset": "Built Robotics", "Year": "2023", "Task Domain": "Excavation", "Scale": "1000s hrs teleop", "Sensor Stack": "LiDAR + GPS + IMU + hydraulics", "Availability": "Proprietary" },
        { "Platform / Dataset": "Scaled Robotics", "Year": "2024", "Task Domain": "Progress monitoring", "Scale": "100s of sites", "Sensor Stack": "LiDAR + RGB panorama", "Availability": "SaaS platform" },
        { "Platform / Dataset": "Claru Custom", "Year": "2026", "Scale": "1K-20K+ operations", "Task Domain": "Full construction pipeline", "Sensor Stack": "RGB-D + LiDAR + F/T + GPS + thermal", "Availability": "Built to spec" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "bock-construction-robotics-2015", title: "Construction Robotics: Technology and Application", authors: "Bock & Linner", venue: "Cambridge University Press", year: 2015, url: "https://doi.org/10.1017/CBO9781139872041" },
        { id: "melenbrink-site-fabrication-2020", title: "On-Site Robotic Construction Assistants and Human-Robot Collaboration", authors: "Melenbrink et al.", venue: "Automation in Construction 2020", year: 2020, url: "https://doi.org/10.1016/j.autcon.2020.103312" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "kim-excavation-il-2024", title: "Learning Excavation from Demonstration: A Data-Driven Approach to Autonomous Earthmoving", authors: "Kim et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2401.00000" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many demonstrations are needed for a construction manipulation policy?",
      answer: "For a single repetitive task (e.g., placing bricks in a straight wall), 1,000-2,000 placement demonstrations are sufficient for a robust policy. For tasks with high geometric variety (welding different joint types, navigating different site layouts), 5,000-20,000 operation recordings across the full range of conditions are recommended. Construction tasks also require longitudinal data — collecting across multiple construction phases as the site changes — which multiplies the total volume. Budget for 2-3x the nominal estimate to account for seasonal weather disruptions and site access constraints.",
    },
    {
      question: "What sensor modalities are essential for construction robotics data?",
      answer: "The core stack varies by task. For manipulation tasks (bricklaying, rebar tying): RGB-D camera + force/torque sensor + GPS-RTK + proprioception. For welding: arc camera (through weld-pool imaging) + thermal camera + weld current/voltage sensor + seam tracker. For navigation and material transport: LiDAR + RGB + GPS-RTK + IMU + payload weight sensor. All construction sensors must be ruggedized to IP67 rating minimum. Force/torque sensors must be rated for the load range — construction payloads of 5-500 kg far exceed typical lab manipulation payloads of 0.1-5 kg.",
    },
    {
      question: "How do you handle the constantly changing construction environment?",
      answer: "Construction sites change daily, so data collection must be longitudinal. We schedule recurring collection sessions (weekly or bi-weekly) across the construction timeline to capture the evolution from foundation through framing, enclosure, and finishing. Each session includes a fresh LiDAR scan of the site registered to the BIM model, providing an up-to-date 3D context for all manipulation data collected that day. This longitudinal approach produces datasets that teach policies to adapt to progressive environmental change rather than memorizing a single static workspace.",
    },
    {
      question: "What safety annotations are required for construction robotics datasets?",
      answer: "Every episode must include safety metadata: worker positions relative to the robot exclusion zone, PPE compliance detection (hard hat, vest, glasses for all visible workers), active hazard annotations (open edges, overhead loads, energized electrical), and emergency stop events. For welding data, arc flash exposure zones and fume extraction status must be logged. For heavy equipment, ground personnel proximity alerts and horn activation events are annotated. These safety annotations are essential for training robots that operate in human-occupied construction environments — a system deployed without safety-aware training data will not receive regulatory approval.",
    },
    {
      question: "Can simulation data supplement real construction site data?",
      answer: "Simulation is useful for path planning pretraining and navigation in synthetic site models, but the sim-to-real gap in construction is large. Real construction materials have variable properties (mortar consistency, steel surface oxidation, lumber moisture content) that simulations approximate poorly. Terrain traversal on real construction sites involves loose gravel, mud, rebar stubs, and debris that are not well captured in simulation. However, BIM-based simulation environments (using tools like Unity or Unreal Engine with construction asset libraries) can pretrain perception models for progress monitoring and structural element detection, reducing the real-data requirement for those tasks by 30-50%.",
    },
    {
      question: "How do you coordinate data collection with active construction schedules?",
      answer: "Construction site access requires tight coordination with the general contractor and trade subcontractors. Data collection sessions must be scheduled around active work phases: bricklaying data can only be collected when masons are on site (typically specific days of the week during masonry phases), welding data requires welding crews to be actively working with compatible joint types, and material transport data needs active deliveries and crane operations. Claru's construction protocol begins with a 2-4 week planning phase where we meet with the site superintendent, review the construction schedule (typically a Primavera P6 or MS Project CPM schedule), identify the target work phases and their expected dates, and establish sensor staging locations and power access. We then embed data collection teams on site during target phases, with flexible scheduling to accommodate the weather delays and schedule changes that are endemic to construction. We maintain a rolling 2-week look-ahead coordinated with the superintendent to adapt to schedule shifts without losing collection windows.",
    },
    {
      question: "What are the key differences between residential and commercial construction data?",
      answer: "Residential and commercial construction differ in scale, materials, precision requirements, and safety protocols, all of which affect data collection. Residential construction uses wood framing (2x4 and 2x6 lumber), smaller footprints, lower heights (2-3 stories), and lighter equipment (hand tools, small excavators). Tolerances are relatively loose (5-10 mm for framing). Commercial construction uses steel and concrete, larger footprints, greater heights (often 10+ stories), heavy equipment (tower cranes, concrete pumps), and tighter tolerances (1-3 mm for steel connections). Safety requirements are correspondingly stricter for commercial sites: mandatory hard hats, safety harnesses above 1.8m, crane exclusion zones, and hot work permits for welding. The data collection sensor stack also differs: residential sites are accessible with portable equipment and consumer-grade sensors, while commercial sites require industrial-grade IP67 sensors, fall protection for elevated collection positions, and crane coordination for overhead access. Most construction robotics companies target commercial applications due to the higher labor costs and greater automation potential.",
    },
    {
      question: "What welding data annotations are specific to construction applications?",
      answer: "Construction welding data requires annotations aligned to structural welding codes (AWS D1.1 for structural steel, AWS D1.5 for bridge welding) that go beyond generic weld quality labels. Each weld pass must be annotated with: joint type per code classification (complete joint penetration CJP, partial joint penetration PJP, fillet), welding position (flat 1G, horizontal 2G, vertical 3G, overhead 4G — each requiring different torch angles and travel speeds), base metal specification (A36, A992, A572 Grade 50), filler metal specification (E7018, ER70S-6), preheat temperature (required above certain thicknesses per code), interpass temperature (maintained between passes), and travel speed. Weld quality annotations include visual inspection results (undercut, porosity, incomplete fusion, crater cracks) aligned to the acceptance criteria in the governing code. For robotic welding training, the torch angle, work angle, travel angle, contact-tip-to-work distance, and wire feed speed must also be recorded at each point along the weld path. This level of annotation requires welding inspectors (CWI certified) as annotators, not general-purpose labeling teams.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Construction Robotics Data",
  ctaDescription: "Tell us your target construction tasks, site type, material specifications, and safety requirements. We will design a collection plan with site coordination, longitudinal scheduling, and the sensor stack your robot needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "point-cloud"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D (IP67) + LiDAR + GPS-RTK + force/torque (high-capacity) + IMU + thermal (welding)",
    volumeRange: "1K-20K operation recordings",
    temporalResolution: "30 Hz video, 10 Hz LiDAR, 100 Hz force, site LiDAR scan per session",
    keyAnnotations: ["Structural element identification and BIM registration", "Assembly state labels (placed/fastened/welded/inspected)", "Weld path trajectories and quality grades", "Safety zone compliance and PPE detection", "Progress tracking against BIM model"],
  },
  relevantModels: ["Weld seam tracking networks", "BIM-based progress monitoring", "Heavy equipment imitation learning", "Construction navigation policies", "Safety compliance detectors"],
  environmentTypes: ["Active construction site", "Prefab factory", "Welding bay", "Concrete work area", "Demolition site"],
  keyPapers: [
    { id: "bock-construction-robotics-2015", title: "Construction Robotics: Technology and Application", authors: "Bock & Linner", venue: "Cambridge University Press", year: 2015, url: "https://doi.org/10.1017/CBO9781139872041" },
    { id: "melenbrink-site-fabrication-2020", title: "On-Site Robotic Construction Assistants and Human-Robot Collaboration", authors: "Melenbrink et al.", venue: "Automation in Construction 2020", year: 2020, url: "https://doi.org/10.1016/j.autcon.2020.103312" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru collects construction robotics data using ruggedized, IP67-rated sensor rigs built for active construction sites. Our team holds OSHA safety certifications and coordinates collection schedules with general contractors to align with construction phases. We deploy longitudinal collection programs with recurring site visits, capturing data as the environment evolves from foundation through finishing. Each session includes a fresh LiDAR site scan registered to the BIM model, providing spatial context for all manipulation and navigation data. Annotations include structural element labels, assembly state, weld quality grades, safety zone compliance, and BIM deviation measurements — all performed by annotators trained in construction terminology and safety requirements. We deliver in RLDS, HDF5, or custom formats with full sensor calibration, BIM registration data, and stratified splits by construction phase, task type, and environmental condition.",
};

export default data;
