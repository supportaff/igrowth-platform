'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Zap, BarChart3, Settings,
  Bell, Menu, X, Sparkles,
  ChevronRight, Briefcase, Crown
} from 'lucide-react'
import UpgradeModal from '@/components/UpgradeModal'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',    href: '/dashboard' },
  { icon: Zap,             label: 'Automations', href: '/dashboard/automations' },
  { icon: Briefcase,       label: 'Brand Kit',   href: '/dashboard/brands' },
  { icon: BarChart3,       label: 'Insights',    href: '/dashboard/insights' },
  { icon: Settings,        label: 'Settings',    href: '/dashboard/settings' },
]

const PLAN_LIMITS = { dmsMax: 1000, contactsMax: 1000, automationsMax: 5 }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)
  const [upgradeOpen, setUpgradeOpen]   = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [usage, setUsage]               = useState({ dms: 0, contacts: 0, automations: 0 })
  const pathname = usePathname()
  const { user } = useUser()

  const activeItem = navItems.find(n =>
    n.href === '/dashboard' ? pathname === n.href : pathname.startsWith(n.href)
  )

  /* ── Scroll shadow ── */
  useEffect(() => {
    const el = document.querySelector('.main-scroll')
    if (!el) return
    const h = () => setScrolled((el as HTMLElement).scrollTop > 8)
    el.addEventListener('scroll', h)
    return () => el.removeEventListener('scroll', h)
  }, [])

  /* ── Live usage from API ── */
  useEffect(() => {
    if (!user) return
    const fetchUsage = async () => {
      try {
        const res = await fetch('/api/usage')
        if (!res.ok) return
        const data = await res.json()
        setUsage({
          dms:         data.dms         ?? 0,
          contacts:    data.contacts    ?? 0,
          automations: data.automations ?? 0,
        })
      } catch {
        // silent fail — keeps showing zeros until API is ready
      }
    }
    fetchUsage()
    const timer = setInterval(fetchUsage, 30_000)
    return () => clearInterval(timer)
  }, [user])

  const usageBars = [
    { label: 'DMs',         used: usage.dms,         max: PLAN_LIMITS.dmsMax,         color: '#6d28d9' },
    { label: 'Contacts',    used: usage.contacts,    max: PLAN_LIMITS.contactsMax,    color: '#2563eb' },
    { label: 'Automations', used: usage.automations, max: PLAN_LIMITS.automationsMax, color: '#059669' },
  ]

  return (
    <div style={{ background: 'var(--bg)' }} className="min-h-screen flex" data-theme="light">

      {/* ── Sidebar ── */}
      <aside
        style={{ background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.08)' }}
        className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
          className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold leading-tight" style={{ color: '#0a0a0a' }}>Afforal</p>
            <p className="leading-tight" style={{ color: '#6b7280', fontSize: '10px' }}>IG Growth</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                style={active
                  ? { background: '#f0f0f0', color: '#0a0a0a', borderColor: 'rgba(0,0,0,0.10)' }
                  : { color: '#374151', borderColor: 'transparent' }
                }
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all border
                  ${active ? '' : 'hover:bg-black/5 hover:text-black'}`}>
                <Icon className="w-[15px] h-[15px] flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 opacity-30" />}
              </Link>
            )
          })}
        </nav>

        {/* Usage — live data */}
        <div className="px-3 pb-2">
          <div style={{ background: '#f3f3f3', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px' }}
            className="p-3 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: '#6b7280', fontSize: '10px', letterSpacing: '0.06em' }}
                className="uppercase font-semibold">Usage · Free</span>
            </div>
            {usageBars.map(b => {
              const pct  = b.max > 0 ? Math.min(100, Math.round((b.used / b.max) * 100)) : 0
              const warn = pct >= 80
              return (
                <div key={b.label}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#374151', fontSize: '11px' }}>{b.label}</span>
                    <span style={{ color: warn ? '#d97706' : '#6b7280', fontSize: '10px' }}>
                      {b.used}/{b.max}
                    </span>
                  </div>
                  <div style={{ background: '#e2e2e2', borderRadius: '99px', height: '4px' }}>
                    <div style={{
                      width: `${pct <= 0 ? 1 : pct}%`,
                      height: '4px',
                      borderRadius: '99px',
                      background: warn ? '#d97706' : b.color,
                      transition: 'width 600ms ease',
                      opacity: pct <= 0 ? 0.25 : 1,
                    }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => setUpgradeOpen(true)}
              style={{ background: '#0a0a0a', color: '#ffffff', fontSize: '11px', borderRadius: '8px' }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 font-bold hover:opacity-80 transition-opacity mt-1">
              <Crown className="w-3 h-3" />
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* User */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} className="px-3 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <UserButton afterSignOutUrl="/login" appearance={{
              elements: { avatarBox: 'w-7 h-7 rounded-full ring-1 ring-black/10' }
            }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '12px', color: '#0a0a0a', fontWeight: 600 }} className="truncate">
                {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'User'}
              </p>
              <p style={{ color: '#6b7280', fontSize: '11px' }} className="truncate">
                {user?.emailAddresses?.[0]?.emailAddress ?? ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          style={{
            background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            transition: 'all 200ms ease',
          }}
          className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Open menu">
              <Menu className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
            <div>
              <h1 className="text-[13px] font-semibold" style={{ color: '#0a0a0a' }}>{activeItem?.label ?? 'Overview'}</h1>
              <p style={{ color: '#6b7280', fontSize: '11px' }}>Afforal IG Growth</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setUpgradeOpen(true)}
              style={{ background: '#0a0a0a', color: '#ffffff', fontSize: '11px', borderRadius: '8px' }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-bold hover:opacity-80 transition-opacity">
              <Crown className="w-3 h-3" />
              Upgrade
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Notifications">
                <Bell className="w-4 h-4" style={{ color: '#6b7280' }} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black" />
              </button>
              {notifOpen && (
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', zIndex: 50 }}
                  className="absolute right-0 top-11 w-72 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
                  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                    className="px-4 py-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold" style={{ color: '#0a0a0a' }}>Notifications</p>
                    <span style={{ background: '#f3f3f3', color: '#6b7280', fontSize: '10px' }}
                      className="px-2 py-0.5 rounded-full">3 new</span>
                  </div>
                  {[
                    { msg: 'New DM from @priya_styles',  time: '2m ago',  color: '#16a34a', bg: '#f0fdf4' },
                    { msg: 'Automation hit 100 runs',    time: '10m ago', color: '#d97706', bg: '#fffbeb' },
                    { msg: 'New brand collab request',   time: '1h ago',  color: '#2563eb', bg: '#eff6ff' },
                  ].map((n, i) => (
                    <div key={i}
                      style={{ borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] cursor-pointer transition-colors">
                      <div style={{ background: n.bg, borderRadius: '8px', width: 28, height: 28, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, display: 'block' }} />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: '12px', color: '#0a0a0a' }}>{n.msg}</p>
                        <p style={{ fontSize: '11px', color: '#6b7280' }} className="mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} className="px-4 py-2.5">
                    <button style={{ fontSize: '11px', color: '#6b7280' }}
                      className="hover:text-black transition-colors">Mark all as read</button>
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

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  )
}
