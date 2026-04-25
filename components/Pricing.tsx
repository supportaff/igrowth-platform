'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'FREE',
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'forever',
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
    period: '/month',
    desc: 'For creators ready to grow.',
    badge: 'Most Popular',
    features: [
      'Unlimited DMs',
      'Unlimited contacts',
      'Unlimited automations',
      'Full contact CRM',
      'Content insights: last 90 days',
      'Audience demographics',
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
    period: '/month',
    desc: 'Unlimited power for serious creators.',
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
    ctaHref: '/signup',
    highlight: false,
  },
  {
    name: 'AGENCY',
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    period: '/month',
    desc: 'For teams managing multiple accounts.',
    features: [
      'Up to 10 Instagram accounts',
      'Team member access (5 seats)',
      'Client workspaces',
      'Branded exports & reports',
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
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-black mb-4">
            Simple pricing. Built for creators.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 border border-gray-200 bg-gray-50 rounded-full px-4 py-2">
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setYearly(v => !v)}
              className={`relative w-10 h-6 rounded-full transition-all ${
                yearly ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${
                yearly ? 'left-5' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-black' : 'text-gray-400'}`}>
              Yearly <span className="text-xs text-green-600 font-semibold ml-1">Save ~20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => {
            const price = plan.monthlyPrice === 0
              ? '\u20b90'
              : yearly
                ? `\u20b9${plan.yearlyPrice}`
                : `\u20b9${plan.monthlyPrice}`
            const sub = plan.monthlyPrice === 0
              ? 'forever'
              : yearly
                ? '/month, billed yearly'
                : '/month'

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border flex flex-col transition-shadow ${
                  plan.highlight
                    ? 'border-black bg-black text-white shadow-xl'
                    : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-black shadow-sm whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-5">
                  <p className={`font-extrabold text-xs tracking-widest uppercase mb-2 ${
                    plan.highlight ? 'text-gray-400' : 'text-gray-400'
                  }`}>{plan.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-3xl font-extrabold ${
                      plan.highlight ? 'text-white' : 'text-black'
                    }`}>{price}</span>
                    <span className={`text-xs mb-1.5 ${
                      plan.highlight ? 'text-gray-400' : 'text-gray-400'
                    }`}>{sub}</span>
                  </div>
                  <p className={`text-sm ${
                    plan.highlight ? 'text-gray-400' : 'text-gray-500'
                  }`}>{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${
                      plan.highlight ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? 'text-white' : 'text-black'
                      }`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center font-semibold py-2.5 rounded-full text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All paid plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
