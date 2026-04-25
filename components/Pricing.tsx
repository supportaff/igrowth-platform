'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'FREE',
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Get started with no commitment.',
    features: [
      '1,000 DMs per month',
      '500 contacts',
      '5 active automations',
      'Content insights: last 7 days',
      '5 active brand deals',
      'Collab calendar',
    ],
    cta: 'Get started free',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    name: 'CREATOR',
    monthlyPrice: 499,
    yearlyPrice: 399,
    desc: 'For creators ready to grow.',
    badge: 'Most Popular',
    features: [
      'Unlimited DMs',
      'Unlimited contacts',
      'Unlimited automations',
      'Full contact CRM',
      'Content insights: last 90 days',
      '25 active brand deals',
      'Collab calendar',
      'Email support',
    ],
    cta: 'Start Creator plan',
    ctaHref: '/signup',
    highlight: true,
  },
  {
    name: 'GROWTH',
    monthlyPrice: 999,
    yearlyPrice: 799,
    desc: 'Unlimited power for serious creators.',
    features: [
      'Everything in Creator',
      'Unlimited brand deals',
      'Re-engagement flows',
      'Content insights: last 180 days',
      'Deal PDF export',
      'Priority support',
    ],
    cta: 'Start Growth plan',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    name: 'AGENCY',
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    desc: 'For teams managing multiple accounts.',
    features: [
      'Up to 10 Instagram accounts',
      '5 team seats',
      'Client workspaces',
      'Branded exports',
      'Dedicated onboarding',
      'SLA-backed support',
    ],
    cta: 'Contact us',
    ctaHref: 'mailto:support@afforal.com',
    highlight: false,
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" style={{ background: '#222831', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800,
            color: '#EEEEEE', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Simple pricing. Built for creators.
          </h2>
          <p style={{ color: 'rgba(238,238,238,0.45)', fontSize: 16, marginBottom: 28 }}>
            Start free. Upgrade when you&apos;re ready.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12,
            background: '#393E46', border: '1px solid rgba(238,238,238,0.1)',
            borderRadius: 99, padding: '8px 18px' }}>
            <span style={{ fontSize: 13, fontWeight: 600,
              color: !yearly ? '#EEEEEE' : 'rgba(238,238,238,0.4)' }}>Monthly</span>
            <button
              onClick={() => setYearly(v => !v)}
              style={{ position: 'relative', width: 40, height: 22, borderRadius: 99,
                background: yearly ? '#00ADB5' : 'rgba(238,238,238,0.15)',
                transition: 'background 200ms', border: 'none', cursor: 'pointer' }}
            >
              <span style={{
                position: 'absolute', top: 3, width: 16, height: 16,
                borderRadius: '50%', background: '#fff',
                left: yearly ? 21 : 3, transition: 'left 200ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600,
              color: yearly ? '#EEEEEE' : 'rgba(238,238,238,0.4)' }}>
              Yearly
              <span style={{ color: '#00ADB5', fontSize: 11, fontWeight: 700, marginLeft: 6 }}>-20%</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {plans.map(plan => {
            const price = plan.monthlyPrice === 0 ? '₹0'
              : yearly ? `₹${plan.yearlyPrice}` : `₹${plan.monthlyPrice}`
            const sub   = plan.monthlyPrice === 0 ? 'forever'
              : yearly ? '/mo, billed yearly' : '/month'

            return (
              <div key={plan.name} style={{
                position: 'relative',
                background: plan.highlight ? '#00ADB5' : '#393E46',
                border: plan.highlight ? '1px solid #00ADB5' : '1px solid rgba(238,238,238,0.08)',
                borderRadius: 20,
                padding: '30px 26px',
                display: 'flex', flexDirection: 'column',
                boxShadow: plan.highlight ? '0 0 40px rgba(0,173,181,0.3)' : 'none',
                transition: 'transform 200ms',
              }}
              className={!plan.highlight ? 'hover:-translate-y-1' : ''}>
                {plan.badge && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: '#EEEEEE', color: '#222831', fontSize: 11, fontWeight: 800,
                    padding: '4px 12px', borderRadius: 99, whiteSpace: 'nowrap',
                    letterSpacing: '0.04em'
                  }}>{plan.badge}</span>
                )}

                <div style={{ marginBottom: 22 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                    color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'rgba(238,238,238,0.4)',
                    marginBottom: 8 }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 30, fontWeight: 800,
                      color: plan.highlight ? '#fff' : '#EEEEEE' }}>{price}</span>
                    <span style={{ fontSize: 12, marginBottom: 4,
                      color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(238,238,238,0.4)' }}>{sub}</span>
                  </div>
                  <p style={{ fontSize: 13,
                    color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'rgba(238,238,238,0.45)' }}>{plan.desc}</p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13,
                      color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(238,238,238,0.6)' }}>
                      <Check style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1,
                        color: plan.highlight ? '#fff' : '#00ADB5' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref}
                  style={{
                    display: 'block', textAlign: 'center', fontWeight: 700, fontSize: 14,
                    padding: '11px', borderRadius: 12, transition: 'background 160ms',
                    background: plan.highlight ? '#222831' : '#00ADB5',
                    color: plan.highlight ? '#00ADB5' : '#fff',
                  }}
                  className={plan.highlight ? 'hover:bg-[#2c3340]' : 'hover:bg-[#009aa2]'}>
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(238,238,238,0.25)', fontSize: 12, marginTop: 28 }}>
          All paid plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
