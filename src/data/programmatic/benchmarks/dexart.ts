import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "dexart",
  benchmarkName: "DexArt",
  benchmarkDescription:
    "DexArt is a benchmark for dexterous manipulation of articulated objects using multi-finger robotic hands. Presented at CVPR 2023 by Bao et al., it evaluates policies on tasks requiring coordinated finger movements to operate real-world mechanisms — faucets, laptops, buckets, and toilet seats — using a simulated 16-DOF Allegro hand in the SAPIEN physics engine.",
  taskSet:
    "4 articulated object manipulation tasks: turning faucet handles, opening laptop lids, lifting bucket handles, and flipping toilet seats. Each task requires precise multi-finger coordination to operate articulated mechanisms from the PartNet-Mobility dataset. Tasks include intra-category generalization — training on some faucet models and evaluating on held-out faucet geometries.",
  observationSpace:
    "Point clouds of the workspace (1,024 points), Allegro hand joint positions (16 joints), object joint angles, and contact indicators from fingertips. Visual observations are processed as 3D point clouds rather than 2D images.",
  actionSpace:
    "16-DOF Allegro hand joint position targets for dexterous manipulation. Each finger has 4 joints, and the policy must coordinate all 16 simultaneously to achieve stable grasps and controlled mechanism operation.",
  evaluationProtocol:
    "Success rate on articulated object manipulation across randomized object poses and initial hand configurations. Tasks measure both binary success (mechanism operated past threshold angle) and manipulation quality (smooth operation without jerky movements or loss of contact). Intra-category generalization is evaluated on held-out object instances.",
  simToRealGap:
    "DexArt uses SAPIEN for articulated object physics but real mechanical assemblies have unique friction profiles, backlash, and resistance patterns that vary over their range of motion. The simulated Allegro hand model simplifies tendon routing, actuator compliance, and fingertip deformation. Real dexterous manipulation of faucets and laptop lids involves material interactions — rubber gaskets, spring-loaded hinges, hydraulic dampers — that parametric simulation cannot fully capture.",
  realWorldDataNeeds:
    "Real-world dexterous manipulation of articulated objects with multi-finger hands or human hands. Tactile and force data during mechanism operation showing how grip force and finger placement adapt to resistance. Diverse mechanical variation across the same object category — different faucet valve types, laptop hinge stiffnesses, bucket handle materials.",
  complementaryDatasets: [
    {
      name: "Custom Dexterous Articulated Object Collection",
      rationale:
        "Purpose-collected data operating real faucets, laptops, and mechanisms with multi-finger coordination and force measurements captures the adaptive grip strategies DexArt evaluates.",
    },
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Human hand manipulation of household mechanisms across 100+ locations provides demonstrations of adaptive, force-sensitive coordination with naturally varying mechanical resistance.",
    },
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Diverse contact-rich manipulation recordings provide broader understanding of object-hand interaction dynamics that transfers to dexterous articulated manipulation tasks.",
    },
  ],
  keyPapers: [
    {
      id: "bao-dexart-2023",
      title:
        "DexArt: Benchmarking Generalizable Dexterous Manipulation with Articulated Objects",
      authors: "Bao et al.",
      venue: "CVPR 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2305.05706",
    },
    {
      id: "chen-dexhand-2023",
      title:
        "Visual Dexterity: In-Hand Reorientation of Novel Objects",
      authors: "Chen et al.",
      venue: "ICRA 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2211.11744",
    },
    {
      id: "shaw-dexterous-2023",
      title:
        "Learning Dexterous Manipulation from Human Demonstrations",
      authors: "Shaw et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.04547",
    },
    {
      id: "qi-hand-teleop-2023",
      title:
        "General In-Hand Object Rotation with Vision and Touch",
      authors: "Qi et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2309.16600",
    },
  ],
  technicalAnalysis:
    "DexArt addresses the intersection of two hard problems: dexterous manipulation and articulated object interaction. Each problem alone is challenging; together they create a high-dimensional contact space where finger placement, force application, and timing must coordinate precisely with object mechanism dynamics.\n\nThe faucet task illustrates the challenge. Turning a real faucet handle requires gripping the handle (contact planning), applying rotational force (torque control), and following the mechanism's arc (trajectory following) — all with fingers that must maintain contact despite the handle's changing position and orientation. In simulation, friction is constant and the mechanism arc is perfectly known. On real hardware, friction varies with grip position, the mechanism has backlash and resistance peaks, and the hand must adapt in real-time to unexpected forces.\n\nDexArt's use of PartNet-Mobility objects provides geometric diversity but not mechanical diversity. All simulated faucets use the same friction model and joint dynamics parametrized by a few constants. Real faucets range from smooth ball valves to stiff compression valves, each requiring fundamentally different grip strategies and force profiles. A ball valve needs gentle rotational force; a compression valve needs strong downward push combined with rotation.\n\nThe point cloud observation space is a deliberate design choice that avoids the visual sim-to-real gap but introduces a 3D perception challenge. Real depth sensors produce noisy, incomplete point clouds with occlusions from the hand itself. Policies trained on clean simulated point clouds must handle these artifacts when deployed with real depth cameras.\n\nHuman hand manipulation of these everyday mechanisms provides the richest training signal for dexterous policies. Claru's egocentric data captures humans operating faucets, laptops, and household mechanisms naturally — providing demonstrations of the adaptive, force-sensitive manipulation that DexArt evaluates.",
  metaTitle:
    "Real-World Data for DexArt Dexterous Manipulation Benchmark | Claru",
  metaDescription:
    "Dexterous articulated object manipulation data for DexArt's multi-finger benchmark including faucets, laptops, and household mechanisms.",
  primaryKeyword: "DexArt benchmark real-world data",
  secondaryKeywords: [
    "dexterous manipulation data",
    "articulated object manipulation",
    "multi-finger robot data",
    "Allegro hand data",
    "DexArt sim-to-real",
  ],
  canonicalPath: "/benchmarks/dexart",
  h1: "Real-World Data for DexArt",
  heroSubtitle:
    "DexArt benchmarks dexterous manipulation of everyday mechanisms with a 16-DOF Allegro hand. Real-world data captures the mechanical variation that simulation cannot parametrize.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "DexArt", href: "/benchmarks/dexart" },
  ],
  sections: [
    {
      type: "stats",
      heading: "DexArt at a Glance",
      stats: [
        { value: "4", label: "Tasks" },
        { value: "16-DOF", label: "Allegro Hand" },
        { value: "SAPIEN", label: "Physics Engine" },
        { value: "Point Cloud", label: "Observation" },
        { value: "2023", label: "Released" },
      ],
    },
    {
      type: "prose",
      heading: "What Is DexArt?",
      paragraphs: [
        "DexArt is a benchmark introduced at CVPR 2023 that evaluates dexterous manipulation of articulated objects — mechanisms with joints and moving parts like faucets, laptop lids, bucket handles, and toilet seats. Unlike benchmarks that test grasping rigid objects, DexArt tests whether multi-finger robotic hands can operate everyday mechanisms that require coordinated finger movements and force application.",
        "The benchmark uses a simulated 16-DOF Allegro hand in the SAPIEN physics engine, with articulated object models from the PartNet-Mobility dataset. Each task requires the policy to discover an effective grip, apply the right forces at the right angles, and follow the mechanism's kinematic constraints — all from point cloud observations rather than privileged state information.",
        "DexArt's key contribution is its focus on intra-category generalization. Within each task (e.g., faucets), the benchmark trains on a subset of object geometries and evaluates on held-out instances. A faucet-turning policy must generalize from round-handle faucets to lever-handle faucets, adapting its grip strategy to novel geometries.",
      ],
    },
    {
      type: "comparison-table",
      heading: "DexArt Task Suite",
      description:
        "Each task requires different dexterous strategies and presents distinct sim-to-real challenges.",
      columns: ["Task", "Mechanism Type", "Key Manipulation Skill", "Real-World Challenge"],
      rows: [
        {
          Task: "Turn Faucet",
          "Mechanism Type": "Revolute joint (handle rotation)",
          "Key Manipulation Skill": "Rotational torque with stable grip",
          "Real-World Challenge": "Valve type variation (ball, compression, cartridge)",
        },
        {
          Task: "Open Laptop",
          "Mechanism Type": "Revolute joint (hinge)",
          "Key Manipulation Skill": "Upward lift maintaining edge contact",
          "Real-World Challenge": "Hinge stiffness, screen weight, magnetic closure",
        },
        {
          Task: "Lift Bucket",
          "Mechanism Type": "Revolute joint (handle arc)",
          "Key Manipulation Skill": "Grasp and lift with weight compensation",
          "Real-World Challenge": "Handle material flex, load-dependent dynamics",
        },
        {
          Task: "Flip Toilet Seat",
          "Mechanism Type": "Revolute joint (soft-close hinge)",
          "Key Manipulation Skill": "Controlled rotation past gravity threshold",
          "Real-World Challenge": "Soft-close dampers, spring-loaded mechanisms",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "DexArt evaluates policies on both task success and manipulation quality. Binary success measures whether the mechanism was operated past a threshold angle — the faucet turned enough to activate, the laptop opened past 45 degrees. Manipulation quality measures smoothness: did the hand maintain stable contact throughout, or did fingers slip and re-grasp?",
        "Intra-category generalization is the primary evaluation dimension. The benchmark trains on a subset of object instances (e.g., 5 faucet models) and evaluates on held-out instances from the same category. This tests whether the policy learns general dexterous strategies or memorizes object-specific grip sequences.",
        "The point cloud observation makes evaluation more realistic than state-based benchmarks. The policy must identify graspable parts, plan finger placement, and track mechanism state from 1,024 3D points — a perception challenge that approximates real depth sensor input, though without the noise and occlusion artifacts of real sensors.",
      ],
    },
    {
      type: "comparison-table",
      heading: "DexArt vs. Related Dexterous Benchmarks",
      columns: ["Feature", "DexArt", "Real Robot Challenge", "DexMV", "In-Hand Reorientation"],
      rows: [
        {
          Feature: "Object type",
          DexArt: "Articulated mechanisms",
          "Real Robot Challenge": "Rigid cubes",
          DexMV: "Rigid objects",
          "In-Hand Reorientation": "Rigid objects",
        },
        {
          Feature: "Hand model",
          DexArt: "Allegro (16-DOF)",
          "Real Robot Challenge": "TriFinger (9-DOF)",
          DexMV: "Shadow Hand (24-DOF)",
          "In-Hand Reorientation": "Allegro (16-DOF)",
        },
        {
          Feature: "Key skill tested",
          DexArt: "Mechanism operation",
          "Real Robot Challenge": "Cube repositioning",
          DexMV: "Multi-finger grasping",
          "In-Hand Reorientation": "In-hand rotation",
        },
        {
          Feature: "Observation",
          DexArt: "Point cloud",
          "Real Robot Challenge": "RGB + state",
          DexMV: "RGB video",
          "In-Hand Reorientation": "Proprioception + tactile",
        },
        {
          Feature: "Generalization test",
          DexArt: "Intra-category objects",
          "Real Robot Challenge": "Cube pose variation",
          DexMV: "Object diversity",
          "In-Hand Reorientation": "Novel objects",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging Simulation to Reality for Dexterous Manipulation",
      paragraphs: [
        "The sim-to-real gap for DexArt is particularly severe because dexterous manipulation amplifies every physics modeling error. A parallel-jaw gripper has 1 DOF of grasping — it either grips or does not. A 16-DOF Allegro hand has a vast contact space where each finger independently contacts the mechanism. Small errors in friction modeling at each contact point compound across 4 fingers with 4 joints each.",
        "Real mechanical assemblies present additional challenges. A faucet's resistance profile changes over its range of motion — many faucets are stiffer at the extremes. Laptop hinges have variable damping designed for specific opening angles. Bucket handles have flex under load. These nonlinear mechanical properties are not captured by SAPIEN's constant-parameter joint models.",
        "Fingertip deformation is another critical gap. The Allegro hand has rubber fingertips that deform under contact, changing the friction surface area and grip stability. SAPIEN models fingertips as rigid bodies, missing the compliance that makes real grasps more stable than simulation predicts. Policies trained with rigid fingertips may apply excessive force when deployed on compliant real fingertips.",
        "Real-world data showing human or robot hands operating these same mechanisms provides the ground truth for all these gaps simultaneously. A video of someone turning a real faucet captures the friction profile, the grip adaptation, and the force modulation that simulation must approximate — making it a direct training signal for policies that must handle real mechanisms.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports DexArt Users",
      paragraphs: [
        "Claru provides the real-world dexterous manipulation data that DexArt's simulation cannot generate. Our egocentric activity dataset captures human hands operating faucets, laptops, and household mechanisms across 100+ locations, providing demonstrations with naturally varying mechanical resistance and authentic grip adaptation strategies.",
        "For teams targeting DexArt's specific task categories, Claru coordinates custom collection campaigns focused on mechanism diversity. We can collect faucet manipulation across dozens of valve types (ball, cartridge, compression, disc), laptop operation across hinge designs (standard, 360-degree, tablet-mode), and other mechanism categories with purpose-varied mechanical properties.",
        "Our collection protocol captures multi-view video suitable for point cloud reconstruction, enabling researchers to generate observation-compatible training data that matches DexArt's point cloud input format while providing the authentic mechanical dynamics that simulation lacks.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "bao-dexart-2023",
          title:
            "DexArt: Benchmarking Generalizable Dexterous Manipulation with Articulated Objects",
          authors: "Bao et al.",
          venue: "CVPR 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2305.05706",
        },
        {
          id: "chen-dexhand-2023",
          title:
            "Visual Dexterity: In-Hand Reorientation of Novel Objects",
          authors: "Chen et al.",
          venue: "ICRA 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2211.11744",
        },
        {
          id: "shaw-dexterous-2023",
          title:
            "Learning Dexterous Manipulation from Human Demonstrations",
          authors: "Shaw et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2304.04547",
        },
        {
          id: "qi-hand-teleop-2023",
          title:
            "General In-Hand Object Rotation with Vision and Touch",
          authors: "Qi et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2309.16600",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why is dexterous articulated manipulation so hard?",
      answer:
        "It combines two hard problems: multi-finger coordination (16 DOF hand with 4 independent fingers) and articulated object dynamics (mechanisms with joints, friction, and backlash). The contact space is enormous — small changes in finger placement dramatically affect whether a mechanism operates smoothly or jams. Each contact point has its own friction cone, and all must be coordinated simultaneously.",
    },
    {
      question: "How does real mechanical variation affect DexArt tasks?",
      answer:
        "DexArt simulates faucets, laptops, and mechanisms with parameterized physics using constant friction and damping coefficients. Real versions of these objects have unique resistance profiles that vary over their range of motion — a faucet may be stiff at the start and loose in the middle. A policy trained on DexArt's constant-parameter faucets may fail on a real faucet with a non-linear resistance curve.",
    },
    {
      question: "Can human hand data train robot dexterous policies?",
      answer:
        "Yes. Human hand manipulation of everyday mechanisms demonstrates adaptive, force-sensitive strategies that transfer to robot dexterous control. Visual demonstrations show finger placement selection, force modulation over mechanism travel, and recovery from partial slips. These strategies, once learned from human data, can be adapted to specific robot hand kinematics through retargeting or representation learning.",
    },
    {
      question: "What is intra-category generalization in DexArt?",
      answer:
        "DexArt trains on a subset of object instances within each category (e.g., 5 faucet models) and evaluates on held-out instances from the same category. This tests whether the policy learns general dexterous strategies for operating faucets — regardless of handle shape — or memorizes object-specific grip sequences that fail on novel geometries.",
    },
    {
      question: "Why does DexArt use point clouds instead of RGB images?",
      answer:
        "Point clouds provide 3D geometric information that is more directly useful for planning finger placements and grasp strategies. They also reduce the visual sim-to-real gap by providing geometry rather than appearance. However, real depth sensors produce noisier, sparser point clouds with occlusions from the hand itself, creating a perception gap that clean simulated point clouds do not expose.",
    },
  ],
  ctaHeading: "Get Dexterous Manipulation Data",
  ctaDescription:
    "Discuss real-world dexterous manipulation data for articulated object benchmarks with authentic mechanical variation.",
  relatedGlossaryTerms: [
    "dexterous-manipulation",
    "hand-object-interaction",
    "contact-rich-manipulation",
    "point-cloud",
  ],
  relatedGuidePages: [
    "how-to-collect-dexterous-manipulation-data",
    "how-to-annotate-hand-object-interactions",
  ],
  relatedSolutionSlugs: [],
};
export default page;
