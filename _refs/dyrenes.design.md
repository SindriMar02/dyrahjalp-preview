---
version: anydesign-1
name: Dyrenes Beskyttelse — Adoptér et dyr
source: https://www.dyrenesbeskyttelse.dk/adopter-et-dyr (live; plus / and one animal page)
captured_at: 2026-10-08
description: |
  Denmark's largest animal welfare organisation. Near-white paper, one deep red used as a band and a button, warm
  brown body text, a wide grotesk with uppercase headings. The adoption list is a plain full-bleed 3-column photo
  grid with one FILTRER button and a live count; the animal page is a photo beside a story and a fact table.
colors:
  primary: "#741B0D"
  primary-bright: "#E9442E"
  surface: "#FAFAFA"
  surface-sand: "#F2EDE7"
  text-primary: "#141414"
  text-body: "#463930"
  text-on-primary: "#F5F0E6"
  border: "#141414"
typography:
  display: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 32px, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.5px, textTransform: uppercase }
  heading: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 24px, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.5px }
  card-title: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 24px, fontWeight: 700, lineHeight: 1.1, letterSpacing: 0.3px }
  card-meta: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 18px, fontWeight: 700, lineHeight: 1.35, letterSpacing: 0.3px }
  body: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 16px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0.3px }
  control: { fontFamily: "PressuraExtended, Helvetica, Arial, sans-serif", fontSize: 16px, fontWeight: 500, lineHeight: 1, textTransform: uppercase }
spacing:
  base: 8px
  scale: [8, 16, 24, 32, 48, 64, 96]
rounded:
  none: 0px
motion:
  panel: "transform 300ms cubic-bezier(0.77,0,0.175,1)"
  fade: "opacity 200ms ease-out"
  color: "color 250ms"
components:
  button-filter: { backgroundColor: "transparent", textColor: "{colors.text-primary}", rounded: "{rounded.none}", padding: 15px 57px 15px 23px, border: "2px solid {colors.border}" }
  button-support: { backgroundColor: "{colors.primary-bright}", textColor: "#FFFFFF", rounded: "{rounded.none}", padding: 12px 20px }
  animal-tile: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.none}", padding: 0 }
  fact-table: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.none}", padding: 16px 0 }
  intro-band: { backgroundColor: "{colors.primary}", textColor: "{colors.text-on-primary}", rounded: "{rounded.none}", padding: 48px }
---

# Design Analysis: Dyrenes Beskyttelse — Adoptér et dyr

> Analysis generated with the `anydesign` skill. Date: 2026-10-08. Emphasis: reconstruction + design system

## Source
Live site, three pages (adoption list, home, one animal page), captured with `getComputedStyle` in the browser
pane at 1024 px plus the studio probe (`capture.mjs`, 1440 and 390, `.motion.json` / `.surfaces.json` / vendored
CSS). Python Playwright is not installed, so the anydesign capture script did not run; computed values are from
the browser pane and are ✅. Cookie banner declined before measuring.

## TL;DR
A welfare organisation that looks like a good Danish institution: one deep red, one wide grotesk, flat, square,
nothing decorative. The adoption list is the model for Dýrahjálp's filter page: a FILTRER button with a live count
("218 dyr"), then a full-bleed 3-up photo grid where each tile is photo / name / shelter / arrow. Motion is almost
absent (jQuery, CSS transitions only, no scroll choreography), which is the one thing not to copy.

## 1. Visual identity

### 1.1 Surface description
- Personality: institutional, calm, warm-neutral, direct ✅
- Mood: a well-run shelter office; daylight, no drama ✅
- Stylistic references: Danish public-sector sites (DR, Københavns Kommune) with a wide grotesk ⚠️
- Information density: low on the intro band, high in the grid (218 animals, 3-up, no pagination seen) ✅
- Implicit positioning: adoption is a service with rules ("er du klar til dyr?" before the list) ✅

### 1.2 Brand voice / Atmosphere
The design believes the visitor is a responsible adult who will read before acting. So the list is preceded by a
red band of expectations, the type is one sober grotesk in two weights, the only colour is the organisation's own
red, and each animal gets a plain photo rather than a styled card. Nothing tries to charm; the animals do that.

### 1.3 The "ONE brand thing"
- The thing: the deep red `#741B0D` as a full band (intro) and as the bright `#E9442E` STØT button in the header ✅
- Why: it is the organisation's colour; it marks "the organisation speaking" versus the animals' white grid
- Restraint: every other surface is #FAFAFA or #F2EDE7; body text is brown, not black, so the red stays loudest
- Where: intro band, STØT button, the arrow-link hover; deliberately not on tiles, headings or the filter button

## 2. Design System (tokens)

### 2.1 Colors
| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `primary` | #741B0D | deep red band | adoption intro band | ✅ extract_colors 16% + computed h1 colour context |
| `primary-bright` | #E9442E | CTA red | STØT button, "Tjek: er du klar" link | ⚠️ pixel read |
| `surface` | #FAFAFA | paper | page background (rgb 250,250,250) | ✅ computed |
| `surface-sand` | #F2EDE7 | warm sand | menu/filter panel ground | ✅ extract_colors 11% |
| `text-primary` | #141414 | ink | headings, names, controls | ✅ computed |
| `text-body` | #463930 | warm brown | paragraphs, tile meta | ✅ computed |
| `text-on-primary` | #F5F0E6 | bone | h1 on the red band | ✅ computed |
| `border` | #141414 | 2 px outline | filter button | ✅ computed |

### 2.2 Typography
`PressuraExtended` (GT Pressura Extended, Grilli Type, commercial) ✅ computed, weights 400/500/700, fallback
Helvetica/Arial. Wide grotesk: the extension is the personality. Headings uppercase with −0.5 px tracking; body
has +0.3 px tracking, which is unusual and keeps the wide face readable at 16 px.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 32px | 700 | 35.2px (1.1) | page h1, uppercase, bone on red |
| `heading` | 24px | 700 | 26.4px | h2 |
| `card-title` | 24px | 700 | 26.4px | animal name |
| `card-meta` | 18px | 700 | 24.3px | "Internat · Fyns Internat" |
| `body` | 16px | 400 | 24px | paragraphs (brown) |
| `control` | 16px | 500 | 16px | FILTRER, uppercase |

### 2.3 Spacing
Base 8 px ✅ (15/23/57 px button padding is the exception). Grid gutter ~24 px, tile text block 16 px, 48 px
band padding, 64–96 px between sections.

### 2.4 Radii
0 everywhere ✅. Square tiles, square buttons, square inputs.

### 2.5 Elevation system
| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | surface tone | page, tiles |
| 1 | panel | sand ground + slide-in | menu and filter drawer |

Flat by design; the only depth is the drawer sliding over the page. Decorative depth: none (no gradients, no
scrims; the red band is a solid).

### 2.6 Borders
2 px solid `border` on the filter button; 1 px hairlines in the fact table; focus = browser default ⚠️.

### 2.7 Accessibility quick-check
From `dyrenes-a11y.md`: ink on paper 17.65:1 AAA; body brown on paper 10.65:1 AAA; bone on red 9.7:1 AAA; ink on
sand 15.83:1 AAA; white on the bright red button 3.94:1 (large only). Everything passes except the bright CTA at
small sizes.

## 3. Components Inventory

### 3.1 Generic components

#### button-filter
- Variants: 1 ("FILTRER" + sliders icon)
- Sizes: 50 px tall
- Visible states: default; opens a drawer (transform 300 ms)
- Padding/Radius: 15 / 57 / 15 / 23 px (icon space on the right), 0 radius, 2 px outline
- Confidence: ✅

#### button-support
- Variants: 1 (STØT, header)
- Sizes: ~40 px
- Visible states: default, colour 250 ms on hover
- Padding/Radius: ~12×20 px, 0
- Confidence: ⚠️ (red read from pixels)

#### animal-tile
- Variants: 1; square photo, name 24/700, "Internat" left + shelter name right 18/700 brown, arrow link
- Sizes: 3-up at 1024–1440, 1-up at 390
- Visible states: arrow hover
- Padding/Radius: photo full-bleed, 16 px text block, 0
- Confidence: ✅

#### fact-table
- Variants: 1; rows Alder / Køn / Status / Race / Vægt / Kastreret / Mærkning / Journalnummer / Priser
- Sizes: 1
- Visible states: "Se priser" link
- Padding/Radius: 16 px rows, hairline, 0
- Confidence: ✅

#### intro-band
- Variants: 1; red band, h1 bone uppercase, 4 paragraphs, outlined CTA, photo on the right
- Sizes: ~60vh at 1024
- Visible states: static
- Padding/Radius: 48 px, 0
- Confidence: ✅

### 3.2 Signature components
1. **FILTRER + count row** – one outlined button on the left, "218 dyr" on the right, nothing else. The list
   feels like a catalogue with a single door into the filters; the count makes the filter visible before opening it.
2. **Animal page as story + fact table** – headline name, one-line summary in caps ("en sød dame, der er klar til
   nyt hjem"), three short paragraphs, then "Lær Mindy at kende" with a key/value table. Narrative first, data second.
3. **Red band before the list** – expectations ("er du klar til dyr?") placed above the animals, in the brand colour.

## 4. Layout & Composition

### 4.1 Grid & containers
Container 984 px at 1024 (≈ full width minus 20 px gutters); the grid is near full-bleed. 3 columns, ~24 px gutter.
Vertical rhythm 64–96 px. Hierarchy by weight (700 vs 400) and by colour (ink vs brown), sizes stay small (max 32 px).

### 4.2 Composition patterns
Header (STØT left, centred wordmark, burger right) → red split band → filter row → full-bleed 3-up grid →
footer. Animal page: 2-column story/photo → fact table → contact block.

### 4.3 Responsive behavior
| Breakpoint | Behaviour |
|---|---|
| 1440 | 3-up grid, 2-column band |
| 1024 | 3-up grid, 2-column band |
| 390 | 1-up grid, band stacks, filter button full width ✅ probe |

Touch targets: filter button 50 px ✓, STØT ~40 px ✗, tile arrows small ✗.

### 4.4 Image behavior
- Shelter photography, square crops, no filters, varied quality (phone photos). Lazy-loaded.
- Wordmark as inline SVG, stacked two lines, red.
- No illustration, no icons beyond the sliders glyph and the arrow.

## 5. Reconstruction Notes
Stack evidence: Drupal (`path--node`, `page--node-type-special-pages`) + jQuery; Cookiebot. No GSAP, no Lenis,
no ScrollTrigger, no IntersectionObserver (`1440-home.motion.json`: gsap null, scrollTrigger 0, keyframes 13 all
vendor spinners/popups, 19 CSS transitions). The drawer uses `transform 300ms cubic-bezier(0.77,0,0.175,1)`.
Quick wins: the filter row with the count; the tile recipe; the fact table.
Tricky bits: GT Pressura Extended is commercial (swap for an owned wide grotesk); the grid has no pagination
(218 tiles in one page); the bright red CTA fails AA at small sizes; no scroll motion exists to port.
States to define: hover, focus-visible, drawer open, empty filter result, loading tiles.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | computed + extract_colors |
| Typography | ✅ | computed styles |
| Components | ✅ | measured on the live page |
| Layout | ✅ | 1024 computed + 1440/390 probe shots |
| Motion | ✅ | probe: none beyond CSS transitions |

## 6. Do's and Don'ts

### Do
- Keep one outlined `button-filter` and a live count as the entire filter header.
- Keep tiles square and flat: photo, `card-title` 24/700, `card-meta` 18/700 in `{colors.text-body}`.
- Reserve `{colors.primary}` (#741B0D) for a full band where the organisation speaks.
- Set body copy in `{colors.text-body}` (#463930), not black; it is what makes the page warm.
- Put the story above the `fact-table` on every animal page.

### Don't
- Don't use `{colors.primary-bright}` (#E9442E) for text under 24 px (3.94:1).
- Don't add radius; the system is 0 px everywhere.
- Don't copy the motion layer; there is none to copy (jQuery + 300 ms drawer).
- Don't render 200+ tiles without a count-first filter; the count is what makes it bearable.
- Don't add a second colour; sand (#F2EDE7) is the only other tone.

## 7. Open Questions
- The filter drawer's field list was not opened (facets unknown); a click-through would settle it.
- Exact bright-red hex and the STØT button padding: pixel reads.

## 8. Companion files
- `dyrenes-tokens.json` generated by `build_tokens_json.py`.
- `dyrenes-a11y.md` generated by `check_contrast.py`.
- Probe: `scratchpad/dyrenes/probe/probe/{1440,390}-home.{motion,surfaces}.json`, frames in `shots/`.
- Frames used: `refs/dyrenes-1-filter.jpg`, `dyrenes-2-grid.jpg`, `dyrenes-3-detail.jpg`, `dyrenes-4-facts.jpg`.
