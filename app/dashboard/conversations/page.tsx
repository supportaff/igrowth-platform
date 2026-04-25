'use client'
import { useState, useEffect } from 'react'
import { Search, MessageCircle, Clock, Loader2, Instagram, ExternalLink } from 'lucide-react'

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

const TAGS = ['All', 'High Likes', 'Video', 'Photo']

export default function ConversationsPage() {
  const [posts, setPosts]         = useState<IGPost[]>([])
  const [loading, setLoading]     = useState(true)
  const [connected, setConnected] = useState(false)
  const [handle, setHandle]       = useState('')
  const [search, setSearch]       = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [selected, setSelected]   = useState<IGPost | null>(null)

  useEffect(() => {
    fetch('/api/instagram/insights')
      .then(r => r.json())
      .then(d => {
        if (!d.error && d.connected) {
          setConnected(true)
          setHandle(d.handle ?? '')
          setPosts(d.posts ?? [])
          if (d.posts?.length) setSelected(d.posts[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxLikes = Math.max(...posts.map(p => p.like_count), 1)

  const filtered = posts.filter(p => {
    const matchSearch = p.caption?.toLowerCase().includes(search.toLowerCase()) ?? true
    const matchTag =
      activeTag === 'All' ? true
      : activeTag === 'High Likes' ? p.like_count >= maxLikes * 0.5
      : activeTag === 'Video' ? p.media_type === 'VIDEO'
      : p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM'
    return matchSearch && matchTag
  })

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1)  return `${Math.floor(diff / 60_000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-white/30">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
    </div>
  )

  if (!connected) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-3">
      <MessageCircle className="w-10 h-10 text-white/15" />
      <p className="text-sm font-semibold text-white/50">Instagram not connected</p>
      <p className="text-xs text-white/25">Connect your Instagram account in Settings to view DM conversations.</p>
    </div>
  )

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 -my-8 h-[calc(100vh-128px)] min-h-[500px]">

      {/* Left panel — post list */}
      <div className="w-full sm:w-72 lg:w-80 flex-shrink-0 border-r border-white/8 flex flex-col">
        <div className="p-4 border-b border-white/8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  activeTag === tag
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                    : 'bg-white/4 text-white/40 border-white/10 hover:bg-white/8 hover:text-white'
                }`}>{tag}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p)}
              className={`w-full flex items-start gap-3 p-4 border-b border-white/5 text-left transition-colors ${
                selected?.id === p.id ? 'bg-violet-500/10' : 'hover:bg-white/4'
              }`}>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/8 flex-shrink-0">
                {(p.thumbnail_url || p.media_url)
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.thumbnail_url || p.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  : <MessageCircle className="w-4 h-4 text-white/20 m-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white truncate">{p.caption?.slice(0, 35) ?? '(no caption)'}</span>
                  <span className="text-xs text-white/25 flex-shrink-0">{timeAgo(p.timestamp)}</span>
                </div>
                <p className="text-xs mt-0.5 text-white/40">♥ {p.like_count} &nbsp;💬 {p.comments_count}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageCircle className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-sm text-white/30">No posts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: post detail */}
      <div className="hidden sm:flex flex-1 flex-col">
        {selected ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center border border-white/10">
                  <Instagram className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">@{handle}</p>
                  <p className="text-xs text-white/35">{selected.media_type === 'VIDEO' ? 'Reel/Video' : selected.media_type === 'CAROUSEL_ALBUM' ? 'Carousel' : 'Photo'} · {timeAgo(selected.timestamp)}</p>
                </div>
              </div>
              <a href={selected.permalink} target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-violet-400 hover:underline">
                Open on Instagram <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {/* Post preview */}
              {(selected.thumbnail_url || selected.media_url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.thumbnail_url || selected.media_url} alt="post"
                  className="rounded-2xl max-h-64 object-cover w-full" loading="lazy" />
              )}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-2">
                <p className="text-sm text-white/80 leading-relaxed">{selected.caption ?? '(no caption)'}</p>
                <div className="flex items-center gap-4 pt-2 text-xs text-white/40">
                  <span>♥ {selected.like_count} likes</span>
                  <span>💬 {selected.comments_count} comments</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />{timeAgo(selected.timestamp)}</span>
                </div>
              </div>
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4">
                <p className="text-xs font-semibold text-amber-300 mb-1">DM Automation Note</p>
                <p className="text-xs text-white/40">Instagram's API requires approved messaging permissions for production DM access. This post is live on your account — set up keyword automations in the Automations tab to auto-reply to DMs triggered by this post.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/8">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <input placeholder="Type a reply… (requires Instagram Messaging permission)" className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none" />
                <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <MessageCircle className="w-10 h-10 mb-3" />
            <p className="text-sm">Select a post</p>
          </div>
        )}
      </div>
    </div>
  )
}
