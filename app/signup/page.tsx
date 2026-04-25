'use client'
import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
    }}>
      {/* Back to home */}
      <a href="/" style={{
        position: 'absolute',
        top: '24px',
        left: '32px',
        color: 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>← Back to home</a>

      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#E1306C"/>
            <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="22.5" cy="9.5" r="1.5" fill="white"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '22px', color: '#fff', letterSpacing: '-0.5px' }}>iGrowth</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Create your free account</p>
      </div>

      <SignUp
        routing="hash"
        afterSignUpUrl="/dashboard"
        signInUrl="/login"
      />
    </main>
  )
}
