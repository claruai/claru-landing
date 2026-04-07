import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "dexterous-manipulation",
  metaTitle: "Dexterous Manipulation Training Data | Claru",
  metaDescription:
    "High-fidelity training data for dexterous robotic manipulation: multi-fingered grasping, in-hand reorientation, and precision tasks requiring fingertip control.",
  primaryKeyword: "dexterous manipulation training data",
  secondaryKeywords: [
    "multi-fingered manipulation data",
    "in-hand manipulation dataset",
    "robot dexterity training data",
    "dexterous hand training dataset",
    "tactile manipulation data",
    "fingertip control robotics data",
  ],
  canonicalPath: "/training-data/dexterous-manipulation",
  h1: "Dexterous Manipulation Training Data",
  heroSubtitle:
    "Specialized datasets for training multi-fingered robot hands — in-hand reorientation, precision grasping, tool use, and fingertip-level control with synchronized tactile, visual, and proprioceptive recordings.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    {
      label: "Dexterous Manipulation",
      href: "/training-data/dexterous-manipulation",
    },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Dexterous Manipulation Data Is Uniquely Challenging",
      paragraphs: [
        "Dexterous manipulation represents the frontier of robotic capability — tasks where a multi-fingered hand must coordinate 16-24 degrees of freedom simultaneously to achieve precise object control. Unlike parallel-jaw grasping, where two contact points suffice, dexterous manipulation requires continuous, adaptive finger coordination informed by tactile feedback. A human picking up a pen, rotating it to writing position, and then writing — trivial for us — involves thousands of micro-adjustments across five fingers with real-time slip detection and force modulation. Training policies for these tasks demands data with sensor modalities and temporal resolutions far beyond standard manipulation datasets.",
        "The hardware landscape is fragmented, creating a cross-embodiment challenge for foundation models. The Allegro Hand (16-DoF, tendon-driven), Shadow Dexterous Hand (24-DoF, pneumatic/electric), LEAP Hand (16-DoF, low-cost), and Ability Hand (6-DoF, underactuated) each present different kinematic structures, joint ranges, and sensor suites. Research from Arunachalam et al. (2023) on DexMV demonstrated that teleoperated dexterous demonstrations collected via retargeted hand tracking can train policies that generalize across 30+ object categories — but required 10,000+ demonstrations with precise fingertip contact annotations. The cross-embodiment gap means a dataset collected on the Allegro Hand has limited transfer value for Shadow Hand policies without careful retargeting.",
        "Tactile sensing adds a critical data modality absent from most existing datasets. GelSight, DIGIT, and BioTac sensors produce high-dimensional tactile images at 30-100 Hz that capture contact geometry, force distribution, and slip indicators. Qi et al. (2023) demonstrated that policies trained with synchronized tactile-visual data show 25-40% improvement on in-hand rotation compared to vision-only approaches. Yuan et al. (2023) with AnyRotate showed that tactile feedback is not just helpful but essential for maintaining stable grasps during reorientation — without it, drop rates increase by 3x on smooth objects. Collecting synchronized tactile-visual data at scale requires specialized hardware calibration and annotation pipelines that few organizations can provide.",
        "The sim-to-real gap for dexterous manipulation is the largest in all of robotics. Multi-finger contact dynamics involve rolling, sliding, and stick-slip friction at multiple contact points simultaneously, and small errors in contact modeling compound rapidly across the 16-24 DOF action space. Chen et al. (2023) with DexPoint showed that even with extensive domain randomization in Isaac Gym, sim-to-real transfer for in-hand reorientation achieves only 60-70% of the performance of policies trained on real demonstrations. This makes high-quality real-world data indispensable for production dexterous manipulation systems.",
      ],
    },
    {
      type: "stats",
      heading: "Dexterous Manipulation by the Numbers",
      stats: [
        { value: "16-24 DoF", label: "Action space per dexterous hand" },
        { value: "5K-50K", label: "Demonstrations per task family" },
        { value: "25-40%", label: "Tactile data success improvement" },
        { value: "100+ Hz", label: "Tactile sensing rate required" },
        { value: "3x", label: "Drop rate increase without tactile" },
        { value: "0.1 mm", label: "Fingertip tracking accuracy needed" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Learning Approach",
      description:
        "Different architectures for dexterous policy learning have distinct data modality and volume requirements.",
      columns: [
        "Approach",
        "Data Volume",
        "Key Modalities",
        "Tactile Required",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Behavioral Cloning (BC)",
          "Data Volume": "2K-10K demos per task",
          "Key Modalities": "RGB + joint positions + tactile",
          "Tactile Required": "Recommended",
          Strengths: "Straightforward pipeline; good for single-object tasks",
        },
        {
          Approach: "Diffusion Policy",
          "Data Volume": "500-5K demos per task",
          "Key Modalities": "RGB + tactile + proprioception",
          "Tactile Required": "Yes (critical)",
          Strengths: "Handles multimodal contact strategies; data-efficient",
        },
        {
          Approach: "RL with real-world pretraining",
          "Data Volume": "1K-5K demos + 100K RL episodes",
          "Key Modalities": "Proprioception + tactile",
          "Tactile Required": "Yes (reward shaping)",
          Strengths: "Adapts to object variation; discovers novel strategies",
        },
        {
          Approach: "Sim-to-real transfer",
          "Data Volume": "1M+ sim + 2K-10K real demos",
          "Key Modalities": "Point cloud + tactile for calibration",
          "Tactile Required": "For calibration",
          Strengths: "Scalable; handles diverse objects in simulation",
        },
        {
          Approach: "Hand retargeting + BC",
          "Data Volume": "5K-20K retargeted demos",
          "Key Modalities": "RGB + MoCap + retargeted joint angles",
          "Tactile Required": "No (inferred from MoCap)",
          Strengths: "Natural human demonstrations; fast collection",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Dexterous Manipulation",
      paragraphs: [
        "OpenAI's seminal work on Rubik's cube solving with a Shadow Hand (Akkaya et al., 2019) demonstrated that RL with massive simulation (approximately 13,000 years of simulated experience) can produce dexterous policies, but the approach required custom domain randomization engineering and failed to generalize beyond the specific cube. More recent work has shifted toward learning from demonstrations. DexMV (Arunachalam et al., 2023) uses multi-view hand tracking to retarget human manipulation demonstrations to robot hand kinematics, training policies that generalize across 30+ object categories from 10,000 demonstrations. The key insight is that human hand motion contains the coordination patterns that make dexterous manipulation work — finger gaiting, opposition grasps, precision pinches — and retargeting preserves these patterns.",
        "HORA (Qi et al., 2022) and its successor RotateIt (Qi et al., 2023) achieved state-of-the-art in-hand reorientation by combining vision and touch. RotateIt trains policies that rotate objects to arbitrary goal orientations using an Allegro Hand with DIGIT tactile sensors, achieving 85% success across 20 object categories. The critical finding was that tactile feedback enables robust grasp maintenance during finger gaiting — the sequential finger release and re-grasp maneuver essential for continuous rotation. Without tactile data, the policy cannot detect incipient slip and drops the object during finger transitions.",
        "For tool use, Shaw et al. (2023) with the LEAP Hand demonstrated that low-cost dexterous hands ($2,000 versus $100,000+ for Shadow Hand) can achieve competent tool manipulation when trained on 500+ demonstrations per tool type. The LEAP Hand's simplified 16-DoF kinematic structure makes teleoperation easier and data collection faster, but limits the manipulation repertoire compared to higher-DOF hands. The practical implication is a design tradeoff: simpler hands need less data per task but cannot perform the full range of dexterous behaviors.",
        "The emerging frontier is dexterous manipulation with humanoid hands on humanoid robots. Systems like Figure AI, Sanctuary AI, and Tesla Optimus are integrating multi-fingered hands on full-body humanoids, creating a data requirement that combines whole-body coordination with fine-fingered dexterity. The data challenge is unprecedented: demonstrations must capture simultaneous 30+ DoF upper-body coordination, 16+ DoF per-hand manipulation, and the coupling between locomotion stability and manipulation force. No existing dataset covers this scope.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements for Contact-Rich Dexterous Tasks",
      paragraphs: [
        "In-hand reorientation tasks require demonstrations capturing the full spectrum of finger gaiting strategies — where fingers sequentially release and re-grasp to rotate an object without dropping it. Each demonstration must include precise joint angle trajectories at 100+ Hz, fingertip force readings from tactile sensors, and object 6-DoF pose tracking at 30+ Hz. A minimum of 500 demonstrations per reorientation axis is recommended for robust policy training, scaling to 5,000+ demonstrations for policies that generalize across object shapes, sizes, and surface properties.",
        "Precision tasks — threading a needle, inserting a USB connector, turning a key — demand sub-millimeter accuracy in the demonstration data. Optical tracking systems like OptiTrack or Vicon with 0.1 mm accuracy are typically required for fingertip ground truth, combined with wrist-mounted stereo cameras for the visual input stream the policy will use at deployment. Force resolution at the fingertip must capture the 0.01-5 N range relevant to precision manipulation, requiring calibrated tactile sensors on each contact surface.",
        "The diversity axis for dexterous manipulation must include object size (spanning the hand's workspace from 2 cm to 15 cm diameter), weight (affecting required grasp force from 10 g to 2 kg), surface friction (smooth glass to rough sandpaper, with at least 5 distinct friction levels), and compliance (rigid metal to soft foam). Each diversity axis should be sampled with at least 3 levels, creating a minimum of 81 object variants (3 sizes x 3 weights x 3 frictions x 3 compliances) for comprehensive training.",
        "Teleoperation for dexterous hands is uniquely challenging. Vision-based hand retargeting — tracking the human hand with RGB cameras and mapping joint angles to the robot — offers the most natural interface but introduces retargeting errors of 5-15 degrees per joint. Instrumented data gloves (CyberGlove, StretchSense) provide more precise finger tracking at 120+ Hz but cost $10K-50K per glove and require per-session calibration. Claru's collection network includes operators trained on both interfaces who can produce 15-30 dexterous demonstrations per hour with full tactile and proprioceptive instrumentation.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Dexterous Manipulation",
      description:
        "Public dexterous manipulation datasets vary in hand platform, sensor coverage, and task complexity.",
      columns: [
        "Dataset",
        "Year",
        "Hand",
        "Scale",
        "Modalities",
        "Tasks",
      ],
      rows: [
        {
          Dataset: "DexMV (Arunachalam et al.)",
          Year: "2023",
          Hand: "Allegro",
          Scale: "10K+ demos",
          Modalities: "RGB + retargeted joints",
          Tasks: "30+ object categories, grasping + reorientation",
        },
        {
          Dataset: "HORA / RotateIt (Qi et al.)",
          Year: "2023",
          Hand: "Allegro + DIGIT",
          Scale: "5K demos",
          Modalities: "RGB + tactile + proprioception",
          Tasks: "In-hand rotation across 20 objects",
        },
        {
          Dataset: "DexGraspNet",
          Year: "2023",
          Hand: "Shadow (sim)",
          Scale: "1.3M grasps (sim)",
          Modalities: "Point cloud + joint angles",
          Tasks: "Grasp synthesis for 5,355 objects",
        },
        {
          Dataset: "LEAP Hand (Shaw et al.)",
          Year: "2023",
          Hand: "LEAP (16-DoF)",
          Scale: "500+ demos per tool",
          Modalities: "RGB + proprioception",
          Tasks: "Tool use, object relocation",
        },
        {
          Dataset: "DexCap (Wang et al.)",
          Year: "2024",
          Hand: "Various (retargeted)",
          Scale: "200 demos x 6 tasks",
          Modalities: "MoCap + retargeted joints",
          Tasks: "Pouring, scooping, handover",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Dexterous Manipulation Data Needs",
      paragraphs: [
        "Claru supports dexterous manipulation data collection with specialized operators trained on multi-fingered teleoperation interfaces including vision-based hand retargeting and instrumented glove systems. Our collection rigs integrate synchronized tactile sensors (GelSight Mini, DIGIT) on each fingertip with multi-view RGB-D cameras and 100+ Hz proprioceptive logging. We support the Allegro Hand, LEAP Hand, and custom hand platforms with per-hand calibration protocols that ensure consistent data quality across collection sessions.",
        "Our operators complete a dexterous-specific qualification protocol that assesses finger coordination quality, in-hand manipulation success rates, and demonstration smoothness before production collection begins. Session limits are set at 30 minutes for dexterous tasks (shorter than standard manipulation) due to the high cognitive load of multi-finger teleoperation. Per-operator quality dashboards track drop rates, completion times, and demonstration smoothness to detect fatigue before it contaminates the dataset.",
        "Claru delivers dexterous manipulation data with per-finger joint trajectories, fingertip contact force maps, object 6-DoF pose trajectories, and grasp stability annotations. Data is formatted for leading dexterous policy architectures including DexMV, HORA, Diffusion Policy, and custom pipelines, in RLDS or HDF5 format. For clients building cross-embodiment dexterous systems, we provide retargeting metadata and kinematic chain descriptions that enable training a single policy across multiple hand platforms.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "arunachalam-dexmv-2023",
          title:
            "Dexterous Imitation Made Easy: A Learning-Based Framework for Efficient Dexterous Manipulation",
          authors: "Arunachalam et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2203.16257",
        },
        {
          id: "qi-tactile-2023",
          title: "General In-Hand Object Rotation with Vision and Touch",
          authors: "Qi et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2309.16600",
        },
        {
          id: "shaw-leap-2023",
          title:
            "LEAP Hand: Low-Cost, Efficient, and Anthropomorphic Hand for Robot Learning",
          authors: "Shaw et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2309.01918",
        },
        {
          id: "chen-dexpoint-2023",
          title:
            "Visual Dexterity: In-Hand Reorientation of Novel Objects with Partial Point Clouds",
          authors: "Chen et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2211.11744",
        },
        {
          id: "akkaya-rubiks-2019",
          title: "Solving Rubik's Cube with a Robot Hand",
          authors: "Akkaya et al.",
          venue: "arXiv 1910.07113",
          year: 2019,
          url: "https://arxiv.org/abs/1910.07113",
        },
        {
          id: "wang-dexcap-2024",
          title:
            "DexCap: Scalable and Portable Mocap Data Collection System for Dexterous Manipulation",
          authors: "Wang et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2403.07788",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "What teleoperation interface works best for dexterous manipulation data?",
      answer:
        "Vision-based hand retargeting (using RGB cameras to track human hand pose and map to robot fingers) offers the most natural interface for multi-fingered tasks. Systems like DexMV and AnyTeleop achieve 85%+ kinematic retargeting accuracy for common grasps. Glove-based systems like CyberGlove and StretchSense provide more precise finger tracking at 120+ Hz but cost $10K-50K per glove. VR controllers cannot capture individual finger motions and are unsuitable for dexterous tasks. The choice depends on budget and required precision: retargeting for large-scale collection, gloves for high-fidelity precision tasks.",
    },
    {
      question:
        "How important is tactile data for dexterous manipulation policies?",
      answer:
        "Highly important for contact-rich tasks. Policies trained with synchronized tactile data (GelSight, DIGIT) show 25-40% improvement on in-hand reorientation and precision insertion compared to vision-only approaches. For simpler power grasps, tactile data provides marginal benefit. The threshold is slip detection: any task where the object can slip during manipulation (rotation, translation, tool use) benefits significantly from tactile feedback. Without it, drop rates increase by 3x on smooth objects according to Yuan et al. (2023). Claru recommends including tactile modalities for any task involving in-hand manipulation.",
    },
    {
      question:
        "Can simulation data replace real-world dexterous demonstrations?",
      answer:
        "Partially, but the sim-to-real gap is severe. Multi-finger contact dynamics involve rolling, sliding, and stick-slip friction at multiple contact points simultaneously, and simulation contact models accumulate errors across 16-24 DOF. Chen et al. (2023) showed sim-to-real transfer achieves only 60-70% of real-data policy performance for in-hand reorientation. The recommended approach is simulation pretraining on 1M+ episodes with domain randomization, followed by fine-tuning on 2,000-10,000 real demonstrations. This hybrid approach closes 80% of the sim-to-real gap while reducing real-data requirements by 5-10x.",
    },
    {
      question:
        "What data volume is needed for in-hand reorientation?",
      answer:
        "For a single object category with one rotation axis, 200-500 demonstrations suffice with Diffusion Policy. For generalizable reorientation across object shapes and all rotation axes, 5,000-20,000 demonstrations are recommended based on results from Qi et al. (2023) and HORA. The scaling law is approximately logarithmic: doubling the number of object categories requires roughly 50% more demonstrations to maintain the same success rate. Start with your highest-priority object set and scale based on held-out evaluation performance.",
    },
    {
      question:
        "Which robot hand platforms are best for dexterous data collection?",
      answer:
        "The Allegro Hand (16-DoF, $15K) is the most widely used research platform with the best software ecosystem and compatibility with DexMV, HORA, and other leading methods. The LEAP Hand (16-DoF, $2K) offers the best cost-to-capability ratio for labs on a budget. The Shadow Dexterous Hand (24-DoF, $100K+) provides the highest dexterity but is prohibitively expensive for multi-station collection. For commercial deployment data, match the collection platform to your deployment hand to minimize the embodiment transfer gap.",
    },
    {
      question:
        "How should object diversity be structured in dexterous datasets?",
      answer:
        "Use a factorial design across four axes: size (small 2-5 cm, medium 5-10 cm, large 10-15 cm), weight (light under 100g, medium 100-500g, heavy 500g-2kg), surface friction (smooth, textured, rough), and compliance (rigid, semi-rigid, deformable). Each combination needs 50-100 demonstrations for coverage. The YCB Object Set provides a standardized starting point with 77 objects spanning these axes. For domain-specific applications (surgical tools, electronic components), supplement with domain objects that capture the specific geometry and material properties your policy must handle.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Dexterous Manipulation Data",
  ctaDescription:
    "Tell us your hand platform, target tasks, and object requirements. We will design a collection plan with the tactile sensing and fingertip annotations your policy needs.",
  relatedGlossaryTerms: [
    "dexterous-manipulation",
    "hand-object-interaction",
    "contact-rich-manipulation",
    "tactile-sensor-data",
  ],
  relatedGuidePages: [
    "how-to-collect-dexterous-manipulation-data",
    "how-to-build-a-contact-rich-manipulation-dataset",
  ],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB + depth + tactile sensor arrays + per-finger joint positions",
    volumeRange: "5K-50K demonstrations per task family",
    temporalResolution:
      "30 Hz video, 100-1000 Hz tactile, 100 Hz proprioception",
    keyAnnotations: [
      "Fingertip contact forces per finger",
      "Grasp stability labels (stable, slipping, dropped)",
      "In-hand 6-DoF object pose trajectory",
      "Object slip detection events",
      "Contact point mapping per fingertip",
      "Finger gaiting phase annotations",
    ],
  },
  relevantModels: [
    "DexMV",
    "HORA / RotateIt",
    "AnyTeleop",
    "DexGraspNet",
    "LEAP Hand policies",
    "Diffusion Policy (dexterous)",
  ],
  environmentTypes: [
    "Tabletop",
    "Tool bench",
    "Assembly station",
    "Laboratory",
    "Surgical workspace",
  ],
  keyPapers: [
    {
      id: "arunachalam-dexmv-2023",
      title:
        "Dexterous Imitation Made Easy: A Learning-Based Framework for Efficient Dexterous Manipulation",
      authors: "Arunachalam et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2203.16257",
    },
    {
      id: "qi-tactile-2023",
      title: "General In-Hand Object Rotation with Vision and Touch",
      authors: "Qi et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.16600",
    },
    {
      id: "shaw-leap-2023",
      title:
        "LEAP Hand: Low-Cost, Efficient, and Anthropomorphic Hand for Robot Learning",
      authors: "Shaw et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.01918",
    },
    {
      id: "chen-dexpoint-2023",
      title:
        "Visual Dexterity: In-Hand Reorientation of Novel Objects with Partial Point Clouds",
      authors: "Chen et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.11744",
    },
    {
      id: "akkaya-rubiks-2019",
      title: "Solving Rubik's Cube with a Robot Hand",
      authors: "Akkaya et al.",
      venue: "arXiv 1910.07113",
      year: 2019,
      url: "https://arxiv.org/abs/1910.07113",
    },
  ],
  claruRelevance:
    "Claru supports dexterous manipulation data collection with specialized operators trained on multi-fingered teleoperation interfaces including vision-based hand retargeting and instrumented glove systems. Our collection rigs integrate synchronized tactile sensors (GelSight Mini, DIGIT) on each fingertip with multi-view RGB-D cameras and 100+ Hz proprioceptive logging. We support Allegro Hand, LEAP Hand, and custom platforms with per-hand calibration protocols ensuring consistent data quality. Operators complete a dexterous-specific qualification protocol assessing finger coordination, manipulation success rates, and demonstration smoothness. Session limits of 30 minutes prevent cognitive fatigue from degrading multi-finger coordination quality. We deliver data with per-finger joint trajectories, fingertip contact force maps, object 6-DoF pose trajectories, grasp stability annotations, and finger gaiting phase labels in RLDS or HDF5 format compatible with DexMV, HORA, Diffusion Policy, and custom architectures.",
};

export default data;
