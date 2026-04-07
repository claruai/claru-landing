import type { BenchmarkPageData } from "./types";
const page: BenchmarkPageData = {
  "slug": "vlabench",
  "benchmarkName": "VLABench",
  "benchmarkDescription": "VLABench evaluates vision-language-action models on their ability to ground natural language instructions in physical manipulation. It tests VLA models on compositional language understanding — can the model correctly interpret 'put the red block to the left of the blue cylinder' when objects and spatial relations vary?",
  "taskSet": "100+ language-conditioned manipulation tasks testing spatial reasoning (left/right/on top/inside), color and shape grounding, comparative relations (bigger, closer), and multi-step instruction following with compositional language.",
  "observationSpace": "RGB images from static and wrist cameras, depth maps, proprioceptive state, and natural language instructions with varying complexity.",
  "actionSpace": "End-effector delta poses with binary gripper control.",
  "evaluationProtocol": "Language-grounded manipulation success rate across held-out language templates, novel object combinations, and unseen spatial configurations. Tests compositional generalization to instructions not seen during training.",
  "simToRealGap": "VLABench evaluates language understanding in simulation where object identification is clean and unambiguous. Real-world language grounding must handle visual ambiguity, partial occlusion, distractors, and objects that do not exactly match language descriptions. The simulation visual style lacks photorealistic clutter.",
  "realWorldDataNeeds": "Language-paired manipulation data in real environments where objects are visually ambiguous, partially occluded, or described imprecisely. Compositional instruction data where spatial relations reference real-world landmarks. Diverse object-language grounding data across many environments and language styles.",
  "complementaryDatasets": [
    {
      "name": "Custom Language-Paired Collection",
      "rationale": "Purpose-collected manipulation demonstrations with concurrent compositional language descriptions provide the real-world language-action grounding VLABench evaluates."
    },
    {
      "name": "Egocentric Activity Dataset",
      "rationale": "Real-world activity video provides visual pretraining data with authentic object appearances and environmental context for language grounding."
    },
    {
      "name": "Manipulation Trajectory Dataset",
      "rationale": "Diverse manipulation recordings provide the visual foundation for training robust object and spatial relation recognition."
    }
  ],
  "keyPapers": [
    {
      "id": "zheng-vlabench-2024",
      "title": "VLABench: A Large-Scale Benchmark for Language-Conditioned Robotics Manipulation with Long-Horizon Reasoning",
      "authors": "Zheng et al.",
      "venue": "arXiv 2412.18194",
      "year": 2024,
      "url": "https://arxiv.org/abs/2412.18194"
    },
    {
      "id": "brohan-rt2-2023",
      "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      "authors": "Brohan et al.",
      "venue": "CoRL 2023",
      "year": 2023,
      "url": "https://arxiv.org/abs/2307.15818"
    },
    {
      "id": "shridhar-cliport-2022",
      "title": "CLIPort: What and Where Pathways for Robotic Manipulation",
      "authors": "Shridhar et al.",
      "venue": "CoRL 2022",
      "year": 2022,
      "url": "https://arxiv.org/abs/2109.12098"
    }
  ],
  "technicalAnalysis": `VLABench addresses a critical gap in VLA model evaluation: compositional language understanding. Most VLA benchmarks use simple instructions like 'pick up the red block.' VLABench tests whether models understand compositional spatial relations, comparative adjectives, and multi-step instructions.

The compositional generalization test is particularly revealing. A model that learns 'put X left of Y' and 'put X on top of Z' should be able to execute 'put X left of Y and on top of Z' without explicit training on that combination. Real-world instructions are naturally compositional, making this evaluation critical for deployed robots.

However, VLABench's simulation provides clean visual scenes where objects are unambiguously identifiable. Real-world language grounding is harder because objects may be partially occluded, visually similar to distractors, or described imprecisely ('the thing next to the cup'). Real-world language-paired data must capture this ambiguity.

Claru can collect manipulation demonstrations with concurrent compositional language narration in real environments, producing data where language descriptions must be grounded in visually complex scenes with authentic ambiguity.`,
  "metaTitle": "Real-World Data for VLABench Language-Conditioned Benchmark | Claru",
  "metaDescription": "Language-paired manipulation, compositional instruction, and visual grounding data for VLABench's vision-language-action model evaluation.",
  "primaryKeyword": "VLABench real-world data",
  "secondaryKeywords": [
    "VLA benchmark data",
    "language-conditioned manipulation data",
    "compositional language robot data",
    "VLABench sim-to-real"
  ],
  "canonicalPath": "/benchmarks/vlabench",
  "h1": "Real-World Data for VLABench",
  "heroSubtitle": "VLABench tests compositional language understanding for robot manipulation. Real-world data adds the visual ambiguity that simulation lacks.",
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
      "label": "VLABench",
      "href": "/benchmarks/vlabench"
    }
  ],
  "sections": [
    {
      "type": "stats",
      "heading": "VLABench at a Glance",
      "stats": [
        { "value": "100+", "label": "Tasks" },
        { "value": "Compositional", "label": "Language Type" },
        { "value": "VLA", "label": "Model Target" },
        { "value": "Long-Horizon", "label": "Reasoning" },
        { "value": "2024", "label": "Released" }
      ]
    },
    {
      "type": "prose",
      "heading": "What Is VLABench?",
      "paragraphs": [
        "VLABench is a benchmark for evaluating vision-language-action models on compositional language grounding in manipulation tasks. Created by Zheng et al. and published in 2024, it goes beyond simple pick-and-place instructions to test whether VLA models can interpret complex spatial relations, comparative adjectives, and multi-step compositional instructions.",
        "The benchmark provides 100+ language-conditioned manipulation tasks that systematically test language understanding. Instead of simple instructions like 'pick up the red block,' VLABench tests 'put the red block to the left of the blue cylinder and behind the green cube' — requiring the model to ground multiple spatial relations simultaneously.",
        "VLABench targets the compositional generalization gap in current VLA models: can a model that learns 'left of' and 'on top of' independently combine them to execute 'left of X and on top of Y' without explicit training on that composition? This compositional generalization is essential for robots that must follow natural human instructions."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "Language Understanding Axes",
      "description": "VLABench systematically tests different dimensions of language understanding for manipulation.",
      "columns": ["Language Dimension", "Example Instruction", "What It Tests"],
      "rows": [
        { "Language Dimension": "Spatial Relations", "Example Instruction": "Put the block to the left of the cup", "What It Tests": "Spatial reasoning relative to reference objects" },
        { "Language Dimension": "Color/Shape Grounding", "Example Instruction": "Pick up the red cylinder", "What It Tests": "Visual attribute binding to language descriptions" },
        { "Language Dimension": "Comparative Relations", "Example Instruction": "Move the bigger block closer to you", "What It Tests": "Relative attribute comparison and spatial reference" },
        { "Language Dimension": "Compositional Instructions", "Example Instruction": "Put the red block left of the blue one and on top of the green one", "What It Tests": "Combining multiple relations in a single instruction" },
        { "Language Dimension": "Long-Horizon Reasoning", "Example Instruction": "First clear the table, then arrange the blocks by size", "What It Tests": "Multi-step planning from language specification" }
      ]
    },
    {
      "type": "prose",
      "heading": "Evaluation Protocol",
      "paragraphs": [
        "VLABench evaluates language-grounded manipulation success across held-out language templates, novel object combinations, and unseen spatial configurations. The key test is compositional generalization — can the policy handle instruction compositions not seen during training?",
        "Evaluation uses systematic held-out splits: training includes individual spatial relations (left-of, on-top-of, behind), while testing includes compositions of these relations. This ensures the benchmark measures true compositional understanding rather than memorization of seen instruction-action pairs.",
        "Success is measured by whether the final object configuration matches the language instruction's specification. Partial credit is given for multi-step instructions where some sub-goals are achieved. This granular evaluation reveals whether failures are in language understanding, spatial reasoning, or motor execution."
      ]
    },
    {
      "type": "comparison-table",
      "heading": "VLABench vs. Related Language-Conditioned Benchmarks",
      "columns": ["Feature", "VLABench", "CALVIN", "Language-Table", "CLIPort"],
      "rows": [
        { "Feature": "Language complexity", "VLABench": "Compositional, multi-relation", "CALVIN": "Free-form natural language", "Language-Table": "Simple verb-noun", "CLIPort": "Template-based" },
        { "Feature": "Compositional test", "VLABench": "Systematic held-out compositions", "CALVIN": "No explicit composition test", "Language-Table": "No", "CLIPort": "No" },
        { "Feature": "Spatial reasoning", "VLABench": "Primary focus", "CALVIN": "Implicit in tasks", "Language-Table": "Minimal", "CLIPort": "Position specification" },
        { "Feature": "Long-horizon", "VLABench": "Multi-step instructions", "CALVIN": "5-step chains", "Language-Table": "Single step", "CLIPort": "Single step" }
      ]
    },
    {
      "type": "prose",
      "heading": "Bridging Simulated Language Grounding to Real Environments",
      "paragraphs": [
        "VLABench's simulation provides clean visual scenes where objects are unambiguously identifiable by color, shape, and position. Real-world language grounding is fundamentally harder because objects may be partially occluded, visually similar to distractors, or described imprecisely ('the thing next to the cup').",
        "The compositional generalization gap is likely larger in the real world because visual ambiguity compounds language ambiguity. In simulation, 'the red block' uniquely identifies one object. In a real kitchen, 'the red thing' might match a tomato, a mug, or a pot handle — and the instruction's intent depends on task context that the visual scene must disambiguate.",
        "Real-world language-paired manipulation data captures this ambiguity authentically. When a human narrates manipulation in a real environment, their language naturally references visual context, uses imprecise descriptions, and assumes shared understanding of spatial layout. This data trains VLA models to handle the language grounding that deployment requires.",
        "Claru can collect manipulation demonstrations with concurrent compositional language narration in real environments, producing language-action pairs where grounding must handle authentic visual complexity, object ambiguity, and spatial reference — the real-world version of what VLABench evaluates in simulation."
      ]
    },
    {
      "type": "prose",
      "heading": "How Claru Supports VLABench Users",
      "paragraphs": [
        "Claru provides the real-world language-paired manipulation data that extends VLABench's compositional evaluation to authentic environments. Our custom collection protocol pairs manipulation demonstrations with concurrent natural language narration, capturing the language-action grounding that VLA models need for deployment.",
        "For teams targeting VLABench's specific language dimensions, Claru coordinates collection with explicit compositional instructions — narrators describe spatial relations, comparative attributes, and multi-step plans while demonstrating in real environments. This produces training data with the compositional structure VLABench evaluates.",
        "Our egocentric activity dataset provides large-scale visual pretraining data where objects appear in natural contexts with authentic visual complexity — the visual foundation that language grounding models need to resolve the ambiguity absent from VLABench's clean simulation scenes."
      ]
    },
    {
      "type": "citation-list",
      "heading": "Key References",
      "citations": [
        { "id": "zheng-vlabench-2024", "title": "VLABench: A Large-Scale Benchmark for Language-Conditioned Robotics Manipulation with Long-Horizon Reasoning", "authors": "Zheng et al.", "venue": "arXiv 2412.18194", "year": 2024, "url": "https://arxiv.org/abs/2412.18194" },
        { "id": "brohan-rt2-2023", "title": "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", "authors": "Brohan et al.", "venue": "CoRL 2023", "year": 2023, "url": "https://arxiv.org/abs/2307.15818" },
        { "id": "shridhar-cliport-2022", "title": "CLIPort: What and Where Pathways for Robotic Manipulation", "authors": "Shridhar et al.", "venue": "CoRL 2022", "year": 2022, "url": "https://arxiv.org/abs/2109.12098" }
      ]
    }
  ],
  "faqs": [
    {
      "question": "What is compositional language understanding for robots?",
      "answer": "Compositional language means combining known concepts into new instructions. If a robot knows 'left of' and 'on top of,' it should understand 'left of X and on top of Y' without explicit training. VLABench tests this compositional generalization systematically."
    },
    {
      "question": "Why is real-world language grounding harder than simulation?",
      "answer": "Simulation provides clean scenes where objects are unambiguously identifiable by color and shape. Real-world language grounding must handle partial occlusion, visual similarity between objects, imprecise language ('the thing by the cup'), and environmental distractors that simulation scenes lack."
    },
    {
      "question": "How does Claru's data support language-conditioned manipulation?",
      "answer": "Claru can collect manipulation demonstrations with concurrent natural language narration in diverse real environments. This produces language-action pairs where grounding must handle authentic visual complexity — exactly what VLABench evaluates but in real-world conditions."
    },
    {
      "question": "What is compositional generalization and why does it matter?",
      "answer": "Compositional generalization means combining known concepts into novel combinations. If a robot learns 'left of' and 'behind' separately, it should handle 'left of X and behind Y' without explicit training. Real human instructions are naturally compositional, so this capability is essential for robots that must follow verbal commands in deployment."
    },
    {
      "question": "How does visual ambiguity affect language grounding?",
      "answer": "In simulation, objects have distinct colors and shapes that unambiguously match language descriptions. Real environments contain visually similar objects, partial occlusions, and lighting-dependent appearances. The instruction 'pick up the red thing' might match multiple objects, requiring context-dependent disambiguation that simulation does not test."
    }
  ],
  "ctaHeading": "Get Language-Paired Manipulation Data",
  "ctaDescription": "Discuss compositional language-action data for VLA model training and evaluation.",
  "relatedGlossaryTerms": [
    "vla",
    "language-conditioned-policy",
    "scene-understanding"
  ],
  "relatedGuidePages": [
    "how-to-build-a-language-conditioned-dataset",
    "how-to-create-action-labels-for-vla"
  ],
  "relatedSolutionSlugs": []
};
export default page;
