# Partner Earnings Calculator — Spec

## Inputs (3 chosen)
1. **Workforce size** — segmented +/- stepper with presets (1, 5, 25, 100). Anchors expectations from solo operator → fleet.
2. **Hours per worker per week** — slider with snap stops (1, 3, 8, 16). Captures intensity.
3. **Vertical / complexity tier** — dropdown driving rate band:
   - Food & Retail ($40–$60/hr)
   - Trades & Manufacturing ($60–$90/hr)
   - Robotics & Specialized ($90–$120/hr)
4. **Existing footage archive (toggle)** — shown as a secondary "ADD: archive license" line, not folded into monthly. Keeps the headline clean.

Why these: workforce × hours × rate is the simplest mental model that an operator can verify in their head. Tier replaces ten micro-questions about modality. Archive is opt-in so it doesn't inflate the headline number.

## Math
- `monthly_low  = workers × hpw × 4.3 × tier.lowRate`
- `monthly_high = workers × hpw × 4.3 × tier.highRate`
- `archive_low  = $5,000`, `archive_high = $50,000` (one-time, separate)

## Output Shape
- Eyebrow `// PARTNER_EARNINGS_ESTIMATOR`
- Big sage range `$X,XXX – $XX,XXX /mo` count-up animated
- Sublabel: "Estimated monthly partner revenue · before payouts to your team"
- Conditional archive line if toggle on: `+ $5K–$50K one-time archive license`
- Disclaimer in muted mono
- CTA: `See if your business qualifies →` → `#apply`

## CTA Copy
Same as Hero CTA so the page reads as one motion. Underline support text: "5 business day reply · Net-15 on signed deals"

## Alternate UX (rejected)
A wizard-style 3-step modal where each input flips a card with revealed math. Considered but rejected — adds friction (the brief says 5 seconds), hides the live response feel, and breaks the "one HUD panel" terminal aesthetic. The scrubbing inputs with live-ticking output is more visceral and on-brand.
