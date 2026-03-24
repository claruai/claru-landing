import type { AgentContext } from "./types";
import { AGENT_CONTEXT_DEFAULTS } from "./types";

// ---------------------------------------------------------------------------
// Variant detection
// ---------------------------------------------------------------------------

export type EnrichmentVariant = "egocentric" | "food_lifestyle" | "generic";

/**
 * Detect which enrichment variant a given enrichment_json represents.
 */
export function detectVariant(data: Record<string, unknown>): EnrichmentVariant {
  // Egocentric: has environment_label, domain, task, or hands
  if (
    "environment_label" in data ||
    "domain" in data ||
    "task" in data ||
    "hands" in data
  ) {
    return "egocentric";
  }

  // Food/Lifestyle: has captions.detailed or quality_scores
  const captions = data.captions as Record<string, unknown> | undefined;
  if (captions?.detailed || "quality_scores" in data) {
    return "food_lifestyle";
  }

  return "generic";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function asString(val: unknown): string {
  return typeof val === "string" ? val : "";
}

function asStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  if (typeof val === "string") return [val];
  return [];
}

function fillDefaults(partial: Partial<AgentContext>): AgentContext {
  return {
    ...AGENT_CONTEXT_DEFAULTS,
    ...partial,
    technical: {
      ...AGENT_CONTEXT_DEFAULTS.technical,
      ...(partial.technical ?? {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Egocentric mapper
// ---------------------------------------------------------------------------

export function mapEgocentric(data: Record<string, unknown>): AgentContext {
  const taskDesc = asString(data.task_description);
  const envDesc = asString(data.environment_description);
  const scene_summary = [taskDesc, envDesc].filter(Boolean).join(" ");

  const environments = asString(data.environment_label)
    ? [asString(data.environment_label)]
    : [];

  const activities = asString(data.task) ? [asString(data.task)] : [];

  // Extract objects from hands data
  const objects: string[] = [];
  const hands = data.hands as Record<string, unknown> | undefined;
  if (hands) {
    if (hands.primary_hand) objects.push(`${hands.primary_hand} hand`);
    if (hands.active_manipulation) objects.push("hand manipulation");
  }

  const technical = data.technical_specs as Record<string, unknown> | undefined;

  return fillDefaults({
    scene_summary,
    environments,
    activities,
    objects,
    camera_perspective: "egocentric_first_person",
    technical: {
      fps: technical?.fps_estimate ? String(technical.fps_estimate) : null,
      duration: technical?.duration_s ? String(technical.duration_s) : null,
      resolution: null,
    },
  });
}

// ---------------------------------------------------------------------------
// Food/Lifestyle mapper
// ---------------------------------------------------------------------------

export function mapFoodLifestyle(data: Record<string, unknown>): AgentContext {
  const captions = data.captions as Record<string, unknown> | undefined;
  const captionAnalysis = data.caption_analysis as Record<string, unknown> | undefined;
  const technical = data.technical as Record<string, unknown> | undefined;

  // scene_summary: prefer captions.detailed, then caption_analysis.vlm_caption
  const scene_summary =
    asString(captions?.detailed) ||
    asString(captionAnalysis?.vlm_caption) ||
    "";

  const activities = asStringArray(captions?.activities)
    .length > 0
      ? asStringArray(captions?.activities)
      : asString(captions?.activities)
        ? [asString(captions?.activities)]
        : [];

  const objects = asStringArray(captions?.objects)
    .length > 0
      ? asStringArray(captions?.objects)
      : asString(captions?.objects)
        ? [asString(captions?.objects)]
        : [];

  const camera = asString(captions?.camera);

  return fillDefaults({
    scene_summary,
    activities,
    objects,
    camera_perspective: camera || "",
    technical: {
      fps: technical?.fps ? String(technical.fps) : null,
      duration: technical?.duration_s ? String(technical.duration_s) : null,
      resolution:
        technical?.width && technical?.height
          ? `${technical.width}x${technical.height}`
          : null,
    },
  });
}

// ---------------------------------------------------------------------------
// Generic mapper
// ---------------------------------------------------------------------------

export function mapGeneric(data: Record<string, unknown>): AgentContext {
  // Try scene_analysis, then captions.detailed, then description
  const captionAnalysis = data.caption_analysis as Record<string, unknown> | undefined;
  const content = data.content as Record<string, unknown> | undefined;

  const scene_summary =
    asString((data.scene_analysis as Record<string, unknown>)?.summary) ||
    asString(captionAnalysis?.vlm_caption) ||
    asString(data.description) ||
    "";

  const objects: string[] = [];
  if (content?.subject) objects.push(asString(content.subject));

  return fillDefaults({
    scene_summary,
    objects,
    camera_perspective: asString(content?.shot_type),
  });
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function mapEnrichmentToAgentContext(
  enrichmentJson: Record<string, unknown>
): AgentContext {
  const variant = detectVariant(enrichmentJson);
  switch (variant) {
    case "egocentric":
      return mapEgocentric(enrichmentJson);
    case "food_lifestyle":
      return mapFoodLifestyle(enrichmentJson);
    case "generic":
      return mapGeneric(enrichmentJson);
  }
}
