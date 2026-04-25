'use client'
import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
    }}>
      <a href="/" style={{
        position: 'absolute', top: '24px', left: '32px',
        color: '#737373', textDecoration: 'none', fontSize: '14px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>← Back to home</a>

      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{ width: 32, height: 32, background: '#0a0a0a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 10l-4 2.5 1.5-4.5L2 5.5h4.5L8 1z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '22px', color: '#0a0a0a', letterSpacing: '-0.5px' }}>Afforal</span>
        </div>
        <p style={{ color: '#737373', fontSize: '14px' }}>Create your free account</p>
      </div>

      <SignUp routing="hash" afterSignUpUrl="/dashboard" signInUrl="/login" />
    </main>
  )
}
