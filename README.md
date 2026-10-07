
  # Landing page for graphic designer

  This is a code bundle for Landing page for graphic designer. The original project is available at https://www.figma.com/design/QgAxTKuVyy1TMOne6jFtn2/Landing-page-for-graphic-designer.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Active site architecture

- [src/app/App.tsx](src/app/App.tsx) composes the home route without adding layout wrappers.
- [src/components/layout](src/components/layout) contains the active header, mobile menu,
  footer, and home-logo link shared with legal pages.
- [src/sections/home](src/sections/home) contains Hero, Studio, Strategy, Markets,
  Philosophy, and Begin. Begin composes the dedicated InquiryForm.
- [src/hooks/useMobileNavigation.ts](src/hooks/useMobileNavigation.ts) owns menu state,
  trigger/close positioning, the compact-navigation media query, scroll locking,
  focus entry/restoration/trapping, Escape handling, and background inert state.
- [src/hooks/useHashNavigationFocus.ts](src/hooks/useHashNavigationFocus.ts) owns
  focus transfer after native same-page hash navigation.
- [src/hooks/useInquiryForm.ts](src/hooks/useInquiryForm.ts) owns native-constraint
  validation messages, first-invalid-field focus, error clearing, submission, and
  sending/success/error state. The API contract remains in [api/inquiry.ts](api/inquiry.ts).
- [src/app/legal](src/app/legal) retains the separate legal-route layout and content.
- [src/components/Hummingbird](src/components/Hummingbird) remains isolated, including
  its SVG, interaction-driven motion, cleanup, and reduced-motion handling.

The older Figma sections and UI scaffolding in [src/app/components](src/app/components)
are not used by the active routes. They have deliberately not been removed or substituted
for the current site.

## Styles and preservation constraints

JA home styles live in [src/styles/home.css](src/styles/home.css), grouped with section
comments while retaining the original selector, declaration, and media-query order.
Legal styles live in [src/styles/legal.css](src/styles/legal.css).
Both use Vite's `?inline` CSS import and a route-local style element: CSS is maintained
outside React, but still mounts/unmounts with its route at the original cascade position.
Do not replace these with global side-effect imports without testing legal-route leakage,
root variables (especially `--muted`), and cascade order.

[src/styles/index.css](src/styles/index.css), fonts, Tailwind, and generic theme scaffolding
remain separate. Small existing element-specific inline styles are preserved.
The 1080px menu query in the navigation hook must stay in sync with the home stylesheet.
The close button and overlay must remain outside the inert header/main/footer.
Keep inert cleanup in a layout effect so it precedes focus restoration from the
scroll-lock effect. Navigation closes deliberately bypass trigger/scroll restoration.

Future entrance orchestration belongs within or beneath
[Hero.tsx](src/sections/home/Hero.tsx), not App. The Phase 1 study described below is
isolated from the existing hero and is not shipped in the production site.
The existing [public/favicon.svg](public/favicon.svg) and botanical artwork are unchanged.
The favicon is an SVG container with an embedded PNG, not standalone vector contours.
The canonical vector source for the entrance study is now
[joint-ambition-mark.master.svg](src/assets/brand/joint-ambition-mark.master.svg).

## Validation

- `npm run build` builds the production site.
- `npm run typecheck` checks the active application import graph, inquiry API, and Vite
  configuration. Unused Figma/UI scaffolding is intentionally outside this check.
- `npm run verify:ja-mark` runs the canonical-artwork integrity check using Node's test runner.
- There is currently no configured lint script.

## Phase 1: isolated JA entrance study

Run `npm run dev` and visit **`/dev/ja-entrance`** on the URL printed by Vite.
This route is development-only and lazy-loaded; it is not available through `vite preview`
or included in the production build. The home route and its hero remain unchanged.

The [JAMark area](src/components/brand/JAMark) contains:

- [JAHeroEntrance.tsx](src/components/brand/JAMark/JAHeroEntrance.tsx): decorative,
  self-contained composition. Its optional ref exposes `play`, `pause`, `replay`, and
  `seek(milliseconds)`; `onUpdate` reports time/playback/reduced-motion state.
- [canonicalArtwork.ts](src/components/brand/JAMark/canonicalArtwork.ts): imports the
  master as raw SVG, namespaces IDs per instance, and verifies the rendered group order,
  path strings, transforms, fills, fill rules, and viewBox against the source.
- [entranceTimeline.ts](src/components/brand/JAMark/entranceTimeline.ts): shared playback
  clock, chasing guide windows, exact-path contour masks, perimeter saturation, and
  canonical J/A engraving. Native Web Animations drives guide/contour/engraving masks
  and unified saturation thickness. No new dependency is needed.
- [constructionGeometry.ts](src/components/brand/JAMark/constructionGeometry.ts): derives
  contact coordinates, contour distances, and the final saturation stroke width
  from the two master polygons. Never builds replacement logo geometry.
- [JAHeroEntrancePreview.tsx](src/components/brand/JAMark/JAHeroEntrancePreview.tsx):
  replay/pause, a keyboard-accessible scrubber, completed-state control, timing guide,
  and same-position canonical-source overlay.
- [ja-entrance.css](src/components/brand/JAMark/ja-entrance.css): scoped presentation
  and preview styles; JA red `#BF0000`, cream `var(--paper, #EFE7D8)`.
- [canonical.test.mjs](src/components/brand/JAMark/canonical.test.mjs): byte-for-byte
  SHA-256 guard, contact/contour coverage checks, and monotonic unified saturation-width checks.
  Run with Node 22.18+ (native TypeScript stripping for the geometry helper).
  Do not change the checksum to accommodate animation implementation changes.

The source remains untouched, including `viewBox="0 0 1080 1080"`, all eight paths,
`fill-rule="evenodd"`, and `j2`'s `translate(-69.633089,511.03606)`.
Black outer forms and white interior shapes receive red/cream CSS presentation overrides
only. The source-color comparison restores black/white externally and overlays the
original asset at 50% opacity; mismatched geometry would produce doubled edges.

### Stroke -> architecture -> saturation -> engraving

Both incoming lines remain horizontal at source-space `y=540`. The left line runs
from `(-330, 540)` to `(246.69278996865205, 540)`, the exact intersection with the slightly
sloped segment `(247, 344) -> (246, 982)`. The right line runs from `(1410, 540)` to
`(834, 540)`, on the vertical outer segment `(834, 982) -> (834, 345)`.
They never meet or cross the central gap.

The guide mask first exposes the leading end toward contact, then continues moving in
the same direction so its trailing edge consumes the horizontal stroke. It remains
attached after retraction: the guides have constant opacity `1` and disappear only
because their visible length becomes zero. The consumed window has zero area to prevent
an antialiased remnant at the fractional left contact. Retraction starts exactly when the leading
motion splits around the contour; there is no fade or pause between these events.

At each contact, two dash windows propagate in opposite directions around **copies of
the unchanged canonical outer path data**. Each initially follows its portion of the
outer rail, turns around the original corners, and continues to the opposite inner
edge at `y=540`. There is no separate rail-to-contour trigger or pause. The dash windows
live in masks; the visible fine strokes are also clipped to the exact source silhouette.
Their 2px strokes are clipped inward, leaving approximately 1px visible. They disappear
once their own solid fill is complete, with no residual outline in the resting mark.

Each parallelogram now has **one unified saturation path**: an exact copy of its closed
canonical perimeter, with no fill and a white miter-joined stroke in its mask.
Only the stroke width increases, from zero to the source shape's width plus 4 units.
The canonical red silhouette clips it, so saturation moves equally inward from the
whole perimeter and the cream core contracts as a single shape. There are no individual
edge strips, arrival fields, or intersecting independently animated fill regions.
The former multi-front architecture was removed, not patched.

Saturation starts 160ms before each contour finishes, after most of the perimeter has
been established. Both saturation windows last 760ms. This preserves a construction/fill
overlap without exposing the instability of per-edge timing. Both red forms are solid
80ms before the first J cut. No radius scaling, shape opacity fade, noise, feathering,
fibers, or fluid simulation is used.

J construction is genuinely subtractive. Exact copies of its four groups, including
the translated hook, paint black into the left red form's luminance mask. All four
share one continuous, source-space engraving sweep: upper entry, descent, lower hook,
and upward return. A widening dash along a curved trajectory reveals the cuts without
individual group clocks, clipping rectangles, or easing restarts. The trajectory is
only a mask envelope, never replacement letter geometry. Its broad stroke is invisible;
only its intersection with the exact canonical negative space can open the red form.

A restrained, 1 CSS-pixel cream head follows the same distance and easing at the active
frontier. Only its trailing 12 source units are visible, clipped to the exact outer
silhouette. It finishes inside the completed cut rather than fading independently.
The A uses a shorter top-down oblique sweep across both canonical A groups together,
not a second path-by-path assembly. Its gesture begins during the final 60ms of the J.
Both letters temporarily hide their original cream groups while cutting transparent
openings into red. Each letter restores its untouched source groups together and
detaches its outer subtraction mask when complete (4040ms for J, 4480ms for A).

All reveal masks remain outside the canonical SVG. Only reveal mechanisms change;
the artwork never translates, scales, morphs, or changes path data. Completed artwork
masks detach to avoid residual clipping. The empty guide windows stay attached.

### Timeline (milliseconds from replay)

| Element / stage | Start | End | Reveal direction |
| --- | ---: | ---: | --- |
| Cream-only field | 0 | 240 | Static |
| Left guide line | 240 | 1320 | Into left outer rail |
| Right guide line | 310 | 1410 | Into right outer rail |
| Left vertical split / continuous contour | 1320 | 2340 | Both directions from contact |
| Right vertical split / continuous contour | 1410 | 2460 | Both directions from contact |
| Left horizontal-tail retraction | 1320 | 2040 | Outer tail chases into contact |
| Right horizontal-tail retraction | 1410 | 2160 | Outer tail chases into contact |
| Left perimeter saturation | 2180 | 2940 | One widening canonical perimeter stroke |
| Right perimeter saturation | 2300 | 3060 | One widening canonical perimeter stroke |
| Continuous J engraving | 3140 | 4040 | Upper entry, descent, hook, upward return |
| Concise A engraving | 3980 | 4480 | One top-down oblique sweep across both cuts |
| Completed, unmasked hold | 4480 | 4600 | Static |

Left/right drawing easings are respectively `cubic-bezier(.55,.02,.85,.65)` and
`cubic-bezier(.50,0,.82,.68)`. Unlike the first study, they carry speed into contact
instead of easing to a stop there. The 70ms start / 90ms contact offsets maintain
restrained asymmetry. Retraction uses `cubic-bezier(.32,0,.58,1)`.
Contours use `cubic-bezier(.22,.30,.48,1)`; engraving masks and their heads share
`cubic-bezier(.35,.25,.65,.85)` over each entire gesture, with no internal stops.
Saturation uses `cubic-bezier(.35,0,.65,1)` to vary only
the scalar thickness, not the geometry of its advancing boundary.
There is no guide-line opacity animation.

This experimental interior lasts 1340ms instead of 4280ms: 900ms for J and 500ms for A,
with 60ms overlap. The total study is 4600ms, including a 120ms completed hold.
Incoming lines, contacts, chase-back, contour construction, and saturation retain
their existing timings and behavior. This is an interior concept study, not final
production pacing.

The enclosing composition uses `viewBox="-360 0 1800 1080"` with uniform
`xMidYMid meet` scaling. The nested master retains its original square viewBox.
Lines stay one CSS pixel wide via non-scaling strokes. No breakpoint deforms the logo.

With reduced motion, the completed unmasked mark appears immediately, guides are hidden,
and replay/scrubbing are disabled. Switching the preference on mid-sequence settles
immediately; switching it off does not restart motion without a replay. The SVG is
decorative and hidden from assistive technology. Controls and descriptive content are
never gated behind playback, and the timeline readout does not announce every frame.

Validation for this experimental pass is deliberately lightweight: immutable master
checksum, completed-state fidelity against the recolored source, silhouette containment,
reduced motion, build, and typecheck. Confirm the sweeps cover their canonical cuts
before mask removal; do not run exhaustive intermediate-frame or responsive visual QA
until the engraving concept is approved.
No paper texture, grain, absorption, feathering, hero-copy choreography, page transitions,
or scroll-linked animation is part of this prototype.

Before entrance-animation work, regression-test:

- Desktop/tablet/mobile layouts and both sides of the 500, 640, 767, 819/820, 960,
  1080, and 1200px responsive thresholds, including botanical sizing and footer alignment.
- Menu opening while scrolled, trigger/close alignment, Tab/Shift+Tab wrapping, Escape
  and close-button restoration, background inert state, and resizing into desktop mode.
- Native section anchors from desktop navigation, the menu, hero, and market links,
  including repeated clicks on the current hash and browser back/forward.
- Required fields, invalid email, first-invalid focus, inline ARIA descriptions,
  correction clearing, sending/disabled state, success reset, and failed-request retention.
  Mock `/api/inquiry` in local browser checks; Vite does not run the Vercel email endpoint.
- Direct legal-page visits, home/legal round trips, and footer home-logo navigation.
- Hummingbird hover/tap motion and reduced-motion changes, including route unmount/remount.
- Real iOS/Safari scroll locking and safe areas, keyboard-only use, and screen-reader
  announcements. Desktop browser emulation does not replace these checks.