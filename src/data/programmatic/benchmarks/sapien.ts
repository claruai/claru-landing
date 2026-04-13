import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "sapien",
  "benchmarkName": "SAPIEN",
  "benchmarkDescription": "SAPIEN is a physics simulation platform and benchmark for interactive 3D environments. Built by UC San Diego and Stanford researchers, it provides articulated object simulation with PartNet-Mobility assets — real object meshes with annotated part mobility (hinges, sliders, handles). SAPIEN powers ManiSkill and enables research on articulated object manipulation.",
  "taskSet": "Interactive manipulation of articulated objects from PartNet-Mobility: opening/closing doors, drawers, refrigerators, microwaves; operating faucets, switches, and levers. Over 2,000 articulated object models with realistic part mobility.",
  "observationSpace": "RGB-D images, segmentation masks, point clouds, proprioceptive state, and per-part joint angles for articulated objects.",
  "actionSpace": "Joint position targets, end-effector delta poses, or direct force/torque control on any actuated joint.",
  "evaluationProtocol": "Part-level manipulation success (e.g., drawer opened past threshold angle) across randomized object instances and initial configurations.",
  "simToRealGap": "SAPIEN provides the most detailed articulated object models available, but real mechanical assemblies have friction, backlash, wear, and manufacturing variation that the PartNet-Mobility annotations capture imprecisely. Each real door handle has unique resistance; each drawer slide has unique friction profile.",
  "realWorldDataNeeds": "Manipulation recordings of real articulated objects with joint angle measurements and force feedback. Diverse mechanical variation across the same object category (e.g., 50 different real drawer pulls). Material property calibration data for simulation parameter tuning.",
  "complementaryDatasets": [
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Real-world articulated object manipulation provides the authentic mechanical variation that SAPIEN's parameterized models approximate."
    },
    {
      "name": "Custom Articulated Object Collection",
      "rationale": "Purpose-collected data on real doors, drawers, and appliances captures the manufacturing variation and wear that simulated models cannot reproduce."
    },
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Human demonstrations of interacting with household articulated objects provide visual pretraining for SAPIEN-trained policies."
    }
  ],
  "keyPapers": [
    {
      "id": "xiang-sapien-2020",
      "title": "SAPIEN: A SimulAted Part-based Interactive ENvironment",
      "authors": "Xiang et al.",
      "venue": "CVPR 2020",
      "year": 2020,
      "url": "https://arxiv.org/abs/2003.08515"
    },
    {
      "id": "mo-partnet-2019",
      "title": "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding",
      "authors": "Mo et al.",
      "venue": "CVPR 2019",
      "year": 2019,
      "url": "https://arxiv.org/abs/1812.02713"
    },
    {
      "id": "geng-gapartnet-2023",
      "title": "GAPartNet: Cross-Category Domain-Generalizable Object Perception and Manipulation",
      "authors": "Geng et al.",
      "venue": "CVPR 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2211.05272"
    }
  ],
  "technicalAnalysis": `SAPIEN's unique contribution is bringing real object geometry into simulation through PartNet-Mobility. Unlike benchmarks that use procedurally generated shapes, SAPIEN objects come from 3D scans of real products with annotated movable parts. This provides geometric fidelity but not mechanical fidelity.

The gap between SAPIEN's articulated models and real objects is subtle but significant. A simulated cabinet door has a parameterized hinge with constant friction. A real cabinet door has a hinge with friction that varies with angle, a magnetic catch at the closed position, and dampening that changes with temperature. These mechanical details affect grasp strategy, force requirements, and timing.

The PartNet-Mobility dataset contains 2,000+ articulated objects across 46 categories, but the distribution is biased toward Chinese household products (the scans were collected primarily in China). Western household objects differ in style, mechanism design, and standard dimensions. Balanced global coverage requires data from diverse geographic markets.

Claru's global collector network can capture manipulation data with real articulated objects across diverse locations, providing the mechanical variation and geographic diversity that complements SAPIEN's geometric fidelity.`,
  "metaTitle": "Real-World Data for SAPIEN Articulated Object Benchmark | Claru",
  "metaDescription": "Articulated object manipulation, mechanical variation, and material property data for SAPIEN's interactive 3D environment and PartNet-Mobility assets.",
  "primaryKeyword": "SAPIEN benchmark real-world data",
  "secondaryKeywords": [
    "SAPIEN sim-to-real",
    "articulated object data",
    "PartNet-Mobility data",
    "interactive object manipulation data"
  ],
  "canonicalPath": "/benchmarks/sapien",
  "h1": "Real-World Data for SAPIEN",
  "heroSubtitle": "SAPIEN brings real object geometry to simulation. Real-world data adds the mechanical fidelity that geometry alone cannot capture.",
  "breadcrumbs": [
    {
      "label": "Home",
      "href": "/"
    },
    {
      "label": "Benchmarks",
      "href": "/benchmarks"
    },
    {
      "label": "SAPIEN",
      "href": "/benchmarks/sapien"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "SAPIEN at a Glance",
      "stats": [
        { "value": "2,000+", "label": "Articulated Objects" },
        { "value": "46", "label": "Object Categories" },
        { "value": "PartNet-Mobility", "label": "Object Source" },
        { "value": "Ray-traced", "label": "Rendering" },
        { "value": "ManiSkill", "label": "Powers" },
        { "value": "2020", "label": "Released" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is SAPIEN?",
      "paragraphs": [
        "SAPIEN (SimulAted Part-based Interactive ENvironment) is a physics simulation platform built by researchers at UC San Diego and Stanford. Its unique contribution is bringing real object geometry into simulation through the PartNet-Mobility dataset — over 2,000 articulated objects scanned from real products with annotated movable parts (hinges, sliders, handles, buttons).",
        "Unlike benchmarks that use procedurally generated shapes, SAPIEN objects come from 3D scans of actual consumer products: real cabinet doors, real drawer slides, real faucet handles, and real microwave latches. This provides geometric fidelity that procedural generation cannot match, though mechanical properties (friction, damping, spring constants) must still be estimated.",
        "SAPIEN serves as the physics engine powering ManiSkill (all 3 versions), making it the foundation for one of the most widely used GPU-parallelized manipulation benchmarks. Understanding SAPIEN's capabilities and limitations is essential for anyone using ManiSkill or evaluating articulated object manipulation in simulation."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "PartNet-Mobility Object Categories",
      "description": "PartNet-Mobility provides 2,000+ articulated objects across 46 categories. The most commonly used categories for manipulation research are shown below.",
      "columns": ["Category", "Example Objects", "Mobility Type", "Sim-to-Real Gap"],
      "rows": [
        { "Category": "Cabinets & Storage", "Example Objects": "Kitchen cabinets, bathroom vanities", "Mobility Type": "Revolute (doors) + prismatic (drawers)", "Sim-to-Real Gap": "Hinge friction, magnetic catches, dampening" },
        { "Category": "Faucets & Taps", "Example Objects": "Kitchen faucets, bathroom taps", "Mobility Type": "Revolute (handles)", "Sim-to-Real Gap": "Valve type variation, water resistance" },
        { "Category": "Appliances", "Example Objects": "Microwaves, ovens, refrigerators", "Mobility Type": "Revolute (doors) + buttons", "Sim-to-Real Gap": "Latch mechanisms, heavy doors, seals" },
        { "Category": "Laptops & Devices", "Example Objects": "Laptops, tablet cases", "Mobility Type": "Revolute (hinge)", "Sim-to-Real Gap": "Variable damping, magnetic closure" },
        { "Category": "Switches & Controls", "Example Objects": "Light switches, knobs, dials", "Mobility Type": "Revolute + prismatic", "Sim-to-Real Gap": "Detent positions, spring return" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "SAPIEN evaluates part-level manipulation success: did the policy operate the mechanism past a threshold? For example, did the drawer open at least 80% of the way? Did the faucet handle rotate at least 60 degrees? This part-level evaluation is more granular than binary task success and reveals whether the policy understands the mechanism's kinematic constraints.",
        "Generalization evaluation uses held-out object instances within the same category. A policy trained on 50 cabinet models is tested on 20 unseen cabinets. The held-out set includes different handle styles, hinge positions, and door sizes — testing whether the policy learned general cabinet-opening strategies or memorized specific object geometries.",
        "SAPIEN also supports contact analysis — measuring contact forces, contact points, and contact duration during manipulation. This enables research on grasp quality and manipulation efficiency beyond binary success, though the simulated contact forces do not perfectly match real-world values."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "SAPIEN vs. Related Simulation Platforms",
      "columns": ["Feature", "SAPIEN", "MuJoCo", "CoppeliaSim", "Isaac Gym/Sim"],
      "rows": [
        { "Feature": "Articulated objects", "SAPIEN": "2,000+ real scans (PartNet)", "MuJoCo": "Manual modeling", "CoppeliaSim": "Manual modeling", "Isaac Gym/Sim": "Manual modeling + URDF" },
        { "Feature": "GPU parallel", "SAPIEN": "Yes (via ManiSkill3)", "MuJoCo": "MuJoCo XLA", "CoppeliaSim": "No", "Isaac Gym/Sim": "Yes (native)" },
        { "Feature": "Rendering", "SAPIEN": "Ray-traced", "MuJoCo": "Rasterized", "CoppeliaSim": "Rasterized", "Isaac Gym/Sim": "RTX ray-traced" },
        { "Feature": "Part-level mobility", "SAPIEN": "Annotated per-part joints", "MuJoCo": "Manual joint definition", "CoppeliaSim": "Manual joint definition", "Isaac Gym/Sim": "URDF-based" },
        { "Feature": "Object diversity", "SAPIEN": "Scan-based (46 categories)", "MuJoCo": "Limited to modeled objects", "CoppeliaSim": "Limited to modeled objects", "Isaac Gym/Sim": "Limited to modeled objects" }
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging Geometric Fidelity to Mechanical Fidelity",
      "paragraphs": [
        "SAPIEN's unique strength — real object geometry — exposes a subtle but significant gap. Geometric fidelity (accurate 3D shape) does not imply mechanical fidelity (accurate physical behavior). A perfect 3D model of a drawer tells you nothing about the drawer's friction profile, stick-slip behavior, load-dependent resistance, or manufacturing tolerances.",
        "Each real articulated object is mechanically unique. Two identical-looking cabinet hinges from the same manufacturer will have slightly different friction, different spring tension, and different wear patterns. These mechanical properties change over time as hinges loosen, slides accumulate dust, and seals degrade. SAPIEN assigns constant friction and damping coefficients that approximate the average but miss the variance.",
        "The PartNet-Mobility dataset contains over 2,000 objects across 46 categories, but the distribution is geographically biased — scans were collected primarily from Chinese household products. Western household objects differ in style, mechanism design, standard dimensions, and material choices. A cabinet-opening policy trained on Chinese cabinet designs may fail on American soft-close cabinet hinges.",
        "Real-world manipulation data addresses both gaps — mechanical fidelity and geographic diversity. Recordings of humans operating real doors, drawers, and appliances capture authentic friction profiles, mechanism idiosyncrasies, and the mechanical variation that no parametric simulation model can cover."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports SAPIEN Users",
      "paragraphs": [
        "Claru's global collector network captures manipulation data with real articulated objects across diverse geographic markets, addressing both SAPIEN's mechanical fidelity gap and PartNet-Mobility's geographic bias. Our data includes articulated object manipulation from homes across 100+ cities with naturally varying mechanism designs and material properties.",
        "For teams calibrating SAPIEN physics parameters, Claru can collect force-instrumented manipulation data on specific object categories — measuring real friction profiles, hinge resistance curves, and damping characteristics that improve simulation accuracy for the most commonly used PartNet-Mobility objects.",
        "Our egocentric activity dataset captures humans interacting with household articulated objects in natural contexts, providing the visual pretraining data that SAPIEN-trained policies need for real-world visual processing — authentic lighting, surface wear, and object appearances that ray-traced rendering approximates but does not replicate."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "xiang-sapien-2020", "title": "SAPIEN: A SimulAted Part-based Interactive ENvironment", "authors": "Xiang et al.", "venue": "CVPR 2020", "year": 2020, "url": "https://arxiv.org/abs/2003.08515" },
        { "id": "mo-partnet-2019", "title": "PartNet: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level 3D Object Understanding", "authors": "Mo et al.", "venue": "CVPR 2019", "year": 2019, "url": "https://arxiv.org/abs/1812.02713" },
        { "id": "geng-gapartnet-2023", "title": "GAPartNet: Cross-Category Domain-Generalizable Object Perception and Manipulation", "authors": "Geng et al.", "venue": "CVPR 2023", "year": 2023, "url": "https://arxiv.org/abs/2211.05272" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "What makes SAPIEN's articulated objects special?",
      "answer": "SAPIEN uses 3D scans of real products with annotated movable parts from PartNet-Mobility — real door handles, drawer slides, and appliance controls. This provides geometric fidelity that procedurally generated objects cannot match, though mechanical properties are still approximated."
    },
    {
      "question": "Why does geometric fidelity not guarantee sim-to-real transfer?",
      "answer": "A perfect 3D model of a drawer does not capture the drawer's friction profile, stick-slip behavior, or manufacturing tolerances. These mechanical properties affect grasp strategy and force requirements. Real-world manipulation data measures these properties directly."
    },
    {
      "question": "How does geographic diversity in object data matter?",
      "answer": "PartNet-Mobility objects are primarily Chinese household products. Drawer handles, door mechanisms, and appliance controls differ significantly across markets — American soft-close cabinet hinges, European lever door handles, and Japanese sliding doors present different mechanical challenges. Global manipulation data ensures policies generalize to diverse product designs and mechanical conventions."
    },
    {
      "question": "Does SAPIEN's ray-traced rendering eliminate the visual sim-to-real gap?",
      "answer": "Ray-tracing produces more realistic images than rasterized rendering, with accurate reflections and shadows. But it still cannot capture real sensor artifacts — auto-exposure, motion blur, rolling shutter, dust on lenses, and specular reflections from unexpected light sources. The visual gap narrows but does not close, making real-world visual data still essential for robust policy deployment."
    },
    {
      "question": "How does SAPIEN relate to ManiSkill?",
      "answer": "SAPIEN is the physics engine that powers all three versions of ManiSkill. ManiSkill adds GPU parallelization, standardized task definitions, and evaluation protocols on top of SAPIEN's articulated object simulation. Understanding SAPIEN's strengths (geometric fidelity from PartNet-Mobility) and limitations (approximate mechanical properties) is essential for interpreting ManiSkill benchmark results."
    }
  ],
  "ctaHeading": "Get Real Articulated Object Data",
  "ctaDescription": "Discuss purpose-collected data with real doors, drawers, and appliances for SAPIEN research.",
  "relatedGlossaryTerms": [
    "manipulation-trajectory",
    "point-cloud",
    "depth-data",
    "sim-to-real-gap"
  ],
  "relatedGuidePages": [
    "how-to-build-a-manipulation-dataset",
    "how-to-bridge-sim-to-real-gap"
  ],
  "relatedSolutionSlugs": []
};
export default page;
