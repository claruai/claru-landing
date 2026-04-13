import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "pushing",
  metaTitle: "Pushing Task Training Data for Robotics | Claru",
  metaDescription:
    "Training data for robotic pushing: non-prehensile manipulation, object sliding, and planar rearrangement. Contact-dynamics demonstrations with friction modeling and push prediction.",
  primaryKeyword: "robotic pushing training data",
  secondaryKeywords: [
    "pushing task dataset",
    "non-prehensile manipulation data",
    "robot pushing demonstrations",
    "planar pushing dataset",
    "object sliding training data",
    "push manipulation automation data",
  ],
  canonicalPath: "/training-data/pushing",
  h1: "Pushing Task Training Data",
  heroSubtitle:
    "Pushing datasets for non-prehensile robotic manipulation — planar object sliding, goal-directed push rearrangement, and contact-dynamics demonstrations with friction modeling for training push prediction and planning policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Pushing Task", href: "/training-data/pushing" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Pushing and Why Does Data Matter?",
      paragraphs: [
        "Pushing — moving objects by applying forces through sustained contact without grasping — is one of the most fundamental yet underappreciated manipulation skills. Humans push objects constantly: sliding a plate across a table, nudging a box into alignment, sweeping crumbs into a dustpan. For robots, pushing is essential when objects are too large, too flat, or too heavy to grasp, and as a pre-manipulation strategy to singulate cluttered objects or reposition items into graspable configurations. Pushing is also the simplest form of contact-rich manipulation, making it an ideal testbed for learning physics-based manipulation policies.",
        "The physics of pushing are deceptively complex. When a finger pushes an object on a surface, the resulting motion depends on the push point relative to the center of friction, the friction coefficient between the object and surface, the object's mass distribution, and the contact geometry between the finger and object. Lynch and Mason (1996) formalized the mechanics of planar pushing, showing that the push-to-slide transition depends on the ratio of pushing force to normal load and the eccentricity of the push point. A push applied through the center of friction produces pure translation, while eccentric pushes produce coupled translation and rotation — a behavior that is intuitive for humans but requires explicit physics reasoning for robots.",
        "The MIT Push Dataset (Yu et al., 2016) was the seminal contribution that enabled data-driven push prediction. Containing 250,000 push interactions across 11 object shapes with systematic variation of push parameters (location, angle, velocity), this dataset showed that neural network push predictors trained on real data outperform analytical models by 40% on held-out objects because they implicitly learn material-specific friction behaviors that analytical models must approximate. This result established that real-world push data is essential for accurate push prediction.",
        "Modern applications of push manipulation extend well beyond research benchmarks. In warehouse automation, push-based singulation separates touching objects in cluttered bins to enable individual grasping — Amazon reports that singulation pushes are required for 30-40% of bin picks in typical e-commerce inventory. In manufacturing, push-based fixture loading aligns parts against reference surfaces with sub-millimeter precision. In household robotics, pushing is the primary strategy for clearing surfaces, arranging objects, and operating sliding mechanisms (drawers, doors). Building robust push policies for these diverse applications requires demonstration data that captures the full range of object-surface friction interactions.",
      ],
    },
    {
      type: "stats",
      heading: "Pushing Data by the Numbers",
      stats: [
        { value: "250K", label: "Push interactions in MIT Push Dataset" },
        { value: "40%", label: "Neural push prediction improvement over analytical models" },
        { value: "30-40%", label: "Warehouse picks requiring singulation pushes" },
        { value: "11", label: "Object shapes in foundational MIT Push Dataset" },
        { value: "<1 mm", label: "Push alignment precision for manufacturing fixtures" },
        { value: "3-DoF", label: "Planar object state (x, y, theta) for push prediction" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Push Learning Approach",
      description:
        "Push manipulation learning ranges from forward-model prediction to goal-conditioned policies. Each approach requires different data structures.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Physics Model",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Forward push prediction (neural)",
          "Data Volume": "50K-500K push interactions",
          "Key Modalities": "Object pose + push parameters + outcome pose",
          "Physics Model": "Learned from data",
          Strengths: "Accurate single-step prediction; material-aware",
        },
        {
          Approach: "Model-based push planning",
          "Data Volume": "10K-100K pushes for model fitting",
          "Key Modalities": "Object shape + friction coefficients + push outcomes",
          "Physics Model": "Quasi-static or learned dynamics",
          Strengths: "Long-horizon planning; interpretable",
        },
        {
          Approach: "Goal-conditioned push RL",
          "Data Volume": "500K-2M episodes (mostly sim)",
          "Key Modalities": "RGB-D + goal image/pose + reward signal",
          "Physics Model": "Simulator (MuJoCo, PyBullet)",
          Strengths: "Goal-directed; handles multi-step pushes",
        },
        {
          Approach: "Behavioral cloning for push manipulation",
          "Data Volume": "1K-10K demonstrated push sequences",
          "Key Modalities": "RGB + proprioception + push trajectory",
          "Physics Model": "Implicit in demonstrations",
          Strengths: "Captures human strategies; multi-object sequences",
        },
        {
          Approach: "Sim-to-Real push transfer",
          "Data Volume": "1M+ sim + 5K-20K real for calibration",
          "Key Modalities": "Sim contact dynamics + real friction calibration",
          "Physics Model": "Calibrated simulator",
          Strengths: "Scalable; diverse object coverage",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Push Manipulation",
      paragraphs: [
        "The MIT Push Dataset (Yu et al., 2016) established the foundational benchmark for data-driven push prediction. Training a neural network on 250,000 push interactions to predict the 3-DoF outcome (delta x, delta y, delta theta), the resulting model achieves 2.3 mm average position error and 1.7-degree average rotation error on held-out pushes — 40% better than the quasi-static analytical model. Importantly, the learned model generalizes to novel objects with only 50-100 calibration pushes per new object, compared to thousands of pushes needed to fit analytical model parameters.",
        "PushNet (Li et al., 2018) extended push prediction to visual observations, training an encoder-decoder network that takes an overhead RGB image and push parameters as input and predicts the post-push object configuration. On the MIT Push Dataset benchmark, PushNet achieves 3.1 mm position error from images alone — only 35% worse than models with ground-truth pose access. This demonstrated that visual push prediction is viable for real-world deployment where precise object pose estimation may not be available.",
        "For multi-step push manipulation, Diffusion Policy (Chi et al., 2023) achieved breakthrough results on the PushT benchmark — a task requiring pushing a T-shaped block to a target configuration. Diffusion Policy achieves 88.2% success rate compared to 72.3% for BC-RNN and 65.1% for IBC, establishing the state of the art for goal-conditioned push manipulation. The advantage comes from modeling the multimodal action distribution inherent in pushing — there are many valid push sequences to reach the same goal, and Diffusion Policy generates diverse, high-quality solutions while other methods collapse to suboptimal averages.",
        "Recent work on foundation models for pushing has shown promising generalization. RT-2 (Brohan et al., 2023) demonstrates zero-shot push manipulation for novel objects when instructed in natural language ('push the can to the left'), achieving 68% success on unseen objects compared to 45% for RT-1. The key insight is that internet-scale pretraining provides implicit physics understanding — the VLM has seen millions of images of objects being pushed and can reason about likely outcomes. However, precise quantitative push prediction still requires task-specific data, as foundation models trade precision for breadth.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Pushing Data",
      paragraphs: [
        "Push data collection requires precise tracking of both the pusher (robot finger or tool) and the object before, during, and after each push interaction. The standard setup uses an overhead camera system (RGB or RGB-D) with fiducial markers (AprilTags) on the objects for sub-millimeter pose tracking at 30-60 Hz. The pusher position is recorded from robot joint encoders at 100+ Hz. For systematic push data collection, the workspace should be a flat, uniform surface with known friction properties — anodized aluminum or laminate surfaces provide consistent friction coefficients across the workspace.",
        "Systematic push data collection varies push parameters across a grid: push location on the object boundary (8-16 evenly spaced points), push angle relative to the object surface normal (0, 15, 30, 45 degrees), and push velocity (10-100 mm/s in 3-5 steps). For each parameter combination, record the full push interaction: pre-push object pose, push start position, push trajectory (position over time), and post-push object pose after settling. This systematic approach produces 100-500 pushes per object in 1-2 hours, with complete coverage of the push parameter space.",
        "For goal-directed push manipulation demonstrations, teleoperation is preferred over systematic collection because it captures human push planning strategies. Operators are presented with a current object configuration and a target configuration (shown as an overlay or separate display) and must push objects to achieve the goal. Record the full push sequence (typically 3-15 pushes for multi-object arrangements) with per-push annotations: push start/end positions, contact duration, object pose change, and distance to goal after each push. Include both successful and unsuccessful demonstrations — failed push sequences where the operator overshoots or creates unrecoverable configurations provide valuable negative signal.",
        "For multi-object push manipulation (singulation, sorting, arrangement), the workspace should contain 5-15 objects in randomized configurations. Operators push objects to achieve specified goals: separate touching objects (singulation), sort objects by category into designated zones, or arrange objects into a target pattern. Annotate per-push: which object was pushed, whether any other objects were displaced by the push (cascading effects), and the post-push state of all objects. Multi-object push data is particularly valuable because it teaches policies about object-object interactions during pushing — a pushed object can collide with and displace neighboring objects, creating complex chain reactions.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Robotic Pushing",
      description:
        "Pushing datasets range from systematically collected single-object interactions to goal-directed multi-step manipulation demonstrations.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Objects",
        "Key Features",
        "Limitations",
      ],
      rows: [
        {
          Dataset: "MIT Push Dataset (Yu et al.)",
          Year: "2016",
          Scale: "250K push interactions",
          Objects: "11 planar objects (varied shapes)",
          "Key Features": "Systematic parameter variation; sub-mm tracking",
          Limitations: "Single-push only; no multi-step sequences",
        },
        {
          Dataset: "Omnipush (Bauza et al.)",
          Year: "2019",
          Scale: "250K pushes, 250 objects",
          Objects: "3D-printed shapes with varied COM",
          "Key Features": "Large object diversity; controlled friction",
          Limitations: "Synthetic objects; single surface type",
        },
        {
          Dataset: "PushT (Chi et al.)",
          Year: "2023",
          Scale: "200 demonstrations per variant",
          Objects: "T-shaped block",
          "Key Features": "Goal-conditioned; multi-step; benchmark for Diffusion Policy",
          Limitations: "Single object type; 2D workspace only",
        },
        {
          Dataset: "Planar manipulation (Zhou et al.)",
          Year: "2018",
          Scale: "100K+ simulated push episodes",
          Objects: "Convex 2D shapes in simulation",
          "Key Features": "Long-horizon planning; multi-object",
          Limitations: "Sim-only; limited real-world validation",
        },
        {
          Dataset: "DROID push subtasks",
          Year: "2024",
          Scale: "Subset of 76K total episodes",
          Objects: "Real household objects",
          "Key Features": "Multi-site collection; diverse environments",
          Limitations: "Push is subset; not push-specific annotations",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Pushing Data Needs",
      paragraphs: [
        "Claru provides pushing data collection for both systematic push physics research and goal-directed manipulation applications. Our push collection stations feature overhead RGB-D cameras with AprilTag fiducial tracking at sub-millimeter accuracy, calibrated planar surfaces with characterized friction coefficients, and robot arms instrumented with fingertip force sensors for measuring push contact forces. We support both systematic parameter-sweep collection (100-500 pushes per object per hour) and teleoperated goal-directed push demonstrations.",
        "We collect pushing data on client-supplied objects across diverse shapes, materials, and weight distributions. For systematic datasets, we vary push location, angle, and velocity across a configurable parameter grid with automated collection protocols. For goal-directed push manipulation, our operators demonstrate multi-step push sequences for singulation, sorting, and arrangement tasks with per-push annotations including contact points, displacement vectors, and goal-distance metrics.",
        "Claru delivers pushing datasets formatted for forward push prediction models, goal-conditioned RL environments, Diffusion Policy training, or custom architectures. Standard deliverables include pre/post-push object poses with sub-millimeter accuracy, push parameter annotations (location, angle, velocity, duration), contact force profiles, and for multi-step demonstrations, per-push state annotations and goal achievement labels. Our collection throughput enables rapid scaling from research-scale datasets (10K-50K pushes) to production-scale corpora (200K+ interactions).",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "yu-mit-push-2016",
          title: "More Than a Million Ways to Be Pushed: A High-Fidelity Experimental Dataset of Planar Pushing",
          authors: "Yu et al.",
          venue: "IROS 2016",
          year: 2016,
          url: "https://arxiv.org/abs/1604.04038",
        },
        {
          id: "bauza-omnipush-2019",
          title: "Omnipush: Accurate, Diverse, Real-World Dataset of Pushing Dynamics with RGB-D Video",
          authors: "Bauza et al.",
          venue: "IROS 2019",
          year: 2019,
          url: "https://arxiv.org/abs/1910.00618",
        },
        {
          id: "chi-diffusion-2023",
          title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "li-pushnet-2018",
          title: "Push-Net: Deep Planar Pushing for Objects with Unknown Physical Properties",
          authors: "Li et al.",
          venue: "RSS 2018",
          year: 2018,
          url: "https://arxiv.org/abs/1806.00707",
        },
        {
          id: "lynch-pushing-1996",
          title: "Stable Pushing: Mechanics, Controllability, and Planning",
          authors: "Lynch and Mason",
          venue: "IJRR 1996",
          year: 1996,
          url: "https://doi.org/10.1177/027836499601500602",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How many push interactions are needed for accurate push prediction?",
      answer:
        "For single-object push prediction, the MIT Push Dataset showed that neural models achieve good accuracy with 50,000-100,000 pushes per surface type, though marginal improvements continue up to 250,000. For a new object on a known surface, 50-100 calibration pushes suffice to adapt a pretrained model. For goal-conditioned multi-step push policies, 200-1,000 demonstrated push sequences per task type are needed for behavioral cloning with Diffusion Policy.",
    },
    {
      question: "Is simulation sufficient for push manipulation learning?",
      answer:
        "Simulation is effective for learning push strategies but inaccurate for precise push outcome prediction. The sim-to-real gap for push dynamics is primarily due to friction modeling — real friction is velocity-dependent, anisotropic, and varies with surface wear, while simulators typically use simple Coulomb friction. Simulation-only models achieve 5-8 mm position error versus 2-3 mm for real-data models. Use simulation for RL policy training with coarse physics, then calibrate with 5,000-20,000 real pushes for deployment precision.",
    },
    {
      question: "What surface properties affect push data collection?",
      answer:
        "Surface friction is the dominant factor. Collect data on 2-3 surface materials representing your deployment environment (e.g., stainless steel, laminate, rubber mat). Each surface produces different push outcomes for the same push parameters. Also control for surface cleanliness (dust and oil change friction), temperature (rubber friction varies with temperature), and surface wear (new vs. used surfaces). Document surface properties in dataset metadata for reproducibility.",
    },
    {
      question: "How do you handle rotational push outcomes?",
      answer:
        "Rotation is the most challenging aspect of push prediction. A push applied away from the center of friction induces coupled translation-rotation that depends on the object's mass distribution and contact geometry. To capture rotational behavior, vary push points around the full object perimeter (not just one side) and include both centered pushes (pure translation) and eccentric pushes (rotation-inducing). Annotate the center of friction location for each object, which can be estimated from 10-20 calibration pushes at systematically varied push points.",
    },
    {
      question: "Can push data transfer across different robot platforms?",
      answer:
        "Push outcome data (object motion given push parameters) transfers well across platforms because it depends on object-surface physics, not the robot. The key is to parameterize pushes in the object frame (push point, angle, velocity, duration) rather than robot joint space. Push policies that map RGB observations to push parameters also transfer reasonably (70-80% of single-platform performance) because the visual reasoning is robot-agnostic. The main transfer gap is in push execution precision — different robots have different position control accuracy.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Pushing Task Data",
  ctaDescription:
    "Tell us about your push manipulation requirements — object types, surface conditions, and goal specifications — and we will design a data collection plan for your specific application.",
  relatedGlossaryTerms: [
    "contact-rich-manipulation",
    "manipulation-trajectory",
    "behavioral-cloning",
    "sim-to-real-gap",
    "proprioceptive-data",
  ],
  relatedGuidePages: [
    "how-to-build-a-manipulation-dataset",
    "how-to-build-a-contact-rich-manipulation-dataset",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D + object pose tracking + push parameters + contact force (optional)",
    volumeRange: "10K-500K push interactions or 1K-10K multi-step demonstrations",
    temporalResolution: "30-60 Hz object tracking, 100 Hz pusher position, per-push annotations",
    keyAnnotations: [
      "Pre-push and post-push object pose (x, y, theta)",
      "Push parameters (contact point, angle, velocity, duration)",
      "Contact force profile at fingertip (if instrumented)",
      "Surface friction coefficient characterization",
      "Multi-object displacement tracking (cascading pushes)",
      "Goal achievement label for goal-conditioned tasks",
    ],
  },
  relevantModels: [
    "Diffusion Policy",
    "PushNet",
    "Neural push predictors",
    "Model-based push planners",
    "RT-1 / RT-2",
    "Goal-conditioned RL policies",
  ],
  environmentTypes: [
    "Research tabletop workspace",
    "Warehouse singulation station",
    "Manufacturing fixture loading",
    "Kitchen surface clearing",
    "Laboratory planar workspace",
    "Conveyor-side push sorting",
  ],
  keyPapers: [
    {
      id: "yu-mit-push-2016",
      title: "More Than a Million Ways to Be Pushed: A High-Fidelity Experimental Dataset of Planar Pushing",
      authors: "Yu et al.",
      venue: "IROS 2016",
      year: 2016,
      url: "https://arxiv.org/abs/1604.04038",
    },
    {
      id: "bauza-omnipush-2019",
      title: "Omnipush: Accurate, Diverse, Real-World Dataset of Pushing Dynamics with RGB-D Video",
      authors: "Bauza et al.",
      venue: "IROS 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1910.00618",
    },
    {
      id: "chi-diffusion-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "li-pushnet-2018",
      title: "Push-Net: Deep Planar Pushing for Objects with Unknown Physical Properties",
      authors: "Li et al.",
      venue: "RSS 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1806.00707",
    },
  ],
  claruRelevance:
    "Claru provides pushing data collection for both systematic push physics research and goal-directed manipulation applications. Our stations feature overhead RGB-D cameras with AprilTag fiducial tracking at sub-millimeter accuracy, calibrated planar surfaces with characterized friction coefficients, and robot arms with fingertip force sensors for push contact measurement. We support systematic parameter-sweep collection (100-500 pushes per object per hour) and teleoperated goal-directed demonstrations for singulation, sorting, and arrangement tasks. Deliverables include pre/post-push object poses, push parameter annotations, contact force profiles, and per-push state labels — formatted for push prediction networks, Diffusion Policy, RL environments, or custom architectures. Our throughput enables scaling from research datasets (10K-50K pushes) to production-scale corpora (200K+ interactions) on real client objects.",
};

export default data;
