'use client'
import { X, Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Creator',
    price: '₹499',
    period: '/month',
    features: ['Unlimited DMs', 'Unlimited automations', 'Full CRM', '25 brand deals', '90-day insights'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹999',
    period: '/month',
    features: ['Everything in Creator', 'Unlimited brand deals', 'Re-engagement flows', '180-day insights', 'Deal PDF export', 'Priority support'],
    highlight: true,
    badge: 'Best Value',
  },
  {
    name: 'Agency',
    price: '₹2499',
    period: '/month',
    features: ['10 Instagram accounts', '5 team seats', 'Client workspaces', 'Branded exports', 'Dedicated onboarding'],
    highlight: false,
  },
]

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}
      onClick={onClose}>
      <div style={{
        background: '#2c3340', border: '1px solid rgba(238,238,238,0.1)',
        borderRadius: 24, padding: '32px 28px', maxWidth: 780, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#EEEEEE', marginBottom: 4 }}>Upgrade your plan</h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,238,0.45)' }}>Unlock more power for your creator workflow</p>
          </div>
          <button onClick={onClose}
            style={{ color: 'rgba(238,238,238,0.4)', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 4, borderRadius: 8 }}
            className="hover:text-[#EEEEEE] hover:bg-white/5 transition-colors"
            aria-label="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              position: 'relative',
              background: plan.highlight ? '#00ADB5' : '#393E46',
              border: `1px solid ${plan.highlight ? '#00ADB5' : 'rgba(238,238,238,0.1)'}`,
              borderRadius: 16, padding: '22px 18px',
              boxShadow: plan.highlight ? '0 0 30px rgba(0,173,181,0.3)' : 'none',
            }}>
              {plan.badge && (
                <span style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: '#EEEEEE', color: '#222831', fontSize: 10, fontWeight: 800,
                  padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap',
                }}>{plan.badge}</span>
              )}
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'rgba(238,238,238,0.4)',
                marginBottom: 6, textTransform: 'uppercase' }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginBottom: 14 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: plan.highlight ? '#fff' : '#EEEEEE' }}>{plan.price}</span>
                <span style={{ fontSize: 12, marginBottom: 3, color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(238,238,238,0.4)' }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 7, fontSize: 12,
                    color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(238,238,238,0.6)',
                    alignItems: 'flex-start' }}>
                    <Check style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1,
                      color: plan.highlight ? '#fff' : '#00ADB5' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%', padding: '9px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                background: plan.highlight ? '#222831' : '#00ADB5',
                color: plan.highlight ? '#00ADB5' : '#fff',
                border: 'none', cursor: 'pointer', transition: 'opacity 160ms',
              }}
                className="hover:opacity-85">
                <Zap style={{ width: 12, height: 12, display: 'inline', marginRight: 5 }} fill="currentColor" />
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(238,238,238,0.25)', fontSize: 12, marginTop: 20 }}>
          7-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  )
}
