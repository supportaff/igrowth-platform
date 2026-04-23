'use client'
import Link from 'next/link'
import { ArrowRight, MessageCircle, TrendingUp, Users } from 'lucide-react'

const stats = [
  { icon: MessageCircle, label: 'DMs Automated', value: '2.4M+' },
  { icon: Users,         label: 'Leads Captured', value: '180K+' },
  { icon: TrendingUp,    label: 'Avg Revenue Lift', value: '3.2x' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          Built for Instagram Creators &amp; Businesses
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          Turn Instagram
          <br />
          <span className="gradient-text">Conversations</span>
          <br />
          into Revenue
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Automate DMs, capture leads, understand which content makes money,
          and manage followers like a CRM &mdash; all without the complexity.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup" className="group flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold px-8 py-4 rounded-full text-lg hover:opacity-90 transition-all glow">
            Start Free &mdash; No Card Needed
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how-it-works" className="flex items-center gap-2 border border-white/20 text-white/80 font-medium px-8 py-4 rounded-full text-lg hover:bg-white/5 transition-colors">
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mock Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="card-glass max-w-4xl mx-auto p-6 glow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="ml-4 text-xs text-white/30">iGrowth Dashboard</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Conversations Today', value: '147', color: 'text-brand-400' },
                { label: 'New Leads', value: '38', color: 'text-green-400' },
                { label: 'Active Flows', value: '12', color: 'text-accent-400' },
                { label: 'Revenue (Month)', value: '\u20b984,200', color: 'text-yellow-400' },
              ].map(item => (
                <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/8">
                  <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-white/40 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Reel: Pricing Tips', dms: '89 DMs', leads: '24 leads', bar: 'w-full' },
                { name: 'Post: Behind the Scenes', dms: '54 DMs', leads: '11 leads', bar: 'w-2/3' },
                { name: 'Story: Flash Sale', dms: '41 DMs', leads: '9 leads', bar: 'w-1/2' },
              ].map(item => (
                <div key={item.name} className="bg-white/5 rounded-xl p-3 border border-white/8">
                  <div className="text-xs font-medium text-white/80 mb-2 truncate">{item.name}</div>
                  <div className="h-1.5 bg-white/10 rounded-full mb-2">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 ${item.bar}`} />
                  </div>
                  <div className="text-xs text-white/40">{item.dms} &middot; {item.leads}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
