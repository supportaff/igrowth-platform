import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default function Home() {
  const { userId } = auth()
  if (userId) redirect('/dashboard')

  // Show landing page for unauthenticated users
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#E1306C"/>
            <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="22.5" cy="9.5" r="1.5" fill="white"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>iGrowth</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '15px',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'color 0.2s',
          }}>Sign in</Link>
          <Link href="/signup" style={{
            background: '#E1306C',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 600,
            padding: '9px 20px',
            borderRadius: '8px',
          }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(225,48,108,0.12)',
          border: '1px solid rgba(225,48,108,0.3)',
          color: '#E1306C',
          fontSize: '13px',
          fontWeight: 600,
          padding: '6px 16px',
          borderRadius: '99px',
          marginBottom: '28px',
          letterSpacing: '0.5px',
        }}>Instagram Automation Platform</div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '24px',
          maxWidth: '800px',
        }}>
          Grow your Instagram
          <span style={{ color: '#E1306C' }}> on autopilot</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          Automate DM replies, capture leads, and engage your followers 24/7 — without lifting a finger.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" style={{
            background: '#E1306C',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 700,
            padding: '14px 32px',
            borderRadius: '10px',
          }}>Start for free →</Link>
          <Link href="/login" style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 600,
            padding: '14px 32px',
            borderRadius: '10px',
          }}>Sign in</Link>
        </div>

        {/* Feature Pills */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '60px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['DM Automation', 'Keyword Triggers', 'Lead Capture', 'Auto-Reply', 'Analytics'].map(f => (
            <span key={f} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              padding: '6px 14px',
              borderRadius: '99px',
            }}>{f}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '13px',
      }}>
        © 2026 iGrowth · <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy</Link> · <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</Link>
      </footer>
    </main>
  )
}
