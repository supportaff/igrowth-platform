export default function SocialProof() {
  const logos = ['Creators', 'Coaches', 'D2C Brands', 'Agencies', 'Consultants', 'Educators']
  return (
    <section className="py-12 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-white/40 mb-8 uppercase tracking-widest">Trusted by creators and businesses across India</p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {logos.map(name => (
            <div key={name} className="px-6 py-2.5 rounded-full border border-white/15 text-white/50 text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
