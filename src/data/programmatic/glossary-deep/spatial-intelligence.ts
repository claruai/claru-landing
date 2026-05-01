import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "spatial-intelligence",
  termSlug: "spatial-intelligence",
  category: "physical-ai-systems",
  metaTitle: "Spatial Intelligence — Definition & Training Data for Physical AI | Claru",
  metaDescription: "Spatial intelligence enables AI systems to perceive, reason about, and interact with 3D physical space. Learn how spatial AI models are trained and what data they need.",
  primaryKeyword: "spatial intelligence AI",
  secondaryKeywords: ["spatial AI", "spatial intelligence machine learning", "3D spatial reasoning AI", "spatial understanding AI", "physical world intelligence"],
  canonicalPath: "/glossary/spatial-intelligence",
  h1: "Spatial Intelligence: How AI Systems Learn to Understand Physical Space",
  heroSubtitle: "Spatial intelligence is the ability of an AI system to perceive, represent, reason about, and act within three-dimensional physical environments. It encompasses 3D scene understanding, object affordance recognition, spatial relationship reasoning, autonomous navigation, and dexterous manipulation — the complete stack of capabilities an agent needs to operate competently in the real world rather than on a flat screen.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Spatial Intelligence", href: "/glossary/spatial-intelligence" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between spatial intelligence and spatial computing?",
      answer: "Spatial computing, popularized by Apple with Vision Pro, refers to human-computer interaction paradigms that blend digital content with the physical world — augmented reality, mixed reality, and virtual reality interfaces. Spatial intelligence is a broader AI capability: the ability of a machine to understand, reason about, and act within 3D physical space, regardless of whether a human user is involved. A warehouse robot navigating between shelves uses spatial intelligence but has nothing to do with spatial computing. The terms overlap when AR/MR systems use AI to understand room geometry or anchor virtual objects to real surfaces, but spatial intelligence extends far beyond consumer XR devices into robotics, autonomous vehicles, construction, and industrial automation.",
    },
    {
      question: "What types of training data are needed for spatial intelligence?",
      answer: "Spatial intelligence models require data that encodes three-dimensional structure, not just flat 2D images scraped from the internet. The core modalities are: multi-view RGB captures (the same scene photographed from multiple angles so the model can learn depth and geometry), depth maps from stereo cameras or structured-light sensors, point clouds from LiDAR or photogrammetry, egocentric video from wearable cameras that shows how humans naturally navigate and interact with spaces, and IMU/GPS metadata that grounds visual observations in physical coordinates. For manipulation tasks, force-torque sensor data and tactile readings add contact-level spatial understanding. The critical insight is that internet-scale image datasets like LAION or ImageNet provide appearance information but almost no 3D geometric grounding — they teach a model what objects look like, not where they are in space or how they can be physically interacted with.",
    },
    {
      question: "How does Claru collect data suitable for training spatial intelligence models?",
      answer: "Claru deploys collectors equipped with wearable cameras and depth sensors — typically head-mounted devices with stereo RGB and structured-light depth — across diverse real-world environments including homes, offices, retail spaces, warehouses, and outdoor urban areas in 100+ cities. Every capture session records synchronized RGB video, depth streams, and IMU/GPS metadata, producing the multi-modal spatial data that 3D reconstruction pipelines, embodied navigation models, and manipulation planners require. Post-capture, Claru enriches the raw data with 3D annotations: room layouts, object bounding volumes, surface normals, affordance labels, and spatial relationship graphs. This end-to-end pipeline — real-world capture with calibrated sensors, multi-environment diversity, and structured spatial annotations — directly produces the training signal spatial intelligence models need.",
    },
    {
      question: "Why can't spatial intelligence be learned from internet images alone?",
      answer: "Internet images are overwhelmingly single-viewpoint, 2D projections of 3D scenes. They discard the depth, scale, and geometric structure that spatial reasoning requires. A model trained only on internet images can learn strong appearance priors — it knows what a kitchen looks like — but it cannot learn that a countertop is 90 centimeters high, that a drawer affords pulling, or that walking around a table requires a 3-meter detour. Multi-view geometry, depth supervision, and egocentric perspective are necessary to recover this information. Recent work on monocular depth estimation and 3D generation from single images shows promising results, but these models are themselves trained on ground-truth depth and multi-view data. There is no shortcut: spatial intelligence ultimately requires spatially grounded training data captured in physical environments.",
    },
    {
      question: "Which industries are adopting spatial intelligence AI?",
      answer: "Robotics and autonomous vehicles are the most mature adopters, where spatial intelligence enables navigation, manipulation, and collision avoidance. Construction and architecture use spatial AI for progress monitoring, BIM model comparison, and robotic fabrication. Logistics and warehousing deploy spatially intelligent systems for inventory management, pick-and-place automation, and autonomous mobile robots. Agriculture uses spatial intelligence for crop monitoring with drones, precision spraying, and autonomous harvesting. Augmented reality platforms — from Apple Vision Pro to Niantic's spatial mapping — rely on spatial intelligence to understand room geometry and anchor digital content. Healthcare applies spatial AI to surgical robotics, patient monitoring, and facility management. The common thread is that any domain where AI must reason about physical geometry, distances, reachability, and navigation benefits from spatial intelligence.",
    },
  ],
  ctaHeading: "Building Spatial AI? Start with Real-World Data.",
  ctaDescription: "Claru provides purpose-built spatial datasets — egocentric video, depth maps, point clouds, and 3D annotations — captured across diverse real-world environments. Tell us what your spatial intelligence model needs to learn.",
  relatedGlossaryTerms: ["world-model", "scene-understanding", "point-cloud", "depth-data", "egocentric-video"],
  relatedGuidePages: [],
  relatedSolutionSlugs: [],
  longDefinition: "Spatial intelligence is the capacity of an AI system to perceive, internally represent, reason about, and physically act within three-dimensional environments. Where traditional computer vision operates on flat images — classifying objects, detecting faces, reading text — spatial intelligence requires understanding the full 3D structure of a scene: the geometry of surfaces, the volumetric extent of objects, the traversability of paths, the reachability of targets, and the physical affordances of every element in the environment.\n\nThe concept spans several interconnected capabilities. 3D scene understanding reconstructs the geometry and semantics of an environment from sensor input — building an internal model of what is where, how large it is, and what it is made of. Object affordance recognition determines what actions are possible given the physical properties of objects: a handle affords grasping, a flat surface affords placement, a gap affords passage. Spatial relationship reasoning encodes the relative positions, orientations, and distances between entities — understanding that object A is behind object B, above object C, and within reaching distance of the robot's end effector. Navigation uses this spatial model to plan collision-free paths through environments. Manipulation uses it to plan contact-rich interactions with objects — grasping, pushing, inserting, pouring — that respect physical constraints like gravity, friction, and deformability.\n\nSpatial intelligence is distinct from spatial computing, the term Apple popularized with Vision Pro to describe augmented and mixed reality interaction paradigms. Spatial computing is a human-computer interface concept; spatial intelligence is a machine capability. The two converge when AR/MR systems use AI to understand room geometry, but spatial intelligence extends far beyond consumer devices into industrial robotics, autonomous vehicles, construction automation, and any domain where machines must reason about physical space.\n\nThe critical data insight is that spatial intelligence cannot be learned from internet-scraped 2D images. Models need training data captured in physical environments with calibrated sensors that record depth, multi-view geometry, and egocentric perspective: stereo and RGB-D video, LiDAR point clouds, IMU traces, and GPS coordinates. This is fundamentally different from the web-crawled datasets that powered the language and 2D vision revolutions, and it is why companies building spatial AI face a data bottleneck that cannot be solved by scaling existing internet datasets.",
  historicalContext: "The intellectual roots of spatial intelligence lie in cognitive science. Jean Piaget's developmental psychology (1950s-1960s) identified spatial reasoning as a core cognitive capability that children develop through physical interaction with their environment — progressing from egocentric spatial understanding to allocentric (world-centered) spatial models. Howard Gardner's theory of multiple intelligences (1983) formalized spatial intelligence as a distinct cognitive faculty: the ability to think in three dimensions, mentally rotate objects, navigate environments, and understand spatial relationships.\n\nIn computer science, spatial understanding entered through simultaneous localization and mapping (SLAM), pioneered in the 1980s-1990s for mobile robotics. SLAM algorithms allowed robots to build maps of unknown environments while tracking their own position — the first computational spatial intelligence. Structure from Motion (SfM) brought multi-view 3D reconstruction to computer vision in the 2000s, enabling the reconstruction of 3D scenes from collections of 2D photographs.\n\nThe deep learning era introduced learned spatial representations. NeRF (Neural Radiance Fields, Mildenhall et al., 2020) showed that neural networks could synthesize photorealistic novel views of a scene from a sparse set of input images, implicitly learning 3D geometry without explicit 3D supervision. 3D Gaussian Splatting (Kerbl et al., 2023) dramatically accelerated neural 3D reconstruction, achieving real-time rendering while maintaining high fidelity — making learned spatial representations practical for real-time applications.\n\nThe 2024-2026 period marked spatial intelligence's transition from a technical capability to a strategic category. Fei-Fei Li's World Labs launched in late 2024 with $230 million in funding and an explicit mission to build 'large world models' with spatial intelligence — AI that understands the 3D physical world. Niantic, leveraging years of spatial mapping data from Pokemon Go and Ingress, pivoted to a spatial AI platform providing large-scale visual positioning and 3D mapping services. NVIDIA's physical AI push, anchored by Omniverse and Isaac Sim, positioned spatial intelligence as the foundation for the next generation of robotics and autonomous systems. Apple Vision Pro, while a consumer product, validated the market for spatial understanding as a platform capability. By 2025, 'spatial intelligence' had shifted from a cognitive science term to a mainstream AI/ML category, with search volume growing 1,100% year-over-year as the convergence of embodied AI, 3D foundation models, and real-world data collection created a new technological frontier.",
  practicalImplications: "For teams building spatial AI systems, the training data pipeline is fundamentally different from the text and 2D image pipelines that powered the previous generation of AI. Understanding these differences is essential to avoiding months of wasted effort collecting the wrong data.\n\nFirst, spatial intelligence models need multi-view captures, not single photographs. A single image of a room tells a model what the room looks like from one angle; multiple images from different viewpoints — or continuous video as a camera moves through the space — provide the geometric constraints the model needs to reconstruct 3D structure. Capture protocols must ensure sufficient viewpoint diversity: baseline distances between camera positions, coverage of all surfaces and objects, and overlap between frames for feature matching. Claru's collection methodology uses structured capture patterns — systematic walkthroughs with calibrated head-mounted cameras — that guarantee the multi-view coverage reconstruction algorithms require.\n\nSecond, depth data is not optional. While monocular depth estimation has improved dramatically (Depth Anything V2, Metric3D), these models are themselves trained on ground-truth depth from structured-light sensors, stereo cameras, and LiDAR. For training spatial intelligence models, ground-truth depth from calibrated sensors provides supervision that is orders of magnitude more reliable than predicted depth. Claru's wearable capture devices include synchronized depth sensors alongside RGB cameras, producing paired RGB-D data at every frame.\n\nThird, egocentric perspective matters. Most internet images are taken from a photographer's compositional viewpoint — centered, well-framed, at eye level. But a robot or embodied agent sees the world from its own body-centric perspective: looking down at a countertop from above, reaching toward objects at odd angles, navigating tight spaces with partial occlusion. Egocentric video from head-mounted cameras naturally captures this perspective, including the hand-object interactions that manipulation policies need to learn from. Claru's collector network captures hundreds of hours of egocentric video monthly across diverse environments, providing the embodied viewpoint that spatial AI models require.\n\nFourth, metadata transforms raw captures into spatial data. GPS coordinates ground captures in global position. IMU (inertial measurement unit) data provides orientation and acceleration for motion estimation. Camera intrinsic and extrinsic calibration parameters enable metric-scale 3D reconstruction. Without this metadata, video is just pixels; with it, video becomes a spatially grounded record of a physical environment. Claru's capture pipeline records and validates all sensor metadata in real time, ensuring that every frame can be precisely located in 3D space.\n\nFinally, spatial annotations add semantic meaning to geometric data. Room layout estimation, object bounding volumes in 3D, surface material labels, affordance annotations (graspable, sittable, openable), and spatial relationship graphs (object A is on top of object B, 30cm to the left of object C) turn raw sensor data into the structured supervision spatial intelligence models learn from. These annotations require human judgment combined with 3D visualization tools — a fundamentally different workflow from 2D image labeling.",
  commonMisconceptions: [
    {
      misconception: "Spatial intelligence is just computer vision applied to 3D data.",
      correction: "Computer vision traditionally focuses on perception: detecting, classifying, and segmenting objects in images or video. Spatial intelligence encompasses perception but extends to reasoning and action. A spatially intelligent system must not only see that a door is present but understand that it is closed, that it affords opening by turning the handle, that the handle is at a reachable height, and that a specific sequence of motor commands will open it. This closed loop from perception through reasoning to physical action is what distinguishes spatial intelligence from computer vision. It is closer to a complete cognitive architecture for physical interaction than to an image understanding system.",
    },
    {
      misconception: "Large language models already have spatial intelligence because they can answer questions about spatial relationships.",
      correction: "LLMs can answer 'what is to the left of the Eiffel Tower?' by leveraging textual co-occurrence patterns from their training data, but this is linguistic spatial reasoning, not spatial intelligence. They have no grounded 3D model of the physical world. Ask an LLM to plan a collision-free path through a cluttered room or estimate whether an object will fit through a doorway, and it fails — because these tasks require metric spatial understanding that cannot be recovered from text statistics. Spatial intelligence requires grounded 3D representations built from sensor data, not token prediction over spatial language.",
    },
    {
      misconception: "Synthetic 3D environments can fully replace real-world spatial data for training.",
      correction: "Synthetic environments like NVIDIA Isaac Sim, AI2-THOR, and Habitat provide valuable controlled training data — consistent lighting, perfect ground-truth depth, and unlimited viewpoints. However, they suffer from the sim-to-real gap: synthetic textures, materials, lighting, and physics do not perfectly match reality. Models trained exclusively in simulation often fail when deployed in real environments because they have never seen the visual noise, sensor imperfections, diverse materials, and unpredictable layouts of actual physical spaces. The most effective training pipelines combine synthetic pre-training with real-world fine-tuning, using physically captured data to bridge the domain gap. This is why real-world spatial data collection remains essential even as simulation quality improves.",
    },
    {
      misconception: "Spatial intelligence only matters for robotics.",
      correction: "While robotics is the most visible application, spatial intelligence is critical across many domains. Autonomous vehicles require spatial understanding to navigate roads, predict pedestrian trajectories, and estimate distances to obstacles. Augmented reality systems need spatial intelligence to anchor virtual objects to real surfaces and maintain spatial consistency as users move. Architecture and construction use spatial AI for progress monitoring, clash detection, and robotic fabrication. Agriculture deploys spatial intelligence for drone-based crop monitoring and precision spraying. Healthcare applies it to surgical navigation and patient fall prediction. Any domain where an AI system must reason about physical geometry, distances, and spatial relationships benefits from spatial intelligence.",
    },
  ],
  keyPapers: [
    {
      id: "mildenhall-nerf-2020",
      title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
      authors: "Mildenhall et al.",
      venue: "ECCV 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2003.08934",
    },
    {
      id: "kerbl-3dgs-2023",
      title: "3D Gaussian Splatting for Real-Time Radiance Field Rendering",
      authors: "Kerbl et al.",
      venue: "ACM Transactions on Graphics (SIGGRAPH) 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.14737",
    },
    {
      id: "hong-3dllm-2023",
      title: "3D-LLM: Injecting the 3D World into Large Language Models",
      authors: "Hong et al.",
      venue: "NeurIPS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.12981",
    },
    {
      id: "yang-depth-anything-v2-2024",
      title: "Depth Anything V2",
      authors: "Yang et al.",
      venue: "NeurIPS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09414",
    },
    {
      id: "li-world-labs-spatial-2024",
      title: "Spatial Intelligence: Why It Matters for AI",
      authors: "Li, Fei-Fei",
      venue: "World Labs Technical Report",
      year: 2024,
      url: "https://www.worldlabs.ai/blog",
    },
  ],
  claruRelevance: "Spatial intelligence sits at the exact intersection of Claru's core capabilities. Our collection network — 10,000+ collectors equipped with wearable cameras and depth sensors operating across 100+ cities — is purpose-built to produce the real-world spatial data that 3D foundation models, embodied navigation systems, and manipulation planners require. Every Claru capture session records synchronized RGB video, depth streams, and IMU/GPS metadata from egocentric perspectives in diverse physical environments, directly addressing the data bottleneck that spatial AI teams face. Where internet-scraped 2D datasets provide appearance without geometry, and synthetic environments provide geometry without visual realism, Claru's physically captured datasets provide both: real visual appearance grounded in real 3D structure, with the sensor metadata needed for metric-scale reconstruction. Our annotation pipeline adds spatial semantics — room layouts, object affordances, 3D bounding volumes, surface materials, and spatial relationship graphs — transforming raw sensor captures into structured training data for spatial intelligence. For teams building the next generation of spatially intelligent systems, Claru eliminates the most expensive and time-consuming step: acquiring diverse, high-quality, spatially grounded real-world data.",
};

export default data;
