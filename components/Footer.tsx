import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#1a1f26', borderTop: '1px solid rgba(238,238,238,0.07)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#00ADB5', borderRadius: 8, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 13, height: 13, color: '#fff' }} fill="white" />
          </div>
          <span style={{ fontWeight: 800, color: '#EEEEEE', fontSize: 15 }}>Afforal</span>
        </Link>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`}
              style={{ color: 'rgba(238,238,238,0.35)', fontSize: 13, transition: 'color 160ms' }}
              className="hover:text-[#00ADB5]">
              {l}
            </Link>
          ))}
        </div>

        <p style={{ color: 'rgba(238,238,238,0.25)', fontSize: 12 }}>
          © {new Date().getFullYear()} Afforal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
