'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react'

export default function PaymentFailedPage() {
  const router = useRouter()
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'Your payment was not completed.'

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>

        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <XCircle style={{ width: 40, height: 40, color: '#f87171' }} />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>Payment failed</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
          {decodeURIComponent(reason)}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 32 }}>
          No amount was charged. You can try again anytime.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Try again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to dashboard
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          Need help? Email{' '}
          <a href="mailto:support@afforal.com" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>support@afforal.com</a>
        </p>
      </div>
    </div>
  )
}
