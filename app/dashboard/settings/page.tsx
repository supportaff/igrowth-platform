'use client'
import { useState } from 'react'
import { Save, User, Bell, Shield, Instagram } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('demo@igrowth.app')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-xs text-white/40 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Profile</h3>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Display Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50"
          />
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Instagram */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Instagram className="w-4 h-4 text-accent-400" />
          <h3 className="text-sm font-bold text-white">Instagram Connection</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <div>
            <div className="text-sm font-medium text-white">No account connected</div>
            <div className="text-xs text-white/40 mt-0.5">Connect your Instagram Business account to enable automations</div>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex-shrink-0">
            Connect
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-white">Notifications</h3>
        </div>
        {[
          { label: 'New lead captured',       desc: 'Get notified when a new lead is added to your CRM' },
          { label: 'Automation run failed',    desc: 'Alert when a flow encounters an error' },
          { label: 'Weekly performance digest', desc: 'Summary email every Monday morning' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">{item.label}</div>
              <div className="text-xs text-white/40">{item.desc}</div>
            </div>
            <button className="w-10 h-6 rounded-full bg-brand-500/30 border border-brand-500/50 relative transition-colors">
              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-brand-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-white">Danger Zone</h3>
        </div>
        <button className="text-xs text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}
