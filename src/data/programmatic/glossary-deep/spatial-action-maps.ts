import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "spatial-action-maps",
  termSlug: "spatial-action-maps",
  category: "robotics-fundamentals",
  metaTitle: "Spatial Action Maps — Definition & Training Data | Claru",
  metaDescription: "Spatial action maps represent robot policies as per-pixel action predictions over an image, enabling sample-efficient learning for manipulation and navigation. Learn methods, data needs, and key papers.",
  primaryKeyword: "spatial action maps",
  secondaryKeywords: ["action heatmap", "spatial policy", "pixel-wise action", "transporter networks", "dense action prediction", "spatial affordance map"],
  canonicalPath: "/glossary/spatial-action-maps",
  h1: "Spatial Action Maps: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Spatial action maps represent robot control policies as dense, pixel-aligned action predictions over an image observation. Instead of predicting a single action vector, the policy outputs a spatial map where each pixel encodes the value or likelihood of executing an action at that location. This page covers the architecture, training data requirements, advantages over vector-based policies, and applications in manipulation and navigation.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Spatial Action Maps", href: "/glossary/spatial-action-maps" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is a spatial action map in robot learning?",
      answer: "A spatial action map is a policy representation where the robot's action is encoded as a dense map over the image observation space. For a top-down manipulation task, the spatial action map might be a heatmap over the workspace image where the peak value indicates where the robot should place its gripper. The key insight, formalized by Wu et al. (2020), is that many robot tasks have actions that can be expressed as spatial coordinates in the image — where to grasp, where to push, where to navigate. By representing the policy as a per-pixel prediction rather than a single vector output, the model exploits the spatial structure of visual observations, sharing features between nearby pixels and enabling strong generalization from few demonstrations. Transporter Networks (Zeng et al., 2021) extended this idea by producing two spatial maps — a pick map and a place map — enabling precise pick-and-place manipulation from as few as 10 demonstrations.",
    },
    {
      question: "What training data do spatial action map policies require?",
      answer: "Spatial action map policies require demonstrations with actions expressed as pixel coordinates in the observation image. For manipulation tasks, this means top-down or known-viewpoint camera images paired with the pixel location of the robot's action (grasp point, push start point, placement location). The data format is typically (image, action_pixel_x, action_pixel_y) tuples, where the action pixel is projected from the robot's 3D workspace coordinates into image coordinates using known camera intrinsics and extrinsics. A major advantage of spatial action maps is sample efficiency: Transporter Networks achieve strong performance with 1-100 demonstrations per task, compared to thousands needed by vector-based policies. This is because the spatial representation provides strong inductive bias — the model learns local visual features that predict action suitability, and these features generalize across spatial locations within the same image.",
    },
    {
      question: "How do Transporter Networks work?",
      answer: "Transporter Networks (Zeng et al., 2021) are the most widely used spatial action map architecture for manipulation. The network takes an overhead RGB-D image as input and produces two outputs: an attention map (where to pick) and a transport map (where to place, conditioned on the pick location). The attention module is a fully convolutional network that outputs a per-pixel picking score. The transport module crops a local patch around the pick location, rotates it through multiple angles, and cross-correlates it with the full image to find the matching placement location and orientation. This architecture is equivariant to translations and rotations — if the scene is shifted or rotated, the predicted actions shift and rotate correspondingly. Training requires only sparse supervision: for each demonstration, one (pick_pixel, place_pixel, rotation_angle) tuple. The model learns to generalize from this sparse signal because the fully convolutional architecture shares features spatially.",
    },
    {
      question: "What are the limitations of spatial action map representations?",
      answer: "Spatial action maps have three primary limitations. First, they assume a fixed camera viewpoint — the spatial map is defined relative to a specific camera configuration, and changing the viewpoint requires re-collecting demonstrations or learning viewpoint-invariant features. Most implementations use a fixed overhead camera for this reason. Second, they represent actions in 2D image space, which limits their application to tasks where the relevant action dimensions align with the image plane. Tasks requiring precise 3D control (e.g., varying grasp depth, angled insertions) need additional output heads for the non-spatial dimensions. Third, they handle sequential multi-step tasks less naturally than autoregressive policies — each step produces an independent spatial map without explicit memory of previous actions. Extensions like CLIPort (Shridhar et al., 2022) address some limitations by combining spatial action maps with language conditioning for multi-step task specification.",
    },
    {
      question: "How do spatial action maps compare to end-to-end visuomotor policies?",
      answer: "End-to-end visuomotor policies (like those from behavioral cloning or diffusion policy) map observations directly to continuous action vectors in robot joint or end-effector space. Spatial action maps map observations to pixel-space action predictions. The tradeoff is sample efficiency versus generality. Spatial action maps are dramatically more sample-efficient for tasks expressible as spatial actions — Transporter Networks learn from 1-100 demos versus thousands for end-to-end policies. However, end-to-end policies handle arbitrary action spaces (joint torques, velocity commands, multi-DOF actions) while spatial maps are limited to spatially-grounded actions. In practice, many research groups use spatial action maps for high-level task planning (where to interact) combined with end-to-end policies for low-level execution (how to interact at that location). This hierarchical approach leverages the strengths of both representations.",
    },
  ],
  ctaHeading: "Need Training Data for Spatial Action Map Policies?",
  ctaDescription: "Claru provides overhead and multi-view manipulation datasets with pixel-aligned action labels, calibrated camera parameters, and the spatial annotations that Transporter Networks and spatial policy architectures require.",
  relatedGlossaryTerms: ["visuomotor-policy", "semantic-segmentation", "manipulation-trajectory", "scene-understanding"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],

  longDefinition: `Spatial action maps are a policy representation for robot learning in which the model's output is a dense, spatially-aligned map over the visual observation, rather than a single action vector. Each pixel in the output map encodes the value, likelihood, or desirability of executing an action at the corresponding spatial location. The robot selects its action by finding the peak of this spatial map — the pixel location with the highest predicted value — and converting that pixel coordinate into a physical robot action through camera calibration.

This representation was formalized by Wu et al. (2020) in the paper "Spatial Action Maps for Mobile Robot Navigation," which demonstrated that representing navigation policies as per-pixel maps over a top-down view enabled efficient learning of collision avoidance and goal-reaching behaviors. The key insight is that spatial action maps exploit the spatial structure inherent in many robot tasks: the relationship between visual features and action desirability is local and translation-equivariant, meaning a visual pattern that affords grasping in one part of the image also affords grasping when it appears elsewhere.

Transporter Networks (Zeng et al., 2021) extended spatial action maps to manipulation with remarkable sample efficiency. The architecture separates manipulation into two spatial predictions: an attention map identifying where to pick and a transport map identifying where to place. The transport operation uses cross-correlation between a local crop at the pick location and the full image, effectively asking "where in the scene should this local pattern be moved to?" This formulation is inherently equivariant to translations and rotations in the image plane, providing strong inductive bias that enables learning from just 1-100 demonstrations per task.

The data requirements for spatial action map policies differ fundamentally from those of vector-based policies. Each training example consists of an image observation paired with one or more pixel coordinates identifying the action location. For Transporter Networks, each demonstration provides a (pick_pixel, place_pixel, rotation_angle) tuple — far less information per demonstration than the dense trajectory data required by end-to-end visuomotor policies. This sparse supervision format means that demonstrations can be collected more quickly and annotated more simply: a human demonstrator indicates where to pick and where to place, rather than providing continuous joint-space trajectories.

Extensions of the spatial action map concept include CLIPort (Shridhar et al., 2022), which combines the spatial precision of Transporter Networks with the semantic understanding of CLIP language-vision models, enabling language-conditioned spatial manipulation. PerAct (Shridhar et al., 2023) extends spatial action maps to 3D by predicting voxel-level action maps from multi-view observations, overcoming the 2D limitation of image-space spatial maps. These extensions maintain the core principle of representing actions as spatial predictions while adding semantic and geometric capabilities.`,

  historicalContext: `The concept of representing actions in spatial coordinates has roots in the affordance literature from ecological psychology (Gibson, 1979) and computational models of affordances in robotics (Katz et al., 2014). Early work on grasp detection by Saxena et al. (2008) predicted grasp rectangles as spatial outputs over images, which can be viewed as a precursor to spatial action maps.

The direct lineage of modern spatial action maps begins with Form2Fit (Zakka et al., 2020), which used dense per-pixel correspondence predictions for kit assembly tasks, and Wu et al. (2020), who formalized spatial action maps as a general policy representation for mobile robot navigation. These works demonstrated that fully convolutional networks producing spatial outputs achieved better sample efficiency and generalization than networks producing flat action vectors, because the spatial structure provided a powerful inductive bias.

Transporter Networks (Zeng et al., 2021) became the defining architecture for spatial action maps in manipulation. Published at CoRL 2021, the paper showed that the pick-conditioned-place formulation could solve a range of tabletop manipulation tasks from 1-1000 demonstrations, with performance scaling gracefully with data quantity. The architecture's simplicity and effectiveness made it a standard baseline for subsequent manipulation research.

CLIPort (Shridhar et al., 2022) combined Transporter Networks with CLIP embeddings, enabling language-conditioned manipulation — "put the red block on the blue bowl" — by injecting CLIP's semantic features into the spatial prediction pipeline. This work showed that spatial action maps could be conditioned on language instructions without sacrificing their spatial precision.

PerAct (Shridhar et al., 2023) extended spatial action maps to 3D by voxelizing the workspace from multi-view camera inputs and predicting per-voxel action scores. This addressed the fundamental limitation of 2D spatial maps — inability to reason about depth and 3D geometry — while maintaining the benefits of dense spatial prediction. The 3D spatial action map paradigm has since been adopted by several state-of-the-art manipulation systems including RVT and Act3D.`,

  practicalImplications: `For teams building manipulation systems, spatial action maps offer a compelling alternative to end-to-end visuomotor policies when the task structure aligns with spatial action representations. The decision of whether to use spatial action maps depends on three factors: whether actions can be expressed as image-space coordinates, whether a fixed camera viewpoint is acceptable, and whether data efficiency is a priority.

Tasks well-suited to spatial action maps include tabletop pick-and-place (the canonical use case), bin picking, kit assembly, sorting, and any manipulation task where the primary decision is where to interact with the scene. Tasks poorly suited include tasks requiring precise force control, tasks with significant out-of-plane motion, and tasks requiring continuous multi-step trajectories where action history matters.

Data collection for spatial action map policies is straightforward: collect demonstrations with a fixed overhead camera (or known multi-view setup), record the pixel locations where the robot interacts with the scene, and pair each image with its action pixel coordinates. For Transporter Networks, each demonstration is just (image, pick_pixel, place_pixel, rotation_angle). This simplicity means demonstrations can be collected through teleoperation, kinesthetic teaching, or even by annotating still images with click-based pick-place labels — no continuous trajectory recording needed.

Camera calibration is critical for spatial action maps because the policy operates in pixel space but the robot executes in physical space. The camera intrinsic and extrinsic parameters must be precisely known to convert pixel predictions to 3D robot coordinates. Any calibration error maps directly to spatial error in the robot's actions. For production systems, regular recalibration (or learning to predict calibration corrections) is necessary.

Claru provides manipulation datasets with the spatial annotation format required by Transporter Networks and related architectures: overhead and multi-view images with pixel-aligned action coordinates, calibrated camera parameters, and task-specific pick-place annotations. Our data collection protocols capture the fixed-viewpoint imagery and spatial action labels that these architectures require, enabling rapid training of spatial manipulation policies from human demonstrations.`,

  commonMisconceptions: [
    {
      misconception: "Spatial action maps can only handle simple pick-and-place tasks.",
      correction: "While Transporter Networks were initially demonstrated on tabletop pick-and-place, spatial action maps have been extended to complex multi-step tasks (CLIPort), 3D manipulation (PerAct), deformable object manipulation (cloth folding, rope manipulation), and mobile navigation. The key requirement is that the action can be grounded in spatial coordinates — which covers a surprisingly broad range of manipulation and navigation behaviors. Tasks that cannot be expressed spatially, like torque-controlled assembly or in-hand manipulation, genuinely require different policy representations.",
    },
    {
      misconception: "Spatial action maps require overhead cameras and cannot work with eye-in-hand or egocentric viewpoints.",
      correction: "While overhead cameras provide the clearest spatial correspondence between observations and actions, spatial action maps have been adapted to other viewpoints. PerAct uses multi-view cameras to construct 3D voxel grids, eliminating the single-viewpoint constraint. Recent work has also applied spatial action maps to wrist-mounted cameras by learning viewpoint-dependent spatial policies. The fundamental requirement is a known geometric relationship between the image coordinates and the robot's action space, which camera calibration provides for any fixed or trackable viewpoint.",
    },
    {
      misconception: "Spatial action maps are obsolete now that large vision-language-action models exist.",
      correction: "Large VLA models like RT-2 and OpenVLA offer impressive generalization but require orders of magnitude more training data than spatial action map methods. Transporter Networks learn from 10 demonstrations; VLAs need tens of thousands. For teams with limited demonstration budgets, spatial action maps remain the most data-efficient approach for spatially-grounded manipulation tasks. The practical approach for many teams is to use spatial action maps for tasks where they work well (high precision, low data) and VLAs for tasks requiring broad generalization across many tasks and objects.",
    },
  ],

  keyPapers: [
    {
      id: "wu-sam-2020",
      title: "Spatial Action Maps for Mobile Robot Navigation",
      authors: "Wu et al.",
      venue: "ICRA 2020",
      year: 2020,
      url: "https://arxiv.org/abs/2004.02585",
    },
    {
      id: "zeng-transporter-2021",
      title: "Transporter Networks: Rearranging the Visual World for Robotic Manipulation",
      authors: "Zeng et al.",
      venue: "CoRL 2021",
      year: 2021,
      url: "https://arxiv.org/abs/2010.14406",
    },
    {
      id: "shridhar-cliport-2022",
      title: "CLIPort: What and Where Pathways for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2022",
      year: 2022,
      url: "https://arxiv.org/abs/2109.12098",
    },
    {
      id: "shridhar-peract-2023",
      title: "Perceiver-Actor: A Multi-Task Transformer for Robotic Manipulation",
      authors: "Shridhar et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2209.05451",
    },
    {
      id: "goyal-rvt-2023",
      title: "RVT: Robotic View Transformer for 3D Object Manipulation",
      authors: "Goyal et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2306.14896",
    },
  ],

  claruRelevance: `Claru provides manipulation datasets formatted for spatial action map architectures including Transporter Networks, CLIPort, and PerAct. Our data collection protocols capture overhead and multi-view imagery with calibrated camera parameters, pixel-aligned action coordinates, and task-specific pick-place annotations — the exact data format these architectures ingest.

For teams using spatial action maps as part of a hierarchical manipulation system, Claru delivers both the spatial-format data for high-level action selection and the continuous trajectory data for low-level skill execution. Our catalog of 386,000+ annotated clips includes tabletop manipulation scenarios across diverse objects and environments, with the camera calibration metadata and spatial action labels needed for training data-efficient spatial policies. For teams building custom spatial manipulation capabilities, we co-design data collection protocols that match your camera setup, workspace geometry, and task specification.`,
};

export default data;
