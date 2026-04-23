'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold gradient-text">iGrowth</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm text-white/70 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity glow-sm">
              Start Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f0f1a] border-t border-white/10 px-4 py-4 space-y-3">
          {links.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setOpen(false)}
              className="block text-white/70 hover:text-white text-sm py-2">
              {l.label}
            </a>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}
            className="block text-white/70 hover:text-white text-sm py-2">
            Log in
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}
            className="block bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-2">
            Start Free
          </Link>
        </div>
      )}
    </nav>
  )
}
