'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap, Home, MessageCircle, Settings, Users, BarChart3,
  Link2, ShoppingBag, Bell, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { icon: Home,          label: 'Overview',         href: '/dashboard' },
  { icon: MessageCircle, label: 'Conversations',    href: '/dashboard/conversations' },
  { icon: Zap,           label: 'Automations',      href: '/dashboard/automations' },
  { icon: Users,         label: 'Followers CRM',    href: '/dashboard/followers' },
  { icon: BarChart3,     label: 'Content Insights', href: '/dashboard/insights' },
  { icon: ShoppingBag,   label: 'Revenue',          href: '/dashboard/revenue' },
  { icon: Link2,         label: 'Products & Links', href: '/dashboard/products' },
  { icon: Settings,      label: 'Settings',         href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const activeLabel = navItems.find(n => n.href === pathname)?.label ?? 'Overview'

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#13121f] border-r border-white/8 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">iGrowth</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white" aria-label="Close menu">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

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

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">{activeLabel}</h1>
              <p className="text-xs text-white/40">Welcome back, Demo User</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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

        <main className="flex-1 px-4 sm:px-6 py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
