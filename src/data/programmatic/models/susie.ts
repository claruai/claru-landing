import type { ModelPageData } from "../types";

const data: ModelPageData = {
  slug: "susie",
  metaTitle: "Training Data for SuSIE | Data Requirements & Formats | Claru",
  metaDescription:
    "Complete guide to SuSIE training data requirements: subgoal image editing, low-level policy data, Bridge V2 formats, and how Claru delivers SuSIE-ready datasets.",
  primaryKeyword: "susie training data",
  secondaryKeywords: [
    "susie data requirements",
    "susie dataset format",
    "data for susie",
    "susie fine-tuning data",
    "subgoal synthesis training data",
    "susie robot manipulation data",
  ],
  canonicalPath: "/models/susie",
  h1: "Training Data for SuSIE",
  heroSubtitle:
    "Everything you need to know about SuSIE's data requirements -- the hierarchical subgoal synthesis model that beat RT-2-X on real-world manipulation by combining InstructPix2Pix fine-tuning with goal-conditioned policies trained on BridgeData V2 and Something-Something-v2.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Models", href: "/models" },
    { label: "SuSIE", href: "/models/susie" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is SuSIE?",
      paragraphs: [
        "SuSIE (Subgoal Synthesis via Image Editing) is a hierarchical robot manipulation framework from UC Berkeley, published by Kevin Black, Mitsuhiko Nakamoto, Pranav Atreya, Homer Walke, Chelsea Finn, Aviral Kumar, and Sergey Levine. Presented at ICLR 2024, SuSIE demonstrated that decomposing robotic manipulation into subgoal prediction and subgoal reaching -- rather than directly predicting low-level actions from language -- produces substantially more capable robots that can handle long-horizon tasks with zero-shot language conditioning.",
        "The core insight is using a pretrained image-editing diffusion model (InstructPix2Pix) as a high-level planner. Given the robot's current camera observation and a natural language command like 'put the carrot on the plate,' SuSIE's high-level model generates an edited image showing what the scene should look like after completing a meaningful intermediate step. A low-level goal-conditioned policy then drives the robot toward that visual subgoal. The system alternates between generating new subgoals and executing them, enabling multi-step reasoning without any task-specific decomposition logic.",
        "SuSIE achieved state-of-the-art results on the CALVIN benchmark (a simulated long-horizon manipulation suite) and outperformed RT-2-X -- a 55 billion parameter VLA model trained on 20 times more robot data -- on real-world WidowX manipulation tasks. This result is remarkable because SuSIE accomplishes it with a fraction of the parameters and training data by leveraging the visual reasoning capabilities already encoded in pretrained diffusion models.",
        "The paper's title, 'Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models' (arXiv 2310.10639), reflects its key contribution: the high-level subgoal model requires no robot-specific training data at all for generating plausible subgoals. It learns the concept of 'what comes next' entirely from human video data and the BridgeData V2 robot dataset, then transfers this understanding zero-shot to novel manipulation commands.",
      ],
    },
    {
      type: "stats",
      heading: "SuSIE Key Metrics",
      stats: [
        { value: "2-level", label: "Hierarchical architecture" },
        { value: "256x256", label: "Observation resolution" },
        { value: "40K", label: "Fine-tuning steps (high-level)" },
        { value: "220K+", label: "Human videos (Sth-Sth-v2)" },
        { value: "~60K", label: "Robot demos (BridgeData V2)" },
        { value: "> RT-2-X", label: "Real-world manipulation success" },
      ],
    },
    {
      type: "comparison-table",
      heading: "SuSIE Input/Output Specification",
      columns: ["Parameter", "Specification"],
      rows: [
        {
          Parameter: "Observation Format",
          Specification:
            "256x256 RGB images from a third-person camera (WidowX workspace view)",
        },
        {
          Parameter: "High-Level Output",
          Specification:
            "256x256 RGB subgoal image (edited version of current observation showing desired next state)",
        },
        {
          Parameter: "Low-Level Action Format",
          Specification:
            "Continuous end-effector deltas (position + rotation + gripper) via goal-conditioned policy",
        },
        {
          Parameter: "Language Conditioning",
          Specification:
            "Free-form natural language instructions fed to the high-level InstructPix2Pix model",
        },
        {
          Parameter: "High-Level Frequency",
          Specification: "~2 Hz (subgoal generation every ~0.5s)",
        },
        {
          Parameter: "Low-Level Frequency",
          Specification: "5-10 Hz (continuous motor commands reaching toward subgoal)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Architecture and Key Innovations",
      paragraphs: [
        "SuSIE's architecture consists of two distinct modules with completely different data requirements. The high-level subgoal generator is a fine-tuned InstructPix2Pix model -- a conditional diffusion model originally trained to edit images based on text instructions. SuSIE repurposes this capability for robotics: given an observation image and a language command, it 'edits' the image to show the next meaningful subgoal state. For example, given an image of a table with a carrot and the command 'put the carrot on the plate,' it generates an image showing the robot gripper grasping the carrot as an intermediate step.",
        "The low-level policy is a standard goal-conditioned visuomotor controller trained via behavioral cloning. It receives the current observation and the generated subgoal image, then outputs continuous end-effector delta actions to move the robot toward the subgoal. This policy is language-agnostic -- it only needs to reach visual targets, not understand instructions. The decoupling means the low-level policy can be trained on any goal-reaching data, regardless of whether language annotations exist.",
        "The hierarchical decomposition is what gives SuSIE its power over flat VLA models. While RT-2 or OpenVLA must learn the entire mapping from language + observation to motor commands in a single model, SuSIE breaks this into a visual reasoning step (what should the world look like next?) and a motor execution step (how do I get there?). The visual reasoning is handled by a model pretrained on internet-scale image editing, which already understands object manipulation semantics. The motor execution is a simpler problem that requires less data to learn.",
        "A critical design choice is the subgoal horizon. SuSIE generates subgoals representing roughly 5-15 timesteps of low-level execution -- long enough to represent meaningful manipulation progress but short enough for the low-level policy to reliably achieve. The system re-plans (generates a new subgoal) every few seconds, creating a closed-loop planning behavior that can recover from execution errors.",
      ],
    },
    {
      type: "comparison-table",
      heading: "SuSIE vs Related Approaches",
      columns: ["Dimension", "SuSIE", "RT-2-X", "Diffusion Policy", "GHIL-Glue"],
      rows: [
        {
          Dimension: "Architecture",
          SuSIE: "Hierarchical (subgoal + policy)",
          "RT-2-X": "Flat VLA (language -> actions)",
          "Diffusion Policy": "Flat (observation -> action chunks)",
          "GHIL-Glue": "Hierarchical (filtered subgoals)",
        },
        {
          Dimension: "Language Conditioning",
          SuSIE: "High-level only (diffusion model)",
          "RT-2-X": "End-to-end (VLM backbone)",
          "Diffusion Policy": "None (goal images only)",
          "GHIL-Glue": "High-level only (diffusion model)",
        },
        {
          Dimension: "Robot Training Data",
          SuSIE: "~60K demos (BridgeData V2)",
          "RT-2-X": "~800K demos (OXE subset)",
          "Diffusion Policy": "100-1,000 demos per task",
          "GHIL-Glue": "~60K demos (BridgeData V2)",
        },
        {
          Dimension: "Human Video Data",
          SuSIE: "220K clips (Sth-Sth-v2)",
          "RT-2-X": "Web VLM data (billions)",
          "Diffusion Policy": "None",
          "GHIL-Glue": "220K clips (Sth-Sth-v2)",
        },
        {
          Dimension: "Zero-Shot New Tasks",
          SuSIE: "Yes (via language to subgoal model)",
          "RT-2-X": "Yes (via VLM reasoning)",
          "Diffusion Policy": "No (task-specific training)",
          "GHIL-Glue": "Yes (improved filtering)",
        },
      ],
    },
    {
      type: "prose",
      heading: "Training Data Requirements",
      paragraphs: [
        "SuSIE's two-stage architecture creates two distinct data requirements. The high-level subgoal generator was fine-tuned on a mixture of robot demonstration videos and human manipulation videos. The robot video component came from BridgeData V2 -- approximately 60,000 demonstration trajectories collected across diverse tabletop manipulation tasks on WidowX robot arms. Each trajectory is a sequence of 256x256 RGB frames showing the robot completing a task. The human video component came from Something-Something-v2, a dataset of 220,847 labeled video clips of humans performing templated manipulation actions (e.g., 'pushing something from left to right', 'picking something up').",
        "For the high-level model, each training example is a tuple of (current frame, future frame, language instruction). The model learns to 'edit' the current frame into the future frame conditioned on the language instruction. The authors found that mixing robot and human video data was critical -- human videos alone produced plausible-looking edits but with poor spatial accuracy for the robot workspace, while robot videos alone lacked the diversity needed for language generalization. The best-performing model trained for approximately 40,000 gradient steps on this mixture.",
        "The low-level goal-conditioned policy requires standard behavioral cloning data: observation-action pairs where the robot is moving toward a goal state. This was sourced from the same BridgeData V2 demonstrations, but formatted differently -- each trajectory segment becomes a goal-reaching example where a random future frame serves as the goal image and the intervening actions serve as labels. No language annotations are needed for this component, which means any teleoperated demonstration dataset with consistent camera placement can contribute training data.",
        "For teams building SuSIE-style systems, the data bottleneck is typically the high-level model. You need video data showing manipulation state transitions paired with language descriptions of what happened. The low-level policy is comparatively easy to train -- 10,000-50,000 goal-reaching demonstrations from your target robot are usually sufficient. The high-level model benefits from scale and diversity: more environments, more objects, more language descriptions all improve zero-shot generalization to new commands.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Data Integrates with SuSIE",
      paragraphs: [
        "Claru provides both data streams that SuSIE's hierarchical architecture requires. For the high-level subgoal model, we deliver diverse video datasets with language-annotated state transitions -- exactly the (current frame, future frame, instruction) triples that InstructPix2Pix fine-tuning consumes. Our egocentric and third-person video collection spans manipulation scenarios across homes, kitchens, offices, and warehouses, providing environmental diversity beyond what BridgeData V2 or Something-Something-v2 alone cover.",
        "For the low-level goal-conditioned policy, Claru collects teleoperated robot demonstrations on client-specified hardware. We deliver these as observation-action sequences at 256x256 resolution with consistent camera calibration, formatted for direct ingestion into goal-conditioned behavioral cloning pipelines. Each trajectory includes the metadata needed to construct goal-reaching pairs: frame timestamps, action labels, and segment boundaries.",
        "Claru's collection methodology specifically addresses SuSIE's sensitivity to visual diversity. The original paper showed that mixing human and robot video data was essential for the high-level model's generalization. Our human activity video corpus -- collected across 100+ cities with natural manipulation behaviors -- provides a much larger and more diverse complement to robot demonstration data than the structured Something-Something-v2 clips used in the original work. We can also provide robot demonstration data at scale for the low-level policy, reducing the reliance on BridgeData V2's WidowX-specific distribution.",
        "We deliver all data in formats compatible with the open-source SuSIE training codebase, including the specific data loader conventions for InstructPix2Pix fine-tuning and RLDS/HDF5 formats for the low-level policy. Quality checks enforce frame resolution consistency, language annotation coverage, and temporal alignment between video frames and action labels.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "black-susie-2024",
          title:
            "Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models",
          authors: "Black, Nakamoto, Atreya, Walke, Finn, Kumar, Levine",
          venue: "ICLR 2024 / arXiv 2310.10639",
          year: 2024,
          url: "https://arxiv.org/abs/2310.10639",
        },
        {
          id: "brooks-instructpix2pix-2023",
          title:
            "InstructPix2Pix: Learning to Follow Image Editing Instructions",
          authors: "Brooks, Holynski, Efros",
          venue: "CVPR 2023 / arXiv 2211.09800",
          year: 2023,
          url: "https://arxiv.org/abs/2211.09800",
        },
        {
          id: "walke-bridgedata-2023",
          title: "BridgeData V2: A Dataset for Robot Learning at Scale",
          authors: "Walke et al.",
          venue: "CoRL 2023 / arXiv 2308.12952",
          year: 2023,
          url: "https://arxiv.org/abs/2308.12952",
        },
        {
          id: "mees-calvin-2022",
          title:
            "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
          authors: "Mees, Hermann, Rosete-Beas, Burgard",
          venue: "IEEE RA-L 2022 / arXiv 2112.03227",
          year: 2022,
          url: "https://arxiv.org/abs/2112.03227",
        },
        {
          id: "du-ghilglue-2024",
          title: "GHIL-Glue: Hierarchical Control with Filtered Subgoal Images",
          authors: "Du et al.",
          venue: "arXiv 2410.20018",
          year: 2024,
          url: "https://arxiv.org/abs/2410.20018",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What data format does SuSIE require?",
      answer:
        "SuSIE has two data streams with different formats. The high-level subgoal model needs video frame triplets (current image, future image, language instruction) at 256x256 resolution for InstructPix2Pix fine-tuning. The low-level policy needs standard behavioral cloning data: observation-action pairs in RLDS or HDF5 format with 256x256 RGB images and continuous end-effector actions. Claru delivers both formats ready for the open-source SuSIE training codebase.",
    },
    {
      question:
        "How much data do I need to train each component of SuSIE?",
      answer:
        "The high-level subgoal generator was fine-tuned for ~40,000 steps on a mixture of ~60,000 BridgeData V2 robot trajectories and ~220,000 Something-Something-v2 human video clips. The low-level goal-conditioned policy needs 10,000-50,000 teleoperated demonstrations from your target robot. The high-level model benefits most from diversity (more environments and language descriptions), while the low-level model benefits most from volume on your specific hardware.",
    },
    {
      question: "How does SuSIE compare to RT-2-X in practice?",
      answer:
        "On real-world WidowX manipulation tasks, SuSIE outperformed RT-2-X (55B parameters, trained on 20x more robot data) across all tested scenarios. SuSIE achieves this by leveraging pretrained visual reasoning from InstructPix2Pix rather than learning manipulation semantics from scratch. The hierarchical decomposition also handles long-horizon tasks better because each subgoal is a concrete visual target rather than an abstract plan.",
    },
    {
      question:
        "Can SuSIE generalize to robot hardware other than WidowX?",
      answer:
        "Yes. The high-level subgoal model is largely hardware-agnostic -- it reasons about scene-level visual changes, not specific robot morphologies. The low-level policy does need to be trained on your target hardware, but as a goal-conditioned controller it is relatively simple to train with 10,000-50,000 demonstrations. Claru can collect goal-reaching demonstrations on any client-specified platform.",
    },
    {
      question:
        "Why use human video data for training a robot manipulation model?",
      answer:
        "Human video data teaches the high-level model what manipulation state transitions look like -- how objects move, what grasping looks like, what 'putting X on Y' means visually. Something-Something-v2 provides 220K+ clips of humans performing templated manipulation actions. This visual understanding transfers to robot settings because the high-level model only needs to predict 'what the scene should look like next,' not how to actuate specific joints. The low-level robot policy handles the motor execution.",
    },
  ],
  ctaHeading: "Get Data for SuSIE-Style Hierarchical Policies",
  ctaDescription:
    "Tell us about your subgoal synthesis project and we will deliver both the video-language data for high-level model training and the goal-conditioned demonstrations for low-level policy learning.",
  relatedGlossaryTerms: [
    "vla",
    "foundation-model-robotics",
    "imitation-learning",
    "diffusion-policy",
  ],
  relatedGuidePages: [
    "how-to-create-action-labels-for-vla",
    "how-to-collect-teleoperation-data",
  ],
  relatedSolutionSlugs: ["vla-training-data"],
  modelName: "SuSIE",
  organization: "UC Berkeley",
  year: 2024,
  inputSpec: {
    observationFormat: "256x256 RGB images (third-person camera)",
    actionFormat:
      "Hierarchical: 256x256 subgoal images (high-level) + continuous end-effector deltas (low-level)",
    languageConditioning:
      "Free-form natural language instructions (high-level model only)",
    controlFrequency: "~2 Hz subgoal generation, 5-10 Hz low-level motor commands",
  },
  dataVolumeBenchmarks:
    "SuSIE's high-level subgoal generator was fine-tuned on a mixture of approximately 60,000 robot demonstration trajectories from BridgeData V2 (WidowX tabletop manipulation) and 220,847 human manipulation video clips from Something-Something-v2. Training ran for approximately 40,000 gradient steps. The low-level goal-conditioned policy was trained on the same BridgeData V2 demonstrations reformatted as goal-reaching pairs. Mixing human and robot video was critical for the high-level model -- human videos alone produced plausible edits with poor spatial accuracy, while robot videos alone lacked language diversity. On real-world tasks, SuSIE outperformed RT-2-X (55B parameters, 20x more robot training data) across all tested manipulation scenarios, demonstrating that hierarchical decomposition with pretrained vision models is more data-efficient than flat VLA scaling.",
  trainingRecipe:
    "Two-stage training with distinct data for each component. Stage 1 (High-Level): Fine-tune InstructPix2Pix (a conditional image-editing diffusion model) on (current_frame, future_frame, language_instruction) triples extracted from robot and human video data. The model learns to 'edit' the current observation into a plausible next subgoal conditioned on the language command. Training uses standard diffusion model objectives for ~40K steps. Stage 2 (Low-Level): Train a goal-conditioned visuomotor policy via behavioral cloning on observation-action pairs from BridgeData V2, where random future frames from the same trajectory serve as goal images. This policy is language-agnostic -- it only needs to reach visual targets. At inference, the system alternates: the high-level model generates a subgoal image every ~0.5s, and the low-level policy continuously executes actions toward that subgoal at 5-10 Hz.",
  claruIntegration:
    "Claru provides both data streams SuSIE requires. For the high-level subgoal model, we deliver diverse video datasets with language-annotated state transitions -- the (current_frame, future_frame, instruction) triples that InstructPix2Pix fine-tuning consumes. Our human activity video corpus across 100+ cities provides broader environmental diversity than Something-Something-v2's structured clips. For the low-level policy, we collect teleoperated robot demonstrations on client-specified hardware at 256x256 resolution with consistent camera calibration, formatted for goal-conditioned behavioral cloning. All data is compatible with the open-source SuSIE codebase and includes quality-checked frame resolution consistency, language annotation coverage, and temporal alignment.",
  keyPapers: [
    {
      id: "black-susie-2024",
      title:
        "Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models",
      authors: "Black, Nakamoto, Atreya, Walke, Finn, Kumar, Levine",
      venue: "ICLR 2024 / arXiv 2310.10639",
      year: 2024,
      url: "https://arxiv.org/abs/2310.10639",
    },
    {
      id: "brooks-instructpix2pix-2023",
      title:
        "InstructPix2Pix: Learning to Follow Image Editing Instructions",
      authors: "Brooks, Holynski, Efros",
      venue: "CVPR 2023 / arXiv 2211.09800",
      year: 2023,
      url: "https://arxiv.org/abs/2211.09800",
    },
    {
      id: "walke-bridgedata-2023",
      title: "BridgeData V2: A Dataset for Robot Learning at Scale",
      authors: "Walke et al.",
      venue: "CoRL 2023 / arXiv 2308.12952",
      year: 2023,
      url: "https://arxiv.org/abs/2308.12952",
    },
    {
      id: "mees-calvin-2022",
      title:
        "CALVIN: A Benchmark for Language-Conditioned Policy Learning for Long-Horizon Robot Manipulation Tasks",
      authors: "Mees, Hermann, Rosete-Beas, Burgard",
      venue: "IEEE RA-L 2022 / arXiv 2112.03227",
      year: 2022,
      url: "https://arxiv.org/abs/2112.03227",
    },
    {
      id: "du-ghilglue-2024",
      title: "GHIL-Glue: Hierarchical Control with Filtered Subgoal Images",
      authors: "Du et al.",
      venue: "arXiv 2410.20018",
      year: 2024,
      url: "https://arxiv.org/abs/2410.20018",
    },
  ],
};

export default data;
