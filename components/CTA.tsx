import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="card-glass p-12 glow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
              Ready to turn followers into <span className="gradient-text">revenue?</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of creators and businesses using iGrowth to automate, capture, and convert — every single day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" className="group flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold px-8 py-4 rounded-full text-lg hover:opacity-90 transition-all glow">
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-white/40 text-sm">No credit card required. Free forever plan available.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
