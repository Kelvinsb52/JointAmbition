import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../components/layout/Header';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import Hero from '../sections/home/Hero';
import Studio from '../sections/home/Studio';
import Strategy from '../sections/home/Strategy';
import Markets from '../sections/home/Markets';
import Philosophy from '../sections/home/Philosophy';
import Begin from '../sections/home/Begin';
import JAHeroEntrance from '../components/brand/JAMark/JAHeroEntrance';
import { getEntranceDuration, type EntranceState } from '../components/brand/JAMark/entranceTimeline';
import { useMobileNavigation } from '../hooks/useMobileNavigation';
import { useHashNavigationFocus } from '../hooks/useHashNavigationFocus';
import homeStyles from '../styles/home.css?inline';

export default function App() {
  const navigation = useMobileNavigation();
  const loaderDoneRef = useRef(false);
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const loaderDuration = getEntranceDuration('current');
  useHashNavigationFocus();

  const onLoaderUpdate = useCallback((state: EntranceState) => {
    if (loaderDoneRef.current) return;
    if (state.reducedMotion || (!state.playing && state.time >= loaderDuration)) {
      loaderDoneRef.current = true;
      setShowLoader(false);
    }
  }, [loaderDuration]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      loaderDoneRef.current = true;
      setShowLoader(false);
      return;
    }
    const syncPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      loaderDoneRef.current = true;
      setShowLoader(false);
    };
    reducedMotion.addEventListener('change', syncPreference);
    return () => reducedMotion.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    if (!showLoader) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showLoader]);

  return (
    <>
      {/* Keep these rules route-local and after the global styles in the cascade. */}
      <style>{homeStyles}</style>
      {showLoader && (
        <div className="ja-loader-overlay" aria-hidden="true">
          <JAHeroEntrance fillMode="current" onUpdate={onLoaderUpdate} />
        </div>
      )}
      <Header
        navRef={navigation.navRef}
        menuButtonRef={navigation.menuButtonRef}
        isMenuOpen={navigation.isMenuOpen}
        onToggle={navigation.toggleMenu}
      />
      <MobileMenu
        isMenuOpen={navigation.isMenuOpen}
        closeButtonRect={navigation.closeButtonRect}
        menuCloseRef={navigation.menuCloseRef}
        menuOverlayRef={navigation.menuOverlayRef}
        onClose={navigation.closeMenu}
        closeMenuForNavigation={navigation.closeMenuForNavigation}
      />
      <main ref={navigation.mainRef}>
        <Hero />

        <Studio />

        <Strategy />

        <Markets />

        <Philosophy />

        <Begin />
      </main>
      <Footer footerRef={navigation.footerRef} />
    </>
  );
}
