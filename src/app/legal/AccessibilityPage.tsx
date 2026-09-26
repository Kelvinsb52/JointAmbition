import LegalLayout from './LegalLayout';

export default function AccessibilityPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Accessibility Statement"
      lastUpdated="September 25, 2026"
      currentPath="/accessibility"
    >
      <h2>Our Commitment</h2>
      <p>
        Joint Ambition wants this website to be usable by as many visitors as possible, including people who use
        assistive technology. We aim to design and build this website with accessibility in mind, and we are
        working toward improving it over time.
      </p>

      <h2>Accessibility Target</h2>
      <p>
        Our accessibility target for this website is an implementation oriented around the Web Content
        Accessibility Guidelines (WCAG) 2.2, Level AA. This statement describes an ongoing goal rather than a
        claim that the website fully conforms with that standard today.
      </p>

      <h2>Ongoing Improvement</h2>
      <p>
        We periodically review this website's structure, navigation, and interactive elements and make
        improvements where we identify gaps between the current implementation and our accessibility target.
        Accessibility work on this website is ongoing rather than a one-time effort.
      </p>

      <h2>Known Limitations</h2>
      <p>
        No website is perfectly accessible to every visitor in every circumstance. If you encounter a barrier while
        using this website, we want to know about it so we can evaluate and address it.
      </p>

      <h2>Feedback</h2>
      <p>
        If you experience difficulty accessing any part of this website, please contact us at{' '}
        <a href="mailto:privacy@jointambitions.com">privacy@jointambitions.com</a>. Please describe the page you
        were on and the issue you encountered so we can look into it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this Accessibility Statement can be directed to{' '}
        <a href="mailto:privacy@jointambitions.com">privacy@jointambitions.com</a>.
      </p>
    </LegalLayout>
  );
}
