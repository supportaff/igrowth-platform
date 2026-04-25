'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(34,40,49,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(238,238,238,0.08)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 220ms ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}
        className="flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div style={{ background: '#00ADB5', borderRadius: 10, width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ color: '#ffffff', width: 16, height: 16 }} fill="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#EEEEEE', letterSpacing: '-0.3px' }}>
            Afforal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'Pricing', 'Blog'].map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`}
              style={{ color: 'rgba(238,238,238,0.65)', fontSize: 14, fontWeight: 500,
                padding: '6px 14px', borderRadius: 8, transition: 'color 160ms, background 160ms' }}
              className="hover:text-[#EEEEEE] hover:bg-white/5">
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            style={{ color: 'rgba(238,238,238,0.7)', fontSize: 14, fontWeight: 500,
              padding: '7px 16px', borderRadius: 8, transition: 'color 160ms' }}
            className="hover:text-[#EEEEEE]">
            Sign in
          </Link>
          <Link href="/signup"
            style={{ background: '#00ADB5', color: '#ffffff', fontSize: 14, fontWeight: 700,
              padding: '8px 20px', borderRadius: 10, transition: 'background 160ms' }}
            className="hover:bg-[#009aa2]">
            Get started free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: '#EEEEEE' }} aria-label="Toggle menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#393E46', borderTop: '1px solid rgba(238,238,238,0.08)' }}
          className="md:hidden px-6 pb-5 pt-3 space-y-1">
          {['Features', 'Pricing', 'Blog'].map(item => (
            <Link key={item} href={`#${item.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', color: 'rgba(238,238,238,0.75)', fontSize: 15,
                padding: '10px 12px', borderRadius: 8 }}
              className="hover:bg-white/5 hover:text-[#EEEEEE] transition-colors">
              {item}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid rgba(238,238,238,0.08)', paddingTop: 12, marginTop: 8 }}
            className="flex flex-col gap-2">
            <Link href="/login"
              style={{ color: 'rgba(238,238,238,0.75)', fontSize: 14, fontWeight: 500,
                padding: '10px 12px', borderRadius: 8, textAlign: 'center' }}
              className="hover:bg-white/5 hover:text-[#EEEEEE] transition-colors">
              Sign in
            </Link>
            <Link href="/signup"
              style={{ background: '#00ADB5', color: '#fff', fontSize: 14, fontWeight: 700,
                padding: '11px', borderRadius: 10, textAlign: 'center', display: 'block' }}
              className="hover:bg-[#009aa2] transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
