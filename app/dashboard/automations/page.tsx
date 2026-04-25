'use client'
import { useState } from 'react'
import {
  Zap, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Play,
  MessageCircle, Hash, Heart, BookmarkIcon, X, ChevronRight,
  ChevronDown, Check, ArrowRight, Clock, AlertCircle, Users
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────
type AutomationStatus = 'active' | 'paused' | 'draft'
type TriggerType = 'dm_keyword' | 'post_comment' | 'story_reply' | 'new_follower' | 'post_like' | 'reel_comment'
type ActionType = 'send_dm' | 'send_sequence' | 'tag_lead' | 'reply_comment' | 'add_to_crm'

interface Condition {
  id: string
  field: 'message' | 'username' | 'follower_count'
  operator: 'contains' | 'equals' | 'starts_with' | 'greater_than'
  value: string
}

interface ActionStep {
  id: string
  type: ActionType
  delay: number // minutes
  message: string
  tag?: string
}

interface Automation {
  id: number
  name: string
  trigger: TriggerType
  triggerLabel: string
  keywords: string[]
  conditions: Condition[]
  actions: ActionStep[]
  runs: number
  status: AutomationStatus
  lastRun: string
  successRate: number
}

// ─── Seed Data ───────────────────────────────────────────
const SEED: Automation[] = [
  {
    id: 1,
    name: "DM Keyword: 'price'",
    trigger: 'dm_keyword',
    triggerLabel: 'DM contains keyword',
    keywords: ['price', 'pricing', 'cost', 'how much'],
    conditions: [{ id: 'c1', field: 'follower_count', operator: 'greater_than', value: '100' }],
    actions: [
      { id: 'a1', type: 'send_dm', delay: 0, message: 'Hi {{name}}! Thanks for reaching out 😊 Here are our current pricing options: [link]. Let me know if you have questions!' },
      { id: 'a2', type: 'tag_lead', delay: 0, message: '', tag: 'Pricing Interest' },
      { id: 'a3', type: 'add_to_crm', delay: 0, message: '' },
    ],
    runs: 89, status: 'active', lastRun: '2m ago', successRate: 94,
  },
  {
    id: 2,
    name: 'Comment Reply: Pricing Reel',
    trigger: 'reel_comment',
    triggerLabel: 'Reel comment contains keyword',
    keywords: ['link', 'price', 'info', 'details'],
    conditions: [],
    actions: [
      { id: 'a1', type: 'reply_comment', delay: 0, message: 'Hey {{name}}! Check your DMs 📩' },
      { id: 'a2', type: 'send_dm', delay: 1, message: "Hi {{name}}! I noticed your comment on my reel. Here's all the info you need: [link]" },
    ],
    runs: 54, status: 'active', lastRun: '8m ago', successRate: 88,
  },
  {
    id: 3,
    name: 'New Follower Welcome Sequence',
    trigger: 'new_follower',
    triggerLabel: 'New follower',
    keywords: [],
    conditions: [],
    actions: [
      { id: 'a1', type: 'send_dm', delay: 5, message: "Welcome {{name}}! 🎉 So glad you're here. I share tips on [niche] every week. Hit reply if you have any questions!" },
      { id: 'a2', type: 'tag_lead', delay: 0, message: '', tag: 'New Follower' },
    ],
    runs: 142, status: 'paused', lastRun: '3d ago', successRate: 76,
  },
  {
    id: 4,
    name: 'Story Reply Auto-Response',
    trigger: 'story_reply',
    triggerLabel: 'Story reply received',
    keywords: ['any'],
    conditions: [],
    actions: [
      { id: 'a1', type: 'send_dm', delay: 0, message: 'Hey {{name}}! Thanks for the reply on my story 💜 What would you like to know more about?' },
    ],
    runs: 23, status: 'paused', lastRun: '1d ago', successRate: 82,
  },
  {
    id: 5,
    name: 'Post Like Thank You',
    trigger: 'post_like',
    triggerLabel: 'Post liked',
    keywords: [],
    conditions: [{ id: 'c1', field: 'follower_count', operator: 'greater_than', value: '500' }],
    actions: [
      { id: 'a1', type: 'send_dm', delay: 30, message: 'Hey {{name}}! Saw you liked my post ❤️ Thanks so much! Let me know if you want more content like that.' },
    ],
    runs: 0, status: 'draft', lastRun: 'Never', successRate: 0,
  },
]

// ─── Constants ───────────────────────────────────────────
const TRIGGER_OPTIONS: { value: TriggerType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'dm_keyword',    label: 'DM Keyword',          icon: MessageCircle, desc: 'Triggered when a DM contains specific words' },
  { value: 'post_comment',  label: 'Post Comment',        icon: Hash,          desc: 'Triggered when someone comments on your post' },
  { value: 'reel_comment',  label: 'Reel Comment',        icon: Hash,          desc: 'Triggered when someone comments on your Reel' },
  { value: 'story_reply',   label: 'Story Reply',         icon: BookmarkIcon,  desc: 'Triggered when someone replies to your story' },
  { value: 'new_follower',  label: 'New Follower',        icon: Users,         desc: 'Triggered when someone follows you' },
  { value: 'post_like',     label: 'Post Like',           icon: Heart,         desc: 'Triggered when someone likes your post' },
]

const ACTION_OPTIONS: { value: ActionType; label: string; desc: string; hasMessage: boolean; hasTag: boolean }[] = [
  { value: 'send_dm',       label: 'Send DM',             desc: 'Send an automated direct message',    hasMessage: true,  hasTag: false },
  { value: 'reply_comment', label: 'Reply to Comment',    desc: 'Reply publicly to the comment',       hasMessage: true,  hasTag: false },
  { value: 'send_sequence', label: 'Start DM Sequence',   desc: 'Start a multi-message sequence',      hasMessage: true,  hasTag: false },
  { value: 'tag_lead',      label: 'Tag as Lead',         desc: 'Add a tag to this follower in CRM',   hasMessage: false, hasTag: true },
  { value: 'add_to_crm',    label: 'Add to CRM',          desc: 'Save contact to Followers CRM',       hasMessage: false, hasTag: false },
]

const FIELD_OPTIONS   = ['message', 'username', 'follower_count'] as const
const OPERATOR_OPTIONS = ['contains', 'equals', 'starts_with', 'greater_than'] as const

const statusStyle: Record<AutomationStatus, string> = {
  active: 'bg-green-500/15 text-green-300 border-green-500/25',
  paused: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  draft:  'bg-white/5 text-white/35 border-white/10',
}

const triggerIcon: Record<TriggerType, React.ElementType> = {
  dm_keyword:   MessageCircle,
  post_comment: Hash,
  reel_comment: Hash,
  story_reply:  BookmarkIcon,
  new_follower: Users,
  post_like:    Heart,
}

function uid() { return Math.random().toString(36).slice(2, 9) }

// ─── Builder Modal ────────────────────────────────────────
function BuilderModal({
  initial, onSave, onClose
}: {
  initial: Partial<Automation> | null
  onSave: (a: Automation) => void
  onClose: () => void
}) {
  const isEdit = !!initial?.id

  const [step, setStep] = useState<'trigger' | 'conditions' | 'actions' | 'review'>('trigger')
  const [name, setName] = useState(initial?.name ?? '')
  const [trigger, setTrigger] = useState<TriggerType>(initial?.trigger ?? 'dm_keyword')
  const [keywords, setKeywords] = useState<string[]>(initial?.keywords ?? [])
  const [kwInput, setKwInput] = useState('')
  const [conditions, setConditions] = useState<Condition[]>(initial?.conditions ?? [])
  const [actions, setActions] = useState<ActionStep[]>(initial?.actions ?? [
    { id: uid(), type: 'send_dm', delay: 0, message: '' }
  ])

  const STEPS: typeof step[] = ['trigger', 'conditions', 'actions', 'review']
  const stepIdx = STEPS.indexOf(step)

  function addKeyword() {
    const kw = kwInput.trim().toLowerCase()
    if (kw && !keywords.includes(kw)) setKeywords(p => [...p, kw])
    setKwInput('')
  }

  function addCondition() {
    setConditions(p => [...p, { id: uid(), field: 'message', operator: 'contains', value: '' }])
  }

  function updateCondition(id: string, key: keyof Condition, val: string) {
    setConditions(p => p.map(c => c.id === id ? { ...c, [key]: val } : c))
  }

  function addAction() {
    setActions(p => [...p, { id: uid(), type: 'send_dm', delay: 0, message: '' }])
  }

  function updateAction(id: string, key: keyof ActionStep, val: string | number) {
    setActions(p => p.map(a => a.id === id ? { ...a, [key]: val } : a))
  }

  function removeAction(id: string) {
    setActions(p => p.filter(a => a.id !== id))
  }

  function handleSave() {
    const triggerOption = TRIGGER_OPTIONS.find(t => t.value === trigger)!
    onSave({
      id: initial?.id ?? Date.now(),
      name: name || `${triggerOption.label} automation`,
      trigger,
      triggerLabel: triggerOption.label,
      keywords,
      conditions,
      actions,
      runs: initial?.runs ?? 0,
      status: 'draft',
      lastRun: initial?.lastRun ?? 'Never',
      successRate: initial?.successRate ?? 0,
    })
  }

  const canNext = (
    step === 'trigger'    ? trigger !== null : 
    step === 'conditions' ? true :
    step === 'actions'    ? actions.length > 0 && actions.every(a => !ACTION_OPTIONS.find(o => o.value === a.type)?.hasMessage || a.message.trim()) :
    true
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-[#0f0e1c] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <h2 className="text-base font-bold text-white">{isEdit ? 'Edit Automation' : 'New Automation'}</h2>
            <p className="text-xs text-white/35 mt-0.5">Build your automation workflow step by step</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-4 border-b border-white/6 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => i < stepIdx || (i === stepIdx) ? setStep(s) : null}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                  i === stepIdx ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                  i < stepIdx   ? 'text-green-400' : 'text-white/25'
                }`}>
                {i < stepIdx ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/15" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5" style={{ maxHeight: 'calc(90vh - 220px)' }}>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Automation name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. DM Pricing Keyword Flow"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          {/* ── STEP 1: Trigger ── */}
          {step === 'trigger' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Choose Trigger</p>
              <div className="grid gap-2">
                {TRIGGER_OPTIONS.map(t => (
                  <button key={t.value} onClick={() => setTrigger(t.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      trigger === t.value
                        ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                        : 'bg-white/3 border-white/8 text-white/60 hover:bg-white/6 hover:text-white'
                    }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      trigger === t.value ? 'bg-violet-500/25' : 'bg-white/8'
                    }`}>
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-xs opacity-60 mt-0.5">{t.desc}</p>
                    </div>
                    {trigger === t.value && <Check className="w-4 h-4 ml-auto text-violet-400" />}
                  </button>
                ))}
              </div>

              {/* Keywords (for keyword-based triggers) */}
              {['dm_keyword', 'post_comment', 'reel_comment'].includes(trigger) && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 block">Trigger keywords <span className="text-white/25">(press Enter to add)</span></label>
                  <div className="flex gap-2">
                    <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                      placeholder="e.g. price, info, link"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
                    <button onClick={addKeyword} className="px-4 py-2.5 bg-violet-500/20 text-violet-300 border border-violet-500/25 rounded-xl text-sm hover:bg-violet-500/30 transition-colors">Add</button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map(kw => (
                        <span key={kw} className="flex items-center gap-1.5 text-xs bg-white/8 border border-white/12 text-white/70 px-2.5 py-1 rounded-full font-mono">
                          &quot;{kw}&quot;
                          <button onClick={() => setKeywords(p => p.filter(k => k !== kw))} className="text-white/30 hover:text-red-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Conditions ── */}
          {step === 'conditions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Conditions <span className="text-white/25 normal-case">(optional — all must match)</span></p>
                <button onClick={addCondition} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add condition
                </button>
              </div>

              {conditions.length === 0 && (
                <div className="p-5 bg-white/3 border border-white/8 rounded-xl text-center">
                  <p className="text-xs text-white/30">No conditions — this automation triggers for everyone.</p>
                  <p className="text-xs text-white/20 mt-1">Add conditions to filter who triggers this flow.</p>
                </div>
              )}

              {conditions.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-xl p-3">
                  <select value={c.field} onChange={e => updateCondition(c.id, 'field', e.target.value)}
                    className="bg-white/8 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-violet-500/50">
                    {FIELD_OPTIONS.map(f => <option key={f} value={f} className="bg-[#0f0e1c]">{f.replace('_', ' ')}</option>)}
                  </select>
                  <select value={c.operator} onChange={e => updateCondition(c.id, 'operator', e.target.value)}
                    className="bg-white/8 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-violet-500/50">
                    {OPERATOR_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0f0e1c]">{o.replace('_', ' ')}</option>)}
                  </select>
                  <input value={c.value} onChange={e => updateCondition(c.id, 'value', e.target.value)}
                    placeholder="value"
                    className="flex-1 bg-white/8 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 placeholder-white/25 focus:outline-none focus:border-violet-500/50" />
                  <button onClick={() => setConditions(p => p.filter(x => x.id !== c.id))} className="text-white/25 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 3: Actions ── */}
          {step === 'actions' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Actions <span className="text-white/25 normal-case">(executed in order)</span></p>

              {actions.map((a, idx) => {
                const opt = ACTION_OPTIONS.find(o => o.value === a.type)!
                return (
                  <div key={a.id} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-500/25 text-violet-300 text-xs flex items-center justify-center font-bold flex-shrink-0">{idx + 1}</span>
                      <select value={a.type} onChange={e => updateAction(a.id, 'type', e.target.value as ActionType)}
                        className="flex-1 bg-white/8 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500/50">
                        {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#0f0e1c]">{o.label}</option>)}
                      </select>
                      {actions.length > 1 && (
                        <button onClick={() => removeAction(a.id)} className="text-white/25 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-white/35">{opt.desc}</p>

                    {/* Delay */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/25" />
                      <span className="text-xs text-white/40">Delay:</span>
                      <input type="number" min={0} max={10080} value={a.delay}
                        onChange={e => updateAction(a.id, 'delay', Number(e.target.value))}
                        className="w-20 bg-white/8 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-violet-500/50 text-center" />
                      <span className="text-xs text-white/30">minutes after trigger</span>
                    </div>

                    {/* Message */}
                    {opt.hasMessage && (
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Message <span className="text-white/20">— use {'{{name}}'} for personalization</span></label>
                        <textarea value={a.message} onChange={e => updateAction(a.id, 'message', e.target.value)}
                          rows={3} placeholder="Type your message..."
                          className="w-full bg-white/8 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-white/25 focus:outline-none focus:border-violet-500/50 resize-none transition-all" />
                        <p className="text-xs text-white/20 mt-1">{a.message.length}/1000 chars</p>
                      </div>
                    )}

                    {/* Tag */}
                    {opt.hasTag && (
                      <div>
                        <label className="text-xs text-white/40 mb-1.5 block">Tag name</label>
                        <input value={a.tag ?? ''} onChange={e => updateAction(a.id, 'tag', e.target.value)}
                          placeholder="e.g. Hot Lead, Pricing Interest"
                          className="w-full bg-white/8 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
                      </div>
                    )}
                  </div>
                )
              })}

              <button onClick={addAction} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/15 rounded-xl text-xs text-white/35 hover:text-white/60 hover:border-white/25 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add another action
              </button>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 'review' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Review & Save</p>

              <div className="space-y-3">
                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-1">Name</p>
                  <p className="text-sm font-semibold text-white">{name || '(untitled)'}</p>
                </div>
                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-1">Trigger</p>
                  <p className="text-sm font-semibold text-white">{TRIGGER_OPTIONS.find(t => t.value === trigger)?.label}</p>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {keywords.map(k => <span key={k} className="text-xs bg-white/8 text-white/60 px-2 py-0.5 rounded-full font-mono">&quot;{k}&quot;</span>)}
                    </div>
                  )}
                </div>
                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Conditions</p>
                  {conditions.length === 0
                    ? <p className="text-xs text-white/30">None — triggers for everyone</p>
                    : conditions.map(c => (
                      <p key={c.id} className="text-xs text-white/70 font-mono">{c.field} {c.operator} &quot;{c.value}&quot;</p>
                    ))
                  }
                </div>
                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Actions ({actions.length})</p>
                  {actions.map((a, i) => (
                    <div key={a.id} className="flex items-start gap-2 mb-2">
                      <span className="text-xs text-violet-400 font-bold mt-0.5">{i + 1}.</span>
                      <div>
                        <p className="text-xs font-medium text-white">{ACTION_OPTIONS.find(o => o.value === a.type)?.label}</p>
                        {a.delay > 0 && <p className="text-xs text-white/30">After {a.delay} min</p>}
                        {a.message && <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{a.message}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!name && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">Add a name above so you can find this automation later.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
          <button onClick={() => stepIdx > 0 ? setStep(STEPS[stepIdx - 1]) : onClose()}
            className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors">
            {stepIdx === 0 ? 'Cancel' : '← Back'}
          </button>
          {step === 'review' ? (
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
              <Check className="w-4 h-4" /> Save automation
            </button>
          ) : (
            <button onClick={() => canNext && setStep(STEPS[stepIdx + 1])} disabled={!canNext}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                canNext
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 shadow-md shadow-violet-500/20'
                  : 'bg-white/5 text-white/25 cursor-not-allowed'
              }`}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────
export default function AutomationsPage() {
  const [items, setItems] = useState<Automation[]>(SEED)
  const [showBuilder, setShowBuilder] = useState(false)
  const [editTarget, setEditTarget] = useState<Automation | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  function toggleStatus(id: number) {
    setItems(p => p.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'paused' : a.status === 'paused' ? 'active' : 'active' }
        : a
    ))
  }

  function handleSave(a: Automation) {
    setItems(p => {
      const exists = p.find(x => x.id === a.id)
      return exists ? p.map(x => x.id === a.id ? a : x) : [...p, a]
    })
    setShowBuilder(false)
    setEditTarget(null)
  }

  function handleDelete(id: number) {
    setItems(p => p.filter(a => a.id !== id))
    setDeleteId(null)
  }

  function openEdit(a: Automation) {
    setEditTarget(a)
    setShowBuilder(true)
  }

  const active    = items.filter(a => a.status === 'active').length
  const totalRuns = items.reduce((s, a) => s + a.runs, 0)
  const avgRate   = items.filter(a => a.runs > 0).reduce((s, a, _, arr) => s + a.successRate / arr.length, 0)

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Flows',    value: active,              color: 'text-green-400' },
          { label: 'Total Runs',      value: totalRuns,           color: 'text-violet-400' },
          { label: 'Avg Success Rate',value: `${Math.round(avgRate)}%`, color: 'text-fuchsia-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">All Automations</h2>
        <button onClick={() => { setEditTarget(null); setShowBuilder(true) }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
          <Plus className="w-3.5 h-3.5" /> New automation
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map(a => {
          const TIcon = triggerIcon[a.trigger] ?? Zap
          return (
            <div key={a.id} className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/6 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <TIcon className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{a.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{a.triggerLabel} → {a.actions.length} action{a.actions.length !== 1 ? 's' : ''}</p>
                      {a.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {a.keywords.slice(0, 4).map(k => (
                            <span key={k} className="text-xs bg-white/8 border border-white/12 text-white/60 px-2 py-0.5 rounded-full font-mono">&quot;{k}&quot;</span>
                          ))}
                          {a.keywords.length > 4 && <span className="text-xs text-white/30">+{a.keywords.length - 4} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[a.status]}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                      <button onClick={() => toggleStatus(a.id)} className="text-white/30 hover:text-white transition-colors" aria-label="Toggle">
                        {a.status === 'active'
                          ? <ToggleRight className="w-5 h-5 text-green-400" />
                          : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="text-xs text-white/30">{a.runs} runs</span>
                    {a.runs > 0 && <span className="text-xs text-white/30">{a.successRate}% success</span>}
                    <span className="text-xs text-white/30">Last: {a.lastRun}</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors" aria-label="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors" aria-label="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {a.status === 'draft' && (
                        <button onClick={() => toggleStatus(a.id)}
                          className="flex items-center gap-1 text-xs bg-violet-500/15 text-violet-400 border border-violet-500/25 px-2 py-1 rounded-lg hover:bg-violet-500/25 transition-colors">
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

        {items.length === 0 && (
          <div className="text-center py-16">
            <Zap className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm font-medium text-white/30">No automations yet</p>
            <p className="text-xs text-white/20 mt-1">Create your first automation to start capturing leads on autopilot.</p>
            <button onClick={() => setShowBuilder(true)} className="mt-4 flex items-center gap-2 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
              <Plus className="w-3.5 h-3.5" /> Create first automation
            </button>
          </div>
        )}
      </div>

      {/* Builder modal */}
      {showBuilder && (
        <BuilderModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowBuilder(false); setEditTarget(null) }}
        />
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0f0e1c] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/60">
            <h3 className="text-base font-bold text-white mb-2">Delete automation?</h3>
            <p className="text-sm text-white/40 mb-6">This cannot be undone. All run history will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-white/8 text-white/60 text-sm hover:bg-white/12 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/25 text-sm hover:bg-red-500/30 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
