'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  Zap, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Play,
  MessageCircle, Hash, Heart, BookmarkIcon, X, ChevronRight,
  Check, AlertCircle, Users, Loader2, Wifi
} from 'lucide-react'

type AutomationStatus = 'active' | 'paused' | 'draft'
type TriggerType = 'dm_keyword' | 'post_comment' | 'reel_comment' | 'story_reply' | 'new_follower' | 'post_like'
type ActionType = 'send_dm' | 'send_sequence' | 'tag_lead' | 'reply_comment' | 'add_to_crm'

interface Condition {
  id: string; field: 'message' | 'username' | 'follower_count'
  operator: 'contains' | 'equals' | 'starts_with' | 'greater_than'; value: string
}
interface ActionStep {
  id: string; type: ActionType; delay: number; message: string; tag?: string
}
interface Automation {
  id: string; user_id: string; name: string; trigger: TriggerType; trigger_label: string
  keywords: string[]; conditions: Condition[]; actions: ActionStep[]
  status: AutomationStatus; runs: number; last_run: string | null
  success_rate: number; created_at: string; updated_at: string
}

const TRIGGER_OPTIONS = [
  { value: 'dm_keyword'   as TriggerType, label: 'DM Keyword',   icon: MessageCircle, desc: 'Triggered when a DM contains specific words' },
  { value: 'post_comment' as TriggerType, label: 'Post Comment', icon: Hash,          desc: 'Triggered when someone comments on your post' },
  { value: 'reel_comment' as TriggerType, label: 'Reel Comment', icon: Hash,          desc: 'Triggered when someone comments on your Reel' },
  { value: 'story_reply'  as TriggerType, label: 'Story Reply',  icon: BookmarkIcon,  desc: 'Triggered when someone replies to your story' },
  { value: 'new_follower' as TriggerType, label: 'New Follower', icon: Users,         desc: 'Triggered when someone follows you' },
  { value: 'post_like'    as TriggerType, label: 'Post Like',    icon: Heart,         desc: 'Triggered when someone likes your post' },
]

const ACTION_OPTIONS = [
  { value: 'send_dm'       as ActionType, label: 'Send DM',           desc: 'Send an automated direct message',   hasMessage: true,  hasTag: false },
  { value: 'reply_comment' as ActionType, label: 'Reply to Comment',  desc: 'Reply publicly to the comment',      hasMessage: true,  hasTag: false },
  { value: 'send_sequence' as ActionType, label: 'Start DM Sequence', desc: 'Start a multi-message sequence',     hasMessage: true,  hasTag: false },
  { value: 'tag_lead'      as ActionType, label: 'Tag as Lead',       desc: 'Add a tag to this contact',          hasMessage: false, hasTag: true },
  { value: 'add_to_crm'    as ActionType, label: 'Add to Contacts',   desc: 'Save contact to your contacts list', hasMessage: false, hasTag: false },
]

const FIELD_OPTIONS    = ['message', 'username', 'follower_count'] as const
const OPERATOR_OPTIONS = ['contains', 'equals', 'starts_with', 'greater_than'] as const

const statusStyle: Record<AutomationStatus, { bg: string; text: string; border: string }> = {
  active: { bg: 'var(--box-green-bg)',  text: 'var(--box-green-text)',  border: 'var(--box-green-border)' },
  paused: { bg: 'var(--box-amber-bg)',  text: 'var(--box-amber-text)',  border: 'var(--box-amber-border)' },
  draft:  { bg: 'var(--surface-2)',     text: 'var(--text-muted)',      border: 'var(--border)' },
}
const triggerIcon: Record<TriggerType, React.ElementType> = {
  dm_keyword: MessageCircle, post_comment: Hash, reel_comment: Hash,
  story_reply: BookmarkIcon, new_follower: Users, post_like: Heart,
}

function uid() { return Math.random().toString(36).slice(2, 9) }

// ─── Builder Modal ─────────────────────────────────────────
function BuilderModal({ initial, onSave, onClose, userId }: {
  initial: Automation | null; onSave: (a: Automation) => void; onClose: () => void; userId: string
}) {
  const isEdit = !!initial?.id
  const STEPS = ['trigger', 'conditions', 'actions', 'review'] as const
  type Step = typeof STEPS[number]

  const [step, setStep]             = useState<Step>('trigger')
  const [saving, setSaving]         = useState(false)
  const [name, setName]             = useState(initial?.name ?? '')
  const [trigger, setTrigger]       = useState<TriggerType>(initial?.trigger ?? 'dm_keyword')
  const [keywords, setKeywords]     = useState<string[]>(initial?.keywords ?? [])
  const [kwInput, setKwInput]       = useState('')
  const [conditions, setConditions] = useState<Condition[]>(initial?.conditions ?? [])
  const [actions, setActions]       = useState<ActionStep[]>(initial?.actions ?? [{ id: uid(), type: 'send_dm', delay: 0, message: '' }])

  const stepIdx = STEPS.indexOf(step)

  function addKeyword() {
    const kw = kwInput.trim().toLowerCase()
    if (kw && !keywords.includes(kw)) setKeywords(p => [...p, kw])
    setKwInput('')
  }
  function addCondition() { setConditions(p => [...p, { id: uid(), field: 'message', operator: 'contains', value: '' }]) }
  function updateCondition(id: string, key: keyof Condition, val: string) { setConditions(p => p.map(c => c.id === id ? { ...c, [key]: val } : c)) }
  function addAction() { setActions(p => [...p, { id: uid(), type: 'send_dm', delay: 0, message: '' }]) }
  function updateAction(id: string, key: keyof ActionStep, val: string | number) { setActions(p => p.map(a => a.id === id ? { ...a, [key]: val } : a)) }
  function removeAction(id: string) { setActions(p => p.filter(a => a.id !== id)) }

  async function handleSave() {
    setSaving(true)
    const trigOpt = TRIGGER_OPTIONS.find(t => t.value === trigger)!
    const payload = {
      user_id: userId, name: name || `${trigOpt.label} automation`,
      trigger, trigger_label: trigOpt.label, keywords, conditions, actions,
      status: 'draft' as AutomationStatus,
    }
    try {
      let res, data
      if (isEdit) {
        res  = await fetch(`/api/automations/${initial!.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        data = await res.json()
        onSave(data.automation)
      } else {
        res  = await fetch('/api/automations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        data = await res.json()
        onSave(data.automation)
      }
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const canNext = step === 'trigger' ? !!trigger : step === 'conditions' ? true :
    step === 'actions' ? actions.length > 0 && actions.every(a => !ACTION_OPTIONS.find(o => o.value === a.type)?.hasMessage || a.message.trim()) : true

  const inputCls = "w-full bg-white border border-[rgba(0,0,0,0.12)] rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(0,0,0,0.3)] transition-all"
  const selectCls = "bg-white border border-[rgba(0,0,0,0.12)] text-black text-xs rounded-lg px-2 py-1.5 focus:outline-none"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white border border-[rgba(0,0,0,0.1)] rounded-3xl shadow-2xl shadow-black/10 overflow-hidden"
        onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="text-base font-bold text-black">{isEdit ? 'Edit Automation' : 'New Automation'}</h2>
            <p className="text-xs text-[#737373] mt-0.5">Build your automation workflow step by step</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#737373] hover:text-black hover:bg-[rgba(0,0,0,0.06)] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Steps */}
        <div className="flex items-center px-6 py-4 border-b border-[rgba(0,0,0,0.06)] gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => i <= stepIdx ? setStep(s) : null}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                  i === stepIdx ? 'bg-[var(--box-purple-bg)] text-[var(--box-purple-text)] border border-[var(--box-purple-border)]' :
                  i < stepIdx   ? 'text-[var(--green)]' : 'text-[#9ca3af]'
                }`}>
                {i < stepIdx ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-[#d1d5db]" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5" style={{ maxHeight: 'calc(90vh - 220px)' }}>
          <div>
            <label className="text-xs font-medium text-[#737373] mb-1.5 block">Automation name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. DM Pricing Keyword Flow"
              className={inputCls} />
          </div>

          {step === 'trigger' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Choose Trigger</p>
              <div className="grid gap-2">
                {TRIGGER_OPTIONS.map(t => (
                  <button key={t.value} onClick={() => setTrigger(t.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      trigger === t.value
                        ? 'bg-[var(--box-purple-bg)] border-[var(--box-purple-border)] text-[var(--box-purple-text)]'
                        : 'bg-[var(--surface-1)] border-[rgba(0,0,0,0.08)] text-[#404040] hover:bg-[var(--surface-2)] hover:text-black'
                    }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      trigger === t.value ? 'bg-[var(--box-purple-border)]' : 'bg-[rgba(0,0,0,0.05)]'
                    }`}>
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div><p className="text-sm font-semibold">{t.label}</p><p className="text-xs opacity-60 mt-0.5">{t.desc}</p></div>
                    {trigger === t.value && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
              {['dm_keyword', 'post_comment', 'reel_comment'].includes(trigger) && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#737373] block">Keywords <span className="text-[#9ca3af]">(press Enter to add)</span></label>
                  <div className="flex gap-2">
                    <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                      placeholder="e.g. price, info, link" className={inputCls} />
                    <button onClick={addKeyword} className="px-4 py-2.5 bg-[var(--box-purple-bg)] text-[var(--box-purple-text)] border border-[var(--box-purple-border)] rounded-xl text-sm hover:opacity-80 transition-colors">Add</button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map(kw => (
                        <span key={kw} className="flex items-center gap-1.5 text-xs bg-[var(--surface-2)] border border-[rgba(0,0,0,0.08)] text-[#404040] px-2.5 py-1 rounded-full font-mono">
                          &quot;{kw}&quot;
                          <button onClick={() => setKeywords(p => p.filter(k => k !== kw))} className="text-[#9ca3af] hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'conditions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Conditions <span className="normal-case">(optional)</span></p>
                <button onClick={addCondition} className="flex items-center gap-1 text-xs text-[var(--box-purple-text)] hover:opacity-80 transition-colors"><Plus className="w-3.5 h-3.5" /> Add condition</button>
              </div>
              {conditions.length === 0 && (
                <div className="p-5 bg-[var(--surface-1)] border border-[rgba(0,0,0,0.08)] rounded-xl text-center">
                  <p className="text-xs text-[#9ca3af]">No conditions — triggers for everyone.</p>
                </div>
              )}
              {conditions.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-[var(--surface-1)] border border-[rgba(0,0,0,0.08)] rounded-xl p-3">
                  <select value={c.field} onChange={e => updateCondition(c.id, 'field', e.target.value)} className={selectCls}>
                    {FIELD_OPTIONS.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                  </select>
                  <select value={c.operator} onChange={e => updateCondition(c.id, 'operator', e.target.value)} className={selectCls}>
                    {OPERATOR_OPTIONS.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                  </select>
                  <input value={c.value} onChange={e => updateCondition(c.id, 'value', e.target.value)} placeholder="value"
                    className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] text-black text-xs rounded-lg px-3 py-1.5 placeholder-[#9ca3af] focus:outline-none" />
                  <button onClick={() => setConditions(p => p.filter(x => x.id !== c.id))} className="text-[#9ca3af] hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          )}

          {step === 'actions' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Actions <span className="normal-case">(executed in order)</span></p>
              {actions.map((a, idx) => {
                const opt = ACTION_OPTIONS.find(o => o.value === a.type)!
                return (
                  <div key={a.id} className="bg-[var(--surface-1)] border border-[rgba(0,0,0,0.08)] rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--box-purple-bg)] text-[var(--box-purple-text)] text-xs flex items-center justify-center font-bold flex-shrink-0 border border-[var(--box-purple-border)]">{idx + 1}</span>
                      <select value={a.type} onChange={e => updateAction(a.id, 'type', e.target.value as ActionType)}
                        className="flex-1 bg-white border border-[rgba(0,0,0,0.1)] text-black text-sm rounded-lg px-3 py-2 focus:outline-none">
                        {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {actions.length > 1 && <button onClick={() => removeAction(a.id)} className="text-[#9ca3af] hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>}
                    </div>
                    <p className="text-xs text-[#737373]">{opt.desc}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#737373]">Delay:</span>
                      <input type="number" min={0} max={10080} value={a.delay} onChange={e => updateAction(a.id, 'delay', Number(e.target.value))}
                        className="w-20 bg-white border border-[rgba(0,0,0,0.1)] text-black text-xs rounded-lg px-2 py-1.5 focus:outline-none text-center" />
                      <span className="text-xs text-[#9ca3af]">minutes after trigger</span>
                    </div>
                    {opt.hasMessage && (
                      <div>
                        <label className="text-xs text-[#737373] mb-1.5 block">Message <span className="text-[#9ca3af]">— use {'{{name}}'} for personalization</span></label>
                        <textarea value={a.message} onChange={e => updateAction(a.id, 'message', e.target.value)} rows={3} placeholder="Type your message..."
                          className="w-full bg-white border border-[rgba(0,0,0,0.1)] text-black text-sm rounded-xl px-4 py-3 placeholder-[#9ca3af] focus:outline-none resize-none transition-all" />
                        <p className="text-xs text-[#9ca3af] mt-1">{a.message.length}/1000 chars</p>
                      </div>
                    )}
                    {opt.hasTag && (
                      <div>
                        <label className="text-xs text-[#737373] mb-1.5 block">Tag name</label>
                        <input value={a.tag ?? ''} onChange={e => updateAction(a.id, 'tag', e.target.value)} placeholder="e.g. Hot Lead" className={inputCls} />
                      </div>
                    )}
                  </div>
                )
              })}
              <button onClick={addAction} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[rgba(0,0,0,0.15)] rounded-xl text-xs text-[#9ca3af] hover:text-black hover:border-[rgba(0,0,0,0.3)] transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add another action
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Review & Save</p>
              <div className="space-y-3">
                {[
                  { label:'Name', content: <p className="text-sm font-semibold text-black">{name || '(untitled)'}</p> },
                  { label:'Trigger', content: <p className="text-sm font-semibold text-black">{TRIGGER_OPTIONS.find(t => t.value === trigger)?.label}</p> },
                  { label:'Conditions', content: conditions.length === 0 ? <p className="text-xs text-[#9ca3af]">None</p> : conditions.map(c => <p key={c.id} className="text-xs text-[#404040] font-mono">{c.field} {c.operator} &quot;{c.value}&quot;</p>) },
                  { label:`Actions (${actions.length})`, content: actions.map((a,i) => (
                    <div key={a.id} className="flex items-start gap-2 mb-1">
                      <span className="text-xs text-[var(--box-purple-text)] font-bold mt-0.5">{i+1}.</span>
                      <div><p className="text-xs font-medium text-black">{ACTION_OPTIONS.find(o => o.value === a.type)?.label}</p>{a.message && <p className="text-xs text-[#737373] mt-0.5 line-clamp-2">{a.message}</p>}</div>
                    </div>
                  )) },
                ].map(row => (
                  <div key={row.label} className="bg-[var(--surface-1)] border border-[rgba(0,0,0,0.08)] rounded-xl p-4">
                    <p className="text-xs text-[#737373] mb-1">{row.label}</p>
                    {row.content}
                  </div>
                ))}
              </div>
              {!name && (
                <div className="flex items-center gap-2 p-3 bg-[var(--box-amber-bg)] border border-[var(--box-amber-border)] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-[var(--box-amber-text)] flex-shrink-0" />
                  <p className="text-xs text-[var(--box-amber-text)]">Add a name so you can find this automation later.</p>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-[var(--box-blue-bg)] border border-[var(--box-blue-border)] rounded-xl">
                <Wifi className="w-4 h-4 text-[var(--box-blue-text)] flex-shrink-0" />
                <p className="text-xs text-[var(--box-blue-text)]">This automation will be saved to your account and persist across sessions.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(0,0,0,0.08)]">
          <button onClick={() => stepIdx > 0 ? setStep(STEPS[stepIdx - 1]) : onClose()} className="px-4 py-2 text-sm text-[#737373] hover:text-black transition-colors">
            {stepIdx === 0 ? 'Cancel' : '← Back'}
          </button>
          {step === 'review' ? (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-black/80 transition-all shadow-sm disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save automation'}
            </button>
          ) : (
            <button onClick={() => canNext && setStep(STEPS[stepIdx + 1])} disabled={!canNext}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                canNext ? 'bg-black text-white hover:bg-black/80 shadow-sm' : 'bg-[var(--surface-2)] text-[#9ca3af] cursor-not-allowed'
              }`}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function AutomationsPage() {
  const [items, setItems]             = useState<Automation[]>([])
  const [loading, setLoading]         = useState(true)
  const [userId, setUserId]           = useState<string>('')
  const [showBuilder, setShowBuilder] = useState(false)
  const [editTarget, setEditTarget]   = useState<Automation | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [toastMsg, setToastMsg]       = useState<string>('')

  function toast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

  const loadAutomations = useCallback(async (uid: string) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/automations?user_id=${encodeURIComponent(uid)}`)
      const data = await res.json()
      setItems(data.automations ?? [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetch('/api/instagram/session')
      .then(r => r.json())
      .then(d => { const uid = d?.instagram?.user_id ?? d?.user_id ?? 'default_user'; setUserId(uid); loadAutomations(uid) })
      .catch(() => { setUserId('default_user'); loadAutomations('default_user') })
  }, [loadAutomations])

  async function toggleStatus(id: string, current: AutomationStatus) {
    const next = current === 'active' ? 'paused' : 'active'
    setItems(p => p.map(a => a.id === id ? { ...a, status: next } : a))
    await fetch(`/api/automations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
    toast(`Automation ${next === 'active' ? 'activated' : 'paused'}`)
  }

  function handleSave(a: Automation) {
    setItems(p => { const exists = p.find(x => x.id === a.id); return exists ? p.map(x => x.id === a.id ? a : x) : [a, ...p] })
    setShowBuilder(false); setEditTarget(null)
    toast(editTarget ? 'Automation updated' : 'Automation created')
  }

  async function handleDelete(id: string) {
    setItems(p => p.filter(a => a.id !== id)); setDeleteId(null)
    await fetch(`/api/automations/${id}`, { method: 'DELETE' })
    toast('Automation deleted')
  }

  const active    = items.filter(a => a.status === 'active').length
  const totalRuns = items.reduce((s, a) => s + (a.runs ?? 0), 0)
  const avgRate   = items.filter(a => a.runs > 0).reduce((s, a, _, arr) => s + a.success_rate / arr.length, 0)

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[var(--box-green-bg)] border border-[var(--box-green-border)] text-[var(--box-green-text)] text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg">
          <Check className="w-3.5 h-3.5" /> {toastMsg}
        </div>
      )}

      {/* Webhook banner */}
      <div className="flex items-start gap-3 p-4 bg-[var(--box-blue-bg)] border border-[var(--box-blue-border)] rounded-2xl">
        <Wifi className="w-4 h-4 text-[var(--box-blue-text)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-[var(--box-blue-text)]">Webhook URL for Meta App Dashboard</p>
          <p className="text-xs text-[#404040] mt-0.5 font-mono break-all">https://igrowth-platform.vercel.app/api/instagram/webhook</p>
          <p className="text-xs text-[#737373] mt-1">Verify Token: <span className="font-mono text-[var(--box-blue-text)]">igrowth_verify_2026</span> · Subscribe to: <span className="font-mono">messages, comments</span></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Flows',     value: loading ? '—' : active,              bg: 'var(--box-green-bg)',  border: 'var(--box-green-border)',  text: 'var(--box-green-text)' },
          { label: 'Total Runs',       value: loading ? '—' : totalRuns,           bg: 'var(--box-purple-bg)', border: 'var(--box-purple-border)', text: 'var(--box-purple-text)' },
          { label: 'Avg Success Rate', value: loading ? '—' : `${Math.round(avgRate)}%`, bg: 'var(--box-blue-bg)',   border: 'var(--box-blue-border)',   text: 'var(--box-blue-text)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}` }} className="rounded-2xl p-5">
            <div style={{ fontSize:'24px', fontWeight:800, color: s.text, fontVariantNumeric:'tabular-nums' }} className="mb-1">{s.value}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-black">All Automations</h2>
        <button onClick={() => { setEditTarget(null); setShowBuilder(true) }}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-black/80 transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" /> New automation
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-5 h-5 text-[#737373] animate-spin" />
          <p className="text-sm text-[#737373]">Loading automations...</p>
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="space-y-3">
          {items.map(a => {
            const TIcon = triggerIcon[a.trigger] ?? Zap
            const ss = statusStyle[a.status]
            return (
              <div key={a.id} style={{ background:'#ffffff', border:'1px solid rgba(0,0,0,0.08)' }}
                className="rounded-2xl p-5 hover:border-[rgba(0,0,0,0.16)] transition-colors shadow-sm">
                <div className="flex items-start gap-4">
                  <div style={{ background:'var(--box-purple-bg)', border:'1px solid var(--box-purple-border)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TIcon className="w-4 h-4" style={{ color:'var(--box-purple-text)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-black">{a.name}</p>
                        <p className="text-xs text-[#737373] mt-0.5">{a.trigger_label} → {a.actions?.length ?? 0} action{(a.actions?.length ?? 0) !== 1 ? 's' : ''}</p>
                        {(a.keywords?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {a.keywords.slice(0, 4).map(k => (
                              <span key={k} style={{ background:'var(--surface-2)', border:'1px solid rgba(0,0,0,0.08)' }}
                                className="text-xs text-[#404040] px-2 py-0.5 rounded-full font-mono">&quot;{k}&quot;</span>
                            ))}
                            {a.keywords.length > 4 && <span className="text-xs text-[#9ca3af]">+{a.keywords.length - 4} more</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}
                          className="text-xs px-2 py-0.5 rounded-full">
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                        <button onClick={() => toggleStatus(a.id, a.status)} aria-label="Toggle">
                          {a.status === 'active' ? <ToggleRight className="w-5 h-5 text-[var(--green)]" /> : <ToggleLeft className="w-5 h-5 text-[#9ca3af]" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="text-xs text-[#9ca3af]">{a.runs} runs</span>
                      {(a.runs ?? 0) > 0 && <span className="text-xs text-[#9ca3af]">{a.success_rate}% success</span>}
                      <span className="text-xs text-[#9ca3af]">Last: {a.last_run ? new Date(a.last_run).toLocaleDateString() : 'Never'}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <button onClick={() => { setEditTarget(a); setShowBuilder(true) }}
                          className="p-1.5 rounded-lg text-[#9ca3af] hover:text-black hover:bg-[rgba(0,0,0,0.06)] transition-colors" aria-label="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(a.id)}
                          className="p-1.5 rounded-lg text-[#9ca3af] hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {a.status === 'draft' && (
                          <button onClick={() => toggleStatus(a.id, 'draft')}
                            style={{ background:'var(--box-green-bg)', color:'var(--box-green-text)', border:'1px solid var(--box-green-border)' }}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80 transition-colors">
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

          {items.length === 0 && !loading && (
            <div className="text-center py-16">
              <Zap className="w-10 h-10 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#737373]">No automations yet</p>
              <p className="text-xs text-[#9ca3af] mt-1">Create your first automation to start capturing leads on autopilot.</p>
              <button onClick={() => setShowBuilder(true)} className="mt-4 flex items-center gap-2 mx-auto bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-black/80 transition-all">
                <Plus className="w-3.5 h-3.5" /> Create first automation
              </button>
            </div>
          )}
        </div>
      )}

      {showBuilder && (
        <BuilderModal initial={editTarget} onSave={handleSave}
          onClose={() => { setShowBuilder(false); setEditTarget(null) }} userId={userId} />
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 shadow-xl shadow-black/10">
            <h3 className="text-base font-bold text-black mb-2">Delete automation?</h3>
            <p className="text-sm text-[#737373] mb-6">This cannot be undone. All run history will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-[var(--surface-2)] text-[#404040] text-sm hover:bg-[var(--surface-3)] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId!)} className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
