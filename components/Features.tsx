import { MessageCircle, Briefcase, Calendar, BarChart3, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Instagram DM Inbox',
    desc: 'Manage all your Instagram conversations in one place. Reply, tag, and track every DM without leaving the dashboard.',
    color: '#00ADB5',
  },
  {
    icon: Briefcase,
    title: 'Brand Deal CRM',
    desc: 'Track every collab from first contact to payment. Manage leads, negotiations, deliverables, and follow-ups.',
    color: '#00ADB5',
  },
  {
    icon: Calendar,
    title: 'Campaign Planner',
    desc: 'Plan shoots, draft deadlines, posting dates, and payment follow-ups on a drag-and-drop calendar.',
    color: '#00ADB5',
  },
  {
    icon: Zap,
    title: 'DM Automations',
    desc: 'Auto-reply to keywords, story mentions, and comments. Send personalised follow-ups on autopilot.',
    color: '#00ADB5',
  },
  {
    icon: BarChart3,
    title: 'Content Insights',
    desc: 'See which posts drive the most DMs, profile visits, and follower growth — with actionable breakdowns.',
    color: '#00ADB5',
  },
  {
    icon: Shield,
    title: 'Safe & Compliant',
    desc: 'Built on the official Instagram API. No password sharing, no bots, no risk to your account.',
    color: '#00ADB5',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ background: '#222831', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800,
            color: '#EEEEEE', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Everything a creator needs
          </h2>
          <p style={{ color: 'rgba(238,238,238,0.45)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            One platform to manage your audience, deals, and growth.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              style={{ background: '#393E46', border: '1px solid rgba(238,238,238,0.08)',
                borderRadius: 16, padding: '28px 24px',
                transition: 'border-color 200ms, transform 200ms' }}
              className="hover:border-[#00ADB5]/40 hover:-translate-y-0.5">
              <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 18,
                background: 'rgba(0,173,181,0.12)', display: 'flex',
                alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 20, height: 20, color: '#00ADB5' }} />
              </div>
              <h3 style={{ color: '#EEEEEE', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'rgba(238,238,238,0.5)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
