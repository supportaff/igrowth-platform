import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — iGrowth',
  description: 'How iGrowth collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">iGrowth</span>
          </Link>
          <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: April 23, 2026</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you create an account or use iGrowth, we collect the following types of information:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li><strong className="text-white/80">Account information</strong> — name, email address, and password when you sign up.</li>
              <li><strong className="text-white/80">Instagram account data</strong> — username, profile details, DMs, comments, and follower metadata accessed via the Meta/Instagram API, only with your explicit authorization.</li>
              <li><strong className="text-white/80">Usage data</strong> — how you interact with the platform (pages visited, features used, automation runs).</li>
              <li><strong className="text-white/80">Payment information</strong> — processed securely through our payment provider (Razorpay/PayU). We do not store card numbers on our servers.</li>
              <li><strong className="text-white/80">Device & browser data</strong> — IP address, browser type, and operating system for security and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>To provide and improve the iGrowth platform and its features.</li>
              <li>To power your automation flows, CRM, and content analytics.</li>
              <li>To send transactional emails (account alerts, billing receipts).</li>
              <li>To detect and prevent fraud, abuse, or policy violations.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-3">We <strong className="text-white/80">do not sell</strong> your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Instagram & Meta API Data</h2>
            <p className="mb-3">iGrowth uses the Meta (Instagram) API to access your account. By connecting your account, you authorize us to:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Read and send DMs on your behalf (only as directed by your automations).</li>
              <li>Access comment data on your posts for trigger-based automation.</li>
              <li>Read basic profile and follower information for CRM features.</li>
            </ul>
            <p className="mt-3">We comply fully with <a href="https://developers.facebook.com/policy/" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Meta Platform Policy</a>. You can revoke access at any time from your Instagram settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies</h2>
            <p>We use essential cookies for authentication and session management, and optional analytics cookies to understand usage patterns. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Security</h2>
            <p>We use industry-standard encryption (TLS/HTTPS), secure token storage, and regular security audits to protect your data. Access to user data is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict processing of your data.</li>
              <li>Data portability (export your data).</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:privacy@igrowth.app" className="text-brand-400 hover:underline">privacy@igrowth.app</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Services</h2>
            <p>iGrowth integrates with third-party services including Meta/Instagram API, Razorpay/PayU (payments), and Supabase (database). Each service has its own privacy policy and we recommend reviewing them.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use of iGrowth after changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-xl text-sm">
              <p>📧 <a href="mailto:privacy@igrowth.app" className="text-brand-400 hover:underline">privacy@igrowth.app</a></p>
              <p className="mt-1">🏢 iGrowth, Chennai, Tamil Nadu, India</p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm text-white/40">
          <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
        </div>
      </main>
    </div>
  )
}
