'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Zap, BarChart3, Settings,
  Bell, Menu, X, Sparkles, ChevronRight, Briefcase, Crown, MessageCircle, CalendarDays
} from 'lucide-react'
import UpgradeModal from '@/components/UpgradeModal'
import { PLANS, type PlanId } from '@/lib/plans'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
  { icon: MessageCircle,   label: 'Conversations',  href: '/dashboard/conversations' },
  { icon: Zap,             label: 'Automations',    href: '/dashboard/automations' },
  { icon: Briefcase,       label: 'Brand Deals',    href: '/dashboard/brands' },
  { icon: CalendarDays,    label: 'Planner',        href: '/dashboard/planner' },
  { icon: BarChart3,       label: 'Insights',       href: '/dashboard/insights' },
  { icon: Settings,        label: 'Settings',       href: '/dashboard/settings' },
]

interface UsageData {
  plan: PlanId
  billing: string | null
  expires: string | null
  limits: { dms: number; contacts: number; automations: number; brandDeals: number }
  usage:  { dms: number; contacts: number; automations: number; brandDeals: number }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [usageData,   setUsageData]   = useState<UsageData>({
    plan: 'free',
    billing: null,
    expires: null,
    limits: PLANS.free as any,
    usage:  { dms: 0, contacts: 0, automations: 0, brandDeals: 0 },
  })
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

  const loadUsage = async () => {
    try {
      const r = await fetch('/api/usage')
      if (!r.ok) return
      const d = await r.json()
      setUsageData(d)
    } catch { /* silent */ }
  }

  useEffect(() => {
    if (!user) return
    loadUsage()
    const t = setInterval(loadUsage, 30_000)
    return () => clearInterval(t)
  }, [user])

  const isPro = usageData.plan === 'pro'

  const usageBars = [
    { label: 'DMs',         used: usageData.usage.dms,         max: usageData.limits.dms },
    { label: 'Contacts',    used: usageData.usage.contacts,    max: usageData.limits.contacts },
    { label: 'Automations', used: usageData.usage.automations, max: usageData.limits.automations },
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', color: '#fff' }}>

      {/* ── Sidebar ── */}
      <aside
        style={{
          background: '#0d0d0d',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          position: 'fixed', inset: '0 auto 0 0',
          width: 220, display: 'flex', flexDirection: 'column', zIndex: 50,
          transition: 'transform 200ms',
        }}
        className={sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}>

        {/* Logo */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 56, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles style={{ width: 13, height: 13, color: '#000' }} fill="black" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>iGrowth</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>by Afforal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"
            style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close sidebar"><X style={{ width: 16, height: 16 }} /></button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
                  borderRadius: 9, fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                  transition: 'all 140ms', textDecoration: 'none',
                }}
                className={active ? '' : 'hover:bg-white/[0.04] hover:text-white/80'}>
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {active && <ChevronRight style={{ width: 11, height: 11, opacity: 0.4 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Usage / Plan panel */}
        <div style={{ padding: '0 8px 8px' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: '12px 11px' }}>

            {/* Plan badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {isPro ? `Pro · ${usageData.billing ?? 'monthly'}` : 'Usage · Free'}
              </p>
              {isPro && (
                <span style={{ background: 'rgba(255,255,255,0.08)', fontSize: 9, fontWeight: 700, color: '#fff', padding: '2px 8px', borderRadius: 99, letterSpacing: '0.07em' }}>PRO</span>
              )}
            </div>

            {/* Usage bars — show limits (∞ if pro) */}
            {usageBars.map(b => {
              const unlimited = b.max === -1
              const pct = unlimited ? 0 : (b.max > 0 ? Math.min(100, Math.round((b.used / b.max) * 100)) : 0)
              const warn = !unlimited && pct >= 80
              return (
                <div key={b.label} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{b.label}</span>
                    <span style={{ fontSize: 10, color: warn ? '#fbbf24' : 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums' }}>
                      {unlimited ? `${b.used} / ∞` : `${b.used} / ${b.max}`}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 3 }}>
                    <div style={{
                      width: `${unlimited ? 100 : (pct <= 0 ? 1.5 : pct)}%`, height: 3, borderRadius: 99,
                      background: unlimited ? 'rgba(255,255,255,0.25)' : warn ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                      opacity: unlimited ? 0.5 : pct <= 0 ? 0.25 : 1,
                      transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>
              )
            })}

            {/* Upgrade or Pro expiry */}
            {!isPro ? (
              <button onClick={() => setUpgradeOpen(true)}
                style={{ width: '100%', marginTop: 10, background: '#fff', color: '#000', fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: 'none', cursor: 'pointer', transition: 'opacity 140ms', fontFamily: 'inherit' }}
                className="hover:opacity-80">
                <Crown style={{ width: 11, height: 11 }} /> Upgrade to Pro
              </button>
            ) : (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 10, textAlign: 'center' }}>
                Renews {usageData.expires ? new Date(usageData.expires).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </p>
            )}
          </div>
        </div>

        {/* User */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '11px 13px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserButton afterSignOutUrl="/login" appearance={{ elements: { avatarBox: 'w-7 h-7 rounded-full' } }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, color: '#fff', fontWeight: 600 }} className="truncate">
              {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'User'}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }} className="truncate">
              {user?.emailAddresses?.[0]?.emailAddress ?? ''}
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        className="lg:ml-[220px]">

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          background: scrolled ? 'rgba(0,0,0,0.92)' : '#000',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'all 200ms ease', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"
              style={{ color: 'rgba(255,255,255,0.4)', padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Open menu"><Menu style={{ width: 18, height: 18 }} /></button>
            <div>
              <h1 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{activeItem?.label ?? 'Overview'}</h1>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                iGrowth {isPro ? '· Pro' : '· Free'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isPro && (
              <button onClick={() => setUpgradeOpen(true)}
                style={{ background: '#fff', color: '#000', fontSize: 11, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'none', alignItems: 'center', gap: 5, transition: 'opacity 140ms', fontFamily: 'inherit' }}
                className="sm:!flex hover:opacity-80">
                <Crown style={{ width: 11, height: 11 }} /> Upgrade
              </button>
            )}

            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(v => !v)}
                style={{ color: 'rgba(255,255,255,0.4)', padding: 8, borderRadius: 8, position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Notifications">
                <Bell style={{ width: 16, height: 16 }} />
                <span style={{ position: 'absolute', top: 8, right: 8, width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
              </button>
              {notifOpen && (
                <div style={{ position: 'absolute', right: 0, top: 48, width: 276, zIndex: 50, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '11px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Notifications</p>
                    <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 10, padding: '2px 8px', borderRadius: 99 }}>3 new</span>
                  </div>
                  {[
                    { msg: 'New DM from @priya_styles', time: '2m ago' },
                    { msg: 'Automation hit 100 runs',   time: '10m ago' },
                    { msg: 'New brand collab request',  time: '1h ago' },
                  ].map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 15px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                      className="hover:bg-white/[0.04] transition-colors">
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', flexShrink: 0, marginTop: 5, opacity: 0.6 }} />
                      <div>
                        <p style={{ fontSize: 12, color: '#fff' }}>{n.msg}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-scroll flex-1 px-5 sm:px-7 py-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => { setUpgradeOpen(false); loadUsage() }} />
    </div>
  )
}
