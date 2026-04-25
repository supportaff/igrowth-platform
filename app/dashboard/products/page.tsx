'use client'
import { useState } from 'react'
import { Plus, ExternalLink, Edit2, Trash2, Link2, ShoppingBag, Copy, CheckCheck } from 'lucide-react'

const products = [
  { id: 1, name: 'Course: Instagram Growth',  type: 'Course',   price: '₹2,999', sales: 18, link: 'igrowth.app/p/ig-course',  status: 'active' },
  { id: 2, name: 'Coaching Bundle',            type: 'Service',  price: '₹4,999', sales: 6,  link: 'igrowth.app/p/coaching',   status: 'active' },
  { id: 3, name: 'Template Pack',              type: 'Digital',  price: '₹999',   sales: 24, link: 'igrowth.app/p/templates',  status: 'active' },
  { id: 4, name: 'Masterclass: Reels Strategy',type: 'Course',   price: '₹1,499', sales: 0,  link: 'igrowth.app/p/reels-mc',   status: 'draft'  },
]

const typeColor: Record<string, string> = {
  Course:  'bg-violet-500/15 text-violet-300 border-violet-500/25',
  Service: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25',
  Digital: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
}

export default function ProductsPage() {
  const [copied, setCopied] = useState<number | null>(null)

  function copyLink(id: number, link: string) {
    navigator.clipboard.writeText('https://' + link).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Products', value: products.filter(p => p.status === 'active').length, color: 'text-violet-400' },
          { label: 'Total Sales',     value: products.reduce((s, p) => s + p.sales, 0),          color: 'text-green-400' },
          { label: 'Smart Links',     value: products.length,                                     color: 'text-fuchsia-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Products & Smart Links</h2>
        <button className="flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/20">
          <Plus className="w-3.5 h-3.5" /> Add product
        </button>
      </div>

      {/* Product cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/6 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">{p.name}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${typeColor[p.type]}`}>{p.type}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 mt-1 ${
                p.status === 'active'
                  ? 'bg-green-500/15 text-green-300 border-green-500/25'
                  : 'bg-white/5 text-white/35 border-white/10'
              }`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-lg font-extrabold text-amber-400">{p.price}</p>
                <p className="text-xs text-white/35">{p.sales} sales</p>
              </div>
            </div>

            {/* Smart link */}
            <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/8 rounded-xl">
              <Link2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <span className="text-xs text-white/45 truncate flex-1 font-mono">{p.link}</span>
              <button onClick={() => copyLink(p.id, p.link)}
                className="flex-shrink-0 text-white/35 hover:text-violet-400 transition-colors p-1" aria-label="Copy link">
                {copied === p.id ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a href={`https://${p.link}`} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-white/35 hover:text-violet-400 transition-colors p-1" aria-label="Open link">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white hover:bg-white/8 px-3 py-1.5 rounded-lg transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
