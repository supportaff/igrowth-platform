import Link from 'next/link'

const C = {
  bg: '#000000', bg2: '#0a0a0a', card: '#111111',
  border: 'rgba(255,255,255,0.08)', text: '#ffffff',
  textMd: 'rgba(255,255,255,0.62)', textSm: 'rgba(255,255,255,0.38)',
}

export const metadata = { title: 'Privacy Policy – iGrowth', description: 'iGrowth Privacy Policy' }

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Introduction',
      body: `iGrowth ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, how we share it, and your rights under applicable Indian law, including the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology (Amendment) Act, 2008.`,
    },
    {
      title: '2. Information We Collect',
      body: `We collect information you provide directly (name, email address, payment information), information from your connected Instagram Business account (profile data, follower/engagement metrics, DM interactions via Meta API), usage data (pages visited, features used, timestamps), and technical data (IP address, browser type, device identifiers). We do not collect or store Instagram account passwords.`,
    },
    {
      title: '3. How We Use Your Information',
      body: `We use your information to: provide and operate the Service; process payments and subscriptions; send transactional emails and product notifications; analyse usage to improve the platform; respond to support enquiries; and comply with legal obligations. We do not sell your personal data to third parties.`,
    },
    {
      title: '4. Meta API Data',
      body: `iGrowth accesses your Instagram data solely via Meta's official Graph API with permissions you explicitly grant during the OAuth flow. Data retrieved from Instagram (messages, contact interactions, analytics) is stored securely and used only to operate the automation and CRM features of the Service. We comply with Meta's Platform Terms and Developer Policies at all times.`,
    },
    {
      title: '5. Cookies & Tracking',
      body: `We use strictly necessary cookies to maintain your session and authentication state. We may use analytics cookies (e.g., aggregated, anonymised usage data) to improve the product. We do not use advertising or behavioural tracking cookies. You may disable non-essential cookies via your browser settings without affecting core functionality.`,
    },
    {
      title: '6. Data Sharing',
      body: `We share your data with: payment processors (e.g., Razorpay/PayU) to handle transactions; cloud infrastructure providers (e.g., Supabase, Vercel) under strict data processing agreements; Meta Platforms Inc. as required to operate the Instagram API integration. All third-party processors are contractually bound to protect your data and not use it for independent purposes.`,
    },
    {
      title: '7. Data Retention',
      body: `We retain your account data for as long as your account is active or as needed to provide the Service. Upon account deletion, we delete or anonymise your personal data within 30 days, except where retention is required by applicable law (e.g., financial records for 7 years under Indian tax law).`,
    },
    {
      title: '8. Your Rights',
      body: `Under the DPDP Act 2023, you have the right to: access a summary of your personal data held by us; correct inaccurate data; erase your data ("right to be forgotten"); withdraw consent at any time; and nominate a person to exercise these rights on your behalf. To exercise these rights, contact us at hello@igrowth.app.`,
    },
    {
      title: '9. Security',
      body: `We implement industry-standard security measures including encryption in transit (TLS 1.3), encryption at rest, access controls, and regular security audits. However, no system is completely secure. If you suspect a security incident involving your account, contact us immediately at hello@igrowth.app.`,
    },
    {
      title: '10. Children\'s Privacy',
      body: `The Service is not directed to individuals under 18 years of age. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a minor, please contact us and we will delete it promptly.`,
    },
    {
      title: '11. International Transfers',
      body: `Your data may be processed outside India by our cloud providers (e.g., servers in the United States or European Union). Where such transfers occur, we ensure appropriate safeguards are in place consistent with the DPDP Act and applicable cross-border transfer requirements.`,
    },
    {
      title: '12. Changes to This Policy',
      body: `We may update this Privacy Policy periodically. Material changes will be communicated via email or an in-app notice at least 14 days before they take effect. Your continued use of the Service after the effective date constitutes acceptance of the updated policy.`,
    },
    {
      title: '13. Contact & Grievance Officer',
      body: `For privacy-related queries, requests, or grievances, please contact our Data Protection Officer at hello@igrowth.app. We will respond to all requests within 30 days. Postal address: iGrowth, Chennai, Tamil Nadu, India.`,
    },
  ]

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', lineHeight: 1.7 }}>
      <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '0 clamp(16px,4vw,48px)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg2 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: C.text }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#fff"/>
            <circle cx="16" cy="16" r="6" stroke="#000" strokeWidth="2.4" fill="none"/>
            <circle cx="22.5" cy="9.5" r="1.6" fill="#000"/>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>iGrowth</span>
        </Link>
        <Link href="/terms" style={{ color: C.textMd, textDecoration: 'none', fontSize: 14 }}>Terms of Service</Link>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,48px)' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', color: C.textSm, textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 14 }}>Privacy Policy</h1>
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
          <Link href="/terms" style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Terms of Service →</Link>
        </div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  )
}
