const steps = [
  { num: '01', title: 'Connect Instagram', desc: 'Link your account via the official Meta API. Setup takes under 2 minutes — no passwords, no risk.' },
  { num: '02', title: 'Set up automations', desc: 'Choose triggers: keywords, story replies, comment reactions. Afforal handles the rest 24/7.' },
  { num: '03', title: 'Manage brand deals', desc: 'Add incoming brand leads, move them through your pipeline, and never miss a follow-up again.' },
  { num: '04', title: 'Watch your growth', desc: 'Track DM conversions, engagement trends, and top-performing content from your insights dashboard.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: '#2c3340', padding: '80px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800,
            color: '#EEEEEE', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Up and running in minutes
          </h2>
          <p style={{ color: 'rgba(238,238,238,0.45)', fontSize: 16 }}>No technical knowledge needed.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 24 }}>
          {steps.map(s => (
            <div key={s.num}
              style={{ background: '#393E46', border: '1px solid rgba(238,238,238,0.08)',
                borderRadius: 16, padding: '28px 22px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00ADB5',
                marginBottom: 14, letterSpacing: '-1px' }}>{s.num}</div>
              <h3 style={{ color: '#EEEEEE', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'rgba(238,238,238,0.45)', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
