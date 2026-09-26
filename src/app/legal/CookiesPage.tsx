import LegalLayout from './LegalLayout';

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookie & Similar Technologies Policy"
      lastUpdated="September 25, 2026"
      currentPath="/cookies"
    >
      <h2>Current Use of Cookies and Browser Storage</h2>
      <p>
        As of the date at the top of this page, this website does not set cookies and does not use browser
        storage (such as localStorage, sessionStorage, or IndexedDB) to track visitors. Joint Ambition does not
        currently use analytics or advertising cookies on this website.
      </p>

      <h2>Why There Is No Cookie Banner Right Now</h2>
      <p>
        Because no optional, cookie-based, or storage-based technology is currently active on this website, no
        cookie-preference banner or consent toggle is currently displayed. If that changes — for example, if we
        introduce analytics or another technology that relies on cookies or browser storage — we will update this
        policy and introduce an appropriate way for you to make a choice about it before that technology is used.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this Cookie &amp; Similar Technologies Policy can be directed to{' '}
        <a href="mailto:privacy@jointambitions.com">privacy@jointambitions.com</a>.
      </p>
    </LegalLayout>
  );
}
