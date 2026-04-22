'use client'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = ['Features', 'How It Works', 'Pricing']

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold gradient-text">iGrowth</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm text-white/70 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Log in</a>
            <a href="#" className="bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity glow-sm">
              Start Free
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f0f1a] border-t border-white/10 px-4 py-4 space-y-3">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setOpen(false)}
              className="block text-white/70 hover:text-white text-sm py-2">
              {l}
            </a>
          ))}
          <a href="#" className="block bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-2">
            Start Free
          </a>
        </div>
      )}
    </nav>
  )
}
