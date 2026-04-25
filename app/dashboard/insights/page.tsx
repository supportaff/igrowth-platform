'use client'
import { TrendingUp, Eye, Heart, MessageCircle, BarChart3 } from 'lucide-react'

const posts = [
  { name: 'Reel: Pricing Tips',       type: 'Reel',  views: '48.2K', likes: '3.1K', comments: 89,  dms: 89,  leads: 24, revenue: '₹18,400', engRate: '8.6%', pct: 100 },
  { name: 'Post: Behind the Scenes',  type: 'Post',  views: '21.4K', likes: '1.8K', comments: 54,  dms: 54,  leads: 11, revenue: '₹9,200',  engRate: '6.2%', pct: 64  },
  { name: 'Story: Flash Sale',        type: 'Story', views: '16.8K', likes: '980',  comments: 41,  dms: 41,  leads: 9,  revenue: '₹7,600',  engRate: '5.8%', pct: 49  },
  { name: 'Reel: Product Demo',       type: 'Reel',  views: '12.3K', likes: '740',  comments: 33,  dms: 33,  leads: 7,  revenue: '₹5,100',  engRate: '4.4%', pct: 38  },
  { name: 'Post: Customer Review',    type: 'Post',  views: '9.1K',  likes: '520',  comments: 21,  dms: 21,  leads: 4,  revenue: '₹3,200',  engRate: '3.8%', pct: 27  },
  { name: 'Reel: Day in My Life',     type: 'Reel',  views: '7.6K',  likes: '610',  comments: 18,  dms: 18,  leads: 3,  revenue: '₹2,100',  engRate: '3.4%', pct: 20  },
]

const typeColor: Record<string, string> = {
  Reel:  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  Post:  'bg-blue-500/15 text-blue-300 border-blue-500/25',
  Story: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
}

const monthlyBar = [
  { month: 'Nov', reach: 32 },
  { month: 'Dec', reach: 45 },
  { month: 'Jan', reach: 38 },
  { month: 'Feb', reach: 61 },
  { month: 'Mar', reach: 72 },
  { month: 'Apr', reach: 88 },
]

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Content Insights</h2>
        <p className="text-xs text-white/40 mt-0.5">Performance breakdown for your Instagram content this month</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach',       value: '115.4K', icon: Eye,           color: 'text-brand-400',  bg: 'bg-brand-500/10',  border: 'border-brand-500/20' },
          { label: 'Total Likes',       value: '7.7K',   icon: Heart,         color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'   },
          { label: 'DMs Generated',     value: '254',    icon: MessageCircle, color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
          { label: 'Avg. Eng. Rate',    value: '5.4%',   icon: TrendingUp,    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-5 border ${bg} ${border}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-xs text-white/40">{label}</span>
            </div>
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Reach trend bar chart (CSS) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-6">Monthly Reach Growth (K)</h3>
        <div className="flex items-end gap-3 h-32">
          {monthlyBar.map(({ month, reach }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-white/40">{reach}K</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all"
                style={{ height: `${(reach / 88) * 100}%` }}
              />
              <span className="text-xs text-white/30">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="text-sm font-bold text-white">Top Performing Content</h3>
        </div>
        <div className="divide-y divide-white/5">
          {posts.map((p, i) => (
            <div key={p.name} className="px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-white/30 w-4">#{i + 1}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor[p.type]}`}>{p.type}</span>
                <span className="text-sm font-medium text-white flex-1">{p.name}</span>
                <span className="text-sm font-bold text-green-400">{p.revenue}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mb-3 ml-7">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${p.pct}%` }} />
              </div>
              <div className="flex gap-4 ml-7 text-xs text-white/35">
                <span>👁 {p.views}</span>
                <span>❤️ {p.likes}</span>
                <span>💬 {p.comments}</span>
                <span>📩 {p.dms} DMs</span>
                <span>🎯 {p.leads} leads</span>
                <span className="text-accent-400">{p.engRate} eng.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
