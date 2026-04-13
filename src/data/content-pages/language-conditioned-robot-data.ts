import type { ContentPageData } from "./types";

const languageConditionedRobotData: ContentPageData = {
  // -- Identity & SEO --
  slug: "language-conditioned-robot-data",
  title: "Language-Conditioned Robot Data: Paired Demonstrations with Natural Language Instructions",
  metaTitle: "Language-Conditioned Robot Training Data | Claru",
  metaDescription:
    "Robot demonstration datasets paired with natural language instructions. Purpose-built for VLAs, language-conditioned policies, and instruction-following robots.",
  primaryKeyword: "language-conditioned robot data",
  secondaryKeywords: [
    "language-conditioned manipulation data",
    "robot instruction following dataset",
    "language-paired robot demonstrations",
    "natural language robot training",
    "instruction-conditioned policy data",
    "VLA language data",
  ],
  breadcrumbLabel: "Language-Conditioned Robot Data",
  ogCategory: "solution",

  // -- Hero --
  heroSubtitle:
    "Language-conditioned robot policies promise natural human-robot interaction: tell a robot what to do in plain language and it executes. But training these models requires paired data — demonstrations annotated with the natural language instructions they execute — at a diversity and scale that current datasets cannot provide. The language grounding gap is the bottleneck.",

  // -- Problem Section --
  problem: {
    heading: "Why Is Language-Paired Robot Data So Hard to Collect?",
    sections: [
      {
        heading: "Why Is Language-Paired Robot Data So Hard to Collect?",
        content:
          "Language-conditioned robot learning requires demonstrations that are paired with natural language instructions describing the task being performed. This pairing is expensive because it requires either annotating existing demonstrations with language after the fact, or collecting demonstrations in response to specific language commands. RT-2 demonstrated that vision-language-action models can transfer web-scale language understanding to robotic control, improving generalization by 3x, but this transfer depends on fine-tuning data where language instructions are precisely aligned with observed robot behaviors. OpenVLA showed that a 7B parameter model outperformed the 55B RT-2-X by 16.5% when trained on high-quality language-paired demonstrations, proving that instruction quality matters more than scale. The challenge is that collecting high-quality language-paired data requires coordinating human annotators who can write diverse, accurate, and unambiguous natural language descriptions for each demonstration.",
        citationIds: ["rt2-2023", "openvla-2024"],
      },
      {
        heading: "What Are the Quality Problems in Current Language-Robot Datasets?",
        content:
          "Language annotations in existing datasets suffer from three systematic quality issues. First, vocabulary poverty: annotations use a narrow set of template-like phrases ('pick up the red block', 'put the cup on the plate') that do not reflect how humans naturally give instructions. CALVIN provides language-conditioned manipulation benchmarks but with templated language that lacks the variety of real human speech. Second, ambiguity tolerance: annotations do not account for the ambiguity inherent in natural language ('grab that thing over there'), which robots must resolve through visual grounding. Third, granularity mismatch: some annotations describe goals ('make a sandwich') while others describe atomic actions ('move the knife 3cm to the right'), and the mixed granularity confuses policy learning. SayCan showed that grounding language in affordance functions requires diverse language paired with demonstrations that cover both successful and failed attempts at instruction following.",
        citationIds: ["saycan-2022", "calvin-2022"],
      },
      {
        heading: "How Does Language Diversity Affect Policy Generalization?",
        content:
          "A language-conditioned policy must understand that 'grab the mug', 'pick up the cup', 'get me that coffee thing', and 'take the ceramic vessel' can all refer to the same action. This requires training data with diverse paraphrases of the same instruction across different demonstrations. Octo was trained on 800,000 trajectories from 25 datasets but many lacked language annotations entirely, limiting the model's language-conditioning capability. Open X-Embodiment includes language annotations for a subset of its trajectories, but the annotations were added by different teams with inconsistent conventions, producing vocabulary and granularity mismatches that degrade cross-dataset training. For production deployment where users give natural, unscripted instructions, language diversity in training data directly determines the range of commands a robot can understand.",
        citationIds: ["octo-2024", "open-x-embodiment-2024"],
      },
    ],
  },

  // -- Landscape / Comparison --
  landscape: {
    heading: "How Do Open Datasets Compare for Language-Conditioned Robot Training?",
    description:
      "The table below compares datasets with language annotations relevant to robot policy training against Claru custom collection. The critical differentiators are language diversity, annotation quality, and pairing precision.",
    datasets: [
      {
        name: "CALVIN",
        scale: "24 hours of play data, 400+ tasks",
        tasks: "Language-conditioned tabletop manipulation with 34 unique tasks",
        environments: "Single simulated tabletop environment",
        limitations:
          "Templated language only; single environment; simulation; narrow vocabulary that does not reflect natural speech",
        isClaru: false,
      },
      {
        name: "Open X-Embodiment (language subset)",
        scale: "Partial language annotations across 1M+ trajectories",
        tasks: "Mixed manipulation tasks with inconsistent language annotations",
        environments: "Research labs across 22 robot platforms",
        limitations:
          "Inconsistent annotation conventions across contributing teams; many trajectories lack language; vocabulary and granularity mismatches",
        isClaru: false,
      },
      {
        name: "BridgeData V2",
        scale: "60K+ trajectories with language labels",
        tasks: "Tabletop manipulation with natural language task descriptions",
        environments: "24 environments in a single lab",
        limitations:
          "Single lab setup; post-hoc language annotations; limited environment diversity",
        isClaru: false,
      },
      {
        name: "DROID",
        scale: "76K trajectories with language annotations",
        tasks: "Table-top manipulation with crowd-sourced language labels",
        environments: "13 institutions; lab environments",
        limitations:
          "Crowd-sourced annotations have variable quality; limited to lab manipulation; fixed robot morphology",
        isClaru: false,
      },
      {
        name: "Claru Custom",
        scale: "386K+ video clips, ~500 contributors, configurable language annotation depth",
        tasks: "Configurable: multi-granularity language pairing from goal-level to step-level instructions across any manipulation domain",
        environments: "Global real-world coverage; homes, workplaces, outdoor; 10+ categories across multiple countries",
        limitations:
          "Requires engagement lead time (days to launch, 1-2 week calibration); not a public benchmark",
        isClaru: true,
      },
    ],
  },

  // -- Solution Section --
  solution: {
    heading: "How Does Claru Build Language-Conditioned Robot Training Data?",
    sections: [
      {
        heading: "How Does Claru Generate Diverse, Natural Language Annotations?",
        content:
          "RT-2 showed that web-scale language understanding transfers to robot control, but only when fine-tuning data contains natural, diverse language rather than templates. Claru's annotation pipeline produces language instructions with the diversity that policy training requires. Rather than templated post-hoc labeling, Claru's structured activity taxonomy defines tasks at multiple granularity levels — goal-level ('prepare a cup of coffee'), plan-level ('grind beans, heat water, assemble filter, pour'), and step-level ('move the grinder lid to the left') — with each level written by contributors who naturally paraphrase tasks in their own words. The annotation interface enforces consistency at the structural level (correct task boundaries, complete step coverage) while allowing vocabulary diversity within each annotation. This approach was demonstrated across 10 workplace categories where contributors described the same types of tasks in naturally varied language.",
        citationIds: ["rt2-2023"],
      },
      {
        heading: "How Does Multi-Granularity Annotation Improve Language Grounding?",
        content:
          "SayCan demonstrated that grounding language in robot affordances requires mapping high-level goals to executable low-level actions through an intermediate planning layer. Claru's multi-granularity annotation structure provides training signal at each level of this hierarchy. Goal annotations ('clean the kitchen counter') train the high-level language understanding; plan annotations ('clear objects, apply cleaner, wipe surface, dry') train the decomposition layer; and step annotations ('pick up the sponge with your right hand') train the motor primitive grounding. Each granularity level is independently annotated and verified through the QA pipeline, which includes same-day human review of every submitted annotation. This hierarchical language structure maps directly to the planning architectures that language-conditioned policies like SayCan, Code as Policies, and Inner Monologue use.",
        citationIds: ["saycan-2022"],
      },
      {
        heading: "How Does Real-World Language Pairing Reduce the Sim-to-Real Gap?",
        content:
          "CALVIN provides language-conditioned manipulation benchmarks in simulation with templated language, producing policies that struggle when deployed with real users who speak naturally. OpenVLA showed that data quality and diversity outweigh model scale, with the 7B model outperforming 55B when trained on better-paired demonstrations. Claru addresses the language diversity gap by capturing demonstrations in real environments with instructions written by the same contributors who perform the tasks. This produces language that reflects how people actually describe physical actions, including colloquialisms, spatial references relative to the speaker ('the thing on your left'), and implicit context ('the usual way'). The global contributor network spanning multiple countries adds natural language variety across dialects and communication styles, producing training data that prepares language-conditioned policies for the full range of natural instructions they will encounter in deployment.",
        citationIds: ["openvla-2024", "calvin-2022"],
      },
    ],
  },

  // -- Case Studies --
  caseStudySlugs: [],

  // -- Dataset Showcase --
  datasetIds: [],

  // -- FAQ --
  faqs: [
    {
      question: "What is language-conditioned robot training data?",
      answer:
        "Language-conditioned robot training data consists of robot demonstrations (video, action trajectories, or both) paired with natural language instructions describing the task being performed. This data trains policies that accept language commands as input and generate robot actions as output, enabling natural human-robot interaction where users tell robots what to do in plain language.",
    },
    {
      question: "How does Claru ensure language annotation quality and diversity?",
      answer:
        "Claru uses a multi-granularity annotation framework where tasks are described at goal, plan, and step levels by the contributors who perform the demonstrations. The annotation interface enforces structural consistency while allowing natural vocabulary diversity. Every annotation passes same-day human QA review. The global contributor network spanning multiple countries ensures cross-dialectal language variety.",
    },
    {
      question: "Can Claru provide language annotations at different granularity levels?",
      answer:
        "Yes. Claru's structured activity taxonomy supports three annotation levels: goal-level (what to achieve), plan-level (sequence of sub-tasks), and step-level (individual motor actions). Each level is independently annotated and verified. This hierarchical structure maps directly to planning architectures used by language-conditioned policies like SayCan and Code as Policies.",
    },
    {
      question: "How does language-conditioned data differ from standard VLA training data?",
      answer:
        "Standard VLA training data pairs visual observations with action labels, enabling a model to imitate demonstrated behaviors. Language-conditioned data adds a third modality: natural language instructions that specify which behavior to execute. This enables task-conditioned policies where a single model can perform different tasks based on language input, rather than requiring separate policies for each task.",
    },
  ],

  // -- Research Citations --
  citations: [
    {
      id: "rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
      keyClaim:
        "Web-scale vision-language pre-training improved robot policy generalization by 3x when fine-tuned on language-paired robot demonstrations.",
    },
    {
      id: "openvla-2024",
      title:
        "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
      keyClaim:
        "7B parameter VLA outperformed RT-2-X (55B) by 16.5% on manipulation benchmarks through higher-quality language-paired demonstrations.",
    },
    {
      id: "saycan-2022",
      title:
        "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances",
      authors: "Ahn et al.",
      venue: "arXiv 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2204.01691",
      keyClaim:
        "Demonstrated that grounding language instructions in robot affordances requires diverse language paired with demonstrations covering both successful and failed instruction-following attempts.",
    },
    {
      id: "calvin-2022",
      title:
        "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation",
      authors: "Mees et al.",
      venue: "IEEE RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227",
      keyClaim:
        "Established a language-conditioned manipulation benchmark revealing that templated language annotations limit policy generalization to novel instructions.",
    },
    {
      id: "octo-2024",
      title:
        "Octo: An Open-Source Generalist Robot Policy",
      authors: "Ghosh et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
      keyClaim:
        "Trained on 800,000 trajectories from 25 datasets; noted that missing language annotations in many datasets limited language-conditioning capability.",
    },
    {
      id: "open-x-embodiment-2024",
      title:
        "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "O'Brien et al.",
      venue: "arXiv 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
      keyClaim:
        "Includes partial language annotations across 1M+ trajectories but with inconsistent conventions across contributing teams.",
    },
  ],

  // -- Internal Linking --
  pillarLinks: [
    "/training-data/robotics",
    "/models/vla",
  ],

  // -- Related Content Pages --
  relatedSlugs: [
    "vla-training-data",
    "manipulation-trajectory-data",
    "humanoid-robot-training-data",
  ],
};

export default languageConditionedRobotData;
