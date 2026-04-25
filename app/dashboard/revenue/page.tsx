'use client'
import { TrendingUp, ShoppingBag, Users, ArrowUpRight, IndianRupee } from 'lucide-react'

const transactions = [
  { id: 1, buyer: '@anjali_craft',   product: 'Course: Instagram Growth',  amount: '₹2,999', date: 'Today, 9:14am',   source: 'Reel: Pricing Tips',      status: 'completed' },
  { id: 2, buyer: '@meera.coaching', product: 'Coaching Bundle',           amount: '₹4,999', date: 'Today, 8:02am',   source: 'Story: Flash Sale',        status: 'completed' },
  { id: 3, buyer: '@vikas.official', product: 'Template Pack',             amount: '₹999',   date: 'Yesterday',       source: 'Post: Behind the Scenes',  status: 'completed' },
  { id: 4, buyer: '@priya_styles',   product: 'Course: Instagram Growth',  amount: '₹2,999', date: 'Yesterday',       source: 'Reel: Pricing Tips',      status: 'completed' },
  { id: 5, buyer: '@rahul.fitness',  product: 'Template Pack',             amount: '₹999',   date: '2 days ago',      source: 'DM keyword: price',        status: 'pending'   },
  { id: 6, buyer: '@kiran.d2c',      product: 'Coaching Bundle',           amount: '₹4,999', date: '3 days ago',      source: 'Reel: Product Demo',       status: 'completed' },
]

const monthlyRevenue = [
  { month: 'Nov', amt: 34200 }, { month: 'Dec', amt: 51800 }, { month: 'Jan', amt: 47000 },
  { month: 'Feb', amt: 63400 }, { month: 'Mar', amt: 72100 }, { month: 'Apr', amt: 84200 },
]
const maxAmt = Math.max(...monthlyRevenue.map(m => m.amt))

export default function RevenuePage() {
  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue This Month', value: '₹84,200', delta: '+23%', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  icon: IndianRupee },
          { label: 'Total Orders',       value: '28',       delta: '+6',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: ShoppingBag },
          { label: 'Avg. Order Value',   value: '₹3,007',   delta: '+8%',  color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: TrendingUp },
          { label: 'Revenue / Lead',     value: '₹2,216',   delta: '+12%', color: 'text-fuchsia-400',bg: 'bg-fuchsia-500/10',border: 'border-fuchsia-500/20',icon: Users },
        ].map(({ label, value, delta, color, bg, border, icon: Icon }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40 mb-2">{label}</div>
            <div className="text-xs font-medium text-green-400">{delta} vs last month</div>
          </div>
        ))}
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white">Monthly Revenue</h2>
          <span className="text-xs text-white/35">Last 6 months</span>
        </div>
        <div className="flex items-end gap-3 h-36">
          {monthlyRevenue.map(({ month, amt }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-white/40">₹{(amt / 1000).toFixed(0)}K</span>
              <div className="w-full rounded-t-xl bg-gradient-to-t from-amber-500 to-orange-400 transition-all" style={{ height: `${(amt / maxAmt) * 112}px` }} />
              <span className="text-xs text-white/30">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
          <button className="text-xs text-violet-400 hover:underline flex items-center gap-1">Export <ArrowUpRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Buyer', 'Product', 'Amount', 'Source', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 text-xs font-medium text-violet-400">{tx.buyer}</td>
                  <td className="px-5 py-4 text-xs text-white/70 max-w-[160px] truncate">{tx.product}</td>
                  <td className="px-5 py-4 text-xs font-bold text-amber-400">{tx.amount}</td>
                  <td className="px-5 py-4 text-xs text-white/40 max-w-[140px] truncate">{tx.source}</td>
                  <td className="px-5 py-4 text-xs text-white/35 whitespace-nowrap">{tx.date}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      tx.status === 'completed'
                        ? 'bg-green-500/15 text-green-300 border-green-500/25'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                    }`}>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
