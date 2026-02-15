export function CTA() {
  return (
    <section id="contact" className="py-32 px-6 lg:px-12 bg-black text-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl !font-light tracking-tight !leading-tight">
            Ready to elevate
            <span className="block">your brand?</span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto !leading-relaxed">
            Let's discuss how we can create a visual identity that reflects the quality and 
            professionalism of your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-4 bg-white text-black text-sm tracking-wider uppercase hover:bg-gray-100 transition-colors">
              Start a Project
            </button>
            <button className="px-8 py-4 border border-white text-white text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-colors">
              Schedule a Call
            </button>
          </div>
          
          <div className="pt-12 text-sm text-gray-500">
            hello@studio.com · +1 (555) 123-4567
          </div>
        </div>
      </div>
    </section>
  );
}
