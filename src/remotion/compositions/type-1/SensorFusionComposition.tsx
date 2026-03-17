import React from "react";
import { AbsoluteFill } from "remotion";
import { TOKENS } from "../../shared/DesignTokens";

export interface SensorFusionCompositionProps {
  compositionId: string;
}

const SensorFusionComposition: React.FC<SensorFusionCompositionProps> = ({
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
          Type 1 -- Sensor-Fusion Tracking
        </div>
        <div
          style={{
            fontSize: 32,
            color: TOKENS.colors.accent,
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
          Placeholder -- real composition in US-005
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default SensorFusionComposition;
