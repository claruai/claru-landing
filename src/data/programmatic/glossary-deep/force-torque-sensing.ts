import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "force-torque-sensing",
  termSlug: "force-torque-sensing",
  category: "data-modalities",
  metaTitle: "Force-Torque Sensing — Definition & Training Data | Claru",
  metaDescription: "Force-torque sensing measures contact forces and moments at robot joints or end-effectors. Learn how F/T data enables contact-rich manipulation policies.",
  primaryKeyword: "force-torque sensing",
  secondaryKeywords: ["F/T sensor robotics", "force feedback robot learning", "tactile force measurement", "contact force data"],
  canonicalPath: "/glossary/force-torque-sensing",
  h1: "Force-Torque Sensing: Measuring Contact Forces for Robot Manipulation",
  heroSubtitle: "Force-torque (F/T) sensing measures the six-dimensional forces and moments (three linear forces, three rotational torques) at a robot's joints or end-effector. This data modality is essential for contact-rich manipulation tasks where vision alone cannot determine whether a grasp is secure, an insertion is aligned, or a surface is being contacted with appropriate pressure.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Force-Torque Sensing", href: "/glossary/force-torque-sensing" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Force-Torque Sensing?",
      paragraphs: [
        "Force-torque sensing refers to the measurement of the six components of generalized force at a point on a robot: three linear forces (Fx, Fy, Fz) and three rotational torques (Tx, Ty, Tz). These sensors are typically mounted between the robot's wrist and its end-effector (wrist-mounted F/T sensors) or integrated into the robot's joints (joint torque sensors). The combined 6-axis measurement provides a complete picture of how forces are distributed at the contact interface.",
        "In robot learning, F/T data serves as a critical observation modality for tasks that involve physical contact. When a robot inserts a peg into a hole, the lateral forces indicate misalignment direction and magnitude. When a robot grasps a fragile object, the normal force indicates grip security without visual occlusion. When a robot wipes a surface, the normal force determines whether adequate pressure is being applied. These physical quantities cannot be reliably inferred from vision alone — they must be directly measured.",
        "Modern collaborative robots like the Franka Emika Panda include joint torque sensors at every joint, providing estimated external forces at the end-effector through the robot's dynamics model. Dedicated wrist F/T sensors (ATI, OnRobot, Robotiq) offer higher accuracy and faster update rates (up to 10 kHz) than joint-torque-derived estimates. For learning-based manipulation, F/T data is typically logged at 100-1000 Hz alongside camera images (30 Hz) and robot proprioception (100-1000 Hz).",
      ],
    },
    {
      type: "stats",
      heading: "Force-Torque Sensing at a Glance",
      stats: [
        { value: "6-axis", label: "Fx, Fy, Fz, Tx, Ty, Tz" },
        { value: "10 kHz", label: "Max sampling rate (dedicated)" },
        { value: "0.01 N", label: "Resolution of top sensors" },
        { value: "ATI", label: "Leading F/T sensor manufacturer" },
        { value: "Franka", label: "Built-in joint torque sensing" },
        { value: "100 Hz+", label: "Typical logging rate for ML" },
      ],
    },
    {
      type: "prose",
      heading: "F/T Data in Robot Learning Pipelines",
      paragraphs: [
        "Incorporating F/T data into learned manipulation policies requires careful data pipeline design. The raw sensor signal is often noisy and includes gravitational and inertial components that must be compensated. Gravity compensation removes the weight of the end-effector and any attached tool from the measurement, isolating the contact forces. Inertial compensation accounts for dynamic effects during fast motions. Both compensations require accurate knowledge of the end-effector mass, center of gravity, and the robot's acceleration.",
        "For training manipulation policies, F/T data is typically synchronized with visual observations and action labels at a common timestep frequency. Since F/T sensors operate at much higher frequencies than cameras, the F/T data is usually downsampled or windowed. A common approach is to provide the policy with a short history of F/T measurements (e.g., the last 10 samples at 100 Hz, covering 100 ms) at each camera frame, giving the policy both the current force state and recent force dynamics.",
        "The impact of including F/T data varies dramatically by task. For tasks where contact forces are the primary feedback signal — insertion, assembly, polishing, palpation — adding F/T observations can improve policy success rates by 30-50% compared to vision-only policies. For tasks where visual feedback is sufficient — bin picking, sorting, stacking — F/T data provides marginal improvement. Understanding which tasks benefit from F/T sensing guides data collection investments.",
      ],
    },
    {
      type: "comparison-table",
      heading: "F/T Sensor Types Compared",
      description: "Different force-torque sensing approaches for robot manipulation, with trade-offs in accuracy, cost, and integration complexity.",
      columns: ["Sensor Type", "Axes", "Sample Rate", "Cost", "Integration"],
      rows: [
        { "Sensor Type": "Wrist-mounted F/T (ATI)", Axes: "6", "Sample Rate": "Up to 10 kHz", Cost: "$3K-10K", Integration: "Between wrist and tool" },
        { "Sensor Type": "Joint torque sensors", Axes: "7 (per joint)", "Sample Rate": "1 kHz", Cost: "Built into robot", Integration: "Native (Franka, KUKA iiwa)" },
        { "Sensor Type": "Tactile skin arrays", Axes: "Normal per taxel", "Sample Rate": "100-1000 Hz", Cost: "$1K-5K", Integration: "Fingertip or palm" },
        { "Sensor Type": "Current-based estimation", Axes: "N per joint", "Sample Rate": "1 kHz", Cost: "No extra hardware", Integration: "Software only (less accurate)" },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Collection with F/T Sensors",
      paragraphs: [
        "Collecting F/T-rich training data introduces specific requirements beyond standard visual demonstration collection. Sensor calibration must be performed before each data collection session — this involves measuring the sensor bias (zero offset under no-load conditions) and verifying gravity compensation parameters. Uncalibrated F/T data can have systematic biases of 1-5 N, which is significant for precision tasks where contact forces are in the 0.5-10 N range.",
        "Temporal synchronization between F/T data and other modalities (cameras, joint encoders) must be precise. Force events during contact occur on millisecond timescales — a 50 ms synchronization error means the policy learns the wrong association between visual observations and contact forces. Hardware-level synchronization using shared clocks or trigger signals is preferred over software-level timestamping, which can introduce variable latency.",
        "Claru's data collection pipelines include calibrated F/T sensing for contact-rich manipulation tasks. Each dataset includes synchronized 6-axis force-torque measurements at 100+ Hz alongside calibrated camera streams and robot proprioception, with documented calibration procedures and sensor specifications. This enables direct consumption by multi-modal manipulation policies that leverage force feedback for contact-rich tasks.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "lee-making-sense-2019",
          title: "Making Sense of Vision and Touch: Self-Supervised Learning of Multimodal Representations for Contact-Rich Tasks",
          authors: "Lee et al.",
          venue: "ICRA 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1907.13098",
        },
        {
          id: "luo-robust-2024",
          title: "Multisensory Robot Manipulation — Learning from Diverse Sensory Modalities",
          authors: "Luo et al.",
          venue: "arXiv 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.10708",
        },
        {
          id: "haddadin-robot-2017",
          title: "Robot Collisions: A Survey on Detection, Isolation, and Identification",
          authors: "Haddadin et al.",
          venue: "IEEE T-RO 2017",
          year: 2017,
          url: "https://ieeexplore.ieee.org/document/7803286",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Do I need a dedicated F/T sensor or can I use joint torque sensing?",
      answer: "For most learning-based manipulation tasks, joint torque sensing (available on robots like Franka Panda and KUKA iiwa) provides sufficient accuracy. Dedicated wrist-mounted F/T sensors offer higher accuracy and faster response times, which matter for precision assembly and delicate manipulation. If your task involves contact forces below 1 N or requires sub-millisecond force feedback, a dedicated sensor is recommended.",
    },
    {
      question: "At what frequency should F/T data be logged for robot learning?",
      answer: "For most manipulation learning applications, 100-500 Hz is sufficient. This captures the dynamics of typical contact events (grasping, insertion, wiping) while keeping dataset sizes manageable. Tasks with very fast contact dynamics (hammering, catching) may benefit from 1 kHz logging. Logging above 1 kHz is rarely needed for learning applications.",
    },
    {
      question: "Which manipulation tasks benefit most from F/T data?",
      answer: "Tasks with significant contact phases benefit most: peg-in-hole insertion (30-50% improvement), assembly (20-40%), surface finishing/polishing (25-35%), and deformable object manipulation (15-25%). Tasks that are primarily visual — bin picking, sorting by color, open-space reaching — show marginal improvement from F/T data (0-5%).",
    },
    {
      question: "How do you handle F/T sensor noise in training data?",
      answer: "Standard practice includes gravity compensation (removing end-effector weight), low-pass filtering (typically 10-50 Hz cutoff for learning applications), and bias subtraction (recording the zero-load baseline before each session). For learning pipelines, normalizing F/T values to zero-mean unit-variance per axis prevents force channels from being dominated by gravity or bias artifacts.",
    },
  ],
  ctaHeading: "Need Force-Torque Training Data?",
  ctaDescription: "Claru provides synchronized multi-modal datasets with calibrated F/T sensing for contact-rich manipulation tasks.",
  relatedGlossaryTerms: ["proprioceptive-data", "haptic-feedback", "contact-rich-manipulation", "sensor-fusion", "dexterous-manipulation"],
  relatedGuidePages: ["how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "Force-torque (F/T) sensing is the measurement of the six-dimensional generalized force vector at a point on a robot's kinematic chain. The six components consist of three linear forces (Fx, Fy, Fz) measuring push/pull along each Cartesian axis, and three torques (Tx, Ty, Tz) measuring rotational moments about each axis. This measurement provides a complete description of the mechanical interaction between the robot and its environment at the sensing point.\n\nF/T sensing is fundamental to contact-rich manipulation — any task where the robot must control or respond to physical forces rather than simply position its end-effector in free space. Insertion tasks require detecting and responding to contact forces to achieve alignment. Assembly tasks require monitoring forces to verify component mating. Surface treatment tasks (polishing, cleaning, painting) require maintaining consistent contact pressure. In all these cases, visual observation alone cannot provide the necessary feedback because forces are not directly observable from images.\n\nThe two primary sensing approaches are dedicated F/T sensors (strain-gauge-based devices mounted at the wrist, manufactured by companies like ATI Industrial Automation and OnRobot) and joint torque sensors (integrated into each robot joint, as in the Franka Emika Panda and KUKA LBR iiwa). Dedicated sensors offer higher accuracy and bandwidth but add cost and mechanical complexity. Joint torque sensors are less accurate for end-effector force estimation due to model uncertainties in the robot's dynamics but require no additional hardware.",
  historicalContext: "Force-torque sensing in robotics predates the modern era of learned policies by decades. The first 6-axis F/T sensors for robotics were developed in the 1970s and 1980s, primarily for force-controlled assembly in manufacturing. Raibert and Craig (1981) formalized hybrid position/force control, which used F/T measurements to switch between position control (in free space) and force control (during contact). This framework dominated industrial robotics for two decades.\n\nThe integration of F/T data into learned manipulation policies began with the resurgence of deep learning in robotics. Lee et al. (2019) demonstrated that self-supervised learning from vision and touch (including F/T measurements) produced better manipulation policies than either modality alone. Subsequent work by multiple groups confirmed that multi-modal policies incorporating F/T data outperform vision-only policies on contact-rich tasks by significant margins.\n\nThe emergence of collaborative robots with built-in joint torque sensing (Franka Panda in 2017, KUKA LBR iiwa in 2013) democratized access to force-aware manipulation. Previously, adding F/T sensing required purchasing expensive dedicated sensors. Now, many research labs have force-sensing capability built into their standard research platforms, leading to a rapid increase in datasets and policies that include F/T observations.",
  practicalImplications: "For teams building manipulation datasets that include F/T sensing, the most critical practical concern is calibration. An uncalibrated F/T sensor — or one where the gravity compensation parameters are incorrect — introduces systematic biases that corrupt the learned policy. Best practice is to perform a calibration routine at the start of each data collection session: record sensor readings in multiple static orientations to estimate the tool mass, center of gravity, and sensor bias.\n\nData storage for F/T measurements is straightforward but requires attention to synchronization. At 500 Hz with 6 channels of 32-bit float data, a 30-second demonstration generates approximately 360 KB of F/T data — negligible compared to camera images. The challenge is precise temporal alignment with visual frames (30 Hz) and action labels (10-100 Hz). Hardware synchronization via shared triggers or timestamps is strongly recommended.\n\nClaru's data collection infrastructure includes calibrated F/T sensing across our fleet of robot platforms. Each dataset includes raw and gravity-compensated F/T streams, calibration metadata (tool mass, center of gravity, sensor offset), and hardware-synchronized timestamps. This eliminates the sensor calibration and synchronization burden from downstream teams training contact-rich manipulation policies.",
  commonMisconceptions: [
    {
      misconception: "Vision-based policies can infer contact forces from deformation observations.",
      correction: "While large deformations (bending, squishing) are visible, the contact forces relevant to manipulation (0.1-50 N) typically produce sub-millimeter deformations on rigid objects that are invisible to standard cameras. Direct F/T measurement provides ground-truth force information that no vision system can reliably recover for rigid-body contact.",
    },
    {
      misconception: "Higher F/T sensor sample rates always produce better learned policies.",
      correction: "For learning-based manipulation, the bottleneck is typically the camera frame rate (30 Hz), not the F/T sample rate. Logging F/T at 10 kHz when the policy only processes observations at 30 Hz wastes storage without improving policy quality. A 100-500 Hz F/T log with proper downsampling to the policy's inference rate is optimal for most applications.",
    },
    {
      misconception: "All robot arms have built-in force-torque sensing.",
      correction: "Many popular robot platforms — Universal Robots UR5/UR10, Kinova Gen3, xArm — do not have direct joint torque sensors. They can estimate external forces from motor current, but this is significantly less accurate than dedicated torque sensors. Only a few platforms (Franka Panda, KUKA iiwa, Sawyer) include direct joint torque sensing.",
    },
  ],
  keyPapers: [
    {
      id: "lee-making-sense-2019",
      title: "Making Sense of Vision and Touch: Self-Supervised Learning of Multimodal Representations for Contact-Rich Tasks",
      authors: "Lee et al.",
      venue: "ICRA 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1907.13098",
    },
    {
      id: "luo-robust-2024",
      title: "Multisensory Robot Manipulation — Learning from Diverse Sensory Modalities",
      authors: "Luo et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.10708",
    },
    {
      id: "haddadin-robot-2017",
      title: "Robot Collisions: A Survey on Detection, Isolation, and Identification",
      authors: "Haddadin et al.",
      venue: "IEEE T-RO 2017",
      year: 2017,
      url: "https://ieeexplore.ieee.org/document/7803286",
    },
  ],
  claruRelevance: "Claru's multi-modal data collection pipelines include calibrated force-torque sensing for contact-rich manipulation tasks. Each demonstration includes synchronized 6-axis F/T measurements at 100+ Hz alongside calibrated camera streams and robot proprioception, ready for direct consumption by multi-modal policy training.",
};

export default data;
