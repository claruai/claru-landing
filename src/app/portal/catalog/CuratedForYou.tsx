"use client";

import Link from "next/link";

interface CuratedSample {
  id: string;
  caption_text: string | null;
  s3_bucket: string | null;
  s3_key: string | null;
  dataset_id: string | null;
  note: string | null;
  signed_url: string | null;
}

export function CuratedForYou({ samples }: { samples: CuratedSample[] }) {
  if (samples.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] mb-4">
        <span className="text-[var(--accent-primary)]">{"// "}</span>Curated for You
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[var(--border-subtle)]">
        {samples.slice(0, 6).map((s) => (
          <CuratedCard key={s.id} sample={s} />
        ))}
      </div>
    </section>
  );
}

function CuratedCard({ sample }: { sample: CuratedSample }) {
  const isVideo = sample.s3_key?.match(/\.(mp4|webm|mov)$/i);
  const bucketLabel = sample.s3_bucket?.replace(/^mv-/, "") ?? "unknown";

  const card = (
    <div className="flex-shrink-0 w-64 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent-primary)]/40 transition-colors">
      {/* Thumbnail — 16:9 */}
      <div className="aspect-video bg-[var(--bg-primary)] relative overflow-hidden">
        {sample.signed_url ? (
          isVideo ? (
            <video
              src={sample.signed_url}
              preload="metadata"
              muted
              playsInline
              className="w-full h-full object-cover"
              onMouseEnter={(e) =>
                (e.target as HTMLVideoElement).play().catch(() => {})
              }
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sample.signed_url}
              alt={sample.caption_text ?? "Curated sample"}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">
            no preview
          </div>
        )}
        {/* Bucket badge */}
        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/60 text-[var(--text-secondary)]">
          {bucketLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {sample.caption_text ? (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
            {sample.caption_text}
          </p>
        ) : (
          <p className="text-xs text-[var(--text-muted)] italic">
            No caption
          </p>
        )}

        {sample.note && (
          <p className="text-[10px] font-mono text-[var(--accent-primary)] truncate">
            {sample.note}
          </p>
        )}
      </div>
    </div>
  );

  // Cards with dataset_id link to that dataset; otherwise not clickable
  if (sample.dataset_id) {
    return (
      <Link href={`/portal/catalog/${sample.dataset_id}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
