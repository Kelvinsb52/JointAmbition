import { useEffect, useState } from 'react';
import hummingbirdMark from '../assets/animations/JointAmbitionHummingbird1palegold.svg';

const styles = `
  :root{
    --ink:#171714;
    --paper:#efe7d8;
    --paper2:#f7f1e6;
    --line:#cfc4b2;
    --muted:#6d685f;
    --soft:#d9cfbf;
    --white:#f8f4ec;
  }
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{
    margin:0;
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:var(--paper);
    color:var(--ink);
  }
  h1,h2,h3,h4{
    font-family:Georgia,"Times New Roman",serif;
    font-weight:400;
    margin:0;
  }
  p{margin:0}
  a{text-decoration:none;color:inherit}
  .wrap{max-width:1280px;margin:0 auto;padding:0 28px}
  .eyebrow{
    text-transform:uppercase;
    letter-spacing:.28em;
    font-size:11px;
    color:var(--muted);
  }
  .nav{
    position:sticky;top:0;z-index:50;
    background:rgba(239,231,216,.92);
    backdrop-filter:blur(14px);
    border-bottom:1px solid var(--line);
  }
  .nav-inner{
    max-width:1280px;margin:auto;padding:18px 28px;
    display:flex;align-items:center;justify-content:space-between;gap:22px;
  }
  .brand{
    position:absolute;left:50%;transform:translateX(-50%);
    display:flex;align-items:center;gap:8px;
    font-family:'Gloock',Georgia,serif;font-size:22px;letter-spacing:.03em;
    white-space:nowrap;
  }
  .brand img{width:39px;height:39px;object-fit:contain;flex:none}
  .nav-links{display:flex;gap:28px;font-size:11px;text-transform:uppercase;letter-spacing:.22em;color:var(--muted)}
  .nav-links a:hover{color:var(--ink)}
  .pill{
    border:1px solid var(--ink);
    border-radius:999px;padding:11px 18px;
    font-size:11px;text-transform:uppercase;letter-spacing:.18em;
    transition:.2s ease;
  }
  .pill.dark{background:var(--ink);color:var(--paper)}
  .pill:hover{transform:translateY(-1px)}
  .hero{
    min-height:88vh;
    display:grid;
    grid-template-columns:1.05fr .95fr;
    border-bottom:1px solid var(--line);
  }
  .hero-copy{
    display:flex;flex-direction:column;justify-content:center;
    padding:96px 9vw 96px 6vw;
  }
  .hero h1{
    font-size:clamp(56px,7vw,110px);
    line-height:.96;
    margin-top:24px;
    max-width:760px;
  }
  .hero .lead{
    max-width:620px;margin-top:28px;
    font-size:18px;line-height:1.8;color:#4f4a43;
  }
  .hero-actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}
  .hero-visual{
    position:relative;display:flex;align-items:center;justify-content:center;
    border-left:1px solid var(--line);
    overflow:hidden;
  }
  .hero-visual:before{
    content:"";
    position:absolute;inset:10%;
    border:1px solid var(--line);
    border-radius:38px;
  }
  .visual-card{
    position:relative;z-index:2;
    width:min(460px,78%);
    min-height:520px;
    border-radius:34px;
    background:var(--ink);
    color:var(--paper);
    padding:38px;
    display:flex;flex-direction:column;justify-content:flex-end;
    box-shadow:0 30px 70px rgba(0,0,0,.16);
  }
  .hummingbird-mark{
    position:absolute;top:44px;left:38px;
    width:170px;height:170px;
    border:1px solid rgba(255,255,255,.35);
    border-radius:50%;
    display:grid;place-items:center;
  }
  .hummingbird-mark img{
    width:100%;
    height:100%;
    object-fit:contain;
    transform:scale(1.25);
    transform-origin:center;
  }
  .bird{
    width:110px;height:110px;position:relative;transform:rotate(-8deg);
  }
  .bird .body{
    position:absolute;left:45px;top:40px;width:20px;height:52px;
    background:linear-gradient(180deg,#f4efe7,#b9afa1);
    border-radius:60% 60% 70% 70%;
  }
  .bird .wing1,.bird .wing2{
    position:absolute;top:26px;width:55px;height:22px;border:1px solid #f4efe7;border-radius:100%;
  }
  .bird .wing1{left:2px;transform:rotate(-28deg)}
  .bird .wing2{right:2px;transform:rotate(28deg)}
  .bird .beak{
    position:absolute;left:60px;top:32px;width:52px;height:1px;background:#f4efe7;transform:rotate(-12deg);transform-origin:left center
  }
  .visual-card h3{font-size:44px;line-height:1.05;margin-top:16px}
  .visual-card p{margin-top:16px;color:#c8c1b7;line-height:1.7;font-size:14px}
  .section{padding:110px 0}
  .section.alt{background:var(--paper2)}
  .section.dark{background:var(--ink);color:var(--paper)}
  .split{
    display:grid;grid-template-columns:.85fr 1.15fr;gap:80px;align-items:start;
  }
  .section h2{font-size:clamp(48px,5vw,78px);line-height:1.02}
  .section h3{font-size:34px;line-height:1.08}
  .body-copy{font-size:17px;line-height:1.9;color:#4d4841}
  .body-copy p+p{margin-top:22px}
  .dark .body-copy{color:#c8c1b7}
  .quote{
    margin-top:34px;padding:28px;border:1px solid var(--line);border-radius:24px;background:var(--paper);
  }
  .quote strong{display:block;font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.1}
  .quote p{margin-top:14px;font-size:14px;line-height:1.8;color:#5d574f}
  .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:48px}
  .card{
    border:1px solid var(--line);border-radius:24px;background:var(--paper2);
    padding:26px;min-height:240px;display:flex;flex-direction:column;
  }
  .card .num{font-size:11px;letter-spacing:.2em;color:var(--muted);text-transform:uppercase}
  .card h3{margin-top:26px;font-size:30px}
  .card p{margin-top:16px;font-size:14px;line-height:1.8;color:#5b554d}
  .process{
    margin-top:64px;padding:34px;border-radius:30px;background:var(--ink);color:var(--paper);
  }
  .process-head{display:flex;justify-content:space-between;gap:30px;align-items:end}
  .process-head p{max-width:520px;color:#c8c1b7;line-height:1.8;font-size:14px}
  .process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}
  .process-item{border:1px solid #403e38;border-radius:20px;padding:22px;background:#1f1f1c}
  .process-item .num{color:#858077;font-size:11px;letter-spacing:.22em}
  .process-item h4{font-size:28px;margin-top:16px}
  .process-item p{margin-top:12px;color:#c8c1b7;line-height:1.7;font-size:13px}
  .markets-head{display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;align-items:end}
  .market-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
  .market-card{
    min-height:420px;border:1px solid var(--line);border-radius:30px;background:var(--paper);
    padding:28px;display:flex;flex-direction:column;justify-content:space-between;transition:.2s ease;
  }
  .market-card:hover{transform:translateY(-4px);box-shadow:0 18px 36px rgba(0,0,0,.08)}
  .market-top{display:flex;justify-content:space-between;gap:12px}
  .market-status{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  .market-card h3{font-size:56px;margin-top:40px}
  .market-theme{margin-top:12px;font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:var(--muted)}
  .market-card p{margin-top:22px;line-height:1.8;font-size:14px;color:#5b554d}
  .market-link{font-size:11px;text-transform:uppercase;letter-spacing:.2em}
  .unmapped{margin-top:26px;padding:32px;border:1px solid var(--line);border-radius:30px;background:var(--paper)}
  .tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
  .tag{border:1px solid var(--line);border-radius:999px;padding:8px 13px;font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}
  .philosophy-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:52px}
  .philosophy-card{border:1px solid #413f39;border-radius:28px;padding:30px;background:#20201d}
  .philosophy-card .num{color:#7f7a72;font-size:10px;letter-spacing:.22em}
  .philosophy-card h3{font-size:40px;margin-top:18px}
  .philosophy-card p{margin-top:18px;color:#c8c1b7;line-height:1.8;font-size:14px}
  .industry-row{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
  .industry{border:1px solid #4d4a43;border-radius:999px;padding:8px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#aaa39a}
  .hummingbird-section{
    margin-top:20px;padding:34px;border-radius:28px;background:var(--paper);color:var(--ink);
    display:grid;grid-template-columns:.75fr 1.25fr;gap:48px;align-items:center;
  }
  .hummingbird-section p{color:#5d574f;line-height:1.85;font-size:14px}
  .cta{
    padding:100px 0;
    background:var(--paper2);
  }
  .cta-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}
  form{border:1px solid var(--line);border-radius:30px;background:var(--paper);padding:30px}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  label{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:var(--muted)}
  input,textarea{
    width:100%;margin-top:8px;border:1px solid var(--line);border-radius:14px;
    background:var(--paper2);padding:14px;font:inherit;color:var(--ink);outline:none;
  }
  textarea{min-height:130px;resize:vertical}
  .full{grid-column:1/-1}
  .submit{
    margin-top:18px;width:100%;border:none;border-radius:999px;background:var(--ink);color:var(--paper);
    padding:15px 20px;text-transform:uppercase;letter-spacing:.2em;font-size:11px;cursor:pointer;
  }
  .form-status{margin-top:14px;font-size:13px;line-height:1.6;color:#5d574f}
  footer{
    border-top:1px solid var(--line);padding:34px 0 46px;color:var(--muted);font-size:12px;
  }
  .footer-inner{display:flex;justify-content:space-between;gap:24px}
  @media (max-width: 960px){
    .nav-links{display:none}
    .hero,.split,.markets-head,.cta-grid{grid-template-columns:1fr}
    .hero-visual{border-left:none;border-top:1px solid var(--line);min-height:650px}
    .grid4,.process-grid{grid-template-columns:repeat(2,1fr)}
    .market-grid{grid-template-columns:1fr}
    .philosophy-grid{grid-template-columns:1fr}
    .hummingbird-section{grid-template-columns:1fr}
  }
  @media (max-width: 640px){
    .wrap{padding:0 20px}
    .nav-inner{padding:16px 20px}
    .hero-copy{padding:76px 24px}
    .grid4,.process-grid,.form-grid{grid-template-columns:1fr}
    .hero h1{font-size:58px}
    .section{padding:80px 0}
    .split{gap:38px}
    .process-head{display:block}
    .process-head p{margin-top:16px}
    .footer-inner{display:block}
    .footer-inner div+div{margin-top:10px}
  }

  .menu-button{
    display:none;
    width:44px;height:44px;
    border:1px solid var(--ink);
    border-radius:50%;
    background:transparent;
    align-items:center;justify-content:center;
    cursor:pointer;
    position:relative;
    z-index:101;
  }
  .menu-button span,
  .menu-button:before,
  .menu-button:after{
    content:"";
    position:absolute;
    width:18px;height:1px;
    background:var(--ink);
    transition:.28s ease;
  }
  .menu-button span{transform:translateY(0)}
  .menu-button:before{transform:translateY(-5px)}
  .menu-button:after{transform:translateY(5px)}
  .menu-button.open span{opacity:0}
  .menu-button.open:before{transform:rotate(45deg)}
  .menu-button.open:after{transform:rotate(-45deg)}

  .menu-overlay{
    position:fixed;
    inset:0;
    background:rgba(23,23,20,.98);
    color:var(--paper);
    z-index:100;
    opacity:0;
    pointer-events:none;
    transition:opacity .28s ease;
  }
  .menu-overlay.open{
    opacity:1;
    pointer-events:auto;
  }
  .menu-overlay-inner{
    min-height:100%;
    max-width:1280px;
    margin:0 auto;
    padding:110px 28px 40px;
    display:grid;
    grid-template-columns:1fr .7fr;
    gap:70px;
    align-items:center;
  }
  .menu-nav{
    display:flex;
    flex-direction:column;
    gap:10px;
  }
  .menu-nav a{
    font-family:Georgia,"Times New Roman",serif;
    font-size:clamp(42px,7vw,92px);
    line-height:1;
    padding:8px 0;
    transition:.2s ease;
  }
  .menu-nav a:hover{
    transform:translateX(10px);
    opacity:.72;
  }
  .menu-meta{
    border-left:1px solid #4a4741;
    padding-left:34px;
  }
  .menu-meta .eyebrow{color:#8f8a82}
  .menu-meta p{
    margin-top:18px;
    color:#c8c1b7;
    line-height:1.8;
    max-width:360px;
    font-size:14px;
  }
  .menu-meta .mini-links{
    display:flex;
    flex-direction:column;
    gap:12px;
    margin-top:28px;
    font-size:11px;
    text-transform:uppercase;
    letter-spacing:.2em;
    color:#a9a39a;
  }

  @media (max-width: 960px){
    .menu-button{display:flex}
    .nav .pill{display:none}
    .menu-overlay-inner{
      grid-template-columns:1fr;
      align-items:start;
      padding-top:100px;
    }
    .menu-meta{
      border-left:none;
      border-top:1px solid #4a4741;
      padding-left:0;
      padding-top:24px;
    }
  }
`;

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <style>{styles}</style>

      <nav className="nav">
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
          <a className="pill" href="#begin">Begin</a>
          <button
            type="button"
            className={`menu-button ${isMenuOpen ? 'open' : ''}`}
            id="menuButton"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
      </nav>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <div className="menu-overlay-inner">
          <nav className="menu-nav" aria-label="Section navigation">
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#studio" onClick={() => setIsMenuOpen(false)}>Studio</a>
            <a href="#strategy" onClick={() => setIsMenuOpen(false)}>Strategy</a>
            <a href="#markets" onClick={() => setIsMenuOpen(false)}>Markets</a>
            <a href="#philosophy" onClick={() => setIsMenuOpen(false)}>Philosophy</a>
            <a href="#begin" onClick={() => setIsMenuOpen(false)}>Begin</a>
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

      <section id="home" className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Brand Strategy & Identity Studio</div>
          <h1>Where vision parallels reality.</h1>
          <p className="lead">
            Joint Ambition aligns what a business is with how it is perceived through strategy, identity systems, handcrafted brand applications, and custom web development.
          </p>
          <div className="hero-actions">
            <a className="pill dark" href="#strategy">Explore Strategy</a>
            <a className="pill" href="#begin">Begin With Intention</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="hummingbird-mark">
                <img src={hummingbirdMark} alt="Joint Ambition hummingbird mark" />
            </div>
            <div className="eyebrow" style={{ color: '#bdb6ad' }}>Signature Motif</div>
            <h3>Precision in motion.</h3>
            <p>
              The hummingbird represents controlled energy — detailed, agile, exacting, and impossible to ignore in presence.
            </p>
          </div>
        </div>
      </section>

      <section id="studio" className="section alt">
        <div className="wrap split">
          <div>
            <div className="eyebrow">Studio</div>
            <h2 style={{ marginTop: 18 }}>The house behind the work.</h2>
          </div>
          <div className="body-copy">
            <p style={{ fontSize: 25, lineHeight: 1.55, color: 'var(--ink)' }}>
              Joint Ambition is a brand strategy and identity studio helping ventures close the gap between who they are and how they are perceived.
            </p>
            <p>
              Founded by Jorrin Andre, Joint Ambition is shaped by a lifelong relationship with design, a business education, and a belief that strong ventures require more than aesthetics. They require perception, positioning, and structure.
            </p>
            <p>
              Our work helps close the gap between internal ambition and external perception, helping founders present their businesses as they were meant to be seen.
            </p>
            <div className="quote">
              <strong>Better perception creates more opportunities.</strong>
              <p>
                Joint Ambition helps ambitious ventures refine the identity, positioning, and presentation that shape how they are understood, trusted, and chosen. This is where vision parallels reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="strategy" className="section">
        <div className="wrap">
          <div className="split">
            <div>
              <div className="eyebrow">Strategy</div>
              <h2 style={{ marginTop: 18 }}>Before a brand is designed, it must be defined.</h2>
            </div>
            <div className="body-copy">
              <p>
                Strategy gives shape to how a venture is understood, positioned, and remembered. Joint Ambition works across brand architecture and identity systems, with handcrafted applications and custom web development that shape how a business is understood, trusted, and remembered.
              </p>
            </div>
          </div>

          <div className="grid4">
            <div className="card">
              <div className="num">01</div>
              <h3>Brand Architecture</h3>
              <p>Strategic foundation, positioning, perception, messaging, and brand direction.</p>
            </div>
            <div className="card">
              <div className="num">02</div>
              <h3>Identity Systems</h3>
              <p>Logos, typography, color, spacing, visual standards, and brand guidelines.</p>
            </div>
            <div className="card">
              <div className="num">03</div>
              <h3>Handcrafted Applications</h3>
              <p>Custom graphics, campaign visuals, print materials, presentations, and digital assets built from the identity system.</p>
            </div>
            <div className="card">
              <div className="num">04</div>
              <h3>Custom Web Development</h3>
              <p>Refined websites and digital experiences built to express the brand clearly and intentionally.</p>
            </div>
          </div>

          <div className="process">
            <div className="process-head">
              <div>
                <div className="eyebrow" style={{ color: '#868079' }}>Process Summary</div>
                <h3 style={{ marginTop: 14, fontSize: 42 }}>A disciplined path from ambition to form.</h3>
              </div>
              <p>Every engagement is designed to create greater clarity, stronger positioning, and a more refined presence across the touchpoints that matter most.</p>
            </div>
            <div className="process-grid">
              <div className="process-item">
                <div className="num">01</div><h4>Assess</h4>
                <p>We assess the venture, audience, objectives, and the perception the brand needs to carry.</p>
              </div>
              <div className="process-item">
                <div className="num">02</div><h4>Position</h4>
                <p>We clarify how the brand should be understood, differentiated, and remembered.</p>
              </div>
              <div className="process-item">
                <div className="num">03</div><h4>Build</h4>
                <p>We create the identity system, handcrafted applications, and digital touchpoints.</p>
              </div>
              <div className="process-item">
                <div className="num">04</div><h4>Align</h4>
                <p>We refine the details so the brand feels consistent, intentional, and ready to be seen.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="markets" className="section alt">
        <div className="wrap">
          <div className="markets-head">
            <div>
              <div className="eyebrow">Markets</div>
              <h2 style={{ marginTop: 18 }}>From place to perception.</h2>
            </div>
            <div className="body-copy">
              <p>Each market reflects a different strategic identity — a commercial world shaped by ambition, refinement, authority, precision, craft, or scale.</p>
              <p>These markets are symbolic territories, not limitations. They represent the types of business transformations Joint Ambition is built to support.</p>
            </div>
          </div>

          <div className="market-grid">
            <div className="market-card">
              <div>
                <div className="market-top"><span className="market-status">Active Market</span><span>◇</span></div>
                <h3>Chicago</h3>
                <div className="market-theme">Foundation / Structure / Ambition</div>
                <p>The foundation of Joint Ambition — a market rooted in structure, resilience, local credibility, and serious business ambition.</p>
              </div>
              <a className="market-link" href="#begin">Enter Market →</a>
            </div>
            <div className="market-card">
              <div>
                <div className="market-top"><span className="market-status">Emerging Market</span><span>◇</span></div>
                <h3>New York</h3>
                <div className="market-theme">Momentum / Scale / Authority</div>
                <p>For ventures preparing to be taken seriously at a larger scale through sharper positioning and stronger commercial presence.</p>
              </div>
              <a className="market-link" href="#begin">Enter Market →</a>
            </div>
            <div className="market-card">
              <div>
                <div className="market-top"><span className="market-status">Aspirational Market</span><span>◇</span></div>
                <h3>Paris</h3>
                <div className="market-theme">Refinement / Heritage / Restraint</div>
                <p>For luxury-minded brands that value elegance, symbolism, restraint, and timeless visual language.</p>
              </div>
              <a className="market-link" href="#begin">Enter Market →</a>
            </div>
          </div>

          <div className="unmapped">
            <div className="eyebrow">Unmapped Territories</div>
            <h3 style={{ marginTop: 14 }}>Some ambitions begin outside the map.</h3>
            <p style={{ marginTop: 14, maxWidth: 820, lineHeight: 1.8, color: '#5a554e', fontSize: 14 }}>
              From London to Tokyo, Los Angeles to Dubai, the map remains open to ventures whose ambition demands form. If your market is not currently listed, alignment is still possible.
            </p>
            <div className="tags">
              <span className="tag">Milan</span><span className="tag">Geneva</span><span className="tag">Miami</span>
              <span className="tag">London</span><span className="tag">Tokyo</span><span className="tag">Los Angeles</span>
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="section dark">
        <div className="wrap">
          <div style={{ maxWidth: 980 }}>
            <div className="eyebrow" style={{ color: '#8f8a82' }}>Philosophy</div>
            <h2 style={{ marginTop: 18 }}>Brand is not decoration. It is infrastructure.</h2>
            <p style={{ marginTop: 26, maxWidth: 760, color: '#c8c1b7', lineHeight: 1.8, fontSize: 17 }}>
              We approach brand as part of the structure that shapes how a venture is recognized, valued, trusted, and chosen.
            </p>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <div className="num">01</div>
              <h3>Perception shapes opportunity.</h3>
              <p>
                Every venture is evaluated before it is fully understood. A stronger identity improves how clearly the market understands its value. When positioning, visuals, language, and digital presence work together, a business becomes easier to trust, remember, and choose.
              </p>
            </div>
            <div className="philosophy-card">
              <div className="num">02</div>
              <h3>Built for ambitious ventures.</h3>
              <p>
                Ambition is not limited to one industry. Joint Ambition works with ventures that understand presentation is part of how value is communicated.
              </p>
              <div className="industry-row">
                <span className="industry">Real Estate</span><span className="industry">Small Business</span>
                <span className="industry">Professional Services</span><span className="industry">Hospitality</span>
                <span className="industry">Creative Founders</span><span className="industry">Emerging Ventures</span>
              </div>
            </div>
            <div className="philosophy-card">
              <div className="num">03</div>
              <h3>Precision is a decision.</h3>
              <p>
                Precision is not an accident. It is a choice made through restraint, structure, spacing, language, and detail. At Joint Ambition, refinement is not excess. It is discipline.
              </p>
            </div>
            <div className="philosophy-card">
              <div className="num">04</div>
              <h3>Where vision parallels reality.</h3>
              <p>
                Many founders can see the business clearly before the outside world can see it the same way. This is where we work — translating ambition into identity, strategy into visuals, and intention into a brand presence others can understand and believe in.
              </p>
            </div>
          </div>

          <div className="hummingbird-section">
            <div>
              <div className="eyebrow">The Hummingbird</div>
              <h3 style={{ marginTop: 14, fontSize: 48 }}>Controlled energy.</h3>
            </div>
            <p>
              The hummingbird symbolizes precision, motion, and controlled energy. It moves with speed, but not carelessness. It appears delicate, yet operates with extraordinary control. For Joint Ambition, it reflects the balance we seek in every identity: elegance with execution, beauty with purpose, and ambition with discipline.
            </p>
          </div>
        </div>
      </section>

      <section id="begin" className="cta">
        <div className="wrap cta-grid">
          <div>
            <div className="eyebrow">Begin</div>
            <h2 style={{ marginTop: 18 }}>Precision is a decision.</h2>
            <p style={{ marginTop: 24, maxWidth: 560, lineHeight: 1.85, color: '#5c574f', fontSize: 17 }}>
              For ventures ready to align ambition with perception. If your vision is ready for structure, refinement, and form, begin with intention.
            </p>
          </div>

          <form onSubmit={async (event) => {
            event.preventDefault();
            setFormStatus('sending');
            console.log('[Inquiry] status: sending');
            const form = event.currentTarget;
            const formData = new FormData(form);
            try {
              const response = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData.entries())),
              });
              const result = await response.json().catch(() => null);
              console.log('[Inquiry] response:', { status: response.status, ok: response.ok, result });

              if (response.ok) {
                form.reset();
                setFormStatus('success');
                console.log('[Inquiry] status: success');
              } else {
                setFormStatus('error');
                console.log('[Inquiry] status: error');
              }
            } catch (error) {
              setFormStatus('error');
              console.error('[Inquiry] status: error - request failed', error);
            }
          }}>
            <div className="form-grid">
              <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
              <label>Email<input name="email" type="email" placeholder="Your email" required /></label>
              <label>Business / Venture<input name="business" type="text" placeholder="Business name" /></label>
              <label className="full">Website or Instagram<input name="website" type="text" placeholder="URL or handle" /></label>
              <label className="full">What are you building or refining?<textarea name="message" placeholder="Tell us about your business, the current challenge, and what you want to change." required /></label>
              <label>Desired Timeline<input name="timeline" type="text" placeholder="e.g. 6–8 weeks" /></label>
              <label>Estimated Investment<input name="investment" type="text" placeholder="e.g. $5,000–$10,000" /></label>
              <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
            </div>
            <button className="submit" type="submit" disabled={formStatus === 'sending'}>
              {formStatus === 'sending' ? 'Sending...' : 'Begin With Intention'}
            </button>
            {formStatus === 'success' && <p className="form-status">Thank you. Your inquiry has been sent.</p>}
            {formStatus === 'error' && <p className="form-status">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <div>Joint Ambition LLC</div>
          <div>Where vision parallels reality.</div>
        </div>
      </footer>
    </>
  );
}
