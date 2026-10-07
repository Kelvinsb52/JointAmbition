import type { Ref } from 'react';
import { Link } from 'react-router';
import { HummingbirdVector } from '../Hummingbird/Hummingbird';
import FooterHomeLogo from './FooterHomeLogo';

export default function Footer({ footerRef }: { footerRef: Ref<HTMLElement> }) {
  return (
    <footer ref={footerRef}>
      <div className="wrap footer-inner">
        <div className="footer-left">
          <div className="footer-copyright">&copy; 2026 Joint Ambition LLC</div>
          <nav className="footer-legal" aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/accessibility">Accessibility</Link>
          </nav>
        </div>
        <FooterHomeLogo className="footer-center-logo" />
        <div className="footer-signature">
          <span className="footer-emblem" aria-hidden="true"><HummingbirdVector className="footer-emblem-vector" /></span>
          <span className="footer-divider" aria-hidden="true" />
          <div className="footer-tagline">Where vision parallels <span className="footer-tagline-ending">reality.<sup className="tm-mark">™</sup></span></div>
        </div>
      </div>
    </footer>
  );
}
