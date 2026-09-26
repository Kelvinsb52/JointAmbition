import type { ReactNode } from 'react';
import { Link } from 'react-router';

// Scoped copy of the Joint Ambition design tokens/typography used in App.tsx, kept local so the
// legal pages don't depend on App's inline <style> tag (which only renders when App itself mounts).
const legalStyles = `
  .legal-shell{
    --ink:#171714;
    --paper:#efe7d8;
    --paper2:#f7f1e6;
    --line:#cfc4b2;
    --muted:#6d685f;
    box-sizing:border-box;
    min-height:100vh;
    background:var(--paper);
    color:var(--ink);
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .legal-shell *{box-sizing:border-box}
  .legal-shell h1,.legal-shell h2,.legal-shell h3{
    font-family:Georgia,"Times New Roman",serif;
    font-weight:400;
    margin:0;
  }
  .legal-shell p{margin:0}
  .legal-shell a{color:inherit}
  .legal-nav{
    position:sticky;top:0;z-index:10;
    background:rgba(239,231,216,.92);
    backdrop-filter:blur(14px);
    border-bottom:1px solid var(--line);
  }
  .legal-nav-inner{
    max-width:1280px;margin:0 auto;padding:18px 28px;
    display:flex;align-items:center;justify-content:space-between;gap:16px;
  }
  .legal-brand{
    display:flex;align-items:center;gap:8px;
    font-family:'Gloock',Georgia,serif;font-size:22px;letter-spacing:.03em;
    white-space:nowrap;
    text-decoration:none;
  }
  .legal-brand img{width:39px;height:39px;object-fit:contain;flex:none}
  .legal-return-link{
    font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:var(--muted);
    white-space:nowrap;
    text-decoration:none;
  }
  .legal-return-link:hover{color:var(--ink)}
  .legal-main{
    max-width:1280px;margin:0 auto;
    padding:clamp(48px,8vw,96px) 28px clamp(64px,10vw,110px);
  }
  .legal-header{
    max-width:720px;
  }
  .legal-eyebrow{
    text-transform:uppercase;
    letter-spacing:.28em;
    font-size:11px;
    color:var(--muted);
  }
  .legal-header h1{
    margin-top:18px;
    font-size:clamp(36px,5vw,58px);
    line-height:1.05;
  }
  .legal-updated{
    margin-top:16px;
    font-size:13px;
    color:var(--muted);
  }
  .legal-content{
    max-width:720px;
    margin-top:48px;
    font-size:17px;
    line-height:1.85;
    color:#4d4841;
  }
  .legal-content h2{
    font-size:28px;
    line-height:1.15;
    color:var(--ink);
    margin-top:44px;
  }
  .legal-content h2:first-child{margin-top:0}
  .legal-content p+h2,.legal-content ul+h2{margin-top:44px}
  .legal-content p{margin-top:18px}
  .legal-content p:first-of-type{margin-top:14px}
  .legal-content ul{margin:18px 0 0;padding-left:20px}
  .legal-content li{margin-top:10px}
  .legal-content li:first-child{margin-top:0}
  .legal-content strong{color:var(--ink);font-weight:600}
  .legal-content a{text-decoration:underline;text-underline-offset:3px}
  .legal-crosslinks{
    margin-top:64px;
    padding-top:28px;
    border-top:1px solid var(--line);
    display:flex;flex-wrap:wrap;gap:20px;
    font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:var(--muted);
  }
  .legal-crosslinks a{text-decoration:none}
  .legal-crosslinks a:hover{color:var(--ink)}
  .legal-crosslinks a.is-active{color:var(--ink)}
  @media (max-width: 640px){
    .legal-nav-inner{padding:16px 20px;flex-wrap:wrap;row-gap:8px}
    .legal-return-link{white-space:normal;text-align:right}
    .legal-main{padding:44px 20px 72px}
  }
`;

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
    </div>
  );
}
