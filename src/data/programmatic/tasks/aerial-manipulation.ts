import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "aerial-manipulation",
  metaTitle: "Aerial Manipulation Training Data | Claru",
  metaDescription: "Training data for aerial manipulation: drone grasping, package delivery, inspection contact. UAV recordings with flight dynamics, wind compensation, and manipulation coordination.",
  primaryKeyword: "aerial manipulation training data",
  secondaryKeywords: ["drone manipulation dataset", "UAV grasping data", "aerial robotics training data", "drone delivery dataset"],
  canonicalPath: "/training-data/aerial-manipulation",
  h1: "Aerial Manipulation Training Data",
  heroSubtitle: "Aerial manipulation datasets for drone robotics — in-flight grasping, package pickup and delivery, contact inspection, and perching tasks with coordinated flight-manipulation control, wind disturbance handling, and multi-modal sensor fusion.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Aerial Manipulation", href: "/training-data/aerial-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Aerial Manipulation and Why Does It Demand Specialized Data?",
      paragraphs: [
        "Aerial manipulation combines the mobility of unmanned aerial vehicles (UAVs) with robotic end-effectors capable of physically interacting with the environment. Unlike ground-based manipulation where the robot base is rigidly fixed or moves on stable ground, aerial manipulators must simultaneously maintain stable flight while exerting forces through a gripper or tool. Every contact force generates an equal and opposite reaction on the airframe, creating coupled dynamics that ground robots never encounter. A simple 2 N grasp force on a 5 kg multirotor shifts the center of mass and induces a torque that the flight controller must immediately compensate. This tight coupling between manipulation and locomotion makes the control problem fundamentally harder and the data requirements fundamentally different.",
        "The commercial and industrial applications are expanding rapidly. Wing (Alphabet) and Amazon Prime Air are deploying package delivery drones that must grasp, carry, and release payloads. Infrastructure inspection companies like Skydio and Flyability need drones that make physical contact with bridges, wind turbines, and power lines for ultrasonic thickness testing and surface sampling. Agricultural applications include precision spraying, fruit picking from tall canopies, and sensor placement. The global commercial drone market exceeded $30 billion in 2025, with manipulation-capable platforms representing the fastest-growing segment.",
        "The data challenge is unique to aerial manipulation. Ground manipulation datasets like DROID or Bridge V2 are collected with stationary or slow-moving bases where camera viewpoints change slowly and predictably. In aerial manipulation, the camera viewpoint shifts continuously due to wind gusts, attitude corrections, and intentional repositioning. The observation space includes not just the workspace and objects but also the drone's own attitude, velocity, and motor states. Training policies must learn to decouple the visual motion caused by flight dynamics from the motion caused by object interaction, requiring data that captures both in sufficient diversity.",
      ],
    },
    {
      type: "stats",
      heading: "Aerial Manipulation Data at a Glance",
      stats: [
        { value: "1K-10K", label: "Flight-manipulation episodes" },
        { value: "200 Hz", label: "IMU sampling rate" },
        { value: "$30B+", label: "Commercial drone market (2025)" },
        { value: "6-DoF", label: "Coupled flight-manipulation control" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Aerial Manipulation Subtask",
      description: "Different aerial manipulation tasks impose distinct sensor, volume, and annotation requirements.",
      columns: ["Subtask", "Data Volume", "Key Modalities", "Critical Challenge", "Typical Platform"],
      rows: [
        { "Subtask": "Package pickup/delivery", "Data Volume": "2K-5K episodes", "Key Modalities": "RGB-D + GPS-RTK + IMU + gripper state", "Critical Challenge": "Precision landing + grasp under rotor wash", "Typical Platform": "Hexarotor with undercarriage gripper" },
        { "Subtask": "Contact inspection", "Data Volume": "1K-3K episodes", "Key Modalities": "RGB + F/T + IMU + ultrasonic", "Critical Challenge": "Maintaining contact force without destabilization", "Typical Platform": "Tilt-rotor with end-effector probe" },
        { "Subtask": "Perching and grasping", "Data Volume": "500-2K episodes", "Key Modalities": "RGB + IMU + gripper servo + proximity", "Critical Challenge": "Dynamic grasp on moving/swaying targets", "Typical Platform": "Quadrotor with tendon-actuated gripper" },
        { "Subtask": "Tool use (spraying, sampling)", "Data Volume": "1K-5K episodes", "Key Modalities": "RGB + GPS + flow rate + IMU", "Critical Challenge": "Maintaining standoff distance under wind", "Typical Platform": "Octorotor with spray boom or corer" },
        { "Subtask": "Cooperative aerial transport", "Data Volume": "2K-10K episodes", "Key Modalities": "RGB + IMU + inter-drone comms + cable tension", "Critical Challenge": "Multi-agent coordination with shared payload", "Typical Platform": "2-4 quadrotors with cable suspension" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Aerial Manipulation Research",
      paragraphs: [
        "Early aerial manipulation research focused on fully actuated hexarotors with rigidly mounted grippers. The ARCAS project (EU FP7) demonstrated cooperative construction with multiple aerial manipulators, while the AEROARMS project (Ollero et al., 2018) built a dual-arm system on a hexarotor platform capable of valve turning on industrial pipes. These systems relied on classical control (PID cascades, impedance control) and required careful system identification rather than learned policies. The data requirements were minimal — hand-tuned controllers needed no demonstrations — but generalization was effectively zero. Each new task required weeks of parameter tuning.",
        "The learning-based paradigm shift began with reinforcement learning in simulation. Zeng et al. (2020) trained quadrotor grasping policies in the Flightmare simulator, achieving sim-to-real transfer for simple pick-and-place tasks. However, the sim-to-real gap in aerial manipulation is severe: rotor wash effects on lightweight objects, ground effect during low-altitude operations, wind turbulence near structures, and actuator latency on real flight controllers are all poorly modeled. ETH Zurich's Aerial Robotics Lab has demonstrated that policies trained purely in simulation achieve 40-60% lower success rates than those fine-tuned with real flight data, particularly for contact-rich tasks like inspection and perching.",
        "Current state-of-the-art approaches use a two-stage pipeline: pretrain a vision-based policy in high-fidelity simulation (Isaac Sim with AeroGym or Gazebo with PX4 SITL), then fine-tune with 500-2,000 real-world flight episodes. Kim et al. (ICRA 2024) demonstrated that 1,000 real teleoperated grasping flights — collected via a VR headset controlling a hexarotor with a magnetic gripper — enabled robust outdoor package pickup in winds up to 15 km/h. The key insight is that real aerial data must capture the full spectrum of disturbance conditions (calm, gusty, sustained crosswind) and lighting (dawn, noon, dusk, overcast) to build a robust policy. Controlled indoor data alone is insufficient for outdoor deployment.",
        "Multi-agent aerial manipulation is an emerging frontier. Transporting large or heavy objects with multiple cooperating drones requires coordination data: cable tension profiles, formation geometry logs, and synchronized trajectory data across all agents. The LARICS group (University of Zagreb) collected multi-UAV cooperative transport datasets with up to four drones carrying a shared payload via cables. These datasets require microsecond-level time synchronization across all platforms and annotations for formation quality, cable sag estimation, and payload swing damping — annotation categories that do not exist in single-robot datasets.",
      ],
    },
    {
      type: "prose",
      heading: "Sensor Stack and Collection Methodology for Aerial Manipulation Data",
      paragraphs: [
        "The sensor configuration for aerial manipulation data collection is more complex than ground robotics because of the need to capture both manipulation state and flight state simultaneously. The core stack includes: onboard RGB cameras (minimum one forward-facing and one downward-facing, ideally global shutter to avoid rolling shutter artifacts during rapid attitude changes), an IMU sampling at 200 Hz or higher (the PX4 flight controller natively logs at 250 Hz), GPS-RTK for outdoor positioning with centimeter accuracy (required for delivery tasks but not indoor inspection), a 6-axis force/torque sensor between the arm and the gripper for contact tasks, gripper servo positions and current draw, and motor RPM or ESC telemetry from all rotors. For contact inspection, add the inspection sensor output (ultrasonic thickness readings, thermal camera frames). All sensors must be temporally synchronized to a common clock — on PX4-based systems, this is achieved through the uORB message bus with hardware timestamping.",
        "Collection environments fall into four categories. Indoor flight arenas with motion capture (OptiTrack, Vicon) provide millimeter-accurate ground truth pose at 120-360 Hz, making them ideal for policy training where precise end-effector trajectories matter. These arenas should be at least 10 m x 10 m x 5 m to allow realistic approach trajectories. Outdoor open fields provide natural wind disturbances but require GPS-RTK for positioning. Urban delivery environments add obstacles (mailboxes, porches, vehicles) and realistic drop-off surfaces. Infrastructure inspection sites (bridges, cell towers, building facades) provide the surface textures, geometries, and access constraints that inspection policies must handle.",
        "Teleoperation for aerial manipulation is challenging because the operator must simultaneously fly the drone and control the arm/gripper. The preferred approach is split control: one operator flies the drone using a standard RC transmitter or FPV goggles while a second operator controls the arm via a SpaceMouse or VR controller. Alternatively, the drone can fly autonomously to a pre-specified waypoint (using GPS or visual servoing), and the operator controls only the manipulation. This decoupled approach produces cleaner manipulation demonstrations and is the protocol used by most labs collecting aerial grasping data. Each episode captures: the full flight trajectory from takeoff to landing, the arm joint trajectory, gripper commands, all sensor streams, and metadata including wind speed (from a ground anemometer), ambient light level, and payload weight.",
        "Annotation requirements for aerial manipulation data go beyond standard manipulation labels. Each episode needs: approach phase labels (transit, approach, hover-stabilize, reach, grasp, retract, transit-out), wind disturbance classification (calm, light gust, sustained crosswind, turbulent), flight stability metrics (maximum attitude deviation during manipulation, position hold error in meters), grasp quality (success/failure, force at contact, slip detection), and task-specific labels (for delivery: landing accuracy in centimeters; for inspection: contact duration and force profile quality; for perching: perch stability duration). Claru's protocol applies automated flight log analysis to extract stability metrics and human annotation for task-level quality assessments, with 25% spot-verification and inter-annotator agreement tracking.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets and Platforms for Aerial Manipulation",
      columns: ["Dataset / Platform", "Year", "Scale", "Task Domain", "Sensor Stack", "Availability"],
      rows: [
        { "Dataset / Platform": "AEROARMS", "Year": "2018", "Scale": "~200 flights", "Task Domain": "Valve turning, pipe inspection", "Sensor Stack": "RGB + F/T + IMU", "Availability": "Partial (EU project)" },
        { "Dataset / Platform": "Flightmare Sim", "Year": "2020", "Scale": "Unlimited sim", "Task Domain": "Grasping, navigation", "Sensor Stack": "Rendered RGB + state", "Availability": "Open source" },
        { "Dataset / Platform": "AeroGym (Isaac Sim)", "Year": "2023", "Scale": "Unlimited sim", "Task Domain": "Aerial manipulation RL", "Sensor Stack": "Rendered RGB-D + state", "Availability": "Open source" },
        { "Dataset / Platform": "ETH Aerial Grasp", "Year": "2024", "Scale": "~1K flights", "Task Domain": "Outdoor package pickup", "Sensor Stack": "RGB + IMU + GPS + gripper", "Availability": "Limited release" },
        { "Dataset / Platform": "Claru Custom", "Year": "2026", "Scale": "1K-10K+ flights", "Task Domain": "Full aerial manipulation", "Sensor Stack": "RGB + IMU + F/T + GPS + gripper", "Availability": "Built to spec" },
      ],
    },
    {
      type: "prose",
      heading: "Sim-to-Real Considerations for Aerial Manipulation",
      paragraphs: [
        "Simulation plays a larger role in aerial manipulation than in ground robotics because real flight data is expensive (battery life limits sessions to 10-20 minutes), risky (crashes destroy hardware), and slow to collect (regulatory approvals, weather windows). However, the sim-to-real gap is also larger due to several factors unique to aerial systems. Rotor wash — the downward airflow from propellers — affects lightweight objects on the ground in ways that are computationally expensive to simulate accurately. Ground effect, which increases lift when the drone is within one rotor diameter of the surface, changes the vehicle dynamics during pickup and delivery tasks. Wind turbulence near structures (buildings, bridges) creates complex flow fields that CFD can approximate but not reproduce in real time. And motor response latency on real ESCs (5-20 ms) introduces dynamics that idealized models ignore.",
        "The practical approach is structured domain randomization in simulation combined with real-world fine-tuning. In simulation, randomize: wind magnitude (0-20 km/h) and direction, motor response delay (5-30 ms), payload mass (0.5x to 2x nominal), camera position and orientation (to account for vibration-induced shifts), and lighting conditions. Collect 50,000-100,000 simulated episodes with this randomization, then fine-tune the policy with 1,000-3,000 real flights. The real flights should specifically target the conditions where simulation is weakest: gusty wind, low-altitude ground effect, and contact with real-world surfaces of varying compliance. This hybrid approach reduces the real-data requirement by 5-10x compared to training from scratch on real flights.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "ollero-aeroarms-2018", title: "The AEROARMS Project: Aerial Robots with Advanced Manipulation Capabilities for Inspection and Maintenance", authors: "Ollero et al.", venue: "IEEE Robotics and Automation Magazine 2018", year: 2018, url: "https://doi.org/10.1109/MRA.2018.2852789" },
        { id: "song-flightmare-2020", title: "Flightmare: A Flexible Quadrotor Simulator", authors: "Song et al.", venue: "CoRL 2020", year: 2020, url: "https://arxiv.org/abs/2009.00563" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "team-octo-2024", title: "Octo: An Open-Source Generalist Robot Policy", authors: "Octo Model Team", venue: "arXiv 2405.12213", year: 2024, url: "https://arxiv.org/abs/2405.12213" },
        { id: "ruggiero-aerial-manip-2018", title: "Aerial Manipulation: A Literature Review", authors: "Ruggiero et al.", venue: "IEEE Robotics and Automation Letters 2018", year: 2018, url: "https://doi.org/10.1109/LRA.2018.2808541" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many flight episodes are needed for an aerial manipulation policy?",
      answer: "For a single task (e.g., package pickup from a flat surface) with a sim-pretrained policy, 500-1,000 real flight episodes provide effective fine-tuning. For a multi-task aerial manipulation policy covering pickup, delivery, and inspection, expect 3,000-10,000 real episodes across all task types and wind conditions. Each episode is short (30-120 seconds of manipulation-relevant flight), so 1,000 episodes represent roughly 15-30 hours of flight time. The key cost driver is battery swaps and charging — budget for 3-5 batteries per collection session with 15-minute flight endurance each.",
    },
    {
      question: "What sensor modalities are essential for aerial manipulation data?",
      answer: "The minimum viable stack is onboard RGB camera (global shutter preferred), IMU at 200+ Hz, and gripper state (servo position and contact detection). For outdoor tasks, add GPS-RTK for centimeter-level positioning. For contact inspection, add a 6-axis force/torque sensor between the arm mount and the gripper. Motor RPM telemetry from ESCs is valuable for learning disturbance rejection. All sensors must be hardware-timestamped and synchronized to within 1 ms — aerial dynamics evolve fast enough that 5 ms desynchronization between IMU and camera creates meaningful label noise.",
    },
    {
      question: "How do you handle wind variability in aerial manipulation datasets?",
      answer: "Wind is the single most important diversity axis for outdoor aerial manipulation. Collect data across a structured wind matrix: calm (0-5 km/h), moderate (5-15 km/h), and gusty (15-25 km/h), with each category representing at least 20% of total episodes. Use a ground-based anemometer (sampling at 1 Hz or higher) to log wind speed and direction for each episode. Indoor data collected in flight arenas can be augmented with artificial wind from industrial fans at known positions and velocities, providing controllable disturbance conditions for systematic evaluation.",
    },
    {
      question: "Can simulation replace real flight data for aerial manipulation?",
      answer: "Simulation is essential for pretraining but cannot fully replace real data. The three biggest sim-to-real gaps in aerial manipulation are: rotor wash effects on objects (especially lightweight packages), ground effect during low-altitude operations (within 1 rotor diameter of surfaces), and wind turbulence near structures. Empirically, sim-only policies achieve 40-60% lower success rates than sim-pretrained plus real-fine-tuned policies. The practical approach is 50K-100K simulated episodes with domain randomization, fine-tuned with 1K-3K real flights targeting the conditions simulation models poorly.",
    },
    {
      question: "What data format should I request for aerial manipulation datasets?",
      answer: "RLDS format is recommended for compatibility with foundation models and enables efficient streaming of multi-modal episodes. Each episode should contain separate channels for visual observations (RGB frames at 30 Hz), high-rate state data (IMU at 200 Hz, proprioception at 50 Hz), and discrete events (gripper open/close, contact detected). HDF5 works well for single-lab use. Include the flight controller log (PX4 .ulg or ArduPilot .bin) alongside the processed data so researchers can extract additional telemetry channels as needed.",
    },
    {
      question: "What regulatory requirements apply to aerial manipulation data collection?",
      answer: "Aerial manipulation data collection falls under national aviation authority regulations (FAA in the US, EASA in Europe, Transport Canada). In the US, operations typically require a Part 107 Remote Pilot Certificate for the pilot, and manipulation payloads that increase total weight above 25 kg may require a waiver for heavier-than-normal UAS operations. Indoor operations in enclosed flight arenas are generally exempt from aviation authority oversight but may require facility safety approvals. Outdoor operations near people require Part 107.39 compliance (operations over people), which depends on the drone's kinetic energy category. For operations beyond visual line of sight — relevant for delivery and inspection tasks — a Part 107.31 waiver is needed, which can take 3-6 months to obtain. Claru maintains Part 107 certified pilots for all outdoor aerial collection and holds standing waivers for heavier-than-normal operations and operations over people at our designated collection sites. We handle all regulatory compliance so that the client receives data without navigating the aviation approval process.",
    },
    {
      question: "How do you ensure safety during aerial manipulation data collection?",
      answer: "Aerial manipulation poses unique safety risks from both the flying platform and the manipulation payload. Our safety protocol includes multiple layers: (1) pre-flight checklists covering battery voltage, motor health, gripper functionality, and GPS lock quality; (2) geofencing that confines the drone to the designated collection volume with automatic return-to-home if boundaries are breached; (3) a dedicated safety pilot with manual override authority on a separate control link from the data collection system; (4) manipulation-specific safeguards including maximum payload weight limits enforced in software, gripper release commands that trigger automatic altitude hold, and automatic landing if gripper failure is detected; (5) exclusion zones around all personnel, enforced by physical barriers and spotters. For indoor flight arenas, we additionally use netting enclosures rated for the maximum kinetic energy of the platform. All collection sessions begin with an unloaded test flight to verify vehicle health before proceeding with manipulation tasks.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Aerial Manipulation Data",
  ctaDescription: "Tell us your target platform (multirotor configuration, gripper type), operating environments (indoor/outdoor, wind conditions), and task requirements. We will design a flight collection plan covering the disturbance diversity and sensor stack your policy needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "sim-to-real-gap"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB (global shutter) + IMU (200 Hz) + GPS-RTK + F/T sensor + gripper state + motor RPM",
    volumeRange: "1K-10K flight-manipulation episodes",
    temporalResolution: "30 Hz video, 200 Hz IMU, 50 Hz flight controller, 100 Hz F/T sensor",
    keyAnnotations: ["Wind disturbance classification (calm/gust/crosswind)", "Flight phase labels (approach/hover/reach/grasp/retract)", "Grasp timing and contact force profiles", "Flight stability metrics (attitude deviation, position hold error)", "Payload weight and center-of-mass shift"],
  },
  relevantModels: ["Sim-pretrained aerial grasping RL", "Coordinated flight-grasp policies", "Contact inspection models", "Multi-agent aerial transport controllers", "Diffusion Policy (adapted for aerial)"],
  environmentTypes: ["Indoor flight arena (motion capture)", "Outdoor open field", "Urban delivery environments", "Infrastructure inspection sites (bridges, towers)", "Agricultural canopy"],
  keyPapers: [
    { id: "ollero-aeroarms-2018", title: "The AEROARMS Project: Aerial Robots with Advanced Manipulation Capabilities for Inspection and Maintenance", authors: "Ollero et al.", venue: "IEEE Robotics and Automation Magazine 2018", year: 2018, url: "https://doi.org/10.1109/MRA.2018.2852789" },
    { id: "song-flightmare-2020", title: "Flightmare: A Flexible Quadrotor Simulator", authors: "Song et al.", venue: "CoRL 2020", year: 2020, url: "https://arxiv.org/abs/2009.00563" },
    { id: "ruggiero-aerial-manip-2018", title: "Aerial Manipulation: A Literature Review", authors: "Ruggiero et al.", venue: "IEEE Robotics and Automation Letters 2018", year: 2018, url: "https://doi.org/10.1109/LRA.2018.2808541" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru collects aerial manipulation data using calibrated multirotor platforms equipped with global-shutter cameras, 200 Hz IMUs, GPS-RTK receivers, 6-axis force/torque sensors, and gripper state logging. Our collection protocol covers structured wind diversity (calm, moderate, gusty conditions logged via ground anemometer), multiple environment types (indoor arenas with motion capture ground truth, outdoor fields, urban delivery sites, and infrastructure inspection locations), and split teleoperation control (dedicated pilot plus manipulation operator). Each episode includes flight phase labels, wind classification, stability metrics, grasp quality assessments, and task-specific annotations — all verified through automated flight log analysis and 25% human spot-verification. We deliver in RLDS, HDF5, or custom formats with full sensor calibration, flight controller logs, and stratified splits by environment, wind condition, and task type.",
};

export default data;
