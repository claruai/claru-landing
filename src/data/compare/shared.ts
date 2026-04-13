import type { ComparisonStat, ComparisonStep } from "@/data/compare/types";

export const claruPipelineSteps: ComparisonStep[] = [
  {
    step: "01",
    title: "Scope the Dataset",
    content:
      "Define the target behaviors, environments, and label schema with your research team. We align on formats, enrichment layers, and success criteria before capture begins.",
  },
  {
    step: "02",
    title: "Capture Real-World Data",
    content:
      "Activate the collector network, teleoperation runs, or game-based capture to gather the exact clips your model needs.",
  },
  {
    step: "03",
    title: "Enrich Every Clip",
    content:
      "Generate depth maps, pose, segmentation, and optical flow in batch. Cross-validate signals to ensure aligned training inputs.",
  },
  {
    step: "04",
    title: "Expert Annotation",
    content:
      "Specialized annotators label action boundaries, affordances, and intent using project-specific guidelines and QA checks.",
  },
  {
    step: "05",
    title: "Deliver Training-Ready",
    content:
      "Ship datasets in WebDataset, HDF5, RLDS, or your native format with manifests, checksums, and datasheets.",
  },
];

export const claruProofStats: ComparisonStat[] = [
  {
    stat: "4M+",
    label: "Human annotations",
    context:
      "across egocentric video, game environments, manipulation data, and custom captures",
  },
  {
    stat: "500K+",
    label: "Egocentric clips",
    context:
      "captured from kitchens, warehouses, workshops, and outdoor environments worldwide",
  },
  {
    stat: "10,000+",
    label: "Global contributors",
    context:
      "trained collectors with wearable cameras across 100+ cities",
  },
  {
    stat: "Days",
    label: "Brief to delivery",
    context: "pilot datasets scoped and delivered in under a week",
  },
];
