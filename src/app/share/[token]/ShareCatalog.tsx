"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDown, Film, Clock, Maximize2 } from "lucide-react";

export interface ShareClip {
  id: string;
  filename: string | null;
  signedUrl: string;
  caption: string | null;
  metadata: Record<string, unknown> | null;
  enrichment: Record<string, unknown> | null;
  techSpecs: {
    duration: number | null;
    width: number | null;
    height: number | null;
    fps: number | null;
  };
}

interface ShareCatalogProps {
  clips: ShareClip[];
  datasetName: string;
  companyName: string | null;
  token: string;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function ClipCard({
  clip,
  onRefreshUrls,
}: {
  clip: ShareClip;
  onRefreshUrls: () => Promise<Map<string, string>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(clip.signedUrl);

  const handleError = useCallback(async () => {
    const freshUrls = await onRefreshUrls();
    const newUrl = freshUrls.get(clip.id);
    if (newUrl && newUrl !== currentUrl) {
      setCurrentUrl(newUrl);
    }
  }, [clip.id, currentUrl, onRefreshUrls]);

  const handleClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const hasDetails =
    clip.metadata || clip.enrichment || clip.techSpecs.duration;

  return (
    <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden">
      <div className="relative aspect-video bg-black cursor-pointer" onClick={handleClick}>
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Film className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
        )}
        <video
          ref={videoRef}
          src={currentUrl}
          className="w-full h-full object-contain"
          controlsList="nodownload"
          controls
          preload="metadata"
          playsInline
          onLoadedData={() => setLoaded(true)}
          onError={handleError}
        />
      </div>

      <div className="p-3">
        {clip.filename && (
          <p className="font-mono text-xs text-[var(--text-primary)] truncate mb-1">
            {clip.filename}
          </p>
        )}
        {clip.caption && (
          <p className="font-mono text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
            {clip.caption}
          </p>
        )}

        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)]">
          {clip.techSpecs.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(clip.techSpecs.duration)}
            </span>
          )}
          {clip.techSpecs.width && clip.techSpecs.height && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              {clip.techSpecs.width}x{clip.techSpecs.height}
            </span>
          )}
          {clip.techSpecs.fps && <span>{clip.techSpecs.fps}fps</span>}
        </div>

        {hasDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 font-mono text-[10px] text-[var(--accent-primary)] hover:underline"
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "Hide details" : "Show details"}
          </button>
        )}

        {expanded && (
          <div className="mt-2 space-y-2 border-t border-[var(--border-subtle)] pt-2">
            {clip.metadata && Object.keys(clip.metadata).length > 0 && (
              <div>
                <span className="block font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider mb-1">
                  Metadata
                </span>
                <pre className="font-mono text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                  {JSON.stringify(clip.metadata, null, 2)}
                </pre>
              </div>
            )}
            {clip.enrichment && Object.keys(clip.enrichment).length > 0 && (
              <div>
                <span className="block font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider mb-1">
                  AI Enrichment
                </span>
                <pre className="font-mono text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                  {JSON.stringify(clip.enrichment, null, 2)}
                </pre>
              </div>
            )}
            {(clip.techSpecs.duration ||
              clip.techSpecs.width ||
              clip.techSpecs.fps) && (
              <div>
                <span className="block font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-wider mb-1">
                  Technical Specs
                </span>
                <pre className="font-mono text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      duration: clip.techSpecs.duration
                        ? `${clip.techSpecs.duration}s`
                        : null,
                      resolution:
                        clip.techSpecs.width && clip.techSpecs.height
                          ? `${clip.techSpecs.width}x${clip.techSpecs.height}`
                          : null,
                      fps: clip.techSpecs.fps,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShareCatalog({
  clips,
  datasetName,
  companyName,
  token,
}: ShareCatalogProps) {
  const refreshCache = useRef<Promise<Map<string, string>> | null>(null);

  const refreshUrls = useCallback(async (): Promise<Map<string, string>> => {
    if (refreshCache.current) return refreshCache.current;

    const promise = (async () => {
      try {
        const res = await fetch(`/api/share/${token}/urls`, {
          method: "POST",
        });
        if (!res.ok) return new Map<string, string>();
        const data = await res.json();
        const map = new Map<string, string>();
        for (const c of data.clips ?? []) {
          map.set(c.id, c.signedUrl);
        }
        return map;
      } catch {
        return new Map<string, string>();
      } finally {
        setTimeout(() => {
          refreshCache.current = null;
        }, 5000);
      }
    })();

    refreshCache.current = promise;
    return promise;
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono font-bold text-lg tracking-wider text-[var(--text-primary)]">
              CLARU
            </span>
            <span className="w-px h-5 bg-[var(--border-subtle)]" />
            {companyName && (
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                Prepared for {companyName}
              </span>
            )}
          </div>
          <h1 className="font-mono text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            {datasetName}
          </h1>
          <p className="font-mono text-sm text-[var(--text-muted)] mt-2">
            {clips.length} {clips.length === 1 ? "clip" : "clips"}
          </p>
        </div>

        {clips.length === 0 ? (
          <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-12 text-center">
            <Film className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="font-mono text-sm text-[var(--text-muted)]">
              No clips available in this catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onRefreshUrls={refreshUrls}
              />
            ))}
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
          <p className="font-mono text-[10px] text-[var(--text-muted)] text-center">
            Confidential — shared by Claru AI
          </p>
        </div>
      </div>
    </div>
  );
}
