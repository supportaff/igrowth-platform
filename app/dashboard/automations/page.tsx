'use client'
import { useState } from 'react'
import { Zap, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Play, MessageCircle, Hash, Heart, BookmarkIcon } from 'lucide-react'

const AUTOMATIONS = [
  { id: 1, name: "DM Keyword: 'price'",    trigger: 'DM contains keyword',  keyword: 'price',   action: 'Send product link',       runs: 89,  status: 'active',  lastRun: '2m ago' },
  { id: 2, name: 'Comment: Pricing Reel',   trigger: 'Post comment',          keyword: 'link',    action: 'Reply with DM',           runs: 54,  status: 'active',  lastRun: '8m ago' },
  { id: 3, name: 'Story Reply Flow',         trigger: 'Story reply',           keyword: 'any',     action: 'Send welcome sequence',   runs: 23,  status: 'paused',  lastRun: '3d ago' },
  { id: 4, name: 'New Follower Welcome',     trigger: 'New follower',          keyword: '—',       action: 'Send welcome DM',         runs: 142, status: 'active',  lastRun: '1h ago' },
  { id: 5, name: 'Post Like Thank You',      trigger: 'Post like',             keyword: '—',       action: 'Send thank you DM',       runs: 0,   status: 'draft',   lastRun: 'Never' },
]

const triggerIcons: Record<string, React.ElementType> = {
  'DM contains keyword': MessageCircle,
  'Post comment': Hash,
  'Story reply': BookmarkIcon,
  'New follower': Heart,
  'Post like': Heart,
}

const statusStyle: Record<string, string> = {
  active: 'bg-green-500/15 text-green-300 border-green-500/25',
  paused: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  draft:  'bg-white/5 text-white/35 border-white/10',
}

export default function AutomationsPage() {
  const [items, setItems] = useState(AUTOMATIONS)

  function toggleStatus(id: number) {
    setItems(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'paused' : a.status === 'paused' ? 'active' : a.status }
        : a
    ))
  }

  const active = items.filter(a => a.status === 'active').length
  const totalRuns = items.reduce((s, a) => s + a.runs, 0)

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Flows',    value: active,    color: 'text-green-400' },
          { label: 'Total Runs',      value: totalRuns, color: 'text-violet-400' },
          { label: 'Avg. Reply Time', value: '< 1s',    color: 'text-fuchsia-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header + create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">All Automations</h2>
        <button className="flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
          <Plus className="w-3.5 h-3.5" /> New automation
        </button>
      </div>

      {/* Automation list */}
      <div className="space-y-3">
        {items.map(a => {
          const TriggerIcon = triggerIcons[a.trigger] ?? Zap
          return (
            <div key={a.id} className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/6 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <TriggerIcon className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{a.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{a.trigger} → {a.action}</p>
                      {a.keyword !== '—' && (
                        <span className="inline-block mt-1.5 text-xs bg-white/8 border border-white/12 text-white/60 px-2 py-0.5 rounded-full font-mono">"{a.keyword}"</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[a.status]}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                      <button onClick={() => toggleStatus(a.id)} className="text-white/30 hover:text-white transition-colors" aria-label="Toggle status">
                        {a.status === 'active'
                          ? <ToggleRight className="w-5 h-5 text-green-400" />
                          : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-white/30">{a.runs} runs</span>
                    <span className="text-xs text-white/30">Last run: {a.lastRun}</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      {a.status === 'draft' && (
                        <button className="flex items-center gap-1 text-xs bg-violet-500/15 text-violet-400 border border-violet-500/25 px-2 py-1 rounded-lg hover:bg-violet-500/25 transition-colors">
                          <Play className="w-3 h-3" /> Activate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
