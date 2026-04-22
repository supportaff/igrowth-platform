import { MessageSquare, Users, BarChart3, Link2, ShieldCheck, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Conversation Flows',
    desc: 'Build multi-step DM journeys — not just one-shot replies. Ask questions, save answers, assign tags, and deliver links in a single automated flow.',
    tag: 'Core',
  },
  {
    icon: Users,
    title: 'Follower CRM',
    desc: 'Every follower becomes a contact. See DM history, tags, source post, and last interaction. Segment by intent and re-engage with precision.',
    tag: 'Differentiator',
  },
  {
    icon: BarChart3,
    title: 'Content → Conversion Analytics',
    desc: 'Know exactly which Reel, Post, or Story generated leads and revenue. Track the full path from engagement to purchase.',
    tag: 'New',
  },
  {
    icon: Link2,
    title: 'Smart Link Delivery',
    desc: 'Auto-tracked links per automation. See who clicked, from which content, with optional expiry and usage limits.',
    tag: 'New',
  },
  {
    icon: ShieldCheck,
    title: 'Safe Automation Rules',
    desc: 'Built-in delay controls, daily throttling, duplicate prevention, and manual approval mode. Automation that respects Instagram limits.',
    tag: 'Built-in',
  },
  {
    icon: RefreshCw,
    title: 'Re-engagement Campaigns',
    desc: 'Segment people who asked for price but didn\'t buy. Send targeted follow-ups manually or via rules — no AI required.',
    tag: 'Growth',
  },
]

const tagColor: Record<string, string> = {
  Core:          'bg-brand-500/15 text-brand-300 border-brand-500/30',
  Differentiator:'bg-green-500/15 text-green-300 border-green-500/30',
  New:           'bg-accent-500/15 text-accent-300 border-accent-500/30',
  'Built-in':    'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Growth:        'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
}

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Everything you need to <span className="gradient-text">monetize Instagram</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Six focused modules. No bloat. Each one built around creator revenue.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="card-glass p-6 hover:bg-white/8 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center group-hover:bg-brand-500/25 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColor[tag]}`}>{tag}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
