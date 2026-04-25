'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg:        '#0a0a0a',
  bg2:       '#111111',
  card:      '#161616',
  border:    'rgba(255,255,255,0.08)',
  borderHov: 'rgba(255,255,255,0.20)',
  accent:    '#ffffff',
  accentDim: 'rgba(255,255,255,0.06)',
  accentDimHov: 'rgba(255,255,255,0.10)',
  text:      '#ffffff',
  textMd:    'rgba(255,255,255,0.65)',
  textSm:    'rgba(255,255,255,0.40)',
  textXs:    'rgba(255,255,255,0.25)',
  highlight: '#ffffff',   // CTA primary bg
  hlText:    '#0a0a0a',   // text on white button
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, v }
}

const fadeUp = (v: boolean, delay = 0): React.CSSProperties => ({
  opacity: v ? 1 : 0,
  transform: v ? 'translateY(0)' : 'translateY(24px)',
  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
})

// ─── Reusable pill label ──────────────────────────────────────────────────────
function Label({ children }: { children: string }) {
  return (
    <div style={{ display: 'inline-block', background: C.accentDim, border: `1px solid ${C.border}`, borderRadius: 99, padding: '5px 14px', marginBottom: 18 }}>
      <span style={{ color: C.textMd, fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>{children}</span>
    </div>
  )
}

// ─── Check icon ──────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.25)" />
      <path d="M4.5 7l2 2 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const s = {
    hero:         useInView(0.05),
    features:     useInView(),
    howItWorks:   useInView(),
    pricing:      useInView(),
    testimonials: useInView(),
    faq:          useInView(),
    contact:      useInView(),
  }

  const navLinks = [['#features','Features'],['#how-it-works','How it works'],['#pricing','Pricing'],['#faq','FAQ'],['#contact','Contact']]

  const features = [
    { icon: '⚡', title: 'Keyword DM Automation', desc: 'Trigger instant DM replies when followers comment specific keywords on your posts or reels.' },
    { icon: '🎯', title: 'Smart Lead Capture', desc: 'Automatically collect names, emails and phone numbers from conversations into your CRM.' },
    { icon: '🔁', title: 'Story Reply Flows', desc: 'When followers react to your stories, auto-send personalised follow-up sequences.' },
    { icon: '👥', title: 'New Follower Welcome', desc: 'Greet every new follower with a warm automated DM introducing your brand or offer.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track open rates, reply rates, lead conversions and automation performance in real time.' },
    { icon: '🔗', title: 'Brand Deals CRM', desc: 'Capture, track and manage brand collaborations from first contact to final payment.' },
  ]

  const steps = [
    { n: '01', title: 'Connect Instagram', desc: 'Link your Instagram Business account via secure Facebook OAuth in under 60 seconds.' },
    { n: '02', title: 'Build Automations', desc: 'Pick a trigger — keyword, new follower, story reply — set conditions and actions.' },
    { n: '03', title: 'Go Live & Grow', desc: 'Activate and watch leads, replies and revenue happen automatically 24/7.' },
  ]

  const plans = [
    {
      name: 'Starter',
      desc: 'Try iGrowth risk-free. No credit card needed.',
      monthly: 0, annual: 0,
      popular: false,
      badge: null,
      features: [
        '1 Instagram account',
        '100 DMs / month',
        '200 contacts',
        '1 active automation',
        'Basic keyword triggers',
        'Profile insights',
        'Community support',
      ],
      cta: 'Start for Free', href: '/signup',
    },
    {
      name: 'Pro',
      desc: 'For creators ready to turn followers into revenue.',
      monthly: 299, annual: 239,
      popular: true,
      badge: '40% cheaper than competitors',
      features: [
        '3 Instagram accounts',
        '5,000 DMs / month',
        'Unlimited contacts',
        '10 active automations',
        'Keyword + story reply triggers',
        'New follower welcome DMs',
        'Lead capture (name, email, phone)',
        'Brand deals CRM (10 active deals)',
        'Content → conversion analytics',
        'Email support',
      ],
      cta: 'Start Pro Plan', href: '/signup?plan=pro',
    },
    {
      name: 'Business',
      desc: 'Unlimited everything for serious creators and brands.',
      monthly: 499, annual: 399,
      popular: false,
      badge: null,
      features: [
        'Unlimited Instagram accounts',
        'Unlimited DMs',
        'Unlimited contacts',
        'Unlimited automations',
        'All trigger types',
        'Unlimited brand deals',
        'Campaign planner',
        'Re-engagement campaigns',
        'Multi-account management',
        'Priority support + onboarding',
      ],
      cta: 'Start Business Plan', href: '/signup?plan=business',
    },
  ]

  const testimonials = [
    { name: 'Sarah K.', role: 'Beauty Creator · 180K', av: 'SK', quote: 'iGrowth transformed how I handle DMs. I went from missing leads to capturing 200+ emails a week on autopilot.' },
    { name: 'Marcus T.', role: 'Fitness Coach · 95K', av: 'MT', quote: 'The keyword automation is insane. I posted one reel, added a trigger, and woke up to 400 new DM leads.' },
    { name: 'Priya R.', role: 'Design Agency · 12 clients', av: 'PR', quote: 'Managing client accounts from one dashboard saves us 30+ hours a week. Business plan ROI paid for itself day one.' },
    { name: 'Luca B.', role: 'E-commerce Brand · 220K', av: 'LB', quote: 'Our story reply flow alone generates ₹60K/month in sales. Set it up once and it just runs.' },
  ]

  const faqs = [
    { q: 'Do I need an Instagram Business account?', a: 'Yes. iGrowth uses the official Instagram Graph API which requires an Instagram Business or Creator account linked to a Facebook Page. Personal accounts are not supported.' },
    { q: 'Will my account get banned for using automation?', a: "No. iGrowth uses Meta's official API — the same infrastructure Instagram endorses for business tools. We never scrape, inject, or simulate human activity." },
    { q: 'How quickly do automated DMs send?', a: 'Responses are sent within seconds of a trigger event. Your followers experience near-instant replies that feel personal and handcrafted.' },
    { q: "Can I personalise automated messages?", a: 'Absolutely. Use variables like {{name}}, {{username}} to personalise every message. Each DM feels written by you.' },
    { q: 'What happens if I exceed my DM limit?', a: "Automations pause gracefully and you'll receive an email notification. Upgrade at any time to restore full capacity instantly. Business plan users are never throttled." },
    { q: 'Is there a free trial for paid plans?', a: 'Yes. All paid plans come with a 7-day free trial — no credit card required. Cancel anytime before the trial ends.' },
  ]

  const formatINR = (n: number) => n === 0 ? '₹0' : `₹${n.toLocaleString('en-IN')}`

  // ─── Shared styles ───────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '12px 16px', color: C.text, fontSize: 15,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', lineHeight: 1.6 }}>

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: C.text }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#fff"/>
              <circle cx="16" cy="16" r="6" stroke="#0a0a0a" strokeWidth="2.4" fill="none"/>
              <circle cx="22.5" cy="9.5" r="1.6" fill="#0a0a0a"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.5px' }}>iGrowth</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hide-mobile">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}
                style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMd)}>{label}</a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/login" className="hide-mobile"
              style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 14px', borderRadius: 8, transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMd)}>Sign in</Link>
            <Link href="/signup"
              style={{ background: C.highlight, color: C.hlText, textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 8, transition: 'opacity 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Get started</Link>

            {/* Hamburger */}
            <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: 6, marginLeft: 4 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                {menuOpen
                  ? <><path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
                  : <><rect x="2" y="5" width="18" height="1.8" rx="1" fill="currentColor"/><rect x="2" y="10.1" width="18" height="1.8" rx="1" fill="currentColor"/><rect x="2" y="15.2" width="18" height="1.8" rx="1" fill="currentColor"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, padding: '16px clamp(16px,4vw,48px) 24px' }}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', color: C.textMd, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>{label}</a>
            ))}
            <Link href="/login" style={{ display: 'block', color: C.textMd, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0' }}>Sign in</Link>
          </div>
        )}
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%,#000 40%,transparent 100%)', pointerEvents: 'none' }} />

        <div ref={s.hero.ref} style={{ position: 'relative', maxWidth: 760, width: '100%' }}>
          <div style={{ ...fadeUp(s.hero.v, 0) }}>
            <Label>Instagram Automation Platform</Label>
          </div>

          <h1 style={{ ...fadeUp(s.hero.v, 0.08), fontSize: 'clamp(36px,6.5vw,72px)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-2.5px', marginBottom: 22 }}>
            Turn Instagram into your
            <br /><span style={{ color: C.text }}>24/7 sales machine</span>
          </h1>

          <p style={{ ...fadeUp(s.hero.v, 0.16), fontSize: 'clamp(16px,2vw,18px)', color: C.textMd, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>
            Automate DM replies, capture leads, manage brand deals, and engage followers — so you grow while you sleep.
          </p>

          <div style={{ ...fadeUp(s.hero.v, 0.24), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/signup"
              style={{ background: C.highlight, color: C.hlText, textDecoration: 'none', fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 10, transition: 'opacity 0.18s, transform 0.18s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Start for free →
            </Link>
            <a href="#how-it-works"
              style={{ background: C.accentDim, border: `1px solid ${C.border}`, color: C.text, textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '14px 32px', borderRadius: 10, transition: 'background 0.18s, border-color 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accentDimHov; e.currentTarget.style.borderColor = C.borderHov }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accentDim; e.currentTarget.style.borderColor = C.border }}>See how it works</a>
          </div>

          <div style={{ ...fadeUp(s.hero.v, 0.32), display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['10K+', 'Creators using iGrowth'], ['50M+', 'DMs automated'], ['4.9★', 'Average rating']].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px' }}>{n}</div>
                <div style={{ fontSize: 12, color: C.textSm, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div ref={s.features.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={fadeUp(s.features.v, 0)}><Label>Features</Label></div>
            <h2 style={{ ...fadeUp(s.features.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14 }}>Everything you need to automate Instagram</h2>
            <p style={{ ...fadeUp(s.features.v, 0.14), color: C.textMd, fontSize: 16, maxWidth: 460, margin: '0 auto' }}>Powerful tools built for creators, coaches and brands running on Instagram Business.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px,100%), 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={f.title}
                style={{ ...fadeUp(s.features.v, 0.08 + i * 0.06), background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '26px 26px', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.2px' }}>{f.title}</h3>
                <p style={{ color: C.textMd, fontSize: 13.5, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div ref={s.howItWorks.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={fadeUp(s.howItWorks.v, 0)}><Label>How it works</Label></div>
            <h2 style={{ ...fadeUp(s.howItWorks.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Up and running in 3 steps</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((step, i) => (
              <div key={step.n}
                style={{ ...fadeUp(s.howItWorks.v, 0.1 + i * 0.12), display: 'flex', gap: 28, alignItems: 'flex-start', background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '26px 30px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <div style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: C.textXs, letterSpacing: '-2px', minWidth: 52, lineHeight: 1 }}>{step.n}</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 7, letterSpacing: '-0.3px' }}>{step.title}</h3>
                  <p style={{ color: C.textMd, fontSize: 14.5, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div ref={s.pricing.ref} style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={fadeUp(s.pricing.v, 0)}><Label>Pricing</Label></div>
            <h2 style={{ ...fadeUp(s.pricing.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Simple pricing. No surprises.</h2>
            <p style={{ ...fadeUp(s.pricing.v, 0.14), color: C.textMd, fontSize: 15, marginBottom: 6 }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
            <p style={{ ...fadeUp(s.pricing.v, 0.17), color: C.textSm, fontSize: 12.5, marginBottom: 28 }}>All prices in INR (₹) · GST extra if applicable</p>

            {/* Billing Toggle */}
            <div style={{ ...fadeUp(s.pricing.v, 0.2), display: 'inline-flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 99, padding: 3, gap: 3 }}>
              {[['Monthly', false], ['Annual (save 20%)', true]].map(([label, isAnn]) => (
                <button key={String(label)} onClick={() => setAnnual(isAnn as boolean)}
                  style={{ background: annual === isAnn ? '#fff' : 'transparent', color: annual === isAnn ? '#0a0a0a' : C.textMd, border: 'none', borderRadius: 99, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>{label as string}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: 18, alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={plan.name}
                style={{ ...fadeUp(s.pricing.v, 0.1 + i * 0.1), position: 'relative', background: plan.popular ? '#fff' : C.card, border: plan.popular ? '1px solid #fff' : `1px solid ${C.border}`, borderRadius: 18, padding: '30px 26px', display: 'flex', flexDirection: 'column', color: plan.popular ? '#0a0a0a' : C.text }}>

                {plan.popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#0a0a0a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 99, letterSpacing: '1px', whiteSpace: 'nowrap', border: `1px solid ${C.border}` }}>MOST POPULAR</div>
                )}

                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: plan.popular ? 'rgba(0,0,0,0.55)' : C.textMd, fontSize: 13, marginBottom: 22, lineHeight: 1.55 }}>{plan.desc}</div>

                {/* Price */}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-2px' }}>
                    {formatINR(annual ? plan.annual : plan.monthly)}
                  </span>
                  {plan.monthly > 0 && <span style={{ color: plan.popular ? 'rgba(0,0,0,0.45)' : C.textSm, fontSize: 13, marginLeft: 4 }}>/mo</span>}
                </div>

                {annual && plan.monthly > 0 && (
                  <div style={{ color: plan.popular ? '#1a7a3a' : '#5cad7a', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Save ₹{((plan.monthly - plan.annual) * 12).toLocaleString('en-IN')}/year
                  </div>
                )}

                {plan.badge && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#333', fontWeight: 600, marginBottom: 18, width: 'fit-content' }}>
                    🏷️ {plan.badge}
                  </div>
                )}

                {!plan.badge && <div style={{ height: 18 }} />}

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: plan.popular ? 'rgba(0,0,0,0.75)' : C.textMd }}>
                      {plan.popular
                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="7" cy="7" r="6.5" stroke="rgba(0,0,0,0.2)"/><path d="M4.5 7l2 2 3-3" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <Check />}
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}
                  style={{ display: 'block', textAlign: 'center', background: plan.popular ? '#0a0a0a' : C.accentDim, color: plan.popular ? '#fff' : C.text, textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 10, border: plan.popular ? 'none' : `1px solid ${C.border}`, transition: 'opacity 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>{plan.cta}</Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: C.textSm, fontSize: 13, marginTop: 32 }}>
            💡 All plans include a 7-day free trial · Free plan never expires · No credit card required
          </p>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div ref={s.testimonials.ref} style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ ...fadeUp(s.testimonials.v, 0), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Loved by creators worldwide</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.name}
                style={{ ...fadeUp(s.testimonials.v, 0.08 + i * 0.07), background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 22px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, color: C.textMd }}>{t.av}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: C.textSm, fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ color: C.textMd, fontSize: 13.5, lineHeight: 1.75, fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div ref={s.faq.ref} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={fadeUp(s.faq.v, 0)}><Label>FAQ</Label></div>
            <h2 style={{ ...fadeUp(s.faq.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10 }}>Frequently asked questions</h2>
            <p style={{ ...fadeUp(s.faq.v, 0.14), color: C.textMd, fontSize: 15 }}>Everything you need to know before getting started.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((f, i) => (
              <div key={i}
                style={{ ...fadeUp(s.faq.v, 0.1 + i * 0.05), background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: C.text, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer', fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit' }}>
                  {f.q}
                  <span style={{ color: C.textSm, fontSize: 20, fontWeight: 300, transform: activeFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.22s', flexShrink: 0 }}>+</span>
                </button>
                {activeFaq === i && (
                  <div style={{ padding: '0 22px 18px', color: C.textMd, fontSize: 14, lineHeight: 1.8 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div ref={s.contact.ref} style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={fadeUp(s.contact.v, 0)}><Label>Contact</Label></div>
            <h2 style={{ ...fadeUp(s.contact.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10 }}>Get in touch</h2>
            <p style={{ ...fadeUp(s.contact.v, 0.14), color: C.textMd, fontSize: 15 }}>Have questions? We typically reply within a few hours.</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message sent!</h3>
              <p style={{ color: C.textMd, fontSize: 14 }}>We'll get back to you at {form.email} shortly.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {([['Name','name','text','Your name'],['Email','email','email','you@example.com']] as const).map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.textMd, marginBottom: 7 }}>{label}</label>
                  <input type={type} placeholder={ph} required value={form[field as 'name'|'email']}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    onFocus={e => (e.currentTarget.style.borderColor = C.borderHov)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                    style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.textMd, marginBottom: 7 }}>Message</label>
                <textarea placeholder="How can we help?" required rows={5} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => (e.currentTarget.style.borderColor = C.borderHov)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit"
                style={{ background: C.highlight, color: C.hlText, border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.18s', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.86')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Send message →</button>
            </form>
          )}
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,48px) 28px', background: C.bg2 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px,100%), 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#fff"/>
                  <circle cx="16" cy="16" r="6" stroke="#0a0a0a" strokeWidth="2.4" fill="none"/>
                  <circle cx="22.5" cy="9.5" r="1.6" fill="#0a0a0a"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: 17 }}>iGrowth</span>
              </div>
              <p style={{ color: C.textSm, fontSize: 13, lineHeight: 1.7, maxWidth: 200 }}>The Instagram automation platform for creators and businesses.</p>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: C.textMd }}>Product</div>
              {[['#features','Features'],['#pricing','Pricing'],['#how-it-works','How it works'],['#faq','FAQ']].map(([href, label]) => (
                <a key={href} href={href} style={{ display: 'block', color: C.textSm, textDecoration: 'none', fontSize: 13.5, marginBottom: 9, transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.textMd)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textSm)}>{label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: C.textMd }}>Company</div>
              {[['#contact','Contact'],['mailto:hello@igrowth.app','hello@igrowth.app']].map(([href, label]) => (
                <a key={href} href={href} style={{ display: 'block', color: C.textSm, textDecoration: 'none', fontSize: 13.5, marginBottom: 9, transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.textMd)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textSm)}>{label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: C.textMd }}>Legal</div>
              {[['privacy','Privacy Policy'],['terms','Terms of Service']].map(([path, label]) => (
                <Link key={path} href={`/${path}`} style={{ display: 'block', color: C.textSm, textDecoration: 'none', fontSize: 13.5, marginBottom: 9, transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.textMd)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textSm)}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ color: C.textXs, fontSize: 13 }}>© 2026 iGrowth. All rights reserved.</p>
            <p style={{ color: C.textXs, fontSize: 13 }}>Made with ❤️ for Indian creators</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        a { -webkit-tap-highlight-color: transparent; }
        button { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
