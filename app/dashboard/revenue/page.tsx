'use client'
import { TrendingUp, ShoppingBag, Users, ArrowUpRight } from 'lucide-react'

const transactions = [
  { id: 1, buyer: 'Meera Nair',    handle: '@meera.coaching',  product: 'Course Bundle',      amount: '₹12,800', date: 'Apr 23', source: 'DM Keyword Flow',     status: 'Paid' },
  { id: 2, buyer: 'Anjali Singh',  handle: '@anjali_craft',    product: 'Starter Pack',       amount: '₹4,200',  date: 'Apr 22', source: 'Post Comment Flow',   status: 'Paid' },
  { id: 3, buyer: 'Arun Krishnan', handle: '@arun_techbiz',    product: 'Premium Plan',       amount: '₹8,500',  date: 'Apr 20', source: 'Story Reply Flow',    status: 'Paid' },
  { id: 4, buyer: 'Vimal Raj',     handle: '@vimal_auto',      product: 'Starter Pack',       amount: '₹6,300',  date: 'Apr 18', source: 'DM Keyword Flow',     status: 'Paid' },
  { id: 5, buyer: 'Neha Gupta',    handle: '@neha.creator',    product: 'Flash Sale Bundle',  amount: '₹3,100',  date: 'Apr 15', source: 'Manual Broadcast',    status: 'Paid' },
  { id: 6, buyer: 'Kiran Patel',   handle: '@kiran.d2c',       product: 'Course Bundle',      amount: '₹12,800', date: 'Apr 12', source: 'DM Keyword Flow',     status: 'Pending' },
  { id: 7, buyer: 'Priya Sharma',  handle: '@priya_styles',    product: 'Starter Pack',       amount: '₹4,200',  date: 'Apr 10', source: 'Reel Comment Flow',   status: 'Pending' },
]

const revenueBySource = [
  { source: 'DM Keyword Flow',    amount: '₹32,400', pct: 100, color: 'from-brand-500 to-brand-400' },
  { source: 'Post Comment Flow',  amount: '₹19,200', pct: 59,  color: 'from-accent-500 to-purple-500' },
  { source: 'Story Reply Flow',   amount: '₹14,800', pct: 46,  color: 'from-green-500 to-emerald-400' },
  { source: 'Manual Broadcast',   amount: '₹9,600',  pct: 30,  color: 'from-yellow-500 to-orange-400' },
  { source: 'Reel Comment Flow',  amount: '₹8,200',  pct: 25,  color: 'from-red-500 to-pink-400' },
]

export default function RevenuePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Revenue</h2>
        <p className="text-xs text-white/40 mt-0.5">Sales tracked through iGrowth automation flows</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue',  value: '₹84,200',  delta: '+23%', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Total Buyers',     value: '97',        delta: '+11%', color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
          { label: 'Avg Order Value',  value: '₹3,840',   delta: '+4%',  color: 'text-brand-400',  bg: 'bg-brand-500/10',  border: 'border-brand-500/20' },
          { label: 'Conv. Rate',       value: '13.6%',     delta: '+2%',  color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
        ].map(({ label, value, delta, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/50 mb-2">{label}</div>
            <div className="text-xs font-semibold text-green-400">{delta} vs last month</div>
          </div>
        ))}
      </div>

      {/* Revenue by source */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-5">Revenue by Automation Source</h3>
        <div className="space-y-4">
          {revenueBySource.map(({ source, amount, pct, color }) => (
            <div key={source}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">{source}</span>
                <span className="text-sm font-bold text-white">{amount}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
          <button className="text-xs text-brand-400 hover:underline flex items-center gap-1">
            Export CSV <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {t.buyer[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{t.buyer}</div>
                <div className="text-xs text-white/40">{t.handle} · {t.source}</div>
              </div>
              <div className="hidden sm:block text-xs text-white/40">{t.product}</div>
              <div className="hidden sm:block text-xs text-white/30">{t.date}</div>
              <div className="text-sm font-bold text-yellow-400">{t.amount}</div>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                t.status === 'Paid'
                  ? 'bg-green-500/15 text-green-300 border-green-500/25'
                  : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25'
              }`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
