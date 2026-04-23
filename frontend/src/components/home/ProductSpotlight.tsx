import { Button } from '@/components/ui/button'

export function ProductSpotlight() {
  return (
    <section className="py-[clamp(56px,8vw,104px)] bg-[#EAE1C7]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid md:grid-cols-2 gap-14 items-center">
        <div className="relative aspect-square rounded-[20px] flex items-center justify-center
          bg-[radial-gradient(80%_80%_at_50%_50%,#F4EEDE_0,transparent_70%),linear-gradient(160deg,#D9CAA4,#B89E6F)]">
          <svg viewBox="0 0 300 300" className="w-[62%]" aria-hidden>
            <ellipse cx="150" cy="270" rx="100" ry="10" fill="#1F3D2F" opacity="0.2" />
            <path d="M60 80 Q150 20 240 80 Q250 180 220 240 Q185 270 150 270 Q115 270 80 240 Q50 180 60 80 Z" fill="#1F3D2F" />
            <path d="M80 100 Q150 50 220 100 Q225 170 200 220 Q175 245 150 245 Q125 245 100 220 Q75 170 80 100 Z" fill="#2D5A41" />
            <path d="M130 140 L170 140 L165 200 L135 200 Z" fill="#C5E17A" />
          </svg>
          <Callout position="top-[16%] left-[-18px]">Leak-free lining</Callout>
          <Callout position="top-[48%] right-[-24px]">All-day comfort</Callout>
          <Callout position="bottom-[14%] left-[10%]">Soft bonded seams</Callout>
        </div>

        <div>
          <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-primary/60">
            Signature style
          </span>
          <h2 className="font-display font-black uppercase text-primary text-[clamp(36px,5vw,72px)] leading-[0.96] tracking-[-0.015em] mt-3">
            Leak-free comfort protection.
          </h2>
          <p className="mt-4 text-muted max-w-[440px] leading-relaxed text-[16px]">
            Our hero pair combines a four-layer core with ultralight organic cotton — designed to feel invisible and look effortlessly clean.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-4">
            <Spec k="12h" v="Dry-feel wear" />
            <Spec k="0%" v="Plastic in fabric" />
            <Spec k="4" v="Absorbency layers" />
          </div>

          <div className="flex gap-3.5 mt-7 flex-wrap">
            <Button variant="primaryDark">Add to cart — $34</Button>
            <Button variant="ghostDark">See details</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Callout({ children, position }: { children: React.ReactNode; position: string }) {
  return (
    <div className={`absolute ${position} bg-white text-primary font-display text-[11px] font-bold uppercase tracking-wider py-2.5 px-3.5 rounded-full shadow-[0_6px_18px_rgba(31,61,47,0.12)] flex items-center gap-2 whitespace-nowrap`}>
      <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />
      {children}
    </div>
  )
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-white/60 border border-border-soft rounded-xl p-4">
      <div className="font-display font-extrabold text-xl text-primary">{k}</div>
      <div className="text-xs text-muted mt-1">{v}</div>
    </div>
  )
}
