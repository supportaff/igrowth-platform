'use client'
import { useState } from 'react'
import { Search, Users, UserCheck, TrendingUp, ArrowUpRight } from 'lucide-react'

const followers = [
  { id: 1,  handle: '@priya_styles',   name: 'Priya Sharma',   tag: 'Hot Lead', followers: '12.4K', engagement: '4.8%',  joined: '2d ago',  tagColor: 'bg-red-500/15 text-red-300 border-red-500/25' },
  { id: 2,  handle: '@rahul.fitness',  name: 'Rahul Kumar',    tag: 'Lead',     followers: '8.1K',  engagement: '3.2%',  joined: '3d ago',  tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { id: 3,  handle: '@anjali_craft',   name: 'Anjali Verma',   tag: 'Buyer',    followers: '5.6K',  engagement: '6.1%',  joined: '5d ago',  tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { id: 4,  handle: '@kiran.d2c',      name: 'Kiran Desai',    tag: 'Lead',     followers: '22K',   engagement: '2.9%',  joined: '1w ago',  tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { id: 5,  handle: '@meera.coaching', name: 'Meera Rao',      tag: 'Buyer',    followers: '31K',   engagement: '5.4%',  joined: '1w ago',  tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { id: 6,  handle: '@suresh.brand',   name: 'Suresh Mehta',   tag: 'Lead',     followers: '4.2K',  engagement: '2.1%',  joined: '2w ago',  tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { id: 7,  handle: '@neha_wellness',  name: 'Neha Joshi',     tag: 'Lead',     followers: '9.8K',  engagement: '3.7%',  joined: '2w ago',  tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  { id: 8,  handle: '@vikas.official', name: 'Vikas Malhotra', tag: 'Buyer',    followers: '15.2K', engagement: '4.2%',  joined: '3w ago',  tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
]

const TAGS = ['All', 'Hot Lead', 'Lead', 'Buyer']

export default function FollowersPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const filtered = followers.filter(f => {
    const matchTag = activeTag === 'All' || f.tag === activeTag
    const matchSearch = f.handle.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Followers',  value: '24.8K', delta: '+847 this week',  color: 'text-violet-400', icon: Users },
          { label: 'Following Back',   value: '1,204', delta: '4.8% follow-back', color: 'text-fuchsia-400', icon: UserCheck },
          { label: 'Avg. Engagement',  value: '4.1%',  delta: '+0.3% vs last mo', color: 'text-green-400',  icon: TrendingUp },
        ].map(({ label, value, delta, color, icon: Icon }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-2xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40 mb-1">{label}</div>
            <div className="text-xs text-green-400">{delta}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search followers..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all ${
                activeTag === tag
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/4 text-white/40 border-white/10 hover:bg-white/8 hover:text-white'
              }`}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Follower', 'Followers', 'Engagement', 'Tag', 'Joined', ''].map(h => (
                  <th key={h} className="text-left text-xs text-white/35 font-medium px-5 py-3.5 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center text-xs font-bold border border-white/10 flex-shrink-0">
                        {f.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{f.handle}</p>
                        <p className="text-xs text-white/35">{f.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/60">{f.followers}</td>
                  <td className="px-5 py-4 text-xs text-green-400 font-medium">{f.engagement}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${f.tagColor}`}>{f.tag}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/35">{f.joined}</td>
                  <td className="px-5 py-4">
                    <button className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                      DM <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-8 h-8 text-white/15 mb-3" />
            <p className="text-sm text-white/30">No followers found</p>
          </div>
        )}
      </div>
    </div>
  )
}
