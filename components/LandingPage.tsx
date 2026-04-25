'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg:           '#000000',
  bg2:          '#0a0a0a',
  card:         '#111111',
  border:       'rgba(255,255,255,0.08)',
  borderHov:    'rgba(255,255,255,0.22)',
  accent:       '#ffffff',
  accentDim:    'rgba(255,255,255,0.05)',
  accentDimHov: 'rgba(255,255,255,0.09)',
  text:         '#ffffff',
  textMd:       'rgba(255,255,255,0.62)',
  textSm:       'rgba(255,255,255,0.38)',
  textXs:       'rgba(255,255,255,0.20)',
  highlight:    '#ffffff',
  hlText:       '#000000',
}

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
  transform: v ? 'translateY(0)' : 'translateY(22px)',
  transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
})

function Label({ children }: { children: string }) {
  return (
    <div style={{ display: 'inline-block', background: C.accentDim, border: `1px solid ${C.border}`, borderRadius: 99, padding: '5px 14px', marginBottom: 18 }}>
      <span style={{ color: C.textMd, fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' as const }}>{children}</span>
    </div>
  )
}

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7" cy="7" r="6.5" stroke={dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'} />
      <path d="M4.5 7l2 2 3-3" stroke={dark ? '#000' : '#fff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

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
  }

  const navLinks = [
    ['#features', 'Features'],
    ['#how-it-works', 'How it works'],
    ['#pricing', 'Pricing'],
    ['#faq', 'FAQ'],
  ]

  const features = [
    { icon: '💬', title: 'Instagram DM Conversations', desc: 'All your Instagram DMs in one unified inbox. Full chat timeline, contact history, tags, quick-reply templates, and filters — reply to every message without leaving the app.' },
    { icon: '🤝', title: 'Brand Deal Pipeline', desc: 'Manage every collab from first outreach to final payment. Track deal value, deliverables, deadlines, and payment status across a clean Kanban pipeline.' },
    { icon: '⚡', title: 'DM Automation', desc: 'Set up multi-step DM flows triggered by keywords or comments. Auto-reply, ask questions, save answers, and assign tags without lifting a finger.' },
    { icon: '📅', title: 'Collab Planner', desc: 'Keep every campaign deadline in one place. Track shoot dates, draft approvals, posting deadlines, and payment follow-ups in calendar, kanban, or list view.' },
    { icon: '📊', title: 'Content Intelligence', desc: 'See which reels and posts trigger the most DMs and brand interest so you can double down on content that actually grows income.' },
    { icon: '🌍', title: 'Audience Demographics', desc: 'Use top cities, countries, and age/gender breakdown when pitching brands — go into every negotiation with real data backing you up.' },
  ]

  const steps = [
    { n: '01', title: 'Connect Instagram', desc: 'Link your Instagram Business or Creator account via secure Facebook OAuth in under 60 seconds.' },
    { n: '02', title: 'Set Up Automations & Deals', desc: 'Build your first keyword DM flow and create your brand deal pipeline in minutes.' },
    { n: '03', title: 'Watch It Work', desc: 'Conversations are managed automatically, deals are tracked, and you focus on creating.' },
  ]

  const plans = [
    {
      name: 'Free',
      tagline: '₹0 / forever',
      price: '₹0',
      period: '',
      popular: false,
      badge: null,
      features: [
        '1,000 DMs / month',
        '500 contacts',
        '5 active automations',
        '5 active brand deals',
        'Collab calendar',
        'Content insights: last 7 days',
      ],
      cta: 'Get started free',
      route: '/signup',
    },
    {
      name: 'Creator',
      tagline: '₹499 / account / month',
      price: '₹499',
      period: '/mo',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Unlimited DMs',
        'Unlimited contacts',
        'Unlimited automations',
        'Full contact CRM',
        '25 active brand deals',
        'Content insights: last 90 days',
        'Audience demographics',
        'Collab calendar',
        'Email support',
      ],
      cta: 'Start Creator plan',
      route: '/signup?plan=creator',
    },
    {
      name: 'Growth',
      tagline: '₹999 / account / month',
      price: '₹999',
      period: '/mo',
      popular: false,
      badge: null,
      features: [
        'Everything in Creator',
        'Unlimited brand deals',
        'Re-engagement flows',
        'Content insights: last 180 days',
        'Deal PDF export',
        'Priority support',
        'Advanced analytics',
      ],
      cta: 'Start Growth plan',
      route: '/signup?plan=growth',
    },
    {
      name: 'Agency',
      tagline: 'Custom pricing',
      price: 'Custom',
      period: '',
      popular: false,
      badge: null,
      features: [
        'Up to 10 Instagram accounts',
        'Team member access (5 seats)',
        'Client workspaces',
        'Branded exports & reports',
        'Dedicated onboarding',
        'SLA-backed support',
      ],
      cta: 'Contact us',
      route: 'mailto:support@afforal.com',
    },
  ]

  const testimonials = [
    { name: 'Karthikeyan S.', role: 'Fitness Creator · Chennai · 42K followers', av: 'KS', quote: 'iGrowth-la keyword automation set panna, oru reel post panna maathrame 300+ leads automatic-a vanduchu. Brand deals track panna super useful!' },
    { name: 'Divya Lakshmi', role: 'Beauty & Skincare · Coimbatore · 28K followers', av: 'DL', quote: 'Brand deals track panna romba kastama irundhuchu. iGrowth Deal Pipeline use pandrene, ippove 5 active deals manage panren — effortlessly.' },
    { name: 'Arjun Venkatesh', role: 'Food Blogger · Madurai · 61K followers', av: 'AV', quote: 'Followers DM-ku reply pannave time illama irundhen. iGrowth auto-reply set pannitene, engagement rate 3x aagidhuchu!' },
    { name: 'Nivetha R.', role: 'Fashion & Lifestyle · Tirunelveli · 19K followers', av: 'NR', quote: 'Free plan la start panna, Creator-ku upgrade panninen. ₹499 la unlimited DMs and brand deal pipeline — worth it!' },
  ]

  const faqs = [
    { q: 'Do I need an Instagram Business account?', a: "Yes. iGrowth uses the official Instagram Graph API which requires an Instagram Business or Creator account linked to a Facebook Page. Personal accounts are not supported." },
    { q: 'Will my account get banned for using automation?', a: "No. iGrowth uses Meta's official API — the same infrastructure Instagram endorses for business tools. We never scrape, inject, or simulate human activity." },
    { q: 'How quickly do automated DMs send?', a: 'Responses are sent within seconds of a trigger event. Your followers experience near-instant replies that feel personal.' },
    { q: 'What happens when I hit my plan limit?', a: "Automations pause gracefully and you'll receive an in-app notification. Upgrade anytime to restore full access." },
    { q: 'Can I manage brand deals on mobile?', a: 'Yes. iGrowth is fully responsive — manage your deal pipeline, check conversations, and update the planner from any device.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel from the billing page at any time. No hidden fees, no lock-ins.' },
  ]

  const handlePlanCTA = (route: string) => {
    if (route.startsWith('mailto:')) {
      window.location.href = route
    } else {
      router.push(route)
    }
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', lineHeight: 1.6 }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(0,0,0,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: C.text }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#fff"/>
              <circle cx="16" cy="16" r="6" stroke="#000" strokeWidth="2.4" fill="none"/>
              <circle cx="22.5" cy="9.5" r="1.6" fill="#000"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.5px' }}>iGrowth</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.textSm, letterSpacing: '0.5px', background: C.accentDim, border: `1px solid ${C.border}`, borderRadius: 99, padding: '2px 8px' }}>by Afforal</span>
          </Link>

          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hide-mobile">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}
                style={{ color: C.textMd, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMd)}>{label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => router.push('/login')} className="hide-mobile"
              style={{ background: 'none', border: 'none', color: C.textMd, fontSize: 14, fontWeight: 500, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', transition: 'color 0.18s', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMd)}>Sign in</button>
            <button onClick={() => router.push('/signup')}
              style={{ background: C.highlight, color: C.hlText, border: 'none', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 8, cursor: 'pointer', transition: 'opacity 0.18s', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Get started</button>
            <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: 6, marginLeft: 4 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                {menuOpen
                  ? <><path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
                  : <><rect x="2" y="5" width="18" height="1.8" rx="1" fill="currentColor"/><rect x="2" y="10.1" width="18" height="1.8" rx="1" fill="currentColor"/><rect x="2" y="15.2" width="18" height="1.8" rx="1" fill="currentColor"/></>}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, padding: '16px clamp(16px,4vw,48px) 24px' }}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', color: C.textMd, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>{label}</a>
            ))}
            <button onClick={() => router.push('/login')} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: C.textMd, fontSize: 16, fontWeight: 500, padding: '12px 0', cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%,#000 40%,transparent 100%)', pointerEvents: 'none' }} />
        <div ref={s.hero.ref} style={{ position: 'relative', maxWidth: 760, width: '100%' }}>
          <div style={fadeUp(s.hero.v, 0)}><Label>The Instagram OS for creators — by Afforal</Label></div>
          <h1 style={{ ...fadeUp(s.hero.v, 0.08), fontSize: 'clamp(36px,6.5vw,72px)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-2.5px', marginBottom: 22 }}>
            Automate DMs. Close brand deals.<br />
            <span style={{ color: C.text }}>Grow smarter.</span>
          </h1>
          <p style={{ ...fadeUp(s.hero.v, 0.16), fontSize: 'clamp(16px,2vw,18px)', color: C.textMd, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.8 }}>
            iGrowth is the all-in-one workspace for Instagram creators — manage conversations, close brand deals, plan campaigns, and track every collab in one dashboard.
          </p>
          <div style={{ ...fadeUp(s.hero.v, 0.24), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <button onClick={() => router.push('/signup')}
              style={{ background: C.highlight, color: C.hlText, border: 'none', fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 10, cursor: 'pointer', transition: 'opacity 0.18s, transform 0.18s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}>Start for free →</button>
            <a href="#how-it-works"
              style={{ background: C.accentDim, border: `1px solid ${C.border}`, color: C.text, textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '14px 32px', borderRadius: 10, transition: 'background 0.18s, border-color 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accentDimHov; e.currentTarget.style.borderColor = C.borderHov }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accentDim; e.currentTarget.style.borderColor = C.border }}>See how it works</a>
          </div>
          <div style={{ ...fadeUp(s.hero.v, 0.32), display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['10K+', 'Creators using iGrowth'], ['5M+', 'DMs automated'], ['₹2Cr+', 'Brand deals tracked'], ['4.9★', 'Average rating']].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px' }}>{n}</div>
                <div style={{ fontSize: 12, color: C.textSm, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div ref={s.features.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={fadeUp(s.features.v, 0)}><Label>Features</Label></div>
            <h2 style={{ ...fadeUp(s.features.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14 }}>Everything a creator needs.</h2>
            <p style={{ ...fadeUp(s.features.v, 0.14), color: C.textMd, fontSize: 16, maxWidth: 460, margin: '0 auto' }}>Nothing they don't. Built for Instagram Business and Creator accounts.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px,100%), 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={f.title}
                style={{ ...fadeUp(s.features.v, 0.08 + i * 0.06), background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '26px', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: C.textMd, fontSize: 13.5, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div ref={s.howItWorks.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={fadeUp(s.howItWorks.v, 0)}><Label>How it works</Label></div>
            <h2 style={{ ...fadeUp(s.howItWorks.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Up and running in 5 minutes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((step, i) => (
              <div key={step.n}
                style={{ ...fadeUp(s.howItWorks.v, 0.1 + i * 0.12), display: 'flex', gap: 28, alignItems: 'flex-start', background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '26px 30px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <div style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: C.textXs, letterSpacing: '-2px', minWidth: 52, lineHeight: 1 }}>{step.n}</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 7 }}>{step.title}</h3>
                  <p style={{ color: C.textMd, fontSize: 14.5, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={s.pricing.ref} style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={fadeUp(s.pricing.v, 0)}><Label>Pricing</Label></div>
            <h2 style={{ ...fadeUp(s.pricing.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10 }}>Simple pricing. No surprises.</h2>
            <p style={{ ...fadeUp(s.pricing.v, 0.14), color: C.textMd, fontSize: 15 }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%), 1fr))', gap: 18, alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={plan.name}
                style={{ ...fadeUp(s.pricing.v, 0.1 + i * 0.1), position: 'relative', background: plan.popular ? '#ffffff' : C.card, border: plan.popular ? '1.5px solid #ffffff' : `1px solid ${C.border}`, borderRadius: 18, padding: '32px 26px', display: 'flex', flexDirection: 'column', color: plan.popular ? '#000000' : C.text, transition: 'transform 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#000', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 99, letterSpacing: '1.2px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.15)' }}>{plan.badge.toUpperCase()}</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: plan.popular ? 'rgba(0,0,0,0.52)' : C.textMd, fontSize: 12.5, marginBottom: 22, lineHeight: 1.5 }}>{plan.tagline}</div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: plan.price === 'Custom' ? 34 : 46, fontWeight: 900, letterSpacing: '-2px' }}>{plan.price}</span>
                  {plan.period && <span style={{ color: plan.popular ? 'rgba(0,0,0,0.45)' : C.textSm, fontSize: 13, marginLeft: 4 }}>{plan.period}</span>}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: plan.popular ? 'rgba(0,0,0,0.72)' : C.textMd }}>
                      <Check dark={plan.popular} />{feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanCTA(plan.route)}
                  style={{ display: 'block', width: '100%', textAlign: 'center', background: plan.popular ? '#000000' : C.accentDim, color: plan.popular ? '#fff' : C.text, border: plan.popular ? 'none' : `1px solid ${C.border}`, fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 10, cursor: 'pointer', transition: 'opacity 0.18s', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.80')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: C.textSm, fontSize: 13, marginTop: 32 }}>
            Free plan never expires · No credit card required · Upgrade or cancel anytime · All prices in INR
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div ref={s.testimonials.ref} style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={fadeUp(s.testimonials.v, 0)}><Label>Testimonials</Label></div>
            <h2 style={{ ...fadeUp(s.testimonials.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Creators who stopped doing it manually.</h2>
            <p style={{ ...fadeUp(s.testimonials.v, 0.14), color: C.textMd, fontSize: 15, marginTop: 10 }}>Real results from real people — in their own words.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.name}
                style={{ ...fadeUp(s.testimonials.v, 0.08 + i * 0.07), background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHov; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#fff', fontSize: 13 }}>★</span>)}
                </div>
                <p style={{ color: C.textMd, fontSize: 14, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, color: C.textMd }}>{t.av}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{t.name}</div>
                    <div style={{ color: C.textSm, fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)', background: C.bg2 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div ref={s.faq.ref} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={fadeUp(s.faq.v, 0)}><Label>FAQ</Label></div>
            <h2 style={{ ...fadeUp(s.faq.v, 0.08), fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10 }}>Common questions.</h2>
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

      {/* ── CTA BANNER ── */}
      <section style={{ padding: 'clamp(60px,8vw,112px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 'clamp(40px,6vw,72px) clamp(24px,4vw,56px)' }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14 }}>Ready to grow smarter?</h2>
          <p style={{ color: C.textMd, fontSize: 16, maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.8 }}>Join thousands of creators already using iGrowth to automate DMs and close more brand deals.</p>
          <button onClick={() => router.push('/signup')}
            style={{ background: C.highlight, color: C.hlText, border: 'none', fontSize: 15, fontWeight: 700, padding: '14px 36px', borderRadius: 10, cursor: 'pointer', transition: 'opacity 0.18s', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Start for free — no card needed</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,48px) 28px', background: C.bg2 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px,100%), 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#fff"/>
                  <circle cx="16" cy="16" r="6" stroke="#000" strokeWidth="2.4" fill="none"/>
                  <circle cx="22.5" cy="9.5" r="1.6" fill="#000"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: 17 }}>iGrowth</span>
              </div>
              <p style={{ color: C.textSm, fontSize: 12, marginBottom: 6 }}>A product by <a href="https://afforal.com" target="_blank" rel="noopener noreferrer" style={{ color: C.textMd, textDecoration: 'none' }}>Afforal</a></p>
              <p style={{ color: C.textSm, fontSize: 13, lineHeight: 1.7, maxWidth: 200 }}>The Instagram OS for creators and businesses.</p>
              <a href="mailto:support@afforal.com" style={{ display: 'inline-block', marginTop: 8, color: C.textMd, fontSize: 13, textDecoration: 'none', transition: 'color 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMd)}>support@afforal.com</a>
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
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: C.textMd }}>Account</div>
              {[['login','Sign In'],['signup','Get Started']].map(([path, label]) => (
                <button key={path} onClick={() => router.push(`/${path}`)} style={{ display: 'block', background: 'none', border: 'none', color: C.textSm, fontSize: 13.5, marginBottom: 9, cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.textMd)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textSm)}>{label}</button>
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
            <p style={{ color: C.textXs, fontSize: 13 }}>© 2026 iGrowth · A product by <a href="https://afforal.com" target="_blank" rel="noopener noreferrer" style={{ color: C.textSm, textDecoration: 'none' }}>Afforal</a>. Not affiliated with Meta or Instagram.</p>
            <p style={{ color: C.textXs, fontSize: 13 }}>Made with ❤️ for Indian creators</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        a { -webkit-tap-highlight-color: transparent; }
        button { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
        @media (min-width: 641px) { .show-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}
