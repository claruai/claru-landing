import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-collect-dexterous-manipulation-data",
  metaTitle: "How to Collect Dexterous Manipulation Data (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to collecting dexterous manipulation data for robot learning — covering multi-finger hand hardware, tactile sensing, grasp taxonomies, and policy-ready formatting.",
  primaryKeyword: "how to collect dexterous manipulation data",
  secondaryKeywords: ["dexterous manipulation dataset","multi-finger grasp data","tactile manipulation data collection","dexterous hand teleoperation data","robot hand training data"],
  canonicalPath: "/guides/how-to-collect-dexterous-manipulation-data",
  h1: "How to Collect Dexterous Manipulation Data",
  heroSubtitle: "A practitioner's guide to building dexterous manipulation datasets — from multi-finger hand selection and tactile sensor integration through grasp taxonomy design, teleoperation interfaces, and formatting for dexterous policy training.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Collect Dexterous Manipulation Data", href: "/guides/how-to-collect-dexterous-manipulation-data" },
  ],
  sections: [
    {
      type: "prose",
      heading: "Why Dexterous Manipulation Data Is the Next Frontier",
      paragraphs: [
        "Parallel-jaw grippers can pick up most objects, but they cannot rotate a screwdriver, flip a pancake, or thread a needle. Dexterous manipulation with multi-finger hands enables the full range of human-like object interactions — and it requires fundamentally different training data. The action space jumps from 1 DOF (gripper open/close) to 16-24 DOF (individual finger joints), making the data requirements substantially higher and the collection process significantly more complex.",
        "The field is at an inflection point. Hardware costs are dropping (the LEAP Hand costs $2,000 versus $100,000+ for a Shadow Hand), teleoperation interfaces are maturing (VR hand tracking, DexPilot retargeting), and policy architectures like Diffusion Policy have proven capable of learning in high-dimensional action spaces. The bottleneck is now data: teams that can efficiently collect diverse, high-quality dexterous demonstrations will have a decisive advantage.",
        "This guide covers the unique requirements of dexterous data collection — from hand hardware selection and tactile sensor integration through grasp taxonomy design, VR-based teleoperation, and formatting for high-DOF policy training."
      ]
    },
    {
      type: "stats",
      heading: "Dexterous Manipulation Data Requirements",
      stats: [
        { value: "16-24 DOF", label: "Typical multi-finger hand action space" },
        { value: "200-500", label: "Demos per grasp-object pair for Diffusion Policy" },
        { value: "$2K-$100K+", label: "Hand hardware cost range (LEAP to Shadow)" },
        { value: "15-25%", label: "Expected episode filter rate for dexterous tasks" },
        { value: "2,000-3,000", label: "Grasps before replacing DIGIT sensor gel pads" },
        { value: "6-8 weeks", label: "Typical full dataset collection timeline" }
      ]
    },
    {
      type: "comparison-table",
      heading: "Dexterous Hand Hardware Comparison",
      columns: ["Hand", "DOF", "Cost", "Tactile Integration", "Sim Model Available"],
      rows: [
        { "Hand": "Allegro Hand V4", "DOF": "16", "Cost": "~$15,000", "Tactile Integration": "DIGIT adapters available", "Sim Model Available": "MuJoCo, Isaac Sim" },
        { "Hand": "LEAP Hand", "DOF": "16", "Cost": "~$2,000", "Tactile Integration": "Limited (community efforts)", "Sim Model Available": "MuJoCo (community)" },
        { "Hand": "Shadow Dexterous Hand", "DOF": "24", "Cost": "$100,000+", "Tactile Integration": "BioTac built-in", "Sim Model Available": "MuJoCo, Isaac Sim" },
        { "Hand": "Ability Hand (PSYONIC)", "DOF": "6+5 underactuated", "Cost": "~$10,000", "Tactile Integration": "Pressure sensors per finger", "Sim Model Available": "Limited" }
      ]
    },
    {
      type: "cards",
      heading: "Dexterous Data Collection Challenges",
      cards: [
        {
          title: "Retargeting Accuracy",
          description: "Human and robot hands have different kinematics. DexPilot-style retargeting introduces residual errors — monitor residual magnitude and flag episodes where it exceeds 5mm."
        },
        {
          title: "Operator Fatigue",
          description: "VR-based dexterous teleoperation is 2-3x more fatiguing than SpaceMouse control. Rotate operators every 2 hours and monitor success rate degradation over sessions."
        },
        {
          title: "Grasp Coverage Balance",
          description: "Operators default to easy grasps (medium wrap). Track the (grasp_type, object) distribution in real time and assign specific targets per session to ensure coverage."
        },
        {
          title: "Tactile Sensor Degradation",
          description: "GelSight gel pads degrade over 2,000-3,000 contacts, producing increasingly blurry images. Check baseline images at session start and replace pads proactively."
        }
      ]
    },
    {
      type: "prose",
      heading: "Sim-to-Real Data Strategies for Dexterous Manipulation",
      paragraphs: [
        "Pure real-world data collection for dexterous manipulation is expensive and slow — 8,400 demonstrations for full grasp taxonomy coverage takes 6-8 weeks. The most efficient approach combines simulated pretraining with targeted real-world fine-tuning. DexGraspNet generated millions of grasp poses in simulation across 5,355 objects, and UniDexGrasp++ demonstrated that sim-pretrained policies transfer to real hardware with 100-500 real demonstrations.",
        "To build a hybrid pipeline: first, generate 100K-1M simulated grasps in Isaac Sim or MuJoCo using your hand's URDF model. Apply aggressive domain randomization: object scale (0.8-1.2x), surface friction (0.3-1.0), table height (+/- 5cm), camera viewpoint noise, and rendering randomization (lighting, texture, background). Second, collect 2,000-5,000 real demonstrations focusing on the grasp types and objects where sim-to-real transfer is weakest — typically precision grasps on small objects and grasps on deformable materials where simulated physics is least accurate.",
        "The key validation metric is grasp success rate on real hardware, stratified by grasp type. If power grasps transfer well from sim (>80% success) but precision grasps do not (<40% success), invest real-world collection budget specifically on precision grasps rather than collecting more power grasps that the simulator already handles.",
        "For tactile data, simulation is currently less reliable — GelSight tactile simulation (TACTO, Taxim) produces reasonable contact patches but misses subtle deformation patterns that real sensors capture. If your policy uses tactile input, real-world data for the tactile modality is non-negotiable. A practical hybrid: use sim data for the vision-proprioception pathway and real data exclusively for the tactile pathway."
      ]
    }
  ],
  faqs: [
    {
      question: "What hand hardware is best for collecting dexterous manipulation data?",
      answer: "The choice depends on your target dexterity level and budget. The Allegro Hand V4 (16 DoF, ~$15,000) is the most widely used in research — it has extensive ROS2 support, a proven teleoperation stack via VR gloves, and published baselines from DexGraspNet and UniDexGrasp. The LEAP Hand (~$2,000, open-source) is a low-cost alternative with 16 actuated joints and a growing community, but lacks integrated tactile sensing. For human-level dexterity research, the Shadow Dexterous Hand (24 DoF, ~$100,000+) offers the highest fidelity but requires significant integration effort. If collecting data specifically for sim-to-real transfer, match your physical hand to an available simulated model — the Allegro and Shadow hands both have accurate MJCF and URDF models in MuJoCo and Isaac Sim. Start with the Allegro unless your task specifically requires thumb opposition patterns that only the Shadow supports."
    },
    {
      question: "How do you teleopererate a multi-finger robot hand for data collection?",
      answer: "Three teleoperation approaches dominate dexterous data collection. (1) VR hand tracking: Meta Quest 3 hand tracking maps 25 human hand joints to robot joint targets via retargeting — the DexPilot retargeting algorithm (Handa et al.) handles kinematic differences between human and robot hands. Operators reach proficiency in 1-2 hours and throughput is 15-25 demonstrations per hour. (2) Cyber gloves with force feedback: CyberGlove III or StretchSense gloves provide 18-22 joint angles at 100 Hz with haptic feedback through ERM motors. More expensive (~$10,000-25,000) but yields smoother trajectories because operators feel resistance. (3) Kinesthetic teaching: physically guiding the robot hand through the motion while recording joint states. Works well for simple grasps but scales poorly for complex in-hand manipulation. For production datasets, VR hand tracking offers the best throughput-to-cost ratio. Always record both the raw human hand pose and the retargeted robot joint targets — the mapping function may change as you iterate."
    },
    {
      question: "How important is tactile sensing for dexterous manipulation datasets?",
      answer: "Tactile data is critical for contact-rich tasks like in-hand rotation, tool use, and deformable object manipulation, but optional for pick-and-place grasping. If your target policy will use tactile input, integrate sensors during data collection rather than attempting to retrofit later. The DIGIT sensor ($300/finger, GelSight-based) provides 320x240 tactile images at 30 fps and has strong open-source support. BioTac SP sensors ($1,500/finger) offer richer multimodal output (electrode impedance, pressure, temperature) but are harder to integrate and no longer manufactured. For a cost-effective setup, instrument 3 fingertips (thumb + index + middle) with DIGIT sensors — these fingers handle 90%+ of manipulation contacts in typical grasp taxonomies. Record tactile images as synchronized PNG streams alongside joint states. Expect 50-100 MB per episode with tactile, versus 5-10 MB without."
    },
    {
      question: "What grasp taxonomy should a dexterous manipulation dataset cover?",
      answer: "Use the Feix grasp taxonomy (33 grasp types organized into power, precision, and intermediate categories) as a starting framework, then prune to the subset relevant to your objects and tasks. For household manipulation, the 10 most common grasps cover 85%+ of daily activities: medium wrap, lateral pinch, tip pinch, tripod, palmar, spherical, cylindrical, hook, platform, and index finger extension. Define each grasp type with a reference image, required finger contact pattern, and 2-3 example objects. Track grasp type distribution during collection to ensure coverage — a dataset that is 80% medium wrap grasps will produce a policy that defaults to wrapping regardless of object geometry. Aim for at least 30 demonstrations per grasp type per object category. For in-hand manipulation tasks (rotation, translation, pivoting), define a separate task taxonomy based on the manipulation primitive and object shape."
    },
    {
      question: "How many demonstrations are needed for dexterous manipulation policies?",
      answer: "Dexterous manipulation requires significantly more data than parallel-jaw grasping due to the high-dimensional action space (16-24 DoF). For single-grasp-type policies using Diffusion Policy, 200-500 demonstrations per grasp-object pair typically yield >80% success. For multi-grasp policies that must select the appropriate grasp type, scale to 1,000-3,000 total demonstrations spanning the grasp taxonomy. In-hand manipulation tasks (e.g., rotating a cube 90 degrees) are particularly data-hungry — DextrAH-G reported needing 5,000+ demonstrations for reliable sim-to-real transfer. Foundation models like UniDexGrasp++ trained on 10,000+ demonstrations across 3,000+ objects in simulation, then fine-tuned with 100-500 real demonstrations. The most data-efficient approach is to pretrain in simulation with domain randomization, then fine-tune with a small real-world dataset. Start with a 100-demonstration pilot for your hardest task to calibrate data requirements."
    }
  ],
  ctaHeading: "Need Dexterous Manipulation Data?",
  ctaDescription: "Claru builds dexterous manipulation datasets with multi-finger hands, tactile sensing, and comprehensive grasp coverage. Talk to a specialist about your specific hand hardware and task requirements.",
  relatedGlossaryTerms: ["dexterous-manipulation","teleoperation-data","hand-object-interaction"],
  relatedGuidePages: ["how-to-setup-a-teleoperation-rig","how-to-create-a-robot-demonstration-dataset"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  difficulty: "advanced",
  estimatedTime: "4-8 weeks",
  prerequisites: ["Multi-finger robot hand (Allegro, LEAP, or Shadow)","Teleoperation interface (VR headset or cyber glove)","ROS2 Humble with hand driver package","RGB-D cameras with calibration equipment","Python 3.10+ with NumPy, h5py, and PyTorch"],
  tools: ["ROS2","Allegro Hand ROS2 Driver","Meta Quest 3 Hand Tracking","DIGIT Tactile Sensors","Python","NumPy","h5py","Open3D"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Grasp Taxonomy and Data Specification",
      description: "Dexterous manipulation datasets require careful upfront planning because the action space is vastly larger than parallel-jaw grasping — a 16-DoF Allegro Hand has 16 joint position targets per timestep versus 1 DoF for a binary gripper. Start by defining the grasp taxonomy your dataset will cover. Use the Feix taxonomy as a reference and select the subset relevant to your target objects: for kitchen manipulation, prioritize medium wrap, tripod, lateral pinch, tip pinch, and palmar grasps. For tool use, add hook grip, index finger extension, and lateral tripod.\n\nFor each grasp type, create a reference card with: a photo of the grasp on a canonical object, the expected finger contact pattern (which fingertips/pads touch the object), the pre-grasp aperture configuration, and 2-3 example objects. This reference card becomes the annotator's bible during collection. Then write the full data specification: observation space (RGB images at 640x480 from 2-3 cameras, depth maps, 16-DoF joint positions at 100 Hz, 16-DoF joint torques, optional tactile images at 30 Hz per instrumented finger), action space (16-DoF target joint positions or joint velocity commands, typically at 20 Hz control frequency), episode structure (approach, pre-grasp, grasp, lift/manipulate, place), and success criteria per task. Share this spec with all stakeholders and freeze it before purchasing hardware or scheduling operators.",
      tools: ["Feix Grasp Taxonomy reference", "Markdown/Notion for spec documents"],
      tips: ["Map your grasp taxonomy to the ContactPose or DexGraspNet object categories if you plan to leverage sim pretraining data"]
    },
    {
      stepNumber: 2,
      title: "Set Up the Hand Hardware and Sensor Rig",
      description: "Assemble and calibrate the complete hardware stack: robot hand, arm (if wrist-mounted), cameras, and optional tactile sensors. For an Allegro Hand V4 mounted on a Franka Panda, install the allegro_hand_ros2 driver and verify joint-level position control at 333 Hz (the Allegro's native control rate). Set joint position limits 5 degrees inside the mechanical stops to prevent damage during aggressive teleoperated motions. Configure a workspace safety box in Cartesian space (typically 40x40x40 cm) with the arm controller enforcing soft limits.\n\nFor the camera rig, mount an Intel RealSense D435i at a 45-degree angle for a workspace overview (640x480 at 30 fps), a second D435i as a wrist camera on the arm's flange pointing at the hand-object interaction zone, and optionally a third overhead camera for supervision. Calibrate intrinsics with a ChArUco board (target reprojection error <0.3 px) and extrinsics via hand-eye calibration using the Tsai-Lenz method. If using DIGIT tactile sensors, mount them on the thumb, index, and middle fingertips using the provided 3D-printed adapters. Connect each DIGIT via USB and verify the GelSight image stream at 30 fps — check that the sensor gel is not damaged (look for dark spots or delamination) before every collection session. Synchronize all sensor streams via ROS2 message_filters with a 15 ms slop tolerance. Run a full recording test: move the hand through 5 grasps and verify that all streams are captured with zero dropped frames.",
      tools: ["allegro_hand_ros2", "Intel RealSense SDK 2.0", "DIGIT Python SDK", "OpenCV 4.x"],
      tips: ["Replace DIGIT sensor gel pads every 2,000-3,000 grasps — degraded gel produces increasingly blurry tactile images that will poison your dataset"]
    },
    {
      stepNumber: 3,
      title: "Configure the Teleoperation Pipeline",
      description: "Build the teleoperation mapping from human hand to robot hand. The most accessible approach uses Meta Quest 3 hand tracking via the Oculus SDK, which provides 25 human hand joint positions at 60 Hz. Implement a retargeting layer that maps human joint angles to robot joint targets while respecting kinematic differences — the DexPilot algorithm (Handa et al., RSS 2020) solves a per-frame optimization that minimizes fingertip position error subject to robot joint limits and is available as open-source Python code.\n\nKey retargeting parameters to tune: fingertip position weight (typically 10x higher than joint angle weight because fingertip accuracy matters most for grasping), self-collision avoidance margin (3-5 mm between finger links), and temporal smoothing (exponential moving average with alpha=0.7 to filter VR tracking jitter while preserving fast finger motions). Set the control frequency to 20 Hz for the retargeted targets — this is fast enough for manipulation tasks while giving the retargeting optimizer time to converge. Record both the raw human hand pose (25 joints) and the retargeted robot joint targets (16 joints) at every timestep, plus the retargeting residual (optimization error) as a quality signal. Train operators for 2-3 hours on progressively difficult tasks: free-space finger movements, then single-object power grasps, then precision grasps, then multi-step manipulation sequences. Track operator success rate and only allow operators who achieve >85% success on a standardized grasp test (pick up 10 objects of varying sizes from a predefined set) to contribute to the production dataset.",
      tools: ["Meta Quest 3 SDK", "DexPilot retargeting", "Python optimization (scipy.optimize)"],
      tips: ["Add a 'practice mode' indicator in the recording system so operators can warm up without contaminating the dataset — accidentally including warmup trials is a common mistake"]
    },
    {
      stepNumber: 4,
      title: "Execute Collection with Grasp Coverage Tracking",
      description: "Run production data collection in structured sessions with explicit grasp-type and object-category targets. Each session should target 3-5 grasp types on 5-10 objects to maintain operator focus while building diversity. A typical session structure: 5 minutes of warm-up grasps (not recorded), 60 minutes of production recording at 20-30 demonstrations per hour, 10-minute break, then another 60-minute block. Rotate operators every 2 hours to prevent fatigue-induced quality degradation — dexterous teleoperation is significantly more fatiguing than SpaceMouse control.\n\nBuild a real-time coverage dashboard in Streamlit that tracks: demonstrations per (grasp_type, object_category) pair, overall success rate by grasp type, tactile sensor health (if instrumented — detect flat-line or saturated readings), and recording integrity metrics. For each episode, automatically compute: task success (object lifted to target height or manipulation goal achieved), grasp stability score (force closure maintained for 2+ seconds), and trajectory smoothness (mean jerk of joint trajectories). Flag episodes where retargeting residual exceeds 5 mm for review — high residual means the human hand pose could not be accurately mapped to the robot, producing ambiguous training data. Target at least 50 demonstrations per (grasp_type, object_category) combination for the training split, with 10 for validation and 10 for test. For a dataset spanning 8 grasp types and 15 objects, this means approximately 8,400 total demonstrations — budget 6-8 weeks of collection at 100-150 demonstrations per day.",
      tools: ["Streamlit dashboard", "pandas", "matplotlib"],
      tips: ["Record a video of the human operator's hand alongside the robot data — this becomes invaluable for debugging retargeting failures during post-processing"]
    },
    {
      stepNumber: 5,
      title: "Post-Process Tactile Data and Validate Quality",
      description: "Dexterous manipulation datasets require specialized post-processing beyond standard robot datasets. First, process tactile images: convert raw GelSight images to contact maps by subtracting the no-contact reference image (captured at the start of each session) and computing the pixel-wise deformation magnitude. Store both raw tactile images (for models that learn directly from pixels) and processed contact maps (for models that use structured tactile features). Apply temporal alignment between tactile streams (30 Hz), joint state streams (100 Hz), and camera streams (30 Hz) using interpolation to a common 20 Hz timeline matching the control frequency.\n\nFor quality validation, compute grasp-specific metrics: force closure analysis using the GraspIt! engine or the analytical grasp quality metric Q1 (minimum singular value of the grasp wrench space), finger contact detection from tactile thresholding (contact = tactile deformation > 0.5 mm), and grasp type classification to verify that the recorded grasp matches the intended taxonomy label. Run an automated classifier (train a simple CNN on 500 manually-verified examples per grasp type) to detect label mismatches — operators occasionally use the wrong grasp type under time pressure. Remove episodes with: retargeting residual > 5 mm at any timestep, fewer than 3 finger contacts during the stable grasp phase, joint velocity spikes exceeding 5 rad/s (indicating teleoperation glitches), or tactile sensor dropout > 2% of frames. Expect to filter 15-25% of raw demonstrations for dexterous tasks, versus 10-15% for simpler manipulation.",
      tools: ["GraspIt!", "Open3D", "scikit-learn", "NumPy", "h5py"],
      tips: ["Compute per-object grasp success rate stratified by operator — if one operator consistently fails on small objects, the retargeting calibration for their hand size may need adjustment"]
    },
    {
      stepNumber: 6,
      title: "Format for Dexterous Policy Training and Validate End-to-End",
      description: "Convert the validated dataset to your target training format. For dexterous policies using Diffusion Policy or ACT, the standard format is HDF5 with per-episode files containing: /observations/images/{camera_name} as uint8 arrays, /observations/joint_positions as float32 (16,), /observations/joint_torques as float32 (16,), /observations/tactile/{finger_name} as uint8 arrays (if instrumented), /actions as float32 (16,) target joint positions, and /metadata as JSON with grasp_type, object_id, success, operator_id. Normalize joint positions to [-1, 1] using the joint limits from the URDF and store the normalization bounds as a sidecar JSON file.\n\nFor RLDS format (needed if fine-tuning on cross-embodiment data from Open X-Embodiment), note that the standard RLDS schema expects a single 7-DoF action vector — you will need to extend the schema for 16-DoF hands. Define a custom features_dict with the expanded action space. Generate stratified train/val/test splits (80/10/10) stratified by (grasp_type, object_category, operator_id) to ensure each split contains representative examples. Final validation: train a lightweight Diffusion Policy (100 diffusion steps, 4-layer U-Net) on the training split for 500 epochs and evaluate grasp success on the validation split. If success rate on the easiest grasp type (medium wrap) exceeds 50%, the dataset is likely clean. If training diverges, check action normalization, joint ordering consistency, and observation-action temporal alignment. Ship the dataset with a comprehensive datasheet and a working PyTorch DataLoader example.",
      tools: ["h5py", "tensorflow-datasets", "PyTorch", "Zarr (optional)"],
      tips: ["Include a visualization script that renders an episode as a multi-panel video showing all camera views, tactile contact maps, and joint angle trajectories simultaneously — this is the fastest way for users to understand the data structure"]
    }
  ],
  keyPapers: [
    {
      id: "handa-dexpilot-2020",
      title: "DexPilot: Vision-Based Teleoperation of Dexterous Robotic Hand-Arm System",
      authors: "Handa et al.",
      venue: "ICRA 2020",
      year: 2020,
      url: "https://arxiv.org/abs/1910.03135"
    },
    {
      id: "wang-dexgraspnet-2023",
      title: "DexGraspNet: A Large-Scale Robotic Dexterous Grasp Dataset for General Objects",
      authors: "Wang et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2210.02697"
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "shaw-leap-hand-2023",
      title: "LEAP Hand: Low-Cost, Efficient, and Anthropomorphic Hand for Robot Learning",
      authors: "Shaw et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.06440"
    }
  ],
  claruRelevance: "Claru builds dexterous manipulation datasets for teams training multi-finger grasp and in-hand manipulation policies. We operate teleoperation stations with Allegro and LEAP hands, integrated DIGIT tactile sensors, and trained operators experienced in VR-based retargeted control. We handle the full pipeline — grasp taxonomy design, sensor calibration, real-time QA, tactile post-processing, and delivery in HDF5 or RLDS format — so your team can focus on policy development.",
};

export default data;
