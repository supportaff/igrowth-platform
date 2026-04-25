import Link from 'next/link'

const C = {
  bg: '#000000', bg2: '#0a0a0a', card: '#111111',
  border: 'rgba(255,255,255,0.08)', text: '#ffffff',
  textMd: 'rgba(255,255,255,0.62)', textSm: 'rgba(255,255,255,0.38)',
}

export const metadata = { title: 'Terms of Service – iGrowth', description: 'iGrowth Terms of Service' }

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      body: `By creating an account or accessing iGrowth ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all users, including free and paid subscribers.`,
    },
    {
      title: '2. Description of Service',
      body: `iGrowth provides an Instagram automation platform that enables users to automate direct messages, capture leads, manage brand deals, and schedule content using Meta's official Instagram Graph API. The Service requires a connected Instagram Business or Creator account.`,
    },
    {
      title: '3. Eligibility',
      body: `You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use iGrowth. By using the Service, you represent and warrant that you meet these requirements. The Service is intended for use in India and other jurisdictions where Instagram Business API access is permitted.`,
    },
    {
      title: '4. Account Registration',
      body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. You are solely responsible for all activities that occur under your account. Notify us immediately at hello@igrowth.app if you suspect any unauthorised access.`,
    },
    {
      title: '5. Subscription & Billing',
      body: `iGrowth offers a Free plan and a Pro plan (₹399/account/month, billed annually) and Enterprise plans with custom pricing. All prices are in Indian Rupees (INR) and exclusive of applicable GST. Paid plans renew automatically unless cancelled before the renewal date. Refunds are not provided for partial billing periods. You may downgrade or cancel at any time from your account settings.`,
    },
    {
      title: '6. Acceptable Use',
      body: `You agree not to use iGrowth to send spam, harass users, violate Meta's Platform Policies, or engage in any activity that is unlawful, fraudulent, or harmful. Automated messages must comply with applicable Indian law including the Information Technology Act, 2000 and any applicable Telecom Regulatory Authority of India (TRAI) regulations. iGrowth reserves the right to suspend accounts that violate these requirements without notice.`,
    },
    {
      title: '7. API Compliance',
      body: `iGrowth operates exclusively via Meta's official Instagram Graph API. Users must maintain compliance with Meta's Terms of Service and Community Standards at all times. iGrowth is not responsible for account restrictions imposed by Meta as a result of your content or usage patterns.`,
    },
    {
      title: '8. Intellectual Property',
      body: `All rights, title, and interest in and to the iGrowth platform, including its design, software, trademarks, and content, are owned by or licensed to iGrowth. You retain ownership of your own content and data. You grant iGrowth a limited, non-exclusive licence to use your data solely to operate and improve the Service.`,
    },
    {
      title: '9. Limitation of Liability',
      body: `To the maximum extent permitted by law, iGrowth shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits or data. Our total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid to iGrowth in the 12 months preceding the claim.`,
    },
    {
      title: '10. Termination',
      body: `iGrowth may suspend or terminate your account at any time for violation of these Terms, with or without notice. Upon termination, your right to use the Service ceases immediately. You may delete your account at any time via your account settings page.`,
    },
    {
      title: '11. Governing Law',
      body: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of courts located in Chennai, Tamil Nadu.`,
    },
    {
      title: '12. Changes to Terms',
      body: `We may update these Terms from time to time. We will notify you of material changes via email or an in-app notification. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.`,
    },
    {
      title: '13. Contact',
      body: `For questions about these Terms, please contact us at hello@igrowth.app or write to us at: iGrowth, Chennai, Tamil Nadu, India.`,
    },
  ]

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', lineHeight: 1.7 }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '0 clamp(16px,4vw,48px)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg2 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: C.text }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#fff"/>
            <circle cx="16" cy="16" r="6" stroke="#000" strokeWidth="2.4" fill="none"/>
            <circle cx="22.5" cy="9.5" r="1.6" fill="#000"/>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>iGrowth</span>
        </Link>
        <Link href="/privacy" style={{ color: C.textMd, textDecoration: 'none', fontSize: 14 }}>Privacy Policy</Link>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,48px)' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', color: C.textSm, textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 14 }}>Terms of Service</h1>
          <p style={{ color: C.textMd, fontSize: 15 }}>Last updated: April 25, 2026 &nbsp;·&nbsp; Effective immediately</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {sections.map(sec => (
            <section key={sec.title}>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{sec.title}</h2>
              <p style={{ color: C.textMd, fontSize: 14.5, lineHeight: 1.85 }}>{sec.body}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Back to Home</Link>
          <Link href="/privacy" style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Privacy Policy →</Link>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  )
}
