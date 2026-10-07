import Header from '../components/layout/Header';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import Hero from '../sections/home/Hero';
import Studio from '../sections/home/Studio';
import Strategy from '../sections/home/Strategy';
import Markets from '../sections/home/Markets';
import Philosophy from '../sections/home/Philosophy';
import Begin from '../sections/home/Begin';
import { useMobileNavigation } from '../hooks/useMobileNavigation';
import { useHashNavigationFocus } from '../hooks/useHashNavigationFocus';
import homeStyles from '../styles/home.css?inline';

export default function App() {
  const navigation = useMobileNavigation();
  useHashNavigationFocus();

  return (
    <>
      {/* Keep these rules route-local and after the global styles in the cascade. */}
      <style>{homeStyles}</style>
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
