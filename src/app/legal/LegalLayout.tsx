import type { ReactNode } from 'react';
import { Link } from 'react-router';
import FooterHomeLogo from '../../components/layout/FooterHomeLogo';
import legalStyles from '../../styles/legal.css?inline';

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/accessibility', label: 'Accessibility' },
];

export interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  currentPath: string;
  children: ReactNode;
}

export default function LegalLayout({ eyebrow, title, lastUpdated, currentPath, children }: LegalLayoutProps) {
  return (
    <div className="legal-shell">
      <style>{legalStyles}</style>
      <header className="legal-nav">
        <div className="legal-nav-inner">
          <Link className="legal-brand" to="/">
            <img src="/favicon.svg" alt="" aria-hidden="true" />
            <span>Joint Ambition</span>
          </Link>
          <Link className="legal-return-link" to="/">Return to Joint Ambition</Link>
        </div>
      </header>
      <main className="legal-main">
        <div className="legal-header">
          <div className="legal-eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="legal-updated">Last updated: {lastUpdated}</p>
        </div>
        <div className="legal-content">{children}</div>
        <nav className="legal-crosslinks" aria-label="Legal pages">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={link.to === currentPath ? 'is-active' : ''}>
              {link.label}
            </Link>
          ))}
          <Link to="/">Return to Joint Ambition</Link>
        </nav>
      </main>
      <footer className="legal-footer">
        <FooterHomeLogo className="legal-footer-home" />
      </footer>
    </div>
  );
}
