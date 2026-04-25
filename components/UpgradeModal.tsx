'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { X, Check, Crown, Zap, Loader2 } from 'lucide-react'

const PLANS = [
  {
    id: 'creator',
    name: 'Creator',
    price: 499,
    period: '/mo',
    billing: 'monthly',
    label: 'Most Popular',
    features: [
      'Unlimited DMs every month',
      'Unlimited contacts',
      'Unlimited automations',
      'Full contact CRM',
      '25 active brand deals',
      'Content insights: last 90 days',
      'Audience demographics',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 999,
    period: '/mo',
    billing: 'monthly',
    label: null,
    features: [
      'Everything in Creator',
      'Unlimited brand deals',
      'Re-engagement flows',
      'Content insights: last 180 days',
      'Deal PDF export',
      'Priority support',
      'Advanced analytics',
    ],
  },
]

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const plan = PLANS[selectedPlan]

  const handleUpgrade = async () => {
    setError('')
    setLoading(true)
    try {
      const email = user?.emailAddresses?.[0]?.emailAddress ?? ''
      const name = user?.firstName
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : email.split('@')[0]
      const res = await fetch('/api/payment/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billing: plan.billing,
          amount: plan.price,
          planName: `iGrowth ${plan.name}`,
          userId: user?.id ?? '',
          email,
          name,
          phone: '',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Could not initiate payment. Please try again.')
        setLoading(false)
        return
      }
      // Build a hidden form and submit to PayU
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.payuUrl
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = k
        input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (e) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

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
        width: '100%', maxWidth: 500,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{
          padding: '22px 24px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#fff', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown style={{ width: 16, height: 16, color: '#000' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Upgrade your plan</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Unlock more power for your creator business</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close">
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Plan selector */}
        <div style={{ padding: '18px 24px 0', display: 'flex', gap: 10 }}>
          {PLANS.map((p, i) => (
            <button key={p.id} onClick={() => setSelectedPlan(i)}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                border: selectedPlan === i ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                background: selectedPlan === i ? '#fff' : 'rgba(255,255,255,0.04)',
                color: selectedPlan === i ? '#000' : '#fff',
                transition: 'all 140ms', position: 'relative',
              }}>
              {p.label && (
                <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.07em' }}>POPULAR</span>
              )}
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px' }}>₹{p.price}</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{p.name} · {p.period}</div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{ padding: '16px 24px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
            What&apos;s included in {plan.name}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check style={{ width: 10, height: 10, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '0 24px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: '12px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: loading ? 'rgba(255,255,255,0.6)' : '#fff',
              color: '#000', borderRadius: 12, padding: '13px 0',
              fontSize: 14, fontWeight: 700, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
              transition: 'opacity 140ms',
            }}>
            {loading
              ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Processing…</>
              : <><Zap style={{ width: 14, height: 14 }} fill="black" /> Pay ₹{plan.price} via PayU</>
            }
          </button>
          <button onClick={onClose}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 0', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', width: '100%', transition: 'all 140ms' }}>
            Continue with Free
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
            Secure payment via PayU · Cancel anytime · No hidden fees
          </p>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
