'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, ArrowRight, Instagram } from 'lucide-react'

const DEMO_EMAIL = 'demo@igrowth.app'
const DEMO_PASSWORD = 'demo1234'

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      router.push('/dashboard')
    } else {
      setLoading(false)
      setError('Invalid credentials. Use demo@igrowth.app / demo1234')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col">
      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full z-50 bg-[#0a0a14]/80 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">iGrowth</span>
          </Link>
          <p className="text-sm text-white/40">No account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 hover:underline font-medium transition-colors">Sign up free</Link>
          </p>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 shadow-lg shadow-violet-500/25">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back</h1>
            <p className="text-white/40 text-sm">Log in to your iGrowth account</p>
          </div>

          {/* Demo hint */}
          <div className="mb-5 p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-300 text-center">
            <span className="font-semibold">Demo credentials:</span>{' '}
            <span className="font-mono">demo@igrowth.app</span> &nbsp;/&nbsp; <span className="font-mono">demo1234</span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-black/20">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">Email address</label>
                <input
                  id="email" type="email" autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="demo@igrowth.app"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-white/60">Password</label>
                  <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors p-1">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400 flex items-start gap-2">
                  <span className="mt-0.5">⚠</span> {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20">
                {loading
                  ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  : <><span>Log in</span><ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Instagram OAuth placeholder */}
            <button type="button"
              className="w-full flex items-center justify-center gap-2.5 border border-white/12 text-white/65 hover:bg-white/5 hover:text-white hover:border-white/20 font-medium py-3 rounded-xl text-sm transition-all">
              <Instagram className="w-4 h-4" />
              Continue with Instagram
            </button>
          </div>

          <p className="text-center text-xs text-white/25 mt-6">
            By logging in you agree to our{' '}
            <Link href="/terms" className="text-white/40 hover:text-white/60 underline">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="text-white/40 hover:text-white/60 underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}
