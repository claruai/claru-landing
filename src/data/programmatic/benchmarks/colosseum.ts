import type { BenchmarkPageData } from "./types";

const page: BenchmarkPageData = {
  slug: "colosseum",
  benchmarkName: "Colosseum",
  benchmarkDescription:
    "Colosseum is a benchmark designed to evaluate the robustness of vision-language-action (VLA) models under systematic environmental perturbations. Created by Pumacay et al. and presented at RSS 2024, it tests how robot manipulation policies degrade when environmental conditions change across 12 independent perturbation axes — lighting, textures, table colors, distractor objects, and camera viewpoints — using a real WidowX 250 robot arm.",
  taskSet:
    "14 manipulation tasks evaluated under 12 systematic perturbation axes. Tasks include pick-and-place, stacking, drawer operations, and object rearrangement. Each perturbation axis (lighting color, lighting intensity, table texture, table color, distractor objects, background changes, camera pose shifts, object color, object size, object texture, tabletop clutter, and combined perturbations) is applied independently to isolate its effect on policy performance.",
  observationSpace:
    "RGB images from wrist-mounted and third-person cameras at 224x224 resolution, proprioceptive state including joint positions and gripper aperture, and natural language task descriptions specifying the manipulation goal.",
  actionSpace:
    "6-DOF end-effector delta poses (3D position + 3D orientation) with binary gripper control, executed on a WidowX 250 6-DOF robot arm at 5 Hz control frequency.",
  evaluationProtocol:
    "Success rate measured per task under each perturbation axis independently and in combination. Each task-perturbation pair runs 10 evaluation trials with deterministic perturbation settings. The benchmark reports both nominal success rate (no perturbations) and per-axis degradation, enabling researchers to identify exactly which environmental changes cause the largest performance drops for a given VLA architecture.",
  simToRealGap:
    "Colosseum is unusual among benchmarks because it runs on real hardware, not simulation. However, its controlled perturbations still underrepresent real-world variability. A real deployment faces simultaneous changes in lighting, backgrounds, distractor objects, and camera drift — not one perturbation at a time. Additionally, Colosseum's perturbations are applied in a controlled lab setting and cannot capture outdoor lighting variation, surface contamination, or the visual complexity of unstructured real environments.",
  realWorldDataNeeds:
    "Training data collected under extreme visual diversity — many different lighting conditions, backgrounds, table surfaces, distractor objects, and camera angles — to build visual representations robust to the perturbations Colosseum measures. Uncontrolled real-world environments naturally provide this diversity at a scale that controlled perturbation experiments cannot match.",
  complementaryDatasets: [
    {
      name: "Egocentric Activity Dataset",
      rationale:
        "Collected across 100+ real-world locations with naturally varying lighting, backgrounds, and visual conditions — exactly the visual diversity that trains robust policies against Colosseum's perturbation axes.",
    },
    {
      name: "Manipulation Trajectory Dataset",
      rationale:
        "Real-world manipulation recordings in diverse, uncontrolled environments provide training data with authentic visual variation rather than synthetic or lab-controlled perturbations.",
    },
    {
      name: "Custom Visual Diversity Collection",
      rationale:
        "Purpose-collected manipulation data explicitly varying lighting, surface material, background, and distractor density to address each of Colosseum's 12 perturbation axes with real-world instances.",
    },
  ],
  keyPapers: [
    {
      id: "pumacay-colosseum-2024",
      title:
        "Colosseum: A Benchmark for Evaluating Generalization for Robotic Manipulation",
      authors: "Pumacay et al.",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2402.08191",
    },
    {
      id: "brohan-rt2-2023",
      title:
        "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "chi-diffusion-policy-2023",
      title:
        "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "kim-openvla-2024",
      title:
        "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "CoRL 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246",
    },
    {
      id: "team-octo-2024",
      title:
        "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213",
    },
  ],
  technicalAnalysis:
    "Colosseum fills a critical evaluation gap by measuring visual robustness on real hardware. Most benchmarks test task success under nominal conditions only. Colosseum tests whether performance holds when one environmental factor changes at a time, and the results expose a fundamental weakness in current VLA architectures.\n\nThe benchmark's findings are sobering. RT-2-based models lose 30-50% success rate when lighting color changes from white to colored. Diffusion Policy variants drop 20-40% with distractor objects on the table. Even small camera viewpoint shifts of 5-10 degrees degrade performance by 15-30% for models that appeared robust under nominal evaluation. OpenVLA and Octo show similar sensitivity, with no current architecture demonstrating consistent robustness across all perturbation axes.\n\nWhat makes these results actionable is the per-axis decomposition. Colosseum reveals that lighting robustness and distractor robustness are largely independent failure modes — a policy can be robust to lighting changes while being fragile to distractors. This implies that training data must cover each axis of variation independently, not just increase overall diversity.\n\nThe benchmark also reveals that data quantity alone does not solve robustness. RT-2 was trained on massive internet-scale data but still shows significant drops under Colosseum's perturbations. The issue is the distribution of that data — web images do not proportionally represent the specific perturbation axes that matter for manipulation. Purpose-collected real-world manipulation data under controlled diversity can be more efficient than uncurated web-scale data for building robust policies.\n\nClaru's egocentric activity dataset, collected across 100+ cities in naturally varying conditions, provides precisely this kind of structured visual diversity. Each collection location has different lighting, surfaces, backgrounds, and clutter levels. Training on this diversity produces the per-axis visual robustness that Colosseum measures.",
  metaTitle:
    "Real-World Data for Colosseum Robustness Benchmark | Claru",
  metaDescription:
    "Visually diverse manipulation data to address the robustness gaps that Colosseum reveals in VLA models under lighting, texture, and distractor perturbations.",
  primaryKeyword: "Colosseum benchmark data",
  secondaryKeywords: [
    "VLA robustness data",
    "visual perturbation robot data",
    "robust manipulation training data",
    "Colosseum robot benchmark",
    "VLA generalization data",
  ],
  canonicalPath: "/benchmarks/colosseum",
  h1: "Real-World Data for Colosseum",
  heroSubtitle:
    "Colosseum reveals that VLA models fail under systematic visual perturbations. Diverse real-world data builds the per-axis robustness these models lack.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Colosseum", href: "/benchmarks/colosseum" },
  ],
  sections: [
    {
      type: "stats",
      heading: "Colosseum at a Glance",
      stats: [
        { value: "14", label: "Manipulation Tasks" },
        { value: "12", label: "Perturbation Axes" },
        { value: "30-50%", label: "Typical Success Drop" },
        { value: "WidowX 250", label: "Robot Platform" },
        { value: "Real HW", label: "Evaluation Setting" },
        { value: "2024", label: "Released" },
      ],
    },
    {
      type: "prose",
      heading: "What Is Colosseum?",
      paragraphs: [
        "Colosseum is a robustness benchmark for vision-language-action models created by Pumacay et al. at the University of Washington. Unlike most manipulation benchmarks that test whether a policy can complete tasks under favorable conditions, Colosseum tests whether performance holds when the environment changes. It applies 12 independent perturbation axes — from lighting shifts to distractor objects — and measures exactly how much each change degrades a given VLA model.",
        "The benchmark runs entirely on real hardware (a WidowX 250 robot arm), avoiding the confound of simulation artifacts. Each of its 14 manipulation tasks is evaluated under nominal conditions and then under each perturbation independently, producing a detailed robustness profile rather than a single success number.",
        "Colosseum was motivated by a gap in how the robotics community evaluates VLA models. Papers routinely report high success rates on nominal tasks, but deployment requires robustness to the unpredictable visual changes of real environments. Colosseum quantifies this gap and provides a standardized protocol for comparing robustness across architectures.",
        "The benchmark has already been used to evaluate major VLA models including RT-2, Diffusion Policy, Octo, and OpenVLA, establishing that no current architecture is uniformly robust across all perturbation axes. This finding has important implications for training data: robustness requires systematic visual diversity, not just task diversity.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Perturbation Axes",
      description:
        "Colosseum's 12 perturbation axes each isolate one environmental change, revealing which factors cause the largest performance drops for VLA models.",
      columns: ["Perturbation Axis", "What Changes", "Typical VLA Drop", "Data Implication"],
      rows: [
        {
          "Perturbation Axis": "Lighting Color",
          "What Changes": "White light replaced with colored (red, blue, green)",
          "Typical VLA Drop": "30-50%",
          "Data Implication": "Train under varied lighting temperatures and hues",
        },
        {
          "Perturbation Axis": "Lighting Intensity",
          "What Changes": "Brightness increased or decreased significantly",
          "Typical VLA Drop": "15-25%",
          "Data Implication": "Include dim and bright environments in collection",
        },
        {
          "Perturbation Axis": "Table Texture",
          "What Changes": "Workspace surface material changed",
          "Typical VLA Drop": "10-30%",
          "Data Implication": "Collect on wood, metal, fabric, and patterned surfaces",
        },
        {
          "Perturbation Axis": "Distractor Objects",
          "What Changes": "Irrelevant objects placed on the workspace",
          "Typical VLA Drop": "20-40%",
          "Data Implication": "Include cluttered environments with non-task objects",
        },
        {
          "Perturbation Axis": "Camera Viewpoint",
          "What Changes": "Camera position shifted 5-10 degrees",
          "Typical VLA Drop": "15-30%",
          "Data Implication": "Collect from multiple camera angles per task",
        },
        {
          "Perturbation Axis": "Object Color",
          "What Changes": "Target object color changed",
          "Typical VLA Drop": "10-25%",
          "Data Implication": "Use diverse object instances, not single exemplars",
        },
      ],
    },
    {
      type: "prose",
      heading: "Evaluation Protocol",
      paragraphs: [
        "Colosseum's evaluation protocol applies each of its 12 perturbation axes independently, running 10 deterministic trials per task-perturbation pair. This produces a robustness matrix: 14 tasks times 12 perturbations gives 168 evaluation conditions, each with a measured success rate. The protocol also evaluates combined perturbations (multiple axes changed simultaneously) to test whether robustness effects are additive or multiplicative.",
        "The nominal evaluation establishes a baseline: each task is run 10 times under standard lab conditions with controlled lighting, clean workspace, and calibrated camera position. Perturbations are then applied one at a time — changing only lighting color while holding everything else constant, for example — to isolate the causal effect of each visual change.",
        "This per-axis decomposition is more informative than an aggregate robustness score. A policy might handle lighting changes well but collapse when distractors appear, or vice versa. Colosseum's matrix reveals these asymmetric failure modes, guiding targeted data collection to patch specific weaknesses.",
        "The benchmark reports both absolute success rates and relative degradation (percentage drop from nominal). Relative degradation is the more useful metric for comparing architectures, since it normalizes out differences in nominal task difficulty and reveals which models degrade gracefully versus catastrophically under perturbation.",
      ],
    },
    {
      type: "comparison-table",
      heading: "VLA Model Robustness Comparison",
      description:
        "How leading VLA architectures perform on Colosseum's perturbation axes, based on published results.",
      columns: ["Model", "Nominal Success", "Lighting Robustness", "Distractor Robustness", "Overall Degradation"],
      rows: [
        {
          Model: "RT-2",
          "Nominal Success": "High",
          "Lighting Robustness": "Low (30-50% drop)",
          "Distractor Robustness": "Medium (20-30% drop)",
          "Overall Degradation": "Significant",
        },
        {
          Model: "Diffusion Policy",
          "Nominal Success": "Medium-High",
          "Lighting Robustness": "Medium (20-30% drop)",
          "Distractor Robustness": "Low (30-40% drop)",
          "Overall Degradation": "Significant",
        },
        {
          Model: "OpenVLA",
          "Nominal Success": "Medium",
          "Lighting Robustness": "Medium (15-30% drop)",
          "Distractor Robustness": "Medium (20-35% drop)",
          "Overall Degradation": "Moderate-Significant",
        },
        {
          Model: "Octo",
          "Nominal Success": "Medium",
          "Lighting Robustness": "Medium (20-35% drop)",
          "Distractor Robustness": "Medium (15-30% drop)",
          "Overall Degradation": "Moderate",
        },
      ],
    },
    {
      type: "prose",
      heading: "Bridging Controlled Perturbations to Real Deployment",
      paragraphs: [
        "Colosseum's controlled perturbations systematically test robustness, but real deployment environments present all 12 perturbation axes simultaneously and continuously. A kitchen has varying natural light throughout the day, different objects on the counter each hour, and camera positions that drift with robot base movement. The visual distribution a deployed robot faces is the product of all perturbation axes, not their sum.",
        "This means training data for Colosseum-robust policies must go beyond matching individual perturbation axes. It must provide examples where multiple visual factors vary simultaneously — different lighting and different backgrounds and different distractor objects in the same scene. Real-world environments naturally provide this correlated variation, making authentic in-situ data collection more efficient than constructing perturbation combinations in a lab.",
        "Colosseum's findings also suggest that data augmentation (synthetic perturbations applied to clean training images) is insufficient. Models trained with color jittering and random crops still show significant drops on Colosseum's real perturbations, because synthetic augmentations do not capture the correlations between lighting, shadows, and surface reflections that exist in real visual changes.",
        "The most efficient path to Colosseum robustness is training on manipulation data collected across many real-world environments where lighting, backgrounds, surfaces, and clutter vary naturally. Each unique environment provides a correlated sample from the real perturbation distribution, building robustness that transfers to the concurrent perturbation conditions of deployment.",
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Colosseum Users",
      paragraphs: [
        "Claru provides training data with the structured visual diversity that Colosseum reveals VLA models need. Our egocentric activity dataset spans 100+ real-world locations with naturally varying lighting conditions, surface materials, background scenes, and clutter levels — addressing every perturbation axis Colosseum evaluates.",
        "For teams targeting specific Colosseum weaknesses, Claru coordinates custom collection campaigns that explicitly vary the relevant environmental factors. If a VLA model shows 40% degradation under lighting changes, we can collect manipulation demonstrations under dozens of different lighting conditions — warm incandescent, cool fluorescent, mixed natural light, colored accent lighting — providing the targeted diversity to patch that specific robustness gap.",
        "Our data collection protocol records metadata about environmental conditions (lighting type, surface material, clutter level) for each session, enabling researchers to construct training sets with controlled diversity distributions rather than relying on unstructured random variation.",
      ],
    },
    {
      type: "citation-list",
      heading: "Key References",
      citations: [
        {
          id: "pumacay-colosseum-2024",
          title:
            "Colosseum: A Benchmark for Evaluating Generalization for Robotic Manipulation",
          authors: "Pumacay et al.",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2402.08191",
        },
        {
          id: "brohan-rt2-2023",
          title:
            "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          authors: "Brohan et al.",
          venue: "CoRL 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2307.15818",
        },
        {
          id: "chi-diffusion-policy-2023",
          title:
            "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
          authors: "Chi et al.",
          venue: "RSS 2023",
          year: 2023,
          url: "https://arxiv.org/abs/2303.04137",
        },
        {
          id: "kim-openvla-2024",
          title:
            "OpenVLA: An Open-Source Vision-Language-Action Model",
          authors: "Kim et al.",
          venue: "CoRL 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2406.09246",
        },
        {
          id: "team-octo-2024",
          title:
            "Octo: An Open-Source Generalist Robot Policy",
          authors: "Octo Model Team",
          venue: "RSS 2024",
          year: 2024,
          url: "https://arxiv.org/abs/2405.12213",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What does Colosseum measure that other benchmarks miss?",
      answer:
        "Colosseum systematically tests visual robustness on real hardware — how much performance degrades when lighting, textures, backgrounds, distractors, or camera angles change. Other benchmarks test task success under nominal conditions only, giving an incomplete picture of deployment readiness. Colosseum's per-axis decomposition reveals exactly which environmental changes cause the largest performance drops for a given VLA model.",
    },
    {
      question: "Why do VLA models fail under visual perturbations despite being trained on large datasets?",
      answer:
        "Most training data comes from narrow visual distributions — either controlled lab settings or internet images that do not proportionally represent the perturbation axes relevant to manipulation. Models learn visual shortcuts specific to their training distribution. When perturbations break these correlations (e.g., an object's color changes, making color-based identification fail), the policy collapses because its visual features are not truly invariant to task-irrelevant changes.",
    },
    {
      question: "Can data augmentation alone address Colosseum's perturbation axes?",
      answer:
        "Partially, but not completely. Color jittering and random crops help with some axes but fail to capture the correlated structure of real visual changes — how shadows shift with lighting, how reflections change with surface materials, how clutter affects occlusion patterns. Real-world data under authentic visual variation captures these correlations, producing more robust representations than synthetic augmentation alone.",
    },
    {
      question: "How does Colosseum differ from domain randomization approaches?",
      answer:
        "Domain randomization applies random visual perturbations during simulation training to build robustness. Colosseum is an evaluation benchmark, not a training method — it measures whether a policy is robust after training, regardless of how it was trained. Colosseum's results show that even domain-randomized policies still degrade under real-world perturbations, suggesting that the randomization distribution does not fully cover real visual variation.",
    },
    {
      question: "Which Colosseum perturbation axis causes the worst VLA performance drops?",
      answer:
        "Lighting color changes consistently cause the largest drops (30-50% for most models), followed by distractor objects (20-40%) and camera viewpoint shifts (15-30%). However, the ranking varies by architecture — some models handle lighting well but fail on distractors. This model-specific sensitivity is what makes Colosseum's per-axis decomposition valuable for targeted data collection.",
    },
  ],
  ctaHeading: "Build Visually Robust Robot Policies",
  ctaDescription:
    "Discuss visually diverse manipulation data that addresses the robustness gaps Colosseum reveals across all 12 perturbation axes.",
  relatedGlossaryTerms: [
    "vla",
    "domain-randomization",
    "sim-to-real-gap",
    "scene-understanding",
    "visual-robustness",
  ],
  relatedGuidePages: [
    "how-to-bridge-sim-to-real-gap",
    "how-to-evaluate-sim-to-real-transfer",
  ],
  relatedSolutionSlugs: [],
};
export default page;
