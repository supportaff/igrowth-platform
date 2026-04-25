'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Zap, BarChart3, Settings,
  Bell, Menu, X, Sparkles, TrendingUp,
  ChevronRight, Briefcase, Crown
} from 'lucide-react'
import UpgradeModal from '@/components/UpgradeModal'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',   href: '/dashboard' },
  { icon: Zap,             label: 'Automations', href: '/dashboard/automations' },
  { icon: Briefcase,       label: 'Brand Kit',   href: '/dashboard/brands' },
  { icon: BarChart3,       label: 'Insights',    href: '/dashboard/insights' },
  { icon: Settings,        label: 'Settings',    href: '/dashboard/settings' },
]

const PLAN = { name: 'Free', dms: 0, dmsMax: 1000, contacts: 0, contactsMax: 1000, automations: 0, automationsMax: 5 }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const activeItem = navItems.find(n =>
    n.href === '/dashboard' ? pathname === n.href : pathname.startsWith(n.href)
  )

  useEffect(() => {
    const el = document.querySelector('.main-scroll')
    if (!el) return
    const h = () => setScrolled((el as HTMLElement).scrollTop > 8)
    el.addEventListener('scroll', h)
    return () => el.removeEventListener('scroll', h)
  }, [])

  const usageBars = [
    { label: 'DMs',        used: PLAN.dms,        max: PLAN.dmsMax,        unit: 'DMs/mo' },
    { label: 'Contacts',   used: PLAN.contacts,   max: PLAN.contactsMax,   unit: 'contacts' },
    { label: 'Automations',used: PLAN.automations,max: PLAN.automationsMax,unit: 'flows' },
  ]

  return (
    <div style={{ background: 'var(--bg)' }} className="min-h-screen text-white flex">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--border)' }}
        className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div style={{ borderBottom: '1px solid var(--border)' }}
          className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-black" fill="black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight">Afforal</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '10px' }} className="leading-tight">IG Growth</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"
            style={{ color: 'var(--text-muted)' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                style={active
                  ? { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'rgba(255,255,255,0.12)' }
                  : { color: 'var(--text-secondary)' }
                }
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all border
                  ${active ? 'border' : 'border-transparent hover:bg-white/5 hover:text-white'}`}>
                <Icon className="w-[15px] h-[15px] flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 opacity-40" />}
              </Link>
            )
          })}
        </nav>

        {/* Usage bars */}
        <div className="px-3 pb-2">
          <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '10px' }}
            className="p-3 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.06em' }}
                className="uppercase font-semibold">Usage · Free</span>
            </div>
            {usageBars.map(b => {
              const pct = Math.min(100, Math.round((b.used / b.max) * 100))
              const warn = pct >= 80
              return (
                <div key={b.label}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{b.label}</span>
                    <span style={{ color: warn ? 'var(--amber)' : 'var(--text-muted)', fontSize: '10px' }}>
                      {b.used}/{b.max}
                    </span>
                  </div>
                  <div style={{ background: 'var(--surface-4)', borderRadius: '99px', height: '3px' }}>
                    <div style={{
                      width: `${pct}%`, height: '3px', borderRadius: '99px',
                      background: warn ? 'var(--amber)' : 'rgba(255,255,255,0.7)',
                      transition: 'width 600ms ease'
                    }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => setUpgradeOpen(true)}
              style={{ background: 'white', color: 'black', fontSize: '11px', borderRadius: '8px' }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 font-bold hover:bg-white/90 transition-colors mt-1">
              <Crown className="w-3 h-3" />
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* User */}
        <div style={{ borderTop: '1px solid var(--border)' }} className="px-3 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <UserButton afterSignOutUrl="/login" appearance={{
              elements: { avatarBox: 'w-7 h-7 rounded-full ring-1 ring-white/20' }
            }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '12px' }} className="font-semibold text-white truncate">
                {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'User'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="truncate">
                {user?.emailAddresses?.[0]?.emailAddress ?? ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ───────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          style={{
            background: scrolled ? 'rgba(8,8,8,0.9)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            transition: 'all 200ms ease',
          }}
          className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-muted)' }} aria-label="Open menu">
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[13px] font-semibold text-white">{activeItem?.label ?? 'Overview'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Afforal IG Growth</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setUpgradeOpen(true)}
              style={{ background: 'white', color: 'black', fontSize: '11px', borderRadius: '8px' }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-bold hover:bg-white/90 transition-colors">
              <Crown className="w-3 h-3" />
              Upgrade
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                style={{ color: 'var(--text-muted)' }}
                className="relative p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white pulse-dot" />
              </button>
              {notifOpen && (
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', zIndex: 50 }}
                  className="absolute right-0 top-11 w-72 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                  <div style={{ borderBottom: '1px solid var(--border)' }}
                    className="px-4 py-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-white">Notifications</p>
                    <span style={{ background: 'var(--surface-4)', color: 'var(--text-muted)', fontSize: '10px' }}
                      className="px-2 py-0.5 rounded-full">3 new</span>
                  </div>
                  {[
                    { msg: 'New DM from @priya_styles', time: '2m ago', icon: Zap, color: '#22c55e' },
                    { msg: 'Automation hit 100 runs', time: '10m ago', icon: Zap, color: '#f59e0b' },
                    { msg: 'New brand collab request', time: '1h ago', icon: Briefcase, color: '#3b82f6' },
                  ].map((n, i) => (
                    <div key={i}
                      style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/3 cursor-pointer transition-colors">
                      <div style={{ background: `${n.color}18`, borderRadius: '8px' }}
                        className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <n.icon style={{ color: n.color }} className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{n.msg}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)' }} className="px-4 py-2.5">
                    <button style={{ fontSize: '11px', color: 'var(--text-muted)' }}
                      className="hover:text-white transition-colors">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-scroll flex-1 px-4 sm:px-6 py-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  )
}
