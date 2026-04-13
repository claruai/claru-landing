"use client";

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Column header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </h2>
        <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
          {count}
        </span>
      </div>

      {/* Droppable scroll area */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 overflow-y-auto rounded-lg border p-2 transition-colors ${
          isOver
            ? "border-[#92B090]/40 bg-[#92B090]/5"
            : "border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30"
        }`}
        style={{ height: "calc(100vh - 220px)" }}
      >
        {count === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="font-mono text-xs text-[var(--text-muted)]">—</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
