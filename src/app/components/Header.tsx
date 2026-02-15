export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="text-sm tracking-[0.2em] uppercase">
            Joint Ambition
          </div>
          
          <div className="hidden md:flex items-center space-x-12 text-sm">
            <a href="#work" className="hover:opacity-60 transition-opacity">
              Work
            </a>
            <a href="#services" className="hover:opacity-60 transition-opacity">
              Services
            </a>
            <a href="#about" className="hover:opacity-60 transition-opacity">
              About
            </a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
