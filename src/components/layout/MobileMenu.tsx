import type { Ref } from 'react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  closeButtonRect: { top: number; left: number };
  menuCloseRef: Ref<HTMLButtonElement>;
  menuOverlayRef: Ref<HTMLDivElement>;
  onClose: () => void;
  closeMenuForNavigation: () => void;
}

export default function MobileMenu({
  isMenuOpen, closeButtonRect, menuCloseRef, menuOverlayRef, onClose, closeMenuForNavigation,
}: MobileMenuProps) {
  return (
    <>
      {isMenuOpen && (
        <button
          type="button"
          ref={menuCloseRef}
          className="menu-close"
          aria-label="Close navigation"
          style={{ top: closeButtonRect.top, left: closeButtonRect.left }}
          onClick={onClose}
        />
      )}

      <div
        id="mobileMenuOverlay"
        ref={menuOverlayRef}
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal={isMenuOpen ? 'true' : undefined}
        aria-label="Main menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="menu-overlay-inner">
          <nav className="menu-nav" aria-label="Section navigation">
            <a href="#home" onClick={closeMenuForNavigation}>Home</a>
            <a href="#studio" onClick={closeMenuForNavigation}>Studio</a>
            <a href="#strategy" onClick={closeMenuForNavigation}>Strategy</a>
            <a href="#markets" onClick={closeMenuForNavigation}>Markets</a>
            <a href="#philosophy" onClick={closeMenuForNavigation}>Philosophy</a>
            <a href="#begin" onClick={closeMenuForNavigation}>Begin</a>
          </nav>
          <div className="menu-meta">
            <div className="eyebrow">Joint Ambition</div>
            <p>
              Navigate directly to the part of the studio experience most relevant to you — from our thinking and capabilities to markets, philosophy, and project inquiry.
            </p>
            <div className="mini-links">
              <span>Precision is a decision.</span>
              <span>Where vision parallels reality.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
