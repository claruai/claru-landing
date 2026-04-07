import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "meta-fair-robotics",
  companyName: "Meta FAIR Robotics",
  companyDescription:
    "Meta's Fundamental AI Research (FAIR) lab has a dedicated robotics division working on embodied AI, tactile sensing (DIGIT sensors), and habitat simulation. Their research bridges computer vision, language understanding, and physical interaction to create robots that can navigate and interact with real-world environments.",
  keyProducts: ["Habitat Simulator", "DIGIT Tactile Sensor", "Ego4D Dataset"],
  researchFocus: [
    "Embodied AI and navigation",
    "Tactile sensing for manipulation",
    "Egocentric perception (Ego4D/Ego-Exo4D)",
    "Sim-to-real transfer for embodied agents",
    "Audio-visual navigation and scene understanding",
  ],
  dataNeedsSummary:
    "Meta FAIR's robotics work is deeply connected to their broader AI research ecosystem. Ego4D and Ego-Exo4D established the importance of egocentric data for embodied AI. Their Habitat simulator needs real-world scan data for environment creation. DIGIT tactile sensing research requires real-world manipulation data with tactile ground truth.",
  dataNeeds: [
    {
      title: "Egocentric video with rich annotations for embodied AI",
      source: "Ego4D and Ego-Exo4D dataset projects (Grauman et al., 2022, 2024)",
      description: "Large-scale first-person video with temporal annotations, object interactions, and activity segmentation — extending the Ego4D paradigm to new environments and activities.",
    },
    {
      title: "Real-world 3D scans for Habitat environments",
      source: "Habitat simulator requirements for realistic environment creation",
      description: "High-quality 3D scans of real indoor environments — homes, offices, retail spaces — with material properties and lighting metadata for creating photorealistic simulation environments.",
    },
    {
      title: "Tactile manipulation data with DIGIT sensor recordings",
      source: "DIGIT tactile sensor research and contact-rich manipulation focus",
      description: "Manipulation recordings paired with high-resolution tactile feedback from DIGIT or similar sensors for training policies that integrate visual and tactile modalities.",
    },
    {
      title: "Audio-visual navigation recordings",
      source: "SoundSpaces project and audio-visual embodied agent research",
      description: "Synchronized audio-visual recordings from diverse indoor environments capturing room acoustics, ambient sounds, and spatial audio cues that embodied agents can use for navigation and scene understanding.",
    },
    {
      title: "Multi-viewpoint synchronized recordings (ego + exo)",
      source: "Ego-Exo4D project extending ego-only capture to multi-view",
      description: "Activities recorded simultaneously from first-person (egocentric) and third-person (exocentric) viewpoints with precise temporal synchronization, enabling models that bridge the gap between human experience and external observation.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Egocentric video with rich annotations for embodied AI",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale: "Claru's egocentric dataset directly extends the Ego4D paradigm with additional environmental diversity, activity categories, and annotation granularity from purpose-collected recordings.",
    },
    {
      labNeed: "Real-world 3D scans for Habitat environments",
      claruOffering: "Custom 3D Environment Scanning Collection",
      rationale: "Claru can coordinate 3D scanning campaigns in real environments across its global network, providing the diverse indoor scans needed for Habitat environment creation.",
    },
    {
      labNeed: "Tactile manipulation data with DIGIT sensor recordings",
      claruOffering: "Custom Tactile Manipulation Collection",
      rationale: "Claru can integrate DIGIT or compatible tactile sensors into its manipulation data collection protocols, producing synchronized visual-tactile recordings for multi-modal policy training.",
    },
    {
      labNeed: "Multi-viewpoint synchronized recordings (ego + exo)",
      claruOffering: "Custom Multi-Camera Collection Campaigns",
      rationale: "Claru's collection protocols can deploy synchronized multi-camera rigs — body-worn ego cameras plus fixed exo cameras — to produce the paired viewpoint data that Ego-Exo4D established as essential for embodied AI research.",
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
      id: "lambeta-digit-2020",
      title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation",
      authors: "Lambeta et al.",
      venue: "RA-L 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2005.14679",
    },
    {
      id: "szot-habitat-2021",
      title: "Habitat 2.0: Training Home Assistants to Rearrange their Habitat",
      authors: "Szot et al.",
      venue: "NeurIPS 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2106.14405",
    },
    {
      id: "grauman-egoexo4d-2024",
      title: "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
      authors: "Grauman et al.",
      venue: "CVPR 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2311.18259",
    },
    {
      id: "chen-soundspaces-2022",
      title: "SoundSpaces 2.0: A Simulation Platform for Visual-Acoustic Learning",
      authors: "Chen et al.",
      venue: "NeurIPS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2206.08312",
    },
    {
      id: "calandra-touch-2018",
      title: "More Than a Feeling: Learning to Grasp and Regrasp using Vision and Touch",
      authors: "Calandra et al.",
      venue: "RA-L 2018",
      year: 2018,
      url: "https://arxiv.org/abs/1805.11085",
    },
  ],
  technicalAnalysis:
    "Meta FAIR's robotics research sits at the intersection of several of Meta's core AI competencies: computer vision (from their image/video understanding work), language models (from LLaMA), and egocentric perception (from the Ego4D/Ego-Exo4D projects funded through Reality Labs). This convergence creates a unique robotics research program that emphasizes perception and understanding over hardware development.\n\nThe Ego4D project demonstrated that egocentric video is a critical data modality for embodied AI. Filmed from the wearer's perspective, egocentric video captures the visual experience of interacting with the physical world — how hands manipulate objects, how people navigate spaces, what visual cues guide human behavior. Meta's ongoing investment in egocentric data (Ego-Exo4D extends this to synchronized ego-exo viewpoints) reflects their belief that this data modality is foundational for robot learning.\n\nClaru's egocentric activity dataset of 386K+ clips is directly complementary to this research program. While Ego4D and Ego-Exo4D are massive academic datasets, they are static — collected once and never updated. Claru's ongoing collection capability means new activity categories, new environments, and targeted collection campaigns can extend the egocentric data distribution as research needs evolve.\n\nThe Habitat simulator creates a different but related data need. Habitat's value for embodied AI research depends on having realistic, diverse simulated environments. These environments are created from real-world 3D scans — meaning that the diversity of simulated environments is bottlenecked by the diversity of available scans. Most academic datasets contain primarily residential scans from North America and Europe. Claru's global network can provide scans from diverse geographic and cultural contexts.\n\nMeta's DIGIT tactile sensor has opened up tactile perception as a research frontier, but training tactile-visual policies requires manipulation data recorded with tactile sensors — a type of data that barely exists at scale. Claru can integrate DIGIT or compatible sensors into collection protocols to produce this rare data modality.\n\nThe SoundSpaces research program adds an audio dimension to embodied AI. Real-world room acoustics, ambient sounds, and spatial audio cues provide navigation information that complements vision. Training audio-visual agents requires synchronized audio-visual recordings from diverse indoor spaces — a data type that is extremely scarce in existing academic datasets but straightforward for Claru's distributed collection network to produce.",

  metaTitle: "Training Data for Meta FAIR Robotics & Ego4D | Claru",
  metaDescription:
    "Egocentric video, 3D environment scans, and tactile manipulation data for Meta FAIR's robotics research, Habitat simulator, and embodied AI programs.",
  primaryKeyword: "Meta FAIR robotics training data",
  secondaryKeywords: ["Ego4D training data", "Habitat simulator data", "DIGIT sensor data", "embodied AI data"],
  canonicalPath: "/for/meta-fair-robotics",
  h1: "Training Data for Meta FAIR Robotics",
  heroSubtitle:
    "Meta FAIR connects egocentric perception, tactile sensing, and simulation into a unified robotics research program. Here is how real-world data powers each dimension.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "Meta FAIR Robotics", href: "/for/meta-fair-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Meta FAIR Robotics",
      paragraphs: [
        "Meta's Fundamental AI Research (FAIR) lab was established in 2013 under Yann LeCun's leadership and has grown into one of the world's largest industrial AI research organizations. The robotics division within FAIR focuses on embodied intelligence — building AI systems that can perceive, navigate, and interact with the physical world through robot bodies.",
        "Unlike companies that build and sell robots, Meta FAIR Robotics is a pure research organization. Their output is published papers, open-source models, and benchmark datasets that advance the entire field. Ego4D, Habitat, and DIGIT are all open-source projects that have become standard tools and benchmarks across the embodied AI research community.",
        "Meta's unique position as both a social media and hardware company (through Reality Labs and the Quest headset line) creates natural synergies with robotics research. Egocentric perception research serves both AR/VR applications and robot learning. The Quest headsets generate egocentric video data at scale, and the spatial computing capabilities of Quest feed back into embodied AI research methods.",
      ],
    },
    {
      type: "stats",
      heading: "Meta FAIR Robotics at a Glance",
      stats: [
        { value: "3,670hrs", label: "Ego4D Video" },
        { value: "DIGIT", label: "Tactile Sensor" },
        { value: "Habitat", label: "Simulation Platform" },
        { value: "9 Countries", label: "Ego4D Coverage" },
        { value: "2013", label: "FAIR Founded" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Ego4D and its successor Ego-Exo4D represent Meta FAIR's largest data collection efforts for embodied AI. Ego4D contains 3,670 hours of egocentric video from 931 participants across 74 locations in 9 countries, with benchmark tasks spanning episodic memory, hand-object interaction, social interaction, and forecasting. Ego-Exo4D extends this with synchronized first-person and third-person viewpoints of skilled activities, enabling research on perspective transfer.",
        "The Habitat simulation platform provides a standardized environment for training and evaluating embodied AI agents. Habitat 2.0 and 3.0 support interactive manipulation, social navigation (agents interacting with simulated humans), and rearrangement tasks in photorealistic 3D environments. The platform's effectiveness depends on the quality and diversity of its underlying 3D scanned environments.",
        "DIGIT is a compact, low-cost tactile sensor that captures high-resolution images of the contact surface during robot manipulation. This enables robots to feel object properties — texture, hardness, slip — rather than relying on vision alone. Research using DIGIT has shown that tactile feedback improves grasp success rates, particularly for transparent or reflective objects that confound visual perception.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Meta FAIR Dataset Ecosystem",
      description: "Key datasets and platforms from Meta FAIR that shape embodied AI training data standards.",
      columns: ["Dataset/Platform", "Scale", "Modality", "Primary Use"],
      rows: [
        { "Dataset/Platform": "Ego4D", "Scale": "3,670 hours", "Modality": "Egocentric video + annotations", "Primary Use": "Activity understanding" },
        { "Dataset/Platform": "Ego-Exo4D", "Scale": "1,400 hours", "Modality": "Synchronized ego + exo video", "Primary Use": "Perspective transfer" },
        { "Dataset/Platform": "Habitat 3.0", "Scale": "100+ 3D scans", "Modality": "Interactive 3D simulation", "Primary Use": "Embodied agent training" },
        { "Dataset/Platform": "SoundSpaces", "Scale": "100+ rooms", "Modality": "Spatial audio + 3D scenes", "Primary Use": "Audio-visual navigation" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "Meta FAIR's egocentric data program has established that scale and diversity matter enormously. Ego4D's coverage of 9 countries and 74 locations produces visually diverse data, but gaps remain in industrial environments, healthcare settings, and outdoor activities. Each new environment and activity category added to the training distribution measurably improves downstream model performance.",
        "For Habitat, the bottleneck is high-quality 3D scans. Creating a photorealistic simulation environment from a real-world scan requires dense geometry, accurate material properties, and realistic lighting — a 3D scan of a living room must capture not just the geometry but the shininess of the coffee table, the softness of the couch, and the translucency of the curtains. This quality requirement limits the rate at which new environments can be added to Habitat.",
        "DIGIT tactile data is scarce because the sensor must be physically integrated into manipulation setups, and few research groups outside Meta have the hardware. Creating large-scale tactile manipulation datasets requires coordinated collection campaigns with standardized sensor configurations — a logistics challenge that maps well to Claru's distributed collection model.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Meta FAIR Robotics",
      paragraphs: [
        "Claru extends Meta FAIR's egocentric data frontier by providing ongoing collection capability across new environments and activity categories. Unlike Ego4D's one-time academic collection, Claru's network can rapidly spin up targeted campaigns — capturing specific activities, environments, or demographic groups as research needs evolve.",
        "For Habitat environment creation, Claru's global presence enables 3D scanning campaigns across geographically and culturally diverse indoor spaces. Kitchens in Tokyo, living rooms in Lagos, offices in São Paulo — this environmental diversity improves the generalization of embodied agents trained in Habitat.",
        "Claru's ability to equip collectors with standardized sensor packages makes it a natural partner for scaling rare data modalities like tactile sensing and spatial audio. By deploying DIGIT-compatible sensors or calibrated microphone arrays alongside standard cameras, Claru can produce the multi-modal recordings that Meta FAIR's research requires but cannot generate at scale from a single lab location.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "grauman-ego4d-2022",
          title: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
          authors: "Grauman et al.",
          venue: "CVPR 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2110.07058",
        },
        {
          id: "grauman-egoexo4d-2024",
          title: "Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives",
          authors: "Grauman et al.",
          venue: "CVPR 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2311.18259",
        },
        {
          id: "lambeta-digit-2020",
          title: "DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor",
          authors: "Lambeta et al.",
          venue: "RA-L 2020",
          year: 2020,
          url: "https://arxiv.org/abs/2005.14679",
        },
        {
          id: "szot-habitat-2021",
          title: "Habitat 2.0: Training Home Assistants to Rearrange their Habitat",
          authors: "Szot et al.",
          venue: "NeurIPS 2021",
          year: 2021,
          url: "https://arxiv.org/abs/2106.14405",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "How does Ego4D relate to robot training data?",
      answer: "Ego4D is a massive first-person video dataset that captures human interactions with the physical world. This data is foundational for robot learning because it shows how humans manipulate objects, navigate spaces, and make decisions — the visual experience that robots need to understand to operate in human environments.",
    },
    {
      question: "Why does Meta's Habitat simulator need real-world 3D scans?",
      answer: "Habitat creates simulated environments from real-world 3D scans. The diversity and quality of simulated environments is limited by available scans. Most academic scan datasets are geographically biased. More diverse real-world scans from different regions and building types improve Habitat's environmental coverage for embodied AI research.",
    },
    {
      question: "What is tactile manipulation data and why is it rare?",
      answer: "Tactile manipulation data combines visual recordings with high-resolution tactile sensor feedback (like Meta's DIGIT sensor) during object manipulation. This data is rare because it requires specialized sensors integrated into collection rigs. Most existing manipulation datasets are vision-only, creating a gap that limits tactile-visual policy research.",
    },
    {
      question: "What is the difference between Ego4D and Ego-Exo4D?",
      answer: "Ego4D captures activity exclusively from the wearer's first-person viewpoint. Ego-Exo4D adds synchronized third-person cameras, providing both perspectives of the same activity simultaneously. This paired data enables research on translating between how an activity looks from outside versus how it feels from inside — critical for teaching robots from human demonstration videos.",
    },
    {
      question: "How does audio data complement vision for embodied AI?",
      answer: "Meta's SoundSpaces research shows that spatial audio provides navigation cues that vision alone cannot — hearing a conversation in the next room, detecting a running faucet, or recognizing the acoustics of different room sizes. Training audio-visual agents requires synchronized recordings from diverse indoor spaces, a data type that is extremely scarce in existing datasets.",
    },
  ],
  ctaHeading: "Extend the Egocentric Data Frontier",
  ctaDescription: "Discuss egocentric video, environment scanning, and tactile data for Meta FAIR's robotics research.",
  relatedGlossaryTerms: ["egocentric-video", "embodied-ai", "sim-to-real-gap", "hand-object-interaction"],
  relatedGuidePages: ["how-to-collect-egocentric-video-data", "how-to-build-an-egocentric-data-pipeline"],
  relatedSolutionSlugs: [],
};

export default page;
