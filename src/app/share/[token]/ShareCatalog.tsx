"use client";

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

export default function ShareCatalog({
  clips,
  datasetName,
  companyName,
}: ShareCatalogProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          {companyName && (
            <p className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider mb-2">
              Prepared for {companyName}
            </p>
          )}
          <h1 className="font-mono text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            {datasetName}
          </h1>
        </div>
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          {clips.length} {clips.length === 1 ? "clip" : "clips"}
        </p>
      </div>
    </div>
  );
}
