"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type DragEvent,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Play,
  History,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Upload,
  X,
  ChevronRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type {
  SlideData,
  SlideLayout,
  SlideMediaAsset,
  SlideThemeCustom,
} from "@/types/deck-builder";
import { MAX_SLIDES, createEmptySlide } from "@/types/deck-builder";
import { renderSlidesToHTML } from "@/lib/deck-builder/html-renderer";
import { SlideLayoutPicker } from "@/app/components/deck-builder/SlideLayoutPicker";
import { ExportMenu } from "@/app/components/deck-builder/ExportMenu";
import { VersionHistory } from "@/app/components/deck-builder/VersionHistory";
import { ThemeEditor } from "@/app/components/deck-builder/ThemeEditor";
import { ChatPanel } from "@/app/components/deck-builder/ChatPanel";

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
  custom_theme: SlideThemeCustom | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DeckEditorClientProps {
  initialTemplate: Record<string, unknown>;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

interface ContextMenu {
  x: number;
  y: number;
  slideIndex: number;
}

type SaveStatus = "saved" | "saving" | "unsaved";
type BgType = "solid" | "gradient" | "image";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let toastCounter = 0;

function recalculateOrder(slides: SlideData[]): SlideData[] {
  return slides.map((s, i) => ({ ...s, order: i }));
}

/* ------------------------------------------------------------------ */
/*  Toast Container                                                    */
/* ------------------------------------------------------------------ */

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg font-mono text-sm shadow-lg border ${
            t.type === "success"
              ? "bg-[var(--bg-secondary)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
              : t.type === "warning"
                ? "bg-[var(--bg-secondary)] text-[var(--warning)] border-[var(--warning)]/30"
                : "bg-[var(--bg-secondary)] text-[var(--error)] border-[var(--error)]/30"
          }`}
        >
          {t.type === "success" ? "> " : "! "}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function DeckEditorClient({ initialTemplate }: DeckEditorClientProps) {
  const template = initialTemplate as unknown as TemplateRow;

  /* ---- Core state ------------------------------------------------- */
  const [slides, setSlides] = useState<SlideData[]>(() => {
    const raw = template.slides_json ?? [];
    return Array.isArray(raw) && raw.length > 0
      ? recalculateOrder(raw)
      : [createEmptySlide(0)];
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templateName, setTemplateName] = useState(template.name);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [chatPanelWidth, setChatPanelWidth] = useState(380);
  const [chatKey, setChatKey] = useState(0); // increment to reset chat
  const [selectorMode, setSelectorMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{ tag: string; text: string; html: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ---- Media state ------------------------------------------------ */
  const [mediaAssets, setMediaAssets] = useState<SlideMediaAsset[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Context menu state ----------------------------------------- */
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  /* ---- DnD state -------------------------------------------------- */
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /* ---- Version history & theme state ------------------------------ */
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [themeId, setThemeId] = useState(template.theme ?? "terminal-green");
  const [customTheme, setCustomTheme] = useState<SlideThemeCustom | null>(
    template.custom_theme ?? null
  );

  /* ---- Collapsible sections --------------------------------------- */
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [bgOpen, setBgOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  /* ---- Refs ------------------------------------------------------- */
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  /* ---- Derived ---------------------------------------------------- */
  const currentSlide = slides[selectedIndex] ?? slides[0];

  /* ================================================================ */
  /*  Toast helper                                                     */
  /* ================================================================ */

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  /* ================================================================ */
  /*  Save logic                                                       */
  /* ================================================================ */

  const saveToServer = useCallback(
    async (slidesData: SlideData[], name: string) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      setSaveStatus("saving");

      try {
        const res = await fetch(`/api/admin/deck-builder/${template.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slides_json: slidesData,
            name: name.trim() || "Untitled",
            theme: themeId,
            custom_theme: customTheme,
          }),
        });

        if (!res.ok) {
          throw new Error(`Save failed: ${res.status}`);
        }

        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave error:", err);
        setSaveStatus("unsaved");
        showToast("Failed to save changes", "error");
      } finally {
        isSavingRef.current = false;
      }
    },
    [template.id, showToast, themeId, customTheme]
  );

  /* ---- Manual save ------------------------------------------------ */
  const handleManualSave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    saveToServer(slides, templateName);
  }, [slides, templateName, saveToServer]);

  /* ---- Autosave: 5s debounce -------------------------------------- */
  useEffect(() => {
    // Skip initial render
    setSaveStatus("unsaved");

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveToServer(slides, templateName);
    }, 5000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, templateName, themeId, customTheme]);

  /* ================================================================ */
  /*  Present                                                          */
  /* ================================================================ */

  const handlePresent = useCallback(async () => {
    // Auto-save before presenting so the server route has the latest data
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    await saveToServer(slides, templateName);

    // Open the server-rendered presentation route
    window.open(`/api/slide/${template.id}/present`, "_blank");
  }, [slides, templateName, saveToServer, template.id]);

  /* ================================================================ */
  /*  Version restore handler                                          */
  /* ================================================================ */

  const handleVersionRestore = useCallback(
    (restoredSlides: SlideData[]) => {
      const ordered = recalculateOrder(restoredSlides);
      setSlides(ordered);
      setSelectedIndex(0);
      showToast("Version restored", "success");
    },
    [showToast]
  );

  /* ---- Theme change handlers --------------------------------------- */

  const handleThemeChange = useCallback((newThemeId: string) => {
    setThemeId(newThemeId);
    setCustomTheme(null); // reset customizations when switching presets
  }, []);

  const handleCustomThemeChange = useCallback(
    (newCustom: SlideThemeCustom | null) => {
      setCustomTheme(newCustom);
    },
    []
  );

  /* ================================================================ */
  /*  Slide mutations                                                  */
  /* ================================================================ */

  const updateCurrentSlide = useCallback(
    (updates: Partial<SlideData>) => {
      setSlides((prev) =>
        recalculateOrder(
          prev.map((s, i) => (i === selectedIndex ? { ...s, ...updates } : s))
        )
      );
    },
    [selectedIndex]
  );

  const addSlide = useCallback(() => {
    if (slides.length >= MAX_SLIDES) {
      showToast(`Maximum ${MAX_SLIDES} slides reached`, "warning");
      return;
    }

    const newSlide = createEmptySlide(selectedIndex + 1);
    setSlides((prev) => {
      const updated = [...prev];
      updated.splice(selectedIndex + 1, 0, newSlide);
      return recalculateOrder(updated);
    });
    setSelectedIndex(selectedIndex + 1);
  }, [slides.length, selectedIndex, showToast]);

  const duplicateSlide = useCallback(
    (index: number) => {
      if (slides.length >= MAX_SLIDES) {
        showToast(`Maximum ${MAX_SLIDES} slides reached`, "warning");
        return;
      }

      const source = slides[index];
      const copy: SlideData = {
        ...source,
        id: crypto.randomUUID(),
        order: index + 1,
      };

      setSlides((prev) => {
        const updated = [...prev];
        updated.splice(index + 1, 0, copy);
        return recalculateOrder(updated);
      });
      setSelectedIndex(index + 1);
    },
    [slides, showToast]
  );

  const deleteSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) {
        showToast("Cannot delete the only slide", "warning");
        return;
      }

      setSlides((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        return recalculateOrder(updated);
      });

      if (selectedIndex >= slides.length - 1) {
        setSelectedIndex(Math.max(0, slides.length - 2));
      } else if (selectedIndex > index) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    [slides, selectedIndex, showToast]
  );

  const moveSlide = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= slides.length) return;

      setSlides((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        return recalculateOrder(updated);
      });

      // Track selection
      if (selectedIndex === fromIndex) {
        setSelectedIndex(toIndex);
      } else if (
        selectedIndex > fromIndex &&
        selectedIndex <= toIndex
      ) {
        setSelectedIndex(selectedIndex - 1);
      } else if (
        selectedIndex < fromIndex &&
        selectedIndex >= toIndex
      ) {
        setSelectedIndex(selectedIndex + 1);
      }
    },
    [slides.length, selectedIndex]
  );

  /* ================================================================ */
  /*  Drag and Drop                                                    */
  /* ================================================================ */

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    },
    []
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, toIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndex;
      setDragIndex(null);
      setDragOverIndex(null);

      if (fromIndex === null || fromIndex === toIndex) return;
      moveSlide(fromIndex, toIndex);
    },
    [dragIndex, moveSlide]
  );

  /* ================================================================ */
  /*  Context Menu                                                     */
  /* ================================================================ */

  const handleContextMenu = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, slideIndex: index });
    },
    []
  );

  // Dismiss context menu on click outside or Escape
  useEffect(() => {
    if (!contextMenu) return;

    const handleClick = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  /* ================================================================ */
  /*  Background helpers                                               */
  /* ================================================================ */

  const bgType: BgType = currentSlide?.background?.type ?? "solid";

  const handleBgTypeChange = useCallback(
    (type: BgType) => {
      let value = "#050505";
      if (type === "gradient") {
        value = "linear-gradient(135deg, #050505 0%, #1a1a2e 100%)";
      } else if (type === "image") {
        value = "";
      }
      updateCurrentSlide({
        background: { type, value },
      });
    },
    [updateCurrentSlide]
  );

  const handleBgValueChange = useCallback(
    (value: string) => {
      updateCurrentSlide({
        background: { ...currentSlide.background, value },
      });
    },
    [updateCurrentSlide, currentSlide?.background]
  );

  /* ================================================================ */
  /*  Media Assets                                                     */
  /* ================================================================ */

  // Load media assets on mount
  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await fetch(
          `/api/admin/deck-builder/${template.id}/media`
        );
        if (res.ok) {
          const data = await res.json();
          setMediaAssets(data.assets ?? []);
        }
      } catch {
        // Media API may not be set up yet
      }
    }
    loadAssets();
  }, [template.id]);

  const handleUploadMedia = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingMedia(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `/api/admin/deck-builder/${template.id}/media`,
          { method: "POST", body: formData }
        );

        if (res.ok) {
          const data = await res.json();
          setMediaAssets((prev) => [data.asset, ...prev]);
          showToast("Image uploaded", "success");
        } else {
          showToast("Failed to upload image", "error");
        }
      } catch {
        showToast("Failed to upload image", "error");
      } finally {
        setUploadingMedia(false);
        // Reset input so same file can be re-uploaded
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [template.id, showToast]
  );

  const handleDeleteAsset = useCallback(
    async (assetId: string) => {
      if (!confirm("Delete this media asset?")) return;

      try {
        const res = await fetch(
          `/api/admin/deck-builder/${template.id}/media/${assetId}`,
          { method: "DELETE" }
        );

        if (res.ok || res.status === 204) {
          setMediaAssets((prev) => prev.filter((a) => a.id !== assetId));
          showToast("Asset deleted", "success");
        } else {
          showToast("Failed to delete asset", "error");
        }
      } catch {
        showToast("Failed to delete asset", "error");
      }
    },
    [template.id, showToast]
  );

  const handleInsertAsset = useCallback(
    (url: string) => {
      updateCurrentSlide({ image_url: url });
      showToast("Image applied to slide", "success");
    },
    [updateCurrentSlide, showToast]
  );

  /* ================================================================ */
  /*  Keyboard shortcuts                                               */
  /* ================================================================ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleManualSave]);

  /* ================================================================ */
  /*  Element selector listener                                        */
  /* ================================================================ */

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "elementSelected") {
        setSelectorMode(false);
        setSelectedElement({
          tag: e.data.tag,
          text: e.data.text,
          html: e.data.html,
        });
        // Selection pre-loaded into chat panel
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Send selector mode to preview iframes
  useEffect(() => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage(
        { type: selectorMode ? "enableSelector" : "disableSelector" },
        "*"
      );
    });
  }, [selectorMode]);

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      {/* ============================================================ */}
      {/*  Header Bar                                                   */}
      {/* ============================================================ */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] shrink-0">
        {/* Back */}
        <Link
          href="/admin/deck-builder"
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Back to templates"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
          <Link
            href="/admin/deck-builder"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            deck-builder
          </Link>
          <span>/</span>
        </div>

        {/* Template name (editable) */}
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="flex-1 max-w-sm bg-transparent border border-transparent hover:border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded px-2 py-1 font-semibold text-sm text-[var(--text-primary)] outline-none transition-colors"
          placeholder="Template name..."
        />

        {/* Save status */}
        <span
          className={`font-mono text-xs whitespace-nowrap ${
            saveStatus === "saved"
              ? "text-[var(--accent-primary)]"
              : saveStatus === "saving"
                ? "text-[var(--warning)]"
                : "text-orange-400"
          }`}
        >
          {saveStatus === "saved"
            ? "Saved"
            : saveStatus === "saving"
              ? "Saving..."
              : "Unsaved changes"}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleManualSave}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] rounded-md hover:border-[var(--accent-primary)]/40 transition-colors"
            title="Save (Cmd+S)"
          >
            <Save className="w-3.5 h-3.5" />
            save
          </button>

          <button
            onClick={handlePresent}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs text-[var(--bg-primary)] bg-[var(--accent-primary)] rounded-md hover:opacity-90 transition-opacity"
            title="Open presentation in new tab"
          >
            <Play className="w-3.5 h-3.5" />
            present
          </button>

          <ExportMenu
            slides={slides}
            themeId={themeId}
            customTheme={customTheme}
            templateName={templateName}
          />

          <button
            onClick={() => setVersionHistoryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] rounded-md hover:border-[var(--accent-primary)]/40 transition-colors"
            title="Version history"
          >
            <History className="w-3.5 h-3.5" />
            history
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Three-panel layout                                           */}
      {/* ============================================================ */}
      <div className="flex flex-1 min-h-0">
        {/* ---------------------------------------------------------- */}
        {/*  Left Panel — Slide Sorter                                  */}
        {/* ---------------------------------------------------------- */}
        <div
          className="w-[220px] shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col outline-none"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              setSelectedIndex((prev) => Math.min(prev + 1, slides.length - 1));
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }
          }}
        >
          {/* Slide list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {slides.map((slide, index) => {
              const isSelected = index === selectedIndex;
              const isDragging = index === dragIndex;
              const isDragOver = index === dragOverIndex && dragIndex !== index;

              return (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  data-slide-index={index}
                  onClick={() => setSelectedIndex(index)}
                  onContextMenu={(e) => handleContextMenu(e, index)}
                  ref={(el) => {
                    if (isSelected && el) {
                      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                  }}
                  className={`relative cursor-pointer rounded-md border transition-all duration-150 group ${
                    isSelected
                      ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30 shadow-[0_0_8px_rgba(146,176,144,0.15)]"
                      : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
                  } ${isDragging ? "opacity-40" : ""} ${
                    isDragOver
                      ? "border-t-2 border-t-[var(--accent-primary)]"
                      : ""
                  }`}
                >
                  {/* Live mini-preview via iframe */}
                  <div className="w-full aspect-video rounded-t-md overflow-hidden relative">
                    <SlideThumbnail slide={slide} themeId={themeId} customTheme={customTheme} />
                  </div>

                  {/* Slide number overlay */}
                  <div className="absolute top-1 left-1 bg-black/70 rounded px-1.5 py-0.5">
                    <span className="font-mono text-[9px] text-white/90 font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Grip handle on hover */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3 h-3 text-white/40" />
                  </div>

                  {/* Layout label */}
                  <div className="px-1.5 py-1 bg-[var(--bg-tertiary)] rounded-b-md">
                    <span className="font-mono text-[9px] text-[var(--text-muted)]">
                      {slide.layout}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add slide button */}
          <div className="p-2 border-t border-[var(--border-subtle)]">
            <button
              onClick={addSlide}
              disabled={slides.length >= MAX_SLIDES}
              className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              add slide
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  Center Panel — Slide Editor                                */}
        {/* ---------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Live Slide Preview — rendered at 1920×1080 and scaled to fit */}
            {currentSlide && <CenterSlidePreview
              slide={currentSlide}
              themeId={themeId}
              customTheme={customTheme}
              slideIndex={selectedIndex}
              totalSlides={slides.length}
              selectorMode={selectorMode}
            />}

            {/* Title input */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={currentSlide?.title ?? ""}
                onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[var(--border-subtle)] focus:border-[var(--accent-primary)] text-xl font-semibold text-[var(--text-primary)] outline-none py-2 transition-colors placeholder:text-[var(--text-muted)]"
                placeholder="Slide title..."
              />
            </div>

            {/* Body textarea or Custom HTML editor */}
            {currentSlide?.html ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider">
                    Custom HTML
                  </label>
                  <button
                    onClick={() => updateCurrentSlide({ html: undefined })}
                    className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                  >
                    [switch to markdown]
                  </button>
                </div>
                <textarea
                  value={currentSlide.html}
                  onChange={(e) => updateCurrentSlide({ html: e.target.value })}
                  rows={16}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-lg font-mono text-xs text-[var(--text-primary)] p-4 outline-none resize-y transition-colors placeholder:text-[var(--text-muted)]"
                  placeholder="<div style='display:flex;...'>...</div>"
                />
                <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                  Raw HTML — bypasses layout system. Use the AI chat to generate complex slides.
                </p>
              </div>
            ) : (
              <div>
                <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Body
                </label>
                <textarea
                  value={currentSlide?.body ?? ""}
                  onChange={(e) => updateCurrentSlide({ body: e.target.value })}
                  rows={12}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-lg font-mono text-sm text-[var(--text-primary)] p-4 outline-none resize-y transition-colors placeholder:text-[var(--text-muted)]"
                  placeholder="Slide body content... (supports **bold**, *italic*, - lists, ```code```, [links](url))"
                />
              </div>
            )}

            {/* Image URL (for image layouts) */}
            {(currentSlide?.layout === "image-left" ||
              currentSlide?.layout === "image-right") && (
              <div>
                <label className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  value={currentSlide?.image_url ?? ""}
                  onChange={(e) =>
                    updateCurrentSlide({ image_url: e.target.value })
                  }
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-lg font-mono text-sm text-[var(--text-primary)] px-4 py-2 outline-none transition-colors placeholder:text-[var(--text-muted)]"
                  placeholder="https://example.com/image.png"
                />
              </div>
            )}

            {/* ====================================================== */}
            {/*  Layout Picker                                          */}
            {/* ====================================================== */}
            <CollapsibleSection
              title="Layout"
              isOpen={layoutOpen}
              onToggle={() => setLayoutOpen(!layoutOpen)}
            >
              <SlideLayoutPicker
                activeLayout={currentSlide?.layout ?? "title-body"}
                onSelect={(layout: SlideLayout) =>
                  updateCurrentSlide({ layout })
                }
              />
            </CollapsibleSection>

            {/* ====================================================== */}
            {/*  Background Settings                                    */}
            {/* ====================================================== */}
            <CollapsibleSection
              title="Background"
              isOpen={bgOpen}
              onToggle={() => setBgOpen(!bgOpen)}
            >
              {/* Type toggle */}
              <div className="flex gap-1 mb-3">
                {(["solid", "gradient", "image"] as BgType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBgTypeChange(type)}
                    className={`px-3 py-1.5 font-mono text-xs rounded-md border transition-colors ${
                      bgType === type
                        ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                        : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Solid */}
              {bgType === "solid" && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border border-[var(--border-subtle)] shrink-0"
                    style={{
                      backgroundColor: currentSlide?.background?.value ?? "#050505",
                    }}
                  />
                  <input
                    type="text"
                    value={currentSlide?.background?.value ?? "#050505"}
                    onChange={(e) => handleBgValueChange(e.target.value)}
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] rounded px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none transition-colors"
                    placeholder="#050505"
                  />
                  <input
                    type="color"
                    value={currentSlide?.background?.value ?? "#050505"}
                    onChange={(e) => handleBgValueChange(e.target.value)}
                    className="w-8 h-8 cursor-pointer bg-transparent border-0"
                  />
                </div>
              )}

              {/* Gradient */}
              {bgType === "gradient" && (
                <div className="space-y-2">
                  <div
                    className="w-full h-8 rounded border border-[var(--border-subtle)]"
                    style={{
                      background: currentSlide?.background?.value ?? "",
                    }}
                  />
                  <input
                    type="text"
                    value={currentSlide?.background?.value ?? ""}
                    onChange={(e) => handleBgValueChange(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] rounded px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none transition-colors"
                    placeholder="linear-gradient(135deg, #050505 0%, #1a1a2e 100%)"
                  />
                  <p className="font-mono text-[10px] text-[var(--text-muted)]">
                    Enter a CSS gradient value
                  </p>
                </div>
              )}

              {/* Image */}
              {bgType === "image" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentSlide?.background?.value ?? ""}
                    onChange={(e) => handleBgValueChange(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] rounded px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none transition-colors"
                    placeholder="https://example.com/bg.jpg"
                  />
                  {mediaAssets.length > 0 && (
                    <div>
                      <p className="font-mono text-[10px] text-[var(--text-muted)] mb-1">
                        Or select from media assets:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {mediaAssets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => handleBgValueChange(asset.url)}
                            className="w-10 h-10 rounded border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] overflow-hidden transition-colors"
                          >
                            <img
                              src={asset.url}
                              alt={asset.filename}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CollapsibleSection>

            {/* ====================================================== */}
            {/*  Media Assets                                           */}
            {/* ====================================================== */}
            <CollapsibleSection
              title="Media Assets"
              isOpen={mediaOpen}
              onToggle={() => setMediaOpen(!mediaOpen)}
            >
              {/* Upload button */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded-md transition-colors disabled:opacity-50"
                >
                  {uploadingMedia ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {uploadingMedia ? "uploading..." : "upload image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMedia}
                  className="hidden"
                />
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {mediaAssets.length} asset{mediaAssets.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Asset grid */}
              {mediaAssets.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {mediaAssets.map((asset) => (
                    <div key={asset.id} className="relative group">
                      <button
                        onClick={() => handleInsertAsset(asset.url)}
                        className="w-full aspect-square rounded-md border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] overflow-hidden transition-colors"
                        title={`Insert ${asset.filename}`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--error)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete asset"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                      <p className="font-mono text-[8px] text-[var(--text-muted)] truncate mt-0.5">
                        {asset.filename}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-[var(--text-muted)] text-center py-4">
                  No media assets uploaded yet.
                </p>
              )}
            </CollapsibleSection>

            {/* ====================================================== */}
            {/*  Theme Editor                                           */}
            {/* ====================================================== */}
            <CollapsibleSection
              title="Theme"
              isOpen={themeOpen}
              onToggle={() => setThemeOpen(!themeOpen)}
            >
              <ThemeEditor
                currentTheme={themeId}
                customTheme={customTheme}
                onThemeChange={handleThemeChange}
                onCustomThemeChange={handleCustomThemeChange}
              />
            </CollapsibleSection>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  Right Panel — AI Chat (resizable)                          */}
        {/* ---------------------------------------------------------- */}
        <div
          className="shrink-0 border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col relative"
          style={{ width: `${chatPanelWidth}px` }}
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-10 hover:bg-[var(--accent-primary)]/20 active:bg-[var(--accent-primary)]/30 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = chatPanelWidth;
              const onMove = (ev: MouseEvent) => {
                const delta = startX - ev.clientX;
                setChatPanelWidth(Math.max(280, Math.min(700, startWidth + delta)));
              };
              const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          />
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="font-mono text-xs text-[var(--text-primary)]">AI Chat</span>
            </div>
            <button
              onClick={() => setChatKey((k) => k + 1)}
              className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              title="Start a new conversation (clears chat history)"
            >
              [new chat]
            </button>
          </div>

          {/* Chat panel */}
          <div className="flex-1 min-h-0">
              <ChatPanel
                key={chatKey}
                templateId={template.id}
                skipHistory={chatKey > 0}
                slides={slides}
                selectedSlideIndex={selectedIndex}
                selectedElement={selectedElement}
                onSelectedElementConsumed={() => setSelectedElement(null)}
                selectorMode={selectorMode}
                onToggleSelector={() => setSelectorMode(!selectorMode)}
                onSlidesUpdate={(newSlides) => {
                  setSlides(newSlides);
                  setSaveStatus("unsaved");
                }}
                onThemeChange={(newTheme) => {
                  setThemeId(newTheme);
                  setSaveStatus("unsaved");
                }}
                onCustomThemeChange={(ct) => {
                  setCustomTheme(ct);
                  setSaveStatus("unsaved");
                }}
              />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Context Menu                                                 */}
      {/* ============================================================ */}
      {contextMenu && (
        <div
          className="fixed z-[100] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <ContextMenuItem
            onClick={() => {
              duplicateSlide(contextMenu.slideIndex);
              setContextMenu(null);
            }}
            icon={<Copy className="w-3.5 h-3.5" />}
            label="Duplicate"
          />
          <ContextMenuItem
            onClick={() => {
              deleteSlide(contextMenu.slideIndex);
              setContextMenu(null);
            }}
            icon={<Trash2 className="w-3.5 h-3.5" />}
            label="Delete"
            danger
          />
          <div className="h-px bg-[var(--border-subtle)] my-1" />
          <ContextMenuItem
            onClick={() => {
              moveSlide(contextMenu.slideIndex, contextMenu.slideIndex - 1);
              setContextMenu(null);
            }}
            icon={<ChevronUp className="w-3.5 h-3.5" />}
            label="Move Up"
            disabled={contextMenu.slideIndex === 0}
          />
          <ContextMenuItem
            onClick={() => {
              moveSlide(contextMenu.slideIndex, contextMenu.slideIndex + 1);
              setContextMenu(null);
            }}
            icon={<ChevronDown className="w-3.5 h-3.5" />}
            label="Move Down"
            disabled={contextMenu.slideIndex === slides.length - 1}
          />
        </div>
      )}

      {/* Version History Drawer */}
      <VersionHistory
        templateId={template.id}
        isOpen={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        onRestore={handleVersionRestore}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

/** Renders a single slide at 1920×1080 inside an iframe, scaled to fit the container */
/** Mini slide thumbnail rendered via iframe at 1920×1080 scaled to ~200px width */
function SlideThumbnail({
  slide,
  themeId,
  customTheme,
}: {
  slide: SlideData;
  themeId: string;
  customTheme: SlideThemeCustom | null;
}) {
  const html = renderSlidesToHTML(
    [{ ...slide, order: 0 }],
    themeId,
    { showProgress: false, customTheme }
  );

  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className="absolute top-0 left-0 border-0 pointer-events-none"
      style={{
        width: "1920px",
        height: "1080px",
        transform: "scale(0.107)",
        transformOrigin: "top left",
      }}
      title="Slide thumbnail"
      loading="lazy"
    />
  );
}

function CenterSlidePreview({
  slide,
  themeId,
  customTheme,
  slideIndex,
  totalSlides,
  selectorMode = false,
}: {
  slide: SlideData;
  themeId: string;
  customTheme: SlideThemeCustom | null;
  slideIndex: number;
  totalSlides: number;
  selectorMode?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = expanded ? expandedContainerRef.current : containerRef.current;
    if (!el) return;
    const measure = () => setScale(el.offsetWidth / 1920);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  const html = renderSlidesToHTML(
    [{ ...slide, order: 0 }],
    themeId,
    { showProgress: false, customTheme }
  );

  const iframeEl = (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className={`absolute top-0 left-0 border-0 ${selectorMode ? "" : "pointer-events-none"}`}
      style={{
        width: "1920px",
        height: "1080px",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      title="Slide preview"
    />
  );

  const bottomBar = (
    <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between">
      <span className="font-mono text-[10px] text-[var(--text-muted)] bg-black/50 rounded px-2 py-0.5">
        Slide {slideIndex + 1} of {totalSlides} {slide.html ? "· custom" : `· ${slide.layout}`}
      </span>
      <div className="flex items-center gap-1">
        {selectorMode && (
          <span className="font-mono text-[10px] text-[var(--accent-primary)] bg-black/60 rounded px-2 py-0.5 animate-pulse">
            Click an element
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] bg-black/50 hover:bg-black/70 rounded px-2 py-0.5 transition-colors"
        >
          {expanded ? "shrink" : "expand"}
        </button>
      </div>
    </div>
  );

  const previewBox = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg shadow-lg ${selectorMode ? "ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]" : "border border-[var(--border-subtle)]"}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {iframeEl}
      {bottomBar}
    </div>
  );

  if (expanded) {
    return (
      <>
        {/* Placeholder in flow so editor doesn't jump */}
        <div style={{ aspectRatio: "16 / 9" }} className="rounded-lg border border-dashed border-[var(--border-subtle)] flex items-center justify-center">
          <span className="font-mono text-xs text-[var(--text-muted)]">Preview expanded — press Esc to close</span>
        </div>
        {/* Fullscreen overlay */}
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-10" onClick={() => setExpanded(false)}>
          <div className="w-full max-w-[1600px]" onClick={(e) => e.stopPropagation()}>
            {previewBox(expandedContainerRef)}
          </div>
        </div>
      </>
    );
  }

  return previewBox(containerRef);
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          {title}
        </span>
        <ChevronRight
          className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4 border-t border-[var(--border-subtle)]">{children}</div>}
    </div>
  );
}

function ContextMenuItem({
  onClick,
  icon,
  label,
  danger,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? "text-[var(--error)] hover:bg-[var(--error)]/10"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
