'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  MessageCircle, Zap, Users, BarChart3, Instagram,
  ArrowRight, Heart, MessageSquare, ExternalLink, RefreshCw,
  TrendingUp, Image, Video, Loader2
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
  connected:      boolean
  handle?:        string
  followers?:     number
  mediaCount?:    number
  bio?:           string
  profilePic?:    string
  engagementRate?: string
  posts?:         IGPost[]
}

const quickNav = [
  { icon: MessageCircle, label: 'Conversations', desc: 'View & reply to DMs',  href: '/dashboard/conversations', color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { icon: Zap,           label: 'Automations',   desc: 'Build & manage flows', href: '/dashboard/automations',   color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  { icon: Users,         label: 'Followers CRM', desc: 'Manage your audience', href: '/dashboard/followers',     color: 'text-green-400',   bg: 'bg-green-500/10' },
  { icon: BarChart3,     label: 'Insights',      desc: 'Content performance',  href: '/dashboard/insights',      color: 'text-amber-400',   bg: 'bg-amber-500/10' },
]

export default function DashboardPage() {
  const { user } = useUser()
  const router   = useRouter()
  const firstName = user?.firstName ?? 'there'

  const [ig, setIg]             = useState<IGData>({ connected: false })
  const [igLoading, setIgLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadIG(showSpinner = false) {
    if (showSpinner) setRefreshing(true)
    try {
      const res  = await fetch('/api/instagram/session')
      const data = await res.json()
      if (data.connected) {
        // Session exists — fetch fresh live insights
        const insightRes  = await fetch('/api/instagram/insights')
        const insightData = await insightRes.json()
        if (!insightData.error) {
          setIg({ connected: true, ...insightData })
        } else {
          setIg({ connected: true, ...data })
        }
      } else {
        setIg({ connected: false })
      }
    } catch {
      setIg({ connected: false })
    } finally {
      setIgLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadIG() }, [])

  function fmt(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1)     + 'K'
    return n.toString()
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1)  return `${Math.floor(diff / 60_000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div className="space-y-8">

      {/* ── Instagram connected header ── */}
      {igLoading ? (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5 flex items-center gap-3 text-white/30">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading Instagram data…</span>
        </div>
      ) : ig.connected ? (
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {ig.profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ig.profilePic} alt={ig.handle} className="w-12 h-12 rounded-full ring-2 ring-violet-500/30" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">@{ig.handle}</p>
                <p className="text-xs text-white/40 mt-0.5">{ig.bio || 'Instagram Business Account'}</p>
              </div>
            </div>

            {/* KPI pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <p className="text-lg font-extrabold text-violet-300">{fmt(ig.followers ?? 0)}</p>
                <p className="text-xs text-white/35">Followers</p>
              </div>
              <div className="text-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <p className="text-lg font-extrabold text-fuchsia-300">{ig.mediaCount ?? 0}</p>
                <p className="text-xs text-white/35">Posts</p>
              </div>
              <div className="text-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <p className="text-lg font-extrabold text-green-300">{ig.engagementRate ?? '0.00'}%</p>
                <p className="text-xs text-white/35">Engagement</p>
              </div>
              <button onClick={() => loadIG(true)} disabled={refreshing}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
              <Instagram className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-300">Connect Instagram to get started</p>
              <p className="text-xs text-white/40 mt-0.5">Link your Instagram Business account to enable all automations and analytics.</p>
            </div>
          </div>
          <Link href="/dashboard/settings?tab=instagram"
            className="flex-shrink-0 flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-500/30 transition-colors">
            Connect now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── KPI strip (live when connected, zeros when not) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Followers',        value: ig.connected ? fmt(ig.followers ?? 0)             : '—', color: 'text-violet-400' },
          { label: 'Total Posts',      value: ig.connected ? (ig.mediaCount ?? 0).toString()    : '—', color: 'text-fuchsia-400' },
          { label: 'Engagement Rate',  value: ig.connected ? `${ig.engagementRate ?? '0.00'}%`  : '—', color: 'text-green-400' },
          { label: 'Avg Likes/Post',   value: ig.connected && ig.posts?.length
              ? fmt(Math.round(ig.posts.reduce((s,p) => s + (p.like_count||0), 0) / ig.posts.length))
              : '—',
            color: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-white/4 border border-white/8 rounded-2xl p-5 space-y-2">
            <div className={`text-2xl font-extrabold tabular-nums ${k.color}`}>{k.value}</div>
            <div className="text-xs text-white/40">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Recent posts grid (live) ── */}
      {ig.connected && ig.posts && ig.posts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recent Posts</h2>
            <Link href="/dashboard/insights" className="text-xs text-violet-400 hover:underline flex items-center gap-1">
              View all insights <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ig.posts.slice(0, 8).map(post => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"
                className="group relative bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all">
                {/* thumbnail */}
                <div className="aspect-square bg-white/5 relative overflow-hidden">
                  {(post.media_url || post.thumbnail_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt={post.caption?.slice(0, 40) || 'Post'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {post.media_type === 'VIDEO'
                        ? <Video className="w-8 h-8 text-white/20" />
                        : <Image className="w-8 h-8 text-white/20" />}
                    </div>
                  )}
                  {/* overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  {/* type badge */}
                  {post.media_type === 'VIDEO' && (
                    <span className="absolute top-2 right-2 bg-black/60 rounded-md px-1.5 py-0.5 text-xs text-white">
                      <Video className="w-3 h-3 inline" />
                    </span>
                  )}
                </div>
                {/* stats */}
                <div className="p-2.5 flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(post.like_count)}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{fmt(post.comments_count)}</span>
                  <span>{timeAgo(post.timestamp)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick nav ── */}
      <div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickNav.map(n => (
            <Link key={n.label} href={n.href}
              className="group bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/6 hover:border-white/12 transition-all">
              <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center mb-3`}>
                <n.icon className={`w-4 h-4 ${n.color}`} />
              </div>
              <p className="text-sm font-semibold text-white">{n.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{n.desc}</p>
              <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 mt-2 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
