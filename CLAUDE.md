# CLAUDE.md — Starter site (HTML/CSS/JS → GitHub → Cloudflare)

Read this before touching any file. Sources: Akashic Records (`G:\Memory\Openclaw\Claude\agents\Akashic Records\`), notes 009/041/048/049/095.

## Stack (fixed)
- Plain HTML5 + CSS + vanilla JS. **No build step, no npm.** Deploy = `git push` → Cloudflare Pages (build command empty, output dir = root).
- CDN, pinned versions only (never `@latest`):
  - `gsap@3.15.0` (gsap, ScrollTrigger, SplitText) — free for commercial client work
  - `lenis@1.3.27` (its CSS is copied locally in `css/lenis.css`)
- Fonts: Google Fonts with preconnect, max 2 families, `display=swap`.

## Files
| File | Edit per client? | Purpose |
|---|---|---|
| `css/tokens.css` | YES | colors, fonts, type scale, spacing |
| `css/base.css` | rarely | reset, typography, focus, motion guards |
| `css/components.css` | sometimes | header, buttons, steps, FAQ, footer, sticky CTA |
| `css/site.css` | YES | this client's sections and signature element |
| `js/main.js` | no | Lenis + GSAP hooks (see header comment for `data-*` attributes) |
| `js/site.js` | YES | this client's signature animation (uses `window.site.mm`) |

## Design rules
1. **Design brief first.** Write a 5-line plan: palette (5–6 named hex), type roles, layout concept, ONE signature element, what makes it specific to this client's world. Check it is not a generic default (cream + terracotta, black + neon, identical rounded cards, ALL-CAPS eyebrows everywhere). Revise if it is.
2. Max 2 font families, 1 accent color (CTAs/links only). Contrast ≥ 4.5:1 for text.
3. Spend boldness in ONE place (the signature element). Everything else quiet.
4. Motion: one orchestrated moment + headline reveal. Do **not** put `data-reveal` on every block. Only animate `transform`/`opacity`.
5. Numbered markers only for real sequences (steps, timeline).
6. Copy: sentence case, plain verbs, CTA says exactly what happens ("Book a session", not "Submit"). Same CTA text everywhere.
7. Real photos of the client > stock. Placeholder images must be clearly marked `<!-- REPLACE -->`.

## Conversion structure (local business)
Hero (value prop ≤ 8 words + CTA) → trust strip → experience/benefits → how it works (3 steps) → prices → gallery → reviews → FAQ (`<details>`) → visit (address, hours, map) → final CTA → footer (NAP, policies). Sticky mobile CTA `.cta-sticky` pointing to `#book`.

## Non-negotiables (QA before every push)
- [ ] Page fully readable with JS disabled and with `prefers-reduced-motion: reduce`
- [ ] Hero/LCP image NOT lazy, has `fetchpriority="high"`, width/height set; other images `loading="lazy"`
- [ ] AVIF/WebP via `<picture>`, hero < 200 KB
- [ ] One `<h1>`, unique `<title>` + meta description, OG image 1200×630, JSON-LD with most specific schema type (e.g. `DaySpa`), validated
- [ ] Skip link, visible focus, targets ≥ 44px, labels on all form fields, Esc closes menu
- [ ] Test widths 360 / 768 / 1024 / 1440; no horizontal scroll; hero uses `100svh`
- [ ] No console errors; PageSpeed mobile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] Replace every `{{placeholder}}` (grep for `{{`)

## Deploy
1. `git init && git add -A && git commit -m "Initial site"` → push to a new GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick repo → build command empty, output `/` → Deploy.
3. Every later `git push` redeploys. Branch pushes get preview URLs (send those to the client).
4. Custom domain: Pages project → Custom domains.

## After the project
Save new lessons to `G:\Memory\Openclaw\Claude\agents\site-builder.md` (Lecții învățate) and useful findings to Akashic Records.
