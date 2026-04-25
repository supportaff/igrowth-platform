// Single source of truth for plan definitions and limits

export type PlanId = 'free' | 'pro'

export interface PlanLimits {
  dmsPerMonth: number       // -1 = unlimited
  contacts: number          // -1 = unlimited
  automations: number       // -1 = unlimited
  brandDeals: number        // -1 = unlimited
  plannerItems: number      // -1 = unlimited
  insightsDays: number
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    dmsPerMonth:  1000,
    contacts:     500,
    automations:  5,
    brandDeals:   5,
    plannerItems: 20,
    insightsDays: 7,
  },
  pro: {
    dmsPerMonth:  -1,
    contacts:     -1,
    automations:  -1,
    brandDeals:   -1,
    plannerItems: -1,
    insightsDays: 90,
  },
}

export const PRICING = {
  monthly: { planId: 'pro' as PlanId, amount: 349, label: '₹349 / month', billing: 'monthly' },
  annual:  { planId: 'pro' as PlanId, amount: 299, label: '₹299 / month · billed ₹3,588 / year', billing: 'annual', totalAmount: 3588 },
}

export function getPlanLabel(planId: PlanId) {
  return planId === 'pro' ? 'Pro' : 'Free'
}
