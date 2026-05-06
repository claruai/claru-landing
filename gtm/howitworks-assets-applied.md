# HowItWorks Assets — Applied

Generated 2026-05-06. 6 cinematic 2K stills + 5s Seedance loops paired with the
HowItWorks step copy on `/partnerships`. Pipeline script:
`scripts/gen-howitworks-assets.py` (mirrors `gen-partnerships-hero.py` /
`gen-partnerships-wall.py` patterns).

## Models
- Stills: `fal-ai/nano-banana-2` (Gemini 3.1 Flash Image), 2K, 16:9, PNG.
- Clips: `bytedance/seedance-2.0/image-to-video`, 5s, 16:9, no audio.

## Output Pairs
| # | Slug                | Master MP4                                          | Web MP4                                              | Web Poster JPG                                       |
|---|---------------------|-----------------------------------------------------|------------------------------------------------------|------------------------------------------------------|
| 01 | tell_us_business   | `gtm/howitworks/clips/01_tell_us_business.mp4`      | `public/videos/howitworks/01_tell_us_business.mp4`   | `public/videos/howitworks/01_tell_us_business.jpg`   |
| 02 | agree_earnings     | `gtm/howitworks/clips/02_agree_earnings.mp4`        | `public/videos/howitworks/02_agree_earnings.mp4`     | `public/videos/howitworks/02_agree_earnings.jpg`     |
| 03 | ship_cameras       | `gtm/howitworks/clips/03_ship_cameras.mp4`          | `public/videos/howitworks/03_ship_cameras.mp4`       | `public/videos/howitworks/03_ship_cameras.jpg`       |
| 04 | you_capture        | `gtm/howitworks/clips/04_you_capture.mp4`           | `public/videos/howitworks/04_you_capture.mp4`        | `public/videos/howitworks/04_you_capture.jpg`        |
| 05 | you_upload         | `gtm/howitworks/clips/05_you_upload.mp4`            | `public/videos/howitworks/05_you_upload.mp4`         | `public/videos/howitworks/05_you_upload.jpg`         |
| 06 | get_paid           | `gtm/howitworks/clips/06_get_paid.mp4`              | `public/videos/howitworks/06_get_paid.mp4`           | `public/videos/howitworks/06_get_paid.jpg`           |

PNG masters live in `gtm/howitworks/stills/` alongside JPG poster masters.

## Prompt-engineering notes
- Universal style suffix appended to every Nano Banana prompt — Kodak Portra
  800 grain, slightly desaturated, candid documentary, unbranded surfaces. This
  keeps grade consistent across the 6-step set so the section reads as a single
  visual world.
- For step 3 (ship_cameras) we described the Drift X3 form factor only —
  "compact cylindrical black action camera, lipstick-tube size, single round
  lens, chrome accent ring, unmarked plastic body." No brand language passed
  to the model, no logos rendered.
- Step 4 (you_capture) re-uses the same camera form factor description so the
  chest-cam visually matches the unboxed device in step 3 — quietly reinforces
  product continuity through the funnel without saying it.
- Step 5 (you_upload) explicitly asked for sage-green progress bars, monospace
  UI, dark mode — matches Claru's `--accent-primary: #92B090` design system.
- Step 6 (get_paid) asked for blurred numbers on the deposit notification for
  privacy plausibility while keeping the sage-green check + dollar amount
  visible enough to read the celebratory beat.
- Submitted all 6 stills in parallel via `fal_client.submit`, drained in a
  second loop — full set in ~65s. Same parallel pattern for clips, ~145s.

## Rerolls
None. All 6 stills + 6 clips passed first generation. Faces in the cafe scenes
landed candid (3/4 angle, not centered) as prompted; the chest-cam in step 4
is visible but not the focal subject; step 5's UI is legible.

## Spend (approx)
- Nano Banana 2 t2i @ 2K: ~$0.04 × 6 = ~$0.24
- Seedance 2.0 i2v 5s 16:9: ~$0.62 × 6 = ~$3.72
- Total: ~$3.96
