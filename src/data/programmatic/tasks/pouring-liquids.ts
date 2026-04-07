import type { TaskPageData } from "../types";

const data: TaskPageData = {
  slug: "pouring-liquids",
  metaTitle: "Liquid Pouring Training Data for Robotics | Claru",
  metaDescription: "Training data for robotic pouring: liquid transfer, measuring, dispensing. Demonstrations capturing fill levels, pour dynamics, and container handling for kitchen and lab robots.",
  primaryKeyword: "liquid pouring training data",
  secondaryKeywords: ["robot pouring dataset", "liquid manipulation data", "pour estimation training", "viscosity estimation robotics", "liquid transfer robot data", "fill level prediction dataset"],
  canonicalPath: "/training-data/pouring-liquids",
  h1: "Liquid Pouring Training Data",
  heroSubtitle: "Liquid handling datasets for robotics — precision pouring, volume estimation, container transfer, and dispensing tasks with fill-level annotations and pour dynamics for kitchen and laboratory applications.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Training Data", href: "/training-data" },
    { label: "Liquid Pouring", href: "/training-data/pouring-liquids" },
  ],
  sections: [
    {
      type: "prose",
      heading: "What Is Robotic Pouring and Why Is It Uniquely Challenging?",
      paragraphs: [
        "Liquid pouring is one of the most deceptively difficult manipulation tasks for robots. The challenge lies in the physics: liquid is a continuous medium whose behavior during pouring depends on viscosity, surface tension, container geometry, pour angle, and pour rate — all interacting nonlinearly. A small change in wrist angle can transition a controlled stream into a splashing torrent. Humans exploit decades of motor learning to pour water into a glass without conscious thought, but robots must learn this from data because the underlying fluid dynamics are computationally intractable to simulate at the speed needed for real-time control.",
        "The data requirements for pouring are distinct from other manipulation tasks. Vision alone cannot determine fill level accurately for opaque containers, so weight sensing (via load cells under the target container) becomes a critical modality. The temporal dynamics matter enormously: pour rate must be controlled precisely, with different strategies for fast initial filling versus careful final approach to the target volume. Schenck and Fox (2017) showed that learned pouring policies trained on real data achieve 15-20 mL accuracy on 200 mL target fills, while simulation-trained policies exhibit 40-60 mL errors due to the sim-to-real gap in fluid dynamics.",
        "Commercial applications span kitchen robotics (Moley, Samsung Bot Chef), laboratory automation (liquid handling for biotech), bartending systems (Makr Shakr), and industrial dispensing. Each domain has different precision requirements: kitchen pouring tolerates +/-10% volume error, lab pipetting demands +/-1% accuracy, and industrial dispensing operates in continuous-flow regimes. Training data must be collected with the precision requirements of the target domain, particularly in the weight sensing calibration and temporal resolution.",
        "The physics of pouring creates unique data quality requirements. Unlike rigid object manipulation where actions are deterministic given the same initial conditions, pouring has inherent stochasticity: the same wrist angle can produce different flow rates depending on the liquid level in the source container (hydrostatic pressure changes as the container empties), the surface tension at the spout lip, and even ambient vibrations. This means a policy must learn not just an open-loop pour trajectory but a closed-loop control strategy that monitors flow rate (via weight change) and adjusts tilt angle in real time. Training data must capture this feedback loop by recording the operator's corrective adjustments throughout the pour — not just the final successful trajectory.",
      ],
    },
    {
      type: "stats",
      heading: "Pouring Data at a Glance",
      stats: [
        { value: "1K-10K", label: "Pouring episodes needed" },
        { value: "100 Hz", label: "Weight sensing rate" },
        { value: "15-20 mL", label: "Best real-data accuracy (200 mL target)" },
        { value: "3-5x", label: "Sim-to-real error multiplier" },
      ],
    },
    {
      type: "comparison-table",
      heading: "Data Requirements by Pouring Application",
      description: "Different pouring domains require different precision levels, modalities, and data volumes.",
      columns: ["Application", "Volume Accuracy", "Key Modalities", "Data Volume", "Critical Challenge"],
      rows: [
        { "Application": "Kitchen pouring", "Volume Accuracy": "+/- 10%", "Key Modalities": "RGB + weight", "Data Volume": "1K-3K episodes", "Critical Challenge": "Container diversity" },
        { "Application": "Bartending", "Volume Accuracy": "+/- 5%", "Key Modalities": "RGB + weight + flow sensor", "Data Volume": "2K-5K episodes", "Critical Challenge": "Liquid viscosity variation" },
        { "Application": "Lab liquid handling", "Volume Accuracy": "+/- 1%", "Key Modalities": "Weight + vision + proprioception", "Data Volume": "5K-10K episodes", "Critical Challenge": "Sub-mL precision" },
        { "Application": "Industrial dispensing", "Volume Accuracy": "+/- 2%", "Key Modalities": "Flow rate + weight", "Data Volume": "1K-5K episodes", "Critical Challenge": "Continuous flow control" },
      ],
    },
    {
      type: "prose",
      heading: "State of the Art in Learned Pouring",
      paragraphs: [
        "Early robotic pouring systems used analytical models of fluid flow, but these failed to generalize across container shapes and liquid types. The shift to data-driven approaches began with Schenck and Fox (2017), who trained neural network pouring controllers from 1,000+ real episodes, and demonstrated that real-world data captures fluid dynamics effects (splashing, meniscus formation, drip behavior) that even sophisticated fluid simulators miss. Their system achieved 92% success rate for pouring water to target fill levels in transparent containers.",
        "More recent work uses Diffusion Policy for pouring tasks. Chi et al. (2023) showed that action diffusion naturally handles the multimodality of pouring — there are valid fast-pour and slow-pour strategies for the same target volume. With just 100 demonstrations, Diffusion Policy achieves comparable performance to specialized pouring controllers trained on 10x more data. The ALOHA system (Zhao et al., 2023) demonstrated bimanual pouring (holding a pot in one hand, a cup in the other) from 50 demonstrations, though success rates drop significantly for novel container combinations.",
        "The emerging challenge is zero-shot generalization to unseen liquids. A policy trained on water fails when encountering honey (high viscosity), olive oil (low surface tension), or carbonated beverages (gas bubbles). Pan et al. (2024) address this by training viscosity-conditioned policies from a dataset of 20+ liquid types, where viscosity is estimated from pour stream visual features. This approach requires collecting demonstrations across a diverse liquid library — a data collection challenge that favors distributed collection networks over single-lab setups.",
        "Spill prevention and recovery are the practical priorities for deployment. The most common failure mode is overshoot — continuing to pour after the target volume is reached because of liquid in flight between source and target containers. The delay between tilting the source container back to neutral and the last drop leaving the spout can be 0.5-2 seconds depending on liquid viscosity and spout geometry. Training data should capture the pour cessation strategy: how far in advance of the target volume the operator begins tilting back, and how this lead time varies by liquid type and pour rate. Explicitly annotating the anticipation offset in demonstrations enables policies to learn proactive rather than reactive pour cessation.",
      ],
    },
    {
      type: "prose",
      heading: "Collection Methodology for Pouring Data",
      paragraphs: [
        "A pouring data collection station requires: calibrated RGB-D cameras (overhead for fill-level view, side-view for pour stream), a high-precision load cell under the target container (100 Hz, 0.1g resolution), robot proprioception at 50+ Hz, and optionally a flow rate sensor for continuous dispensing tasks. The source and target container library should include at least 10 container geometries (cups, glasses, bottles, pitchers, bowls) with varying spout designs.",
        "Each episode follows a structured protocol: weigh the source container (establishing initial liquid volume), execute the pour via teleoperation, and weigh both containers after completion. The weight differential provides ground truth fill level. Pour dynamics annotations — pour onset time, peak flow rate, tilt angle trajectory, and pour cessation — are extracted post-hoc from the weight time series and robot joint trajectories. Spill detection uses a combination of weight discrepancy (total weight loss exceeds target transfer) and visual detection of liquid outside the target container.",
        "Liquid diversity is the second critical axis after container diversity. Claru's pouring collection protocol requires a minimum of 5 liquid types per campaign: water, cooking oil, milk/cream, juice (high sugar = different surface tension), and a thick liquid like honey or syrup. Each liquid-container combination gets a minimum of 50 episodes at 3+ target fill levels (25%, 50%, 75% full). This produces approximately 1,500 episodes from a single station in 5 days, with full weight-series and visual annotations.",
        "Pour cessation annotation is a critical quality layer specific to pouring data. Each episode is annotated with the pour cessation lead time — the time between the operator beginning to tilt the container back and the last liquid leaving the spout. This metric varies by liquid viscosity (0.3 s for water, 1.5 s for honey) and is essential for training policies that stop pouring proactively rather than reactively. Automated cessation timing is extracted from the weight derivative curve (the inflection point marks when the operator began the stop maneuver) and validated by human annotation for accuracy.",
      ],
    },
    {
      type: "comparison-table",
      heading: "Key Datasets for Pouring Research",
      columns: ["Dataset", "Year", "Episodes", "Liquids", "Modalities", "Availability"],
      rows: [
        { "Dataset": "Schenck & Fox", "Year": "2017", "Episodes": "1,000", "Liquids": "Water", "Modalities": "RGB + weight", "Availability": "Public" },
        { "Dataset": "MIT Pouring", "Year": "2019", "Episodes": "600", "Liquids": "3 types", "Modalities": "RGB-D + weight + F/T", "Availability": "Public" },
        { "Dataset": "ALOHA Kitchen", "Year": "2023", "Episodes": "~50 pour demos", "Liquids": "Water", "Modalities": "RGB + proprioception", "Availability": "Public" },
        { "Dataset": "Multi-Viscosity Pour", "Year": "2024", "Episodes": "5,000", "Liquids": "20+ types", "Modalities": "RGB + weight + viscosity", "Availability": "Limited release" },
        { "Dataset": "Claru Custom", "Year": "2026", "Episodes": "1K-10K+", "Liquids": "Configurable", "Modalities": "RGB-D + weight + full annotations", "Availability": "Built to spec" },
      ],
    },
    {
      type: "citation-list",
      heading: "References",
      citations: [
        { id: "schenck-pouring-2017", title: "Visual Closed-Loop Control for Pouring Liquids", authors: "Schenck & Fox", venue: "ICRA 2017", year: 2017, url: "https://arxiv.org/abs/1612.04429" },
        { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
        { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
        { id: "pan-viscosity-2024", title: "Learning Viscosity-Conditioned Pouring Policies from Visual Observations", authors: "Pan et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2406.09127" },
      ],
    },
  ],
  faqs: [
    {
      question: "How many pouring demonstrations are needed for a kitchen robot?",
      answer: "For a fixed container pair (e.g., pitcher to glass) with water, 100-200 demonstrations achieve 90%+ success with Diffusion Policy. For generalization across 10+ container combinations, expect 1,000-3,000 episodes. For multi-liquid generalization (water, oil, honey), add 200-500 episodes per liquid type per container pair. Start with a single container pair and scale based on deployment scope.",
    },
    {
      question: "Why is weight sensing essential for pouring data?",
      answer: "Vision cannot reliably determine fill level for opaque containers or liquids matching the container color. Weight provides ground truth fill level at 100 Hz resolution, capturing the pour dynamics that vision misses: flow rate acceleration during tilt, the moment of pour cessation, and subtle drip behavior. The weight time series also enables automated annotation of pour quality metrics without manual labeling.",
    },
    {
      question: "Can simulation replace real pouring data?",
      answer: "Fluid simulation (SPH, MPM) can generate physically plausible pouring motions, but the sim-to-real gap is severe for control-relevant dynamics. Real-data policies achieve 15-20 mL accuracy on 200 mL targets, while sim-only policies show 40-60 mL errors — a 3-5x degradation. The gap widens for viscous liquids and complex container geometries. Use simulation for pretraining (10K+ episodes) then fine-tune on 500-2,000 real episodes for production accuracy.",
    },
    {
      question: "How should container and liquid diversity be structured in a dataset?",
      answer: "Use a factorial design: minimum 10 source-target container pairs times 5 liquid types times 3 target fill levels. Each combination gets 50+ episodes. This produces a balanced dataset where the policy learns to disentangle container geometry effects from liquid property effects. Include transparent, translucent, and opaque containers to stress-test vision-based fill estimation.",
    },
    {
      question: "What are the key failure modes in robotic pouring?",
      answer: "Five primary failure modes: (1) overshoot — pouring past the target volume due to flow inertia, (2) spillage — liquid missing the target container, (3) drip trail — residual drops after pour cessation, (4) splash — liquid rebounds out of target at high flow rates, (5) incomplete pour — stopping short of target due to conservative control. A quality dataset includes all five failure modes with labels, enabling the policy to learn corrective strategies for each.",
    },
    {
      question: "How does source container fill level affect pouring data?",
      answer: "The fill level of the source container significantly affects pour dynamics. A full container requires a smaller tilt angle to initiate flow (higher hydrostatic pressure), while a nearly empty container requires aggressive tilting and produces more erratic flow. Demonstrations should cover the full range of source fill levels: full (90%+), half (40-60%), and nearly empty (under 20%). Each level has different optimal tilt strategies and pour cessation timing. Annotate each episode with the source container initial and final fill levels to enable fill-level-conditioned policy training. Budget at least 30% of demonstrations at low fill levels, as these are the hardest for policies to handle.",
    },
  ],
  ctaHeading: "Get a Custom Quote for Liquid Pouring Data",
  ctaDescription: "Tell us your target liquid types, container geometries, and accuracy requirements. We will design a collection plan with the right sensor configuration and episode count.",
  relatedGlossaryTerms: ["manipulation-trajectory", "behavioral-cloning", "imitation-learning"],
  relatedGuidePages: ["how-to-build-a-manipulation-dataset"],
  relatedSolutionSlugs: [],
  dataRequirements: {
    modality: "RGB-D multi-view + high-precision weight (100 Hz) + proprioception",
    volumeRange: "1K-10K pouring episodes across container-liquid combinations",
    temporalResolution: "30 Hz video, 100 Hz weight sensing, 50 Hz proprioception",
    keyAnnotations: ["Fill level trajectory (from weight series)", "Pour rate and tilt angle profile", "Spill detection and volume", "Container and liquid type metadata", "Pour quality score (accuracy to target)"],
  },
  relevantModels: ["Diffusion Policy", "ACT/ALOHA", "Neural pouring controllers", "Viscosity-conditioned policies"],
  environmentTypes: ["Kitchen", "Laboratory", "Bar/beverage station", "Industrial dispensing line"],
  keyPapers: [
    { id: "schenck-pouring-2017", title: "Visual Closed-Loop Control for Pouring Liquids", authors: "Schenck & Fox", venue: "ICRA 2017", year: 2017, url: "https://arxiv.org/abs/1612.04429" },
    { id: "chi-diffusion-2023", title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion", authors: "Chi et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2303.04137" },
    { id: "zhao-aloha-2023", title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", authors: "Zhao et al.", venue: "RSS 2023", year: 2023, url: "https://arxiv.org/abs/2304.13705" },
    { id: "pan-viscosity-2024", title: "Learning Viscosity-Conditioned Pouring Policies from Visual Observations", authors: "Pan et al.", venue: "CoRL 2024", year: 2024, url: "https://arxiv.org/abs/2406.09127" },
  ],
  claruRelevance: "Claru's pouring data collection stations feature calibrated overhead and side-view RGB-D cameras, high-precision load cells (0.1g resolution, 100 Hz), and libraries of 15+ container geometries per station. Our liquid library covers water, cooking oils, dairy, juices, syrups, and other viscous liquids for multi-property training data. Each episode includes full weight time series, pour dynamics annotations (onset, peak rate, cessation), spill detection labels, and container-liquid metadata. Our factorial collection protocol ensures balanced representation across container pairs, liquid types, and fill levels. Datasets are delivered in RLDS, HDF5, or custom formats with full sensor calibration, weight calibration certificates, and stratified train/val/test splits. A typical 3,000-episode pouring dataset covering 10 container pairs and 5 liquid types ships in 2-3 weeks.",
};

export default data;
