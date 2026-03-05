"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Download, FileText, Globe, Printer } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ExportMenuProps {
  templateId: string;
  templateName: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "presentation";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ExportMenu({
  templateId,
  templateName,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Server-rendered presentation URL — same route used by present mode and share page.
  // Uses iframes for all custom HTML slides, so unbalanced tags won't break rendering.
  const presentUrl = `/api/slide/${templateId}/present`;

  /* ---- Download HTML ------------------------------------------------ */

  const handleDownloadHTML = useCallback(async () => {
    setIsOpen(false);
    try {
      const res = await fetch(presentUrl);
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(templateName)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      // Fallback: open the present URL directly
      window.open(presentUrl, "_blank");
    }
  }, [presentUrl, templateName]);

  /* ---- Open in Browser ---------------------------------------------- */

  const handleOpenInBrowser = useCallback(() => {
    window.open(presentUrl, "_blank");
    setIsOpen(false);
  }, [presentUrl]);

  /* ---- Export PDF (via print) --------------------------------------- */

  const handleExportPDF = useCallback(() => {
    // Create a hidden iframe pointing to the server-rendered presentation
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "-10000px";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.opacity = "0";
    document.body.appendChild(iframe);

    iframe.src = presentUrl;
    iframe.onload = () => {
      try {
        iframe.contentWindow?.print();
      } catch {
        window.open(presentUrl, "_blank");
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 60_000);
    };

    setIsOpen(false);
  }, [presentUrl]);

  /* ---- Click-outside & Escape dismissal ----------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /* ---- Render ------------------------------------------------------- */

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] rounded-md hover:border-[var(--accent-primary)]/40 transition-colors"
        title="Export presentation"
      >
        <Download className="w-3.5 h-3.5" />
        export
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-[var(--bg-card,var(--bg-secondary))] border border-[var(--border-subtle)] rounded-lg shadow-xl z-50 min-w-[200px] py-1 animate-[fadeIn_0.15s_ease-out]">
          <ExportMenuItem
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Download HTML"
            description="Save as standalone file"
            onClick={handleDownloadHTML}
          />
          <ExportMenuItem
            icon={<Printer className="w-3.5 h-3.5" />}
            label="Export PDF"
            description="Print to PDF via browser"
            onClick={handleExportPDF}
          />
          <div className="h-px bg-[var(--border-subtle)] my-1" />
          <ExportMenuItem
            icon={<Globe className="w-3.5 h-3.5" />}
            label="Open in Browser"
            description="Preview in new tab"
            onClick={handleOpenInBrowser}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Menu Item                                                          */
/* ------------------------------------------------------------------ */

function ExportMenuItem({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-[var(--bg-tertiary)] transition-colors group"
    >
      <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] mt-0.5 transition-colors">
        {icon}
      </span>
      <div>
        <span className="block font-mono text-xs text-[var(--text-primary)]">
          {label}
        </span>
        <span className="block font-mono text-[10px] text-[var(--text-muted)]">
          {description}
        </span>
      </div>
    </button>
  );
}
