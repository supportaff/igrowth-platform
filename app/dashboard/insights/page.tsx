'use client'
import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Image, Video, ExternalLink, Loader2, RefreshCw } from 'lucide-react'

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
  engagementRate?: string
  posts?: IGPost[]
  error?: string
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)  return `${Math.floor(diff / 60_000)}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function InsightsPage() {
  const [ig, setIg]           = useState<IGData>({ connected: false })
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  async function load(spin = false) {
    if (spin) setRefresh(true)
    try {
      const r = await fetch('/api/instagram/insights')
      const d = await r.json()
      setIg(d.error ? { connected: true, error: d.error } : { connected: true, ...d })
    } catch { setIg({ connected: false }) }
    finally { setLoading(false); setRefresh(false) }
  }

  useEffect(() => { load() }, [])

  const posts   = ig.posts ?? []
  const avgLikes   = posts.length ? Math.round(posts.reduce((s, p) => s + p.like_count, 0) / posts.length) : 0
  const avgComments = posts.length ? Math.round(posts.reduce((s, p) => s + p.comments_count, 0) / posts.length) : 0
  const totalLikes  = posts.reduce((s, p) => s + p.like_count, 0)
  const totalComments = posts.reduce((s, p) => s + p.comments_count, 0)

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-white/30">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading insights…
    </div>
  )

  if (!ig.connected || ig.error) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-3">
      <BarChart3 className="w-10 h-10 text-white/15" />
      <p className="text-sm font-semibold text-white/50">{ig.error ? 'Instagram temporarily unavailable' : 'Instagram not connected'}</p>
      <p className="text-xs text-white/25">{ig.error ?? 'Connect your Instagram account in Settings to see insights.'}</p>
      {ig.error && <button onClick={() => load(true)} className="text-xs text-violet-400 hover:underline flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Retry</button>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-white">@{ig.handle}</h1>
          <p className="text-xs text-white/35 mt-0.5">Based on your last {posts.length} posts</p>
        </div>
        <button onClick={() => load(true)} disabled={refresh} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${refresh ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Followers', value: fmt(ig.followers ?? 0), icon: Eye,           color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
          { label: 'Total Likes',     value: fmt(totalLikes),        icon: Heart,         color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
          { label: 'Total Comments',  value: fmt(totalComments),     icon: MessageCircle, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Avg. Eng. Rate',  value: `${ig.engagementRate ?? '0.00'}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <div className={`text-2xl font-extrabold tabular-nums ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Likes bar chart */}
      {posts.length > 0 && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white">Likes per Post (recent {posts.length})</h2>
            <span className="text-xs text-white/35">avg {fmt(avgLikes)} likes</span>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {posts.map(p => {
              const maxL = Math.max(...posts.map(x => x.like_count), 1)
              return (
                <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer"
                  title={p.caption?.slice(0, 60) ?? 'Post'}
                  className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors">{p.like_count > 999 ? fmt(p.like_count) : p.like_count}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-violet-500 to-fuchsia-400 group-hover:opacity-80 transition-all"
                    style={{ height: `${Math.max((p.like_count / maxL) * 80, 4)}px` }} />
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Content performance table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-bold text-white">Content Performance</h2>
          <BarChart3 className="w-4 h-4 text-white/30" />
        </div>
        {posts.length === 0 ? (
          <div className="py-16 text-center text-white/25 text-sm">No posts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Post', 'Type', 'Likes', 'Comments', 'Eng. Rate', 'Date', ''].map(h => (
                    <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => {
                  const eng = ig.followers
                    ? (((p.like_count + p.comments_count) / ig.followers) * 100).toFixed(2) + '%'
                    : '—'
                  return (
                    <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {(p.thumbnail_url || p.media_url) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.thumbnail_url || p.media_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                              {p.media_type === 'VIDEO' ? <Video className="w-4 h-4 text-white/30" /> : <Image className="w-4 h-4 text-white/30" />}
                            </div>
                          )}
                          <p className="text-xs text-white/70 max-w-[150px] truncate">{p.caption?.slice(0, 60) ?? '(no caption)'}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          p.media_type === 'VIDEO' ? 'bg-violet-500/15 text-violet-300 border-violet-500/25'
                          : p.media_type === 'CAROUSEL_ALBUM' ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/25'
                        }`}>{p.media_type === 'CAROUSEL_ALBUM' ? 'Carousel' : p.media_type === 'VIDEO' ? 'Reel/Video' : 'Photo'}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-pink-400 font-medium tabular-nums">{fmt(p.like_count)}</td>
                      <td className="px-5 py-3 text-xs text-violet-400 font-medium tabular-nums">{fmt(p.comments_count)}</td>
                      <td className="px-5 py-3 text-xs text-amber-400">{eng}</td>
                      <td className="px-5 py-3 text-xs text-white/35">{timeAgo(p.timestamp)}</td>
                      <td className="px-5 py-3">
                        <a href={p.permalink} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
