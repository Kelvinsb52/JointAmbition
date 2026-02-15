export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 bg-black text-white border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm tracking-[0.2em] uppercase">
            Studio
          </div>
          
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Behance</a>
          </div>
          
          <div className="text-sm text-gray-600">
            © 2026 All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
