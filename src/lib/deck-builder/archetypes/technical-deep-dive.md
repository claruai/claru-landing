# Technical Deep-Dive

## When to use this approach
Presentations to engineering audiences. Architecture reviews. Conference talks. Any context where the audience wants to understand how something actually works, not why they should buy it.

## Core philosophy
Engineers are the most skeptical and valuable audience. They can tell immediately when a presenter doesn't understand their own system. Respect the intelligence of the room by going deep, not broad. Every technical deep-dive should have a single central architectural insight that everything else orbits. The goal is not to show how much you built — it's to show you made good decisions under real constraints.

## Narrative arc
1. **The problem statement, precisely** — Not "we needed to be faster" but "P99 latency was 800ms on write-heavy workloads above 10K concurrent sessions."
2. **What you tried first and why it failed** — The most credible slide. Signals intellectual honesty. Engineers respect scars.
3. **The architectural insight** — The single decision that changed everything. One diagram, explained carefully.
4. **System architecture, current state** — Clean diagram with labeled components, data flows, boundaries. Show decisions, not everything.
5. **Deep-dive on the interesting parts** — Pick 2-3 subsystems where the hardest problems live. Go deep there, not everywhere.
6. **Performance data** — Real benchmarks, real test conditions, real caveats. No cherry-picking.
7. **What didn't work and what you'd do differently** — Builds enormous trust with technical audiences.
8. **Open problems** — What you still haven't solved. Invites collaboration, signals intellectual humility.
9. **Generous Q&A** — Technical audiences measure respect by how much time you leave for questions.

## Visual approach
- Architecture diagrams are the hero. Consistent colors for components, dashed lines for async, solid for sync.
- Code snippets: surgical, not exhaustive. Show the 8 lines that matter, not 200. Syntax highlighting, dark theme.
- Performance charts need labeled axes, explicit test conditions, and error bars.
- Minimal decorative design. No gradients, minimal photography. Content is the design.
- Monospace fonts for anything code-adjacent.
- Consider live terminal or code execution. Nothing lands harder than watching something actually run.

## Common mistakes
- **Too much breadth, not enough depth** — Covering 12 systems at surface level instead of 2 in depth.
- **Pasting full code blocks** — Walls of code unreadable from the back of the room.
- **Skipping what failed** — Presentations showing only the polished solution feel sanitized.
- **Overclaiming performance** — "10x faster" without stating compared to what, under what conditions, destroys credibility.
- **Not enough Q&A time** — Cutting Q&A to squeeze in slides is a category error for engineering audiences.

## How it differs from a McKinsey deck
McKinsey argues from conclusion down (Pyramid Principle). Technical decks argue from problem up, showing the reasoning that produced the solution. Consultants front-load the answer. Engineers earn the answer by walking through the evidence.

## References
- AWS re:Invent Chalk Talks (small group, whiteboard, real architecture)
- Stripe Engineering Blog talks (complex distributed systems, minimal slides, maximum precision)
- MIT CommLab framework (figures over words, audience-appropriate depth)
