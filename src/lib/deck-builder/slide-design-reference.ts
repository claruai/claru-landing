// =============================================================================
// Slide Design Reference — Management consulting + B2B sales deck principles
// On-demand knowledge the agent retrieves via get_design_reference tool
// =============================================================================

export const SLIDE_DESIGN_REFERENCE = `
## Slide Design Principles (McKinsey + B2B Sales Best Practices)

### THE #1 RULE: One Message Per Slide
Every slide communicates exactly ONE insight. If you have two points, make two slides.
The audience should understand the slide's point in 3 seconds from the title alone.

### Action Titles (not labels)
WRONG: "Market Analysis", "Our Team", "Product Overview"
RIGHT: "AI labs waste 40% of compute on bad training data", "Our embedded teams ship 3x faster than vendors"

The title IS the takeaway. It's a complete sentence — a claim, not a category.
If someone only reads the titles of every slide, they should understand the full argument.

### The Pyramid Principle (Barbara Minto)
Lead with the conclusion, then support it. Don't build up to the point — start with it.
- Slide title: the answer/claim
- Body: 2-3 supporting arguments
- Each argument backed by one piece of evidence

### Visual Hierarchy
1. **Title** — largest, boldest. The ONE thing to remember. (28-44px)
2. **Key stat or visual** — the proof. A number, chart, or image that anchors the claim. Make it BIG.
3. **Supporting text** — secondary. Bullet points, not paragraphs. (16-20px)
4. **Source/footnote** — smallest. Attribution or context. (10-12px)

### The 3-Second Test
Cover the slide body and read only the title. Does it make a clear claim?
Uncover the body. Does it prove the title's claim in under 3 seconds?
If not, the slide needs work.

### Data Presentation
- ONE chart per slide, with a title that states the takeaway ("Revenue grew 3x" not "Revenue Chart")
- Use large numbers as visual anchors: "1,000+ hours" should be displayed huge, not buried in a bullet
- Contrast is your friend: before/after, old/new, them/us

### Text Rules
- Max 5 bullet points per slide
- Max 8 words per bullet
- No full paragraphs on slides — that's a document, not a presentation
- Bold the key phrase in each bullet, let the rest be secondary color

### Color Usage
- 1 accent color for emphasis (Claru: #92B090 sage green)
- Dark backgrounds: white text primary, 60% opacity for secondary
- Use accent color ONLY for: key stats, active states, the ONE thing to emphasize
- Never use more than 3 colors total

### Layout Patterns (for custom HTML slides)

**Stats Slide:** 2-4 large numbers in a row, each with a label below. Numbers in accent color, huge font (60-80px).

**Comparison Slide:** Two columns with a vertical divider. Left = old way (muted), Right = new way (accent). Make the contrast visual.

**Evidence Slide:** Full-bleed image or video on one side (55%), text on the other (45%). The visual IS the proof.

**Quote Slide:** Large quote mark, big italic text, attribution below. Keep it to 2 sentences max.

**Section Divider:** Just the section title, huge, centered. Maybe a background visual. No body text needed.

**Process Slide:** 3-5 horizontal steps connected by arrows or lines. Each step has an icon + short label. Not paragraph descriptions.

### B2B Sales Deck Structure (for first-call decks)

1. **Hook** — Bold claim that creates tension. Not about you — about THEIR world.
2. **Problem** — Name the specific pain. Quantify the cost.
3. **Old Way vs New Way** — Make the status quo feel unacceptable.
4. **Solution** — Your approach (not your product). Lead with methodology.
5. **Proof** — Case studies, metrics, logos. Specific > general.
6. **How It Works** — Remove friction. Show the clear path.
7. **CTA** — One clear next step. Low friction.

### The Champion Test
Your prospect has to resell this deck internally to people who haven't met you.
Every slide should be skim-able, memorable, and standalone.
Bold problem framing + clear solution + one killer proof point.

### What NOT To Do
- No "About Us" slide with founding year and employee count
- No feature lists — features don't sell, outcomes do
- No "Thank You" slide — end with a question or CTA
- No walls of text — if it takes 30 seconds to read, it's a document
- No gratuitous animations — motion should serve meaning, not decoration
- No generic stock photos — use real data, real screenshots, real work

---

## Spatial Layout Guide — The 1920×1080 Canvas

Every custom HTML slide is rendered at exactly 1920×1080px. Your HTML fills this space. Use these concrete values to position elements correctly.

### Safe Zones & Padding
- **Outer padding**: min 80px on all sides. Content should live within a 1760×920 inner area.
- **Top margin for title**: 80-120px from top edge
- **Bottom margin**: keep last element at least 80px from bottom (slide counter lives at bottom-right)

### Font Sizes (at 1920×1080)
| Element | Size | Weight |
|---------|------|--------|
| Slide title (action claim) | 52-72px | 700 (bold) |
| Big stat number | 64-96px | 700 |
| Stat label / subtitle | 18-24px | 400 |
| Body text / bullets | 22-28px | 400 |
| Secondary / muted text | 16-18px | 400 |
| Monospace labels | 12-14px | 400 |

At these sizes on a 1920px canvas, text is readable when the presentation is projected or shown full-screen. Anything under 18px becomes hard to read.

### Layout Templates (concrete px values)

**Centered Title Slide:**
\`\`\`
Container: width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px;
Title: font-size:64px; max-width:1200px; text-align:center;
Subtitle: font-size:24px; margin-top:24px; max-width:800px; opacity:0.6;
\`\`\`

**Title + Body (left-aligned):**
\`\`\`
Container: padding:100px 120px; max-width:1400px;
Title: font-size:56px; margin-bottom:40px;
Body area: font-size:24px; line-height:1.6; max-width:900px;
Bullets: padding-left:24px; margin-bottom:16px;
\`\`\`

**Split Layout (text left, visual right):**
\`\`\`
Container: display:flex; height:100%; padding:80px;
Left column: flex:1; padding-right:60px; display:flex; flex-direction:column; justify-content:center;
Right column: width:45%; display:flex; align-items:center; justify-content:center;
Gap between columns: 60-80px
\`\`\`

**Two-Column Comparison:**
\`\`\`
Container: display:flex; height:100%; padding:80px 100px;
Title row: width:100%; margin-bottom:48px;
Left column: flex:1; padding-right:40px;
Divider: width:2px; background:accent at 30% opacity;
Right column: flex:1; padding-left:40px;
\`\`\`

**Full-Bleed Video/Image:**
\`\`\`
Video/Image: position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
Overlay: position:absolute; inset:0; background:linear-gradient(to right, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.4) 60%, transparent 100%);
Text on overlay: position:relative; z-index:1; padding:100px 120px; max-width:800px;
\`\`\`

**Stats Row (2-3 big numbers):**
\`\`\`
Container: display:flex; justify-content:center; gap:120px; padding:80px;
Each stat: text-align:center;
Number: font-size:80px; font-weight:700; color:accent;
Label: font-size:18px; margin-top:12px; opacity:0.6; text-transform:uppercase; letter-spacing:2px;
\`\`\`

### Common Positioning Mistakes
- **Content crammed into top-left**: Use \`justify-content:center\` on the container to vertically center
- **Huge empty bottom half**: Either center vertically or add more visual weight to the bottom
- **Text touching edges**: Always maintain 80px+ padding from slide edges
- **Tiny text**: If any text is under 18px on the 1920 canvas, it won't be readable when presented
- **Unbalanced split layouts**: In a two-column layout, if one side has much less content, the visual weight feels off. Either balance content or use a 60/40 split instead of 50/50
- **Elements overlapping the slide counter**: The bottom-right corner (last 100px) has the slide number overlay. Keep content clear of that zone.
`;

