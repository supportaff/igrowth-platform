'use client'
import { useState } from 'react'
import { Check, Minus, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────
// PLAN DEFINITIONS — edit prices/features only here
// ─────────────────────────────────────────────────────────────────
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Get started at no cost',
    color: 'dark' as const,
    features: [
      'Unlimited Automations',
      '1,000 DMs / month',
      '1,000 Contacts',
      'Re-trigger',
      'Ask For Follow',
      'Lead Gen',
      'Email Support',
    ],
    cta: 'Create a Free Account',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 0,        // shown only when monthly toggle active — set your monthly price here
    annualPrice: 499,
    description: 'Everything you need to grow',
    color: 'light' as const,
    badge: 'Most Popular',
    features: [
      'Unlimited Automations',
      'Unlimited DMs',
      'Unlimited Contacts',
      'Re-trigger',
      'Ask For Follow',
      'Lead Gen',
      'Priority Support',
    ],
    cta: 'Get Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: -1,       // -1 = custom pricing
    annualPrice: -1,
    description: 'For teams & agencies',
    color: 'dark' as const,
    features: [
      'Manage Multiple Accounts',
      'Dedicated Account Manager',
      'Custom Solutions',
      'Early Access New Features',
    ],
    cta: 'Get in Touch',
  },
]

// ─────────────────────────────────────────────────────────────────
// Feature comparison table rows
// ─────────────────────────────────────────────────────────────────
const COMPARE_ROWS: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: 'Pricing',          free: '₹0 /mo',       pro: '₹499 /mo' },
  { label: 'Automations',      free: 'Unlimited',     pro: 'Unlimited' },
  { label: 'DM Send Limit',    free: '1,000',         pro: 'Unlimited' },
  { label: 'Contacts',         free: '1,000',         pro: 'Unlimited' },
  { label: 'Re-trigger',       free: true,            pro: true },
  { label: 'Ask For Follow',   free: true,            pro: true },
  { label: 'Lead Gen',         free: true,            pro: true },
  { label: 'Support',          free: 'Email',         pro: 'Priority' },
]

// ─────────────────────────────────────────────────────────────────
interface PricingProps {
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
    // Free → go to signup
    if (plan.id === 'free') { router.push('/signup'); return }
    // Enterprise → contact
    if (plan.id === 'enterprise') { window.open('mailto:hello@igrowth.in?subject=Enterprise Plan', '_blank'); return }

    const amount = annual ? plan.annualPrice : plan.monthlyPrice
    if (amount <= 0) return

    setLoading(plan.id)
    try {
      const res = await fetch('/api/payment/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billing: annual ? 'annual' : 'monthly',
          amount,
          planName: `iGrowth ${plan.name} ${annual ? 'Annual' : 'Monthly'}`,
          userId,
          email: userEmail,
          name: userName,
          phone: userPhone,
        }),
      })
      const data = await res.json()
      if (data.fields && data.payuUrl) {
        // Build and auto-submit hidden PayU form
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.payuUrl
        form.style.display = 'none'
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
        setLoading(null)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  const cardBg   = (isLight: boolean) => isLight ? '#fff' : '#0d0d0d'
  const cardBdr  = (isLight: boolean) => isLight ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.08)'
  const txtMain  = (isLight: boolean) => isLight ? '#000' : '#fff'
  const txtMuted = (isLight: boolean) => isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.45)'
  const txtFaint = (isLight: boolean) => isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)'

  return (
    <section
      id="pricing"
      style={{
        background: dashboardMode ? 'transparent' : '#000',
        padding: dashboardMode ? '0' : 'clamp(64px,8vw,120px) 0',
        borderTop: dashboardMode ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: dashboardMode ? '0' : '0 24px' }}>

        {/* ── Section header (homepage only) ── */}
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
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
              Start free. Upgrade when you&apos;re ready to scale.
            </p>
          </div>
        )}

        {/* ── Billing toggle ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 99, padding: 4, gap: 4,
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

        {/* ── Plan cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16, alignItems: 'stretch', marginBottom: 48,
        }}>
          {PLANS.map(plan => {
            const isLight      = plan.color === 'light'
            const price        = annual ? plan.annualPrice : plan.monthlyPrice
            const isCustom     = price === -1
            const isCurrent    = dashboardMode && currentPlan === plan.id
            const isLoadingThis = loading === plan.id

            return (
              <div
                key={plan.id}
                style={{
                  background: cardBg(isLight),
                  border: cardBdr(isLight),
                  borderRadius: 18, padding: '30px 26px',
                  display: 'flex', flexDirection: 'column', gap: 20,
                  position: 'relative',
                  boxShadow: isLight
                    ? '0 0 0 1px rgba(255,255,255,0.15), 0 24px 64px rgba(255,255,255,0.08)'
                    : 'none',
                  opacity: isCurrent ? 0.6 : 1,
                }}>

                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: '#000', color: '#fff',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    padding: '4px 14px', borderRadius: 99,
                    display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    <Zap style={{ width: 9, height: 9 }} fill="white" /> {plan.badge}
                  </div>
                )}

                {/* Price */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: txtMuted(isLight), marginBottom: 4 }}>
                    {plan.name}
                  </p>
                  <p style={{ fontSize: 12, color: txtFaint(isLight), marginBottom: 12 }}>
                    {plan.description}
                  </p>
                  {isCustom ? (
                    <span style={{ fontSize: 34, fontWeight: 800, color: txtMain(isLight), letterSpacing: '-0.5px' }}>
                      Custom
                    </span>
                  ) : price === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: txtMain(isLight), letterSpacing: '-1px' }}>₹0</span>
                      <span style={{ fontSize: 13, color: txtFaint(isLight) }}>/account /month</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 40, fontWeight: 800, color: txtMain(isLight), letterSpacing: '-1px' }}>
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 13, color: txtFaint(isLight) }}>/account /month</span>
                      </div>
                      {annual && (
                        <p style={{ fontSize: 11, color: txtFaint(isLight), marginTop: 3 }}>
                          billed annually · ₹{(price * 12).toLocaleString('en-IN')}/year
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{
                    textAlign: 'center',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 10, padding: '11px 0',
                    fontSize: 13, fontWeight: 700,
                    color: txtMuted(isLight),
                  }}>Current Plan</div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoadingThis}
                    style={{
                      width: '100%', textAlign: 'center',
                      background: isLight ? '#000' : 'transparent',
                      color: isLight ? '#fff' : 'rgba(255,255,255,0.75)',
                      border: isLight ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 10, padding: '11px 0',
                      fontSize: 13, fontWeight: 700,
                      cursor: isLoadingThis ? 'wait' : 'pointer',
                      opacity: isLoadingThis ? 0.6 : 1,
                      transition: 'all 140ms',
                    }}>
                    {isLoadingThis ? 'Redirecting…' : plan.cta}
                  </button>
                )}

                {/* Features list */}
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

        {/* ── Feature comparison table ── */}
        <div style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, overflow: 'hidden',
          marginBottom: dashboardMode ? 0 : 0,
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Features
            </div>
            <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Free
            </div>
            <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#fff', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
              Pro ⚡
            </div>
          </div>

          {/* Rows */}
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: i < COMPARE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
              <div style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                {row.label}
              </div>
              <div style={{ padding: '13px 20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {typeof row.free === 'boolean'
                  ? row.free
                    ? <Check style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.4)' }} />
                    : <Minus style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)' }} />
                  : <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{row.free}</span>
                }
              </div>
              <div style={{ padding: '13px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {typeof row.pro === 'boolean'
                  ? row.pro
                    ? <Check style={{ width: 15, height: 15, color: '#fff' }} />
                    : <Minus style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)' }} />
                  : <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{row.pro}</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        {!dashboardMode && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            Prices in INR · GST extra · Cancel anytime
          </p>
        )}

      </div>
    </section>
  )
}
