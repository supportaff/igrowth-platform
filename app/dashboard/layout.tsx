'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Zap, BarChart3, Settings,
  Bell, Menu, X, Sparkles, ChevronRight, Briefcase, Crown
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

// ─── palette constants (avoids repeating hex everywhere) ─────────────────
const C = {
  dark:    '#222831',
  mid:     '#393E46',
  surface: '#2c3340',
  teal:    '#00ADB5',
  light:   '#EEEEEE',
  muted:   'rgba(238,238,238,0.45)',
  border:  'rgba(238,238,238,0.08)',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [notifOpen,   setNotifOpen]     = useState(false)
  const [upgradeOpen, setUpgradeOpen]   = useState(false)
  const [scrolled,    setScrolled]      = useState(false)
  const [usage,       setUsage]         = useState({ dms: 0, contacts: 0, automations: 0 })
  const pathname = usePathname()
  const { user }  = useUser()

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

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const r = await fetch('/api/usage')
        if (!r.ok) return
        const d = await r.json()
        setUsage({ dms: d.dms ?? 0, contacts: d.contacts ?? 0, automations: d.automations ?? 0 })
      } catch { /* silent */ }
    }
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [user])

  const usageBars = [
    { label: 'DMs',         used: usage.dms,         max: PLAN_LIMITS.dmsMax,         color: C.teal },
    { label: 'Contacts',    used: usage.contacts,    max: PLAN_LIMITS.contactsMax,    color: '#3b82f6' },
    { label: 'Automations', used: usage.automations, max: PLAN_LIMITS.automationsMax, color: '#22c55e' },
  ]

  return (
    <div style={{ background: C.dark, minHeight: '100vh', display: 'flex', color: C.light }}>

      {/* ── Sidebar ── */}
      <aside style={{ background: C.mid, borderRight: `1px solid ${C.border}`, position: 'fixed',
        inset: '0 auto 0 0', width: 224, display: 'flex', flexDirection: 'column', zIndex: 50,
        transition: 'transform 200ms' }}
        className={sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}>

        {/* Logo */}
        <div style={{ borderBottom: `1px solid ${C.border}`, display: 'flex',
          alignItems: 'center', gap: 10, padding: '0 16px', height: 56, flexShrink: 0 }}>
          <div style={{ background: C.teal, borderRadius: 10, width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles style={{ width: 14, height: 14, color: '#fff' }} fill="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.light, lineHeight: 1.2 }}>Afforal</p>
            <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.2 }}>IG Growth</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"
            style={{ color: C.muted }} aria-label="Close">
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  borderRadius: 10, fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? C.teal : 'rgba(238,238,238,0.65)',
                  background: active ? 'rgba(0,173,181,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(0,173,181,0.25)' : 'transparent'}`,
                  transition: 'all 160ms',
                }}
                className={active ? '' : 'hover:bg-white/5 hover:text-[#EEEEEE]'}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && <ChevronRight style={{ width: 12, height: 12, opacity: 0.5 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Usage panel */}
        <div style={{ padding: '0 10px 10px' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '14px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.muted,
              letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
              Usage · Free
            </p>
            {usageBars.map(b => {
              const pct  = b.max > 0 ? Math.min(100, Math.round((b.used / b.max) * 100)) : 0
              const warn = pct >= 80
              return (
                <div key={b.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'rgba(238,238,238,0.65)' }}>{b.label}</span>
                    <span style={{ fontSize: 10, color: warn ? '#f59e0b' : C.muted }}>
                      {b.used}/{b.max}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(238,238,238,0.08)', borderRadius: 99, height: 4 }}>
                    <div style={{
                      width: `${pct <= 0 ? 1.5 : pct}%`, height: 4, borderRadius: 99,
                      background: warn ? '#f59e0b' : b.color,
                      opacity: pct <= 0 ? 0.3 : 1,
                      transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => setUpgradeOpen(true)}
              style={{ width: '100%', marginTop: 10, background: C.teal, color: '#fff',
                fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                border: 'none', cursor: 'pointer', transition: 'background 160ms' }}
              className="hover:bg-[#009aa2]">
              <Crown style={{ width: 11, height: 11 }} /> Upgrade to Pro
            </button>
          </div>
        </div>

        {/* User */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 14px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserButton afterSignOutUrl="/login" appearance={{
            elements: { avatarBox: 'w-7 h-7 rounded-full' }
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, color: C.light, fontWeight: 600 }} className="truncate">
              {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'User'}
            </p>
            <p style={{ fontSize: 11, color: C.muted }} className="truncate">
              {user?.emailAddresses?.[0]?.emailAddress ?? ''}
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        className="lg:ml-56">

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          background: scrolled ? 'rgba(34,40,49,0.95)' : C.dark,
          borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'all 200ms ease',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"
              style={{ color: C.muted, padding: 6, borderRadius: 8 }} aria-label="Open menu">
              <Menu style={{ width: 18, height: 18 }} />
            </button>
            <div>
              <h1 style={{ fontSize: 13, fontWeight: 700, color: C.light }}>{activeItem?.label ?? 'Overview'}</h1>
              <p style={{ fontSize: 11, color: C.muted }}>Afforal IG Growth</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setUpgradeOpen(true)}
              style={{ background: C.teal, color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'none', alignItems: 'center', gap: 5, transition: 'background 160ms' }}
              className="sm:!flex hover:bg-[#009aa2]">
              <Crown style={{ width: 11, height: 11 }} /> Upgrade
            </button>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(v => !v)}
                style={{ color: C.muted, padding: 8, borderRadius: 8, position: 'relative',
                  background: 'transparent', border: 'none', cursor: 'pointer' }}
                className="hover:bg-white/5 hover:text-[#EEEEEE] transition-colors"
                aria-label="Notifications">
                <Bell style={{ width: 16, height: 16 }} />
                <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6,
                  borderRadius: '50%', background: C.teal }} />
              </button>
              {notifOpen && (
                <div style={{ position: 'absolute', right: 0, top: 46, width: 280, zIndex: 50,
                  background: C.mid, border: `1px solid ${C.border}`,
                  borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                  <div style={{ borderBottom: `1px solid ${C.border}`, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.light }}>Notifications</p>
                    <span style={{ background: C.surface, color: C.muted, fontSize: 10,
                      padding: '2px 8px', borderRadius: 99 }}>3 new</span>
                  </div>
                  {[
                    { msg: 'New DM from @priya_styles', time: '2m ago',  dot: '#22c55e' },
                    { msg: 'Automation hit 100 runs',   time: '10m ago', dot: '#f59e0b' },
                    { msg: 'New brand collab request',  time: '1h ago',  dot: C.teal },
                  ].map((n, i) => (
                    <div key={i}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px',
                        borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}
                      className="hover:bg-white/5 transition-colors">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot,
                        flexShrink: 0, marginTop: 4 }} />
                      <div>
                        <p style={{ fontSize: 12, color: C.light }}>{n.msg}</p>
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
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
