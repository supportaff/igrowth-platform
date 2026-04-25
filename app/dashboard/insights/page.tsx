'use client'
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, ArrowUpRight } from 'lucide-react'

const contentData = [
  { name: 'Reel: Pricing Tips',         type: 'Reel',  views: '48.2K', likes: '3.1K', comments: 412, dms: 89,  leads: 24, revenue: '₹18,400', engRate: '7.4%' },
  { name: 'Post: Behind the Scenes',    type: 'Post',  views: '21.4K', likes: '1.8K', comments: 203, dms: 54,  leads: 11, revenue: '₹9,200',  engRate: '9.4%' },
  { name: 'Story: Flash Sale',          type: 'Story', views: '14.1K', likes: '—',   comments: 87,  dms: 41,  leads: 9,  revenue: '₹7,600',  engRate: '9.1%' },
  { name: 'Reel: Product Demo',         type: 'Reel',  views: '32.8K', likes: '2.4K', comments: 318, dms: 33,  leads: 7,  revenue: '₹5,100',  engRate: '8.3%' },
  { name: 'Post: Client Testimonial',   type: 'Post',  views: '9.8K',  likes: '890',  comments: 76,  dms: 21,  leads: 5,  revenue: '₹3,400',  engRate: '9.9%' },
  { name: 'Reel: Tips & Tricks',        type: 'Reel',  views: '61.3K', likes: '4.2K', comments: 521, dms: 18,  leads: 3,  revenue: '₹2,100',  engRate: '7.7%' },
]

const weeklyDMs = [
  { day: 'Mon', count: 18 }, { day: 'Tue', count: 32 }, { day: 'Wed', count: 27 },
  { day: 'Thu', count: 45 }, { day: 'Fri', count: 38 }, { day: 'Sat', count: 22 }, { day: 'Sun', count: 15 },
]
const maxDMs = Math.max(...weeklyDMs.map(d => d.count))

export default function InsightsPage() {
  return (
    <div className="space-y-6">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach',     value: '188K',  delta: '+14%', icon: Eye,           color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
          { label: 'Total Likes',     value: '12.4K', delta: '+9%',  icon: Heart,         color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
          { label: 'Total DMs',       value: '256',   delta: '+22%', icon: MessageCircle, color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
          { label: 'Avg. Eng. Rate',  value: '8.6%',  delta: '+1.2%',icon: TrendingUp,    color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
        ].map(({ label, value, delta, icon: Icon, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40 mb-2">{label}</div>
            <div className="text-xs font-medium text-green-400">{delta} this month</div>
          </div>
        ))}
      </div>

      {/* DMs bar chart (CSS-only) */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white">DMs This Week</h2>
          <span className="text-xs text-white/35">197 total</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {weeklyDMs.map(({ day, count }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs text-white/40">{count}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-fuchsia-400 transition-all" style={{ height: `${(count / maxDMs) * 96}px` }} />
              <span className="text-xs text-white/30">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content performance table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-bold text-white">Content Performance</h2>
          <BarChart3 className="w-4 h-4 text-white/30" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Content', 'Type', 'Views', 'Likes', 'DMs', 'Leads', 'Revenue', 'Eng. Rate'].map(h => (
                  <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contentData.map(row => (
                <tr key={row.name} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 text-xs font-medium text-white max-w-[180px] truncate">{row.name}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      row.type === 'Reel' ? 'bg-violet-500/15 text-violet-300 border-violet-500/25'
                      : row.type === 'Story' ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25'
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/25'
                    }`}>{row.type}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/60">{row.views}</td>
                  <td className="px-5 py-4 text-xs text-white/60">{row.likes}</td>
                  <td className="px-5 py-4 text-xs text-violet-400 font-medium">{row.dms}</td>
                  <td className="px-5 py-4 text-xs text-fuchsia-400 font-medium">{row.leads}</td>
                  <td className="px-5 py-4 text-xs text-green-400 font-bold">{row.revenue}</td>
                  <td className="px-5 py-4 text-xs text-amber-400">{row.engRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
