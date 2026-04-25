'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Search, MessageCircle, Loader2, Instagram,
  Send, RefreshCw, AlertTriangle, ChevronRight, ArrowLeft
} from 'lucide-react'

interface Conversation {
  id: string
  snippet: string
  updatedTime: string
  messageCount: number
  unreadCount: number
  participantId: string
  participantName: string
}

interface Message {
  id: string
  message: string
  from: { id: string; username?: string; name?: string }
  created_time: string
}

const FILTERS = ['All', 'Unread', 'Replied']

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages]           = useState<Message[]>([])
  const [selected, setSelected]           = useState<Conversation | null>(null)
  const [loading, setLoading]             = useState(true)
  const [msgLoading, setMsgLoading]       = useState(false)
  const [connected, setConnected]         = useState(false)
  const [permError, setPermError]         = useState(false)
  const [igUserId, setIgUserId]           = useState('')
  const [igHandle, setIgHandle]           = useState('')
  const [search, setSearch]               = useState('')
  const [filter, setFilter]               = useState('All')
  const [reply, setReply]                 = useState('')
  const [sending, setSending]             = useState(false)
  const [sendError, setSendError]         = useState('')
  const [showThread, setShowThread]       = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Load conversations ────────────────────────────────────
  useEffect(() => {
    loadConversations()
  }, [])

  async function loadConversations() {
    setLoading(true)
    setPermError(false)
    try {
      // Get IG user ID + handle from session/insights
      const [sessionRes, insightsRes] = await Promise.all([
        fetch('/api/instagram/session'),
        fetch('/api/instagram/insights'),
      ])
      const sessionData  = await sessionRes.json()
      const insightsData = await insightsRes.json()

      if (!sessionData.connected) { setLoading(false); return }
      setConnected(true)
      setIgUserId(sessionData.igUserId ?? '')
      setIgHandle(insightsData.handle ?? '')

      const convRes  = await fetch('/api/instagram/conversations')
      const convData = await convRes.json()

      if (convData.error === 'permission_required') {
        setPermError(true)
        setLoading(false)
        return
      }
      setConversations(convData.conversations ?? [])
    } catch {
      // silently fall through — UI handles empty state
    } finally {
      setLoading(false)
    }
  }

  // ── Load messages for selected thread ────────────────────
  async function openThread(conv: Conversation) {
    setSelected(conv)
    setShowThread(true)
    setMessages([])
    setMsgLoading(true)
    try {
      const res  = await fetch(`/api/instagram/conversations?thread=${conv.id}`)
      const data = await res.json()
      setMessages((data.messages ?? []).reverse()) // oldest first
    } catch {
      setMessages([])
    } finally {
      setMsgLoading(false)
    }
  }

  // Scroll to bottom when messages load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send reply ────────────────────────────────────────────
  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    setSendError('')
    try {
      const res  = await fetch('/api/instagram/conversations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ recipientId: selected.participantId, message: reply }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setSendError(data.error ?? 'Failed to send')
      } else {
        setReply('')
        // Optimistically append the sent message
        setMessages(prev => [...prev, {
          id:           data.messageId ?? Date.now().toString(),
          message:      reply,
          from:         { id: igUserId },
          created_time: new Date().toISOString(),
        }])
      }
    } catch {
      setSendError('Network error')
    } finally {
      setSending(false)
    }
  }

  // ── Helpers ───────────────────────────────────────────────
  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m    = Math.floor(diff / 60_000)
    const h    = Math.floor(diff / 3_600_000)
    const d    = Math.floor(diff / 86_400_000)
    if (m < 1)  return 'Just now'
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    return `${d}d ago`
  }

  function avatar(name: string) {
    return name?.slice(0, 2).toUpperCase() || '?'
  }

  const filtered = conversations.filter(c => {
    const matchSearch = c.participantName.toLowerCase().includes(search.toLowerCase()) ||
                        c.snippet.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'Unread'  ? c.unreadCount > 0
      : filter === 'Replied' ? c.unreadCount === 0
      : true
    return matchSearch && matchFilter
  })

  // ── States ────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center py-32 text-white/30">
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading conversations…
    </div>
  )

  if (!connected) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-3">
      <Instagram className="w-10 h-10 text-white/15" />
      <p className="text-sm font-semibold text-white/50">Instagram not connected</p>
      <p className="text-xs text-white/25">Connect your Instagram account in Settings to view DM conversations.</p>
    </div>
  )

  if (permError) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-amber-400" />
      </div>
      <p className="text-sm font-semibold text-white/70">Messaging permission required</p>
      <p className="text-xs text-white/35 leading-relaxed">
        Your Meta app needs the <code className="text-violet-300 bg-violet-500/10 px-1 rounded">instagram_manage_messages</code> permission approved.
        Until your app is approved for production, DMs are only accessible from Instagram test accounts added in your Meta App Dashboard.
      </p>
      <button onClick={loadConversations}
        className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  )

  return (
    <div className="flex -mx-4 sm:-mx-6 -my-8 h-[calc(100vh-128px)] min-h-[500px] overflow-hidden">

      {/* ── Left: conversation list ───────────────────────── */}
      <div className={`${
        showThread ? 'hidden sm:flex' : 'flex'
      } w-full sm:w-72 lg:w-80 flex-shrink-0 border-r border-white/8 flex-col`}>

        {/* Header */}
        <div className="p-4 border-b border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center">
                <Instagram className="w-3.5 h-3.5 text-white/70" />
              </div>
              <span className="text-sm font-semibold text-white">
                {igHandle ? `@${igHandle}` : 'Inbox'}
              </span>
            </div>
            <button onClick={loadConversations} title="Refresh"
              className="text-white/30 hover:text-white/70 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          {/* Filters */}
          <div className="flex gap-1.5">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  filter === f
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                    : 'bg-white/4 text-white/40 border-white/10 hover:bg-white/8 hover:text-white'
                }`}>{f}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageCircle className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-sm text-white/30">
                {conversations.length === 0 ? 'No conversations yet' : 'No matches'}
              </p>
              {conversations.length === 0 && (
                <p className="text-xs text-white/20 mt-1">
                  DMs will appear here once someone messages your account
                </p>
              )}
            </div>
          ) : (
            filtered.map(conv => (
              <button key={conv.id} onClick={() => openThread(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/5 text-left transition-colors ${
                  selected?.id === conv.id ? 'bg-violet-500/10' : 'hover:bg-white/4'
                }`}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white/60">
                  {avatar(conv.participantName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-white truncate">
                      @{conv.participantName}
                    </span>
                    <span className="text-xs text-white/25 flex-shrink-0">{timeAgo(conv.updatedTime)}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5">{conv.snippet || '…'}</p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {conv.unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                  <ChevronRight className="w-3 h-3 text-white/20" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right: chat thread ───────────────────────────────── */}
      <div className={`${
        showThread ? 'flex' : 'hidden sm:flex'
      } flex-1 flex-col overflow-hidden`}>

        {selected ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 flex-shrink-0">
              <button onClick={() => setShowThread(false)}
                className="sm:hidden text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                {avatar(selected.participantName)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">@{selected.participantName}</p>
                <p className="text-xs text-white/30">{selected.messageCount} messages</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {msgLoading ? (
                <div className="flex items-center justify-center py-16 text-white/30">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading messages…
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MessageCircle className="w-8 h-8 text-white/15 mb-2" />
                  <p className="text-xs text-white/30">No messages loaded</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.from.id === igUserId
                  return (
                    <div key={msg.id}
                      className={`flex ${ isMine ? 'justify-end' : 'justify-start' }`}>
                      <div className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-sm'
                          : 'bg-white/8 text-white/80 border border-white/8 rounded-bl-sm'
                      }`}>
                        {msg.message}
                        <p className={`text-xs mt-1 ${ isMine ? 'text-white/50' : 'text-white/25' }`}>
                          {timeAgo(msg.created_time)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className="px-4 py-3 border-t border-white/8 flex-shrink-0">
              {sendError && (
                <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {sendError}
                </p>
              )}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-violet-500/50 transition-all">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  placeholder="Reply to this conversation…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none" />
                <button onClick={sendReply} disabled={!reply.trim() || sending}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all">
                  {sending
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Send className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/40">Select a conversation</p>
            <p className="text-xs text-white/20">Choose a DM thread from the left to view and reply</p>
          </div>
        )}
      </div>
    </div>
  )
}
