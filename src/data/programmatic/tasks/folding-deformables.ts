import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "folding-deformables",
  metaTitle: "Deformable Object Folding & Manipulation Data | Claru",
  metaDescription: "Training data for deformable object manipulation: cloth folding, fabric handling, soft object manipulation. Demonstrations with state estimation for garments and textiles.",
  primaryKeyword: "deformable object folding training data",
  secondaryKeywords: ["cloth folding dataset", "fabric manipulation data", "soft object robotics data", "garment folding robot data", "textile manipulation dataset", "laundry robot training data"],
  canonicalPath: "/training-data/folding-deformables",
  h1: "Deformable Object Folding Training Data",
  heroSubtitle: "Deformable object manipulation datasets — cloth folding, garment handling, towel straightening, and fabric manipulation with state estimation annotations for training policies on soft materials.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Deformable Object Folding", href: "/training-data/folding-deformables" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Deformable Object Folding and Why Is It So Hard?",
      paragraphs: [
        "Deformable object folding encompasses the robotic manipulation of fabrics, garments, towels, and other soft materials into target configurations. The fundamental challenge is state representation: a standard bath towel has effectively infinite degrees of freedom, making it impossible to represent its full configuration with the compact state vectors used for rigid objects. A crumpled t-shirt on a table can occupy any of billions of possible configurations, and the mapping from visual observation to manipulation action is highly non-linear — two visually similar crumpled states may require completely different unfolding strategies.",
        "This task family is commercially significant. The global laundry services market exceeds $80B, and companies like Sewbo, Laundroid (Seven Dreamers), and Banana Robotics are building folding machines. Yet no production system achieves reliable garment folding at human speed. The bottleneck is not hardware — bimanual systems like ALOHA can physically execute folds — but rather the perception and planning required to handle the extreme variability of cloth states. SpeedFolding (Avigal et al., 2022) achieved 30-120 seconds per fold with a bimanual system, but required 4,300 real-world demonstrations and still struggles with novel garment geometries.",
        "Data collection for cloth folding must capture the full pipeline: initial state randomization (crumpled, partially folded, inside-out), grasp point selection, lift-and-place motions, and fold-line alignment. Unlike rigid manipulation where a single camera often suffices, cloth folding requires overhead and angled views to resolve self-occlusions when fabric layers overlap. The annotation burden is also heavier — each frame needs cloth state descriptors, visible fold lines, grasp quality scores, and coverage metrics that quantify how much of the target fold has been achieved.",
        "The deformable manipulation challenge extends beyond garments. Rope and cable manipulation (used in cable harnessing for automotive and aerospace manufacturing), dough kneading and rolling (in commercial food preparation), surgical tissue handling (in robotic surgery), and bag opening and packing (in e-commerce fulfillment) all involve deformable objects with similar data challenges. A dataset designed for garment folding can transfer partially to these related domains, particularly the perception and grasp-point selection components, making deformable manipulation data a high-leverage investment for teams working across multiple soft-object domains.",
      ],
    },
    {
      type: "stats",
      heading: "Deformable Folding Data at a Glance",
      stats: [
        { value: "2K-20K", label: "Demos per garment category" },
        { value: "30 Hz", label: "Multi-view video capture" },
        { value: "4,300", label: "Real demos for SpeedFolding" },
        { value: "30-120s", label: "Current best fold time" },
        { value: "$80B+", label: "Global laundry services market" },
        { value: "Infinite", label: "Degrees of freedom in cloth state" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Folding Method",
      description: "Different learning approaches for cloth folding vary dramatically in their data hunger and modality requirements.",
      columns: ["Method", "Data Volume", "Key Modalities", "State Representation", "Bimanual Required"],
      rows: [
        { "Method": "FlingBot (pick-and-fling)", "Data Volume": "200-500 demos", "Key Modalities": "RGB-D overhead", "State Representation": "Depth heightmap", "Bimanual Required": "No" },
        { "Method": "SpeedFolding", "Data Volume": "4K+ demos", "Key Modalities": "RGB multi-view", "State Representation": "Learned embedding", "Bimanual Required": "Yes" },
        { "Method": "ClothFunnels", "Data Volume": "1K sim + 100 real", "Key Modalities": "RGB-D + flow", "State Representation": "Canonical surface map", "Bimanual Required": "Yes" },
        { "Method": "Diffusion Policy", "Data Volume": "200-1K demos", "Key Modalities": "RGB wrist + overhead", "State Representation": "Action diffusion", "Bimanual Required": "Depends on task" },
        { "Method": "Foundation model fine-tune", "Data Volume": "5K-20K demos", "Key Modalities": "RGB + language", "State Representation": "VLA latent", "Bimanual Required": "Optional" },
        { "Method": "UniFolding (ICRA 2024)", "Data Volume": "1K-3K demos", "Key Modalities": "RGB-D + UV texture map", "State Representation": "Garment mesh estimation", "Bimanual Required": "Yes" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Cloth Manipulation",
      paragraphs: [
        "The field has progressed through three generations of approaches. First-generation methods used hand-crafted features — detecting corners, edges, and wrinkles through traditional computer vision — and achieved reliable folding only for rectangular items like towels on clean backgrounds. Second-generation methods introduced learned representations: FlingBot (Ha et al., 2022) trains a pick-and-fling policy from depth images that learns to unfold crumpled cloth through dynamic flinging motions, and ClothFunnels (Canberk et al., 2023) uses virtual deformation fields to map cloth to a canonical pose before executing a scripted fold sequence.",
        "Third-generation methods — the current state of the art — use end-to-end visuomotor policies. SpeedFolding (Avigal et al., 2022) trains an action-centric model from 4,300 real demonstrations that outputs bimanual pick-and-place primitives, achieving 93% success on rectangular items. DextAIRity (Yasutomo et al., 2023) adds pneumatic blowing to unfold cloth before folding, reducing the number of manipulation steps. UniFolding (Sun et al., ICRA 2024) combines a garment mesh estimation network with a bimanual policy, enabling garment-type-agnostic folding by first reconstructing the 3D garment mesh from a single RGB image and then planning fold sequences on the predicted mesh. This approach achieves 85% success across t-shirts, shorts, and dresses — categories that prior methods handled separately.",
        "Critically, all these methods require substantial real-world data because cloth simulation suffers from a severe sim-to-real gap: contact friction between fabric layers, air resistance during dynamic motions, and fabric draping behavior are all poorly approximated by current physics engines. The NVIDIA Warp and Isaac Sim cloth simulation modules have improved significantly, but empirical evaluations show that policies trained purely in simulation still achieve 30-50% lower success rates on real cloth than those trained on real demonstrations, even with extensive domain randomization of fabric parameters (friction, stiffness, density, thickness).",
        "The emerging frontier is language-conditioned cloth manipulation. Rather than training separate policies for each fold type, VLA-based approaches accept natural language instructions like 'fold the shirt in thirds' or 'roll the towel into a cylinder' and plan manipulation sequences accordingly. GarmentLab (Lu et al., 2024) demonstrated a benchmark for language-conditioned garment manipulation spanning 20 task types. These require 10-20x more demonstrations than task-specific policies but offer far greater flexibility. The primary data bottleneck is the annotation of fold-type labels, intermediate goal descriptions, and progress metrics that enable language grounding — annotations that require understanding both the manipulation intent and the cloth physics.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Cloth Folding Data",
      paragraphs: [
        "A production cloth folding collection station requires: overhead RGB-D cameras (minimum 2, capturing the full table surface), angled side cameras to resolve layered fabric occlusions, a bimanual teleoperation setup (leader-follower arms or VR controller interface), and a standardized garment library. The garment library should span at least 5 categories (towels, t-shirts, pants, long-sleeve shirts, bed linens) with 10+ variants per category differing in size, fabric type, color, and pattern. Fabric properties should be explicitly cataloged: cotton, polyester, silk, denim, fleece, and blends all drape and fold differently, and a policy trained only on cotton will struggle with the slipperiness of silk or the stiffness of denim.",
        "Initial state randomization is the single most important diversity axis. Each demonstration should start from a different initial configuration — crumpled, inside-out, partially folded, draped over the edge — to prevent the policy from overfitting to specific starting states. Claru's protocol uses a randomization matrix: for every 100 demonstrations of a garment type, we ensure at least 20 start from heavy crumple, 20 from light crumple, 20 from partially folded, 20 from flat but rotated, and 20 from edge-draped states. For garments with structural features (buttons, zippers, collars), an additional 10% of demonstrations start from inside-out configurations that require the operator to first correct the garment orientation before folding.",
        "Annotations include grasp point coordinates in image space and 3D, fold line vectors, cloth coverage percentage (ratio of cloth area to bounding rectangle), smoothness score (wrinkle density via high-frequency depth variation), and fold quality assessment (alignment of achieved fold with target fold line, measured as angular deviation in degrees and offset in centimeters). For each fold step, we annotate the fold type (half-fold, third-fold, sleeve-fold, collar-fold, roll), the grasp strategy (pinch, scoop, two-finger, palm), and the release timing. All annotations undergo automated consistency checks (e.g., coverage should increase monotonically during unfolding sequences) followed by 25% human spot-verification, with inter-annotator agreement tracked per garment category.",
        "For language-conditioned datasets, each demonstration is additionally annotated with a natural language instruction describing the target fold configuration (e.g., 'fold the t-shirt into a rectangle suitable for drawer storage'), intermediate subgoal descriptions at each fold step (e.g., 'fold left sleeve across the body'), and a progress metric at each frame indicating percentage completion toward the final target. These linguistic annotations are collected post-hoc by a separate annotation team watching the demonstration videos, ensuring that the language descriptions are natural and diverse rather than templated.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Cloth Folding Research",
      columns: ["Dataset", "Year", "Scale", "Garment Types", "Annotations", "Availability"],
      rows: [
        { "Dataset": "Berkeley Folding", "Year": "2020", "Scale": "600 demos", "Garment Types": "Towels only", "Annotations": "Grasp points + success", "Availability": "Public" },
        { "Dataset": "SpeedFolding Data", "Year": "2022", "Scale": "4,300 demos", "Garment Types": "Towels, t-shirts", "Annotations": "Pick-place primitives", "Availability": "Partial release" },
        { "Dataset": "ClothFunnels", "Year": "2023", "Scale": "1K sim + 100 real", "Garment Types": "T-shirts, pants", "Annotations": "Canonical maps + flow", "Availability": "Public (sim only)" },
        { "Dataset": "ALOHA Folding", "Year": "2023", "Scale": "50 demos", "Garment Types": "T-shirts", "Annotations": "Joint trajectories", "Availability": "Public" },
        { "Dataset": "GarmentLab", "Year": "2024", "Scale": "Sim benchmark (20 tasks)", "Garment Types": "Diverse garments", "Annotations": "Language + mesh + task labels", "Availability": "Public (sim)" },
        { "Dataset": "UniFolding", "Year": "2024", "Scale": "1.2K real demos", "Garment Types": "T-shirts, shorts, dresses", "Annotations": "Mesh + fold sequence", "Availability": "Partial release" },
        { "Dataset": "Claru Custom", "Year": "2026", "Scale": "2K-20K+ demos", "Garment Types": "5+ categories", "Annotations": "Full fold pipeline + language", "Availability": "Built to spec" },
      ],
    },
    {
      type: "prose",
      heading: "How Claru Supports Cloth Folding Data",
      paragraphs: [
        "Claru maintains dedicated cloth folding collection stations with bimanual teleoperation rigs (leader-follower ALOHA-style or VR-controlled systems), calibrated multi-camera arrays (overhead RGB-D plus 2 angled side views plus wrist cameras on both arms), and a library of 50+ garments spanning towels, t-shirts, pants, long-sleeve shirts, bed linens, and specialty items (aprons, lab coats, dresses) with documented fabric properties (material composition, weight, stiffness, friction coefficient). Each garment is cataloged with measurements, fabric type, color, and pattern for complete reproducibility.",
        "Our collection protocol enforces structured initial-state randomization using the diversity matrix described above, with real-time tracking of the state distribution to ensure no category is over- or under-represented. Operators are rotated every 2 hours to prevent style-specific overfitting — different operators naturally produce different fold strategies, increasing the behavioral diversity of the dataset. We capture both expert-quality folds (for imitation learning) and intentionally suboptimal folds with recovery sequences (for learning error correction) at a configurable ratio.",
        "Delivered datasets include per-frame cloth coverage percentage, fold line quality metrics (angular deviation and offset from target), grasp point coordinates in 2D and 3D, smoothness scores, fold-type labels, and optional language annotations — all verified through automated consistency checks and 25% human spot-verification. We deliver in RLDS, HDF5, or custom formats with full camera calibration, garment metadata and fabric property catalogs, and stratified splits by garment category, initial state type, and operator. Typical turnaround is 2-4 weeks for 2,000+ demonstration datasets.",
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "avigal-speedfolding-2022", title: "SpeedFolding: Learning Efficient Bimanual Folding of Garments", authors: "Avigal et al.", venue: "IROS 2022", year: 2022, url: "https://arxiv.org/abs/2208.10552" },
        { id: "ha-flingbot-2022", title: "FlingBot: The Unreasonable Effectiveness of Dynamic Manipulation for Cloth Unfolding", authors: "Ha & Song", venue: "CoRL 2022", year: 2022, url: "https://arxiv.org/abs/2105.03655" },
        { id: "canberk-clothfunnels-2023", title: "ClothFunnels: Can Robot Manipulation Be Learned with Fabric Funnels?", authors: "Canberk et al.", venue: "ICRA 2023", year: 2023, url: "https://arxiv.org/abs/2207.11174" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
        { id: "sun-unifolding-2024", title: "UniFolding: Towards Sample-efficient, Scalable, and Generalizable Robotic Garment Folding", authors: "Sun et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2311.01267" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many folding demonstrations are needed per garment category?",
      answer: "For single-garment-type folding with Diffusion Policy, 200-500 demonstrations achieve 80%+ success when the initial state distribution is well-randomized. For a multi-garment system handling towels, t-shirts, and pants, SpeedFolding required 4,300 real demonstrations for 93% success on trained categories. UniFolding showed that garment mesh estimation can reduce this to 1,000-1,200 demonstrations for cross-garment generalization. Foundation model approaches targeting language-conditioned folding across 5+ garment categories typically need 2,000-5,000 demonstrations per category. Start with towels (simplest rectangular geometry) to validate the pipeline, then scale to structured garments. The critical factor is initial-state diversity: 500 demonstrations from diverse starting states outperform 2,000 demonstrations from similar starting states.",
    },
    {
      question: "Why does cloth folding have such a large sim-to-real gap?",
      answer: "Three factors make cloth simulation unreliable for direct policy transfer. First, fabric-on-fabric friction during layered folding is extremely difficult to parameterize accurately — it varies with fabric type, moisture level, static charge buildup, and even the direction of the weave relative to the fold line. Second, dynamic motions (flinging, shaking, snapping) involve air resistance and fabric inertia that simulators approximate with simplified aerodynamic models that miss the complex turbulence patterns created by billowing cloth. Third, the visual appearance of real wrinkled fabric is extremely high-dimensional — lighting interactions with micro-wrinkles create shadows and highlights that even modern renderers struggle to reproduce. Empirically, policies trained purely in simulation achieve 30-50% lower success rates on real cloth than those trained on real demonstrations, even with extensive domain randomization of fabric parameters.",
    },
    {
      question: "What cameras are needed for cloth folding data collection?",
      answer: "Minimum setup is one overhead RGB-D camera (Intel RealSense D435 or similar) for full-table coverage plus one wrist camera per arm for close-up grasp views. For high-quality datasets that support the full range of current research methods, add two angled side cameras at 45 degrees to resolve fabric layer occlusions that the overhead view cannot distinguish — when a shirt is folded, the overhead view shows a flat rectangle, but side cameras reveal whether the layers are aligned or bunched. All cameras should be calibrated to a common coordinate frame and temporally synchronized to within 5 ms. For depth-based methods (FlingBot, ClothFunnels), the overhead depth camera is the primary modality and should be high-resolution (1280x720 minimum) with minimal depth noise on flat surfaces.",
    },
    {
      question: "How should initial cloth states be randomized for diverse training data?",
      answer: "Initial state diversity is the strongest predictor of policy generalization for cloth manipulation. Use a structured randomization matrix: 20% heavy crumple (ball-like, maximum disorder), 20% light crumple (some flat regions visible), 20% partially folded (one or more folds already applied, possibly incorrectly), 20% flat but rotated or offset from center, and 20% draped over table edge or other objects. For garments with structural features, add inside-out states (10% of demonstrations) and partially-inside-out states where only sleeves are inverted. Record the initial state category as metadata for stratified train/test splitting — you want the test set to include unseen initial state configurations to measure true generalization rather than memorization.",
    },
    {
      question: "Can a folding policy trained on one garment category transfer to others?",
      answer: "Transfer between similar categories (e.g., towels to washcloths, or large t-shirts to small t-shirts) works with 50-100 fine-tuning demonstrations because the manipulation strategy is fundamentally the same — rectangular folding sequences for towels, and sleeve-then-body folds for t-shirts. Transfer between dissimilar categories (e.g., towels to long-sleeve shirts, or t-shirts to pants) typically fails without substantial new data because the manipulation strategies differ fundamentally. Shirts require sleeve isolation and fold-along-body-axis sequences that towels never encounter. Pants require leg alignment and crotch-fold management. UniFolding's garment mesh estimation approach achieves the best cross-category transfer by reducing the problem to mesh-level fold planning, but still requires 200-500 demonstrations per new garment type. Multi-category foundation model training is the most promising path to generalization across all garment types, but requires 5-20x more total data than single-category approaches.",
    },
    {
      question: "What fabric properties should be tracked in a cloth folding dataset?",
      answer: "Each garment in the library should have documented properties that affect manipulation: material composition (cotton, polyester, silk, denim, fleece, wool, blends), areal density or weight (grams per square meter — ranges from 100 g/m2 for lightweight cotton to 400+ g/m2 for denim), fabric stiffness (measured by cantilever drape test angle — stiff fabrics hold their shape during manipulation while limp fabrics collapse), coefficient of friction (fabric-on-fabric and fabric-on-table — slippery fabrics like silk require different grasp strategies than high-friction fabrics like fleece), and garment dimensions (shoulder width, body length, sleeve length for structured garments). These properties should be annotated per garment in the metadata so that policies can be evaluated on their ability to generalize across fabric types, not just garment shapes.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Deformable Object Folding Data",
  ctaDescription: "Tell us your target garment categories, fold types, and deployment hardware. We will design a collection plan with the right diversity and annotation depth.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning", "deformable-object"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view (overhead + angled) + wrist cameras + proprioception",
    volumeRange: "2K-20K demonstrations per garment category",
    temporalResolution: "30 Hz video, 50 Hz proprioception, per-frame cloth state",
    keyAnnotations: ["Cloth coverage percentage", "Fold line vectors and quality (angular deviation + offset)", "Grasp point coordinates (2D + 3D)", "Smoothness/wrinkle score", "Garment type and initial state classification", "Fold type labels and language descriptions"],
  },
  relevantModels: ["FlingBot", "SpeedFolding", "ClothFunnels", "DextAIRity", "Diffusion Policy", "ACT/ALOHA", "UniFolding"],
  environmentTypes: ["Laundry folding station", "Retail folding table", "Home environment", "Industrial textile line"],
  keyPapers: [
    { id: "avigal-speedfolding-2022", title: "SpeedFolding: Learning Efficient Bimanual Folding of Garments", authors: "Avigal et al.", venue: "IROS 2022", year: 2022, url: "https://arxiv.org/abs/2208.10552" },
    { id: "ha-flingbot-2022", title: "FlingBot: The Unreasonable Effectiveness of Dynamic Manipulation for Cloth Unfolding", authors: "Ha & Song", venue: "CoRL 2022", year: 2022, url: "https://arxiv.org/abs/2105.03655" },
    { id: "canberk-clothfunnels-2023", title: "ClothFunnels: Can Robot Manipulation Be Learned with Fabric Funnels?", authors: "Canberk et al.", venue: "ICRA 2023", year: 2023, url: "https://arxiv.org/abs/2207.11174" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "sun-unifolding-2024", title: "UniFolding: Towards Sample-efficient, Scalable, and Generalizable Robotic Garment Folding", authors: "Sun et al.", venue: "ICRA 2024", year: 2024, url: "https://arxiv.org/abs/2311.01267" },
  ],
  claruRelevance: "Claru maintains dedicated cloth folding collection stations with bimanual teleoperation rigs, calibrated multi-camera arrays (overhead RGB-D plus 2 angled side views plus wrist cameras), and a library of 50+ garments spanning towels, t-shirts, pants, long-sleeve shirts, bed linens, and specialty items with documented fabric properties (material, weight, stiffness, friction). Our collection protocol enforces structured initial-state randomization using a diversity matrix tracked in real time, with operator rotation every 2 hours for maximum behavioral diversity. Annotations include per-frame cloth coverage, fold line quality metrics, grasp coordinates, smoothness scores, fold-type labels, and optional language descriptions — all verified through automated consistency checks and 25% human spot-verification. We deliver in RLDS, HDF5, or custom formats with full camera calibration, garment metadata with fabric property catalogs, and stratified splits by garment category, initial state type, and operator. Typical turnaround is 2-4 weeks for 2,000+ demonstration datasets.",
};

export default data;
