import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "cmu-robotics",
  companyName: "CMU Robotics Institute",
  companyDescription:
    "Carnegie Mellon's Robotics Institute is the largest academic robotics research center in the world. Founded in 1979, the RI houses over 500 faculty and researchers across labs led by Deepak Pathak (robot learning at scale), Abhinav Gupta (embodied AI), Oliver Kroemer (manipulation), and many others. CMU has produced foundational work on cross-embodiment learning, curiosity-driven exploration, visual navigation, and manipulation from human demonstrations.",
  keyProducts: [
    "HomeRobot Benchmark",
    "ViNT Navigation Model",
    "NoMaD Navigation Policy",
    "Cross-Embodiment Research",
  ],
  researchFocus: [
    "Large-scale robot learning from diverse data",
    "Cross-embodiment transfer and generalization",
    "Visual navigation in the real world",
    "Manipulation from human demonstrations",
    "Curiosity-driven exploration and self-supervised learning",
  ],
  dataNeedsSummary:
    "CMU Robotics Institute's emphasis on real-world robot deployment — not just simulation — creates persistent demand for diverse manipulation data, navigation recordings from authentic environments, and cross-embodiment demonstrations that span the variety of robot platforms used across CMU's many labs. The institute's outsized influence on the field means that data collected for CMU research propagates to companies and labs worldwide.",
  dataNeeds: [
    {
      title: "Visual navigation data from diverse real environments",
      source: "ViNT paper (Shah et al., CoRL 2023) and NoMaD research",
      description:
        "Navigation trajectories with visual observations from diverse indoor and outdoor environments — not just university corridors but homes, retail spaces, parks, and industrial facilities — to extend generalization beyond the environments accessible to a few university labs.",
    },
    {
      title: "Manipulation demonstrations across multiple platforms",
      source: "CMU's cross-embodiment research and multi-lab robot fleet",
      description:
        "Manipulation recordings from diverse robot platforms used across CMU labs, formatted for cross-embodiment learning research and policy training that inspired the Open X-Embodiment project and Skild AI.",
    },
    {
      title: "Human demonstration video for imitation learning",
      source: "Gupta and Pathak labs' work on learning from human video",
      description:
        "Third-person and egocentric video of humans performing tasks that robots should learn, with temporal and spatial annotations for extracting manipulation primitives and understanding task structure.",
    },
    {
      title: "Multi-task manipulation with object diversity",
      source: "Kroemer Manipulation Lab's generalization research",
      description:
        "Manipulation recordings spanning hundreds of distinct object categories and surface types to train policies that generalize across the long tail of real-world objects and workspace configurations.",
    },
    {
      title: "Outdoor and unstructured terrain locomotion data",
      source: "CMU quadruped and legged robot research programs",
      description:
        "Real-world locomotion recordings on grass, gravel, slopes, stairs, and construction sites with full kinematic and IMU measurements for training robust locomotion controllers that transfer from simulation.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Visual navigation data from diverse real environments",
      claruOffering: "Egocentric Activity Dataset + Custom Navigation Collection",
      rationale:
        "Claru's egocentric data captures navigation through real environments across 100+ cities. Targeted collection with navigation-specific sensor packages extends coverage to environments underrepresented in academic datasets — providing the geographic diversity ViNT needs to generalize globally.",
    },
    {
      labNeed: "Manipulation demonstrations across multiple platforms",
      claruOffering:
        "Manipulation Trajectory Dataset + Custom Multi-Platform Collection",
      rationale:
        "Claru's manipulation data spans diverse interaction types. Custom collection using platform-specific recording formats can fill coverage gaps for specific robot embodiments used across CMU's many labs.",
    },
    {
      labNeed: "Human demonstration video for imitation learning",
      claruOffering: "Egocentric Activity Dataset (~386K clips)",
      rationale:
        "Claru's 386K-clip egocentric dataset provides extensive human demonstration video with activity labels and temporal annotations — directly usable for learning manipulation primitives from human video, a core research direction for the Gupta and Pathak labs.",
    },
    {
      labNeed: "Multi-task manipulation with object diversity",
      claruOffering: "Custom Multi-Object Manipulation Collection",
      rationale:
        "Claru collectors operating in their own homes and local environments naturally produce object and surface diversity that exceeds what any single university lab can achieve, covering cultural and regional object variation.",
    },
  ],
  keyPapers: [
    {
      id: "shah-vint-2023",
      title: "ViNT: A Foundation Model for Visual Navigation",
      authors: "Shah et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.14846",
    },
    {
      id: "pathak-curiosity-2017",
      title: "Curiosity-driven Exploration by Self-Supervised Prediction",
      authors: "Pathak et al.",
      venue: "ICML 2017",
      year: 2017,
      url: "https://arxiv.org/abs/1705.05363",
    },
    {
      id: "gupta-embodied-2022",
      title: "Embodied Intelligence via Learning and Evolution",
      authors: "Gupta et al.",
      venue: "Nature Communications",
      year: 2022,
      url: "https://www.nature.com/articles/s41467-021-25874-z",
    },
    {
      id: "shah-nomad-2023",
      title:
        "NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration",
      authors: "Shah et al.",
      venue: "arXiv 2310.07896",
      year: 2023,
      url: "https://arxiv.org/abs/2310.07896",
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "bahl-human-to-robot-2022",
      title:
        "Human-to-Robot Imitation in the Wild",
      authors: "Bahl et al.",
      venue: "RSS 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2207.09450",
    },
  ],
  technicalAnalysis:
    "CMU's Robotics Institute has produced many of the key researchers and ideas driving the current wave of robot learning. Skild AI — founded by CMU professors Deepak Pathak and Abhinav Gupta in 2023 and now valued at over $14 billion after raising $1.4 billion in January 2026 — is a direct product of CMU research on cross-embodiment learning and scalable robot data. The ViNT and NoMaD navigation models, cross-embodiment transfer learning, and curiosity-driven exploration all have deep CMU roots. This academic influence means that data collected for CMU research shapes the training distributions used by companies and labs worldwide.\n\nThe ViNT visual navigation model illustrates the data challenge clearly. ViNT was trained on navigation data from diverse real-world environments and showed unprecedented generalization — but its training data was limited to environments accessible to a few university labs primarily in the United States. Expanding ViNT-quality navigation to truly global environmental diversity requires data collection at a geographic scale that academic institutions cannot achieve on their own. Homes in Tokyo look different from homes in Lagos, which look different from homes in Pittsburgh. Visual navigation policies must handle this variation to be broadly useful.\n\nCMU's manipulation research similarly benefits from environmental diversity. Oliver Kroemer's manipulation lab develops methods that generalize across objects and settings, but generalization is fundamentally limited by the diversity of training data. More objects, more surfaces, more lighting conditions, more workspace configurations — each dimension of diversity improves robustness. The gap between laboratory demonstrations and real-world deployment conditions remains the primary obstacle, and it is fundamentally a data diversity problem.\n\nThe cross-embodiment research championed by Pathak and Gupta creates a meta-level data need: manipulation data collected on as many different robot platforms as possible. This research direction, which directly inspired the Open X-Embodiment project and Skild AI's universal robot brain, requires coordination across multiple institutions and robot types. The principle is that a model trained on data from many different robots learns embodiment-agnostic task representations — understanding what needs to happen separately from the specific kinematic structure doing it. Claru's ability to collect data using standardized protocols on diverse hardware platforms supports this coordination challenge directly.",

  metaTitle: "Training Data for CMU Robotics Institute | Claru",
  metaDescription:
    "Visual navigation, manipulation, and cross-embodiment demonstration data for Carnegie Mellon's Robotics Institute research on large-scale robot learning.",
  primaryKeyword: "CMU Robotics Institute training data",
  secondaryKeywords: [
    "CMU robotics data",
    "ViNT navigation data",
    "cross-embodiment robot data",
    "Carnegie Mellon manipulation data",
  ],
  canonicalPath: "/for/cmu-robotics",
  h1: "Training Data for CMU Robotics Institute",
  heroSubtitle:
    "CMU's Robotics Institute is the world's largest academic robotics center and birthplace of Skild AI. Here is how diverse real-world data supports research that shapes the entire field.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    { label: "CMU Robotics", href: "/for/cmu-robotics" },
  ],
  sections: [
    {
      type: "prose",
      heading: "About CMU Robotics Institute",
      paragraphs: [
        "The Robotics Institute at Carnegie Mellon University was founded in 1979 and is the oldest and largest university robotics research organization in the world. With over 500 faculty, researchers, and students, the RI spans the full breadth of robotics — from perception and manipulation to locomotion, planning, and human-robot interaction. The institute operates within CMU's School of Computer Science and has produced many of the field's most influential researchers and companies.",
        "Key robotics faculty include Deepak Pathak, whose work on curiosity-driven exploration and scalable robot learning led to the co-founding of Skild AI in 2023. Abhinav Gupta leads research on embodied intelligence and visual learning from the physical world. Oliver Kroemer directs the Intelligent Autonomous Manipulation Lab, focused on generalizable manipulation skills. Their combined research output has directly influenced the trajectory of commercial robotics through papers, open-source tools, and startup formation.",
        "CMU's proximity to Pittsburgh's growing robotics ecosystem — which includes Skild AI, Aurora Innovation, Argo AI's legacy team, and numerous other startups — creates a research-to-industry pipeline unmatched by any other academic institution in robotics.",
      ],
    },
    {
      type: "stats",
      heading: "CMU Robotics at a Glance",
      stats: [
        { value: "1979", label: "RI Founded" },
        { value: "Largest", label: "Academic Robotics Center" },
        { value: "500+", label: "Faculty & Researchers" },
        { value: "Skild AI", label: "Notable Spinout ($14B)" },
        { value: "ViNT", label: "Navigation Foundation Model" },
        { value: "Open X", label: "Cross-Embodiment Pioneer" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "The Pathak Lab's research on scalable robot learning focuses on training policies from large, diverse datasets rather than hand-engineered controllers. Their curiosity-driven exploration work (ICML 2017) showed that agents can learn useful behaviors without explicit reward signals — a principle that underpins modern approaches to robot pretraining. Pathak's research on learning from internet-scale video and real-world data directly informed Skild AI's approach to building a universal robot brain.",
        "Shah et al.'s ViNT (Visual Navigation Transformer) demonstrated that a single model trained on navigation data from diverse environments can generalize to unseen buildings, outdoor spaces, and even different robot platforms. ViNT's success came from training on data collected across multiple institutions and environments — but coverage remains limited to locations accessible to academic labs. The follow-up work NoMaD extended this to goal-conditioned navigation using diffusion policies.",
        "CMU's manipulation research, led by Kroemer and others, focuses on learning manipulation skills that transfer across objects and settings. The lab has contributed to the Open X-Embodiment collaboration — a multi-institution effort to build shared manipulation datasets that enable cross-robot generalization. This work requires manipulation data from as many different environments and robot platforms as possible.",
      ],
    },
    {
      type: "comparison-table",
      heading: "CMU Robotics vs. Other Academic Labs",
      description:
        "How CMU's robotics research compares to peer institutions in scope and industry impact.",
      columns: ["Dimension", "CMU Robotics", "Stanford SAIL", "MIT CSAIL"],
      rows: [
        { Dimension: "Primary Focus", "CMU Robotics": "Cross-embodiment, navigation", "Stanford SAIL": "Low-cost hardware, open policies", "MIT CSAIL": "Physics-based, contact-rich" },
        { Dimension: "Key Innovation", "CMU Robotics": "ViNT, curiosity-driven RL", "Stanford SAIL": "ALOHA, Octo, Bridge", "MIT CSAIL": "Drake simulator, diffusion" },
        { Dimension: "Notable Spinout", "CMU Robotics": "Skild AI ($14B)", "Stanford SAIL": "Octo (open-source)", "MIT CSAIL": "Drake (open-source)" },
        { Dimension: "Data Philosophy", "CMU Robotics": "Scale + embodiment diversity", "Stanford SAIL": "Accessibility + community", "MIT CSAIL": "Physics fidelity + validation" },
        { Dimension: "Robot Platforms", "CMU Robotics": "Multi-platform fleet", "Stanford SAIL": "ALOHA, WidowX", "MIT CSAIL": "Custom + commercial" },
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "CMU's research creates data requirements at two levels. At the individual lab level, each research group needs domain-specific data — navigation trajectories for the ViNT team, manipulation demonstrations for the Kroemer lab, human activity video for the Gupta group. At the institutional level, CMU's emphasis on cross-embodiment learning and scalable robot intelligence demands data that spans the full diversity of real-world conditions.",
        "The navigation data gap is particularly acute. ViNT showed that training on diverse environments produces dramatically better generalization than training on data from a single building. But current academic navigation datasets cover primarily university campuses in North America. Homes, offices, retail spaces, hospitals, and industrial facilities across different countries and cultures present visual distributions that existing datasets do not capture. Claru's collector network across 100+ cities provides exactly this kind of geographic diversity.",
        "The human demonstration video requirement connects to CMU's work on learning robot behaviors from watching humans. The Gupta lab has shown that visual representations learned from human activity video transfer to robot manipulation tasks — but the quality and diversity of pretraining data directly affects downstream robot performance. Purpose-collected, annotated human activity video provides dramatically higher training signal than raw internet video.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports CMU Robotics",
      paragraphs: [
        "Claru's distributed collection model directly addresses the data diversity bottleneck that limits CMU's research generalization. Navigation data from 100+ cities provides the environmental variety that ViNT needs to generalize globally. Manipulation data collected across diverse households captures object and surface variation that university labs cannot replicate.",
        "For cross-embodiment research, Claru can coordinate data collection across multiple robot platforms using standardized recording protocols, producing the multi-embodiment datasets that CMU's research direction requires. Each collection campaign uses consistent annotation standards while capturing the natural variation of different physical environments.",
        "Claru's egocentric activity dataset of 386K+ clips also serves as a pretraining resource for CMU's work on learning from human demonstrations. The dataset captures human activities in real environments with temporal annotations and activity labels — significantly more useful for robot pretraining than uncurated internet video.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "shah-vint-2023",
          title: "ViNT: A Foundation Model for Visual Navigation",
          authors: "Shah et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2306.14846",
        },
        {
          id: "pathak-curiosity-2017",
          title:
            "Curiosity-driven Exploration by Self-Supervised Prediction",
          authors: "Pathak et al.",
          venue: "ICML 2017",
          year: 2017,
          url: "https://arxiv.org/abs/1705.05363",
        },
        {
          id: "open-x-embodiment-2024",
          title:
            "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          authors: "Open X-Embodiment Collaboration",
          venue: "ICRA 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2310.08864",
        },
        {
          id: "bahl-human-to-robot-2022",
          title: "Human-to-Robot Imitation in the Wild",
          authors: "Bahl et al.",
          venue: "RSS 2022",
          year: 2022,
          url: "https://arxiv.org/abs/2207.09450",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why does CMU Robotics need geographically diverse data?",
      answer:
        "CMU models like ViNT show strong generalization but are limited by training data from a few university environments. Real-world environments vary dramatically across regions — architecture, object types, lighting, layout conventions. Geographically diverse data produces models that work globally, not just in Pittsburgh.",
    },
    {
      question: "What is cross-embodiment robot data?",
      answer:
        "Cross-embodiment data is manipulation and navigation recordings from multiple different robot platforms. Training on this diversity forces models to learn embodiment-agnostic task representations — understanding what to do separately from the specific hardware doing it. CMU pioneered this research direction with work that inspired Open X-Embodiment and Skild AI.",
    },
    {
      question: "How does CMU research influence industry?",
      answer:
        "CMU has produced founders of Skild AI (valued at $14 billion), Aurora Innovation, and many other robotics companies. Research benchmarks and datasets created at CMU become industry standards. High-quality data created for CMU research propagates through the entire robotics ecosystem via published papers, open-source code, and researcher career paths.",
    },
    {
      question: "What role did CMU play in the founding of Skild AI?",
      answer:
        "Skild AI was co-founded in 2023 by CMU professors Deepak Pathak and Abhinav Gupta, who brought complementary expertise in curiosity-driven learning and embodied intelligence. Their CMU research on scalable robot learning and cross-embodiment transfer directly informed Skild's approach to building a universal robot foundation model.",
    },
    {
      question:
        "How does human demonstration video help robot learning at CMU?",
      answer:
        "CMU researchers have shown that visual representations learned from watching human activities transfer to robot manipulation tasks. Robots can learn task structure, object affordances, and spatial relationships from human video before being fine-tuned on robot-specific data. High-quality, annotated human activity video provides much stronger training signal than raw internet video.",
    },
  ],
  ctaHeading: "Data for World-Class Robot Learning Research",
  ctaDescription:
    "Discuss diverse, scalable training data for CMU Robotics Institute's research programs.",
  relatedGlossaryTerms: [
    "cross-embodiment-data",
    "imitation-learning",
    "robot-learning",
    "egocentric-video",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-build-a-navigation-dataset",
  ],
  relatedSolutionSlugs: [],
};

export default page;
