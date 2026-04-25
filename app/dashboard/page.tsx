'use client'
import Link from 'next/link'
import { ArrowUpRight, Activity, TrendingUp, MessageCircle, Zap, Users, ShoppingBag, BarChart3, Link2 } from 'lucide-react'

const kpis = [
  { label: 'Conversations Today', value: '147',     delta: '+12%', up: true,  color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  { label: 'New Leads',           value: '38',      delta: '+8%',  up: true,  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  { label: 'Active Flows',        value: '12',      delta: '0%',   up: false, color: 'text-fuchsia-400',bg: 'bg-fuchsia-500/10',border: 'border-fuchsia-500/20' },
  { label: 'Revenue (Month)',     value: '₹84,200', delta: '+23%', up: true,  color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
]

const recentConvos = [
  { user: '@priya_styles',   msg: 'What is the price for the course?',  time: '2m ago',  tag: 'Hot Lead', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25' },
  { user: '@rahul.fitness',  msg: 'Send me the link please',            time: '8m ago',  tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { user: '@anjali_craft',   msg: 'Is this available in bulk?',         time: '15m ago', tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { user: '@kiran.d2c',      msg: 'I want to know more about the plan', time: '32m ago', tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { user: '@meera.coaching', msg: 'Already bought! Amazing product',    time: '1h ago',  tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
]

const topContent = [
  { name: 'Reel: Pricing Tips',      dms: 89, leads: 24, revenue: '₹18,400', pct: 100 },
  { name: 'Post: Behind the Scenes', dms: 54, leads: 11, revenue: '₹9,200',  pct: 61  },
  { name: 'Story: Flash Sale',       dms: 41, leads: 9,  revenue: '₹7,600',  pct: 46  },
  { name: 'Reel: Product Demo',      dms: 33, leads: 7,  revenue: '₹5,100',  pct: 37  },
]

const quickLinks = [
  { icon: MessageCircle, label: 'Conversations', href: '/dashboard/conversations', color: 'from-violet-500 to-violet-600',  badge: '5' },
  { icon: Zap,           label: 'Automations',   href: '/dashboard/automations',   color: 'from-fuchsia-500 to-purple-600', badge: null },
  { icon: Users,         label: 'Followers',     href: '/dashboard/followers',     color: 'from-green-500 to-emerald-600',  badge: null },
  { icon: TrendingUp,    label: 'Revenue',        href: '/dashboard/revenue',       color: 'from-amber-500 to-orange-500',   badge: null },
  { icon: BarChart3,     label: 'Insights',       href: '/dashboard/insights',      color: 'from-sky-500 to-blue-600',       badge: null },
  { icon: Link2,         label: 'Products',       href: '/dashboard/products',      color: 'from-pink-500 to-rose-600',      badge: null },
]

const automations = [
  { name: "DM Keyword: 'price'",  trigger: 'DM keyword',   runs: 89,  status: 'Active' },
  { name: 'Comment: Pricing Reel', trigger: 'Post comment', runs: 54,  status: 'Active' },
  { name: 'Story Reply Flow',      trigger: 'Story reply',  runs: 23,  status: 'Paused' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Connect banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Connect your Instagram account</p>
            <p className="text-xs text-white/45 mt-0.5">Link your Instagram Business account to start automating DMs and capturing leads.</p>
          </div>
        </div>
        <button className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
          Connect Instagram <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/45 mb-2 leading-snug">{label}</div>
            <div className={`text-xs font-semibold ${up ? 'text-green-400' : 'text-white/30'}`}>
              {delta} vs last week
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickLinks.map(({ icon: Icon, label, href, color, badge }) => (
          <Link key={href} href={href}
            className="group relative flex flex-col items-center gap-2.5 p-4 bg-white/4 border border-white/8 rounded-2xl hover:bg-white/7 hover:border-white/16 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {badge && (
              <span className="absolute top-2 right-2 bg-violet-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">{badge}</span>
            )}
            <span className="text-xs font-medium text-white/55 group-hover:text-white text-center transition-colors leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent conversations */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-sm">Recent Conversations</h2>
            <Link href="/dashboard/conversations" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentConvos.map(({ user, msg, time, tag, tagColor }) => (
              <div key={user} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-white/10">
                  {user[1].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white">{user}</span>
                    <span className="text-xs text-white/25 flex-shrink-0">{time}</span>
                  </div>
                  <p className="text-xs text-white/45 mt-0.5 truncate">{msg}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${tagColor}`}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-sm">Top Content This Month</h2>
            <Link href="/dashboard/insights" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
              Full report <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {topContent.map(({ name, dms, leads, revenue, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white/75 truncate max-w-[60%]">{name}</span>
                  <span className="text-xs font-bold text-green-400">{revenue}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full mb-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex gap-3 text-xs text-white/30">
                  <span>{dms} DMs</span>
                  <span>{leads} leads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active automations */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-sm">Active Automations</h2>
          <Link href="/dashboard/automations" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
            Manage <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {automations.map(a => (
            <div key={a.name} className="p-4 bg-white/4 rounded-xl border border-white/8 hover:bg-white/6 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-white leading-snug">{a.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                  a.status === 'Active'
                    ? 'bg-green-500/15 text-green-300 border-green-500/25'
                    : 'bg-white/5 text-white/35 border-white/10'
                }`}>{a.status}</span>
              </div>
              <div className="text-xs text-white/40">{a.trigger}</div>
              <div className="text-xs text-white/25 mt-1">{a.runs} runs this month</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
