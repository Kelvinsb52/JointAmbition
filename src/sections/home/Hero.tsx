import Hummingbird from '../../components/Hummingbird/Hummingbird';
import botanicalDesktop from '../../assets/botanical/botanical-frame-desktop.svg';
import botanicalMobile from '../../assets/botanical/botanical-frame-desktop.svg';

export default function Hero() {
  return (
    <section id="home" className="hero" tabIndex={-1}>
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
        <div className="botanical-layer" aria-hidden="true">
          <picture className="botanical-decoration">
            <source media="(max-width: 640px)" srcSet={botanicalMobile} />
              <img className="botanical-desktop" src={botanicalDesktop} alt="" width="1368" height="1638" decoding="async" />
          </picture>
        </div>
        <div className="motif-stage">
          <div className="visual-card">
            <div className="hummingbird-mark">
                <Hummingbird size="100%" ring={false} color="#eee7da" strokeWidth={5.5} className="signature-motif-icon" label="Joint Ambition hummingbird" />
            </div>
            <div className="eyebrow" style={{ color: '#bdb6ad' }}>Signature Motif</div>
            <h2>Precision in motion.</h2>
            <p>
              The hummingbird represents controlled energy — detailed, agile, exacting, and impossible to ignore in presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
