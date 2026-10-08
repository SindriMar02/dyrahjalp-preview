---
version: anydesign-1
name: ISKRA (shelter concept, Behance)
source: Pinterest pin of a Behance concept "WordPress dogbible Pet Website Design"; screenshot refs/iskra.jpg
captured_at: 2026-10-08
description: |
  Bold wordmark hero: ISK✱RA in a heavy grotesk fills the top of the page and a cut-out dog stands in front of it.
  White ground, warm grey cards, one small yellow-green pill. The brand is the logotype; everything else is quiet.
colors:
  primary: "#332521"
  surface: "#FFFFFF"
  surface-card: "#E4E3DE"
  text-primary: "#332521"
  text-muted: "#737062"
  accent: "#D6E64A"
typography:
  display: { fontFamily: "heavy geometric grotesk (unidentified)", fontSize: 220px, fontWeight: 800, lineHeight: 0.9, letterSpacing: -0.03em }
  heading: { fontFamily: "same grotesk", fontSize: 40px, fontWeight: 600, lineHeight: 1.1 }
  body: { fontFamily: "same grotesk", fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
spacing:
  base: 8px
  scale: [8, 16, 24, 40, 64]
rounded:
  md: 12px
  pill: 999px
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.surface}", rounded: "{rounded.pill}", padding: 12px 24px }
  info-card: { backgroundColor: "{colors.surface-card}", textColor: "{colors.text-primary}", rounded: "{rounded.md}", padding: 24px }
---

# Design Analysis: ISKRA (shelter concept, Behance)

> Analysis generated with the `anydesign` skill. Date: 2026-10-08. Emphasis: mood (concept image only)

## Source
One Behance presentation frame seen through Pinterest at ~460 px wide. Russian copy ("Подари дом верному сердцу",
give a home to a loyal heart). Colours grounded with `extract_colors.py`; the yellow-green pill is a vision estimate.
No code, mobile or motion exists.

## TL;DR
A one-move brand: the wordmark at poster size with the dog standing in front of it, and a star replacing a letter.
Below the mark the page is a conventional white site with grey cards. Useful as a lesson in restraint around a
single loud gesture; not useful as a system, because the system under the wordmark is generic.

## 1. Visual identity

### 1.1 Surface description
- Personality: bold, graphic, young ✅
- Mood: poster on a white wall ✅
- Stylistic references: Pentagram-style identity site; "big type + cut-out subject" ⚠️
- Information density: low above the fold, medium in the card row ✅
- Implicit positioning: the shelter as a brand people wear, not an institution ⚠️

### 1.2 Brand voice / Atmosphere
The design believes the shelter needs to be memorable before it needs to be informative: a name you can draw from
memory, a dog that looks at you, and nothing else competing. So the wordmark gets the whole viewport width, the
accent is one small pill, and the information layer is deliberately plain so the mark stays the loudest thing.

### 1.3 The "ONE brand thing"
- The thing: the ISK✱RA wordmark at ~220 px with the ✱ in place of the second syllable's letter, dog cut-out overlapping it ✅
- Why: it is the identity; the rest of the page could be any site
- Restraint: white ground, one grey card tone, body 14 px, a single yellow-green pill
- Where: the hero only; it does not repeat lower on the page

## 2. Design System (tokens)

### 2.1 Colors
| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `primary` | #332521 | near-black brown ink | wordmark, headings, primary button | ✅ extract_colors (13.5%) |
| `surface` | #FFFFFF | white ground | page | ✅ (34%) |
| `surface-card` | #E4E3DE | warm grey card | info cards, nav pill | ✅ (20%) |
| `text-muted` | #737062 | grey-olive meta | small copy | ✅ (11%) |
| `accent` | #D6E64A | yellow-green pill | one tag ("возраст 1.5 года") | ⚠️ vision |

### 2.2 Typography
One heavy geometric grotesk throughout (Druk / Monument register) ⚠️, unidentified.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | ~220px | 800 | 0.9 | wordmark |
| `heading` | ~40px | 600 | 1.1 | "Подари дом верному сердцу" |
| `body` | ~14px | 400 | 1.5 | intro, cards |

### 2.3 Spacing
Base 8 px ⚠️; 24 px card padding, 40–64 px between the hero and the card row.

### 2.4 Radii
12 px cards, pill buttons and tags; two scales kept apart ⚠️.

### 2.5 Elevation system
| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | surface tone | everything |

Flat; the grey card tone is the only depth cue.

### 2.6 Borders
None visible; cards are tone-separated.

### 2.7 Accessibility quick-check
From `iskra-a11y.md`: ink on white 14.6:1 AAA; ink on grey card 11.6:1 AAA; grey-olive on white 4.0:1 (large only).

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Variants: 1 (dark pill) plus a light pill with an arrow ⚠️
- Sizes: 1, ~40 px
- Visible states: default
- Padding/Radius: 12×24 px, pill
- Confidence: ⚠️

#### info-card
- Variants: 1; grey card with a short paragraph and an icon
- Sizes: 1, in a row of 3–4
- Visible states: default
- Padding/Radius: 24 px, 12 px
- Confidence: ⚠️

### 3.2 Signature components
1. **Wordmark-as-hero with a cut-out subject** – the dog overlaps the letters so the type reads as scenery.
2. **Letter swapped for a symbol** (✱) – gives the mark a logo without a separate icon.

## 4. Layout & Composition

### 4.1 Grid & containers
Full-bleed wordmark, then a ~1100 px container with a 2-column split (copy left, photo right) ⚠️.

### 4.2 Composition patterns
Poster hero → split intro → card row.

### 4.3 Responsive behavior
Desktop only ❓. A 220 px wordmark needs a fluid clamp and a phone variant.

### 4.4 Image behavior
- One cut-out photo of a dog (background removed), colour kept natural.

## 5. Reconstruction Notes
Stack: static, no framework signal. Quick wins: the wordmark hero. Tricky: cut-out photography needs a clean
subject; the ✱ needs a glyph that matches the face. States: hover, focus, reduced motion.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅/⚠️ | surfaces measured, accent estimated |
| Typography | ⚠️ | unidentified |
| Layout | ⚠️ | low-res frame |
| Motion | ❓ | none |

## 6. Do's and Don'ts

### Do
- Give the wordmark the whole width once, at the top, and never repeat it.
- Keep `{colors.accent}` to one small tag per screen.
- Keep body copy on `{colors.surface}` or `{colors.surface-card}` only.

### Don't
- Don't put `{colors.text-muted}` under 18 px on white (4.0:1).
- Don't add a second display weight; 800 is the ceiling and it belongs to the mark.
- Don't use the ✱ as a bullet or icon elsewhere.

## 7. Open Questions
- Typeface and accent hex: only the original Behance files would settle them.
- Whether anything below the card row exists.

## 8. Companion files
- `iskra-tokens.json` generated by `build_tokens_json.py`.
- `iskra-a11y.md` generated by `check_contrast.py`.
- Frame used: `scratchpad/refs/iskra.jpg`.
