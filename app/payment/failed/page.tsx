'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentFailed() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'Your payment could not be processed.'

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <XCircle style={{ width: 56, height: 56, color: '#dc2626', marginBottom: 20 }} />
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
        Payment Failed
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 400, marginBottom: 32 }}>
        {decodeURIComponent(reason)}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link
          href="/#pricing"
          style={{
            background: '#fff', color: '#000',
            borderRadius: 10, padding: '12px 24px',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>Try Again</Link>
        <Link
          href="/dashboard"
          style={{
            border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)',
            borderRadius: 10, padding: '12px 24px',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>Back to Dashboard</Link>
      </div>
    </div>
  )
}
