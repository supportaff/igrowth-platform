'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { User, Bell, Shield, Instagram, Save, Check, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'instagram',     label: 'Instagram',     icon: Instagram },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',      icon: Shield },
]

interface NotifPrefs { notifLeads: boolean; notifDMs: boolean; notifWeekly: boolean }
interface IGState { connected: boolean; handle: string; followers: number; lastSync: string }

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const { user } = useUser()

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'profile')
  const [saved, setSaved] = useState(false)
  const [brand, setBrand] = useState('')
  const [bio, setBio] = useState('')
  const [notif, setNotif] = useState<NotifPrefs>({ notifLeads: true, notifDMs: true, notifWeekly: false })
  const [ig, setIg] = useState<IGState>({ connected: false, handle: '', followers: 0, lastSync: '' })
  const [igLoading, setIgLoading] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
    // Check if returning from Instagram OAuth
    const connected = searchParams.get('connected')
    const handle    = searchParams.get('handle')
    const followers = searchParams.get('followers')
    if (connected === 'true' && handle) {
      setIg({ connected: true, handle, followers: Number(followers) || 0, lastSync: 'Just now' })
      setActiveTab('instagram')
    }
    // Handle errors
    const error = searchParams.get('error')
    if (error) {
      console.warn('Instagram OAuth error:', error)
    }
  }, [searchParams])

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggleNotif(key: keyof NotifPrefs) {
    setNotif(p => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  function handleIGConnect() {
    setIgLoading(true)
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
    if (!appId || appId === 'YOUR_APP_ID') {
      alert('Instagram App ID is not configured. Please contact support.')
      setIgLoading(false)
      return
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/instagram/callback`)
    // ✅ Correct Meta Graph API scopes (v21+)
    const scope = 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,pages_show_list,pages_read_engagement'
    const state = encodeURIComponent(user?.id ?? 'unknown')
    window.location.href = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`
  }

  function handleIGDisconnect() {
    setIg({ connected: false, handle: '', followers: 0, lastSync: '' })
  }

  const saveBtnClass = saved
    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
    : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 shadow-md shadow-violet-500/20'

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
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="avatar" className="w-16 h-16 rounded-2xl ring-2 ring-violet-500/30" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold">
                {(user?.firstName?.[0] ?? 'U').toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{user?.fullName ?? 'User'}</p>
              <p className="text-xs text-white/40">{user?.emailAddresses?.[0]?.emailAddress}</p>
              <p className="text-xs text-violet-400 mt-1">Managed by Google / Clerk</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Brand / Business name</label>
            <input value={brand} onChange={e => { setBrand(e.target.value); setSaved(false) }}
              placeholder="e.g. Priya Styles Co."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => { setBio(e.target.value); setSaved(false) }} rows={3}
              placeholder="Tell your audience about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saveBtnClass}`}>
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      )}

      {/* Instagram tab */}
      {activeTab === 'instagram' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Instagram Connection</h2>

          {!ig.connected ? (
            <>
              <div className="p-5 bg-amber-500/8 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-300">Not connected</p>
                  <p className="text-xs text-white/40 mt-0.5">Connect your Instagram Business account to enable DM automations, lead capture, and analytics.</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Requirements</p>
                {[
                  'Instagram Business or Creator account',
                  'Connected to a Facebook Page',
                  'Messaging permissions enabled on your Page',
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white/40">{i + 1}</span>
                    </div>
                    <p className="text-sm text-white/60">{req}</p>
                  </div>
                ))}
              </div>

              <button onClick={handleIGConnect} disabled={igLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20 disabled:opacity-60">
                <Instagram className="w-4 h-4" />
                {igLoading ? 'Redirecting to Instagram...' : 'Connect Instagram Business Account'}
                {!igLoading && <ExternalLink className="w-3.5 h-3.5 ml-1" />}
              </button>
              <p className="text-xs text-white/30 text-center">You will be redirected to Facebook to authorize iGrowth. Uses official Meta Graph API v21.</p>
            </>
          ) : (
            <>
              <div className="p-5 bg-green-500/8 border border-green-500/20 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-300">Connected ✓</p>
                  <p className="text-xs text-white/40 mt-0.5">@{ig.handle} · {ig.followers.toLocaleString()} followers · Last sync: {ig.lastSync}</p>
                </div>
              </div>
              <button onClick={handleIGDisconnect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
                Disconnect Instagram
              </button>
            </>
          )}
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Notification Preferences</h2>
          {([
            { key: 'notifLeads'  as keyof NotifPrefs, label: 'New lead alerts',       desc: 'Get notified when a new lead is captured' },
            { key: 'notifDMs'    as keyof NotifPrefs, label: 'DM conversation alerts', desc: 'Get notified on new incoming DMs' },
            { key: 'notifWeekly' as keyof NotifPrefs, label: 'Weekly summary email',   desc: 'Receive a weekly performance digest' },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-white/8 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/35 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => toggleNotif(key)}
                className={`relative w-10 h-6 rounded-full transition-all flex-shrink-0 ${
                  notif[key] ? 'bg-violet-500' : 'bg-white/15'
                }`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  notif[key] ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saveBtnClass}`}>
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save preferences'}
          </button>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white">Security</h2>
          <div className="p-5 bg-violet-500/8 border border-violet-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-violet-300">Secured by Clerk</p>
              <p className="text-xs text-white/40 mt-0.5">Your account is protected by Clerk authentication. Password management, 2FA, and session control are handled via your Google account.</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Active sessions</p>
            <div className="bg-white/3 border border-white/8 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Current session</p>
                <p className="text-xs text-white/35 mt-0.5">Browser · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className="text-xs bg-green-500/15 text-green-300 border border-green-500/25 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
