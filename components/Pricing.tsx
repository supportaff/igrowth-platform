'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const FREE_FEATURES = [
  'Unlimited Automations',
  '1,000 DMs / month',
  '1,000 Contacts',
  'Re-trigger',
  'Ask For Follow',
  'Lead Gen',
  'UNLIMITED',
]

const PRO_FEATURES = [
  'Unlimited Automations',
  'Unlimited DMs',
  'Unlimited Contacts',
  'Re-trigger',
  'Ask For Follow',
  'Lead Gen',
]

const ENTERPRISE_FEATURES = [
  'Manage Multiple Accounts',
  'Dedicated Account Manager',
  'Custom Solutions',
  'Early Access New Features',
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section
      id="pricing"
      style={{
        background: '#000',
        padding: 'clamp(64px,8vw,120px) 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            marginBottom: 14,
          }}>Pricing</p>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800,
            letterSpacing: '-0.5px', color: '#fff', lineHeight: 1.1,
            marginBottom: 14,
          }}>Simple, honest pricing</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 460, margin: '0 auto 28px' }}>
            Start free. Upgrade when you grow.
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex',
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 99, padding: 4,
            alignItems: 'center', gap: 4,
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                fontSize: 12, fontWeight: 600, borderRadius: 99, padding: '6px 16px',
                border: 'none', cursor: 'pointer', transition: 'all 160ms',
                background: !annual ? '#fff' : 'transparent',
                color: !annual ? '#000' : 'rgba(255,255,255,0.45)',
              }}>Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                fontSize: 12, fontWeight: 600, borderRadius: 99, padding: '6px 16px',
                border: 'none', cursor: 'pointer', transition: 'all 160ms',
                background: annual ? '#fff' : 'transparent',
                color: annual ? '#000' : 'rgba(255,255,255,0.45)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              Annual
              <span style={{
                background: annual ? '#000' : 'rgba(255,255,255,0.1)',
                color: annual ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
              }}>Save</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16, alignItems: 'start',
        }}>

          {/* Free */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, padding: '28px 26px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Free</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>₹0</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>/account /month</span>
              </div>
            </div>
            <Link
              href="https://dash.linkplease.co/signup"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '11px 0',
                fontSize: 13, fontWeight: 700,
                color: 'rgba(255,255,255,0.75)',
                background: 'transparent',
                transition: 'all 140ms',
              }}
              className="hover:border-white/35 hover:text-white hover:bg-white/[0.04]">
              Create a Free Account
            </Link>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FREE_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Check style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro — featured */}
          <div style={{
            background: '#fff',
            border: '1px solid #fff',
            borderRadius: 18, padding: '28px 26px',
            display: 'flex', flexDirection: 'column', gap: 20,
            position: 'relative',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 24px 64px rgba(255,255,255,0.06)',
          }}>
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              padding: '4px 14px', borderRadius: 99,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Zap style={{ width: 9, height: 9 }} fill="white" /> MOST POPULAR
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 10 }}>Pro</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#000', letterSpacing: '-1px' }}>₹399</span>
                <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>/account /month</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>billed annually</p>
            </div>
            <Link
              href="https://dash.linkplease.co/signup"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                background: '#000', color: '#fff',
                borderRadius: 10, padding: '11px 0',
                fontSize: 13, fontWeight: 700,
                border: 'none',
                transition: 'opacity 140ms',
              }}
              className="hover:opacity-80">
              Get Pro
            </Link>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Check style={{ width: 14, height: 14, color: '#000', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.75)', fontWeight: 500 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, padding: '28px 26px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Enterprise</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Custom</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Talk to us about your needs</p>
            </div>
            <Link
              href="https://dash.linkplease.co/signup"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '11px 0',
                fontSize: 13, fontWeight: 700,
                color: 'rgba(255,255,255,0.75)',
                background: 'transparent',
                transition: 'all 140ms',
              }}
              className="hover:border-white/35 hover:text-white hover:bg-white/[0.04]">
              Get in Touch
            </Link>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ENTERPRISE_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Check style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
