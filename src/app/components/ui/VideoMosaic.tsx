"use client";

import { motion } from "framer-motion";

interface VideoCell {
  src: string;
  label: string;
}

interface VideoMosaicProps {
  videos?: VideoCell[];
  className?: string;
}

const placeholderLabels = [
  "cooking",
  "walking",
  "gaming",
  "driving",
  "assembling",
  "cleaning",
  "exercising",
  "gardening",
  "reading",
  "typing",
  "painting",
  "welding",
  "sewing",
  "cycling",
  "swimming",
  "climbing",
  "dancing",
  "packing",
  "pouring",
  "slicing",
  "folding",
  "stacking",
  "sorting",
  "crafting",
];

const gradients = [
  "linear-gradient(135deg, #121110 0%, #1a1816 50%, #161412 100%)",
  "linear-gradient(135deg, #161412 0%, #1f1d1a 50%, #121110 100%)",
  "linear-gradient(135deg, #1a1816 0%, #121110 50%, #1f1d1a 100%)",
  "linear-gradient(135deg, #121110 0%, #161412 50%, #1a1816 100%)",
  "linear-gradient(135deg, #1f1d1a 0%, #1a1816 50%, #161412 100%)",
  "linear-gradient(135deg, #161412 0%, #121110 50%, #1a1816 100%)",
];

export default function VideoMosaic({
  videos,
  className = "",
}: VideoMosaicProps) {
  const cells = videos || placeholderLabels.map((label) => ({ src: "", label }));

  return (
    <div className={className}>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {cells.map((cell, i) => (
          <motion.div
            key={`${cell.label}-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="aspect-video rounded-lg overflow-hidden relative group"
          >
            {cell.src ? (
              <video
                src={cell.src}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-end justify-start p-2 md:p-3 border border-[var(--border-subtle)] rounded-lg"
                style={{
                  background: gradients[i % gradients.length],
                }}
              >
                {/* Subtle scan-line overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                  }}
                />
                <span className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] relative z-10 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                  {cell.label}
                </span>
              </div>
            )}

            {/* Label overlay for video cells */}
            {cell.src && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <span className="font-mono text-[10px] md:text-xs text-[var(--text-muted)]">
                  {cell.label}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
