
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
[Hero.tsx](src/sections/home/Hero.tsx), not App. No entrance animation was introduced.
The existing [public/favicon.svg](public/favicon.svg) and botanical artwork are unchanged.
The favicon is an SVG container with an embedded PNG, not standalone vector contours;
verify the canonical vector source before implementing a contour-based logo reveal.

## Validation

- `npm run build` builds the production site.
- `npm run typecheck` checks the active application import graph, inquiry API, and Vite
  configuration. Unused Figma/UI scaffolding is intentionally outside this check.
- There is currently no configured lint script or automated test runner.

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