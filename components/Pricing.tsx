'use client'
import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'forever',
    desc: 'Get started with no commitment.',
    features: [
      '100 DMs / month',
      '1 active automation',
      '2 keyword triggers',
      '1 Instagram account',
      'Basic analytics (7 days)',
      'No content scheduling',
      '1 workspace member',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Starter',
    monthlyPrice: 299,
    yearlyPrice: 239,
    period: '/month',
    desc: 'For creators ready to grow.',
    badge: 'Most Popular',
    features: [
      '5,000 DMs / month',
      '5 active automations',
      '20 keyword triggers',
      'Comment auto-reply',
      '1 Instagram account',
      'Standard analytics (30 days)',
      '10 posts / month scheduling',
      '500 AI-generated replies / month',
      'Email support',
      '2 workspace members',
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Pro',
    monthlyPrice: 499,
    yearlyPrice: 399,
    period: '/month',
    desc: 'Unlimited power for serious businesses.',
    features: [
      'Unlimited DMs',
      'Unlimited automations',
      'Unlimited keyword triggers',
      'Comment auto-reply',
      '3 Instagram accounts',
      'Advanced analytics (90 days)',
      'Unlimited post scheduling',
      'Unlimited AI-generated replies',
      'Email + chat support',
      '5 workspace members',
    ],
    cta: 'Go Pro',
    highlight: false,
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Simple, honest <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            No hidden fees. Cancel any time.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button
              onClick={() => setYearly(v => !v)}
              className={`relative w-10 h-6 rounded-full transition-all ${yearly ? 'bg-gradient-to-r from-brand-500 to-accent-500' : 'bg-white/15'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${yearly ? 'left-5' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-white' : 'text-white/40'}`}>
              Yearly <span className="text-xs text-green-400 font-semibold ml-1">Save ~20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map(plan => {
            const price = plan.monthlyPrice === 0
              ? '₹0'
              : yearly
                ? `₹${plan.yearlyPrice}`
                : `₹${plan.monthlyPrice}`
            const sub = plan.monthlyPrice === 0
              ? 'forever'
              : yearly
                ? '/month, billed yearly'
                : '/month'

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border flex flex-col ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-brand-500/20 to-accent-500/10 border-brand-500/50 glow'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3" fill="white" />
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-white/60 text-sm font-medium mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-white">{price}</span>
                    <span className="text-white/40 text-sm mb-1.5">{sub}</span>
                  </div>
                  <p className="text-white/50 text-sm">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`block text-center font-semibold py-3 rounded-xl text-sm transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:opacity-90'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
