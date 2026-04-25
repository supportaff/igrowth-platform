'use client'
import Link from 'next/link'
import { ArrowRight, Zap, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section style={{ background: '#222831', paddingTop: 80, paddingBottom: 100 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,173,181,0.12)', border: '1px solid rgba(0,173,181,0.3)',
          borderRadius: 99, padding: '6px 14px', marginBottom: 28 }}>
          <Zap style={{ width: 13, height: 13, color: '#00ADB5' }} fill="#00ADB5" />
          <span style={{ color: '#00ADB5', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
            Instagram Growth Automation
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1,
          color: '#EEEEEE', letterSpacing: '-1px', marginBottom: 20 }}>
          Grow your Instagram<br />
          <span className="gradient-text">on autopilot</span>
        </h1>

        {/* Sub */}
        <p style={{ fontSize: 18, color: 'rgba(238,238,238,0.55)', maxWidth: 560,
          margin: '0 auto 40px', lineHeight: 1.65 }}>
          Automate DMs, capture brand deals, and track what&apos;s working — all in one creator CRM built for Instagram.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/signup"
            style={{ background: '#00ADB5', color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '13px 28px', borderRadius: 12, display: 'inline-flex',
              alignItems: 'center', gap: 8, transition: 'background 160ms' }}
            className="hover:bg-[#009aa2]">
            Start for free <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
          <Link href="#features"
            style={{ background: 'rgba(238,238,238,0.06)', color: '#EEEEEE',
              fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 12,
              border: '1px solid rgba(238,238,238,0.12)', transition: 'background 160ms' }}
            className="hover:bg-white/10">
            See how it works
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: 8 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} style={{ width: 14, height: 14, color: '#00ADB5' }} fill="#00ADB5" />
          ))}
          <span style={{ color: 'rgba(238,238,238,0.4)', fontSize: 13, marginLeft: 4 }}>
            Loved by 2,400+ creators
          </span>
        </div>
      </div>
    </section>
  )
}
