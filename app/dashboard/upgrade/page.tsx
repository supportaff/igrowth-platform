'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Pricing from '@/components/Pricing'

export default function UpgradePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [user, setUser] = useState<{
    id: string; email: string; name: string; phone: string; plan: string
  } | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) return

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_id')
        .eq('user_id', u.id)
        .eq('status', 'active')
        .maybeSingle()

      setUser({
        id: u.id,
        email: u.email ?? '',
        name: u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'User',
        phone: u.user_metadata?.phone ?? '',
        plan: sub?.plan_id ?? 'free',
      })
    }
    load()
  }, [])

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Upgrade Plan</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Choose a plan that fits your needs. Payment is handled securely via PayU.
        </p>
      </div>

      {user ? (
        <Pricing
          dashboardMode
          currentPlan={user.plan}
          userId={user.id}
          userEmail={user.email}
          userName={user.name}
          userPhone={user.phone}
        />
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading plans…</div>
      )}
    </div>
  )
}
