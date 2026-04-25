'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle2, Instagram } from 'lucide-react'

const PLANS = [
  { id: 'starter', label: 'Starter', price: 'Free', desc: '500 DMs / month' },
  { id: 'pro',     label: 'Pro',     price: '₹999/mo', desc: 'Unlimited DMs' },
  { id: 'agency', label: 'Agency',  price: '₹2,499/mo', desc: 'Multi-account' },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('starter')
  const [form, setForm] = useState({ name: '', email: '', password: '', brand: '' })

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    setError('')
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setStep(2)
    setError('')
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col">
      {/* Glows */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full z-50 bg-[#0a0a14]/80 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">iGrowth</span>
          </Link>
          <p className="text-sm text-white/40">Have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 hover:underline font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 shadow-lg shadow-fuchsia-500/25">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
              {step === 1 ? 'Create your account' : 'Choose your plan'}
            </h1>
            <p className="text-white/40 text-sm">
              {step === 1 ? 'Start automating Instagram DMs in minutes' : 'You can upgrade or downgrade anytime'}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < step ? 'bg-violet-500 text-white'
                  : s === step ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/10 text-white/30'
                }`}>
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`w-10 h-px transition-all ${s < step ? 'bg-violet-500' : 'bg-white/15'}`} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-black/20">

            {/* ── Step 1: Account Info ── */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Full name</label>
                  <input type="text" autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Email address</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={e => update('password', e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Hide' : 'Show'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors p-1">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">⚠ {error}</div>}
                <button type="submit"
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-violet-500/20">
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <button type="button" className="w-full flex items-center justify-center gap-2.5 border border-white/12 text-white/65 hover:bg-white/5 hover:text-white hover:border-white/20 font-medium py-3 rounded-xl text-sm transition-all">
                  <Instagram className="w-4 h-4" /> Sign up with Instagram
                </button>
              </form>
            )}

            {/* ── Step 2: Plan Selection ── */}
            {step === 2 && (
              <form onSubmit={handleStep2} className="space-y-5">
                <div className="space-y-3">
                  {PLANS.map(plan => (
                    <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        selectedPlan === plan.id
                          ? 'bg-violet-500/12 border-violet-500/40 shadow-sm shadow-violet-500/10'
                          : 'bg-white/4 border-white/10 hover:bg-white/6 hover:border-white/20'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedPlan === plan.id ? 'border-violet-400' : 'border-white/25'
                        }`}>
                          {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-violet-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{plan.label}</div>
                          <div className="text-xs text-white/40">{plan.desc}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${
                        selectedPlan === plan.id ? 'text-violet-400' : 'text-white/50'
                      }`}>{plan.price}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Brand / Business name <span className="text-white/30">(optional)</span></label>
                  <input type="text" value={form.brand} onChange={e => update('brand', e.target.value)}
                    placeholder="e.g. Priya Styles Co."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl border border-white/12 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white transition-all">
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20">
                    {loading
                      ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      : <><span>Get started</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-white/25 mt-6">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-white/40 hover:text-white/60 underline">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="text-white/40 hover:text-white/60 underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}
