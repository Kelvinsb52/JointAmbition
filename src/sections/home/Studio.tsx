export default function Studio() {
  return (
    <section id="studio" className="section alt" tabIndex={-1}>
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
  );
}
