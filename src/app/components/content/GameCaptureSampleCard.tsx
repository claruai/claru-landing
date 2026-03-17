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
  gameTitle: string;
  videoPath: string;
  inputJsonPath: string;
}

// ---------------------------------------------------------------------------
// Server Component — reads input JSON at build time, passes to client
// ---------------------------------------------------------------------------

export default async function GameCaptureSampleCard({
  gameTitle,
  videoPath,
  inputJsonPath,
}: GameCaptureSampleCardProps) {
  const absolutePath = join(process.cwd(), "public", inputJsonPath);
  let inputEvents: InputEvent[] = [];

  try {
    const raw = readFileSync(absolutePath, "utf-8");
    inputEvents = JSON.parse(raw) as InputEvent[];
  } catch (err) {
    console.error(
      `[GameCaptureSampleCard] Failed to read ${absolutePath}:`,
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
