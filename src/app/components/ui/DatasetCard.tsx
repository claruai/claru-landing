"use client";

import Link from "next/link";
import Image from "next/image";
import { Video, ImageIcon, Layers, Bot } from "lucide-react";
import type { Dataset, DatasetCategory } from "@/types/data-catalog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DatasetCardProps {
  dataset: Dataset & {
    category?: Pick<DatasetCategory, "name" | "slug"> | null;
    signedThumbnailUrl?: string | null;
  };
  variant: "public" | "portal";
  href: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const modalityIcons: Record<string, React.ElementType> = {
  short_form: Video,
  long_form: Video,
  cinematic: Video,
  game_capture: Layers,
};

function getModalityIcon(type: string): React.ElementType {
  return modalityIcons[type] ?? Video;
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k hrs`;
  return `${hours.toFixed(0)} hrs`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DatasetCard({
  dataset,
  variant,
  href,
}: DatasetCardProps) {
  const ModalityIcon = getModalityIcon(dataset.type);

  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--border-accent)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(146,176,144,0.08)]">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-tertiary)]">
          {dataset.signedThumbnailUrl ? (
            <Image
              src={dataset.signedThumbnailUrl}
              alt={dataset.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ModalityIcon
                className="h-10 w-10 text-[var(--text-muted)]"
                strokeWidth={1}
              />
            </div>
          )}

          {/* Type badge (top-right) */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-primary)]/80 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] backdrop-blur-sm">
            <ModalityIcon className="h-3 w-3" strokeWidth={1.5} />
            {dataset.type.replace("_", " ")}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category badge */}
          {dataset.category && (
            <span className="inline-block rounded-full bg-[var(--accent-primary)]/10 px-2.5 py-0.5 text-xs font-mono text-[var(--accent-primary)]">
              {dataset.category.name}
            </span>
          )}

          {/* Name */}
          <h3 className="text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200 line-clamp-2">
            {dataset.name}
          </h3>

          {/* Subcategory */}
          {dataset.subcategory && (
            <p className="text-xs font-mono text-[var(--text-muted)] truncate">
              {dataset.subcategory}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 pt-1 border-t border-[var(--border-subtle)]">
            {variant === "portal" && (
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                <span className="text-[var(--accent-primary)]">
                  {dataset.total_samples.toLocaleString()}
                </span>{" "}
                samples
              </span>
            )}
            {dataset.total_duration_hours > 0 && (
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                <span className="text-[var(--accent-primary)]">
                  {formatDuration(dataset.total_duration_hours)}
                </span>{" "}
                duration
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
