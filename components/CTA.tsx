import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section style={{ background: '#222831', padding: '80px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center',
        background: '#393E46', border: '1px solid rgba(0,173,181,0.25)',
        borderRadius: 24, padding: '60px 40px',
        boxShadow: '0 0 60px rgba(0,173,181,0.08)' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800,
          color: '#EEEEEE', marginBottom: 14, letterSpacing: '-0.5px' }}>
          Ready to grow on autopilot?
        </h2>
        <p style={{ color: 'rgba(238,238,238,0.5)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Join 2,400+ creators already using Afforal to automate DMs, close brand deals, and grow faster.
        </p>
        <Link href="/signup"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#00ADB5', color: '#fff', fontWeight: 700, fontSize: 15,
            padding: '13px 30px', borderRadius: 12, transition: 'background 160ms' }}
          className="hover:bg-[#009aa2]">
          Start for free <ArrowRight style={{ width: 16, height: 16 }} />
        </Link>
        <p style={{ color: 'rgba(238,238,238,0.25)', fontSize: 12, marginTop: 16 }}>
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
