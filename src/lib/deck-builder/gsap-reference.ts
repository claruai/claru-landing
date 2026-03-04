// =============================================================================
// GSAP Animation Reference for the Slide Agent
// Injected into system prompt so the agent can write GSAP-powered slides
// =============================================================================

export const GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';

export const GSAP_REFERENCE = `
## GSAP Animation Reference (for custom HTML slides)

You can use GSAP in any custom HTML slide by including the CDN script. Since each slide is a self-contained HTML canvas inside a presentation, add a <script> tag at the end of your slide HTML.

### CDN Setup (add at end of your slide HTML)
\`\`\`html
<script src="${GSAP_CDN}"></script>
<script>
  // Your animations here
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
</script>
\`\`\`

### Core Methods
- gsap.to(target, { props }) — animate TO a state
- gsap.from(target, { props }) — animate FROM a state (element starts at these values)
- gsap.fromTo(target, { fromProps }, { toProps }) — explicit start and end
- gsap.set(target, { props }) — instant set, no animation

### Common Properties
- x, y — translate (pixels, use % with xPercent/yPercent)
- opacity — 0 to 1
- scale, scaleX, scaleY — size
- rotation — degrees
- duration — seconds (default 0.5)
- delay — seconds before start
- ease — 'power1.out', 'power2.inOut', 'power3.out', 'back.out(1.7)', 'elastic.out(1, 0.3)', 'bounce.out'
- stagger — delay between multiple targets (e.g. 0.1)

### Timelines (sequence animations)
\`\`\`javascript
const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
tl.from('.title', { opacity: 0, y: 60 })
  .from('.subtitle', { opacity: 0, y: 40 }, '-=0.4')  // overlap by 0.4s
  .from('.stats', { opacity: 0, scale: 0.8, stagger: 0.15 }, '-=0.2');
\`\`\`

### Slide Animation Patterns

**Staggered entrance (great for bullet lists):**
\`\`\`javascript
gsap.from('.item', { opacity: 0, x: -30, duration: 0.6, stagger: 0.12, ease: 'power2.out' });
\`\`\`

**Number counter (great for stats):**
\`\`\`javascript
gsap.from('.stat-number', {
  textContent: 0,
  duration: 2,
  ease: 'power1.inOut',
  snap: { textContent: 1 },
  stagger: 0.3,
});
\`\`\`

**Fade-up sections:**
\`\`\`javascript
gsap.from('.section', { opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: 'power3.out' });
\`\`\`

**Typewriter effect:**
\`\`\`javascript
const text = document.querySelector('.typewriter');
const chars = text.textContent.split('');
text.textContent = '';
chars.forEach((char, i) => {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.opacity = '0';
  text.appendChild(span);
  gsap.to(span, { opacity: 1, duration: 0.05, delay: i * 0.04 });
});
\`\`\`

**Accent line grow:**
\`\`\`javascript
gsap.from('.accent-line', { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power2.out' });
\`\`\`

**Video grid entrance (stagger each cell):**
\`\`\`javascript
gsap.from('.grid-cell', { opacity: 0, scale: 0.85, duration: 0.5, stagger: { each: 0.08, grid: 'auto', from: 'random' }, ease: 'power2.out' });
\`\`\`

### Performance Tips
- Use transforms (x, y, scale, rotation, opacity) — never animate width, height, top, left
- Keep durations between 0.3s and 1.2s for UI animations
- Use ease: 'power2.out' or 'power3.out' as defaults (natural deceleration)
- For slide presentations, trigger animations immediately (no scroll trigger needed)
- Remember: each slide gets a fresh DOM when navigated to, so animations replay automatically

### CRITICAL — Animation Timing in Slides
Slides start hidden (opacity: 0) and fade in when navigated to. GSAP animations must NOT run until the slide is visible, or they'll complete while hidden and the content will appear broken.

**WRONG — animations fire immediately on page load, before slide is visible:**
\`\`\`javascript
gsap.from('.title', { opacity: 0, y: 40, duration: 1 }); // Fires immediately!
\`\`\`

**RIGHT — use a MutationObserver to detect when the slide becomes active:**
\`\`\`javascript
// Wait for this slide's container to get the 'active' class
const slide = document.querySelector('.slide[data-index="INDEX"]') || document.querySelector('.slide');
if (slide) {
  if (slide.classList.contains('active')) {
    runAnimations();
  } else {
    const observer = new MutationObserver(() => {
      if (slide.classList.contains('active')) {
        observer.disconnect();
        setTimeout(runAnimations, 300); // 300ms after fade-in starts
      }
    });
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
  }
}

function runAnimations() {
  gsap.from('.title', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
  gsap.from('.items', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 0.3 });
}
\`\`\`

**SIMPLEST — if you don't need animation, just use CSS. Static slides are fine.**
If the content is mostly text and images, skip GSAP entirely. Only add animations when they genuinely improve the slide.
`;

