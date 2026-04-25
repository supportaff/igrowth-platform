'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  Zap, LayoutDashboard, MessageCircle, Settings, Users,
  BarChart3, Bell, Menu, X
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',        href: '/dashboard' },
  { icon: MessageCircle,   label: 'Conversations',   href: '/dashboard/conversations' },
  { icon: Zap,             label: 'Automations',     href: '/dashboard/automations' },
  { icon: Users,           label: 'Followers CRM',   href: '/dashboard/followers' },
  { icon: BarChart3,       label: 'Insights',        href: '/dashboard/insights' },
  { icon: Settings,        label: 'Settings',        href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const activeLabel = navItems.find(n =>
    n.href === '/dashboard' ? pathname === n.href : pathname.startsWith(n.href)
  )?.label ?? 'Overview'

  const firstName = user?.firstName ?? 'there'
  const avatarLetter = (user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? 'U').toUpperCase()

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0f0e1c] border-r border-white/8 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/8 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">iGrowth</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

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

        {/* User area — Clerk UserButton */}
        <div className="px-3 py-4 border-t border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <UserButton afterSignOutUrl="/login" appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-full ring-1 ring-violet-500/30',
              }
            }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.fullName ?? 'User'}</div>
              <div className="text-xs text-white/40 truncate">{user?.emailAddresses?.[0]?.emailAddress ?? ''}</div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a14]/85 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white p-1" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">{activeLabel}</h1>
              <p className="text-xs text-white/35">Welcome back, {firstName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Instagram not connected
            </div>

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

        <main className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
