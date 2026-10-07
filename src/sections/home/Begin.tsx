import InquiryForm from './InquiryForm';

export default function Begin() {
  return (
    <section id="begin" className="cta" tabIndex={-1}>
      <div className="wrap cta-grid">
        <div>
          <div className="eyebrow">Begin</div>
          <h2 style={{ marginTop: 18 }}>Precision is a decision.</h2>
          <p style={{ marginTop: 24, maxWidth: 560, lineHeight: 1.85, color: '#5c574f', fontSize: 17 }}>
            For ventures ready to align ambition with perception. If your vision is ready for structure, refinement, and form, begin with intention.
          </p>
        </div>

        <InquiryForm />
      </div>
    </section>
  );
}
