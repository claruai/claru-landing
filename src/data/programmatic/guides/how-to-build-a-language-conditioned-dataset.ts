import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-build-a-language-conditioned-dataset",
  metaTitle: "How to Build a Language-Conditioned Robot Dataset (2026 Guide) | Claru",
  metaDescription: "Step-by-step guide to build a language-conditioned robot dataset for robot learning and physical AI applications. Covers tools, best practices, and common pitfalls.",
  primaryKeyword: "how to build a language-conditioned robot dataset",
  secondaryKeywords: ["language-conditioned robot dataset guide", "language-conditioned manipulation data", "language grounding robot learning", "natural language robot instructions dataset"],
  canonicalPath: "/guides/how-to-build-a-language-conditioned-dataset",
  h1: "How to Build a Language-Conditioned Robot Dataset",
  heroSubtitle: "Step-by-step guide to building datasets that pair natural language instructions with robot demonstrations, enabling vision-language-action models to follow free-form human commands.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Build a Language-Conditioned Robot Dataset", href: "/guides/how-to-build-a-language-conditioned-dataset" },
  ],
  sections: [
    {
      type: "prose",
      heading: "The Language-Action Alignment Problem",
      paragraphs: [
        "The central challenge in language-conditioned datasets is ensuring that language instructions accurately describe and temporally align with the demonstrated robot behavior. Misalignment takes two forms. Semantic misalignment occurs when the instruction describes a different action than what was demonstrated \u2014 saying 'pick up the blue mug' when the robot actually picked up a red mug. This creates contradictory training signal that teaches the VLA model to ignore language cues entirely. Temporal misalignment occurs when the instruction is correct but timestamped to the wrong segment of the trajectory \u2014 labeling the transport phase as 'reaching for the object.' This teaches the model to associate the wrong visual observations with each instruction.",
        "Both forms of misalignment are more damaging than missing data. A dataset of 5,000 episodes with 95% alignment trains a better VLA than 10,000 episodes with 80% alignment, because the misaligned 20% actively interferes with learning. The CALVIN benchmark found that language-action alignment accuracy below 85% caused a sharp performance cliff in multi-step instruction following. This is why validation of language-action alignment (Step 5 of this guide) is not optional \u2014 it is the single highest-ROI quality check for language-conditioned datasets.",
      ],
    },
    {
      type: "prose",
      heading: "Template-Based vs. Model-Based Language Augmentation",
      paragraphs: [
        "Language diversity in the dataset directly impacts the VLA model's ability to follow novel instructions at inference time. Two augmentation strategies complement raw human annotations. Template-based augmentation uses a controlled vocabulary of synonyms and syntactic variations to expand each instruction: 'pick up the red mug' becomes 'grab the crimson cup', 'take the red mug', 'lift the scarlet cup from the table'. This is deterministic, fast, and preserves semantic accuracy, but produces limited lexical variation since it only substitutes pre-defined synonyms.",
        "Model-based augmentation uses a language model (Llama 3 or GPT-4) to generate naturalistic paraphrases. The key is constraining the model to preserve spatial references and object attributes while varying the phrasing. Use a prompt like: 'Rephrase this robot instruction 5 different ways. Preserve all spatial references and object descriptions exactly. Vary the sentence structure and word choice: [instruction]'. Filter generated paraphrases using CLIP text-embedding cosine similarity (keep only paraphrases with similarity > 0.85 to the original) and reject any paraphrase that introduces entities not in the original. A human verification pass on 10% of generated paraphrases should find a hallucination rate below 5%. Combining both strategies \u2014 template-based for guaranteed accuracy, model-based for naturalistic diversity \u2014 produces the best downstream VLA performance.",
      ],
    },
  ],
  faqs: [
    {
      question: "What granularity of language instructions works best for language-conditioned datasets?",
      answer: "The optimal granularity depends on the target model architecture and desired generalization. Research from RT-2 and SayCan demonstrates that a mixture of abstraction levels produces the most capable policies. Include high-level goal descriptions ('put the red block in the bowl'), mid-level step descriptions ('reach for the red block on the left side of the table'), and low-level motion narrations ('move the gripper 10 cm to the left'). The Open X-Embodiment project found that datasets with at least three granularity levels per episode achieved 15-25% better cross-task generalization than single-level annotations. Avoid overly terse labels like 'pick' or 'place' since models cannot learn spatial reasoning from single-word commands. Aim for 6-15 word instructions at the goal level and collect at least five paraphrases per unique task to build language diversity."
    },
    {
      question: "How do you handle language ambiguity when multiple valid interpretations exist?",
      answer: "Language ambiguity is one of the core challenges in language-conditioned datasets. The best practice is to adopt a disambiguation protocol inspired by the CALVIN benchmark: when an instruction like 'move the cup' is ambiguous because multiple cups are present, annotators must append a referring expression that uniquely identifies the target object ('move the blue cup near the toaster'). Record both the original ambiguous instruction and the disambiguated version as separate annotation fields. During training, you can teach the model to request clarification by including failure episodes where the robot executes the wrong interpretation. Maintaining a controlled vocabulary ontology using tools like Label Studio's taxonomy feature helps annotators stay consistent. Measure inter-annotator agreement using Krippendorff's alpha, targeting a score above 0.8 for instruction-to-action alignment across at least three independent annotators."
    },
    {
      question: "Should language annotations be collected during teleoperation or added post-hoc?",
      answer: "Both approaches have trade-offs. Concurrent annotation, where the operator or a co-located observer narrates during teleoperation, produces more naturalistic and temporally grounded language but can distract the operator and slow collection throughput by 20-30%. Post-hoc annotation from video replay enables batch processing and higher annotator throughput but introduces temporal misalignment since annotators tend to describe outcomes rather than in-progress actions. The approach used by the BridgeData V2 team is a hybrid: collect a sparse set of concurrent narrations during a pilot phase to establish language norms, then scale with post-hoc annotation where annotators watch episodes at 0.5x speed and timestamp each instruction to the corresponding trajectory segment. Post-hoc annotation at scale typically costs 2-4 minutes per episode minute using CVAT or Label Studio, making it roughly three times more cost-effective than concurrent narration for large datasets."
    },
    {
      question: "What is the minimum vocabulary size and instruction diversity needed?",
      answer: "There is no strict minimum, but empirical results from language-conditioned policy research suggest clear thresholds. RT-1 used approximately 700 unique instructions across 130,000 episodes and achieved strong generalization to novel instruction phrasings. For a new domain, aim for at least 200 unique instruction templates covering your full task space, with 3-5 paraphrases per template yielding 600-1,000 unique strings. The vocabulary should include spatial prepositions (on, in, next to, behind), color and size adjectives, action verbs beyond pick and place (slide, rotate, flip, stack, pour), and relative references (the one closer to you, the taller bottle). Use an instruction generation script with templates and synonym lists to bootstrap diversity, then have human annotators verify and add naturalistic variation. Track vocabulary coverage with a simple frequency histogram and flag any task variant that has fewer than three unique instruction phrasings."
    },
    {
      question: "How do you evaluate the quality of a language-conditioned dataset before training?",
      answer: "Run four validation checks before any training run. First, compute language-action alignment by having held-out annotators watch a random 5% sample of episodes and rate whether the language instruction accurately describes the demonstrated behavior on a 1-5 Likert scale, targeting a mean above 4.2. Second, measure instruction diversity using the type-token ratio (unique instructions divided by total instructions), aiming for a ratio above 0.15 for datasets over 10,000 episodes. Third, verify temporal grounding by checking that instruction timestamps align with the corresponding action segments within a tolerance of plus or minus 0.5 seconds. Fourth, test for annotator bias by computing per-annotator vocabulary distributions and flagging any annotator whose vocabulary entropy deviates more than two standard deviations from the group mean. Tools like pandas and scikit-learn's metrics module can automate these checks. A dataset that passes all four checks typically achieves 80-90% of its theoretical performance ceiling on first training run."
    },
    {
      question: "How many unique language instructions do I need per task variant?",
      answer: "Empirical evidence from RT-1 and the Open X-Embodiment project suggests that 3-5 unique paraphrases per task variant provide sufficient language diversity for generalization. For a dataset with 50 task variants, that means 150-250 unique instruction templates. Augment each template with 3-5 synonym substitutions (pick up to grab, take, lift; red mug to crimson cup, scarlet mug) to reach 600-1,000 total unique instruction strings. Track the type-token ratio (unique instructions divided by total instructions): aim for above 0.15 for datasets over 10,000 episodes. If the ratio drops below 0.10, the instructions are too repetitive and the model may overfit to specific phrasings rather than learning generalizable language grounding.",
    },
  ],
  ctaHeading: "Need Help With This?",
  ctaDescription: "Talk to a Claru data collection specialist about your specific language-conditioned dataset requirements.",
  relatedGlossaryTerms: ["language-conditioned-policy", "vla", "behavioral-cloning"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["vla-training-data"],
  difficulty: "advanced",
  estimatedTime: "3-6 weeks",
  prerequisites: ["Python 3.9+ with HuggingFace Transformers installed", "Access to a robot platform or existing demonstration data", "Annotation tool (Label Studio or CVAT) deployed and accessible", "Understanding of target VLA architecture input requirements"],
  tools: ["Python", "Label Studio", "CLIP", "SentenceTransformers", "ROS2", "HDF5 / RLDS", "PyTorch"],
  steps: [
    {
      stepNumber: 1,
      title: "Define Your Language Ontology and Task Space",
      description: "Before collecting a single demonstration, formalize the relationship between language and robot behavior in your domain. Create a task taxonomy that maps every target behavior to a canonical instruction template, then expand each template with paraphrases. For example, the canonical template 'pick up {object} from {location}' might have paraphrases like 'grab the {object} off the {location}', 'take the {object} sitting on the {location}', and 'get the {object} from the {location}'. Store this ontology in a structured YAML or JSON file that becomes the ground truth for annotator training.\n\nDefine the language specification across three levels of granularity. Goal-level instructions describe the desired end state ('put all fruits in the bowl'). Step-level instructions describe individual manipulation primitives ('reach for the apple on the left'). Motion-level narrations describe continuous trajectories ('move the arm slowly to the right'). Specify which levels your target model requires. RT-2-style VLAs typically need goal-level only, while hierarchical planners like SayCan require all three levels. Document the expected vocabulary size (aim for 200+ unique templates), the minimum paraphrases per template (3-5), and the spatial/attribute vocabulary (colors, sizes, relative positions, container types). This specification document prevents annotation drift and ensures consistency when you scale from a pilot of 50 episodes to a production run of 10,000+."
    },
    {
      stepNumber: 2,
      title: "Set Up the Multi-Modal Recording Pipeline",
      description: "Build a recording system that captures synchronized robot observations, actions, and language in a single pipeline. The core stack should include ROS2 for sensor coordination, with a custom rosbag2 recorder that writes RGB frames (at least 640x480 at 30 Hz from both a wrist-mounted Intel RealSense D405 and an external D435), joint states at the robot's native control rate (typically 100-500 Hz for arms like Franka Emika or UR5e), and gripper state. Add a dedicated language channel: either a microphone input for real-time narration (use a lapel mic with 16 kHz sampling, saved as WAV alongside the rosbag) or a text input terminal where a co-located annotator types instructions timestamped to the robot clock.\n\nCritical pitfall: clock synchronization. Use PTP (Precision Time Protocol) or at minimum NTP to synchronize the robot controller, camera, and annotation workstation clocks to within 1 ms. Without this, language timestamps will drift relative to actions, making temporal grounding unreliable. Test synchronization by recording a calibration sequence where you trigger a visible event (a light flash) while simultaneously logging a text annotation, then verify the timestamps align within your tolerance. Store all data in HDF5 with a hierarchical layout: /episode_N/observations/rgb_wrist, /episode_N/observations/rgb_external, /episode_N/actions/joint_positions, /episode_N/language/instructions. Include metadata fields for episode ID, operator ID, task template ID, and environment configuration hash."
    },
    {
      stepNumber: 3,
      title: "Collect Demonstrations with Concurrent Language Scaffolding",
      description: "Run data collection in two phases. Phase one is a scaffolded pilot (50-100 episodes) where the teleoperator and a language annotator work side by side. The annotator speaks or types the goal instruction before the episode begins, narrates sub-steps during execution, and confirms task completion at the end. Use this pilot to calibrate the language ontology: identify instructions that are confusing, tasks that need new templates, and spatial references that are ambiguous. Refine the ontology YAML after the pilot and freeze it before scaling.\n\nPhase two is production collection. For throughput, switch to a two-pass approach: the operator performs demonstrations silently at full speed (targeting 20-40 episodes per hour depending on task complexity), and a separate team adds language post-hoc from video replay. Use Label Studio with a custom video annotation interface that lets annotators scrub through the episode, place temporal markers at sub-task boundaries, and type instructions aligned to each segment. Configure Label Studio's interface template to enforce minimum instruction length (6 words) and require selection of the matching task template from a dropdown. This catches terse or off-ontology annotations immediately. Track collection progress using a dashboard that shows episodes per task variant, language diversity metrics (unique instruction count, type-token ratio), and annotator throughput. Flag any task variant with fewer than 50 episodes or fewer than 10 unique instruction phrasings for additional collection."
    },
    {
      stepNumber: 4,
      title: "Generate Paraphrases and Augment Language Diversity",
      description: "Raw human annotations alone rarely achieve sufficient language diversity for robust generalization. Augment the dataset systematically using both template-based and model-based paraphrasing. First, apply your ontology templates: for each episode's human-written instruction, generate all applicable template variants by substituting synonyms from a controlled vocabulary (e.g., 'pick up' to 'grab', 'take', 'lift'; 'red mug' to 'crimson cup', 'red coffee mug'). Store generated paraphrases in a separate annotation field so you can distinguish human-written from synthetic instructions during analysis.\n\nSecond, use a language model to generate naturalistic paraphrases. Feed each instruction to an instruction-tuned model (Llama 3 70B or GPT-4) with a prompt like 'Rephrase this robot instruction five different ways, preserving the exact meaning and all spatial references: [instruction]'. Filter generated paraphrases using CLIP text embeddings: compute cosine similarity between the original and each paraphrase, keeping only those with similarity above 0.85, which preserves semantic content while allowing lexical variation. Discard any paraphrase that introduces spatial references not present in the original. Run a human verification pass on a 10% sample of generated paraphrases to measure hallucination rate, targeting below 5%. Finally, compute a SentenceTransformers embedding (using all-MiniLM-L6-v2) for every instruction in the dataset and visualize the embedding space with UMAP. Look for clusters that are too tight (low diversity) or isolated points (potential annotation errors)."
    },
    {
      stepNumber: 5,
      title: "Validate Language-Action Alignment",
      description: "This step ensures that language instructions actually correspond to the demonstrated robot behavior, which is the single most important quality signal in a language-conditioned dataset. Run three validation passes. First, automated alignment scoring: for each episode, extract the CLIP embedding of the goal instruction and the CLIP embedding of the final frame, then compute their cosine similarity. Episodes where the language-vision similarity falls below 0.3 are likely misaligned. Extract these for human review. Second, temporal alignment check: for datasets with sub-step annotations, verify that each instruction's timestamp falls within the corresponding action segment. Compute the mean absolute temporal error across the dataset and flag any episode where an instruction timestamp is more than 1 second outside its action segment boundaries.\n\nThird, human validation: sample 200-500 episodes stratified by task type and annotator. Show each episode's video alongside its language annotations to three independent reviewers who rate alignment on a 1-5 scale. Compute Krippendorff's alpha to measure inter-rater reliability, targeting alpha above 0.75. Any episode rated below 3 by two or more reviewers goes back for re-annotation. Aggregate the results to identify systematic issues: if a particular annotator consistently produces low-alignment annotations, retrain or remove them. If a specific task type has uniformly low alignment scores, the task definition or language template likely needs revision. This validation pass typically catches 5-15% of episodes that need correction. The cost of this step is significant (expect 2-3 hours of reviewer time per 1,000 episodes) but skipping it reliably degrades downstream policy performance by 10-20% on held-out instruction following benchmarks."
    },
    {
      stepNumber: 6,
      title: "Format for VLA Training and Generate Splits",
      description: "Convert the validated dataset into the format your target model expects. For RT-2-style models, this means RLDS (the TensorFlow Datasets format used by Open X-Embodiment) where each episode is a tf.data.Dataset with features for image observations, actions, language instructions, and metadata. Use the rlds_dataset_builder template from Google's rlds repository to scaffold your builder class. Specify features precisely: images as tf.uint8 tensors of shape (H, W, 3), actions as tf.float32 of shape (action_dim,), and language as tf.string. For Octo or OpenVLA, the same RLDS format works but ensure your action normalization matches their conventions (typically zero-mean unit-variance computed per action dimension across the training split).\n\nGenerate train/validation/test splits with care. Split by environment configuration or scene, not randomly by episode, to avoid data leakage where the model memorizes specific table layouts. Reserve at least 10% of unique task-object combinations for the test set to evaluate compositional generalization (can the model follow 'pick up the green cup' if it only saw 'pick up the blue cup' and 'pick up the green bottle' during training). Publish a dataset card following the Datasheets for Datasets template that documents: total episodes, unique instructions, vocabulary size, language diversity metrics, annotator count, collection time span, robot platform, camera specifications, known biases (e.g., right-handed operator bias), and intended use cases. Include a Python loading script that returns a PyTorch DataLoader or tf.data.Dataset pipeline, along with a visualization notebook that renders sample episodes with overlaid language annotations. This documentation is not optional: teams that receive undocumented datasets spend 1-2 weeks just understanding the data format before they can begin training."
    }
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "arXiv 2307.15818",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
    },
    {
      id: "walke-bridgedata-v2-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952"
    },
    {
      id: "mees-calvin-2022",
      title: "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
      authors: "Mees et al.",
      venue: "IEEE RA-L 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227"
    },
    {
      id: "embodiment-collaboration-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    }
  ],
  claruRelevance: "Claru specializes in building language-conditioned datasets for VLA training, handling the full pipeline from ontology design through annotator-managed collection, paraphrase generation, and RLDS formatting. Our team of 10,000+ data collectors across 100+ cities is trained on domain-specific language protocols, ensuring consistent spatial vocabulary and high inter-annotator agreement. We deliver datasets with validated language-action alignment scores, diversity metrics, and ready-to-train dataloaders.",
};

export default data;
