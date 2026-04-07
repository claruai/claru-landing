import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "action-space",
  termSlug: "action-space",
  category: "robotics-fundamentals",
  metaTitle: "Action Space in Robotics — Definition & Design Choices | Claru",
  metaDescription: "A robot's action space defines the set of all possible commands it can execute at each timestep. Learn how action space design — continuous vs. discrete, joint vs. Cartesian, absolute vs. delta — determines data requirements and policy performance.",
  primaryKeyword: "action space robotics",
  secondaryKeywords: ["robot action space", "control space", "action representation", "action dimensionality", "delta action space"],
  canonicalPath: "/glossary/action-space",
  h1: "Action Space: How Action Representation Design Shapes Robot Learning",
  heroSubtitle: "The action space defines every possible command a robot can execute at each control step. In robot learning, the choice between joint-space and Cartesian actions, absolute and relative commands, and continuous and discrete representations fundamentally determines how much data a policy needs and how well it generalizes across embodiments.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Action Space", href: "/glossary/action-space" },
  ],
  sections: [],
  faqs: [
    {
      question: "What is the difference between joint-space and Cartesian action spaces?",
      answer: "Joint-space actions directly specify target positions or velocities for each motor — for a 7-DOF arm, this is a 7-dimensional vector of joint angles or angular velocities. Cartesian (also called task-space or end-effector) actions specify the desired position and orientation of the robot's end-effector in 3D space, typically as a 6D or 7D vector (xyz translation + rotation). Joint-space actions are lower-level and embodiment-specific: a policy trained on joint actions for a Franka Panda cannot transfer to a UR5 because the joint configurations differ entirely. Cartesian actions enable cross-embodiment transfer because different robots share the same end-effector workspace. However, Cartesian actions require an inverse kinematics solver to convert end-effector targets into motor commands, which can introduce singularities and joint-limit violations. Most modern VLA models like RT-2 and OpenVLA use Cartesian delta actions for exactly this transferability reason.",
    },
    {
      question: "Why do most robot learning papers use delta (relative) actions instead of absolute actions?",
      answer: "Delta actions specify the change from the current state (e.g., 'move 2cm right') rather than an absolute target (e.g., 'go to position [0.5, 0.3, 0.2]'). Delta actions are preferred for three reasons. First, they are more robust to calibration errors — if the robot's coordinate frame has a small offset, delta actions still produce the correct relative motion. Second, delta actions make the policy's output distribution more compact and centered around zero, which is easier for neural networks to learn. Third, delta actions generalize better across starting positions: a trained policy can perform the same task from different initial configurations. The Open X-Embodiment dataset standardizes on Cartesian delta actions (7D: 3D translation delta + 3D rotation delta + 1D gripper) for exactly these benefits. The main drawback is that delta actions can accumulate drift over long horizons if each step has small prediction errors.",
    },
    {
      question: "How does action space dimensionality affect the amount of training data needed?",
      answer: "Higher-dimensional action spaces require exponentially more data to cover the space adequately — a phenomenon related to the curse of dimensionality. A 7-DOF arm with joint-space actions has a 7D action space, while adding a multi-finger hand with 16 joints creates a 23D space. Empirically, doubling action dimensionality roughly requires 3-5x more demonstrations to achieve equivalent policy performance. This is why many teams reduce dimensionality through action abstractions: using Cartesian end-effector commands (6-7D) instead of full joint commands (7-23D), discretizing continuous actions into bins, or learning in a latent action space. The ACT model (Zhao et al., 2023) uses a CVAE to learn a compressed latent action representation, achieving strong bimanual manipulation results with only 50 demonstrations despite controlling 14 joints.",
    },
    {
      question: "Should training data include action labels at the same frequency as robot control?",
      answer: "Not necessarily. Robot control typically runs at 100-1000 Hz, but action labels in training data are commonly recorded at 10-50 Hz. Higher frequencies create larger datasets with highly correlated consecutive actions, increasing storage and training cost without proportional benefit. The key consideration is that the action recording frequency must be high enough to capture the fastest relevant motions. For pick-and-place tasks, 10 Hz suffices. For contact-rich tasks like insertion or wiping, 20-50 Hz may be necessary to capture the fine-grained force-modulation dynamics. Many teams record at the full control frequency and then downsample during data preprocessing, allowing flexibility to experiment with different temporal resolutions.",
    },
    {
      question: "Can you mix different action space representations in the same training dataset?",
      answer: "Yes, but it requires careful normalization and alignment. The Open X-Embodiment dataset combines data from 22 different robot embodiments with different native action spaces — some recorded in joint space, others in Cartesian space, with varying coordinate conventions and control frequencies. The standard approach is to define a canonical action format (typically 7D Cartesian delta: dx, dy, dz, droll, dpitch, dyaw, gripper) and convert all data to this format during preprocessing. Actions are then normalized to zero mean and unit variance per dimension. This normalization is critical — without it, the model would see wildly different action magnitudes from different robots and fail to learn a coherent policy. Teams should also include an embodiment token or embedding so the model can condition its predictions on which robot is being controlled.",
    },
  ],
  ctaHeading: "Need Robot Demonstration Data with Clean Action Labels?",
  ctaDescription: "Claru delivers teleoperation datasets with standardized action representations in your target format. Tell us your robot platform and we will match the action space.",
  relatedGlossaryTerms: ["vla", "behavioral-cloning", "manipulation-trajectory", "proprioceptive-data"],
  relatedGuidePages: ["how-to-create-action-labels-for-vla"],
  relatedSolutionSlugs: ["manipulation-trajectory-data"],
  longDefinition: "The action space of a robot defines the complete set of commands it can execute at each control timestep. Formally, at each time t the policy selects an action a_t from an action space A, which may be continuous (A is a subset of R^n), discrete (A is a finite set), or a hybrid of both. The dimensionality, parameterization, and coordinate frame of the action space are among the most consequential design decisions in a robot learning pipeline — they directly determine how much data is needed, how well policies transfer, and what tasks the robot can perform.\n\nFor manipulation, the most common action representations are: (1) Joint position targets — a vector of desired joint angles, typically 6-7D for a single arm; (2) Joint velocity commands — angular velocity targets for each joint; (3) Cartesian position targets — desired end-effector pose in world or body frame, typically 6D (position + orientation) or 7D (adding gripper); (4) Cartesian delta commands — incremental changes to end-effector pose, the current standard for VLA models. Each representation implies different data collection requirements: joint-space data is recorded directly from encoders, while Cartesian data requires forward kinematics computation from joint readings.\n\nAction space design also encompasses temporal chunking. Rather than predicting a single action per timestep, modern architectures like ACT (Zhao et al., 2023) and Diffusion Policy (Chi et al., 2023) predict action chunks — sequences of 8-32 future actions. This effectively extends the action space from R^n to R^(n*K) where K is the chunk length, but the additional structure dramatically improves temporal coherence and reduces compounding error. The tradeoff is that longer chunks commit the robot to a longer open-loop trajectory before re-planning.\n\nThe gripper action is a special case. Most two-finger grippers are controlled with a single scalar (open/close position or binary open/close), making the total action space 7D or 8D for a single arm. Multi-finger hands like the Allegro Hand or Shadow Hand have 16-24 independent joints, creating action spaces of 22-30 dimensions. This high dimensionality is the primary reason dexterous manipulation requires significantly more training data than parallel-gripper manipulation, and why dimensionality reduction through learned latent actions is an active area of research.",
  historicalContext: "The concept of action spaces in robot control predates machine learning. Classical control theory formalized the distinction between configuration space (joint angles) and task space (end-effector pose) in the 1960s-70s, with Denavit-Hartenberg parameters (1955) providing the standard kinematic chain representation. Whitney (1969) introduced resolved-rate control, which maps Cartesian velocity commands to joint velocities through the Jacobian matrix — the mathematical foundation for Cartesian action spaces used in modern robot learning.\n\nEarly robot learning work in the 1990s-2000s largely used joint-space actions because they mapped directly to motor commands without requiring inverse kinematics. Atkeson and Schaal (1997) trained joint-space policies for a 7-DOF arm. Peters and Schaal (2008) formalized the relationship between action space parameterization and learning efficiency in the context of policy gradient methods.\n\nThe shift toward Cartesian action spaces accelerated with deep learning. Levine et al. (2016) used Cartesian end-effector velocities for visuomotor policy learning, demonstrating that task-space actions simplified the learning problem. The Open X-Embodiment project (2023) cemented Cartesian delta actions as the community standard by defining a canonical 7D action format across 22 robot embodiments. This standardization enabled the first large-scale cross-embodiment policy training, where a single model controls different robots by operating in a shared action space. More recently, action tokenization — discretizing continuous actions into a vocabulary of tokens — has emerged through VLA models like RT-2 (Brohan et al., 2023), which bin each action dimension into 256 discrete values, treating robot control as a sequence-to-sequence problem analogous to language generation.",
  practicalImplications: "For teams collecting robot demonstration data, action space design should be settled before the first demonstration is recorded, as it is difficult to convert between fundamentally different representations after collection. The recommended approach is to record raw joint positions and end-effector poses at the highest available frequency (typically the robot's control frequency of 100-1000 Hz), then derive the target action representation during preprocessing. This preserves maximum flexibility for downstream experiments.\n\nNormalization is essential. Different action dimensions may span vastly different ranges — translation deltas might be on the order of 1-10mm while rotation deltas are 0.01-0.1 radians. Without per-dimension normalization (typically zero mean, unit variance computed over the training set), the policy will preferentially attend to high-magnitude dimensions. The normalization statistics must be saved and applied identically at inference time.\n\nFor cross-embodiment datasets, the action space serves as the alignment layer between different robots. The standard practice, established by Open X-Embodiment, is to convert all demonstrations to a canonical 7D Cartesian delta format with consistent axis conventions (x-forward, y-left, z-up in body frame). Rotation representations matter: quaternions avoid gimbal lock but have a double-cover issue; rotation matrices are over-parameterized but smooth; axis-angle and 6D rotation representations (Zhou et al., 2019) offer good tradeoffs for neural network learning.\n\nAction chunking length is a hyperparameter that must be tuned per task. Short chunks (4-8 steps) allow reactive corrections but may produce jerky motion. Long chunks (32-64 steps) produce smooth trajectories but cannot adapt to unexpected perturbations. A practical starting point is 16-step chunks at 10 Hz control, yielding 1.6-second action commitments — long enough for smooth motion but short enough to recover from moderate disturbances.",
  commonMisconceptions: [
    {
      misconception: "Joint-space actions are always better because they avoid inverse kinematics errors.",
      correction: "While joint-space actions avoid IK computation, they create embodiment-specific policies that cannot transfer between robots. For single-robot deployments, joint-space can work well. But for any scenario requiring cross-embodiment generalization, Cartesian actions are necessary. Modern IK solvers (e.g., relaxed IK, TracIK) resolve joint targets reliably at 1000+ Hz, and the transfer benefits of Cartesian actions far outweigh the marginal IK computation cost. The Open X-Embodiment project demonstrated that cross-embodiment training in Cartesian space improves performance even on the source robot, due to the regularization effect of multi-robot training.",
    },
    {
      misconception: "Discretizing the action space always hurts performance compared to continuous actions.",
      correction: "RT-2 (Brohan et al., 2023) achieved state-of-the-art manipulation performance by discretizing each action dimension into 256 bins and treating control as a token prediction problem. Discretization enables the use of powerful autoregressive language model architectures and avoids the mode-averaging problem of continuous regression. The key is resolution: 256 bins per dimension provides sub-millimeter precision for typical workspace ranges. Coarse discretization (e.g., 8-16 bins) does hurt performance, but fine discretization is competitive with or superior to continuous action regression for most manipulation tasks.",
    },
    {
      misconception: "A higher control frequency always produces better policies because the data captures finer details.",
      correction: "Beyond a task-specific threshold, higher control frequencies add redundant, highly correlated datapoints that increase training cost without improving policy quality. For pick-and-place, 10 Hz captures all relevant dynamics. For contact-rich tasks, 20-50 Hz is sufficient. Recording at 500 Hz creates 25-50x more data per demonstration with negligible additional information content. The practical approach is to record at the robot's native control frequency and downsample to 10-50 Hz during preprocessing, which also serves as a low-pass filter that removes high-frequency sensor noise.",
    },
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818",
    },
    {
      id: "oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864",
    },
    {
      id: "zhao-act-2023",
      title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
      authors: "Zhao et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2304.13705",
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137",
    },
    {
      id: "zhou-rotation-2019",
      title: "On the Continuity of Rotation Representations in Neural Networks",
      authors: "Zhou et al.",
      venue: "CVPR 2019",
      year: 2019,
      url: "https://arxiv.org/abs/1812.07035",
    },
  ],
  claruRelevance: "Claru delivers demonstration datasets with action labels in the exact format each team's training pipeline requires. All demonstrations are recorded with raw joint encoder readings and end-effector poses at the robot's native control frequency, then converted to the client's target action space — whether that is 7D Cartesian delta for VLA training, joint-space position targets for single-robot policies, or discretized action tokens for language-model-based architectures.\n\nOur standardized data schema includes per-dimension normalization statistics, coordinate frame conventions, and action frequency metadata so that datasets plug directly into training scripts without manual alignment. For teams building cross-embodiment models, Claru provides data from multiple robot platforms (Franka, UR5, xArm, ALOHA) pre-aligned to the Open X-Embodiment canonical action format, enabling multi-robot training from a single unified dataset.",
};

export default data;
