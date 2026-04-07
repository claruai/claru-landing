import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "figure-ai",
  companyName: "Figure AI",
  companyDescription:
    "Figure AI is building general-purpose humanoid robots for commercial deployment. Founded in 2022 by Brett Adcock (serial entrepreneur, previously Vettery and Archer Aviation), Figure has raised over $2.6 billion at a $39 billion valuation as of its Series B in February 2025 — the largest funding round in robotics history. Investors include Microsoft, NVIDIA, OpenAI, Jeff Bezos, Intel, and Samsung. Figure 02, the company's second-generation humanoid, features 41 degrees of freedom, dexterous hands with 16 degrees of freedom per hand, and onboard AI powered by a custom vision-language-action model developed in collaboration with OpenAI.",
  keyProducts: [
    "Figure 01 (first-generation humanoid)",
    "Figure 02 (production humanoid, 41 DOF)",
    "Helix (custom VLA model, OpenAI collaboration)",
  ],
  researchFocus: [
    "Vision-language-action models for humanoid control",
    "Dexterous bimanual manipulation with 16-DOF hands",
    "Whole-body humanoid locomotion and balance",
    "Autonomous warehouse and manufacturing operations",
    "End-to-end learning from human demonstrations",
  ],
  dataNeedsSummary:
    "Figure AI's push toward general-purpose humanoid intelligence demands massive quantities of real-world manipulation data, egocentric video of human activities, and diverse locomotion trajectories across unstructured environments. Their custom VLA model Helix — developed with OpenAI — requires grounded multimodal training data that pairs natural language instructions with physical actions in real environments. The 41-DOF action space of Figure 02 demands orders of magnitude more demonstration data than fixed-base manipulators, and the dexterous 16-DOF hands require fine-grained contact data that no simulation can faithfully reproduce.",
  dataNeeds: [
    {
      title: "Dexterous bimanual manipulation demonstrations",
      source: "Figure AI job postings for Manipulation Research Scientist and Teleoperation Engineer, 2024",
      description:
        "High-quality teleoperated demonstrations of two-handed object manipulation tasks including pick-and-place, tool use, assembly sequences, and contact-rich interactions with full joint-state recordings from Figure 02's 16-DOF dexterous hands. Requires force and tactile feedback data to train policies that apply appropriate grip force across object types.",
    },
    {
      title: "Egocentric human activity video for visual pretraining",
      source: "Figure 02 product announcement and Helix VLA architecture description",
      description:
        "First-person video of humans performing warehouse, logistics, manufacturing, and household tasks — used to pretrain visual representations and world models that ground Helix's language understanding in physical activity. The VLA architecture requires visual features that encode manipulation-relevant semantics: object affordances, spatial relationships, hand-object contact patterns, and task progression.",
    },
    {
      title: "Whole-body locomotion trajectories across terrain",
      source: "Published research on sim-to-real transfer for humanoid walking (Radosavovic et al., 2024)",
      description:
        "Motion capture and IMU data of humans walking on uneven surfaces, climbing stairs, navigating cluttered environments, and transitioning between walking and manipulation. Figure 02's whole-body coordination requires data that captures the coupling between locomotion and manipulation — how body posture adjusts when reaching, how gait changes when carrying objects.",
    },
    {
      title: "Language-paired task demonstrations for Helix VLA",
      source: "Figure-OpenAI partnership announcement (2024) and Helix model description",
      description:
        "Manipulation and locomotion demonstrations paired with natural language task descriptions for training the Helix vision-language-action model. Instructions range from simple ('pick up the box') to compositional ('move the red package from shelf B to the conveyor belt'). Requires diverse instruction phrasings for each task to improve language grounding robustness.",
    },
    {
      title: "Manufacturing and warehouse environment recordings",
      source: "BMW Spartanburg deployment partnership (2024)",
      description:
        "Visual and spatial recordings of real manufacturing and warehouse environments — production lines, parts bins, conveyor systems, storage racks — to pretrain Figure 02's perception system on the visual distributions of actual deployment environments. Current data is limited to Figure's headquarters and BMW's single pilot facility.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Dexterous bimanual manipulation demonstrations",
      claruOffering: "Manipulation Trajectory Dataset + Custom Dexterous Collection",
      rationale:
        "Claru's manipulation trajectories capture multi-camera, multi-modal recordings of dexterous object interactions with precise temporal annotations. Custom collection campaigns using teleoperation rigs can produce the bimanual demonstrations Figure needs — two-handed coordination, tool use, and contact-rich assembly — across diverse real-world environments rather than a single lab.",
    },
    {
      labNeed: "Egocentric human activity video for visual pretraining",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale:
        "Purpose-collected first-person video of daily activities across 100+ real-world locations, annotated with activity labels, object bounding boxes, and temporal segments. This provides the visual pretraining corpus that Helix needs to ground language in physical activity — dramatically higher signal per frame than uncurated internet video.",
    },
    {
      labNeed: "Whole-body locomotion trajectories across terrain",
      claruOffering: "Custom Locomotion Data Collection with Body-Worn Sensors",
      rationale:
        "Claru can deploy collectors with body-worn IMU suites and egocentric cameras to capture locomotion data in target environments — warehouses, factories, outdoor terrain, stairways — across 100+ cities. Each location contributes unique surface characteristics and terrain variation.",
    },
    {
      labNeed: "Language-paired task demonstrations for Helix VLA",
      claruOffering: "Custom Language-Paired Data Collection Campaigns",
      rationale:
        "Claru's annotation pipeline pairs demonstrations with diverse natural language instructions written by human annotators who watch each full episode. Multiple phrasings per task provide the instruction diversity that VLA models need for robust language grounding — not the templated descriptions that scripted collection produces.",
    },
    {
      labNeed: "Manufacturing and warehouse environment recordings",
      claruOffering: "Custom Environmental Recording Campaigns",
      rationale:
        "Claru can coordinate multi-camera visual recordings across partner manufacturing and warehouse facilities, capturing the environmental distributions (lighting, layout, equipment, visual clutter) that Figure 02 will encounter in production deployments beyond BMW Spartanburg.",
    },
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "cheng-humanoid-2024",
      title: "Expressive Whole-Body Control for Humanoid Robots",
      authors: "Cheng et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.16796",
    },
    {
      id: "radosavovic-humanoid-2024",
      title: "Real-World Humanoid Locomotion with Reinforcement Learning",
      authors: "Radosavovic et al.",
      venue: "Science Robotics, Vol 9",
      year: 2024,
      url: "https://arxiv.org/abs/2303.03381",
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "black-pi0-2024",
      title: "pi-zero: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164",
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
  ],
  technicalAnalysis:
    "Figure AI's approach to general-purpose humanoid robotics represents the highest-resource bet in the industry. With $2.6 billion in funding and partnerships with OpenAI, Microsoft, and NVIDIA, Figure has the capital to pursue the data-intensive path to humanoid intelligence. Their custom Helix VLA model — built in collaboration with OpenAI and leveraging OpenAI's language model expertise — follows the paradigm established by RT-2: co-train a vision-language model backbone on both web-scale data and robot demonstrations to produce a model that reasons about novel situations and translates language instructions into physical actions.\n\nThe 41-degree-of-freedom action space of Figure 02 creates a fundamental data scaling challenge. A standard 7-DOF robotic arm needs demonstrations covering a 7-dimensional action space. Figure 02's full body — 41 joints including two 16-DOF dexterous hands — requires coverage of a 41-dimensional space. The curse of dimensionality means that achieving equivalent coverage requires exponentially more demonstrations. This is not a theoretical concern — it is the primary bottleneck Figure faces in scaling from impressive laboratory demonstrations to reliable commercial deployment.\n\nThe dexterous hands are particularly data-hungry. Each hand has 16 degrees of freedom allowing individuated finger control, precision pinch grasps, power grasps, and tool manipulation. The contact dynamics between robot fingers and real-world objects (rigid, deformable, fragile, slippery) are nearly impossible to simulate faithfully — friction, compliance, and texture vary across millions of object types in ways that no physics engine captures. Real-world manipulation data with force and tactile feedback from diverse objects is irreplaceable for training dexterous hand policies.\n\nFigure's BMW deployment at the Spartanburg, South Carolina manufacturing plant provides initial commercial validation but also exposes the generalization challenge. A policy trained at Spartanburg with specific tooling, part geometries, and environmental conditions must transfer to other manufacturing facilities with different configurations. Each new deployment site requires either massive retraining or initial training data diverse enough to cover the variation across sites. Claru's ability to collect manipulation data across dozens of industrial environments directly addresses this generalization requirement.\n\nThe sim-to-real transfer problem is particularly acute for humanoids. Simulated locomotion policies trained in Isaac Gym or MuJoCo consistently fail on real hardware due to ground contact dynamics, actuator backlash, and compliant surface interactions. Real-world walking data collected in actual warehouse and factory environments — with realistic floor textures, obstacles, and human co-workers — provides the distributional coverage that simulation alone cannot deliver.",

  metaTitle: "Training Data for Figure AI's Humanoid Robots | Claru",
  metaDescription:
    "How real-world manipulation, egocentric video, and locomotion data addresses Figure AI's training data requirements for Figure 02 and the Helix VLA model.",
  primaryKeyword: "Figure AI training data",
  secondaryKeywords: [
    "Figure 02 data",
    "humanoid robot training data",
    "Figure AI manipulation data",
    "Helix VLA training data",
    "general purpose humanoid data",
  ],
  canonicalPath: "/for/figure-ai",
  h1: "Training Data for Figure AI",
  heroSubtitle:
    "Figure AI is building general-purpose humanoid robots backed by $2.6 billion in funding and an OpenAI partnership. Here is how real-world data accelerates their path from prototype to production.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Figure AI", href: "/for/figure-ai" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Figure AI",
      paragraphs: [
        "Figure AI was founded in 2022 by Brett Adcock, a serial entrepreneur who previously founded Vettery (acquired by Adecco for $110 million) and Archer Aviation (public, $3.8 billion market cap). Adcock's thesis is that humanoid robots are the largest addressable market in technology — a $100+ trillion labor market that no existing robot form factor can fully address because most work environments are designed for the human body.",
        "The company's trajectory has been extraordinarily aggressive. Figure 01, the first-generation prototype, was demonstrated walking and performing simple manipulation tasks within 12 months of the company's founding. Figure 02, the production-grade second generation, features 41 degrees of freedom including dexterous hands with 16 DOF per hand, onboard compute with NVIDIA GPUs, and the Helix AI system developed in collaboration with OpenAI.",
        "Figure's funding history reflects the scale of ambition: a $70 million Series A in 2023, followed by a $675 million Series B from Microsoft, NVIDIA, OpenAI, Jeff Bezos, Intel, Samsung, and others in early 2024 — and then a massive additional raise in February 2025 bringing total funding to over $2.6 billion at a $39 billion valuation. This makes Figure the most heavily capitalized humanoid robotics company in history.",
      ],
    },
    {
      type: "stats",
      heading: "Figure AI at a Glance",
      stats: [
        { value: "2022", label: "Founded" },
        { value: "$2.6B+", label: "Total Funding" },
        { value: "$39B", label: "Valuation (Feb 2025)" },
        { value: "41 DOF", label: "Figure 02 Joints" },
        { value: "Helix", label: "Custom VLA (w/ OpenAI)" },
        { value: "BMW", label: "First Deployment Partner" },
      ],
    },
    {
      type: "prose",
      heading: "The Helix VLA and OpenAI Partnership",
      paragraphs: [
        "Figure's collaboration with OpenAI produced Helix, a custom vision-language-action model that gives Figure 02 the ability to understand natural language instructions, reason about its environment, and translate high-level commands into physical actions. The architecture follows the VLA paradigm established by RT-2: a vision-language model backbone processes camera images and language instructions, then generates robot actions as output tokens.",
        "What distinguishes Helix from open-source VLA alternatives like OpenVLA is the scale of the language backbone (leveraging OpenAI's proprietary models) and the depth of the multimodal integration. Figure has demonstrated Helix-powered conversations where Figure 02 describes what it sees, reasons about which objects to manipulate, and executes complex multi-step tasks based on verbal instructions — capabilities that require both strong language understanding and grounded physical reasoning.",
        "The data requirement for training Helix is substantial. The VLA architecture needs three types of training data simultaneously: web-scale image-text data for visual-language pretraining (provided by OpenAI's existing infrastructure), robot demonstration data with language annotations for action grounding, and diverse environmental recordings for perceptual robustness. The robot demonstration data — teleoperated manipulation sequences paired with natural language instructions — is the bottleneck that Figure must solve through its own collection efforts.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Figure AI vs. Other Humanoid Companies",
      description:
        "How Figure compares to peers in the humanoid robot industry.",
      columns: ["Dimension", "Figure AI", "1X Technologies", "Tesla Optimus", "Agility Robotics"],
      rows: [
        { Dimension: "Total Funding", "Figure AI": "$2.6B+", "1X Technologies": "$125M+", "Tesla Optimus": "Tesla-funded", "Agility Robotics": "$179M+" },
        { Dimension: "Hand DOF", "Figure AI": "16 per hand", "1X Technologies": "Integrated gripper", "Tesla Optimus": "11 per hand", "Agility Robotics": "Simple gripper" },
        { Dimension: "AI Architecture", "Figure AI": "Helix VLA (w/ OpenAI)", "1X Technologies": "World Model + Redwood", "Tesla Optimus": "FSD-derived stack", "Agility Robotics": "RL + sim-to-real" },
        { Dimension: "Target Market", "Figure AI": "Manufacturing + logistics", "1X Technologies": "Consumer homes", "Tesla Optimus": "Tesla factories first", "Agility Robotics": "Warehouse logistics" },
        { Dimension: "First Deployment", "Figure AI": "BMW Spartanburg", "1X Technologies": "EVE commercial sites", "Tesla Optimus": "Tesla factory floor", "Agility Robotics": "Amazon BOS27" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Figure 02's 41-DOF action space creates data requirements fundamentally different from those of a standard robotic arm. Where a 7-DOF arm needs demonstrations covering 7 action dimensions, Figure 02's full body — including its 16-DOF hands — needs coverage of a much higher-dimensional space. The number of demonstrations required for equivalent coverage scales super-linearly with action dimensionality. This means Figure needs not just more data than arm-based robot companies, but categorically more.",
        "The dexterous hand data requirement is the most acute challenge. Figure 02's hands can perform precision pinch grasps, power grasps, individuated finger manipulation, and tool use — but each of these capabilities needs extensive demonstration data with force and contact feedback. The physics of fingertip-to-object contact varies dramatically across object materials (metal, plastic, fabric, paper, glass), surface textures (smooth, rough, oily), and compliance (rigid versus deformable). No simulation captures these contact dynamics at the fidelity needed for reliable dexterous manipulation.",
        "The environmental diversity requirement spans Figure's target deployment contexts. BMW's Spartanburg plant has specific lighting, tooling, and part geometries. Other automotive plants differ in every dimension. Warehouse and logistics environments introduce their own variation. Each deployment context requires either site-specific fine-tuning data or initial training data diverse enough to generalize across sites. Claru's ability to collect across 100+ cities with diverse industrial and commercial environments directly addresses this generalization need.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Figure AI",
      paragraphs: [
        "Claru addresses Figure's data needs across three layers. For visual pretraining, Claru's egocentric activity dataset of 386K+ clips provides first-person video of human activities in real environments — the visual grounding data that Helix needs to understand manipulation tasks, object affordances, and spatial relationships before being fine-tuned on robot-specific demonstrations.",
        "For manipulation demonstrations, Claru's distributed collector network can capture teleoperated task demonstrations in diverse real-world environments — different manufacturing facilities, warehouses, commercial spaces — producing the environmental diversity that single-lab collection cannot match. Each location contributes unique visual characteristics, object categories, and workspace configurations that make trained policies more robust across deployment sites.",
        "For language-paired data, Claru's annotation pipeline produces natural language instructions for every demonstration, written by human annotators who watch complete episodes and describe tasks in varied, natural phrasing. This instruction diversity is critical for Helix's language grounding — templated descriptions from scripted collection produce brittle language conditioning that fails on novel instructions.",
      ],
    },
    {
      type: "cards",
      heading: "Core Data Requirements",
      cards: [
        {
          title: "Dexterous Manipulation",
          description:
            "Two-handed object manipulation with force feedback, contact-rich interactions, and tool use — captured via teleoperation or motion capture across diverse objects and environments.",
          icon: "🤲",
        },
        {
          title: "Egocentric Activity Video",
          description:
            "First-person video of humans performing warehouse, factory, and household tasks — the visual pretraining data that grounds Helix's language understanding in physical action.",
          icon: "👁️",
        },
        {
          title: "Bipedal Locomotion",
          description:
            "Real-world walking and balancing data across varied terrain, stairs, ramps, and cluttered floors with full body pose tracking and surface characterization.",
          icon: "🚶",
        },
        {
          title: "Language-Action Pairs",
          description:
            "Natural language task descriptions paired with corresponding manipulation and navigation demonstrations for training the Helix VLA model.",
          icon: "💬",
        },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "brohan-rt2-2023",
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "cheng-humanoid-2024",
          title: "Expressive Whole-Body Control for Humanoid Robots",
          authors: "Cheng et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2402.16796",
        },
        {
          id: "kim-openvla-2024",
          title: "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "arXiv 2406.09246",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
        {
          id: "open-x-embodiment-2024",
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What type of training data does Figure AI need for humanoid robots?",
      answer:
        "Figure AI needs dexterous manipulation demonstrations from its 16-DOF hands, egocentric human activity video for visual pretraining, whole-body locomotion trajectories, and language-action paired data for training the Helix VLA model. The 41-DOF action space of Figure 02 requires significantly more demonstration data than traditional robotic arms — the curse of dimensionality means coverage requirements scale super-linearly with the number of controlled joints.",
    },
    {
      question: "What is Helix and how does it relate to OpenAI?",
      answer:
        "Helix is Figure AI's custom vision-language-action model developed in collaboration with OpenAI. It follows the VLA paradigm: a vision-language model backbone processes camera images and natural language instructions, then generates robot actions as output tokens. OpenAI contributes language model expertise while Figure provides the robotics hardware and demonstration data pipeline. Training Helix requires robot demonstrations paired with diverse natural language instructions — the data type that determines the model's ability to follow novel commands.",
    },
    {
      question: "How does real-world data help Figure AI's sim-to-real transfer?",
      answer:
        "Simulated humanoid policies consistently fail on real hardware due to unmodeled ground contact dynamics, actuator backlash, compliant surface interactions, and the complexity of fingertip-to-object contact physics. Figure 02's dexterous 16-DOF hands are especially sensitive — the friction and compliance of real objects vary in ways that physics engines cannot faithfully model. Real-world data collected in actual deployment environments provides the distributional coverage that fills these simulation gaps.",
    },
    {
      question: "How does Figure AI's funding compare to other humanoid companies?",
      answer:
        "Figure AI has raised over $2.6 billion at a $39 billion valuation as of February 2025, making it the most heavily capitalized humanoid robotics company in history. For comparison, 1X Technologies has raised $125 million, Agility Robotics $179 million, and Skild AI approximately $1.4 billion. Figure's investor roster — Microsoft, NVIDIA, OpenAI, Jeff Bezos, Intel, Samsung — reflects the conviction that general-purpose humanoids represent one of the largest technology opportunities of the decade.",
    },
    {
      question: "Can Claru provide custom data collection for Figure AI's humanoid robots?",
      answer:
        "Yes. Claru operates a global network of 10,000+ data collectors across 100+ cities who can capture teleoperated manipulation demonstrations, egocentric video, and motion capture data in target environments — warehouses, factories, commercial spaces — using standardized recording protocols. This distributed collection provides the environmental diversity and scale that single-lab operations cannot achieve.",
    },
  ],
  ctaHeading: "Accelerate Figure AI's Data Pipeline",
  ctaDescription:
    "Talk to our team about purpose-built manipulation, egocentric, and locomotion datasets for humanoid robot training.",
  relatedGlossaryTerms: ["humanoid-robot", "dexterous-manipulation", "egocentric-video", "vla"],
  relatedGuidePages: ["how-to-collect-teleoperation-data", "how-to-collect-egocentric-video-data"],
  relatedSolutionSlugs: [],
};

export default page;
