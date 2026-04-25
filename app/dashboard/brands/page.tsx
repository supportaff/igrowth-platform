'use client'
import { useState } from 'react'
import {
  Briefcase, Plus, Search, ExternalLink, Instagram,
  Mail, Phone, Tag, ChevronDown, X, Check, Edit2,
  Clock, DollarSign, FileText, Star
} from 'lucide-react'

type Status = 'prospect' | 'contacted' | 'negotiating' | 'active' | 'completed' | 'paused'

interface Brand {
  id: string
  name: string
  handle: string
  category: string
  status: Status
  dealValue: string
  deliverables: string
  notes: string
  contactName: string
  email: string
  dueDate: string
  starred: boolean
  createdAt: string
}

const STATUS_META: Record<Status, { label: string; color: string; bg: string }> = {
  prospect:    { label: 'Prospect',    color: 'var(--text-muted)',  bg: 'var(--surface-3)' },
  contacted:   { label: 'Contacted',   color: 'var(--blue)',        bg: 'rgba(59,130,246,0.12)' },
  negotiating: { label: 'Negotiating', color: 'var(--amber)',       bg: 'rgba(245,158,11,0.12)' },
  active:      { label: 'Active',      color: 'var(--green)',       bg: 'rgba(34,197,94,0.10)' },
  completed:   { label: 'Completed',   color: 'var(--text-muted)',  bg: 'var(--surface-3)' },
  paused:      { label: 'Paused',      color: 'var(--red)',         bg: 'rgba(239,68,68,0.10)' },
}

const EMPTY: Brand = {
  id: '', name: '', handle: '', category: '', status: 'prospect',
  dealValue: '', deliverables: '', notes: '', contactName: '',
  email: '', dueDate: '', starred: false, createdAt: '',
}

const DEMO_BRANDS: Brand[] = [
  {
    id: '1', name: 'Nykaa Fashion', handle: '@nykaa_fashion', category: 'Beauty & Fashion',
    status: 'active', dealValue: '₹15,000', deliverables: '2 Reels + 3 Stories',
    notes: 'Send content calendar by Friday. They prefer morning posts.', contactName: 'Priya Shah',
    email: 'priya@nykaa.com', dueDate: '2026-05-10', starred: true, createdAt: '2026-04-20',
  },
  {
    id: '2', name: 'Mamaearth', handle: '@mamaearth', category: 'Skincare',
    status: 'negotiating', dealValue: '₹8,000', deliverables: '1 Reel + product review',
    notes: 'Counter-offer sent. Waiting for reply.', contactName: 'Anil Kumar',
    email: 'collabs@mamaearth.in', dueDate: '2026-05-20', starred: false, createdAt: '2026-04-22',
  },
  {
    id: '3', name: 'boAt Lifestyle', handle: '@boat.nirvana', category: 'Tech / Audio',
    status: 'prospect', dealValue: '', deliverables: '',
    notes: 'Their campaigns open in June. Follow up end of May.', contactName: '',
    email: '', dueDate: '', starred: false, createdAt: '2026-04-25',
  },
]

export default function BrandsPage() {
  const [brands, setBrands]       = useState<Brand[]>(DEMO_BRANDS)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState<Status | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailId, setDetailId]   = useState<string | null>(null)
  const [form, setForm]           = useState<Brand>(EMPTY)
  const [isEdit, setIsEdit]       = useState(false)

  const filtered = brands
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.handle.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0))

  const detailBrand = brands.find(b => b.id === detailId)

  function openNew() {
    setForm({ ...EMPTY, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] })
    setIsEdit(false)
    setModalOpen(true)
  }

  function openEdit(b: Brand) {
    setForm(b); setIsEdit(true); setModalOpen(true)
  }

  function save() {
    if (!form.name.trim()) return
    if (isEdit) setBrands(prev => prev.map(b => b.id === form.id ? form : b))
    else setBrands(prev => [...prev, form])
    setModalOpen(false)
  }

  function remove(id: string) {
    setBrands(prev => prev.filter(b => b.id !== id))
    if (detailId === id) setDetailId(null)
  }

  function toggleStar(id: string) {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, starred: !b.starred } : b))
  }

  function setStatus(id: string, s: Status) {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, status: s } : b))
  }

  const counts = Object.keys(STATUS_META).reduce((acc, k) => {
    acc[k as Status] = brands.filter(b => b.status === k).length
    return acc
  }, {} as Record<Status, number>)

  return (
    <div className="space-y-5 fade-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }} className="text-white">
            Brand Kit
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Track brand collaborations and deals</p>
        </div>
        <button onClick={openNew}
          style={{ background: 'white', color: 'black', borderRadius: '10px', fontSize: '13px' }}
          className="flex items-center gap-2 px-4 py-2 font-semibold hover:bg-white/90 active:scale-95 transition-all">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(Object.keys(STATUS_META) as Status[]).map(s => (
          <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
            style={{
              background: filter === s ? STATUS_META[s].bg : 'var(--surface-1)',
              border: `1px solid ${filter === s ? STATUS_META[s].color + '44' : 'var(--border)'}`,
              borderRadius: '10px', transition: 'all 150ms ease',
            }}
            className="p-3 text-left hover:border-white/20 transition-all">
            <p style={{ color: STATUS_META[s].color, fontSize: '18px', fontWeight: 700 }}>{counts[s]}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{STATUS_META[s].label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', flex: 1 }}
          className="flex items-center gap-2 px-3 py-2">
          <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search brands…"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }}
          />
        </div>
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '12px' }}
            className="flex items-center gap-1.5 px-3 py-2 hover:text-white transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px' }}
          className="flex flex-col items-center py-16 gap-3">
          <Briefcase style={{ color: 'var(--text-muted)' }} className="w-8 h-8" />
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No brands yet. Add your first collab.</p>
          <button onClick={openNew}
            style={{ background: 'white', color: 'black', fontSize: '12px', borderRadius: '8px' }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold hover:bg-white/90 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Brand
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(b => {
            const sm = STATUS_META[b.status]
            return (
              <div key={b.id}
                onClick={() => setDetailId(detailId === b.id ? null : b.id)}
                style={{
                  background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px',
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
                className="p-4 hover:border-white/20 hover:bg-[#161616] transition-all">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Icon */}
                  <div style={{ background: 'var(--surface-3)', borderRadius: '10px' }}
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  {/* Name + handle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p style={{ fontSize: '14px' }} className="font-semibold text-white truncate">{b.name}</p>
                      {b.starred && <Star className="w-3.5 h-3.5" style={{ color: 'var(--amber)' }} fill="currentColor" />}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{b.handle} · {b.category}</p>
                  </div>
                  {/* Status */}
                  <span style={{ background: sm.bg, color: sm.color, fontSize: '11px', borderRadius: '99px', padding: '3px 10px', fontWeight: 600 }}>
                    {sm.label}
                  </span>
                  {/* Value */}
                  {b.dealValue && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>{b.dealValue}</span>
                  )}
                  {/* Due */}
                  {b.dueDate && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{b.dueDate}
                    </span>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleStar(b.id)}
                      style={{ color: b.starred ? 'var(--amber)' : 'var(--text-muted)' }}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                      <Star className="w-3.5 h-3.5" fill={b.starred ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => openEdit(b)}
                      style={{ color: 'var(--text-muted)' }}
                      className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(b.id)}
                      style={{ color: 'var(--text-muted)' }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {detailId === b.id && (
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px' }}
                    className="grid sm:grid-cols-2 gap-4" onClick={e => e.stopPropagation()}>
                    {/* Notes */}
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em' }}
                        className="uppercase font-semibold mb-2">Notes</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6 }}>
                        {b.notes || '—'}
                      </p>
                    </div>
                    {/* Deliverables */}
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em' }}
                        className="uppercase font-semibold mb-2">Deliverables</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{b.deliverables || '—'}</p>
                    </div>
                    {/* Contact */}
                    {(b.contactName || b.email) && (
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em' }}
                          className="uppercase font-semibold mb-2">Contact</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{b.contactName}</p>
                        {b.email && <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{b.email}</p>}
                      </div>
                    )}
                    {/* Status change */}
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.06em' }}
                        className="uppercase font-semibold mb-2">Move Stage</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(STATUS_META) as Status[]).map(s => (
                          <button key={s} onClick={() => setStatus(b.id, s)}
                            style={{
                              background: b.status === s ? STATUS_META[s].bg : 'var(--surface-3)',
                              color: b.status === s ? STATUS_META[s].color : 'var(--text-muted)',
                              border: `1px solid ${b.status === s ? STATUS_META[s].color + '44' : 'var(--border)'}`,
                              fontSize: '10px', borderRadius: '6px', padding: '3px 8px', fontWeight: 600,
                            }}
                            className="transition-all hover:border-white/20">
                            {STATUS_META[s].label}
                            {b.status === s && <Check className="w-2.5 h-2.5 inline ml-1" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: '20px', maxWidth: '480px', width: '100%',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            animation: 'fadeUp 0.2s cubic-bezier(0.16,1,0.3,1) both',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ borderBottom: '1px solid var(--border)' }}
              className="flex items-center justify-between px-5 py-4">
              <p className="font-bold text-white text-[15px]">{isEdit ? 'Edit Brand' : 'Add Brand'}</p>
              <button onClick={() => setModalOpen(false)}
                style={{ color: 'var(--text-muted)', background: 'var(--surface-3)', borderRadius: '8px' }}
                className="p-1.5 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {([
                { key: 'name',         label: 'Brand Name *',     placeholder: 'e.g. Nykaa Fashion' },
                { key: 'handle',       label: 'Instagram Handle',  placeholder: '@brandname' },
                { key: 'category',     label: 'Category',          placeholder: 'Beauty, Tech, Food…' },
                { key: 'contactName',  label: 'Contact Person',    placeholder: 'Full name' },
                { key: 'email',        label: 'Email',             placeholder: 'collabs@brand.com' },
                { key: 'dealValue',    label: 'Deal Value',        placeholder: '₹10,000' },
                { key: 'deliverables', label: 'Deliverables',      placeholder: '2 Reels + 3 Stories' },
                { key: 'dueDate',      label: 'Due Date',          placeholder: 'YYYY-MM-DD', type: 'date' },
              ] as { key: keyof Brand; label: string; placeholder: string; type?: string }[]).map(f => (
                <div key={f.key}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={form[f.key] as string}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px',
                      color: 'var(--text-primary)', fontSize: '13px', padding: '8px 12px', width: '100%', outline: 'none',
                    }}
                  />
                </div>
              ))}
              {/* Status select */}
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}
                  style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'var(--text-primary)', fontSize: '13px', padding: '8px 12px', width: '100%', outline: 'none',
                  }}>
                  {(Object.keys(STATUS_META) as Status[]).map(s => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
              </div>
              {/* Notes */}
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any important notes about this brand…"
                  style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'var(--text-primary)', fontSize: '13px', padding: '8px 12px', width: '100%', outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <button onClick={save}
                style={{ background: 'white', color: 'black', borderRadius: '10px', fontSize: '13px' }}
                className="w-full py-2.5 font-bold hover:bg-white/90 active:scale-95 transition-all mt-1">
                {isEdit ? 'Save Changes' : 'Add Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
