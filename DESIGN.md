# Design System: Dýrahjálp Íslands (outreach prototype, 2026-10-08)

**Design read:** redesign-overhaul of a volunteer animal rescue's site (dyrahjalp.is, custom Django-style app,
Source Sans Pro, grey sidebar) for Icelandic adopters and foster homes, mostly on phones, in a warm, photo-led,
simple language. Structure and the filter system from the Dyrenes Beskyttelse teardown (`_refs/dyrenes.design.md`),
warmth and story cards from Pawthway (`_refs/pawthway.design.md`), motion from the studio engine in
`03-prototypes/snaeland/src/motion.js` (GSAP + ScrollTrigger, Lenis on fine pointers only). ISKRA
(`_refs/iskra.design.md`) contributes one lesson only: spend the boldness once, at the top.
**Dials:** variance 5 · motion 6 · density 4. Light theme, locked.

## 0. Scope (Gate 0)
Their nav, verbatim: Dýr í heimilisleit (Hundar 11 · Kisur 3 · Kanínur 5 · Önnur dýr 9) · Týnd / Fundin dýr ·
Skrá dýr í heimilisleit · Skrá týnt dýr · Skrá fundið dýr · Fréttir · Um Dýrahjálp · Dýravernd · Vefverslun ·
Vilt þú hjálpa? (fósturheimili, sjálfboðaliðar, styrkja, vörur) · Gerast meðlimur.
Their own summary line: "Dýrahjálp Íslands er félag sjálfboðaliða sem leitast við að sjá dýrum sem þarfnast
heimilis fyrir skjóli og stofna til þess dýraathvarf. Frá stofnun félagsins í maí 2008 hefur Dýrahjálp Íslands
aðstoðað alls 8,106 dýr í heimilisleit." Booking stack: none (forms by email; membership form on site).
Not built or contacted before (memory and `_docs` grep, 2026-10-08). Money: 2024 accounts, 22.8M kr income,
55% ministry wage grant, 1.5 paid staff, 70k kr/yr software: price accordingly.
Prototype scope (studio rule): 12 real animals, the main flows, nothing imported wholesale.

## 1. Assets (Gate 1)
- Logo `static/images/logo.svg`: the Iceland map in `#414141` on `#f3f3f1`, Illustrator export, 520.7×358.8. Usable.
- Animal photos: every listing photo is served at **700×700** (`/media/cache/…`, 73–233 KB). Tiles therefore sit at
  ≤350 CSS px (2×) and never larger; no photo can carry a full-bleed hero. The hero is built from the map, not a photo.
- 12 animals harvested with name, age line, town, facts and text (`scratchpad/harvest/animals.json`): 4 hundar,
  3 kisur, 2 kanínur, 3 önnur (fugl, mús, naggrís). Their fact vocabulary, verbatim: Vön/Vanur börnum, kisum,
  hundum, öðrum dýrum · Bólusett(ur) · Geld(ur) · Skráð(ur) · Heilsufar · Fylgir · "á fósturheimili Dýrahjálpar"
  vs "ekki í umsjá Dýrahjálpar, enn hjá eiganda".
- Every animal line carries a postcode and town: "4 ára hundur, 109 Reykjavík", "6 mán. hundur, 640 Húsavík",
  "6 ára hundur, 600 Akureyri", "6 ára kisa, 356 Snæfellsbæ". This is the material the idea comes from.

## 2. The one idea (Gate 2)
**The animals sit on the map.** (Hero line: "Þau bíða eftir heimili.", not a slogan about the map.) Their logo is Iceland. Every animal waiting for a home has a postcode. So the
hero is their own map with the waiting animals placed on it by town, each as a small round photo: Reykjavík
cluster, Akureyri, Húsavík, Snæfellsbær. The headline beside it says what the map shows ("27 dýr bíða eftir
heimili") and the count is live from the data. Pressing a town or a region filters the list below; the map stays
the same object on the list page, folded into the filter row. Said to the owner in one sentence: "Við setjum dýrin
á kortið ykkar." Traceable to a named asset (logo.svg + the postcode on every listing), not a mood.

Everything else is quiet around it: white paper, one grey, one red, one typeface, square photos, no cards.

## 3. Colour roles
- **Paper** `#FBFBFA` page ground. Near-white, not cream (the cream + serif + terracotta cluster is banned).
- **Logo grey** `#F3F3F1` second surface: the map plate, filter drawer, fact table rows. From the logo file.
- **Ink** `#414141` headings, names, the map. From the logo file. 8.9:1 on Paper.
- **Ink-2** `#3C3C3C` body text (their own CSS value). No light-grey body text.
- **Mute** `#6E6E6E` meta at ≥15 px only (5.0:1); their `#797979` fails AA at small sizes and is not used.
- **Rautt** `#CC3333` the single accent, from their own banner (`rgba(204,51,51,.8)` in styles.min.css): the
  primary action, the live count, the selected filter chip, the map dot ring. 5.1:1 on Paper. Nowhere else.
- **Rule** `#D0D0D0` hairlines (their CSS).
Banned: a second accent, gradients, scrims over photos, gold, cream grounds, dark bands.

## 4. Type
**Valley Sans** variable (OFL, `~/Design fonts/Valley Sans/web`, Icelandic cmap verified), one family, real
weights 400/500/600, true italic for emphasis inside a headline (same family, never a serif word).
- Hero: `clamp(40px, 6vw, 84px)`, 600, leading 1.0, tracking −0.02em; ≤ 2 lines at 1440, widest word checked at 375.
- Section: `clamp(28px, 3.6vw, 48px)`, 600, leading 1.08, tracking −0.015em.
- Animal name: 24px 600; age line 17px 500 Ink-2 ("4 ára hundur, 109 Reykjavík", verbatim from their data).
- Body: 18px desktop / 17px phone, 1.55, max 62ch. Meta/chips: 15px 500.
- Masked reveals keep .24em headroom (Icelandic accents clip otherwise).

## 5. Components
- **Map hero**: inline SVG of their logo path, animals as 56–72px round photos on the map by town, Rautt ring on
  hover/selected; headline left, map right at ≥992px, stacked below 768 with the map at full width.
- **Filter row** (Dyrenes recipe): one outlined button "Sía" with the live count on the right; chips from their
  vocabulary (Hundar · Kisur · Kanínur · Önnur dýr · Vön börnum · Vön hundum · Vön kisum · Bólusett · Geld ·
  Á fósturheimili Dýrahjálpar · Höfuðborgarsvæðið · Norðurland · Vesturland). Selected = Rautt fill, white text.
  Results reflow with GSAP Flip; the count animates to the new number. Empty result = "Ekkert dýr passar, hreinsa
  síur" with a real reset control.
- **Animal tile**: square photo (≤350 CSS px), name 24/600, age line, up to three fact chips in Logo grey. Flat,
  no border, no radius, no shadow; hover lifts the photo 2% (transform) and underlines the name.
- **Animal page**: name, the one-line summary from their text, their paragraphs verbatim (Heilsufar, Fylgir, Aðrar
  upplýsingar), then a fact table (Dyrenes) and one action "Sækja um", with the "ekki í umsjá Dýrahjálpar" notice
  shown verbatim where their data says so.
- **Help page**: fósturheimili / sjálfboðaliði / meðlimur (3.800 kr, their figure) / styrkja as four plain
  sections with their copy; one form each, label above, error below.
- **Lost / found**: two forms + a list of recent reports (their "Atlas er týndur" entry as the sample).
- **Shop**: sample tiles for jólakort and póstkort from their own list; marked as sample.
- **Buttons**: squared, Rautt primary (one per screen), outlined Ink secondary, 44px min, 70ms press feedback.
- **Mobile chrome**: the SNDR constant glass bar + animated hamburger, native dialog menu. Not redesigned.
- Radius 0 everywhere except the round animal portraits on the map (the one circle, which is the device).

## 6. Layout
Max 1360px, gutter 48px → 20px on phone. Home: map hero 6/6 → "Dýr í heimilisleit" filter row + 3-up grid (2-up
at 768, 1-up at 390) → "Hvernig get ég hjálpað?" as a 2-column split with their foster-home photo → one story
card (Pawthway: photo of the animal beside the owner's own words from a listing) → news row → footer with kt.,
email and the Facebook link. No 3-equal-cards row, no numbered steps, no eyebrows beyond one.

## 7. Motion (Snæland engine, re-aimed)
- Entrance: header rise (0.28s, stagger 0.05) → hero lines masked `yPercent: 110` (0.72s, stagger 0.08) → map
  plate `yPercent: 12 + opacity` (0.85s) → animals pop onto the map with `scale 0.6 → 1`, stagger 0.04, power3.out.
- Scroll: h2 masked-word reveals at `top 90%` once; copy and tiles `y: 22 / opacity` at `top 92%` once (12px on
  touch); tile photos `yPercent: 12`. All position-tied, all transform/opacity.
- Fine pointers ≥992px: Lenis `lerp 0.1`; hero map `yPercent: 8` and copy `yPercent: −20` scrubbed over 600px.
  No Lenis on touch (iOS toolbar rule). No pinned empty sections.
- Signature interaction: filter → GSAP Flip reflow of the grid (0.5s) + the count tween; map dots ring in Rautt
  when their region is active.
- Reduced motion: plain render, everything visible, Flip replaced by an instant swap. Keyboard: Tab completes the
  entrance; focus never lands on a hidden tile.

## 8. Copy
Their text verbatim (listing lines, facts, the "ekki í umsjá" notice, the summary line, 8,106). Finished Icelandic
only; four checks (gender/adjective agreement per animal: Vön/Vanur follows the animal's gender as their data has
it). No em-dashes, no "scroll" cues, no invented numbers; the only counts are from the data.

## 9. Banned here
Cream ground, serif display, terracotta, gradient scrims, rounded panels, pill buttons, illustration instead of
photos, dark-luxury, a second accent, three equal cards, a pinned empty scroll, Lenis on touch, any photo scaled
above its 700px source.
