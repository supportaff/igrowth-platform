'use client'
import { useState } from 'react'
import { Search, Users, TrendingUp, Star, ShoppingBag } from 'lucide-react'

const followers = [
  { id: 1, handle: '@priya_styles',    name: 'Priya Sharma',   tag: 'Hot Lead', spent: '₹0',      dms: 4,  joined: 'Apr 23', avatar: 'P', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25' },
  { id: 2, handle: '@rahul.fitness',   name: 'Rahul Kumar',    tag: 'Lead',     spent: '₹0',      dms: 2,  joined: 'Apr 22', avatar: 'R', tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { id: 3, handle: '@anjali_craft',    name: 'Anjali Singh',   tag: 'Buyer',    spent: '₹4,200',  dms: 6,  joined: 'Apr 20', avatar: 'A', tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { id: 4, handle: '@kiran.d2c',       name: 'Kiran Patel',    tag: 'Lead',     spent: '₹0',      dms: 1,  joined: 'Apr 19', avatar: 'K', tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { id: 5, handle: '@meera.coaching',  name: 'Meera Nair',     tag: 'Buyer',    spent: '₹12,800', dms: 9,  joined: 'Apr 15', avatar: 'M', tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { id: 6, handle: '@sanjay_ecom',     name: 'Sanjay Mehta',   tag: 'Hot Lead', spent: '₹0',      dms: 3,  joined: 'Apr 14', avatar: 'S', tagColor: 'bg-red-500/15 text-red-300 border-red-500/25' },
  { id: 7, handle: '@divya.wellness',  name: 'Divya Reddy',    tag: 'Lead',     spent: '₹0',      dms: 2,  joined: 'Apr 12', avatar: 'D', tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { id: 8, handle: '@arun_techbiz',    name: 'Arun Krishnan',  tag: 'Buyer',    spent: '₹8,500',  dms: 7,  joined: 'Apr 10', avatar: 'A', tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
  { id: 9, handle: '@neha.creator',    name: 'Neha Gupta',     tag: 'Lead',     spent: '₹0',      dms: 1,  joined: 'Apr 8',  avatar: 'N', tagColor: 'bg-brand-500/15 text-brand-300 border-brand-500/25' },
  { id: 10,handle: '@vimal_auto',      name: 'Vimal Raj',      tag: 'Buyer',    spent: '₹6,300',  dms: 5,  joined: 'Apr 5',  avatar: 'V', tagColor: 'bg-green-500/15 text-green-300 border-green-500/25' },
]

const tagFilters = ['All', 'Hot Lead', 'Lead', 'Buyer']

export default function FollowersPage() {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('All')

  const filtered = followers.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.handle.includes(search.toLowerCase())
    const matchTag = tagFilter === 'All' || f.tag === tagFilter
    return matchSearch && matchTag
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Followers CRM</h2>
        <p className="text-xs text-white/40 mt-0.5">Track leads, buyers and interactions from your Instagram followers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Followers', value: '12,480', icon: Users,       color: 'text-brand-400',  bg: 'bg-brand-500/10',  border: 'border-brand-500/20' },
          { label: 'Leads',           value: '284',    icon: TrendingUp,  color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
          { label: 'Buyers',          value: '97',     icon: ShoppingBag, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
          { label: 'Hot Leads',       value: '42',     icon: Star,        color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`rounded-2xl p-4 border ${bg} ${border}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-white/50">{label}</span>
            </div>
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or handle..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50"
          />
        </div>
        <div className="flex gap-2">
          {tagFilters.map(t => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`text-xs px-3 py-2 rounded-xl border transition-colors ${
                tagFilter === t
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                  : 'text-white/40 border-white/10 hover:text-white bg-white/5'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 border-b border-white/8 text-xs text-white/30 font-medium">
          <div className="col-span-2">Follower</div>
          <div>Tag</div>
          <div>Revenue</div>
          <div>DMs</div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(f => (
            <div key={f.id} className="grid sm:grid-cols-5 gap-4 items-center px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="sm:col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/40 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {f.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{f.name}</div>
                  <div className="text-xs text-white/40">{f.handle} · {f.joined}</div>
                </div>
              </div>
              <div><span className={`text-xs px-2.5 py-1 rounded-full border ${f.tagColor}`}>{f.tag}</span></div>
              <div className="text-sm font-semibold text-green-400">{f.spent}</div>
              <div className="text-sm text-white/60">{f.dms} DMs</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
