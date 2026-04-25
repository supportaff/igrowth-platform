'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  Zap, BarChart3, Instagram, ArrowRight, Heart, MessageSquare,
  ExternalLink, RefreshCw, Loader2, AlertTriangle, CheckCircle2,
  Video, Image, Activity, Briefcase, Crown, Users
} from 'lucide-react'
import UpgradeModal from '@/components/UpgradeModal'

interface IGPost {
  id: string; caption?: string; media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string; thumbnail_url?: string; timestamp: string
  like_count: number; comments_count: number; permalink: string
}
interface IGData {
  connected: boolean; handle?: string; followers?: number; mediaCount?: number
  bio?: string; profilePic?: string; engagementRate?: string
  posts?: IGPost[]; error?: string; is_transient?: boolean
}

const PLAN = { dms: 0, dmsMax: 1000, contacts: 0, contactsMax: 1000, automations: 0, automationsMax: 5 }

const quickActions = [
  { icon: Zap,       label: 'Automations', desc: 'Build keyword flows',    href: '/dashboard/automations' },
  { icon: Briefcase, label: 'Brand Kit',   desc: 'Manage collabs & deals', href: '/dashboard/brands' },
  { icon: BarChart3, label: 'Insights',    desc: 'Content performance',    href: '/dashboard/insights' },
  { icon: Users,     label: 'Contacts',    desc: 'Manage your audience',   href: '/dashboard/followers' },
]

export default function DashboardPage() {
  const { user } = useUser()
  const [ig, setIg]                   = useState<IGData>({ connected: false })
  const [igLoading, setIgLoading]     = useState(true)
  const [refreshing, setRefreshing]   = useState(false)
  const [retryCount, setRetryCount]   = useState(0)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const loadIG = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true)
    try {
      const [sRes, iRes] = await Promise.all([fetch('/api/instagram/session'), fetch('/api/instagram/insights')])
      const session = await sRes.json()
      if (!session.connected) { setIg({ connected: false }); return }
      const ins = await iRes.json()
      if (ins.error) setIg({ connected: true, error: ins.error, is_transient: ins.is_transient })
      else           setIg({ connected: true, ...ins })
    } catch { setIg({ connected: false }) }
    finally { setIgLoading(false); setRefreshing(false) }
  }, [])

  useEffect(() => { loadIG() }, [loadIG])
  useEffect(() => {
    if (ig.is_transient && retryCount < 2) {
      const t = setTimeout(() => { setRetryCount(c => c + 1); loadIG() }, 5000)
      return () => clearTimeout(t)
    }
  }, [ig.is_transient, retryCount, loadIG])

  function fmt(n: number) {
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+'M'
    if (n >= 1_000)     return (n/1_000).toFixed(1)+'K'
    return n.toString()
  }
  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff/3_600_000)
    if (h<1)  return `${Math.floor(diff/60_000)}m`
    if (h<24) return `${h}h`
    return `${Math.floor(h/24)}d`
  }

  const avgLikes = ig.posts?.length
    ? Math.round(ig.posts.reduce((s,p)=>s+(p.like_count||0),0)/ig.posts.length) : 0

  const kpis = [
    { label:'Followers',  value: ig.connected&&!ig.error ? fmt(ig.followers??0) : '—', icon:Users,    sub:'Total audience' },
    { label:'Posts',      value: ig.connected&&!ig.error ? (ig.mediaCount??0).toString() : '—', icon:Image,    sub:'Published' },
    { label:'Engagement', value: ig.connected&&!ig.error ? `${ig.engagementRate??'0.00'}%` : '—', icon:Activity, sub:'Avg rate' },
    { label:'Avg Likes',  value: ig.connected&&!ig.error ? fmt(avgLikes) : '—', icon:Heart,   sub:'Per post' },
  ]

  const usageBars = [
    { label:'DMs sent',    used:PLAN.dms,        max:PLAN.dmsMax },
    { label:'Contacts',    used:PLAN.contacts,   max:PLAN.contactsMax },
    { label:'Automations', used:PLAN.automations,max:PLAN.automationsMax },
  ]

  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-5">

      {/* Greeting */}
      <div className="fade-up flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px', color: '#fff' }}>
            {greeting}, <span style={{ color: 'rgba(255,255,255,0.55)' }}>{firstName}</span> 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: 3 }}>
            Here&apos;s what&apos;s happening with your Instagram growth today.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setUpgradeOpen(true)}
            style={{
              background: '#fff', color: '#000',
              fontSize: '12px', fontWeight: 700,
              border: 'none', borderRadius: 9, cursor: 'pointer',
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'opacity 140ms',
            }}
            className="hover:opacity-80">
            <Crown className="w-3.5 h-3.5" /> Upgrade
          </button>
          <button
            onClick={() => loadIG(true)} disabled={refreshing}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '12px', borderRadius: 9, cursor: 'pointer',
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 140ms',
            }}
            className="hover:border-white/30 hover:text-white/75 disabled:opacity-30">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* IG connection banner */}
      {igLoading ? (
        <div
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}
          className="fade-up p-4 flex items-center gap-3">
          <Loader2 style={{ color: 'rgba(255,255,255,0.3)' }} className="w-4 h-4 animate-spin" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Loading Instagram data…</span>
        </div>
      ) : !ig.connected ? (
        <div
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
          className="fade-up p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 10,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Instagram style={{ color: 'rgba(255,255,255,0.5)' }} className="w-4 h-4" />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Connect your Instagram account</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: 2 }}>Link your business account to unlock all features.</p>
            </div>
          </div>
          <Link href="/dashboard/settings?tab=instagram"
            style={{
              background: '#fff', color: '#000',
              fontSize: '12px', fontWeight: 700,
              borderRadius: 9, padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0, transition: 'opacity 140ms',
            }}
            className="hover:opacity-80">
            Connect now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : ig.error ? (
        <div
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
          className="fade-up p-4 flex items-start justify-between gap-4">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertTriangle style={{ color: '#f87171' }} className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Instagram temporarily unavailable</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: 2 }}>
                {ig.is_transient ? 'Auto-retrying…' : 'Try again in a moment.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setRetryCount(0); loadIG(true) }} disabled={refreshing}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px', borderRadius: 8,
              padding: '6px 12px', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', transition: 'all 140ms',
            }}
            className="disabled:opacity-30 hover:border-white/20 hover:text-white/80">
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Retry
          </button>
        </div>
      ) : (
        <div
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
          className="fade-up p-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {ig.profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ig.profilePic} alt={ig.handle} loading="lazy" width={38} height={38}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '50%',
                  width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Instagram className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>@{ig.handle}</p>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: 2 }}>
                  {ig.bio || 'Instagram Business Account'}
                </p>
              </div>
            </div>
            <span style={{
              background: 'rgba(74,222,128,0.1)',
              color: '#4ade80',
              border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '11px', fontWeight: 500,
              padding: '4px 10px', borderRadius: 99,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" /> Connected
            </span>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}
        className="lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label}
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '16px',
              transition: 'border-color 140ms',
            }}
            className={`fade-up fade-up-${i+1} hover:border-white/15`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{k.label}</span>
              <div style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 8,
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <k.icon style={{ color: 'rgba(255,255,255,0.4)' }} className="w-3.5 h-3.5" />
              </div>
            </div>
            <p style={{
              fontSize: '24px', fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.5px', color: '#fff', lineHeight: 1,
            }}>
              {igLoading
                ? <span className="skeleton" style={{ width: 56, height: 26, display: 'inline-block' }} />
                : k.value}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: 5 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="fade-up fade-up-2">
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '10px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          fontWeight: 600, marginBottom: 10,
        }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}
          className="lg:grid-cols-4">
          {quickActions.map(item => (
            <Link key={item.label} href={item.href}
              style={{
                background: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '16px',
                display: 'block',
                transition: 'border-color 140ms, background 140ms',
              }}
              className="group hover:bg-white/[0.03] hover:border-white/15">
              <div style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 9,
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12, transition: 'background 140ms',
              }}
              className="group-hover:bg-white/10">
                <item.icon style={{ color: 'rgba(255,255,255,0.6)' }} className="w-4 h-4" />
              </div>
              <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{item.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: 3 }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <ArrowRight style={{ color: 'rgba(255,255,255,0.3)' }}
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:text-white/60 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Usage bars */}
      <div
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}
        className="fade-up fade-up-3 p-5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Plan Usage</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: 2 }}>Free plan · resets monthly</p>
          </div>
          <button
            onClick={() => setUpgradeOpen(true)}
            style={{
              background: '#fff', color: '#000',
              fontSize: '11px', fontWeight: 700,
              borderRadius: 8, border: 'none', cursor: 'pointer',
              padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'opacity 140ms',
            }}
            className="hover:opacity-80">
            <Crown className="w-3 h-3" /> Upgrade
          </button>
        </div>
        <div className="space-y-3">
          {usageBars.map(b => {
            const pct = Math.min(100, Math.round((b.used / b.max) * 100))
            const warn = pct >= 80
            return (
              <div key={b.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>{b.label}</span>
                  <span style={{ color: warn ? '#fbbf24' : 'rgba(255,255,255,0.3)', fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                    {b.used} <span style={{ color: 'rgba(255,255,255,0.2)' }}>/ {b.max}</span>
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 99, height: 4 }}>
                  <div style={{
                    width: `${Math.max(pct, 1.5)}%`, height: 4, borderRadius: 99,
                    background: warn ? '#fbbf24' : 'rgba(255,255,255,0.45)',
                    transition: 'width 600ms ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => setUpgradeOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, width: '100%', marginTop: 14,
            padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'border-color 140ms, background 140ms',
          }}
          className="hover:border-white/20 hover:bg-white/[0.06]">
          <div>
            <p style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>Upgrade to Pro</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: 2 }}>Unlimited DMs, contacts & automations</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              ₹399<span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 400 }}>/mo</span>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: 2 }}>billed annually</p>
          </div>
        </button>
      </div>

      {/* Recent posts */}
      {ig.connected && !ig.error && ig.posts && ig.posts.length > 0 && (
        <div className="fade-up fade-up-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Recent Posts
            </p>
            <Link href="/dashboard/insights"
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
              className="hover:text-white/70 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}
            className="sm:grid-cols-4">
            {ig.posts.slice(0, 8).map(post => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"
                style={{
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10, overflow: 'hidden', display: 'block',
                  transition: 'border-color 140ms',
                }}
                className="group hover:border-white/15">
                <div className="aspect-square relative" style={{ background: '#141414' }}>
                  {(post.media_url || post.thumbnail_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail_url || post.media_url} alt="" loading="lazy"
                      width={300} height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {post.media_type === 'VIDEO'
                        ? <Video style={{ color: 'rgba(255,255,255,0.2)' }} className="w-5 h-5" />
                        : <Image style={{ color: 'rgba(255,255,255,0.2)' }} className="w-5 h-5" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white/80" />
                  </div>
                </div>
                <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart className="w-3 h-3" />{fmt(post.like_count)}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MessageSquare className="w-3 h-3" />{fmt(post.comments_count)}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{timeAgo(post.timestamp)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  )
}
