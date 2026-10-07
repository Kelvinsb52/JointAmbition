export default function Philosophy() {
  return (
    <section id="philosophy" className="section dark" tabIndex={-1}>
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
            <h3>Precision is a decision.<sup className="tm-mark">™</sup></h3>
            <p>
              Precision is not an accident. It is a choice made through restraint, structure, spacing, language, and detail. At Joint Ambition, refinement is not excess. It is discipline.
            </p>
          </div>
          <div className="philosophy-card">
            <div className="num">04</div>
            <h3>Where vision parallels reality.<sup className="tm-mark">™</sup></h3>
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
  );
}
