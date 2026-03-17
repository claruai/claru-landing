// ---------------------------------------------------------------------------
// Type5Annotation — data model for Classification Pipeline compositions
// ---------------------------------------------------------------------------

export interface TaxonomyPath {
  /** Root label of the taxonomy tree (e.g. "Content", "Visual Style") */
  root: string;
  /** Ordered levels from root to leaf (excluding root) */
  levels: string[];
}

export interface PipelineStage {
  label: string;
  status: "pending" | "active" | "complete";
}

export interface Type5Annotation {
  /** Taxonomy hierarchies to display (1 for game, 2 for dual classification) */
  taxonomies: TaxonomyPath[];
  /** Caption text to type out below the video */
  caption: string;
  /** Pipeline stages for the bottom animation */
  pipelineStages: PipelineStage[];
  /** Selected game title (game environment compositions only) */
  gameTitle?: string;
  /** Full 25-game catalog for fan-out animation (game environment compositions only) */
  gameCatalog?: string[];
}

// ---------------------------------------------------------------------------
// Fallback data per composition ID
// ---------------------------------------------------------------------------

const VIDEO_CLASSIFICATION_ANNOTATION: Type5Annotation = {
  taxonomies: [
    {
      root: "Content",
      levels: ["People", "Technology & Computing", "Smartphones & Gadget Use"],
    },
    {
      root: "Visual Style",
      levels: ["Portrait photography", "Urban outdoor portraits"],
    },
  ],
  caption:
    "Person using smartphone in urban outdoor setting. Natural lighting, shallow depth of field. Content classified under dual taxonomy for training video understanding models.",
  pipelineStages: [
    { label: "Raw Capture", status: "complete" },
    { label: "Classification", status: "complete" },
    { label: "Review", status: "complete" },
    { label: "Approved", status: "complete" },
  ],
};

const GAME_CATALOG_25 = [
  "Red Dead Redemption 2",
  "The Witcher 3",
  "GTA V",
  "Cyberpunk 2077",
  "Elden Ring",
  "Horizon Zero Dawn",
  "Death Stranding",
  "Ghost of Tsushima",
  "Forza Horizon 5",
  "Microsoft Flight Simulator",
  "Assassin's Creed Valhalla",
  "Far Cry 6",
  "Watch Dogs Legion",
  "Control",
  "Metro Exodus",
  "Days Gone",
  "Uncharted 4",
  "The Last of Us Part II",
  "Spider-Man",
  "God of War",
  "Battlefield V",
  "Star Wars Jedi: Fallen Order",
  "Sekiro",
  "Dark Souls III",
  "Resident Evil Village",
];

const GAME_CAPTURE_ANNOTATION: Type5Annotation = {
  taxonomies: [
    {
      root: "Video Game",
      levels: ["Adventure", "Red Dead Redemption 2"],
    },
  ],
  caption:
    "Open-world gameplay capture from Red Dead Redemption 2. Adventure genre, third-person perspective. Environment data used for sim-to-real transfer learning.",
  pipelineStages: [
    { label: "Raw Capture", status: "complete" },
    { label: "Classification", status: "complete" },
    { label: "Review", status: "complete" },
    { label: "Approved", status: "complete" },
  ],
  gameTitle: "Red Dead Redemption 2",
  gameCatalog: GAME_CATALOG_25,
};

const SIM2REAL_ANNOTATION: Type5Annotation = {
  taxonomies: [
    {
      root: "Video Game",
      levels: ["Simulation", "Microsoft Flight Simulator"],
    },
  ],
  caption:
    "Flight simulation capture for sim-to-real domain transfer. High-fidelity environment rendering provides training signal for real-world perception models.",
  pipelineStages: [
    { label: "Raw Capture", status: "complete" },
    { label: "Classification", status: "complete" },
    { label: "Review", status: "complete" },
    { label: "Approved", status: "complete" },
  ],
  gameTitle: "Microsoft Flight Simulator",
  gameCatalog: GAME_CATALOG_25,
};

/** Fallback annotations keyed by compositionId */
export const FALLBACK_ANNOTATIONS: Record<string, Type5Annotation> = {
  "cs-vid-classify": VIDEO_CLASSIFICATION_ANNOTATION,
  "cs-game-capture": GAME_CAPTURE_ANNOTATION,
  "sol-sim2real": SIM2REAL_ANNOTATION,
};

/**
 * Returns Type5Annotation for a given compositionId.
 * Attempts to load from annotation JSON; falls back to hardcoded data.
 */
export function getType5Annotation(compositionId: string): Type5Annotation {
  // Annotation data may be loaded at render-time via staticFile + JSON parse,
  // but for now we use the fallback data which matches the PRD spec exactly.
  return (
    FALLBACK_ANNOTATIONS[compositionId] ?? VIDEO_CLASSIFICATION_ANNOTATION
  );
}
