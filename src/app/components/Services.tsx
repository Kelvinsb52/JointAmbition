const services = [
  {
    number: '01',
    title: 'Brand Identity',
    description: 'Comprehensive visual systems that capture your essence and resonate with your audience.',
    details: ['Logo Design', 'Color Palette', 'Typography', 'Brand Guidelines'],
  },
  {
    number: '02',
    title: 'Print & Packaging',
    description: 'Tangible experiences that leave lasting impressions and elevate your product presence.',
    details: ['Business Cards', 'Packaging Design', 'Print Collateral', 'Marketing Materials'],
  },
  {
    number: '03',
    title: 'Digital Presence',
    description: 'Cohesive digital expressions that extend your brand across every touchpoint.',
    details: ['Website Design', 'Social Media', 'Email Templates', 'Digital Assets'],
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 px-6 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl !font-light tracking-tight mb-4">Services</h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Crafting distinctive identities for ambitious businesses
          </p>
        </div>
        
        <div className="space-y-24">
          {services.map((service, index) => (
            <div 
              key={index}
              className="grid md:grid-cols-12 gap-8 md:gap-12 border-t border-gray-200 pt-12"
            >
              <div className="md:col-span-2">
                <div className="text-sm text-gray-400 tracking-wider">{service.number}</div>
              </div>
              
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl mb-4">{service.title}</h3>
                <p className="text-gray-600 !leading-relaxed">{service.description}</p>
              </div>
              
              <div className="md:col-span-6">
                <ul className="space-y-3">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="w-1 h-1 bg-black rounded-full mr-4"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
