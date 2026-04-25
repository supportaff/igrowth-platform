'use client'
import { useState, useEffect } from 'react'
import { Search, Users, TrendingUp, Heart, Loader2, ExternalLink, Instagram } from 'lucide-react'

interface IGPost {
  id: string
  caption?: string
  media_type: string
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

export default function FollowersPage() {
  const [ig, setIg]           = useState<IGData>({ connected: false })
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const SORT = ['Most Liked', 'Most Comments', 'Newest', 'Oldest']
  const [sort, setSort]       = useState('Most Liked')

  useEffect(() => {
    fetch('/api/instagram/insights')
      .then(r => r.json())
      .then(d => setIg(d.error ? { connected: true, error: d.error } : { connected: true, ...d }))
      .catch(() => setIg({ connected: false }))
      .finally(() => setLoading(false))
  }, [])

  const posts = ig.posts ?? []

  const sorted = [...posts]
    .filter(p => p.caption?.toLowerCase().includes(search.toLowerCase()) ?? true)
    .sort((a, b) =>
      sort === 'Most Liked'     ? b.like_count - a.like_count
      : sort === 'Most Comments' ? b.comments_count - a.comments_count
      : sort === 'Newest'       ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

  const totalLikes    = posts.reduce((s, p) => s + p.like_count, 0)
  const totalComments = posts.reduce((s, p) => s + p.comments_count, 0)

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-white/30">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
    </div>
  )

  if (!ig.connected || ig.error) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-3">
      <Users className="w-10 h-10 text-white/15" />
      <p className="text-sm font-semibold text-white/50">{ig.error ? 'Instagram temporarily unavailable' : 'Instagram not connected'}</p>
      <p className="text-xs text-white/25">Connect your Instagram account in Settings to view your audience.</p>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Followers',  value: fmt(ig.followers ?? 0),  color: 'text-violet-400',  icon: Users },
          { label: 'Total Posts',      value: fmt(ig.mediaCount ?? 0),  color: 'text-fuchsia-400', icon: Instagram },
          { label: 'Total Likes',      value: fmt(totalLikes),           color: 'text-pink-400',    icon: Heart },
          { label: 'Avg. Eng. Rate',   value: `${ig.engagementRate ?? '0.00'}%`, color: 'text-green-400', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <div className={`text-2xl font-extrabold tabular-nums ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SORT.map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all ${
                sort === s
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/4 text-white/40 border-white/10 hover:bg-white/8 hover:text-white'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Posts as audience engagement table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Post Engagement</p>
          <p className="text-xs text-white/30">{sorted.length} posts · {fmt(totalComments)} total comments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Post', 'Type', 'Likes', 'Comments', 'Eng. Rate', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-xs text-white/35 font-medium px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => {
                const eng = ig.followers
                  ? (((p.like_count + p.comments_count) / ig.followers) * 100).toFixed(2) + '%'
                  : '—'
                return (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/8 flex-shrink-0">
                          {(p.thumbnail_url || p.media_url)
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={p.thumbnail_url || p.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            : <Heart className="w-4 h-4 text-white/20 m-2.5" />}
                        </div>
                        <p className="text-xs text-white/70 max-w-[160px] truncate">{p.caption?.slice(0, 50) ?? '(no caption)'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-white/40">{p.media_type === 'VIDEO' ? 'Video' : p.media_type === 'CAROUSEL_ALBUM' ? 'Carousel' : 'Photo'}</td>
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
        {sorted.length === 0 && (
          <div className="py-16 text-center text-white/25 text-sm">No posts found</div>
        )}
      </div>
    </div>
  )
}
