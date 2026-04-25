'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router  = useRouter()
  const params  = useSearchParams()
  const billing = params.get('billing') ?? 'monthly'
  const plan    = params.get('plan')    ?? 'pro'
  const [seconds, setSeconds] = useState(5)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    // Allow webhook 1s head-start then count down
    const init = setTimeout(() => setReady(true), 1000)
    return () => clearTimeout(init)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (seconds <= 0) { router.push('/dashboard'); return }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [ready, seconds, router])

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 36, height: 36, color: 'rgba(255,255,255,0.4)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle style={{ width: 40, height: 40, color: '#fff' }} />
        </div>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 99, padding: '5px 14px', marginBottom: 18 }}>
          <Sparkles style={{ width: 11, height: 11, color: '#fff' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>iGrowth Pro Activated</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
          Payment successful! 🎉
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
          Your <strong style={{ color: '#fff' }}>Pro plan</strong> is now active.
          {billing === 'annual' ? ' You\'re billed annually — best value.' : ' You\'re billed monthly.'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
          Unlimited DMs, contacts, automations, and brand deals are unlocked.
        </p>

        {/* Features unlocked */}
        <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px', marginBottom: 28, textAlign: 'left' }}>
          {[
            '✓  Unlimited DMs every month',
            '✓  Unlimited contacts',
            '✓  Unlimited automations',
            '✓  Unlimited brand deals',
            '✓  Content insights: last 90 days',
          ].map(f => (
            <p key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{f}</p>
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Go to Dashboard <ArrowRight style={{ width: 15, height: 15 }} />
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          Redirecting automatically in {seconds}s…
        </p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
