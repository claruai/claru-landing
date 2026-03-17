import { readFileSync } from "fs";
import { join } from "path";
import { GameCaptureSampleCardClient } from "./GameCaptureSampleCardClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InputEvent {
  timeUs: number;
  event: string;
  value: string;
}

interface GameCaptureSampleCardProps {
  /** Game title displayed as badge on the video */
  gameTitle: string;
  /** Path to the video file relative to /public (e.g. "/remotion-assets/samples/game-pubg.mp4") */
  videoPath: string;
  /** Path to the input JSON file relative to /public */
  inputJsonPath: string;
}

// ---------------------------------------------------------------------------
// Server Component
// ---------------------------------------------------------------------------

export default async function GameCaptureSampleCard({
  gameTitle,
  videoPath,
  inputJsonPath,
}: GameCaptureSampleCardProps) {
  // Read input events from the local JSON file at build time
  const absolutePath = join(process.cwd(), "public", inputJsonPath);
  let inputEvents: InputEvent[] = [];

  try {
    const raw = readFileSync(absolutePath, "utf-8");
    inputEvents = JSON.parse(raw) as InputEvent[];
  } catch (err) {
    console.error(
      `[GameCaptureSampleCard] Failed to read input JSON at ${absolutePath}:`,
      err instanceof Error ? err.message : err
    );
  }

  return (
    <GameCaptureSampleCardClient
      videoSrc={videoPath}
      gameTitle={gameTitle}
      inputEvents={inputEvents}
    />
  );
}
