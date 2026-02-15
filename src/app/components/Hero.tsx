export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 bg-white">
      <div className="max-w-[1400px] w-full mx-auto pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl !font-light tracking-tight text-gray-900 !leading-[1.1]">
            Elevate your brand with
            <span className="block italic">timeless design</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto !leading-relaxed">
            Sophisticated visual identity and brand design for discerning small businesses
          </p>
          
          <div className="pt-4">
            <button className="px-8 py-4 bg-black text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-3 gap-1 max-w-5xl mx-auto">
          <div className="aspect-square bg-gray-100"></div>
          <div className="aspect-square bg-gray-200"></div>
          <div className="aspect-square bg-gray-100"></div>
        </div>
      </div>
    </section>
  );
}
