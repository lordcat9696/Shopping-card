import { Button } from '@/components/ui/button'

export function ReusableBanner() {
  return (
    <section className="relative py-[clamp(56px,8vw,104px)] bg-primary text-bg overflow-hidden">
      <div className="absolute -left-[120px] -top-[120px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(197,225,122,0.22),transparent_65%)]" />
      <div className="absolute -right-[160px] -bottom-[160px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(197,225,122,0.22),transparent_65%)]" />

      <div className="max-w-[1280px] mx-auto px-[clamp(20px,4vw,56px)] grid md:grid-cols-2 gap-14 items-center relative z-[2]">
        <div>
          <span className="font-display font-bold uppercase tracking-[0.24em] text-[12px] text-accent-bright">
            Made to last
          </span>
          <h2 className="font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(48px,7.5vw,128px)] mt-3">
            Reusable<br />
            <em className="not-italic text-accent-bright">essentials.</em>
          </h2>
          <p className="mt-5 max-w-[440px] text-[rgba(244,238,222,0.8)] leading-relaxed text-[16px]">
            Our reusable pads are designed for 200+ wears. Wash cold, hang dry, wear for years — the easiest switch you can make today.
          </p>
          <div className="mt-7">
            <Button>Explore reusables →</Button>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-[20px] flex items-center justify-center
          bg-[radial-gradient(70%_70%_at_50%_45%,rgba(197,225,122,0.35),transparent_65%),linear-gradient(160deg,#2B5340,#0F2418)]">
          <svg viewBox="0 0 300 360" className="w-3/5" aria-hidden>
            <rect x="40" y="40" width="220" height="280" rx="24" fill="#F4EEDE" opacity="0.08" />
            <path d="M70 120 Q150 60 230 120 L220 260 Q185 310 150 310 Q115 310 80 260 Z" fill="#C5E17A" opacity="0.85" />
            <path d="M90 140 Q150 100 210 140 L200 250 Q175 290 150 290 Q125 290 100 250 Z" fill="#1F3D2F" opacity="0.9" />
            <rect x="130" y="190" width="40" height="50" rx="6" fill="#C5E17A" />
          </svg>
        </div>
      </div>
    </section>
  )
}
