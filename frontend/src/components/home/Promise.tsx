import { Leaf, ShieldCheck, Globe2, Sliders } from 'lucide-react'

const items = [
  { Icon: Leaf, title: 'Carbon-neutral shipping', body: 'Every order offset at no extra cost to you — always.' },
  { Icon: ShieldCheck, title: '365-day returns', body: 'Try it for a full year. Free returns in all 50 states.' },
  { Icon: Globe2, title: 'Made responsibly', body: 'Small-batch production with fair-wage partners in Porto.' },
  { Icon: Sliders, title: 'Transparent pricing', body: 'Honest margins, always. See exactly what you’re paying for.' },
]

export function Promise() {
  return (
    <section className="bg-bg border-t border-border-soft">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
        {items.map(({ Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-2.5">
            <span className="w-11 h-11 rounded-full bg-accent-bright inline-flex items-center justify-center text-primary">
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <h3 className="font-display font-extrabold uppercase tracking-wider text-[14px] text-primary">{title}</h3>
            <p className="text-[13px] text-muted leading-snug">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
