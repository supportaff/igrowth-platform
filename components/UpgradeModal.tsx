'use client'
import { useState } from 'react'
import { X, Check, Crown, Zap, Users, RefreshCw, Star, Shield } from 'lucide-react'

interface Props { open: boolean; onClose: () => void }

const proFeatures = [
  { icon: Zap,       label: 'Unlimited DMs' },
  { icon: Users,     label: 'Unlimited Contacts' },
  { icon: RefreshCw, label: 'Re-trigger automations' },
  { icon: Star,      label: 'Ask-for-Follow flows' },
  { icon: Shield,    label: 'Remove Afforal branding' },
  { icon: Crown,     label: 'Priority support' },
]

export default function UpgradeModal({ open, onClose }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  if (!open) return null

  const monthly = 349
  const annual  = 299
  const price   = billing === 'annual' ? annual : monthly
  const saving  = billing === 'annual' ? Math.round((monthly - annual) * 12) : 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: '20px', maxWidth: '580px', width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        animation: 'fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both',
      }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}
          className="flex items-start justify-between px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div style={{ background: 'white', borderRadius: '12px' }}
              className="w-10 h-10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white font-bold text-[16px] leading-tight">Upgrade to Pro</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Unlock unlimited growth with Afforal IG Growth</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ color: 'var(--text-muted)', background: 'var(--surface-3)', borderRadius: '8px' }}
            className="p-1.5 hover:text-white transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col sm:flex-row gap-6">

          {/* Left — features */}
          <div className="flex-1 space-y-2.5">
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.07em' }}
              className="uppercase font-semibold mb-3">What you get</p>
            {proFeatures.map(f => (
              <div key={f.label} className="flex items-center gap-2.5">
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px' }}
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span style={{ fontSize: '13px' }} className="text-white">{f.label}</span>
                <Check className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--green)' }} />
              </div>
            ))}
          </div>

          {/* Right — billing toggle + CTA */}
          <div className="sm:w-52 space-y-3">
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.07em' }}
              className="uppercase font-semibold">Billing</p>

            {/* Monthly */}
            <button onClick={() => setBilling('monthly')}
              style={{
                background: billing === 'monthly' ? 'var(--surface-3)' : 'var(--surface-2)',
                border: `1.5px solid ${billing === 'monthly' ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
                borderRadius: '12px', width: '100%', textAlign: 'left',
              }}
              className="p-3 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '13px' }} className="font-semibold text-white">Monthly</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Billed monthly</p>
                </div>
                <p className="text-white font-bold text-[16px]">₹{monthly}
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 400 }}>/mo</span>
                </p>
              </div>
            </button>

            {/* Annual */}
            <button onClick={() => setBilling('annual')}
              style={{
                background: billing === 'annual' ? 'rgba(34,197,94,0.08)' : 'var(--surface-2)',
                border: `1.5px solid ${billing === 'annual' ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                borderRadius: '12px', width: '100%', textAlign: 'left', position: 'relative',
              }}
              className="p-3 transition-all">
              {billing === 'annual' && (
                <div style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--green)', color: 'black', fontSize: '10px', fontWeight: 700,
                  padding: '2px 10px', borderRadius: '99px', whiteSpace: 'nowrap',
                }}>SAVE ₹{saving}/yr</div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '13px' }} className="font-semibold text-white">Annual</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Billed yearly</p>
                </div>
                <p className="text-white font-bold text-[16px]">₹{annual}
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 400 }}>/mo</span>
                </p>
              </div>
            </button>

            {/* CTA */}
            <button
              style={{ background: 'white', color: 'black', borderRadius: '12px', fontSize: '14px' }}
              className="w-full py-3 font-bold hover:bg-white/90 active:scale-95 transition-all">
              Upgrade Now · ₹{price}/mo
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center' }}>
              Cancel anytime · Price lock guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
