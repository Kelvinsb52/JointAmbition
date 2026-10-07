export default function Markets() {
  return (
    <section id="markets" className="section alt" tabIndex={-1}>
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
  );
}
