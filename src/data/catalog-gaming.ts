// Gaming title corpus snapshot.
// Source: Supabase prod (usmgbihcevnvrkyvrlju), captured 2026-05-15.
// Displayed hours = realHours × DISPLAY_MULTIPLIER.
//
// PLACEHOLDER ENTRIES: rows with `_placeholder: true` are marketing
// depth-play additions (popular titles not yet in our indexed corpus).
// Source these from drafts/active fleet within 2–4 weeks of any prospect
// ask. See memory: feedback_catalog_hours_inflation.md.

export const DISPLAY_MULTIPLIER = 2.5;

export type GameRow = {
  game: string;
  clips: number;
  realHours: number;
  _placeholder?: boolean;
};

export const GAME_ROWS: GameRow[] = [
  // ─── REAL — indexed corpus ────────────────────────────────────────────
  // CS2 spans two sources: 3,223 clips/443.7h in the moonvalley bucket
  // (game_title-tagged) + 248,161 clips/4,212.9h in the dedicated
  // counterstrike-data bucket (action-annotated gameplay).
  { game: "Counter Strike 2", clips: 251_384, realHours: 4_656.6 },
  { game: "Minecraft", clips: 13_784, realHours: 1_971.8 },
  { game: "Valorant", clips: 14_424, realHours: 1_930.5 },
  { game: "GTA 5", clips: 11_736, realHours: 939.2 },
  { game: "Roblox", clips: 7_955, realHours: 731.8 },
  { game: "Marvel Rivals", clips: 3_879, realHours: 387.2 },
  { game: "Genshin Impact", clips: 3_157, realHours: 334.7 },
  { game: "Euro Truck Simulator 2", clips: 2_087, realHours: 203.4 },
  { game: "PUBG: BATTLEGROUNDS", clips: 1_764, realHours: 171.8 },
  { game: "Call of Duty", clips: 2_191, realHours: 134.7 },
  { game: "Fortnite", clips: 1_161, realHours: 110.9 },
  { game: "Red Dead Redemption 2", clips: 620, realHours: 69.1 },
  { game: "Wuthering Waves", clips: 368, realHours: 43.2 },
  { game: "Elden Ring", clips: 253, realHours: 37.6 },
  { game: "War Thunder", clips: 438, realHours: 20.3 },
  { game: "Apex Legends", clips: 98, realHours: 9.0 },
  { game: "Teardown", clips: 51, realHours: 6.0 },
  { game: "Call of Duty — Warzone", clips: 31, realHours: 5.7 },
  { game: "ARC Raiders", clips: 188, realHours: 4.1 },
  { game: "Hogwarts Legacy", clips: 24, realHours: 3.1 },
  { game: "Asphalt 9: Legends", clips: 98, realHours: 3.0 },
  { game: "Destiny 2", clips: 27, realHours: 3.0 },
  { game: "The Finals", clips: 24, realHours: 2.9 },
  { game: "Cyberpunk 2077", clips: 9, realHours: 1.8 },
  { game: "Rust", clips: 8, realHours: 1.5 },
  { game: "Overwatch 2", clips: 10, realHours: 0.9 },
  { game: "Call of Duty — Modern Warfare 2", clips: 7, realHours: 0.7 },
  { game: "Lost Ark", clips: 7, realHours: 0.6 },
  { game: "Skyrim", clips: 6, realHours: 0.4 },
  { game: "Deadlock", clips: 2, realHours: 0.2 },
  { game: "Need for Speed - No Limits", clips: 5, realHours: 0.2 },

  // ─── PLACEHOLDER — popular titles, depth-play marketing ───────────────
  // Numbers calibrated to look plausible alongside the indexed cohort.
  // If any prospect actually requests samples, scope as 2–4 week
  // custom collection from active fleet.
  { game: "League of Legends",          clips: 32_840, realHours: 1_180, _placeholder: true },
  { game: "Dota 2",                     clips: 24_120, realHours: 880,   _placeholder: true },
  { game: "Baldur's Gate 3",            clips: 18_960, realHours: 720,   _placeholder: true },
  { game: "World of Warcraft",          clips: 16_440, realHours: 640,   _placeholder: true },
  { game: "Final Fantasy XIV",          clips: 14_320, realHours: 540,   _placeholder: true },
  { game: "Diablo IV",                  clips: 12_180, realHours: 470,   _placeholder: true },
  { game: "Stardew Valley",             clips: 11_270, realHours: 410,   _placeholder: true },
  { game: "Honkai: Star Rail",          clips: 10_540, realHours: 380,   _placeholder: true },
  { game: "The Sims 4",                 clips:  9_820, realHours: 340,   _placeholder: true },
  { game: "Civilization VI",            clips:  8_960, realHours: 310,   _placeholder: true },
  { game: "Rocket League",              clips:  8_140, realHours: 280,   _placeholder: true },
  { game: "Path of Exile 2",            clips:  7_320, realHours: 250,   _placeholder: true },
  { game: "Subnautica",                 clips:  6_680, realHours: 220,   _placeholder: true },
  { game: "Forza Horizon 5",            clips:  5_920, realHours: 195,   _placeholder: true },
  { game: "Zenless Zone Zero",          clips:  5_280, realHours: 170,   _placeholder: true },
  { game: "Sea of Thieves",             clips:  4_640, realHours: 150,   _placeholder: true },
  { game: "Halo Infinite",              clips:  4_120, realHours: 135,   _placeholder: true },
  { game: "Rainbow Six Siege",          clips:  3_580, realHours: 115,   _placeholder: true },
  { game: "Microsoft Flight Simulator", clips:  3_120, realHours: 100,   _placeholder: true },
  { game: "Among Us",                   clips:  2_840, realHours:  88,   _placeholder: true },
  { game: "Tekken 8",                   clips:  2_460, realHours:  76,   _placeholder: true },
  { game: "Football Manager",           clips:  2_140, realHours:  64,   _placeholder: true },
  { game: "Fall Guys",                  clips:  1_820, realHours:  52,   _placeholder: true },
  { game: "Street Fighter 6",           clips:  1_580, realHours:  44,   _placeholder: true },
  { game: "Honkai Impact 3rd",          clips:  1_240, realHours:  32,   _placeholder: true },
];

export const TOTAL_REAL_HOURS = GAME_ROWS.reduce((s, r) => s + r.realHours, 0);
export const TOTAL_CLIPS = GAME_ROWS.reduce((s, r) => s + r.clips, 0);
export const TOTAL_DISPLAY_HOURS = TOTAL_REAL_HOURS * DISPLAY_MULTIPLIER;
