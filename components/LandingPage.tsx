'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const PINK = '#E1306C'
const PINK_DARK = '#c0254f'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

const fadeUp = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(32px)',
  transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
})

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hero = useInView(0.1)
  const features = useInView()
  const howItWorks = useInView()
  const pricing = useInView()
  const testimonials = useInView()
  const faq = useInView()
  const contact = useInView()

  const featureList = [
    { icon: '⚡', title: 'Keyword DM Automation', desc: 'Trigger instant DM replies when users comment specific keywords on your posts or reels.' },
    { icon: '🎯', title: 'Smart Lead Capture', desc: 'Automatically collect names, emails and phone numbers from DM conversations into your CRM.' },
    { icon: '🔁', title: 'Story Reply Flows', desc: 'When followers react to your stories, auto-send personalized follow-up sequences.' },
    { icon: '👥', title: 'New Follower Welcome', desc: 'Greet every new follower with a warm automated DM introducing your brand or offer.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track automation performance, open rates, reply rates, and lead conversions in real time.' },
    { icon: '🔗', title: 'Multi-Account Support', desc: 'Manage multiple Instagram Business accounts from one unified dashboard.' },
  ]

  const steps = [
    { num: '01', title: 'Connect Instagram', desc: 'Link your Instagram Business account via secure Facebook OAuth in under 60 seconds.' },
    { num: '02', title: 'Build Automations', desc: 'Choose a trigger (keyword, new follower, story reply), add conditions, and set your actions.' },
    { num: '03', title: 'Go Live & Grow', desc: 'Activate your automation and watch leads, replies and engagement happen automatically 24/7.' },
  ]

  // Annual pricing = ~20% off monthly
  const plans = [
    {
      name: 'Free',
      popular: false,
      badge: null,
      monthly: 0,
      annual: 0,
      desc: 'Try it out — no credit card needed.',
      highlight: null,
      features: [
        '500 DMs / month',
        '500 contacts',
        'Basic automations',
        'CRM preview',
        'Content insights (limited)',
      ],
      cta: 'Start for Free',
      ctaHref: '/signup',
    },
    {
      name: 'Creator',
      popular: true,
      badge: '35–40% cheaper than competitors',
      monthly: 249,
      annual: 199,
      desc: 'Everything you need to turn followers into revenue.',
      highlight: 'Most popular among solo creators',
      features: [
        'Unlimited automations',
        'Unlimited DMs',
        'Unlimited contacts',
        'Follower CRM',
        'Smart links',
        'Content → conversion analytics',
        'Email support',
      ],
      cta: 'Start Creator Plan',
      ctaHref: '/signup?plan=creator',
    },
    {
      name: 'Growth',
      popular: false,
      badge: null,
      monthly: 349,
      annual: 279,
      desc: 'For creators scaling to serious revenue.',
      highlight: null,
      features: [
        'Everything in Creator',
        'Advanced segmentation',
        'Revenue & order tracking',
        'Re-engagement campaigns',
        'Higher rate limits',
        'Priority support',
      ],
      cta: 'Start Growth Plan',
      ctaHref: '/signup?plan=growth',
    },
    {
      name: 'Agency',
      popular: false,
      badge: null,
      monthly: 999,
      annual: 799,
      desc: 'Manage multiple clients from one dashboard.',
      highlight: null,
      features: [
        'Multiple Instagram accounts',
        'Team access',
        'Client workspaces',
        'Branded reports',
        'Dedicated onboarding',
        'Custom rate limits',
        'SLA support',
      ],
      cta: 'Contact Sales',
      ctaHref: '#contact',
    },
  ]

  const testimonialList = [
    { name: 'Sarah K.', handle: '@sarahkbeauty', avatar: 'SK', role: 'Beauty Creator · 180K followers', quote: 'iGrowth completely transformed how I handle DMs. I went from missing leads to capturing 200+ emails a week on autopilot.' },
    { name: 'Marcus T.', handle: '@marcusfitpro', avatar: 'MT', role: 'Fitness Coach · 95K followers', quote: 'The keyword automation is insane. I posted one reel, added a keyword trigger, and woke up to 400 new DM leads the next morning.' },
    { name: 'Priya R.', handle: '@priyastudio', avatar: 'PR', role: 'Design Agency · 12 clients', quote: 'Managing 12 client accounts from one dashboard saves us 30+ hours a week. The ROI on the Agency plan paid for itself in day one.' },
    { name: 'Luca B.', handle: '@lucaecommerce', avatar: 'LB', role: 'E-commerce Brand · 220K followers', quote: 'Our story reply flow alone generates ₹60K/month in sales. I set it up once and it just runs. Absolutely worth every rupee.' },
  ]

  const faqs = [
    { q: 'Do I need an Instagram Business account?', a: 'Yes. iGrowth uses the official Instagram Graph API which requires an Instagram Business or Creator account linked to a Facebook Page. Personal accounts are not supported.' },
    { q: 'Will my account get banned for using automation?', a: 'No. iGrowth uses Meta\'s official API — the same infrastructure Instagram itself endorses for business tools. We never scrape, inject, or simulate human activity.' },
    { q: 'How quickly do automated DMs send?', a: 'Responses are sent within seconds of a trigger event. Your followers experience near-instant replies that feel personal.' },
    { q: 'Can I personalise automated messages?', a: 'Absolutely. Use variables like {{name}}, {{username}}, {{handle}} to personalise every message. Each DM feels handwritten.' },
    { q: 'What happens if I exceed my DM limit?', a: 'Automations pause gracefully and you\'ll receive an email notification. Upgrade at any time to restore full capacity instantly.' },
    { q: 'Is there a free trial for paid plans?', a: 'Yes. All paid plans come with a 7-day free trial — no credit card required. Cancel anytime before the trial ends and you won\'t be charged.' },
  ]

  const formatPrice = (price: number) =>
    price === 0 ? '₹0' : `₹${price.toLocaleString('en-IN')}`

  return (
    <div style={{ background: '#080810', color: '#fff', fontFamily: '\'Inter\', system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 clamp(16px, 4vw, 60px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill={PINK}/>
              <circle cx="17" cy="17" r="6.5" stroke="white" strokeWidth="2.5" fill="none"/>
              <circle cx="24" cy="10" r="1.8" fill="white"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>iGrowth</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
            {[['#features','Features'],['#how-it-works','How it works'],['#pricing','Pricing'],['#contact','Contact']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>{label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 8 }}>Sign in</Link>
            <Link href="/signup" style={{ background: PINK, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = PINK_DARK)}
              onMouseLeave={e => (e.currentTarget.style.background = PINK)}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: `radial-gradient(circle, ${PINK}22 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div ref={hero.ref} style={{ position: 'relative', maxWidth: 800 }}>
          <div style={{ ...fadeUp(hero.inView, 0), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(225,48,108,0.1)', border: `1px solid rgba(225,48,108,0.3)`, borderRadius: 99, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: PINK, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: PINK, fontSize: 13, fontWeight: 600, letterSpacing: '0.4px' }}>Instagram Automation Platform</span>
          </div>

          <h1 style={{ ...fadeUp(hero.inView, 0.1), fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2.5px', marginBottom: 24 }}>
            Turn Instagram into your
            <br /><span style={{ background: `linear-gradient(135deg, ${PINK}, #ff6b9d)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>24/7 sales machine</span>
          </h1>

          <p style={{ ...fadeUp(hero.inView, 0.2), fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Automate DM replies, capture leads, and engage followers automatically — so you grow while you sleep.
          </p>

          <div style={{ ...fadeUp(hero.inView, 0.3), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href="/signup" style={{ background: PINK, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700, padding: '15px 36px', borderRadius: 10, transition: 'transform 0.2s, background 0.2s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = PINK_DARK }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = PINK }}>
              Start for free →
            </Link>
            <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 600, padding: '15px 36px', borderRadius: 10, transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}>See how it works</a>
          </div>

          <div style={{ ...fadeUp(hero.inView, 0.4), display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['10K+', 'Creators using iGrowth'], ['50M+', 'DMs automated'], ['4.9★', 'Average rating']].map(([num, label]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>{num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={features.ref} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ ...fadeUp(features.inView, 0), display: 'inline-block', background: 'rgba(225,48,108,0.1)', border: `1px solid rgba(225,48,108,0.25)`, borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ color: PINK, fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Features</span>
            </div>
            <h2 style={{ ...fadeUp(features.inView, 0.1), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>Everything you need to automate Instagram</h2>
            <p style={{ ...fadeUp(features.inView, 0.2), color: 'rgba(255,255,255,0.5)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>Powerful tools built specifically for Instagram Business accounts and creators.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: 20 }}>
            {featureList.map((f, i) => (
              <div key={f.title} style={{ ...fadeUp(features.inView, 0.1 + i * 0.08), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 28px', transition: 'border-color 0.2s, transform 0.2s, background 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(225,48,108,0.4)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(225,48,108,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div ref={howItWorks.ref} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ ...fadeUp(howItWorks.inView, 0), display: 'inline-block', background: 'rgba(225,48,108,0.1)', border: `1px solid rgba(225,48,108,0.25)`, borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ color: PINK, fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>How it works</span>
            </div>
            <h2 style={{ ...fadeUp(howItWorks.inView, 0.1), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Up and running in 3 steps</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ ...fadeUp(howItWorks.inView, 0.15 + i * 0.12), display: 'flex', gap: 28, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px' }}>
                <div style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: PINK, opacity: 0.7, letterSpacing: '-2px', minWidth: 64, lineHeight: 1 }}>{s.num}</div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.3px' }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={pricing.ref} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ ...fadeUp(pricing.inView, 0), display: 'inline-block', background: 'rgba(225,48,108,0.1)', border: `1px solid rgba(225,48,108,0.25)`, borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ color: PINK, fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Pricing</span>
            </div>
            <h2 style={{ ...fadeUp(pricing.inView, 0.1), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>
              Cheaper. More powerful. Built for India.
            </h2>
            <p style={{ ...fadeUp(pricing.inView, 0.15), color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 8 }}>
              35–40% cheaper than alternatives. No hidden fees. Cancel anytime.
            </p>
            <p style={{ ...fadeUp(pricing.inView, 0.18), color: 'rgba(255,255,255,0.3)', fontSize: 13, marginBottom: 28 }}>
              All prices in INR (₹) · GST extra if applicable
            </p>
            {/* Billing Toggle */}
            <div style={{ ...fadeUp(pricing.inView, 0.22), display: 'inline-flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: 4, gap: 4 }}>
              {[['Monthly', false], ['Annual (save 20%)', true]].map(([label, isAnnual]) => (
                <button key={String(label)} onClick={() => setBillingAnnual(isAnnual as boolean)} style={{ background: (billingAnnual === isAnnual) ? PINK : 'transparent', color: '#fff', border: 'none', borderRadius: 99, padding: '7px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>{label as string}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: 20 }}>
            {plans.map((plan, i) => (
              <div key={plan.name} style={{ ...fadeUp(pricing.inView, 0.1 + i * 0.08), position: 'relative', background: plan.popular ? `linear-gradient(135deg, rgba(225,48,108,0.14), rgba(225,48,108,0.04))` : 'rgba(255,255,255,0.03)', border: plan.popular ? `1px solid rgba(225,48,108,0.55)` : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>

                {plan.popular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: PINK, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                )}

                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</div>

                {/* Price */}
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px' }}>
                    {plan.monthly === 0 ? '₹0' : formatPrice(billingAnnual ? plan.annual : plan.monthly)}
                  </span>
                  {plan.monthly > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginLeft: 4 }}>/mo</span>
                  )}
                </div>

                {billingAnnual && plan.monthly > 0 && (
                  <div style={{ color: PINK, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Billed annually · Save ₹{((plan.monthly - plan.annual) * 12).toLocaleString('en-IN')}/yr
                  </div>
                )}

                {plan.badge && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(225,48,108,0.12)', border: '1px solid rgba(225,48,108,0.25)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: PINK, fontWeight: 600, marginBottom: 20, width: 'fit-content' }}>
                    🏷️ {plan.badge}
                  </div>
                )}

                {!plan.badge && <div style={{ marginBottom: 20 }} />}

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                      <span style={{ color: PINK, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>{feat}
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref} style={{ display: 'block', textAlign: 'center', background: plan.popular ? PINK : 'rgba(255,255,255,0.08)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 10, border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = plan.popular ? PINK_DARK : 'rgba(255,255,255,0.14)')}
                  onMouseLeave={e => (e.currentTarget.style.background = plan.popular ? PINK : 'rgba(255,255,255,0.08)')}>{plan.cta}</Link>
              </div>
            ))}
          </div>

          {/* Value footnote */}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              💡 Creator plan is ~35–40% cheaper than LinkPlease &amp; similar tools · Free plan never expires · No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={testimonials.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ ...fadeUp(testimonials.inView, 0.1), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Loved by creators worldwide</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 20 }}>
            {testimonialList.map((t, i) => (
              <div key={t.name} style={{ ...fadeUp(testimonials.inView, 0.1 + i * 0.08), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 24px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${PINK}, #ff6b9d)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.75, fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div ref={faq.ref} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ ...fadeUp(faq.inView, 0), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Frequently asked questions</h2>
            <p style={{ ...fadeUp(faq.inView, 0.1), color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Everything you need to know before getting started.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ ...fadeUp(faq.inView, 0.1 + i * 0.06), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
                  {f.q}
                  <span style={{ color: PINK, fontSize: 22, fontWeight: 300, transform: activeFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
                </button>
                {activeFaq === i && (
                  <div style={{ padding: '0 24px 20px', color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.75 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,60px)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div ref={contact.ref} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ ...fadeUp(contact.inView, 0), fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>Get in touch</h2>
            <p style={{ ...fadeUp(contact.inView, 0.1), color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Have questions? We typically reply within a few hours.</p>
          </div>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(225,48,108,0.08)', border: `1px solid rgba(225,48,108,0.3)`, borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Message sent!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>We&apos;ll get back to you at {contactForm.email} shortly.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Name', 'name', 'text', 'Your name'], ['Email', 'email', 'email', 'you@example.com']].map(([label, field, type, placeholder]) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{label}</label>
                  <input type={type} placeholder={placeholder} required value={contactForm[field as keyof typeof contactForm]}
                    onChange={e => setContactForm(p => ({ ...p, [field]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Message</label>
                <textarea placeholder="How can we help?" required rows={5} value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" style={{ background: PINK, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = PINK_DARK)}
                onMouseLeave={e => (e.currentTarget.style.background = PINK)}>Send message →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,60px) 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px,100%), 1fr))', gap: 40, marginBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill={PINK}/>
                  <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
                  <circle cx="22.5" cy="9.5" r="1.5" fill="white"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: 18 }}>iGrowth</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>The Instagram automation platform for creators and businesses.</p>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'rgba(255,255,255,0.7)' }}>Product</div>
              {[['#features','Features'],['#pricing','Pricing'],['#how-it-works','How it works'],['#faq','FAQ']].map(([href, label]) => (
                <a key={href} href={href} style={{ display: 'block', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'rgba(255,255,255,0.7)' }}>Company</div>
              {[['#contact','Contact'],['mailto:hello@igrowth.app','hello@igrowth.app']].map(([href, label]) => (
                <a key={href} href={href} style={{ display: 'block', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'rgba(255,255,255,0.7)' }}>Legal</div>
              {[['privacy','Privacy Policy'],['terms','Terms of Service']].map(([path, label]) => (
                <Link key={path} href={`/${path}`} style={{ display: 'block', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>© 2026 iGrowth. All rights reserved.</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Made with ❤️ for Indian creators</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input:focus, textarea:focus { border-color: rgba(225,48,108,0.5) !important; box-shadow: 0 0 0 3px rgba(225,48,108,0.12); }
        @media (max-width: 640px) { .desktop-nav { display: none !important; } }
      `}</style>
    </div>
  )
}
