'use client'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()
  const lastUpdated = 'April 25, 2026'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 lg:px-8">
          <button className="text-xl font-extrabold text-black tracking-tight" onClick={() => router.push('/')}>iGrowth</button>
          <button className="text-sm text-gray-500 hover:text-black transition-colors" onClick={() => router.push('/')}>← Back to home</button>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-black">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black mb-3">1. Introduction</h2>
            <p>iGrowth (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights. By using iGrowth, you agree to this policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">2. Data We Collect</h2>
            <div className="space-y-4">
              <div><h3 className="font-semibold text-gray-900 mb-1">Account Data</h3><p>Name, email address, profile picture, and niche — collected when you sign up via Google OAuth.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Instagram Data</h3><p>When you connect your Instagram account, we access: your Instagram username and profile, direct messages (to power automation), media posts and reels (for content analytics), audience insights (for brand deal pitching), and your access token (stored encrypted).</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Usage Data</h3><p>Pages visited, features used, timestamps, and error logs — used to improve the Service and troubleshoot issues.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Billing Data</h3><p>Subscription plan, transaction history, and invoices. We do not store raw payment card numbers — all payments are processed via our payment provider.</p></div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and operate the Service, including DM automation, brand deal management, and analytics.</li>
              <li>To send transactional emails (account activity, billing receipts, token expiry warnings).</li>
              <li>To improve the Service based on usage patterns (aggregated, anonymised).</li>
              <li>To comply with legal obligations.</li>
              <li>We do not sell your personal data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">4. Instagram Data Usage</h2>
            <p>We access Instagram data solely to provide the features you request. We do not use Instagram data for advertising profiling or share it with third parties beyond what is necessary to operate the Service. We comply with Meta&apos;s Platform Policies at all times. Instagram access tokens are encrypted at rest and auto-refreshed using Instagram&apos;s token refresh mechanism.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">5. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, we delete all associated personal data within 30 days. Some data may be retained longer as required by law or for fraud prevention.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">6. Data Security</h2>
            <p>We use industry-standard encryption (TLS in transit, AES-256 at rest) to protect your data. Access tokens are encrypted before storage. We conduct regular security reviews and never log sensitive credentials in plain text.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">7. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services to operate iGrowth:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google OAuth</strong> — for authentication.</li>
              <li><strong>Meta / Instagram Graph API</strong> — for Instagram data access.</li>
              <li><strong>Payment Gateway</strong> — for billing and subscription management.</li>
              <li><strong>Supabase</strong> — for hosting and data storage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">8. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access</strong> — request a copy of your personal data.</li>
              <li><strong>Correction</strong> — update inaccurate or incomplete data.</li>
              <li><strong>Deletion</strong> — delete your account and all associated data.</li>
              <li><strong>Portability</strong> — export your data in a machine-readable format.</li>
              <li><strong>Withdraw consent</strong> — disconnect Instagram or revoke Google OAuth at any time.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:support@afforal.com" className="text-black underline font-medium">support@afforal.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">9. Cookies</h2>
            <p>We use cookies and similar technologies for session management and authentication. We do not use third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">10. Children&apos;s Privacy</h2>
            <p>The Service is not directed to children under 18 years of age. We do not knowingly collect data from minors.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">11. Changes to this Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">12. Contact Us</h2>
            <p>For any privacy-related questions, contact us at: <a href="mailto:support@afforal.com" className="text-black underline font-medium">support@afforal.com</a></p>
          </section>
        </div>
      </main>

      <footer className="mt-10 border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2026 iGrowth · <a href="mailto:support@afforal.com" className="hover:text-black transition-colors">support@afforal.com</a>
      </footer>
    </div>
  )
}
