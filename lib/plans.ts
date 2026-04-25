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

export interface PricingOption {
  planId: PlanId
  billing: 'monthly' | 'annual'
  amount: number          // per-month display price
  totalAmount: number     // actual charge amount (349 for monthly, 3588 for annual)
  label: string
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

export const PRICING: Record<'monthly' | 'annual', PricingOption> = {
  monthly: {
    planId:      'pro',
    billing:     'monthly',
    amount:      349,
    totalAmount: 349,
    label:       '\u20b9349 / month',
  },
  annual: {
    planId:      'pro',
    billing:     'annual',
    amount:      299,
    totalAmount: 3588,
    label:       '\u20b9299 / month \u00b7 billed \u20b93,588 / year',
  },
}

export function getPlanLabel(planId: PlanId) {
  return planId === 'pro' ? 'Pro' : 'Free'
}
