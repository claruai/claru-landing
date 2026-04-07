import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "egocentric-video",
  termSlug: "egocentric-video",
  category: "data-modalities",
  metaTitle: "Egocentric Video for AI Training — Definition & Guide | Claru",
  metaDescription: "Egocentric video is first-person footage that mirrors a robot's viewpoint. Learn why it is essential for VLA training, key datasets, and collection best practices.",
  primaryKeyword: "egocentric video",
  secondaryKeywords: ["first-person video AI", "egocentric video dataset", "ego4d", "egocentric data collection", "first-person video robotics"],
  canonicalPath: "/glossary/egocentric-video",
  h1: "Egocentric Video: First-Person Data for Robot and Embodied AI Training",
  heroSubtitle: "Egocentric video is footage captured from a first-person perspective, typically using a head-mounted or chest-mounted camera that records the world as the wearer sees it. This viewpoint directly corresponds to what a robot's onboard camera observes during operation, making egocentric video the most natural and scalable source of pretraining data for visuomotor policies, VLA models, and embodied AI systems.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Egocentric Video", href: "/glossary/egocentric-video" },
  ],
  sections: [],
  faqs: [
    {
      question: "Why is egocentric video better than third-person video for robot training?",
      answer: "Egocentric video matches the robot's viewpoint. A robot with a head-mounted or wrist-mounted camera sees the world from a first-person perspective, so training data captured from the same viewpoint has minimal distribution gap. Third-person video shows the scene from an external observer's perspective, requiring the model to learn a viewpoint transformation. Research shows that policies trained on egocentric data outperform those trained on third-person data by 15-30% on manipulation tasks when the robot uses an egocentric camera.",
    },
    {
      question: "What are the main egocentric video datasets?",
      answer: "Key academic datasets include Ego4D (Meta AI, 3,670 hours from 931 participants in 74 locations), EPIC-KITCHENS (University of Bristol, 100 hours of kitchen activities from 45 kitchens), Ego-Exo4D (Meta AI, simultaneous ego and exo views with 3D annotations), and Something-Something (Qualcomm, 220K short clips of hand-object interactions). For robotics specifically, datasets like Bridge Data V2 include egocentric views from robot-mounted cameras. Claru's collection adds 500K+ egocentric clips spanning 12+ environment types.",
    },
    {
      question: "What camera hardware is best for egocentric data collection?",
      answer: "For research and pretraining data: GoPro Hero cameras (wide FOV, high framerate, rugged) mounted on head straps or chest harnesses. For robot-matched data: the same camera model used on the target robot (e.g., Intel RealSense D405 for depth-equipped robots). Resolution should be at least 720p, with 30 fps minimum. Higher resolutions (1080p, 4K) are useful for dense annotation but increase storage costs linearly. Stabilization is important — optical image stabilization reduces motion blur from head movements.",
    },
    {
      question: "How do you annotate egocentric video for robot training?",
      answer: "Annotation layers depend on the target model. Common annotations include: temporal action segmentation (marking start/end of each activity), object detection and tracking (bounding boxes on manipulated objects), hand-object interaction labels (contact state, grasp type, manipulation phase), natural language narrations (what the person is doing and why), and spatial annotations (depth maps, surface normals). Multi-layer annotation enables the same base video to serve multiple training objectives.",
    },
  ],
  ctaHeading: "Need Egocentric Video Data?",
  ctaDescription: "Claru collects and annotates egocentric video at scale across diverse real-world environments for VLA training, embodied AI pretraining, and manipulation policy development.",
  relatedGlossaryTerms: ["vla", "embodied-ai", "hand-object-interaction", "activity-annotation", "visuomotor-policy"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-an-egocentric-data-pipeline"],
  relatedSolutionSlugs: ["egocentric-video-data"],
  longDefinition: `Egocentric video (also called first-person video or ego-video) is footage captured from a camera mounted at or near the viewpoint of the person performing an activity. Unlike third-person surveillance or tripod-mounted video that shows the scene from an external perspective, egocentric video records exactly what the actor sees: their hands manipulating objects, the tools and surfaces they interact with, and the environment from their physical vantage point.

The relevance of egocentric video to AI training stems from a viewpoint correspondence principle. Robots and embodied AI agents typically perceive the world through cameras mounted on their body — on the head, wrist, or torso. This first-person perspective is geometrically similar to human egocentric video. When a person wearing a head-mounted camera reaches for a cup, the visual input closely resembles what a humanoid robot with a head-mounted camera would see when performing the same action. This viewpoint alignment means that models pretrained on human egocentric video require less adaptation to robot egocentric observations than models trained on third-person video.

Egocentric video captures information that third-person video cannot. Hand-object contact states are clearly visible because the camera is close to the manipulation workspace. Gaze direction and attention patterns are implicitly encoded in where the camera points. Object affordances — how objects can be grasped, opened, poured from — are demonstrated through naturalistic first-person manipulation. The temporal structure of activities (approach, grasp, manipulate, release, move to next subtask) is captured at the resolution of the actor's own experience.

The scale advantage of egocentric video is significant. Any person wearing a camera can generate egocentric data while performing their normal activities. This is orders of magnitude cheaper and more scalable than robot teleoperation, where data collection requires expensive hardware and trained operators. A single person wearing a GoPro can capture 8 hours of diverse egocentric data per day; a teleoperation setup typically produces 2-4 hours of usable data per operator per day at much higher cost.`,

  historicalContext: `Egocentric vision as a research field emerged in the early 2000s with pioneering work by Kanade and colleagues at Carnegie Mellon. Their wearable camera systems captured daily activities for lifelogging applications, but the computational tools to process this data at scale did not yet exist.

The first major egocentric dataset for activity understanding was Georgia Tech's GTEA (2011, 28 sequences of cooking activities), followed by EPIC-KITCHENS (Damen et al., 2018), which scaled egocentric kitchen data to 55 hours across 32 kitchens. EPIC-KITCHENS established the standard annotation protocol for egocentric video: temporal action segments, verb-noun action labels, and object bounding boxes.

The watershed moment was Meta AI's Ego4D dataset, released in 2022 with 3,670 hours of egocentric video from 931 participants across 74 worldwide locations. Ego4D was accompanied by a benchmark suite covering episodic memory, hand-object interaction, social interaction, and audio-visual understanding. The scale of Ego4D demonstrated that egocentric data collection could be conducted globally with consistent quality, using standardized hardware and protocols.

The connection between egocentric video and robotics crystallized in 2023-2024. Researchers discovered that vision encoders pretrained on egocentric video (particularly hand-object interactions from Ego4D and EPIC-KITCHENS) transfer more effectively to robot manipulation than encoders trained on ImageNet or web-scraped data. R3M (Nair et al., 2022) showed that egocentric video pretraining produces representations that encode manipulation-relevant features: object graspability, hand pose, and contact state. This finding transformed egocentric video from a computer vision niche into a core training resource for the robotics community.`,

  practicalImplications: `Egocentric video collection at scale requires attention to hardware standardization, environment diversity, activity coverage, and quality control.

Camera selection determines the visual properties of the dataset. Wide-angle lenses (120-170 degree FOV) capture more of the manipulation workspace but introduce barrel distortion that must be corrected before training. GoPro Hero cameras with SuperView mode are the de facto standard for research-grade egocentric collection. For robot-matched data, teams should use the same camera sensor and lens that will be mounted on the target robot platform to minimize the visual domain gap.

Environment diversity is the most important factor for training generalizable models. Egocentric data collected exclusively in a single kitchen produces models that fail in different kitchens. Production datasets need coverage across lighting conditions (natural, fluorescent, mixed), surface types (countertops, tables, floors), clutter levels (clean, moderately cluttered, heavily cluttered), and geographic locations (different architectural styles, object brands, cultural artifacts). Claru's collection network across 100+ cities provides this diversity systematically.

Activity protocols must balance naturalism with coverage. Fully scripted activities produce consistent data but lack the variability of real behavior. Completely unscripted collection misses rare but important activities. The effective middle ground is prompted naturalistic collection: provide the wearer with a goal ("prepare a sandwich") but let them execute it naturally, then prompt follow-up activities to fill coverage gaps identified by analysis of the collected data.

Post-collection, egocentric video requires careful quality filtering. Common issues include: camera occlusion by hair or clothing (5-15% of frames in head-mounted setups), excessive motion blur from rapid head movements, privacy-sensitive content (faces, screens, documents) that must be detected and blurred, and periods of inactivity (walking between rooms, waiting) that add bulk without training value. Automated pipelines using optical flow magnitude, blur detection, and face detection can flag 80-90% of quality issues for human review.`,

  commonMisconceptions: [
    {
      misconception: "Egocentric video from humans cannot train robot policies because robots have different bodies.",
      correction: "The viewpoint is more important than the embodiment for visual representation learning. Human egocentric video teaches vision encoders to recognize objects, understand scenes, parse hand-object interactions, and predict physical dynamics — all of which transfer to robot perception. The action labels must come from robot demonstrations, but the visual representations learned from human egocentric video significantly accelerate robot learning. R3M showed that Ego4D pretraining improves robot manipulation success by 20-40% compared to ImageNet pretraining.",
    },
    {
      misconception: "You need specialized hardware to collect egocentric video.",
      correction: "Consumer action cameras (GoPro, DJI Action) mounted on standard head straps or chest harnesses produce research-grade egocentric video. The total hardware cost per collector is under $500. No custom rigs, lab environments, or specialized sensors are required. This accessibility is exactly why egocentric video scales so much better than robot teleoperation data.",
    },
    {
      misconception: "Egocentric video is only useful for kitchen and cooking tasks.",
      correction: "EPIC-KITCHENS popularized kitchen scenarios, but egocentric video is valuable across all domains where embodied AI operates. Ego4D includes 74 location types including workshops, gardens, offices, retail spaces, and outdoor environments. For robotics, egocentric data from warehouses, assembly lines, construction sites, and healthcare settings is increasingly important as embodied AI deployment expands beyond research labs.",
    },
  ],
  keyPapers: [
    {
      id: "grauman-ego4d-2022",
      title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
      authors: "Grauman et al.",
      venue: "CVPR 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2110.07058",
    },
    {
      id: "damen-epic-kitchens-2018",
      title: "Scaling Egocentric Vision: The EPIC-KITCHENS Dataset",
      authors: "Damen et al.",
      venue: "ECCV 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1804.02748",
    },
    {
      id: "nair-r3m-2022",
      title: "R3M: A Universal Visual Representation for Robot Manipulation",
      authors: "Nair et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2203.12601",
    },
    {
      id: "grauman-ego-exo4d-2024",
      title: "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
      authors: "Grauman et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2311.18259",
    },
  ],
  claruRelevance: `Egocentric video is Claru's core data modality. Our catalog contains 386,000+ annotated egocentric clips spanning 12+ environment types, collected by trained operators using standardized hardware and protocols. Each clip includes temporal activity annotations, object labels, and natural language narrations.

For teams training VLA models or embodied AI systems, Claru provides egocentric data at the scale and diversity that production systems require. Our global collection network captures the environmental variation — different kitchens, workshops, retail spaces, outdoor settings — that prevents models from overfitting to a single lab environment. We deliver data in standard formats (RLDS, HDF5, WebDataset) with all required annotation layers and quality metadata.`,
};

export default data;
