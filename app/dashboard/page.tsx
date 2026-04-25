'use client'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { MessageCircle, Zap, Users, BarChart3, Instagram, ArrowRight, TrendingUp, Clock } from 'lucide-react'

const KPI = [
  { label: 'DMs Sent Today',    value: '124',  delta: '+18%', color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { label: 'Active Leads',      value: '38',   delta: '+5',   color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  { label: 'Automations Live',  value: '4',    delta: '',     color: 'text-green-400',   bg: 'bg-green-500/10' },
  { label: 'Followers Gained',  value: '+83',  delta: 'Today',color: 'text-amber-400',  bg: 'bg-amber-500/10' },
]

const quickNav = [
  { icon: MessageCircle, label: 'Conversations', desc: 'View & reply to DMs',      href: '/dashboard/conversations', color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { icon: Zap,           label: 'Automations',   desc: 'Build & manage flows',     href: '/dashboard/automations',   color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  { icon: Users,         label: 'Followers CRM', desc: 'Manage your audience',     href: '/dashboard/followers',     color: 'text-green-400',   bg: 'bg-green-500/10' },
  { icon: BarChart3,     label: 'Insights',      desc: 'Content performance',      href: '/dashboard/insights',      color: 'text-amber-400',   bg: 'bg-amber-500/10' },
]

const recentConvos = [
  { handle: '@priya_styles',   msg: 'Hey! Can you send me the price?',   time: '2m',  status: 'new' },
  { handle: '@rahul.fitness',  msg: 'What are your packages?',           time: '8m',  status: 'replied' },
  { handle: '@sneha.eats',     msg: 'I saw your reel, very helpful!',    time: '15m', status: 'new' },
  { handle: '@arjun_dev',      msg: 'Do you offer custom plans?',        time: '1h',  status: 'replied' },
]

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName ?? 'there'

  return (
    <div className="space-y-8">

      {/* Instagram connect banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
            <Instagram className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-300">Connect Instagram to get started</p>
            <p className="text-xs text-white/40 mt-0.5">Link your Instagram Business account to enable all automations and analytics.</p>
          </div>
        </div>
        <Link href="/dashboard/settings?tab=instagram"
          className="flex-shrink-0 flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-500/30 transition-colors">
          Connect now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(k => (
          <div key={k.label} className="bg-white/4 border border-white/8 rounded-2xl p-5 space-y-2">
            <div className={`text-2xl font-extrabold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-white/40">{k.label}</div>
            {k.delta && <div className="text-xs text-green-400 font-medium">{k.delta}</div>}
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickNav.map(n => (
            <Link key={n.label} href={n.href}
              className="group bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/6 hover:border-white/12 transition-all">
              <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center mb-3`}>
                <n.icon className={`w-4 h-4 ${n.color}`} />
              </div>
              <p className="text-sm font-semibold text-white">{n.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{n.desc}</p>
              <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 mt-2 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent conversations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recent Conversations</h2>
          <Link href="/dashboard/conversations" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
          {recentConvos.map((c, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/4 transition-colors cursor-pointer ${
              i < recentConvos.length - 1 ? 'border-b border-white/6' : ''
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {c.handle[1].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{c.handle}</p>
                <p className="text-xs text-white/40 truncate">{c.msg}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-white/30">{c.time} ago</p>
                {c.status === 'new' && (
                  <span className="inline-block mt-1 text-xs bg-violet-500/20 text-violet-300 border border-violet-500/25 px-1.5 py-0.5 rounded-full">New</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
