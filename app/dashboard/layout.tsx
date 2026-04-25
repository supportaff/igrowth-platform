'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Zap, LayoutDashboard, MessageCircle, Settings, Users, BarChart3,
  Link2, ShoppingBag, Bell, LogOut, Menu, X, TrendingUp
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',         href: '/dashboard' },
  { icon: MessageCircle,  label: 'Conversations',     href: '/dashboard/conversations' },
  { icon: Zap,            label: 'Automations',       href: '/dashboard/automations' },
  { icon: Users,          label: 'Followers CRM',     href: '/dashboard/followers' },
  { icon: BarChart3,      label: 'Content Insights',  href: '/dashboard/insights' },
  { icon: TrendingUp,     label: 'Revenue',           href: '/dashboard/revenue' },
  { icon: Link2,          label: 'Products & Links',  href: '/dashboard/products' },
  { icon: Settings,       label: 'Settings',          href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const activeLabel = navItems.find(n =>
    n.href === pathname || (n.href !== '/dashboard' && pathname.startsWith(n.href))
  )?.label ?? 'Overview'

  function handleLogout() {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex">

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0f0e1c] border-r border-white/8 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/8 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">iGrowth</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                    : 'text-white/45 hover:text-white hover:bg-white/5'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {label === 'Conversations' && (
                  <span className="ml-auto bg-violet-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">5</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold flex-shrink-0">D</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Demo User</div>
              <div className="text-xs text-white/40 truncate">demo@igrowth.app</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Area ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a14]/85 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white p-1" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">{activeLabel}</h1>
              <p className="text-xs text-white/35">Welcome back, Demo User</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Instagram not connected
            </div>

            {/* Notification button */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 bg-[#14131f] border border-white/10 rounded-2xl shadow-xl shadow-black/40 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/8">
                    <p className="text-sm font-semibold text-white">Notifications</p>
                  </div>
                  {[
                    { msg: 'New lead from Reel: Pricing Tips', time: '2m ago', dot: 'bg-violet-400' },
                    { msg: '@priya_styles replied to your DM', time: '10m ago', dot: 'bg-green-400' },
                    { msg: 'Automation "DM Keyword" hit 100 runs', time: '1h ago', dot: 'bg-amber-400' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 cursor-pointer border-b border-white/5 last:border-0 transition-colors">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                      <div>
                        <p className="text-xs text-white/80">{n.msg}</p>
                        <p className="text-xs text-white/30 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-white/8">
                    <button className="text-xs text-violet-400 hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
