import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "door-cabinet-manipulation",
  metaTitle: "Door and Cabinet Manipulation Training Data | Claru",
  metaDescription: "Training data for articulated object manipulation: doors, cabinets, drawers, refrigerators. Demonstrations capturing handle grasping, opening trajectories, and force profiles.",
  primaryKeyword: "door cabinet manipulation training data",
  secondaryKeywords: ["articulated object dataset", "door opening robot data", "cabinet manipulation demonstrations", "drawer pulling robot dataset", "articulated manipulation training", "handle grasping data"],
  canonicalPath: "/training-data/door-cabinet-manipulation",
  h1: "Door & Cabinet Manipulation Training Data",
  heroSubtitle: "Articulated object manipulation datasets — door opening, drawer pulling, cabinet handle grasping, and refrigerator interaction with diverse hardware types and force profiles.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Door & Cabinet Manipulation", href: "/training-data/door-cabinet-manipulation" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Articulated Object Manipulation and Why Is Hardware Diversity the Key?",
      paragraphs: [
        "Door and cabinet manipulation is the task of operating articulated objects — doors with hinges, drawers on rails, cabinets with various handle types, refrigerators with seals, and oven doors with counterbalance springs. Every home, office, and commercial building contains dozens of these objects, making articulated manipulation a prerequisite for any robot operating in human environments. The fundamental challenge is hardware diversity: a lever handle requires a downward press, a knob requires a grasp and twist, a pull handle requires a firm grip, and a push plate requires whole-hand contact — each with different force profiles and approach trajectories.",
        "The manipulation challenge compounds because articulated objects have constrained motion. A cabinet door swings on a hinge with a fixed axis of rotation, but the robot does not know that axis a priori. The robot must discover the articulation model (revolute joint for doors, prismatic joint for drawers) from initial contact and then adapt its trajectory to follow the constraint. Where2Act (Mo et al., 2021) demonstrated that learning where to interact on an articulated object is as important as learning how to interact — predicting actionable contact points from visual observation requires training data spanning the enormous variety of handle designs and mounting positions found in the real world.",
        "Commercial interest is driven by the home robot market (every service robot must open doors and cabinets), retail automation (shelf restocking behind cabinet doors), and healthcare (medication carts, supply closets). The data bottleneck is particularly acute because each hardware configuration (handle type, hinge type, mounting height, opening direction) requires dedicated demonstrations. A kitchen alone may contain 15-20 distinct cabinet configurations, and a production-grade policy must handle all of them.",
        "The problem compounds when you consider that even the same handle type behaves differently depending on mounting context. A lever handle at waist height requires a different approach trajectory than the same lever handle overhead. A drawer pull at floor level requires the robot to crouch, changing the entire reachability and force application geometry. Height-indexed data — demonstrations stratified by the vertical position of the handle relative to the robot's base — is a critical and often overlooked dimension. Without it, policies trained on countertop-height cabinets fail systematically on overhead cabinets and under-counter drawers, despite the underlying handle mechanism being identical.",
      ],
    },
    {
      type: "stats",
      heading: "Articulated Object Data at a Glance",
      stats: [
        { value: "1K-10K", label: "Demos across hardware types" },
        { value: "200 Hz", label: "Force/torque sensing rate" },
        { value: "50+", label: "Handle types in production" },
        { value: "2 types", label: "Articulation models (revolute + prismatic)" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Articulated Object Type",
      description: "Each object class has different force profiles, degrees of freedom, and diversity requirements.",
      columns: ["Object Type", "Articulation", "Data Volume", "Force Range", "Key Challenge"],
      rows: [
        { "Object Type": "Interior door", "Articulation": "Revolute (hinge)", "Data Volume": "500-2K demos", "Force Range": "5-30 N", "Key Challenge": "Handle type diversity" },
        { "Object Type": "Cabinet door", "Articulation": "Revolute (hinge)", "Data Volume": "1K-5K demos", "Force Range": "2-15 N", "Key Challenge": "Magnetic catches, soft-close" },
        { "Object Type": "Drawer", "Articulation": "Prismatic (slide)", "Data Volume": "500-2K demos", "Force Range": "2-20 N", "Key Challenge": "Rail friction, extension limit" },
        { "Object Type": "Refrigerator", "Articulation": "Revolute + seal", "Data Volume": "500-1K demos", "Force Range": "10-50 N", "Key Challenge": "Seal suction, heavy door" },
        { "Object Type": "Oven door", "Articulation": "Revolute + spring", "Data Volume": "300-1K demos", "Force Range": "5-30 N", "Key Challenge": "Counterbalance spring" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Articulated Object Manipulation",
      paragraphs: [
        "The field has evolved from model-based approaches (estimating articulation parameters from point clouds, then planning compliant trajectories) to data-driven end-to-end policies. Where2Act (Mo et al., 2021) trains a point cloud-based model to predict per-point action scores — indicating where on an object to push, pull, or grasp — and achieves 70% success on unseen articulated objects in simulation. FlowBot3D (Eisner et al., 2022) improves on this by predicting 3D flow fields that indicate the desired motion direction at each point, allowing the robot to discover the articulation axis without explicit model estimation.",
        "Real-world results remain challenging. RT-2 (Brohan et al., 2023) can open drawers and cabinets from language instructions but requires the handle to be clearly visible and accessible. Diffusion Policy (Chi et al., 2023) achieves 85-90% success on opening specific drawer types from 200 demonstrations, but success drops to 60-70% on unseen drawer hardware. The gap is primarily in handle detection and initial grasp pose — once the robot has a firm grasp and the articulation axis is discovered, compliant trajectory following is reliable.",
        "The emerging approach uses articulation-aware foundation models. Rather than training separate policies per hardware type, these models learn a shared representation of articulated objects from large-scale data and predict articulation parameters (joint type, axis, range) alongside manipulation actions. This requires diverse training data spanning dozens of hardware types — exactly the kind of data that single-lab collection struggles to produce but distributed collection networks can achieve.",
        "Mobile manipulation adds another layer: the robot must coordinate base positioning with arm motion during articulation. Opening a full-size door requires stepping backward while pulling, and accessing a low cabinet requires the base to position the arm within reach of a handle near the floor. Mobile ALOHA (Fu et al., 2024) demonstrated that mobile door opening from 50 demonstrations is feasible, but the base coordination patterns are highly sensitive to the door's swing direction and resistance. Data for mobile articulated manipulation must capture the coupled base-arm coordination, including recovery behaviors when the base position drifts during a pull or push.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Articulated Object Data",
      paragraphs: [
        "Articulated object data collection requires physical diversity that cannot be replicated with a single test fixture. Claru collects across real kitchens, offices, bathrooms, and commercial spaces where the natural variation in hardware provides the distribution our policies need. Each collection site is surveyed to catalog the articulated objects: handle type (lever, knob, pull, push plate, recessed), hinge type (butt, European cup, piano), opening direction (left, right, pull-out), and any resistance mechanisms (magnetic catches, soft-close dampers, spring returns).",
        "The demonstration protocol captures the full interaction: approach (moving to the handle), grasp (making contact and securing grip), actuation (opening/closing along the articulated path), and release (disengaging from the handle). Force/torque data at 200 Hz is critical because it captures the initial pull force to overcome catches, the steady-state force during articulation, and the changing force profile as soft-close mechanisms engage. Annotations include handle bounding box, articulation axis estimation (from the trajectory), opening angle achieved, and force profile segmentation into phases (approach, break-free, sweep, decelerate).",
        "Our collection protocol ensures a minimum of 10 distinct hardware configurations per collection site, with 50-100 demonstrations per configuration across 3+ operators. This produces 500-1,000 episodes per site. We target 10+ sites per campaign to achieve the 5,000-10,000 episode datasets needed for cross-hardware generalization. Each episode is tagged with detailed hardware metadata (handle manufacturer and model when identifiable) to enable hardware-conditioned policy training.",
        "For mobile manipulation scenarios, demonstrations capture the full approach-grasp-actuate-release sequence including base repositioning. The robot's base trajectory is logged alongside arm actions, enabling training of coordinated base-arm policies. We annotate the required clear space for door swing, the optimal base standoff distance per door type, and any coordination events where the base must move during articulation. This mobile coordination data is essential for home and commercial robot deployments where the robot must navigate to, operate, and navigate away from articulated objects as part of longer task sequences.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Articulated Object Manipulation",
      columns: ["Dataset", "Year", "Scale", "Object Types", "Real/Sim", "Force Data"],
      rows: [
        { "Dataset": "Where2Act", "Year": "2021", "Scale": "100K+ interactions", "Object Types": "SAPIEN models", "Real/Sim": "Simulation", "Force Data": "Simulated" },
        { "Dataset": "FlowBot3D", "Year": "2022", "Scale": "50K+ interactions", "Object Types": "PartNet-Mobility", "Real/Sim": "Simulation", "Force Data": "Simulated" },
        { "Dataset": "RT-2 Cabinet Tasks", "Year": "2023", "Scale": "~5K demos", "Object Types": "3-4 types", "Real/Sim": "Real", "Force Data": "No" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "1K-10K+", "Object Types": "50+ configurations", "Real/Sim": "Real", "Force Data": "Yes (200 Hz)" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "mo-where2act-2021", title: "Where2Act: From Pixels to Actions for Articulated 3D Objects", authors: "Mo et al.", venue: "ICCV 2021", year: 2021, url: "https://arxiv.org/abs/2101.02692" },
        { id: "eisner-flowbot3d-2022", title: "FlowBot3D: Learning 3D Articulation Flow to Manipulate Articulated Objects", authors: "Eisner et al.", venue: "RSS 2022", year: 2022, url: "https://arxiv.org/abs/2205.04382" },
        { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many hardware configurations should a door/cabinet dataset cover?",
      answer: "For reliable deployment in a single environment type (e.g., residential kitchens), cover at least 20 distinct handle-hinge configurations with 100+ demonstrations each. For cross-environment deployment (home + office + commercial), target 50+ configurations. The critical diversity axes are handle type (lever, knob, pull, push plate), opening mechanism (standard hinge, soft-close, magnetic catch), and mounting position (wall-mounted, overhead, floor-level).",
    },
    {
      question: "Why do articulated objects need force/torque data specifically?",
      answer: "Articulated objects involve variable resistance forces: magnetic catches create a sudden breakaway force, soft-close dampers add velocity-dependent resistance, and refrigerator seals create suction. Vision alone cannot predict these forces. The robot must apply the right force profile — sharp initial pull for catches, steady force during sweep, gentle deceleration for soft-close — and learning this requires force data that captures these phase transitions at 200+ Hz.",
    },
    {
      question: "Can simulation data from PartNet-Mobility replace real articulated object data?",
      answer: "PartNet-Mobility provides excellent geometric diversity with 2,000+ articulated object models, making it valuable for pretraining perception (handle detection, articulation axis prediction). However, real hardware has friction, play, catches, and compliance that simulation approximates poorly. A policy pretrained on 100K simulated interactions and fine-tuned on 2,000-5,000 real demonstrations significantly outperforms either data source alone.",
    },
    {
      question: "Should the dataset include both opening and closing demonstrations?",
      answer: "Yes. Opening and closing involve different force profiles and visual cues. Closing requires monitoring the door/drawer approach to the frame and controlling impact force, while opening requires detecting and overcoming catches. Include roughly equal numbers of opening and closing demonstrations. Also include partial-open scenarios where the robot adjusts an already-open door/drawer to a specific angle.",
    },
    {
      question: "How important is handle detection accuracy for articulated manipulation?",
      answer: "Handle detection is the primary failure mode in real-world deployment. If the robot cannot accurately localize the handle within 1-2 cm, the grasp fails before articulation even begins. Training data should include diverse handle appearances under varied lighting (shadows, reflections on metal handles, dark handles on dark cabinets). Annotate handle bounding boxes and 6-DoF grasp poses in every episode to enable joint handle detection and manipulation policy training.",
    },
    {
      question: "How does mounting height affect articulated object data requirements?",
      answer: "Mounting height fundamentally changes the robot's approach trajectory, reachability constraints, and force application geometry. A drawer at floor level requires a downward reach that puts the arm near its joint limits, while an overhead cabinet requires upward extension with reduced available force. Demonstrations should be stratified across at least three height zones: floor-level (below 40 cm), counter-height (40-120 cm), and overhead (above 120 cm). Each zone needs independent demonstration sets because the manipulation strategies are genuinely different, not just scaled versions of each other. Budget 200+ demonstrations per handle-height combination for robust cross-height generalization.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Door & Cabinet Manipulation Data",
  ctaDescription: "Tell us your target environments and hardware diversity requirements. We will collect across real homes, offices, and commercial spaces with the handle variety your policy needs.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "articulated-object"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + force/torque (200 Hz) + proprioception + joint angle tracking",
    volumeRange: "1K-10K demonstrations across 50+ hardware configurations",
    temporalResolution: "30 Hz video, 200 Hz force/torque, 100 Hz proprioception",
    keyAnnotations: ["Handle bounding box and 6-DoF grasp pose", "Articulation axis estimation", "Opening angle trajectory", "Force profile phase segmentation", "Hardware type classification"],
  },
  relevantModels: ["Where2Act", "FlowBot3D", "Diffusion Policy", "OpenVLA", "Articulation-aware VLAs"],
  environmentTypes: ["Home kitchen", "Office", "Commercial building", "Hospital", "Retail store"],
  keyPapers: [
    { id: "mo-where2act-2021", title: "Where2Act: From Pixels to Actions for Articulated 3D Objects", authors: "Mo et al.", venue: "ICCV 2021", year: 2021, url: "https://arxiv.org/abs/2101.02692" },
    { id: "eisner-flowbot3d-2022", title: "FlowBot3D: Learning 3D Articulation Flow to Manipulate Articulated Objects", authors: "Eisner et al.", venue: "RSS 2022", year: 2022, url: "https://arxiv.org/abs/2205.04382" },
    { id: "brohan-rt2-2023", title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", authors: "Brohan et al.", venue: "arXiv 2307.15818", year: 2023, url: "https://arxiv.org/abs/2307.15818" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
  ],
  claruRelevance: "Claru collects articulated object manipulation data across real homes, offices, and commercial buildings through our distributed collection network, providing the hardware diversity no single lab can achieve. Each site is surveyed and cataloged for handle types, hinge mechanisms, and opening configurations. Our teleoperation rigs capture full interaction episodes with 200 Hz force/torque sensing, multi-view RGB-D, and detailed hardware metadata. Annotations include handle localization, articulation axis estimation, force profile phase segmentation, and opening angle trajectories. We deliver datasets covering 50+ hardware configurations in RLDS, HDF5, or custom formats with full sensor calibration and hardware-stratified train/val/test splits. Typical campaigns across 10+ collection sites produce 5,000-10,000 annotated episodes within 4-6 weeks.",
};

export default data;
