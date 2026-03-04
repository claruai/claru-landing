// =============================================================================
// Deck Archetypes — Loadable reference knowledge for different deck types
// The agent reads these to inform its design approach, not as rigid templates.
// =============================================================================

import * as fs from "fs";
import * as path from "path";

const ARCHETYPES_DIR = path.join(__dirname);

/**
 * List available deck archetypes.
 */
export function listArchetypes(): { id: string; name: string }[] {
  try {
    const files = fs.readdirSync(ARCHETYPES_DIR).filter((f) => f.endsWith(".md"));
    return files.map((f) => ({
      id: f.replace(".md", ""),
      name: f
        .replace(".md", "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }));
  } catch {
    return [];
  }
}

/**
 * Load a specific archetype's reference knowledge by ID.
 * Returns the full markdown content.
 */
export function loadArchetype(id: string): string | null {
  try {
    const filePath = path.join(ARCHETYPES_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Load all archetypes as a brief overview (first 2 lines of each).
 * Used by the agent to understand what approaches are available.
 */
export function getArchetypeOverview(): string {
  const archetypes = listArchetypes();
  if (archetypes.length === 0) {
    return "No deck archetypes available.";
  }

  const summaries = archetypes.map((a) => {
    const content = loadArchetype(a.id);
    if (!content) return `- **${a.name}** (${a.id})`;
    // Extract the "When to use" section for a brief summary
    const whenMatch = content.match(/## When to use[^\n]*\n([^\n#]+)/);
    const summary = whenMatch?.[1]?.trim() ?? content.split("\n").find((l) => l.trim() && !l.startsWith("#"))?.trim() ?? "";
    return `- **${a.name}** (${a.id}): ${summary.slice(0, 120)}`;
  });

  return `Available deck approaches:\n${summaries.join("\n")}\n\nCall get_deck_approach with an archetype ID to load the full reference, or describe what kind of deck you're building and I'll suggest the best approach.`;
}
