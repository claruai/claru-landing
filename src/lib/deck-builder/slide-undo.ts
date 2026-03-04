// =============================================================================
// Per-Slide Undo Manager
// Maintains a bounded undo stack per slide ID so the AI agent (or UI) can
// revert individual slides to their previous state.
// =============================================================================

import type { SlideData } from '@/types/deck-builder';

const MAX_UNDO_DEPTH = 10;

export interface UndoManager {
  push(slideId: string, slideData: SlideData): void;
  pop(slideId: string): SlideData | null;
  canUndo(slideId: string): boolean;
  depth(slideId: string): number;
}

export function createUndoManager(): UndoManager {
  const stacks = new Map<string, SlideData[]>();

  return {
    push(slideId, slideData) {
      const stack = stacks.get(slideId) ?? [];
      stack.push(JSON.parse(JSON.stringify(slideData))); // deep copy
      if (stack.length > MAX_UNDO_DEPTH) stack.shift();
      stacks.set(slideId, stack);
    },
    pop(slideId) {
      const stack = stacks.get(slideId);
      if (!stack || stack.length === 0) return null;
      return stack.pop() ?? null;
    },
    canUndo(slideId) {
      return (stacks.get(slideId)?.length ?? 0) > 0;
    },
    depth(slideId) {
      return stacks.get(slideId)?.length ?? 0;
    },
  };
}

/**
 * Compare old and new slide arrays. For each slide that changed (by ID),
 * push the old version onto the undo stack.
 */
export function snapshotChangedSlides(
  oldSlides: SlideData[],
  newSlides: SlideData[],
  undo: UndoManager,
): void {
  const oldMap = new Map(oldSlides.map(s => [s.id, s]));
  for (const newSlide of newSlides) {
    const oldSlide = oldMap.get(newSlide.id);
    if (oldSlide && JSON.stringify(oldSlide) !== JSON.stringify(newSlide)) {
      undo.push(newSlide.id, oldSlide);
    }
  }
}
