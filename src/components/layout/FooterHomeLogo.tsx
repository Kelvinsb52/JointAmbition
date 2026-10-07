import { Link, useLocation } from 'react-router';

export default function FooterHomeLogo({ className }: { className: string }) {
  const { pathname } = useLocation();

  return (
    <Link
      to="/"
      className={className}
      aria-label="Joint Ambition home"
      onClick={() => {
        if (pathname === '/') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }}
    >
      <img src="/favicon.svg" alt="" aria-hidden="true" />
    </Link>
  );
}