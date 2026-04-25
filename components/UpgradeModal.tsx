'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { X, Check, Crown, Zap, Loader2 } from 'lucide-react'
import { PRICING, type PricingOption } from '@/lib/plans'

const FEATURES = [
  'Unlimited DMs every month',
  'Unlimited contacts',
  'Unlimited automations',
  'Unlimited brand deals',
  'Full contact CRM',
  'Collab planner (unlimited)',
  'Content insights: last 90 days',
  'Audience demographics',
  'Priority support',
]

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useUser()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const price: PricingOption = PRICING[billing]

  const handleUpgrade = async () => {
    setError('')
    setLoading(true)
    try {
      const email = user?.emailAddresses?.[0]?.emailAddress ?? ''
      const name  = user?.firstName
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : email.split('@')[0]

      const res = await fetch('/api/payment/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId:   price.planId,
          billing:  price.billing,
          amount:   price.totalAmount,
          planName: 'iGrowth Pro',
          userId:   user?.id ?? '',
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

      // Build hidden form and POST to PayU gateway
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.payuUrl
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type  = 'hidden'
        input.name  = k
        input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch {
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
        borderRadius: 20, width: '100%', maxWidth: 460,
        boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#fff', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown style={{ width: 16, height: 16, color: '#000' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Upgrade to Pro</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Unlock everything — no limits</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Close"><X style={{ width: 15, height: 15 }} /></button>
        </div>

        {/* Billing toggle */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, gap: 4 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 9, border: 'none',
                  background: billing === b ? '#fff' : 'transparent',
                  color: billing === b ? '#000' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 140ms', fontFamily: 'inherit',
                  position: 'relative',
                }}>
                {b === 'monthly' ? 'Monthly' : 'Annual'}
                {b === 'annual' && (
                  <span style={{
                    position: 'absolute', top: -8, right: 4,
                    background: '#22c55e', color: '#fff', fontSize: 9, fontWeight: 700,
                    padding: '2px 6px', borderRadius: 99, letterSpacing: '0.05em',
                  }}>SAVE 14%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price card */}
        <div style={{ padding: '14px 24px 0' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#000', letterSpacing: '-2px' }}>
                  ₹{price.amount}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
                {billing === 'annual' ? 'Billed ₹3,588 once a year' : 'Billed every month'}
              </p>
            </div>
            <div style={{ background: '#000', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', padding: '5px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap style={{ width: 9, height: 9 }} fill="white" /> PRO
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '16px 24px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Everything in Pro</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURES.map(f => (
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
          <div style={{ margin: '0 24px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#f87171', fontSize: 13, marginBottom: 8 }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: '4px 24px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleUpgrade} disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: loading ? 'rgba(255,255,255,0.5)' : '#fff',
              color: '#000', borderRadius: 12, padding: '13px 0',
              fontSize: 14, fontWeight: 700, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
              transition: 'opacity 140ms', fontFamily: 'inherit',
            }}>
            {loading
              ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Processing…</>
              : <><Zap style={{ width: 14, height: 14 }} fill="black" />
                  Pay ₹{billing === 'annual' ? '3,588' : price.totalAmount} via PayU
                </>
            }
          </button>
          <button onClick={onClose}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 0', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
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
