import LegalLayout from './LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" lastUpdated="September 25, 2026" currentPath="/privacy">
      <h2>1. Who Operates This Site</h2>
      <p>
        This website is operated by Joint Ambition LLC ("Joint Ambition," "we," "us," or "our"), a brand strategy,
        identity, web, and creative studio based in Chicago, Illinois, United States.
      </p>

      <h2>2. Scope of This Policy</h2>
      <p>
        This Privacy Policy describes how Joint Ambition handles information in connection with this website
        (jointambitions.com) and the project-inquiry form available on it. It does not cover information handled
        outside of this website, such as information exchanged during a separately contracted client engagement.
      </p>

      <h2>3. Information We Collect</h2>
      <p>
        The only information-collection mechanism on this website is the project-inquiry form. When you submit
        that form, we receive the information you choose to enter into its fields:
      </p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Business or venture name (optional)</li>
        <li>Website or Instagram handle (optional)</li>
        <li>Project message describing what you are building or refining</li>
        <li>Desired timeline</li>
        <li>Estimated investment range</li>
      </ul>
      <p>
        The form also includes a hidden field used only to help detect automated spam submissions; it is not
        intended to collect information from human visitors.
      </p>

      <h2>4. How Information Is Collected</h2>
      <p>
        Information is collected only when you voluntarily complete and submit the inquiry form. We do not
        currently use analytics or advertising cookies, browser storage, or tracking technologies to collect
        information as you browse this website. See our{' '}<a href="/cookies">Cookie &amp; Similar Technologies Policy</a>{' '}for more detail.
      </p>

      <h2>5. How Inquiry Information Is Used</h2>
      <p>Information submitted through the inquiry form is used to:</p>
      <ul>
        <li>evaluate potential engagements;</li>
        <li>communicate with prospective clients;</li>
        <li>prepare proposals, estimates, or other requested information;</li>
        <li>maintain appropriate business records;</li>
        <li>prevent abuse or spam; and</li>
        <li>resolve disputes and satisfy applicable legal obligations.</li>
      </ul>
      <p>
        We do not use inquiry information to automatically enroll you in unrelated marketing campaigns.
      </p>

      <h2>6. Inquiry Data Retention</h2>
      <p>
        We retain inquiry information only for as long as reasonably necessary to evaluate the inquiry, maintain
        relevant business records, resolve disputes, and meet applicable legal obligations.
      </p>

      <h2>7. Service Providers</h2>
      <p>
        We use a limited number of service providers to operate this website and process inquiry submissions:
      </p>
      <ul>
        <li><strong>Vercel</strong> — hosts this website and runs the serverless function that receives inquiry-form submissions.</li>
        <li><strong>Resend</strong> — delivers inquiry-form submissions to our internal inquiry mailbox by email.</li>
      </ul>
      <p>
        Third-party services we use may change over time. If a new service provider is introduced in a way that
        materially changes how information is handled, we will update this policy accordingly.
      </p>

      <h2>8. No Sale or Targeted-Advertising Use of Personal Information</h2>
      <p>
        We do not currently use targeted advertising or advertising/remarketing pixels on this website. We do not
        sell personal information, and we do not intentionally share personal information for targeted-advertising
        purposes.
      </p>

      <h2>9. No Automated Decision-Making or Profiling</h2>
      <p>
        We do not currently perform automated decision-making or automated profiling using information submitted
        through this website.
      </p>

      <h2>10. Children</h2>
      <p>
        This website is not directed at children, and we do not knowingly collect information from children through
        the inquiry form.
      </p>

      <h2>11. Security</h2>
      <p>
        We take reasonable measures intended to help protect information submitted through this website, such as
        transmitting the inquiry form over an encrypted connection and keeping service credentials out of the
        website's browser-facing code. No method of transmission or storage is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>12. Geographic and Service Scope</h2>
      <p>
        Joint Ambition primarily offers services from the United States. We are not currently specifically
        targeting the European Union, the United Kingdom, or other foreign markets through localized advertising,
        offices, or jurisdiction-specific campaigns. The general worldwide reachability of a public website should
        not be interpreted as an intent to target every jurisdiction from which it may be viewed.
      </p>

      <h2>13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time as our practices or the services we use evolve. The
        "Last updated" date at the top of this page reflects the most recent revision.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about this Privacy Policy can be directed to{' '}<a href="mailto:privacy@jointambitions.com">privacy@jointambitions.com</a>.
      </p>
    </LegalLayout>
  );
}
