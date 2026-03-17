import React from "react";
import { AbsoluteFill } from "remotion";
import { TOKENS } from "../../shared/DesignTokens";

export interface DetectionAnnotationCompositionProps {
  compositionId: string;
}

const DetectionAnnotationComposition: React.FC<
  DetectionAnnotationCompositionProps
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
          Type 4 -- Detection + Annotation
        </div>
        <div
          style={{
            fontSize: 32,
            color: TOKENS.colors.warning,
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
          Placeholder -- real composition in US-008
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default DetectionAnnotationComposition;
