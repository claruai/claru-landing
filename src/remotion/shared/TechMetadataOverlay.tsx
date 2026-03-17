import React from "react";
import { TOKENS } from "./DesignTokens";

// ---------------------------------------------------------------------------
// TechMetadataOverlay — small bottom-left overlay showing codec, resolution,
// fps, duration. Required on ALL composition types.
// ---------------------------------------------------------------------------

export interface TechMetadataOverlayProps {
  /** Video codec (e.g. "h264") */
  codec: string;
  /** Resolution string (e.g. "1280x720") */
  resolution: string;
  /** Frames per second */
  fps: number;
  /** Duration string (e.g. "10s") */
  duration: string;
}

export const TechMetadataOverlay: React.FC<TechMetadataOverlayProps> = ({
  codec,
  resolution,
  fps,
  duration,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        left: 8,
        display: "flex",
        gap: 8,
        padding: "3px 6px",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderRadius: 2,
        fontFamily: TOKENS.fonts.mono,
        fontSize: 9,
        color: "#666",
        letterSpacing: 0.3,
      }}
    >
      <span>{codec}</span>
      <span>{resolution}</span>
      <span>{fps}fps</span>
      <span>{duration}</span>
    </div>
  );
};
