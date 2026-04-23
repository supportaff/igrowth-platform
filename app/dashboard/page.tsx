'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Zap, Home, MessageCircle, Settings, Users, BarChart3,
  Link2, ShoppingBag, TrendingUp, Bell, LogOut, Menu, X,
  ArrowUpRight, Activity
} from 'lucide-react'

const navItems = [
  { icon: Home,          label: 'Home',             href: '#home' },
  { icon: MessageCircle, label: 'Conversations',    href: '#conversations' },
  { icon: Zap,           label: 'Automations',      href: '#automations' },
  { icon: Users,         label: 'Followers (CRM)',  href: '#followers' },
  { icon: BarChart3,     label: 'Content Insights', href: '#insights' },
  { icon: Link2,         label: 'Products & Links', href: '#products' },
  { icon: ShoppingBag,   label: 'Revenue',          href: '#revenue' },
  { icon: Settings,      label: 'Settings',         href: '#settings' },
]

const kpis = [
  { label: 'Conversations Today', value: '147',       delta: '+12%', color: 'text-brand-400',  bg: 'bg-brand-500/10',  border: 'border-brand-500/20' },
  { label: 'New Leads',           value: '38',        delta: '+8%',  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  { label: 'Active Flows',        value: '12',        delta: '0%',   color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
  { label: 'Revenue (Month)',     value: '\u20b984,200', delta: '+23%', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
]

const topContent = [
  { name: 'Reel: Pricing Tips',         dms: 89, leads: 24, revenue: '\u20b918,400', pct: 100 },
  { name: 'Post: Behind the Scenes',    dms: 54, leads: 11, revenue: '\u20b99,200',  pct: 64  },
  { name: 'Story: Flash Sale',          dms: 41, leads: 9,  revenue: '\u20b97,600',  pct: 49  },
  { name: 'Reel: Product Demo',         dms: 33, leads: 7,  revenue: '\u20b95,100',  pct: 38  },
]

const recentConvos = [
  { user: '@priya_styles',   msg: 'What is the price for the course?',  time: '2m ago',   tag: 'Hot Lead',  tagColor: 'bg-red-500/15 text-red-300 border-red-500/25' },
  { user: '@rahul.fitness',  msg: 'Send me the link please',            time: '8m ago',   tag: 'Lead',      tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { user: '@anjali_craft',   msg: 'Is this available in bulk?',         time: '15m ago',  tag: 'Buyer',     tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { user: '@kiran.d2c',      msg: 'I want to know more about the plan', time: '32m ago',  tag: 'Lead',      tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { user: '@meera.coaching', msg: 'Already bought! Amazing product',    time: '1h ago',   tag: 'Buyer',     tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [active, setActive] = useState('Home')

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#13121f] border-r border-white/8 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">iGrowth</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => { setActive(label); setSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active === label
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold">D</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Demo User</div>
              <div className="text-xs text-white/40 truncate">demo@igrowth.app</div>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </Link>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">{active}</h1>
              <p className="text-xs text-white/40">Welcome back, Demo User</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Instagram not connected badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-xs text-yellow-400">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Instagram not connected
            </div>
            <button className="relative text-white/50 hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-8 space-y-8 max-w-6xl w-full mx-auto">

          {/* Connect Instagram banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-brand-500/10 border border-brand-500/25">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Connect your Instagram account</div>
                <div className="text-xs text-white/50 mt-0.5">Link your Instagram Business account to start automating DMs and capturing leads.</div>
              </div>
            </div>
            <button className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
              Connect Instagram
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(({ label, value, delta, color, bg, border }) => (
              <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
                <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
                <div className="text-xs text-white/50 mb-2">{label}</div>
                <div className={`text-xs font-semibold ${delta.startsWith('+') ? 'text-green-400' : 'text-white/30'}`}>{delta} vs last week</div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Recent Conversations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-sm">Recent Conversations</h2>
                <a href="#conversations" onClick={() => setActive('Conversations')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-3">
                {recentConvos.map(({ user, msg, time, tag, tagColor }) => (
                  <div key={user} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/40 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {user[1].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{user}</span>
                        <span className="text-xs text-white/30 flex-shrink-0">{time}</span>
                      </div>
                      <p className="text-xs text-white/50 mt-0.5 truncate">{msg}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${tagColor}`}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Content */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-sm">Top Content This Month</h2>
                <a href="#insights" onClick={() => setActive('Content Insights')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                  Full report <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-4">
                {topContent.map(({ name, dms, leads, revenue, pct }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-white/80 truncate max-w-[60%]">{name}</span>
                      <span className="text-xs font-bold text-green-400">{revenue}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full mb-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex gap-3 text-xs text-white/35">
                      <span>{dms} DMs</span>
                      <span>{leads} leads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Automations preview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-sm">Active Automations</h2>
              <a href="#automations" onClick={() => setActive('Automations')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                Manage <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { name: 'DM Keyword: \'price\'',  trigger: 'DM keyword',  runs: 89,  status: 'Active' },
                { name: 'Comment: Pricing Reel',  trigger: 'Post comment', runs: 54,  status: 'Active' },
                { name: 'Story Reply Flow',        trigger: 'Story reply',  runs: 23,  status: 'Paused' },
              ].map(a => (
                <div key={a.name} className="p-4 bg-white/5 rounded-xl border border-white/8">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-white">{a.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      a.status === 'Active'
                        ? 'bg-green-500/15 text-green-300 border-green-500/25'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}>{a.status}</span>
                  </div>
                  <div className="text-xs text-white/40">{a.trigger}</div>
                  <div className="text-xs text-white/30 mt-1">{a.runs} runs this month</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
