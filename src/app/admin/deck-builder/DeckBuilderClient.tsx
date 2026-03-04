"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Loader2,
  Sparkles,
  Plus,
  Layers,
} from "lucide-react";
import type { SlideData } from "@/types/deck-builder";
import { GenerateWizard } from "@/app/components/deck-builder/GenerateWizard";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Raw row shape from Supabase -- slides stored as slides_json column */
interface TemplateRow {
  id: string;
  name: string;
  description: string;
  tags: string[];
  slides_json: SlideData[];
  theme: string;
  custom_theme: Record<string, unknown> | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DeckBuilderClientProps {
  initialTemplates: Record<string, unknown>[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Relative time string from an ISO timestamp. */
function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DeckBuilderClient({ initialTemplates }: DeckBuilderClientProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* ---- Template state -------------------------------------------- */
  const templates = initialTemplates as unknown as TemplateRow[];

  /* ---- Create template state ------------------------------------- */
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  /* ---- Delete dialog state --------------------------------------- */
  const [deleteTarget, setDeleteTarget] = useState<TemplateRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ---- Action loading states ------------------------------------- */
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showGenerateWizard, setShowGenerateWizard] = useState(false);
  const [generateTemplateId, setGenerateTemplateId] = useState<string | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);

  /* ---- Logout ----------------------------------------------------- */
  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }, [router]);

  /* ---- Create template ------------------------------------------- */
  const handleCreate = useCallback(async () => {
    const name = newName.trim();
    if (!name) {
      setCreateError("Name is required");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/admin/deck-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setCreateError(data?.error ?? `Failed to create (${res.status})`);
        return;
      }

      const { template } = await res.json();
      router.push(`/admin/deck-builder/${template.id}`);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create template"
      );
    } finally {
      setCreating(false);
    }
  }, [newName, router]);

  /* ---- Duplicate -------------------------------------------------- */
  const handleDuplicate = useCallback(
    async (id: string) => {
      setDuplicatingId(id);
      try {
        const res = await fetch(`/api/admin/deck-builder/${id}/duplicate`, {
          method: "POST",
        });
        if (!res.ok) {
          console.error("Duplicate failed:", res.status);
        }
        router.refresh();
      } catch (err) {
        console.error("Duplicate failed:", err);
      } finally {
        setDuplicatingId(null);
      }
    },
    [router]
  );

  /* ---- Toggle active ---------------------------------------------- */
  const handleToggleActive = useCallback(
    async (id: string, currentlyActive: boolean) => {
      setTogglingId(id);
      try {
        const res = await fetch(`/api/admin/deck-builder/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !currentlyActive }),
        });
        if (!res.ok) {
          console.error("Toggle active failed:", res.status);
        }
        router.refresh();
      } catch (err) {
        console.error("Toggle active failed:", err);
      } finally {
        setTogglingId(null);
      }
    },
    [router]
  );

  /* ---- Delete ----------------------------------------------------- */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/deck-builder/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        console.error("Delete failed:", res.status);
      }
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, router]);

  /* ---- Seed demo deck --------------------------------------------- */
  const handleSeedDemo = useCallback(async () => {
    setSeedingDemo(true);
    try {
      const res = await fetch("/api/admin/deck-builder/seed", {
        method: "POST",
      });
      if (!res.ok) {
        console.error("Seed failed:", res.status);
      }
      router.refresh();
    } catch (err) {
      console.error("Seed failed:", err);
    } finally {
      setSeedingDemo(false);
    }
  }, [router]);

  /* ---- Dismiss delete dialog on Escape --------------------------- */
  useEffect(() => {
    if (!deleteTarget) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteTarget(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteTarget]);

  /* ---- Dismiss create input on Escape ----------------------------- */
  useEffect(() => {
    if (!showCreateInput) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCreateInput(false);
        setNewName("");
        setCreateError(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showCreateInput]);

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ---- Header / breadcrumb ---------------------------------- */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="font-mono text-sm text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
            >
              claru
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <Link
              href="/admin/dashboard"
              className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              admin
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              deck-builder
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
              aria-label={
                mounted && resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200"
            >
              [logout]
            </button>
          </div>
        </div>
      </div>

      {/* ---- Content ----------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page heading */}
        <div className="mb-8">
          <p className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider mb-2">
            {"// DECK BUILDER"}
          </p>
          <h1 className="text-2xl font-bold mb-2">Presentation Templates</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Create and manage sales presentation templates.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* New Template */}
            {showCreateInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setCreateError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                  }}
                  placeholder="Template name..."
                  autoFocus
                  className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors duration-200 w-60"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent-primary)] hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-3 h-3 animate-spin" />}
                  {creating ? "creating..." : "[create]"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateInput(false);
                    setNewName("");
                    setCreateError(null);
                  }}
                  className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  [cancel]
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateInput(true)}
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                [+ new template]
              </button>
            )}

            {/* Generate with AI */}
            <button
              onClick={async () => {
                // Create a blank template first, then open wizard
                try {
                  const res = await fetch("/api/admin/deck-builder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "AI Generated Deck" }),
                  });
                  if (res.ok) {
                    const { template } = await res.json();
                    setGenerateTemplateId(template.id);
                    setShowGenerateWizard(true);
                  }
                } catch {}
              }}
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              [generate with AI]
            </button>
          </div>

          {/* Create error */}
          {createError && (
            <p className="text-xs font-mono text-[var(--error)]">
              {createError}
            </p>
          )}
        </div>

        {/* ---- Template list or empty state ----------------------- */}
        {templates.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
              <Layers className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No templates yet</h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-8 max-w-sm">
              Create your first sales presentation template to get started.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateInput(true)}
                className="flex items-center gap-2 rounded-md bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-mono font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Create your first template
              </button>
              <button
                onClick={handleSeedDemo}
                disabled={seedingDemo}
                className="flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors disabled:opacity-50"
              >
                {seedingDemo && <Loader2 className="w-4 h-4 animate-spin" />}
                {seedingDemo ? "Loading..." : "Load Demo Deck"}
              </button>
            </div>
          </div>
        ) : (
          /* Template cards grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => {
              const slideCount = Array.isArray(tmpl.slides_json)
                ? tmpl.slides_json.length
                : 0;

              return (
                <div
                  key={tmpl.id}
                  className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent-primary)]/40 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  {/* Card header row: name + active badge */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base text-[var(--text-primary)] leading-tight">
                      {tmpl.name}
                    </h3>
                    {tmpl.is_active && (
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 mt-1.5"
                        title="Active template"
                      />
                    )}
                  </div>

                  {/* Description */}
                  {tmpl.description && (
                    <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 mb-3 leading-relaxed">
                      {tmpl.description}
                    </p>
                  )}

                  {/* Tags */}
                  {tmpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tmpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta row: slide count + last modified */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {slideCount} {slideCount === 1 ? "slide" : "slides"}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {relativeTime(tmpl.updated_at)}
                    </span>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-subtle)]">
                    <Link
                      href={`/admin/deck-builder/${tmpl.id}`}
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                    >
                      [edit]
                    </Link>

                    <button
                      onClick={() => handleDuplicate(tmpl.id)}
                      disabled={duplicatingId === tmpl.id}
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200 disabled:opacity-50"
                    >
                      {duplicatingId === tmpl.id
                        ? "[duplicating...]"
                        : "[duplicate]"}
                    </button>

                    <button
                      onClick={() =>
                        handleToggleActive(tmpl.id, tmpl.is_active)
                      }
                      disabled={togglingId === tmpl.id}
                      className={`font-mono text-xs transition-colors duration-200 disabled:opacity-50 ${
                        tmpl.is_active
                          ? "text-[var(--accent-primary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                      }`}
                    >
                      {togglingId === tmpl.id
                        ? "[toggling...]"
                        : tmpl.is_active
                          ? "[active]"
                          : "[set active]"}
                    </button>

                    <button
                      onClick={() => setDeleteTarget(tmpl)}
                      className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors duration-200 ml-auto"
                    >
                      [delete]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Delete confirmation dialog ----------------------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md mx-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-mono font-semibold text-[var(--error)]">
              Delete {deleteTarget.name}?
            </h3>
            <p className="text-sm font-mono text-[var(--text-secondary)] leading-relaxed">
              This will permanently remove this template, all its versions, chat
              history, and media assets. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                [cancel]
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-mono bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/30 rounded-lg hover:bg-[var(--error)]/20 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? "[deleting...]" : "[confirm delete]"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Generate Wizard ---------------------------------------- */}
      {showGenerateWizard && generateTemplateId && (
        <GenerateWizard
          isOpen={showGenerateWizard}
          onClose={() => {
            setShowGenerateWizard(false);
            setGenerateTemplateId(null);
          }}
          onGenerated={async (slides) => {
            // Save generated slides to the template
            await fetch(`/api/admin/deck-builder/${generateTemplateId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slides_json: slides }),
            });
            router.push(`/admin/deck-builder/${generateTemplateId}`);
          }}
          templateId={generateTemplateId}
        />
      )}
    </div>
  );
}
