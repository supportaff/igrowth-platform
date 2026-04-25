'use client'
import { useState } from 'react'
import { User, Bell, Shield, Instagram, CreditCard, Save } from 'lucide-react'

const TABS = [
  { id: 'profile',      label: 'Profile',       icon: User },
  { id: 'instagram',    label: 'Instagram',     icon: Instagram },
  { id: 'notifications',label: 'Notifications', icon: Bell },
  { id: 'billing',      label: 'Billing',       icon: CreditCard },
  { id: 'security',     label: 'Security',      icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: 'Demo User', email: 'demo@igrowth.app', brand: '', bio: '', notifLeads: true, notifDMs: true, notifWeekly: false })

  function update(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/4 border border-white/8 rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Profile Settings</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-violet-500/20">
              {form.name[0]}
            </div>
            <div>
              <button className="text-xs bg-white/8 border border-white/12 text-white/70 hover:text-white hover:bg-white/12 px-3 py-2 rounded-xl transition-colors">Change avatar</button>
              <p className="text-xs text-white/30 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>

          {[{ label: 'Full name', key: 'name', type: 'text', placeholder: 'Your name' },
            { label: 'Email address', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Brand / Business name', key: 'brand', type: 'text', placeholder: 'e.g. Priya Styles Co.' }].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-white/50 mb-1.5">{field.label}</label>
              <input type={field.type} value={(form as Record<string, string>)[field.key]}
                onChange={e => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
              placeholder="Tell your audience a bit about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none" />
          </div>

          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 shadow-md shadow-violet-500/20'
            }`}>
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      )}

      {/* Instagram tab */}
      {activeTab === 'instagram' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Instagram Connection</h2>
          <div className="p-5 bg-amber-500/8 border border-amber-500/20 rounded-xl">
            <p className="text-sm font-semibold text-amber-300 mb-1">Not connected</p>
            <p className="text-xs text-white/40">Connect your Instagram Business account to enable DM automations, lead capture, and analytics.</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
            <Instagram className="w-4 h-4" /> Connect Instagram Business
          </button>
          <p className="text-xs text-white/30">Requires Instagram Business or Creator account connected to a Facebook Page.</p>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Notification Preferences</h2>
          {[
            { key: 'notifLeads',  label: 'New lead alerts',        desc: 'Get notified when a new lead is captured' },
            { key: 'notifDMs',    label: 'DM conversation alerts',  desc: 'Get notified on new incoming DMs' },
            { key: 'notifWeekly', label: 'Weekly summary email',    desc: 'Receive a weekly performance digest' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-white/8 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/35 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => update(key, !(form as Record<string, boolean>)[key])}
                className={`relative w-10 h-6 rounded-full transition-all flex-shrink-0 ${
                  (form as Record<string, boolean>)[key] ? 'bg-violet-500' : 'bg-white/15'
                }`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  (form as Record<string, boolean>)[key] ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90'
            }`}>
            <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save preferences'}
          </button>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'billing' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Billing & Plan</h2>
          <div className="p-5 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-violet-300">Starter Plan</p>
              <p className="text-xs text-white/40 mt-0.5">Free · 500 DMs / month</p>
            </div>
            <button className="flex-shrink-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all">Upgrade to Pro</button>
          </div>
          <div className="space-y-3">
            {[
              { plan: 'Pro',    price: '₹999/mo',   feat: 'Unlimited DMs, advanced analytics' },
              { plan: 'Agency', price: '₹2,499/mo', feat: 'Multi-account, white-label' },
            ].map(p => (
              <div key={p.plan} className="flex items-center justify-between p-4 bg-white/4 border border-white/8 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">{p.plan}</p>
                  <p className="text-xs text-white/35">{p.feat}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-400">{p.price}</p>
                  <button className="text-xs text-violet-400 hover:underline mt-1">Upgrade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Security</h2>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Current password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">New password</label>
            <input type="password" placeholder="Min. 6 characters" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90'
            }`}>
            <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Update password'}
          </button>
        </div>
      )}
    </div>
  )
}
