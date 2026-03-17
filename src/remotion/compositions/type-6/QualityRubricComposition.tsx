import React from "react";
import { AbsoluteFill } from "remotion";
import { TOKENS } from "../../shared/DesignTokens";

export interface QualityRubricCompositionProps {
  compositionId: string;
}

const QualityRubricComposition: React.FC<QualityRubricCompositionProps> = ({
  compositionId,
}) => {
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
          Type 6 -- Quality Rubric
        </div>
        <div
          style={{
            fontSize: 32,
            color: TOKENS.colors.accentAlt,
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
          Placeholder -- real composition in US-010
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default QualityRubricComposition;
