export interface AgentContextTechnical {
  fps: string | null;
  duration: string | null;
  resolution: string | null;
}

export interface AgentContext {
  scene_summary: string;
  environments: string[];
  activities: string[];
  objects: string[];
  camera_perspective: string;
  people_count: string;
  technical: AgentContextTechnical;
  quality_notes: string;
}

/** Zero-value AgentContext for filling defaults */
export const AGENT_CONTEXT_DEFAULTS: AgentContext = {
  scene_summary: "",
  environments: [],
  activities: [],
  objects: [],
  camera_perspective: "",
  people_count: "",
  technical: { fps: null, duration: null, resolution: null },
  quality_notes: "",
};
