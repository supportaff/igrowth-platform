'use client'
import { useState } from 'react'
import { Search, Filter, MessageCircle, Clock, Tag } from 'lucide-react'

const conversations = [
  { id: 1, user: '@priya_styles',    name: 'Priya Sharma',    msg: 'What is the price for the course?',            time: '2m ago',   tag: 'Hot Lead', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25',       source: 'Reel comment', unread: true },
  { id: 2, user: '@rahul.fitness',   name: 'Rahul Kumar',     msg: 'Send me the link please',                      time: '8m ago',   tag: 'Lead',     tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25', source: 'DM keyword',   unread: true },
  { id: 3, user: '@anjali_craft',    name: 'Anjali Singh',    msg: 'Is this available in bulk?',                   time: '15m ago',  tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25', source: 'Story reply',  unread: false },
  { id: 4, user: '@kiran.d2c',       name: 'Kiran Patel',     msg: 'I want to know more about the plan',           time: '32m ago',  tag: 'Lead',     tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25', source: 'DM keyword',   unread: false },
  { id: 5, user: '@meera.coaching',  name: 'Meera Nair',      msg: 'Already bought! Amazing product',              time: '1h ago',   tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25', source: 'Post comment', unread: false },
  { id: 6, user: '@sanjay_ecom',     name: 'Sanjay Mehta',    msg: 'Do you offer any discount for bulk orders?',   time: '2h ago',   tag: 'Hot Lead', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25',       source: 'DM keyword',   unread: false },
  { id: 7, user: '@divya.wellness',  name: 'Divya Reddy',     msg: 'Can I get a demo before purchasing?',          time: '3h ago',   tag: 'Lead',     tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25', source: 'Reel comment', unread: false },
  { id: 8, user: '@arun_techbiz',    name: 'Arun Krishnan',   msg: 'Thank you for the quick response!',            time: '5h ago',   tag: 'Buyer',    tagColor: 'bg-green-500/15 text-green-300 border-green-500/25', source: 'Story reply',  unread: false },
]

const filters = ['All', 'Hot Lead', 'Lead', 'Buyer', 'Unread']

export default function ConversationsPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selected, setSelected] = useState<number | null>(1)

  const filtered = conversations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.msg.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'All' ? true : activeFilter === 'Unread' ? c.unread : c.tag === activeFilter
    return matchSearch && matchFilter
  })

  const current = conversations.find(c => c.id === selected)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Conversations</h2>
          <p className="text-xs text-white/40 mt-0.5">147 conversations today · 38 new leads captured</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[600px]">
        {/* List */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/8 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeFilter === f
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                      : 'text-white/40 border-white/10 hover:text-white'
                  }`}
                >{f}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`w-full flex items-start gap-3 p-4 border-b border-white/5 text-left transition-colors ${
                  selected === c.id ? 'bg-brand-500/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/40 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.name[0]}
                  </div>
                  {c.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-[#13121f]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${c.unread ? 'text-white' : 'text-white/70'}`}>{c.name}</span>
                    <span className="text-xs text-white/30">{c.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5">{c.msg}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1.5 ${c.tagColor}`}>{c.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {current ? (
            <>
              <div className="p-4 border-b border-white/8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/40 flex items-center justify-center text-xs font-bold">
                  {current.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{current.name}</div>
                  <div className="text-xs text-white/40">{current.user} · via {current.source}</div>
                </div>
                <span className={`ml-auto text-xs px-2.5 py-1 rounded-full border ${current.tagColor}`}>{current.tag}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80 max-w-xs">{current.msg}</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-brand-500/20 border border-brand-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-xs">
                    Hi! Thanks for reaching out. Here's the link to our pricing page: igrowth.app/pricing 🎯
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80 max-w-xs">Thank you! Will check it out now.</div>
                </div>
              </div>
              <div className="p-4 border-t border-white/8">
                <div className="flex gap-2">
                  <input
                    placeholder="Type a reply..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50"
                  />
                  <button className="bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
