'use client'
import { useState } from 'react'
import { Zap, Plus, Play, Pause, Trash2, TrendingUp } from 'lucide-react'

const automations = [
  { id: 1, name: "DM Keyword: 'price'",     trigger: 'DM keyword',   runs: 89,  leads: 24, status: 'Active',  created: 'Apr 10' },
  { id: 2, name: 'Comment: Pricing Reel',    trigger: 'Post comment', runs: 54,  leads: 11, status: 'Active',  created: 'Apr 8'  },
  { id: 3, name: 'Story Reply Flow',         trigger: 'Story reply',  runs: 23,  leads: 6,  status: 'Paused',  created: 'Apr 5'  },
  { id: 4, name: "DM Keyword: 'link'",      trigger: 'DM keyword',   runs: 112, leads: 31, status: 'Active',  created: 'Apr 1'  },
  { id: 5, name: 'Welcome DM - New Follow', trigger: 'New follower',  runs: 67,  leads: 18, status: 'Active',  created: 'Mar 28' },
  { id: 6, name: 'Flash Sale Broadcast',    trigger: 'Manual',        runs: 200, leads: 44, status: 'Paused',  created: 'Mar 22' },
]

const templates = [
  { name: 'Lead Capture DM',    desc: 'Auto-reply to DM keywords with a lead form link',  icon: '💬' },
  { name: 'Comment to DM',      desc: 'DM everyone who comments on a specific post',       icon: '📣' },
  { name: 'New Follower Welcome', desc: 'Send a welcome message to every new follower',    icon: '👋' },
  { name: 'Story CTA Flow',     desc: 'Follow up with story viewers who reply',            icon: '🎯' },
]

export default function AutomationsPage() {
  const [flows, setFlows] = useState(automations)

  function toggle(id: number) {
    setFlows(f => f.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Automations</h2>
          <p className="text-xs text-white/40 mt-0.5">{flows.filter(f => f.status === 'Active').length} active flows · {flows.reduce((s, f) => s + f.runs, 0)} total runs this month</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
          <Plus className="w-3.5 h-3.5" /> New Flow
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Runs',   value: flows.reduce((s, f) => s + f.runs, 0).toString(),   color: 'text-brand-400' },
          { label: 'Leads Captured', value: flows.reduce((s, f) => s + f.leads, 0).toString(), color: 'text-green-400' },
          { label: 'Active Flows', value: flows.filter(f => f.status === 'Active').length.toString(), color: 'text-accent-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Flow table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="text-sm font-bold text-white">Your Flows</h3>
        </div>
        <div className="divide-y divide-white/5">
          {flows.map(a => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-accent-500/15 border border-accent-500/25 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-accent-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{a.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{a.trigger} · Created {a.created}</div>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs text-white/40">
                <div className="text-center">
                  <div className="font-bold text-white">{a.runs}</div>
                  <div>runs</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-400">{a.leads}</div>
                  <div>leads</div>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                a.status === 'Active'
                  ? 'bg-green-500/15 text-green-300 border-green-500/25'
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}>{a.status}</span>
              <button
                onClick={() => toggle(a.id)}
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label={a.status === 'Active' ? 'Pause' : 'Resume'}
              >
                {a.status === 'Active'
                  ? <Pause className="w-3.5 h-3.5 text-white/50" />
                  : <Play  className="w-3.5 h-3.5 text-white/50" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Start from a Template</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map(t => (
            <button key={t.name} className="text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:border-brand-500/30 transition-all group">
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{t.name}</div>
              <div className="text-xs text-white/40 mt-1">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
