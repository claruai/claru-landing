import GameCaptureSampleCard from "./GameCaptureSampleCard";

// ---------------------------------------------------------------------------
// Sample definitions — each has an S3 video key and local input JSON
// ---------------------------------------------------------------------------

const CDN = "https://d301h7ygdmxuux.cloudfront.net";

const SAMPLES = [
  {
    gameTitle: "Red Dead Redemption 2",
    videoPath: `${CDN}/video-game-capture/completed/00117a2e-7775-40b5-9770-acbd8109e46b/ffe0e6d7-e670-4e47-b783-0758c4d0fc60.mp4`,
    inputJsonPath: "/remotion-assets/annotations/cs-game-capture-input.json",
  },
  {
    gameTitle: "PUBG: Battlegrounds",
    videoPath: `${CDN}/video-game-capture/completed/00164dd0-8a07-4b74-a23a-3b66aaa7f031/b55a50e1-835d-4819-be56-c4a228d5e9b7.mp4`,
    inputJsonPath: "/remotion-assets/annotations/game-pubg-input.json",
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
            the raw keystroke and mouse data captured alongside the video at
            microsecond precision.
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
