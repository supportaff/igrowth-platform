import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold gradient-text">iGrowth</span>
            <span className="text-white/30 text-sm ml-2">Instagram Growth &amp; Revenue Platform</span>
          </Link>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
            <a href="mailto:support@igrowth.app" className="hover:text-white/70 transition-colors">Support</a>
          </div>
          <p className="text-white/30 text-sm">&copy; 2026 iGrowth. Made for creators.</p>
        </div>
      </div>
    </footer>
  )
}
