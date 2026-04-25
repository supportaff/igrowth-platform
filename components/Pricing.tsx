'use client'
import { useState } from 'react'
import { Check, Zap, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────
// Plan definitions — update prices here only
// ─────────────────────────────────────────────
export const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    payuPlanId: { monthly: '', annual: '' },
    description: 'Perfect to get started',
    color: 'dark' as const,
    features: [
      '1 Instagram Account',
      '5 Automations',
      '500 DMs / month',
      '500 Contacts',
      'Post & Reel Comment Triggers',
      'Story Reply Trigger',
      'Basic Analytics',
    ],
    cta: 'Start Free',
    href: '/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 799,
    annualPrice: 499,
    payuPlanId: {
      monthly: process.env.NEXT_PUBLIC_PAYU_PLAN_PRO_MONTHLY ?? 'pro_monthly',
      annual:  process.env.NEXT_PUBLIC_PAYU_PLAN_PRO_ANNUAL  ?? 'pro_annual',
    },
    description: 'For serious creators',
    color: 'light' as const,
    badge: 'Most Popular',
    features: [
      '3 Instagram Accounts',
      'Unlimited Automations',
      'Unlimited DMs',
      'Unlimited Contacts',
      'All Triggers incl. DM keyword',
      'Brand Deals CRM',
      'Content Planner',
      'Priority Support',
    ],
    cta: 'Get Pro',
    href: '/signup?plan=pro',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 1999,
    annualPrice: 1299,
    payuPlanId: {
      monthly: process.env.NEXT_PUBLIC_PAYU_PLAN_GROWTH_MONTHLY ?? 'growth_monthly',
      annual:  process.env.NEXT_PUBLIC_PAYU_PLAN_GROWTH_ANNUAL  ?? 'growth_annual',
    },
    description: 'For agencies & power users',
    color: 'dark' as const,
    badge: 'Best Value',
    features: [
      '10 Instagram Accounts',
      'Everything in Pro',
      'Team Members (5 seats)',
      'White-label Reports',
      'Dedicated Account Manager',
      'Early Access New Features',
      'Custom Automations (on request)',
    ],
    cta: 'Get Growth',
    href: '/signup?plan=growth',
  },
]

interface PricingProps {
  /** When true, renders inside dashboard — shows upgrade flow instead of signup links */
  dashboardMode?: boolean
  currentPlan?: string
  userId?: string
  userEmail?: string
  userName?: string
  userPhone?: string
}

export default function Pricing({
  dashboardMode = false,
  currentPlan = 'free',
  userId,
  userEmail = '',
  userName = '',
  userPhone = '',
}: PricingProps) {
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.id === 'free') {
      router.push('/signup')
      return
    }

    setLoading(plan.id)
    try {
      const res = await fetch('/api/payment/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billing: annual ? 'annual' : 'monthly',
          amount: annual ? plan.annualPrice : plan.monthlyPrice,
          planName: `${plan.name} ${annual ? 'Annual' : 'Monthly'}`,
          userId,
          email: userEmail,
          name: userName,
          phone: userPhone,
        }),
      })
      const data = await res.json()
      if (data.redirectUrl) {
        // POST redirect to PayU — create a form and submit
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.payuUrl
        Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
          const inp = document.createElement('input')
          inp.type = 'hidden'
          inp.name = k
          inp.value = v
          form.appendChild(inp)
        })
        document.body.appendChild(form)
        form.submit()
      } else {
        alert(data.error ?? 'Payment initiation failed. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section
      id="pricing"
      style={{
        background: dashboardMode ? 'transparent' : '#000',
        padding: dashboardMode ? '0' : 'clamp(64px,8vw,120px) 0',
        borderTop: dashboardMode ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: dashboardMode ? '0' : '0 24px' }}>

        {/* Header — hidden in dashboard mode */}
        {!dashboardMode && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', marginBottom: 14,
            }}>Pricing</p>
            <h2 style={{
              fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800,
              letterSpacing: '-0.5px', color: '#fff', lineHeight: 1.1, marginBottom: 14,
            }}>Simple, honest pricing</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 460, margin: '0 auto 28px' }}>
              Start free. Upgrade when you're ready to scale.
            </p>
          </div>
        )}

        {/* Billing toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 99, padding: 4, alignItems: 'center', gap: 4,
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                fontSize: 12, fontWeight: 600, borderRadius: 99, padding: '6px 18px',
                border: 'none', cursor: 'pointer', transition: 'all 160ms',
                background: !annual ? '#fff' : 'transparent',
                color: !annual ? '#000' : 'rgba(255,255,255,0.45)',
              }}>Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                fontSize: 12, fontWeight: 600, borderRadius: 99, padding: '6px 18px',
                border: 'none', cursor: 'pointer', transition: 'all 160ms',
                background: annual ? '#fff' : 'transparent',
                color: annual ? '#000' : 'rgba(255,255,255,0.45)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              Annual
              <span style={{
                background: annual ? '#16a34a' : 'rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 10, fontWeight: 700,
                padding: '1px 7px', borderRadius: 99,
              }}>Save 38%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 16, alignItems: 'stretch',
        }}>
          {PLANS.map(plan => {
            const isLight = plan.color === 'light'
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            const isCurrent = dashboardMode && currentPlan === plan.id
            const isLoadingThis = loading === plan.id

            return (
              <div
                key={plan.id}
                style={{
                  background: isLight ? '#fff' : '#0d0d0d',
                  border: `1px solid ${isLight ? '#fff' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 18, padding: '28px 26px',
                  display: 'flex', flexDirection: 'column', gap: 20,
                  position: 'relative',
                  boxShadow: isLight ? '0 0 0 1px rgba(255,255,255,0.2), 0 24px 64px rgba(255,255,255,0.06)' : 'none',
                  opacity: isCurrent ? 0.65 : 1,
                }}>

                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: isLight ? '#000' : '#fff',
                    color: isLight ? '#fff' : '#000',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    padding: '4px 14px', borderRadius: 99,
                    display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  }}>
                    {plan.id === 'pro'
                      ? <><Zap style={{ width: 9, height: 9 }} fill={isLight ? 'white' : 'black'} /> {plan.badge}</>
                      : <><Star style={{ width: 9, height: 9 }} fill={isLight ? 'white' : 'black'} /> {plan.badge}</>
                    }
                  </div>
                )}

                {/* Price header */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                    {plan.name}
                  </p>
                  <p style={{ fontSize: 12, color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                    {plan.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    {price === 0 ? (
                      <span style={{ fontSize: 40, fontWeight: 800, color: isLight ? '#000' : '#fff', letterSpacing: '-1px' }}>Free</span>
                    ) : (
                      <>
                        <span style={{ fontSize: 36, fontWeight: 800, color: isLight ? '#000' : '#fff', letterSpacing: '-1px' }}>₹{price.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 13, color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)' }}>/mo</span>
                      </>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <p style={{ fontSize: 11, color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                      Billed ₹{(price * 12).toLocaleString('en-IN')}/year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                {isCurrent ? (
                  <div style={{
                    display: 'block', textAlign: 'center',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 10, padding: '11px 0',
                    fontSize: 13, fontWeight: 700,
                    color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                  }}>Current Plan</div>
                ) : dashboardMode ? (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoadingThis}
                    style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      background: isLight ? '#000' : '#fff',
                      color: isLight ? '#fff' : '#000',
                      borderRadius: 10, padding: '11px 0',
                      fontSize: 13, fontWeight: 700,
                      border: 'none', cursor: isLoadingThis ? 'wait' : 'pointer',
                      opacity: isLoadingThis ? 0.6 : 1,
                      transition: 'opacity 140ms',
                    }}>
                    {isLoadingThis ? 'Redirecting…' : plan.cta}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoadingThis}
                    style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      background: isLight ? '#000' : 'transparent',
                      color: isLight ? '#fff' : 'rgba(255,255,255,0.75)',
                      border: isLight ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 10, padding: '11px 0',
                      fontSize: 13, fontWeight: 700,
                      cursor: isLoadingThis ? 'wait' : 'pointer',
                      opacity: isLoadingThis ? 0.6 : 1,
                      transition: 'all 140ms',
                    }}>
                    {isLoadingThis ? 'Redirecting…' : (plan.id === 'free' ? 'Create Free Account' : plan.cta)}
                  </button>
                )}

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Check style={{ width: 14, height: 14, color: isLight ? '#000' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{f}</span>
                    </li>
                  ))}
                </ul>

              </div>
            )
          })}
        </div>

        {/* Footer note */}
        {!dashboardMode && (
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            All plans include 14-day free trial · Cancel anytime · Prices in INR · GST extra
          </p>
        )}
      </div>
    </section>
  )
}
