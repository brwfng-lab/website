export default function PhotoBentoGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-thin tracking-tight text-slate-900 mb-4">
            Community <span className="font-normal italic text-blue-600">Vibes</span>
          </h2>
          <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
            Nothing serious o, just a community of book lovers laughing, gisting, and unwinding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px]">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden group shadow-sm">
            <img src="/photo-1.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative overflow-hidden group shadow-sm">
            <img src="/photo-2.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative overflow-hidden group shadow-sm">
            <img src="/photo-3.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="md:col-span-1 relative overflow-hidden group shadow-sm">
            <img src="/photo-4.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="md:col-span-2 relative overflow-hidden group shadow-sm">
            <img src="/photo-5.jpg" alt="Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
