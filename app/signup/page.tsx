'use client'
import { SignUp } from '@clerk/nextjs'
import { Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">iGrowth</h1>
            <p className="text-sm text-white/40 mt-1">Create your free account</p>
          </div>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#0f0e1c] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6',
              headerTitle: 'text-white text-lg font-semibold',
              headerSubtitle: 'text-white/40 text-sm',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors rounded-xl',
              socialButtonsBlockButtonText: 'text-white text-sm font-medium',
              dividerLine: 'bg-white/10',
              dividerText: 'text-white/30 text-xs',
              formFieldLabel: 'text-white/50 text-xs font-medium',
              formFieldInput: 'bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all',
              formButtonPrimary: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-all shadow-md shadow-violet-500/20',
              footerActionLink: 'text-violet-400 hover:text-violet-300',
              alertText: 'text-red-400 text-xs',
            },
          }}
          redirectUrl="/dashboard"
          signInUrl="/login"
        />
      </div>
    </div>
  )
}
