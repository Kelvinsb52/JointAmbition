import type { Ref } from 'react';

interface HeaderProps {
  navRef: Ref<HTMLElement>;
  menuButtonRef: Ref<HTMLButtonElement>;
  isMenuOpen: boolean;
  onToggle: () => void;
}

export default function Header({ navRef, menuButtonRef, isMenuOpen, onToggle }: HeaderProps) {
  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-inner">
        <a className="brand" href="#home">
          <img src="/favicon.svg" alt="" aria-hidden="true" />
          <span>Joint Ambition</span>
        </a>
        <div className="nav-links">
          <a href="#studio">Studio</a>
          <a href="#strategy">Strategy</a>
          <a href="#markets">Markets</a>
          <a href="#philosophy">Philosophy</a>
        </div>
        <button
          type="button"
          ref={menuButtonRef}
          className={`menu-button ${isMenuOpen ? 'open' : ''}`}
          id="menuButton"
          aria-label="Open navigation"
          aria-expanded={isMenuOpen}
          aria-controls="mobileMenuOverlay"
          aria-hidden={isMenuOpen}
          tabIndex={isMenuOpen ? -1 : 0}
          onClick={onToggle}
        >
          <span />
        </button>
        <a className="pill" href="#begin">Begin</a>
      </div>
    </nav>
  );
}
