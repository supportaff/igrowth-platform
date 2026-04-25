'use client'
import { useRouter } from 'next/navigation'
import {
  BarChart3, Calendar, ChevronRight, Globe, Handshake,
  MessageSquareText, Tag, Zap, MessageCircle, Check,
} from 'lucide-react'

const features = [
  { title: 'Instagram DM Automation', description: 'Set up multi-step DM flows triggered by keywords or comments. Reply, ask questions, save answers, and assign tags automatically.', icon: Zap },
  { title: 'Brand Deal Tracker', description: 'Manage every collab from outreach to payment with deliverables, deadlines, and deal value in one clear pipeline.', icon: Handshake },
  { title: 'Content Intelligence', description: 'See which reels and posts trigger the most DMs and brand interest so you can post what grows income.', icon: BarChart3 },
  { title: 'Audience Intelligence', description: 'Use top cities, countries, and age/gender breakdown when pitching brands with confidence.', icon: Globe },
  { title: 'Collab Calendar', description: 'Keep every deadline in one calendar so you never miss a deliverable or double-book your content slots.', icon: Calendar },
  { title: 'Unified Conversations', description: 'All your Instagram DMs in one place with full contact history, tags, and quick reply templates.', icon: MessageCircle },
]

const faqs = [
  { q: 'Does this work with personal Instagram accounts?', a: "No. Instagram's API only supports Business and Creator accounts. Switching is free and takes under 2 minutes inside the Instagram app." },
  { q: 'Will my account get banned for using this?', a: "No. We use Instagram's official API with rate limits and safety controls built in. No scraping, no bots, and no third-party hacks." },
  { q: 'What happens when I hit my plan limit?', a: 'We show you a clear warning and let you upgrade. We never cut off your access without notice.' },
  { q: 'Can I try before connecting Instagram?', a: 'Yes. The full app runs on demo data so you can explore every feature before connecting your account.' },
  { q: 'Is my Instagram token stored securely?', a: "Yes. Access tokens are encrypted at rest and auto-refreshed before expiry so your connection never breaks silently." },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from the billing page at any time. No hidden fees, no lock-ins.' },
]

const planCards = [
  {
    name: 'FREE', price: '₹0', period: 'forever', cta: 'Get started free', highlighted: false,
    points: ['1,000 DMs per month', '500 contacts', '5 active automations', 'Content insights: last 7 days', '5 active brand deals', 'Collab calendar'],
  },
  {
    name: 'CREATOR', price: '₹499', period: 'per month', cta: 'Start Creator plan', highlighted: true,
    points: ['Unlimited DMs', 'Unlimited contacts', 'Unlimited automations', 'Full contact CRM', 'Content insights: last 90 days', 'Audience demographics', '25 active brand deals', 'Collab calendar', 'Email support'],
  },
  {
    name: 'GROWTH', price: '₹999', period: 'per month', cta: 'Start Growth plan', highlighted: false,
    points: ['Everything in Creator', 'Unlimited brand deals', 'Re-engagement flows', 'Content insights: last 180 days', 'Deal PDF export', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'AGENCY', price: '₹2,499', period: 'per month', cta: 'Contact us', highlighted: false,
    points: ['Up to 10 Instagram accounts', 'Team member access (5 seats)', 'Client workspaces', 'Branded exports & reports', 'Dedicated onboarding', 'SLA-backed support'],
  },
]

const howItWorksSteps = [
  'Sign up with Google',
  'Connect your Instagram Business account',
  'Set up your first automation flow',
  'Watch conversations and deals organize automatically',
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <button className="text-left text-xl font-extrabold text-black tracking-tight"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            iGrowth
          </button>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/login')}
              className="rounded-full px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100 transition-colors">
              Login
            </button>
            <button onClick={() => router.push('/signup')}
              className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 py-16 lg:px-8">

        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-600 tracking-wide uppercase">
            The Instagram OS for creators
          </span>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-black sm:text-6xl lg:text-7xl max-w-4xl">
            Automate DMs. Close brand deals. Grow smarter.
          </h1>
          <p className="max-w-xl text-lg text-gray-500 leading-relaxed">
            iGrowth is the all-in-one workspace built for Instagram creators — automate conversations, manage brand deals, and track every collab in one clean dashboard.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => router.push('/signup')}
              className="h-12 rounded-full bg-black text-white px-8 text-sm font-semibold hover:bg-gray-800 transition-colors">
              Start for free
            </button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-12 rounded-full border border-gray-300 bg-white text-gray-800 px-8 text-sm hover:bg-gray-50 transition-colors flex items-center gap-1">
              See how it works <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-400">Free forever plan · No credit card needed · Works with Instagram Business &amp; Creator accounts</p>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { stat: '10K+', label: 'Creators onboarded' },
            { stat: '5M+', label: 'DMs automated' },
            { stat: '₹2Cr+', label: 'Brand deals tracked' },
            { stat: '4.9★', label: 'Average rating' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
              <p className="text-2xl font-extrabold text-black">{item.stat}</p>
              <p className="mt-1 text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Problem */}
        <section className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Sound familiar?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { text: 'You reply to the same DMs manually every single day', accent: 'border-l-4 border-black' },
              { text: 'You lose track of brand deals across WhatsApp and email', accent: 'border-l-4 border-gray-400' },
              { text: 'You have no idea which Reel actually made you money', accent: 'border-l-4 border-gray-300' },
            ].map((item) => (
              <article key={item.text} className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${item.accent}`}>
                <MessageSquareText className="mb-3 h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-800">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Everything a creator needs.</h2>
            <p className="mt-2 text-gray-500">Nothing they don&apos;t.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <article key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                  <div className={`inline-flex rounded-xl p-2.5 ${idx % 2 === 0 ? 'bg-black' : 'bg-gray-100'}`}>
                    <Icon className={`h-5 w-5 ${idx % 2 === 0 ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Up and running in 5 minutes.</h2>
            <p className="mt-2 text-gray-500">No setup guide needed.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {howItWorksSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-gray-800">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="space-y-8">
          <h2 className="text-3xl font-extrabold text-black">Creators who stopped doing it manually.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { quote: 'I used to spend 2 hours a day replying to DMs. Now my flows handle 90% of them and I focus on content.', name: '@priya.lifestyle', niche: 'Lifestyle · 180K followers' },
              { quote: 'Finally a place where I can track all my brand deals. No more lost emails and missed deadlines.', name: '@fitwithrohit', niche: 'Fitness · 95K followers' },
              { quote: 'The content insights showed me that my Reels drive 10x more DM inquiries than photo posts.', name: '@delhi.foodie', niche: 'Food · 210K followers' },
            ].map((item) => (
              <article key={item.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-black text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.niche}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Simple pricing. Built for creators.</h2>
            <p className="mt-2 text-gray-500">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {planCards.map((plan) => (
              <article key={plan.name}
                className={`relative rounded-2xl border p-6 transition-shadow ${
                  plan.highlighted ? 'border-black bg-black text-white shadow-xl' : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
                }`}>
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-black shadow-sm">
                    Most Popular
                  </span>
                )}
                <h3 className={`font-extrabold text-xs tracking-widest uppercase ${plan.highlighted ? 'text-gray-300' : 'text-gray-400'}`}>{plan.name}</h3>
                <p className={`mt-3 text-3xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-black'}`}>{plan.price}</p>
                <p className={`text-xs mt-0.5 ${plan.highlighted ? 'text-gray-400' : 'text-gray-400'}`}>{plan.period}</p>
                <ul className="mt-5 space-y-2.5">
                  {plan.points.map((point) => (
                    <li key={point} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? 'text-white' : 'text-black'}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => plan.name === 'AGENCY' ? window.location.href = 'mailto:support@afforal.com' : router.push('/signup')}
                  className={`mt-6 w-full rounded-full py-2.5 text-sm font-semibold transition-colors ${
                    plan.highlighted ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">All paid plans include a 7-day free trial. Cancel anytime. No hidden fees.</p>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold text-black">Common questions.</h2>
          <div className="rounded-2xl border border-gray-100 bg-white px-4 divide-y divide-gray-100">
            {faqs.map((item, index) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-gray-900 font-medium hover:text-black list-none">
                  {item.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl bg-black p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">Ready to grow smarter?</h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">Join thousands of creators already using iGrowth to automate DMs and close more brand deals.</p>
          <button onClick={() => router.push('/signup')}
            className="mt-6 h-12 rounded-full bg-white text-black px-8 text-sm font-semibold hover:bg-gray-100 transition-colors">
            Start for free — no card needed
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-100 bg-black">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 text-sm text-gray-400 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-extrabold text-white">iGrowth</p>
            <p className="mt-2 text-gray-400 text-sm">The Instagram OS for creators.</p>
            <a href="mailto:support@afforal.com" className="mt-3 inline-block text-sm text-gray-400 hover:text-white transition-colors">
              support@afforal.com
            </a>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 content-start">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <button className="hover:text-white transition-colors" onClick={() => router.push('/login')}>Login</button>
            <button className="hover:text-white transition-colors" onClick={() => router.push('/signup')}>Sign Up</button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 content-start justify-start md:justify-end">
            <button className="hover:text-white transition-colors" onClick={() => router.push('/privacy')}>Privacy Policy</button>
            <button className="hover:text-white transition-colors" onClick={() => router.push('/terms')}>Terms of Service</button>
            <a href="mailto:support@afforal.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <p className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-600">
          © 2026 iGrowth · Powered by Afforal. Not affiliated with Meta or Instagram.
        </p>
      </footer>
    </div>
  )
}
