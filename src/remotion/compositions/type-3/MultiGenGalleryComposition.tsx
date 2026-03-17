import React from "react";
import { AbsoluteFill } from "remotion";
import { TOKENS } from "../../shared/DesignTokens";

export interface MultiGenGalleryCompositionProps {
  compositionId: string;
}

const MultiGenGalleryComposition: React.FC<
  MultiGenGalleryCompositionProps
> = ({ compositionId }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0908",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: TOKENS.fonts.mono,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: TOKENS.colors.muted,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Type 3 -- Multi-Gen Gallery
        </div>
        <div
          style={{
            fontSize: 32,
            color: TOKENS.colors.success,
            fontWeight: 600,
          }}
        >
          {compositionId}
        </div>
        <div
          style={{
            fontSize: 12,
            color: TOKENS.colors.muted,
            marginTop: 8,
          }}
        >
          Placeholder -- real composition in US-007
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default MultiGenGalleryComposition;
