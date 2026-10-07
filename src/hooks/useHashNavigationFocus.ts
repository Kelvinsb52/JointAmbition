import { useEffect } from 'react';

export function useHashNavigationFocus() {
  // after any same-page anchor navigation (desktop nav, mobile menu, hero/CTA links, etc.) moves
  // keyboard/AT focus to the destination section instead of the browser's fallback of document.body,
  // since none of the sections were otherwise focusable; preventScroll avoids fighting the scroll that
  // already happened as part of the native anchor navigation
  useEffect(() => {
    const handleHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      document.getElementById(id)?.focus({ preventScroll: true });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
}
