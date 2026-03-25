"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { datasets, type Dataset } from "../v2/data/datasets";

function EmailCaptureModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (email: string, company: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && company) {
      onSubmit(email, company);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="mx-4 w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-white">
          See all samples
        </h3>
        <p className="mb-6 text-sm text-white/60">
          Enter your email to unlock full clips and enrichment overlays.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="work@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none"
          />
          <input
            type="text"
            required
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--accent-primary)] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[var(--accent-primary)] py-2.5 text-sm font-medium text-[#0a0908] transition-all hover:brightness-110"
          >
            Unlock Samples
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-white/40 hover:text-white/60"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}

function DatasetCard({
  dataset,
  isExpanded,
  onToggle,
  isGated,
  onRequestAccess,
}: {
  dataset: Dataset;
  isExpanded: boolean;
  onToggle: () => void;
  isGated: boolean;
  onRequestAccess: () => void;
}) {
  return (
    <motion.div
      layoutId={`card-${dataset.id}`}
      className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-colors hover:border-[var(--accent-primary)]/30"
    >
      {/* Poster */}
      <div className="relative aspect-video cursor-pointer" onClick={onToggle}>
        <img
          src={dataset.poster}
          alt={dataset.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {dataset.status === "coming_soon" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="font-mono text-sm text-white/60">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
          <span className="font-mono text-sm text-[var(--accent-primary)]">
            {dataset.count}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {dataset.modalities.map((mod) => (
            <span
              key={mod}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-0.5 font-mono text-[10px] text-white/50"
            >
              {mod}
            </span>
          ))}
        </div>

        <p className="mt-3 text-sm text-white/60">{dataset.description}</p>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                {/* Preview clip placeholder */}
                <div className="mb-4 flex aspect-video items-center justify-center rounded bg-[var(--bg-secondary)]">
                  <span className="font-mono text-xs text-white/30">
                    Preview clip — 3s low-res
                  </span>
                </div>

                {!isGated ? (
                  <button
                    onClick={onRequestAccess}
                    className="w-full rounded-md border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 py-2 text-sm font-medium text-[var(--accent-primary)] transition-all hover:bg-[var(--accent-primary)]/20"
                  >
                    See all samples
                  </button>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="flex aspect-video items-center justify-center rounded bg-[var(--bg-secondary)]"
                      >
                        <span className="font-mono text-xs text-[var(--accent-primary)]/40">
                          Full clip {n} + enrichment overlays
                        </span>
                      </div>
                    ))}
                    <a
                      href="#"
                      className="block text-center font-mono text-sm text-[var(--accent-primary)] hover:underline"
                    >
                      Download sample pack
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="mt-3 font-mono text-xs text-white/40 hover:text-white/60"
        >
          {isExpanded ? "Collapse ↑" : "Expand ↓"}
        </button>
      </div>
    </motion.div>
  );
}

export default function CatalogPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("catalog_unlocked") === "true";
    }
    return false;
  });

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    []
  );

  const handleEmailSubmit = useCallback(
    (email: string, company: string) => {
      console.log("Email capture:", { email, company });
      localStorage.setItem("catalog_unlocked", "true");
      setIsUnlocked(true);
      setIsModalOpen(false);
    },
    []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      {/* Header */}
      <div className="container mx-auto px-6 pb-8 pt-24">
        <Link
          href="/v2"
          className="mb-8 inline-flex items-center gap-1 font-mono text-sm text-white/40 hover:text-white/60"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-bold text-white md:text-5xl">
          Data Catalog
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/60">
          Browse our curated collection of video datasets with depth, pose,
          and segmentation enrichment. Commercially licensed and ready to
          download.
        </p>
      </div>

      {/* Dataset grid */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              isExpanded={expandedId === dataset.id}
              onToggle={() => handleToggle(dataset.id)}
              isGated={isUnlocked}
              onRequestAccess={() => setIsModalOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Email capture modal */}
      <AnimatePresence>
        {isModalOpen && (
          <EmailCaptureModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleEmailSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
