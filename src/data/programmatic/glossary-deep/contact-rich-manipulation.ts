import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "contact-rich-manipulation",
  termSlug: "contact-rich-manipulation",
  category: "robotics-fundamentals",
  metaTitle: "Contact-Rich Manipulation — Definition & Training Data | Claru",
  metaDescription: "Contact-rich manipulation involves tasks where sustained, force-sensitive contact between the robot and objects is essential. Learn about tactile data requirements, sim-to-real challenges, and training data strategies for peg insertion, wiping, and assembly.",
  primaryKeyword: "contact-rich manipulation",
  secondaryKeywords: ["contact manipulation robotics", "force-based manipulation", "tactile manipulation", "peg insertion robot", "assembly manipulation"],
  canonicalPath: "/glossary/contact-rich-manipulation",
  h1: "Contact-Rich Manipulation: Force-Sensitive Robot Skills and Their Data Requirements",
  heroSubtitle: "Contact-rich manipulation encompasses robot tasks where sustained, precisely modulated physical contact is the core mechanism of success — peg insertion, surface wiping, gear meshing, cable routing, and assembly. These tasks demand multi-modal sensing (vision + force/torque + tactile) and training data that captures the subtle force dynamics that purely visual demonstrations miss.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Contact-Rich Manipulation", href: "/glossary/contact-rich-manipulation" },
  ],
  sections: [],
  faqs: [
    {
      question: "Why is contact-rich manipulation harder than pick-and-place for robot learning?",
      answer: "Pick-and-place is largely a free-space motion problem — the robot moves through unobstructed space, grasps an object, and places it. Contact occurs only briefly during grasping. Contact-rich tasks, by contrast, require sustained interaction where the robot must simultaneously control position and force throughout the task. A peg insertion requires aligning within sub-millimeter tolerance while applying 2-10N of downward force and detecting jamming through force feedback. The physics of sustained contact introduces friction, compliance, stick-slip transitions, and deformation that are extremely difficult to simulate accurately. This means contact-rich policies trained in simulation transfer poorly to real hardware — the sim-to-real gap for contact dynamics is 5-10x larger than for free-space motion, making real-world demonstration data essential.",
    },
    {
      question: "What sensors are needed for contact-rich manipulation training data?",
      answer: "Effective contact-rich manipulation data requires three sensor modalities beyond standard RGB cameras. First, a wrist-mounted force/torque (F/T) sensor measuring 6-axis forces and torques at 100-1000 Hz, which captures the contact dynamics invisible to cameras. Second, joint torque sensors (available on torque-controlled robots like Franka Panda) that provide proprioceptive feedback about contact forces distributed along the arm. Third, tactile sensors like GelSight, DIGIT, or BioTac mounted on the fingertips, which provide high-resolution local contact geometry — crucial for tasks like USB insertion where sub-millimeter alignment is needed. In practice, F/T data is the minimum requirement; adding tactile sensing improves success rates by 15-30% on high-precision insertion tasks according to work by Calandra et al. (2018) and subsequent studies.",
    },
    {
      question: "How many demonstrations are needed for contact-rich manipulation tasks?",
      answer: "Contact-rich tasks generally require 3-5x more demonstrations than equivalent free-space tasks because the relevant variation is in force profiles, not just trajectories. A simple peg insertion with fixed peg and hole positions might need 200-500 demonstrations to capture the range of alignment strategies and force modulation patterns. Variable-position insertion requires 1,000-3,000 demonstrations. Multi-step assembly tasks (gear meshing, snap-fit connectors) can require 5,000+ demonstrations. The demonstrations must be collected by skilled operators who can feel the force feedback through the teleoperation device — haptic-enabled teleoperation systems like the Gello or bilateral force-reflecting interfaces produce significantly better contact-rich demonstrations than position-only teleoperation devices.",
    },
    {
      question: "Can contact-rich manipulation be learned entirely in simulation?",
      answer: "Not reliably with current simulation technology. Contact dynamics simulation involves computing friction cones, deformation, and collision geometry at every timestep, and small errors compound rapidly. MuJoCo and Isaac Sim use simplified contact models (soft contact with penetration, convex hull approximations) that diverge from real-world behavior during sustained contact. Domain randomization over friction, stiffness, and damping parameters helps but cannot fully bridge the gap. The most successful approaches use sim-to-real with residual policy learning: train a base policy in simulation, deploy on the real robot, and train a small residual correction network on 50-200 real-world demonstrations that adjusts the sim-trained policy's outputs based on real force feedback. This hybrid approach achieves 80-95% success rates where pure sim-to-real achieves 30-60%.",
    },
    {
      question: "What data format is best for contact-rich manipulation datasets?",
      answer: "Contact-rich datasets require higher temporal resolution than free-space manipulation datasets because force dynamics change rapidly during contact transitions. The recommended format stores observations and actions at 50 Hz minimum (compared to 10 Hz for pick-and-place), with force/torque data at the sensor's native rate (typically 500-1000 Hz) stored in a separate high-frequency channel. HDF5 or zarr containers with hierarchical groups work well — one group per timestep for low-frequency visual observations, a separate group for high-frequency force data, with timestamps enabling precise alignment. Each demonstration should also store a contact phase label (approach, contact, manipulation, release) to enable phase-aware training where the policy architecture or loss function adapts based on whether the robot is in free-space or contact mode.",
    },
  ],
  ctaHeading: "Need Force-Annotated Demonstration Data?",
  ctaDescription: "Claru collects contact-rich manipulation demonstrations with synchronized force/torque, tactile, and visual data. Tell us your assembly or insertion task and we will deliver multi-modal datasets.",
  relatedGlossaryTerms: ["dexterous-manipulation", "manipulation-trajectory", "sim-to-real-gap", "proprioceptive-data"],
  relatedGuidePages: ["how-to-build-a-contact-rich-manipulation-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "Contact-rich manipulation refers to the class of robot manipulation tasks where the primary skill involves sustained, force-sensitive physical contact between the robot's end-effector (or fingers) and objects or surfaces in the environment. Unlike pick-and-place — where contact is brief and binary (grasp or release) — contact-rich tasks require continuous modulation of applied forces and torques throughout the task execution, often with sub-millimeter positional precision.\n\nCanonical examples include peg-in-hole insertion (tolerances of 0.1-2mm, requiring 2-15N force with compliance), surface wiping (maintaining 1-5N normal force while following a curved surface), gear meshing (aligning teeth within 0.5mm while applying rotational torque), cable routing (managing deformable object dynamics under friction), and snap-fit assembly (applying precise force profiles to overcome detent resistance). Each task involves a complex interplay between position control and force control that cannot be captured by visual observations alone.\n\nThe technical challenge is that contact introduces discontinuous dynamics. The transition from free-space motion (no contact forces) to constrained motion (contact forces balanced against environmental reaction forces) is a hybrid dynamical system with discrete mode switches. A peg approaching a hole transitions through at least four contact modes: free-space, single-point contact (chamfer), two-point contact (alignment), and fully constrained insertion. Each mode has different effective dynamics, and the policy must recognize and adapt to each transition.\n\nFrom a data perspective, contact-rich manipulation requires multi-modal observations. RGB cameras capture the scene geometry and object positions, but cannot sense forces. A 6-axis force/torque sensor mounted at the robot's wrist provides real-time measurement of contact forces (Fx, Fy, Fz) and torques (Tx, Ty, Tz) at 100-1000 Hz. Tactile sensors on the fingertips provide local contact geometry — pressure distribution, slip detection, and contact area. Joint torque sensors provide proprioceptive feedback about forces distributed along the arm. Training data for contact-rich tasks must include all relevant modalities synchronized to a common timeline with sub-millisecond alignment accuracy.",
  historicalContext: "Contact-rich manipulation has been studied in robotics since the 1970s, when Whitney (1977) introduced the concept of force control and compliance for assembly tasks. Raibert and Craig (1981) formalized hybrid position/force control, which partitions the task space into position-controlled and force-controlled directions. Mason (1981) developed compliance theory, analyzing how geometric constraints during contact determine the set of possible motions. These classical frameworks established the theoretical foundation but relied on precise geometric models and hand-tuned controllers.\n\nThe late 1990s and 2000s saw impedance control emerge as the dominant paradigm. Hogan (1985) proposed controlling the robot's dynamic relationship to its environment rather than controlling position or force independently. Impedance-controlled robots like the DLR Lightweight Robot and later the Franka Emika Panda made compliant contact manipulation accessible in research labs, providing the hardware platform needed for learning-based approaches.\n\nThe learning-based era began with Levine et al. (2015) applying guided policy search to contact-rich tasks like block insertion. Fazeli et al. (2019) trained contact-rich policies using tactile sensing. The GelSight sensor (Yuan et al., 2017) and DIGIT sensor (Lambeta et al., 2020) made high-resolution tactile data practically available for learning. More recently, Diffusion Policy (Chi et al., 2023) demonstrated strong performance on contact tasks by modeling the multimodal action distribution during contact transitions, and Suomalainen et al. (2022) showed that learning from force demonstrations enables assembly tasks with 0.1mm tolerance — precision that was previously achievable only with specialized jigs and fixtures.",
  practicalImplications: "For teams building contact-rich manipulation systems, the teleoperation device used for demonstration collection is the single most important infrastructure decision. Position-only teleoperation devices (SpaceMouse, keyboard) cannot convey the force feedback that operators need to perform contact tasks skillfully. Bilateral force-reflecting teleoperation systems — where the operator feels a scaled version of the robot's contact forces — produce dramatically better demonstrations. The ALOHA system and Gello provide low-cost haptic-capable options; industrial-grade bilateral systems from Force Dimension or Haption offer higher fidelity but at 10-50x the cost.\n\nForce/torque data quality is critical. F/T sensors drift over time and must be re-zeroed before each demonstration session. Gravity compensation — subtracting the gravitational force/torque of the tool from raw readings — is necessary when the sensor is wrist-mounted and the robot changes orientation during the task. Without proper gravity compensation, the force data contains orientation-dependent artifacts that confuse the learning algorithm. The standard practice is to calibrate tool mass and center of gravity once, then apply real-time compensation using the robot's forward kinematics.\n\nTraining architectures for contact-rich tasks benefit from explicit multi-modal fusion. Concatenating visual and force features before the policy head is the simplest approach but often underweights force information because visual features are higher-dimensional. Cross-attention mechanisms that allow force features to modulate visual attention — or separate policy heads for free-space and contact phases — produce more robust policies. Phase detection (am I in free-space or contact?) can be implemented with a simple threshold on F/T magnitude and serves as a useful auxiliary task during training.\n\nControl frequency matters more for contact-rich tasks than for free-space tasks. Policies should output actions at 20-50 Hz to maintain stable contact. Lower frequencies (5-10 Hz) cause force oscillations as the robot alternately overshoots and undershoots the desired contact force. Higher frequencies (100+ Hz) offer diminishing returns and increase computational requirements. Most teams run the visual encoder at 5-10 Hz and interpolate the action trajectory at 50 Hz using the most recent force observation.",
  commonMisconceptions: [
    {
      misconception: "Vision alone is sufficient for contact-rich manipulation — force sensing is unnecessary overhead.",
      correction: "Vision cannot observe contact forces, friction states, or sub-millimeter alignment. A camera sees a peg touching a hole but cannot distinguish 1N of contact force from 10N, or detect that the peg is jammed rather than sliding. Empirically, adding force/torque observations to vision-only policies improves success rates by 25-40% on insertion tasks (Fazeli et al., 2019). For tasks with tolerances below 1mm, force feedback is not optional — it is the primary sensory channel for the contact phase.",
    },
    {
      misconception: "Contact-rich manipulation requires expensive torque-controlled robots like the Franka Panda.",
      correction: "While torque control enables softer, more compliant contact behavior, position-controlled robots with external F/T sensors and admittance control can perform contact-rich tasks effectively. UR robots, xArm robots, and even low-cost arms with wrist-mounted F/T sensors have been used successfully for insertion, wiping, and assembly tasks. The key requirement is force sensing, not torque control — the two are related but distinct capabilities. Admittance control (reading force, commanding position) achieves 80-90% of the compliance performance of impedance control (commanding torque directly) for most assembly tasks.",
    },
    {
      misconception: "More demonstrations always help for contact-rich tasks.",
      correction: "Unlike free-space tasks where more demonstrations generally help through added diversity, contact-rich demonstrations have a quality floor below which they actively hurt training. Demonstrations where the operator jams the peg, applies excessive force, or takes circuitous alignment paths teach bad contact strategies. In practice, filtering demonstrations by peak force (removing those exceeding 2x the task-appropriate force), task completion time, and trajectory smoothness improves policy success rates by 20-30%. A curated set of 300 high-quality demonstrations outperforms 1,000 unfiltered demonstrations on precision assembly tasks.",
    },
  ],
  keyPapers: [
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "fazeli-contact-2019",
      title: "See, Feel, Act: Hierarchical Learning for Complex Manipulation Skills with Multisensory Fusion",
      authors: "Fazeli et al.",
      venue: "Science Robotics 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1906.02813",
    },
    {
      id: "lambeta-digit-2020",
      title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation",
      authors: "Lambeta et al.",
      venue: "IEEE RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2005.14679",
    },
    {
      id: "yuan-gelsight-2017",
      title: "GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force",
      authors: "Yuan et al.",
      venue: "Sensors 2017",
      year: 2017,
      url: "https://doi.org/10.3390/s17122762",
    },
    {
      id: "suomalainen-assembly-2022",
      title: "A Survey of Robot Manipulation in Contact",
      authors: "Suomalainen et al.",
      venue: "Robotics and Autonomous Systems 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.01200",
    },
  ],
  claruRelevance: "Claru provides multi-modal demonstration data specifically designed for contact-rich manipulation training. Our collection infrastructure includes haptic-enabled teleoperation with bilateral force feedback, wrist-mounted 6-axis F/T sensors recorded at 500 Hz, and synchronized RGB-D cameras at 30 fps. Every contact-rich demonstration includes force/torque data with gravity compensation applied, contact phase annotations (approach/contact/manipulation/release), and quality metrics including peak force, completion time, and trajectory smoothness.\n\nFor teams training insertion, assembly, or surface-following policies, Claru delivers datasets with the multi-modal richness that contact-rich learning requires. Our data pipeline filters demonstrations using force-quality thresholds and operator skill ratings, ensuring that only demonstrations with appropriate force profiles and efficient strategies reach the training set. Datasets ship in HDF5 or zarr format with high-frequency force channels and low-frequency visual channels properly aligned to a common timeline.",
};

export default data;
