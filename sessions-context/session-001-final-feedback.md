# Session 001 — Final Feedback (evening)

## Outstanding Issues to Fix Next Session

### Hero Tiles
- **H-10** (annotation-grid): Still doesn't work well. Need a better alternative — something that shows segmentation masks or a more visually impressive annotation view. Consider generating with Kling on FAL.

### Marquee Row 2
- **M2-03** (safety-review): Not impressive enough. Need a more complex/visually rich annotated clip.
- **M2-06** (red-team): Still not visually complex enough. Need something that looks more data-rich.

### Enrichment
- **E-09** (zoom-out montage): Looks weak. The 6x4 grid of mosaic posters isn't impressive. This needs to be a more stunning "pull back to reveal scale" visual.

### Globe Thumbnails — Bad Picks
These globe thumbnails don't show the right content or look poor:
- **G-01** (SF): Shows game video — should show lab/capture environment
- **G-03** (Ho Chi Minh): Not convincing as a road scene
- **G-06** (Lagos): Doesn't look like a warehouse
- **G-08** (Bangkok): Doesn't look like a street
- **G-14** (Dhaka): Doesn't look like a kitchen
- **G-16** (Bogotá): Doesn't look like an office

**Solution suggested by founder:** Use Kling video generation on FAL to create purpose-built egocentric clips for each environment. E.g., generate "egocentric POV of hands cooking in a kitchen" for kitchen locations, "walking through a warehouse with shelving" for warehouse locations, etc.

### 3D Assets
The point cloud, hand mesh, and trellis GLB need to be:
1. Built into stunning Remotion compositions (not just raw Three.js viewers)
2. Used as overlays alongside existing footage
3. Made into actual video assets that can be embedded

The idea: take the 3D point cloud and render a Remotion video of it rotating, with the original RGB footage playing alongside. Same for the hand mesh — show the video frame on one side, the 3D reconstruction rotating on the other. These become actual video files that play in the enrichment section, not interactive WebGL viewers.

### Depth Map Video (H-06)
The depth-welding.mp4 is only 16KB at 4fps — looks choppy/bad. Need to regenerate at full 24fps (72 FAL calls) or find an alternative approach.

## KEY INSIGHT: Generate Purpose-Built Footage, Don't Rely on Existing Clips

We are NOT limited to our existing egocentric clips. We should GENERATE entirely new footage via FAL (Kling/Wan video gen) and then run it through the full enrichment pipeline. This gives us perfect control over what every tile shows.

**The pipeline for each asset:**
1. Generate source video via Kling (`fal-ai/kling-video`) with specific prompt
2. Run through Depth Anything → depth map video
3. Run through DWPose → pose skeleton overlay
4. Run through SAM2 → segmentation masks
5. Run through Trellis → 3D reconstruction
6. Composite via Remotion → stunning final video

**This means:**
- Globe "Kitchen in Mumbai" = generate "egocentric POV of hands cooking in an Indian kitchen" via Kling
- Hero "DEPTH MAP" tile = generate a clean egocentric scene → Depth Anything → beautiful blue-purple depth map
- Hero "SEGMENTATION" tile = generate a warehouse scene → SAM2 → clean colored masks
- Enrichment 3D step = generate a scene → Trellis → render 3D reconstruction alongside source in Remotion
- Everything is fabricated to look EXACTLY right for its slot

## What Needs to Happen Next Session

### Phase 1: Generate Purpose-Built Source Videos via Kling on FAL
Generate 10-15 short egocentric clips using Kling/Wan with specific prompts:
1. "Egocentric POV hands cooking in a kitchen, chopping vegetables" (for hero + enrichment raw)
2. "Egocentric POV hands assembling electronics on a workbench" (for hero WORKSHOP)
3. "Egocentric POV walking through an industrial warehouse with metal shelving" (for hero WAREHOUSE + globe)
4. "Egocentric POV hands operating a robotic arm gripper in a lab" (for hero ROBOTICS)
5. "First-person dashcam driving through city traffic" (for hero DRIVING + globe)
6. "Egocentric POV barista making espresso at a cafe" (for globe Café in Jakarta)
7. "Egocentric POV hands cooking in an Indian kitchen with spices" (for globe Kitchen in Mumbai)
8. "Egocentric POV walking through a modern open office" (for globe Office in London)
9. "Egocentric POV hands sewing fabric at a textile workshop" (for globe Textile in Cairo)
10. "Egocentric POV walking down a busy Asian street market" (for globe Street in Bangkok)

### Phase 2: Run Enrichment Pipeline on Generated Footage
For each generated clip:
- Extract key frames
- Run through FAL Depth Anything → depth map video (full fps)
- Run through FAL DWPose → pose skeleton overlay
- Run through FAL SAM2 → segmentation masks
- Run through FAL Trellis → 3D reconstruction GLB
- Generate point cloud from RGB + depth

### Phase 3: Remotion 3D Compositions
Build Remotion compositions showing:
- Point cloud rotating alongside source video (split screen)
- Hand/body mesh reconstruction next to original frame
- Depth map fading in over raw footage
- Segmentation masks highlighting objects
Export all as MP4 for embedding.

### Phase 4: Place Everything
Update hero tiles, marquee, enrichment, and globe with the purpose-built assets.

### Phase 5: Rebuild E-09 (Scale Reveal)
Remotion composition that zooms out from enriched clip to reveal a massive grid — more impressive than a static montage.

## Branch State
- Branch: `landing-page-v2`
- Dev server: port 3080
- Review page: http://localhost:3080/v2/review
- All current assets committed
- 3D models at: public/models/ (kitchen-pointcloud.ply, hand-mesh.glb, kitchen-trellis.glb)

## Key FAL Endpoints Needed
- `fal-ai/kling-video` — generate egocentric clips for globe
- `fal-ai/imageutils/depth` — regenerate depth at full fps
- Remotion `@remotion/renderer` — render 3D compositions to video
