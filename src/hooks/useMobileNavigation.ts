import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// keep in sync with the "@media (max-width: 1080px)" nav-collapse breakpoint in src/styles/home.css
const COMPACT_NAV_QUERY = '(max-width: 1080px)';

// focusable-element selector used to build the mobile-menu's focus-trap group
const MENU_FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // true when the menu is being closed by an anchor click, so the anchor's own hash-scroll wins instead of restoring the pre-open scroll position
  const navigatingRef = useRef(false);
  // measured from #menuButton so .menu-close always sits in the exact same rect, regardless of breakpoint/safe-area
  const [closeButtonRect, setCloseButtonRect] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // the close button renders outside .menu-overlay in the DOM (it escapes .nav's stacking context) but is
  // logically the overlay's first focus stop, so the trap/tab-order group is assembled from both
  const getMenuFocusable = () => {
    const nodes: HTMLElement[] = [];
    if (menuCloseRef.current) nodes.push(menuCloseRef.current);
    if (menuOverlayRef.current) {
      nodes.push(...Array.from(menuOverlayRef.current.querySelectorAll<HTMLElement>(MENU_FOCUSABLE_SELECTOR)));
    }
    return nodes;
  };

  // if the window is resized back into desktop-nav mode while the overlay is open, close it so the overlay/lock/close-button never get stranded behind hidden mobile-only controls
  useEffect(() => {
    const mql = window.matchMedia(COMPACT_NAV_QUERY);
    const handleChange = (e: MediaQueryListEvent) => {
      if (!e.matches) setIsMenuOpen(false);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(() => {
    if (!isMenuOpen) return;

    const syncCloseButtonPosition = () => {
      const rect = document.getElementById('menuButton')?.getBoundingClientRect();
      if (rect) setCloseButtonRect({ top: rect.top, left: rect.left });
    };

    syncCloseButtonPosition();
    window.addEventListener('resize', syncCloseButtonPosition);
    return () => window.removeEventListener('resize', syncCloseButtonPosition);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const priorStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = priorStyle.position;
      body.style.top = priorStyle.top;
      body.style.left = priorStyle.left;
      body.style.right = priorStyle.right;
      body.style.width = priorStyle.width;
      body.style.overflow = priorStyle.overflow;

      // if a section link caused this close, don't restore scroll (the anchor's own scroll wins) and
      // don't pull focus back to the trigger either — useHashNavigationFocus owns section focus
      const wasNavigating = navigatingRef.current;
      if (!wasNavigating) {
        window.scrollTo(0, scrollY);
      }
      navigatingRef.current = false;

      if (!wasNavigating) {
        // return focus to the trigger on every non-navigation close path; the closing button is about to
        // become unreachable (opacity/pointer-events hidden, or unmounted), so focus can't be left on it
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };
  }, [isMenuOpen]);

  // moves focus into the overlay once it opens; the close button is the natural first stop since it
  // renders at the same position the trigger was just activated from
  useEffect(() => {
    if (!isMenuOpen) return;
    menuCloseRef.current?.focus();
  }, [isMenuOpen]);

  // React 18 doesn't support 'inert' as a JSX attribute, so it's set imperatively here; removes the
  // background (nav/main/footer) from tab order, click handling, and the accessibility tree while the
  // overlay is open, since the overlay/close-button live outside these containers and stay unaffected.
  // Uses useLayoutEffect (not useEffect) so inert is always cleared before the scroll-lock effect's
  // cleanup tries to focus the trigger — focusing an element inside an inert subtree silently fails.
  useLayoutEffect(() => {
    const targets = [navRef.current, mainRef.current, footerRef.current];
    for (const el of targets) {
      if (el) el.inert = isMenuOpen;
    }
    return () => {
      for (const el of targets) {
        if (el) el.inert = false;
      }
    };
  }, [isMenuOpen]);

  // Escape-to-close and a Tab/Shift+Tab focus trap scoped to the close button + overlay nav links
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getMenuFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !focusable.includes(active as HTMLElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !focusable.includes(active as HTMLElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenuForNavigation = () => {
    navigatingRef.current = true;
    setIsMenuOpen(false);
  };

  return {
    isMenuOpen, closeButtonRect,
    menuButtonRef, menuCloseRef, menuOverlayRef, navRef, mainRef, footerRef,
    toggleMenu: () => setIsMenuOpen((value) => !value),
    closeMenu: () => setIsMenuOpen(false),
    closeMenuForNavigation,
  };
}
