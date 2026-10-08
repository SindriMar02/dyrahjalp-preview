---
version: anydesign-1
name: Pawthway (pet adoption concept, Pinterest)
source: Pinterest pin "Pet Adoption Website Design" by M Nazmul Islam (concept, not live); screenshot refs/pawthway.jpg
captured_at: 2026-10-08
description: |
  Warm editorial adoption site: cream paper, a terracotta band with the headline, olive and sand panels,
  every claim next to a dog photo. Reads as a magazine spread about one animal at a time, not a listing tool.
colors:
  primary: "#C8552B"
  surface: "#F8F4EE"
  surface-sand: "#E8E5DD"
  surface-olive: "#6F7A4F"
  text-primary: "#473022"
  text-muted: "#867253"
  border: "#C5BAA6"
typography:
  display: { fontFamily: "transitional serif with a true italic (unidentified)", fontSize: 56px, fontWeight: 400, lineHeight: 1.05, letterSpacing: -0.01em }
  heading: { fontFamily: "same serif", fontSize: 32px, fontWeight: 400, lineHeight: 1.1 }
  body: { fontFamily: "neutral grotesk (unidentified)", fontSize: 15px, fontWeight: 400, lineHeight: 1.5 }
  label: { fontFamily: "neutral grotesk", fontSize: 12px, fontWeight: 500, letterSpacing: 0.04em }
spacing:
  base: 8px
  scale: [8, 16, 24, 32, 48, 64, 96]
rounded:
  sm: 4px
  pill: 999px
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.surface}", rounded: "{rounded.pill}", padding: 10px 20px }
  animal-card: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.sm}", padding: 0 }
  stat-tile: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "0", padding: 0 }
  step-list: { backgroundColor: "{colors.surface-sand}", textColor: "{colors.text-primary}", rounded: "0", padding: 24px }
---

# Design Analysis: Pawthway (pet adoption concept, Pinterest)

> Analysis generated with the `anydesign` skill. Date: 2026-10-08. Emphasis: mood + design system (concept image only)

## Source
Pinterest pin, a Behance-style presentation board of a concept site (desktop frames only). Captured as one 1289×740
screenshot; the board itself is roughly 460 px wide inside it, so every value below is read from pixels at low
resolution. `extract_colors.py` grounded the surfaces; the terracotta and olive are vision estimates. No code, no
mobile, no motion exists for this source.

## TL;DR
A warm, photo-led adoption site that treats each animal like a magazine subject: serif headline with one italic
word, a terracotta hero band, cream and olive panels, dog photos in every block. Distinctive because the palette
comes from fur, grass and earth rather than from "charity blue". Actionable: take the colour temperature and the
story-led cards; drop the panel-in-panel layout, which is the part that would read as a template.

## 1. Visual identity

### 1.1 Surface description
- Personality: warm, editorial, unhurried, trustworthy ✅
- Mood: autumn afternoon, golden retriever light; nothing clinical ✅
- Stylistic references: Pawthway sits between a Kinfolk-style editorial and a Webflow "cozy brand" template ⚠️
- Information density: medium; every block has a photo plus 2–4 lines, stats in a row of three ✅
- Implicit positioning: adoption as a considered, guided decision ("pathway", three numbered steps) ✅

### 1.2 Brand voice / Atmosphere
The design believes an adopter is nervous and needs reassurance more than choice. So the headline promises a
path, the three steps come before the animals, the testimonial ("we came in just looking") sits beside a photo of
the dog, and the colours stay close to skin, fur and earth. Nothing is bright or urgent; even the CTA terracotta
is muted. Every choice says "slow down, we will walk you through it".

### 1.3 The "ONE brand thing"
- The thing: the serif headline with exactly one italic word (*pathway*, *real*) on the cream ground ✅
- Why it carries the brand: the italic is the human voice inside an otherwise calm system; it is the only expressive type move
- Restraint around it: body and labels are a plain grotesk at 12–15 px; buttons are small pills; no second display face
- Where it appears: hero, section leads, the olive closing band; deliberately not in cards, stats or navigation

## 2. Design System (tokens)

### 2.1 Colors
| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `primary` | #C8552B | terracotta CTA + hero band | hero background, buttons, the 03 step marker | ⚠️ vision |
| `surface` | #F8F4EE | cream page ground | page, cards | ✅ extract_colors (12%) |
| `surface-sand` | #E8E5DD | sand panel | steps list, service tiles | ✅ extract_colors (16%) |
| `surface-olive` | #6F7A4F | olive closing band | "Give a good soul a second chance" band | ⚠️ vision |
| `text-primary` | #473022 | dark brown ink | headlines, body | ✅ extract_colors (12%) |
| `text-muted` | #867253 | brown meta | captions, nav, labels | ✅ extract_colors (14%) |
| `border` | #C5BAA6 | hairline between tiles | stat row, footer | ✅ extract_colors (9%) |

### 2.2 Typography
Display family: a transitional serif with a real italic (Instrument Serif / Fraunces register) ⚠️. Body: a neutral
grotesk ⚠️. Both unidentified; no code.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | ~56px | 400 | 1.05 | hero "Every paw deserves a *pathway* home." |
| `heading` | ~32px | 400 | 1.1 | section leads, olive band |
| `body` | ~15px | 400 | 1.5 | paragraphs, testimonial |
| `label` | ~12px | 500 | 1.3 | eyebrows, nav, stat captions |

Tracking: display slightly tight; labels open. Headline case: sentence case, never uppercase.

### 2.3 Spacing
Base 8 px ⚠️. Observed: 16 inside tiles, 24 tile padding, 48–64 between blocks, 96 before the olive band. Consistent.

### 2.4 Radii
Two scales kept apart: 4 px on image corners and tiles, pill on buttons. ⚠️

### 2.5 Elevation system
| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | surface tone only | everything |

Flat by design: depth comes from the three ground tones (cream, sand, olive) and the terracotta band, never from shadow.
Decorative depth: a faint paw outline watermark on the olive band ⚠️.

### 2.6 Borders
1 px hairlines in `border` between stat cells and footer columns; no focus treatment visible (static image).

### 2.7 Accessibility quick-check
From `pawthway-a11y.md`: ink on cream 11.18:1 AAA; ink on sand 9.73:1 AAA; brown meta on cream 4.22:1 (large only);
white on terracotta 4.38:1 (large only); cream on olive 4.19:1 (large only). The three "large only" pairs are the
ones to fix in any transplant: darken the meta brown and the terracotta.

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Variants: 1 observed (terracotta pill, cream text); a ghost outline variant beside it ⚠️
- Sizes: 1, ~36 px tall
- Visible states: default only (image)
- Padding/Radius: ~10×20 px, pill
- Confidence: ⚠️

#### animal-card
- Variants: 1 observed; photo 4:5, name, breed/age line, "Meet" link
- Sizes: 2-up beside the hero, 3-up lower down
- Visible states: default
- Padding/Radius: photo full-bleed in the tile, 4 px corners, 12 px text gap
- Confidence: ⚠️

#### stat-tile
- Variants: 3 in a row ("3,400+", "98%", "40+") with 1-line captions
- Sizes: 1
- Visible states: default
- Padding/Radius: hairline-separated, no radius
- Confidence: ✅ (clearly readable)

#### step-list
- Variants: 1; numbered 01–03, title + 1 line each, on the sand panel
- Sizes: 1
- Visible states: default
- Padding/Radius: 24 px, square
- Confidence: ✅

### 3.2 Signature components
1. **Headline with one italic word** – see 1.3; the entire voice of the site in one type move.
2. **Story card** – a photo of the dog beside a quote from the adopter ("we came in just looking…"), the dog's
   name as the attribution. Turns proof into a story; appears once per page.
3. **Terracotta hero band with a cut-in photo** – the photo overlaps the band's edge, so the band reads as paper
   under the picture rather than as a coloured box.

## 4. Layout & Composition

### 4.1 Grid & containers
~1200 px content width inside the 1440 frame, 12 columns, 24 px gutters ⚠️. Vertical rhythm ~64 px between blocks.
Hierarchy by size (56 → 32 → 15) and by ground tone, not by weight: everything is 400 except labels.

### 4.2 Composition patterns
Split hero (text left, photo right, both inside the terracotta band) → stat row → "adoption done with real care"
split with a 3-step list → services 3-up on sand → testimonial split → olive closing band with a centred headline
and two CTAs → dense footer matrix.

### 4.3 Responsive behavior
Desktop only in the source ❓. Recommend 3-up → 2-up → 1-up for tiles; hero stacks photo under text.

### 4.4 Image behavior
- Photography of dogs, warm light, square or 4:5 crops, no filters; never clipped by text.
- One paw-print line watermark on the olive band (decorative) ⚠️.

## 5. Reconstruction Notes
Stack: static HTML/CSS is enough; nothing here needs a framework (no evidence of one).
Quick wins: the three ground tones; the italic-word headline; the stat row.
Tricky bits: keeping four ground colours (cream, sand, olive, terracotta) from reading as a template; the
headline italic needs a serif with a true italic and Icelandic glyphs; terracotta fails AA for small text.
States to define: hover, focus, loading, empty filter, form error.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ⚠️ | surfaces measured, accents estimated |
| Typography | ⚠️ | families unidentified |
| Components | ⚠️ | read at ~460 px board width |
| Layout | ✅ | clearly legible |
| Motion | ❓ | none exists |

## 6. Do's and Don'ts

### Do
- Keep one italic word per headline in `{typography.display}`; it is the voice.
- Use the three ground tones (`{colors.surface}`, `{colors.surface-sand}`, `{colors.surface-olive}`) as bands, one per section.
- Put a photo of the animal in every block that makes a claim.
- Keep buttons small and quiet; `{colors.primary}` appears on the hero band and the CTA only.
- Pair every number with a one-line caption, as in the stat row.

### Don't
- Don't use `{colors.primary}` for text under 24 px (4.38:1).
- Don't add a second display face or weights above 500.
- Don't box the whole page in rounded panels; the concept's weakest part is the tile-inside-tile hero.
- Don't use the paw watermark more than once.
- Don't set `{colors.text-muted}` under 18 px on cream (4.22:1).

## 7. Open Questions
- Exact typefaces: only the live concept files would settle it.
- Terracotta and olive hex: estimates; a higher-resolution export would ground them.
- Mobile and motion: none exist for a concept board.

## 8. Companion files
- `pawthway-tokens.json` generated by `build_tokens_json.py`.
- `pawthway-a11y.md` generated by `check_contrast.py`.
- Frame used: `scratchpad/refs/pawthway.jpg`.
