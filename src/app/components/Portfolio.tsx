import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: 'Artisan Roasters',
    category: 'Coffee Brand',
    image: 'https://images.unsplash.com/photo-1759563871371-eb0ec31824a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwYWNrYWdpbmclMjBkZXNpZ258ZW58MXx8fHwxNzcwODkxOTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Meridian Law',
    category: 'Legal Services',
    image: 'https://images.unsplash.com/photo-1764694071531-008332b61f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbHV4dXJ5JTIwYnJhbmQlMjBkZXNpZ258ZW58MXx8fHwxNzcwOTAyMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Botanica',
    category: 'Wellness Studio',
    image: 'https://images.unsplash.com/photo-1752766074353-565489ca3e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYnVzaW5lc3MlMjBicmFuZGluZ3xlbnwxfHx8fDE3NzA5MDIwNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Atelier Home',
    category: 'Interior Design',
    image: 'https://images.unsplash.com/photo-1727686679954-7ddd9f857abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwcG9ydGZvbGlvfGVufDF8fHx8MTc3MDkwMjA3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function Portfolio() {
  return (
    <section id="work" className="py-32 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl !font-light tracking-tight mb-4">Selected Work</h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            A curated selection of recent brand identities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-white mb-6 overflow-hidden">
                <ImageWithFallback 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl">{project.title}</h3>
                <p className="text-gray-500 text-sm tracking-wider uppercase">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
