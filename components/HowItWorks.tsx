const steps = [
  {
    num: '01',
    title: 'Connect Instagram',
    desc: 'Link your Instagram Business Account in one click. Token health is monitored 24/7 with instant reconnect alerts.',
  },
  {
    num: '02',
    title: 'Build a Conversation Flow',
    desc: 'Use the visual step builder: set a trigger (comment, DM keyword, story reply), then chain messages, questions, tags, and links.',
  },
  {
    num: '03',
    title: 'Capture Leads Automatically',
    desc: 'Every reply is saved to your Follower CRM with source, tags, and conversation history — ready to segment and re-engage.',
  },
  {
    num: '04',
    title: 'Track What Makes Money',
    desc: 'Content Insights show which posts drove the most DMs, leads, and purchases. Focus on what actually converts.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Up and running in <span className="gradient-text">under 5 minutes</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No technical setup. No learning curve. Just connect and convert.
          </p>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-5 glow-sm">
                  <span className="text-2xl font-extrabold gradient-text">{num}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
