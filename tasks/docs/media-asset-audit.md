# Media Asset Audit — Claru S3 Bucket Visual Inspection

**Date:** 2026-03-16
**Purpose:** Visual inspection of all 12 datasets with S3 media samples to inform Remotion composition design.
**Method:** Downloaded 1 sample per dataset, extracted video frames (start/mid/end), inspected annotation JSONs.

---

## 1. Egocentric Activity Capture

**Dataset ID:** eb07cf5b-55b1-45ec-a513-65b9e78956de
**Media type:** Video (MP4)
**Resolution:** 3840x2160 (4K) | **Duration:** ~14s | **Size:** ~82 MB

**What it shows:** High-angle dashcam/overpass footage of a busy multi-lane road in the Philippines (visible Jollibee, Caltex station signage). Dozens of vehicles — tricycles, motorcycles, vans, trucks, SUVs — moving in both directions. The camera appears mounted on a bridge railing overlooking the road. End frame shows the camera tilting down to the railing itself. This is traffic/transportation surveillance footage, not typical "egocentric" cooking/workplace despite the dataset name.

**Enrichment available:** None (empty)
**Annotation file contents:** None (no s3_annotation_key)

**Metadata:** Empty. S3 path indicates `Samples Egocentric Videos/Traffic_Transportation/` prefix. Second sample in the set is from the same path.

**Recommended Remotion composition:** "Traffic Flow Analysis" — Overlay vehicle bounding boxes and tracking IDs on the high-angle footage. Show vehicles being detected, classified (truck/car/motorcycle/tricycle), and tracked with colored trails as they move through the frame. Add a running count sidebar showing vehicle counts by type. This demonstrates real-world autonomous driving / smart city annotation at scale.

**Why a researcher would care:** Egocentric and traffic video is fundamental training data for embodied AI, autonomous driving, and scene understanding models. The 4K resolution and diverse vehicle types (including tricycles, a Philippine-specific vehicle class) show Claru handles geo-diverse, real-world data collection.

---

## 2. Game Environment Capture

**Dataset ID:** b2b542aa-7f82-41ee-8fb2-88fd17f07e12
**Media type:** Video (MP4)
**Resolution:** 1920x1200 | **Duration:** ~245s (4+ min) | **Size:** ~189 MB

**What it shows:** Red Dead Redemption 2 gameplay footage. Third-person view of a character in a hat and period clothing navigating a western town. Visible game HUD elements: minimap (bottom-left), action icons. Subtitles show in-game dialogue ("I'm being chased by the village idiot", "Signor Bronte"). Mid-frame shows a cutscene with multiple NPC characters in period clothing. End frame shows a stylized blurred shot of a New Orleans-style building with iron balconies. High-quality AAA game graphics with cinematic camera angles.

**Enrichment available:** None (empty)

**Annotation file contents:** Rich metadata from Claru's internal annotation platform. Key fields:
- `generalData.selectedGame`: "Red Dead Redemption 2"
- `section`: "Video Game", `category`: "Adventure", `subcategory`: "Red Dead Redemption 2"
- `project.templateData.categories`: 25+ game titles (GTA 5, Skyrim, Valorant, Counter Strike 2, Minecraft, Elden Ring, PUBG, etc.)
- `project.type`: "VIDEO_GAME_CAPTURE"
- `project.annotationCostType`: "DURATION" (paid per second of captured footage)
- MediaInfo attributes: x264 encoded, 30fps, AVC High profile
- Status: approved, with reviewer ID assigned

**Recommended Remotion composition:** "Game World Taxonomy" — Show the gameplay footage with an animated overlay that classifies the scene in real-time: game title detected, genre tag, scene type (cutscene vs gameplay vs exploration), visible UI elements highlighted. Animate a taxonomy tree on the side showing how the annotator categorized this clip from the 25-game catalog. Show the annotation pipeline: raw capture -> game identification -> scene classification -> quality review -> approved.

**Why a researcher would care:** Synthetic environment data from AAA games is increasingly used to train vision models. The structured taxonomy (25 games x genre categories) and the quality control pipeline (annotator + reviewer) demonstrate industrial-scale data operations. The 4-minute capture length shows this isn't cherry-picked short clips.

---

## 3. Video Quality Annotations

**Dataset ID:** 4bda56db-59de-4794-9913-6738955c4f8c
**Media type:** Video (MP4)
**Resolution:** 1920x1080 | **Duration:** ~5s | **Size:** ~5 MB

**What it shows:** Three young people having a conversation outdoors in a rural/green setting. A woman in an orange outfit is gesturing while speaking, two men stand nearby. Watermark "Cg 11 king" visible in top-right. Typical user-generated social media content — not professionally shot but decent quality with good subject framing.

**Enrichment available:** None (empty)

**Annotation file contents:** Multi-dimensional quality assessment:
- `generalData.isCinematic`: "not-cinematic"
- `generalData.hasGoodMotion`: "good-motion"
- `generalData.isHighQuality`: "not-high-quality"
- `generalData.isVideoInteresting`: "interesting"
- `generalData.hasGoodTextAlignment`: "good-alignment"
- `generalData.videoEndedAt`: 4.966667 (annotator watched full clip)
- `metadata.video_description`: Full natural-language description of the scene
- `metadata.num_frames`: 149
- `project.type`: "HIGH_QUALITY_VIDEO_EVALUATION"
- `project.annotationType`: "CLASSIFICATION"

**Recommended Remotion composition:** "Quality Rubric Dashboard" — Play the video with an animated rating panel on the right side. Each quality dimension (cinematic, motion, quality, interest, text-alignment) animates in as a gauge or star rating that fills based on the annotator's judgment. Show the 5-axis spider/radar chart building as each dimension is evaluated. Contrast with a second clip that scores differently to show the range. The text prompt description appears as a typed overlay.

**Why a researcher would care:** Video quality assessment is essential for curating training sets for video generation models. This shows Claru's multi-dimensional evaluation framework — not just "good/bad" but 5+ orthogonal quality axes. This is exactly how Moonvalley/Reka would filter training data for their generative models.

---

## 4. Video Classification — Supervised Labels

**Dataset ID:** ca2465cf-80ee-4a3c-8c06-a66820671254
**Media type:** Video (MP4)
**Resolution:** 1920x1080 | **Duration:** ~5s | **Size:** ~4 MB

**What it shows:** A young man with light brown hair talking on a smartphone outdoors. He's smiling, wearing a patterned button-down shirt. Behind him is a large ornate building (European architecture) and green trees suggesting an urban park. Warm golden-hour lighting. Stock footage quality — clean, well-lit, professional-looking.

**Enrichment available:** None (empty)

**Annotation file contents:** Hierarchical category classification:
- `generalData.category`: "Technology & Computing"
- `generalData.subcategory`: "Smartphones & Gadget Use"
- `metadata.caption`: Full scene description
- `metadata.concept`: "People"
- `metadata.category`: "Portrait photography"
- `metadata.subcategory`: "Urban outdoor portraits"
- `metadata.source`: "Supervised_fine_tuning"
- `project.type`: "SUPERVISED_TUNNING"
- `project.title`: "Supervised Fine Tuning Categories and Subcategories"

**Recommended Remotion composition:** "Hierarchical Label Tree" — Show the video playing with an animated taxonomy tree expanding from root to leaf: Content -> People -> Technology & Computing -> Smartphones & Gadget Use. Also show the parallel classification: Visual Style -> Portrait photography -> Urban outdoor portraits. Animate the caption text appearing letter by letter beneath the video. This dual-taxonomy visualization shows how a single clip gets multiple classification passes.

**Why a researcher would care:** Supervised fine-tuning labels are the backbone of instruction-tuned video models. The dual taxonomy (content category + visual style) shows the depth of labeling Claru performs — this isn't simple tagging but structured ontology-driven classification.

---

## 5. Content Safety & Policy Review

**Dataset ID:** 132debad-3518-4814-8d33-f7bb7b32cd6c
**Media type:** Video (MP4)
**Resolution:** N/A (sample 404'd during download — S3 key may have been rotated)
**Note:** Annotation JSON was successfully downloaded.

**What it shows (from metadata):** Two sample types visible in metadata:
1. A man hiking along an alpine trail in a red plaid shirt — nature/outdoor scene
2. A historical scene prompt involving "an enslaved African man on a South Carolina plantation in the early 1800s" — sensitive historical content

**Enrichment available:** None (empty)

**Annotation file contents:** Binary safety classification:
- `generalData.text_policy_violation`: "no"
- `generalData.video_policy_violation`: "no"
- `metadata.prompt`: Full detailed generation prompt (200+ words describing camera movement, lighting, scene details)
- `project.type`: "RED_TEAM_SAFETY_PROJECT_VIDEO_POLICY_REVIEW"
- `project.title`: "Video Policy Review"

**Recommended Remotion composition:** "Safety Shield" — Show the prompt text appearing, then the (reconstructed/placeholder) video playing with an animated safety analysis overlay. A shield icon performs a "scan" animation across the frame, then verdict badges animate in: "Text Policy: PASS" (green), "Video Policy: PASS" (green). For a contrasting example, show a flagged prompt with "VIOLATION" (red) badges. Add a scanning-line effect across the video frame to suggest automated + human review.

**Why a researcher would care:** Every frontier AI lab needs robust content safety review. This shows Claru reviews both the text prompt AND the generated video output independently — dual-channel safety that's essential for responsible AI deployment. The sensitive historical content sample shows they handle nuanced edge cases, not just obvious violations.

---

## 6. Video Generation Preference Data

**Dataset ID:** bafc163f-83c5-48d5-8944-bd6808cf8688
**Media type:** Video (MP4)
**Resolution:** 1920x1024 | **Duration:** ~5s | **Size:** ~5.5 MB

**What it shows:** AI-generated video of a post-apocalyptic western ghost town. A cowboy in a weathered trench coat and wide-brimmed hat strides toward the camera down a dusty main street, aiming a revolver. Zombie-like figures shamble on either side. Desaturated/monochrome color grading. Cinematic quality — clearly output from a video generation model (likely Moonvalley). Impressive visual fidelity with dramatic lighting and atmospheric haze.

**Enrichment available:** None (empty)

**Annotation file contents:** A/B preference comparison:
- `generalData.betterVideoId`: "prompt_aea28902-e706-465b-8b40-3ffc7abe7dab" (video 1 selected as winner)
- `metadata.video_1`: S3 URL for video A
- `metadata.video_2`: S3 URL for video B (different seed/config of same prompt)
- `metadata.prompt_text`: Full generation prompt describing the cowboy scene in detail
- `project.type`: "VIDEO_MODEL_ARENA"
- `project.title`: "Video Arena Seed vs Seed"
- Annotation cost: $0.05 per comparison

**Recommended Remotion composition:** "Arena Battle" — Split-screen showing Video A vs Video B side by side, both generated from the same prompt. The prompt text types out at the top. After both videos play, an animated "VS" graphic appears, then a crown/trophy animates onto the winning video. Show preference stats: "72% of annotators preferred Video A". Add animated quality dimension breakdowns (motion quality, prompt adherence, visual fidelity). This is the most visually compelling composition — it directly shows how RLHF data for video models is collected.

**Why a researcher would care:** This is RLHF (Reinforcement Learning from Human Feedback) data for video generation — the exact same methodology that made ChatGPT possible, applied to video. Seed-vs-seed comparison isolates the effect of random seed on generation quality. This is cutting-edge video model training methodology.

---

## 7. Cinematic Action Footage

**Dataset ID:** b2d26fd9-745a-4161-9ecf-b784d743f5cf
**Media type:** Video (MP4)
**Resolution:** 3840x2160 (4K) | **Duration:** ~40s | **Size:** ~1 GB

**What it shows:** Professional documentary-grade footage from an African safari. A Samburu/Maasai man wearing traditional beaded jewelry (necklaces, arm bracelets, ear gauges) rides in the back of an open safari vehicle. The camera captures him looking out over the arid East African landscape — dry scrubland, acacia trees, distant mountains. Cinematic shallow depth of field, warm golden-hour lighting. This is clearly licensed professional cinematography, not amateur footage.

**Enrichment available:** None (empty)
**Annotation file contents:** None (no s3_annotation_key)

**Metadata:**
- `type`: "Cinematic"
- `section`: "Cinematic Licensed Data"
- `category`: "Travel & Exploration"
- `subcategory`: "Safari & Wildlife Tours"
- Second sample: Skiing footage (`category`: "Action Sports", `subcategory`: "Skiing")

**Recommended Remotion composition:** "Cinematic Showcase Reel" — Play the stunning 4K safari footage with a minimal, elegant overlay showing the classification metadata: genre tag, scene description, licensing status. Add a film-grain overlay and letterbox bars to emphasize the cinematic quality. Transition between the safari and skiing clips to show diversity. This composition sells the quality of Claru's licensed data pipeline — these aren't scraped YouTube clips, they're professional cinematography.

**Why a researcher would care:** Licensed, high-quality training data is a competitive moat for video generation companies. This 4K cinematic footage at 1GB per clip represents the premium tier of training data that produces the best model outputs. The cultural diversity (East African subjects) demonstrates responsible, globally representative data sourcing.

---

## 8. Systematic Quality Parameter Evaluations

**Dataset ID:** a5f0c373-0bed-4d30-8f6c-03a862cf968e
**Media type:** Video (MP4)
**Resolution:** 1080x1920 (portrait/vertical) | **Duration:** ~4s | **Size:** ~6 MB

**What it shows:** AI-generated 3D animation in a Pixar-like style. An anthropomorphic capybara character standing on a bright green grassy hill. The character is furry, wearing a white t-shirt and blue shorts, with an expressive face. Lush grass in the foreground, trees and blue sky in the background. Vertical format (portrait orientation). High visual quality — this is output from a video generation model being evaluated.

**Enrichment available:** None (empty)

**Annotation file contents:** Parameter comparison study:
- `generalData.selectedAnswer`: "21" (config 21 selected as better)
- `metadata.key`: "video_110_config_21_config_41" — systematic parameter sweep
- `metadata.video_1`: config 21 output
- `metadata.video_2`: config 41 output
- `metadata.input_video`: reference/input video
- `metadata.prompt_text`: Detailed Pixar capybara description with `<id_image_0>` placeholder (image-to-video task)
- `project.type`: "PARAMS_TESTING_OVERALL_QUALITY"
- `project.usesRanking`: true

**Recommended Remotion composition:** "Parameter Sweep Grid" — Show a grid of the same prompt rendered with different parameter configs (config_21 vs config_41, etc.). Highlight the winning config with a green border. Show a parameter table animating: config ID, inference parameters, and the human preference score. Add a convergence chart showing how parameter optimization narrows to the best config over iterations. This visualizes the systematic A/B testing that tunes video generation models.

**Why a researcher would care:** This is model hyperparameter optimization driven by human evaluation — a systematic approach to finding the best inference parameters. The naming convention (video_110_config_21_config_41) reveals an industrial-scale parameter sweep. This is how video generation companies tune their models before deployment.

---

## 9. Object & Face Identity Matching

**Dataset ID:** 040fee50-eafd-426d-bf9c-e5343b449d72
**Media type:** Video (MP4)
**Resolution:** 1920x1080 | **Duration:** ~5s | **Size:** ~6.4 MB

**What it shows:** Two men having a conversation outdoors in a park-like setting. One man (main subject, right side) has curly dark hair and wears a plaid shirt. The other man (left, partially visible) wears a straw hat. A stone monument/sculpture is visible in the background. Close-up framing focused on faces — ideal for identity matching tasks. The video shows the same two people across multiple frames with slight changes in expression/angle.

**Enrichment available:** None (empty)

**Annotation file contents:** Multi-segment identity verification:
- `generalData`: Binary yes/no for each segment-image pair (segment1_image1: "yes", segment1_image2: "yes", etc.)
- `metadata.segment`: Array of 2 segments, each containing:
  - `bbox`: [965, 222, 1390, 829] — bounding box coordinates for the face
  - `class`: "face"
  - `score`: 0.825 (detection confidence)
  - `thumbnail`: S3 path to cropped face thumbnail
  - `thumbnail_aligned`: S3 path to aligned face crop
  - `segment_id`: structured ID linking to clip
  - `frame_index`: -3 (3rd frame from end)
- `project.type`: "OBJECT_IDENTITY_V4"
- `project.title`: "Object Identity v4: Multiple Segments"

**Recommended Remotion composition:** "Identity Verification Pipeline" — Show the video playing, then freeze-frame. Animate bounding boxes drawing around detected faces with confidence scores. Extract the face crops and display them side by side with alignment lines connecting matching facial landmarks. Show the annotator's verdict: "Same person? YES" with a connecting green line between segments. Animate a confusion matrix or accuracy grid showing match/no-match across multiple segment pairs.

**Why a researcher would care:** Re-identification is critical for video understanding — knowing that "person A in scene 1 is the same as person A in scene 3" is fundamental for narrative understanding. The structured bbox + aligned thumbnail pipeline shows a sophisticated multi-stage approach: detection -> alignment -> human verification. The v4 versioning indicates iterative methodology refinement.

---

## 10. Product Image Annotation

**Dataset ID:** f6bdb2f1-b580-40ba-8f36-97e42d206ad0
**Media type:** Image (JPEG)
**Resolution:** ~500x700 (product photo) | **Size:** ~39 KB

**What it shows:** Professional e-commerce product photo of a man wearing a bright blue Craghoppers half-zip fleece pullover with black pants and hiking shoes. Clean gray studio background. Full-body shot showing the product clearly. This is a standard e-commerce lifestyle image.

**Enrichment available:** None (empty)

**Annotation file contents:** Rich product data annotation with bounding boxes:
- `generalData.brandName`: "Craghoppers"
- `generalData.brandUrl`: product page URL
- `generalData.category`: "Fashion (Men's)"
- `generalData.subcategory`: "Tops"
- `generalData.productUrl`: direct product page link
- `files[0]`: productImage with caption "A bright blue pullover with a half-zip front and long sleeves"
- `files[0].metadata.longCaption`: 50+ word detailed description
- `files[1]`: lifestyleImage with bounding box coordinates `{x1: 175.26, y1: 64.57, x2: 365.51, y2: 317.09}` — boxing the product within the lifestyle image
- `project.tag`: "sku-image-annotation-v1"
- Status: approved (with reviewer)

**Recommended Remotion composition:** "Product Intelligence" — Show the product image with animated bounding box drawing around the garment. Type out the AI-generated caption, then the long caption. Show the brand name, category, and subcategory labels sliding in. Animate a split showing "product image" vs "lifestyle image" with the bounding box highlighting the product within the lifestyle context. This shows how e-commerce product data gets structured for visual search and recommendation engines.

**Why a researcher would care:** Product image annotation with bounding boxes, captions, and structured metadata is foundational for visual search, virtual try-on, and recommendation models. The dual image types (product + lifestyle) with cross-referenced bounding boxes show sophisticated multi-modal annotation that goes beyond simple image tagging.

---

## 11. AI Image Generation Evaluation

**Dataset ID:** 55f26c56-04d5-4a30-9939-b49e3ad809bb
**Media type:** Image (PNG)
**Resolution:** ~480x854 (portrait) | **Size:** ~1 MB

**What it shows:** AI-generated image of a "Magic Flying Drone UFO" toy hovering in a modern living room. The drone/UFO has LED lights (blue, purple, green) creating colorful reflections on the walls and furniture. The room has a sofa, framed artwork, and ambient lighting. Photorealistic rendering quality — clearly AI-generated but impressively detailed. This is one of 8 generations from the same prompt being evaluated.

**Enrichment available:** None (empty)

**Annotation file contents:** Multi-generation evaluation with best-of-N selection:
- `generalData.bestImage`: "generation_0a62f119..." (best of 8)
- `generalData.hasGoodQuality`: "yes"
- `generalData.selectedImages`: 6 of 8 images selected as acceptable (75% pass rate)
- `metadata.prompt`: "Magic Flying Drone UFO Flying"
- `metadata.generations`: Array of 8 generation objects, each with unique ID and S3 URL
- `project.type`: "MAKER_GENERATION_EVALUATION"
- Second sample: "A Little Girl Wearing White Charm Jacket & Pant Set in a home" — fashion/apparel generation

**Recommended Remotion composition:** "Generation Gallery" — Show a 2x4 grid of all 8 generations from the same prompt, animating in one at a time. The prompt text types out above. Then animate green checkmarks on the 6 selected images and a red X on the 2 rejected ones. Finally, a gold crown animates onto the "best" image. Show quality stats: "6/8 acceptable (75%), 1 best". This directly visualizes the RLHF data collection process for image generation models.

**Why a researcher would care:** This is exactly how image generation models are evaluated and improved — generate N candidates, have humans pick the best. The 8-generation evaluation with both "acceptable" filtering and "best" selection provides rich signal for reward model training. The product/commercial prompts show real-world use cases driving evaluation priorities.

---

## 12. Prompt & Video Selection Rankings

**Dataset ID:** 8689f381-9bb2-4dec-9b0f-f8eb4ecce79b
**Media type:** Video (MP4)
**Resolution:** 1920x1080 | **Duration:** ~4.3s | **Size:** ~20 MB

**What it shows:** Kayaking footage — two kayakers paddling through a river slalom course with red/white and green/white gate poles. Lush green vegetation along the riverbanks, splashing water, and dynamic action. This is real-world captured footage (not AI-generated) being used as training data reference.

**Enrichment available:** None (empty)

**Annotation file contents:** Pairwise best-video selection within a category:
- `generalData.bestVideo`: S3 URL of the selected winner (video 2)
- `generalData.video1EndedAt`: 4.337667 (annotator watched full clip)
- `generalData.video2EndedAt`: 4.938267
- `generalData.videoBelongsToCategory`: true (verified category match)
- `metadata.video_1.category`: "Kayaking"
- `metadata.video_2.category`: "Kayaking"
- `project.type`: "SUPER_CATEGORY_BEST_VIDEO"
- `project.title`: "Super Category Best Video v1 Round 1"

**Recommended Remotion composition:** "Category Champion" — Split-screen showing two kayaking videos side by side with the category label "Kayaking" above. Both play simultaneously, then one gets a "WINNER" trophy animation. Show a tournament bracket structure where clips compete within their category until the best representative emerges. Animate the category verification checkmark. This shows how Claru curates the best representative examples for each content category.

**Why a researcher would care:** Best-of-N selection within categories is how training data gets curated — you want the single best "kayaking" clip, not just any kayaking clip. The round-based tournament structure ("v1 Round 1") suggests iterative refinement. This is training data curation at scale, determining which real-world videos become the gold standard for each content category.

---

## Summary Table

| # | Dataset | Type | Resolution | Has Annotation | Key Annotation Dimensions |
|---|---------|------|-----------|---------------|--------------------------|
| 1 | Egocentric Activity | Video 4K | 3840x2160 | No | None (raw collection) |
| 2 | Game Environment | Video | 1920x1200 | Yes | Game title, genre, scene type |
| 3 | Video Quality | Video | 1920x1080 | Yes | 5-axis quality rubric (cinematic, motion, quality, interest, alignment) |
| 4 | Video Classification | Video | 1920x1080 | Yes | Hierarchical category + subcategory |
| 5 | Content Safety | Video | N/A (404) | Yes | Binary text/video policy violation |
| 6 | Video Preference | Video | 1920x1024 | Yes | A/B preference (seed vs seed) |
| 7 | Cinematic Action | Video 4K | 3840x2160 | No | Category/subcategory only |
| 8 | Quality Parameters | Video | 1080x1920 | Yes | Parameter config preference (ranking) |
| 9 | Face Identity | Video | 1920x1080 | Yes | Multi-segment identity match + bboxes |
| 10 | Product Image | Image | ~500x700 | Yes | Brand, category, bbox, captions |
| 11 | AI Image Eval | Image | ~480x854 | Yes | Best-of-8, quality filter, prompt |
| 12 | Prompt Rankings | Video | 1920x1080 | Yes | Pairwise best-video + category verify |

## Key Findings for Remotion Compositions

### Richest annotation data (best for visualization):
1. **Video Quality Annotations** (#3) — 5 orthogonal quality dimensions, ideal for radar chart / gauge animation
2. **Object & Face Identity** (#9) — Bounding boxes with coordinates, face alignment, multi-segment matching
3. **Product Image Annotation** (#10) — Bounding boxes, dual captions, brand metadata, product URLs
4. **AI Image Generation Eval** (#11) — 8 generations, best-of-N selection, quality filtering
5. **Video Preference** (#6) — A/B comparison with prompt text, the purest RLHF visualization

### Most visually striking media:
1. **Cinematic Action** (#7) — Stunning 4K safari footage, professional cinematography
2. **Video Preference** (#6) — AI-generated cowboy/western scene, very cinematic
3. **Quality Parameters** (#8) — Charming Pixar-style capybara animation
4. **Game Environment** (#2) — Red Dead Redemption 2, AAA game graphics

### Important caveats:
- **No enrichment_json data exists** for any of the 12 datasets. The enrichment column is empty across the board.
- **Content Safety** (#5) sample video returned 404 — the S3 key may have been rotated or the file removed.
- **Egocentric** (#1) and **Cinematic** (#7) have no annotation files — they are raw collection datasets.
- All annotation JSONs contain the full Claru platform annotation record, including annotator IDs, reviewer IDs, timestamps, cost data, and browser metadata (IP, user agent, geolocation).

### Top 5 Remotion Compositions to Prioritize:
1. **"Arena Battle"** (Video Preference #6) — Split-screen A/B comparison with prompt + winner selection. This is the single most compelling visualization of RLHF for video.
2. **"Quality Rubric Dashboard"** (Video Quality #3) — Multi-axis quality assessment with animated gauges. Shows the depth of human evaluation.
3. **"Generation Gallery"** (AI Image Eval #11) — 8-image grid with best-of-N selection. Direct RLHF visualization for image models.
4. **"Identity Verification Pipeline"** (Face Identity #9) — Bounding boxes + face matching across segments. Shows computer vision annotation workflow.
5. **"Cinematic Showcase"** (Cinematic #7) — Pure visual impact. 4K safari footage sells the quality of the data pipeline.
