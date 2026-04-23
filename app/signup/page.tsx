'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

const perks = [
  'Free plan — no credit card needed',
  'DM automation live in under 5 minutes',
  'Follower CRM built in from day one',
  'Content-to-revenue analytics included',
]

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    // TODO: connect to auth provider (Clerk / Supabase Auth)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">You're on the list! 🎉</h1>
          <p className="text-white/50 mb-8">Thanks for signing up for iGrowth. We'll notify you as soon as your account is ready.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">iGrowth</span>
          </Link>
          <p className="text-sm text-white/50">Already have an account? <Link href="/login" className="text-brand-400 hover:underline">Log in</Link></p>
        </div>
      </nav>

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — value props */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Free forever plan available
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Start turning followers
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">into revenue</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">Join creators and businesses using iGrowth to automate DMs, capture leads, and track what actually makes money on Instagram.</p>
            <ul className="space-y-3">
              {perks.map(p => (
                <li key={p} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-brand-400" />
                  </div>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <h1 className="text-2xl font-extrabold mb-1">Create your account</h1>
              <p className="text-white/50 text-sm">Free forever. No credit card required.</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">Full name</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">Email address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= i * 2
                            ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-yellow-500' : i <= 3 ? 'bg-brand-400' : 'bg-green-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <>
                      Create free account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Instagram OAuth placeholder */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 border border-white/15 text-white/70 hover:bg-white/5 hover:text-white font-medium py-3 rounded-xl text-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Continue with Instagram
              </button>
            </div>

            <p className="text-center text-xs text-white/30 mt-6">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-white/50 hover:text-white/70 underline">Terms</Link>{' '}and{' '}
              <Link href="/privacy" className="text-white/50 hover:text-white/70 underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
