"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InputEvent {
  timeUs: number;
  event: string;
  value: string;
}

interface GameCaptureSampleCardClientProps {
  videoSrc: string;
  gameTitle: string;
  inputEvents: InputEvent[];
}

// ---------------------------------------------------------------------------
// WASD Keyboard Visualization
// ---------------------------------------------------------------------------

function WASDKeyboard({ activeKeys }: { activeKeys: Set<string> }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top row: W */}
      <div className="flex gap-1">
        <div className="w-5 h-5" /> {/* spacer */}
        {renderKey("W", activeKeys.has("W"))}
        <div className="w-5 h-5" /> {/* spacer */}
      </div>
      {/* Bottom row: A S D */}
      <div className="flex gap-1">
        {renderKey("A", activeKeys.has("A"))}
        {renderKey("S", activeKeys.has("S"))}
        {renderKey("D", activeKeys.has("D"))}
      </div>
      {/* Extra keys row */}
      <div className="flex gap-1 mt-0.5">
        {renderKey("Shift", activeKeys.has("LeftShift") || activeKeys.has("Shift"), true)}
        {renderKey("Space", activeKeys.has("Space"), true)}
        {renderKey("E", activeKeys.has("E"))}
      </div>
    </div>
  );
}

function renderKey(label: string, active: boolean, wide = false) {
  return (
    <div
      className={`
        ${wide ? "w-10 px-1" : "w-5"} h-5
        flex items-center justify-center
        rounded-sm text-[9px] font-mono font-bold
        transition-all duration-75 border
        ${
          active
            ? "bg-[#92B090]/30 border-[#92B090] text-[#92B090] shadow-[0_0_6px_rgba(146,176,144,0.4)]"
            : "bg-[#1a1a18] border-[#333330] text-[#555]"
        }
      `}
    >
      {label.length > 3 ? label.slice(0, 3) : label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mouse Trail Mini Visualization
// ---------------------------------------------------------------------------

function MouseTrail({ coords }: { coords: Array<{ x: number; y: number }> }) {
  if (coords.length === 0) return null;

  // Normalize coordinates to fit in a small box
  const latest = coords.slice(-30);
  const xs = latest.map((c) => c.x);
  const ys = latest.map((c) => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = Math.max(maxX - minX, 1);
  const rangeY = Math.max(maxY - minY, 1);

  const points = latest
    .map((c) => {
      const nx = ((c.x - minX) / rangeX) * 48;
      const ny = ((c.y - minY) / rangeY) * 24;
      return `${nx},${ny}`;
    })
    .join(" ");

  return (
    <div className="w-12 h-6 relative">
      <svg
        viewBox="0 0 48 24"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points={points}
          stroke="#92B090"
          strokeWidth="1"
          strokeOpacity="0.6"
          fill="none"
        />
        {latest.length > 0 && (
          <circle
            cx={((latest[latest.length - 1].x - minX) / rangeX) * 48}
            cy={((latest[latest.length - 1].y - minY) / rangeY) * 24}
            r="2"
            fill="#92B090"
          />
        )}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input Stream Panel
// ---------------------------------------------------------------------------

function InputStreamPanel({
  events,
  currentTimeUs,
  isPlaying,
}: {
  events: InputEvent[];
  currentTimeUs: number;
  isPlaying: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find events up to current time
  const visibleEvents = useMemo(() => {
    if (!isPlaying && currentTimeUs === 0) {
      // Show first few events as preview
      return events.slice(0, 15);
    }
    const idx = events.findIndex((e) => e.timeUs > currentTimeUs);
    const endIdx = idx === -1 ? events.length : idx;
    // Show last 20 events
    const startIdx = Math.max(0, endIdx - 20);
    return events.slice(startIdx, endIdx);
  }, [events, currentTimeUs, isPlaying]);

  // Compute active keys
  const activeKeys = useMemo(() => {
    const keys = new Set<string>();
    // Scan all events up to current time to determine held keys
    for (const ev of events) {
      if (ev.timeUs > currentTimeUs) break;
      if (ev.event === "keydown") keys.add(ev.value);
      if (ev.event === "keyup") keys.delete(ev.value);
    }
    return keys;
  }, [events, currentTimeUs]);

  // Compute mouse trail
  const mouseCoords = useMemo(() => {
    const coords: Array<{ x: number; y: number }> = [];
    for (const ev of events) {
      if (ev.timeUs > currentTimeUs) break;
      if (ev.event === "mousemove") {
        const parts = ev.value.split(":");
        if (parts.length === 2) {
          coords.push({ x: parseInt(parts[0], 10), y: parseInt(parts[1], 10) });
        }
      }
    }
    return coords.slice(-30);
  }, [events, currentTimeUs]);

  // Total events up to current time
  const totalEventsShown = useMemo(() => {
    const idx = events.findIndex((e) => e.timeUs > currentTimeUs);
    return idx === -1 ? events.length : idx;
  }, [events, currentTimeUs]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleEvents]);

  return (
    <div
      className="h-full flex flex-col rounded-lg border font-mono text-xs overflow-hidden"
      style={{
        backgroundColor: "#0c0c0a",
        borderColor: "#2a2a28",
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "#2a2a28" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <span style={{ color: "#666" }}>input-stream.jsonl</span>
        </div>
        <span style={{ color: "#555" }}>
          {totalEventsShown}/{events.length}
        </span>
      </div>

      {/* WASD + Mouse visualization */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "#2a2a28" }}
      >
        <WASDKeyboard activeKeys={activeKeys} />
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px]" style={{ color: "#555" }}>
            mouse
          </span>
          <MouseTrail coords={mouseCoords} />
        </div>
      </div>

      {/* Event stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-px"
        style={{ scrollBehavior: "smooth" }}
      >
        {visibleEvents.map((ev, i) => {
          const isKey = ev.event === "keydown" || ev.event === "keyup";
          const isCurrent =
            i === visibleEvents.length - 1 && isPlaying;
          return (
            <div
              key={`${ev.timeUs}-${i}`}
              className={`whitespace-nowrap transition-opacity duration-150 ${
                isCurrent ? "opacity-100" : "opacity-70"
              }`}
            >
              <span style={{ color: "#555" }}>
                {formatTimeUs(ev.timeUs)}
              </span>{" "}
              <span
                style={{
                  color: isKey ? "#92B090" : "#666",
                }}
              >
                {ev.event}
              </span>{" "}
              <span
                style={{
                  color: isKey ? "#c4d4c2" : "#888",
                  fontWeight: isKey ? 600 : 400,
                }}
              >
                {ev.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimeUs(us: number): string {
  const seconds = us / 1_000_000;
  return seconds.toFixed(2).padStart(6, " ") + "s";
}

// ---------------------------------------------------------------------------
// Specs Strip
// ---------------------------------------------------------------------------

function SpecsStrip({
  totalEvents,
  durationS,
}: {
  totalEvents: number;
  durationS: number;
}) {
  const eventsPerSec = (totalEvents / durationS).toFixed(0);
  const specs = [
    { label: "Resolution", value: "1280x720" },
    { label: "FPS", value: "30" },
    { label: "Sync Error", value: "<16ms" },
    { label: "Events", value: totalEvents.toLocaleString() },
    { label: "Events/sec", value: eventsPerSec },
    { label: "Cost/sec", value: "$0.004" },
  ];

  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2 border-t font-mono text-[10px]"
      style={{ borderColor: "#2a2a28", color: "#555" }}
    >
      {specs.map((s) => (
        <span key={s.label}>
          <span style={{ color: "#666" }}>{s.label}:</span>{" "}
          <span style={{ color: "#92B090" }}>{s.value}</span>
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Card Component
// ---------------------------------------------------------------------------

export function GameCaptureSampleCardClient({
  videoSrc,
  gameTitle,
  inputEvents,
}: GameCaptureSampleCardClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeUs, setCurrentTimeUs] = useState(0);
  const animFrameRef = useRef<number>(0);

  const syncTime = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      setCurrentTimeUs(videoRef.current.currentTime * 1_000_000);
      animFrameRef.current = requestAnimationFrame(syncTime);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    animFrameRef.current = requestAnimationFrame(syncTime);
  }, [syncTime]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setCurrentTimeUs(0);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#121210", borderColor: "#2a2a28" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0">
        {/* Video */}
        <div
          className="relative aspect-video cursor-pointer overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onPlay={handlePlay}
            onPause={handlePause}
          />
          {/* Game title badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded text-xs font-mono font-semibold"
              style={{
                backgroundColor: "rgba(146, 176, 144, 0.15)",
                color: "#92B090",
                border: "1px solid rgba(146, 176, 144, 0.3)",
              }}
            >
              {gameTitle}
            </span>
          </div>
          {/* Play hint */}
          {!isPlaying && (
            <div
              className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-mono opacity-60"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
            >
              hover to play
            </div>
          )}
        </div>

        {/* Input stream panel */}
        <div className="h-[300px] lg:h-auto min-h-[280px]">
          <InputStreamPanel
            events={inputEvents}
            currentTimeUs={currentTimeUs}
            isPlaying={isPlaying}
          />
        </div>
      </div>

      {/* Specs strip */}
      <SpecsStrip totalEvents={inputEvents.length} durationS={12} />
    </motion.div>
  );
}
