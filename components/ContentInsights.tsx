import { TrendingUp, Eye, MousePointerClick, ShoppingBag } from 'lucide-react'

const posts = [
  { name: 'Reel: Pricing Tips', dms: 89, leads: 24, clicks: 61, revenue: '₹18,400', pct: 100 },
  { name: 'Post: Behind the Scenes', dms: 54, leads: 11, clicks: 38, revenue: '₹9,200', pct: 64 },
  { name: 'Story: Flash Sale', dms: 41, leads: 9,  clicks: 29, revenue: '₹7,600', pct: 49 },
  { name: 'Reel: Product Demo', dms: 33, leads: 7,  clicks: 21, revenue: '₹5,100', pct: 38 },
]

export default function ContentInsights() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/30 rounded-full px-4 py-1.5 text-sm text-accent-300 mb-6">
              <TrendingUp className="w-4 h-4" />
              Content → Conversion Analytics
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Know which content
              <br />
              <span className="gradient-text">actually makes money</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Most creators post and hope. iGrowth closes the loop — tracking every DM, click, and purchase back to the exact post that started it.
            </p>
            <div className="space-y-4">
              {[
                { icon: Eye, label: 'Post → DM tracking', desc: 'See which content triggers the most conversations' },
                { icon: MousePointerClick, label: 'Link click attribution', desc: 'Know who clicked, from which post, and when' },
                { icon: ShoppingBag, label: 'Revenue by content', desc: 'Map purchases back to the content that drove them' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-accent-500/15 border border-accent-500/25 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{label}</div>
                    <div className="text-white/50 text-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right mockup */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Top Content This Month</h3>
              <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">Last 30 days</span>
            </div>
            <div className="space-y-4">
              {posts.map(({ name, dms, leads, clicks, revenue, pct }) => (
                <div key={name} className="p-4 bg-white/5 rounded-xl border border-white/8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">{name}</span>
                    <span className="text-sm font-bold text-green-400">{revenue}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mb-3">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-white/40">
                    <span>{dms} DMs</span>
                    <span>{leads} leads</span>
                    <span>{clicks} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
