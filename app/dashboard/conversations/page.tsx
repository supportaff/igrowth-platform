'use client'
import { useState } from 'react'
import { Search, Filter, MessageCircle, Clock } from 'lucide-react'

const convos = [
  { id: 1, user: '@priya_styles',    name: 'Priya S.',     msg: 'What is the price for the course?',  time: '2m ago',  tag: 'Hot Lead', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25',          unread: true,  source: 'Reel: Pricing Tips' },
  { id: 2, user: '@rahul.fitness',   name: 'Rahul F.',     msg: 'Send me the link please',            time: '8m ago',  tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  unread: true,  source: 'Post: BTS' },
  { id: 3, user: '@anjali_craft',    name: 'Anjali C.',    msg: 'Is this available in bulk?',         time: '15m ago', tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25',     unread: false, source: 'Story: Flash Sale' },
  { id: 4, user: '@kiran.d2c',       name: 'Kiran D.',     msg: 'I want to know more about the plan', time: '32m ago', tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  unread: true,  source: 'Reel: Demo' },
  { id: 5, user: '@meera.coaching',  name: 'Meera R.',     msg: 'Already bought! Amazing product',    time: '1h ago',  tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25',     unread: false, source: 'Reel: Pricing Tips' },
  { id: 6, user: '@suresh.brand',    name: 'Suresh B.',    msg: 'Can you do a custom deal?',          time: '2h ago',  tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  unread: false, source: 'Story: Flash Sale' },
  { id: 7, user: '@neha_wellness',   name: 'Neha W.',      msg: 'Does this ship to Bangalore?',       time: '3h ago',  tag: 'Lead',     tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25',  unread: false, source: 'Post: BTS' },
  { id: 8, user: '@vikas.official',  name: 'Vikas M.',     msg: 'Loved the content, very helpful',    time: '5h ago',  tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25',     unread: false, source: 'Reel: Demo' },
]

const TAGS = ['All', 'Hot Lead', 'Lead', 'Buyer']

export default function ConversationsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [selected, setSelected] = useState(convos[0])

  const filtered = convos.filter(c => {
    const matchTag = activeTag === 'All' || c.tag === activeTag
    const matchSearch = c.user.toLowerCase().includes(search.toLowerCase()) || c.msg.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 -my-8 h-[calc(100vh-128px)] min-h-[500px]">

      {/* Left panel */}
      <div className="w-full sm:w-72 lg:w-80 flex-shrink-0 border-r border-white/8 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-white/8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all" />
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

        {/* Convo list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full flex items-start gap-3 p-4 border-b border-white/5 text-left transition-colors ${
                selected.id === c.id ? 'bg-violet-500/10' : 'hover:bg-white/4'
              }`}>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center text-xs font-bold border border-white/10">
                  {c.name[0]}
                </div>
                {c.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#0a0a14]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold truncate ${c.unread ? 'text-white' : 'text-white/70'}`}>{c.user}</span>
                  <span className="text-xs text-white/25 flex-shrink-0">{c.time}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${c.unread ? 'text-white/60' : 'text-white/35'}`}>{c.msg}</p>
                <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full border ${c.tagColor}`}>{c.tag}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageCircle className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-sm text-white/30">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: chat view */}
      <div className="hidden sm:flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center text-sm font-bold border border-white/10">
              {selected.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selected.user}</p>
              <p className="text-xs text-white/35">via {selected.source}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${selected.tagColor}`}>{selected.tag}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div className="flex justify-start">
            <div className="max-w-xs bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-white/80">{selected.msg}</p>
              <p className="text-xs text-white/25 mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {selected.time}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-xs bg-violet-500/20 border border-violet-500/25 rounded-2xl rounded-tr-sm px-4 py-3">
              <p className="text-sm text-white/85">Hi! Thanks for reaching out. Here is the link you need: igrowth.app/course 🚀</p>
              <p className="text-xs text-white/25 mt-1.5">Auto-reply · just now</p>
            </div>
          </div>
        </div>

        {/* Reply box */}
        <div className="px-6 py-4 border-t border-white/8">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <input placeholder="Type a reply..." className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none" />
            <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all">Send</button>
          </div>
          <p className="text-xs text-white/25 mt-2 text-center">Replies are sent via Instagram DM (requires connected account)</p>
        </div>
      </div>
    </div>
  )
}
