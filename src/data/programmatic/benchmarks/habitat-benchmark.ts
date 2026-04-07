import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "habitat-benchmark",
  "benchmarkName": "Habitat",
  "benchmarkDescription": "Habitat is an embodied AI simulation platform from Meta FAIR that evaluates navigation and rearrangement in photorealistic 3D indoor environments. Habitat 2.0 and 3.0 introduced articulated object interaction and human-in-the-loop evaluation, making it the primary benchmark for embodied AI research.",
  "taskSet": "ObjectNav (navigate to object category), PointNav (navigate to coordinates), Pick (grasp specified objects), Place (move objects to locations), Rearrangement (restore environment to goal configuration), and Social Navigation (navigate around humans).",
  "observationSpace": "RGB-D images from onboard cameras, GPS+compass for navigation, base velocity, arm joint positions, and gripper state.",
  "actionSpace": "Discrete or continuous navigation (forward, turn, stop) combined with arm joint velocities or end-effector deltas for manipulation tasks.",
  "evaluationProtocol": "Success rate and SPL (Success weighted by Path Length) for navigation. Task completion rate for manipulation. Combined metrics for rearrangement that account for both navigation efficiency and manipulation success.",
  "simToRealGap": "Habitat environments are created from real 3D scans (HM3D, MP3D) providing good visual fidelity, but object physics are simplified. Navigation policies trained in Habitat often fail in real buildings due to unmodeled obstacles (cords, rugs), dynamic elements (people, pets), and sensor noise. The gap between simulated and real depth sensors is a persistent challenge.",
  "realWorldDataNeeds": "Real indoor navigation trajectories with depth and RGB in diverse buildings. Rearrangement demonstrations in real homes showing object manipulation in context. Social navigation data with real humans to train policies that handle dynamic pedestrians.",
  "complementaryDatasets": [
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Real-world indoor navigation and activity video from 100+ locations provides visual pretraining data with authentic building layouts, lighting, and obstacles."
    },
    {
      "name": "Custom Indoor Navigation Collection",
      "rationale": "Purpose-collected navigation trajectories in real buildings with depth sensors provides ground-truth for validating Habitat-trained navigation policies."
    },
    {
      "name": "Custom Rearrangement Collection",
      "rationale": "Real-world object rearrangement demonstrations in authentic homes — moving items between rooms, organizing shelves — provides the manipulation-in-context data Habitat evaluates."
    }
  ],
  "keyPapers": [
    {
      "id": "szot-habitat-2-2021",
      "title": "Habitat 2.0: Training Home Assistants to Rearrange their Habitat",
      "authors": "Szot et al.",
      "venue": "NeurIPS 2021",
      "year": 2021,
      "url": "https://arxiv.org/abs/2106.14405"
    },
    {
      "id": "puig-habitat-3-2023",
      "title": "Habitat 3.0: A Co-Habitat for Humans, Avatars and Robots",
      "authors": "Puig et al.",
      "venue": "ICLR 2024",
      "year": 2024,
      "url": "https://arxiv.org/abs/2310.13724"
    },
    {
      "id": "ramrakhya-hm3d-2022",
      "title": "Habitat-Matterport 3D Dataset (HM3D)",
      "authors": "Ramrakhya et al.",
      "venue": "NeurIPS 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2109.08238"
    }
  ],
  "technicalAnalysis": `Habitat is the most widely used platform for embodied AI navigation research. Its photorealistic environments, built from real 3D scans of homes and offices, provide the best available visual fidelity for indoor simulation. However, scan-based environments are static — furniture does not move, doors do not open naturally, and human inhabitants are absent.

Habitat 3.0 introduced human avatars for social navigation, but simulated humans follow scripted or learned behavior patterns that poorly approximate real human unpredictability. A robot navigating a real home encounters people who suddenly change direction, children running, pets underfoot, and objects left in unexpected places. Training social navigation policies requires data from real shared spaces with actual human activity.

The rearrangement task highlights a different gap. In Habitat, rearrangement means moving objects to specified goal positions — but real-world rearrangement involves understanding functional organization (dishes go in the cabinet near the sink, not alphabetically). This semantic understanding requires data that captures how real humans organize their spaces.

Claru's egocentric activity dataset is directly relevant to Habitat's evaluation paradigm. It captures humans navigating through and interacting with real indoor environments — providing the ground-truth visual and behavioral data that Habitat-trained policies need for validation.`,
  "metaTitle": "Real-World Data for Habitat Embodied AI Benchmark | Claru",
  "metaDescription": "Indoor navigation, rearrangement, and social navigation data to bridge the gap between Habitat simulation and real-world embodied AI deployment.",
  "primaryKeyword": "Habitat benchmark real-world data",
  "secondaryKeywords": [
    "Habitat sim-to-real",
    "embodied AI navigation data",
    "indoor robot data",
    "Habitat rearrangement data"
  ],
  "canonicalPath": "/benchmarks/habitat-benchmark",
  "h1": "Real-World Data for Habitat",
  "heroSubtitle": "Habitat evaluates embodied AI in photorealistic simulation. Real-world data validates whether those policies work in actual buildings.",
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
      "label": "Habitat",
      "href": "/benchmarks/habitat-benchmark"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "Habitat at a Glance",
      "stats": [
        { "value": "1,000+", "label": "HM3D Scenes" },
        { "value": "3 Versions", "label": "Habitat 1.0/2.0/3.0" },
        { "value": "ObjectNav", "label": "Primary Task" },
        { "value": "Meta FAIR", "label": "Creator" },
        { "value": "Photorealistic", "label": "Visual Fidelity" },
        { "value": "2019", "label": "First Release" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is Habitat?",
      "paragraphs": [
        "Habitat is Meta FAIR's flagship embodied AI simulation platform for evaluating navigation, manipulation, and social interaction in photorealistic 3D indoor environments. Built from real 3D scans of homes and offices (HM3D, Matterport3D datasets), it provides the highest visual fidelity available for indoor robot simulation.",
        "The platform has evolved through three major versions. Habitat 1.0 focused on visual navigation (PointNav, ObjectNav). Habitat 2.0 added articulated object interaction and mobile manipulation (ReArrange challenge). Habitat 3.0 introduced human avatars for social navigation and human-robot collaboration tasks.",
        "Habitat's key differentiator is photorealistic rendering from real 3D scans — environments look like real buildings because they are reconstructed from real buildings. This provides better visual fidelity than procedurally generated environments but introduces a different limitation: scanned environments are static snapshots that cannot change state."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Habitat Task Categories",
      "description": "Habitat's tasks span navigation, manipulation, and social interaction, each with distinct sim-to-real challenges.",
      "columns": ["Task", "Input", "Metric", "Sim-to-Real Gap"],
      "rows": [
        { "Task": "PointNav (navigate to coordinates)", "Input": "RGB-D + GPS/compass", "Metric": "Success + SPL", "Sim-to-Real Gap": "Real sensor noise, dynamic obstacles" },
        { "Task": "ObjectNav (navigate to object)", "Input": "RGB-D + object category", "Metric": "Success + SPL", "Sim-to-Real Gap": "Object recognition in clutter, unseen objects" },
        { "Task": "Pick & Place", "Input": "RGB-D + arm state", "Metric": "Task completion", "Sim-to-Real Gap": "Contact dynamics, object weight, grasp stability" },
        { "Task": "Rearrangement", "Input": "RGB-D + goal config", "Metric": "Displacement reduction", "Sim-to-Real Gap": "Functional organization, semantic understanding" },
        { "Task": "Social Navigation", "Input": "RGB-D + human pose", "Metric": "Path efficiency + safety", "Sim-to-Real Gap": "Unpredictable human behavior, social conventions" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "Habitat evaluates navigation using Success rate and SPL (Success weighted by Path Length) — a policy that reaches the goal via an inefficient path scores lower than one that takes the optimal route. This metric captures both reliability and efficiency, which are critical for real-world deployment where battery life and time constraints matter.",
        "Manipulation and rearrangement tasks use completion metrics: what fraction of objects were moved to their goal positions? The rearrangement challenge measures displacement reduction, rewarding policies that make progress even if they do not fully solve the task.",
        "The Habitat Challenge, run annually, provides standardized leaderboards for each task category. Winning entries typically achieve 80-90%+ success on navigation tasks in simulation but drop to 50-70% on real robots, quantifying the persistent sim-to-real gap."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Habitat vs. Related Embodied AI Platforms",
      "columns": ["Feature", "Habitat", "AI2-THOR", "iGibson", "BEHAVIOR-1K"],
      "rows": [
        { "Feature": "Visual source", "Habitat": "Real 3D scans (HM3D)", "AI2-THOR": "Artist-created", "iGibson": "Real scans + procedural", "BEHAVIOR-1K": "Procedural + scans" },
        { "Feature": "Scenes", "Habitat": "1,000+ (HM3D)", "AI2-THOR": "120 rooms", "iGibson": "15 buildings", "BEHAVIOR-1K": "50 scenes" },
        { "Feature": "Human avatars", "Habitat": "Yes (v3.0)", "AI2-THOR": "No", "iGibson": "No", "BEHAVIOR-1K": "Yes" },
        { "Feature": "Manipulation", "Habitat": "v2.0+ (mobile manip)", "AI2-THOR": "Discrete interactions", "iGibson": "Continuous control", "BEHAVIOR-1K": "Full physics" },
        { "Feature": "Annual challenge", "Habitat": "Yes (since 2019)", "AI2-THOR": "RoboTHOR challenge", "iGibson": "No", "BEHAVIOR-1K": "No" }
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging Photorealistic Simulation to Real Buildings",
      "paragraphs": [
        "Habitat's photorealistic environments are created from static 3D scans — they capture building geometry and appearance at one moment in time. Real buildings are dynamic: furniture gets rearranged, doors open and close, clutter accumulates, and lighting changes throughout the day. A navigation policy that memorizes static scan topology will fail when a real room has been reorganized.",
        "The social navigation gap is particularly significant. Habitat 3.0 introduced human avatars, but simulated humans follow learned or scripted behavior patterns. Real humans are unpredictable — they stop suddenly, change direction while texting, carry large objects that block paths, and gather in doorways. Training social navigation requires data from real shared spaces with authentic human behavior.",
        "For rearrangement tasks, the gap is semantic rather than physical. Habitat specifies goal configurations as target object positions. Real rearrangement requires understanding functional organization — dishes go near the sink, books go on shelves by topic, cleaning supplies go under the sink. This semantic knowledge comes from observing how real humans organize real spaces.",
        "Claru's egocentric activity dataset captures real humans navigating through and interacting with real indoor environments across 100+ locations — providing ground-truth visual, behavioral, and organizational data that Habitat-trained policies need for real-world validation."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports Habitat Users",
      "paragraphs": [
        "Claru provides the real-world indoor data that validates Habitat-trained embodied AI policies. Our egocentric activity dataset captures navigation, object interaction, and human activity in 100+ real buildings with naturally varying layouts, lighting, clutter, and human presence.",
        "For teams targeting Habitat's rearrangement challenge, Claru collects real-world object rearrangement demonstrations showing how humans organize spaces — providing the semantic organizational knowledge that Habitat's position-based goal specifications cannot capture.",
        "Our collection captures the dynamic elements missing from Habitat's static scans: changing lighting throughout the day, clutter that accumulates and moves, doors in different states, and real human activity that social navigation policies must handle."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "szot-habitat-2-2021", "title": "Habitat 2.0: Training Home Assistants to Rearrange their Habitat", "authors": "Szot et al.", "venue": "NeurIPS 2021", "year": 2021, "url": "https://arxiv.org/abs/2106.14405" },
        { "id": "puig-habitat-3-2023", "title": "Habitat 3.0: A Co-Habitat for Humans, Avatars and Robots", "authors": "Puig et al.", "venue": "ICLR 2024", "year": 2024, "url": "https://arxiv.org/abs/2310.13724" },
        { "id": "ramrakhya-hm3d-2022", "title": "Habitat-Matterport 3D Dataset (HM3D)", "authors": "Ramrakhya et al.", "venue": "NeurIPS 2022", "year": 2022, "url": "https://arxiv.org/abs/2109.08238" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Why do Habitat-trained navigation policies fail in real buildings?",
      "answer": "Real buildings contain unmodeled obstacles (cords, rugs, pets), dynamic elements (people, doors), and sensor noise. Habitat environments from 3D scans are static and clean. Policies learn to exploit this cleanliness and fail when confronted with real-world clutter and unpredictability."
    },
    {
      "question": "What is the rearrangement task and why does it need real data?",
      "answer": "Rearrangement involves moving objects to goal configurations. In Habitat, goals are specified positions. In reality, rearrangement requires understanding functional organization — how humans actually organize spaces. Data from real homes captures these semantic patterns."
    },
    {
      "question": "How does social navigation data help Habitat research?",
      "answer": "Habitat 3.0 introduced human avatars but they follow simplified behavior models. Real human navigation is unpredictable — people stop suddenly, change direction, carry items, and congregate in doorways. Data from real shared spaces trains policies that handle authentic human behavior."
    },
    {
      "question": "What is the gap between Habitat Challenge scores and real-world deployment?",
      "answer": "Winning Habitat Challenge entries typically achieve 80-90%+ success on navigation tasks in simulation but drop to 50-70% on real robots. The gap comes from unmodeled obstacles, dynamic elements, sensor noise, and the difference between static scanned environments and living spaces that change daily."
    },
    {
      "question": "Why are static 3D scans insufficient for training embodied AI?",
      "answer": "3D scans capture building geometry at one moment. Real buildings are dynamic — furniture moves, doors open and close, clutter accumulates, lighting changes hourly, and people are present. Policies trained on static scans learn to navigate fixed topology rather than adapting to the changing environment of a real home."
    }
  ],
  "ctaHeading": "Real-World Navigation Data for Embodied AI",
  "ctaDescription": "Discuss indoor navigation and rearrangement data for validating Habitat-trained policies.",
  "relatedGlossaryTerms": [
    "embodied-ai",
    "sim-to-real-gap",
    "scene-understanding",
    "egocentric-video"
  ],
  "relatedGuidePages": [
    "how-to-build-a-navigation-dataset",
    "how-to-bridge-sim-to-real-gap"
  ],
  "relatedSolutionSlugs": []
};
export default page;
