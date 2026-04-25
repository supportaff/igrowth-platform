'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  MessageCircle, Zap, BarChart3, Instagram,
  ArrowRight, Heart, MessageSquare, ExternalLink,
  RefreshCw, Loader2, AlertTriangle, CheckCircle2,
  Video, Image, TrendingUp, Users, Activity, Sparkles
} from 'lucide-react'

interface IGPost {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  thumbnail_url?: string
  timestamp: string
  like_count: number
  comments_count: number
  permalink: string
}

interface IGData {
  connected: boolean
  handle?: string
  followers?: number
  mediaCount?: number
  bio?: string
  profilePic?: string
  engagementRate?: string
  posts?: IGPost[]
  error?: string
  is_transient?: boolean
}

const quickActions = [
  {
    icon: MessageCircle,
    label: 'Conversations',
    desc: 'View & reply to DMs',
    href: '/dashboard/conversations',
    stat: '5 unread',
  },
  {
    icon: Zap,
    label: 'Automations',
    desc: 'Build keyword flows',
    href: '/dashboard/automations',
    stat: '0 active',
  },
  {
    icon: Users,
    label: 'Contacts',
    desc: 'Manage your audience',
    href: '/dashboard/followers',
    stat: '0 contacts',
  },
  {
    icon: BarChart3,
    label: 'Insights',
    desc: 'Content performance',
    href: '/dashboard/insights',
    stat: 'View analytics',
  },
]

export default function DashboardPage() {
  const { user }  = useUser()
  const [ig, setIg]                 = useState<IGData>({ connected: false })
  const [igLoading, setIgLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [hoveredKpi, setHoveredKpi] = useState<number | null>(null)

  const loadIG = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true)
    try {
      const [sessionRes, insRes] = await Promise.all([
        fetch('/api/instagram/session'),
        fetch('/api/instagram/insights'),
      ])
      const session = await sessionRes.json()
      if (!session.connected) { setIg({ connected: false }); return }
      const ins = await insRes.json()
      if (ins.error) setIg({ connected: true, error: ins.error, is_transient: ins.is_transient })
      else           setIg({ connected: true, ...ins })
    } catch {
      setIg({ connected: false })
    } finally {
      setIgLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadIG() }, [loadIG])

  useEffect(() => {
    if (ig.is_transient && retryCount < 2) {
      const t = setTimeout(() => { setRetryCount(c => c + 1); loadIG() }, 5000)
      return () => clearTimeout(t)
    }
  }, [ig.is_transient, retryCount, loadIG])

  function fmt(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1)     + 'K'
    return n.toString()
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const h    = Math.floor(diff / 3_600_000)
    if (h < 1)  return `${Math.floor(diff / 60_000)}m`
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  const avgLikes = ig.posts?.length
    ? Math.round(ig.posts.reduce((s, p) => s + (p.like_count || 0), 0) / ig.posts.length)
    : 0

  const kpis = [
    { label: 'Followers',    value: ig.connected && !ig.error ? fmt(ig.followers ?? 0) : '—', icon: Users,      sub: 'Total audience' },
    { label: 'Posts',        value: ig.connected && !ig.error ? (ig.mediaCount ?? 0).toString() : '—', icon: Image, sub: 'Published' },
    { label: 'Engagement',   value: ig.connected && !ig.error ? `${ig.engagementRate ?? '0.00'}%` : '—', icon: Activity, sub: 'Avg rate' },
    { label: 'Avg Likes',    value: ig.connected && !ig.error ? fmt(avgLikes) : '—', icon: Heart, sub: 'Per post' },
  ]

  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'there'

  return (
    <div className="space-y-7">

      {/* ── Greeting ──────────────────────────────────────── */}
      <div className="fade-up flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px' }} className="text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},&nbsp;
            <span style={{ color: 'var(--text-secondary)' }}>{firstName}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }} className="mt-1">
            Here&apos;s what&apos;s happening with your Instagram growth today.
          </p>
        </div>
        <button onClick={() => loadIG(true)} disabled={refreshing}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px' }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-white hover:border-white/20 disabled:opacity-40 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Instagram connect banner ───────────────────── */}
      {igLoading ? (
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          className="fade-up rounded-xl p-4 flex items-center gap-3">
          <Loader2 style={{ color: 'var(--text-muted)' }} className="w-4 h-4 animate-spin" />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading your Instagram data…</span>
        </div>

      ) : !ig.connected ? (
        <div style={{ background: 'var(--surface-1)', border: '1px solid rgba(245,158,11,0.25)' }}
          className="fade-up rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(245,158,11,0.1)', borderRadius: '10px' }}
              className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <Instagram style={{ color: '#f59e0b' }} className="w-4 h-4" />
            </div>
            <div>
              <p style={{ fontSize: '13px' }} className="font-semibold text-white">Connect your Instagram account</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Link your business account to unlock all features.</p>
            </div>
          </div>
          <Link href="/dashboard/settings?tab=instagram"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '12px' }}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold hover:bg-amber-500/20 transition-colors whitespace-nowrap">
            Connect now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      ) : ig.error ? (
        <div style={{ background: 'var(--surface-1)', border: '1px solid rgba(239,68,68,0.2)' }}
          className="fade-up rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle style={{ color: '#f59e0b' }} className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p style={{ fontSize: '13px' }} className="font-semibold text-white">Instagram temporarily unavailable</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{ig.is_transient ? 'Auto-retrying…' : 'Try again in a moment.'}</p>
            </div>
          </div>
          <button onClick={() => { setRetryCount(0); loadIG(true) }} disabled={refreshing}
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12px' }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-white disabled:opacity-40 transition-all">
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Retry
          </button>
        </div>

      ) : (
        /* Connected profile card */
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          className="fade-up rounded-xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {ig.profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ig.profilePic} alt={ig.handle} loading="lazy"
                  width={40} height={40}
                  className="w-10 h-10 rounded-full"
                  style={{ border: '1.5px solid var(--border)' }} />
              ) : (
                <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center">
                  <Instagram className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <p style={{ fontSize: '14px' }} className="font-bold text-white">@{ig.handle}</p>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{ig.bio || 'Instagram Business Account'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '11px' }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
                Connected
              </span>
              <button onClick={() => loadIG(true)} disabled={refreshing}
                style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                className="p-2 rounded-lg hover:text-white hover:border-white/20 disabled:opacity-40 transition-all">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={k.label}
            onMouseEnter={() => setHoveredKpi(i)}
            onMouseLeave={() => setHoveredKpi(null)}
            style={{
              background: hoveredKpi === i ? 'var(--surface-2)' : 'var(--surface-1)',
              border: `1px solid ${hoveredKpi === i ? 'var(--border-hover)' : 'var(--border)'}`,
              transform: hoveredKpi === i ? 'translateY(-1px)' : 'none',
              boxShadow: hoveredKpi === i ? '0 8px 24px rgba(0,0,0,0.5)' : 'none',
              transition: 'all 160ms ease',
              borderRadius: '12px',
            }}
            className={`fade-up fade-up-${i + 1} p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{k.label}</span>
              <div style={{ background: 'var(--surface-3)', borderRadius: '8px' }}
                className="w-7 h-7 flex items-center justify-center">
                <k.icon style={{ color: 'var(--text-muted)' }} className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}
                className="text-white count-up">
                {igLoading ? <span className="skeleton" style={{ width: 60, height: 28, display: 'inline-block' }} /> : k.value}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="mt-0.5">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ──────────────────────────────────── */}
      <div className="fade-up fade-up-2">
        <div className="flex items-center justify-between mb-3">
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em' }}
            className="uppercase font-semibold">Quick Actions</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((item) => (
            <Link key={item.label} href={item.href}
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px' }}
              className="group block p-4 hover:border-white/20 hover:bg-[#161616] transition-all">
              <div style={{ background: 'var(--surface-3)', borderRadius: '10px' }}
                className="w-9 h-9 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <p style={{ fontSize: '13px' }} className="font-semibold text-white">{item.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }} className="mt-0.5">{item.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.stat}</span>
                <ArrowRight style={{ color: 'var(--text-muted)' }}
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent posts ──────────────────────────────────── */}
      {ig.connected && !ig.error && ig.posts && ig.posts.length > 0 && (
        <div className="fade-up fade-up-3">
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em' }}
              className="uppercase font-semibold">Recent Posts</p>
            <Link href="/dashboard/insights"
              style={{ color: 'var(--text-muted)', fontSize: '12px' }}
              className="flex items-center gap-1 hover:text-white transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ig.posts.slice(0, 8).map(post => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}
                className="group block hover:border-white/20 transition-all">
                <div className="aspect-square relative" style={{ background: 'var(--surface-2)' }}>
                  {(post.media_url || post.thumbnail_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail_url || post.media_url} alt=""
                      loading="lazy" width={300} height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {post.media_type === 'VIDEO'
                        ? <Video style={{ color: 'var(--text-muted)' }} className="w-7 h-7" />
                        : <Image style={{ color: 'var(--text-muted)' }} className="w-7 h-7" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />{fmt(post.like_count)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />{fmt(post.comments_count)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{timeAgo(post.timestamp)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Getting started checklist (no IG yet) ──────── */}
      {!ig.connected && !igLoading && (
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px' }}
          className="fade-up p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-white" />
            <p style={{ fontSize: '14px' }} className="font-semibold text-white">Get started with Afforal IG Growth</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Connect your Instagram account', done: false, href: '/dashboard/settings?tab=instagram' },
              { label: 'Create your first automation', done: false, href: '/dashboard/automations' },
              { label: 'Set up keyword triggers', done: false, href: '/dashboard/automations' },
            ].map((step, i) => (
              <div key={i}
                style={{ background: step.done ? 'rgba(34,197,94,0.06)' : 'var(--surface-2)', border: `1px solid ${step.done ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`, borderRadius: '8px' }}
                className="flex items-center gap-3 p-3">
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: step.done ? 'rgba(34,197,94,0.2)' : 'var(--surface-4)',
                  border: `1.5px solid ${step.done ? 'rgba(34,197,94,0.5)' : 'var(--border-hover)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.done && <CheckCircle2 className="w-3 h-3" style={{ color: 'var(--green)' }} />}
                </div>
                <span style={{ fontSize: '13px', color: step.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: step.done ? 'line-through' : 'none', flex: 1 }}>
                  {step.label}
                </span>
                {!step.done && (
                  <Link href={step.href}
                    style={{ fontSize: '11px', color: 'var(--text-muted)' }}
                    className="hover:text-white transition-colors flex items-center gap-1">
                    Start <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface-3)', borderRadius: '99px', height: '3px', marginTop: '16px' }}>
            <div style={{ width: '33%', height: '3px', background: 'white', borderRadius: '99px', transition: 'width 600ms ease' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px' }}>1 of 3 steps complete</p>
        </div>
      )}

      {/* ── Growth tip ─────────────────────────────────── */}
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px' }}
        className="fade-up fade-up-4 p-4 flex items-start gap-3">
        <div style={{ background: 'var(--surface-3)', borderRadius: '8px' }}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <p style={{ fontSize: '13px' }} className="font-semibold text-white">Growth tip of the day</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }} className="mt-0.5 leading-relaxed">
            Reply to every comment within 1 hour of posting. Instagram's algorithm rewards fast engagement and boosts reach by up to 3x.
          </p>
        </div>
        <Link href="/dashboard/insights"
          style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }}
          className="hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
