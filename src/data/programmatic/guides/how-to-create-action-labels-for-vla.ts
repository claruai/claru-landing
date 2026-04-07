import type { GuidePageData } from "../types";

const data: GuidePageData = {
  slug: "how-to-create-action-labels-for-vla",
  metaTitle: "How to Create Action Labels for VLA Models (2026 Guide) | Claru",
  metaDescription: "Guide to extracting, formatting, and validating action labels from teleoperation logs for VLA model training, covering coordinate frames, tokenization, and RLDS packaging.",
  primaryKeyword: "how to create action labels for VLA",
  secondaryKeywords: ["VLA action labeling","action label creation","robot action annotation","vision language action data","VLA training data preparation"],
  canonicalPath: "/guides/how-to-create-action-labels-for-vla",
  h1: "How to Create Action Labels for VLA Model Training",
  heroSubtitle: "Technical guide to extracting, formatting, and validating action labels from teleoperation data for training Vision-Language-Action models like RT-2, Octo, and OpenVLA.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: "Create Action Labels for VLA Model Training", href: "/guides/how-to-create-action-labels-for-vla" },
  ],
  sections: [],
  faqs: [
    {
      question: "What action representation do VLA models expect?",
      answer: "Most VLA models use 7-dimensional delta end-effector actions: [dx, dy, dz, droll, dpitch, dyaw, gripper] representing the change in end-effector position (meters), orientation (radians or axis-angle), and gripper state (continuous 0-1 or binary open/close). RT-2 tokenizes these continuous values into 256 discrete bins per dimension, so actions are represented as sequences of integer tokens in the language model's vocabulary. Octo uses continuous actions directly with a diffusion head that predicts the full action distribution. OpenVLA follows RT-2's tokenization approach with 256 bins per dimension. The critical detail is the coordinate frame: most VLA models expect actions in the robot's base frame (world-fixed), not the end-effector frame. If your teleoperation system records actions in the EE frame, you must transform them using the current EE orientation at each timestep: action_base = R_ee_to_base @ action_ee. Getting this transform wrong is the single most common cause of VLA fine-tuning failure."
    },
    {
      question: "How do I add language instructions to existing robot datasets?",
      answer: "VLA models require a natural language instruction paired with each episode. For existing datasets without language, there are three approaches. (1) Manual annotation: have human annotators watch episode videos and write free-form instructions. This produces the highest quality but costs $0.10-0.50 per episode at scale. Use multiple annotators (2-3 per episode) and take the most specific instruction. (2) Template-based generation: if your episodes have task metadata (task_id, object_name, target_location), generate instructions from templates like 'Pick up the {object} and place it on the {target}.' Vary templates to avoid repetition — at least 10 templates per task type. (3) VLM captioning: run a vision-language model (GPT-4V, Gemini Pro Vision) on the first and last frames of each episode with a prompt like 'Describe the manipulation task shown in these before/after images in one imperative sentence.' This costs ~$0.005 per episode and produces decent quality for common tasks, but hallucinate on unusual setups. Regardless of method, validate language annotations by checking that similar episodes receive similar instructions and different tasks receive distinct instructions."
    },
    {
      question: "How should I handle gripper actions for VLA models?",
      answer: "Gripper representation varies across VLA architectures and getting it wrong causes disproportionate performance degradation. RT-2 uses a continuous gripper value in [0, 1] that is tokenized into 256 bins alongside the other action dimensions. Octo uses a binary gripper command (open/close) as an additional action dimension. OpenVLA follows RT-2's continuous convention. If your raw data records gripper width (e.g., 0-0.08m for a Franka gripper), normalize to [0, 1] where 0 = fully closed and 1 = fully open. If your raw data records binary gripper commands, keep them binary but embed them in the same action vector. The key issue is gripper timing: in teleoperation data, gripper close commands often precede the actual grasp by 2-5 timesteps due to actuator delay. If your model sees 'close gripper' followed by several frames of open gripper (while it is closing), it learns a noisy gripper signal. Solution: post-process gripper commands to align with actual contact detection, or use a low-pass filter (Butterworth, order 2, cutoff 2 Hz) on the gripper width signal to smooth the transition."
    },
    {
      question: "What is action tokenization and how do I implement it for VLA training?",
      answer: "Action tokenization converts continuous robot actions into discrete tokens that a language model can predict as part of its vocabulary. RT-2 introduced this approach: each action dimension is independently binned into 256 uniform intervals spanning the dimension's range, then mapped to dedicated token IDs in the language model's vocabulary. For a 7-DoF action, this produces a sequence of 7 tokens per timestep. Implementation: (1) Compute the min and max for each action dimension across the training set (use 1st and 99th percentiles for robustness to outliers). (2) For each action value a_d in dimension d, compute bin = floor(255 * (a_d - min_d) / (max_d - min_d)), clamped to [0, 255]. (3) Map bin indices to token IDs by adding a base offset (e.g., if your tokenizer vocabulary ends at token 32000, map bin 0 to token 32001, bin 1 to 32002, etc.). Store the bin boundaries (min_d, max_d for each dimension) as part of the model configuration — they are needed to detokenize predicted tokens back to continuous actions during inference. OpenVLA provides a reference implementation in its action_tokenizer.py module."
    },
    {
      question: "How many language-annotated episodes do I need for VLA fine-tuning?",
      answer: "This depends heavily on whether you are fine-tuning from a pretrained VLA or training from scratch. For fine-tuning Octo or OpenVLA on a new robot embodiment or task domain: 50-200 high-quality episodes per task are typically sufficient because the pretrained model already understands visual features and general manipulation concepts. The episodes must match the pretrained model's observation format (image resolution, camera viewpoint) and action space (delta EE, same normalization convention). For fine-tuning RT-2 (or its open-weight analogs): 200-1,000 episodes per task, because the VLM backbone is larger and needs more domain-specific data to shift its predictions. For training a VLA from scratch (rare outside large labs): 50,000+ episodes across diverse tasks and environments, following the scale of the Open X-Embodiment dataset (800K+ episodes). In all cases, language instruction quality matters more than quantity — 100 episodes with detailed, specific instructions ('pick up the red mug from the left side of the counter and place it in the sink') outperform 500 episodes with generic instructions ('do the task')."
    }
  ],
  ctaHeading: "Need Action Labels for VLA Training?",
  ctaDescription: "Claru creates VLA-ready datasets with properly formatted actions, language annotations, and RLDS packaging. We handle the full pipeline from raw teleoperation logs to training-ready data.",
  relatedGlossaryTerms: ["vla","action-space","behavioral-cloning","teleoperation-data"],
  relatedGuidePages: ["how-to-collect-teleoperation-data","how-to-convert-data-to-rlds-format"],
  relatedSolutionSlugs: ["vla-training-data"],
  difficulty: "advanced",
  estimatedTime: "1-2 weeks",
  prerequisites: ["Teleoperation data with joint states and end-effector poses","Understanding of target VLA architecture (RT-2, Octo, or OpenVLA)","Python 3.10+ with NumPy, scipy, and transforms3d","ROS bag reader or HDF5 access for source data"],
  tools: ["Python","NumPy","scipy","transforms3d","RLDS","TensorFlow Datasets","h5py","rosbags"],
  steps: [
    {
      stepNumber: 1,
      title: "Audit Source Data and Identify the Raw Action Signal",
      description: "VLA action labels are derived from the raw robot state recorded during teleoperation. Start by understanding exactly what your source data contains. Open representative episodes and enumerate every state-related field: joint positions (N-DoF, radians or degrees?), joint velocities, joint torques/efforts, end-effector pose (position + orientation — what convention? Euler angles, quaternion, rotation matrix?), end-effector velocity, gripper state (continuous width or binary command?), and any commanded vs. actual state pairs.\n\nThe most important audit question is: does your data contain the commanded action (what the teleoperator intended) or the executed state (what the robot actually did)? These differ due to controller tracking error, safety limits, and actuator dynamics. For VLA training, you want the executed delta between consecutive states, not the teleoperator's raw command. The executed delta is computed as: action[t] = ee_pose[t+1] - ee_pose[t] for position, and the relative rotation from orientation[t] to orientation[t+1] for orientation. This is because at inference time, the model predicts the action, the robot executes it imperfectly, and the next observation reflects the actual state — training on executed deltas matches this inference-time behavior.\n\nDocument the coordinate frame chain: what frame is the EE pose expressed in (robot base? world? tool center point?), what is the up direction (Z-up or Y-up?), and what is the handedness (right-hand or left-hand coordinate system?). Most VLA models expect Z-up, right-handed, robot base frame. If your data uses a different convention, you will need a fixed transform.",
      tools: ["h5py", "rosbags", "Python REPL", "transforms3d"],
      tips: ["Plot 10 episodes' EE trajectories in 3D (matplotlib mplot3d) to visually verify the coordinate frame matches your expectation — a trajectory that goes 'down' when the robot reaches forward indicates an axis swap"]
    },
    {
      stepNumber: 2,
      title: "Extract Delta End-Effector Actions",
      description: "Compute the per-timestep delta EE actions that VLA models consume. For each consecutive pair of timesteps (t, t+1) in an episode:\n\nPosition delta: dp = position[t+1] - position[t], yielding [dx, dy, dz] in meters. For orientation delta: compute the relative rotation R_delta = R[t+1] @ R[t].T (where R[t] is the 3x3 rotation matrix at timestep t), then convert R_delta to the target representation. RT-2 and Octo use axis-angle representation: use transforms3d.axangles.mat2axangle(R_delta) to get the axis and angle, then represent as [angle*axis_x, angle*axis_y, angle*axis_z]. OpenVLA uses Euler angles in extrinsic XYZ convention: use transforms3d.euler.mat2euler(R_delta, 'sxyz'). The choice of orientation representation matters significantly — axis-angle is more numerically stable for small rotations (common in manipulation) because Euler angles have gimbal lock singularities.\n\nGripper delta: compute the change in gripper width or keep the absolute gripper state, depending on your target model. RT-2 uses absolute gripper state (0 = closed, 1 = open), while some Octo configurations use delta gripper. Check your target model's data loading code to confirm.\n\nAssemble the action vector for each timestep: action[t] = [dx, dy, dz, droll, dpitch, dyaw, gripper] with shape (7,). Handle the last timestep of each episode specially — there is no t+1, so either duplicate the final action or set it to zeros and mark it with is_last=True in the RLDS metadata. Verify the extraction by reconstructing the EE trajectory from the initial pose and the cumulative sum of delta actions: reconstructed_pos[t] = initial_pos + sum(dp[0:t]). The reconstruction error should be below 1mm for position and 0.01 radians for orientation.",
      tools: ["NumPy", "transforms3d", "scipy.spatial.transform.Rotation"],
      tips: ["Use scipy.spatial.transform.Rotation.from_matrix() and .as_rotvec() as an alternative to transforms3d — it handles edge cases (180-degree rotations) more robustly"]
    },
    {
      stepNumber: 3,
      title: "Add Language Instructions to Each Episode",
      description: "VLA models are conditioned on natural language task instructions. Every episode in your dataset needs a language_instruction string. The quality and specificity of these instructions directly impacts model performance.\n\nFor new data collection, capture language instructions during recording by having the teleoperator (or a separate annotator) speak or type the instruction before each episode begins. Use a structured template that includes the verb, object, and goal location: 'pick up the [object] from [source] and place it [target]', 'push the [object] to the [direction]', 'open the [container] and retrieve the [item]'. Record at least 3 paraphrased instructions per task variant to teach the model that different phrasings map to the same behavior.\n\nFor existing datasets without language annotations, implement a three-tier annotation pipeline. Tier 1 — automated template fill: if your episodes have structured task metadata (task_type, object_id, target_zone), generate instructions from a template library with randomized phrasing. Maintain a pool of 20+ templates per task type to ensure variety: 'pick up the {obj}', 'grab the {obj} and lift it', 'move the {obj} to {target}', etc. Tier 2 — VLM captioning: for episodes without structured metadata, run GPT-4o or Gemini 2.0 Flash on the first frame, a mid-episode frame, and the final frame with the prompt: 'These three frames show a robot performing a manipulation task. Describe what the robot does in one imperative sentence starting with a verb.' Review a 10% sample for accuracy. Tier 3 — human verification: have annotators review and correct the VLM-generated instructions for a random 20% sample, then use the correction rate to estimate overall quality. If the correction rate exceeds 15%, re-run Tier 2 with a refined prompt or fall back to full manual annotation.\n\nStore the language instruction as a string field at the episode level (not per-timestep) — the same instruction applies to every step within an episode.",
      tools: ["GPT-4o API or Gemini API", "Label Studio (for human annotation)", "Python string templates"],
      tips: ["Avoid overly generic instructions like 'complete the task' — VLA models learn to ground specific nouns and spatial references in their visual encoder, which requires descriptive instructions"]
    },
    {
      stepNumber: 4,
      title: "Normalize Actions and Implement Tokenization",
      description: "Normalize the action labels and optionally tokenize them for models that use discrete action tokens (RT-2, OpenVLA). The normalization strategy depends on your target architecture.\n\nFor Octo (continuous actions with diffusion head): compute per-dimension statistics across the training split: mean, std, min, max, 1st percentile, and 99th percentile. Apply z-score normalization: action_norm = (action - mean) / std. Clip to [-5, 5] to bound extreme outliers. Store the statistics as a JSON file that the model loads at training and inference time.\n\nFor RT-2 and OpenVLA (tokenized actions): implement uniform binning. For each dimension d: (1) Compute min_d and max_d as the 1st and 99th percentiles of all action values in dimension d across the training set. (2) For each action value a: bin_index = clamp(floor(255 * (a - min_d) / (max_d - min_d)), 0, 255). (3) Map bin_index to a token ID by adding the action token base offset. The OpenVLA codebase uses token IDs 32000-32255 for the first action dimension, 32256-32511 for the second, and so on. Store the bin edges (min_d, max_d per dimension) alongside the model checkpoint. At inference time, the model predicts token IDs which are detokenized back to continuous actions via: a = min_d + (bin_index + 0.5) * (max_d - min_d) / 256, where the +0.5 maps to the bin center.\n\nValidation: after tokenization, detokenize all training actions and compute the reconstruction error against the original continuous actions. The maximum per-dimension error should be (max_d - min_d) / 512 (half a bin width). If any dimension has a large range but low variance (e.g., the Z action for tabletop tasks where most actions are in-plane), consider using non-uniform binning (log-scale or learned quantization) to allocate more bins to the high-density region.",
      tools: ["NumPy", "JSON", "OpenVLA action_tokenizer.py as reference"],
      tips: ["Always verify tokenization round-trips correctly before building the full dataset — a 1-indexed vs. 0-indexed bin bug silently shifts all predicted actions by one bin width"]
    },
    {
      stepNumber: 5,
      title: "Assemble the Complete VLA Training Dataset",
      description: "Package the observations, normalized/tokenized actions, and language instructions into the format your target VLA expects. For Octo and OpenVLA, this is RLDS format via TensorFlow Datasets. For custom VLA architectures, it may be HDF5 or a PyTorch dataset.\n\nFor RLDS: implement a DatasetBuilder where each example represents one episode. The features_dict should include: steps as a tfds.features.Dataset containing observation (image: tfds.features.Image(shape=(256,256,3)), state: Tensor for proprioception), action (Tensor of shape (7,) for continuous or (7,) of int32 for tokenized), reward (float32, set to 0.0 if not applicable), is_first (bool), is_last (bool), is_terminal (bool), and language_instruction (tfds.features.Text at the episode level, repeated or broadcast to each step depending on the model's expectation).\n\nThe image observation must match the pretrained model's expected resolution and camera viewpoint. Octo was pretrained with 256x256 images from a third-person shoulder camera. OpenVLA expects 224x224 images. If your data has multiple camera views, select the one closest to the pretrained model's training distribution — typically a fixed external camera with a top-down or 45-degree angle. Resize images using Lanczos interpolation (PIL.Image.resize with LANCZOS filter) to avoid aliasing artifacts. If your camera has a significantly different field of view than the training data, center-crop before resizing rather than distorting the aspect ratio.\n\nBuild the dataset and verify by loading 50 episodes through the target model's standard data pipeline (Octo uses a custom DataLoader in its training script, OpenVLA uses a TFDS-based pipeline). Run the model's data preprocessing code on your data and verify that output tensor shapes match expectations. If the model's training code applies any internal normalization or augmentation, ensure it does not conflict with your preprocessing.",
      tools: ["tensorflow-datasets", "PIL/Pillow", "RLDS", "h5py"],
      tips: ["When in doubt about image resolution or normalization, read the model's dataset loading code, not the paper — preprocessing details are frequently omitted or simplified in publications"]
    },
    {
      stepNumber: 6,
      title: "Validate with a Fine-Tuning Smoke Test",
      description: "The ground truth validation for VLA action labels is a fine-tuning experiment. Run a minimal fine-tuning job on your dataset using the target VLA model to verify that the action labels are correct and the model can learn from them.\n\nFor OpenVLA: clone the openvla repository, configure a fine-tuning run on your RLDS dataset with reduced hyperparameters (1-2 epochs, batch size 8, learning rate 2e-5, LoRA rank 32 for memory efficiency). On a single A100 GPU, this takes approximately 2-4 hours for a 200-episode dataset. Monitor the action token prediction loss — it should decrease smoothly over the first epoch and plateau. If the loss oscillates or diverges, the most likely causes are: incorrect action tokenization (bin boundaries mismatch), wrong coordinate frame (actions in EE frame instead of base frame), or temporal misalignment (action at timestep t does not correspond to the transition from observation t to observation t+1).\n\nFor Octo: use the official fine-tuning script with your RLDS dataset. Octo's diffusion head outputs continuous actions, so monitor the MSE loss instead of cross-entropy. A smoothly decreasing MSE loss that plateaus around 0.01-0.05 (in normalized action space) indicates correct data formatting.\n\nAfter training, run inference on 20 held-out episodes. For each episode, feed the observation and language instruction to the model and compare the predicted action to the ground truth. Compute per-dimension correlation between predicted and ground truth actions — correlation should exceed 0.5 for position dimensions and 0.3 for orientation dimensions even after minimal fine-tuning. If position prediction is accurate but orientation is random, the orientation representation or coordinate frame is likely wrong. If the gripper dimension is always predicted as 0 or 1 (never intermediate values), the gripper normalization may need adjustment. Visualize 5 episodes by rendering the predicted vs. ground truth action trajectories as arrows overlaid on the image observations — this visual check is the most reliable way to catch coordinate frame issues.",
      tools: ["OpenVLA fine-tuning codebase", "Octo fine-tuning script", "A100 GPU (or equivalent)", "wandb"],
      tips: ["If you see correct position predictions but flipped orientation (e.g., the model rotates clockwise when it should rotate counterclockwise), check for a quaternion convention mismatch — Hamilton vs. JPL conventions differ in sign"]
    }
  ],
  keyPapers: [
    {
      id: "brohan-rt2-2023",
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: "Brohan et al.",
      venue: "CoRL 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2307.15818"
    },
    {
      id: "kim-openvla-2024",
      title: "OpenVLA: An Open-Source Vision-Language-Action Model",
      authors: "Kim et al.",
      venue: "arXiv 2406.09246",
      year: 2024,
      url: "https://arxiv.org/abs/2406.09246"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "RSS 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213"
    },
    {
      id: "open-x-embodiment-2024",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Open X-Embodiment Collaboration",
      venue: "ICRA 2024",
      year: 2024,
      url: "https://arxiv.org/abs/2310.08864"
    }
  ],
  claruRelevance: "Claru creates VLA-ready training datasets with properly formatted action labels, language annotations, and RLDS packaging. We handle the full pipeline — from raw teleoperation log extraction through coordinate frame alignment, action tokenization, language instruction annotation, and validation with fine-tuning smoke tests — ensuring your data works out of the box with RT-2, Octo, OpenVLA, and custom VLA architectures.",
};

export default data;
