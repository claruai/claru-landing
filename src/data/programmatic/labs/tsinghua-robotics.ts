import type { LabPageData } from "./types";

const page: LabPageData = {
  slug: "tsinghua-robotics",
  companyName: "Tsinghua University Robotics",
  companyDescription:
    "Tsinghua University's robotics research spans the Department of Automation, the Institute for AI, and the cross-disciplinary SIGS campus in Shenzhen. In 2025, Tsinghua established a new Institute for Embodied Intelligence and Robotics, headed by Professor Zhang Tao, integrating resources across schools. Tsinghua is a leading Chinese institution for humanoid development, dexterous manipulation, and the intersection of foundation models with robot control. Their proximity to Chinese robot manufacturers (Unitree, UBTech, Fourier Intelligence, Galbot) creates a strong research-industry pipeline.",
  keyProducts: [
    "ARIO Benchmark",
    "Institute for Embodied Intelligence and Robotics",
    "Multi-Embodiment Research Platforms",
  ],
  researchFocus: [
    "Foundation models for Chinese humanoid platforms",
    "Dexterous manipulation with Chinese robot hardware",
    "Embodied world models and embodied AI",
    "Deep reinforcement learning for sensorimotor control",
    "Human activity understanding for robotics",
  ],
  dataNeedsSummary:
    "Tsinghua's robotics groups are building foundation models tailored to Chinese humanoid platforms like Unitree and UBTech. They need manipulation and locomotion data that represents Chinese domestic and industrial environments — which differ significantly from Western datasets in architectural style, object types, and workflow patterns. The newly established Institute for Embodied Intelligence accelerates this demand.",
  dataNeeds: [
    {
      title: "Chinese domestic environment data",
      source:
        "Tsinghua embodied AI research for domestic assistive robots",
      description:
        "Manipulation and navigation data from Chinese homes — with characteristic furniture styles, kitchen layouts, floor-level living areas, and household objects like rice cookers, woks, and chopstick sets that differ from Western training data.",
    },
    {
      title: "Foundation model training data for Chinese humanoids",
      source:
        "Tsinghua collaboration with Unitree, UBTech, Fourier Intelligence, and Galbot",
      description:
        "Large-scale demonstration data from Chinese humanoid platforms for training foundation models optimized for this hardware ecosystem, formatted for the specific kinematics and sensor configurations of Chinese robots.",
    },
    {
      title: "Multi-modal embodied AI data with Chinese language",
      source:
        "Chinese-language VLA model development at Tsinghua IIIS",
      description:
        "Manipulation demonstrations paired with Chinese language instructions for training vision-language-action models that understand Mandarin task descriptions — a data modality that barely exists at scale.",
    },
    {
      title: "Embodied world model training data",
      source:
        "Tsinghua survey on embodied world models (2025) and related research",
      description:
        "Video data of physical interactions with diverse objects and environments for training world models that can predict future states — supporting Tsinghua's research on model architectures for embodied intelligence.",
    },
    {
      title: "Industrial manipulation for Chinese manufacturing",
      source:
        "Tsinghua partnerships with Chinese electronics and automotive manufacturers",
      description:
        "Manipulation data from Chinese factory environments — semiconductor handling, electronics assembly, automotive parts — with the specific workflows and components used in Chinese industrial settings.",
    },
  ],
  dataMatches: [
    {
      labNeed: "Chinese domestic environment data",
      claruOffering:
        "Custom Collection in Chinese Domestic Environments",
      rationale:
        "Claru's collector network includes Chinese locations where data can be collected in authentic domestic environments with regionally characteristic objects, layouts, and conditions that Western-dominated datasets completely miss.",
    },
    {
      labNeed: "Foundation model training data for Chinese humanoids",
      claruOffering:
        "Custom Multi-Platform Collection + Manipulation Trajectory Dataset",
      rationale:
        "Claru can coordinate data collection across Chinese humanoid platforms (Unitree G1, UBTech Walker) using standardized protocols, producing training data in compatible formats for foundation model research.",
    },
    {
      labNeed: "Multi-modal embodied AI data with Chinese language",
      claruOffering:
        "Custom Language-Paired Collection in Mandarin",
      rationale:
        "Claru's multilingual collector network can produce manipulation demonstrations with concurrent Mandarin narration for Chinese-language VLA model training — filling a critical gap in existing resources.",
    },
    {
      labNeed: "Embodied world model training data",
      claruOffering: "Egocentric Activity Dataset + Custom Collection",
      rationale:
        "Claru's 386K+ clip egocentric dataset provides diverse video of physical interactions. Custom collection campaigns can target the specific interaction types and environments needed for world model training.",
    },
  ],
  keyPapers: [
    {
      id: "liu-ario-2024",
      title:
        "ARIO: Benchmarking Robot Manipulation with Real-World Environments",
      authors: "Liu et al.",
      venue: "arXiv 2410.13369",
      year: 2024,
      url: "https://arxiv.org/abs/2410.13369",
    },
    {
      id: "shang-embodied-world-2025",
      title: "A Survey of Embodied World Models",
      authors: "Shang, Y. et al.",
      venue: "Tsinghua EE Technical Report",
      year: 2025,
      url: "https://fi.ee.tsinghua.edu.cn/public/publications/0940dda4-af15-11f0-9d60-0242ac120002.pdf",
    },
    {
      id: "li-foundation-manip-2025",
      title:
        "What Foundation Models Can Bring for Robot Learning in Manipulation: A Survey",
      authors: "Li, D. et al.",
      venue: "International Journal of Robotics Research",
      year: 2025,
      url: "https://journals.sagepub.com/doi/10.1177/02783649251390579",
    },
    {
      id: "zhu-embodied-2024",
      title:
        "Embodied AI in the Age of Foundation Models",
      authors: "Zhu et al.",
      venue: "Tsinghua AI Review",
      year: 2024,
      url: "https://arxiv.org/abs/2404.15431",
    },
    {
      id: "xu-embodied-rl-2024",
      title:
        "Addressing Core Challenges in Embodied AI: Data Efficiency and Generalization",
      authors: "Xu, H. et al.",
      venue: "Tsinghua IIIS",
      year: 2024,
      url: "https://ml.cs.tsinghua.edu.cn/~huazhe/",
    },
    {
      id: "zhao-humanoid-locomotion-2024",
      title:
        "Virtual Slope Walking and Generalized Model Predictive Control for Bipedal Locomotion",
      authors: "Zhao, M. et al.",
      venue: "Tsinghua Robotics",
      year: 2024,
      url: "https://ieeexplore.ieee.org",
    },
  ],
  technicalAnalysis:
    "Tsinghua University's robotics research is uniquely positioned at the intersection of world-class AI research and China's rapidly growing humanoid robot industry. While Stanford and CMU have deep relationships with US robotics companies, Tsinghua serves the same role for Chinese companies like Unitree, UBTech, Fourier Intelligence, and Galbot. The 2025 establishment of the Institute for Embodied Intelligence and Robotics — headed by Professor Zhang Tao, integrating resources from automation, mechanical engineering, electronic engineering, and computer science — signals a major institutional commitment to this role.\n\nThe data challenge for Chinese robotics is geographic and cultural, not merely technical. Almost all major robot manipulation datasets — Open X-Embodiment, Bridge, DROID — are collected in North American and European environments. Chinese homes have fundamentally different spatial layouts (smaller kitchens, floor-level living areas), different household objects (chopsticks, woks, rice cookers, Chinese tea sets, mahjong tiles), and different organizational patterns. Models trained exclusively on Western data underperform in Chinese environments because the visual and spatial distributions differ at every level — from room geometry to object textures to lighting characteristics.\n\nThis is not a minor calibration issue — it is a fundamental distribution mismatch. A robot trained to set a Western table cannot set a Chinese table without data showing Chinese tableware arrangements. A robot trained to navigate American kitchens may fail in a Shanghai apartment kitchen with a completely different spatial layout and appliance set. Tsinghua's research, which aims to build foundation models that work in Chinese environments, requires training data collected in authentic Chinese settings.\n\nTsinghua's research on embodied world models, surveyed in a 2025 paper from the university's EE department, adds another dimension. World models learn to predict how physical scenes evolve over time — enabling robots to plan actions by imagining their consequences before executing them. Training these models requires large quantities of video showing physical interactions with diverse objects in diverse settings. The cultural and geographic bias in existing video datasets means that world models trained on Western data develop an impoverished understanding of Chinese physical environments.\n\nThe Chinese-language dimension creates yet another gap. Existing VLA models (vision-language-action) are primarily trained on English-language task descriptions. Chinese-language robot control requires language-action pairs in Mandarin, which do not exist at scale. Building Chinese VLA models requires parallel data collection campaigns where manipulation demonstrations are narrated in Mandarin rather than English — a capability that Claru's multilingual global collector network can provide directly.",

  metaTitle:
    "Training Data for Tsinghua University Robotics | Claru",
  metaDescription:
    "Chinese domestic environment, humanoid foundation model, and Mandarin-language VLA data for Tsinghua University's robotics research and Chinese robot industry partnerships.",
  primaryKeyword: "Tsinghua robotics training data",
  secondaryKeywords: [
    "Chinese robotics data",
    "Chinese humanoid data",
    "Tsinghua AI data",
    "Mandarin VLA training data",
  ],
  canonicalPath: "/for/tsinghua-robotics",
  h1: "Training Data for Tsinghua University Robotics",
  heroSubtitle:
    "Tsinghua bridges AI research and China's humanoid industry. Here is how regionally authentic data addresses the Western bias in current robot training datasets.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/for" },
    {
      label: "Tsinghua Robotics",
      href: "/for/tsinghua-robotics",
    },
  ],
  sections: [
    {
      type: "prose",
      heading: "About Tsinghua University Robotics",
      paragraphs: [
        "Tsinghua University, consistently ranked among the top three universities in China and top 15 globally, has made robotics and embodied AI a strategic research priority. In 2025, the university established a new Institute for Embodied Intelligence and Robotics, led by Professor Zhang Tao from the Department of Automation, which integrates resources from multiple schools to create a cross-disciplinary research center for humanoid robots and embodied AI systems.",
        "Key robotics researchers include Mingguo Zhao, who has developed novel approaches to bipedal locomotion including Virtual Slope Walking and Generalized Model Predictive Control. Huazhe Xu at Tsinghua's Institute for Interdisciplinary Information Sciences (IIIS) — the institute founded by Turing Award winner Andrew Yao — focuses on deep reinforcement learning for embodied AI, addressing core challenges of data efficiency and generalization. Fuchun Sun leads research on multi-modal perception and manipulation.",
        "Tsinghua's Shenzhen International Graduate School (SIGS) campus adds a geographic connection to China's hardware manufacturing hub. Located in the same city as Unitree, DJI, and numerous Chinese robotics startups, SIGS provides a direct pipeline from academic research to commercial deployment in China's rapidly growing robot industry.",
      ],
    },
    {
      type: "stats",
      heading: "Tsinghua Robotics at a Glance",
      stats: [
        { value: "Top 3", label: "Chinese University" },
        { value: "2025", label: "Embodied AI Institute" },
        { value: "Shenzhen", label: "SIGS Campus" },
        { value: "Unitree", label: "Industry Partner" },
        { value: "IIIS", label: "Turing Institute" },
        { value: "China", label: "Largest Robot Market" },
      ],
    },
    {
      type: "prose",
      heading: "Research Focus and Key Projects",
      paragraphs: [
        "Tsinghua's ARIO benchmark represents an important effort to evaluate robot manipulation in real-world environments rather than just simulation. By testing manipulation policies against authentic objects and settings, ARIO provides a more reliable assessment of policy generalization than simulation-only benchmarks. The benchmark underscores the importance of diverse real-world data for training robust manipulation policies.",
        "The university's survey work on embodied world models (2025) and foundation models for manipulation (IJRR 2025) positions Tsinghua at the theoretical frontier of robot learning. These papers systematically review model architectures, training paradigms, and benchmarks — providing the conceptual framework that guides Tsinghua's experimental research on building foundation models for Chinese robot platforms.",
        "Tsinghua's collaboration with Chinese humanoid manufacturers is distinctive. While US universities primarily work with US robot companies, Tsinghua serves as the academic partner for China's humanoid ecosystem — Unitree (affordable humanoids), UBTech (service robots), Fourier Intelligence (rehabilitation), and Galbot (general-purpose). Research conducted at Tsinghua directly shapes the AI capabilities of Chinese humanoid platforms through collaborative programs and talent pipelines.",
      ],
    },
    {
      type: "prose",
      heading: "Data Requirements Analysis",
      paragraphs: [
        "The Western data bias is Tsinghua's most fundamental challenge. Virtually every major robotics dataset used for foundation model training was collected in North American or European environments. Chinese homes — with floor heating systems, compact galley kitchens, floor-level dining areas, and culturally specific objects — are not represented. This creates a distribution mismatch that no amount of domain adaptation can fully solve without Chinese-environment source data.",
        "The Mandarin language gap compounds the problem. Vision-language-action models need paired data: visual observations of manipulation tasks alongside natural language descriptions of what is happening. Existing datasets provide this pairing in English. Building Chinese VLA models requires equivalent data in Mandarin — demonstrations narrated in Chinese with Chinese-language task descriptions.",
        "China's manufacturing sector adds industrial data requirements. Chinese electronics and automotive manufacturing use different processes, components, and quality standards than Western counterparts. Robots deployed in Chinese factories need training data from Chinese factories — not transferred policies from American or German manufacturing environments.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Tsinghua Robotics",
      paragraphs: [
        "Claru's global collector network — which includes Chinese locations — can address Tsinghua's data gaps directly. Purpose-collected data from authentic Chinese domestic environments with regionally characteristic objects, layouts, and conditions provides the training signal that Western-dominated datasets cannot.",
        "For Mandarin VLA data, Claru can coordinate collection campaigns where Chinese-speaking collectors perform manipulation tasks with concurrent Mandarin narration, producing the language-action pairs needed for Chinese-language robot control. This fills a gap that no existing dataset addresses.",
        "Claru's egocentric activity dataset also provides a cross-cultural pretraining resource. While the dataset captures diverse human activities, targeted collection in Chinese environments extends coverage to the visual distributions that Tsinghua's foundation models must handle.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        {
          id: "liu-ario-2024",
          title: "ARIO: Benchmarking Robot Manipulation with Real-World Environments",
          authors: "Liu et al.",
          venue: "arXiv 2410.13369",
          year: 2024,
          url: "https://arxiv.org/abs/2410.13369",
        },
        {
          id: "li-foundation-manip-2025",
          title: "What Foundation Models Can Bring for Robot Learning in Manipulation: A Survey",
          authors: "Li et al.",
          venue: "IJRR 2025",
          year: 2025,
          url: "https://journals.sagepub.com/doi/10.1177/02783649251390579",
        },
        {
          id: "shang-embodied-world-2025",
          title: "A Survey of Embodied World Models",
          authors: "Shang et al.",
          venue: "Tsinghua EE",
          year: 2025,
          url: "https://fi.ee.tsinghua.edu.cn/public/publications/0940dda4-af15-11f0-9d60-0242ac120002.pdf",
        },
      ],
    },
  ],
  faqs: [
    {
      question:
        "Why do Western robotics datasets fail in Chinese environments?",
      answer:
        "Western datasets reflect North American and European environments — specific furniture styles, kitchen layouts, household objects, and spatial patterns. Chinese homes differ significantly with floor heating, compact kitchens, floor-level dining, and culturally specific objects like rice cookers, woks, and chopstick sets. Models trained exclusively on Western data face a distribution mismatch that degrades performance in Chinese settings.",
    },
    {
      question: "What is a Chinese-language VLA model?",
      answer:
        "A vision-language-action model that understands Mandarin task descriptions and maps them to robot actions. Current VLA models are primarily trained on English data. Building Chinese counterparts requires manipulation demonstrations paired with Mandarin narration — a data type that barely exists at scale and must be purpose-collected.",
    },
    {
      question:
        "How does Tsinghua connect to China's humanoid industry?",
      answer:
        "Tsinghua serves as the primary academic partner for Chinese humanoid companies (Unitree, UBTech, Fourier, Galbot), similar to how Stanford and CMU work with US robotics companies. The 2025 establishment of the Institute for Embodied Intelligence and Robotics formalizes this role. Research at Tsinghua directly shapes the AI capabilities of Chinese humanoid platforms.",
    },
    {
      question:
        "What is the Institute for Embodied Intelligence and Robotics?",
      answer:
        "Established in 2025 and headed by Professor Zhang Tao, this new Tsinghua institute integrates resources from automation, mechanical engineering, electronic engineering, and computer science into a cross-disciplinary center for humanoid robot and embodied AI research. It represents Tsinghua's institutional commitment to leading China's robotics research agenda.",
    },
    {
      question:
        "What are embodied world models and why do they need Chinese data?",
      answer:
        "Embodied world models learn to predict how physical scenes evolve over time, enabling robots to plan by imagining consequences before acting. Tsinghua's 2025 survey paper reviews the field. Training these models requires diverse video of physical interactions — and because existing datasets are Western-biased, world models develop impoverished representations of Chinese environments without Chinese training data.",
    },
  ],
  ctaHeading: "Data for the Chinese Robotics Ecosystem",
  ctaDescription:
    "Discuss regionally authentic training data for Tsinghua's robotics research and Chinese humanoid industry partners.",
  relatedGlossaryTerms: [
    "foundation-model-robotics",
    "vla",
    "cross-embodiment-data",
    "humanoid-robot",
  ],
  relatedGuidePages: [
    "how-to-build-a-cross-embodiment-dataset",
    "how-to-create-action-labels-for-vla",
  ],
  relatedSolutionSlugs: [],
};

export default page;
