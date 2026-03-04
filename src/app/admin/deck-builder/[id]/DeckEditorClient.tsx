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
  Share2,
} from "lucide-react";
import type {
  SlideData,
  SlideLayout,
  SlideMediaAsset,
  SlideThemeCustom,
} from "@/types/deck-builder";
import { MAX_SLIDES, createEmptySlide } from "@/types/deck-builder";
import { renderSlidesToHTML } from "@/lib/deck-builder/html-renderer";
import { rewriteS3ToProxy } from "@/lib/deck-builder/rewrite-s3-urls";
import { SlideLayoutPicker } from "@/app/components/deck-builder/SlideLayoutPicker";
import { ExportMenu } from "@/app/components/deck-builder/ExportMenu";
import { VersionHistory } from "@/app/components/deck-builder/VersionHistory";
import { ThemeEditor } from "@/app/components/deck-builder/ThemeEditor";
import { ChatPanel } from "@/app/components/deck-builder/ChatPanel";
import { SharePanel } from "@/app/components/deck-builder/SharePanel";

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

  /* ---- Version history, share & theme state ----------------------- */
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
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

  // Track pending save data so we can retry after an in-flight save completes
  const pendingSaveRef = useRef<{ slides: SlideData[]; name: string } | null>(null);

  const saveToServer = useCallback(
    async (slidesData: SlideData[], name: string) => {
      // If a save is in flight, queue this one for after it completes
      if (isSavingRef.current) {
        pendingSaveRef.current = { slides: slidesData, name };
        return;
      }
      isSavingRef.current = true;
      pendingSaveRef.current = null;
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
        // If edits arrived while we were saving, save again with the latest data
        if (pendingSaveRef.current) {
          const { slides: ps, name: pn } = pendingSaveRef.current;
          pendingSaveRef.current = null;
          saveToServer(ps, pn);
        }
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

  /* ================================================================ */
  /*  Inline edit listener                                             */
  /* ================================================================ */

  // Use refs to avoid stale closures in the message handler
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "inlineEdit") return;

      const { tag, innerHTML, originalInnerHTML, selector } = e.data as {
        type: string;
        tag: string;
        innerHTML: string;
        originalInnerHTML: string;
        selector: string;
      };

      // Skip if content unchanged
      if (innerHTML === originalInnerHTML) return;

      const slide = slidesRef.current[selectedIndexRef.current];
      if (!slide) return;

      // Helper: strip HTML tags to get plain text
      const stripHTML = (html: string) =>
        html.replace(/<[^>]*>/g, "").trim();

      if (slide.html) {
        // --- Custom HTML slide: find & replace in the HTML string ---
        const escapedOriginal = originalInnerHTML.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        // Match: <tag ...>originalInnerHTML</tag>
        const tagPattern = new RegExp(
          `(<${tag}[^>]*>)${escapedOriginal}(</${tag}>)`,
          "g"
        );
        const matches = slide.html.match(tagPattern);

        let updatedHtml: string | null = null;

        if (matches && matches.length === 1) {
          // Unique match — replace directly
          updatedHtml = slide.html.replace(
            tagPattern,
            `$1${innerHTML}$2`
          );
        } else if (matches && matches.length > 1) {
          // Multiple matches — use selector hint to disambiguate.
          // Replace only the first occurrence as a fallback since
          // the selector narrows context but we can't parse it perfectly
          // in the raw HTML string. Replace the nth match if nth-of-type
          // is present.
          const nthMatch = selector.match(/:nth-of-type\((\d+)\)/);
          const targetIndex = nthMatch ? parseInt(nthMatch[1], 10) - 1 : 0;
          let matchCount = 0;
          updatedHtml = slide.html.replace(tagPattern, (match, open, close) => {
            if (matchCount++ === targetIndex) {
              return `${open}${innerHTML}${close}`;
            }
            return match;
          });
        }

        if (updatedHtml && updatedHtml !== slide.html) {
          updateCurrentSlide({ html: updatedHtml });
          showToast("Text updated", "success");
        } else if (!matches || matches.length === 0) {
          showToast("Could not apply edit — use chat instead", "warning");
        }
      } else {
        // --- Layout slide: update title or body based on tag ---
        const plainText = stripHTML(innerHTML);

        if (/^h[1-3]$/i.test(tag)) {
          updateCurrentSlide({ title: plainText });
          showToast("Text updated", "success");
        } else if (/^(p|li|span)$/i.test(tag)) {
          updateCurrentSlide({ body: plainText });
          showToast("Text updated", "success");
        } else {
          showToast("Could not apply edit — use chat instead", "warning");
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [updateCurrentSlide, showToast]);

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
            onClick={() => setSharePanelOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] rounded-md hover:border-[var(--accent-primary)]/40 transition-colors"
            title="Share settings"
          >
            <Share2 className="w-3.5 h-3.5" />
            share
          </button>

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
        {/*  Center Panel — Slide Preview (Google Slides style)         */}
        {/* ---------------------------------------------------------- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview area — slide centered in available space */}
          <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden p-4">
            {currentSlide && <CenterSlidePreview
              slide={currentSlide}
              themeId={themeId}
              customTheme={customTheme}
              slideIndex={selectedIndex}
              totalSlides={slides.length}
              templateId={template.id}
              selectorMode={selectorMode}
            />}
          </div>
          {/* Bottom bar — source toggle */}
          {currentSlide?.html && (
            <SourceCodePanel
              slide={currentSlide}
              onUpdate={updateCurrentSlide}
            />
          )}
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

      {/* Share Panel Drawer */}
      <SharePanel
        templateId={template.id}
        templateName={templateName}
        isOpen={sharePanelOpen}
        onClose={() => setSharePanelOpen(false)}
        showToast={showToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

/** Collapsible HTML source code viewer/editor for power users */
function SourceCodePanel({
  slide,
  onUpdate,
}: {
  slide: SlideData | undefined;
  onUpdate: (updates: Partial<SlideData>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!slide?.html) return null;

  return (
    <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors"
      >
        <span>{"</>"} View Source</span>
        <span>{isOpen ? "▾" : "▸"}</span>
      </button>
      {isOpen && (
        <textarea
          value={slide.html}
          onChange={(e) => onUpdate({ html: e.target.value })}
          rows={20}
          className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] p-4 outline-none resize-y"
          spellCheck={false}
        />
      )}
    </div>
  );
}

/** Check if a slide needs server-rendered iframe (has scripts or is a full document) */
function needsIframeIsolation(slide: SlideData): boolean {
  if (!slide.html) return false;
  return slide.html.includes('<script') || slide.html.includes('<!DOCTYPE') || slide.html.includes('<html');
}

/**
 * Inline script injected into custom HTML slide iframes for element selector support.
 * Handles: enableSelector/disableSelector PostMessage, hover highlight, click-to-select.
 */
const SELECTOR_SCRIPT = `<script>(function(){
var sa=false,hl=null;
function en(){sa=true;document.body.style.cursor='crosshair';hl=document.createElement('div');hl.id='sh';hl.style.cssText='position:fixed;pointer-events:none;z-index:99999;border:2px solid #92B090;background:rgba(146,176,144,0.12);border-radius:3px;transition:all .1s;display:none;';document.body.appendChild(hl);var lb=document.createElement('div');lb.id='sl';lb.style.cssText='position:fixed;pointer-events:none;z-index:99999;font-family:monospace;font-size:11px;background:#0a0908;color:#92B090;border:1px solid #92B090;padding:2px 6px;border-radius:3px;display:none;white-space:nowrap;';document.body.appendChild(lb);}
function di(){sa=false;document.body.style.cursor='';var h=document.getElementById('sh'),l=document.getElementById('sl');if(h)h.remove();if(l)l.remove();}
document.addEventListener('mousemove',function(e){if(!sa)return;var el=document.elementFromPoint(e.clientX,e.clientY);if(!el||el.id==='sh'||el.id==='sl')return;var r=el.getBoundingClientRect(),h=document.getElementById('sh'),l=document.getElementById('sl');if(h){h.style.display='block';h.style.left=r.left+'px';h.style.top=r.top+'px';h.style.width=r.width+'px';h.style.height=r.height+'px';}if(l){var t=el.tagName.toLowerCase(),c=el.className?'.'+String(el.className).split(' ').slice(0,2).join('.'):'',x=(el.textContent||'').trim().slice(0,30);l.textContent='<'+t+c+'>'+(x?' "'+x+(x.length>=30?'...':'')+'"':'');l.style.display='block';l.style.left=r.left+'px';l.style.top=Math.max(0,r.top-24)+'px';}});
document.addEventListener('click',function(e){if(!sa)return;e.preventDefault();e.stopPropagation();var el=document.elementFromPoint(e.clientX,e.clientY);if(!el||el.id==='sh'||el.id==='sl')return;var o=el.outerHTML;if(o.length>500)o=o.slice(0,497)+'...';window.parent.postMessage({type:'elementSelected',tag:el.tagName.toLowerCase(),text:(el.textContent||'').trim().slice(0,100),html:o,styles:el.getAttribute('style')||'',rect:{x:Math.round(el.getBoundingClientRect().x),y:Math.round(el.getBoundingClientRect().y),w:Math.round(el.getBoundingClientRect().width),h:Math.round(el.getBoundingClientRect().height)}},'*');di();},true);
window.addEventListener('message',function(e){if(e.data&&e.data.type==='enableSelector')en();if(e.data&&e.data.type==='disableSelector')di();});
})();</script>`;

/**
 * Inline script injected into slide iframes to support double-click-to-edit.
 * On dblclick of a text element: make it contenteditable, track original content,
 * on blur/Enter send inlineEdit PostMessage to parent.
 */
const INLINE_EDIT_SCRIPT = `<script>(function(){
var EDITABLE='h1,h2,h3,p,li,span,td,th,a,label,blockquote';
var editing=null,origHTML='';
function buildSelector(el){
  var tag=el.tagName.toLowerCase();
  var parts=[tag];
  if(el.id)parts=[tag+'#'+el.id];
  else if(el.className&&typeof el.className==='string'){
    parts=[tag+'.'+el.className.trim().split(/\\s+/).join('.')];
  }
  var parent=el.parentElement;
  if(parent&&parent!==document.body&&parent!==document.documentElement){
    var siblings=parent.querySelectorAll(':scope > '+tag);
    if(siblings.length>1){
      for(var i=0;i<siblings.length;i++){
        if(siblings[i]===el){parts.push(':nth-of-type('+(i+1)+')');break;}
      }
    }
  }
  return parts.join('');
}
function finish(){
  if(!editing)return;
  var el=editing;
  editing=null;
  el.removeAttribute('contenteditable');
  el.style.outline='';
  el.style.outlineOffset='';
  el.style.minHeight='';
  var newHTML=el.innerHTML;
  window.parent.postMessage({
    type:'inlineEdit',
    tag:el.tagName.toLowerCase(),
    innerHTML:newHTML,
    originalInnerHTML:origHTML,
    selector:buildSelector(el)
  },'*');
}
document.addEventListener('dblclick',function(e){
  var el=e.target;
  while(el&&el!==document.body){
    if(el.matches&&el.matches(EDITABLE))break;
    el=el.parentElement;
  }
  if(!el||el===document.body)return;
  if(editing===el)return;
  if(editing)finish();
  editing=el;
  origHTML=el.innerHTML;
  el.setAttribute('contenteditable','true');
  el.style.outline='2px solid #92B090';
  el.style.outlineOffset='2px';
  el.style.minHeight='1em';
  el.focus();
  var sel=window.getSelection();
  if(sel){sel.selectAllChildren(el);}
});
document.addEventListener('keydown',function(e){
  if(!editing)return;
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();finish();}
  if(e.key==='Escape'){editing.innerHTML=origHTML;finish();}
});
document.addEventListener('click',function(e){
  if(!editing)return;
  if(!editing.contains(e.target)){finish();}
});
})();<\/script>`;

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
  // Always use srcdoc for thumbnails — ensures instant refresh when agent edits slides.
  // For custom HTML slides, wrap in a minimal document with S3 URLs rewritten.
  const html = slide.html
    ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;background:#0a0908;}</style></head><body>${rewriteS3ToProxy(slide.html)}</body></html>`
    : renderSlidesToHTML([{ ...slide, order: 0 }], themeId, { showProgress: false, customTheme });

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

type ZoomLevel = "fit" | 50 | 75 | 100;

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
  templateId: string;
  selectorMode?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.5);
  const [zoom, setZoom] = useState<ZoomLevel>("fit");

  // Measure container and compute fit scale
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // Fit with padding — leave some breathing room
      const s = Math.min(w / 1920, h / 1080) * 0.95;
      setFitScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const activeScale = zoom === "fit" ? fitScale : zoom / 100;
  const displayPercent = Math.round(activeScale * 100);

  // Build srcdoc — always use srcdoc for instant refresh
  const slideHtml = slide.html ? rewriteS3ToProxy(slide.html) : "";
  const html = slide.html
    ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;background:#0a0908;}</style></head><body>${slideHtml}${SELECTOR_SCRIPT}${INLINE_EDIT_SCRIPT}</body></html>`
    : renderSlidesToHTML([{ ...slide, order: 0 }], themeId, { showProgress: false, customTheme }).replace("</body>", `${INLINE_EDIT_SCRIPT}</body>`);

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col">
      {/* Slide canvas — centered in available space */}
      <div className={`flex-1 flex items-center justify-center overflow-auto ${zoom !== "fit" ? "overflow-scroll" : "overflow-hidden"}`}>
        <div
          className={`relative shrink-0 rounded-lg shadow-2xl ${selectorMode ? "ring-2 ring-[var(--accent-primary)]" : "border border-[var(--border-subtle)]/50"}`}
          style={{
            width: 1920 * activeScale,
            height: 1080 * activeScale,
          }}
        >
          <iframe
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin"
            className="absolute top-0 left-0 border-0"
            style={{
              width: "1920px",
              height: "1080px",
              transform: `scale(${activeScale})`,
              transformOrigin: "top left",
            }}
            title="Slide preview"
          />
          {/* Selector mode indicator */}
          {selectorMode && (
            <div className="absolute top-2 right-2 z-10">
              <span className="font-mono text-[10px] text-[var(--accent-primary)] bg-black/70 rounded px-2 py-0.5 animate-pulse">
                Click an element
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Zoom toolbar — bottom center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-[var(--bg-secondary)]/90 backdrop-blur-sm border border-[var(--border-subtle)] rounded-full px-1.5 py-0.5 shadow-lg">
        <span className="font-mono text-[10px] text-[var(--text-muted)] px-1.5 min-w-[36px] text-center">
          {displayPercent}%
        </span>
        <div className="w-px h-3 bg-[var(--border-subtle)]" />
        {(["fit", 50, 75, 100] as ZoomLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => setZoom(level)}
            className={`font-mono text-[10px] px-2 py-0.5 rounded-full transition-colors ${
              zoom === level
                ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {level === "fit" ? "Fit" : `${level}%`}
          </button>
        ))}
        <div className="w-px h-3 bg-[var(--border-subtle)]" />
        <span className="font-mono text-[9px] text-[var(--text-muted)] px-1">
          {slideIndex + 1}/{totalSlides}
        </span>
      </div>
    </div>
  );
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
