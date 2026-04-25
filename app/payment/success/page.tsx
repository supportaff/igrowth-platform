'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [checking, setChecking] = useState(true)
  const [planName, setPlanName] = useState('')

  useEffect(() => {
    // Give webhook 2s to process then redirect
    const txnid   = params.get('txnid') ?? ''
    const product = params.get('productinfo') ?? ''
    if (product) setPlanName(product.replace('iGrowth ', ''))
    const t = setTimeout(() => {
      setChecking(false)
    }, 2000)
    return () => clearTimeout(t)
  }, [params])

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        {checking ? (
          <>
            <Loader2 style={{ width: 40, height: 40, color: '#fff', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>Confirming your payment…</p>
          </>
        ) : (
          <>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle style={{ width: 38, height: 38, color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 10 }}>Payment successful!</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {planName ? `Your iGrowth ${planName} plan is now active.` : 'Your plan has been upgraded.'}<br />
              Welcome to the next level of creator growth.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Go to Dashboard <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
