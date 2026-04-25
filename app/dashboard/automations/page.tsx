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

// ─── Dark-theme styles for modal inputs ───────────────────
const darkInput: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  padding: '10px 16px',
  fontSize: 14,
  color: '#ffffff',
  outline: 'none',
}
const darkSelect: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '6px 8px',
  fontSize: 12,
  color: '#ffffff',
  outline: 'none',
}
const darkTextarea: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 14,
  color: '#ffffff',
  outline: 'none',
  resize: 'vertical' as const,
}

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 640,
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{isEdit ? 'Edit Automation' : 'New Automation'}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Build your automation workflow step by step</p>
          </div>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 8, flexShrink: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => i <= stepIdx ? setStep(s) : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 99,
                  border: 'none', cursor: i <= stepIdx ? 'pointer' : 'default',
                  background: i === stepIdx ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: i === stepIdx ? '#ffffff' : i < stepIdx ? '#4ade80' : 'rgba(255,255,255,0.3)',
                  transition: 'all 140ms',
                }}>
                {i < stepIdx ? <Check style={{ width: 12, height: 12 }} /> : <span>{i + 1}</span>}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {i < STEPS.length - 1 && <ChevronRight style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.2)' }} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Automation name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. DM Pricing Keyword Flow"
              style={darkInput}
            />
          </div>

          {step === 'trigger' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Choose Trigger</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TRIGGER_OPTIONS.map(t => {
                  const selected = trigger === t.value
                  return (
                    <button key={t.value} onClick={() => setTrigger(t.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: 16, borderRadius: 12, textAlign: 'left',
                        background: selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        cursor: 'pointer', transition: 'all 140ms',
                        color: '#ffffff',
                      }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: selected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <t.icon style={{ width: 16, height: 16, color: '#fff' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{t.label}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{t.desc}</p>
                      </div>
                      {selected && <Check style={{ width: 16, height: 16, color: '#4ade80', flexShrink: 0 }} />}
                    </button>
                  )
                })}
              </div>
              {['dm_keyword', 'post_comment', 'reel_comment'].includes(trigger) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                    Keywords <span style={{ color: 'rgba(255,255,255,0.25)' }}>(press Enter to add)</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={kwInput}
                      onChange={e => setKwInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                      placeholder="e.g. price, info, link"
                      style={{ ...darkInput, width: 'auto', flex: 1 }}
                    />
                    <button onClick={addKeyword}
                      style={{
                        padding: '10px 16px', borderRadius: 12, fontSize: 14,
                        background: 'rgba(255,255,255,0.1)', color: '#fff',
                        border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                      }}>Add</button>
                  </div>
                  {keywords.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {keywords.map(kw => (
                        <span key={kw} style={{
                          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: 99, fontFamily: 'monospace',
                        }}>
                          &quot;{kw}&quot;
                          <button onClick={() => setKeywords(p => p.filter(k => k !== kw))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
                            <X style={{ width: 12, height: 12 }} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'conditions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Conditions <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span></p>
                <button onClick={addCondition}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Plus style={{ width: 14, height: 14 }} /> Add condition
                </button>
              </div>
              {conditions.length === 0 && (
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>No conditions — triggers for everyone.</p>
                </div>
              )}
              {conditions.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 12 }}>
                  <select value={c.field} onChange={e => updateCondition(c.id, 'field', e.target.value)} style={darkSelect}>
                    {FIELD_OPTIONS.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                  </select>
                  <select value={c.operator} onChange={e => updateCondition(c.id, 'operator', e.target.value)} style={darkSelect}>
                    {OPERATOR_OPTIONS.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                  </select>
                  <input value={c.value} onChange={e => updateCondition(c.id, 'value', e.target.value)} placeholder="value"
                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, borderRadius: 8, padding: '6px 12px', outline: 'none' }} />
                  <button onClick={() => setConditions(p => p.filter(x => x.id !== c.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {step === 'actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Actions <span style={{ textTransform: 'none', fontWeight: 400 }}>(executed in order)</span></p>
              {actions.map((a, idx) => {
                const opt = ACTION_OPTIONS.find(o => o.value === a.type)!
                return (
                  <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', color: '#fff',
                        fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}>{idx + 1}</span>
                      <select value={a.type} onChange={e => updateAction(a.id, 'type', e.target.value as ActionType)}
                        style={{ ...darkSelect, flex: 1, fontSize: 14, padding: '8px 12px' }}>
                        {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {actions.length > 1 && (
                        <button onClick={() => removeAction(a.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                          <X style={{ width: 16, height: 16 }} />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Delay:</span>
                      <input type="number" min={0} max={10080} value={a.delay}
                        onChange={e => updateAction(a.id, 'delay', Number(e.target.value))}
                        style={{ width: 80, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, borderRadius: 8, padding: '6px 8px', outline: 'none', textAlign: 'center' }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>minutes after trigger</span>
                    </div>
                    {opt.hasMessage && (
                      <div>
                        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, display: 'block' }}>
                          Message <span style={{ color: 'rgba(255,255,255,0.25)' }}>— use {'{{name}}'} for personalization</span>
                        </label>
                        <textarea value={a.message} onChange={e => updateAction(a.id, 'message', e.target.value)} rows={3}
                          placeholder="Type your message..."
                          style={darkTextarea} />
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{a.message.length}/1000 chars</p>
                      </div>
                    )}
                    {opt.hasTag && (
                      <div>
                        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, display: 'block' }}>Tag name</label>
                        <input value={a.tag ?? ''} onChange={e => updateAction(a.id, 'tag', e.target.value)}
                          placeholder="e.g. Hot Lead" style={darkInput} />
                      </div>
                    )}
                  </div>
                )
              })}
              <button onClick={addAction}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: 12, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 12,
                  fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'none', cursor: 'pointer', transition: 'all 140ms',
                }}
                onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}>
                <Plus style={{ width: 14, height: 14 }} /> Add another action
              </button>
            </div>
          )}

          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Review & Save</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Name', content: <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{name || '(untitled)'}</p> },
                  { label: 'Trigger', content: <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{TRIGGER_OPTIONS.find(t => t.value === trigger)?.label}</p> },
                  { label: 'Conditions', content: conditions.length === 0
                    ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>None</p>
                    : conditions.map(c => <p key={c.id} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{c.field} {c.operator} &quot;{c.value}&quot;</p>) },
                  { label: `Actions (${actions.length})`, content: actions.map((a, i) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginTop: 2 }}>{i+1}.</span>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{ACTION_OPTIONS.find(o => o.value === a.type)?.label}</p>
                        {a.message && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{a.message.slice(0, 80)}{a.message.length > 80 ? '…' : ''}</p>}
                      </div>
                    </div>
                  )) },
                ].map(row => (
                  <div key={row.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{row.label}</p>
                    {row.content}
                  </div>
                ))}
              </div>
              {!name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12 }}>
                  <AlertCircle style={{ width: 16, height: 16, color: '#fbbf24', flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#fbbf24' }}>Add a name so you can find this automation later.</p>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12 }}>
                <Wifi style={{ width: 16, height: 16, color: '#60a5fa', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#60a5fa' }}>This automation will be saved to your account and persist across sessions.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <button onClick={() => stepIdx > 0 ? setStep(STEPS[stepIdx - 1]) : onClose()}
            style={{ padding: '8px 16px', fontSize: 14, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {stepIdx === 0 ? 'Cancel' : '← Back'}
          </button>
          {step === 'review' ? (
            <button onClick={handleSave} disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', background: saving ? 'rgba(255,255,255,0.4)' : '#fff',
                color: '#000', fontSize: 14, fontWeight: 700, borderRadius: 12,
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'opacity 140ms',
              }}>
              {saving ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Check style={{ width: 16, height: 16 }} />}
              {saving ? 'Saving...' : 'Save automation'}
            </button>
          ) : (
            <button onClick={() => canNext && setStep(STEPS[stepIdx + 1])} disabled={!canNext}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', fontSize: 14, fontWeight: 700, borderRadius: 12,
                border: 'none', cursor: canNext ? 'pointer' : 'not-allowed', transition: 'opacity 140ms',
                background: canNext ? '#fff' : 'rgba(255,255,255,0.1)',
                color: canNext ? '#000' : 'rgba(255,255,255,0.3)',
              }}>
              Next <ChevronRight style={{ width: 16, height: 16 }} />
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
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
          color: '#4ade80', fontSize: 12, fontWeight: 500,
          padding: '10px 16px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}>
          <Check style={{ width: 14, height: 14 }} /> {toastMsg}
        </div>
      )}

      {/* Webhook banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 16 }}>
        <Wifi style={{ width: 16, height: 16, color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa' }}>Webhook URL for Meta App Dashboard</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontFamily: 'monospace', wordBreak: 'break-all' }}>https://igrowth-platform.vercel.app/api/instagram/webhook</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Verify Token: <span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>igrowth_verify_2026</span> · Subscribe to: <span style={{ fontFamily: 'monospace' }}>messages, comments, reel_comments</span></p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Flows',     value: loading ? '—' : active,              bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
          { label: 'Total Runs',       value: loading ? '—' : totalRuns,           bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#fff' },
          { label: 'Avg Success Rate', value: loading ? '—' : `${Math.round(avgRate)}%`, bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.15)',  text: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.text, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>All Automations</h2>
        <button onClick={() => { setEditTarget(null); setShowBuilder(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#fff', color: '#000', fontSize: 12, fontWeight: 700,
            padding: '8px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
          }}>
          <Plus style={{ width: 14, height: 14 }} /> New automation
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 12 }}>
          <Loader2 style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.4)', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Loading automations...</p>
        </div>
      )}

      {/* List */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(a => {
            const TIcon = triggerIcon[a.trigger] ?? Zap
            const ss = statusStyle[a.status]
            return (
              <div key={a.id}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TIcon style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.name}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{a.trigger_label} → {a.actions?.length ?? 0} action{(a.actions?.length ?? 0) !== 1 ? 's' : ''}</p>
                        {(a.keywords?.length ?? 0) > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {a.keywords.slice(0, 4).map(k => (
                              <span key={k} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>&quot;{k}&quot;</span>
                            ))}
                            {a.keywords.length > 4 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>+{a.keywords.length - 4} more</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}`, fontSize: 11, padding: '2px 8px', borderRadius: 99 }}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                        <button onClick={() => toggleStatus(a.id, a.status)} aria-label="Toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                          {a.status === 'active'
                            ? <ToggleRight style={{ width: 20, height: 20, color: '#4ade80' }} />
                            : <ToggleLeft  style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.25)' }} />}
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{a.runs} runs</span>
                      {(a.runs ?? 0) > 0 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{a.success_rate}% success</span>}
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Last: {a.last_run ? new Date(a.last_run).toLocaleDateString() : 'Never'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                        <button onClick={() => { setEditTarget(a); setShowBuilder(true) }}
                          style={{ padding: 6, borderRadius: 8, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label="Edit">
                          <Edit2 style={{ width: 14, height: 14 }} />
                        </button>
                        <button onClick={() => setDeleteId(a.id)}
                          style={{ padding: 6, borderRadius: 8, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label="Delete">
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                        {a.status === 'draft' && (
                          <button onClick={() => toggleStatus(a.id, 'draft')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', borderRadius: 8, background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', cursor: 'pointer' }}>
                            <Play style={{ width: 12, height: 12 }} /> Activate
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
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Zap style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>No automations yet</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Create your first automation to start capturing leads on autopilot.</p>
              <button onClick={() => setShowBuilder(true)}
                style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', margin: '16px auto 0' }}>
                <Plus style={{ width: 14, height: 14 }} /> Create first automation
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Delete automation?</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>This cannot be undone. All run history will be lost.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 14, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId!)}
                style={{ flex: 1, padding: 10, borderRadius: 12, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', fontSize: 14, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
