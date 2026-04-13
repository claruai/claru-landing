import type { GlossaryDeepPageData } from "../types";

const data: GlossaryDeepPageData = {
  slug: "robot-learning",
  termSlug: "robot-learning",
  category: "robotics-fundamentals",
  metaTitle: "Robot Learning — Definition & Training Data | Claru",
  metaDescription: "Robot learning uses data-driven methods to acquire motor skills, perception capabilities, and decision-making policies. Learn how training data quality determines robot learning success.",
  primaryKeyword: "robot learning",
  secondaryKeywords: ["machine learning robotics", "robot skill learning", "learning-based robotics", "data-driven robotics", "robot policy learning"],
  canonicalPath: "/glossary/robot-learning",
  h1: "Robot Learning: Definition, Applications, and Training Data Requirements",
  heroSubtitle: "Robot learning is the field of acquiring robot capabilities — manipulation skills, navigation strategies, perception abilities, and decision-making policies — from data rather than manual programming. By training on demonstrations, simulations, or trial-and-error experience, robots learn to generalize across objects, environments, and tasks in ways that hand-coded controllers cannot achieve.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: "Robot Learning", href: "/glossary/robot-learning" },
  ],
  sections: [],
  faqs: [
    {
      question: "What are the main paradigms in robot learning?",
      answer: "Robot learning encompasses several paradigms distinguished by their data source and learning signal. Imitation learning (also called learning from demonstration) trains policies on expert demonstrations — a human teleoperates the robot or performs the task while sensors record observations and actions, and the policy learns to replicate this behavior. Reinforcement learning has the robot explore through trial and error, receiving reward signals that shape behavior over thousands or millions of attempts. Self-supervised learning extracts useful representations from unlabeled sensor data (predicting future frames, estimating depth, detecting objects) without task-specific labels. Transfer learning adapts capabilities learned in one domain (simulation, internet data, a different robot) to a target domain. Modern approaches increasingly combine paradigms: pretraining on internet-scale data, fine-tuning with imitation learning on robot demonstrations, and optionally refining with reinforcement learning from human feedback."
    },
    {
      question: "How much training data do robot learning systems typically need?",
      answer: "Data requirements vary dramatically by paradigm and task complexity. Behavioral cloning for a single manipulation skill (pick-and-place, pouring) can succeed with 50-200 high-quality demonstrations. Multi-task policies that generalize across objects and instructions require 1,000-10,000 demonstrations. Foundation models like RT-2 and Octo trained on 100,000-1,000,000+ episodes from diverse robots and tasks. Reinforcement learning in simulation may require millions of episodes but translates to zero real-world demonstrations if sim-to-real transfer succeeds. The quality-quantity tradeoff is steep: 100 expert demonstrations often outperform 1,000 mediocre ones. Data diversity matters as much as volume — demonstrations covering varied objects, configurations, and lighting conditions prevent overfitting to specific training scenarios. The trend toward foundation models is shifting the bottleneck from data quantity to data quality and diversity."
    },
    {
      question: "What is the sim-to-real gap in robot learning?",
      answer: "The sim-to-real gap refers to the performance drop that occurs when a policy trained in simulation is deployed on a real robot. Simulators approximate but cannot perfectly replicate real-world physics (contact dynamics, friction, deformable objects), sensor characteristics (camera noise, depth artifacts, lighting variation), and visual appearance (textures, reflections, shadows). A policy that achieves 95% success rate in simulation may drop to 50-70% on real hardware. Domain randomization — systematically varying simulator parameters (lighting, textures, physics properties, camera positions) during training — is the primary mitigation strategy, forcing policies to learn representations robust to visual and physical variation. Domain adaptation techniques (progressive nets, RCAN) and real-world fine-tuning on a small set of real demonstrations further close the gap. The most reliable approach combines simulation pretraining with real-world fine-tuning data."
    },
    {
      question: "How do foundation models change robot learning data requirements?",
      answer: "Foundation models for robotics — RT-2, Octo, OpenVLA, pi-zero — are pretrained on large-scale internet data (images, text, video) and then fine-tuned on robot-specific data. This changes data requirements in two ways. First, the pretrained visual and language representations provide strong priors about objects, spatial relationships, and physical concepts, reducing the amount of robot-specific data needed for competent performance. RT-2 showed that web-scale pretraining enabled emergent capabilities (reasoning about object categories, following novel instructions) that pure robot data could not provide. Second, foundation models create new data requirements: they need diverse robot demonstrations spanning many tasks, embodiments, and environments to develop generalizable control capabilities. The Open X-Embodiment project demonstrated that mixing data from 22 robot platforms produced better policies than training on any single robot's data alone."
    },
    {
      question: "How does Claru support robot learning with training data?",
      answer: "Claru provides the real-world demonstration data that robot learning systems need for training and fine-tuning. Our 10,000+ data collectors operate across 100+ cities, performing manipulation tasks, navigation scenarios, and human-robot interaction sequences while calibrated sensor rigs capture synchronized observations (RGB, depth, proprioception) and actions. We deliver datasets in RLDS format for cross-embodiment training compatibility, with HDF5 and zarr options for PyTorch pipelines. Each episode includes task annotations, success labels, quality scores, and operator metadata that enable fine-grained data curation. For teams building foundation models, Claru provides the task diversity (hundreds of manipulation skills), environmental diversity (kitchens, workshops, retail, outdoor), and embodiment diversity needed to train generalist policies. For teams fine-tuning on specific tasks, we deliver focused, high-quality demonstration datasets with the precision that behavioral cloning demands."
    }
  ],
  ctaHeading: "Need Training Data for Robot Learning?",
  ctaDescription: "Claru provides expert demonstration data for imitation learning, fine-tuning, and evaluation. Diverse real-world environments, calibrated multimodal capture, RLDS-formatted delivery.",
  relatedGlossaryTerms: ["imitation-learning", "behavioral-cloning", "vla", "diffusion-policy"],
  relatedGuidePages: ["how-to-collect-teleoperation-data"],
  relatedSolutionSlugs: ["teleoperation-data"],
  longDefinition: "Robot learning is the interdisciplinary field concerned with enabling robots to acquire capabilities through data-driven methods rather than explicit programming. It draws on machine learning, control theory, computer vision, and cognitive science to develop algorithms that allow robots to learn manipulation skills, navigation strategies, perceptual abilities, and decision-making policies from experience — whether that experience comes from human demonstrations, simulated environments, real-world trial and error, or combinations thereof.\n\nThe fundamental challenge of robot learning is the gap between the structured, controlled conditions of training and the unstructured, variable conditions of deployment. A robot that learns to pick up cups from a specific tabletop with specific lighting must generalize to different cups, different tables, different lighting, and different background clutter without additional training. This generalization requirement drives the field's data needs: training data must be diverse enough to cover the variation the deployed system will encounter, high-quality enough to provide a clean learning signal, and formatted in a way that the learning algorithm can efficiently consume.\n\nRobot learning paradigms differ primarily in their data source and learning signal. Imitation learning trains on expert demonstrations — observation-action pairs recorded while a human performs the desired task through teleoperation or kinesthetic teaching. The policy learns to map observations to actions by supervised regression (behavioral cloning) or by learning the expert's implicit reward function (inverse RL). Reinforcement learning discovers effective policies through trial-and-error interaction with the environment, guided by reward signals. Self-supervised learning extracts useful representations from unlabeled sensory data. Transfer learning adapts knowledge from one domain to another. Modern robot learning increasingly combines these paradigms: pretrained vision-language models provide perception and reasoning capabilities, imitation learning provides task-specific behavior, and reinforcement learning refines performance.\n\nThe data infrastructure for robot learning has matured significantly. Standardized formats (RLDS, HDF5) enable data sharing across labs and robot platforms. The Open X-Embodiment project demonstrated that combining demonstrations from 22 different robots into a single training mixture produces policies that outperform those trained on any single robot's data. Foundation models like RT-2, Octo, and OpenVLA leverage internet-scale pretraining to reduce robot-specific data requirements while improving generalization. Despite these advances, the availability of high-quality, diverse, real-world robot demonstration data remains the primary bottleneck for the field.",
  historicalContext: "Robot learning has roots in multiple research traditions that converged over decades. Early robotics relied entirely on explicit programming — engineers wrote code specifying every joint angle, trajectory waypoint, and conditional branch. The SHAKEY robot (1966-1972) at SRI International used planning and problem-solving algorithms, not learning, to navigate. Industrial robots in manufacturing (Unimate, PUMA) followed precisely pre-programmed trajectories without adapting to variation.\n\nLearning from demonstration emerged in the 1980s and 1990s. Atkeson and Schaal (1997) demonstrated that robots could learn motor skills from human demonstrations using locally weighted regression. Schaal (1999) introduced dynamic movement primitives that captured the essential structure of demonstrated trajectories. These early methods worked for specific skills but did not scale to diverse tasks or transfer across different robots.\n\nReinforcement learning for robotics progressed through several phases. Bagnell and Schneider (2001) applied RL to helicopter flight. Peters and Schaal (2008) developed policy gradient methods suitable for high-dimensional robot action spaces. Levine et al. (2016) demonstrated end-to-end visuomotor learning — policies that directly mapped camera images and proprioceptive states to motor commands using deep neural networks. Kalashnikov et al. (2018) at Google trained a grasping policy from 800,000 real robot attempts using QT-Opt, establishing that large-scale real-world RL was feasible.\n\nThe foundation model era began with RT-1 (Brohan et al., 2023), which trained a transformer policy on 130,000 demonstrations across 700 tasks from a fleet of 13 robots. RT-2 (Brohan et al., 2023) showed that pretraining on internet-scale vision-language data improved robot performance and enabled emergent reasoning capabilities. The Open X-Embodiment project (2023) standardized data across 22 robot platforms, training RT-X models that demonstrated the value of cross-embodiment data. Octo, OpenVLA, and pi-zero further advanced the foundation model paradigm, each pushing the frontier of what generalist robot policies can achieve with diverse, high-quality training data.",
  practicalImplications: "For teams building robot learning systems, the choice of learning paradigm determines data requirements and collection strategy. Behavioral cloning is the most straightforward: collect demonstrations through teleoperation, train a policy by supervised learning, and evaluate on the target task. The data must be high quality (smooth demonstrations, consistent task execution) because the policy can only be as good as the demonstrations it learns from. Common pitfalls include distributional shift (the policy encounters states not represented in the training data and fails) and compounding errors (small deviations from demonstrated behavior accumulate over time).\n\nData collection infrastructure matters as much as algorithm choice. Teleoperation interfaces affect demonstration quality — VR controllers provide intuitive 6-DoF control but introduce latency, bilateral force-feedback systems enable contact-sensitive manipulation but are expensive, and keyboard/spacemouse control is inexpensive but produces jerky trajectories. The sensor suite must capture everything the policy needs to observe: RGB cameras for visual perception, depth sensors for geometric reasoning, proprioceptive sensors for body state awareness, and force-torque sensors for contact-sensitive tasks. All streams must be synchronized with sub-millisecond precision.\n\nData curation — filtering, cleaning, and organizing collected demonstrations — has an outsized impact on final policy performance. Research consistently shows that removing the lowest-quality 20% of demonstrations improves policy success rates by 10-20%. Quality metrics include task completion rate, trajectory smoothness, execution time consistency, and gripper force profiles. Automated quality scoring enables scaling data curation to large datasets without manual review of every episode.\n\nClaru's data collection infrastructure is built specifically for robot learning. Our teleoperation operators are trained on task-specific protocols with real-time quality monitoring. Calibrated multi-sensor rigs capture synchronized RGB, depth, proprioception, and force data at each robot's native rates. Automated quality scoring flags low-quality episodes for review. Datasets are delivered in RLDS format with comprehensive metadata enabling fine-grained curation. For teams building foundation models, we provide the task and environmental diversity that cross-embodiment training requires; for teams fine-tuning on specific skills, we deliver focused, high-quality demonstration sets.",
  commonMisconceptions: [
    {
      misconception: "Robot learning means the robot teaches itself through trial and error without human involvement.",
      correction: "While reinforcement learning does involve trial-and-error exploration, the most practical and widely deployed robot learning systems rely heavily on human-generated data. Imitation learning requires expert demonstrations. Even RL systems typically need human-designed reward functions, carefully constructed simulation environments, and human-curated training curricula. Foundation models are pretrained on human-created internet data and fine-tuned on human-collected demonstrations. The field is fundamentally human-in-the-loop — human expertise shapes what robots learn, how they learn it, and the quality of the data they learn from."
    },
    {
      misconception: "Simulation can fully replace real-world data collection for robot learning.",
      correction: "Simulation is valuable for pretraining, testing, and scaling data quantity, but real-world data remains essential for production systems. The sim-to-real gap — differences in physics, sensor characteristics, visual appearance, and environmental complexity — consistently degrades performance when policies transfer to real hardware. Domain randomization reduces but does not eliminate this gap. The most successful approaches combine simulation pretraining (providing initial competence and broad coverage) with real-world fine-tuning (closing the domain gap for the target environment). The ratio varies by application: simple pick-and-place may need 90% sim / 10% real, while contact-rich tasks like insertion or deformable object manipulation require 40-60% real data for reliable deployment."
    },
    {
      misconception: "More data always produces better robot learning outcomes.",
      correction: "Data quality and diversity matter more than raw quantity for robot learning. 200 diverse, high-quality demonstrations covering varied object positions, orientations, and lighting conditions typically produce better policies than 2,000 repetitive demonstrations in identical settings. Low-quality demonstrations — with excessive pauses, failed attempts, or inconsistent execution strategies — introduce noise that degrades policy learning. The optimal dataset balances coverage of the task distribution (diversity) with signal quality (demonstration excellence). For foundation models, scale does matter, but only because diverse data at scale naturally covers more of the task and environment distribution."
    }
  ],
  keyPapers: [
    {
      id: "brohan-rt1-2023",
      title: "RT-1: Robotics Transformer for Real-World Control at Scale",
      authors: "Brohan et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2212.06817"
    },
    {
      id: "embodiment-collaboration-oxe-2023",
      title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
      authors: "Embodiment Collaboration",
      venue: "arXiv 2310.08864",
      year: 2023,
      url: "https://arxiv.org/abs/2310.08864"
    },
    {
      id: "chi-diffusion-policy-2023",
      title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
      authors: "Chi et al.",
      venue: "RSS 2023",
      year: 2023,
      url: "https://arxiv.org/abs/2303.04137"
    },
    {
      id: "levine-visuomotor-2016",
      title: "End-to-End Training of Deep Visuomotor Policies",
      authors: "Levine et al.",
      venue: "JMLR 2016",
      year: 2016,
      url: "https://arxiv.org/abs/1504.00702"
    },
    {
      id: "team-octo-2024",
      title: "Octo: An Open-Source Generalist Robot Policy",
      authors: "Octo Model Team",
      venue: "arXiv 2405.12213",
      year: 2024,
      url: "https://arxiv.org/abs/2405.12213"
    },
    {
      id: "black-pi0-2024",
      title: "pi_0: A Vision-Language-Action Flow Model for General Robot Control",
      authors: "Black et al.",
      venue: "arXiv 2410.24164",
      year: 2024,
      url: "https://arxiv.org/abs/2410.24164"
    }
  ],
  claruRelevance: "Claru is the training data partner for robot learning teams building the next generation of physical AI. Our workforce of 10,000+ operators across 100+ cities collects expert manipulation demonstrations, navigation sequences, and interaction data using calibrated multimodal sensor rigs (RGB, depth, proprioception, force-torque) with sub-millisecond temporal synchronization. Every episode undergoes automated quality scoring — evaluating trajectory smoothness, task completion, execution consistency, and sensor data completeness — before entering a deliverable dataset. We deliver data in RLDS format for seamless integration with Open X-Embodiment training pipelines, RT-X, Octo, and OpenVLA, with HDF5 and zarr options for PyTorch workflows. With 3M+ annotated clips spanning hundreds of manipulation skills across kitchens, workshops, retail, and outdoor environments, Claru provides the quality, diversity, and scale that robot learning demands — from 100-episode behavioral cloning datasets to 100,000-episode foundation model training mixtures.",
};

export default data;
