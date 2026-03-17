import GameCaptureSampleCard from "./GameCaptureSampleCard";

// ---------------------------------------------------------------------------
// Sample definitions
// ---------------------------------------------------------------------------

const SAMPLES = [
  {
    gameTitle: "Red Dead Redemption 2",
    videoPath: "/remotion-assets/samples/cs-game-capture.mp4",
    inputJsonPath: "/remotion-assets/annotations/cs-game-capture-input.json",
  },
  {
    gameTitle: "PUBG: Battlegrounds",
    videoPath: "/remotion-assets/samples/game-pubg.mp4",
    inputJsonPath: "/remotion-assets/annotations/game-pubg-input.json",
  },
  {
    gameTitle: "GTA 5",
    videoPath: "/remotion-assets/samples/game-gta5.mp4",
    inputJsonPath: "/remotion-assets/annotations/game-gta5-input.json",
  },
] as const;

// ---------------------------------------------------------------------------
// Section Component (Async Server Component)
// ---------------------------------------------------------------------------

export default async function GameCaptureSamples() {
  return (
    <section id="game-capture-samples" className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "#ffffff" }}
          >
            Sample Capture Data
          </h2>
          <p className="text-base" style={{ color: "#999" }}>
            Real gameplay with synchronized input telemetry. Each clip includes
            the raw keystroke and mouse data captured alongside the video.
          </p>
        </div>

        {/* Sample cards */}
        <div className="space-y-6">
          {SAMPLES.map((sample) => (
            <GameCaptureSampleCard
              key={sample.gameTitle}
              gameTitle={sample.gameTitle}
              videoPath={sample.videoPath}
              inputJsonPath={sample.inputJsonPath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
