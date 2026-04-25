'use client'
import { Plus, Link2, ExternalLink } from 'lucide-react'

const products = [
  { id: 1, name: 'Course Bundle',      price: '₹12,800', link: 'igrowth.app/p/course',   clicks: 284, sales: 22, active: true  },
  { id: 2, name: 'Premium Plan',       price: '₹8,500',  link: 'igrowth.app/p/premium',  clicks: 196, sales: 15, active: true  },
  { id: 3, name: 'Starter Pack',       price: '₹4,200',  link: 'igrowth.app/p/starter',  clicks: 312, sales: 38, active: true  },
  { id: 4, name: 'Flash Sale Bundle',  price: '₹3,100',  link: 'igrowth.app/p/flash',    clicks: 89,  sales: 12, active: false },
]

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Products & Links</h2>
          <p className="text-xs text-white/40 mt-0.5">Manage shareable product links sent via automation</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-base font-bold text-white">{p.name}</div>
                <div className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />{p.link}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${
                p.active
                  ? 'bg-green-500/15 text-green-300 border-green-500/25'
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}>{p.active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="font-bold text-yellow-400">{p.price}</div>
                <div className="text-xs text-white/30">price</div>
              </div>
              <div>
                <div className="font-bold text-brand-400">{p.clicks}</div>
                <div className="text-xs text-white/30">clicks</div>
              </div>
              <div>
                <div className="font-bold text-green-400">{p.sales}</div>
                <div className="text-xs text-white/30">sales</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
