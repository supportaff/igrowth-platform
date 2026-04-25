'use client'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold text-black">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using iGrowth (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">2. Description of Service</h2>
            <p>iGrowth is an Instagram creator management platform that helps creators automate Instagram DMs, manage brand deals, track collaborations, and analyse content performance. The Service uses Instagram&apos;s official Graph API and operates in compliance with Meta&apos;s Platform Policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">3. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years of age to use this Service.</li>
              <li>You must have a valid Instagram Business or Creator account to access all features.</li>
              <li>By using the Service you represent that you have the legal authority to agree to these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">4. Account Registration</h2>
            <p>You must create an account to use iGrowth. You agree to provide accurate, current, and complete information during registration. Notify us immediately at <a href="mailto:support@afforal.com" className="text-black underline font-medium">support@afforal.com</a> if you suspect any unauthorised access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">5. Instagram Integration</h2>
            <p>By connecting your Instagram account, you authorise iGrowth to access certain data through Instagram&apos;s API. You remain responsible for your Instagram account and all content posted thereon. iGrowth will never post content on your behalf without your explicit instruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">6. Acceptable Use</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable law or regulation, including Meta&apos;s Platform Policies.</li>
              <li>Send spam, unsolicited messages, or abusive content.</li>
              <li>Reverse engineer, scrape, or attempt to extract underlying code or data.</li>
              <li>Circumvent usage limits or access controls.</li>
              <li>Impersonate another person or entity.</li>
              <li>Upload or transmit viruses or malicious code.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">7. Subscription and Billing</h2>
            <p>iGrowth offers free and paid subscription plans. Paid plans are billed monthly or annually as selected. All prices are in Indian Rupees (INR). Subscription fees are non-refundable except as required by law. You may cancel your subscription at any time; access continues until the end of the current billing period. We reserve the right to modify pricing with 30 days&apos; advance notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">8. Intellectual Property</h2>
            <p>All content, features, and functionality of the Service are owned by iGrowth / Afforal and are protected by applicable intellectual property laws. You retain all rights to your own content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">9. Disclaimers</h2>
            <p>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind. We are not responsible for Instagram API changes, downtime, or data loss caused by Instagram or Meta.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, iGrowth shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total aggregate liability shall not exceed the amounts paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">11. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitute your acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">13. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">14. Contact</h2>
            <p>For questions about these Terms: <a href="mailto:support@afforal.com" className="text-black underline font-medium">support@afforal.com</a></p>
          </section>
        </div>
      </main>

      <footer className="mt-10 border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2026 iGrowth · <a href="mailto:support@afforal.com" className="hover:text-black transition-colors">support@afforal.com</a>
      </footer>
    </div>
  )
}
