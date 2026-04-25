'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccess() {
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'pro'

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <CheckCircle style={{ width: 56, height: 56, color: '#16a34a', marginBottom: 20 }} />
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
        Payment Successful!
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 400, marginBottom: 32 }}>
        Your <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{plan}</strong> plan is now active.
        All features have been unlocked.
      </p>
      <Link
        href="/dashboard"
        style={{
          background: '#fff', color: '#000',
          borderRadius: 10, padding: '12px 28px',
          fontWeight: 700, fontSize: 14, textDecoration: 'none',
        }}>
        Go to Dashboard →
      </Link>
    </div>
  )
}
