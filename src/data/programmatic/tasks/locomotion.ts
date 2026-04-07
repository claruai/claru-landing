import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "locomotion",
  metaTitle: "Locomotion Training Data for Legged Robots | Claru",
  metaDescription:
    "Training data for legged robot locomotion: walking, running, stair climbing, terrain traversal. Motion capture and proprioceptive recordings for quadrupeds and bipeds.",
  primaryKeyword: "legged robot locomotion data",
  secondaryKeywords: [
    "locomotion dataset",
    "quadruped walking data",
    "bipedal locomotion training",
    "humanoid locomotion data",
    "terrain traversal dataset",
    "robot gait training data",
  ],
  canonicalPath: "/training-data/locomotion",
  h1: "Locomotion Training Data",
  heroSubtitle:
    "Locomotion datasets for legged robots — motion capture references, terrain traversal recordings, and proprioceptive data for training agile quadruped and humanoid walking, running, and climbing policies.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Locomotion", href: "/training-data/locomotion" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Locomotion in Robotics and Why Does Data Matter?",
      paragraphs: [
        "Legged locomotion is one of the most dynamic control problems in robotics. A quadruped walking at a moderate pace makes and breaks ground contacts at 2-4 Hz per leg, with each contact lasting 200-400 ms. During each stance phase, the leg must support body weight (50-100 kg for production quadrupeds like Spot or ANYmal), propel the body forward, and adjust to terrain geometry — all while maintaining lateral stability and coordinating with the other three legs. A humanoid biped faces an even harder balance problem: with only two legs, the support polygon is narrow and the center of mass is high, requiring continuous adjustment of hip, knee, and ankle torques at 200+ Hz to prevent falling.",
        "Reinforcement learning in simulation has achieved remarkable locomotion results. Miki et al. (2022) trained ANYmal to traverse stairs, rubble, gaps, and steep slopes using RL in IsaacGym with privileged terrain information during training and only proprioceptive sensing at deployment. The policy learned to probe terrain with cautious steps, brace for expected impacts, and recover from stumbles — all from simulation alone. Similarly, Rudin et al. (2022) showed that a massively parallel RL training pipeline in IsaacGym can produce robust quadruped locomotion policies in under 20 minutes of GPU training time.",
        "However, simulation-trained locomotion policies exhibit characteristic weaknesses that real-world data addresses. Sim-to-real transferred gaits are often energy-inefficient — consuming 30-50% more power than equivalent animal gaits — because simulation rewards optimize task completion rather than biological optimality criteria. Peng et al. (2020) demonstrated that imitation of real animal motion capture data produces gaits that are both more natural-looking and 15-30% more energy-efficient than pure RL. The motion capture references provide a strong prior on what 'good' locomotion looks like, constraining the RL solution space to gaits that resemble evolved biological strategies.",
        "Real-world terrain data is also essential for the perception pipeline that feeds locomotion policies. Exteroceptive locomotion — where the robot uses cameras or LiDAR to see upcoming terrain before stepping on it — requires terrain perception models trained on real-world data. Simulation environments model terrain geometry accurately but cannot replicate the full visual complexity of outdoor surfaces: mud textures, wet rock reflections, grass blade occlusions, snow-covered steps, and the countless surface appearances that a robust terrain classifier must handle. Agarwal et al. (2023) showed that egocentric terrain perception for locomotion benefits strongly from real-world visual data, with outdoor success rates improving from 71% to 89% when real terrain images augmented the simulation-trained perception model.",
      ],
    },
    {
      type: "stats",
      heading: "Locomotion Data by the Numbers",
      stats: [
        { value: "200+ Hz", label: "Minimum proprioceptive control rate" },
        { value: "15-30%", label: "Energy savings from motion capture priors" },
        { value: "89%", label: "Outdoor success with real terrain perception data" },
        { value: "2-4 Hz", label: "Contact frequency per leg (walking)" },
        { value: "<20 min", label: "IsaacGym quadruped policy training time" },
        { value: "8+", label: "Terrain types for general deployment" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Locomotion Approach",
      description:
        "Locomotion learning spans from pure simulation to demonstration-driven approaches. Each has distinct data needs.",
      columns: [
        "Approach",
        "Real Data Needed",
        "Primary Data Type",
        "Sim Data Role",
        "Strengths",
      ],
      rows: [
        {
          Approach: "Pure sim RL + sim-to-real transfer",
          "Real Data Needed": "0 demos (system ID calibration only)",
          "Primary Data Type": "Motor parameters + terrain friction measurements",
          "Sim Data Role": "100% — all learning in simulation",
          Strengths: "No real robot demos needed; fast iteration",
        },
        {
          Approach: "Motion capture imitation + RL",
          "Real Data Needed": "1-10 hours of animal/human MoCap",
          "Primary Data Type": "Optical MoCap at 120-500 Hz",
          "Sim Data Role": "RL fine-tuning in simulation against MoCap reference",
          Strengths: "Natural, energy-efficient gaits; smooth style",
        },
        {
          Approach: "Learned terrain perception",
          "Real Data Needed": "10K-100K real terrain images with labels",
          "Primary Data Type": "Egocentric RGB-D + terrain traversability labels",
          "Sim Data Role": "Pretraining on simulated terrain textures",
          Strengths: "Handles real visual complexity (mud, snow, glass)",
        },
        {
          Approach: "Skill learning from demonstrations",
          "Real Data Needed": "100-1K demos of specific skills (jumping, spinning)",
          "Primary Data Type": "Full-body proprioception at 500+ Hz + IMU + video",
          "Sim Data Role": "Optional — RL refinement of learned skills",
          Strengths: "Learns complex acrobatic behaviors directly",
        },
        {
          Approach: "World model + model-predictive control",
          "Real Data Needed": "10K-50K transition tuples from real terrain",
          "Primary Data Type": "Proprioception + exteroception + contact flags",
          "Sim Data Role": "Pre-training the world model dynamics",
          Strengths: "Adapts to novel terrain online; sample-efficient",
        },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Locomotion",
      paragraphs: [
        "ANYmal perceptive locomotion (Miki et al., 2022) demonstrated that a single RL policy can navigate stairs, rubble, gaps, and steep slopes using only proprioceptive and exteroceptive sensing — no terrain map or pre-planned path. The policy was trained entirely in IsaacGym simulation using a teacher-student framework: a privileged teacher had access to ground-truth terrain heightmaps, while the student policy learned to estimate terrain from proprioceptive history and onboard depth sensing. Deployed on the 50 kg ANYmal C robot, the policy achieved 92% success on a challenging outdoor obstacle course including 20-degree slopes, 15 cm rubble, and 25 cm gaps between stepping stones.",
        "Peng et al. (2020) introduced AMP (Adversarial Motion Priors) for learning animal-like locomotion from motion capture. By training a discriminator to distinguish between the robot's movements and real animal motion data (from dog motion capture), AMP produces gaits that match animal dynamics without explicit reward engineering. Trained on 30 minutes of real dog motion capture, AMP-trained quadruped policies walk, trot, canter, and pace with natural-looking transitions between gaits. The energy efficiency improved by 23% compared to pure reward-based RL, demonstrating the concrete value of real motion data as a learning prior.",
        "For humanoid locomotion, the field accelerated dramatically in 2023-2024. Radosavovic et al. (2024) demonstrated real-world humanoid walking on Digit using a policy trained in simulation with a combination of RL and reference motion data. The policy achieved stable walking at 1.2 m/s on flat ground and 0.8 m/s on grass — speeds that require precise timing of the double-support to single-support transitions that define human walking. The training used 50 hours of human walking motion capture as a style reference, producing gaits rated as more natural by human evaluators than any prior sim-to-real humanoid policy.",
        "Parkour-level locomotion was demonstrated by Zhuang et al. (2023) and Cheng et al. (2024), who trained quadruped robots to jump over 60 cm gaps, vault onto boxes, and execute backflips. These extreme locomotion skills required both simulation training and real-world fine-tuning data: the simulation provided initial policy learning in safe conditions, while 500-1,000 real-world trials of each parkour skill corrected for the sim-to-real dynamics gap that is particularly severe during high-impact maneuvers. The real-world trial data was essential — policies trained only in simulation failed 40% of jumps that required precise timing of ground reaction forces.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Locomotion Data",
      paragraphs: [
        "Locomotion data collection encompasses two distinct modalities: reference motion data (what the gait should look like) and real-world interaction data (what happens when the robot actually walks on real terrain). Reference motion data comes from optical motion capture of animals or humans performing target gaits. A standard setup uses 8-12 OptiTrack or Vicon cameras tracking 30-50 reflective markers attached to the animal or human subject, recording at 120-500 Hz. For quadruped references, trained dogs wearing custom marker suits perform walks, trots, canters, and specific behaviors (turning, standing up, lying down). For humanoid references, human subjects walk on instrumented treadmills and outdoor terrain courses.",
        "Real-world terrain interaction data captures the robot's proprioceptive experience during actual terrain traversal. This requires the robot to be instrumented for full-body state recording: joint position encoders at 1000 Hz, joint torque sensors or motor current measurements at 500-1000 Hz, IMU data at 200-400 Hz, and foot contact switches or force plates at 500+ Hz. The high frequency requirements are non-negotiable for locomotion — contact events during walking create force transients that last 10-50 ms and are invisible at lower sample rates. Missing these events means the policy cannot learn proper contact timing and force control.",
        "Terrain diversity is the primary quality axis for locomotion datasets. A production-grade locomotion dataset should cover at minimum 8 terrain types: flat hard floor, carpet, short grass, tall grass or brush, gravel/loose stone, sand, stairs (up and down, multiple step heights), and slopes (5-degree increments from 5 to 25 degrees). Each terrain type needs 30-60 minutes of continuous traversal data covering multiple speeds and direction changes. For exteroceptive (camera-based) locomotion, each terrain type also needs egocentric RGB-D imagery at 30 Hz paired with terrain type labels and traversability scores.",
        "Claru collects locomotion data using instrumented legged robot platforms deployed across purpose-built multi-terrain test courses and natural outdoor environments. Each recording includes full proprioceptive state at 500+ Hz, synchronized multi-view video at 30 Hz, and LiDAR terrain mapping for ground-truth elevation. Our outdoor courses include calibrated slope sections, stair sets at 4 standard heights (15, 18, 20, 25 cm), gravel beds, sand pits, and natural grass terrain. For motion capture references, we partner with biomechanics laboratories equipped with Vicon systems for precise animal and human gait capture.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Locomotion",
      description:
        "Public locomotion datasets include motion capture libraries, simulation benchmarks, and real-world deployment recordings.",
      columns: [
        "Dataset",
        "Year",
        "Scale",
        "Platform",
        "Terrain Types",
        "Modalities",
      ],
      rows: [
        {
          Dataset: "ANYmal in the Wild (Miki et al.)",
          Year: "2022",
          Scale: "100+ hours sim; 50+ real outdoor trials",
          Platform: "ANYmal C (quadruped)",
          "Terrain Types": "Stairs, rubble, slopes, gaps, forest",
          Modalities: "Proprioception + depth perception",
        },
        {
          Dataset: "AMP Dog MoCap (Peng et al.)",
          Year: "2020",
          Scale: "30 min of real dog motion capture",
          Platform: "A1 quadruped (deployment)",
          "Terrain Types": "Flat (MoCap studio)",
          Modalities: "Full-body MoCap at 120 Hz",
        },
        {
          Dataset: "Legged Gym / IsaacGym Locomotion",
          Year: "2022",
          Scale: "Billions of sim steps; procedural terrain",
          Platform: "ANYmal, A1, Cassie (sim)",
          "Terrain Types": "18 procedural terrain types",
          Modalities: "Simulated proprioception + height maps",
        },
        {
          Dataset: "CMU Motion Capture Database",
          Year: "2003-ongoing",
          Scale: "2,500+ human motion sequences",
          Platform: "Human subjects (Vicon)",
          "Terrain Types": "Indoor flat ground",
          Modalities: "Optical MoCap at 120 Hz + video",
        },
        {
          Dataset: "Extreme Parkour (Cheng et al.)",
          Year: "2024",
          Scale: "Sim + 500-1K real trials per skill",
          Platform: "Unitree A1 (quadruped)",
          "Terrain Types": "Flat, gaps, boxes, climbing walls",
          Modalities: "Proprioception + egocentric depth",
        },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Locomotion Data Needs",
      paragraphs: [
        "Claru provides locomotion data collection across two distinct pipelines: reference motion capture and real-world terrain interaction recording. For motion capture references, we partner with biomechanics laboratories equipped with Vicon or OptiTrack systems to capture animal gaits (dogs, cats, horses) and human locomotion at 120-500 Hz with 50-marker full-body configurations. Captured motions span walking, trotting, running, turning, stair climbing, and recovery behaviors, delivered in BVH, FBX, or custom retargetable formats.",
        "For real-world terrain data, we deploy instrumented legged platforms across multi-terrain test courses featuring calibrated slopes (5-25 degrees), stair sets at 4 standard heights, gravel beds, sand pits, grass terrain, and indoor hard surfaces. Each traversal recording includes 500+ Hz proprioception (joint positions, velocities, torques), 200 Hz IMU data, 30 Hz synchronized video, and LiDAR terrain mapping. Terrain type labels and traversability scores are annotated per trajectory segment for training terrain-aware perception models.",
        "Claru delivers locomotion datasets with gait phase annotations (stance, swing, double-support, flight), contact event timestamps at millisecond precision, terrain type classification per segment, center-of-mass trajectory estimates, and per-step foot placement coordinates. For clients training exteroceptive locomotion policies, we provide paired egocentric RGB-D imagery with terrain labels and traversability ground truth. Our data supports training pipelines for ANYmal, Spot, Unitree platforms, and humanoid robots including Digit, Atlas, and custom systems, with format conversion to match the target training framework.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "miki-anymal-2022",
          title:
            "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild",
          authors: "Miki et al.",
          venue: "Science Robotics 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2201.08117",
        },
        {
          id: "peng-amp-2021",
          title:
            "AMP: Adversarial Motion Priors for Stylized Physics-Based Character Animation",
          authors: "Peng et al.",
          venue: "SIGGRAPH 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2104.02180",
        },
        {
          id: "peng-loco-2020",
          title:
            "Learning Agile Robotic Locomotion Skills by Imitating Animals",
          authors: "Peng et al.",
          venue: "RSS 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2004.00784",
        },
        {
          id: "rudin-legged-2022",
          title:
            "Learning to Walk in Minutes Using Massively Parallel Deep Reinforcement Learning",
          authors: "Rudin et al.",
          venue: "CoRL 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2109.11978",
        },
        {
          id: "agarwal-legged-2023",
          title:
            "Legged Locomotion in Challenging Terrains using Egocentric Vision",
          authors: "Agarwal et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2211.07638",
        },
        {
          id: "cheng-parkour-2024",
          title:
            "Extreme Parkour with Legged Robots",
          authors: "Cheng et al.",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2309.14341",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Is real-world locomotion data necessary given simulation advances?",
      answer:
        "Simulation-only policies achieve 85-90% of optimal performance on standard terrains, but real data remains critical for three use cases: (1) terrain perception model training, where real visual complexity far exceeds simulation; (2) natural gait style transfer via motion capture references, which improves energy efficiency by 15-30%; and (3) high-impact skill refinement (jumping, parkour) where sim-to-real dynamics gaps cause 40% failure rates on precision timing. A 90/10 simulation/real split is cost-effective for most applications.",
    },
    {
      question:
        "What motion capture system works for outdoor locomotion data?",
      answer:
        "Outdoor MoCap options include GPS-RTK combined with body-mounted IMUs (centimeter accuracy, unlimited area), portable optical tracking (OptiTrack Active, 10x10m outdoor area, sub-millimeter accuracy), and markerless computer vision systems (Theia3D, no markers but lower accuracy). For large-scale outdoor terrain traversal, IMU-based motion estimation with periodic SLAM ground truth provides the best coverage-to-accuracy tradeoff. Claru uses a multi-sensor fusion approach combining IMU integration with visual-inertial odometry for continuous outdoor tracking.",
    },
    {
      question:
        "How many terrain types should a locomotion dataset cover?",
      answer:
        "A minimum of 8 terrain types for general quadruped deployment: flat hard floor, carpet, grass, gravel, sand, stairs (multiple heights), slopes (5-25 degrees), and curbs or single steps. Each terrain type needs 30-60 minutes of traversal at multiple speeds. For humanoid deployment, add cobblestone, wet surfaces, and transitions between terrain types. Terrain transitions (grass to gravel, flat to stairs) are particularly important and often under-represented in datasets.",
    },
    {
      question:
        "What is the minimum data frequency for locomotion?",
      answer:
        "Joint-level proprioception at 200 Hz minimum, with 500-1000 Hz strongly preferred for capturing contact force transients that last 10-50 ms. IMU data at 200 Hz for body orientation and angular velocity. Visual data at 30 Hz (sufficient for terrain perception). Foot contact data should match proprioception frequency. Lower proprioceptive rates introduce aliasing of contact dynamics that prevents the policy from learning proper foot placement timing and force control.",
    },
    {
      question:
        "How does locomotion data differ between quadrupeds and bipeds?",
      answer:
        "Quadruped data is simpler: 4 legs with 3-4 joints each, inherently more stable (4-point support polygon), and gait transitions are gradual. Biped data requires higher precision: 2 legs with 6+ joints each, the narrow support polygon demands precise center-of-mass tracking, and transitions between double-support and single-support phases must be captured at high temporal resolution. Biped datasets also need upper-body data (arms and torso) because arm swing is essential for balance. Expect 2-3x more annotation effort per hour of biped data compared to quadruped.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Locomotion Data",
  ctaDescription:
    "Describe your robot platform, target terrain environments, and locomotion skills, and we will design a data collection plan covering motion capture references and real-world terrain recordings.",
  relatedGlossaryTerms: [
    "proprioceptive-data",
    "sim-to-real-gap",
    "robot-learning",
    "motion-capture",
    "terrain-perception",
  ],
  relatedGuidePages: ["how-to-build-a-navigation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality:
      "Motion capture (optical/IMU) + joint encoders (1000 Hz) + IMU (200 Hz) + foot contact + terrain heightmap (LiDAR/depth)",
    volumeRange:
      "1-10 hours MoCap references + 10K-100K terrain traversal segments",
    temporalResolution:
      "120-500 Hz motion capture, 500-1000 Hz joint encoders, 200 Hz IMU, 30 Hz visual",
    keyAnnotations: [
      "Gait phase labels (stance, swing, double-support, flight)",
      "Terrain type classification per segment",
      "Contact event timestamps (foot contact/liftoff at ms precision)",
      "Center of mass trajectory estimates",
      "Foot placement coordinates",
      "Traversability scores per terrain patch",
    ],
  },
  relevantModels: [
    "ANYmal perceptive locomotion",
    "AMP (Adversarial Motion Priors)",
    "Legged Gym / IsaacGym policies",
    "Digit humanoid walking",
    "Parkour quadruped policies",
    "Model-predictive locomotion controllers",
  ],
  environmentTypes: [
    "Flat indoor floor",
    "Outdoor grass and dirt",
    "Stairs (multiple heights)",
    "Gravel and loose terrain",
    "Sand",
    "Slopes (5-25 degrees)",
    "Urban sidewalk with curbs",
  ],
  keyPapers: [
    {
      id: "miki-anymal-2022",
      title:
        "Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild",
      authors: "Miki et al.",
      venue: "Science Robotics 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2201.08117",
    },
    {
      id: "peng-loco-2020",
      title:
        "Learning Agile Robotic Locomotion Skills by Imitating Animals",
      authors: "Peng et al.",
      venue: "RSS 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2004.00784",
    },
    {
      id: "rudin-legged-2022",
      title:
        "Learning to Walk in Minutes Using Massively Parallel Deep Reinforcement Learning",
      authors: "Rudin et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2109.11978",
    },
    {
      id: "agarwal-legged-2023",
      title:
        "Legged Locomotion in Challenging Terrains using Egocentric Vision",
      authors: "Agarwal et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.07638",
    },
    {
      id: "cheng-parkour-2024",
      title: "Extreme Parkour with Legged Robots",
      authors: "Cheng et al.",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2309.14341",
    },
  ],
  claruRelevance:
    "Claru provides locomotion data collection across two pipelines. For reference motion capture, we partner with biomechanics laboratories equipped with Vicon or OptiTrack systems to capture animal and human gaits at 120-500 Hz with full-body marker configurations. Captured motions include walking, trotting, running, turning, stair climbing, and recovery behaviors in BVH, FBX, or retargetable formats. For real-world terrain data, we deploy instrumented legged platforms across multi-terrain test courses featuring calibrated slopes (5-25 degrees), stairs at 4 standard heights, gravel, sand, and natural outdoor terrain. Recordings include 500+ Hz proprioception, 200 Hz IMU, 30 Hz synchronized video, and LiDAR terrain mapping. Delivered datasets include gait phase labels, contact event timestamps at millisecond precision, terrain classification, and traversability scores. We support ANYmal, Spot, Unitree quadrupeds, and humanoid platforms including Digit with format conversion for IsaacGym, Legged Gym, or custom training pipelines.",
};

export default data;
