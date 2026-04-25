'use client'
import { useRouter } from 'next/navigation'
import { XCircle, RefreshCw } from 'lucide-react'

export default function PaymentFailedPage() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <XCircle style={{ width: 38, height: 38, color: '#f87171' }} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 10 }}>Payment failed</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          Your payment could not be processed.<br />
          No amount was charged. Please try again.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Try again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Back to dashboard
          </button>
        </div>
        <p style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Need help? Email <a href="mailto:support@afforal.com" style={{ color: 'rgba(255,255,255,0.4)' }}>support@afforal.com</a></p>
      </div>
    </div>
  )
}
