import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Try iGrowth with no commitment.',
    features: [
      '500 DMs / month',
      '500 contacts',
      'Basic automations',
      'CRM preview',
      'Content insights (limited)',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '₹249',
    period: '/month',
    desc: 'Everything a serious creator needs.',
    badge: 'Most Popular',
    features: [
      'Unlimited DMs',
      'Unlimited contacts',
      'Unlimited automations',
      'Follower CRM',
      'Smart link tracking',
      'Content → conversion analytics',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Growth',
    price: '₹349',
    period: '/month',
    desc: 'For businesses scaling on Instagram.',
    features: [
      'Everything in Creator',
      'Advanced segmentation',
      'Revenue & order tracking',
      'Re-engagement campaigns',
      'Higher rate limits',
      'Priority support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Agency',
    price: '₹999',
    period: '/month',
    desc: 'Manage multiple clients with ease.',
    features: [
      'Multiple Instagram accounts',
      'Team access',
      'Client workspaces',
      'Branded reports',
      'Dedicated onboarding',
    ],
    cta: 'Contact Us',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Simple, honest <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            More value. 35–40% cheaper than alternatives. Cancel any time.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
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
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm mb-1.5">{plan.period}</span>
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
          ))}
        </div>
      </div>
    </section>
  )
}
