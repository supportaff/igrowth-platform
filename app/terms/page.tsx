import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — iGrowth',
  description: 'Terms and conditions for using the iGrowth platform.',
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold mb-3">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: April 23, 2026</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using iGrowth ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users including creators, businesses, and agencies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="mb-3">iGrowth is an Instagram growth and revenue platform that provides:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>DM automation and conversation flow tools</li>
              <li>Follower CRM and lead management</li>
              <li>Content-to-conversion analytics</li>
              <li>Smart link delivery and tracking</li>
              <li>Revenue and order tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Account Registration</h2>
            <p className="mb-3">To use iGrowth, you must:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Be at least 18 years old or have parental consent.</li>
              <li>Provide accurate and complete registration information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <p className="mt-3">You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Instagram & Meta Platform Compliance</h2>
            <p className="mb-3">By connecting your Instagram account, you agree to:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Use iGrowth only with accounts you own or are authorized to manage.</li>
              <li>Comply with <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Instagram Community Guidelines</a> and <a href="https://developers.facebook.com/policy/" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Meta Platform Policy</a>.</li>
              <li>Not use automation to spam, harass, or mislead users.</li>
              <li>Not use the platform to send unsolicited bulk messages.</li>
            </ul>
            <p className="mt-3">iGrowth is designed to operate within Meta's API rate limits and guidelines. Users who violate platform policies risk account suspension by both iGrowth and Meta/Instagram.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Prohibited Uses</h2>
            <p className="mb-3">You may not use iGrowth to:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Send spam, phishing messages, or deceptive content.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe on intellectual property rights of others.</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the platform.</li>
              <li>Resell or sublicense access without written permission.</li>
              <li>Use the platform for any illegal commercial activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Subscription & Payments</h2>
            <p className="mb-3">Paid plans are billed monthly or annually. By subscribing, you authorize iGrowth to charge your payment method on a recurring basis.</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li><strong className="text-white/80">Cancellation:</strong> You may cancel at any time. Access continues until the end of your billing period.</li>
              <li><strong className="text-white/80">Refunds:</strong> Refunds are provided within 7 days of purchase if the service is materially non-functional. No refunds are provided for partial months.</li>
              <li><strong className="text-white/80">Price changes:</strong> We will notify you at least 30 days before any price increase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
            <p>iGrowth and its content (logos, designs, code, copy) are owned by iGrowth and protected by applicable intellectual property laws. You retain ownership of content you create using the platform. By using iGrowth, you grant us a limited license to process your Instagram data solely to provide the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Disclaimers & Limitation of Liability</h2>
            <p className="mb-3">iGrowth is provided "as is" without warranties of any kind. We do not guarantee:</p>
            <ul className="space-y-2 list-disc list-inside text-white/60">
              <li>Uninterrupted or error-free service.</li>
              <li>Specific results from using automation or CRM features.</li>
              <li>Compatibility with future Instagram/Meta API changes.</li>
            </ul>
            <p className="mt-3">To the maximum extent permitted by law, iGrowth's liability is limited to the amount you paid in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in abuse, or cause harm to other users — without prior notice. You may also terminate your account at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu, India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <p>For questions about these Terms, contact us:</p>
            <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-xl text-sm">
              <p>📧 <a href="mailto:legal@igrowth.app" className="text-brand-400 hover:underline">legal@igrowth.app</a></p>
              <p className="mt-1">🏢 iGrowth, Chennai, Tamil Nadu, India</p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm text-white/40">
          <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
        </div>
      </main>
    </div>
  )
}
