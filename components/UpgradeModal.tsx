'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { X, Check, Zap, Crown } from 'lucide-react'

const PRO_FEATURES = [
  'Unlimited DMs every month',
  'Unlimited Contacts',
  'Unlimited Automations',
  'Re-trigger automations',
  'Ask For Follow flows',
  'Lead Gen automations',
  'Priority support',
]

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: '100%', maxWidth: 460,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
      }}>

        {/* Header */}
        <div style={{
          padding: '22px 24px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: '#fff', borderRadius: 10,
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Crown style={{ width: 16, height: 16, color: '#000' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Upgrade to Pro</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Unlock unlimited growth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: 6,
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: 'all 140ms',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            className="hover:border-white/20 hover:text-white/75"
            aria-label="Close">
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Price */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{
            background: '#fff',
            borderRadius: 14, padding: '18px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#000', letterSpacing: '-1px' }}>₹399</span>
                <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>billed annually</p>
            </div>
            <div style={{
              background: '#000',
              color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
              padding: '5px 12px', borderRadius: 99,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Zap style={{ width: 9, height: 9 }} fill="white" /> PRO
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '16px 24px' }}>
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
            marginBottom: 12,
          }}>Everything in Pro</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRO_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', borderRadius: 99,
                  width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check style={{ width: 10, height: 10, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link
            href="https://dash.linkplease.co/signup"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center',
              background: '#fff', color: '#000',
              borderRadius: 12, padding: '13px 0',
              fontSize: 14, fontWeight: 700,
              border: 'none',
              transition: 'opacity 140ms',
            }}
            className="hover:opacity-85">
            Get Pro — ₹399/mo
          </Link>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '11px 0',
              fontSize: 13, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', width: '100%',
              transition: 'all 140ms',
            }}
            className="hover:border-white/20 hover:text-white/60">
            Continue with Free
          </button>
        </div>

      </div>
    </div>
  )
}
